/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // <--- 关键！必须要有 vue
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}