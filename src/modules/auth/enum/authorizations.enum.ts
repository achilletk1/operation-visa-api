// authorizations by functionalities

// READ
export enum UsersMenuAuthorizationsRead {
    USERS_MENU_VIEW = 'USERS_MENU_VIEW',
}
// READ
export enum FrontUsersAuthorizationsRead {
    FRONT_USERS_LIST_VIEW = 'FRONT_USERS_LIST_VIEW', FRONT_USERS_BTN_FILTER = 'FRONT_USERS_BTN_FILTER',
    FRONT_USERS_BTN_RESET = 'FRONT_USERS_BTN_RESET', FRONT_USERS_FILTER_STATUS = 'FRONT_USERS_FILTER_STATUS', FRONT_USERS_DETAIL = 'FRONT_USERS_DETAIL',
}
// WRITE
export enum FrontUsersAuthorizationsWrite {
    FRONT_USERS_ADD_USER = 'FRONT_USERS_ADD_USER', FRONT_USERS_EDIT = 'FRONT_USERS_EDIT',
}

// READ
export enum BackUsersAuthorizationsRead {
    BACK_USERS_LIST_VIEW = 'BACK_USERS_LIST_VIEW', BACK_USERS_BTN_FILTER = 'BACK_USERS_BTN_FILTER',
    BACK_USERS_BTN_RESET = 'BACK_USERS_BTN_RESET', BACK_USERS_FILTER_STATUS = 'BACK_USERS_FILTER_STATUS',
    BACK_USERS_LIST_DETAIL = 'BACK_USERS_LIST_DETAIL', BACK_USERS_EXPORT = 'BACK_USERS_EXPORT',
    FILTER_BY_STATUS = 'FILTER_BY_STATUS', BACK_USERS_FILTER_CATEGORY = 'BACK_USERS_FILTER_CATEGORY',
    BACK_USERS_FILTER_USER_CODE = 'BACK_USERS_FILTER_USER_CODE',
}
// WRITE
export enum BackUsersAuthorizationsWrite {
    BACK_USERS_CREATE = 'BACK_USERS_CREATE', BACK_USERS_EDITION = 'BACK_USERS_EDITION',
    BACK_USERS_ADD_USER = 'BACK_USERS_ADD_USER',
}

//READ
export enum UsersInDemeureAndBlockMenuAuthorizationsRead {
    USERS_IN_DEMEURE_AND_BLOCK_MENU_VIEW = 'USERS_IN_DEMEURE_AND_BLOCK_MENU_VIEW',
    USERS_IN_DEMEURE_LIST_VIEW = 'USERS_IN_DEMEURE_LIST_VIEW',
    USERS_TO_BLOCK_LIST_VIEW = 'USERS_TO_BLOCK_LIST_VIEW',
}

//READ
export enum UsersInDemeureAndToBlockAuthorizationsRead {
    USERS_IN_DEMEURE_AND_BLOCK_BTN_FILTER = 'USERS_IN_DEMEURE_AND_BLOCK_BTN_FILTER',
    USERS_IN_DEMEMURE_AND_BLOCK_BTN_RESET = 'USERS_IN_DEMEMURE_AND_BLOCK_BTN_RESET', USERS_IN_DEMEMURE_AND_BLOCK_DOWNLOAD = 'USERS_IN_DEMEMURE_AND_BLOCK_DOWNLOAD',
    USERS_IN_DEMEMURE_AND_BLOCK_DETAIL = 'USERS_IN_DEMEMURE_AND_BLOCK_DETAIL', USERS_IN_DEMEMURE_AND_BLOCK_NAME_FILTER = 'USERS_IN_DEMEMURE_AND_BLOCK_NAME_FILTER',
    USERS_IN_DEMEMURE_AND_BLOCK_CLIENTCODE_FILTER = 'USERS_IN_DEMEMURE_AND_BLOCK_CLIENTCODE_FILTER',
}

// READ
export enum TravelsMenuAuthorizationsRead {
    TRAVEL_MENU_VIEW = 'TRAVEL_MENU_VIEW',
}
// READ
export enum TravelsDeclarationAuthorizationsRead {
    PROOF_TRAVEL_IMPORT = 'PROOF_TRAVEL_IMPORT', PROOF_TRAVEL_DECLARATION_VIEW = 'PROOF_TRAVEL_DECLARATION_VIEW',
    TRAVEL_MENU_VIEW = 'TRAVEL_MENU_VIEW',
}
// WRITE
export enum TravelsAuthorizationsWrite {
    PROOF_TRAVEL_DECLARATION = 'PROOF_TRAVEL_DECLARATION', PROOF_TRAVEL_EDIT = 'PROOF_TRAVEL_EDIT', UPLOAD_JUSTIFICATIONS = 'UPLOAD_JUSTIFICATIONS',
    SAVE_EDITION = 'SAVE_EDITION', BTN_VALIDATE = 'BTN_VALIDATE', OPERATION_LIST_EXPORT = 'OPERATION_LIST_EXPORT',
    NOTIFICATIONS_LIST_EXPORT = 'NOTIFICATIONS_LIST_EXPORT', VALIDATIONS_LIST_EXPORT = 'VALIDATIONS_LIST_EXPORT',
}

// READ
export enum ShortTravelAuthorizationsRead {
    SHORT_TRAVEL_LIST_VIEW = 'SHORT_TRAVEL_LIST_VIEW', SHORT_TRAVEL_EXPORT = 'SHORT_TRAVEL_EXPORT',
    SHORT_TRAVEL_BTN_FILTER = 'SHORT_TRAVEL_BTN_FILTER', SHORT_TRAVEL_BTN_RESET = 'SHORT_TRAVEL_BTN_RESET',
    SHORT_TRAVEL_FILTER_DATES = 'SHORT_TRAVEL_FILTER_DATES', SHORT_TRAVEL_FILTER_NAME = 'SHORT_TRAVEL_FILTER_NAME',
    SHORT_TRAVEL_FILTER_CLIENT_CODE = 'SHORT_TRAVEL_FILTER_CLIENT_CODE', SHORT_TRAVEL_FILTER_STATUS = 'SHORT_TRAVEL_FILTER_STATUS',
    SHORT_TRAVEL_FILTER_AGE = 'SHORT_TRAVEL_FILTER_AGE', SHORT_TRAVEL_FILTER_CLIENT_TYPE = 'SHORT_TRAVEL_FILTER_CLIENT_TYPE',
    SHORT_TRAVEL_OTHER_BTN = 'SHORT_TRAVEL_OTHER_BTN', SHORT_TRAVEL_LIST_DETAIL = 'SHORT_TRAVEL_LIST_DETAIL',
    SHORT_TRAVEL_JUSTIFICATIONS = 'SHORT_TRAVEL_JUSTIFICATIONS', SHORT_TRAVEL_OPERATIONS_LIST = 'SHORT_TRAVEL_OPERATIONS_LIST',
    SHORT_TRAVEL_NOTIFICATIONS_LIST = 'SHORT_TRAVEL_NOTIFICATIONS_LIST', SHORT_TRAVEL_VALIDATIONS_HISTORY = 'SHORT_TRAVEL_VALIDATIONS_HISTORY',
    SHORT_TRAVEL_EDITOR_HISTORY = 'SHORT_TRAVEL_EDITOR_HISTORY', SHORT_TRAVEL_EXPORT_FOLDER = 'SHORT_TRAVEL_EXPORT_FOLDER',
}
// WRITE
export enum ShortTravelAuthorizationsWrite {
    SHORT_TRAVEL_PROOF_TRAVEL = 'SHORT_TRAVEL_PROOF_TRAVEL', SHORT_TRAVEL_EDITION_MODE = 'SHORT_TRAVEL_EDITION_MODE',
}

// READ
export enum LongTravelAuthorizationsRead {
    LONG_TRAVEL_LIST_VIEW = 'LONG_TRAVEL_LIST_VIEW', LONG_TRAVEL_EXPORT = 'LONG_TRAVEL_EXPORT',
    LONG_TRAVEL_BTN_FILTER = 'LONG_TRAVEL_BTN_FILTER', LONG_TRAVEL_BTN_RESET = 'LONG_TRAVEL_BTN_RESET',
    LONG_TRAVEL_FILTER_DATES = 'LONG_TRAVEL_FILTER_DATES', LONG_TRAVEL_FILTER_NAME = 'LONG_TRAVEL_FILTER_NAME',
    LONG_TRAVEL_FILTER_CLIENT_CODE = 'LONG_TRAVEL_FILTER_CLIENT_CODE', LONG_TRAVEL_FILTER_STATUS = 'LONG_TRAVEL_FILTER_STATUS',
    LONG_TRAVEL_FILTER_AGE = 'LONG_TRAVEL_FILTER_AGE', LONG_TRAVEL_FILTER_CLIENT_TYPE = 'LONG_TRAVEL_FILTER_CLIENT_TYPE',

    LONG_TRAVEL_OTHER_BTN = 'LONG_TRAVEL_OTHER_BTN', LONG_TRAVEL_LIST_DETAIL = 'LONG_TRAVEL_LIST_DETAIL',
    LONG_TRAVEL_JUSTIFICATIONS = 'LONG_TRAVEL_JUSTIFICATIONS', LONG_TRAVEL_MONTH_EXCEED_LIST = 'LONG_TRAVEL_MONTH_EXCEED_LIST',
    LONG_TRAVEL_NOTIFICATIONS_LIST = 'LONG_TRAVEL_NOTIFICATIONS_LIST', LONG_TRAVEL_VALIDATIONS_HISTORY = 'LONG_TRAVEL_VALIDATIONS_HISTORY',
    LONG_TRAVEL_EDITOR_HISTORY = 'LONG_TRAVEL_EDITOR_HISTORY',
}
// WRITE
export enum LongTravelAuthorizationsWrite {
    LONG_TRAVEL_PROOF_TRAVEL = 'LONG_TRAVEL_PROOF_TRAVEL', LONG_TRAVEL_EDITION_MODE = 'LONG_TRAVEL_EDITION_MODE',
}

// READ
export enum OnlinePaymentsMenuAuthorizationsRead {
    ONLINE_PAYMENT_MENU_VIEW = 'ONLINE_PAYMENT_MENU_VIEW',
}
export enum OnlinePaymentsDeclarationAuthorizationsRead {
    ONLINE_PAYMENT_DECLARATION_VIEW = 'ONLINE_PAYMENT_DECLARATION_VIEW',
}
// READ
export enum OnlinePaymentsAuthorizationsRead {
    ONLINE_PAYMENT_LIST_VIEW = 'ONLINE_PAYMENT_LIST_VIEW', ONLINE_PAYMENT_IMPORT = 'ONLINE_PAYMENT_IMPORT',
    ONLINE_PAYMENT_EXPORT = 'ONLINE_PAYMENT_EXPORT', ONLINE_PAYMENT_OPERATIONS_EXPORT = 'ONLINE_PAYMENT_OPERATIONS_EXPORT',
    ONLINE_PAYMENT_BTN_FILTER = 'ONLINE_PAYMENT_BTN_FILTER', ONLINE_PAYMENT_BTN_RESET = 'ONLINE_PAYMENT_BTN_RESET',
    ONLINE_PAYMENT_FILTER_NAME = 'ONLINE_PAYMENT_FILTER_NAME', ONLINE_PAYMENT_FILTER_CLIENT_CODE = 'ONLINE_PAYMENT_FILTER_CLIENT_CODE',
    ONLINE_PAYMENT_FILTER_STATUS = 'ONLINE_PAYMENT_FILTER_STATUS', ONLINE_PAYMENT_FILTER_AGE = 'ONLINE_PAYMENT_FILTER_AGE',
    ONLINE_PAYMENT_FILTER_DATES = 'ONLINE_PAYMENT_FILTER_DATES', ONLINE_PAYMENT_FILTER_CLIENT_TYPE = 'ONLINE_PAYMENT_FILTER_CLIENT_TYPE',

    ONLINE_PAYMENT_OTHER_BTN = 'ONLINE_PAYMENT_OTHER_BTN', ONLINE_PAYMENT_LIST_DETAIL = 'ONLINE_PAYMENT_LIST_DETAIL',
    ONLINE_PAYMENT_JUSTIFICATIONS = 'ONLINE_PAYMENT_JUSTIFICATIONS', ONLINE_PAYMENT_OPERATIONS_LIST = 'ONLINE_PAYMENT_OPERATIONS_LIST',
    ONLINE_PAYMENT_NOTIFICATIONS_LIST = 'ONLINE_PAYMENT_NOTIFICATIONS_LIST', ONLINE_PAYMENT_VALIDATIONS_HISTORY = 'ONLINE_PAYMENT_VALIDATIONS_HISTORY',
    ONLINE_PAYMENT_EDITIONS_HISTORY = 'ONLINE_PAYMENT_EDITIONS_HISTORY',
}
// WRITE
export enum OnlinePaymentsAuthorizationsWrite {
    ONLINE_PAYMENT_DECLARATION = 'ONLINE_PAYMENT_DECLARATION', ONLINE_PAYMENT_NEW_DECLARATION = 'ONLINE_PAYMENT_NEW_DECLARATION',
    ONLINE_PAYMENT_VALIDATE = 'ONLINE_PAYMENT_VALIDATE', ONLINE_PAYMENT_EDITION_MODE = 'ONLINE_PAYMENT_EDITION_MODE',
}
// READ
export enum CeilingIncreaseAuthorizationsRead {
    CEILING_LIST_VIEW = 'CEILING_LIST_VIEW',  CEILING_LIST_DETAIL = 'CEILING_LIST_DETAIL',
    CEILING_BTN_FILTER = 'CEILING_BTN_FILTER', CEILING_FILTER_DATES = 'CEILING_FILTER_DATES',
    CEILING_FILTER_CLIENT_CODE = 'CEILING_FILTER_CLIENT_CODE', CEILING_FILTER_ACCOUNT = 'CEILING_FILTER_ACCOUNT',
    CEILING_FILTER_NAME = 'CEILING_FILTER_NAME',
}
// WRITE
export enum CeilingIncreaseAuthorizationsWrite {
    CEILING_IN_PROGRESS = 'CEILING_IN_PROGRESS', CEILING_VALIDATE = 'CEILING_VALIDATE',
    CEILING_REJECT = 'CEILING_REJECT', CEILING_REQUEST = 'CEILING_REQUEST',
    CEILING_OTHERS_BTN = 'CEILING_OTHERS_BTN', CEILING_EDITION = 'CEILING_EDITION',
}

// READ
export enum ImportationsAuthorizationsRead {
    IMPORTATIONS_LIST_VIEW = 'IMPORTATIONS_LIST_VIEW', IMPORTATIONS_LIST_DETAIL = 'IMPORTATIONS_LIST_DETAIL',
    IMPORTATIONS_BTN_FILTER = 'IMPORTATIONS_BTN_FILTER', IMPORTATIONS_BTN_RESET = 'IMPORTATIONS_BTN_RESET',
    IMPORTATIONS_FILTER_TYPE = 'IMPORTATIONS_FILTER_TYPE', IMPORTATIONS_FILTER_CLIENT_CODE = 'IMPORTATIONS_FILTER_CLIENT_CODE',
    IMPORTATIONS_FILTER_STATUS = 'IMPORTATIONS_FILTER_STATUS', IMPORTATIONS_FILTER_AGE = 'IMPORTATIONS_FILTER_AGE',
    IMPORTATIONS_FILTER_DATES = 'IMPORTATIONS_FILTER_DATES', IMPORTATIONS_FILTER_CLIENT_TYPE = 'IMPORTATIONS_FILTER_CLIENT_TYPE',
}
// WRITE
export enum ImportationsAuthorizationsWrite {
    IMPORTATIONS_EDITION = 'IMPORTATIONS_EDITION',
}

export enum ReportingAuthorizationsRead {
    // READ
    REPORT_VIEW = 'REPORT_VIEW', REPORT_CONSOLIDATE = 'REPORT_CONSOLIDATE', REPORT_AVERAGE_TIME = 'REPORT_AVERAGE_TIME',
    REPORT_STATUS_OPERATIONS = 'REPORT_STATUS_OPERATIONS', REPORT_LINE_CHART = 'REPORT_LINE_CHART',
    REPORT_BTN_RESET = 'REPORT_BTN_RESET', REPORT_BTN_FILTER = 'REPORT_BTN_FILTER',
    REPORT_FILTER_DATES = 'REPORT_FILTER_DATES', REPORT_FILTER_TYPE = 'REPORT_FILTER_TYPE',
    REPORT_FILTER_AGE = 'REPORT_FILTER_AGE', REPORT_FILTER_REGION = 'REPORT_FILTER_REGION',
}

// READ
export enum FileImportAuthorizationsRead {
    FILE_IMPORT_LIST_VIEW = 'FILE_IMPORT_LIST_VIEW', FILE_IMPORT_LIST_DETAIL = 'FILE_IMPORT_LIST_DETAIL',
    FILE_IMPORT_BTN_FILTER = 'FILE_IMPORT_BTN_FILTER', FILE_IMPORT_BTN_RESET = 'FILE_IMPORT_BTN_RESET',
    FILE_IMPORT_FILTER_NAME = 'FILE_IMPORT_FILTER_NAME', FILE_IMPORT_EXPORT = 'FILE_IMPORT_EXPORT',
}
// WRITE
export enum FileImportAuthorizationsWrite {
    FILE_IMPORT_IMPORT = 'FILE_IMPORT_IMPORT',
}

// READ
export enum FormalNoticeAuthorizationsRead {
    FORMAL_NOTICE_LIST_VIEW = 'FORMAL_NOTICE_LIST_VIEW', FORMAL_NOTICE_LIST_DETAIL = 'FORMAL_NOTICE_LIST_DETAIL', FORMAL_NOTICE_EXPORT = 'FORMAL_NOTICE_EXPORT',
    FORMAL_NOTICE_BTN_FILTER = 'FORMAL_NOTICE_BTN_FILTER', FORMAL_NOTICE_FILTER_DATES = 'FORMAL_NOTICE_FILTER_DATES', FORMAL_NOTICE_FILTER_TYPE = 'FORMAL_NOTICE_FILTER_TYPE',
    FORMAL_NOTICE_FILTER_STATUS = 'FORMAL_NOTICE_FILTER_STATUS',
}
// WRITE
export enum FormalNoticeAuthorizationsWrite {
}

// READ
export enum InstantNotificationAuthorizationsRead {
    INSTANT_NOTIFICATION_VIEW = 'INSTANT_NOTIFICATION_VIEW',
}
// WRITE
export enum InstantNotificationAuthorizationsWrite {
    FIND_INSTANT_NOTIFICATION = 'FIND_INSTANT_NOTIFICATION',
}

// READ
export enum SettingsMenuAuthorizationsRead {
    SETTING_MENU_VIEW = 'SETTING_MENU_VIEW',
}
// READ
export enum NotificationListAuthorizationsRead {
    NOTIFICATION_LIST_VIEW = 'NOTIFICATION_LIST_VIEW', NOTIFICATION_EXPORT = 'NOTIFICATION_EXPORT', NOTIFICATION_BTN_FILTER = 'NOTIFICATION_BTN_FILTER',
    NOTIFICATION_FILTER_DATES = 'NOTIFICATION_FILTER_DATES', NOTIFICATION_FILTER_TYPE = 'NOTIFICATION_FILTER_TYPE',
    NOTIFICATION_FILTER_STATUS = 'NOTIFICATION_FILTER_STATUS', NOTIFICATION_WHATSAPP_DETAIL = 'NOTIFICATION_WHATSAPP_DETAIL',
    NOTIFICATION_SMS_DETAIL = 'NOTIFICATION_SMS_DETAIL', NOTIFICATION_MAIL_DETAIL = 'NOTIFICATION_MAIL_DETAIL',
}
// WRITE
export enum NotificationListAuthorizationsWrite {
}

// READ
export enum SensitiveNotificationListMenuAuthorizationsRead {
    SENSITIVE_NOTIFICATION_MENU_VIEW = 'SENSITIVE_NOTIFICATION_MENU_VIEW'
}

// READ
export enum SensitiveNotificationListAuthorizationsRead {
    SENSITIVE_NOTIFICATION_LIST_VIEW = 'SENSITIVE_NOTIFICATION_LIST_VIEW', SENSITIVE_NOTIFICATION_BTN_FILTER = 'SENSITIVE_NOTIFICATION_BTN_FILTER',
    SENSITIVE_NOTIFICATION_FILTER_DATES = 'SENSITIVE_NOTIFICATION_FILTER_DATES', SENSITIVE_NOTIFICATION_MAIL_DETAIL = 'SENSITIVE_NOTIFICATION_MAIL_DETAIL',
}
// WRITE
export enum SensitiveNotificationListAuthorizationsWrite {
    SENSITIVE_NOTIFICATION_VALIDATE = 'SENSITIVE_NOTIFICATION_VALIDATE',
}

// READ
export enum GeneralsSettingAuthorizationsRead {
    GENERAL_SETTING_LIST_VIEW = 'GENERAL_SETTING_LIST_VIEW', GENERAL_SETTING_LIST_DETAIL = 'GENERAL_SETTING_LIST_DETAIL',
    GENERAL_SETTING_BTN_FILTER = 'GENERAL_SETTING_BTN_FILTER', GENERAL_SETTING_BTN_RESET = 'GENERAL_SETTING_BTN_RESET',
    GENERAL_SETTING_FILTER_NAME = 'GENERAL_SETTING_FILTER_NAME',
}
// WRITE
export enum GeneralsSettingAuthorizationsWrite {
    GENERAL_SETTING_EDITION = 'GENERAL_SETTING_EDITION',
}

// READ
export enum VouchersSettingAuthorizationsRead {
    VOUCHERS_SETTING_LIST_VIEW = 'VOUCHERS_SETTING_LIST_VIEW', VOUCHERS_SETTING_LIST_DETAIL = 'VOUCHERS_SETTING_LIST_DETAIL',
}
// WRITE
export enum VouchersSettingAuthorizationsWrite {
    VOUCHERS_SETTING_BTN_NEW = 'VOUCHERS_SETTING_BTN_NEW', VOUCHERS_SETTING_EDITION = 'VOUCHERS_SETTING_EDITION'
}

// READ
export enum TemplateSettingAuthorizationsRead {
    TEMPLATE_SETTING_LIST_VIEW = 'TEMPLATE_SETTING_LIST_VIEW', TEMPLATE_SETTING_LIST_DETAIL = 'TEMPLATE_SETTING_LIST_DETAIL',
    TEMPLATE_SETTING_BTN_FILTER = 'TEMPLATE_SETTING_BTN_FILTER', TEMPLATE_SETTING_BTN_RESET = 'TEMPLATE_SETTING_BTN_RESET',
    TEMPLATE_SETTING_FILTER_NAME = 'TEMPLATE_SETTING_FILTER_NAME', TEMPLATE_SETTING_VARIABLES_LIST = 'TEMPLATE_SETTING_VARIABLES_LIST',
}
// WRITE
export enum TemplateSettingAuthorizationsWrite {
    TEMPLATE_SETTING_EDITION = 'TEMPLATE_SETTING_EDITION', TEMPLATE_SETTING_ENABLE_BTN = 'TEMPLATE_SETTING_ENABLE_BTN'
}

// READ
export enum FormalNoticeSettingAuthorizationsRead {
    FORMAL_NOTICE_SETTING_LIST_VIEW = 'FORMAL_NOTICE_SETTING_LIST_VIEW', FORMAL_NOTICE_SETTING_VARIABLES_LIST = 'FORMAL_NOTICE_SETTING_VARIABLES_LIST',
    FORMAL_NOTICE_SETTING_PREVIEW = 'FORMAL_NOTICE_SETTING_PREVIEW',
}
// WRITE
export enum FormalNoticeSettingAuthorizationsWrite {
    FORMAL_NOTICE_SETTING_IMPORT = 'FORMAL_NOTICE_SETTING_IMPORT', FORMAL_NOTICE_SETTING_EDITION = 'FORMAL_NOTICE_SETTING_EDITION',
}

// READ
export enum CartTypeSettingAuthorizationsRead {
    CART_SETTING_LIST_VIEW = 'CART_SETTING_LIST_VIEW', CART_SETTING_LIST_DETAIL = 'CART_SETTING_LIST_DETAIL',
}
// WRITE
export enum CartTypeSettingAuthorizationsWrite {
    CART_SETTING_BTN_NEW = 'CART_SETTING_BTN_NEW', CART_SETTING_EDITION = 'CART_SETTING_EDITION', CART_SETTING_ENABLE_BTN = 'CART_SETTING_ENABLE_BTN'
}

// READ
export enum LongTravelTypeSettingAuthorizationsRead {
    TRAVEL_TYPE_SETTING_LIST_VIEW = 'TRAVEL_TYPE_SETTING_LIST_VIEW', TRAVEL_TYPE_SETTING_LIST_DETAIL = 'TRAVEL_TYPE_SETTING_LIST_DETAIL',
}
// WRITE
export enum LongTravelTypeSettingAuthorizationsWrite {
    TRAVEL_TYPE_SETTING_EDITION = 'TRAVEL_TYPE_SETTING_EDITION', TRAVEL_TYPE_SETTING_BTN_NEW = 'TRAVEL_TYPE_SETTING_BTN_NEW'
}

// READ
export enum OnlinePaymentTypeSettingAuthorizationsRead {
    ONLINE_PAYMENT_TYPE_SETTING_LIST_VIEW = 'ONLINE_PAYMENT_TYPE_SETTING_LIST_VIEW', ONLINE_PAYMENT_TYPE_SETTING_LIST_DETAIL = 'ONLINE_PAYMENT_TYPE_SETTING_LIST_DETAIL',
    ONLINE_PAYMENT_TYPE_SETTING_EXPORT = 'ONLINE_PAYMENT_TYPE_SETTING_EXPORT',
}
// WRITE
export enum OnlinePaymentTypeSettingAuthorizationsWrite {
    ONLINE_PAYMENT_TYPE_SETTING_BTN_NEW = 'ONLINE_PAYMENT_TYPE_SETTING_BTN_NEW', ONLINE_PAYMENT_TYPE_SETTING_EDITION = 'ONLINE_PAYMENT_TYPE_SETTING_EDITION'
}

// READ
export enum CeilingSettingAuthorizationsRead {
    CEILING_SETTING_LIST_VIEW = 'CEILING_SETTING_LIST_VIEW', CEILING_SETTING_LIST_DETAIL = 'CEILING_SETTING_LIST_DETAIL',
}
// WRITE
export enum CeilingSettingAuthorizationsWrite {
    CEILING_SETTING_EDITION = 'CEILING_SETTING_EDITION'
}

// READ
export enum ValidationLevelSettingAuthorizationsRead {
    VALIDATION_LEVEL_SETTING_LIST_VIEW = 'VALIDATION_LEVEL_SETTING_LIST_VIEW', VALIDATION_LEVEL_SETTING_LIST_DETAIL = 'VALIDATION_LEVEL_SETTING_LIST_DETAIL',
}
// WRITE
export enum ValidationLevelSettingAuthorizationsWrite {
    VALIDATION_LEVEL_SETTING_BTN_NEW = 'VALIDATION_LEVEL_SETTING_BTN_NEW', VALIDATION_LEVEL_SETTING_EDITION = 'VALIDATION_LEVEL_SETTING_EDITION'
}

// READ
export enum TransactionTypeSettingAuthorizationsRead {
    TRANS_TYPE_SETTING_LIST_VIEW = 'TRANS_TYPE_SETTING_LIST_VIEW', TRANS_TYPE_SETTING_LIST_DETAIL = 'TRANS_TYPE_SETTING_LIST_DETAIL',
}
// WRITE
export enum TransactionTypeSettingAuthorizationsWrite {
    TRANS_TYPE_SETTING_BTN_NEW = 'TRANS_TYPE_SETTING_BTN_NEW', TRANS_TYPE_SETTING_EDITION = 'TRANS_TYPE_SETTING_EDITION',
    TRANS_TYPE_SETTING_BTN_DELETE = 'TRANS_TYPE_SETTING_BTN_DELETE'
}


// READ
export enum OperationsMenuAuthorizationsRead {
    OPERATIONS_MENU_VIEW = 'OPERATIONS_MENU_VIEW', OPERATIONS_DECLARATION_VIEW='OPERATIONS_DECLARATION_VIEW', OPERATIONS_LIST_VIEW='OPERATIONS_LIST_VIEW'
}
// READ
export enum OperationsAuthorizationsRead {
    OPERATIONS_LIST_VIEW = 'OPERATIONS_LIST_VIEW', OPERATION_BTN_RESET = 'OPERATION_BTN_RESET', OPERATION_EXPORT = 'OPERATION_EXPORT', OPERATION_BTN_FILTER = 'OPERATION_BTN_FILTER',
    OPERATION_FILTER_TYPES='OPERATION_FILTER_TYPES',  OPERATION_FILTER_OBJECT='OPERATION_FILTER_OBJECT',   OPERATION_FILTER_TRANSFER_STAKEHOLDER=' OPERATION_FILTER_TRANSFER_STAKEHOLDER',  OPERATION_FILTER_NAME='OPERATION_FILTER_NAME',
    OPERATION_FILTER_CLIENTCODE='OPERATION_FILTER_CLIENTCODE',  OPERATION_FILTER_DATES='OPERATION_FILTER_DATES',
}
// WRITE
export enum OperationsAuthorizationsWrite {
    OPERATION_ATTACH_IMPORT = 'OPERATION_ATTACH_IMPORT', OPERATION_DECLARATION = 'OPERATION_DECLARATION',
    OPERATION_NEW_DECLARATION = 'OPERATION_NEW_DECLARATION'
}

// READ
export enum TransferStakeholdersMenuAuthorizationsRead {
    TRANSFER_STAKEHOLDER_MENU_VIEW = 'TRANSFER_STAKEHOLDER_MENU_VIEW'
}
// READ
export enum TransferStakeholdersAuthorizationsRead {
    TRANSFER_STAKEHOLDER_LIST_VIEW = 'TRANSFER_STAKEHOLDER_LIST_VIEW', TRANSFER_STAKEHOLDER_BTN_RESET = 'TRANSFER_STAKEHOLDER_BTN_RESET',
    OPERATION_FILTER_TYPES='OPERATION_FILTER_TYPES', 
}
// WRITE
export enum TransferStakeholdersAuthorizationsWrite {
    TRANSFER_STAKEHOLDER_DECLARATION = 'TRANSFER_STAKEHOLDER_DECLARATION', TRANSFER_STAKEHOLDER_BTN_EDITION = 'TRANSFER_STAKEHOLDER_BTN_EDITION',
    TRANSFER_STAKEHOLDER_NEW_DECLARATION = 'TRANSFER_STAKEHOLDER_NEW_DECLARATION', TRANSFER_STAKEHOLDER_ATTACH_IMPORT='TRANSFER_STAKEHOLDER_ATTACH_IMPORT'
}

export enum ShareAuthorizationsRead {
    SIGN_BUTTON = 'SIGN_BUTTON', SIDE_BAR = 'SIDE_BAR'
}

// READ
export enum DCHAuthorizationsRead {
    PERSONNEL_DATA_VIEW = 'PERSONNEL_DATA_VIEW'
}
// WRITE
export enum DCHAuthorizationsWrite {
    PERSONNEL_DATA_WRITE = 'PERSONNEL_DATA_WRITE'
}

// READ
export enum ManagementCommitteeAuthorizationsRead {
    MANAGEMENT_COMMITTEE_DATA_VIEW = 'MANAGEMENT_COMMITTEE_DATA_VIEW'
}
// WRITE
export enum ManagementCommitteeAuthorizationsWrite {
    MANAGEMENT_COMMITTEE_DATA_WRITE = 'MANAGEMENT_COMMITTEE_DATA_WRITE'
}

// READ
export enum HeadOfRegionPermissionRead {
    HEAD_OF_REGION_DATA_VIEW = 'HEAD_OF_REGION_DATA_VIEW'
}
// WRITE
export enum HeadOfRegionPermissionWrite {
    HEAD_OF_REGION_DATA_WRITE = 'HEAD_OF_REGION_DATA_WRITE'
}

// READ
export enum HeadOfPersonnelAgencyPermissionRead {
    HEAD_OF_PERSONNEL_AGENCY_VIEW = 'HEAD_OF_PERSONNEL_AGENCY_VIEW'
}
// WRITE
export enum HeadOfPersonnelAgencyPermissionWrite {
    HEAD_OF_PERSONNEL_AGENCY_WRITE = 'HEAD_OF_PERSONNEL_AGENCY_WRITE'
}

// READ
export enum PersonnelManagerPermissionRead {
    PERSONNEL_MANAGER_DATA_VIEW = 'PERSONNEL_MANAGER_DATA_VIEW'
}
// WRITE
export enum PersonnelManagerPermissionWrite {
    PERSONNEL_MANAGER_DATA_WRITE = 'PERSONNEL_MANAGER_DATA_WRITE'
}



// controller
// auditor
// account manager (includes DCH profile)
// agency head
// SCRC department head
// SCRC study manager
// Support
// Administrator
// Super Admin

