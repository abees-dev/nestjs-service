declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    MONGO_URI: string;
    PREFIX: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    PASSWORD_DEFAULT: string;
    REDIS_URL: string;
    REDIS_PORT: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_DB: string;
  }
}
