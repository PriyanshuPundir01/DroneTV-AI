import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { EnquiryModel, IEnquiry, EnquiryStatus, UserType } from './enquiry.model';

const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'enquiries.json');
const DEFAULT_DATA_FILE = path.join(__dirname, '../data/defaultEnquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure local persistence file exists
if (!fs.existsSync(DATA_FILE)) {
  if (fs.existsSync(DEFAULT_DATA_FILE)) {
    fs.copyFileSync(DEFAULT_DATA_FILE, DATA_FILE);
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readLocalEnquiries(): IEnquiry[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalEnquiries(data: IEnquiry[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export interface EnquiryQueryParams {
  search?: string;
  userType?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface EnquiryStats {
  total: number;
  byStatus: {
    new: number;
    contacted: number;
    inProgress: number;
    closed: number;
  };
  byUserType: {
    student: number;
    customer: number;
    other: number;
  };
  recentCountLast7Days: number;
}

export class EnquiryStore {
  private static isMongo(): boolean {
    return mongoose.connection.readyState === 1;
  }

  static async getAll(params: EnquiryQueryParams): Promise<PaginatedResult<IEnquiry>> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    if (this.isMongo()) {
      const query: any = {};

      if (params.userType && params.userType !== 'All') {
        query.userType = params.userType;
      }

      if (params.status && params.status !== 'All') {
        query.status = params.status;
      }

      if (params.search && params.search.trim()) {
        const regex = new RegExp(params.search.trim(), 'i');
        query.$or = [
          { name: regex },
          { email: regex },
          { phone: regex },
          { interest: regex },
          { message: regex },
          { adminNotes: regex }
        ];
      }

      const sortField = params.sortBy || 'createdAt';
      const sortDirection = params.sortOrder === 'asc' ? 1 : -1;

      const [items, total] = await Promise.all([
        EnquiryModel.find(query)
          .sort({ [sortField]: sortDirection })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        EnquiryModel.countDocuments(query).exec()
      ]);

      const formatted = items.map((doc: any) => ({
        ...doc,
        _id: doc._id.toString()
      }));

      return {
        data: formatted,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        limit
      };
    }

    // Local JSON store fallback
    let items = readLocalEnquiries();

    if (params.userType && params.userType !== 'All') {
      items = items.filter((e) => e.userType.toLowerCase() === params.userType?.toLowerCase());
    }

    if (params.status && params.status !== 'All') {
      items = items.filter((e) => e.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params.search && params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.email.toLowerCase().includes(term) ||
          e.phone.toLowerCase().includes(term) ||
          e.interest.toLowerCase().includes(term) ||
          e.message.toLowerCase().includes(term) ||
          (e.adminNotes && e.adminNotes.toLowerCase().includes(term))
      );
    }

    // Sorting
    items.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return params.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const total = items.length;
    const paginated = items.slice(skip, skip + limit);

    return {
      data: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      limit
    };
  }

  static async getById(id: string): Promise<IEnquiry | null> {
    if (this.isMongo()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const doc = await EnquiryModel.findById(id).lean().exec();
      if (!doc) return null;
      return { ...doc, _id: (doc._id as any).toString() };
    }

    const items = readLocalEnquiries();
    const found = items.find((e) => e._id === id);
    return found || null;
  }

  static async create(payload: Omit<IEnquiry, '_id' | 'createdAt' | 'updatedAt'>): Promise<IEnquiry> {
    if (this.isMongo()) {
      const created = await EnquiryModel.create(payload);
      const plain = created.toObject();
      return { ...plain, _id: plain._id.toString() };
    }

    const items = readLocalEnquiries();
    const now = new Date().toISOString();
    const newEnquiry: IEnquiry = {
      _id: crypto.randomBytes(12).toString('hex'),
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      userType: payload.userType,
      interest: payload.interest,
      message: payload.message,
      status: payload.status || 'New',
      adminNotes: payload.adminNotes || '',
      createdAt: now,
      updatedAt: now
    };

    items.unshift(newEnquiry);
    writeLocalEnquiries(items);
    return newEnquiry;
  }

  static async update(id: string, updateData: Partial<IEnquiry>): Promise<IEnquiry | null> {
    if (this.isMongo()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const updated = await EnquiryModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
        .lean()
        .exec();
      if (!updated) return null;
      return { ...updated, _id: (updated._id as any).toString() };
    }

    const items = readLocalEnquiries();
    const index = items.findIndex((e) => e._id === id);
    if (index === -1) return null;

    const current = items[index];
    const updated: IEnquiry = {
      ...current,
      ...updateData,
      _id: current._id,
      updatedAt: new Date().toISOString()
    };

    items[index] = updated;
    writeLocalEnquiries(items);
    return updated;
  }

  static async delete(id: string): Promise<boolean> {
    if (this.isMongo()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return false;
      const res = await EnquiryModel.findByIdAndDelete(id).exec();
      return !!res;
    }

    const items = readLocalEnquiries();
    const initialLen = items.length;
    const filtered = items.filter((e) => e._id !== id);
    if (filtered.length === initialLen) return false;
    writeLocalEnquiries(filtered);
    return true;
  }

  static async getStats(): Promise<EnquiryStats> {
    const all = await (async () => {
      if (this.isMongo()) {
        return (await EnquiryModel.find().lean().exec()) as unknown as IEnquiry[];
      }
      return readLocalEnquiries();
    })();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats: EnquiryStats = {
      total: all.length,
      byStatus: {
        new: all.filter((e) => e.status === 'New').length,
        contacted: all.filter((e) => e.status === 'Contacted').length,
        inProgress: all.filter((e) => e.status === 'In Progress').length,
        closed: all.filter((e) => e.status === 'Closed').length
      },
      byUserType: {
        student: all.filter((e) => e.userType === 'Student').length,
        customer: all.filter((e) => e.userType === 'Customer').length,
        other: all.filter((e) => e.userType === 'Other').length
      },
      recentCountLast7Days: all.filter((e) => new Date(e.createdAt || 0) >= sevenDaysAgo).length
    };

    return stats;
  }
}
