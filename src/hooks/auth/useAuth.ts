import { supabase } from "@/lib"
import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"



export default function useAuth() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({
            data: { session }
        }) => {
            setSession(session)
            setLoading(false)
        })

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session)
            })

        return () => subscription.unsubscribe()

    }, [])

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin
            }
        })

    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return {
        session,
        signInWithGoogle,
        user: session?.user,
        loading,
        signOut
    }
}