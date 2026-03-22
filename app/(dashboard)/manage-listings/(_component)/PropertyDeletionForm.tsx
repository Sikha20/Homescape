"use client"
import { deleteProperty } from '@/actions/deleteProperty'
import React from 'react'
import toast from 'react-hot-toast'
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

const clientAction = async (id: string) => {
    const response = await deleteProperty(id);
    if (response.success) {
        toast.success(response.message);
    } else {
        toast.error(response.message);
    }
}

function PropertyDeletionForm({ id }: { id: string }) {
    const handleDelete = () => {
        clientAction(id);
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    className="px-6 py-2 text-base bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your property
                        listing and remove all associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PropertyDeletionForm