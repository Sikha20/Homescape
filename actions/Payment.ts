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
    myHeaders.append("Authorization", "Key 05bf95cc57244045b8df5fad06748dab");
    myHeaders.append("Content-Type", "application/json");
    const khaltiResponse = await fetch(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          return_url: "http://localhost:3000/manage-listings",
          website_url: "http://localhost:3000",
          amount: Math.round(totalAmount * 100).toString(),
          purchase_order_id: property?.id,
          purchase_order_name: property?.location
            ? `Property Rent - ${property.location}`
            : "Property Rent - Unknown Location",
          customer_info: {
            name: property?.landlord?.name || "Unknown",
            email:
              property?.landlord?.emails?.[0]?.email || "unknown@email.com",
          },
        }),
        redirect: "follow",
      }
    );

    if (!khaltiResponse.ok) {
      const errorData = await khaltiResponse.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${khaltiResponse.status}`
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
