import { JoinRoom as JoinRoomRealtime } from "@/core/realtime/JoinRoom";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";

type Message = {
    id: string
    text: string
    user: string
    createdAt: number
}

type PresenceUser = {
    id: string
    email?: string
    avatar?: string
}

type RoomStore = {
    roomId: string | null
    channel: RealtimeChannel | null
    messages: Message[]
    presenceUsers: PresenceUser[]

    joinRoom: (args: {
        roomId: string
        user: {
            id: string
            email?: string
            avatar?: string
        }
    }) => Promise<void>

    leaveRoom: () => void

    sendMessage: (text: string, user: string) => void
}

export const useRoomStore = create<RoomStore>((set, get) => ({
    roomId: localStorage.getItem("roomId"),
    channel: null,
    messages: [],
    presenceUsers: [],

    joinRoom: async ({ roomId, user }) => {
        const channel = await JoinRoomRealtime({
            roomId,
            user,
            onMessage: (msg) => set((s) => {
                // Prevent duplicates by checking message ID
                if (s.messages.some((m) => m.id === msg.id)) {
                    return s;
                }
                return {
                    messages: [...s.messages, msg as Message],
                };
            }),
            onPresence: (users) => set({ presenceUsers: users }),
        })
        localStorage.setItem("roomId", roomId)
        set({
            roomId,
            channel,
            messages: [],
            presenceUsers: [],
        })
    },

    leaveRoom: () => {
        localStorage.removeItem("roomId")
        set({
            roomId: null,
            channel: null,
            messages: [],
            presenceUsers: [],
        })
    },

    sendMessage: (text, user) => {
        const channel = get().channel;
        if (!channel) return;

        const message: Message = {
            id: crypto.randomUUID(),
            text,
            user,
            createdAt: Date.now(),
        };

        channel.send({
            type: "broadcast",
            event: "message",
            payload: message,
        });
    },
}))