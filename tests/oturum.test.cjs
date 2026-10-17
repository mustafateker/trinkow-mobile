const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

function ortam(depo = new Map()) {
  const api = yukle('src/lib/oturumDeposu.ts', {
    'expo-secure-store': {
      getItemAsync: async (k) => depo.get(k) ?? null,
      setItemAsync: async (k, v) => { depo.set(k, v); },
      deleteItemAsync: async (k) => { depo.delete(k); },
    },
    'react-native': { Platform: { OS: 'ios' } },
  });
  return { api, depo };
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

test('bozuk güvenli depo kaydı temizlenir ve oturum kapalı açılır', async () => {
  const depo = new Map([['trinkow.oturum.v2', '{bozuk-json']]);
  const state = ortam(depo);
  assert.equal(await state.api.oturumOku(), null);
  assert.equal(state.depo.size, 0);
});
