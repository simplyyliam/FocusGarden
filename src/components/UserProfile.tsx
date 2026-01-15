import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  src: string
  className?: string
  onClick: () => void
}


export const UserProfile = ({src, className, onClick}: Props) => {
  return (
    <Avatar onClick={onClick} className={`${className}`}>
      <AvatarImage src={src} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default UserProfile


