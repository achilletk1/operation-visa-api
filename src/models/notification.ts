
export interface Notification {
  _id?:string;
  message?: string;
  object?: string;
  status?: number;  // 100 (Created), 200 (Success Sent), 300 (Unsuccess Sent), 400 (Pending Sent)
  format?: number; // 100 SMS,200 MAIL, 300 WHATSAPPS
  dates?: {
      createdAt?: number;
      sentAt?: number;
      receivedAt?:number;
      readAt?: number;
  };
  email?: string;
  isAttachement?:boolean;
  id?: string; //online payement Id // voyage Id
  telephone?: string;
}

export enum NotificationStatus {
  CREATED = 100 , //Crée
  SUCCESS_SEND = 200, // Envoyer et recu
  FAIL_SEND = 300, //Echec d'envois
  READ = 400, //Lu
}
export enum NotificationFormat {
  SMS = 100 ,
  MAIL = 200,
  //WHATSAPPS = 300
}
