import * as Joi from 'joi';

/**
 * Validates environment entries and values
 * Make sure to add here any other .env entry that requires any kind of validation
 */
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development')
    .valid('staging')
    .valid('production')
    .default('development'),
  APP_PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().required(),
  APP_VERSION: Joi.string().required(),
  APP_HOST_NAME: Joi.string().hostname().required(),
  JWT_SECRET: Joi.string().min(20).required(),
  JWT_BEARER_EXPIRATION: Joi.string().default('1h'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('1w'),
  BODY_LIMIT: Joi.string().default('100kb'),
  CORS_HEADERS: Joi.string().default(''),
  CORS_METHODS: Joi.string().default('GET POST PUT DELETE OPTIONS'),
  SALT_ROUNDS: Joi.number().default(1),

  //  DATABASE SETTINGS
  DB_TYPE: Joi.string().default('postgres'),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_SYNCHRONIZE: Joi.boolean().default(false),

  //  EMAIL
  EMAIL_SERVICE_USER: Joi.string(),
  EMAIL_SERVICE_PASSWORD: Joi.string(),
  EMAIL_ENABLED: Joi.boolean().default(false),
  EMAIL_FROM_NAME: Joi.string(),
  EMAIL_FROM_EMAIL: Joi.string(),
  REQUEST_PASSWORD_TEMPLATE_ID: Joi.string().required(),

  //  WEB
  WEB_APP_URL: Joi.string().allow(null, ''),
  WEB_APP_LOGIN_ROUTE: Joi.string(),
  WEB_APP_RECOVERY_ROUTE: Joi.string(),
});
