/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fc: {
          emerald: {
            DEFAULT: '#003D27',
            dark: '#002D20',
            light: '#004A2E',
            muted: '#002318'
          },
          yellow: '#FFE500',
          pink: '#FF1688',
          cream: '#F2F2F2',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
