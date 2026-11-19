interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_FRONT_VERSION: string
  readonly VITE_BACKEND_URL: string
  readonly VITE_BACKEND_LIVEKIT_URL: string
  readonly VITE_LIVEKIT_URL: string
  readonly VITE_DEPLOY_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
