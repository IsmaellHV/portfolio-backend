import { ObjectId } from 'mongodb';
import type { EntityLogDocument } from '../../../shared/Domain/EntityLogDocument';
import type { EntityMain } from '../Domain/EntityMain';
import type { IRequestServiceSaveOne, IResponseServiceSaveOne } from '../Domain/IServiceSaveOne';
import type { RepositoryMain } from '../Domain/RepositoryMain';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';
import { IError } from '../../../shared/Domain/IError';

export class UseCaseSaveOne<C, S> {
  private repository: RepositoryMain<C, S>;

  constructor(repository: RepositoryMain<C, S>) {
    this.repository = repository;
  }

  public async exec(params: IRequestServiceSaveOne, log: EntityLogDocument): Promise<IResponseServiceSaveOne> {
    await this.repository.validateSaveOne(params);
    const connection = await this.repository.openConnection();
    try {
      const result = await this._exec(connection, params, log);
      return result;
    } finally {
      await this.repository.closeConnection(connection);
    }
  }

  private async _exec(connection: C, params: IRequestServiceSaveOne, log: EntityLogDocument) {
    const session = await this.repository.openSession(connection);
    try {
      await this.repository.openTransaction(session);

      const entityByOriginalLink: EntityMain[] = await this.repository.findByOriginalLink(connection, params.originalLink);
      if (entityByOriginalLink.length > 0) throw new IError('El registro ya existe', 0, 406);

      const entityByCode: EntityMain[] = await this.repository.findByCode(connection, params.code);
      if (entityByCode.length > 0) throw new IError('El código ya existe', 0, 406);

      const _id = await this.repository.getId();
      const shortLink = `${AdapterConfigure.URLSHORTLINK}/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/${params.code}`;

      const document: EntityMain = {
        _id: new ObjectId(_id),
        code: params.code,
        originalLink: params.originalLink,
        shortLink,
        registrar: log,
        actualizar: null,
        eliminar: null,
        estado: true,
      };

      await this.repository.saveOne(connection, session, document);
      await this.repository.commitTransaction(session);
      return document;
    } catch (error) {
      await this.repository.rollbackTransaction(session);
      throw error;
    } finally {
      await this.repository.closeSession(session);
    }
  }
}
