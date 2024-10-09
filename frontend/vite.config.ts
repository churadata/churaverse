import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    fs: {
      strict: false,
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico', '**/*.webp'],
  optimizeDeps: {
    esbuildOptions: {
      jsx: 'automatic',
    },
    exclude: [
      'churaverse-engine-client',
      '@churaverse/autoKeyboardPlugin',
      '@churaverse/bombPlugin',
      '@churaverse/cameraVideoChatPlugin',
      '@churaverse/coreUiPlugin',
      '@churaverse/debugScreenPlugin',
      '@churaverse/groundScreenPlugin',
      '@churaverse/keyboardPlugin',
      '@churaverse/kickPlugin',
      '@churaverse/mapPlugin',
      '@churaverse/networkPlugin',
      '@churaverse/playerListPlugin',
      '@churaverse/playerPlugin',
      '@churaverse/popUpScreenListPlugin',
      '@churaverse/screenSharePlugin',
      '@churaverse/sharkPlugin',
      '@churaverse/textChatPlugin',
      '@churaverse/titlePlugins',
      '@churaverse/transitionPlugin',
      '@churaverse/voiceChatPlugin',
      '@churaverse/webRtcPlugin',
      '@churaverse/dataPersistencePlugin',
      '@churaverse/textChatPlugin',
      '@churaverse/titlePlugins',
      '@churaverse/transitionPlugin',
      '@churaverse/voiceChatPlugin',
      '@churaverse/webRtcPlugin',
      '@churaverse/dataPersistencePlugin',
    ],
  },
  build: {
    sourcemap: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  plugins: [
    react({
      exclude: '**/*.tsx', // HMR後にゲーム操作が効かなくなるため
    }),
  ],
})
