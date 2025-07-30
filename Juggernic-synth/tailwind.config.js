/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base / Backgrounds (Deep, dark, resonant)
        'synth-dark-primary': '#0D0D1A', // Very dark, almost black, with a subtle blue/purple tint
        'synth-dark-secondary': '#1A1A33', // Slightly lighter dark for panels/cards
        'synth-gray': '#A0A0B0',         // Muted gray for secondary text, subtle borders

        // Main Accents (Electric, glowing, high-energy)
        'synth-accent-blue': '#00FFFF',   // Electric Cyan/Aqua (classic synth glow)
        'synth-accent-magenta': '#FF00FF', // Vibrant Magenta (powerful, futuristic)

        // Complementary Accents (Dynamic, contrasting)
        'synth-accent-green': '#00FF88',  // Neon Green (digital, data flow)
        'synth-accent-purple': '#8A2BE2', // Deep Amethyst Purple (rich, atmospheric)
        'synth-accent-orange': '#FF8C00', // Bright Orange (alert, warmth, energy)

        // Text Colors
        'synth-text-light': '#E6E6FA',   // Light lavender for primary text
        'synth-text-muted': '#B0B0C0',   // Muted light gray for secondary info
      },
      fontFamily: {
        // Optional: Add a custom font for a synthwave/futuristic feel
        // Make sure to import it in your index.css or index.html
        // 'synthwave': ['"Electrolize"', 'sans-serif'], // Example from Google Fonts
        // 'digital': ['"Share Tech Mono"', 'monospace'], // Another example
      },
      boxShadow: {
        // Glowing effects for buttons, cards, visualizer elements
        'synth-glow-sm-blue': '0 0 5px #00FFFF',
        'synth-glow-md-blue': '0 0 15px #00FFFF, 0 0 25px #00FFFF',
        'synth-glow-lg-magenta': '0 0 20px #FF00FF, 0 0 40px #FF00FF',
        'synth-glow-sm-green': '0 0 5px #00FF88',
        'synth-glow-md-purple': '0 0 10px #8A2BE2',
      }
    },
  },
  plugins: [],
}