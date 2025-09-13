import React, { createContext, useContext, useEffect, useState } from "react";
import { Storage } from "@/lib/storage";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  effectiveTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  isSystemDarkMode: boolean;
};

const initialState: ThemeProviderState = {
  theme: "light",
  effectiveTheme: "light",
  setTheme: () => null,
  isSystemDarkMode: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isSystemDarkMode, setIsSystemDarkMode] = useState<boolean>(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    // Charge le thème depuis Storage
    Storage.getValue<Theme>("theme")
      .then((storedTheme) => {
        if (storedTheme) {
          setTheme(storedTheme);
        } else {
          setTheme(defaultTheme);
        }
      })
      .catch(console.error);
  }, [defaultTheme]);

  // Calcul du thème effectif
  const effectiveTheme: "light" | "dark" =
    theme === "system" ? (isSystemDarkMode ? "dark" : "light") : theme;

  // Écoute les changements du mode sombre système
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Applique le thème au DOM
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);

    Storage.setValue("theme", theme).catch(console.error);
    Storage.updateUserSettings({ theme }).catch(console.error);
  }, [theme, effectiveTheme]);

  // Charge et applique le thème personnalisé si présent
  useEffect(() => {
    Storage.getValue<any>("customTheme")
      .then((customTheme) => {
        if (customTheme) {
          applyCustomThemeColors(customTheme, effectiveTheme);
        }
      })
      .catch(console.error);
  }, [effectiveTheme]);

  const applyCustomThemeColors = (customTheme: any, mode: "light" | "dark") => {
    const root = document.documentElement;

    if (customTheme.colors) {
      Object.entries(customTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value as string);
      });

      if (mode === "dark" && customTheme.darkColors) {
        Object.entries(customTheme.darkColors).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value as string);
        });
      }
    }
  };

  const value = {
    theme,
    effectiveTheme,
    isSystemDarkMode,
    setTheme: (newTheme: Theme) => {
      Storage.setValue("theme", newTheme).catch(console.error);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
