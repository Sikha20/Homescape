import { Loader2, Home } from "lucide-react"
import Link from "next/link"

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white pb-96">
            <div className="text-center space-y-6">
                <div className="flex items-center justify-center bg-[#789274] rounded-full p-6 mx-auto w-fit">
                    <Home className="h-16 w-16 text-white" />
                </div>

                <div className="flex items-center gap-2 text-[#789274]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <h2 className="text-xl font-semibold">
                        Hang on a second...
                    </h2>
                </div>

                <p className="text-gray-500">
                    We are preparing your dashboard
                </p>

                <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-[#789274] text-white rounded-md hover:bg-[#5a6d56] transition-colors"
                >
                    Take Me Back
                </Link>
            </div>
        </div>
    )
}
