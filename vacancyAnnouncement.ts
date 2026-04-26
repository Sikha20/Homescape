"use server";

import { db } from "@/lib/db";
import { MAX_VACANCY_NOTICE_DAYS, MAX_VACANCY_NOTES_LENGTH } from "@/lib/vacancy";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/* ─────────────────────────────────────────────────────────────────────────────
   LANDLORD: post / update a vacancy announcement for their own property
───────────────────────────────────────────────────────────────────────────── */
export async function createVacancyAnnouncement(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Not authenticated" };

  const propertyId = formData.get("propertyId") as string;
  const daysUntilVacant = Number(formData.get("daysUntilVacant"));
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!propertyId || !daysUntilVacant || daysUntilVacant < 1 || daysUntilVacant > MAX_VACANCY_NOTICE_DAYS) {
    return {
      success: false,
      message: `Please choose a property and a timeline between 1 and ${MAX_VACANCY_NOTICE_DAYS} days.`,
    };
  }

  if (notes && notes.length > MAX_VACANCY_NOTES_LENGTH) {
    return {
      success: false,
      message: `Notes must be ${MAX_VACANCY_NOTES_LENGTH} characters or fewer.`,
    };
  }

  // Must own this property
  const property = await db.property.findUnique({ where: { id: propertyId } });
  if (!property || property.userId !== userId) {
    return { success: false, message: "Property not found or you don't own it." };
  }

  const vacantFrom = new Date();
  vacantFrom.setDate(vacantFrom.getDate() + daysUntilVacant);
  vacantFrom.setHours(0, 0, 0, 0);

  await db.vacancyAnnouncement.upsert({
    where: { propertyId },
    update: { vacantFrom, notes, postedBy: "LANDLORD", postedByUserId: userId, updatedAt: new Date() },
    create: { propertyId, vacantFrom, notes, postedBy: "LANDLORD", postedByUserId: userId },
  });

  revalidatePath("/manage-listings");
  revalidatePath("/");
  revalidatePath(`/property/${propertyId}`);
  return { success: true, message: "Vacancy announcement posted successfully!" };
}

/* ─────────────────────────────────────────────────────────────────────────────
   TENANT: post a vacancy notice for the property they currently rent
───────────────────────────────────────────────────────────────────────────── */
export async function createTenantVacancyNotice(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Not authenticated" };

  const propertyId = formData.get("propertyId") as string;
  const daysUntilVacant = Number(formData.get("daysUntilVacant"));
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!propertyId || !daysUntilVacant || daysUntilVacant < 1 || daysUntilVacant > MAX_VACANCY_NOTICE_DAYS) {
    return {
      success: false,
      message: `Please choose a timeline between 1 and ${MAX_VACANCY_NOTICE_DAYS} days.`,
    };
  }

  if (notes && notes.length > MAX_VACANCY_NOTES_LENGTH) {
    return {
      success: false,
      message: `Notes must be ${MAX_VACANCY_NOTES_LENGTH} characters or fewer.`,
    };
  }

  // Must be an active renter of this property
  const rental = await db.rental.findFirst({
    where: { propertyId, userId },
  });
  if (!rental) {
    return { success: false, message: "You are not renting this property." };
  }

  const vacantFrom = new Date();
  vacantFrom.setDate(vacantFrom.getDate() + daysUntilVacant);
  vacantFrom.setHours(0, 0, 0, 0);

  const ratingStr = formData.get("rating") as string;
  const rating = ratingStr ? Number(ratingStr) : null;

  await db.$transaction(async (tx) => {
    // Upsert the vacancy announcement
    await tx.vacancyAnnouncement.upsert({
      where: { propertyId },
      update: { vacantFrom, notes, postedBy: "TENANT", postedByUserId: userId, updatedAt: new Date() },
      create: { propertyId, vacantFrom, notes, postedBy: "TENANT", postedByUserId: userId },
    });

    // If rating is provided, update or create a review
    if (rating && rating >= 1 && rating <= 5) {
      const existingReview = await tx.reviews.findFirst({
        where: { propertiesId: propertyId, userId },
      });

      if (existingReview) {
        await tx.reviews.update({
          where: { id: existingReview.id },
          data: { rating, comment: notes || "" },
        });
      } else {
        await tx.reviews.create({
          data: {
            propertiesId: propertyId,
            userId,
            rating,
            comment: notes || "",
          },
        });
      }
    }
  });

  revalidatePath("/manage-listings");
  revalidatePath("/");
  revalidatePath(`/property/${propertyId}`);
  return { success: true, message: "Your vacancy notice has been posted." };
}

/* ─────────────────────────────────────────────────────────────────────────────
   REMOVE: landlord can always remove; tenant can only remove their own
───────────────────────────────────────────────────────────────────────────── */
export async function removeVacancyAnnouncement(propertyId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Not authenticated" };

  const announcement = await db.vacancyAnnouncement.findUnique({
    where: { propertyId },
    include: { property: true },
  });
  if (!announcement) return { success: false, message: "Announcement not found." };

  const isLandlord = announcement.property.userId === userId;
  const isOwnTenantPost = announcement.postedByUserId === userId;

  if (!isLandlord && !isOwnTenantPost) {
    return { success: false, message: "You don't have permission to remove this." };
  }

  await db.vacancyAnnouncement.delete({ where: { propertyId } });

  revalidatePath("/manage-listings");
  revalidatePath("/");
  revalidatePath(`/property/${propertyId}`);
  return { success: true, message: "Announcement removed." };
}
