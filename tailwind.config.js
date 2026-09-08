/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        tally: {
          bg: {
            light: '#F7F7F9',
            dark: '#111318',
          },
          surface: {
            light: '#FFFFFF',
            dark: '#1A1C23',
            hover: '#F0F0F3',
            darkHover: '#252833',
          },
          primary: {
            DEFAULT: '#DCE4F5', // Soft lavender
            dark: '#1E293B',
            text: '#1E293B',
            textDark: '#E2E8F0',
          },
          accent: {
            DEFAULT: '#A6C8FF',
            glow: 'rgba(166, 200, 255, 0.4)',
          },
          status: {
            success: '#A7F3D0', // Soft green
            successText: '#065F46',
            successDark: '#065F46',
            successTextDark: '#A7F3D0',
            error: '#FECDD3', // Soft red
            errorText: '#9F1239',
            errorDark: '#9F1239',
            errorTextDark: '#FECDD3',
            pending: '#FDE68A', // Soft amber
            pendingText: '#92400E',
            pendingDark: '#92400E',
            pendingTextDark: '#FDE68A',
          },
          text: {
            primary: '#1E293B',
            secondary: '#64748B',
            primaryDark: '#F8FAFC',
            secondaryDark: '#94A3B8',
          },
          border: {
            light: '#E2E8F0',
            dark: '#334155'
          }
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0,0,0,0.05)',
        'soft-dark': '0 4px 20px -2px rgba(0,0,0,0.4)',
        'floating': '0 20px 40px -10px rgba(0,0,0,0.08)',
        'floating-dark': '0 20px 40px -10px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}