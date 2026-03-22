"use server";

import nodemailer from "nodemailer";

/**
 * Sends an email using Gmail SMTP server
 * 
 * @param to - Recipient's email address
 * @param subject - Subject line of the email
 * @param message - Content of the email (supports both plain text and HTML)
 * @returns Object containing success status, message, and messageId if successful
 */
export async function sendEmail({
  to,
  subject, 
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  // Create email transporter using Gmail SMTP
  // Note: You need to set up GMAIL_USERNAME and GMAIL_PASSWORD in your environment variables
  // For Gmail, you should use an App Password instead of your regular password
  // Learn more: https://support.google.com/accounts/answer/185833
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.GMAIL_USERNAME, // Your Gmail address
      pass: process.env.GMAIL_PASSWORD, // Your Gmail app password
    },
  });

  try {
    // Send email with provided details
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USERNAME, // Sender address (your Gmail)
      to, // Recipient address
      subject, // Email subject
      text: message, // Plain text version
      html: message, // HTML version (same as text in this case)
    });

    console.log("Email sent:", info.messageId);
    
    // Return success response
    return {
      success: true,
      message: "Email sent successfully!",
      messageId: info.messageId,
    };
  } catch (error) {
    // Log and return error if sending fails
    console.error("Email sending error:", error);
    return { success: false, message: "Failed to send email." };
  }
}
