/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm': ['"IBM Plex Sans Thai"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
