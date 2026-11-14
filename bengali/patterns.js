/*
 * Bengali verb pattern engine: Standard Colloquial Bengali (চলিত), written (Bengali script) and romanized.
 *
 *   express({ bn: 'করা', rom: 'kora', tag: '' }) -> { bn, rom, rows }
 *
 * Every form is built twice, in parallel: a script stem is joined with script endings, and a
 * romanized stem with romanized endings. There is no script-to-Latin converter, so the two spellings
 * can only drift apart if an ending table is wrong (the tests compare their consonant skeletons).
 *
 * ENTRY (see verbs.js)
 *   bn   the verbal noun (the dictionary form) in Bengali script: করা, বলা, খাওয়া, ঘুমানো. A compound is
 *        several words (noun/adjective + করা / হওয়া / দেওয়া ...); only the LAST word is conjugated, the
 *        others are copied in front of it.
 *   rom  its romanization, with the same number of words.
 *   tag  'v' when the root vowel ে/ো is raised to ি/ু in most forms (শেখা -> শিখি, শোনা -> শুনি);
 *        '' otherwise.
 *
 * PERSONS. Bengali verbs do not change for number or gender; they change for person and honorific level.
 * rows[key] is an array of SIX cells, one per pill, in this order:
 *   আমি / আমরা, তুই, তুমি / তোমরা, আপনি / আপনারা, সে / তারা, তিনি / তাঁরা
 * A cell is { bn, rom }, or null where that person has no such form (the imperative has no 1st person and
 * no ordinary 3rd person in the negative).
 *
 * ROMANIZATION (simplified phonetic; initial ক্ষ is written kkh): অ/inherent o, আ a, ই ঈ i, উ ঊ u, এ e, ঐ oi, ও o, ঔ ou; ক k, খ kh,
 * গ g, ঘ gh, ঙ ng, চ ch, ছ chh, জ j, ঝ jh, ট t, ঠ th, ড d, ঢ dh, ত t, থ th, দ d, ধ dh, ন n, প p, ফ ph, ব b,
 * ভ bh, ম m, য j, র r, ল l, শ ষ sh, স sh (s in clusters), হ h, ড় r, ঢ় rh, য় y. A final inherent vowel that
 * is pronounced is written o (করল korlo, করব korbo, করত korto, করছ korchho).
 *
 * The 17 keys, in order (examples for করা):
 *   pres      করি, করিস, করো, করেন, করে, করেন
 *   presCont  করছি, করছিস, করছ, করছেন, করছে, করছেন
 *   past      করলাম, করলি, করলে, করলেন, করল, করলেন
 *   pastCont  করছিলাম, করছিলি, করছিলে, করছিলেন, করছিল, করছিলেন
 *   pastHab   করতাম, করতিস, করতে, করতেন, করত, করতেন
 *   presPerf  করেছি, করেছিস, করেছ, করেছেন, করেছে, করেছেন
 *   pastPerf  করেছিলাম, করেছিলি, করেছিলে, করেছিলেন, করেছিল, করেছিলেন
 *   fut       করব, করবি, করবে, করবেন, করবে, করবেন
 *   negPres   present + না (করি না ...)
 *   negPast   present + নি (করিনি, করিসনি, করোনি, করেননি, করেনি, করেননি): "did not / has not"
 *   negFut    future + না
 *   imp       —, কর, করো, করুন, করুক, করুন
 *   impNeg    —, করিস না, করো না, করবেন না, —, করবেন না
 *   cond      করলে (if), the same in all six cells
 *   noun      করা (verbal noun)
 *   inf       করতে (infinitive)
 *   conj      করে (conjunctive: having done / and)
 * The spelling follows the short style (করল, করব, করত, করছ, করেছ); the romanization shows the final o.
 *
 * STEM CLASSES (the stem is the verbal noun without its ending)
 *   consonant  কর বল দেখ কিন   verbal noun in া. Endings -ি -িস -ো -েন -ে; the continuous, past, habitual,
 *              perfect and future use the "raised" stem (with tag v: কিন; else the same stem). Only the
 *              present 2nd familiar/honorific/3rd (কেনো, কেনেন, কেনে) and the bare imperative keep কেন.
 *   -ানো       ঘুমা দেখা শেখা   derived verbs. Present ঘুমাই ঘুমাস ঘুমাও ঘুমান ঘুমায়; the perfect and
 *              conjunctive change া to ি: ঘুমিয়েছি, ঘুমিয়ে (with v: শিখিয়েছি).
 *   vowel      খা যা পা দে নে হ শো ধো   verbal noun in ওয়া / োয়া; irregular, see SPECIAL. Other roots in
 *              া (চা গা ...) follow the 'চাওয়া' pattern: চাই, চাইলাম, চেয়েছি, চাইব.
 * Irregular: আসা (এলাম, এসেছি, এসো, আয়), আনা (এনেছি, এনে), আঁকা (এঁকেছি), যাওয়া খাওয়া পাওয়া
 * দেওয়া নেওয়া হওয়া শোয়া ধোয়া.
 *
 * Limits (not modelled, by design): the verbs whose subject is in the genitive or dative (আমার ভয় লাগে)
 * are shown with the person as the subject; ো-final roots (এগোনো) and the vector compounds (করে ফেলা)
 * are not supported, nor are other vowel-final roots (ছোঁয়া touch, বওয়া carry) beyond the table in SPECIAL (যাওয়া খাওয়া
 * পাওয়া দেওয়া নেওয়া হওয়া শোয়া ধোয়া and the চাওয়া type); the 3rd-person imperative of the negative has no form here; the literary (সাধু)
 * forms and the future imperative (কোরো, খেয়ো) are not generated.
 *
 * Under Node this file exports { express, ROW_KEYS }; in the browser it defines the global `Bengali`.
 */
(function (global) {
  'use strict';

  const { words } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const ROW_KEYS = [
    'pres', 'presCont', 'past', 'pastCont', 'pastHab', 'presPerf', 'pastPerf', 'fut',
    'negPres', 'negPast', 'negFut', 'imp', 'impNeg', 'cond', 'noun', 'inf', 'conj',
  ];

  const fail = message => { throw new Error(`bengali express(): ${message}`); };

  // ---- Text pieces: { bn, rom } ----------------------------------------------------------------
  const P = (bn, rom) => ({ bn: bn.normalize('NFC'), rom });
  const cat = (...ps) => P(ps.map(p => p.bn).join(''), ps.map(p => p.rom).join(''));
  const sp = (...ps) => P(ps.map(p => p.bn).join(' '), ps.map(p => p.rom).join(' '));
  const E = list => list.map(([bn, rom]) => P(bn, rom));

  // য় is য + nukta (NFC); written with escapes so the file cannot change it
  const YA = '\u09AF\u09BC';

  // ---- Endings, in person order: আমি তুই তুমি আপনি সে তিনি ---------------------------------------------
  const PRES_C = E([['ি', 'i'], ['িস', 'is'], ['ো', 'o'], ['েন', 'en'], ['ে', 'e'], ['েন', 'en']]);
  const PRES_V = E([['ই', 'i'], ['স', 's'], ['ও', 'o'], ['ন', 'n'], [YA, 'y'], ['ন', 'n']]);
  const CONT_C = E([['ছি', 'chhi'], ['ছিস', 'chhis'], ['ছ', 'chho'], ['ছেন', 'chhen'], ['ছে', 'chhe'], ['ছেন', 'chhen']]);
  const CONT_V = E([['চ্ছি', 'chchhi'], ['চ্ছিস', 'chchhis'], ['চ্ছ', 'chchho'], ['চ্ছেন', 'chchhen'], ['চ্ছে', 'chchhe'], ['চ্ছেন', 'chchhen']]);
  const PCONT_C = E([['ছিলাম', 'chhilam'], ['ছিলি', 'chhili'], ['ছিলে', 'chhile'], ['ছিলেন', 'chhilen'], ['ছিল', 'chhilo'], ['ছিলেন', 'chhilen']]);
  const PCONT_V = E([['চ্ছিলাম', 'chchhilam'], ['চ্ছিলি', 'chchhili'], ['চ্ছিলে', 'chchhile'], ['চ্ছিলেন', 'chchhilen'], ['চ্ছিল', 'chchhilo'], ['চ্ছিলেন', 'chchhilen']]);
  const PAST = E([['লাম', 'lam'], ['লি', 'li'], ['লে', 'le'], ['লেন', 'len'], ['ল', 'lo'], ['লেন', 'len']]);
  const HAB = E([['তাম', 'tam'], ['তিস', 'tis'], ['তে', 'te'], ['তেন', 'ten'], ['ত', 'to'], ['তেন', 'ten']]);
  const PERF_C = E([['েছি', 'echhi'], ['েছিস', 'echhis'], ['েছ', 'echho'], ['েছেন', 'echhen'], ['েছে', 'echhe'], ['েছেন', 'echhen']]);
  const PERF_V = E([[YA + 'েছি', 'yechhi'], [YA + 'েছিস', 'yechhis'], [YA + 'েছ', 'yechho'], [YA + 'েছেন', 'yechhen'], [YA + 'েছে', 'yechhe'], [YA + 'েছেন', 'yechhen']]);
  const PPERF_C = E([['েছিলাম', 'echhilam'], ['েছিলি', 'echhili'], ['েছিলে', 'echhile'], ['েছিলেন', 'echhilen'], ['েছিল', 'echhilo'], ['েছিলেন', 'echhilen']]);
  const PPERF_V = E([[YA + 'েছিলাম', 'yechhilam'], [YA + 'েছিলি', 'yechhili'], [YA + 'েছিলে', 'yechhile'], [YA + 'েছিলেন', 'yechhilen'], [YA + 'েছিল', 'yechhilo'], [YA + 'েছিলেন', 'yechhilen']]);
  const FUT = E([['ব', 'bo'], ['বি', 'bi'], ['বে', 'be'], ['বেন', 'ben'], ['বে', 'be'], ['বেন', 'ben']]);
  const NA = P('না', 'na');
  const NI = P('নি', 'ni');
  const LE = P('লে', 'le'), TE = P('তে', 'te');

  // ---- Raising: ে -> ি, ো -> ু (and an initial এ / ও) in the first syllable --------------------------
  function raise(p) {
    const chars = [...p.bn];
    const at = chars.findIndex(c => c === 'ে' || c === 'ো');
    let bn, kind;
    if (at >= 0) {
      kind = chars[at] === 'ে' ? 'e' : 'o';
      chars[at] = kind === 'e' ? 'ি' : 'ু';
      bn = chars.join('');
    } else if (chars[0] === 'এ') { kind = 'e'; bn = 'ই' + chars.slice(1).join(''); }
    else if (chars[0] === 'ও') { kind = 'o'; bn = 'উ' + chars.slice(1).join(''); }
    else fail(`the tag v needs a root vowel ে/ো (or an initial এ/ও), but "${p.bn}" has none`);
    const i = p.rom.indexOf(kind);
    if (i < 0) fail(`cannot raise the romanization "${p.rom}" of "${p.bn}" (no "${kind}" in it)`);
    return P(bn, p.rom.slice(0, i) + (kind === 'e' ? 'i' : 'u') + p.rom.slice(i + 1));
  }
  // the final া / a of a stem becomes ি / i (ঘুমা -> ঘুমি)
  const alefToI = p => P(p.bn.slice(0, -1) + 'ি', p.rom.slice(0, -1) + 'i');
  const alefToE = p => P(p.bn.slice(0, -1) + 'ে', p.rom.slice(0, -1) + 'e');
  // A one-syllable root with আ (ডাক, রাখ, জান, ভাব, আন) has এ in the perfect and the conjunctive:
  // ডেকেছি ডেকে, রেখেছি, জেনেছি, ভেবেছি, এনেছি. Returns null for any other root.
  function aToE(p) {
    const chars = [...p.bn];
    const vowels = chars.filter(c => /[\u0985-\u0994\u09BE-\u09CC]/.test(c));
    if (vowels.length !== 1 || (vowels[0] !== 'আ' && vowels[0] !== 'া')) return null;
    const at = chars.indexOf(vowels[0]);
    chars[at] = vowels[0] === 'আ' ? 'এ' : 'ে';
    const i = p.rom.indexOf('a');
    if (i < 0) return null;
    return P(chars.join(''), p.rom.slice(0, i) + 'e' + p.rom.slice(i + 1));
  }

  // ---- Irregular vowel-stem verbs, keyed by the last word of the verbal noun -----------------------
  // pres: six explicit present forms; cont/past/hab/perf/fut: the stems before the usual endings;
  // futTui: the 'তুই' future when it is not stem + বি; apni/she: the imperative for আপনি and সে.
  const V = (bn, rom) => P(bn, rom);
  const SPECIAL = {
    'যাওয়া': { root: V('যা', 'ja'), cont: V('যা', 'ja'), past: V('গে', 'ge'), hab: V('যে', 'je'), perf: V('গি', 'gi'), fut: V('যা', 'ja'), apni: V('যান', 'jan'), she: V('যাক', 'jak') },
    'খাওয়া': { root: V('খা', 'kha'), cont: V('খা', 'kha'), past: V('খে', 'khe'), hab: V('খে', 'khe'), perf: V('খে', 'khe'), fut: V('খা', 'kha'), apni: V('খান', 'khan'), she: V('খাক', 'khak') },
    'পাওয়া': { root: V('পা', 'pa'), cont: V('পা', 'pa'), past: V('পে', 'pe'), hab: V('পে', 'pe'), perf: V('পে', 'pe'), fut: V('পা', 'pa'), apni: V('পান', 'pan'), she: V('পাক', 'pak') },
    'দেওয়া': {
      pres: [V('দিই', 'dii'), V('দিস', 'dis'), V('দাও', 'dao'), V('দেন', 'den'), V('দেয়', 'dey'), V('দেন', 'den')],
      root: V('দে', 'de'), cont: V('দি', 'di'), past: V('দি', 'di'), hab: V('দি', 'di'), perf: V('দি', 'di'), fut: V('দে', 'de'),
      futTui: V('দিবি', 'dibi'), tui: V('দে', 'de'), apni: V('দিন', 'din'), she: V('দিক', 'dik'),
    },
    'নেওয়া': {
      pres: [V('নিই', 'nii'), V('নিস', 'nis'), V('নাও', 'nao'), V('নেন', 'nen'), V('নেয়', 'ney'), V('নেন', 'nen')],
      root: V('নে', 'ne'), cont: V('নি', 'ni'), past: V('নি', 'ni'), hab: V('নি', 'ni'), perf: V('নি', 'ni'), fut: V('নে', 'ne'),
      futTui: V('নিবি', 'nibi'), tui: V('নে', 'ne'), apni: V('নিন', 'nin'), she: V('নিক', 'nik'),
    },
    'হওয়া': {
      pres: [V('হই', 'hoi'), V('হস', 'hos'), V('হও', 'hoo'), V('হন', 'hon'), V('হয়', 'hoy'), V('হন', 'hon')],
      root: V('হ', 'ho'), cont: V('হ', 'ho'), past: V('হ', 'ho'), hab: V('হ', 'ho'), perf: V('হ', 'ho'), fut: V('হ', 'ho'),
      tui: V('হ', 'ho'), apni: V('হোন', 'hon'), she: V('হোক', 'hok'),
    },
    'শোয়া': {
      pres: [V('শুই', 'shui'), V('শুস', 'shus'), V('শোও', 'shoo'), V('শোন', 'shon'), V('শোয়', 'shoy'), V('শোন', 'shon')],
      root: V('শো', 'sho'), cont: V('শু', 'shu'), past: V('শু', 'shu'), hab: V('শু', 'shu'), perf: V('শু', 'shu'), fut: V('শো', 'sho'),
      tui: V('শো', 'sho'), apni: V('শোন', 'shon'), she: V('শোক', 'shok'),
    },
    'ধোয়া': {
      pres: [V('ধুই', 'dhui'), V('ধুস', 'dhus'), V('ধোও', 'dhoo'), V('ধোন', 'dhon'), V('ধোয়', 'dhoy'), V('ধোন', 'dhon')],
      root: V('ধো', 'dho'), cont: V('ধু', 'dhu'), past: V('ধু', 'dhu'), hab: V('ধু', 'dhu'), perf: V('ধু', 'dhu'), fut: V('ধো', 'dho'),
      tui: V('ধো', 'dho'), apni: V('ধুন', 'dhun'), she: V('ধুক', 'dhuk'),
    },
  };
  SPECIAL['শোওয়া'] = SPECIAL['শোয়া'];
  SPECIAL['ধোওয়া'] = SPECIAL['ধোয়া'];
  // keys in NFC (য় is য + nukta)
  for (const k of Object.keys(SPECIAL)) {
    const fixed = k.normalize('NFC');
    if (fixed !== k) { SPECIAL[fixed] = SPECIAL[k]; delete SPECIAL[k]; }
  }

  // consonant stems with a different perfect/conjunctive stem or other irregular parts
  const IRREGULAR_C = {
    'আসা': { past: V('এ', 'e'), tui: V('আয়', 'ay'), tumi: V('এসো', 'esho') },
    // the fused compound ভালো + বাসা: the last syllable changes (ভালোবেসেছি)
    'ভালোবাসা': { perf: V('ভালোবেস', 'bhalobesh') },
  };

  // -ানো verbs whose perfect and conjunctive end in -ে, not -িয়ে (কামড়ে, বদলে, সামলে, আটকে, উল্টে). The class is
  // lexical: ঘুমানো, চালানো, ছড়ানো and most others take -িয়ে (ঘুমিয়ে, চালিয়ে, ছড়িয়ে).
  const ANO_E = new Set(`কামড়ানো আঁচড়ানো আছড়ানো থেঁতলানো হিঁচড়ানো হাতড়ানো কুঁচকানো ছিটকানো মচকানো চমকানো ঝলকানো
    ধমকানো উপড়ানো চুলকানো ফসকানো ছলকানো ঝাপটানো আটকানো চটকানো দুমড়ানো নিংড়ানো পিছলানো ঝলসানো কাতরানো উথলানো
    সামলানো বদলানো সাঁতলানো উল্টানো পাল্টানো মোচড়ানো শুধরানো আওড়ানো উসকানো উস্কানো পৌঁছানো দৌড়ানো উপচানো চাপড়ানো`.split(/\s+/).map(w => w.normalize('NFC')));

  // ---- Reading the entry ---------------------------------------------------------------------------
  const BENGALI = /^[\u0980-\u09FF]+$/;

  function parse(entry) {
    if (!entry || typeof entry !== 'object') fail('the entry must be an object { bn, rom, tag }');
    const bn = typeof entry.bn === 'string' ? entry.bn.normalize('NFC') : entry.bn;
    const rom = entry.rom;
    const tag = entry.tag === undefined ? '' : entry.tag;
    for (const [name, value] of [['bn', bn], ['rom', rom]]) {
      if (typeof value !== 'string' || !value.trim()) fail(`"${name}" must be a non-empty string`);
    }
    if (!['', 'v'].includes(tag)) fail(`unknown tag ${JSON.stringify(tag)} for "${bn}" (expected "v" or "")`);
    const bnWords = words(bn), romWords = words(rom);
    if (bnWords.length !== romWords.length) fail(`"${bn}" and "${rom}" have different numbers of words`);
    for (const w of bnWords) if (!BENGALI.test(w)) fail(`"${w}" in "${bn}" is not written in Bengali script`);
    const lead = bnWords.slice(0, -1).map((w, i) => P(w, romWords[i]));
    const lastBn = bnWords[bnWords.length - 1], lastRom = romWords[romWords.length - 1];
    const display = P(bnWords.join(' '), romWords.join(' '));

    let kind, stem, extra = {};
    if (lastBn.endsWith('ানো')) {
      if (!lastRom.endsWith('ano')) fail(`the romanization "${lastRom}" of "${lastBn}" must end in ano`);
      kind = 'ano';
      stem = P(lastBn.slice(0, -2), lastRom.slice(0, -2));            // ঘুমা, ghuma
      if (stem.bn.length < 2) fail(`"${lastBn}" is too short to be a verb`);
    } else if (lastBn.endsWith('ওয়া') || lastBn.endsWith('ো' + YA + 'া')) {
      let root;
      if (lastBn.endsWith('ওয়া')) {
        if (!lastRom.endsWith('oa')) fail(`the romanization "${lastRom}" of "${lastBn}" must end in oa`);
        root = P(lastBn.slice(0, -4), lastRom.slice(0, -2));          // খা, kha
      } else {
        if (!/(oya|oa)$/.test(lastRom)) fail(`the romanization "${lastRom}" of "${lastBn}" must end in oya or oa`);
        root = P(lastBn.slice(0, -3), lastRom.replace(/(ya|a)$/, ''));   // শো, sho
      }
      if (Object.hasOwn(SPECIAL, lastBn)) { kind = 'special'; extra = SPECIAL[lastBn]; stem = extra.root; }
      else if (root.bn.endsWith('া') && root.rom.endsWith('a')) { kind = 'itype'; stem = root; }
      else fail(`the vowel-final verb "${lastBn}" is not supported (only roots in া and the irregular table)`);
    } else if (lastBn.endsWith('া')) {
      if (!lastRom.endsWith('a')) fail(`the romanization "${lastRom}" of "${lastBn}" must end in a`);
      kind = 'cons';
      stem = P(lastBn.slice(0, -1), lastRom.slice(0, -1));
      if (!stem.bn || !stem.rom) fail(`"${lastBn}" is too short to be a verb`);
      if (/[\u09BE-\u09CC]$/.test(stem.bn) || stem.bn.endsWith(YA) || stem.bn.endsWith('ও')) fail(`the verb "${lastBn}" has a vowel-final root (not supported)`);
      extra = Object.hasOwn(IRREGULAR_C, lastBn) ? IRREGULAR_C[lastBn] : {};
    } else {
      fail(`"${lastBn}" is not a verbal noun (it must end in া, ওয়া or ানো)`);
    }
    if (tag === 'v' && kind !== 'cons' && kind !== 'ano') fail(`the tag v only applies to consonant roots and ানো verbs, not "${lastBn}"`);
    return { lead, tag, kind, stem, extra, display, lastBn };
  }

  // ---- The rows ------------------------------------------------------------------------------------
  const persons = make => [0, 1, 2, 3, 4, 5].map(make);

  function build(v) {
    const { lead, tag, kind, stem, extra } = v;
    const phrase = (...parts) => sp(...lead, ...parts);
    const same = form => persons(() => phrase(form));
    const each = (stems, ends) => persons(p => phrase(cat(Array.isArray(stems) ? stems[p] : stems, ends[p])));
    let pres, cont, pcont, past, hab, perf, pperf, fut, impTui, impTumi, impApni, impShe, condForm, infForm, conjForm, perfVowel;

    if (kind === 'cons') {
      const S = stem;
      const R = tag === 'v' ? raise(S) : S;                        // the raised stem
      const pastS = extra.past || R;
      const Pf = extra.perf || (tag === 'v' ? null : aToE(S)) || R;
      pres = persons(p => cat(p < 2 ? R : S, PRES_C[p]));
      cont = CONT_C; pcont = PCONT_C; perfVowel = false;
      past = persons(p => cat(pastS, PAST[p]));
      hab = persons(p => cat(R, HAB[p]));
      perf = persons(p => cat(Pf, PERF_C[p]));
      pperf = persons(p => cat(Pf, PPERF_C[p]));
      fut = persons(p => cat(R, FUT[p]));
      impTui = extra.tui || S;
      impTumi = extra.tumi || pres[2];
      impApni = cat(R, P('ুন', 'un'));
      impShe = cat(R, P('ুক', 'uk'));
      condForm = cat(pastS, LE);
      infForm = cat(R, TE);
      conjForm = cat(Pf, P('ে', 'e'));
      const cs = persons(p => cat(R, cont[p]));
      const pcs = persons(p => cat(R, pcont[p]));
      return finish(v, { pres, cont: cs, pcont: pcs, past, hab, perf, pperf, fut, impTui, impTumi, impApni, impShe, condForm, infForm, conjForm });
    }

    let T = stem, pastS, habS, perfS, futS, contS, tui, apni, she, futTui, anoE = false;
    if (kind === 'ano') {
      anoE = ANO_E.has(v.lastBn);
      // খাওয়ানো: the stem ends in ওয়া, so the perfect stem is খাই (খাইয়েছি), not খাওয়ি
      const Ti = anoE ? P(T.bn.slice(0, -1), T.rom.slice(0, -1))
        : T.bn.endsWith('ওয়া') && T.rom.endsWith('oa') ? P(T.bn.slice(0, -4) + 'ই', T.rom.slice(0, -2) + 'i')
          : tag === 'v' ? alefToI(raise(T)) : alefToI(T);
      pres = persons(p => cat(T, PRES_V[p]));
      contS = T; pastS = T; habS = T; perfS = Ti; futS = T; tui = T;
      apni = cat(T, P('ন', 'n')); she = cat(T, P('ক', 'k'));
    } else if (kind === 'itype') {
      pres = persons(p => cat(T, PRES_V[p]));
      const Ti = cat(T, P('ই', 'i'));
      contS = T; pastS = Ti; habS = Ti; perfS = alefToE(T); futS = Ti; tui = T;
      apni = cat(T, P('ন', 'n')); she = cat(T, P('ক', 'k'));
    } else {                                                        // special
      pres = extra.pres || persons(p => cat(extra.root, PRES_V[p]));
      contS = extra.cont; pastS = extra.past; habS = extra.hab; perfS = extra.perf; futS = extra.fut;
      tui = extra.tui || extra.root; apni = extra.apni; she = extra.she; futTui = extra.futTui;
    }
    past = persons(p => cat(pastS, PAST[p]));
    hab = persons(p => cat(habS, HAB[p]));
    perf = persons(p => cat(perfS, (anoE ? PERF_C : PERF_V)[p]));
    pperf = persons(p => cat(perfS, (anoE ? PPERF_C : PPERF_V)[p]));
    fut = persons(p => (p === 1 && futTui ? cat(futTui) : cat(futS, FUT[p])));
    const cs = persons(p => cat(contS, CONT_V[p]));
    const pcs = persons(p => cat(contS, PCONT_V[p]));
    return finish(v, {
      pres, cont: cs, pcont: pcs, past, hab, perf, pperf, fut,
      impTui: tui, impTumi: pres[2], impApni: apni, impShe: she,
      condForm: cat(pastS, LE), infForm: cat(habS, TE), conjForm: cat(perfS, anoE ? P('ে', 'e') : P(YA + 'ে', 'ye')),
    });
  }

  function finish(v, f) {
    const { lead } = v;
    const phrase = (...parts) => sp(...lead, ...parts);
    const rows = {
      pres: f.pres.map(c => phrase(c)),
      presCont: f.cont.map(c => phrase(c)),
      past: f.past.map(c => phrase(c)),
      pastCont: f.pcont.map(c => phrase(c)),
      pastHab: f.hab.map(c => phrase(c)),
      presPerf: f.perf.map(c => phrase(c)),
      pastPerf: f.pperf.map(c => phrase(c)),
      fut: f.fut.map(c => phrase(c)),
      negPres: f.pres.map(c => phrase(c, NA)),
      negPast: f.pres.map(c => phrase(cat(c, NI))),
      negFut: f.fut.map(c => phrase(c, NA)),
      imp: [null, phrase(f.impTui), phrase(f.impTumi), phrase(f.impApni), phrase(f.impShe), phrase(f.impApni)],
      impNeg: [null, phrase(f.pres[1], NA), phrase(f.pres[2], NA), phrase(f.fut[3], NA), null, phrase(f.fut[3], NA)],
      cond: persons(() => phrase(f.condForm)),
      noun: persons(() => v.display),
      inf: persons(() => phrase(f.infForm)),
      conj: persons(() => phrase(f.conjForm)),
    };
    return rows;
  }

  function express(entry) {
    const v = parse(entry);
    const rows = build(v);
    for (const key of ROW_KEYS) {
      if (!rows[key] || rows[key].length !== 6) fail(`internal error: row ${key} is missing`);
    }
    return { bn: v.display.bn, rom: v.display.rom, rows };
  }

  const api = { express, ROW_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Bengali = api;
})(typeof window !== 'undefined' ? window : globalThis);
