import { MongoClient } from 'mongodb';
import { AdapterMongoDB } from '../../Infraestructure/AdapterMongoDB';
import type { EntityIndex } from '../../Domain/EntityIndex';
import type { EntityObjectDatabase } from '../../Domain/EntityObjectDatabase';

export class BootstrapingDatabaseMongoDb {
  private uri: string;
  private database: string;
  private objects: EntityObjectDatabase[];
  private indexes: EntityIndex[];

  constructor(_uri: string, _database: string, _objects: EntityObjectDatabase[], indexes: EntityIndex[]) {
    this.uri = _uri;
    this.database = _database;
    this.objects = _objects;
    this.indexes = indexes;
  }

  public async exec(): Promise<void> {
    if (this.objects.length) {
      for (const row of this.objects) {
        await this.createCollection(row.schema, row.entity);
      }
    }
    if (this.indexes.length) {
      await this.createIndexes();
    }
  }

  private async createCollection(schema: string, entity: string): Promise<void> {
    const client: MongoClient = await AdapterMongoDB.openConnection(this.uri);
    const db = client.db(this.database);
    const collections = await db.listCollections().toArray();
    if (collections.findIndex(col => col.name === `${schema}_${entity}`) === -1) {
      await db.createCollection(`${schema}_${entity}`);
    }
    await client.close();
  }

  private async createIndexes(): Promise<void> {
    const client: MongoClient = await AdapterMongoDB.openConnection(this.uri);
    try {
      for (const row of this.indexes) {
        const db = client.db(this.database);
        const col = db.collection(`${row.schema}_${row.entity}`);

        const indexesExists = await col.listIndexes().toArray();
        if (!indexesExists.find(idx => idx.name === row.name)) {
          await col.createIndex(
            row.fields.reduce((obj, subrow) => {
              Object.assign(obj, { [subrow.name]: subrow.direction });
              return obj;
            }, {}),
            { name: row.name, ...row.options },
          );
        }
      }
    } finally {
      await client.close();
    }
  }
}
