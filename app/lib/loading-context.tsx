"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import GlobalLoadingOverlay from "@/app/components/GlobalLoadingOverlay";

type LoadingContextValue = {
  isLoading: boolean;
  withLoading: <T>(task: () => Promise<T>) => Promise<T>;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const withLoading = useCallback(async <T,>(task: () => Promise<T>) => {
    setCount((c) => c + 1);
    try {
      return await task();
    } finally {
      setCount((c) => c - 1);
    }
  }, []);

  const value = useMemo(
    () => ({ isLoading: count > 0, withLoading }),
    [count, withLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {value.isLoading && <GlobalLoadingOverlay />}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useGlobalLoading must be used within LoadingProvider");
  }
  return ctx;
}
