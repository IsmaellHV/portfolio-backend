import type { EntityMain } from './EntityMain';

export interface IRequestServiceFindById {
  _id: string;
}

export interface IResponseServiceFindById extends EntityMain {}
