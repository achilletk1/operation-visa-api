import convict from 'convict';

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
    appName: {
        doc: 'Application name',
        format: String,
        default: 'FLY BANKING',
        env: 'APP_NAME',
        arg: 'APP_NAME'
    },
    clientName: {
        doc: 'Client application name',
        format: String,
        default: 'BCI',
        env: 'CLIENT_NAME',
        arg: 'CLIENT_NAME'
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
    clientLinkTTL: {
        doc: 'justify travel time to live.',
        format: Number, // in seconds
        default: 0,
        env: 'JUSTIFY_TRAVEL_TTL',
        arg: 'justify-travel-ttl'
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
        imageBase64: {
            doc: 'image that must be used as a logo on all templates as base64 format',
            format: String,
            default: '',
            env: 'TEMPLATE_IMAGE_BASE64',
            arg: 'template-image-base64'
        },
        color: {
            doc: 'color that must be used as a logo on all templates',
            format: String,
            default: '',
            env: 'TEMPLATE_COLOR',
            arg: 'template-color'
        },
        app: {
            doc: 'name of the app that must be used as the model on all templates',
            format: String,
            default: '',
            env: 'TEMPLATE_APP',
            arg: 'template-app'
        },
        company: {
            doc: 'company name that must be used as a model on all templates',
            format: String,
            default: '',
            env: 'TEMPLATE_COMPANY',
            arg: 'template-company'
        },
        companySiteUrl: {
            doc: 'company name that must be used as a model on all templates',
            format: String,
            default: '',
            env: 'TEMPLATE_COMPANY_SITE_URL',
            arg: 'template-company-site-url'
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
    gotenbergUrl: {
        doc: 'GOTENBERG PDF GENERATOR URL',
        format: String,
        default: 'http://gotenberg:3000',
        env: 'GOTENBERG_URL'
    },
    emailTest: {
        doc: 'email test to send notification',
        format: String,
        default: 'kevin.moutassi@londo-tech.com',
        env: 'EMAIL_TEST'
    },
    phoneTest: {
        doc: 'phone test to send notification',
        format: String,
        default: '237693405447',
        env: 'PHONE_TEST'
    },
    emailBank: {
        doc: 'email bank to send notification',
        format: String,
        default: '',
        env: 'EMAIL_BANK'
    },
    activeDirectory: {
        adminPassword: {
            doc: 'Password Admin in AD.',
            format: String,
            default: '',
            env: 'ADMIN_PASSWORD_ACTIVE_DIRECTORY'
        },
        adminDn: {
            doc: 'Distinguished Name Admin in AD.',
            format: String,
            default: '',
            env: 'ADMIN_DN_ACTIVE_DIRECTORY'
        },
        url: {
            doc: 'Active Directory Address.',
            format: String,
            default: '',
            env: 'URL_ACTIVE_DIRECTORY'
        },
        groupName: {
            doc: 'BCI SANGO Users Group Name in AD.',
            format: String,
            default: '',
            env: 'GROUP_NAME_ACTIVE_DIRECTORY'
        },
        groupVerification: {
            doc: 'BCI SANGO Users Group Activate Group vérification.',
            format: Boolean,
            default: false,
            env: 'GROUP_NAME_VERIFICATION'
        },
    },
    visaTransactionFilePendingValue: {
        doc: 'lifetime of a visa transaction file in pending status in minutes',
        format: Number,
        default: 3,
        env: 'VISA_TRANSACTION_FILE_PENDING_VALUE'
    },
    crons: {
        revivalMail: {
            doc: 'cron of visa revival mail.',
            format: String,
            default: '',
            env: 'VISA_REVIVAL_MAIL',
            arg: 'visa-revival-mail'
        },
        transactionProcessing: {
            doc: 'cron of transaction processing.',
            format: String,
            default: '',
            env: 'CRON_TRANSACTION_PROCESSING',
            arg: 'cron-transaction-processing'
        },
        deleteTemporaryFile: {
            doc: 'cron to delete temporaries files.',
            format: String,
            default: '',
            env: 'DELETE_TEMPORARY_FILES',
            arg: 'delete-temporary-files'
        },
        removeOnlinePaymentsWithExceedings: {
            doc: 'cron of delete online payments With Exceedings.',
            format: String,
            default: '',
            env: 'REMOVE_PAYMENTS_WITH_EXCEEDINGS',
            arg: 'remove-travels-with_Exceedings'
        },
        clientInDemeure: {
            doc: 'cron to send mail of list of client in demeure to bank.',
            format: String,
            default: '',
            env: 'CLIENT_IN_DEMEURE',
            arg: 'client_in_demeure'
        },
        unjustifiedOperation: {
            doc: 'cron update the delay status of the file to "Out of time.',
            format: String,
            default: '',
            env: 'OUT_OF_TIME',
            arg: 'out_of_time'
        },
    },
});

// Load environment dependent configuration
const env = config.get('env');
config.loadFile('./src/envs/' + env + '.json');

// Perform validation
config.validate({ allowed: 'strict' });

// export default config;