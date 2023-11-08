import { NotificationType, State } from "../enum";

export interface Sender {
    _id?: string;
    key?: string;
    receiver?: string;
    type?: NotificationType;
    data?: any;
    state?: State;
    attachments?: Attachement[]
}

export interface Attachement {
    content?: string;
    contentType?: string;
    name?: string;
}

