/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#F4A261', // Warm Orange
        secondary: '#4A90E2', // Soft Blue
        background: '#FAF3E0', // Cream
        textPrimary: '#333333', // Charcoal
        accent: '#88B04B', // Grass Green
        gold: '#FFD700', // gold for favorite star
      },
      fontFamily: {
        'lexend-black': ['lexend-black'],
        'lexend-bold': ['lexend-bold'],
        'lexend-extrabold': ['lexend-extrabold'],
        'lexend-extralight': ['lexend-extralight'],
        'lexend-light': ['lexend-light'],
        'lexend-medium': ['lexend-medium'],
        'lexend-regular': ['lexend-regular'],
        'lexend-semibold': ['lexend-semibold'],
        'lexend-thin': ['lexend-thin'],
      },
    },
  },
  plugins: [],
};
