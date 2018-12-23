interface IAddPaymentPassRequest {
    /**
     * The encryption scheme to be used in this request
     */
    encryptionScheme: 'ECC_V2' | 'RSA_V2';
    /**
     * The name of the person as shown on the card
     */
    cardholderName: string;
    /**
     * The last four or five digits of the card’s number
     */
    primaryAccountSuffix: string;
    /**
     * A short description of the card
     *
     * This property provides a user-visible description that clearly identifies the card
     */
    localizedDescription?: string;
    /**
     * The payment network (can be 'visa', 'mastercard', etc...)
     */
    paymentNetwork?: string;
    /**
     * A primary account identifier, used to filter out pass libraries
     */
    primaryAccountIdentifier?: string;
    /**
     * A Boolean value that indicates whether the payment pass requires the Felica Secure Element (since iOS 10.1)
     */
    requiresFelicaSecureElement?: boolean;
}
interface IAddPaymentPassPayload {
    certificateLeaf: string;
    certificateSubCA: string;
    nonce: string;
    nonceSignature: string;
}
interface IAddPaymentPassCompletionPayload {
    activationData: string;
    encryptedPassData: string;
    wrappedKey: string;
}
export declare function canAddPaymentPass(): Promise<boolean>;
export declare function startAddPaymentPass(request: IAddPaymentPassRequest): Promise<IAddPaymentPassPayload>;
export declare function completeAddPaymentPass(payload: IAddPaymentPassCompletionPayload): Promise<void>;
export {};
