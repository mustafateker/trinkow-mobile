import ExpoModulesCore
import UIKit

public final class TrinkowQuickAccessAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  private let voiceExpenseType = "com.trinkow.app.voice-expense"

  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let turkish = Locale.preferredLanguages.first?.hasPrefix("tr") == true
    application.shortcutItems = [
      UIApplicationShortcutItem(
        type: voiceExpenseType,
        localizedTitle: turkish ? "Sesli harcama" : "Voice expense",
        localizedSubtitle: turkish ? "Dokun ve söyle" : "Tap and speak",
        icon: UIApplicationShortcutIcon(systemImageName: "mic.fill"),
        userInfo: nil
      )
    ]
    return true
  }

  public func application(
    _ application: UIApplication,
    performActionFor shortcutItem: UIApplicationShortcutItem,
    completionHandler: @escaping (Bool) -> Void
  ) {
    guard shortcutItem.type == voiceExpenseType,
          let url = URL(string: "trinkow://harcama-ekle?sesli=1") else {
      completionHandler(false)
      return
    }
    application.open(url, options: [:], completionHandler: completionHandler)
  }
}
