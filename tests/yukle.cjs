const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

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
exports.yukle = function yukle(dosya, stubs = {}, globals = {}) {
  const filename = path.resolve(__dirname, '..', dosya);
  const testDependencies = {
    '@/content/metinler': path.resolve(__dirname, '..', 'src/content/metinler.ts'),
    '@/content/metinler.en': path.resolve(__dirname, '..', 'src/content/metinler.en.ts'),
    '@/lib/yerellestirme': path.resolve(__dirname, '..', 'src/lib/yerellestirme.ts'),
  };
  function yukleBagimlilik(name) {
    const dependency = testDependencies[name];
    if (!dependency) return undefined;
    const loaded = calistirTypeScript(dependency, stubs, globals, yukleBagimlilik);
    if (name === '@/lib/yerellestirme') loaded.yerellestirmeAyarla({ dil: 'tr' });
    return loaded;
  }
  return calistirTypeScript(filename, stubs, globals, yukleBagimlilik);
};
