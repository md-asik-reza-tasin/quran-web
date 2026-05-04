"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import SettingsPanel from "./SettingsPanel";

export default function SettingsDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 sm:p-2.5 rounded-lg transition-colors ${isOpen ? 'bg-emerald-50 dark:bg-quran-green/20 text-quran-green' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
        aria-label="Settings"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 animate-in slide-in-from-bottom-full duration-300">
            <SettingsPanel />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="hidden sm:block absolute top-16 right-6 z-50">
          <div 
            className="fixed inset-0 z-[-1]"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative animate-in fade-in zoom-in-95 duration-200">
            <SettingsPanel />
          </div>
        </div>
      )}
    </>
  );
}
