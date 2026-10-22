package expo.modules.trinkowquickaccess

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.graphics.drawable.Icon
import android.os.Build
import android.app.StatusBarManager
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class TrinkowQuickAccessModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("TrinkowQuickAccess")

    AsyncFunction("requestPinWidget") {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
        return@AsyncFunction "unsupported"
      }

      val manager = AppWidgetManager.getInstance(context)
      if (!manager.isRequestPinAppWidgetSupported) {
        return@AsyncFunction "unsupported"
      }

      val provider = ComponentName(context.packageName, "${context.packageName}.widget.VoiceExpense")
      if (manager.getAppWidgetIds(provider).isNotEmpty()) {
        return@AsyncFunction "already_added"
      }

      if (manager.requestPinAppWidget(provider, null, null)) "requested" else "unavailable"
    }

    AsyncFunction("requestAddQuickSettingsTile") { promise: Promise ->
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
        promise.resolve("unsupported")
        return@AsyncFunction
      }

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
        promise.resolve("manual_required")
        return@AsyncFunction
      }

      val component = ComponentName(context, VoiceExpenseTileService::class.java)
      val icon = Icon.createWithResource(context, R.drawable.ic_trinkow_mic)
      val executor = context.mainExecutor
      try {
        context.getSystemService(StatusBarManager::class.java).requestAddTileService(
          component,
          context.getString(R.string.quick_access_voice_expense),
          icon,
          executor
        ) { result ->
          val status = when (result) {
            StatusBarManager.TILE_ADD_REQUEST_RESULT_TILE_ADDED -> "added"
            StatusBarManager.TILE_ADD_REQUEST_RESULT_TILE_ALREADY_ADDED -> "already_added"
            StatusBarManager.TILE_ADD_REQUEST_RESULT_TILE_NOT_ADDED -> "dismissed"
            else -> "unavailable"
          }
          promise.resolve(status)
        }
      } catch (_: Exception) {
        promise.resolve("unavailable")
      }
    }
  }
}
