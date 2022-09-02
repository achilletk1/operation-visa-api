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
import { authController } from './controllers/auth.controller';
import { usersController } from './controllers/users.controller';
import { oauthVerification } from './middlewares/auth.middleware';
import { visaTransactionsController } from './controllers/visa-transactions.controller';
import { visaTransactionsFilesController } from './controllers/visa-transactions-files.controller';
import { downloadsController } from './controllers/download.controller';
import { travelController } from './controllers/travel.controller';
import { onlinePaymentsController } from './controllers/online-payment.controller';


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
app.use(oauthVerification);

// Init controllers
visaTransactionsFilesController.init(app);
visaTransactionsController.init(app);
downloadsController.init(app);
usersController.init(app);
authController.init(app);


travelController.init(app);
onlinePaymentsController.init(app);

const main = express().use(config.get('basePath') || '', app);


const server = http.createServer(main);

server.listen(config.get('port'), config.get('host'), async () => {
    logger.info(`server started. Listening on port ${config.get('port')} in "${config.get('env')}" mode`);
});


export default app;