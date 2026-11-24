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
          dark: '#0A291D',     // Verde Bosque Imperial principal
          DEFAULT: '#0F4C36',  // Esmeralda profundo de alto impacto
          hover: '#16694B',    // Hover esmeralda vibrante
          accent: '#10B981',   // Esmeralda luminoso para detalles y foco
          soft: '#ECFDF5',     // Tinte esmeralda suave para paneles activos
          border: '#A7F3D0',   // Borde esmeralda luminoso
        },
        forge: {
          DEFAULT: '#EA580C',  // Naranja maquinaria / Husqvarna premium
          hover: '#C2410C',
          light: '#FFF7ED',
          border: '#FDBA74',
        },
        surface: {
          bg: '#EAEFED',       // Gris piedra salvia suave (reduce exceso de blanco)
          card: '#FFFFFF',     // Superficie de tarjetas
          border: '#C7D3CC',   // Borde bien definido y nítido
          muted: '#52635B',    // Texto secundario de buen contraste
          dark: '#0B1913',     // Texto primario carbón botánico
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        premium: '0 2px 14px -3px rgba(6, 26, 18, 0.08), 0 1px 4px -2px rgba(6, 26, 18, 0.05)',
        'premium-lg': '0 14px 34px -8px rgba(6, 26, 18, 0.16), 0 4px 12px -4px rgba(6, 26, 18, 0.08)',
      }
    },
  },
  plugins: [],
}
