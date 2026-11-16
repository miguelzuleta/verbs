/*
 * Icelandic verb conjugation engine (standard Icelandic).
 *
 *   conjugate('taka', ['tek', 'tekur', 'tók', 'tókum', 'tekið']) -> { inf, gerund, participle, forms }
 *   conjugate('tala')                                           -> the regular weak verb of class 1
 *
 * Input is the infinitive and, for every verb except a regular weak verb of class 1
 * (tala, talaði, talað), the five principal parts
 *   [present 1sg, present 2sg, past 1sg, past 1pl, supine]
 * e.g. heyra -> ['heyri', 'heyrir', 'heyrði', 'heyrðum', 'heyrt'],
 *      fara  -> ['fer', 'ferð', 'fór', 'fórum', 'farið'].
 * Everything else is derived (the engine never looks the verb up in a dictionary):
 *   - present 3sg: the 2sg when it ends in -ur / -ir / -ar, the 2sg minus its -ð when it
 *     ends in -rð or -r (ferð -> fer, sérð -> sér, færð -> fær), otherwise the 1sg
 *     (veit, veist -> veit; á, átt -> á; er, ert -> er; the one exception is vilja: vill);
 *   - present plural from the infinitive stem, with the u-umlaut a > ö before -um
 *     (tölum, förum, höfum) and the j of a -ja stem dropped before -i after g, k or a
 *     vowel (sækið, leggið, but teljið, setjið);
 *   - past: strong -, -st, -, -um, -uð, -u; weak -i, -ir, -i, -um, -uð, -u;
 *   - past subjunctive: strong verbs from the past plural stem with i-umlaut and -i
 *     (tókum -> tæki, tækjum), weak verbs equal to the past indicative except the
 *     verbs whose past vowel is umlauted again (taldi -> teldi, sagði -> segði,
 *     hafði -> hefði, átti -> ætti, ...);
 *   - present subjunctive: stem + -i, -ir, -i, plural as the indicative, -i.
 * All compound tenses use hafa + supine (no vera + participle).
 *
 * Every entry in `forms` is an array of six strings in person order
 * (ég, þú, hann/hún/það, við, þið, þeir/þær/þau), written without the pronoun.
 * A form that does not exist is NONE ("—"): the modal verbs (munu, skulu, vilja, mega,
 * þurfa, kunna) have no imperative; munu and skulu have only the present and the past
 * (no supine, no present participle, no compound tense, so those rows and `participle` /
 * `gerund` are NONE); the weather verbs (rigna, snjóa, ...) exist only in the 3rd person
 * singular. impAff has the 2sg imperative (talaðu, taktu, komdu) and borrows the present
 * forms for við and þið (vera: verum, verið). The imperative stem takes -ðu after a vowel,
 * r, f, g; -du after l, m, n, ng; -tu after p, t, k, s, x; nd + u (sendu; hentu after a
 * t-past); ð + ddu (bíddu); the exceptions vertu, stattu, haltu, gakktu, legðu, þegiðu (also in compounds:
 * sniðgakktu, eyðilegðu). A t after a consonant is not doubled (skiptu, eltu, birtu; but sittu, breyttu after
 * a vowel), and nn + a t-past gives -ntu (kynntu, minntu; but kenndu after kenndi).
 * -ja and -va stems lose the j / v there (teldu, hrökktu) but keep it in the plural.
 *
 * `gerund` is the present participle (talandi), `participle` the supine (talað, tekið).
 * conjugate returns null for anything it cannot conjugate with confidence: empty or
 * non-verb input, an infinitive in -st (middle voice), parts of the wrong length or shape,
 * parts that contradict each other (a weak past plural that does not fit the past 1sg), and
 * a verb that needs its parts (taka, heyra, telja) given without them.
 *
 * Limit: without parts the engine cannot tell a regular class-1 verb (tala) from a weak verb
 * in -di / -ti / -ði (heyra, kenna, mæta). NEEDS_PARTS lists the common strong, irregular and
 * other weak verbs and refuses them without parts (also with a prefix: yfirgefa, upptelja);
 * any other infinitive in -a given without parts is treated as class 1, so whoever writes the
 * verb table must give the parts of every verb that is not -aði.
 */
(function (global) {
  'use strict';

  const { words, findFamily, compound } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  const six = words;
  const NONE = '—';
  const VOWELS = 'aáeéiíoóuúyýæö';
  const isVowel = c => VOWELS.includes(c);

  // ---- Letters and vowel changes --------------------------------------------------

  // The last group of vowel letters: 'tak' -> 'a', 'stand' -> 'a', 'tók' -> 'ó', 'hlaup' -> 'au'.
  // The j and v of -ja / -va stems count as consonants.
  const LAST_VOWEL = /([aáeéiíoóuúyýæö]+)([^aáeéiíoóuúyýæö]*)$/;
  const lastVowel = s => { const m = s.match(LAST_VOWEL); return m ? m[1] : ''; };

  function changeLastVowel(s, map) {
    const m = s.match(LAST_VOWEL);
    if (!m || !Object.hasOwn(map, m[1])) return null;
    return s.slice(0, m.index) + map[m[1]] + m[2];
  }

  // u-umlaut before -um / -u: tal- -> töl- (tölum), far- -> för- (förum), hlaup- stays.
  const U_UMLAUT = { a: 'ö' };
  const uUmlaut = s => changeLastVowel(s, U_UMLAUT) || s;

  // i-umlaut of the past plural stem in the subjunctive: tók- -> tæk-, fund- -> fynd-, kom- -> kæm-.
  // Vowels that cannot change are listed with themselves, so an odd vowel is refused.
  const I_UMLAUT = {
    a: 'e', á: 'æ', o: 'æ', ó: 'æ', u: 'y', ú: 'ý', au: 'ey',
    e: 'e', é: 'é', i: 'i', í: 'í', y: 'y', ý: 'ý', æ: 'æ', ö: 'ö', ei: 'ei', ey: 'ey',
  };
  // The weak verbs whose past vowel is the un-umlauted partner of the present vowel
  // (telja/taldi, spyrja/spurði, ná/náði) take the umlaut again in the subjunctive.
  const WEAK_I_UMLAUT = { a: 'e', u: 'y', ú: 'ý', á: 'æ' };

  // A j before an i after g, k or a vowel is absorbed: sækj- + ið -> sækið; telj- + ið -> teljið.
  const dropJ = stem => (/(?:[gk]|[aáeéiíoóuúyýæö])j$/.test(stem) ? stem.slice(0, -1) : stem);
  const withI = (stem, ending) => dropJ(stem) + ending;

  // ---- Prefixes and verb families ---------------------------------------------------
  //
  // An irregular verb passes its special forms on to prefixed relatives (segja ->
  // afsegja, standa -> viðstanda). Only these prefixes are accepted, so that a verb that
  // merely ends in the same letters (dvelja ends in velja) is not mistaken for a relative.
  // The families whose base cannot be mistaken for the end of an unrelated verb (sækja, standa,
  // halda, ganga, leggja) have no prefix list at all: lögsækja, sniðganga, eyðileggja, kortleggja.
  const PREFIX_LIST = words(`af að aftur and at á bak burt eftir fjar for fram frá fyrir gegn heim hjá inn í
    mis niður of ofan ó ör sam saman sundur til um undan undir upp út van við yfir ný sjálf ofur gjör vel illa
    með ráð sér full`);
  const ANY_PREFIX = [''].concat(PREFIX_LIST);
  const NO_PREFIX = [''];

  // Verbs whose forms cannot be derived from a regular pattern and that must therefore be
  // given with their principal parts: given without parts they are refused (taka -> null),
  // never conjugated as class-1 verbs (taka -> *takaði).
  const NEEDS_PARTS = words(`
    bíta bíða ríða skína stíga síga hníga svíkja víkja drífa hrífa grípa líta
    bjóða brjóta fljúga fjúka ljúga skjóta hljóta njóta kjósa frjósa gjósa lúta sjúga strjúka hnjóta drjúpa
    krjúpa ljúka sjóða hrjóta rjúfa
    finna binda vinna brenna rinna spinna syngja drekka hrökkva springa stinga sökkva verða gjalda gelta bresta
    bera skera stela nema koma fela
    gefa geta vera sitja liggja biðja þiggja éta drepa lesa sjá kveða vega
    fara taka draga standa slá ala hlaða skapa vaxa sverja deyja hefja ausa þvo mala grafa
    halda falla ganga heita hanga láta ráða blása róa snúa búa gráta hlæja hlaupa höggva fá bregða detta gróa rísa
    hverfa hrinda hvetja ryðja kveðja þylja hylja kvelja
    sofa hlýða skýra laða seiða skreyta greiða sleppa hitta spýta dreifa hætta ríkja ræsa ýta virða verja berja
    keyra hirða vænta rekja þrýsta hrista særa næra klæða gæta smyrja minna þrengja lengja sigla synda sveigja
    beygja kæra þola semja gleðja græða hræða skemma ræna dæla fremja sinna frysta gista brosa slökkva venja
    hvíla efla stytta herða rétta hengja sprengja neyða tæla kæfa rýna þreyta framkvæma
    auka reka aka líða sníða kvíða skríða þjóta þrífa vaða verpa skjálfa
    ala hafa vilja vita eiga mega þurfa kunna unna muna munu skulu þora valda þykja yrkja
    heyra læra færa kaupa nefna senda kenna gera segja þegja telja selja setja velja dvelja leggja þekkja
    sækja krefja vefja tefja lemja hemja temja vekja leyfa lifa æfa bæta dæma tæma fæða spyrja hringja
    kveikja reyna kyssa dreyma gleyma týna ræða rigna deila sýna skilja fylla mæta mæla breyta flytja
    tengja merkja kæla byggja þýða eyða lýsa trúa þrá spá ná ljá flá veiða leiða hvessa dimma lygna
  `);

  // True when `inf` is one of the NEEDS_PARTS verbs or a prefixed relative of one.
  function needsParts(inf) {
    for (const base of NEEDS_PARTS) {
      if (!inf.endsWith(base)) continue;
      if (ANY_PREFIX.includes(inf.slice(0, inf.length - base.length))) return true;
    }
    return false;
  }

  // Special forms per base verb (found with findFamily, so prefixed relatives inherit them).
  //   subjPast   past subjunctive 1sg of a weak verb whose vowel changes again
  //   imp        imperative 2sg ('-' prefix stays in front)
  //   noImp      the verb has no imperative
  //   defective  munu, skulu: only the present and the past exist (no supine, no present participle,
  //              no compound tense)
  //   third      present 3sg when the rule would give another form (vilja: vill)
  //   weather    only the 3rd person singular exists
  const FAMILIES = [
    { base: 'sækja', prefixes: undefined, spec: { subjPast: 'sækti' } },
    { base: 'þykja', prefixes: NO_PREFIX, spec: { subjPast: 'þætti' } },
    { base: 'eiga', prefixes: ANY_PREFIX, spec: { subjPast: 'ætti' } },
    { base: 'mega', prefixes: NO_PREFIX, spec: { subjPast: 'mætti', noImp: true } },
    { base: 'þurfa', prefixes: NO_PREFIX, spec: { subjPast: 'þyrfti', noImp: true } },
    { base: 'kunna', prefixes: NO_PREFIX, spec: { subjPast: 'kynni', noImp: true } },
    { base: 'unna', prefixes: NO_PREFIX, spec: { subjPast: 'ynni' } },
    { base: 'munu', prefixes: NO_PREFIX, spec: { subjPast: 'myndi', noImp: true, defective: true } },
    { base: 'muna', prefixes: NO_PREFIX, spec: { subjPast: 'myndi' } },
    { base: 'skulu', prefixes: NO_PREFIX, spec: { noImp: true, defective: true } },
    { base: 'vilja', prefixes: NO_PREFIX, spec: { noImp: true, third: 'vill' } },
    { base: 'valda', prefixes: NO_PREFIX, spec: { subjPast: 'ylli' } },
    { base: 'þora', prefixes: NO_PREFIX, spec: { subjPast: 'þyrði' } },
    { base: 'þola', prefixes: NO_PREFIX, spec: { subjPast: 'þyldi' } },
    { base: 'þiggja', prefixes: ANY_PREFIX, spec: { subjPast: 'þæði' } },
    { base: 'vera', prefixes: NO_PREFIX, spec: { imp: 'vertu', verb: 'vera' } },
    { base: 'standa', prefixes: undefined, spec: { imp: 'stattu' } },
    { base: 'halda', prefixes: undefined, spec: { imp: 'haltu' } },
    { base: 'ganga', prefixes: undefined, spec: { imp: 'gakktu' } },
    { base: 'leggja', prefixes: undefined, spec: { imp: 'legðu' } },
    { base: 'þegja', prefixes: NO_PREFIX, spec: { imp: 'þegiðu' } },
    { base: 'rigna', prefixes: NO_PREFIX, spec: { weather: true } },
    { base: 'snjóa', prefixes: NO_PREFIX, spec: { weather: true } },
    { base: 'hvessa', prefixes: NO_PREFIX, spec: { weather: true } },
    { base: 'hagla', prefixes: NO_PREFIX, spec: { weather: true } },
    { base: 'þruma', prefixes: NO_PREFIX, spec: { weather: true } },
    { base: 'dimma', prefixes: NO_PREFIX, spec: { weather: true } },
    { base: 'lygna', prefixes: NO_PREFIX, spec: { weather: true } },
  ];

  // Merged special forms of a verb: { spec, prefix } or { spec: {}, prefix: '' }.
  function lookup(inf) {
    const found = findFamily(inf, FAMILIES);
    return found ? { spec: found.family.spec, prefix: found.prefix } : { spec: {}, prefix: '' };
  }

  // ---- Auxiliaries (written out, so the compound tenses cannot drift) ---------------

  const HAFA = {
    pres: six('hef hefur hefur höfum hafið hafa'),
    past: six('hafði hafðir hafði höfðum höfðuð höfðu'),
    subjPres: six('hafi hafir hafi höfum hafið hafi'),
    subjPast: six('hefði hefðir hefði hefðum hefðuð hefðu'),
  };
  const MUNU = six('mun munt mun munum munuð munu');
  const MYNDI = six('myndi myndir myndi myndum mynduð myndu');

  // ---- Reading the input ------------------------------------------------------------

  const LETTERS = /^[a-záðéíóúýþæö]+$/;
  const clean = s => (typeof s === 'string' ? s.trim().normalize('NFC').toLowerCase() : null);

  // An infinitive ends in -a (tala), -á (sjá, fá), -o (þvo) or, for two modal verbs, -u (munu, skulu).
  function readInfinitive(input) {
    const inf = clean(input);
    if (!inf || inf.length < 2 || !LETTERS.test(inf)) return null;
    if (/a$/.test(inf)) return inf.length >= 3 && /[aáeéiíoóuúyýæö]/.test(inf.slice(0, -1)) ? inf : null;
    if (/á$/.test(inf) || /þvo$/.test(inf) || /^(?:munu|skulu)$/.test(inf)) return inf;
    return null;
  }

  // The stem the present plural is built on: tala -> tal, telja -> telj, munu -> mun, sjá -> sjá, þvo -> þvo.
  const infStem = inf => (/[au]$/.test(inf) ? inf.slice(0, -1) : inf);

  // ---- Principal parts -------------------------------------------------------------

  // The regular weak verb of class 1 (tala, talaði, talað) as principal parts.
  function regularParts(inf) {
    const stem = inf.slice(0, -1);
    return [inf, inf + 'r', stem + 'aði', uUmlaut(stem) + 'uðum', stem + 'að'];
  }

  // The weak past plural stem that a past 1sg implies: taldi -> töld, heyrði -> heyrð, talaði -> töluð.
  function weakPluralStem(past) {
    const base = past.slice(0, -1);
    if (/að$/.test(base)) return uUmlaut(base.slice(0, -2)) + 'uð';
    return uUmlaut(base);
  }

  // Present 3sg from the 1sg and 2sg (see the header).
  function thirdPerson(p1, p2, special) {
    if (special) return special;
    if (p2 === p1) return p1;                             // blæs, blæs; rís, rís
    if (/(?:ur|ir|ar)$/.test(p2)) return p2;
    if (/rð$/.test(p2)) return p2.slice(0, -1);
    if (/[aáeéiíoóuúyýæö]r$/.test(p2)) return p2;
    if (/t$/.test(p2)) return p1;
    return null;
  }

  // 2sg of a strong past: tók -> tókst, sat -> sast, las -> last, hélt -> hélst, brast -> brast.
  function strongSecond(past) {
    if (/st$/.test(past)) return past;                    // brast -> brast
    if (/t$/.test(past)) return past.slice(0, -1) + 'st';
    if (/[sx]$/.test(past)) return past + 't';                // las -> last, óx -> óxt
    return past + 'st';
  }

  // ---- Imperative ---------------------------------------------------------------------

  // 2sg imperative from the infinitive stem: farðu, komdu, taktu, sendu, haltu, bíddu.
  function imperative(inf, classOne, tPast) {
    if (classOne) return inf + 'ðu';
    let stem = infStem(inf);
    if (/ja$/.test(inf) || /[^aáeéiíoóuúyýæö]va$/.test(inf)) stem = stem.slice(0, -1); // -ja and -va stems: hrökkva -> hrökk
    if (isVowel(stem[stem.length - 1])) return stem + 'ðu';
    if (/(?:ng|lg)$/.test(stem)) return stem + 'du';
    if (/[rfg]$/.test(stem)) return stem + 'ðu';
    if (/nd$/.test(stem)) return tPast ? stem.slice(0, -1) + 'tu' : stem + 'u'; // hentu (henti), sendu (sendi)
    if (/ld$/.test(stem)) return stem.slice(0, -1) + 'tu';
    if (/rð$/.test(stem)) return tPast ? stem.slice(0, -1) + 'tu' : stem + 'u'; // hertu (herti), verðu
    if (/ð$/.test(stem)) return stem.slice(0, -1) + 'ddu';
    if (/ll$/.test(stem)) return stem + 'tu';
    if (/nn$/.test(stem) && tPast) return stem + 'tu';                         // kynntu (kynnti), minntu, sinntu
    if (/[lmn]$/.test(stem)) return stem + 'du';
    if (/tt$|[^aáeéiíoóuúyýæö]t$/.test(stem)) return stem + 'u';                // hittu, skiptu, birtu, eltu, snertu (a t after a consonant is not doubled)
    if (/[ptksx]$/.test(stem)) return stem + 'tu';                             // taktu, lestu, sittu, láttu
    return null;
  }

  // ---- Conjugation ----------------------------------------------------------------------

  // Past subjunctive 1sg of a weak verb: the past indicative unless its vowel is umlauted again.
  function weakSubjunctive(p1, p3, spec, prefix, classOne) {
    if (spec.subjPast) return prefix + spec.subjPast;
    if (classOne) return p3;
    const past = p3.slice(0, -1);
    const pastVowel = lastVowel(past);
    const presVowel = lastVowel(p1.replace(/i$/, ''));
    if (Object.hasOwn(WEAK_I_UMLAUT, pastVowel) && WEAK_I_UMLAUT[pastVowel] === presVowel) {
      return changeLastVowel(past, WEAK_I_UMLAUT) + 'i';
    }
    return p3;
  }

  function conjugate(input, parts) {
    const inf = readInfinitive(input);
    if (!inf) return null;
    const { spec, prefix } = lookup(inf);

    let p;
    if (parts === undefined || parts === null) {
      if (!/a$/.test(inf) || needsParts(inf)) return null; // an irregular verb needs its parts
      p = regularParts(inf);
    } else {
      if (!Array.isArray(parts) || parts.length !== 5) return null;
      p = parts.map(clean);
    }
    if (p.some(part => !part || !LETTERS.test(part))) return null;
    const [p1, p2, p3, p4, supine] = p;

    // ---- the past: strong (tók, tókum) or weak (heyrði, heyrðum) ----
    if (p4.length < 4 || !/um$/.test(p4)) return null;
    const pastPlural = p4.slice(0, -2);
    const weak = /i$/.test(p3);
    if (weak && weakPluralStem(p3) !== pastPlural) return null; // the parts contradict each other
    const classOne = weak && /aði$/.test(p3);

    // ---- the present ----
    const stem = infStem(inf);
    const isVera = spec.verb === 'vera';
    const plural = isVera
      ? ['erum', 'eruð', 'eru']
      : [uUmlaut(stem) + 'um', /u$/.test(inf) ? stem + 'uð' : withI(stem, 'ið'), inf];
    const third = thirdPerson(p1, p2, spec.third);
    if (!third) return null;
    const pres = [p1, p2, third, ...plural];

    const subjPres = isVera
      ? six('sé sért sé séum séuð séu')
      : [withI(stem, 'i'), withI(stem, 'ir'), withI(stem, 'i'), plural[0], plural[1], withI(stem, 'i')];

    // ---- the past and the past subjunctive ----
    const endings = base => [base + 'um', base + 'uð', base + 'u'];
    const past = [p3, weak ? p3 + 'r' : strongSecond(p3), p3, ...endings(pastPlural)];

    let subjPast;
    if (weak) {
      const first = weakSubjunctive(p1, p3, spec, prefix, classOne);
      if (first === p3) subjPast = past;
      else {
        if (!/i$/.test(first)) return null;
        subjPast = [first, first + 'r', first, ...endings(first.slice(0, -1))];
      }
    } else {
      let base = changeLastVowel(pastPlural, I_UMLAUT);
      if (!base) return null;
      base = base.replace(/jy([^aáeéiíoóuúyýæö]*)$/, 'y$1'); // bjuggum -> byggi: ju gives y, not jy
      const j = /[gk]$/.test(base) || isVowel(base[base.length - 1]) ? 'j' : '';
      subjPast = [base + 'i', base + 'ir', base + 'i', ...endings(base + j)];
    }

    // ---- the imperative ----
    let impSg = NONE;
    if (!spec.noImp && !spec.weather) {
      impSg = spec.imp ? prefix + spec.imp : imperative(inf, classOne, weak && /ti$/.test(p3));
      if (!impSg) return null;
    }
    const impAff = spec.noImp || spec.weather
      ? Array(6).fill(NONE)
      : [NONE, impSg, NONE, isVera ? 'verum' : pres[3], isVera ? 'verið' : pres[4], NONE];

    // munu and skulu have neither a supine nor an infinitive that could follow an auxiliary.
    const gone = Array(6).fill(NONE);
    const unless = (missing, make) => (missing ? [...gone] : make());
    const forms = {
      pres,
      past,
      perf: unless(spec.defective, () => compound(HAFA.pres, supine)),
      plup: unless(spec.defective, () => compound(HAFA.past, supine)),
      fut: unless(spec.defective, () => compound(MUNU, inf)),
      futPerf: unless(spec.defective, () => compound(MUNU, `hafa ${supine}`)),
      subjPres,
      subjPast,
      subjPerf: unless(spec.defective, () => compound(HAFA.subjPres, supine)),
      subjPlup: unless(spec.defective, () => compound(HAFA.subjPast, supine)),
      cond: unless(spec.defective, () => compound(MYNDI, inf)),
      condPerf: unless(spec.defective, () => compound(MYNDI, `hafa ${supine}`)),
      impAff,
    };

    // Weather verbs (rigna) exist only in the 3rd person singular.
    if (spec.weather) {
      for (const key of Object.keys(forms)) forms[key] = forms[key].map((form, i) => (i === 2 && key !== 'impAff' ? form : NONE));
    }

    return {
      inf,
      gerund: spec.defective ? NONE : infStem(inf) + 'andi',
      participle: spec.defective ? NONE : supine,
      forms,
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate, NONE };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
