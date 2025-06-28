/// <reference types="node" />

export interface EnvironmentVariables {
  APP: string;
  PORT: number;
  VERSION: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  REDIS_URL: string;
  DATABASE_URL: string;
  DIRECT_URL: boolean;
  ALCHEMY_API_KEY: string;
}

declare namespace NodeJS {
  type ProcessEnv = EnvironmentVariables
}
