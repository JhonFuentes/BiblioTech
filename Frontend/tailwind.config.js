/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#E3F6F5',
          200: '#A7E0DB',
          300: '#5FB0C9',
          400: '#3E6D9C',
          500: '#2A2F63',
        }
      }
    },
  },
  plugins: [],
}
