/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F7F6F2',
          dark: '#11161F',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1A2233',
        },
        ink: {
          50: '#F4F5F7',
          100: '#E5E7EB',
          200: '#CBD0D9',
          300: '#9AA3B2',
          400: '#6B7385',
          500: '#4B5363',
          600: '#363D4D',
          700: '#262C3A',
          800: '#1A2233',
          900: '#11161F',
        },
        accent: {
          DEFAULT: '#5B5FEF',
          dark: '#7B7FFF',
          subtle: '#EEEEFE',
        },
        status: {
          new: '#6B7280',
          newBg: '#F1F2F4',
          contacted: '#2F80ED',
          contactedBg: '#E8F1FD',
          qualified: '#16A37A',
          qualifiedBg: '#E5F7F0',
          lost: '#D64545',
          lostBg: '#FCEAEA',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(17, 22, 31, 0.04), 0 1px 3px 0 rgba(17, 22, 31, 0.06)',
        panel: '-4px 0 24px rgba(17, 22, 31, 0.08)',
      },
    },
  },
  plugins: [],
}
