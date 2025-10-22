export const submitRequest = async (payload) => {
  const url = `${import.meta.env.VITE_API_URL}/api/request/submit/`;

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

export const fetchRequestTypeData = async () => {
  const url = `${import.meta.env.VITE_API_URL}/api/request/types/`;

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

export const fetchRequestByRef = async (refNumber) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/request/view/?ref=${refNumber}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Request not found" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};
