"use client";

import React, { useState } from 'react';
import { useSettings } from '../../app/contexts/SettingsContext';
import { Type, ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react';

export default function SettingsPanel() {
  const { 
    theme, setTheme, 
    arabicFontSize, setArabicFontSize, 
    translationFontSize, setTranslationFontSize,
    arabicFontFace, setArabicFontFace
  } = useSettings();

  const [fontSectionOpen, setFontSectionOpen] = useState(true);

  return (
    <div className="w-full max-w-[360px] mx-auto bg-white dark:bg-quran-card rounded-t-2xl sm:rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col transition-colors duration-200">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-quran-card">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Settings</h3>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-quran-green dark:hover:text-quran-green transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[60vh] sm:max-h-[80vh] p-4 bg-white dark:bg-quran-card">
        {/* Font Settings Accordion */}
        <div className="mb-4">
          <button 
            onClick={() => setFontSectionOpen(!fontSectionOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-[#121212] rounded-xl hover:bg-gray-100 dark:hover:bg-black transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-quran-green/20 flex items-center justify-center text-quran-green">
                <Type size={16} />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Font Settings</span>
            </div>
            {fontSectionOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          {fontSectionOpen && (
            <div className="mt-4 space-y-6 px-1">
              {/* Arabic Font Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Arabic Font Size</label>
                  <span className="text-sm font-bold text-quran-green">{arabicFontSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="20" max="60" 
                  value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-quran-green"
                />
              </div>

              {/* Translation Font Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Translation Font Size</label>
                  <span className="text-sm font-bold text-quran-green">{translationFontSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="12" max="30" 
                  value={translationFontSize}
                  onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-quran-green"
                />
              </div>

              {/* Arabic Font Face */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Arabic Font Face</label>
                <select 
                  value={arabicFontFace}
                  onChange={(e) => setArabicFontFace(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-quran-green/50 cursor-pointer"
                >
                  <option value="Amiri">Amiri</option>
                  <option value="'King Fahad Glorious Quran', serif">KFGQ (King Fahad)</option>
                  <option value="'Scheherazade New', serif">Scheherazade New</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
