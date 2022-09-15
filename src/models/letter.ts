export interface Letter {
    _id?: any;
    label?: string;
    dates?: {
        created?: number;
        updated?: number;
    };
    pdf?: {
        letterRef?: string;
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
    };
    emailText?: string;
}
