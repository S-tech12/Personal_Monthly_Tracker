export interface UpdateProfileRequest {
  newPassword?: string;
  confirmPassword?: string;
  avatarFile?: File;
}

export interface UserProfile {
  email: string;
  avatarUrl?: string;
}
