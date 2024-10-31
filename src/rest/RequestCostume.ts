import { Request } from 'express';
import { EntityUsuario } from '../context/shared/Domain/EntityUsuario';
import { EntityFile } from '../context/shared/Domain/EntityFile';

export interface RequestCostume extends Request {
  authBasic: boolean;
  authJWT: boolean;
  agente: any;
  paramLog: {
    origen: string;
    agente: any;
    ip: string;
    usuario: EntityUsuario;
  };
  files: EntityFile[];
}
