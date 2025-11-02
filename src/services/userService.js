export const fetchCurrentUser = async () => {
  const url = `${import.meta.env.VITE_API_URL}/api/users/current/`;
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch user" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong" };
  }
};
