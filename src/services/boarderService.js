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

export const fetchBoarderListData = async (url = null) => {
  const apiUrl = url || `${import.meta.env.VITE_API_URL}/api/boarder/`;
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await fetch(apiUrl, {
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
