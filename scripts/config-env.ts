import * as convict from 'convict';

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
    accountId: {
        doc: 'Email canal.',
        format: Number,
        default: '',
        env: 'ACCOUNT_ID',
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
    postmarkToken: {
        doc: 'Postmark server token.',
        format: String,
        default: '',
        env: 'POSTMARK_TOKEN',
        arg: 'postmark-token'
    },
    smsBaseUrl: {
        doc: 'SMS provider base url.',
        format: String,
        default: '',
        env: 'SMS_BASE_URL'
    },
    emailBaseUrl: {
        doc: 'Email provider base url.',
        format: String,
        default: '',
        env: 'EMAIL_BASE_URL'
    },
    monetiqueEmail: {
        doc: 'Email monetique for REquest card base url.',
        format: String,
        default: '',
        env: 'EMAIL_MONETIQUE'
    },
    caeEmail: {
        doc: 'Email C_A_P for Request card base url.',
        format: String,
        default: '',
        env: 'EMAIL_C_A_P'
    },
    afb160Path: {
        doc: 'Path location where to create AFB files.',
        format: String,
        default: './afbrec'
    },
    mini_bkhis_credentials: {
        login: {
            doc: 'bicec login to dbanking api',
            format: String,
            default: '',
            env: 'MINI_BKHIS_LOGIN'
        },
        password: {
            doc: 'bicec password to logged into dbanking api',
            format: String,
            default: '',
            env: 'MINI_BKHIS_PASSWORD'
        }
    },
    wallet: {
        airtel: {
            baseUrl: {
                doc: 'AIRTEL base URL',
                format: String,
                default: '',
                env: 'AIRTEL_API_URL'
            },
            airtelApiUrl: {
                doc: 'AIRTEL base URL API',
                format: String,
                default: '',
                env: 'LND_AIRTEL_API_URL'
            },
            proxy: {
                doc: 'BCI proxy to access internet',
                format: String,
                default: '10.100.23.12:3128',
                env: 'BCI_PROXY'
            },
            login: {
                doc: 'BCI login to authenticate to AIRTEL',
                format: String,
                default: '',
                env: 'AIRTEL_LOGIN'
            },
            password: {
                doc: 'BCI password to authenticate to AIRTEL',
                format: String,
                default: '',
                env: 'AIRTEL_PASSWORD'
            },
            airtelCallbackUrl: {
                doc: 'AIRTEL callback URL',
                format: String,
                default: '',
                env: 'AIRTEL_CALLBACK_URL'
            },
            balanceThreshold: {
                doc: 'AIRTEL BCI Account balance threshold',
                format: Number,
                default: 500000,
                env: 'AIRTEL_BALANCE_THRESHOLD'
            }
        },
        mtn: {
            baseUrl: {
                doc: 'MTN api base url.',
                format: String,
                default: '',
                env: 'MTN_API_BASE_URL'
            },
            baseMTNAPIUrl: {
                doc: 'Londo MTN api base url.',
                format: String,
                default: '',
                env: 'LND_MTN_API_BASE_URL'
            },
            user: {
                doc: 'MTN user name',
                format: String,
                default: '',
                env: 'MTN_USERNAME'
            },
            password: {
                doc: 'MTN user password',
                format: String,
                default: '',
                env: 'MTN_PASSWORD'
            },
            subscription_Key: {
                doc: 'MTN Ocp-Apim-Subscription-Key',
                format: String,
                default: 'oracle',
                env: 'MTN_SUBSCRIPTION_KEY'
            },
            wallet_ncp: {
                doc: 'MTN wallet account number',
                format: String,
                default: '',
                env: 'MTN_WALLET_NCP'
            },
            wallet_age: {
                doc: 'MTN wallet AGE code',
                format: String,
                default: '',
                env: 'MTN_WALLET_AGE'
            },
            login_vpn: {
                doc: 'MTN login in VPN channel',
                format: String,
                default: '',
                env: 'MTN_LOGIN_VPN'
            },
            password_vpn: {
                doc: 'MTN password in VPN channel',
                format: String,
                default: '',
                env: 'MTN_PASSWORD_VPN'
            },
            login_bci_to_ecw_vpn: {
                doc: 'BCI login for ECW connection',
                format: String,
                default: '',
                env: 'MTN_LOGIN_ECW_VPN'
            },
            password_bci_to_ecw_vpn: {
                doc: 'BCI password for ECW connection',
                format: String,
                default: '',
                env: 'MTN_PASSWORD_ECW_VPN'
            },
            baseUrl_vpn: {
                doc: 'MTN password in VPN channel',
                format: String,
                default: '',
                env: 'MTN_VPN_API_BASE_URL'
            },
            balanceThreshold: {
                doc: 'MTN BCI Account balance threshold',
                format: Number,
                default: 500000,
                env: 'MTN_BALANCE_THRESHOLD'
            },
            ecwPaymentAndWithdrawCheckcronExpression: {
                doc: 'MTN ECW Cron Expression to check paymentCompleted and withdrawCompleted',
                format: String,
                default: '',
                env: 'MTN_ECW_CRON_EXPRESSION_WITHDRAW_AND_PAYMENT'
            },
        },
        emailListBalanceAlertBCI: {
            doc: 'BCI email list for balance alert.',
            format: String,
            default: '',
            env: 'BALANCE_ALERT_EMAIL_BCI'
        },
        emailListBalanceAlertBCICC: {
            doc: 'BCI email cc list for balance alert.',
            format: String,
            default: '',
            env: 'BALANCE_ALERT_EMAIL_BCI_CC'
        },
        emailListBalanceAlertLONDO: {
            doc: 'LONDO email list for balance alert.',
            format: String,
            default: '',
            env: 'BALANCE_ALERT_EMAIL_LND'
        },
    },
    gimac: {
        ncp: {
            doc: 'GIMAC account number',
            format: String,
            default: '',
            env: 'GIMAC_NCP'
        },
        age: {
            doc: 'GIMAC age code',
            format: String,
            default: '',
            env: 'GIMAC_AGE'
        },
        clc: {
            doc: 'GIMAC account clc number',
            format: String,
            default: '',
            env: 'GIMAC_CLC'
        },
        claimAddress: {
            doc: 'GIMAC claim address',
            format: String,
            default: '',
            env: 'GIMAC_CLAIM_ADDRESS'
        },
        claimPathRec: {
            doc: 'GIMAC claim file path records',
            format: String,
            default: '',
            env: 'GIMAC_CLAIM_PATH_REC'
        },
        claimPathArc: {
            doc: 'GIMAC claim file path Archive',
            format: String,
            default: '',
            env: 'GIMAC_CLAIM_PATH_ARC'
        },
        incAccRemitCeilling: {
            doc: 'ceilling for remittence transaction',
            format: Number,
            default: 1000000,
            env: 'INC_ACC_REMIT_CEILLING'
        },
        merchantPurchaseCeilling: {
            doc: 'ceilling for merchant purchase transaction',
            format: Number,
            default: 1000000,
            env: 'MERCHANT_PURCHASE_CEILLING'
        },
        walletToWalletCeilling: {
            doc: 'ceilling for waalet transfer transaction',
            format: Number,
            default: 1000000,
            env: 'WALLET_TO_WALLET_CEILLING'
        },
        CardlessWithdrawalCeilling: {
            doc: 'ceilling for cardless withdrawal transaction',
            format: Number,
            default: 250000,
            env: 'CARDLESS_WITHDRAWAL_CEILLING'
        },

    },
    ama: {
        baseUrl: {
            doc: 'AMA base URL',
            format: String,
            default: '',
            env: 'AMA_API_URL'
        },
        login: {
            doc: 'BCI login to authenticate to AMA',
            format: String,
            default: '',
            env: 'AMA_LOGIN'
        },
        password: {
            doc: 'BCI password to authenticate to AMA',
            format: String,
            default: '',
            env: 'AMA_PASSWORD'
        }
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
    gimacApiUrl: {
        doc: 'GIMAC API base url.',
        format: String,
        default: '',
        env: 'GIMAC_API_URL'
    },
    mtnStatuscronExpression: {
        doc: 'cron execution expression to check mtn trx status.',
        format: String,
        default: '',
        env: 'MTN_CRON_EXPRESSION'
    },
    cronPermenantTransferExpression: {
        doc: 'cron execution time for permanent transfers.',
        format: String,
        default: '',
        env: 'CRON_EXPRESSION'
    },
    cronCwExpression: {
        doc: 'check cardless withdrawal transaction expire cron execution time.',
        format: String,
        default: '',
        env: 'CRON_CW_EXPRESSION'
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
    cronMtnExpression: {
        doc: 'check mtn status cron execution time.',
        format: String,
        default: '',
        env: 'CRON_MTN_EXPRESSION'
    },
    cronMtnLinkageExpression: {
        doc: 'check mtn linkage status cron execution time.',
        format: String,
        default: '',
        env: 'CRON_MTN_LINKAGE_EXPRESSION'
    },
    validityduration: {
        doc: 'CARDLESS WITHDRAWAL VALIDITY DURATION.',
        format: Number,
        default: '',
        env: 'VALIDITY_DURATION'
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
    disabledPartnersAuth: {
        doc: 'disable partners request auth.',
        format: Boolean,
        default: false,
        env: 'DISABLED_PARTNERS_AUTH'
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
    minimalMobileBuildVersion: {
        doc: 'Mobile minimal build version supported.',
        format: String,
        default: '',
        env: 'MINIMAL_MOBILE_VERSION'
    },
    maintenanceStatus: {
        doc: 'Mobile maintainance status mode.',
        format: Boolean,
        default: '',
        env: 'MAINTENANCE_STATUS'
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
    },
    visaTransactionFilePendingValue: {
        doc: 'lifetime of a visa transaction file in pending status in minutes',
        format: Number,
        default: '',
        env: 'VISA_TRANSACTION_FILE_PENDING_VALUE'
    },
    suggestionsEmail: {
        doc: 'mail suggestion.',
        format: String,
        default: '',
        env: 'EMAIL_SUGGESTION',
        arg: 'email-suggestion'
    },
});

// Load environment dependent configuration
const env = config.get('env');
config.loadFile(((env === 'development') ? './src/config/' : './dist/config/') + env + '.json');

// Perform validation
// config.validate({ allowed: 'strict' });

// export default config;