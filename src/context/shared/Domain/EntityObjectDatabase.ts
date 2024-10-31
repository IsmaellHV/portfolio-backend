import { EntityStructureField } from './EntityStructureField';

export interface EntityObjectDatabase {
  schema: string;
  entity: string;
  structure: EntityStructureField[];
}
