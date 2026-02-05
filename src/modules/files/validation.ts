import { z } from 'zod';

export const uploadFileSchema = z.object({
  folderId: z.string().optional(),
});

export const shareFileSchema = z.object({
  email: z.string().email(),
  permission: z.enum(['VIEW', 'EDIT']).optional(),
});
