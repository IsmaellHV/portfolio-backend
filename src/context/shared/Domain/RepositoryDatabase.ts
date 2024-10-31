export interface RepositoryDatabase<C, S> {
  closeConnection(connection: C): Promise<void>;
  closeSession(session: S): Promise<void>;
  commitTransaction(session: S): Promise<void>;
  delete(client: C, session: S, dataBase: string, esquema: string, entidad: string, filter: any): Promise<void>;
  find(client: C, dataBase: string, esquema: string, entidad: string, query: any): Promise<any>;
  getId(): Promise<string>;
  openConnection(uri?: string): Promise<C>;
  openSession(connection: C): Promise<S>;
  openTransaction(session: S): Promise<void>;
  rollbackTransaction(session: S): Promise<void>;
  save(client: C, session: S, dataBase: string, esquema: string, entidad: string, obj: any): Promise<void>;
  update(client: C, session: S, dataBase: string, esquema: string, entidad: string, filter: any, update: any): Promise<void>;
}
