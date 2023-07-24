declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
      MONGO_DB_URL: string;
      SESSION_SECRET: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      MAILER_FROM: string;
      MAILER_SECRET: string;
    }
  }
}

export {};
