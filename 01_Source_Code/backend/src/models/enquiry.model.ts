import mongoose, { Schema, Document } from 'mongoose';

export type UserType = 'Student' | 'Customer' | 'Other';
export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed';

export interface IEnquiry {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  interest: string;
  message: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IEnquiryDocument extends Document, Omit<IEnquiry, '_id'> {
  _id: mongoose.Types.ObjectId;
}

const EnquirySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Please enter a valid phone number']
    },
    userType: {
      type: String,
      enum: {
        values: ['Student', 'Customer', 'Other'],
        message: '{VALUE} is not a valid user type'
      },
      required: [true, 'User type is required']
    },
    interest: {
      type: String,
      required: [true, 'Service or course of interest is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Closed'],
      default: 'New'
    },
    adminNotes: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexing for search performance
EnquirySchema.index({ name: 'text', email: 'text', interest: 'text', message: 'text' });
EnquirySchema.index({ userType: 1 });
EnquirySchema.index({ status: 1 });
EnquirySchema.index({ createdAt: -1 });

export const EnquiryModel = mongoose.model<IEnquiryDocument>('Enquiry', EnquirySchema);
