import 'module-alias/register';
import express, { Express } from 'express';

import routes from '@routes/index';

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app
  .listen(port, () => {
    console.info(`listening on port ${port}`);
  })
  .on('error', (err) => {
    console.error(err);
  });
