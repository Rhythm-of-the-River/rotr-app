/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        river: {
          50: '#f1f7f6',
          100: '#dbece9',
          200: '#b6d8d3',
          300: '#88beb6',
          400: '#5ba299',
          500: '#3f857d',
          600: '#326b65',
          700: '#2a5552',
          800: '#244543',
          900: '#1f3a38',
          950: '#0e201f'
        },
        sun: {
          50: '#fff8eb',
          100: '#ffeac6',
          200: '#ffd388',
          300: '#ffb74a',
          400: '#ff9e1f',
          500: '#f97e07',
          600: '#dd5b02',
          700: '#b73e06',
          800: '#94310c',
          900: '#7a2a0d'
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'pulse-slow': 'pulse-slow 2.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
