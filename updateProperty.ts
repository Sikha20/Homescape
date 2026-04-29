"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { Location, PropertyType } from "@/lib/types";

export async function updateProperty(formData: FormData, id: string) {
  try {
    // Extract form data
    const location = formData.get("location") as Location;
    const latitude = formData.get("latitude") ? Number(formData.get("latitude")) : undefined;
    const longitude = formData.get("longitude") ? Number(formData.get("longitude")) : undefined;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as PropertyType;
    const noOfRooms = Number(formData.get("noOfRooms"));
    const noOfBathrooms = Number(formData.get("noOfBathrooms"));
    const description = formData.get("description")?.toString() as string;
    const imageFiles = formData.getAll("images") as File[];
    // Validate the property data against schema

    // Handle image uploads if new images are provided
    const uploadedImageUrls: string[] = [];

    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
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

        uploadedImageUrls.push(result.secure_url);
      }
    }

    // Update property in database
    const updatedProperty = await db.property.update({
      where: {
        id: id,
      },
      data: {
        location,
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        price,
        category,
        noOfRooms,
        noOfBathrooms,
        description,
      },
    });

    if (uploadedImageUrls.length > 0) {
      // Delete existing images
      await db.propertyImages.deleteMany({
        where: {
          propertyId: id,
        },
      });

      // Create new property images
      await db.propertyImages.createMany({
        data: uploadedImageUrls.map((url) => ({
          propertyId: id,
          image: url,
        })),
      });
    }

    if (!updatedProperty) {
      return {
        success: false,
        message: "Failed to update property",
      };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Property updated successfully",
    };
  } catch (error) {
    console.error("Property update error:", error);
    return {
      success: false,
      message: "An error occurred while updating the property",
    };
  }
}
