import { EntityLogDataBase } from './db/EntityLogDataBase';

export interface IRequestServiceLogFindById {
  schema: string;
  entity: string;
  project: string | null;
  env: 'produccion' | 'calidad' | 'local';
  _id: string;
}

export interface IResponseServiceLogFindById extends EntityLogDataBase {}
