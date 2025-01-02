import axios from 'axios';
import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";


interface Property {
  id: number;
  name: string;
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}): Promise<Property[]> {
  try {
    const response = await axios.get<{ data: Property[] }>('https://mdpm.realenquiries.com/api/units/available', {
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

interface UseCRMREOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseCRMREReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

export const useCRMRE = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseCRMREOptions<T, P>): UseCRMREReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  const refetch = async (newParams: P) => await fetchData(newParams);

  return { data, loading, error, refetch };
};

