/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GEMINI_API_BASE_URL?: string
  readonly VITE_FDA_API_KEY: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_PUBMED_API_KEY: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
