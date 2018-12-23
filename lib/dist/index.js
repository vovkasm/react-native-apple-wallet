"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
function canAddPaymentPass() {
    return native().canAddPaymentPass();
}
exports.canAddPaymentPass = canAddPaymentPass;
function native() {
    if (!react_native_1.NativeModules.RNAWManager) {
        throw new Error('No native module. Do you forgot to link react-native-apple-wallet?');
    }
    return react_native_1.NativeModules.RNAWManager;
}
