import { ObjectId } from 'mongodb';
import { EntityLogDocument } from '../EntityLogDocument';

export interface EntityUtilitieFastLink {
  _id: ObjectId;
  code: string;
  originalLink: string;
  newUrl: string;
  estado: boolean;
  registrar: EntityLogDocument;
  actualizar: EntityLogDocument | null;
  eliminar: EntityLogDocument | null;
}
