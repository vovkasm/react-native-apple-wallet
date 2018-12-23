import { NativeModules } from 'react-native'

interface IAddPaymentPassRequest {
  /**
   * The encryption scheme to be used in this request
   */
  encryptionScheme: 'ECC_V2' | 'RSA_V2'
  /**
   * The name of the person as shown on the card
   */
  cardholderName: string
  /**
   * The last four or five digits of the card’s number
   */
  primaryAccountSuffix: string
  /**
   * A short description of the card
   *
   * This property provides a user-visible description that clearly identifies the card
   */
  localizedDescription?: string
  /**
   * The payment network (can be 'visa', 'mastercard', etc...)
   */
  paymentNetwork?: string
  /**
   * A primary account identifier, used to filter out pass libraries
   */
  primaryAccountIdentifier?: string
  /**
   * A Boolean value that indicates whether the payment pass requires the Felica Secure Element (since iOS 10.1)
   */
  requiresFelicaSecureElement?: boolean
}

interface IAddPaymentPassPayload {
  certificateLeaf: string
  certificateSubCA: string
  nonce: string
  nonceSignature: string
}

interface IAddPaymentPassCompletionPayload {
  activationData: string
  encryptedPassData: string
  wrappedKey: string
}

interface IRNAWManager {
  canAddPaymentPass(): Promise<boolean>
  startAddPaymentPass(request: IAddPaymentPassRequest): Promise<IAddPaymentPassPayload>
  completeAddPaymentPass(payload: IAddPaymentPassCompletionPayload): Promise<void>
}

export function canAddPaymentPass(): Promise<boolean> {
  return native().canAddPaymentPass()
}

export function startAddPaymentPass(request: IAddPaymentPassRequest): Promise<IAddPaymentPassPayload> {
  return native().startAddPaymentPass(request)
}

export function completeAddPaymentPass(payload: IAddPaymentPassCompletionPayload): Promise<void> {
  return native().completeAddPaymentPass(payload)
}

function native(): IRNAWManager {
  if (!NativeModules.RNAWManager) {
    throw new Error('No native module. Do you forgot to link react-native-apple-wallet?')
  }
  return NativeModules.RNAWManager
}
