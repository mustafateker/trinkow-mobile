import { FlexWidget, TextWidget, type WidgetTaskHandlerProps } from 'react-native-android-widget';

function VoiceExpenseAndroidWidget() {
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'trinkow://harcama-ekle?sesli=1' }}
      accessibilityLabel="Sesli harcama ekle"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        padding: 16,
        borderRadius: 24,
        backgroundGradient: { from: '#071A70', to: '#171C42', orientation: 'TL_BR' },
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <TextWidget text="🎙️" style={{ fontSize: 30, color: '#FFFFFF' }} />
      <FlexWidget style={{ flexDirection: 'column', flexGap: 4 }}>
        <TextWidget
          text="Sesli harcama"
          maxLines={1}
          style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}
        />
        <TextWidget
          text="Dokun ve söyle"
          maxLines={1}
          style={{ color: '#C9D2FF', fontSize: 12, fontWeight: '500' }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

export async function voiceExpenseWidgetTaskHandler(props: WidgetTaskHandlerProps) {
  if (props.widgetInfo.widgetName !== 'VoiceExpense' || props.widgetAction === 'WIDGET_DELETED') return;
  props.renderWidget(<VoiceExpenseAndroidWidget />);
}
