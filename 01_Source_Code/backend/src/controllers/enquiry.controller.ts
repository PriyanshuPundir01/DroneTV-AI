import { Request, Response, NextFunction } from 'express';
import { EnquiryStore, EnquiryQueryParams } from '../models/enquiry.store';

export async function getEnquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, userType, status, page, limit, sortBy, sortOrder } = req.query as Record<string, string>;

    const queryParams: EnquiryQueryParams = {
      search: search || '',
      userType: userType || 'All',
      status: status || 'All',
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'
    };

    const result = await EnquiryStore.getAll(queryParams);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: result.limit
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getEnquiryById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const enquiry = await EnquiryStore.getById(id);

    if (!enquiry) {
      res.status(404).json({
        success: false,
        message: `Enquiry with ID '${id}' was not found.`
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (err) {
    next(err);
  }
}

export async function createEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, phone, userType, interest, message } = req.body;

    const created = await EnquiryStore.create({
      name,
      email,
      phone,
      userType,
      interest,
      message,
      status: 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our DroneTV representative will contact you soon.',
      data: created
    });
  } catch (err) {
    next(err);
  }
}

export async function updateEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const existing = await EnquiryStore.getById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Cannot update. Enquiry with ID '${id}' was not found.`
      });
      return;
    }

    const updated = await EnquiryStore.update(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await EnquiryStore.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: `Cannot delete. Enquiry with ID '${id}' was not found.`
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry removed successfully.',
      deletedId: id
    });
  } catch (err) {
    next(err);
  }
}

export async function getEnquiryStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await EnquiryStore.getStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}
