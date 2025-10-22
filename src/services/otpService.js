export const fetchOTP = async (payload) => {
  const url = `${import.meta.env.VITE_API_URL}/api/otp/send/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};

export const verifyOTP = async (payload) => {
  const url = `${import.meta.env.VITE_API_URL}/api/otp/verify/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};
