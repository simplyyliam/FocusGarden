import { useEffect } from "react";
import { useTimer } from "../core/store";

export default function TimerContainer() {
  const tick = useTimer((s) => s.tick);
  const timer = useTimer((s) => s.timer);
  const pause = useTimer((s) => s.pause);
  const resume = useTimer((s) => s.resume);
  const paused = useTimer((s) => s.isPaused);

  const mins = Math.floor(timer / 60);
  const secs = (timer % 60).toString().padStart(2, "0");
  const formatted = `${mins}:${secs}`;

  useEffect(() => {
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const handlePasue = (e: KeyboardEvent) => {
      if (!paused && e.key === " ") {
        pause();
      }
    };

    const handleResume = (e: KeyboardEvent) => {
      if (paused && e.key === " ") {
        resume();
      }
    };

    window.addEventListener("keydown", handlePasue);
    window.addEventListener("keydown", handleResume);
    return () => {
      window.removeEventListener("keydown", handlePasue);
      window.removeEventListener("keydown", handleResume);
    };
  }, [pause, resume, paused]);
  return (
    <div className="flex flex-col items-center justify-center text-9xl text-white font-semibold">
      {formatted}
    </div>
  );
}
