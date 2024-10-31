export interface IRequestServiceLogUpdateOne {
  schema: string;
  entity: string;
  project: string | null;
  env: 'produccion' | 'calidad' | 'local';
  _id: string;
  statusAction: number;
  statusHttp: number;
  stack: string | null;
  message: string | null;
  errorCode: number | null;
  messageClient: string | null;
}
