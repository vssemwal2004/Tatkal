export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0f172a',
          800: '#131f38',
          700: '#1c2b47',
          500: '#2f5fd8',
          400: '#4d8af0',
          300: '#7fb0f7'
        }
      },
      boxShadow: {
        glow: '0 10px 35px rgba(77, 138, 240, 0.22)'
      }
    }
  },
  plugins: []
};
