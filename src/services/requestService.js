export const submitRequest = async (payload) => {
  const url = `${import.meta.env.VITE_API_URL}/api/requests/submit/`;

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
  const url = `${import.meta.env.VITE_API_URL}/api/requests/types/`;

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
  }/api/requests/view/?ref=${refNumber}`;

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

export const fetchRequestListData = async (url = null, params = {}) => {
  try {
    const apiUrl = url || `${import.meta.env.VITE_API_URL}/api/requests/`;
    const accessToken = localStorage.getItem("access_token");

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;

    const response = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error?.message || "Something went wrong" };
  }
};

export const updateRequestStatusByRef = async ({ ref_no, status, remarks }) => {
  if (!ref_no) {
    return {
      success: false,
      error: "Reference number is required",
    };
  }

  if (!status) {
    return {
      success: false,
      error: "Request status is required",
    };
  }

  const url = `${
    import.meta.env.VITE_API_URL
  }/api/requests/update_status_by_ref/`;
  const accessToken = localStorage.getItem("access_token");

  try {
    const body = { ref_no };
    if (status !== undefined) body.status = status;
    if (remarks !== undefined) body.remarks = remarks;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error?.message || "Something went wrong" };
  }
};

export const fetchRequestStatusesData = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, error: "User is not authenticated" };
  }

  const url = `${import.meta.env.VITE_API_URL}/api/requests/statuses`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Unknown error occurred",
      };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Network Error" };
  }
};
