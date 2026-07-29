import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite configuration for HACKEGA
// We add the tailwindcss plugin so Tailwind v4 is processed automatically
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Processes all Tailwind utility classes at build time
  ],
})
