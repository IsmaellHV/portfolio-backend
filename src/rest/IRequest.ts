import { Request } from 'express';
import { IUser } from './IUser';
import { IFile } from './IFile';

export interface IRequest extends Request {
  authBasic: boolean;
  authJWT: boolean;
  agente: any;
  paramLog: {
    origen: string;
    agente: any;
    ip: string;
    usuario: IUser;
  };
  files: IFile[];
}
