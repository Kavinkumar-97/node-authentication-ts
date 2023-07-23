import 'module-alias/register';
import 'dotenv/config';
import express, { Express } from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';

import routes from '@routes/index';
import db from '@config/mongoose';
import { config } from '@config/passport-local-strategy';
import setAuthenticatedUser from '@middlewares/set-authenticated-user';
import setFlash from '@middlewares/set-flash';

const app: Express = express();
const port = process.env.PORT || 8080;
const mongoClient = db.getClient();
const passportLocal = config();

// Configuring Body & Cookie Parsers
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuring session
app.use(
  session({
    name: 'Node Authentication System',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 15, // Max - age of 15 days
    },
    store: new MongoStore({
      client: mongoClient,
      autoRemove: 'disabled',
    }),
  }),
);

// Configuring
app.use(express.static('assets'));

// Configuring Ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// Configuring Ejs Layouts
app.set('layout', 'layouts/layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

app.use(expressLayouts);

// Configuring Passports
app.use(passport.initialize());
app.use(passport.session());

// Configuring Authentication Middlewares
app.use(setAuthenticatedUser);

// Configuring Flash
app.use(flash());
app.use(setFlash);

// Configuring Routes
app.use(routes);

// Listening to port
app
  .listen(port, () => {
    console.info(`listening on port ${port}`);
  })
  .on('error', (err) => {
    console.error(err);
  });
