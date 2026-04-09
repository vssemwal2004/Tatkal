export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04070f',
          900: '#09111d',
          800: '#0f1a2b'
        },
        aurora: {
          500: '#3dd9c5',
          400: '#69e7d7',
          300: '#97f5e8'
        },
        flame: {
          500: '#f97360',
          400: '#fb8d7e'
        }
      },
      boxShadow: {
        premium: '0 24px 70px rgba(3, 9, 20, 0.45)',
        glow: '0 0 0 1px rgba(105, 231, 215, 0.15), 0 16px 40px rgba(61, 217, 197, 0.12)'
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Sora"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '"Segoe UI"', 'sans-serif']
      }
    }
  },
  plugins: []
};
