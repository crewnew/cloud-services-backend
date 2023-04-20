import path, { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import WindiCSS from 'vite-plugin-windicss'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        IconsResolver({
          customCollections: ['srun']
        })
      ]
    }),
    Icons({
      compiler: 'vue3',
      customCollections: {
        srun: FileSystemIconLoader('./public/assets/icons', (svg) =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        )
      }
    }),
    WindiCSS({
      onOptionsResolved: (options) => {
        options.scanOptions.extraTransformTargets.css.push(
          join(__dirname, 'excluded', 'included.css')
        )
      }
    })
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  }
})
