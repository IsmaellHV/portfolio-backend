import { EntityLogDocument } from '../../../shared/Domain/EntityLogDocument';
import { UseCaseCreateShortLink } from '../Application/UseCaseCreateShortLink';
import { UseCaseFindByCode } from '../Application/UseCaseFindByCode';
import { UseCaseFindById } from '../Application/UseCaseFindById';
import { UseCaseSaveOne } from '../Application/UseCaseSaveOne';
import { UseCaseUpdateOne } from '../Application/UseCaseUpdateOne';
import { IRequestServiceCreateShortLink, IResponseServiceCreateShortLink } from '../Domain/IServiceCreateShortLink';
import { IRequestServiceFindByCode, IResponseServiceFindByCode } from '../Domain/IServiceFindByCode';
import { IRequestServiceFindById, IResponseServiceFindById } from '../Domain/IServiceFindById';
import { IRequestServiceSaveOne, IResponseServiceSaveOne } from '../Domain/IServiceSaveOne';
import { IRequestServiceUpdateOne } from '../Domain/IServiceUpdateOne';
import { RepositoryMainImpl } from './RepositoryMainImpl';

export class Controller {
  private repo: RepositoryMainImpl;

  constructor() {
    this.repo = new RepositoryMainImpl();
  }

  public async findById(params: IRequestServiceFindById): Promise<IResponseServiceFindById> {
    const result: IResponseServiceFindById = await new UseCaseFindById(this.repo).exec(params);
    return result;
  }

  public async saveOne(params: IRequestServiceSaveOne, log: EntityLogDocument): Promise<IResponseServiceSaveOne> {
    const result: IResponseServiceSaveOne = await new UseCaseSaveOne(this.repo).exec(params, log);
    return result;
  }

  public async updateOne(params: IRequestServiceUpdateOne, log: EntityLogDocument): Promise<void> {
    await new UseCaseUpdateOne(this.repo).exec(params, log);
  }

  public async findByCode(params: IRequestServiceFindByCode): Promise<IResponseServiceFindByCode> {
    const result: IResponseServiceFindByCode = await new UseCaseFindByCode(this.repo).exec(params);
    return result;
  }

  public async createShortLink(params: IRequestServiceCreateShortLink, log: EntityLogDocument): Promise<IResponseServiceCreateShortLink> {
    const result: IResponseServiceCreateShortLink = await new UseCaseCreateShortLink(this.repo).exec(params, log);
    return result;
  }
}
