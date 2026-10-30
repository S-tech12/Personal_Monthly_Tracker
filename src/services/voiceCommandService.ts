import type { VoiceCommandRequest, VoiceCommandResponse } from '../types/voiceCommand.types';

export const voiceCommandService = {
  sendVoiceCommand: async (payload: VoiceCommandRequest): Promise<VoiceCommandResponse> => {
    const response = await fetch('http://localhost:5000/api/voice-command', {
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
