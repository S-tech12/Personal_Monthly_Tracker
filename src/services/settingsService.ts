import type { SettingsData, GetSettingsResponse, UpdateSettingsResponse } from '../types/settings.types';

export const settingsService = {
  getSettings: async (): Promise<GetSettingsResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch settings');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  updateSettings: async (payload: SettingsData): Promise<UpdateSettingsResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  }
};
