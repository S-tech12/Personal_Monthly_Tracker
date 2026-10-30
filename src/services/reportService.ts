import type { VoiceReportRequest, VoiceReportResponse } from '../types/report.types';

export const reportService = {
  sendCurrentMonthReport: async (): Promise<{ success: boolean; message: string }> => {
    const response = await fetch('http://localhost:5000/api/reports/current-month', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send report');
    }
    return data;
  },

  sendVoiceRequestedReport: async (payload: VoiceReportRequest): Promise<VoiceReportResponse> => {
    const response = await fetch('http://localhost:5000/api/reports/voice-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send voice requested report');
    }
    return data;
  }
};
