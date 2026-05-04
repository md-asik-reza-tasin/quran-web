/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
    "./Shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: "#353734",
        quran: {
          green: "#2e7d32",
          dark: "#121212",
          card: "#1E1E1E",
        }
      },
      fontFamily: {
        amiri: ['"Amiri"', 'serif'],
        kfgq: ['"King Fahad Glorious Quran"', 'serif'],
        scheherazade: ['"Scheherazade New"', 'serif'],
      }
    },
  },
  plugins: [],
};