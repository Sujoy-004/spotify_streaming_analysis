/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arctic: {
          900: "#0f172a", // Deepest Slate
          800: "#1e293b", // Deep Blue-Gray
          700: "#334155", // Mid Blue-Gray
          600: "#475569", // Steel Gray
          500: "#64748b", // Muted Teal-Gray
          400: "#94a3b8", // Light Arctic Blue
          accent: "#38bdf8", // Electrified Cyan (for interactive hits)
        }
      },
      backgroundImage: {
        'arctic-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(56, 189, 248, 0.2)',
      }
    },
  },
  plugins: [],
}
