"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { SURAH_META_MAP } from "./surahData";

interface SurahFromAPI {
  SURA_num: number;
  SURA: string;
  ayah_count: number;
}

interface SurahItem {
  id: number;
  nameAr: string;
  nameEn: string;
  translation: string;
  ayahCount: number;
  type: string;
}

/* ─── Skeleton Loader ─── */
function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      {/* Diamond */}
      <div className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center">
        <div className="w-[30px] h-[30px] rotate-45 rounded-[6px] bg-gray-200" />
      </div>
      {/* Text lines */}
      <div className="flex-1 space-y-2">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-3 w-20 rounded bg-gray-100" />
      </div>
      {/* Arabic placeholder */}
      <div className="h-5 w-16 rounded bg-gray-200" />
    </div>
  );
}

/* ─── Diamond Badge ─── */
function DiamondBadge({
  number,
  isActive,
}: {
  number: number;
  isActive: boolean;
}) {
  return (
    <div className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center">
      <div
        className={`
          w-[32px] h-[32px] rotate-45 rounded-[7px] flex items-center justify-center
          transition-all duration-300 border
          ${
            isActive
              ? "bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/25"
              : "bg-gray-50 dark:bg-[#121212] border-gray-200 dark:border-gray-700 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:border-emerald-200 dark:group-hover:border-emerald-800"
          }
        `}
      >
        <span
          className={`
            -rotate-45 text-xs font-bold leading-none
            ${isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"}
          `}
        >
          {number}
        </span>
      </div>
    </div>
  );
}

/* ─── Main SurahSidebar ─── */
export default function SurahSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [surahs, setSurahs] = useState<SurahItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Determine active surah from URL
  const activeSurahId = useMemo(() => {
    const match = pathname.match(/\/surah\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }, [pathname]);

  // Fetch surahs from API
  useEffect(() => {
    const controller = new AbortController();

    async function fetchSurahs() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/api/surahs", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch surahs");
        const data: SurahFromAPI[] = await res.json();

        const merged: SurahItem[] = data.map((s) => {
          const meta = SURAH_META_MAP.get(s.SURA_num);
          return {
            id: s.SURA_num,
            nameAr: s.SURA,
            nameEn: meta?.nameEn ?? `Surah ${s.SURA_num}`,
            translation: meta?.translation ?? "",
            ayahCount: s.ayah_count,
            type: meta?.type ?? "Meccan",
          };
        });

        setSurahs(merged);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSurahs();
    return () => controller.abort();
  }, []);

  // Local search filter
  const filtered = useMemo(() => {
    if (!search.trim()) return surahs;
    const q = search.toLowerCase();
    return surahs.filter(
      (s) =>
        s.nameEn.toLowerCase().includes(q) ||
        s.translation.toLowerCase().includes(q) ||
        s.nameAr.includes(search) ||
        s.id.toString().includes(q)
    );
  }, [surahs, search]);

  function handleClick(id: number) {
    router.push(`/surah/${id}`);
    onNavigate?.();
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-quran-card transition-colors duration-200">
      {/* ── Header ── */}
      <div className="px-4 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Surahs
        </h2>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <input
            id="surah-search"
            type="text"
            placeholder="Search Surah"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-9 pr-4 py-2.5 text-sm
              bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl
              placeholder:text-gray-400 text-gray-800 dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto surah-scrollbar px-2 py-2">
        {loading ? (
          <div className="space-y-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <p className="text-sm text-red-500 font-medium mb-1">Connection Error</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="text-gray-300 mb-3" size={32} />
            <p className="text-sm text-gray-400">No surahs found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((surah) => {
              const isActive = surah.id === activeSurahId;
              return (
                <button
                  key={surah.id}
                  id={`surah-card-${surah.id}`}
                  onClick={() => handleClick(surah.id)}
                  className={`
                    group w-full flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-200 cursor-pointer text-left
                    ${
                      isActive
                        ? "bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 shadow-sm"
                        : "bg-white dark:bg-quran-card border border-transparent hover:bg-gray-50 dark:hover:bg-[#121212] hover:border-gray-200 dark:hover:border-gray-800 hover:shadow-sm"
                    }
                  `}
                >
                  {/* Diamond Badge */}
                  <DiamondBadge number={surah.id} isActive={isActive} />

                  {/* Center: Name + Translation */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isActive ? "text-emerald-800 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {surah.nameEn}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                      {surah.translation}
                    </p>
                  </div>

                  {/* Right: Arabic Name */}
                  <div className="flex-shrink-0 text-right">
                    <p
                      className={`text-base leading-tight font-arabic ${
                        isActive ? "text-emerald-700 dark:text-emerald-500" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {surah.nameAr}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {surah.ayahCount} Ayahs
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
