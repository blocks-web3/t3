import React, { useCallback, useContext, useState } from "react";

// set context type
type LoadingContext = {
  isLoading: boolean;
  setLoading: (isDark: boolean) => void;
};

// context default value
const defaultContext: LoadingContext = {
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLoading: () => {},
};

// 認証情報と認証情報セットのContext
export const LoadingContext =
  React.createContext<LoadingContext>(defaultContext);

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const LoadingContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isLoading, setLoadingState] = useState(false);
  const setLoading = useCallback((current: boolean): void => {
    setLoadingState(current);
  }, []);
  const ctx = { isLoading, setLoading };
  return (
    <LoadingContext.Provider value={ctx}>{children}</LoadingContext.Provider>
  );
};
