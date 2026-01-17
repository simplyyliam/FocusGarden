import { JoinRoom as JoinRoomRealtime } from "@/core/realtime/JoinRoom";
import { type RealtimeChannel } from "@supabase/supabase-js";
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

type TimerState = {
    startedAt: number | null  // Unix timestamp when timer started
    pausedAt: number | null   // Unix timestamp when paused (null if running)
    duration: number          // Total duration in seconds
}

type RoomStore = {
    roomId: string | null
    channel: RealtimeChannel | null
    messages: Message[]
    presenceUsers: PresenceUser[]
    timerState: TimerState

    joinRoom: (args: {
        roomId: string
        user: { id: string; email?: string; avatar?: string }
    }) => Promise<void>

    leaveRoom: () => void
    sendMessage: (text: string, user: string) => void

    // Timer actions (broadcast to all users)
    startTimer: () => void
    pauseTimer: () => void
    resumeTimer: () => void
    resetTimer: () => void

    // Computed remaining time
    getRemainingTime: () => number
}

const TIMER_DURATION = 1500; // 25 minutes

export const useRoomStore = create<RoomStore>((set, get) => ({
    roomId: localStorage.getItem("roomId"),
    channel: null,
    messages: [],
    presenceUsers: [],
    timerState: {
        startedAt: null,
        pausedAt: null,
        duration: TIMER_DURATION,
    },

    joinRoom: async ({ roomId, user }) => {
        const channel = await JoinRoomRealtime({
            roomId,
            user,
            onMessage: (msg) => {
                // Handle chat messages
                if (msg.type === "chat") {
                    set((s) => {
                        if (s.messages.some((m) => m.id === msg.id)) return s;
                        return { messages: [...s.messages, msg as Message] };
                    });
                }
                // Handle timer sync
                if (msg.type === "timer_sync") {
                    set({ timerState: msg.timerState as TimerState });
                }
            },
            onPresence: (users) => set({ presenceUsers: users }),
        });

        localStorage.setItem("roomId", roomId);
        set({
            roomId,
            channel,
            messages: [],
            presenceUsers: [],
            timerState: { startedAt: null, pausedAt: null, duration: TIMER_DURATION },
        });
    },

    leaveRoom: () => {
        localStorage.removeItem("roomId");
        set({
            roomId: null,
            channel: null,
            messages: [],
            presenceUsers: [],
        });
    },

    sendMessage: (text, user) => {
        const channel = get().channel;
        if (!channel) return;

        const message = {
            type: "chat",
            id: crypto.randomUUID(),
            text,
            user,
            createdAt: Date.now(),
        };

        channel.send({ type: "broadcast", event: "message", payload: message });
    },

    startTimer: () => {
        const channel = get().channel;
        if (!channel) return;

        const timerState: TimerState = {
            startedAt: Date.now(),
            pausedAt: null,
            duration: TIMER_DURATION,
        };

        set({ timerState });
        channel.send({ type: "broadcast", event: "message", payload: { type: "timer_sync", timerState } });
    },

    pauseTimer: () => {
        const channel = get().channel;
        const { timerState } = get();
        if (!channel || !timerState.startedAt) return;

        const newState: TimerState = {
            ...timerState,
            pausedAt: Date.now(),
        };

        set({ timerState: newState });
        channel.send({ type: "broadcast", event: "message", payload: { type: "timer_sync", timerState: newState } });
    },

    resumeTimer: () => {
        const channel = get().channel;
        const { timerState } = get();
        if (!channel || !timerState.pausedAt) return;

        const pausedDuration = timerState.pausedAt - (timerState.startedAt ?? 0);
        const newState: TimerState = {
            startedAt: Date.now() - pausedDuration,
            pausedAt: null,
            duration: timerState.duration,
        };

        set({ timerState: newState });
        channel.send({ type: "broadcast", event: "message", payload: { type: "timer_sync", timerState: newState } });
    },

    resetTimer: () => {
        const channel = get().channel;
        if (!channel) return;

        const timerState: TimerState = {
            startedAt: null,
            pausedAt: null,
            duration: TIMER_DURATION,
        };

        set({ timerState });
        channel.send({ type: "broadcast", event: "message", payload: { type: "timer_sync", timerState } });
    },

    getRemainingTime: () => {
        const { timerState } = get();
        if (!timerState.startedAt) return timerState.duration;

        const elapsed = timerState.pausedAt
            ? timerState.pausedAt - timerState.startedAt
            : Date.now() - timerState.startedAt;

        return Math.max(0, timerState.duration - Math.floor(elapsed / 1000));
    },
}));