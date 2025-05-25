/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  envDir: ".secret",
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: "src/config/testSetup",
    environment: "jsdom"
  },
})
