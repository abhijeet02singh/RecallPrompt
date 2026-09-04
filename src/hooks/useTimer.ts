import { useState, useEffect, useRef, useCallback } from "react";
import { playCompletionChime } from "../lib/audio";

interface UseTimerOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export interface TimerState {
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  reset: (newSeconds?: number) => void;
  addTime: (seconds: number) => void;
  formattedTime: string;
}

export function useTimer({
  initialSeconds,
  onComplete,
  autoStart = false,
}: UseTimerOptions): TimerState {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Store target end timestamp for exact calculations across tab throttling
  const targetEndTimeRef = useRef<number | null>(null);
  const remainingAtPauseRef = useRef<number>(initialSeconds * 1000);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Synchronize when initialSeconds changes and timer is not actively running
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTotalSeconds(initialSeconds);
      setSecondsLeft(initialSeconds);
      remainingAtPauseRef.current = initialSeconds * 1000;
      targetEndTimeRef.current = null;
      setIsCompleted(false);
    }
  }, [initialSeconds, isRunning, isPaused]);

  const start = useCallback(() => {
    const msRemaining = remainingAtPauseRef.current > 0 ? remainingAtPauseRef.current : totalSeconds * 1000;
    targetEndTimeRef.current = Date.now() + msRemaining;
    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);
  }, [totalSeconds]);

  const pause = useCallback(() => {
    if (isRunning && targetEndTimeRef.current) {
      const remaining = Math.max(0, targetEndTimeRef.current - Date.now());
      remainingAtPauseRef.current = remaining;
      setSecondsLeft(Math.ceil(remaining / 1000));
      targetEndTimeRef.current = null;
      setIsRunning(false);
      setIsPaused(true);
    }
  }, [isRunning]);

  const resume = useCallback(() => {
    if (isPaused) {
      targetEndTimeRef.current = Date.now() + remainingAtPauseRef.current;
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [isPaused]);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      start();
    }
  }, [isRunning, isPaused, pause, resume, start]);

  const reset = useCallback(
    (newSeconds?: number) => {
      const secs = newSeconds !== undefined ? newSeconds : totalSeconds;
      setTotalSeconds(secs);
      setSecondsLeft(secs);
      remainingAtPauseRef.current = secs * 1000;
      targetEndTimeRef.current = null;
      setIsRunning(false);
      setIsPaused(false);
      setIsCompleted(false);
    },
    [totalSeconds]
  );

  const addTime = useCallback(
    (extraSeconds: number) => {
      const extraMs = extraSeconds * 1000;
      setTotalSeconds((prev) => prev + extraSeconds);

      if (isRunning && targetEndTimeRef.current) {
        targetEndTimeRef.current += extraMs;
        const remaining = Math.max(0, targetEndTimeRef.current - Date.now());
        setSecondsLeft(Math.ceil(remaining / 1000));
      } else {
        remainingAtPauseRef.current += extraMs;
        setSecondsLeft((prev) => prev + extraSeconds);
      }
      setIsCompleted(false);
    },
    [isRunning]
  );

  // Interval loop with timestamp synchronization
  useEffect(() => {
    if (!isRunning) return;

    if (!targetEndTimeRef.current) {
      targetEndTimeRef.current = Date.now() + remainingAtPauseRef.current;
    }

    const interval = setInterval(() => {
      if (!targetEndTimeRef.current) return;

      const remainingMs = targetEndTimeRef.current - Date.now();
      const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));

      setSecondsLeft(remainingSecs);

      if (remainingMs <= 0) {
        clearInterval(interval);
        targetEndTimeRef.current = null;
        remainingAtPauseRef.current = 0;
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(true);
        playCompletionChime();
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Formatted string mm:ss
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;

  return {
    secondsLeft,
    totalSeconds,
    isRunning,
    isPaused,
    isCompleted,
    start,
    pause,
    resume,
    toggle,
    reset,
    addTime,
    formattedTime,
  };
}
