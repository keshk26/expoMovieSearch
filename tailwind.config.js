/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        card: '#1a1a1a',
        border: '#2a2a2a',
        accent: '#f5c518',
        primary: '#e50914',
        'text-primary': '#ffffff',
        'text-muted': '#aaaaaa',
        'tab-bar': '#111111',
        'search-bg': '#1e1e1e',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
      },
      borderRadius: {
        sm: 6,
        md: 10,
        lg: 16,
      },
    },
  },
  plugins: [],
};
