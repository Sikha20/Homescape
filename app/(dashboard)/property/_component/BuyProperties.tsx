"use client";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox"; // Changed import to use shadcn Checkbox
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogOverlay,
    DialogPortal,
} from "@radix-ui/react-dialog";
import { useState } from "react";
import ClientPaymentSection from "./ClientPaymentSection";
import { TProperty } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export function BuyPropertyDialog({ property }: { property: TProperty }) {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [showTerms, setShowTerms] = useState(true);
    const [, setShowPayment] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleAcceptTerms = () => {
        if (termsAccepted) {
            setShowTerms(false);
            setShowPayment(true);
        }
    };

    const handleOpenDialog = () => {
        if (!isSignedIn) {
            toast.error("Please login to buy this property");
            router.push("/sign-in");
            return;
        }
        setIsOpen(true);
    };

    return (
        <>
            <Button
                onClick={handleOpenDialog}
                className="w-full bg-[#FC3955] hover:bg-red-800 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
            >
                Buy This Property
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" />
                    <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl max-w-2xl w-[90vw] p-8 transition-all duration-300">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                                {showTerms ? "Terms & Conditions" : "Payment Details"}
                            </DialogTitle>
                        </DialogHeader>

                        {showTerms ? (
                            <div className="space-y-8">
                                <div className="max-h-64 overflow-y-auto text-gray-700 text-base bg-gray-50 p-6 rounded-xl">
                                    <h3 className="font-bold text-lg mb-4 text-emerald-700">Please read and accept our terms:</h3>
                                    <ol className="list-decimal pl-6 space-y-3">
                                        <li className="transition-all hover:text-emerald-600">All payments are non-refundable once processed.</li>
                                        <li className="transition-all hover:text-emerald-600">Property viewing is mandatory before finalizing the purchase.</li>
                                        <li className="transition-all hover:text-emerald-600">The buyer is responsible for verifying all property details.</li>
                                        <li className="transition-all hover:text-emerald-600">Additional taxes and fees may apply.</li>
                                        <li className="transition-all hover:text-emerald-600">The transaction must be completed within 30 days.</li>
                                    </ol>
                                </div>

                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                                    <Checkbox
                                        id="terms"
                                        checked={termsAccepted}
                                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                        className="h-5 w-5 border-2 border-emerald-500 rounded transition-all text-black"
                                    />
                                    <label htmlFor="terms" className="text-base text-gray-700 cursor-pointer hover:text-emerald-600 transition-all">
                                        I accept the terms and conditions
                                    </label>
                                </div>

                                <Button
                                    onClick={handleAcceptTerms}
                                    disabled={!termsAccepted}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue to Payment
                                </Button>
                            </div>
                        ) : (
                            <ClientPaymentSection property={property} />
                        )}
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    );
}