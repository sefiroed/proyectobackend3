import express from 'express';
import path from 'path';
import Config from '../config';
import * as http from 'http';
import apiRouter from '../routes/index';
import { ErrorRequestHandler } from 'express';
import { Logger } from './logger';
import { loggers } from 'winston';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from '../middleware/admin';

const StoreOptions = {
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://admin:3472180@cluster0.eubxi.mongodb.net/ecommerce?retryWrites=true&w=majority`,
  }),

  secret: Config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: Config.SESSION_COOKIE_TIMEOUT_MIN * 60 * 1000,
  },
};


const app = express();
app.use(session(StoreOptions));

const publicFolderPath = path.resolve(__dirname, '../../public');
app.use(express.static(publicFolderPath));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  Logger.info(`REQ.USER ===> ${JSON.stringify(req.user)}`);
  next();
});
app.use('/api', apiRouter)


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(`THERE WAS A MISTAKE ${err}`);
    res.status(500).json({
      err: err.message,
    });
};
  
app.use(errorHandler);

const myServer = new http.Server(app);

export default myServer;