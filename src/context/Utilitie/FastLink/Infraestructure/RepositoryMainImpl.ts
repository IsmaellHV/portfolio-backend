import AJV from 'ajv';
import addFormats from 'ajv-formats';
import { ClientSession, MongoClient } from 'mongodb';
import { IError } from '../../../shared/Domain/IError';
import { AdapterGenerico } from '../../../shared/Infraestructure/AdapterGenerico';
import { RepositoryImplMongo } from '../../../shared/Infraestructure/RepositoryImplMongo';
import { EntityMain } from '../Domain/EntityMain';
import { IRequestServiceFindById } from '../Domain/IServiceFindById';
import { IRequestServiceSaveOne } from '../Domain/IServiceSaveOne';
import { IRequestServiceUpdateOne } from '../Domain/IServiceUpdateOne';
import { RepositoryMain } from '../Domain/RepositoryMain';
import { AdapterConfigure } from './AdapterConfigure';
import { IRequestServiceFindByCode } from '../Domain/IServiceFindByCode';
import { IRequestServiceCreateShortLink } from '../Domain/IServiceCreateShortLink';

const ajv = new AJV({ removeAdditional: true, logger: false });
addFormats(ajv);

export class RepositoryMainImpl extends RepositoryImplMongo implements RepositoryMain<MongoClient, ClientSession> {
  public async validateFindById(params: IRequestServiceFindById): Promise<void> {
    const schema = {
      type: 'object',
      properties: {
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      },
      required: ['_id'],
      additionalProperties: false,
    };

    const validate = ajv.compile(schema);
    const valid = validate(params);
    if (!valid) {
      throw new IError(AdapterGenerico.decodeErrorAJV(validate.errors[0]), 0, 406, 'Error de validación');
    }
  }

  public async validateFindByCode(params: IRequestServiceFindByCode): Promise<void> {
    const schema = {
      type: 'object',
      properties: {
        code: { type: 'string'},
      },
      required: ['code'],
      additionalProperties: false,
    };

    const validate = ajv.compile(schema);
    const valid = validate(params);
    if (!valid) {
      throw new IError(AdapterGenerico.decodeErrorAJV(validate.errors[0]), 0, 406, 'Error de validación');
    }
  }


  public async validateSaveOne(params: IRequestServiceSaveOne): Promise<void> {
    const schema = {
      type: 'object',
      properties: {
        originalLink: { type: 'string', format: 'uri' },
        code: { type: 'string' },
      },
      required: ['originalLink', 'code'],
    };

    const validate = ajv.compile(schema);
    const valid = validate(params);
    if (!valid) {
      throw new IError(AdapterGenerico.decodeErrorAJV(validate.errors[0]), 0, 406, 'Error de validación');
    }
  }

  public async validateCreateShortLink(params: IRequestServiceCreateShortLink): Promise<void> {
    const schema = {
      type: 'object',
      properties: {
        originalLink: { type: 'string', format: 'uri' },
      },
      required: ['originalLink'],
    };

    const validate = ajv.compile(schema);
    const valid = validate(params);
    if (!valid) {
      throw new IError(AdapterGenerico.decodeErrorAJV(validate.errors[0]), 0, 406, 'Error de validación');
    }
  }

  public async validateUpdateOne(params: IRequestServiceUpdateOne): Promise<void> {
    const schema = {
      type: 'object',
      properties: {
        originalLink: { type: 'string' },
      },
      required: ['originalLink'],
      additionalProperties: false,
    };

    const validate = ajv.compile(schema);
    const valid = validate(params);
    if (!valid) {
      throw new IError(AdapterGenerico.decodeErrorAJV(validate.errors[0]), 0, 406, 'Error de validación');
    }
  }

  public async findById(connection: MongoClient, _id: string): Promise<EntityMain[]> {
    const response: EntityMain[] = await this.find(connection, AdapterConfigure.DATABASE, AdapterConfigure.SCHEMA, AdapterConfigure.ENTITY, { _id });
    return response;
  }

  public async findByOriginalLink(connection: MongoClient, originalLink: string): Promise<EntityMain[]> {
    const response: EntityMain[] = await this.find(connection, AdapterConfigure.DATABASE, AdapterConfigure.SCHEMA, AdapterConfigure.ENTITY, { originalLink });
    return response;
  }

  public async findByCode(connection: MongoClient, code: string): Promise<EntityMain[]> {
    const response: EntityMain[] = await this.find(connection, AdapterConfigure.DATABASE, AdapterConfigure.SCHEMA, AdapterConfigure.ENTITY, { code });
    return response;
  }

  public async saveOne(connection: MongoClient, session: ClientSession, params: EntityMain): Promise<void> {
    await this.save(connection, session, AdapterConfigure.DATABASE, AdapterConfigure.SCHEMA, AdapterConfigure.ENTITY, [params]);
  }

  public async updateOne(connection: MongoClient, session: ClientSession, params: EntityMain): Promise<void> {
    const _id = params._id;
    await this.update(
      connection,
      session,
      AdapterConfigure.DATABASE,
      AdapterConfigure.SCHEMA,
      AdapterConfigure.ENTITY,
      { _id },
      {
        shortLink: params.originalLink,
        actualizar: params.actualizar,
      },
    );
  }
}
