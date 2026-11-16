// Run with: node test.js
// Checks the Swahili conjugation engine against known paradigms, then runs every
// Swahili verb in verbs.js through it to catch crashes and malformed output.
const { conjugate, NONE } = require('./conjugate.js');
const { VERBS } = require('./verbs.js');
const { createReport, checkParadigms, checkInflectedDatabase } = require('../shared/test-kit.js');

// verb -> { tense: 'mimi, wewe, yeye, sisi, ninyi, wao' }  (gerund / participle as plain strings)
// A form that does not exist is written '—'.
const EXPECTED = {
  // ---- Regular verb, consonant-initial root ---------------------------------------
  kusoma: {
    pres: 'ninasoma, unasoma, anasoma, tunasoma, mnasoma, wanasoma',
    past: 'nilisoma, ulisoma, alisoma, tulisoma, mlisoma, walisoma',
    perf: 'nimesoma, umesoma, amesoma, tumesoma, mmesoma, wamesoma',
    fut: 'nitasoma, utasoma, atasoma, tutasoma, mtasoma, watasoma',
    hab: 'husoma, husoma, husoma, husoma, husoma, husoma',
    pastProg: 'nilikuwa ninasoma, ulikuwa unasoma, alikuwa anasoma, tulikuwa tunasoma, mlikuwa mnasoma, walikuwa wanasoma',
    futProg: 'nitakuwa ninasoma, utakuwa unasoma, atakuwa anasoma, tutakuwa tunasoma, mtakuwa mnasoma, watakuwa wanasoma',
    subj: 'nisome, usome, asome, tusome, msome, wasome',
    imp: '—, soma, —, —, someni, —',
    cond: 'nikisoma, ukisoma, akisoma, tukisoma, mkisoma, wakisoma',
    hyp: 'ningesoma, ungesoma, angesoma, tungesoma, mngesoma, wangesoma',
    hypPast: 'ningalisoma, ungalisoma, angalisoma, tungalisoma, mngalisoma, wangalisoma',
    negPres: 'sisomi, husomi, hasomi, hatusomi, hamsomi, hawasomi',
    negPast: 'sikusoma, hukusoma, hakusoma, hatukusoma, hamkusoma, hawakusoma',
    negFut: 'sitasoma, hutasoma, hatasoma, hatutasoma, hamtasoma, hawatasoma',
    negPerf: 'sijasoma, hujasoma, hajasoma, hatujasoma, hamjasoma, hawajasoma',
    gerund: 'kusoma', participle: 'soma',
  },

  // ---- Monosyllabic roots keep ku- (kula) ------------------------------------------
  kula: {
    pres: 'ninakula, unakula, anakula, tunakula, mnakula, wanakula',
    past: 'nilikula, ulikula, alikula, tulikula, mlikula, walikula',
    perf: 'nimekula, umekula, amekula, tumekula, mmekula, wamekula',
    fut: 'nitakula, utakula, atakula, tutakula, mtakula, watakula',
    hab: 'hula, hula, hula, hula, hula, hula',
    pastProg: 'nilikuwa ninakula, ulikuwa unakula, alikuwa anakula, tulikuwa tunakula, mlikuwa mnakula, walikuwa wanakula',
    futProg: 'nitakuwa ninakula, utakuwa unakula, atakuwa anakula, tutakuwa tunakula, mtakuwa mnakula, watakuwa wanakula',
    subj: 'nile, ule, ale, tule, mle, wale',
    imp: '—, kula, —, —, kuleni, —',
    hyp: 'ningekula, ungekula, angekula, tungekula, mngekula, wangekula',
    hypPast: 'ningalikula, ungalikula, angalikula, tungalikula, mngalikula, wangalikula',
    negPres: 'sili, huli, hali, hatuli, hamli, hawali',
    negPast: 'sikula, hukula, hakula, hatukula, hamkula, hawakula',
    negFut: 'sitakula, hutakula, hatakula, hatutakula, hamtakula, hawatakula',
    gerund: 'kula', participle: 'la',
  },

  kunywa: {
    pres: 'ninakunywa, unakunywa, anakunywa, tunakunywa, mnakunywa, wanakunywa',
    past: 'nilikunywa, ulikunywa, alikunywa, tulikunywa, mlikunywa, walikunywa',
    perf: 'nimekunywa, umekunywa, amekunywa, tumekunywa, mmekunywa, wamekunywa',
    fut: 'nitakunywa, utakunywa, atakunywa, tutakunywa, mtakunywa, watakunywa',
    hab: 'hunywa, hunywa, hunywa, hunywa, hunywa, hunywa',
    subj: 'ninywe, unywe, anywe, tunywe, mnywe, wanywe',
    imp: '—, kunywa, —, —, kunyweni, —',
    negPres: 'sinywi, hunywi, hanywi, hatunywi, hamnywi, hawanywi',
    negPast: 'sikunywa, hukunywa, hakunywa, hatukunywa, hamkunywa, hawakunywa',
    negFut: 'sitakunywa, hutakunywa, hatakunywa, hatutakunywa, hamtakunywa, hawatakunywa',
    gerund: 'kunywa', participle: 'nywa',
  },
  kuja: {
    pres: 'ninakuja, unakuja, anakuja, tunakuja, mnakuja, wanakuja',
    past: 'nilikuja, ulikuja, alikuja, tulikuja, mlikuja, walikuja',
    perf: 'nimekuja, umekuja, amekuja, tumekuja, mmekuja, wamekuja',
    fut: 'nitakuja, utakuja, atakuja, tutakuja, mtakuja, watakuja',
    hab: 'huja, huja, huja, huja, huja, huja',
    pastProg: 'nilikuwa ninakuja, ulikuwa unakuja, alikuwa anakuja, tulikuwa tunakuja, mlikuwa mnakuja, walikuwa wanakuja',
    futProg: 'nitakuwa ninakuja, utakuwa unakuja, atakuwa anakuja, tutakuwa tunakuja, mtakuwa mnakuja, watakuwa wanakuja',
    subj: 'nije, uje, aje, tuje, mje, waje',
    imp: '—, njoo, —, —, njooni, —',
    hyp: 'ningekuja, ungekuja, angekuja, tungekuja, mngekuja, wangekuja',
    hypPast: 'ningalikuja, ungalikuja, angalikuja, tungalikuja, mngalikuja, wangalikuja',
    negPres: 'siji, huji, haji, hatuji, hamji, hawaji',
    negPast: 'sikuja, hukuja, hakuja, hatukuja, hamkuja, hawakuja',
    negFut: 'sitakuja, hutakuja, hatakuja, hatutakuja, hamtakuja, hawatakuja',
    gerund: 'kuja', participle: 'ja',
  },
  kufa: {
    pres: 'ninakufa, unakufa, anakufa, tunakufa, mnakufa, wanakufa',
    past: 'nilikufa, ulikufa, alikufa, tulikufa, mlikufa, walikufa',
    perf: 'nimekufa, umekufa, amekufa, tumekufa, mmekufa, wamekufa',
    fut: 'nitakufa, utakufa, atakufa, tutakufa, mtakufa, watakufa',
    hab: 'hufa, hufa, hufa, hufa, hufa, hufa',
    subj: 'nife, ufe, afe, tufe, mfe, wafe',
    imp: '—, kufa, —, —, kufeni, —',
    negPres: 'sifi, hufi, hafi, hatufi, hamfi, hawafi',
    negPast: 'sikufa, hukufa, hakufa, hatukufa, hamkufa, hawakufa',
  },
  kupa: {
    pres: 'ninakupa, unakupa, anakupa, tunakupa, mnakupa, wanakupa',
    past: 'nilikupa, ulikupa, alikupa, tulikupa, mlikupa, walikupa',
    fut: 'nitakupa, utakupa, atakupa, tutakupa, mtakupa, watakupa',
    hab: 'hupa, hupa, hupa, hupa, hupa, hupa',
    subj: 'nipe, upe, ape, tupe, mpe, wape',
    negPres: 'sipi, hupi, hapi, hatupi, hampi, hawapi',
    negPast: 'sikupa, hukupa, hakupa, hatukupa, hamkupa, hawakupa',
  },
  kucha: {
    pres: 'ninakucha, unakucha, anakucha, tunakucha, mnakucha, wanakucha',
    fut: 'nitakucha, utakucha, atakucha, tutakucha, mtakucha, watakucha',
    hab: 'hucha, hucha, hucha, hucha, hucha, hucha',
    subj: 'niche, uche, ache, tuche, mche, wache',
    negPres: 'sichi, huchi, hachi, hatuchi, hamchi, hawachi',
    negPast: 'sikucha, hukucha, hakucha, hatukucha, hamkucha, hawakucha',
  },

  // ---- kuwa (to be): the present is the locative copula ----------------------------------------
  kuwa: {
    pres: 'niko, uko, yuko, tuko, mko, wako',
    past: 'nilikuwa, ulikuwa, alikuwa, tulikuwa, mlikuwa, walikuwa',
    perf: 'nimekuwa, umekuwa, amekuwa, tumekuwa, mmekuwa, wamekuwa',
    fut: 'nitakuwa, utakuwa, atakuwa, tutakuwa, mtakuwa, watakuwa',
    hab: 'huwa, huwa, huwa, huwa, huwa, huwa',
    pastProg: 'nilikuwa, ulikuwa, alikuwa, tulikuwa, mlikuwa, walikuwa',
    futProg: 'nitakuwa, utakuwa, atakuwa, tutakuwa, mtakuwa, watakuwa',
    subj: 'niwe, uwe, awe, tuwe, mwe, wawe',
    imp: '—, kuwa, —, —, kuweni, —',
    cond: 'nikiwa, ukiwa, akiwa, tukiwa, mkiwa, wakiwa',
    hyp: 'ningekuwa, ungekuwa, angekuwa, tungekuwa, mngekuwa, wangekuwa',
    hypPast: 'ningalikuwa, ungalikuwa, angalikuwa, tungalikuwa, mngalikuwa, wangalikuwa',
    negPres: 'siko, huko, hayuko, hatuko, hamko, hawako',
    negPast: 'sikuwa, hukuwa, hakuwa, hatukuwa, hamkuwa, hawakuwa',
    negFut: 'sitakuwa, hutakuwa, hatakuwa, hatutakuwa, hamtakuwa, hawatakuwa',
    gerund: 'kuwa', participle: 'wa',
  },
  'kuwa na': {
    pres: 'nina, una, ana, tuna, mna, wana',
    past: 'nilikuwa na, ulikuwa na, alikuwa na, tulikuwa na, mlikuwa na, walikuwa na',
    perf: 'nimekuwa na, umekuwa na, amekuwa na, tumekuwa na, mmekuwa na, wamekuwa na',
    fut: 'nitakuwa na, utakuwa na, atakuwa na, tutakuwa na, mtakuwa na, watakuwa na',
    hab: 'huwa na, huwa na, huwa na, huwa na, huwa na, huwa na',
    pastProg: 'nilikuwa na, ulikuwa na, alikuwa na, tulikuwa na, mlikuwa na, walikuwa na',
    futProg: 'nitakuwa na, utakuwa na, atakuwa na, tutakuwa na, mtakuwa na, watakuwa na',
    subj: 'niwe na, uwe na, awe na, tuwe na, mwe na, wawe na',
    imp: '—, kuwa na, —, —, kuweni na, —',
    cond: 'nikiwa na, ukiwa na, akiwa na, tukiwa na, mkiwa na, wakiwa na',
    hyp: 'ningekuwa na, ungekuwa na, angekuwa na, tungekuwa na, mngekuwa na, wangekuwa na',
    hypPast: 'ningalikuwa na, ungalikuwa na, angalikuwa na, tungalikuwa na, mngalikuwa na, wangalikuwa na',
    negPres: 'sina, huna, hana, hatuna, hamna, hawana',
    negPast: 'sikuwa na, hukuwa na, hakuwa na, hatukuwa na, hamkuwa na, hawakuwa na',
    negFut: 'sitakuwa na, hutakuwa na, hatakuwa na, hatutakuwa na, hamtakuwa na, hawatakuwa na',
    gerund: 'kuwa na', participle: 'wa na',
  },

  // ---- Vowel-initial roots -----------------------------------------------------------------------
  kwenda: {
    pres: 'ninaenda, unaenda, anaenda, tunaenda, mnaenda, wanaenda',
    past: 'nilienda, ulienda, alienda, tulienda, mlienda, walienda',
    perf: 'nimeenda, umeenda, ameenda, tumeenda, mmeenda, wameenda',
    fut: 'nitaenda, utaenda, ataenda, tutaenda, mtaenda, wataenda',
    hab: 'huenda, huenda, huenda, huenda, huenda, huenda',
    pastProg: 'nilikuwa ninaenda, ulikuwa unaenda, alikuwa anaenda, tulikuwa tunaenda, mlikuwa mnaenda, walikuwa wanaenda',
    futProg: 'nitakuwa ninaenda, utakuwa unaenda, atakuwa anaenda, tutakuwa tunaenda, mtakuwa mnaenda, watakuwa wanaenda',
    subj: 'niende, uende, aende, tuende, mwende, waende',
    imp: '—, nenda, —, —, nendeni, —',
    cond: 'nikienda, ukienda, akienda, tukienda, mkienda, wakienda',
    hyp: 'ningeenda, ungeenda, angeenda, tungeenda, mngeenda, wangeenda',
    hypPast: 'ningalienda, ungalienda, angalienda, tungalienda, mngalienda, wangalienda',
    negFut: 'sitaenda, hutaenda, hataenda, hatutaenda, hamtaenda, hawataenda',
    gerund: 'kwenda', participle: 'enda',
  },
  kuandika: {
    pres: 'ninaandika, unaandika, anaandika, tunaandika, mnaandika, wanaandika',
    past: 'niliandika, uliandika, aliandika, tuliandika, mliandika, waliandika',
    perf: 'nimeandika, umeandika, ameandika, tumeandika, mmeandika, wameandika',
    fut: 'nitaandika, utaandika, ataandika, tutaandika, mtaandika, wataandika',
    hab: 'huandika, huandika, huandika, huandika, huandika, huandika',
    pastProg: 'nilikuwa ninaandika, ulikuwa unaandika, alikuwa anaandika, tulikuwa tunaandika, mlikuwa mnaandika, walikuwa wanaandika',
    futProg: 'nitakuwa ninaandika, utakuwa unaandika, atakuwa anaandika, tutakuwa tunaandika, mtakuwa mnaandika, watakuwa wanaandika',
    subj: 'niandike, uandike, aandike, tuandike, mwandike, waandike',
    imp: '—, andika, —, —, andikeni, —',
    cond: 'nikiandika, ukiandika, akiandika, tukiandika, mkiandika, wakiandika',
    hyp: 'ningeandika, ungeandika, angeandika, tungeandika, mngeandika, wangeandika',
    hypPast: 'ningaliandika, ungaliandika, angaliandika, tungaliandika, mngaliandika, wangaliandika',
    negPast: 'sikuandika, hukuandika, hakuandika, hatukuandika, hamkuandika, hawakuandika',
    negFut: 'sitaandika, hutaandika, hataandika, hatutaandika, hamtaandika, hawataandika',
    negPerf: 'sijaandika, hujaandika, hajaandika, hatujaandika, hamjaandika, hawajaandika',
    gerund: 'kuandika', participle: 'andika',
  },
  // ---- Verbs borrowed from Arabic: a final -e, -i or -u stays ---------------------------------------
  kujibu: {
    pres: 'ninajibu, unajibu, anajibu, tunajibu, mnajibu, wanajibu',
    past: 'nilijibu, ulijibu, alijibu, tulijibu, mlijibu, walijibu',
    perf: 'nimejibu, umejibu, amejibu, tumejibu, mmejibu, wamejibu',
    fut: 'nitajibu, utajibu, atajibu, tutajibu, mtajibu, watajibu',
    hab: 'hujibu, hujibu, hujibu, hujibu, hujibu, hujibu',
    pastProg: 'nilikuwa ninajibu, ulikuwa unajibu, alikuwa anajibu, tulikuwa tunajibu, mlikuwa mnajibu, walikuwa wanajibu',
    futProg: 'nitakuwa ninajibu, utakuwa unajibu, atakuwa anajibu, tutakuwa tunajibu, mtakuwa mnajibu, watakuwa wanajibu',
    subj: 'nijibu, ujibu, ajibu, tujibu, mjibu, wajibu',
    imp: '—, jibu, —, —, jibuni, —',
    cond: 'nikijibu, ukijibu, akijibu, tukijibu, mkijibu, wakijibu',
    hyp: 'ningejibu, ungejibu, angejibu, tungejibu, mngejibu, wangejibu',
    hypPast: 'ningalijibu, ungalijibu, angalijibu, tungalijibu, mngalijibu, wangalijibu',
    negPres: 'sijibu, hujibu, hajibu, hatujibu, hamjibu, hawajibu',
    negPast: 'sikujibu, hukujibu, hakujibu, hatukujibu, hamkujibu, hawakujibu',
    negFut: 'sitajibu, hutajibu, hatajibu, hatutajibu, hamtajibu, hawatajibu',
    negPerf: 'sijajibu, hujajibu, hajajibu, hatujajibu, hamjajibu, hawajajibu',
    gerund: 'kujibu', participle: 'jibu',
  },
  kusahau: {
    pres: 'ninasahau, unasahau, anasahau, tunasahau, mnasahau, wanasahau',
    past: 'nilisahau, ulisahau, alisahau, tulisahau, mlisahau, walisahau',
    fut: 'nitasahau, utasahau, atasahau, tutasahau, mtasahau, watasahau',
    subj: 'nisahau, usahau, asahau, tusahau, msahau, wasahau',
    imp: '—, sahau, —, —, sahauni, —',
    negPres: 'sisahau, husahau, hasahau, hatusahau, hamsahau, hawasahau',
    negPast: 'sikusahau, hukusahau, hakusahau, hatukusahau, hamkusahau, hawakusahau',
  },
  kuhesabu: {
    pres: 'ninahesabu, unahesabu, anahesabu, tunahesabu, mnahesabu, wanahesabu',
    subj: 'nihesabu, uhesabu, ahesabu, tuhesabu, mhesabu, wahesabu',
    negPres: 'sihesabu, huhesabu, hahesabu, hatuhesabu, hamhesabu, hawahesabu',
    imp: '—, hesabu, —, —, hesabuni, —',
  },
  kufikiri: {
    pres: 'ninafikiri, unafikiri, anafikiri, tunafikiri, mnafikiri, wanafikiri',
    subj: 'nifikiri, ufikiri, afikiri, tufikiri, mfikiri, wafikiri',
    negPres: 'sifikiri, hufikiri, hafikiri, hatufikiri, hamfikiri, hawafikiri',
  },
  kuruhusu: {
    pres: 'ninaruhusu, unaruhusu, anaruhusu, tunaruhusu, mnaruhusu, wanaruhusu',
    subj: 'niruhusu, uruhusu, aruhusu, turuhusu, mruhusu, waruhusu',
    negPres: 'siruhusu, huruhusu, haruhusu, haturuhusu, hamruhusu, hawaruhusu',
  },
  kusamehe: {
    pres: 'ninasamehe, unasamehe, anasamehe, tunasamehe, mnasamehe, wanasamehe',
    subj: 'nisamehe, usamehe, asamehe, tusamehe, msamehe, wasamehe',
    negPres: 'sisamehe, husamehe, hasamehe, hatusamehe, hamsamehe, hawasamehe',
    imp: '—, samehe, —, —, sameheni, —',
  },
  kukubali: {
    pres: 'ninakubali, unakubali, anakubali, tunakubali, mnakubali, wanakubali',
    past: 'nilikubali, ulikubali, alikubali, tulikubali, mlikubali, walikubali',
    subj: 'nikubali, ukubali, akubali, tukubali, mkubali, wakubali',
    negPres: 'sikubali, hukubali, hakubali, hatukubali, hamkubali, hawakubali',
  },
  kuamini: {
    pres: 'ninaamini, unaamini, anaamini, tunaamini, mnaamini, wanaamini',
    subj: 'niamini, uamini, aamini, tuamini, mwamini, waamini',
  },
  kuhitaji: {
    pres: 'ninahitaji, unahitaji, anahitaji, tunahitaji, mnahitaji, wanahitaji',
    negPres: 'sihitaji, huhitaji, hahitaji, hatuhitaji, hamhitaji, hawahitaji',
    subj: 'nihitaji, uhitaji, ahitaji, tuhitaji, mhitaji, wahitaji',
  },
  kuishi: {
    pres: 'ninaishi, unaishi, anaishi, tunaishi, mnaishi, wanaishi',
    past: 'niliishi, uliishi, aliishi, tuliishi, mliishi, waliishi',
    subj: 'niishi, uishi, aishi, tuishi, mwishi, waishi',
  },
  // ---- Everyday verbs: kuona, kusema, kujua, ... -------------------------------------------------------
  kuona: {
    pres: 'ninaona, unaona, anaona, tunaona, mnaona, wanaona',
    past: 'niliona, uliona, aliona, tuliona, mliona, waliona',
    perf: 'nimeona, umeona, ameona, tumeona, mmeona, wameona',
    fut: 'nitaona, utaona, ataona, tutaona, mtaona, wataona',
    hab: 'huona, huona, huona, huona, huona, huona',
    subj: 'nione, uone, aone, tuone, mwone, waone',
    imp: '—, ona, —, —, oneni, —',
    cond: 'nikiona, ukiona, akiona, tukiona, mkiona, wakiona',
    negPast: 'sikuona, hukuona, hakuona, hatukuona, hamkuona, hawakuona',
    negFut: 'sitaona, hutaona, hataona, hatutaona, hamtaona, hawataona',
    gerund: 'kuona', participle: 'ona',
  },
  kusema: {
    pres: 'ninasema, unasema, anasema, tunasema, mnasema, wanasema',
    past: 'nilisema, ulisema, alisema, tulisema, mlisema, walisema',
    perf: 'nimesema, umesema, amesema, tumesema, mmesema, wamesema',
    fut: 'nitasema, utasema, atasema, tutasema, mtasema, watasema',
    subj: 'niseme, useme, aseme, tuseme, mseme, waseme',
    imp: '—, sema, —, —, semeni, —',
    negPres: 'sisemi, husemi, hasemi, hatusemi, hamsemi, hawasemi',
    negPast: 'sikusema, hukusema, hakusema, hatukusema, hamkusema, hawakusema',
  },
  kujua: {
    pres: 'ninajua, unajua, anajua, tunajua, mnajua, wanajua',
    past: 'nilijua, ulijua, alijua, tulijua, mlijua, walijua',
    perf: 'nimejua, umejua, amejua, tumejua, mmejua, wamejua',
    fut: 'nitajua, utajua, atajua, tutajua, mtajua, watajua',
    hab: 'hujua, hujua, hujua, hujua, hujua, hujua',
    subj: 'nijue, ujue, ajue, tujue, mjue, wajue',
    imp: '—, jua, —, —, jueni, —',
    negPres: 'sijui, hujui, hajui, hatujui, hamjui, hawajui',
    negPast: 'sikujua, hukujua, hakujua, hatukujua, hamkujua, hawakujua',
    negFut: 'sitajua, hutajua, hatajua, hatutajua, hamtajua, hawatajua',
  },
  kuamka: {
    pres: 'ninaamka, unaamka, anaamka, tunaamka, mnaamka, wanaamka',
    past: 'niliamka, uliamka, aliamka, tuliamka, mliamka, waliamka',
    perf: 'nimeamka, umeamka, ameamka, tumeamka, mmeamka, wameamka',
    fut: 'nitaamka, utaamka, ataamka, tutaamka, mtaamka, wataamka',
    subj: 'niamke, uamke, aamke, tuamke, mwamke, waamke',
    imp: '—, amka, —, —, amkeni, —',
    negPast: 'sikuamka, hukuamka, hakuamka, hatukuamka, hamkuamka, hawakuamka',
  },
  kuingia: {
    pres: 'ninaingia, unaingia, anaingia, tunaingia, mnaingia, wanaingia',
    past: 'niliingia, uliingia, aliingia, tuliingia, mliingia, waliingia',
    perf: 'nimeingia, umeingia, ameingia, tumeingia, mmeingia, wameingia',
    fut: 'nitaingia, utaingia, ataingia, tutaingia, mtaingia, wataingia',
    subj: 'niingie, uingie, aingie, tuingie, mwingie, waingie',
    imp: '—, ingia, —, —, ingieni, —',
    negPast: 'sikuingia, hukuingia, hakuingia, hatukuingia, hamkuingia, hawakuingia',
  },
  kuosha: {
    pres: 'ninaosha, unaosha, anaosha, tunaosha, mnaosha, wanaosha',
    past: 'niliosha, uliosha, aliosha, tuliosha, mliosha, waliosha',
    subj: 'nioshe, uoshe, aoshe, tuoshe, mwoshe, waoshe',
    imp: '—, osha, —, —, osheni, —',
  },
  kupika: {
    pres: 'ninapika, unapika, anapika, tunapika, mnapika, wanapika',
    past: 'nilipika, ulipika, alipika, tulipika, mlipika, walipika',
    fut: 'nitapika, utapika, atapika, tutapika, mtapika, watapika',
    subj: 'nipike, upike, apike, tupike, mpike, wapike',
    imp: '—, pika, —, —, pikeni, —',
    negPres: 'sipiki, hupiki, hapiki, hatupiki, hampiki, hawapiki',
  },
  kupikia: {
    pres: 'ninapikia, unapikia, anapikia, tunapikia, mnapikia, wanapikia',
    subj: 'nipikie, upikie, apikie, tupikie, mpikie, wapikie',
    imp: '—, pikia, —, —, pikieni, —',
    negPres: 'sipikii, hupikii, hapikii, hatupikii, hampikii, hawapikii',
  },
  kupenda: {
    pres: 'ninapenda, unapenda, anapenda, tunapenda, mnapenda, wanapenda',
    past: 'nilipenda, ulipenda, alipenda, tulipenda, mlipenda, walipenda',
    perf: 'nimependa, umependa, amependa, tumependa, mmependa, wamependa',
    subj: 'nipende, upende, apende, tupende, mpende, wapende',
    imp: '—, penda, —, —, pendeni, —',
    negPres: 'sipendi, hupendi, hapendi, hatupendi, hampendi, hawapendi',
    negPast: 'sikupenda, hukupenda, hakupenda, hatukupenda, hamkupenda, hawakupenda',
  },
  kusaidia: {
    pres: 'ninasaidia, unasaidia, anasaidia, tunasaidia, mnasaidia, wanasaidia',
    past: 'nilisaidia, ulisaidia, alisaidia, tulisaidia, mlisaidia, walisaidia',
    subj: 'nisaidie, usaidie, asaidie, tusaidie, msaidie, wasaidie',
    imp: '—, saidia, —, —, saidieni, —',
    negPres: 'sisaidii, husaidii, hasaidii, hatusaidii, hamsaidii, hawasaidii',
  },
  kulala: {
    pres: 'ninalala, unalala, analala, tunalala, mnalala, wanalala',
    past: 'nililala, ulilala, alilala, tulilala, mlilala, walilala',
    fut: 'nitalala, utalala, atalala, tutalala, mtalala, watalala',
    subj: 'nilale, ulale, alale, tulale, mlale, walale',
    imp: '—, lala, —, —, laleni, —',
    negPres: 'silali, hulali, halali, hatulali, hamlali, hawalali',
  },
  kucheka: {
    pres: 'ninacheka, unacheka, anacheka, tunacheka, mnacheka, wanacheka',
    past: 'nilicheka, ulicheka, alicheka, tulicheka, mlicheka, walicheka',
    subj: 'nicheke, ucheke, acheke, tucheke, mcheke, wacheke',
    imp: '—, cheka, —, —, chekeni, —',
    negPres: 'sicheki, hucheki, hacheki, hatucheki, hamcheki, hawacheki',
  },
  kutaka: {
    pres: 'ninataka, unataka, anataka, tunataka, mnataka, wanataka',
    past: 'nilitaka, ulitaka, alitaka, tulitaka, mlitaka, walitaka',
    subj: 'nitake, utake, atake, tutake, mtake, watake',
    imp: '—, taka, —, —, takeni, —',
    negPres: 'sitaki, hutaki, hataki, hatutaki, hamtaki, hawataki',
    negPast: 'sikutaka, hukutaka, hakutaka, hatukutaka, hamkutaka, hawakutaka',
  },
  // ---- More regular verbs (partial paradigms) ---------------------------------------------------------
  kuleta: {
    pres: 'ninaleta, unaleta, analeta, tunaleta, mnaleta, wanaleta',
    subj: 'nilete, ulete, alete, tulete, mlete, walete',
    imp: '—, leta, —, —, leteni, —',
    negPres: 'sileti, huleti, haleti, hatuleti, hamleti, hawaleti',
  },
  kuweka: {
    pres: 'ninaweka, unaweka, anaweka, tunaweka, mnaweka, wanaweka',
    subj: 'niweke, uweke, aweke, tuweke, mweke, waweke',
    imp: '—, weka, —, —, wekeni, —',
    negPres: 'siweki, huweki, haweki, hatuweki, hamweki, hawaweki',
  },
  kuweza: {
    pres: 'ninaweza, unaweza, anaweza, tunaweza, mnaweza, wanaweza',
    subj: 'niweze, uweze, aweze, tuweze, mweze, waweze',
    negPres: 'siwezi, huwezi, hawezi, hatuwezi, hamwezi, hawawezi',
  },
  kukaa: {
    pres: 'ninakaa, unakaa, anakaa, tunakaa, mnakaa, wanakaa',
    past: 'nilikaa, ulikaa, alikaa, tulikaa, mlikaa, walikaa',
    subj: 'nikae, ukae, akae, tukae, mkae, wakae',
    imp: '—, kaa, —, —, kaeni, —',
    negPres: 'sikai, hukai, hakai, hatukai, hamkai, hawakai',
  },
  kulia: {
    pres: 'ninalia, unalia, analia, tunalia, mnalia, wanalia',
    subj: 'nilie, ulie, alie, tulie, mlie, walie',
    imp: '—, lia, —, —, lieni, —',
    negPres: 'silii, hulii, halii, hatulii, hamlii, hawalii',
  },
  kusikia: {
    pres: 'ninasikia, unasikia, anasikia, tunasikia, mnasikia, wanasikia',
    subj: 'nisikie, usikie, asikie, tusikie, msikie, wasikie',
    negPres: 'sisikii, husikii, hasikii, hatusikii, hamsikii, hawasikii',
  },
  kutembea: {
    pres: 'ninatembea, unatembea, anatembea, tunatembea, mnatembea, wanatembea',
    subj: 'nitembee, utembee, atembee, tutembee, mtembee, watembee',
    imp: '—, tembea, —, —, tembeeni, —',
    negPres: 'sitembei, hutembei, hatembei, hatutembei, hamtembei, hawatembei',
  },
  kuchukua: {
    pres: 'ninachukua, unachukua, anachukua, tunachukua, mnachukua, wanachukua',
    subj: 'nichukue, uchukue, achukue, tuchukue, mchukue, wachukue',
    imp: '—, chukua, —, —, chukueni, —',
    negPres: 'sichukui, huchukui, hachukui, hatuchukui, hamchukui, hawachukui',
  },
  kufanya: {
    pres: 'ninafanya, unafanya, anafanya, tunafanya, mnafanya, wanafanya',
    past: 'nilifanya, ulifanya, alifanya, tulifanya, mlifanya, walifanya',
    subj: 'nifanye, ufanye, afanye, tufanye, mfanye, wafanye',
    imp: '—, fanya, —, —, fanyeni, —',
    negPres: 'sifanyi, hufanyi, hafanyi, hatufanyi, hamfanyi, hawafanyi',
  },
  kutumia: {
    pres: 'ninatumia, unatumia, anatumia, tunatumia, mnatumia, wanatumia',
    subj: 'nitumie, utumie, atumie, tutumie, mtumie, watumie',
    negPres: 'situmii, hutumii, hatumii, hatutumii, hamtumii, hawatumii',
  },
  kuanza: {
    pres: 'ninaanza, unaanza, anaanza, tunaanza, mnaanza, wanaanza',
    past: 'nilianza, ulianza, alianza, tulianza, mlianza, walianza',
    subj: 'nianze, uanze, aanze, tuanze, mwanze, waanze',
    imp: '—, anza, —, —, anzeni, —',
  },
  kuomba: {
    pres: 'ninaomba, unaomba, anaomba, tunaomba, mnaomba, wanaomba',
    subj: 'niombe, uombe, aombe, tuombe, mwombe, waombe',
    imp: '—, omba, —, —, ombeni, —',
  },
  kuita: {
    pres: 'ninaita, unaita, anaita, tunaita, mnaita, wanaita',
    past: 'niliita, uliita, aliita, tuliita, mliita, waliita',
    subj: 'niite, uite, aite, tuite, mwite, waite',
    imp: '—, ita, —, —, iteni, —',
  },
  kuoga: {
    pres: 'ninaoga, unaoga, anaoga, tunaoga, mnaoga, wanaoga',
    subj: 'nioge, uoge, aoge, tuoge, mwoge, waoge',
    imp: '—, oga, —, —, ogeni, —',
  },
  kuamua: {
    pres: 'ninaamua, unaamua, anaamua, tunaamua, mnaamua, wanaamua',
    past: 'niliamua, uliamua, aliamua, tuliamua, mliamua, waliamua',
    subj: 'niamue, uamue, aamue, tuamue, mwamue, waamue',
    imp: '—, amua, —, —, amueni, —',
  },
  kuelewa: {
    pres: 'ninaelewa, unaelewa, anaelewa, tunaelewa, mnaelewa, wanaelewa',
    past: 'nilielewa, ulielewa, alielewa, tulielewa, mlielewa, walielewa',
    subj: 'nielewe, uelewe, aelewe, tuelewe, mwelewe, waelewe',
  },
  // ---- ng' and ny ----------------------------------------------------------------------------------------
  "kung'ara": {
    pres: "ninang'ara, unang'ara, anang'ara, tunang'ara, mnang'ara, wanang'ara",
    past: "niling'ara, uling'ara, aling'ara, tuling'ara, mling'ara, waling'ara",
    subj: "ning'are, ung'are, ang'are, tung'are, mng'are, wang'are",
    imp: "—, ng'ara, —, —, ng'areni, —",
    negPres: "sing'ari, hung'ari, hang'ari, hatung'ari, hamng'ari, hawang'ari",
    gerund: "kung'ara", participle: "ng'ara",
  },
  "kung'oa": {
    pres: "ninang'oa, unang'oa, anang'oa, tunang'oa, mnang'oa, wanang'oa",
    subj: "ning'oe, ung'oe, ang'oe, tung'oe, mng'oe, wang'oe",
    negPres: "sing'oi, hung'oi, hang'oi, hatung'oi, hamng'oi, hawang'oi",
  },
  kunyoa: {
    pres: 'ninanyoa, unanyoa, ananyoa, tunanyoa, mnanyoa, wananyoa',
    subj: 'ninyoe, unyoe, anyoe, tunyoe, mnyoe, wanyoe',
    negPres: 'sinyoi, hunyoi, hanyoi, hatunyoi, hamnyoi, hawanyoi',
  },
  kunyonya: {
    pres: 'ninanyonya, unanyonya, ananyonya, tunanyonya, mnanyonya, wananyonya',
    subj: 'ninyonye, unyonye, anyonye, tunyonye, mnyonye, wanyonye',
    negPres: 'sinyonyi, hunyonyi, hanyonyi, hatunyonyi, hamnyonyi, hawanyonyi',
  },
  kunywesha: {
    pres: 'ninanywesha, unanywesha, ananywesha, tunanywesha, mnanywesha, wananywesha',
    subj: 'ninyweshe, unyweshe, anyweshe, tunyweshe, mnyweshe, wanyweshe',
  },

  // ---- Derived verbs: the whole infinitive is the stem -----------------------------------------------
  kuandikia: {
    pres: 'ninaandikia, unaandikia, anaandikia, tunaandikia, mnaandikia, wanaandikia',
    subj: 'niandikie, uandikie, aandikie, tuandikie, mwandikie, waandikie',
    imp: '—, andikia, —, —, andikieni, —',
  },
  kuandikisha: {
    subj: 'niandikishe, uandikishe, aandikishe, tuandikishe, mwandikishe, waandikishe',
    imp: '—, andikisha, —, —, andikisheni, —',
    pres: 'ninaandikisha, unaandikisha, anaandikisha, tunaandikisha, mnaandikisha, wanaandikisha',
  },
  kupendwa: {
    pres: 'ninapendwa, unapendwa, anapendwa, tunapendwa, mnapendwa, wanapendwa',
    subj: 'nipendwe, upendwe, apendwe, tupendwe, mpendwe, wapendwe',
    negPres: 'sipendwi, hupendwi, hapendwi, hatupendwi, hampendwi, hawapendwi',
    imp: '—, pendwa, —, —, pendweni, —',
  },
  kupendeka: {
    pres: 'ninapendeka, unapendeka, anapendeka, tunapendeka, mnapendeka, wanapendeka',
    subj: 'nipendeke, upendeke, apendeke, tupendeke, mpendeke, wapendeke',
    negPres: 'sipendeki, hupendeki, hapendeki, hatupendeki, hampendeki, hawapendeki',
  },
  kupendana: {
    pres: 'ninapendana, unapendana, anapendana, tunapendana, mnapendana, wanapendana',
    subj: 'nipendane, upendane, apendane, tupendane, mpendane, wapendane',
    negPres: 'sipendani, hupendani, hapendani, hatupendani, hampendani, hawapendani',
    imp: '—, pendana, —, —, pendaneni, —',
  },
  kufungua: {
    pres: 'ninafungua, unafungua, anafungua, tunafungua, mnafungua, wanafungua',
    subj: 'nifungue, ufungue, afungue, tufungue, mfungue, wafungue',
    imp: '—, fungua, —, —, fungueni, —',
    negPres: 'sifungui, hufungui, hafungui, hatufungui, hamfungui, hawafungui',
  },
  kufunga: {
    pres: 'ninafunga, unafunga, anafunga, tunafunga, mnafunga, wanafunga',
    subj: 'nifunge, ufunge, afunge, tufunge, mfunge, wafunge',
    negPres: 'sifungi, hufungi, hafungi, hatufungi, hamfungi, hawafungi',
  },
  kuingiza: {
    pres: 'ninaingiza, unaingiza, anaingiza, tunaingiza, mnaingiza, wanaingiza',
    subj: 'niingize, uingize, aingize, tuingize, mwingize, waingize',
  },

  // ---- Roots that begin with ku-, and verbs that only look monosyllabic ---------------------------------
  kukua: {
    pres: 'ninakua, unakua, anakua, tunakua, mnakua, wanakua',
    past: 'nilikua, ulikua, alikua, tulikua, mlikua, walikua',
    subj: 'nikue, ukue, akue, tukue, mkue, wakue',
    negPres: 'sikui, hukui, hakui, hatukui, hamkui, hawakui',
  },
  kukuza: {
    pres: 'ninakuza, unakuza, anakuza, tunakuza, mnakuza, wanakuza',
    subj: 'nikuze, ukuze, akuze, tukuze, mkuze, wakuze',
    negPres: 'sikuzi, hukuzi, hakuzi, hatukuzi, hamkuzi, hawakuzi',
  },
  kukutana: {
    pres: 'ninakutana, unakutana, anakutana, tunakutana, mnakutana, wanakutana',
    past: 'nilikutana, ulikutana, alikutana, tulikutana, mlikutana, walikutana',
    subj: 'nikutane, ukutane, akutane, tukutane, mkutane, wakutane',
    negPres: 'sikutani, hukutani, hakutani, hatukutani, hamkutani, hawakutani',
  },
  kupaa: {
    pres: 'ninapaa, unapaa, anapaa, tunapaa, mnapaa, wanapaa',
    past: 'nilipaa, ulipaa, alipaa, tulipaa, mlipaa, walipaa',
    subj: 'nipae, upae, apae, tupae, mpae, wapae',
    imp: '—, paa, —, —, paeni, —',
    negPres: 'sipai, hupai, hapai, hatupai, hampai, hawapai',
  },
  kujaa: {
    pres: 'ninajaa, unajaa, anajaa, tunajaa, mnajaa, wanajaa',
    subj: 'nijae, ujae, ajae, tujae, mjae, wajae',
    imp: '—, jaa, —, —, jaeni, —',
    negPres: 'sijai, hujai, hajai, hatujai, hamjai, hawajai',
  },
  kuzaa: {
    pres: 'ninazaa, unazaa, anazaa, tunazaa, mnazaa, wanazaa',
    subj: 'nizae, uzae, azae, tuzae, mzae, wazae',
    negPres: 'sizai, huzai, hazai, hatuzai, hamzai, hawazai',
  },
  kujaribu: {
    pres: 'ninajaribu, unajaribu, anajaribu, tunajaribu, mnajaribu, wanajaribu',
    subj: 'nijaribu, ujaribu, ajaribu, tujaribu, mjaribu, wajaribu',
    negPres: 'sijaribu, hujaribu, hajaribu, hatujaribu, hamjaribu, hawajaribu',
  },
  kujenga: {
    pres: 'ninajenga, unajenga, anajenga, tunajenga, mnajenga, wanajenga',
    subj: 'nijenge, ujenge, ajenge, tujenge, mjenge, wajenge',
    negPres: 'sijengi, hujengi, hajengi, hatujengi, hamjengi, hawajengi',
  },
  kujibia: {
    pres: 'ninajibia, unajibia, anajibia, tunajibia, mnajibia, wanajibia',
    subj: 'nijibie, ujibie, ajibie, tujibie, mjibie, wajibie',
    negPres: 'sijibii, hujibii, hajibii, hatujibii, hamjibii, hawajibii',
  },
  // ---- Variant spellings and "kuX na" ----------------------------------------------------------------------
  kwisha: {
    pres: 'ninaisha, unaisha, anaisha, tunaisha, mnaisha, wanaisha',
    perf: 'nimeisha, umeisha, ameisha, tumeisha, mmeisha, wameisha',
    subj: 'niishe, uishe, aishe, tuishe, mwishe, waishe',
    imp: '—, isha, —, —, isheni, —',
    gerund: 'kwisha', participle: 'isha',
  },
  kuisha: {
    pres: 'ninaisha, unaisha, anaisha, tunaisha, mnaisha, wanaisha',
    gerund: 'kuisha', participle: 'isha',
  },
  kuenda: {
    pres: 'ninaenda, unaenda, anaenda, tunaenda, mnaenda, wanaenda',
    imp: '—, nenda, —, —, nendeni, —',
  },
  'kuja na': {
    pres: 'ninakuja na, unakuja na, anakuja na, tunakuja na, mnakuja na, wanakuja na',
    past: 'nilikuja na, ulikuja na, alikuja na, tulikuja na, mlikuja na, walikuja na',
    imp: '—, njoo na, —, —, njooni na, —',
    negPres: 'siji na, huji na, haji na, hatuji na, hamji na, hawaji na',
    gerund: 'kuja na', participle: 'ja na',
  },
  'kwenda na': {
    pres: 'ninaenda na, unaenda na, anaenda na, tunaenda na, mnaenda na, wanaenda na',
    imp: '—, nenda na, —, —, nendeni na, —',
  },
  'kuleta na': {
    // any verb + na: nothing special happens to the verb itself
    subj: 'nilete na, ulete na, alete na, tulete na, mlete na, walete na',
  },

  // ---- Roots that begin with u-, o-, i- (see PARTIAL for the 2nd person plural of u- roots) ----------------
  kuuza: {
    pres: 'ninauza, unauza, anauza, tunauza, mnauza, wanauza',
    past: 'niliuza, uliuza, aliuza, tuliuza, mliuza, waliuza',
    imp: '—, uza, —, —, uzeni, —',
  },
  kuuliza: {
    pres: 'ninauliza, unauliza, anauliza, tunauliza, mnauliza, wanauliza',
    imp: '—, uliza, —, —, ulizeni, —',
  },
  kuota: {
    pres: 'ninaota, unaota, anaota, tunaota, mnaota, wanaota',
    subj: 'niote, uote, aote, tuote, mwote, waote',
    imp: '—, ota, —, —, oteni, —',
  },
  kuoa: {
    pres: 'ninaoa, unaoa, anaoa, tunaoa, mnaoa, wanaoa',
    subj: 'nioe, uoe, aoe, tuoe, mwoe, waoe',
  },
  kuiba: {
    pres: 'ninaiba, unaiba, anaiba, tunaiba, mnaiba, wanaiba',
    subj: 'niibe, uibe, aibe, tuibe, mwibe, waibe',
    imp: '—, iba, —, —, ibeni, —',
  },
  kuuma: {
    pres: 'ninauma, unauma, anauma, tunauma, mnauma, wanauma',
    imp: '—, uma, —, —, umeni, —',
  },

  // ---- More everyday verbs -------------------------------------------------------------------------------------
  kupiga: {
    pres: 'ninapiga, unapiga, anapiga, tunapiga, mnapiga, wanapiga',
    subj: 'nipige, upige, apige, tupige, mpige, wapige',
    negPres: 'sipigi, hupigi, hapigi, hatupigi, hampigi, hawapigi',
  },
  kukata: {
    pres: 'ninakata, unakata, anakata, tunakata, mnakata, wanakata',
    subj: 'nikate, ukate, akate, tukate, mkate, wakate',
    negPres: 'sikati, hukati, hakati, hatukati, hamkati, hawakati',
  },
  kufika: {
    pres: 'ninafika, unafika, anafika, tunafika, mnafika, wanafika',
    past: 'nilifika, ulifika, alifika, tulifika, mlifika, walifika',
    subj: 'nifike, ufike, afike, tufike, mfike, wafike',
    negPres: 'sifiki, hufiki, hafiki, hatufiki, hamfiki, hawafiki',
  },
  kuondoka: {
    pres: 'ninaondoka, unaondoka, anaondoka, tunaondoka, mnaondoka, wanaondoka',
    subj: 'niondoke, uondoke, aondoke, tuondoke, mwondoke, waondoke',
    imp: '—, ondoka, —, —, ondokeni, —',
  },
  kuchagua: {
    pres: 'ninachagua, unachagua, anachagua, tunachagua, mnachagua, wanachagua',
    subj: 'nichague, uchague, achague, tuchague, mchague, wachague',
    negPres: 'sichagui, huchagui, hachagui, hatuchagui, hamchagui, hawachagui',
  },
  kufundisha: {
    pres: 'ninafundisha, unafundisha, anafundisha, tunafundisha, mnafundisha, wanafundisha',
    subj: 'nifundishe, ufundishe, afundishe, tufundishe, mfundishe, wafundishe',
    negPres: 'sifundishi, hufundishi, hafundishi, hatufundishi, hamfundishi, hawafundishi',
  },
  kusimama: {
    pres: 'ninasimama, unasimama, anasimama, tunasimama, mnasimama, wanasimama',
    subj: 'nisimame, usimame, asimame, tusimame, msimame, wasimame',
    imp: '—, simama, —, —, simameni, —',
  },
  kupokea: {
    pres: 'ninapokea, unapokea, anapokea, tunapokea, mnapokea, wanapokea',
    subj: 'nipokee, upokee, apokee, tupokee, mpokee, wapokee',
    negPres: 'sipokei, hupokei, hapokei, hatupokei, hampokei, hawapokei',
  },
  kukimbia: {
    pres: 'ninakimbia, unakimbia, anakimbia, tunakimbia, mnakimbia, wanakimbia',
    subj: 'nikimbie, ukimbie, akimbie, tukimbie, mkimbie, wakimbie',
  },
  kuchoma: {
    pres: 'ninachoma, unachoma, anachoma, tunachoma, mnachoma, wanachoma',
    subj: 'nichome, uchome, achome, tuchome, mchome, wachome',
    negPres: 'sichomi, huchomi, hachomi, hatuchomi, hamchomi, hawachomi',
  },
  // kw- is part of the root here
  kukwama: {
    pres: 'ninakwama, unakwama, anakwama, tunakwama, mnakwama, wanakwama',
    perf: 'nimekwama, umekwama, amekwama, tumekwama, mmekwama, wamekwama',
    subj: 'nikwame, ukwame, akwame, tukwame, mkwame, wakwame',
    negPres: 'sikwami, hukwami, hakwami, hatukwami, hamkwami, hawakwami',
  },
  kukwepa: {
    pres: 'ninakwepa, unakwepa, anakwepa, tunakwepa, mnakwepa, wanakwepa',
    subj: 'nikwepe, ukwepe, akwepe, tukwepe, mkwepe, wakwepe',
  },
  //@@MORE@@
};

// Inputs that are not conjugable infinitives must give null.
const NOT_VERBS = ['', '   ', 'hello', 'kujipenda', 'xyz', '123', 'constructor', 'soma', 'toString', '__proto__',
  'ku', 'kua', 'kwa', 'kusom', 'kuwepo', 'kujitahidi', 'kuq', 'ku soma', 'kusoma na na',
  'Kujipenda', 'kuku', 'kuti', 'kwenda-', 'kwsoma', 'kusoma!', "ku'soma", 'kwama', 'kwea', 'kwepa', 'kwandika', 'kuw na', ' na', 'na', 'kuwa  na na',
  // locative -po / -ko verbs end in -o: not supported, and not used in verbs.js (exist, be present)
  'kuwapo', 'kuwako', 'kuweko', 'kuwepo na'];

const FORM_KEYS = [
  'pres', 'past', 'perf', 'fut', 'hab', 'pastProg', 'futProg', 'subj', 'imp',
  'cond', 'hyp', 'hypPast', 'negPres', 'negPast', 'negFut', 'negPerf',
];

// Single persons only: 'verb.tense' -> [mimi, wewe, yeye, sisi, ninyi, wao], null = not asserted.
// Used where one person of a paradigm is not certain (the 2nd person plural of the negative
// present before a vowel, hamwoni or hamuoni) so that the other five are still checked.
const PARTIAL = {
  'kuandika.negPres': ['siandiki', 'huandiki', 'haandiki', 'hatuandiki', null, 'hawaandiki'],
  'kwenda.negPres': ['siendi', 'huendi', 'haendi', 'hatuendi', null, 'hawaendi'],
  'kuamini.negPres': ['siamini', 'huamini', 'haamini', 'hatuamini', null, 'hawaamini'],
  'kuishi.negPres': ['siishi', 'huishi', 'haishi', 'hatuishi', null, 'hawaishi'],
  'kuona.negPres': ['sioni', 'huoni', 'haoni', 'hatuoni', null, 'hawaoni'],
  'kuamka.negPres': ['siamki', 'huamki', 'haamki', 'hatuamki', null, 'hawaamki'],
  'kuingia.negPres': ['siingii', 'huingii', 'haingii', 'hatuingii', null, 'hawaingii'],
  'kuosha.negPres': ['sioshi', 'huoshi', 'haoshi', 'hatuoshi', null, 'hawaoshi'],
  'kuandikia.negPres': ['siandikii', 'huandikii', 'haandikii', 'hatuandikii', null, 'hawaandikii'],
  'kuingiza.negPres': ['siingizi', 'huingizi', 'haingizi', 'hatuingizi', null, 'hawaingizi'],
  'kuoa.negPres': ['sioi', 'huoi', 'haoi', 'hatuoi', null, 'hawaoi'],
  // 2nd person plural before u- is not asserted (muuze or mwuze)
  'kuuza.subj': ['niuze', 'uuze', 'auze', 'tuuze', null, 'wauze'],
  'kuuza.negPres': ['siuzi', 'huuzi', 'hauzi', 'hatuuzi', null, 'hawauzi'],
  'kuuliza.subj': ['niulize', 'uulize', 'aulize', 'tuulize', null, 'waulize'],
  //@@PARTIAL@@
};

const report = createReport();
checkParadigms(report, EXPECTED, conjugate);

for (const [path, want] of Object.entries(PARTIAL)) {
  const [verb, tense] = path.split('.');
  const result = conjugate(verb);
  if (!result) { report.fail(`${verb}: conjugate() returned null`); continue; }
  want.forEach((form, i) => {
    if (form === null) return;
    report.checks += 1;
    if (result.forms[tense][i] !== form) report.fail(`${path}[${i}]\n    expected: ${form}\n    actual:   ${result.forms[tense][i]}`);
  });
}

// ---- Null cases ----------------------------------------------------------------------
for (const input of NOT_VERBS) {
  report.checks += 1;
  if (conjugate(input) !== null) report.fail(`conjugate(${JSON.stringify(input)}) should be null`);
}
for (const input of [undefined, null, 42, {}, []]) {
  report.checks += 1;
  if (conjugate(input) !== null) report.fail(`conjugate(${JSON.stringify(input)}) should be null`);
}

// ---- Shape: the 16 keys in order, six non-empty strings each ------------------------------
for (const verb of Object.keys(EXPECTED)) {
  const result = conjugate(verb);
  if (!result) continue; // already reported by checkParadigms
  report.checks += 1;
  if (JSON.stringify(Object.keys(result.forms)) !== JSON.stringify(FORM_KEYS)) {
    report.fail(`${verb}: wrong form keys ${Object.keys(result.forms).join(',')}`);
  }
  for (const key of FORM_KEYS) {
    const forms = result.forms[key];
    if (!Array.isArray(forms) || forms.length !== 6 || forms.some(f => typeof f !== 'string' || !f)) {
      report.fail(`${verb}.${key}: not six non-empty strings: ${JSON.stringify(forms)}`);
    }
  }
  report.checks += 1;
  if (result.inf !== verb || result.gerund !== verb) report.fail(`${verb}: inf/gerund should repeat the infinitive`);
  // the imperative exists only for the 2nd person
  report.checks += 1;
  const imp = result.forms.imp;
  if (imp[0] !== NONE || imp[2] !== NONE || imp[3] !== NONE || imp[5] !== NONE || imp[1] === NONE || imp[4] === NONE) {
    report.fail(`${verb}.imp: only wewe and ninyi should exist: ${JSON.stringify(imp)}`);
  }
}

// Results are independent: changing one must not change the next call (kuwa shares tables).
for (const verb of ['kuwa', 'kuwa na', 'kusoma', 'kula']) {
  report.checks += 1;
  const first = conjugate(verb);
  for (const key of FORM_KEYS) first.forms[key][0] = 'CHANGED';
  if (JSON.stringify(conjugate(verb)).includes('CHANGED')) report.fail(`${verb}: results share arrays between calls`);
}

// A typographic apostrophe is read as the plain one.
report.checks += 1;
if (!conjugate('kung\u2019ara') || conjugate('kung\u2019ara').inf !== "kung'ara") report.fail('curly apostrophe in kung\u2019ara should be normalised');

// ---- Input handling: case and spaces are ignored --------------------------------------------
for (const [messy, clean] of [['  KUSOMA ', 'kusoma'], ['Kula', 'kula'], ['\tKwenda\n', 'kwenda'], ['Kuwa   NA ', 'kuwa na']]) {
  report.checks += 1;
  const messyResult = conjugate(messy);
  const cleanResult = conjugate(clean);
  if (!messyResult || JSON.stringify(messyResult) !== JSON.stringify(cleanResult)) {
    report.fail(`${JSON.stringify(messy)} should give the same result as ${clean}`);
  }
}

// Every verb in the database must conjugate into well-formed output.
const swahiliCount = checkInflectedDatabase(report, {
  verbs: VERBS,
  conjugate,
  lang: 'sw',
  formKeys: FORM_KEYS,
  // the infinitive: ku- or kw-, optionally followed by " na"
  gerund: /^k[uw][a-z']+( na)?$/,
  // the stem with its final vowel (imperative singular of a regular verb)
  participle: /^[a-z']+( na)?$/,
});

// ---- Database audits (class guards) ------------------------------------------------------------
// These came out of reading every infinitive in verbs.js by class (monosyllabic roots, vowel-initial
// roots, verbs in -i/-u/-e, derived verbs). They fail when a new verb enters a class unreviewed.
const dbInfinitives = [...new Set(Object.values(VERBS).flatMap(entries => entries.map(entry => entry.sw)))].sort();
// (an infinitive the engine rejects is reported by the shared check above; the guards skip it)
const inEngine = dbInfinitives.filter(inf => conjugate(inf) !== null);

// A. Monosyllabic roots (kula, kunywa, ...): exactly these occur, and each keeps ku- after the
// markers -na- -li- -me- -ta- -nge- -ngali- and drops it elsewhere.
const REVIEWED_MONOSYLLABIC = ['kufa', 'kuja', 'kula', 'kunywa', 'kupa', 'kupwa'];
// (kuwa is the special verb, tested on its own)
const monosyllabicInDb = dbInfinitives.filter(inf => /^ku[^aeiou]+a$/.test(inf) && inf !== 'kuwa');
report.checks += 1;
if (monosyllabicInDb.join(' ') !== REVIEWED_MONOSYLLABIC.join(' ')) {
  report.fail(`monosyllabic verbs in verbs.js changed: ${monosyllabicInDb.join(' ')} (reviewed: ${REVIEWED_MONOSYLLABIC.join(' ')})`);
}
for (const inf of REVIEWED_MONOSYLLABIC) {
  const root = inf.slice(2);
  const f = conjugate(inf).forms;
  const stem = root.slice(0, -1);
  const checks = {
    pres: 'ninaku' + root, past: 'niliku' + root, perf: 'nimeku' + root, fut: 'nitaku' + root,
    hyp: 'ningeku' + root, hypPast: 'ningaliku' + root, negFut: 'sitaku' + root,
    hab: 'hu' + root, cond: 'niki' + root, negPerf: 'sija' + root, negPast: 'siku' + root,
    negPres: 'si' + stem + 'i', subj: 'ni' + stem + 'e',
  };
  for (const [key, want] of Object.entries(checks)) {
    report.checks += 1;
    if (f[key][0] !== want) report.fail(`${inf}.${key}[0]: expected ${want}, got ${f[key][0]}`);
  }
}

// B. Verbs whose root ends in -e, -i or -u (Arabic loans and a few others): the final vowel never
// changes, in the subjunctive, the negative present and the imperative. Any verb in verbs.js with
// such an ending must be on this reviewed list.
const REVIEWED_FINAL_E = 'kusamehe kustarehe';
const REVIEWED_FINAL_I = `kuabiri kuafiki kuahidi kuajiri kuakisi kuamini kuasili kuasisi kuathiri kubadili kubaini kubaki kubariki
  kubashiri kubeti kubuni kuchaji kuchati kudadisi kudai kudarizi kudhamini kudhani kudhibiti kudhihaki kuenzi kufadhili kufaidi
  kufariji kufariki kufasili kufasiri kufeli kufikiri kufilisi kufomati kufurahi kughairi kughani kughushi kuhakiki kuhariri kuhasi
  kuhifadhi kuhiji kuhimili kuhisi kuhitaji kuhoji kuhubiri kuishi kujadili kujali kujeruhi kukabidhi kukabili kukaidi kukarabati
  kukariri kukejeli kukiri kukodi kukubali kulaani kulaghai kumiliki kunakili kunawiri kurehini kurekodi kuripoti kurithi kurubuni
  kurudi kusafiri kusaili kusaini kusajili kusali kusaliti kusanidi kusawiri kushauri kushawishi kushiriki kushtaki kusihi kusitawi
  kustahili kustahimili kustawi kusubiri kuswali kutabiri kutafakari kutafiti kutafsiri kutalii kutaliki kutamani kutathmini
  kuthamini kutii kutumaini kuudhi kuvinjari kuwasili kuzidi`;
const REVIEWED_FINAL_U = `kuabudu kuadhibu kuamuru kuarifu kubusu kudharau kudhulumu kudhuru kudumu kufahamu kufaulu kufuzu
  kugharimu kuharibu kuhesabu kuheshimu kuhitimu kuhujumu kuhukumu kuhusudu kujaribu kujibu kukashifu kulaumu kumudu kunukuu
  kunusuru kuratibu kuruhusu kusahau kusalimu kushuku kushukuru kushutumu kusifu kustaajabu kusujudu kutabasamu kutarjumu
  kuthubutu kutibu kutuhumu kutunuku kuzuru`;
const reviewedVowelFinal = new Set([REVIEWED_FINAL_E, REVIEWED_FINAL_I, REVIEWED_FINAL_U].join(' ').split(/\s+/));
const vowelFinalInDb = dbInfinitives.filter(inf => !inf.endsWith('a') && inf !== 'kuwa na');
report.checks += 1;
const unreviewed = vowelFinalInDb.filter(inf => !reviewedVowelFinal.has(inf));
if (unreviewed.length) report.fail(`verbs in -e/-i/-u not yet reviewed: ${unreviewed.join(' ')}`);
report.checks += 1;
const gone = [...reviewedVowelFinal].filter(inf => !dbInfinitives.includes(inf));
if (gone.length) report.fail(`reviewed -e/-i/-u verbs no longer in verbs.js (update the lists): ${gone.join(' ')}`);
for (const inf of vowelFinalInDb.filter(inf => inEngine.includes(inf))) {
  const root = inf.slice(2);
  const f = conjugate(inf).forms;
  report.checks += 1;
  if (f.negPres[0] !== 'si' + root || f.negPres[2] !== 'ha' + root || f.negPres[3] !== 'hatu' + root) {
    report.fail(`${inf}.negPres keeps its final vowel: expected si${root}, got ${f.negPres.join(' ')}`);
  }
  report.checks += 1;
  if (f.subj[0] !== 'ni' + root || f.subj[3] !== 'tu' + root || f.imp[1] !== root || f.imp[4] !== root + 'ni') {
    report.fail(`${inf}: subjunctive and imperative keep the final vowel: ${f.subj[0]} ${f.imp[1]} ${f.imp[4]}`);
  }
}

// C. Every -a verb in the database: negative present -i, subjunctive -e, whatever the root
// (including -ia, -ua, -oa, -ea, -aa, -wa endings).
for (const inf of inEngine.filter(v => v.endsWith('a') && v !== 'kuwa' && !v.endsWith(' na'))) {
  const stem = inf.slice(2, -1);
  const f = conjugate(inf).forms;
  report.checks += 1;
  if (f.negPres[0] !== 'si' + stem + 'i' || f.negPres[5] !== 'hawa' + stem + 'i') {
    report.fail(`${inf}.negPres: expected si${stem}i, got ${f.negPres[0]} / ${f.negPres[5]}`);
  }
  report.checks += 1;
  if (f.subj[0] !== 'ni' + stem + 'e' || f.subj[5] !== 'wa' + stem + 'e') {
    report.fail(`${inf}.subj: expected ni${stem}e, got ${f.subj[0]} / ${f.subj[5]}`);
  }
}

// D. Vowel-initial roots (kuandika, kuingia, kuonja): the 2nd person plural subjunctive takes mw-;
// the other persons just add the marker. u-initial roots (muuze or mwuze) and the 2nd person
// plural of the negative present (hamwoni or hamuoni) are not asserted, see PARTIAL.
for (const inf of inEngine.filter(v => /^ku[aeio]/.test(v) && !v.endsWith(' na'))) {
  const root = inf.slice(2);
  const f = conjugate(inf).forms;
  report.checks += 1;
  if (!f.subj[4].startsWith('mw' + root[0]) || f.pres[4] !== 'mna' + root || f.pres[1] !== 'una' + root || !f.negPres[0].startsWith('si' + root[0])) {
    report.fail(`${inf}: forms of a vowel-initial root: ${f.pres[1]} ${f.pres[4]} ${f.subj[4]} ${f.negPres[0]}`);
  }
}

// E. Verbs the engine cannot conjugate must not be in the database (exist/be present used to be
// kuwepo, which gave "not an infinitive"). The shared check above would also catch it; this names it.
const UNSUPPORTED_BUT_REAL = ['kuwepo', 'kuwapo', 'kuwako', 'kuweko', 'kujipenda'];
for (const inf of UNSUPPORTED_BUT_REAL) {
  report.checks += 1;
  if (dbInfinitives.includes(inf)) report.fail(`${inf} must not be used in verbs.js (the engine returns null for it)`);
}

// F. Duplicates within an English verb's line, and the spelling of every infinitive.
for (const [english, entries] of Object.entries(VERBS)) {
  report.checks += 1;
  const seen = entries.map(entry => entry.sw);
  if (new Set(seen).size !== seen.length) report.fail(`${english}: the same translation twice in one line: ${seen.join(', ')}`);
  if (!seen.length) report.fail(`${english}: no translations`);
}
for (const inf of dbInfinitives) {
  report.checks += 1;
  if (!/^k[uw][a-z']+( na)?$/.test(inf) || /[qx]/.test(inf) || /(.)\1\1/.test(inf)) report.fail(`${inf}: not a plausible Swahili infinitive`);
}

// G. Default (first) translations of basic verbs, so that an assembly or edit error shows up.
const BASIC_DEFAULTS = {
  be: 'kuwa', have: 'kuwa na', go: 'kwenda', come: 'kuja', eat: 'kula', drink: 'kunywa', die: 'kufa', give: 'kupa',
  know: 'kujua', see: 'kuona', say: 'kusema', sleep: 'kulala', sing: 'kuimba', read: 'kusoma', write: 'kuandika',
  answer: 'kujibu', forget: 'kusahau', forgive: 'kusamehe', buy: 'kununua', sell: 'kuuza', open: 'kufungua',
  close: 'kufunga', ask: 'kuuliza', want: 'kutaka', love: 'kupenda', hear: 'kusikia', run: 'kukimbia',
  walk: 'kutembea', help: 'kusaidia', wait: 'kusubiri', live: 'kuishi', wash: 'kuosha', cook: 'kupika',
  pay: 'kulipa', teach: 'kufundisha', use: 'kutumia', laugh: 'kucheka', cry: 'kulia', kill: 'kuua', swim: 'kuogelea',
  pray: 'kusali', thank: 'kushukuru', wear: 'kuvaa', turn: 'kugeuka', exist: 'kuishi',
};
for (const [english, want] of Object.entries(BASIC_DEFAULTS)) {
  report.checks += 1;
  const entries = VERBS[english];
  if (!entries || entries[0].sw !== want) report.fail(`${english}: default translation should be ${want}, got ${entries && entries[0].sw}`);
}
// The two words that carry the plain senses of "be" and "have" are the engine's special verbs.
report.checks += 2;
if (VERBS.be[0].sw !== 'kuwa' || VERBS.have[0].sw !== 'kuwa na') report.fail('be/have must start with kuwa / kuwa na');
if (conjugate('kuwa na').forms.pres.join(' ') !== 'nina una ana tuna mna wana') report.fail('kuwa na present');


// ---- from the independent review: lexicalised ji- verbs are ordinary verbs, other ji- verbs stay reflexive ----
for (const [inf, pres, neg] of [
  ['kujifunza', 'ninajifunza, unajifunza, anajifunza, tunajifunza, mnajifunza, wanajifunza', 'sijifunzi, hujifunzi, hajifunzi, hatujifunzi, hamjifunzi, hawajifunzi'],
  ['kujiunga', 'ninajiunga, unajiunga, anajiunga, tunajiunga, mnajiunga, wanajiunga', 'sijiungi, hujiungi, hajiungi, hatujiungi, hamjiungi, hawajiungi'],
]) {
  const r = conjugate(inf);
  report.checks += 2;
  if (!r) { report.fail(`${inf}: conjugate() returned null`); continue; }
  if (r.forms.pres.join(', ') !== pres) report.fail(`${inf}.pres: expected ${pres}, got ${r.forms.pres.join(', ')}`);
  if (r.forms.negPres.join(', ') !== neg) report.fail(`${inf}.negPres: expected ${neg}, got ${r.forms.negPres.join(', ')}`);
}
for (const inf of ['kujipenda', 'kujiua', 'kujitahidi']) {
  report.checks += 1;
  if (conjugate(inf) !== null) report.fail(`${inf}: a reflexive ji- verb must stay unsupported`);
}

report.finish(`${report.checks} paradigm checks, ${Object.keys(VERBS).length} English verbs, ${swahiliCount} Swahili translations`);
