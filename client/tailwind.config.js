export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aurora: {
          500: '#3dd9c5',
          400: '#58efe0',
          300: '#86fff1'
        },
        brand: {
          900: '#0f172a',
          800: '#131f38',
          700: '#1c2b47',
          500: '#2f5fd8',
          400: '#4d8af0',
          300: '#7fb0f7'
        },
        flame: {
          500: '#f97360',
          400: '#fb8d6d',
          300: '#ffb089'
        }
      },
      boxShadow: {
        glow: '0 10px 35px rgba(77, 138, 240, 0.22)'
      }
    }
  },
  plugins: []
};
