export interface VoiceReportRequest {
  transcript: string;
}

export interface VoiceReportResponse {
  success: boolean;
  message: string;
  data: {
    periodLabel: string;
  };
}
