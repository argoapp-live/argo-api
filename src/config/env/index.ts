import * as dotenv from "dotenv";

dotenv.config();

interface IConfig {
  port: string | number;
  database: {
    MONGODB_URI: string;
    MONGODB_DB_MAIN: string;
    MONGODB_ATLAS_OPTION: string;
  };
  github?: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CALLBACK_URL: string;
  };
  gitlab?: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CALLBACK_URL: string;
  };
  smtp?: {
    USERNAME: string;
    PASSWORD: string;
  };
  secret: string;
  githubApp: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CALLBACK_URL: string;
    APP_ID: string;
    PEM_FILE_NAME: string;
  };
  cloudflare: {
    ARGO_IPV4: string;
    DOMAIN_NAME: string;
    ZONE_ID: string;
    EMAIL: string;
    KEY: string;
  };
  redis: {
    HOST: string;
    PORT: number;
    PASSWORD: string;
  };
  deployerApi?: {
    HOST_ADDRESS: string;
  };
  paymentApi?: {
    HOST_ADDRESS: string;
  };
  frontendApp?: {
    HOST_ADDRESS: string;
  };
  domainResolver: {
    HOST_ADDRESS: string;
    SECRET: string;
  };
}

const NODE_ENV: string = process.env.NODE_ENV || "test";

const development: IConfig = {
  port: process.env.PORT || 3000,
  database: {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/",
    MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || "argo_db",
    MONGODB_ATLAS_OPTION:
      process.env.MONGODB_ATLAS_OPTION || "retryWrites=true&w=majority",
  },
  github: {
    CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  },
  gitlab: {
    CLIENT_ID: process.env.GITLAB_CLIENT_ID,
    CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITLAB_CALLBACK_URL,
  },
  smtp: {
    USERNAME: process.env.SMTP_USERNAME,
    PASSWORD: process.env.SMTP_PASSWORD,
  },
  secret: process.env.SECRET,
  githubApp: {
    CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
    CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITHUB_APP_CALLBACK_URL,
    APP_ID: process.env.GITHUB_APP_ID,
    PEM_FILE_NAME: process.env.PEM_FILE_NAME,
  },
  cloudflare: {
    ARGO_IPV4: process.env.CLOUDFLARE_ARGO_IVP4,
    DOMAIN_NAME: process.env.CLOUDFLARE_DOMAIN_NAME,
    ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
    EMAIL: process.env.CLOUDFLARE_EMAIL,
    KEY: process.env.CLOUDFLARE_KEY,
  },
  redis: {
    HOST: process.env.REDIS_ENDPOINT || "127.0.0.1",
    PORT: +process.env.REDIS_PORT || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || "",
  },
  deployerApi: {
    HOST_ADDRESS:
      process.env.DEPLOYER_API_HOST_ADDRESS || "http://localhost:5000",
  },
  paymentApi: {
    HOST_ADDRESS:
      process.env.PAYMENT_API_HOST_ADDRESS || "http://localhost:3001",
  },
  frontendApp: {
    HOST_ADDRESS:
      process.env.FRONTEND_APP_HOST_ADDRESS || "http://localhost:3000",
  },
  domainResolver: {
    HOST_ADDRESS: process.env.DOMAIN_RESOLVER_URL || "http://localhost:3000",
    SECRET: process.env.DOMAIN_RESOLVER_SECRET,
  },
};

const production: IConfig = {
  port: process.env.PORT || 3000,
  database: {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/",
    MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || "argo_db",
    MONGODB_ATLAS_OPTION:
      process.env.MONGODB_ATLAS_OPTION || "retryWrites=true&w=majority",
  },
  github: {
    CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  },
  gitlab: {
    CLIENT_ID: process.env.GITLAB_CLIENT_ID,
    CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITLAB_CALLBACK_URL,
  },
  smtp: {
    USERNAME: process.env.SMTP_USERNAME,
    PASSWORD: process.env.SMTP_PASSWORD,
  },
  secret: process.env.SECRET,
  githubApp: {
    CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
    CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITHUB_APP_CALLBACK_URL,
    APP_ID: process.env.GITHUB_APP_ID,
    PEM_FILE_NAME: process.env.PEM_FILE_NAME,
  },
  cloudflare: {
    ARGO_IPV4: process.env.CLOUDFLARE_ARGO_IVP4,
    DOMAIN_NAME: process.env.CLOUDFLARE_DOMAIN_NAME,
    ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
    EMAIL: process.env.CLOUDFLARE_EMAIL,
    KEY: process.env.CLOUDFLARE_KEY,
  },
  redis: {
    HOST: process.env.REDIS_ENDPOINT || "127.0.0.1",
    PORT: +process.env.REDIS_PORT || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || "",
  },
  deployerApi: {
    HOST_ADDRESS:
      process.env.DEPLOYER_API_HOST_ADDRESS || "http://localhost:5000",
  },
  paymentApi: {
    HOST_ADDRESS:
      process.env.PAYMENT_API_HOST_ADDRESS || "http://localhost:3001",
  },
  frontendApp: {
    HOST_ADDRESS:
      process.env.FRONTEND_APP_HOST_ADDRESS || "http://localhost:3000",
  },
  domainResolver: {
    HOST_ADDRESS:
      process.env.DOMAIN_RESOLVER_URL || "http://localhost:3000",
    SECRET: process.env.DOMAIN_RESOLVER_SECRET,
  },
};
const test: IConfig = {
  port: process.env.PORT || 3000,
  database: {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/",
    MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || "argo_db",
    MONGODB_ATLAS_OPTION:
      process.env.MONGODB_ATLAS_OPTION || "retryWrites=true&w=majority",
  },
  github: {
    CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  },
  gitlab: {
    CLIENT_ID: process.env.GITLAB_CLIENT_ID,
    CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITLAB_CALLBACK_URL,
  },
  smtp: {
    USERNAME: process.env.SMTP_USERNAME,
    PASSWORD: process.env.SMTP_PASSWORD,
  },
  secret: process.env.SECRET,
  githubApp: {
    CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
    CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
    CALLBACK_URL: process.env.GITHUB_APP_CALLBACK_URL,
    APP_ID: process.env.GITHUB_APP_ID,
    PEM_FILE_NAME: process.env.PEM_FILE_NAME,
  },
  cloudflare: {
    ARGO_IPV4: process.env.CLOUDFLARE_ARGO_IVP4,
    DOMAIN_NAME: process.env.CLOUDFLARE_DOMAIN_NAME,
    ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
    EMAIL: process.env.CLOUDFLARE_EMAIL,
    KEY: process.env.CLOUDFLARE_KEY,
  },
  redis: {
    HOST: process.env.REDIS_ENDPOINT || "127.0.0.1",
    PORT: +process.env.REDIS_PORT || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || "",
  },
  deployerApi: {
    HOST_ADDRESS:
      process.env.DEPLOYER_API_HOST_ADDRESS || "http://localhost:5000",
  },
  paymentApi: {
    HOST_ADDRESS:
      process.env.PAYMENT_API_HOST_ADDRESS || "http://localhost:3001",
  },
  frontendApp: {
    HOST_ADDRESS:
      process.env.FRONTEND_APP_HOST_ADDRESS || "http://localhost:3000",
  },
  domainResolver: {
    HOST_ADDRESS: process.env.DOMAIN_RESOLVER_URL || "http://localhost:3000",
    SECRET: process.env.DOMAIN_RESOLVER_SECRET,
  },
};

const config: {
  [name: string]: IConfig;
} = {
  development,
  production,
  test,
};

export default config[NODE_ENV];
