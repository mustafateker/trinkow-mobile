/**
 * Dil paketlerinin tutarlılığı — ActivationKing'de disiplinle tutulan
 * "her dilde aynı anahtarlar" kuralı burada OTOMATİK denetlenir:
 * anahtar kümesi, yer tutucular, çoğul dalları, takvim ve katalog.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { yukle } = require('./yukle.cjs');

const KLASOR = path.resolve(__dirname, '..', 'src/i18n/kaynaklar');
const cekirdek = yukle('src/i18n/cekirdek.ts');
const paketler = Object.fromEntries(
  fs.readdirSync(KLASOR)
    .filter((f) => /^[a-z]{2}\.ts$/.test(f))
    .map((f) => [f.slice(0, 2), yukle(`src/i18n/kaynaklar/${f}`).default]),
);
const tr = paketler.tr;
const trAnahtarlar = Object.keys(tr.metinler).sort();

/* ---------------------------------------------------- ICU alt kümesi ayrıştırma */

function kapanis(s, ac) {
  let d = 0;
  for (let j = ac; j < s.length; j += 1) {
    if (s[j] === '{') d += 1;
    else if (s[j] === '}') { d -= 1; if (d === 0) return j; }
  }
  return -1;
}

function secenekler(s) {
  const m = new Map();
  let i = 0;
  while (i < s.length) {
    const ac = s.indexOf('{', i);
    if (ac < 0) { if (s.slice(i).trim()) throw new Error(`seçenek dışında metin: "${s.slice(i).trim()}"`); break; }
    const anahtar = s.slice(i, ac).trim();
    if (!anahtar) throw new Error('adsız seçenek');
    const k = kapanis(s, ac);
    if (k < 0) throw new Error('kapanmamış seçenek');
    m.set(anahtar, s.slice(ac + 1, k));
    i = k + 1;
  }
  return m;
}

/** Şablonu ayrıştırır: { argumanlar: Set, cogullar: [Map<kategori, dal>] }; bozuksa hata fırlatır. */
function ayristir(sablon, sonuc = { argumanlar: new Set(), cogullar: [] }) {
  let i = 0;
  while (i < sablon.length) {
    const c = sablon[i];
    if (c === '}') throw new Error('fazla "}"');
    if (c !== '{') { i += 1; continue; }
    const k = kapanis(sablon, i);
    if (k < 0) throw new Error('kapanmamış "{"');
    const ic = sablon.slice(i + 1, k);
    const v = ic.indexOf(',');
    if (v < 0) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(ic.trim())) throw new Error(`geçersiz yer tutucu "{${ic}}"`);
      sonuc.argumanlar.add(ic.trim());
    } else {
      const ad = ic.slice(0, v).trim();
      const kalan = ic.slice(v + 1);
      const v2 = kalan.indexOf(',');
      const tur = (v2 < 0 ? kalan : kalan.slice(0, v2)).trim();
      if (tur !== 'plural' && tur !== 'select') throw new Error(`bilinmeyen biçim "${tur}"`);
      sonuc.argumanlar.add(ad);
      const dallar = secenekler(v2 < 0 ? '' : kalan.slice(v2 + 1));
      if (!dallar.has('other')) throw new Error(`"${ad}" ${tur} bloğunda "other" dalı yok`);
      if (tur === 'plural') sonuc.cogullar.push(dallar);
      for (const dal of dallar.values()) ayristir(dal, sonuc);
    }
    i = k + 1;
  }
  return sonuc;
}

/** Eş anlamlı yer tutucular: bir dil {ayIcinde} ("Eylül'de"), diğeri {ay} ("September") kullanabilir. */
const ESLER = { ayIcinde: 'ay' };
const normal = (kume) => new Set([...kume].map((a) => ESLER[a] ?? a));

/** Dilin tam sayılarda kullandığı çoğul kategorileri (0..200). */
function gerekenKategoriler(dil) {
  const k = new Set();
  for (let n = 0; n <= 200; n += 1) k.add(cekirdek.cogulKategorisi(dil, n));
  return k;
}

/* ------------------------------------------------------------------- testler */

test('desteklenen 11 dilin hepsinin paketi var ve uygulamaya kaydediliyor', () => {
  const diller = Array.from(cekirdek.DILLER, (d) => d.kod).sort();
  assert.deepEqual(Object.keys(paketler).sort(), diller, 'src/i18n/kaynaklar/<dil>.ts eksik');
  const kayit = fs.readFileSync(path.join(KLASOR, 'index.ts'), 'utf8');
  for (const dil of diller) {
    assert.match(kayit, new RegExp(`paketKaydet\\('${dil}', ${dil}\\)`), `index.ts "${dil}" paketini kaydetmiyor`);
  }
});

test('Türkçe kaynak paket ayrıştırılabilir ve boş metin içermez', () => {
  for (const [anahtar, deger] of Object.entries(tr.metinler)) {
    assert.ok(typeof deger === 'string' && deger.trim(), `tr: "${anahtar}" boş`);
    assert.doesNotThrow(() => ayristir(deger), `tr: "${anahtar}" şablonu bozuk`);
  }
});

for (const [dil, paket] of Object.entries(paketler)) {
  if (dil === 'tr') continue;

  test(`${dil}: anahtar kümesi Türkçe ile birebir aynı`, () => {
    const anahtarlar = Object.keys(paket.metinler).sort();
    const eksik = trAnahtarlar.filter((k) => !(k in paket.metinler));
    const fazla = anahtarlar.filter((k) => !(k in tr.metinler));
    assert.deepEqual({ eksik, fazla }, { eksik: [], fazla: [] });
  });

  test(`${dil}: her metin dolu, şablonu geçerli, yer tutucuları Türkçe ile aynı`, () => {
    const hatalar = [];
    for (const anahtar of trAnahtarlar) {
      const deger = paket.metinler[anahtar];
      if (typeof deger !== 'string' || !deger.trim()) { hatalar.push(`${anahtar}: boş`); continue; }
      let a;
      try { a = ayristir(deger); } catch (e) { hatalar.push(`${anahtar}: ${e.message}`); continue; }
      const beklenen = normal(ayristir(tr.metinler[anahtar]).argumanlar);
      const gelen = normal(a.argumanlar);
      const eksik = [...beklenen].filter((x) => !gelen.has(x));
      const fazla = [...gelen].filter((x) => !beklenen.has(x));
      if (eksik.length || fazla.length) hatalar.push(`${anahtar}: eksik {${eksik.join(', ')}} fazla {${fazla.join(', ')}}`);
    }
    assert.deepEqual(hatalar, []);
  });

  test(`${dil}: çoğul blokları dilin bütün kategorilerini taşır`, () => {
    const gereken = gerekenKategoriler(dil);
    const hatalar = [];
    for (const anahtar of trAnahtarlar) {
      const deger = paket.metinler[anahtar];
      let a;
      try { a = ayristir(deger); } catch { continue; }
      for (const dallar of a.cogullar) {
        // Eksik kategori sessizce 'other'a düşer → "1 days", "5 дня" gibi dilbilgisi hatası olur.
        const eksik = [...gereken].filter((k) => !dallar.has(k));
        if (eksik.length) hatalar.push(`${anahtar}: eksik ${eksik.join(', ')}`);
      }
    }
    assert.deepEqual(hatalar, []);
  });

  test(`${dil}: örnek değerlerle biçimlenince çözülmemiş yer tutucu kalmaz`, () => {
    const hatalar = [];
    for (const anahtar of trAnahtarlar) {
      const deger = paket.metinler[anahtar];
      let a;
      try { a = ayristir(deger); } catch { continue; }
      for (const n of [0, 1, 2, 5, 21]) {
        const degerler = Object.fromEntries([...a.argumanlar].map((x) => [x, n]));
        const cikti = cekirdek.bicimle(deger, degerler, dil);
        if (/[{}]/.test(cikti)) { hatalar.push(`${anahtar} (n=${n}): ${cikti}`); break; }
      }
    }
    assert.deepEqual(hatalar, []);
  });
}

test('kayıt onay cümlelerinde her dilde tek bir **bağlantı** vardır', () => {
  for (const [dil, paket] of Object.entries(paketler)) {
    for (const anahtar of ['kayit.onay.kosullar_baglanti', 'kayit.onay.gizlilik_baglanti']) {
      const eslesme = (paket.metinler[anahtar] ?? '').match(/\*\*[^*]+\*\*/g) ?? [];
      assert.equal(eslesme.length, 1, `${dil}: "${anahtar}" tek bir **…** bağlantısı taşımalı`);
    }
  }
});

test('takvim, gün ekleri ve katalog her pakette eksiksiz', () => {
  const katalogKimlikleri = Object.keys(tr.katalog).sort();
  for (const [dil, paket] of Object.entries(paketler)) {
    const tk = paket.takvim;
    for (const [alan, uzunluk] of [['aylar', 12], ['aylarTarih', 12], ['aylarKisa', 12], ['ayIcinde', 12], ['gunler', 7], ['haftaGunKisa', 7], ['haftaGunMikro', 7]]) {
      assert.equal(tk[alan]?.length, uzunluk, `${dil}: takvim.${alan} ${uzunluk} eleman olmalı`);
      assert.ok(tk[alan].every((x) => typeof x === 'string' && x.trim()), `${dil}: takvim.${alan} boş eleman içeriyor`);
    }
    for (let gun = 1; gun <= 31; gun += 1) {
      for (const f of ['gunBulunma', 'gunIyelik']) {
        const s = paket[f](gun);
        assert.ok(typeof s === 'string' && s.includes(String(gun)), `${dil}: ${f}(${gun}) = "${s}"`);
      }
    }
    assert.deepEqual(Object.keys(paket.katalog).sort(), katalogKimlikleri, `${dil}: katalog kimlikleri`);
    assert.ok(Object.values(paket.katalog).every((x) => typeof x === 'string' && x.trim()), `${dil}: boş katalog adı`);
  }
});

test('Türkçe gün ekleri ünlü uyumuna uyar (eski tarih.ts davranışı)', () => {
  assert.deepEqual([1, 2, 3, 6, 9, 10, 15, 20, 30].map((g) => tr.gunBulunma(g)),
    ["1'inde", "2'sinde", "3'ünde", "6'sında", "9'unda", "10'unda", "15'inde", "20'sinde", "30'unda"]);
  assert.deepEqual([1, 6, 10, 15].map((g) => tr.gunIyelik(g)), ["1'i", "6'sı", "10'u", "15'i"]);
});
