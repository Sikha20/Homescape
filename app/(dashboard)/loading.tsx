import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white pb-96">
            <div className="text-center space-y-6">
                <Image
                    src="/logo.png"
                    alt="Homescape Logo"
                    width={120}
                    height={120}
                    className="mx-auto"
                />

                <div className="flex items-center gap-2 text-red-600">
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
                    className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Take Me Back
                </Link>
            </div>
        </div>
    )
}
