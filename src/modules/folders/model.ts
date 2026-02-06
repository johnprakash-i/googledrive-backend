import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId | null;
  isDeleted: boolean;
  isStarred: boolean;
  sharedWith: Array<{
    email: string;
    permission: 'VIEW' | 'EDIT';
    sharedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    isDeleted: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    sharedWith: [
      {
        email: { type: String, required: true },
        permission: { type: String, enum: ['VIEW', 'EDIT'], required: true },
        sharedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// Index for faster queries
folderSchema.index({ ownerId: 1, isDeleted: 1 });
folderSchema.index({ parentId: 1, isDeleted: 1 });
folderSchema.index({ ownerId: 1, isStarred: 1 });

export default mongoose.model<IFolder>('Folder', folderSchema);