import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  src: string
  className?: string
  onClick?: () => void
}


const UserProfile = ({src, className, onClick}: Props) => {
  return (
    <Avatar onClick={onClick} className={className}>
      {src ? (
        <AvatarImage src={src} alt="User avatar" />
      ) : null}
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default UserProfile


