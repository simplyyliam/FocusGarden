import { supabase } from "@/lib";
import { RealtimeChannel } from "@supabase/supabase-js";


let activeChannel: RealtimeChannel | null = null

type JoinRoomArgs = {
    roomId: string;
    user: {
        id: string;
        email?: string
        avatar?: string
    }
    onMessage?: (message: any) => void
    onPresence?: (users: any[]) => void
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
            presence: {
                key: user.id
            }
        }
    })

    if(onMessage) {
        channel.on("broadcast", { event: "message" }, (payload) => {
            onMessage(payload.payload)
        })
    }

    if(onPresence) {
        channel.on("presence", { event: "sync" }, () => {
            const state = channel.presenceState()
            const users = Object.keys(state).flat()
            onPresence(users)
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