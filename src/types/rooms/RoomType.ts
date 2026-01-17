export type Message = {
    id: string
    text: string
    user: string
    createdAt: number
}

export type PresenceUser = {
    id: string
    email?: string
    avatar?: string
}

export type TimerState = {
    startedAt: number | null
    pausedAt: number | null
    duration: number
}

export type RoomMode = "group" | "individual"

export type Todo = {
    id: string
    text: string
    completed: boolean
    assignedTo: string[] //array of user id's
    roomId: string
    createdBy: string // user id
    createdAt: number
}