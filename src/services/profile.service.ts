import type { UpdateProfileRequest, UserProfile } from '../types/profile.types';

export const profileService = {
  // Placeholder API calls
  getUserProfile: async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ email: 'user@voicespend.io' });
      }, 500);
    });
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }
};
