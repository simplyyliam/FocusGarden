import { supabase } from "@/lib";
import { create } from "zustand";

type GetUserStore = {
    username: string
    avatar: string

    setAvatar: () => Promise<void>
    setUsername: () => Promise<void>
}


export const useUser = create<GetUserStore>((set) => ({
    username: "",
    avatar: "",

    setAvatar: async () => {
        const { data: { user } } = await supabase.auth.getUser()

        try {
            if (user) {
                const avatarUrl = user.user_metadata?.avatar_url
                set({ avatar: avatarUrl })
            }
        } catch (error) {
            console.error(error)

        }
    },
    setUsername: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        try {
            if (user) {
                set({
                    username: user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

}))

