/*
 * Polish verb conjugation engine (standard Polish).
 *
 *   conjugate('mówić', 'i') -> { inf, aspect, forms }
 *   conjugate('myć się', 'i')
 *
 * Input is an infinitive with its Polish letters (ą ć ę ł ń ó ś ź ż); a reflexive verb has
 * " się" after the infinitive. Polish stress is fixed, so there are no stress marks.
 * aspect: 'i' imperfective, 'p' perfective, 'b' biaspectual (treated as imperfective).
 * forms has exactly these keys, each an array of six strings (ja, ty, on/ona/ono, my, wy,
 * oni/one):
 *   pres    present (six NONE for a perfective verb)
 *   past    "mówiłem / mówiłam", ... (gender and number shown, joined by " / ")
 *   fut     będę mówić (imperfective) or the simple future (perfective)
 *   cond    past stem + by + person ending
 *   imp     NONE, ty, niech + 3rd person, my, wy, niech + 3rd person plural
 *   impNeg  the same with "nie" (imperfective only; NONE for a perfective verb)
 *   ger     imiesłów przysłówkowy: współczesny (imperfective) or uprzedni (perfective)
 *   part    imiesłów przymiotnikowy czynny (imperfective only), same in all six slots
 * A reflexive verb puts "się" AFTER the finite form (myję się, będę się myć, niech się myje).
 * A form that does not exist is NONE ("—"). Returns null for anything this engine cannot
 * conjugate with confidence (not an infinitive, unknown aspect, unknown pattern).
 */
(function (global) {
  'use strict';

  const { words, findFamily } =
    typeof module !== 'undefined' && module.exports
      ? require('../shared/verb-kit.js')
      : global.VerbKit;

  const six = words;
  const NONE = '—';
  const isV = c => 'aąeęioóuy'.includes(c);
  const last = s => s[s.length - 1];
  const dashes = () => Array(6).fill(NONE);
  const hasTail = (s, tails) => tails.some(t => s.endsWith(t));

  // ---- Prefixes ----------------------------------------------------------------------
  // Verbal prefixes as they are spelled in the infinitive (przynieść, wyjść, zebrać, odejść).
  // A prefix before an irregular base must be one of these or a chain of two (odpowiedzieć,
  // zapobiec); an unknown prefix means the verb is not a relative (kupić is not pić).
  const P1 = words('do na nad nade o ob obe od ode po pod pode prze przed przy roz roze s u w we wy wz z ze za zo');
  const PX = (() => {
    const out = new Set(['']);
    // a chain is a prefix followed by a longer one (odpowiedzieć = od + po); a one-letter
    // second prefix would only make accidental ones such as s + z in szumieć
    for (const a of P1) {
      out.add(a);
      for (const b of P1) if (b.length >= 2) out.add(a + b);
    }
    return [...out];
  })();
  // the e-variants of a prefix (zebrać = z + brać in the present)
  const E_VARIANT = new Set(words('we ze obe ode pode roze nade'));

  // ---- Reading the input -----------------------------------------------------------------
  // -> { text, base, refl } or null
  function parse(input) {
    if (typeof input !== 'string') return null;
    const text = input.trim().normalize('NFC').replace(/\s+/g, ' ');
    if (!text) return null;
    const parts = text.toLowerCase().split(' ');
    let refl = false;
    if (parts.length === 2 && parts[1] === 'się') refl = true;
    else if (parts.length !== 1) return null;
    const base = parts[0];
    if (!/^[a-ząćęłńóśźż]+$/.test(base) || base.length < 3) return null;
    if (!/[ćc]$/.test(base) || !/[aąeęioóuy]/.test(base)) return null;
    return { text, base, refl };
  }

  // ---- Endings ---------------------------------------------------------------------------
  const END_E = ['ę', 'esz', 'e', 'emy', 'ecie', 'ą'];      // pisz-: piszę, piszesz ...
  const END_IE = ['ę', 'iesz', 'ie', 'iemy', 'iecie', 'ą']; // ciągn-: ciągnę, ciągniesz ...
  const END_I = ['ę', 'isz', 'i', 'imy', 'icie', 'ą'];      // 2nd conjugation: robię, robisz
  const END_Y = ['ę', 'ysz', 'y', 'ymy', 'ycie', 'ą'];      // after sz cz ż rz: uczę, uczysz
  const END_A = ['m', 'sz', '', 'my', 'cie', 'ją'];         // czyta-: czytam, czytasz, czyta
  const withEnd = (stem, endings) => endings.map(e => stem + e);

  // ---- Irregular verbs and their families -----------------------------------------------
  //
  // One line per base verb, fields separated by " | ":
  //   base | prefixes | present (six forms) | past (m f n virile nonvirile, "-" = regular) | imperative | flags
  // The forms are written for the bare verb; a prefix in front of the base (found with
  // findFamily) is put before every irregular form, so nieść gives przynieść, wynieść ...
  // Prefixes: "std" (any ordinary verbal prefix or a chain of two), "_" (no prefix) and
  // explicit lists such as "_,po,za". For a perfective verb the "present" is its future.
  // Flags: np  an e-prefix loses its e in the present (zebrać -> zbiorę, odebrać -> odbiorę)
  //        nm  an e-prefix loses its e in the masculine past (wejść -> wszedł, but weszła)
  //        ep  an e-prefix loses its e in the whole past (odeprzeć -> odparł, zetrzeć -> starł, zedrzeć -> zdarł)
  //        ce  a prefix ending in a consonant takes e before the root (objąć -> obejmę)
  //        asp=p / asp=i  the entry is only for a perfective / imperfective verb
  //        g= / pt=  the present gerund / active participle when it is not the 3rd person plural + c / cy
  //                  (wrzeć: wrząc, wrzący; "none": the verb has none)
  //        ip  the bare verb is imperfective, every prefixed relative perfective (nieść, przynieść)
  const LEXICON = `
być | _ | jestem jesteś jest jesteśmy jesteście są | - | bądź | be asp=i
być | do,na,o,ob,od,po,prze,przy,s,u,z,zdo,wydo,poz,nad,wy,za,pod | będę będziesz będzie będziemy będziecie będą | - | bądź | asp=p
mieć | _ | mam masz ma mamy macie mają | - | miej | asp=i
jeść | std | jem jesz je jemy jecie jedzą | jadł jadła jadło jedli jadły | jedz | ip
wiedzieć | std | wiem wiesz wie wiemy wiecie wiedzą | - | wiedz | ip
chcieć | _,ze | chcę chcesz chce chcemy chcecie chcą | - | chciej | ip
móc | _ | mogę możesz może możemy możecie mogą | mógł mogła mogło mogli mogły | none | asp=i
móc | po,prze,z,wspo,dopo,wy,u | mogę możesz może możemy możecie mogą | mógł mogła mogło mogli mogły | móż | asp=p
dać | std,sprze,odsprze | dam dasz da damy dacie dadzą | - | daj | asp=p
iść | _ | idę idziesz idzie idziemy idziecie idą | szedł szła szło szli szły | idź | asp=i
pójść | _ | pójdę pójdziesz pójdzie pójdziemy pójdziecie pójdą | poszedł poszła poszło poszli poszły | pójdź | asp=p
jść | przy,wy,za,do,prze,u,na,we,ze,obe,ode,pode,roze,nade | jdę jdziesz jdzie jdziemy jdziecie jdą | szedł szła szło szli szły | jdź | nm asp=p
jechać | std | jadę jedziesz jedzie jedziemy jedziecie jadą | - | jedź | ip
jeździć | std | jeżdżę jeździsz jeździ jeździmy jeździcie jeżdżą | - | jeźdź | ip
nieść | std | niosę niesiesz niesie niesiemy niesiecie niosą | niósł niosła niosło nieśli niosły | nieś | ip
wieźć | std | wiozę wieziesz wiezie wieziemy wieziecie wiozą | wiózł wiozła wiozło wieźli wiozły | wieź | ip
wieść | za,prze,od,u,roz,wy,do,przy,po,z | wiodę wiedziesz wiedzie wiedziemy wiedziecie wiodą | wiódł wiodła wiodło wiedli wiodły | wiedź | asp=p
piec | std | piekę pieczesz piecze pieczemy pieczecie pieką | piekł piekła piekło piekli piekły | piecz | ip
strzec | _,o,prze,u,za,wy,do | strzegę strzeżesz strzeże strzeżemy strzeżecie strzegą | strzegł strzegła strzegło strzegli strzegły | strzeż | ip
strzyc | _,o,po,prze,wy,u,ob,ze | strzygę strzyżesz strzyże strzyżemy strzyżecie strzygą | strzygł strzygła strzygło strzygli strzygły | strzyż | ip
biec | std | biegnę biegniesz biegnie biegniemy biegniecie biegną | biegł biegła biegło biegli biegły | biegnij | ip
uciec | _ | ucieknę uciekniesz ucieknie uciekniemy uciekniecie uciekną | uciekł uciekła uciekło uciekli uciekły | uciekaj | asp=p
rzec | _,przy,o,wy,z,u | rzeknę rzekniesz rzeknie rzekniemy rzekniecie rzekną | rzekł rzekła rzekło rzekli rzekły | rzeknij | asp=p
rosnąć | std | rosnę rośniesz rośnie rośniemy rośniecie rosną | rósł rosła rosło rośli rosły | rośnij | ip
schnąć | _ | schnę schniesz schnie schniemy schniecie schną | schnął schła schło schli schły | schnij | asp=i
schnąć | wy,za,o,roz,prze,po,na,u | schnę schniesz schnie schniemy schniecie schną | schł schła schło schli schły | schnij | asp=p
moknąć | _,prze,z,po,na,wy,za | moknę mokniesz moknie mokniemy mokniecie mokną | mókł mokła mokło mokli mokły | moknij | ip
mrzeć | u,wy,ze | mrę mrzesz mrze mrzemy mrzecie mrą | marł marła marło marli marły | mrzyj | asp=p
wrzeć | _ | wrę wrzesz wrze wrzemy wrzecie wrą | wrzał wrzała wrzało wrzeli wrzały | wrzyj | asp=i g=wrząc pt=wrzący
wrzeć | za,wy,ze | wrę wrzesz wrze wrzemy wrzecie wrą | warł warła warło warli warły | wrzyj | asp=p
drzeć | _,po,wy,prze,roze,ze,na,u,ode,za,we | drę drzesz drze drzemy drzecie drą | darł darła darło darli darły | drzyj | ep ip
trzeć | _,po,na,o,prze,u,wy,za,do,ze,roze,ode,we | trę trzesz trze trzemy trzecie trą | tarł tarła tarło tarli tarły | trzyj | ep ip
przeć | _,o,wy,za,ode,pode,s,u,do,na,po | prę przesz prze przemy przecie prą | parł parła parło parli parły | przyj | ep ip
brać | std | biorę bierzesz bierze bierzemy bierzecie biorą | - | bierz | np ip
prać | _,u,wy,prze,s,po,na,do | piorę pierzesz pierze pierzemy pierzecie piorą | - | pierz | ip
wziąć | _ | wezmę weźmiesz weźmie weźmiemy weźmiecie wezmą | wziął wzięła wzięło wzięli wzięły | weź | asp=p
zdjąć | _ | zdejmę zdejmiesz zdejmie zdejmiemy zdejmiecie zdejmą | zdjął zdjęła zdjęło zdjęli zdjęły | zdejmij | asp=p
jąć | na,wyna,po,przy,u,wy,za,ob,od,pod,nad,roz | jmę jmiesz jmie jmiemy jmiecie jmą | jął jęła jęło jęli jęły | jmij | ce asp=p
ściąć | _ | zetnę zetniesz zetnie zetniemy zetniecie zetną | ściął ścięła ścięło ścięli ścięły | zetnij | asp=p
ciąć | _,po,na,prze,u,wy,za,przy,w,ob,od,roz,pod,nad | tnę tniesz tnie tniemy tniecie tną | ciął cięła cięło cięli cięły | tnij | ce ip
kląć | _,prze,za | klnę klniesz klnie klniemy klniecie klną | klął klęła klęło klęli klęły | klnij | ip
zacząć | _ | zacznę zaczniesz zacznie zaczniemy zaczniecie zaczną | zaczął zaczęła zaczęło zaczęli zaczęły | zacznij | asp=p
rozpocząć | _ | rozpocznę rozpoczniesz rozpocznie rozpoczniemy rozpoczniecie rozpoczną | rozpoczął rozpoczęła rozpoczęło rozpoczęli rozpoczęły | rozpocznij | asp=p
stać | _ | stoję stoisz stoi stoimy stoicie stoją | - | stój | asp=i
stać | _,do,na,prze,w,za,zo,u,o,ob,od,pod,roz,po,pow,pozo,przy,zaprze,zmartwychw | stanę staniesz stanie staniemy staniecie staną | - | stań | asp=p
spać | _,prze,wy,za,po,na,do,od | śpię śpisz śpi śpimy śpicie śpią | - | śpij | ip
bać | _ | boję boisz boi boimy boicie boją | - | bój | asp=i
gnać | _,za,prze,wy,po,na,od,roze,z | gonię gonisz goni gonimy gonicie gonią | - | goń | ip
kłaść | _ | kładę kładziesz kładzie kładziemy kładziecie kładą | kładł kładła kładło kładli kładły | kładź | asp=i
paść | u,s,w,wy,za,o,na,przy,od,do,roz,prze,pod,po,podu | padnę padniesz padnie padniemy padniecie padną | padł padła padło padli padły | padnij | asp=p
siąść | _,u,w,z,za,przy,o,na,do,po,ob,od,pod,roz | siądę siądziesz siądzie siądziemy siądziecie siądą | siadł siadła siadło siedli siadły | siądź | asp=p
trząść | _ | trzęsę trzęsiesz trzęsie trzęsiemy trzęsiecie trzęsą | trząsł trzęsła trzęsło trzęśli trzęsły | trzęś | asp=i
gryźć | std | gryzę gryziesz gryzie gryziemy gryziecie gryzą | gryzł gryzła gryzło gryźli gryzły | gryź | ip
kraść | std | kradnę kradniesz kradnie kradniemy kradniecie kradną | kradł kradła kradło kradli kradły | kradnij | ip
pleść | _,za,s,wy,u,o,do,roz,prze | plotę pleciesz plecie pleciemy pleciecie plotą | plótł plotła plotło pletli plotły | pleć | ip
mieść | za,wy,po,u,prze,roz,na,od,do | miotę mieciesz miecie mieciemy mieciecie miotą | miótł miotła miotło mietli miotły | mieć | asp=p
gnieść | _,z,po,wy,u,roz,za | gniotę gnieciesz gniecie gnieciemy gnieciecie gniotą | gniótł gniotła gniotło gnietli gniotły | gnieć | ip
naleźć | z,od,wy | najdę najdziesz najdzie najdziemy najdziecie najdą | nalazł nalazła nalazło naleźli nalazły | najdź | asp=p
słać | wy,po,prze,ze,za,roze,na,do,od,u,ode,przy,pode | ślę ślesz śle ślemy ślecie ślą | - | ślij | asp=p
rwać | std | rwę rwiesz rwie rwiemy rwiecie rwą | - | rwij | ip
zwać | _,na,we,prze,ode,po | zwę zwiesz zwie zwiemy zwiecie zwą | - | zwij | ip
ssać | _ | ssę ssiesz ssie ssiemy ssiecie ssą | - | ssij | asp=i
ssać | wy,za,po,na,od,prze,ob | ssę ssiesz ssie ssiemy ssiecie ssą | - | ssij | asp=p
paść | _ | pasę pasiesz pasie pasiemy pasiecie pasą | pasł pasła pasło pasli pasły | paś | asp=i
począć | _,od,wy | pocznę poczniesz pocznie poczniemy poczniecie poczną | począł poczęła poczęło poczęli poczęły | pocznij | asp=p
wesprzeć | _ | wesprę wesprzesz wesprze wesprzemy wesprzecie wesprą | wsparł wsparła wsparło wsparli wsparły | wesprzyj | asp=p
wlec | _,na,za,po,przy,wy,roz,od,do,prze,z | wlokę wleczesz wlecze wleczemy wleczecie wloką | wlókł wlokła wlokło wlekli wlokły | wlecz | ip
tłuc | _,po,s,roz,wy,u,na,prze,za | tłukę tłuczesz tłucze tłuczemy tłuczecie tłuką | tłukł tłukła tłukło tłukli tłukły | tłucz | ip
prząść | _,za,wy,s,u,na,po,prze | przędę przędziesz przędzie przędziemy przędziecie przędą | prządł przędła przędło przędli przędły | przędź | ip
żąć | _,po,z | żnę żniesz żnie żniemy żniecie żną | żął żęła żęło żęli żęły | żnij | ip
żąć | wy | żmę żmiesz żmie żmiemy żmiecie żmą | żął żęła żęło żęli żęły | żmij | asp=p
żreć | _,po,wy,za | żrę żresz żre żremy żrecie żrą | żarł żarła żarło żarli żarły | żryj | ip
ciec | wy,prze | cieknę ciekniesz cieknie ciekniemy ciekniecie ciekną | ciekł ciekła ciekło ciekli ciekły | none | asp=p
lec | u | legnę legniesz legnie legniemy legniecie legną | legł legła legło legli legły | legnij | asp=p
piąć | _,za,przy,od,roz,w,na,pod,u,wy,do | pnę pniesz pnie pniemy pniecie pną | piął pięła pięło pięli pięły | pnij | ce ip
wspiąć | _ | wespnę wespniesz wespnie wespniemy wespniecie wespną | wspiął wspięła wspięło wspięli wspięły | wespnij | asp=p
giąć | _,z,u,wy,na,prze,od,za,roz,pod,przy,w,do | gnę gniesz gnie gniemy gniecie gną | giął gięła gięło gięli gięły | gnij | ce ip
prząc | za,wy,przy,od,po | przęgnę przęgniesz przęgnie przęgniemy przęgniecie przęgną | przągł przęgła przęgło przęgli przęgły | przęgnij | asp=p
przysiąc | _ | przysięgnę przysięgniesz przysięgnie przysięgniemy przysięgniecie przysięgną | przysiągł przysięgła przysięgło przysięgli przysięgły | przysięgnij | asp=p
`;

  function expandPrefixes(list) {
    const out = new Set();
    for (const token of list.split(',')) {
      if (token === 'std') PX.forEach(p => out.add(p));
      else if (token === '_') out.add('');
      else out.add(token);
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
    const prefixes = expandPrefixes(px);
    if (spec.ip) {
      const bare = prefixes.filter(prefix => prefix === '');
      const prefixed = prefixes.filter(prefix => prefix !== '');
      if (bare.length) FAMILIES.push({ base, prefixes: bare, spec: { ...spec, asp: 'i' } });
      if (prefixed.length) FAMILIES.push({ base, prefixes: prefixed, spec: { ...spec, asp: 'p' } });
    } else FAMILIES.push({ base, prefixes, spec });
  }
  // an entry for one aspect only is invisible to the other
  const FAM = { i: FAMILIES.filter(f => f.spec.asp !== 'p'), p: FAMILIES.filter(f => f.spec.asp !== 'i') };

  // ---- Regular patterns ------------------------------------------------------------------

  const HARD_SIB = /(sz|cz|ż|rz|dż)$/;
  const prefixedBy = (stem, root) => stem.endsWith(root) && PX.includes(stem.slice(0, -root.length));
  const baseFamilies = bases => bases.map(base => ({ base, prefixes: PX }));

  // roots of the -nąć verbs that lose -ną- in the past (gasnąć -> gasł, schudnąć -> schudł)
  const DROP_ROOTS = words('gas kwit chud cich milk mięk słab marz głuch ślep blak ciek krzep puch styg więd brak');

  // the past tense: masculine, feminine, neuter, virile plural, non-virile plural
  function pastRegular(b) {
    const stem = b.slice(0, -1);
    if (/patrzeć$/.test(b)) return [stem.slice(0, -1) + 'ył', stem.slice(0, -1) + 'yła', stem.slice(0, -1) + 'yło', stem.slice(0, -1) + 'yli', stem.slice(0, -1) + 'yły']; // patrzył
    if (/eć$/.test(b)) { // widział, widziała ... but widzieli
      const s = b.slice(0, -2);
      return [s + 'ał', s + 'ała', s + 'ało', stem + 'li', s + 'ały'];
    }
    if (/nąć$/.test(b)) {
      const r = b.slice(0, -3);
      if (DROP_ROOTS.some(root => prefixedBy(r, root))) return [r + 'ł', r + 'ła', r + 'ło', r + 'li', r + 'ły'];
      return [r + 'nął', r + 'nęła', r + 'nęło', r + 'nęli', r + 'nęły'];
    }
    return [stem + 'ł', stem + 'ła', stem + 'ło', stem + 'li', stem + 'ły'];
  }

  // 1st person singular and 3rd person plural stem of a 2nd-conjugation verb (Q = the stem
  // before -ić / -yć / -eć): robić -> robi-, nosić -> nosz-, kupić -> kupi-, stoić -> stoj-.
  // `ec`: an -eć verb (zapomnieć -> zapomnę keeps the n bare).
  function mutate(Q, ec) {
    if (isV(last(Q))) return Q + 'j';
    if (/śc$/.test(Q)) return Q.slice(0, -2) + 'szcz';
    if (/(cz|rz)c$/.test(Q)) return Q + 'z'; // czcić -> czczę, chrzcić -> chrzczę
    if (/źdz$/.test(Q)) return Q.slice(0, -3) + 'żdż'; // gnieździć -> gnieżdżę, przygwoździć -> przygwożdżę
    if (/s$/.test(Q)) return Q.slice(0, -1) + 'sz';
    if (/z$/.test(Q) && !/(cz|sz|rz|dz)$/.test(Q)) return Q.slice(0, -1) + 'ż';
    if (/n$/.test(Q)) return ec ? Q : Q + 'i';
    if (/[bpwmf]$/.test(Q)) return Q + 'i';
    if (/(cz|sz|ż|rz|dz|dż|c|l|ł|r|j|ś|ć|ź|ń)$/.test(Q)) return Q;
    return null;
  }

  function secondConjugation(Q, ec) {
    if (Q.length < 2) return null;
    const m = mutate(Q, ec);
    if (!m) return null;
    const tail = !isV(last(Q)) && HARD_SIB.test(Q) ? END_Y : END_I;
    return [m + 'ę', Q + tail[1], Q + tail[2], Q + tail[3], Q + tail[4], m + 'ą'];
  }

  // imperatives whose stem vowel o becomes ó (robić -> rób, położyć -> połóż, otworzyć -> otwórz)
  const O_UMLAUT = words('robić zdobić zwolić dowolić łożyć worzyć łowić godzić słodzić płodzić spojrzeć modlić nowić drowić dowić mnożyć drożyć');
  const umlautO = T => {
    const i = T.lastIndexOf('o');
    return i < 0 ? T : T.slice(0, i) + 'ó' + T.slice(i + 1);
  };

  // a stem with no vowel of its own, so the imperative needs -ij / -yj (tkwij, drwij, brzmij, zabrzmij,
  // zadrżyj, kpij, zakpij). The roots are listed: a general "no vowel after a prefix" rule would also
  // catch zaprzecz, znacz, wywyższ and ponagl, which are plain stems.
  const NO_VOWEL_ROOTS = words('brzm grzm drż kp');
  const rootless = T => !/[aąeęioóuy]/.test(T) || hasTail(T, NO_VOWEL_ROOTS);

  // 2nd person singular imperative of a 2nd-conjugation verb from its stem Q
  function imperativeII(Q, b) {
    if (isV(last(Q))) return last(Q) === 'o' ? Q.slice(0, -1) + 'ój' : Q + 'j'; // boi -> bój, stoi -> stój
    let T = Q;
    const umlaut = hasTail(b, O_UMLAUT);
    if (/(cz|rz)c$/.test(T)) T += 'ij'; // czcij, uczcij, ochrzcij
    else if (/śc$/.test(T)) T = T.slice(0, -2) + 'ść';
    else if (/dz$/.test(T)) T = T.slice(0, -2) + 'dź';
    else if (/c$/.test(T)) T = T.slice(0, -1) + 'ć';
    else if (/s$/.test(T)) T = T.slice(0, -1) + 'ś';
    else if (/z$/.test(T) && !/(cz|sz|rz|dz)$/.test(T)) T = T.slice(0, -1) + 'ź';
    else if (/n$/.test(T)) T = isV(T[T.length - 2]) ? T.slice(0, -1) + 'ń' : T + 'ij'; // dzwoń, zmień; zapomnij
    else if (/jrz$/.test(T)) { if (!umlaut) T += 'yj'; } // zajrzyj, obejrzyj, but spójrz
    else if (rootless(T)) T += HARD_SIB.test(T) ? 'yj' : 'ij'; // tkwij, drwij; drżyj, zadrżyj, zabrzmij
    return umlaut ? umlautO(T) : T;
  }

  // -ać verbs whose present has the -ę endings: base:present-stem[:imperative]
  const MUTATING = words(`
    pisać:pisz kazać:każ wiązać:wiąż lizać:liż mazać:maż kołysać:kołysz czesać:czesz szeptać:szepcz
    płakać:płacz płukać:płucz karać:karz orać:orz klaskać:klaszcz skakać:skacz łgać:łż:łgaj deptać:depcz chichotać:chichocz łaskotać:łaskocz kołatać:kołacz
    mamrotać:mamrocz trzepotać:trzepocz bełkotać:bełkocz klekotać:klekocz szczebiotać:szczebiocz
    tupotać:tupocz trajkotać:trajkocz terkotać:terkocz chrobotać:chrobocz grzechotać:grzechocz kłopotać:kłopocz łopotać:łopocz dygotać:dygocz gdakać:gdacz
    świstać:świszcz migotać:migocz gwizdać:gwiżdż sypać:sypi kopać:kopi łapać:łapi kapać:kapi drapać:drapi
    szczypać:szczypi kąpać:kąpi trzepać:trzepi chlapać:chlapi chrapać:chrapi sapać:sapi czerpać:czerpi
    rąbać:rąbi dłubać:dłubi skubać:skubi łamać:łami kłamać:kłami drzemać:drzemi
    plątać:plącz szarpać:szarpi grzebać:grzebi skrobać:skrobi klepać:klepi bulgotać:bulgocz stukotać:stukocz
    łomotać:łomocz szamotać:szamocz świergotać:świergocz chybotać:chybocz druzgotać:druzgocz
    wskazać:wskaż zobowiązać:zobowiąż głaskać:głaszcz chłostać:chłoszcz`);
  const MUT_FAMILIES = MUTATING.map(entry => {
    const [base, stem, imp] = entry.split(':');
    return { base, prefixes: PX, stem, imp: imp || (/[bpmwf]i$/.test(stem) ? stem.slice(0, -1) : stem) };
  });

  // verbs with -j- in the present: pić -> piję, myć -> myję, żyć, bić, lać -> leję, śmiać się -> śmieję się
  const J_C = baseFamilies(words('pić bić myć żyć szyć kryć wyć ryć gnić tyć wić użyć'));
  const J_E = baseFamilies(words('lać wiać siać śmiać grzać dziać chwiać ziać'));
  // odnawiać, ponawiać, wznawiać are -am verbs, not relatives of wiać
  const NOT_J_E = words('nawiać');
  // -ać verbs with -j- and the -ę endings: łajać -> łaję, krajać -> kraję
  const AJE = baseFamilies(words('łajać krajać kajać bajać tajać'));
  // -ywać verbs that are -am verbs (ukrywać -> ukrywam), unlike pokazywać -> pokazuję
  const AM_YWAC = words(`krywać żywać nazywać wyzywać przezywać wzywać pozywać odzywać zmywać umywać obmywać
    wymywać przemywać rozmywać omywać szywać rywać grywać bywać czywać pływać`);
  // ... except the verbs of patrzeć / dbać / gabać (rozpatrywać -> rozpatruję, zaniedbywać -> zaniedbuję,
  // but odbywać się -> odbywa się)
  const UJE_YWAC = words('patrywać edbywać gabywać');
  const AM_KIWAC = baseFamilies(words('kiwać'));

  // -eć verbs of the 2nd conjugation (widzę, widzisz), the -eję verbs (tanieję) and the -em verbs
  const II_EET = words(`myśleć widzieć siedzieć leżeć słyszeć musieć wisieć lecieć kipieć cierpieć brzmieć
    grzmieć szumieć pomnieć wspomnieć spojrzeć ujrzeć zajrzeć obejrzeć przejrzeć wejrzeć
    woleć boleć milczeć krzyczeć wrzeszczeć trzeszczeć brzęczeć jęczeć warczeć mruczeć huczeć dyszeć
    należeć zależeć sterczeć śmierdzieć błyszczeć piszczeć świszczeć syczeć skrzeczeć skrzypieć
    bzyczeć buczeć burczeć ryczeć kwiczeć skowyczeć miauczeć drżeć swędzieć patrzeć przyjrzeć rozejrzeć`);
  // -eć verbs with the 1st-conjugation -ę, -esz endings (kaszlę, kaszlesz)
  const E_EC = words('kaszleć');
  const EJE = words(`tanieć drożeć bieleć siwieć starzeć młodnieć zdrowieć ciemnieć głupieć szarzeć rdzewieć
    grubieć trzeźwieć mądrzeć łysieć tężeć czernieć zielenieć czerwienieć szaleć durnieć pleśnieć sztywnieć
    niemieć słupieć martwieć drętwieć kamienieć dziczeć
    maleć próchnieć twardnieć wilgotnieć łagodnieć gęstnieć topnieć pęcznieć matowieć marnieć linieć istnieć
    zdumieć ocaleć pustoszeć dojrzeć`);   // dojrzeć = to ripen, mature (dojrzeję); 'catch sight of' is not in the data
  const A_IEM = baseFamilies(words('umieć śmieć'));

  // -nąć: ciągnąć -> ciągnę, ciągniesz, ciągnij; płynąć -> płyń; zasnąć -> zaśniesz, zaśnij
  function nCore(b) {
    const r = b.slice(0, -3);
    if (!r) return null;
    if (last(r) === 's') {
      const rs = r.slice(0, -1) + 'ś';
      return {
        pres: [r + 'nę', rs + 'niesz', rs + 'nie', rs + 'niemy', rs + 'niecie', r + 'ną'],
        imp: rs + 'nij',
      };
    }
    return { pres: withEnd(r + 'n', END_IE), imp: isV(last(r)) ? r + 'ń' : r + 'nij' };
  }

  // the regular patterns, chosen by the ending of the infinitive; { pres, imp } or null
  function regularCore(b) {
    const ePlus = (stem, imp = stem) => ({ pres: withEnd(stem, END_E), imp });
    const aStem = () => b.slice(0, -1); // czyta- from czytać
    if (/ować$/.test(b) && !b.endsWith('chować')) return ePlus(b.slice(0, -4) + 'uj');
    if (/[yi]wać$/.test(b) && (!hasTail(b, AM_YWAC) || hasTail(b, UJE_YWAC)) && !findFamily(b, AM_KIWAC)) return ePlus(b.slice(0, -4) + 'uj');
    if (/(da|sta|zna)wać$/.test(b)) return { pres: withEnd(b.slice(0, -3) + 'j', END_E), imp: b.slice(0, -1) + 'j' };
    if (/uć$/.test(b)) return ePlus(b.slice(0, -1) + 'j');
    if (/nąć$/.test(b)) return nCore(b);
    if (/ać$/.test(b)) {
      const mut = findFamily(b, MUT_FAMILIES);
      if (mut) return { pres: withEnd(mut.prefix + mut.family.stem, END_E), imp: mut.prefix + mut.family.imp };
      if (findFamily(b, J_E) && !hasTail(b, NOT_J_E)) return ePlus(b.slice(0, -2) + 'ej');
      if (findFamily(b, AJE)) return ePlus(b.slice(0, -2));
      return { pres: withEnd(aStem(), END_A), imp: aStem() + 'j' };
    }
    if (/[iy]ć$/.test(b)) {
      if (findFamily(b, J_C) && !b.endsWith('zdobić')) return ePlus(b.slice(0, -1) + 'j');
      const Q = b.slice(0, -2);
      const pres = secondConjugation(Q, false);
      if (!pres) return null;
      if (/yć$/.test(b) && !HARD_SIB.test(Q) && !isV(last(Q))) return null; // an unknown -yć verb
      return { pres, imp: imperativeII(Q, b) };
    }
    if (/eć$/.test(b)) {
      if (findFamily(b, A_IEM)) {
        // zrozum, but rozumiej and umiej
        const imp = /^zrozumieć$/.test(b) ? 'zrozum' : aStem() + 'j';
        return { pres: withEnd(aStem(), END_A), imp };
      }
      if (hasTail(b, E_EC)) return ePlus(b.slice(0, -2), b.slice(0, -2));
      if (hasTail(b, EJE)) return ePlus(aStem() + 'j');
      if (b.endsWith('pachnieć')) return { pres: withEnd(b.slice(0, -3), END_IE), imp: b.slice(0, -3) + 'ij' };
      if (hasTail(b, II_EET)) {
        const Q = b.endsWith('ieć') ? b.slice(0, -3) : b.slice(0, -2);
        const pres = secondConjugation(Q, true);
        return pres && { pres, imp: imperativeII(Q, b) };
      }
    }
    return null;
  }

  // ---- Irregular families -> forms -----------------------------------------------------------

  function lexicalCore({ family, prefix }, b) {
    const spec = family.spec;
    const eVariant = E_VARIANT.has(prefix);
    const consonantEnd = prefix !== '' && !isV(last(prefix));
    // the prefix in the past: wejść -> wszedł (masculine only, nm), odeprzeć -> odparł (all, ep);
    // z before a voiceless consonant is written s: zetrzeć -> starł, but zedrzeć -> zdarł
    const pastPrefix = (form, i) => {
      if (!eVariant) return prefix;
      if (spec.nm && i === 0) return prefix.slice(0, -1);
      if (!spec.ep) return prefix;
      const short = prefix.slice(0, -1);
      return short === 'z' && /^([ptkcsf]|ch|sz|cz)/.test(form) ? 's' : short;
    };
    const nonPast = form => {
      let p = prefix;
      if (spec.np && eVariant) p = p.slice(0, -1);
      if (spec.ce && consonantEnd) p += 'e';
      return p + form;
    };
    return {
      pres: spec.pres.map(nonPast),
      past: spec.past
        ? spec.past.map((form, i) => pastPrefix(form, i) + form)
        : pastRegular(b),
      imp: spec.imp === 'none' ? null : nonPast(spec.imp),
      be: Boolean(spec.be),
      g: spec.g && (spec.g === 'none' ? spec.g : prefix + spec.g),
      pt: spec.pt && (spec.pt === 'none' ? spec.pt : prefix + spec.pt),
    };
  }

  // ---- Conjugation -------------------------------------------------------------------------------

  const BEDE = ['będę', 'będziesz', 'będzie', 'będziemy', 'będziecie', 'będą'];
  const NO_PARTICIPLES = new Set(['musieć']);
  // verbs without an imperative, and verbs that only have 3rd-person forms (boli, zdarzyło się)
  const NO_IMP = words('musieć woleć boleć swędzieć zdarzyć wydarzyć przydarzyć zdarzać wydarzać przydarzać zabraknąć mżyć brakować dotyczyć skutkować wynikać odbywać świerzbić mrowić');
  const THIRD_ONLY = words('boleć swędzieć zdarzyć wydarzyć przydarzyć zdarzać wydarzać przydarzać zabraknąć mżyć brakować dotyczyć skutkować wynikać odbywać świerzbić mrowić');
  // exact infinitives (a tail would also catch nadziać, zapodziać): dziać się = to happen
  const THIRD_EXACT = new Set(['dziać']);

  function conjugate(input, aspect) {
    if (aspect !== 'i' && aspect !== 'p' && aspect !== 'b') return null;
    const pr = parse(input);
    if (!pr) return null;
    const perfective = aspect === 'p';
    const b = pr.base;

    const match = findFamily(b, FAM[perfective ? 'p' : 'i']);
    // a verb with an irregular entry for the other aspect only (dać, wejść) is not guessed
    if (!match && findFamily(b, FAMILIES)) return null;
    let core;
    if (match) core = lexicalCore(match, b);
    else {
      const regular = regularCore(b);
      core = regular && { ...regular, past: pastRegular(b), be: false };
    }
    if (!core || core.pres.length !== 6 || core.past.length !== 5) return null;

    if (hasTail(b, NO_IMP) || THIRD_EXACT.has(b)) core.imp = null;
    const R = pr.refl ? w => `${w} się` : w => w;
    const [m, f, n, v, nv] = core.past;
    // before a person ending the masculine loses the ó of mógł, niósł (mogłem, niosłem)
    const plainM = m.replace('ó', 'o');
    const mE = f.slice(0, -1) === plainM ? plainM : m;
    const alts = list => list.map(R).join(' / ');

    const forms = {};
    forms.pres = perfective ? dashes() : core.pres.map(R);
    forms.past = [
      alts([mE + 'em', f + 'm']), alts([mE + 'eś', f + 'ś']), alts([m, f, n]),
      alts([v + 'śmy', nv + 'śmy']), alts([v + 'ście', nv + 'ście']), alts([v, nv]),
    ];
    if (perfective) forms.fut = core.pres.map(R);
    else if (core.be) forms.fut = BEDE.slice();
    else forms.fut = BEDE.map(aux => (pr.refl ? `${aux} się ${b}` : `${aux} ${b}`));
    forms.cond = [
      alts([m + 'bym', f + 'bym']), alts([m + 'byś', f + 'byś']), alts([m + 'by', f + 'by', n + 'by']),
      alts([v + 'byśmy', nv + 'byśmy']), alts([v + 'byście', nv + 'byście']), alts([v + 'by', nv + 'by']),
    ];

    const third = core.be ? BEDE : core.pres; // for niech ...: niech będzie, niech będą
    if (core.imp) {
      const you = core.imp;
      const niech = (form, neg) => `niech ${pr.refl ? 'się ' : ''}${neg ? 'nie ' : ''}${form}`;
      forms.imp = [NONE, R(you), niech(third[2]), R(you + 'my'), R(you + 'cie'), niech(third[5])];
      forms.impNeg = perfective ? dashes() : [
        NONE, R('nie ' + you), niech(third[2], true), R('nie ' + you + 'my'), R('nie ' + you + 'cie'), niech(third[5], true),
      ];
    } else {
      forms.imp = dashes();
      forms.impNeg = dashes();
    }

    let ger = NONE;
    let part = NONE;
    if (perfective) {
      if (last(m) === 'ł') {
        const stem = m.slice(0, -1);
        ger = isV(last(stem)) ? stem + 'wszy' : m + 'szy';
      }
    } else if (!NO_PARTICIPLES.has(b)) {
      const plural = third[5];
      if (last(plural) === 'ą') {
        ger = plural + 'c';
        part = plural + 'cy';
      }
      if (core.g) ger = core.g === 'none' ? NONE : core.g;
      if (core.pt) part = core.pt === 'none' ? NONE : core.pt;
    }
    forms.ger = Array(6).fill(ger === NONE ? NONE : R(ger));
    forms.part = Array(6).fill(part === NONE ? NONE : R(part));

    if (hasTail(b, THIRD_ONLY) || THIRD_EXACT.has(b)) {
      for (const key of ['pres', 'past', 'fut', 'cond']) forms[key] = forms[key].map((form, i) => (i === 2 || i === 5 ? form : NONE));
    }
    for (const list of Object.values(forms)) {
      if (list.some(form => typeof form !== 'string' || !form || /undefined|null|NaN/.test(form))) return null;
    }
    return { inf: pr.text, aspect, forms };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { conjugate, NONE };
  else global.conjugate = conjugate;
})(typeof window !== 'undefined' ? window : globalThis);
