/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do Anamnese Pro
        primary: '#ec4899', // Rosa pink-500
        'primary-foreground': '#ffffff', // Texto branco em cima do primary

        // Fundos
        background: '#ffffff', // Fundo branco
        foreground: '#0f172a', // Texto preto/slate-900

        // Cards
        card: '#ffffff', // Card branco
        'card-foreground': '#0f172a', // Texto preto no card

        // Muted (secundários)
        muted: '#f1f5f9', // Cinza claro slate-100
        'muted-foreground': '#64748b', // Cinza médio slate-500

        // Bordas
        border: '#e2e8f0', // Cinza claro slate-200
        input: '#e2e8f0',
        ring: '#ec4899', // Rosa para focus

        // Estados
        destructive: '#ef4444', // Vermelho red-500
        'destructive-foreground': '#ffffff',

        secondary: '#f1f5f9', // Cinza slate-100
        'secondary-foreground': '#0f172a',

        accent: '#f1f5f9',
        'accent-foreground': '#0f172a',
      },
    },
  },
  plugins: [],
}
