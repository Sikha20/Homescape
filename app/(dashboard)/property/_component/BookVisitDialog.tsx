"use client";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogOverlay,
    DialogPortal,
} from "@radix-ui/react-dialog";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { bookVisit } from "@/actions/bookVisit";

export function BookVisitDialog({ propertyId }: { propertyId: string }) {
    const { isSignedIn, userId } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [date, setDate] = useState("");
    const [visitType, setVisitType] = useState("PHYSICAL");

    const handleOpenDialog = () => {
        if (!isSignedIn) {
            toast.error("Please login to book a visit");
            router.push("/sign-in");
            return;
        }
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) {
            toast.error("Please select a date and time");
            return;
        }

        setIsLoading(true);
        try {
            const res = await bookVisit(propertyId, userId as string, new Date(date), visitType);
            if (res.success) {
                toast.success(res.message);
                setIsOpen(false);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while booking the visit");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={handleOpenDialog}
                variant="outline"
                className="w-full border-[#789274] text-[#789274] hover:bg-[#789274] hover:text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-sm"
            >
                Book a Visit
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all z-50" />
                    <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl max-w-md w-[90vw] p-8 transition-all z-50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                                Schedule a Property Visit
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4 pt-2">
                                <label className="block text-sm font-bold text-gray-700">How would you like to visit?</label>
                                <div className="grid grid-cols-2 gap-4">
                                  <button
                                    type="button"
                                    onClick={() => setVisitType("PHYSICAL")}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold flex flex-col items-center justify-center gap-3 ${visitType === "PHYSICAL" ? "border-[#789274] bg-[#789274]/5 text-[#789274] shadow-md scale-[1.02]" : "border-gray-200 text-gray-500 hover:border-[#789274]/50 bg-gray-50 hover:bg-white"}`}
                                  >
                                     <span className="text-3xl">🏠</span>
                                     <span>In-Person</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setVisitType("VIRTUAL")}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold flex flex-col items-center justify-center gap-3 ${visitType === "VIRTUAL" ? "border-[#789274] bg-[#789274]/5 text-[#789274] shadow-md scale-[1.02]" : "border-gray-200 text-gray-500 hover:border-[#789274]/50 bg-gray-50 hover:bg-white"}`}
                                  >
                                     <span className="text-3xl">💻</span>
                                     <span>Virtual Tour</span>
                                  </button>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date & Time</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#789274] transition-colors bg-gray-50 focus:bg-white font-medium text-gray-700"
                                        required
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#789274] hover:bg-[#5a6d56] text-white py-6 text-lg font-bold disabled:opacity-50 transition-all shadow-md"
                                >
                                    {isLoading ? "Booking..." : "Confirm Booking"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    variant="outline"
                                    className="w-full py-6 text-lg font-bold border-2"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    );
}
