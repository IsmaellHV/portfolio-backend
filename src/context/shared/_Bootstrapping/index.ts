import { ENVIRONMENT } from '../../../env';
import { EntityIndex } from '../Domain/EntityIndex';
import { EntityObjectDatabase } from '../Domain/EntityObjectDatabase';
import { BootstrapingDatabaseMssql } from './database/mssql';
import { BootstrapingDatabaseMongoDb } from './database/mongodb';

export class Bootstrapping {
  public databaseBootstrap: BootstrapingDatabaseMssql | { exec: () => void };

  constructor(motor: 'mssql' | 'mongo' | 'local', uri: string, database: string, objects: EntityObjectDatabase[], indexes: EntityIndex[], bootstraping: boolean = ENVIRONMENT.MSSQL.BOOTSTRAPPING) {
    switch (motor.toLowerCase()) {
      case 'mssql':
        this.databaseBootstrap = new BootstrapingDatabaseMssql(uri, database, objects, indexes, bootstraping);
        break;
      case 'local':
        this.databaseBootstrap = { exec: () => {} };
        break;
      case 'mongo':
        this.databaseBootstrap = new BootstrapingDatabaseMongoDb(uri, database, objects, indexes);
        break;
      default:
        throw new Error('No support motor database');
        break;
    }
  }

  async exec() {
    await this.databaseBootstrap.exec();
  }
}
