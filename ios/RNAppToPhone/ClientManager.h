#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>

NS_ASSUME_NONNULL_BEGIN

@class NXMCall;
@class EventEmitter;

@interface ClientManager : NSObject <RCTBridgeModule>
@property (nullable) NXMCall *call;
@property (nullable) EventEmitter *eventEmitter;

+ (nonnull ClientManager *)shared;
- (void)setupClient;
@end

NS_ASSUME_NONNULL_END
