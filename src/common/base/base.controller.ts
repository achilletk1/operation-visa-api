import { NextFunction, Request, Response } from 'express';
import { controllerInterface } from '../interfaces';
import { BaseRepository } from './base.repository';
import { CrudService } from './crud.service';

export class BaseController implements controllerInterface {


  constructor(protected service?: CrudService<any>, Service?: any, Repository?: any) {
    this.service = service || new Service(new Repository());
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.send(await this?.service?.create(req.body)); }
    catch (error) { next(error); }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.send(await this?.service?.findAll({ filter: req.query })); }
    catch (error) { next(error); }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.send(await this?.service?.findOne({ filter: req.query })); }
    catch (error) { next(error); }
  }

  async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.send(await this?.service?.findOne({ filter: { _id: req.query.id } })); }
    catch (error) { next(error); }
  }

  async count(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.send(await this?.service?.count(req.query)); }
    catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.send(await this?.service?.update(req.query, req.body)); }
    catch (error) { next(error); }
  }

  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.send(await this?.service?.update({ _id: req.query.id }, req.body)); }
    catch (error) { next(error); }
  }

}
