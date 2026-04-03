"use client"
import { approveListings } from "@/actions/approveListings"
import { rejectListings } from "@/actions/rejectListings"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import toast from "react-hot-toast"

function AdminActions({ id, email, isApproved }: { id: string, email: string, isApproved: boolean }) {
    const [rejectionReason, setRejectionReason] = useState("")
    const [isApproving, setIsApproving] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)

    const handleApprove = async () => {
        try {
            setIsApproving(true)
            const toastId = toast.loading('Approving listing...')

            const response = await approveListings(id, email)

            if (response.success) {
                toast.success(response.message, { id: toastId })
            } else {
                toast.error(response.message, { id: toastId })
            }
        } catch {
            toast.error('Failed to approve listing')
        } finally {
            setIsApproving(false)
        }
    }

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection")
            return
        }

        try {
            setIsRejecting(true)
            const toastId = toast.loading('Rejecting listing...')

            const response = await rejectListings(id, email, rejectionReason)

            if (response.success) {
                toast.success(response.message, { id: toastId })
                setRejectionReason("")
            } else {
                toast.error(response.message, { id: toastId })
            }
        } catch (error) {
            console.error('Error rejecting listing:', error)
            toast.error('Failed to reject listing')
        } finally {
            setIsRejecting(false)
        }
    }

    return (
        <div className="p-6 bg-gray-50 border-t">
            <div className="flex gap-4">
                {!isApproved && (
                    <>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    className="bg-[#789274] text-white px-6 py-2 rounded-lg hover:bg-[#5a6d56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isApproving}
                                >
                                    {isApproving ? 'Approving...' : 'Approve Listing'}
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to approve this listing? This will make the property public and visible to all users.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-[#789274] text-white hover:bg-[#5a6d56] disabled:opacity-50"
                                        onClick={handleApprove}
                                        disabled={isApproving}
                                    >
                                        {isApproving ? 'Approving...' : 'Approve'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isRejecting}
                                >
                                    {isRejecting ? 'Rejecting...' : 'Reject Listing'}
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Please provide a reason for rejecting this listing. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="mt-4">
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter reason for rejection..."
                                        rows={3}
                                        disabled={isRejecting}
                                    />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
                                        onClick={handleReject}
                                        disabled={isRejecting}
                                    >
                                        {isRejecting ? 'Rejecting...' : 'Reject'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}

                {isApproved && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isRejecting}
                            >
                                {isRejecting ? 'Rejecting...' : 'Reject Listing'}
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Please provide a reason for rejecting this listing. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="mt-4">
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Enter reason for rejection..."
                                    rows={3}
                                    disabled={isRejecting}
                                />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
                                    onClick={handleReject}
                                    disabled={isRejecting}
                                >
                                    {isRejecting ? 'Rejecting...' : 'Reject'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
    )
};

export default AdminActions;