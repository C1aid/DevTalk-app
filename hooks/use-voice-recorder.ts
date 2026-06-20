"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VoiceRecorderState = "idle" | "recording" | "recorded";

export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecorderState>("idle");
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const blobRef = useRef<Blob | null>(null);

  const cleanupStream = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  const reset = useCallback(() => {
    cleanupStream();
    chunksRef.current = [];
    blobRef.current = null;
    setDurationMs(0);
    setError(null);
    setState("idle");
  }, [cleanupStream]);

  const start = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        blobRef.current = new Blob(chunksRef.current, { type: mimeType });
        cleanupStream();
        setState("recorded");
      };

      recorder.start();
      startedAtRef.current = Date.now();
      setDurationMs(0);
      setState("recording");

      timerRef.current = window.setInterval(() => {
        setDurationMs(Date.now() - startedAtRef.current);
      }, 200);
    } catch {
      cleanupStream();
      setError("Microphone permission denied");
      setState("idle");
    }
  }, [cleanupStream]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    recorder.stop();
  }, []);

  const getFile = useCallback((): File | null => {
    if (!blobRef.current) return null;
    const extension = blobRef.current.type.includes("mp4") ? "m4a" : "webm";
    return new File([blobRef.current], `voice-message.${extension}`, {
      type: blobRef.current.type,
    });
  }, []);

  useEffect(() => () => reset(), [reset]);

  return {
    state,
    durationMs,
    error,
    start,
    stop,
    reset,
    getFile,
  };
}

export function formatVoiceDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
