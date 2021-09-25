declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_DB: string;
      AUTH0_DOMAIN: string;
      AUTH0_IDENTIFIER: string;
    }
  }
}

export { }