/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D00",
        background: "#FFF",
        default: "#142228",
        major: "#E00",
        warning: "#FF580A",
        info: "#3F5661"
      },
      boxShadow: {
        lg: "0 0px 15px -3px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
