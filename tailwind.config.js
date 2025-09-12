/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
       colors: {
        primary: {
          DEFAULT: "#284ea1", 
          light: "#4a6fc2",   
          dark: "#1e3c7d",    
        },
        secondary: {
          DEFAULT: "#F59E0B", 
          light: "#FBBF24",   
          dark: "#B45309",    
        },
      },
    },
  },
  plugins: [],
}
