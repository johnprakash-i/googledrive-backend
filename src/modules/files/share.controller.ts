import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { shareFileService, getSharedFilesService } from './share.service';
interface ShareFileParams {
  fileId: string;
}

export const shareFile = async (req: AuthRequest, res: Response) => {
  const { fileId } = req.params;

  if (typeof fileId !== "string") {
    return res.status(400).json({ message: "Invalid fileId" });
  }

  const share = await shareFileService(
    req.user.id,
    fileId, 
    req.body.email,
    req.body.permission,
  );

  res.json({
    success: true,
    message: "File shared successfully",
    data: share,
  });
};


export const listSharedFiles = async (req: AuthRequest, res: Response) => {
  const files = await getSharedFilesService(req.user.id);

  res.json({
    success: true,
    message: 'Shared files fetched',
    data: files,
  });
};
