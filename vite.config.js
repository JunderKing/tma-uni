import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    uni(),
  ],
})
