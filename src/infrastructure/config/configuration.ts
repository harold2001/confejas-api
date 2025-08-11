import {
  AppConfiguration,
  AppEnvironment,
  DatabaseConfiguration,
  EmailConfiguration,
  WebConfiguration,
} from './configuration.interface';
import * as process from 'process';

/**
 * Configuration docs
 * https://docs.nestjs.com/techniques/configuration
 */
export default () => {
  const app: AppConfiguration = {
    env: process.env.NODE_ENV as AppEnvironment,
    port: parseInt(process.env.APP_PORT),
    name: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    hostName: process.env.APP_HOST_NAME,
    jwtSecret: process.env.JWT_SECRET,
    jwtBearerExpiration: process.env.JWT_BEARER_EXPIRATION,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
    bodyLimit: process.env.BODY_LIMIT,
    corsHeaders: process.env.CORS_HEADERS.split(' '),
    corsMethods: process.env.CORS_METHODS.split(' '),
    saltRounds: parseInt(process.env.SALT_ROUNDS),
    isProduction:
      (process.env.NODE_ENV as AppEnvironment) === AppEnvironment.Production,
  };

  const database: DatabaseConfiguration = {
    type: process.env.DB_TYPE,
    url: process.env.DB_URL,
    synchronize: process.env.DB_SYNCHRONIZE == 'true',
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPassword: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 25060,
  };

  const email: EmailConfiguration = {
    user: process.env.EMAIL_SERVICE_USER,
    password: process.env.EMAIL_SERVICE_PASSWORD,
    enabled: process.env.EMAIL_ENABLED,
    fromEmail: process.env.EMAIL_FROM_EMAIL,
    fromName: process.env.EMAIL_FROM_NAME,
    sendGridApiKey: process.env.EMAIL_SENDGRID_API_KEY,
    requestPasswordTemplate: process.env.REQUEST_PASSWORD_TEMPLATE_ID,
  };

  const web: WebConfiguration = {
    url: process.env.WEB_APP_URL,
    loginRoute: process.env.WEB_APP_LOGIN_ROUTE,
    recoveryRoute: process.env.WEB_APP_RECOVERY_ROUTE,
  };

  return {
    app,
    database,
    email,
    web,
  };
};
