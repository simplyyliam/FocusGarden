import { useEffect } from "react";
import { BarContainer } from "./shared";
import UserAvatar from "./UserProfile";
import { useUser } from "@/core/store";

export default function Nav() {
  const { avatar, username, setAvatar, setUsername } = useUser()

  useEffect(() => {
    setAvatar()
    setUsername()
  }, [setAvatar, setUsername])

  return (
    <BarContainer>
      <div className="flex items-center justify-center gap-3 text-white">
      <UserAvatar src={avatar || ""}/>
        {username}
      </div>
    </BarContainer>
  );
}
