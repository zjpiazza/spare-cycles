declare namespace NodeJS {
  interface ProcessEnv {
    // ... existing code ...
    OPENAI_API_KEY: string;
    OPENAI_API_BASE_URL?: string;
    CF_ACCESS_CLIENT_ID: string;
    CF_ACCESS_CLIENT_SECRET: string;
  }
} 