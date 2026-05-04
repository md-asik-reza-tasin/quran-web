"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Play, Pause, BookOpen, Bookmark, MoreHorizontal,
  Search, ChevronLeft, Loader2,
} from "lucide-react";
import { SURAH_META_MAP } from "../SurahSidebar/surahData";
import { useSettings } from "../../app/contexts/SettingsContext";
import SettingsDrawer from "../Settings/SettingsDrawer";

/* ─── Types ─── */
interface AyahData {
  SURA_num: number;
  SURA?: string;
  AYA_num: number;
  AYA?: string;
  Arabic?: string;
  AQ?: string;
}

/* ─── Utilities ─── */
function cleanArabicText(text: string): string {
  return text.replace(/\s*\(\d+\)\s*$/, "").trim();
}

function getAudioUrl(surahNum: number, ayahNum: number): string {
  const s = String(surahNum).padStart(3, "0");
  const a = String(ayahNum).padStart(3, "0");
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
}

/* ─── End-of-Ayah Decorative Mark ─── */
function AyahEndMark({ number }: { number: number }) {
  return (
    <span className="inline-flex items-center justify-center mx-1 align-middle">
      <span className="relative inline-flex items-center justify-center w-10 h-10">
        <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full text-emerald-500/50">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="0.7" fill="none" />
          <circle cx="20" cy="2" r="1.2" fill="currentColor" />
          <circle cx="20" cy="38" r="1.2" fill="currentColor" />
          <circle cx="2" cy="20" r="1.2" fill="currentColor" />
          <circle cx="38" cy="20" r="1.2" fill="currentColor" />
        </svg>
        <span className="text-[11px] font-bold text-emerald-700 z-10">{number}</span>
      </span>
    </span>
  );
}

/* ─── Skeleton Loader ─── */
function AyahSkeleton() {
  return (
    <div className="animate-pulse px-6 py-6 border-b border-gray-100 dark:border-gray-800">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-3 w-12">
          <div className="w-10 h-5 bg-gray-200 rounded" />
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-7 bg-gray-200 rounded w-full" />
          <div className="h-7 bg-gray-100 rounded w-3/4 ml-auto" />
          <div className="h-3 bg-gray-100 rounded w-20 mt-4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

/* ─── Decorative Mosque SVG ─── */
function MosqueSvg() {
  return (
    <svg viewBox="0 0 120 100" className="w-20 h-20 text-gray-200" fill="currentColor">
      <ellipse cx="60" cy="40" rx="22" ry="18" />
      <rect x="38" y="40" width="44" height="35" />
      <rect x="22" y="22" width="7" height="53" />
      <ellipse cx="25.5" cy="22" rx="3.5" ry="5" />
      <circle cx="25.5" cy="16" r="1.8" />
      <rect x="91" y="22" width="7" height="53" />
      <ellipse cx="94.5" cy="22" rx="3.5" ry="5" />
      <circle cx="94.5" cy="16" r="1.8" />
      <rect x="53" y="55" width="14" height="20" rx="7" />
    </svg>
  );
}

/* ─── Action Icon Button ─── */
function ActionBtn({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
        ${active
          ? "bg-emerald-100 text-emerald-600"
          : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        }
      `}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function SurahReader({ surahId }: { surahId: number }) {
  const router = useRouter();
  const { arabicFontSize, translationFontSize, arabicFontFace } = useSettings();
  const [ayahs, setAyahs] = useState<AyahData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const meta = SURAH_META_MAP.get(surahId);

  // ── Fetch ayahs ──
  useEffect(() => {
    const controller = new AbortController();
    async function fetchAyahs() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:5000/api/surah/${surahId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch surah");
        const data: AyahData[] = await res.json();

        // Fetch translations since backend db doesn't have the AQ column
        try {
          const transRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.sahih`, {
            signal: controller.signal,
          });
          if (transRes.ok) {
            const transData = await transRes.json();
            const transAyahs = transData.data?.ayahs || [];
            
            data.forEach(ayah => {
              const translation = transAyahs.find((a: any) => a.numberInSurah === ayah.AYA_num);
              if (translation) {
                ayah.AQ = translation.text;
              }
            });
          }
        } catch (transErr) {
          console.warn("Failed to fetch external translations", transErr);
        }

        setAyahs(data);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAyahs();
    return () => controller.abort();
  }, [surahId]);

  // ── Cleanup audio on unmount ──
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ── Search filter ──
  const filteredAyahs = useMemo(() => {
    if (!searchQuery.trim()) return ayahs;
    const q = searchQuery.toLowerCase();
    return ayahs.filter(
      (a) => a.Arabic?.includes(searchQuery) || a.AYA?.includes(searchQuery) || a.AQ?.toLowerCase().includes(q) || a.AYA_num.toString().includes(q)
    );
  }, [ayahs, searchQuery]);

  // ── Audio toggle ──
  const toggleAudio = useCallback(
    (ayahNum: number) => {
      if (playingAyah === ayahNum && audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play().catch(console.error);
          setPlayingAyah(ayahNum);
        } else {
          audioRef.current.pause();
          setPlayingAyah(null);
        }
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current = null;
      }

      const url = getAudioUrl(surahId, ayahNum);
      const audio = new Audio(url);
      audioRef.current = audio;
      setAudioLoading(true);
      setPlayingAyah(ayahNum);

      audio.play().then(() => {
        setAudioLoading(false);
      }).catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Audio playback error:", err);
          setAudioLoading(false);
          setPlayingAyah(null);
        }
      });

      audio.onended = () => {
        // Auto-play next ayah
        const idx = ayahs.findIndex((a) => a.AYA_num === ayahNum);
        if (idx !== -1 && idx < ayahs.length - 1) {
          const next = ayahs[idx + 1];
          toggleAudio(next.AYA_num);
        } else {
          setPlayingAyah(null);
        }
      };

      audio.onerror = () => {
        setAudioLoading(false);
        setPlayingAyah(null);
      };
    },
    [playingAyah, surahId, ayahs]
  );

  // Scroll to playing ayah
  useEffect(() => {
    if (playingAyah !== null) {
      const el = ayahRefs.current.get(playingAyah);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [playingAyah]);

  const surahNameAr = ayahs[0]?.SURA || "";
  const totalAyahs = ayahs.length;
  const place = meta?.type === "Medinan" ? "Madinah" : "Makkah";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#121212] transition-colors duration-200 relative">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          <h1 className="flex-1 text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
            Surah {meta?.nameEn || `#${surahId}`}
          </h1>

          <div className="relative w-48 sm:w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search in Surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-quran-card border border-gray-200 dark:border-gray-700 rounded-xl placeholder:text-gray-400 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
          </div>

          <SettingsDrawer />
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto surah-scrollbar">
        {/* Surah Header Card */}
        {!loading && !error && (
          <div className="mx-4 sm:mx-6 mt-6 mb-4">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-quran-card border border-gray-100 dark:border-gray-800 shadow-sm px-6 py-10 sm:py-12 text-center flex flex-col items-center justify-center transition-colors">
              {/* Decorative mosque */}
              <div className="absolute top-4 left-4 pointer-events-none opacity-50 dark:opacity-20">
                <MosqueSvg />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white relative z-10">
                Surah {meta?.nameEn || surahNameAr || `Al ${surahId}`}
              </h2>
              
              <p className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase relative z-10">
                Ayah-{totalAyahs}, {place}
              </p>

              {/* Bismillah for all surahs except At-Tawbah (9) */}
              {surahId !== 9 && (
                <div className="mt-8 relative z-10 border-t border-gray-100 dark:border-gray-800 pt-8 w-full max-w-md mx-auto">
                  <p className="font-arabic text-2xl sm:text-3xl text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <AyahSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <span className="text-red-400 text-2xl">!</span>
            </div>
            <p className="text-base text-red-500 font-medium mb-1">Failed to Load</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        )}

        {/* Ayah List */}
        {!loading && !error && (
          <div className="pb-12">
            {filteredAyahs.map((ayah) => {
              const isPlaying = playingAyah === ayah.AYA_num;
              const isLoadingThis = isPlaying && audioLoading;

              return (
                <div
                  key={ayah.AYA_num}
                  ref={(el) => {
                    if (el) ayahRefs.current.set(ayah.AYA_num, el);
                  }}
                  id={`ayah-${ayah.AYA_num}`}
                  className={`
                    border-b border-gray-100 dark:border-gray-800 transition-all duration-300
                    ${isPlaying ? "bg-emerald-50/60 dark:bg-emerald-900/10 border-l-[3px] border-l-emerald-400" : ""}
                  `}
                >
                  <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 py-5 sm:py-6">
                    {/* Left: Index + Action Icons */}
                    <div className="flex flex-col items-center gap-2 w-10 sm:w-12 flex-shrink-0 pt-1">
                      <span className={`text-sm font-bold ${isPlaying ? "text-emerald-600" : "text-emerald-700"}`}>
                        {ayah.SURA_num}:{ayah.AYA_num}
                      </span>

                      {/* Play/Pause */}
                      <ActionBtn
                        label={isPlaying ? "Pause" : "Play"}
                        active={isPlaying}
                        onClick={() => toggleAudio(ayah.AYA_num)}
                      >
                        {isLoadingThis ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : isPlaying ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} className="ml-0.5" />
                        )}
                      </ActionBtn>

                      <ActionBtn label="Tafsir">
                        <BookOpen size={15} />
                      </ActionBtn>

                      <ActionBtn label="Bookmark">
                        <Bookmark size={15} />
                      </ActionBtn>

                      <ActionBtn label="More">
                        <MoreHorizontal size={15} />
                      </ActionBtn>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0">
                      {/* Arabic Text */}
                      <div className="text-right mb-6" dir="rtl">
                        <p 
                          className="font-arabic text-gray-900 dark:text-gray-100 transition-all duration-200" 
                          style={{ 
                            fontFamily: arabicFontFace, 
                            fontSize: `${arabicFontSize}px`, 
                            lineHeight: `${arabicFontSize * 1.8}px`,
                            textRendering: 'optimizeLegibility' 
                          }}
                        >
                          {cleanArabicText(ayah.Arabic || ayah.AYA || '')}
                          <AyahEndMark number={ayah.AYA_num} />
                        </p>
                      </div>

                      {/* Translation */}
                      <div className="text-left border-t border-gray-100 dark:border-gray-800 pt-4">
                        <p className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-2">
                          SAHEEH INTERNATIONAL
                        </p>
                        <p 
                          className="leading-relaxed text-gray-700 dark:text-gray-300 font-sans transition-all duration-200"
                          style={{ fontSize: `${translationFontSize}px` }}
                        >
                          {ayah.AQ || `[Translation for ${meta?.nameEn || ayah.SURA || 'Surah'} ${ayah.AYA_num}]`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAyahs.length === 0 && searchQuery && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="text-gray-300 mb-3" size={32} />
                <p className="text-sm text-gray-400">No matching ayahs found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
