import { RepositoryDatabase } from '../../../shared/Domain/RepositoryDatabase';
import { EntityMain } from './EntityMain';
import { IRequestServiceCreateShortLink } from './IServiceCreateShortLink';
import { IRequestServiceFindByCode } from './IServiceFindByCode';
import { IRequestServiceFindById } from './IServiceFindById';
import { IRequestServiceSaveOne } from './IServiceSaveOne';
import { IRequestServiceUpdateOne } from './IServiceUpdateOne';

export interface RepositoryMain<C, S> extends RepositoryDatabase<C, S> {
  findByCode(connection: C, code: string): Promise<EntityMain[]>;
  findById(connection: C, _id: string): Promise<EntityMain[]>;
  findByOriginalLink(connection: C, originalLink: string): Promise<EntityMain[]>;
  saveOne(connection: C, session: S, params: EntityMain): Promise<void>;
  updateOne(connection: C, session: S, params: EntityMain): Promise<void>;
  validateCreateShortLink(params: IRequestServiceCreateShortLink): Promise<void>;
  validateFindByCode(params: IRequestServiceFindByCode): Promise<void>;
  validateFindById(params: IRequestServiceFindById): Promise<void>;
  validateSaveOne(params: IRequestServiceSaveOne): Promise<void>;
  validateUpdateOne(params: IRequestServiceUpdateOne): Promise<void>;
}
