/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: 'rgba(255, 255, 255, 0.05)',
        surfaceBorder: 'rgba(255, 255, 255, 0.1)',
        primary: '#6366f1', // Indigo
        primaryHover: '#4f46e5',
        textMain: '#f3f4f6',
        textMuted: '#9ca3af',
      },
    },
  },
  plugins: [],
}
