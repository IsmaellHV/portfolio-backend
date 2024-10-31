import { IError } from '../../../shared/Domain/IError';
import type { IRequestServiceFindByCode, IResponseServiceFindByCode } from '../Domain/IServiceFindByCode';
import type { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseFindByCode<C, S> {
  private repository: RepositoryMain<C, S>;

  constructor(repository: RepositoryMain<C, S>) {
    this.repository = repository;
  }

  public async exec(params: IRequestServiceFindByCode): Promise<IResponseServiceFindByCode> {
    await this.repository.validateFindByCode(params);
    const connection = await this.repository.openConnection();
    try {
      const result = await this._exec(connection, params);
      return result;
    } finally {
      await this.repository.closeConnection(connection);
    }
  }

  private async _exec(connection: C, params: IRequestServiceFindByCode) {
    const result: IResponseServiceFindByCode[] = await this.repository.findByCode(connection, params.code);
    if (result.length === 0) throw new IError('Enlace no encontrado', 0, 406, 'Enlace no encontrado');
    return result[0];
  }
}
