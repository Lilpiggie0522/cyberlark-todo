import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["node_modules", "cdk"], // Add packages you want to exclude from optimization
  },
  build: {
    rollupOptions: {
      external: ["node_modules", "cdk"], // Add packages you want to exclude from the build
    },
  },
})
