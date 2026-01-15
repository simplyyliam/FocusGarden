import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  src: string
  className?: string
}


export const UserProfile = ({src, className}: Props) => {
  return (
    <Avatar className={`${className}`}>
      <AvatarImage src={src} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default UserProfile