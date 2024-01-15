import { CardTypeService } from "./card-type.service";
import { NextFunction, Request, Response } from 'express';
import { CardType } from './model/cardType.model';

export class CardTypeController {

    static cardTypeService: CardTypeService;

    constructor() { CardTypeController.cardTypeService = new CardTypeService(); }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await CardTypeController.cardTypeService.getCardTypeAll({ filter: req.query })); }
        catch (error) { next(error); }
    }

    async findOneById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await CardTypeController.cardTypeService.getCardTypeById({ filter: { _id: req.params.id } })); }
        catch (error) { next(error); }
    }

    async insertCardType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await CardTypeController.cardTypeService.insertCardType(req.body as CardType)); }
        catch (error) { next(error); }
    }

    async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try { res.send(await CardTypeController.cardTypeService.update({ _id: req.params.id }, req.body)); }
        catch (error) { next(error); }
    }

}