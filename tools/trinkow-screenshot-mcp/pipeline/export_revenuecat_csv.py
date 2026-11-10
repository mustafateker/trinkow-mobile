import csv
import os
import shutil

LANGS = ['en', 'tr', 'de', 'fr', 'es', 'it', 'cs', 'pt', 'ru', 'ro', 'pl']
BCP47_MAP = {
    'en': 'en-US',
    'tr': 'tr-TR',
    'de': 'de-DE',
    'fr': 'fr-FR',
    'es': 'es-ES',
    'it': 'it-IT',
    'cs': 'cs-CZ',
    'pt': 'pt-PT',
    'ru': 'ru-RU',
    'ro': 'ro-RO',
    'pl': 'pl-PL'
}

def extract_strings():
    data = {l: {} for l in LANGS}
    for l in LANGS:
        fpath = f'src/i18n/kaynaklar/{l}.ts'
        if not os.path.exists(fpath):
            continue
        with open(fpath, encoding='utf-8') as f:
            for line in f:
                line_str = line.strip()
                if not (line_str.startswith("'") or line_str.startswith('"')):
                    continue
                idx = line_str.find(':')
                if idx == -1:
                    continue
                k = line_str[:idx].strip('\'"')
                val = line_str[idx+1:].strip().rstrip(',').strip('\'"`')
                data[l][k] = val
    return data

def build_revenuecat_csvs():
    data = extract_strings()

    rows = [
        # Standard RevenueCat Paywalls v2 & Template keys
        ('title', 'premium.baslik'),
        ('subtitle', 'premium.alt.standart'),
        ('subtitle_discount', 'premium.alt.indirim'),
        ('badge', 'premium.plan.en_avantajli'),
        ('discount_badge', 'premium.rozet.indirim'),

        ('features.0.title', 'premium.ozellik.analiz'),
        ('features.0.subtitle', 'premium.ozellik.analiz.alt'),
        ('features.1.title', 'premium.ozellik.tasarruf'),
        ('features.1.subtitle', 'premium.ozellik.tasarruf.alt'),
        ('features.2.title', 'premium.ozellik.reklamsiz'),
        ('features.2.subtitle', 'premium.ozellik.reklamsiz.alt'),

        ('call_to_action', 'premium.eylem.satin_al'),
        ('call_to_action_with_intro_offer', 'premium.eylem.deneme'),
        ('call_to_action_continue', 'premium.eylem.ucretsiz_devam'),

        ('package_annual_name', 'premium.plan.yillik'),
        ('package_monthly_name', 'premium.plan.aylik'),
        ('package_annual_renewal', 'premium.plan.yenileme.yillik'),
        ('package_monthly_renewal', 'premium.plan.yenileme.aylik'),

        ('footer_restore_purchases', 'premium.eylem.geri_yukle'),
        ('footer_terms_and_privacy', 'premium.yasal'),
        ('guarantee_cancel_anytime', 'premium.guvence.iptal'),

        # Fallback exact string keys
        ('premium.baslik', 'premium.baslik'),
        ('premium.alt.standart', 'premium.alt.standart'),
        ('premium.alt.indirim', 'premium.alt.indirim'),
        ('premium.rozet.indirim', 'premium.rozet.indirim'),
        ('premium.ozellik.analiz', 'premium.ozellik.analiz'),
        ('premium.ozellik.analiz.alt', 'premium.ozellik.analiz.alt'),
        ('premium.ozellik.tasarruf', 'premium.ozellik.tasarruf'),
        ('premium.ozellik.tasarruf.alt', 'premium.ozellik.tasarruf.alt'),
        ('premium.ozellik.reklamsiz', 'premium.ozellik.reklamsiz'),
        ('premium.ozellik.reklamsiz.alt', 'premium.ozellik.reklamsiz.alt'),
        ('premium.plan.yillik', 'premium.plan.yillik'),
        ('premium.plan.aylik', 'premium.plan.aylik'),
        ('premium.plan.en_avantajli', 'premium.plan.en_avantajli'),
        ('premium.eylem.satin_al', 'premium.eylem.satin_al'),
        ('premium.eylem.deneme', 'premium.eylem.deneme'),
        ('premium.eylem.geri_yukle', 'premium.eylem.geri_yukle'),
        ('premium.eylem.ucretsiz_devam', 'premium.eylem.ucretsiz_devam'),
        ('premium.yasal', 'premium.yasal')
    ]

    out_dir_proj = 'assets/store'
    out_dir_docs = '/Users/mustafa/Documents/Trinkow Assets'
    os.makedirs(out_dir_proj, exist_ok=True)
    os.makedirs(out_dir_docs, exist_ok=True)

    def clean_val(val: str, lang: str) -> str:
        if '{gun' in val and 'plural' in val:
            if lang == 'de': return '7 Tage gratis testen'
            if lang == 'ru': return 'Попробовать 7 дней бесплатно'
            if lang == 'cs': return 'Vyzkoušet na 7 dní zdarma'
            if lang == 'pl': return 'Wypróbuj 7 dni za darmo'
            if lang == 'ro': return 'Încearcă gratuit 7 zile'
            if lang == 'fr': return 'Essai gratuit de 7 jours'
            if lang == 'es': return 'Prueba gratis de 7 días'
            if lang == 'it': return 'Prova gratuita di 7 giorni'
            if lang == 'pt': return 'Experimenta 7 dias grátis'
            return 'Start 7-day free trial'
        if val == '{gun} gün ücretsiz dene':
            return '7 gün ücretsiz dene'
        if val == 'Start {gun}-day free trial':
            return 'Start 7-day free trial'
        return val

    # 1. Standard 2-letter CSV (key, en, tr, de, fr, es, it, cs, pt, ru, ro, pl)
    csv_standard = os.path.join(out_dir_proj, 'revenuecat_paywall_translations.csv')
    with open(csv_standard, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['key'] + LANGS)
        for rc_key, tr_key in rows:
            row = [rc_key]
            for l in LANGS:
                raw_val = data[l].get(tr_key, '')
                row.append(clean_val(raw_val, l))
            writer.writerow(row)

    # 2. BCP-47 Locale CSV (key, en-US, tr-TR, de-DE, ...)
    csv_bcp47 = os.path.join(out_dir_proj, 'revenuecat_paywall_translations_bcp47.csv')
    with open(csv_bcp47, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['key'] + [BCP47_MAP[l] for l in LANGS])
        for rc_key, tr_key in rows:
            row = [rc_key]
            for l in LANGS:
                raw_val = data[l].get(tr_key, '')
                row.append(clean_val(raw_val, l))
            writer.writerow(row)

    # Copy both to Documents folder for user convenience
    shutil.copy(csv_standard, os.path.join(out_dir_docs, 'revenuecat_paywall_translations.csv'))
    shutil.copy(csv_bcp47, os.path.join(out_dir_docs, 'revenuecat_paywall_translations_bcp47.csv'))

    print(f"Generated successfully:\n - {csv_standard}\n - {csv_bcp47}")
    print(f"Also copied to:\n - {out_dir_docs}/revenuecat_paywall_translations.csv")

if __name__ == '__main__':
    build_revenuecat_csvs()

