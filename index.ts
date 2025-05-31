import dotenv from 'dotenv';
dotenv.config();

import { ENVIRONMENT } from './src/env';
import { RouterRest } from './src/rest/Router';
import { ServerREST } from './src/rest/Server';

const run = async () => {
  try {
    const rutas: RouterRest = new RouterRest();
    await rutas.exec();

    const server: ServerREST = new ServerREST();
    await server.exec();

    server.app.use(`/api`, rutas.router);
    await server.middlewareNotFound();

    console.info('   >> PID: ', process.pid);
    console.info('   >> PORT: ', ENVIRONMENT.PORT);
  } catch (error) {
    console.error(error);
  }
};

run();

process.on('SIGINT', function () {
  console.info('Caught interrupt signal');
  process.exit();
});
