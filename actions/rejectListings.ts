"use server";

import { db } from "@/lib/db";
import { sendEmail } from "./sendEmail";
import { revalidatePath } from "next/cache";

export const rejectListings = async (
  id: string,
  email: string,
  reason?: string
) => {
  try {
    await db.property.update({
      where: {
        id,
      },
      data: {
        isListed: false,
      },
    });

    try {
      await sendEmail({
        to: email,
        subject: "Listing Rejection Notice",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px;">
              <img src={"/logo.png"} alt="Homescape Logo" style="max-width: 200px;">
            </div>
            
            <div style="padding: 20px; background-color: #ffffff; border-radius: 5px;">
              <h2 style="color: #333;">Listing Rejection Notice</h2>
              
              <p style="color: #666; line-height: 1.6;">Dear Property Owner,</p>
              
              <p style="color: #666; line-height: 1.6;">
                We regret to inform you that your property listing has been rejected
                ${reason
            ? `due to the following reason:</p>
                <p style="color: #666; line-height: 1.6; padding: 10px; background-color: #f8f8f8; border-left: 4px solid #ff4444;">
                  ${reason}
                </p>`
            : "."
          }
              
              <p style="color: #666; line-height: 1.6;">
                If you would like to discuss this further or need additional clarification, 
                please don't hesitate to contact our support team:
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
                We appreciate your understanding and hope to assist you better in the future.
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                Best regards,<br>
                Homescape Team
              </p>
            </div>
          </div>
        `,
      });
      revalidatePath(`admin/property/${id}`);
      return {
        success: true,
        message: "Listing rejected successfully and email sent to the landlord",
      };
    } catch (emailError) {
      console.error("Error sending rejection email:", emailError);
      return {
        success: false,
        message: "Listing rejected but failed to send notification email",
      };
    }
  } catch (dbError) {
    console.error("Error updating database:", dbError);
    return {
      success: false,
      message: "Failed to reject listing",
    };
  }
};
