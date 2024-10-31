import { CronJob } from 'cron';
import { format } from 'date-fns';
import { ClientSession, MongoClient } from 'mongodb';
import { ENVIRONMENT } from '../../../env';
import { IError } from '../Domain/IError';
import { AdapterMongoDB } from './AdapterMongoDB';

const cronRegex = /^(\*|\d+|\/|-|,)+(\s+(\*|\d+|\/|-|,)+){4,5}$/;

export class AdapterCron {
  private crono: CronJob;
  private code: string;
  private schedule: string;
  private func: () => Promise<void>;
  private executing: boolean;

  constructor(code: string, schedule: string, func: () => Promise<void>) {
    if (!code) throw new Error('Indicar code!!!');
    if (!schedule) throw new Error(`${code}: Indicar schedule!!!`);
    this.validateCron(code, schedule);
    if (!func) throw new Error(`${code}: Indicar function!!!`);

    this.crono = {} as CronJob;
    this.code = code;
    this.schedule = schedule;
    this.func = func;
    this.executing = false;
  }

  private validateCron(name: string, schedule: string): void {
    if (!cronRegex.test(schedule)) throw new Error(`${name}: Formato de cron incorrecto: ${schedule}`);
  }

  public create = async (): Promise<boolean> => {
    console.info(this.code, '¡Crono creado!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    this.crono = new CronJob(
      this.schedule,
      async () => {
        if (this.executing) return;
        let _id = '';
        const start = new Date();
        try {
          console.info(this.code, '¡Crono ejecutándose!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
          this.executing = true;
          this.updateOneExecuting(this.code, true);
          _id = await this.saveOneHistory(0, this.code, true, start);
          await this.func();
          await this.updateOneHistory(_id, 1, 'Success');
          await this.updateOneSuccessError(this.code, start, false, '');
        } catch (err) {
          const error = err as IError;
          await this.updateOneHistory(_id, -1, error.message, error.stack);
          await this.updateOneSuccessError(this.code, start, true, error.message);
        } finally {
          this.executing = false;
          this.updateOneExecuting(this.code, false);
        }
      },
      null,
      false,
    );
    return true;
  };

  public changeTime = async (schedule: string): Promise<boolean> => {
    console.info(this.code, '¡Crono changeTime!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    this.schedule = schedule;
    this.crono.stop();
    await this.create();
    await this.start();
    return true;
  };

  public execute = async (): Promise<boolean> => {
    if (this.executing) return false;
    let _id = '';
    const start = new Date();
    try {
      console.info(this.code, '¡execute!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
      this.executing = true;
      this.updateOneExecuting(this.code, true);
      _id = await this.saveOneHistory(0, this.code, true, start);
      await this.func();
      await this.updateOneHistory(_id, 1, 'Success');
      await this.updateOneSuccessError(this.code, start, false, '');
      return true;
    } catch (err) {
      const error = err as IError;
      await this.updateOneHistory(_id, -1, error.message, error.stack);
      await this.updateOneSuccessError(this.code, start, true, error.message);
    } finally {
      this.executing = false;
      this.updateOneExecuting(this.code, false);
    }
  };

  public start = async (): Promise<boolean> => {
    this.crono.start();
    console.info(this.code, '¡Crono iniciado!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    return true;
  };

  public stop = async (): Promise<boolean> => {
    this.crono.stop();
    console.info(this.code, '¡Crono detenido!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    return true;
  };

  public getStatus = async (): Promise<boolean> => {
    console.info(this.code, '¡Crono status!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    return this.crono.running;
  };

  public getSchedule = async (): Promise<string> => {
    console.info(this.code, '¡Crono getSchedule!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    return this.schedule;
  };

  public getName = async (): Promise<string> => {
    console.info(this.code, '¡Crono getName!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    return this.code;
  };

  public getFunc = async (): Promise<() => Promise<void>> => {
    console.info(this.code, '¡Crono getFunc!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    return this.func;
  };

  public getCrono = async (): Promise<CronJob> => {
    console.info(this.code, '¡Crono getCrono!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    return this.crono;
  };

  public getRunning = async (): Promise<boolean> => {
    console.info(this.code, '¡Crono getRunning!', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    return this.executing;
  };

  private async updateOneExecuting(code: string, executing: boolean): Promise<void> {
    const connection: MongoClient = await AdapterMongoDB.openConnection(ENVIRONMENT.MONGODB.URI);
    try {
      const session: ClientSession = await AdapterMongoDB.openSession(connection);

      try {
        await AdapterMongoDB.openTransaction(session);
        await AdapterMongoDB.update(connection, session, ENVIRONMENT.MONGODB.DATABASE, ENVIRONMENT.JOB_TASK.SCHEMA, ENVIRONMENT.JOB_TASK.ENTITY, { code: code }, { executing: executing });

        await AdapterMongoDB.commitTransaction(session);
      } catch (error) {
        await AdapterMongoDB.rollbackTransaction(session);
        throw new IError('Error al grabar en la base de datos', 0, 406, error.message);
      } finally {
        await AdapterMongoDB.closeSession(session);
      }
    } catch (error) {
      console.log({ error });
      // throw error;
    } finally {
      await AdapterMongoDB.closeConnection(connection);
    }
  }

  private async updateOneSuccessError(code: string, lastExecution: Date, lastError: boolean, lastErrorDescription: string): Promise<void> {
    const connection: MongoClient = await AdapterMongoDB.openConnection(ENVIRONMENT.MONGODB.URI);
    try {
      const session: ClientSession = await AdapterMongoDB.openSession(connection);

      try {
        await AdapterMongoDB.openTransaction(session);
        await AdapterMongoDB.update(connection, session, ENVIRONMENT.MONGODB.DATABASE, ENVIRONMENT.JOB_TASK.SCHEMA, ENVIRONMENT.JOB_TASK.ENTITY, { code: code }, { lastExecution, lastError, lastErrorDescription });

        await AdapterMongoDB.commitTransaction(session);
      } catch (error) {
        await AdapterMongoDB.rollbackTransaction(session);
        throw new IError('Error al grabar en la base de datos', 0, 406, error.message);
      } finally {
        await AdapterMongoDB.closeSession(session);
      }
    } catch (error) {
      console.log({ error });
      // throw error;
    } finally {
      await AdapterMongoDB.closeConnection(connection);
    }
  }

  private async saveOneHistory(status: number, taskCode: string, automatic: boolean, start: Date): Promise<string> {
    const connection: MongoClient = await AdapterMongoDB.openConnection(ENVIRONMENT.MONGODB.URI);

    try {
      const session: ClientSession = await AdapterMongoDB.openSession(connection);

      try {
        await AdapterMongoDB.openTransaction(session);
        const _id = await AdapterMongoDB.getId();

        await AdapterMongoDB.save(connection, session, ENVIRONMENT.MONGODB.DATABASE, ENVIRONMENT.JOB_TASKHISTORY.SCHEMA, ENVIRONMENT.JOB_TASKHISTORY.ENTITY, [
          {
            _id,
            status,
            description: '',
            taskCode,
            automatic,
            start: start,
            end: null,
          },
        ]);

        await AdapterMongoDB.commitTransaction(session);
        return _id;
      } catch (error) {
        await AdapterMongoDB.rollbackTransaction(session);
        throw new IError('Error al grabar en la base de datos', 0, 406, error.message);
      } finally {
        await AdapterMongoDB.closeSession(session);
      }
    } catch (error) {
      console.log({ error });
      // throw error;
    } finally {
      await AdapterMongoDB.closeConnection(connection);
    }
  }

  private async updateOneHistory(id: string, status: number, description: string, stack?: string): Promise<void> {
    const connection: MongoClient = await AdapterMongoDB.openConnection(ENVIRONMENT.MONGODB.URI);

    try {
      const session: ClientSession = await AdapterMongoDB.openSession(connection);

      try {
        await AdapterMongoDB.openTransaction(session);
        await AdapterMongoDB.update(connection, session, ENVIRONMENT.MONGODB.DATABASE, ENVIRONMENT.JOB_TASKHISTORY.SCHEMA, ENVIRONMENT.JOB_TASKHISTORY.ENTITY, { _id: id }, { status, description, stack, end: new Date() });

        await AdapterMongoDB.commitTransaction(session);
      } catch (error) {
        await AdapterMongoDB.rollbackTransaction(session);
        throw new IError('Error al grabar en la base de datos', 0, 406, error.message);
      } finally {
        await AdapterMongoDB.closeSession(session);
      }
    } catch (error) {
      console.log({ error });
      // throw error;
    } finally {
      await AdapterMongoDB.closeConnection(connection);
    }
  }
}
