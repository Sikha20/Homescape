import React from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

function Button() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full ${pending ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'} text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center`}
        >
            {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                "Submit"
            )}
        </button>
    )
}

export default Button
