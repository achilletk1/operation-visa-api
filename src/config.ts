import   convict from 'convict';

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
        default: '',
        env: 'BASE_PATH',
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
    londoGateway: {
        url: {
            doc: 'LONDO Gateway URL.',
            format: String,
            default: '',
            env: 'LONDO_GATEWAY_URL'
        },
        username: {
            doc: 'username for Gateway authentication',
            format: String,
            default: '',
            env: 'LONDO_GATEWAY_USERNAME'
        },
        password: {
            doc: 'password for Gateway authentication',
            format: String,
            default: '',
            env: 'LONDO_GATEWAY_PASSWORD'
        },
        timeout: {
            doc: 'timeout request to Londo Gateway',
            format: Number,
            default: '',
            env: 'LONDO_GATEWAY_TIMEOUT'
        },
    },
    fileStoragePath: {
        doc: 'the path of the directory where the files are stored',
        format: String,
        default: '',
        env: 'FILE_STORAGE_PATH',
    },
    cbsApiUrl: {
        doc: 'CBS API base url.',
        format: String,
        default: '',
        env: 'CBS_API_URL'
    },
    template: {
        image: {
            doc: 'image that must be used as a logo on all templates',
            format: String,
            default: '',
            env: 'TEMPLATE_IMAGE',
            arg: 'template-image'
        },
        color: {
            doc: 'color that must be used as a logo on all templates',
            format: String,
            default: '',
            env: 'TEMPLATE_COLOR',
            arg: 'template-color'
        },
    },
    maxFileSizeUpload: {
        doc: 'CBS API base url.',
        format: Number,
        default: 5,
        env: 'MAX_FILE_SIZE_UPLOAD'
    }, 
    ceilingIncreaseEmail: {
        doc: 'mail requesting a ceiling increase.',
        format: String,
        default: '',
        env: 'EMAIL_REQUESTING_CEILING_INCREASE',
        arg: 'email-requesting-ceiling-increase'
    },
});

// Load environment dependent configuration
const env = config.get('env');
config.loadFile(((env === 'development') ? './src/config/' : './dist/src/config/') + env + '.json');

// Perform validation
config.validate({ allowed: 'strict' });

// export default config;