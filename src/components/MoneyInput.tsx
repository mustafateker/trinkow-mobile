import { useId } from 'react';
import { InputAccessoryView, Keyboard, Platform, Pressable, StyleSheet, TextInput, View, type StyleProp, type TextStyle } from 'react-native';
import { Txt } from '@/components/Txt';
import { nativeTutarGirisi } from '@/lib/para';
import { color, radius, type } from '@/theme/tokens';

/** Native focus/selection/paste; money stays a decimal string until submission. */
export function MoneyInput({ value, onChangeText, label = 'Tutar', autoFocus = false, style, integerOnly = false, hideLabel = false, onFocus, onBlur }: {
  value: string; onChangeText: (value: string) => void; label?: string;
  autoFocus?: boolean; style?: StyleProp<TextStyle>; integerOnly?: boolean; hideLabel?: boolean;
  /** `MoneyField`/`MoneyRow` (rev2) — kuyunun odak halkasını sürmek için. */
  onFocus?: () => void; onBlur?: () => void;
}) {
  const accessory = useId();
  return <View style={{ flexShrink: 1, minWidth: 96 }}>
    {!hideLabel && <Txt role="label">{label}</Txt>}
    <TextInput value={value} onChangeText={(text) => onChangeText(integerOnly ? text.replace(/\D/g, '').slice(0, 6) : nativeTutarGirisi(text))}
      accessibilityLabel={label} placeholder="0" placeholderTextColor={color.text2}
      keyboardType={integerOnly ? 'number-pad' : 'decimal-pad'} autoFocus={autoFocus}
      onFocus={onFocus} onBlur={onBlur}
      selectTextOnFocus returnKeyType="done" onSubmitEditing={Keyboard.dismiss}
      inputAccessoryViewID={Platform.OS === 'ios' ? accessory : undefined}
      style={[styles.input, style]} />
    {Platform.OS === 'ios' && <InputAccessoryView nativeID={accessory}>
      <View style={styles.toolbar}><Pressable accessibilityRole="button" onPress={Keyboard.dismiss} style={styles.done}><Txt role="label">Bitti</Txt></Pressable></View>
    </InputAccessoryView>}
  </View>;
}
const styles = StyleSheet.create({
  input: { ...type.amount, color: color.text, backgroundColor: color.well, minHeight: 48, padding: 12, borderRadius: radius.tile },
  toolbar: { backgroundColor: color.surface, alignItems: 'flex-end' },
  done: { minHeight: 48, paddingHorizontal: 24, justifyContent: 'center' },
});
