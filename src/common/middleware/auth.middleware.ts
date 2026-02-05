import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env.config'
import User from '../../modules/users/model'
import { ApiError } from '../errors/ApiError'
import { Request } from 'express'

export interface AuthRequest extends Request {
  user?: any
}

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken

  if (!token) return next(new ApiError(401, 'Not authenticated'))

  try {
    const decoded: any = jwt.verify(token, env.JWT_ACCESS_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) throw new Error()

    req.user = user
    next()
  } catch {
    next(new ApiError(401, 'Invalid or expired token'))
  }
}