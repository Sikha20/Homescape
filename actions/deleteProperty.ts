"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteProperty = async (id: string) => {
  try {
    await db.property.delete({
      where: {
        id,
      },
    });
    revalidatePath("/manage-listings");
    return {
      success: true,
      message: "Property deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to delete property",
    };
  }
};
