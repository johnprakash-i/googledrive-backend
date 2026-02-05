import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  role: 'USER' | 'ADMIN';
  passwordResetToken?: string;
  passwordResetExpires?: Date;


}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', userSchema);
