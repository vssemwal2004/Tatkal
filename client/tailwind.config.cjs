/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aurora: {
          500: 'rgb(239 68 68 / <alpha-value>)',
          400: 'rgb(251 113 133 / <alpha-value>)',
          300: 'rgb(253 164 175 / <alpha-value>)'
        },
        brand: {
          50: 'rgb(239 246 255 / <alpha-value>)',
          100: 'rgb(219 234 254 / <alpha-value>)',
          200: 'rgb(191 219 254 / <alpha-value>)',
          900: 'rgb(15 23 42 / <alpha-value>)',
          800: 'rgb(19 31 56 / <alpha-value>)',
          700: 'rgb(28 43 71 / <alpha-value>)',
          600: 'rgb(37 99 235 / <alpha-value>)',
          500: 'rgb(47 95 216 / <alpha-value>)',
          400: 'rgb(77 138 240 / <alpha-value>)',
          300: 'rgb(127 176 247 / <alpha-value>)'
        },
        flame: {
          500: 'rgb(249 115 22 / <alpha-value>)',
          400: 'rgb(251 146 60 / <alpha-value>)',
          300: 'rgb(253 186 116 / <alpha-value>)'
        }
      },
      boxShadow: {
        glow: '0 10px 35px rgba(77, 138, 240, 0.22)'
      }
    }
  },
  plugins: []
};
