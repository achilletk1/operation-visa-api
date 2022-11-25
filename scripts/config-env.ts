import  convict from 'convict';

// Define a schema
export const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'staging', 'staging-bci'],
        default: 'development',
        env: 'NODE_ENV'
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
});

// Load environment dependent configuration
const env = config.get('env');
config.loadFile(((env === 'development') ? './src/config/' : './dist/config/') + env + '.json');

// Perform validation
// config.validate({ allowed: 'strict' });

// export default config;