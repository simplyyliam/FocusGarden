
import { useRoomStore } from "@/core";
import UserProfile from "../UserProfile";

export default function MembersContainer() {
  const users = useRoomStore((s) => s.presenceUsers)

  return (
<div
  className="
    grid grid-cols-2
    w-16 h-16
    gap-0.5
    p-1.5
    rounded-xl
    bg-white/35
    border border-white/15
    backdrop-blur-md
  "
>
  {users.map((member) => (
    <UserProfile key={member.id} className="w-full h-full" src={member.avatar} />
  ))}
</div>

  );
}
