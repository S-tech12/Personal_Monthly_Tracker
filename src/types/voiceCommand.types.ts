export interface VoiceCommandRequest {
  transcript: string;
}

export interface VoiceCommandResult {
  message: string;
}

export interface VoiceCommandResponse {
  success: boolean;
  message: string;
  data: {
    results: string[];
  };
}
