import Server from './services/server';
import Config from './config';

const port = Config.PORT;

Server.listen(port, () => console.log(`Server up port: ${port}`))


