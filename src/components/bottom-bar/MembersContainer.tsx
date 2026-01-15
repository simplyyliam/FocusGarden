
import { useUser } from "@/core";
import UserProfile from "../UserProfile";

export default function MembersContainer() {
  const { avatar } = useUser();

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
  <UserProfile className="w-full h-full" src={avatar} />
  <UserProfile className="w-full h-full" src={avatar} />
  <UserProfile className="w-full h-full" src={avatar} />
  <UserProfile className="w-full h-full" src={avatar} />
</div>

  );
}
