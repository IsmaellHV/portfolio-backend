import { ObjectId } from 'mongodb';

export interface EntityLogDataBase {
  _id: ObjectId;
  request: {
    origen: string;
    method: string;
    headers: any;
    body: any;
    originalUrl: string;
    params: any;
    query: any;
  };
  statusAction: number;
  statusHttp: number;
  stack: string | null;
  message: string | null;
  errorCode: number | null;
  messageClient: string | null;
  start: Date | string;
  end: Date | string | null;
  estado: boolean;
}
