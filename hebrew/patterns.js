/*
 * Hebrew verb pattern engine: Modern Hebrew, Academy full spelling (ktiv male).
 *
 *   express({ he: 'לכתוב', binyan: 'pa', root: 'כתב', fv: 'o' }) -> { he, tr, rows }
 *
 * he, tr   the infinitive in script and in transliteration, BUILT by the engine from binyan + root (+ fv);
 *          for a correct entry it equals entry.he (this is the main consistency check of the data).
 * rows     seven keys (ROW_KEYS: pres past fut pastCont imp impNeg inf); each is an array of TEN cells in the
 *          person order אני אתה את הוא היא אנחנו אתם אתן הם הן. A cell is { he, tr } or null where that
 *          person has no such form (the imperative exists only for the 2nd person; להיות has no present).
 *
 * Entry: binyan pa ni pi hi hit hu (pa'al, nif'al, pi'el, hif'il, hitpa'el, huf'al; huf'al only for strong
 * roots, with the infinitive להורכב lehorkav). pu'al is refused (it has no infinitive). root = 3 or 4 letters
 * (weak letters included). fv = 'o' | 'a' (vowel of the future of a pa'al verb with a strong root); for the
 * roots with א or ה the vowel is predicted when fv is missing. express() THROWS Error('hebrew express(): ...')
 * for what it cannot read (unknown binyan, bad root, unsupported class); it never guesses.
 *
 * Classes handled: pa'al strong (also guttural first/second/last letter), pe-alef (אסף, the אמר/אכל type),
 * pe-nun (נפל נסע נגע נשם נהג), pe-yod (ילד ירד ישב ירש ידע ישן יצר ירק ינק יצא ירה), ayin-vav/yod (קום שים),
 * lamed-he, lamed-alef, weak geminate (סבב without fv) and the fully irregular verbs (לקחת לתת ללכת לבוא להיות
 * לחיות למות לצאת לשכב לגשת לשאת לאפות ...); pi'el: strong, three- and four-letter, polel (עודד), hollow (קיים),
 * lamed-he, lamed-alef; hif'il: strong, guttural, pe-nun, pe-yod, hollow, geminate, lamed-he, lamed-alef;
 * nif'al: strong, guttural, pe-yod, hollow, lamed-he, lamed-alef; hitpa'el: strong, sibilant metathesis
 * (הסתכל השתמש הצטער הזדקן), four-letter, hitpolel (התגורר), lamed-he, lamed-alef.
 * Four-letter roots written with a doubled ו or י (כוון, טייל, וותר) are read as three-letter roots.
 * Also: nif'al geminate (נמס); pa'al strong roots whose middle ו is a consonant (גווע, צווח, שווע); hif'il roots whose last
 * ה is a consonant (גבה higbi'a, גיה hegi'a); השתחווה (hit:שחה); pi'el roots that start with ה (הנהן, הבהב, הפנט, four letters).
 * Hif'il roots that need a lexical decision: נפק keeps its נ (להנפיק hinpik, issue) while להפיק (hefik, mafik) is written with
 * the root פוק; רוח is להרוויח (consonantal ו; four letters רווח work too) while להריח (smell) is written with ריח.
 * Lexical choices (which root takes which pattern) are held in short lists beside each class.
 *
 * TRANSLITERATION (ASCII, no stress marks, no gemination):
 *   consonants: ב b/v  ג g  ד d  ה h (silent at the end of a word)  ו v  ז z  ח kh  ט t  י y
 *   כ k/kh  ל l  מ m  נ n  ס s  ע and א ' only to separate vowels (sho'el, ma'amin), silent at the start
 *   of a word and before a consonant  פ p/f  צ ts  ק k  ר r  ש sh (s for a few sin roots: לשים lasim,
 *   לעשות la'asot, see SIN_ROOTS)  ת t. Vowels a e i o u.
 *   Begadkefat (ב כ פ): hard (b k p) at the start of a word and after a consonant, soft (v kh f) after a
 *   vowel and after a reduced vowel (katva, kotvim, kitvi); a doubled letter (dagesh forte) is hard
 *   (lipol, tipol, siper). A furtive a is written before a final ח (poteakh) and after a final ע (lishmo'a).
 *
 * MACHINERY. Every form is built from a TEMPLATE: space-separated items, each making tokens that carry
 * script and Latin together, so they cannot disagree:
 *   1 2 3 4   root consonant (prefix ! forces hard, ~ soft, _ silent, + doubles a consonantal י/ו)
 *   ת י ...   a literal consonant        a e i o u   a vowel, 'o/ו' = a vowel with its mater lectionis
 *   .         a reduced vowel (silent in Latin, but it spirantises the next ב כ פ)
 *   PRE PV    the future prefix of the person and its vowel
 * Final-form letters (ך ם ן ף ץ) are applied at the end of every word.
 */
(function (global) {
  'use strict';

  const { words } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const fail = message => { throw new Error('hebrew express(): ' + message); };

  // ---- Letters --------------------------------------------------------------------
  const SIN = '\u05e9\u05c2';      // a root letter ש read as sin (s): marked internally, see SIN_ROOTS
  const FINAL = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
  const TO_FINAL = { 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' };
  const BASE = ch => FINAL[ch] || ch;
  const LAT = {
    'א': "'", 'ב': null, 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z', 'ח': 'kh', 'ט': 't', 'י': 'y',
    'כ': null, 'ל': 'l', 'מ': 'm', 'נ': 'n', 'ס': 's', 'ע': "'", 'פ': null, 'צ': 'ts', 'ק': 'k', 'ר': 'r',
    'ש': 'sh', 'ת': 't', [SIN]: 's',
  };
  const BEGAD = { 'ב': ['b', 'v'], 'כ': ['k', 'kh'], 'פ': ['p', 'f'] };
  const GUTTURAL = 'אהחע';

  // ---- Tokens and templates ---------------------------------------------------------
  // token: { k: 'c' consonant | 'v' vowel | 'r' reduced vowel, h: script, t: Latin, hard?, soft? }
  const cons = (letter, flag) => {
    const base = BASE(letter);
    if (!Object.hasOwn(LAT, base)) fail(`not a Hebrew letter: ${letter}`);
    const token = { k: 'c', h: base === SIN ? 'ש' : base, t: LAT[base] };
    if (flag === '!') token.hard = true;
    if (flag === '~') token.soft = true;
    if (flag === '_') token.t = '';
    if (flag === '+') token.double = true;
    return token;
  };
  const vowel = (t, h = '') => ({ k: 'v', h, t });
  const REDUCED = { k: 'r', h: '', t: '' };

  function item(text, root, person, pre) {
    let m;
    if (text === '.') return [REDUCED];
    if (text === "'") return [{ k: 'r', h: '', t: "'" }];       // a Latin apostrophe with no letter (furtive a after a silent ה: higbi'a)
    if (text === 'PRE') return templateTokens(pre(person), root, person, pre);
    if (text === 'PV') {                       // the vowel of the future prefix, without mater
      const v = words(pre(person)).reverse().find(x => /^[aeiou]/.test(x));
      return [vowel(v[0])];
    }
    if ((m = text.match(/^_\/([א-ת])$/))) return [{ k: 'r', h: m[1], t: '' }];     // a mater with no sound
    if ((m = text.match(/^([aeiou])(?:\/([א-ת]))?$/))) return [vowel(m[1], m[2] || '')];
    if ((m = text.match(/^([!~_+]?)([1-4])$/))) {
      const letter = root[Number(m[2]) - 1];
      if (letter === undefined) fail(`template wants root letter ${m[2]} but the root has ${root.length}`);
      return [cons(letter, m[1])];
    }
    if ((m = text.match(/^([!~_+]?)([א-ת])$/))) return [cons(m[2], m[1])];
    return fail(`bad template item "${text}"`);
  }
  const templateTokens = (tpl, root, person, pre) =>
    words(tpl).filter(Boolean).flatMap(text => item(text, root, person, pre));

  // Fix the Latin value of the consonants that depend on their neighbours, add the furtive
  // a, and write script and Latin.
  function realise(tokens) {
    const out = tokens.map(t => ({ ...t }));
    const last = out.length - 1;
    // furtive a: a final ח (or ע) after a long vowel
    const end = out[last];
    if (end && end.k === 'c' && (end.h === 'ח' || end.h === 'ע') && last > 0 && out[last - 1].k === 'v' && out[last - 1].t !== 'a') {
      out.splice(end.h === 'ח' ? last : last + 1, 0, vowel('a'));
    }
    for (let i = 0; i < out.length; i++) {
      const t = out[i];
      if (t.k !== 'c') continue;
      let j = i - 1;                                   // the letter before, skipping silent א/ע
      while (j >= 0 && out[j].k === 'c' && out[j].t === '' && 'אע'.includes(out[j].h)) j--;
      const prev = out[i - 1], before = out[j], next = out[i + 1];
      if (BEGAD[t.h]) {
        const soft = t.soft || (!t.hard && before && before.k !== 'c');
        t.t = BEGAD[t.h][soft ? 1 : 0];
      } else if ((t.h === 'א' || t.h === 'ע') && t.t !== '') {
        t.t = prev && next && next.k !== 'c' ? "'" : '';
      }
      // a doubled consonant is one sound (Modern Hebrew has no gemination): הפלתי hipalti, החלטתי hekhlati
      if (t.t !== '' && t.h !== 'י' && t.h !== 'ו') {
        let q = i - 1;
        while (q >= 0 && out[q].k === 'r') q--;
        if (q >= 0 && out[q].k === 'c' && out[q].t === t.t && !(t.h === 'א' || t.h === 'ע')) t.t = '';
      }
      // a ת or ט before צ: ts already begins with t (מנתצים menatsim, not menattsim)
      if (t.t === 'ts') {
        let q = i - 1;
        while (q >= 0 && out[q].k === 'r') q--;
        if (q >= 0 && out[q].k === 'c' && out[q].t === 't') out[q].t = '';
      }
    }
    // A consonantal ו or י inside a word is written double (לוותר, ציווה, לדמיין, לעניין, מייסד, הייתה), except
    // beside a letter that already makes it (a mater or another ו), at the start of a word, and before a final ה/ו/י.
    const orig = out.map(t => t.h);
    out.forEach((t, i) => {
      if (t.k !== 'c') return;
      const prev = out[i - 1], next = out[i + 1];
      if (t.h === 'ו') {
        const beside = (next && orig[i + 1] === 'ו') || (prev && orig[i - 1] === 'ו');
        if (!beside && (i > 0 || t.double)) t.h = 'וו';
      } else if (t.h === 'י') {
        const afterMater = prev && prev.k !== 'c' && prev.h === 'י';
        const beforeLetter = next && next.k !== 'c' && next.h !== '';
        if (t.double ? !beforeLetter : i > 0 && next && !afterMater && !beforeLetter && !(next.k === 'c' && next.h === 'י')) t.h = 'יי';
      }
    });
    let he = out.map(t => t.h).join('');
    he = he.replace(/^ייי+/, 'יי');   // prefix י + root י: ייעץ yeya'ets, never three yods in a row
    he = [...he].map(BASE).join('');
    he = he.slice(0, -1) + (TO_FINAL[he.slice(-1)] || he.slice(-1));
    return { he, tr: out.map(t => t.t).join('') };
  }

  // ---- Cells -------------------------------------------------------------------------
  const cell = (he, tr) => ({ he, tr });
  const join = (...cells) => cell(cells.map(c => c.he).join(' '), cells.map(c => c.tr).join(' '));

  // A word from a template. When the stem ends in ת or נ and the ending starts with the
  // same letter, the two merge (כרת + תי = כרתי karati; האמן + נו = האמנו he'emanu).
  function word(stemTpl, endTpl, ctx) {
    const { root, person = 0, pre } = ctx;
    const stem = templateTokens(stemTpl, root, person, pre);
    const ending = endTpl ? templateTokens(endTpl, root, person, pre) : [];
    const a = stem[stem.length - 1], b = ending[0];
    if (a && b && a.k === 'c' && b.k === 'c' && a.h === b.h && (a.h === 'ת' || a.h === 'נ')) ending.shift();
    return realise([...stem, ...ending]);
  }

  // ---- The rows from a spec ------------------------------------------------------------
  // spec = {
  //   inf:  template of the infinitive
  //   past: { p3, f3, pl3, s1, s2? }   3ms, 3fs, 3pl full forms; stem before -ti -ta -t -nu (s1)
  //                                    and before -tem -ten (s2, default s1)
  //   pres: { ms, fs, mp, fp }         templates of the four participle forms (null = no present)
  //   fut:  { pre(person) -> template of the prefix, bare, i, u }
  //   imp:  { ms, fs, pl } or null     templates of the imperative
  // }
  // A form of a spec may also be null (the verb has no such form).

  const ROW_KEYS = ['pres', 'past', 'fut', 'pastCont', 'imp', 'impNeg', 'inf'];
  const PREFIX = ['א', 'ת', 'ת', 'י', 'ת', 'נ', 'ת', 'ת', 'י', 'י'];
  const PRESENT_SLOT = ['ms', 'ms', 'fs', 'ms', 'fs', 'mp', 'mp', 'fp', 'mp', 'fp'];
  const BE_PAST = [['הייתי', 'hayiti'], ['היית', 'hayita'], ['היית', 'hayit'], ['היה', 'haya'], ['הייתה', 'hayta'],
    ['היינו', 'hayinu'], ['הייתם', 'hayitem'], ['הייתן', 'hayiten'], ['היו', 'hayu'], ['היו', 'hayu']];
  const PAST_END = [' ת i/י', ' ת a', ' ת', null, null, ' נ u/ו', ' ת e מ', ' ת e נ', null, null];

  // the future prefix: א e / ת i / ... ; a different vowel for the 1st person is common
  const futPrefix = (first, other) => p => `${PREFIX[p]} ${p === 0 ? first : other}`;

  function buildRows(spec, root0) {
    const root = spec.root || root0;                 // a spec may read the root differently (hitpa'el of קום)
    const rows = {};
    const ctx = person => ({ root, person, pre: spec.fut && spec.fut.pre });
    const make = (stem, end, person) => (stem ? word(stem, end, ctx(person)) : null);
    const each = fn => Array.from({ length: 10 }, (_, p) => fn(p));
    const future = p => {
      if (!spec.fut) return null;
      const f = spec.fut, pick = p === 2 ? f.i : [6, 7, 8, 9].includes(p) ? f.u : f.bare;
      const stem = typeof pick === 'function' ? pick(p) : pick;
      return make(stem ? 'PRE ' + stem : null, '', p);
    };
    const present = p => (spec.pres ? make(spec.pres[PRESENT_SLOT[p]], '', p) : null);
    rows.pres = each(present);
    rows.past = each(p => {
      const s = spec.past;
      if (!s) return null;
      if (p === 3) return make(s.p3, '', p);
      if (p === 4) return make(s.f3, '', p);
      if (p === 8 || p === 9) return make(s.pl3, '', p);
      return make(p === 6 || p === 7 ? (s.s2 || s.s1) : s.s1, PAST_END[p], p);
    });
    rows.fut = each(future);
    rows.pastCont = each(p => (present(p) ? join(cell(...BE_PAST[p]), present(p)) : null));
    rows.imp = each(p => {
      if (!spec.imp) return null;
      const stem = p === 1 ? spec.imp.ms : p === 2 ? spec.imp.fs : p === 6 || p === 7 ? spec.imp.pl : null;
      return make(stem, '', p);
    });
    rows.impNeg = each(p => {
      if (![1, 2, 6, 7].includes(p) || !spec.imp) return null;
      const f = future(p);
      return f ? join(cell('אל', 'al'), f) : null;
    });
    const inf = make(spec.inf, '', 0);
    rows.inf = each(() => inf);
    return rows;
  }

  // Roots with a sin (s) instead of a shin (sh): 'binyan:root' -> index of the letter (or a list of indexes). Every other ש is sh.
  const norm = text => [...text].map(BASE).join('');       // final forms -> base letters (for table keys)
  const keyed = table => Object.fromEntries(Object.entries(table).map(([k, v]) => [norm(k), v]));
  const SIN_ROOTS = keyed({
    'pa:שים': 0, 'pa:שחק': 0, 'pi:שחק': 0, 'pa:שמח': 0, 'pi:שמח': 0, 'pa:שרף': 0, 'pa:שנא': 0, 'pa:שרד': 0,
    'pa:שבע': 0, 'pa:שחה': 0, 'pa:שכר': 0, 'pi:שכר': 0, 'pa:שרט': 0, 'hi:שכל': 0, 'hi:שכם': 0,
    'hi:שכר': 0, 'pa:עשה': 1, 'ni:עשה': 1, 'pa:נשא': 1, 'ni:נשא': 1, 'hi:נשא': 1, 'hi:נשג': 1, 'hit:עשר': 1,
    'pi:חפש': 2, 'hit:חפש': 2, 'hi:עשר': 1,
    'hi:שבע': 0, 'pa:שרר': 0, 'ni:שרף': 0, 'pi:שוחח': 0, 'pi:שגשג': [0, 2],
  });
  const spell = root => root.map(l => (l === SIN ? 'ש' : l)).join('');

  // ---- Reading an entry --------------------------------------------------------------------
  const BINYANIM = ['pa', 'ni', 'pi', 'pu', 'hi', 'hu', 'hit'];

  function readEntry(entry) {
    if (!entry || typeof entry !== 'object') fail('the entry must be an object');
    const { binyan, fv } = entry;
    if (!BINYANIM.includes(binyan)) fail(`unknown binyan "${binyan}" (use ${BINYANIM.join(' ')})`);
    if (binyan === 'pu') fail(`binyan pu (pu'al) is not supported: it has no infinitive, so an entry cannot be spelled`);
    const raw = String(entry.root === undefined ? '' : entry.root);
    if (!/^[א-ת]{3,4}$/.test(raw)) fail(`root "${raw}" must be 3 or 4 Hebrew letters`);
    const root = [...raw].map(BASE);
    const key = `${binyan}:${root.join('')}`;
    if (Object.hasOwn(SIN_ROOTS, key)) for (const index of [].concat(SIN_ROOTS[key])) root[index] = SIN;
    if (fv !== undefined && fv !== 'o' && fv !== 'a') fail(`fv "${fv}" must be o or a`);
    return { binyan, root, fv, key };
  }

  // ---- Pa'al, strong roots (with the guttural and pe-alef variants) --------------------------
  const isG = ch => GUTTURAL.includes(ch);
  // pe-alef verbs of the אמר kind: future with o (יאמר yomar, יאכל yokhal)
  const OMAR = { 'אמר': 'לומר', 'אכל': 'לאכול' };

  function paalStrong(root, fv) {
    const [r1, r2, r3] = root;
    const alef = r1 === 'א', omar = alef && Object.hasOwn(OMAR, spell(root));
    // fv is only given for roots without weak letters; for the others the vowel of the future is predictable:
    // a guttural second letter takes a (ישאל yish'al), the rest o (אסף ye'esof, הפך yahafokh); אהב is the exception
    if (!fv && (alef || r1 === 'ה' || r2 === 'א' || r2 === 'ה')) fv = spell(root) === 'אהב' ? 'a' : alef ? 'o' : isG(r2) ? 'a' : 'o';
    if (r3 === 'ח' || r3 === 'ע') fv = 'a';          // a last letter ח or ע always takes the future vowel a (ישלח, ישמע)
    if (!fv) fail(`pa'al root ${spell(root)} needs fv o or a (the vowel of the future)`);
    const v = fv === 'o' ? 'o/ו' : 'a';
    const c1g = isG(r1), c2g = isG(r2), c3g = r3 === 'ח' || r3 === 'ע';
    // the vowel before -im -ot in the present: reduced (כותבים kotvim), full after a guttural (שוחטים) and between two
    // identical letters (שודדים shodedim, גוללים golelim, מודדים modedim: a reduced vowel there would merge the two letters)
    const e23 = c2g ? 'a' : r2 === r3 ? 'e' : '.';
    const gv = alef ? 'e' : 'a';                  // vowel of the guttural first root letter (composite sheva)
    const spec = {
      inf: c1g ? `ל ${alef ? 'e' : 'a'} 1 ${gv} 2 o/ו 3` : 'ל i 1 2 o/ו 3',
      past: {
        p3: '1 a 2 a 3', f3: `1 a 2 ${c2g ? 'a' : '.'} 3 a/ה`, pl3: `1 a 2 ${c2g ? 'a' : '.'} 3 u/ו`,
        s1: '1 a 2 a 3', s2: c1g ? '1 a 2 a 3' : c2g ? '1 e 2 a 3' : '1 . 2 a 3',
      },
      pres: {
        ms: '1 o/ו 2 e 3', fs: c3g ? '1 o/ו 2 a 3 a ת' : '1 o/ו 2 e 3 e ת',
        mp: `1 o/ו 2 ${e23} 3 i/י ם`, fp: `1 o/ו 2 ${e23} 3 o/ו ת`,
      },
      fut: {
        pre: futPrefix('e', alef ? 'e' : c1g ? 'a' : 'i'),
        bare: c1g ? `1 PV 2 ${v} 3` : `1 2 ${v} 3`,
        i: c1g ? `1 PV 2 ${c2g ? 'a' : '.'} 3 i/י` : c2g ? '1 2 a 3 i/י' : '1 2 e 3 i/י',
        u: c1g ? `1 PV 2 ${c2g ? 'a' : '.'} 3 u/ו` : c2g ? '1 2 a 3 u/ו' : '1 2 e 3 u/ו',
      },
      imp: {
        // a guttural middle letter: a-future verbs take e..a (שאל), o-future verbs keep their vav (דחוף dkhof, דחפי dikhafi)
        ms: c1g ? `1 ${gv} 2 ${v} 3` : c2g && fv !== 'o' ? '1 e 2 a 3' : `1 . 2 ${v} 3`,
        fs: c1g && c2g ? '1 e 2 a 3 i/י' : c2g ? (fv === 'o' ? '1 i 2 a 3 i/י' : '1 a 2 a 3 i/י') : '1 i 2 . 3 i/י',
        pl: c1g && c2g ? '1 e 2 a 3 u/ו' : c2g ? (fv === 'o' ? '1 i 2 a 3 u/ו' : '1 a 2 a 3 u/ו') : '1 i 2 . 3 u/ו',
      },
    };
    if (omar) {                                  // אמר, אכל: אומר omar, תאמר tomar, יאמר yomar
      spec.fut = {
        pre: p => (p === 0 ? 'א o/ו' : `${PREFIX[p]} o _1`),
        bare: '2 a 3', i: '2 . 3 i/י', u: '2 . 3 u/ו',
      };
      if (spell(root) === 'אמר') spec.inf = 'ל o/ו 2 a 3';
    }
    return spec;
  }

  // ---- Pa'al, weak roots -------------------------------------------------------------------

  // lamed-alef (קרא, מצא): like the a-future strong verb, the final א mostly silent
  function paalLameAlef(root) {
    const spec = paalStrong(root, 'a');
    spec.pres.fs = '1 o/ו 2 3 e ת';
    return spec;
  }

  // lamed-he (בנה, קנה, ראה, עשה, שתה)
  function paalLameHe(root, plain) {          // plain: no composite vowel after a guttural (היה, חיה)
    const c1g = isG(root[0]) && !plain, c2g = isG(root[1]);
    const gv = root[0] === 'א' ? 'e' : 'a';
    return {
      inf: c1g ? `ל ${gv} 1 ${gv} 2 o/ו ת` : 'ל i 1 2 o/ו ת',
      past: { p3: '1 a 2 a/ה', f3: root[1] === 'י' ? '1 a 2 _/י . ת a/ה' : '1 a 2 . ת a/ה', pl3: '1 a 2 u/ו', s1: '1 a 2 i/י' },
      pres: { ms: '1 o/ו 2 e/ה', fs: '1 o/ו 2 a/ה', mp: '1 o/ו 2 i/י ם', fp: '1 o/ו 2 o/ו ת' },
      fut: {
        pre: futPrefix('e', c1g ? gv : 'i'),
        bare: c1g ? '1 PV 2 e/ה' : '1 2 e/ה', i: c1g ? '1 PV 2 i/י' : '1 2 i/י', u: c1g ? '1 PV 2 u/ו' : '1 2 u/ו',
      },
      imp: c2g
        ? { ms: '1 e 2 e/ה', fs: '1 e 2 i/י', pl: '1 e 2 u/ו' }
        : { ms: `1 ${isG(root[0]) ? gv : ''} 2 e/ה`, fs: `1 ${isG(root[0]) ? gv : ''} 2 i/י`, pl: `1 ${isG(root[0]) ? gv : ''} 2 u/ו` },
    };
  }

  // ayin-vav and ayin-yod (קום, גור, רוץ, שים, שיר): the middle letter is the vowel u or i
  function paalAyinVav(root) {
    const m = root[1] === 'ו' ? 'u/ו' : 'i/י';
    return {
      inf: `ל a 1 ${m} 3`,
      past: { p3: '1 a 3', f3: '1 a 3 a/ה', pl3: '1 a 3 u/ו', s1: '1 a 3' },
      pres: { ms: '1 a 3', fs: '1 a 3 a/ה', mp: '1 a 3 i/י ם', fp: '1 a 3 o/ו ת' },
      fut: { pre: futPrefix('a', 'a'), bare: `1 ${m} 3`, i: `1 ${m} 3 i/י`, u: `1 ${m} 3 u/ו` },
      imp: { ms: `1 ${m} 3`, fs: `1 ${m} 3 i/י`, pl: `1 ${m} 3 u/ו` },
    };
  }

  // weak geminate (סבב: סב sav, סבותי savoti, יסוב yasov), only when the entry has no fv
  function paalGeminate() {
    return {
      inf: 'ל a 1 o/ו 2',
      past: { p3: '1 a 2', f3: '1 a 2 a/ה', pl3: '1 a 2 u/ו', s1: '1 a 2 o/ו' },
      pres: { ms: '1 a 2', fs: '1 a 2 a/ה', mp: '1 a 2 i/י ם', fp: '1 a 2 o/ו ת' },
      fut: { pre: futPrefix('a', 'a'), bare: '1 o/ו 2', i: '1 o/ו 2 i/י', u: '1 o/ו 2 u/ו' },
      imp: { ms: '1 o/ו 2', fs: '1 o/ו 2 i/י', pl: '1 o/ו 2 u/ו' },
    };
  }

  // pe-nun (נפל, נסע, נגע, נשם, נהג): the נ is kept, or assimilated in some forms (lexical)
  const PE_NUN = {
    'נפל': { fut: 'drop', inf: 'lipol' }, 'נטל': { fut: 'drop', inf: 'lipol', imp: 'drop' },
    'נסע': { fut: 'drop', imp: 'drop' }, 'נגע': { fut: 'drop', inf: 'laga', imp: 'drop' },
    'נטע': { fut: 'drop', imp: 'drop' },
  };
  function paalPeNun(root, fv) {
    const [, r2, r3] = root;
    const t = PE_NUN[spell(root)] || {};
    const v = fv || (isG(r2) || r3 === 'ח' || r3 === 'ע' ? 'a' : 'o');
    const spec = paalStrong(root, v);
    const vv = v === 'o' ? 'o/ו' : 'a';
    if (t.fut === 'drop') {
      spec.fut = { pre: p => (p === 0 ? 'א e' : `${PREFIX[p]} i/י`), bare: `!2 ${vv} 3`, i: '!2 . 3 i/י', u: '!2 . 3 u/ו' };
    }
    if (t.imp === 'drop') {
      const g3 = r3 === 'ח' || r3 === 'ע';
      spec.imp = { ms: `2 ${vv} 3`, fs: g3 ? '2 e 3 i/י' : '2 . 3 i/י', pl: g3 ? '2 e 3 u/ו' : '2 . 3 u/ו' };
    }
    if (t.inf === 'lipol') spec.inf = 'ל i/י !2 o/ו 3';
    if (t.inf === 'laga') spec.inf = 'ל a 2 a 3 a ת';
    return spec;
  }

  // pe-yod (ילד, ירד, ישב, ירש, ידע): the י falls in the future, the imperative and the infinitive
  const PE_YOD = ['ילד', 'ירד', 'ישב', 'ירש', 'ידע'];
  function paalPeYod(root) {
    const key = spell(root);
    if (!PE_YOD.includes(key)) fail(`pe-yod root ${key} is not supported (supported: ${PE_YOD.join(' ')})`);
    const g3 = root[2] === 'ח' || root[2] === 'ע';
    const spec = paalStrong(root, g3 ? 'a' : 'o');
    spec.past.s2 = '1 e 2 a 3';
    spec.inf = g3 ? 'ל a 2 a 3 a ת' : 'ל a 2 e 3 e ת';
    spec.fut = { pre: futPrefix('e', 'e'), bare: g3 ? '2 a 3' : '2 e 3', i: '2 . 3 i/י', u: '2 . 3 u/ו' };
    spec.imp = { ms: g3 ? '2 a 3' : '2 e 3', fs: g3 ? '2 e 3 i/י' : '2 . 3 i/י', pl: g3 ? '2 e 3 u/ו' : '2 . 3 u/ו' };
    return spec;
  }

  // ---- Pa'al, the irregular verbs (keyed by binyan:root) ------------------------------------------
  const dropPre = p => (p === 0 ? 'א e' : `${PREFIX[p]} i/י`);       // נ/י fell: אתן, תיתן, ייתן
  const lameHeNoPres = spec => ({ ...spec, pres: null });

  function peYodO(root) {
    const s = paalStrong(root, 'o');
    s.past.s2 = '1 e 2 a 3';                       // יצרתם yetsartem (not ytsartem)
    s.inf = 'ל i/י 2 o/ו 3';
    s.fut = { pre: dropPre, bare: '2 o/ו 3', i: '2 . 3 i/י', u: '2 . 3 u/ו' };
    s.imp = { ms: '2 o/ו 3', fs: '2 . 3 i/י', pl: '2 . 3 u/ו' };
    return s;
  }

  function pe_yod_he(root) {
    const s = paalLameHe(root, true);
    s.inf = 'ל i/י 2 o/ו ת';
    s.fut = { pre: p => `${PREFIX[p]} i/י`, bare: '2 e/ה', i: '2 i/י', u: '2 u/ו' };
    s.imp = { ms: '1 e 2 e/ה', fs: '1 e 2 i/י', pl: '1 e 2 u/ו' };
    return s;
  }

  const PAAL_IRREGULAR = keyed({
    // לקחת: root לקח, the ל falls like a pe-nun
    'לקח': () => {
      const s = paalStrong(['ל', 'ק', 'ח'], 'a');
      s.inf = 'ל a 2 a 3 a ת';
      s.past.s2 = '1 e 2 a 3';
      s.fut = { pre: dropPre, bare: '!2 a 3', i: '!2 . 3 i/י', u: '!2 . 3 u/ו' };
      s.imp = { ms: '2 a 3', fs: '2 . 3 i/י', pl: '2 . 3 u/ו' };
      return s;
    },
    // לתת
    'נתן': () => ({
      inf: 'ל a ת e ת',
      past: { p3: '1 a 2 a 3', f3: '1 a 2 . 3 a/ה', pl3: '1 a 2 . 3 u/ו', s1: '1 a 2 a', s2: '1 e 2 a' },
      pres: { ms: '1 o/ו 2 e 3', fs: '1 o/ו 2 e 3 e ת', mp: '1 o/ו 2 . 3 i/י ם', fp: '1 o/ו 2 . 3 o/ו ת' },
      fut: { pre: dropPre, bare: '!2 e 3', i: '!2 . 3 i/י', u: '!2 . 3 u/ו' },
      imp: { ms: '2 e 3', fs: '2 . 3 i/י', pl: '2 . 3 u/ו' },
    }),
    // ללכת
    'הלך': () => {
      const s = paalStrong(['ה', 'ל', 'ך'], 'o');
      s.inf = 'ל a 2 e 3 e ת';
      s.fut = { pre: futPrefix('e', 'e'), bare: '2 e 3', i: '2 . 3 i/י', u: '2 . 3 u/ו' };
      s.imp = { ms: '2 e 3', fs: '2 e 3 i/י', pl: '2 e 3 u/ו' };
      return s;
    },
    // לבוא
    'בוא': () => ({
      inf: 'ל a 1 o/ו _3',
      past: { p3: '1 a _3', f3: '1 a 3 a/ה', pl3: '1 a 3 u/ו', s1: '1 a _3' },
      pres: { ms: '1 a _3', fs: '1 a 3 a/ה', mp: '1 a 3 i/י ם', fp: '1 a 3 o/ו ת' },
      fut: { pre: futPrefix('a', 'a'), bare: '1 o/ו _3', i: '1 o/ו 3 i/י', u: '1 o/ו 3 u/ו' },
      imp: { ms: '1 o/ו _3', fs: '1 o/ו 3 i/י', pl: '1 o/ו 3 u/ו' },
    }),
    // להיות (no present) and לחיות
    'היה': () => {
      const s = lameHeNoPres(paalLameHe(['ה', 'י', 'ה'], true));
      s.imp = { ms: '1 e 2 e/ה', fs: '1 e 2 i/י', pl: '1 e 2 u/ו' };
      return s;
    },
    'חיה': () => {
      const s = paalLameHe(['ח', 'י', 'ה'], true);
      s.pres = { ms: '1 a 2', fs: '1 a 2 a/ה', mp: '1 a 2 i/י ם', fp: '1 a 2 o/ו ת' };
      return s;
    },
    // למות: מת met, מתה meta, מתו metu, but מתי mati, מתנו matnu
    'מות': () => {
      const s = paalAyinVav(['מ', 'ו', 'ת']);
      s.pres = { ms: '1 e 3', fs: '1 e 3 a/ה', mp: '1 e 3 i/י ם', fp: '1 e 3 o/ו ת' };
      s.past = { p3: '1 e 3', f3: '1 e 3 a/ה', pl3: '1 e 3 u/ו', s1: '1 a 3' };
      return s;
    },
    // לצאת
    'יצא': () => ({
      inf: 'ל a 2 e _3 ת',
      past: { p3: '1 a 2 a _3', f3: '1 a 2 _3 a/ה', pl3: '1 a 2 _3 u/ו', s1: '1 a 2 a _3', s2: '1 e 2 a _3' },
      pres: { ms: '1 o/ו 2 e _3', fs: '1 o/ו 2 e _3 ת', mp: '1 o/ו 2 _3 i/י ם', fp: '1 o/ו 2 _3 o/ו ת' },
      fut: { pre: futPrefix('e', 'e'), bare: '2 e _3', i: '2 _3 i/י', u: '2 _3 u/ו' },
      imp: { ms: '2 e _3', fs: '2 _3 i/י', pl: '2 _3 u/ו' },
    }),
    // לשכב
    'שכב': () => { const s = paalStrong(['ש', 'כ', 'ב'], 'a'); s.inf = 'ל i 1 2 a 3'; return s; },
    // לגשת: past and present like a nif'al (ניגש), future, imperative and infinitive like a pa'al
    'נגש': () => ({
      inf: 'ל a 2 a 3 e ת',
      past: { p3: 'נ i/י 2 a 3', f3: 'נ i/י 2 . 3 a/ה', pl3: 'נ i/י 2 . 3 u/ו', s1: 'נ i/י 2 a 3' },
      pres: { ms: 'נ i/י 2 a 3', fs: 'נ i/י 2 e 3 e ת', mp: 'נ i/י 2 a 3 i/י ם', fp: 'נ i/י 2 a 3 o/ו ת' },
      fut: { pre: dropPre, bare: '!2 a 3', i: '!2 . 3 i/י', u: '!2 . 3 u/ו' },
      imp: { ms: '2 a 3', fs: '2 . 3 i/י', pl: '2 . 3 u/ו' },
    }),
    // לשאת
    'נשא': () => ({
      inf: 'ל a 2 e _3 ת',
      past: { p3: '1 a 2 a _3', f3: '1 a 2 _3 a/ה', pl3: '1 a 2 _3 u/ו', s1: '1 a 2 a _3', s2: '1 e 2 a _3' },
      pres: { ms: '1 o/ו 2 e _3', fs: '1 o/ו 2 e _3 ת', mp: '1 o/ו 2 _3 i/י ם', fp: '1 o/ו 2 _3 o/ו ת' },
      fut: { pre: dropPre, bare: '2 a _3', i: '2 _3 i/י', u: '2 _3 u/ו' },
      imp: { ms: '2 e _3', fs: '2 _3 i/י', pl: '2 _3 u/ו' },
    }),
    // לאפות
    'אפה': () => {
      const s = paalLameHe(['א', 'פ', 'ה']);
      s.fut = { pre: p => (p === 0 ? 'א o/ו' : `${PREFIX[p]} o _1`), bare: '2 e/ה', i: '2 i/י', u: '2 u/ו' };
      return s;
    },
    // לירות, לידות: pe-yod lamed-he (יורה yore, אירה ire, ירה yere)
    'ירה': () => pe_yod_he(['י', 'ר', 'ה']),
    'ידה': () => pe_yod_he(['י', 'ד', 'ה']),
    // לישון
    'ישן': () => ({
      inf: 'ל i/י 2 o/ו 3',
      past: { p3: '1 a 2 a 3', f3: '1 a 2 . 3 a/ה', pl3: '1 a 2 . 3 u/ו', s1: '1 a 2 a 3', s2: '1 e 2 a 3' },
      pres: { ms: '1 a 2 e 3', fs: '1 e 2 e 3 a/ה', mp: '1 e 2 e 3 i/י ם', fp: '1 e 2 e 3 o/ו ת' },
      fut: { pre: p => `${PREFIX[p]} i/י`, bare: '2 a 3', i: '2 . 3 i/י', u: '2 . 3 u/ו' },
      imp: { ms: '1 e 2 a 3', fs: '1 i 2 . 3 i/י', pl: '1 i 2 . 3 u/ו' },
    }),
    // ליצור, ליצוק, ליזום, לירוק: pe-yod, o in the future (אצור etsor, תיצור titsor)
    'יצר': () => peYodO(['י', 'צ', 'ר']),
    'יצק': () => peYodO(['י', 'צ', 'ק']),
    'יזם': () => peYodO(['י', 'ז', 'ם']),
    'ירק': () => peYodO(['י', 'ר', 'ק']),
    // לינוק: ינק yanak, ינק yinak
    'ינק': () => {
      const s = paalStrong(['י', 'נ', 'ק'], 'a');
      s.past.s2 = '1 e 2 a 3';
      s.inf = 'ל i/י 2 o/ו 3';
      s.fut = { pre: p => `${PREFIX[p]} i/י`, bare: '2 a 3', i: '2 . 3 i/י', u: '2 . 3 u/ו' };
      s.imp = { ms: '1 e 2 a 3', fs: '1 i 2 . 3 i/י', pl: '1 i 2 . 3 u/ו' };
      return s;
    },
    // לסגת: past and present like נסוג nasog, future and infinitive like a pe-nun
    'נסג': () => ({
      inf: 'ל a 2 e 3 e ת',
      past: { p3: 'נ a 2 o/ו 3', f3: 'נ a 2 o/ו 3 a/ה', pl3: 'נ a 2 o/ו 3 u/ו', s1: 'נ a 2 o/ו 3' },
      pres: { ms: 'נ a 2 o/ו 3', fs: 'נ a 2 o/ו 3 a/ה', mp: 'נ a 2 o/ו 3 i/י ם', fp: 'נ a 2 o/ו 3 o/ו ת' },
      fut: { pre: dropPre, bare: '2 o/ו 3', i: '2 o/ו 3 i/י', u: '2 o/ו 3 u/ו' },
      imp: { ms: '2 o/ו 3', fs: '2 o/ו 3 i/י', pl: '2 o/ו 3 u/ו' },
    }),
  });

  // strong roots whose middle ו is a consonant, not the vowel u (גווע gava, ligvo'a; צווח tsavakh): not ayin-vav
  const PAAL_VAV_STRONG = ['גוע', 'צוח', 'שוע'].map(norm);
  function paalSpec(root, fv, key) {
    const [r1, r2, r3] = root;
    if (Object.hasOwn(PAAL_IRREGULAR, spell(root))) return PAAL_IRREGULAR[spell(root)]();
    if (root.length === 4) fail(`pa'al root ${spell(root)} has four letters`);
    if (PAAL_VAV_STRONG.includes(spell(root))) return paalStrong(root, fv);
    if (r3 === 'ה') return paalLameHe(root);
    if (r3 === 'א') return paalLameAlef(root);
    if (r2 === 'ו' || r2 === 'י') return paalAyinVav(root);
    if (r1 === 'נ') return paalPeNun(root, fv);
    if (r1 === 'י') return paalPeYod(root);
    if (r1 === 'ו') fail(`pa'al root ${spell(root)} starts with ו, which is not supported`);
    if (r2 === r3 && !fv) return paalGeminate(root);
    return paalStrong(root, fv);
  }

  // ---- Pi'el ---------------------------------------------------------------------------------------
  const piPre = p => (p === 0 ? 'א a' : `${PREFIX[p]} e`);            // אדבר adaber, תדבר tedaber

  // strong 3-radical (דבר, בישל, ביקר, חפש; also pe-alef, pe-nun, pe-yod, geminate and lamed-guttural)
  function pielStrong(root) {
    const g3 = root[2] === 'ח' || root[2] === 'ע';
    // a guttural 2nd letter keeps a full vowel (משחקים mesakhakim); so does a geminate root (משננים meshanenim)
    const e = isG(root[1]) ? 'a' : root[1] === root[2] ? 'e' : '.';
    return {
      inf: 'ל e +1 a !2 e 3',
      past: { p3: '1 i/י !2 e 3', f3: `1 i/י !2 ${e} 3 a/ה`, pl3: `1 i/י !2 ${e} 3 u/ו`, s1: '1 i/י !2 a 3' },
      pres: {
        ms: 'מ e +1 a !2 e 3', fs: g3 ? 'מ e +1 a !2 a 3 a ת' : 'מ e +1 a !2 e 3 e ת',
        mp: `מ e +1 a !2 ${e} 3 i/י ם`, fp: `מ e +1 a !2 ${e} 3 o/ו ת`,
      },
      fut: { pre: piPre, bare: '+1 a !2 e 3', i: `+1 a !2 ${e} 3 i/י`, u: `+1 a !2 ${e} 3 u/ו` },
      imp: { ms: '+1 a !2 e 3', fs: `+1 a !2 ${e} 3 i/י`, pl: `+1 a !2 ${e} 3 u/ו` },
    };
  }

  // four radicals (תרגם, טלפן, פרסם, שכנע): C1 a C2 C3 e C4
  const LOAN_SOFT3 = ['טלפן'].map(norm);                  // loan verbs whose 3rd letter is spirantised: טלפן telfen
  function pielQuad(root) {
    const c3 = LOAN_SOFT3.includes(spell(root)) ? '~3' : '3';
    return {
      inf: `ל e 1 a 2 ${c3} e 4`,
      past: { p3: `1 i 2 ${c3} e 4`, f3: `1 i 2 ${c3} e 4 a/ה`, pl3: `1 i 2 ${c3} e 4 u/ו`, s1: `1 i 2 ${c3} a 4` },
      pres: { ms: `מ e 1 a 2 ${c3} e 4`, fs: root[3] === 'ח' || root[3] === 'ע' ? `מ e 1 a 2 ${c3} a 4 a ת` : `מ e 1 a 2 ${c3} e 4 e ת`, mp: `מ e 1 a 2 ${c3} e 4 i/י ם`, fp: `מ e 1 a 2 ${c3} e 4 o/ו ת` },
      fut: { pre: piPre, bare: `1 a 2 ${c3} e 4`, i: `1 a 2 ${c3} e 4 i/י`, u: `1 a 2 ${c3} e 4 u/ו` },
      imp: { ms: `1 a 2 ${c3} e 4`, fs: `1 a 2 ${c3} e 4 i/י`, pl: `1 a 2 ${c3} e 4 u/ו` },
    };
  }

  // lamed-he (ניסה, כיסה, גילה, חיכה, ציווה)
  function pielLameHe() {
    return {
      inf: 'ל e +1 a !2 o/ו ת',
      past: { p3: '1 i/י !2 a/ה', f3: '1 i/י !2 . ת a/ה', pl3: '1 i/י !2 u/ו', s1: '1 i/י !2 i/י' },
      pres: { ms: 'מ e +1 a !2 e/ה', fs: 'מ e +1 a !2 a/ה', mp: 'מ e +1 a !2 i/י ם', fp: 'מ e +1 a !2 o/ו ת' },
      fut: { pre: piPre, bare: '+1 a !2 e/ה', i: '+1 a !2 i/י', u: '+1 a !2 u/ו' },
      imp: { ms: '+1 a !2 e/ה', fs: '+1 a !2 i/י', pl: '+1 a !2 u/ו' },
    };
  }

  // lamed-alef (מילא, ריפא, קינא): the final א is silent, the vowel e stays
  function pielLameAlef() {
    return {
      inf: 'ל e +1 a !2 e 3',
      past: { p3: '1 i/י !2 e 3', f3: '1 i/י !2 3 a/ה', pl3: '1 i/י !2 3 u/ו', s1: '1 i/י !2 e 3' },
      pres: { ms: 'מ e +1 a !2 e 3', fs: 'מ e +1 a !2 e 3 ת', mp: 'מ e +1 a !2 3 i/י ם', fp: 'מ e +1 a !2 3 o/ו ת' },
      fut: { pre: piPre, bare: '+1 a !2 e 3', i: '+1 a !2 e 3 i/י', u: '+1 a !2 e 3 u/ו' },
      imp: { ms: '+1 a !2 e 3', fs: '+1 a !2 e 3 i/י', pl: '+1 a !2 e 3 u/ו' },
    };
  }

  // ayin-vav / ayin-yod (קיים kiyem, סיים siyem, ביית): C1 i y e C3, with a consonantal י
  function pielHollow() {
    return {
      inf: 'ל e 1 a +י e 3',
      past: { p3: '1 i/י י e 3', f3: '1 i/י י . 3 a/ה', pl3: '1 i/י י . 3 u/ו', s1: '1 i/י י a 3' },
      pres: { ms: 'מ e 1 a +י e 3', fs: 'מ e 1 a +י e 3 e ת', mp: 'מ e 1 a +י . 3 i/י ם', fp: 'מ e 1 a +י . 3 o/ו ת' },
      fut: { pre: piPre, bare: '1 a +י e 3', i: '1 a +י . 3 i/י', u: '1 a +י . 3 u/ו' },
      imp: { ms: '1 a +י e 3', fs: '1 a +י . 3 i/י', pl: '1 a +י . 3 u/ו' },
    };
  }

  // four-letter roots written with a doubled ו or י (כוון, שווק, וודא, וותר, טייל, עייף, ייעד) are three-letter
  // roots with a consonantal ו / י: כיוון kiven, שיווק shivek, טייל tiyel
  function collapseVav(root) {
    if (root.length !== 4) return root;
    for (let i = 0; i < 3; i++) {
      if ((root[i] === 'ו' || root[i] === 'י') && root[i + 1] === root[i]) return [...root.slice(0, i + 1), ...root.slice(i + 2)];
    }
    return root;
  }
  // three-letter hollow roots whose pi'el keeps a consonantal ו (כיוון kiven, סיווג siveg) instead of י (קיים kiyem)
  const PI_VAV = ['כון', 'סוג', 'שוק', 'נוט', 'תוך', 'גון', 'צוח', 'דוח', 'דוש', 'כוץ', 'עות'].map(norm);

  // C1 o C3 e C4 (עודד oded, סובב sovev, רוקן roken, שוחח sokhe'akh): four letters with ו second
  function pielPolel() {
    return {
      inf: 'ל e +1 o/ו 3 e 4',
      past: { p3: '1 o/ו 3 e 4', f3: '1 o/ו 3 e 4 a/ה', pl3: '1 o/ו 3 e 4 u/ו', s1: '1 o/ו 3 a 4' },
      pres: { ms: 'מ e 1 o/ו 3 e 4', fs: 'מ e 1 o/ו 3 e 4 e ת', mp: 'מ e 1 o/ו 3 e 4 i/י ם', fp: 'מ e 1 o/ו 3 e 4 o/ו ת' },
      fut: { pre: piPre, bare: '1 o/ו 3 e 4', i: '1 o/ו 3 e 4 i/י', u: '1 o/ו 3 e 4 u/ו' },
      imp: { ms: '1 o/ו 3 e 4', fs: '1 o/ו 3 e 4 i/י', pl: '1 o/ו 3 e 4 u/ו' },
    };
  }

  function pielSpec(root0) {
    const root = collapseVav(root0);
    const spec = pielSpec3(root, root.length !== root0.length);
    if (root !== root0) spec.root = root;
    return spec;
  }
  function pielSpec3(root, fromQuad) {
    const [, r2, r3] = root;
    if (root.length === 4) return r2 === 'ו' ? pielPolel() : pielQuad(root);
    if (r3 === 'ה') return pielLameHe();
    if (r3 === 'א') return pielLameAlef();
    if ((r2 === 'ו' || r2 === 'י') && !(r2 === 'ו' && (fromQuad || PI_VAV.includes(spell(root))))) return pielHollow();
    return pielStrong(root);
  }

  // ---- Hif'il ----------------------------------------------------------------------------------------
  // A hif'il spec is a HEAD (everything up to the last-but-one radical, by the type of the first
  // radical) followed by a TAIL (by the type of the last radical).
  const HI_HEADS = {
    std: { past: 'ה i 1 2', pres: 'מ a 1 2', fut: '1 2', imp: 'ה a 1 2', inf: 'ל e ה a 1 2', pre: 'a' },
    // א ע first: composite vowel (העביר he'evir, מעביר ma'avir, יעביר ya'avir, האמין he'emin)
    gutAe: { past: 'ה e 1 e 2', pres: 'מ a 1 a 2', fut: '1 a 2', imp: 'ה a 1 a 2', inf: 'ל e ה a 1 a 2', pre: 'a' },
    // ה ח first: he- but no vowel after the guttural (החליט hekhlit, מחליט makhlit)
    gutHh: { past: 'ה e 1 2', pres: 'מ a 1 2', fut: '1 2', imp: 'ה a 1 2', inf: 'ל e ה a 1 2', pre: 'a' },
    // pe-nun: the נ falls, the next letter is doubled (הפיל hipil, מפיל mapil)
    penun: { past: 'ה i !2', pres: 'מ a !2', fut: '!2', imp: 'ה a !2', inf: 'ל e ה a !2', pre: 'a' },
    penunE: { past: 'ה e 2', pres: 'מ a 2', fut: '2', imp: 'ה a 2', inf: 'ל e ה a 2', pre: 'a' },
    // pe-yod: the י becomes ו (הוריד horid, מוריד morid, יוריד yorid)
    peyod: { past: 'ה o/ו 2', pres: 'מ o/ו 2', fut: '2', imp: 'ה o/ו 2', inf: 'ל e ה o/ו 2', pre: 'o/ו' },
    // ayin-vav / ayin-yod: only the first radical in the head (הקים hekim, מקים mekim, יקים yakim)
    hollow: { past: 'ה e 1', pres: 'מ e 1', fut: '1', imp: 'ה a 1', inf: 'ל e ה a 1', pre: 'a' },
  };
  const HI_TAILS = {
    strong: {
      p3: 'i/י 3', f3: 'i/י 3 a/ה', pl3: 'i/י 3 u/ו', s1: 'a 3',
      ms: 'i/י 3', fs: 'i/י 3 a/ה', mp: 'i/י 3 i/י ם', fp: 'i/י 3 o/ו ת',
      fb: 'i/י 3', fi: 'i/י 3 i/י', fu: 'i/י 3 u/ו', ims: 'e 3', ifs: 'i/י 3 i/י', ipl: 'i/י 3 u/ו', inf: 'i/י 3',
    },
    alef: {
      p3: 'i/י _3', f3: 'i/י 3 a/ה', pl3: 'i/י 3 u/ו', s1: 'e 3',
      ms: 'i/י _3', fs: 'i/י 3 a/ה', mp: 'i/י 3 i/י ם', fp: 'i/י 3 o/ו ת',
      fb: 'i/י _3', fi: 'i/י 3 i/י', fu: 'i/י 3 u/ו', ims: 'e _3', ifs: 'i/י 3 i/י', ipl: 'i/י 3 u/ו', inf: 'i/י _3',
    },
    he: {
      p3: 'a/ה', f3: '. ת a/ה', pl3: 'u/ו', s1: 'i/י',
      ms: 'e/ה', fs: 'a/ה', mp: 'i/י ם', fp: 'o/ו ת',
      fb: 'e/ה', fi: 'i/י', fu: 'u/ו', ims: 'e/ה', ifs: 'i/י', ipl: 'u/ו', inf: 'o/ו ת',
    },
    // a consonantal final ה (גבה: הגביה higbi'a, מגביהה magbiha; גיה: הגיה hegi'a): the ה is silent at the end of a word,
    // with a furtive a after it, and pronounced before an ending
    hcons: {
      p3: "i/י _3 ' a", f3: 'i/י 3 a/ה', pl3: 'i/י 3 u/ו', s1: 'a 3',
      ms: "i/י _3 ' a", fs: 'i/י 3 a/ה', mp: 'i/י 3 i/י ם', fp: 'i/י 3 o/ו ת',
      fb: "i/י _3 ' a", fi: 'i/י 3 i/י', fu: 'i/י 3 u/ו', ims: "e _3 ' a", ifs: 'i/י 3 i/י', ipl: 'i/י 3 u/ו', inf: "i/י _3 ' a",
    },
    // geminate (הגן hegen, מגן megen, אגן agen, הגנתי heganti): used with the hollow head
    gem: {
      p3: 'e 2', f3: 'e 2 a/ה', pl3: 'e 2 u/ו', s1: 'a 2',
      ms: 'e 2', fs: 'e 2 a/ה', mp: 'e 2 i/י ם', fp: 'e 2 o/ו ת',
      fb: 'e 2', fi: 'e 2 i/י', fu: 'e 2 u/ו', ims: 'e 2', ifs: 'e 2 i/י', ipl: 'e 2 u/ו',  inf: 'e 2',
    },
  };
  // pe-nun roots that keep the נ in the hif'il (הנפיק hinpik); also every root with a guttural second letter
  const NUN_KEPT = ['נמך', 'נצח', 'נדר', 'נפק'].map(norm);
  // roots whose last ה is a consonant (not the lamed-he vowel): הגביה higbi'a, הגיה hegi'a (hollow head)
  const HI_CONS_HE = ['גבה', 'גיה'].map(norm);
  // geminate roots that take the hegen pattern (הגן, הקל, הסב, האט, העז); other geminates are strong (הפליל, התסיס)
  const HI_GEM = ['גנן', 'סבב', 'אטט', 'עזז', 'קלל', 'רעע', 'דקק', 'חלל', 'פרר', 'מסס', 'צלל'].map(norm);
  // pe-nun roots whose hif'il has e after the ה (הפיק hefik, הטיל hetil, השיא hesi), not i (הפיל hipil)
  const HI_E = ['נטל', 'נשא'].map(norm);

  function hifilBuild(headName, tailName, g3, root) {
    const H = HI_HEADS[headName], T = HI_TAILS[tailName];
    const cat = (a, b) => `${a} ${b}`;
    return {
      root,
      inf: cat(H.inf, T.inf),
      past: { p3: cat(H.past, T.p3), f3: cat(H.past, T.f3), pl3: cat(H.past, T.pl3), s1: cat(H.past, T.s1) },
      pres: { ms: cat(H.pres, T.ms), fs: cat(H.pres, T.fs), mp: cat(H.pres, T.mp), fp: cat(H.pres, T.fp) },
      fut: { pre: p => `${PREFIX[p]} ${H.pre}`, bare: cat(H.fut, T.fb), i: cat(H.fut, T.fi), u: cat(H.fut, T.fu) },
      imp: { ms: cat(H.imp, g3 && tailName === 'strong' ? 'a 3' : T.ims), fs: cat(H.imp, T.ifs), pl: cat(H.imp, T.ipl) },
    };
  }

  function hifilSpec(rootIn, key) {
    const root = collapseVav(rootIn);
    if (root !== rootIn) {                                  // הרוויח hirviakh: a consonantal ו
      const s = hifilSpec3(root, root[1] === 'ו' || root[0] === 'ו' ? 'vav' : 'yod');
      s.root = root;
      return s;
    }
    return hifilSpec3(root, '');
  }
  function hifilSpec3(root, collapsed) {
    const [r1, r2, r3] = root;
    const k = spell(root);
    if (Object.hasOwn(HIFIL_IRREGULAR, k)) return HIFIL_IRREGULAR[k]();
    if (root.length === 4) fail(`hif'il root ${k} has four letters (not supported)`);
    const tail = r3 === 'ה' ? (HI_CONS_HE.includes(k) ? 'hcons' : 'he') : r3 === 'א' ? 'alef' : 'strong';
    const g3 = r3 === 'ח' || r3 === 'ע';
    if (collapsed === 'vav' && r2 === 'ו' && tail === 'strong') return hifilBuild('std', 'strong', g3);
    if ((r2 === 'ו' || r2 === 'י') && tail !== 'he') {
      const s = hifilBuild('hollow', tail, g3);
      if (tail === 'alef') s.past.s1 = 'ה e 1 a _3';        // הבאתי hevati, but הביא hevi
      return s;
    }
    if (r2 === r3 && tail === 'strong' && HI_GEM.includes(k)) return hifilBuild('hollow', 'gem', false);
    if (r1 === 'ו') fail(`hif'il root ${k} starts with ו, which is not supported`);
    let head = 'std';
    // pe-yod roots with צ behave like pe-nun in the hif'il: הציג hitsig, הציע hitsi'a, הציב hitsiv (but יצא: הוציא)
    if (r1 === 'י' && r2 === 'צ' && tail === 'strong') head = 'penun';
    else if (r1 === 'י') head = 'peyod';
    else if (r1 === 'נ' && !isG(r2) && !NUN_KEPT.includes(k)) head = HI_E.includes(k) ? 'penunE' : 'penun';
    else if (r1 === 'א' || r1 === 'ע') head = 'gutAe';
    else if (r1 === 'ה' || r1 === 'ח') head = 'gutHh';
    return hifilBuild(head, tail, g3);
  }

  // לביא (הביא): the present has me-, the imperative is הבא
  const HIFIL_IRREGULAR = keyed({
    // להפיק hefik, mafik (produce): written with the root פוק (as in Biblical תפק); the root נפק keeps its נ: להנפיק hinpik (issue)
    'פוק': () => hifilBuild('penunE', 'strong', false, ['נ', 'פ', 'ק']),
    // להרוויח hirviakh (earn): the ו is a consonant, so רוח is strong here; להריח (smell) is written with the root ריח
    'רוח': () => hifilBuild('std', 'strong', true),
    // הניח henikh, but הנחתי hinakhti
    // להניק: ינק henik, מניק menik (the י is kept as a vowel, the נ as a consonant)
    'ינק': () => hifilBuild('hollow', 'strong', false, ['נ', 'י', 'ק']),
    // הוזיל hozil: like a pe-yod verb
    'זול': () => hifilBuild('peyod', 'strong', false, ['י', 'ז', 'ל']),
    'נוח': () => { const s = hifilBuild('hollow', 'strong', true); s.past.s1 = 'ה i 1 a 3'; return s; },
    'בוא': () => {
      const s = hifilBuild('hollow', 'alef', false);
      s.imp = { ms: 'ה a 1 e _3', fs: 'ה a 1 i/י 3 i/י', pl: 'ה a 1 i/י 3 u/ו' };
      s.past.s1 = 'ה e 1 a _3';
      return s;
    },
  });

  // ---- Nif'al ----------------------------------------------------------------------------------------
  // HEAD (up to the second radical, by the first radical) + TAIL (by the last radical).
  const NI_HEADS = {
    plain: { past: 'נ i 1 2', fut: '!1 a 2', pre: 'i/י', imp: 'ה i/י !1 a 2', inf: 'ל e ה i/י !1 a 2' },
    // א ע first: נאסף ne'esaf, ייעלם ye'alem
    ae: { past: 'נ e 1 e 2', fut: '1 a 2', pre: 'e/י', imp: 'ה e/י 1 a 2', inf: 'ל e ה e/י 1 a 2' },
    // ה ח first: נחשב nekhshav, ייחשב yekhashev
    hh: { past: 'נ e 1 2', fut: '1 a 2', pre: 'e/י', imp: 'ה e/י 1 a 2', inf: 'ל e ה e/י 1 a 2' },
    // pe-yod: נולד nolad, ייוולד yivaled
    peyod: { past: 'נ o/ו 2', fut: 'ו a 2', pre: 'i/י', imp: 'ה i/י ו a 2', inf: 'ל e ה i/י ו a 2' },
  };

  function nifalTail(name, g2, g3, peyod) {
    const e = g2 ? 'a' : '.';
    if (name === 'he') {
      return {
        p3: 'a/ה', f3: '. ת a/ה', pl3: 'u/ו', s1: 'e/י', ms: 'e/ה', fs: 'e/י ת', mp: 'i/י ם', fp: 'o/ו ת',
        fb: 'e/ה', fi: 'i/י', fu: 'u/ו', inf: 'o/ו ת',
      };
    }
    if (name === 'alef') {
      return {
        p3: 'a 3', f3: 'e 3 a/ה', pl3: 'e 3 u/ו', s1: 'e 3', ms: 'a 3', fs: 'e 3 ת', mp: 'a 3 i/י ם', fp: 'a 3 o/ו ת',
        fb: 'e 3', fi: 'e 3 i/י', fu: 'e 3 u/ו', inf: 'e 3',
      };
    }
    return {
      p3: 'a 3', f3: peyod ? '. 3 a/ה' : g2 ? 'a 3 a/ה' : 'e 3 a/ה', pl3: peyod ? '. 3 u/ו' : g2 ? 'a 3 u/ו' : 'e 3 u/ו', s1: 'a 3',
      ms: 'a 3', fs: g3 ? 'a 3 a ת' : 'e 3 e ת', mp: 'a 3 i/י ם', fp: 'a 3 o/ו ת',
      fb: g3 ? 'a 3' : 'e 3', fi: `${e} 3 i/י`, fu: `${e} 3 u/ו`, inf: g3 ? 'a 3' : 'e 3',
    };
  }

  // ayin-vav / ayin-yod (נסוג nasog, נכון nakhon, נבון navon): past and present C1 a o C3
  function nifalHollow() {
    return {
      inf: 'ל e ה i/י !1 o/ו 3',
      past: { p3: 'נ a 1 o/ו 3', f3: 'נ a 1 o/ו 3 a/ה', pl3: 'נ a 1 o/ו 3 u/ו', s1: 'נ a 1 o/ו 3' },
      pres: { ms: 'נ a 1 o/ו 3', fs: 'נ a 1 o/ו 3 a/ה', mp: 'נ a 1 o/ו 3 i/י ם', fp: 'נ a 1 o/ו 3 o/ו ת' },
      fut: { pre: p => (p === 0 ? 'א e' : `${PREFIX[p]} i/י`), bare: '!1 o/ו 3', i: '!1 o/ו 3 i/י', u: '!1 o/ו 3 u/ו' },
      imp: { ms: 'ה i/י !1 o/ו 3', fs: 'ה i/י !1 o/ו 3 i/י', pl: 'ה i/י !1 o/ו 3 u/ו' },
    };
  }

  // geminate (נמס nimas, נמסה nimsa, נמסתי nimasti, יימס yimas, להימס lehimas): like the strong verb with C2 = C3 written once
  function nifalGeminate() {
    return {
      inf: 'ל e ה i/י !1 a 2',
      past: { p3: 'נ i 1 a 2', f3: 'נ i 1 2 a/ה', pl3: 'נ i 1 2 u/ו', s1: 'נ i 1 a 2' },
      pres: { ms: 'נ i 1 a 2', fs: 'נ i 1 2 a/ה', mp: 'נ i 1 a 2 i/י ם', fp: 'נ i 1 a 2 o/ו ת' },
      fut: { pre: p => (p === 0 ? 'א e' : `${PREFIX[p]} i/י`), bare: '!1 a 2', i: '!1 a 2 i/י', u: '!1 a 2 u/ו' },
      imp: { ms: 'ה i/י !1 a 2', fs: 'ה i/י !1 a 2 i/י', pl: 'ה i/י !1 a 2 u/ו' },
    };
  }

  // ליהנות lehanot (to enjoy, root הנה): the infinitive drops the second ה and the future has no i after its prefix
  // (אהנה ehane, תהנה tehane, יהנה yehane); the past and present keep the e of נהנה nehene
  function nifalHane() {
    const T = nifalTail('he', false, false, false);
    const c = (a, b) => `${a} ${b}`;
    const past = 'נ e 1 e 2';
    return {
      inf: c('ל e/י 1 a 2', T.inf),
      past: { p3: c(past, T.p3), f3: c(past, T.f3), pl3: c(past, T.pl3), s1: c(past, T.s1) },
      pres: { ms: c(past, T.ms), fs: c(past, T.fs), mp: c(past, T.mp), fp: c(past, T.fp) },
      fut: { pre: p => (p === 0 ? 'א e' : `${PREFIX[p]} e`), bare: c('1 a 2', T.fb), i: c('1 a 2', T.fi), u: c('1 a 2', T.fu) },
      imp: { ms: c('ה e/י 1 a 2', T.fb), fs: c('ה e/י 1 a 2', T.fi), pl: c('ה e/י 1 a 2', T.fu) },
    };
  }

  function nifalSpec(root) {
    const [r1, r2, r3] = root;
    const k = spell(root);
    if (k === 'הנה') return nifalHane();
    if (root.length === 4) fail(`nif'al root ${k} has four letters (not supported)`);
    if (r2 === 'ו' || r2 === 'י') {
      if (r3 === 'ה' || r3 === 'א') fail(`nif'al root ${k} is ayin-vav/yod with a weak last letter (not supported)`);
      return nifalHollow(root);
    }
    if (r2 === r3 && r3 !== 'ה' && !isG(r1) && r1 !== 'ו' && r1 !== 'י') return nifalGeminate();
    if (r2 === r3 && r3 !== 'ה') fail(`nif'al root ${k} is geminate with a guttural, ו or י first letter (not supported)`);
    if (r1 === 'ו') fail(`nif'al root ${k} starts with ו, which is not supported`);
    const tailName = r3 === 'ה' ? 'he' : r3 === 'א' ? 'alef' : 'strong';
    let head = 'plain';
    if (r1 === 'י') head = 'peyod';
    else if (r1 === 'א' || r1 === 'ע') head = 'ae';
    else if (r1 === 'ה' || r1 === 'ח') head = 'hh';
    if (head === 'peyod' && tailName !== 'strong') fail(`nif'al root ${k}: pe-yod with a weak last letter is not supported`);
    const H = NI_HEADS[head];
    const T = nifalTail(tailName, isG(r2) && tailName === 'strong', r3 === 'ח' || r3 === 'ע', head === 'peyod');
    const c = (a, b) => `${a} ${b}`;
    return {
      inf: c(H.inf, T.inf),
      past: { p3: c(H.past, T.p3), f3: c(H.past, T.f3), pl3: c(H.past, T.pl3), s1: c(H.past, T.s1) },
      pres: { ms: c(H.past, T.ms), fs: c(H.past, T.fs), mp: c(H.past, T.mp), fp: c(H.past, T.fp) },
      fut: {
        pre: p => (p === 0 ? 'א e' : `${PREFIX[p]} ${H.pre}`),
        bare: c(H.fut, T.fb), i: c(H.fut, T.fi), u: c(H.fut, T.fu),
      },
      imp: { ms: c(H.imp, T.fb), fs: c(H.imp, T.fi), pl: c(H.imp, T.fu) },
    };
  }

  // ---- Hitpa'el ----------------------------------------------------------------------------------------
  // The ת of the prefix hit- swaps places with a sibilant first radical and changes with it:
  // הסתכל histakel, השתמש hishtamesh, הצטער hitstaer (ת -> ט), הזדקן hizdaken (ת -> ד).
  const HIT_INFIX = { 'ס': '1 ת', 'ש': '1 ת', [SIN]: '1 ת', 'צ': '1 ט', 'ז': '1 ד' };
  // geminate roots that take the hitpolel pattern (הסתובב histovev); other geminates are regular (התפלל)
  const HIT_POLEL_GEM = ['סבב', 'גנן', 'רעע', 'כפף'].map(norm);

  // hollow roots whose hitpa'el has a consonantal י (התקיים hitkayem, התגייס hitgayes); other hollow roots are hitpolel
  const HIT_YOD = ['קום', 'גיס', 'גוס', 'בוש', 'גיר', 'עיף', 'חיב', 'חוב', 'פיס', 'ניד', 'סים', 'צין', 'שיך', 'דין'].map(norm);
  // hollow roots whose hitpa'el has a consonantal ו (התכוון hitkaven)
  const HIT_VAV = ['כון', 'כוץ', 'שוק'].map(norm);

  // השתחווה hishtakhava (to bow): the root is שחוה, a four-letter lamed-he root with a consonantal ו
  const HIT_SHAHE = ['שחה'].map(norm);
  function hitpaelShahe() {
    const T = {
      p3: 'a/ה', f3: '. ת a/ה', pl3: 'u/ו', s1: 'i/י', ms: 'e/ה', fs: 'a/ה', mp: 'i/י ם', fp: 'o/ו ת',
      fb: 'e/ה', fi: 'i/י', fu: 'u/ו', inf: 'o/ו ת',
    };
    const c = (...parts) => parts.join(' ');
    const body = 'a 2 a 3', pastHead = c('ה i 1 ת', body), presHead = c('מ i 1 ת', body);
    return {
      root: ['ש', 'ח', 'ו', 'ה'],
      inf: c('ל e ה i 1 ת', body, T.inf),
      past: { p3: c(pastHead, T.p3), f3: c(pastHead, T.f3), pl3: c(pastHead, T.pl3), s1: c(pastHead, T.s1) },
      pres: { ms: c(presHead, T.ms), fs: c(presHead, T.fs), mp: c(presHead, T.mp), fp: c(presHead, T.fp) },
      fut: { pre: p => `${PREFIX[p]} ${p === 0 ? 'e' : 'i'}`, bare: c('1 ת', body, T.fb), i: c('1 ת', body, T.fi), u: c('1 ת', body, T.fu) },
      imp: { ms: c('ה i 1 ת', body, T.fb), fs: c('ה i 1 ת', body, T.fi), pl: c('ה i 1 ת', body, T.fu) },
    };
  }

  function hitpaelSpec(rootIn) {
    if (HIT_SHAHE.includes(spell(rootIn))) return hitpaelShahe();
    const root0 = collapseVav(rootIn);
    const k0 = spell(root0);
    const yod = root0.length === 3 && HIT_YOD.includes(k0);
    const root = yod ? [root0[0], 'י', root0[2]] : root0;      // treated like a strong root with a consonantal י
    const [r1, r2, r3] = root;
    const k = spell(root);
    if (root.length === 4 && r4Weak(root)) fail(`hitpa'el root ${k}: a four-letter root ending in a weak letter is not supported`);
    const quad = root.length === 4;
    const infix = HIT_INFIX[r1] || 'ת +1';
    const vav = root.length === 3 && (root !== rootIn && r2 === 'ו' || HIT_VAV.includes(k));   // התכוון hitkaven
    const polelQuad = quad && r2 === 'ו';                  // התעורר hit'orer, התפוצץ hitpotsets
    const polel = polelQuad || !quad && !yod && !vav && r3 !== 'ה' && r3 !== 'א' && (r2 === 'ו' || r2 === 'י' || (r2 === r3 && HIT_POLEL_GEM.includes(k)));
    const tail = quad || polel ? 'strong' : r3 === 'ה' ? 'he' : r3 === 'א' ? 'alef' : 'strong';
    const lastLetter = root[root.length - 1];
    const g3 = lastLetter === 'ח' || lastLetter === 'ע';
    // vowel before the suffixes -a -u -im -ot -i: e is kept for four radicals, hitpolel and C2 = C3;
    // a guttural second radical keeps a full vowel (מתנהגים mitnahagim); otherwise a reduced vowel
    const e = quad || polel || r2 === r3 ? 'e' : isG(r2) ? 'a' : '.';
    const body = polel ? 'o/ו 3' : quad ? 'a 2 3' : yod ? 'a +2' : 'a !2';    // hitpolel: C1 o C3 e C3 (התגורר hitgorer)
    const last = quad ? '4' : '3';
    let T;
    if (tail === 'strong') {
      T = {
        p3: `e ${last}`, f3: `${e} ${last} a/ה`, pl3: `${e} ${last} u/ו`, s1: `a ${last}`,
        ms: `e ${last}`, fs: g3 ? `a ${last} a ת` : `e ${last} e ת`, mp: `${e} ${last} i/י ם`, fp: `${e} ${last} o/ו ת`,
        fb: `e ${last}`, fi: `${e} ${last} i/י`, fu: `${e} ${last} u/ו`, inf: `e ${last}`,
      };
    } else if (tail === 'alef') {
      T = {
        p3: 'e 3', f3: '. 3 a/ה', pl3: '. 3 u/ו', s1: 'e 3', ms: 'e 3', fs: 'e 3 ת', mp: '. 3 i/י ם', fp: '. 3 o/ו ת',
        fb: 'e 3', fi: 'e 3 i/י', fu: 'e 3 u/ו', inf: 'e 3',
      };
    } else {
      T = {
        p3: 'a/ה', f3: '. ת a/ה', pl3: 'u/ו', s1: 'i/י', ms: 'e/ה', fs: 'a/ה', mp: 'i/י ם', fp: 'o/ו ת',
        fb: 'e/ה', fi: 'i/י', fu: 'u/ו', inf: 'o/ו ת',
      };
    }
    const c = (...parts) => parts.join(' ');
    const pastHead = c('ה i', infix, body), presHead = c('מ i', infix, body);
    const fb = body;
    return {
      root: yod || root !== rootIn ? root : undefined,
      inf: c('ל e ה i', infix, fb, T.inf),
      past: { p3: c(pastHead, T.p3), f3: c(pastHead, T.f3), pl3: c(pastHead, T.pl3), s1: c(pastHead, T.s1) },
      pres: { ms: c(presHead, T.ms), fs: c(presHead, T.fs), mp: c(presHead, T.mp), fp: c(presHead, T.fp) },
      fut: { pre: p => `${PREFIX[p]} ${p === 0 ? 'e' : 'i'}`, bare: c(infix, fb, T.fb), i: c(infix, fb, T.fi), u: c(infix, fb, T.fu) },
      imp: { ms: c('ה i', infix, fb, T.fb), fs: c('ה i', infix, fb, T.fi), pl: c('ה i', infix, fb, T.fu) },
    };
  }
  const r4Weak = root => root[3] === 'ה' || root[3] === 'א';

  // ---- Huf'al (strong roots only): the passive of the hif'il, used with the infinitive להורכב lehorkav ------------
  function hufalSpec(root) {
    const k = spell(root);
    if (root.length !== 3 || [root[0], root[1], root[2]].some(l => 'וי'.includes(l)) || root[2] === 'ה' || root[2] === 'א' || root[0] === 'נ') {
      fail(`huf'al root ${k}: only strong three-letter roots are supported`);
    }
    return {
      inf: 'ל e ה o/ו 1 2 a 3',
      past: { p3: 'ה o/ו 1 2 a 3', f3: 'ה o/ו 1 2 e 3 a/ה', pl3: 'ה o/ו 1 2 e 3 u/ו', s1: 'ה o/ו 1 2 a 3' },
      pres: { ms: 'מ u/ו 1 2 a 3', fs: 'מ u/ו 1 2 e 3 e ת', mp: 'מ u/ו 1 2 a 3 i/י ם', fp: 'מ u/ו 1 2 a 3 o/ו ת' },
      fut: { pre: p => `${PREFIX[p]} o/ו`, bare: '1 2 a 3', i: '1 2 e 3 i/י', u: '1 2 e 3 u/ו' },
      imp: null,
    };
  }

  function specFor({ binyan, root, fv, key }) {
    if (binyan === 'pa') return paalSpec(root, fv, key);
    if (binyan === 'pi') return pielSpec(root);
    if (binyan === 'hi') return hifilSpec(root, key);
    if (binyan === 'ni') return nifalSpec(root);
    if (binyan === 'hit') return hitpaelSpec(root);
    if (binyan === 'hu') return hufalSpec(root);
    return fail(`binyan ${binyan} is not built yet`);
  }

  function express(entry) {
    const read = readEntry(entry);
    const spec = specFor(read);
    const rows = buildRows(spec, read.root);
    return { he: rows.inf[0].he, tr: rows.inf[0].tr, rows };
  }

  const api = { express, ROW_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Hebrew = api;
})(typeof window !== 'undefined' ? window : globalThis);
