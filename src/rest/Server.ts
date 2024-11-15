import compression from 'compression';
import cors from 'cors';
import eetase from 'eetase';
import express, { Express, NextFunction, Response } from 'express';
import helmet from 'helmet';
import htpp from 'http';
import morgan from 'morgan';
import parse from 'ua-parser-js';
import { IError } from '../context/shared/Domain/IError';
import { AdapterLog } from '../context/shared/Infraestructure/AdapterLog';
import { ENVIRONMENT } from '../env';
import { RequestCostume } from './RequestCostume';

export class ServerREST {
  public app: Express;
  private httpServer: any;
  private port: number;
  private whitelist: string[];

  constructor() {
    this.port = ENVIRONMENT.PORT;
    this.whitelist = ENVIRONMENT.DOMAINS;
  }

  public async exec() {
    await this.createServer();
    await this.configurePlugins();
    await this.configureDataType();
    await this.middlewareValidator();
    await this.middlewareError();
    this.httpServer = eetase(htpp.createServer(this.app));
    this.httpServer.listen(this.port);
  }

  private async createServer() {
    this.app = express();
    this.app.use(morgan('tiny'));
    this.app.disable('x-powered-by');
    this.app.set('json spaces', 2);
    this.app.set('trust proxy', true);
  }

  private async configurePlugins() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (origin) {
            if (this.whitelist.filter(org => origin.includes(org)).length > 0) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          } else {
            callback(null, true);
          }
        },
      }),
    );
  }

  private async configureDataType() {
    this.app.use(express.json({ limit: '15360mb' }));
    this.app.use(express.text({ limit: '15360mb' }));
    this.app.use(express.urlencoded({ limit: '15360mb', extended: true }));
  }

  private async middlewareValidator() {
    this.app.use((req: RequestCostume, res: Response, next: NextFunction) => {
      new Promise<void>((resolve, reject) => {
        (async () => {
          req.authBasic = false;
          req.authJWT = false;

          try {
            req.agente = parse(req.headers['user-agent']);
            if (!req.headers.authorization) {
              next();
              return resolve();
            }

            const Param: string[] = req.headers.authorization.split(' ');
            if (Param.length === 1) Param.splice(0, 0, 'BEARER');
            if (Param.length !== 2) {
              next();
              return resolve();
            }

            switch (Param[0].trim().toUpperCase()) {
              case 'BASIC':
                req.authBasic = true;
                break;
              case 'BEARER':
                req.authJWT = true;
                break;
            }

            next();
            resolve();
          } catch (err) {
            const error = err as IError;
            error.message = err.message || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';
            error.statusHttp = err.statusHttp || 401;
            error.errorCode = err.errorCode || 0;
            error.messageClient = err.messageClient || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';

            res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
            reject();

            const _id = await AdapterLog.insertLog({ request: req, schema: 'LOG', entity: 'AUTH', project: null });
            if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: 'LOG', entity: 'AUTH', project: null });
          }
        })();
      }).catch(() => {
        console.error('Error en middlewareValidator execution');
      });
    });
  }

  private async middlewareError() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: any, req: RequestCostume, res: Response, next: NextFunction) => {
      new Promise<void>(resolve => {
        (async () => {
          try {
            throw new IError(err.message, err.errorCode || 0, err.statusCode || 500, 'Se produjo un error. Por favor, inténtelo de nuevo más tarde');
          } catch (err) {
            const error = err as IError;
            error.message = err.message || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';
            error.statusHttp = err.statusHttp || 500;
            error.errorCode = err.errorCode || 0;
            error.messageClient = err.messageClient || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';

            res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
            resolve();

            const _id = await AdapterLog.insertLog({ request: req, schema: 'LOG', entity: 'ERROR', project: null });
            if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: 'LOG', entity: 'ERROR', project: null });
          }
        })();
      }).catch(() => {
        console.error('Error en middlewareError execution');
      });
    });
  }

  public async middlewareNotFound() {
    this.app.use('*', (req: RequestCostume, res: Response) => {
      new Promise<void>(resolve => {
        (async () => {
          try {
            throw new IError('EndPoint not found', 0, 404, 'Servicio no encontrado');
          } catch (err) {
            const error = err as IError;
            error.message = err.message || 'EndPoint not found';
            error.statusHttp = err.statusHttp || 500;
            error.errorCode = err.errorCode || 0;
            error.messageClient = err.messageClient || 'Servicio no encontrado';

            res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
            resolve();

            const _id = await AdapterLog.insertLog({ request: req, schema: 'LOG', entity: 'NOTFOUND', project: null });
            if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: 'LOG', entity: 'NOTFOUND', project: null });
          }
        })();
      }).catch(() => {
        console.error('Error en middlewareNotFound execution');
      });
    });
  }
}
