import React, { Component } from 'react';
import {request, PERMISSIONS} from 'react-native-permissions';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  NativeEventEmitter,
  NativeModules,
  Pressable, 
  Platform
} from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.EventEmitter);
const { ClientManager } = NativeModules;

const styles = StyleSheet.create({
  status: {
    padding: 20,
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
    alignItems: 'center'
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
      callButton: "Login",
      callAction: () => ClientManager.login("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTY2ODk1NzEsImp0aSI6ImNmYzZmOWYwLThkODYtMTFlYi1hMDYyLTZkNzM3YzZiMDE0NiIsImV4cCI6MTYxNjcxMTE3MCwiYWNsIjp7InBhdGhzIjp7Ii8qL3VzZXJzLyoqIjp7fSwiLyovY29udmVyc2F0aW9ucy8qKiI6e30sIi8qL3Nlc3Npb25zLyoqIjp7fSwiLyovZGV2aWNlcy8qKiI6e30sIi8qL2ltYWdlLyoqIjp7fSwiLyovbWVkaWEvKioiOnt9LCIvKi9hcHBsaWNhdGlvbnMvKioiOnt9LCIvKi9wdXNoLyoqIjp7fSwiLyova25vY2tpbmcvKioiOnt9LCIvKi9sZWdzLyoqIjp7fX19LCJzdWIiOiJBbGljZSIsImFwcGxpY2F0aW9uX2lkIjoiOThmMjFmNDUtZjhhYy00MTA1LTk3MDYtZTliOTA4Y2VhMjEzIn0.e25uxe0RX0_2QKjH9biJoOnkFPSsXkCFr3eUIXpFOJBcwgZIk3-Z6IAoJK5rz_gC_s3goq0k03EdLefesiy82T9-pVlcQsbtI_a11B0S7qKk-mbNU8nEYpsGS5TWZMBcX7iMQtsYQL3TmQcoZacF3n0VczPLDpMs8ZU5sKCiAPlTcFwce56GRj9rw7SC7KZGRn9IyVUEZgbHWSK1UNhUS0nxmGHhjeBtBDDKjt0X2Q53CWw6tl0PfzVtzeLOQn1Xa3d3B7xy6ZXCGYSJ6hK8VmDx_MO2RguHlRxRamsKjgECUjPjDM2CrFjLa3E7gJ8zwxALMWA_4YrncXofzXvNpA")
    };
  }

  componentDidMount() {

    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.MICROPHONE);
    } else if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    }

    eventEmitter.addListener('onStatusChange', (data) => {
      const status = data.status;
      this.setState({ status: status });

      if (status === 'connected' || status === 'Connected') {
        this.setState({ callButton: "Call"});
        this.setState({ callAction: () => ClientManager.makeCall()});
      }
    });

    eventEmitter.addListener('onCallStateChange', (data) => {
      const state = data.state;
      this.setState({ callState: state });

      if (state == 'On Call') {
        this.setState({ callButton: "End Call"});
        this.setState({ callAction: () => ClientManager.endCall()});
      } else if (state == 'Idle') {
        this.setState({ callButton: "Call"});
        this.setState({ callAction: () => ClientManager.makeCall()});
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
