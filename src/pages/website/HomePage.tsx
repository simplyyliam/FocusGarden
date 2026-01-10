import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-between w-screen min-h-screen p-2.5 gap-22.5 overflow-y-auto">
      {/* Nav */}
      <nav className="flex items-center justify-between w-full lg:max-w-[50%] h-fit px-2.5 bg-white/35 backdrop-blur-md">
        <h1>Sessio</h1>
        <div className="flex items-center justify-center gap-2.5">
          <Link to={""}>About</Link>
          <Link
            className="p-2 text-sm lg:px-3.75 lg:py-2.5 bg-accent rounded-xl"
            to={""}
          >
            Try Now
          </Link>
        </div>
      </nav>
      {/* hero */}
      <div className="flex flex-col gap-4 items-center justify-between  lg:max-w-228.25">
        <div className="flex flex-col items-center justify-center gap-3 p-6.25">
          <h1 className="text-[20.5px] lg:text-[45px] font-semibold">
            Focus better, together
          </h1>
          <p className="text-center text-muted-foreground w-full">
            Sessio is a minimalist pomodoro timer where focus meets community.
            Join a room to work alongside others, chat during breaks, or go
            solo. whatever floats your boat. Less noise. More deep work.
          </p>
        </div>
        <Link to={""}>
          <Button className="rounded-full cursor-pointer px-9.25 py-3.5 h-fit">
            Sign in
          </Button>
        </Link>
      </div>
      {/* hero image/video */}
      <div className="w-[60em] h-[40em] bg-neutral-100"></div>
    </div>
  );
}
