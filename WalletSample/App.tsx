import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'

import * as Wallet from 'react-native-apple-wallet'

const instructions = Platform.select({
  android:
  'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
})

export default class App extends React.Component {
  componentDidMount() {
    Wallet.canAddPaymentPass().then((val) => {
      console.log('canAddPaymentPass: ', val)
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },
  instructions: {
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
})
