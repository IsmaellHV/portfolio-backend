export interface EntityStructureField {
  name: string;
  type: string;
  length: number | null;
  aditional: string;
  identity: boolean;
  nullable?: boolean;
  computed?: boolean;
  primaryKey?: boolean;
}
