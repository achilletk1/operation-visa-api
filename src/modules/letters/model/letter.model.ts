export interface Letter {
    _id?: any;
    label?: string;
    dates?: {
        created?: number;
        updated?: number;
    };
    pdf: {
        en?: {
            letterRef?: string;
            headLeftText?: string;
            headRightText?: string;
            introductionText?: string;
            salutationText?: string;
            objectText?: string;
            bodyText?: string;
            conclusionText?: string;
            footerText?: string;
            signatureText?: string;
        },
        fr?: {
            letterRef?: string;
            headLeftText?: string;
            headRightText?: string;
            introductionText?: string;
            salutationText?: string;
            objectText?: string;
            bodyText?: string;
            conclusionText?: string;
            footerText?: string;
            signatureText?: string;
        },
        signature?: string;
    };
    emailText?: {
        fr?: string;
        en?: string;
    };
    period?: number;
}
