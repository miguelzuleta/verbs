// Run with: node test.js
// Checks the conjugation engine against known paradigms, then runs every
// German verb in verbs.js through it to catch crashes and malformed output.
const { conjugate, NONE } = require('./conjugate.js');
const { VERBS } = require('./verbs.js');
const { createReport, checkParadigms, checkInflectedDatabase } = require('../shared/test-kit.js');

const FORM_KEYS = [
  'pres', 'perfekt', 'praet', 'plusq', 'fut1', 'fut2', 'konj1', 'konj1Perf',
  'konj2', 'konj2Plusq', 'wuerde', 'wuerdePerf', 'imp',
];

// The compound tenses are mechanical: auxiliary forms (written out here, not taken
// from the engine) followed by the participle or the infinitive.
const AUX = {
  haben: {
    pres: 'habe, hast, hat, haben, habt, haben', praet: 'hatte, hattest, hatte, hatten, hattet, hatten',
    konj1: 'habe, habest, habe, haben, habet, haben', konj2: 'hätte, hättest, hätte, hätten, hättet, hätten',
    inf: 'haben',
  },
  sein: {
    pres: 'bin, bist, ist, sind, seid, sind', praet: 'war, warst, war, waren, wart, waren',
    konj1: 'sei, seiest, sei, seien, seiet, seien', konj2: 'wäre, wärst, wäre, wären, wärt, wären',
    inf: 'sein',
  },
};
const WERDE = 'werde, wirst, wird, werden, werdet, werden';
const WUERDE = 'würde, würdest, würde, würden, würdet, würden';
const after = (forms, rest) => forms.split(', ').map(form => `${form} ${rest}`).join(', ');
// verb -> the eight compound tenses plus the participle, for a given auxiliary
function tails(aux, inf, participle) {
  const a = AUX[aux];
  return {
    perfekt: after(a.pres, participle), plusq: after(a.praet, participle),
    fut1: after(WERDE, inf), fut2: after(WERDE, `${participle} ${a.inf}`),
    konj1Perf: after(a.konj1, participle), konj2Plusq: after(a.konj2, participle),
    wuerde: after(WUERDE, inf), wuerdePerf: after(WUERDE, `${participle} ${a.inf}`),
    participle,
  };
}
const NO_IMP = `${NONE}, ${NONE}, ${NONE}, ${NONE}, ${NONE}, ${NONE}`;

// verb -> { tense: 'ich, du, er, wir, ihr, sie' }  (gerund / participle as plain strings)
const EXPECTED = {
  // ---- whole paradigms ----
  sprechen: {
    pres: 'spreche, sprichst, spricht, sprechen, sprecht, sprechen',
    praet: 'sprach, sprachst, sprach, sprachen, spracht, sprachen',
    konj1: 'spreche, sprechest, spreche, sprechen, sprechet, sprechen',
    konj2: 'spräche, sprächest, spräche, sprächen, sprächet, sprächen',
    imp: 'sprich, sprich, sprich, sprechen wir, sprecht, sprechen Sie',
    gerund: 'sprechend', ...tails('haben', 'sprechen', 'gesprochen'),
  },
  machen: {
    pres: 'mache, machst, macht, machen, macht, machen',
    praet: 'machte, machtest, machte, machten, machtet, machten',
    konj1: 'mache, machest, mache, machen, machet, machen',
    konj2: 'machte, machtest, machte, machten, machtet, machten',
    imp: 'mach, mach, mach, machen wir, macht, machen Sie',
    gerund: 'machend', ...tails('haben', 'machen', 'gemacht'),
  },
  arbeiten: {
    pres: 'arbeite, arbeitest, arbeitet, arbeiten, arbeitet, arbeiten',
    praet: 'arbeitete, arbeitetest, arbeitete, arbeiteten, arbeitetet, arbeiteten',
    konj1: 'arbeite, arbeitest, arbeite, arbeiten, arbeitet, arbeiten',
    konj2: 'arbeitete, arbeitetest, arbeitete, arbeiteten, arbeitetet, arbeiteten',
    imp: 'arbeite, arbeite, arbeite, arbeiten wir, arbeitet, arbeiten Sie',
    gerund: 'arbeitend', ...tails('haben', 'arbeiten', 'gearbeitet'),
  },
  reisen: {
    pres: 'reise, reist, reist, reisen, reist, reisen',
    praet: 'reiste, reistest, reiste, reisten, reistet, reisten',
    konj1: 'reise, reisest, reise, reisen, reiset, reisen',
    konj2: 'reiste, reistest, reiste, reisten, reistet, reisten',
    gerund: 'reisend', ...tails('sein', 'reisen', 'gereist'),
  },
  sammeln: {
    pres: 'sammle, sammelst, sammelt, sammeln, sammelt, sammeln',
    praet: 'sammelte, sammeltest, sammelte, sammelten, sammeltet, sammelten',
    konj1: 'sammle, sammlest, sammle, sammeln, sammlet, sammeln',
    konj2: 'sammelte, sammeltest, sammelte, sammelten, sammeltet, sammelten',
    imp: 'sammle, sammle, sammle, sammeln wir, sammelt, sammeln Sie',
    gerund: 'sammelnd', ...tails('haben', 'sammeln', 'gesammelt'),
  },
  wandern: {
    pres: 'wandere, wanderst, wandert, wandern, wandert, wandern',
    praet: 'wanderte, wandertest, wanderte, wanderten, wandertet, wanderten',
    gerund: 'wandernd', ...tails('sein', 'wandern', 'gewandert'),
  },
  studieren: { // -ieren: no ge-
    pres: 'studiere, studierst, studiert, studieren, studiert, studieren',
    praet: 'studierte, studiertest, studierte, studierten, studiertet, studierten',
    konj2: 'studierte, studiertest, studierte, studierten, studiertet, studierten',
    gerund: 'studierend', ...tails('haben', 'studieren', 'studiert'),
  },
  verstehen: {
    pres: 'verstehe, verstehst, versteht, verstehen, versteht, verstehen',
    praet: 'verstand, verstandest, verstand, verstanden, verstandet, verstanden',
    konj2: 'verstünde, verstündest, verstünde, verstünden, verstündet, verstünden',
    imp: 'versteh, versteh, versteh, verstehen wir, versteht, verstehen Sie',
    gerund: 'verstehend', ...tails('haben', 'verstehen', 'verstanden'),
  },
  'auf|stehen': {
    pres: 'stehe auf, stehst auf, steht auf, stehen auf, steht auf, stehen auf',
    praet: 'stand auf, standest auf, stand auf, standen auf, standet auf, standen auf',
    konj1: 'stehe auf, stehest auf, stehe auf, stehen auf, stehet auf, stehen auf',
    konj2: 'stünde auf, stündest auf, stünde auf, stünden auf, stündet auf, stünden auf',
    imp: 'steh auf, steh auf, steh auf, stehen wir auf, steht auf, stehen Sie auf',
    gerund: 'aufstehend', ...tails('sein', 'aufstehen', 'aufgestanden'),
  },
  'an|kommen': {
    pres: 'komme an, kommst an, kommt an, kommen an, kommt an, kommen an',
    praet: 'kam an, kamst an, kam an, kamen an, kamt an, kamen an',
    konj2: 'käme an, kämest an, käme an, kämen an, kämet an, kämen an',
    imp: 'komm an, komm an, komm an, kommen wir an, kommt an, kommen Sie an',
    gerund: 'ankommend', ...tails('sein', 'ankommen', 'angekommen'),
  },
  'mit|bringen': {
    pres: 'bringe mit, bringst mit, bringt mit, bringen mit, bringt mit, bringen mit',
    praet: 'brachte mit, brachtest mit, brachte mit, brachten mit, brachtet mit, brachten mit',
    konj2: 'brächte mit, brächtest mit, brächte mit, brächten mit, brächtet mit, brächten mit',
    imp: 'bring mit, bring mit, bring mit, bringen wir mit, bringt mit, bringen Sie mit',
    gerund: 'mitbringend', ...tails('haben', 'mitbringen', 'mitgebracht'),
  },
  gehen: {
    pres: 'gehe, gehst, geht, gehen, geht, gehen',
    praet: 'ging, gingst, ging, gingen, gingt, gingen',
    konj1: 'gehe, gehest, gehe, gehen, gehet, gehen',
    konj2: 'ginge, gingest, ginge, gingen, ginget, gingen',
    imp: 'geh, geh, geh, gehen wir, geht, gehen Sie',
    gerund: 'gehend', ...tails('sein', 'gehen', 'gegangen'),
  },
  kommen: {
    pres: 'komme, kommst, kommt, kommen, kommt, kommen',
    praet: 'kam, kamst, kam, kamen, kamt, kamen',
    konj1: 'komme, kommest, komme, kommen, kommet, kommen',
    konj2: 'käme, kämest, käme, kämen, kämet, kämen',
    imp: 'komm, komm, komm, kommen wir, kommt, kommen Sie',
    gerund: 'kommend', ...tails('sein', 'kommen', 'gekommen'),
  },
  bleiben: {
    pres: 'bleibe, bleibst, bleibt, bleiben, bleibt, bleiben',
    praet: 'blieb, bliebst, blieb, blieben, bliebt, blieben',
    konj2: 'bliebe, bliebest, bliebe, blieben, bliebet, blieben',
    imp: 'bleib, bleib, bleib, bleiben wir, bleibt, bleiben Sie',
    gerund: 'bleibend', ...tails('sein', 'bleiben', 'geblieben'),
  },
  werden: {
    pres: 'werde, wirst, wird, werden, werdet, werden',
    praet: 'wurde, wurdest, wurde, wurden, wurdet, wurden',
    konj1: 'werde, werdest, werde, werden, werdet, werden',
    konj2: 'würde, würdest, würde, würden, würdet, würden',
    imp: 'werde, werde, werde, werden wir, werdet, werden Sie',
    gerund: 'werdend', ...tails('sein', 'werden', 'geworden'),
  },
  sein: {
    pres: 'bin, bist, ist, sind, seid, sind',
    praet: 'war, warst, war, waren, wart, waren',
    konj1: 'sei, seiest, sei, seien, seiet, seien',
    konj2: 'wäre, wärst, wäre, wären, wärt, wären',
    imp: 'sei, sei, sei, seien wir, seid, seien Sie',
    gerund: 'seiend', ...tails('sein', 'sein', 'gewesen'),
  },
  haben: {
    pres: 'habe, hast, hat, haben, habt, haben',
    praet: 'hatte, hattest, hatte, hatten, hattet, hatten',
    konj1: 'habe, habest, habe, haben, habet, haben',
    konj2: 'hätte, hättest, hätte, hätten, hättet, hätten',
    gerund: 'habend', ...tails('haben', 'haben', 'gehabt'),
  },
  können: {
    pres: 'kann, kannst, kann, können, könnt, können',
    praet: 'konnte, konntest, konnte, konnten, konntet, konnten',
    konj1: 'könne, könnest, könne, können, könnet, können',
    konj2: 'könnte, könntest, könnte, könnten, könntet, könnten',
    imp: NO_IMP, ...tails('haben', 'können', 'gekonnt'),
  },
  müssen: {
    pres: 'muss, musst, muss, müssen, müsst, müssen',
    praet: 'musste, musstest, musste, mussten, musstet, mussten',
    konj1: 'müsse, müssest, müsse, müssen, müsset, müssen',
    konj2: 'müsste, müsstest, müsste, müssten, müsstet, müssten',
    imp: NO_IMP, ...tails('haben', 'müssen', 'gemusst'),
  },
  wissen: {
    pres: 'weiß, weißt, weiß, wissen, wisst, wissen',
    praet: 'wusste, wusstest, wusste, wussten, wusstet, wussten',
    konj1: 'wisse, wissest, wisse, wissen, wisset, wissen',
    konj2: 'wüsste, wüsstest, wüsste, wüssten, wüsstet, wüssten',
    gerund: 'wissend', ...tails('haben', 'wissen', 'gewusst'),
  },
  bringen: {
    pres: 'bringe, bringst, bringt, bringen, bringt, bringen',
    praet: 'brachte, brachtest, brachte, brachten, brachtet, brachten',
    konj2: 'brächte, brächtest, brächte, brächten, brächtet, brächten',
    imp: 'bring, bring, bring, bringen wir, bringt, bringen Sie',
    gerund: 'bringend', ...tails('haben', 'bringen', 'gebracht'),
  },
  denken: {
    pres: 'denke, denkst, denkt, denken, denkt, denken',
    praet: 'dachte, dachtest, dachte, dachten, dachtet, dachten',
    konj2: 'dächte, dächtest, dächte, dächten, dächtet, dächten',
    imp: 'denk, denk, denk, denken wir, denkt, denken Sie',
    gerund: 'denkend', ...tails('haben', 'denken', 'gedacht'),
  },
  essen: {
    pres: 'esse, isst, isst, essen, esst, essen',
    praet: 'aß, aßest, aß, aßen, aßt, aßen',
    konj2: 'äße, äßest, äße, äßen, äßet, äßen',
    imp: 'iss, iss, iss, essen wir, esst, essen Sie',
    gerund: 'essend', ...tails('haben', 'essen', 'gegessen'),
  },
  geben: {
    pres: 'gebe, gibst, gibt, geben, gebt, geben',
    praet: 'gab, gabst, gab, gaben, gabt, gaben',
    konj2: 'gäbe, gäbest, gäbe, gäben, gäbet, gäben',
    imp: 'gib, gib, gib, geben wir, gebt, geben Sie',
    gerund: 'gebend', ...tails('haben', 'geben', 'gegeben'),
  },
  nehmen: {
    pres: 'nehme, nimmst, nimmt, nehmen, nehmt, nehmen',
    praet: 'nahm, nahmst, nahm, nahmen, nahmt, nahmen',
    konj2: 'nähme, nähmest, nähme, nähmen, nähmet, nähmen',
    imp: 'nimm, nimm, nimm, nehmen wir, nehmt, nehmen Sie',
    gerund: 'nehmend', ...tails('haben', 'nehmen', 'genommen'),
  },
  fahren: {
    pres: 'fahre, fährst, fährt, fahren, fahrt, fahren',
    praet: 'fuhr, fuhrst, fuhr, fuhren, fuhrt, fuhren',
    konj2: 'führe, führest, führe, führen, führet, führen',
    imp: 'fahr, fahr, fahr, fahren wir, fahrt, fahren Sie',
    gerund: 'fahrend', ...tails('sein', 'fahren', 'gefahren'),
  },
  laufen: {
    pres: 'laufe, läufst, läuft, laufen, lauft, laufen',
    praet: 'lief, liefst, lief, liefen, lieft, liefen',
    konj2: 'liefe, liefest, liefe, liefen, liefet, liefen',
    imp: 'lauf, lauf, lauf, laufen wir, lauft, laufen Sie',
    gerund: 'laufend', ...tails('sein', 'laufen', 'gelaufen'),
  },
  lesen: {
    pres: 'lese, liest, liest, lesen, lest, lesen',
    konj2: 'läse, läsest, läse, läsen, läset, läsen',
    imp: 'lies, lies, lies, lesen wir, lest, lesen Sie',
    gerund: 'lesend', ...tails('haben', 'lesen', 'gelesen'),
  },
  sehen: {
    pres: 'sehe, siehst, sieht, sehen, seht, sehen',
    praet: 'sah, sahst, sah, sahen, saht, sahen',
    konj2: 'sähe, sähest, sähe, sähen, sähet, sähen',
    imp: 'sieh, sieh, sieh, sehen wir, seht, sehen Sie',
    gerund: 'sehend', ...tails('haben', 'sehen', 'gesehen'),
  },
  helfen: {
    pres: 'helfe, hilfst, hilft, helfen, helft, helfen',
    praet: 'half, halfst, half, halfen, halft, halfen',
    imp: 'hilf, hilf, hilf, helfen wir, helft, helfen Sie',
    gerund: 'helfend', ...tails('haben', 'helfen', 'geholfen'),
  },
  tun: {
    pres: 'tue, tust, tut, tun, tut, tun',
    praet: 'tat, tatest, tat, taten, tatet, taten',
    konj1: 'tue, tuest, tue, tuen, tuet, tuen',
    konj2: 'täte, tätest, täte, täten, tätet, täten',
    imp: 'tu, tu, tu, tun wir, tut, tun Sie',
    gerund: 'tuend', ...tails('haben', 'tun', 'getan'),
  },
  lassen: {
    pres: 'lasse, lässt, lässt, lassen, lasst, lassen',
    praet: 'ließ, ließest, ließ, ließen, ließt, ließen',
    konj2: 'ließe, ließest, ließe, ließen, ließet, ließen',
    imp: 'lass, lass, lass, lassen wir, lasst, lassen Sie',
    gerund: 'lassend', ...tails('haben', 'lassen', 'gelassen'),
  },

  // ---- the other modals ----
  wollen: {
    pres: 'will, willst, will, wollen, wollt, wollen',
    praet: 'wollte, wolltest, wollte, wollten, wolltet, wollten',
    konj1: 'wolle, wollest, wolle, wollen, wollet, wollen',
    konj2: 'wollte, wolltest, wollte, wollten, wolltet, wollten', imp: NO_IMP, participle: 'gewollt',
  },
  sollen: {
    pres: 'soll, sollst, soll, sollen, sollt, sollen',
    konj2: 'sollte, solltest, sollte, sollten, solltet, sollten', participle: 'gesollt',
  },
  dürfen: {
    pres: 'darf, darfst, darf, dürfen, dürft, dürfen',
    praet: 'durfte, durftest, durfte, durften, durftet, durften',
    konj2: 'dürfte, dürftest, dürfte, dürften, dürftet, dürften', participle: 'gedurft',
  },
  mögen: {
    pres: 'mag, magst, mag, mögen, mögt, mögen',
    praet: 'mochte, mochtest, mochte, mochten, mochtet, mochten',
    konj1: 'möge, mögest, möge, mögen, möget, mögen',
    konj2: 'möchte, möchtest, möchte, möchten, möchtet, möchten', participle: 'gemocht',
  },

  // ---- strong verbs ----
  ziehen: {
    pres: 'ziehe, ziehst, zieht, ziehen, zieht, ziehen',
    praet: 'zog, zogst, zog, zogen, zogt, zogen',
    konj2: 'zöge, zögest, zöge, zögen, zöget, zögen', participle: 'gezogen',
  },
  schneiden: {
    pres: 'schneide, schneidest, schneidet, schneiden, schneidet, schneiden',
    praet: 'schnitt, schnittest, schnitt, schnitten, schnittet, schnitten', participle: 'geschnitten',
  },
  finden: {
    pres: 'finde, findest, findet, finden, findet, finden',
    praet: 'fand, fandest, fand, fanden, fandet, fanden',
    konj2: 'fände, fändest, fände, fänden, fändet, fänden', imp: 'finde, finde, finde, finden wir, findet, finden Sie',
    participle: 'gefunden',
  },
  bitten: {
    pres: 'bitte, bittest, bittet, bitten, bittet, bitten',
    praet: 'bat, batest, bat, baten, batet, baten', konj2: 'bäte, bätest, bäte, bäten, bätet, bäten',
    participle: 'gebeten',
  },
  halten: {
    pres: 'halte, hältst, hält, halten, haltet, halten',
    praet: 'hielt, hieltest, hielt, hielten, hieltet, hielten', participle: 'gehalten',
  },
  raten: {
    pres: 'rate, rätst, rät, raten, ratet, raten',
    praet: 'riet, rietest, riet, rieten, rietet, rieten', participle: 'geraten',
  },
  treten: {
    pres: 'trete, trittst, tritt, treten, tretet, treten',
    praet: 'trat, tratest, trat, traten, tratet, traten', imp: 'tritt, tritt, tritt, treten wir, tretet, treten Sie',
    participle: 'getreten',
  },
  gelten: {
    pres: 'gelte, giltst, gilt, gelten, geltet, gelten',
    praet: 'galt, galtest, galt, galten, galtet, galten', participle: 'gegolten',
  },
  schlafen: {
    pres: 'schlafe, schläfst, schläft, schlafen, schlaft, schlafen',
    praet: 'schlief, schliefst, schlief, schliefen, schlieft, schliefen', participle: 'geschlafen',
  },
  schlagen: {
    pres: 'schlage, schlägst, schlägt, schlagen, schlagt, schlagen',
    praet: 'schlug, schlugst, schlug, schlugen, schlugt, schlugen',
    konj2: 'schlüge, schlügest, schlüge, schlügen, schlüget, schlügen', participle: 'geschlagen',
  },
  tragen: {
    pres: 'trage, trägst, trägt, tragen, tragt, tragen',
    praet: 'trug, trugst, trug, trugen, trugt, trugen', participle: 'getragen',
  },
  schreiben: {
    pres: 'schreibe, schreibst, schreibt, schreiben, schreibt, schreiben',
    praet: 'schrieb, schriebst, schrieb, schrieben, schriebt, schrieben', participle: 'geschrieben',
  },
  schreien: { praet: 'schrie, schriest, schrie, schrien, schriet, schrien', participle: 'geschrien' },
  trinken: {
    praet: 'trank, trankst, trank, tranken, trankt, tranken',
    konj2: 'tränke, tränkest, tränke, tränken, tränket, tränken', participle: 'getrunken',
  },
  singen: { praet: 'sang, sangst, sang, sangen, sangt, sangen', participle: 'gesungen' },
  werfen: {
    pres: 'werfe, wirfst, wirft, werfen, werft, werfen',
    praet: 'warf, warfst, warf, warfen, warft, warfen',
    konj2: 'würfe, würfest, würfe, würfen, würfet, würfen', imp: 'wirf, wirf, wirf, werfen wir, werft, werfen Sie',
    participle: 'geworfen',
  },
  treffen: {
    pres: 'treffe, triffst, trifft, treffen, trefft, treffen',
    praet: 'traf, trafst, traf, trafen, traft, trafen', participle: 'getroffen',
  },
  sitzen: {
    pres: 'sitze, sitzt, sitzt, sitzen, sitzt, sitzen',
    praet: 'saß, saßest, saß, saßen, saßt, saßen',
    konj2: 'säße, säßest, säße, säßen, säßet, säßen', participle: 'gesessen',
  },
  stehen: {
    pres: 'stehe, stehst, steht, stehen, steht, stehen',
    praet: 'stand, standest, stand, standen, standet, standen',
    imp: 'steh, steh, steh, stehen wir, steht, stehen Sie', participle: 'gestanden',
  },
  liegen: {
    pres: 'liege, liegst, liegt, liegen, liegt, liegen',
    praet: 'lag, lagst, lag, lagen, lagt, lagen',
    konj2: 'läge, lägest, läge, lägen, läget, lägen', participle: 'gelegen',
  },
  rufen: { praet: 'rief, riefst, rief, riefen, rieft, riefen', participle: 'gerufen' },
  fliegen: {
    praet: 'flog, flogst, flog, flogen, flogt, flogen',
    konj2: 'flöge, flögest, flöge, flögen, flöget, flögen', ...tails('sein', 'fliegen', 'geflogen'),
  },
  schwimmen: { praet: 'schwamm, schwammst, schwamm, schwammen, schwammt, schwammen', participle: 'geschwommen' },
  sterben: {
    pres: 'sterbe, stirbst, stirbt, sterben, sterbt, sterben',
    praet: 'starb, starbst, starb, starben, starbt, starben',
    konj2: 'stürbe, stürbest, stürbe, stürben, stürbet, stürben', imp: 'stirb, stirb, stirb, sterben wir, sterbt, sterben Sie',
    ...tails('sein', 'sterben', 'gestorben'),
  },
  wachsen: {
    pres: 'wachse, wächst, wächst, wachsen, wachst, wachsen',
    konj2: 'wüchse, wüchsest, wüchse, wüchsen, wüchset, wüchsen', ...tails('sein', 'wachsen', 'gewachsen'),
  },
  waschen: {
    pres: 'wasche, wäschst, wäscht, waschen, wascht, waschen',
    praet: 'wusch, wuschst, wusch, wuschen, wuscht, wuschen', participle: 'gewaschen',
  },
  stoßen: { pres: 'stoße, stößt, stößt, stoßen, stoßt, stoßen', participle: 'gestoßen' },
  brechen: {
    pres: 'breche, brichst, bricht, brechen, brecht, brechen',
    praet: 'brach, brachst, brach, brachen, bracht, brachen', participle: 'gebrochen',
  },
  schließen: {
    pres: 'schließe, schließt, schließt, schließen, schließt, schließen',
    praet: 'schloss, schlossest, schloss, schlossen, schlosst, schlossen', participle: 'geschlossen',
  },
  heißen: {
    pres: 'heiße, heißt, heißt, heißen, heißt, heißen',
    praet: 'hieß, hießest, hieß, hießen, hießt, hießen', participle: 'geheißen',
  },
  beißen: { praet: 'biss, bissest, biss, bissen, bisst, bissen', participle: 'gebissen' },
  hängen: { praet: 'hing, hingst, hing, hingen, hingt, hingen', participle: 'gehangen' },

  // ---- mixed verbs ----
  brennen: {
    pres: 'brenne, brennst, brennt, brennen, brennt, brennen',
    praet: 'brannte, branntest, brannte, brannten, branntet, brannten',
    konj2: 'brennte, brenntest, brennte, brennten, brenntet, brennten', participle: 'gebrannt',
  },
  kennen: {
    praet: 'kannte, kanntest, kannte, kannten, kanntet, kannten',
    konj2: 'kennte, kenntest, kennte, kennten, kenntet, kennten', participle: 'gekannt',
  },
  nennen: { praet: 'nannte, nanntest, nannte, nannten, nanntet, nannten', participle: 'genannt' },
  rennen: { praet: 'rannte, ranntest, rannte, rannten, ranntet, rannten', ...tails('sein', 'rennen', 'gerannt') },
  wenden: { pres: 'wende, wendest, wendet, wenden, wendet, wenden' },

  // ---- prefixed relatives of irregular verbs ----
  bekommen: { // kommen takes sein, bekommen takes haben
    praet: 'bekam, bekamst, bekam, bekamen, bekamt, bekamen',
    konj2: 'bekäme, bekämest, bekäme, bekämen, bekämet, bekämen', ...tails('haben', 'bekommen', 'bekommen'),
  },
  erfahren: { // fahren takes sein, erfahren takes haben
    pres: 'erfahre, erfährst, erfährt, erfahren, erfahrt, erfahren',
    praet: 'erfuhr, erfuhrst, erfuhr, erfuhren, erfuhrt, erfuhren', ...tails('haben', 'erfahren', 'erfahren'),
  },
  überfahren: {
    pres: 'überfahre, überfährst, überfährt, überfahren, überfahrt, überfahren',
    imp: 'überfahr, überfahr, überfahr, überfahren wir, überfahrt, überfahren Sie', participle: 'überfahren',
    ...tails('haben', 'überfahren', 'überfahren'),
  },
  vergeben: {
    pres: 'vergebe, vergibst, vergibt, vergeben, vergebt, vergeben',
    praet: 'vergab, vergabst, vergab, vergaben, vergabt, vergaben', imp: 'vergib, vergib, vergib, vergeben wir, vergebt, vergeben Sie',
    participle: 'vergeben',
  },
  vergessen: {
    pres: 'vergesse, vergisst, vergisst, vergessen, vergesst, vergessen',
    praet: 'vergaß, vergaßest, vergaß, vergaßen, vergaßt, vergaßen',
    imp: 'vergiss, vergiss, vergiss, vergessen wir, vergesst, vergessen Sie', participle: 'vergessen',
  },
  verlieren: {
    pres: 'verliere, verlierst, verliert, verlieren, verliert, verlieren',
    praet: 'verlor, verlorst, verlor, verloren, verlort, verloren',
    konj2: 'verlöre, verlörest, verlöre, verlören, verlöret, verlören', participle: 'verloren',
  },
  beginnen: {
    pres: 'beginne, beginnst, beginnt, beginnen, beginnt, beginnen',
    praet: 'begann, begannst, begann, begannen, begannt, begannen', participle: 'begonnen',
  },
  gewinnen: { praet: 'gewann, gewannst, gewann, gewannen, gewannt, gewannen', participle: 'gewonnen' },
  empfehlen: {
    pres: 'empfehle, empfiehlst, empfiehlt, empfehlen, empfehlt, empfehlen',
    praet: 'empfahl, empfahlst, empfahl, empfahlen, empfahlt, empfahlen', participle: 'empfohlen',
  },
  befehlen: { pres: 'befehle, befiehlst, befiehlt, befehlen, befehlt, befehlen', participle: 'befohlen' },
  bestehen: { praet: 'bestand, bestandest, bestand, bestanden, bestandet, bestanden', ...tails('haben', 'bestehen', 'bestanden') },
  entstehen: { praet: 'entstand, entstandest, entstand, entstanden, entstandet, entstanden', ...tails('sein', 'entstehen', 'entstanden') },
  begehen: { participle: 'begangen', perfekt: 'habe begangen, hast begangen, hat begangen, haben begangen, habt begangen, haben begangen' },
  vergehen: { participle: 'vergangen', perfekt: 'bin vergangen, bist vergangen, ist vergangen, sind vergangen, seid vergangen, sind vergangen' },
  entkommen: { participle: 'entkommen', perfekt: 'bin entkommen, bist entkommen, ist entkommen, sind entkommen, seid entkommen, sind entkommen' },
  verlassen: { pres: 'verlasse, verlässt, verlässt, verlassen, verlasst, verlassen', participle: 'verlassen' },
  unternehmen: {
    pres: 'unternehme, unternimmst, unternimmt, unternehmen, unternehmt, unternehmen',
    praet: 'unternahm, unternahmst, unternahm, unternahmen, unternahmt, unternahmen', participle: 'unternommen',
  },
  unterbrechen: {
    pres: 'unterbreche, unterbrichst, unterbricht, unterbrechen, unterbrecht, unterbrechen', participle: 'unterbrochen',
  },
  widersprechen: {
    pres: 'widerspreche, widersprichst, widerspricht, widersprechen, widersprecht, widersprechen',
    participle: 'widersprochen',
  },
  unterhalten: { pres: 'unterhalte, unterhältst, unterhält, unterhalten, unterhaltet, unterhalten', participle: 'unterhalten' },
  verbringen: { praet: 'verbrachte, verbrachtest, verbrachte, verbrachten, verbrachtet, verbrachten', participle: 'verbracht' },
  verbieten: { praet: 'verbot, verbotest, verbot, verboten, verbotet, verboten', participle: 'verboten' },
  erkennen: { praet: 'erkannte, erkanntest, erkannte, erkannten, erkanntet, erkannten', participle: 'erkannt' },
  missverstehen: { praet: 'missverstand, missverstandest, missverstand, missverstanden, missverstandet, missverstanden', participle: 'missverstanden' },
  geschehen: {
    pres: `${NONE}, ${NONE}, geschieht, ${NONE}, ${NONE}, geschehen`,
    praet: `${NONE}, ${NONE}, geschah, ${NONE}, ${NONE}, geschahen`,
    perfekt: `${NONE}, ${NONE}, ist geschehen, ${NONE}, ${NONE}, sind geschehen`,
    imp: NO_IMP, participle: 'geschehen',
  },
  // gelingen exists only in the 3rd person (es gelingt mir; die Versuche gelingen)
  gelingen: {
    pres: '—, —, gelingt, —, —, gelingen',
    praet: '—, —, gelang, —, —, gelangen',
    perfekt: '—, —, ist gelungen, —, —, sind gelungen',
    plusq: '—, —, war gelungen, —, —, waren gelungen',
    fut1: '—, —, wird gelingen, —, —, werden gelingen',
    konj1: '—, —, gelinge, —, —, gelingen',
    konj2: '—, —, gelänge, —, —, gelängen',
    konj2Plusq: '—, —, wäre gelungen, —, —, wären gelungen',
    wuerde: '—, —, würde gelingen, —, —, würden gelingen',
    imp: '—, —, —, —, —, —',
  },

  // ---- found by the independent review; each was a wrong output ----
  // a core that only LOOKS prefixed (be-uten, wider-n) still takes ge- after a separable prefix
  'aus|beuten': { ...tails('haben', 'ausbeuten', 'ausgebeutet'), participle: 'ausgebeutet' },
  'an|widern': { participle: 'angewidert' },
  // -ieren verbs normally have no ge-, but schmieren (stress on the stem) does
  schmieren: { ...tails('haben', 'schmieren', 'geschmiert'), participle: 'geschmiert' },
  'an|schmieren': { participle: 'angeschmiert' },
  verschmieren: { participle: 'verschmiert' },
  beschmieren: { participle: 'beschmiert' },
  erklimmen: {
    praet: 'erklomm, erklommst, erklomm, erklommen, erklommt, erklommen',
    konj2: 'erklömme, erklömmest, erklömme, erklömmen, erklömmet, erklömmen',
    ...tails('haben', 'erklimmen', 'erklommen'),
  },
  quellen: { konj2: 'quölle, quöllest, quölle, quöllen, quöllet, quöllen', praet: 'quoll, quollst, quoll, quollen, quollt, quollen' },
  reifen: tails('sein', 'reifen', 'gereift'),
  radeln: tails('sein', 'radeln', 'geradelt'),
  vernarben: tails('sein', 'vernarben', 'vernarbt'),
  // senden is regular in every sense used here (broadcast, send)
  senden: {
    pres: 'sende, sendest, sendet, senden, sendet, senden',
    praet: 'sendete, sendetest, sendete, sendeten, sendetet, sendeten',
    konj2: 'sendete, sendetest, sendete, sendeten, sendetet, sendeten',
    ...tails('haben', 'senden', 'gesendet'),
  },
  versenden: { participle: 'versendet' },
  // weak verbs that exist only in the 3rd person
  dauern: {
    pres: '—, —, dauert, —, —, dauern',
    praet: '—, —, dauerte, —, —, dauerten',
    perfekt: '—, —, hat gedauert, —, —, haben gedauert',
    imp: '—, —, —, —, —, —',
  },

  // ---- separable verbs ----
  'ab|geben': {
    pres: 'gebe ab, gibst ab, gibt ab, geben ab, gebt ab, geben ab',
    imp: 'gib ab, gib ab, gib ab, geben wir ab, gebt ab, geben Sie ab', ...tails('haben', 'abgeben', 'abgegeben'),
  },
  'mit|nehmen': { // nehmen takes haben; so does mitnehmen
    pres: 'nehme mit, nimmst mit, nimmt mit, nehmen mit, nehmt mit, nehmen mit', ...tails('haben', 'mitnehmen', 'mitgenommen'),
  },
  'ab|fahren': { pres: 'fahre ab, fährst ab, fährt ab, fahren ab, fahrt ab, fahren ab', ...tails('sein', 'abfahren', 'abgefahren') },
  'weg|fahren': tails('sein', 'wegfahren', 'weggefahren'),
  'zurück|kommen': {
    pres: 'komme zurück, kommst zurück, kommt zurück, kommen zurück, kommt zurück, kommen zurück',
    ...tails('sein', 'zurückkommen', 'zurückgekommen'),
  },
  'ein|kaufen': {
    pres: 'kaufe ein, kaufst ein, kauft ein, kaufen ein, kauft ein, kaufen ein',
    praet: 'kaufte ein, kauftest ein, kaufte ein, kauften ein, kauftet ein, kauften ein', ...tails('haben', 'einkaufen', 'eingekauft'),
  },
  'an|rufen': {
    pres: 'rufe an, rufst an, ruft an, rufen an, ruft an, rufen an',
    praet: 'rief an, riefst an, rief an, riefen an, rieft an, riefen an', participle: 'angerufen',
  },
  'ein|laden': { praet: 'lud ein, ludest ein, lud ein, luden ein, ludet ein, luden ein', participle: 'eingeladen' },
  'auf|hören': { pres: 'höre auf, hörst auf, hört auf, hören auf, hört auf, hören auf', participle: 'aufgehört' },
  'zu|machen': tails('haben', 'zumachen', 'zugemacht'),
  'ab|holen': tails('haben', 'abholen', 'abgeholt'),
  'ein|schlafen': { // schlafen takes haben, einschlafen takes sein
    pres: 'schlafe ein, schläfst ein, schläft ein, schlafen ein, schlaft ein, schlafen ein',
    praet: 'schlief ein, schliefst ein, schlief ein, schliefen ein, schlieft ein, schliefen ein',
    ...tails('sein', 'einschlafen', 'eingeschlafen'),
  },
  'auf|wachen': tails('sein', 'aufwachen', 'aufgewacht'),
  'um|ziehen': tails('sein', 'umziehen', 'umgezogen'),
  'aus|ziehen': { participle: 'ausgezogen' },
  'an|erkennen': {
    pres: 'erkenne an, erkennst an, erkennt an, erkennen an, erkennt an, erkennen an',
    praet: 'erkannte an, erkanntest an, erkannte an, erkannten an, erkanntet an, erkannten an', participle: 'anerkannt',
  },
  'vor|bereiten': {
    pres: 'bereite vor, bereitest vor, bereitet vor, bereiten vor, bereitet vor, bereiten vor', participle: 'vorbereitet',
  },
  'aus|probieren': {
    pres: 'probiere aus, probierst aus, probiert aus, probieren aus, probiert aus, probieren aus', participle: 'ausprobiert',
  },
  'über|setzen': { // to ferry across (the inseparable übersetzen means "to translate")
    pres: 'setze über, setzt über, setzt über, setzen über, setzt über, setzen über', participle: 'übergesetzt',
  },
  'kennen|lernen': {
    pres: 'lerne kennen, lernst kennen, lernt kennen, lernen kennen, lernt kennen, lernen kennen', participle: 'kennengelernt',
  },
  'spazieren|gehen': { pres: 'gehe spazieren, gehst spazieren, geht spazieren, gehen spazieren, geht spazieren, gehen spazieren', ...tails('sein', 'spazierengehen', 'spazierengegangen') },
  'da|sein': { pres: 'bin da, bist da, ist da, sind da, seid da, sind da', ...tails('sein', 'dasein', 'dagewesen') },
  'vor|haben': { pres: 'habe vor, hast vor, hat vor, haben vor, habt vor, haben vor', ...tails('haben', 'vorhaben', 'vorgehabt') },
  'statt|finden': { participle: 'stattgefunden' },

  // ---- weak verbs: e-insertion, s-stems, -eln / -ern, inseparable prefixes ----
  tanzen: {
    pres: 'tanze, tanzt, tanzt, tanzen, tanzt, tanzen',
    praet: 'tanzte, tanztest, tanzte, tanzten, tanztet, tanzten', participle: 'getanzt',
  },
  rechnen: {
    pres: 'rechne, rechnest, rechnet, rechnen, rechnet, rechnen',
    praet: 'rechnete, rechnetest, rechnete, rechneten, rechnetet, rechneten', participle: 'gerechnet',
  },
  öffnen: {
    pres: 'öffne, öffnest, öffnet, öffnen, öffnet, öffnen',
    imp: 'öffne, öffne, öffne, öffnen wir, öffnet, öffnen Sie', participle: 'geöffnet',
  },
  atmen: { pres: 'atme, atmest, atmet, atmen, atmet, atmen', participle: 'geatmet' },
  baden: {
    pres: 'bade, badest, badet, baden, badet, baden',
    praet: 'badete, badetest, badete, badeten, badetet, badeten', participle: 'gebadet',
  },
  warten: { pres: 'warte, wartest, wartet, warten, wartet, warten', participle: 'gewartet' },
  lächeln: {
    pres: 'lächle, lächelst, lächelt, lächeln, lächelt, lächeln',
    praet: 'lächelte, lächeltest, lächelte, lächelten, lächeltet, lächelten', participle: 'gelächelt',
  },
  ändern: {
    pres: 'ändere, änderst, ändert, ändern, ändert, ändern',
    praet: 'änderte, ändertest, änderte, änderten, ändertet, änderten', participle: 'geändert',
  },
  feiern: { pres: 'feiere, feierst, feiert, feiern, feiert, feiern', participle: 'gefeiert' },
  wohnen: {
    pres: 'wohne, wohnst, wohnt, wohnen, wohnt, wohnen',
    praet: 'wohnte, wohntest, wohnte, wohnten, wohntet, wohnten', participle: 'gewohnt',
  },
  lernen: { pres: 'lerne, lernst, lernt, lernen, lernt, lernen', participle: 'gelernt' },
  kaufen: { pres: 'kaufe, kaufst, kauft, kaufen, kauft, kaufen', ...tails('haben', 'kaufen', 'gekauft') },
  bauen: { pres: 'baue, baust, baut, bauen, baut, bauen', participle: 'gebaut' },
  lieben: { pres: 'liebe, liebst, liebt, lieben, liebt, lieben', participle: 'geliebt' },
  folgen: tails('sein', 'folgen', 'gefolgt'),
  begegnen: { pres: 'begegne, begegnest, begegnet, begegnen, begegnet, begegnen', ...tails('sein', 'begegnen', 'begegnet') },
  übersetzen: { // the inseparable verb: to translate
    pres: 'übersetze, übersetzt, übersetzt, übersetzen, übersetzt, übersetzen',
    praet: 'übersetzte, übersetztest, übersetzte, übersetzten, übersetztet, übersetzten', participle: 'übersetzt',
  },
  überraschen: { pres: 'überrasche, überraschst, überrascht, überraschen, überrascht, überraschen', participle: 'überrascht' },
  bearbeiten: { pres: 'bearbeite, bearbeitest, bearbeitet, bearbeiten, bearbeitet, bearbeiten', participle: 'bearbeitet' },
  erzählen: { praet: 'erzählte, erzähltest, erzählte, erzählten, erzähltet, erzählten', participle: 'erzählt' },
  besuchen: { participle: 'besucht' },
  verkaufen: { participle: 'verkauft' },
  zerstören: { participle: 'zerstört' },
  wiederholen: { pres: 'wiederhole, wiederholst, wiederholt, wiederholen, wiederholt, wiederholen', participle: 'wiederholt' },
  umarmen: { participle: 'umarmt' },
  durchsuchen: { participle: 'durchsucht' },
  empfangen: { pres: 'empfange, empfängst, empfängt, empfangen, empfangt, empfangen', praet: 'empfing, empfingst, empfing, empfingen, empfingt, empfingen', participle: 'empfangen' },
  // look-alikes that are NOT relatives of a strong verb
  bereiten: { praet: 'bereitete, bereitetest, bereitete, bereiteten, bereitetet, bereiteten', participle: 'bereitet' },
  verbreiten: { participle: 'verbreitet' },
  veranlassen: { praet: 'veranlasste, veranlasstest, veranlasste, veranlassten, veranlasstet, veranlassten', participle: 'veranlasst' },
  trennen: { pres: 'trenne, trennst, trennt, trennen, trennt, trennen', participle: 'getrennt' },
  // verbs that begin like a prefix verb without being one
  beten: { pres: 'bete, betest, betet, beten, betet, beten', participle: 'gebetet' },
  erben: { pres: 'erbe, erbst, erbt, erben, erbt, erben', participle: 'geerbt' },
  ernten: { participle: 'geerntet' },
  zerren: { participle: 'gezerrt' },

  // ---- found by the audits (each one was wrong or missing once) ----
  verhelfen: { pres: 'verhelfe, verhilfst, verhilft, verhelfen, verhelft, verhelfen', participle: 'verholfen' },
  zerfressen: { pres: 'zerfresse, zerfrisst, zerfrisst, zerfressen, zerfresst, zerfressen', participle: 'zerfressen' },
  angeln: { pres: 'angle, angelst, angelt, angeln, angelt, angeln', participle: 'geangelt' }, // starts like an- verbs, is not one
  abonnieren: { pres: 'abonniere, abonnierst, abonniert, abonnieren, abonniert, abonnieren', participle: 'abonniert' },
  hinterlassen: {
    pres: 'hinterlasse, hinterlässt, hinterlässt, hinterlassen, hinterlasst, hinterlassen',
    praet: 'hinterließ, hinterließest, hinterließ, hinterließen, hinterließt, hinterließen', participle: 'hinterlassen',
  },
  üben: { pres: 'übe, übst, übt, üben, übt, üben', participle: 'geübt' },
  'auf|hängen': { // transitive: weak, unlike hängen
    praet: 'hängte auf, hängtest auf, hängte auf, hängten auf, hängtet auf, hängten auf', participle: 'aufgehängt',
  },
  erschaffen: { praet: 'erschuf, erschufst, erschuf, erschufen, erschuft, erschufen', participle: 'erschaffen' },
  entscheiden: { praet: 'entschied, entschiedest, entschied, entschieden, entschiedet, entschieden', ...tails('haben', 'entscheiden', 'entschieden') },
  verschwinden: { praet: 'verschwand, verschwandest, verschwand, verschwanden, verschwandet, verschwanden', ...tails('sein', 'verschwinden', 'verschwunden') },
  erscheinen: { participle: 'erschienen', perfekt: 'bin erschienen, bist erschienen, ist erschienen, sind erschienen, seid erschienen, sind erschienen' },
  ertrinken: { participle: 'ertrunken', perfekt: 'bin ertrunken, bist ertrunken, ist ertrunken, sind ertrunken, seid ertrunken, sind ertrunken' },
  verleiden: { participle: 'verleidet' }, // looks like a relative of leiden, is weak
  'ab|weichen': tails('sein', 'abweichen', 'abgewichen'),
  'aus|brechen': tails('sein', 'ausbrechen', 'ausgebrochen'),
  'ab|brechen': tails('haben', 'abbrechen', 'abgebrochen'),
  'ein|treten': tails('sein', 'eintreten', 'eingetreten'),
  betreten: tails('haben', 'betreten', 'betreten'),

  // ---- found by the stage-2 audits (each one was wrong or missing once) ----
  // look-alikes that are not relatives of a strong verb
  begleiten: { // ends in -gleiten but is weak
    pres: 'begleite, begleitest, begleitet, begleiten, begleitet, begleiten',
    praet: 'begleitete, begleitetest, begleitete, begleiteten, begleitetet, begleiteten', ...tails('haben', 'begleiten', 'begleitet'),
  },
  umringen: { // from Ring, not from ringen
    praet: 'umringte, umringtest, umringte, umringten, umringtet, umringten', ...tails('haben', 'umringen', 'umringt'),
  },
  entwenden: { praet: 'entwendete, entwendetest, entwendete, entwendeten, entwendetet, entwendeten', ...tails('haben', 'entwenden', 'entwendet') },
  verwenden: { praet: 'verwendete, verwendetest, verwendete, verwendeten, verwendetet, verwendeten', ...tails('haben', 'verwenden', 'verwendet') },
  'wieder|verwenden': { praet: 'verwendete wieder, verwendetest wieder, verwendete wieder, verwendeten wieder, verwendetet wieder, verwendeten wieder', participle: 'wiederverwendet' },
  // the imperative of an e>i verb keeps the i even when the prefix has an umlaut (über-)
  übergeben: {
    pres: 'übergebe, übergibst, übergibt, übergeben, übergebt, übergeben',
    imp: 'übergib, übergib, übergib, übergeben wir, übergebt, übergeben Sie', ...tails('haben', 'übergeben', 'übergeben'),
  },
  übernehmen: {
    pres: 'übernehme, übernimmst, übernimmt, übernehmen, übernehmt, übernehmen',
    praet: 'übernahm, übernahmst, übernahm, übernahmen, übernahmt, übernahmen',
    imp: 'übernimm, übernimm, übernimm, übernehmen wir, übernehmt, übernehmen Sie', ...tails('haben', 'übernehmen', 'übernommen'),
  },
  übertreffen: { imp: 'übertriff, übertriff, übertriff, übertreffen wir, übertrefft, übertreffen Sie', participle: 'übertroffen' },
  übersehen: { imp: 'übersieh, übersieh, übersieh, übersehen wir, überseht, übersehen Sie', participle: 'übersehen' },
  // ... while an a>ä verb keeps the infinitive stem (fahr, fall), also with an umlaut prefix
  überfallen: { imp: 'überfall, überfall, überfall, überfallen wir, überfallt, überfallen Sie', participle: 'überfallen' },
  erlöschen: {
    pres: 'erlösche, erlischst, erlischt, erlöschen, erlöscht, erlöschen',
    praet: 'erlosch, erloschst, erlosch, erloschen, erloscht, erloschen',
    imp: 'erlisch, erlisch, erlisch, erlöschen wir, erlöscht, erlöschen Sie', ...tails('sein', 'erlöschen', 'erloschen'),
  },
  // scheren (to shear) is strong; the nautical / traffic scheren (ausscheren) and bescheren are weak
  scheren: {
    pres: 'schere, scherst, schert, scheren, schert, scheren',
    praet: 'schor, schorst, schor, schoren, schort, schoren',
    konj2: 'schöre, schörest, schöre, schören, schöret, schören',
    imp: 'scher, scher, scher, scheren wir, schert, scheren Sie', ...tails('haben', 'scheren', 'geschoren'),
  },
  'ab|scheren': { praet: 'schor ab, schorst ab, schor ab, schoren ab, schort ab, schoren ab', participle: 'abgeschoren' },
  'aus|scheren': {
    praet: 'scherte aus, schertest aus, scherte aus, scherten aus, schertet aus, scherten aus', ...tails('sein', 'ausscheren', 'ausgeschert'),
  },
  bescheren: { praet: 'bescherte, beschertest, bescherte, bescherten, beschertet, bescherten', ...tails('haben', 'bescheren', 'beschert') },
  // scheiden (to divorce, to separate) takes haben; ausscheiden (to leave) takes sein
  scheiden: { praet: 'schied, schiedest, schied, schieden, schiedet, schieden', ...tails('haben', 'scheiden', 'geschieden') },
  'aus|scheiden': tails('sein', 'ausscheiden', 'ausgeschieden'),
  // intransitive change-of-state and motion verbs that were conjugated with haben
  platzen: {
    pres: 'platze, platzt, platzt, platzen, platzt, platzen',
    praet: 'platzte, platztest, platzte, platzten, platztet, platzten', ...tails('sein', 'platzen', 'geplatzt'),
  },
  'auf|platzen': tails('sein', 'aufplatzen', 'aufgeplatzt'),
  zerplatzen: tails('sein', 'zerplatzen', 'zerplatzt'),
  'ab|prallen': tails('sein', 'abprallen', 'abgeprallt'),
  'zusammen|prallen': tails('sein', 'zusammenprallen', 'zusammengeprallt'),
  'ab|driften': tails('sein', 'abdriften', 'abgedriftet'),
  'ab|schweifen': tails('sein', 'abschweifen', 'abgeschweift'),
  'ab|magern': tails('sein', 'abmagern', 'abgemagert'),
  verklingen: { praet: 'verklang, verklangst, verklang, verklangen, verklangt, verklangen', ...tails('sein', 'verklingen', 'verklungen') },
  verblassen: tails('sein', 'verblassen', 'verblasst'),
  verdorren: tails('sein', 'verdorren', 'verdorrt'),
  verenden: tails('sein', 'verenden', 'verendet'),
  verheilen: tails('sein', 'verheilen', 'verheilt'),
  verkümmern: tails('sein', 'verkümmern', 'verkümmert'),
  verrosten: tails('sein', 'verrosten', 'verrostet'),
  verstummen: tails('sein', 'verstummen', 'verstummt'),
  vertrocknen: tails('sein', 'vertrocknen', 'vertrocknet'),
  ertönen: tails('sein', 'ertönen', 'ertönt'),
  flüchten: {
    pres: 'flüchte, flüchtest, flüchtet, flüchten, flüchtet, flüchten', ...tails('sein', 'flüchten', 'geflüchtet'),
  },
  hoppeln: tails('sein', 'hoppeln', 'gehoppelt'),
  hopsen: tails('sein', 'hopsen', 'gehopst'),
  kollabieren: tails('sein', 'kollabieren', 'kollabiert'),
  kullern: tails('sein', 'kullern', 'gekullert'),
  purzeln: tails('sein', 'purzeln', 'gepurzelt'),
  rieseln: tails('sein', 'rieseln', 'gerieselt'),
  sickern: tails('sein', 'sickern', 'gesickert'),
  straucheln: tails('sein', 'straucheln', 'gestrauchelt'),
  schrumpfen: tails('sein', 'schrumpfen', 'geschrumpft'),
  schlurfen: tails('sein', 'schlurfen', 'geschlurft'),
  waten: tails('sein', 'waten', 'gewatet'),
  schnellen: tails('sein', 'schnellen', 'geschnellt'),
  strömen: tails('sein', 'strömen', 'geströmt'),
  spazieren: tails('sein', 'spazieren', 'spaziert'),
  'zurück|zucken': tails('sein', 'zurückzucken', 'zurückgezuckt'),
  'zusammen|zucken': tails('sein', 'zusammenzucken', 'zusammengezuckt'),
  'zusammen|stoßen': {
    pres: 'stoße zusammen, stößt zusammen, stößt zusammen, stoßen zusammen, stoßt zusammen, stoßen zusammen',
    ...tails('sein', 'zusammenstoßen', 'zusammengestoßen'),
  },
  'entgegen|treten': tails('sein', 'entgegentreten', 'entgegengetreten'),
  'auf|flammen': tails('sein', 'aufflammen', 'aufgeflammt'),
  'auf|leben': tails('sein', 'aufleben', 'aufgelebt'),
  'vor|rücken': tails('sein', 'vorrücken', 'vorgerückt'),
  'umher|streifen': tails('sein', 'umherstreifen', 'umhergestreift'),
  'aus|trocknen': {
    pres: 'trockne aus, trocknest aus, trocknet aus, trocknen aus, trocknet aus, trocknen aus', ...tails('sein', 'austrocknen', 'ausgetrocknet'),
  },
  treiben: { // as a verb of drifting (the database uses it for "drift" and "float")
    praet: 'trieb, triebst, trieb, trieben, triebt, trieben', ...tails('sein', 'treiben', 'getrieben'),
  },
  'an|treiben': tails('haben', 'antreiben', 'angetrieben'),
  rollen: tails('sein', 'rollen', 'gerollt'),
  'aus|rollen': tails('haben', 'ausrollen', 'ausgerollt'),
  // ... and transitive neighbours that must keep haben
  'ab|trocknen': tails('haben', 'abtrocknen', 'abgetrocknet'),
  'auf|brechen': tails('sein', 'aufbrechen', 'aufgebrochen'),
  'auf|stemmen': tails('haben', 'aufstemmen', 'aufgestemmt'),
  'aus|reißen': tails('haben', 'ausreißen', 'ausgerissen'),
  verbummeln: tails('haben', 'verbummeln', 'verbummelt'),
  // weak ab|schrecken / zurück|schrecken (schrecken alone is refused); aus|hängen (notice) is weak, ab|hängen (depend) strong
  'ab|schrecken': {
    pres: 'schrecke ab, schreckst ab, schreckt ab, schrecken ab, schreckt ab, schrecken ab',
    praet: 'schreckte ab, schrecktest ab, schreckte ab, schreckten ab, schrecktet ab, schreckten ab', ...tails('haben', 'abschrecken', 'abgeschreckt'),
  },
  'zurück|schrecken': {
    praet: 'schreckte zurück, schrecktest zurück, schreckte zurück, schreckten zurück, schrecktet zurück, schreckten zurück',
    ...tails('sein', 'zurückschrecken', 'zurückgeschreckt'),
  },
  'aus|hängen': {
    praet: 'hängte aus, hängtest aus, hängte aus, hängten aus, hängtet aus, hängten aus', participle: 'ausgehängt',
  },
  'ab|hängen': {
    praet: 'hing ab, hingst ab, hing ab, hingen ab, hingt ab, hingen ab', participle: 'abgehangen',
  },
  // verbs that exist both as separable and inseparable: a bare form is the inseparable one, a marked form the separable one
  übertreten: {
    pres: 'übertrete, übertrittst, übertritt, übertreten, übertretet, übertreten',
    praet: 'übertrat, übertratest, übertrat, übertraten, übertratet, übertraten',
    imp: 'übertritt, übertritt, übertritt, übertreten wir, übertretet, übertreten Sie', ...tails('haben', 'übertreten', 'übertreten'),
  },
  'über|treten': {
    pres: 'trete über, trittst über, tritt über, treten über, tretet über, treten über', ...tails('sein', 'übertreten', 'übergetreten'),
  },
  unterstellen: { praet: 'unterstellte, unterstelltest, unterstellte, unterstellten, unterstelltet, unterstellten', ...tails('haben', 'unterstellen', 'unterstellt') },
  übergehen: {
    praet: 'überging, übergingst, überging, übergingen, übergingt, übergingen', ...tails('haben', 'übergehen', 'übergangen'),
  },
  'über|gehen': tails('sein', 'übergehen', 'übergegangen'),
  umgehen: { praet: 'umging, umgingst, umging, umgingen, umgingt, umgingen', ...tails('haben', 'umgehen', 'umgangen') },
  'um|gehen': { praet: 'ging um, gingst um, ging um, gingen um, gingt um, gingen um', ...tails('sein', 'umgehen', 'umgegangen') },
  umschreiben: { praet: 'umschrieb, umschriebst, umschrieb, umschrieben, umschriebt, umschrieben', ...tails('haben', 'umschreiben', 'umschrieben') },
  'um|schreiben': { praet: 'schrieb um, schriebst um, schrieb um, schrieben um, schriebt um, schrieben um', participle: 'umgeschrieben' },
  // inseparable um- / durch- verbs
  umzäunen: tails('haben', 'umzäunen', 'umzäunt'),
  umschmeicheln: { pres: 'umschmeichle, umschmeichelst, umschmeichelt, umschmeicheln, umschmeichelt, umschmeicheln', participle: 'umschmeichelt' },
  umklammern: { pres: 'umklammere, umklammerst, umklammert, umklammern, umklammert, umklammern', participle: 'umklammert' },
  ummauern: { participle: 'ummauert' },
  durchbohren: { pres: 'durchbohre, durchbohrst, durchbohrt, durchbohren, durchbohrt, durchbohren', participle: 'durchbohrt' },
  durchnässen: { pres: 'durchnässe, durchnässt, durchnässt, durchnässen, durchnässt, durchnässen', participle: 'durchnässt' },
  durchtränken: { participle: 'durchtränkt' },
  durchtrennen: { participle: 'durchtrennt' },
  durchleuchten: { praet: 'durchleuchtete, durchleuchtetest, durchleuchtete, durchleuchteten, durchleuchtetet, durchleuchteten', participle: 'durchleuchtet' },
  durchkämmen: { participle: 'durchkämmt' },
  zupfen: { pres: 'zupfe, zupfst, zupft, zupfen, zupft, zupfen', participle: 'gezupft' },
  // no ge- in the participle of verbs with an unstressed first syllable
  interviewen: {
    pres: 'interviewe, interviewst, interviewt, interviewen, interviewt, interviewen',
    praet: 'interviewte, interviewtest, interviewte, interviewten, interviewtet, interviewten', participle: 'interviewt',
  },
  recyceln: { pres: 'recycle, recycelst, recycelt, recyceln, recycelt, recyceln', participle: 'recycelt' },
  // a vowel-final stem: säe!
  säen: {
    pres: 'säe, säst, sät, säen, sät, säen',
    praet: 'säte, sätest, säte, säten, sätet, säten', participle: 'gesät',
  },
  'aus|säen': { imp: 'säe aus, säe aus, säe aus, säen wir aus, sät aus, säen Sie aus' },

  // ---- impersonal verbs: only the 3rd person singular exists ----
  regnen: {
    pres: `${NONE}, ${NONE}, regnet, ${NONE}, ${NONE}, ${NONE}`,
    praet: `${NONE}, ${NONE}, regnete, ${NONE}, ${NONE}, ${NONE}`,
    perfekt: `${NONE}, ${NONE}, hat geregnet, ${NONE}, ${NONE}, ${NONE}`,
    fut1: `${NONE}, ${NONE}, wird regnen, ${NONE}, ${NONE}, ${NONE}`,
    konj2: `${NONE}, ${NONE}, regnete, ${NONE}, ${NONE}, ${NONE}`,
    wuerde: `${NONE}, ${NONE}, würde regnen, ${NONE}, ${NONE}, ${NONE}`,
    imp: NO_IMP, gerund: 'regnend', participle: 'geregnet',
  },
  schneien: {
    pres: `${NONE}, ${NONE}, schneit, ${NONE}, ${NONE}, ${NONE}`,
    perfekt: `${NONE}, ${NONE}, hat geschneit, ${NONE}, ${NONE}, ${NONE}`, participle: 'geschneit',
  },
};

const report = createReport();

// A duplicate key in an object literal silently replaces the earlier entry and so drops its assertions:
// read this file's own source and refuse duplicates in EXPECTED.
{
  const source = require('fs').readFileSync(__filename, 'utf8');
  const start = source.indexOf('const EXPECTED = {');
  const body = source.slice(start, source.indexOf('\n};\n', start));
  const seen = new Set();
  for (const [, key] of body.matchAll(/^ {2}('?[^\s':]+'?): /gm)) {
    report.checks += 1;
    if (seen.has(key)) report.fail(`EXPECTED has the key ${key} twice; the later entry would silently replace the earlier one`);
    seen.add(key);
  }
}
checkParadigms(report, EXPECTED, conjugate);

// Every result has exactly the 13 keys, in order, with six strings each.
for (const verb of Object.keys(EXPECTED)) {
  report.checks += 1;
  const result = conjugate(verb);
  if (!result) continue; // already reported by checkParadigms
  if (Object.keys(result.forms).join() !== FORM_KEYS.join()) report.fail(`${verb}: wrong form keys ${Object.keys(result.forms)}`);
  for (const key of FORM_KEYS) {
    const forms = result.forms[key];
    if (!Array.isArray(forms) || forms.length !== 6 || forms.some(f => typeof f !== 'string' || !f)) {
      report.fail(`${verb}.${key}: not six strings: ${JSON.stringify(forms)}`);
    }
  }
}

// The infinitive drops the "|" and the result echoes it.
for (const [input, inf] of [['auf|stehen', 'aufstehen'], ['an|kommen', 'ankommen'], ['mit|bringen', 'mitbringen'], ['sprechen', 'sprechen']]) {
  report.checks += 1;
  const result = conjugate(input);
  if (!result || result.inf !== inf) report.fail(`conjugate(${JSON.stringify(input)}).inf should be ${inf}`);
}

// Input that is not a verb this engine can conjugate must be refused, not guessed at.
for (const input of ['gären', 'schrecken', 'bersten', '', 'hello', 'sich waschen', 'sich|waschen', 'xyz', '123', 'constructor', 'toString', '__proto__', 'hasOwnProperty',
  '|stehen', 'auf|', 'auf|stehen|an', 'a|stehen', 'xtun', 'xsein', 'tuen', 'Haus', null, undefined, 42]) {
  report.checks += 1;
  if (conjugate(input) !== null) report.fail(`conjugate(${JSON.stringify(input)}) should be null`);
}
// A separable verb written without the "|" cannot be told apart from an inseparable one: refuse.
for (const input of ['abgeben', 'aufstehen', 'ankommen', 'mitnehmen', 'zurückkommen', 'einladen', 'ausgehen', 'zugeben', 'anerkennen',
  'wiedersehen', 'weiterfahren', 'herausfinden', 'ausrutschen', 'aufwachen', 'umkommen', 'untergehen', 'durchführen', 'volltanken',
  'abholen', 'vorbereiten', 'beitragen', 'hinzufügen', 'überwerfen', 'unterbringen', 'widerspiegeln', 'umkreisen|', 'zurückschrecken', 'abschrecken']) {
  report.checks += 1;
  if (conjugate(input) !== null) report.fail(`conjugate(${JSON.stringify(input)}) should be null (separable prefix not marked)`);
}
// Case and surrounding spaces are ignored.
report.checks += 1;
if (!conjugate('  Sprechen ') || conjugate('  Sprechen ').inf !== 'sprechen') report.fail('conjugate("  Sprechen ") should normalise to sprechen');
report.checks += 1;
if (!conjugate(' AUF|Stehen') || conjugate(' AUF|Stehen').inf !== 'aufstehen') report.fail('conjugate(" AUF|Stehen") should normalise to aufstehen');

// Every verb in the database must conjugate into well-formed output.
const germanCount = checkInflectedDatabase(report, {
  verbs: VERBS,
  conjugate,
  lang: 'de',
  formKeys: FORM_KEYS,
  gerund: /nd$/,
  participle: /(t|en|n)$/,
});

// A typo in a separable prefix ("au|fstehen") would still conjugate, so every prefix used in the
// database must be one of the known separable prefixes (each was read by hand in the stage-2 audit).
const SEPARABLE_PREFIXES = new Set(`
  ab an auf aufeinander aufrecht aus auseinander bei bekannt bereit bloß dahin dar davon durch durcheinander ein
  empor entgegen fern fertig fest fort frei gefangen gegenüber gerade gering glatt groß gut heim her herab heran
  heraus herbei herein herum herunter hervor hin hinaus hinein hinterher hinunter hinzu hoch inne irre kaputt
  kennen klar klein lahm lieb los mit nach neu nieder offen preis ruhig sauber scharf schlecht schön sicher ski
  stand statt stumm teil um umher unter verloren voll vor voran voraus vorbei vorher vorweg wach wahr weg weh
  weiter wider wieder zu zufrieden zurecht zurück zusammen über überein übrig`.trim().split(/\s+/));
let separable = 0;
for (const [english, entries] of Object.entries(VERBS)) {
  for (const { de } of entries) {
    if (!de.includes('|')) continue;
    separable += 1;
    report.checks += 1;
    const prefix = de.split('|')[0];
    if (!SEPARABLE_PREFIXES.has(prefix)) report.fail(`${english} -> ${de}: unknown separable prefix "${prefix}"`);
  }
}

// Writing non-ASCII text has produced U+FFFD replacement characters before.
for (const file of ['conjugate.js', 'verbs.js', 'test.js', 'app.js']) {
  report.checks += 1;
  const text = require('fs').readFileSync(require('path').join(__dirname, file), 'utf8');
  if (text.includes('\uFFFD')) report.fail(`${file} contains U+FFFD replacement characters`);
}

report.finish(`${report.checks} paradigm checks, ${Object.keys(VERBS).length} English verbs, ${germanCount} German translations (${separable} separable)`);
