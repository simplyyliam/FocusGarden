import { supabase } from "@/lib";
import { BarContainer } from "./shared";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Nav() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      try {
        if (user) {
          setName(
            user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email ||
              ""
          );
          // console.log(user.user_metadata)
          const avatarUrl =
            user.user_metadata?.avatar_url || "No avatar was found";
          setAvatar(avatarUrl);
          // console.log("Avatar Image:", avatarUrl)
          return user;
        }
      } catch (error) {
        console.error(error);
      }
    }

    getUser();
  }, []);

  return (
    <BarContainer>
      <div className="flex items-center justify-center gap-3 text-white">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {name}
      </div>
    </BarContainer>
  );
}
