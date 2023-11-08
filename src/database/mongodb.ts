import { MongoClient, Db, MongoClientOptions, Collection } from 'mongodb';
import { config } from 'convict-config';

const { host, name, auth } = config.get('db');
const { user, password } = auth;

const qAuth = user && password ? `${user}:${password}@` : '';

const mongoDBURL = `mongodb://${qAuth}${host}/${name}?retryWrites=true&w=majority`;

const options: MongoClientOptions = {};
if (user && password) { options.auth = { username: user, password }; }

const dbClient = new MongoClient(mongoDBURL, options);

let database: Db;

export async function startDatabase() {
    const connection = await dbClient.connect();
    database = connection.db();
}

// connect to MongoDB database
export async function getDatabase(): Promise<Db> {
    if (!database) await startDatabase();
    return database;
}

// connect to MongoDB database
export async function getCollection(collectionName: string): Promise<Collection<Document>> {
    return (await getDatabase()).collection(collectionName || '');
}

// export class DatabaseManager {

//     private client;
//     private dbName;
//     private db: any;

//     constructor(uri: string, dbName: string) {
//         this.client = new MongoClient(uri);
//         this.dbName = dbName;
//     }

//     async connect() {
//         try {
//             await this.client.connect();
//             this.db = this.client.db(this.dbName);
//         } catch (error) {
//             console.error(`Failed to connect to the database. ${error}`);
//         }
//     }

//     getCollection(collectionName: string) {
//         return this.db.collection(collectionName);
//     }

//     async disconnect() {
//         try {
//             await this.client.close();
//         } catch (error) {
//             console.error(`Failed to close the database connection. ${error}`);
//         }
//     }
// };

export class Database {
    private db!: Db;

    async connect() {
        await dbClient.connect();
        this.db = dbClient.db('mydatabase');
    }

    getDb(): Db {
        return this.db;
    }
}
