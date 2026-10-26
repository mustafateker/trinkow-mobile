const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

let varsayilanI18n = null;

/**
 * Lokalizasyon çekirdeği — testlerde Türkçe (kaynak dil) başlatılmış tek örnek.
 * `@/i18n/cekirdek` import eden her modüle stub verilmezse bu verilir; İngilizce
 * paket de kayıtlıdır, `i18n().diliAyarla('en')` ile İngilizce denenir. Başka bir
 * dil için önce `i18n().paketKaydet(...)`.
 */
function i18n() {
  if (!varsayilanI18n) {
    varsayilanI18n = exports.yukle('src/i18n/cekirdek.ts');
    varsayilanI18n.paketKaydet('tr', exports.yukle('src/i18n/kaynaklar/tr.ts').default);
    varsayilanI18n.paketKaydet('en', exports.yukle('src/i18n/kaynaklar/en.ts').default);
    varsayilanI18n.diliAyarla('tr');
  }
  return varsayilanI18n;
}
exports.i18n = i18n;

/** Göreli import'u (./x, ../y) proje köküne göre .ts/.tsx dosya yoluna çevirir. */
function goreliCoz(kaynakDosya, ad) {
  const taban = path.resolve(path.dirname(kaynakDosya), ad);
  for (const aday of [`${taban}.ts`, `${taban}.tsx`, path.join(taban, 'index.ts')]) {
    if (fs.existsSync(aday)) return path.relative(path.resolve(__dirname, '..'), aday);
  }
  return null;
}

function calistirTypeScript(filename, stubs, globals, onRequire) {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports, URL, Response, AbortController, setTimeout, clearTimeout,
    process: { env: {} }, __DEV__: true,
    require(name) {
      if (Object.hasOwn(stubs, name)) return stubs[name];
      const imported = onRequire?.(name);
      if (imported !== undefined) return imported;
      throw new Error(`Eksik test bağımlılığı: ${name}`);
    }, ...globals,
  }, { filename });
  return module.exports;
}

// TypeScript'i mevcut derleyiciyle yükler; React Native sınırlarını testler enjekte eder.
// `@/i18n/cekirdek` paylaşılan örneğe, metin ve yerelleştirme modülleri gerçek
// dosyalarına, göreli import'lar (./x) aynı stub'larla otomatik yüklenir.
exports.yukle = function yukle(dosya, stubs = {}, globals = {}) {
  const filename = path.resolve(__dirname, '..', dosya);
  const testDependencies = {
    '@/content/metinler': 'src/content/metinler.ts',
    '@/lib/yerellestirme': 'src/lib/yerellestirme.ts',
  };
  function yukleBagimlilik(name) {
    if (name === '@/i18n/cekirdek') return i18n();
    if (Object.hasOwn(testDependencies, name)) return yukle(testDependencies[name], stubs, globals);
    const goreli = name.startsWith('.') ? goreliCoz(filename, name) : null;
    if (goreli) return yukle(goreli, stubs, globals);
    return undefined;
  }
  return calistirTypeScript(filename, stubs, globals, yukleBagimlilik);
};
