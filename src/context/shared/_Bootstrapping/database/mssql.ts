import { ConnectionPool, Request, Transaction } from 'mssql';
import { EntityStructureField } from '../../Domain/EntityStructureField';
import { EntityObjectDatabase } from '../../Domain/EntityObjectDatabase';
import { EntityIndex } from '../../Domain/EntityIndex';
import { ENVIRONMENT } from '../../../../env';

export class BootstrapingDatabaseMssql {
  private uri: string;
  private database: string;
  private objects: EntityObjectDatabase[];
  private indexes: EntityIndex[];
  private bootstraping: boolean;

  constructor(_uri: string, _database: string, _objects: EntityObjectDatabase[], _indexes: EntityIndex[] = [], _bootstrtaping: boolean = ENVIRONMENT.MSSQL.BOOTSTRAPPING) {
    this.uri = _uri;
    this.database = _database;
    this.objects = _objects;
    this.indexes = _indexes;
    this.bootstraping = _bootstrtaping;
  }

  public async exec(): Promise<void> {
    if (this.bootstraping) {
      for (const row of this.objects) {
        await this.createEntity(row.schema, row.entity, row.structure);
      }
      for (const row of this.indexes) {
        await this.createIndexes(row.schema, row.entity, row.name, row.fields, row.options);
      }
    }
  }

  private async createEntity(schema: string, entity: string, structure: EntityStructureField[]): Promise<void> {
    if (!schema) {
      throw Error(`Indicar Esquema: ${schema}-${entity}-${JSON.stringify(structure)}`);
    }
    if (!schema) {
      throw Error(`Indicar Entidad: ${schema}-${entity}-${JSON.stringify(structure)}`);
    }
    if (!structure?.length) {
      throw Error(`${schema}_${entity}: Indicar Estructura`);
    }

    const connection: ConnectionPool = new ConnectionPool(JSON.parse(this.uri));
    await connection.connect();

    const session: Transaction = connection.transaction();
    await session.begin();

    try {
      const querySchemaExists: Request = session.request();
      const schemaExistsResult = await querySchemaExists.query(`
                SELECT COUNT(1) AS schemaExists
                FROM INFORMATION_SCHEMA.SCHEMATA
                WHERE SCHEMA_NAME = '${schema}'
            `);
      const schemaExists = schemaExistsResult.recordset[0].schemaExists === 1;

      if (!schemaExists) {
        const queryCreateSchema: Request = session.request();
        await queryCreateSchema.query(`
                    CREATE SCHEMA ${schema};
                `);
      }

      const queryTableExists: Request = session.request();
      const tableExistsResult = await queryTableExists.query(`
                SELECT COUNT(1) AS tableExists
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_NAME = '${entity}' AND TABLE_SCHEMA = '${schema}'
            `);
      const tableExists = tableExistsResult.recordset[0].tableExists === 1;

      if (tableExists) {
        const queryColumns: Request = session.request();
        const columnsResult = await queryColumns.query(`
                    SELECT COLUMN_NAME, IS_NULLABLE
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME = '${entity}' AND TABLE_SCHEMA = '${schema}'
                `);
        const existingColumns = columnsResult.recordset.map(row => ({
          name: row.COLUMN_NAME,
          nullable: row.IS_NULLABLE === 'YES',
        }));

        const columnsToAdd = structure.filter(field => !existingColumns.some(column => column.name === field.name));
        const columnsToRemove = existingColumns.filter(column => !structure.some(field => field.name === column.name));

        for (const column of columnsToAdd) {
          const queryAddColumn: Request = session.request();

          await queryAddColumn.query(`
                        ALTER TABLE [${this.database}].[${schema}].[${entity}]
                        ADD ${column.name} ${column.type}${column.length ? `(${column.length})` : ''} ${column.aditional} ${column.identity ? 'IDENTITY(1,1)' : ''} ${column.primaryKey ? 'PRIMARY KEY' : ''} ${column.computed ? '' : column.nullable ? 'NULL' : 'NOT NULL'}
                    `);
        }

        for (const column of columnsToRemove) {
          const queryRemoveColumn: Request = session.request();
          await queryRemoveColumn.query(`
                        ALTER TABLE [${this.database}].[${schema}].[${entity}]
                        DROP COLUMN ${column.name}
                    `);
        }
      } else {
        const queryCreateTable: Request = session.request();
        await queryCreateTable.query(`
                    CREATE TABLE [${this.database}].[${schema}].[${entity}]
                    (
                        ${structure.map(field => `${field.name} ${field.type}${field.length ? `(${field.length})` : ''} ${field.aditional} ${field.identity ? 'IDENTITY(1,1)' : ''} ${field.primaryKey ? 'PRIMARY KEY' : ''} ${field.computed ? '' : field.nullable ? 'NULL' : 'NOT NULL'}`).join(',')}
                    );
                `);
      }

      await session.commit();
    } catch (error) {
      console.error(schema, entity, 'Error createEntity: ', error.message);
      await session.rollback();
      throw error;
    } finally {
      await connection.close();
    }
  }

  private async createIndexes(schema: string, entity: string, indexName: string, fields: { name: string; direction: number }[], options: { unique?: boolean; clustered?: boolean }): Promise<void> {
    if (!schema) {
      throw Error(`Indicar Esquema: ${schema}-${entity}`);
    }
    if (!schema) {
      throw Error(`Indicar Entidad: ${schema}-${entity}`);
    }
    if (!indexName) {
      throw new Error(`${schema}.${entity}: Indicar Nombre de Índice`);
    }
    if (!fields || fields.length === 0) {
      throw new Error(`${schema}.${entity}: No se especificaron campos para el índice ${indexName}`);
    }

    const connection: ConnectionPool = new ConnectionPool(JSON.parse(this.uri));
    await connection.connect();

    const session: Transaction = connection.transaction();
    try {
      await session.begin();

      const queryIndex: Request = session.request();
      const indexColumns = fields.map(field => field.name).join(', ');

      await queryIndex.query(`
            IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = '${indexName}' AND object_id = OBJECT_ID('${schema}.${entity}'))
            BEGIN
              CREATE ${options?.unique ? 'UNIQUE' : ''} ${options?.clustered ? 'CLUSTERED' : ''} INDEX ${indexName}
              ON [${schema}].[${entity}] (${indexColumns});
            END
          `);

      await session.commit();
    } catch (error) {
      console.error(schema, entity, indexName, 'Error createIndexes: ', error.message);
      await session.rollback();
      throw error;
    } finally {
      await connection.close();
    }
  }
}
