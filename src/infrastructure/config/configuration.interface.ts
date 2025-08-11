export enum AppEnvironment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Local = 'local',
}

export interface AppConfiguration {
  env: AppEnvironment;
  port: number;
  name: string;
  version: string;
  hostName: string;
  jwtSecret: string;
  jwtBearerExpiration: string;
  jwtRefreshExpiration: string;
  bodyLimit: string;
  corsHeaders: string[];
  corsMethods: string[];
  saltRounds: number;
  isProduction: boolean;
}

export interface DatabaseConfiguration {
  type: string;
  url?: string;
  synchronize: boolean;
  host?: string;
  dbName?: string;
  dbPassword?: string;
  username?: string;
  port?: number;
}

export interface EmailConfiguration {
  user: string;
  password: string;
  enabled: string;
  fromEmail: string;
  fromName: string;
  sendGridApiKey: string;
  requestPasswordTemplate: string;
}

export interface WebConfiguration {
  url: string;
  loginRoute: string;
  recoveryRoute: string;
}
