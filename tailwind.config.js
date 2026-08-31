/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fdfcf9',
          100: '#f8f6f0',
          200: '#f2ede4',
          300: '#e7e0d3',
          400: '#d5ccbe',
          800: '#2b2a27',
          900: '#1c1b18',
        },
        charcoal: {
          50: '#f5f6f7',
          100: '#e5e7eb',
          200: '#cbd1d8',
          700: '#3c4249',
          800: '#272b30',
          900: '#1a1d20',
          950: '#0e1012',
        },
        moss: {
          50: '#f2f8f4',
          100: '#e2f0e6',
          200: '#c5e2ce',
          500: '#4c785d',
          600: '#3d5a45',
          700: '#2f4f3e',
          800: '#243c30',
          900: '#1a2b22',
        },
        gold: {
          100: '#fcf4e4',
          300: '#f2d192',
          400: '#e5b76b',
          500: '#d4a359',
          600: '#b8863b',
          700: '#946927',
        },
        fadedSky: {
          100: '#ebf4fa',
          300: '#b0d1ea',
          500: '#6b9ac4',
          600: '#5282ad',
          800: '#2a4c6e',
        },
        sunset: {
          100: '#faede8',
          300: '#f5bca8',
          500: '#d97757',
          600: '#c25e3c',
          700: '#a34727',
        },
        twilight: {
          800: '#1b2333',
          900: '#121824',
          950: '#090d14',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'journal': '0 4px 20px -2px rgba(30, 41, 59, 0.08), 0 2px 6px -1px rgba(30, 41, 59, 0.04)',
        'diorama': '0 20px 40px -15px rgba(26, 43, 34, 0.25)',
        'soft-glow': '0 0 25px rgba(212, 163, 89, 0.35)',
        'moss-glow': '0 0 25px rgba(76, 120, 93, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'flow-dash': 'flowDash 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        flowDash: {
          to: { strokeDashoffset: '-1000' }
        }
      }
    },
  },
  plugins: [],
}
