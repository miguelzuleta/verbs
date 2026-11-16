/*
 * Arabic verb pattern engine: Modern Standard Arabic, fully vowelled script.
 *
 *   express({ form: 'I', root: 'كتب', vowels: 'au' }) -> { ar, tr, rows }
 *
 * ar, tr   the citation form (3rd person masculine singular perfect): كَتَبَ kataba.
 * rows     thirteen keys (ROW_KEYS), each an array of THIRTEEN cells in the person order
 *          أنا أنتَ أنتِ هو هي نحن أنتما أنتم أنتنّ هما(m) هما(f) هم هنّ. A cell is { ar, tr } or null where
 *          that person has no such form (the imperative exists only for the 2nd person; the passive and the
 *          passive participle do not exist for forms VII and IX or for كان).
 *
 * Entry: form I II III IV V VI VII VIII IX X (three-letter roots) or Q1 (faʿlala) Q2 (tafaʿlala) (four-letter
 * roots); root = the letters with weak letters (و ي) and hamza written ء, no diacritics; vowels (form I only)
 * = the vowel of the past and of the present, two letters from a i u ('au' kataba yaktubu). For hollow and
 * defective roots the second letter is the vowel of the present (قول 'au' yaqūlu, بيع 'ai' yabīʿu, نوم 'aa'
 * yanāmu, خوف 'ia' yakhāfu; رمي 'ai' yarmī, دعو 'au' yadʿū, نسي 'ia' yansā). express() THROWS
 * Error('arabic express(): ...') for what it cannot read (unknown form, bad root, vowels where they do not
 * belong, an unsupported class); it never guesses.
 *
 * CLASSES handled in every form where the class exists: sound; hamzated (initial: أَكَلَ with the imperative كُلْ خُذْ مُرْ;
 * medial سَأَلَ; final قَرَأَ, with the hamza on its proper seat); assimilated (وَصَلَ يَصِلُ, form VIII اِتَّصَلَ, form I with
 * the dropped و; a first ي: يَيْبَسُ); hollow (قَالَ قُلْتُ يَقُولُ لَمْ يَقُلْ قُلْ, with the passive قِيلَ); defective (رَمَى رَمَيْتُ
 * رَمَوْا يَرْمِي يَرْمُونَ لَمْ يَرْمِ اِرْمِ, دَعَا, نَسِيَ, and the passive رُمِيَ يُرْمَى); doubled (مَدَّ مَدَدْتُ يَمُدُّ مُدَّ); doubly weak
 * (وَقَى قِ, رَأَى يَرَى رَ, أَتَى اِئْتِ, جَاءَ جِئْتُ, وَلِيَ, حَيِيَ); كَانَ (no passive). The two long-ā spellings follow the rule ى after
 * any letter but ي, ا after ي (أَحْيَا).
 * LEXICAL EXCEPTIONS (the regular pattern is not the real word): the active participle of موت is مَيِّتٌ (not مَائِتٌ); form X of حوذ
 * stays sound (اِسْتَحْوَذَ).
 * REFUSED with a clear message (Error "arabic express(): unsupported class ..."): form IX of anything but a sound root, form VIII
 * of a root starting with ي, form VII of a root starting with ن, a defective form I verb with a u past or with a u present and a
 * final ي. Other lexicalised participles and verbs whose real forms differ from the regular pattern of their class
 * are not known to the engine: the data must choose a root and vowels for which the regular pattern is the real one.
 *
 * TRANSLITERATION (one scheme, used everywhere; no pausal forms):
 *   ʾ hamza (not written at the start of a word)   ʿ ʿayn   ā ī ū long vowels   a i u short vowels
 *   consonants b t th j ḥ kh d dh r z s sh ṣ ḍ ṭ ẓ gh f q k l m n h w y; a doubled (shadda) consonant is
 *   written twice (dd, ww, nn); tanwīn un in an; a hyphen joins the future prefix (sa-yaktubu); a space
 *   separates a negative particle from its verb. The hamzat waṣl of a word that starts with it is a bare
 *   vowel (uktub, ittaṣala).
 *
 * MACHINERY. Every word is built from a TOKEN LIST in which script and Latin come out of the SAME tokens, so
 * the two lines cannot disagree (see render()):
 *   1 2 3 4        the root letters             a i u   short vowels (carried by the letter before)
 *   A I U          long vowels ā ī ū (alif, yā, wāw)            Y  long ā written ى
 *   S              the silent alif after wāw al-jamāʿa          Z  the ى that follows a tanwīn fatḥ
 *                  (Y and Z are written ا after a ي: أَحْيَا, مُحْيًا)
 *   W              hamzat al-waṣl (alif with the vowel after it)
 *   N K F          tanwīn ḍamm, kasr, fatḥ on the letter before     - and space   literals
 *   any Arabic letter (a literal prefix or infix letter, T = the infix of form VIII)
 * A consonant with no vowel after it gets a sukūn; two equal consonants with no vowel between them become one
 * letter with a shadda; the hamza seat (أ إ ؤ ئ ء) and the alif madda آ are decided from the neighbouring
 * vowels. The weak-root classes are transformations of the token list of the sound pattern: hollowize (قال),
 * contract (مَدَّ), the defective ending tables (رَمَى رَمَيْتُ يَرْمِي), the dropped initial و (يَصِلُ) ...
 */
(function (global) {
  'use strict';

  const { words } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const fail = message => { throw new Error('arabic express(): ' + message); };

  // ---- Letters --------------------------------------------------------------------------
  const LAT = {
    'ء': 'ʾ', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'ḥ', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r',
    'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 'ṣ', 'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ', 'ع': 'ʿ', 'غ': 'gh', 'ف': 'f',
    'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
  };
  const SHORT = { a: ['َ', 'a'], i: ['ِ', 'i'], u: ['ُ', 'u'] };   // fatḥa kasra ḍamma
  const LONG = { A: ['ا', 'ā', 'a'], I: ['ي', 'ī', 'i'], U: ['و', 'ū', 'u'], Y: ['ى', 'ā', 'a'] };
  const TAN = { N: ['ٌ', 'un', 'u'], K: ['ٍ', 'in', 'i'], F: ['ً', 'an', 'a'] };
  const SUKUN = 'ْ', SHADDA = 'ّ';
  const RANK = { '': 0, a: 1, u: 2, i: 3 };
  const WEAK = 'وي';
  const isWeak = ch => WEAK.includes(ch);
  const SHORT_V = 'aiu', LONG_V = 'AIUY';

  // ---- Tokens -> segments -> script and Latin -------------------------------------------------
  function segments(tokens) {
    const segs = [];
    for (const t of tokens) {
      const prev = segs[segs.length - 1];
      const onConsonant = prev && prev.k === 'c';
      if (Object.hasOwn(LAT, t)) segs.push({ k: 'c', ch: t, v: '', long: '', tan: '', sh: false });
      else if (t === 'W') segs.push({ k: 'c', ch: 'ا', wasl: true, v: '', long: '', tan: '', sh: false });
      else if (SHORT_V.includes(t)) {
        if (!onConsonant || prev.v || prev.long) fail(`internal: vowel ${t} after nothing`);
        prev.v = t;
      } else if (LONG_V.includes(t)) {
        if (!onConsonant || prev.v || prev.long) fail(`internal: long vowel ${t} after nothing`);
        prev.v = LONG[t][2]; prev.long = t;
      } else if (Object.hasOwn(TAN, t)) {
        if (!onConsonant || prev.v || prev.long || prev.tan) fail(`internal: tanwin ${t} after nothing`);
        prev.tan = t;
      } else if (t === 'S') segs.push({ k: 'l', ar: 'ا', tr: '' });
      else if (t === 'Z') segs.push({ k: 'l', ar: 'ى', tr: '' });
      else if (t === '-' || t === ' ') segs.push({ k: 'l', ar: t === ' ' ? ' ' : '', tr: t });
      else fail(`internal: bad token "${t}"`);
    }
    return segs;
  }

  // the seat of a hamza from the vowel before it (prev: start | a i u | C = a letter with sukūn | A I U = long)
  function seat(prev, own, final) {
    if (prev === 'start') return own === 'i' ? 'إ' : 'أ';
    if (prev === 'A') return final ? 'ء' : own === 'i' ? 'ئ' : own === 'u' ? 'ؤ' : 'ء';
    if (prev === 'I') return final ? 'ء' : 'ئ';
    if (prev === 'U') return final ? 'ء' : own === 'i' ? 'ئ' : 'ء';
    if (prev === 'C') return final ? 'ء' : own === 'i' ? 'ئ' : own === 'u' ? 'ؤ' : 'أ';
    const rank = final ? RANK[prev] : Math.max(RANK[prev], RANK[own]);
    return rank === 3 ? 'ئ' : rank === 2 ? 'ؤ' : 'أ';
  }

  // one word: { ar, tr }
  function render(tokens) {
    let segs = segments(tokens);
    // ʾaʾ -> ʾā (آ), ʾuʾ -> ʾū (أُو), ʾiʾ -> ʾī (إِي): a hamza with a vowel before a hamza with sukūn
    const merged = [];
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i], n = segs[i + 1];
      const plain = x => x && x.k === 'c' && x.ch === 'ء' && !x.long && !x.tan && !x.sh;
      if (plain(s) && s.v && plain(n) && !n.v) {
        merged.push({ k: 'l', ar: s.v === 'a' ? 'آ' : s.v === 'u' ? 'أُو' : 'إِي', tr: (merged.length ? 'ʾ' : '') + (s.v === 'a' ? 'ā' : s.v === 'u' ? 'ū' : 'ī') });
        i += 1;
      } else merged.push(s);
    }
    segs = merged;
    // geminates: two equal consonants with no vowel on the first
    const out = [];
    for (const s of segs) {
      const p = out[out.length - 1];
      if (p && p.k === 'c' && s.k === 'c' && !p.wasl && !s.wasl && p.ch === s.ch && !p.v && !p.long && !p.tan && !p.sh) {
        out.pop(); out.push({ ...s, sh: true });
      } else out.push(s);
    }
    let ar = '', tr = '';
    out.forEach((s, i) => {
      const before = out[i - 1];
      // a final ā written ى becomes ا after a ي (أَحْيَا istaḥyā, مُحْيًا muḥyan), the usual spelling outside Egypt
      const afterYa = before && before.k === 'c' && before.ch === 'ي';
      if (s.k === 'l') { ar += s.ar === 'ى' && afterYa ? 'ا' : s.ar; tr += s.tr; return; }
      let letter = s.ch, lat = s.wasl ? '' : LAT[s.ch];
      if (s.ch === 'ء') {
        let prev = 'start';
        if (i > 0) prev = !before || before.k !== 'c' ? 'C' : before.long ? (before.long === 'Y' ? 'A' : before.long) : before.v ? before.v : 'C';
        const own = s.tan ? TAN[s.tan][2] : s.v;
        letter = seat(prev, own, i === out.length - 1 && !s.long);
        if (prev === 'start') lat = '';
        if (letter === 'أ' && s.long === 'A') { ar += 'آ'; tr += (lat ? lat : '') + 'ā'; return; }
      }
      // diacritics in the normalised order: vowel (or tanwīn, or sukūn) first, then the shadda
      tr += s.sh ? lat + lat : lat;
      ar += letter + (s.v ? SHORT[s.v][0] : s.tan ? TAN[s.tan][0] : SUKUN) + (s.sh ? SHADDA : '');
      if (s.long) { ar += s.long === 'Y' && s.ch === 'ي' ? 'ا' : LONG[s.long][0]; tr += LONG[s.long][1]; }
      else if (s.v) tr += SHORT[s.v][1];
      else if (s.tan) tr += TAN[s.tan][1];
    });
    return { ar, tr };
  }

  // ---- The patterns ----------------------------------------------------------------------------
  const sp = text => words(text).filter(Boolean);       // '' (the bare jussive) -> no tokens
  const FORM_NAMES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'Q1', 'Q2'];
  // perfect stem up to and including the last radical (the ending adds the final vowel); V = the vowel of form I
  const PERF = {
    I: '1 a 2 V 3', II: '1 a 2 2 a 3', III: '1 A 2 a 3', IV: 'ء a 1 2 a 3', V: 'ت a 1 a 2 2 a 3', VI: 'ت a 1 A 2 a 3',
    VII: 'W i ن 1 a 2 a 3', VIII: 'W i 1 T a 2 a 3', IX: 'W i 1 2 a 3 3', X: 'W i س ت a 1 2 a 3',
    Q1: '1 a 2 3 a 4', Q2: 'ت a 1 a 2 3 a 4',
  };
  const PPERF = {
    I: '1 u 2 i 3', II: '1 u 2 2 i 3', III: '1 U 2 i 3', IV: 'ء u 1 2 i 3', V: 'ت u 1 u 2 2 i 3', VI: 'ت u 1 U 2 i 3',
    VII: null, VIII: 'W u 1 T u 2 i 3', IX: null, X: 'W u س ت u 1 2 i 3', Q1: '1 u 2 3 i 4', Q2: 'ت u 1 u 2 3 i 4',
  };
  // imperfect: [vowel of the prefix, body]; V = the vowel before the last radical
  const IMPF = {
    I: ['a', '1 2 V 3'], II: ['u', '1 a 2 2 V 3'], III: ['u', '1 A 2 V 3'], IV: ['u', '1 2 V 3'],
    V: ['a', 'ت a 1 a 2 2 V 3'], VI: ['a', 'ت a 1 A 2 V 3'], VII: ['a', 'ن 1 a 2 V 3'], VIII: ['a', '1 T a 2 V 3'],
    IX: ['a', '1 2 a 3 3'], X: ['a', 'س ت a 1 2 V 3'], Q1: ['u', '1 a 2 3 V 4'], Q2: ['a', 'ت a 1 a 2 3 V 4'],
  };
  const V_ACTIVE = { II: 'i', III: 'i', IV: 'i', V: 'a', VI: 'a', VII: 'i', VIII: 'i', X: 'i', Q1: 'i', Q2: 'a' };
  const IMP_PREFIX = { IV: 'ء a', VII: 'W i', VIII: 'W i', IX: 'W i', X: 'W i' };
  // the 3-letter forms that cannot be built for every class are checked in readEntry()
  const HOLLOW_FORMS = ['I', 'IV', 'VII', 'VIII', 'X'];
  const DOUBLED_FORMS = ['I', 'III', 'IV', 'VI', 'VII', 'VIII', 'X'];

  // ---- Persons and endings ---------------------------------------------------------------------------
  // أنا أنتَ أنتِ هو هي نحن أنتما أنتم أنتنّ هما(m) هما(f) هم هنّ
  const PREFIX = ['ء', 'ت', 'ت', 'ي', 'ت', 'ن', 'ت', 'ت', 'ت', 'ي', 'ت', 'ي', 'ي'];
  const GROUP = [1, 1, 2, 1, 1, 1, 3, 4, 5, 3, 3, 4, 5];       // 1 = singular, 2 = 2nd fem sing, 3 = dual, 4 = masc plural, 5 = fem plural
  const PERF_END = ['ت u', 'ت a', 'ت i', 'a', 'a ت', 'ن A', 'ت u م A', 'ت u م', 'ت u ن ن a', 'A', 'a ت A', 'U S', 'ن a'];
  const PERF_VOWEL_END = [false, false, false, true, true, false, false, false, false, true, true, true, false];
  const MOOD_END = {
    ind: ['u', 'I ن a', 'A ن i', 'U ن a', 'ن a'],
    subj: ['a', 'I', 'A', 'U S', 'ن a'],
    juss: ['', 'I', 'A', 'U S', 'ن a'],
  };
  // defective imperfect: ending by the vowel before the last radical (i: yarmī, u: yadʿū, a: yarḍā); the stem is the
  // prefix + the radicals up to the second-to-last, so every ending starts with that radical's own vowel
  const DEF_END = {
    i: {
      ind: ['I', 'I ن a', 'i ي A ن i', 'U ن a', 'I ن a'],
      subj: ['i ي a', 'I', 'i ي A', 'U S', 'I ن a'],
      juss: ['i', 'I', 'i ي A', 'U S', 'I ن a'],
    },
    u: {
      ind: ['U', 'I ن a', 'u و A ن i', 'U ن a', 'U ن a'],
      subj: ['u و a', 'I', 'u و A', 'U S', 'U ن a'],
      juss: ['u', 'I', 'u و A', 'U S', 'U ن a'],
    },
    a: {
      ind: ['Y', 'a ي ن a', 'a ي A ن i', 'a و ن a', 'a ي ن a'],
      subj: ['Y', 'a ي', 'a ي A', 'a و S', 'a ي ن a'],
      juss: ['a', 'a ي', 'a ي A', 'a و S', 'a ي ن a'],
    },
  };
  // defective perfect after the stem (which ends with the second-to-last radical): a-type (رَمَى) with the glide g, i-type (نَسِيَ)
  const defPerfA = (g, first) => [`a ${g} ت u`, `a ${g} ت a`, `a ${g} ت i`, first, 'a ت', `a ${g} ن A`, `a ${g} ت u م A`, `a ${g} ت u م`,
    `a ${g} ت u ن ن a`, `a ${g} A`, 'a ت A', 'a و S', `a ${g} ن a`];
  const DEF_PERF_I = ['I ت u', 'I ت a', 'I ت i', 'i ي a', 'i ي a ت', 'I ن A', 'I ت u م A', 'I ت u م', 'I ت u ن ن a', 'i ي A', 'i ي a ت A', 'U S', 'I ن a'];

  // ---- Reading an entry ---------------------------------------------------------------------------
  const ROOT_LETTERS = 'ءبتثجحخدذرزسشصضطظعغفقكلمنهوي';
  // و as the first letter keeps its place in the imperfect only after these (with i or with aa it drops: yaṣilu, yaḍaʿu)
  const W_DROPS_AFTER_IA = ['وسع', 'وطء'];
  const HAMZA_IMPERATIVE_DROPS = ['ءكل', 'ءخذ', 'ءمر'];       // كُلْ خُذْ مُرْ
  // roots whose derived form keeps the weak letter as a consonant instead of becoming hollow: اِسْتَحْوَذَ يَسْتَحْوِذُ (the regular
  // اِسْتَحَاذَ is not used). Only unambiguous cases: the root جوب also gives the regular اِسْتَجَابَ, so اِسْتَجْوَبَ is not offered.
  const STAYS_SOUND = { X: ['حوذ'] };

  function readEntry(entry) {
    if (!entry || typeof entry !== 'object') fail('the entry must be an object');
    const { form } = entry;
    if (!FORM_NAMES.includes(form)) fail(`unknown form "${form}" (use ${FORM_NAMES.join(' ')})`);
    const quad = form[0] === 'Q';
    const raw = String(entry.root === undefined ? '' : entry.root);
    const root = [...raw];
    if (root.length !== (quad ? 4 : 3) || root.some(ch => !ROOT_LETTERS.includes(ch))) {
      fail(`root "${raw}" must be ${quad ? 4 : 3} Arabic root letters for form ${form} (no diacritics, hamza written ء)`);
    }
    let vowels = entry.vowels;
    if (form === 'I') {
      if (vowels === undefined) fail(`form I verb ${raw} needs vowels (the vowel of the past and of the present, two letters from a i u, e.g. 'au')`);
      if (typeof vowels !== 'string' || !/^[aiu]{2}$/.test(vowels)) fail(`vowels "${vowels}" must be two letters from a i u (e.g. 'au')`);
    } else if (vowels !== undefined) fail(`vowels "${vowels}" belong to form I only (form ${form} has fixed vowels)`);
    const last = root[root.length - 1];
    const weak3 = isWeak(last);
    const r2 = root[1];
    const key = root.join('');
    const cls = {
      defective: weak3,
      hollow: !quad && !weak3 && isWeak(r2) && HOLLOW_FORMS.includes(form) && !(Object.hasOwn(STAYS_SOUND, form) && STAYS_SOUND[form].includes(key)),
      doubled: !quad && !weak3 && r2 === last && DOUBLED_FORMS.includes(form),
    };
    if (form === 'IX' && (weak3 || r2 === last || last === 'ء')) fail(`unsupported class: form IX ${key} needs a sound root (colours and defects like حمر، بيض، سود)`);
    if (form === 'VII' && root[0] === 'ن') fail(`unsupported class: form VII of a root starting with ن (${key}); the two nūns would merge and such a verb is not used`);
    if (form === 'VIII' && root[0] === 'ي') fail(`unsupported class: form VIII of a root starting with ي (${key})`);
    if (form === 'I' && weak3) {
      if (vowels[0] === 'u') fail(`unsupported class: defective form I verb ${key} with a u past`);
      if (vowels[1] === 'u' && last !== 'و') fail(`unsupported class: defective form I verb ${key} with a u present needs a final و`);
    }
    return { form, root, key, vowels, cls, quad };
  }

  // ---- Token helpers and the weak-root transformations -----------------------------------------------------
  const isVowelToken = t => t.length === 1 && 'aiuAIUY'.includes(t);
  const isShort = t => t.length === 1 && 'aiu'.includes(t);

  function context(read) {
    const { form, root, vowels, cls } = read;
    const c = { ...read, v0: vowels ? vowels[0] : 'a', v1: vowels ? vowels[1] : 'a', lastD: read.quad ? '4' : '3' };
    c.last = root[root.length - 1];
    // initial و drops from the active imperfect of form I: yaṣilu (i), yaḍaʿu (aa), yalī; it stays after a u or in "ia" verbs (yawjalu)
    c.dropW = form === 'I' && root[0] === 'و' && !cls.hollow && (c.v1 === 'i' || (c.v1 === 'a' && c.v0 === 'a') || W_DROPS_AFTER_IA.includes(read.key));
    c.dropR2 = read.key === 'رءي' && (form === 'I' || form === 'IV');      // يَرَى يُرِي أَرَى (the hamza of رأى falls in the imperfect)
    return c;
  }

  // form VIII: the infix ت assimilates to some first radicals, and a first و (or the hamza of أخذ) becomes ت
  function viii(r1, key) {
    if (r1 === 'و' || key === 'ءخذ') return { first: 'ت', infix: 'ت' };
    if (r1 === 'ز') return { first: 'ز', infix: 'د' };
    if ('صضطظ'.includes(r1)) return { first: r1, infix: 'ط' };
    if (r1 === 'د' || r1 === 'ذ') return { first: 'د', infix: 'د' };
    return { first: r1, infix: 'ت' };
  }

  // digits -> root letters. A first radical و or ي with sukūn after a u makes a long ū (يُوقِنُ yūqinu, يُوصَلُ yūṣalu,
  // أُوصِلَ ūṣila); only a FIRST radical does that (the passive of سَيْطَرَ is سُيْطِرَ suyṭira).
  function resolve(tokens, c, normalise = true) {
    const [r1, r2, r3, r4] = c.root;
    let first = r1, infix = 'ت';
    if (c.form === 'VIII') ({ first, infix } = viii(r1, c.key));
    const map = { 1: first, 2: r2, 3: r3, 4: r4, T: infix };
    const out = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (normalise && t === 'u' && tokens[i + 1] === '1' && isWeak(first) && tokens[i + 2] && !isVowelToken(tokens[i + 2]) && tokens[i + 2] !== '1') {
        out.push('U'); i += 1;
      } else out.push(Object.hasOwn(map, t) ? map[t] : t);
    }
    return out;
  }

  // the radical 2 is a weak letter: long vowel before an ending that starts with a vowel, short before a consonant or sukūn
  // (قَالَ قُلْتُ  يَقُولُ يَقُلْنَ  أَقَامَ أَقَمْتُ  اِخْتَارَ اِخْتَرْتُ  يَخْتَارُ يَخْتَرْ  قِيلَ قِلْتُ)
  function hollowize(tk, short, shortVowel) {
    const i = tk.indexOf('2');
    const prev = tk[i - 1], V = tk[i + 1];
    const before = isShort(prev);                    // a vowel before the radical: C a w a C -> C ā C
    if (!short) {
      const long = before && prev === 'a' ? 'A' : V.toUpperCase();
      return before ? [...tk.slice(0, i - 1), long, ...tk.slice(i + 2)] : [...tk.slice(0, i), long, ...tk.slice(i + 2)];
    }
    const vowel = shortVowel || (before ? (prev === 'u' ? V : prev) : V);
    return before ? [...tk.slice(0, i - 1), vowel, ...tk.slice(i + 2)] : [...tk.slice(0, i), vowel, ...tk.slice(i + 2)];
  }

  // doubled root: 2 V 3 -> 2 3 (the vowel goes to the letter before when that has a sukūn): مَدَّ يَمُدُّ أَمَدَّ
  function contract(tk) {
    const i = tk.indexOf('2');
    if (!(isShort(tk[i + 1]) && tk[i + 2] === '3')) return tk;
    const V = tk[i + 1];
    const out = [...tk.slice(0, i + 1), ...tk.slice(i + 2)];
    if (!isVowelToken(tk[i - 1])) out.splice(i, 0, V);
    return out;
  }

  // form IX undoes its doubled last radical before a consonant: اِحْمَرَرْتُ  يَحْمَرِرْنَ
  const expandIX = (tk, vowel) => [...tk.slice(0, -1), vowel, tk[tk.length - 1]];

  // everything before the last radical, without the vowel that belongs to it
  function defStem(tk, c) {
    const out = tk.slice(0, tk.indexOf(c.lastD));
    if (isShort(out[out.length - 1])) out.pop();
    return out;
  }

  // o.hs: hollow short stem, o.ds: doubled / form IX uncontracted stem, o.sv: the short vowel of a hollow stem,
  // o.ixv: the vowel that undoes the doubled last radical of form IX
  function weaken(c, tk, ending, o) {
    if (c.cls.hollow) tk = hollowize(tk, o.hs, o.sv);
    else if (c.cls.doubled && !o.ds) tk = contract(tk);
    else if (c.form === 'IX' && o.ds) tk = expandIX(tk, o.ixv);
    return [...tk, ...sp(ending)];
  }

  // ---- Perfect ------------------------------------------------------------------------------------------
  const dropRadical2 = (c, tk, always) => (c.dropR2 && (always || c.form === 'IV') ? tk.filter(t => t !== '2') : tk);

  function perfectTokens(c, p, passive) {
    const pattern = passive ? PPERF[c.form] : PERF[c.form];
    if (!pattern) return null;
    let tk = sp(pattern).map(t => (t === 'V' ? c.v0 : t));
    tk = dropRadical2(c, tk, false);
    const vowelEnd = PERF_VOWEL_END[p];
    if (c.cls.defective) {
      const stem = defStem(tk, c);
      const iType = passive || (c.form === 'I' && c.v0 === 'i');
      const g = c.form === 'I' && c.last === 'و' ? 'و' : 'ي';
      const tails = iType ? DEF_PERF_I : defPerfA(g, g === 'و' ? 'A' : 'Y');
      return resolve([...stem, ...sp(tails[p])], c);
    }
    const sv = passive ? 'i' : c.form === 'I' ? (c.v0 === 'a' && c.v1 === 'u' ? 'u' : 'i') : undefined;   // qultu, but biʿtu nimtu khiftu mittu
    return resolve(weaken(c, tk, PERF_END[p], { hs: !vowelEnd, ds: !vowelEnd, sv, ixv: 'a' }), c);
  }

  // ---- Imperfect (indicative, subjunctive, jussive), active and passive -------------------------------------------
  function imperfectTokens(c, p, mood, passive, opts = {}) {
    if (passive && !PPERF[c.form]) return null;
    const [pv0, body] = IMPF[c.form];
    const V = passive ? 'a' : c.form === 'I' ? c.v1 : V_ACTIVE[c.form];
    let tk = [PREFIX[p], passive ? 'u' : pv0, ...sp(body).map(t => (t === 'V' ? V : t))];
    tk = dropRadical2(c, tk, true);
    if (!passive && (c.dropW || opts.dropHamza)) tk = tk.filter(t => t !== '1');
    const g = GROUP[p] - 1;
    if (c.cls.defective) {
      const stem = defStem(tk, c);
      return resolve([...stem, ...sp(DEF_END[V][mood][g])], c, !opts.raw);
    }
    let ending = MOOD_END[mood][g];
    const fp = g === 4, bare = mood === 'juss' && g === 0;
    if (bare && (c.cls.doubled || c.form === 'IX')) ending = 'a';             // لَمْ يَمُدَّ  لَمْ يَحْمَرَّ
    return resolve(weaken(c, tk, ending, { hs: fp || bare, ds: fp, ixv: 'i' }), c, !opts.raw);
  }

  // ---- Imperative (2nd person only): the jussive without its prefix ---------------------------------------------------
  function imperativeTokens(c, p) {
    const juss = imperfectTokens(c, p, 'juss', false, { raw: true, dropHamza: c.form === 'I' && HAMZA_IMPERATIVE_DROPS.includes(c.key) });
    const tk = juss.slice(2);                                    // without the prefix ت and its vowel
    const done = list => resolve(list, c);
    if (IMP_PREFIX[c.form]) return done([...sp(IMP_PREFIX[c.form]), ...tk]);
    if (c.form === 'I' && !isVowelToken(tk[1])) {
      const u = c.v1 === 'u';
      // a first و or ي after the waṣl vowel: اُوضُؤْ ūḍuʾ, اِيجَلْ ījal
      if (isWeak(tk[0]) && tk[1] !== tk[0] && Object.hasOwn(LAT, tk[1])) return done(['W', u ? 'U' : 'I', ...tk.slice(1)]);
      return done(['W', u ? 'u' : 'i', ...tk]);
    }
    return done(tk);
  }

  // ---- Participles ---------------------------------------------------------------------------------------------
  function participleTokens(c, passive) {
    const [, body] = IMPF[c.form];
    if (passive && (c.form === 'VII' || c.form === 'IX')) return null;
    if (c.form === 'I') return participleI(c, passive);
    const V = passive ? 'a' : 'i';
    let tk = ['م', 'u', ...sp(body).map(t => (t === 'V' ? V : t))];
    tk = dropRadical2(c, tk, true);
    if (c.cls.defective) return resolve([...defStem(tk, c), ...(passive ? ['F', 'Z'] : ['K'])], c);
    return resolve(weaken(c, tk, 'N', { hs: false, ds: false }), c);
  }

  function participleI(c, passive) {
    const { cls } = c;
    if (!passive) {                                              // fāʿil: كَاتِبٌ قَائِلٌ رَامٍ مَادٌّ
      if (c.key === 'موت') return resolve(['م', 'a', 'ي', 'ي', 'i', 'ت', 'N'], c);     // مَيِّتٌ: the lexicalised participle (not the rare مَائِتٌ)
      if (cls.defective) return resolve(['1', 'A', '2', 'K'], c);
      if (cls.hollow) return resolve(c.last === 'ء' ? ['1', 'A', 'ء', 'K'] : ['1', 'A', 'ء', 'i', '3', 'N'], c);
      if (cls.doubled) return resolve(['1', 'A', '2', '2', 'N'], c);
      return resolve(['1', 'A', '2', 'i', '3', 'N'], c);
    }
    // mafʿūl: مَكْتُوبٌ مَقُولٌ مَبِيعٌ مَرْمِيٌّ مَدْعُوٌّ
    if (cls.defective) {
      const w = c.last === 'و' && c.v0 !== 'i';
      return resolve(['م', 'a', '1', '2', w ? 'u' : 'i', w ? 'و' : 'ي', w ? 'و' : 'ي', 'N'], c);
    }
    if (cls.hollow) return resolve(['م', 'a', '1', c.root[1] === 'ي' ? 'I' : 'U', '3', 'N'], c);
    return resolve(['م', 'a', '1', '2', 'U', '3', 'N'], c);
  }

  // form I verbs that take no object: no passive row (a conservative list; other intransitives get a mechanical passive)
  const INTRANSITIVE_I = new Set(words('موت نوم كبر وقع ذهب خرج رجع نزل صعد سقط جلس قعد حضر سفر نجح فشل عيش حيي بقي مرض ضحك بكي هرب هبط قدم وقف'));

  // ---- The rows ----------------------------------------------------------------------------------------------
  const ROW_KEYS = ['past', 'pres', 'fut', 'subj', 'juss', 'imp', 'negPast', 'negPres', 'negFut', 'pastPass', 'presPass', 'actPart', 'passPart'];
  const cellOf = tk => (tk ? render(tk) : null);
  const withPrefix = (ar, tr, cell) => (cell ? { ar: ar + cell.ar, tr: tr + cell.tr } : null);

  function buildRows(c) {
    const each = fn => Array.from({ length: 13 }, (_, p) => fn(p));
    // كان has no passive, and neither do the common form I verbs that never take an object (go, die, sleep ...);
    // for the rest the passive is built mechanically
    const noPassive = !PPERF[c.form] || c.key === 'كون' || (c.form === 'I' && INTRANSITIVE_I.has(c.key));
    const imperfect = (mood, passive) => each(p => (passive && noPassive ? null : cellOf(imperfectTokens(c, p, mood, passive))));
    const same = cell => each(() => cell);
    const rows = {};
    rows.past = each(p => cellOf(perfectTokens(c, p, false)));
    rows.pres = imperfect('ind', false);
    rows.fut = rows.pres.map(cell => withPrefix('سَ', 'sa-', cell));
    rows.subj = imperfect('subj', false);
    rows.juss = imperfect('juss', false);
    rows.imp = each(p => ([1, 2, 6, 7, 8].includes(p) ? cellOf(imperativeTokens(c, p)) : null));
    rows.negPast = rows.juss.map(cell => withPrefix('لَمْ ', 'lam ', cell));
    rows.negPres = rows.pres.map(cell => withPrefix('لَا ', 'lā ', cell));
    rows.negFut = rows.subj.map(cell => withPrefix('لَنْ ', 'lan ', cell));
    rows.pastPass = each(p => (noPassive ? null : cellOf(perfectTokens(c, p, true))));
    rows.presPass = imperfect('ind', true);
    rows.actPart = same(cellOf(participleTokens(c, false)));
    rows.passPart = same(noPassive ? null : cellOf(participleTokens(c, true)));
    return rows;
  }

  function express(entry) {
    const c = context(readEntry(entry));
    const rows = buildRows(c);
    return { ar: rows.past[3].ar, tr: rows.past[3].tr, rows };
  }

  const api = { express, ROW_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Arabic = api;
})(typeof window !== 'undefined' ? window : globalThis);
