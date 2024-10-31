import type { EntityMain } from './EntityMain';

export interface IRequestServiceFindByCode {
  code: string;
}

export interface IResponseServiceFindByCode extends EntityMain {}
