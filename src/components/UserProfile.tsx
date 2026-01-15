import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  src: string
}


export const UserProfile = ({src}: Props) => {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default UserProfile