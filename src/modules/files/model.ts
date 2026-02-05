import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  name: string;
  size: number;
  mimeType: string;
  s3Key: string;
  ownerId: mongoose.Types.ObjectId;
  folderId?: mongoose.Types.ObjectId | null;
  isDeleted: boolean;
}

const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    size: Number,
    mimeType: String,
    s3Key: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<IFile>('File', fileSchema);
