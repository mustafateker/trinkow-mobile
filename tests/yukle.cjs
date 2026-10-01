const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// TypeScript'i mevcut derleyiciyle yükler; React Native sınırlarını testler enjekte eder.
exports.yukle = function yukle(dosya, stubs = {}, globals = {}) {
  const filename = path.resolve(__dirname, '..', dosya);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports, URL, Response, AbortController, setTimeout, clearTimeout,
    process: { env: {} }, __DEV__: true,
    require(name) {
      if (Object.hasOwn(stubs, name)) return stubs[name];
      throw new Error(`Eksik test bağımlılığı: ${name}`);
    }, ...globals,
  }, { filename });
  return module.exports;
};
