import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axiosFetch from "@/lib/axiosFetch"
import { useMutation } from "@tanstack/react-query"
import { Users } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"

const MultiPlayerButton = () => {

    // buttons for all dialogs
    const [joinDialogOpen, setJoinDialogOpen] = useState(false)
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams();
    const [usernameInvite, setUsernameInvite] = useState<string>('')
    const [roomId, setRoomId] = useState<string>('')
    const initialRoomId = searchParams.get('roomId') || '';

    const { mutate: Ready, isPending: isPendingReady } = useMutation({
        mutationKey: ['Ready'],
        mutationFn: async () => {
            // do something
            return 
        }
    })

    const { mutate: Join, isPending: isPendingJoin } = useMutation({
        mutationKey: ['Join'],
        mutationFn: async () => {
            const response = await axiosFetch.post('/multiplayer/joinRoom', {
                roomId: roomId
            })
            
            if(response.status >= 400) {
                // handle error
                toast.error('Error joining room')
                return
            }

            // changing the search Params
            const prevParams = Object.fromEntries(searchParams.entries());
            setSearchParams({...prevParams, roomId: roomId, mode: 'multiplayer', challengeId: response.data.challengeId })
            setInviteDialogOpen(false)
            setRoomId('')

            return toast.success('Joined Room!') 
        }
    })

    const { mutate: Invite, isPending: isPendingInvite } = useMutation({
        mutationKey: ['Invite'],
        mutationFn: async () => {
            const response = await axiosFetch.post('/multiplayer/sendInvite', {
                roomId: initialRoomId,
                username: usernameInvite // add later
            })
            
            if(response.status >= 400) {
                // handle error
                toast.error(response.data.message)
                return
            }

            setInviteDialogOpen(false)
            setUsernameInvite('')

            return toast.success('Invite sent!')
        }
    })

    // might want to make an in open of dialogs in a state to control it later on

    return (
        <div className="flex justify-center gap-4 mt-6">
            <Button 
            disabled={isPendingReady}
            onFocus={(e) => e.target.blur()} // so that after being click will not be reclick when space are push
            onClick={() => Ready()}
            className="w-32">
                Ready
            </Button>

            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                <DialogTrigger asChild>
                    <Button 
                    disabled={isPendingJoin}
                    className="w-32">
                        Join
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Join Room
                        </DialogTitle>
                        <DialogDescription>
                            Enter the Room Id
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        {/* form */}
                        <Input value={roomId} onChange={(e) => setRoomId(e.target.value)}  placeholder="Room Id" />
                        <Button
                        disabled={isPendingJoin}
                        onClick={() => Join()}
                        className="w-32 my-3">
                            Join
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                    <Button 
                    className="w-32">
                        <Users className="mr-2 h-4 w-4" />
                        Invite
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Invite
                        </DialogTitle>
                        <DialogDescription>
                            Invite a friend to join the room
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        {/* form */}
                        <Input value={usernameInvite} onChange={(e) => setUsernameInvite(e.target.value)} placeholder="username" />
                        <Button
                        onClick={() => Invite()}
                        disabled={isPendingInvite || !usernameInvite}
                        className="w-32 my-3">
                            Invite
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MultiPlayerButton