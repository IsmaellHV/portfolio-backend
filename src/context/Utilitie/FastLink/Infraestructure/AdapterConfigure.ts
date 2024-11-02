import { ENVIRONMENT } from '../../../../env';
import { EntityIndex } from '../../../shared/Domain/EntityIndex';
import { EntityObjectDatabase } from '../../../shared/Domain/EntityObjectDatabase';

const URI: string = ENVIRONMENT.MONGODB.URI;
const DATABASE: string = ENVIRONMENT.MONGODB.DATABASE;
const SCHEMA: string = ENVIRONMENT.UTILITIE.FASTLINK.SCHEMA;
const ENTITY: string = ENVIRONMENT.UTILITIE.FASTLINK.ENTITY;
const URLSHORTLINK: string = ENVIRONMENT.UTILITIE.FASTLINK.URLSHORTLINK;

const DATABASE_OBJECTS: EntityObjectDatabase[] = [
  {
    schema: SCHEMA,
    entity: ENTITY,
    structure: [],
  },
];

const DATABASE_INDEXES: EntityIndex[] = [
  {
    schema: SCHEMA,
    entity: ENTITY,
    name: `IDX_${SCHEMA}_${ENTITY}_code`,
    fields: [{ name: 'code', direction: 1 }],
    options: { unique: true },
  },
  {
    schema: SCHEMA,
    entity: ENTITY,
    name: `IDX_${SCHEMA}_${ENTITY}_originalLink`,
    fields: [{ name: 'originalLink', direction: 1 }],
    options: { unique: true },
  },
];

export const AdapterConfigure = {
  DATABASE_OBJECTS,
  DATABASE_INDEXES,
  URI,
  DATABASE,
  SCHEMA,
  ENTITY,
  URLSHORTLINK,
};
