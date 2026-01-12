import { supabase } from "@/lib"



export default function useAuth() {
    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin
            }
        })

    }
    // const logOut = () => {}

    return { signInWithGoogle }
}