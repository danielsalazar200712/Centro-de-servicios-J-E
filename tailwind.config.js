/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          deep: '#061A12',     // Obsidiana botánica ultra profunda
          dark: '#0B2B1E',     // Verde Bosque Imperial principal
          DEFAULT: '#0E3525',  // Botón y marca principal
          hover: '#144933',    // Hover esmeralda profundo
          accent: '#1E6B4B',   // Acento esmeralda refinado
          soft: '#ECFDF5',     // Tinte esmeralda suave para paneles activos
          border: '#A7F3D0',   // Borde esmeralda luminoso tipo catálogo premium
        },
        surface: {
          bg: '#F5F7F5',       // Blanco alabastro cálido / piedra orgánica
          card: '#FFFFFF',     // Superficie de tarjetas blanco puro
          border: '#DCE4DF',   // Borde arquitectónico calibrado con matiz salvia
          muted: '#5C6B64',    // Texto secundario gris salvia oscuro
          dark: '#0D1B15',     // Texto primario carbón botánico de máximo contraste
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        premium: '0 2px 14px -3px rgba(11, 43, 30, 0.06), 0 1px 4px -2px rgba(11, 43, 30, 0.04)',
        'premium-lg': '0 12px 32px -8px rgba(11, 43, 30, 0.12), 0 4px 12px -4px rgba(11, 43, 30, 0.06)',
      }
    },
  },
  plugins: [],
}
