/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: ['login-background'],
  theme: {
    extend: {
      colors: {
        okip: {
          100: '#E3E7F5',
          200: '#BDC7E6',
          300: '#97A6D8',
          400: '#7185C9',
          500: '#071952',
          600: '#051441',
          700: '#040E31',
          800: '#020921',
          900: '#010411',
          505: '#004080',
          605: '#003366'
        }
      }
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}