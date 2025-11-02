// Todo: Other config data

import { createContext, useContext } from "react";
import { useCachedData } from "../hooks/useCachedData";
import { fetchBrandingData } from "../services/configService";

// 1. Create the Context
export const ConfigDataContext = createContext(undefined);

// 2. Create the Provider Component
export const ConfigDataProvider = ({ children }) => {
  // Use your hook to manage the data and caching
  const brandingData = useCachedData(
    "branding", // The key for localStorage
    fetchBrandingData,
    {
      app_name: "Boarding House Management System",
    }
  );

  const combinedValue = {
    // You can rename the properties here for clarity in consumers
    branding: brandingData.data,
    brandingLoading: brandingData.loading,
    brandingError: brandingData.error,
  };

  return (
    <ConfigDataContext.Provider value={combinedValue}>
      {children}
    </ConfigDataContext.Provider>
  );
};

export const useConfigData = () => {
  const context = useContext(ConfigDataContext);
  if (!context)
    throw new Error("useConfigData must be used within a ConfigDataProvider");
  return context;
};
