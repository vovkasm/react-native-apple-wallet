'use strict'
const path = require('path')

module.exports = {
  projectRoot: path.resolve(__dirname, 'WalletSample'),
  watchFolders: [__dirname],

  resolver: {
    extraNodeModules: {
      'react-native-apple-wallet': __dirname,
    }
  }
}
