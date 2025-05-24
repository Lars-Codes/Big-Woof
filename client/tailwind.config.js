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
        'hn-black': ['hn-black'],
        'hn-bold': ['hn-bold'],
        'hn-heavy': ['hn-heavy'],
        'hn-light': ['hn-light'],
        'hn-medium': ['hn-medium'],
        'hn-thin': ['hn-thin'],
        'hn-ultralight': ['hn-ultralight'],
      },
    },
  },
  plugins: [],
};
