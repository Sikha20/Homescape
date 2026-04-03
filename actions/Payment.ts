"use server";
import { TProperty } from "@/lib/types";

export const initializePayment = async ({
  property,
  totalAmount,
}: {
  property: TProperty;
  totalAmount: number;
}) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY?.trim()}`
    );
    myHeaders.append("Content-Type", "application/json");
    const khaltiResponse = await fetch(
      process.env.KHALTI_INITIATE_PAYMENT_API_URL || "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          return_url: "http://localhost:3000/manage-listings",
          website_url: "http://localhost:3000",
          amount: Math.round(totalAmount * 100),
          purchase_order_id: property?.id,
          purchase_order_name: (property?.location
            ? `Property Rent - ${property.location}`
            : "Property Rent - Unknown Location").substring(0, 50),
          customer_info: {
            name: property?.landlord?.name || "Unknown",
            email:
              property?.landlord?.emails?.[0]?.email || "unknown@email.com",
            phone: "9800000000",
          },
        }),
        redirect: "follow",
      }
    );

    if (!khaltiResponse.ok) {
      const errorData = await khaltiResponse.json();
      console.error("Khalti Error Response:", errorData);
      throw new Error(
        errorData.detail || errorData.message || JSON.stringify(errorData)
      );
    }

    const response = await khaltiResponse.json();

    if (!response || !response.payment_url) {
      throw new Error("Invalid response format: Missing payment URL");
    }

    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("Payment initialization error:", error);
    return {
      success: false,
      message: `Error initializing payment`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
