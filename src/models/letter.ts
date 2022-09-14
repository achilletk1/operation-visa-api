export interface Letter {
    _id?: any;
    label?: string;
    dates?: {
        created?: number;
        updated?: number;
    },
    letterRef?: string;
    pdf?: {
        headLeftText?: string;
        headRightText?: string;
        introductionTexT?: string;
        salutationText?: string;
        objectText?: string;
        bodyText?: string;
        conclusionText?: string;
        footerText?: string;
        signatureText?: string;
        signature?: string;
    }
    emailText?: string;
}