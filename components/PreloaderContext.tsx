"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PreloaderContextValue {
  ready: boolean;
  setReady: () => void;
}

const PreloaderContext = createContext<PreloaderContextValue>({
  ready: false,
  setReady: () => {},
});

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [ready, setReadyState] = useState(false);
  return (
    <PreloaderContext.Provider value={{ ready, setReady: () => setReadyState(true) }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloaderReady() {
  return useContext(PreloaderContext);
}
