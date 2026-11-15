const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const kok = path.resolve(__dirname, '..');
const {
  adoptSceneLifecycleInAppDelegate,
  SCENE_MANIFEST,
  SCENE_DELEGATE_SOURCE,
} = require('../plugins/withIosSceneDelegate');

// expo-template-bare-minimum@57.x ios/HelloWorld/AppDelegate.swift (expo prebuild çıktısı)
const SDK57_APP_DELEGATE = `internal import Expo
import React
import ReactAppDependencyProvider

@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // Linking API
  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
  }
}
`;

test('iOS scene plugin app.json içinde kayıtlı ve manifest yalnızca plugin üzerinden eklenir', () => {
  const config = JSON.parse(fs.readFileSync(path.join(kok, 'app.json'), 'utf8'));
  assert.ok(config.expo.plugins.includes('./plugins/withIosSceneDelegate'));
  // SceneDelegate sınıfı olmadan manifest eklenirse uygulama siyah ekranda kalır.
  assert.equal(config.expo.ios.infoPlist.UIApplicationSceneManifest, undefined);
});

test('scene manifest tek pencereli ve SceneDelegate sınıfını gösterir', () => {
  const [ayar] = SCENE_MANIFEST.UISceneConfigurations.UIWindowSceneSessionRoleApplication;
  assert.equal(SCENE_MANIFEST.UIApplicationSupportsMultipleScenes, false);
  assert.equal(ayar.UISceneDelegateClassName, 'SceneDelegate');
  assert.match(SCENE_DELEGATE_SOURCE, /@objc\(SceneDelegate\)\nclass SceneDelegate: ExpoAppSceneDelegate \{/);
});

test('AppDelegate pencereyi kendisi oluşturmaz, factory sağlayıcısı olur', () => {
  const sonuc = adoptSceneLifecycleInAppDelegate(SDK57_APP_DELEGATE);
  assert.match(sonuc, /class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider \{/);
  assert.doesNotMatch(sonuc, /UIWindow\(frame:/);
  assert.doesNotMatch(sonuc, /startReactNative/);
  assert.doesNotMatch(sonuc, /#if os\(iOS\) \|\| os\(tvOS\)/);
  // Factory hâlâ AppDelegate'te kurulur; SceneDelegate onu buradan alır.
  assert.match(sonuc, /reactNativeFactory = factory\n/);
  assert.match(sonuc, /var window: UIWindow\?/);
  assert.match(sonuc, /return super\.application\(application, didFinishLaunchingWithOptions: launchOptions\)/);
  // Deep link override'ları korunur; Expo'nun scene forwarder'ı bunları çağırır.
  assert.match(sonuc, /RCTLinkingManager\.application\(app, open: url, options: options\)/);
});

test('AppDelegate dönüşümü tekrar çalıştırıldığında değişmez', () => {
  const bir = adoptSceneLifecycleInAppDelegate(SDK57_APP_DELEGATE);
  assert.equal(adoptSceneLifecycleInAppDelegate(bir), bir);
});

test('beklenmeyen AppDelegate yapısında prebuild sessizce geçmez', () => {
  assert.throws(() => adoptSceneLifecycleInAppDelegate('class AppDelegate: UIResponder {}'), /withIosSceneDelegate/);
  const elleDegismis = SDK57_APP_DELEGATE.replace('    window = UIWindow(frame: UIScreen.main.bounds)\n', '');
  assert.throws(() => adoptSceneLifecycleInAppDelegate(elleDegismis), /withIosSceneDelegate/);
});
