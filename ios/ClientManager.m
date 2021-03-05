#import "ClientManager.h"
#import "EventEmitter.h"
#import <NexmoClient/NexmoClient.h>

@interface ClientManager () <NXMClientDelegate>
@property NXMClient *client;
@end

@implementation ClientManager

RCT_EXPORT_MODULE();

+ (nonnull ClientManager *)shared {
  static ClientManager *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [ClientManager new];
  });
  return sharedInstance;
}

- (void)setupClient {
  self.client = NXMClient.shared;
  [self.client setDelegate:self];
  [self.client loginWithAuthToken:@"ALICE_JWT"];
}

RCT_EXPORT_METHOD(makeCall) {
  [ClientManager.shared.client call:@"" callHandler:NXMCallHandlerServer completionHandler:^(NSError * _Nullable error, NXMCall * _Nullable call) {
    if (error != nil) {
      [ClientManager.shared.eventEmitter sendCallStateEventWith:@"Error"];
      return;
    }
    [ClientManager.shared.eventEmitter sendCallStateEventWith:@"On Call"];
    [ClientManager.shared setCall:call];
  }];
}

RCT_EXPORT_METHOD(endCall) {
  [ClientManager.shared.call hangup];
  ClientManager.shared.call = nil;
  [ClientManager.shared.eventEmitter sendCallStateEventWith:@"Idle"];
}

#pragma mark - NXMClientDelegate

- (void)client:(nonnull NXMClient *)client didChangeConnectionStatus:(NXMConnectionStatus)status reason:(NXMConnectionStatusReason)reason {
  dispatch_async(dispatch_get_main_queue(), ^{
    switch (status) {
      case NXMConnectionStatusConnected:
        [self.eventEmitter sendStatusEventWith:@"Connected"];
        break;
      case NXMConnectionStatusConnecting:
        [self.eventEmitter sendStatusEventWith:@"Connecting"];
        break;
      case NXMConnectionStatusDisconnected:
        [self.eventEmitter sendStatusEventWith:@"Disconnected"];
        break;
    }
  });
}

- (void)client:(nonnull NXMClient *)client didReceiveError:(nonnull NSError *)error {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.eventEmitter sendStatusEventWith:error.localizedDescription];
  });
}

@end
