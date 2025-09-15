/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[class="app-dark"]'],
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        '2xs': '300px',
        'xs': '480px'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
    },
    animation: {
      'fade-in': 'fade-in 0.5s ease-in-out forwards',
    },
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1180px',
        '2xl': '1440px', // Personalizado
      },
    },
  },
  plugins: [],
}

