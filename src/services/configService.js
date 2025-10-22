export const fetchBrandingData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/config/branding/`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
};
