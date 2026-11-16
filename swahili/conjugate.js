/*
 * Swahili verb conjugation engine (standard Swahili).
 *
 *   conjugate('kusoma') -> { inf, gerund, participle, forms }
 *
 * Input is the infinitive (ku-, or kwenda / kwisha): kusoma, kula, kwenda, kuwa, kuwa na, kujibu.
 * Case and surrounding spaces are ignored. A verb form is
 *   subject prefix + tense marker + root + final vowel
 * (the object-prefix slot is not used). Every entry in `forms` is an array of six
 * strings in person order: mimi, wewe, yeye (human class), sisi, ninyi, wao (human
 * class), written without the pronoun and as ONE word (ninasoma), except the
 * compound tenses (nilikuwa ninasoma) and the "kuwa na" family (nilikuwa na).
 * A form that does not exist is NONE ("—"). Subject prefixes: ni- u- a- tu- m- wa-;
 * negative prefixes si- hu- ha- hatu- ham- hawa-.
 *
 * The 16 keys, in this order:
 *   pres (-na-) past (-li-) perf (-me-) fut (-ta-) hab (hu-) pastProg futProg
 *   subj (subject prefix + root + -e) imp (2nd person only) cond (-ki-, if/when)
 *   hyp (-nge-, would) hypPast (-ngali-, would have)
 *   negPres negPast (-ku-) negFut (-ta-) negPerf (-ja-, not yet)
 *
 * `gerund` is the infinitive (the verbal noun kusoma) and `participle` is the stem
 * with its final vowel, i.e. the infinitive without ku-/kw- ("soma", "enda", "la",
 * "jibu"); for a regular verb that is the imperative singular. Swahili has no real
 * gerund or participle in the European sense; these two exist so that the shared
 * database check has something to test.
 *
 * Returns null for anything this engine cannot conjugate with confidence: empty or
 * non-infinitive input, reflexive -ji- verbs (kujipenda), verbs not ending in
 * -a/-e/-i/-u (kuwepo), or an impossible spelling.
 *
 * Rules and choices:
 *  - Vowel-initial roots (kwenda, kuandika) just take the markers: ninaenda,
 *    nilienda, niliandika. The 2nd-person-plural prefix m- becomes mw- directly
 *    before a vowel (subjunctive mwandike, negative present hamwoni) and mu- before u
 *    (subjunctive muuze).
 *  - Monosyllabic roots (kula, kunywa, kuja, kufa, kupa, kuwa, kucha) keep ku- after
 *    the markers -na- -li- -me- -ta- -nge- -ngali- and in the negative future
 *    (ninakula, nitakula, ningekula, hatakula). They drop it in the habitual (hula),
 *    the subjunctive (ale), the conditional (-ki-: akija), the negative perfect
 *    (-ja-: hajala) and the negative present (sili). The negative past marker -ku-
 *    absorbs it (sikula). The imperative keeps it (kula, kuleni).
 *  - Negative present: final -a becomes -i; roots already ending in -e, -i, -u (mostly
 *    Arabic loans: kujibu, kusamehe, kufikiri) keep their vowel (sijibu).
 *  - Subjunctive: final -a becomes -e; roots ending in -e, -i, -u keep their vowel
 *    (ajibu, asamehe, akubali).
 *  - Imperative: singular = root with its final vowel (soma, jibu); plural = subjunctive
 *    stem + -ni (someni, jibuni, ingieni). Irregular: kuja njoo / njooni, kwenda nenda /
 *    nendeni.
 *  - kuwa (be): pres/negPres use the LOCATIVE copula (niko, uko, yuko, tuko, mko, wako;
 *    siko, huko, hayuko, hatuko, hamko, hawako). The identifying copula ni (negative si)
 *    does not vary by person, so it is not shown. The progressive tenses repeat the
 *    simple past/future (nilikuwa, nitakuwa).
 *  - kuwa na (have): pres nina una ana tuna mna wana, negative sina huna hana hatuna
 *    hamna hawana; the other tenses are those of kuwa followed by " na".
 *  - "<infinitive> na" for any other verb (kuja na = bring, kwenda na = take): every
 *    form of the verb with " na" added.
 *  - Not supported (null): reflexive verbs with -ji- (kujipenda, kujifunza; kujibu and its
 *    relatives are fine), roots not ending in -a/-e/-i/-u (kuwepo, kuwapo), bare kw-
 *    spellings other than kwenda and kwisha, and anything that is not an infinitive.
 */
(function (global) {
  'use strict';

  const { words } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  const NONE = '—';

  const SUBJECT = words('ni u a tu m wa');
  const NEGATIVE = words('si hu ha hatu ham hawa');

  const isVowel = ch => 'aeiou'.includes(ch);

  // Glue a person prefix to what follows. The 2nd person plural m-/ham- turns into
  // mw-/hamw- before a vowel (msome, but mwandike, mwende) and into mu-/hamu- before u
  // (muuze), as the noun-class prefix does (mwalimu, muuguzi).
  function attach(prefix, rest) {
    if ((prefix === 'm' || prefix === 'ham') && isVowel(rest[0])) return prefix + (rest[0] === 'u' ? 'u' : 'w') + rest;
    return prefix + rest;
  }

  const positive = (marker, stem) => SUBJECT.map(prefix => attach(prefix, marker + stem));
  const negative = (marker, stem) => NEGATIVE.map(prefix => attach(prefix, marker + stem));

  // ---- Irregular verbs -------------------------------------------------------------

  // Irregular imperatives [singular, plural], keyed by the infinitive.
  const IRREGULAR_IMPERATIVE = {
    kuja: ['njoo', 'njooni'],
    kwenda: ['nenda', 'nendeni'],
    kuenda: ['nenda', 'nendeni'],
  };

  // Non-reflexive roots that begin with ji- (everything else starting with ji- is a
  // reflexive verb, which this engine does not conjugate).
  // jibu (answer) and the lexicalised ji- verbs (learn, join, volunteer, feel) are ordinary verbs, not reflexives
  const NOT_REFLEXIVE = /^(jib(u|ia|iwa|ika|isha|ishana|izana)|jifunz(a|ia|ika|isha)|jiung(a|ia|ika)|jitole(a|ea)|jisik(ia|ika))$/;

  // ---- Reading the infinitive -------------------------------------------------------

  // The only infinitives written kw- (ku- before e/i): kwenda, kwisha. Other verbs with
  // kw in the root are written kukwama, kukwepa, kukwea.
  const KW_INFINITIVES = ['kwenda', 'kwisha'];

  // A root is a run of syllables (consonants + vowel); ng' is the only apostrophe.
  const ROOT_SHAPE = /^(?:[bcdfghjklmnpqrstvwyz']{0,4}[aeiou])+$/;
  const NOT_SWAHILI_LETTER = /[qx]/;

  function readRoot(base) {
    if (!/^[a-z']+$/.test(base) || base.length < 4) return null;
    const root = base.slice(2);
    if (!(base.startsWith('ku') || KW_INFINITIVES.includes(base))) return null;
    if (!ROOT_SHAPE.test(root) || NOT_SWAHILI_LETTER.test(root)) return null;
    if (root.replace(/ng'/g, '').includes("'")) return null;
    if (!'aeiu'.includes(root[root.length - 1])) return null;
    if (root.startsWith('ji') && !NOT_REFLEXIVE.test(root)) return null;
    // a root of one syllable always ends in -a (kula, kunywa); "kuku" is a noun
    if (root.replace(/[^aeiou]/g, '').length === 1 && !root.endsWith('a')) return null;
    return root;
  }

  // The two ways a final vowel changes: -a becomes -e (subjunctive) or -i (negative
  // present); -e, -i and -u (Arabic loans) stay.
  const finalTo = (root, vowel) => (root.endsWith('a') ? root.slice(0, -1) + vowel : root);

  // Roots of one syllable: la, nywa, ja, fa, pa, wa, cha.
  const isMonosyllabic = root => /^[^aeiou]+a$/.test(root);

  // ---- The forms of one verb ----------------------------------------------------------

  const PAST_OF_BE = positive('li', 'kuwa');
  const FUTURE_OF_BE = positive('ta', 'kuwa');
  const LOCATIVE = words('niko uko yuko tuko mko wako');
  const NEGATIVE_LOCATIVE = words('siko huko hayuko hatuko hamko hawako');

  function simpleForms(inf, root) {
    const mono = isMonosyllabic(root);
    const kept = mono ? 'ku' + root : root; // after the markers that keep ku-
    const subjStem = finalTo(root, 'e');
    const pres = positive('na', kept);

    const forms = {
      pres,
      past: positive('li', kept),
      perf: positive('me', kept),
      fut: positive('ta', kept),
      hab: Array(6).fill('hu' + root),
      pastProg: PAST_OF_BE.map((was, i) => `${was} ${pres[i]}`),
      futProg: FUTURE_OF_BE.map((will, i) => `${will} ${pres[i]}`),
      subj: positive('', subjStem),
      imp: [NONE, root, NONE, NONE, subjStem + 'ni', NONE],
      cond: positive('ki', root),
      hyp: positive('nge', kept),
      hypPast: positive('ngali', kept),
      negPres: negative('', finalTo(root, 'i')),
      negPast: negative('ku', root),
      negFut: negative('ta', kept),
      negPerf: negative('ja', root),
    };

    if (mono) forms.imp = [NONE, 'ku' + root, NONE, NONE, 'ku' + subjStem + 'ni', NONE];
    if (Object.hasOwn(IRREGULAR_IMPERATIVE, inf)) {
      const [singular, plural] = IRREGULAR_IMPERATIVE[inf];
      forms.imp = [NONE, singular, NONE, NONE, plural, NONE];
    }
    return forms;
  }

  // kuwa: the present is the locative copula; the progressive tenses would only repeat
  // "was being", so they equal the simple past and future.
  function beForms(forms) {
    forms.pres = LOCATIVE.slice();
    forms.negPres = NEGATIVE_LOCATIVE.slice();
    forms.pastProg = forms.past.slice();
    forms.futProg = forms.fut.slice();
    return forms;
  }

  function conjugate(input) {
    if (typeof input !== 'string') return null;
    const inf = input.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[\u2018\u2019\u02bc]/g, "'");
    const withNa = inf.endsWith(' na');
    const base = withNa ? inf.slice(0, -3) : inf;
    const root = readRoot(base);
    if (!root) return null;

    let forms = simpleForms(base, root);
    if (base === 'kuwa') forms = beForms(forms);
    if (withNa) {
      for (const key of Object.keys(forms)) forms[key] = forms[key].map(form => (form === NONE ? NONE : form + ' na'));
      if (base === 'kuwa') {
        forms.pres = SUBJECT.map(prefix => prefix + 'na');
        forms.negPres = NEGATIVE.map(prefix => prefix + 'na');
        forms.pastProg = forms.past.slice();
        forms.futProg = forms.fut.slice();
      }
    }

    return { inf, gerund: inf, participle: inf.slice(2), forms };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate, NONE };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
