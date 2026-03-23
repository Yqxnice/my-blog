/** Tailwind configuration for site-wide design system (Step 3) */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js}',
    './components/**/*.{ts,tsx,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', ' ui-sans-serif', 'system-ui'],
        serif: ['Noto Serif SC', 'Georgia'],
      },
      colors: {
        background: '#f7f5f0',
        foreground: '#1a1714',
        primary: '#c0392b',
      },
    },
  },
  plugins: [],
};
