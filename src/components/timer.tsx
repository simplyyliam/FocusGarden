import { useRoomStore } from "@/core";
import { useEffect, useState } from "react";

export default function TimerContainer() {
  const getRemainingTime = useRoomStore((s) => s.getRemainingTime);
  const timerState = useRoomStore((s) => s.timerState);
  const localTimerState = useRoomStore((s) => s.localTimerState);
  const roomMode = useRoomStore((s) => s.roomMode);
  const startTimer = useRoomStore((s) => s.startTimer);
  const pauseTimer = useRoomStore((s) => s.pauseTimer);
  const resumeTimer = useRoomStore((s) => s.resumeTimer);

  const [displayTime, setDisplayTime] = useState(getRemainingTime());

  // Get the correct timer state based on mode
  const currentState = roomMode === "group" ? timerState : localTimerState;
  const isStarted = currentState.startedAt !== null;
  const isPaused = currentState.pausedAt !== null;

  // Update display every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(getRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemainingTime]);

  const handleToggle = () => {
    if (!isStarted) {
      // Timer hasn't started yet - start it
      startTimer();
    } else if (isPaused) {
      // Timer is paused - resume it
      resumeTimer();
    } else {
      // Timer is running - pause it
      pauseTimer();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStarted, isPaused]);

  const mins = Math.floor(displayTime / 60);
  const secs = (displayTime % 60).toString().padStart(2, "0");

  return (
    <div 
      className="flex flex-col items-center justify-center text-9xl text-white font-semibold cursor-pointer"
      onClick={handleToggle}
    >
      {mins}:{secs}
    </div>
  );
}
