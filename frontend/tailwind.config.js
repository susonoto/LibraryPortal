/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neo: {
          light: '#e0e5ec',
          dark: '#1a1d23',
          card: '#e0e5ec',
          cardDark: '#2a2e38',
          accent: '#6c63ff',
          accent2: '#00d9ff',
          text: '#2d3436',
          textDark: '#dfe6e9',
        }
      },
      boxShadow: {
        'neo': '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff',
        'neo-inset': 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff',
        'neo-dark': '9px 9px 16px #0d0f12, -9px -9px 16px #272b34',
        'neo-dark-inset': 'inset 6px 6px 12px #0d0f12, inset -6px -6px 12px #272b34',
        'neo-sm': '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff',
        'neo-sm-dark': '5px 5px 10px #0d0f12, -5px -5px 10px #272b34',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
