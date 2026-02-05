import mongoose, { Schema, Document } from 'mongoose';

export interface IFileShare extends Document {
  fileId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  sharedWith: mongoose.Types.ObjectId;
  permission: 'VIEW' | 'EDIT';
}

const shareSchema = new Schema<IFileShare>(
  {
    fileId: { type: Schema.Types.ObjectId, ref: 'File', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    permission: { type: String, enum: ['VIEW', 'EDIT'], default: 'VIEW' },
  },
  { timestamps: true },
);

shareSchema.index({ fileId: 1, sharedWith: 1 }, { unique: true });

export default mongoose.model<IFileShare>('FileShare', shareSchema);
