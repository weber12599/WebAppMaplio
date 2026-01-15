import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const isOffline = mode === 'offline'

    return {
        base: isOffline ? './' : '/',
        plugins: [vue(), vueDevTools(), isOffline && viteSingleFile()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        build: {
            assetsInlineLimit: isOffline ? 100000000 : 4096
        }
    }
})
