"use client";

import { createContext, useContext } from "react";
import { SessionProvider } from "next-auth/react";

interface ThemeContextValue {
  theme: "light";
  toggle: () => void;
  setTheme: (t: "light") => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeContext.Provider value={{ theme: "light", toggle: () => {}, setTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    </SessionProvider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
