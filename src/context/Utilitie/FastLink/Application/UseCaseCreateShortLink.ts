import { ObjectId } from 'mongodb';
import shortid from 'shortid';
import type { EntityLogDocument } from '../../../shared/Domain/EntityLogDocument';
import type { EntityMain } from '../Domain/EntityMain';
import type { IRequestServiceCreateShortLink, IResponseServiceCreateShortLink } from '../Domain/IServiceCreateShortLink';
import type { RepositoryMain } from '../Domain/RepositoryMain';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';
import { AdapterReCaptcha } from '../../../shared/Infraestructure/AdapterRecaptcha';

export class UseCaseCreateShortLink<C, S> {
  private repository: RepositoryMain<C, S>;

  constructor(repository: RepositoryMain<C, S>) {
    this.repository = repository;
  }

  public async exec(params: IRequestServiceCreateShortLink, log: EntityLogDocument): Promise<IResponseServiceCreateShortLink> {
    await this.repository.validateCreateShortLink(params);
    console.log({ params });
    await AdapterReCaptcha.verifyCaptcha(params.captcha);
    const connection = await this.repository.openConnection();
    try {
      const result = await this._exec(connection, params, log);
      return result;
    } finally {
      await this.repository.closeConnection(connection);
    }
  }

  private async _exec(connection: C, params: IRequestServiceCreateShortLink, log: EntityLogDocument) {
    const session = await this.repository.openSession(connection);
    try {
      await this.repository.openTransaction(session);

      const entityByOriginalLink: EntityMain[] = await this.repository.findByOriginalLink(connection, params.originalLink);
      if (entityByOriginalLink.length > 0)
        return {
          shortLink: `${AdapterConfigure.URLSHORTLINK}/${entityByOriginalLink[0].code}`,
          originalLink: entityByOriginalLink[0].originalLink,
        };

      const _id = await this.repository.getId();
      const code = shortid.generate();

      const document: EntityMain = {
        _id: new ObjectId(_id),
        code,
        originalLink: params.originalLink,
        registrar: log,
        actualizar: null,
        eliminar: null,
        estado: true,
      };

      await this.repository.saveOne(connection, session, document);
      await this.repository.commitTransaction(session);
      return {
        shortLink: `${AdapterConfigure.URLSHORTLINK}/${code}`,
        originalLink: params.originalLink,
      };
    } catch (error) {
      await this.repository.rollbackTransaction(session);
      throw error;
    } finally {
      await this.repository.closeSession(session);
    }
  }
}
