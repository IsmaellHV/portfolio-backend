import type { EntityMain } from './EntityMain';

export interface IRequestServiceFindByOriginalLink {
  originalLink: string;
}

export interface IResponseServiceFindByOriginalLink extends EntityMain {}
