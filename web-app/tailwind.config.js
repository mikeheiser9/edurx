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
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(.8)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down .3s ease-out",
        "scale-in": "scale-in .3s ease-in-out",
        wiggle: "wiggle 200ms ease-in-out",
      },
      // colors: {
      //   primary: "#FDCD26",
      //   "primary-light": "#F8F8F8",
      //   "primary-dark": "#20201E",
      //   "primary-darker": "#000000",
      // },
      colors: {
        primary: "#FDCD26",
        eduBlack: "#13222A",
        eduLightBlue: "#0F366D",
        eduDarkBlue: "#05233B",
        eduYellow: "#FDCD26",
        eduDarkGray: "#E7E5E2",
        eduLightGray: "#F9F8F9",
      },
      fontSize: {
        '8px': '5px',
        '10px': '10px',
        h1: [
          "40px",
          {
            lineHeight: "50px",
          },
        ],
        h2: [
          "32px",
          {
            lineHeight: "42px",
          },
        ],
        modalHead: [
          "25px",
          {
            lineHeight: "35px",
          },
        ],
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
       screens: {
        'x-large': {'max': '1305px'},
        'large': {'max': '1280px'},
        'medium': {'max': '1250px'},
        'tl': {'max': '1169px'},
        'tablet-lg': {'max': '1075px'},
        'ipad': {'max': '820px'},
        'ipad-under': {'max': '767px'},
        'over-small': {'max': '665px'},
        'small': {'max': '550px'},
        'iphone': {'max': '450px'},
        'iphone-sm': {'max': '375px'},
        'xx-small': {'max': '360px'},
       },
    },
  },
  plugins: [],
};
