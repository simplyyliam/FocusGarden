import { useAuth } from "@/auth";
import { useRoomStore } from "@/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, User } from "lucide-react";

type RoomMode = "group" | "individual";

type RoomConfig = {
  id: string;
  name: string;
  defaultMode: RoomMode;
};

const rooms: RoomConfig[] = [
  { id: "global", name: "Global", defaultMode: "individual" },
  { id: "deep-focus", name: "Deep Focus", defaultMode: "group" },
  { id: "study-lobby", name: "Study Lobby", defaultMode: "individual" },
];

export default function RoomSwitcher() {
  const joinRoom = useRoomStore((s) => s.joinRoom);
  const { session } = useAuth();
  const navigate = useNavigate();

  const [selectedMode] = useState<RoomMode>("individual");

  const handleJoinRoom = async (roomId: string) => {
    if (!session) return;
    await joinRoom({
      roomId,
      user: {
        id: session.user.id,
        email: session.user.email,
        avatar: session.user.user_metadata.avatar_url,
      },
      mode: selectedMode,
    });
    navigate("/sessio");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[url('bg-1.png')] bg-cover">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-white">Choose a Room</h2>

        {/* Mode Toggle */}
        {/* <div className="flex flex-col gap-2">
          <span className="text-sm text-white/60">Timer Mode</span>
          <div className="flex items-center gap-1 p-1 bg-white/10 rounded-lg w-fit">
            <button
              onClick={() => setSelectedMode("individual")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedMode === "individual"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <User size={14} />
              Individual
            </button>
            <button
              onClick={() => setSelectedMode("group")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                selectedMode === "group"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Users size={14} />
              Group Sync
            </button>
          </div>
          <p className="text-xs text-white/40">
            {selectedMode === "group"
              ? "Timer synced with everyone in the room"
              : "Control your own timer independently"}
          </p>
        </div> */}

        {/* Room List */}
        <div className="flex gap-4">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleJoinRoom(room.id)}
              className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors min-w-30"
            >
              <span className="text-white font-medium">{room.name}</span>
              <span className="text-xs text-white/40 flex items-center gap-1">
                {room.defaultMode === "group" ? (
                  <>
                    <Users size={12} /> Group default
                  </>
                ) : (
                  <>
                    <User size={12} /> Individual default
                  </>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
