const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const kok = path.resolve(__dirname, '..');

test('ortak buton dokunma alanı komşu kontrollere taşmaz', () => {
  const kaynak = fs.readFileSync(path.join(kok, 'src/components/ClayPressable.tsx'), 'utf8');
  assert.doesNotMatch(kaynak, /hitSlop=\{a11y\.minTarget\}/);
  assert.match(kaynak, /hitSlop=\{hitSlop\}/);
});

test('Android sekme çubuğu görsel transform yerine gerçek yerleşim kullanır', () => {
  const kaynak = fs.readFileSync(path.join(kok, 'src/components/TabBar.tsx'), 'utf8');
  assert.doesNotMatch(kaynak, /translateY/);
  assert.match(kaynak, /paddingBottom: Platform\.OS === 'android'/);
});

test('Günlük ekranı sınır hazır olmadan eski günleri monte etmez ve bugünle başlar', () => {
  const kaynak = fs.readFileSync(path.join(kok, 'app/(tabs)/index.tsx'), 'utf8');
  assert.match(kaynak, /sinir\.hazir && aktifIndex >= 0/);
  assert.match(kaynak, /initialScrollIndex=\{aktifIndex\}/);
  assert.match(kaynak, /initialNumToRender=\{1\}/);
  assert.match(kaynak, /maxToRenderPerBatch=\{1\}/);
});

test('Sık harcamalar yatay kayarken dış gün sayfalaması kilitlenir', () => {
  const pager = fs.readFileSync(path.join(kok, 'app/(tabs)/index.tsx'), 'utf8');
  const gunluk = fs.readFileSync(path.join(kok, 'src/components/pano/GunlukSayfa.tsx'), 'utf8');
  assert.match(pager, /scrollEnabled=\{!icYatayKaydiriliyor\}/);
  assert.match(gunluk, /onTouchStart=\{\(\) => onIcYatayKaydirmaDegisti\?\.\(true\)\}/);
  assert.match(gunluk, /onTouchEnd=\{\(\) => onIcYatayKaydirmaDegisti\?\.\(false\)\}/);
});

test('Android gesture navigation zemini alt dock ile aynı renktedir', () => {
  const config = JSON.parse(fs.readFileSync(path.join(kok, 'app.json'), 'utf8'));
  const rootLayout = fs.readFileSync(path.join(kok, 'app/_layout.tsx'), 'utf8');
  const styles = fs.readFileSync(path.join(kok, 'android/app/src/main/res/values/styles.xml'), 'utf8');
  assert.equal(config.expo.android.backgroundColor, '#171C42');
  assert.match(rootLayout, /SystemUI\.setBackgroundColorAsync\(color\.navDark\)/);
  assert.match(styles, /android:windowLightNavigationBar">false/);
  assert.doesNotMatch(config.expo.plugins.join(','), /expo-navigation-bar/);
});

test('Android 15 edge-to-edge deprecated pencere renk parametrelerini kullanmaz', () => {
  const styles = fs.readFileSync(path.join(kok, 'android/app/src/main/res/values/styles.xml'), 'utf8');
  assert.doesNotMatch(styles, /statusBarColor|navigationBarColor|enforceNavigationBarContrast/);
});

test('Android büyük ekranlarda yeniden boyutlandırılabilir ve yön kilidi yoktur', () => {
  const config = JSON.parse(fs.readFileSync(path.join(kok, 'app.json'), 'utf8'));
  const manifest = fs.readFileSync(path.join(kok, 'android/app/src/main/AndroidManifest.xml'), 'utf8');
  assert.equal(config.expo.orientation, 'default');
  assert.match(manifest, /android:resizeableActivity="true"/);
  assert.doesNotMatch(manifest, /android:screenOrientation=/);
});

test('Trinkow uygulama ikonu ve markalı splash varlıkları yapılandırılmıştır', () => {
  const config = JSON.parse(fs.readFileSync(path.join(kok, 'app.json'), 'utf8'));
  assert.equal(config.expo.backgroundColor, '#071A70');
  assert.equal(config.expo.developmentClient.silentLaunch, true);
  assert.equal(config.expo.icon, './assets/images/trinkow-app-icon.png');
  assert.equal(config.expo.android.adaptiveIcon.foregroundImage, './assets/images/trinkow-android-foreground.png');
  assert.equal(config.expo.android.adaptiveIcon.backgroundColor, '#071A70');
  const splash = config.expo.plugins.find((plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen');
  assert.equal(splash?.[1].image, './assets/images/trinkow-brand-mark.png');
  assert.equal(splash?.[1].backgroundColor, '#071A70');
  for (const dosya of ['trinkow-app-icon.png', 'trinkow-android-foreground.png', 'trinkow-brand-mark.png']) {
    assert.equal(fs.existsSync(path.join(kok, 'assets/images', dosya)), true);
  }
});
