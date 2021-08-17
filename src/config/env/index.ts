import * as dotenv from "dotenv";

dotenv.config();

interface IConfig {
  port: string | number;
  database: {
    MONGODB_URI: string;
    MONGODB_DB_MAIN: string;
    MONGODB_ATLAS_OPTION: string;
  };

  smtp?: {
    USERNAME: string;
    PASSWORD: string;
  };
  secret: string;
  skynet: {
    LOGSTOCAPTURE: Array<any>;
  };
  neofs: {
    LOGSTOCAPTURE: Array<any>;
  };
  arweave: {
    LOGSTOCAPTURE: Array<any>;
    PRIVATE_KEY: string;
  };
  githubApp: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CALLBACK_URL: string;
    APP_ID: string;
    PEM_FILE_NAME: string;
    PEM_CONTENT_BASE64: string;
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
  namebase: {
    ACCESS_KEY: string;
    SECRET_KEY: string;
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
  authApi?: {
    HOST_ADDRESS: string;
  };
  domainResolver: {
    HOST_ADDRESS: string;
    SECRET: string;
  };
  selfUrl: string;
  nft: {
    MNEMONIC: string;
    RPC_PROVIDER: string;
    NFT_SUBGRAPH: string;
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
    PEM_CONTENT_BASE64: process.env.PEM_CONTENT_BASE64,
  },
  cloudflare: {
    ARGO_IPV4: process.env.CLOUDFLARE_ARGO_IVP4,
    DOMAIN_NAME: process.env.CLOUDFLARE_DOMAIN_NAME,
    ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
    EMAIL: process.env.CLOUDFLARE_EMAIL,
    KEY: process.env.CLOUDFLARE_KEY,
  },
  arweave: {
    LOGSTOCAPTURE: [
      { key: "sitePreview", value: "https://arweave.net" },
      { key: "fee", value: "Total price:" },
    ],
    PRIVATE_KEY: process.env.ARWEAVE_KEY,
  },
  skynet: {
    LOGSTOCAPTURE: [{ key: "sitePreview", value: "https://siasky.net" }],
  },
  neofs: {
    LOGSTOCAPTURE: [{ key: "sitePreview", value: "https://http.fs.neo.org/" }],
  },
  redis: {
    HOST: process.env.REDIS_ENDPOINT || "127.0.0.1",
    PORT: +process.env.REDIS_PORT || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || "",
  },
  namebase: {
    ACCESS_KEY: process.env.NAMEBASE_ACCESS_KEY || "",
    SECRET_KEY: process.env.NAMEBASE_SECRET_KEY || "",
  },
  deployerApi: {
    HOST_ADDRESS:
      process.env.DEPLOYER_API_HOST_ADDRESS || "http://localhost:5000",
  },
  authApi: {
    HOST_ADDRESS: process.env.AURH_API_HOST_ADDRESS || "http://localhost:4000",
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
  selfUrl: process.env.SELF_URL,

  nft: {
    MNEMONIC: process.env.SIGNER_MNEMONIC,
    RPC_PROVIDER: process.env.RPC_PROVIDER,
    NFT_SUBGRAPH: process.env.NFT_SUBGRAPH,
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
    PEM_CONTENT_BASE64: process.env.PEM_CONTENT_BASE64,
  },
  arweave: {
    LOGSTOCAPTURE: [
      { key: "sitePreview", value: "https://arweave.net" },
      { key: "fee", value: "Total price:" },
    ],
    PRIVATE_KEY: process.env.ARWEAVE_KEY,
  },
  skynet: {
    LOGSTOCAPTURE: [{ key: "sitePreview", value: "https://siasky.net" }],
  },
  neofs: {
    LOGSTOCAPTURE: [{ key: "sitePreview", value: "https://http.fs.neo.org/" }],
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
  namebase: {
    ACCESS_KEY: process.env.NAMEBASE_ACCESS_KEY || "",
    SECRET_KEY: process.env.NAMEBASE_SECRET_KEY || "",
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
  selfUrl: process.env.SELF_URL,
  nft: {
    MNEMONIC: process.env.SIGNER_MNEMONIC,
    RPC_PROVIDER: process.env.RPC_PROVIDER,
    NFT_SUBGRAPH: process.env.NFT_SUBGRAPH,
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
    PEM_CONTENT_BASE64: process.env.PEM_CONTENT_BASE64,
  },
  arweave: {
    LOGSTOCAPTURE: [
      { key: "sitePreview", value: "https://arweave.net" },
      { key: "fee", value: "Total price:" },
    ],
    PRIVATE_KEY: process.env.ARWEAVE_KEY,
  },
  skynet: {
    LOGSTOCAPTURE: [{ key: "sitePreview", value: "https://siasky.net" }],
  },
  neofs: {
    LOGSTOCAPTURE: [{ key: "sitePreview", value: "https://http.fs.neo.org/" }],
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
  namebase: {
    ACCESS_KEY: process.env.NAMEBASE_ACCESS_KEY || "",
    SECRET_KEY: process.env.NAMEBASE_SECRET_KEY || "",
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
  selfUrl: process.env.SELF_URL,
  nft: {
    MNEMONIC: process.env.SIGNER_MNEMONIC,
    RPC_PROVIDER: process.env.RPC_PROVIDER,
    NFT_SUBGRAPH: process.env.NFT_SUBGRAPH,
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
