import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId | null;
  isDeleted: boolean;
}

const folderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<IFolder>('Folder', folderSchema);
