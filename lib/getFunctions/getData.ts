import { db } from "../db";

export const getPropertyDetails = async (id: string) => {
  try {
    const data = await db.property.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
        landlord: {
          include: {
            emails: true,
          },
        },
        Rental: true,
      },
    });
    return data;
  } catch {
    return null;
  }
};
