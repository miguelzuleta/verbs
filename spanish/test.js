// Run with: node test.js
// Checks the conjugation engine against known paradigms, then runs every
// Spanish verb in verbs.js through it to catch crashes and malformed output.
const { conjugate } = require('./conjugate.js');
const { VERBS } = require('./verbs.js');
const { createReport, checkParadigms, checkInflectedDatabase } = require('../shared/test-kit.js');

// verb -> { tense: 'yo, tú, él, nosotros, vosotros, ellos' }  (gerund / participle as plain strings)
const EXPECTED = {
  hablar: {
    pres: 'hablo, hablas, habla, hablamos, habláis, hablan',
    pret: 'hablé, hablaste, habló, hablamos, hablasteis, hablaron',
    imperf: 'hablaba, hablabas, hablaba, hablábamos, hablabais, hablaban',
    fut: 'hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán',
    cond: 'hablaría, hablarías, hablaría, hablaríamos, hablaríais, hablarían',
    presPerf: 'he hablado, has hablado, ha hablado, hemos hablado, habéis hablado, han hablado',
    pastPerf: 'había hablado, habías hablado, había hablado, habíamos hablado, habíais hablado, habían hablado',
    pretAnt: 'hube hablado, hubiste hablado, hubo hablado, hubimos hablado, hubisteis hablado, hubieron hablado',
    futPerf: 'habré hablado, habrás hablado, habrá hablado, habremos hablado, habréis hablado, habrán hablado',
    condPerf: 'habría hablado, habrías hablado, habría hablado, habríamos hablado, habríais hablado, habrían hablado',
    subjPres: 'hable, hables, hable, hablemos, habléis, hablen',
    subjImperf: 'hablara / hablase, hablaras / hablases, hablara / hablase, habláramos / hablásemos, hablarais / hablaseis, hablaran / hablasen',
    subjFut: 'hablare, hablares, hablare, habláremos, hablareis, hablaren',
    subjPresPerf: 'haya hablado, hayas hablado, haya hablado, hayamos hablado, hayáis hablado, hayan hablado',
    subjPluperf: 'hubiera hablado, hubieras hablado, hubiera hablado, hubiéramos hablado, hubierais hablado, hubieran hablado',
    subjFutPerf: 'hubiere hablado, hubieres hablado, hubiere hablado, hubiéremos hablado, hubiereis hablado, hubieren hablado',
    impAff: 'habla, habla, hable, hablemos, hablad, hablen',
    impNeg: 'no hables, no hables, no hable, no hablemos, no habléis, no hablen',
    gerund: 'hablando', participle: 'hablado',
  },
  comer: {
    pres: 'como, comes, come, comemos, coméis, comen',
    pret: 'comí, comiste, comió, comimos, comisteis, comieron',
    imperf: 'comía, comías, comía, comíamos, comíais, comían',
    subjPres: 'coma, comas, coma, comamos, comáis, coman',
    subjImperf: 'comiera / comiese, comieras / comieses, comiera / comiese, comiéramos / comiésemos, comierais / comieseis, comieran / comiesen',
    impAff: 'come, come, coma, comamos, comed, coman',
    gerund: 'comiendo', participle: 'comido',
  },
  vivir: {
    pres: 'vivo, vives, vive, vivimos, vivís, viven',
    pret: 'viví, viviste, vivió, vivimos, vivisteis, vivieron',
    impAff: 'vive, vive, viva, vivamos, vivid, vivan',
  },
  ser: {
    pres: 'soy, eres, es, somos, sois, son',
    pret: 'fui, fuiste, fue, fuimos, fuisteis, fueron',
    imperf: 'era, eras, era, éramos, erais, eran',
    fut: 'seré, serás, será, seremos, seréis, serán',
    subjPres: 'sea, seas, sea, seamos, seáis, sean',
    subjImperf: 'fuera / fuese, fueras / fueses, fuera / fuese, fuéramos / fuésemos, fuerais / fueseis, fueran / fuesen',
    impAff: 'sé, sé, sea, seamos, sed, sean',
    gerund: 'siendo', participle: 'sido',
  },
  ir: {
    pres: 'voy, vas, va, vamos, vais, van',
    pret: 'fui, fuiste, fue, fuimos, fuisteis, fueron',
    imperf: 'iba, ibas, iba, íbamos, ibais, iban',
    fut: 'iré, irás, irá, iremos, iréis, irán',
    subjPres: 'vaya, vayas, vaya, vayamos, vayáis, vayan',
    impAff: 've, ve, vaya, vamos, id, vayan',
    impNeg: 'no vayas, no vayas, no vaya, no vayamos, no vayáis, no vayan',
    gerund: 'yendo', participle: 'ido',
  },
  estar: {
    pres: 'estoy, estás, está, estamos, estáis, están',
    pret: 'estuve, estuviste, estuvo, estuvimos, estuvisteis, estuvieron',
    subjPres: 'esté, estés, esté, estemos, estéis, estén',
    impAff: 'está, está, esté, estemos, estad, estén',
  },
  dar: {
    pres: 'doy, das, da, damos, dais, dan',
    pret: 'di, diste, dio, dimos, disteis, dieron',
    subjPres: 'dé, des, dé, demos, deis, den',
    subjImperf: 'diera / diese, dieras / dieses, diera / diese, diéramos / diésemos, dierais / dieseis, dieran / diesen',
  },
  haber: {
    pres: 'he, has, ha, hemos, habéis, han',
    pret: 'hube, hubiste, hubo, hubimos, hubisteis, hubieron',
    fut: 'habré, habrás, habrá, habremos, habréis, habrán',
    subjPres: 'haya, hayas, haya, hayamos, hayáis, hayan',
  },
  saber: {
    pres: 'sé, sabes, sabe, sabemos, sabéis, saben',
    pret: 'supe, supiste, supo, supimos, supisteis, supieron',
    fut: 'sabré, sabrás, sabrá, sabremos, sabréis, sabrán',
    subjPres: 'sepa, sepas, sepa, sepamos, sepáis, sepan',
  },
  caber: {
    pres: 'quepo, cabes, cabe, cabemos, cabéis, caben',
    pret: 'cupe, cupiste, cupo, cupimos, cupisteis, cupieron',
    subjPres: 'quepa, quepas, quepa, quepamos, quepáis, quepan',
  },
  tener: {
    pres: 'tengo, tienes, tiene, tenemos, tenéis, tienen',
    pret: 'tuve, tuviste, tuvo, tuvimos, tuvisteis, tuvieron',
    fut: 'tendré, tendrás, tendrá, tendremos, tendréis, tendrán',
    subjPres: 'tenga, tengas, tenga, tengamos, tengáis, tengan',
    impAff: 'ten, ten, tenga, tengamos, tened, tengan',
    gerund: 'teniendo', participle: 'tenido',
  },
  mantener: {
    pres: 'mantengo, mantienes, mantiene, mantenemos, mantenéis, mantienen',
    pret: 'mantuve, mantuviste, mantuvo, mantuvimos, mantuvisteis, mantuvieron',
    impAff: 'mantén, mantén, mantenga, mantengamos, mantened, mantengan',
  },
  venir: {
    pres: 'vengo, vienes, viene, venimos, venís, vienen',
    pret: 'vine, viniste, vino, vinimos, vinisteis, vinieron',
    fut: 'vendré, vendrás, vendrá, vendremos, vendréis, vendrán',
    subjPres: 'venga, vengas, venga, vengamos, vengáis, vengan',
    impAff: 'ven, ven, venga, vengamos, venid, vengan',
    gerund: 'viniendo',
  },
  prevenir: {
    pret: 'previne, previniste, previno, previnimos, previnisteis, previnieron',
    impAff: 'prevén, prevén, prevenga, prevengamos, prevenid, prevengan',
  },
  hacer: {
    pres: 'hago, haces, hace, hacemos, hacéis, hacen',
    pret: 'hice, hiciste, hizo, hicimos, hicisteis, hicieron',
    fut: 'haré, harás, hará, haremos, haréis, harán',
    subjPres: 'haga, hagas, haga, hagamos, hagáis, hagan',
    subjImperf: 'hiciera / hiciese, hicieras / hicieses, hiciera / hiciese, hiciéramos / hiciésemos, hicierais / hicieseis, hicieran / hiciesen',
    impAff: 'haz, haz, haga, hagamos, haced, hagan',
    gerund: 'haciendo', participle: 'hecho',
  },
  deshacer: {
    pret: 'deshice, deshiciste, deshizo, deshicimos, deshicisteis, deshicieron',
    impAff: 'deshaz, deshaz, deshaga, deshagamos, deshaced, deshagan',
    participle: 'deshecho',
  },
  satisfacer: {
    pres: 'satisfago, satisfaces, satisface, satisfacemos, satisfacéis, satisfacen',
    pret: 'satisfice, satisficiste, satisfizo, satisficimos, satisficisteis, satisficieron',
    fut: 'satisfaré, satisfarás, satisfará, satisfaremos, satisfaréis, satisfarán',
    participle: 'satisfecho',
  },
  decir: {
    pres: 'digo, dices, dice, decimos, decís, dicen',
    pret: 'dije, dijiste, dijo, dijimos, dijisteis, dijeron',
    fut: 'diré, dirás, dirá, diremos, diréis, dirán',
    subjPres: 'diga, digas, diga, digamos, digáis, digan',
    subjImperf: 'dijera / dijese, dijeras / dijeses, dijera / dijese, dijéramos / dijésemos, dijerais / dijeseis, dijeran / dijesen',
    impAff: 'di, di, diga, digamos, decid, digan',
    gerund: 'diciendo', participle: 'dicho',
  },
  predecir: {
    pres: 'predigo, predices, predice, predecimos, predecís, predicen',
    fut: 'predeciré, predecirás, predecirá, predeciremos, predeciréis, predecirán',
    impAff: 'predice, predice, prediga, predigamos, predecid, predigan',
    participle: 'predicho',
  },
  bendecir: {
    pret: 'bendije, bendijiste, bendijo, bendijimos, bendijisteis, bendijeron',
    fut: 'bendeciré, bendecirás, bendecirá, bendeciremos, bendeciréis, bendecirán',
    participle: 'bendecido',
  },
  poder: {
    pres: 'puedo, puedes, puede, podemos, podéis, pueden',
    pret: 'pude, pudiste, pudo, pudimos, pudisteis, pudieron',
    fut: 'podré, podrás, podrá, podremos, podréis, podrán',
    subjPres: 'pueda, puedas, pueda, podamos, podáis, puedan',
    gerund: 'pudiendo', participle: 'podido',
  },
  querer: {
    pres: 'quiero, quieres, quiere, queremos, queréis, quieren',
    pret: 'quise, quisiste, quiso, quisimos, quisisteis, quisieron',
    fut: 'querré, querrás, querrá, querremos, querréis, querrán',
    subjPres: 'quiera, quieras, quiera, queramos, queráis, quieran',
  },
  poner: {
    pres: 'pongo, pones, pone, ponemos, ponéis, ponen',
    pret: 'puse, pusiste, puso, pusimos, pusisteis, pusieron',
    fut: 'pondré, pondrás, pondrá, pondremos, pondréis, pondrán',
    subjPres: 'ponga, pongas, ponga, pongamos, pongáis, pongan',
    impAff: 'pon, pon, ponga, pongamos, poned, pongan',
    participle: 'puesto',
  },
  componer: {
    impAff: 'compón, compón, componga, compongamos, componed, compongan',
    participle: 'compuesto',
  },
  salir: {
    pres: 'salgo, sales, sale, salimos, salís, salen',
    fut: 'saldré, saldrás, saldrá, saldremos, saldréis, saldrán',
    impAff: 'sal, sal, salga, salgamos, salid, salgan',
  },
  valer: {
    pres: 'valgo, vales, vale, valemos, valéis, valen',
    fut: 'valdré, valdrás, valdrá, valdremos, valdréis, valdrán',
  },
  andar: {
    pret: 'anduve, anduviste, anduvo, anduvimos, anduvisteis, anduvieron',
  },
  traer: {
    pres: 'traigo, traes, trae, traemos, traéis, traen',
    pret: 'traje, trajiste, trajo, trajimos, trajisteis, trajeron',
    subjPres: 'traiga, traigas, traiga, traigamos, traigáis, traigan',
    subjImperf: 'trajera / trajese, trajeras / trajeses, trajera / trajese, trajéramos / trajésemos, trajerais / trajeseis, trajeran / trajesen',
    gerund: 'trayendo', participle: 'traído',
  },
  atraer: {
    pret: 'atraje, atrajiste, atrajo, atrajimos, atrajisteis, atrajeron',
  },
  caer: {
    pres: 'caigo, caes, cae, caemos, caéis, caen',
    pret: 'caí, caíste, cayó, caímos, caísteis, cayeron',
    subjPres: 'caiga, caigas, caiga, caigamos, caigáis, caigan',
    gerund: 'cayendo', participle: 'caído',
  },
  leer: {
    pres: 'leo, lees, lee, leemos, leéis, leen',
    pret: 'leí, leíste, leyó, leímos, leísteis, leyeron',
    imperf: 'leía, leías, leía, leíamos, leíais, leían',
    subjImperf: 'leyera / leyese, leyeras / leyeses, leyera / leyese, leyéramos / leyésemos, leyerais / leyeseis, leyeran / leyesen',
    gerund: 'leyendo', participle: 'leído',
  },
  poseer: {
    pret: 'poseí, poseíste, poseyó, poseímos, poseísteis, poseyeron',
  },
  oír: {
    pres: 'oigo, oyes, oye, oímos, oís, oyen',
    pret: 'oí, oíste, oyó, oímos, oísteis, oyeron',
    fut: 'oiré, oirás, oirá, oiremos, oiréis, oirán',
    subjPres: 'oiga, oigas, oiga, oigamos, oigáis, oigan',
    impAff: 'oye, oye, oiga, oigamos, oíd, oigan',
    gerund: 'oyendo', participle: 'oído',
  },
  ver: {
    pres: 'veo, ves, ve, vemos, veis, ven',
    pret: 'vi, viste, vio, vimos, visteis, vieron',
    imperf: 'veía, veías, veía, veíamos, veíais, veían',
    fut: 'veré, verás, verá, veremos, veréis, verán',
    subjPres: 'vea, veas, vea, veamos, veáis, vean',
    impAff: 've, ve, vea, veamos, ved, vean',
    gerund: 'viendo', participle: 'visto',
  },
  prever: {
    pres: 'preveo, prevés, prevé, prevemos, prevéis, prevén',
    pret: 'preví, previste, previó, previmos, previsteis, previeron',
    impAff: 'prevé, prevé, prevea, preveamos, preved, prevean',
    participle: 'previsto',
  },
  reír: {
    pres: 'río, ríes, ríe, reímos, reís, ríen',
    pret: 'reí, reíste, rió, reímos, reísteis, rieron',
    imperf: 'reía, reías, reía, reíamos, reíais, reían',
    fut: 'reiré, reirás, reirá, reiremos, reiréis, reirán',
    subjPres: 'ría, rías, ría, riamos, riáis, rían',
    subjImperf: 'riera / riese, rieras / rieses, riera / riese, riéramos / riésemos, rierais / rieseis, rieran / riesen',
    impAff: 'ríe, ríe, ría, riamos, reíd, rían',
    gerund: 'riendo', participle: 'reído',
  },
  sonreír: {
    pres: 'sonrío, sonríes, sonríe, sonreímos, sonreís, sonríen',
    pret: 'sonreí, sonreíste, sonrió, sonreímos, sonreísteis, sonrieron',
  },
  pedir: {
    pres: 'pido, pides, pide, pedimos, pedís, piden',
    pret: 'pedí, pediste, pidió, pedimos, pedisteis, pidieron',
    subjPres: 'pida, pidas, pida, pidamos, pidáis, pidan',
    subjImperf: 'pidiera / pidiese, pidieras / pidieses, pidiera / pidiese, pidiéramos / pidiésemos, pidierais / pidieseis, pidieran / pidiesen',
    gerund: 'pidiendo',
  },
  dormir: {
    pres: 'duermo, duermes, duerme, dormimos, dormís, duermen',
    pret: 'dormí, dormiste, durmió, dormimos, dormisteis, durmieron',
    subjPres: 'duerma, duermas, duerma, durmamos, durmáis, duerman',
    gerund: 'durmiendo',
  },
  sentir: {
    pres: 'siento, sientes, siente, sentimos, sentís, sienten',
    pret: 'sentí, sentiste, sintió, sentimos, sentisteis, sintieron',
    subjPres: 'sienta, sientas, sienta, sintamos, sintáis, sientan',
    gerund: 'sintiendo',
  },
  hervir: {
    pret: 'herví, herviste, hirvió, hervimos, hervisteis, hirvieron',
  },
  morir: {
    pres: 'muero, mueres, muere, morimos, morís, mueren',
    pret: 'morí, moriste, murió, morimos, moristeis, murieron',
    gerund: 'muriendo', participle: 'muerto',
  },
  empezar: {
    pres: 'empiezo, empiezas, empieza, empezamos, empezáis, empiezan',
    pret: 'empecé, empezaste, empezó, empezamos, empezasteis, empezaron',
    subjPres: 'empiece, empieces, empiece, empecemos, empecéis, empiecen',
  },
  almorzar: {
    pres: 'almuerzo, almuerzas, almuerza, almorzamos, almorzáis, almuerzan',
    pret: 'almorcé, almorzaste, almorzó, almorzamos, almorzasteis, almorzaron',
    subjPres: 'almuerce, almuerces, almuerce, almorcemos, almorcéis, almuercen',
  },
  jugar: {
    pres: 'juego, juegas, juega, jugamos, jugáis, juegan',
    pret: 'jugué, jugaste, jugó, jugamos, jugasteis, jugaron',
    subjPres: 'juegue, juegues, juegue, juguemos, juguéis, jueguen',
  },
  rogar: {
    subjPres: 'ruegue, ruegues, ruegue, roguemos, roguéis, rueguen',
  },
  buscar: {
    pret: 'busqué, buscaste, buscó, buscamos, buscasteis, buscaron',
    subjPres: 'busque, busques, busque, busquemos, busquéis, busquen',
    impNeg: 'no busques, no busques, no busque, no busquemos, no busquéis, no busquen',
  },
  llegar: {
    pret: 'llegué, llegaste, llegó, llegamos, llegasteis, llegaron',
    subjPres: 'llegue, llegues, llegue, lleguemos, lleguéis, lleguen',
  },
  averiguar: {
    pret: 'averigüé, averiguaste, averiguó, averiguamos, averiguasteis, averiguaron',
    subjPres: 'averigüe, averigües, averigüe, averigüemos, averigüéis, averigüen',
  },
  enviar: {
    pres: 'envío, envías, envía, enviamos, enviáis, envían',
    pret: 'envié, enviaste, envió, enviamos, enviasteis, enviaron',
    subjPres: 'envíe, envíes, envíe, enviemos, enviéis, envíen',
  },
  actuar: {
    pres: 'actúo, actúas, actúa, actuamos, actuáis, actúan',
    subjPres: 'actúe, actúes, actúe, actuemos, actuéis, actúen',
  },
  prohibir: {
    pres: 'prohíbo, prohíbes, prohíbe, prohibimos, prohibís, prohíben',
    subjPres: 'prohíba, prohíbas, prohíba, prohibamos, prohibáis, prohíban',
  },
  conocer: {
    pres: 'conozco, conoces, conoce, conocemos, conocéis, conocen',
    subjPres: 'conozca, conozcas, conozca, conozcamos, conozcáis, conozcan',
  },
  vencer: {
    pres: 'venzo, vences, vence, vencemos, vencéis, vencen',
    subjPres: 'venza, venzas, venza, venzamos, venzáis, venzan',
  },
  torcer: {
    pres: 'tuerzo, tuerces, tuerce, torcemos, torcéis, tuercen',
  },
  conducir: {
    pres: 'conduzco, conduces, conduce, conducimos, conducís, conducen',
    pret: 'conduje, condujiste, condujo, condujimos, condujisteis, condujeron',
    subjPres: 'conduzca, conduzcas, conduzca, conduzcamos, conduzcáis, conduzcan',
    subjImperf: 'condujera / condujese, condujeras / condujeses, condujera / condujese, condujéramos / condujésemos, condujerais / condujeseis, condujeran / condujesen',
  },
  escoger: {
    pres: 'escojo, escoges, escoge, escogemos, escogéis, escogen',
    subjPres: 'escoja, escojas, escoja, escojamos, escojáis, escojan',
  },
  dirigir: {
    pres: 'dirijo, diriges, dirige, dirigimos, dirigís, dirigen',
    subjPres: 'dirija, dirijas, dirija, dirijamos, dirijáis, dirijan',
  },
  elegir: {
    pres: 'elijo, eliges, elige, elegimos, elegís, eligen',
    pret: 'elegí, elegiste, eligió, elegimos, elegisteis, eligieron',
    subjPres: 'elija, elijas, elija, elijamos, elijáis, elijan',
    gerund: 'eligiendo',
  },
  seguir: {
    pres: 'sigo, sigues, sigue, seguimos, seguís, siguen',
    pret: 'seguí, seguiste, siguió, seguimos, seguisteis, siguieron',
    subjPres: 'siga, sigas, siga, sigamos, sigáis, sigan',
    gerund: 'siguiendo', participle: 'seguido',
  },
  distinguir: {
    pres: 'distingo, distingues, distingue, distinguimos, distinguís, distinguen',
    subjPres: 'distinga, distingas, distinga, distingamos, distingáis, distingan',
  },
  construir: {
    pres: 'construyo, construyes, construye, construimos, construís, construyen',
    pret: 'construí, construiste, construyó, construimos, construisteis, construyeron',
    subjPres: 'construya, construyas, construya, construyamos, construyáis, construyan',
    subjImperf: 'construyera / construyese, construyeras / construyeses, construyera / construyese, construyéramos / construyésemos, construyerais / construyeseis, construyeran / construyesen',
    impAff: 'construye, construye, construya, construyamos, construid, construyan',
    gerund: 'construyendo', participle: 'construido',
  },
  huir: {
    pres: 'huyo, huyes, huye, huimos, huís, huyen',
    pret: 'huí, huiste, huyó, huimos, huisteis, huyeron',
    gerund: 'huyendo',
  },
  oler: {
    pres: 'huelo, hueles, huele, olemos, oléis, huelen',
    subjPres: 'huela, huelas, huela, olamos, oláis, huelan',
  },
  adquirir: {
    pres: 'adquiero, adquieres, adquiere, adquirimos, adquirís, adquieren',
  },
  volver: {
    pres: 'vuelvo, vuelves, vuelve, volvemos, volvéis, vuelven',
    participle: 'vuelto',
  },
  resolver: { participle: 'resuelto' },
  devolver: { participle: 'devuelto' },
  abrir: { participle: 'abierto' },
  cubrir: { participle: 'cubierto' },
  descubrir: { participle: 'descubierto' },
  escribir: { participle: 'escrito' },
  describir: { participle: 'descrito' },
  romper: { participle: 'roto' },
  corromper: { participle: 'corrompido' },
  acordar: {
    pres: 'acuerdo, acuerdas, acuerda, acordamos, acordáis, acuerdan',
    subjPres: 'acuerde, acuerdes, acuerde, acordemos, acordéis, acuerden',
  },
  tropezar: {
    pres: 'tropiezo, tropiezas, tropieza, tropezamos, tropezáis, tropiezan',
    pret: 'tropecé, tropezaste, tropezó, tropezamos, tropezasteis, tropezaron',
    subjPres: 'tropiece, tropieces, tropiece, tropecemos, tropecéis, tropiecen',
  },
  volcar: {
    pres: 'vuelco, vuelcas, vuelca, volcamos, volcáis, vuelcan',
    pret: 'volqué, volcaste, volcó, volcamos, volcasteis, volcaron',
    subjPres: 'vuelque, vuelques, vuelque, volquemos, volquéis, vuelquen',
  },
  freír: {
    pres: 'frío, fríes, fríe, freímos, freís, fríen',
    pret: 'freí, freíste, frió, freímos, freísteis, frieron',
    subjPres: 'fría, frías, fría, friamos, friáis, frían',
    gerund: 'friendo', participle: 'frito',
  },
  desafiar: {
    pres: 'desafío, desafías, desafía, desafiamos, desafiáis, desafían',
    subjPres: 'desafíe, desafíes, desafíe, desafiemos, desafiéis, desafíen',
  },
  graduar: {
    pres: 'gradúo, gradúas, gradúa, graduamos, graduáis, gradúan',
  },
  aullar: {
    pres: 'aúllo, aúllas, aúlla, aullamos, aulláis, aúllan',
  },
  aislar: {
    pres: 'aíslo, aíslas, aísla, aislamos, aisláis, aíslan',
    subjPres: 'aísle, aísles, aísle, aislemos, aisléis, aíslen',
  },
  distribuir: {
    pres: 'distribuyo, distribuyes, distribuye, distribuimos, distribuís, distribuyen',
    gerund: 'distribuyendo',
  },
  sumergir: {
    pres: 'sumerjo, sumerges, sumerge, sumergimos, sumergís, sumergen',
    subjPres: 'sumerja, sumerjas, sumerja, sumerjamos, sumerjáis, sumerjan',
  },
  esparcir: {
    pres: 'esparzo, esparces, esparce, esparcimos, esparcís, esparcen',
  },
  retorcer: {
    pres: 'retuerzo, retuerces, retuerce, retorcemos, retorcéis, retuercen',
    subjPres: 'retuerza, retuerzas, retuerza, retorzamos, retorzáis, retuerzan',
  },
  reforzar: {
    pres: 'refuerzo, refuerzas, refuerza, reforzamos, reforzáis, refuerzan',
    subjPres: 'refuerce, refuerces, refuerce, reforcemos, reforcéis, refuercen',
  },
  consentir: {
    pres: 'consiento, consientes, consiente, consentimos, consentís, consienten',
    pret: 'consentí, consentiste, consintió, consentimos, consentisteis, consintieron',
    subjPres: 'consienta, consientas, consienta, consintamos, consintáis, consientan',
  },
  gemir: {
    pres: 'gimo, gimes, gime, gemimos, gemís, gimen',
    pret: 'gemí, gemiste, gimió, gemimos, gemisteis, gimieron',
  },
  desvestir: {
    pres: 'desvisto, desvistes, desviste, desvestimos, desvestís, desvisten',
  },
  poblar: {
    pres: 'pueblo, pueblas, puebla, poblamos, pobláis, pueblan',
  },
  rehacer: {
    pret: 'rehice, rehiciste, rehizo, rehicimos, rehicisteis, rehicieron',
    impAff: 'rehaz, rehaz, rehaga, rehagamos, rehaced, rehagan',
    participle: 'rehecho',
  },
  intervenir: {
    pres: 'intervengo, intervienes, interviene, intervenimos, intervenís, intervienen',
    impAff: 'intervén, intervén, intervenga, intervengamos, intervenid, intervengan',
  },
  contradecir: {
    pret: 'contradije, contradijiste, contradijo, contradijimos, contradijisteis, contradijeron',
    fut: 'contradeciré, contradecirás, contradecirá, contradeciremos, contradeciréis, contradecirán',
    impAff: 'contradice, contradice, contradiga, contradigamos, contradecid, contradigan',
    participle: 'contradicho',
  },
  maldecir: {
    participle: 'maldecido',
  },
  // Prefixed relatives that no list mentions still follow the base verb.
  descomponer: {
    pres: 'descompongo, descompones, descompone, descomponemos, descomponéis, descomponen',
    pret: 'descompuse, descompusiste, descompuso, descompusimos, descompusisteis, descompusieron',
    impAff: 'descompón, descompón, descomponga, descompongamos, descomponed, descompongan',
    participle: 'descompuesto',
  },
  desoír: {
    pres: 'desoigo, desoyes, desoye, desoímos, desoís, desoyen',
  },
  errar: {
    pres: 'yerro, yerras, yerra, erramos, erráis, yerran',
    subjPres: 'yerre, yerres, yerre, erremos, erréis, yerren',
  },
  // -ñir / -llir verbs absorb the i of -ió, -ieron and -iendo.
  teñir: {
    pres: 'tiño, tiñes, tiñe, teñimos, teñís, tiñen',
    pret: 'teñí, teñiste, tiñó, teñimos, teñisteis, tiñeron',
    subjPres: 'tiña, tiñas, tiña, tiñamos, tiñáis, tiñan',
    subjImperf: 'tiñera / tiñese, tiñeras / tiñeses, tiñera / tiñese, tiñéramos / tiñésemos, tiñerais / tiñeseis, tiñeran / tiñesen',
    gerund: 'tiñendo', participle: 'teñido',
  },
  gruñir: {
    pret: 'gruñí, gruñiste, gruñó, gruñimos, gruñisteis, gruñeron',
    gerund: 'gruñendo',
  },
  bullir: {
    pret: 'bullí, bulliste, bulló, bullimos, bullisteis, bulleron',
    gerund: 'bullendo',
  },
  concebir: {
    pres: 'concibo, concibes, concibe, concebimos, concebís, conciben',
  },
  embestir: {
    pres: 'embisto, embistes, embiste, embestimos, embestís, embisten',
    pret: 'embestí, embestiste, embistió, embestimos, embestisteis, embistieron',
  },
  regir: {
    pres: 'rijo, riges, rige, regimos, regís, rigen',
    subjPres: 'rija, rijas, rija, rijamos, rijáis, rijan',
  },
  fregar: {
    pres: 'friego, friegas, friega, fregamos, fregáis, friegan',
    pret: 'fregué, fregaste, fregó, fregamos, fregasteis, fregaron',
    subjPres: 'friegue, friegues, friegue, freguemos, freguéis, frieguen',
  },
  adherir: {
    pres: 'adhiero, adhieres, adhiere, adherimos, adherís, adhieren',
    pret: 'adherí, adheriste, adhirió, adherimos, adheristeis, adhirieron',
  },
  esquiar: {
    pres: 'esquío, esquías, esquía, esquiamos, esquiáis, esquían',
  },
  desviar: {
    pres: 'desvío, desvías, desvía, desviamos, desviáis, desvían',
  },
  puntuar: {
    pres: 'puntúo, puntúas, puntúa, puntuamos, puntuáis, puntúan',
  },
  perpetuar: {
    pres: 'perpetúo, perpetúas, perpetúa, perpetuamos, perpetuáis, perpetúan',
  },
  insinuar: {
    pres: 'insinúo, insinúas, insinúa, insinuamos, insinuáis, insinúan',
  },
  maullar: {
    pres: 'maúllo, maúllas, maúlla, maullamos, maulláis, maúllan',
  },
  colar: {
    pres: 'cuelo, cuelas, cuela, colamos, coláis, cuelan',
  },
  desenterrar: {
    pres: 'desentierro, desentierras, desentierra, desenterramos, desenterráis, desentierran',
  },
  trascender: {
    pres: 'trasciendo, trasciendes, trasciende, trascendemos, trascendéis, trascienden',
  },
  precalentar: {
    pres: 'precaliento, precalientas, precalienta, precalentamos, precalentáis, precalientan',
  },
  sobresalir: {
    pres: 'sobresalgo, sobresales, sobresale, sobresalimos, sobresalís, sobresalen',
    fut: 'sobresaldré, sobresaldrás, sobresaldrá, sobresaldremos, sobresaldréis, sobresaldrán',
    impAff: 'sobresal, sobresal, sobresalga, sobresalgamos, sobresalid, sobresalgan',
  },
  superponer: {
    pres: 'superpongo, superpones, superpone, superponemos, superponéis, superponen',
    participle: 'superpuesto',
  },
  sobrescribir: { participle: 'sobrescrito' },
  inscribir: { participle: 'inscrito' },
  amortiguar: {
    pret: 'amortigüé, amortiguaste, amortiguó, amortiguamos, amortiguasteis, amortiguaron',
    subjPres: 'amortigüe, amortigües, amortigüe, amortigüemos, amortigüéis, amortigüen',
  },
  promulgar: {
    pret: 'promulgué, promulgaste, promulgó, promulgamos, promulgasteis, promulgaron',
  },
  zurcir: {
    pres: 'zurzo, zurces, zurce, zurcimos, zurcís, zurcen',
  },
  relucir: {
    pres: 'reluzco, reluces, reluce, relucimos, relucís, relucen',
  },
  ejercer: {
    pres: 'ejerzo, ejerces, ejerce, ejercemos, ejercéis, ejercen',
    subjPres: 'ejerza, ejerzas, ejerza, ejerzamos, ejerzáis, ejerzan',
  },
  extinguir: {
    pres: 'extingo, extingues, extingue, extinguimos, extinguís, extinguen',
    subjPres: 'extinga, extingas, extinga, extingamos, extingáis, extingan',
  },
  converger: {
    pres: 'converjo, converges, converge, convergemos, convergéis, convergen',
  },
};

const report = createReport();
checkParadigms(report, EXPECTED, conjugate);

// Every verb in the database must conjugate into well-formed output.
const FORM_KEYS = [
  'pres', 'pret', 'imperf', 'fut', 'cond', 'presPerf', 'pastPerf', 'pretAnt', 'futPerf',
  'condPerf', 'subjPres', 'subjImperf', 'subjFut', 'subjPresPerf', 'subjPluperf',
  'subjFutPerf', 'impAff', 'impNeg',
];
const spanishCount = checkInflectedDatabase(report, {
  verbs: VERBS,
  conjugate,
  lang: 'es',
  formKeys: FORM_KEYS,
  // -ñir / -llir verbs absorb the i: teñir -> tiñendo, bullir -> bullendo
  gerund: /(ando|iendo|yendo|(ñ|ll)endo)$/,
  participle: /(ado|ido|ído|to|cho)$/,
});

report.finish(`${report.checks} paradigm checks, ${Object.keys(VERBS).length} English verbs, ${spanishCount} Spanish translations`);
