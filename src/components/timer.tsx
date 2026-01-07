import { useEffect } from "react";
import { useTimer } from "../core/store";

export default function TimerContainer() {
  const tick = useTimer((s) => s.tick)
  const timer = useTimer((s) => s.timer)

  const mins = Math.floor(timer / 60)
  const secs = (timer % 60).toString().padStart(2, "0")
  
  const formatted = `${mins}:${secs}`

  useEffect(() => {
    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [tick]);
  return (
    <div className="flex flex-col items-center justify-center">{formatted}</div>
  );
}
