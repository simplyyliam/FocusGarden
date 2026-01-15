import { Nav, TimerContainer, TodoWidget, BottomBar } from "@/components";
import { useUser } from "@/core/store";
import { useEffect } from "react";

export default function Sessio() {
  const { setAvatar, setUsername } = useUser()

  useEffect(() => {
    setAvatar()
    setUsername()
  }, [setAvatar, setUsername])
  
  return (
    <div className="background w-screen h-screen bg-neutral-200">
      <div className="flex flex-col items-center justify-center w-full h-full p-2.5">
        <Nav />
        <div className="flex items-center justify-center w-full h-full relative">
          <TimerContainer />
          <TodoWidget />
        </div>
        <BottomBar />
      </div>
    </div>
  );
}
