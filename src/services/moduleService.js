export const fetchModuleData = async () => {
  const url = `${import.meta.env.VITE_API_URL}/api/module/modules/`;

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
