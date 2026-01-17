import { supabase } from "@/lib";
import { RealtimeChannel } from "@supabase/supabase-js";

let activeChannel: RealtimeChannel | null = null

type PresenceUser = {
    id: string;
    email?: string;
    avatar?: string;
    joined_at: string;
}

type BroadcastMessage = {
    id: string;
    [key: string]: unknown;
}

type JoinRoomArgs = {
    roomId: string;
    user: {
        id: string;
        email?: string
        avatar?: string
    }
    onMessage?: (message: BroadcastMessage) => void
    onPresence?: (users: PresenceUser[]) => void
}

export async function JoinRoom({
    roomId,
    user,
    onMessage,
    onPresence,
}: JoinRoomArgs): Promise<RealtimeChannel> {

    if (activeChannel) {
        await supabase.removeChannel(activeChannel)
        activeChannel = null
    }

    const channel = supabase.channel(`room:${roomId}`, {
        config: {
            broadcast: {
                self: true, //Allows the sender to see there own broadcasts (messages sent, there presenceState, etc).
            },
            presence: {
                key: user.id
            }
        }
    })

    if(onMessage) {
        channel.on("broadcast", { event: "message" }, (payload) => {
            onMessage(payload.payload)
            // console.log(payload.payload)
        })
    }

    if(onPresence) {
        channel.on("presence", { event: "sync" }, () => {
            const state = channel.presenceState()
            const users = Object.values(state).flat() as unknown as PresenceUser[]
            // console.log("Presence State:", {state})
            // Deduplicate by user id
            const uniqueUsers = users.filter(
                (user, index, self) =>
                    index === self.findIndex((u) => u.id === user.id)
            )
            
            onPresence(uniqueUsers)
        })
    }
    
    await channel.subscribe(async (status) => {
        if(status === "SUBSCRIBED") {
            await channel.track({
                id: user.id,
                email: user.email,
                avatar: user.avatar,
                joined_at: new Date().toISOString()
            })
        }
    })

    activeChannel = channel
    return channel
}