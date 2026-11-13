/*
 * Russian verb conjugation engine (standard Russian).
 *
 *   conjugate('говори́ть', 'i') -> { inf, aspect, forms }
 *
 * Input is an infinitive (optionally with -ся) carrying ONE stress mark, a combining
 * acute accent U+0301 after the stressed vowel (говори́ть, де́лать); words with one
 * vowel or with ё need none. The stress mark decides the imperative ending of
 * second-conjugation verbs (-и́ говори́, -ь гото́вь, -и по́мни; -й after a vowel stem:
 * чита́й), ё versus е in -нуть verbs (верну́ть -> вернёшь, but дви́нуть -> дви́нешь) and
 * whether a prefixed relative has ё (принесёшь, but вы́несешь). The irregular verbs in
 * the tables below, the first-conjugation verbs and every verb whose imperative does not
 * depend on the stress work with or without the mark; where the mark is needed and
 * missing the engine returns null instead of guessing. Output forms carry no stress marks
 * but do use ё (идёшь, шёл, нёс).
 *
 * aspect: 'i' imperfective, 'p' perfective, 'b' biaspectual (treated as imperfective).
 * forms has exactly these keys, each an array of six strings (я, ты, он/она/оно,
 * мы, вы, они):
 *   pres    present (six NONE for a perfective verb)
 *   past    "читал / читала" ... (gender shown, joined by " / ")
 *   fut     буду читать... (imperfective) or the simple future (perfective)
 *   cond    past + бы
 *   imp     ты, ты, ты, мы (давайте ...), вы, вы
 *   impNeg  не читай ... (imperfective only)
 *   ger     деепричастие: present (imperfective) or past (perfective), same in all six
 *   part    причастие: present active (imperfective) or past active (perfective)
 * A form that does not exist is NONE ("—"): there is no present tense for a perfective
 * verb, no imperative for мочь / хотеть / видеть / слышать, and verbs that are used only
 * in the 3rd person (происходить, случиться) have only the он/она/оно and они slots.
 * быть has "есть" as its only present form (3rd person) and its future is буду, будешь...
 * Returns null for anything this engine cannot conjugate with confidence.
 */
(function (global) {
  'use strict';

  const { words, findFamily } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  const six = words;
  const NONE = '—';
  const ACUTE = '\u0301';
  const isV = c => 'аеёиоуыэюя'.includes(c);
  const isCons = c => !isV(c) && c !== 'ь' && c !== 'ъ';
  const last = s => s[s.length - 1];
  const noYo = s => s.replace(/ё/g, 'е');
  const SIB = 'жчшщ';
  const isSib = c => SIB.includes(c);
  // two consonants at the end: помн-, закончь-
  const cluster = s => s.length >= 2 && isCons(s[s.length - 1]) && isCons(s[s.length - 2]);

  // ---- Prefixes ------------------------------------------------------------------
  //
  // Verbal prefixes in the spelling they have in the infinitive (подойти, отобрать,
  // разорвать). A prefix before a family base must be one of these, a hard-sign
  // variant (съесть) or a chain of two (недовыпить, подождать); an unknown prefix means
  // the verb is not a relative (купить is not a relative of пить).
  const STD_WORDS = words(`в во вы вз взо вс воз возо вос до за из изо ис на над надо недо низ
    о об обо от ото пере по под подо пре пред предо при про раз разо рас с со у`);
  // The spelling of a prefix before the root: some prefixes take an extra "o" in the
  // infinitive (отобрать, подойти); the plain form is what the present tense uses.
  const NORM = { во: 'в', взо: 'вз', возо: 'воз', изо: 'из', надо: 'над', обо: 'об', ото: 'от', подо: 'под',
    предо: 'пред', разо: 'раз', со: 'с' };
  // the "o" some prefixes take before a root that starts with a cluster (сорвать, оторвать)
  const O_MAP = { в: 'во', вз: 'взо', вс: 'взо', воз: 'возо', вос: 'возо', из: 'изо', ис: 'изо', над: 'надо', об: 'обо',
    от: 'ото', пред: 'предо', раз: 'разо', рас: 'разо', с: 'со', под: 'подо' };
  const STDX = (() => {
    const out = new Set(['']);
    for (const p of STD_WORDS) {
      out.add(p);
      if (isCons(last(p))) out.add(p + 'ъ');
    }
    const long = STD_WORDS.filter(p => p.length >= 2);
    for (const a of long) for (const b of long) out.add(a + b);
    return [...out];
  })();
  const CONS_PREFIXES = STD_WORDS.filter(p => isCons(last(p)));

  // ---- Reading the input -----------------------------------------------------------

  // -> { text, plain, base, refl, stress } or null. `stress` is the index in `base` of
  // the stressed vowel, or -1 when it is not known.
  function parse(input) {
    if (typeof input !== 'string') return null;
    const text = input.trim().normalize('NFC').toLowerCase();
    if (!text) return null;
    let plain = '';
    let stress = -1;
    let marks = 0;
    for (const ch of text) {
      if (ch === ACUTE) {
        marks += 1;
        if (!plain || !isV(last(plain)) || marks > 1) return null;
        stress = plain.length - 1;
      } else plain += ch;
    }
    if (!/^[а-яё]+$/.test(plain)) return null;
    const yo = plain.indexOf('ё');
    if (yo >= 0) {
      if (plain.lastIndexOf('ё') !== yo) return null;
      if (marks && stress !== yo) return null;
      stress = yo;
    }
    const vowels = [...plain].filter(isV);
    if (!vowels.length) return null;
    if (stress < 0 && vowels.length === 1) stress = plain.split('').findIndex(isV);
    let base = plain;
    let refl = false;
    if (/(ться|тись|чься)$/.test(plain)) { base = plain.slice(0, -2); refl = true; }
    if (stress >= base.length) return null; // the stress mark cannot sit on the reflexive ending
    if (!/(ть|ти|чь)$/.test(base) || base.length < 3) return null;
    return { text, plain, base, refl, stress };
  }

  // the reflexive ending: -ся after a consonant, ь or й, -сь after a vowel
  const reflex = w => (w === NONE ? w : w + (isV(last(w)) ? 'сь' : 'ся'));

  // ---- Irregular verbs and their families -------------------------------------------
  //
  // One line per base verb, fields separated by " | ":
  //   base | prefixes | present (six forms) | past (m f n pl, "-" = regular) | imperative | flags
  // The base is written for the bare verb; a prefix in front of it (find via
  // findFamily) is added to every irregular form, so брать gives собрать, выбрать,
  // отобрать... Prefixes: "std" (any ordinary verbal prefix or a chain of two), "_"
  // (no prefix) and explicit lists such as "_,по,за". Forms are written with ё;
  // under a stressed prefix (вы́нести, вы́пить) the ё becomes е.
  // Flags:
  //   o=all|s   prefixes ending in a consonant take "o" before the root (оторвать, сорвать);
  //             "s": only с (соберу, but отберу)
  //   op=1      the o also goes into the non-masculine past (сожгла, сочла)
  //   g=, pg=, ap=, pp=   present gerund, past gerund, present / past active participle
  //             ("none": the verb has none; pg=inf: infinitive stem + в); default derived
  //   py=1      a prefixed verb has no ё in the past (запер, not запёр)
  //   nn=1      do not normalise the prefix (подо-, обо- stay in идти relatives)
  //   pri=1     при + й drops the й (приду)
  //   ib=       imperative of the bare verb (ехать -> поезжай)
  const LEXICON = `
обобрать | _ | оберу оберёшь оберёт оберём оберёте оберут | - | обери | -
брать | std | беру берёшь берёт берём берёте берут | - | бери | o=s
врать | std | вру врёшь врёт врём врёте врут | - | ври | o=s
звать | std | зову зовёшь зовёт зовём зовёте зовут | - | зови | o=s
драть | std | деру дерёшь дерёт дерём дерёте дерут | - | дери | -
рвать | std | рву рвёшь рвёт рвём рвёте рвут | - | рви | o=all
жать | _,с,на,по,вы,от,за,раз,рас,при,под,пере,про,до,у,в,об,недо,над | жму жмёшь жмёт жмём жмёте жмут | - | жми | o=all
мять | std | мну мнёшь мнёт мнём мнёте мнут | - | мни | o=all
ждать | std | жду ждёшь ждёт ждём ждёте ждут | - | жди | o=all
лгать | std | лгу лжёшь лжёт лжём лжёте лгут | - | лги | o=all g=none
слать | std | шлю шлёшь шлёт шлём шлёте шлют | - | шли | o=all
стлать | std | стелю стелешь стелет стелем стелете стелют | - | стели | -
стелить | std | стелю стелешь стелет стелем стелете стелют | - | стели | -
стать | std | стану станешь станет станем станете станут | - | стань | -
жрать | std | жру жрёшь жрёт жрём жрёте жрут | - | жри | o=all
орать | std | ору орёшь орёт орём орёте орут | - | ори | -
дать | std,соз,воссоз,пересоз | дам дашь даст дадим дадите дадут | дал дала дало дали | дай | -
сесть | std | сяду сядешь сядет сядем сядете сядут | сел села село сели | сядь | -
честь | std | чту чтёшь чтёт чтём чтёте чтут | чёл чла чло чли | чти | o=s op=1 pg=чтя pp=none
есть | std | ем ешь ест едим едите едят | ел ела ело ели | ешь | nn=1
пасть | std,сов | паду падёшь падёт падём падёте падут | пал пала пало пали | пади | -
красть | std | краду крадёшь крадёт крадём крадёте крадут | крал крала крало крали | кради | -
класть | std | кладу кладёшь кладёт кладём кладёте кладут | клал клала клало клали | клади | -
лезть | std | лезу лезешь лезет лезем лезете лезут | лез лезла лезло лезли | лезь | -
лезти | std | лезу лезешь лезет лезем лезете лезут | лез лезла лезло лезли | лезь | -
прясть | std | пряду прядёшь прядёт прядём прядёте прядут | прял пряла пряло пряли | пряди | -
грызть | std | грызу грызёшь грызёт грызём грызёте грызут | грыз грызла грызло грызли | грызи | -
стонать | std | стону стонешь стонет стонем стонете стонут | - | стони | -
обрести | _,при,из | обрету обретёшь обретёт обретём обретёте обретут | обрёл обрела обрело обрели | обрети | g=none pg=обретя pp=обретший
брести | _,по,за,до,пере,вы,раз,рас,под,от | бреду бредёшь бредёт бредём бредёте бредут | брёл брела брело брели | бреди | g=бредя pg=бредя pp=бредший
стеречь | std | стерегу стережёшь стережёт стережём стережёте стерегут | стерёг стерегла стерегло стерегли | стереги | g=none nn=1
небречь | пре | небрегу небрежёшь небрежёт небрежём небрежёте небрегут | небрёг небрегла небрегло небрегли | небреги | g=none
речь | от | реку речёшь речёт речём речёте рекут | рёк рекла рекло рекли | реки | g=none
цвести | std | цвету цветёшь цветёт цветём цветёте цветут | цвёл цвела цвело цвели | цвети | g=цветя pg=none pp=цветший
нести | std | несу несёшь несёт несём несёте несут | нёс несла несло несли | неси | g=неся pg=неся
везти | std | везу везёшь везёт везём везёте везут | вёз везла везло везли | вези | g=везя pg=везя
вести | std,воспроиз | веду ведёшь ведёт ведём ведёте ведут | вёл вела вело вели | веди | g=ведя pg=ведя pp=ведший
мести | std | мету метёшь метёт метём метёте метут | мёл мела мело мели | мети | g=метя pg=метя pp=метший
плести | std | плету плетёшь плетёт плетём плетёте плетут | плёл плела плело плели | плети | g=плетя pg=плетя pp=none
грести | std | гребу гребёшь гребёт гребём гребёте гребут | грёб гребла гребло гребли | греби | g=гребя pg=гребя
скрести | std | скребу скребёшь скребёт скребём скребёте скребут | скрёб скребла скребло скребли | скреби | g=скребя pg=скребя nn=1
трясти | std | трясу трясёшь трясёт трясём трясёте трясут | тряс трясла трясло трясли | тряси | g=тряся pg=none
спасти | _ | спасу спасёшь спасёт спасём спасёте спасут | спас спасла спасло спасли | спаси | -
пасти | _,вы,до,за,от,по,под,при,про,у,на,пере,рас | пасу пасёшь пасёт пасём пасёте пасут | пас пасла пасло пасли | паси | g=пася pp=пасший
попрать | _ | попру попрёшь попрёт попрём попрёте попрут | - | попри | -
застрять | _ | застряну застрянешь застрянет застрянем застрянете застрянут | - | застрянь | -
гнести | у | гнету гнетёшь гнетёт гнетём гнетёте гнетут | гнёл гнела гнело гнели | гнети | g=гнетя pg=гнетя pp=гнетший
соблюсти | _ | соблюду соблюдёшь соблюдёт соблюдём соблюдёте соблюдут | соблюл соблюла соблюло соблюли | соблюди | g=none pg=соблюдя pp=соблюдший
расти | std | расту растёшь растёт растём растёте растут | рос росла росло росли | расти | g=растя pg=росши
ползти | std | ползу ползёшь ползёт ползём ползёте ползут | полз ползла ползло ползли | ползи | g=ползя pg=none
клясть | std | кляну клянёшь клянёт клянём клянёте клянут | клял кляла кляло кляли | кляни | -
идти | _ | иду идёшь идёт идём идёте идут | шёл шла шло шли | иди | g=идя pg=идя pp=шедший nn=1
йти | по,при,вы,во,за,у,на,пере,про,до,подо,ото,обо,со,разо,изо,взо,возо,надо,предо,недо,пре,произо,превзо | йду йдёшь йдёт йдём йдёте йдут | шёл шла шло шли | йди | g=йдя pg=йдя pp=шедший nn=1 pri=1
ткать | _,с,со,вы,за,на,пере,по,про,от,раз | тку ткёшь ткёт ткём ткёте ткут | - | тки | o=s
помочь | _ | помогу поможешь поможет поможем поможете помогут | помог помогла помогло помогли | помоги | -
мочь | _,с,превоз | могу можешь может можем можете могут | мог могла могло могли | none | g=none
влечь | std | влеку влечёшь влечёт влечём влечёте влекут | влёк влекла влекло влекли | влеки | g=none nn=1
облечь | _ | облеку облечёшь облечёт облечём облечёте облекут | облёк облекла облекло облекли | облеки | -
лечь | _,на,за,с,вы,у,раз,пере,по,при,от,под,до,над,пре | лягу ляжешь ляжет ляжем ляжете лягут | лёг легла легло легли | ляг | -
беречь | std | берегу бережёшь бережёт бережём бережёте берегут | берёг берегла берегло берегли | береги | g=none
течь | std | теку течёшь течёт течём течёте текут | тёк текла текло текли | теки | g=none
печь | std | пеку печёшь печёт печём печёте пекут | пёк пекла пекло пекли | пеки | g=none
стричь | std | стригу стрижёшь стрижёт стрижём стрижёте стригут | стриг стригла стригло стригли | стриги | g=none nn=1
толочь | std | толку толчёшь толчёт толчём толчёте толкут | толок толкла толкло толкли | толки | g=none
сечь | _,вы,за,рас,по,при,с,пере,у,пре,на,про | секу сечёшь сечёт сечём сечёте секут | сёк секла секло секли | секи | -
прячь | за,рас,вы,по,пере,от,до,на | прягу пряжёшь пряжёт пряжём пряжёте прягут | пряг прягла прягло прягли | пряги | -
стичь | до,по,на | стигну стигнешь стигнет стигнем стигнете стигнут | стиг стигла стигло стигли | стигни | -
жечь | std | жгу жжёшь жжёт жжём жжёте жгут | жёг жгла жгло жгли | жги | o=all op=1 g=none
тереть | std | тру трёшь трёт трём трёте трут | тёр тёрла тёрло тёрли | три | o=all pg=inf
переть | _,за,от,при,под,с,вы,на,про,до,раз | пру прёшь прёт прём прёте прут | пёр пёрла пёрло пёрли | при | o=all pg=inf py=1
опереть | _ | обопру обопрёшь обопрёт обопрём обопрёте обопрут | опёр оперла оперло оперли | обопри | pg=inf
мереть | std | мру мрёшь мрёт мрём мрёте мрут | мер мерла мерло мерли | мри | o=all pg=inf
колоть | std | колю колешь колет колем колете колют | - | коли | -
молоть | std | мелю мелешь мелет мелем мелете мелют | - | мели | -
полоть | _,вы,про,по,за,с,от | полю полешь полет полем полете полют | - | поли | -
пороть | std | порю порешь порет порем порете порют | - | пори | -
бороть | _,по,с,за,до,пере | борю борешь борет борем борете борют | - | бори | -
жить | std | живу живёшь живёт живём живёте живут | - | живи | -
пить | _,вы,на,по,до,за,от,пере,про,раз,рас,при,у,об,из,ис,под,недо | пью пьёшь пьёт пьём пьёте пьют | - | пей | o=all
надобить | _,по | надоблю надобишь надобит надобим надобите надобят | - | none | -
обить | _ | обобью обобьёшь обобьёт обобьём обобьёте обобьют | - | обей | -
бить | std | бью бьёшь бьёт бьём бьёте бьют | - | бей | o=all
лить | _,на,вы,за,по,до,от,пере,про,раз,рас,с,об,под,при,из,ис,в,недо,воз | лью льёшь льёт льём льёте льют | - | лей | o=all
шить | std | шью шьёшь шьёт шьём шьёте шьют | - | шей | o=all
вить | _,с,за,раз,рас,об,у,по,вы,на,пере,при,про,под,от,до,в,из | вью вьёшь вьёт вьём вьёте вьют | - | вей | o=all
гнить | std | гнию гниёшь гниёт гниём гниёте гниют | - | гни | -
брить | std | брею бреешь бреет бреем бреете бреют | - | брей | -
чтить | _,по | чту чтишь чтит чтим чтите чтут | - | чти | -
быть | _,за,до,при,про,по,у,вы,от,из,пре,с | буду будешь будет будем будете будут | был была было были | будь | g=none ap=none
стыть | _,за,о,вы,по,при,про,до,пере,от,на,у | стыну стынешь стынет стынем стынете стынут | - | стынь | -
плыть | std | плыву плывёшь плывёт плывём плывёте плывут | - | плыви | -
слыть | _,про | слыву слывёшь слывёт слывём слывёте слывут | - | слыви | -
петь | _,с,за,до,на,про,под,от,пере,рас,вы,по,при | пою поёшь поёт поём поёте поют | - | пой | -
блевать | _,вы,по,за,на,от,с,рас,об | блюю блюёшь блюёт блюём блюёте блюют | - | блюй | -
реветь | _,за,по | реву ревёшь ревёт ревём ревёте ревут | - | реви | -
взять | _ | возьму возьмёшь возьмёт возьмём возьмёте возьмут | - | возьми | -
чать | на,за,по | чну чнёшь чнёт чнём чнёте чнут | - | чни | -
деть | _,о,на,раз,за,при,пере,под,вы,в,до,недо,про | дену денешь денет денем денете денут | - | день | -
ошибить | _ | ошибу ошибёшь ошибёт ошибём ошибёте ошибут | ошиб ошибла ошибло ошибли | ошиби | pg=inf pp=ошибший
ушибить | _ | ушибу ушибёшь ушибёт ушибём ушибёте ушибут | ушиб ушибла ушибло ушибли | ушиби | pg=inf pp=ушибший
бежать | _,с,на,по,вы,от,за,раз,рас,при,под,пере,про,до,у,в,об,недо,над,из | бегу бежишь бежит бежим бежите бегут | - | беги | g=бежа
хотеть | _,за,рас,по | хочу хочешь хочет хотим хотите хотят | - | none | g=хотя
гнать | std | гоню гонишь гонит гоним гоните гонят | - | гони | -
спать | std | сплю спишь спит спим спите спят | - | спи | -
ржать | _,за,по | ржу ржёшь ржёт ржём ржёте ржут | - | ржи | -
сосать | std | сосу сосёшь сосёт сосём сосёте сосут | - | соси | -
ковать | std | кую куёшь куёт куём куёте куют | - | куй | -
совать | std | сую суёшь суёт суём суёте суют | - | суй | -
жевать | std | жую жуёшь жуёт жуём жуёте жуют | - | жуй | -
клевать | _,за,по,до,вы,на | клюю клюёшь клюёт клюём клюёте клюют | - | клюй | -
плевать | _,по,на,за,вы,от,о,с | плюю плюёшь плюёт плюём плюёте плюют | - | плюй | -
смеять | _,по,за,рас,вы,на,о | смею смеёшь смеёт смеём смеёте смеют | - | смей | -
ехать | std | еду едешь едет едем едете едут | - | езжай | g=none ib=поезжай
ездить | std | езжу ездишь ездит ездим ездите ездят | - | езди | -
`;

  // Verbs with a consonant change through the whole present (писать -> пишу, пишешь).
  // base:stem[:imperative][flags]. The imperative is -и (stress on the ending in
  // писа́ть) unless the verb is marked "!" (stem stress: пла́кать -> плачь, ре́зать -> режь).
  // "~": a prefixed imperfective is the regular -ать verb (отреза́ть -> отрезаю, but the
  // perfective отре́зать -> отрежу). "$": the verb has no prefixed relatives (подметать is the
  // regular imperfective of подмести́, not a relative of метать).
  const MUTATING = words(`
    писать:пиш сказать:скаж казать:каж вязать:вяж лизать:лиж чесать:чеш махать:маш пахать:паш
    плескать:плещ хлестать:хлещ метать:меч$ глодать:глож роптать:ропщ клеветать:клевещ
    полоскать:полощ искать:ищ шептать:шепч хлопотать:хлопоч щекотать:щекоч бормотать:бормоч
    хохотать:хохоч щебетать:щебеч трепетать:трепещ скрежетать:скрежещ топтать:топч трепать:трепл
    щипать:щипл дремать:дремл колебать:колебл скакать:скач плясать:пляш тесать:теш лопотать:лопоч
    рокотать:рокоч клокотать:клокоч хныкать:хныч! мурлыкать:мурлыч! плакать:плач! прятать:пряч!
    резать:реж!~ мазать:маж! сыпать:сыпл:сыпь!~ жаждать:жажд:none! свистать:свищ блистать:блещ колыхать:колыш
    лепетать:лепеч стрекотать:стрекоч кудахтать:кудахч!
    обязать:обяж$ низать:ниж рукоплескать:рукоплещ$ грохотать:грохоч`);

  // -еть, -ать and -ять verbs of the second conjugation (the -ить verbs are second
  // conjugation by default). A listed word also covers its prefixed relatives.
  const II_EET = words(`видеть обидеть зависеть висеть сидеть терпеть вертеть смотреть гореть шуметь
    греметь кипеть храпеть шипеть скрипеть свистеть блестеть хрустеть звенеть гудеть пыхтеть кряхтеть
    глядеть велеть сопеть скорбеть хрипеть зудеть шелестеть лететь кишеть обозреть узреть презреть тарахтеть`);
  const II_ATH = words(`держать лежать дышать слышать стоять боять кричать молчать звучать стучать
    мычать ворчать урчать рычать торчать бренчать бурчать пищать трещать шуршать мчать дрожать
    визжать жужжать брюзжать дребезжать задолжать`);
  // -евать verbs that give -юю / -ую (воевать -> воюю); other -евать verbs are the
  // imperfectives in -ева-ть (успевать -> успеваю)
  const EVAT = words('воевать горевать ночевать кочевать танцевать малевать бичевать бушевать корчевать рубцевать');
  // roots of the -нуть verbs that lose -ну- in the past (гаснуть -> гас)
  const DROP_ROOTS = words(`гас сох мёрз мерз вя тух гиб ник вык молк мок кис креп слеп глох лип стих
    исчез воскрес стиг блёк мерк мяк зяб слаб вяз сты вис чах бух пух верг проверг торг бег`);
  // -нуть verbs with mobile stress (тяну́, тя́нешь): no ё
  const MOBILE_ROOTS = ['тя', 'гля', 'то', 'ма', 'помя']; // тянуть, глянуть, тонуть, обмануть
  // unprefixed verbs whose stress is on the stem; after вы- they keep -ь (выбрось, выставь)
  const A_TAILS = words('ставить бросить править красить гладить мерить весить метить готовить');
  // verbs without an imperative, and verbs used only in the 3rd person
  const NO_IMP = new Set(words(`стоить значить весить состоять принадлежать слышать видеть хотеть мочь смочь
    происходить произойти случаться случиться состояться казаться требоваться потребоваться надоесть`));
  const THIRD = new Set(words(`происходить произойти случаться случиться состояться удаваться удаться хватить гнездиться нереститься иметься слышаться сочиться стоить надлежать претить недоставать`));
  // impersonal verbs: only он/она/оно, and in the past only the neuter (моросит, моросило)
  const IMPERSONAL = new Set(words('хотеться моросить светать смеркаться рассветать накрапывать'));
  // -тить verbs whose 1st person singular has щ (запретить -> запрещу, like the imperfective запрещать)
  const SHCH_TAILS = words(`кратить вратить обратить поглотить посетить претить хитить щитить богатить
    сытить кротить смутить возмутить ощутить святить поработить тяготить`);
  const NO_GER = new Set(['казаться']); // no present gerund in use
  const NO_FIRST = new Set(['победить']); // no 1st person singular: победить
  // words that end like an infinitive but are nouns
  const NOT_VERBS = new Set(words('мать пять девять путь ночь дочь'));

  // ---- Building the families ---------------------------------------------------------

  function expandPrefixes(list) {
    const out = new Set();
    for (const token of list.split(',')) {
      if (token === 'std') STDX.forEach(p => out.add(p));
      else if (token === '_') out.add('');
      else {
        out.add(token);
        if (isCons(last(token))) out.add(token + 'ъ');
      }
    }
    return [...out];
  }

  const FAMILIES = [];
  for (const line of LEXICON.trim().split('\n')) {
    const [base, px, pres, past, imp, flags] = line.split('|').map(field => field.trim());
    const spec = { pres: six(pres), past: past === '-' ? null : six(past), imp };
    for (const flag of (flags || '').split(/\s+/)) {
      const [key, value] = flag.split('=');
      if (key && key !== '-') spec[key] = value === undefined ? true : value;
    }
    FAMILIES.push({ base, prefixes: expandPrefixes(px), spec });
  }
  const ENDINGS1 = ['у', 'ешь', 'ет', 'ем', 'ете', 'ут'];
  for (const entry of MUTATING) {
    const [head, ...rest] = entry.replace(/[!~$]+$/, '').split(':');
    const marks = entry.slice(entry.replace(/[!~$]+$/, '').length);
    const [base, stem] = [head, rest[0]];
    const stemStressed = marks.includes('!');
    let imp = rest[1];
    if (!imp) imp = stemStressed && !cluster(stem) ? stem + 'ь' : stem + 'и';
    // stems with the epenthetic л (сыплю, щиплю, дремлю) take -ю / -ют
    const endings = last(stem) === 'л' && cluster(stem) ? ['ю', 'ешь', 'ет', 'ем', 'ете', 'ют'] : ENDINGS1;
    const spec = { pres: endings.map(e => stem + e), past: null, imp, pfi: marks.includes('~'), y: base[0] === 'и' };
    FAMILIES.push({ base, prefixes: marks.includes('$') ? [''] : STDX, spec });
    if (spec.y) FAMILIES.push({ base: 'ы' + base.slice(1), prefixes: CONS_PREFIXES, spec });
  }

  // ---- Building blocks -----------------------------------------------------------------

  const END_V = ['ю', 'ешь', 'ет', 'ем', 'ете', 'ют'];      // after a vowel: читаю, читаешь
  const END_VE = ['ю', 'ёшь', 'ёт', 'ём', 'ёте', 'ют'];    // the same with stressed endings: даёшь
  const END_C = ['у', 'ешь', 'ет', 'ем', 'ете', 'ут'];      // after a consonant: тяну, тянешь
  const END_CE = ['у', 'ёшь', 'ёт', 'ём', 'ёте', 'ут'];    // stressed: вернёшь
  const withEnd = (stem, endings) => endings.map(e => stem + e);

  const regularPast = base => {
    const stem = base.slice(0, -2);
    return [stem + 'л', stem + 'ла', stem + 'ло', stem + 'ли'];
  };

  // the present gerund and active participle come from the 3rd person plural
  function gerundFrom(third) {
    const stem = third.slice(0, -2);
    const end = third.slice(-2);
    if (end === 'ат') return stem + 'а';
    if (end === 'ят' || end === 'ют') return stem + 'я';
    if (end === 'ут') return stem + (isSib(last(stem)) ? 'а' : 'я');
    return null;
  }
  const participleFrom = third => third.slice(0, -1) + 'щий';
  // past gerund and past active participle come from the masculine past
  const pastGerund = masc => (last(masc) === 'л' ? masc.slice(0, -1) + 'в' : masc + 'ши');
  const pastParticiple = masc => (last(masc) === 'л' ? masc.slice(0, -1) + 'вший' : masc + 'ший');

  // 2nd person singular imperative from the stem of the 2nd person (вид-, пиш-, чита-).
  // endStressed: the 1st person singular is stressed on its ending (говорю́ -> говори́);
  // undefined: not known.
  function imperativeFrom(stem, endStressed) {
    if (isV(last(stem))) return stem + 'й';
    if (endStressed || cluster(stem)) return stem + 'и';
    if (endStressed === undefined) return null;
    return stem + 'ь';
  }

  // consonant change of the 1st person singular of a second-conjugation verb
  const MUTATION = { б: 'бл', в: 'вл', м: 'мл', п: 'пл', ф: 'фл', д: 'ж', з: 'ж', с: 'ш', т: 'ч', г: 'ж', к: 'ч', х: 'ш' };
  function mutate(stem) {
    if (/зд$/.test(stem)) return stem.slice(0, -2) + 'зж'; // нагромоздить -> нагромозжу (ездить is in the lexicon)
    if (/(ст|ск)$/.test(stem)) return stem.slice(0, -2) + 'щ';
    const c = last(stem);
    return Object.hasOwn(MUTATION, c) ? stem.slice(0, -1) + MUTATION[c] : stem;
  }
  // second conjugation: говор- -> говорю, говоришь, говорит, говорим, говорите, говорят
  function secondConjugation(stem, shch) {
    const c = last(stem);
    let first;
    if (isV(c)) first = stem + 'ю';
    else if (isSib(c)) first = stem + 'у';
    else {
      const changed = shch && c === 'т' ? stem.slice(0, -1) + 'щ' : mutate(stem);
      if (!changed) return null;
      first = changed + (isSib(last(changed)) ? 'у' : 'ю');
    }
    return [first, stem + 'ишь', stem + 'ит', stem + 'им', stem + 'ите', stem + (isSib(c) ? 'ат' : 'ят')];
  }

  const hasTail = (base, tails) => tails.some(tail => base.endsWith(tail));

  // The regular patterns, chosen by the ending of the infinitive. Returns
  // { pres, past, imp, g, ap, pg?, pp? } or null.
  function regularCore(pr) {
    const b = pr.base;
    const n = b.length;
    const endStressed = pr.stress < 0 ? undefined : pr.stress === n - 3;
    const afterVy = pr.stress === 1 && b.startsWith('вы');
    const plainVerb = (pres, stem2, endStr, extra = {}) => {
      const imp = imperativeFrom(stem2, endStr);
      if (imp === null && !NO_IMP.has(pr.plain)) return null; // stress mark needed for the imperative
      return { pres, past: regularPast(b), imp, ...extra };
    };

    if (/нуть$/.test(b)) {
      const stem0 = b.slice(0, -4);
      const nstem = stem0 + 'н';
      const prefixed = root => stem0.endsWith(root) && STDX.includes(stem0.slice(0, -root.length));
      const drop = DROP_ROOTS.some(prefixed) || stem0 === 'пах'; // пахнуть: пах, пахла (the verb to smell)
      if (drop) {
        const root = stem0.replace(/мерз$/, 'мёрз');
        const masc = isV(last(root)) ? root + 'л' : root;
        const past = [masc, root + 'ла', root + 'ло', root + 'ли'];
        return { pres: withEnd(nstem, END_C), past, imp: imperativeFrom(nstem, false), pgOverride: b.slice(0, -2) + 'в' };
      }
      const mobile = MOBILE_ROOTS.some(prefixed);
      if (endStressed === undefined && !mobile) return null;
      const yo = endStressed === true && !mobile;
      const endStr = mobile ? true : afterVy ? false : endStressed;
      return plainVerb(withEnd(nstem, yo ? END_CE : END_C), nstem, endStr);
    }
    if (/уть$/.test(b)) {
      const stem = b.slice(0, -2);
      return plainVerb(withEnd(stem, END_V), stem, false);
    }
    if (/ыть$/.test(b)) {
      const stem = b.slice(0, -3) + 'о'; // мыть -> мою, открыть -> открою
      return plainVerb(withEnd(stem, END_V), stem, false);
    }
    if (/здоровать$/.test(b)) { // здороваться is an ordinary -ать verb, not -овать
      const stem = b.slice(0, -2);
      return plainVerb(withEnd(stem, END_V), stem, false);
    }
    if (/овать$/.test(b)) {
      const stem = b.slice(0, -5) + 'у';
      return plainVerb(withEnd(stem, END_V), stem, false);
    }
    if (/евать$/.test(b)) {
      if (hasTail(b, EVAT)) {
        const root = b.slice(0, -5);
        const stem = root + ('жчшщц'.includes(last(root)) ? 'у' : 'ю');
        return plainVerb(withEnd(stem, END_V), stem, false);
      }
      const stem = b.slice(0, -2); // успевать -> успеваю
      return plainVerb(withEnd(stem, END_V), stem, false);
    }
    if (/(да|зна|ста)вать$/.test(b)) { // давать -> даю, даёшь; imperative давай, gerund давая
      const stem = b.slice(0, -4);
      return { pres: withEnd(stem, END_VE), past: regularPast(b), imp: b.slice(0, -2) + 'й', gOverride: b.slice(0, -2) + 'я' };
    }
    if (/(ать|ять)$/.test(b)) {
      if (hasTail(b, II_ATH)) {
        const stem = b.slice(0, -3);
        const pres = secondConjugation(stem);
        return pres && plainVerb(pres, stem, imperativeStress(stem, endStressed, afterVy, b));
      }
      if (/[аеу]ять$/.test(b)) { // лаять -> лаю, сеять -> сею, чуять -> чую, надеяться -> надеюсь
        const stem = b.slice(0, -3);
        return plainVerb(withEnd(stem, endStressed === true ? END_VE : END_V), stem, false);
      }
      const stem = b.slice(0, -2);
      return plainVerb(withEnd(stem, END_V), stem, false);
    }
    if (/еть$/.test(b)) {
      if (hasTail(b, II_EET)) {
        const stem = b.slice(0, -3);
        const pres = secondConjugation(stem);
        return pres && plainVerb(pres, stem, imperativeStress(stem, endStressed, afterVy, b));
      }
      const stem = b.slice(0, -2); // краснеть -> краснею, краснеешь
      return plainVerb(withEnd(stem, END_V), stem, false);
    }
    if (/ить$/.test(b)) {
      const stem = b.slice(0, -3);
      const pres = secondConjugation(stem, hasTail(b, SHCH_TAILS) || b === 'осветить');
      return pres && plainVerb(pres, stem, imperativeStress(stem, endStressed, afterVy, b));
    }
    return null;
  }

  // Is the imperative of a second-conjugation verb built on the stressed ending (-и́)?
  // After вы- (the stress sits on the prefix) the bare verb decides: выброси́ть-type
  // verbs of stem stress keep -ь, all others take -и (вы́учи, вы́купи).
  function imperativeStress(stem, endStressed, afterVy, base) {
    if (afterVy) return !hasTail(base.slice(2), A_TAILS);
    if (endStressed === undefined && !isV(last(stem)) && !cluster(stem)) return undefined;
    return endStressed;
  }

  // понять, принять, занять, снять, поднять: the present takes -йм-, -м- or -ним-
  function nyatCore(pr) {
    const b = pr.base;
    if (!/нять$/.test(b)) return null;
    const prefix = b.slice(0, -4);
    // no "o" variants here: вонять and обонять are not relatives of нять
    const NYAT = words('за на у по пере про до при с об от под раз в вз воз пред над недо воспри предпри');
    if (!NYAT.includes(prefix)) return null;
    const p = Object.hasOwn(NORM, prefix) ? NORM[prefix] : prefix;
    let forms, imp;
    if (p.endsWith('при')) { forms = ['му', 'мешь', 'мет', 'мем', 'мете', 'мут']; imp = 'ми'; }
    else if (isV(last(p))) { forms = ['йму', 'ймёшь', 'ймёт', 'ймём', 'ймёте', 'ймут']; imp = 'йми'; }
    else { forms = ['ниму', 'нимешь', 'нимет', 'нимем', 'нимете', 'нимут']; imp = 'ними'; }
    return { pres: forms.map(f => p + f), past: regularPast(b), imp: p + imp };
  }

  // ---- Irregular families -> forms --------------------------------------------------------

  function lexicalCore(match, pr) {
    const { family, prefix } = match;
    const spec = family.spec;
    const p = prefix.replace(/ъ$/, '');
    // a stressed prefix (вы́пить, вы́нести) leaves the endings unstressed: no ё
    const stressedPrefix = pr.stress >= 0 ? pr.stress < prefix.length : p === 'вы';
    const strip = form => (stressedPrefix ? noYo(form) : form);
    const norm = spec.nn ? p : Object.hasOwn(NORM, p) ? NORM[p] : p;
    const consonantPrefix = Boolean(norm) && isCons(last(norm));
    const useO = consonantPrefix && (spec.o === 'all' || (spec.o === 's' && norm === 'с'));
    const attach = (form, withO = useO) => {
      let rest = form;
      let front = norm;
      if (spec.pri && norm === 'при' && rest[0] === 'й') rest = rest.slice(1);
      if (consonantPrefix) {
        if (withO) front = Object.hasOwn(O_MAP, norm) ? O_MAP[norm] : norm;
        else if ('еёюя'.includes(rest[0])) front += 'ъ';
        else if (spec.y && rest[0] === 'и') rest = 'ы' + rest.slice(1);
      }
      return front + rest;
    };
    const pres = spec.pres.map(form => attach(strip(form)));
    const past = spec.past
      ? spec.past.map((form, i) => attach(spec.py && p ? noYo(strip(form)) : strip(form), Boolean(spec.op) && i > 0 && useO))
      : regularPast(pr.base);
    let imp;
    if (spec.imp === 'none') imp = null;
    else if (spec.ib !== undefined && !prefix) imp = spec.ib;
    else {
      // the extra o only goes in where the root has no vowel of its own: сорви, оторви, сожги, but разбей, налей
      const bare = spec.imp.length > 1 && isCons(spec.imp[0]) && !isV(spec.imp[1]);
      imp = attach(strip(spec.imp), useO && (spec.o === 's' || bare));
    }
    const core = { pres, past, imp };
    const pick = (value, make) => (value === 'none' ? null : value === undefined || value === true ? undefined : make(value));
    const g = pick(spec.g, v => attach(strip(v)));
    if (g !== undefined) core.gOverride = g;
    const pg = pick(spec.pg, v => (v === 'inf' ? pr.base.slice(0, -2) + 'в' : attach(strip(v))));
    if (pg !== undefined) core.pgOverride = pg;
    const ap = pick(spec.ap, v => attach(strip(v)));
    if (ap !== undefined) core.apOverride = ap;
    const pp = pick(spec.pp, v => attach(strip(v)));
    if (pp !== undefined) core.ppOverride = pp;
    return core;
  }

  // ---- Conjugation -----------------------------------------------------------------------------

  const BUDU = ['буду', 'будешь', 'будет', 'будем', 'будете', 'будут'];
  const dashes = () => Array(6).fill(NONE);
  const reflexGerund = w => (last(w) === 'в' ? w + 'шись' : reflex(w));

  function conjugate(input, aspect) {
    if (aspect !== 'i' && aspect !== 'p' && aspect !== 'b') return null;
    const pr = parse(input);
    if (!pr || NOT_VERBS.has(pr.base)) return null;
    const perfective = aspect === 'p';

    const match = findFamily(pr.base, FAMILIES);
    const usable = match && !(match.family.spec.pfi && match.prefix && !perfective);
    const core = usable ? lexicalCore(match, pr) : nyatCore(pr) || regularCore(pr);
    if (!core || !Array.isArray(core.pres) || core.pres.length !== 6 || !core.past) return null;

    const R = pr.refl ? reflex : w => w;
    const plain = pr.plain;
    const isBe = plain === 'быть';

    const simple = core.pres.slice();
    if (NO_FIRST.has(pr.base)) simple[0] = NONE;
    const simpleForms = simple.map(R);
    const [m, f, n, pl] = core.past.map(R);
    const imperative = NO_IMP.has(plain) ? null : core.imp;

    const forms = {};
    forms.pres = perfective ? dashes() : isBe ? [NONE, NONE, 'есть', NONE, NONE, NONE] : simpleForms;
    forms.past = [`${m} / ${f}`, `${m} / ${f}`, `${m} / ${f} / ${n}`, pl, pl, pl];
    forms.fut = perfective || isBe ? simpleForms : BUDU.map(aux => `${aux} ${plain}`);
    forms.cond = [`${m} бы / ${f} бы`, `${m} бы / ${f} бы`, `${m} бы / ${f} бы / ${n} бы`, `${pl} бы`, `${pl} бы`, `${pl} бы`];
    if (imperative) {
      const you = R(imperative);
      const you2 = R(imperative + 'те');
      const we = perfective ? simpleForms[3] : plain;
      forms.imp = [you, you, you, we === NONE ? NONE : `давайте ${we}`, you2, you2];
      forms.impNeg = perfective ? dashes() : [`не ${you}`, `не ${you}`, `не ${you}`, `давайте не ${plain}`, `не ${you2}`, `не ${you2}`];
    } else {
      forms.imp = dashes();
      forms.impNeg = dashes();
    }

    let ger;
    let part;
    if (perfective) {
      ger = core.pgOverride !== undefined ? core.pgOverride : pastGerund(core.past[0]);
      part = core.ppOverride !== undefined ? core.ppOverride : pastParticiple(core.past[0]);
    } else {
      const third = core.pres[5];
      ger = core.gOverride !== undefined ? core.gOverride : NO_GER.has(plain) ? null : gerundFrom(third);
      part = core.apOverride !== undefined ? core.apOverride : participleFrom(third);
    }
    if (isBe && !perfective) ger = 'будучи';
    forms.ger = Array(6).fill(ger ? (pr.refl ? reflexGerund(ger) : ger) : NONE);
    forms.part = Array(6).fill(part ? R(part) : NONE);

    // verbs used only in the 3rd person (происходить, случиться): он/она/оно and они
    if (THIRD.has(plain) || IMPERSONAL.has(plain)) {
      const keep = THIRD.has(plain) ? [2, 5] : [2];
      for (const key of ['pres', 'past', 'fut', 'cond']) forms[key] = forms[key].map((form, i) => (keep.includes(i) ? form : NONE));
      if (IMPERSONAL.has(plain)) {
        forms.past[2] = n;
        forms.cond[2] = `${n} бы`;
      }
      forms.imp = dashes();
      forms.impNeg = dashes();
    }

    for (const list of Object.values(forms)) {
      if (list.some(form => typeof form !== 'string' || !form || /undefined|null|NaN/.test(form))) return null;
    }
    return { inf: input.trim().normalize('NFC'), aspect, forms };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate, NONE };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
