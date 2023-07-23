declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
      MONGO_DB_URL: string;
      SESSION_SECRET: string;
    }
  }
}

export {};
