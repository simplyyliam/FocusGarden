import { Nav, TimerContainer, TodoWidget, BottomBar } from "@/components";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";

export default function Sessio() {
  const { session, loading } = useAuth();

  const navigate = useNavigate();
  if (loading) return null;
  if (!session) {
    navigate("/signin");
  }

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
