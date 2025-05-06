/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#FF4319',
          800: '#FFF4F2',
        },
        red: {
          600: '#FF0000',
        },
        gray: {
          default: '#242728',
        },
        custom: {
          background: '#f2f2f3',
        },
        boxShadow: {
          custom1: '0px 1px 2px 0px rgba(16, 24, 40, 0.06)', // #1018280F
          custom2: '0px 1px 3px 0px rgba(16, 24, 40, 0.1)', // #1018281A
        },
      },
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [],
};
