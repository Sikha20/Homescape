"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const bookVisit = async (
  propertyId: string,
  userId: string,
  date: Date,
  visitType: string
) => {
  try {
    if (!userId) {
      return { success: false, message: "Please sign in to book a visit" };
    }

    const newVisit = await db.visit.create({
      data: {
        propertyId,
        userId,
        date,
        visitType, // "VIRTUAL" or "PHYSICAL"
      },
    });

    revalidatePath(`/property/${propertyId}`);

    return {
      success: true,
      message: `Successfully requested a ${visitType.toLowerCase()} visit.`,
      visit: newVisit,
    };
  } catch (error) {
    console.error("Booking visit error:", error);
    return {
      success: false,
      message: "Failed to book the visit.",
    };
  }
};
