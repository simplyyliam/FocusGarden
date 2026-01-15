import { useAuth } from "@/auth";
import { supabase } from "@/lib";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useState, useRef, useEffect, type FormEvent } from "react";

export const MessageWidget = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [messages, setMessages] = useState<{ message: string, user: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const { session } = useAuth();
  useEffect(() => {
    if (!session) return;

    const roomOne = supabase.channel("room-1", {
      config: {
        presence: {
          key: session.user.id,
        },
      },
    });
    roomOne.on("broadcast", { event: "message" }, (payload) => {
      setMessages((prev) => [...prev, {message: payload.payload.message, user: payload.payload.user}]);
    });

    roomOne.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await roomOne.track({
          id: session.user.id,
        });
      }
    });

    channelRef.current = roomOne;

    // roomOne.on("presence", { event: "sync" }, () => {
    //   const state = roomOne.presenceState()
    //   setMembers(Object.keys(state))
    // })

    return () => {
      roomOne.unsubscribe();
      channelRef.current = null;
    };
  }, [session]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!channelRef.current || !newMessage.trim()) return;

    const messagePayload = { message: newMessage, user: session?.user.email || "Anonymous" };

    // Add message to local state immediately
    setMessages((prev) => [...prev, messagePayload]);

    await channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: messagePayload
    });
    setNewMessage("");
  };

  return (
    <div
      ref={dragRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="flex flex-col bg-white w-220 h-150 rounded-3xl absolute right-0 bottom-0 overflow-hidden"
    >
      <div
        onMouseDown={handleMouseDown}
        className={`flex items-center bg-accent w-full h-10 rounded-t-3xl ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      ></div>
      <div className="h-full p-4">
        {messages.map((m) => (
          <div
            className={`flex w-full h-fit ${
              m.user === session?.user.email
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <div className="h-fit p-4">
        <form onSubmit={sendMessage}>
          <input
            className="h-10 w-full outline-none"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Chat with members"
          />
        </form>
      </div>
    </div>
  );
};
