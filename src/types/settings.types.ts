export interface SettingsData {
  defaultCurrency: string;
  reportFrequency: string; // 'weekly' | 'monthly'
  notificationPreferences: {
    budgetAlerts: boolean;
    reportEmails: boolean;
    unusualSpendingAlerts: boolean;
  };
}

export interface UpdateSettingsResponse {
  success: boolean;
  message: string;
  data: {
    user: any; // Simplified for now, can be properly typed if User type exists
  };
}

export interface GetSettingsResponse {
  success: boolean;
  data: {
    settings: SettingsData;
  };
}
