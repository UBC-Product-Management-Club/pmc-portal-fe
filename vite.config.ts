/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    envDir: '.secret',
    plugins: [react(), tailwindcss()],
    test: {
        globals: true,
        setupFiles: 'src/config/testSetup',
        environment: 'jsdom',
    },
});
