// iOS 27 SDK (Xcode 27) ile derlenen ve UIScene yaşam döngüsüne geçmemiş uygulamaları
// UIKit açılışta bilerek durdurur:
//   ___UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption_block_invoke (EXC_BREAKPOINT)
// App Store review'da 0.1.15 (19) bu yüzden iOS 27.0.1 cihazda açılırken çöktü.
//
// Expo SDK 58 şablonu bunu SceneDelegate.swift + Info.plist manifest ile çözüyor. SDK 57
// şablonu (expo prebuild) hâlâ eski AppDelegate'i üretiyor, ancak `expo` paketi 57.0.30+
// gerekli `ExpoAppSceneDelegate` / `ExpoReactNativeFactoryProvider` tiplerini zaten içeriyor.
// Bu plugin, prebuild sırasında SDK 58 şablonundaki değişikliklerin aynısını uygular:
//   1. Info.plist'e UIApplicationSceneManifest ekler.
//   2. ios/<Proje>/SceneDelegate.swift dosyasını oluşturup app target'ına ekler.
//   3. AppDelegate'te pencere oluşturmayı ve React Native'i başlatmayı kaldırır (artık
//      SceneDelegate yapıyor) ve ExpoReactNativeFactoryProvider uygunluğunu ekler.
//
// Expo SDK 58'e geçildiğinde bu plugin app.json'dan ve repodan kaldırılmalı; şablon aynı
// şeyi kendisi yapıyor.

const fs = require('node:fs');
const path = require('node:path');

const SCENE_DELEGATE_CLASS = 'SceneDelegate';
const SCENE_DELEGATE_FILE = `${SCENE_DELEGATE_CLASS}.swift`;

const SCENE_DELEGATE_SOURCE = `internal import Expo

// plugins/withIosSceneDelegate.js tarafından üretildi; elle düzenlemeyin.
// Pencereyi oluşturup React Native'i başlatır ve scene olaylarını (deep link, universal link,
// quick action, yaşam döngüsü) AppDelegate'e ve Expo subscriber'larına iletir.
@objc(${SCENE_DELEGATE_CLASS})
class ${SCENE_DELEGATE_CLASS}: ExpoAppSceneDelegate {
  // Extension point for config plugins.
}
`;

const SCENE_MANIFEST = {
  UIApplicationSupportsMultipleScenes: false,
  UISceneConfigurations: {
    UIWindowSceneSessionRoleApplication: [
      {
        UISceneConfigurationName: 'Default Configuration',
        UISceneDelegateClassName: SCENE_DELEGATE_CLASS,
      },
    ],
  },
};

const APP_DELEGATE_CLASS = /class\s+AppDelegate\s*:\s*ExpoAppDelegate\s*\{/;

// SDK 57 şablonundaki:
//   #if os(iOS) || os(tvOS)
//       window = UIWindow(frame: UIScreen.main.bounds)
//       factory.startReactNative(withModuleName: "main", in: window, launchOptions: launchOptions)
//   #endif
const LEGACY_WINDOW_START =
  /\n[ \t]*(?:#if os\(iOS\) \|\| os\(tvOS\)[ \t]*\n)?[ \t]*window = UIWindow\(frame: UIScreen\.main\.bounds\)[ \t]*\n[ \t]*factory\.startReactNative\([^)]*\)[ \t]*\n(?:[ \t]*#endif[ \t]*\n)?/;

function adoptSceneLifecycleInAppDelegate(contents) {
  let next = contents;

  if (!next.includes('ExpoReactNativeFactoryProvider')) {
    if (!APP_DELEGATE_CLASS.test(next)) {
      throw new Error(
        '[withIosSceneDelegate] AppDelegate.swift içinde `class AppDelegate: ExpoAppDelegate {` bulunamadı. ' +
          'Expo şablonu değişmiş olabilir; plugin güncellenmeli.',
      );
    }
    next = next.replace(APP_DELEGATE_CLASS, 'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {');
  }

  if (LEGACY_WINDOW_START.test(next)) {
    next = next.replace(
      LEGACY_WINDOW_START,
      '\n    // Pencere SceneDelegate tarafından oluşturulur ve React Native orada başlatılır\n' +
        '    // (UIScene yaşam döngüsü, iOS 27 SDK için zorunlu).\n',
    );
  }

  if (/UIWindow\(frame:/.test(next) || /\.startReactNative\(/.test(next)) {
    throw new Error(
      '[withIosSceneDelegate] AppDelegate.swift hâlâ kendi penceresini oluşturuyor / React Native başlatıyor. ' +
        'Bu, scene yaşam döngüsünde siyah ekrana yol açar; plugin güncellenmeli.',
    );
  }

  return next;
}

function withSceneManifest(config) {
  const { withInfoPlist } = require('expo/config-plugins');
  return withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = SCENE_MANIFEST;
    return cfg;
  });
}

function withSceneDelegateSource(config) {
  const { withDangerousMod } = require('expo/config-plugins');
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const { platformProjectRoot, projectName } = cfg.modRequest;
      fs.writeFileSync(path.join(platformProjectRoot, projectName, SCENE_DELEGATE_FILE), SCENE_DELEGATE_SOURCE);
      return cfg;
    },
  ]);
}

function withSceneDelegateInXcodeProject(config) {
  const { withXcodeProject, IOSConfig } = require('expo/config-plugins');
  return withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const { projectName } = cfg.modRequest;
    const filepath = `${projectName}/${SCENE_DELEGATE_FILE}`;
    if (!project.hasFile(filepath)) {
      // expo-widgets ikinci bir target eklediği için dosyayı açıkça ana uygulama target'ına bağla.
      const [targetUuid] = IOSConfig.Target.findFirstNativeTarget(project);
      IOSConfig.XcodeUtils.addBuildSourceFileToGroup({ filepath, groupName: projectName, project, targetUuid });
    }
    return cfg;
  });
}

function withAppDelegateSceneLifecycle(config) {
  const { withAppDelegate } = require('expo/config-plugins');
  return withAppDelegate(config, (cfg) => {
    if (cfg.modResults.language !== 'swift') {
      throw new Error(`[withIosSceneDelegate] Swift AppDelegate bekleniyordu, ${cfg.modResults.language} bulundu.`);
    }
    cfg.modResults.contents = adoptSceneLifecycleInAppDelegate(cfg.modResults.contents);
    return cfg;
  });
}

function withIosSceneDelegate(config) {
  config = withSceneManifest(config);
  config = withSceneDelegateSource(config);
  config = withSceneDelegateInXcodeProject(config);
  config = withAppDelegateSceneLifecycle(config);
  return config;
}

module.exports = withIosSceneDelegate;
module.exports.adoptSceneLifecycleInAppDelegate = adoptSceneLifecycleInAppDelegate;
module.exports.SCENE_MANIFEST = SCENE_MANIFEST;
module.exports.SCENE_DELEGATE_SOURCE = SCENE_DELEGATE_SOURCE;
