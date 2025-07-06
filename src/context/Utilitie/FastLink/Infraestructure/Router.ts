import { Response, Router as RouterExpress } from 'express';
import { IRequest } from '../../../../rest/IRequest';
import { IError } from '../../../shared/Domain/IError';
import { AdapterAuthorization } from '../../../shared/Infraestructure/AdapterAuthorization';
import { AdapterGenerico } from '../../../shared/Infraestructure/AdapterGenerico';
import { AdapterLog } from '../../../shared/Infraestructure/AdapterLog';
import { IRequestServiceCreateShortLink, IResponseServiceCreateShortLink } from '../Domain/IServiceCreateShortLink';
import { IRequestServiceFindById, IResponseServiceFindById } from '../Domain/IServiceFindById';
import { IRequestServiceRedirectLink, IResponseServiceRedirectLink } from '../Domain/IServiceRedirectLink';
import { IRequestServiceSaveOne, IResponseServiceSaveOne } from '../Domain/IServiceSaveOne';
import { AdapterConfigure } from './AdapterConfigure';
import { Controller } from './Controller';

export class Router {
  public controller: Controller;
  public router: RouterExpress;

  constructor() {
    this.controller = new Controller();
    this.router = RouterExpress();
  }

  public async exec(): Promise<void> {
    this.router.get(`/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/shortLink/:shortLink`, this.redirectLink.bind(this));
    this.router.get(`/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/createLink/:originalLink/:captcha`, this.createLink.bind(this));
    this.router.get(`/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/find/:_id`, this.findById.bind(this));
    this.router.post(`/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/saveOne`, this.saveOne.bind(this));
  }

  private async findById(req: IRequest, res: Response): Promise<void> {
    return new Promise(resolve => {
      (async () => {
        if (req.authBasic) {
          if (!(await AdapterAuthorization.validateAuthBasic(req, res))) return resolve();
        } else {
          await AdapterAuthorization.noValidate(req, res);
          return resolve();
        }

        const _id: string = req.params._id;
        const body: IRequestServiceFindById = { _id };
        let result: IResponseServiceFindById;

        try {
          result = await this.controller.findById(body);

          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.status(200).json(result);
          resolve();
          if (_id) await AdapterLog.updateLog({ _id, statusAction: 1, statusHttp: 200, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        } catch (err) {
          const error = err as IError;
          error.message = err.message || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';
          error.statusHttp = err.statusHttp || 406;
          error.errorCode = err.errorCode || 0;
          error.messageClient = err.messageClient || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';

          res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
          resolve();
          if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        }
      })();
    });
  }

  private async createLink(req: IRequest, res: Response): Promise<void> {
    return new Promise(resolve => {
      (async () => {
        if (req.authBasic) {
          if (!(await AdapterAuthorization.validateAuthBasic(req, res))) return resolve();
        } else {
          await AdapterAuthorization.noValidate(req, res);
          return resolve();
        }

        const { originalLink, captcha } = req.params;
        const body: IRequestServiceCreateShortLink = { originalLink: decodeURIComponent(originalLink), captcha: decodeURIComponent(captcha) };
        let result: IResponseServiceCreateShortLink;

        const _id = await AdapterLog.insertLog({ request: req, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        try {
          result = await this.controller.createShortLink(body, AdapterGenerico.generateLogEntity(req));

          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.status(200).json(result);
          resolve();
          if (_id) await AdapterLog.updateLog({ _id, statusAction: 1, statusHttp: 200, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        } catch (err) {
          const error = err as IError;
          error.message = err.message || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';
          error.statusHttp = err.statusHttp || 406;
          error.errorCode = err.errorCode || 0;
          error.messageClient = err.messageClient || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';

          res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
          resolve();
          if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        }
      })();
    });
  }

  private async saveOne(req: IRequest, res: Response): Promise<void> {
    return new Promise(resolve => {
      (async () => {
        if (req.authBasic) {
          if (!(await AdapterAuthorization.validateAuthBasic(req, res))) return resolve();
        } else {
          await AdapterAuthorization.noValidate(req, res);
          return resolve();
        }

        const body: IRequestServiceSaveOne = req.body;
        let result: IResponseServiceSaveOne;

        const _id = await AdapterLog.insertLog({ request: req, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        try {
          result = await this.controller.saveOne(body, AdapterGenerico.generateLogEntity(req));

          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.status(200).json(result);
          resolve();
          if (_id) await AdapterLog.updateLog({ _id, statusAction: 1, statusHttp: 200, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        } catch (err) {
          const error = err as IError;
          error.message = err.message || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';
          error.statusHttp = err.statusHttp || 406;
          error.errorCode = err.errorCode || 0;
          error.messageClient = err.messageClient || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';

          res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
          resolve();
          if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        }
      })();
    });
  }

  private async redirectLink(req: IRequest, res: Response): Promise<void> {
    return new Promise(resolve => {
      (async () => {
        const shortLink: string = req.params.shortLink;
        const body: IRequestServiceRedirectLink = { shortLink };
        let result: IResponseServiceRedirectLink;

        const _id = await AdapterLog.insertLog({ request: req, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        try {
          result = await this.controller.findByCode({ code: body.shortLink });
          res.redirect(result.originalLink);
          resolve();
          if (_id) await AdapterLog.updateLog({ _id, statusAction: 1, statusHttp: 200, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        } catch (err) {
          const error = err as IError;
          error.message = err.message || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';
          error.statusHttp = err.statusHttp || 406;
          error.errorCode = err.errorCode || 0;
          error.messageClient = err.messageClient || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';

          res.status(error.statusHttp).json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message });
          resolve();
          if (_id) await AdapterLog.updateLog({ _id, statusAction: -1, statusHttp: error.statusHttp, error, schema: AdapterConfigure.SCHEMA, entity: AdapterConfigure.ENTITY, project: null });
        }
      })();
    });
  }
}
