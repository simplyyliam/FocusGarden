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
    startedAt: number | null
    pausedAt: number | null
    duration: number
}

type RoomMode = "group" | "individual"

type RoomStore = {
    roomId: string | null
    roomMode: RoomMode
    channel: RealtimeChannel | null
    messages: Message[]
    presenceUsers: PresenceUser[]
    timerState: TimerState
    localTimerState: TimerState // For individual mode

    joinRoom: (args: {
        roomId: string
        user: { id: string; email?: string; avatar?: string }
        mode?: RoomMode
    }) => Promise<void>

    leaveRoom: () => void
    sendMessage: (text: string, user: string) => void

    // Timer actions
    startTimer: () => void
    pauseTimer: () => void
    resumeTimer: () => void
    resetTimer: () => void

    getRemainingTime: () => number
}

const TIMER_DURATION = 1500; // 25 minutes

const createDefaultTimerState = (): TimerState => ({
    startedAt: null,
    pausedAt: null,
    duration: TIMER_DURATION,
});

export const useRoomStore = create<RoomStore>((set, get) => ({
    roomId: localStorage.getItem("roomId"),
    roomMode: (localStorage.getItem("roomMode") as RoomMode) || "individual",
    channel: null,
    messages: [],
    presenceUsers: [],
    timerState: createDefaultTimerState(),
    localTimerState: createDefaultTimerState(),

    joinRoom: async ({ roomId, user, mode = "individual" }) => {
        const channel = await JoinRoomRealtime({
            roomId,
            user,
            onMessage: (msg) => {
                if (msg.type === "chat") {
                    set((s) => {
                        if (s.messages.some((m) => m.id === msg.id)) return s;
                        return { messages: [...s.messages, msg as Message] };
                    });
                }
                // Only sync timer in group mode
                if (msg.type === "timer_sync" && get().roomMode === "group") {
                    set({ timerState: msg.timerState as TimerState });
                }
            },
            onPresence: (users) => set({ presenceUsers: users }),
        });

        localStorage.setItem("roomId", roomId);
        localStorage.setItem("roomMode", mode);
        set({
            roomId,
            roomMode: mode,
            channel,
            messages: [],
            presenceUsers: [],
            timerState: createDefaultTimerState(),
            localTimerState: createDefaultTimerState(),
        });
    },

    leaveRoom: () => {
        localStorage.removeItem("roomId");
        localStorage.removeItem("roomMode");
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
        const { channel, roomMode } = get();
        const timerState: TimerState = {
            startedAt: Date.now(),
            pausedAt: null,
            duration: TIMER_DURATION,
        };

        if (roomMode === "group") {
            set({ timerState });
            channel?.send({ type: "broadcast", event: "message", payload: { type: "timer_sync", timerState } });
        } else {
            set({ localTimerState: timerState });
        }
    },

    pauseTimer: () => {
        const { channel, roomMode, timerState, localTimerState } = get();
        const currentState = roomMode === "group" ? timerState : localTimerState;
        if (!currentState.startedAt) return;

        const newState: TimerState = {
            ...currentState,
            pausedAt: Date.now(),
        };

        if (roomMode === "group") {
            set({ timerState: newState });
            channel?.send({ type: "broadcast", event: "message", payload: { type: "timer_sync", timerState: newState } });
        } else {
            set({ localTimerState: newState });
        }
    },

    resumeTimer: () => {
        const { channel, roomMode, timerState, localTimerState } = get();
        const currentState = roomMode === "group" ? timerState : localTimerState;
        if (!currentState.pausedAt) return;

        const pausedDuration = currentState.pausedAt - (currentState.startedAt ?? 0);
        const newState: TimerState = {
            startedAt: Date.now() - pausedDuration,
            pausedAt: null,
            duration: currentState.duration,
        };

        if (roomMode === "group") {
            set({ timerState: newState });
            channel?.send({ type: "broadcast", event: "message", payload: { type: "timer_sync", timerState: newState } });
        } else {
            set({ localTimerState: newState });
        }
    },

    resetTimer: () => {
        const { channel, roomMode } = get();
        const timerState = createDefaultTimerState();

        if (roomMode === "group") {
            set({ timerState });
            channel?.send({ type: "broadcast", event: "message", payload: { type: "timer_sync", timerState } });
        } else {
            set({ localTimerState: timerState });
        }
    },

    getRemainingTime: () => {
        const { roomMode, timerState, localTimerState } = get();
        const currentState = roomMode === "group" ? timerState : localTimerState;

        if (!currentState.startedAt) return currentState.duration;

        const elapsed = currentState.pausedAt
            ? currentState.pausedAt - currentState.startedAt
            : Date.now() - currentState.startedAt;

        return Math.max(0, currentState.duration - Math.floor(elapsed / 1000));
    },
}));