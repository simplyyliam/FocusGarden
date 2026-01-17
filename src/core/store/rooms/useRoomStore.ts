import { JoinRoom as JoinRoomRealtime } from "@/core/realtime/JoinRoom";
import type { Message, PresenceUser, RoomMode, TimerState, Todo } from "@/types";
import { type RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";

type RoomStore = {
    roomId: string | null
    roomMode: RoomMode
    channel: RealtimeChannel | null
    messages: Message[]
    presenceUsers: PresenceUser[]
    timerState: TimerState
    localTimerState: TimerState // For individual mode
    todos: Todo[]

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

    //Todo actions
    addTodo: (text: string) => void
    toggleTodo: (id: string) => void
    deleteTodo: (id: string) => void
    assignTodo: (todoId: string, user: string) => void
    unassignTodo: (todoId: string, user: string) => void
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
    todos: [],

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

                if (msg.type === "todo_sync") {
                    const { action, todo, todoId, userId } = msg

                    switch (action) {
                        case "add":
                            set((s) => ({
                                todos: [...s.todos, todo as Todo]
                            }))
                            break;
                        case "toggle":
                            set((s) => ({
                                todos: s.todos.map((todo) =>
                                    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
                                )
                            }))
                            break;
                        case "delete":
                            set((s) => ({
                                todos: s.todos.filter((todo) => todo.id !== todoId)
                            }))
                            break;

                        case "assign":
                            set((s) => ({
                                todos: s.todos.map((todo) =>
                                    todo.id === todoId
                                        ? { ...todo, assignedTo: [...todo.assignedTo] }
                                        : todo
                                )
                            }));
                            break;

                        case "unassign":
                            set((s) => ({
                                todos: s.todos.map((todo) =>
                                    todo.id === todoId
                                        ? { ...todo, assignedTo: todo.assignedTo.filter((id) => id !== userId) }
                                        : todo
                                )
                            }))
                            break;
                    }
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
            todos: [],
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

    addTodo: (text) => {
        const { channel, roomId } = get()
        if (!channel || !roomId) return

        const currentUser = get().presenceUsers.find((user) => user.id)
        if (!currentUser) return

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdBy: currentUser.id,
            createdAt: Date.now(),
            roomId,
            assignedTo: [currentUser.id],
        }

        set((s) => ({
            todos: [...s.todos, newTodo]
        }))

        channel.send({
            type: "broadcast",
            event: "message",
            payload: {
                type: "todo_sync",
                action: "add",
                todo: newTodo
            }
        })
    },
    toggleTodo: (id) => {
        const { channel } = get()
        if (!channel) return

        set((s) => ({
            todos: s.todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        }))

        channel.send({
            type: "broadcast",
            event: "message",
            payload: {
                type: "todo_sync",
                action: "toggle",
                todo: id
            }
        })

    },
    deleteTodo: (id) => {
        const { channel } = get()
        if (!channel) return

        set((s) => ({
            todos: s.todos.filter((todo) => todo.id !== id)
        }))

        channel.send({
            type: "broadcast",
            event: "message",
            payload: {
                type: "todo_sync",
                action: "delete",
                todo: id
            }
        })
    },
    assignTodo: (todoId, userId) => {
        const { channel } = get()
        if (!channel) return

        const todo = get().todos.find((todo) => todo.id === todoId)
        if (!todo || todo.assignedTo.includes(userId)) return

        set((s) => ({
            todos: s.todos.map((todo) =>
                todo.id === todoId
                    ? { ...todo, assignedTo: [...todo.assignedTo, userId] }
                    : todo
            )
        }))
        channel.send({
            type: "broadcast",
            event: "message",
            payload: {
                type: "todo_sync",
                action: "assign",
                todoId,
                userId
            }
        })
    },
    unassignTodo: (todoId, userId) => {
        const { channel } = get()
        if (!channel) return

        set((s) => ({
            todos: s.todos.map((todo) =>
                todo.id === todoId
                    ? { ...todo, assignedTo: todo.assignedTo.filter((id) => id !== userId) }
                    : todo
            )
        }))

        channel.send({
            type: "broadcast",
            event: "message",
            payload: {
                type: "todo_sync",
                action: "unassign",
                todoId,
                userId
            }
        })
    },

}));