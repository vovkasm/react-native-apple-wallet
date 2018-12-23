#import "RNAWManager.h"

#import <React/RCTUtils.h>

#import <PassKit/PassKit.h>

typedef void (^AddPaymentPassCompletionHandler)(PKAddPaymentPassRequest *request);

@interface RNAWManager () <PKAddPaymentPassViewControllerDelegate>

@property (nonatomic) UIViewController* addPaymentPassController;
@property (nonatomic) RCTPromiseResolveBlock resolver;
@property (nonatomic) RCTPromiseRejectBlock rejecter;
@property (nonatomic) AddPaymentPassCompletionHandler handler;

@end

@implementation RNAWManager

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(canAddPaymentPass, canAddPaymentPassWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL result = [PKAddPaymentPassViewController canAddPaymentPass];
    resolve(@(result));
}

RCT_REMAP_METHOD(startAddPaymentPass, startAddPaymentPass:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    PKEncryptionScheme encryptionScheme = nil;
    NSString* optionEncryptionScheme = options[@"encryptionScheme"];
    if (!optionEncryptionScheme) {
        reject(@"arguments", @"encryptionScheme is required", nil);
        return;
    }

    optionEncryptionScheme = [optionEncryptionScheme uppercaseString];
    if ([optionEncryptionScheme isEqualToString:@"ECC_V2"]) {
        encryptionScheme = PKEncryptionSchemeECC_V2;
    } else if ([optionEncryptionScheme isEqualToString:@"RSA_V2"]) {
        encryptionScheme = PKEncryptionSchemeRSA_V2;
    } else {
        reject(@"arguments", @"encryptionScheme should be ECC_V2 or RSA_V2", nil);
        return;
    }

    PKAddPaymentPassRequestConfiguration* configuration = [[PKAddPaymentPassRequestConfiguration alloc] initWithEncryptionScheme:encryptionScheme];

    if (options[@"cardholderName"]) {
        configuration.cardholderName = options[@"cardholderName"];
    } else {
        reject(@"arguments", @"cardholderName is required", nil);
        return;
    }
    if (options[@"primaryAccountSuffix"]) {
        configuration.primaryAccountSuffix = options[@"primaryAccountSuffix"];
    } else {
        reject(@"arguments", @"primaryAccountSuffix is required", nil);
        return;
    }
    if (options[@"localizedDescription"]) {
        configuration.localizedDescription = options[@"localizedDescription"];
    }
    if (options[@"primaryAccountIdentifier"]) {
        configuration.primaryAccountIdentifier = options[@"primaryAccountIdentifier"];
    }
    if (@available(iOS 10.1, *)) {
        if (options[@"requiresFelicaSecureElement"]) {
            configuration.requiresFelicaSecureElement = YES;
        }
    }

    NSString* paymentNetwork = options[@"paymentNetwork"];
    if (paymentNetwork) {
        paymentNetwork = [paymentNetwork uppercaseString];
        if ([paymentNetwork isEqualToString:@"VISA"]) {
            configuration.paymentNetwork = PKPaymentNetworkVisa;
        } else if ([paymentNetwork isEqualToString:@"MASTERCARD"]) {
            configuration.paymentNetwork = PKPaymentNetworkMasterCard;
        } else {
            reject(@"arguments", @"unsupported paymentNetwork", nil);
            return;
        }
    }

    if (self.addPaymentPassController) {
        reject(@"logic", @"Another request currently in process", nil);
        return;
    }

    self.addPaymentPassController = [[PKAddPaymentPassViewController alloc] initWithRequestConfiguration:configuration delegate:self];
    if (!self.addPaymentPassController) {
        reject(@"system", @"can't configure PKAddPaymentPassViewController", nil);
        return;
    }

    self.resolver = resolve;
    self.rejecter = reject;
    UIViewController* vc = RCTPresentedViewController();
    [vc presentViewController:self.addPaymentPassController animated:YES completion:nil];
}

RCT_REMAP_METHOD(completeAddPaymentPass, completeAddPaymentPass:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (self.addPaymentPassController == nil || self.handler == nil) {
        reject(@"logic", @"startAddPaymentPass wasn't called or still in work", nil);
        return;
    }
    NSString* activationData = options[@"activationData"];
    NSString* encryptedPassData = options[@"encryptedPassData"];
    NSString* wrappedKey = options[@"wrappedKey"];

    PKAddPaymentPassRequest* request = [[PKAddPaymentPassRequest alloc] init];
    request.activationData = [activationData dataUsingEncoding:NSUTF8StringEncoding];
    request.encryptedPassData = [[NSData alloc] initWithBase64EncodedString:encryptedPassData options:0];
    request.wrappedKey = [[NSData alloc] initWithBase64EncodedString:wrappedKey options:0];

    self.resolver = resolve;
    self.rejecter = reject;

    self.handler(request);
    self.handler = nil;
}

- (void)addPaymentPassViewController:(nonnull PKAddPaymentPassViewController *)controller didFinishAddingPaymentPass:(nullable PKPaymentPass *)pass error:(nullable NSError *)error {
    if (self.addPaymentPassController != controller) {
        return;
    }
    [controller dismissViewControllerAnimated:YES completion:nil];
    NSAssert(self.addPaymentPassController != nil, @"addPaymentPassController is nil");
    NSAssert(self.resolver != nil, @"resolver is nil");
    NSAssert(self.rejecter != nil, @"rejecter is nil");
    if (pass) {
        self.resolver(@(YES));
    } else {
        self.rejecter(@"system", [error localizedDescription], error);
    }
    self.addPaymentPassController = nil;
    self.resolver = nil;
    self.rejecter = nil;
}

- (void)addPaymentPassViewController:(nonnull PKAddPaymentPassViewController *)controller generateRequestWithCertificateChain:(nonnull NSArray<NSData *> *)certificates nonce:(nonnull NSData *)nonce nonceSignature:(nonnull NSData *)nonceSignature completionHandler:(nonnull void (^)(PKAddPaymentPassRequest * _Nonnull))handler {
    if (self.addPaymentPassController != controller) {
        return;
    }
    NSAssert(self.addPaymentPassController != nil, @"addPaymentPassController is nil");
    NSAssert(self.resolver != nil, @"resolver is nil");
    NSAssert(self.rejecter != nil, @"rejecter is nil");

    self.handler = handler;

    // the leaf certificate will be the first element of that array and the sub-CA certificate will follow.
    NSString *certificateOfIndexZeroString = [certificates[0] base64EncodedStringWithOptions:0];
    NSString *certificateOfIndexOneString = [certificates[1] base64EncodedStringWithOptions:0];
    NSString *nonceString = [nonce base64EncodedStringWithOptions:0];
    NSString *nonceSignatureString = [nonceSignature base64EncodedStringWithOptions:0];

    NSDictionary* result = @{
                             @"certificateLeaf": certificateOfIndexZeroString,
                             @"certificateSubCA": certificateOfIndexOneString,
                             @"nonce": nonceString,
                             @"nonceSignature": nonceSignatureString,
                             };
    self.resolver(result);
    self.resolver = nil;
    self.rejecter = nil;
}

@end
