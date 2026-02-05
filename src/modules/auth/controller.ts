import { Request, Response } from 'express'
import {
  registerService,
  loginService,
  activateAccountService,
  refreshTokenService,
  resetPasswordService,
  forgotPasswordService,
} from './service'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // true in production (HTTPS)
  sameSite: 'lax' as const,
  path: '/',
}

export const register = async (req: Request, res: Response) => {
  const user = await registerService(req.body)
  res.json({
    success: true,
    message: 'User registered. Check email.',
    data: user,
  })
}

export const activate = async (req: Request, res: Response) => {
  const { token } = req.params
  if (Array.isArray(token))
    return res.status(400).json({ success: false, message: 'Invalid token' })

  await activateAccountService(token)
  res.json({ success: true, message: 'Account activated', data: {} })
}

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await loginService(req.body)

  res
    .cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    })
    .cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: 'Login successful',
      data: { user },
    })
}

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  const tokens = await refreshTokenService(refreshToken)

  res
    .cookie('accessToken', tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    })
    .json({ success: true, message: 'Token refreshed', data: {} })
}

export const logout = async (_req: Request, res: Response) => {
  res
    .clearCookie('accessToken', { path: '/' })
    .clearCookie('refreshToken', { path: '/' })
    .json({ success: true, message: 'Logged out' })
}

export const forgotPassword = async (req: Request, res: Response) => {
  await forgotPasswordService(req.body.email)
  res.json({ success: true, message: 'Password reset link sent', data: {} })
}

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params
  if (Array.isArray(token))
    return res.status(400).json({ success: false, message: 'Invalid token' })

  await resetPasswordService(token, req.body.password)
  res.json({ success: true, message: 'Password reset successful', data: {} })
}