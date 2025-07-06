import { ENVIRONMENT } from '../../../env';
import { IRequest } from '../../../rest/IRequest';
import { IError } from '../Domain/IError';
import { EntityLogDataBase } from '../Domain/db/EntityLogDataBase';
// import { AdapterWsp } from './AdapterWsp';
import { MongoClient, ObjectId } from 'mongodb';
import { AdapterMongoDB } from './AdapterMongoDB';

export class AdapterLog {
  constructor() {}

  public static insertLog({ request, schema, entity, project }: { request: IRequest; schema: string; entity: string; project: string | null }): Promise<string> {
    return new Promise(resolve => {
      (async () => {
        const connection: MongoClient = await AdapterMongoDB.openConnection(ENVIRONMENT.MONGODB.URI);
        try {
          const origen: string = request?.headers?.origin ?? request?.headers?.host ?? '';
          const dataBase = ENVIRONMENT.ENV === 'produccion' ? ENVIRONMENT.MONGODB.DATABASELOG : ENVIRONMENT.MONGODB.DATABASELOGQA;
          const esquema = schema.toUpperCase();
          const entidad = project ? `${entity}_${project}`.toUpperCase() : entity.toUpperCase();
          const col = connection.db(dataBase).collection(`${esquema}_${entidad}`);

          const body: string = JSON.stringify(request.body).substring(0, 4000);
          request.body = body;

          const request_ = !request
            ? null
            : {
                origen: origen,
                method: request?.method ?? null,
                headers: request?.headers ?? null,
                body: request?.body ?? null,
                originalUrl: request?.originalUrl ?? null,
                params: request?.params ?? null,
                query: request?.query ?? null,
              };

          const _id: string = AdapterMongoDB.getId();
          const insert: EntityLogDataBase = {
            _id: new ObjectId(_id),
            request: request_,
            statusAction: 0,
            statusHttp: 0,
            errorCode: 0,
            stack: null,
            message: null,
            messageClient: null,
            start: new Date(),
            end: null,
            estado: true,
          };
          await col.insertOne(insert);
          await AdapterMongoDB.closeConnection(connection);
          resolve(_id);
        } catch (err) {
          console.error(err);
          resolve('');
        } finally {
          await AdapterMongoDB.closeConnection(connection);
        }
      })();
    });
  }

  public static updateLog({ _id, statusAction, statusHttp, error, schema, entity, project }: { _id: string; statusAction: -1 | 0 | 1; statusHttp: number; error?: IError | null; schema: string; entity: string; project: string | null }): Promise<void> {
    return new Promise(resolve => {
      (async () => {
        const connection: MongoClient = await AdapterMongoDB.openConnection(ENVIRONMENT.MONGODB.URI);
        try {
          const dataBase = ENVIRONMENT.ENV === 'produccion' ? ENVIRONMENT.MONGODB.DATABASELOG : ENVIRONMENT.MONGODB.DATABASELOGQA;
          const esquema = schema.toUpperCase();
          const entidad = project ? `${entity}_${project}`.toUpperCase() : entity.toUpperCase();
          const col = connection.db(dataBase).collection(`${esquema}_${entidad}`);

          const filter = { _id: new ObjectId(_id) };
          const update = {
            $set: {
              end: new Date(),
              statusAction: statusAction,
              stack: statusAction === 1 ? null : error.stack,
              message: statusAction === 1 ? null : error.message,
              statusHttp: statusHttp,
              errorCode: !error?.errorCode ? 0 : error?.errorCode,
              messageClient: !error?.messageClient ? null : error?.messageClient,
            },
          };
          await col.updateOne(filter, update);
          await AdapterMongoDB.closeConnection(connection);
          resolve();
          if (statusAction === -1) await this.handleLogError({ _id, schema, entity, project, error });
        } catch (err) {
          console.error(err);
          resolve();
        } finally {
          await AdapterMongoDB.closeConnection(connection);
        }
      })();
    });
  }

  private static handleLogError({ _id, schema, entity, project, error }: { _id: string; schema: string; entity: string; project: string | null; error?: IError | null }): Promise<void> {
    return new Promise(resolve => {
      (async () => {
        try {
          const log = await this.findByIdLog({ _id, schema, entity, project });
          const body = typeof log.request.body !== 'string' ? JSON.stringify(log.request.body) : log.request.body;
          const message = ['***ERROR:***', `AMBIENTE: (${ENVIRONMENT.ENV.toUpperCase()})`, log.request.method, body.substring(0, 100), log.request.originalUrl.substring(0, 1000), error?.message?.substring(0, 1000)].join('\n');
          console.error(message);

          // await AdapterWsp.sendMessageLog(ENVIRONMENT.ENV, message);
          resolve();
        } catch (logError) {
          try {
            console.error(logError);
            // const fallbackMessage = ['***ERROR:***', `AMBIENTE: (${ENVIRONMENT.ENV.toUpperCase()})`, logError.message?.substring(0, 1000)].join('\n');

            // await AdapterWsp.sendMessageLog(ENVIRONMENT.ENV, fallbackMessage);
            resolve();
          } catch (error) {
            console.error(error.message);
            resolve();
          }
        }
      })();
    });
  }

  private static async findByIdLog({ _id, schema, entity, project }: { _id: string; schema: string; entity: string; project: string | null }): Promise<EntityLogDataBase> {
    const connection: MongoClient = await AdapterMongoDB.openConnection(ENVIRONMENT.MONGODB.URI);
    try {
      const dataBase = ENVIRONMENT.ENV === 'produccion' ? ENVIRONMENT.MONGODB.DATABASELOG : ENVIRONMENT.MONGODB.DATABASELOGQA;
      const esquema = schema.toUpperCase();
      const entidad = project ? `${entity}_${project}`.toUpperCase() : entity.toUpperCase();

      const registry: EntityLogDataBase[] = await AdapterMongoDB.find(connection, dataBase, esquema, entidad, { _id });
      if (!registry.length) throw new Error('Registro no encontrado');

      return registry[0];
    } finally {
      await AdapterMongoDB.closeConnection(connection);
    }
  }
}
