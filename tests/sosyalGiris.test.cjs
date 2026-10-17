const { test } = require('node:test');
const assert = require('node:assert/strict');
const { yukle } = require('./yukle.cjs');

function ortam({ signIn, createAccount, presentExplicitSignIn }) {
  const yapilandirmalar = [];
  const google = {
    configure: (ayar) => yapilandirmalar.push(ayar),
    checkPlayServices: async () => {},
    signIn,
    createAccount,
    presentExplicitSignIn,
    signOut: async () => null,
  };
  const api = yukle('src/lib/sosyalGiris.ts', {
    'react-native-nitro-google-signin': {
      GoogleOneTapSignIn: google,
      isCancelledResponse: (yanit) => yanit.type === 'cancelled',
      isErrorWithCode: (hata) => typeof hata?.code === 'string',
      isNoSavedCredentialFoundResponse: (yanit) => yanit.type === 'noSavedCredentialFound',
      isSuccessResponse: (yanit) => yanit.type === 'success' && yanit.data,
      statusCodes: { SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED', PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE' },
    },
    'react-native': {
      Platform: { OS: 'android' },
      TurboModuleRegistry: { get: (ad) => ad === 'NitroModules' ? {} : null },
    },
    '@/content/metinler': { t: { 'giris.sosyal_yok': 'Hazır değil' } },
    '@/lib/toastBus': { toastGoster: () => {} },
  });
  return { api, yapilandirmalar };
}

test('Google hesabı ilk kez seçiliyorsa ID tokenı native akıştan döner', async () => {
  const state = ortam({
    signIn: async () => ({ type: 'noSavedCredentialFound', data: null }),
    createAccount: async () => ({ type: 'success', data: { idToken: 'imzali-google-tokeni' } }),
    presentExplicitSignIn: async () => ({ type: 'cancelled', data: null }),
  });

  assert.equal(await state.api.googleIleDevamEt('web.apps.googleusercontent.com'), 'imzali-google-tokeni');
  assert.equal(state.yapilandirmalar.length, 1);
  assert.equal(state.yapilandirmalar[0].webClientId, 'web.apps.googleusercontent.com');
});

test('Google hesap seçimi iptal edilirse hata göstermeden akış durur', async () => {
  const { api } = ortam({
    signIn: async () => ({ type: 'cancelled', data: null }),
    createAccount: async () => ({ type: 'cancelled', data: null }),
    presentExplicitSignIn: async () => ({ type: 'cancelled', data: null }),
  });

  assert.equal(await api.googleIleDevamEt('web.apps.googleusercontent.com'), null);
});

test('Backend geçerli Google Web OAuth istemci kimliği döndürmezse açık yapılandırma hatası verir', async () => {
  const { api } = ortam({
    signIn: async () => ({ type: 'cancelled', data: null }),
    createAccount: async () => ({ type: 'cancelled', data: null }),
    presentExplicitSignIn: async () => ({ type: 'cancelled', data: null }),
  });

  await assert.rejects(api.googleIleDevamEt(''), (hata) => hata.kod === 'yapilandirma');
});

test('native modül bulunmasa bile route yüklenir ve dokunuşta rebuild hatası verir', async () => {
  const api = yukle('src/lib/sosyalGiris.ts', {
    'react-native': {
      Platform: { OS: 'ios' },
      TurboModuleRegistry: { get: () => null },
    },
    '@/content/metinler': { t: { 'giris.sosyal_yok': 'Hazır değil' } },
    '@/lib/toastBus': { toastGoster: () => {} },
  });

  assert.equal(typeof api.googleIleDevamEt, 'function');
  assert.equal(api.sosyalSaglayicilar().join(','), 'apple');
  await assert.rejects(api.googleIleDevamEt('web.apps.googleusercontent.com'), (hata) => hata.kod === 'native-modul');
});
