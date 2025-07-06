import { Router } from 'express';
import { readdirSync, Stats, statSync } from 'fs';
import path from 'path';

const exclude = ['shared'];

export class RouterRest {
  public router: Router;
  private managers: any[] = [];

  constructor() {
    this.router = Router();
  }

  public async exec() {
    await this.initializeEntitys();
    await this.handleRoutes();
  }

  private async initializeEntitys() {
    const filePath = path.join(...[__dirname, '..', 'context']);
    await this.getRoutes(filePath);
    for await (const manager of this.managers) {
      await manager.exec();
    }
  }

  private async getRoutes(filePath: string, level: number = 0) {
    if (level > 2) return;
    const listDirectory: string[] = readdirSync(filePath);
    for (const row of listDirectory) {
      if (!exclude.includes(row)) {
        const newFilePath: string = path.join(filePath, row);
        const stats: Stats = statSync(newFilePath);
        if (stats.isDirectory()) {
          await this.getRoutes(newFilePath, level + 1);
        } else if (stats.isFile()) {
          if (['index.js', 'index.ts'].includes(row)) {
            const { ManagerEntity } = await import(newFilePath);
            this.managers.push(new ManagerEntity());
          }
        }
      }
    }
  }

  private async handleRoutes() {
    for (const manager of this.managers) {
      try {
        if (manager.controller) {
          this.router.use(manager.controller.router);
        } else {
          this.router.use(manager.router.router);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
