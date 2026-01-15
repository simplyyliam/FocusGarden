import { useAuth } from "@/auth";
import { useRoomStore } from "@/core";
import { useNavigate } from "react-router-dom";

export default function RoomSwitcher() {
  const joinRoom = useRoomStore((s) => s.joinRoom);
  const { session } = useAuth();

  const rooms = ["global", "deep-focus", "study-lobby"];

  const navigate = useNavigate();

  const handleJoinRoom = async (room: string) => {
    if(!session) return
    await joinRoom({
      roomId: room,
      user: {
        id: session.user.id,
        email: session.user.email,
        avatar: session.user.user_metadata.avatar_url,
      },
    });
    navigate("/sessio");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Choose a Room</h2>
        <div className="flex gap-4">
          {rooms.map((room) => (
            <button
              key={room}
              onClick={() => handleJoinRoom(room)}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              {room}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
