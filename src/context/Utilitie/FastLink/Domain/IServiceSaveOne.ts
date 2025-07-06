import type { EntityMain } from './EntityMain';

export interface IRequestServiceSaveOne {
  originalLink: string;
  code: string;
}

export interface IResponseServiceSaveOne extends EntityMain {}
