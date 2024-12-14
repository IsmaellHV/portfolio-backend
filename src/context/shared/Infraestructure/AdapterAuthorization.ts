import { Response } from 'express';
import { ENVIRONMENT } from '../../../env';
import { IRequest } from '../../../rest/IRequest';
import { IError } from '../Domain/IError';
import { AdapterLog } from './AdapterLog';

export class AdapterAuthorization {
  public static validateAuthBasic(req: IRequest, res: Response): Promise<boolean> {
    return new Promise(resolve => {
      (async () => {
        try {
          const Param: string[] = req.headers.authorization.split(' ');
          if (Param.length !== 2) throw new IError('No está autorizado para utilizar este servicio 1', 0, 401);
          if (Param[0].trim().toUpperCase() !== 'BASIC') throw new IError('No está autorizado para utilizar este servicio 2', 0, 401);

          const body: string = Buffer.from(Param[1], 'base64').toString('utf8');
          const contenido: string[] = body.split(':');
          if (contenido.length !== 2) throw new IError('No está autorizado para utilizar este servicio 3', 0, 401);

          const ok: boolean = await AdapterAuthorization.existsAuthBasic(contenido[0], contenido[1]);
          if (!ok) throw new IError('No está autorizado para utilizar este servicio 4', 0, 401);

          req.paramLog = {
            origen: req.headers.origin || req.headers.host,
            agente: req.agente,
            ip: req.ip,
            usuario: {
              _id: null,
              username: null,
              tipoDocumentoIdentidad: null,
              numeroDocumentoIdentidad: null,
              primerApellido: null,
              segundoApellido: null,
              nombres: null,
              telefono: null,
              correoElectronico: null,
            },
          };

          resolve(ok);
        } catch (err) {
          const error = err as IError;
          error.message = err.message || 'No está autorizado para utilizar este servicio';
          error.statusHttp = err.statusHttp || 401;
          error.errorCode = err.errorCode || 0;
          error.messageClient = err.messageClient || 'No está autorizado para utilizar este servicio';

          res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
          resolve(false);

          const _id = await AdapterLog.insertLog({ request: req, schema: 'LOG', entity: 'GENERICO', project: null });
          if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: 'LOG', entity: 'GENERICO', project: null });

          //   new Promise(async () => {
          //     const _id = await AdapterLog.insertLog({ request: req, schema: 'LOG', entity: 'GENERICO', project: null });
          //     if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: 'LOG', entity: 'GENERICO', project: null });
          // });
        }
      })();
    });
  }

  private static async existsAuthBasic(user: string, pass: string): Promise<boolean> {
    const pIndex = ENVIRONMENT.AUTH_BASIC.findIndex(x => x.usr === user && x.pwd === pass);
    return pIndex === -1 ? false : true;
  }

  public static noValidate(req: IRequest, res: Response): Promise<boolean> {
    return new Promise(resolve => {
      (async () => {
        try {
          throw new IError('No está autorizado para utilizar este servicio', 0, 401);
        } catch (err) {
          const error = err as IError;
          error.message = err.message || 'No está autorizado para utilizar este servicio';
          error.statusHttp = err.statusHttp || 401;
          error.errorCode = err.errorCode || 0;
          error.messageClient = err.messageClient || 'No está autorizado para utilizar este servicio';

          res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
          resolve(false);

          const _id = await AdapterLog.insertLog({ request: req, schema: 'LOG', entity: 'GENERICO', project: null });
          if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: 'LOG', entity: 'GENERICO', project: null });
        }
      })();
    });
  }
}
