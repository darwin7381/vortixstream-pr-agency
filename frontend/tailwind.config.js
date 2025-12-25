/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'opacity-[0.02]',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          500: 'hsl(27, 100%, 51%)',
          600: 'hsl(27, 100%, 46%)',
          blue: '#1d3557',
        },
      },
      spacing: {
        'global-desktop': '64px',
        'global-mobile': '20px',
        'section-large-desktop': '112px',
        'section-large-mobile': '64px',
        'section-medium-desktop': '80px',
        'section-medium-mobile': '48px',
        'section-small-desktop': '48px',
        'section-small-mobile': '32px',
      },
      maxWidth: {
        'container-large': '1280px',
        'container-medium': '1024px',
        'container-small': '768px',
        'content-xxlarge': '1280px',
        'content-xlarge': '1024px',
        'content-large': '768px',
        'content-medium': '560px',
        'content-small': '480px',
        'content-xsmall': '400px',
        'content-xxsmall': '320px',
      },
      transitionDuration: {
        '900': '900ms',
        '1100': '1100ms',
        '1200': '1200ms',
        '1300': '1300ms',
        '1400': '1400ms',
        '1500': '1500ms',
        '1600': '1600ms',
      },
      opacity: {
        '3': '0.03',
        '5': '0.05',
        '8': '0.08',
        '15': '0.15',
        '20': '0.20',
        '30': '0.30',
        '40': '0.40',
        '60': '0.60',
        '80': '0.80',
        '90': '0.90',
      },
      boxShadow: {
        'brand': '0 12px 28px -12px hsl(27, 100%, 40%, 0.45)',
      },
      backdropBlur: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

