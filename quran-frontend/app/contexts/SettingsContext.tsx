"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SettingsState {
  theme: 'light' | 'dark';
  arabicFontSize: number;
  translationFontSize: number;
  arabicFontFace: string;
}

interface SettingsContextType extends SettingsState {
  setTheme: (theme: 'light' | 'dark') => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setArabicFontFace: (font: string) => void;
}

const defaultSettings: SettingsState = {
  theme: 'dark',
  arabicFontSize: 36,
  translationFontSize: 15,
  arabicFontFace: 'Amiri',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('quranSettings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('quranSettings', JSON.stringify(settings));
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  }, [settings, isMounted]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTheme: (val) => updateSetting('theme', val),
        setArabicFontSize: (val) => updateSetting('arabicFontSize', val),
        setTranslationFontSize: (val) => updateSetting('translationFontSize', val),
        setArabicFontFace: (val) => updateSetting('arabicFontFace', val),
      }}
    >
      <div className="flex w-full h-full" style={{ visibility: isMounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
