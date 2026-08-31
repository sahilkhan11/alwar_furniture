/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#3A2618',     // Deep Wood Brown
          primary: '#8A5A44',  // Warm Wood
          accent: '#D4A373',   // Gold/Ochre
          light: '#FAEDCD',    // Soft Cream
          bg: '#FEFAE0',       // Off-white background
        }
      }
    },
  },
  plugins: [],
}
