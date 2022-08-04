import * as  convict from 'convict';

// Define a schema
export const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'staging', 'staging-bci'],
        default: 'development',
        env: 'NODE_ENV'
    },
    ip: {
        doc: 'The IP address to bind.',
        format: String,
        default: '127.0.0.1',
        env: 'IP_ADDRESS',
    },
    port: {
        doc: 'The port to bind.',
        format: 'port',
        default: 3000,
        env: 'PORT',
        arg: 'port'
    },
    host: {
        doc: 'Application host.',
        format: '*',
        default: 'localhost',
    },
    dbOracle: {
        host: {
            doc: 'Database host string',
            format: String,
            default: 'localhost:1521',
            env: 'DB_ORACLE_HOST'
        },
        name: {
            doc: 'Database name',
            format: String,
            default: '',
            env: 'DB_ORACLE_NAME'
        },
        auth: {
            user: {
                doc: 'Database user name',
                format: String,
                default: 'database',
                env: 'DB_ORACLE_USERNAME'
            },
            password: {
                doc: 'Database user password',
                format: String,
                default: 'oracle',
                env: 'DB_ORACLE_PASSWORD'
            },
        }

    },
    db: {
        host: {
            doc: 'Database host name/IP',
            format: '*',
            default: '127.0.0.1:27017',
            env: 'DB_MONGO_HOST'
        },
        name: {
            doc: 'Database name',
            format: String,
            default: '',
            env: 'DB_MONGO_NAME'
        },
        auth: {
            user: {
                doc: 'Database user if any',
                format: String,
                default: '',
                env: 'DB_MONGO_USERNAME'
            },
            password: {
                doc: 'Database password if any',
                format: String,
                default: '',
                env: 'DB_MONGO_PASSWORD'
            }
        }
    },
    cookieSalt: {
        doc: 'Salt to encrypt Cookies.',
        format: String,
        default: '',
        env: 'COOKIE_SALT',
        arg: 'cookie-salt'
    },
    cookieTTL: {
        doc: 'Session cookie time to live.',
        format: Number,
        default: '',
        env: 'COOKIE_TTL',
        arg: 'cookie-ttl'
    },
    oauthSalt: {
        doc: 'Salt to encrypt Oauth tokens.',
        format: String,
        default: '',
        env: 'OAUTH_TOKEN_SALT',
        arg: 'oauth-salt'
    },
    oauthTTL: {
        doc: 'Token time to live.',
        format: Number,
        default: '',
        env: 'OAUTH_TTL',
        arg: 'oauth-ttl'
    },
    saltRounds: {
        doc: 'Nbr rounds for salt password encryption.',
        format: Number,
        default: 10,
        env: 'PASSWORDS_SALT_ROUNDS',
        arg: 'salt-rounds'
    },
    emailTokenSalt: {
        doc: 'Salt to encrypt email reset password token.',
        format: String,
        default: '',
        env: 'EMAIL_TOKEN_SALT',
        arg: 'email-token-salt'
    },
    emailTokenTTL: {
        doc: 'Token time to live.',
        format: Number,
        default: '',
        env: 'EMAIL_TOKEN_TTL',
        arg: 'email-token-ttl'
    },
    baseUrl: {
        doc: 'API base url.',
        format: String,
        default: '',
        env: 'BASE_URL',
        arg: 'base-url'
    },
    exportSalt: {
        doc: 'Export salt.',
        format: String,
        default: '',
        env: 'EXPORT_LINK_SALT',
        arg: 'export-salt'
    },
    exportTTL: {
        doc: 'Export time to live.',
        format: Number, // in seconds
        default: 0,
        env: 'EXPORT_TTL',
        arg: 'export-ttl'
    },
    basePath: {
        doc: 'API base path.',
        format: String,
        default: ''
    },
    bankEmail: {
        doc: 'Email use for claim.',
        format: String,
        default: '',
        env: 'EMAIL_CLAIM'
    },
    cbsApiUrl: {
        doc: 'CBS API base url.',
        format: String,
        default: '',
        env: 'CBS_API_URL'
    },
    pdfApiUrl: {
        doc: 'PDF API base url.',
        format: String,
        default: '',
        env: 'PDF_API_URL'
    },
    timeout: {
        doc: 'timeout of http request',
        format: Number,
        default: 60000,
        env: 'TIMEOUT_HTTP_REQUEST'
    },
    bcinet: {
        apiUrl: {
            doc: 'BCIET API base url.',
            format: String,
            default: '',
            env: 'BCINET_URL'
        },
        login: {
            doc: 'BCIET API Login.',
            format: String,
            default: '',
            env: 'BCINET_LOGIN'
        },
        password: {
            doc: 'BCIET API password.',
            format: String,
            default: '',
            env: 'BCINET_PASSWORD'
        },
    },
    ceilingIncreaseEmail: {
        doc: 'mail requesting a ceiling increase.',
        format: String,
        default: '',
        env: 'EMAIL_REQUESTING_CEILING_INCREASE',
        arg: 'email-requesting-ceiling-increase'
    },
    cron: {
        visaTransactionForNotCustomers: {
            doc: 'Cron expression for verify visa transaction for not customers ',
            format: String,
            default: '',
            env: 'DELETE_VISA_TRANSACTION_FOR_NOT_CUSTOMERS_CRON'
        },

    cronCeilindgExpression: {
        doc: 'this cron is used to send emails for unprocessed cap requests',
        format: String,
        default: '',
        env: 'CRON_CEILING_EXPRESSION'
    },
    cronRemindCeilindayExpression: {
        doc: 'day of verification of the request for an increase in the ceiling not processed',
        format: Number,
        default: '',
        env: 'CRON_CEILING_REMIND_DAY_LIMIT'
    },
    },
    visaTransactionFilePendingValue: {
        doc: 'lifetime of a visa transaction file in pending status in minutes',
        format: Number,
        default: '',
        env: 'VISA_TRANSACTION_FILE_PENDING_VALUE'
    }
});

// Load environment dependent configuration
const env = config.get('env');
config.loadFile(((env === 'development') ? './src/config/' : './dist/config/') + env + '.json');

// Perform validation
config.validate({ allowed: 'strict' });

// export default config;