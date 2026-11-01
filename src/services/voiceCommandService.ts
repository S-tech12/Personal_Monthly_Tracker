import type { VoiceCommandRequest, VoiceCommandResponse } from '../types/voiceCommand.types';

export const voiceCommandService = {
  sendVoiceCommand: async (payload: VoiceCommandRequest): Promise<VoiceCommandResponse> => {
    const response = await fetch(`${API_URL}/voice-command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    
    return response.json();
  }
};
import { API_URL } from './apiConfig';
