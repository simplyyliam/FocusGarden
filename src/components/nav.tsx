
import { useAuth } from "@/auth";
import { BarContainer } from "./shared";
import UserAvatar from "./UserProfile";
import { useUser } from "@/core/store";

export default function Nav() {
  const { avatar, username } = useUser()
  const { signOut } = useAuth()


  return (
    <BarContainer>
      <div className="flex items-center justify-center gap-3 text-white">
      <UserAvatar onClick={() => signOut()} src={avatar || ""}/>
        {username}
      </div>
    </BarContainer>
  );
}
