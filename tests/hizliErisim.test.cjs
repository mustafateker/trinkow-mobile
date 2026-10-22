const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const kok = join(__dirname, '..');
const oku = (yol) => readFileSync(join(kok, yol), 'utf8');

test('Android hızlı erişim modülü widget ve Hızlı Ayarlar sistem isteklerini kullanır', () => {
  const kaynak = oku('modules/trinkow-quick-access/android/src/main/java/expo/modules/trinkowquickaccess/TrinkowQuickAccessModule.kt');
  assert.match(kaynak, /requestPinAppWidget/);
  assert.match(kaynak, /requestAddTileService/);
  assert.match(kaynak, /TILE_ADD_REQUEST_RESULT_TILE_ALREADY_ADDED/);
});

test('Android bildirim paneli kutucuğu ve ikon uzun-bas kısayolu sesli harcamaya gider', () => {
  const tile = oku('modules/trinkow-quick-access/android/src/main/java/expo/modules/trinkowquickaccess/VoiceExpenseTileService.kt');
  const shortcut = oku('modules/trinkow-quick-access/android/src/main/res/xml/trinkow_shortcuts.xml');
  const manifest = oku('modules/trinkow-quick-access/android/src/main/AndroidManifest.xml');
  assert.match(tile, /trinkow:\/\/harcama-ekle\?sesli=1/);
  assert.match(shortcut, /trinkow:\/\/harcama-ekle\?sesli=1/);
  assert.match(manifest, /android\.service\.quicksettings\.action\.QS_TILE/);
  assert.match(manifest, /android\.app\.shortcuts/);
});

test('iOS sesli harcama widgetı kilit ekranı ailelerini ve ikon kısayolunu destekler', () => {
  const app = JSON.parse(oku('app.json'));
  const widgetPlugin = app.expo.plugins.find((plugin) => Array.isArray(plugin) && plugin[0] === 'expo-widgets');
  const aileler = widgetPlugin[1].widgets[0].ios.supportedFamilies;
  assert.ok(aileler.includes('accessoryCircular'));
  assert.ok(aileler.includes('accessoryRectangular'));
  assert.ok(aileler.includes('accessoryInline'));

  const subscriber = oku('modules/trinkow-quick-access/ios/TrinkowQuickAccessAppDelegateSubscriber.swift');
  assert.match(subscriber, /UIApplicationShortcutItem/);
  assert.match(subscriber, /trinkow:\/\/harcama-ekle\?sesli=1/);
});
