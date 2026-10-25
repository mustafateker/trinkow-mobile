import { SettingsPage } from '@/components/SettingsPage';
import { Txt } from '@/components/Txt';
import { t } from '@/content/metinler';
import { useDil } from '@/i18n/useDil';
export default function Yardim() {
  useDil();
  return <SettingsPage baslik={t['ui.settings.help_title']}>
    <Txt role="h2">{t['ui.help.expense_question']}</Txt>
    <Txt role="body">{t['ui.help.expense_answer']}</Txt>
    <Txt role="h2">{t['ui.help.savings_question']}</Txt>
    <Txt role="body">{t['ui.help.savings_answer']}</Txt>
    <Txt role="h2">{t['ui.help.limits_question']}</Txt>
    <Txt role="body">{t['ui.help.limits_answer']}</Txt>
    <Txt role="h2">{t['ui.help.password_question']}</Txt>
    <Txt role="body">{t['ui.help.password_answer']}</Txt>
    <Txt role="h2">{t['ui.help.delete_question']}</Txt>
    <Txt role="body">{t['ui.help.delete_answer']}</Txt>
    <Txt role="h2">{t['ui.settings.support']}</Txt>
    <Txt role="body">{t['ui.help.support_body']}</Txt>
  </SettingsPage>;
}
