/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        messmate: {
          primary: '#0f766e',
          secondary: '#14b8a6'
        }
      }
    }
  },
  plugins: []
};
