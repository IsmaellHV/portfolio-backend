export interface EntityIndex {
  schema: string;
  entity: string;

  name: string;
  fields: {
    name: string;
    direction: number;
  }[];
  options: any;
}
