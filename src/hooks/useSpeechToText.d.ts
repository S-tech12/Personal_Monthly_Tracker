import type { Dispatch, SetStateAction } from 'react';

export function useSpeechToText(options: {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  lang?: string;
}): {
  isSupported: boolean;
  isListening: boolean;
  error: string;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  clearError: () => void;
  reset: () => void;
};
