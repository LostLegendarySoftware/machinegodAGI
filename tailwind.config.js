/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel Decorative', 'serif'],
        tangerine: ['Tangerine', 'cursive'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        typewriter: 'typewriter 3s steps(30) forwards',
      },
      gridTemplateColumns: {
        '40': 'repeat(40, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '40': 'repeat(40, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};