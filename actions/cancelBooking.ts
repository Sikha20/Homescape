"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const cancelBooking = async (propertyId: string, userId: string) => {
  try {
    // Determine if rental exists
    const rental = await db.rental.findFirst({
      where: { propertyId, userId },
    });

    if (!rental) {
      return { success: false, message: "Rental record not found." };
    }

    await db.$transaction(async (tx) => {
      // 1. Remove rental record
      await tx.rental.delete({
        where: { id: rental.id },
      });

      // 2. Mark property as available again
      await tx.property.update({
        where: { id: propertyId },
        data: { isBooked: false },
      });

      // 3. Mark payment as refunded if it exists
      const payment = await tx.payment.findFirst({
        where: { propertyId, userUserId: userId, status: "Completed" }
      });
      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "REFUNDED" }
        });
      }
    });

    revalidatePath("/manage-listings");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Booking cancelled and booking fee refunded." };
  } catch (error) {
    console.error("Cancellation error:", error);
    return { success: false, message: "Failed to cancel the booking." };
  }
};
