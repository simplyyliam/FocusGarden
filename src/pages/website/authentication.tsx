import { Button } from "@/components/ui/button";
import { Logo } from "./components";
import { motion } from "motion/react";
import { useAuth } from "@/hooks";

export default function Authentication() {
  const { signInWithGoogle } = useAuth()
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[url('/bg-1.png')] bg-cover">
      <div className="flex flex-col items-center justify-between lg:h-70 h-60">
        <div className="flex flex-col gap-2.5 items-center justify-center">
          <Logo />
          <div className="flex flex-col items-center justify-center gap-0.5">
            <h1 className="text-[35px] font-semibold text-white">
              Welcome to Sessio
            </h1>
            <p className="text-[17px] font-medium text-white/50">
              Focus. Connect. Achieve.
            </p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }}>
          <Button onClick={signInWithGoogle} className="bg-white text-foreground w-52 h-15 rounded-full hover:bg-neutral-100 cursor-pointer">
            <span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_412_962)">
                  <path
                    d="M23.7141 12.2247C23.7141 11.2414 23.6343 10.5239 23.4616 9.77979H12.2336V14.2178H18.8242C18.6914 15.3207 17.9739 16.9816 16.3793 18.0977L16.357 18.2463L19.907 20.9965L20.153 21.021C22.4118 18.9349 23.7141 15.8654 23.7141 12.2247Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.2335 23.9178C15.4623 23.9178 18.173 22.8548 20.1529 21.0211L16.3792 18.0978C15.3693 18.8021 14.014 19.2937 12.2335 19.2937C9.07109 19.2937 6.38703 17.2076 5.43023 14.3242L5.28999 14.3361L1.59857 17.193L1.55029 17.3271C3.51683 21.2337 7.55625 23.9178 12.2335 23.9178Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.43041 14.3238C5.17796 13.5797 5.03185 12.7824 5.03185 11.9586C5.03185 11.1347 5.17796 10.3375 5.41713 9.59342L5.41044 9.43494L1.67276 6.53223L1.55047 6.59039C0.739971 8.21149 0.274902 10.0319 0.274902 11.9586C0.274902 13.8853 0.739971 15.7056 1.55047 17.3267L5.43041 14.3238Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.2335 4.62403C14.4791 4.62403 15.9938 5.59401 16.8575 6.40461L20.2326 3.10928C18.1598 1.1826 15.4623 0 12.2335 0C7.55625 0 3.51683 2.68406 1.55029 6.59056L5.41695 9.59359C6.38703 6.7102 9.07109 4.62403 12.2335 4.62403Z"
                    fill="#EB4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_412_962">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            Google
          </Button>
        </motion.button>
      </div>
    </div>
  );
}
