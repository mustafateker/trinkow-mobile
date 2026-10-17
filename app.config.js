const appJson = require('./app.json');

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(appJson.expo.plugins ?? []),
    [
      'react-native-nitro-google-signin',
      // Android client ID'yi backend'den çalışma anında alır. Plugin iOS
      // prebuild için bir URL scheme istediğinden gerçek kimlik içermeyen
      // sabit bir placeholder kullanılır.
      { iosUrlScheme: 'com.googleusercontent.apps.runtime-configured' },
    ],
  ],
});
