import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import { config } from './config';
import helmet from 'helmet';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { logger, morganOption } from './winston';
import * as xmlparser from 'express-xml-bodyparser';
import * as httpContext from 'express-http-context';

// import { oauthVerification } from './middlewares/auth.middleware';
import * as http from 'http';


const app = express();
const Helmet = helmet as any;
app.use(Helmet());

// using bodyParser
app.use(urlencoded({ extended: true }));

// using bodyParser to parse JSON bodies into JS objects
app.use(json({ limit: '15mb' }));

// using XML body parser
app.use(xmlparser());

// enabling CORS for all requests
app.use(cors({ origin: true, credentials: true }));

// adding morgan to log HTTP requests
const format = ':remote-addr - ":method :url HTTP/:http-version" :status :response-time ms - :res[content-length] ":referrer" ":user-agent"';
app.use(morgan(format, morganOption));

// Apply middlewares
app.use(httpContext.middleware);

// Init controllers
const main = express().use(config.get('basePath') || '', app);


const server = http.createServer(main);

server.listen(config.get('port'), config.get('host'), async () => {
    logger.info(`server started. Listening on port ${config.get('port')} in "${config.get('env')}" mode`);
});


export default app;