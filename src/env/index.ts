import { TypeLanguage } from '../context/shared/Domain/EntityLanguage';
const LANGUAGE: TypeLanguage = (process.env.LANGUAGE as TypeLanguage) || 'es';

export const ENVIRONMENT = {
  TZ: process.env?.TZ ? process.env.TZ : 'America/Lima',
  PREFIX: process.env?.PREFIX ? process.env.PREFIX : 'TEST',
  PORT: process.env?.PORT ? parseInt(process.env.PORT) : 8081,
  DOMAINS: process.env?.DOMAINS ? JSON.parse(process.env.DOMAINS) : ['localhost'],
  AUTH_BASIC: process.env?.AUTH_BASIC ? JSON.parse(process.env.AUTH_BASIC) : [{ usr: 'admin', pwd: 'admin' }],
  ENV: process.env?.ENVIRONMENT ? process.env.ENVIRONMENT : '',

  KEY_ENCRYPT: process.env?.KEY_ENCRYPT ? process.env.KEY_ENCRYPT : '',

  RECAPTCHA: {
    URL: process.env?.RECAPTCHA_URL ? process.env.RECAPTCHA_URL : '',
    KEY: process.env?.RECAPTCHA_KEY ? process.env.RECAPTCHA_KEY : '',
    VALIDATE: process.env?.RECAPTCHA_VALIDATE ? process.env.RECAPTCHA_VALIDATE : 'false',
  },

  JWT: {
    KEY: process.env?.JWT_KEY ? process.env.JWT_KEY : '',
    EXP: process.env?.JWT_EXP ? process.env.JWT_EXP : '3600',
    KEY_REFRESH: process.env?.JWT_REFRESH_KEY ? process.env.JWT_REFRESH_KEY : '',
    EXP_REFRESH: process.env?.JWT_REFRESH_EXP ? process.env.JWT_REFRESH_EXP : '7200',
  },

  WS: {
    PATH: process.env?.WS_PATH ? process.env.WS_PATH : '/socketcluster/',
  },

  LANGUAGE,

  LOCAL: {
    URI: process.env?.LOCAL_URI || '',
  },

  MSSQL: {
    URI: process.env?.MSSQL_URI || '',
    DATABASE: process.env?.MSSQL_DATABASE || '',
    BOOTSTRAPPING: JSON.parse(process.env.MSSQL_BOOTSTRAPPING || 'false'),
  },

  MONGODB: {
    URI: process.env?.MONGODB_URI || '',
    DIRECTCONNECTION: JSON.parse(process.env.MONGODB_DIRECTCONNECTION || 'true'),
    DATABASE: process.env?.MONGODB_DATABASE || '',
    DATABASELOG: process.env?.MONGODB_DATABASE_LOG || '',
    DATABASELOGQA: process.env?.MONGODB_DATABASE_LOG_QA || '',
  },

  UTILITIE: {
    FASTLINK: {
      SCHEMA: process.env?.UTILITIE_FASTLINK_SCHEMA ? process.env.UTILITIE_FASTLINK_SCHEMA : '',
      ENTITY: process.env?.UTILITIE_FASTLINK_ENTITY ? process.env.UTILITIE_FASTLINK_ENTITY : '',
      URLSHORTLINK: process.env?.UTILITIE_FASTLINK_URLSHORTLINK ? process.env.UTILITIE_FASTLINK_URLSHORTLINK : '',
    },
  },
};
