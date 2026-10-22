import { HStack, Image, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  containerBackground,
  font,
  foregroundStyle,
  padding,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

type VoiceExpenseWidgetProps = {
  title: string;
  subtitle: string;
};

function VoiceExpenseWidget(props: VoiceExpenseWidgetProps, environment: WidgetEnvironment) {
  'widget';
  const compact = environment.widgetFamily === 'systemSmall';
  const circular = environment.widgetFamily === 'accessoryCircular';
  const inline = environment.widgetFamily === 'accessoryInline';
  const rectangular = environment.widgetFamily === 'accessoryRectangular';

  if (circular) {
    return (
      <VStack
        alignment="center"
        spacing={2}
        modifiers={[widgetURL('trinkow://harcama-ekle?sesli=1'), accessibilityLabel('Sesli harcama ekle')]}>
        <Image systemName="mic.fill" size={23} />
        <Text modifiers={[font({ size: 9, weight: 'bold' })]}>EKLE</Text>
      </VStack>
    );
  }

  if (inline) {
    return (
      <HStack
        spacing={4}
        modifiers={[widgetURL('trinkow://harcama-ekle?sesli=1'), accessibilityLabel('Sesli harcama ekle')]}>
        <Image systemName="mic.fill" size={13} />
        <Text modifiers={[font({ size: 12, weight: 'semibold' })]}>{props.title}</Text>
      </HStack>
    );
  }

  if (rectangular) {
    return (
      <HStack
        spacing={8}
        modifiers={[widgetURL('trinkow://harcama-ekle?sesli=1'), accessibilityLabel('Sesli harcama ekle')]}>
        <Image systemName="mic.fill" size={22} />
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[font({ size: 14, weight: 'bold' })]}>{props.title}</Text>
          <Text modifiers={[font({ size: 10, weight: 'medium' })]}>{props.subtitle}</Text>
        </VStack>
      </HStack>
    );
  }

  return (
    <VStack
      alignment="leading"
      spacing={8}
      modifiers={[
        padding({ all: 16 }),
        containerBackground('#071A70', 'widget'),
        widgetURL('trinkow://harcama-ekle?sesli=1'),
        accessibilityLabel('Sesli harcama ekle'),
      ]}>
      <HStack>
        <Image systemName="mic.fill" size={compact ? 27 : 24} color="#F45B6B" />
        <Spacer />
        {!compact ? (
          <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle('#C9D2FF')]}>TRINKOW</Text>
        ) : null}
      </HStack>
      <Spacer />
      <Text modifiers={[font({ size: compact ? 17 : 19, weight: 'bold' }), foregroundStyle('#FFFFFF')]}>
        {props.title}
      </Text>
      <Text modifiers={[font({ size: 12, weight: 'medium' }), foregroundStyle('#C9D2FF')]}>{props.subtitle}</Text>
    </VStack>
  );
}

const VoiceExpenseIosWidget = createWidget<VoiceExpenseWidgetProps>('VoiceExpense', VoiceExpenseWidget);

export function initializeVoiceExpenseWidget() {
  VoiceExpenseIosWidget.updateSnapshot({ title: 'Sesli harcama', subtitle: 'Dokun ve söyle' });
}
