import { useEffect, useState } from "react";

export function useFetch(fetcher, args = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fetcher) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher(...args);
        if (result?.success) {
          setData(result.data);
        } else {
          setError(result?.error || "Failed to load data");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetcher, ...args]);

  return { data, loading, error };
}
