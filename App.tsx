/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  NativeEventEmitter,
  NativeModules,
  Pressable
} from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.EventEmitter);
const styles = StyleSheet.create({
  status: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  button: {
    borderRadius: 8,
    borderColor: 'blue',
    borderWidth: 2,
    padding: 6,
    height: 40,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  callState: {
    textAlign: 'center',
    padding: 6,
    width: 200,
    height: 30
  }
})

class App extends Component<{}, { status: string, callState: string, callButton: string, callAction: any }> {
  constructor(props: any) {
    super(props);
    this.state = {
      status: "Unknown",
      callState: "Idle",
      callButton: "Call",
      callAction: () => NativeModules.ClientManager.makeCall()
    };
  }

  componentDidMount() {
    eventEmitter.addListener('onStatusChange', (data) => {
      this.setState({ status: data.status });
    });
    eventEmitter.addListener('onCallStateChange', (data) => {
      const state = data.state;
      this.setState({ callState: state });

      if (state == 'On Call') {
        this.setState({ callButton: "End Call"});
        this.setState({ callAction: () => NativeModules.ClientManager.endCall()});
      } else if (state == 'Idle') {
        this.setState({ callButton: "Call"});
        this.setState({ callAction: () => NativeModules.ClientManager.makeCall()});
      }
    });
  }

  componentWillUnmount() {
    eventEmitter.removeAllListeners('onStatusChange');
    eventEmitter.removeAllListeners('onCallStateChange');
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.status}>
          <Text>
            {this.state.status}
          </Text>

          <View style={styles.container}>
            <Text style={styles.callState}>
              Call Status: {this.state.callState}
            </Text>
            <Pressable
              style={styles.button}
              onPress={this.state.callAction}>
              <Text style={styles.buttonText}>{this.state.callButton}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default App;
