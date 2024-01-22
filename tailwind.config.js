const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.slate['100'],
        ['primary-dark']: colors.slate['700'],
        secondary: colors.yellow,
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        btn: {
          background: colors.slate['700'],
          'background-hover': colors.slate['600'],
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
