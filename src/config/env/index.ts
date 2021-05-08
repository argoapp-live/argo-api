import * as dotenv from 'dotenv';

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
    flaskApi?: {
        HOST_ADDRESS: string;
        BASE_ADDRESS: string;
    };
    argoReact?: {
        BASE_ADDRESS: string;
    };
    domainResolver: {
        BASE_ADDRESS: string;
        SECRET: string;
    }
    secret: string;
    pushNotifyUrl?: string;
    arweaveUrl?: string;
    githubApp: {
        GITHUB_APP_CLIENT_ID: string;
        GITHUB_APP_CLIENT_SECRET: string;
        GITHUB_APP_CALLBACK_URL: string;
        GIT_HUB_APP_ID: string;
        PEM_FILE_NAME: string;
    },
    privateKey: {
        PRIVATE_KEY: string;
        AR_PRIVATE_KEY: string;
    },
    arweave: {
        CONTRACT_ID: string;
        HOST: string;
        PORT: number;
        PROTOCOL: string;
        APP_NAME: string;
    },
    googleCloud: {
        GOOGLE_APPLICATION_CREDENTIALS: string;
        ARGO_IPV4: string;
        dns: {
            DNS_ZONE_NAME: string;
            DNS_NAME: string;
        }
        records: {
            A: {
                RECORD_TYPE: string;
                TTL: number;
            },
            TXT: {
                RECORD_TYPE: string;
                TTL: number;
            }
        }
    }

}

const NODE_ENV: string = process.env.NODE_ENV || 'test';

const development: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'users_db',
        MONGODB_ATLAS_OPTION: process.env.MONGODB_ATLAS_OPTION || 'retryWrites=true&w=majority',
    },
    github: {
        CLIENT_ID: process.env.GITHUB_CLIENT_ID || 'xyz',
        CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || 'uvx',
        CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || 'wq',
    },
    gitlab: {
        CLIENT_ID: process.env.GITLAB_CLIENT_ID || 'xyz',
        CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET || 'uvx',
        CALLBACK_URL: process.env.GITLAB_CALLBACK_URL || 'wq',
    },
    smtp: {
        USERNAME: process.env.SMTP_USERNAME || 'abcd',
        PASSWORD: process.env.SMTP_PASSWORD || 'abcd',
    },
    flaskApi: {
        HOST_ADDRESS: process.env.INTERNAL_API || "http://localhost:5000/request_build/",
        BASE_ADDRESS: process.env.INTERNAL_API_BASE_ADDRESS || "http://localhost:5000/"
    },
    argoReact: {
        BASE_ADDRESS: "http://localhost:3000"
    },
    domainResolver: {
        BASE_ADDRESS:  process.env.DOMAIN_RESOLVER_URL || "http://localhost:3000",
        SECRET:  process.env.DOMAIN_SECRET || ""
    },
    secret: process.env.SECRET || '@QEGTUIARGOTEST',
    pushNotifyUrl: process.env.PUSH_NOTIFY_URL,
    arweaveUrl: process.env.ARWEAVE_URL || "https://arweave.net/",
    githubApp: {
        GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
        GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
        GITHUB_APP_CALLBACK_URL: process.env.GITHUB_APP_CALLBACK_URL,
        GIT_HUB_APP_ID: process.env.GIT_HUB_APP_ID,
        PEM_FILE_NAME: process.env.PEM_FILE_NAME
    },
    privateKey: {
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        AR_PRIVATE_KEY: process.env.AR_PRIVATE_KEY
    },
    arweave: {
        CONTRACT_ID: process.env.ARWEAVE_CONTRACT_ID,
        HOST: process.env.ARWEAVE_HOST || 'arweave.net',
        PORT: +process.env.ARWEAVE_PORT || 443,
        PROTOCOL: process.env.ARWEAVE_PROTOCOL || 'https',
        APP_NAME: process.env.ARWEAVE_APP_NAME || 'ARGO_APP_LIVE',
    },
    googleCloud: {
        GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        ARGO_IPV4: "35.202.158.174",
        dns: {
            DNS_ZONE_NAME: "dns-example-zone",
            DNS_NAME: "dns-example.com.",
        },
        records: {
            A: {
                RECORD_TYPE: 'a',
                TTL: 180,
            },
            TXT: {
                RECORD_TYPE: 'txt',
                TTL: 180,
            }
        }
    }
};

const production: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI,
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN,
        MONGODB_ATLAS_OPTION: process.env.MONGODB_ATLAS_OPTION
    },
    github: {
        CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        CALLBACK_URL: process.env.GITHUB_CALLBACK_URL
    },
    gitlab: {
        CLIENT_ID: process.env.GITLAB_CLIENT_ID,
        CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET,
        CALLBACK_URL: process.env.GITLAB_CALLBACK_URL
    },
    smtp: {
        USERNAME: process.env.SMTP_USERNAME,
        PASSWORD: process.env.SMTP_PASSWORD
    },
    flaskApi: {
        HOST_ADDRESS: process.env.INTERNAL_API,
        BASE_ADDRESS: process.env.INTERNAL_API_BASE_ADDRESS
    },
    argoReact: {
        BASE_ADDRESS: process.env.INTERNAL_FE_BASE_ADDRESS
    },
    domainResolver: {
        BASE_ADDRESS:  process.env.DOMAIN_RESOLVER_URL || "http://localhost:3000",
        SECRET:  process.env.DOMAIN_SECRET || ""
    },
    secret: process.env.SECRET,
    pushNotifyUrl: process.env.PUSH_NOTIFY_URL,
    arweaveUrl: process.env.ARWEAVE_URL,
    githubApp: {
        GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
        GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
        GITHUB_APP_CALLBACK_URL: process.env.GITHUB_APP_CALLBACK_URL,
        GIT_HUB_APP_ID: process.env.GIT_HUB_APP_ID,
        PEM_FILE_NAME: process.env.PEM_FILE_NAME
    },
    privateKey: {
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        AR_PRIVATE_KEY: process.env.AR_PRIVATE_KEY
    },
    arweave: {
        CONTRACT_ID: process.env.ARWEAVE_CONTRACT_ID || 'ZT-70ovBlkF6cRIqvyHy5lC2LcjudsmCz9z19M4_QC4',
        HOST: process.env.ARWEAVE_HOST || 'arweave.net',
        PORT: +process.env.ARWEAVE_PORT || 443,
        PROTOCOL: process.env.ARWEAVE_PROTOCOL || 'https',
        APP_NAME: process.env.ARWEAVE_APP_NAME || 'ArGoApp/2.0.0',
    },
    googleCloud: {
        GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        ARGO_IPV4: "35.202.158.174",
        dns: {
            DNS_ZONE_NAME: "argoapp",
            DNS_NAME: "argoapp.live.",
        },
        records: {
            A: {
                RECORD_TYPE: 'a',
                TTL: 180,
            },
            TXT: {
                RECORD_TYPE: 'txt',
                TTL: 180,
            }
        }
    }
};
const test: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'users_db',
        MONGODB_ATLAS_OPTION: process.env.MONGODB_ATLAS_OPTION || 'retryWrites=true&w=majority',
    },
    github: {
        CLIENT_ID: process.env.GITHUB_CLIENT_ID || 'xyz',
        CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || 'uvx',
        CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || 'wq',
    },
    gitlab: {
        CLIENT_ID: process.env.GITLAB_CLIENT_ID || 'xyz',
        CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET || 'uvx',
        CALLBACK_URL: process.env.GITLAB_CALLBACK_URL || 'wq',
    },
    smtp: {
        USERNAME: process.env.SMTP_USERNAME || 'abcd',
        PASSWORD: process.env.SMTP_PASSWORD || 'abcd',
    },
    flaskApi: {
        HOST_ADDRESS: process.env.INTERNAL_API || "http://35.194.19.236:5000/request_build",
        BASE_ADDRESS: process.env.INTERNAL_API_BASE_ADDRESS || "http://35.194.19.236:5000/"
    },
    argoReact: {
        BASE_ADDRESS: process.env.INTERNAL_FE_BASE_ADDRESS || "http://35.194.19.236:3000/"
    },
    domainResolver: {
        BASE_ADDRESS:  process.env.DOMAIN_RESOLVER_URL || "http://localhost:3000",
        SECRET:  process.env.DOMAIN_SECRET || ""
    },
    secret: process.env.SECRET || '@QEGTUIARGOTEST',
    pushNotifyUrl: process.env.PUSH_NOTIFY_URL,
    arweaveUrl: process.env.ARWEAVE_URL || "https://arweave.net/",
    githubApp: {
        GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
        GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
        GITHUB_APP_CALLBACK_URL: process.env.GITHUB_APP_CALLBACK_URL,
        GIT_HUB_APP_ID: process.env.GIT_HUB_APP_ID,
        PEM_FILE_NAME: process.env.PEM_FILE_Name,
    },
    privateKey: {
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        AR_PRIVATE_KEY: process.env.AR_PRIVATE_KEY
    },
    arweave: {
        CONTRACT_ID: process.env.ARWEAVE_CONTRACT_ID || 'ZT-70ovBlkF6cRIqvyHy5lC2LcjudsmCz9z19M4_QC4',
        HOST: process.env.ARWEAVE_HOST || 'arweave.net',
        PORT: +process.env.ARWEAVE_PORT || 443,
        PROTOCOL: process.env.ARWEAVE_PROTOCOL || 'https',
        APP_NAME: process.env.ARWEAVE_APP_NAME || 'ARGO_APP_LIVE',
    },
    googleCloud: {
        GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        ARGO_IPV4: "35.202.158.174",
        dns: {
            DNS_ZONE_NAME: "meetrekpero",
            DNS_NAME: "meetrekpero.xyz.",
        },
        records: {
            A: {
                RECORD_TYPE: 'a',
                TTL: 180,
            },
            TXT: {
                RECORD_TYPE: 'txt',
                TTL: 180,
            }
        }
    }
};

const config: {
    [name: string]: IConfig
} = {
    development,
    production,
    test
};

export default config[NODE_ENV];
