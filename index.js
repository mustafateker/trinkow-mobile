import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const { voiceExpenseWidgetTaskHandler } = require('./src/widgets/VoiceExpenseWidget.android');
  registerWidgetTaskHandler(voiceExpenseWidgetTaskHandler);
}

import 'expo-router/entry';
