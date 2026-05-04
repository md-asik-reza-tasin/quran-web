"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import SurahSidebar from "./SurahSidebar";

/**
 * Mobile-only slide-out drawer that wraps the SurahSidebar.
 * Hidden on lg: breakpoint and up (where the sidebar is always visible).
 */
export default function SurahDrawer() {
  const [open, setOpen] = useState(false);

  // Close drawer on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Hamburger Toggle — only visible on mobile */}
      <button
        id="surah-drawer-toggle"
        onClick={() => setOpen(true)}
        className="
          lg:hidden fixed top-4 left-4 z-50
          w-11 h-11 rounded-xl
          bg-white/90 dark:bg-[#121212]/90 backdrop-blur-sm border border-gray-200 dark:border-gray-800
          shadow-lg shadow-black/5
          flex items-center justify-center
          hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50
          transition-all duration-200
          active:scale-95
        "
        aria-label="Open Surah Menu"
      >
        <Menu size={20} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Backdrop */}
      <div
        className={`
          lg:hidden fixed inset-0 z-[60]
          bg-black/40 backdrop-blur-[2px]
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 z-[70]
          h-full w-[320px] max-w-[85vw]
          bg-white dark:bg-quran-card shadow-2xl shadow-black/20
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button */}
        <button
          id="surah-drawer-close"
          onClick={close}
          className="
            absolute top-4 right-4 z-10
            w-8 h-8 rounded-lg
            flex items-center justify-center
            hover:bg-gray-100 dark:hover:bg-[#121212] transition-colors
          "
          aria-label="Close Surah Menu"
        >
          <X size={18} className="text-gray-500 dark:text-gray-400" />
        </button>

        <SurahSidebar onNavigate={close} />
      </div>
    </>
  );
}
