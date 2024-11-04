import { ClientSession, Document, MongoClient, ObjectId, ReadConcern, ReadPreference, InsertManyResult, ReturnDocument } from 'mongodb';
import { IError } from '../Domain/IError';
import { ENVIRONMENT } from '../../../env';

export class AdapterMongoDB {
  public static async openConnection(uri: string): Promise<MongoClient> {
    try {
      const connection: MongoClient = await MongoClient.connect(uri, { directConnection: ENVIRONMENT.MONGODB.DIRECTCONNECTION });
      return connection;
    } catch (error) {
      if (error.message.indexOf('EADDRINUSE') !== -1) {
        return await AdapterMongoDB.openConnection(uri);
      } else {
        throw Error('No es posible establecer conexión con la base de datos');
      }
    }
  }

  public static async closeConnection(connection: MongoClient): Promise<void> {
    try {
      await connection.close(true);
    } catch (error) {
      console.error(error);
    }
  }

  public static async openSession(connection: MongoClient): Promise<ClientSession> {
    const session = connection.startSession({ causalConsistency: true, defaultTransactionOptions: { readPreference: ReadPreference.primaryPreferred } });
    return session;
  }

  public static async closeSession(session: ClientSession): Promise<void> {
    try {
      await session.endSession();
    } catch (error) {
      console.error('Ocurrio un error cerrando una sessión: ', error);
    }
  }

  public static async openTransaction(session: ClientSession): Promise<void> {
    if (session.inTransaction()) {
      throw Error('Ya existe una transacción iniciada');
    }
    session.startTransaction({ readConcern: { level: ReadConcern.SNAPSHOT }, writeConcern: { w: 'majority' } });
  }

  public static async commitTransaction(session: ClientSession): Promise<void> {
    try {
      if (!session.inTransaction()) {
        throw Error('No existe una transacción');
      }
      await session.commitTransaction();
    } catch (error) {
      if (error.errorLabels && error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0) {
        await AdapterMongoDB.commitTransaction(session);
      } else {
        throw error;
      }
    }
  }

  public static async rollbackTransaction(session: ClientSession): Promise<void> {
    if (!session.inTransaction()) {
      console.info('No existe una transacción');
    }
    await session.abortTransaction();
  }

  public static formatDocument(obj: any): any {
    const checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');

    const isIsoDate = (str: string) => {
      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
      const d: any = new Date(str);
      return d instanceof Date && d.toISOString() === str; // valid date
    };

    for (const key of Object.keys(obj)) {
      if (obj[key] !== null) {
        if (key.includes('_id')) {
          if (typeof obj[key] === 'string') {
            obj[key] = checkForValidMongoDbID.test(obj[key]) ? new ObjectId(obj[key]) : obj[key];
          }
        }
        if (key === '$in' || key === '$nin') {
          obj[key] = obj[key].map((row) => (checkForValidMongoDbID.test(row) ? new ObjectId(row) : row));
        }
        if (typeof obj[key] === 'object') {
          if (Array.isArray(obj[key])) {
            for (const row of obj[key]) {
              AdapterMongoDB.formatDocument(row);
            }
          } else if (obj[key] instanceof Date) {
            console.info(obj[key]);
          } else {
            AdapterMongoDB.formatDocument(obj[key]);
          }
        } else if (typeof obj[key] === 'string') {
          if (key.trim().toLocaleLowerCase().includes('fecha')) {
            obj[key] = isIsoDate(obj[key]) ? new Date(obj[key]) : obj[key];
          }
          if (key.trim().toLocaleLowerCase().includes('gte')) {
            obj[key] = isIsoDate(obj[key]) ? new Date(obj[key]) : obj[key];
          }
          if (key.trim().toLocaleLowerCase().includes('lte')) {
            obj[key] = isIsoDate(obj[key]) ? new Date(obj[key]) : obj[key];
          }
        }
      }
    }
    return obj;
  }

  public static validateSelect(obj: any): any {
    for (const a of obj) {
      if (a['$match']) {
        for (const b in a['$match']) {
          if (b.includes('_id')) {
            switch (typeof a['$match'][b]) {
              case 'object':
                if (Object.keys(a['$match'][b]).includes('$in')) {
                  for (let i = 0; i < a['$match'][b]['$in'].length; i++) {
                    a['$match'][b]['$in'][i] = ObjectId.createFromHexString(a['$match'][b]['$in'][i]);
                  }
                }
                if (Object.keys(a['$match'][b]).includes('$nin')) {
                  for (let i = 0; i < a['$match'][b]['$nin'].length; i++) {
                    a['$match'][b]['$nin'][i] = ObjectId.createFromHexString(a['$match'][b]['$nin'][i]);
                  }
                }
                break;
              default:
                a['$match'][b] = ObjectId.createFromHexString(a['$match'][b]);
                break;
            }
          }
          if (b.trim().toLocaleLowerCase().includes('fecha') || b.trim().toLocaleLowerCase().includes('diasautorizado') || b.trim().toLocaleLowerCase().includes('diahabilitado') || b.trim().toLocaleLowerCase().includes('diasautorizado') || b.trim().toLocaleLowerCase().includes('diaautorizado')) {
            for (const c in a['$match'][b]) {
              if (c.includes('gt') || c.includes('lt')) {
                a['$match'][b][c] = new Date(a['$match'][b][c]);
              }
              if (c.includes('$in')) {
                a['$match'][b][c] = a['$match'][b][c].map((d) => new Date(d));
              }
            }
          }
        }
      }
    }
    return obj;
  }

  public static decodeError(error: any) {
    if (error?.code) {
      switch (error.code) {
        case 11000:
          error = new Error(`Existe duplicidad de datos, favor de verificar la información`);
          break;
        default:
          break;
      }
    }
    return error;
  }

  public static getId(): string {
    const id = new ObjectId();
    return id.toHexString();
  }

  static async getNextSequenceValue(connection: MongoClient, dataBase: string, sequenceName: string): Promise<number> {
    const db = connection.db(dataBase);
    const countersCollection = db.collection('counters');

    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === 'counters');
    if (!collectionExists) {
      await db.createCollection('counters');
    }

    const filter = { code: sequenceName } as Document;
    const update = { $inc: { value: 1 } };
    const options = { returnDocument: ReturnDocument.AFTER, upsert: true };

    const sequenceDocument = await countersCollection.findOneAndUpdate(filter, update, options);

    if (!sequenceDocument.value) {
      await countersCollection.insertOne({ code: sequenceName, value: 1 });
      return 1;
    }

    return sequenceDocument.value;
  }

  public static async save(connection: MongoClient, session: ClientSession, dataBase: string, esquema: string, entidad: string, objs: any[]): Promise<void> {
    try {
      for (let i = 0; i < objs.length; i++) {
        objs[i].i = await AdapterMongoDB.getNextSequenceValue(connection, dataBase, `${esquema}_${entidad}_i`);
        AdapterMongoDB.formatDocument(objs[i]);
      }
      const col = connection.db(dataBase).collection(`${esquema}_${entidad}`);
      const response: InsertManyResult<Document> = await col.insertMany(objs, { session });

      if (!response.acknowledged) throw new IError('No se guardaron los datos correctamente', 0, 406, 'Error al grabar');
    } catch (error) {
      if (error.errorLabels && error.errorLabels.indexOf('TransientTransactionError') >= 0) {
        await AdapterMongoDB.save(connection, session, dataBase, esquema, entidad, objs);
      } else {
        const errorDecode = AdapterMongoDB.decodeError(error);
        throw new IError(errorDecode.message, 0, 406, 'Error al grabar');
      }
    }
  }

  public static async find(connection: MongoClient, dataBase: string, esquema: string, entidad: string, query: any): Promise<any> {
    query = AdapterMongoDB.formatDocument(query);
    const col = connection.db(dataBase).collection(`${esquema}_${entidad}`);
    const document = await col.find(query).toArray();
    if (!document) return [];
    return document;
  }

  public static async update(connection: MongoClient, session: ClientSession, dataBase: string, esquema: string, entidad: string, filter: any, update: any): Promise<void> {
    const col = connection.db(dataBase).collection(`${esquema}_${entidad}`);
    filter = AdapterMongoDB.formatDocument(filter);
    update = AdapterMongoDB.formatDocument(update);
    const response = await col.updateMany(filter, { $set: update }, { session });

    if (response.matchedCount === 0) throw new IError('Documento(s) no encontrado(s) para actualizar', 0, 406, 'Error al actualizar');
    if (!response.acknowledged) throw new IError('La actualización no se completó correctamente', 0, 406, 'Error al actualizar');
  }

  public static async delete(connection: MongoClient, session: ClientSession, dataBase: string, esquema: string, entidad: string, filter: any): Promise<void> {
    const col = connection.db(dataBase).collection(`${esquema}_${entidad}`);
    const response = await col.deleteMany(filter, { session });

    if (response.deletedCount === 0) throw new IError('Documento no encontrado para eliminar', 0, 406, 'Error al eliminar');
    if (!response.acknowledged) throw new IError('La eliminación no se completó correctamente', 0, 406, 'Error al eliminar');
  }
}
