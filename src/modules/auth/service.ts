import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createUser, findUserByEmail, activateUser } from './repository';
import { RegisterDTO, LoginDTO } from './types';
import {
  signAccessToken,
  signRefreshToken,
  signActivationToken,
  verifyRefreshToken,
} from '../../common/utils/jwt';
import { sendEmail } from '../../common/utils/email';
import { env } from '../../config/env.config';
import { ApiError } from '../../common/errors/ApiError';
import User from '../users/model';
import { generateResetToken } from '../../common/utils/token';

/* ================= REGISTER ================= */
export const registerService = async (data: RegisterDTO) => {
  const existing = await findUserByEmail(data.email);
  if (existing) throw new ApiError(409, 'Email already registered');

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await createUser({ ...data, password: hashed });

  const token = signActivationToken(user.id);
  const link = `${env.CLIENT_URL}/activate/${token}`;
  console.log(link);
  await sendEmail(
    user.email,
    'Activate Account',
    `<p>Activate account:</p><a href="${link}">Click to Activate</a>`,
  );

  return {
    message: 'Registration successful. Please activate your account.',
  };
};

/* ================= ACTIVATE ACCOUNT ================= */
export const activateAccountService = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, env.JWT_ACTIVATION_SECRET);
    await activateUser(decoded.userId);
  } catch {
    throw new ApiError(400, 'Invalid or expired activation token');
  }
};

/* ================= LOGIN ================= */
export const loginService = async (data: LoginDTO) => {
  const user = await findUserByEmail(data.email);
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (!user.isActive) throw new ApiError(403, 'Account not activated');

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new ApiError(401, 'Invalid credentials');

  return {
    accessToken: signAccessToken(user.id),
    refreshToken: signRefreshToken(user.id),
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};

/* ================= REFRESH TOKEN (ROTATION) ================= */
export const refreshTokenService = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    return {
      accessToken: signAccessToken(decoded.userId),
      refreshToken: signRefreshToken(decoded.userId), // rotation
    };
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  const { rawToken, hashedToken } = generateResetToken();

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const resetLink = `${env.CLIENT_URL}/reset-password/${rawToken}`;

  await sendEmail(
    user.email,
    'Password Reset',
    `<p>Reset password:</p><a href="${resetLink}">${resetLink}</a>`,
  );

  return { message: 'Password reset email sent' };
};

/* ================= RESET PASSWORD ================= */
export const resetPasswordService = async (
  token: string,
  newPassword: string,
) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Token invalid or expired');

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return { message: 'Password reset successful' };
};
