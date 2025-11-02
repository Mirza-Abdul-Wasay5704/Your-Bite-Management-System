/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFC107',      // Vibrant amber/yellow
        secondary: '#1A1A1A',    // Deep black
        accent: '#FFD54F',       // Light yellow accent
        background: '#FFF9E6',   // Warm light yellow background
        text: '#1A1A1A',         // Black text
        'gray-soft': '#F5F5F5',  // Soft gray for cards
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
