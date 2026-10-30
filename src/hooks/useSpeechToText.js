import { useCallback, useEffect, useRef, useState } from "react";

const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export function useSpeechToText({ text, setText, lang = "en-IN" }) {
  const recognitionRef = useRef(null);
  const baseTextRef = useRef(""); // text that existed before this listening session
  const wantListeningRef = useRef(false); // user's intent (for auto-restart)
  const finalTextRef = useRef("");
  const interimTextRef = useRef("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const isSupported = Boolean(SpeechRecognition);

  const latestTextRef = useRef(text);
  useEffect(() => {
    latestTextRef.current = text;
  }, [text]);

  // create the recognition instance ONCE
  useEffect(() => {
    if (!isSupported) return;
    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      finalTextRef.current = "";
      interimTextRef.current = "";
      setIsListening(true);
    };

    rec.onresult = (event) => {
      // Keep interim results separate so the controlled textarea updates on
      // every partial speech event, without waiting for a final result.
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      finalTextRef.current = finalTranscript;
      interimTextRef.current = interimTranscript;
      const base = baseTextRef.current;
      const sep = base && !base.endsWith(" ") ? " " : "";
      setText(base + sep + finalTextRef.current + interimTextRef.current);
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      wantListeningRef.current = false;
      setIsListening(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed")
        setError("Microphone permission denied. Allow mic access or type your entry.");
      else if (e.error === "audio-capture")
        setError("No microphone found.");
      else if (e.error === "network")
        setError("Network error. Speech recognition needs an internet connection.");
      else setError("Couldn't hear you, try again.");
    };

    rec.onend = () => {
      // Chrome stops by itself after silence. Restart if the user still wants to listen.
      if (wantListeningRef.current) {
        baseTextRef.current = latestTextRef.current.trim();
        try {
          rec.start();
        } catch {}
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = rec;
    return () => {
      wantListeningRef.current = false;
      rec.onresult = rec.onend = rec.onerror = rec.onstart = null;
      try {
        rec.abort();
      } catch {}
    };
  }, [lang, isSupported, setText]);

  const start = useCallback(() => {
    if (!recognitionRef.current || wantListeningRef.current) return;
    setError("");
    baseTextRef.current = latestTextRef.current.trim(); // keep what user typed/edited
    wantListeningRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {}
  }, []);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {}
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    baseTextRef.current = "";
    latestTextRef.current = "";
    finalTextRef.current = "";
    interimTextRef.current = "";
    setText("");
  }, [setText]);

  const toggle = useCallback(
    () => (wantListeningRef.current ? stop() : start()),
    [start, stop]
  );

  const clearError = useCallback(() => setError(""), []);

  return { isSupported, isListening, error, start, stop, toggle, clearError, reset };
}
