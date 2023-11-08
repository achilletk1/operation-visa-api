import { SendersRepository } from "./senders.repository";
import { CrudService } from "common/base";
import { Sender } from "./model";

export class SendersService extends CrudService<Sender> {
    static senderRepository: SendersRepository

    constructor() {
        SendersService.senderRepository = new SendersRepository();
        super(SendersService.senderRepository);
    }
}
