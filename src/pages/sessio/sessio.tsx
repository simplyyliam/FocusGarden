import { Nav, TimerContainer, TodoWidget, BottomBar, MessageWidget } from "@/components";
import { useUser, useRoomStore } from "@/core";
import { useAuth } from "@/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sessio() {
  const { setAvatar, setUsername } = useUser();
  const { session, isLoading } = useAuth();
  const { roomId, channel, joinRoom } = useRoomStore();
  const navigate = useNavigate();

  // Rejoin room on refresh if roomId exists but channel is null
  useEffect(() => {
    if (isLoading) return;
    
    if (!session) {
      navigate("/signin");
      return;
    }

    if (roomId && !channel) {
      joinRoom({
        roomId,
        user: {
          id: session.user.id,
          email: session.user.email,
          avatar: session.user.user_metadata.avatar_url,
        },
      });
    } else if (!roomId) {
      // No room selected, redirect to room switcher
      navigate("/rooms");
    }
  }, [isLoading, session, roomId, channel, joinRoom, navigate]);

  useEffect(() => {
    setAvatar();
    setUsername();
  }, [setAvatar, setUsername]);

  // Don't render until we have a channel
  if (!channel) {
    return null;
  }

  return (
    <div className="background w-screen h-screen bg-neutral-200">
      <div className="flex flex-col items-center justify-center w-full h-full p-2.5">
        <Nav />
        <div className="flex items-center justify-center w-full h-full relative">
          <TimerContainer />
          <TodoWidget />
          <MessageWidget/>
        </div>
        <BottomBar />
      </div>
    </div>
  );
}
