export interface EntityJobTask {
  schema: string;
  entity: string;
  code: string;
  name: string;
  schedule: string;
  scheduleTranslated?: any;
  task: () => Promise<void>;
  estado: boolean;
  executing: boolean;
  registrar?: Date;
  actualizar?: Date;
  lastExecution?: Date;
  lastError?: boolean;
  lastErrorDescription?: string;
}
