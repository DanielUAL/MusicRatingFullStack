/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'Inter': ['Inter', 'sans-serif']
      },
      colors: {
        'tan-color': '#FFF8EC',
        'dark-tan-color': '#7F665F',
        'red': '#FF0000',
      },
    },
  },
  plugins: [],
}

