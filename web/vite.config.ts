import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxImportSource: '@emotion/react' })],
  resolve: {
    extensions: ['.ts', '.tsx'],
    alias: {
      '~': path.resolve(__dirname, 'src')
    },
  },
})
