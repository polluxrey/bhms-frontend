export const fetchNameData = async () => {
  const url = `${import.meta.env.VITE_API_URL}/api/boarder/names/`;

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

export const fetchBoarderListData = async (url = null, params = {}) => {
  const apiUrl = url || `${import.meta.env.VITE_API_URL}/api/boarder/`;
  const accessToken = localStorage.getItem("access_token");

  try {
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
    return { success: false, error: error.message || "Something went wrong" };
  }
};

export const fetchBoarderDetailsData = async (id) => {
  const url = `${import.meta.env.VITE_API_URL}/api/boarder/${id}`;
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await fetch(url, {
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
    return { success: false, error: error.message || "Something went wrong" };
  }
};

export const fetchBoarderData = async (id) => {
  if (!id) {
    return { success: false, error: "Boarder information is unavailable" };
  }

  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, error: "User is not authenticated" };
  }

  const url = `${import.meta.env.VITE_API_URL}/api/boarder/${id}/full`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Unknown error occurred",
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Network Error" };
  }
};

export const fetchAcademicProgramData = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, error: "User is not authenticated" };
  }

  const url = `${import.meta.env.VITE_API_URL}/api/boarder/academic-programs`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Unknown error occurred",
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Network Error" };
  }
};

export const fetchYearLevelData = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, error: "User is not authenticated" };
  }

  const url = `${import.meta.env.VITE_API_URL}/api/boarder/year-levels`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Unknown error occurred",
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Network Error" };
  }
};

export const fetchRoomData = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, error: "User is not authenticated" };
  }

  const url = `${import.meta.env.VITE_API_URL}/api/boarder/rooms`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Unknown error occurred",
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Network Error" };
  }
};

export const fetchSchoolData = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, error: "User is not authenticated" };
  }

  const url = `${import.meta.env.VITE_API_URL}/api/boarder/schools`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Unknown error occurred",
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch data" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Network Error" };
  }
};

export const updateBoarder = async (id, formData) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, error: "User is not authenticated" };
  }

  const url = `${import.meta.env.VITE_API_URL}/api/boarder/${id}/full/`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Unknown error occurred",
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Network Error" };
  }
};

export const createBoarder = async (formData) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, error: "User is not authenticated" };
  }

  const url = `${import.meta.env.VITE_API_URL}/api/boarder/`; // fixed backticks

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Unknown error occurred",
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Network Error" };
  }
};
