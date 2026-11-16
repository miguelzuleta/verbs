// Run with: node test.js
// Checks the Icelandic conjugation engine against known paradigms (every form written out by
// hand, not taken from the engine), then runs every verb of verbs.js through it.
const fs = require('fs');
const path = require('path');
const { conjugate, NONE } = require('./conjugate.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const FORM_KEYS = [
  'pres', 'past', 'perf', 'plup', 'fut', 'futPerf', 'subjPres', 'subjPast', 'subjPerf', 'subjPlup',
  'cond', 'condPerf', 'impAff',
];

// The compound tenses are mechanical: hafa / munu / myndi (written out here, not taken from the
// engine) followed by the supine or the infinitive.
const HAFA_PRES = 'hef, hefur, hefur, höfum, hafið, hafa';
const HAFA_PAST = 'hafði, hafðir, hafði, höfðum, höfðuð, höfðu';
const HAFA_SUBJ = 'hafi, hafir, hafi, höfum, hafið, hafi';
const HAFA_SUBJPAST = 'hefði, hefðir, hefði, hefðum, hefðuð, hefðu';
const MUNU = 'mun, munt, mun, munum, munuð, munu';
const MYNDI = 'myndi, myndir, myndi, myndum, mynduð, myndu';
const after = (forms, rest) => forms.split(', ').map(form => `${form} ${rest}`).join(', ');
function tails(inf, supine) {
  return {
    perf: after(HAFA_PRES, supine), plup: after(HAFA_PAST, supine),
    fut: after(MUNU, inf), futPerf: after(MUNU, `hafa ${supine}`),
    subjPerf: after(HAFA_SUBJ, supine), subjPlup: after(HAFA_SUBJPAST, supine),
    cond: after(MYNDI, inf), condPerf: after(MYNDI, `hafa ${supine}`),
    participle: supine,
  };
}
const NO_IMP = [NONE, NONE, NONE, NONE, NONE, NONE].join(', ');
const imp = (second, we, you) => `${NONE}, ${second}, ${NONE}, ${we}, ${you}, ${NONE}`;

// verb -> { parts?, tense: 'ég, þú, hann, við, þið, þeir' }   (gerund / participle as plain strings;
// `inf` overrides the infinitive when the same verb appears twice).
const EXPECTED = {};

// ---- whole paradigms: weak verbs ----
Object.assign(EXPECTED, {
  tala: { // class 1: no parts
    pres: 'tala, talar, talar, tölum, talið, tala',
    past: 'talaði, talaðir, talaði, töluðum, töluðuð, töluðu',
    subjPres: 'tali, talir, tali, tölum, talið, tali',
    subjPast: 'talaði, talaðir, talaði, töluðum, töluðuð, töluðu',
    impAff: imp('talaðu', 'tölum', 'talið'),
    gerund: 'talandi', ...tails('tala', 'talað'),
  },
  kalla: {
    pres: 'kalla, kallar, kallar, köllum, kallið, kalla',
    past: 'kallaði, kallaðir, kallaði, kölluðum, kölluðuð, kölluðu',
    subjPres: 'kalli, kallir, kalli, köllum, kallið, kalli',
    subjPast: 'kallaði, kallaðir, kallaði, kölluðum, kölluðuð, kölluðu',
    impAff: imp('kallaðu', 'köllum', 'kallið'),
    gerund: 'kallandi', ...tails('kalla', 'kallað'),
  },
  heyra: {
    parts: ['heyri', 'heyrir', 'heyrði', 'heyrðum', 'heyrt'],
    pres: 'heyri, heyrir, heyrir, heyrum, heyrið, heyra',
    past: 'heyrði, heyrðir, heyrði, heyrðum, heyrðuð, heyrðu',
    subjPres: 'heyri, heyrir, heyri, heyrum, heyrið, heyri',
    subjPast: 'heyrði, heyrðir, heyrði, heyrðum, heyrðuð, heyrðu',
    impAff: imp('heyrðu', 'heyrum', 'heyrið'),
    gerund: 'heyrandi', ...tails('heyra', 'heyrt'),
  },
  kaupa: {
    parts: ['kaupi', 'kaupir', 'keypti', 'keyptum', 'keypt'],
    pres: 'kaupi, kaupir, kaupir, kaupum, kaupið, kaupa',
    past: 'keypti, keyptir, keypti, keyptum, keyptuð, keyptu',
    subjPres: 'kaupi, kaupir, kaupi, kaupum, kaupið, kaupi',
    subjPast: 'keypti, keyptir, keypti, keyptum, keyptuð, keyptu',
    impAff: imp('kauptu', 'kaupum', 'kaupið'),
    gerund: 'kaupandi', ...tails('kaupa', 'keypt'),
  },
  setja: {
    parts: ['set', 'setur', 'setti', 'settum', 'sett'],
    pres: 'set, setur, setur, setjum, setjið, setja',
    past: 'setti, settir, setti, settum, settuð, settu',
    subjPres: 'setji, setjir, setji, setjum, setjið, setji',
    subjPast: 'setti, settir, setti, settum, settuð, settu',
    impAff: imp('settu', 'setjum', 'setjið'),
    gerund: 'setjandi', ...tails('setja', 'sett'),
  },
  telja: {
    parts: ['tel', 'telur', 'taldi', 'töldum', 'talið'],
    pres: 'tel, telur, telur, teljum, teljið, telja',
    past: 'taldi, taldir, taldi, töldum, tölduð, töldu',
    subjPres: 'telji, teljir, telji, teljum, teljið, telji',
    subjPast: 'teldi, teldir, teldi, teldum, telduð, teldu',
    impAff: imp('teldu', 'teljum', 'teljið'),
    gerund: 'teljandi', ...tails('telja', 'talið'),
  },
  segja: {
    parts: ['segi', 'segir', 'sagði', 'sögðum', 'sagt'],
    pres: 'segi, segir, segir, segjum, segið, segja',
    past: 'sagði, sagðir, sagði, sögðum, sögðuð, sögðu',
    subjPres: 'segi, segir, segi, segjum, segið, segi',
    subjPast: 'segði, segðir, segði, segðum, segðuð, segðu',
    impAff: imp('segðu', 'segjum', 'segið'),
    gerund: 'segjandi', ...tails('segja', 'sagt'),
  },
});

const report = createReport();

// ---- whole paradigms: strong verbs ----
Object.assign(EXPECTED, {
  taka: {
    parts: ['tek', 'tekur', 'tók', 'tókum', 'tekið'],
    pres: 'tek, tekur, tekur, tökum, takið, taka',
    past: 'tók, tókst, tók, tókum, tókuð, tóku',
    subjPres: 'taki, takir, taki, tökum, takið, taki',
    subjPast: 'tæki, tækir, tæki, tækjum, tækjuð, tækju',
    impAff: imp('taktu', 'tökum', 'takið'),
    gerund: 'takandi', ...tails('taka', 'tekið'),
  },
  fara: {
    parts: ['fer', 'ferð', 'fór', 'fórum', 'farið'],
    pres: 'fer, ferð, fer, förum, farið, fara',
    past: 'fór, fórst, fór, fórum, fóruð, fóru',
    subjPres: 'fari, farir, fari, förum, farið, fari',
    subjPast: 'færi, færir, færi, færum, færuð, færu',
    impAff: imp('farðu', 'förum', 'farið'),
    gerund: 'farandi', ...tails('fara', 'farið'),
  },
  koma: {
    parts: ['kem', 'kemur', 'kom', 'komum', 'komið'],
    pres: 'kem, kemur, kemur, komum, komið, koma',
    past: 'kom, komst, kom, komum, komuð, komu',
    subjPres: 'komi, komir, komi, komum, komið, komi',
    subjPast: 'kæmi, kæmir, kæmi, kæmum, kæmuð, kæmu',
    impAff: imp('komdu', 'komum', 'komið'),
    gerund: 'komandi', ...tails('koma', 'komið'),
  },
  gefa: {
    parts: ['gef', 'gefur', 'gaf', 'gáfum', 'gefið'],
    pres: 'gef, gefur, gefur, gefum, gefið, gefa',
    past: 'gaf, gafst, gaf, gáfum, gáfuð, gáfu',
    subjPres: 'gefi, gefir, gefi, gefum, gefið, gefi',
    subjPast: 'gæfi, gæfir, gæfi, gæfum, gæfuð, gæfu',
    impAff: imp('gefðu', 'gefum', 'gefið'),
    gerund: 'gefandi', ...tails('gefa', 'gefið'),
  },
  bjóða: {
    parts: ['býð', 'býður', 'bauð', 'buðum', 'boðið'],
    pres: 'býð, býður, býður, bjóðum, bjóðið, bjóða',
    past: 'bauð, bauðst, bauð, buðum, buðuð, buðu',
    subjPres: 'bjóði, bjóðir, bjóði, bjóðum, bjóðið, bjóði',
    subjPast: 'byði, byðir, byði, byðum, byðuð, byðu',
    impAff: imp('bjóddu', 'bjóðum', 'bjóðið'),
    gerund: 'bjóðandi', ...tails('bjóða', 'boðið'),
  },
  finna: {
    parts: ['finn', 'finnur', 'fann', 'fundum', 'fundið'],
    pres: 'finn, finnur, finnur, finnum, finnið, finna',
    past: 'fann, fannst, fann, fundum, funduð, fundu',
    subjPres: 'finni, finnir, finni, finnum, finnið, finni',
    subjPast: 'fyndi, fyndir, fyndi, fyndum, fynduð, fyndu',
    impAff: imp('finndu', 'finnum', 'finnið'),
    gerund: 'finnandi', ...tails('finna', 'fundið'),
  },
  halda: {
    parts: ['held', 'heldur', 'hélt', 'héldum', 'haldið'],
    pres: 'held, heldur, heldur, höldum, haldið, halda',
    past: 'hélt, hélst, hélt, héldum, hélduð, héldu',
    subjPres: 'haldi, haldir, haldi, höldum, haldið, haldi',
    subjPast: 'héldi, héldir, héldi, héldum, hélduð, héldu',
    impAff: imp('haltu', 'höldum', 'haldið'),
    gerund: 'haldandi', ...tails('halda', 'haldið'),
  },
  standa: {
    parts: ['stend', 'stendur', 'stóð', 'stóðum', 'staðið'],
    pres: 'stend, stendur, stendur, stöndum, standið, standa',
    past: 'stóð, stóðst, stóð, stóðum, stóðuð, stóðu',
    subjPres: 'standi, standir, standi, stöndum, standið, standi',
    subjPast: 'stæði, stæðir, stæði, stæðum, stæðuð, stæðu',
    impAff: imp('stattu', 'stöndum', 'standið'),
    gerund: 'standandi', ...tails('standa', 'staðið'),
  },
  sitja: {
    parts: ['sit', 'situr', 'sat', 'sátum', 'setið'],
    pres: 'sit, situr, situr, sitjum, sitjið, sitja',
    past: 'sat, sast, sat, sátum, sátuð, sátu',
    subjPres: 'sitji, sitjir, sitji, sitjum, sitjið, sitji',
    subjPast: 'sæti, sætir, sæti, sætum, sætuð, sætu',
    impAff: imp('sittu', 'sitjum', 'sitjið'),
    gerund: 'sitjandi', ...tails('sitja', 'setið'),
  },
  liggja: {
    parts: ['ligg', 'liggur', 'lá', 'lágum', 'legið'],
    pres: 'ligg, liggur, liggur, liggjum, liggið, liggja',
    past: 'lá, lást, lá, lágum, láguð, lágu',
    subjPres: 'liggi, liggir, liggi, liggjum, liggið, liggi',
    subjPast: 'lægi, lægir, lægi, lægjum, lægjuð, lægju',
    gerund: 'liggjandi', ...tails('liggja', 'legið'),
  },
  leggja: {
    parts: ['legg', 'leggur', 'lagði', 'lögðum', 'lagt'],
    pres: 'legg, leggur, leggur, leggjum, leggið, leggja',
    past: 'lagði, lagðir, lagði, lögðum, lögðuð, lögðu',
    subjPres: 'leggi, leggir, leggi, leggjum, leggið, leggi',
    subjPast: 'legði, legðir, legði, legðum, legðuð, legðu',
    impAff: imp('legðu', 'leggjum', 'leggið'),
    gerund: 'leggjandi', ...tails('leggja', 'lagt'),
  },
});

// ---- whole paradigms: the irregular verbs ----
Object.assign(EXPECTED, {
  sjá: {
    parts: ['sé', 'sérð', 'sá', 'sáum', 'séð'],
    pres: 'sé, sérð, sér, sjáum, sjáið, sjá',
    past: 'sá, sást, sá, sáum, sáuð, sáu',
    subjPres: 'sjái, sjáir, sjái, sjáum, sjáið, sjái',
    subjPast: 'sæi, sæir, sæi, sæjum, sæjuð, sæju',
    impAff: imp('sjáðu', 'sjáum', 'sjáið'),
    gerund: 'sjáandi', ...tails('sjá', 'séð'),
  },
  fá: {
    parts: ['fæ', 'færð', 'fékk', 'fengum', 'fengið'],
    pres: 'fæ, færð, fær, fáum, fáið, fá',
    past: 'fékk, fékkst, fékk, fengum, fenguð, fengu',
    subjPres: 'fái, fáir, fái, fáum, fáið, fái',
    subjPast: 'fengi, fengir, fengi, fengjum, fengjuð, fengju',
    impAff: imp('fáðu', 'fáum', 'fáið'),
    ...tails('fá', 'fengið'),
  },
  vera: {
    parts: ['er', 'ert', 'var', 'vorum', 'verið'],
    pres: 'er, ert, er, erum, eruð, eru',
    past: 'var, varst, var, vorum, voruð, voru',
    subjPres: 'sé, sért, sé, séum, séuð, séu',
    subjPast: 'væri, værir, væri, værum, væruð, væru',
    impAff: imp('vertu', 'verum', 'verið'),
    gerund: 'verandi', ...tails('vera', 'verið'),
  },
  hafa: {
    parts: ['hef', 'hefur', 'hafði', 'höfðum', 'haft'],
    pres: 'hef, hefur, hefur, höfum, hafið, hafa',
    past: 'hafði, hafðir, hafði, höfðum, höfðuð, höfðu',
    subjPres: 'hafi, hafir, hafi, höfum, hafið, hafi',
    subjPast: 'hefði, hefðir, hefði, hefðum, hefðuð, hefðu',
    impAff: imp('hafðu', 'höfum', 'hafið'),
    gerund: 'hafandi', ...tails('hafa', 'haft'),
  },
  munu: { // the supine in the parts only fills the entry shape; the verb has none, so the engine ignores it
    parts: ['mun', 'munt', 'mundi', 'mundum', 'munað'],
    pres: 'mun, munt, mun, munum, munuð, munu',
    past: 'mundi, mundir, mundi, mundum, munduð, mundu',
    subjPres: 'muni, munir, muni, munum, munuð, muni',
    subjPast: 'myndi, myndir, myndi, myndum, mynduð, myndu',
    // no supine and no infinitive after an auxiliary: only the present and the past exist
    perf: NO_IMP, plup: NO_IMP, fut: NO_IMP, futPerf: NO_IMP, subjPerf: NO_IMP, subjPlup: NO_IMP, cond: NO_IMP, condPerf: NO_IMP,
    impAff: NO_IMP, gerund: NONE, participle: NONE,
  },
  vilja: {
    parts: ['vil', 'vilt', 'vildi', 'vildum', 'viljað'],
    pres: 'vil, vilt, vill, viljum, viljið, vilja',
    past: 'vildi, vildir, vildi, vildum, vilduð, vildu',
    subjPres: 'vilji, viljir, vilji, viljum, viljið, vilji',
    subjPast: 'vildi, vildir, vildi, vildum, vilduð, vildu',
    impAff: NO_IMP, gerund: 'viljandi', ...tails('vilja', 'viljað'),
  },
  vita: {
    parts: ['veit', 'veist', 'vissi', 'vissum', 'vitað'],
    pres: 'veit, veist, veit, vitum, vitið, vita',
    past: 'vissi, vissir, vissi, vissum, vissuð, vissu',
    subjPres: 'viti, vitir, viti, vitum, vitið, viti',
    subjPast: 'vissi, vissir, vissi, vissum, vissuð, vissu',
    impAff: imp('vittu', 'vitum', 'vitið'),
    gerund: 'vitandi', ...tails('vita', 'vitað'),
  },
  eiga: {
    parts: ['á', 'átt', 'átti', 'áttum', 'átt'],
    pres: 'á, átt, á, eigum, eigið, eiga',
    past: 'átti, áttir, átti, áttum, áttuð, áttu',
    subjPres: 'eigi, eigir, eigi, eigum, eigið, eigi',
    subjPast: 'ætti, ættir, ætti, ættum, ættuð, ættu',
    impAff: imp('eigðu', 'eigum', 'eigið'),
    gerund: 'eigandi', ...tails('eiga', 'átt'),
  },
  geta: {
    parts: ['get', 'getur', 'gat', 'gátum', 'getað'],
    pres: 'get, getur, getur, getum, getið, geta',
    past: 'gat, gast, gat, gátum, gátuð, gátu',
    subjPres: 'geti, getir, geti, getum, getið, geti',
    subjPast: 'gæti, gætir, gæti, gætum, gætuð, gætu',
    impAff: imp('gettu', 'getum', 'getið'),
    gerund: 'getandi', ...tails('geta', 'getað'),
  },
  skulu: {
    parts: ['skal', 'skalt', 'skyldi', 'skyldum', 'skolað'],
    pres: 'skal, skalt, skal, skulum, skuluð, skulu',
    past: 'skyldi, skyldir, skyldi, skyldum, skylduð, skyldu',
    subjPres: 'skuli, skulir, skuli, skulum, skuluð, skuli',
    subjPast: 'skyldi, skyldir, skyldi, skyldum, skylduð, skyldu',
    perf: NO_IMP, plup: NO_IMP, fut: NO_IMP, futPerf: NO_IMP, subjPerf: NO_IMP, subjPlup: NO_IMP, cond: NO_IMP, condPerf: NO_IMP,
    impAff: NO_IMP, gerund: NONE, participle: NONE,
  },
  gera: {
    parts: ['geri', 'gerir', 'gerði', 'gerðum', 'gert'],
    pres: 'geri, gerir, gerir, gerum, gerið, gera',
    past: 'gerði, gerðir, gerði, gerðum, gerðuð, gerðu',
    subjPres: 'geri, gerir, geri, gerum, gerið, geri',
    subjPast: 'gerði, gerðir, gerði, gerðum, gerðuð, gerðu',
    impAff: imp('gerðu', 'gerum', 'gerið'),
    gerund: 'gerandi', ...tails('gera', 'gert'),
  },
});

// ---- strong verbs, class by class (partial paradigms) ----
Object.assign(EXPECTED, {
  // class 1 (í - ei - i - i)
  bíta: {
    parts: ['bít', 'bítur', 'beit', 'bitum', 'bitið'],
    pres: 'bít, bítur, bítur, bítum, bítið, bíta',
    past: 'beit, beist, beit, bitum, bituð, bitu',
    subjPast: 'biti, bitir, biti, bitum, bituð, bitu',
    impAff: imp('bíttu', 'bítum', 'bítið'), participle: 'bitið',
  },
  bíða: {
    parts: ['bíð', 'bíður', 'beið', 'biðum', 'beðið'],
    past: 'beið, beiðst, beið, biðum, biðuð, biðu',
    subjPast: 'biði, biðir, biði, biðum, biðuð, biðu',
    impAff: imp('bíddu', 'bíðum', 'bíðið'), participle: 'beðið',
  },
  stíga: {
    parts: ['stíg', 'stígur', 'steig', 'stigum', 'stigið'],
    past: 'steig, steigst, steig, stigum, stiguð, stigu',
    subjPast: 'stigi, stigir, stigi, stigjum, stigjuð, stigju',
    impAff: imp('stígðu', 'stígum', 'stígið'),
  },
  líta: {
    parts: ['lít', 'lítur', 'leit', 'litum', 'litið'],
    past: 'leit, leist, leit, litum, lituð, litu',
    subjPast: 'liti, litir, liti, litum, lituð, litu',
    impAff: imp('líttu', 'lítum', 'lítið'),
  },
  rísa: { // 1sg = 2sg = 3sg
    parts: ['rís', 'rís', 'reis', 'risum', 'risið'],
    pres: 'rís, rís, rís, rísum, rísið, rísa',
    past: 'reis, reist, reis, risum, risuð, risu',
    impAff: imp('rístu', 'rísum', 'rísið'),
  },
  grípa: {
    parts: ['grip', 'grípur', 'greip', 'gripum', 'gripið'],
    pres: 'grip, grípur, grípur, grípum, grípið, grípa',
    past: 'greip, greipst, greip, gripum, gripuð, gripu',
    subjPast: 'gripi, gripir, gripi, gripum, gripuð, gripu',
    impAff: imp('gríptu', 'grípum', 'grípið'),
  },
  // class 2 (jó/jú/ú - au - u - o)
  brjóta: {
    parts: ['brýt', 'brýtur', 'braut', 'brutum', 'brotið'],
    pres: 'brýt, brýtur, brýtur, brjótum, brjótið, brjóta',
    past: 'braut, braust, braut, brutum, brutuð, brutu',
    subjPast: 'bryti, brytir, bryti, brytum, brytuð, brytu',
    impAff: imp('brjóttu', 'brjótum', 'brjótið'),
  },
  skjóta: {
    parts: ['skýt', 'skýtur', 'skaut', 'skutum', 'skotið'],
    past: 'skaut, skaust, skaut, skutum, skutuð, skutu',
    subjPast: 'skyti, skytir, skyti, skytum, skytuð, skytu',
  },
  fljúga: {
    parts: ['flýg', 'flýgur', 'flaug', 'flugum', 'flogið'],
    pres: 'flýg, flýgur, flýgur, fljúgum, fljúgið, fljúga',
    past: 'flaug, flaugst, flaug, flugum, fluguð, flugu',
    subjPast: 'flygi, flygir, flygi, flygjum, flygjuð, flygju',
    impAff: imp('fljúgðu', 'fljúgum', 'fljúgið'),
  },
  ljúga: {
    parts: ['lýg', 'lýgur', 'laug', 'lugum', 'logið'],
    subjPast: 'lygi, lygir, lygi, lygjum, lygjuð, lygju',
  },
  kjósa: {
    parts: ['kýs', 'kýst', 'kaus', 'kusum', 'kosið'],
    pres: 'kýs, kýst, kýs, kjósum, kjósið, kjósa',
    past: 'kaus, kaust, kaus, kusum, kusuð, kusu',
    subjPast: 'kysi, kysir, kysi, kysum, kysuð, kysu',
    impAff: imp('kjóstu', 'kjósum', 'kjósið'),
  },
  ljúka: {
    parts: ['lýk', 'lýkur', 'lauk', 'lukum', 'lokið'],
    past: 'lauk, laukst, lauk, lukum, lukuð, luku',
    subjPast: 'lyki, lykir, lyki, lykjum, lykjuð, lykju',
    impAff: imp('ljúktu', 'ljúkum', 'ljúkið'),
  },
  njóta: {
    parts: ['nýt', 'nýtur', 'naut', 'nutum', 'notið'],
    past: 'naut, naust, naut, nutum, nutuð, nutu',
    subjPast: 'nyti, nytir, nyti, nytum, nytuð, nytu',
    impAff: imp('njóttu', 'njótum', 'njótið'),
  },
  hlaupa: {
    parts: ['hleyp', 'hleypur', 'hljóp', 'hlupum', 'hlaupið'],
    pres: 'hleyp, hleypur, hleypur, hlaupum, hlaupið, hlaupa',
    past: 'hljóp, hljópst, hljóp, hlupum, hlupuð, hlupu',
    subjPast: 'hlypi, hlypir, hlypi, hlypum, hlypuð, hlypu',
    impAff: imp('hlauptu', 'hlaupum', 'hlaupið'),
  },
  // class 3 (e/i/y/ja - a - u - u/o)
  drekka: {
    parts: ['drekk', 'drekkur', 'drakk', 'drukkum', 'drukkið'],
    pres: 'drekk, drekkur, drekkur, drekkum, drekkið, drekka',
    past: 'drakk, drakkst, drakk, drukkum, drukkuð, drukku',
    subjPast: 'drykki, drykkir, drykki, drykkjum, drykkjuð, drykkju',
    impAff: imp('drekktu', 'drekkum', 'drekkið'),
  },
  binda: {
    parts: ['bind', 'bindur', 'batt', 'bundum', 'bundið'],
    pres: 'bind, bindur, bindur, bindum, bindið, binda',
    subjPast: 'byndi, byndir, byndi, byndum, bynduð, byndu',
    impAff: imp('bindu', 'bindum', 'bindið'),
  },
  vinna: {
    parts: ['vinn', 'vinnur', 'vann', 'unnum', 'unnið'],
    past: 'vann, vannst, vann, unnum, unnuð, unnu',
    subjPast: 'ynni, ynnir, ynni, ynnum, ynnuð, ynnu',
    impAff: imp('vinndu', 'vinnum', 'vinnið'),
  },
  brenna: {
    parts: ['brenn', 'brennur', 'brann', 'brunnum', 'brunnið'],
    past: 'brann, brannst, brann, brunnum, brunnuð, brunnu',
    subjPast: 'brynni, brynnir, brynni, brynnum, brynnuð, brynnu',
  },
  syngja: {
    parts: ['syng', 'syngur', 'söng', 'sungum', 'sungið'],
    pres: 'syng, syngur, syngur, syngjum, syngið, syngja',
    past: 'söng, söngst, söng, sungum, sunguð, sungu',
    subjPast: 'syngi, syngir, syngi, syngjum, syngjuð, syngju',
    impAff: imp('syngdu', 'syngjum', 'syngið'),
  },
  hverfa: {
    parts: ['hverf', 'hverfur', 'hvarf', 'hurfum', 'horfið'],
    past: 'hvarf, hvarfst, hvarf, hurfum, hurfuð, hurfu',
    subjPast: 'hyrfi, hyrfir, hyrfi, hyrfum, hyrfuð, hyrfu',
    impAff: imp('hverfðu', 'hverfum', 'hverfið'),
  },
  verða: {
    parts: ['verð', 'verður', 'varð', 'urðum', 'orðið'],
    pres: 'verð, verður, verður, verðum, verðið, verða',
    past: 'varð, varðst, varð, urðum, urðuð, urðu',
    subjPast: 'yrði, yrðir, yrði, yrðum, yrðuð, yrðu',
  },
  springa: {
    parts: ['spring', 'springur', 'sprakk', 'sprungum', 'sprungið'],
    past: 'sprakk, sprakkst, sprakk, sprungum, sprunguð, sprungu',
    subjPast: 'spryngi, spryngir, spryngi, spryngjum, spryngjuð, spryngju',
  },
  // class 4 (e - a - á - o)
  bera: {
    parts: ['ber', 'berð', 'bar', 'bárum', 'borið'],
    pres: 'ber, berð, ber, berum, berið, bera',
    past: 'bar, barst, bar, bárum, báruð, báru',
    subjPast: 'bæri, bærir, bæri, bærum, bæruð, bæru',
    impAff: imp('berðu', 'berum', 'berið'),
  },
  skera: {
    parts: ['sker', 'skerð', 'skar', 'skárum', 'skorið'],
    pres: 'sker, skerð, sker, skerum, skerið, skera',
    past: 'skar, skarst, skar, skárum, skáruð, skáru',
    subjPast: 'skæri, skærir, skæri, skærum, skæruð, skæru',
  },
  stela: {
    parts: ['stel', 'stelur', 'stal', 'stálum', 'stolið'],
    pres: 'stel, stelur, stelur, stelum, stelið, stela',
    past: 'stal, stalst, stal, stálum, stáluð, stálu',
    subjPast: 'stæli, stælir, stæli, stælum, stæluð, stælu',
    impAff: imp('steldu', 'stelum', 'stelið'),
  },
  nema: {
    parts: ['nem', 'nemur', 'nam', 'námum', 'numið'],
    past: 'nam, namst, nam, námum, námuð, námu',
    subjPast: 'næmi, næmir, næmi, næmum, næmuð, næmu',
    impAff: imp('nemdu', 'nemum', 'nemið'),
  },
  // class 5 (e - a - á - e)
  lesa: {
    parts: ['les', 'lest', 'las', 'lásum', 'lesið'],
    pres: 'les, lest, les, lesum, lesið, lesa',
    past: 'las, last, las, lásum, lásuð, lásu',
    subjPast: 'læsi, læsir, læsi, læsum, læsuð, læsu',
    impAff: imp('lestu', 'lesum', 'lesið'),
  },
  éta: {
    parts: ['et', 'étur', 'át', 'átum', 'étið'],
    pres: 'et, étur, étur, étum, étið, éta',
    past: 'át, ást, át, átum, átuð, átu',
    subjPast: 'æti, ætir, æti, ætum, ætuð, ætu',
    impAff: imp('éttu', 'étum', 'étið'),
  },
  drepa: {
    parts: ['drep', 'drepur', 'drap', 'drápum', 'drepið'],
    past: 'drap, drapst, drap, drápum, drápuð, drápu',
    subjPast: 'dræpi, dræpir, dræpi, dræpum, dræpuð, dræpu',
    impAff: imp('dreptu', 'drepum', 'drepið'),
  },
  biðja: {
    parts: ['bið', 'biður', 'bað', 'báðum', 'beðið'],
    pres: 'bið, biður, biður, biðjum, biðjið, biðja',
    past: 'bað, baðst, bað, báðum, báðuð, báðu',
    subjPres: 'biðji, biðjir, biðji, biðjum, biðjið, biðji',
    subjPast: 'bæði, bæðir, bæði, bæðum, bæðuð, bæðu',
    impAff: imp('biddu', 'biðjum', 'biðjið'),
  },
  þiggja: { // a weak-looking past with a strong vowel
    parts: ['þigg', 'þiggur', 'þáði', 'þáðum', 'þegið'],
    pres: 'þigg, þiggur, þiggur, þiggjum, þiggið, þiggja',
    past: 'þáði, þáðir, þáði, þáðum, þáðuð, þáðu',
    subjPast: 'þæði, þæðir, þæði, þæðum, þæðuð, þæðu',
  },
  // class 6 (a - ó - ó - a)
  draga: {
    parts: ['dreg', 'dregur', 'dró', 'drógum', 'dregið'],
    pres: 'dreg, dregur, dregur, drögum, dragið, draga',
    past: 'dró, dróst, dró, drógum, dróguð, drógu',
    subjPast: 'drægi, drægir, drægi, drægjum, drægjuð, drægju',
    impAff: imp('dragðu', 'drögum', 'dragið'),
  },
  sofa: {
    parts: ['sef', 'sefur', 'svaf', 'sváfum', 'sofið'],
    pres: 'sef, sefur, sefur, sofum, sofið, sofa',
    past: 'svaf, svafst, svaf, sváfum, sváfuð, sváfu',
    subjPast: 'svæfi, svæfir, svæfi, svæfum, svæfuð, svæfu',
    impAff: imp('sofðu', 'sofum', 'sofið'),
  },
  slá: {
    parts: ['slæ', 'slærð', 'sló', 'slógum', 'slegið'],
    pres: 'slæ, slærð, slær, sláum, sláið, slá',
    past: 'sló, slóst, sló, slógum, slóguð, slógu',
    subjPast: 'slægi, slægir, slægi, slægjum, slægjuð, slægju',
    impAff: imp('sláðu', 'sláum', 'sláið'),
  },
  hlaða: {
    parts: ['hleð', 'hleður', 'hlóð', 'hlóðum', 'hlaðið'],
    pres: 'hleð, hleður, hleður, hlöðum, hlaðið, hlaða',
    past: 'hlóð, hlóðst, hlóð, hlóðum, hlóðuð, hlóðu',
    subjPast: 'hlæði, hlæðir, hlæði, hlæðum, hlæðuð, hlæðu',
  },
  búa: {
    parts: ['bý', 'býrð', 'bjó', 'bjuggum', 'búið'],
    pres: 'bý, býrð, býr, búum, búið, búa',
    past: 'bjó, bjóst, bjó, bjuggum, bjugguð, bjuggu',
    subjPast: 'byggi, byggir, byggi, byggjum, byggjuð, byggju',
    impAff: imp('búðu', 'búum', 'búið'),
  },
  snúa: { // a past 'sneri' with weak endings
    parts: ['sný', 'snýrð', 'sneri', 'snerum', 'snúið'],
    pres: 'sný, snýrð, snýr, snúum, snúið, snúa',
    past: 'sneri, snerir, sneri, snerum, sneruð, sneru',
    subjPast: 'sneri, snerir, sneri, snerum, sneruð, sneru',
    impAff: imp('snúðu', 'snúum', 'snúið'),
  },
  deyja: {
    parts: ['dey', 'deyr', 'dó', 'dóum', 'dáið'],
    pres: 'dey, deyr, deyr, deyjum, deyið, deyja',
    past: 'dó, dóst, dó, dóum, dóuð, dóu',
    subjPast: 'dæi, dæir, dæi, dæjum, dæjuð, dæju',
    impAff: imp('deyðu', 'deyjum', 'deyið'),
  },
  hlæja: {
    parts: ['hlæ', 'hlærð', 'hló', 'hlógum', 'hlegið'],
    past: 'hló, hlóst, hló, hlógum, hlóguð, hlógu',
    subjPast: 'hlægi, hlægir, hlægi, hlægjum, hlægjuð, hlægju',
  },
  hefja: {
    parts: ['hef', 'hefur', 'hóf', 'hófum', 'hafið'],
    pres: 'hef, hefur, hefur, hefjum, hefjið, hefja',
    past: 'hóf, hófst, hóf, hófum, hófuð, hófu',
    subjPast: 'hæfi, hæfir, hæfi, hæfum, hæfuð, hæfu',
    impAff: imp('hefðu', 'hefjum', 'hefjið'),
  },
  ala: {
    parts: ['ala', 'elur', 'ól', 'ólum', 'alið'],
    pres: 'ala, elur, elur, ölum, alið, ala',
    past: 'ól, ólst, ól, ólum, óluð, ólu',
    subjPast: 'æli, ælir, æli, ælum, æluð, ælu',
  },
  // class 7 (reduplicating verbs)
  falla: {
    parts: ['fell', 'fellur', 'féll', 'féllum', 'fallið'],
    pres: 'fell, fellur, fellur, föllum, fallið, falla',
    past: 'féll, féllst, féll, féllum, félluð, féllu',
    subjPast: 'félli, féllir, félli, féllum, félluð, féllu',
  },
  heita: {
    parts: ['heiti', 'heitir', 'hét', 'hétum', 'heitið'],
    pres: 'heiti, heitir, heitir, heitum, heitið, heita',
    past: 'hét, hést, hét, hétum, hétuð, hétu',
    subjPast: 'héti, hétir, héti, hétum, hétuð, hétu',
    impAff: imp('heittu', 'heitum', 'heitið'),
  },
  hanga: {
    parts: ['hangi', 'hangir', 'hékk', 'héngum', 'hangið'],
    pres: 'hangi, hangir, hangir, höngum, hangið, hanga',
    past: 'hékk, hékkst, hékk, héngum, hénguð, héngu',
    subjPast: 'héngi, héngir, héngi, héngjum, héngjuð, héngju',
  },
  ráða: {
    parts: ['ræð', 'ræður', 'réð', 'réðum', 'ráðið'],
    pres: 'ræð, ræður, ræður, ráðum, ráðið, ráða',
    past: 'réð, réðst, réð, réðum, réðuð, réðu',
    subjPast: 'réði, réðir, réði, réðum, réðuð, réðu',
    impAff: imp('ráddu', 'ráðum', 'ráðið'),
  },
  gráta: {
    parts: ['græt', 'grætur', 'grét', 'grétum', 'grátið'],
    pres: 'græt, grætur, grætur, grátum, grátið, gráta',
    past: 'grét, grést, grét, grétum, grétuð, grétu',
    subjPast: 'gréti, grétir, gréti, grétum, grétuð, grétu',
    impAff: imp('gráttu', 'grátum', 'grátið'),
  },
  láta: {
    parts: ['læt', 'lætur', 'lét', 'létum', 'látið'],
    pres: 'læt, lætur, lætur, látum, látið, láta',
    past: 'lét, lést, lét, létum, létuð, létu',
    subjPast: 'léti, létir, léti, létum, létuð, létu',
    impAff: imp('láttu', 'látum', 'látið'),
  },
  blása: {
    parts: ['blæs', 'blæs', 'blés', 'blésum', 'blásið'],
    pres: 'blæs, blæs, blæs, blásum, blásið, blása',
    past: 'blés, blést, blés, blésum, blésuð, blésu',
    subjPast: 'blési, blésir, blési, blésum, blésuð, blésu',
    impAff: imp('blástu', 'blásum', 'blásið'),
  },
  detta: {
    parts: ['dett', 'dettur', 'datt', 'duttum', 'dottið'],
    pres: 'dett, dettur, dettur, dettum, dettið, detta',
    subjPast: 'dytti, dyttir, dytti, dyttum, dyttuð, dyttu',
    impAff: imp('dettu', 'dettum', 'dettið'),
  },
  auka: {
    parts: ['eyk', 'eykur', 'jók', 'jukum', 'aukið'], // like hlaupa / hlupum, ausa / jusum: the past plural has u, not ó
    pres: 'eyk, eykur, eykur, aukum, aukið, auka',
    past: 'jók, jókst, jók, jukum, jukuð, juku',
    subjPast: 'yki, ykir, yki, ykjum, ykjuð, ykju',
    impAff: imp('auktu', 'aukum', 'aukið'),
  },
  ganga: {
    parts: ['geng', 'gengur', 'gekk', 'gengum', 'gengið'],
    pres: 'geng, gengur, gengur, göngum, gangið, ganga',
    past: 'gekk, gekkst, gekk, gengum, genguð, gengu',
    subjPres: 'gangi, gangir, gangi, göngum, gangið, gangi',
    subjPast: 'gengi, gengir, gengi, gengjum, gengjuð, gengju',
    impAff: imp('gakktu', 'göngum', 'gangið'),
  },
});

// ---- weak verbs of the other classes (-ði, -di, -ti) ----
Object.assign(EXPECTED, {
  fylla: {
    parts: ['fylli', 'fyllir', 'fyllti', 'fylltum', 'fyllt'],
    pres: 'fylli, fyllir, fyllir, fyllum, fyllið, fylla',
    past: 'fyllti, fylltir, fyllti, fylltum, fylltuð, fylltu',
    impAff: imp('fylltu', 'fyllum', 'fyllið'),
  },
  senda: {
    parts: ['sendi', 'sendir', 'sendi', 'sendum', 'sent'],
    pres: 'sendi, sendir, sendir, sendum, sendið, senda',
    past: 'sendi, sendir, sendi, sendum, senduð, sendu',
    subjPres: 'sendi, sendir, sendi, sendum, sendið, sendi',
    impAff: imp('sendu', 'sendum', 'sendið'), participle: 'sent',
  },
  henda: { // t-past: hentu, not hendu
    parts: ['hendi', 'hendir', 'henti', 'hentum', 'hent'],
    past: 'henti, hentir, henti, hentum, hentuð, hentu',
    impAff: imp('hentu', 'hendum', 'hendið'),
  },
  þekkja: {
    parts: ['þekki', 'þekkir', 'þekkti', 'þekktum', 'þekkt'],
    pres: 'þekki, þekkir, þekkir, þekkjum, þekkið, þekkja',
    past: 'þekkti, þekktir, þekkti, þekktum, þekktuð, þekktu',
    subjPres: 'þekki, þekkir, þekki, þekkjum, þekkið, þekki',
    impAff: imp('þekktu', 'þekkjum', 'þekkið'),
  },
  sækja: {
    parts: ['sæki', 'sækir', 'sótti', 'sóttum', 'sótt'],
    pres: 'sæki, sækir, sækir, sækjum, sækið, sækja',
    past: 'sótti, sóttir, sótti, sóttum, sóttuð, sóttu',
    subjPast: 'sækti, sæktir, sækti, sæktum, sæktuð, sæktu',
    impAff: imp('sæktu', 'sækjum', 'sækið'),
  },
  hringja: {
    parts: ['hringi', 'hringir', 'hringdi', 'hringdum', 'hringt'],
    pres: 'hringi, hringir, hringir, hringjum, hringið, hringja',
    past: 'hringdi, hringdir, hringdi, hringdum, hringduð, hringdu',
    impAff: imp('hringdu', 'hringjum', 'hringið'),
  },
  nefna: {
    parts: ['nefni', 'nefnir', 'nefndi', 'nefndum', 'nefnt'],
    pres: 'nefni, nefnir, nefnir, nefnum, nefnið, nefna',
    past: 'nefndi, nefndir, nefndi, nefndum, nefnduð, nefndu',
    impAff: imp('nefndu', 'nefnum', 'nefnið'),
  },
  kenna: {
    parts: ['kenni', 'kennir', 'kenndi', 'kenndum', 'kennt'],
    pres: 'kenni, kennir, kennir, kennum, kennið, kenna',
    past: 'kenndi, kenndir, kenndi, kenndum, kennduð, kenndu',
    impAff: imp('kenndu', 'kennum', 'kennið'),
  },
  læra: {
    parts: ['læri', 'lærir', 'lærði', 'lærðum', 'lært'],
    pres: 'læri, lærir, lærir, lærum, lærið, læra',
    past: 'lærði, lærðir, lærði, lærðum, lærðuð, lærðu',
    impAff: imp('lærðu', 'lærum', 'lærið'),
  },
  spyrja: {
    parts: ['spyr', 'spyrð', 'spurði', 'spurðum', 'spurt'],
    pres: 'spyr, spyrð, spyr, spyrjum, spyrjið, spyrja',
    past: 'spurði, spurðir, spurði, spurðum, spurðuð, spurðu',
    subjPres: 'spyrji, spyrjir, spyrji, spyrjum, spyrjið, spyrji',
    subjPast: 'spyrði, spyrðir, spyrði, spyrðum, spyrðuð, spyrðu',
    impAff: imp('spyrðu', 'spyrjum', 'spyrjið'),
  },
  selja: {
    parts: ['sel', 'selur', 'seldi', 'seldum', 'selt'],
    pres: 'sel, selur, selur, seljum, seljið, selja',
    past: 'seldi, seldir, seldi, seldum, selduð, seldu',
    subjPast: 'seldi, seldir, seldi, seldum, selduð, seldu',
    impAff: imp('seldu', 'seljum', 'seljið'),
  },
  velja: {
    parts: ['vel', 'velur', 'valdi', 'völdum', 'valið'],
    pres: 'vel, velur, velur, veljum, veljið, velja',
    past: 'valdi, valdir, valdi, völdum, völduð, völdu',
    subjPast: 'veldi, veldir, veldi, veldum, velduð, veldu',
    impAff: imp('veldu', 'veljum', 'veljið'),
  },
  dvelja: {
    parts: ['dvel', 'dvelur', 'dvaldi', 'dvöldum', 'dvalið'],
    past: 'dvaldi, dvaldir, dvaldi, dvöldum, dvölduð, dvöldu',
    subjPast: 'dveldi, dveldir, dveldi, dveldum, dvelduð, dveldu',
  },
  hvetja: {
    parts: ['hvet', 'hvetur', 'hvatti', 'hvöttum', 'hvatt'],
    pres: 'hvet, hvetur, hvetur, hvetjum, hvetjið, hvetja',
    past: 'hvatti, hvattir, hvatti, hvöttum, hvöttuð, hvöttu',
    subjPast: 'hvetti, hvettir, hvetti, hvettum, hvettuð, hvettu',
    impAff: imp('hvettu', 'hvetjum', 'hvetjið'),
  },
  vekja: {
    parts: ['vek', 'vekur', 'vakti', 'vöktum', 'vakið'], // short stem like telja / velja: ég vek, not *veki
    pres: 'vek, vekur, vekur, vekjum, vekið, vekja',
    past: 'vakti, vaktir, vakti, vöktum, vöktuð, vöktu',
    subjPast: 'vekti, vektir, vekti, vektum, vektuð, vektu',
    impAff: imp('vektu', 'vekjum', 'vekið'),
  },
  leyfa: {
    parts: ['leyfi', 'leyfir', 'leyfði', 'leyfðum', 'leyft'],
    pres: 'leyfi, leyfir, leyfir, leyfum, leyfið, leyfa',
    past: 'leyfði, leyfðir, leyfði, leyfðum, leyfðuð, leyfðu',
    impAff: imp('leyfðu', 'leyfum', 'leyfið'),
  },
  lifa: {
    parts: ['lifi', 'lifir', 'lifði', 'lifðum', 'lifað'],
    pres: 'lifi, lifir, lifir, lifum, lifið, lifa',
    impAff: imp('lifðu', 'lifum', 'lifið'),
  },
  bæta: {
    parts: ['bæti', 'bætir', 'bætti', 'bættum', 'bætt'],
    pres: 'bæti, bætir, bætir, bætum, bætið, bæta',
    past: 'bætti, bættir, bætti, bættum, bættuð, bættu',
    impAff: imp('bættu', 'bætum', 'bætið'),
  },
  dæma: {
    parts: ['dæmi', 'dæmir', 'dæmdi', 'dæmdum', 'dæmt'],
    pres: 'dæmi, dæmir, dæmir, dæmum, dæmið, dæma',
    impAff: imp('dæmdu', 'dæmum', 'dæmið'),
  },
  gleyma: {
    parts: ['gleymi', 'gleymir', 'gleymdi', 'gleymdum', 'gleymt'],
    past: 'gleymdi, gleymdir, gleymdi, gleymdum, gleymduð, gleymdu',
    impAff: imp('gleymdu', 'gleymum', 'gleymið'),
  },
  reyna: {
    parts: ['reyni', 'reynir', 'reyndi', 'reyndum', 'reynt'],
    impAff: imp('reyndu', 'reynum', 'reynið'),
  },
  skilja: {
    parts: ['skil', 'skilur', 'skildi', 'skildum', 'skilið'],
    pres: 'skil, skilur, skilur, skiljum, skiljið, skilja',
    past: 'skildi, skildir, skildi, skildum, skilduð, skildu',
    impAff: imp('skildu', 'skiljum', 'skiljið'),
  },
  þegja: {
    parts: ['þegi', 'þegir', 'þagði', 'þögðum', 'þagað'],
    pres: 'þegi, þegir, þegir, þegjum, þegið, þegja',
    past: 'þagði, þagðir, þagði, þögðum, þögðuð, þögðu',
    subjPast: 'þegði, þegðir, þegði, þegðum, þegðuð, þegðu',
  },
  þora: {
    parts: ['þori', 'þorir', 'þorði', 'þorðum', 'þorað'],
    pres: 'þori, þorir, þorir, þorum, þorið, þora',
    past: 'þorði, þorðir, þorði, þorðum, þorðuð, þorðu',
    subjPast: 'þyrði, þyrðir, þyrði, þyrðum, þyrðuð, þyrðu',
    impAff: imp('þorðu', 'þorum', 'þorið'),
  },
  flytja: {
    parts: ['flyt', 'flytur', 'flutti', 'fluttum', 'flutt'],
    pres: 'flyt, flytur, flytur, flytjum, flytjið, flytja',
    past: 'flutti, fluttir, flutti, fluttum, fluttuð, fluttu',
    subjPast: 'flytti, flyttir, flytti, flyttum, flyttuð, flyttu',
    impAff: imp('flyttu', 'flytjum', 'flytjið'),
  },
  breyta: {
    parts: ['breyti', 'breytir', 'breytti', 'breyttum', 'breytt'],
    pres: 'breyti, breytir, breytir, breytum, breytið, breyta',
    impAff: imp('breyttu', 'breytum', 'breytið'),
  },
  mæta: {
    parts: ['mæti', 'mætir', 'mætti', 'mættum', 'mætt'],
    impAff: imp('mættu', 'mætum', 'mætið'),
  },
  tengja: {
    parts: ['tengi', 'tengir', 'tengdi', 'tengdum', 'tengt'],
    pres: 'tengi, tengir, tengir, tengjum, tengið, tengja',
    impAff: imp('tengdu', 'tengjum', 'tengið'),
  },
  merkja: {
    parts: ['merki', 'merkir', 'merkti', 'merktum', 'merkt'],
    pres: 'merki, merkir, merkir, merkjum, merkið, merkja',
    impAff: imp('merktu', 'merkjum', 'merkið'),
  },
  kveikja: {
    parts: ['kveiki', 'kveikir', 'kveikti', 'kveiktum', 'kveikt'],
    impAff: imp('kveiktu', 'kveikjum', 'kveikið'),
  },
  byggja: {
    parts: ['byggi', 'byggir', 'byggði', 'byggðum', 'byggt'],
    pres: 'byggi, byggir, byggir, byggjum, byggið, byggja',
    past: 'byggði, byggðir, byggði, byggðum, byggðuð, byggðu',
  },
  kyssa: {
    parts: ['kyssi', 'kyssir', 'kyssti', 'kysstum', 'kysst'],
    past: 'kyssti, kysstir, kyssti, kysstum, kysstuð, kysstu',
    impAff: imp('kysstu', 'kyssum', 'kyssið'),
  },
  lýsa: {
    parts: ['lýsi', 'lýsir', 'lýsti', 'lýstum', 'lýst'],
    impAff: imp('lýstu', 'lýsum', 'lýsið'),
  },
  ryðja: {
    parts: ['ryð', 'ryður', 'ruddi', 'ruddum', 'rutt'],
    pres: 'ryð, ryður, ryður, ryðjum, ryðjið, ryðja',
    past: 'ruddi, ruddir, ruddi, ruddum, rudduð, ruddu',
    subjPast: 'ryddi, ryddir, ryddi, ryddum, rydduð, ryddu',
    impAff: imp('ryddu', 'ryðjum', 'ryðjið'),
  },
  ná: {
    parts: ['næ', 'nærð', 'náði', 'náðum', 'náð'],
    pres: 'næ, nærð, nær, náum, náið, ná',
    past: 'náði, náðir, náði, náðum, náðuð, náðu',
    subjPres: 'nái, náir, nái, náum, náið, nái',
    subjPast: 'næði, næðir, næði, næðum, næðuð, næðu',
    impAff: imp('náðu', 'náum', 'náið'), gerund: 'náandi',
  },
  trúa: {
    parts: ['trúi', 'trúir', 'trúði', 'trúðum', 'trúað'],
    pres: 'trúi, trúir, trúir, trúum, trúið, trúa',
    past: 'trúði, trúðir, trúði, trúðum, trúðuð, trúðu',
    subjPast: 'trúði, trúðir, trúði, trúðum, trúðuð, trúðu',
    impAff: imp('trúðu', 'trúum', 'trúið'),
  },
  spá: {
    parts: ['spái', 'spáir', 'spáði', 'spáðum', 'spáð'],
    pres: 'spái, spáir, spáir, spáum, spáið, spá',
    subjPast: 'spáði, spáðir, spáði, spáðum, spáðuð, spáðu',
    impAff: imp('spáðu', 'spáum', 'spáið'),
  },
});

// ---- the preterite-present and other modal verbs ----
Object.assign(EXPECTED, {
  mega: {
    parts: ['má', 'mátt', 'mátti', 'máttum', 'mátt'],
    pres: 'má, mátt, má, megum, megið, mega',
    past: 'mátti, máttir, mátti, máttum, máttuð, máttu',
    subjPres: 'megi, megir, megi, megum, megið, megi',
    subjPast: 'mætti, mættir, mætti, mættum, mættuð, mættu',
    impAff: NO_IMP,
  },
  þurfa: {
    parts: ['þarf', 'þarft', 'þurfti', 'þurftum', 'þurft'],
    pres: 'þarf, þarft, þarf, þurfum, þurfið, þurfa',
    past: 'þurfti, þurftir, þurfti, þurftum, þurftuð, þurftu',
    subjPast: 'þyrfti, þyrftir, þyrfti, þyrftum, þyrftuð, þyrftu',
    impAff: NO_IMP,
  },
  kunna: {
    parts: ['kann', 'kannt', 'kunni', 'kunnum', 'kunnað'],
    pres: 'kann, kannt, kann, kunnum, kunnið, kunna',
    past: 'kunni, kunnir, kunni, kunnum, kunnuð, kunnu',
    subjPast: 'kynni, kynnir, kynni, kynnum, kynnuð, kynnu',
    impAff: NO_IMP,
  },
  unna: {
    parts: ['ann', 'annt', 'unni', 'unnum', 'unnað'],
    pres: 'ann, annt, ann, unnum, unnið, unna',
    subjPast: 'ynni, ynnir, ynni, ynnum, ynnuð, ynnu',
  },
  muna: {
    parts: ['man', 'manst', 'mundi', 'mundum', 'munað'],
    pres: 'man, manst, man, munum, munið, muna',
    subjPast: 'myndi, myndir, myndi, myndum, mynduð, myndu',
  },
  valda: {
    parts: ['veld', 'veldur', 'olli', 'ollum', 'valdið'],
    pres: 'veld, veldur, veldur, völdum, valdið, valda',
    past: 'olli, ollir, olli, ollum, olluð, ollu',
    subjPast: 'ylli, yllir, ylli, yllum, ylluð, yllu',
  },
  þykja: {
    parts: ['þyki', 'þykir', 'þótti', 'þóttum', 'þótt'],
    pres: 'þyki, þykir, þykir, þykjum, þykið, þykja',
    past: 'þótti, þóttir, þótti, þóttum, þóttuð, þóttu',
    subjPast: 'þætti, þættir, þætti, þættum, þættuð, þættu',
  },
});

// ---- regular weak verbs of class 1 (no parts): the u-umlaut a > ö before -um / -uðum ----
Object.assign(EXPECTED, {
  leita: {
    pres: 'leita, leitar, leitar, leitum, leitið, leita',
    past: 'leitaði, leitaðir, leitaði, leituðum, leituðuð, leituðu',
    impAff: imp('leitaðu', 'leitum', 'leitið'),
  },
  byrja: {
    pres: 'byrja, byrjar, byrjar, byrjum, byrjið, byrja',
    past: 'byrjaði, byrjaðir, byrjaði, byrjuðum, byrjuðuð, byrjuðu',
    subjPres: 'byrji, byrjir, byrji, byrjum, byrjið, byrji',
    impAff: imp('byrjaðu', 'byrjum', 'byrjið'),
  },
  borða: {
    pres: 'borða, borðar, borðar, borðum, borðið, borða',
    past: 'borðaði, borðaðir, borðaði, borðuðum, borðuðuð, borðuðu',
    impAff: imp('borðaðu', 'borðum', 'borðið'),
  },
  ætla: { past: 'ætlaði, ætlaðir, ætlaði, ætluðum, ætluðuð, ætluðu', participle: 'ætlað' },
  hjálpa: {
    pres: 'hjálpa, hjálpar, hjálpar, hjálpum, hjálpið, hjálpa',
    past: 'hjálpaði, hjálpaðir, hjálpaði, hjálpuðum, hjálpuðuð, hjálpuðu',
  },
  skrifa: {
    pres: 'skrifa, skrifar, skrifar, skrifum, skrifið, skrifa',
    past: 'skrifaði, skrifaðir, skrifaði, skrifuðum, skrifuðuð, skrifuðu',
    impAff: imp('skrifaðu', 'skrifum', 'skrifið'),
  },
  sakna: {
    pres: 'sakna, saknar, saknar, söknum, saknið, sakna',
    past: 'saknaði, saknaðir, saknaði, söknuðum, söknuðuð, söknuðu',
  },
  baka: {
    pres: 'baka, bakar, bakar, bökum, bakið, baka',
    past: 'bakaði, bakaðir, bakaði, bökuðum, bökuðuð, bökuðu',
    subjPres: 'baki, bakir, baki, bökum, bakið, baki',
  },
  bjarga: {
    pres: 'bjarga, bjargar, bjargar, björgum, bjargið, bjarga',
    past: 'bjargaði, bjargaðir, bjargaði, björguðum, björguðuð, björguðu',
  },
  spila: {
    pres: 'spila, spilar, spilar, spilum, spilið, spila',
    past: 'spilaði, spilaðir, spilaði, spiluðum, spiluðuð, spiluðu',
  },
  safna: {
    pres: 'safna, safnar, safnar, söfnum, safnið, safna',
    past: 'safnaði, safnaðir, safnaði, söfnuðum, söfnuðuð, söfnuðu',
  },
  opna: { pres: 'opna, opnar, opnar, opnum, opnið, opna', past: 'opnaði, opnaðir, opnaði, opnuðum, opnuðuð, opnuðu' },
  vakna: { pres: 'vakna, vaknar, vaknar, vöknum, vaknið, vakna', past: 'vaknaði, vaknaðir, vaknaði, vöknuðum, vöknuðuð, vöknuðu' },
  kasta: { pres: 'kasta, kastar, kastar, köstum, kastið, kasta', past: 'kastaði, kastaðir, kastaði, köstuðum, köstuðuð, köstuðu' },
  mála: {
    pres: 'mála, málar, málar, málum, málið, mála',
    past: 'málaði, málaðir, málaði, máluðum, máluðuð, máluðu',
  },
  lána: { pres: 'lána, lánar, lánar, lánum, lánið, lána', past: 'lánaði, lánaðir, lánaði, lánuðum, lánuðuð, lánuðu' },
  þakka: {
    pres: 'þakka, þakkar, þakkar, þökkum, þakkið, þakka',
    past: 'þakkaði, þakkaðir, þakkaði, þökkuðum, þökkuðuð, þökkuðu',
  },
  hlusta: { pres: 'hlusta, hlustar, hlustar, hlustum, hlustið, hlusta', past: 'hlustaði, hlustaðir, hlustaði, hlustuðum, hlustuðuð, hlustuðu' },
  ávarpa: {
    pres: 'ávarpa, ávarpar, ávarpar, ávörpum, ávarpið, ávarpa',
    past: 'ávarpaði, ávarpaðir, ávarpaði, ávörpuðum, ávörpuðuð, ávörpuðu',
  },
  banka: { pres: 'banka, bankar, bankar, bönkum, bankið, banka', past: 'bankaði, bankaðir, bankaði, bönkuðum, bönkuðuð, bönkuðu' },
  elda: { pres: 'elda, eldar, eldar, eldum, eldið, elda', impAff: imp('eldaðu', 'eldum', 'eldið') },
  'tala/parts': { // the parts of a regular verb may be given explicitly
    inf: 'tala', parts: ['tala', 'talar', 'talaði', 'töluðum', 'talað'],
    pres: 'tala, talar, talar, tölum, talið, tala',
    past: 'talaði, talaðir, talaði, töluðum, töluðuð, töluðu',
    impAff: imp('talaðu', 'tölum', 'talið'),
  },
});

// ---- prefixed relatives inherit the pattern; weather verbs exist only in the 3rd person singular ----
Object.assign(EXPECTED, {
  yfirgefa: {
    parts: ['yfirgef', 'yfirgefur', 'yfirgaf', 'yfirgáfum', 'yfirgefið'],
    pres: 'yfirgef, yfirgefur, yfirgefur, yfirgefum, yfirgefið, yfirgefa',
    past: 'yfirgaf, yfirgafst, yfirgaf, yfirgáfum, yfirgáfuð, yfirgáfu',
    subjPast: 'yfirgæfi, yfirgæfir, yfirgæfi, yfirgæfum, yfirgæfuð, yfirgæfu',
    impAff: imp('yfirgefðu', 'yfirgefum', 'yfirgefið'),
  },
  viðurkenna: {
    parts: ['viðurkenni', 'viðurkennir', 'viðurkenndi', 'viðurkenndum', 'viðurkennt'],
    impAff: imp('viðurkenndu', 'viðurkennum', 'viðurkennið'),
  },
  viðhalda: {
    parts: ['viðheld', 'viðheldur', 'viðhélt', 'viðhéldum', 'viðhaldið'],
    pres: 'viðheld, viðheldur, viðheldur, viðhöldum, viðhaldið, viðhalda',
    subjPast: 'viðhéldi, viðhéldir, viðhéldi, viðhéldum, viðhélduð, viðhéldu',
    impAff: imp('viðhaltu', 'viðhöldum', 'viðhaldið'),
  },
  upptelja: {
    parts: ['upptel', 'upptelur', 'upptaldi', 'upptöldum', 'upptalið'],
    subjPast: 'uppteldi, uppteldir, uppteldi, uppteldum, upptelduð, uppteldu',
    impAff: imp('uppteldu', 'uppteljum', 'uppteljið'),
  },
  afhenda: {
    parts: ['afhendi', 'afhendir', 'afhenti', 'afhentum', 'afhent'],
    impAff: imp('afhentu', 'afhendum', 'afhendið'),
  },
  rigna: {
    parts: ['rigni', 'rignir', 'rigndi', 'rigndum', 'rignt'],
    pres: `${NONE}, ${NONE}, rignir, ${NONE}, ${NONE}, ${NONE}`,
    past: `${NONE}, ${NONE}, rigndi, ${NONE}, ${NONE}, ${NONE}`,
    perf: `${NONE}, ${NONE}, hefur rignt, ${NONE}, ${NONE}, ${NONE}`,
    fut: `${NONE}, ${NONE}, mun rigna, ${NONE}, ${NONE}, ${NONE}`,
    subjPres: `${NONE}, ${NONE}, rigni, ${NONE}, ${NONE}, ${NONE}`,
    cond: `${NONE}, ${NONE}, myndi rigna, ${NONE}, ${NONE}, ${NONE}`,
    impAff: NO_IMP, gerund: 'rignandi', participle: 'rignt',
  },
  snjóa: {
    pres: `${NONE}, ${NONE}, snjóar, ${NONE}, ${NONE}, ${NONE}`,
    past: `${NONE}, ${NONE}, snjóaði, ${NONE}, ${NONE}, ${NONE}`,
    perf: `${NONE}, ${NONE}, hefur snjóað, ${NONE}, ${NONE}, ${NONE}`,
    impAff: NO_IMP, participle: 'snjóað',
  },
});

// ---- -va stems (the v is part of the stem in the plural, not in the imperative) and verbs with a past in -i + weak endings ----
Object.assign(EXPECTED, {
  hrökkva: {
    parts: ['hrekk', 'hrekkur', 'hrökk', 'hrukkum', 'hrokkið'],
    pres: 'hrekk, hrekkur, hrekkur, hrökkvum, hrökkvið, hrökkva',
    past: 'hrökk, hrökkst, hrökk, hrukkum, hrukkuð, hrukku',
    subjPres: 'hrökkvi, hrökkvir, hrökkvi, hrökkvum, hrökkvið, hrökkvi',
    subjPast: 'hrykki, hrykkir, hrykki, hrykkjum, hrykkjuð, hrykkju',
    impAff: imp('hrökktu', 'hrökkvum', 'hrökkvið'),
    gerund: 'hrökkvandi',
  },
  sökkva: {
    parts: ['sekk', 'sekkur', 'sökk', 'sukkum', 'sokkið'],
    pres: 'sekk, sekkur, sekkur, sökkvum, sökkvið, sökkva',
    subjPast: 'sykki, sykkir, sykki, sykkjum, sykkjuð, sykkju',
    impAff: imp('sökktu', 'sökkvum', 'sökkvið'),
  },
  höggva: {
    parts: ['högg', 'höggur', 'hjó', 'hjuggum', 'höggvið'],
    pres: 'högg, höggur, höggur, höggvum, höggvið, höggva',
    past: 'hjó, hjóst, hjó, hjuggum, hjugguð, hjuggu',
    subjPast: 'hyggi, hyggir, hyggi, hyggjum, hyggjuð, hyggju',
    impAff: imp('höggðu', 'höggvum', 'höggvið'),
  },
  róa: { // past in -i with weak endings
    parts: ['ræ', 'rærð', 'reri', 'rerum', 'róið'],
    pres: 'ræ, rærð, rær, róum, róið, róa',
    past: 'reri, rerir, reri, rerum, reruð, reru',
    subjPast: 'reri, rerir, reri, rerum, reruð, reru',
    impAff: imp('róðu', 'róum', 'róið'),
  },
  ráðleggja: { // the prefix ráð- is accepted: the imperative and the subjunctive follow leggja
    parts: ['ráðlegg', 'ráðleggur', 'ráðlagði', 'ráðlögðum', 'ráðlagt'],
    pres: 'ráðlegg, ráðleggur, ráðleggur, ráðleggjum, ráðleggið, ráðleggja',
    subjPast: 'ráðlegði, ráðlegðir, ráðlegði, ráðlegðum, ráðlegðuð, ráðlegðu',
    impAff: imp('ráðlegðu', 'ráðleggjum', 'ráðleggið'),
  },
  heimsækja: {
    parts: ['heimsæki', 'heimsækir', 'heimsótti', 'heimsóttum', 'heimsótt'],
    subjPast: 'heimsækti, heimsæktir, heimsækti, heimsæktum, heimsæktuð, heimsæktu',
    impAff: imp('heimsæktu', 'heimsækjum', 'heimsækið'),
  },
  herða: { // t-past: hertu
    parts: ['herði', 'herðir', 'herti', 'hertum', 'hert'],
    past: 'herti, hertir, herti, hertum, hertuð, hertu',
    impAff: imp('hertu', 'herðum', 'herðið'),
  },
  kveðja: {
    parts: ['kveð', 'kveður', 'kvaddi', 'kvöddum', 'kvatt'],
    pres: 'kveð, kveður, kveður, kveðjum, kveðjið, kveðja',
    past: 'kvaddi, kvaddir, kvaddi, kvöddum, kvödduð, kvöddu',
  },
  knýja: {
    parts: ['kný', 'knýr', 'knúði', 'knúðum', 'knúið'],
    pres: 'kný, knýr, knýr, knýjum, knýið, knýja',
    subjPast: 'knýði, knýðir, knýði, knýðum, knýðuð, knýðu',
  },
  stinga: {
    parts: ['sting', 'stingur', 'stakk', 'stungum', 'stungið'],
    past: 'stakk, stakkst, stakk, stungum, stunguð, stungu',
    subjPast: 'styngi, styngir, styngi, styngjum, styngjuð, styngju',
    impAff: imp('stingdu', 'stingum', 'stingið'),
  },
  hnjóta: {
    parts: ['hnýt', 'hnýtur', 'hnaut', 'hnutum', 'hnotið'],
    subjPast: 'hnyti, hnytir, hnyti, hnytum, hnytuð, hnytu',
  },
  vaxa: { // 1sg = 2sg = 3sg
    parts: ['vex', 'vex', 'óx', 'uxum', 'vaxið'],
    pres: 'vex, vex, vex, vöxum, vaxið, vaxa',
    subjPast: 'yxi, yxir, yxi, yxum, yxuð, yxu',
  },
  'verða/imp': {
    inf: 'verða', parts: ['verð', 'verður', 'varð', 'urðum', 'orðið'],
    impAff: imp('verðu', 'verðum', 'verðið'),
  },
});

// ================================ CHECKS (add EXPECTED blocks above this line) ================================

// A duplicate key in an object literal silently replaces the earlier entry and so drops its assertions:
// read this file's own source and refuse duplicate entries (every entry starts "  verb: {").
{
  const source = fs.readFileSync(__filename, 'utf8');
  const seen = new Set();
  for (const [, key] of source.matchAll(/^ {2}('[^']+'|[^\s':]+): \{/gm)) {
    report.checks += 1;
    if (seen.has(key)) report.fail(`EXPECTED has the key ${key} twice; the later entry would silently replace the earlier one`);
    seen.add(key);
  }
}

// conjugate() takes the principal parts, so the shared checkParadigms (which passes only the verb) is not used.
function checkParadigms(expected) {
  for (const [verb, spec] of Object.entries(expected)) {
    const { parts, inf = verb, ...tenses } = spec;
    const result = conjugate(inf, parts);
    if (!result) { report.fail(`${verb}: conjugate() returned null`); continue; }
    for (const [tense, want] of Object.entries(tenses)) {
      report.checks += 1;
      const actual = tense === 'gerund' || tense === 'participle' ? result[tense] : result.forms[tense].join(', ');
      if (actual !== want) report.fail(`${verb}.${tense}\n    expected: ${want}\n    actual:   ${actual}`);
    }
  }
}
checkParadigms(EXPECTED);

// Every result has exactly the 13 keys, in order, with six non-empty strings each.
for (const [verb, spec] of Object.entries(EXPECTED)) {
  report.checks += 1;
  const result = conjugate(spec.inf || verb, spec.parts);
  if (!result) continue; // already reported
  if (Object.keys(result.forms).join() !== FORM_KEYS.join()) report.fail(`${verb}: wrong form keys ${Object.keys(result.forms)}`);
  for (const key of FORM_KEYS) {
    const forms = result.forms[key];
    if (!Array.isArray(forms) || forms.length !== 6 || forms.some(f => typeof f !== 'string' || !f)) {
      report.fail(`${verb}.${key}: not six strings: ${JSON.stringify(forms)}`);
    }
  }
}

// ---- the 3rd person, the umlauts and the j rules, one rule at a time ----
// (principal parts -> the forms that show the rule; every form written out by hand)
const RULES = [
  // [label, infinitive, parts, tense, expected]
  ['3sg = 2sg without -ð: ferð -> fer', 'fara', ['fer', 'ferð', 'fór', 'fórum', 'farið'], 'pres', 'fer, ferð, fer, förum, farið, fara'],
  ['3sg = 2sg without -ð: sérð -> sér', 'sjá', ['sé', 'sérð', 'sá', 'sáum', 'séð'], 'pres', 'sé, sérð, sér, sjáum, sjáið, sjá'],
  ['3sg = 2sg without -ð: færð -> fær', 'fá', ['fæ', 'færð', 'fékk', 'fengum', 'fengið'], 'pres', 'fæ, færð, fær, fáum, fáið, fá'],
  ['3sg = 2sg: -ur', 'taka', ['tek', 'tekur', 'tók', 'tókum', 'tekið'], 'pres', 'tek, tekur, tekur, tökum, takið, taka'],
  ['3sg = 2sg: -ir', 'heyra', ['heyri', 'heyrir', 'heyrði', 'heyrðum', 'heyrt'], 'pres', 'heyri, heyrir, heyrir, heyrum, heyrið, heyra'],
  ['3sg = 1sg: veist -> veit', 'vita', ['veit', 'veist', 'vissi', 'vissum', 'vitað'], 'pres', 'veit, veist, veit, vitum, vitið, vita'],
  ['3sg = 1sg: átt -> á', 'eiga', ['á', 'átt', 'átti', 'áttum', 'átt'], 'pres', 'á, átt, á, eigum, eigið, eiga'],
  ['3sg = 1sg: ert -> er', 'vera', ['er', 'ert', 'var', 'vorum', 'verið'], 'pres', 'er, ert, er, erum, eruð, eru'],
  ['3sg = 1sg: kannt -> kann', 'kunna', ['kann', 'kannt', 'kunni', 'kunnum', 'kunnað'], 'pres', 'kann, kannt, kann, kunnum, kunnið, kunna'],
  ['3sg of vilja is vill, not vil', 'vilja', ['vil', 'vilt', 'vildi', 'vildum', 'viljað'], 'pres', 'vil, vilt, vill, viljum, viljið, vilja'],
  ['u-umlaut a > ö: tala', 'tala', undefined, 'pres', 'tala, talar, talar, tölum, talið, tala'],
  ['u-umlaut a > ö: hafa', 'hafa', ['hef', 'hefur', 'hafði', 'höfðum', 'haft'], 'pres', 'hef, hefur, hefur, höfum, hafið, hafa'],
  ['u-umlaut a > ö: ganga', 'ganga', ['geng', 'gengur', 'gekk', 'gengum', 'gengið'], 'pres', 'geng, gengur, gengur, göngum, gangið, ganga'],
  ['no umlaut of á / au / e / o', 'hjálpa', undefined, 'pres', 'hjálpa, hjálpar, hjálpar, hjálpum, hjálpið, hjálpa'],
  ['no umlaut of au', 'hlaupa', ['hleyp', 'hleypur', 'hljóp', 'hlupum', 'hlaupið'], 'pres', 'hleyp, hleypur, hleypur, hlaupum, hlaupið, hlaupa'],
  ['-aði verbs: a > ö in the stem, a > u in the ending', 'kalla', undefined, 'past', 'kallaði, kallaðir, kallaði, kölluðum, kölluðuð, kölluðu'],
  ['-aði verbs without a stem a', 'leita', undefined, 'past', 'leitaði, leitaðir, leitaði, leituðum, leituðuð, leituðu'],
  ['weak past plural with umlaut: taldi -> töldum', 'telja', ['tel', 'telur', 'taldi', 'töldum', 'talið'], 'past', 'taldi, taldir, taldi, töldum, tölduð, töldu'],
  ['j stays before -ið after l: teljið', 'telja', ['tel', 'telur', 'taldi', 'töldum', 'talið'], 'pres', 'tel, telur, telur, teljum, teljið, telja'],
  ['j stays before -ið after t: setjið', 'setja', ['set', 'setur', 'setti', 'settum', 'sett'], 'pres', 'set, setur, setur, setjum, setjið, setja'],
  ['j stays before -ið after r: spyrjið', 'spyrja', ['spyr', 'spyrð', 'spurði', 'spurðum', 'spurt'], 'pres', 'spyr, spyrð, spyr, spyrjum, spyrjið, spyrja'],
  ['j stays before -ið after ð: biðjið', 'biðja', ['bið', 'biður', 'bað', 'báðum', 'beðið'], 'pres', 'bið, biður, biður, biðjum, biðjið, biðja'],
  ['j stays before -ið in a class-1 verb: byrjið', 'byrja', undefined, 'pres', 'byrja, byrjar, byrjar, byrjum, byrjið, byrja'],
  ['j drops before -ið after g: segið', 'segja', ['segi', 'segir', 'sagði', 'sögðum', 'sagt'], 'pres', 'segi, segir, segir, segjum, segið, segja'],
  ['j drops before -ið after gg: leggið', 'leggja', ['legg', 'leggur', 'lagði', 'lögðum', 'lagt'], 'pres', 'legg, leggur, leggur, leggjum, leggið, leggja'],
  ['j drops before -ið after kk: þekkið', 'þekkja', ['þekki', 'þekkir', 'þekkti', 'þekktum', 'þekkt'], 'pres', 'þekki, þekkir, þekkir, þekkjum, þekkið, þekkja'],
  ['j drops before -ið after k: sækið', 'sækja', ['sæki', 'sækir', 'sótti', 'sóttum', 'sótt'], 'pres', 'sæki, sækir, sækir, sækjum, sækið, sækja'],
  ['j drops before -ið after ng: hringið', 'hringja', ['hringi', 'hringir', 'hringdi', 'hringdum', 'hringt'], 'pres', 'hringi, hringir, hringir, hringjum, hringið, hringja'],
  ['j drops before -ið after a vowel: deyið', 'deyja', ['dey', 'deyr', 'dó', 'dóum', 'dáið'], 'pres', 'dey, deyr, deyr, deyjum, deyið, deyja'],
  ['present subjunctive keeps j after l: telji', 'telja', ['tel', 'telur', 'taldi', 'töldum', 'talið'], 'subjPres', 'telji, teljir, telji, teljum, teljið, telji'],
  ['present subjunctive drops j after k: sæki', 'sækja', ['sæki', 'sækir', 'sótti', 'sóttum', 'sótt'], 'subjPres', 'sæki, sækir, sæki, sækjum, sækið, sæki'],
  ['strong subjunctive past: ó > æ', 'taka', ['tek', 'tekur', 'tók', 'tókum', 'tekið'], 'subjPast', 'tæki, tækir, tæki, tækjum, tækjuð, tækju'],
  ['strong subjunctive past: ó > æ, no j after r', 'fara', ['fer', 'ferð', 'fór', 'fórum', 'farið'], 'subjPast', 'færi, færir, færi, færum, færuð, færu'],
  ['strong subjunctive past: o > æ', 'koma', ['kem', 'kemur', 'kom', 'komum', 'komið'], 'subjPast', 'kæmi, kæmir, kæmi, kæmum, kæmuð, kæmu'],
  ['strong subjunctive past: á > æ', 'gefa', ['gef', 'gefur', 'gaf', 'gáfum', 'gefið'], 'subjPast', 'gæfi, gæfir, gæfi, gæfum, gæfuð, gæfu'],
  ['strong subjunctive past: u > y', 'finna', ['finn', 'finnur', 'fann', 'fundum', 'fundið'], 'subjPast', 'fyndi, fyndir, fyndi, fyndum, fynduð, fyndu'],
  ['strong subjunctive past: j after a vowel', 'sjá', ['sé', 'sérð', 'sá', 'sáum', 'séð'], 'subjPast', 'sæi, sæir, sæi, sæjum, sæjuð, sæju'],
  ['strong subjunctive past: j after g', 'fá', ['fæ', 'færð', 'fékk', 'fengum', 'fengið'], 'subjPast', 'fengi, fengir, fengi, fengjum, fengjuð, fengju'],
  ['strong subjunctive past: é and í do not change', 'láta', ['læt', 'lætur', 'lét', 'létum', 'látið'], 'subjPast', 'léti, létir, léti, létum, létuð, létu'],
  ['strong subjunctive past: ju > y', 'búa', ['bý', 'býrð', 'bjó', 'bjuggum', 'búið'], 'subjPast', 'byggi, byggir, byggi, byggjum, byggjuð, byggju'],
  ['weak subjunctive past = past', 'heyra', ['heyri', 'heyrir', 'heyrði', 'heyrðum', 'heyrt'], 'subjPast', 'heyrði, heyrðir, heyrði, heyrðum, heyrðuð, heyrðu'],
  ['weak subjunctive past umlauts again: a > e', 'segja', ['segi', 'segir', 'sagði', 'sögðum', 'sagt'], 'subjPast', 'segði, segðir, segði, segðum, segðuð, segðu'],
  ['weak subjunctive past umlauts again: u > y', 'spyrja', ['spyr', 'spyrð', 'spurði', 'spurðum', 'spurt'], 'subjPast', 'spyrði, spyrðir, spyrði, spyrðum, spyrðuð, spyrðu'],
  ['weak subjunctive past umlauts again: á > æ', 'ná', ['næ', 'nærð', 'náði', 'náðum', 'náð'], 'subjPast', 'næði, næðir, næði, næðum, næðuð, næðu'],
  ['no second umlaut when the present has the same vowel as the past', 'trúa', ['trúi', 'trúir', 'trúði', 'trúðum', 'trúað'], 'subjPast', 'trúði, trúðir, trúði, trúðum, trúðuð, trúðu'],
  ['strong 2sg past: -st', 'taka', ['tek', 'tekur', 'tók', 'tókum', 'tekið'], 'past', 'tók, tókst, tók, tókum, tókuð, tóku'],
  ['strong 2sg past after s or x: -t', 'vaxa', ['vex', 'vex', 'óx', 'uxum', 'vaxið'], 'past', 'óx, óxt, óx, uxum, uxuð, uxu'],
  ['strong 2sg past: t + st > st', 'halda', ['held', 'heldur', 'hélt', 'héldum', 'haldið'], 'past', 'hélt, hélst, hélt, héldum, hélduð, héldu'],
  ['strong 2sg past: s + t', 'lesa', ['les', 'lest', 'las', 'lásum', 'lesið'], 'past', 'las, last, las, lásum, lásuð, lásu'],
  ['imperative: -ðu after a vowel', 'sjá', ['sé', 'sérð', 'sá', 'sáum', 'séð'], 'impAff', imp('sjáðu', 'sjáum', 'sjáið')],
  ['imperative: -ðu after r', 'fara', ['fer', 'ferð', 'fór', 'fórum', 'farið'], 'impAff', imp('farðu', 'förum', 'farið')],
  ['imperative: -du after m', 'koma', ['kem', 'kemur', 'kom', 'komum', 'komið'], 'impAff', imp('komdu', 'komum', 'komið')],
  ['imperative: -tu after k', 'taka', ['tek', 'tekur', 'tók', 'tókum', 'tekið'], 'impAff', imp('taktu', 'tökum', 'takið')],
  ['imperative: -tu after s', 'lesa', ['les', 'lest', 'las', 'lásum', 'lesið'], 'impAff', imp('lestu', 'lesum', 'lesið')],
  ['imperative: -tu after t', 'sitja', ['sit', 'situr', 'sat', 'sátum', 'setið'], 'impAff', imp('sittu', 'sitjum', 'sitjið')],
  ['imperative: -ðu after f', 'gefa', ['gef', 'gefur', 'gaf', 'gáfum', 'gefið'], 'impAff', imp('gefðu', 'gefum', 'gefið')],
  ['imperative: -ðu after g', 'segja', ['segi', 'segir', 'sagði', 'sögðum', 'sagt'], 'impAff', imp('segðu', 'segjum', 'segið')],
  ['imperative: -du after l', 'telja', ['tel', 'telur', 'taldi', 'töldum', 'talið'], 'impAff', imp('teldu', 'teljum', 'teljið')],
  ['imperative: -du after nn', 'finna', ['finn', 'finnur', 'fann', 'fundum', 'fundið'], 'impAff', imp('finndu', 'finnum', 'finnið')],
  ['imperative: -du after ng', 'hringja', ['hringi', 'hringir', 'hringdi', 'hringdum', 'hringt'], 'impAff', imp('hringdu', 'hringjum', 'hringið')],
  ['imperative: nd + u', 'senda', ['sendi', 'sendir', 'sendi', 'sendum', 'sent'], 'impAff', imp('sendu', 'sendum', 'sendið')],
  ['imperative: -ddu after ð', 'bjóða', ['býð', 'býður', 'bauð', 'buðum', 'boðið'], 'impAff', imp('bjóddu', 'bjóðum', 'bjóðið')],
  ['imperative of a class-1 verb: infinitive + ðu', 'hugsa', undefined, 'impAff', imp('hugsaðu', 'hugsum', 'hugsið')],
  ['imperative: vera -> vertu / verum / verið', 'vera', ['er', 'ert', 'var', 'vorum', 'verið'], 'impAff', imp('vertu', 'verum', 'verið')],
  ['a modal verb has no imperative', 'skulu', ['skal', 'skalt', 'skyldi', 'skyldum', 'skolað'], 'impAff', NO_IMP],
  ['infinitive in -u: 2pl -uð, 3pl = infinitive', 'munu', ['mun', 'munt', 'mundi', 'mundum', 'munað'], 'pres', 'mun, munt, mun, munum, munuð, munu'],
  ['infinitive in -o: þvo', 'þvo', ['þvæ', 'þværð', 'þvoði', 'þvoðum', 'þvegið'], 'pres', 'þvæ, þværð, þvær, þvoum, þvoið, þvo'],
  ['the compound tenses use hafa + supine, also for vera', 'vera', ['er', 'ert', 'var', 'vorum', 'verið'], 'perf', 'hef verið, hefur verið, hefur verið, höfum verið, hafið verið, hafa verið'],
  ['the compound tenses use hafa + supine, also for fara', 'fara', ['fer', 'ferð', 'fór', 'fórum', 'farið'], 'plup', 'hafði farið, hafðir farið, hafði farið, höfðum farið, höfðuð farið, höfðu farið'],
  ['futPerf: munu hafa + supine', 'sjá', ['sé', 'sérð', 'sá', 'sáum', 'séð'], 'futPerf', 'mun hafa séð, munt hafa séð, mun hafa séð, munum hafa séð, munuð hafa séð, munu hafa séð'],
  ['cond: myndi + infinitive', 'fara', ['fer', 'ferð', 'fór', 'fórum', 'farið'], 'cond', 'myndi fara, myndir fara, myndi fara, myndum fara, mynduð fara, myndu fara'],
  ['condPerf: myndi hafa + supine', 'fara', ['fer', 'ferð', 'fór', 'fórum', 'farið'], 'condPerf', 'myndi hafa farið, myndir hafa farið, myndi hafa farið, myndum hafa farið, mynduð hafa farið, myndu hafa farið'],
  // ---- found by the audits of the assembled database ----
  ['imperative: a t after a consonant is not doubled (skipta -> skiptu)', 'skipta', ['skipti', 'skiptir', 'skipti', 'skiptum', 'skipt'], 'impAff', imp('skiptu', 'skiptum', 'skiptið')],
  ['imperative: a t after a consonant is not doubled (elta -> eltu)', 'elta', ['elti', 'eltir', 'elti', 'eltum', 'elt'], 'impAff', imp('eltu', 'eltum', 'eltið')],
  ['imperative: a t after a consonant is not doubled (birta -> birtu)', 'birta', ['birti', 'birtir', 'birti', 'birtum', 'birt'], 'impAff', imp('birtu', 'birtum', 'birtið')],
  ['imperative: a t after a consonant is not doubled (snerta -> snertu)', 'snerta', ['snerti', 'snertir', 'snerti', 'snertum', 'snert'], 'impAff', imp('snertu', 'snertum', 'snertið')],
  ['imperative: a t after a consonant is not doubled (velta -> veltu)', 'velta', ['velti', 'veltir', 'velti', 'veltum', 'velt'], 'impAff', imp('veltu', 'veltum', 'veltið')],
  ['imperative: a t after a consonant is not doubled (lyfta -> lyftu)', 'lyfta', ['lyfti', 'lyftir', 'lyfti', 'lyftum', 'lyft'], 'impAff', imp('lyftu', 'lyftum', 'lyftið')],
  ['imperative: a t after a vowel is doubled (breyta -> breyttu)', 'breyta', ['breyti', 'breytir', 'breytti', 'breyttum', 'breytt'], 'impAff', imp('breyttu', 'breytum', 'breytið')],
  ['imperative: nn + a t-past gives -ntu (kynna -> kynntu)', 'kynna', ['kynni', 'kynnir', 'kynnti', 'kynntum', 'kynnt'], 'impAff', imp('kynntu', 'kynnum', 'kynnið')],
  ['imperative: nn + a t-past gives -ntu (minna -> minntu)', 'minna', ['minni', 'minnir', 'minnti', 'minntum', 'minnt'], 'impAff', imp('minntu', 'minnum', 'minnið')],
  ['imperative: nn + a t-past gives -ntu (sinna -> sinntu)', 'sinna', ['sinni', 'sinnir', 'sinnti', 'sinntum', 'sinnt'], 'impAff', imp('sinntu', 'sinnum', 'sinnið')],
  ['imperative: nn + a d-past stays -ndu (kenna -> kenndu)', 'kenna', ['kenni', 'kennir', 'kenndi', 'kenndum', 'kennt'], 'impAff', imp('kenndu', 'kennum', 'kennið')],
  ['imperative: nn + a d-past stays -ndu (brenna -> brenndu)', 'brenna', ['brenni', 'brennir', 'brenndi', 'brenndum', 'brennt'], 'impAff', imp('brenndu', 'brennum', 'brennið')],
  ['strong 2sg past: a past in -st stays (brast)', 'bresta', ['brest', 'brestur', 'brast', 'brustum', 'brostið'], 'past', 'brast, brast, brast, brustum, brustuð, brustu'],
  ['prefix relative of leggja takes legðu (eyðileggja)', 'eyðileggja', ['eyðilegg', 'eyðileggur', 'eyðilagði', 'eyðilögðum', 'eyðilagt'], 'impAff', imp('eyðilegðu', 'eyðileggjum', 'eyðileggið')],
  ['prefix relative of leggja takes legðu (kortleggja)', 'kortleggja', ['kortlegg', 'kortleggur', 'kortlagði', 'kortlögðum', 'kortlagt'], 'impAff', imp('kortlegðu', 'kortleggjum', 'kortleggið')],
  ['prefix relative of leggja: subjunctive past (skipuleggja)', 'skipuleggja', ['skipulegg', 'skipuleggur', 'skipulagði', 'skipulögðum', 'skipulagt'], 'subjPast', 'skipulegði, skipulegðir, skipulegði, skipulegðum, skipulegðuð, skipulegðu'],
  ['prefix relative of ganga takes gakktu (sniðganga)', 'sniðganga', ['sniðgeng', 'sniðgengur', 'sniðgekk', 'sniðgengum', 'sniðgengið'], 'impAff', imp('sniðgakktu', 'sniðgöngum', 'sniðgangið')],
  ['prefix relative of sækja: the subjunctive past umlauts again (lögsækja)', 'lögsækja', ['lögsæki', 'lögsækir', 'lögsótti', 'lögsóttum', 'lögsótt'], 'subjPast', 'lögsækti, lögsæktir, lögsækti, lögsæktum, lögsæktuð, lögsæktu'],
  ['auka: past plural jukum, subjunctive yki', 'auka', ['eyk', 'eykur', 'jók', 'jukum', 'aukið'], 'subjPast', 'yki, ykir, yki, ykjum, ykjuð, ykju'],
  ['víkja: vék, viku (not *veik)', 'víkja', ['vík', 'víkur', 'vék', 'vikum', 'vikið'], 'past', 'vék, vékst, vék, vikum, vikuð, viku'],
  ['víkja: subjunctive past viki', 'víkja', ['vík', 'víkur', 'vék', 'vikum', 'vikið'], 'subjPast', 'viki, vikir, viki, vikjum, vikjuð, vikju'],
  ['kljúfa: klýf in the 1sg and 2sg', 'kljúfa', ['klýf', 'klýfur', 'klauf', 'klufum', 'klofið'], 'pres', 'klýf, klýfur, klýfur, kljúfum, kljúfið, kljúfa'],
  ['fela (hide) is weak: faldi, földum', 'fela', ['fel', 'felur', 'faldi', 'földum', 'falið'], 'past', 'faldi, faldir, faldi, földum, földuð, földu'],
  ['fela (hide): subjunctive past feldi', 'fela', ['fel', 'felur', 'faldi', 'földum', 'falið'], 'subjPast', 'feldi, feldir, feldi, feldum, felduð, feldu'],
  ['fela (entrust) is strong: fól, fólum', 'fela', ['fel', 'felur', 'fól', 'fólum', 'falið'], 'past', 'fól, fólst, fól, fólum, fóluð, fólu'],
  ['sleppa (release) is weak: sleppti', 'sleppa', ['sleppi', 'sleppir', 'sleppti', 'slepptum', 'sleppt'], 'past', 'sleppti, slepptir, sleppti, slepptum, slepptuð, slepptu'],
  ['sleppa (escape) is strong: slapp, sluppum', 'sleppa', ['sleppi', 'sleppir', 'slapp', 'sluppum', 'sloppið'], 'subjPast', 'slyppi, slyppir, slyppi, slyppum, slyppuð, slyppu'],
  ['mæla (measure) is mældi', 'mæla', ['mæli', 'mælir', 'mældi', 'mældum', 'mælt'], 'past', 'mældi, mældir, mældi, mældum, mælduð, mældu'],
  ['weak verb in -aði with an explicit class-1 parts list: útvega (not vega)', 'útvega', ['útvega', 'útvegar', 'útvegaði', 'útveguðum', 'útvegað'], 'past', 'útvegaði, útvegaðir, útvegaði, útveguðum, útveguðuð, útveguðu'],
  ['explicit class-1 parts: afreka is not a relative of reka', 'afreka', ['afreka', 'afrekar', 'afrekaði', 'afrekuðum', 'afrekað'], 'pres', 'afreka, afrekar, afrekar, afrekum, afrekið, afreka'],
  ['explicit class-1 parts: skapa with the u-umlaut', 'skapa', ['skapa', 'skapar', 'skapaði', 'sköpuðum', 'skapað'], 'pres', 'skapa, skapar, skapar, sköpum, skapið, skapa'],
  ['explicit class-1 parts: mala with the u-umlaut', 'mala', ['mala', 'malar', 'malaði', 'möluðum', 'malað'], 'past', 'malaði, malaðir, malaði, möluðum, möluðuð, möluðu'],
  ['upplifa: class 3 like lifa', 'upplifa', ['upplifi', 'upplifir', 'upplifði', 'upplifðum', 'upplifað'], 'pres', 'upplifi, upplifir, upplifir, upplifum, upplifið, upplifa'],
  ['dimma: a weather verb in the 3rd person singular only', 'dimma', ['dimmi', 'dimmir', 'dimmdi', 'dimmdum', 'dimmt'], 'past', `${NONE}, ${NONE}, dimmdi, ${NONE}, ${NONE}, ${NONE}`],
  ['róa (calm) is weak: róaði', 'róa', ['róa', 'róar', 'róaði', 'róuðum', 'róað'], 'past', 'róaði, róaðir, róaði, róuðum, róuðuð, róuðu'],
  ['þola: the subjunctive past umlauts o > y (like þora, kunna)', 'þola', ['þoli', 'þolir', 'þoldi', 'þoldum', 'þolað'], 'subjPast', 'þyldi, þyldir, þyldi, þyldum, þylduð, þyldu'],
  ['vekja: 1sg vek (short stem like telja)', 'vekja', ['vek', 'vekur', 'vakti', 'vöktum', 'vakið'], 'pres', 'vek, vekur, vekur, vekjum, vekið, vekja'],

];
for (const [label, inf, parts, tense, want] of RULES) {
  report.checks += 1;
  const result = conjugate(inf, parts);
  if (!result) { report.fail(`${label}: conjugate(${inf}) returned null`); continue; }
  const actual = result.forms[tense].join(', ');
  if (actual !== want) report.fail(`${label}: ${inf}.${tense}\n    expected: ${want}\n    actual:   ${actual}`);
}

// ---- input that cannot be conjugated with confidence must be refused, not guessed at ----
const GOOD = ['tek', 'tekur', 'tók', 'tókum', 'tekið'];
const NULL_CASES = [
  ['empty string', '', undefined], ['not a verb', 'hello', undefined], ['not a verb with parts', 'hello', GOOD],
  ['middle voice -st', 'sjást', undefined], ['middle voice with parts', 'sjást', ['sést', 'sést', 'sást', 'sáumst', 'sést']],
  ['middle voice kallast', 'kallast', undefined], ['middle voice heyrast', 'heyrast', ['heyrist', 'heyrist', 'heyrðist', 'heyrðumst', 'heyrst']],
  ['digits', '123', undefined], ['plain Object key', 'constructor', undefined], ['toString', 'toString', undefined],
  ['__proto__', '__proto__', undefined], ['hasOwnProperty', 'hasOwnProperty', undefined], ['a space inside', 'taka upp', GOOD],
  ['only a space', ' ', undefined], ['punctuation', 'tala!', undefined], ['one letter', 'a', undefined],
  ['no vowel in the stem', 'bra', undefined], ['English word ending in a', 'banana-', undefined],
  ['not a string', 42, undefined], ['null input', null, undefined], ['undefined input', undefined, undefined],
  ['an array as input', ['tala'], undefined], ['an object as input', {}, undefined],
  ['parts: four', 'taka', ['tek', 'tekur', 'tók', 'tókum']], ['parts: six', 'taka', [...GOOD, 'x']],
  ['parts: empty array', 'taka', []], ['parts: a string', 'taka', 'tek tekur tók tókum tekið'], ['parts: an object', 'taka', { 0: 'tek' }],
  ['parts: a number inside', 'taka', ['tek', 'tekur', 'tók', 'tókum', 5]], ['parts: an empty string inside', 'taka', ['tek', '', 'tók', 'tókum', 'tekið']],
  ['parts: a space inside', 'taka', ['tek', 'tekur', 'tók', 'tókum', 'tekið upp']], ['parts: digits inside', 'taka', ['tek', 'tekur', 'tók', 'tókum', '123']],
  ['past plural without -um', 'taka', ['tek', 'tekur', 'tók', 'tókun', 'tekið']], ['past plural is only -um', 'taka', ['tek', 'tekur', 'tók', 'um', 'tekið']],
  ['weak past plural contradicts the past (no umlaut)', 'telja', ['tel', 'telur', 'taldi', 'taldum', 'talið']],
  ['weak past plural contradicts the past (other stem)', 'heyra', ['heyri', 'heyrir', 'heyrði', 'hlustuðum', 'heyrt']],
  ['-aði past without the plural umlaut', 'tala', ['tala', 'talar', 'talaði', 'taluðum', 'talað']],
  ['2sg of an unknown shape (no 3sg derivable)', 'geta', ['get', 'geta', 'gat', 'gátum', 'getað']],
  ['strong past plural without a vowel', 'taka', ['tek', 'tekur', 'tók', 'xxum', 'tekið']],
  ['strong past plural with an unknown vowel group', 'taka', ['tek', 'tekur', 'tók', 'tióum', 'tekið']],
  ['imperative of an unknown stem ending (b): no guess', 'skrúba', ['skrúbi', 'skrúbir', 'skrúbti', 'skrúbtum', 'skrúbt']],
  ['infinitive in -ó', 'tó', GOOD], ['infinitive in -i', 'fari', GOOD], ['infinitive in -ur', 'tekur', GOOD], ['infinitive in -ð', 'ferð', GOOD],
  ['ASCII-only look-alike with q', 'qwrt', undefined],
];
for (const [label, input, parts] of NULL_CASES) {
  report.checks += 1;
  if (conjugate(input, parts) !== null) report.fail(`${label}: conjugate(${JSON.stringify(input)}, ${JSON.stringify(parts)}) should be null`);
}

// An irregular verb given WITHOUT its parts must be refused: a regular class-1 guess would be wrong
// (taka -> *takaði). Prefixed relatives are refused too.
const NEEDS_PARTS_CASES = `taka fara koma gefa heyra kaupa setja telja segja sjá fá vera hafa vilja munu skulu eiga geta vita
  mega þurfa kunna gera halda standa sitja liggja leggja bjóða finna bíta fljúga drekka hlaupa þvo sækja þekkja
  senda nefna kenna læra spyrja biðja draga sofa slá búa snúa deyja ganga láta falla heita ráða gráta blása detta auka
  yfirgefa viðhalda upptelja afhafa undirstanda aðfara útsetja rigna ná trúa spá þrá hringja flytja`.trim().split(/\s+/);
for (const verb of NEEDS_PARTS_CASES) {
  report.checks += 1;
  if (conjugate(verb) !== null) report.fail(`conjugate(${JSON.stringify(verb)}) without parts should be null (irregular verb)`);
}

// Case and surrounding spaces are ignored.
{
  report.checks += 3;
  const spaced = conjugate('  Tala ');
  if (!spaced || spaced.inf !== 'tala') report.fail('conjugate("  Tala ") should normalise to tala');
  const upper = conjugate('TAKA', ['TEK', 'Tekur', 'tók', 'tókum', 'tekið']);
  if (!upper || upper.forms.pres.join(', ') !== 'tek, tekur, tekur, tökum, takið, taka') report.fail('upper-case input should be normalised');
  const withNull = conjugate('tala', null);
  if (!withNull || withNull.inf !== 'tala') report.fail('conjugate("tala", null) should conjugate the regular verb');
}

// Results do not share state: changing one result leaves the next one unchanged.
{
  report.checks += 2;
  const first = conjugate('tala');
  first.forms.pres[0] = 'X';
  first.forms.perf.push('Y');
  const second = conjugate('tala');
  if (second.forms.pres[0] !== 'tala' || second.forms.perf.length !== 6) report.fail('conjugate() results share mutable state');
  const third = conjugate('vera', ['er', 'ert', 'var', 'vorum', 'verið']);
  third.forms.impAff[4] = 'X';
  if (conjugate('vera', ['er', 'ert', 'var', 'vorum', 'verið']).forms.impAff[4] !== 'verið') report.fail('vera result shares mutable state');
}

// The result of a verb with a prefix keeps the prefix in every irregular form.
{
  report.checks += 1;
  const result = conjugate('upptelja', ['upptel', 'upptelur', 'upptaldi', 'upptöldum', 'upptalið']);
  if (!result || result.inf !== 'upptelja' || result.participle !== 'upptalið' || result.gerund !== 'uppteljandi') report.fail('upptelja: inf / gerund / participle');
}

// ---- structure of every result (the whole EXPECTED table and every verb of verbs.js) ----
const LETTERS_OK = /^[a-záðéíóúýþæö —]+$/;
const V = 'aáeéiíoóuúyýæö';
// u-umlaut of the last vowel group when it is exactly "a": tal -> töl, hlaup -> hlaup
const umlautA = stem => stem.replace(new RegExp(`(^|[^${V}])a([^${V}]*)$`), '$1ö$2');
// the stem of the past plural a weak past 1sg implies: taldi -> töld, heyrði -> heyrð, talaði -> töluð
function weakPluralStem(past) {
  const base = past.slice(0, -1);
  return /að$/.test(base) ? umlautA(base.slice(0, -2)) + 'uð' : umlautA(base);
}

// `parts` is the parts array of the entry (undefined for a regular verb of class 1).
function checkResult(label, inf, parts, result) {
  report.checks += 1;
  const bad = message => report.fail(`${label}: ${message}`);
  if (result.inf !== inf) bad(`inf ${result.inf} should be ${inf}`);
  if (Object.keys(result.forms).join() !== FORM_KEYS.join()) bad(`wrong form keys ${Object.keys(result.forms)}`);
  for (const key of FORM_KEYS) {
    const forms = result.forms[key];
    if (!Array.isArray(forms) || forms.length !== 6) { bad(`${key}: not six forms: ${JSON.stringify(forms)}`); continue; }
    for (const form of forms) {
      if (typeof form !== 'string' || !form) bad(`${key}: empty form ${JSON.stringify(form)}`);
      else if (/undefined|NaN|null|\[object/.test(form)) bad(`${key}: ${form}`);
      else if (!LETTERS_OK.test(form)) bad(`${key}: odd letters in "${form}"`);
    }
  }
  // munu and skulu have no supine and no present participle (and no compound tenses)
  const defective = inf === 'munu' || inf === 'skulu';
  if (defective) {
    if (result.participle !== NONE || result.gerund !== NONE) bad('munu / skulu should have no participle and no gerund');
  } else if (!/^[a-záðéíóúýþæö]+$/.test(result.participle)) bad(`odd participle ${result.participle}`);
  if (!defective && !/andi$/.test(result.gerund)) bad(`odd gerund ${result.gerund}`);
  const { pres, past, subjPast, subjPres } = result.forms;
  const weather = pres[0] === NONE;
  // the 3rd person plural of the present is the infinitive (vera: eru), and the 3rd person singular is never empty
  if (!weather && pres[5] !== inf && inf !== 'vera') bad(`pres 3pl ${pres[5]} should be the infinitive`);
  if (!weather && pres[3].slice(-2) !== 'um') bad(`pres 1pl ${pres[3]} should end in -um`);
  if (!weather && (pres[3] === NONE || pres[4] === NONE)) bad('pres plural missing');
  if (!weather && subjPres[5] !== subjPres[0] && inf !== 'vera') bad('subjPres 3pl should equal 1sg');
  if (!weather && subjPres[2] !== subjPres[0]) bad('subjPres 3sg should equal 1sg');
  if (!weather && past[0] !== past[2]) bad('past 1sg and 3sg differ');
  if (!weather && subjPast[0] !== subjPast[2]) bad('subjPast 1sg and 3sg differ');
  // compound tenses end in the supine / infinitive
  for (const key of ['perf', 'plup', 'subjPerf', 'subjPlup']) {
    result.forms[key].forEach(form => { if (form !== NONE && !form.endsWith(` ${result.participle}`)) bad(`${key}: "${form}" does not end in the supine`); });
  }
  for (const key of ['fut', 'cond']) {
    result.forms[key].forEach(form => { if (form !== NONE && !form.endsWith(` ${inf}`)) bad(`${key}: "${form}" does not end in the infinitive`); });
  }
  if (!parts) return;
  // the forms follow the parts
  if (!weather && (pres[0] !== parts[0] || pres[1] !== parts[1])) bad(`pres 1sg/2sg ${pres[0]}/${pres[1]} differ from the parts`);
  if (!weather && past[0] !== parts[2]) bad(`past 1sg ${past[0]} differs from the parts`);
  if (!weather && past[3] !== parts[3]) bad(`past 1pl ${past[3]} differs from the parts`);
  if (!defective && result.participle !== parts[4]) bad(`participle ${result.participle} differs from the parts`);
  if (!/(?:ið|að|ð|t|d)$/.test(parts[4])) bad(`odd supine ${parts[4]}`);
  const weakPast = /i$/.test(parts[2]);
  if (weakPast) {
    // a weak past plural is the past 1sg without -i plus -um (with the u-umlaut: taldi -> töldum, talaði -> töluðum)
    if (parts[3] !== weakPluralStem(parts[2]) + 'um') bad(`weak past plural ${parts[3]} does not fit the past ${parts[2]}`);
    const base = parts[2].slice(0, -1);
    if (/að$/.test(base)) {
      if (parts[4] !== base) bad(`the supine of ${parts[2]} should be ${base}, not ${parts[4]}`);
    } else {
      // the supine is the past stem (without the dental) + t / ð / d, or one of the irregular -ið / -að supines (talið, vitað)
      const stem = base.replace(/(?:ð|d|t)$/, '');
      const ok = [stem + 't', stem + 'ð', stem + 'd', base + 't', base.replace(/dd$/, 't') + 't'].includes(parts[4]) || /(?:ið|að)$/.test(parts[4]);
      if (!ok) bad(`the supine ${parts[4]} does not fit the weak past ${parts[2]}`);
    }
  } else if (!/(?:ið|að|ð)$/.test(parts[4])) bad(`a strong verb's supine ${parts[4]} should end in -ið, -að or -ð`);
}

for (const [verb, spec] of Object.entries(EXPECTED)) {
  const inf = spec.inf || verb;
  const result = conjugate(inf, spec.parts);
  if (result) checkResult(`EXPECTED ${verb}`, inf, spec.parts, result);
}

// ---- every verb of verbs.js must conjugate into well-formed output ----
let translations = 0;
for (const [english, options] of Object.entries(VERBS)) {
  for (const entry of options) {
    translations += 1;
    const label = `${english} -> ${entry.is}`;
    if (typeof entry.is !== 'string' || !/^[a-záðéíóúýþæö]+$/.test(entry.is)) { report.fail(`${label}: odd infinitive`); continue; }
    if (entry.parts !== undefined && (!Array.isArray(entry.parts) || entry.parts.length !== 5)) { report.fail(`${label}: parts must have five strings`); continue; }
    const result = conjugate(entry.is, entry.parts);
    if (!result) { report.fail(`${label}: conjugate() returned null (parts ${JSON.stringify(entry.parts)})`); continue; }
    checkResult(label, entry.is, entry.parts || [entry.is, entry.is + 'r', entry.is.slice(0, -1) + 'aði', umlautA(entry.is.slice(0, -1)) + 'uðum', entry.is.slice(0, -1) + 'að'], result);
    // a verb without parts is regular class 1: the infinitive ends in -a and the past in -aði
    const person = result.forms.pres[0] === NONE ? 2 : 0; // a weather verb has only the 3rd person
    if (!entry.parts && (!/a$/.test(entry.is) || result.forms.past[person] !== entry.is.slice(0, -1) + 'aði')) {
      report.fail(`${label}: a verb without parts must be a class-1 verb in -a`);
    }
  }
}

// ---- the data: one infinitive, one paradigm (found by the audits of the assembled database) ----
// The same infinitive in several lines must carry the same principal parts. Real homographs (two verbs with
// one infinitive) are the only exceptions and every allowed variant is listed. A line without parts means a
// regular class-1 verb, so a verb that has parts in one line and none in another is a missing entry
// (beita, elta, herma, hressa and erta were found that way); víkja had 'veik' in four lines and 'vék' in the rest.
const HOMOGRAPHS = {
  fela: ['fel/felur/fól/fólum/falið', 'fel/felur/faldi/földum/falið'],                       // entrust / hide
  róa: ['ræ/rærð/reri/rerum/róið', 'róa/róar/róaði/róuðum/róað'],                           // row / calm
  sleppa: ['sleppi/sleppir/slapp/sluppum/sloppið', 'sleppi/sleppir/sleppti/slepptum/sleppt'], // escape / release
  mæla: ['mæli/mælir/mældi/mældum/mælt', 'mæli/mælir/mælti/mæltum/mælt'],                   // measure / say
};
// Paradigms checked one by one during the audits: every line that contains the verb must use exactly these parts.
const AUDITED = {
  víkja: 'vík/víkur/vék/vikum/vikið', auka: 'eyk/eykur/jók/jukum/aukið', kljúfa: 'klýf/klýfur/klauf/klufum/klofið',
  vekja: 'vek/vekur/vakti/vöktum/vakið', beita: 'beiti/beitir/beitti/beittum/beitt', elta: 'elti/eltir/elti/eltum/elt',
  erta: 'erti/ertir/erti/ertum/ert', herma: 'hermi/hermir/hermdi/hermdum/hermt', hressa: 'hressi/hressir/hressti/hresstum/hresst',
  skapa: 'skapa/skapar/skapaði/sköpuðum/skapað', útvega: 'útvega/útvegar/útvegaði/útveguðum/útvegað',
  afreka: 'afreka/afrekar/afrekaði/afrekuðum/afrekað', árétta: 'árétta/áréttar/áréttaði/áréttuðum/áréttað',
  upplifa: 'upplifi/upplifir/upplifði/upplifðum/upplifað', laða: 'laða/laðar/laðaði/löðuðum/laðað',
  dimma: 'dimmi/dimmir/dimmdi/dimmdum/dimmt', mala: 'mala/malar/malaði/möluðum/malað',
};
// The stem vowel of the 1sg and of the 2sg present agree (tek/tekur, fer/ferð, á/átt); róa [ró/rærð...] did not.
const lastVowelOf = form => (form.match(/([aáeéiíoóuúyýæö]+)[^aáeéiíoóuúyýæö]*$/) || [])[1];
{
  const variants = new Map(); // infinitive -> Map(parts -> [english...])
  for (const [english, options] of Object.entries(VERBS)) {
    for (const entry of options) {
      report.checks += 1;
      const key = entry.parts ? entry.parts.join('/') : '(no parts)';
      if (!variants.has(entry.is)) variants.set(entry.is, new Map());
      const byParts = variants.get(entry.is);
      if (!byParts.has(key)) byParts.set(key, []);
      byParts.get(key).push(english);
      if (Object.hasOwn(AUDITED, entry.is) && key !== AUDITED[entry.is]) {
        report.fail(`${english} -> ${entry.is}: parts ${key} differ from the audited ${AUDITED[entry.is]}`);
      }
      if (entry.parts && entry.is !== 'ala') {
        const stripped = entry.parts[1].replace(/(?:ur|ir|ar|rð|ð|st|r|t)$/, '');
        const first = entry.parts[0].replace(/ir$/.test(entry.parts[1]) ? /i$/ : /ar$/.test(entry.parts[1]) ? /a$/ : /^$/, ''); // heyri/heyrir, tala/talar
        if (lastVowelOf(first) !== lastVowelOf(stripped)) {
          report.fail(`${english} -> ${entry.is}: the 1sg ${entry.parts[0]} and the 2sg ${entry.parts[1]} have different stem vowels`);
        }
      }
    }
  }
  for (const [inf, byParts] of variants) {
    report.checks += 1;
    if (Object.hasOwn(HOMOGRAPHS, inf)) {
      for (const key of byParts.keys()) {
        if (!HOMOGRAPHS[inf].includes(key)) report.fail(`${inf}: parts ${key} are not one of the allowed variants ${HOMOGRAPHS[inf].join(' | ')}`);
      }
    } else if (byParts.size > 1) {
      const lines = [...byParts].map(([key, english]) => `${key} (${english.join(', ')})`).join('  vs  ');
      report.fail(`${inf} has different principal parts in different lines: ${lines}`);
    }
  }
}

// Writing non-ASCII text has produced U+FFFD replacement characters before.
for (const file of ['conjugate.js', 'verbs.js', 'test.js']) {
  report.checks += 1;
  const text = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (text.includes('\uFFFD')) report.fail(`${file} contains U+FFFD replacement characters`);
}

// ---- NULL (add null cases above this line) ----

report.finish(`${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Icelandic translations`);
