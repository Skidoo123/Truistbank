/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        truist: {
          purple: "#240046",
          darkPurple: "#180033",
          lightPurple: "#3B0066",
          teal: "#00A3A6",
          darkTeal: "#007A7C",
          accentTeal: "#33C2C5",
          grayBg: "#F7F9FC",
          cardBg: "#FFFFFF",
          border: "#E2E8F0",
          textDark: "#1E293B",
          textMuted: "#64748B",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
