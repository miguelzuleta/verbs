// Run with: node test.js
// Checks the Polish conjugation engine against known paradigms, then runs every Polish
// verb in verbs.js through it to catch crashes and malformed output.
// Verb keys below read 'mówić:i' (infinitive, a colon, the aspect); a reflexive verb has
// its się: 'myć się:i'.
const { conjugate, NONE } = require('./conjugate.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const FORM_KEYS = ['pres', 'past', 'fut', 'cond', 'imp', 'impNeg', 'ger', 'part'];
const dashes = Array(6).fill(NONE).join(', ');
const S = text => text.split(' ').join(', '); // 'a b c' -> 'a, b, c'
const BEDE = ['będę', 'będziesz', 'będzie', 'będziemy', 'będziecie', 'będą'];

// P({...}) describes a whole paradigm from its principal parts; the eight tenses are then
// written out by hand-made rules here (not taken from the engine):
//   pres  six present forms (imperfective)         fut   six simple-future forms (perfective)
//   past  masculine feminine neuter virile-plural nonvirile-plural (five words)
//   pm    the masculine before a person ending when it differs (mógł -> mogł: mogłem)
//   imp   the ty imperative, or null for "no imperative"; third: 3rd sg and pl for niech ...
//   ger / part  one string, or undefined to skip the check
// A reflexive verb's forms are given WITHOUT się; the rules here place it.
const P = spec => ({ whole: true, ...spec });

function expand(key, spec) {
  const [word, aspect] = key.split(':');
  const perfective = aspect === 'p';
  const refl = word.endsWith(' się');
  const inf = refl ? word.slice(0, -4) : word;
  const R = w => (refl ? `${w} się` : w);
  const list = text => text.split(' ');
  const join = items => items.join(', ');
  const alt = items => items.map(R).join(' / ');
  const [m, f, n, v, nv] = list(spec.past);
  const mE = spec.pm || m;
  const six = list(perfective ? spec.fut : spec.pres);
  const out = {};
  out.pres = perfective ? dashes : join(list(spec.pres).map(R));
  out.past = join([
    alt([mE + 'em', f + 'm']), alt([mE + 'eś', f + 'ś']), alt([m, f, n]),
    alt([v + 'śmy', nv + 'śmy']), alt([v + 'ście', nv + 'ście']), alt([v, nv]),
  ]);
  if (perfective) out.fut = join(list(spec.fut).map(R));
  else if (spec.fut) out.fut = join(list(spec.fut));
  else out.fut = join(BEDE.map(a => (refl ? `${a} się ${inf}` : `${a} ${inf}`)));
  out.cond = join([
    alt([m + 'bym', f + 'bym']), alt([m + 'byś', f + 'byś']), alt([m + 'by', f + 'by', n + 'by']),
    alt([v + 'byśmy', nv + 'byśmy']), alt([v + 'byście', nv + 'byście']), alt([v + 'by', nv + 'by']),
  ]);
  if (spec.imp === null) {
    out.imp = dashes;
    out.impNeg = dashes;
  } else {
    const [t3, t6] = spec.third ? list(spec.third) : [six[2], six[5]];
    const niech = (w, neg) => `niech ${refl ? 'się ' : ''}${neg ? 'nie ' : ''}${w}`;
    out.imp = join([NONE, R(spec.imp), niech(t3), R(spec.imp + 'my'), R(spec.imp + 'cie'), niech(t6)]);
    out.impNeg = perfective ? dashes : join([
      NONE, R('nie ' + spec.imp), niech(t3, true), R('nie ' + spec.imp + 'my'), R('nie ' + spec.imp + 'cie'), niech(t6, true),
    ]);
  }
  const same = value => join(Array(6).fill(value === NONE ? NONE : R(value)));
  if (spec.ger !== undefined) out.ger = same(spec.ger);
  if (spec.part !== undefined) out.part = same(spec.part);
  return out;
}

const report = createReport();

// verb:aspect -> paradigm. P(...) paradigms are checked in all eight tenses; plain objects
// list only the tenses worth checking (six forms joined by ", ").
const EXPECTED = {
  // ---- the irregular verbs in full ----
  'być:i': P({ pres: 'jestem jesteś jest jesteśmy jesteście są', fut: 'będę będziesz będzie będziemy będziecie będą', past: 'był była było byli były', imp: 'bądź', third: 'będzie będą', ger: 'będąc', part: 'będący' }),
  'mieć:i': P({ pres: 'mam masz ma mamy macie mają', past: 'miał miała miało mieli miały', imp: 'miej', ger: 'mając', part: 'mający' }),
  'jeść:i': P({ pres: 'jem jesz je jemy jecie jedzą', past: 'jadł jadła jadło jedli jadły', imp: 'jedz', ger: 'jedząc', part: 'jedzący' }),
  'wiedzieć:i': P({ pres: 'wiem wiesz wie wiemy wiecie wiedzą', past: 'wiedział wiedziała wiedziało wiedzieli wiedziały', imp: 'wiedz', ger: 'wiedząc', part: 'wiedzący' }),
  'chcieć:i': P({ pres: 'chcę chcesz chce chcemy chcecie chcą', past: 'chciał chciała chciało chcieli chciały', imp: 'chciej', ger: 'chcąc', part: 'chcący' }),
  'móc:i': P({ pres: 'mogę możesz może możemy możecie mogą', past: 'mógł mogła mogło mogli mogły', pm: 'mogł', imp: null, ger: 'mogąc', part: 'mogący' }),
  'jechać:i': P({ pres: 'jadę jedziesz jedzie jedziemy jedziecie jadą', past: 'jechał jechała jechało jechali jechały', imp: 'jedź', ger: 'jadąc', part: 'jadący' }),
  'iść:i': P({ pres: 'idę idziesz idzie idziemy idziecie idą', past: 'szedł szła szło szli szły', imp: 'idź', ger: 'idąc', part: 'idący' }),
  'brać:i': P({ pres: 'biorę bierzesz bierze bierzemy bierzecie biorą', past: 'brał brała brało brali brały', imp: 'bierz', ger: 'biorąc', part: 'biorący' }),
  'wziąć:p': P({ fut: 'wezmę weźmiesz weźmie weźmiemy weźmiecie wezmą', past: 'wziął wzięła wzięło wzięli wzięły', imp: 'weź', ger: 'wziąwszy', part: NONE }),
  'dać:p': P({ fut: 'dam dasz da damy dacie dadzą', past: 'dał dała dało dali dały', imp: 'daj', ger: 'dawszy', part: NONE }),
  'spać:i': P({ pres: 'śpię śpisz śpi śpimy śpicie śpią', past: 'spał spała spało spali spały', imp: 'śpij', ger: 'śpiąc', part: 'śpiący' }),
  'stać:i': P({ pres: 'stoję stoisz stoi stoimy stoicie stoją', past: 'stał stała stało stali stały', imp: 'stój', ger: 'stojąc', part: 'stojący' }),
  'pić:i': P({ pres: 'piję pijesz pije pijemy pijecie piją', past: 'pił piła piło pili piły', imp: 'pij', ger: 'pijąc', part: 'pijący' }),
  'żyć:i': P({ pres: 'żyję żyjesz żyje żyjemy żyjecie żyją', past: 'żył żyła żyło żyli żyły', imp: 'żyj', ger: 'żyjąc', part: 'żyjący' }),
  // ---- regular verbs and the common patterns ----
  'mówić:i': P({ pres: 'mówię mówisz mówi mówimy mówicie mówią', past: 'mówił mówiła mówiło mówili mówiły', imp: 'mów', ger: 'mówiąc', part: 'mówiący' }),
  'powiedzieć:p': P({ fut: 'powiem powiesz powie powiemy powiecie powiedzą', past: 'powiedział powiedziała powiedziało powiedzieli powiedziały', imp: 'powiedz', ger: 'powiedziawszy', part: NONE }),
  'robić:i': P({ pres: 'robię robisz robi robimy robicie robią', past: 'robił robiła robiło robili robiły', imp: 'rób', ger: 'robiąc', part: 'robiący' }),
  'zrobić:p': P({ fut: 'zrobię zrobisz zrobi zrobimy zrobicie zrobią', past: 'zrobił zrobiła zrobiło zrobili zrobiły', imp: 'zrób', ger: 'zrobiwszy', part: NONE }),
  'pisać:i': P({ pres: 'piszę piszesz pisze piszemy piszecie piszą', past: 'pisał pisała pisało pisali pisały', imp: 'pisz', ger: 'pisząc', part: 'piszący' }),
  'napisać:p': P({ fut: 'napiszę napiszesz napisze napiszemy napiszecie napiszą', past: 'napisał napisała napisało napisali napisały', imp: 'napisz', ger: 'napisawszy', part: NONE }),
  'czytać:i': P({ pres: 'czytam czytasz czyta czytamy czytacie czytają', past: 'czytał czytała czytało czytali czytały', imp: 'czytaj', ger: 'czytając', part: 'czytający' }),
  'przeczytać:p': P({ fut: 'przeczytam przeczytasz przeczyta przeczytamy przeczytacie przeczytają', past: 'przeczytał przeczytała przeczytało przeczytali przeczytały', imp: 'przeczytaj', ger: 'przeczytawszy', part: NONE }),
  'kupować:i': P({ pres: 'kupuję kupujesz kupuje kupujemy kupujecie kupują', past: 'kupował kupowała kupowało kupowali kupowały', imp: 'kupuj', ger: 'kupując', part: 'kupujący' }),
  'kupić:p': P({ fut: 'kupię kupisz kupi kupimy kupicie kupią', past: 'kupił kupiła kupiło kupili kupiły', imp: 'kup', ger: 'kupiwszy', part: NONE }),
  'pokazywać:i': P({ pres: 'pokazuję pokazujesz pokazuje pokazujemy pokazujecie pokazują', past: 'pokazywał pokazywała pokazywało pokazywali pokazywały', imp: 'pokazuj', ger: 'pokazując', part: 'pokazujący' }),
  'pokazać:p': P({ fut: 'pokażę pokażesz pokaże pokażemy pokażecie pokażą', past: 'pokazał pokazała pokazało pokazali pokazały', imp: 'pokaż', ger: 'pokazawszy', part: NONE }),
  'myśleć:i': P({ pres: 'myślę myślisz myśli myślimy myślicie myślą', past: 'myślał myślała myślało myśleli myślały', imp: 'myśl', ger: 'myśląc', part: 'myślący' }),
  'widzieć:i': P({ pres: 'widzę widzisz widzi widzimy widzicie widzą', past: 'widział widziała widziało widzieli widziały', imp: 'widź', ger: 'widząc', part: 'widzący' }),
  'rozumieć:i': P({ pres: 'rozumiem rozumiesz rozumie rozumiemy rozumiecie rozumieją', past: 'rozumiał rozumiała rozumiało rozumieli rozumiały', imp: 'rozumiej', ger: 'rozumiejąc', part: 'rozumiejący' }),
  'płakać:i': P({ pres: 'płaczę płaczesz płacze płaczemy płaczecie płaczą', past: 'płakał płakała płakało płakali płakały', imp: 'płacz', ger: 'płacząc', part: 'płaczący' }),
  'myć się:i': P({ pres: 'myję myjesz myje myjemy myjecie myją', past: 'mył myła myło myli myły', imp: 'myj', ger: 'myjąc', part: 'myjący' }),
  'bać się:i': P({ pres: 'boję boisz boi boimy boicie boją', past: 'bał bała bało bali bały', imp: 'bój', ger: 'bojąc', part: 'bojący' }),
  'śmiać się:i': P({ pres: 'śmieję śmiejesz śmieje śmiejemy śmiejecie śmieją', past: 'śmiał śmiała śmiało śmiali śmiały', imp: 'śmiej', ger: 'śmiejąc', part: 'śmiejący' }),
  'uczyć się:i': P({ pres: 'uczę uczysz uczy uczymy uczycie uczą', past: 'uczył uczyła uczyło uczyli uczyły', imp: 'ucz', ger: 'ucząc', part: 'uczący' }),
  // ---- prefix families of the irregular verbs ----
  'pójść:p': P({ fut: 'pójdę pójdziesz pójdzie pójdziemy pójdziecie pójdą', past: 'poszedł poszła poszło poszli poszły', imp: 'pójdź', ger: 'poszedłszy', part: NONE }),
  'przyjść:p': P({ fut: 'przyjdę przyjdziesz przyjdzie przyjdziemy przyjdziecie przyjdą', past: 'przyszedł przyszła przyszło przyszli przyszły', imp: 'przyjdź', ger: 'przyszedłszy', part: NONE }),
  'wyjść:p': P({ fut: 'wyjdę wyjdziesz wyjdzie wyjdziemy wyjdziecie wyjdą', past: 'wyszedł wyszła wyszło wyszli wyszły', imp: 'wyjdź', ger: 'wyszedłszy', part: NONE }),
  'wejść:p': P({ fut: 'wejdę wejdziesz wejdzie wejdziemy wejdziecie wejdą', past: 'wszedł weszła weszło weszli weszły', imp: 'wejdź', ger: 'wszedłszy', part: NONE }),
  'zajść:p': { fut: S('zajdę zajdziesz zajdzie zajdziemy zajdziecie zajdą'), past: 'zaszedłem / zaszłam, zaszedłeś / zaszłaś, zaszedł / zaszła / zaszło, zaszliśmy / zaszłyśmy, zaszliście / zaszłyście, zaszli / zaszły' },
  'dojść:p': { fut: S('dojdę dojdziesz dojdzie dojdziemy dojdziecie dojdą'), imp: `${NONE}, dojdź, niech dojdzie, dojdźmy, dojdźcie, niech dojdą` },
  'odejść:p': P({ fut: 'odejdę odejdziesz odejdzie odejdziemy odejdziecie odejdą', past: 'odszedł odeszła odeszło odeszli odeszły', imp: 'odejdź', ger: 'odszedłszy', part: NONE }),
  'zejść:p': { fut: S('zejdę zejdziesz zejdzie zejdziemy zejdziecie zejdą'), past: 'zszedłem / zeszłam, zszedłeś / zeszłaś, zszedł / zeszła / zeszło, zeszliśmy / zeszłyśmy, zeszliście / zeszłyście, zeszli / zeszły' },
  'przejść:p': { fut: S('przejdę przejdziesz przejdzie przejdziemy przejdziecie przejdą'), past: 'przeszedłem / przeszłam, przeszedłeś / przeszłaś, przeszedł / przeszła / przeszło, przeszliśmy / przeszłyśmy, przeszliście / przeszłyście, przeszli / przeszły' },
  'pojechać:p': P({ fut: 'pojadę pojedziesz pojedzie pojedziemy pojedziecie pojadą', past: 'pojechał pojechała pojechało pojechali pojechały', imp: 'pojedź', ger: 'pojechawszy', part: NONE }),
  'przyjechać:p': P({ fut: 'przyjadę przyjedziesz przyjedzie przyjedziemy przyjedziecie przyjadą', past: 'przyjechał przyjechała przyjechało przyjechali przyjechały', imp: 'przyjedź', ger: 'przyjechawszy', part: NONE }),
  'jeździć:i': { pres: S('jeżdżę jeździsz jeździ jeździmy jeździcie jeżdżą'), imp: `${NONE}, jeźdź, niech jeździ, jeźdźmy, jeźdźcie, niech jeżdżą` },
  'nieść:i': P({ pres: 'niosę niesiesz niesie niesiemy niesiecie niosą', past: 'niósł niosła niosło nieśli niosły', pm: 'niosł', imp: 'nieś', ger: 'niosąc', part: 'niosący' }),
  'przynieść:p': P({ fut: 'przyniosę przyniesiesz przyniesie przyniesiemy przyniesiecie przyniosą', past: 'przyniósł przyniosła przyniosło przynieśli przyniosły', pm: 'przyniosł', imp: 'przynieś', ger: 'przyniósłszy', part: NONE }),
  'wieźć:i': P({ pres: 'wiozę wieziesz wiezie wieziemy wieziecie wiozą', past: 'wiózł wiozła wiozło wieźli wiozły', pm: 'wiozł', imp: 'wieź', ger: 'wioząc', part: 'wiozący' }),
  'pomóc:p': P({ fut: 'pomogę pomożesz pomoże pomożemy pomożecie pomogą', past: 'pomógł pomogła pomogło pomogli pomogły', pm: 'pomogł', imp: 'pomóż', ger: 'pomógłszy', part: NONE }),
  'zjeść:p': P({ fut: 'zjem zjesz zje zjemy zjecie zjedzą', past: 'zjadł zjadła zjadło zjedli zjadły', imp: 'zjedz', ger: 'zjadłszy', part: NONE }),
  'zacząć:p': P({ fut: 'zacznę zaczniesz zacznie zaczniemy zaczniecie zaczną', past: 'zaczął zaczęła zaczęło zaczęli zaczęły', imp: 'zacznij', ger: 'zacząwszy', part: NONE }),
  'zająć:p': P({ fut: 'zajmę zajmiesz zajmie zajmiemy zajmiecie zajmą', past: 'zajął zajęła zajęło zajęli zajęły', imp: 'zajmij', ger: 'zająwszy', part: NONE }),
  'przyjąć:p': P({ fut: 'przyjmę przyjmiesz przyjmie przyjmiemy przyjmiecie przyjmą', past: 'przyjął przyjęła przyjęło przyjęli przyjęły', imp: 'przyjmij', ger: 'przyjąwszy', part: NONE }),
  'objąć:p': { fut: S('obejmę obejmiesz obejmie obejmiemy obejmiecie obejmą'), imp: `${NONE}, obejmij, niech obejmie, obejmijmy, obejmijcie, niech obejmą` },
  'ciąć:i': P({ pres: 'tnę tniesz tnie tniemy tniecie tną', past: 'ciął cięła cięło cięli cięły', imp: 'tnij', ger: 'tnąc', part: 'tnący' }),
  'wyciąć:p': P({ fut: 'wytnę wytniesz wytnie wytniemy wytniecie wytną', past: 'wyciął wycięła wycięło wycięli wycięły', imp: 'wytnij', ger: 'wyciąwszy', part: NONE }),
  'rozciąć:p': { fut: S('rozetnę rozetniesz rozetnie rozetniemy rozetniecie rozetną'), imp: `${NONE}, rozetnij, niech rozetnie, rozetnijmy, rozetnijcie, niech rozetną` },
  'stanąć:p': P({ fut: 'stanę staniesz stanie staniemy staniecie staną', past: 'stanął stanęła stanęło stanęli stanęły', imp: 'stań', ger: 'stanąwszy', part: NONE }),
  'zostać:p': P({ fut: 'zostanę zostaniesz zostanie zostaniemy zostaniecie zostaną', past: 'został została zostało zostali zostały', imp: 'zostań', ger: 'zostawszy', part: NONE }),
  'wstać:p': P({ fut: 'wstanę wstaniesz wstanie wstaniemy wstaniecie wstaną', past: 'wstał wstała wstało wstali wstały', imp: 'wstań', ger: 'wstawszy', part: NONE }),
  'dostać:p': { fut: S('dostanę dostaniesz dostanie dostaniemy dostaniecie dostaną'), imp: `${NONE}, dostań, niech dostanie, dostańmy, dostańcie, niech dostaną` },
  'przestać:p': { fut: S('przestanę przestaniesz przestanie przestaniemy przestaniecie przestaną'), imp: `${NONE}, przestań, niech przestanie, przestańmy, przestańcie, niech przestaną` },
  'stać się:p': P({ fut: 'stanę staniesz stanie staniemy staniecie staną', past: 'stał stała stało stali stały', imp: 'stań', ger: 'stawszy', part: NONE }),
  'znaleźć:p': P({ fut: 'znajdę znajdziesz znajdzie znajdziemy znajdziecie znajdą', past: 'znalazł znalazła znalazło znaleźli znalazły', imp: 'znajdź', ger: 'znalazłszy', part: NONE }),
  'umrzeć:p': P({ fut: 'umrę umrzesz umrze umrzemy umrzecie umrą', past: 'umarł umarła umarło umarli umarły', imp: 'umrzyj', ger: 'umarłszy', part: NONE }),
  'rosnąć:i': P({ pres: 'rosnę rośniesz rośnie rośniemy rośniecie rosną', past: 'rósł rosła rosło rośli rosły', pm: 'rosł', imp: 'rośnij', ger: 'rosnąc', part: 'rosnący' }),
  'wrócić:p': P({ fut: 'wrócę wrócisz wróci wrócimy wrócicie wrócą', past: 'wrócił wróciła wróciło wrócili wróciły', imp: 'wróć', ger: 'wróciwszy', part: NONE }),
  'wziąć się:p': { fut: 'wezmę się, weźmiesz się, weźmie się, weźmiemy się, weźmiecie się, wezmą się', imp: `${NONE}, weź się, niech się weźmie, weźmy się, weźcie się, niech się wezmą` },
  'sprzedać:p': P({ fut: 'sprzedam sprzedasz sprzeda sprzedamy sprzedacie sprzedadzą', past: 'sprzedał sprzedała sprzedało sprzedali sprzedały', imp: 'sprzedaj', ger: 'sprzedawszy', part: NONE }),
  'oddać:p': { fut: S('oddam oddasz odda oddamy oddacie oddadzą'), imp: `${NONE}, oddaj, niech odda, oddajmy, oddajcie, niech oddadzą` },
  'dawać:i': P({ pres: 'daję dajesz daje dajemy dajecie dają', past: 'dawał dawała dawało dawali dawały', imp: 'dawaj', ger: 'dając', part: 'dający' }),
  'wstawać:i': P({ pres: 'wstaję wstajesz wstaje wstajemy wstajecie wstają', past: 'wstawał wstawała wstawało wstawali wstawały', imp: 'wstawaj', ger: 'wstając', part: 'wstający' }),
  'rozpoznawać:i': { pres: S('rozpoznaję rozpoznajesz rozpoznaje rozpoznajemy rozpoznajecie rozpoznają') },
  'zawieść:p': P({ fut: 'zawiodę zawiedziesz zawiedzie zawiedziemy zawiedziecie zawiodą', past: 'zawiódł zawiodła zawiodło zawiedli zawiodły', pm: 'zawiodł', imp: 'zawiedź', ger: 'zawiódłszy', part: NONE }),
  // ---- -ać with a stem change, -ować / -ywać / -iwać, and the -am verbs that look like them ----
  'kazać:p': P({ fut: 'każę każesz każe każemy każecie każą', past: 'kazał kazała kazało kazali kazały', imp: 'każ', ger: 'kazawszy', part: NONE }),
  'wiązać:i': P({ pres: 'wiążę wiążesz wiąże wiążemy wiążecie wiążą', past: 'wiązał wiązała wiązało wiązali wiązały', imp: 'wiąż', ger: 'wiążąc', part: 'wiążący' }),
  'łamać:i': P({ pres: 'łamię łamiesz łamie łamiemy łamiecie łamią', past: 'łamał łamała łamało łamali łamały', imp: 'łam', ger: 'łamiąc', part: 'łamiący' }),
  'złamać:p': { fut: S('złamię złamiesz złamie złamiemy złamiecie złamią'), imp: `${NONE}, złam, niech złamie, złammy, złamcie, niech złamią` },
  'kopać:i': { pres: S('kopię kopiesz kopie kopiemy kopiecie kopią'), imp: `${NONE}, kop, niech kopie, kopmy, kopcie, niech kopią` },
  'łapać:i': { pres: S('łapię łapiesz łapie łapiemy łapiecie łapią'), imp: `${NONE}, łap, niech łapie, łapmy, łapcie, niech łapią` },
  'szeptać:i': { pres: S('szepczę szepczesz szepcze szepczemy szepczecie szepczą'), imp: `${NONE}, szepcz, niech szepcze, szepczmy, szepczcie, niech szepczą` },
  'skakać:i': { pres: S('skaczę skaczesz skacze skaczemy skaczecie skaczą'), imp: `${NONE}, skacz, niech skacze, skaczmy, skaczcie, niech skaczą` },
  'prać:i': { pres: S('piorę pierzesz pierze pierzemy pierzecie piorą'), imp: `${NONE}, pierz, niech pierze, pierzmy, pierzcie, niech piorą` },
  'wyprać:p': { fut: S('wypiorę wypierzesz wypierze wypierzemy wypierzecie wypiorą'), ger: S('wyprawszy wyprawszy wyprawszy wyprawszy wyprawszy wyprawszy') },
  'drzeć:i': { pres: S('drę drzesz drze drzemy drzecie drą'), past: 'darłem / darłam, darłeś / darłaś, darł / darła / darło, darliśmy / darłyśmy, darliście / darłyście, darli / darły', imp: `${NONE}, drzyj, niech drze, drzyjmy, drzyjcie, niech drą` },
  'wytrzeć:p': P({ fut: 'wytrę wytrzesz wytrze wytrzemy wytrzecie wytrą', past: 'wytarł wytarła wytarło wytarli wytarły', imp: 'wytrzyj', ger: 'wytarłszy', part: NONE }),
  'trząść:i': { pres: S('trzęsę trzęsiesz trzęsie trzęsiemy trzęsiecie trzęsą'), past: 'trząsłem / trzęsłam, trząsłeś / trzęsłaś, trząsł / trzęsła / trzęsło, trzęśliśmy / trzęsłyśmy, trzęśliście / trzęsłyście, trzęśli / trzęsły', imp: `${NONE}, trzęś, niech trzęsie, trzęśmy, trzęście, niech trzęsą` },
  'gryźć:i': P({ pres: 'gryzę gryziesz gryzie gryziemy gryziecie gryzą', past: 'gryzł gryzła gryzło gryźli gryzły', imp: 'gryź', ger: 'gryząc', part: 'gryzący' }),
  'ostrzec:p': P({ fut: 'ostrzegę ostrzeżesz ostrzeże ostrzeżemy ostrzeżecie ostrzegą', past: 'ostrzegł ostrzegła ostrzegło ostrzegli ostrzegły', imp: 'ostrzeż', ger: 'ostrzegłszy', part: NONE }),
  'biec:i': P({ pres: 'biegnę biegniesz biegnie biegniemy biegniecie biegną', past: 'biegł biegła biegło biegli biegły', imp: 'biegnij', ger: 'biegnąc', part: 'biegnący' }),
  'pobiec:p': { fut: S('pobiegnę pobiegniesz pobiegnie pobiegniemy pobiegniecie pobiegną'), imp: `${NONE}, pobiegnij, niech pobiegnie, pobiegnijmy, pobiegnijcie, niech pobiegną` },
  'kraść:i': { pres: S('kradnę kradniesz kradnie kradniemy kradniecie kradną'), past: 'kradłem / kradłam, kradłeś / kradłaś, kradł / kradła / kradło, kradliśmy / kradłyśmy, kradliście / kradłyście, kradli / kradły' },
  'ukraść:p': { fut: S('ukradnę ukradniesz ukradnie ukradniemy ukradniecie ukradną'), imp: `${NONE}, ukradnij, niech ukradnie, ukradnijmy, ukradnijcie, niech ukradną` },
  'kłaść:i': P({ pres: 'kładę kładziesz kładzie kładziemy kładziecie kładą', past: 'kładł kładła kładło kładli kładły', imp: 'kładź', ger: 'kładąc', part: 'kładący' }),
  'upaść:p': P({ fut: 'upadnę upadniesz upadnie upadniemy upadniecie upadną', past: 'upadł upadła upadło upadli upadły', imp: 'upadnij', ger: 'upadłszy', part: NONE }),
  'usiąść:p': P({ fut: 'usiądę usiądziesz usiądzie usiądziemy usiądziecie usiądą', past: 'usiadł usiadła usiadło usiedli usiadły', imp: 'usiądź', ger: 'usiadłszy', part: NONE }),
  'wysłać:p': P({ fut: 'wyślę wyślesz wyśle wyślemy wyślecie wyślą', past: 'wysłał wysłała wysłało wysłali wysłały', imp: 'wyślij', ger: 'wysławszy', part: NONE }),
  'zerwać:p': P({ fut: 'zerwę zerwiesz zerwie zerwiemy zerwiecie zerwą', past: 'zerwał zerwała zerwało zerwali zerwały', imp: 'zerwij', ger: 'zerwawszy', part: NONE }),
  'nazwać:p': { fut: S('nazwę nazwiesz nazwie nazwiemy nazwiecie nazwą'), imp: `${NONE}, nazwij, niech nazwie, nazwijmy, nazwijcie, niech nazwą` },
  'wezwać:p': { fut: S('wezwę wezwiesz wezwie wezwiemy wezwiecie wezwą'), imp: `${NONE}, wezwij, niech wezwie, wezwijmy, wezwijcie, niech wezwą` },
  'wybrać:p': P({ fut: 'wybiorę wybierzesz wybierze wybierzemy wybierzecie wybiorą', past: 'wybrał wybrała wybrało wybrali wybrały', imp: 'wybierz', ger: 'wybrawszy', part: NONE }),
  'zebrać:p': { fut: S('zbiorę zbierzesz zbierze zbierzemy zbierzecie zbiorą'), past: 'zebrałem / zebrałam, zebrałeś / zebrałaś, zebrał / zebrała / zebrało, zebraliśmy / zebrałyśmy, zebraliście / zebrałyście, zebrali / zebrały', imp: `${NONE}, zbierz, niech zbierze, zbierzmy, zbierzcie, niech zbiorą` },
  'odebrać:p': { fut: S('odbiorę odbierzesz odbierze odbierzemy odbierzecie odbiorą'), imp: `${NONE}, odbierz, niech odbierze, odbierzmy, odbierzcie, niech odbiorą` },
  'wypić:p': P({ fut: 'wypiję wypijesz wypije wypijemy wypijecie wypiją', past: 'wypił wypiła wypiło wypili wypiły', imp: 'wypij', ger: 'wypiwszy', part: NONE }),
  'zabić:p': { fut: S('zabiję zabijesz zabije zabijemy zabijecie zabiją'), imp: `${NONE}, zabij, niech zabije, zabijmy, zabijcie, niech zabiją` },
  'umyć się:p': P({ fut: 'umyję umyjesz umyje umyjemy umyjecie umyją', past: 'umył umyła umyło umyli umyły', imp: 'umyj', ger: 'umywszy', part: NONE }),
  'nalać:p': { fut: S('naleję nalejesz naleje nalejemy nalejecie naleją'), imp: `${NONE}, nalej, niech naleje, nalejmy, nalejcie, niech naleją` },
  'przeżyć:p': { fut: S('przeżyję przeżyjesz przeżyje przeżyjemy przeżyjecie przeżyją'), imp: `${NONE}, przeżyj, niech przeżyje, przeżyjmy, przeżyjcie, niech przeżyją` },
  'ukryć:p': { fut: S('ukryję ukryjesz ukryje ukryjemy ukryjecie ukryją'), imp: `${NONE}, ukryj, niech ukryje, ukryjmy, ukryjcie, niech ukryją` },
  'zdobyć:p': P({ fut: 'zdobędę zdobędziesz zdobędzie zdobędziemy zdobędziecie zdobędą', past: 'zdobył zdobyła zdobyło zdobyli zdobyły', imp: 'zdobądź', ger: 'zdobywszy', part: NONE }),
  'czuć:i': P({ pres: 'czuję czujesz czuje czujemy czujecie czują', past: 'czuł czuła czuło czuli czuły', imp: 'czuj', ger: 'czując', part: 'czujący' }),
  'poczuć:p': { fut: S('poczuję poczujesz poczuje poczujemy poczujecie poczują'), imp: `${NONE}, poczuj, niech poczuje, poczujmy, poczujcie, niech poczują` },
  'znać:i': P({ pres: 'znam znasz zna znamy znacie znają', past: 'znał znała znało znali znały', imp: 'znaj', ger: 'znając', part: 'znający' }),
  'poznać:p': { fut: S('poznam poznasz pozna poznamy poznacie poznają'), imp: `${NONE}, poznaj, niech pozna, poznajmy, poznajcie, niech poznają` },
  'grać:i': { pres: S('gram grasz gra gramy gracie grają'), imp: `${NONE}, graj, niech gra, grajmy, grajcie, niech grają` },
  'ukrywać:i': { pres: S('ukrywam ukrywasz ukrywa ukrywamy ukrywacie ukrywają'), imp: `${NONE}, ukrywaj, niech ukrywa, ukrywajmy, ukrywajcie, niech ukrywają` },
  'używać:i': { pres: S('używam używasz używa używamy używacie używają') },
  'nazywać się:i': { pres: 'nazywam się, nazywasz się, nazywa się, nazywamy się, nazywacie się, nazywają się', imp: `${NONE}, nazywaj się, niech się nazywa, nazywajmy się, nazywajcie się, niech się nazywają` },
  'wygrywać:i': { pres: S('wygrywam wygrywasz wygrywa wygrywamy wygrywacie wygrywają') },
  'zapisywać:i': { pres: S('zapisuję zapisujesz zapisuje zapisujemy zapisujecie zapisują'), imp: `${NONE}, zapisuj, niech zapisuje, zapisujmy, zapisujcie, niech zapisują` },
  'wypytywać:i': { pres: S('wypytuję wypytujesz wypytuje wypytujemy wypytujecie wypytują') },
  'odpoczywać:i': { pres: S('odpoczywam odpoczywasz odpoczywa odpoczywamy odpoczywacie odpoczywają') },
  'zachowywać:i': { pres: S('zachowuję zachowujesz zachowuje zachowujemy zachowujecie zachowują') },
  'schować:p': { fut: S('schowam schowasz schowa schowamy schowacie schowają'), imp: `${NONE}, schowaj, niech schowa, schowajmy, schowajcie, niech schowają` },
  'dziękować:i': { pres: S('dziękuję dziękujesz dziękuje dziękujemy dziękujecie dziękują') },
  'kontynuować:i': { pres: S('kontynuuję kontynuujesz kontynuuje kontynuujemy kontynuujecie kontynuują') },
  'pracować:i': P({ pres: 'pracuję pracujesz pracuje pracujemy pracujecie pracują', past: 'pracował pracowała pracowało pracowali pracowały', imp: 'pracuj', ger: 'pracując', part: 'pracujący' }),
  'zbudować:p': { fut: S('zbuduję zbudujesz zbuduje zbudujemy zbudujecie zbudują'), imp: `${NONE}, zbuduj, niech zbuduje, zbudujmy, zbudujcie, niech zbudują` },
  'pływać:i': { pres: S('pływam pływasz pływa pływamy pływacie pływają') },
  // ---- -nąć, -eć and -ić / -yć verbs: stems, consonant changes, imperatives ----
  'ciągnąć:i': P({ pres: 'ciągnę ciągniesz ciągnie ciągniemy ciągniecie ciągną', past: 'ciągnął ciągnęła ciągnęło ciągnęli ciągnęły', imp: 'ciągnij', ger: 'ciągnąc', part: 'ciągnący' }),
  'minąć:p': P({ fut: 'minę miniesz minie miniemy miniecie miną', past: 'minął minęła minęło minęli minęły', imp: 'miń', ger: 'minąwszy', part: NONE }),
  'zniknąć:p': P({ fut: 'zniknę znikniesz zniknie znikniemy znikniecie znikną', past: 'zniknął zniknęła zniknęło zniknęli zniknęły', imp: 'zniknij', ger: 'zniknąwszy', part: NONE }),
  'zamknąć:p': P({ fut: 'zamknę zamkniesz zamknie zamkniemy zamkniecie zamkną', past: 'zamknął zamknęła zamknęło zamknęli zamknęły', imp: 'zamknij', ger: 'zamknąwszy', part: NONE }),
  'zasnąć:p': P({ fut: 'zasnę zaśniesz zaśnie zaśniemy zaśniecie zasną', past: 'zasnął zasnęła zasnęło zasnęli zasnęły', imp: 'zaśnij', ger: 'zasnąwszy', part: NONE }),
  'płynąć:i': P({ pres: 'płynę płyniesz płynie płyniemy płyniecie płyną', past: 'płynął płynęła płynęło płynęli płynęły', imp: 'płyń', ger: 'płynąc', part: 'płynący' }),
  'usunąć:p': { fut: S('usunę usuniesz usunie usuniemy usuniecie usuną'), imp: `${NONE}, usuń, niech usunie, usuńmy, usuńcie, niech usuną` },
  'krzyknąć:p': P({ fut: 'krzyknę krzykniesz krzyknie krzykniemy krzykniecie krzykną', past: 'krzyknął krzyknęła krzyknęło krzyknęli krzyknęły', imp: 'krzyknij', ger: 'krzyknąwszy', part: NONE }),
  'dotknąć:p': { fut: S('dotknę dotkniesz dotknie dotkniemy dotkniecie dotkną'), imp: `${NONE}, dotknij, niech dotknie, dotknijmy, dotknijcie, niech dotkną` },
  'zgasnąć:p': P({ fut: 'zgasnę zgaśniesz zgaśnie zgaśniemy zgaśniecie zgasną', past: 'zgasł zgasła zgasło zgasli zgasły', imp: 'zgaśnij', ger: 'zgasłszy', part: NONE }),
  'schudnąć:p': { fut: S('schudnę schudniesz schudnie schudniemy schudniecie schudną'), past: 'schudłem / schudłam, schudłeś / schudłaś, schudł / schudła / schudło, schudliśmy / schudłyśmy, schudliście / schudłyście, schudli / schudły' },
  'zmarznąć:p': { past: 'zmarzłem / zmarzłam, zmarzłeś / zmarzłaś, zmarzł / zmarzła / zmarzło, zmarzliśmy / zmarzłyśmy, zmarzliście / zmarzłyście, zmarzli / zmarzły' },
  'pomyśleć:p': P({ fut: 'pomyślę pomyślisz pomyśli pomyślimy pomyślicie pomyślą', past: 'pomyślał pomyślała pomyślało pomyśleli pomyślały', imp: 'pomyśl', ger: 'pomyślawszy', part: NONE }),
  'usłyszeć:p': P({ fut: 'usłyszę usłyszysz usłyszy usłyszymy usłyszycie usłyszą', past: 'usłyszał usłyszała usłyszało usłyszeli usłyszały', imp: 'usłysz', ger: 'usłyszawszy', part: NONE }),
  'zobaczyć:p': P({ fut: 'zobaczę zobaczysz zobaczy zobaczymy zobaczycie zobaczą', past: 'zobaczył zobaczyła zobaczyło zobaczyli zobaczyły', imp: 'zobacz', ger: 'zobaczywszy', part: NONE }),
  'siedzieć:i': P({ pres: 'siedzę siedzisz siedzi siedzimy siedzicie siedzą', past: 'siedział siedziała siedziało siedzieli siedziały', imp: 'siedź', ger: 'siedząc', part: 'siedzący' }),
  'leżeć:i': P({ pres: 'leżę leżysz leży leżymy leżycie leżą', past: 'leżał leżała leżało leżeli leżały', imp: 'leż', ger: 'leżąc', part: 'leżący' }),
  'słyszeć:i': P({ pres: 'słyszę słyszysz słyszy słyszymy słyszycie słyszą', past: 'słyszał słyszała słyszało słyszeli słyszały', imp: 'słysz', ger: 'słysząc', part: 'słyszący' }),
  'musieć:i': P({ pres: 'muszę musisz musi musimy musicie muszą', past: 'musiał musiała musiało musieli musiały', imp: null, ger: NONE, part: NONE }),
  'umieć:i': P({ pres: 'umiem umiesz umie umiemy umiecie umieją', past: 'umiał umiała umiało umieli umiały', imp: 'umiej', ger: 'umiejąc', part: 'umiejący' }),
  'zrozumieć:p': P({ fut: 'zrozumiem zrozumiesz zrozumie zrozumiemy zrozumiecie zrozumieją', past: 'zrozumiał zrozumiała zrozumiało zrozumieli zrozumiały', imp: 'zrozum', ger: 'zrozumiawszy', part: NONE }),
  'szumieć:i': { pres: S('szumię szumisz szumi szumimy szumicie szumią') },
  'wspomnieć:p': P({ fut: 'wspomnę wspomnisz wspomni wspomnimy wspomnicie wspomną', past: 'wspomniał wspomniała wspomniało wspomnieli wspomniały', imp: 'wspomnij', ger: 'wspomniawszy', part: NONE }),
  'zapomnieć:p': P({ fut: 'zapomnę zapomnisz zapomni zapomnimy zapomnicie zapomną', past: 'zapomniał zapomniała zapomniało zapomnieli zapomniały', imp: 'zapomnij', ger: 'zapomniawszy', part: NONE }),
  'przypomnieć:p': { fut: S('przypomnę przypomnisz przypomni przypomnimy przypomnicie przypomną'), imp: `${NONE}, przypomnij, niech przypomni, przypomnijmy, przypomnijcie, niech przypomną` },
  'spojrzeć:p': P({ fut: 'spojrzę spojrzysz spojrzy spojrzymy spojrzycie spojrzą', past: 'spojrzał spojrzała spojrzało spojrzeli spojrzały', imp: 'spójrz', ger: 'spojrzawszy', part: NONE }),
  'obejrzeć:p': { fut: S('obejrzę obejrzysz obejrzy obejrzymy obejrzycie obejrzą'), imp: `${NONE}, obejrzyj, niech obejrzy, obejrzyjmy, obejrzyjcie, niech obejrzą` },
  'zajrzeć:p': { imp: `${NONE}, zajrzyj, niech zajrzy, zajrzyjmy, zajrzyjcie, niech zajrzą` },
  'lecieć:i': P({ pres: 'lecę lecisz leci lecimy lecicie lecą', past: 'leciał leciała leciało lecieli leciały', imp: 'leć', ger: 'lecąc', part: 'lecący' }),
  'cierpieć:i': { pres: S('cierpię cierpisz cierpi cierpimy cierpicie cierpią'), imp: `${NONE}, cierp, niech cierpi, cierpmy, cierpcie, niech cierpią` },
  'pachnieć:i': P({ pres: 'pachnę pachniesz pachnie pachniemy pachniecie pachną', past: 'pachniał pachniała pachniało pachnieli pachniały', imp: 'pachnij', ger: 'pachnąc', part: 'pachnący' }),
  'tanieć:i': { pres: S('tanieję taniejesz tanieje taniejemy taniejecie tanieją'), past: 'taniałem / taniałam, taniałeś / taniałaś, taniał / taniała / taniało, tanieliśmy / taniałyśmy, tanieliście / taniałyście, tanieli / taniały' },
  'nienawidzić:i': { pres: S('nienawidzę nienawidzisz nienawidzi nienawidzimy nienawidzicie nienawidzą'), imp: `${NONE}, nienawidź, niech nienawidzi, nienawidźmy, nienawidźcie, niech nienawidzą` },
  'nosić:i': P({ pres: 'noszę nosisz nosi nosimy nosicie noszą', past: 'nosił nosiła nosiło nosili nosiły', imp: 'noś', ger: 'nosząc', part: 'noszący' }),
  'prosić:i': P({ pres: 'proszę prosisz prosi prosimy prosicie proszą', past: 'prosił prosiła prosiło prosili prosiły', imp: 'proś', ger: 'prosząc', part: 'proszący' }),
  'wozić:i': { pres: S('wożę wozisz wozi wozimy wozicie wożą'), imp: `${NONE}, woź, niech wozi, woźmy, woźcie, niech wożą` },
  'chodzić:i': P({ pres: 'chodzę chodzisz chodzi chodzimy chodzicie chodzą', past: 'chodził chodziła chodziło chodzili chodziły', imp: 'chodź', ger: 'chodząc', part: 'chodzący' }),
  'prowadzić:i': { pres: S('prowadzę prowadzisz prowadzi prowadzimy prowadzicie prowadzą'), imp: `${NONE}, prowadź, niech prowadzi, prowadźmy, prowadźcie, niech prowadzą` },
  'płacić:i': { pres: S('płacę płacisz płaci płacimy płacicie płacą'), imp: `${NONE}, płać, niech płaci, płaćmy, płaćcie, niech płacą` },
  'rzucić:p': { fut: S('rzucę rzucisz rzuci rzucimy rzucicie rzucą'), imp: `${NONE}, rzuć, niech rzuci, rzućmy, rzućcie, niech rzucą` },
  'puścić:p': { fut: S('puszczę puścisz puści puścimy puścicie puszczą'), imp: `${NONE}, puść, niech puści, puśćmy, puśćcie, niech puszczą` },
  'czyścić:i': { pres: S('czyszczę czyścisz czyści czyścimy czyścicie czyszczą'), imp: `${NONE}, czyść, niech czyści, czyśćmy, czyśćcie, niech czyszczą` },
  'dzwonić:i': { pres: S('dzwonię dzwonisz dzwoni dzwonimy dzwonicie dzwonią'), imp: `${NONE}, dzwoń, niech dzwoni, dzwońmy, dzwońcie, niech dzwonią` },
  'zmienić:p': { fut: S('zmienię zmienisz zmieni zmienimy zmienicie zmienią'), imp: `${NONE}, zmień, niech zmieni, zmieńmy, zmieńcie, niech zmienią` },
  'wyjaśnić:p': { fut: S('wyjaśnię wyjaśnisz wyjaśni wyjaśnimy wyjaśnicie wyjaśnią'), imp: `${NONE}, wyjaśnij, niech wyjaśni, wyjaśnijmy, wyjaśnijcie, niech wyjaśnią` },
  'skończyć:p': P({ fut: 'skończę skończysz skończy skończymy skończycie skończą', past: 'skończył skończyła skończyło skończyli skończyły', imp: 'skończ', ger: 'skończywszy', part: NONE }),
  'tłumaczyć:i': { pres: S('tłumaczę tłumaczysz tłumaczy tłumaczymy tłumaczycie tłumaczą'), imp: `${NONE}, tłumacz, niech tłumaczy, tłumaczmy, tłumaczcie, niech tłumaczą` },
  'zamówić:p': { fut: S('zamówię zamówisz zamówi zamówimy zamówicie zamówią'), imp: `${NONE}, zamów, niech zamówi, zamówmy, zamówcie, niech zamówią` },
  'dziwić się:i': { pres: 'dziwię się, dziwisz się, dziwi się, dziwimy się, dziwicie się, dziwią się', imp: `${NONE}, dziw się, niech się dziwi, dziwmy się, dziwcie się, niech się dziwią` },
  'bawić się:i': { pres: 'bawię się, bawisz się, bawi się, bawimy się, bawicie się, bawią się', imp: `${NONE}, baw się, niech się bawi, bawmy się, bawcie się, niech się bawią` },
  'cieszyć się:i': { pres: 'cieszę się, cieszysz się, cieszy się, cieszymy się, cieszycie się, cieszą się', imp: `${NONE}, ciesz się, niech się cieszy, cieszmy się, cieszcie się, niech się cieszą` },
  'spotkać się:p': P({ fut: 'spotkam spotkasz spotka spotkamy spotkacie spotkają', past: 'spotkał spotkała spotkało spotkali spotkały', imp: 'spotkaj', ger: 'spotkawszy', part: NONE }),
  'położyć się:p': { fut: 'położę się, położysz się, położy się, położymy się, położycie się, położą się', imp: `${NONE}, połóż się, niech się położy, połóżmy się, połóżcie się, niech się położą` },
  'otworzyć:p': P({ fut: 'otworzę otworzysz otworzy otworzymy otworzycie otworzą', past: 'otworzył otworzyła otworzyło otworzyli otworzyły', imp: 'otwórz', ger: 'otworzywszy', part: NONE }),
  'pozwolić:p': { fut: S('pozwolę pozwolisz pozwoli pozwolimy pozwolicie pozwolą'), imp: `${NONE}, pozwól, niech pozwoli, pozwólmy, pozwólcie, niech pozwolą` },
  'zapalić:p': { fut: S('zapalę zapalisz zapali zapalimy zapalicie zapalą'), imp: `${NONE}, zapal, niech zapali, zapalmy, zapalcie, niech zapalą` },
  // ---- from the independent review ----
  'zastanowić się:p': P({ fut: 'zastanowię zastanowisz zastanowi zastanowimy zastanowicie zastanowią', past: 'zastanowił zastanowiła zastanowiło zastanowili zastanowiły', imp: 'zastanów' }),
  'pozdrowić:p': P({ fut: 'pozdrowię pozdrowisz pozdrowi pozdrowimy pozdrowicie pozdrowią', past: 'pozdrowił pozdrowiła pozdrowiło pozdrowili pozdrowiły', imp: 'pozdrów' }),
  'pomnożyć:p': P({ fut: 'pomnożę pomnożysz pomnoży pomnożymy pomnożycie pomnożą', past: 'pomnożył pomnożyła pomnożyło pomnożyli pomnożyły', imp: 'pomnóż' }),
  'wdrożyć:p': P({ fut: 'wdrożę wdrożysz wdroży wdrożymy wdrożycie wdrożą', past: 'wdrożył wdrożyła wdrożyło wdrożyli wdrożyły', imp: 'wdróż' }),
  'odnowić:p': P({ fut: 'odnowię odnowisz odnowi odnowimy odnowicie odnowią', past: 'odnowił odnowiła odnowiło odnowili odnowiły', imp: 'odnów' }),
  'stanowić:i': P({ pres: 'stanowię stanowisz stanowi stanowimy stanowicie stanowią', past: 'stanowił stanowiła stanowiło stanowili stanowiły', imp: 'stanów' }),
  'dojrzeć:p': P({ fut: 'dojrzeję dojrzejesz dojrzeje dojrzejemy dojrzejecie dojrzeją', past: 'dojrzał dojrzała dojrzało dojrzeli dojrzały', imp: 'dojrzej' }),
  'głaskać:i': P({ pres: 'głaszczę głaszczesz głaszcze głaszczemy głaszczecie głaszczą', past: 'głaskał głaskała głaskało głaskali głaskały', imp: 'głaszcz' }),
  'pogłaskać:p': P({ fut: 'pogłaszczę pogłaszczesz pogłaszcze pogłaszczemy pogłaszczecie pogłaszczą', past: 'pogłaskał pogłaskała pogłaskało pogłaskali pogłaskały', imp: 'pogłaszcz' }),
  'tajać:i': P({ pres: 'taję tajesz taje tajemy tajecie tają', past: 'tajał tajała tajało tajali tajały', imp: 'taj' }),
  'brakować:i': { pres: `${NONE}, ${NONE}, brakuje, ${NONE}, ${NONE}, brakują`, imp: dashes },
  'dotyczyć:i': { pres: `${NONE}, ${NONE}, dotyczy, ${NONE}, ${NONE}, dotyczą`, imp: dashes },
  'boleć:i': { pres: `${NONE}, ${NONE}, boli, ${NONE}, ${NONE}, bolą`, imp: dashes },
  'zdarzyć się:p': { fut: `${NONE}, ${NONE}, zdarzy się, ${NONE}, ${NONE}, zdarzą się`, imp: dashes },
  'stawiać:i': { pres: S('stawiam stawiasz stawia stawiamy stawiacie stawiają'), imp: `${NONE}, stawiaj, niech stawia, stawiajmy, stawiajcie, niech stawiają` },
  'postawić:p': { fut: S('postawię postawisz postawi postawimy postawicie postawią'), imp: `${NONE}, postaw, niech postawi, postawmy, postawcie, niech postawią` },
  'zostawić:p': { fut: S('zostawię zostawisz zostawi zostawimy zostawicie zostawią'), imp: `${NONE}, zostaw, niech zostawi, zostawmy, zostawcie, niech zostawią` },
  'pytać:i': { pres: S('pytam pytasz pyta pytamy pytacie pytają'), imp: `${NONE}, pytaj, niech pyta, pytajmy, pytajcie, niech pytają` },
  'zapytać:p': { fut: S('zapytam zapytasz zapyta zapytamy zapytacie zapytają'), imp: `${NONE}, zapytaj, niech zapyta, zapytajmy, zapytajcie, niech zapytają` },
  'ukarać:p': { fut: S('ukarzę ukarzesz ukarze ukarzemy ukarzecie ukarzą'), imp: `${NONE}, ukarz, niech ukarze, ukarzmy, ukarzcie, niech ukarzą` },
  'odpowiedzieć:p': { fut: S('odpowiem odpowiesz odpowie odpowiemy odpowiecie odpowiedzą'), imp: `${NONE}, odpowiedz, niech odpowie, odpowiedzmy, odpowiedzcie, niech odpowiedzą` },
  'dowiedzieć się:p': { fut: 'dowiem się, dowiesz się, dowie się, dowiemy się, dowiecie się, dowiedzą się', imp: `${NONE}, dowiedz się, niech się dowie, dowiedzmy się, dowiedzcie się, niech się dowiedzą` },
  'modlić się:i': { pres: 'modlę się, modlisz się, modli się, modlimy się, modlicie się, modlą się', imp: `${NONE}, módl się, niech się modli, módlmy się, módlcie się, niech się modlą` },
  'powiesić:p': { fut: S('powieszę powiesisz powiesi powiesimy powiesicie powieszą'), imp: `${NONE}, powieś, niech powiesi, powieśmy, powieście, niech powieszą` },
  'smażyć:i': { pres: S('smażę smażysz smaży smażymy smażycie smażą'), imp: `${NONE}, smaż, niech smaży, smażmy, smażcie, niech smażą` },
  'drażnić:i': { pres: S('drażnię drażnisz drażni drażnimy drażnicie drażnią'), imp: `${NONE}, drażnij, niech drażni, drażnijmy, drażnijcie, niech drażnią` },
  'kroić:i': { pres: S('kroję kroisz kroi kroimy kroicie kroją'), imp: `${NONE}, krój, niech kroi, krójmy, krójcie, niech kroją` },
  'pragnąć:i': { pres: S('pragnę pragniesz pragnie pragniemy pragniecie pragną'), imp: `${NONE}, pragnij, niech pragnie, pragnijmy, pragnijcie, niech pragną` },
  // ---- the j-verbs (bić, szyć, lać), wrzeć, rzec, piec and the -jąć verbs ----
  'bić:i': P({ pres: 'biję bijesz bije bijemy bijecie biją', past: 'bił biła biło bili biły', imp: 'bij', ger: 'bijąc', part: 'bijący' }),
  'szyć:i': P({ pres: 'szyję szyjesz szyje szyjemy szyjecie szyją', past: 'szył szyła szyło szyli szyły', imp: 'szyj', ger: 'szyjąc', part: 'szyjący' }),
  'lać:i': P({ pres: 'leję lejesz leje lejemy lejecie leją', past: 'lał lała lało lali lały', imp: 'lej', ger: 'lejąc', part: 'lejący' }),
  'wrzeć:i': { pres: S('wrę wrzesz wrze wrzemy wrzecie wrą'), ger: S('wrząc wrząc wrząc wrząc wrząc wrząc'), part: S('wrzący wrzący wrzący wrzący wrzący wrzący') },
  'rzec:p': { past: 'rzekłem / rzekłam, rzekłeś / rzekłaś, rzekł / rzekła / rzekło, rzekliśmy / rzekłyśmy, rzekliście / rzekłyście, rzekli / rzekły' },
  'upiec:p': { past: 'upiekłem / upiekłam, upiekłeś / upiekłaś, upiekł / upiekła / upiekło, upiekliśmy / upiekłyśmy, upiekliście / upiekłyście, upiekli / upiekły' },
  'zdjąć:p': P({ fut: 'zdejmę zdejmiesz zdejmie zdejmiemy zdejmiecie zdejmą', past: 'zdjął zdjęła zdjęło zdjęli zdjęły', imp: 'zdejmij', ger: 'zdjąwszy', part: NONE }),
  'wynająć:p': { fut: S('wynajmę wynajmiesz wynajmie wynajmiemy wynajmiecie wynajmą'), imp: `${NONE}, wynajmij, niech wynajmie, wynajmijmy, wynajmijcie, niech wynajmą` },
  'podjąć:p': { fut: S('podejmę podejmiesz podejmie podejmiemy podejmiecie podejmą') },
  'wyjąć:p': { fut: S('wyjmę wyjmiesz wyjmie wyjmiemy wyjmiecie wyjmą') },
  // ---- added after the database audits: verbs the first engine did not know or got wrong ----
  // czcić / chrzcić: -cz + c stems (czczę, czcij)
  'czcić:i': P({ pres: 'czczę czcisz czci czcimy czcicie czczą', past: 'czcił czciła czciło czcili czciły', imp: 'czcij', ger: 'czcząc', part: 'czczący' }),
  'uczcić:p': P({ fut: 'uczczę uczcisz uczci uczcimy uczcicie uczczą', past: 'uczcił uczciła uczciło uczcili uczciły', imp: 'uczcij', ger: 'uczciwszy', part: NONE }),
  'chrzcić:i': { pres: S('chrzczę chrzcisz chrzci chrzcimy chrzcicie chrzczą') },
  'ochrzcić:p': { fut: S('ochrzczę ochrzcisz ochrzci ochrzcimy ochrzcicie ochrzczą') },
  // patrzeć: past in -ył, not -ał
  'patrzeć:i': P({ pres: 'patrzę patrzysz patrzy patrzymy patrzycie patrzą', past: 'patrzył patrzyła patrzyło patrzyli patrzyły', imp: 'patrz', ger: 'patrząc', part: 'patrzący' }),
  'popatrzeć:p': P({ fut: 'popatrzę popatrzysz popatrzy popatrzymy popatrzycie popatrzą', past: 'popatrzył popatrzyła popatrzyło popatrzyli popatrzyły', imp: 'popatrz', ger: 'popatrzywszy', part: NONE }),
  'przyjrzeć się:p': { fut: 'przyjrzę się, przyjrzysz się, przyjrzy się, przyjrzymy się, przyjrzycie się, przyjrzą się', imp: `${NONE}, przyjrzyj się, niech się przyjrzy, przyjrzyjmy się, przyjrzyjcie się, niech się przyjrzą` },
  'rozejrzeć się:p': { fut: 'rozejrzę się, rozejrzysz się, rozejrzy się, rozejrzymy się, rozejrzycie się, rozejrzą się', imp: `${NONE}, rozejrzyj się, niech się rozejrzy, rozejrzyjmy się, rozejrzyjcie się, niech się rozejrzą` },
  // roots without a vowel behind a prefix: the imperative needs -yj / -ij (drżyj, zabrzmij)
  'drżeć:i': P({ pres: 'drżę drżysz drży drżymy drżycie drżą', past: 'drżał drżała drżało drżeli drżały', imp: 'drżyj', ger: 'drżąc', part: 'drżący' }),
  'zadrżeć:p': P({ fut: 'zadrżę zadrżysz zadrży zadrżymy zadrżycie zadrżą', past: 'zadrżał zadrżała zadrżało zadrżeli zadrżały', imp: 'zadrżyj', ger: 'zadrżawszy', part: NONE }),
  'brzmieć:i': { pres: S('brzmię brzmisz brzmi brzmimy brzmicie brzmią'), imp: `${NONE}, brzmij, niech brzmi, brzmijmy, brzmijcie, niech brzmią` },
  'zabrzmieć:p': { fut: S('zabrzmię zabrzmisz zabrzmi zabrzmimy zabrzmicie zabrzmią'), imp: `${NONE}, zabrzmij, niech zabrzmi, zabrzmijmy, zabrzmijcie, niech zabrzmią` },
  // -czeć sound verbs
  'ryczeć:i': { pres: S('ryczę ryczysz ryczy ryczymy ryczycie ryczą'), imp: `${NONE}, rycz, niech ryczy, ryczmy, ryczcie, niech ryczą` },
  'buczeć:i': { pres: S('buczę buczysz buczy buczymy buczycie buczą') },
  'burczeć:i': { pres: S('burczę burczysz burczy burczymy burczycie burczą') },
  'bzyczeć:i': { pres: S('bzyczę bzyczysz bzyczy bzyczymy bzyczycie bzyczą') },
  'kwiczeć:i': { pres: S('kwiczę kwiczysz kwiczy kwiczymy kwiczycie kwiczą') },
  'skowyczeć:i': { pres: S('skowyczę skowyczysz skowyczy skowyczymy skowyczycie skowyczą') },
  'miauczeć:i': { pres: S('miauczę miauczysz miauczy miauczymy miauczycie miauczą') },
  'zaryczeć:p': { fut: S('zaryczę zaryczysz zaryczy zaryczymy zaryczycie zaryczą') },
  // kaszleć: 1st conjugation (kaszlę, kaszlesz); the imperative kaszl is the least certain form
  'kaszleć:i': P({ pres: 'kaszlę kaszlesz kaszle kaszlemy kaszlecie kaszlą', past: 'kaszlał kaszlała kaszlało kaszleli kaszlały', imp: 'kaszl', ger: 'kaszląc', part: 'kaszlący' }),
  'zakaszleć:p': { fut: S('zakaszlę zakaszlesz zakaszle zakaszlemy zakaszlecie zakaszlą') },
  'swędzieć:i': { pres: `${NONE}, ${NONE}, swędzi, ${NONE}, ${NONE}, swędzą`, imp: dashes },
  // -nieć / -eć verbs of becoming (maleję, istnieję)
  'maleć:i': P({ pres: 'maleję malejesz maleje malejemy malejecie maleją', past: 'malał malała malało maleli malały', imp: 'malej', ger: 'malejąc', part: 'malejący' }),
  'zmaleć:p': { fut: S('zmaleję zmalejesz zmaleje zmalejemy zmalejecie zmaleją') },
  'istnieć:i': P({ pres: 'istnieję istniejesz istnieje istniejemy istniejecie istnieją', past: 'istniał istniała istniało istnieli istniały', imp: 'istniej', ger: 'istniejąc', part: 'istniejący' }),
  'zaistnieć:p': { fut: S('zaistnieję zaistniejesz zaistnieje zaistniejemy zaistniejecie zaistnieją') },
  'zdumieć:p': P({ fut: 'zdumieję zdumiejesz zdumieje zdumiejemy zdumiejecie zdumieją', past: 'zdumiał zdumiała zdumiało zdumieli zdumiały', imp: 'zdumiej', ger: 'zdumiawszy', part: NONE }),
  'ocaleć:p': { fut: S('ocaleję ocalejesz ocaleje ocalejemy ocalejecie ocaleją') },
  'twardnieć:i': { pres: S('twardnieję twardniejesz twardnieje twardniejemy twardniejecie twardnieją') },
  'stwardnieć:p': { fut: S('stwardnieję stwardniejesz stwardnieje stwardniejemy stwardniejecie stwardnieją') },
  'topnieć:i': { pres: S('topnieję topniejesz topnieje topniejemy topniejecie topnieją') },
  'wić się:i': P({ pres: 'wiję wijesz wije wijemy wijecie wiją', past: 'wił wiła wiło wili wiły', imp: 'wij', ger: 'wijąc', part: 'wijący' }),
  // irregular families added: strzec, -piąć, -giąć, począć, być, przeć, trzeć, drzeć, lec ...
  'dostrzec:p': P({ fut: 'dostrzegę dostrzeżesz dostrzeże dostrzeżemy dostrzeżecie dostrzegą', past: 'dostrzegł dostrzegła dostrzegło dostrzegli dostrzegły', imp: 'dostrzeż', ger: 'dostrzegłszy', part: NONE }),
  'wspiąć się:p': P({ fut: 'wespnę wespniesz wespnie wespniemy wespniecie wespną', past: 'wspiął wspięła wspięło wspięli wspięły', imp: 'wespnij', ger: 'wspiąwszy', part: NONE }),
  'zapiąć:p': P({ fut: 'zapnę zapniesz zapnie zapniemy zapniecie zapną', past: 'zapiął zapięła zapięło zapięli zapięły', imp: 'zapnij', ger: 'zapiąwszy', part: NONE }),
  'odpiąć:p': P({ fut: 'odepnę odepniesz odepnie odepniemy odepniecie odepną', past: 'odpiął odpięła odpięło odpięli odpięły', imp: 'odepnij', ger: 'odpiąwszy', part: NONE }),
  'rozpiąć:p': { fut: S('rozepnę rozepniesz rozepnie rozepniemy rozepniecie rozepną'), imp: `${NONE}, rozepnij, niech rozepnie, rozepnijmy, rozepnijcie, niech rozepną` },
  'przypiąć:p': { fut: S('przypnę przypniesz przypnie przypniemy przypniecie przypną'), imp: `${NONE}, przypnij, niech przypnie, przypnijmy, przypnijcie, niech przypną` },
  'zgiąć:p': P({ fut: 'zegnę zegniesz zegnie zegniemy zegniecie zegną', past: 'zgiął zgięła zgięło zgięli zgięły', imp: 'zegnij', ger: 'zgiąwszy', part: NONE }),
  'ugiąć się:p': P({ fut: 'ugnę ugniesz ugnie ugniemy ugniecie ugną', past: 'ugiął ugięła ugięło ugięli ugięły', imp: 'ugnij', ger: 'ugiąwszy', part: NONE }),
  'odpocząć:p': P({ fut: 'odpocznę odpoczniesz odpocznie odpoczniemy odpoczniecie odpoczną', past: 'odpoczął odpoczęła odpoczęło odpoczęli odpoczęły', imp: 'odpocznij', ger: 'odpocząwszy', part: NONE }),
  'wypocząć:p': { fut: S('wypocznę wypoczniesz wypocznie wypoczniemy wypoczniecie wypoczną') },
  'począć:p': { fut: S('pocznę poczniesz pocznie poczniemy poczniecie poczną') },
  'wydobyć:p': P({ fut: 'wydobędę wydobędziesz wydobędzie wydobędziemy wydobędziecie wydobędą', past: 'wydobył wydobyła wydobyło wydobyli wydobyły', imp: 'wydobądź', ger: 'wydobywszy', part: NONE }),
  'pozbyć się:p': P({ fut: 'pozbędę pozbędziesz pozbędzie pozbędziemy pozbędziecie pozbędą', past: 'pozbył pozbyła pozbyło pozbyli pozbyły', imp: 'pozbądź', ger: 'pozbywszy', part: NONE }),
  'poprzeć:p': P({ fut: 'poprę poprzesz poprze poprzemy poprzecie poprą', past: 'poparł poparła poparło poparli poparły', imp: 'poprzyj', ger: 'poparłszy', part: NONE }),
  'wesprzeć:p': P({ fut: 'wesprę wesprzesz wesprze wesprzemy wesprzecie wesprą', past: 'wsparł wsparła wsparło wsparli wsparły', imp: 'wesprzyj', ger: 'wsparłszy', part: NONE }),
  // an e-prefix loses its e in the whole past: odeprzeć -> odparł, zetrzeć -> starł (not zetarł), zedrzeć -> zdarł
  'odeprzeć:p': P({ fut: 'odeprę odeprzesz odeprze odeprzemy odeprzecie odeprą', past: 'odparł odparła odparło odparli odparły', imp: 'odeprzyj', ger: 'odparłszy', part: NONE }),
  'podeprzeć:p': P({ fut: 'podeprę podeprzesz podeprze podeprzemy podeprzecie podeprą', past: 'podparł podparła podparło podparli podparły', imp: 'podeprzyj', ger: 'podparłszy', part: NONE }),
  'zetrzeć:p': P({ fut: 'zetrę zetrzesz zetrze zetrzemy zetrzecie zetrą', past: 'starł starła starło starli starły', imp: 'zetrzyj', ger: 'starłszy', part: NONE }),
  'zedrzeć:p': P({ fut: 'zedrę zedrzesz zedrze zedrzemy zedrzecie zedrą', past: 'zdarł zdarła zdarło zdarli zdarły', imp: 'zedrzyj', ger: 'zdarłszy', part: NONE }),
  'wetrzeć:p': P({ fut: 'wetrę wetrzesz wetrze wetrzemy wetrzecie wetrą', past: 'wtarł wtarła wtarło wtarli wtarły', imp: 'wetrzyj', ger: 'wtarłszy', part: NONE }),
  'ulec:p': P({ fut: 'ulegnę ulegniesz ulegnie ulegniemy ulegniecie ulegną', past: 'uległ uległa uległo ulegli uległy', imp: 'ulegnij', ger: 'uległszy', part: NONE }),
  'przysiąc:p': P({ fut: 'przysięgnę przysięgniesz przysięgnie przysięgniemy przysięgniecie przysięgną', past: 'przysiągł przysięgła przysięgło przysięgli przysięgły', imp: 'przysięgnij', ger: 'przysiągłszy', part: NONE }),
  'przyrzec:p': P({ fut: 'przyrzeknę przyrzekniesz przyrzeknie przyrzekniemy przyrzekniecie przyrzekną', past: 'przyrzekł przyrzekła przyrzekło przyrzekli przyrzekły', imp: 'przyrzeknij', ger: 'przyrzekłszy', part: NONE }),
  'urzec:p': { fut: S('urzeknę urzekniesz urzeknie urzekniemy urzekniecie urzekną'), past: 'urzekłem / urzekłam, urzekłeś / urzekłaś, urzekł / urzekła / urzekło, urzekliśmy / urzekłyśmy, urzekliście / urzekłyście, urzekli / urzekły' },
  'orzec:p': { fut: S('orzeknę orzekniesz orzeknie orzekniemy orzekniecie orzekną') },
  'wyrzec się:p': { fut: 'wyrzeknę się, wyrzekniesz się, wyrzeknie się, wyrzekniemy się, wyrzekniecie się, wyrzekną się' },
  'zrzec się:p': { fut: 'zrzeknę się, zrzekniesz się, zrzeknie się, zrzekniemy się, zrzekniecie się, zrzekną się' },
  'żąć:i': P({ pres: 'żnę żniesz żnie żniemy żniecie żną', past: 'żął żęła żęło żęli żęły', imp: 'żnij', ger: 'żnąc', part: 'żnący' }),
  'wyżąć:p': P({ fut: 'wyżmę wyżmiesz wyżmie wyżmiemy wyżmiecie wyżmą', past: 'wyżął wyżęła wyżęło wyżęli wyżęły', imp: 'wyżmij', ger: 'wyżąwszy', part: NONE }),
  'żreć:i': P({ pres: 'żrę żresz żre żremy żrecie żrą', past: 'żarł żarła żarło żarli żarły', imp: 'żryj', ger: 'żrąc', part: 'żrący' }),
  'pożreć:p': P({ fut: 'pożrę pożresz pożre pożremy pożrecie pożrą', past: 'pożarł pożarła pożarło pożarli pożarły', imp: 'pożryj', ger: 'pożarłszy', part: NONE }),
  'tłuc:i': P({ pres: 'tłukę tłuczesz tłucze tłuczemy tłuczecie tłuką', past: 'tłukł tłukła tłukło tłukli tłukły', imp: 'tłucz', ger: 'tłukąc', part: 'tłukący' }),
  'wlec:i': P({ pres: 'wlokę wleczesz wlecze wleczemy wleczecie wloką', past: 'wlókł wlokła wlokło wlekli wlokły', pm: 'wlokł', imp: 'wlecz', ger: 'wlokąc', part: 'wlokący' }),
  'nawlec:p': P({ fut: 'nawlokę nawleczesz nawlecze nawleczemy nawleczecie nawloką', past: 'nawlókł nawlokła nawlokło nawlekli nawlokły', pm: 'nawlokł', imp: 'nawlecz', ger: 'nawlókłszy', part: NONE }),
  'prząść:i': P({ pres: 'przędę przędziesz przędzie przędziemy przędziecie przędą', past: 'prządł przędła przędło przędli przędły', imp: 'przędź', ger: 'przędąc', part: 'przędący' }),
  'paść się:i': P({ pres: 'pasę pasiesz pasie pasiemy pasiecie pasą', past: 'pasł pasła pasło pasli pasły', imp: 'paś', ger: 'pasąc', part: 'pasący' }),
  'popaść:p': { fut: S('popadnę popadniesz popadnie popadniemy popadniecie popadną') },
  'podupaść:p': { fut: S('podupadnę podupadniesz podupadnie podupadniemy podupadniecie podupadną') },
  'rozgnieść:p': P({ fut: 'rozgniotę rozgnieciesz rozgniecie rozgnieciemy rozgnieciecie rozgniotą', past: 'rozgniótł rozgniotła rozgniotło rozgnietli rozgniotły', pm: 'rozgniotł', imp: 'rozgnieć', ger: 'rozgniótłszy', part: NONE }),
  'zagnieść:p': { fut: S('zagniotę zagnieciesz zagniecie zagnieciemy zagnieciecie zagniotą') },
  'zakląć:p': P({ fut: 'zaklnę zaklniesz zaklnie zaklniemy zaklniecie zaklną', past: 'zaklął zaklęła zaklęło zaklęli zaklęły', imp: 'zaklnij', ger: 'zakląwszy', part: NONE }),
  'zwieść:p': P({ fut: 'zwiodę zwiedziesz zwiedzie zwiedziemy zwiedziecie zwiodą', past: 'zwiódł zwiodła zwiodło zwiedli zwiodły', pm: 'zwiodł', imp: 'zwiedź', ger: 'zwiódłszy', part: NONE }),
  'wyciec:p': P({ fut: 'wycieknę wyciekniesz wycieknie wyciekniemy wyciekniecie wyciekną', past: 'wyciekł wyciekła wyciekło wyciekli wyciekły', imp: null, ger: 'wyciekłszy', part: NONE }),
  'zaprząc:p': P({ fut: 'zaprzęgnę zaprzęgniesz zaprzęgnie zaprzęgniemy zaprzęgniecie zaprzęgną', past: 'zaprzągł zaprzęgła zaprzęgło zaprzęgli zaprzęgły', imp: 'zaprzęgnij', ger: 'zaprzągłszy', part: NONE }),
  // perfectives of stać with a longer prefix were taken for -am verbs (powstam)
  'powstać:p': P({ fut: 'powstanę powstaniesz powstanie powstaniemy powstaniecie powstaną', past: 'powstał powstała powstało powstali powstały', imp: 'powstań', ger: 'powstawszy', part: NONE }),
  'pozostać:p': { fut: S('pozostanę pozostaniesz pozostanie pozostaniemy pozostaniecie pozostaną') },
  'przystać:p': { fut: S('przystanę przystaniesz przystanie przystaniemy przystaniecie przystaną') },
  'zaprzestać:p': { fut: S('zaprzestanę zaprzestaniesz zaprzestanie zaprzestaniemy zaprzestaniecie zaprzestaną') },
  'zmartwychwstać:p': { fut: S('zmartwychwstanę zmartwychwstaniesz zmartwychwstanie zmartwychwstaniemy zmartwychwstaniecie zmartwychwstaną') },
  'odesłać:p': P({ fut: 'odeślę odeślesz odeśle odeślemy odeślecie odeślą', past: 'odesłał odesłała odesłało odesłali odesłały', imp: 'odeślij', ger: 'odesławszy', part: NONE }),
  'przysłać:p': { fut: S('przyślę przyślesz przyśle przyślemy przyślecie przyślą') },
  // -nąć verbs that lose -ną- in the past: spuchł, ostygł, zwiędł, ciekł, uschł
  'spuchnąć:p': P({ fut: 'spuchnę spuchniesz spuchnie spuchniemy spuchniecie spuchną', past: 'spuchł spuchła spuchło spuchli spuchły', imp: 'spuchnij', ger: 'spuchłszy', part: NONE }),
  'ostygnąć:p': { past: 'ostygłem / ostygłam, ostygłeś / ostygłaś, ostygł / ostygła / ostygło, ostygliśmy / ostygłyśmy, ostygliście / ostygłyście, ostygli / ostygły' },
  'zwiędnąć:p': { past: 'zwiędłem / zwiędłam, zwiędłeś / zwiędłaś, zwiędł / zwiędła / zwiędło, zwiędliśmy / zwiędłyśmy, zwiędliście / zwiędłyście, zwiędli / zwiędły' },
  'zakrzepnąć:p': { past: 'zakrzepłem / zakrzepłam, zakrzepłeś / zakrzepłaś, zakrzepł / zakrzepła / zakrzepło, zakrzepliśmy / zakrzepłyśmy, zakrzepliście / zakrzepłyście, zakrzepli / zakrzepły' },
  'cieknąć:i': P({ pres: 'cieknę ciekniesz cieknie ciekniemy ciekniecie ciekną', past: 'ciekł ciekła ciekło ciekli ciekły', imp: 'cieknij', ger: 'cieknąc', part: 'cieknący' }),
  'uschnąć:p': { past: 'uschłem / uschłam, uschłeś / uschłaś, uschł / uschła / uschło, uschliśmy / uschłyśmy, uschliście / uschłyście, uschli / uschły' },
  'schnąć:i': P({ pres: 'schnę schniesz schnie schniemy schniecie schną', past: 'schnął schła schło schli schły', imp: 'schnij', ger: 'schnąc', part: 'schnący' }),
  // alternations that were missing: plątać -> plączę, szarpać -> szarpię, bulgotać -> bulgoczę ...
  'plątać:i': P({ pres: 'plączę plączesz plącze plączemy plączecie plączą', past: 'plątał plątała plątało plątali plątały', imp: 'plącz', ger: 'plącząc', part: 'plączący' }),
  'poplątać:p': { fut: S('poplączę poplączesz poplącze poplączemy poplączecie poplączą') },
  'szarpać:i': P({ pres: 'szarpię szarpiesz szarpie szarpiemy szarpiecie szarpią', past: 'szarpał szarpała szarpało szarpali szarpały', imp: 'szarp', ger: 'szarpiąc', part: 'szarpiący' }),
  'grzebać:i': { pres: S('grzebię grzebiesz grzebie grzebiemy grzebiecie grzebią'), imp: `${NONE}, grzeb, niech grzebie, grzebmy, grzebcie, niech grzebią` },
  'pogrzebać:p': { fut: S('pogrzebię pogrzebiesz pogrzebie pogrzebiemy pogrzebiecie pogrzebią') },
  'skrobać:i': { pres: S('skrobię skrobiesz skrobie skrobiemy skrobiecie skrobią'), imp: `${NONE}, skrob, niech skrobie, skrobmy, skrobcie, niech skrobią` },
  'zeskrobać:p': { fut: S('zeskrobię zeskrobiesz zeskrobie zeskrobiemy zeskrobiecie zeskrobią') },
  'klepać:i': { pres: S('klepię klepiesz klepie klepiemy klepiecie klepią'), imp: `${NONE}, klep, niech klepie, klepmy, klepcie, niech klepią` },
  'bulgotać:i': { pres: S('bulgoczę bulgoczesz bulgocze bulgoczemy bulgoczecie bulgoczą'), imp: `${NONE}, bulgocz, niech bulgocze, bulgoczmy, bulgoczcie, niech bulgoczą` },
  'stukotać:i': { pres: S('stukoczę stukoczesz stukocze stukoczemy stukoczecie stukoczą') },
  'łomotać:i': { pres: S('łomoczę łomoczesz łomocze łomoczemy łomoczecie łomoczą') },
  'szamotać się:i': { pres: 'szamoczę się, szamoczesz się, szamocze się, szamoczemy się, szamoczecie się, szamoczą się' },
  'świergotać:i': { pres: S('świergoczę świergoczesz świergocze świergoczemy świergoczecie świergoczą') },
  'chybotać się:i': { pres: 'chyboczę się, chyboczesz się, chybocze się, chyboczemy się, chyboczecie się, chyboczą się' },
  'zdruzgotać:p': { fut: S('zdruzgoczę zdruzgoczesz zdruzgocze zdruzgoczemy zdruzgoczecie zdruzgoczą') },
  'łajać:i': { pres: S('łaję łajesz łaje łajemy łajecie łają'), imp: `${NONE}, łaj, niech łaje, łajmy, łajcie, niech łają` },
  'krajać:i': { pres: S('kraję krajesz kraje krajemy krajecie krają'), imp: `${NONE}, kraj, niech kraje, krajmy, krajcie, niech krają` },
  'pokrajać:p': { fut: S('pokraję pokrajesz pokraje pokrajemy pokrajecie pokrają') },
  // -ywać verbs: patrywać, dbywać, -oływać are -uję; kiwać, wzywać and odbywać are -am
  'rozpatrywać:i': { pres: S('rozpatruję rozpatrujesz rozpatruje rozpatrujemy rozpatrujecie rozpatrują'), imp: `${NONE}, rozpatruj, niech rozpatruje, rozpatrujmy, rozpatrujcie, niech rozpatrują` },
  'wypatrywać:i': { pres: S('wypatruję wypatrujesz wypatruje wypatrujemy wypatrujecie wypatrują') },
  'zaopatrywać:i': { pres: S('zaopatruję zaopatrujesz zaopatruje zaopatrujemy zaopatrujecie zaopatrują') },
  'wpatrywać się:i': { pres: 'wpatruję się, wpatrujesz się, wpatruje się, wpatrujemy się, wpatrujecie się, wpatrują się' },
  'zaniedbywać:i': { pres: S('zaniedbuję zaniedbujesz zaniedbuje zaniedbujemy zaniedbujecie zaniedbują') },
  'oddziaływać:i': { pres: S('oddziałuję oddziałujesz oddziałuje oddziałujemy oddziałujecie oddziałują') },
  'wywoływać:i': { pres: S('wywołuję wywołujesz wywołuje wywołujemy wywołujecie wywołują') },
  'przywoływać:i': { pres: S('przywołuję przywołujesz przywołuje przywołujemy przywołujecie przywołują') },
  'odwoływać się:i': { pres: 'odwołuję się, odwołujesz się, odwołuje się, odwołujemy się, odwołujecie się, odwołują się' },
  'rozwikływać:i': { pres: S('rozwikłuję rozwikłujesz rozwikłuje rozwikłujemy rozwikłujecie rozwikłują') },
  'kiwać:i': { pres: S('kiwam kiwasz kiwa kiwamy kiwacie kiwają'), imp: `${NONE}, kiwaj, niech kiwa, kiwajmy, kiwajcie, niech kiwają` },
  'wzywać:i': { pres: S('wzywam wzywasz wzywa wzywamy wzywacie wzywają') },
  'odzywać się:i': { pres: 'odzywam się, odzywasz się, odzywa się, odzywamy się, odzywacie się, odzywają się' },
  'odbywać się:i': { pres: `${NONE}, ${NONE}, odbywa się, ${NONE}, ${NONE}, odbywają się`, imp: dashes },
  'przebywać:i': { pres: S('przebywam przebywasz przebywa przebywamy przebywacie przebywają') },
  'odnawiać:i': { pres: S('odnawiam odnawiasz odnawia odnawiamy odnawiacie odnawiają') },
  'ponawiać:i': { pres: S('ponawiam ponawiasz ponawia ponawiamy ponawiacie ponawiają') },
  'wznawiać:i': { pres: S('wznawiam wznawiasz wznawia wznawiamy wznawiacie wznawiają') },
  'przewiać:p': { fut: S('przewieję przewiejesz przewieje przewiejemy przewiejecie przewieją') },
  // -ić verbs: zdobić is not a relative of bić; -żdżę; użyć with a prefix
  'zdobić:i': { pres: S('zdobię zdobisz zdobi zdobimy zdobicie zdobią'), imp: `${NONE}, zdób, niech zdobi, zdóbmy, zdóbcie, niech zdobią` },
  'gnieździć się:i': { pres: 'gnieżdżę się, gnieździsz się, gnieździ się, gnieździmy się, gnieździcie się, gnieżdżą się', imp: `${NONE}, gnieźdź się, niech się gnieździ, gnieźdźmy się, gnieźdźcie się, niech się gnieżdżą` },
  'przygwoździć:p': { fut: S('przygwożdżę przygwoździsz przygwoździ przygwoździmy przygwoździcie przygwożdżą') },
  'zużyć:p': { fut: S('zużyję zużyjesz zużyje zużyjemy zużyjecie zużyją'), imp: `${NONE}, zużyj, niech zużyje, zużyjmy, zużyjcie, niech zużyją` },
  'nadużyć:p': { fut: S('nadużyję nadużyjesz nadużyje nadużyjemy nadużyjecie nadużyją') },
  'zadowolić:p': { fut: S('zadowolę zadowolisz zadowoli zadowolimy zadowolicie zadowolą'), imp: `${NONE}, zadowól, niech zadowoli, zadowólmy, zadowólcie, niech zadowolą` },
  // prefix chains the lists did not reach: w+skazać, zo+bo+wiązać, wy+ssać, za+ssać
  'wskazać:p': P({ fut: 'wskażę wskażesz wskaże wskażemy wskażecie wskażą', past: 'wskazał wskazała wskazało wskazali wskazały', imp: 'wskaż', ger: 'wskazawszy', part: NONE }),
  'zobowiązać:p': { fut: S('zobowiążę zobowiążesz zobowiąże zobowiążemy zobowiążecie zobowiążą'), imp: `${NONE}, zobowiąż, niech zobowiąże, zobowiążmy, zobowiążcie, niech zobowiążą` },
  'zobowiązać się:p': { fut: 'zobowiążę się, zobowiążesz się, zobowiąże się, zobowiążemy się, zobowiążecie się, zobowiążą się' },
  'ssać:i': P({ pres: 'ssę ssiesz ssie ssiemy ssiecie ssą', past: 'ssał ssała ssało ssali ssały', imp: 'ssij', ger: 'ssąc', part: 'ssący' }),
  'wyssać:p': P({ fut: 'wyssę wyssiesz wyssie wyssiemy wyssiecie wyssą', past: 'wyssał wyssała wyssało wyssali wyssały', imp: 'wyssij', ger: 'wyssawszy', part: NONE }),
  'zassać:p': { fut: S('zassę zassiesz zassie zassiemy zassiecie zassą') },
  // impersonal verbs only have 3rd-person forms
  'zdarzać się:i': { pres: `${NONE}, ${NONE}, zdarza się, ${NONE}, ${NONE}, zdarzają się`, imp: dashes },
  'zabraknąć:p': { fut: `${NONE}, ${NONE}, zabraknie, ${NONE}, ${NONE}, zabrakną`, imp: dashes },
  'mżyć:i': { pres: `${NONE}, ${NONE}, mży, ${NONE}, ${NONE}, mżą`, imp: dashes },
  'dziać się:i': { pres: `${NONE}, ${NONE}, dzieje się, ${NONE}, ${NONE}, dzieją się`, imp: dashes },
  'nadziać:p': { fut: S('nadzieję nadziejesz nadzieje nadziejemy nadziejecie nadzieją') },
  // plain stems whose imperative must NOT get -ij / -yj (the no-vowel rule is limited to brzm, grzm, drż, kp)
  'zaprzeczyć:p': { imp: `${NONE}, zaprzecz, niech zaprzeczy, zaprzeczmy, zaprzeczcie, niech zaprzeczą` },
  'przeczyć:i': { imp: `${NONE}, przecz, niech przeczy, przeczmy, przeczcie, niech przeczą` },
  'znaczyć:i': { imp: `${NONE}, znacz, niech znaczy, znaczmy, znaczcie, niech znaczą` },
  'wywyższyć:p': { imp: `${NONE}, wywyższ, niech wywyższy, wywyższmy, wywyższcie, niech wywyższą` },
  'ponaglić:p': { imp: `${NONE}, ponagl, niech ponagli, ponaglmy, ponaglcie, niech ponaglą` },
  'uczyć:i': { pres: S('uczę uczysz uczy uczymy uczycie uczą'), imp: `${NONE}, ucz, niech uczy, uczmy, uczcie, niech uczą` },
};

// A duplicate key in an object literal silently replaces the earlier entry and so drops
// its assertions: read this file's own source and refuse duplicates in EXPECTED.
{
  const source = require('fs').readFileSync(__filename, 'utf8');
  const start = source.indexOf('const EXPECTED = {');
  const body = source.slice(start, source.indexOf('\n};\n', start));
  const seen = new Set();
  let keys = 0;
  for (const [, key] of body.matchAll(/^ {2}'([^']+)': /gm)) {
    report.checks += 1;
    keys += 1;
    if (seen.has(key)) report.fail(`EXPECTED has the key ${key} twice; the later entry would silently replace the earlier one`);
    seen.add(key);
  }
  report.checks += 1;
  if (keys !== Object.keys(EXPECTED).length) report.fail(`EXPECTED: ${keys} keys in the source but ${Object.keys(EXPECTED).length} in the object`);
  report.checks += 1;
  if (keys < 100) report.fail(`EXPECTED has only ${keys} verbs; at least 100 are required`);
}

// ---- the paradigm checks ---------------------------------------------------------------------
function checkShape(label, result) {
  report.checks += 1;
  if (Object.keys(result.forms).join() !== FORM_KEYS.join()) report.fail(`${label}: wrong form keys ${Object.keys(result.forms)}`);
  for (const key of FORM_KEYS) {
    const forms = result.forms[key];
    if (!Array.isArray(forms) || forms.length !== 6 || forms.some(f => typeof f !== 'string' || !f || /undefined|null|NaN/.test(f))) {
      report.fail(`${label}.${key}: not six strings: ${JSON.stringify(forms)}`);
    }
  }
}

for (const [key, spec] of Object.entries(EXPECTED)) {
  const [word, aspect] = key.split(':');
  const result = conjugate(word, aspect);
  if (!result) { report.fail(`${key}: conjugate() returned null`); continue; }
  report.checks += 2;
  if (result.inf !== word) report.fail(`${key}: inf should echo the input, got ${result.inf}`);
  if (result.aspect !== aspect) report.fail(`${key}: aspect should echo the input, got ${result.aspect}`);
  checkShape(key, result);
  const want = spec.whole ? expand(key, spec) : spec;
  for (const [tense, expected] of Object.entries(want)) {
    report.checks += 1;
    if (!FORM_KEYS.includes(tense)) { report.fail(`${key}: unknown tense ${tense} in the table`); continue; }
    const actual = result.forms[tense].join(', ');
    if (actual !== expected) report.fail(`${key}.${tense}\n    expected: ${expected}\n    actual:   ${actual}`);
  }
}

// ---- input that is not a verb this engine can conjugate must be refused ----------------------
const refused = [
  ['', 'i'], ['   ', 'i'], ['hello', 'i'], ['read', 'i'], ['123', 'i'], ['constructor', 'i'], ['toString', 'i'], ['__proto__', 'i'],
  ['hasOwnProperty', 'i'], ['czytam', 'i'], ['czytał', 'i'], ['piękny', 'i'], ['czytać się się', 'i'], ['czytać abc', 'i'], ['czytać-', 'i'],
  ['się', 'i'], ['ć', 'i'], ['dom', 'i'], ['noc', 'i'], ['mówić', 'x'], ['mówić', ''], ['mówić', undefined], ['mówić', 'ip'], ['mówić', 'I'],
  [null, 'i'], [undefined, 'i'], [42, 'i'], [{}, 'i'], [['mówić'], 'i'], ['мовить', 'i'], ['mówic', 'i'],
  // a perfective-only irregular verb refused as imperfective, and unknown -ść / -c verbs
  ['wejść', 'i'], ['dać', 'i'], ['kość', 'i'], ['lec', 'i'], ['przypomnieć sobie', 'p'],
  // an irregular verb is only conjugated for the aspect it has: bare imperfective, prefixed perfective
  ['być', 'p'], ['mieć', 'p'], ['iść', 'p'], ['jeść', 'p'], ['wiedzieć', 'p'], ['jechać', 'p'], ['nieść', 'p'], ['brać', 'p'],
  ['przynieść', 'i'], ['wziąć', 'i'], ['pójść', 'i'], ['powiedzieć', 'i'], ['zjeść', 'i'], ['zacząć', 'i'], ['zdjąć', 'i'],
  // families added after the audits: perfective-only prefixed verbs and bare imperfective ones
  ['wesprzeć', 'i'], ['dostrzec', 'i'], ['odpocząć', 'i'], ['wydobyć', 'i'], ['powstać', 'i'], ['ulec', 'i'], ['przysiąc', 'i'],
  ['zaprząc', 'i'], ['wyciec', 'i'], ['wyżąć', 'i'], ['zakląć', 'i'], ['przyrzec', 'i'], ['zapiąć', 'i'], ['zgiąć', 'i'], ['popaść', 'i'],
  ['tłuc', 'p'], ['wlec', 'p'], ['żreć', 'p'], ['prząść', 'p'], ['żąć', 'p'], ['paść', 'p'], ['piąć', 'p'], ['giąć', 'p'], ['schnąć', 'p'], ['ssać', 'p'],
];
for (const [input, aspect] of refused) {
  report.checks += 1;
  if (conjugate(input, aspect) !== null) report.fail(`conjugate(${JSON.stringify(input)}, ${JSON.stringify(aspect)}) should be null`);
}

// ---- other API facts -------------------------------------------------------------------------------
{
  const same = (label, a, b) => { report.checks += 1; if (JSON.stringify(a) !== JSON.stringify(b)) report.fail(`${label}\n    ${JSON.stringify(a)}\n    ${JSON.stringify(b)}`); };
  const i = conjugate('kupować', 'i');
  const b = conjugate('kupować', 'b');
  same('biaspectual verbs are treated as imperfective', i.forms, b.forms);
  same('the aspect is echoed', b.aspect, 'b');
  same('case and surrounding space are ignored', conjugate('  Czytać ', 'i').forms.pres[0], 'czytam');
  same('inf keeps the infinitive as given', conjugate(' czytać ', 'i').inf, 'czytać');
  // a perfective verb has no present tense, no negative imperative and no active participle
  const done = conjugate('przeczytać', 'p');
  same('perfective: no present', done.forms.pres, Array(6).fill(NONE));
  same('perfective: no negative imperative', done.forms.impNeg, Array(6).fill(NONE));
  same('perfective: no active participle', done.forms.part, Array(6).fill(NONE));
  same('repeatable', conjugate('mówić', 'i'), conjugate('mówić', 'i'));
  same('NONE is the em dash', NONE, '—');
  same('być treated as biaspectual is imperfective', conjugate('być', 'b').forms, conjugate('być', 'i').forms);
  same('a reflexive verb keeps its się in inf', conjugate('myć się', 'i').inf, 'myć się');
  same('extra spaces inside a reflexive verb are ignored', conjugate('myć   się', 'i').forms, conjugate('myć się', 'i').forms);
  same('a perfective verb has an uprzedni gerund', conjugate('zrobić', 'p').forms.ger[0], 'zrobiwszy');
  same('an imperfective verb has a współczesny gerund', conjugate('robić', 'i').forms.ger[0], 'robiąc');
  same('nie before the imperative', conjugate('robić', 'i').forms.impNeg[1], 'nie rób');
}

// ---- every verb of the database must conjugate into well-formed output ---------------------------
const ALLOWED = /^[a-ząćęłńóśźż —/-]+$/;
let polishCount = 0;
for (const [english, entries] of Object.entries(VERBS)) {
  for (const entry of entries) {
    polishCount += 1;
    const label = `${english} -> ${entry.pl} [${entry.aspect}]`;
    report.checks += 1;
    if (!['i', 'p', 'b'].includes(entry.aspect)) { report.fail(`${label}: bad aspect`); continue; }
    const result = conjugate(entry.pl, entry.aspect);
    if (!result) { report.fail(`${label}: not conjugated (null)`); continue; }
    checkShape(label, result);
    report.checks += 1; // letter sequences below
    for (const key of FORM_KEYS) {
      for (const form of result.forms[key]) {
        if (!ALLOWED.test(form)) report.fail(`${label}.${key}: odd characters in "${form}"`);
        // never in Polish: jj, ii (a stem glued to a j-ending twice: łajję), a soft consonant before i + vowel (śia, ńie as ńi)
        if (/jj|ii|[śćźń]i[aąeęioóuy]/.test(form)) report.fail(`${label}.${key}: impossible letter sequence in "${form}"`);
      }
    }
    report.checks += 1;
    const perfective = entry.aspect === 'p';
    const hasPresent = result.forms.pres.some(f => f !== NONE);
    if (perfective === hasPresent) report.fail(`${label}: a perfective verb has no present tense and an imperfective one has`);
  }
}

// Writing non-ASCII text has produced U+FFFD replacement characters before.
for (const file of ['conjugate.js', 'verbs.js', 'test.js']) {
  report.checks += 1;
  const text = require('fs').readFileSync(require('path').join(__dirname, file), 'utf8');
  if (text.includes('\uFFFD')) report.fail(`${file} contains U+FFFD replacement characters`);
}

report.finish(`${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${polishCount} Polish translations`);
