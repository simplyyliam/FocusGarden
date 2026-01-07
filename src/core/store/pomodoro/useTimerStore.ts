import { create } from "zustand";


type TimerStore = {
    timer: number
    tick: () => void
}

export const useTimer = create<TimerStore>((set) => ({
    timer: 50,
    tick: () => {
        set((s) => ({
            timer: s.timer > 0 ? s.timer - 1 : 0
        }))
    }
}))