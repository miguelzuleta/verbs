// Run with: node test.js
// Checks the conjugation engine against known paradigms, then runs every
// Portuguese verb in verbs.js through it to catch crashes and malformed output.
const { conjugate, NONE } = require('./conjugate.js');
const { VERBS } = require('./verbs.js');
const { createReport, checkParadigms, checkInflectedDatabase } = require('../shared/test-kit.js');

// The 19 keys of every result, in order.
const FORM_KEYS = [
  'pres', 'pret', 'imperf', 'mqp', 'fut', 'cond',
  'perfComp', 'mqpComp', 'futComp', 'condComp',
  'subjPres', 'subjImperf', 'subjFut', 'subjPerf', 'subjMqp', 'subjFutComp',
  'impAff', 'impNeg', 'infPess',
];

// The compound tenses are the forms of ter followed by the participle. The forms
// of ter are written out here, independently of the engine.
const TER = {
  perfComp: 'tenho tens tem temos tendes têm',
  mqpComp: 'tinha tinhas tinha tínhamos tínheis tinham',
  futComp: 'terei terás terá teremos tereis terão',
  condComp: 'teria terias teria teríamos teríeis teriam',
  subjPerf: 'tenha tenhas tenha tenhamos tenhais tenham',
  subjMqp: 'tivesse tivesses tivesse tivéssemos tivésseis tivessem',
  subjFutComp: 'tiver tiveres tiver tivermos tiverdes tiverem',
};
const compounds = participle => Object.fromEntries(Object.entries(TER).map(([key, aux]) =>
  [key, aux.split(' ').map(form => `${form} ${participle}`).join(', ')]));

// verb -> { tense: 'eu, tu, ele, nós, vós, eles' }  (gerund / participle as plain strings)
const EXPECTED = {
  falar: {
    pres: 'falo, falas, fala, falamos, falais, falam',
    pret: 'falei, falaste, falou, falamos, falastes, falaram',
    imperf: 'falava, falavas, falava, falávamos, faláveis, falavam',
    mqp: 'falara, falaras, falara, faláramos, faláreis, falaram',
    fut: 'falarei, falarás, falará, falaremos, falareis, falarão',
    cond: 'falaria, falarias, falaria, falaríamos, falaríeis, falariam',
    perfComp: 'tenho falado, tens falado, tem falado, temos falado, tendes falado, têm falado',
    mqpComp: 'tinha falado, tinhas falado, tinha falado, tínhamos falado, tínheis falado, tinham falado',
    futComp: 'terei falado, terás falado, terá falado, teremos falado, tereis falado, terão falado',
    condComp: 'teria falado, terias falado, teria falado, teríamos falado, teríeis falado, teriam falado',
    subjPres: 'fale, fales, fale, falemos, faleis, falem',
    subjImperf: 'falasse, falasses, falasse, falássemos, falásseis, falassem',
    subjFut: 'falar, falares, falar, falarmos, falardes, falarem',
    subjPerf: 'tenha falado, tenhas falado, tenha falado, tenhamos falado, tenhais falado, tenham falado',
    subjMqp: 'tivesse falado, tivesses falado, tivesse falado, tivéssemos falado, tivésseis falado, tivessem falado',
    subjFutComp: 'tiver falado, tiveres falado, tiver falado, tivermos falado, tiverdes falado, tiverem falado',
    impAff: 'fala, fala, fale, falemos, falai, falem',
    impNeg: 'não fales, não fales, não fale, não falemos, não faleis, não falem',
    infPess: 'falar, falares, falar, falarmos, falardes, falarem',
    gerund: 'falando', participle: 'falado',
  },
  comer: {
    pres: 'como, comes, come, comemos, comeis, comem',
    pret: 'comi, comeste, comeu, comemos, comestes, comeram',
    imperf: 'comia, comias, comia, comíamos, comíeis, comiam',
    mqp: 'comera, comeras, comera, comêramos, comêreis, comeram',
    fut: 'comerei, comerás, comerá, comeremos, comereis, comerão',
    cond: 'comeria, comerias, comeria, comeríamos, comeríeis, comeriam',
    subjPres: 'coma, comas, coma, comamos, comais, comam',
    subjImperf: 'comesse, comesses, comesse, comêssemos, comêsseis, comessem',
    subjFut: 'comer, comeres, comer, comermos, comerdes, comerem',
    impAff: 'come, come, coma, comamos, comei, comam',
    impNeg: 'não comas, não comas, não coma, não comamos, não comais, não comam',
    infPess: 'comer, comeres, comer, comermos, comerdes, comerem',
    gerund: 'comendo', participle: 'comido',
  },
  partir: {
    pres: 'parto, partes, parte, partimos, partis, partem',
    pret: 'parti, partiste, partiu, partimos, partistes, partiram',
    imperf: 'partia, partias, partia, partíamos, partíeis, partiam',
    mqp: 'partira, partiras, partira, partíramos, partíreis, partiram',
    fut: 'partirei, partirás, partirá, partiremos, partireis, partirão',
    cond: 'partiria, partirias, partiria, partiríamos, partiríeis, partiriam',
    subjPres: 'parta, partas, parta, partamos, partais, partam',
    subjImperf: 'partisse, partisses, partisse, partíssemos, partísseis, partissem',
    subjFut: 'partir, partires, partir, partirmos, partirdes, partirem',
    impAff: 'parte, parte, parta, partamos, parti, partam',
    impNeg: 'não partas, não partas, não parta, não partamos, não partais, não partam',
    infPess: 'partir, partires, partir, partirmos, partirdes, partirem',
    gerund: 'partindo', participle: 'partido',
  },
  ser: {
    pres: 'sou, és, é, somos, sois, são',
    pret: 'fui, foste, foi, fomos, fostes, foram',
    imperf: 'era, eras, era, éramos, éreis, eram',
    mqp: 'fora, foras, fora, fôramos, fôreis, foram',
    fut: 'serei, serás, será, seremos, sereis, serão',
    cond: 'seria, serias, seria, seríamos, seríeis, seriam',
    subjPres: 'seja, sejas, seja, sejamos, sejais, sejam',
    subjImperf: 'fosse, fosses, fosse, fôssemos, fôsseis, fossem',
    subjFut: 'for, fores, for, formos, fordes, forem',
    impAff: 'sê, sê, seja, sejamos, sede, sejam',
    impNeg: 'não sejas, não sejas, não seja, não sejamos, não sejais, não sejam',
    infPess: 'ser, seres, ser, sermos, serdes, serem',
    gerund: 'sendo', participle: 'sido',
  },
  estar: {
    pres: 'estou, estás, está, estamos, estais, estão',
    pret: 'estive, estiveste, esteve, estivemos, estivestes, estiveram',
    imperf: 'estava, estavas, estava, estávamos, estáveis, estavam',
    mqp: 'estivera, estiveras, estivera, estivéramos, estivéreis, estiveram',
    fut: 'estarei, estarás, estará, estaremos, estareis, estarão',
    cond: 'estaria, estarias, estaria, estaríamos, estaríeis, estariam',
    subjPres: 'esteja, estejas, esteja, estejamos, estejais, estejam',
    subjImperf: 'estivesse, estivesses, estivesse, estivéssemos, estivésseis, estivessem',
    subjFut: 'estiver, estiveres, estiver, estivermos, estiverdes, estiverem',
    impAff: 'está, está, esteja, estejamos, estai, estejam',
    impNeg: 'não estejas, não estejas, não esteja, não estejamos, não estejais, não estejam',
    infPess: 'estar, estares, estar, estarmos, estardes, estarem',
    gerund: 'estando', participle: 'estado',
  },
  ter: {
    pres: 'tenho, tens, tem, temos, tendes, têm',
    pret: 'tive, tiveste, teve, tivemos, tivestes, tiveram',
    imperf: 'tinha, tinhas, tinha, tínhamos, tínheis, tinham',
    mqp: 'tivera, tiveras, tivera, tivéramos, tivéreis, tiveram',
    fut: 'terei, terás, terá, teremos, tereis, terão',
    cond: 'teria, terias, teria, teríamos, teríeis, teriam',
    subjPres: 'tenha, tenhas, tenha, tenhamos, tenhais, tenham',
    subjImperf: 'tivesse, tivesses, tivesse, tivéssemos, tivésseis, tivessem',
    subjFut: 'tiver, tiveres, tiver, tivermos, tiverdes, tiverem',
    impAff: 'tem, tem, tenha, tenhamos, tende, tenham',
    impNeg: 'não tenhas, não tenhas, não tenha, não tenhamos, não tenhais, não tenham',
    infPess: 'ter, teres, ter, termos, terdes, terem',
    gerund: 'tendo', participle: 'tido',
  },
  haver: {
    pres: 'hei, hás, há, havemos, haveis, hão',
    pret: 'houve, houveste, houve, houvemos, houvestes, houveram',
    imperf: 'havia, havias, havia, havíamos, havíeis, haviam',
    mqp: 'houvera, houveras, houvera, houvéramos, houvéreis, houveram',
    fut: 'haverei, haverás, haverá, haveremos, havereis, haverão',
    cond: 'haveria, haverias, haveria, haveríamos, haveríeis, haveriam',
    subjPres: 'haja, hajas, haja, hajamos, hajais, hajam',
    subjImperf: 'houvesse, houvesses, houvesse, houvéssemos, houvésseis, houvessem',
    subjFut: 'houver, houveres, houver, houvermos, houverdes, houverem',
    impNeg: 'não hajas, não hajas, não haja, não hajamos, não hajais, não hajam',
    infPess: 'haver, haveres, haver, havermos, haverdes, haverem',
    gerund: 'havendo', participle: 'havido',
  },
  ir: {
    pres: 'vou, vais, vai, vamos, ides, vão',
    pret: 'fui, foste, foi, fomos, fostes, foram',
    imperf: 'ia, ias, ia, íamos, íeis, iam',
    mqp: 'fora, foras, fora, fôramos, fôreis, foram',
    fut: 'irei, irás, irá, iremos, ireis, irão',
    cond: 'iria, irias, iria, iríamos, iríeis, iriam',
    subjPres: 'vá, vás, vá, vamos, vades, vão',
    subjImperf: 'fosse, fosses, fosse, fôssemos, fôsseis, fossem',
    subjFut: 'for, fores, for, formos, fordes, forem',
    impAff: 'vai, vai, vá, vamos, ide, vão',
    impNeg: 'não vás, não vás, não vá, não vamos, não vades, não vão',
    infPess: 'ir, ires, ir, irmos, irdes, irem',
    gerund: 'indo', participle: 'ido',
  },
  vir: {
    pres: 'venho, vens, vem, vimos, vindes, vêm',
    pret: 'vim, vieste, veio, viemos, viestes, vieram',
    imperf: 'vinha, vinhas, vinha, vínhamos, vínheis, vinham',
    mqp: 'viera, vieras, viera, viéramos, viéreis, vieram',
    fut: 'virei, virás, virá, viremos, vireis, virão',
    cond: 'viria, virias, viria, viríamos, viríeis, viriam',
    subjPres: 'venha, venhas, venha, venhamos, venhais, venham',
    subjImperf: 'viesse, viesses, viesse, viéssemos, viésseis, viessem',
    subjFut: 'vier, vieres, vier, viermos, vierdes, vierem',
    impAff: 'vem, vem, venha, venhamos, vinde, venham',
    impNeg: 'não venhas, não venhas, não venha, não venhamos, não venhais, não venham',
    infPess: 'vir, vires, vir, virmos, virdes, virem',
    gerund: 'vindo', participle: 'vindo',
  },
  ver: {
    pres: 'vejo, vês, vê, vemos, vedes, veem',
    pret: 'vi, viste, viu, vimos, vistes, viram',
    imperf: 'via, vias, via, víamos, víeis, viam',
    mqp: 'vira, viras, vira, víramos, víreis, viram',
    fut: 'verei, verás, verá, veremos, vereis, verão',
    cond: 'veria, verias, veria, veríamos, veríeis, veriam',
    subjPres: 'veja, vejas, veja, vejamos, vejais, vejam',
    subjImperf: 'visse, visses, visse, víssemos, vísseis, vissem',
    subjFut: 'vir, vires, vir, virmos, virdes, virem',
    impAff: 'vê, vê, veja, vejamos, vede, vejam',
    impNeg: 'não vejas, não vejas, não veja, não vejamos, não vejais, não vejam',
    infPess: 'ver, veres, ver, vermos, verdes, verem',
    gerund: 'vendo', participle: 'visto',
  },
  dar: {
    pres: 'dou, dás, dá, damos, dais, dão',
    pret: 'dei, deste, deu, demos, destes, deram',
    imperf: 'dava, davas, dava, dávamos, dáveis, davam',
    mqp: 'dera, deras, dera, déramos, déreis, deram',
    fut: 'darei, darás, dará, daremos, dareis, darão',
    cond: 'daria, darias, daria, daríamos, daríeis, dariam',
    subjPres: 'dê, dês, dê, demos, deis, deem',
    subjImperf: 'desse, desses, desse, déssemos, désseis, dessem',
    subjFut: 'der, deres, der, dermos, derdes, derem',
    impAff: 'dá, dá, dê, demos, dai, deem',
    impNeg: 'não dês, não dês, não dê, não demos, não deis, não deem',
    infPess: 'dar, dares, dar, darmos, dardes, darem',
    gerund: 'dando', participle: 'dado',
  },
  saber: {
    pres: 'sei, sabes, sabe, sabemos, sabeis, sabem',
    pret: 'soube, soubeste, soube, soubemos, soubestes, souberam',
    imperf: 'sabia, sabias, sabia, sabíamos, sabíeis, sabiam',
    mqp: 'soubera, souberas, soubera, soubéramos, soubéreis, souberam',
    fut: 'saberei, saberás, saberá, saberemos, sabereis, saberão',
    cond: 'saberia, saberias, saberia, saberíamos, saberíeis, saberiam',
    subjPres: 'saiba, saibas, saiba, saibamos, saibais, saibam',
    subjImperf: 'soubesse, soubesses, soubesse, soubéssemos, soubésseis, soubessem',
    subjFut: 'souber, souberes, souber, soubermos, souberdes, souberem',
    impAff: 'sabe, sabe, saiba, saibamos, sabei, saibam',
    impNeg: 'não saibas, não saibas, não saiba, não saibamos, não saibais, não saibam',
    infPess: 'saber, saberes, saber, sabermos, saberdes, saberem',
    gerund: 'sabendo', participle: 'sabido',
  },
  poder: {
    pres: 'posso, podes, pode, podemos, podeis, podem',
    pret: 'pude, pudeste, pôde, pudemos, pudestes, puderam',
    imperf: 'podia, podias, podia, podíamos, podíeis, podiam',
    mqp: 'pudera, puderas, pudera, pudéramos, pudéreis, puderam',
    fut: 'poderei, poderás, poderá, poderemos, podereis, poderão',
    cond: 'poderia, poderias, poderia, poderíamos, poderíeis, poderiam',
    subjPres: 'possa, possas, possa, possamos, possais, possam',
    subjImperf: 'pudesse, pudesses, pudesse, pudéssemos, pudésseis, pudessem',
    subjFut: 'puder, puderes, puder, pudermos, puderdes, puderem',
    impNeg: 'não possas, não possas, não possa, não possamos, não possais, não possam',
    infPess: 'poder, poderes, poder, podermos, poderdes, poderem',
    gerund: 'podendo', participle: 'podido',
  },
  querer: {
    pres: 'quero, queres, quer, queremos, quereis, querem',
    pret: 'quis, quiseste, quis, quisemos, quisestes, quiseram',
    imperf: 'queria, querias, queria, queríamos, queríeis, queriam',
    mqp: 'quisera, quiseras, quisera, quiséramos, quiséreis, quiseram',
    fut: 'quererei, quererás, quererá, quereremos, querereis, quererão',
    cond: 'quereria, quererias, quereria, quereríamos, quereríeis, quereriam',
    subjPres: 'queira, queiras, queira, queiramos, queirais, queiram',
    subjImperf: 'quisesse, quisesses, quisesse, quiséssemos, quisésseis, quisessem',
    subjFut: 'quiser, quiseres, quiser, quisermos, quiserdes, quiserem',
    impNeg: 'não queiras, não queiras, não queira, não queiramos, não queirais, não queiram',
    infPess: 'querer, quereres, querer, querermos, quererdes, quererem',
    gerund: 'querendo', participle: 'querido',
  },
  fazer: {
    pres: 'faço, fazes, faz, fazemos, fazeis, fazem',
    pret: 'fiz, fizeste, fez, fizemos, fizestes, fizeram',
    imperf: 'fazia, fazias, fazia, fazíamos, fazíeis, faziam',
    mqp: 'fizera, fizeras, fizera, fizéramos, fizéreis, fizeram',
    fut: 'farei, farás, fará, faremos, fareis, farão',
    cond: 'faria, farias, faria, faríamos, faríeis, fariam',
    subjPres: 'faça, faças, faça, façamos, façais, façam',
    subjImperf: 'fizesse, fizesses, fizesse, fizéssemos, fizésseis, fizessem',
    subjFut: 'fizer, fizeres, fizer, fizermos, fizerdes, fizerem',
    impAff: 'faz, faz, faça, façamos, fazei, façam',
    impNeg: 'não faças, não faças, não faça, não façamos, não façais, não façam',
    infPess: 'fazer, fazeres, fazer, fazermos, fazerdes, fazerem',
    gerund: 'fazendo', participle: 'feito',
  },
  dizer: {
    pres: 'digo, dizes, diz, dizemos, dizeis, dizem',
    pret: 'disse, disseste, disse, dissemos, dissestes, disseram',
    imperf: 'dizia, dizias, dizia, dizíamos, dizíeis, diziam',
    mqp: 'dissera, disseras, dissera, disséramos, disséreis, disseram',
    fut: 'direi, dirás, dirá, diremos, direis, dirão',
    cond: 'diria, dirias, diria, diríamos, diríeis, diriam',
    subjPres: 'diga, digas, diga, digamos, digais, digam',
    subjImperf: 'dissesse, dissesses, dissesse, disséssemos, dissésseis, dissessem',
    subjFut: 'disser, disseres, disser, dissermos, disserdes, disserem',
    impAff: 'diz, diz, diga, digamos, dizei, digam',
    impNeg: 'não digas, não digas, não diga, não digamos, não digais, não digam',
    infPess: 'dizer, dizeres, dizer, dizermos, dizerdes, dizerem',
    gerund: 'dizendo', participle: 'dito',
  },
  trazer: {
    pres: 'trago, trazes, traz, trazemos, trazeis, trazem',
    pret: 'trouxe, trouxeste, trouxe, trouxemos, trouxestes, trouxeram',
    imperf: 'trazia, trazias, trazia, trazíamos, trazíeis, traziam',
    mqp: 'trouxera, trouxeras, trouxera, trouxéramos, trouxéreis, trouxeram',
    fut: 'trarei, trarás, trará, traremos, trareis, trarão',
    cond: 'traria, trarias, traria, traríamos, traríeis, trariam',
    subjPres: 'traga, tragas, traga, tragamos, tragais, tragam',
    subjImperf: 'trouxesse, trouxesses, trouxesse, trouxéssemos, trouxésseis, trouxessem',
    subjFut: 'trouxer, trouxeres, trouxer, trouxermos, trouxerdes, trouxerem',
    impAff: 'traz, traz, traga, tragamos, trazei, tragam',
    impNeg: 'não tragas, não tragas, não traga, não tragamos, não tragais, não tragam',
    infPess: 'trazer, trazeres, trazer, trazermos, trazerdes, trazerem',
    gerund: 'trazendo', participle: 'trazido',
  },
  pôr: {
    pres: 'ponho, pões, põe, pomos, pondes, põem',
    pret: 'pus, puseste, pôs, pusemos, pusestes, puseram',
    imperf: 'punha, punhas, punha, púnhamos, púnheis, punham',
    mqp: 'pusera, puseras, pusera, puséramos, puséreis, puseram',
    fut: 'porei, porás, porá, poremos, poreis, porão',
    cond: 'poria, porias, poria, poríamos, poríeis, poriam',
    subjPres: 'ponha, ponhas, ponha, ponhamos, ponhais, ponham',
    subjImperf: 'pusesse, pusesses, pusesse, puséssemos, pusésseis, pusessem',
    subjFut: 'puser, puseres, puser, pusermos, puserdes, puserem',
    impAff: 'põe, põe, ponha, ponhamos, ponde, ponham',
    impNeg: 'não ponhas, não ponhas, não ponha, não ponhamos, não ponhais, não ponham',
    infPess: 'pôr, pores, pôr, pormos, pordes, porem',
    gerund: 'pondo', participle: 'posto',
  },
  ler: {
    pres: 'leio, lês, lê, lemos, ledes, leem',
    pret: 'li, leste, leu, lemos, lestes, leram',
    imperf: 'lia, lias, lia, líamos, líeis, liam',
    mqp: 'lera, leras, lera, lêramos, lêreis, leram',
    fut: 'lerei, lerás, lerá, leremos, lereis, lerão',
    cond: 'leria, lerias, leria, leríamos, leríeis, leriam',
    subjPres: 'leia, leias, leia, leiamos, leiais, leiam',
    subjImperf: 'lesse, lesses, lesse, lêssemos, lêsseis, lessem',
    subjFut: 'ler, leres, ler, lermos, lerdes, lerem',
    impAff: 'lê, lê, leia, leiamos, lede, leiam',
    impNeg: 'não leias, não leias, não leia, não leiamos, não leiais, não leiam',
    infPess: 'ler, leres, ler, lermos, lerdes, lerem',
    gerund: 'lendo', participle: 'lido',
  },
  crer: {
    pres: 'creio, crês, crê, cremos, credes, creem',
    pret: 'cri, creste, creu, cremos, crestes, creram',
    imperf: 'cria, crias, cria, críamos, críeis, criam',
    mqp: 'crera, creras, crera, crêramos, crêreis, creram',
    fut: 'crerei, crerás, crerá, creremos, crereis, crerão',
    cond: 'creria, crerias, creria, creríamos, creríeis, creriam',
    subjPres: 'creia, creias, creia, creiamos, creiais, creiam',
    subjImperf: 'cresse, cresses, cresse, crêssemos, crêsseis, cressem',
    subjFut: 'crer, creres, crer, crermos, crerdes, crerem',
    impAff: 'crê, crê, creia, creiamos, crede, creiam',
    impNeg: 'não creias, não creias, não creia, não creiamos, não creiais, não creiam',
    infPess: 'crer, creres, crer, crermos, crerdes, crerem',
    gerund: 'crendo', participle: 'crido',
  },
  rir: {
    pres: 'rio, ris, ri, rimos, rides, riem',
    pret: 'ri, riste, riu, rimos, ristes, riram',
    imperf: 'ria, rias, ria, ríamos, ríeis, riam',
    mqp: 'rira, riras, rira, ríramos, ríreis, riram',
    fut: 'rirei, rirás, rirá, riremos, rireis, rirão',
    cond: 'riria, ririas, riria, riríamos, riríeis, ririam',
    subjPres: 'ria, rias, ria, riamos, riais, riam',
    subjImperf: 'risse, risses, risse, ríssemos, rísseis, rissem',
    subjFut: 'rir, rires, rir, rirmos, rirdes, rirem',
    impAff: 'ri, ri, ria, riamos, ride, riam',
    impNeg: 'não rias, não rias, não ria, não riamos, não riais, não riam',
    infPess: 'rir, rires, rir, rirmos, rirdes, rirem',
    gerund: 'rindo', participle: 'rido',
  },
  sair: {
    pres: 'saio, sais, sai, saímos, saís, saem',
    pret: 'saí, saíste, saiu, saímos, saístes, saíram',
    imperf: 'saía, saías, saía, saíamos, saíeis, saíam',
    mqp: 'saíra, saíras, saíra, saíramos, saíreis, saíram',
    fut: 'sairei, sairás, sairá, sairemos, saireis, sairão',
    cond: 'sairia, sairias, sairia, sairíamos, sairíeis, sairiam',
    subjPres: 'saia, saias, saia, saiamos, saiais, saiam',
    subjImperf: 'saísse, saísses, saísse, saíssemos, saísseis, saíssem',
    subjFut: 'sair, saíres, sair, sairmos, sairdes, saírem',
    impAff: 'sai, sai, saia, saiamos, saí, saiam',
    impNeg: 'não saias, não saias, não saia, não saiamos, não saiais, não saiam',
    infPess: 'sair, saíres, sair, sairmos, sairdes, saírem',
    gerund: 'saindo', participle: 'saído',
  },
  cair: {
    pres: 'caio, cais, cai, caímos, caís, caem',
    pret: 'caí, caíste, caiu, caímos, caístes, caíram',
    imperf: 'caía, caías, caía, caíamos, caíeis, caíam',
    mqp: 'caíra, caíras, caíra, caíramos, caíreis, caíram',
    fut: 'cairei, cairás, cairá, cairemos, caireis, cairão',
    cond: 'cairia, cairias, cairia, cairíamos, cairíeis, cairiam',
    subjPres: 'caia, caias, caia, caiamos, caiais, caiam',
    subjImperf: 'caísse, caísses, caísse, caíssemos, caísseis, caíssem',
    subjFut: 'cair, caíres, cair, cairmos, cairdes, caírem',
    impAff: 'cai, cai, caia, caiamos, caí, caiam',
    impNeg: 'não caias, não caias, não caia, não caiamos, não caiais, não caiam',
    infPess: 'cair, caíres, cair, cairmos, cairdes, caírem',
    gerund: 'caindo', participle: 'caído',
  },
  ouvir: {
    pres: 'ouço, ouves, ouve, ouvimos, ouvis, ouvem',
    pret: 'ouvi, ouviste, ouviu, ouvimos, ouvistes, ouviram',
    imperf: 'ouvia, ouvias, ouvia, ouvíamos, ouvíeis, ouviam',
    mqp: 'ouvira, ouviras, ouvira, ouvíramos, ouvíreis, ouviram',
    fut: 'ouvirei, ouvirás, ouvirá, ouviremos, ouvireis, ouvirão',
    subjPres: 'ouça, ouças, ouça, ouçamos, ouçais, ouçam',
    subjImperf: 'ouvisse, ouvisses, ouvisse, ouvíssemos, ouvísseis, ouvissem',
    subjFut: 'ouvir, ouvires, ouvir, ouvirmos, ouvirdes, ouvirem',
    impAff: 'ouve, ouve, ouça, ouçamos, ouvi, ouçam',
    impNeg: 'não ouças, não ouças, não ouça, não ouçamos, não ouçais, não ouçam',
    infPess: 'ouvir, ouvires, ouvir, ouvirmos, ouvirdes, ouvirem',
    gerund: 'ouvindo', participle: 'ouvido',
  },
  pedir: {
    pres: 'peço, pedes, pede, pedimos, pedis, pedem',
    pret: 'pedi, pediste, pediu, pedimos, pedistes, pediram',
    imperf: 'pedia, pedias, pedia, pedíamos, pedíeis, pediam',
    mqp: 'pedira, pediras, pedira, pedíramos, pedíreis, pediram',
    fut: 'pedirei, pedirás, pedirá, pediremos, pedireis, pedirão',
    subjPres: 'peça, peças, peça, peçamos, peçais, peçam',
    subjImperf: 'pedisse, pedisses, pedisse, pedíssemos, pedísseis, pedissem',
    subjFut: 'pedir, pedires, pedir, pedirmos, pedirdes, pedirem',
    impAff: 'pede, pede, peça, peçamos, pedi, peçam',
    impNeg: 'não peças, não peças, não peça, não peçamos, não peçais, não peçam',
    infPess: 'pedir, pedires, pedir, pedirmos, pedirdes, pedirem',
    gerund: 'pedindo', participle: 'pedido',
  },
  dormir: {
    pres: 'durmo, dormes, dorme, dormimos, dormis, dormem',
    pret: 'dormi, dormiste, dormiu, dormimos, dormistes, dormiram',
    imperf: 'dormia, dormias, dormia, dormíamos, dormíeis, dormiam',
    mqp: 'dormira, dormiras, dormira, dormíramos, dormíreis, dormiram',
    fut: 'dormirei, dormirás, dormirá, dormiremos, dormireis, dormirão',
    subjPres: 'durma, durmas, durma, durmamos, durmais, durmam',
    subjImperf: 'dormisse, dormisses, dormisse, dormíssemos, dormísseis, dormissem',
    subjFut: 'dormir, dormires, dormir, dormirmos, dormirdes, dormirem',
    impAff: 'dorme, dorme, durma, durmamos, dormi, durmam',
    impNeg: 'não durmas, não durmas, não durma, não durmamos, não durmais, não durmam',
    infPess: 'dormir, dormires, dormir, dormirmos, dormirdes, dormirem',
    gerund: 'dormindo', participle: 'dormido',
  },
  seguir: {
    pres: 'sigo, segues, segue, seguimos, seguis, seguem',
    pret: 'segui, seguiste, seguiu, seguimos, seguistes, seguiram',
    imperf: 'seguia, seguias, seguia, seguíamos, seguíeis, seguiam',
    mqp: 'seguira, seguiras, seguira, seguíramos, seguíreis, seguiram',
    fut: 'seguirei, seguirás, seguirá, seguiremos, seguireis, seguirão',
    subjPres: 'siga, sigas, siga, sigamos, sigais, sigam',
    subjImperf: 'seguisse, seguisses, seguisse, seguíssemos, seguísseis, seguissem',
    subjFut: 'seguir, seguires, seguir, seguirmos, seguirdes, seguirem',
    impAff: 'segue, segue, siga, sigamos, segui, sigam',
    impNeg: 'não sigas, não sigas, não siga, não sigamos, não sigais, não sigam',
    infPess: 'seguir, seguires, seguir, seguirmos, seguirdes, seguirem',
    gerund: 'seguindo', participle: 'seguido',
  },

  // ---- spelling changes: -car / -çar / -gar before e ----
  tocar: {
    pres: 'toco, tocas, toca, tocamos, tocais, tocam',
    pret: 'toquei, tocaste, tocou, tocamos, tocastes, tocaram',
    subjPres: 'toque, toques, toque, toquemos, toqueis, toquem',
    impAff: 'toca, toca, toque, toquemos, tocai, toquem',
    impNeg: 'não toques, não toques, não toque, não toquemos, não toqueis, não toquem',
    gerund: 'tocando', participle: 'tocado',
  },
  ficar: {
    pret: 'fiquei, ficaste, ficou, ficamos, ficastes, ficaram',
    subjPres: 'fique, fiques, fique, fiquemos, fiqueis, fiquem',
  },
  começar: {
    pres: 'começo, começas, começa, começamos, começais, começam',
    pret: 'comecei, começaste, começou, começamos, começastes, começaram',
    subjPres: 'comece, comeces, comece, comecemos, comeceis, comecem',
    impNeg: 'não comeces, não comeces, não comece, não comecemos, não comeceis, não comecem',
  },
  almoçar: {
    pres: 'almoço, almoças, almoça, almoçamos, almoçais, almoçam',
    pret: 'almocei, almoçaste, almoçou, almoçamos, almoçastes, almoçaram',
    subjPres: 'almoce, almoces, almoce, almocemos, almoceis, almocem',
  },
  pagar: {
    pres: 'pago, pagas, paga, pagamos, pagais, pagam',
    pret: 'paguei, pagaste, pagou, pagamos, pagastes, pagaram',
    subjPres: 'pague, pagues, pague, paguemos, pagueis, paguem',
    impAff: 'paga, paga, pague, paguemos, pagai, paguem',
    gerund: 'pagando', participle: 'pago',
  },
  chegar: {
    pret: 'cheguei, chegaste, chegou, chegamos, chegastes, chegaram',
    subjPres: 'chegue, chegues, chegue, cheguemos, chegueis, cheguem',
    impNeg: 'não chegues, não chegues, não chegue, não cheguemos, não chegueis, não cheguem',
    participle: 'chegado',
  },

  // ---- spelling changes: -ger / -gir / -guer / -guir / -cer ----
  proteger: {
    pres: 'protejo, proteges, protege, protegemos, protegeis, protegem',
    pret: 'protegi, protegeste, protegeu, protegemos, protegestes, protegeram',
    subjPres: 'proteja, protejas, proteja, protejamos, protejais, protejam',
    impAff: 'protege, protege, proteja, protejamos, protegei, protejam',
    impNeg: 'não protejas, não protejas, não proteja, não protejamos, não protejais, não protejam',
  },
  dirigir: {
    pres: 'dirijo, diriges, dirige, dirigimos, dirigis, dirigem',
    pret: 'dirigi, dirigiste, dirigiu, dirigimos, dirigistes, dirigiram',
    subjPres: 'dirija, dirijas, dirija, dirijamos, dirijais, dirijam',
    impAff: 'dirige, dirige, dirija, dirijamos, dirigi, dirijam',
  },
  exigir: { pres: 'exijo, exiges, exige, exigimos, exigis, exigem' },
  surgir: { pres: 'surjo, surges, surge, surgimos, surgis, surgem', subjPres: 'surja, surjas, surja, surjamos, surjais, surjam' },
  fingir: { pres: 'finjo, finges, finge, fingimos, fingis, fingem' },
  agir: { pres: 'ajo, ages, age, agimos, agis, agem' },
  erguer: {
    pres: 'ergo, ergues, ergue, erguemos, ergueis, erguem',
    pret: 'ergui, ergueste, ergueu, erguemos, erguestes, ergueram',
    subjPres: 'erga, ergas, erga, ergamos, ergais, ergam',
  },
  distinguir: {
    pres: 'distingo, distingues, distingue, distinguimos, distinguis, distinguem',
    pret: 'distingui, distinguiste, distinguiu, distinguimos, distinguistes, distinguiram',
    subjPres: 'distinga, distingas, distinga, distingamos, distingais, distingam',
  },
  conhecer: {
    pres: 'conheço, conheces, conhece, conhecemos, conheceis, conhecem',
    pret: 'conheci, conheceste, conheceu, conhecemos, conhecestes, conheceram',
    subjPres: 'conheça, conheças, conheça, conheçamos, conheçais, conheçam',
    impAff: 'conhece, conhece, conheça, conheçamos, conhecei, conheçam',
    impNeg: 'não conheças, não conheças, não conheça, não conheçamos, não conheçais, não conheçam',
  },
  vencer: {
    pres: 'venço, vences, vence, vencemos, venceis, vencem',
    subjPres: 'vença, venças, vença, vençamos, vençais, vençam',
  },
  crescer: { pres: 'cresço, cresces, cresce, crescemos, cresceis, crescem' },
  nascer: { pres: 'nasço, nasces, nasce, nascemos, nasceis, nascem' },
  esquecer: { pres: 'esqueço, esqueces, esquece, esquecemos, esqueceis, esquecem', subjPres: 'esqueça, esqueças, esqueça, esqueçamos, esqueçais, esqueçam' },
  conduzir: {
    pres: 'conduzo, conduzes, conduz, conduzimos, conduzis, conduzem',
    pret: 'conduzi, conduziste, conduziu, conduzimos, conduzistes, conduziram',
    subjPres: 'conduza, conduzas, conduza, conduzamos, conduzais, conduzam',
    impAff: 'conduz, conduz, conduza, conduzamos, conduzi, conduzam',
  },
  produzir: { pres: 'produzo, produzes, produz, produzimos, produzis, produzem' },
  reduzir: { pres: 'reduzo, reduzes, reduz, reduzimos, reduzis, reduzem', participle: 'reduzido' },

  // ---- -ear, -iar (regular and MIRIA), -oar, -uar ----
  passear: {
    pres: 'passeio, passeias, passeia, passeamos, passeais, passeiam',
    pret: 'passeei, passeaste, passeou, passeamos, passeastes, passearam',
    imperf: 'passeava, passeavas, passeava, passeávamos, passeáveis, passeavam',
    subjPres: 'passeie, passeies, passeie, passeemos, passeeis, passeiem',
    impAff: 'passeia, passeia, passeie, passeemos, passeai, passeiem',
    impNeg: 'não passeies, não passeies, não passeie, não passeemos, não passeeis, não passeiem',
    gerund: 'passeando', participle: 'passeado',
  },
  odiar: {
    pres: 'odeio, odeias, odeia, odiamos, odiais, odeiam',
    pret: 'odiei, odiaste, odiou, odiamos, odiastes, odiaram',
    subjPres: 'odeie, odeies, odeie, odiemos, odieis, odeiem',
    impAff: 'odeia, odeia, odeie, odiemos, odiai, odeiem',
  },
  mediar: { pres: 'medeio, medeias, medeia, mediamos, mediais, medeiam', subjPres: 'medeie, medeies, medeie, mediemos, medieis, medeiem' },
  ansiar: { pres: 'anseio, anseias, anseia, ansiamos, ansiais, anseiam' },
  remediar: { pres: 'remedeio, remedeias, remedeia, remediamos, remediais, remedeiam' },
  incendiar: { pres: 'incendeio, incendeias, incendeia, incendiamos, incendiais, incendeiam' },
  copiar: {
    pres: 'copio, copias, copia, copiamos, copiais, copiam',
    pret: 'copiei, copiaste, copiou, copiamos, copiastes, copiaram',
    subjPres: 'copie, copies, copie, copiemos, copieis, copiem',
    impAff: 'copia, copia, copie, copiemos, copiai, copiem',
  },
  voar: {
    pres: 'voo, voas, voa, voamos, voais, voam',
    pret: 'voei, voaste, voou, voamos, voastes, voaram',
    subjPres: 'voe, voes, voe, voemos, voeis, voem',
    mqp: 'voara, voaras, voara, voáramos, voáreis, voaram',
  },
  perdoar: { pres: 'perdoo, perdoas, perdoa, perdoamos, perdoais, perdoam', pret: 'perdoei, perdoaste, perdoou, perdoamos, perdoastes, perdoaram' },
  continuar: {
    pres: 'continuo, continuas, continua, continuamos, continuais, continuam',
    pret: 'continuei, continuaste, continuou, continuamos, continuastes, continuaram',
    subjPres: 'continue, continues, continue, continuemos, continueis, continuem',
  },
  atuar: { pres: 'atuo, atuas, atua, atuamos, atuais, atuam' },

  // ---- -air / -oer / -uir ----
  construir: {
    pres: 'construo, constróis, constrói, construímos, construís, constroem',
    pret: 'construí, construíste, construiu, construímos, construístes, construíram',
    imperf: 'construía, construías, construía, construíamos, construíeis, construíam',
    mqp: 'construíra, construíras, construíra, construíramos, construíreis, construíram',
    subjPres: 'construa, construas, construa, construamos, construais, construam',
    subjImperf: 'construísse, construísses, construísse, construíssemos, construísseis, construíssem',
    subjFut: 'construir, construíres, construir, construirmos, construirdes, construírem',
    impAff: 'constrói, constrói, construa, construamos, construí, construam',
    infPess: 'construir, construíres, construir, construirmos, construirdes, construírem',
    gerund: 'construindo', participle: 'construído',
  },
  destruir: { pres: 'destruo, destróis, destrói, destruímos, destruís, destroem', participle: 'destruído' },
  atribuir: { pres: 'atribuo, atribuis, atribui, atribuímos, atribuís, atribuem', pret: 'atribuí, atribuíste, atribuiu, atribuímos, atribuístes, atribuíram' },
  incluir: { pres: 'incluo, incluis, inclui, incluímos, incluís, incluem', participle: 'incluído' },
  doer: {
    pres: '—, —, dói, —, —, doem',
    pret: '—, —, doeu, —, —, doeram',
    imperf: '—, —, doía, —, —, doíam',
    subjPres: '—, —, doa, —, —, doam',
    impAff: '—, —, —, —, —, —',
    gerund: 'doendo', participle: 'doído',
  },
  moer: {
    pres: 'moo, móis, mói, moemos, moeis, moem',
    pret: 'moí, moeste, moeu, moemos, moestes, moeram',
    imperf: 'moía, moías, moía, moíamos, moíeis, moíam',
    participle: 'moído',
  },
  trair: { pres: 'traio, trais, trai, traímos, traís, traem', pret: 'traí, traíste, traiu, traímos, traístes, traíram', participle: 'traído' },
  atrair: {
    pres: 'atraio, atrais, atrai, atraímos, atraís, atraem',
    pret: 'atraí, atraíste, atraiu, atraímos, atraístes, atraíram',
    subjImperf: 'atraísse, atraísses, atraísse, atraíssemos, atraísseis, atraíssem',
    subjFut: 'atrair, atraíres, atrair, atrairmos, atrairdes, atraírem',
    gerund: 'atraindo', participle: 'atraído',
  },
  distrair: { pres: 'distraio, distrais, distrai, distraímos, distraís, distraem', participle: 'distraído' },
  extrair: { pres: 'extraio, extrais, extrai, extraímos, extraís, extraem', participle: 'extraído' },
  subtrair: { pres: 'subtraio, subtrais, subtrai, subtraímos, subtraís, subtraem', participle: 'subtraído' },

  // ---- hiatus accent: proibir, reunir, saudar, arruinar, enraizar ----
  proibir: {
    pres: 'proíbo, proíbes, proíbe, proibimos, proibis, proíbem',
    subjPres: 'proíba, proíbas, proíba, proibamos, proibais, proíbam',
    pret: 'proibi, proibiste, proibiu, proibimos, proibistes, proibiram',
  },
  reunir: { pres: 'reúno, reúnes, reúne, reunimos, reunis, reúnem', subjPres: 'reúna, reúnas, reúna, reunamos, reunais, reúnam' },
  saudar: { pres: 'saúdo, saúdas, saúda, saudamos, saudais, saúdam' },
  arruinar: { pres: 'arruíno, arruínas, arruína, arruinamos, arruinais, arruínam' },
  enraizar: { pres: 'enraízo, enraízas, enraíza, enraizamos, enraizais, enraízam' },
  tuitar: { pres: 'tuíto, tuítas, tuíta, tuitamos, tuitais, tuítam', subjPres: 'tuíte, tuítes, tuíte, tuitemos, tuiteis, tuítem' },

  // ---- other irregular verbs ----
  caber: {
    pres: 'caibo, cabes, cabe, cabemos, cabeis, cabem',
    pret: 'coube, coubeste, coube, coubemos, coubestes, couberam',
    subjPres: 'caiba, caibas, caiba, caibamos, caibais, caibam',
    participle: 'cabido',
  },
  valer: {
    pres: 'valho, vales, vale, valemos, valeis, valem',
    subjPres: 'valha, valhas, valha, valhamos, valhais, valham',
    participle: 'valido',
  },
  requerer: {
    pres: 'requeiro, requeres, requer, requeremos, requereis, requerem',
    pret: 'requeri, requereste, requereu, requeremos, requerestes, requereram',
    subjPres: 'requeira, requeiras, requeira, requeiramos, requeirais, requeiram',
  },
  perder: {
    pres: 'perco, perdes, perde, perdemos, perdeis, perdem',
    pret: 'perdi, perdeste, perdeu, perdemos, perdestes, perderam',
    subjPres: 'perca, percas, perca, percamos, percais, percam',
    participle: 'perdido',
  },
  jazer: { pres: 'jazo, jazes, jaz, jazemos, jazeis, jazem' },
  prover: {
    pres: 'provejo, provês, provê, provemos, provedes, proveem',
    pret: 'provi, proveste, proveu, provemos, provestes, proveram',
    subjPres: 'proveja, provejas, proveja, provejamos, provejais, provejam',
    participle: 'provido',
  },

  // ---- stem changes ----
  medir: { pres: 'meço, medes, mede, medimos, medis, medem', subjPres: 'meça, meças, meça, meçamos, meçais, meçam' },
  despedir: { pres: 'despeço, despedes, despede, despedimos, despedis, despedem', pret: 'despedi, despediste, despediu, despedimos, despedistes, despediram' },
  impedir: { pres: 'impeço, impedes, impede, impedimos, impedis, impedem', subjPres: 'impeça, impeças, impeça, impeçamos, impeçais, impeçam' },
  preferir: {
    pres: 'prefiro, preferes, prefere, preferimos, preferis, preferem',
    pret: 'preferi, preferiste, preferiu, preferimos, preferistes, preferiram',
    subjPres: 'prefira, prefiras, prefira, prefiramos, prefirais, prefiram',
    impAff: 'prefere, prefere, prefira, prefiramos, preferi, prefiram',
  },
  sentir: { pres: 'sinto, sentes, sente, sentimos, sentis, sentem', subjPres: 'sinta, sintas, sinta, sintamos, sintais, sintam' },
  servir: { pres: 'sirvo, serves, serve, servimos, servis, servem', subjPres: 'sirva, sirvas, sirva, sirvamos, sirvais, sirvam' },
  vestir: { pres: 'visto, vestes, veste, vestimos, vestis, vestem', subjPres: 'vista, vistas, vista, vistamos, vistais, vistam' },
  repetir: { pres: 'repito, repetes, repete, repetimos, repetis, repetem', subjPres: 'repita, repitas, repita, repitamos, repitais, repitam' },
  mentir: { pres: 'minto, mentes, mente, mentimos, mentis, mentem' },
  divertir: { pres: 'divirto, divertes, diverte, divertimos, divertis, divertem' },
  sugerir: { pres: 'sugiro, sugeres, sugere, sugerimos, sugeris, sugerem', subjPres: 'sugira, sugiras, sugira, sugiramos, sugirais, sugiram' },
  ferir: { pres: 'firo, feres, fere, ferimos, feris, ferem' },
  competir: { pres: 'compito, competes, compete, competimos, competis, competem' },
  conseguir: {
    pres: 'consigo, consegues, consegue, conseguimos, conseguis, conseguem',
    pret: 'consegui, conseguiste, conseguiu, conseguimos, conseguistes, conseguiram',
    subjPres: 'consiga, consigas, consiga, consigamos, consigais, consigam',
  },
  perseguir: { pres: 'persigo, persegues, persegue, perseguimos, perseguis, perseguem' },
  cobrir: {
    pres: 'cubro, cobres, cobre, cobrimos, cobris, cobrem',
    subjPres: 'cubra, cubras, cubra, cubramos, cubrais, cubram',
    gerund: 'cobrindo', participle: 'coberto',
  },
  descobrir: { pres: 'descubro, descobres, descobre, descobrimos, descobris, descobrem', participle: 'descoberto' },
  tossir: { pres: 'tusso, tosses, tosse, tossimos, tossis, tossem' },
  engolir: { pres: 'engulo, engoles, engole, engolimos, engolis, engolem' },
  subir: { pres: 'subo, sobes, sobe, subimos, subis, sobem', subjPres: 'suba, subas, suba, subamos, subais, subam', impAff: 'sobe, sobe, suba, subamos, subi, subam' },
  fugir: { pres: 'fujo, foges, foge, fugimos, fugis, fogem', subjPres: 'fuja, fujas, fuja, fujamos, fujais, fujam' },
  cuspir: { pres: 'cuspo, cospes, cospe, cuspimos, cuspis, cospem' },
  sacudir: { pres: 'sacudo, sacodes, sacode, sacudimos, sacudis, sacodem' },
  consumir: { pres: 'consumo, consomes, consome, consumimos, consumis, consomem' },
  sumir: { pres: 'sumo, somes, some, sumimos, sumis, somem' },

  // ---- prefix families: pôr, ter, vir, ver, fazer, dizer ----
  compor: {
    pres: 'componho, compões, compõe, compomos, compondes, compõem',
    pret: 'compus, compuseste, compôs, compusemos, compusestes, compuseram',
    imperf: 'compunha, compunhas, compunha, compúnhamos, compúnheis, compunham',
    fut: 'comporei, comporás, comporá, comporemos, comporeis, comporão',
    subjPres: 'componha, componhas, componha, componhamos, componhais, componham',
    subjImperf: 'compusesse, compusesses, compusesse, compuséssemos, compusésseis, compusessem',
    subjFut: 'compuser, compuseres, compuser, compusermos, compuserdes, compuserem',
    impAff: 'compõe, compõe, componha, componhamos, componde, componham',
    infPess: 'compor, compores, compor, compormos, compordes, comporem',
    gerund: 'compondo', participle: 'composto',
  },
  expor: {
    pres: 'exponho, expões, expõe, expomos, expondes, expõem',
    pret: 'expus, expuseste, expôs, expusemos, expusestes, expuseram',
    gerund: 'expondo', participle: 'exposto',
  },
  propor: {
    pres: 'proponho, propões, propõe, propomos, propondes, propõem',
    pret: 'propus, propuseste, propôs, propusemos, propusestes, propuseram',
    participle: 'proposto',
  },
  impor: { pret: 'impus, impuseste, impôs, impusemos, impusestes, impuseram', subjPres: 'imponha, imponhas, imponha, imponhamos, imponhais, imponham', participle: 'imposto' },
  supor: { pres: 'suponho, supões, supõe, supomos, supondes, supõem', participle: 'suposto' },
  dispor: { pres: 'disponho, dispões, dispõe, dispomos, dispondes, dispõem', pret: 'dispus, dispuseste, dispôs, dispusemos, dispusestes, dispuseram', participle: 'disposto' },
  repor: { pret: 'repus, repuseste, repôs, repusemos, repusestes, repuseram', participle: 'reposto' },
  opor: { pres: 'oponho, opões, opõe, opomos, opondes, opõem', pret: 'opus, opuseste, opôs, opusemos, opusestes, opuseram', participle: 'oposto' },
  conter: {
    pres: 'contenho, conténs, contém, contemos, contendes, contêm',
    pret: 'contive, contiveste, conteve, contivemos, contivestes, contiveram',
    imperf: 'continha, continhas, continha, contínhamos, contínheis, continham',
    subjPres: 'contenha, contenhas, contenha, contenhamos, contenhais, contenham',
    subjImperf: 'contivesse, contivesses, contivesse, contivéssemos, contivésseis, contivessem',
    impAff: 'contém, contém, contenha, contenhamos, contende, contenham',
    gerund: 'contendo', participle: 'contido',
  },
  manter: {
    pres: 'mantenho, manténs, mantém, mantemos, mantendes, mantêm',
    pret: 'mantive, mantiveste, manteve, mantivemos, mantivestes, mantiveram',
    impAff: 'mantém, mantém, mantenha, mantenhamos, mantende, mantenham',
    participle: 'mantido',
  },
  obter: {
    pres: 'obtenho, obténs, obtém, obtemos, obtendes, obtêm',
    pret: 'obtive, obtiveste, obteve, obtivemos, obtivestes, obtiveram',
    participle: 'obtido',
  },
  deter: { pres: 'detenho, deténs, detém, detemos, detendes, detêm', pret: 'detive, detiveste, deteve, detivemos, detivestes, detiveram' },
  reter: { pres: 'retenho, reténs, retém, retemos, retendes, retêm' },
  entreter: { pres: 'entretenho, entreténs, entretém, entretemos, entretendes, entretêm', participle: 'entretido' },
  convir: {
    pres: 'convenho, convéns, convém, convimos, convindes, convêm',
    pret: 'convim, convieste, conveio, conviemos, conviestes, convieram',
    imperf: 'convinha, convinhas, convinha, convínhamos, convínheis, convinham',
    subjPres: 'convenha, convenhas, convenha, convenhamos, convenhais, convenham',
    impAff: 'convém, convém, convenha, convenhamos, convinde, convenham',
    gerund: 'convindo', participle: 'convindo',
  },
  intervir: {
    pres: 'intervenho, intervéns, intervém, intervimos, intervindes, intervêm',
    pret: 'intervim, intervieste, interveio, interviemos, interviestes, intervieram',
    participle: 'intervindo',
  },
  provir: { pres: 'provenho, provéns, provém, provimos, provindes, provêm', pret: 'provim, provieste, proveio, proviemos, proviestes, provieram' },
  prever: {
    pres: 'prevejo, prevês, prevê, prevemos, prevedes, preveem',
    pret: 'previ, previste, previu, previmos, previstes, previram',
    imperf: 'previa, previas, previa, prevíamos, prevíeis, previam',
    subjPres: 'preveja, prevejas, preveja, prevejamos, prevejais, prevejam',
    subjImperf: 'previsse, previsses, previsse, prevíssemos, prevísseis, previssem',
    subjFut: 'previr, previres, previr, previrmos, previrdes, previrem',
    impAff: 'prevê, prevê, preveja, prevejamos, prevede, prevejam',
    gerund: 'prevendo', participle: 'previsto',
  },
  rever: { pres: 'revejo, revês, revê, revemos, revedes, reveem', pret: 'revi, reviste, reviu, revimos, revistes, reviram', participle: 'revisto' },
  antever: { pres: 'antevejo, antevês, antevê, antevemos, antevedes, anteveem', participle: 'antevisto' },
  desfazer: {
    pres: 'desfaço, desfazes, desfaz, desfazemos, desfazeis, desfazem',
    pret: 'desfiz, desfizeste, desfez, desfizemos, desfizestes, desfizeram',
    fut: 'desfarei, desfarás, desfará, desfaremos, desfareis, desfarão',
    subjPres: 'desfaça, desfaças, desfaça, desfaçamos, desfaçais, desfaçam',
    impAff: 'desfaz, desfaz, desfaça, desfaçamos, desfazei, desfaçam',
    participle: 'desfeito',
  },
  refazer: { pret: 'refiz, refizeste, refez, refizemos, refizestes, refizeram', participle: 'refeito' },
  satisfazer: {
    pres: 'satisfaço, satisfazes, satisfaz, satisfazemos, satisfazeis, satisfazem',
    pret: 'satisfiz, satisfizeste, satisfez, satisfizemos, satisfizestes, satisfizeram',
    fut: 'satisfarei, satisfarás, satisfará, satisfaremos, satisfareis, satisfarão',
    subjPres: 'satisfaça, satisfaças, satisfaça, satisfaçamos, satisfaçais, satisfaçam',
    participle: 'satisfeito',
  },
  contradizer: {
    pres: 'contradigo, contradizes, contradiz, contradizemos, contradizeis, contradizem',
    pret: 'contradisse, contradisseste, contradisse, contradissemos, contradissestes, contradisseram',
    fut: 'contradirei, contradirás, contradirá, contradiremos, contradireis, contradirão',
    subjPres: 'contradiga, contradigas, contradiga, contradigamos, contradigais, contradigam',
    participle: 'contradito',
  },
  predizer: { pres: 'predigo, predizes, prediz, predizemos, predizeis, predizem', pret: 'predisse, predisseste, predisse, predissemos, predissestes, predisseram', participle: 'predito' },
  reler: { pres: 'releio, relês, relê, relemos, reledes, releem', participle: 'relido' },
  descrer: { pres: 'descreio, descrês, descrê, descremos, descredes, descreem' },
  sorrir: {
    pres: 'sorrio, sorris, sorri, sorrimos, sorrides, sorriem',
    pret: 'sorri, sorriste, sorriu, sorrimos, sorristes, sorriram',
    subjPres: 'sorria, sorrias, sorria, sorriamos, sorriais, sorriam',
    gerund: 'sorrindo', participle: 'sorrido',
  },

  // ---- -guar verbs with a stressed stem vowel (the accented spelling is shown) ----
  aguar: {
    pres: 'águo, águas, água, aguamos, aguais, águam',
    pret: 'aguei, aguaste, aguou, aguamos, aguastes, aguaram',
    subjPres: 'águe, águes, águe, aguemos, agueis, águem',
    impAff: 'água, água, águe, aguemos, aguai, águem',
    impNeg: 'não águes, não águes, não águe, não aguemos, não agueis, não águem',
    gerund: 'aguando', participle: 'aguado',
  },
  enxaguar: {
    pres: 'enxáguo, enxáguas, enxágua, enxaguamos, enxaguais, enxáguam',
    pret: 'enxaguei, enxaguaste, enxaguou, enxaguamos, enxaguastes, enxaguaram',
    mqp: 'enxaguara, enxaguaras, enxaguara, enxaguáramos, enxaguáreis, enxaguaram',
    subjPres: 'enxágue, enxágues, enxágue, enxaguemos, enxagueis, enxáguem',
    impAff: 'enxágua, enxágua, enxágue, enxaguemos, enxaguai, enxáguem',
    gerund: 'enxaguando', participle: 'enxaguado',
  },
  desaguar: { pres: 'deságuo, deságuas, deságua, desaguamos, desaguais, deságuam', subjPres: 'deságue, deságues, deságue, desaguemos, desagueis, deságuem' },
  minguar: {
    pres: 'mínguo, mínguas, míngua, minguamos, minguais, mínguam',
    pret: 'minguei, minguaste, minguou, minguamos, minguastes, minguaram',
    subjPres: 'míngue, míngues, míngue, minguemos, mingueis, mínguem',
    impAff: 'míngua, míngua, míngue, minguemos, minguai, mínguem',
  },

  // ---- -ergir verbs change e to i in the eu form and the present subjunctive ----
  divergir: {
    pres: 'divirjo, diverges, diverge, divergimos, divergis, divergem',
    pret: 'divergi, divergiste, divergiu, divergimos, divergistes, divergiram',
    subjPres: 'divirja, divirjas, divirja, divirjamos, divirjais, divirjam',
    impAff: 'diverge, diverge, divirja, divirjamos, divergi, divirjam',
    impNeg: 'não divirjas, não divirjas, não divirja, não divirjamos, não divirjais, não divirjam',
    gerund: 'divergindo', participle: 'divergido',
  },
  convergir: { pres: 'convirjo, converges, converge, convergimos, convergis, convergem', subjPres: 'convirja, convirjas, convirja, convirjamos, convirjais, convirjam' },
  emergir: { pres: 'emirjo, emerges, emerge, emergimos, emergis, emergem', subjPres: 'emirja, emirjas, emirja, emirjamos, emirjais, emirjam' },
  submergir: { pres: 'submirjo, submerges, submerge, submergimos, submergis, submergem', subjPres: 'submirja, submirjas, submirja, submirjamos, submirjais, submirjam' },

  // ---- only -uzir verbs drop the -e of the 3rd person (conduz); franzir keeps it ----
  franzir: {
    pres: 'franzo, franzes, franze, franzimos, franzis, franzem',
    subjPres: 'franza, franzas, franza, franzamos, franzais, franzam',
    impAff: 'franze, franze, franza, franzamos, franzi, franzam',
    gerund: 'franzindo', participle: 'franzido',
  },
  reluzir: { pres: 'reluzo, reluzes, reluz, reluzimos, reluzis, reluzem', impAff: 'reluz, reluz, reluza, reluzamos, reluzi, reluzam' },

  // ---- entupir: u becomes o in tu, ele, eles (like sumir) ----
  entupir: {
    pres: 'entupo, entopes, entope, entupimos, entupis, entopem',
    subjPres: 'entupa, entupas, entupa, entupamos, entupais, entupam',
    impAff: 'entope, entope, entupa, entupamos, entupi, entupam',
    participle: 'entupido',
  },
  desentupir: { pres: 'desentupo, desentopes, desentope, desentupimos, desentupis, desentopem' },

  // ---- descolorir is defective like colorir: no eu form, no present subjunctive ----
  descolorir: {
    pres: '—, descolores, descolore, descolorimos, descoloris, descolorem',
    subjPres: '—, —, —, —, —, —',
    impAff: 'descolore, descolore, —, —, descolori, —',
    impNeg: '—, —, —, —, —, —',
    participle: 'descolorido',
  },

  // ---- participles ----
  abrir: { participle: 'aberto', pres: 'abro, abres, abre, abrimos, abris, abrem' },
  reabrir: { participle: 'reaberto' },
  escrever: { participle: 'escrito', pres: 'escrevo, escreves, escreve, escrevemos, escreveis, escrevem' },
  descrever: { participle: 'descrito' },
  ganhar: { participle: 'ganho', gerund: 'ganhando' },
  gastar: { participle: 'gasto' },
  aceitar: { participle: 'aceitado' },
  entregar: { participle: 'entregado', pret: 'entreguei, entregaste, entregou, entregamos, entregastes, entregaram' },
  eleger: { participle: 'eleito', pres: 'elejo, eleges, elege, elegemos, elegeis, elegem' },
  morrer: { participle: 'morrido', pres: 'morro, morres, morre, morremos, morreis, morrem' },
  imprimir: { participle: 'imprimido' },
  prender: { participle: 'prendido' },

  // ---- impersonal verbs ----
  chover: {
    pres: '—, —, chove, —, —, —',
    pret: '—, —, choveu, —, —, —',
    imperf: '—, —, chovia, —, —, —',
    fut: '—, —, choverá, —, —, —',
    subjPres: '—, —, chova, —, —, —',
    subjFut: '—, —, chover, —, —, —',
    impAff: '—, —, —, —, —, —',
    impNeg: '—, —, —, —, —, —',
    perfComp: '—, —, tem chovido, —, —, —',
    infPess: '—, —, chover, —, —, —',
    gerund: 'chovendo', participle: 'chovido',
  },
  trovejar: { pres: '—, —, troveja, —, —, —', pret: '—, —, trovejou, —, —, —' },
  nevar: { pres: '—, —, neva, —, —, —', fut: '—, —, nevará, —, —, —' },
  ventar: { pres: '—, —, venta, —, —, —', imperf: '—, —, ventava, —, —, —' },
  amanhecer: { pres: '—, —, amanhece, —, —, —', pret: '—, —, amanheceu, —, —, —', subjPres: '—, —, amanheça, —, —, —' },
  anoitecer: { pres: '—, —, anoitece, —, —, —', pret: '—, —, anoiteceu, —, —, —', subjPres: '—, —, anoiteça, —, —, —' },

  // ---- defective verbs ----
  abolir: {
    pres: '—, aboles, abole, abolimos, abolis, abolem',
    pret: 'aboli, aboliste, aboliu, abolimos, abolistes, aboliram',
    imperf: 'abolia, abolias, abolia, abolíamos, abolíeis, aboliam',
    fut: 'abolirei, abolirás, abolirá, aboliremos, abolireis, abolirão',
    subjPres: '—, —, —, —, —, —',
    subjImperf: 'abolisse, abolisses, abolisse, abolíssemos, abolísseis, abolissem',
    impAff: 'abole, abole, —, —, aboli, —',
    impNeg: '—, —, —, —, —, —',
    perfComp: 'tenho abolido, tens abolido, tem abolido, temos abolido, tendes abolido, têm abolido',
    gerund: 'abolindo', participle: 'abolido',
  },
  falir: {
    pres: '—, —, —, falimos, falis, —',
    pret: 'fali, faliste, faliu, falimos, falistes, faliram',
    subjPres: '—, —, —, —, —, —',
    impAff: '—, —, —, —, fali, —',
  },
  reaver: {
    pres: '—, —, —, reavemos, reaveis, —',
    pret: 'reouve, reouveste, reouve, reouvemos, reouvestes, reouveram',
    imperf: 'reavia, reavias, reavia, reavíamos, reavíeis, reaviam',
    fut: 'reaverei, reaverás, reaverá, reaveremos, reavereis, reaverão',
    subjImperf: 'reouvesse, reouvesses, reouvesse, reouvéssemos, reouvésseis, reouvessem',
    subjFut: 'reouver, reouveres, reouver, reouvermos, reouverdes, reouverem',
    subjPres: '—, —, —, —, —, —',
    participle: 'reavido',
  },

  // ---- regular verbs (and -er verbs that look irregular but are not) ----
  viver: {
    pres: 'vivo, vives, vive, vivemos, viveis, vivem',
    pret: 'vivi, viveste, viveu, vivemos, vivestes, viveram',
    gerund: 'vivendo', participle: 'vivido',
  },
  beber: { pres: 'bebo, bebes, bebe, bebemos, bebeis, bebem', mqp: 'bebera, beberas, bebera, bebêramos, bebêreis, beberam' },
  cumprir: { pres: 'cumpro, cumpres, cumpre, cumprimos, cumpris, cumprem' },
  dever: { pres: 'devo, deves, deve, devemos, deveis, devem', participle: 'devido' },
  ferver: { pres: 'fervo, ferves, ferve, fervemos, ferveis, fervem' },
  mover: { pres: 'movo, moves, move, movemos, moveis, movem' },
  resumir: { pres: 'resumo, resumes, resume, resumimos, resumis, resumem' },
  entender: { pres: 'entendo, entendes, entende, entendemos, entendeis, entendem', gerund: 'entendendo' },
  cozer: { pres: 'cozo, cozes, coze, cozemos, cozeis, cozem' },
};

// Compound tenses (ter + participle) for the verbs whose participle matters most.
for (const verb of [
  'comer', 'partir', 'ser', 'estar', 'ter', 'haver', 'ir', 'vir', 'ver', 'dar', 'saber', 'poder',
  'querer', 'fazer', 'dizer', 'trazer', 'pôr', 'ler', 'crer', 'rir', 'sair', 'cair', 'ouvir', 'pedir',
  'dormir', 'seguir', 'abrir', 'escrever', 'ganhar', 'pagar', 'compor', 'conter', 'prever', 'desfazer',
  'cobrir', 'construir', 'aceitar', 'entregar', 'eleger', 'morrer',
]) {
  EXPECTED[verb] = { ...compounds(EXPECTED[verb].participle), ...EXPECTED[verb] };
}

const report = createReport();
checkParadigms(report, EXPECTED, conjugate);

const same = (label, actual, expected) => {
  report.checks += 1;
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) report.fail(`${label}\n    expected: ${e}\n    actual:   ${a}`);
};

// The module exports the placeholder for a missing form.
same('NONE is an em dash', NONE, '—');

// Anything that is not a verb this engine can conjugate gives null.
for (const input of [
  '', '   ', 'hello', 'levantar-se', 'levantarse', 'xyz', '123', 'constructor', 'toString', '__proto__',
  'por', 'impôr', 'ar', 'er', 'ir-se', 'doutor', 'falar-se',
  // verbs whose forms are not settled: -guar / -quar, and rare irregular verbs
  'averiguar', 'apaziguar', 'extorquir', 'aprazer', 'bendizer', 'frigir', 'prevaler',
]) {
  same(`conjugate(${JSON.stringify(input)}) is null`, conjugate(input), null);
}
for (const input of [null, undefined, 42, {}, ['falar']]) {
  same(`conjugate(${JSON.stringify(input)}) is null`, conjugate(input), null);
}

// The input is trimmed and lower-cased; pôr keeps its circumflex, its relatives do not.
same('case and spaces are ignored', conjugate('  FALAR ').inf, 'falar');
same('PÔR is read as pôr', conjugate('PÔR').inf, 'pôr');
same('compor has no circumflex', conjugate('compor').inf, 'compor');

// Every paradigm in the table: exactly the 19 keys, in order, six strings each.
for (const verb of Object.keys(EXPECTED)) {
  const result = conjugate(verb);
  if (!result) continue; // already reported by checkParadigms
  same(`${verb}: keys`, Object.keys(result.forms), FORM_KEYS);
  same(`${verb}: inf`, result.inf, verb);
  const bad = FORM_KEYS.filter(key =>
    !Array.isArray(result.forms[key]) || result.forms[key].length !== 6 ||
    result.forms[key].some(form => typeof form !== 'string' || !form));
  same(`${verb}: six non-empty strings per tense`, bad, []);
}

// An impersonal verb keeps only the 3rd person singular; the other slots are NONE.
for (const verb of ['chover', 'trovejar', 'nevar', 'ventar', 'amanhecer', 'anoitecer']) {
  const { forms } = conjugate(verb);
  const stray = FORM_KEYS.filter(key => forms[key].some((form, i) => {
    const exists = i === 2 && key !== 'impAff' && key !== 'impNeg';
    return exists ? form === NONE : form !== NONE;
  }));
  same(`${verb}: only the 3rd person singular exists`, stray, []);
}

// Prefixed relatives inherit the irregular base.
const FAMILY = {
  pôr: ['compor', 'dispor', 'expor', 'impor', 'propor', 'repor', 'supor', 'opor', 'depor', 'sobrepor', 'transpor'],
  ter: ['conter', 'manter', 'obter', 'deter', 'reter', 'entreter'],
  vir: ['convir', 'intervir', 'provir', 'advir', 'sobrevir'],
  ver: ['prever', 'rever', 'antever', 'entrever'],
  fazer: ['desfazer', 'refazer', 'satisfazer', 'perfazer', 'contrafazer', 'liquefazer'],
  dizer: ['contradizer', 'predizer', 'desdizer', 'interdizer'],
};
for (const [base, relatives] of Object.entries(FAMILY)) {
  const b = conjugate(base);
  for (const verb of relatives) {
    const prefix = verb.slice(0, verb.length - (base === 'pôr' ? 3 : base.length));
    const r = conjugate(verb);
    same(`${verb}: pret 1sg`, r && r.forms.pret[0].startsWith(prefix), true);
    same(`${verb}: pret 3pl is ${prefix} + ${base}`, r && r.forms.pret[5], prefix + b.forms.pret[5]);
    same(`${verb}: participle is ${prefix} + ${base}`, r && r.participle, prefix + b.participle);
  }
}

// Every -air verb takes the cair pattern; every other -uir verb the construir one.
for (const [verb, base] of [['trair', 'cair'], ['sobressair', 'sair'], ['esvair', 'cair'], ['abstrair', 'cair'], ['contribuir', 'incluir'], ['substituir', 'incluir']]) {
  const r = conjugate(verb);
  const b = conjugate(base);
  const stem = verb.slice(0, -2);
  const bStem = base.slice(0, -2);
  const shape = (forms, s) => forms.map(form => form.replace(s, '_')).join(', ');
  same(`${verb}: pres follows ${base}`, r && shape(r.forms.pres, stem), shape(b.forms.pres, bStem));
  same(`${verb}: pret follows ${base}`, r && shape(r.forms.pret, stem), shape(b.forms.pret, bStem));
  same(`${verb}: subjFut follows ${base}`, r && shape(r.forms.subjFut, stem), shape(b.forms.subjFut, bStem));
}

// Every verb in the database must conjugate into well-formed output.
const portugueseCount = checkInflectedDatabase(report, {
  verbs: VERBS,
  conjugate,
  lang: 'pt',
  formKeys: FORM_KEYS,
  // pôr -> pondo; irregular participles: aberto, dito, feito, posto, visto, vindo, ganho, gasto, pago
  gerund: /(ando|endo|indo|ondo)$/,
  participle: /(ado|ido|ído|indo|to|ho|go)$/,
});

report.finish(`${report.checks} paradigm checks, ${Object.keys(VERBS).length} English verbs, ${portugueseCount} Portuguese translations`);
