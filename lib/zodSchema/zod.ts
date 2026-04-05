import z from "zod";

export const createPropertyPayload = z.object({
  location: z.string().min(1, "Location is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  category: z.enum(["HOUSE", "APARTMENT", "VILLA", "COMMERCIAL_SPACE", "ROOM"]),
  noOfRooms: z.number().min(1, "Number of rooms must be at least 1"),
  noOfBathrooms: z.number().min(1, "Number of bathrooms must be at least 1"),
  description: z.string().min(1, "Description is required"),
});

export type CreatePropertyPayload = z.infer<typeof createPropertyPayload>;

