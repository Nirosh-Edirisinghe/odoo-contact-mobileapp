/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        odoo: {
          light: "#C084FC",   // main color
          dark: "#E9D5FF ",      // hover
        },
      },
    },
  },
  plugins: [],
}