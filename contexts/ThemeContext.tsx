"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  activeSection: number;
  previousSection: number;
  setActiveSection: (section: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [previousSection, setPreviousSection] = useState(0);

  const handleSetActiveSection = (section: number) => {
    setPreviousSection(activeSection);
    setActiveSection(section);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        setIsDark,
        activeSection,
        previousSection,
        setActiveSection: handleSetActiveSection,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
