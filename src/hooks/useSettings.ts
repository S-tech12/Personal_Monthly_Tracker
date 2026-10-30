import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsService } from '../services/settingsService';
import type { SettingsData } from '../types/settings.types';

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getSettings();
      setSettings(data.data.settings);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (field: keyof SettingsData, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleToggleChange = (field: keyof SettingsData['notificationPreferences']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notificationPreferences: {
        ...settings.notificationPreferences,
        [field]: !settings.notificationPreferences[field]
      }
    });
  };

  const handleSaveChanges = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    
    try {
      const response = await settingsService.updateSettings(settings);
      toast.success(response.message || 'Settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    handleSettingChange,
    handleToggleChange,
    handleSaveChanges
  };
};
