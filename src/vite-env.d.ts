/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_AUTH0_CLIENT_ID: string;
    readonly VITE_AUTH0_API_URL: string;
    readonly VITE_GOOGLE_API_KEY: string;
    readonly VITE_SUPABASE_STORAGE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}