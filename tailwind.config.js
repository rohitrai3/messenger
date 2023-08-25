/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background-light': '#FFFBFF',
        'background-dark': '#201A1A',
        'on-background-light': '#201A1A',
        'on-background-dark': '#ECE0E0',
        'primary-light': '#B52045',
        'primary-dark': '#FFB2BA',
        'on-primary-light': '#FFFFFF',
        'on-primary-dark': '#67001F',
        'primary-container-light': '#FFD9DC',
        'primary-container-dark': '#910030',
        'on-primary-container-light': '#400010',
        'on-primary-container-dark': '#FFD9DC',
        'surface-light': '#FFF8F7',
        'surface-dark': '#181212',
        'on-surface-light': '#201A1A',
        'on-surface-dark': '#D0C4C4',
        'inverse-surface-light': '#362F2F',
        'inverse-surface-dark': '#ECE0E0',
        'inverse-on-surface-light': '#FBEEEE',
        'inverse-on-surface-dark': '#201A1A',
        'outline-light': '#847374',
        'outline-dark': '#9F8C8D',
        'outline-variant-light': '#D7C1C2',
        'outline-variant-dark': '#524344',
      },
      fontSize: {
        'display-small': ['2.25rem', {
          lineHeight: '2.75rem',
          fontWeight: '400',
        }],
        'title-medium': ['1rem', {
          lineHeight: '1.5rem',
          fontWeight: '500',
        }],
        'label-large': ['0.875rem', {
          lineHeight: '1.25rem',
          fontWeight: '500',
        }],
      },
      height: {
        'd-screen': '100dvh',
      },
      width: {
        'd-screen': '100dvw',
      },
    },
  },
  plugins: [],
}

