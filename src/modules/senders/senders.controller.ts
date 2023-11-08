import { SendersService } from './senders.service';

export class SendersController {

    static sendersService: SendersService;

    constructor() { SendersController.sendersService = new SendersService(); }

}
