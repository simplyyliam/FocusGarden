import { useRoomStore } from "@/core";
import { useEffect, useState } from "react";

export default function TimerContainer() {
  const getRemainingTime = useRoomStore((s) => s.getRemainingTime);
  const timerState = useRoomStore((s) => s.timerState);
  const startTimer = useRoomStore((s) => s.startTimer);
  const pauseTimer = useRoomStore((s) => s.pauseTimer);
  const resumeTimer = useRoomStore((s) => s.resumeTimer);

  const [displayTime, setDisplayTime] = useState(getRemainingTime());

  const isPaused = timerState.pausedAt !== null;
  // const isRunning = timerState.startedAt !== null && !isPaused;

  // Update display every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(getRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemainingTime]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (!timerState.startedAt) {
          startTimer();
        } else if (isPaused) {
          resumeTimer();
        } else {
          pauseTimer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timerState.startedAt, isPaused, startTimer, pauseTimer, resumeTimer]);

  const mins = Math.floor(displayTime / 60);
  const secs = (displayTime % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center text-9xl text-white font-semibold">
      {mins}:{secs}
    </div>
  );
}
