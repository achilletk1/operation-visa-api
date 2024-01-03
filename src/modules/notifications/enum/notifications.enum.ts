export enum NotificationsType {
    MAIL = 'mail',
    SMS = 'sms',
    PUSH = 'push',
    WHATSAPP = 'whatsapp',
}

export enum QueuePriority {
    HIGHEST = 3,
    HIGH = 2,
    LOW = 1
}

export enum NotificationFormat {
    SMS = 100,
    MAIL = 200,
    WHATSAPP = 300
}

export enum NotificationStatus {
    CREATED = 100, // Crée
    SUCCESS_SEND = 200, // Envoyer et recu
    FAIL_SEND = 300, // Echec d'envois
    READ = 400, // Lu
  }