/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        boxShadow: {
          glow: "0 0 15px rgba(212, 175, 55, 0.3)",
        },
      },
    },
    plugins: [],
  }
  