/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: '#00FF99',
          emeraldSoft: '#4FFFC9',
          emeraldDark: '#00D47E',
          mint: '#B2F5EA',
        },
        surface: {
          charcoal: '#0D1117',
          slate: '#1A1F25',
          steel: '#222736',
          overlay: 'rgba(13, 17, 23, 0.55)',
        },
        accent: {
          aqua: '#22D3EE',
          indigo: '#6366F1',
          purple: '#C084FC',
        },
        neutral: {
          100: '#CBD5F5',
          200: '#94A3B8',
          300: '#64748B',
          400: '#475569',
          500: '#334155',
        }
      },
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        orbitron: ['"Orbitron"', 'sans-serif'],
        rajdhani: ['"Rajdhani"', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'float': 'float 10s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 6s ease-in-out infinite',
        'scanner-sweep': 'scanner-sweep 3s ease-in-out infinite',
        'orbit': 'orbit 12s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 18px rgba(0, 255, 153, 0.28), inset 0 0 12px rgba(0, 255, 153, 0.18)'
          },
          '50%': {
            boxShadow: '0 0 48px rgba(0, 255, 153, 0.55), inset 0 0 25px rgba(0, 255, 153, 0.25)'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-18px) translateX(6px)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.45 },
          '50%': { opacity: 0.95 }
        },
        'scanner-sweep': {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '30%': { opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 }
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(12px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(12px) rotate(-360deg)' }
        },
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
        'heavy': '30px',
      },
      boxShadow: {
        'emerald': '0 0 18px rgba(0, 255, 153, 0.35)',
        'emerald-lg': '0 0 42px rgba(0, 255, 153, 0.42), 0 0 70px rgba(0, 255, 153, 0.18)',
        'aqua': '0 0 20px rgba(34, 211, 238, 0.32)',
        'inner-glow': 'inset 0 0 18px rgba(0, 255, 153, 0.22)',
      },
      backgroundImage: {
        'dashboard-grid': 'radial-gradient(circle at 20% 20%, rgba(79, 255, 201, 0.12) 0, transparent 60%), radial-gradient(circle at 80% 0%, rgba(34, 211, 238, 0.12) 0, transparent 55%), radial-gradient(circle at 50% 75%, rgba(192, 132, 252, 0.08) 0, transparent 55%)',
        'panel-gradient': 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(17, 24, 39, 0.68) 55%, rgba(13, 17, 23, 0.85) 100%)',
      },
    },
  },
  plugins: [],
};
