/*
 * Portuguese verb conjugation engine (Brazilian Portuguese, 1990 spelling agreement).
 *
 *   conjugate('falar') -> { inf, gerund, participle, forms }
 *
 * Every entry in `forms` is an array of six strings, one per person:
 * eu, tu, ele/ela/você, nós, vós, eles/elas/vocês. Forms are written without the
 * pronoun. A form that does not exist is NONE ("—"): impersonal verbs (chover)
 * keep only the 3rd person singular, doer only the 3rd person, and defective verbs
 * (abolir, falir, reaver ...) lack the forms the traditional grammars leave out.
 *
 * The compound tenses use the auxiliary ter (tenho falado). `participle` is the
 * participle used after ter: the regular one for verbs with two participles
 * (tenho aceitado, tenho entregado), the short one where speakers use it there
 * (tenho ganho, gasto, pago, aberto, dito, feito, posto, visto).
 *
 * The affirmative imperative has the slots tu, tu, você, nós, vós, vocês (the eu
 * slot repeats the tu form). The negative imperative borrows the present
 * subjunctive. The infinitivo pessoal is the infinitive with personal endings.
 *
 * Returns null for anything this engine cannot conjugate with confidence: an
 * empty string, a word that is not an infinitive, a reflexive verb (-se), and
 * verbs whose forms are not settled (-guar / -quar verbs such as averiguar,
 * except aguar, enxaguar, desaguar, minguar; and aprazer, frigir ...).
 */
(function (global) {
  'use strict';

  const { words, findFamily, compound, affirmativeImperative } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  const six = words;
  const NONE = '—';
  const replaceLast = (text, from, to) => {
    const i = text.lastIndexOf(from);
    return i < 0 ? text : text.slice(0, i) + to + text.slice(i + from.length);
  };

  // ---- Irregularity data ---------------------------------------------------
  //
  // A spec lists what differs from the regular pattern; everything else is derived.
  // Fields (all optional):
  //   pres      six present forms
  //   eu, ele   1st / 3rd person singular present (the rest stays regular)
  //   subjPres  six present subjunctive forms
  //   subjStem  stem of the present subjunctive (default: the eu form without -o)
  //   pret      six preterite forms (the imperfect subjunctive, pluperfect and
  //             future subjunctive are built on the 3rd person plural)
  //   imperf    six imperfect forms
  //   fut       future / conditional stem (default: the infinitive)
  //   gerund, part                      direct overrides
  //   impTu, impVos                     imperative overrides
  //   defective 'rhizo': only nós and vós exist in the present

  const IRREGULAR = {
    ser: {
      pres: six('sou és é somos sois são'),
      pret: six('fui foste foi fomos fostes foram'),
      imperf: six('era eras era éramos éreis eram'),
      subjPres: six('seja sejas seja sejamos sejais sejam'),
      impTu: 'sê', impVos: 'sede',
    },
    estar: {
      pres: six('estou estás está estamos estais estão'),
      pret: six('estive estiveste esteve estivemos estivestes estiveram'),
      subjPres: six('esteja estejas esteja estejamos estejais estejam'),
    },
    ir: {
      pres: six('vou vais vai vamos ides vão'),
      pret: six('fui foste foi fomos fostes foram'),
      subjPres: six('vá vás vá vamos vades vão'),
    },
    dar: {
      pres: six('dou dás dá damos dais dão'),
      pret: six('dei deste deu demos destes deram'),
      subjPres: six('dê dês dê demos deis deem'),
    },
    haver: {
      pres: six('hei hás há havemos haveis hão'),
      pret: six('houve houveste houve houvemos houvestes houveram'),
      subjPres: six('haja hajas haja hajamos hajais hajam'),
    },
    reaver: {
      defective: 'rhizo',
      pret: six('reouve reouveste reouve reouvemos reouvestes reouveram'),
    },
    saber: {
      eu: 'sei', subjStem: 'saib',
      pret: six('soube soubeste soube soubemos soubestes souberam'),
    },
    poder: {
      eu: 'posso',
      pret: six('pude pudeste pôde pudemos pudestes puderam'),
    },
    querer: {
      ele: 'quer', subjStem: 'queir',
      pret: six('quis quiseste quis quisemos quisestes quiseram'),
    },
    requerer: { eu: 'requeiro', ele: 'requer' },
    perder: { eu: 'perco' }, // perco, perca (the c keeps the k sound, unlike conheço)
    caber: {
      eu: 'caibo',
      pret: six('coube coubeste coube coubemos coubestes couberam'),
    },
    trazer: {
      eu: 'trago', ele: 'traz', fut: 'trar',
      pret: six('trouxe trouxeste trouxe trouxemos trouxestes trouxeram'),
    },
    jazer: { ele: 'jaz' },
    // prover is regular outside the present (provi, provia, proverei, provido)
    prover: { pres: six('provejo provês provê provemos provedes proveem') },
    desprover: { pres: six('desprovejo desprovês desprovê desprovemos desprovedes desproveem') },
  };

  // Irregular verbs that pass their pattern on to prefixed relatives (ter ->
  // manter, pôr -> compor). The spec is written for the bare verb and the prefix
  // is added to every irregular form. `prefixes` lists the prefixes allowed (the
  // base also ends unrelated verbs: meter, servir, viver, valer ...).
  const POR_SPEC = {
    pres: six('ponho pões põe pomos pondes põem'),
    imperf: six('punha punhas punha púnhamos púnheis punham'),
    pret: six('pus puseste pôs pusemos pusestes puseram'),
    gerund: 'pondo', part: 'posto',
  };
  const FAMILIES = [
    { base: 'pôr', prefixes: [''], spec: POR_SPEC },
    {
      base: 'por',
      prefixes: [
        'com', 'dis', 'ex', 'im', 'pro', 're', 'su', 'o', 'de', 'a', 'ante', 'pre', 'pos', 'inter',
        'sobre', 'contra', 'trans', 'justa', 'super', 'entre', 'indis', 'predis', 'descom', 'recom',
        'decom', 'reex', 'reim', 'repro', 'pressu',
      ],
      spec: POR_SPEC,
    },
    {
      base: 'ter',
      prefixes: ['', 'con', 'man', 'ob', 'de', 're', 'entre', 'abs'],
      spec: {
        pres: six('tenho tens tem temos tendes têm'),
        imperf: six('tinha tinhas tinha tínhamos tínheis tinham'),
        pret: six('tive tiveste teve tivemos tivestes tiveram'),
      },
      // manter: manténs, mantém, mantêm
      adjust(spec, prefix) { if (prefix) { spec.pres[1] = 'téns'; spec.pres[2] = 'tém'; } },
    },
    {
      base: 'vir',
      prefixes: ['', 'con', 'inter', 'pro', 'ad', 'sobre', 'contra'],
      spec: {
        pres: six('venho vens vem vimos vindes vêm'),
        imperf: six('vinha vinhas vinha vínhamos vínheis vinham'),
        pret: six('vim vieste veio viemos viestes vieram'),
        part: 'vindo',
      },
      adjust(spec, prefix) { if (prefix) { spec.pres[1] = 'véns'; spec.pres[2] = 'vém'; } },
    },
    {
      base: 'ver',
      prefixes: ['', 'pre', 'ante', 'entre', 're'],
      spec: {
        pres: six('vejo vês vê vemos vedes veem'),
        pret: six('vi viste viu vimos vistes viram'),
        part: 'visto',
      },
    },
    { base: 'ler', prefixes: ['', 're'], spec: { pres: six('leio lês lê lemos ledes leem') } },
    { base: 'crer', prefixes: ['', 'des'], spec: { pres: six('creio crês crê cremos credes creem') } },
    { base: 'rir', prefixes: ['', 'sor'], spec: { pres: six('rio ris ri rimos rides riem') } },
    { base: 'valer', prefixes: ['', 'equi'], spec: { eu: 'valho' } },
    {
      base: 'fazer',
      prefixes: ['', 'des', 're', 'satis', 'contra', 'per', 'rare', 'lique', 'putre', 'estupe', 'tume'],
      spec: {
        eu: 'faço', ele: 'faz', fut: 'far', part: 'feito',
        pret: six('fiz fizeste fez fizemos fizestes fizeram'),
      },
    },
    {
      base: 'dizer',
      prefixes: ['', 'contra', 'pre', 'des', 'inter', 're', 'con'],
      spec: {
        eu: 'digo', ele: 'diz', fut: 'dir', part: 'dito',
        pret: six('disse disseste disse dissemos dissestes disseram'),
      },
    },
  ];

  // ---- Stem changes ------------------------------------------------------------
  //
  // Each entry names the verbs and the swap `from>to`, applied to the last `from`
  // of the stem. `where`: 'eu' = the eu form and the whole present subjunctive
  // (preferir: prefiro, prefira); 'all' = also tu, ele, eles (agredir: agrides);
  // 'rhizo' = only tu, ele, eles (subir: sobes). Verbs are matched on the end of
  // the infinitive unless `exact`, so prefixed relatives follow (conseguir,
  // descobrir, despedir).
  const CHANGES = [
    {
      where: 'eu', swap: 'e>i',
      verbs: words(`ferir gerir sentir mentir vestir servir repetir competir seguir vertir
        despir refletir pelir serir derir vergir mergir spergir`), // divirjo, submirjo, aspirjo
    },
    { where: 'eu', swap: 'o>u', verbs: words('dormir cobrir tossir engolir') },
    { where: 'eu', swap: 'd>ç', verbs: words('pedir medir') },
    { where: 'eu', swap: 'v>ç', verbs: ['ouvir'] },
    { where: 'all', swap: 'e>i', verbs: words('gredir prevenir denegrir') },
    { where: 'all', swap: 'o>u', verbs: ['polir'], exact: true },
    {
      where: 'rhizo', swap: 'u>o', exact: true,
      verbs: words('subir fugir cuspir sacudir consumir sumir acudir bulir escapulir entupir desentupir'),
    },
  ];

  // The stressed i / u of the stem takes a written accent (proibir: proíbo).
  // The -guar verbs listed here take the stressed form too (aguar: águo, águe; both
  // águo and aguo are accepted spellings, the accented one is shown).
  const STRESSED_ACCENT = {
    a: words('aguar enxaguar desaguar'),
    i: words('proibir coibir arruinar enraizar desenraizar faiscar ajuizar minguar tuitar'),
    u: words('reunir desunir saudar'),
  };
  const ACUTE = { a: 'á', i: 'í', u: 'ú' };
  // -guar verbs the engine conjugates (the other -guar / -quar verbs stay unsettled).
  const GUAR_OK = new Set(words('aguar enxaguar desaguar minguar'));

  // -iar verbs that change -i- to -ei- in the stressed forms (odeio).
  const MIRIA = new Set(words('mediar ansiar remediar incendiar odiar intermediar'));

  // construir and destruir: constróis, constrói, constroem (other -uir verbs: atribuis).
  const STRUIR = /^(?:re|des)?(?:con|de)struir$/;

  // Irregular participles, matched on the end of the infinitive so that derived
  // verbs follow (reabrir -> reaberto, descrever -> descrito, reeleger -> reeleito).
  const PARTICIPLE_ENDINGS = [
    ['abrir', 'aberto'], ['cobrir', 'coberto'], ['screver', 'scrito'], ['eleger', 'eleito'],
  ];
  // Verbs whose short participle is the one used after ter.
  const PARTICIPLE_EXACT = { ganhar: 'ganho', gastar: 'gasto', pagar: 'pago' };

  // ---- Verb classes ------------------------------------------------------------

  // Only the 3rd person singular exists.
  const IMPERSONAL = new Set(words(`
    chover trovejar nevar ventar amanhecer anoitecer relampejar relampear garoar chuviscar
    gear granizar orvalhar trovoar alvorecer entardecer nevoar neblinar`));
  // Only the 3rd person singular and plural exist.
  const THIRD_ONLY = new Set(['doer']);
  // No eu form in the present, so no present subjunctive and no imperative built on it.
  const DEFECTIVE_EU = new Set(words('abolir banir brandir carpir colorir descolorir delinquir demolir'));
  // Only nós and vós exist in the present.
  const DEFECTIVE_RHIZO = new Set(words('falir remir precaver'));
  // Verbs whose forms this engine does not settle: a regular guess would be wrong.
  const REFUSED = new Set(words(`
    aprazer comprazer desprazer prazer bendizer maldizer frigir arguir redarguir extorquir
    sobrestar prevaler desvaler`));

  // ---- Endings -------------------------------------------------------------

  const ENDINGS = {
    pres: {
      ar: six('o as a amos ais am'),
      er: six('o es e emos eis em'),
      ir: six('o es e imos is em'),
    },
    pret: {
      ar: six('ei aste ou amos astes aram'),
      er: six('i este eu emos estes eram'),
      ir: six('i iste iu imos istes iram'),
    },
    imperf: {
      ar: six('ava avas ava ávamos áveis avam'),
      er: six('ia ias ia íamos íeis iam'),
      ir: six('ia ias ia íamos íeis iam'),
    },
    fut: six('ei ás á emos eis ão'),
    cond: six('ia ias ia íamos íeis iam'),
    subj: {
      ar: six('e es e emos eis em'),
      er: six('a as a amos ais am'),
      ir: six('a as a amos ais am'),
    },
    gerund: { ar: 'ando', er: 'endo', ir: 'indo' },
  };

  // ---- Helpers -------------------------------------------------------------

  // Attach an ending to a stem, keeping the sound of the stem: -ar verbs before e
  // (toquei, comece, paguei), -er / -ir verbs before o (conheço, protejo, sigo).
  function join(stem, ending, type) {
    const first = ending[0];
    if (type === 'ar') {
      if (first === 'e') {
        if (stem.endsWith('c')) stem = stem.slice(0, -1) + 'qu';
        else if (stem.endsWith('ç')) stem = stem.slice(0, -1) + 'c';
        else if (stem.endsWith('g')) stem += 'u';
      }
    } else if (first === 'o' || first === 'a') {
      if (stem.endsWith('gu')) stem = stem.slice(0, -1);
      else if (stem.endsWith('qu')) stem = stem.slice(0, -2) + 'c';
      else if (stem.endsWith('g')) stem = stem.slice(0, -1) + 'j';
      else if (stem.endsWith('c')) stem = stem.slice(0, -1) + 'ç';
    }
    return stem + ending;
  }

  // A stem that ends in a vowel (not the silent u of gu / qu): after it an ending
  // that begins with i takes an accent (caí, caía, construí, moía, caído).
  const vowelRoot = root => /[aeou]$/.test(root) && !/[gq]u$/.test(root);
  const hiatus = ending => (ending[0] === 'i' && ending !== 'iu' ? 'í' + ending.slice(1) : ending);

  // falaram -> fala -> falá (faláramos): stress the last vowel of the stem. An
  // e that closes the stem is circumflex (comêramos) unless the preterite is a
  // strong one (tivéramos, fizéramos, déramos).
  const STRESS = { a: 'á', i: 'í', o: 'ô', u: 'ú' };
  function stressed(stem, acuteE) {
    const last = stem[stem.length - 1];
    if (last === 'e') return stem.slice(0, -1) + (acuteE ? 'é' : 'ê');
    return Object.hasOwn(STRESS, last) ? stem.slice(0, -1) + STRESS[last] : stem;
  }

  // Present of the verbs whose stem ends in a vowel: cair, construir, doer.
  function hiatusPres(root, kind) {
    const front = root.slice(0, -1); // constru -> constr, mo -> m
    switch (kind) {
      case 'air': return [root + 'io', root + 'is', root + 'i', root + 'ímos', root + 'ís', root + 'em'];
      case 'uir': return [root + 'o', root + 'is', root + 'i', root + 'ímos', root + 'ís', root + 'em'];
      case 'struir': return [root + 'o', front + 'óis', front + 'ói', root + 'ímos', root + 'ís', front + 'oem'];
      default: return [root + 'o', front + 'óis', front + 'ói', root + 'emos', root + 'eis', root + 'em']; // moer
    }
  }

  function withPrefix(family, prefix) {
    const spec = { ...family.spec };
    const arrays = ['pres', 'pret', 'imperf', 'subjPres'];
    for (const key of arrays) if (spec[key]) spec[key] = [...spec[key]];
    if (family.adjust) family.adjust(spec, prefix);
    if (!prefix) return spec;
    for (const key of ['eu', 'ele', 'subjStem', 'fut', 'gerund', 'part', 'impTu', 'impVos']) {
      if (spec[key]) spec[key] = prefix + spec[key];
    }
    for (const key of arrays) if (spec[key]) spec[key] = spec[key].map(form => prefix + form);
    return spec;
  }

  function specFor(inf) {
    if (Object.hasOwn(IRREGULAR, inf)) return IRREGULAR[inf];
    const match = findFamily(inf, FAMILIES);
    return match ? withPrefix(match.family, match.prefix) : {};
  }

  // ---- Conjugation ---------------------------------------------------------

  function simpleForms(inf) {
    if (REFUSED.has(inf) || (/[gq]uar$/.test(inf) && !GUAR_OK.has(inf))) return null;
    const type = /[oô]r$/.test(inf) ? 'or' : inf.endsWith('ar') ? 'ar' : inf.endsWith('er') ? 'er' : 'ir';
    const cls = type === 'or' ? 'er' : type; // pôr and its relatives take the -er endings
    const root = inf.slice(0, -2);
    const spec = specFor(inf);
    if (type === 'or' && !spec.pres) return null;
    if (!Object.keys(spec).length && !/[aeiouáàâãéêíóôõú]/.test(root)) return null;

    const kind = type === 'ir' && inf.endsWith('air') ? 'air'
      : type === 'ir' && /[^gq]uir$/.test(inf) ? (STRUIR.test(inf) ? 'struir' : 'uir')
      : type === 'er' && inf.endsWith('oer') ? 'oer' : null;

    // euStem: eu form and present subjunctive; rhizo: tu, ele, eles; subjNos:
    // nós / vós of the subjunctive when they keep the plain stem (passeemos).
    let euStem = root;
    let rhizo = root;
    let subjNos = null;
    const change = CHANGES.find(c => (c.exact ? c.verbs.includes(inf) : c.verbs.some(v => inf.endsWith(v))));
    if (change) {
      const [from, to] = change.swap.split('>');
      const changed = replaceLast(root, from, to);
      if (change.where !== 'rhizo') euStem = changed;
      if (change.where !== 'eu') rhizo = changed;
    } else if (type === 'ar' && inf.endsWith('ear')) {
      euStem = rhizo = root + 'i'; // passear: passeio
      subjNos = root;
    } else if (MIRIA.has(inf)) {
      euStem = rhizo = replaceLast(root, 'i', 'ei'); // odiar: odeio
      subjNos = root;
    }
    for (const [vowel, list] of Object.entries(STRESSED_ACCENT)) {
      if (list.includes(inf)) { // proibir: proíbo
        euStem = rhizo = replaceLast(root, vowel, ACUTE[vowel]);
        subjNos = root;
      }
    }

    const E = ENDINGS.pres[cls];
    const vr = cls !== 'ar' && vowelRoot(root);

    let pres = spec.pres;
    if (!pres && kind) pres = hiatusPres(root, kind);
    if (!pres) {
      // conduzir -> conduz (no -e after -uz); franzir -> franze
      const third = cls === 'ir' && /uz$/.test(root) ? rhizo : join(rhizo, E[2], cls);
      pres = [
        spec.eu || join(euStem, 'o', cls),
        join(rhizo, E[1], cls),
        spec.ele || third,
        root + E[3],
        root + E[4],
        join(rhizo, E[5], cls),
      ];
    }

    const pret = spec.pret || ENDINGS.pret[cls].map(end => join(root, vr ? hiatus(end) : end, cls));
    const imperf = spec.imperf || ENDINGS.imperf[cls].map(end => root + (vr ? hiatus(end) : end));

    // The pluperfect and the imperfect and future subjunctive are built on the
    // 3rd person plural of the preterite.
    const stem3 = pret[5].slice(0, -3); // falaram -> fala
    const strong = stressed(stem3, Boolean(spec.pret));
    const onStem = ends => ends.map((end, i) => (i === 3 || i === 4 ? strong : stem3) + end);
    const mqp = onStem(six('ra ras ra ramos reis ram'));
    const subjImperf = onStem(six('sse sses sse ssemos sseis ssem'));
    const base3 = pret[5].slice(0, -2); // falaram -> falar, caíram -> caír
    const plain3 = base3.replace(/ír$/, 'ir');
    const subjFut = [plain3, base3 + 'es', plain3, plain3 + 'mos', plain3 + 'des', base3 + 'em'];

    // pôr -> por before an ending (pores, pormos); cair -> caíres, caírem
    const infBase = inf.replace(/ôr$/, 'or');
    const infAccent = /(?:a|[^gq]u)ir$/.test(inf) ? inf.slice(0, -2) + 'ír' : infBase;
    const infPess = [inf, infAccent + 'es', inf, infBase + 'mos', infBase + 'des', infAccent + 'em'];

    const futStem = spec.fut || infBase;
    const fut = ENDINGS.fut.map(end => futStem + end);
    const cond = ENDINGS.cond.map(end => futStem + end);

    let subjPres = spec.subjPres;
    if (!subjPres) {
      const subjStem = spec.subjStem || (pres[0].endsWith('o') ? pres[0].slice(0, -1) : null);
      if (subjStem === null) return null;
      subjPres = ENDINGS.subj[cls].map((end, i) => {
        const stem = (i === 3 || i === 4) && subjNos !== null ? subjNos : subjStem;
        return cls === 'ar' ? join(stem, end, 'ar') : stem + end;
      });
    }

    // The imperative: tu = 3rd person present, vós = the vós present without -s.
    const impAff = affirmativeImperative({
      tu: spec.impTu || pres[2],
      subjPres,
      vosotros: spec.impVos || pres[4].slice(0, -1),
    });
    const impNeg = [1, 1, 2, 3, 4, 5].map(i => 'não ' + subjPres[i]); // borrows the present subjunctive

    const gerund = spec.gerund || root + ENDINGS.gerund[cls];
    let participle = spec.part;
    if (!participle) {
      const irregular = PARTICIPLE_ENDINGS.find(([end]) => inf.endsWith(end));
      if (Object.hasOwn(PARTICIPLE_EXACT, inf)) participle = PARTICIPLE_EXACT[inf];
      else if (irregular) participle = inf.slice(0, inf.length - irregular[0].length) + irregular[1];
      else participle = root + (cls === 'ar' ? 'ado' : vr ? 'ído' : 'ido');
    }

    let defective = spec.defective || null;
    if (DEFECTIVE_RHIZO.has(inf)) defective = 'rhizo';
    else if (DEFECTIVE_EU.has(inf)) defective = 'eu';

    return {
      pres, pret, imperf, mqp, fut, cond, subjPres, subjImperf, subjFut, impAff, impNeg,
      infPess, gerund, participle, defective,
    };
  }

  const TER = simpleForms('ter');

  const NO_IMPERATIVE = ['impAff', 'impNeg'];

  function conjugate(input) {
    if (typeof input !== 'string') return null;
    const inf = input.trim().toLowerCase();
    if (!/^[a-zçáàâãéêíóôõú]+$/.test(inf) || !/(?:[aeio]r|ôr)$/.test(inf)) return null;
    const s = simpleForms(inf);
    if (!s) return null;
    const perfect = auxForms => compound(auxForms, s.participle);

    const forms = {
      pres: s.pres,
      pret: s.pret,
      imperf: s.imperf,
      mqp: s.mqp,
      fut: s.fut,
      cond: s.cond,
      perfComp: perfect(TER.pres),
      mqpComp: perfect(TER.imperf),
      futComp: perfect(TER.fut),
      condComp: perfect(TER.cond),
      subjPres: s.subjPres,
      subjImperf: s.subjImperf,
      subjFut: s.subjFut,
      subjPerf: perfect(TER.subjPres),
      subjMqp: perfect(TER.subjImperf),
      subjFutComp: perfect(TER.subjFut),
      impAff: s.impAff,
      impNeg: s.impNeg,
      infPess: s.infPess,
    };

    // Impersonal verbs (chover) and doer: only the persons listed exist, and no imperative.
    const only = IMPERSONAL.has(inf) ? [2] : THIRD_ONLY.has(inf) ? [2, 5] : null;
    if (only) {
      for (const key of Object.keys(forms)) {
        forms[key] = forms[key].map((form, i) => (only.includes(i) && !NO_IMPERATIVE.includes(key) ? form : NONE));
      }
    }

    // Defective verbs: abolir has no eu form, hence no present subjunctive, no
    // negative imperative and only tu / vós in the affirmative; falir, reaver and
    // precaver keep only nós and vós in the present (and vós in the imperative).
    if (s.defective) {
      const [tu, , , , vos] = s.impAff;
      forms.pres = forms.pres.map((form, i) => ((s.defective === 'eu' ? i === 0 : i !== 3 && i !== 4) ? NONE : form));
      forms.subjPres = Array(6).fill(NONE);
      forms.impNeg = Array(6).fill(NONE);
      forms.impAff = s.defective === 'eu'
        ? [tu, tu, NONE, NONE, vos, NONE]
        : [NONE, NONE, NONE, NONE, vos, NONE];
    }

    return { inf, gerund: s.gerund, participle: s.participle, forms };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate, NONE };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
