import { useAuth } from "@/auth";
import { useRoomStore } from "@/core";
import { useState, useRef, useEffect } from "react";
import UserProfile from "../UserProfile";

export const MessageWidget = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // const users = useRoomStore((s) => s.presenceUsers);
  const { presenceUsers, roomId } = useRoomStore()
  const users = presenceUsers

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return; // Disable dragging on mobile
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

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const { messages, sendMessage } = useRoomStore();
  const { session } = useAuth();
  const [value, setValue] = useState("");

  // Mobile: Show toggle button when closed
  if (isMobile && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-accent text-white p-4 rounded-full shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div
      ref={dragRef}
      style={
        isMobile
          ? {} // Fixed positioning handled by CSS
          : { transform: `translate(${position.x}px, ${position.y}px)` }
      }
      className={`
        flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl
        ${
          isMobile
            ? "fixed inset-x-2 bottom-2 top-auto h-[60vh] z-50"
            : "w-220 h-150 absolute right-0 bottom-0"
        }
      `}
    >
      {/* Drag Handle / Header */}
      <div
        onMouseDown={handleMouseDown}
        className={`flex items-center justify-between bg-accent w-full h-10 px-4 rounded-t-3xl ${
          isMobile ? "" : isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <span className="text-sm font-medium">Message in {roomId}</span>
        {isMobile && (
          <button onClick={() => setIsOpen(false)} className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex w-full ${
              m.user === session?.user.email ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                m.user === session?.user.email ? "flex-row-reverse " : ""
              }`}
            >
              <UserProfile
                src={users.find((user) => user.email === m.user)?.avatar ?? ""}
              />
              <p
                className={`max-w-[75%] rounded-xl px-3 py-2 ${
                  m.user === session?.user.email ? "bg-accent" : "bg-accent "
                }`}
              >
                {m.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-black/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!value.trim() || !session) return;

            sendMessage(value, session.user.email!);
            setValue("");
          }}
          className="flex gap-2"
        >
          <input
            className="flex-1 h-10 px-3 outline-none bg-black/5 rounded-xl"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Chat with members"
          />
          <button
            type="submit"
            className="h-10 px-4 bg-accent text-white rounded-xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
