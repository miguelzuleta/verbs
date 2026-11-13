/*
 * German verb conjugation engine (Standard German).
 *
 *   conjugate('sprechen') -> { inf, gerund, participle, forms }
 *
 * Input is an infinitive. A SEPARABLE prefix is marked with "|" ("auf|stehen",
 * "an|kommen"); inseparable prefixes are not marked ("verstehen", "bekommen").
 * Every entry in `forms` is an array of six strings in person order
 * (ich, du, er/sie/es, wir, ihr, sie/Sie), written without the pronoun and in
 * main-clause word order, so a separable prefix goes last ("stehe auf",
 * "bin aufgestanden"). Returns null for anything this engine cannot conjugate
 * with confidence: reflexive verbs ("sich waschen"), words that are not
 * infinitives, or a verb whose separable prefix is not marked.
 *
 * `inf` is the infinitive without "|", `gerund` the Partizip I and
 * `participle` the Partizip II.
 *
 * A form that does not exist is NONE ("—"). Impersonal verbs (regnen) exist only
 * in the 3rd person singular. The imperative has six slots in the order
 * du, du, du, wir, ihr, Sie (ich and er/sie/es borrow the du form); the modal
 * verbs have no imperative.
 *
 * Konjunktiv I and II use the textbook endings (du sprechest, ihr sprechet,
 * du sprächest); werden-forms give the Konditional.
 */
(function (global) {
  'use strict';

  const { words, findFamily, compound } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  const six = words;
  const NONE = '—';

  // ---- Principal parts -----------------------------------------------------------
  //
  // A spec lists the principal parts of a verb; everything else is derived.
  // Fields (all optional; the weak pattern supplies what is missing):
  //   pres      six present forms (sein, haben, werden, tun, wissen, the modals)
  //   st2       the changed stem of du and er (sprich- for sprechen, fähr- for fahren)
  //   prat      Präteritum 1st/3rd person: "sprach" (strong, endings are added) or
  //             "brachte" (ends in -e: weak-like, the endings -st -n -t -n are added)
  //   praetForms  six Präteritum forms, when the endings do not fit (sein)
  //   part      Partizip II without ge-: "sprochen" (the engine adds ge-)
  //   noGe      the verb has a built-in prefix, so the participle takes no ge-
  //   konj2     Konjunktiv II 1st person (derived from prat when missing)
  //   konj1b    Konjunktiv I 1st person when the present ich form does not give it
  //   konj1     six Konjunktiv I forms (sein, tun)
  //   imp       [du, wir, ihr, Sie] imperative; null: the verb has no imperative
  //   gerund    Partizip I (default: infinitive + d)
  //   aux       'sein' or 'haben' (default haben)
  //   third     'sg': only the 3rd person singular exists; 'third': 3rd person sg and pl

  // Strong and mixed verbs, one per line:
  //   infinitive  changed-stem-of-du/er  Präteritum  Partizip-II-without-ge  Konjunktiv-II  flags
  // "-" means "none / derive it". Flags: s = sein, N = built-in prefix (no ge-),
  // 0 = no prefixed relatives, 3 = only 3rd person.
  const STRONG = `
    backen - backte backen - -
    beginnen - begann begonnen begänne N0
    beißen - biss bissen - -
    bergen birg barg borgen bärge -
    biegen - bog bogen - -
    bieten - bot boten - -
    binden - band bunden - -
    bitten - bat beten - -
    blasen bläs blies blasen - -
    bleiben - blieb blieben - s
    braten brät briet braten - -
    brechen brich brach brochen - -
    brennen - brannte brannt brennte -
    bringen - brachte bracht brächte -
    denken - dachte dacht dächte -
    dreschen drisch drosch droschen drösche 0
    dringen - drang drungen - s
    empfehlen empfiehl empfahl empfohlen empföhle N0
    befehlen befiehl befahl befohlen beföhle N0
    erlöschen erlisch erlosch erloschen erlösche sN0
    erschaffen - erschuf erschaffen erschüfe N0
    erklimmen - erklomm erklommen erklömme N0
    essen iss aß gessen - 0
    fahren fähr fuhr fahren - s
    fallen fäll fiel fallen - s
    fangen fäng fing fangen - -
    fechten ficht focht fochten - 0
    finden - fand funden - -
    flechten flicht flocht flochten - 0
    fliegen - flog flogen - s
    fliehen - floh flohen - s
    fließen - floss flossen - s
    fressen friss fraß fressen - 0
    frieren - fror froren - -
    gebären gebier gebar geboren gebäre N0
    geben gib gab geben - -
    gedeihen - gedieh gediehen gediehe sN0
    gehen - ging gangen - s
    gelingen - gelang gelungen gelänge sN03
    gelten gilt galt golten gölte -
    genesen - genas genesen genäse sN0
    genießen - genoss genossen genösse N0
    geschehen geschieh geschah geschehen geschähe sN03
    gewinnen - gewann gewonnen gewänne N0
    gießen - goss gossen - -
    gleichen - glich glichen - -
    gleiten - glitt glitten - s
    graben gräb grub graben - -
    greifen - griff griffen - -
    halten hält hielt halten - -
    hängen - hing hangen - 0
    hauen - haute hauen - -
    heben - hob hoben - -
    heißen - hieß heißen - -
    helfen hilf half holfen hülfe 0
    kennen - kannte kannt kennte -
    klingen - klang klungen - -
    kneifen - kniff kniffen - -
    kommen - kam kommen - s
    kriechen - kroch krochen - s
    laden läd lud laden - -
    lassen läss ließ lassen - -
    laufen läuf lief laufen - s
    leiden - litt litten - -
    leihen - lieh liehen - -
    lesen lies las lesen - -
    liegen - lag legen - -
    lügen - log logen - -
    mahlen - mahlte mahlen - -
    meiden - mied mieden - -
    messen miss maß messen - -
    misslingen - misslang misslungen misslänge sN0
    nehmen nimm nahm nommen - -
    nennen - nannte nannt nennte -
    pfeifen - pfiff pfiffen - -
    preisen - pries priesen - -
    raten rät riet raten - -
    reiben - rieb rieben - -
    reißen - riss rissen - -
    reiten - ritt ritten - s
    quellen quill quoll quollen quölle s0
    rennen - rannte rannt rennte s
    riechen - roch rochen - -
    ringen - rang rungen - -
    rinnen - rann ronnen - s
    rufen - rief rufen - -
    salzen - salzte salzen - -
    saufen säuf soff soffen - -
    scheiden - schied schieden - -
    scheinen - schien schienen - -
    scheren - schor schoren schöre 0
    schelten schilt schalt scholten schölte 0
    schieben - schob schoben - -
    schießen - schoss schossen - -
    schlafen schläf schlief schlafen - -
    schinden - schindete schunden - -
    scheißen - schiss schissen - 0
    schlagen schläg schlug schlagen - -
    schleichen - schlich schlichen - s
    schleifen - schliff schliffen - 0
    schließen - schloss schlossen - -
    schlingen - schlang schlungen - -
    schmeißen - schmiss schmissen - -
    schmelzen schmilz schmolz schmolzen - s
    schneiden - schnitt schnitten - -
    schreiben - schrieb schrieben - -
    schreien - schrie schrien - -
    schreiten - schritt schritten - s
    schweigen - schwieg schwiegen - -
    schwellen schwill schwoll schwollen - s0
    schwimmen - schwamm schwommen schwömme s
    schwinden - schwand schwunden - s
    schwingen - schwang schwungen - -
    schwören - schwor schworen schwüre -
    sehen sieh sah sehen - -
    singen - sang sungen - -
    sinken - sank sunken - s
    sinnen - sann sonnen - -
    sitzen - saß sessen - -
    speien - spie spien - 0
    spalten - spaltete spalten - 0
    spinnen - spann sponnen - -
    sprechen sprich sprach sprochen - -
    sprießen - spross sprossen - s0
    springen - sprang sprungen - s
    stechen stich stach stochen - -
    stehen - stand standen stünde -
    stehlen stiehl stahl stohlen - -
    steigen - stieg stiegen - s
    sterben stirb starb storben stürbe s
    stinken - stank stunken - -
    stoßen stöß stieß stoßen - -
    streichen - strich strichen - -
    streiten - stritt stritten - -
    tragen träg trug tragen - -
    treffen triff traf troffen - -
    treiben - trieb trieben - -
    treten tritt trat treten - -
    trinken - trank trunken - -
    trügen - trog trogen - -
    verderben verdirb verdarb verdorben verdürbe N0
    verdrießen - verdross verdrossen verdrösse N0
    vergessen vergiss vergaß vergessen vergäße N0
    verlieren - verlor verloren verlöre N0
    wachsen wächs wuchs wachsen - s
    wägen - wog wogen - -
    waschen wäsch wusch waschen - -
    weichen - wich wichen - s
    weisen - wies wiesen - -
    wenden - wandte wandt wendete -
    werben wirb warb worben würbe -
    werfen wirf warf worfen würfe -
    wiegen - wog wogen - -
    winden - wand wunden - -
    wringen - wrang wrungen - -
    zeihen - zieh ziehen - -
    ziehen - zog zogen - -
    zwingen - zwang zwungen - -
  `;

  // The one-verb-at-a-time irregular verbs.
  const IRREGULAR_SPECS = [
    {
      base: 'sein', prefixes: [''],
      spec: {
        pres: six('bin bist ist sind seid sind'),
        praetForms: six('war warst war waren wart waren'),
        part: 'wesen', konj2: 'wäre',
        konj1: six('sei seiest sei seien seiet seien'),
        konj2Forms: six('wäre wärst wäre wären wärt wären'),
        imp: ['sei', 'seien', 'seid', 'seien'], gerund: 'seiend', aux: 'sein',
      },
    },
    {
      base: 'haben', prefixes: [''],
      spec: {
        pres: six('habe hast hat haben habt haben'),
        prat: 'hatte', part: 'habt', konj2: 'hätte', imp: ['hab', 'haben', 'habt', 'haben'],
      },
    },
    {
      base: 'werden', prefixes: [''],
      spec: {
        pres: six('werde wirst wird werden werdet werden'),
        prat: 'wurde', part: 'worden', konj2: 'würde', aux: 'sein',
        imp: ['werde', 'werden', 'werdet', 'werden'],
      },
    },
    {
      base: 'tun', prefixes: ['', 'ver'],
      spec: {
        pres: six('tue tust tut tun tut tun'),
        prat: 'tat', part: 'tan', konj2: 'täte', gerund: 'tuend',
        konj1: six('tue tuest tue tuen tuet tuen'), imp: ['tu', 'tun', 'tut', 'tun'],
      },
    },
    {
      base: 'wissen', prefixes: [''],
      spec: {
        pres: six('weiß weißt weiß wissen wisst wissen'),
        prat: 'wusste', part: 'wusst', konj2: 'wüsste', konj1b: 'wisse',
        imp: ['wisse', 'wissen', 'wisst', 'wissen'],
      },
    },
    {
      base: 'können', prefixes: [''],
      spec: {
        pres: six('kann kannst kann können könnt können'),
        prat: 'konnte', part: 'konnt', konj2: 'könnte', konj1b: 'könne', imp: null,
      },
    },
    {
      base: 'müssen', prefixes: [''],
      spec: {
        pres: six('muss musst muss müssen müsst müssen'),
        prat: 'musste', part: 'musst', konj2: 'müsste', konj1b: 'müsse', imp: null,
      },
    },
    {
      base: 'dürfen', prefixes: ['', 'be'],
      spec: {
        pres: six('darf darfst darf dürfen dürft dürfen'),
        prat: 'durfte', part: 'durft', konj2: 'dürfte', konj1b: 'dürfe', imp: null,
      },
    },
    {
      base: 'wollen', prefixes: [''],
      spec: {
        pres: six('will willst will wollen wollt wollen'),
        prat: 'wollte', part: 'wollt', konj2: 'wollte', konj1b: 'wolle', imp: null,
      },
    },
    {
      base: 'sollen', prefixes: [''],
      spec: {
        pres: six('soll sollst soll sollen sollt sollen'),
        prat: 'sollte', part: 'sollt', konj2: 'sollte', konj1b: 'solle', imp: null,
      },
    },
    {
      base: 'mögen', prefixes: ['', 'ver'],
      spec: {
        pres: six('mag magst mag mögen mögt mögen'),
        prat: 'mochte', part: 'mocht', konj2: 'möchte', konj1b: 'möge', imp: null,
      },
    },
  ];

  // ---- Prefixes -------------------------------------------------------------------

  // Inseparable prefixes: the participle takes no ge-. "um" and "durch" are
  // separable too, but an unmarked "umarmen" / "durchsuchen" is the inseparable verb.
  const INSEP = ['be', 'emp', 'ent', 'er', 'ge', 'miss', 'ver', 'zer', 'hinter', 'über', 'unter', 'wider', 'voll', 'um', 'durch'];
  const INSEP_PREFIXES = [''];
  for (const p of INSEP) INSEP_PREFIXES.push(p);
  for (const first of ['miss', 'über', 'unter', 'hinter', 'voll', 'durch', 'um', 'wider']) {
    for (const second of ['be', 'emp', 'ent', 'er', 'ge', 'ver', 'zer']) INSEP_PREFIXES.push(first + second);
  }
  const INSEP_START = /^(?:miss|hinter|wider|voll|durch|unter|über|emp|ent|ver|zer|be|er|ge|um)/;

  // Verbs that begin with the letters of an inseparable prefix without having one
  // (beten -> gebetet, erben -> geerbt).
  const NOT_PREFIXED = new Set(`
    beben beten betten betteln bellen beugen beizen bessern bechern erben erden ernten gerben
    geigen gellen geißeln entern zerren beuten widern`.trim().split(/\s+/));
  // Verbs without ge- for a reason other than a prefix or -ieren.
  const NO_GE = new Set(['wiederholen', 'offenbaren', 'prophezeien', 'interviewen', 'recyceln', 'rebooten', 'debuggen']);

  // Strong verbs too rare to list; a weak guess would be wrong, so they are refused.
  const REFUSED = new Set(['bersten', 'gären', 'glimmen', 'klimmen', 'schleißen', 'schrecken', 'sieden', 'stieben']);

  // Finite forms that look like an infinitive.
  const NOT_INFINITIVES = new Set(['tuen', 'seien']);

  // Prefixed look-alikes that are NOT relatives of a strong verb (bereiten is
  // weak, reiten is strong).
  // begleiten is weak (it only ends like gleiten), umringen comes from Ring, and entwenden / verwenden
  // are weak in standard usage (entwendete, verwendete).
  const NOT_RELATED = new Set(['bereiten', 'erweichen', 'veranlassen', 'verleiden', 'begleiten', 'umringen', 'entwenden', 'verwenden']);

  // Separable prefixes. A verb written WITHOUT the "|" that starts with one of them
  // is refused (the database must write zurück|kommen), because "abholen" and
  // "ausrutschen" cannot be told from an inseparable verb. SEP_DISTINCT prefixes
  // never start an unprefixed verb; the short ones (ab, an, ein...) do (angeln,
  // antworten), so those verbs are listed in UNMARKED_OK.
  const SEP_DISTINCT = `
    zurück zusammen heraus herein herunter herauf heran herbei hervor hinaus hinein hinunter hinauf
    hinzu vorbei voran voraus entgegen entlang gegenüber weiter nieder empor fort heim hoch
    dazu dabei dafür dagegen davon`.trim().split(/\s+/);
  const SEP_SHORT = ['ab', 'an', 'auf', 'aus', 'bei', 'ein', 'mit', 'nach', 'vor', 'weg', 'zu', 'her', 'hin', 'los', 'dar', 'wieder', 'frei', 'statt', 'teil', 'fest'];
  const UNMARKED_OK = new Set(`
    angeln ankern antworten einigen zucken zuckern zupfen zurren beichten beinhalten herrschen herbergen
    hindern festigen wiederholen
    übertreten unterstellen übergehen`.trim().split(/\s+/));
  // The last three exist both ways (über|treten "to change sides", übertreten "to infringe"). The
  // database writes the separable verb with "|", so an unmarked one is the inseparable verb.
  // um-, durch- and voll- verbs that are only inseparable. Any other unmarked verb
  // with these prefixes is refused (umbauen, durchführen, volltanken are separable).
  const PREFIX_OK = new Set(`
    umarmen umgeben umringen umzingeln umfassen umkreisen umrunden umschlingen umfangen umschließen
    umgarnen umhüllen umrahmen umwerben umspülen umspielen umsäumen umsegeln durchdringen durchqueren
    durchsuchen durchschauen durchleben durchleiden durchforsten durchkreuzen durchlöchern
    durchwandern durchstreifen vollenden vollbringen vollziehen vollführen vollstrecken
    umzäunen umschmeicheln umklammern ummauern umschreiben umgehen durchbohren durchtränken durchnässen
    durchtrennen durchleuchten durchkämmen`.trim().split(/\s+/));
  // über-/unter-/wider- verbs that exist both ways; the database must mark the separable one.
  const AMBIGUOUS = new Set(`
    übergehen überlaufen übertreten überwerfen überziehen überfließen überkochen untergehen unterbringen
    unterkommen untertauchen unterstellen unterlaufen widerspiegeln`.trim().split(/\s+/));

  // ---- Auxiliary choice -------------------------------------------------------------

  // Verbs (without a separable prefix) conjugated with sein.
  const SEIN_CORE = new Set(`
    reisen verreisen wandern folgen erfolgen begegnen passieren scheitern landen rasen eilen stürzen
    marschieren klettern explodieren kollidieren emigrieren immigrieren migrieren verunglücken
    gelangen erwachen erröten erblassen erkranken ermüden verwelken welken verblühen erblühen
    verfaulen faulen verrotten rosten tauen verhungern verdursten verdunsten verdampfen hüpfen
    schlüpfen rutschen flitzen sausen huschen schlendern stolpern stolzieren taumeln torkeln
    humpeln krabbeln kentern stranden glücken missglücken erlahmen erkalten erstarren verarmen
    entstehen ertrinken erscheinen erfrieren ersaufen erwachsen gefrieren geraten gerinnen ergehen
    erliegen unterliegen widerfahren missraten verstreichen zerbrechen
    reifen radeln altern vernarben erschauern erbeben erzittern
    platzen zerplatzen prallen driften magern schweifen verblassen verklingen verdorren verenden verheilen
    verkümmern verrosten verstummen vertrocknen ertönen flüchten hoppeln hopsen kollabieren kullern purzeln
    rieseln sickern straucheln schrumpfen schlurfen waten schnellen strömen robben spazieren`.trim().split(/\s+/));
  // Verbs whose prefix would make them sein verbs by the general rule but take haben.
  const HABEN_CORE = new Set(['verfahren', 'entscheiden', 'verfolgen']);
  // Separable verbs that are weak although the base verb is strong (hängen: hing; aufhängen: hängte auf).
  // schrecken is refused on its own (strong intransitive schrak, weak transitive schreckte); the
  // separable verbs ab|schrecken and zurück|schrecken are weak in standard usage.
  const WEAK_FULL = new Set(['auf|hängen', 'an|hängen', 'ein|hängen', 'um|hängen', 'ein|weichen', 'auf|weichen',
    'ab|schrecken', 'zurück|schrecken',
    'aus|scheren', 'ein|scheren', // nautical / traffic "scheren" (to veer): scherte aus, ausgeschert
    'aus|hängen']);                // to put up a notice: hängte aus, ausgehängt

  // Separable verbs whose auxiliary differs from the base verb's.
  const AUX_FULL = {};
  for (const key of `
    auf|stehen auf|wachen ein|schlafen um|ziehen ein|ziehen weg|ziehen fort|ziehen zu|frieren
    auf|tauchen unter|tauchen ab|tauchen ein|treffen zusammen|treffen ab|biegen ein|biegen
    zurück|kehren heim|kehren um|kehren ein|kehren wieder|kehren um|kippen auf|blühen
    ab|hauen ein|treten aus|treten auf|treten zurück|treten an|treten bei|treten vor|treten
    hervor|treten aus|brechen ein|brechen zusammen|brechen los|brechen auf|brechen weg|brechen
    durch|brechen hervor|brechen über|treten zurück|schrecken entgegen|treten zurück|zucken zusammen|zucken
    zusammen|stoßen auf|flammen auf|lodern auf|leben dahin|siechen vor|rücken umher|streifen umher|irren
    aus|trocknen treiben rollen aus|scheiden aus|scheren ein|scheren`.trim().split(/\s+/)) AUX_FULL[key] = 'sein';

  // Verbs that exist only in the 3rd person singular.
  const IMPERSONAL = new Set(['regnen', 'schneien', 'nieseln', 'hageln', 'gewittern']);
  // ... and weak verbs that exist only in the 3rd person, singular and plural (es dauert, die Pläne klappen).
  const THIRD_ONLY = new Set(['dauern', 'mangeln', 'klappen']);

  // Prefixes a strong verb may take (default: all inseparable ones).
  const PREFIX_LIMIT = {
    tun: ['', 'ver'], weichen: ['', 'ent'], liegen: ['', 'unter', 'er'], zeihen: ['', 'ver'],
    wägen: ['', 'er'], mögen: ['', 'ver'], dürfen: ['', 'be'], helfen: ['', 'ver'], fressen: ['', 'zer'],
    fechten: ['', 'ver'], flechten: ['', 'ver'], sprießen: ['', 'ent'],
  };

  function strongFamilies() {
    return STRONG.trim().split('\n').map(line => {
      const [inf, st2, prat, part, konj2, flags = ''] = line.trim().split(/\s+/);
      const spec = { prat, part, aux: flags.includes('s') ? 'sein' : 'haben' };
      if (st2 !== '-') spec.st2 = st2;
      spec.konj2 = konj2 !== '-' ? konj2 : deriveKonj2(prat);
      if (flags.includes('N')) spec.noGe = true;
      if (flags.includes('3')) spec.third = 'third';
      const prefixes = Object.hasOwn(PREFIX_LIMIT, inf) ? PREFIX_LIMIT[inf] : flags.includes('0') ? [''] : INSEP_PREFIXES;
      return { base: inf, prefixes, spec };
    });
  }

  const FAMILIES = [
    ...IRREGULAR_SPECS.map(({ base, prefixes, spec }) => ({ base, prefixes, spec })),
    ...strongFamilies(),
  ];

  // ---- Building blocks --------------------------------------------------------------

  const ENDINGS = ['', 'st', '', 'n', 't', 'n']; // appended to a form that ends in -e
  const WERDEN = six('werde wirst wird werden werdet werden');
  const WUERDE = six('würde würdest würde würden würdet würden');
  const AUX = {
    haben: {
      pres: six('habe hast hat haben habt haben'),
      praet: six('hatte hattest hatte hatten hattet hatten'),
      konj1: six('habe habest habe haben habet haben'),
      konj2: six('hätte hättest hätte hätten hättet hätten'),
      inf: 'haben',
    },
    sein: {
      pres: six('bin bist ist sind seid sind'),
      praet: six('war warst war waren wart waren'),
      konj1: six('sei seiest sei seien seiet seien'),
      konj2: six('wäre wärst wäre wären wärt wären'),
      inf: 'sein',
    },
  };

  // A stem that needs an e before -st / -t / -te: arbeit-, bad-, öffn-, atm-, rechn-.
  const needsE = stem => /[dt]$/.test(stem) || /chn$/.test(stem) || /[bcdfgkpqtvwz][mn]$/.test(stem);

  // Umlaut the vowel of a Präteritum stem for the Konjunktiv II: sprach -> spräche.
  function deriveKonj2(prat) {
    if (/te$/.test(prat)) return prat;
    const umlaut = { a: 'ä', o: 'ö', u: 'ü', au: 'äu' };
    const m = prat.match(/^([^aeiouäöüy]*)(au|a|o|u)(?![aeiouäöü])/);
    const stem = m ? m[1] + umlaut[m[2]] + prat.slice(m[0].length) : prat;
    return stem + 'e';
  }

  function withPrefix(spec, prefix) {
    const out = { ...spec };
    if (!prefix) return out;
    for (const key of ['st2', 'prat', 'part', 'konj2', 'konj1b', 'gerund']) if (out[key]) out[key] = prefix + out[key];
    for (const key of ['pres', 'praetForms', 'konj1', 'konj2Forms', 'imp']) {
      if (out[key]) out[key] = out[key].map(form => prefix + form);
    }
    return out;
  }

  // The family a verb belongs to ({ spec, prefix }), or null for a weak verb.
  function lookup(core) {
    if (NOT_RELATED.has(core)) return null;
    const match = findFamily(core, FAMILIES);
    return match ? { spec: withPrefix(match.family.spec, match.prefix), prefix: match.prefix } : null;
  }

  // The regular (weak) pattern: arbeiten -> arbeitete, gearbeitet; sammeln -> sammelte.
  function weakSpec(core) {
    const stem = /(?:ern|eln)$/.test(core) ? core.slice(0, -1) : core.slice(0, -2);
    const e = needsE(stem);
    return { prat: stem + (e ? 'ete' : 'te'), part: stem + (e ? 'et' : 't') };
  }

  // -ieren verbs have no ge-, except the few spelled that way whose stress is on the stem.
  const GE_IEREN = new Set(['schmieren', 'stieren', 'zieren', 'gieren']);
  const weakTakesGe = core =>
    !((INSEP_START.test(core) && !NOT_PREFIXED.has(core)) || (/ieren$/.test(core) && !GE_IEREN.has(core)) || NO_GE.has(core));

  // An unmarked verb that is probably a separable one (abgeben, zurückkommen, ausrutschen).
  function unmarkedSeparable(core) {
    if (UNMARKED_OK.has(core)) return false;
    if (AMBIGUOUS.has(core)) return true;
    for (const p of ['um', 'durch', 'voll']) {
      if (core.startsWith(p) && core.length > p.length + 3 && !PREFIX_OK.has(core)) return true;
    }
    for (const p of SEP_DISTINCT) if (core.startsWith(p) && core.length > p.length + 3) return true;
    for (const p of SEP_SHORT) {
      if (!core.startsWith(p) || core.length < p.length + 4) continue;
      if (p === 'hin' && core.startsWith('hinter')) continue; // hinterlassen
      if (lookup(core.slice(p.length))) return true;                       // abgeben
      if (/ieren$/.test(core) && (p === 'ab' || p === 'an')) continue;    // abonnieren, analysieren
      return true;                                                         // abholen, ausrutschen
    }
    return false;
  }

  function auxFor(key, core, found) {
    if (Object.hasOwn(AUX_FULL, key)) return AUX_FULL[key];
    if (HABEN_CORE.has(core)) return 'haben';
    if (SEIN_CORE.has(core)) return 'sein';
    if (!found || found.spec.aux !== 'sein') return 'haben';
    // be-, er-, ge-, über-... verbs are mostly transitive (bekommen, erfahren);
    // ent-, ver- and zer- verbs keep the base verb's sein (entkommen, vergehen).
    return ['', 'ent', 'ver', 'zer'].includes(found.prefix) ? 'sein' : 'haben';
  }

  function presentForms(core, spec) {
    if (spec.pres) return spec.pres;
    let stem;
    let ich;
    if (/eln$/.test(core)) { stem = core.slice(0, -1); ich = stem.slice(0, -2) + 'le'; }
    else if (/ern$/.test(core)) { stem = core.slice(0, -1); ich = stem + 'e'; }
    else { stem = core.slice(0, -2); ich = stem + 'e'; }
    const alt = spec.st2 || stem;
    let du;
    let er;
    if (/[sßzx]$/.test(alt)) { du = alt + 't'; er = alt + 't'; }
    else if (spec.st2) { du = alt + 'st'; er = /t$/.test(alt) ? alt : alt + 't'; }
    else if (needsE(alt)) { du = alt + 'est'; er = alt + 'et'; }
    else { du = alt + 'st'; er = alt + 't'; }
    const ihr = stem + (needsE(stem) ? 'et' : 't');
    return [ich, du, er, core, ihr, core];
  }

  function praeteritumForms(spec) {
    if (spec.praetForms) return spec.praetForms;
    const prat = spec.prat;
    if (/e$/.test(prat)) return ENDINGS.map(end => prat + end);
    return [
      prat, prat + (/[dtsßzx]$/.test(prat) ? 'est' : 'st'), prat, prat + 'en',
      prat + (/[dt]$/.test(prat) ? 'et' : 't'), prat + 'en',
    ];
  }

  function konj1Forms(core, spec, present) {
    if (spec.konj1) return spec.konj1;
    const b = spec.konj1b || present[0];
    return [b, b + 'st', b, core, b + 't', core];
  }

  // The vowel change a -> ä (fährt, läuft) leaves the imperative on the infinitive stem (fahr, lauf);
  // e -> i / ie (gibt, liest) does not (gib, lies). A prefix such as über- carries its own umlaut,
  // so compare the whole stems instead of looking for an umlaut: übernimmt -> übernimm.
  const UNUMLAUT = { ä: 'a', ö: 'o', ü: 'u' };
  const isUmlaut = (st2, stem) => st2 !== stem && st2.length === stem.length &&
    [...st2].every((c, i) => c === stem[i] || UNUMLAUT[c] === stem[i]);
  // gebären: gebiert in the present, but the imperative is gebäre.
  const IMP_STEM = new Set(['gebären']);

  // du, wir, ihr, Sie
  function imperativeForms(core, spec, present) {
    if (spec.imp === null) return null;
    if (spec.imp) return spec.imp;
    const stem = /(?:ern|eln)$/.test(core) ? core.slice(0, -1) : core.slice(0, -2);
    let du;
    if (/(?:ern|eln)$/.test(core)) du = present[0];
    else if (spec.st2 && !IMP_STEM.has(core) && !isUmlaut(spec.st2, stem)) du = spec.st2;
    else du = stem + (needsE(stem) || /(?:ig|ä)$/.test(stem) ? 'e' : ''); // entschuldige, säe
    return [du, core, present[4], core];
  }

  // ---- Conjugation ----------------------------------------------------------------------

  function conjugate(input) {
    if (typeof input !== 'string') return null;
    const key = input.trim().toLowerCase();
    if (!/^[a-zäöüß]+(?:\|[a-zäöüß]+)?$/.test(key)) return null;
    const bar = key.indexOf('|');
    const sep = bar < 0 ? '' : key.slice(0, bar);
    const core = bar < 0 ? key : key.slice(bar + 1);
    if (sep && (sep.length < 2 || sep === 'sich')) return null; // reflexive verbs are not supported
    if ((REFUSED.has(core) && !WEAK_FULL.has(key)) || (!sep && unmarkedSeparable(core))) return null;

    const found = WEAK_FULL.has(key) ? null : lookup(core);
    let spec;
    if (found) spec = found.spec;
    else {
      if (core.length < 4 || !/(?:en|ern|eln)$/.test(core) || NOT_INFINITIVES.has(core)) return null;
      if (!/[aeiouäöü]/.test(core.slice(0, -2))) return null;
      spec = weakSpec(core);
    }

    const inf = sep + core;
    const aux = AUX[auxFor(key, core, found)];
    const noGe = found ? found.prefix !== '' || Boolean(spec.noGe) : !weakTakesGe(core);
    const participle = sep + (noGe ? '' : 'ge') + spec.part;
    const gerund = sep + (spec.gerund || core + 'd');

    const present = presentForms(core, spec);
    const praet = praeteritumForms(spec);
    const konj1 = konj1Forms(core, spec, present);
    const k2 = spec.konj2 || deriveKonj2(spec.prat);
    const konj2 = spec.konj2Forms || ENDINGS.map(end => k2 + end);
    const impParts = imperativeForms(core, spec, present);

    const finite = forms => (sep ? forms.map(form => `${form} ${sep}`) : forms);
    const withParticiple = auxForms => compound(auxForms, participle);
    const futurePerfect = auxForms => compound(auxForms, `${participle} ${aux.inf}`);

    const forms = {
      pres: finite(present),
      perfekt: withParticiple(aux.pres),
      praet: finite(praet),
      plusq: withParticiple(aux.praet),
      fut1: compound(WERDEN, inf),
      fut2: futurePerfect(WERDEN),
      konj1: finite(konj1),
      konj1Perf: withParticiple(aux.konj1),
      konj2: finite(konj2),
      konj2Plusq: withParticiple(aux.konj2),
      wuerde: compound(WUERDE, inf),
      wuerdePerf: futurePerfect(WUERDE),
      imp: impParts
        ? finite([impParts[0], impParts[0], impParts[0], `${impParts[1]} wir`, impParts[2], `${impParts[3]} Sie`])
        : Array(6).fill(NONE),
    };

    // Impersonal verbs (regnen) exist only in the 3rd person singular; geschehen also in the plural.
    const only = IMPERSONAL.has(core) ? [2] : spec.third || THIRD_ONLY.has(core) ? [2, 5] : null;
    if (only) {
      for (const name of Object.keys(forms)) forms[name] = forms[name].map((form, i) => (only.includes(i) && name !== 'imp' ? form : NONE));
    }

    return { inf, gerund, participle, forms };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate, NONE };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
