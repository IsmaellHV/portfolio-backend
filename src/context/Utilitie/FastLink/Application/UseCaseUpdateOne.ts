import type { EntityLogDocument } from '../../../shared/Domain/EntityLogDocument';
import { IError } from '../../../shared/Domain/IError';
import type { EntityMain } from '../Domain/EntityMain';
import type { IRequestServiceUpdateOne } from '../Domain/IServiceUpdateOne';
import type { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseUpdateOne<C, S> {
  private repository: RepositoryMain<C, S>;

  constructor(repository: RepositoryMain<C, S>) {
    this.repository = repository;
  }

  public async exec(params: IRequestServiceUpdateOne, log: EntityLogDocument): Promise<void> {
    await this.repository.validateUpdateOne(params);
    const connection = await this.repository.openConnection();
    try {
      await this._exec(connection, params, log);
    } finally {
      await this.repository.closeConnection(connection);
    }
  }

  private async _exec(connection: C, params: IRequestServiceUpdateOne, log: EntityLogDocument) {
    const session = await this.repository.openSession(connection);
    try {
      await this.repository.openTransaction(session);

      const entityById: EntityMain[] = await this.repository.findByOriginalLink(connection, params.originalLink);
      if (entityById.length === 0) throw new IError('El registro no existe', 0, 406);
      const document: EntityMain = {
        ...entityById[0],
        actualizar: log,
      };

      await this.repository.updateOne(connection, session, document);
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
