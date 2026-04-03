"use server";

export const sendWhatsappMessage = async (to: string, message: string) => {
  try {
    // TODO: Connect official Twilio or WhatsApp Business API here 
    console.log(`\n========= WHATSAPP NOTIFICATION =========`);
    console.log(`To: ${to}`);
    console.log(`Message: \n${message}`);
    console.log(`=========================================\n`);
    
    // Simulating API call
    return { success: true };
  } catch (error) {
    console.error("Failed to send WhatsApp:", error);
    return { success: false, error };
  }
};
