export interface CreateFolderDTO {
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderDTO {
  name?: string;
  parentId?: string | null;
}

export interface ShareFolderDTO {
  email: string;
  permission: 'VIEW' | 'EDIT';
}

export interface UpdateSharePermissionDTO {
  email: string;
  permission: 'VIEW' | 'EDIT';
}

// ✅ NEW: Remove share access DTO  
export interface RemoveShareAccessDTO {
  email: string;
}