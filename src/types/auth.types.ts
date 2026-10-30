export interface Auth {
  user: User | null;
  token: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  defaultCurrency: string;
  memberSince?: string;
  hasFamily?: boolean;
  isHeadOfFamily?: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}

export interface GetCurrentUserResponse {
  success: boolean;
  data?: {
    user: User;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
  };
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
}

export interface DefaultResponse {
  success: boolean;
  message: string;
}

export interface UpdatePasswordRequest {
  newPassword?: string;
  confirmPassword?: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}
