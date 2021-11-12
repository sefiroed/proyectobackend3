import Server from './services/server';
import Config from './config';
import { Logger } from './services/logger';

const port = Config.PORT;

Server.listen(port, () => Logger.info(`Server up port: ${port}`))


