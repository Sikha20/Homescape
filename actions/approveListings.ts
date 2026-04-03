"use server";
import { db } from "@/lib/db";
import { sendEmail } from "./sendEmail";
import { revalidatePath } from "next/cache";
import { sendWhatsappMessage } from "./sendWhatsapp";

export const approveListings = async (id: string, email: string) => {
  try {
    await db.property
      .update({
        where: { id },
        data: { isListed: true },
      })
      .catch((error: any) => {
        throw new Error(`Failed to update property: ${error.message}`);
      });

    try {
      await sendEmail({
        to: email,
        subject: "Listing Approval Confirmation",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px;">
              <img src={"/logo.png"} alt="Homescape Logo" style="max-width: 200px;">
            </div>
            
            <div style="padding: 20px; background-color: #ffffff; border-radius: 5px;">
              <h2 style="color: #333;">Listing Approval Confirmation</h2>
              
              <p style="color: #666; line-height: 1.6;">Dear Property Owner,</p>
              
              <p style="color: #666; line-height: 1.6;">
                Congratulations! We are pleased to inform you that your property listing has been approved 
                and is now live on our platform. Your property is now visible to potential tenants.
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                If you need any assistance or have questions about managing your listing, 
                our support team is here to help:
              </p>
              
              <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0; color: #666;">
                  <strong>Phone:</strong> 01-123456
                </p>
                <p style="margin: 5px 0; color: #666;">
                  <strong>Email:</strong> support@Homescape.com
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Thank you for choosing Homescape. We look forward to helping you connect with the right tenants.
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                Best regards,<br>
                Homescape Team
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
      // Continue execution even if email fails
    }

    try {
      // Simulate WhatsApp message to landlord
      await sendWhatsappMessage(
        "+9779800000000", // Replace with real landlord phone number from DB
        `Congratulations! Your property listing has been approved and is now live on Homescape.`
      );
    } catch (waError) {
      console.error("Failed to send WhatsApp:", waError);
    }

    revalidatePath(`admin/property/${id}`);

    return {
      success: true,
      message: "Property Approved Successfully and email sent to landlord",
    };
  } catch (error) {
    console.error("Property approval failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Property Approval Failed",
      error,
    };
  }
};
