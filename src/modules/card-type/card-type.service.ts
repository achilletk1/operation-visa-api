// import { RequestCeilingIncreaseRepository } from "./request-ceiling-increase.repository";
import { CardTypeController } from "./card-type.controller";
import { CrudService } from "common/base";
import { CardType } from './model/cardType.model';
import { CardTypeRepository } from "./card-type.repository";

export class CardTypeService extends CrudService<CardType> {

    static cardTypeRepository: CardTypeRepository;

    constructor() {
        CardTypeService.cardTypeRepository = new CardTypeRepository();
        super(CardTypeService.cardTypeRepository);
    }

    async getCardTypeAll(filters: any) {
        try {
            return await CardTypeController.cardTypeService.findAll(filters);
        } catch (error) { throw error; }
    }

    async getCardTypeById(filters: any) {
        try {
            const result = await CardTypeController.cardTypeService.findOne(filters);
            return result;
        } catch (error) { throw error; }
    }


    async insertCardType(cardType: CardType): Promise<any> {
        try {
            const { productCode } = cardType;
            const currCardType = await CardTypeController.cardTypeService.baseRepository.findOne({ filter: { productCode } });
            if (currCardType) { throw new Error('CardTypeAlreadyExist'); };
            return await CardTypeController.cardTypeService.create(cardType);
        } catch (error) { throw error; }
    }


    async updateById(_id: string, body: CardType) {
        try {
            return (await CardTypeController.cardTypeService.update({ _id: _id }, body))?.data?.toString();
        } catch (error) { throw error; }
    }

}