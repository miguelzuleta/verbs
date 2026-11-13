/*
 * Hindi verb pattern engine: standard modern Hindi, written (Devanagari) and romanized.
 *
 *   express({ hi: 'करना', rom: 'karnā', tag: 't' }) -> { hi, rom, rows }
 *
 * Every form is built twice, in parallel: a Devanagari stem is joined with Devanagari
 * endings, and a romanized stem with romanized endings. There is no Devanagari-to-Latin
 * converter, so the two spellings can only drift apart if an ending table is wrong (the
 * tests compare their consonant skeletons).
 *
 * ENTRY (see verbs.js)
 *   hi   the infinitive in Devanagari. A compound is several words (noun or adjective +
 *        करना / होना / देना / लेना ...); only the LAST word is conjugated, the others are
 *        copied in front of it. The last word must end in ना.
 *   rom  its romanization, with the same number of words. The last word ends in nā.
 *   tag  't' if the simple past (and the perfect tenses) of this verb take the subject
 *        marker ने (the verb then agrees with the object, not the subject);
 *        'tf' the same, and the object noun (a leading word, usually the last) is feminine
 *        singular, so the participle is feminine: ने बात की, ने सलाह दी, ने बात की थी;
 *        'tp' the same, and the object noun is masculine PLURAL: the participle is masculine
 *        plural and the auxiliary plural: ने पैसे दिए, ने पैसे दिए हैं, ने पैसे दिए थे;
 *        'tfp' the same, and the object noun is feminine PLURAL: the simple past has the
 *        feminine plural participle (ने आहें भरीं); the perfects have the feminine singular
 *        participle with the plural auxiliary (ने आहें भरी हैं, ने आहें भरी थीं);
 *        'a' an intransitive compound whose last leading word is an adjective or participle
 *        that agrees with the subject (बड़ा होना, डटे रहना): it is given in the masculine
 *        citation form (ending in ा or े) and becomes बड़ा / बड़े / बड़ी like a participle;
 *        's' (state) a compound whose last word is होना and which names a STATE, not a
 *        change (मौजूद होना, हकदार होना, मालिक होना): the present is the copula (मैं हकदार हूँ),
 *        the past is था / थी; the rows that mean "become" (presCont, pastCont, presPerf,
 *        pastPerf) have no forms;
 *        'sa' both: a state whose last leading word agrees with the subject (बना होना:
 *        बना हूँ / बनी हूँ, पड़ा होना);
 *        'd' (dative subject, or the noun is the subject) a compound whose leading noun is the
 *        grammatical subject and the person is in the dative or locative: ज़रूरत होना (मुझे
 *        ज़रूरत है), डर लगना, बाढ़ आना, याद आना. Only the third-person cells exist (वह, वे; the
 *        verb agrees with the noun, whose gender the engine does not know, so the gender pairs
 *        stay); the other five persons and the imperatives have no forms. When the last word is
 *        होना the verb is stative as with 's' (ज़रूरत है / थी);
 *        '' otherwise.
 *
 * ROMANIZATION SCHEME (used for every romanized form)
 *   vowels   a ā i ī u ū e o ai au (no macron on e and o); ṛ for ऋ
 *   consonants  k kh g gh ṅ | c ch j jh ñ | ṭ ṭh ḍ ḍh ṇ | t th d dh n | p ph b bh m
 *            y r l v | ś ṣ s h.   NOTE च is c and छ is ch (c ch j jh, as in IAST).
 *            flaps ṛ (ड़) and ṛh (ढ़); nukta letters z (ज़) and f (फ़)
 *   nasalisation: anusvara and chandrabindu are both written ṁ (hūṁ, haiṁ, kareṁ)
 *   a word-final schwa is not written (kar, not kara). A consonant stem of two or more
 *        syllables also loses the schwa of its last syllable before an ending that begins with
 *        a vowel, as it does in speech: समझ samajh, but समझा samjhā, समझे samjhe, समझिए
 *        samjhiye; बदल badal, but बदला badlā; निकल nikal, but निकली niklī (the script does not
 *        change). Before a consonant ending the schwa stays: samajhtā, badaltā, nikal rahā.
 *   The honorific imperative is written -iye (boliye, kījiye): the glide is heard even
 *   though the script has no य (बोलिए).
 *   Sanskrit-origin nouns that stand in front of the verb keep the schwas of their spelling
 *        (योजना yojanā, सूचना sūcanā, सहायता sahāyatā, घोषणा ghoṣaṇā, आवश्यकता āvaśyakatā,
 *        आराधना ārādhanā, प्राथमिकता prāthamikatā, विनती vinatī, चेतावनी cetāvanī), although a speaker
 *        often drops one of them (yojnā). This is deliberate and the same in every cell: only the
 *        stem of the conjugated verb is romanized as spoken (samjhā, niklā); a noun is written as
 *        its spelling reads, except in the few words where the schwa at the joint of a compound is
 *        dropped in the database (jaldbāzī, karzdār).
 *
 * ROWS: rows[key] is an array of SEVEN cells, one per person, in this order:
 *   मैं, तू, वह, हम, तुम, आप, वे.
 * A cell is { hi, rom } or null where that person has no such form. Forms that depend
 * on the gender of the subject show the masculine and the feminine form in ONE cell
 * joined with " / " (script and romanization alike): "करता हूँ / करती हूँ".
 * The compound's leading words are repeated in each of the two parts.
 *
 * The 11 keys, in order (examples for करना [t] and जाना):
 *   pres      habitual present: करता हूँ / करती हूँ ...
 *   presCont  present continuous: कर रहा हूँ / कर रही हूँ ...
 *   past      simple past. Intransitive: गया / गई (मैं तू वह), गए / गईं (हम तुम आप वे).
 *             [t]: ने किया in all seven cells (the pronoun takes ने; the verb agrees with
 *             the object, shown masculine singular). In a compound the leading words
 *             come after ने: ने काम किया. [tf]: ने बात की (feminine object noun). [tp]: ने
 *             पैसे दिए (masculine plural participle). [tfp]: ने आहें भरीं (feminine plural).
 *   pastHab   habitual past: करता था / करती थी, करते थे / करती थीं
 *   pastCont  past continuous: कर रहा था / कर रही थी, कर रहे थे / कर रही थीं
 *   presPerf  present perfect: गया हूँ / गई हूँ ... गए हैं / गई हैं; [t]: ने किया है;
 *             [tp]: ने दिए हैं; [tfp]: ने भरी हैं
 *   pastPerf  past perfect: गया था / गई थी, गए थे / गई थीं; [t]: ने किया था;
 *             [tp]: ने दिए थे; [tfp]: ने भरी थीं
 *   fut       future: करूँगा / करूँगी ...
 *   subj      present subjunctive (no gender): करूँ, करे, करे, करें, करो, करें, करें
 *   imp       imperative: only तू (कर), हम (करें, "let us"), तुम (करो), आप (कीजिए)
 *   impNeg    मत + the imperative: तू मत कर, तुम मत करो, आप मत कीजिए (no हम form).
 *             In a compound मत stands after the leading words: काम मत करो.
 *
 * Stem classes (the stem is the infinitive without ना):
 *   consonant  कर बोल पढ़ रह        past stem+आ (बोला), subjunctive stem+ऊँ/े/ें/ो
 *   ā          खा जा आ ला पा गा     past stem+या (खाया); endings join as independent vowels
 *                                    (खाऊँ खाए खाएँ खाओ, honorific खाइए)
 *   ī          पी जी सी             the vowel shortens before a vowel (पिया पिए पिऊँ),
 *                                    ो becomes यो (पियो), honorific पीजिए, feminine past पी / पीं
 *   ū          छू                   shortens too (छुआ छुए छुऊँ छुओ, honorific छुइए)
 *   o          सो रो धो खो          past stem+या (सोया); सोऊँ सोए सोएँ सोओ, honorific सोइए
 *   e          दे ले (only these)   दिया / लिया, दूँ दे दें दो, honorific दीजिए / लीजिए
 * Irregular: करना (किया, की; कीजिए), जाना (गया, गई), होना (हुआ; subjunctive हूँ हो हो हों;
 * future हूँगा होगा होंगे). A bare होना shows the copula in pres (हूँ है है हैं हो हैं हैं,
 * no gender) and था / थी in past; होना as the last word of a COMPOUND (खुश होना) is
 * built as "become / happen" in every row: खुश होता हूँ, खुश हुआ, खुश हूँगा; the tags [s] and
 * [d] change that for a compound that names a state.
 *
 * Stative compounds, [s] and [sa] (मौजूद होना, हकदार होना, मालिक होना, आभारी होना):
 *   pres      the copula in front of which the leading words stand, no gender: मैं हकदार हूँ,
 *             हकदार है, हकदार हैं, हकदार हो (with [sa]: बना हूँ / बनी हूँ)
 *   past      था / थी as for the bare होना: हकदार था / हकदार थी, हकदार थे / हकदार थीं
 *   pastHab   unchanged (हकदार होता था); fut and subj unchanged (हकदार होगा, हकदार हो)
 *   presCont pastCont presPerf pastPerf   all seven cells are null: they would mean "become"
 *   imp, impNeg unchanged.
 * Dative-subject compounds, [d] (ज़रूरत होना, डर लगना, बाढ़ आना, याद आना, पसंद आना):
 *   only वह (index 2) and वे (index 6) have forms in every row; the other five persons are
 *   null, and so are imp and impNeg. The verb is built as usual (डर लगता है / डर लगती है,
 *   डर लगा / डर लगी, वे: डर लगते हैं / डर लगती हैं). With होना as the last word the compound
 *   is stative as with [s]: ज़रूरत है, ज़रूरत थी / ज़रूरत था, ज़रूरत होगी / ज़रूरत होगा; the
 *   "become" rows are null as well. The वे cell is the plural agreement (the noun is plural).
 *
 * Limits (not modelled, by design):
 *   - With [t] the verb is shown masculine singular (किया), as the sentence builder wants
 *     one form. The tag [tf] gives the feminine singular (बात की, मदद की, क्षमा की) when the
 *     object noun is a leading word, [tp] and [tfp] the plural forms (ने पैसे दिए, ने
 *     आहें भरीं) when the object noun in the entry is plural. Not modelled: an object that is
 *     not in the entry (ने कपड़े साफ़ किए): there the masculine singular stays, and so does an
 *     adjective in ा before a [t] verb (सीधा करना), which would agree with an object that is
 *     not known. The engine does not check the gender or number of the noun; the tag says it.
 *   - Only the last leading word of an [a] entry agrees with the subject. Any other leading
 *     word is copied unchanged, so a participle that must agree (चला जाना, ले जाना) would come
 *     out wrong for feminine subjects without the tag [a]. Use invariable nouns and
 *     adjectives (खुश, तैयार, काम, ज़िंदा, खाली) as the leading word, or tag [a].
 *   - A dative-subject construction (मुझे ... लगता है) is shown only as the noun's own
 *     forms in the third person (tag [d]); the dative pronoun (मुझे, तुझे ...) is not
 *     generated, and neither is the gender of the noun (both genders are shown). A [d] होना
 *     compound has no continuous or perfect forms (they would be "become"). Events with a noun
 *     subject (बारिश होना) are left untagged: they show all persons.
 *   - A [s] compound has no "become" tenses, and the leading adjective of a state does not
 *     agree with the subject unless it is tagged [sa].
 *   - Passives, causative stems that are not in the entry, and the polite future in -इएगा
 *     are not generated.
 *
 * Refusals: express() THROWS an Error whose message starts with "hindi express():" for an
 * entry it cannot read: not an object, hi or rom missing or with different numbers of
 * words, a last word that does not end in ना / nā, a stem that is empty or ends in a
 * vowel sign it does not know (an unsupported stem), a romanization whose stem vowel
 * disagrees with the script, an unknown tag, [t], [tf], [tp] or [tfp] on जाना / आना / होना
 * (which never take ने), [tf], [tp], [tfp] or [d] without a leading noun, [s] or [sa] on a
 * verb whose last word is not होना or that has no leading word, or [a] / [sa] without a
 * leading word that ends in ा or े.
 * It never returns partial or guessed rows.
 */
(function (global) {
  'use strict';

  const { words } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const ROW_KEYS = [
    'pres', 'presCont', 'past', 'pastHab', 'pastCont', 'presPerf', 'pastPerf', 'fut',
    'subj', 'imp', 'impNeg',
  ];

  function fail(message) {
    throw new Error('hindi express(): ' + message);
  }

  // ---- Pieces: a form in script and in romanization ---------------------------------

  const P = (hi, rom) => ({ hi, rom });
  const cat = (...ps) => P(ps.map(p => p.hi).join(''), ps.map(p => p.rom).join(''));
  const sp = (...ps) => P(ps.map(p => p.hi).join(' '), ps.map(p => p.rom).join(' '));
  // masculine and feminine form in one cell
  const both = (m, f) => P(m.hi + ' / ' + f.hi, m.rom + ' / ' + f.rom);

  // ---- Joining a vowel ending to a stem -------------------------------------------------
  // After a consonant a vowel is written as a vowel sign (matra): कर + ए = करे. After a
  // vowel (a sign, or the independent letter आ) it is written as an independent letter:
  // खा + ए = खाए, सो + ऊँ = सोऊँ.

  const MATRA = { ā: 'ा', i: 'ि', ī: 'ी', u: 'ु', ū: 'ू', e: 'े', ai: 'ै', o: 'ो', au: 'ौ' };
  const LETTER = { ā: 'आ', i: 'इ', ī: 'ई', u: 'उ', ū: 'ऊ', e: 'ए', ai: 'ऐ', o: 'ओ', au: 'औ' };
  const CANDRABINDU = 'ँ';
  const ANUSVARA = 'ं';
  const VOWEL_FINAL = /[\u0904-\u0914\u093E-\u094C\u0955-\u0957]$/;   // an independent vowel letter or a vowel sign

  // Nasalised vowel: the chandrabindu goes on signs without a stroke above the line
  // (ाँ ुँ ूँ) and on the independent ए (खाएँ); everything else takes the anusvara
  // (करें, करीं, गईं, हैं, हों).
  function attach(base, vowel, nasal = false) {
    const afterVowel = VOWEL_FINAL.test(base.hi);
    const letter = afterVowel ? LETTER[vowel] : MATRA[vowel];
    const chandra = vowel === 'ā' || vowel === 'u' || vowel === 'ū' || (vowel === 'e' && afterVowel);
    return P(base.hi + letter + (nasal ? (chandra ? CANDRABINDU : ANUSVARA) : ''), deschwa(base.rom) + vowel + (nasal ? 'ṁ' : ''));
  }

  // The reading of a consonant stem changes when an ending that begins with a vowel joins it: the
  // schwa of the last syllable is not pronounced. समझ samajh + ा is समझा samjhā (not samajhā), बदल
  // badal + े is बदले badle, निकल nikal + ी is निकली niklī. The script does not change, only the
  // romanization. The schwa stays before an ending that begins with a consonant (samajhtā, badal
  // rahā) and in a one-syllable stem (kar + e is kare, cakh + ā is cakhā), because the rule
  // needs a vowel + consonant in front of the schwa and a single consonant after it.
  const ROM_CONSONANT = '(?:kh|gh|ch|jh|ṭh|ḍh|th|dh|ph|bh|ṛh|[bcdfghjklmnprstvyzṛṭḍṇṅñśṣ])';
  const SCHWA_BEFORE_VOWEL = new RegExp(`([aāiīuūeo]ṁ?${ROM_CONSONANT})a(${ROM_CONSONANT})$`);
  const deschwa = rom => rom.replace(SCHWA_BEFORE_VOWEL, '$1$2');

  // ---- Endings and auxiliaries ------------------------------------------------------------

  const TA = P('ता', 'tā'), TE = P('ते', 'te'), TI = P('ती', 'tī');            // habitual participle
  const RAHA = P('रहा', 'rahā'), RAHE = P('रहे', 'rahe'), RAHI = P('रही', 'rahī'); // continuous
  const GA = P('गा', 'gā'), GE = P('गे', 'ge'), GI = P('गी', 'gī');             // future
  const THA = P('था', 'thā'), THE = P('थे', 'the'), THI = P('थी', 'thī'), THIN = P('थीं', 'thīṁ');
  const HOON = [P('हूँ', 'hūṁ'), P('है', 'hai'), P('है', 'hai'), P('हैं', 'haiṁ'), P('हो', 'ho'), P('हैं', 'haiṁ'), P('हैं', 'haiṁ')];
  const NE = P('ने', 'ne');
  const MAT = P('मत', 'mat');

  // The present subjunctive ending of each person: [vowel, nasalised]
  const SUBJ_ENDINGS = [['ū', true], ['e', false], ['e', false], ['e', true], ['o', false], ['e', true], ['e', true]];

  const plural = p => p >= 3;   // हम तुम आप वे take the plural forms (तुम and आप are plural in form)

  // ---- Irregular verbs (keyed by the last word) -----------------------------------------------
  // pp = the perfective participle: masculine singular, masculine plural, feminine singular,
  // feminine plural (किया, किए, की, कीं). hon = the honorific imperative.

  const PP = (ms, mp, fs, fp) => ({ ms, mp, fs, fp });
  const IRREGULAR = {
    'करना': { rom: 'karnā', hon: P('कीजिए', 'kījiye'), pp: PP(P('किया', 'kiyā'), P('किए', 'kie'), P('की', 'kī'), P('कीं', 'kīṁ')) },
    'जाना': { rom: 'jānā', pp: PP(P('गया', 'gayā'), P('गए', 'gae'), P('गई', 'gaī'), P('गईं', 'gaīṁ')) },
    'होना': {
      rom: 'honā',
      pp: PP(P('हुआ', 'huā'), P('हुए', 'hue'), P('हुई', 'huī'), P('हुईं', 'huīṁ')),
      subj: [P('हूँ', 'hūṁ'), P('हो', 'ho'), P('हो', 'ho'), P('हों', 'hoṁ'), P('हो', 'ho'), P('हों', 'hoṁ'), P('हों', 'hoṁ')],
    },
    'देना': { rom: 'denā', hon: P('दीजिए', 'dījiye'), pp: PP(P('दिया', 'diyā'), P('दिए', 'die'), P('दी', 'dī'), P('दीं', 'dīṁ')) },
    'लेना': { rom: 'lenā', hon: P('लीजिए', 'lījiye'), pp: PP(P('लिया', 'liyā'), P('लिए', 'lie'), P('ली', 'lī'), P('लीं', 'līṁ')) },
  };
  // Verbs that never take ने in the simple past
  const NO_ERGATIVE = ['जाना', 'आना', 'होना'];
  const ERGATIVE_TAGS = ['t', 'tf', 'tp', 'tfp'];
  const TAGS = ['', ...ERGATIVE_TAGS, 'a', 's', 'sa', 'd'];
  // the tags that need a leading noun, and what each one says about it (for the error message)
  const NEEDS_NOUN = { tf: 'feminine object', tp: 'masculine plural object', tfp: 'feminine plural object', d: 'the noun is the subject' };

  // ---- Reading an entry ----------------------------------------------------------------------

  // The honorific imperative: stem + इए (बोलिए, खाइए, सोइए, छुइए); ई-stems and the irregular
  // verbs have -ीजिए.
  const honorific = base => P(attach(base, 'i').hi + 'ए', deschwa(base.rom) + 'iye');

  const shorten = stem => ({
    hi: stem.hi.slice(0, -1) + (stem.hi.endsWith('ी') ? 'ि' : 'ु'),
    rom: stem.rom.slice(0, -1) + (stem.rom.endsWith('ī') ? 'i' : 'u'),
  });

  // The stem of the last word: its class, the base the subjunctive endings join to, and
  // the participle forms.
  function readStem(hi, rom) {
    const stem = P(hi.slice(0, -2), rom.slice(0, -2));
    if (!stem.hi) fail(`"${hi}" has no stem before ना`);
    const last = stem.hi.slice(-1);
    let cls;
    if (/[\u0915-\u0939]\u093C?$/.test(stem.hi)) cls = 'c';   // a consonant letter, with or without nukta
    else if (stem.hi === 'आ' || last === 'ा') cls = 'ā';
    else if (last === 'ी') cls = 'ī';
    else if (last === 'ू') cls = 'ū';
    else if (last === 'ो') cls = 'o';
    else if (last === 'े') cls = 'e';
    else fail(`unsupported stem "${stem.hi}" in "${hi}": a stem must end in a consonant or in ा ी ू ो े`);
    if (cls === 'e' && !Object.hasOwn(IRREGULAR, hi)) {
      fail(`unsupported stem "${stem.hi}" in "${hi}": the only stems in े that are known are देना and लेना`);
    }

    const romFinal = stem.rom.slice(-1);
    const wantFinal = { ā: 'ā', ī: 'ī', ū: 'ū', o: 'o', e: 'e' }[cls];
    if (cls === 'c' ? !stem.rom || /[aāiīuūeo]/.test(romFinal) : romFinal !== wantFinal) {
      fail(`the romanization "${rom}" does not fit the stem of "${hi}" (${cls === 'c' ? 'a consonant stem has no final vowel or schwa, write kar not kara' : 'the stem must end in ' + wantFinal})`);
    }

    let sub = stem;   // what the subjunctive endings join to
    let glide = false;
    let pp;
    let hon;
    if (cls === 'c') {
      pp = PP(attach(stem, 'ā'), attach(stem, 'e'), attach(stem, 'ī'), attach(stem, 'ī', true));
    } else if (cls === 'ā' || cls === 'o') {
      pp = PP(cat(stem, P('या', 'yā')), attach(stem, 'e'), attach(stem, 'ī'), attach(stem, 'ī', true));
    } else if (cls === 'ī') {
      sub = shorten(stem);
      glide = true;   // पियो, not पिओ
      pp = PP(cat(sub, P('या', 'yā')), attach(sub, 'e'), stem, P(stem.hi + ANUSVARA, stem.rom + 'ṁ'));
      hon = cat(stem, P('जिए', 'jiye'));
    } else if (cls === 'ū') {
      sub = shorten(stem);
      pp = PP(attach(sub, 'ā'), attach(sub, 'e'), attach(sub, 'ī'), attach(sub, 'ī', true));
    } else {          // देना, लेना: the endings join to the consonant (दूँ दे दें दो)
      sub = P(stem.hi.slice(0, -1), stem.rom.slice(0, -1));
    }

    let subj = SUBJ_ENDINGS.map(([vowel, nasal]) => (vowel === 'o' && glide
      ? attach(P(sub.hi + 'य', sub.rom + 'y'), 'o')
      : attach(sub, vowel, nasal)));

    if (Object.hasOwn(IRREGULAR, hi)) {
      const irregular = IRREGULAR[hi];
      if (rom !== irregular.rom) fail(`the romanization of ${hi} must be ${irregular.rom}, not "${rom}"`);
      pp = irregular.pp;
      if (irregular.hon) hon = irregular.hon;
      if (irregular.subj) subj = irregular.subj;
    }
    return { stem, pp, subj, hon: hon || honorific(sub) };
  }

  function parse(entry) {
    if (!entry || typeof entry !== 'object') fail('the entry must be an object { hi, rom, tag }');
    const { hi, rom } = entry;
    const tag = entry.tag === undefined ? '' : entry.tag;
    for (const [name, value] of [['hi', hi], ['rom', rom]]) {
      if (typeof value !== 'string' || !value.trim()) fail(`"${name}" must be a non-empty string`);
    }
    if (!TAGS.includes(tag)) fail(`unknown tag ${JSON.stringify(tag)} for "${hi}" (expected "t", "tf", "tp", "tfp", "a", "s", "sa", "d" or "")`);
    const hiWords = words(hi);
    const romWords = words(rom);
    if (hiWords.length !== romWords.length) fail(`"${hi}" and "${rom}" have different numbers of words`);
    const lastHi = hiWords[hiWords.length - 1];
    const lastRom = romWords[romWords.length - 1];
    if (!lastHi.endsWith('ना')) fail(`"${lastHi}" is not an infinitive (the last word must end in ना)`);
    if (!lastRom.endsWith('nā')) fail(`"${lastRom}" is not an infinitive romanization (the last word must end in nā)`);
    const ergative = ERGATIVE_TAGS.includes(tag);
    if (ergative && NO_ERGATIVE.includes(lastHi)) fail(`${lastHi} is intransitive and never takes ने: remove the tag [${tag}] from "${hi}"`);
    if (NEEDS_NOUN[tag] && hiWords.length < 2) fail(`the tag "${tag}" (${NEEDS_NOUN[tag]}) needs a leading noun: "${hi}" has none`);
    // [s] / [sa]: a state, which is a compound with होना (the copula) as its last word
    const stateTag = tag === 's' || tag === 'sa';
    if (stateTag && lastHi !== 'होना') fail(`the tag "${tag}" (state) is only for a compound whose last word is होना, not "${lastHi}": remove it from "${hi}"`);
    if (stateTag && hiWords.length < 2) fail(`the tag "${tag}" (state) needs a leading word before होना: "${hi}" has none`);

    const lead = hiWords.slice(0, -1).map((w, i) => P(w, romWords[i]));
    // [a] and [sa]: the last leading word is an adjective or participle that agrees with the subject
    // (बड़ा होना, डटे रहना); it is given in the masculine citation form, ending in ा or े
    let agree = null;
    if (tag === 'a' || tag === 'sa') {
      if (!lead.length) fail(`the tag "${tag}" needs a leading word that agrees with the subject: "${hi}" has none`);
      const word = lead[lead.length - 1];
      if (!(word.hi.length > 1 && /[ाे]$/.test(word.hi) && /(ā|e)$/.test(word.rom) && word.rom.length > 1)) {
        fail(`the tag "${tag}" needs a leading word that ends in ा or े (and ā or e): "${word.hi}" in "${hi}"`);
      }
      agree = P(word.hi.slice(0, -1), word.rom.slice(0, -1));
    }
    const read = readStem(lastHi, lastRom);
    return {
      lead, tag, agree, ...read,
      // a bare होना is the copula in the present tense
      isBe: lastHi === 'होना' && lead.length === 0,
      // a compound होना that names a state is the copula too: [s], [sa], and [d] with होना
      stative: stateTag || (tag === 'd' && lastHi === 'होना'),
      dative: tag === 'd',
      display: P(hiWords.join(' '), romWords.join(' ')),
    };
  }

  // ---- The rows --------------------------------------------------------------------------------

  function rowsFor(v) {
    const { lead, tag, agree, stem, pp, subj, hon, isBe, stative, dative } = v;
    const ne = ERGATIVE_TAGS.includes(tag);
    // the participle of a ने verb agrees with the object: masculine singular unless the entry says
    // the object noun is feminine ([tf]: ने बात की, ने सलाह दी), masculine plural ([tp]: ने पैसे
    // दिए) or feminine plural ([tfp]: ने आहें भरीं). With an auxiliary the feminine plural
    // participle is not used: ने आहें भरी हैं, ने आहें भरी थीं (the auxiliary is plural).
    const fem = tag === 'tf' || tag === 'tfp';
    const many = tag === 'tp' || tag === 'tfp';
    const obj = fem ? (many ? pp.fp : pp.fs) : (many ? pp.mp : pp.ms);
    const objAux = fem ? pp.fs : obj;
    const objIs = many ? HOON[3] : HOON[1];                              // हैं / है
    const objWas = fem ? (many ? THIN : THI) : (many ? THE : THA);      // थीं / थी / थे / था
    // the leading words for person p and gender g; with [a] the last one agrees with the subject
    // (बड़ा / बड़े / बड़ी), as the participle does. Rows without gender show the masculine.
    const leadFor = (p, g) => (agree
      ? [...lead.slice(0, -1), cat(agree, g === 'm' ? (plural(p) ? P('े', 'e') : P('ा', 'ā')) : P('ी', 'ī'))]
      : lead);
    const phrase = (p, g, ...parts) => sp(...leadFor(p, g), ...parts);
    const persons = make => [0, 1, 2, 3, 4, 5, 6].map(make);
    // masculine / feminine forms of the participles and auxiliaries
    const habit = (p, g) => cat(stem, g === 'm' ? (plural(p) ? TE : TA) : TI);
    const going = (p, g) => (g === 'm' ? (plural(p) ? RAHE : RAHA) : RAHI);
    const was = (p, g) => (g === 'm' ? (plural(p) ? THE : THA) : (plural(p) ? THIN : THI));
    const done = (p, g) => (g === 'm' ? (plural(p) ? pp.mp : pp.ms) : (plural(p) ? pp.fp : pp.fs));
    const doneAux = (p, g) => (g === 'm' ? (plural(p) ? pp.mp : pp.ms) : pp.fs);   // before an auxiliary: गई हैं
    const will = (p, g) => cat(subj[p], g === 'm' ? (plural(p) ? GE : GA) : GI);
    const pair = (make) => persons(p => both(make(p, 'm'), make(p, 'f')));
    const none = () => persons(() => null);   // a tense this verb does not have
    // the copula in the present and the past (bare होना, [s], [sa], [d] with होना): the leading
    // words in front, with the gender pairs when the last one agrees with the subject
    const copulaPres = agree ? pair((p, g) => phrase(p, g, HOON[p])) : persons(p => phrase(p, 'm', HOON[p]));
    const copulaPast = pair((p, g) => phrase(p, g, was(p, g)));

    // a state has no "become" tenses (a bare होना keeps them)
    const become = rowMaker => (stative ? none() : rowMaker());
    const rows = {
      pres: isBe || stative ? copulaPres : pair((p, g) => phrase(p, g, habit(p, g), HOON[p])),
      presCont: become(() => pair((p, g) => phrase(p, g, stem, going(p, g), HOON[p]))),
      past: ne ? persons(() => sp(NE, ...lead, obj))
        : isBe || stative ? copulaPast
          : pair((p, g) => phrase(p, g, done(p, g))),
      pastHab: pair((p, g) => phrase(p, g, habit(p, g), was(p, g))),
      pastCont: become(() => pair((p, g) => phrase(p, g, stem, going(p, g), was(p, g)))),
      presPerf: ne ? persons(() => sp(NE, ...lead, objAux, objIs))
        : become(() => pair((p, g) => phrase(p, g, doneAux(p, g), HOON[p]))),
      pastPerf: ne ? persons(() => sp(NE, ...lead, objAux, objWas))
        : become(() => pair((p, g) => phrase(p, g, doneAux(p, g), was(p, g)))),
      fut: pair((p, g) => phrase(p, g, will(p, g))),
      subj: persons(p => phrase(p, 'm', subj[p])),
      imp: persons(p => (p === 1 ? phrase(p, 'm', stem) : p === 3 ? phrase(p, 'm', subj[3]) : p === 4 ? phrase(p, 'm', subj[4]) : p === 5 ? phrase(p, 'm', hon) : null)),
      impNeg: persons(p => (p === 1 ? sp(...leadFor(p, 'm'), MAT, stem) : p === 4 ? sp(...leadFor(p, 'm'), MAT, subj[4]) : p === 5 ? sp(...leadFor(p, 'm'), MAT, hon) : null)),
    };
    // [d]: the noun is the subject, so only the third person (वह, वे) has forms
    if (dative) {
      for (const key of ROW_KEYS) rows[key] = rows[key].map((cell, p) => (p === 2 || p === 6 ? cell : null));
    }
    return rows;
  }

  function express(entry) {
    const v = parse(entry);
    const built = rowsFor(v);
    const rows = {};
    for (const key of ROW_KEYS) {
      rows[key] = built[key].map(cell => (cell ? { hi: cell.hi, rom: cell.rom } : null));
    }
    return { hi: v.display.hi, rom: v.display.rom, rows };
  }

  const api = { express, ROW_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Hindi = api;
})(typeof window !== 'undefined' ? window : globalThis);
