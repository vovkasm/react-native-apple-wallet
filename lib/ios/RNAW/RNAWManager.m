#import "RNAWManager.h"

#import <PassKit/PassKit.h>

@implementation RNAWManager

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(canAddPaymentPass, canAddPaymentPassWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL result = [PKAddPaymentPassViewController canAddPaymentPass];
    resolve(@(result));
}

@end
