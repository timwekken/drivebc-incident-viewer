/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        lg: "0 0px 15px -3px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
