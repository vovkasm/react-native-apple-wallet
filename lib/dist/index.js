"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
function canAddPaymentPass() {
    return native().canAddPaymentPass();
}
exports.canAddPaymentPass = canAddPaymentPass;
function startAddPaymentPass(request) {
    return native().startAddPaymentPass(request);
}
exports.startAddPaymentPass = startAddPaymentPass;
function completeAddPaymentPass(payload) {
    return native().completeAddPaymentPass(payload);
}
exports.completeAddPaymentPass = completeAddPaymentPass;
function native() {
    if (!react_native_1.NativeModules.RNAWManager) {
        throw new Error('No native module. Do you forgot to link react-native-apple-wallet?');
    }
    return react_native_1.NativeModules.RNAWManager;
}
