import React from 'react'
import { Button, StyleSheet, View } from 'react-native'

// tslint:disable:no-console

import * as Wallet from 'react-native-apple-wallet'

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="can add payment pass?" onPress={this.handleCheck} />
        <Button title="add payment pass" onPress={this.handleAdd} />
      </View>
    )
  }

  private handleCheck = () => {
    Wallet.canAddPaymentPass().then((val) => {
      console.log('canAddPaymentPass: ', val)
    })
  }
  private handleAdd = () => {
    Wallet.startAddPaymentPass({
      cardholderName: 'Sandbox',
      encryptionScheme: 'RSA_V2',
      primaryAccountSuffix: '1471',
    }).then((res) => {
      // same as https://github.com/tomavic/cordova-apple-wallet#start-adding-card
      console.log('result is', res)
      const data = {
        activationData: 'encoded Base64 activationData from your server',
        encryptedPassData: 'encoded Base64 encryptedPassData from your server',
        wrappedKey: 'encoded Base64 wrappedKey from your server',
      }
      return Wallet.completeAddPaymentPass(data)
    }).then(() => {
      console.log('Card was added!')
    }).catch((e) => {
      console.log('err: ', e)
    })
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
})
