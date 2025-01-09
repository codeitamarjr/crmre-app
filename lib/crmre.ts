import axios from 'axios';
import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";


export interface Property {
  id: number;
  address: string;
  property_name: string;
  city: string;
  country: string;
  description: string;
  rate: string;
  featured?: boolean;
}

export async function getProperties({
  endpoint = 'units',
  id,
  featured,
  query,
  limit,
}: {
  endpoint?: 'units' | 'units/featured' | `units/${number}`;
  id?: number;
  featured?: boolean;
  query?: string;
  limit?: number;
}): Promise<Property[]> {
  try {
    const url = `https://mdpm.realenquiries.com/api/v1/${endpoint}`;
    const response = await axios.get<{ data: Property[] }>(url, {
      params: {
        id,
        featured: featured ? 'true' : undefined,
        query,
        limit,
      },
    });

    if (response.data.data.length === 0) {
      Alert.alert('No properties found');
    }

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
  skipAlert?: boolean;
  customAlert?: (message: string) => void;
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
  skipAlert = false,
  customAlert,
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

        if (!skipAlert) {
          if (customAlert) {
            customAlert(errorMessage);
          } else {
            Alert.alert("Error", errorMessage);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [fn, skipAlert, customAlert]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, [fetchData, params, skip]);

  const refetch = async (newParams: P = params) => await fetchData(newParams);

  return { data, loading, error, refetch };
};

