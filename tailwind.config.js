/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0D12',
          darkCard: '#15171E',
          gold: '#C9974A',
          goldLight: '#E0B571',
          cream: '#F6F5F2',
          green: '#2FA84F',
          orange: '#E8A33D',
        },
        border: {
          light: '#E8E7E3',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
}
