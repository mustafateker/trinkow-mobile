const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const kok = join(__dirname, '..');
const oku = (ad) => JSON.parse(readFileSync(join(kok, ad), 'utf8'));

test('Android native release kimliği ve sürüm kaynakları tutarlı', () => {
  const app = oku('app.json');
  const paket = oku('package.json');
  const gradle = readFileSync(join(kok, 'android/app/build.gradle'), 'utf8');

  assert.equal(app.expo.android.package, 'com.triworkster.trinkow');
  assert.equal(app.expo.version, paket.version);
  assert.match(gradle, /applicationId 'com\.triworkster\.trinkow'/);
  assert.match(gradle, new RegExp(`versionName "${paket.version.replaceAll('.', '\\.')}"`));
});

test('production build debug anahtarı kullanmaz', () => {
  const gradle = readFileSync(join(kok, 'android/app/build.gradle'), 'utf8');
  const buildTypes = gradle.slice(gradle.indexOf('buildTypes {'), gradle.indexOf('packagingOptions {'));

  assert.match(buildTypes, /signingConfig signingConfigs\.release/);
  assert.doesNotMatch(buildTypes.match(/release \{([\s\S]*)/)?.[1] ?? '', /signingConfigs\.debug/);
  assert.match(gradle, /android-upload-keystore\.jks/);
});

test('Android release R8 ile kodu ve kaynakları optimize eder', () => {
  const gradle = readFileSync(join(kok, 'android/app/build.gradle'), 'utf8');
  const properties = readFileSync(join(kok, 'android/gradle.properties'), 'utf8');

  assert.match(properties, /android\.enableMinifyInReleaseBuilds=true/);
  assert.match(properties, /android\.enableShrinkResourcesInReleaseBuilds=true/);
  assert.match(properties, /android\.r8\.optimizedResourceShrinking=true/);
  assert.match(gradle, /proguard-android-optimize\.txt/);
});

test('Android release reklam kimliği istemez', () => {
  const app = oku('app.json');
  const manifest = readFileSync(join(kok, 'android/app/src/main/AndroidManifest.xml'), 'utf8');

  assert.ok(app.expo.android.blockedPermissions.includes('com.google.android.gms.permission.AD_ID'));
  assert.match(
    manifest,
    /android:name="com\.google\.android\.gms\.permission\.AD_ID" tools:node="remove"/,
  );
});

test('npm release native Gradle build ve Google Play kapalı test yayını kullanır', () => {
  const paket = oku('package.json');
  const betik = readFileSync(join(kok, 'scripts/release.mjs'), 'utf8');
  const fastfile = readFileSync(join(kok, 'fastlane/Fastfile'), 'utf8');

  assert.equal(paket.scripts.release, 'node scripts/release.mjs');
  assert.match(betik, /:app:bundleRelease/);
  assert.doesNotMatch(betik, /\['clean',\s*':app:bundleRelease'\]/);
  assert.match(betik, /rmSync\(androidAppBuildYolu/);
  assert.match(betik, /rmSync\(androidAppCxxYolu/);
  assert.match(betik, /fastlane', \['android', 'release'\]/);
  assert.match(fastfile, /track: "alpha"/);
  assert.match(fastfile, /release_status: "draft"/);
  assert.match(fastfile, /in_app_update_priority: 5/);
  assert.equal(existsSync(join(kok, 'eas.json')), false);
});
