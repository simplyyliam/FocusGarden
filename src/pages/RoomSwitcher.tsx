import { useAuth } from "@/auth";
import { useRoomStore } from "@/core";

export default function RoomSwitcher() {
  const joinRoom = useRoomStore((s) => s.joinRoom);
  const { session } = useAuth();

  const rooms = ["global", "deep-focus", "study-lobby"];

  return (
    <div className="flex items-center justify-center w-full h-full">
      {rooms.map((room) => (
        <button
          key={room}
          onClick={() =>
            joinRoom({
              roomId: room,
              user: {
                id: session!.user.id,
                email: session!.user.email,
                avatar: session!.user.user_metadata.avatar_url,
              },
            })
          }
          className="p-4 rounded-2xl bg-white/10"
        >
          {room}
        </button>
      ))}
    </div>
  );
}
