// Run with: node test.js
// Checks the conjugation engine against known paradigms, then runs every
// Italian verb in verbs.js through it to catch crashes and malformed output.
const { conjugate } = require('./conjugate.js');
const { VERBS } = require('./verbs.js');
const { createReport, checkParadigms, checkInflectedDatabase } = require('../shared/test-kit.js');

// verb -> { tense: 'io, tu, lui, noi, voi, loro' }  (gerund / participle as plain strings)
const EXPECTED = {};
function add(table) {
  for (const [verb, tenses] of Object.entries(table)) {
    if (Object.hasOwn(EXPECTED, verb)) throw new Error(`test.js: duplicate expectation for ${verb}`);
    EXPECTED[verb] = tenses;
  }
}

// ---- helper: whole paradigms from the simple tenses ----
// The compound tenses are mechanical (auxiliary + participle, with -o/-a and -i/-e
// agreement after essere), so a full paradigm is written as its simple tenses and
// the seven compound tenses and the negative imperative are built here from the
// auxiliary forms, independently of the engine. `impAff: null` = no imperative.
const AUX = {
  avere: {
    pres: 'ho hai ha abbiamo avete hanno', imperf: 'avevo avevi aveva avevamo avevate avevano',
    passRem: 'ebbi avesti ebbe avemmo aveste ebbero', futSem: 'avrò avrai avrà avremo avrete avranno',
    condPres: 'avrei avresti avrebbe avremmo avreste avrebbero',
    congPres: 'abbia abbia abbia abbiamo abbiate abbiano', congImperf: 'avessi avessi avesse avessimo aveste avessero',
  },
  essere: {
    pres: 'sono sei è siamo siete sono', imperf: 'ero eri era eravamo eravate erano',
    passRem: 'fui fosti fu fummo foste furono', futSem: 'sarò sarai sarà saremo sarete saranno',
    condPres: 'sarei saresti sarebbe saremmo sareste sarebbero',
    congPres: 'sia sia sia siamo siate siano', congImperf: 'fossi fossi fosse fossimo foste fossero',
  },
};
const COMPOUND_OF = {
  passProx: 'pres', trapProx: 'imperf', trapRem: 'passRem', futAnt: 'futSem',
  condPass: 'condPres', congPass: 'congPres', congTrap: 'congImperf',
};
function full(verb, aux, participle, simple) {
  const result = { ...simple, participle };
  for (const [tense, from] of Object.entries(COMPOUND_OF)) {
    result[tense] = AUX[aux][from].split(' ').map((form, i) => {
      if (aux === 'avere') return `${form} ${participle}`;
      return `${form} ${i < 3 ? participle + '/a' : participle.slice(0, -1) + 'i/e'}`;
    }).join(', ');
  }
  if (simple.impAff === null) result.impAff = result.impNeg = '—, —, —, —, —, —';
  else {
    const forms = simple.impAff.split(', ');
    result.impNeg = [`non ${verb}`, `non ${verb}`, ...forms.slice(2).map(f => 'non ' + f)].join(', ');
  }
  return result;
}

// ---- regular verbs in full: the three conjugations ----
add({
  parlare: {
    pres: 'parlo, parli, parla, parliamo, parlate, parlano',
    passProx: 'ho parlato, hai parlato, ha parlato, abbiamo parlato, avete parlato, hanno parlato',
    imperf: 'parlavo, parlavi, parlava, parlavamo, parlavate, parlavano',
    trapProx: 'avevo parlato, avevi parlato, aveva parlato, avevamo parlato, avevate parlato, avevano parlato',
    passRem: 'parlai, parlasti, parlò, parlammo, parlaste, parlarono',
    trapRem: 'ebbi parlato, avesti parlato, ebbe parlato, avemmo parlato, aveste parlato, ebbero parlato',
    futSem: 'parlerò, parlerai, parlerà, parleremo, parlerete, parleranno',
    futAnt: 'avrò parlato, avrai parlato, avrà parlato, avremo parlato, avrete parlato, avranno parlato',
    condPres: 'parlerei, parleresti, parlerebbe, parleremmo, parlereste, parlerebbero',
    condPass: 'avrei parlato, avresti parlato, avrebbe parlato, avremmo parlato, avreste parlato, avrebbero parlato',
    congPres: 'parli, parli, parli, parliamo, parliate, parlino',
    congPass: 'abbia parlato, abbia parlato, abbia parlato, abbiamo parlato, abbiate parlato, abbiano parlato',
    congImperf: 'parlassi, parlassi, parlasse, parlassimo, parlaste, parlassero',
    congTrap: 'avessi parlato, avessi parlato, avesse parlato, avessimo parlato, aveste parlato, avessero parlato',
    impAff: 'parla, parla, parli, parliamo, parlate, parlino',
    impNeg: 'non parlare, non parlare, non parli, non parliamo, non parlate, non parlino',
    gerund: 'parlando', participle: 'parlato',
  },
  andare: {
    pres: 'vado, vai, va, andiamo, andate, vanno',
    passProx: 'sono andato/a, sei andato/a, è andato/a, siamo andati/e, siete andati/e, sono andati/e',
    imperf: 'andavo, andavi, andava, andavamo, andavate, andavano',
    trapProx: 'ero andato/a, eri andato/a, era andato/a, eravamo andati/e, eravate andati/e, erano andati/e',
    passRem: 'andai, andasti, andò, andammo, andaste, andarono',
    trapRem: 'fui andato/a, fosti andato/a, fu andato/a, fummo andati/e, foste andati/e, furono andati/e',
    futSem: 'andrò, andrai, andrà, andremo, andrete, andranno',
    futAnt: 'sarò andato/a, sarai andato/a, sarà andato/a, saremo andati/e, sarete andati/e, saranno andati/e',
    condPres: 'andrei, andresti, andrebbe, andremmo, andreste, andrebbero',
    condPass: 'sarei andato/a, saresti andato/a, sarebbe andato/a, saremmo andati/e, sareste andati/e, sarebbero andati/e',
    congPres: 'vada, vada, vada, andiamo, andiate, vadano',
    congPass: 'sia andato/a, sia andato/a, sia andato/a, siamo andati/e, siate andati/e, siano andati/e',
    congImperf: 'andassi, andassi, andasse, andassimo, andaste, andassero',
    congTrap: 'fossi andato/a, fossi andato/a, fosse andato/a, fossimo andati/e, foste andati/e, fossero andati/e',
    impAff: "va', va', vada, andiamo, andate, vadano",
    impNeg: 'non andare, non andare, non vada, non andiamo, non andate, non vadano',
    gerund: 'andando', participle: 'andato',
  },
});

add({
  credere: full('credere', 'avere', 'creduto', {
    pres: 'credo, credi, crede, crediamo, credete, credono',
    imperf: 'credevo, credevi, credeva, credevamo, credevate, credevano',
    passRem: 'credei, credesti, credé, credemmo, credeste, crederono',
    futSem: 'crederò, crederai, crederà, crederemo, crederete, crederanno',
    condPres: 'crederei, crederesti, crederebbe, crederemmo, credereste, crederebbero',
    congPres: 'creda, creda, creda, crediamo, crediate, credano',
    congImperf: 'credessi, credessi, credesse, credessimo, credeste, credessero',
    impAff: 'credi, credi, creda, crediamo, credete, credano',
    gerund: 'credendo',
  }),
  vendere: {
    passRem: 'vendei, vendesti, vendé, vendemmo, vendeste, venderono',
    pres: 'vendo, vendi, vende, vendiamo, vendete, vendono',
    participle: 'venduto', gerund: 'vendendo',
  },
  partire: full('partire', 'essere', 'partito', {
    pres: 'parto, parti, parte, partiamo, partite, partono',
    imperf: 'partivo, partivi, partiva, partivamo, partivate, partivano',
    passRem: 'partii, partisti, partì, partimmo, partiste, partirono',
    futSem: 'partirò, partirai, partirà, partiremo, partirete, partiranno',
    condPres: 'partirei, partiresti, partirebbe, partiremmo, partireste, partirebbero',
    congPres: 'parta, parta, parta, partiamo, partiate, partano',
    congImperf: 'partissi, partissi, partisse, partissimo, partiste, partissero',
    impAff: 'parti, parti, parta, partiamo, partite, partano',
    gerund: 'partendo',
  }),
  finire: full('finire', 'avere', 'finito', {
    pres: 'finisco, finisci, finisce, finiamo, finite, finiscono',
    imperf: 'finivo, finivi, finiva, finivamo, finivate, finivano',
    passRem: 'finii, finisti, finì, finimmo, finiste, finirono',
    futSem: 'finirò, finirai, finirà, finiremo, finirete, finiranno',
    condPres: 'finirei, finiresti, finirebbe, finiremmo, finireste, finirebbero',
    congPres: 'finisca, finisca, finisca, finiamo, finiate, finiscano',
    congImperf: 'finissi, finissi, finisse, finissimo, finiste, finissero',
    impAff: 'finisci, finisci, finisca, finiamo, finite, finiscano',
    gerund: 'finendo',
  }),
});

// ---- essere, avere and the irregular -are verbs ----
add({
  essere: full('essere', 'essere', 'stato', {
    pres: 'sono, sei, è, siamo, siete, sono',
    imperf: 'ero, eri, era, eravamo, eravate, erano',
    passRem: 'fui, fosti, fu, fummo, foste, furono',
    futSem: 'sarò, sarai, sarà, saremo, sarete, saranno',
    condPres: 'sarei, saresti, sarebbe, saremmo, sareste, sarebbero',
    congPres: 'sia, sia, sia, siamo, siate, siano',
    congImperf: 'fossi, fossi, fosse, fossimo, foste, fossero',
    impAff: 'sii, sii, sia, siamo, siate, siano',
    gerund: 'essendo',
  }),
  avere: full('avere', 'avere', 'avuto', {
    pres: 'ho, hai, ha, abbiamo, avete, hanno',
    imperf: 'avevo, avevi, aveva, avevamo, avevate, avevano',
    passRem: 'ebbi, avesti, ebbe, avemmo, aveste, ebbero',
    futSem: 'avrò, avrai, avrà, avremo, avrete, avranno',
    condPres: 'avrei, avresti, avrebbe, avremmo, avreste, avrebbero',
    congPres: 'abbia, abbia, abbia, abbiamo, abbiate, abbiano',
    congImperf: 'avessi, avessi, avesse, avessimo, aveste, avessero',
    impAff: 'abbi, abbi, abbia, abbiamo, abbiate, abbiano',
    gerund: 'avendo',
  }),
  fare: full('fare', 'avere', 'fatto', {
    pres: 'faccio, fai, fa, facciamo, fate, fanno',
    imperf: 'facevo, facevi, faceva, facevamo, facevate, facevano',
    passRem: 'feci, facesti, fece, facemmo, faceste, fecero',
    futSem: 'farò, farai, farà, faremo, farete, faranno',
    condPres: 'farei, faresti, farebbe, faremmo, fareste, farebbero',
    congPres: 'faccia, faccia, faccia, facciamo, facciate, facciano',
    congImperf: 'facessi, facessi, facesse, facessimo, faceste, facessero',
    impAff: "fa', fa', faccia, facciamo, fate, facciano",
    gerund: 'facendo',
  }),
  dare: full('dare', 'avere', 'dato', {
    pres: 'do, dai, dà, diamo, date, danno',
    imperf: 'davo, davi, dava, davamo, davate, davano',
    passRem: 'diedi, desti, diede, demmo, deste, diedero',
    futSem: 'darò, darai, darà, daremo, darete, daranno',
    condPres: 'darei, daresti, darebbe, daremmo, dareste, darebbero',
    congPres: 'dia, dia, dia, diamo, diate, diano',
    congImperf: 'dessi, dessi, desse, dessimo, deste, dessero',
    impAff: "da', da', dia, diamo, date, diano",
    gerund: 'dando',
  }),
  stare: full('stare', 'essere', 'stato', {
    pres: 'sto, stai, sta, stiamo, state, stanno',
    imperf: 'stavo, stavi, stava, stavamo, stavate, stavano',
    passRem: 'stetti, stesti, stette, stemmo, steste, stettero',
    futSem: 'starò, starai, starà, staremo, starete, staranno',
    condPres: 'starei, staresti, starebbe, staremmo, stareste, starebbero',
    congPres: 'stia, stia, stia, stiamo, stiate, stiano',
    congImperf: 'stessi, stessi, stesse, stessimo, steste, stessero',
    impAff: "sta', sta', stia, stiamo, state, stiano",
    gerund: 'stando',
  }),
  dire: full('dire', 'avere', 'detto', {
    pres: 'dico, dici, dice, diciamo, dite, dicono',
    imperf: 'dicevo, dicevi, diceva, dicevamo, dicevate, dicevano',
    passRem: 'dissi, dicesti, disse, dicemmo, diceste, dissero',
    futSem: 'dirò, dirai, dirà, diremo, direte, diranno',
    condPres: 'direi, diresti, direbbe, diremmo, direste, direbbero',
    congPres: 'dica, dica, dica, diciamo, diciate, dicano',
    congImperf: 'dicessi, dicessi, dicesse, dicessimo, diceste, dicessero',
    impAff: "di', di', dica, diciamo, dite, dicano",
    gerund: 'dicendo',
  }),
  venire: full('venire', 'essere', 'venuto', {
    pres: 'vengo, vieni, viene, veniamo, venite, vengono',
    imperf: 'venivo, venivi, veniva, venivamo, venivate, venivano',
    passRem: 'venni, venisti, venne, venimmo, veniste, vennero',
    futSem: 'verrò, verrai, verrà, verremo, verrete, verranno',
    condPres: 'verrei, verresti, verrebbe, verremmo, verreste, verrebbero',
    congPres: 'venga, venga, venga, veniamo, veniate, vengano',
    congImperf: 'venissi, venissi, venisse, venissimo, veniste, venissero',
    impAff: 'vieni, vieni, venga, veniamo, venite, vengano',
    gerund: 'venendo',
  }),
});

// ---- modals, vedere, bere, porre ----
add({
  potere: full('potere', 'avere', 'potuto', {
    pres: 'posso, puoi, può, possiamo, potete, possono',
    imperf: 'potevo, potevi, poteva, potevamo, potevate, potevano',
    passRem: 'potei, potesti, poté, potemmo, poteste, poterono',
    futSem: 'potrò, potrai, potrà, potremo, potrete, potranno',
    condPres: 'potrei, potresti, potrebbe, potremmo, potreste, potrebbero',
    congPres: 'possa, possa, possa, possiamo, possiate, possano',
    congImperf: 'potessi, potessi, potesse, potessimo, poteste, potessero',
    impAff: null,
    gerund: 'potendo',
  }),
  volere: full('volere', 'avere', 'voluto', {
    pres: 'voglio, vuoi, vuole, vogliamo, volete, vogliono',
    imperf: 'volevo, volevi, voleva, volevamo, volevate, volevano',
    passRem: 'volli, volesti, volle, volemmo, voleste, vollero',
    futSem: 'vorrò, vorrai, vorrà, vorremo, vorrete, vorranno',
    condPres: 'vorrei, vorresti, vorrebbe, vorremmo, vorreste, vorrebbero',
    congPres: 'voglia, voglia, voglia, vogliamo, vogliate, vogliano',
    congImperf: 'volessi, volessi, volesse, volessimo, voleste, volessero',
    impAff: 'vogli, vogli, voglia, vogliamo, vogliate, vogliano',
    gerund: 'volendo',
  }),
  dovere: full('dovere', 'avere', 'dovuto', {
    pres: 'devo, devi, deve, dobbiamo, dovete, devono',
    imperf: 'dovevo, dovevi, doveva, dovevamo, dovevate, dovevano',
    passRem: 'dovei, dovesti, dové, dovemmo, doveste, doverono',
    futSem: 'dovrò, dovrai, dovrà, dovremo, dovrete, dovranno',
    condPres: 'dovrei, dovresti, dovrebbe, dovremmo, dovreste, dovrebbero',
    congPres: 'debba, debba, debba, dobbiamo, dobbiate, debbano',
    congImperf: 'dovessi, dovessi, dovesse, dovessimo, doveste, dovessero',
    impAff: null,
    gerund: 'dovendo',
  }),
  sapere: full('sapere', 'avere', 'saputo', {
    pres: 'so, sai, sa, sappiamo, sapete, sanno',
    imperf: 'sapevo, sapevi, sapeva, sapevamo, sapevate, sapevano',
    passRem: 'seppi, sapesti, seppe, sapemmo, sapeste, seppero',
    futSem: 'saprò, saprai, saprà, sapremo, saprete, sapranno',
    condPres: 'saprei, sapresti, saprebbe, sapremmo, sapreste, saprebbero',
    congPres: 'sappia, sappia, sappia, sappiamo, sappiate, sappiano',
    congImperf: 'sapessi, sapessi, sapesse, sapessimo, sapeste, sapessero',
    impAff: 'sappi, sappi, sappia, sappiamo, sappiate, sappiano',
    gerund: 'sapendo',
  }),
  vedere: full('vedere', 'avere', 'visto', {
    pres: 'vedo, vedi, vede, vediamo, vedete, vedono',
    imperf: 'vedevo, vedevi, vedeva, vedevamo, vedevate, vedevano',
    passRem: 'vidi, vedesti, vide, vedemmo, vedeste, videro',
    futSem: 'vedrò, vedrai, vedrà, vedremo, vedrete, vedranno',
    condPres: 'vedrei, vedresti, vedrebbe, vedremmo, vedreste, vedrebbero',
    congPres: 'veda, veda, veda, vediamo, vediate, vedano',
    congImperf: 'vedessi, vedessi, vedesse, vedessimo, vedeste, vedessero',
    impAff: 'vedi, vedi, veda, vediamo, vedete, vedano',
    gerund: 'vedendo',
  }),
  bere: full('bere', 'avere', 'bevuto', {
    pres: 'bevo, bevi, beve, beviamo, bevete, bevono',
    imperf: 'bevevo, bevevi, beveva, bevevamo, bevevate, bevevano',
    passRem: 'bevvi, bevesti, bevve, bevemmo, beveste, bevvero',
    futSem: 'berrò, berrai, berrà, berremo, berrete, berranno',
    condPres: 'berrei, berresti, berrebbe, berremmo, berreste, berrebbero',
    congPres: 'beva, beva, beva, beviamo, beviate, bevano',
    congImperf: 'bevessi, bevessi, bevesse, bevessimo, beveste, bevessero',
    impAff: 'bevi, bevi, beva, beviamo, bevete, bevano',
    gerund: 'bevendo',
  }),
  porre: full('porre', 'avere', 'posto', {
    pres: 'pongo, poni, pone, poniamo, ponete, pongono',
    imperf: 'ponevo, ponevi, poneva, ponevamo, ponevate, ponevano',
    passRem: 'posi, ponesti, pose, ponemmo, poneste, posero',
    futSem: 'porrò, porrai, porrà, porremo, porrete, porranno',
    condPres: 'porrei, porresti, porrebbe, porremmo, porreste, porrebbero',
    congPres: 'ponga, ponga, ponga, poniamo, poniate, pongano',
    congImperf: 'ponessi, ponessi, ponesse, ponessimo, poneste, ponessero',
    impAff: 'poni, poni, ponga, poniamo, ponete, pongano',
    gerund: 'ponendo',
  }),
  trarre: full('trarre', 'avere', 'tratto', {
    pres: 'traggo, trai, trae, traiamo, traete, traggono',
    imperf: 'traevo, traevi, traeva, traevamo, traevate, traevano',
    passRem: 'trassi, traesti, trasse, traemmo, traeste, trassero',
    futSem: 'trarrò, trarrai, trarrà, trarremo, trarrete, trarranno',
    condPres: 'trarrei, trarresti, trarrebbe, trarremmo, trarreste, trarrebbero',
    congPres: 'tragga, tragga, tragga, traiamo, traiate, traggano',
    congImperf: 'traessi, traessi, traesse, traessimo, traeste, traessero',
    impAff: 'trai, trai, tragga, traiamo, traete, traggano',
    gerund: 'traendo',
  }),
  condurre: full('condurre', 'avere', 'condotto', {
    pres: 'conduco, conduci, conduce, conduciamo, conducete, conducono',
    imperf: 'conducevo, conducevi, conduceva, conducevamo, conducevate, conducevano',
    passRem: 'condussi, conducesti, condusse, conducemmo, conduceste, condussero',
    futSem: 'condurrò, condurrai, condurrà, condurremo, condurrete, condurranno',
    condPres: 'condurrei, condurresti, condurrebbe, condurremmo, condurreste, condurrebbero',
    congPres: 'conduca, conduca, conduca, conduciamo, conduciate, conducano',
    congImperf: 'conducessi, conducessi, conducesse, conducessimo, conduceste, conducessero',
    impAff: 'conduci, conduci, conduca, conduciamo, conducete, conducano',
    gerund: 'conducendo',
  }),
});

// ---- uscire, salire, rimanere, tenere, scegliere, sedere, morire, piacere ----
add({
  uscire: full('uscire', 'essere', 'uscito', {
    pres: 'esco, esci, esce, usciamo, uscite, escono',
    imperf: 'uscivo, uscivi, usciva, uscivamo, uscivate, uscivano',
    passRem: 'uscii, uscisti, uscì, uscimmo, usciste, uscirono',
    futSem: 'uscirò, uscirai, uscirà, usciremo, uscirete, usciranno',
    condPres: 'uscirei, usciresti, uscirebbe, usciremmo, uscireste, uscirebbero',
    congPres: 'esca, esca, esca, usciamo, usciate, escano',
    congImperf: 'uscissi, uscissi, uscisse, uscissimo, usciste, uscissero',
    impAff: 'esci, esci, esca, usciamo, uscite, escano',
    gerund: 'uscendo',
  }),
  salire: full('salire', 'essere', 'salito', {
    pres: 'salgo, sali, sale, saliamo, salite, salgono',
    imperf: 'salivo, salivi, saliva, salivamo, salivate, salivano',
    passRem: 'salii, salisti, salì, salimmo, saliste, salirono',
    futSem: 'salirò, salirai, salirà, saliremo, salirete, saliranno',
    condPres: 'salirei, saliresti, salirebbe, saliremmo, salireste, salirebbero',
    congPres: 'salga, salga, salga, saliamo, saliate, salgano',
    congImperf: 'salissi, salissi, salisse, salissimo, saliste, salissero',
    impAff: 'sali, sali, salga, saliamo, salite, salgano',
    gerund: 'salendo',
  }),
  rimanere: full('rimanere', 'essere', 'rimasto', {
    pres: 'rimango, rimani, rimane, rimaniamo, rimanete, rimangono',
    imperf: 'rimanevo, rimanevi, rimaneva, rimanevamo, rimanevate, rimanevano',
    passRem: 'rimasi, rimanesti, rimase, rimanemmo, rimaneste, rimasero',
    futSem: 'rimarrò, rimarrai, rimarrà, rimarremo, rimarrete, rimarranno',
    condPres: 'rimarrei, rimarresti, rimarrebbe, rimarremmo, rimarreste, rimarrebbero',
    congPres: 'rimanga, rimanga, rimanga, rimaniamo, rimaniate, rimangano',
    congImperf: 'rimanessi, rimanessi, rimanesse, rimanessimo, rimaneste, rimanessero',
    impAff: 'rimani, rimani, rimanga, rimaniamo, rimanete, rimangano',
    gerund: 'rimanendo',
  }),
  tenere: full('tenere', 'avere', 'tenuto', {
    pres: 'tengo, tieni, tiene, teniamo, tenete, tengono',
    imperf: 'tenevo, tenevi, teneva, tenevamo, tenevate, tenevano',
    passRem: 'tenni, tenesti, tenne, tenemmo, teneste, tennero',
    futSem: 'terrò, terrai, terrà, terremo, terrete, terranno',
    condPres: 'terrei, terresti, terrebbe, terremmo, terreste, terrebbero',
    congPres: 'tenga, tenga, tenga, teniamo, teniate, tengano',
    congImperf: 'tenessi, tenessi, tenesse, tenessimo, teneste, tenessero',
    impAff: 'tieni, tieni, tenga, teniamo, tenete, tengano',
    gerund: 'tenendo',
  }),
  scegliere: full('scegliere', 'avere', 'scelto', {
    pres: 'scelgo, scegli, sceglie, scegliamo, scegliete, scelgono',
    imperf: 'sceglievo, sceglievi, sceglieva, sceglievamo, sceglievate, sceglievano',
    passRem: 'scelsi, scegliesti, scelse, scegliemmo, sceglieste, scelsero',
    futSem: 'sceglierò, sceglierai, sceglierà, sceglieremo, sceglierete, sceglieranno',
    condPres: 'sceglierei, sceglieresti, sceglierebbe, sceglieremmo, scegliereste, sceglierebbero',
    congPres: 'scelga, scelga, scelga, scegliamo, scegliate, scelgano',
    congImperf: 'scegliessi, scegliessi, scegliesse, scegliessimo, sceglieste, scegliessero',
    impAff: 'scegli, scegli, scelga, scegliamo, scegliete, scelgano',
    gerund: 'scegliendo',
  }),
  sedere: { // passato remoto and future left out: usage varies (sedei / sedetti, sederò / siederò)
    pres: 'siedo, siedi, siede, sediamo, sedete, siedono',
    imperf: 'sedevo, sedevi, sedeva, sedevamo, sedevate, sedevano',
    congPres: 'sieda, sieda, sieda, sediamo, sediate, siedano',
    impAff: 'siedi, siedi, sieda, sediamo, sedete, siedano',
    gerund: 'sedendo', participle: 'seduto',
    passProx: 'ho seduto, hai seduto, ha seduto, abbiamo seduto, avete seduto, hanno seduto',
  },
  morire: full('morire', 'essere', 'morto', {
    pres: 'muoio, muori, muore, moriamo, morite, muoiono',
    imperf: 'morivo, morivi, moriva, morivamo, morivate, morivano',
    passRem: 'morii, moristi, morì, morimmo, moriste, morirono',
    futSem: 'morirò, morirai, morirà, moriremo, morirete, moriranno',
    condPres: 'morirei, moriresti, morirebbe, moriremmo, morireste, morirebbero',
    congPres: 'muoia, muoia, muoia, moriamo, moriate, muoiano',
    congImperf: 'morissi, morissi, morisse, morissimo, moriste, morissero',
    impAff: 'muori, muori, muoia, moriamo, morite, muoiano',
    gerund: 'morendo',
  }),
  piacere: full('piacere', 'essere', 'piaciuto', {
    pres: 'piaccio, piaci, piace, piacciamo, piacete, piacciono',
    imperf: 'piacevo, piacevi, piaceva, piacevamo, piacevate, piacevano',
    passRem: 'piacqui, piacesti, piacque, piacemmo, piaceste, piacquero',
    futSem: 'piacerò, piacerai, piacerà, piaceremo, piacerete, piaceranno',
    condPres: 'piacerei, piaceresti, piacerebbe, piaceremmo, piacereste, piacerebbero',
    congPres: 'piaccia, piaccia, piaccia, piacciamo, piacciate, piacciano',
    congImperf: 'piacessi, piacessi, piacesse, piacessimo, piaceste, piacessero',
    impAff: 'piaci, piaci, piaccia, piacciamo, piacete, piacciano',
    gerund: 'piacendo',
  }),
});

// ---- spelling changes in -are verbs ----
add({
  cercare: full('cercare', 'avere', 'cercato', {
    pres: 'cerco, cerchi, cerca, cerchiamo, cercate, cercano',
    imperf: 'cercavo, cercavi, cercava, cercavamo, cercavate, cercavano',
    passRem: 'cercai, cercasti, cercò, cercammo, cercaste, cercarono',
    futSem: 'cercherò, cercherai, cercherà, cercheremo, cercherete, cercheranno',
    condPres: 'cercherei, cercheresti, cercherebbe, cercheremmo, cerchereste, cercherebbero',
    congPres: 'cerchi, cerchi, cerchi, cerchiamo, cerchiate, cerchino',
    congImperf: 'cercassi, cercassi, cercasse, cercassimo, cercaste, cercassero',
    impAff: 'cerca, cerca, cerchi, cerchiamo, cercate, cerchino',
    gerund: 'cercando',
  }),
  pagare: full('pagare', 'avere', 'pagato', {
    pres: 'pago, paghi, paga, paghiamo, pagate, pagano',
    imperf: 'pagavo, pagavi, pagava, pagavamo, pagavate, pagavano',
    passRem: 'pagai, pagasti, pagò, pagammo, pagaste, pagarono',
    futSem: 'pagherò, pagherai, pagherà, pagheremo, pagherete, pagheranno',
    condPres: 'pagherei, pagheresti, pagherebbe, pagheremmo, paghereste, pagherebbero',
    congPres: 'paghi, paghi, paghi, paghiamo, paghiate, paghino',
    congImperf: 'pagassi, pagassi, pagasse, pagassimo, pagaste, pagassero',
    impAff: 'paga, paga, paghi, paghiamo, pagate, paghino',
    gerund: 'pagando',
  }),
  cominciare: full('cominciare', 'avere', 'cominciato', {
    pres: 'comincio, cominci, comincia, cominciamo, cominciate, cominciano',
    imperf: 'cominciavo, cominciavi, cominciava, cominciavamo, cominciavate, cominciavano',
    passRem: 'cominciai, cominciasti, cominciò, cominciammo, cominciaste, cominciarono',
    futSem: 'comincerò, comincerai, comincerà, cominceremo, comincerete, cominceranno',
    condPres: 'comincerei, cominceresti, comincerebbe, cominceremmo, comincereste, comincerebbero',
    congPres: 'cominci, cominci, cominci, cominciamo, cominciate, comincino',
    congImperf: 'cominciassi, cominciassi, cominciasse, cominciassimo, cominciaste, cominciassero',
    impAff: 'comincia, comincia, cominci, cominciamo, cominciate, comincino',
    gerund: 'cominciando',
  }),
  mangiare: full('mangiare', 'avere', 'mangiato', {
    pres: 'mangio, mangi, mangia, mangiamo, mangiate, mangiano',
    imperf: 'mangiavo, mangiavi, mangiava, mangiavamo, mangiavate, mangiavano',
    passRem: 'mangiai, mangiasti, mangiò, mangiammo, mangiaste, mangiarono',
    futSem: 'mangerò, mangerai, mangerà, mangeremo, mangerete, mangeranno',
    condPres: 'mangerei, mangeresti, mangerebbe, mangeremmo, mangereste, mangerebbero',
    congPres: 'mangi, mangi, mangi, mangiamo, mangiate, mangino',
    congImperf: 'mangiassi, mangiassi, mangiasse, mangiassimo, mangiaste, mangiassero',
    impAff: 'mangia, mangia, mangi, mangiamo, mangiate, mangino',
    gerund: 'mangiando',
  }),
  studiare: full('studiare', 'avere', 'studiato', {
    pres: 'studio, studi, studia, studiamo, studiate, studiano',
    imperf: 'studiavo, studiavi, studiava, studiavamo, studiavate, studiavano',
    passRem: 'studiai, studiasti, studiò, studiammo, studiaste, studiarono',
    futSem: 'studierò, studierai, studierà, studieremo, studierete, studieranno',
    condPres: 'studierei, studieresti, studierebbe, studieremmo, studiereste, studierebbero',
    congPres: 'studi, studi, studi, studiamo, studiate, studino',
    congImperf: 'studiassi, studiassi, studiasse, studiassimo, studiaste, studiassero',
    impAff: 'studia, studia, studi, studiamo, studiate, studino',
    gerund: 'studiando',
  }),
  inviare: { // stressed i: invii, inviino
    pres: 'invio, invii, invia, inviamo, inviate, inviano',
    futSem: 'invierò, invierai, invierà, invieremo, invierete, invieranno',
    congPres: 'invii, invii, invii, inviamo, inviate, inviino',
    impAff: 'invia, invia, invii, inviamo, inviate, inviino',
    passRem: 'inviai, inviasti, inviò, inviammo, inviaste, inviarono',
    gerund: 'inviando', participle: 'inviato',
  },
  rinviare: { pres: 'rinvio, rinvii, rinvia, rinviamo, rinviate, rinviano', congPres: 'rinvii, rinvii, rinvii, rinviamo, rinviate, rinviino' },
  avviare: { pres: 'avvio, avvii, avvia, avviamo, avviate, avviano', futSem: 'avvierò, avvierai, avvierà, avvieremo, avvierete, avvieranno' },
  sciare: {
    pres: 'scio, scii, scia, sciamo, sciate, sciano',
    futSem: 'scierò, scierai, scierà, scieremo, scierete, scieranno',
    congPres: 'scii, scii, scii, sciamo, sciate, sciino',
    passProx: 'ho sciato, hai sciato, ha sciato, abbiamo sciato, avete sciato, hanno sciato',
  },
  lasciare: {
    pres: 'lascio, lasci, lascia, lasciamo, lasciate, lasciano',
    futSem: 'lascerò, lascerai, lascerà, lasceremo, lascerete, lasceranno',
    condPres: 'lascerei, lasceresti, lascerebbe, lasceremmo, lascereste, lascerebbero',
    congPres: 'lasci, lasci, lasci, lasciamo, lasciate, lascino',
    impAff: 'lascia, lascia, lasci, lasciamo, lasciate, lascino',
    passRem: 'lasciai, lasciasti, lasciò, lasciammo, lasciaste, lasciarono',
    gerund: 'lasciando', participle: 'lasciato',
  },
  sbagliare: {
    pres: 'sbaglio, sbagli, sbaglia, sbagliamo, sbagliate, sbagliano',
    futSem: 'sbaglierò, sbaglierai, sbaglierà, sbaglieremo, sbaglierete, sbaglieranno',
    congPres: 'sbagli, sbagli, sbagli, sbagliamo, sbagliate, sbaglino',
  },
  tagliare: { pres: 'taglio, tagli, taglia, tagliamo, tagliate, tagliano', futSem: 'taglierò, taglierai, taglierà, taglieremo, taglierete, taglieranno' },
  viaggiare: {
    pres: 'viaggio, viaggi, viaggia, viaggiamo, viaggiate, viaggiano',
    futSem: 'viaggerò, viaggerai, viaggerà, viaggeremo, viaggerete, viaggeranno',
    congPres: 'viaggi, viaggi, viaggi, viaggiamo, viaggiate, viaggino',
  },
  cambiare: {
    pres: 'cambio, cambi, cambia, cambiamo, cambiate, cambiano',
    futSem: 'cambierò, cambierai, cambierà, cambieremo, cambierete, cambieranno',
  },
  abbracciare: {
    pres: 'abbraccio, abbracci, abbraccia, abbracciamo, abbracciate, abbracciano',
    futSem: 'abbraccerò, abbraccerai, abbraccerà, abbracceremo, abbraccerete, abbracceranno',
    congPres: 'abbracci, abbracci, abbracci, abbracciamo, abbracciate, abbraccino',
  },
  giocare: {
    pres: 'gioco, giochi, gioca, giochiamo, giocate, giocano',
    futSem: 'giocherò, giocherai, giocherà, giocheremo, giocherete, giocheranno',
    congPres: 'giochi, giochi, giochi, giochiamo, giochiate, giochino',
  },
  spiegare: { pres: 'spiego, spieghi, spiega, spieghiamo, spiegate, spiegano', futSem: 'spiegherò, spiegherai, spiegherà, spiegheremo, spiegherete, spiegheranno' },
  toccare: { pres: 'tocco, tocchi, tocca, tocchiamo, toccate, toccano', congPres: 'tocchi, tocchi, tocchi, tocchiamo, tocchiate, tocchino' },
  dimenticare: { pres: 'dimentico, dimentichi, dimentica, dimentichiamo, dimenticate, dimenticano' },
  bagnare: { pres: 'bagno, bagni, bagna, bagniamo, bagnate, bagnano', futSem: 'bagnerò, bagnerai, bagnerà, bagneremo, bagnerete, bagneranno' },
  sognare: { congPres: 'sogni, sogni, sogni, sogniamo, sogniate, sognino' },
  creare: {
    pres: 'creo, crei, crea, creiamo, create, creano',
    futSem: 'creerò, creerai, creerà, creeremo, creerete, creeranno',
    congPres: 'crei, crei, crei, creiamo, creiate, creino',
    passRem: 'creai, creasti, creò, creammo, creaste, crearono',
    gerund: 'creando', participle: 'creato',
  },
  continuare: {
    pres: 'continuo, continui, continua, continuiamo, continuate, continuano',
    futSem: 'continuerò, continuerai, continuerà, continueremo, continuerete, continueranno',
  },
  comprare: { pres: 'compro, compri, compra, compriamo, comprate, comprano', passProx: 'ho comprato, hai comprato, ha comprato, abbiamo comprato, avete comprato, hanno comprato' },
  arrivare: {
    passProx: 'sono arrivato/a, sei arrivato/a, è arrivato/a, siamo arrivati/e, siete arrivati/e, sono arrivati/e',
    congTrap: 'fossi arrivato/a, fossi arrivato/a, fosse arrivato/a, fossimo arrivati/e, foste arrivati/e, fossero arrivati/e',
    impNeg: 'non arrivare, non arrivare, non arrivi, non arriviamo, non arrivate, non arrivino',
  },
});

// ---- -ere verbs: conoscere, prendere, scrivere, leggere, cadere in full ----
add({
  conoscere: full('conoscere', 'avere', 'conosciuto', {
    pres: 'conosco, conosci, conosce, conosciamo, conoscete, conoscono',
    imperf: 'conoscevo, conoscevi, conosceva, conoscevamo, conoscevate, conoscevano',
    passRem: 'conobbi, conoscesti, conobbe, conoscemmo, conosceste, conobbero',
    futSem: 'conoscerò, conoscerai, conoscerà, conosceremo, conoscerete, conosceranno',
    condPres: 'conoscerei, conosceresti, conoscerebbe, conosceremmo, conoscereste, conoscerebbero',
    congPres: 'conosca, conosca, conosca, conosciamo, conosciate, conoscano',
    congImperf: 'conoscessi, conoscessi, conoscesse, conoscessimo, conosceste, conoscessero',
    impAff: 'conosci, conosci, conosca, conosciamo, conoscete, conoscano',
    gerund: 'conoscendo',
  }),
  prendere: full('prendere', 'avere', 'preso', {
    pres: 'prendo, prendi, prende, prendiamo, prendete, prendono',
    imperf: 'prendevo, prendevi, prendeva, prendevamo, prendevate, prendevano',
    passRem: 'presi, prendesti, prese, prendemmo, prendeste, presero',
    futSem: 'prenderò, prenderai, prenderà, prenderemo, prenderete, prenderanno',
    condPres: 'prenderei, prenderesti, prenderebbe, prenderemmo, prendereste, prenderebbero',
    congPres: 'prenda, prenda, prenda, prendiamo, prendiate, prendano',
    congImperf: 'prendessi, prendessi, prendesse, prendessimo, prendeste, prendessero',
    impAff: 'prendi, prendi, prenda, prendiamo, prendete, prendano',
    gerund: 'prendendo',
  }),
  scrivere: full('scrivere', 'avere', 'scritto', {
    pres: 'scrivo, scrivi, scrive, scriviamo, scrivete, scrivono',
    imperf: 'scrivevo, scrivevi, scriveva, scrivevamo, scrivevate, scrivevano',
    passRem: 'scrissi, scrivesti, scrisse, scrivemmo, scriveste, scrissero',
    futSem: 'scriverò, scriverai, scriverà, scriveremo, scriverete, scriveranno',
    condPres: 'scriverei, scriveresti, scriverebbe, scriveremmo, scrivereste, scriverebbero',
    congPres: 'scriva, scriva, scriva, scriviamo, scriviate, scrivano',
    congImperf: 'scrivessi, scrivessi, scrivesse, scrivessimo, scriveste, scrivessero',
    impAff: 'scrivi, scrivi, scriva, scriviamo, scrivete, scrivano',
    gerund: 'scrivendo',
  }),
  leggere: full('leggere', 'avere', 'letto', {
    pres: 'leggo, leggi, legge, leggiamo, leggete, leggono',
    imperf: 'leggevo, leggevi, leggeva, leggevamo, leggevate, leggevano',
    passRem: 'lessi, leggesti, lesse, leggemmo, leggeste, lessero',
    futSem: 'leggerò, leggerai, leggerà, leggeremo, leggerete, leggeranno',
    condPres: 'leggerei, leggeresti, leggerebbe, leggeremmo, leggereste, leggerebbero',
    congPres: 'legga, legga, legga, leggiamo, leggiate, leggano',
    congImperf: 'leggessi, leggessi, leggesse, leggessimo, leggeste, leggessero',
    impAff: 'leggi, leggi, legga, leggiamo, leggete, leggano',
    gerund: 'leggendo',
  }),
  cadere: full('cadere', 'essere', 'caduto', {
    pres: 'cado, cadi, cade, cadiamo, cadete, cadono',
    imperf: 'cadevo, cadevi, cadeva, cadevamo, cadevate, cadevano',
    passRem: 'caddi, cadesti, cadde, cademmo, cadeste, caddero',
    futSem: 'cadrò, cadrai, cadrà, cadremo, cadrete, cadranno',
    condPres: 'cadrei, cadresti, cadrebbe, cadremmo, cadreste, cadrebbero',
    congPres: 'cada, cada, cada, cadiamo, cadiate, cadano',
    congImperf: 'cadessi, cadessi, cadesse, cadessimo, cadeste, cadessero',
    impAff: 'cadi, cadi, cada, cadiamo, cadete, cadano',
    gerund: 'cadendo',
  }),
  vivere: {
    pres: 'vivo, vivi, vive, viviamo, vivete, vivono',
    passRem: 'vissi, vivesti, visse, vivemmo, viveste, vissero',
    futSem: 'vivrò, vivrai, vivrà, vivremo, vivrete, vivranno',
    condPres: 'vivrei, vivresti, vivrebbe, vivremmo, vivreste, vivrebbero',
    congPres: 'viva, viva, viva, viviamo, viviate, vivano',
    gerund: 'vivendo', participle: 'vissuto',
  },
  rompere: {
    pres: 'rompo, rompi, rompe, rompiamo, rompete, rompono',
    passRem: 'ruppi, rompesti, ruppe, rompemmo, rompeste, ruppero',
    gerund: 'rompendo', participle: 'rotto',
  },
  chiudere: {
    pres: 'chiudo, chiudi, chiude, chiudiamo, chiudete, chiudono',
    passRem: 'chiusi, chiudesti, chiuse, chiudemmo, chiudeste, chiusero',
    congPres: 'chiuda, chiuda, chiuda, chiudiamo, chiudiate, chiudano',
    impAff: 'chiudi, chiudi, chiuda, chiudiamo, chiudete, chiudano',
    gerund: 'chiudendo', participle: 'chiuso',
  },
  decidere: {
    pres: 'decido, decidi, decide, decidiamo, decidete, decidono',
    passRem: 'decisi, decidesti, decise, decidemmo, decideste, decisero',
    futSem: 'deciderò, deciderai, deciderà, decideremo, deciderete, decideranno',
    gerund: 'decidendo', participle: 'deciso',
  },
  rispondere: {
    pres: 'rispondo, rispondi, risponde, rispondiamo, rispondete, rispondono',
    passRem: 'risposi, rispondesti, rispose, rispondemmo, rispondeste, risposero',
    gerund: 'rispondendo', participle: 'risposto',
  },
  correre: {
    pres: 'corro, corri, corre, corriamo, correte, corrono',
    passRem: 'corsi, corresti, corse, corremmo, correste, corsero',
    congPres: 'corra, corra, corra, corriamo, corriate, corrano',
    passProx: 'ho corso, hai corso, ha corso, abbiamo corso, avete corso, hanno corso',
    gerund: 'correndo', participle: 'corso',
  },
  spegnere: {
    pres: 'spengo, spegni, spegne, spegniamo, spegnete, spengono',
    passRem: 'spensi, spegnesti, spense, spegnemmo, spegneste, spensero',
    congPres: 'spenga, spenga, spenga, spegniamo, spegniate, spengano',
    impAff: 'spegni, spegni, spenga, spegniamo, spegnete, spengano',
    gerund: 'spegnendo', participle: 'spento',
  },
  accendere: {
    pres: 'accendo, accendi, accende, accendiamo, accendete, accendono',
    passRem: 'accesi, accendesti, accese, accendemmo, accendeste, accesero',
    gerund: 'accendendo', participle: 'acceso',
  },
  nascere: {
    pres: 'nasco, nasci, nasce, nasciamo, nascete, nascono',
    passRem: 'nacqui, nascesti, nacque, nascemmo, nasceste, nacquero',
    passProx: 'sono nato/a, sei nato/a, è nato/a, siamo nati/e, siete nati/e, sono nati/e',
    congPres: 'nasca, nasca, nasca, nasciamo, nasciate, nascano',
    gerund: 'nascendo', participle: 'nato',
  },
  crescere: {
    pres: 'cresco, cresci, cresce, cresciamo, crescete, crescono',
    passRem: 'crebbi, crescesti, crebbe, crescemmo, cresceste, crebbero',
    passProx: 'sono cresciuto/a, sei cresciuto/a, è cresciuto/a, siamo cresciuti/e, siete cresciuti/e, sono cresciuti/e',
    gerund: 'crescendo', participle: 'cresciuto',
  },
  mettere: {
    pres: 'metto, metti, mette, mettiamo, mettete, mettono',
    passRem: 'misi, mettesti, mise, mettemmo, metteste, misero',
    gerund: 'mettendo', participle: 'messo',
  },
  perdere: {
    pres: 'perdo, perdi, perde, perdiamo, perdete, perdono',
    passRem: 'persi, perdesti, perse, perdemmo, perdeste, persero',
    gerund: 'perdendo', participle: 'perso',
  },
  scendere: {
    pres: 'scendo, scendi, scende, scendiamo, scendete, scendono',
    passRem: 'scesi, scendesti, scese, scendemmo, scendeste, scesero',
    passProx: 'sono sceso/a, sei sceso/a, è sceso/a, siamo scesi/e, siete scesi/e, sono scesi/e',
    gerund: 'scendendo', participle: 'sceso',
  },
  vincere: {
    pres: 'vinco, vinci, vince, vinciamo, vincete, vincono',
    passRem: 'vinsi, vincesti, vinse, vincemmo, vinceste, vinsero',
    congPres: 'vinca, vinca, vinca, vinciamo, vinciate, vincano',
    participle: 'vinto',
  },
  spingere: {
    pres: 'spingo, spingi, spinge, spingiamo, spingete, spingono',
    passRem: 'spinsi, spingesti, spinse, spingemmo, spingeste, spinsero',
    participle: 'spinto',
  },
  piangere: { passRem: 'piansi, piangesti, pianse, piangemmo, piangeste, piansero', participle: 'pianto' },
  giungere: { passRem: 'giunsi, giungesti, giunse, giungemmo, giungeste, giunsero', participle: 'giunto', passProx: 'sono giunto/a, sei giunto/a, è giunto/a, siamo giunti/e, siete giunti/e, sono giunti/e' },
  tacere: {
    pres: 'taccio, taci, tace, tacciamo, tacete, tacciono',
    passRem: 'tacqui, tacesti, tacque, tacemmo, taceste, tacquero',
    congPres: 'taccia, taccia, taccia, tacciamo, tacciate, tacciano',
    participle: 'taciuto',
  },
  giacere: { pres: 'giaccio, giaci, giace, giacciamo, giacete, giacciono', passRem: 'giacqui, giacesti, giacque, giacemmo, giaceste, giacquero', participle: 'giaciuto' },
  valere: {
    pres: 'valgo, vali, vale, valiamo, valete, valgono',
    passRem: 'valsi, valesti, valse, valemmo, valeste, valsero',
    futSem: 'varrò, varrai, varrà, varremo, varrete, varranno',
    congPres: 'valga, valga, valga, valiamo, valiate, valgano',
    participle: 'valso',
  },
  parere: {
    futSem: 'parrò, parrai, parrà, parremo, parrete, parranno',
    condPres: 'parrei, parresti, parrebbe, parremmo, parreste, parrebbero',
    passRem: 'parvi, paresti, parve, paremmo, pareste, parvero',
    participle: 'parso',
  },
  cogliere: {
    pres: 'colgo, cogli, coglie, cogliamo, cogliete, colgono',
    passRem: 'colsi, cogliesti, colse, cogliemmo, coglieste, colsero',
    futSem: 'coglierò, coglierai, coglierà, coglieremo, coglierete, coglieranno',
    congPres: 'colga, colga, colga, cogliamo, cogliate, colgano',
    impAff: 'cogli, cogli, colga, cogliamo, cogliete, colgano',
    gerund: 'cogliendo', participle: 'colto',
  },
  togliere: {
    pres: 'tolgo, togli, toglie, togliamo, togliete, tolgono',
    passRem: 'tolsi, togliesti, tolse, togliemmo, toglieste, tolsero',
    congPres: 'tolga, tolga, tolga, togliamo, togliate, tolgano',
    gerund: 'togliendo', participle: 'tolto',
  },
  sciogliere: {
    pres: 'sciolgo, sciogli, scioglie, sciogliamo, sciogliete, sciolgono',
    passRem: 'sciolsi, sciogliesti, sciolse, sciogliemmo, scioglieste, sciolsero',
    participle: 'sciolto',
  },
});

// ---- -ire verbs with and without -isc- ----
add({
  capire: {
    pres: 'capisco, capisci, capisce, capiamo, capite, capiscono',
    congPres: 'capisca, capisca, capisca, capiamo, capiate, capiscano',
    impAff: 'capisci, capisci, capisca, capiamo, capite, capiscano',
    impNeg: 'non capire, non capire, non capisca, non capiamo, non capite, non capiscano',
    passRem: 'capii, capisti, capì, capimmo, capiste, capirono',
    gerund: 'capendo', participle: 'capito',
  },
  preferire: { pres: 'preferisco, preferisci, preferisce, preferiamo, preferite, preferiscono', participle: 'preferito' },
  costruire: { pres: 'costruisco, costruisci, costruisce, costruiamo, costruite, costruiscono', participle: 'costruito' },
  sparire: {
    pres: 'sparisco, sparisci, sparisce, spariamo, sparite, spariscono',
    passProx: 'sono sparito/a, sei sparito/a, è sparito/a, siamo spariti/e, siete spariti/e, sono spariti/e',
  },
  aprire: {
    pres: 'apro, apri, apre, apriamo, aprite, aprono',
    passRem: 'aprii, apristi, aprì, aprimmo, apriste, aprirono',
    congPres: 'apra, apra, apra, apriamo, apriate, aprano',
    impAff: 'apri, apri, apra, apriamo, aprite, aprano',
    gerund: 'aprendo', participle: 'aperto',
  },
  coprire: { pres: 'copro, copri, copre, copriamo, coprite, coprono', participle: 'coperto' },
  scoprire: { pres: 'scopro, scopri, scopre, scopriamo, scoprite, scoprono', participle: 'scoperto' },
  riaprire: { participle: 'riaperto' },
  ricoprire: { participle: 'ricoperto' },
  offrire: { pres: 'offro, offri, offre, offriamo, offrite, offrono', participle: 'offerto', congPres: 'offra, offra, offra, offriamo, offriate, offrano' },
  soffrire: { pres: 'soffro, soffri, soffre, soffriamo, soffrite, soffrono', participle: 'sofferto' },
  dormire: {
    pres: 'dormo, dormi, dorme, dormiamo, dormite, dormono',
    congPres: 'dorma, dorma, dorma, dormiamo, dormiate, dormano',
    impAff: 'dormi, dormi, dorma, dormiamo, dormite, dormano',
    participle: 'dormito',
  },
  sentire: { pres: 'sento, senti, sente, sentiamo, sentite, sentono', congPres: 'senta, senta, senta, sentiamo, sentiate, sentano' },
  consentire: { pres: 'consento, consenti, consente, consentiamo, consentite, consentono' },
  seguire: { pres: 'seguo, segui, segue, seguiamo, seguite, seguono', congPres: 'segua, segua, segua, seguiamo, seguiate, seguano' },
  fuggire: {
    pres: 'fuggo, fuggi, fugge, fuggiamo, fuggite, fuggono',
    passProx: 'sono fuggito/a, sei fuggito/a, è fuggito/a, siamo fuggiti/e, siete fuggiti/e, sono fuggiti/e',
  },
  vestire: { pres: 'vesto, vesti, veste, vestiamo, vestite, vestono' },
  bollire: { pres: 'bollo, bolli, bolle, bolliamo, bollite, bollono' },
  cucire: {
    pres: 'cucio, cuci, cuce, cuciamo, cucite, cuciono',
    congPres: 'cucia, cucia, cucia, cuciamo, cuciate, cuciano',
    impAff: 'cuci, cuci, cucia, cuciamo, cucite, cuciano',
    gerund: 'cucendo', participle: 'cucito',
  },
  avvertire: { pres: 'avverto, avverti, avverte, avvertiamo, avvertite, avvertono' },
  divertire: { pres: 'diverto, diverti, diverte, divertiamo, divertite, divertono' },
  convertire: { pres: 'converto, converti, converte, convertiamo, convertite, convertono' },
  apparire: {
    pres: 'appaio, appari, appare, appariamo, apparite, appaiono',
    congPres: 'appaia, appaia, appaia, appariamo, appariate, appaiano',
    passProx: 'sono apparso/a, sei apparso/a, è apparso/a, siamo apparsi/e, siete apparsi/e, sono apparsi/e',
    participle: 'apparso',
  },
  scomparire: { pres: 'scompaio, scompari, scompare, scompariamo, scomparite, scompaiono', participle: 'scomparso' },
  riempire: { pres: 'riempio, riempi, riempie, riempiamo, riempite, riempiono', congPres: 'riempia, riempia, riempia, riempiamo, riempiate, riempiano', participle: 'riempito', gerund: 'riempiendo' },
  calare: { passProx: 'sono calato/a, sei calato/a, è calato/a, siamo calati/e, siete calati/e, sono calati/e' },
  ascendere: { passProx: 'sono asceso/a, sei asceso/a, è asceso/a, siamo ascesi/e, siete ascesi/e, sono ascesi/e' },
  decorrere: { passProx: 'sono decorso/a, sei decorso/a, è decorso/a, siamo decorsi/e, siete decorsi/e, sono decorsi/e' },
  scrollare: { passProx: 'ho scrollato, hai scrollato, ha scrollato, abbiamo scrollato, avete scrollato, hanno scrollato' },
  udire: { pres: 'odo, odi, ode, udiamo, udite, odono', congPres: 'oda, oda, oda, udiamo, udiate, odano' },
  riuscire: {
    pres: 'riesco, riesci, riesce, riusciamo, riuscite, riescono',
    passProx: 'sono riuscito/a, sei riuscito/a, è riuscito/a, siamo riusciti/e, siete riusciti/e, sono riusciti/e',
    congPres: 'riesca, riesca, riesca, riusciamo, riusciate, riescano',
  },
  risalire: { pres: 'risalgo, risali, risale, risaliamo, risalite, risalgono' },
  assalire: { pres: 'assalgo, assali, assale, assaliamo, assalite, assalgono', passProx: 'ho assalito, hai assalito, ha assalito, abbiamo assalito, avete assalito, hanno assalito' },
});

// ---- prefix families inherit the irregular base ----
add({
  mantenere: {
    pres: 'mantengo, mantieni, mantiene, manteniamo, mantenete, mantengono',
    passRem: 'mantenni, mantenesti, mantenne, mantenemmo, manteneste, mantennero',
    futSem: 'manterrò, manterrai, manterrà, manterremo, manterrete, manterranno',
    congPres: 'mantenga, mantenga, mantenga, manteniamo, manteniate, mantengano',
    impAff: 'mantieni, mantieni, mantenga, manteniamo, mantenete, mantengano',
    gerund: 'mantenendo', participle: 'mantenuto',
  },
  ottenere: { pres: 'ottengo, ottieni, ottiene, otteniamo, ottenete, ottengono', futSem: 'otterrò, otterrai, otterrà, otterremo, otterrete, otterranno', participle: 'ottenuto' },
  contenere: { pres: 'contengo, contieni, contiene, conteniamo, contenete, contengono', passRem: 'contenni, contenesti, contenne, contenemmo, conteneste, contennero' },
  trattenere: { pres: 'trattengo, trattieni, trattiene, tratteniamo, trattenete, trattengono' },
  sostenere: { pres: 'sostengo, sostieni, sostiene, sosteniamo, sostenete, sostengono', futSem: 'sosterrò, sosterrai, sosterrà, sosterremo, sosterrete, sosterranno' },
  appartenere: {
    pres: 'appartengo, appartieni, appartiene, apparteniamo, appartenete, appartengono',
    passProx: 'sono appartenuto/a, sei appartenuto/a, è appartenuto/a, siamo appartenuti/e, siete appartenuti/e, sono appartenuti/e',
  },
  divenire: {
    pres: 'divengo, divieni, diviene, diveniamo, divenite, divengono',
    passRem: 'divenni, divenisti, divenne, divenimmo, diveniste, divennero',
    futSem: 'diverrò, diverrai, diverrà, diverremo, diverrete, diverranno',
    passProx: 'sono divenuto/a, sei divenuto/a, è divenuto/a, siamo divenuti/e, siete divenuti/e, sono divenuti/e',
    participle: 'divenuto',
  },
  convenire: { pres: 'convengo, convieni, conviene, conveniamo, convenite, convengono', futSem: 'converrò, converrai, converrà, converremo, converrete, converranno' },
  prevenire: {
    pres: 'prevengo, previeni, previene, preveniamo, prevenite, prevengono',
    passProx: 'ho prevenuto, hai prevenuto, ha prevenuto, abbiamo prevenuto, avete prevenuto, hanno prevenuto',
  },
  svenire: { pres: 'svengo, svieni, sviene, sveniamo, svenite, svengono', passProx: 'sono svenuto/a, sei svenuto/a, è svenuto/a, siamo svenuti/e, siete svenuti/e, sono svenuti/e' },
  comporre: {
    pres: 'compongo, componi, compone, componiamo, componete, compongono',
    imperf: 'componevo, componevi, componeva, componevamo, componevate, componevano',
    passRem: 'composi, componesti, compose, componemmo, componeste, composero',
    futSem: 'comporrò, comporrai, comporrà, comporremo, comporrete, comporranno',
    congPres: 'componga, componga, componga, componiamo, componiate, compongano',
    congImperf: 'componessi, componessi, componesse, componessimo, componeste, componessero',
    impAff: 'componi, componi, componga, componiamo, componete, compongano',
    gerund: 'componendo', participle: 'composto',
  },
  proporre: { pres: 'propongo, proponi, propone, proponiamo, proponete, propongono', passRem: 'proposi, proponesti, propose, proponemmo, proponeste, proposero', participle: 'proposto' },
  esporre: { pres: 'espongo, esponi, espone, esponiamo, esponete, espongono', participle: 'esposto', futSem: 'esporrò, esporrai, esporrà, esporremo, esporrete, esporranno' },
  imporre: { pres: 'impongo, imponi, impone, imponiamo, imponete, impongono', participle: 'imposto', passRem: 'imposi, imponesti, impose, imponemmo, imponeste, imposero' },
  supporre: { pres: 'suppongo, supponi, suppone, supponiamo, supponete, suppongono', participle: 'supposto', passRem: 'supposi, supponesti, suppose, supponemmo, supponeste, supposero' },
  opporre: { pres: 'oppongo, opponi, oppone, opponiamo, opponete, oppongono', participle: 'opposto', passRem: 'opposi, opponesti, oppose, opponemmo, opponeste, opposero' },
  disporre: { pres: 'dispongo, disponi, dispone, disponiamo, disponete, dispongono', participle: 'disposto' },
  attrarre: {
    pres: 'attraggo, attrai, attrae, attraiamo, attraete, attraggono',
    passRem: 'attrassi, attraesti, attrasse, attraemmo, attraeste, attrassero',
    futSem: 'attrarrò, attrarrai, attrarrà, attrarremo, attrarrete, attrarranno',
    congPres: 'attragga, attragga, attragga, attraiamo, attraiate, attraggano',
    gerund: 'attraendo', participle: 'attratto',
  },
  estrarre: { pres: 'estraggo, estrai, estrae, estraiamo, estraete, estraggono', participle: 'estratto', passRem: 'estrassi, estraesti, estrasse, estraemmo, estraeste, estrassero' },
  distrarre: { pres: 'distraggo, distrai, distrae, distraiamo, distraete, distraggono', participle: 'distratto' },
  contrarre: { pres: 'contraggo, contrai, contrae, contraiamo, contraete, contraggono', participle: 'contratto' },
  sottrarre: { participle: 'sottratto', passRem: 'sottrassi, sottraesti, sottrasse, sottraemmo, sottraeste, sottrassero' },
  tradurre: {
    pres: 'traduco, traduci, traduce, traduciamo, traducete, traducono',
    passRem: 'tradussi, traducesti, tradusse, traducemmo, traduceste, tradussero',
    futSem: 'tradurrò, tradurrai, tradurrà, tradurremo, tradurrete, tradurranno',
    congPres: 'traduca, traduca, traduca, traduciamo, traduciate, traducano',
    imperf: 'traducevo, traducevi, traduceva, traducevamo, traducevate, traducevano',
    gerund: 'traducendo', participle: 'tradotto',
  },
  produrre: { pres: 'produco, produci, produce, produciamo, producete, producono', passRem: 'produssi, producesti, produsse, producemmo, produceste, produssero', participle: 'prodotto', futSem: 'produrrò, produrrai, produrrà, produrremo, produrrete, produrranno' },
  ridurre: { pres: 'riduco, riduci, riduce, riduciamo, riducete, riducono', passRem: 'ridussi, riducesti, ridusse, riducemmo, riduceste, ridussero', participle: 'ridotto' },
  introdurre: { participle: 'introdotto', passRem: 'introdussi, introducesti, introdusse, introducemmo, introduceste, introdussero' },
  sedurre: { participle: 'sedotto', pres: 'seduco, seduci, seduce, seduciamo, seducete, seducono' },
  predire: {
    pres: 'predico, predici, predice, prediciamo, predite, predicono',
    passRem: 'predissi, predicesti, predisse, predicemmo, prediceste, predissero',
    futSem: 'predirò, predirai, predirà, prediremo, predirete, prediranno',
    congPres: 'predica, predica, predica, prediciamo, prediciate, predicano',
    impAff: 'predici, predici, predica, prediciamo, predite, predicano',
    gerund: 'predicendo', participle: 'predetto',
  },
  ridire: { pres: 'ridico, ridici, ridice, ridiciamo, ridite, ridicono', participle: 'ridetto' },
  contraddire: { pres: 'contraddico, contraddici, contraddice, contraddiciamo, contraddite, contraddicono', passRem: 'contraddissi, contraddicesti, contraddisse, contraddicemmo, contraddiceste, contraddissero', participle: 'contraddetto' },
  maledire: { pres: 'maledico, maledici, maledice, malediciamo, maledite, maledicono', participle: 'maledetto' },
  rifare: {
    pres: 'rifaccio, rifai, rifà, rifacciamo, rifate, rifanno',
    passRem: 'rifeci, rifacesti, rifece, rifacemmo, rifaceste, rifecero',
    futSem: 'rifarò, rifarai, rifarà, rifaremo, rifarete, rifaranno',
    congPres: 'rifaccia, rifaccia, rifaccia, rifacciamo, rifacciate, rifacciano',
    imperf: 'rifacevo, rifacevi, rifaceva, rifacevamo, rifacevate, rifacevano',
    gerund: 'rifacendo', participle: 'rifatto',
  },
  disfare: { pres: 'disfaccio, disfai, disfà, disfacciamo, disfate, disfanno', passRem: 'disfeci, disfacesti, disfece, disfacemmo, disfaceste, disfecero', participle: 'disfatto' },
  contraffare: { pres: 'contraffaccio, contraffai, contraffà, contraffacciamo, contraffate, contraffanno', participle: 'contraffatto' },
  prevedere: { pres: 'prevedo, prevedi, prevede, prevediamo, prevedete, prevedono', passRem: 'previdi, prevedesti, previde, prevedemmo, prevedeste, previdero', participle: 'previsto' },
  rivedere: { passRem: 'rividi, rivedesti, rivide, rivedemmo, rivedeste, rividero', futSem: 'rivedrò, rivedrai, rivedrà, rivedremo, rivedrete, rivedranno', participle: 'rivisto' },
  possedere: { pres: 'possiedo, possiedi, possiede, possediamo, possedete, possiedono', participle: 'posseduto', congPres: 'possieda, possieda, possieda, possediamo, possediate, possiedano' },
});

// ---- strong passato remoto and participle in prefixed relatives ----
// verb: [passato remoto io, tu, lui, noi, voi, loro, participle]
const STRONG_RELATIVES = {
  racchiudere: 'racchiusi racchiudesti racchiuse racchiudemmo racchiudeste racchiusero racchiuso',
  escludere: 'esclusi escludesti escluse escludemmo escludeste esclusero escluso',
  includere: 'inclusi includesti incluse includemmo includeste inclusero incluso',
  concludere: 'conclusi concludesti concluse concludemmo concludeste conclusero concluso',
  uccidere: 'uccisi uccidesti uccise uccidemmo uccideste uccisero ucciso',
  coincidere: 'coincisi coincidesti coincise coincidemmo coincideste coincisero coinciso',
  dividere: 'divisi dividesti divise dividemmo divideste divisero diviso',
  condividere: 'condivisi condividesti condivise condividemmo condivideste condivisero condiviso',
  sorridere: 'sorrisi sorridesti sorrise sorridemmo sorrideste sorrisero sorriso',
  ridere: 'risi ridesti rise ridemmo rideste risero riso',
  descrivere: 'descrissi descrivesti descrisse descrivemmo descriveste descrissero descritto',
  iscrivere: 'iscrissi iscrivesti iscrisse iscrivemmo iscriveste iscrissero iscritto',
  trascrivere: 'trascrissi trascrivesti trascrisse trascrivemmo trascriveste trascrissero trascritto',
  prescrivere: 'prescrissi prescrivesti prescrisse prescrivemmo prescriveste prescrissero prescritto',
  eleggere: 'elessi eleggesti elesse eleggemmo eleggeste elessero eletto',
  rileggere: 'rilessi rileggesti rilesse rileggemmo rileggeste rilessero riletto',
  correggere: 'corressi correggesti corresse correggemmo correggeste corressero corretto',
  proteggere: 'protessi proteggesti protesse proteggemmo proteggeste protessero protetto',
  dirigere: 'diressi dirigesti diresse dirigemmo dirigeste diressero diretto',
  reggere: 'ressi reggesti resse reggemmo reggeste ressero retto',
  comprendere: 'compresi comprendesti comprese comprendemmo comprendeste compresero compreso',
  sorprendere: 'sorpresi sorprendesti sorprese sorprendemmo sorprendeste sorpresero sorpreso',
  apprendere: 'appresi apprendesti apprese apprendemmo apprendeste appresero appreso',
  riprendere: 'ripresi riprendesti riprese riprendemmo riprendeste ripresero ripreso',
  rendere: 'resi rendesti rese rendemmo rendeste resero reso',
  promettere: 'promisi promettesti promise promettemmo prometteste promisero promesso',
  permettere: 'permisi permettesti permise permettemmo permetteste permisero permesso',
  ammettere: 'ammisi ammettesti ammise ammettemmo ammetteste ammisero ammesso',
  rimettere: 'rimisi rimettesti rimise rimettemmo rimetteste rimisero rimesso',
  smettere: 'smisi smettesti smise smettemmo smetteste smisero smesso',
  attendere: 'attesi attendesti attese attendemmo attendeste attesero atteso',
  stendere: 'stesi stendesti stese stendemmo stendeste stesero steso',
  intendere: 'intesi intendesti intese intendemmo intendeste intesero inteso',
  spendere: 'spesi spendesti spese spendemmo spendeste spesero speso',
  sospendere: 'sospesi sospendesti sospese sospendemmo sospendeste sospesero sospeso',
  appendere: 'appesi appendesti appese appendemmo appendeste appesero appeso',
  dipendere: 'dipesi dipendesti dipese dipendemmo dipendeste dipesero dipeso',
  difendere: 'difesi difendesti difese difendemmo difendeste difesero difeso',
  offendere: 'offesi offendesti offese offendemmo offendeste offesero offeso',
  discendere: 'discesi discendesti discese discendemmo discendeste discesero disceso',
  confondere: 'confusi confondesti confuse confondemmo confondeste confusero confuso',
  diffondere: 'diffusi diffondesti diffuse diffondemmo diffondeste diffusero diffuso',
  percorrere: 'percorsi percorresti percorse percorremmo percorreste percorsero percorso',
  trascorrere: 'trascorsi trascorresti trascorse trascorremmo trascorreste trascorsero trascorso',
  soccorrere: 'soccorsi soccorresti soccorse soccorremmo soccorreste soccorsero soccorso',
  ricorrere: 'ricorsi ricorresti ricorse ricorremmo ricorreste ricorsero ricorso',
  corrispondere: 'corrisposi corrispondesti corrispose corrispondemmo corrispondeste corrisposero corrisposto',
  nascondere: 'nascosi nascondesti nascose nascondemmo nascondeste nascosero nascosto',
  interrompere: 'interruppi interrompesti interruppe interrompemmo interrompeste interruppero interrotto',
  corrompere: 'corruppi corrompesti corruppe corrompemmo corrompeste corruppero corrotto',
  riconoscere: 'riconobbi riconoscesti riconobbe riconoscemmo riconosceste riconobbero riconosciuto',
  rinascere: 'rinacqui rinascesti rinacque rinascemmo rinasceste rinacquero rinato',
  decadere: 'decaddi decadesti decadde decademmo decadeste decaddero decaduto',
  ricadere: 'ricaddi ricadesti ricadde ricademmo ricadeste ricaddero ricaduto',
  sopravvivere: 'sopravvissi sopravvivesti sopravvisse sopravvivemmo sopravviveste sopravvissero sopravvissuto',
  dispiacere: 'dispiacqui dispiacesti dispiacque dispiacemmo dispiaceste dispiacquero dispiaciuto',
  accogliere: 'accolsi accogliesti accolse accogliemmo accoglieste accolsero accolto',
  raccogliere: 'raccolsi raccogliesti raccolse raccogliemmo raccoglieste raccolsero raccolto',
  distogliere: 'distolsi distogliesti distolse distogliemmo distoglieste distolsero distolto',
  distruggere: 'distrussi distruggesti distrusse distruggemmo distruggeste distrussero distrutto',
  raggiungere: 'raggiunsi raggiungesti raggiunse raggiungemmo raggiungeste raggiunsero raggiunto',
  aggiungere: 'aggiunsi aggiungesti aggiunse aggiungemmo aggiungeste aggiunsero aggiunto',
  dipingere: 'dipinsi dipingesti dipinse dipingemmo dipingeste dipinsero dipinto',
  fingere: 'finsi fingesti finse fingemmo fingeste finsero finto',
  stringere: 'strinsi stringesti strinse stringemmo stringeste strinsero stretto',
  costringere: 'costrinsi costringesti costrinse costringemmo costringeste costrinsero costretto',
  distinguere: 'distinsi distinguesti distinse distinguemmo distingueste distinsero distinto',
  estinguere: 'estinsi estinguesti estinse estinguemmo estingueste estinsero estinto',
  rivolgere: 'rivolsi rivolgesti rivolse rivolgemmo rivolgeste rivolsero rivolto',
  avvolgere: 'avvolsi avvolgesti avvolse avvolgemmo avvolgeste avvolsero avvolto',
  svolgere: 'svolsi svolgesti svolse svolgemmo svolgeste svolsero svolto',
  sorgere: 'sorsi sorgesti sorse sorgemmo sorgeste sorsero sorto',
  porgere: 'porsi porgesti porse porgemmo porgeste porsero porto',
  spargere: 'sparsi spargesti sparse spargemmo spargeste sparsero sparso',
  convincere: 'convinsi convincesti convinse convincemmo convinceste convinsero convinto',
  torcere: 'torsi torcesti torse torcemmo torceste torsero torto',
  esprimere: 'espressi esprimesti espresse esprimemmo esprimeste espressero espresso',
  comprimere: 'compressi comprimesti compresse comprimemmo comprimeste compressero compresso',
  assumere: 'assunsi assumesti assunse assumemmo assumeste assunsero assunto',
  esplodere: 'esplosi esplodesti esplose esplodemmo esplodeste esplosero esploso',
  espellere: 'espulsi espellesti espulse espellemmo espelleste espulsero espulso',
  risolvere: 'risolsi risolvesti risolse risolvemmo risolveste risolsero risolto',
  discutere: 'discussi discutesti discusse discutemmo discuteste discussero discusso',
  chiedere: 'chiesi chiedesti chiese chiedemmo chiedeste chiesero chiesto',
  richiedere: 'richiesi richiedesti richiese richiedemmo richiedeste richiesero richiesto',
  concedere: 'concessi concedesti concesse concedemmo concedeste concessero concesso',
  leggere: 'lessi leggesti lesse leggemmo leggeste lessero letto',
  emergere: 'emersi emergesti emerse emergemmo emergeste emersero emerso',
  eludere: 'elusi eludesti eluse eludemmo eludeste elusero eluso',
  ardere: 'arsi ardesti arse ardemmo ardeste arsero arso',
  mordere: 'morsi mordesti morse mordemmo mordeste morsero morso',
  radere: 'rasi radesti rase rademmo radeste rasero raso',
  invadere: 'invasi invadesti invase invademmo invadeste invasero invaso',
  persuadere: 'persuasi persuadesti persuase persuademmo persuadeste persuasero persuaso',
  connettere: 'connessi connettesti connesse connettemmo connetteste connessero connesso',
};
{
  const table = {};
  for (const [verb, line] of Object.entries(STRONG_RELATIVES)) {
    const parts = line.split(' ');
    table[verb] = { passRem: parts.slice(0, 6).join(', '), participle: parts[6] };
  }
  // leggere is already above in full: only merge relatives that are not yet expected
  for (const verb of Object.keys(table)) {
    if (Object.hasOwn(EXPECTED, verb)) { // add the checks to the existing entry when they are new
      for (const [tense, want] of Object.entries(table[verb])) {
        if (!Object.hasOwn(EXPECTED[verb], tense)) EXPECTED[verb][tense] = want;
        else if (EXPECTED[verb][tense] !== want) throw new Error(`test.js: conflicting expectation for ${verb}.${tense}`);
      }
    } else EXPECTED[verb] = table[verb];
  }
}

// ---- weather and impersonal verbs: only the 3rd person exists ----
add({
  piovere: {
    pres: '—, —, piove, —, —, —',
    passProx: '—, —, è piovuto, —, —, —',
    imperf: '—, —, pioveva, —, —, —',
    trapProx: '—, —, era piovuto, —, —, —',
    passRem: '—, —, piovve, —, —, —',
    trapRem: '—, —, fu piovuto, —, —, —',
    futSem: '—, —, pioverà, —, —, —',
    futAnt: '—, —, sarà piovuto, —, —, —',
    condPres: '—, —, pioverebbe, —, —, —',
    condPass: '—, —, sarebbe piovuto, —, —, —',
    congPres: '—, —, piova, —, —, —',
    congPass: '—, —, sia piovuto, —, —, —',
    congImperf: '—, —, piovesse, —, —, —',
    congTrap: '—, —, fosse piovuto, —, —, —',
    impAff: '—, —, —, —, —, —',
    impNeg: '—, —, —, —, —, —',
    gerund: 'piovendo', participle: 'piovuto',
  },
  nevicare: {
    pres: '—, —, nevica, —, —, —',
    passProx: '—, —, è nevicato, —, —, —',
    futSem: '—, —, nevicherà, —, —, —',
    congPres: '—, —, nevichi, —, —, —',
    impAff: '—, —, —, —, —, —',
    gerund: 'nevicando', participle: 'nevicato',
  },
  tuonare: { pres: '—, —, tuona, —, —, —', passProx: '—, —, ha tuonato, —, —, —', futSem: '—, —, tuonerà, —, —, —' },
  grandinare: { pres: '—, —, grandina, —, —, —', passRem: '—, —, grandinò, —, —, —', futSem: '—, —, grandinerà, —, —, —' },
  accadere: {
    pres: '—, —, accade, —, —, accadono',
    passProx: '—, —, è accaduto/a, —, —, sono accaduti/e',
    imperf: '—, —, accadeva, —, —, accadevano',
    passRem: '—, —, accadde, —, —, accaddero',
    futSem: '—, —, accadrà, —, —, accadranno',
    condPres: '—, —, accadrebbe, —, —, accadrebbero',
    congPres: '—, —, accada, —, —, accadano',
    congImperf: '—, —, accadesse, —, —, accadessero',
    impAff: '—, —, —, —, —, —',
    gerund: 'accadendo', participle: 'accaduto',
  },
  bastare: {
    pres: '—, —, basta, —, —, bastano',
    passProx: '—, —, è bastato/a, —, —, sono bastati/e',
    passRem: '—, —, bastò, —, —, bastarono',
    futSem: '—, —, basterà, —, —, basteranno',
    congPres: '—, —, basti, —, —, bastino',
    impNeg: '—, —, —, —, —, —',
  },
  occorrere: { pres: '—, —, occorre, —, —, occorrono', passRem: '—, —, occorse, —, —, occorsero', participle: 'occorso' },
  avvenire: { pres: '—, —, avviene, —, —, avvengono', passRem: '—, —, avvenne, —, —, avvennero', futSem: '—, —, avverrà, —, —, avverranno', participle: 'avvenuto' },
  bisognare: { pres: '—, —, bisogna, —, —, —', futSem: '—, —, bisognerà, —, —, —' },
});

// ---- verbs found by scanning the translation chunks ----
add({
  compiere: { // conjugated like compire
    pres: 'compio, compi, compie, compiamo, compite, compiono',
    passRem: 'compii, compisti, compì, compimmo, compiste, compirono',
    congPres: 'compia, compia, compia, compiamo, compiate, compiano',
    gerund: 'compiendo', participle: 'compiuto',
  },
  retrocedere: { passRem: 'retrocessi, retrocedesti, retrocesse, retrocedemmo, retrocedeste, retrocessero', participle: 'retrocesso' },
  redimere: { passRem: 'redensi, redimesti, redense, redimemmo, redimeste, redensero', participle: 'redento' },
  affiggere: { passRem: 'affissi, affiggesti, affisse, affiggemmo, affiggeste, affissero', participle: 'affisso' },
  aspergere: { passRem: 'aspersi, aspergesti, asperse, aspergemmo, aspergeste, aspersero', participle: 'asperso' },
  collidere: { passRem: 'collisi, collidesti, collise, collidemmo, collideste, collisero', participle: 'colliso' },
  disperdere: { passRem: 'dispersi, disperdesti, disperse, disperdemmo, disperdeste, dispersero', participle: 'disperso' },
  disconnettere: { participle: 'disconnesso', passRem: 'disconnessi, disconnettesti, disconnesse, disconnettemmo, disconnetteste, disconnessero' },
  flettere: { passRem: 'flessi, flettesti, flesse, flettemmo, fletteste, flessero', participle: 'flesso' },
  acconsentire: { pres: 'acconsento, acconsenti, acconsente, acconsentiamo, acconsentite, acconsentono' },
  godere: { futSem: 'godrò, godrai, godrà, godremo, godrete, godranno', participle: 'goduto' },
  // a verb without a participle has no compound tenses
  convergere: {
    pres: 'convergo, convergi, converge, convergiamo, convergete, convergono',
    passProx: '—, —, —, —, —, —', trapRem: '—, —, —, —, —, —', congTrap: '—, —, —, —, —, —',
    congPres: 'converga, converga, converga, convergiamo, convergiate, convergano',
    participle: '—',
  },
  // only the 3rd person is used
  dolere: {
    pres: '—, —, duole, —, —, dolgono',
    passProx: '—, —, è doluto/a, —, —, sono doluti/e',
    futSem: '—, —, dorrà, —, —, dorranno',
    congPres: '—, —, dolga, —, —, dolgano',
  },
  prudere: { pres: '—, —, prude, —, —, prudono', imperf: '—, —, prudeva, —, —, prudevano', passProx: '—, —, —, —, —, —' },
});

// stridere is a regular -ere verb, not a relative of ridere (risi)
add({
  stridere: {
    pres: 'strido, stridi, stride, stridiamo, stridete, stridono',
    passRem: 'stridei, stridesti, stridé, stridemmo, strideste, striderono',
  },
  deridere: { passRem: 'derisi, deridesti, derise, deridemmo, derideste, derisero', participle: 'deriso' },
});

// ---- verbs that merely end like an irregular verb must stay regular ----
add({
  mandare: { // not dare
    pres: 'mando, mandi, manda, mandiamo, mandate, mandano',
    passRem: 'mandai, mandasti, mandò, mandammo, mandaste, mandarono',
    futSem: 'manderò, manderai, manderà, manderemo, manderete, manderanno',
    congPres: 'mandi, mandi, mandi, mandiamo, mandiate, mandino',
    impAff: 'manda, manda, mandi, mandiamo, mandate, mandino',
  },
  guardare: { pres: 'guardo, guardi, guarda, guardiamo, guardate, guardano', passRem: 'guardai, guardasti, guardò, guardammo, guardaste, guardarono' },
  ricordare: { futSem: 'ricorderò, ricorderai, ricorderà, ricorderemo, ricorderete, ricorderanno', congImperf: 'ricordassi, ricordassi, ricordasse, ricordassimo, ricordaste, ricordassero' },
  costare: { // not stare: regular, with essere
    pres: 'costo, costi, costa, costiamo, costate, costano',
    passRem: 'costai, costasti, costò, costammo, costaste, costarono',
    futSem: 'costerò, costerai, costerà, costeremo, costerete, costeranno',
    passProx: 'sono costato/a, sei costato/a, è costato/a, siamo costati/e, siete costati/e, sono costati/e',
  },
  restare: { pres: 'resto, resti, resta, restiamo, restate, restano', futSem: 'resterò, resterai, resterà, resteremo, resterete, resteranno' },
  obbedire: { pres: 'obbedisco, obbedisci, obbedisce, obbediamo, obbedite, obbediscono', participle: 'obbedito' }, // not dire
  tradire: { pres: 'tradisco, tradisci, tradisce, tradiamo, tradite, tradiscono', passRem: 'tradii, tradisti, tradì, tradimmo, tradiste, tradirono' },
  tessere: { // not essere
    pres: 'tesso, tessi, tesse, tessiamo, tessete, tessono',
    passRem: 'tessei, tessesti, tessé, tessemmo, tesseste, tesserono',
    participle: 'tessuto', gerund: 'tessendo',
  },
  ricevere: { pres: 'ricevo, ricevi, riceve, riceviamo, ricevete, ricevono', passRem: 'ricevei, ricevesti, ricevé, ricevemmo, riceveste, riceverono', participle: 'ricevuto' },
  temere: { futSem: 'temerò, temerai, temerà, temeremo, temerete, temeranno', participle: 'temuto' },
  ripetere: { passRem: 'ripetei, ripetesti, ripeté, ripetemmo, ripeteste, ripeterono', participle: 'ripetuto' },
  battere: { passRem: 'battei, battesti, batté, battemmo, batteste, batterono', participle: 'battuto' },
  competere: { pres: 'competo, competi, compete, competiamo, competete, competono' }, // not potere
  assorbire: { participle: 'assorbito' },
  applaudire: { pres: 'applaudisco, applaudisci, applaudisce, applaudiamo, applaudite, applaudiscono' },
  smentire: { pres: 'smentisco, smentisci, smentisce, smentiamo, smentite, smentiscono' }, // mentire has no -isc-
  mentire: { pres: 'mento, menti, mente, mentiamo, mentite, mentono' },
  presiedere: { pres: 'presiedo, presiedi, presiede, presiediamo, presiedete, presiedono', passRem: 'presiedei, presiedesti, presiedé, presiedemmo, presiedeste, presiederono' },
});

// ---- found by the assembly audits ----
// pungere was treated as a regular -ere verb (pungei, punguto); restringere had the
// passato remoto of ristringere.
add({
  pungere: {
    pres: 'pungo, pungi, punge, pungiamo, pungete, pungono',
    passRem: 'punsi, pungesti, punse, pungemmo, pungeste, punsero',
    participle: 'punto',
  },
  restringere: {
    passRem: 'restrinsi, restringesti, restrinse, restringemmo, restringeste, restrinsero',
    participle: 'ristretto',
  },
});

// [more tests go above this line]

const FORM_KEYS = [
  'pres', 'passProx', 'imperf', 'trapProx', 'passRem', 'trapRem', 'futSem', 'futAnt',
  'condPres', 'condPass', 'congPres', 'congPass', 'congImperf', 'congTrap', 'impAff', 'impNeg',
];

const report = createReport();
checkParadigms(report, EXPECTED, conjugate);

// Input that is not a verb this engine can conjugate must be refused, not guessed at.
for (const input of [
  '', '   ', 'hello', 'xyz', 'lavarsi', 'sedersi', "dell'", '123', 'constructor', 'toString', '__proto__',
  'mare', 'sire', 'parlar', 'parlato', 'ire', 'are', 'solere', 'pentire', 'torre', 'esimere', 'ergere',
]) {
  report.checks += 1;
  if (conjugate(input) !== null) report.fail(`conjugate(${JSON.stringify(input)}) should be null`);
}
// Case and surrounding spaces are ignored.
report.checks += 1;
if (!conjugate('  Parlare ') || conjugate('  Parlare ').inf !== 'parlare') report.fail('conjugate("  Parlare ") should normalise to parlare');

// Every result has exactly the 16 keys in order, six strings each.
const SAMPLE = [
  'parlare', 'credere', 'finire', 'essere', 'avere', 'andare', 'fare', 'dire', 'porre', 'condurre', 'trarre',
  'potere', 'piovere', 'accadere', 'bastare', 'rimanere', 'apparire', 'sapere',
];
for (const verb of SAMPLE) {
  const result = conjugate(verb);
  report.checks += 1;
  if (!result) { report.fail(`${verb}: null`); continue; }
  if (result.inf !== verb) report.fail(`${verb}: inf is ${result.inf}`);
  if (Object.keys(result.forms).join() !== FORM_KEYS.join()) report.fail(`${verb}: wrong form keys ${Object.keys(result.forms)}`);
  for (const key of FORM_KEYS) {
    const forms = result.forms[key];
    if (!Array.isArray(forms) || forms.length !== 6 || forms.some(f => typeof f !== 'string' || !f)) {
      report.fail(`${verb}.${key}: not six strings: ${JSON.stringify(forms)}`);
    }
  }
}

// Auxiliary: essere in every compound row (with -o/-a, -i/-e agreement), avere otherwise.
const ESSERE_SAMPLE = `
  andare venire arrivare partire entrare uscire salire scendere cadere nascere morire stare restare
  rimanere diventare divenire tornare ritornare costare durare piacere sembrare parere riuscire svenire
  risalire rinascere scomparire sparire convenire dispiacere decadere
  accedere emigrare ricrescere scaturire sgorgare subentrare straripare scattare sbiadire divampare balzare annegare
  scorrere rotolare sgusciare evadere affondare guarire`.trim().split(/\s+/);
const AVERE_SAMPLE = `
  parlare credere finire avere fare dire potere volere dovere sapere vedere bere porre tenere scegliere
  prendere scrivere leggere vivere correre prevenire assalire conoscere cercare mangiare studiare
  aprire capire dormire sentire
  spuntare affogare pungere restringere aggirare`.trim().split(/\s+/);
const COMPOUND_KEYS = ['passProx', 'trapProx', 'trapRem', 'futAnt', 'condPass', 'congPass', 'congTrap'];
for (const verb of [...ESSERE_SAMPLE, ...AVERE_SAMPLE]) {
  const result = conjugate(verb);
  const essere = ESSERE_SAMPLE.includes(verb);
  report.checks += 1;
  if (!result) { report.fail(`${verb}: null`); continue; }
  const part = result.participle;
  for (const key of COMPOUND_KEYS) {
    result.forms[key].forEach((form, i) => {
      const want = essere ? new RegExp(`^\\S+ ${part}/a$|^\\S+ ${part.slice(0, -1)}i/e$`) : new RegExp(`^\\S+ ${part}$`);
      const agreement = essere && (i < 3 ? form.endsWith(`${part}/a`) : form.endsWith(`${part.slice(0, -1)}i/e`));
      if (!want.test(form) || (essere && !agreement)) report.fail(`${verb}.${key}[${i}]: bad compound form "${form}"`);
    });
  }
  const first = result.forms.passProx[0].split(' ')[0];
  if (first !== (essere ? 'sono' : 'ho')) report.fail(`${verb}: wrong auxiliary in "${result.forms.passProx[0]}"`);
}

// Every verb in the database must conjugate into well-formed output.
const italianCount = checkInflectedDatabase(report, {
  verbs: VERBS,
  conjugate,
  lang: 'it',
  formKeys: FORM_KEYS,
  gerund: /(ando|endo)$/,
  participle: /(to|so|—)$/, // — = a verb without a participle (convergere)
});

// Translations the audits removed because they conjugate differently from the sense
// that was meant. They must not come back.
const REMOVED = {
  ripartire: 'conjugates as "set off again" (riparto, essere), not as "divide up" (ripartisco, avere)',
  brusire: 'rare; could not be verified',
  tiritare: 'could not be verified as an Italian verb',
};
for (const [english, entries] of Object.entries(VERBS)) {
  for (const entry of entries) {
    report.checks += 1;
    if (Object.hasOwn(REMOVED, entry.it)) report.fail(`${english}: ${entry.it} must not be used (${REMOVED[entry.it]})`);
  }
}

// One auxiliary per Italian verb: an English verb must not be paired with an Italian verb
// whose auxiliary is wrong for the sense (a transitive use of an essere verb, or the reverse).
const WRONG_AUXILIARY = [
  ['peel', 'sgusciare'], ['miss', 'mancare'], ['scan', 'scorrere'], ['skim', 'scorrere'], ['swipe', 'scorrere'],
  ['rear', 'crescere'], ['evade', 'evadere'], ['cure', 'guarire'], ['immerse', 'affondare'], ['thrust', 'affondare'],
  ['relegate', 'retrocedere'], ['protrude', 'spuntare'], ['show up', 'spuntare'],
];
for (const [english, italian] of WRONG_AUXILIARY) {
  report.checks += 1;
  if ((VERBS[english] || []).some(entry => entry.it === italian)) report.fail(`${english}: ${italian} has the wrong auxiliary for this sense`);
}

report.finish(`${report.checks} paradigm checks, ${Object.keys(VERBS).length} English verbs, ${italianCount} Italian translations`);
