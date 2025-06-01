/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#8A5742', // brown
        'primary-light': '#B89C86', // light brown
        secondary: '#DBD9D8', // almost white
        'secondary-light': '#E1E8E9', // light sky blue
        tertiary: '#8B8482', // gray
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
