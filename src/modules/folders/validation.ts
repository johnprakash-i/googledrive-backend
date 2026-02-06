import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(255, 'Folder name is too long'),
  parentId: z.string().optional().nullable(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(255, 'Folder name is too long').optional(),
  parentId: z.string().optional().nullable(),
});

export const shareFolderSchema = z.object({
  email: z.string().email('Invalid email address'),
  permission: z
    .enum(['VIEW', 'EDIT'])
    .refine(val => ['VIEW', 'EDIT'].includes(val), {
      message: 'Permission must be VIEW or EDIT',
    }),
})
const PermissionEnum = z.enum(['VIEW', 'EDIT']);
export const updateSharePermissionSchema = z.object({
  email: z.string().email('Invalid email address'),
  permission: PermissionEnum.refine(
    (val) => ['VIEW', 'EDIT'].includes(val),
    { message: 'Permission must be VIEW or EDIT' }
  ),
});

// ✅ NEW: Remove share access schema
export const removeShareAccessSchema = z.object({
  email: z.string().email('Invalid email address'),
});