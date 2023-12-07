import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
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
}
export default config
