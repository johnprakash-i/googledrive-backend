import { Response } from 'express'
import { AuthRequest } from '../../common/middleware/auth.middleware'
import { getProfileService, updateProfileService } from './service'

export const getProfile = async (req: AuthRequest, res: Response) => {
  // req.user is already attached by auth middleware
  const user = await getProfileService(req.user._id)

  res.json({
    success: true,
    message: 'Profile fetched successfully',
    data: { user }, 
  })
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const updatedUser = await updateProfileService(req.user._id, req.body)

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser },
  })
}

