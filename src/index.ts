import 'module-alias/register';
import 'dotenv/config';
import express, { Express } from 'express';
import expressLayouts from 'express-ejs-layouts';

import routes from '@routes/index';
import db from '@config/mongoose';
import passport from 'passport';
import passportLocal from '@config/passport-local-strategy';
import setAuthenticatedUser from "@middlewares/set-authenticated-user";

const app: Express = express();
const port = process.env.PORT || 8080;
const mongoClient = db.getClient();

// Configuring Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.use(setAuthenticatedUser);

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
