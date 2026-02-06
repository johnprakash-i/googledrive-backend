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
  await sendEmail(
    user.email,
    'Activate Your Account',
    `
  <div style="font-family: Arial, sans-serif; background-color: #f0fdf4; padding: 30px; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      
      <h2 style="color: #16a34a; margin-bottom: 10px;">Welcome 🎉</h2>
      
      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        Thanks for registering! Please confirm your email address to activate your account.
      </p>

      <a href="${link}" 
         style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
         Activate Account
      </a>

      <p style="margin-top: 25px; font-size: 13px; color: #6b7280;">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="word-break: break-all; font-size: 12px; color: #16a34a;">
        ${link}
      </p>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 12px; color: #9ca3af;">
        If you didn’t create this account, you can safely ignore this email.
      </p>

    </div>
  </div>
  `,
  );

  return {
    message:
      'Registration successful! Please check your email to activate your account. If you don’t see it in your inbox, be sure to check your spam or promotions folder.',
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
  'Reset Your Password',
  `
  <div style="font-family: Arial, sans-serif; background-color: #f0fdf4; padding: 30px; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      
      <h2 style="color: #16a34a; margin-bottom: 10px;">Password Reset Requested 🔐</h2>
      
      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        We received a request to reset your password. Click the button below to set a new password.
      </p>

      <a href="${resetLink}" 
         style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
         Reset Password
      </a>

      <p style="margin-top: 25px; font-size: 13px; color: #6b7280;">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="word-break: break-all; font-size: 12px; color: #16a34a;">
        ${resetLink}
      </p>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 12px; color: #9ca3af;">
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

    </div>
  </div>
  `
);

return {
  message: 'A password reset email has been sent! Please check your inbox (and spam folder if needed) to complete the process.',
};
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
