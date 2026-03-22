export const checkPaymentStatus = async (pidx: string) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Key 05bf95cc57244045b8df5fad06748dab");
    myHeaders.append("Content-Type", "application/json");

    const khaltiResponse = await fetch(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ pidx }),
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

    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("Payment status check error:", error);
    return {
      success: false,
      message: "Error checking payment status",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
