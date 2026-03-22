"use server";

import { createPropertyPayload } from "@/lib/zodSchema/zod";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { Location, PropertyType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createProperty = async (formData: FormData) => {
  try {
    // Extract values from form data
    const location = formData.get("location") as Location;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as PropertyType;
    const noOfRooms = Number(formData.get("noOfRooms"));
    const noOfBathrooms = Number(formData.get("noOfBathrooms"));
    const description = formData.get("description")?.toString() as string;
    const imageFiles = formData.getAll("images") as File[];
    // console.log(imageFiles);

    const payLoad = {
      location,
      price,
      category,
      noOfRooms,
      noOfBathrooms,
      description,
      images: imageFiles.map((file) => file.name), // Just for validation
    };

    // Validate the property data against schema
    const response = createPropertyPayload.safeParse(payLoad);

    if (!response.success) {
      console.log(response.error.issues);
      return {
        success: false,
        message: response.error.issues[0].message,
      };
    }

    //get user id from clerksession session
    const { userId } = await auth();

    // Upload images sequentially and collect URLs
    const uploadedImageUrls: string[] = [];

    for (const file of imageFiles) {
      // Convert File to base64
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        resource_type: "auto",
      });

      // Store the secure URL
      uploadedImageUrls.push(result.secure_url);
    }

    // Log all uploaded URLs
    // console.log("Uploaded image URLs:", uploadedImageUrls);

    // Create property first to get its ID
    const property = await db.property.create({
      data: {
        userId: userId || "",
        location,
        price,
        category,
        noOfRooms,
        noOfBathrooms,
        description,
      },
    });

    // Then create property images using the property ID
    await db.propertyImages.createMany({
      data: uploadedImageUrls.map((url) => ({
        propertyId: property.id,
        image: url,
      })),
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Property created successfully",
      property,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to create property",
    };
  }
};
