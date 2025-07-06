import { RepositoryDatabase } from '../Domain/RepositoryDatabase';
import { ENVIRONMENT } from '../../../env';
import { AdapterMongoDB } from './AdapterMongoDB';
import { ClientSession, MongoClient } from 'mongodb';

export class RepositoryImplMongo implements RepositoryDatabase<MongoClient, ClientSession> {
  async openConnection(uri?: string): Promise<MongoClient> {
    const connectionUri = uri || ENVIRONMENT.MONGODB.URI;
    const connection: MongoClient = await AdapterMongoDB.openConnection(connectionUri);
    return connection;
  }

  async closeConnection(connection: MongoClient): Promise<void> {
    await AdapterMongoDB.closeConnection(connection);
  }

  async openSession(connection: MongoClient): Promise<ClientSession> {
    return await AdapterMongoDB.openSession(connection);
  }

  async closeSession(session: ClientSession): Promise<void> {
    await AdapterMongoDB.closeSession(session);
  }

  async openTransaction(session: ClientSession): Promise<void> {
    await AdapterMongoDB.openTransaction(session);
  }

  async commitTransaction(session: ClientSession): Promise<void> {
    await AdapterMongoDB.commitTransaction(session);
  }

  async rollbackTransaction(session: ClientSession): Promise<void> {
    await AdapterMongoDB.rollbackTransaction(session);
  }

  async getId(): Promise<string> {
    return AdapterMongoDB.getId();
  }

  async save(connection: MongoClient, session: ClientSession, dataBase: string, esquema: string, entidad: string, obj: any[]): Promise<void> {
    await AdapterMongoDB.save(connection, session, dataBase, esquema, entidad, obj);
  }

  async find(connection: MongoClient, dataBase: string, esquema: string, entidad: string, query: any): Promise<any[]> {
    return await AdapterMongoDB.find(connection, dataBase, esquema, entidad, query);
  }

  async update(connection: MongoClient, session: ClientSession, dataBase: string, esquema: string, entidad: string, filter: any, update: any): Promise<void> {
    await AdapterMongoDB.update(connection, session, dataBase, esquema, entidad, filter, update);
  }

  async delete(connection: MongoClient, session: ClientSession, dataBase: string, esquema: string, entidad: string, filter: any): Promise<void> {
    await AdapterMongoDB.delete(connection, session, dataBase, esquema, entidad, filter);
  }
}
