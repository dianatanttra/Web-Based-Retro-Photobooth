/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'photobooth': ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
  animation: {
   flash: 'flash 0.2s ease-out',
 },
 keyframes: {
   flash: {
     '0%': { opacity: '0' },
     '50%': { opacity: '1' },
     '100%': { opacity: '0' },
   },
 },
}


