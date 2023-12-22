/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,svelte}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'calculator': '3fr 1fr'
      }
    },
    fontFamily:{
      'digital': 'Orbitron, sans-serif;'
    }
  },
  plugins: [],
}

