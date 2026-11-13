/*
 * Catalan verb conjugation engine (Central Catalan, IEC norm).
 *
 *   conjugate('parlar') -> { inf, gerund, participle, forms }
 *
 * Every entry in `forms` is an array of six strings, one per person:
 * jo, tu, ell/ella/vostè, nosaltres, vosaltres, ells/elles/vostès.
 * Returns null when the input is not an infinitive. Pronominal verbs
 * (parlar-se) are not supported.
 */
(function (global) {
  'use strict';

  const { words, findFamily, compound, affirmativeImperative, negativeImperative } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  // Reads a table of six forms, one per person: six('parlo parles parla ...').
  const six = words;

  const unaccent = text => text
    .replace(/[àá]/g, 'a').replace(/[èé]/g, 'e').replace(/[íì]/g, 'i')
    .replace(/[òó]/g, 'o').replace(/[úù]/g, 'u');

  // ---- Irregular verbs -----------------------------------------------------
  //
  // Spec fields (all optional):
  //   kind        ar | er | ir (pure -ir) | ir+ (incoative -ir, the default for -ir)
  //   stem        unstressed stem used before stressed endings (nosaltres, vosaltres, imperfet…)
  //   stressed    stem used in the singular and 3rd plural of the present
  //   pres, imperf, simple, subjPres, subjImperf   full six-form overrides
  //   simpleStem  stem for the passat simple and imperfet de subjuntiu (tingu- -> tinguí, tingués)
  //   subjStem    stem for the present de subjuntiu (tingu- -> tingui)
  //   fut         future/conditional stem
  //   imperfStem  stem for the imperfet (bev- -> bevia)
  //   impTu, impVos   imperative overrides; gerund, part   non-finite overrides

  const IRREGULAR = {
    ser: {
      pres: six('sóc ets és som sou són'),
      imperf: six('era eres era érem éreu eren'),
      simple: six('fui fores fou fórem fóreu foren'),
      subjPres: six('sigui siguis sigui siguem sigueu siguin'),
      subjImperf: six('fos fossis fos fóssim fóssiu fossin'),
      impTu: 'sigues', impVos: 'sigueu', gerund: 'sent', part: 'estat',
    },
    estar: {
      pres: six('estic estàs està estem esteu estan'),
      simpleStem: 'estigu', subjStem: 'estigu', impTu: 'estigues', impVos: 'estigueu',
    },
    anar: {
      pres: six('vaig vas va anem aneu van'),
      subjPres: six('vagi vagis vagi anem aneu vagin'),
      fut: 'anir', impTu: 'vés',
    },
    haver: {
      pres: six('he has ha hem heu han'),
      subjPres: six('hagi hagis hagi hàgim hàgiu hagin'),
      simpleStem: 'hagu', fut: 'haur', impTu: 'hagis', part: 'hagut',
    },
    poder: {
      pres: six('puc pots pot podem podeu poden'),
      simpleStem: 'pogu', subjStem: 'pugu', fut: 'podr', impTu: 'pugues', impVos: 'pugueu', part: 'pogut',
    },
    voler: {
      pres: six('vull vols vol volem voleu volen'),
      simpleStem: 'volgu', subjStem: 'vulgu', fut: 'voldr', impTu: 'vulguis', impVos: 'vulgueu', part: 'volgut',
    },
    saber: {
      pres: six('sé saps sap sabem sabeu saben'),
      subjPres: six('sàpiga sàpigues sàpiga sapiguem sapigueu sàpiguen'),
      fut: 'sabr', impTu: 'sàpigues', impVos: 'sapigueu',
    },
    valer: {
      pres: six('valc vals val valem valeu valen'),
      simpleStem: 'valgu', subjStem: 'valgu', fut: 'valdr', part: 'valgut',
    },
    veure: {
      pres: six('veig veus veu veiem veieu veuen'),
      imperf: six('veia veies veia vèiem vèieu veien'),
      simple: six('veí veieres veié veiérem veiéreu veieren'),
      subjPres: six('vegi vegis vegi vegem vegeu vegin'),
      subjImperf: six('veiés veiessis veiés veiéssim veiéssiu veiessin'),
      impTu: 'veges', impVos: 'vegeu', gerund: 'veient', part: 'vist',
    },
    beure: {
      pres: six('bec beus beu bevem beveu beuen'),
      imperfStem: 'bev', simpleStem: 'begu', subjStem: 'begu', gerund: 'bevent', part: 'begut',
    },
    creure: {
      pres: six('crec creus creu creiem creieu creuen'),
      imperf: six('creia creies creia crèiem crèieu creien'),
      simpleStem: 'cregu', subjStem: 'cregu', gerund: 'creient', part: 'cregut',
    },
    seure: {
      pres: six('sec seus seu seiem seieu seuen'),
      imperf: six('seia seies seia sèiem sèieu seien'),
      simpleStem: 'segu', subjStem: 'segu', gerund: 'seient', part: 'segut',
    },
    riure: {
      pres: six('ric rius riu riem rieu riuen'),
      imperf: six('reia reies reia rèiem rèieu reien'),
      simpleStem: 'rigu', subjStem: 'rigu', gerund: 'rient', part: 'rigut',
    },
    viure: {
      pres: six('visc vius viu vivim viviu viuen'),
      imperfStem: 'viv', simpleStem: 'visqu', subjStem: 'visqu', gerund: 'vivint', part: 'viscut',
    },
    caure: {
      pres: six('caic caus cau caiem caieu cauen'),
      imperf: six('queia queies queia quèiem quèieu queien'),
      simpleStem: 'caigu', subjStem: 'caigu', gerund: 'caient', part: 'caigut',
    },
    deure: {
      pres: six('dec deus deu devem deveu deuen'),
      imperfStem: 'dev', simpleStem: 'degu', subjStem: 'degu', gerund: 'devent', part: 'degut',
    },
    ploure: {
      pres: six('ploc plous plou plovem ploveu plouen'),
      imperfStem: 'plov', simpleStem: 'plogu', subjStem: 'plogu', gerund: 'plovent', part: 'plogut',
    },
    pertànyer: { part: 'pertangut' },
    rebre: { pres: six('rebo reps rep rebem rebeu reben'), impTu: 'rep' },
    concebre: { pres: six('concebo conceps concep concebem concebeu conceben'), impTu: 'concep' },
    decebre: { pres: six('decebo deceps decep decebem decebeu deceben'), impTu: 'decep' },
    percebre: { pres: six('percebo perceps percep percebem percebeu perceben'), impTu: 'percep' },
    fugir: {
      kind: 'ir',
      pres: six('fujo fuges fuig fugim fugiu fugen'),
      subjPres: six('fugi fugis fugi fugim fugiu fugin'),
      impTu: 'fuig',
    },
    tossir: { kind: 'ir', pres: six('tusso tusses tus tossim tossiu tussen'), stressed: 'tuss' },
    // verbs with a single irregular participle
    créixer: { part: 'crescut' },
    néixer: { part: 'nascut' },
    merèixer: { part: 'merescut' },
    córrer: { simpleStem: 'corregu', part: 'corregut' },
    sofrir: { part: 'sofert' },
    oferir: { part: 'ofert' },
    omplir: { kind: 'ir', part: 'omplert' },
    morir: { kind: 'ir', part: 'mort' },
  };

  // Irregular verbs that pass their pattern on to prefixed relatives (tenir ->
  // mantenir, escriure -> descriure). `spec` receives the prefix and returns
  // the verb's overrides; all prefixes are accepted unless `prefixes` lists them.
  const FAMILIES = [
    {
      base: 'tenir',
      spec: p => ({
        kind: 'ir',
        pres: six(`${p}tinc ${p}tens ${p}té ${p}tenim ${p}teniu ${p}tenen`),
        simpleStem: p + 'tingu', subjStem: p + 'tingu', fut: p + 'tindr',
        impTu: p + 'tingues', impVos: p + 'tingueu', part: p + 'tingut',
      }),
    },
    {
      base: 'venir',
      spec: p => ({
        kind: 'ir',
        // véns / vénen carry a diacritic accent that the prefixed verbs lose
        pres: [p + 'vinc', p ? p + 'vens' : 'véns', p ? p + 'vé' : 've',
               p + 'venim', p + 'veniu', p ? p + 'venen' : 'vénen'],
        simpleStem: p + 'vingu', subjStem: p + 'vingu', fut: p + 'vindr',
        impTu: p ? p + 'vingues' : 'vine', impVos: p + 'veniu', part: p + 'vingut',
      }),
    },
    {
      base: 'fer',
      spec: p => {
        // fa / fas / fes gain an accent when a prefix makes them aguda
        const [fas, fa, fes] = p ? ['fàs', 'fà', 'fés'] : ['fas', 'fa', 'fes'];
        return {
          kind: 'er',
          pres: [p + 'faig', p + fas, p + fa, p + 'fem', p + 'feu', p + 'fan'],
          imperf: six(`${p}feia ${p}feies ${p}feia ${p}fèiem ${p}fèieu ${p}feien`),
          simple: six(`${p}fiu ${p}feres ${p}féu ${p}férem ${p}féreu ${p}feren`),
          subjPres: [p + 'faci', p + 'facis', p + 'faci', p + 'fem', p + 'feu', p + 'facin'],
          subjImperf: [p + fes, p + 'fessis', p + fes, p + 'féssim', p + 'féssiu', p + 'fessin'],
          fut: p + 'far', impTu: p + fes, impVos: p + 'feu', gerund: p + 'fent', part: p + 'fet',
        };
      },
    },
    {
      base: 'dir',
      prefixes: ['', 'pre', 'contra', 'des'],
      spec: p => ({
        kind: 'ir',
        pres: six(`${p}dic ${p}dius ${p}diu ${p}diem ${p}dieu ${p}diuen`),
        imperf: six(`${p}deia ${p}deies ${p}deia ${p}dèiem ${p}dèieu ${p}deien`),
        simpleStem: p + 'digu', subjStem: p + 'digu',
        impTu: p + 'digues', impVos: p + 'digueu', gerund: p + 'dient', part: p + 'dit',
      }),
    },
    {
      base: 'veure',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}veig ${p}veus ${p}veu ${p}veiem ${p}veieu ${p}veuen`),
        imperf: six(`${p}veia ${p}veies ${p}veia ${p}vèiem ${p}vèieu ${p}veien`),
        simple: six(`${p}veí ${p}veieres ${p}veié ${p}veiérem ${p}veiéreu ${p}veieren`),
        subjPres: six(`${p}vegi ${p}vegis ${p}vegi ${p}vegem ${p}vegeu ${p}vegin`),
        subjImperf: six(`${p}veiés ${p}veiessis ${p}veiés ${p}veiéssim ${p}veiéssiu ${p}veiessin`),
        impTu: p + 'veges', impVos: p + 'vegeu', gerund: p + 'veient', part: p + 'vist',
      }),
    },
    {
      base: 'treure',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}trec ${p}treus ${p}treu ${p}traiem ${p}traieu ${p}treuen`),
        imperf: six(`${p}treia ${p}treies ${p}treia ${p}trèiem ${p}trèieu ${p}treien`),
        simpleStem: p + 'tregu',
        subjPres: six(`${p}tregui ${p}treguis ${p}tregui ${p}traguem ${p}tragueu ${p}treguin`),
        gerund: p + 'traient', part: p + 'tret',
      }),
    },
    {
      // incloure, concloure, excloure…
      base: 'cloure',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}cloc ${p}clous ${p}clou ${p}cloem ${p}cloeu ${p}clouen`),
        imperf: six(`${p}cloïa ${p}cloïes ${p}cloïa ${p}cloíem ${p}cloíeu ${p}cloïen`),
        simpleStem: p + 'clogu', subjStem: p + 'clogu', gerund: p + 'cloent', part: p + 'clòs',
      }),
    },
    {
      // cobrir, descobrir, encobrir, recobrir (checked before obrir, which they end with)
      base: 'cobrir',
      spec: p => ({ part: p + 'cobert' }),
    },
    {
      base: 'obrir',
      prefixes: ['', 're', 'entre'],
      spec: p => ({ kind: 'ir', part: p + 'obert' }),
    },
    {
      base: 'moure',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}moc ${p}mous ${p}mou ${p}movem ${p}moveu ${p}mouen`),
        imperfStem: p + 'mov', simpleStem: p + 'mogu', subjStem: p + 'mogu',
        gerund: p + 'movent', part: p + 'mogut',
      }),
    },
    {
      // escriure, descriure, inscriure, prescriure, subscriure, transcriure…
      base: 'criure',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}cric ${p}crius ${p}criu ${p}crivim ${p}criviu ${p}criuen`),
        imperfStem: p + 'criv',
        simple: six(`${p}criví ${p}crivires ${p}criví ${p}crivírem ${p}crivíreu ${p}criviren`),
        subjPres: six(`${p}crigui ${p}criguis ${p}crigui ${p}criguem ${p}crigueu ${p}criguin`),
        subjImperf: six(`${p}crivís ${p}crivissis ${p}crivís ${p}crivíssim ${p}crivíssiu ${p}crivissin`),
        gerund: p + 'crivint', part: p + 'crit',
      }),
    },
    {
      base: 'riure',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}ric ${p}rius ${p}riu ${p}riem ${p}rieu ${p}riuen`),
        imperf: six(`${p}reia ${p}reies ${p}reia ${p}rèiem ${p}rèieu ${p}reien`),
        simpleStem: p + 'rigu', subjStem: p + 'rigu', gerund: p + 'rient', part: p + 'rigut',
      }),
    },
    {
      base: 'viure',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}visc ${p}vius ${p}viu ${p}vivim ${p}viviu ${p}viuen`),
        imperfStem: p + 'viv', simpleStem: p + 'visqu', subjStem: p + 'visqu',
        gerund: p + 'vivint', part: p + 'viscut',
      }),
    },
    {
      base: 'conèixer',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}conec ${p}coneixes ${p}coneix ${p}coneixem ${p}coneixeu ${p}coneixen`),
        simpleStem: p + 'conegu', subjStem: p + 'conegu', part: p + 'conegut',
      }),
    },
    {
      base: 'parèixer',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}parec ${p}pareixes ${p}pareix ${p}pareixem ${p}pareixeu ${p}pareixen`),
        simpleStem: p + 'paregu', subjStem: p + 'paregu', part: p + 'paregut',
      }),
    },
    {
      base: 'vèncer',
      spec: p => ({
        kind: 'er',
        pres: six(`${p}venço ${p}vences ${p}venç ${p}vencem ${p}venceu ${p}vencen`),
        part: p + 'vençut',
      }),
    },
    {
      base: 'córrer',
      spec: p => ({ kind: 'er', simpleStem: p + 'corregu', part: p + 'corregut' }),
    },
    {
      // admetre, cometre, permetre, prometre, transmetre…
      base: 'metre',
      spec: p => ({ kind: 'er', part: p + 'mès' }),
    },
    {
      // aprendre, comprendre, sorprendre… (1st person prenc, subjunctive prengui)
      base: 'prendre',
      spec: p => ({
        kind: 'er',
        pres: [p + 'prenc', p + 'prens', p ? p + 'prèn' : 'pren', p + 'prenem', p + 'preneu', p + 'prenen'],
        stem: p + 'pren', simpleStem: p + 'prengu', subjStem: p + 'prengu',
        part: p ? p + 'près' : 'pres',
      }),
    },
  ];

  // Verbs in -endre with 1st person -nc: [3rd person singular, participle]
  const NDRE = {
    vendre: ['ven', 'venut'],
    entendre: ['entén', 'entès'],
    atendre: ['atén', 'atès'],
    estendre: ['estén', 'estès'],
    defendre: ['defén', 'defès'],
    encendre: ['encén', 'encès'],
    suspendre: ['suspèn', 'suspès'],
    dependre: ['depèn', 'depès'],
    pretendre: ['pretén', 'pretès'],
    respondre: ['respon', 'respost'],
    correspondre: ['correspon', 'correspost'],
    compondre: ['compon', 'compost'],
    descompondre: ['descompon', 'descompost'],
    fondre: ['fon', 'fos'],
    confondre: ['confon', 'confós'],
    difondre: ['difon', 'difós'],
  };

  // Pure -ir verbs (no -eix- in the present). Verbs listed with a pair swap the
  // vowel in stressed forms: collir -> cullo, sortir -> surto.
  const PURE_IR = {
    dormir: null, adormir: null, sentir: null, consentir: null, pressentir: null, assentir: null,
    bullir: null, grunyir: null, escopir: ['op', 'up'], cosir: ['os', 'us'],
    sortir: ['ort', 'urt'], sobresortir: ['ort', 'urt'], vestir: ['est', 'ist'],
  };
  const PURE_IR_SUFFIX = [['collir', ['oll', 'ull']]];

  // ---- Spelling ------------------------------------------------------------

  // Attach an ending to a stem. `hard` stems (-car, -gar, -çar, -jar) change
  // before e/i; soft stems (-cer, -gir) change before a/o.
  function join(stem, ending, hard) {
    if (ending[0] === 'i' && ending !== 'int') {
      // a vowel followed by an unstressed i is a hiatus: constru + im -> construïm
      const hiatus = hard ? /(^|[^gq])[iu]$/ : /[aeo]$|(^|[^gq])u$/;
      if (hiatus.test(stem)) ending = 'ï' + ending.slice(1);
    }
    const first = ending[0];
    if (hard && 'eiéèíï'.includes(first)) {
      if (stem.endsWith('c')) stem = stem.slice(0, -1) + 'qu';
      else if (stem.endsWith('g')) stem += 'u';
      else if (stem.endsWith('ç')) stem = stem.slice(0, -1) + 'c';
      else if (stem.endsWith('j')) stem = stem.slice(0, -1) + 'g';
    } else if (!hard && 'aoàòóu'.includes(first)) {
      if (stem.endsWith('c')) stem = stem.slice(0, -1) + 'ç';
      else if (stem.endsWith('g')) stem = stem.slice(0, -1) + 'j';
    }
    return stem + ending;
  }

  // 2nd and 3rd person singular of the present for -re / pure -ir verbs.
  function tails(stem) {
    if (/x$|[^s]s$/.test(stem)) return ['es', '']; // neixes / neix, cuses / cus
    if (/[bcdfgpt][lr]$|rr$/.test(stem)) return ['es', 'e']; // obres / obre, corres / corre
    return ['s', ''];
  }

  const futStemOf = inf => {
    const plain = unaccent(inf);
    return plain.endsWith('re') ? plain.slice(0, -1) : plain;
  };

  // ---- Looking up a verb's irregularities -----------------------------------

  function specFor(inf) {
    if (Object.hasOwn(IRREGULAR, inf)) return IRREGULAR[inf];

    if (Object.hasOwn(NDRE, inf)) {
      const [third, part] = NDRE[inf];
      const core = inf.slice(0, -3); // vendre -> ven
      return {
        kind: 'er',
        pres: [core + 'c', core + 's', third, core + 'em', core + 'eu', core + 'en'],
        stem: core, simpleStem: core + 'gu', subjStem: core + 'gu', fut: inf.slice(0, -1), part,
      };
    }

    const match = findFamily(inf, FAMILIES);
    if (match) return match.family.spec(match.prefix);

    if (Object.hasOwn(PURE_IR, inf)) {
      const swap = PURE_IR[inf];
      const stem = inf.slice(0, -2);
      return swap ? { kind: 'ir', stressed: stem.replace(...swap) } : { kind: 'ir' };
    }
    for (const [suffix, swap] of PURE_IR_SUFFIX) {
      if (inf.endsWith(suffix)) {
        const stem = inf.slice(0, -2);
        const at = stem.lastIndexOf(swap[0]);
        return { kind: 'ir', stressed: stem.slice(0, at) + swap[1] + stem.slice(at + swap[0].length) };
      }
    }
    return {};
  }

  const kindOf = inf => inf.endsWith('ar') ? 'ar' : /ir$/.test(inf) ? 'ir+' : 'er';

  // ---- Conjugation -----------------------------------------------------------

  const SIMPLE_ENDINGS = {
    ar: six('í ares à àrem àreu aren'),
    er: six('í eres é érem éreu eren'),
    ir: six('í ires í írem íreu iren'),
  };
  const SUBJ_IMPERF_ENDINGS = {
    a: six('és essis és éssim éssiu essin'),
    i: six('ís issis ís íssim íssiu issin'),
  };

  function simpleForms(inf) {
    const spec = specFor(inf);
    const kind = spec.kind || kindOf(inf);
    const hard = kind === 'ar';
    const third = kind === 'ir' || kind === 'ir+';
    const U = spec.stem !== undefined ? spec.stem : unaccent(inf).slice(0, -2);
    const S = spec.stressed !== undefined ? spec.stressed : U;
    const j = (stem, ending) => join(stem, ending, hard);
    const [em, eu] = third ? ['im', 'iu'] : ['em', 'eu'];

    let pres = spec.pres;
    if (!pres) {
      if (kind === 'ir+') pres = [j(S, 'eixo'), j(S, 'eixes'), j(S, 'eix'), j(U, 'im'), j(U, 'iu'), j(S, 'eixen')];
      else if (hard) pres = [j(S, 'o'), j(S, 'es'), j(S, 'a'), j(U, 'em'), j(U, 'eu'), j(S, 'en')];
      else {
        const [t2, t3] = tails(S);
        pres = [j(S, 'o'), S + t2, S + t3, j(U, em), j(U, eu), j(S, 'en')];
      }
    }

    const imperfStem = spec.imperfStem !== undefined ? spec.imperfStem : U;
    const imperf = spec.imperf ||
      six(hard ? 'ava aves ava àvem àveu aven' : 'ia ies ia íem íeu ien').map(e => j(imperfStem, e));

    const simple = spec.simple || (spec.simpleStem
      ? SIMPLE_ENDINGS.er.map(e => spec.simpleStem + e)
      : SIMPLE_ENDINGS[third ? 'ir' : kind].map(e => j(U, e)));

    const futStem = spec.fut !== undefined ? spec.fut : futStemOf(inf);
    const fut = six('é às à em eu an').map(e => futStem + e);
    const cond = six('ia ies ia íem íeu ien').map(e => futStem + e);

    let subjPres = spec.subjPres;
    if (!subjPres) {
      if (spec.subjStem !== undefined) subjPres = six('i is i em eu in').map(e => spec.subjStem + e);
      else if (kind === 'ir+') subjPres = [j(S, 'eixi'), j(S, 'eixis'), j(S, 'eixi'), j(U, 'im'), j(U, 'iu'), j(S, 'eixin')];
      else subjPres = [j(S, 'i'), j(S, 'is'), j(S, 'i'), j(U, em), j(U, eu), j(S, 'in')];
    }

    let subjImperf = spec.subjImperf;
    if (!subjImperf) {
      const stem = spec.simpleStem !== undefined ? spec.simpleStem : U;
      const endings = SUBJ_IMPERF_ENDINGS[third && spec.simpleStem === undefined ? 'i' : 'a'];
      subjImperf = endings.map(e => j(stem, e));
    }

    const gerund = spec.gerund !== undefined ? spec.gerund
      : j(U, hard ? 'ant' : third ? 'int' : 'ent');
    const participle = spec.part !== undefined ? spec.part
      : j(U, hard ? 'at' : third ? 'it' : 'ut');

    const impAff = affirmativeImperative({
      tu: spec.impTu !== undefined ? spec.impTu : pres[2],
      subjPres,
      vosotros: spec.impVos !== undefined ? spec.impVos : pres[4],
    });
    const impNeg = negativeImperative(subjPres);

    return {
      pres, imperf, simple, fut, cond, subjPres, subjImperf, impAff, impNeg, gerund, participle,
    };
  }

  const HABER = simpleForms('haver');
  const PERIPHRASTIC = six('vaig vas va vam vau van');

  function conjugate(input) {
    const inf = String(input).trim().toLowerCase();
    if (!/^[a-zàèéíòóúïüç·]+(ar|er|ir|re)$/.test(inf)) return null;

    const s = simpleForms(inf);
    const perfect = haverForms => compound(haverForms, s.participle);

    return {
      inf,
      gerund: s.gerund,
      participle: s.participle,
      forms: {
        pres: s.pres,
        periphPast: compound(PERIPHRASTIC, inf),
        presPerf: perfect(HABER.pres),
        imperf: s.imperf,
        pluperf: perfect(HABER.imperf),
        simple: s.simple,
        pretAnt: perfect(HABER.simple),
        pretAntPeriph: compound(PERIPHRASTIC, `haver ${s.participle}`),
        fut: s.fut,
        futPerf: perfect(HABER.fut),
        cond: s.cond,
        condPerf: perfect(HABER.cond),
        subjPres: s.subjPres,
        subjPresPerf: perfect(HABER.subjPres),
        subjImperf: s.subjImperf,
        subjPluperf: perfect(HABER.subjImperf),
        impAff: s.impAff,
        impNeg: s.impNeg,
      },
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
