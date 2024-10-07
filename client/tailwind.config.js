/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fit-100': 'repeat(auto-fit, minmax(100px, 1fr))'
      },
      colors: {
        'primary-green': '#D5FF5C',
      },
      fontFamily: {
        'paytone-regular': ['Paytone One', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

