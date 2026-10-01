const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

function ortam(depo = new Map(), eski = null) {
  let temizlendi = false;
  const api = yukle('src/lib/oturumDeposu.ts', {
    'expo-secure-store': {
      getItemAsync: async (k) => depo.get(k) ?? null,
      setItemAsync: async (k, v) => { depo.set(k, v); },
      deleteItemAsync: async (k) => { depo.delete(k); },
    },
    'expo-sqlite': { openDatabaseAsync: async () => ({
      getFirstAsync: async (sql) => sql.includes('sqlite_master') ? (eski ? { name: 'oturum' } : null) : eski,
      execAsync: async () => { temizlendi = true; },
    }) },
    'react-native': { Platform: { OS: 'ios' } },
    '@/db/sabitler': { DB_ADI: 'test.db' },
  });
  return { api, depo, temizlendi: () => temizlendi };
}

const kayit = { erisimTokeni:'a', yenilemeTokeni:'r', kullaniciId:'u', email:'u@example.com', kimlikSaglayici:'eposta' };

test('beni hatırlama kapalıysa oturum yalnız süreç belleğinde kalır', async () => {
  const ilk = ortam();
  await ilk.api.oturumYaz(kayit, false);
  assert.equal((await ilk.api.oturumOku()).email, 'u@example.com');
  assert.equal(ilk.depo.size, 0);
  assert.equal(await ortam(ilk.depo).api.oturumOku(), null);
});

test('beni hatırla güvenli depodan yeni süreçte geri yüklenir', async () => {
  const ilk = ortam();
  await ilk.api.oturumYaz(kayit, true);
  assert.equal(ilk.depo.size, 1);
  assert.equal((await ortam(ilk.depo).api.oturumOku()).kullaniciId, 'u');
});

test('eski SQLite oturumu güvenli depoya taşınıp açık metin kayıt temizlenir', async () => {
  const eski = { erisim_tokeni:'a', yenileme_tokeni:'r', kullanici_id:'u', email:'u@example.com', kimlik_saglayici:'eposta' };
  const state = ortam(new Map(), eski);
  assert.equal((await state.api.oturumOku()).email, 'u@example.com');
  assert.equal(state.depo.size, 1);
  assert.equal(state.temizlendi(), true);
});
