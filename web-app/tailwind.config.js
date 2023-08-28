/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            // opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down .3s ease-out",
      },
      colors:{
        'primary': '#FDCD26',
        'eduBlack': '#13222a',
        'eduLightBlue': '#0f366d',
        'eduDarkBlue': '#05233b',
        'eduYellow': '#fdcd26',
        'eduDarkGray': '#e7e5e2',
        'eduLightGray': '#f9f8f9'
      },
      fontFamily:{
        body: ['Poppins', 'sans-serif'],
        headers: ['Hahmlet', 'serif']
      },
      fontSize:{
        'h1': ['40px', {
          lineHeight: '50px'
        }],
        'h2': ['32px', {
          lineHeight: '42px'
        }],
        'modalHead': ['25px', {
          lineHeight: '35px'
        }]
    },
    },
  },
  plugins: [],
};
