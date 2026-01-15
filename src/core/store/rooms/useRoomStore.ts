import { JoinRoom as JoinRoomRealtime } from "@/core/realtime/JoinRoom";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";


type RoomStore = {
    roomId: string | null
    channel: RealtimeChannel | null
    messages: any[]
    presenceUsers: any[]

    joinRoom: (args: {
        roomId: string
        user: {
            id: string
            email?: string
            avatar?: string
        }
    }) => Promise<void>

    sendMessage: (text: string, user: string) => void
    
}


export const useRoomStore = create<RoomStore>((set, get) => ({
    roomId: null,
    channel: null,
    messages: [],
    presenceUsers: [],

    joinRoom: async ({ roomId, user }) => {
        const channel = await JoinRoomRealtime({
            roomId,
            user,
            onMessage: (msg) => set((s) => ({
                messages: [...s.messages, msg],
            })),
            onPresence: (users) => set({presenceUsers: users}),
        })
        set({
            roomId,
            channel,
            messages: [],
            presenceUsers: [],
        })
    },
    sendMessage: (text, user) => {
        const { channel } = get()
        if(!channel) return

        channel.send({
            type: "broadcast",
            event: "message",
            payload: {
                text,
                user
            }
        })
    }

}))