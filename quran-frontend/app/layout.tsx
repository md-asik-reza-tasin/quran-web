import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import Sidebar from "../Shared/Sidebar";
import SurahSidebar from "../Components/SurahSidebar/SurahSidebar";
import SurahDrawer from "../Components/SurahSidebar/SurahDrawer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "./contexts/SettingsContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "Quran App",
  description: "Read and explore the Holy Quran",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${amiri.variable}`}>
      <body className={`${inter.className} flex bg-white dark:bg-[#121212] text-slate-900 dark:text-gray-100 transition-colors duration-200`}>
        <SettingsProvider>
          <TooltipProvider>
            <div className="hidden lg:block bg-white dark:bg-[#121212]">
              <Sidebar />
            </div>

            <div className="hidden lg:block w-[320px] h-screen border-r border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-quran-card">
              <SurahSidebar />
            </div>

            <SurahDrawer />

            <main className="flex-1 h-screen overflow-y-auto bg-white dark:bg-[#121212]">
              {children}
            </main>
          </TooltipProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}