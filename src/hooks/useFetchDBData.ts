import { useState, useEffect, useCallback } from "react";
import { type QueryType } from "../types/query";
import { fetchDBData } from "../lib/fetchDBData";

export default function useFetchDBData<T, IsArray extends boolean = true>(
  query: QueryType | null,
  fetchOnMount = true,
  dependencies?: unknown[]
) {
  const [data, setData] = useState<IsArray extends true ? T[] : T | null>(
    null as IsArray extends true ? T[] : T | null
  );
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    const { data: returnedData, error } = await fetchDBData<T, IsArray>(query);
    if (error) {
      setData((Array.isArray(returnedData) ? [] : null) as typeof data);
      setError(error);
    }

    setData(returnedData);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchOnMount, ...(dependencies ?? [])]);

  return { data, error, loading, fetchData };
}
