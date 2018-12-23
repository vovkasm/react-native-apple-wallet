import { NativeModules } from 'react-native'

interface IRNAWManager {
  canAddPaymentPass(): Promise<boolean>
}

export function canAddPaymentPass(): Promise<boolean> {
  return native().canAddPaymentPass()
}

function native(): IRNAWManager {
  if (!NativeModules.RNAWManager) {
    throw new Error('No native module. Do you forgot to link react-native-apple-wallet?')
  }
  return NativeModules.RNAWManager
}
