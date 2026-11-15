/*
 * Italian verb conjugation engine (standard Italian).
 *
 *   conjugate('parlare') -> { inf, gerund, participle, forms }
 *
 * Every entry in `forms` is an array of six strings, one per person:
 * io, tu, lui/lei/Lei, noi, voi, loro/Loro. Forms are written without the pronoun.
 * A form that does not exist is NONE ("—"): weather and impersonal verbs (piovere,
 * accadere, bastare ...) keep only the 3rd person singular (and, for accadere,
 * bastare, occorrere, the 3rd person plural).
 *
 * Compound tenses use the auxiliary avere (ho parlato) or essere. With essere the
 * participle agrees: "sono andato/a" (singular persons), "siamo andati/e" (plural
 * persons). With avere the participle is invariable.
 *
 * The affirmative imperative has the slots tu, tu, Lei, noi, voi, Loro (the io slot
 * repeats the tu form). The negative imperative is non + infinitive for tu, and
 * non + the affirmative form for the other persons.
 *
 * Returns null for anything this engine cannot conjugate with confidence: an empty
 * string, a word that is not an infinitive, a reflexive verb (-si), and verbs whose
 * forms are not settled (solere, pentire, esimere ...). A verb with no participle
 * (convergere, dirimere) has participle NONE and no compound tenses.
 */
(function (global) {
  'use strict';

  const { words, findFamily, compound } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  const six = words;
  const NONE = '—';

  // ---- Irregularity data ---------------------------------------------------
  //
  // A spec lists what differs from the regular pattern; everything else is derived.
  // Fields (all optional):
  //   th        thematic stem: the infinitive without -re (parlare -> parla). It gives
  //             the imperfect (th + vo), the noi/voi stems and the weak passato remoto
  //             persons. Needed for verbs in -rre and for verbs like fare (face).
  //   th2       thematic stem for tu/noi/voi of the passato remoto and the imperfect
  //             subjunctive when it differs (dare -> de: desti, dessi)
  //   pres      six present forms; '-' keeps the regular form of that person
  //   ps        strong passato remoto stem: io = ps + i, lui = ps + e, loro = ps + ero
  //   psForms   six passato remoto forms (essere)
  //   fut       future / conditional stem
  //   cong      stem of the present subjunctive for io/tu/lui/loro (+ a / ano); the
  //             default is the stem of the loro form of the present
  //   congForms, congImperfForms, imperfForms   six forms
  //   part, gerund                               direct overrides (part NONE: no participle,
  //                                              so no compound tenses: convergere)
  //   impTu     tu imperative; imp: six forms, or null when there is no imperative
  //   aux       'essere' (default avere)
  //   isc       false for an -ire verb without -isc-

  // Regular verbs with a strong passato remoto and an irregular participle. One row
  // per base: base, passato remoto stem (io = stem + i; '-' = regular), participle
  // ('_' = the verb has none), the prefixes allowed ('*' = any, '-' = none, otherwise
  // a comma list with '-' for the bare verb) and an optional fut=stem. A relative gets
  // the prefix on every form: chiudere chius chiuso -> racchiusi, racchiuso.
  const STRONG_TABLE = `
    restringere restrins ristretto -
    chiudere chius chiuso *
    cludere clus cluso in,es,con,pre,ac,oc,re,se
    ridere ris riso -,sor,de,ar,ir
    rodere ros roso *
    radere ras raso -,ab
    cidere cis ciso *
    dividere divis diviso *
    vadere vas vaso in,e,per
    suadere suas suaso per,dis
    ludere lus luso e,al,il,de,col,pre
    prendere pres preso *
    rendere res reso -
    scendere sces sceso *
    tendere tes teso *
    pendere pes peso s,ap,di,sos,riap,pro,vili
    accendere acces acceso -,ri
    fendere fes feso di,of
    fondere fus fuso *
    mordere mors morso *
    perdere pers perso -,s,dis
    scindere sciss scisso -,pre,re
    ardere ars arso -,ri
    rispondere rispos risposto *
    nascondere nascos nascosto -,ri
    chiedere chies chiesto -,ri
    correre cors corso *
    mettere mis messo *
    scrivere scriss scritto *
    vivere viss vissuto * fut=vivr
    leggere less letto *
    reggere ress retto *
    teggere tess tetto pro
    rigere ress retto di,e
    figgere fiss fitto -,tra,con,scon
    friggere friss fritto *
    fliggere fliss flitto af,in,con
    struggere struss strutto *
    giungere giuns giunto *
    ungere uns unto -
    piangere pians pianto *
    frangere frans franto -,in,ri
    fingere fins finto -
    pingere pins pinto *
    pungere puns punto -
    cingere cins cinto *
    tingere tins tinto *
    stringere strins stretto *
    tinguere tins tinto dis,es
    volgere vols volto *
    sorgere sors sorto -,in,ri
    porgere pors porto -,s
    scorgere scors scorto -
    spargere spars sparso *
    mergere mers merso *
    tergere ters terso -,de
    torcere tors torto *
    vincere vins vinto *
    muovere moss mosso *
    cuotere coss cosso s,ris,per
    nettere ness nesso con,an,scon,discon
    godere - goduto - fut=godr
    discutere discuss discusso -
    primere press presso *
    sumere suns sunto as,pre,de,rias
    pellere puls pulso es,im,com,pro,re
    plodere plos ploso es,im
    solvere sols solto ri,dis,as
    conoscere conobb conosciuto *
    crescere crebb cresciuto *
    nascere nacqu nato -,ri
    rompere rupp rotto *
    redigere redass redatto -
    succedere success successo -
    concedere concess concesso -
    piovere piovv piovuto -
    sistere - sistito *
    ledere les leso -
    aspergere aspers asperso -
    lidere lis liso col,e
    eccellere eccels eccelso -
    flettere fless flesso -
    fungere funs funto -
    figgere fiss fisso af,in,pre,croci
    redimere redens redento -
    evolvere evols evoluto -
    retrocedere retrocess retrocesso -
    convergere convers _ -
    divergere divers _ -
    dirimere - _ -
    prudere - _ -
    incombere - _ -
    spandere spans spanso e
    esigere - esatto -
  `;
  const STRONG = STRONG_TABLE.trim().split('\n').map(line => {
    const [base, ps, part, prefixes, ...extra] = words(line);
    const spec = { part: part === '_' ? NONE : part };
    if (ps !== '-') spec.ps = ps;
    for (const item of extra) {
      if (!item.startsWith('fut=')) throw new Error(`bad strong row: ${line}`);
      spec.fut = item.slice(4);
    }
    return { base, prefixes: prefixes === '*' ? undefined : prefixes.split(',').map(p => (p === '-' ? '' : p)), spec };
  });

  // -ire verbs without -isc- (the default for an -ire verb is -isc-: finire,
  // capire, preferire). A closed list: base, participle ('-' = regular), prefixes.
  const NO_ISC_TABLE = `
    aprire aperto -,ri
    coprire coperto -,ri,s,ris
    offrire offerto -,s
    partire - -,ri
    sentire - -,con,accon,dis,pre,ri,as
    mentire - -
    servire - -
    dormire - -
    seguire - -,in,per,pro,con,e
    fuggire - -,ri,s
    vestire - -,ri,s,tra,in,rin
    bollire - -,ri,s
    avvertire - -
    divertire - -
    convertire - -,ri
    invertire - -
    pervertire - -
    sovvertire - -
  `;
  const NO_ISC = NO_ISC_TABLE.trim().split('\n').map(line => {
    const [base, part, prefixes] = words(line);
    const spec = { isc: false };
    if (part !== '-') spec.part = part;
    return { base, prefixes: prefixes.split(',').map(p => (p === '-' ? '' : p)), spec };
  });

  // Families: irregular verbs that pass their pattern on to prefixed relatives (fare
  // -> rifare, tenere -> mantenere). `spec` is written for the bare verb and the
  // prefix is added to every irregular form. Any prefix is accepted unless
  // `prefixes` lists the ones that are ('' = the bare verb). The first matching base
  // wins. `adjust(spec, prefix)` runs after the prefix has been added. The tables above
  // become families too (the -isc- exceptions and the strong verbs).
  const FAMILIES = [
    {
      base: 'essere',
      prefixes: [''],
      spec: {
        pres: six('sono sei è siamo siete sono'),
        imperfForms: six('ero eri era eravamo eravate erano'),
        psForms: six('fui fosti fu fummo foste furono'),
        fut: 'sar', gerund: 'essendo', part: 'stato', aux: 'essere',
        congForms: six('sia sia sia siamo siate siano'),
        congImperfForms: six('fossi fossi fosse fossimo foste fossero'),
        imp: six('sii sii sia siamo siate siano'),
      },
    },
    {
      base: 'avere',
      prefixes: ['', 'ri'],
      spec: {
        pres: six('ho hai ha abbiamo avete hanno'),
        ps: 'ebb', fut: 'avr', cong: 'abbi',
        imp: six('abbi abbi abbia abbiamo abbiate abbiano'),
      },
    },
    {
      base: 'andare',
      prefixes: ['', 'ri'],
      spec: { pres: six('vado vai va - - vanno'), cong: 'vad', fut: 'andr', impTu: "va'", aux: 'essere' },
    },
    {
      base: 'dare',
      prefixes: ['', 'ri'],
      spec: { pres: six('do dai dà diamo date danno'), cong: 'di', th2: 'de', ps: 'died', fut: 'dar', impTu: "da'" },
    },
    {
      base: 'stare',
      prefixes: [''],
      spec: {
        pres: six('sto stai sta stiamo state stanno'),
        cong: 'sti', th2: 'ste', ps: 'stett', fut: 'star', impTu: "sta'", aux: 'essere',
      },
    },
    { // rifare, disfare, soddisfare, contraffare, sopraffare, assuefare, liquefare ...
      base: 'fare',
      prefixes: ['', 'ri', 's', 'dis', 'contraf', 'sopraf', 'stra', 'assue', 'lique', 'rare', 'stupe', 'putre', 'tume', 'torre', 'soddis'],
      spec: {
        th: 'face', pres: six('faccio fai fa facciamo fate fanno'), cong: 'facci',
        ps: 'fec', fut: 'far', part: 'fatto', impTu: "fa'",
      },
      adjust(spec, prefix) {
        if (!prefix) return;
        spec.pres[2] = prefix + 'fà'; // rifà, disfà
        if (prefix === 'soddis') { // the modern forms: soddisfo, soddisfi ...
          spec.pres = six('soddisfo soddisfi soddisfa soddisfiamo soddisfate soddisfano');
          spec.congForms = six('soddisfi soddisfi soddisfi soddisfiamo soddisfiate soddisfino');
          spec.fut = 'soddisfer';
          delete spec.impTu;
        }
      },
    },
    {
      base: 'dire',
      prefixes: ['', 'ri', 'pre', 'contrad', 'bene', 'male', 'dis', 'in', 'inter'],
      spec: { th: 'dice', pres: six('- - - - dite -'), ps: 'diss', fut: 'dir', part: 'detto', impTu: "di'" },
      adjust(spec, prefix) { if (prefix) delete spec.impTu; }, // predici, contraddici
    },
    // ---- modals ----
    { base: 'potere', prefixes: [''], spec: { pres: six('posso puoi può possiamo potete possono'), fut: 'potr', imp: null } },
    {
      base: 'volere',
      prefixes: [''],
      spec: {
        pres: six('voglio vuoi vuole vogliamo volete vogliono'), ps: 'voll', fut: 'vorr',
        imp: six('vogli vogli voglia vogliamo vogliate vogliano'),
      },
    },
    { base: 'dovere', prefixes: [''], spec: { pres: six('devo devi deve dobbiamo dovete devono'), cong: 'debb', fut: 'dovr', imp: null } },
    {
      base: 'sapere',
      prefixes: [''],
      spec: {
        pres: six('so sai sa sappiamo sapete sanno'), cong: 'sappi', ps: 'sepp', fut: 'sapr',
        imp: six('sappi sappi sappia sappiamo sappiate sappiano'),
      },
    },

    // ---- vedere, bere and the verbs in -rre ----
    { // rivedere, prevedere, intravedere, provvedere
      base: 'vedere',
      prefixes: ['', 'ri', 'pre', 'prov', 'intra'],
      spec: { ps: 'vid', fut: 'vedr', part: 'visto' },
      adjust(spec, prefix) {
        if (prefix === 'pre') spec.fut = 'preveder'; // prevederò: the regular future
        if (prefix === 'prov') { spec.fut = 'provveder'; spec.part = 'provveduto'; }
      },
    },
    { base: 'bere', prefixes: ['', 'ri'], spec: { th: 'beve', ps: 'bevv', fut: 'berr', part: 'bevuto' } },
    { // comporre, proporre, esporre, imporre, supporre, opporre, deporre, disporre ...
      base: 'porre',
      spec: { th: 'pone', pres: six('pongo - - - - pongono'), ps: 'pos', fut: 'porr', part: 'posto' },
    },
    { // attrarre, estrarre, distrarre, contrarre, sottrarre, ritrarre ...
      base: 'trarre',
      spec: { th: 'trae', pres: six('traggo - - - - traggono'), ps: 'trass', fut: 'trarr', part: 'tratto' },
    },
    { // condurre, tradurre, produrre, ridurre, introdurre, sedurre ...
      base: 'durre',
      spec: { th: 'duce', ps: 'duss', fut: 'durr', part: 'dotto' },
    },

    // ---- tenere, venire, uscire, salire, morire, rimanere ----
    { // contenere, mantenere, ottenere, trattenere, sostenere ...
      base: 'tenere',
      spec: { pres: six('tengo tieni tiene - - tengono'), ps: 'tenn', fut: 'terr' },
    },
    { // divenire, convenire, prevenire, svenire, avvenire ...
      base: 'venire',
      spec: { pres: six('vengo vieni viene - - vengono'), ps: 'venn', fut: 'verr', part: 'venuto', aux: 'essere' },
      adjust(spec, prefix) { if (['pre', 'contrav', 'sov'].includes(prefix)) spec.aux = 'avere'; },
    },
    { base: 'uscire', prefixes: ['', 'ri', 'fuori'], spec: { pres: six('esco esci esce - - escono'), aux: 'essere' } },
    {
      base: 'salire',
      prefixes: ['', 'as', 'ri'],
      spec: { pres: six('salgo - - - - salgono'), aux: 'essere' },
      adjust(spec, prefix) { if (prefix === 'as') spec.aux = 'avere'; }, // assalire
    },
    { base: 'morire', prefixes: [''], spec: { pres: six('muoio muori muore - - muoiono'), part: 'morto', aux: 'essere' } },
    {
      base: 'rimanere',
      prefixes: [''],
      spec: { pres: six('rimango - - - - rimangono'), ps: 'rimas', fut: 'rimarr', part: 'rimasto', aux: 'essere' },
    },

    // ---- -gliere, sedere, cadere, -piacere, parere, apparire ----
    { base: 'cogliere', spec: { pres: six('colgo - - - - colgono'), ps: 'cols', part: 'colto' } },
    { base: 'togliere', spec: { pres: six('tolgo - - - - tolgono'), ps: 'tols', part: 'tolto' } },
    { base: 'sciogliere', spec: { pres: six('sciolgo - - - - sciolgono'), ps: 'sciols', part: 'sciolto' } },
    { base: 'scegliere', spec: { pres: six('scelgo - - - - scelgono'), ps: 'scels', part: 'scelto' } },
    { base: 'sedere', prefixes: ['', 'pos', 'sopras'], spec: { pres: six('siedo siedi siede - - siedono') } },
    { base: 'cadere', prefixes: ['', 'ac', 'de', 'ri', 's'], spec: { ps: 'cadd', fut: 'cadr', aux: 'essere' } },
    { // dispiacere, compiacere, spiacere
      base: 'piacere',
      spec: { pres: six('piaccio - - piacciamo - piacciono'), ps: 'piacqu', part: 'piaciuto', aux: 'essere' },
      adjust(spec, prefix) { if (prefix === 'com') spec.aux = 'avere'; },
    },
    { base: 'tacere', prefixes: ['', 'sot'], spec: { pres: six('taccio - - tacciamo - tacciono'), ps: 'tacqu', part: 'taciuto' } },
    { base: 'giacere', prefixes: ['', 'sog'], spec: { pres: six('giaccio - - giacciamo - giacciono'), ps: 'giacqu', part: 'giaciuto' } },
    { base: 'parere', prefixes: [''], spec: { pres: six('paio - - paiamo - paiono'), ps: 'parv', fut: 'parr', part: 'parso', aux: 'essere' } },
    { // comparire, scomparire, riapparire, trasparire (sparire is a regular -isc- verb)
      base: 'parire',
      prefixes: ['ap', 'com', 'scom', 'riap', 'ricom', 'tras'],
      spec: { pres: six('paio - - - - paiono'), ps: 'parv', part: 'parso', aux: 'essere' },
    },
    { base: 'valere', prefixes: ['', 'pre', 'equi'], spec: { pres: six('valgo - - - - valgono'), ps: 'vals', fut: 'varr', part: 'valso', aux: 'essere' } },
    { base: 'cuocere', prefixes: ['', 'ri', 'stra'], spec: { pres: six('cuocio - - - - cuociono'), ps: 'coss', part: 'cotto' } },
    { base: 'udire', prefixes: ['', 'ri'], spec: { pres: six('odo odi ode - - odono') } },
    { base: 'empire', prefixes: ['', 'ri'], spec: { pres: six('empio empi empie - - empiono'), gerund: 'empiendo' } }, // riempire
    { base: 'cucire', prefixes: ['', 's', 'ri'], spec: { pres: six('cucio - - - - cuciono') } },
    { // compiere, adempiere: conjugated like compire (compio, compite, compii, compirò)
      base: 'mpiere',
      prefixes: ['co', 'ade'],
      spec: {
        th: 'mpi', pres: six('mpio mpi mpie mpiamo mpite mpiono'), psForms: six('mpii mpisti mpì mpimmo mpiste mpirono'),
        fut: 'mpir', gerund: 'mpiendo', part: 'mpiuto',
      },
    },
    { // only used in the 3rd person (mi duole): see IMPERSONAL
      base: 'dolere',
      prefixes: [''],
      spec: { pres: six('dolgo duoli duole dogliamo dolete dolgono'), ps: 'dols', fut: 'dorr', part: 'doluto', aux: 'essere' },
    },
    { base: 'nuocere', prefixes: [''], spec: { pres: six('nuoccio nuoci nuoce nuociamo nuocete nuocciono'), ps: 'nocqu', part: 'nociuto' } },
    { base: 'spegnere', prefixes: [''], spec: { pres: six('spengo - - - - spengono'), ps: 'spens', part: 'spento' } },
    ...NO_ISC,
    ...STRONG,
    // [more families go above this line]
  ];

  // Verbs conjugated with essere (the families above carry it in their own spec).
  const ESSERE_VERBS = new Set(words(`
    arrivare entrare rientrare tornare ritornare restare diventare costare durare
    sembrare bastare succedere capitare risultare mancare crollare affondare
    scivolare inciampare sbarcare appassire svanire
    nascere rinascere crescere decrescere rincrescere
    scendere discendere ridiscendere partire ripartire fuggire sfuggire scappare sparire
    giungere sopraggiungere emergere esplodere implodere evadere sorgere insorgere risorgere
    esistere consistere dipendere sopravvivere
    calare ascendere irrompere
    occorrere accorrere decorrere incorrere intercorrere ricorrere scorrere
    guarire dimagrire impazzire arrossire ingrassare
    piovere nevicare grandinare albeggiare annottare piovigginare diluviare nevischiare
    imbrunire bisognare appartenere decedere soccombere avvizzire retrocedere evolvere
    cascare scoppiare sbocciare affiorare tramontare precipitare sprofondare ruzzolare
    rotolare sgusciare approdare atterrare decollare fluire affluire confluire maturare fiorire
    marcire invecchiare salpare trapelare evaporare spirare perire collassare
    accedere emigrare ricrescere scaturire sgorgare subentrare straripare scattare sbiadire divampare
    balzare annegare
  `));

  // Impersonal verbs: 'sg' = only the 3rd person singular exists, 'pl' = 3rd person
  // singular and plural. `agree: false` leaves the participle without -o/-a.
  const IMPERSONAL = {
    piovere: { persons: 'sg', agree: false },
    nevicare: { persons: 'sg', agree: false },
    grandinare: { persons: 'sg', agree: false },
    tuonare: { persons: 'sg', agree: false },
    albeggiare: { persons: 'sg', agree: false },
    annottare: { persons: 'sg', agree: false },
    piovigginare: { persons: 'sg', agree: false },
    diluviare: { persons: 'sg', agree: false },
    nevischiare: { persons: 'sg', agree: false },
    imbrunire: { persons: 'sg', agree: false },
    bisognare: { persons: 'sg', agree: false },
    accadere: { persons: 'pl' },
    dolere: { persons: 'pl' },
    prudere: { persons: 'pl' },
    incombere: { persons: 'pl' },
    avvenire: { persons: 'pl' },
    bastare: { persons: 'pl' },
    occorrere: { persons: 'pl' },
  };

  // -iare verbs whose i is stressed (inviare: invio, invii; unlike studiare: studio, studi).
  const STRESSED_I = new Set(words(`
    inviare rinviare avviare riavviare ravviare deviare sviare sciare spiare obliare
    espatriare rimpatriare fuorviare disavviare`));

  // Verbs this engine does not conjugate: their forms are unsettled or defective.
  const UNSUPPORTED = new Set(words(`
    solere pentire cernere concernere ergere indulgere esimere lucere fulgere rifulgere`));

  // ---- Spelling ----------------------------------------------------------------

  // Attach an ending to a stem. -care/-gare take h before e and i (cerchi, cercherò);
  // an i that only softens c/g/sc is dropped before e and i (mangi, mangerò); a
  // stem in -i (studi-) swallows the i of the ending.
  function join(stem, ending, { type, stressed }) {
    const first = ending[0];
    if (type === 'are' && /[cg]$/.test(stem) && (first === 'e' || first === 'i')) return stem + 'h' + ending;
    if (!stem.endsWith('i')) return stem + ending;
    if (first === 'i') {
      // inviare keeps both i's in invii and inviino, but not in inviamo
      if (type === 'are' && stressed && (ending === 'i' || ending === 'ino')) return stem + ending;
      return stem + ending.slice(1);
    }
    if (first === 'e' && type === 'are' && !stressed && /[cg]i$/.test(stem)) return stem.slice(0, -1) + ending;
    return stem + ending;
  }

  // ---- Looking up a verb's irregularities -----------------------------------

  const STRING_FIELDS = ['th', 'th2', 'fut', 'ps', 'part', 'gerund', 'cong', 'impTu'];
  const LIST_FIELDS = ['pres', 'imp', 'psForms', 'imperfForms', 'congForms', 'congImperfForms'];

  function withPrefix(family, prefix) {
    const spec = { ...family.spec };
    for (const key of LIST_FIELDS) {
      if (spec[key]) spec[key] = spec[key].map(form => (form === '-' ? form : prefix + form));
    }
    if (prefix) for (const key of STRING_FIELDS) if (spec[key]) spec[key] = prefix + spec[key];
    if (family.adjust) family.adjust(spec, prefix);
    return spec;
  }

  function specFor(inf) {
    const match = findFamily(inf, FAMILIES);
    return match ? withPrefix(match.family, match.prefix) : {};
  }

  // ---- Conjugation -----------------------------------------------------------

  const IMPERF = six('vo vi va vamo vate vano');
  const FUT = six('ò ai à emo ete anno');
  const COND = six('ei esti ebbe emmo este ebbero');
  const CONG_IMPERF = six('ssi ssi sse ssimo ste ssero');
  const typeOf = inf => (inf.endsWith('are') ? 'are' : inf.endsWith('ire') ? 'ire' : 'ere');

  // All the simple (one-word) forms of a verb, or null when it cannot be conjugated.
  function simpleForms(inf) {
    if (UNSUPPORTED.has(inf)) return null;
    const type = typeOf(inf);
    const spec = specFor(inf);
    const regular = /(are|ere|ire)$/.test(inf);
    // a word with nothing before -are/-ere/-ire that is not a known verb (mare, sire)
    if (regular && Object.keys(spec).length === 0 && !/[aeiouàèéìòù]/.test(inf.slice(0, -3))) return null;
    const th = spec.th || (regular ? inf.slice(0, -2) : null);
    if (!th) return null; // a -rre verb we have no pattern for
    const th2 = spec.th2 || th;
    const nstem = th.slice(0, -1);
    const ctx = { type, stressed: STRESSED_I.has(inf) };
    const j = (stem, ending) => join(stem, ending, ctx);

    // present
    const isc = type === 'ire' && (spec.isc !== undefined ? spec.isc : !spec.pres);
    let pres;
    if (type === 'are') pres = [j(nstem, 'o'), j(nstem, 'i'), j(nstem, 'a'), j(nstem, 'iamo'), th + 'te', j(nstem, 'ano')];
    else if (isc) pres = [nstem + 'isco', nstem + 'isci', nstem + 'isce', j(nstem, 'iamo'), th + 'te', nstem + 'iscono'];
    else pres = [nstem + 'o', j(nstem, 'i'), nstem + 'e', j(nstem, 'iamo'), th + 'te', nstem + 'ono'];
    if (spec.pres) pres = spec.pres.map((form, i) => (form === '-' ? pres[i] : form));

    const imperf = spec.imperfForms || IMPERF.map(end => th + end);

    // passato remoto: strong (ps) or regular
    let ps;
    if (spec.psForms) ps = spec.psForms;
    else {
      let io, lui, loro;
      if (spec.ps) { io = spec.ps + 'i'; lui = spec.ps + 'e'; loro = spec.ps + 'ero'; }
      else {
        io = th + 'i';
        lui = nstem + (type === 'are' ? 'ò' : type === 'ere' ? 'é' : 'ì');
        loro = th + 'rono';
      }
      ps = [io, th2 + 'sti', lui, th2 + 'mmo', th2 + 'ste', loro];
    }

    const futStem = spec.fut || (type === 'are' ? j(nstem, 'er') : nstem + (type === 'ere' ? 'er' : 'ir'));
    const fut = FUT.map(end => futStem + end);
    const cond = COND.map(end => futStem + end);

    // present subjunctive: the stem of the loro form, noi = present noi
    let congPres;
    if (spec.congForms) congPres = spec.congForms;
    else {
      let sg, pl;
      if (spec.cong) { sg = spec.cong + 'a'; pl = spec.cong + 'ano'; }
      else if (type === 'are') { sg = j(nstem, 'i'); pl = j(nstem, 'ino'); }
      else if (pres[5].endsWith('ono')) { const stem = pres[5].slice(0, -3); sg = stem + 'a'; pl = stem + 'ano'; }
      else return null;
      congPres = [sg, sg, sg, pres[3], pres[3].slice(0, -3) + 'ate', pl];
    }
    const congImperf = spec.congImperfForms || CONG_IMPERF.map(end => th2 + end);

    // imperative: tu, tu, Lei, noi, voi, Loro
    let imp;
    if (spec.imp === null) imp = Array(6).fill(NONE);
    else if (spec.imp) imp = spec.imp;
    else {
      const tu = spec.impTu || (type === 'are' ? pres[2] : pres[1]);
      imp = [tu, tu, congPres[2], pres[3], pres[4], congPres[5]];
    }

    const gerund = spec.gerund || (th.endsWith('a') ? nstem + 'ando' : nstem + 'endo');
    let participle = spec.part;
    if (!participle) {
      if (!regular) return null;
      participle = nstem + (type === 'are' ? 'ato' : type === 'ere' ? 'uto' : 'ito');
    }
    const aux = spec.aux || (ESSERE_VERBS.has(inf) ? 'essere' : 'avere');

    return { pres, imperf, ps, fut, cond, congPres, congImperf, imp, gerund, participle, aux };
  }

  const AVERE = simpleForms('avere');
  const ESSERE = simpleForms('essere');

  function conjugate(input) {
    const inf = String(input).trim().toLowerCase();
    if (!/^[a-zàèéìòù]+(are|ere|ire|urre|orre|arre)$/.test(inf)) return null;
    const s = simpleForms(inf);
    if (!s || (s.participle !== NONE && !s.participle.endsWith('o'))) return null;

    const impersonal = Object.hasOwn(IMPERSONAL, inf) ? IMPERSONAL[inf] : null;
    const agree = !impersonal || impersonal.agree !== false;
    const aux = s.aux === 'essere' ? ESSERE : AVERE;

    // auxiliary + participle; with essere the participle agrees (andato/a, andati/e)
    const perfect = auxForms => {
      if (s.participle === NONE) return Array(6).fill(NONE); // a verb without a participle: no compound tenses
      if (s.aux !== 'essere') return compound(auxForms, s.participle);
      const singular = compound(auxForms, agree ? s.participle + '/a' : s.participle);
      const plural = compound(auxForms, s.participle.slice(0, -1) + (agree ? 'i/e' : 'i'));
      return singular.map((form, i) => (i >= 3 ? plural[i] : form));
    };

    const forms = {
      pres: s.pres,
      passProx: perfect(aux.pres),
      imperf: s.imperf,
      trapProx: perfect(aux.imperf),
      passRem: s.ps,
      trapRem: perfect(aux.ps),
      futSem: s.fut,
      futAnt: perfect(aux.fut),
      condPres: s.cond,
      condPass: perfect(aux.cond),
      congPres: s.congPres,
      congPass: perfect(aux.congPres),
      congImperf: s.congImperf,
      congTrap: perfect(aux.congImperf),
      impAff: s.imp,
      impNeg: s.imp.map((form, i) => (form === NONE ? NONE : 'non ' + (i < 2 ? inf : form))),
    };

    if (impersonal) {
      const keep = impersonal.persons === 'pl' ? [2, 5] : [2];
      for (const key of Object.keys(forms)) {
        // an impersonal verb has no imperative
        const none = key === 'impAff' || key === 'impNeg';
        forms[key] = forms[key].map((form, i) => (!none && keep.includes(i) ? form : NONE));
      }
    }

    return { inf, gerund: s.gerund, participle: s.participle, forms };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate, NONE };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
