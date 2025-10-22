import { useState, useEffect } from "react";

export function useCachedData(
  key,
  fetchFunction,
  defaultValue = null,
  propertyName = null
) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const stored = localStorage.getItem(key);

      if (stored) {
        setData(JSON.parse(stored));
        setLoading(false);
      } else {
        try {
          const result = await fetchFunction();

          let value = defaultValue;

          if (result && typeof result === "object") {
            value =
              propertyName && result[propertyName] !== undefined
                ? result[propertyName]
                : result;
          }

          setData(value);
          localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
          setError(err.message || "Something went wrong");
          if (defaultValue) {
            setData(defaultValue);
            localStorage.setItem(key, JSON.stringify(defaultValue));
          }
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}
