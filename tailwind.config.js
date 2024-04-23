/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      black: '#000',
      white: '#fff',
      cyan: '#007bff',
      'dark-cyan': '#0266d1',
      grey: '#a4a4a4',
      'light-grey': '#e8e8e8',
      red: '#ce1414',
      green: '#087008',
    },
    extend: {
      screens: {
        mobile: '480px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1280px',
      },
      spacing: {
        4: '4px',
        6: '6px',
        8: '8px',
        10: '10px',
        16: '16px',
        20: '20px',
        30: '30px',
        40: '40px',
      },
      width: {
        12: '12px',
        30: '30px',
        80: '80px',
      },
      height: {
        12: '12px',
        30: '30px',
        80: '80px',
      },
      boxShadow: {
        small: '0 2px 10px 0 rgb(0 0 0 / 0.1)'
      },
      borderRadius: {
        small: '4px',
      },
      fontSize: {
        12: '12px',
        14: '14px',
        16: '16px',
        20: '20px',
        24: '24px',
      },
      lineHeight: {
        10: 1,
        12: 1.2,
        15: 1.5,
      },
      fontFamily: {
        nunito: 'Nunito, sans-serif',
      },
      keyframes: {
        spin: {
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}

