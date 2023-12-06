import { getConnection, Connection, OUT_FORMAT_OBJECT } from 'oracledb';
import { config } from 'convict-config';
import { logger } from 'winston-config';

let connection: Connection ;

const dbConfig = {
    user: config.get('dbOracle.auth.user'),
    password: config.get('dbOracle.auth.password'),
    connectString: `${config.get('dbOracle.host')}/${config.get('dbOracle.name')}`
};


export async function getDBConnection(isLogs: boolean) {
    if (isLogs || isLogs === null) logger.info(`start db connection to ${dbConfig.connectString} with user ${dbConfig.user}`);

    try {
        connection = await getConnection(dbConfig);
        // connection.callTimeout = 100 * 1000 // raise timeout to 100sec
        if (isLogs || isLogs === null) logger.info('connected successfully to oracle database');
    } catch (error: any) {
        if (error.message !== 'DPI-1050: Oracle Client library is at version 12.2 but version 18.1 or higher is needed') {
            logger.error('database connection error', { error, stack: error.stack });
        }
        logger.error(`database connection error \n${error.stack}`, { stack: error.stack });

    }

    return connection;
}


export async function closeDBConnection(isLogs: boolean) {
    if (!connection) { return ; }
    try {
        await connection.close();
        if (isLogs || isLogs === null) logger.info(`db connection closed successfully to ${dbConfig.connectString}`);
    } catch (error:any) {
        logger.error('close connection error', { error, stack :error.stack });
        return error;
    }
}


export async function executeQuery(query: any, isLogs: boolean = false): Promise<any> {
    let result: any = [];

    try {
        connection = await getDBConnection(isLogs);

        // if (isLogs || isLogs === null)
         logger.debug(`executed query`, { query });

        result = await connection.execute(
            query, [], { outFormat: OUT_FORMAT_OBJECT }
        );

        result = result.rows;

    } catch (error:any) {
        logger.error('error while querying db', { error, stack: error.stack });
        throw error;
    } finally { await closeDBConnection(isLogs); }

    return result;
}