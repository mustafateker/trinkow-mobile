const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');
const adres = yukle('src/lib/apiAdres.ts');

function ortam(fetch, globals = {}) {
  let oturum = { erisimTokeni: 'eski', yenilemeTokeni: 'refresh', kullaniciId: 'a', oturumKimligi: 'oturum-a' };
  const api = yukle('src/lib/api.ts', {
    'expo-constants': { expoConfig: { hostUri: '192.168.1.22:8081' } },
    'react-native': { Platform: { OS: 'ios' } },
    '@/lib/apiAdres': adres,
    '@/lib/oturumDeposu': {
      oturumOku: async () => oturum && { ...oturum },
      oturumErisimTokeniGuncelle: async (token, refresh, yeniRefresh) => {
        if (oturum?.yenilemeTokeni === refresh) oturum = { ...oturum, erisimTokeni: token, yenilemeTokeni: yeniRefresh };
      },
      oturumGecersizKil: async (refresh) => { if (oturum?.yenilemeTokeni === refresh) oturum = null; },
    },
  }, { fetch, ...globals });
  return { api, oturum: () => oturum, degistir: (value) => { oturum = value; } };
}
const yanit = (body, status = 200) => new Response(JSON.stringify(body), { status });

test('Telefon, Android emülatörü ve özel API adresi', () => {
  assert.equal(adres.apiAdresiniCoz(undefined, '192.168.1.22:8081', 'ios'), 'http://192.168.1.22:8000');
  assert.equal(adres.apiAdresiniCoz(undefined, 'localhost:8081', 'android'), 'http://10.0.2.2:8000');
  assert.equal(adres.apiAdresiniCoz(' https://api.example.com/ ', undefined, 'ios'), 'https://api.example.com');
});

test('Test hesabı yalnız geliştirmede açıkça istendiğinde kullanılır', async () => {
  for (const dev of [true, false]) {
    const { api } = ortam(async (url, options) => {
      assert.ok(url.endsWith(dev ? '/auth/gelistirme-giris' : '/auth/giris'));
      assert.deepEqual(JSON.parse(options.body), { email: 'abc', sifre: 'x' });
      return yanit({ erisim_tokeni: 'access', yenileme_tokeni: 'refresh' });
    }, { __DEV__: dev, process: { env: { EXPO_PUBLIC_DEV_LOGIN: dev ? '1' : '0' } } });
    assert.equal((await api.girisYap('abc', 'x', true)).erisimTokeni, 'access');
  }
});

test('Google ID tokenı backend Google giriş ucuna taşınır', async () => {
  const { api } = ortam(async (url, options) => {
    assert.ok(url.endsWith('/auth/google'));
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), { id_token: 'google-id-token' });
    return yanit({ erisim_tokeni: 'google-access', yenileme_tokeni: 'google-refresh' });
  });

  const tokenlar = await api.googleIleGirisYap('google-id-token');
  assert.equal(tokenlar.erisimTokeni, 'google-access');
  assert.equal(tokenlar.yenilemeTokeni, 'google-refresh');
});

test('Google public OAuth yapılandırması backendden alınır', async () => {
  const { api } = ortam(async (url, options) => {
    assert.ok(url.endsWith('/auth/google/yapilandirma'));
    assert.equal(options.method, 'GET');
    return yanit({ web_istemci_kimligi: 'web.apps.googleusercontent.com' });
  });

  const yapilandirma = await api.googleYapilandirmasiniGetir();
  assert.equal(yapilandirma.webClientId, 'web.apps.googleusercontent.com');
});

test('Eşzamanlı 401 yanıtları tek yenileme yapar', async () => {
  let yenileme = 0;
  const { api, oturum } = ortam(async (url, options) => {
    if (url.endsWith('/token/yenile')) {
      yenileme++;
      await new Promise((r) => setTimeout(r, 10));
      return yanit({ erisim_tokeni: 'yeni', yenileme_tokeni: 'yeni-refresh' });
    }
    return options.headers.Authorization === 'Bearer yeni' ? yanit({ id: 'a' }) : yanit({}, 401);
  });
  await Promise.all([api.benKimim(), api.benKimim(), api.benKimim()]);
  assert.equal(yenileme, 1);
  assert.equal(oturum().erisimTokeni, 'yeni');
});

test('Yenileme sırasında bağlantı/503 hatası oturumu silmez', async () => {
  for (const ag of [true, false]) {
    const { api, oturum } = ortam(async (url) => {
      if (!url.endsWith('/token/yenile')) return yanit({}, 401);
      if (ag) throw new TypeError('offline');
      return yanit({}, 503);
    });
    await assert.rejects(api.benKimim());
    assert.ok(oturum());
  }
});

test('Yenileme veya tekrarlanan istek 401 ise oturum kapanır', async () => {
  for (const refreshOk of [true, false]) {
    const { api, oturum } = ortam(async (url) => url.endsWith('/token/yenile') && refreshOk ? yanit({ erisim_tokeni: 'yeni', yenileme_tokeni: 'yeni-refresh' }) : yanit({}, 401));
    await assert.rejects(api.benKimim(), (e) => e.durum === 401);
    assert.equal(oturum(), null);
  }
});

test('Eski isteğin 401 yanıtı yeni hesabı kapatmaz', async () => {
  let cevapla;
  const eskiYanit = new Promise((r) => { cevapla = r; });
  const state = ortam(() => eskiYanit);
  const istek = state.api.benKimim();
  await new Promise((r) => setImmediate(r));
  state.degistir({ erisimTokeni: 'b', yenilemeTokeni: 'b-refresh', kullaniciId: 'b', oturumKimligi: 'oturum-b' });
  cevapla(yanit({}, 401));
  await assert.rejects(istek);
  assert.equal(state.oturum().kullaniciId, 'b');
});

test('Oturumsuz ekran veri isteği göndermez', async () => {
  const state = ortam(() => { throw new Error('Ağa çıkılmamalı'); });
  state.degistir(null);
  await assert.rejects(state.api.benKimim(), (e) => e.hataKodu === 'OTURUM_YOK');
});

test('Katalog 304 yanıtını gövde okumadan kabul eder', async () => {
  const { api } = ortam(async () => new Response(null, { status: 304 }));
  assert.equal((await api.katalogGetir('v1')).degisti, false);
});

// --- rev3-gunluk-rutin.md §6 — geçmiş gün: `routinesGet` sorgulanan günü taşımalı ---

const tarih = yukle('src/lib/tarih.ts');

function revApiYukle(yakala) {
  return yukle(
    'src/lib/revApi.ts',
    {
      '@/lib/api': { istek: async (yol, secenekler) => { yakala(yol, secenekler); return { rutinler: [] }; } },
      '@/lib/tarih': tarih,
    },
  );
}

test('routinesGet: gün verilmezse yalnız bugünün sorgusu gider ("gun=" eklenmez)', async () => {
  let sonYol = null;
  const api = revApiYukle((yol) => { sonYol = yol; });
  await api.routinesGet();
  assert.match(sonYol, /^\/butce\/rutinler\?bugun=\d{4}-\d{2}-\d{2}$/);
  assert.doesNotMatch(sonYol, /[?&]gun=/);
});

test('routinesGet: geçmiş gün verilirse "gun=" sorgulanan günü taşır (vazgecilen_adet o güne ait gelsin)', async () => {
  let sonYol = null;
  const api = revApiYukle((yol) => { sonYol = yol; });
  await api.routinesGet('2026-09-10');
  assert.match(sonYol, /^\/butce\/rutinler\?bugun=\d{4}-\d{2}-\d{2}&gun=2026-09-10$/);
});

test('subscriptionPut: seçilen sağlayıcı kodunu backend gövdesine taşır', async () => {
  let sonIstek = null;
  const api = revApiYukle((yol, secenekler) => { sonIstek = { yol, secenekler }; });
  await api.subscriptionPut({
    id: 'youtube-1',
    ad: 'YouTube',
    saglayici: 'youtube',
    tutar_kurus: 5799,
    yenilenme_gunu: 17,
    odeme: 'kart',
    aktif: true,
  });
  assert.match(sonIstek.yol, /^\/butce\/abonelikler\/youtube-1\?bugun=\d{4}-\d{2}-\d{2}$/);
  assert.equal(sonIstek.secenekler.govde.saglayici, 'youtube');
});

test('subscriptionScheduleGet: bugünün abonelik takvimini ister', async () => {
  let sonIstek = null;
  const api = revApiYukle((yol, secenekler) => { sonIstek = { yol, secenekler }; });
  await api.subscriptionScheduleGet();
  assert.match(sonIstek.yol, /^\/butce\/abonelikler\/takvim\?bugun=\d{4}-\d{2}-\d{2}$/);
  assert.equal(sonIstek.secenekler.tokenGerekli, true);
});

test('subscriptionPaymentPut: yenilenen günü gider işleme isteğine taşır', async () => {
  let sonIstek = null;
  const api = revApiYukle((yol, secenekler) => { sonIstek = { yol, secenekler }; });
  await api.subscriptionPaymentPut('netflix-1', '2026-10-17');
  assert.match(sonIstek.yol, /^\/butce\/abonelikler\/netflix-1\/odeme\?bugun=\d{4}-\d{2}-\d{2}$/);
  assert.equal(sonIstek.secenekler.yontem, 'PUT');
  assert.equal(sonIstek.secenekler.govde.gun, '2026-10-17');
});
