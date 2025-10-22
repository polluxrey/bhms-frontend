import { useContext, useEffect } from "react";
import { ConfigDataContext } from "../context/configDataContext";

// Custom hook to set document title using app branding
export function useDocumentTitle(pageTitle) {
  const { branding } = useContext(ConfigDataContext);
  const appName = branding?.app_name || "App";

  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${appName}` : `${appName}`;
  }, [pageTitle, appName]);
}
