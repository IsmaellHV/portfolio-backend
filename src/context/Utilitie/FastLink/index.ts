import { Bootstrapping } from '../../shared/_Bootstrapping';
import { AdapterConfigure } from './Infraestructure/AdapterConfigure';
import { Router } from './Infraestructure/Router';

export class ManagerEntity {
  private bootstrap: Bootstrapping;
  public router: Router;

  constructor() {
    this.bootstrap = new Bootstrapping('mongo', AdapterConfigure.URI, AdapterConfigure.DATABASE, AdapterConfigure.DATABASE_OBJECTS, AdapterConfigure.DATABASE_INDEXES);
    this.router = new Router();
  }

  public async exec() {
    await this.bootstrap.exec();
    await this.router.exec();
  }
}
