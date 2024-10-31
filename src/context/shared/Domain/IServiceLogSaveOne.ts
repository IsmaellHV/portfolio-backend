export interface IRequestServiceLogSaveOne {
  schema: string;
  entity: string;
  project: string | null;
  env: 'produccion' | 'calidad' | 'local';
  request: {
    origen: string;
    method: string;
    headers: any;
    body: any;
    originalUrl: string;
    params: any;
    query: any;
  };
}
