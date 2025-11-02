export const submitPayment = async (payload) => {
  const url = `${import.meta.env.VITE_API_URL}/api/payment/pay/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: payload,
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to submit data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};

export const fetchPaymentListData = async (boarderId, page = 1) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/payment/payments/?boarderId=${boarderId}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.detail || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};

export const fetchPaymentTypeData = async () => {
  const url = `${import.meta.env.VITE_API_URL}/api/payment/types/`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};

export const fetchPaymentMethodData = async () => {
  const url = `${import.meta.env.VITE_API_URL}/api/payment/methods/`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};

export const updatePayment = async (payment_id, action) => {
  const url = `${import.meta.env.VITE_API_URL}/api/payment/update/`;

  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id: payment_id,
        action,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to confirm payment",
      };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};
