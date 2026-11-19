import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    fs: {
      strict: false,
    },
    proxy: {
      // 長いパスを先に定義しないと /backend が /backend_livekit にもマッチしてしまう
      '/backend_livekit': {
        target: 'http://localhost:12150',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend_livekit/, ''),
      },
      '/backend': {
        target: 'http://localhost:12100',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
      '/livekit': {
        target: 'http://localhost:7880',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/livekit/, ''),
      },
    },
  },
  // 各pluginパッケージはreactをdependenciesに宣言していないため、pnpmのstrictな
  // node_modulesでは plugin/dist/*.js からの "react/jsx-runtime" 解決に失敗する。
  // frontendのreactに寄せて解決させる。
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico', '**/*.webp'],
  optimizeDeps: {
    exclude: [
      'churaverse-engine-client',
      '@churaverse/auto-keyboard-plugin-client',
      '@churaverse/bomb-plugin-client',
      '@churaverse/camera-video-chat-plugin-client',
      '@churaverse/core-ui-plugin-client',
      '@churaverse/data-persistence-plugin-client',
      '@churaverse/debug-screen-plugin-client',
      '@churaverse/game-plugin-client',
      '@churaverse/ground-screen-plugin-client',
      '@churaverse/keyboard-plugin-client',
      '@churaverse/kick-plugin-client',
      '@churaverse/map-plugin-client',
      '@churaverse/network-plugin-client',
      '@churaverse/player-list-plugin-client',
      '@churaverse/player-plugin-client',
      '@churaverse/popup-screen-list-plugin-client',
      '@churaverse/screen-share-plugin-client',
      '@churaverse/shark-plugin-client',
      '@churaverse/synchro-break-plugin-client',
      '@churaverse/text-chat-plugin-client',
      '@churaverse/title-plugin-client',
      '@churaverse/transition-plugin-client',
      '@churaverse/voice-chat-plugin-client',
      '@churaverse/web-rtc-plugin-client',
      '@sapphi-red/web-noise-suppressor',
    ],
  },
  build: {
    sourcemap: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // 大きなライブラリを別のチャンクに分ける。1つの巨大なチャンク(とそのソースマップ)を
        // まとめて生成するとビルドのメモリ使用量が跳ね上がり、CIのNodeのヒープ上限(約1.6GB)を超えるため。
        // ライブラリだけを更新したときにブラウザのキャッシュが効く利点もある
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/]phaser[\\/]/.test(id)) return 'phaser'
          if (/[\\/]node_modules[\\/](livekit-client|@livekit)[\\/]/.test(id)) return 'livekit'
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id))
            return 'react'
          return undefined
        },
      },
    },
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
