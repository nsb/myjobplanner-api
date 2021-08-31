declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH0_DOMAIN: string;
      AUTH0_IDENTIFIER: string;
    }
  }
}

export { }