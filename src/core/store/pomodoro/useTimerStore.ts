import { create } from "zustand";


type TimerStore = {
    timer: number
    isPaused: boolean
    tick: () => void
    pause: () => void
    resume: () => void


}

export const useTimer = create<TimerStore>((set, get) => ({
    timer: 1500,
    isPaused: false,

    tick: () => {
        const { isPaused, timer } = get()
        if (isPaused || timer <= 0) return
        set({ timer: timer - 1 })
    },
    pause: () => set({isPaused: true}),
    resume: () => set({isPaused: false})
}))