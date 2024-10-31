import { IError } from '../../../shared/Domain/IError';
import type { IRequestServiceFindById, IResponseServiceFindById } from '../Domain/IServiceFindById';
import type { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseFindById<C, S> {
  private repository: RepositoryMain<C, S>;

  constructor(repository: RepositoryMain<C, S>) {
    this.repository = repository;
  }

  public async exec(params: IRequestServiceFindById): Promise<IResponseServiceFindById> {
    await this.repository.validateFindById(params);
    const connection = await this.repository.openConnection();
    try {
      const result = await this._exec(connection, params);
      return result;
    } finally {
      await this.repository.closeConnection(connection);
    }
  }

  private async _exec(connection: C, params: IRequestServiceFindById) {
    const result: IResponseServiceFindById[] = await this.repository.findById(connection, params._id);
    if (result.length === 0) throw new IError('El registro no existe', 0, 406);
    return result[0];
  }
}
