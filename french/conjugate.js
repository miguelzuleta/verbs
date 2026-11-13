/*
 * French verb conjugation engine (standard French, France).
 *
 *   conjugate('parler') -> { inf, gerund, participle, forms }
 *
 * Every entry in `forms` is an array of six strings, one per person:
 * je, tu, il/elle/on, nous, vous, ils/elles. Returns null when the input is not
 * an infinitive this engine knows. Pronominal verbs (se lever) are not
 * supported.
 *
 * Where a form does not exist (the imperative has no je, il or ils form; a few
 * verbs lack a passé simple or are impersonal) the slot holds NONE ("—") or, for
 * the imperative, repeats the nearest real form: je/il fall back to tu, ils to
 * vous. Participles are shown masculine; verbs conjugated with être take the
 * plural -s in nous/vous/ils (nous sommes allés).
 */
(function (global) {
  'use strict';

  const { words, findFamily, compound } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  const six = words;
  const NONE = '—';
  const replaceLast = (text, from, to) => {
    const i = text.lastIndexOf(from);
    return text.slice(0, i) + to + text.slice(i + from.length);
  };

  // ---- Irregularity data ---------------------------------------------------
  //
  // A spec lists the principal parts of a verb; everything else is derived. Fields
  // (all optional; a regular pattern supplies what is missing):
  //   pres        six present forms
  //   impStem     imperfect stem (default: the nous form without -ons)
  //   gerund      present participle (default: impStem + ant)
  //   fut         future / conditional stem
  //   ps          [class, stem] for the passé simple: a, i, u or in (null: no passé simple)
  //   psForms     six passé simple forms, when the class does not fit
  //   subj        stem of the present subjunctive for je/tu/il/ils (default: ils form minus -ent)
  //   subjNous    stem for nous/vous (default: impStem)
  //   subjForms   six present subjunctive forms (être, avoir)
  //   part        past participle
  //   imp         [tu, nous, vous] imperative (null: no imperative)
  //   aux         'etre' for verbs conjugated with être
  //   only3       impersonal verb: only the il form exists
  //   spell       apply the -cer / -ger spelling rules (set by the -er pattern)

  const IRREGULAR = {
    'être': {
      pres: six('suis es est sommes êtes sont'),
      impStem: 'ét', gerund: 'étant', fut: 'ser', ps: ['u', 'f'],
      subjForms: six('sois sois soit soyons soyez soient'),
      part: 'été', imp: ['sois', 'soyons', 'soyez'],
    },
    avoir: {
      pres: six('ai as a avons avez ont'),
      impStem: 'av', gerund: 'ayant', fut: 'aur', ps: ['u', 'e'],
      subjForms: six('aie aies ait ayons ayez aient'),
      part: 'eu', imp: ['aie', 'ayons', 'ayez'],
    },
    aller: {
      pres: six('vais vas va allons allez vont'),
      impStem: 'all', fut: 'ir', ps: ['a', 'all'],
      subj: 'aill', subjNous: 'all', part: 'allé', imp: ['va', 'allons', 'allez'], aux: 'etre',
    },
    'haïr': {
      pres: six('hais hais hait haïssons haïssez haïssent'),
      psForms: six('haïs haïs haït haïmes haïtes haïrent'),
      part: 'haï',
    },
    maudire: {
      pres: six('maudis maudis maudit maudissons maudissez maudissent'),
      ps: ['i', 'maud'], part: 'maudit',
    },
    suffire: {
      pres: six('suffis suffis suffit suffisons suffisez suffisent'),
      ps: ['i', 'suff'], part: 'suffi',
    },
    confire: {
      pres: six('confis confis confit confisons confisez confisent'),
      ps: ['i', 'conf'], part: 'confit',
    },
    pouvoir: {
      pres: six('peux peux peut pouvons pouvez peuvent'),
      fut: 'pourr', ps: ['u', 'p'], subj: 'puiss', subjNous: 'puiss', part: 'pu', imp: null,
    },
    vouloir: {
      pres: six('veux veux veut voulons voulez veulent'),
      fut: 'voudr', ps: ['u', 'voul'], subj: 'veuill', part: 'voulu',
      imp: ['veuille', 'veuillons', 'veuillez'],
    },
    savoir: {
      pres: six('sais sais sait savons savez savent'),
      gerund: 'sachant', fut: 'saur', ps: ['u', 's'], subj: 'sach', subjNous: 'sach', part: 'su',
      imp: ['sache', 'sachons', 'sachez'],
    },
    falloir: {
      pres: six('faut faut faut fallons fallez faillent'),
      impStem: 'fall', fut: 'faudr', ps: ['u', 'fall'], subj: 'faill', subjNous: 'faill', part: 'fallu',
      imp: null, only3: true,
    },
    pleuvoir: {
      pres: six('pleus pleus pleut pleuvons pleuvez pleuvent'),
      fut: 'pleuvr', ps: ['u', 'pl'], part: 'plu', imp: null, only3: true,
    },
    pourvoir: {
      pres: six('pourvois pourvois pourvoit pourvoyons pourvoyez pourvoient'),
      fut: 'pourvoir', ps: ['u', 'pourv'], part: 'pourvu',
    },
    croire: {
      pres: six('crois crois croit croyons croyez croient'),
      ps: ['u', 'cr'], part: 'cru',
    },
    boire: {
      pres: six('bois bois boit buvons buvez boivent'),
      ps: ['u', 'b'], part: 'bu',
    },
    mourir: {
      pres: six('meurs meurs meurt mourons mourez meurent'),
      fut: 'mourr', ps: ['u', 'mour'], subj: 'meur', part: 'mort', aux: 'etre',
    },
    fuir: {
      pres: six('fuis fuis fuit fuyons fuyez fuient'),
    },
  };

  // Verbs conjugated with être (besides aller, venir and relatives, partir and
  // relatives, naître, mourir, which carry it in their own spec).
  const ETRE_VERBS = new Set(`
    arriver entrer rentrer retourner rester tomber retomber monter remonter
    descendre redescendre décéder`.trim().split(/\s+/));

  // Irregular verbs that pass their pattern on to prefixed relatives (tenir ->
  // maintenir, écrire -> décrire). `spec` is written for the bare verb and the
  // prefix is added to every irregular form. Any prefix is accepted unless
  // `prefixes` lists the ones that are. The first matching base wins, so a longer
  // base comes before the shorter one it ends with (couvrir before ouvrir).
  const FAMILIES = [
    { // devenir, revenir, parvenir... take être; prévenir, convenir... take avoir
      base: 'venir',
      spec: { pres: six('viens viens vient venons venez viennent'), fut: 'viendr', ps: ['in', 'v'], part: 'venu' },
      adjust(spec, prefix) {
        spec.aux = ['', 'de', 're', 'rede', 'par', 'sur', 'inter', 'pro', 'ad'].includes(prefix) ? 'etre' : 'avoir';
      },
    },
    {
      base: 'tenir',
      spec: { pres: six('tiens tiens tient tenons tenez tiennent'), fut: 'tiendr', ps: ['in', 't'], part: 'tenu' },
    },
    { base: 'partir', prefixes: ['', 're'], spec: { pres: six('pars pars part partons partez partent'), aux: 'etre' } },
    { base: 'sortir', prefixes: ['', 'res'], spec: { pres: six('sors sors sort sortons sortez sortent'), aux: 'etre' } },
    { base: 'sentir', prefixes: ['', 'res', 'pres', 'con', 'as'], spec: { pres: six('sens sens sent sentons sentez sentent') } },
    { base: 'mentir', prefixes: ['', 'dé'], spec: { pres: six('mens mens ment mentons mentez mentent') } },
    { base: 'servir', prefixes: ['', 'des'], spec: { pres: six('sers sers sert servons servez servent') } },
    { base: 'dormir', prefixes: ['', 'en', 'ren'], spec: { pres: six('dors dors dort dormons dormez dorment') } },
    { base: 'couvrir', prefixes: ['', 'dé', 're', 'redé'], spec: { pres: six('couvre couvres couvre couvrons couvrez couvrent'), part: 'couvert' } },
    { base: 'ouvrir', prefixes: ['', 'r', 'entr'], spec: { pres: six('ouvre ouvres ouvre ouvrons ouvrez ouvrent'), part: 'ouvert' } },
    { base: 'offrir', prefixes: [''], spec: { pres: six('offre offres offre offrons offrez offrent'), part: 'offert' } },
    { base: 'souffrir', prefixes: [''], spec: { pres: six('souffre souffres souffre souffrons souffrez souffrent'), part: 'souffert' } },
    { base: 'cueillir', prefixes: ['', 'ac', 're'], spec: { pres: six('cueille cueilles cueille cueillons cueillez cueillent'), fut: 'cueiller' } },
    { base: 'saillir', prefixes: ['as', 'tres'], spec: { pres: six('saille sailles saille saillons saillez saillent') } },
    { base: 'bouillir', prefixes: ['', 're'], spec: { pres: six('bous bous bout bouillons bouillez bouillent') } },
    { base: 'courir', spec: { pres: six('cours cours court courons courez courent'), fut: 'courr', ps: ['u', 'cour'], part: 'couru' } },
    { // acquérir, conquérir, requérir
      base: 'quérir',
      spec: {
        pres: six('quiers quiers quiert quérons quérez quièrent'),
        fut: 'querr', ps: ['i', 'qu'], subj: 'quièr', part: 'quis',
      },
    },
    { base: 'vêtir', prefixes: ['', 're', 'dé'], spec: { pres: six('vêts vêts vêt vêtons vêtez vêtent'), part: 'vêtu' } },
    { base: 'envoyer', prefixes: ['', 'r'], spec: { fut: 'enverr' } },

    { // devoir, redevoir
      base: 'devoir',
      prefixes: ['', 're'],
      spec: { pres: six('dois dois doit devons devez doivent'), fut: 'devr', ps: ['u', 'd'], subj: 'doiv', part: 'dû' },
    },
    { // recevoir, apercevoir, concevoir, décevoir, percevoir
      base: 'cevoir',
      spec: { pres: six('çois çois çoit cevons cevez çoivent'), fut: 'cevr', ps: ['u', 'ç'], subj: 'çoiv', part: 'çu' },
    },
    {
      base: 'voir',
      prefixes: ['', 're', 'pré', 'entre'],
      spec: { pres: six('vois vois voit voyons voyez voient'), fut: 'verr', ps: ['i', 'v'], part: 'vu' },
      adjust(spec, prefix) { if (prefix === 'pré') delete spec.fut; }, // prévoir: prévoirai
    },
    {
      base: 'valoir',
      prefixes: ['', 'équi', 'pré'],
      spec: { pres: six('vaux vaux vaut valons valez valent'), fut: 'vaudr', ps: ['u', 'val'], subj: 'vaill', part: 'valu' },
      adjust(spec, prefix) { if (prefix === 'pré') { spec.subj = 'val'; spec.subjNous = 'val'; } }, // prévale
    },
    {
      base: 'mouvoir',
      spec: { pres: six('meus meus meut mouvons mouvez meuvent'), fut: 'mouvr', ps: ['u', 'm'], part: 'mû' },
      adjust(spec, prefix) { if (prefix) spec.part = 'mu'; }, // ému, promu
    },
    {
      base: 'asseoir',
      prefixes: ['', 'r'],
      spec: { pres: six('assieds assieds assied asseyons asseyez asseyent'), fut: 'assiér', ps: ['i', 'ass'], part: 'assis' },
    },

    { // défaire, refaire, satisfaire, contrefaire
      base: 'faire',
      prefixes: ['', 'dé', 're', 'satis', 'contre', 'sur'],
      spec: { pres: six('fais fais fait faisons faites font'), fut: 'fer', ps: ['i', 'f'], subj: 'fass', subjNous: 'fass', part: 'fait' },
    },
    { // vous dites only for dire and redire; contredisez, interdisez...
      base: 'dire',
      prefixes: ['', 're', 'contre', 'dé', 'inter', 'pré', 'mé'],
      spec: { pres: six('dis dis dit disons dites disent'), ps: ['i', 'd'], part: 'dit' },
      adjust(spec, prefix) { if (prefix !== '' && prefix !== 're') spec.pres[4] = 'disez'; },
    },
    { base: 'prendre', spec: { pres: six('prends prends prend prenons prenez prennent'), ps: ['i', 'pr'], part: 'pris' } },
    { base: 'mettre', spec: { pres: six('mets mets met mettons mettez mettent'), ps: ['i', 'm'], part: 'mis' } },
    { base: 'battre', spec: { pres: six('bats bats bat battons battez battent'), ps: ['i', 'batt'], part: 'battu' } },
    { base: 'vivre', prefixes: ['', 're', 'sur'], spec: { pres: six('vis vis vit vivons vivez vivent'), ps: ['u', 'véc'], part: 'vécu' } },
    { base: 'suivre', prefixes: ['', 'pour'], spec: { pres: six('suis suis suit suivons suivez suivent'), part: 'suivi' } },
    { base: 'crire', spec: { pres: six('cris cris crit crivons crivez crivent'), ps: ['i', 'criv'], part: 'crit' } },
    { base: 'lire', prefixes: ['', 're', 'é', 'réé'], spec: { pres: six('lis lis lit lisons lisez lisent'), ps: ['u', 'l'], part: 'lu' } },
    { base: 'rire', prefixes: ['', 'sou'], spec: { pres: six('ris ris rit rions riez rient'), ps: ['i', 'r'], part: 'ri' } },
    { // conduire, construire, détruire, cuire, nuire, luire
      base: 'uire',
      spec: { pres: six('uis uis uit uisons uisez uisent'), ps: ['i', 'uis'], part: 'uit' },
      adjust(spec, prefix) { if (['l', 'rel', 'n'].includes(prefix)) spec.part = 'ui'; },
    },
    { base: 'aindre', spec: { pres: six('ains ains aint aignons aignez aignent'), ps: ['i', 'aign'], part: 'aint' } },
    { base: 'eindre', spec: { pres: six('eins eins eint eignons eignez eignent'), ps: ['i', 'eign'], part: 'eint' } },
    { base: 'oindre', spec: { pres: six('oins oins oint oignons oignez oignent'), ps: ['i', 'oign'], part: 'oint' } },
    { // résoudre, absoudre, dissoudre
      base: 'soudre',
      prefixes: ['ré', 'ab', 'dis'],
      spec: { pres: six('sous sous sout solvons solvez solvent'), fut: 'soudr', ps: ['u', 'sol'], part: 'solu' },
      adjust(spec, prefix) {
        if (prefix === 'ab') { spec.part = 'sous'; spec.ps = null; }
        if (prefix === 'dis') spec.part = 'sous';
      },
    },
    { base: 'coudre', prefixes: ['', 'dé', 're'], spec: { pres: six('couds couds coud cousons cousez cousent'), ps: ['i', 'cous'], part: 'cousu' } },
    { base: 'moudre', prefixes: ['', 'é', 're'], spec: { pres: six('mouds mouds moud moulons moulez moulent'), ps: ['u', 'moul'], part: 'moulu' } },
    { base: 'naître', prefixes: [''], spec: { pres: six('nais nais naît naissons naissez naissent'), fut: 'naîtr', ps: ['i', 'naqu'], part: 'né', aux: 'etre' } },
    { // connaître, paraître, apparaître, disparaître...
      base: 'aître',
      spec: { pres: six('ais ais aît aissons aissez aissent'), fut: 'aîtr', ps: ['u', ''], part: 'u' },
    },
    { base: 'plaire', prefixes: ['', 'dé', 'com'], spec: { pres: six('plais plais plaît plaisons plaisez plaisent'), ps: ['u', 'pl'], part: 'plu' } },
    { base: 'taire', prefixes: [''], spec: { pres: six('tais tais tait taisons taisez taisent'), ps: ['u', 't'], part: 'tu' } },
    { // extraire, distraire, soustraire have no passé simple
      base: 'traire',
      spec: { pres: six('trais trais trait trayons trayez traient'), ps: null, part: 'trait' },
    },
    { base: 'vaincre', prefixes: ['', 'con'], spec: { pres: six('vaincs vaincs vainc vainquons vainquez vainquent'), ps: ['i', 'vainqu'], part: 'vaincu' } },
    { base: 'rompre', spec: { pres: six('romps romps rompt rompons rompez rompent'), ps: ['i', 'romp'], part: 'rompu' } },
    { // conclure, exclure, inclure (participle inclus)
      base: 'clure',
      prefixes: ['con', 'ex', 'in', 'oc'],
      spec: { pres: six('clus clus clut cluons cluez cluent'), ps: ['u', 'cl'], part: 'clu' },
      adjust(spec, prefix) { if (prefix === 'in') spec.part = 'clus'; },
    },
  ];

  // ---- Spelling and shared tables --------------------------------------------

  // -eter / -eler verbs that take è instead of doubling the consonant.
  const GRAVE = new Set(`
    acheter racheter geler dégeler congeler décongeler surgeler regeler peler modeler remodeler marteler
    harceler démanteler écarteler celer déceler receler ciseler haleter fureter
    crocheter corseter`.trim().split(/\s+/));
  // Other verbs whose mute e becomes è.
  const E_MUTE = new Set(['sevrer', 'dépecer']);
  // Verbs that look like -eter but are written without doubling (je tweete).
  const NO_DOUBLING = new Set(['tweeter']);

  const ASPIRATED_H = new Set(`
    hacher haïr haler hanter harasser harceler harponner hasarder hausser hennir
    hérisser heurter hisser hocher honnir hurler hululer huer houspiller hâbler happer
    hâler harnacher héler hoqueter handicaper`.trim().split(/\s+/));

  const ENDINGS = {
    imperf: six('ais ais ait ions iez aient'),
    fut: six('ai as a ons ez ont'),
    cond: six('ais ais ait ions iez aient'),
    subj: six('e es e ions iez ent'),
    ps: {
      a: six('ai as a âmes âtes èrent'),
      i: six('is is it îmes îtes irent'),
      u: six('us us ut ûmes ûtes urent'),
      in: six('ins ins int înmes întes inrent'),
    },
  };
  const CIRCUMFLEX = { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û' };
  const LAST_VOWEL = /[aeiouyàâäéèêëîïôöùûü](?=[^aeiouyàâäéèêëîïôöùûü]*$)/;

  // Attach an ending to a stem. -er verbs keep the sound of the stem: c -> ç and
  // g -> ge before a, o and â (commençons, mangeais, mangeâmes).
  function join(stem, ending, spell) {
    if (spell) {
      const first = ending[0];
      if (stem.endsWith('c') && 'aoâ'.includes(first)) stem = stem.slice(0, -1) + 'ç';
      else if (stem.endsWith('g') && 'aoâ'.includes(first)) stem += 'e';
    }
    return stem + ending;
  }

  // ---- Regular patterns -------------------------------------------------------

  function erPattern(inf) {
    const stem = inf.slice(0, -2);
    let alt = stem;        // the stem before a silent ending (je lève, ils appellent)
    let altFuture = true;  // the future and conditional use that stem too
    if (/(oy|uy|ay)$/.test(stem)) alt = stem.slice(0, -1) + 'i';
    else if (GRAVE.has(inf) || E_MUTE.has(inf) || /e[mnrsv]$/.test(stem)) alt = replaceLast(stem, 'e', 'è');
    else if (/e[lt]$/.test(stem) && !NO_DOUBLING.has(inf)) alt = stem + stem.slice(-1);
    else if (/é(?:[bcdfghjklmnprstvz]{1,2}|gu)$/.test(stem)) { // céder: je cède, but je céderai
      alt = replaceLast(stem, 'é', 'è');
      altFuture = false;
    }
    return {
      spell: true,
      pres: [alt + 'e', alt + 'es', alt + 'e', join(stem, 'ons', true), stem + 'ez', alt + 'ent'],
      impStem: stem,
      fut: (altFuture ? alt : stem) + 'er',
      ps: ['a', stem],
      subj: alt,
      subjNous: stem,
      part: stem + 'é',
    };
  }

  // finir: the default for -ir verbs; the others are listed in FAMILIES.
  function irPattern(inf) {
    const stem = inf.slice(0, -2);
    return {
      pres: [stem + 'is', stem + 'is', stem + 'it', stem + 'issons', stem + 'issez', stem + 'issent'],
      impStem: stem + 'iss', ps: ['i', stem], subj: stem + 'iss', part: stem + 'i',
    };
  }

  // rendre: the default for -dre verbs.
  function rePattern(inf) {
    const stem = inf.slice(0, -2);
    if (!stem.endsWith('d')) return null;
    return {
      pres: [stem + 's', stem + 's', stem, stem + 'ons', stem + 'ez', stem + 'ent'],
      impStem: stem, fut: inf.slice(0, -1), ps: ['i', stem], subj: stem, part: stem + 'u',
    };
  }

  const typeOf = inf => (inf.endsWith('er') ? 'er' : /[iï]r$/.test(inf) ? 'ir' : inf.endsWith('oir') ? 'oir' : 're');
  const PATTERN = { er: erPattern, ir: irPattern, re: rePattern };

  // ---- Looking up a verb's irregularities -----------------------------------

  function withPrefix(family, prefix) {
    const spec = { ...family.spec };
    for (const key of ['pres', 'ps', 'imp']) if (spec[key]) spec[key] = [...spec[key]];
    if (family.adjust) family.adjust(spec, prefix);
    if (!prefix) return spec;
    for (const key of ['impStem', 'gerund', 'fut', 'subj', 'subjNous', 'part']) {
      if (spec[key]) spec[key] = prefix + spec[key];
    }
    if (spec.pres) spec.pres = spec.pres.map(form => prefix + form);
    if (spec.imp) spec.imp = spec.imp.map(form => prefix + form);
    if (spec.ps) spec.ps = [spec.ps[0], prefix + spec.ps[1]];
    return spec;
  }

  function specFor(inf) {
    if (Object.hasOwn(IRREGULAR, inf)) return IRREGULAR[inf];
    const match = findFamily(inf, FAMILIES);
    return match ? withPrefix(match.family, match.prefix) : {};
  }

  // ---- Conjugation -----------------------------------------------------------

  const given = value => value !== undefined;

  function simpleForms(inf) {
    const type = typeOf(inf);
    const spec = specFor(inf);
    // A spec that gives the present is a whole irregular verb: its other parts are
    // derived from it. A partial spec (envoyer: only the future) sits on the pattern.
    const base = spec.pres ? {} : (PATTERN[type] ? PATTERN[type](inf) : null) || {};
    const s = { ...base, ...spec };
    if (!s.pres) return null;
    if (!s.aux && ETRE_VERBS.has(inf)) s.aux = 'etre';

    // Principal parts the pattern or spec left out.
    if (!given(s.impStem)) s.impStem = s.pres[3].slice(0, -3);
    if (!given(s.gerund)) s.gerund = join(s.impStem, 'ant', s.spell);
    if (!given(s.fut)) s.fut = inf.endsWith('re') ? inf.slice(0, -1) : inf;
    if (!given(s.ps) && !s.psForms) {
      if (type === 'oir') return null;
      s.ps = [type === 'er' ? 'a' : 'i', inf.slice(0, -2)];
    }
    if (!given(s.subj)) s.subj = s.pres[5].slice(0, -3);
    if (!given(s.subjNous)) s.subjNous = s.impStem;
    if (!given(s.part)) {
      if (type === 'oir' || type === 're') return null;
      s.part = type === 'er' ? inf.slice(0, -2) + 'é' : inf.slice(0, -1);
    }

    const spell = s.spell;
    const pres = s.pres;
    const imperf = ENDINGS.imperf.map(end => join(s.impStem, end, spell));
    const fut = ENDINGS.fut.map(end => s.fut + end);
    const cond = ENDINGS.cond.map(end => s.fut + end);

    let ps;
    if (s.psForms) ps = s.psForms;
    else if (s.ps) ps = ENDINGS.ps[s.ps[0]].map(end => join(s.ps[1], end, spell));
    else ps = Array(6).fill(NONE);

    const subjPres = s.subjForms || ENDINGS.subj.map((end, i) => (i === 3 || i === 4 ? s.subjNous : s.subj) + end);

    // The imperfect subjunctive is built on the tu form of the passé simple:
    // parlas -> parlasse, parlât; vins -> vinsse, vînt.
    let subjImperf = Array(6).fill(NONE);
    if (s.psForms || s.ps) {
      const stem = ps[1].slice(0, -1);
      const third = stem.replace(LAST_VOWEL, v => CIRCUMFLEX[v] || v) + 't';
      subjImperf = [stem + 'sse', stem + 'sses', third, stem + 'ssions', stem + 'ssiez', stem + 'ssent'];
    }

    // Only tu, nous and vous have an imperative; je and il borrow tu, ils borrows vous.
    let imp = Array(6).fill(NONE);
    if (s.imp !== null) {
      const [tu, nous, vous] = s.imp || [pres[1].endsWith('es') ? pres[1].slice(0, -1) : pres[1], pres[3], pres[4]];
      imp = [tu, tu, tu, nous, vous, vous];
    }

    return {
      pres, imperf, ps, fut, cond, subjPres, subjImperf, imp,
      gerund: s.gerund, participle: s.part, aux: s.aux, only3: Boolean(s.only3),
    };
  }

  const AVOIR = simpleForms('avoir');
  const ETRE = simpleForms('être');
  const VENIR_PRES = simpleForms('venir').pres;
  const ALLER_PRES = simpleForms('aller').pres;

  // nous sommes allés: a participle after être takes -s in the plural persons.
  const plural = participle => (/[sxz]$/.test(participle) ? participle : participle + 's');

  // "de" before a consonant, "d'" before a vowel or a mute h: viens de parler, viens d'aimer.
  const withDe = inf =>
    (/^[aeiouyàâäéèêëîïôöùûüœæ]/.test(inf) || (inf[0] === 'h' && !ASPIRATED_H.has(inf)) ? "d'" : 'de ') + inf;

  function conjugate(input) {
    const inf = String(input).trim().toLowerCase();
    if (!/^[a-zàâäçéèêëîïôöùûüÿœæ-]+(er|ir|ïr|re|oir)$/.test(inf)) return null;
    const s = simpleForms(inf);
    if (!s) return null;

    const aux = s.aux === 'etre' ? ETRE : AVOIR;
    const perfect = auxForms => {
      const singular = compound(auxForms, s.participle);
      if (s.aux !== 'etre') return singular;
      const plurals = compound(auxForms, plural(s.participle));
      return singular.map((form, i) => (i >= 3 ? plurals[i] : form));
    };
    const imperativeExists = s.imp[0] !== NONE;

    const forms = {
      pres: s.pres,
      passeComp: perfect(aux.pres),
      passeRecent: compound(VENIR_PRES, withDe(inf)),
      imperf: s.imperf,
      pluperf: perfect(aux.imperf),
      passeSimple: s.ps,
      passeAnt: perfect(aux.ps),
      fut: s.fut,
      futProche: compound(ALLER_PRES, inf),
      futAnt: perfect(aux.fut),
      cond: s.cond,
      condPast: perfect(aux.cond),
      subjPres: s.subjPres,
      subjPast: perfect(aux.subjPres),
      subjImperf: s.subjImperf,
      subjPluperf: perfect(aux.subjImperf),
      impPres: s.imp,
      impPast: imperativeExists ? perfect(aux.imp) : s.imp,
    };

    // Impersonal verbs (pleuvoir, falloir) exist only in the il form.
    if (s.only3) {
      for (const key of Object.keys(forms)) forms[key] = forms[key].map((form, i) => (i === 2 ? form : NONE));
    }

    return { inf, gerund: s.gerund, participle: s.participle, forms };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate, NONE };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
