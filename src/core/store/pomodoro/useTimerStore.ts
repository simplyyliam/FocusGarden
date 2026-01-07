import { create } from "zustand";


type TimerStore = {
    timer: number
    tick: () => void
}

export const useTimer = create<TimerStore & {format: () => string}> ((set, get) => ({
    timer: 5,
    tick: () => {
        const { timer } = get()
        if(timer > 0) {
            set({timer: timer - 1})
        }
     },
     format: () => {
        const {timer} = get()
        const mins = Math.floor(timer / 60)
        const secs = timer % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
     }
}))