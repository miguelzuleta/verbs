/*
 * English -> Polish verb database.
 *
 * One line per English verb:
 *   english: mówić [i], powiedzieć [p], myć się [i] (usage note)
 *
 * Each translation is the infinitive, then its aspect in brackets: [i] imperfective,
 * [p] perfective, [b] both (treated as imperfective). A reflexive verb has its
 * się after the infinitive (myć się [i]); the engine puts się after the conjugated
 * form. The first translation of each line is the default.
 */
(function (global) {
  'use strict';

  const { parseTable, plainEntry } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: porzucać [i], porzucić [p], rezygnować [i] (give up a plan, idea or claim), zrezygnować [p]
    abort: przerywać [i] (a process; break off), przerwać [p]
    absorb: wchłaniać [i], wchłonąć [p], absorbować [i], pochłaniać [i]
    abuse: nadużywać [i] (misuse), nadużyć [p], maltretować [i] (mistreat)
    accelerate: przyspieszać [i], przyspieszyć [p]
    accept: akceptować [i], zaakceptować [p], przyjmować [i] (a gift; an offer), przyjąć [p]
    accompany: towarzyszyć [i], akompaniować [i] (musically)
    accomplish: osiągać [i], osiągnąć [p], dokonywać [i] (a feat), dokonać [p]
    accumulate: gromadzić [i], zgromadzić [p], kumulować [i], skumulować [p]
    accuse: oskarżać [i] (in court), oskarżyć [p], obwiniać [i] (blame), obwinić [p]
    achieve: osiągać [i], osiągnąć [p], uzyskiwać [i], uzyskać [p]
    acknowledge: przyznawać [i] (admit), przyznać [p], potwierdzać [i] (confirm receipt), potwierdzić [p], uznawać [i] (recognize)
    acquire: nabywać [i] (purchase), nabyć [p], zdobywać [i] (a skill), zdobyć [p], pozyskiwać [i]
    acquit: uniewinniać [i] (release after a not-guilty verdict), uniewinnić [p]
    act: działać [i], zachowywać się [i] (behave), zachować się [p], grać [i] (in a play; perform a role), zagrać [p]
    adapt: dostosowywać [i], dostosować [p], przystosowywać się [i] (adjust to new conditions), adaptować [i] (a text for another medium), zaadaptować [p]
    add: dodawać [i], dodać [p], dopisywać [i] (add words), dopisać [p], sumować [i] (in math)
    adhere: przylegać [i] (stick to), przylgnąć [p], przestrzegać [i] (a rule), trzymać się [i] (an idea), kleić się [i] (stick)
    adjust: dostosowywać [i], dostosować [p], regulować [i] (a setting), wyregulować [p], ustawiać [i] (a setting)
    administer: zarządzać [i], administrować [i], podawać [i] (medicine), podać [p], aplikować [i] (a drug)
    admire: podziwiać [i]
    admit: przyznawać [i] (confess), przyznać [p], przyjmować [i] (to a hospital or school), przyjąć [p], wpuszczać [i] (let in)
    adopt: adoptować [i] (a child), zaadoptować [p], przyjmować [i] (a method or idea), przyjąć [p]
    adore: uwielbiać [i] (love dearly), ubóstwiać [i] (love dearly), czcić [i] (worship), wielbić [i] (worship)
    advance: postępować [i] (make progress), posuwać się [i] (move forward), posunąć się [p], przesuwać [i] (move something forward), przesunąć [p]
    advertise: reklamować [i] (promote a product), zareklamować [p], promować [i], wypromować [p]
    advise: radzić [i], poradzić [p], doradzać [i] (as an expert), doradzić [p]
    advocate: popierać [i], poprzeć [p], bronić [i] (defend a cause), opowiadać się [i] (for), opowiedzieć się [p]
    affect: wpływać [i] (influence), wpłynąć [p], dotyczyć [i] (concern), dotykać [i] (affect badly), poruszać [i] (move emotionally)
    age: starzeć się [i], zestarzeć się [p], dojrzewać [i] (mature, as wine), dojrzeć [p]
    agitate: wzburzać [i] (upset), wzburzyć [p], agitować [i] (stir up people), potrząsać [i] (shake), mieszać [i] (stir)
    agree: zgadzać się [i], zgodzić się [p], ustalać [i] (agree on), ustalić [p], umawiać się [i] (agree on)
    aim: celować [i], wycelować [p], mierzyć [i] (point at something), dążyć [i] (strive), zamierzać [i] (intend)
    alert: ostrzegać [i], ostrzec [p], alarmować [i], zaalarmować [p]
    align: wyrównywać [i], wyrównać [p], ustawiać [i] (bring into line), ustawić [p]
    allocate: przydzielać [i] (assign), przydzielić [p], przeznaczać [i] (set aside), przeznaczyć [p], rozdzielać [i] (share out)
    allow: pozwalać [i], pozwolić [p], zezwalać [i], zezwolić [p], umożliwiać [i] (make possible)
    alter: zmieniać [i], zmienić [p], modyfikować [i] (modify slightly), zmodyfikować [p], przerabiać [i]
    amaze: zdumiewać [i], zdumieć [p], zadziwiać [i], zadziwić [p]
    amend: poprawiać [i] (correct), poprawić [p], zmieniać [i], zmienić [p], nowelizować [i] (a law)
    amuse: bawić [i] (entertain), zabawić [p], rozbawiać [i] (make laugh), rozbawić [p], rozśmieszać [i]
    analyze: analizować [i], przeanalizować [p]
    anger: złościć [i] (make angry), rozzłościć [p], rozgniewać [p] (make angry), złościć się [i] (get angry), wściekać się [i] (become furious)
    announce: ogłaszać [i], ogłosić [p], zapowiadać [i] (let know), zapowiedzieć [p], oznajmiać [i] (tell or declare)
    annoy: irytować [i], zirytować [p], denerwować [i], zdenerwować [p], przeszkadzać [i] (bother)
    answer: odpowiadać [i] (a question), odpowiedzieć [p]
    anticipate: przewidywać [i] (foresee), przewidzieć [p], uprzedzać [i] (act in advance), uprzedzić [p], oczekiwać [i] (look forward to)
    appeal: apelować [i] (make an appeal), zaapelować [p], odwoływać się [i] (against a ruling), odwołać się [p], podobać się [i] (be attractive)
    appear: pojawiać się [i] (turn up), pojawić się [p], wydawać się [i] (seem), występować [i] (on stage or in a story), wystąpić [p]
    applaud: oklaskiwać [i], oklaskać [p], klaskać [i], klasnąć [p], chwalić [i] (praise)
    apply: stosować [i] (a rule or method), zastosować [p], ubiegać się [i] (apply for a job), nakładać [i] (spread on a surface), nałożyć [p]
    appoint: mianować [i] (to a post), powoływać [i], powołać [p], wyznaczać [i], wyznaczyć [p]
    appreciate: doceniać [i] (be grateful for), docenić [p], cenić [i] (value)
    approach: podchodzić [i] (come near; tackle a problem), podejść [p], zbliżać się [i] (come near), zbliżyć się [p], zwracać się [i] (a person)
    approve: zatwierdzać [i] (officially), zatwierdzić [p], aprobować [i] (agree with), pochwalać [i] (agree with)
    argue: kłócić się [i] (quarrel), pokłócić się [p], argumentować [i] (reason), twierdzić [i] (claim), dyskutować [i] (debate)
    arise: powstawać [i] (occur), powstać [p], pojawiać się [i] (occur), pojawić się [p], wynikać [i] (result from)
    arrange: układać [i] (put in order), ułożyć [p], organizować [i] (plan an event), zorganizować [p], umawiać [i] (a meeting)
    arrest: aresztować [i], zatrzymywać [i] (detain), zatrzymać [p]
    arrive: przyjeżdżać [i] (by vehicle), przyjechać [p], przychodzić [i] (on foot), przyjść [p], docierać [i] (reach)
    articulate: wymawiać [i] (pronounce), wymówić [p], wyrażać [i] (express clearly), wyrazić [p], artykułować [i] (utter clearly)
    ascend: wznosić się [i] (rise), wznieść się [p], wspinać się [i] (climb a mountain), wspiąć się [p]
    ask: pytać [i] (a question), zapytać [p], spytać [p], prosić [i] (for something), poprosić [p]
    ask for: prosić [i] (request), poprosić [p], żądać [i] (demand), zażądać [p], domagać się [i] (demand)
    aspire: dążyć [i], aspirować [i], pragnąć [i]
    assemble: składać [i] (parts), złożyć [p], montować [i] (parts), zmontować [p], zbierać się [i] (come together)
    assert: twierdzić [i], stwierdzać [i], stwierdzić [p], oświadczać [i], upierać się [i] (insist)
    assess: oceniać [i], ocenić [p], szacować [i] (estimate), oszacować [p]
    assign: przydzielać [i] (a task), przydzielić [p], przypisywać [i] (to a category), przypisać [p], zlecać [i] (entrust a task)
    assimilate: przyswajać [i] (take in), przyswoić [p], asymilować [i], zasymilować [p]
    assist: pomagać [i], pomóc [p], wspomagać [i], asystować [i]
    associate: kojarzyć [i] (link in the mind), skojarzyć [p], wiązać [i] (link), powiązać [p], zadawać się [i] (keep company)
    assume: zakładać [i] (suppose), założyć [p], przypuszczać [i] (suppose), przyjmować [i] (take on a duty), przyjąć [p]
    assure: zapewniać [i] (promise), zapewnić [p], gwarantować [i], zagwarantować [p]
    astonish: zdumiewać [i], zdumieć [p], zaskakiwać [i], zaskoczyć [p]
    attach: przyczepiać [i] (fasten; stick on), przyczepić [p], dołączać [i] (a file to an email), dołączyć [p], załączać [i] (enclose with a document)
    attack: atakować [i], zaatakować [p], napadać [i] (assault someone), napaść [p]
    attain: osiągać [i], osiągnąć [p], zdobywać [i], zdobyć [p]
    attempt: próbować [i], spróbować [p], usiłować [i], starać się [i], postarać się [p]
    attend: uczestniczyć [i] (an event), uczęszczać [i] (school regularly), chodzić [i] (a class; a school or workplace), zajmować się [i] (take care of), zająć się [p]
    attract: przyciągać [i] (attention), przyciągnąć [p], pociągać [i] (charm), urzekać [i] (charm), urzec [p]
    attribute: przypisywać [i] (put down to a cause; ascribe a quality), przypisać [p]
    audit: kontrolować [i] (examine accounts), skontrolować [p], badać [i] (accounts), zbadać [p], audytować [i]
    authorize: upoważniać [i], upoważnić [p], zezwalać [i] (officially), zezwolić [p], autoryzować [i]
    avoid: unikać [i], uniknąć [p], omijać [i] (sidestep), ominąć [p], wystrzegać się [i] (refrain from)
    award: przyznawać [i] (a prize; a claim), przyznać [p], nagradzać [i] (give a prize to someone), nagrodzić [p]
    back up: wspierać [i] (support someone), wesprzeć [p], popierać [i] (a claim), poprzeć [p], archiwizować [i] (back up data)
    bake: piec [i], upiec [p], wypiekać [i], wypiec [p]
    balance: równoważyć [i] (offset), zrównoważyć [p], balansować [i] (be in balance), bilansować [i] (a budget), zbilansować [p]
    ban: zakazywać [i], zakazać [p], zabraniać [i], zabronić [p]
    bandage: bandażować [i], zabandażować [p], opatrywać [i] (treat a wound), opatrzyć [p], obwiązywać [i] (wrap with a bandage)
    bang: uderzać [i] (hit hard; knock against something), uderzyć [p], walić [i] (on a door), trzaskać [i] (with a bang), trzasnąć [p]
    baptize: chrzcić [i], ochrzcić [p]
    bargain: targować się [i] (haggle), potargować się [p], negocjować [i] (negotiate), wynegocjować [p]
    bark: szczekać [i], szczeknąć [p], zaszczekać [p]
    base: opierać [i] (found on), oprzeć [p], bazować [i] (be based on), opierać się [i] (be based on; rest on), oprzeć się [p]
    bathe: kąpać się [i], wykąpać się [p], kąpać [i] (bathe someone; wash a child), wykąpać [p]
    battle: walczyć [i], zmagać się [i] (struggle), borykać się [i] (struggle), toczyć [i] (wage a battle), stoczyć [p]
    be: być [i], istnieć [i] (exist), znajdować się [i] (be located), stawać się [i] (become), stać się [p]
    bear: znosić [i] (endure), znieść [p], nosić [i] (carry), rodzić [i] (give birth), urodzić [p]
    beat: pokonywać [i] (defeat), pokonać [p], bić [i] (hit), pobić [p] (thrash), ubijać [i] (whisk eggs)
    beautify: upiększać [i], upiększyć [p], ozdabiać [i] (decorate), ozdobić [p]
    beg: błagać [i] (implore), ubłagać [p], prosić [i] (plead), poprosić [p] (plead)
    begin: zaczynać [i] (start something), zacząć [p], rozpoczynać [i], rozpocząć [p], zaczynać się [i] (it starts)
    belch: bekać [i], beknąć [p]
    believe: wierzyć [i], uwierzyć [p], sądzić [i] (think), uważać [i] (hold the opinion), ufać [i] (trust)
    belong: należeć [i] (a group), przynależeć [i]
    bend: zginać [i] (a limb), zgiąć [p], schylać się [i] (bend down), schylić się [p], wyginać [i] (curve)
    bet: zakładać się [i] (stake money), założyć się [p], obstawiać [i], obstawić [p], stawiać [i] (stake)
    bid: licytować [i], zalicytować [p], oferować [i] (offer a price), zaoferować [p], proponować [i]
    bill: fakturować [i] (invoice for a service), zafakturować [p], obciążać [i] (charge a fee), obciążyć [p], naliczać [i]
    bind: wiązać [i], związać [p], zobowiązywać [i] (oblige by contract), zobowiązać [p]
    bite: gryźć [i], ugryźć [p], kąsać [i] (snap at), ukąsić [p]
    blackmail: szantażować [i], zaszantażować [p], wymuszać [i] (extort money), wymusić [p]
    blame: obwiniać [i], obwinić [p], winić [i], ganić [i] (reproach), zganić [p]
    bleach: wybielać [i], wybielić [p], rozjaśniać [i] (hair), rozjaśnić [p]
    bleed: krwawić [i], wykrwawiać się [i], wykrwawić się [p]
    blend: mieszać [i], wymieszać [p], miksować [i], zmiksować [p], wtapiać się [i] (blend in)
    bless: błogosławić [i], pobłogosławić [p]
    blink: mrugać [i], mrugnąć [p], migać [i] (flash, as a light), mignąć [p], migotać [i] (flicker)
    block: blokować [i], zablokować [p], zatykać [i] (a pipe), zatkać [p], tarasować [i] (a road)
    bloom: kwitnąć [i], zakwitnąć [p], rozkwitać [i], rozkwitnąć [p]
    blossom: kwitnąć [i], zakwitnąć [p], rozkwitać [i] (flourish; thrive), rozkwitnąć [p], prosperować [i] (thrive)
    blow: wiać [i] (of wind), dmuchać [i], dmuchnąć [p], zdmuchiwać [i] (blow away), zdmuchnąć [p]
    blur: rozmywać [i] (make blurry), rozmyć [p], rozmazywać [i] (smudge), rozmazać [p], zacierać [i] (make unclear)
    board: wsiadać [i] (a ship or plane), wsiąść [p]
    boast: chwalić się [i], pochwalić się [p], przechwalać się [i], popisywać się [i] (swagger), szczycić się [i]
    boil: gotować [i] (boil something; cook in water), ugotować [p], zagotować [p] (bring to the boil), gotować się [i] (water boils), wrzeć [i]
    bond: łączyć [i], połączyć [p], sklejać [i] (glue together), zżywać się [i] (form a close relationship), zżyć się [p]
    book: rezerwować [i], zarezerwować [p], zamawiać [i], zamówić [p]
    boost: zwiększać [i], zwiększyć [p], pobudzać [i] (an economy), pobudzić [p], wzmacniać [i]
    bore: nudzić [i] (make bored), znudzić [p], nudzić się [i] (be bored), wiercić [i] (drill a hole), wywiercić [p]
    bother: przeszkadzać [i] (disturb), przeszkodzić [p], niepokoić [i] (trouble), zaniepokoić [p], kłopotać [i] (trouble someone)
    bounce: odbijać się [i] (rebound, as a ball), odbić się [p], podskakiwać [i] (jump), podskoczyć [p], odbijać [i] (make bounce)
    bow: kłaniać się [i], ukłonić się [p], pochylać [i] (the head; bend), pochylić [p], ustępować [i] (yield)
    boycott: bojkotować [i], zbojkotować [p]
    brag: przechwalać się [i], chwalić się [i], pochwalić się [p], chełpić się [i], popisywać się [i]
    brake: hamować [i], zahamować [p], zwalniać [i] (slow down), zwolnić [p]
    break: łamać [i] (bones or sticks), złamać [p], psuć [i] (damage), zepsuć [p], rozbijać [i] (glass or plates)
    breathe: oddychać [i], odetchnąć [p], wdychać [i] (breathe in), wydychać [i] (breathe out)
    brew: zaparzać [i] (tea), zaparzyć [p], parzyć [i] (tea or coffee), warzyć [i] (beer), uwarzyć [p]
    bribe: przekupywać [i], przekupić [p]
    bring: przynosić [i] (bring here), przynieść [p], przywozić [i] (by vehicle), przywieźć [p], przyprowadzać [i] (bring a person)
    bring up: wychowywać [i] (children), wychować [p], poruszać [i] (a topic), poruszyć [p], wspominać [i] (mention)
    broadcast: nadawać [i] (on TV), nadać [p], transmitować [i] (live), emitować [i] (a TV program), wyemitować [p]
    broaden: poszerzać [i] (a road), poszerzyć [p], rozszerzać [i], rozszerzyć [p]
    browse: przeglądać [i] (flip through; web pages), przejrzeć [p], surfować [i] (the web), rozglądać się [i] (look around a shop), rozejrzeć się [p]
    bruise: posiniaczyć [p] (a body part), obijać [i] (hurt; of fruit), obić [p]
    brush: szczotkować [i] (teeth or shoes), wyszczotkować [p], czesać [i] (hair), muskać [i] (touch lightly), musnąć [p]
    bubble: bulgotać [i], musować [i] (fizz), kipieć [i] (seethe)
    buckle: zapinać [i] (a belt; a seat belt), zapiąć [p], uginać się [i] (give way), ugiąć się [p], wyginać się [i] (warp under pressure)
    build: budować [i], zbudować [p], wznosić [i] (erect), wznieść [p], tworzyć [i] (make; a relationship)
    bully: gnębić [i], dręczyć [i], zastraszać [i] (intimidate), zastraszyć [p], prześladować [i] (threaten; harass)
    burden: obciążać [i] (weigh down), obciążyć [p], obarczać [i] (impose on), obarczyć [p], ponosić [i] (bear a cost)
    burn: palić [i] (set fire to; burn something), spalić [p], płonąć [i] (be on fire), spłonąć [p], podpalać [i] (set fire to)
    burst: pękać [i] (burst open), pęknąć [p], wybuchać [i] (explode), wybuchnąć [p], rozrywać [i] (make burst)
    bury: chować [i] (at a funeral), pochować [p], zakopywać [i] (hide in the ground), zakopać [p], grzebać [i]
    buy: kupować [i], kupić [p], nabywać [i] (formal), nabyć [p]
    buzz: brzęczeć [i] (a buzzer), zabrzęczeć [p], bzyczeć [i] (hum or drone), szumieć [i] (buzz with voices)
    cage: zamykać [i] (lock in a cage), zamknąć [p], więzić [i] (confine), uwięzić [p]
    calculate: obliczać [i], obliczyć [p], liczyć [i], policzyć [p], kalkulować [i] (estimate costs)
    call: dzwonić [i] (phone), zadzwonić [p], nazywać [i] (name), nazwać [p], wołać [i] (summon)
    calm: uspokajać [i] (soothe someone), uspokoić [p], uspokajać się [i] (calm down), uspokoić się [p], koić [i] (soothe)
    camp: biwakować [i], obozować [i]
    can: móc [i] (be able to; be allowed to), umieć [i] (know how to), potrafić [i] (be able to manage), zdołać [p] (manage to)
    cancel: anulować [i] (an order; a subscription), odwoływać [i] (an event), odwołać [p], unieważniać [i] (a contract), unieważnić [p]
    capture: chwytać [i], schwytać [p] (capture a person), zdobywać [i] (a place), zdobyć [p], uchwycić [p] (an image or moment)
    care: dbać [i] (look after), zadbać [p], troszczyć się [i] (care about), opiekować się [i] (take care of; nurse), przejmować się [i] (worry)
    caress: pieścić [i], popieścić [p], głaskać [i], pogłaskać [p]
    carry: nosić [i] (have with you), nieść [i] (in the hands), zanieść [p] (carry to a place), dźwigać [i] (a heavy load), wozić [i] (transport)
    carry out: wykonywać [i] (a task), wykonać [p], przeprowadzać [i], przeprowadzić [p], realizować [i]
    carve: rzeźbić [i] (wood; stone; sculpt), wyrzeźbić [p], kroić [i] (carve meat), pokroić [p], wycinać [i] (engrave)
    cash: realizować [i] (a cheque), zrealizować [p], spieniężać [i], spieniężyć [p], wymieniać [i] (exchange money)
    cast: rzucać [i], rzucić [p], obsadzać [i] (actors in a play), obsadzić [p], odlewać [i] (metal)
    catch: łapać [i], złapać [p], chwytać [i] (a ball), chwycić [p], zarazić się [p] (an illness)
    categorize: kategoryzować [i], klasyfikować [i], sklasyfikować [p], sortować [i] (sort), posortować [p]
    cause: powodować [i], spowodować [p], wywoływać [i] (trigger), wywołać [p], sprawiać [i] (bring about)
    cease: przestawać [i], przestać [p], zaprzestawać [i] (stop an activity), zaprzestać [p], ustawać [i] (come to an end)
    celebrate: świętować [i], obchodzić [i] (commemorate), czcić [i] (honor), uczcić [p] (honor), celebrować [i] (a ritual)
    chain: przykuwać [i] (bind in chains), przykuć [p], zakuwać [i] (with a chain), zakuć [p]
    challenge: kwestionować [i] (dispute a claim), zakwestionować [p], podważać [i] (doubt), podważyć [p], wyzywać [i] (to a fight)
    change: zmieniać [i], zmienić [p], zmieniać się [i] (become different), wymieniać [i] (replace), wymienić [p]
    chant: skandować [i] (repeat slogans), śpiewać [i], zaśpiewać [p], intonować [i], recytować [i] (recite in a murmur)
    charge: pobierać [i] (a fee), pobrać [p], ładować [i] (a battery), naładować [p], oskarżać [i] (accuse formally; a crime)
    charm: czarować [i], oczarować [p], urzekać [i] (delight), urzec [p], zaczarować [p] (cast a spell)
    chase: gonić [i] (run after), ścigać [i], uganiać się [i]
    chat: rozmawiać [i], porozmawiać [p], gadać [i] (informal), pogadać [p], czatować [i] (online)
    chatter: trajkotać [i], gadać [i], szczebiotać [i] (birds), ćwierkać [i] (birds)
    cheat: oszukiwać [i] (at games), oszukać [p], ściągać [i] (in exams), zdradzać [i] (cheat on a partner), zdradzić [p]
    check: sprawdzać [i], sprawdzić [p], kontrolować [i], skontrolować [p], weryfikować [i]
    cheer: dopingować [i] (encourage), wiwatować [i] (shout with joy), pocieszać [i] (comfort), pocieszyć [p], rozweselać [i] (cheer up)
    cherish: cenić [i] (value highly), pielęgnować [i] (a hope or feeling), żywić [i] (a hope or feeling), hołubić [i] (keep dear), kochać [i] (love dearly)
    chew: żuć [i], przeżuwać [i], przeżuć [p], gryźć [i]
    chill: schładzać [i] (cool down), schłodzić [p], relaksować się [i] (relax), zrelaksować się [p], wyluzować się [p] (relax, informal)
    choke: dusić [i] (strangle), udusić [p], dusić się [i] (suffocate), krztusić się [i] (choke on food or smoke), zakrztusić się [p]
    choose: wybierać [i], wybrać [p]
    chop: siekać [i] (mince), posiekać [p], rąbać [i] (chop firewood), porąbać [p], kroić [i] (food)
    circle: okrążać [i] (go around), okrążyć [p], krążyć [i] (move in a circle; fly in circles), zakreślać [i] (mark with a circle), zakreślić [p]
    circulate: krążyć [i], rozpowszechniać [i] (spread around), rozpowszechnić [p], rozprowadzać [i] (goods), rozprowadzić [p]
    cite: cytować [i], zacytować [p], przytaczać [i] (give as evidence; name as an example), przytoczyć [p], powoływać się [i] (on)
    claim: twierdzić [i] (assert), domagać się [i] (demand a right), żądać [i] (demand), zażądać [p], zgłaszać [i] (claim money)
    clap: klaskać [i] (clap hands), klasnąć [p], oklaskiwać [i], klepać [i] (pat), klepnąć [p]
    clarify: wyjaśniać [i] (by investigation), wyjaśnić [p], objaśniać [i] (explain), precyzować [i], sprecyzować [p]
    clash: ścierać się [i] (conflict), zetrzeć się [p], zderzać się [i] (collide), zderzyć się [p], kolidować [i] (be at odds)
    clasp: ściskać [i] (hold tightly), ścisnąć [p], zaciskać [i] (close the hand around), zacisnąć [p], splatać [i] (hands)
    classify: klasyfikować [i] (into groups), sklasyfikować [p], kwalifikować [i] (rate), zakwalifikować [p], segregować [i]
    clean: czyścić [i], wyczyścić [p], sprzątać [i], posprzątać [p], myć [i] (wash)
    clean up: sprzątać [i], posprzątać [p], porządkować [i] (tidy), uporządkować [p], oczyszczać [i] (make clean)
    cleanse: oczyszczać [i] (purify), oczyścić [p], przemywać [i] (wash), przemyć [p]
    clear: oczyszczać [i] (a room or space; empty), oczyścić [p], usuwać [i] (remove; clear away), usunąć [p], wypogadzać się [i] (the sky; the weather clears)
    clench: zaciskać [i] (a fist; teeth), zacisnąć [p], ściskać [i], ścisnąć [p]
    click: klikać [i] (click on something), kliknąć [p], pstrykać [i] (fingers; make a click), pstryknąć [p], cmokać [i] (tongue)
    climb: wspinać się [i] (a mountain), wspiąć się [p], wchodzić [i] (go up), wejść [p], wdrapywać się [i] (clamber up)
    clip: przycinać [i] (trim; cut back), przyciąć [p], przypinać [i] (fasten with a clip), przypiąć [p], wycinać [i] (cut out)
    clog: zatykać [i] (obstruct a passage), zatkać [p], zapychać [i] (block), zapchać [p], zatykać się [i] (become clogged)
    clone: klonować [i], sklonować [p]
    close: zamykać [i] (a door or window; eyes or a book), zamknąć [p], zamykać się [i] (it closes), zamknąć się [p]
    clutch: chwytać [i] (grab), chwycić [p], ściskać [i] (hold tightly), ścisnąć [p], trzymać się [i] (hold on to)
    coach: trenować [i] (train), wytrenować [p], szkolić [i], wyszkolić [p], instruować [i]
    coax: namawiać [i] (persuade), namówić [p], nakłaniać [i], nakłonić [p], zwabiać [i] (lure)
    code: programować [i] (write programs), zaprogramować [p], kodować [i] (encode), zakodować [p], szyfrować [i]
    coincide: zbiegać się [i] (at the same time), zbiec się [p], pokrywać się [i] (match; overlap in time), pokryć się [p], zgadzać się [i] (match)
    collaborate: współpracować [i], współdziałać [i], współtworzyć [i] (produce jointly)
    collapse: zawalać się [i] (a structure), zawalić się [p], załamywać się [i] (give way; fail), załamać się [p], zasłabnąć [p] (a person; medical)
    collect: zbierać [i] (gather), zebrać [p], kolekcjonować [i] (as a hobby), odbierać [i] (pick up), odebrać [p]
    collide: zderzać się [i], zderzyć się [p], kolidować [i]
    color: kolorować [i] (colour in a picture), pokolorować [p], farbować [i] (dye), ufarbować [p], barwić [i] (tint)
    comb: czesać [i], uczesać [p], przeczesywać [i] (comb through a place), przeczesać [p]
    combat: zwalczać [i] (stamp out a problem), zwalczyć [p], walczyć [i] (against), przeciwdziałać [i] (counter), przeciwstawiać się [i] (confront)
    combine: łączyć [i] (link), połączyć [p], scalać [i] (merge), scalić [p], zestawiać [i] (put together)
    come: przychodzić [i] (on foot), przyjść [p], przyjeżdżać [i] (by vehicle), przyjechać [p], pochodzić [i] (come from)
    come back: wracać [i] (come again; return home), wrócić [p], powracać [i], powrócić [p]
    come in: wchodzić [i] (step in), wejść [p]
    comfort: pocieszać [i], pocieszyć [p], pokrzepiać [i], pokrzepić [p], koić [i]
    command: rozkazywać [i] (order), rozkazać [p], nakazywać [i], nakazać [p], dowodzić [i] (lead troops; an army)
    commemorate: upamiętniać [i], upamiętnić [p], czcić [i] (honor the dead), uczcić [p], obchodzić [i] (an anniversary)
    comment: komentować [i], skomentować [p], zauważać [i] (remark), zauważyć [p], wypowiadać się [i] (state)
    commit: popełniać [i] (a crime or mistake), popełnić [p], zobowiązywać się [i] (commit to a promise), zobowiązać się [p], angażować się [i] (commit to a task)
    communicate: komunikować się [i] (understand each other), porozumiewać się [i], porozumieć się [p], przekazywać [i] (convey), przekazać [p]
    compare: porównywać [i], porównać [p], zestawiać [i], zestawić [p]
    compensate: rekompensować [i], zrekompensować [p], wynagradzać [i] (pay for a loss), wynagrodzić [p], wyrównywać [i] (make up for)
    compete: konkurować [i], rywalizować [i], współzawodniczyć [i], startować [i] (enter a contest), wystartować [p]
    compile: kompilować [i] (source code), skompilować [p], zestawiać [i] (a list), zestawić [p], opracowywać [i] (a reference book)
    complete: kończyć [i], skończyć [p], ukończyć [p], wypełniać [i] (a form), wypełnić [p]
    complicate: komplikować [i], skomplikować [p], komplikować się [i] (get complicated), skomplikować się [p], gmatwać [i] (get tangled up)
    compliment: chwalić [i], pochwalić [p], komplementować [i], schlebiać [i] (flatter), pochlebiać [i] (flatter)
    comply: stosować się [i] (rules), zastosować się [p], przestrzegać [i] (rules), spełniać [i] (a request), spełnić [p]
    compose: komponować [i] (music), skomponować [p], układać [i] (a poem), ułożyć [p], pisać [i] (a text)
    comprise: obejmować [i] (include), objąć [p], zawierać [i] (contain), składać się [i] (consist of), stanowić [i] (make up a share)
    compute: obliczać [i] (in computing), obliczyć [p], wyliczać [i], wyliczyć [p], liczyć [i]
    conceal: ukrywać [i], ukryć [p], zatajać [i] (a fact), zataić [p], skrywać [i]
    concede: przyznawać [i] (admit a point), przyznać [p], ustępować [i] (give ground; yield), ustąpić [p], uznawać [i] (admit defeat)
    conceive: wymyślać [i] (devise an idea), wymyślić [p], obmyślać [i] (plan), obmyślić [p], począć [p] (a child)
    conclude: kończyć [i] (finish off), zakończyć [p], wnioskować [i] (infer), wywnioskować [p], zawierać [i] (a deal)
    condemn: potępiać [i], potępić [p], skazywać [i] (sentence), skazać [p]
    conduct: prowadzić [i] (lead; guide), przeprowadzać [i] (a study; a survey), przeprowadzić [p], dyrygować [i] (an orchestra), kierować [i] (lead)
    confess: przyznawać się [i] (to police; a crime), przyznać się [p], wyznawać [i] (admit), wyznać [p], spowiadać się [i] (to a priest)
    configure: konfigurować [i], skonfigurować [p], ustawiać [i], ustawić [p]
    confirm: potwierdzać [i] (reaffirm; back up with evidence), potwierdzić [p], utwierdzać [i] (reaffirm), utwierdzić [p]
    confront: konfrontować [i], skonfrontować [p], mierzyć się [i] (face a problem), zmierzyć się [p], przeciwstawiać się [i] (stand up to)
    confuse: mylić [i] (mistake one for another), pomylić [p], mieszać [i] (mix up two things), dezorientować [i] (bewilder), zdezorientować [p]
    congratulate: gratulować [i], pogratulować [p], winszować [i], powinszować [p]
    connect: łączyć [i], połączyć [p], podłączać [i] (to a device), podłączyć [p], łączyć się [i] (online)
    conquer: podbijać [i] (win supremacy), podbić [p], zdobywać [i] (a place), zdobyć [p], pokonywać [i] (overcome)
    consent: zgadzać się [i], zgodzić się [p], przystawać [i] (agree to), przystać [p], pozwalać [i] (allow)
    conserve: oszczędzać [i] (save resources), oszczędzić [p], chronić [i] (protect nature), zachowywać [i] (preserve), zachować [p]
    consider: rozważać [i] (think over), rozważyć [p], uwzględniać [i] (take into account), uznawać [i] (regard as), uznać [p]
    consist: składać się [i] (consist of; be made up of), polegać [i] (consist in)
    console: pocieszać [i], pocieszyć [p], pokrzepiać [i] (lift the spirits), pokrzepić [p], ukoić [p] (comfort)
    consolidate: konsolidować [i], skonsolidować [p], umacniać [i] (strengthen), umocnić [p], scalać [i] (merge)
    conspire: spiskować [i] (plot with others), knuć [i] (plot), uknuć [p], zmawiać się [i] (plot against), zmówić się [p]
    constitute: stanowić [i] (make up; amount to), tworzyć [i] (make up), ustanawiać [i] (establish), ustanowić [p]
    construct: budować [i], zbudować [p], konstruować [i], skonstruować [p], montować [i] (assemble)
    consult: konsultować się [i] (an expert), skonsultować się [p], radzić się [i] (ask for advice), poradzić się [p], zaglądać [i] (look up in a book)
    consume: spożywać [i] (eat or drink), spożyć [p], zużywać [i] (use up), zużyć [p], pochłaniać [i] (use up)
    contact: kontaktować się [i], skontaktować się [p], odzywać się [i] (get in touch), odezwać się [p]
    contain: zawierać [i] (hold as an ingredient), mieścić [i] (hold), pomieścić [p], powstrzymywać [i] (keep in check), powstrzymać [p]
    contemplate: rozważać [i] (reflect on), rozważyć [p], rozmyślać [i] (think deeply), kontemplować [i] (meditate), wpatrywać się [i] (gaze at)
    contend: twierdzić [i] (maintain; assert), rywalizować [i] (compete), walczyć [i] (struggle), zmagać się [i] (struggle), utrzymywać [i] (assert)
    continue: kontynuować [i] (carry on with), trwać [i] (go on), ciągnąć [i] (go on with)
    contradict: zaprzeczać [i] (deny), zaprzeczyć [p], przeczyć [i] (be inconsistent with), sprzeciwiać się [i] (argue against), sprzeciwić się [p]
    contrast: kontrastować [i] (stand in contrast), przeciwstawiać [i] (set side by side), przeciwstawić [p], zestawiać [i], zestawić [p]
    contribute: przyczyniać się [i], przyczynić się [p], wnosić [i] (a contribution), wnieść [p], wpłacać [i] (money)
    control: kontrolować [i], sterować [i] (a machine; a device), kierować [i] (manage), panować [i] (dominate), regulować [i] (regulate)
    converge: zbiegać się [i] (math; roads or rivers join), zbiec się [p], schodzić się [i] (meet at one point), zejść się [p]
    convert: zamieniać [i] (units, money), zamienić [p], konwertować [i] (files; units), przekonwertować [p], nawracać [i] (religion)
    convey: przekazywać [i] (pass on a message), przekazać [p], wyrażać [i] (express), wyrazić [p], przewozić [i] (carry)
    convince: przekonywać [i], przekonać [p], przekonywać się [i] (be convinced), przekonać się [p]
    cook: gotować [i], ugotować [p], przyrządzać [i] (prepare food), przyrządzić [p], dogotować [p] (cook through)
    cool: chłodzić [i] (make cold), ochłodzić [p], stygnąć [i] (become cold; let cool down), ostygnąć [p], ochładzać się [i] (get cool)
    cooperate: współpracować [i], współdziałać [i], kooperować [i]
    coordinate: koordynować [i], skoordynować [p], uzgadniać [i] (align with others), uzgodnić [p], dopasowywać [i] (match)
    cope: uporać się [p] (deal with), podołać [p] (manage), zmagać się [i] (deal with), znosić [i] (get through)
    copy: kopiować [i], skopiować [p], przepisywać [i] (by hand), przepisać [p], naśladować [i] (imitate)
    correct: poprawiać [i] (fix an error), poprawić [p], korygować [i] (revise), skorygować [p], sprostować [p] (a statement)
    correspond: odpowiadać [i] (match), korespondować [i] (exchange letters), zgadzać się [i] (agree), pokrywać się [i] (match)
    corrupt: korumpować [i] (bribe), skorumpować [p], demoralizować [i] (morally), uszkadzać [i] (data), uszkodzić [p]
    cost: kosztować [i] (money or time), wymagać [i] (require), pochłaniać [i] (take money or time), pochłonąć [p]
    cough: kaszleć [i], kaszlnąć [p], zakaszleć [p] (have a coughing fit), odchrząkiwać [i] (clear the throat), odchrząknąć [p]
    counsel: doradzać [i], doradzić [p], radzić [i], poradzić [p], zalecać [i]
    count: liczyć [i] (add up), policzyć [p], zliczać [i] (add up), zliczyć [p], polegać [i] (count on)
    counterfeit: podrabiać [i] (imitate illegally), podrobić [p], fałszować [i] (fake or lie; alter), sfałszować [p]
    court: zalecać się [i] (chase after), adorować [i], umizgać się [i] (flatter)
    cover: przykrywać [i] (with a blanket; hide), przykryć [p], pokrywać [i] (costs), pokryć [p], omawiać [i] (a topic)
    crack: pękać [i] (of glass; of skin or walls), pęknąć [p], łamać [i] (a code), złamać [p], rozbijać [i] (an egg or nut)
    crash: rozbijać się [i] (a plane; aircraft), rozbić się [p], zawieszać się [i] (a computer), zawiesić się [p], załamywać się [i] (markets)
    crave: pragnąć [i], łaknąć [i], tęsknić [i] (long for)
    crawl: raczkować [i] (like a baby), czołgać się [i] (move on the belly), pełzać [i]
    create: tworzyć [i], stworzyć [p], utworzyć [p] (a file or document in software), wytwarzać [i], wytworzyć [p]
    credit: zaliczać [i] (count towards), zaliczyć [p], zasilać [i] (an account; an amount), zasilić [p], przypisywać [i] (give credit for)
    criticize: krytykować [i], skrytykować [p], ganić [i], recenzować [i] (review), obgadywać [i] (speak ill of)
    cross: przechodzić [i] (a street), przejść [p], przekraczać [i] (a border), przekroczyć [p], przemierzać [i] (a region)
    crush: miażdżyć [i] (smash; overwhelm), zmiażdżyć [p], rozgniatać [i] (squash; mash), rozgnieść [p], kruszyć [i] (grind to pieces)
    cry: płakać [i] (weep), zapłakać [p], krzyczeć [i] (shout), krzyknąć [p], wrzeszczeć [i] (shout, informal)
    cultivate: uprawiać [i] (crops; land), uprawić [p], pielęgnować [i] (a friendship or skill; nurture), rozwijać [i] (develop a quality), rozwinąć [p]
    cure: leczyć [i] (treat), wyleczyć [p], zdrowieć [i] (get well), wyzdrowieć [p], peklować [i] (preserve meat)
    curl: kręcić [i] (hair), zakręcić [p], zwijać [i] (roll), zwinąć [p], zwijać się [i] (curl up)
    curse: przeklinać [i] (swear at; put a curse on), przekląć [p], kląć [i] (swear), zakląć [p] (swear), złorzeczyć [i] (put a curse on)
    cushion: amortyzować [i] (absorb a shock), zamortyzować [p], łagodzić [i] (soften a blow), złagodzić [p], wyściełać [i] (pad)
    customize: personalizować [i], spersonalizować [p], dostosowywać [i] (tailor to needs), dostosować [p], dopasowywać [i]
    cut: ciąć [i] (with a knife), przeciąć [p] (cut in two), kroić [i] (slice food), pokroić [p], obcinać [i] (grass or hair)
    cut off: odcinać [i] (a supply or road; separate), odciąć [p], odłączać [i] (a supply), odłączyć [p], ucinać [i] (chop off)
    damage: uszkadzać [i], uszkodzić [p], niszczyć [i], zniszczyć [p], szkodzić [i] (be harmful)
    dance: tańczyć [i], zatańczyć [p], potańczyć [p] (dance for a while)
    dare: odważać się [i], odważyć się [p], ośmielać się [i], ośmielić się [p], śmieć [i]
    darken: ciemnieć [i] (grow dim), pociemnieć [p], ściemniać [i] (stage lights), ściemnić [p], zachmurzać się [i] (cloud over)
    darn: cerować [i] (mend socks), zacerować [p], łatać [i] (patch), załatać [p], zszywać [i] (stitch)
    dash: pędzić [i], popędzić [p], biec [i], pobiec [p], spieszyć się [i] (hurry)
    dazzle: olśniewać [i] (overwhelm), olśnić [p], oślepiać [i] (blind with light), oślepić [p], oszałamiać [i] (bewilder)
    deal: zajmować się [i] (deal with a matter), zająć się [p], rozdawać [i] (cards), rozdać [p], handlować [i] (trade in goods)
    debate: debatować [i], dyskutować [i], przedyskutować [p] (discuss in detail), omawiać [i], omówić [p]
    debug: debugować [i], odpluskwiać [i], odpluskwić [p]
    decay: gnić [i] (rot), zgnić [p], rozkładać się [i] (break down), rozłożyć się [p], próchnieć [i] (rot away)
    deceive: oszukiwać [i], oszukać [p], okłamywać [i], okłamać [p], zwodzić [i]
    decide: decydować [i], zdecydować [p], postanawiać [i] (resolve to do), postanowić [p], decydować się [i] (make up one's mind)
    decipher: odszyfrowywać [i], odszyfrować [p], rozszyfrowywać [i], rozszyfrować [p], odczytywać [i]
    declare: ogłaszać [i] (proclaim), ogłosić [p], oświadczać [i] (state), oświadczyć [p], deklarować [i] (goods, to customs or tax)
    decline: odmawiać [i] (refuse; an invitation), odmówić [p], odrzucać [i] (turn down formally), odrzucić [p], maleć [i] (decrease; go down)
    decorate: dekorować [i], udekorować [p], ozdabiać [i], ozdobić [p], zdobić [i]
    decrease: zmniejszać [i] (make less; reduce), zmniejszyć [p], maleć [i] (become less), zmaleć [p], spadać [i] (fall)
    decrypt: deszyfrować [i], odszyfrowywać [i], odszyfrować [p], odkodowywać [i] (decode), odkodować [p]
    dedicate: poświęcać [i] (devote time), poświęcić [p], dedykować [i] (a book; a work), zadedykować [p], ofiarowywać [i] (consecrate)
    deduct: odliczać [i] (for tax), odliczyć [p], odejmować [i] (subtract), odjąć [p], potrącać [i] (from pay)
    deem: uznawać [i] (regard as), uznać [p], uważać [i], mniemać [i] (formal), sądzić [i]
    defeat: pokonywać [i], pokonać [p], zwyciężać [i] (win over), zwyciężyć [p], rozgromić [p] (crush)
    defend: bronić [i] (protect; in court), obronić [p], chronić [i] (protect), ochronić [p], bronić się [i] (defend oneself)
    defer: odkładać [i] (put off), odłożyć [p], odraczać [i] (postpone), odroczyć [p], przekładać [i] (a meeting)
    define: definiować [i], zdefiniować [p], określać [i], określić [p], wyznaczać [i] (set)
    deflect: odbijać [i] (bounce back), odbić [p], odpierać [i] (ward off; parry), odeprzeć [p], odwracać [i] (turn aside)
    degrade: poniżać [i] (humiliate; demean), poniżyć [p], degradować [i] (demote), zdegradować [p], pogarszać [i] (make worse)
    delay: opóźniać [i] (hold up), opóźnić [p], odkładać [i] (postpone), odłożyć [p], zwlekać [i] (put off)
    delegate: delegować [i] (send as a representative), oddelegować [p], przekazywać [i] (hand over authority), przekazać [p], powierzać [i] (entrust)
    delete: usuwać [i], usunąć [p], kasować [i], skasować [p], skreślać [i] (cross out)
    deliberate: naradzać się [i] (confer), naradzić się [p], rozważać [i] (think carefully), obradować [i] (in a committee), deliberować [i] (discuss officially)
    delight: zachwycać [i] (make happy), zachwycić [p], cieszyć [i] (make happy), ucieszyć [p], zachwycać się [i] (be delighted)
    deliver: dostarczać [i] (goods), dostarczyć [p], doręczać [i] (post, parcels), wygłaszać [i] (a speech), wygłosić [p]
    demand: żądać [i], zażądać [p], domagać się [i], wymagać [i]
    demolish: burzyć [i], zburzyć [p], wyburzać [i], wyburzyć [p]
    demonstrate: pokazywać [i] (show how something works), pokazać [p], demonstrować [i] (in protest), udowadniać [i] (prove), udowodnić [p]
    denote: oznaczać [i], oznaczyć [p], znaczyć [i], wskazywać [i], wskazać [p]
    denounce: potępiać [i] (condemn publicly), potępić [p], donosić [i] (report to the authorities), donieść [p], piętnować [i] (censure)
    deny: zaprzeczać [i] (say it is not true), zaprzeczyć [p], wypierać się [i] (deny a charge), odmawiać [i] (refuse to give), odmówić [p]
    depend: zależeć [i] (on something), polegać [i] (rely on)
    deploy: wdrażać [i] (software), wdrożyć [p], rozmieszczać [i] (position troops), rozmieścić [p], rozlokowywać [i] (troops)
    deport: deportować [i] (expel from a country), wydalać [i] (expel), wydalić [p], odsyłać [i] (send back), odesłać [p]
    deposit: wpłacać [i] (pay money in), wpłacić [p], deponować [i] (leave for safekeeping), zdeponować [p], osadzać się [i] (sediment)
    deprive: pozbawiać [i] (of a thing; rights), pozbawić [p], odbierać [i] (take away), odebrać [p]
    derive: czerpać [i] (obtain from a source), zaczerpnąć [p], pochodzić [i] (come from), wywodzić się [i] (come from), wyprowadzać [i] (work out a result)
    descend: schodzić [i] (go down), zejść [p], zjeżdżać [i] (go down a slope), zjechać [p], opadać [i] (drop)
    describe: opisywać [i], opisać [p], przedstawiać [i] (depict), przedstawić [p], charakteryzować [i]
    deserve: zasługiwać [i] (be worthy of), zasłużyć [p]
    design: projektować [i], zaprojektować [p], konstruować [i] (engineer), skonstruować [p], opracowywać [i] (devise)
    designate: wyznaczać [i] (appoint), wyznaczyć [p], desygnować [i] (name a person), wskazywać [i], wskazać [p]
    desire: pragnąć [i], zapragnąć [p], pożądać [i], chcieć [i] (want), zechcieć [p]
    despise: gardzić [i], pogardzać [i], wzgardzić [p]
    destroy: niszczyć [i], zniszczyć [p], unicestwiać [i] (annihilate), unicestwić [p], rujnować [i] (ruin)
    detect: wykrywać [i], wykryć [p], dostrzegać [i] (notice), dostrzec [p], stwierdzać [i] (find by testing)
    deteriorate: pogarszać się [i] (get worse), pogorszyć się [p], podupadać [i] (decline), podupaść [p], psuć się [i] (quality)
    determine: ustalać [i] (find out), ustalić [p], określać [i] (judge), określić [p], decydować [i] (decide)
    detest: nienawidzić [i] (hate), znienawidzić [p], brzydzić się [i] (loathe), detestować [i]
    devastate: pustoszyć [i] (ravage), spustoszyć [p], dewastować [i], zdewastować [p], zdruzgotać [p] (crush emotionally)
    develop: rozwijać [i] (expand), rozwinąć [p], rozwijać się [i] (grow; progress), opracowywać [i] (a product), wywoływać [i] (photos)
    deviate: odbiegać [i], odbiec [p], zbaczać [i], zboczyć [p], dygresować [i] (digress)
    devour: pożerać [i], pożreć [p] (of animals), pochłaniać [i], pochłonąć [p] (eat up; books)
    diagnose: diagnozować [i], zdiagnozować [p], rozpoznawać [i], rozpoznać [p] (a condition)
    dial: wybierać [i], wybrać [p] (a phone number), dzwonić [i], zadzwonić [p] (make a phone call)
    dictate: dyktować [i], podyktować [p] (say aloud for writing down; prescribe), narzucać [i], narzucić [p] (prescribe; determine)
    die: umierać [i], umrzeć [p], ginąć [i] (perish), zginąć [p] (perish), zdychać [i] (of animals)
    differ: różnić się [i] (become different), rozchodzić się [i] (of opinions), rozejść się [p] (of opinions)
    dig: kopać [i], wykopać [p], odkopywać [i] (unearth), odkopać [p] (unearth), grzebać [i] (informal)
    digest: trawić [i], strawić [p], przyswajać [i] (information), przyswoić [p] (information)
    dilute: rozcieńczać [i], rozcieńczyć [p], rozrzedzać [i], rozrzedzić [p]
    dim: przyciemniać [i], przyciemnić [p] (dim lights; headlights), przygaszać [i], przygasić [p], przygasać [i] (grow dim)
    diminish: zmniejszać [i], zmniejszyć [p], maleć [i] (shrink), zmaleć [p], słabnąć [i] (get weaker)
    dine: obiadować [i], jadać [i] (have a meal), biesiadować [i] (dine with others)
    direct: kierować [i], skierować [p] (steer; aim; lead), reżyserować [i] (a film or play), wyreżyserować [p] (a film or play)
    disable: wyłączać [i], wyłączyć [p] (turn off a function), dezaktywować [i], unieruchamiać [i] (cripple a system), unieruchomić [p] (cripple a system)
    disagree: sprzeciwiać się [i], sprzeciwić się [p], zaprzeczać [i] (contradict someone), różnić się [i] (of opinions), rozbiegać się [i] (opinions differ)
    disappear: znikać [i], zniknąć [p], przepadać [i] (be lost), przepaść [p] (be lost), ginąć [i] (go missing)
    disappoint: rozczarowywać [i], rozczarować [p], zawodzić [i] (let down), zawieść [p] (let down)
    disarm: rozbrajać [i], rozbroić [p] (a bomb; a person; reduce weapons)
    discard: odrzucać [i], odrzucić [p] (reject an idea), wyrzucać [i], wyrzucić [p] (get rid of)
    discharge: zwalniać [i] (dismiss from a job; release), zwolnić [p], rozładowywać [i] (a battery or cargo), rozładować [p], wypisywać [i] (a patient)
    disclose: ujawniać [i], ujawnić [p], wyjawiać [i] (reveal a secret), wyjawić [p], zdradzać [i] (give away a secret)
    disconnect: odłączać [i], odłączyć [p], rozłączać [i], rozłączyć [p], odcinać [i] (cut off power)
    discourage: zniechęcać [i], zniechęcić [p], odradzać [i] (advise against), odradzić [p], odwodzić [i] (talk out of)
    discover: odkrywać [i], odkryć [p], dowiadywać się [i] (find out; learn), dowiedzieć się [p] (find out; learn)
    discredit: dyskredytować [i], zdyskredytować [p], oczerniać [i] (slander), oczernić [p] (slander)
    discuss: omawiać [i], omówić [p], dyskutować [i], przedyskutować [p], debatować [i]
    disguise: maskować [i], zamaskować [p] (camouflage or fake), przebierać [i], przebrać [p] (change one's appearance), ukrywać [i] (hide the truth)
    disgust: obrzydzać [i], obrzydzić [p], zniesmaczać [i], zniesmaczyć [p], brzydzić się [i] (feel revulsion at)
    disinfect: dezynfekować [i], zdezynfekować [p]
    dismantle: demontować [i], zdemontować [p], rozbierać [i] (take apart), rozebrać [p] (take apart), rozmontowywać [i]
    dismiss: zwalniać [i], zwolnić [p] (fire an employee), odrzucać [i], odrzucić [p] (reject a claim or an idea), oddalać [i] (a case or appeal)
    dispatch: wysyłać [i], wysłać [p] (send goods or people), odprawiać [i] (process for shipping), załatwiać [i] (finish off quickly), załatwić [p] (finish off quickly)
    dispense: wydawać [i], wydać [p] (hand out), dozować [i] (measure out; medicine), zwalniać [i] (exempt), zwolnić [p] (exempt)
    disperse: rozpraszać [i], rozproszyć [p] (scatter), rozganiać [i] (a crowd), rozgonić [p] (a crowd), rozchodzić się [i] (of a crowd; spread out)
    displace: przesiedlać [i], przesiedlić [p] (from home; uproot people), wypierać [i] (replace; push aside), wyprzeć [p] (replace; push aside), przemieszczać [i] (shift)
    display: pokazywać [i], pokazać [p], wyświetlać [i] (on a screen), wyświetlić [p] (on a screen), wystawiać [i] (exhibit)
    disprove: obalać [i], obalić [p], zbijać [i] (rebut), zbić [p] (rebut)
    dispute: kwestionować [i], zakwestionować [p] (contest a claim), sprzeczać się [i] (quarrel), posprzeczać się [p] (quarrel), zaprzeczać [i] (deny)
    distinguish: odróżniać [i], odróżnić [p] (tell apart), rozróżniać [i], rozróżnić [p], dostrzegać [i] (make out)
    distort: zniekształcać [i], zniekształcić [p], wypaczać [i] (misrepresent), wypaczyć [p] (misrepresent), przekręcać [i] (twist)
    distract: rozpraszać [i], rozproszyć [p] (divert the mind), odwracać [i] (turn attention away), odwrócić [p] (turn attention away)
    distribute: rozdawać [i], rozdać [p] (hand out), rozdzielać [i] (divide up), rozdzielić [p] (divide up), dystrybuować [i] (sell goods)
    disturb: przeszkadzać [i], przeszkodzić [p] (interrupt), niepokoić [i], zaniepokoić [p] (worry), zakłócać [i] (upset order or calm)
    dive: nurkować [i], zanurkować [p], skakać [i] (jump in head first), skoczyć [p] (jump in head first)
    diversify: dywersyfikować [i], zdywersyfikować [p] (risk, investments), urozmaicać [i], urozmaicić [p]
    divide: dzielić [i], podzielić [p], rozdzielać [i] (separate), rozdzielić [p] (separate)
    divorce: rozwodzić się [i], rozwieść się [p] (dissolve a marriage), rozstawać się [i] (separate), rozstać się [p] (separate)
    do: robić [i], zrobić [p], wykonywać [i] (carry out; perform), wykonać [p] (carry out; perform), czynić [i]
    document: dokumentować [i], udokumentować [p], protokołować [i] (minutes), zaprotokołować [p] (minutes), spisywać [i] (put in writing)
    dodge: unikać [i], uniknąć [p], uchylać się [i] (evade), uchylić się [p] (evade), wymigiwać się [i] (get out of)
    dominate: dominować [i], zdominować [p], górować [i] (tower over), panować [i] (rule over; control)
    donate: ofiarowywać [i], ofiarować [p], przekazywać [i] (money; goods or books), przekazać [p], oddawać [i] (blood)
    double: podwajać [i], podwoić [p]
    doubt: wątpić [i], zwątpić [p], powątpiewać [i], kwestionować [i]
    download: pobierać [i], pobrać [p], ściągać [i], ściągnąć [p]
    draft: sporządzać [i], sporządzić [p] (a document), redagować [i] (a law or document), szkicować [i] (make a rough copy), powoływać [i] (military)
    drag: ciągnąć [i], pociągnąć [p], wlec [i] (along the ground), przeciągać [i] (with a mouse; on a screen), przeciągnąć [p] (with a mouse; on a screen)
    drain: osuszać [i], osuszyć [p] (drain water), spuszczać [i], spuścić [p] (let liquid out), opróżniać [i] (empty)
    draw: rysować [i], narysować [p] (sketch; a picture), ciągnąć [i] (pull; a line or a curtain), wyciągać [i] (a card or weapon), losować [i] (a card or lot)
    dread: obawiać się [i] (fear a bad outcome), bać się [i], lękać się [i]
    dream: śnić [i], marzyć [i] (dream or hope; daydream; long for), zamarzyć [p]
    dress: ubierać [i], ubrać [p] (clothe someone), ubierać się [i] (put clothes on; change clothes), ubrać się [p], opatrywać [i] (a wound)
    dribble: dryblować [i] (a ball), kozłować [i] (a ball), ślinić się [i] (drool), kapać [i] (trickle; drip), kapnąć [p] (trickle; drip)
    drift: dryfować [i] (float along; off course), unosić się [i] (float around), płynąć [i] (flow), błąkać się [i] (wander)
    drill: wiercić [i], wywiercić [p] (bore a hole), ćwiczyć [i] (practise drills), wyćwiczyć [p], szkolić [i] (train hard)
    drink: pić [i], wypić [p] (drink up; gulp), napić się [p] (have a drink)
    drip: kapać [i], kapnąć [p] (fall in drops), ociekać [i] (hang or drip), cieknąć [i] (trickle; leak), przeciekać [i] (leak)
    drive: prowadzić [i] (a vehicle), jechać [i] (travel in a vehicle), pojechać [p] (travel in a vehicle), kierować [i] (steer or pilot), napędzać [i] (propel; power a machine)
    drizzle: mżyć [i] (rain lightly), kropić [i] (rain lightly), skrapiać [i] (food with a liquid), skropić [p] (food with a liquid), polewać [i] (sprinkle liquid)
    drop: upuszczać [i], upuścić [p] (let fall; let go of), spadać [i] (fall down), spaść [p] (fall down), podrzucać [i] (drop off a passenger)
    drown: tonąć [i] (die in water), utonąć [p] (die in water), topić [i] (kill by drowning), utopić [p] (kill by drowning), zagłuszać [i] (drown out a sound)
    dry: suszyć [i], wysuszyć [p] (make dry), schnąć [i] (become dry), wyschnąć [p] (become dry), wycierać [i] (wipe dry)
    dump: wyrzucać [i], wyrzucić [p] (throw away), wysypywać [i] (tip out), wysypać [p] (tip out), wylewać [i] (pour out)
    duplicate: powielać [i], powielić [p], kopiować [i], skopiować [p], dublować [i] (overlap or repeat)
    dwell: mieszkać [i], zamieszkać [p] (live in a place), zamieszkiwać [i] (inhabit), przebywać [i] (formal), rozmyślać [i] (dwell on a thought)
    dye: farbować [i], ufarbować [p], barwić [i] (tint), zabarwić [p] (tint)
    earn: zarabiać [i], zarobić [p] (money), zasługiwać [i] (respect or a right), zasłużyć [p] (respect or a right), zyskiwać [i] (respect or a reputation)
    ease: łagodzić [i], złagodzić [p] (soften pain; alleviate), ułatwiać [i] (make easier), ułatwić [p] (make easier), uśmierzać [i] (soften pain)
    eat: jeść [i], zjeść [p], spożywać [i] (formal), spożyć [p] (formal), żreć [i] (of animals; rough speech)
    echo: rozbrzmiewać [i] (resound; reverberate), pobrzmiewać [i] (linger as an echo), powtarzać [i] (repeat someone's words), powtórzyć [p] (repeat someone's words), wtórować [i] (echo back)
    edit: edytować [i], redagować [i] (text; proofread; revise), zredagować [p] (text; proofread; revise), montować [i] (a film or video), zmontować [p] (a film or video)
    educate: kształcić [i], wykształcić [p], uczyć [i] (teach), wychowywać [i] (bring up), wychować [p] (bring up)
    elaborate: opracowywać [i] (work out a plan; work out in detail), opracować [p], rozwijać [i] (expand on a point), rozwinąć [p] (expand on a point)
    elapse: mijać [i], minąć [p], upływać [i], upłynąć [p]
    elect: wybierać [i] (choose by vote), wybrać [p] (choose by vote)
    elevate: podnosić [i], podnieść [p] (lift up; raise a level), unosić [i] (lift up), unieść [p] (lift up), wynosić [i] (to a higher status)
    eliminate: eliminować [i], wyeliminować [p], usuwać [i] (remove), usunąć [p] (remove), wykluczać [i] (rule out)
    elude: umykać [i] (escape notice), umknąć [p] (escape notice), wymykać się [i] (slip away), wymknąć się [p] (slip away), unikać [i] (evade; avoid)
    email: wysyłać [i] (send an email), wysłać [p] (send an email), przesyłać [i] (send by email), przesłać [p] (send by email), mailować [i] (informal)
    embark: wsiadać [i] (board a ship), wsiąść [p] (board a ship), wyruszać [i] (set out), wyruszyć [p] (set out), rozpoczynać [i] (embark on an endeavour; begin a project)
    embed: osadzać [i], osadzić [p] (set into a surface), wbudowywać [i] (build into a system), wbudować [p] (build into a system), wbijać [i] (drive in)
    embrace: obejmować [i], objąć [p] (hug tight), przytulać [i] (hug), przytulić [p] (hug), przyjmować [i] (adopt an idea; welcome)
    embroider: haftować [i], wyszywać [i], wyszyć [p], ubarwiać [i] (embellish), ubarwić [p] (embellish)
    emerge: wyłaniać się [i], wyłonić się [p], pojawiać się [i], pojawić się [p], wynurzać się [i] (come up into view)
    emit: emitować [i], wyemitować [p], wydzielać [i] (gases; smoke or gas; give off), wydzielić [p] (gases; smoke or gas; give off), promieniować [i] (light or heat)
    emphasize: podkreślać [i], podkreślić [p], akcentować [i], zaakcentować [p], uwydatniać [i]
    employ: zatrudniać [i] (hire; give work to), zatrudnić [p] (hire; give work to), używać [i] (use), użyć [p] (use), stosować [i] (use)
    empower: upoważniać [i] (authorize; give authority to), upoważnić [p] (authorize; give authority to), wzmacniać [i] (strengthen), wzmocnić [p] (strengthen)
    empty: opróżniać [i] (empty a container), opróżnić [p] (empty a container), pustoszeć [i] (become empty), opustoszeć [p] (become empty)
    enable: umożliwiać [i], umożliwić [p], pozwalać [i] (allow), włączać [i] (turn on a feature), włączyć [p] (turn on a feature)
    enact: uchwalać [i], uchwalić [p] (a law), wprowadzać [i] (put a law into force), wprowadzić [p] (put a law into force), ogłaszać [i] (proclaim a law)
    enchant: oczarowywać [i], oczarować [p], zachwycać [i], zachwycić [p], urzekać [i]
    encircle: otaczać [i], otoczyć [p], okrążać [i], okrążyć [p]
    encounter: napotykać [i], napotkać [p] (a problem), spotykać [i], spotkać [p], natrafiać [i] (come across)
    encourage: zachęcać [i], zachęcić [p], ośmielać [i] (give courage), ośmielić [p] (give courage), wspierać [i] (promote; a practice)
    encrypt: szyfrować [i], zaszyfrować [p]
    end: kończyć [i] (bring to an end), skończyć [p] (bring to an end), zakończyć [p] (bring to an end), kończyć się [i] (come to an end), skończyć się [p] (come to an end)
    endorse: popierać [i], poprzeć [p], polecać [i] (a product), polecić [p] (a product), poręczać [i] (vouch for)
    endure: znosić [i], znieść [p], wytrzymywać [i], wytrzymać [p], przetrwać [p] (survive; last)
    energize: pobudzać [i], pobudzić [p], ożywiać [i], ożywić [p]
    enforce: egzekwować [i], wyegzekwować [p], wymuszać [i] (compel), wymusić [p] (compel), stosować [i] (a law)
    engage: angażować [i], zaangażować [p] (involve; hire), zatrudniać [i] (hire), zatrudnić [p] (hire), wciągać [i] (involve)
    engrave: grawerować [i], wygrawerować [p], ryć [i], wyryć [p]
    enhance: poprawiać [i], poprawić [p], ulepszać [i], ulepszyć [p], wzmacniać [i] (strengthen)
    enjoy: cieszyć się [i] (take pleasure in), lubić [i] (like doing), delektować się [i] (savor), korzystać [i] (enjoy a benefit), skorzystać [p] (enjoy a benefit)
    enlarge: powiększać [i], powiększyć [p], rozszerzać [i] (expand), rozszerzyć [p] (expand), zwiększać [i]
    enlist: zaciągać się [i] (join the military), zaciągnąć się [p] (join the military), werbować [i] (recruit), zwerbować [p] (recruit), pozyskiwać [i] (enlist help)
    enrage: rozwścieczać [i], rozwścieczyć [p], rozjuszać [i], rozjuszyć [p], wkurzać [i] (informal)
    enrich: wzbogacać [i] (enrich the mind; enrich uranium), wzbogacić [p] (enrich the mind; enrich uranium)
    enroll: zapisywać [i] (in a school), zapisać [p] (in a school), zapisywać się [i] (sign oneself up), zapisać się [p] (sign oneself up), rejestrować [i] (register)
    ensure: zapewniać [i], zapewnić [p], gwarantować [i], zagwarantować [p], upewniać się [i] (make sure)
    entail: wymagać [i] (require), wiązać się [i] (involve), oznaczać [i] (mean), implikować [i]
    entangle: plątać [i], poplątać [p], zaplątywać [i], zaplątać [p], wplątywać [i] (drag into)
    enter: wchodzić [i] (a place; go in; come in), wejść [p] (a place; go in; come in), wprowadzać [i] (enter data), wprowadzić [p] (enter data), wpisywać [i] (type in data)
    entertain: bawić [i] (amuse), zabawić [p] (amuse), gościć [i] (host guests), ugościć [p] (host guests), rozważać [i] (an idea)
    entrust: powierzać [i], powierzyć [p], zlecać [i] (with a task), zlecić [p] (with a task)
    envision: wizualizować [i], zwizualizować [p], przewidywać [i], przewidzieć [p]
    envy: zazdrościć [i], pozazdrościć [p]
    equip: wyposażać [i], wyposażyć [p], zaopatrywać [i] (supply), zaopatrzyć [p] (supply)
    erase: wymazywać [i], wymazać [p], kasować [i] (delete data), skasować [p] (delete data), ścierać [i] (rub out)
    err: mylić się [i] (be wrong), pomylić się [p] (be wrong), błądzić [i], zbłądzić [p], grzeszyć [i] (sin)
    escalate: eskalować [i], zaostrzać [i] (of a conflict), zaostrzyć [p] (of a conflict), nasilać [i] (intensify), nasilić [p] (intensify)
    escape: uciekać [i], uciec [p], ulatniać się [i] (gas, liquids), ulotnić się [p] (gas, liquids), wydostawać się [i] (get out of)
    establish: zakładać [i] (found an institution), założyć [p] (found an institution), ustalać [i] (determine a fact), ustalić [p] (determine a fact), ustanawiać [i] (set firmly)
    estimate: szacować [i], oszacować [p], oceniać [i], ocenić [p], wyceniać [i] (a cost)
    evacuate: ewakuować [b] (move people to safety), ewakuować się [b] (flee to safety), opróżniać [i] (clear a building), opróżnić [p] (clear a building)
    evade: unikać [i], uniknąć [p], uchylać się [i] (dodge; taxes), uchylić się [p] (dodge; taxes), wymykać się [i] (shake off a pursuer)
    evaluate: oceniać [i], ocenić [p], analizować [i] (analyze data), przeanalizować [p] (analyze data)
    evaporate: parować [i], wyparować [p], odparowywać [i] (cause to evaporate), odparować [p] (cause to evaporate), ulatniać się [i] (vanish)
    evoke: wywoływać [i], wywołać [p] (draw out a feeling), przywoływać [i] (memories), przywołać [p] (memories), budzić [i] (draw out a feeling)
    evolve: ewoluować [i], rozwijać się [i] (develop gradually), rozwinąć się [p] (develop gradually), dojrzewać [i] (mature), dojrzeć [p] (mature)
    exaggerate: przesadzać [i], przesadzić [p], wyolbrzymiać [i], wyolbrzymić [p], rozdmuchiwać [i]
    exalt: wywyższać [i], wywyższyć [p] (raise in rank), wysławiać [i] (praise), wysławić [p] (praise), wychwalać [i] (praise)
    examine: badać [i], zbadać [p] (a patient), sprawdzać [i], sprawdzić [p], egzaminować [i] (test a student)
    excavate: wykopywać [i], wykopać [p], odkopywać [i], odkopać [p], wydobywać [i] (dig out)
    exceed: przekraczać [i], przekroczyć [p] (a limit), przewyższać [i] (surpass), przewyższyć [p] (surpass), przerastać [i] (surpass)
    excel: celować [i] (be very good at), przodować [i] (be very good at), wyróżniać się [i] (stand out), wyróżnić się [p] (stand out), prześcigać [i] (outdo others)
    exchange: wymieniać [i] (money), wymienić [p] (money), zamieniać [i], zamienić [p]
    excite: ekscytować [i] (make excited), podekscytować [p] (make excited), podniecać [i], podniecić [p], entuzjazmować [i] (make enthusiastic)
    exclude: wykluczać [i] (rule out; socially), wykluczyć [p] (rule out; socially), wyłączać [i] (leave out), wyłączyć [p] (leave out), pomijać [i] (leave out)
    excuse: usprawiedliwiać [i], usprawiedliwić [p], wybaczać [i], wybaczyć [p], zwalniać [i] (release from a duty)
    execute: wykonywać [i] (carry out), wykonać [p] (carry out), uruchamiać [i] (run a program), uruchomić [p] (run a program), stracić [p] (put to death)
    exempt: zwalniać [i], zwolnić [p], wyłączać [i], wyłączyć [p]
    exercise: ćwiczyć [i], poćwiczyć [p], trenować [i] (train), korzystać [i] (use a right), sprawować [i] (use a power)
    exert: wywierać [i] (influence, pressure), wywrzeć [p] (influence, pressure), wytężać [i] (effort), wytężyć [p] (effort)
    exhale: wydychać [i], wypuszczać [i] (breathe out), wypuścić [p] (breathe out), wydmuchiwać [i] (blow out), wydmuchnąć [p] (blow out)
    exhaust: wyczerpywać [i] (deplete; wear out), wyczerpać [p] (deplete; wear out), zużywać [i] (use up), zużyć [p] (use up), wycieńczać [i] (wear out)
    exhibit: wystawiać [i], wystawić [p], prezentować [i], zaprezentować [p], okazywać [i] (show a trait)
    exile: zsyłać [i], zesłać [p], wyganiać [i], wygnać [p]
    exist: istnieć [i], zaistnieć [p] (come into being), egzystować [i], żyć [i] (people, animals), bytować [i]
    expand: rozszerzać [i], rozszerzyć [p], poszerzać [i], poszerzyć [p], rozwijać [i] (develop; grow)
    expect: oczekiwać [i], spodziewać się [i], przypuszczać [i] (suppose), przypuścić [p] (suppose), przewidywać [i] (anticipate)
    expedite: przyspieszać [i], przyspieszyć [p], ponaglać [i] (hurry), ponaglić [p] (hurry), usprawniać [i] (make more efficient)
    expel: wydalać [i] (from a country), wydalić [p] (from a country), wypędzać [i] (drive out), wypędzić [p] (drive out), wyrzucać [i] (from school)
    experience: doświadczać [i], doświadczyć [p], przeżywać [i] (live through), przeżyć [p] (live through), odczuwać [i] (feel a sensation)
    experiment: eksperymentować [i], poeksperymentować [p], wypróbowywać [i] (try out), wypróbować [p] (try out), testować [i] (try out)
    expire: wygasać [i] (contracts; a license), wygasnąć [p] (contracts; a license), upływać [i] (run out), upłynąć [p] (run out)
    explain: wyjaśniać [i], wyjaśnić [p], tłumaczyć [i], wytłumaczyć [p], objaśniać [i]
    explode: wybuchać [i], wybuchnąć [p], eksplodować [i], pękać [i] (burst), wysadzać [i] (blow up)
    exploit: wykorzystywać [i] (take advantage of; make use of), wykorzystać [p] (take advantage of; make use of), eksploatować [i] (exploit people, resources), wyzyskiwać [i] (exploit workers), nadużywać [i] (misuse)
    explore: badać [i], zbadać [p], eksplorować [i] (a place), zgłębiać [i] (study in depth), zgłębić [p] (study in depth)
    export: eksportować [i], wyeksportować [p], wywozić [i] (goods abroad), wywieźć [p] (goods abroad)
    expose: narażać [i], narazić [p] (to danger), ujawniać [i] (reveal; a secret; a scandal), ujawnić [p] (reveal; a secret; a scandal), odsłaniać [i] (uncover)
    express: wyrażać [i], wyrazić [p], wypowiadać [i], wypowiedzieć [p], ujmować [i] (put in words)
    extend: przedłużać [i], przedłużyć [p] (in time; lengthen), wydłużać [i] (lengthen), wyciągać [i] (hold out; stretch out), wyciągnąć [p] (hold out; stretch out)
    extinguish: gasić [i], zgasić [p], ugasić [p], wytępiać [i] (wipe out), wytępić [p] (wipe out)
    extol: wychwalać [i], wysławiać [i], wysławić [p], chwalić [i], pochwalić [p]
    extract: wydobywać [i] (derive from raw material), wydobyć [p] (derive from raw material), wyciągać [i] (pull out), wyciągnąć [p] (pull out), ekstrahować [i]
    fabricate: produkować [i] (manufacture), wyprodukować [p] (manufacture), fabrykować [i] (invent falsely), sfabrykować [p] (invent falsely), zmyślać [i] (make up)
    face: mierzyć się [i] (confront; face a problem), zmierzyć się [p] (confront; face a problem), konfrontować [i], skonfrontować [p], wychodzić [i] (look onto)
    facilitate: ułatwiać [i], ułatwić [p], umożliwiać [i], moderować [i] (a meeting), prowadzić [i] (lead a session)
    fade: blaknąć [i] (lose color), wyblaknąć [p] (lose color), więdnąć [i] (wither), cichnąć [i] (sounds), zanikać [i] (dwindle; vanish)
    fail: zawodzić [i], zawieść [p], oblewać [i] (a test; a course), oblać [p] (a test; a course)
    fake: fałszować [i], sfałszować [p], udawać [i] (pretend), udać [p] (pretend), podrabiać [i]
    fall: spadać [i], spaść [p], upadać [i] (topple; tumble), upaść [p] (topple; tumble), padać [i] (of rain or snow)
    fall down: upadać [i] (tumble to the ground), upaść [p] (tumble to the ground), przewracać się [i] (topple over), przewrócić się [p] (topple over), zawalać się [i] (collapse)
    fan: wachlować [i], powachlować [p], rozdmuchiwać [i] (flames), rozdmuchać [p] (flames), podsycać [i] (stir up)
    fascinate: fascynować [i], zafascynować [p], urzekać [i] (captivate), zachwycać [i], zachwycić [p]
    fasten: zapinać [i] (button up; buckle; a belt), zapiąć [p] (button up; buckle; a belt), przymocowywać [i] (attach; secure), przymocować [p] (attach; secure), przywiązywać [i] (tie up)
    fatigue: męczyć [i], zmęczyć [p], nużyć [i], znużyć [p], wyczerpywać [i]
    favor: faworyzować [i] (show favoritism), sprzyjać [i] (side with), popierać [i] (side with), poprzeć [p] (side with), woleć [i] (prefer)
    fear: bać się [i], obawiać się [i], lękać się [i]
    feed: karmić [i], nakarmić [p], żywić [i] (support with food), wyżywić [p] (support with food), zasilać [i] (supply)
    feel: czuć [i], poczuć [p], odczuwać [i], czuć się [i] (feel a state), poczuć się [p] (feel a state)
    fence: ogradzać [i] (enclose with a fence), ogrodzić [p] (enclose with a fence), odgradzać [i] (enclose), odgrodzić [p] (enclose), fechtować się [i] (do the sport of fencing)
    ferment: fermentować [i], sfermentować [p], kisić [i] (cause to ferment; pickle), ukisić [p] (cause to ferment; pickle)
    fetch: przynosić [i], przynieść [p], sprowadzać [i] (have sent over; a person), sprowadzić [p] (have sent over; a person), pobierać [i] (data)
    fight: walczyć [i], zwalczać [i] (combat), zwalczyć [p] (combat), kłócić się [i] (quarrel), pokłócić się [p] (quarrel)
    figure out: rozwiązywać [i] (solve a problem), rozwiązać [p] (solve a problem), rozgryzać [i] (solve; understand), rozgryźć [p] (solve; understand), zrozumieć [p] (understand; grasp)
    file: archiwizować [i] (put in files), zarchiwizować [p] (put in files), składać [i] (submit a claim, a complaint), złożyć [p] (submit a claim, a complaint), piłować [i] (file down)
    fill: napełniać [i], napełnić [p], wypełniać [i] (fill a gap), wypełnić [p] (fill a gap), uzupełniać [i] (refill)
    fill in: wypełniać [i] (a form), wypełnić [p] (a form), wpisywać [i] (write in), wpisać [p] (write in), zastępować [i] (substitute for)
    film: filmować [i], sfilmować [p], kręcić [i] (a movie), nakręcić [p] (a movie), ekranizować [i] (adapt for film)
    filter: filtrować [i], przefiltrować [p] (narrow down data), odfiltrowywać [i] (filter out), odfiltrować [p] (filter out), cedzić [i] (strain)
    finance: finansować [i], sfinansować [p], sponsorować [i] (back financially), kredytować [i] (lend funds for)
    find: znajdować [i], znaleźć [p], odnajdywać [i], odnaleźć [p], natrafiać [i] (come upon)
    find out: dowiadywać się [i] (learn), dowiedzieć się [p] (learn), ustalać [i] (establish), ustalić [p] (establish), sprawdzać [i] (look into)
    fine: karać [i] (punish; punish with a fine), ukarać [p] (punish; punish with a fine), wlepiać [i] (impose a fine, informal), wlepić [p] (impose a fine, informal)
    finish: kończyć [i], skończyć [p], zakończyć [p], ukończyć [p] (complete), finalizować [i] (complete; wrap up)
    fire: zwalniać [i] (from a job), zwolnić [p] (from a job), strzelać [i] (a weapon), strzelić [p] (a weapon), wystrzeliwać [i] (a weapon)
    fish: łowić [i], złowić [p], wędkować [i] (catch with a rod)
    fit: pasować [i] (suit; be the right size), dopasowywać [i] (adjust), dopasować [p] (adjust), mieścić się [i] (fit in a space), zmieścić się [p] (fit in a space)
    fix: naprawiać [i] (a fault), naprawić [p] (a fault), mocować [i] (fasten; fix in place), zamocować [p] (fasten; fix in place), reperować [i] (a fault)
    flap: trzepotać [i] (wings), zatrzepotać [p] (wings), łopotać [i] (a flag), powiewać [i] (a flag), machać [i] (wings)
    flare: rozbłyskiwać [i] (flash), rozbłysnąć [p] (flash), buchać [i] (blaze up), buchnąć [p] (blaze up), płonąć [i] (blaze up)
    flash: błyskać [i], błysnąć [p], migać [i], mignąć [p], przemykać [i] (flash across; flash of an idea)
    flatter: pochlebiać [i] (praise excessively), schlebiać [i] (praise excessively), pasować [i] (look good on)
    flavor: przyprawiać [i] (season), przyprawić [p] (season), doprawiać [i] (season), doprawić [p] (season), aromatyzować [i] (add flavoring)
    flee: uciekać [i], uciec [p], zbiec [p], chronić się [i] (take refuge), schronić się [p] (take refuge)
    fling: rzucać [i], rzucić [p], ciskać [i], cisnąć [p], odrzucać [i] (toss aside)
    flip: odwracać [i] (turn over; turn around), odwrócić [p] (turn over; turn around), przełączać [i] (a switch), przełączyć [p] (a switch), kartkować [i] (flip pages)
    flirt: flirtować [i], poflirtować [p], kokietować [i], zalecać się [i] (make advances), podrywać [i] (make advances, informal)
    float: unosić się [i] (in the air; drift about), unieść się [p] (in the air; drift about), pływać [i] (stay on the surface), dryfować [i] (drift), płynąć [i] (drift on water)
    flood: zalewać [i] (inundate), zalać [p] (inundate), wylewać [i] (a river), wylać [p] (a river), napływać [i] (pour in)
    flourish: kwitnąć [i], rozkwitać [i], rozkwitnąć [p], prosperować [i], wymachiwać [i] (brandish)
    flow: płynąć [i], popłynąć [p], przepływać [i] (flow along), spływać [i]
    flutter: trzepotać [i] (wings), zatrzepotać [p] (wings), powiewać [i] (flags in the wind), łopotać [i] (flags in the wind), fruwać [i] (flutter lightly)
    fly: latać [i], lecieć [i] (travel by air), polecieć [p] (travel by air), pilotować [i] (pilot a plane), ulatywać [i] (fly off)
    focus: skupiać się [i] (direct attention), skupić się [p] (direct attention), koncentrować się [i] (direct attention), skoncentrować się [p] (direct attention), ogniskować [i] (a camera; adjust a lens)
    fold: składać [i] (clothes; paper; laundry), złożyć [p] (clothes; paper; laundry), zginać [i] (crease), zgiąć [p] (crease), zaginać [i] (crease)
    follow: podążać [i] (a person), podążyć [p] (a person), przestrzegać [i] (obey rules, orders), ścigać [i] (pursue), następować [i] (come after)
    fool: oszukiwać [i], oszukać [p], nabierać [i] (trick), nabrać [p] (trick), wygłupiać się [i] (joke around)
    forbid: zabraniać [i], zabronić [p], zakazywać [i], zakazać [p]
    force: zmuszać [i] (compel), zmusić [p] (compel), wymuszać [i] (obtain by force), wymusić [p] (obtain by force), wyważać [i] (force open a door)
    forecast: prognozować [i], zaprognozować [p], przewidywać [i], przewidzieć [p], przepowiadać [i]
    foresee: przewidywać [i], przewidzieć [p], przeczuwać [i], przeczuć [p]
    forge: fałszować [i] (counterfeit), sfałszować [p] (counterfeit), kuć [i] (metal; shape metal by hammering), wykuć [p] (metal; shape metal by hammering), nawiązywać [i] (a bond; build ties)
    forget: zapominać [i], zapomnieć [p]
    forgive: wybaczać [i], wybaczyć [p], przebaczać [i], przebaczyć [p], darować [p] (let off)
    form: tworzyć [i], utworzyć [p], formować [i], uformować [p], stanowić [i] (make up; compose)
    format: formatować [i] (a disk), sformatować [p] (a disk)
    formulate: formułować [i], sformułować [p], opracowywać [i] (work out), opracować [p] (work out), układać [i] (draw up a plan)
    found: zakładać [i], założyć [p], fundować [i] (endow), ufundować [p] (endow)
    fracture: łamać [i] (a bone), złamać [p] (a bone), pękać [i] (be fractured), pęknąć [p] (be fractured)
    frame: oprawiać [i] (a picture; mount a picture), oprawić [p] (a picture; mount a picture), obramowywać [i] (give a border), obramować [p] (give a border), wrabiać [i] (set up an innocent person)
    free: uwalniać [i], uwolnić [p], wyzwalać [i] (liberate), wyzwolić [p] (liberate), wypuszczać [i] (release a prisoner; let go)
    freeze: zamrażać [i] (food, assets), zamrozić [p] (food, assets), zamarzać [i] (turn to ice), zamarznąć [p] (turn to ice), marznąć [i] (feel very cold)
    frighten: straszyć [i] (threaten), przestraszyć [p] (startle), przerażać [i], przerazić [p], wystraszyć [p] (startle)
    frown: marszczyć [i] (the forehead; one's brows), zmarszczyć [p] (the forehead; one's brows), krzywić się [i] (one's face), skrzywić się [p] (one's face)
    frustrate: frustrować [i], sfrustrować [p], udaremniać [i] (thwart a plan), udaremnić [p] (thwart a plan), pokrzyżować [p] (thwart a plan)
    fry: smażyć [i], usmażyć [p], podsmażać [i] (pan-fry), podsmażyć [p] (pan-fry), przysmażać [i]
    fuel: tankować [i] (refuel), zatankować [p] (refuel), napędzać [i] (power), podsycać [i] (stoke a conflict; stir up emotions), podsycić [p] (stoke a conflict; stir up emotions)
    fulfill: spełniać [i] (a promise; a wish; a requirement), spełnić [p] (a promise; a wish; a requirement), wypełniać [i] (a duty), wypełnić [p] (a duty), realizować [i] (realize; achieve a dream)
    function: funkcjonować [i], działać [i], zadziałać [p], pełnić [i] (act as; serve a function), pracować [i] (of a machine)
    furnish: meblować [i] (a room), umeblować [p] (a room), urządzać [i] (fit out a room), urządzić [p] (fit out a room), dostarczać [i] (provide; supply)
    fuse: łączyć [i], połączyć [p], łączyć się [i] (companies), stapiać [i] (merge; melt together), spawać [i] (weld)
    gain: zyskiwać [i], zyskać [p], zdobywać [i], zdobyć [p], tyć [i] (gain weight)
    gallop: galopować [i], pogalopować [p], cwałować [i]
    gamble: grać [i] (gamble at cards, casino), zakładać się [i] (bet), założyć się [p] (bet), ryzykować [i] (risk), zaryzykować [p] (risk)
    gather: zbierać [i] (collect; pick up), zebrać [p] (collect; pick up), gromadzić [i] (bring together), zgromadzić [p] (bring together), zbierać się [i] (come together, meet)
    generate: generować [i], wygenerować [p], wytwarzać [i], wytworzyć [p], tworzyć [i] (a document, report)
    gesture: gestykulować [i], machać [i] (signal by hand), machnąć [p] (signal by hand), kiwać [i] (signal), kiwnąć [p] (signal)
    get: dostawać [i] (receive), dostać [p] (receive), zdobywać [i] (obtain; procure), zdobyć [p] (obtain; procure), łapać [i] (catch)
    give: dawać [i], dać [p], podarować [p] (as a gift), udzielać [i] (grant, provide), podawać [i] (to me; hand over)
    give up: rezygnować [i] (renounce; quit; abandon hope), zrezygnować [p] (renounce; quit; abandon hope), poddawać się [i] (surrender), poddać się [p] (surrender), rzucać [i] (quit a habit)
    glorify: gloryfikować [i], wysławiać [i], wysławić [p], idealizować [i] (idealize)
    glow: świecić [i], zaświecić [p], żarzyć się [i] (glow with heat), jarzyć się [i], rozpromieniać się [i] (glow with joy)
    glue: kleić [i], skleić [p], przyklejać [i] (stick on), przykleić [p] (stick on), sklejać [i]
    go: iść [i], chodzić [i] (go regularly), pójść [p], jechać [i] (by vehicle), pojechać [p] (by vehicle)
    go back: wracać [i], wrócić [p], zawracać [i] (turn back), zawrócić [p] (turn back), cofać się [i] (go back)
    go on: kontynuować [i] (continue), trwać [i] (last), potrwać [p] (last), ciągnąć się [i] (continue, last)
    go out: wychodzić [i] (leave home; go outside; socially), wyjść [p] (leave home; go outside; socially), gasnąć [i] (a light, a fire), zgasnąć [p] (a light, a fire)
    gossip: plotkować [i], poplotkować [p], obgadywać [i] (talk ill of others), obgadać [p] (talk ill of others)
    govern: rządzić [i], zarządzać [i] (administer), władać [i] (control), kierować [i] (control)
    grab: chwytać [i], chwycić [p], łapać [i], złapać [p], zgarniać [i] (snatch)
    grade: oceniać [i] (rate; mark a test), ocenić [p] (rate; mark a test), sprawdzać [i] (papers), klasyfikować [i] (classify), sklasyfikować [p] (classify)
    graduate: kończyć [i] (finish school, a degree), skończyć [p] (finish school, a degree), ukończyć [p] (complete a course)
    graft: szczepić [i] (plants), zaszczepić [p] (plants), przeszczepiać [i] (tissue; skin), przeszczepić [p] (tissue; skin), wszczepiać [i] (combine)
    grant: przyznawać [i] (award; bestow), przyznać [p] (award; bestow), udzielać [i] (permission), udzielić [p] (permission), spełniać [i] (a request)
    grasp: chwytać [i] (take hold of; grip), chwycić [p] (take hold of; grip), rozumieć [i] (understand), zrozumieć [p] (understand), pojmować [i] (comprehend)
    grate: trzeć [i] (cheese; food), zetrzeć [p] (cheese; food), zgrzytać [i] (grate, squeak), irytować [i] (irritate), drażnić [i] (irritate)
    graze: pasać [i] (put animals to pasture), wypasać [i] (put animals out to graze), paść się [i] (graze on grass), muskać [i] (touch lightly), musnąć [p] (touch lightly)
    greet: witać [i], przywitać [p], powitać [p], pozdrawiać [i], pozdrowić [p]
    grieve: opłakiwać [i] (mourn a death), opłakać [p] (mourn a death), smucić [i] (cause sorrow to), zasmucić [p] (cause sorrow to), rozpaczać [i] (mourn)
    grill: grillować [i] (over a flame), piec [i] (over a flame), upiec [p] (over a flame), przesłuchiwać [i] (interrogate), wypytywać [i] (question hard)
    grind: mielić [i], zmielić [p] (coffee, grain), ostrzyć [i] (sharpen), naostrzyć [p] (sharpen), rozcierać [i] (pound to powder; pulverize)
    grip: chwytać [i] (clutch), chwycić [p] (clutch), ściskać [i] (hold fast), ścisnąć [p] (hold fast), zaciskać [i] (hold fast)
    groan: jęczeć [i], jęknąć [p] (in pain), stękać [i], stęknąć [p], narzekać [i] (grumble)
    grow: rosnąć [i] (increase; get bigger), urosnąć [p] (increase; get bigger), uprawiać [i] (crops; plants), hodować [i] (breed, raise plants), wyhodować [p] (breed, raise plants)
    grow up: dorastać [i], dorosnąć [p], wyrastać [i] (be raised), wyrosnąć [p] (be raised), dojrzewać [i] (become mature)
    growl: warczeć [i], warknąć [p] (dogs), grzmieć [i] (thunder), zagrzmieć [p] (thunder), burczeć [i] (rumble; grumble)
    grunt: chrząkać [i] (with effort), chrząknąć [p] (with effort), chrumkać [i] (of a pig), stękać [i] (with effort), mruczeć [i] (grumble)
    guarantee: gwarantować [i], zagwarantować [p], zapewniać [i] (promise), zapewnić [p] (promise), ręczyć [i] (assert with confidence)
    guard: strzec [i], pilnować [i] (keep watch), chronić [i], ochronić [p], wartować [i] (stand guard)
    guess: zgadywać [i], zgadnąć [p], odgadywać [i] (guess correctly), odgadnąć [p] (guess correctly), przypuszczać [i] (suppose)
    guide: prowadzić [i], poprowadzić [p] (show the way), oprowadzać [i] (show around), kierować [i] (direct), instruować [i] (instruct)
    gulp: przełykać [i], przełknąć [p], połykać [i] (swallow; wolf down food), połknąć [p] (swallow; wolf down food)
    gush: tryskać [i], trysnąć [p] (spurt up; spout or erupt), buchać [i] (pour out), buchnąć [p] (pour out), bulgotać [i] (bubble up)
    hack: hakować [i], zhakować [p] (break into a system), włamywać się [i] (break into a system), rąbać [i] (chop up), porąbać [p] (hack to pieces)
    hail: przywoływać [i] (call over; hail a taxi), przywołać [p] (call over; hail a taxi), zatrzymywać [i] (hail a taxi), zatrzymać [p] (hail a taxi), padać [i] (of hail)
    halt: zatrzymywać [i], zatrzymać [p], wstrzymywać [i] (cease operations), wstrzymać [p] (cease operations), zatrzymywać się [i] (come to a stop)
    hammer: wbijać [i] (hammer in a nail; drive in), wbić [p] (hammer in a nail; drive in), kuć [i] (pound), walić [i] (pound)
    hamper: utrudniać [i], utrudnić [p], hamować [i], zahamować [p], blokować [i] (block)
    hand over: przekazywać [i] (transfer; hand over duties), przekazać [p] (transfer; hand over duties), wręczać [i], wręczyć [p], oddawać [i] (pass to)
    handle: obsługiwać [i] (operate a machine), obsłużyć [p] (operate a machine), zajmować się [i] (deal with), zająć się [p] (deal with), załatwiać [i] (deal with; cope with)
    hang: wieszać [i], powiesić [p], wisieć [i] (be hanging), zawieszać [i] (suspend), dyndać [i] (dangle)
    hang up: rozłączać się [i] (end a phone call), rozłączyć się [p] (end a phone call), odkładać [i] (the phone), wieszać [i] (coats, pictures; a coat on a hook), powiesić [p] (coats, pictures; a coat on a hook)
    happen: zdarzać się [i] (occur), zdarzyć się [p] (occur), wydarzyć się [p] (occur), dziać się [i], odbywać się [i] (take place)
    harass: nękać [i], napastować [i] (sexually), molestować [i] (sexually), dręczyć [i] (pester), nagabywać [i] (pester)
    harden: twardnieć [i], stwardnieć [p] (become hard), hartować [i] (toughen up), zahartować [p] (toughen up), utwardzać [i] (make hard)
    harm: szkodzić [i], zaszkodzić [p], krzywdzić [i] (hurt), skrzywdzić [p] (hurt), uszkadzać [i] (damage)
    harmonize: harmonizować [i], zharmonizować [p], uzgadniać [i] (coordinate), uzgodnić [p] (coordinate), współgrać [i] (go well together)
    harvest: zbierać [i] (a crop), zebrać [p] (a crop), żąć [i] (reap)
    hate: nienawidzić [i], znienawidzić [p], detestować [i], gardzić [i] (loathe), brzydzić się [i] (loathe)
    haul: ciągnąć [i] (pull), holować [i] (pull a vehicle), przewozić [i] (carry freight; transport), przewieźć [p] (carry freight; transport), dźwigać [i] (carry)
    have: mieć [i] (possess; auxiliary), posiadać [i] (own), dysponować [i] (possess)
    heal: leczyć [i] (cure; treat), wyleczyć [p] (cure; treat), goić się [i] (wounds), zagoić się [p] (wounds), zdrowieć [i] (get well; recover)
    heap: piętrzyć [i] (be piled up), spiętrzyć [p] (be piled up), gromadzić [i], nagromadzić [p], usypywać [i]
    hear: słyszeć [i], usłyszeć [p], słuchać [i] (listen), wysłuchać [p] (hear out)
    heat: ogrzewać [i] (a room), ogrzać [p] (a room), podgrzewać [i] (reheat food; warm up food or drink), podgrzać [p] (reheat food; warm up food or drink), grzać [i] (apply heat)
    heighten: potęgować [i], spotęgować [p], wzmagać [i], zwiększać [i], zwiększyć [p]
    help: pomagać [i], pomóc [p], wspierać [i] (support), wesprzeć [p] (support), ratować [i] (aid, rescue)
    hesitate: wahać się [i], zawahać się [p], ociągać się [i], zwlekać [i]
    hide: ukrywać [i] (conceal), ukryć [p] (conceal), chować się [i] (be out of sight; go into hiding), schować się [p] (be out of sight; go into hiding), zatajać [i] (keep secret)
    highlight: podkreślać [i], podkreślić [p], zakreślać [i] (with a marker), zakreślić [p] (with a marker), zaznaczać [i] (text on screen)
    hijack: porywać [i] (aircraft, vehicles; ships), porwać [p] (aircraft, vehicles; ships), uprowadzać [i], uprowadzić [p], przejmować [i] (seize by force; take over)
    hinder: utrudniać [i], utrudnić [p], przeszkadzać [i], uniemożliwiać [i] (prevent), opóźniać [i] (delay)
    hint: sugerować [i], zasugerować [p], napomykać [i] (allude to), napomknąć [p] (allude to), insynuować [i]
    hire: zatrudniać [i], zatrudnić [p], wynajmować [i] (rent), wynająć [p] (rent), angażować [i] (performers)
    hit: uderzać [i], uderzyć [p], trafiać [i] (a target), trafić [p] (a target), bić [i] (slap; punch)
    hoard: gromadzić [i], zgromadzić [p], chomikować [i] (informal), magazynować [i] (stockpile), skupować [i] (buy up and stockpile)
    hold: trzymać [i] (hold in one's arms; grip), utrzymywać [i] (support weight; hold up or carry), utrzymać [p] (support weight; hold up or carry), przytrzymywać [i] (hold tight), organizować [i] (an event)
    hold on: czekać [i] (wait), zaczekać [p] (wait), trzymać się [i] (grip; cling), wytrzymywać [i] (hold out), wytrzymać [p] (hold out)
    honor: honorować [i] (a promise or check), uhonorować [p] (with an award), szanować [i] (respect), czcić [i] (honor), dotrzymywać [i] (a promise)
    hook: zahaczać [i] (catch with a hook; get caught), zahaczyć [p] (catch with a hook; get caught), podłączać [i] (hook up; connect), podłączyć [p] (hook up; connect), zawieszać [i] (hang on a hook)
    hop: skakać [i], skoczyć [p], podskakiwać [i], podskoczyć [p]
    hope: liczyć [i] (hope for), pragnąć [i] (wish for), życzyć [i] (wish), spodziewać się [i], ufać [i] (trust)
    host: gościć [i] (lodge guests; entertain guests), ugościć [p] (lodge guests; entertain guests), organizować [i] (host an event), prowadzić [i] (a show; a program), poprowadzić [p] (a show; a program)
    hover: unosić się [i] (linger in the air), unieść się [p] (linger in the air), krążyć [i] (circle above), zawisać [i] (hang in the air), kręcić się [i] (loiter nearby)
    howl: wyć [i], zawyć [p], zawodzić [i] (wail), skowyczeć [i]
    hug: przytulać [i], przytulić [p], ściskać [i], uściskać [p], obejmować [i]
    hum: nucić [i], zanucić [p], buczeć [i] (drone; machinery), brzęczeć [i] (buzz), bzyczeć [i] (buzz)
    humiliate: poniżać [i], poniżyć [p], upokarzać [i], upokorzyć [p], zawstydzać [i] (shame in public)
    hunt: polować [i], upolować [p], tropić [i], wytropić [p], szukać [i] (hunt for)
    hurl: ciskać [i] (fling; hurl abuse), cisnąć [p] (fling; hurl abuse), rzucać [i], rzucić [p], miotać [i] (hurl abuse)
    hurt: boleć [i] (to ache), zaboleć [p] (to ache), ranić [i] (to wound), zranić [p] (to wound), krzywdzić [i] (to harm)
    hypnotize: hipnotyzować [i], zahipnotyzować [p]
    identify: identyfikować [i], zidentyfikować [p], rozpoznawać [i] (recognize), rozpoznać [p] (recognize), oznaczać [i] (e.g. a plant)
    idolize: ubóstwiać [i], ubóstwić [p], uwielbiać [i], wielbić [i] (worship from afar), podziwiać [i] (look up to)
    ignore: ignorować [i], zignorować [p], lekceważyć [i] (brush aside), pomijać [i] (overlook), pominąć [p] (overlook)
    illuminate: oświetlać [i], oświetlić [p], rozjaśniać [i] (clarify), rozjaśnić [p] (clarify), wyjaśniać [i] (clarify)
    illustrate: ilustrować [i] (add pictures; with diagrams), zilustrować [p] (add pictures; with diagrams), objaśniać [i] (make clear with examples), przedstawiać [i] (show by example; demonstrate), przedstawić [p] (show by example; demonstrate)
    imagine: fantazjować [i] (dream up), wymyślać [i] (dream up), wymyślić [p] (dream up), przypuszczać [i] (suppose), wizualizować [i] (picture in the mind)
    imitate: naśladować [i], imitować [i], kopiować [i] (copy a model), skopiować [p] (copy a model), wzorować się [i] (follow the example of)
    immerse: zanurzać [i] (dip in; in liquid; submerge), zanurzyć [p] (dip in; in liquid; submerge), zatapiać [i] (sink), pogrążać się [i] (be absorbed in), pogrążyć się [p] (be absorbed in)
    immobilize: unieruchamiać [i], unieruchomić [p], obezwładniać [i] (restrain; subdue), usztywniać [i] (a limb), paraliżować [i] (paralyze; bring to a standstill)
    impeach: oskarżać [i] (charge; accuse), oskarżyć [p] (charge; accuse), dymisjonować [i] (remove from office), zdymisjonować [p] (remove from office), odwoływać [i] (relieve of office)
    impede: utrudniać [i], utrudnić [p], hamować [i] (slow down), zahamować [p] (slow down), przeszkadzać [i]
    implement: wdrażać [i] (introduce a system), wdrożyć [p] (introduce a system), implementować [i] (software), zaimplementować [p] (software), realizować [i] (realize in practice; carry out)
    implore: błagać [i], prosić [i] (appeal to), poprosić [p] (appeal to), zaklinać [i]
    imply: sugerować [i] (suggest), zasugerować [p] (suggest), implikować [i], oznaczać [i] (mean), znaczyć [i] (mean)
    import: importować [i], zaimportować [p], sprowadzać [i] (goods; bring in), sprowadzić [p] (goods; bring in), wwozić [i] (goods)
    impose: nakładać [i] (a ban, penalty; a tax, a rule), nałożyć [p] (a ban, penalty; a tax, a rule), narzucać [i] (force upon; force on others), narzucić [p] (force upon; force on others), wymierzać [i] (a penalty)
    impress: imponować [i], zaimponować [p], oszałamiać [i] (overwhelm), wpajać [i] (imprint on the mind), wpoić [p] (imprint on the mind)
    imprison: więzić [i], uwięzić [p], zamykać [i] (lock up; confine), zamknąć [p] (lock up; confine), osadzać [i] (hold captive)
    improve: poprawiać [i], poprawić [p], poprawiać się [i] (get better), ulepszać [i], doskonalić [i] (skills)
    incite: podżegać [i] (instigate), podburzać [i], podburzyć [p], podjudzać [i], podjudzić [p]
    incline: skłaniać [i] (make inclined; tend toward), skłonić [p] (make inclined; tend toward), pochylać [i] (bend forward), pochylić [p] (bend forward), przechylać [i] (tilt something)
    include: zawierać [i] (contain), obejmować [i] (contain), objąć [p] (contain), uwzględniać [i] (count in), włączać [i] (count in)
    incorporate: włączać [i] (merge into), włączyć [p] (merge into), uwzględniać [i] (work in), uwzględnić [p] (work in), rejestrować [i] (a company; form a corporation)
    increase: zwiększać [i] (make larger; make more), zwiększyć [p] (make larger; make more), rosnąć [i] (rise; grow), wzrosnąć [p] (rise; grow), podnosić [i] (raise)
    incur: ponosić [i] (a loss; suffer a loss), ponieść [p] (a loss; suffer a loss), zaciągać [i] (a debt), zaciągnąć [p] (a debt), narażać się [i] (bring upon oneself)
    indicate: wskazywać [i] (point to), wskazać [p] (point to), zaznaczać [i] (mark), zaznaczyć [p] (mark), podawać [i] (state)
    induce: wywoływać [i] (bring about; cause), wywołać [p] (bring about; cause), nakłaniać [i] (persuade), nakłonić [p] (persuade), indukować [i] (physics, logic)
    infect: zarażać [i] (pass on a disease; spread to others), zarazić [p] (pass on a disease; spread to others), zakażać [i], zakazić [p], zarażać się [i] (get infected)
    infer: wnioskować [i], wywnioskować [p], dedukować [i] (deduce), wydedukować [p] (deduce), wyprowadzać [i] (derive)
    inflate: nadmuchiwać [i] (blow up a balloon), nadmuchać [p] (blow up a balloon), pompować [i] (blow up), napompować [p] (blow up), zawyżać [i] (pad figures)
    inflict: zadawać [i] (pain; damage; cause injury), zadać [p] (pain; damage; cause injury), wyrządzać [i] (cause harm), wyrządzić [p] (cause harm), sprawiać [i] (cause pain)
    influence: wpływać [i] (act on; sway), wpłynąć [p] (act on; sway), oddziaływać [i] (act on), kształtować [i] (influence morally; shape), ukształtować [p] (influence morally; shape)
    inform: informować [i], poinformować [p], powiadamiać [i] (notify officially), powiadomić [p] (notify officially), zawiadamiać [i] (notify officially)
    infringe: naruszać [i] (a right; violate a right), naruszyć [p] (a right; violate a right), łamać [i] (break a rule; a law), złamać [p] (break a rule; a law), pogwałcić [p] (violate a right)
    ingest: spożywać [i], spożyć [p], przyjmować [i] (a medicine), przyjąć [p], połykać [i] (swallow)
    inhabit: zamieszkiwać [i], zamieszkać [p], zasiedlać [i] (of animals)
    inhale: wdychać [i], wciągać [i], wciągnąć [p], inhalować [i] (inhale a substance)
    inherit: dziedziczyć [i], odziedziczyć [p]
    inhibit: hamować [i], zahamować [p], powstrzymywać [i], powstrzymać [p], tłumić [i] (hold down)
    initiate: rozpoczynać [i] (start a process), rozpocząć [p], inicjować [i], zainicjować [p], wtajemniczać [i] (admit to a group or secret)
    inject: wstrzykiwać [i], wstrzyknąć [p], wpompowywać [i] (put funds in), wpompować [p]
    injure: ranić [i], zranić [p], skrzywdzić [p] (harm)
    inquire: pytać [i], zapytać [p], dowiadywać się [i] (ask about), dowiedzieć się [p], badać [i] (investigate)
    insert: wstawiać [i] (text, data), wstawić [p], wkładać [i] (place inside), włożyć [p], wtykać [i] (stick into)
    insinuate: insynuować [i], sugerować [i] (hint), zasugerować [p], napomykać [i], napomknąć [p]
    insist: nalegać [i], upierać się [i] (stubbornly), uprzeć się [p]
    inspect: kontrolować [i], skontrolować [p], sprawdzać [i], sprawdzić [p], oglądać [i] (a site)
    inspire: inspirować [i], zainspirować [p], natchnąć [p], zachęcać [i], zachęcić [p]
    install: instalować [i] (software), zainstalować [p], montować [i] (mount, assemble), zamontować [p], wbudowywać [i] (fit in place)
    instruct: instruować [i], poinstruować [p], uczyć [i] (teach), nakazywać [i] (order), nakazać [p]
    insult: obrażać [i], obrazić [p], znieważać [i], znieważyć [p], wyzywać [i] (swear at)
    insure: ubezpieczać [i], ubezpieczyć [p], zapewniać [i] (make sure; guarantee), zapewnić [p], gwarantować [i]
    integrate: integrować [i], zintegrować [p], włączać [i], włączyć [p]
    intend: zamierzać [i], planować [i] (plan to do), zaplanować [p], dążyć [i] (aim at)
    intensify: intensyfikować [i], zintensyfikować [p], nasilać [i], nasilić [p], zaostrzać [i] (a conflict)
    interact: współdziałać [i] (work together), oddziaływać [i] (things), obcować [i] (mingle), kontaktować się [i]
    interest: interesować [i], zainteresować [p], zaciekawiać [i] (pique curiosity), zaciekawić [p], fascynować [i] (hold attention)
    interfere: wtrącać się [i] (meddle), wtrącić się [p], ingerować [i], przeszkadzać [i] (get in the way), przeszkodzić [p]
    interpret: interpretować [i] (meaning), zinterpretować [p], tłumaczyć [i] (translate orally), przetłumaczyć [p], objaśniać [i] (explain)
    interrogate: przesłuchiwać [i], przesłuchać [p], przepytywać [i], przepytać [p], wypytywać [i] (probe)
    interrupt: przerywać [i], przerwać [p], przeszkadzać [i] (disturb), przeszkodzić [p]
    intervene: interweniować [i], zainterweniować [p], wkraczać [i] (step in), wkroczyć [p], pośredniczyć [i] (mediate)
    interview: rozmawiać [i] (talk with), porozmawiać [p], przepytywać [i] (a job candidate; as a reporter), przepytać [p]
    intimidate: zastraszać [i], zastraszyć [p], onieśmielać [i], onieśmielić [p], straszyć [i] (threaten)
    intrigue: intrygować [i] (arouse curiosity), zaintrygować [p], fascynować [i], knuć [i] (scheme), spiskować [i] (plot)
    introduce: przedstawiać [i] (a person), przedstawić [p], wprowadzać [i] (bring in something new), wprowadzić [p], zapoznawać [i] (a person to someone)
    invade: najeżdżać [i] (a country), najechać [p], wkraczać [i] (march into), wkroczyć [p] (march into), naruszać [i] (privacy)
    invent: wymyślać [i], wymyślić [p], wynajdywać [i], wynaleźć [p], zmyślać [i] (make up a story)
    invest: inwestować [i], zainwestować [p], lokować [i] (money in an investment), ulokować [p]
    invite: zapraszać [i], zaprosić [p]
    invoice: fakturować [i], zafakturować [p], obciążać [i] (charge), obciążyć [p], rozliczać [i] (bill)
    invoke: przywoływać [i] (call upon), przywołać [p], wywoływać [i] (call a function), wywołać [p], powoływać się [i] (cite as authority)
    involve: angażować [i] (make a participant), zaangażować [p], obejmować [i] (include), objąć [p], dotyczyć [i] (concern, affect)
    iron: prasować [i], wyprasować [p]
    irritate: irytować [i] (annoy), zirytować [p], drażnić [i] (inflame the skin), podrażnić [p], denerwować [i]
    isolate: izolować [i], odizolować [p], oddzielać [i] (set apart), oddzielić [p]
    issue: wydawać [i], wydać [p], wystawiać [i] (a document), wystawić [p], emitować [i] (a currency)
    itch: swędzieć [i], świerzbić [i], mrowić [i] (tingle)
    jam: zacinać się [i] (get stuck), zaciąć się [p], blokować [i] (block), zablokować [p], zatykać [i] (clog)
    jeer: wygwizdywać [i] (boo), wygwizdać [p], szydzić [i] (mock), drwić [i], wyśmiewać [i]
    jingle: brzęczeć [i] (coins, keys), brzęknąć [p], pobrzękiwać [i], dzwonić [i] (bells)
    jog: biegać [i] (run), pobiegać [p], truchtać [i] (trot)
    join: łączyć [i] (connect things), połączyć [p], dołączać [i] (a group), dołączyć [p], wstępować [i] (become a member of)
    joke: żartować [i], zażartować [p], dowcipkować [i]
    jolt: szarpać [i] (shake roughly), szarpnąć [p], wstrząsać [i] (shock), wstrząsnąć [p], podskakiwać [i] (lurch)
    journey: podróżować [i], wędrować [i], wyruszyć [p] (go on a trip)
    judge: sądzić [i] (pass sentence on; in court), osądzić [p], oceniać [i] (a contest), ocenić [p]
    jump: skakać [i], skoczyć [p], przeskakiwać [i] (jump over), przeskoczyć [p], podskakiwać [i]
    justify: uzasadniać [i], uzasadnić [p], usprawiedliwiać [i], usprawiedliwić [p], racjonalizować [i] (rationalize)
    keep: trzymać [i], zachowywać [i], zachować [p], przechowywać [i] (store), dotrzymywać [i] (a promise)
    keep on: kontynuować [i] (continue something), trwać [i] (carry on), ciągnąć [i] (carry on)
    kick: kopać [i] (football, informal), kopnąć [p], wierzgać [i] (horse)
    kidnap: porywać [i], porwać [p], uprowadzać [i], uprowadzić [p]
    kill: zabijać [i], zabić [p], uśmiercać [i], uśmiercić [p]
    kindle: rozpalać [i] (light a fire), rozpalić [p], rozniecać [i] (spark), wzbudzać [i] (arouse; rouse a feeling), wzbudzić [p]
    kiss: całować [i], pocałować [p], cmokać [i] (colloquial; give a peck), cmoknąć [p]
    knead: zagniatać [i], zagnieść [p], ugniatać [i] (knead thoroughly), ugnieść [p], wyrabiać [i] (dough)
    knit: dziergać [i] (knit), zrastać się [i] (bones), zrosnąć się [p]
    knock: pukać [i] (at a door), zapukać [p], stukać [i] (rap), uderzać [i] (bump, hit), uderzyć [p]
    knot: zawiązywać [i] (tie), zawiązać [p], wiązać [i], związać [p], supłać [i]
    know: wiedzieć [i] (facts), znać [i] (people, places), umieć [i] (how to), rozumieć [i] (understand)
    label: etykietować [i] (write labels on), oznaczać [i] (mark), oznaczyć [p], nazywać [i] (name), piętnować [i] (stigmatize)
    lack: brakować [i] (be missing), zabraknąć [p], obywać się [i] (go without), obyć się [p]
    lament: lamentować [i] (wail, complain), opłakiwać [i], opłakać [p], żałować [i] (regret), ubolewać [i]
    land: lądować [i] (aircraft; after a jump), wylądować [p], przybijać [i] (ships dock), zdobywać [i] (win a job or prize), zdobyć [p]
    languish: marnieć [i] (waste away), zmarnieć [p], słabnąć [i] (grow weak), podupadać [i], wegetować [i] (stagnate)
    lash: smagać [i] (whip; rain, waves), smagnąć [p], chłostać [i] (flog), wychłostać [p], przywiązywać [i] (tie down)
    last: trwać [i] (go on), potrwać [p], wytrzymywać [i] (hold up, endure), wytrzymać [p], wystarczać [i] (last long)
    laugh: śmiać się [i], zaśmiać się [p], roześmiać się [p] (burst out laughing), chichotać [i] (giggle), wyśmiewać [i] (laugh at)
    launch: uruchamiać [i] (a program; a project), uruchomić [p], wystrzeliwać [i] (a rocket, a missile), wystrzelić [p], wprowadzać [i] (a product)
    launder: prać [i] (clothes, dirty money), wyprać [p], uprać [p], czyścić [i] (clean)
    lay: kłaść [i] (put down), położyć [p], układać [i] (carpet, cables; spread, lay a floor), ułożyć [p], znosić [i] (an egg)
    lead: prowadzić [i] (guide), poprowadzić [p], kierować [i] (head a group), przewodzić [i], dowodzić [i] (command)
    leak: przeciekać [i] (a container leaks), przeciec [p], wyciekać [i] (seep, news leaks), wyciec [p], ujawniać [i] (leak information; divulge a secret)
    lean: opierać [i] (prop against; rest against), oprzeć [p], pochylać [i] (tilt), pochylić [p], polegać [i] (rely on)
    leap: skakać [i], skoczyć [p], rzucać się [i] (leap headlong), rzucić się [p], podskakiwać [i] (spring up, dart)
    learn: uczyć się [i] (acquire a skill), nauczyć się [p], dowiadywać się [i] (find out), dowiedzieć się [p], zapamiętywać [i] (memorize, pick up)
    leave: wychodzić [i] (depart), wyjść [p], zostawiać [i] (leave behind), zostawić [p], opuszczać [i] (depart from, abandon)
    legislate: uchwalać [i] (pass a law), uchwalić [p], ustanawiać [i] (a law), ustanowić [p]
    lend: pożyczać [i] (lend), pożyczyć [p], wypożyczać [i] (lend out; rent or loan out), wypożyczyć [p], użyczać [i]
    lengthen: wydłużać [i], wydłużyć [p], przedłużać [i] (extend in time), przedłużyć [p], rozciągać [i] (stretch)
    let: pozwalać [i] (permit), pozwolić [p], zezwalać [i], zezwolić [p], wynajmować [i] (rent out)
    let down: zawodzić [i] (betray trust), zawieść [p], rozczarowywać [i] (disappoint), rozczarować [p], opuszczać [i] (lower)
    level: wyrównywać [i] (even out), wyrównać [p], niwelować [i] (grade ground), zniwelować [p], równać [i] (flatten)
    liberate: wyzwalać [i], wyzwolić [p], uwalniać [i], uwolnić [p], oswobadzać [i] (deliver from suffering)
    lick: lizać [i], polizać [p], oblizywać [i] (lick off), oblizać [p]
    lie: kłamać [i] (tell a lie), skłamać [p], okłamywać [i] (lie to someone), okłamać [p], leżeć [i] (be lying down)
    lift: podnosić [i] (pick up), podnieść [p], unosić [i] (raise), unieść [p], znosić [i] (a ban; lift a ban)
    light: zapalać [i] (a candle; switch on a light), zapalić [p], oświetlać [i] (illuminate), oświetlić [p], podpalać [i] (set alight; ignite)
    lighten: odciążać [i] (reduce a burden), odciążyć [p], rozjaśniać [i] (make lighter in color), rozjaśnić [p], łagodzić [i] (relieve)
    like: lubić [i], polubić [p], podobać się [i] (be pleasing to), spodobać się [p], cenić [i] (appreciate)
    limit: ograniczać [i], ograniczyć [p], limitować [i]
    linger: pozostawać [i] (stay behind; remain), pozostać [p], zwlekać [i] (dawdle), przesiadywać [i] (stay on), utrzymywać się [i] (persist)
    link: łączyć [i], połączyć [p], wiązać [i] (associate), powiązać [p], linkować [i] (hyperlink)
    liquidate: likwidować [i] (wind up a company; eliminate), zlikwidować [p], upłynniać [i] (convert to cash), upłynnić [p], spłacać [i] (pay off a debt)
    listen: słuchać [i], posłuchać [p], nasłuchiwać [i] (listen out for), wsłuchiwać się [i] (listen attentively), wsłuchać się [p]
    listen to: słuchać [i] (music, radio), posłuchać [p], wysłuchiwać [i] (listen to someone), wysłuchać [p], przysłuchiwać się [i] (listen attentively)
    live: żyć [i] (be alive), mieszkać [i] (reside), zamieszkać [p], egzystować [i]
    load: ładować [i] (load a vehicle; cargo), załadować [p], naładować [p] (charge a battery; load a gun), wczytywać [i] (load data), wczytać [p]
    loathe: nienawidzić [i], znienawidzić [p], brzydzić się [i] (have an aversion to), gardzić [i] (despise)
    locate: lokalizować [i], zlokalizować [p], namierzać [i] (pinpoint with a device), namierzyć [p], odnajdywać [i] (track down)
    lock: zamykać [i] (lock with a key), zamknąć [p], ryglować [i] (bolt), zaryglować [p], blokować [i] (block, lock out)
    log: rejestrować [i] (record events), zarejestrować [p], zapisywać [i] (enter in a record), zapisać [p], wycinać [i] (fell trees)
    long: tęsknić [i] (long for something lost), zatęsknić [p], pragnąć [i] (crave), marzyć [i] (long for)
    look: patrzeć [i], spojrzeć [p], popatrzeć [p], wyglądać [i] (appear, look like), zerkać [i] (colloquial)
    look after: opiekować się [i], zaopiekować się [p], doglądać [i] (keep an eye on), pielęgnować [i] (nurse, tend), pilnować [i] (watch over)
    look at: patrzeć [i] (stare at), spojrzeć [p], oglądać [i], obejrzeć [p], przyglądać się [i] (observe)
    look for: szukać [i], poszukać [p], poszukiwać [i] (a missing person; hunt for a suspect or thing), wypatrywać [i] (try to find)
    look up: sprawdzać [i] (a word; in a dictionary), sprawdzić [p], wyszukiwać [i] (search online), wyszukać [p], zaglądać [i] (in a reference book)
    loosen: poluzowywać [i], poluzować [p], rozluźniać [i] (loosen up), rozluźnić [p], rozwiązywać [i] (untie)
    lose: tracić [i] (forfeit), stracić [p], zgubić [p] (misplace), przegrywać [i] (a game), przegrać [p]
    love: kochać [i] (be in love), pokochać [p], uwielbiać [i] (cherish)
    lower: obniżać [i] (reduce a price), obniżyć [p], zmniejszać [i] (decrease), zmniejszyć [p], opuszczać [i] (take down)
    lull: usypiać [i] (put to sleep; lull into security), uśpić [p], kołysać [i] (soothe a baby), uspokajać [i] (calm), uspokoić [p]
    lurk: czyhać [i] (lie in wait for), czaić się [i] (lurk, as danger), przyczaić się [p], podglądać [i] (watch stealthily)
    magnify: powiększać [i] (enlarge optically), powiększyć [p], wzmacniać [i] (amplify), wyolbrzymiać [i] (exaggerate), wyolbrzymić [p]
    maim: okaleczać [i], okaleczyć [p], kaleczyć [i], zniekształcać [i] (disfigure), zniekształcić [p]
    maintain: utrzymywać [i] (keep up), utrzymać [p], konserwować [i] (look after equipment), twierdzić [i] (assert; claim), podtrzymywać [i]
    make: robić [i], zrobić [p], wytwarzać [i] (manufacture), wytworzyć [p], sporządzać [i] (create a document)
    make up: wymyślać [i] (invent; invent a story), wymyślić [p], pogodzić się [p] (reconcile), malować się [i] (cosmetics; put on cosmetics), nadrabiać [i] (make up for something missed)
    malfunction: psuć się [i] (break down), zepsuć się [p], zawodzić [i] (fail), szwankować [i], nawalać [i] (colloquial, stop working)
    manage: zarządzać [i] (a business; an organization), kierować [i] (run a team or firm), prowadzić [i] (run), administrować [i] (administer), zdołać [p] (manage to do)
    mangle: szarpać [i] (tear to shreds), poszarpać [p], miażdżyć [i] (crush), zmiażdżyć [p], kaleczyć [i] (mutilate; botch)
    manipulate: manipulować [i], zmanipulować [p], sterować [i] (steer others), obsługiwać [i] (machines, data)
    manufacture: wytwarzać [i], wytworzyć [p], produkować [i], wyprodukować [p]
    map: mapować [i] (map data), zmapować [p], odwzorowywać [i], odwzorować [p], przypisywać [i] (assign)
    march: maszerować [i], pomaszerować [p], przemaszerować [p] (march long distances), kroczyć [i] (stride), manifestować [i] (protest march)
    marinate: marynować [i] (soak in marinade), zamarynować [p], peklować [i] (pickle or brine)
    mark: oznaczać [i] (label), oznaczyć [p], zaznaczać [i] (tick off), zaznaczyć [p], oceniać [i] (grade a test; homework)
    market: promować [i] (promote), wypromować [p], sprzedawać [i] (sell), komercjalizować [i] (commercialize), dystrybuować [i] (distribute)
    marvel: podziwiać [i] (marvel at; admire), zachwycać się [i], zachwycić się [p], dziwić się [i], zdumiewać się [i]
    mash: rozgniatać [i] (mash with a fork), rozgnieść [p], tłuc [i] (mash potatoes; pound), przecierać [i] (puree), przetrzeć [p]
    mask: maskować [i], zamaskować [p], ukrywać [i] (conceal), ukryć [p], zasłaniać [i] (veil; cover up flaws)
    massage: masować [i], wymasować [p], rozmasowywać [i] (knead muscles), rozmasować [p]
    master: opanowywać [i] (command a skill), opanować [p], panować [i] (control), zapanować [p], pokonywać [i] (overcome)
    match: pasować [i] (go well with), dopasowywać [i] (match up), dopasować [p], odpowiadać [i] (correspond to), dorównywać [i] (equal)
    materialize: materializować się [i], zmaterializować się [p], spełniać się [i] (come true), spełnić się [p], urzeczywistniać [i] (realize)
    matter: liczyć się [i] (count, be of significance), znaczyć [i] (mean something; make a difference), obchodzić [i] (be of consequence)
    maximize: maksymalizować [i], zmaksymalizować [p], wykorzystywać [i] (push to the limit), wykorzystać [p]
    mean: oznaczać [i] (signify; denote), znaczyć [i], zamierzać [i] (intend), dotyczyć [i] (refer to)
    measure: mierzyć [i], zmierzyć [p], odmierzać [i] (measure the dimensions of), odmierzyć [p], szacować [i] (gauge)
    mediate: pośredniczyć [i] (act as go-between), mediować [i] (settle a dispute), godzić [i] (settle or adjust), pogodzić [p], rozstrzygać [i] (settle a dispute)
    meet: spotykać się [i] (arrange to meet), spotkać się [p], poznawać [i] (meet for the first time), poznać [p], spełniać [i] (satisfy a requirement)
    melt: topnieć [i] (snow, ice), stopnieć [p], topić [i] (melt something), stopić [p], roztapiać [i] (melt away)
    memorize: zapamiętywać [i], zapamiętać [p], wkuwać [i] (colloquial; learn by heart), wkuć [p], utrwalać [i] (retain in memory)
    mend: naprawiać [i] (repair), naprawić [p], łatać [i] (patch), załatać [p], cerować [i] (darn socks)
    mention: wspominać [i], wspomnieć [p], wymieniać [i] (name; cite), wymienić [p], poruszać [i] (touch on; bring up)
    meow: miauczeć [i] (of a cat), miauknąć [p]
    merge: łączyć [i] (combine; companies), połączyć [p], scalać [i] (data, code), scalić [p], włączać się [i] (into traffic)
    merit: zasługiwać [i] (be worth, deserve), zasłużyć [p]
    migrate: migrować [i] (birds, herds), emigrować [i] (emigrate), wyemigrować [p], przenosić [i] (data, systems), przenieść [p]
    mimic: naśladować [i] (model on), imitować [i] (reproduce closely), przedrzeźniać [i] (ape mockingly), przedrzeźnić [p], parodiować [i] (parody)
    minimize: minimalizować [i] (a window; shrink), zminimalizować [p], zmniejszać [i] (reduce), bagatelizować [i] (play down; downplay), zbagatelizować [p]
    mislead: zwodzić [i] (deceive), zwieść [p], mylić [i] (delude), zmylić [p]
    misplace: gubić [i], zgubić [p], zapodziać [p] (lose by carelessness), zawieruszyć [p]
    miss: tęsknić [i] (feel the absence of), przegapiać [i] (a chance), przegapić [p], chybiać [i] (a target), chybić [p]
    mistake: mylić [i] (confuse one for another), pomylić [p], mylić się [i] (be mistaken), pomylić się [p]
    mix: mieszać [i] (stir together; blend), wymieszać [p] (stir together), zmieszać [p] (blend), pomieszać [p], mieszać się [i] (get mixed; become mixed)
    mobilize: mobilizować [i], zmobilizować [p], powoływać [i] (call up), powołać [p], gromadzić [i] (muster)
    mock: wyśmiewać [i] (make fun of), wyśmiać [p], kpić [i] (taunt sarcastically), drwić [i], ośmieszać [i] (ridicule)
    modify: modyfikować [i], zmodyfikować [p], zmieniać [i] (change), zmienić [p], przerabiać [i] (alter the structure)
    moisten: zwilżać [i], zwilżyć [p], nawilżać [i], nawilżyć [p], wilgotnieć [i] (become moist)
    mold: formować [i] (shape in a mold), uformować [p], kształtować [i] (shape a character), ukształtować [p], odlewać [i] (cast in a mold; cast metal)
    monitor: monitorować [i], obserwować [i] (observe), nadzorować [i] (keep an eye on), śledzić [i], kontrolować [i]
    mortgage: zastawiać [i] (pledge; pledge as security; put up as collateral), zastawić [p], obciążać [i] (encumber with a mortgage), obciążyć [p]
    motivate: motywować [i], zmotywować [p], zachęcać [i] (boost morale), zachęcić [p], mobilizować [i]
    mount: montować [i] (attach; fit onto a mount), zamontować [p], wspinać się [i] (climb up), wspiąć się [p], dosiadać [i] (a horse or bike)
    move: ruszać [i] (set in motion), ruszyć [p], przenosić [i] (move something; relocate), przenieść [p], przeprowadzać się [i] (move house; change residence)
    muffle: tłumić [i] (a sound; dampen; deaden), stłumić [p], zagłuszać [i], zagłuszyć [p], otulać [i] (wrap up)
    multiply: mnożyć [i] (numbers; in math), pomnożyć [p], rozmnażać się [i] (breed; grow in number), rozmnożyć się [p], zwielokrotniać [i] (increase greatly)
    mumble: mamrotać [i], wymamrotać [p], mruczeć [i], mruknąć [p], bełkotać [i]
    munch: żuć [i] (chew), przeżuć [p], przeżuwać [i] (chew), skubać [i] (nibble)
    murder: mordować [i] (commit murder), zamordować [p], zabijać [i], zabić [p]
    murmur: szeptać [i] (whisper), szepnąć [p], mamrotać [i] (mumble), mruczeć [i], mruknąć [p]
    muse: rozmyślać [i] (brood), dumać [i], zamyślać się [i] (muse), zamyślić się [p], rozważać [i] (reflect on)
    must: musieć [i] (obligation; be required), wymagać [i] (require), zobowiązywać [i] (make obligatory), zobowiązać [p]
    mutter: mamrotać [i] (mumble in one's beard), wymamrotać [p], burczeć [i] (grumble), mruczeć [i], narzekać [i] (mutter complaints)
    nag: gderać [i] (carp), zrzędzić [i] (scold shrilly), nękać [i] (badger), dręczyć [i] (pester), zamęczać [i] (pester endlessly)
    nail: przybijać [i] (fasten), przybić [p], wbijać [i] (hammer in; drive in), wbić [p], przygwoździć [p] (pin down)
    name: nazywać [i] (give a name to), nazwać [p], powoływać [i] (appoint to a post), powołać [p], mianować [i] (appoint)
    narrow: zwężać [i], zwęzić [p], zawężać [i] (narrow down), zawęzić [p], ograniczać [i] (reduce)
    navigate: nawigować [i], sterować [i] (steer), żeglować [i] (ships), pilotować [i] (guide through), orientować się [i] (find the way)
    need: potrzebować [i], wymagać [i] (to require)
    neglect: zaniedbywać [i] (be lax about; fail to do), zaniedbać [p], pomijać [i] (omit), pominąć [p], lekceważyć [i] (disregard)
    negotiate: negocjować [i], wynegocjować [p] (hammer out a deal), targować się [i] (haggle over a price), wytargować [p]
    nest: gniazdować [i] (birds of prey), gnieździć się [i], zagnieździć się [p], wysiadywać [i] (brood)
    neutralize: neutralizować [i] (chemistry), zneutralizować [p], unieszkodliwiać [i], unieszkodliwić [p]
    nibble: skubać [i] (bite lightly), skubnąć [p], podjadać [i] (sweets), przygryzać [i], przygryźć [p]
    nod: kiwać [i] (the head), kiwnąć [p], skinąć [p] (to someone), potakiwać [i]
    nominate: zgłaszać [i] (propose), zgłosić [p], wysuwać [i], wysunąć [p], nominować [i]
    notice: zauważać [i], zauważyć [p], dostrzegać [i] (catch sight of), dostrzec [p], spostrzegać [i]
    notify: informować [i], poinformować [p], powiadamiać [i], powiadomić [p], zawiadamiać [i]
    nourish: odżywiać [i], odżywić [p], karmić [i], nakarmić [p]
    nudge: szturchać [i] (poke gently), szturchnąć [p], trącać [i], popychać [i] (push lightly), popchnąć [p]
    numb: drętwieć [i] (go numb), zdrętwieć [p], znieczulać [i], znieczulić [p], otępiać [i] (emotionally)
    obey: słuchać [i], posłuchać [p], przestrzegać [i] (a rule, an order), stosować się [i], zastosować się [p]
    object: sprzeciwiać się [i], sprzeciwić się [p], protestować [i] (complain about), zaprotestować [p], oponować [i]
    oblige: zmuszać [i] (compel), zmusić [p], zobowiązywać [i], zobowiązać [p]
    obscure: zasłaniać [i] (hide from view), zasłonić [p], zaciemniać [i] (make unclear; make vague), zaciemnić [p], zamazywać [i]
    observe: obserwować [i], zaobserwować [p], przestrzegać [i] (a rule; follow a rule), zauważać [i] (remark), zauważyć [p]
    obsess: zaprzątać [i] (occupy the mind), zaprzątnąć [p], dręczyć [i] (torment), opętywać [i], opętać [p]
    obstruct: blokować [i], zablokować [p], utrudniać [i], utrudnić [p], zagradzać [i] (a path)
    obtain: uzyskiwać [i], uzyskać [p], otrzymywać [i], otrzymać [p], zdobywać [i] (procure)
    occupy: zajmować [i] (space, time; take up space), zająć [p], okupować [i] (take by force; military), zajmować się [i] (keep busy), zająć się [p]
    occur: zdarzać się [i] (an event), zdarzyć się [p], wydarzać się [i], wydarzyć się [p], występować [i] (be found)
    offend: obrażać [i] (hurt feelings; insult), obrazić [p], urażać [i], urazić [p], razić [i] (be irritating)
    offer: oferować [i], zaoferować [p], proponować [i] (propose to do), zaproponować [p], ofiarowywać [i] (hold out)
    offset: kompensować [i], zrekompensować [p], równoważyć [i], zrównoważyć [p], wyrównywać [i]
    omit: pomijać [i] (leave out), pominąć [p], opuszczać [i], opuścić [p]
    ooze: sączyć się [i] (seep), wysączyć się [p], wyciekać [i] (leak), wyciec [p], przesiąkać [i] (seep)
    open: otwierać [i], otworzyć [p], otwierać się [i] (intransitive), otworzyć się [p]
    operate: obsługiwać [i] (a machine), operować [i] (surgery), zoperować [p], prowadzić [i] (a business; run a business), działać [i] (function)
    oppose: sprzeciwiać się [i] (be against), sprzeciwić się [p], przeciwstawiać się [i], przeciwstawić się [p], zwalczać [i] (fight against)
    oppress: uciskać [i], ucisnąć [p], gnębić [i], przytłaczać [i] (weigh down), przytłoczyć [p]
    optimize: optymalizować [i], zoptymalizować [p], usprawniać [i], usprawnić [p]
    orchestrate: koordynować [i] (coordinate), skoordynować [p], aranżować [i] (music), zaaranżować [p], reżyserować [i] (stage)
    order: zamawiać [i] (a meal; goods), zamówić [p], rozkazywać [i] (command), rozkazać [p], porządkować [i] (arrange in order)
    organize: organizować [i], zorganizować [p], porządkować [i] (tidy; put in order), uporządkować [p], urządzać [i] (an event)
    orient: orientować [i], zorientować [p], ukierunkowywać [i] (align), ukierunkować [p], ustawiać [i] (align)
    oust: usuwać [i] (remove from office; remove from a post), usunąć [p], wypierać [i] (displace), wypędzać [i] (drive out), wypędzić [p]
    outdo: prześcigać [i], prześcignąć [p], przewyższać [i], przewyższyć [p], przebijać [i]
    outline: szkicować [i], naszkicować [p], nakreślać [i] (explain in outline), nakreślić [p], przedstawiać [i]
    outperform: przewyższać [i], przewyższyć [p], prześcigać [i], prześcignąć [p], wyprzedzać [i]
    overcome: pokonywać [i] (a task; defeat), pokonać [p], przezwyciężać [i], przezwyciężyć [p], zwyciężać [i] (defeat)
    overdo: przesadzać [i] (exaggerate), przesadzić [p], przemęczać się [i] (overexert), przemęczyć się [p]
    overflow: przelewać się [i] (spill over), przelać się [p], wylewać [i] (a river), wylać [p], zalewać [i] (flood)
    overhear: podsłuchiwać [i] (hear by chance), podsłuchać [p], słyszeć [i] (catch a remark), usłyszeć [p]
    overlap: nakładać się [i], nałożyć się [p], pokrywać się [i], pokryć się [p], zachodzić [i] (on each other)
    overpower: obezwładniać [i], obezwładnić [p], pokonywać [i] (defeat), pokonać [p], przytłaczać [i] (overcome)
    override: nadpisywać [i] (data, a setting), nadpisać [p], unieważniać [i] (annul), unieważnić [p], uchylać [i] (a decision)
    overrule: uchylać [i] (annul a decision; reverse a ruling), uchylić [p], unieważniać [i], unieważnić [p], przegłosowywać [i] (outvote)
    oversee: nadzorować [i], kontrolować [i], skontrolować [p], kierować [i] (manage), doglądać [i]
    overtake: wyprzedzać [i], wyprzedzić [p], doganiać [i] (catch up with), dogonić [p], prześcigać [i]
    overthrow: obalać [i] (a ruler), obalić [p], detronizować [i], zdetronizować [p], udaremniać [i] (a plan or decision)
    overturn: przewracać [i] (knock over), przewrócić [p], wywracać [i], wywrócić [p], uchylać [i] (a verdict; a ruling)
    overwhelm: przytłaczać [i] (swamp with), przytłoczyć [p], przerastać [i] (be too much for), przerosnąć [p], zasypywać [i] (swamp with)
    overwrite: nadpisywać [i], nadpisać [p], zastępować [i], zastąpić [p]
    owe: zawdzięczać [i] (be indebted for; owe a debt of gratitude), zawdzięczyć [p], wisieć [i] (owe money; colloquial), zalegać [i] (owe money)
    own: posiadać [i], mieć [i], władać [i]
    pacify: uspokajać [i], uspokoić [p], pacyfikować [i] (a region), spacyfikować [p], łagodzić [i]
    pack: pakować [i], spakować [p], zapakować [p] (for shipping), opakowywać [i]
    paddle: wiosłować [i], taplać się [i] (splash in shallow water), chlapać się [i], brodzić [i]
    paint: malować [i] (a picture), namalować [p], pomalować [p] (a wall), lakierować [i] (a car), polakierować [p]
    parade: defilować [i], paradować [i] (show off), popisywać się [i] (show off), popisać się [p], afiszować się [i]
    paralyze: paraliżować [i], sparaliżować [p], unieruchamiać [i] (bring to a standstill), unieruchomić [p], porażać [i]
    paraphrase: parafrazować [i], sparafrazować [p], przeformułowywać [i] (put in other words), przeformułować [p]
    park: parkować [i], zaparkować [p], stawiać [i] (a car), postawić [p]
    parody: parodiować [i], sparodiować [p], wyszydzać [i] (satirize), wyszydzić [p]
    partake: uczestniczyć [i] (join in), partycypować [i] (share in), spożywać [i] (food, drink), spożyć [p]
    participate: uczestniczyć [i], partycypować [i], angażować się [i], zaangażować się [p]
    pass: mijać [i] (go past), podawać [i] (hand over), podać [p], zdawać [i] (an exam), zdać [p]
    paste: wklejać [i] (text, files), wkleić [p], kleić [i] (glue), skleić [p], smarować [i] (spread on)
    pat: klepać [i] (tap lightly), klepnąć [p], głaskać [i] (stroke), pogłaskać [p], poklepywać [i] (lightly)
    patch: łatać [i] (software), załatać [p], naprawiać [i], naprawić [p]
    patrol: patrolować [i], strzec [i] (guard), pilnować [i]
    pause: wstrzymywać [i] (interrupt), wstrzymać [p], zawieszać [i], zawiesić [p], pauzować [i] (stop for a moment)
    pave: brukować [i] (cover a surface), wybrukować [p], asfaltować [i] (a road), wyasfaltować [p], utwardzać [i]
    pawn: zastawiać [i] (give as security), zastawić [p]
    pay: płacić [i], zapłacić [p], opłacać [i], opłacić [p], regulować [i] (settle a bill)
    pay back: zwracać [i] (refund), zwrócić [p], spłacać [i] (reimburse), spłacić [p], odpłacać [i] (take revenge)
    pedal: pedałować [i], kręcić [i] (a pedal; ride a bike)
    peek: zerkać [i], zerknąć [p], zaglądać [i], zajrzeć [p], podglądać [i]
    peel: obierać [i] (eggs, potatoes; fruit with a knife), obrać [p], łuskać [i] (nuts), zdzierać [i] (peel off), zedrzeć [p]
    penalize: karać [i], ukarać [p], penalizować [i], krzywdzić [i] (disadvantage), skrzywdzić [p]
    perceive: postrzegać [i], dostrzegać [i], dostrzec [p], odczuwać [i] (feel), odczuć [p]
    perch: przysiadać [i] (on a branch; a bird), przysiąść [p], przycupnąć [p] (sit on the edge), usadowić się [p], siedzieć [i] (sit high up)
    perfect: udoskonalać [i], udoskonalić [p], doskonalić [i], wydoskonalić [p], szlifować [i] (polish)
    perform: wykonywać [i] (carry out), wykonać [p], występować [i] (on stage), wystąpić [p], grać [i] (a play, a piece; music)
    perish: ginąć [i] (die), zginąć [p], umierać [i], umrzeć [p], gnić [i] (rot)
    permit: pozwalać [i], pozwolić [p], zezwalać [i] (officially), zezwolić [p], dopuszczać [i]
    perpetuate: utrwalać [i], utrwalić [p], uwieczniać [i], uwiecznić [p], podtrzymywać [i] (keep going)
    persevere: trwać [i] (carry on), wytrwać [p] (endure), wytrzymywać [i], wytrzymać [p]
    persist: trwać [i] (last), utrzymywać się [i] (continue to exist), upierać się [i] (insist), uprzeć się [p], przetrwać [p]
    persuade: przekonywać [i], przekonać [p], namawiać [i], namówić [p], nakłaniać [i]
    pester: nękać [i], naprzykrzać się [i], nagabywać [i], dręczyć [i], dopytywać się [i] (with questions)
    phone: dzwonić [i], zadzwonić [p], telefonować [i], zatelefonować [p]
    photograph: fotografować [i], sfotografować [p], pstrykać [i] (snap casually), pstryknąć [p]
    pick: wybierać [i] (choose), wybrać [p], zrywać [i] (flowers, fruit), zerwać [p], zbierać [i] (pick up)
    pick out: wybierać [i], wybrać [p], wyszukiwać [i], wyróżniać [i] (single out), wyróżnić [p]
    pick up: podnosić [i] (from the floor; lift), podnieść [p], odbierać [i] (collect someone or something), odebrać [p], zabierać [i] (a passenger)
    pierce: przebijać [i] (stab), przebić [p], przekłuwać [i], przekłuć [p], przeszywać [i]
    pile up: piętrzyć [i], spiętrzyć [p], piętrzyć się [i] (intransitive), gromadzić [i] (accumulate), nagromadzić [p]
    pilot: pilotować [i], sterować [i], prowadzić [i] (guide through), przeprowadzać [i], przeprowadzić [p]
    pin: przypinać [i] (with a pin), przypiąć [p], przybijać [i] (to a board), przytrzymywać [i] (hold down), przytrzymać [p]
    pinch: szczypać [i], uszczypnąć [p], ściskać [i] (squeeze tightly), ścisnąć [p] (squeeze tightly), zwędzić [p] (steal, informal)
    pinpoint: precyzować [i] (specify), sprecyzować [p], lokalizować [i] (locate exactly), zlokalizować [p], ustalać [i] (identify exactly)
    pitch: rzucać [i] (a ball; throw), rzucić [p], rozbijać [i] (a tent), rozbić [p], przedstawiać [i] (an idea; promote)
    pity: współczuć [i], żałować [i] (feel sorry for someone), litować się [i], ulitować się [p]
    place: umieszczać [i], umieścić [p], stawiać [i] (upright), kłaść [i] (flat), położyć [p]
    plague: nękać [i] (afflict), dręczyć [i], trapić [i], nawiedzać [i], nawiedzić [p]
    plan: planować [i] (intend), zaplanować [p], zamierzać [i] (intend), projektować [i] (design), zaprojektować [p]
    plant: sadzić [i], posadzić [p], siać [i] (sow seeds), zasiać [p], uprawiać [i] (grow a crop)
    plaster: tynkować [i] (a wall; cover with plaster), otynkować [p], gipsować [i] (a broken limb), oblepiać [i] (cover with posters), oblepić [p]
    play: grać [i] (games, sports, instruments), zagrać [p], bawić się [i] (have fun; play games), pobawić się [p], odtwarzać [i] (a recording)
    plead: błagać [i] (beg), prosić [i] (ask earnestly), poprosić [p], apelować [i] (appeal), bronić [i] (argue a case)
    please: zadowalać [i] (satisfy), zadowolić [p], cieszyć [i] (delight), ucieszyć [p], podobać się [i]
    pledge: obiecywać [i], obiecać [p], przysięgać [i] (swear an oath), przysiąc [p], ślubować [i]
    plot: knuć [i] (a scheme), uknuć [p], spiskować [i] (conspire), wykreślać [i] (a graph; on a graph), wykreślić [p]
    plow: orać [i], zaorać [p], przeorywać [i], przeorać [p]
    pluck: zrywać [i] (flowers, fruit), zerwać [p], skubać [i] (a bird; feathers, weeds), oskubać [p], wyrywać [i] (pull out; eyebrows)
    plug: podłączać [i] (plug in; connect), podłączyć [p], wtykać [i], zatykać [i] (block a hole), zatkać [p]
    plunder: plądrować [i], splądrować [p], rabować [i], zrabować [p], łupić [i]
    plunge: zanurzać [i] (immerse), zanurzyć [p], nurkować [i] (dive in), spadać [i] (fall steeply; drop sharply), spaść [p]
    point: wskazywać [i] (indicate), wskazać [p], pokazywać [i] (at something), celować [i] (aim at), wycelować [p]
    point out: wskazywać [i], wskazać [p], zaznaczać [i], zaznaczyć [p]
    poison: truć [i], otruć [p] (kill with poison), zatruć [p] (contaminate; foul), skażać [i] (contaminate), skazić [p]
    poke: dźgać [i] (jab), dźgnąć [p], szturchać [i] (nudge), szturchnąć [p], grzebać [i] (in something)
    polish: polerować [i], wypolerować [p], pastować [i] (shoes), wypastować [p], szlifować [i] (improve; refine)
    pollute: zanieczyszczać [i], zanieczyścić [p], skażać [i] (contaminate), skazić [p], zatruwać [i]
    ponder: rozważać [i], rozważyć [p], zastanawiać się [i], zastanowić się [p], rozmyślać [i] (brood)
    pop: pękać [i] (burst; intransitive), pęknąć [p], strzelać [i] (go bang), przekłuwać [i] (a bubble or blister), przekłuć [p]
    populate: zaludniać [i], zaludnić [p], zasiedlać [i], zasiedlić [p], zamieszkiwać [i] (inhabit)
    portray: przedstawiać [i] (depict), przedstawić [p], portretować [i], odgrywać [i] (a role; an actor), odegrać [p]
    pose: pozować [i] (for a photo; strike a pose), zapozować [p], stawiać [i] (a question or problem), postawić [p], stwarzać [i] (a threat)
    position: ustawiać [i], ustawić [p], umieszczać [i], umieścić [p], pozycjonować [i]
    possess: posiadać [i], mieć [i], piastować [i] (a position or title), dzierżyć [i]
    post: publikować [i] (online), opublikować [p], zamieszczać [i] (online; publish), zamieścić [p], wywieszać [i] (a notice; on a board)
    postpone: odkładać [i], odłożyć [p], przekładać [i] (a meeting), przełożyć [p], odraczać [i]
    pound: walić [i] (knock, throb; thump), tłuc [i] (crush; beat), łomotać [i] (throb), uderzać [i], uderzyć [p]
    pour: nalewać [i] (a drink), nalać [p], wlewać [i] (pour into), wylewać [i] (spill out), wylać [p]
    practice: ćwiczyć [i] (rehearse), poćwiczyć [p], trenować [i] (sports), praktykować [i] (put into practice), wykonywać [i] (a profession)
    praise: chwalić [i], pochwalić [p], wychwalać [i], wysławiać [i]
    pray: modlić się [i] (at a shrine or temple), pomodlić się [p], błagać [i] (beg)
    preach: głosić [i] (proclaim), wygłosić [p], moralizować [i] (lecture on morals), pouczać [i], pouczyć [p]
    precede: poprzedzać [i], poprzedzić [p]
    predict: przewidywać [i], przewidzieć [p], przepowiadać [i] (foretell; prophesy), przepowiedzieć [p], prognozować [i]
    prefer: woleć [i] (choose rather than), preferować [i], przedkładać [i], przedłożyć [p]
    preheat: nagrzewać [i] (an oven), nagrzać [p], rozgrzewać [i], rozgrzać [p], podgrzewać [i]
    preoccupy: zaprzątać [i] (occupy the mind), zaprzątnąć [p], pochłaniać [i] (be absorbed in), pochłonąć [p], niepokoić [i] (worry)
    prepare: przygotowywać [i], przygotować [p], szykować [i] (get ready), przyrządzać [i] (food), przyrządzić [p]
    prescribe: przepisywać [i] (a drug; medicine), przepisać [p], zalecać [i] (a treatment), zalecić [p], nakazywać [i] (dictate a rule)
    present: przedstawiać [i] (introduce; a person), przedstawić [p], prezentować [i] (a talk), zaprezentować [p], wręczać [i] (hand over; give a gift)
    preserve: zachowywać [i], zachować [p], chronić [i], konserwować [i] (food), skonserwować [p]
    preside: przewodniczyć [i] (a meeting), przewodzić [i], kierować [i] (take charge)
    press: naciskać [i] (a button), nacisnąć [p], przyciskać [i] (push against), ściskać [i] (squeeze), prasować [i] (clothes)
    presume: zakładać [i] (take for granted; assume), założyć [p], przypuszczać [i] (suppose), domniemywać [i], domniemać [p]
    pretend: udawać [i] (feign a feeling), udać [p], symulować [i], zasymulować [p], pozorować [i]
    prevail: zwyciężać [i] (triumph; win out), zwyciężyć [p], przeważać [i] (predominate), dominować [i] (predominate), panować [i] (be widespread)
    prevent: zapobiegać [i], zapobiec [p], uniemożliwiać [i], uniemożliwić [p], powstrzymywać [i]
    prick: kłuć [i], ukłuć [p], nakłuwać [i], nakłuć [p]
    print: drukować [i] (a document; publish a text; from a computer), wydrukować [p]
    probe: badać [i], zbadać [p], sondować [i], zgłębiać [i], zgłębić [p]
    proceed: kontynuować [i] (continue), postępować [i] (act, set about it), przystępować [i] (set about it), przystąpić [p], przechodzić [i] (go on)
    process: przetwarzać [i] (food, materials; data), przetworzyć [p], rozpatrywać [i] (a case), rozpatrzyć [p], realizować [i] (a transaction)
    proclaim: ogłaszać [i], ogłosić [p], obwieszczać [i], obwieścić [p], proklamować [i]
    produce: produkować [i] (a film, show), wyprodukować [p], wytwarzać [i], wytworzyć [p]
    profess: wyznawać [i] (a faith), deklarować [i] (declare openly), zadeklarować [p], twierdzić [i] (assert), głosić [i]
    program: programować [i], zaprogramować [p]
    progress: rozwijać się [i] (improve), rozwinąć się [p], posuwać się [i] (go forward), poprawiać się [i] (improve), poprawić się [p]
    prohibit: zakazywać [i], zakazać [p], zabraniać [i], zabronić [p]
    project: wyświetlać [i] (an image; onto a screen), wyświetlić [p], wystawać [i] (stick out), prognozować [i] (estimate the future), szacować [i] (estimate)
    prolong: przedłużać [i], przedłużyć [p], wydłużać [i], przeciągać [i] (drag out), przeciągnąć [p]
    promise: obiecywać [i], obiecać [p], przyrzekać [i], przyrzec [p]
    promote: promować [i] (for a product; advertise), wypromować [p], awansować [b] (to a higher position; at work), popierać [i] (support; encourage), poprzeć [p]
    prompt: skłaniać [i], skłonić [p], pobudzać [i], pobudzić [p], podpowiadać [i]
    pronounce: wymawiać [i] (a word), wymówić [p], orzekać [i] (a verdict), orzec [p], ogłaszać [i] (declare)
    propagate: rozpowszechniać [i] (an idea), rozpowszechnić [p], propagować [i] (an idea), rozmnażać [i] (plants, organisms; biology), rozmnożyć [p]
    propel: napędzać [i], popychać [i], popchnąć [p], pchać [i], ciskać [i] (hurl)
    propose: proponować [i], zaproponować [p], przedkładać [i] (put forward a plan; formally), oświadczać się [i] (marriage), oświadczyć się [p]
    prosecute: oskarżać [i] (charge), oskarżyć [p], ścigać [i] (legally), pozywać [i] (hold legally liable), pozwać [p]
    prosper: prosperować [i], kwitnąć [i], rozkwitać [i], rozkwitnąć [p]
    protect: chronić [i], ochronić [p], bronić [i], obronić [p], zabezpieczać [i]
    protest: protestować [i], zaprotestować [p], demonstrować [i] (demonstrate), manifestować [i]
    protrude: wystawać [i], sterczeć [i]
    prove: udowadniać [i], udowodnić [p], dowodzić [i], wykazywać [i], wykazać [p]
    provide: zapewniać [i] (supply with), zapewnić [p], dostarczać [i], dostarczyć [p], zaopatrywać [i]
    provoke: prowokować [i], sprowokować [p], wywoływać [i] (trigger; cause), wywołać [p], drażnić [i] (annoy)
    prune: przycinać [i], przyciąć [p], obcinać [i] (cut off), obciąć [p]
    pry: węszyć [i] (snoop), szperać [i], podważać [i] (prise open; pry open), podważyć [p]
    publish: publikować [i], opublikować [p], wydawać [i] (as publisher or editor), wydać [p], drukować [i] (carry an article)
    pull: ciągnąć [i], pociągnąć [p], szarpać [i] (pull roughly), szarpnąć [p], wyciągać [i]
    pulse: pulsować [i], tętnić [i], bić [i] (of the heart), kołatać [i]
    pump: pompować [i] (water; a heart pumping blood), napompować [p] (inflate), wypompowywać [i] (pump out), wypompować [p], tłoczyć [i]
    punch: uderzać [i] (hit with a fist), uderzyć [p], bić [i], dziurkować [i] (make a hole in paper), zdziurkować [p]
    punctuate: podkreślać [i] (emphasize), podkreślić [p], akcentować [i], zaakcentować [p], przerywać [i] (interrupt at intervals)
    puncture: przebijać [i] (a tire), przebić [p], przekłuwać [i] (prick open), przekłuć [p], nakłuwać [i] (medical)
    punish: karać [i], ukarać [p]
    purchase: kupować [i], kupić [p], nabywać [i] (formal), nabyć [p] (formal)
    purge: oczyszczać [i] (cleanse), oczyścić [p] (cleanse), usuwać [i] (data; remove people), usunąć [p] (data; remove people)
    purify: oczyszczać [i], oczyścić [p], rafinować [i] (refine a substance)
    pursue: ścigać [i] (chase), gonić [i] (chase), dążyć [i] (strive for a goal), realizować [i] (a goal), zrealizować [p] (a goal)
    push: pchać [i], pchnąć [p], popychać [i] (shove), naciskać [i] (a button), nacisnąć [p] (a button)
    put: kłaść [i] (flat), położyć [p] (flat), stawiać [i] (upright), postawić [p] (upright), wkładać [i] (into; put on clothes)
    put off: odkładać [i] (postpone), odłożyć [p] (postpone), przekładać [i] (reschedule), zniechęcać [i] (deter), zniechęcić [p] (deter)
    puzzle: zastanawiać [i] (make someone wonder), zastanowić [p] (make someone wonder), głowić się [i] (over a riddle), dziwić [i] (baffle), zdziwić [p] (baffle)
    quake: drżeć [i], zadrżeć [p], trząść się [i]
    qualify: kwalifikować się [i] (be eligible; meet the criteria), zakwalifikować się [p] (be eligible; meet the criteria), uprawniać [i] (entitle), zastrzegać [i] (limit a statement), zastrzec [p] (limit a statement)
    quarrel: kłócić się [i], pokłócić się [p], sprzeczać się [i], posprzeczać się [p]
    quench: gasić [i] (a fire; thirst), ugasić [p] (a fire; thirst), zaspokajać [i] (thirst), zaspokoić [p] (thirst)
    query: pytać [i] (inquire; question someone), zapytać [p] (inquire; question someone), odpytywać [i] (a database), odpytać [p] (a database)
    question: pytać [i] (ask), zapytać [p] (ask), kwestionować [i] (challenge), zakwestionować [p] (challenge), wątpić [i] (doubt)
    quit: rzucać [i] (a job; a habit), rzucić [p] (a job; a habit), przestawać [i] (stop doing), przestać [p] (stop doing), zrezygnować [p] (a job)
    quiver: drżeć [i], zadrżeć [p], drgać [i], drgnąć [p]
    quote: cytować [i], zacytować [p], wyceniać [i] (a price), wycenić [p] (a price)
    race: ścigać się [i] (compete), rywalizować [i] (compete), pędzić [i] (speed), popędzić [p] (speed), gnać [i] (speed)
    radiate: promieniować [i], emitować [i] (emit), wyemitować [p] (emit), emanować [i]
    raid: napadać [i] (a building), napaść [p] (a building), przeszukiwać [i] (police search), przeszukać [p] (police search), szturmować [i] (a building)
    rain: padać [i], lać [i] (pour down)
    raise: podnosić [i] (lift; increase), podnieść [p] (lift; increase), zwiększać [i] (increase), wychowywać [i] (children), hodować [i] (animals)
    rally: zbierać [i] (gather), zebrać [p] (gather), mobilizować [i] (mobilize), zmobilizować [p] (mobilize), jednoczyć [i] (bring together)
    ram: taranować [i], staranować [p], wbijać [i] (drive in), wbić [p] (drive in)
    ramble: wędrować [i] (hike), włóczyć się [i] (walk idly), odbiegać [i] (digress), odbiec [p] (digress)
    rank: klasyfikować [i] (assign a rank), sklasyfikować [p] (assign a rank), plasować się [i] (hold a rank), uplasować się [p] (hold a rank)
    rant: pomstować [i] (rail against), wściekać się [i] (rage), narzekać [i] (complain), wrzeszczeć [i] (bellow at someone), wrzasnąć [p] (bellow at someone)
    rate: oceniać [i] (judge), ocenić [p] (judge), szacować [i] (estimate), oszacować [p] (estimate)
    rationalize: racjonalizować [i], zracjonalizować [p], usprawiedliwiać [i] (justify; explain away), usprawiedliwić [p] (justify; explain away)
    rattle: grzechotać [i], zagrzechotać [p], brzęczeć [i], zabrzęczeć [p], stukotać [i]
    reach: docierać [i] (arrive), dotrzeć [p] (arrive), osiągać [i] (attain), osiągnąć [p] (attain), dosięgać [i] (extend to)
    react: reagować [i], zareagować [p]
    read: czytać [i], przeczytać [p], odczytywać [i] (a meter; interpret), odczytać [p] (a meter; interpret)
    reap: żąć [i] (cut crops), zbierać [i] (a harvest), zebrać [p] (a harvest), kosić [i] (cut crops), skosić [p] (cut crops)
    rear: wychowywać [i] (children), wychować [p] (children), hodować [i] (animals), wyhodować [p] (animals)
    reason: rozumować [i], wnioskować [i] (conclude; infer), wywnioskować [p] (conclude; infer), argumentować [i] (argue)
    reassure: uspokajać [i], uspokoić [p], zapewniać [i] (assure), zapewnić [p] (assure), pokrzepiać [i] (encourage)
    rebuild: odbudowywać [i], odbudować [p], przebudowywać [i] (remodel), przebudować [p] (remodel), rekonstruować [i] (restore)
    rebuke: ganić [i], zganić [p], karcić [i], skarcić [p], upominać [i]
    recall: pamiętać [i] (keep in memory), przywoływać [i] (call back), przywołać [p] (call back), wycofywać [i] (a product), wycofać [p] (a product)
    recede: cofać się [i], cofnąć się [p], odpływać [i] (the tide), ustępować [i] (the tide), ustąpić [p] (the tide)
    receive: dostawać [i], dostać [p], otrzymywać [i], otrzymać [p], przyjmować [i] (welcome)
    recharge: ładować [i] (refill), naładować [p] (refill), doładowywać [i] (top up), regenerować [i] (recover energy), zregenerować [p] (recover energy)
    reciprocate: odwzajemniać [i], odwzajemnić [p], odwdzięczać się [i] (a favor), odwdzięczyć się [p] (a favor), rewanżować się [i] (a favor)
    recite: recytować [i], wyrecytować [p], deklamować [i] (a poem), zadeklamować [p] (a poem)
    reckon: liczyć [i], policzyć [p], sądzić [i] (think), uważać [i] (think), przypuszczać [i] (think)
    reclaim: odzyskiwać [i], odzyskać [p], odbierać [i] (take back), odebrać [p] (take back), rekultywować [i] (land)
    recline: odchylać się [i] (tilt back), odchylić się [p] (tilt back), leżeć [i] (lie down), kłaść się [i] (lie down), położyć się [p] (lie down)
    recognize: rozpoznawać [i] (identify), rozpoznać [p] (identify), uznawać [i] (acknowledge officially), uznać [p] (acknowledge officially), poznawać [i] (identify)
    recoil: cofać się [i], cofnąć się [p], wzdrygać się [i] (flinch), wzdrygnąć się [p] (flinch), odskakiwać [i] (draw back)
    recommend: polecać [i], polecić [p], zalecać [i] (advise), zalecić [p] (advise), rekomendować [i]
    reconcile: godzić [i] (make compatible; with someone), pogodzić [p] (make compatible; with someone), jednać [i] (make up), uzgadniać [i] (make compatible; accounts), uzgodnić [p] (make compatible; accounts)
    reconsider: rozważać [i] (re-examine), rozważyć [p] (re-examine), przemyśleć [p], rewidować [i] (re-examine), zrewidować [p] (re-examine)
    record: nagrywać [i] (audio; video), nagrać [p] (audio; video), zapisywać [i] (write down), zapisać [p] (write down), rejestrować [i]
    recount: opowiadać [i] (narrate), opowiedzieć [p] (narrate), relacjonować [i] (describe vividly), przeliczać [i] (count again), przeliczyć [p] (count again)
    recover: odzyskiwać [i] (get back; regain), odzyskać [p] (get back; regain), zdrowieć [i] (heal; from illness), wyzdrowieć [p] (get well), ratować [i] (salvage)
    recreate: odtwarzać [i], odtworzyć [p], rekonstruować [i] (a scene), zrekonstruować [p] (a scene)
    recruit: rekrutować [i], zrekrutować [p], werbować [i] (solicit), zatrudniać [i] (hire), zatrudnić [p] (hire)
    rectify: naprawiać [i] (a fault), naprawić [p] (a fault), korygować [i], skorygować [p], poprawiać [i]
    recycle: przetwarzać [i] (waste; materials), przetworzyć [p] (waste; materials), odzyskiwać [i] (materials), odzyskać [p] (materials), przerabiać [i]
    redeem: realizować [i] (a voucher), wykupywać [i] (a pledge, a bond), wykupić [p] (a pledge, a bond), odkupywać [i] (spiritually; make amends), odkupić [p] (spiritually; make amends)
    redirect: przekierowywać [i] (web), przekierować [p] (web), przekazywać [i] (forward), przekazać [p] (forward)
    redo: powtarzać [i] (do over), powtórzyć [p] (do over), przerabiać [i] (rework), przerobić [p] (rework), poprawiać [i] (rework)
    reduce: zmniejszać [i], zmniejszyć [p], redukować [i], obniżać [i] (lower), obniżyć [p] (lower)
    refer: odsyłać [i] (refer a person), odesłać [p] (refer a person), kierować [i] (to a specialist), skierować [p] (to a specialist), odnosić się [i] (mention; to)
    refine: udoskonalać [i] (improve), udoskonalić [p] (improve), rafinować [i] (oil, sugar), oczyszczać [i] (purify), oczyścić [p] (purify)
    reflect: odbijać [i] (light; mirror), odbić [p] (light; mirror), odzwierciedlać [i] (mirror), zastanawiać się [i] (ponder), zastanowić się [p] (ponder)
    reform: reformować [i], zreformować [p], przekształcać [i], przekształcić [p]
    refrain: powstrzymywać się [i], powstrzymać się [p], wstrzymywać się [i], wstrzymać się [p], unikać [i] (avoid)
    refresh: odświeżać [i] (a page; data), odświeżyć [p] (a page; data), orzeźwiać [i], orzeźwić [p], aktualizować [i] (data)
    refrigerate: chłodzić [i], schłodzić [p], schładzać [i]
    refund: zwracać [i] (send the money back), zwrócić [p] (send the money back), refundować [i], zrefundować [p]
    refuse: odmawiać [i], odmówić [p], odrzucać [i] (reject), odrzucić [p] (reject)
    regain: odzyskiwać [i], odzyskać [p], odbijać [i] (recapture), odbić [p] (recapture)
    regard: uważać [i] (consider as), uznawać [i] (consider as), uznać [p] (consider as), postrzegać [i] (consider as), szanować [i] (esteem)
    regenerate: regenerować [i], zregenerować [p], odrastać [i] (grow back), odrosnąć [p] (grow back), odnawiać [i]
    register: rejestrować [i], zarejestrować [p], zgłaszać [i] (report officially; declare), zgłosić [p] (report officially; declare), wpisywać [i] (enter in a record)
    regret: żałować [i], pożałować [p], ubolewać [i] (lament), opłakiwać [i] (lament)
    regulate: regulować [i] (adjust), uregulować [p] (adjust), normować [i] (by rules), unormować [p] (by rules), dostosowywać [i] (adjust)
    rehearse: ćwiczyć [i], przećwiczyć [p], próbować [i] (a play, a piece)
    reign: panować [i], zapanować [p], rządzić [i], królować [i]
    reinforce: wzmacniać [i], wzmocnić [p], umacniać [i], umocnić [p]
    reiterate: powtarzać [i], powtórzyć [p], ponawiać [i], ponowić [p], podkreślać [i]
    reject: odrzucać [i] (an idea), odrzucić [p] (an idea), odtrącać [i] (a person), odtrącić [p] (a person)
    rekindle: rozpalać [i] (kindle a feeling afresh), rozpalić [p] (kindle a feeling afresh), ożywiać [i] (flare up again), ożywić [p] (flare up again), wskrzeszać [i]
    relapse: nawracać [i] (of an illness; flare up again), popadać [i] (into a habit), popaść [p] (into a habit), wracać [i] (into a habit)
    relate: wiązać [i] (link; connect), powiązać [p] (link; connect), opowiadać [i] (tell), opowiedzieć [p] (tell), dotyczyć [i] (be related to)
    relax: relaksować się [i] (unwind), zrelaksować się [p] (unwind), odprężać się [i] (unwind), rozluźniać [i] (loosen), rozluźnić [p] (loosen)
    relay: przekazywać [i], przekazać [p], przesyłać [i], przesłać [p], retransmitować [i] (broadcast)
    release: wypuszczać [i] (a product; let go), wypuścić [p] (a product; let go), uwalniać [i] (set free), uwolnić [p] (set free), wydawać [i] (publish)
    relegate: degradować [i] (demote), zdegradować [p] (demote), zsyłać [i] (banish), spadać [i] (of a sports team), spaść [p] (of a sports team)
    relent: ustępować [i] (give way), ustąpić [p] (give way), łagodnieć [i] (ease off), złagodnieć [p] (ease off), ulegać [i] (give in)
    relieve: łagodzić [i] (pain), złagodzić [p] (pain), uśmierzać [i] (pain), uśmierzyć [p] (pain), zmieniać [i] (take over from someone)
    relish: delektować się [i], rozkoszować się [i], cieszyć się [i] (enjoy), nacieszyć się [p] (enjoy)
    reload: przeładowywać [i] (ammunition; a weapon), przeładować [p] (ammunition; a weapon), wczytywać [i] (load again; a page), odświeżać [i] (a web page), odświeżyć [p] (a web page)
    rely: polegać [i] (count on), ufać [i] (trust), zaufać [p] (trust), liczyć [i] (count on), zależeć [i] (depend on)
    remain: zostawać [i], zostać [p], pozostawać [i], pozostać [p], trwać [i] (stay unchanged)
    remark: zauważać [i], zauważyć [p], komentować [i], skomentować [p]
    remedy: naprawiać [i] (correct), naprawić [p] (correct), zaradzić [p] (correct), leczyć [i] (cure), wyleczyć [p] (cure)
    remember: pamiętać [i] (keep in mind), zapamiętywać [i] (keep in mind), zapamiętać [p] (keep in mind), wspominać [i] (recall), upamiętniać [i] (honor the memory of)
    remind: przypominać [i], przypomnieć [p], upominać [i] (remind firmly), upomnieć [p] (remind firmly)
    remit: przelewać [i] (money), przelać [p] (money), przekazywać [i] (send), umarzać [i] (cancel a debt), umorzyć [p] (cancel a debt)
    remodel: przebudowywać [i], przebudować [p], przerabiać [i], przerobić [p], przekształcać [i]
    remove: usuwać [i], usunąć [p], kasować [i] (delete), zdejmować [i] (take off), zdjąć [p] (take off)
    rename: przemianowywać [i], przemianować [p]
    renew: odnawiać [i], odnowić [p], przedłużać [i] (a contract, a library book), przedłużyć [p] (a contract, a library book), wznawiać [i]
    renounce: wyrzekać się [i], wyrzec się [p], zrzekać się [i], zrzec się [p], rezygnować [i]
    renovate: remontować [i] (a building), wyremontować [p] (a building), odnawiać [i], odnowić [p], modernizować [i]
    rent: wynajmować [i] (rent out; rent from), wynająć [p] (rent out; rent from), wypożyczać [i] (a car; equipment), wypożyczyć [p] (a car; equipment), dzierżawić [i] (land)
    repair: naprawiać [i], naprawić [p], remontować [i] (a building), wyremontować [p] (a building), reperować [i]
    repay: spłacać [i] (a loan), spłacić [p] (a loan), zwracać [i] (give back; reimburse), zwrócić [p] (give back; reimburse), odwdzięczać się [i] (a favor)
    repeal: uchylać [i], uchylić [p], znosić [i], znieść [p], unieważniać [i]
    repeat: powtarzać [i], powtórzyć [p], ponawiać [i], ponowić [p]
    repel: odpierać [i] (an attack), odeprzeć [p] (an attack), odpychać [i], odepchnąć [p], odstraszać [i]
    replace: zastępować [i] (stand in for; substitute), zastąpić [p] (stand in for; substitute), wymieniać [i] (swap out), wymienić [p] (swap out), zamieniać [i] (swap)
    replenish: uzupełniać [i] (top up; restock), uzupełnić [p] (top up; restock), napełniać [i] (fill up), napełnić [p] (fill up), zaopatrywać [i] (restock)
    reply: odpowiadać [i], odpowiedzieć [p], odpisywać [i] (a message; a letter), odpisać [p] (a message; a letter), ripostować [i] (retort)
    report: zgłaszać [i] (to the police), zgłosić [p] (to the police), informować [i] (news), poinformować [p] (news), relacjonować [i] (news)
    represent: reprezentować [i], przedstawiać [i] (depict), przedstawić [p] (depict), oznaczać [i] (stand for), symbolizować [i] (stand for)
    repress: tłumić [i], stłumić [p], wypierać [i] (psychologically), wyprzeć [p] (psychologically), represjonować [i]
    reprimand: ganić [i], zganić [p], karcić [i], skarcić [p], upominać [i] (officially)
    reproach: zarzucać [i] (blame someone for), zarzucić [p] (blame someone for), wypominać [i], wypomnieć [p], obwiniać [i]
    reproduce: powielać [i] (copy), powielić [p] (copy), rozmnażać się [i] (breed; biology), rozmnożyć się [p] (breed; biology), odtwarzać [i] (recreate)
    request: prosić [i], poprosić [p], wnioskować [i] (formally apply), ubiegać się [i] (apply for)
    require: wymagać [i] (demand; need), potrzebować [i] (need), żądać [i] (demand), zażądać [p] (demand)
    reschedule: przekładać [i] (move to another date), przełożyć [p] (move to another date), przesuwać [i], przesunąć [p]
    rescind: uchylać [i], uchylić [p], unieważniać [i], unieważnić [p], odwoływać [i]
    rescue: ratować [i], uratować [p], ocalać [i], ocalić [p], wyratować [p]
    research: badać [i], zbadać [p], zgłębiać [i], zgłębić [p]
    reserve: rezerwować [i], zarezerwować [p], odkładać [i] (set aside), odłożyć [p] (set aside)
    reshape: przekształcać [i], przekształcić [p], przeobrażać [i], przeobrazić [p]
    reside: mieszkać [i], zamieszkiwać [i], zamieszkać [p]
    resign: rezygnować [i] (leave a post; leave a job), zrezygnować [p] (leave a post; leave a job), ustępować [i] (leave a post), ustąpić [p] (leave a post), odchodzić [i] (leave a job)
    resist: opierać się [i], oprzeć się [p], przeciwstawiać się [i], przeciwstawić się [p], wytrzymywać [i] (withstand)
    resolve: rozwiązywać [i] (a problem; solve a puzzle), rozwiązać [p] (a problem; solve a puzzle), postanawiać [i] (decide firmly), postanowić [p] (decide firmly), rozstrzygać [i] (decide)
    resort: uciekać się [i], uciec się [p], chwytać się [i], chwycić się [p]
    respect: szanować [i], uszanować [p], respektować [i], czcić [i] (honor), podziwiać [i] (admire)
    respond: odpowiadać [i], odpowiedzieć [p], reagować [i] (react), zareagować [p] (react)
    rest: odpoczywać [i], odpocząć [p], wypoczywać [i], wypocząć [p], oszczędzać [i] (spare an injured part)
    restart: restartować [i] (a computer), zrestartować [p] (a computer), wznawiać [i] (resume), wznowić [p] (resume), zaczynać [i] (start over)
    restore: przywracać [i] (a service; health), przywrócić [p] (a service; health), restaurować [i] (an object), odrestaurować [p] (an object), odnawiać [i] (an object)
    restrain: powstrzymywać [i] (hold back a person), powstrzymać [p] (hold back a person), hamować [i] (keep in check), pohamować [p] (keep in check)
    restrict: ograniczać [i], ograniczyć [p], limitować [i], zawężać [i] (limit to), zawęzić [p] (limit to)
    result: wynikać [i] (result from; arise), wyniknąć [p] (result from; arise), skutkować [i] (result in), prowadzić [i] (result in), doprowadzić [p] (result in)
    resume: wznawiać [i], wznowić [p], kontynuować [i] (carry on), podejmować [i] (take up again), podjąć [p] (take up again)
    resurrect: wskrzeszać [i] (raise from the dead), wskrzesić [p] (raise from the dead), zmartwychwstawać [i] (rise from the dead), zmartwychwstać [p] (rise from the dead), ożywiać [i] (revive)
    retain: zachowywać [i] (keep unchanged; keep), zachować [p] (keep unchanged; keep), zatrzymywać [i] (withhold; keep), zatrzymać [p] (withhold; keep), utrzymywać [i]
    retreat: wycofywać się [i], wycofać się [p], cofać się [i], cofnąć się [p]
    retrieve: odzyskiwać [i], odzyskać [p], pobierać [i] (data), pobrać [p] (data), wyciągać [i] (take out)
    return: wracać [i] (go back; come back), wrócić [p] (go back; come back), zwracać [i] (give back), zwrócić [p] (give back), oddawać [i] (give back)
    reunite: łączyć [i] (join again), połączyć [p] (join again), jednoczyć [i], zjednoczyć [p], schodzić się [i] (get back together)
    reveal: ujawniać [i], ujawnić [p], odsłaniać [i] (uncover), odsłonić [p] (uncover), wyjawiać [i] (disclose)
    reverse: odwracać [i] (flip), odwrócić [p] (flip), cofać [i] (a car; a decision), cofnąć [p] (a car; a decision), uchylać [i] (a decision)
    revert: wracać [i], wrócić [p], cofać [i] (undo a change), cofnąć [p] (undo a change), przywracać [i] (reset)
    review: przeglądać [i] (go over), przejrzeć [p] (go over), recenzować [i] (a book or film), zrecenzować [p] (a book or film), powtarzać [i] (study again)
    revise: poprawiać [i] (a text), poprawić [p] (a text), nowelizować [i] (a law), powtarzać [i] (study again), powtórzyć [p] (study again)
    revive: ożywiać [i], ożywić [p], odżywać [i] (come back to life), odżyć [p] (come back to life), reanimować [i] (resuscitate)
    revoke: odwoływać [i], odwołać [p], cofać [i] (a licence), cofnąć [p] (a licence), odbierać [i] (strip a right)
    revolutionize: rewolucjonizować [i], zrewolucjonizować [p]
    reward: nagradzać [i], nagrodzić [p], wynagradzać [i], wynagrodzić [p], premiować [i]
    rhyme: rymować się [i], rymować [i] (write verse), zrymować [p] (write verse)
    ride: jeździć [i], jechać [i], pojechać [p], dosiadać [i] (a horse), dosiąść [p] (a horse)
    ring: dzwonić [i] (a bell), zadzwonić [p] (a bell), brzmieć [i] (sound), zabrzmieć [p] (sound), rozbrzmiewać [i] (ring out)
    rinse: płukać [i], wypłukać [p], przepłukać [p], spłukiwać [i], spłukać [p]
    rip: drzeć [i], podrzeć [p], rozrywać [i] (tear open), rozerwać [p] (tear open), zrywać [i] (tear off)
    ripple: falować [i], zafalować [p], marszczyć się [i], zmarszczyć się [p]
    rise: wstawać [i] (get up), wstać [p] (get up), wschodzić [i] (the sun), rosnąć [i] (dough; increase), podnosić się [i] (stand up)
    risk: ryzykować [i], zaryzykować [p], narażać [i] (stake), narazić [p] (stake)
    rival: rywalizować [i], konkurować [i], dorównywać [i] (come close to equalling), dorównać [p] (come close to equalling)
    roam: włóczyć się [i], wędrować [i], błąkać się [i], wałęsać się [i], przemierzać [i]
    roar: ryczeć [i], ryknąć [p], zaryczeć [p], huczeć [i], grzmieć [i]
    roast: piec [i] (meat), upiec [p] (meat), prażyć [i] (coffee, nuts), uprażyć [p] (coffee, nuts)
    rob: okradać [i], okraść [p], rabować [i], obrabować [p], napadać [i] (hold up)
    roll: toczyć [i] (roll something), potoczyć [p] (roll something), toczyć się [i], zwijać [i] (roll up), zwinąć [p] (roll up)
    rotate: obracać [i] (turn something), obrócić [p] (turn something), obracać się [i], obrócić się [p], kręcić się [i]
    rouse: budzić [i] (wake someone), obudzić [p] (wake someone), pobudzać [i], pobudzić [p], wzbudzać [i] (stir up)
    route: kierować [i] (direct to different places), skierować [p] (direct to different places), przekierowywać [i] (divert), przekierować [p] (divert), wytyczać [i] (a route)
    row: wiosłować [i], kłócić się [i] (have a row), pokłócić się [p] (have a row), awanturować się [i] (have a row)
    rub: trzeć [i], potrzeć [p], pocierać [i], wcierać [i] (rub in), wetrzeć [p] (rub in)
    ruin: niszczyć [i], zniszczyć [p], rujnować [i], zrujnować [p], psuć [i] (spoil)
    rule: rządzić [i], panować [i], władać [i], orzekać [i] (of a court), orzec [p] (of a court)
    rumble: dudnić [i], zadudnić [p], grzmieć [i], zagrzmieć [p], huczeć [i]
    rummage: grzebać [i], pogrzebać [p], szperać [i], poszperać [p], przetrząsać [i]
    run: biec [i], biegać [i], pobiec [p], prowadzić [i] (a business), zarządzać [i] (a business)
    run away: uciekać [i], uciec [p], zbiec [p]
    rupture: pękać [i], pęknąć [p], zrywać [i] (break off relations), zerwać [p] (break off relations), rwać się [i]
    rush: spieszyć się [i], pospieszyć się [p], pędzić [i], popędzić [p], poganiać [i] (hurry someone)
    rust: rdzewieć [i], zardzewieć [p], korodować [i], skorodować [p], utleniać się [i] (corrode)
    rustle: szeleścić [i] (leaves in a breeze), zaszeleścić [p] (leaves in a breeze), szumieć [i], zaszumieć [p]
    sabotage: sabotować [i], zsabotować [p], torpedować [i], udaremniać [i], udaremnić [p]
    sacrifice: poświęcać [i], poświęcić [p], ofiarowywać [i] (offer up), ofiarować [p] (offer up)
    sadden: smucić [i] (make sad), zasmucić [p] (make sad), smucić się [i] (feel sad), martwić [i] (upset), zmartwić [p] (upset)
    safeguard: chronić [i], ochronić [p], zabezpieczać [i], zabezpieczyć [p], strzec [i]
    sail: żeglować [i], płynąć [i] (by ship), popłynąć [p] (by ship), wypływać [i] (leave port; set sail), wypłynąć [p] (leave port; set sail)
    salute: salutować [i] (military), zasalutować [p] (military), pozdrawiać [i] (greet), pozdrowić [p] (greet), czcić [i] (pay tribute to)
    salvage: ratować [i], uratować [p], wydobywać [i] (raise a wreck), wydobyć [p] (raise a wreck), odzyskiwać [i]
    sanction: sankcjonować [i] (approve), usankcjonować [p] (approve), zatwierdzać [i] (approve), zatwierdzić [p] (approve), karać [i] (penalize)
    sanitize: dezynfekować [i], zdezynfekować [p], odkażać [i], oczyszczać [i] (clean up data), oczyścić [p] (clean up data)
    sap: osłabiać [i], osłabić [p], wyczerpywać [i], wyczerpać [p], podkopywać [i] (eat away)
    satisfy: zadowalać [i], zadowolić [p], spełniać [i] (a requirement), spełnić [p] (a requirement), zaspokajać [i] (a need)
    saturate: nasycać [i], nasycić [p], nasiąkać [i] (soak into), nasiąknąć [p] (soak into), przemoczyć [p] (soak)
    save: oszczędzać [i] (money), zaoszczędzić [p] (money), ratować [i] (rescue), uratować [p] (rescue), zapisywać [i] (data, files)
    savor: delektować się [i] (savor deeply), rozkoszować się [i] (savor deeply), kosztować [i] (taste), skosztować [p] (taste), rozsmakować się [p] (savor deeply)
    saw: piłować [i], przepiłować [p], odpiłować [p] (saw off)
    say: mówić [i], powiedzieć [p], twierdzić [i] (state), stwierdzać [i] (state), stwierdzić [p] (state)
    scale: wspinać się [i] (climb), wspiąć się [p] (climb), skalować [i] (resize; scale up), przeskalować [p] (resize; scale up), zdobywać [i] (a mountain)
    scan: skanować [i], zeskanować [p], przeglądać [i] (skim; look over quickly), przejrzeć [p] (skim; look over quickly)
    scandalize: gorszyć [i], zgorszyć [p], oburzać [i] (outrage), oburzyć [p] (outrage), szokować [i] (shock)
    scar: naznaczać [i] (mark), naznaczyć [p] (mark), zabliźniać się [i] (heal over), zabliźnić się [p] (heal over), szpecić [i] (disfigure)
    scare: straszyć [i], przestraszyć [p], płoszyć [i] (scare away), spłoszyć [p] (scare away), bać się [i] (be scared)
    scatter: rozsypywać [i], rozsypać [p], rozrzucać [i], rozrzucić [p], rozpraszać się [i] (intransitive; be scattered)
    schedule: planować [i], zaplanować [p], wyznaczać [i] (set a time), wyznaczyć [p] (set a time), umawiać [i] (an appointment)
    scheme: knuć [i], uknuć [p], spiskować [i] (plot)
    scold: besztać [i], zbesztać [p], ganić [i], zganić [p], łajać [i]
    scoop: czerpać [i] (liquid), zaczerpnąć [p] (liquid), nabierać [i] (spoon up), nabrać [p] (spoon up), wydrążać [i] (hollow out)
    scorch: przypalać [i], przypalić [p], osmalać [i], osmalić [p], przypiekać [i]
    score: zdobywać [i] (a goal), zdobyć [p] (a goal), strzelać [i] (a goal), strzelić [p] (a goal), punktować [i] (grade; a test)
    scorn: gardzić [i], pogardzać [i], wzgardzić [p]
    scour: szorować [i], wyszorować [p], przeszukiwać [i] (search everywhere), przeszukać [p] (search everywhere), przeczesywać [i] (search through)
    scout: zwiadować [i], wypatrywać [i] (look around for), wypatrzyć [p] (look around for), wyszukiwać [i] (talent), wyszukać [p] (talent)
    scrape: skrobać [i], zeskrobać [p], zdrapywać [i] (scrape off), zdrapać [p] (scrape off), ocierać [i] (graze the skin)
    scratch: drapać [i], podrapać [p] (an itch), zadrapać [p] (with claws), zarysować [p] (a surface)
    scream: krzyczeć [i], krzyknąć [p], wrzeszczeć [i], wrzasnąć [p], piszczeć [i] (in fear)
    screw: wkręcać [i] (screw in), wkręcić [p] (screw in), przykręcać [i] (tighten), przykręcić [p] (tighten), dokręcać [i] (tighten)
    scribble: gryzmolić [i], nagryzmolić [p], bazgrać [i], nabazgrać [p]
    scroll: przewijać [i], przewinąć [p], przesuwać [i], przesunąć [p]
    scrub: szorować [i], wyszorować [p], zmywać [i] (scrub off), zmyć [p] (scrub off), szczotkować [i]
    scrutinize: badać [i] (examine closely), zbadać [p] (examine closely), przyglądać się [i], przyjrzeć się [p], analizować [i]
    sculpt: rzeźbić [i], wyrzeźbić [p], modelować [i] (mold), wymodelować [p] (mold)
    seal: zaklejać [i] (an envelope), zakleić [p] (an envelope), pieczętować [i], zapieczętować [p], uszczelniać [i] (a gap)
    search: szukać [i], poszukać [p], przeszukiwać [i] (a place; by police), przeszukać [p] (a place; by police), wyszukiwać [i] (online)
    season: przyprawiać [i], przyprawić [p], doprawiać [i], doprawić [p]
    secure: zabezpieczać [i] (lock up), zabezpieczyć [p] (lock up), mocować [i] (fasten), zamocować [p] (fasten), zdobywać [i] (obtain)
    sedate: uspokajać [i] (with drugs), uspokoić [p] (with drugs), usypiać [i], uśpić [p], znieczulać [i] (anesthetize)
    seduce: uwodzić [i], uwieść [p], kusić [i], skusić [p], zwabiać [i] (lure)
    see: widzieć [i], zobaczyć [p], dostrzegać [i] (realize), dostrzec [p] (realize), rozumieć [i] (understand)
    seek: szukać [i], poszukiwać [i], poszukać [p], dążyć [i] (pursue), ubiegać się [i] (pursue)
    seem: wydawać się [i], wydać się [p], zdawać się [i], wyglądać [i] (appear)
    segment: segmentować [i], posegmentować [p], dzielić [i], podzielić [p]
    segregate: segregować [i], posegregować [p], oddzielać [i], oddzielić [p], izolować [i]
    select: wybierać [i], wybrać [p], zaznaczać [i] (on screen), zaznaczyć [p] (on screen), selekcjonować [i]
    sell: sprzedawać [i], sprzedać [p], handlować [i] (deal in), dystrybuować [i] (distribute)
    send: wysyłać [i], wysłać [p], przesyłać [i], przesłać [p], nadawać [i] (a parcel; goods)
    send back: odsyłać [i], odesłać [p], zwracać [i] (goods), zwrócić [p] (goods)
    sentence: skazywać [i], skazać [p], wyrokować [i]
    separate: oddzielać [i] (keep apart), oddzielić [p] (keep apart), rozdzielać [i], rozstawać się [i] (part ways), rozstać się [p] (part ways)
    serve: służyć [i] (a master; be of use; military), podawać [i] (food), podać [p] (food), obsługiwać [i] (customers), obsłużyć [p] (customers)
    set: ustawiać [i] (upright; a clock or alarm), ustawić [p] (upright; a clock or alarm), ustalać [i] (a date, a rule), ustalić [p] (a date, a rule), osadzać [i] (mount in place)
    set off: wyruszać [i] (depart), wyruszyć [p] (depart), wywoływać [i] (trigger), wywołać [p] (trigger), detonować [i] (a bomb)
    set up: zakładać [i] (found; establish), założyć [p] (found; establish), konfigurować [i] (configure), skonfigurować [p] (configure), instalować [i] (install)
    settle: załatwiać [i] (a matter), rozstrzygać [i] (a dispute), regulować [i] (a bill), osiedlać się [i] (settle in a place), osiedlić się [p] (settle in a place)
    sever: odcinać [i], odciąć [p], przecinać [i], zrywać [i] (cut ties), zerwać [p] (cut ties)
    sew: szyć [i], uszyć [p], przyszywać [i] (sew on), przyszyć [p] (sew on), zszywać [i]
    shackle: skuwać [i], skuć [p], zakuwać [i], zakuć [p], krępować [i] (restrict freedom)
    shade: cieniować [i] (in a drawing), zacieniać [i] (block light), zacienić [p] (block light), ocieniać [i] (block light), ocienić [p] (block light)
    shake: trząść [i], potrząsać [i], potrząsnąć [p], otrząsać [i] (shake off), drżeć [i] (tremble)
    shampoo: myć [i] (hair), umyć [p] (hair), czyścić [i] (a carpet), wyczyścić [p] (a carpet)
    shape: kształtować [i], ukształtować [p], formować [i], uformować [p], modelować [i] (mold)
    share: dzielić się [i] (let someone know), podzielić się [p] (let someone know), dzielić [i], udostępniać [i], udostępnić [p]
    shatter: rozbijać [i], rozbić [p], roztrzaskiwać [i], roztrzaskać [p], rozbijać się [i] (intransitive)
    shave: golić [i], ogolić [p], golić się [i], ogolić się [p], zgolić [p] (shave off)
    shear: strzyc [i], ostrzyc [p], przycinać [i] (trim), przyciąć [p] (trim)
    shed: zrzucać [i] (leaves, skin), zrzucić [p] (leaves, skin), linieć [i] (hair, skin), ronić [i] (tears), przelewać [i] (blood)
    shelter: chronić [i] (from rain), ochronić [p] (from rain), ukrywać [i] (hide someone), chronić się [i] (take cover), schronić się [p] (take cover)
    shift: przesuwać [i], przesunąć [p], zmieniać [i] (change), zmienić [p] (change), przenosić [i]
    shimmer: migotać [i], zamigotać [p], mienić się [i], lśnić [i], połyskiwać [i]
    shine: świecić [i] (the sun; light up), zaświecić [p] (light up), błyszczeć [i], zabłysnąć [p], lśnić [i]
    shiver: drżeć [i], zadrżeć [p], dygotać [i], trząść się [i]
    shock: szokować [i], zszokować [p], wstrząsać [i], wstrząsnąć [p], porażać [i] (electric shock)
    shoo: przeganiać [i], przegonić [p], przepędzać [i], przepędzić [p], płoszyć [i]
    shoot: strzelać [i], strzelić [p], zastrzelić [p] (kill), kręcić [i] (a film), nakręcić [p] (a film)
    shorten: skracać [i], skrócić [p]
    should: musieć [i] (obligation; the usual Polish for "should" is the defective powinien, which the table cannot show)
    shout: krzyczeć [i], krzyknąć [p], wołać [i], zawołać [p], wrzeszczeć [i] (yell angrily)
    shove: pchać [i], pchnąć [p], popychać [i], wpychać [i] (shove into), wepchnąć [p] (shove into)
    shovel: odgarniać [i] (snow), odgarnąć [p] (snow), kopać [i] (dig), odśnieżać [i] (snow), odśnieżyć [p] (snow)
    show: pokazywać [i], pokazać [p], wystawiać [i] (exhibit), okazywać [i] (display a feeling), wskazywać [i] (indicate; show the way)
    show off: popisywać się [i], popisać się [p], chwalić się [i], pochwalić się [p], szpanować [i] (informal)
    show up: pojawiać się [i], pojawić się [p], zjawiać się [i] (turn up), zjawić się [p] (turn up), przychodzić [i] (attend)
    shred: drzeć [i] (paper; tear into pieces), podrzeć [p] (paper; tear into pieces), szatkować [i], poszatkować [p], niszczyć [i] (documents)
    shrink: kurczyć się [i] (of clothes), skurczyć się [p] (of clothes), zmniejszać się [i], zmniejszyć się [p], maleć [i]
    shudder: wzdrygać się [i], wzdrygnąć się [p], drżeć [i] (be horrified), zadrżeć [p] (be horrified)
    shuffle: tasować [i] (cards), potasować [p] (cards), szurać [i] (walk dragging the feet; shuffle feet), przestawiać [i] (rearrange)
    shun: unikać [i], uniknąć [p], stronić [i] (keep away from), wystrzegać się [i], omijać [i]
    shut: zamykać [i], zamknąć [p], zatrzaskiwać [i] (a door), zatrzasnąć [p] (a door), zamykać się [i] (intransitive)
    sidestep: omijać [i] (bypass), ominąć [p] (bypass), unikać [i], uchylać się [i] (dodge), obchodzić [i] (bypass)
    siege: oblegać [i], otaczać [i] (surround), otoczyć [p] (surround)
    sift: przesiewać [i], przesiać [p], odsiewać [i] (sort out), odsiać [p] (sort out), przeczesywać [i] (sift through)
    sigh: wzdychać [i], westchnąć [p]
    sign: podpisywać [i], podpisać [p], sygnować [i] (autograph; formal)
    signal: sygnalizować [i], zasygnalizować [p], wskazywać [i] (indicate), wskazać [p] (indicate)
    silence: uciszać [i] (hush), uciszyć [p] (hush), wyciszać [i] (mute a device), milknąć [i] (fall silent), zamilknąć [p] (fall silent)
    simplify: upraszczać [i], uprościć [p]
    simulate: symulować [i], zasymulować [p], naśladować [i] (imitate), udawać [i] (imitate)
    sing: śpiewać [i], zaśpiewać [p]
    singe: osmalać [i], osmalić [p], przypalać [i], przypalić [p]
    sink: tonąć [i] (go down; ships), zatonąć [p] (ships), zatapiać [i] (cause to sink), zatopić [p] (cause to sink), zachodzić [i] (the sun)
    sip: sączyć [i], popijać [i]
    skate: jeździć [i] (on skates), ślizgać się [i] (on ice)
    sketch: szkicować [i], naszkicować [p], rysować [i] (draw), narysować [p] (draw), projektować [i] (design)
    skewer: nadziewać [i] (pierce), nadziać [p] (pierce), nabijać [i] (pierce), nabić [p] (pierce), przebijać [i] (pierce)
    ski: jeździć [i] (on skis), szusować [i] (informal), zjeżdżać [i] (down a slope), zjechać [p] (down a slope)
    skim: przeglądać [i] (a text; read quickly), przejrzeć [p] (a text; read quickly), zbierać [i] (skim off), odtłuszczać [i] (milk), muskać [i] (graze; pass close over the surface)
    skip: pomijać [i] (omit), pominąć [p] (omit), opuszczać [i] (a class), opuścić [p] (a class), podskakiwać [i] (hop)
    slam: trzaskać [i] (a door), trzasnąć [p] (a door), uderzać [i] (hit hard), uderzyć [p] (hit hard), rzucać [i] (hurl down)
    slander: oczerniać [i], oczernić [p], zniesławiać [i], zniesławić [p], szkalować [i]
    slap: policzkować [i] (on the face), spoliczkować [p] (on the face), uderzać [i] (with an open hand), uderzyć [p] (with an open hand), klepnąć [p]
    slash: ciąć [i] (draw a cut), rozcinać [i] (cut open), rozciąć [p] (cut open), obcinać [i] (prices, budgets), obciąć [p] (prices, budgets)
    sleep: spać [i], pospać [p], przespać [p] (sleep through), zasypiać [i] (fall asleep), zasnąć [p] (fall asleep)
    slice: kroić [i], pokroić [p], krajać [i], pokrajać [p]
    slide: ślizgać się [i], zsuwać się [i], zsunąć się [p], przesuwać [i] (push along), przesunąć [p] (push along)
    slip: ślizgać się [i] (lose footing), poślizgnąć się [p] (lose footing), wymykać się [i] (slip away), wymknąć się [p] (slip away), wsuwać [i] (slip in)
    slither: pełzać [i], pełznąć [i], czołgać się [i], wić się [i]
    slow: zwalniać [i] (ease off), zwolnić [p] (ease off), spowalniać [i], spowolnić [p], opóźniać [i] (delay)
    smash: rozbijać [i] (shatter), rozbić [p] (shatter), roztrzaskiwać [i], miażdżyć [i] (crush), zmiażdżyć [p] (crush)
    smear: smarować [i] (spread; cover with), posmarować [p] (spread; cover with), rozmazywać [i] (smudge), rozmazać [p] (smudge), brudzić [i] (stain)
    smell: pachnieć [i] (give off a smell), wąchać [i] (sniff), powąchać [p] (sniff), czuć [i] (perceive a smell), poczuć [p] (perceive a smell)
    smile: uśmiechać się [i], uśmiechnąć się [p]
    smoke: palić [i] (cigarettes), wypalić [p] (a cigarette), wędzić [i] (food), uwędzić [p] (food), zapalić [p] (a cigarette)
    smooth: wygładzać [i], wygładzić [p], gładzić [i] (with the hand), wyrównywać [i] (level out), wyrównać [p] (level out)
    smother: dusić [i] (suffocate), udusić [p] (suffocate), tłumić [i] (suppress; put out a fire), stłumić [p] (suppress; put out a fire), przykrywać [i] (cover over)
    smuggle: przemycać [i], przemycić [p]
    snap: łamać [i] (break something), złamać [p] (break something), pękać [i] (break by itself), pęknąć [p] (break by itself), pstrykać [i] (fingers; a photo)
    snarl: warczeć [i], zawarczeć [p], warknąć [p]
    snatch: wyrywać [i] (from someone), wyrwać [p] (from someone), chwytać [i] (grab a bag), chwycić [p] (grab a bag), porywać [i] (snatch away)
    sneeze: kichać [i], kichnąć [p]
    sniff: wąchać [i], powąchać [p], węszyć [i] (smell out), zwęszyć [p] (smell out), obwąchiwać [i]
    snooze: drzemać [i], zdrzemnąć się [p], przysypiać [i] (nod off), przysnąć [p] (nod off)
    snore: chrapać [i], chrapnąć [p]
    snow: padać [i] (of snow), sypać [i] (of snow), prószyć [i] (light snow)
    soak: moczyć [i] (soak in liquid), namoczyć [p] (soak in liquid), przemakać [i] (get soaked), przemoknąć [p] (get soaked), wchłaniać [i] (soak up)
    sob: szlochać [i], zaszlochać [p], łkać [i], załkać [p]
    socialize: spotykać się [i] (mix with others), integrować się [i] (mingle), zintegrować się [p] (mingle), socjalizować [i] (children, psychology), uspołeczniać [i] (children, psychology)
    soften: zmiękczać [i], zmiękczyć [p], łagodzić [i] (lessen; ease), złagodzić [p] (lessen; ease), mięknąć [i] (become soft)
    solicit: zabiegać [i] (for support; seek), pozyskiwać [i] (for support; recruit), pozyskać [p] (for support; recruit), prosić [i] (ask for), poprosić [p] (ask for)
    solidify: krzepnąć [i] (become solid), zakrzepnąć [p] (become solid), twardnieć [i], stwardnieć [p], utrwalać [i] (make firm)
    solve: rozwiązywać [i], rozwiązać [p], wyjaśniać [i] (a crime, mystery), wyjaśnić [p] (a crime, mystery), rozwikłać [p] (a crime, mystery)
    soothe: uspokajać [i], uspokoić [p] (calm a person), koić [i] (pain), ukoić [p] (pain), łagodzić [i] (pain)
    sort: sortować [i], posortować [p], porządkować [i] (put in order), uporządkować [p] (put in order), segregować [i] (classify)
    sound: brzmieć [i] (seem when heard), zabrzmieć [p] (make a noise), rozbrzmiewać [i] (ring out), dzwonić [i] (alarm, bell), zadzwonić [p] (alarm, bell)
    sow: siać [i], zasiać [p], posiać [p], wysiewać [i], wysiać [p]
    sparkle: błyszczeć [i], iskrzyć się [i], skrzyć się [i], migotać [i], lśnić [i]
    spawn: trzeć się [i] (fish, frogs), rodzić [i] (give rise to), zrodzić [p] (give rise to), generować [i] (generate), wygenerować [p] (generate)
    speak: mówić [i], powiedzieć [p], rozmawiać [i], porozmawiać [p]
    specify: określać [i] (state exactly), określić [p] (state exactly), precyzować [i], sprecyzować [p], ustalać [i] (determine)
    speculate: spekulować [i] (in markets; guess), przypuszczać [i] (guess), domyślać się [i] (guess), domyślić się [p] (guess), gdybać [i] (guess)
    speed: przyspieszać [i] (make faster), przyspieszyć [p] (make faster), pędzić [i] (go fast; drive fast), popędzić [p] (go fast; drive fast), mknąć [i] (go fast)
    spell: literować [i], przeliterować [p], oznaczać [i] (spell trouble), zwiastować [i] (spell trouble), wróżyć [i] (spell trouble)
    spend: wydawać [i] (money), wydać [p] (money), spędzać [i] (time), spędzić [p] (time)
    spill: rozlewać [i], rozlać [p], wylewać [i], wylać [p], rozlewać się [i] (spill by itself)
    spin: kręcić [i] (spin something), zakręcić [p] (spin something), obracać się [i] (rotate), prząść [i] (spin thread), wirować [i]
    spit: pluć [i], splunąć [p], wypluwać [i] (spit out), wypluć [p] (spit out), spluwać [i]
    splash: chlapać [i] (splash something), ochlapywać [i] (splash on someone), ochlapać [p] (splash on someone), pluskać się [i] (play in water), pryskać [i] (water splashes up)
    splinter: rozłupywać [i], rozłupać [p], rozszczepiać [i], rozszczepić [p]
    split: dzielić [i] (into parts), podzielić [p] (into parts), rozdzielać [i], rozdzielić [p], rozpadać się [i] (break apart)
    spoil: psuć [i] (plans; ruin), zepsuć [p] (plans; ruin), rozpieszczać [i] (pamper; a child), rozpieścić [p] (pamper; a child), psuć się [i] (of food)
    sponsor: sponsorować [i], wspierać [i] (support), wesprzeć [p] (support), finansować [i], sfinansować [p]
    spot: zauważać [i], zauważyć [p], dostrzegać [i] (catch sight of), dostrzec [p] (catch sight of), wypatrzyć [p] (see at a distance)
    sprain: skręcać [i], skręcić [p], zwichnąć [p], nadwerężać [i], nadwerężyć [p]
    spray: spryskiwać [i], spryskać [p], rozpylać [i], rozpylić [p], opryskiwać [i]
    spread: rozprzestrzeniać się [i] (intransitive), rozpowszechniać [i] (news or ideas), rozpowszechnić [p] (news or ideas), rozkładać [i] (lay out), smarować [i] (butter, paste)
    sprinkle: posypywać [i], posypać [p], skrapiać [i] (liquid), skropić [p] (liquid)
    spur: pobudzać [i] (stimulate), pobudzić [p] (stimulate), zachęcać [i] (encourage), zachęcić [p] (encourage), poganiać [i] (urge on)
    squander: marnować [i], zmarnować [p], trwonić [i] (money), roztrwonić [p] (money), marnotrawić [i]
    squeal: kwiczeć [i] (pig), kwiknąć [p] (pig), piszczeć [i] (person; brakes), pisnąć [p] (person; brakes), wrzeszczeć [i] (person)
    squeeze: ściskać [i] (grip tightly), ścisnąć [p] (grip tightly), wyciskać [i] (juice; squeeze out), wycisnąć [p] (juice; squeeze out), wciskać [i] (squash in)
    squint: mrużyć [i] (narrow the eyes), zmrużyć [p] (narrow the eyes), zezować [i] (have a squint), przymrużać [i]
    stab: dźgać [i] (with a blade), dźgnąć [p] (with a blade), zadźgać [p] (kill), zasztyletować [p] (kill)
    stabilize: stabilizować [i], ustabilizować [p], stabilizować się [i], ustabilizować się [p]
    stagger: zataczać się [i] (drunkenly), zatoczyć się [p] (drunkenly), chwiać się [i], rozkładać [i] (schedules; in time), rozłożyć [p] (schedules; in time)
    stain: plamić [i], poplamić [p], zabarwiać [i] (discolor), bejcować [i] (wood), zabejcować [p] (wood)
    stall: gasnąć [i] (an engine), zgasnąć [p] (an engine), utknąć [p] (grind to a halt), stawać [i] (grind to a halt), zwlekać [i] (delay; stall for time)
    stamp: stemplować [i] (put a stamp on), ostemplować [p] (put a stamp on), tupać [i] (stamp one's feet), tupnąć [p] (stamp one's feet), odciskać [i] (imprint)
    start: zaczynać [i], zacząć [p], uruchamiać [i] (engine, program), uruchomić [p] (engine, program), ruszać [i] (set out)
    startle: zaskakiwać [i] (surprise), zaskoczyć [p] (surprise), płoszyć [i], spłoszyć [p], przestraszyć [p]
    stash: chować [i] (put away), schować [p] (put away), ukrywać [i], ukryć [p], gromadzić [i] (hoard)
    state: oświadczać [i] (declare), oświadczyć [p] (declare), stwierdzać [i] (assert), stwierdzić [p] (assert), twierdzić [i] (claim)
    stay: zostawać [i] (remain), zostać [p] (remain), nocować [i] (overnight), zatrzymywać się [i] (as a guest), zatrzymać się [p] (as a guest)
    steady: stabilizować [i], ustabilizować [p], uspokajać [i] (nerves; calm), uspokoić [p] (nerves; calm), podtrzymywać [i] (hold steady)
    steal: kraść [i], ukraść [p], zwędzić [p] (colloquial), przywłaszczać [i] (formal), przywłaszczyć [p] (formal)
    steer: kierować [i], skierować [p], sterować [i] (a vehicle), prowadzić [i] (guide), poprowadzić [p] (guide)
    sterilize: sterylizować [i], wysterylizować [p]
    stew: dusić [i] (cook slowly in a pot), udusić [p] (in cooking; also means to strangle)
    stick: przyklejać [i] (affix, attach), przykleić [p], wbijać [i] (poke into), kleić się [i] (adhere), wtykać [i] (put into, insert)
    stifle: tłumić [i], stłumić [p], dławić [i], zdławić [p]
    stigmatize: piętnować [i], napiętnować [p], stygmatyzować [i]
    stimulate: stymulować [i], pobudzać [i], pobudzić [p], ożywiać [i] (revive), ożywić [p]
    sting: kłuć [i], ukłuć [p], żądlić [i] (insect), użądlić [p], szczypać [i] (smart or burn)
    stink: śmierdzieć [i], cuchnąć [i]
    stipulate: zastrzegać [i], zastrzec [p], określać [i], określić [p], postanawiać [i]
    stir: mieszać [i], zamieszać [p], poruszać [i] (move slightly), poruszyć [p], wzbudzać [i] (stir up feelings)
    stitch: szyć [i], uszyć [p], zszywać [i] (suture, join), zszyć [p], haftować [i] (embroider)
    stop: zatrzymywać [i] (halt something), zatrzymać [p], przestawać [i] (cease, stop doing something), przestać [p], zatrzymywać się [i] (come to a halt)
    store: przechowywać [i] (keep), przechować [p], magazynować [i] (goods), zapisywać [i] (save data), zapisać [p]
    storm: szturmować [i] (attack), zdobywać [i] (take by force), zdobyć [p], szaleć [i] (rage, of weather)
    straighten: prostować [i], wyprostować [p], porządkować [i] (tidy up), uporządkować [p], prostować się [i] (stand up straight)
    strain: cedzić [i] (filter, pasta), odcedzić [p], forsować [i] (overexert), naciągać [i] (injure a muscle), naciągnąć [p]
    strangle: dusić [i], udusić [p], dławić [i], zdławić [p]
    strap: przypinać [i], przypiąć [p], przywiązywać [i], przywiązać [p]
    stray: błądzić [i], zbłądzić [p], błąkać się [i] (wander aimlessly), zabłąkać się [p] (get lost), odbiegać [i] (digress, deviate)
    strengthen: wzmacniać [i], wzmocnić [p], umacniać [i], umocnić [p], wzmacniać się [i] (grow stronger)
    stress: podkreślać [i] (highlight), podkreślić [p], akcentować [i] (highlight), stresować [i] (cause stress), zestresować [p]
    stretch: rozciągać [i], rozciągnąć [p], wyciągać [i] (extend a limb), wyciągnąć [p], przeciągać się [i] (stretch one's limbs)
    strew: rozrzucać [i], rozrzucić [p], rozsypywać [i], rozsypać [p]
    string: nawlekać [i] (thread beads), nawlec [p], nanizywać [i], naciągać [i] (racket, guitar)
    strip: rozbierać [i] (clothes), rozebrać [p], pozbawiać [i] (of rights, titles), pozbawić [p], zdzierać [i] (peel off)
    stroke: głaskać [i], pogłaskać [p], gładzić [i], pogładzić [p]
    stroll: spacerować [i], pospacerować [p], przechadzać się [i]
    struggle: walczyć [i], powalczyć [p], zmagać się [i] (face difficulty), borykać się [i], szamotać się [i] (thrash about, writhe)
    strum: brzdąkać [i], zabrzdąkać [p], szarpać [i] (pluck strings)
    study: uczyć się [i], pouczyć się [p], studiować [i] (at university), badać [i] (research), zbadać [p]
    stuff: wypychać [i], wypchać [p], faszerować [i] (food), nafaszerować [p], napychać [i] (cram)
    stumble: potykać się [i], potknąć się [p]
    stun: oszałamiać [i], oszołomić [p], ogłuszać [i] (knock senseless), ogłuszyć [p], zdumiewać [i] (amaze)
    subdue: ujarzmiać [i], ujarzmić [p], obezwładniać [i] (overpower), obezwładnić [p], tłumić [i] (quell a revolt)
    submit: składać [i] (a form, hand in), złożyć [p], wysyłać [i] (a form), wysłać [p], poddawać się [i] (yield)
    subscribe: subskrybować [i] (a channel, a service), zasubskrybować [p], prenumerować [i] (a magazine), zaprenumerować [p], abonować [i]
    subsidize: dotować [i], dofinansowywać [i], dofinansować [p], subsydiować [i]
    substitute: zastępować [i] (stand in for), zastąpić [p], wymieniać [i] (swap), wymienić [p], podstawiać [i] (use instead)
    subtract: odejmować [i], odjąć [p]
    succeed: udawać się [i] (an attempt works), udać się [p], powieść się [p], następować [i] (follow into a role), nastąpić [p]
    succumb: ulegać [i], ulec [p], poddawać się [i] (give in), poddać się [p], załamywać się [i] (collapse)
    suck: ssać [i], wysysać [i] (suck out), wyssać [p], zasysać [i] (suck in)
    sue: pozywać [i], pozwać [p], procesować się [i]
    suffer: cierpieć [i], ucierpieć [p], doznawać [i] (injury), ponosić [i] (loss), ponieść [p]
    suffocate: dusić się [i], udusić się [p], dusić [i] (someone else), udusić [p]
    suggest: sugerować [i] (hint, imply), zasugerować [p], proponować [i] (propose), zaproponować [p], polecać [i] (recommend)
    suit: pasować [i] (of clothes; fit, look good on), odpowiadać [i] (match requirements, be right for)
    sum: sumować [i], zsumować [p], dodawać [i], dodać [p]
    summarize: podsumowywać [i], podsumować [p], streszczać [i], streścić [p]
    summon: wzywać [i] (to court, call), wezwać [p], przywoływać [i] (call over), zwoływać [i] (convene), zwołać [p]
    supersede: zastępować [i], zastąpić [p], wypierać [i] (displace), wyprzeć [p]
    supervise: nadzorować [i], doglądać [i] (monitor), kierować [i] (manage)
    supplement: uzupełniać [i], uzupełnić [p], dopełniać [i] (top up), dopełnić [p], suplementować [i]
    supply: dostarczać [i], dostarczyć [p], zaopatrywać [i] (with), zaopatrzyć [p], zapewniać [i] (provide)
    support: wspierać [i], wesprzeć [p], popierać [i] (back an idea), poprzeć [p], podpierać [i] (physically)
    suppose: przypuszczać [i] (guess), przypuścić [p], zakładać [i] (assume, presuppose), założyć [p], domyślać się [i] (guess)
    suppress: tłumić [i], stłumić [p], powstrzymywać [i], powstrzymać [p], wypierać [i] (a memory; repress)
    surf: surfować [i], przeglądać [i] (browse the web)
    surge: wzbierać [i] (swell; waves), wzrastać [i] (numbers rise sharply), wzrosnąć [p], napływać [i] (rush), napłynąć [p]
    surmise: przypuszczać [i], przypuścić [p], domyślać się [i], domyślić się [p]
    surpass: przewyższać [i], przewyższyć [p], przekraczać [i] (exceed), przekroczyć [p], prześcigać [i] (outdo)
    surprise: zaskakiwać [i], zaskoczyć [p], zdumiewać [i] (amaze), zdumieć [p], dziwić się [i] (be surprised)
    surrender: poddawać się [i], poddać się [p], kapitulować [i], skapitulować [p], oddawać [i] (hand over)
    surround: otaczać [i], otoczyć [p], okrążać [i] (military), okrążyć [p]
    survey: ankietować [i] (poll people), badać [i] (inspect, look over), zbadać [p], mierzyć [i] (land), zmierzyć [p]
    survive: przeżywać [i], przeżyć [p], przetrwać [p] (get through), ocaleć [p]
    suspect: podejrzewać [i] (a person), przypuszczać [i] (think likely), przypuścić [p], przeczuwać [i] (have a hunch), przeczuć [p]
    suspend: zawieszać [i] (from duty; hang), zawiesić [p], wstrzymywać [i] (put on hold), wstrzymać [p], przerywać [i] (interrupt)
    sustain: podtrzymywać [i] (keep going), podtrzymać [p], utrzymywać [i] (bear weight), utrzymać [p], doznawać [i] (an injury)
    swallow: połykać [i], połknąć [p], przełykać [i], przełknąć [p], pochłaniać [i] (devour)
    swap: wymieniać [i], wymienić [p], zamieniać [i], zamienić [p]
    sway: kołysać się [i], zakołysać się [p], chwiać się [i], wpływać [i] (sway opinion, influence), wpłynąć [p]
    swear: przysięgać [i] (vow), przysiąc [p], przeklinać [i] (use bad language), kląć [i] (curse), zakląć [p]
    sweat: pocić się [i], spocić się [p]
    sweep: zamiatać [i], zamieść [p], wymiatać [i] (clear out), wymieść [p]
    sweeten: słodzić [i], osłodzić [p], umilać [i] (make more pleasant), umilić [p]
    swell: puchnąć [i] (injury or body part), spuchnąć [p], pęcznieć [i] (expand with moisture), napęcznieć [p], wzbierać [i] (increase, grow bigger)
    swim: pływać [i], płynąć [i] (in one direction; also flow, sail), popłynąć [p], przepłynąć [p] (swim across)
    swindle: oszukiwać [i], oszukać [p], naciągać [i] (out of money), wyłudzać [i], wyłudzić [p]
    swing: huśtać się [i] (on a swing), kołysać [i] (sway back and forth), machać [i] (swing a bat or arm), machnąć [p], dyndać [i] (dangle)
    swipe: przesuwać [i] (across a screen), przesunąć [p], przeciągać [i] (a card), kraść [i] (steal), ukraść [p]
    switch: zmieniać [i], zmienić [p], przełączać [i] (switch over), przełączyć [p], zamieniać [i] (swap)
    symbolize: symbolizować [i], uosabiać [i] (embody), uosobić [p], ucieleśniać [i] (embody), ucieleśnić [p]
    sympathize: współczuć [i], współodczuwać [i], sympatyzować [i] (with an idea), litować się [i] (pity), zlitować się [p]
    sync: synchronizować [i], zsynchronizować [p]
    synchronize: synchronizować [i], zsynchronizować [p], koordynować [i] (coordinate), skoordynować [p], zgrywać [i] (match up)
    synthesize: syntetyzować [i], zsyntetyzować [p], łączyć [i] (merge), połączyć [p], scalać [i]
    tack: przybijać [i] (nail on), przybić [p], przypinać [i] (pin on, fasten with tacks), przypiąć [p], halsować [i] (sail zigzag)
    tackle: zajmować się [i] (a problem), zająć się [p], mierzyć się [i] (take on), zmierzyć się [p], powalać [i] (in sports)
    tag: oznaczać [i], oznaczyć [p], tagować [i], otagować [p], etykietować [i]
    tailor: dostosowywać [i] (adapt), dostosować [p], dopasowywać [i], dopasować [p], szyć [i] (make clothes)
    taint: skażać [i], skazić [p], zanieczyszczać [i], plamić [i] (sully a reputation), splamić [p]
    take: brać [i], wziąć [p], zabierać [i] (take along), zabrać [p], zawozić [i] (take to a place)
    take care of: opiekować się [i] (look after), zaopiekować się [p], zajmować się [i] (handle, deal with), zająć się [p], dbać [i] (look after, provide for)
    take off: zdejmować [i] (clothes; a hat, glasses), zdjąć [p], startować [i] (a plane), wystartować [p]
    take part: uczestniczyć [i], przyłączać się [i] (join in), przyłączyć się [p], włączać się [i] (contribute), włączyć się [p]
    talk: rozmawiać [i], porozmawiać [p], mówić [i], gawędzić [i] (chat), pogawędzić [p]
    tally: zliczać [i] (add up, count up), zliczyć [p], podliczać [i] (votes), podliczyć [p], zgadzać się [i] (agree, match)
    tame: oswajać [i], oswoić [p], ujarzmiać [i] (control), ujarzmić [p], poskramiać [i]
    tamper: manipulować [i], zmanipulować [p], majstrować [i] (fiddle with), fałszować [i] (falsify), sfałszować [p]
    tan: opalać się [i] (skin), opalić się [p], garbować [i] (leather), wygarbować [p]
    tangle: plątać [i], splątać [p], poplątać [p], plątać się [i], zaplątać się [p]
    tap: stukać [i] (knock or tap), stuknąć [p], dotykać [i] (a screen), podsłuchiwać [i] (a phone), czerpać [i] (draw from)
    tape: nagrywać [i] (record), nagrać [p], przyklejać [i] (stick with tape), przykleić [p], zaklejać [i] (with tape)
    taper: zwężać się [i] (come to a point), zwęzić się [p], zwężać [i] (make narrower), zwęzić [p], słabnąć [i] (taper off)
    target: celować [i] (take aim at), wycelować [p], mierzyć [i] (take aim at), kierować [i] (be aimed at), skierować [p]
    tarnish: matowieć [i] (metal goes dull), zmatowieć [p], plamić [i] (sully a reputation), splamić [p], szargać [i] (a reputation)
    taste: próbować [i] (sample), spróbować [p], degustować [i] (wine, food), delektować się [i] (savor), smakować [i] (have a flavor)
    tattoo: tatuować [i], wytatuować [p]
    taunt: drwić [i] (mock), kpić [i], zakpić [p], prowokować [i] (provoke), sprowokować [p]
    tax: opodatkowywać [i], opodatkować [p], obciążać [i] (strain), obciążyć [p]
    teach: uczyć [i] (a class, a skill), nauczyć [p], nauczać [i] (a subject), wykładać [i] (lecture)
    tear: drzeć [i] (rip to pieces), podrzeć [p], rwać [i], rozrywać [i] (tear open), rozerwać [p]
    tear down: burzyć [i], zburzyć [p], rozbierać [i] (dismantle), rozebrać [p], demontować [i] (dismantle)
    tease: dokuczać [i] (pick on), dokuczyć [p], droczyć się [i] (tease someone), przekomarzać się [i], wyśmiewać [i] (make fun of)
    telephone: dzwonić [i], zadzwonić [p], telefonować [i], zatelefonować [p]
    tell: mówić [i], powiedzieć [p], opowiadać [i] (a story), opowiedzieć [p], informować [i] (inform)
    tell off: ganić [i], zganić [p], besztać [i], zbesztać [p]
    tempt: kusić [i], skusić [p], wabić [i], zwabić [p]
    tend: doglądać [i] (look after), pielęgnować [i] (care for), opiekować się [i], skłaniać się [i] (be inclined to), skłonić się [p]
    tenderize: zmiękczać [i], zmiękczyć [p], rozbijać [i] (pound meat), marynować [i] (marinate meat), zamarynować [p]
    terminate: kończyć [i], zakończyć [p], rozwiązywać [i] (a contract), rozwiązać [p], zwalniać [i] (an employee)
    terrify: przerażać [i], przerazić [p], straszyć [i], przestraszyć [p]
    test: testować [i], przetestować [p], sprawdzać [i] (check), badać [i] (medical or technical), zbadać [p]
    testify: zeznawać [i] (in court), zeznać [p], świadczyć [i] (attest), poświadczać [i], poświadczyć [p]
    tether: uwiązywać [i], uwiązać [p], przywiązywać [i] (dog), przywiązać [p]
    thank: dziękować [i], podziękować [p]
    thaw: rozmrażać [i] (defrost), rozmrozić [p], topnieć [i] (ice or snow melts), stopnieć [p], tajać [i]
    thicken: zagęszczać [i] (a sauce), zagęścić [p], gęstnieć [i] (get thicker), zgęstnieć [p], pogrubiać [i] (make thicker)
    thin: rozcieńczać [i] (liquid; dilute), rozcieńczyć [p], przerzedzać [i] (thin out plants, hair, crowds), przerzedzić [p], chudnąć [i] (get thin)
    think: myśleć [i], pomyśleć [p], sądzić [i] (believe), uważać [i] (regard as), zastanawiać się [i] (ponder)
    think about: myśleć [i], pomyśleć [p], rozważać [i] (consider), rozważyć [p], zastanawiać się [i] (consider)
    thread: nawlekać [i] (a needle), nawlec [p], nanizywać [i] (beads), przeciągać [i] (pass through)
    threaten: grozić [i], zagrozić [p], zagrażać [i] (endanger)
    thrill: ekscytować [i] (make excited), podekscytować [p], zachwycać [i], zachwycić [p], porywać [i] (sweep along)
    thrive: prosperować [i] (business), rozkwitać [i] (bloom), rozkwitnąć [p], rozwijać się [i] (grow well), rozwinąć się [p]
    throb: pulsować [i], tętnić [i] (pulse), łomotać [i] (of the heart), kołatać [i], boleć [i] (pain, ache)
    throttle: ograniczać [i] (reduce flow), ograniczyć [p], dławić [i] (restrict a flow), dusić [i] (choke someone), udusić [p]
    throw: rzucać [i], rzucić [p], ciskać [i] (hurl), cisnąć [p] (hurl)
    throw away: wyrzucać [i], wyrzucić [p], pozbywać się [i] (dispose of), pozbyć się [p], wywalać [i] (colloquial)
    thrust: pchać [i] (shove), pchnąć [p], wbijać [i] (drive in), wbić [p], dźgać [i] (stab)
    thump: uderzać [i] (hit hard), uderzyć [p], walić [i] (with fists; pound), walnąć [p], łomotać [i] (thud, beat on)
    thunder: grzmieć [i], zagrzmieć [p], huczeć [i] (rumble), dudnić [i] (rumble)
    thwart: udaremniać [i], udaremnić [p], krzyżować [i] (plans), pokrzyżować [p], podważać [i] (undermine)
    tick: tykać [i] (clock), odhaczać [i] (check off), odhaczyć [p], zaznaczać [i] (mark on a form), zaznaczyć [p]
    tidy: sprzątać [i], posprzątać [p], porządkować [i], uporządkować [p]
    tie: wiązać [i], związać [p], zawiązywać [i] (shoes, bags), zawiązać [p], remisować [i] (draw a game)
    tighten: dokręcać [i] (screws), dokręcić [p], zaostrzać [i] (rules), zaostrzyć [p], napinać [i] (pull taut)
    tilt: przechylać [i], przechylić [p], pochylać [i], pochylić [p], przechylać się [i] (lean over)
    time: mierzyć [i] (measure time), zmierzyć [p], koordynować [i] (coordinate timing), planować [i] (schedule), zaplanować [p]
    tingle: drętwieć [i] (go numb), zdrętwieć [p], łaskotać [i] (tickle), połaskotać [p], mrowić [i] (with a chill or excitement)
    tint: zabarwiać [i], zabarwić [p], farbować [i] (dye), ufarbować [p], kolorować [i] (colour in)
    tip: przechylać [i] (tilt), przechylić [p], wylewać [i] (tip out), przewracać [i] (tip over), przewrócić [p]
    tire: męczyć [i] (exhaust), zmęczyć [p], męczyć się [i] (get tired), zmęczyć się [p], wyczerpywać [i]
    title: tytułować [i], zatytułować [p], nazywać [i] (name), nazwać [p]
    toast: opiekać [i] (bread), opiec [p], przypiekać [i] (bread), wznosić [i] (a toast), wznieść [p]
    toggle: przełączać [i], przełączyć [p], przestawiać [i], przestawić [p]
    tolerate: tolerować [i], znosić [i] (endure, put up with), znieść [p], wytrzymywać [i], wytrzymać [p]
    tone: ujędrniać [i], ujędrnić [p], wzmacniać [i] (strengthen muscles), wzmocnić [p], modelować [i] (body, muscles)
    top: przewyższać [i], przewyższyć [p], przebijać [i] (outdo), przebić [p], wieńczyć [i] (crown, put on top)
    topple: obalać [i] (overthrow), obalić [p], przewracać [i] (knock over), przewrócić [p], przewracać się [i] (fall over)
    torment: dręczyć [i] (afflict), udręczyć [p], trapić [i] (afflict), gnębić [i], męczyć [i]
    torture: torturować [i], katować [i], dręczyć [i] (torment), udręczyć [p]
    toss: rzucać [i], rzucić [p], podrzucać [i] (toss up), podrzucić [p], mieszać [i] (toss a salad)
    touch: dotykać [i], dotknąć [p], wzruszać [i] (move emotionally), wzruszyć [p]
    tour: zwiedzać [i] (sights), zwiedzić [p], objeżdżać [i] (a region), objechać [p], oprowadzać [i] (show someone around)
    tow: holować [i], odholować [p], ciągnąć [i] (haul), pociągnąć [p]
    trace: kreślić [i] (outline, trace a line), nakreślić [p], śledzić [i] (track down), wyśledzić [p], ustalać [i] (origins, a source)
    track: śledzić [i] (follow), wyśledzić [p], tropić [i] (hunt down), wytropić [p], namierzać [i] (locate by signal)
    trade: handlować [i] (internationally), wymieniać [i] (swap, exchange for), wymienić [p], zamieniać [i], zamienić [p]
    train: trenować [i] (do training), wytrenować [p], szkolić [i] (instruct), wyszkolić [p], kształcić [i] (teach skills)
    trample: deptać [i], podeptać [p], tratować [i], stratować [p], tupać [i] (stamp heavily)
    transcend: przekraczać [i] (cross a limit), przekroczyć [p], wykraczać [i] (go beyond), wykroczyć [p], przerastać [i] (surpass)
    transcribe: transkrybować [i], przepisywać [i] (copy out), przepisać [p], spisywać [i] (from audio), spisać [p]
    transfer: przenosić [i] (an employee, data), przenieść [p], przekazywać [i] (rights), przelewać [i] (money), przesyłać [i] (data or mail)
    transform: przekształcać [i], przekształcić [p], przeobrażać [i], przeobrazić [p], transformować [i]
    translate: tłumaczyć [i] (also interpret orally), przetłumaczyć [p], przekładać [i], przełożyć [p]
    transmit: przesyłać [i] (signal, data), przesłać [p], przekazywać [i] (convey), nadawać [i] (broadcast), przenosić [i] (disease)
    transpire: okazywać się [i] (turn out, become known), okazać się [p], wydarzać się [i] (happen), wydarzyć się [p], pocić się [i] (perspire)
    transplant: przeszczepiać [i] (organs, tissue), przeszczepić [p], przesadzać [i] (plants; replant, repot), przesadzić [p]
    transport: transportować [i], przetransportować [p], przewozić [i] (passengers, goods), przewieźć [p]
    trap: łapać [i] (catch), złapać [p], więzić [i] (confine), uwięzić [p], usidlać [i] (ensnare)
    travel: podróżować [i], jeździć [i] (go by vehicle), wyjeżdżać [i] (go away on a trip), wyjechać [p], pojechać [p]
    traverse: przemierzać [i], przemierzyć [p], przekraczać [i], przekroczyć [p]
    tread: stąpać [i] (tread firmly), deptać [i] (step on), nadepnąć [p] (step on), kroczyć [i] (stride)
    treasure: cenić [i] (value), pielęgnować [i] (hold dear), strzec [i] (guard like a treasure), przechowywać [i] (keep safe)
    treat: traktować [i] (behave toward, handle), potraktować [p], leczyć [i] (medically), częstować [i] (entertain with food), fundować [i] (pay as a treat)
    tremble: drżeć [i], zadrżeć [p], trząść się [i] (with cold, fear), dygotać [i], wzdrygać się [i] (shudder)
    trick: oszukiwać [i], oszukać [p], przechytrzać [i] (outwit), przechytrzyć [p], nabierać [i] (con)
    trickle: sączyć się [i] (seep out), przesączać się [i], przesączyć się [p], cieknąć [i] (leak), kapać [i] (drip)
    trigger: wywoływać [i] (bring about), wywołać [p], uruchamiać [i] (activate), uruchomić [p], wyzwalać [i]
    trim: przycinać [i] (hedge, beard), przyciąć [p], przystrzygać [i] (hair, hedge), obcinać [i] (cut down, cut costs), obciąć [p]
    trip: potykać się [i], potknąć się [p], przewracać się [i] (fall down), przewrócić się [p]
    triple: potrajać [i], potroić [p], potrajać się [i], potroić się [p]
    trivialize: bagatelizować [i], zbagatelizować [p], banalizować [i], zbanalizować [p], umniejszać [i] (play down)
    trot: truchtać [i], kłusować [i], pokłusować [p]
    trouble: niepokoić [i] (worry, disturb), zaniepokoić [p], przeszkadzać [i] (disturb), przeszkodzić [p], kłopotać [i] (bother)
    truncate: obcinać [i], obciąć [p], skracać [i], skrócić [p], ucinać [i]
    trust: ufać [i], zaufać [p], wierzyć [i] (believe someone), uwierzyć [p], powierzać [i] (entrust)
    try: próbować [i], spróbować [p], wypróbowywać [i] (try out), wypróbować [p], starać się [i] (attempt)
    try on: przymierzać [i], przymierzyć [p]
    tuck: wsuwać [i] (put in), wsunąć [p], podwijać [i] (fold edges in), podwinąć [p], otulać [i] (tuck in bed)
    tumble: spadać [i] (prices; fall), spaść [p], upadać [i] (tumble over), upaść [p], zawalać się [i] (collapse)
    tune: stroić [i] (an instrument), nastroić [p], dostrajać [i] (adjust, tune in), dostroić [p], regulować [i] (engine, car)
    tunnel: drążyć [i], wydrążyć [p], kopać [i], wykopać [p], podkopywać [i] (tunnel under)
    turn: obracać [i] (rotate), obrócić [p], skręcać [i] (change direction, turn a corner), skręcić [p], odwracać [i] (turn over)
    turn around: odwracać się [i] (turn the other way), odwrócić się [p], zawracać [i] (go back), zawrócić [p], oglądać się [i] (look back)
    turn down: odrzucać [i] (reject), odrzucić [p], ściszać [i] (volume), ściszyć [p], przykręcać [i] (volume, heat)
    turn into: zamieniać [i] (convert), zamienić [p], zmieniać się [i] (become), zmienić się [p], stawać się [i] (become)
    turn off: wyłączać [i], wyłączyć [p], gasić [i] (lights, engine), zgasić [p], zakręcać [i] (a tap, water)
    turn on: włączać [i], włączyć [p], zapalać [i] (a light), zapalić [p], odkręcać [i] (a tap, water)
    turn up: podkręcać [i] (volume, heat), podkręcić [p], pojawiać się [i] (appear), pojawić się [p], zjawiać się [i] (show up)
    tweet: ćwierkać [i], zaćwierkać [p], świergotać [i] (birds chirp), tweetować [i] (post on Twitter)
    twinkle: migotać [i], zamigotać [p], błyszczeć [i], iskrzyć się [i]
    twirl: kręcić [i] (turn round), zakręcić [p], wirować [i] (circle), zawirować [p], obracać [i] (turn round)
    type: pisać [i] (on a keyboard), napisać [p], wpisywać [i], wpisać [p], przepisywać [i] (type out a text)
    umpire: sędziować [i], rozsądzać [i] (arbitrate a dispute), rozsądzić [p], rozstrzygać [i], rozstrzygnąć [p]
    unbutton: rozpinać [i], rozpiąć [p], odpinać [i], odpiąć [p]
    uncover: odkrywać [i], odkryć [p], odsłaniać [i] (reveal), odsłonić [p], ujawniać [i] (expose)
    underestimate: niedoceniać [i], niedocenić [p], lekceważyć [i], zlekceważyć [p]
    undergo: przechodzić [i] (go through), przejść [p], doświadczać [i] (experience), doświadczyć [p], doznawać [i] (suffer)
    underline: podkreślać [i], podkreślić [p], akcentować [i] (emphasize), zaakcentować [p], uwydatniać [i] (emphasize)
    undermine: podważać [i], podważyć [p], podkopywać [i] (erode), podkopać [p], osłabiać [i] (weaken)
    underpin: podpierać [i] (support), podeprzeć [p], podbudowywać [i] (back up), podbudować [p], uzasadniać [i]
    understand: rozumieć [i], zrozumieć [p], pojmować [i] (grasp), pojąć [p], kumać [i] (colloquial)
    understate: umniejszać [i] (play down), umniejszyć [p], bagatelizować [i] (make seem harmless), zbagatelizować [p], zaniżać [i] (underreport)
    undertake: podejmować [i], podjąć [p], podjąć się [p] (embark on), zobowiązywać się [i] (promise to do), zobowiązać się [p]
    underwrite: gwarantować [i] (guarantee), zagwarantować [p], poręczać [i] (stand surety), ubezpieczać [i] (insure), finansować [i] (fund)
    undo: cofać [i] (reverse, revert), cofnąć [p], rozwiązywać [i] (untie, loosen), rozwiązać [p], odwoływać [i] (revoke, cancel)
    undress: rozbierać [i] (take clothes off someone), rozebrać [p], rozbierać się [i] (undress oneself), rozebrać się [p]
    unearth: wykopywać [i] (dig up), wykopać [p], odkopywać [i], odkrywać [i] (find, reveal), odkryć [p]
    unfasten: rozpinać [i], rozpiąć [p], odpinać [i] (detach), odpiąć [p], rozwiązywać [i] (untie)
    unfold: rozkładać [i] (flip open, spread out), rozłożyć [p], rozwijać [i], rozwinąć [p], rozwijać się [i] (of events)
    unfurl: rozwijać [i] (flag, scroll), rozwinąć [p], rozpościerać [i] (spread open), rozwijać się [i] (spread open), rozwinąć się [p]
    unhook: odczepiać [i], odczepić [p], odpinać [i] (detach), odpiąć [p]
    unify: jednoczyć [i], zjednoczyć [p], ujednolicać [i] (standardize), ujednolicić [p], scalać [i] (bring together)
    uninstall: odinstalowywać [i], odinstalować [p], usuwać [i] (remove, delete), usunąć [p]
    unite: jednoczyć [i], zjednoczyć [p], łączyć [i], połączyć [p], jednoczyć się [i] (band together, unite as a group)
    unleash: rozpętywać [i] (provoke), rozpętać [p], wyzwalać [i] (release), wyzwolić [p], uwalniać [i] (let loose)
    unload: rozładowywać [i] (weapon, battery, goods), rozładować [p], wyładowywać [i] (cargo), wyładować [p]
    unmask: demaskować [i], zdemaskować [p], ujawniać [i] (expose), ujawnić [p]
    unpack: rozpakowywać [i], rozpakować [p], wypakowywać [i] (take out), wypakować [p]
    unplug: odłączać [i] (disconnect), odłączyć [p], wyciągać [i] (a plug), wyciągnąć [p]
    unravel: rozplątywać [i] (untangle), rozplątać [p], rozwikływać [i] (solve a mystery), rozwikłać [p], pruć się [i] (fray, come undone)
    unroll: rozwijać [i], rozwinąć [p], rozkładać [i] (a carpet), rozłożyć [p]
    unscrew: odkręcać [i], odkręcić [p], wykręcać [i] (take out), wykręcić [p]
    unsettle: niepokoić [i], zaniepokoić [p], wzburzać [i] (disturb deeply), wzburzyć [p]
    untie: rozwiązywać [i] (a knot), rozwiązać [p], odwiązywać [i], odwiązać [p], uwalniać [i] (set free)
    unveil: odsłaniać [i] (a monument, a statue), odsłonić [p], prezentować [i] (present a product), zaprezentować [p], ujawniać [i] (announce)
    unwrap: rozpakowywać [i] (a gift), rozpakować [p], rozwijać [i] (remove wrapping), rozwinąć [p]
    unzip: rozpakowywać [i] (files), rozpakować [p], dekompresować [i] (data), zdekompresować [p], rozpinać [i] (a zipper)
    update: aktualizować [i], zaktualizować [p], uaktualniać [i], uaktualnić [p], odświeżać [i] (renew)
    upgrade: ulepszać [i] (improve), ulepszyć [p], modernizować [i] (equipment, hardware), zmodernizować [p], podnosić [i] (raise value, grade)
    uphold: podtrzymywać [i] (maintain, confirm a ruling), podtrzymać [p], utrzymywać [i] (maintain), przestrzegać [i] (a law or principle), bronić [i] (defend)
    uplift: podnosić [i] (lift up, raise standards), podnieść [p], pokrzepiać [i] (lift spirits), pokrzepić [p], wznosić [i]
    upload: przesyłać [i] (transfer data), przesłać [p], wgrywać [i], wgrać [p], wysyłać [i]
    uproot: wykorzeniać [i] (eradicate), wykorzenić [p], wyrywać [i] (pull out), wyrwać [p], karczować [i] (clear land)
    upset: denerwować [i] (make upset), zdenerwować [p], urażać [i] (hurt feelings), urazić [p], zakłócać [i] (disrupt)
    urge: nakłaniać [i], nakłonić [p], nalegać [i] (press for), ponaglać [i] (hurry along), apelować [i] (call upon)
    use: używać [i], użyć [p], stosować [i], zastosować [p], korzystać [i]
    usher: wprowadzać [i] (escort, show in), wprowadzić [p], towarzyszyć [i] (accompany), zapoczątkowywać [i] (usher in an era), zapoczątkować [p]
    usurp: uzurpować [i], przywłaszczać [i] (appropriate), przywłaszczyć [p], zagarniać [i] (seize), zagarnąć [p]
    utilize: wykorzystywać [i] (make use of), wykorzystać [p], stosować [i] (put to use), zastosować [p]
    utter: wypowiadać [i] (say aloud), wypowiedzieć [p], wymawiać [i] (pronounce), wymówić [p], wydawać [i] (a cry)
    vaccinate: szczepić [i], zaszczepić [p]
    vacuum: odkurzać [i] (with a vacuum), odkurzyć [p], zasysać [i] (suck up), zassać [p], wysysać [i] (suck away)
    validate: potwierdzać [i] (confirm, affirm), potwierdzić [p], zatwierdzać [i] (approve), zatwierdzić [p], walidować [i] (check)
    value: cenić [i] (hold in esteem), doceniać [i] (appreciate), docenić [p], wyceniać [i] (put a value on), wycenić [p]
    vandalize: dewastować [i], zdewastować [p], niszczyć [i] (damage), zniszczyć [p], demolować [i] (wreck)
    vanish: znikać [i], zniknąć [p], zanikać [i] (dwindle away), zaniknąć [p], ulatniać się [i] (disappear)
    vaporize: parować [i] (evaporate), wyparować [p], odparowywać [i], odparować [p], rozpylać [i] (atomize)
    varnish: lakierować [i], polakierować [p], werniksować [i] (art, wood)
    vary: różnić się [i] (differ), zmieniać się [i] (change), zmienić się [p], wahać się [i] (fluctuate), urozmaicać [i] (alter, make varied)
    veer: skręcać [i] (turn sharply, turn the wheel), skręcić [p], zbaczać [i] (deviate), zboczyć [p], zjeżdżać [i] (swerve out)
    vent: wyładowywać [i] (anger, emotions), wyładować [p], odpowietrzać [i] (let air out), odpowietrzyć [p], wypuszczać [i] (steam, pressure, gas)
    ventilate: wietrzyć [i], przewietrzyć [p], przewietrzać [i] (air out thoroughly), wentylować [i] (equip with ventilation)
    venture: ryzykować [i] (risk), zaryzykować [p], odważać się [i] (venture an opinion), odważyć się [p], ośmielać się [i]
    verify: sprawdzać [i], sprawdzić [p], weryfikować [i], zweryfikować [p], potwierdzać [i] (confirm)
    veto: zawetować [p], blokować [i] (reject a bill), zablokować [p], zakazywać [i] (forbid), zakazać [p]
    vex: irytować [i], zirytować [p], drażnić [i], rozdrażniać [i], rozdrażnić [p]
    vibrate: wibrować [i], drgać [i] (oscillate), zadrgać [p], drżeć [i] (tremble), zadrżeć [p]
    victimize: prześladować [i] (harass, oppress), dyskryminować [i] (discriminate against), gnębić [i] (bully), krzywdzić [i] (treat unfairly), skrzywdzić [p]
    videotape: nagrywać [i], nagrać [p], filmować [i], sfilmować [p], rejestrować [i] (record)
    vie: rywalizować [i], konkurować [i], współzawodniczyć [i], ścigać się [i]
    view: oglądać [i] (a property, a scene), obejrzeć [p], obserwować [i] (observe), przeglądać [i] (a document or web page), przejrzeć [p]
    vilify: oczerniać [i], oczernić [p], szkalować [i], zniesławiać [i] (defame), zniesławić [p]
    vindicate: uniewinniać [i] (exonerate, clear of blame), uniewinnić [p], rehabilitować [i] (restore reputation), zrehabilitować [p], usprawiedliwiać [i] (justify)
    violate: naruszać [i] (rights, a rule), naruszyć [p], łamać [i] (law, promise), złamać [p], pogwałcić [p] (rights)
    visit: odwiedzać [i] (a person, a place), odwiedzić [p], zwiedzać [i] (sights), zwiedzić [p], wpadać [i] (drop by)
    visualize: wizualizować [i], zwizualizować [p], ilustrować [i] (illustrate), przedstawiać [i] (depict), uwidaczniać [i] (make visible)
    vocalize: wyrażać [i] (express in words), wyrazić [p], artykułować [i] (articulate), wyartykułować [p], wokalizować [i] (linguistics, singing)
    void: unieważniać [i], unieważnić [p], anulować [i] (cancel a transaction), uchylać [i] (rescind), uchylić [p]
    vomit: wymiotować [i], zwymiotować [p], rzygać [i] (vulgar), rzygnąć [p]
    vote: głosować [i], zagłosować [p], przegłosować [p] (vote on a motion), uchwalać [i] (pass by vote), uchwalić [p]
    vouch: ręczyć [i], poręczyć [p], gwarantować [i], zagwarantować [p], zapewniać [i] (assure)
    vow: przysięgać [i], przysiąc [p], przyrzekać [i], przyrzec [p], obiecywać [i]
    voyage: podróżować [i] (travel abroad), płynąć [i] (travel by ship), popłynąć [p], żeglować [i] (sail)
    wade: brodzić [i] (slosh through water), brnąć [i], przebrnąć [p], przeprawiać się [i] (ford on foot), przeprawić się [p]
    wag: merdać [i] (a tail), zamerdać [p], machać [i], pomachać [p], kiwać [i] (swish gently)
    wail: zawodzić [i], jęczeć [i] (moan), jęknąć [p], lamentować [i] (lament), wyć [i] (of a siren)
    wait: czekać [i], poczekać [p], zaczekać [p], oczekiwać [i] (literary, formal)
    wait for: czekać [i], poczekać [p], oczekiwać [i] (literary), wyczekiwać [i] (wait and see), czyhać [i] (lie in wait for)
    wait on: obsługiwać [i] (serve customers), obsłużyć [p], usługiwać [i] (serve a master), podawać [i] (serve food), podać [p]
    waive: zrzekać się [i] (a right), zrzec się [p], rezygnować [i], zrezygnować [p], umarzać [i] (a fee, debt)
    wake: budzić [i] (rouse someone), obudzić [p], budzić się [i] (become awake), obudzić się [p], przebudzić się [p] (awaken)
    wake up: budzić się [i], obudzić się [p], budzić [i] (rouse someone), obudzić [p], wstawać [i] (get up)
    walk: iść [i], chodzić [i] (on foot; go back and forth), pójść [p], spacerować [i] (take a stroll), pospacerować [p]
    wall: zamurowywać [i] (wall up, wall off), zamurować [p], obmurowywać [i] (wall in, enclose with a wall), obmurować [p], ogradzać [i] (enclose)
    waltz: tańczyć [i] (dance a waltz), zatańczyć [p]
    wander: wędrować [i] (roam), włóczyć się [i] (loiter), błąkać się [i] (wander aimlessly), snuć się [i]
    wane: maleć [i] (decrease), zmaleć [p], słabnąć [i] (diminish), osłabnąć [p], ubywać [i] (the moon)
    want: chcieć [i], zechcieć [p], pragnąć [i] (desire), zapragnąć [p], pożądać [i] (desire)
    ward off: odpierać [i] (repel), odeprzeć [p], odpędzać [i] (drive away), zapobiegać [i] (prevent), zapobiec [p]
    warm: ogrzewać [i] (a room, the body), ogrzać [p], podgrzewać [i] (food), podgrzać [p], rozgrzewać [i] (heat strongly)
    warm up: podgrzewać [i] (reheat food), podgrzać [p], rozgrzewać się [i] (before exercise; athletes), rozgrzać się [p], ogrzewać się [i] (get warm)
    warn: ostrzegać [i], ostrzec [p], uprzedzać [i] (give advance notice), uprzedzić [p], przestrzegać [i] (caution, advise against)
    warp: deformować [i], zdeformować [p], wypaczać [i] (distort), wypaczyć [p], paczyć się [i] (wood)
    warrant: uzasadniać [i] (justify), uzasadnić [p], wymagać [i] (call for), zasługiwać [i] (merit), gwarantować [i] (guarantee)
    wash: myć [i] (hair; wash), umyć [p], prać [i] (clothes, laundry), wyprać [p], zmywać [i] (dishes; wash off)
    waste: marnować [i], zmarnować [p], trwonić [i], roztrwonić [p]
    watch: oglądać [i] (TV, movies; look at), obejrzeć [p], patrzeć [i] (look at), obserwować [i] (observe), pilnować [i] (keep watch over)
    water: podlewać [i] (plants), podlać [p], nawadniać [i] (irrigate), nawodnić [p], poić [i] (animals)
    wave: machać [i] (wave at someone, wave a hand), pomachać [p], falować [i] (billow), powiewać [i] (of a flag, flutter in the wind), pozdrawiać [i] (greet)
    waver: wahać się [i], zawahać się [p], chwiać się [i] (falter), zachwiać się [p]
    weaken: osłabiać [i], osłabić [p], słabnąć [i] (decline), osłabnąć [p], łagodzić [i] (lessen)
    wean: odstawiać [i] (a baby), odstawić [p], odzwyczajać [i] (from a habit), odzwyczaić [p]
    wear: nosić [i] (clothes, shoes, a hat, glasses), zużywać [i] (wear out), zużyć [p], ścierać [i] (wear out), zetrzeć [p]
    weave: tkać [i] (on a loom, textiles), utkać [p], pleść [i] (braid, basket), upleść [p], splatać [i] (interlace)
    wed: poślubiać [i] (formal), poślubić [p], pobierać się [i] (of a couple), żenić się [i] (of a groom), ożenić się [p]
    weep: płakać [i], zapłakać [p], szlochać [i] (sob loudly), opłakiwać [i] (weep for), opłakać [p]
    weigh: ważyć [i] (have a weight of, weigh on scales), zważyć [p], rozważać [i] (consider, weigh options), rozważyć [p], porównywać [i] (weigh one against another)
    weigh down: obciążać [i] (add weight to), obciążyć [p], przytłaczać [i] (depress), przytłoczyć [p], przygniatać [i] (be weighed down)
    welcome: witać [i], powitać [p], przyjmować [i] (receive guests, take in), przyjąć [p], gościć [i] (receive guests)
    weld: spawać [i], zespawać [p], przyspawać [p], zgrzewać [i] (join)
    whack: uderzać [i], uderzyć [p], walić [i] (colloquial), walnąć [p], grzmocić [i] (colloquial)
    whip: ubijać [i] (cream, eggs), ubić [p], chłostać [i] (flog), wychłostać [p], smagać [i] (lash)
    whisper: szeptać [i], szepnąć [p], wyszeptać [p], mruczeć [i] (murmur)
    whistle: gwizdać [i], gwizdnąć [p], zagwizdać [p], pogwizdywać [i] (softly)
    whiten: bielić [i] (paint white), pobielić [p], wybielać [i] (bleach), rozjaśniać [i] (lighten), bieleć [i] (turn white)
    whittle: strugać [i], wystrugać [p], rzeźbić [i] (carve), wyrzeźbić [p], zmniejszać [i] (whittle down)
    widen: poszerzać [i] (a road, make wider), poszerzyć [p], rozszerzać [i] (scope, horizons), rozszerzyć [p], rozszerzać się [i] (become wider, expand)
    wield: władać [i] (a weapon, power), dzierżyć [i] (a weapon, power), posługiwać się [i] (handle a tool), wywierać [i] (power, influence), wywrzeć [p]
    wiggle: poruszać [i] (fingers or toes), poruszyć [p], wiercić się [i] (squirm, fidget), wić się [i] (squirm), kręcić [i] (hips)
    win: wygrywać [i], wygrać [p], zwyciężać [i] (be victorious), zwyciężyć [p], zdobywać [i] (a medal or prize; achieve by effort)
    win over: przekonywać [i], przekonać [p], zjednywać [i] (win someone's favour), zjednać [p], pozyskiwać [i] (win over)
    wind: nawijać [i] (wind thread, wrap around), nawinąć [p], nakręcać [i] (a clock, toy), nakręcić [p], wić się [i] (meander; river, road)
    wink: mrugać [i] (wink at someone, blink), mrugnąć [p], zamrugać [p] (blink)
    wipe: wycierać [i] (wipe dry, wipe off), wytrzeć [p], ocierać [i] (wipe away tears), ścierać [i] (wipe off), wymazywać [i] (erase)
    wish: życzyć [i] (wish someone luck), pragnąć [i] (wish for), zapragnąć [p], marzyć [i] (make a wish, dream of), pomarzyć [p]
    withdraw: wycofywać [i] (pull back; troops, a statement), wycofać [p], wypłacać [i] (money), wypłacić [p], cofać [i] (take back a statement)
    wither: więdnąć [i] (droop), zwiędnąć [p], usychać [i] (dry up and die), uschnąć [p], wysychać [i] (dry out)
    withstand: wytrzymywać [i] (endure), wytrzymać [p], opierać się [i] (resist), oprzeć się [p], znosić [i] (endure)
    witness: obserwować [i] (observe), zaobserwować [p], poświadczać [i] (attest), poświadczyć [p], świadkować [i] (be present as a witness)
    wobble: chwiać się [i], zachwiać się [p], chybotać się [i], zataczać się [i] (stagger), zatoczyć się [p]
    word: formułować [i], sformułować [p], redagować [i] (draft a text), zredagować [p], wyrażać [i] (put into words)
    work: pracować [i] (people; be employed), popracować [p], działać [i] (machines or systems; take effect), zadziałać [p], funkcjonować [i] (machines)
    work out: rozwiązywać [i] (solve, sort out), rozwiązać [p], ćwiczyć [i] (exercise), opracowywać [i] (draw up a plan), opracować [p]
    worry: martwić się [i] (fear for), zmartwić się [p], zamartwiać się [i] (brood), martwić [i] (make someone worry), zmartwić [p]
    worsen: pogarszać [i] (make worse), pogorszyć [p], pogarszać się [i] (get worse), pogorszyć się [p], zaostrzać [i] (aggravate)
    worship: czcić [i] (revere), wielbić [i] (worship, revere), uwielbiać [i] (idolize), ubóstwiać [i] (idolize), modlić się [i] (pray before)
    wound: ranić [i], zranić [p], urażać [i] (hurt feelings), urazić [p], kaleczyć [i] (injure)
    wrap: owijać [i] (wrap around), owinąć [p], pakować [i] (gift, package), zapakować [p], zawijać [i] (wrap up)
    wreck: niszczyć [i] (damage badly), zniszczyć [p], rujnować [i] (ruin), zrujnować [p], rozbijać [i] (a ship)
    wrench: wyrywać [i] (wrest away, pull out forcefully), wyrwać [p], skręcać [i] (twist a joint), skręcić [p], wykręcać [i] (twist)
    wrestle: walczyć [i] (fight), powalczyć [p], mocować się [i] (grapple), zmagać się [i] (fight), szamotać się [i] (grapple)
    wring: wyżymać [i] (squeeze water out), wyżąć [p], wyciskać [i] (squeeze out), wycisnąć [p], wykręcać [i] (twist)
    write: pisać [i] (compose a text, write a book), napisać [p]
    write down: zapisywać [i], zapisać [p], notować [i], zanotować [p], spisywać [i] (take down dictation)
    write off: odpisywać [i] (debt, loss; accounting), odpisać [p], umarzać [i] (cancel a debt), umorzyć [p], skreślać [i] (give up on)
    x-ray: prześwietlać [i], prześwietlić [p]
    yank: szarpać [i] (jerk), szarpnąć [p], wyrywać [i] (pull out), wyrwać [p], ciągnąć [i] (drag)
    yawn: ziewać [i], ziewnąć [p]
    yearn: tęsknić [i] (long for; also miss), zatęsknić [p], pragnąć [i] (crave), łaknąć [i] (crave), wzdychać [i] (long for)
    yell: krzyczeć [i], krzyknąć [p], wrzeszczeć [i] (shout angrily), wrzasnąć [p], ryczeć [i] (roar)
    yelp: skowyczeć [i] (of a dog), zaskowyczeć [p], piszczeć [i] (cry out sharply), pisnąć [p], szczekać [i] (bark)
    yield: przynosić [i] (produce, bring in profit), przynieść [p], ustępować [i] (give way, concede), ustąpić [p], poddawać się [i] (submit)
    yoke: zaprzęgać [i] (hitch animals, put in harness), zaprząc [p], ujarzmiać [i] (subjugate), ujarzmić [p], łączyć [i] (link)
    zap: likwidować [i] (eliminate, destroy), zlikwidować [p], kasować [i] (delete, erase), skasować [p], przełączać [i] (change TV channels)
    zip: kompresować [i] (files), skompresować [p], zapinać [i] (a zipper, zip up), zapiąć [p], pędzić [i] (zip along)
    zone: przeznaczać [i] (designate land use), przeznaczyć [p], wyznaczać [i] (designate an area), wyznaczyć [p], dzielić [i] (divide into zones)
    zoom: przybliżać [i] (zoom in on), przybliżyć [p], oddalać [i] (zoom out), oddalić [p], śmigać [i] (rush past, speed along)
  `;

  // "mówić [i]" -> { pl: 'mówić', aspect: 'i' };  "myć się [i]" -> { pl: 'myć się', aspect: 'i' }
  function readEntry(entry, english) {
    const match = entry.match(/^([a-ząćęłńóśźż]+(?: się)?)\s*\[(i|p|b)\]\s*(?:\((.*)\))?$/);
    if (!match) throw new Error(`verbs.js: cannot read "${entry}" in "${english}"`);
    const [, pl, aspect, note] = match;
    return { pl, aspect, ...(note ? { note } : {}) };
  }

  const VERBS = parseTable(TABLE, readEntry);

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
