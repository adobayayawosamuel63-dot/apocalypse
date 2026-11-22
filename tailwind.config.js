/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        night: {
          950: '#070b14',
          900: '#0b1220',
          850: '#0e1728',
          800: '#111c2e',
          700: '#1b2840',
          600: '#28374f',
        },
        gold: {
          200: '#f7e8c1',
          300: '#f0d69a',
          400: '#e6bf74',
          500: '#d4a450',
          600: '#b3843a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(.94)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .35s ease-out both',
        pop: 'pop .3s ease-out both',
        shake: 'shake .3s ease-in-out',
      },
    },
  },
  plugins: [],
};
