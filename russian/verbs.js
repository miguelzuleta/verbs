/*
 * English -> Russian verb database.
 *
 * One line per English verb:
 *   english: говори́ть [i], сказа́ть [p] (usage note)
 *
 * Each translation is an infinitive with ONE stress mark (a combining acute accent,
 * U+0301, after the stressed vowel; none on one-vowel words or on words with ё),
 * followed by its aspect in brackets: [i] imperfective, [p] perfective, [b] both.
 * The stress mark tells the engine which ending is stressed (it decides ё/е and the
 * imperative ending); the engine writes its forms without stress marks. Reflexive
 * verbs (-ся) are ordinary entries. The first translation is the default.
 */
(function (global) {
  'use strict';

  const { parseTable, plainEntry } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: броса́ть [i], бро́сить [p], отка́зываться [i] (give up a claim), покида́ть [i], поки́нуть [p]
    abort: прерыва́ть [i], прерва́ть [p], прекраща́ть [i], прекрати́ть [p]
    absorb: впи́тывать [i], впита́ть [p], поглоща́ть [i], поглоти́ть [p]
    abuse: злоупотребля́ть [i] (misuse), злоупотреби́ть [p] (misuse), оскорбля́ть [i] (mistreat), оскорби́ть [p], обижа́ть [i] (mistreat)
    accelerate: ускоря́ть [i], уско́рить [p]
    accept: принима́ть [i], приня́ть [p], соглаша́ться [i] (an offer), согласи́ться [p] (an offer)
    accompany: сопровожда́ть [i], сопроводи́ть [p], провожа́ть [i], проводи́ть [p] (see off)
    accomplish: выполня́ть [i], вы́полнить [p], соверша́ть [i] (a feat), соверши́ть [p] (a feat), осуществля́ть [i]
    accumulate: нака́пливать [i], накопи́ть [p], копи́ть [i], скопи́ть [p]
    accuse: обвиня́ть [i], обвини́ть [p]
    achieve: достига́ть [i], дости́чь [p], добива́ться [i], доби́ться [p]
    acknowledge: признава́ть [i], призна́ть [p], подтвержда́ть [i] (confirm receipt), подтверди́ть [p] (confirm receipt)
    acquire: приобрета́ть [i], приобрести́ [p], осва́ивать [i] (a skill), осво́ить [p] (a skill)
    acquit: опра́вдывать [i], оправда́ть [p]
    act: де́йствовать [i], игра́ть [i] (in a play), сыгра́ть [p] (a role), поступа́ть [i] (behave), поступи́ть [p] (behave)
    adapt: адапти́ровать [b], приспоса́бливать [i], приспосо́бить [p], экранизи́ровать [b] (a story for film)
    add: добавля́ть [i], доба́вить [p], скла́дывать [i] (in math), сложи́ть [p] (in math), прибавля́ть [i]
    adhere: приде́рживаться [i] (a rule or idea), прилипа́ть [i] (stick), прили́пнуть [p] (stick), сле́довать [i] (a rule)
    adjust: регули́ровать [i], отрегули́ровать [p], настра́ивать [i] (a setting), настро́ить [p] (a setting), приспоса́бливать [i]
    administer: управля́ть [i], дава́ть [i] (medicine), дать [p] (medicine), вводи́ть [i] (a drug), ввести́ [p] (a drug)
    admire: восхища́ться [i], восхити́ться [p], любова́ться [i], полюбова́ться [p]
    admit: признава́ть [i], призна́ть [p], признава́ться [i] (confess), призна́ться [p] (confess), принима́ть [i] (let in, to a hospital or school)
    adopt: усыновля́ть [i] (a child), усынови́ть [p] (a child), принима́ть [i] (a method or idea), приня́ть [p] (a method or idea)
    adore: обожа́ть [i], боготвори́ть [i], поклоня́ться [i] (worship), люби́ть [i] (love dearly)
    advance: продвига́ться [i] (move forward), продви́нуться [p] (move forward), продвига́ть [i] (move something forward), продви́нуть [p] (move something forward), прогресси́ровать [i] (make progress)
    advertise: рекла́мировать [i], прорекла́мировать [p], объявля́ть [i] (place an ad), объяви́ть [p] (place an ad)
    advise: сове́товать [i], посове́товать [p], консульти́ровать [i] (as an expert), проконсульти́ровать [p] (as an expert)
    advocate: выступа́ть [i] (for), вы́ступить [p] (for), отста́ивать [i] (defend a cause), отстоя́ть [p] (defend a cause), защища́ть [i]
    affect: влия́ть [i] (influence), повлия́ть [p] (influence), затра́гивать [i] (concern), затро́нуть [p] (concern), тро́гать [i] (move emotionally)
    age: старе́ть [i], постаре́ть [p], созрева́ть [i] (mature, as wine), созре́ть [p] (mature, as wine)
    agitate: волнова́ть [i] (upset), взволнова́ть [p] (upset), агити́ровать [i] (stir up people), трясти́ [i] (shake), встряхну́ть [p] (shake)
    agree: соглаша́ться [i], согласи́ться [p], догова́риваться [i] (agree on), договори́ться [p] (agree on)
    aim: це́литься [i] (point at something), прице́литься [p] (point at something), стреми́ться [i] (to do something), наце́ливать [i], наце́лить [p]
    alert: предупрежда́ть [i], предупреди́ть [p], оповеща́ть [i], оповести́ть [p]
    align: выра́внивать [i], вы́ровнять [p], согласо́вывать [i] (bring into line), согласова́ть [p] (bring into line), выстра́ивать [i]
    allocate: выделя́ть [i], вы́делить [p], распределя́ть [i] (share out), распредели́ть [p] (share out), назнача́ть [i] (assign)
    allow: разреша́ть [i], разреши́ть [p], позволя́ть [i], позво́лить [p], допуска́ть [i]
    alter: изменя́ть [i], измени́ть [p], меня́ть [i], переде́лывать [i] (modify slightly), переде́лать [p] (modify slightly)
    amaze: удивля́ть [i], удиви́ть [p], изумля́ть [i], изуми́ть [p], удивля́ться [i] (be amazed)
    amend: исправля́ть [i] (correct), испра́вить [p] (correct), дополня́ть [i] (supplement), допо́лнить [p] (supplement), изменя́ть [i] (a law)
    amuse: развлека́ть [i] (entertain), развле́чь [p] (entertain), забавля́ть [i], позаба́вить [p], смеши́ть [i] (make laugh)
    analyze: анализи́ровать [i], проанализи́ровать [p], иссле́довать [b] (examine)
    anger: серди́ть [i] (make angry), рассерди́ть [p] (make angry), злить [i], разозли́ть [p], серди́ться [i] (get angry)
    announce: объявля́ть [i], объяви́ть [p], сообща́ть [i], сообщи́ть [p]
    annoy: раздража́ть [i], раздражи́ть [p], надоеда́ть [i], надое́сть [p], беспоко́ить [i] (bother)
    answer: отвеча́ть [i], отве́тить [p]
    anticipate: ожида́ть [i], предви́деть [i] (foresee), предвкуша́ть [i] (look forward to), предвкуси́ть [p] (look forward to), предвосхища́ть [i] (act in advance)
    appeal: нра́виться [i] (be attractive), понра́виться [p] (be attractive), апелли́ровать [i] (to a higher court), обжа́ловать [p] (a ruling), обраща́ться [i] (make an appeal)
    appear: появля́ться [i], появи́ться [p], каза́ться [i] (seem), показа́ться [p] (seem), выступа́ть [i] (on stage)
    applaud: аплоди́ровать [i], хло́пать [i] (clap), рукоплеска́ть [i], одобря́ть [i] (praise), одо́брить [p] (praise)
    apply: применя́ть [i], примени́ть [p], обраща́ться [i] (apply for), обрати́ться [p] (apply for), наноси́ть [i] (spread on)
    appoint: назнача́ть [i], назна́чить [p]
    appreciate: цени́ть [i] (value), оцени́ть [p] (value), благодари́ть [i] (be grateful for), поблагодари́ть [p] (be grateful for), наслажда́ться [i] (enjoy art)
    approach: приближа́ться [i], прибли́зиться [p], подходи́ть [i] (a person; a problem), подойти́ [p] (a person; a problem)
    approve: одобря́ть [i], одо́брить [p], утвержда́ть [i] (officially), утверди́ть [p] (officially)
    argue: спо́рить [i], поспо́рить [p], ссо́риться [i] (quarrel), утвержда́ть [i] (claim), аргументи́ровать [b] (reason)
    arise: возника́ть [i], возни́кнуть [p], появля́ться [i], появи́ться [p], происходи́ть [i] (occur)
    arrange: устра́ивать [i] (organize), устро́ить [p] (organize), организова́ть [b], расставля́ть [i] (put in order), расста́вить [p] (put in order)
    arrest: аресто́вывать [i], арестова́ть [p], заде́рживать [i], задержа́ть [p]
    arrive: приезжа́ть [i], прие́хать [p], приходи́ть [i], прийти́ [p], прибыва́ть [i]
    articulate: произноси́ть [i] (pronounce), произнести́ [p] (pronounce), выража́ть [i] (express clearly), вы́разить [p] (express clearly), излага́ть [i] (express clearly)
    ascend: поднима́ться [i], подня́ться [p], восходи́ть [i] (a mountain), взойти́ [p] (a mountain)
    ask: спра́шивать [i] (a question), спроси́ть [p] (a question), проси́ть [i] (for something), попроси́ть [p] (for something), расспра́шивать [i] (question someone)
    ask for: проси́ть [i], попроси́ть [p], тре́бовать [i] (demand), потре́бовать [p] (demand), запра́шивать [i] (request formally)
    aspire: стреми́ться [i], мечта́ть [i], жела́ть [i]
    assemble: собира́ть [i] (parts), собра́ть [p] (parts), собира́ться [i] (come together), собра́ться [p] (come together), монти́ровать [i] (parts)
    assert: утвержда́ть [i], заявля́ть [i], заяви́ть [p], настаива́ть [i] (insist), настоя́ть [p] (insist)
    assess: оце́нивать [i], оцени́ть [p], определя́ть [i] (estimate), определи́ть [p] (estimate)
    assign: назнача́ть [i], назна́чить [p], поруча́ть [i] (a task), поручи́ть [p] (a task), относи́ть [i] (to a category)
    assimilate: усва́ивать [i] (take in), усво́ить [p] (take in), ассимили́ровать [b]
    assist: помога́ть [i], помо́чь [p], соде́йствовать [b]
    associate: ассоции́ровать [b] (link in the mind), свя́зывать [i] (in the mind), связа́ть [p] (in the mind), обща́ться [i] (spend time with), води́ться [i] (keep company)
    assume: предполага́ть [i] (suppose), предположи́ть [p] (suppose), брать [i] (take on a duty), взять [p] (take on a duty), допуска́ть [i] (presuppose)
    assure: уверя́ть [i], уве́рить [p], заверя́ть [i], заве́рить [p], гаранти́ровать [b] (promise)
    astonish: изумля́ть [i], изуми́ть [p], поража́ть [i], порази́ть [p], изумля́ться [i] (be astonished)
    attach: прикрепля́ть [i] (fasten), прикрепи́ть [p] (fasten), прикла́дывать [i] (enclose with a document), приложи́ть [p] (enclose with a document), прикле́ивать [i] (stick on)
    attack: напада́ть [i] (assault someone), напа́сть [p] (assault someone), атакова́ть [b]
    attain: достига́ть [i], дости́гнуть [p], добива́ться [i], доби́ться [p]
    attempt: пыта́ться [i], попыта́ться [p], про́бовать [i], попро́бовать [p], стара́ться [i]
    attend: посеща́ть [i] (an event; a class), посети́ть [p] (an event; a class), прису́тствовать [i] (an event), забо́титься [i] (take care of), ходи́ть [i] (school regularly)
    attract: привлека́ть [i], привле́чь [p], притя́гивать [i], притяну́ть [p], очаро́вывать [i] (charm)
    attribute: припи́сывать [i] (ascribe a quality), приписа́ть [p] (ascribe a quality), объясня́ть [i] (put down to a cause), относи́ть [i] (trace back to), отнести́ [p] (trace back to)
    audit: проверя́ть [i] (examine accounts), прове́рить [p] (examine accounts), посеща́ть [i] (a class)
    authorize: разреша́ть [i], разреши́ть [p], уполномо́чивать [i], уполномо́чить [p], санкциони́ровать [b]
    avoid: избега́ть [i], избежа́ть [p], уклоня́ться [i] (sidestep), уклони́ться [p] (sidestep), возде́рживаться [i] (refrain from)
    award: награжда́ть [i] (a prize), награди́ть [p] (a prize), присужда́ть [i] (a prize; a claim), присуди́ть [p] (a prize; a claim)
    back up: подде́рживать [i] (support someone), поддержа́ть [p] (support someone), подтвержда́ть [i] (a claim), подтверди́ть [p] (a claim), сохраня́ть [i] (data)
    bake: печь [i], испе́чь [p], выпека́ть [i], вы́печь [p]
    balance: баланси́ровать [i] (be in balance), сбаланси́ровать [p] (bring into balance), уравнове́шивать [i] (even out), уравнове́сить [p] (even out), компенси́ровать [b] (offset)
    ban: запреща́ть [i], запрети́ть [p]
    bandage: перевя́зывать [i] (a wound), перевяза́ть [p] (a wound), бинтова́ть [i] (wrap with a bandage), забинтова́ть [p] (wrap with a bandage)
    bang: стуча́ть [i] (on a door), хло́пать [i] (with a bang), хло́пнуть [p] (with a bang), ударя́ть [i] (hit hard), уда́рить [p] (hit hard)
    baptize: крести́ть [i], окрести́ть [p]
    bargain: торгова́ться [i] (haggle), поторгова́ться [p] (haggle), догова́риваться [i] (negotiate), договори́ться [p] (negotiate)
    bark: ла́ять [i], гавка́ть [i], гавкну́ть [p]
    base: осно́вывать [i] (found on), основа́ть [p] (found on), бази́роваться [i] (be based on), опира́ться [i] (rest on), опере́ться [p] (rest on)
    bathe: купа́ться [i], искупа́ться [p], купа́ть [i] (bathe someone), искупа́ть [p] (bathe someone)
    battle: боро́ться [i] (struggle), сража́ться [i], срази́ться [p], воева́ть [i]
    be: быть [i] (identity, traits; state, location), явля́ться [i] (identity, traits), находи́ться [i] (location, existence), станови́ться [i] (become), стать [p] (become)
    bear: терпе́ть [i] (endure), вы́терпеть [p] (endure), носи́ть [i] (carry), рожа́ть [i] (give birth), роди́ть [p] (give birth)
    beat: побежда́ть [i] (defeat), победи́ть [p] (defeat), бить [i] (hit), взбива́ть [i] (whisk eggs), взбить [p] (whisk eggs)
    beautify: украша́ть [i] (decorate), укра́сить [p] (decorate), благоустра́ивать [i] (a place), благоустро́ить [p] (a place)
    beg: проси́ть [i], умоля́ть [i] (implore), умоли́ть [p] (implore), попроша́йничать [i] (beg for money), выпра́шивать [i]
    begin: начина́ть [i] (start something), нача́ть [p] (start something), начина́ться [i] (it starts), нача́ться [p] (it starts), приступа́ть [i]
    belch: рыга́ть [i], рыгну́ть [p]
    believe: ве́рить [i] (trust), пове́рить [p] (trust), полага́ть [i] (think), счита́ть [i] (hold the opinion), ду́мать [i] (think)
    belong: принадлежа́ть [i], состоя́ть [i] (a group), относи́ться [i] (to a category)
    bend: гнуть [i] (curve), согну́ть [p] (a limb), сгиба́ть [i] (a limb), наклоня́ться [i] (bend down), наклони́ться [p] (bend down)
    bet: ста́вить [i] (stake money), поста́вить [p] (stake money), спо́рить [i] (wager), поспо́рить [p] (wager)
    bid: предлага́ть [i] (offer a price), предложи́ть [p] (offer a price), торгова́ться [i] (make an offer)
    bill: выставля́ть [i] (invoice for a service), вы́ставить [p] (invoice for a service), взима́ть [i] (charge a fee), начисля́ть [i] (charge a fee), начи́слить [p] (charge a fee)
    bind: привя́зывать [i] (tie), привяза́ть [p] (tie), свя́зывать [i], связа́ть [p], обя́зывать [i] (oblige by contract)
    bite: куса́ть [i], укуси́ть [p], откуси́ть [p] (bite off), грызть [i] (bite hard), куса́ться [i] (snap at)
    blackmail: шантажи́ровать [i], пошантажи́ровать [p], вымога́ть [i] (extort money)
    blame: вини́ть [i], обвиня́ть [i], обвини́ть [p], упрека́ть [i] (reproach), упрекну́ть [p] (reproach)
    bleach: отбе́ливать [i], отбели́ть [p], обесцве́чивать [i] (hair), обесцве́тить [p] (hair), осветля́ть [i] (hair)
    bleed: кровоточи́ть [i]
    blend: сме́шивать [i], смеша́ть [p], слива́ться [i] (blend in), сли́ться [p] (blend in), соединя́ть [i]
    bless: благословля́ть [i], благослови́ть [p]
    blink: морга́ть [i], моргну́ть [p], мига́ть [i] (flash, as a light), мигну́ть [p] (flash, as a light)
    block: блоки́ровать [b], перекрыва́ть [i] (a road), перекры́ть [p] (a road), засоря́ть [i] (a pipe), засори́ть [p] (a pipe)
    bloom: цвести́ [i], расцвета́ть [i], расцвести́ [p]
    blossom: расцвета́ть [i] (flourish), расцвести́ [p] (flourish), цвести́ [i], процвета́ть [i] (thrive)
    blow: дуть [i] (of wind), поду́ть [p], сдува́ть [i] (blow away), сдуть [p] (blow away)
    blur: размыва́ть [i], размы́ть [p], расплыва́ться [i] (become blurry), расплы́ться [p] (become blurry), затума́нивать [i] (make unclear)
    board: сади́ться [i] (a ship or plane), сесть [p] (a ship or plane), поднима́ться [i] (on board), подня́ться [p] (on board)
    boast: хва́статься [i], похва́статься [p], хвали́ться [i], похвали́ться [p]
    boil: кипе́ть [i] (water boils), вскипе́ть [p] (water boils), кипяти́ть [i] (heat water), вари́ть [i] (cook in water), свари́ть [p] (cook in water)
    bond: скле́ивать [i] (glue together), скле́ить [p] (glue together), сближа́ться [i] (form a close relationship), сбли́зиться [p] (form a close relationship), свя́зывать [i]
    book: брони́ровать [i], заброни́ровать [p], зака́зывать [i], заказа́ть [p], резерви́ровать [b]
    boost: стимули́ровать [b] (an economy), повыша́ть [i], повы́сить [p], увели́чивать [i], увели́чить [p]
    bore: надоеда́ть [i] (make bored), надое́сть [p] (make bored), скуча́ть [i] (be bored), сверли́ть [i] (drill a hole), просверли́ть [p] (drill a hole)
    bother: беспоко́ить [i] (trouble someone), побеспоко́ить [p] (trouble someone), меша́ть [i] (disturb), помеша́ть [p] (disturb)
    bounce: отска́кивать [i] (as a ball), отскочи́ть [p] (as a ball), подпры́гивать [i] (jump), подпры́гнуть [p] (jump), подбра́сывать [i] (make bounce)
    bow: кла́няться [i], поклони́ться [p], наклоня́ть [i] (the head), наклони́ть [p] (the head), уступа́ть [i] (yield)
    boycott: бойкоти́ровать [b]
    brag: хва́статься [i], похва́статься [p], хвали́ться [i] (informal), бахва́литься [i] (informal)
    brake: тормози́ть [i], затормози́ть [p], притормози́ть [p] (slow down)
    break: лома́ть [i], слома́ть [p], разбива́ть [i] (glass or plates), разби́ть [p] (glass or plates), лома́ться [i] (snap)
    breathe: дыша́ть [i], вдыха́ть [i] (breathe in), вдохну́ть [p] (breathe in), выдыха́ть [i] (breathe out), вы́дохнуть [p] (breathe out)
    brew: зава́ривать [i] (tea or coffee), завари́ть [p] (tea or coffee), вари́ть [i] (beer), свари́ть [p] (beer)
    bribe: подкупа́ть [i], подкупи́ть [p]
    bring: приноси́ть [i] (bring something), принести́ [p] (bring something), приводи́ть [i] (bring a person), привести́ [p] (bring a person), привози́ть [i] (by vehicle)
    bring up: воспи́тывать [i] (children), воспита́ть [p] (children), поднима́ть [i] (a topic), подня́ть [p] (a topic), упомина́ть [i] (mention)
    broadcast: передава́ть [i], переда́ть [p], трансли́ровать [b] (live), веща́ть [i] (on TV), пока́зывать [i] (a TV program)
    broaden: расширя́ть [i] (a road), расши́рить [p] (a road)
    browse: просма́тривать [i], просмотре́ть [p], листа́ть [i] (flip through a book), полиста́ть [p] (flip through a book), осма́триваться [i] (look around a shop)
    bruise: ушиба́ть [i] (a body part), ушиби́ть [p] (a body part), мять [i] (of fruit), помя́ть [p] (of fruit)
    brush: чи́стить [i] (teeth or shoes), почи́стить [p] (teeth or shoes), расчёсывать [i] (hair), каса́ться [i] (touch lightly), косну́ться [p] (touch lightly)
    bubble: бурли́ть [i], пузы́риться [i], кипе́ть [i]
    buckle: застёгивать [i] (a belt), застегну́ть [p] (a belt), прогиба́ться [i] (give way), прогну́ться [p] (give way), коро́биться [i] (warp)
    build: стро́ить [i], постро́ить [p], создава́ть [i], созда́ть [p], выстра́ивать [i] (a relationship)
    bully: запу́гивать [i] (intimidate), запуга́ть [p] (intimidate), издева́ться [i], угрожа́ть [i] (threaten), трави́ть [i] (exclude)
    burden: обременя́ть [i], обремени́ть [p], нагружа́ть [i] (impose on), нагрузи́ть [p] (impose on), отягоща́ть [i] (weigh down)
    burn: горе́ть [i] (be on fire), сгоре́ть [p] (be destroyed by fire), жечь [i] (burn something), сжечь [p] (burn something), обжига́ть [i] (scorch)
    burst: ло́паться [i], ло́пнуть [p], взрыва́ться [i] (explode), взорва́ться [p] (explode), разрыва́ться [i] (burst open)
    bury: хорони́ть [i] (at a funeral), похорони́ть [p] (at a funeral), зака́пывать [i] (in the ground), закопа́ть [p] (in the ground), зарыва́ть [i] (in the ground)
    buy: покупа́ть [i], купи́ть [p], приобрета́ть [i] (formal), приобрести́ [p] (formal)
    buzz: жужжа́ть [i] (hum or drone), зажужжа́ть [p] (hum or drone), гуде́ть [i] (buzz with voices), загуде́ть [p] (buzz with voices)
    cage: сажа́ть [i] (in a cage), посади́ть [p] (in a cage), запира́ть [i] (lock in), запере́ть [p] (lock in), заключа́ть [i] (confine)
    calculate: вычисля́ть [i], вычи́слить [p], рассчи́тывать [i] (estimate costs), рассчита́ть [p] (estimate costs), подсчи́тывать [i] (work out a figure)
    call: звони́ть [i] (phone), позвони́ть [p] (phone), называ́ть [i] (name), назва́ть [p] (name), звать [i] (summon)
    calm: успока́ивать [i] (soothe someone), успоко́ить [p] (soothe someone), успока́иваться [i] (calm down), успоко́иться [p] (calm down)
    camp: ночева́ть [i] (in a tent), переночева́ть [p] (in a tent), располага́ться [i] (set up camp), расположи́ться [p] (set up camp)
    can: мочь [i] (be able to; be allowed to), смочь [p] (be able to manage), уме́ть [i] (know how to), суме́ть [p] (manage)
    cancel: отменя́ть [i], отмени́ть [p], аннули́ровать [b] (a contract), расторга́ть [i] (a contract), расто́ргнуть [p] (a contract)
    capture: захва́тывать [i] (a place), захвати́ть [p] (a place), запечатлева́ть [i] (an image or moment), запечатле́ть [p] (an image or moment)
    care: забо́титься [i] (look after), позабо́титься [p] (look after), уха́живать [i] (nurse), беспоко́иться [i] (worry), пережива́ть [i] (care about)
    caress: ласка́ть [i], приласка́ть [p], гла́дить [i] (stroke), погла́дить [p] (stroke)
    carry: носи́ть [i] (on one's person), нести́ [i] (in the hands), понести́ [p], везти́ [i] (transport), таска́ть [i] (a heavy load)
    carry out: выполня́ть [i], вы́полнить [p], осуществля́ть [i], осуществи́ть [p], проводи́ть [i]
    carve: выреза́ть [i] (wood), вы́резать [p] (wood), ре́зать [i] (carve meat), высека́ть [i] (stone), вая́ть [i] (sculpt)
    cash: обнали́чивать [i] (a cheque), обнали́чить [p] (a cheque), разме́нивать [i] (exchange money), разменя́ть [p] (exchange money)
    cast: броса́ть [i] (throw), бро́сить [p] (throw), отлива́ть [i] (metal), отли́ть [p] (metal), распределя́ть [i] (roles to actors)
    catch: лови́ть [i], пойма́ть [p], хвата́ть [i] (a falling object), схвати́ть [p] (a falling object), простужа́ться [i] (a cold)
    categorize: классифици́ровать [b], сортирова́ть [i] (sort), рассортирова́ть [p] (sort), разделя́ть [i] (divide), раздели́ть [p] (divide)
    cause: вызыва́ть [i], вы́звать [p], причиня́ть [i], причини́ть [p], повле́чь [p] (bring about)
    cease: прекраща́ть [i] (stop an activity), прекрати́ть [p] (stop an activity), перестава́ть [i], переста́ть [p], прекраща́ться [i] (come to an end)
    celebrate: пра́здновать [i], отпра́здновать [p], отмеча́ть [i] (commemorate), отме́тить [p] (commemorate), справля́ть [i] (a ritual)
    chain: прико́вывать [i] (with a chain), прикова́ть [p] (with a chain), ско́вывать [i] (bind in chains), скова́ть [p] (bind in chains), зако́вывать [i]
    challenge: оспа́ривать [i] (dispute a claim), оспо́рить [p] (dispute a claim), вызыва́ть [i] (to a contest), вы́звать [p] (to a contest), сомнева́ться [i] (doubt)
    change: меня́ть [i] (swap one thing for another), поменя́ть [p] (swap one thing for another), изменя́ть [i] (make different), измени́ть [p] (make different), изменя́ться [i] (become different)
    chant: выкри́кивать [i] (slogans), вы́крикнуть [p] (slogans), петь [i], пропе́ть [p], напева́ть [i] (recite in a murmur)
    charge: брать [i] (a price), взима́ть [i] (a fee), заряжа́ть [i] (a battery), заряди́ть [p] (a battery), обвиня́ть [i] (accuse formally)
    charm: очаро́вывать [i], очарова́ть [p], околдо́вывать [i] (bewitch), околдова́ть [p] (bewitch), пленя́ть [i] (delight)
    chase: гна́ться [i] (run after), погна́ться [p] (run after), гоня́ться [i] (run after), пресле́довать [i] (pursue), догоня́ть [i] (try to catch)
    chat: болта́ть [i] (informal), поболта́ть [p] (informal), разгова́ривать [i], обща́ться [i] (online), бесе́довать [i]
    chatter: болта́ть [i] (talk a lot), поболта́ть [p] (talk a lot), щебета́ть [i] (birds), защебета́ть [p] (birds)
    cheat: обма́нывать [i], обману́ть [p], жу́льничать [i] (at games), спи́сывать [i] (in exams), изменя́ть [i] (cheat on a partner)
    check: проверя́ть [i], прове́рить [p], сверя́ть [i], све́рить [p], осма́тривать [i] (look and see)
    cheer: подба́дривать [i] (encourage), подбодри́ть [p] (encourage), развеселя́ть [i] (cheer up), развесели́ть [p] (cheer up), ликова́ть [i] (shout with joy)
    cherish: дорожи́ть [i] (value highly), леле́ять [i] (a hope or feeling), бере́чь [i] (guard as precious), храни́ть [i] (keep dear), люби́ть [i] (love dearly)
    chew: жева́ть [i], прожева́ть [p], разжёвывать [i], разжева́ть [p]
    chill: охлажда́ть [i] (cool down), охлади́ть [p] (cool down), остыва́ть [i] (get cold), осты́ть [p] (get cold), расслабля́ться [i] (relax)
    choke: души́ть [i] (strangle), задуши́ть [p] (strangle), задыха́ться [i] (suffocate), задохну́ться [p] (suffocate), подави́ться [p] (choke on food)
    choose: выбира́ть [i], вы́брать [p], избира́ть [i], избра́ть [p]
    chop: руби́ть [i] (wood), нареза́ть [i] (food), наре́зать [p] (food), измельча́ть [i] (mince), измельчи́ть [p] (mince)
    circle: кружи́ть [i] (fly in circles), обводи́ть [i] (mark with a circle), обвести́ [p] (mark with a circle), окружа́ть [i] (surround), окружи́ть [p] (surround)
    circulate: циркули́ровать [i], обраща́ться [i] (be in circulation), распространя́ть [i] (spread around), распространи́ть [p] (spread around)
    cite: цити́ровать [i], процити́ровать [p], ссыла́ться [i] (give as evidence), сосла́ться [p] (give as evidence), приводи́ть [i] (an example)
    claim: тре́бовать [i] (demand), потре́бовать [p] (demand), утвержда́ть [i] (assert), претендова́ть [i] (a right), взы́скивать [i] (claim money)
    clap: хло́пать [i] (clap hands), похло́пать [p] (clap hands; pat), аплоди́ровать [i]
    clarify: уточня́ть [i], уточни́ть [p], выясня́ть [i] (by investigation), вы́яснить [p] (by investigation), разъясня́ть [i] (explain)
    clash: ста́лкиваться [i] (conflict), столкну́ться [p] (conflict), конфликтова́ть [i] (be at odds), противоре́чить [i]
    clasp: сжима́ть [i] (hold tightly), сжать [p] (hold tightly), пожима́ть [i] (clasp hands), пожа́ть [p] (clasp hands), обнима́ть [i] (in an embrace)
    classify: классифици́ровать [b], относи́ть [i] (into groups), отнести́ [p] (into groups), оце́нивать [i] (rate)
    clean: чи́стить [i], почи́стить [p], мыть [i] (wash), вы́мыть [p] (wash), протира́ть [i] (wipe)
    clean up: убира́ть [i] (tidy), убра́ть [p] (tidy), прибира́ть [i] (clear up), прибра́ть [p] (clear up)
    cleanse: очища́ть [i] (purify), очи́стить [p] (purify), омыва́ть [i] (wash), омы́ть [p] (wash), промыва́ть [i] (wash a wound)
    clear: убира́ть [i] (clear a table), убра́ть [p] (clear a table), расчища́ть [i] (a room or space), расчи́стить [p] (a room or space), проясня́ться [i] (the weather clears)
    clench: сжима́ть [i] (a fist; lips or teeth), сжать [p] (a fist; lips or teeth), сти́скивать [i] (teeth), сти́снуть [p] (teeth)
    click: щёлкать [i] (tongue or fingers), щёлкнуть [p] (tongue or fingers), нажима́ть [i] (click on something), нажа́ть [p] (click on something)
    climb: поднима́ться [i] (a mountain), подня́ться [p] (a mountain), взбира́ться [i] (go up), взобра́ться [p] (go up), кара́бкаться [i] (scramble up)
    clip: подреза́ть [i] (trim), подре́зать [p] (trim), выреза́ть [i] (cut out), вы́резать [p] (cut out), скрепля́ть [i] (fasten with a clip)
    clog: засоря́ть [i], засори́ть [p], забива́ть [i] (block), заби́ть [p] (block), засоря́ться [i] (become clogged)
    clone: клони́ровать [b], копи́ровать [i], скопи́ровать [p]
    close: закрыва́ть [i] (a door or window), закры́ть [p] (a door or window), закрыва́ться [i] (it closes), закры́ться [p] (it closes)
    clutch: хвата́ть [i] (grab), схвати́ть [p] (grab), цепля́ться [i] (hold on to), вцепи́ться [p] (hold on to), сжима́ть [i] (seize)
    coach: тренирова́ть [i], натренирова́ть [p], обуча́ть [i], обучи́ть [p]
    coax: угова́ривать [i], уговори́ть [p], зама́нивать [i] (lure), замани́ть [p] (lure)
    code: программи́ровать [i] (write programs), запрограмми́ровать [p] (write programs), кодирова́ть [i] (encode), закодирова́ть [p] (encode)
    coincide: совпада́ть [i], совпа́сть [p], пересека́ться [i] (overlap in time)
    collaborate: сотру́дничать [i], взаимоде́йствовать [i]
    collapse: ру́шиться [i] (crumble), ру́хнуть [p] (fall down), обва́ливаться [i] (a structure), обвали́ться [p] (a structure), разва́ливаться [i] (disintegrate)
    collect: собира́ть [i] (gather), собра́ть [p] (gather), коллекциони́ровать [i] (as a hobby), забира́ть [i] (pick up), забра́ть [p] (pick up)
    collide: ста́лкиваться [i], столкну́ться [p], вреза́ться [i], вре́заться [p]
    color: кра́сить [i] (dye or tint), покра́сить [p] (dye or tint), раскра́шивать [i] (colour in a picture), раскра́сить [p] (colour in a picture), окра́шивать [i] (tint)
    comb: причёсывать [i], причеса́ть [p], расчёсывать [i], расчеса́ть [p], прочёсывать [i] (comb through a place)
    combat: боро́ться [i] (against), искореня́ть [i] (stamp out a problem), искорени́ть [p] (stamp out a problem), противостоя́ть [i] (confront), пресека́ть [i] (counter)
    combine: объединя́ть [i], объедини́ть [p], сочета́ть [b], комбини́ровать [i], соединя́ть [i] (link)
    come: приходи́ть [i], прийти́ [p], приезжа́ть [i] (by vehicle), прие́хать [p] (by vehicle)
    come back: возвраща́ться [i], верну́ться [p], возврати́ться [p], приходи́ть [i] (come again), прийти́ [p] (come again)
    come in: входи́ть [i], войти́ [p], заходи́ть [i] (step in), зайти́ [p] (step in)
    comfort: утеша́ть [i], утеши́ть [p], успока́ивать [i], успоко́ить [p]
    command: прика́зывать [i] (order), приказа́ть [p] (order), кома́ндовать [i] (lead troops), скомандова́ть [p] (give a command), веле́ть [b] (order)
    commemorate: отмеча́ть [i] (an anniversary), отме́тить [p] (an anniversary), чтить [i] (honor), почти́ть [p] (the dead), вспомина́ть [i] (remember fondly)
    comment: комменти́ровать [i], прокомменти́ровать [p], замеча́ть [i] (remark), заме́тить [p] (remark), выска́зываться [i] (state)
    commit: соверша́ть [i] (a crime or mistake), соверши́ть [p] (a crime or mistake), обя́зываться [i] (commit to a promise), обяза́ться [p] (commit to a promise), посвяща́ть [i] (commit to a task)
    communicate: обща́ться [i] (understand each other), сообща́ть [i] (inform), сообщи́ть [p] (inform), свя́зываться [i] (get in touch), связа́ться [p] (get in touch)
    compare: сра́внивать [i], сравни́ть [p], сопоставля́ть [i], сопоста́вить [p]
    compensate: компенси́ровать [b], возмеща́ть [i] (pay for a loss), возмести́ть [p] (pay for a loss), восполня́ть [i] (make up for), воспо́лнить [p] (make up for)
    compete: конкури́ровать [i], соревнова́ться [i], состяза́ться [i], уча́ствовать [i] (enter a contest)
    compile: составля́ть [i] (a list), соста́вить [p] (a list), компили́ровать [i] (source code), скомпили́ровать [p] (source code), собира́ть [i] (put together)
    complete: заверша́ть [i] (finish), заверши́ть [p] (finish), заполня́ть [i] (a form), запо́лнить [p] (a form), зака́нчивать [i] (finish)
    complicate: усложня́ть [i], усложни́ть [p], осложня́ть [i], осложни́ть [p], запу́тываться [i] (get tangled up)
    compliment: хвали́ть [i], похвали́ть [p], льстить [i] (flatter), польсти́ть [p] (flatter)
    comply: соблюда́ть [i] (rules), соблюсти́ [p] (rules), выполня́ть [i] (a request), вы́полнить [p] (a request), подчиня́ться [i]
    compose: сочиня́ть [i] (music; a poem), сочини́ть [p] (music; a poem), составля́ть [i] (a text), соста́вить [p] (a text)
    comprise: состоя́ть [i] (consist of), включа́ть [i] (include), включи́ть [p] (include), составля́ть [i] (make up a share), соста́вить [p] (make up a share)
    compute: вычисля́ть [i], вычи́слить [p], счита́ть [i], посчита́ть [p], рассчи́тывать [i]
    conceal: скрыва́ть [i], скрыть [p], ута́ивать [i] (a fact), утаи́ть [p] (a fact), пря́тать [i]
    concede: признава́ть [i] (admit a point; admit defeat), призна́ть [p] (admit a point; admit defeat), уступа́ть [i] (give ground), уступи́ть [p] (give ground), допуска́ть [i] (grant)
    conceive: зачина́ть [i] (a child), зача́ть [p] (a child), приду́мывать [i] (devise an idea), приду́мать [p] (devise an idea), представля́ть [i] (imagine)
    conclude: заключа́ть [i] (a deal; infer), заключи́ть [p] (a deal; infer), зака́нчивать [i] (finish off), зако́нчить [p] (finish off), заверша́ть [i] (wrap up)
    condemn: осужда́ть [i], осуди́ть [p], пригова́ривать [i] (sentence), приговори́ть [p] (sentence), порица́ть [i]
    conduct: проводи́ть [i] (a study; a survey), провести́ [p] (a study; a survey), дирижи́ровать [i] (an orchestra), руководи́ть [i] (lead), вести́ [i] (guide)
    confess: признава́ться [i] (admit; to police), призна́ться [p] (admit; to police), испове́доваться [b] (to a priest), сознава́ться [i] (a crime), созна́ться [p] (a crime)
    configure: настра́ивать [i], настро́ить [p], конфигури́ровать [i], сконфигури́ровать [p]
    confirm: подтвержда́ть [i], подтверди́ть [p], утвержда́ть [i] (reaffirm), утверди́ть [p] (reaffirm)
    confront: противостоя́ть [i] (stand up to), ста́лкиваться [i] (face a problem), столкну́ться [p] (face a problem)
    confuse: пу́тать [i] (mix up), перепу́тать [p] (mix up two things), озада́чивать [i] (bewilder), озада́чить [p] (bewilder), запу́тываться [i] (be confused)
    congratulate: поздравля́ть [i], поздра́вить [p]
    connect: соединя́ть [i], соедини́ть [p], подключа́ть [i] (to a device), подключи́ть [p] (to a device), подключа́ться [i] (online)
    conquer: завоёвывать [i], завоева́ть [p], покоря́ть [i], покори́ть [p], одолева́ть [i] (overcome)
    consent: соглаша́ться [i], согласи́ться [p]
    conserve: сохраня́ть [i] (preserve), сохрани́ть [p] (preserve), эконо́мить [i] (save resources), сэконо́мить [p] (save resources), бере́чь [i] (protect nature)
    consider: рассма́тривать [i], рассмотре́ть [p], счита́ть [i] (regard as), обду́мывать [i] (think over), учи́тывать [i] (take into account)
    consist: состоя́ть [i] (consist of), заключа́ться [i] (consist in)
    console: утеша́ть [i], утеши́ть [p], успока́ивать [i] (comfort), успоко́ить [p] (comfort), ободря́ть [i] (encourage)
    consolidate: укрепля́ть [i] (strengthen), укрепи́ть [p] (strengthen), объединя́ть [i] (merge), объедини́ть [p] (merge), консолиди́ровать [b]
    conspire: сгова́риваться [i] (plot with others), сговори́ться [p] (plot with others), замышля́ть [i] (plot), замы́слить [p] (plot), злоумышля́ть [i] (plot against)
    constitute: составля́ть [i] (make up), соста́вить [p] (make up), образо́вывать [i], образова́ть [p], учрежда́ть [i] (establish)
    construct: стро́ить [i], постро́ить [p], сооружа́ть [i], соору́дить [p], конструи́ровать [i] (a system)
    consult: сове́товаться [i] (ask for advice), посове́товаться [p] (ask for advice), консульти́роваться [i] (an expert), проконсульти́роваться [p] (an expert), справля́ться [i] (look up in a book)
    consume: потребля́ть [i] (use up), потреби́ть [p] (use up), употребля́ть [i] (food, formal), есть [i] (eat), съесть [p] (eat)
    contact: свя́зываться [i] (get hold of), связа́ться [p] (get hold of), обраща́ться [i] (write to someone), обрати́ться [p] (write to someone), контакти́ровать [i]
    contain: содержа́ть [i] (hold as an ingredient), вмеща́ть [i] (hold people), вмести́ть [p] (hold people), сде́рживать [i] (hold back), сдержа́ть [p] (hold back)
    contemplate: размышля́ть [i] (think deeply), поразмышля́ть [p] (think deeply), созерца́ть [i] (gaze at), обду́мывать [i] (reflect on), медити́ровать [i] (meditate)
    contend: утвержда́ть [i] (maintain), боро́ться [i] (struggle), соревнова́ться [i] (compete), сопе́рничать [i] (compete), заявля́ть [i] (assert)
    continue: продолжа́ть [i] (carry on with), продо́лжить [p] (carry on with), продолжа́ться [i] (go on), продо́лжиться [p] (go on), дли́ться [i] (keep going)
    contradict: противоре́чить [i] (be inconsistent with), возража́ть [i] (argue against), возрази́ть [p] (argue against), опроверга́ть [i] (deny), опрове́ргнуть [p] (deny)
    contrast: противопоставля́ть [i] (set side by side), противопоста́вить [p] (set side by side), контрасти́ровать [i] (stand in contrast), отлича́ться [i] (differ)
    contribute: вноси́ть [i] (money), внести́ [p] (money), же́ртвовать [i] (donate), поже́ртвовать [p] (donate), спосо́бствовать [i] (help bring about)
    control: контроли́ровать [i], проконтроли́ровать [p], управля́ть [i] (a machine; a device), регули́ровать [i] (regulate), домини́ровать [i] (dominate)
    converge: сходи́ться [i] (meet at one point), слива́ться [i] (roads or rivers join), сли́ться [p] (roads or rivers join), сбега́ться [i] (gather at one point), сбежа́ться [p] (gather at one point)
    convert: переводи́ть [i] (units; money), перевести́ [p] (units; money), конверти́ровать [b] (currency; files), обраща́ть [i] (to a religion), обрати́ть [p] (to a religion)
    convey: передава́ть [i] (pass on a message), переда́ть [p] (pass on a message), выража́ть [i] (express), вы́разить [p] (express), доноси́ть [i] (get an idea across)
    convince: убежда́ть [i], убеди́ть [p], убежда́ться [i] (be convinced), убеди́ться [p] (be convinced)
    cook: гото́вить [i] (prepare food), пригото́вить [p] (prepare food), вари́ть [i] (rice), свари́ть [p] (rice), жа́рить [i] (fry)
    cool: охлажда́ть [i] (make cold), охлади́ть [p] (make cold), остыва́ть [i] (become cold), осты́ть [p] (become cold), остужа́ть [i] (let cool down)
    cooperate: сотру́дничать [i], взаимоде́йствовать [i], соде́йствовать [b]
    coordinate: координи́ровать [b], согласо́вывать [i] (align with others), согласова́ть [p] (align with others), организова́ть [b] (organize a group)
    cope: справля́ться [i] (manage), спра́виться [p] (manage), пережива́ть [i] (get through), пережи́ть [p] (get through), преодолева́ть [i] (deal with)
    copy: копи́ровать [i], скопи́ровать [p], спи́сывать [i] (by hand), списа́ть [p] (by hand), подража́ть [i] (imitate)
    correct: исправля́ть [i] (fix an error), испра́вить [p] (fix an error), поправля́ть [i] (a statement), попра́вить [p] (a statement), корректи́ровать [i] (revise)
    correspond: соотве́тствовать [i] (match), перепи́сываться [i] (exchange letters), переписа́ться [p] (exchange letters), совпада́ть [i] (agree), совпа́сть [p] (agree)
    corrupt: развраща́ть [i] (morally), разврати́ть [p] (morally), подкупа́ть [i] (bribe), подкупи́ть [p] (bribe), поврежда́ть [i] (data)
    cost: сто́ить [i] (money or time), тре́бовать [i] (require), потре́бовать [p] (require), обходи́ться [i] (take money or time)
    cough: ка́шлять [i], ка́шлянуть [p], отка́шливаться [i] (clear the throat), отка́шляться [p] (clear the throat)
    counsel: сове́товать [i], посове́товать [p], консульти́ровать [i], проконсульти́ровать [p]
    count: счита́ть [i], посчита́ть [p], подсчи́тывать [i] (add up), подсчита́ть [p] (add up), рассчи́тывать [i] (count on)
    counterfeit: подде́лывать [i], подде́лать [p], фальсифици́ровать [b]
    court: уха́живать [i] (chase after), добива́ться [i] (the favor of), льстить [i] (flatter)
    cover: накрыва́ть [i] (with a blanket), накры́ть [p] (with a blanket), покрыва́ть [i] (costs), покры́ть [p] (costs), освеща́ть [i] (a topic)
    crack: тре́скаться [i] (develop cracks), тре́снуть [p] (develop cracks), раска́лывать [i] (a nut), расколо́ть [p] (a nut), взла́мывать [i] (crack a code)
    crash: разбива́ться [i] (a plane), разби́ться [p] (a plane), зависа́ть [i] (a computer), зави́снуть [p] (a computer), вреза́ться [i] (smash into)
    crave: жа́ждать [i] (long for), жела́ть [i], тоскова́ть [i] (long for), мечта́ть [i]
    crawl: по́лзать [i] (like a baby), ползти́ [i] (move on the belly), поползти́ [p] (move on the belly)
    create: создава́ть [i] (a file or document), созда́ть [p] (a file or document), твори́ть [i], сотвори́ть [p], порожда́ть [i]
    credit: зачисля́ть [i] (to an account), зачи́слить [p] (to an account), засчи́тывать [i] (count towards), засчита́ть [p] (count towards), кредитова́ть [b] (an amount)
    criticize: критикова́ть [i], раскритикова́ть [p], руга́ть [i] (speak ill of), осужда́ть [i], рецензи́ровать [i] (review)
    cross: пересека́ть [i] (a region), пересе́чь [p] (a region), переходи́ть [i] (a street), перейти́ [p] (a street), переправля́ться [i] (cross over)
    crush: дави́ть [i] (squash), раздави́ть [p] (squash), дроби́ть [i] (grind to pieces), раздроби́ть [p] (grind to pieces), разгроми́ть [p] (overwhelm)
    cry: пла́кать [i] (weep), запла́кать [p] (weep), крича́ть [i] (shout), кри́кнуть [p] (shout), рыда́ть [i] (weep)
    cultivate: выра́щивать [i] (crops), вы́растить [p] (crops), обраба́тывать [i] (land), обрабо́тать [p] (land), культиви́ровать [i] (develop a quality)
    cure: лечи́ть [i], вы́лечить [p], выздора́вливать [i] (get well), вы́здороветь [p] (get well), соли́ть [i] (preserve meat)
    curl: завива́ть [i] (hair), зави́ть [p] (hair), ви́ться [i] (hair), скру́чивать [i] (roll up), скрути́ть [p] (roll up)
    curse: проклина́ть [i] (put a curse on), прокля́сть [p] (put a curse on), руга́ться [i] (swear), руга́ть [i] (swear at), чертыха́ться [i] (swear)
    cushion: смягча́ть [i] (soften a blow), смягчи́ть [p] (soften a blow), амортизи́ровать [b] (absorb a shock), облегча́ть [i] (ease), облегчи́ть [p] (ease)
    customize: настра́ивать [i] (tailor to needs), настро́ить [p] (tailor to needs), персонализи́ровать [b], адапти́ровать [b]
    cut: ре́зать [i] (with a knife), разре́зать [p] (cut in two), стричь [i] (hair), подстри́чь [p] (hair), сокраща́ть [i] (reduce)
    cut off: отреза́ть [i] (detach), отре́зать [p] (detach), отруба́ть [i] (chop off), отключа́ть [i] (a supply), отключи́ть [p] (a supply)
    damage: поврежда́ть [i] (harm), повреди́ть [p] (harm), вреди́ть [i] (be harmful), навреди́ть [p] (be harmful), по́ртить [i]
    dance: танцева́ть [i], потанцева́ть [p], станцева́ть [p] (a dance), пляса́ть [i]
    dare: сметь [i] (dare to do), посме́ть [p] (dare to do), осме́ливаться [i], осме́литься [p], отва́живаться [i] (brave a risk)
    darken: темне́ть [i] (grow dim), потемне́ть [p] (grow dim), затемня́ть [i] (stage lights), затемни́ть [p] (stage lights), мрачне́ть [i] (cloud over)
    darn: што́пать [i] (mend socks), зашто́пать [p] (mend socks), лата́ть [i] (patch), залата́ть [p] (patch)
    dash: бежа́ть [i], побежа́ть [p], мча́ться [i], помча́ться [p], торопи́ться [i] (hurry)
    dazzle: ослепля́ть [i], ослепи́ть [p], ошеломля́ть [i] (bewilder), ошеломи́ть [p] (bewilder), поража́ть [i] (overwhelm)
    deal: занима́ться [i] (deal with a matter), заня́ться [p] (deal with a matter), справля́ться [i] (cope with), торгова́ть [i] (trade in goods), раздава́ть [i] (cards)
    debate: обсужда́ть [i] (discuss in detail), обсуди́ть [p] (discuss in detail), дискути́ровать [i], спо́рить [i]
    debug: отла́живать [i], отла́дить [p]
    decay: гнить [i] (rot), сгнить [p] (rot), разлага́ться [i] (break down), разложи́ться [p] (break down), по́ртиться [i] (deteriorate)
    deceive: обма́нывать [i], обману́ть [p], надува́ть [i] (informal), наду́ть [p] (informal)
    decide: реша́ть [i] (resolve to do), реши́ть [p] (resolve to do), реша́ться [i] (make up one's mind), реши́ться [p] (make up one's mind)
    decipher: расшифро́вывать [i], расшифрова́ть [p], разга́дывать [i], разгада́ть [p]
    declare: объявля́ть [i] (proclaim), объяви́ть [p] (proclaim), заявля́ть [i] (state), заяви́ть [p] (state), деклари́ровать [b] (to customs or tax)
    decline: отка́зываться [i] (refuse), отказа́ться [p] (refuse), отклоня́ть [i] (turn down), отклони́ть [p] (turn down), снижа́ться [i] (go down)
    decorate: украша́ть [i], укра́сить [p], оформля́ть [i], оформи́ть [p], декори́ровать [b]
    decrease: уменьша́ть [i] (make less), уме́ньшить [p] (make less), уменьша́ться [i] (get less), снижа́ть [i] (reduce), сни́зить [p] (reduce)
    decrypt: расшифро́вывать [i], расшифрова́ть [p], раскодирова́ть [p] (decode)
    dedicate: посвяща́ть [i] (a book; a work), посвяти́ть [p] (a book; a work), уделя́ть [i] (devote time), удели́ть [p] (devote time), освяща́ть [i] (consecrate)
    deduct: вычита́ть [i] (subtract), вы́честь [p] (subtract), уде́рживать [i] (for tax), удержа́ть [p] (for tax)
    deem: счита́ть [i], посчита́ть [p], признава́ть [i] (consider as), призна́ть [p] (consider as), полага́ть [i] (formal)
    defeat: побежда́ть [i], победи́ть [p], одолева́ть [i], одоле́ть [p], разгроми́ть [p] (crush)
    defend: защища́ть [i], защити́ть [p], оборо́нять [i] (protect), отста́ивать [i], отстоя́ть [p]
    defer: откла́дывать [i] (postpone), отложи́ть [p] (postpone), отсро́чивать [i] (put off), отсро́чить [p] (put off), уступа́ть [i] (defer to someone)
    define: определя́ть [i], определи́ть [p], формули́ровать [i], сформули́ровать [p]
    deflect: отклоня́ть [i] (turn aside), отклони́ть [p] (turn aside), отража́ть [i] (bounce back), отрази́ть [p] (bounce back), отводи́ть [i] (ward off)
    degrade: унижа́ть [i] (humiliate), уни́зить [p] (humiliate), понижа́ть [i] (demote), пони́зить [p] (demote), ухудша́ть [i] (make worse)
    delay: заде́рживать [i] (hold up), задержа́ть [p] (hold up), откла́дывать [i] (postpone), отложи́ть [p] (postpone), опа́здывать [i] (be late)
    delegate: делеги́ровать [b], поруча́ть [i], поручи́ть [p], посыла́ть [i] (send as a representative), посла́ть [p] (send as a representative)
    delete: удаля́ть [i], удали́ть [p], стира́ть [i], стере́ть [p], вычёркивать [i] (cross out)
    deliberate: обду́мывать [i] (think carefully), обду́мать [p] (think carefully), совеща́ться [i] (confer), посове́щаться [p] (confer), обсужда́ть [i] (in a committee)
    delight: ра́довать [i] (make happy), обра́довать [p] (make happy), восхища́ть [i] (delight), восхити́ть [p] (delight), восхища́ться [i] (be delighted)
    deliver: доставля́ть [i] (goods), доста́вить [p] (goods), разноси́ть [i] (post, parcels), вруча́ть [i] (hand over), произноси́ть [i] (a speech)
    demand: тре́бовать [i], потре́бовать [p], настаива́ть [i] (insist on), настоя́ть [p] (insist on)
    demolish: разруша́ть [i], разру́шить [p], сноси́ть [i] (a building), снести́ [p] (a building)
    demonstrate: демонстри́ровать [b], пока́зывать [i] (show how something works), показа́ть [p] (show how something works), дока́зывать [i] (prove), доказа́ть [p] (prove)
    denote: означа́ть [i], озна́чить [p], обознача́ть [i], обозна́чить [p]
    denounce: осужда́ть [i] (condemn publicly), осуди́ть [p] (condemn publicly), доноси́ть [i] (report to the authorities), донести́ [p] (report to the authorities), разоблача́ть [i] (expose)
    deny: отрица́ть [i], опроверга́ть [i] (say it is not true), опрове́ргнуть [p] (say it is not true), отка́зывать [i] (refuse to give), отказа́ть [p] (refuse to give)
    depend: зави́сеть [i] (on something), полага́ться [i] (rely on), положи́ться [p] (rely on), рассчи́тывать [i] (rely on)
    deploy: развёртывать [i] (troops; software), разверну́ть [p] (troops; software), размеща́ть [i] (position), размести́ть [p] (position), внедря́ть [i] (software)
    deport: депорти́ровать [b], высыла́ть [i] (expel), вы́слать [p] (expel), выдворя́ть [i], вы́дворить [p]
    deposit: вноси́ть [i] (pay money in), внести́ [p] (pay money in), вкла́дывать [i] (in a bank), вложи́ть [p] (in a bank), класть [i] (leave for safekeeping)
    deprive: лиша́ть [i] (of a thing), лиши́ть [p] (of a thing), отнима́ть [i] (take away), отня́ть [p] (take away)
    derive: извлека́ть [i] (obtain from), извле́чь [p] (obtain from), происходи́ть [i] (come from), выводи́ть [i] (work out a result), вы́вести [p] (work out a result)
    descend: спуска́ться [i] (go down), спусти́ться [p] (go down), сходи́ть [i] (go down or get off), сойти́ [p] (go down or get off), снижа́ться [i] (from the air)
    describe: опи́сывать [i], описа́ть [p], изобража́ть [i] (depict), изобрази́ть [p] (depict), характеризова́ть [b] (state)
    deserve: заслу́живать [i], заслужи́ть [p]
    design: проекти́ровать [i] (engineer), спроекти́ровать [p] (engineer), разраба́тывать [i] (devise), разрабо́тать [p] (devise), конструи́ровать [i]
    designate: назнача́ть [i] (appoint), назна́чить [p] (appoint), обознача́ть [i] (name), обозна́чить [p] (name), определя́ть [i] (a person)
    desire: жела́ть [i] (wish for), пожела́ть [p] (wish for), хоте́ть [i] (want), захоте́ть [p] (want), мечта́ть [i] (hope for)
    despise: презира́ть [i], презре́ть [p], гнуша́ться [i]
    destroy: разруша́ть [i], разру́шить [p], уничтожа́ть [i] (annihilate), уничто́жить [p] (annihilate), губи́ть [i] (ruin)
    detect: обнару́живать [i], обнару́жить [p], выявля́ть [i] (find by testing), вы́явить [p] (find by testing), замеча́ть [i] (notice)
    deteriorate: ухудша́ться [i] (get worse), уху́дшиться [p] (get worse), по́ртиться [i] (quality), испо́ртиться [p] (quality)
    determine: определя́ть [i], определи́ть [p], устана́вливать [i] (find out), установи́ть [p] (find out), реша́ть [i] (decide)
    detest: ненави́деть [i] (hate), возненави́деть [p] (hate), презира́ть [i] (loathe)
    devastate: опустоша́ть [i] (ravage), опустоши́ть [p] (ravage), разоря́ть [i] (ravage), разори́ть [p] (ravage), потряса́ть [i] (emotionally)
    develop: развива́ть [i] (expand), разви́ть [p] (expand), развива́ться [i] (grow), разраба́тывать [i] (a product), проявля́ть [i] (photos)
    deviate: отклоня́ться [i] (stray), отклони́ться [p] (stray), отступа́ть [i] (depart from a norm), отступи́ть [p] (depart from a norm), отвлека́ться [i] (digress)
    devour: пожира́ть [i] (of animals), съеда́ть [i] (eat up), съесть [p] (eat up), глота́ть [i] (books), проглоти́ть [p] (books)
    diagnose: диагности́ровать [b] (a condition), распознава́ть [i] (a condition), распозна́ть [p] (a condition)
    dial: набира́ть [i] (a phone number), набра́ть [p] (a phone number), звони́ть [i] (a phone call), позвони́ть [p] (a phone call)
    dictate: диктова́ть [i] (say aloud for writing down), продиктова́ть [p] (say aloud for writing down), предпи́сывать [i] (prescribe; order), предписа́ть [p] (prescribe; order), определя́ть [i] (determine)
    die: умира́ть [i], умере́ть [p], погиба́ть [i] (perish), поги́бнуть [p] (perish), околе́ть [p] (of animals)
    differ: отлича́ться [i], различа́ться [i], расходи́ться [i] (of opinions)
    dig: копа́ть [i] (dig a hole), вы́копать [p] (dig a hole), рыть [i] (dig a hole), раска́пывать [i] (unearth; dig up), раскопа́ть [p] (unearth; dig up)
    digest: перева́ривать [i] (food or information), перевари́ть [p] (food or information), усва́ивать [i] (information), усво́ить [p] (information), резюми́ровать [b] (summarize)
    dilute: разбавля́ть [i] (dilute a drink), разба́вить [p] (dilute a drink), разводи́ть [i] (mix into liquid), развести́ [p] (mix into liquid)
    dim: приглуша́ть [i] (dim lights; lower), приглуши́ть [p] (dim lights; lower), тускне́ть [i] (grow dim; fade), потускне́ть [p] (grow dim; fade)
    diminish: уменьша́ть [i] (make smaller), уме́ньшить [p] (make smaller), уменьша́ться [i] (dwindle; shrink), уме́ньшиться [p] (dwindle; shrink), ослабева́ть [i] (get weaker)
    dine: у́жинать [i] (have dinner), поу́жинать [p] (have dinner), обе́дать [i] (have a meal; dine with others), пообе́дать [p] (have a meal; dine with others)
    direct: направля́ть [i] (aim; point), напра́вить [p] (aim; point), руководи́ть [i] (lead), ста́вить [i] (a film or play), поста́вить [p] (a film or play)
    disable: отключа́ть [i] (turn off a function), отключи́ть [p] (turn off a function), выключа́ть [i] (turn off a function), вы́ключить [p] (turn off a function), парализова́ть [b] (cripple a system)
    disagree: возража́ть [i] (contradict someone), возрази́ть [p] (contradict someone), противоре́чить [i] (contradict someone; not match), расходи́ться [i] (of opinions)
    disappear: исчеза́ть [i], исче́знуть [p], пропада́ть [i] (be lost; go missing), пропа́сть [p] (be lost; go missing)
    disappoint: разочаро́вывать [i] (let down), разочарова́ть [p] (let down), подводи́ть [i] (let down), подвести́ [p] (let down), разочарова́ться [p] (be disappointed)
    disarm: разоружа́ть [i] (a person; a country), разоружи́ть [p] (a person; a country), разоружа́ться [i] (reduce weapons), обезвре́живать [i] (a bomb), обезвре́дить [p] (a bomb)
    discard: выбра́сывать [i] (get rid of), вы́бросить [p] (get rid of), отбра́сывать [i] (reject an idea), отбро́сить [p] (reject an idea), отверга́ть [i] (reject an idea)
    discharge: разряжа́ть [i] (a battery), увольня́ть [i] (dismiss from a job), уво́лить [p] (dismiss from a job), выпи́сывать [i] (a patient), вы́писать [p] (a patient)
    disclose: раскрыва́ть [i] (make public; reveal), раскры́ть [p] (make public; reveal), разглаша́ть [i] (give away a secret), разгласи́ть [p] (give away a secret)
    disconnect: отключа́ть [i] (cut off power), отключи́ть [p] (cut off power), отсоединя́ть [i] (a wire; unplug), отсоедини́ть [p] (a wire; unplug)
    discourage: обескура́живать [i] (dampen spirit), обескура́жить [p] (dampen spirit), отгова́ривать [i] (talk out of; dissuade), отговори́ть [p] (talk out of; dissuade), препя́тствовать [i] (hinder)
    discover: открыва́ть [i], откры́ть [p], обнару́живать [i] (find out), обнару́жить [p] (find out), узна́ть [p] (learn)
    discredit: дискредити́ровать [b] (damage a reputation), очерня́ть [i] (run down; slander), очерни́ть [p] (run down; slander), клевета́ть [i] (slander), оклевета́ть [p] (slander)
    discuss: обсужда́ть [i] (talk over), обсуди́ть [p] (talk over), дискути́ровать [i] (debate), рассма́тривать [i] (treat a subject), рассмотре́ть [p] (treat a subject)
    disguise: маскирова́ть [i] (camouflage), замаскирова́ть [p] (camouflage), скрыва́ть [i] (hide the truth), скрыть [p] (hide the truth), переодева́ться [i] (change one's appearance)
    disgust: отта́лкивать [i] (repel), оттолкну́ть [p] (repel), прети́ть [i] (disgust), брезгова́ть [i] (feel revulsion at), надоеда́ть [i] (make fed up)
    disinfect: дезинфици́ровать [b], обеззара́живать [i], обеззара́зить [p]
    dismantle: разбира́ть [i] (take apart), разобра́ть [p] (take apart), демонти́ровать [b] (take down; remove), снима́ть [i] (take down), снять [p] (take down)
    dismiss: увольня́ть [i] (fire an employee), уво́лить [p] (fire an employee), отклоня́ть [i] (reject a claim or appeal), отклони́ть [p] (reject a claim or appeal), отмахну́ться [p] (brush aside)
    dispatch: отправля́ть [i] (send goods; send a person), отпра́вить [p] (send goods; send a person), посыла́ть [i] (send people), посла́ть [p] (send people), отгружа́ть [i] (process for shipping)
    dispense: выдава́ть [i] (hand out; medicine), вы́дать [p] (hand out; medicine), отмеря́ть [i] (measure out), отме́рить [p] (measure out), обходи́ться [i] (dispense with)
    disperse: разгоня́ть [i] (a crowd), разогна́ть [p] (a crowd), рассе́ивать [i] (scatter), рассе́ять [p] (scatter), расходи́ться [i] (be scattered; spread out)
    displace: вытесня́ть [i] (push aside; replace; drive out), вы́теснить [p] (push aside; replace; drive out), перемеща́ть [i] (shift), перемести́ть [p] (shift), выселя́ть [i] (from home)
    display: пока́зывать [i] (show), показа́ть [p] (show), выставля́ть [i] (exhibit), вы́ставить [p] (exhibit), отобража́ть [i] (on a screen)
    disprove: опроверга́ть [i], опрове́ргнуть [p]
    dispute: спо́рить [i] (quarrel), поспо́рить [p] (quarrel), оспа́ривать [i] (contest a claim), оспо́рить [p] (contest a claim), отрица́ть [i] (deny)
    distinguish: различа́ть [i] (make out; recognize by sight), различи́ть [p] (make out; recognize by sight), отлича́ть [i] (tell apart), отличи́ть [p] (tell apart), распознава́ть [i] (identify)
    distort: искажа́ть [i] (misrepresent), искази́ть [p] (misrepresent), извраща́ть [i] (twist), изврати́ть [p] (twist), деформи́ровать [b] (twist out of shape)
    distract: отвлека́ть [i] (turn attention away), отвле́чь [p] (turn attention away), развлека́ть [i] (divert the mind), развле́чь [p] (divert the mind), меша́ть [i] (disturb)
    distribute: распределя́ть [i] (divide up), распредели́ть [p] (divide up), раздава́ть [i] (hand out), разда́ть [p] (hand out), распространя́ть [i] (sell goods)
    disturb: беспоко́ить [i] (worry; upset), побеспоко́ить [p] (worry; upset), меша́ть [i] (interrupt; hinder), помеша́ть [p] (interrupt; hinder), наруша́ть [i] (upset order or calm)
    dive: ныря́ть [i] (jump in head first), нырну́ть [p] (jump in head first), погружа́ться [i] (go underwater), погрузи́ться [p] (go underwater)
    diversify: диверсифици́ровать [b] (risk, investments), расширя́ть [i] (a business), расши́рить [p] (a business), распределя́ть [i] (spread risk)
    divide: дели́ть [i] (in math; split into parts), подели́ть [p] (in math; split into parts), разделя́ть [i] (separate; split in two), раздели́ть [p] (separate; split in two)
    divorce: разводи́ться [i] (dissolve a marriage), расходи́ться [i] (separate), расстава́ться [i] (separate), расста́ться [p] (separate)
    do: де́лать [i], сде́лать [p], выполня́ть [i] (carry out; perform), вы́полнить [p] (carry out; perform), занима́ться [i] (be engaged in)
    document: документи́ровать [b] (support with evidence), протоколи́ровать [b] (minutes), фикси́ровать [i] (put in writing), зафикси́ровать [p] (put in writing), подтвержда́ть [i] (support with evidence)
    dodge: уклоня́ться [i] (evade; get out of), уклони́ться [p] (evade; get out of), увора́чиваться [i] (dodge a blow), уверну́ться [p] (dodge a blow), избега́ть [i] (escape)
    dominate: домини́ровать [i], госпо́дствовать [i] (rule over), преоблада́ть [i] (overwhelm), контроли́ровать [i] (control), возвыша́ться [i] (tower over)
    donate: же́ртвовать [i] (money), поже́ртвовать [p] (money), дари́ть [i] (goods or books), подари́ть [p] (goods or books), сдава́ть [i] (blood)
    double: удва́ивать [i] (make double), удво́ить [p] (make double), удва́иваться [i] (become doubled), удво́иться [p] (become doubled)
    doubt: сомнева́ться [i], усомни́ться [p]
    download: ска́чивать [i], скача́ть [p], загружа́ть [i], загрузи́ть [p]
    draft: составля́ть [i] (a document; a bill), соста́вить [p] (a document; a bill), наброса́ть [p] (make a rough copy), призыва́ть [i] (military), призва́ть [p] (military)
    drag: тащи́ть [i] (pull roughly), потащи́ть [p] (pull roughly), волочи́ть [i] (along the ground), перета́скивать [i] (with a mouse), перетащи́ть [p] (with a mouse)
    drain: осуша́ть [i] (drain water), осуши́ть [p] (drain water), слива́ть [i] (let liquid out), слить [p] (let liquid out), истоща́ть [i] (deplete)
    draw: рисова́ть [i] (sketch; a picture), нарисова́ть [p] (sketch; a picture), тяну́ть [i] (pull), вытя́гивать [i] (a card or lot), вы́тянуть [p] (a card or lot)
    dread: боя́ться [i] (fear a bad outcome), побоя́ться [p] (fear a bad outcome), опаса́ться [i] (be afraid of), страши́ться [i] (shrink from)
    dream: мечта́ть [i] (dream or hope; long for), помечта́ть [p] (dream or hope; long for), сни́ться [i] (in sleep), присни́ться [p] (in sleep), гре́зить [i] (daydream)
    dress: одева́ться [i] (put clothes on; dress up), оде́ться [p] (put clothes on; dress up), одева́ть [i] (dress someone), надева́ть [i] (put on clothes; wear), перевя́зывать [i] (a wound)
    dribble: вести́ [i] (a ball), ка́пать [i] (drip; trickle), ка́пнуть [p] (drip; let drip), сочи́ться [i] (trickle)
    drift: дрейфова́ть [i] (float along; be adrift at sea), плыть [i] (float along), блужда́ть [i] (wander), отклоня́ться [i] (off course)
    drill: сверли́ть [i] (bore a hole), просверли́ть [p] (bore a hole), бури́ть [i] (drill into the earth; oil), тренирова́ть [i] (train hard), муштрова́ть [i] (train hard)
    drink: пить [i], вы́пить [p], выпива́ть [i] (drink up), пья́нствовать [i] (heavily)
    drip: ка́пать [i] (fall in drops), ка́пнуть [p] (fall in drops), сочи́ться [i] (trickle), течь [i] (leak), стека́ть [i] (trickle)
    drive: води́ть [i] (a vehicle), вести́ [i] (a vehicle), управля́ть [i] (steer or pilot), гнать [i] (drive animals), е́здить [i] (go by car)
    drizzle: мороси́ть [i] (rain lightly), накра́пывать [i] (rain lightly), полива́ть [i] (food with a liquid), поли́ть [p] (food with a liquid), бры́згать [i] (sprinkle liquid)
    drop: роня́ть [i] (let fall), урони́ть [p] (let fall), па́дать [i] (fall down), упа́сть [p] (fall down), выса́живать [i] (drop off a passenger)
    drown: тону́ть [i] (die in water), утону́ть [p] (die in water), топи́ть [i] (kill by drowning), утопи́ть [p] (kill by drowning), заглуша́ть [i] (drown out a sound)
    dry: суши́ть [i] (make dry), вы́сушить [p] (make dry), со́хнуть [i] (become dry), вы́сохнуть [p] (become dry), вытира́ть [i] (wipe dry)
    dump: выбра́сывать [i] (throw away), вы́бросить [p] (throw away), высыпа́ть [i] (tip out), вы́сыпать [p] (tip out), вылива́ть [i] (pour out)
    duplicate: копи́ровать [i], скопи́ровать [p], дубли́ровать [b] (overlap or repeat), размножа́ть [i] (reproduce), размно́жить [p] (reproduce)
    dwell: жить [i] (live in a place), обита́ть [i] (inhabit), прожива́ть [i] (formal), остана́вливаться [i] (dwell on a thought), останови́ться [p] (dwell on a thought)
    dye: кра́сить [i], покра́сить [p], окра́шивать [i], окра́сить [p], подкра́шивать [i] (tint)
    earn: зараба́тывать [i] (earn money), зарабо́тать [p] (earn money), заслу́живать [i] (respect or a right), заслужи́ть [p] (respect or a right)
    ease: облегча́ть [i] (relieve; alleviate), облегчи́ть [p] (relieve; alleviate), смягча́ть [i] (soften pain), смягчи́ть [p] (soften pain), ослабля́ть [i] (loosen)
    eat: есть [i], съесть [p], куша́ть [i] (have a meal), пое́сть [p] (have a meal), жрать [i] (of animals; rough speech)
    echo: отдава́ться [i] (linger as an echo), раздава́ться [i] (resound), разда́ться [p] (resound), вто́рить [i] (echo back), повторя́ть [i] (repeat someone's words)
    edit: редакти́ровать [i] (revise; proofread), отредакти́ровать [p] (revise; proofread), монти́ровать [i] (a film or video), смонти́ровать [p] (a film or video), пра́вить [i] (proofread)
    educate: обуча́ть [i] (teach; provide schooling), обучи́ть [p] (teach), воспи́тывать [i] (bring up), воспита́ть [p] (bring up), просвеща́ть [i] (enlighten)
    elaborate: разраба́тывать [i] (work out a plan), разрабо́тать [p] (work out a plan), развива́ть [i] (expand on a point), разви́ть [p] (expand on a point), уточня́ть [i] (explain in detail)
    elapse: проходи́ть [i] (time passes; go by), пройти́ [p] (time passes; go by), истека́ть [i] (run out), исте́чь [p] (run out), протека́ть [i] (formal)
    elect: избира́ть [i] (choose by vote), избра́ть [p] (choose by vote), выбира́ть [i] (choose), вы́брать [p] (choose)
    elevate: поднима́ть [i] (lift up; raise), подня́ть [p] (lift up; raise), повыша́ть [i] (raise a level; promote), повы́сить [p] (raise a level; promote), возвыша́ть [i] (to a higher status)
    eliminate: устраня́ть [i] (get rid of; remove), устрани́ть [p] (get rid of; remove), исключа́ть [i] (rule out), исключи́ть [p] (rule out), ликвиди́ровать [b] (remove formally)
    elude: ускольза́ть [i] (slip away; escape notice), ускользну́ть [p] (slip away; escape notice), избега́ть [i] (avoid), избежа́ть [p] (avoid), уклоня́ться [i] (evade)
    email: отправля́ть [i] (send by email), отпра́вить [p] (send by email), писа́ть [i] (send a message), написа́ть [p] (send a message), посыла́ть [i] (send an email)
    embark: сади́ться [i] (board), сесть [p] (board), приступа́ть [i] (embark on an endeavour; begin a project), приступи́ть [p] (embark on an endeavour; begin a project), отправля́ться [i] (set out)
    embed: встра́ивать [i] (build into a system; build in), встро́ить [p] (build into a system; build in), внедря́ть [i] (embed), внедри́ть [p] (embed), вставля́ть [i] (set into a surface)
    embrace: обнима́ть [i] (hug tight), обня́ть [p] (hug tight), обнима́ться [i] (hug each other), принима́ть [i] (adopt an idea), приня́ть [p] (adopt an idea)
    embroider: вышива́ть [i], вы́шить [p], приукра́шивать [i] (embellish), приукра́сить [p] (embellish)
    emerge: появля́ться [i] (appear; come up into view), появи́ться [p] (appear; come up into view), возника́ть [i] (arise; come to light), возни́кнуть [p] (arise; come to light), всплыва́ть [i] (come up into view)
    emit: излуча́ть [i] (light or heat; energy), испуска́ть [i] (give off; release), испусти́ть [p] (give off; release), выбра́сывать [i] (gases; smoke), издава́ть [i] (a signal; sound)
    emphasize: подчёркивать [i], подчеркну́ть [p], выделя́ть [i] (highlight), вы́делить [p] (highlight), акценти́ровать [b] (stress an argument)
    employ: нанима́ть [i] (hire; give work to), наня́ть [p] (hire; give work to), использова́ть [b] (use), применя́ть [i] (use), примени́ть [p] (use)
    empower: уполномо́чивать [i] (authorize), уполномо́чить [p] (authorize), наделя́ть [i] (give authority to), наде́лить [p] (give authority to), укрепля́ть [i] (strengthen)
    empty: опорожня́ть [i] (empty a container), опорожни́ть [p] (empty a container), освобожда́ть [i] (vacate), пусте́ть [i] (become empty), опусте́ть [p] (become empty)
    enable: позволя́ть [i] (allow), позво́лить [p] (allow), разреша́ть [i] (allow), включа́ть [i] (turn on a feature), включи́ть [p] (turn on a feature)
    enact: принима́ть [i] (a law), приня́ть [p] (a law), издава́ть [i] (a law), изда́ть [p] (a law), вводи́ть [i] (put in force)
    enchant: очаро́вывать [i], очарова́ть [p], околдо́вывать [i] (cast a spell), околдова́ть [p] (cast a spell), пленя́ть [i] (charm)
    encircle: окружа́ть [i], окружи́ть [p], обступа́ть [i] (crowd around), обступи́ть [p] (crowd around), опоя́сывать [i] (gird)
    encounter: встреча́ть [i], встре́тить [p], ста́лкиваться [i] (run into a problem), столкну́ться [p] (run into a problem), натыка́ться [i] (come across)
    encourage: поощря́ть [i], поощри́ть [p], подба́дривать [i] (cheer up), подбодри́ть [p] (cheer up), спосо́бствовать [i] (promote; a practice)
    encrypt: шифрова́ть [i], зашифрова́ть [p], кодирова́ть [i], закодирова́ть [p]
    end: зака́нчивать [i] (bring to an end), зако́нчить [p] (bring to an end), зака́нчиваться [i] (come to an end), зако́нчиться [p] (come to an end), прекраща́ть [i] (bring to an end; stop)
    endorse: одобря́ть [i] (approve), одо́брить [p] (approve), подде́рживать [i] (support), поддержа́ть [p] (support), рекомендова́ть [i] (a product)
    endure: терпе́ть [i], потерпе́ть [p], переноси́ть [i] (bear), выде́рживать [i] (hold out), вы́держать [p] (hold out)
    energize: бодри́ть [i], взбодри́ть [p], заряжа́ть [i] (give energy), заряди́ть [p] (give energy), оживля́ть [i] (liven up)
    enforce: применя́ть [i] (a law), примени́ть [p] (a law), заставля́ть [i] (compel), заста́вить [p] (compel), принужда́ть [i] (compel)
    engage: нанима́ть [i] (hire), наня́ть [p] (hire), вовлека́ть [i] (involve), вовле́чь [p] (involve), привлека́ть [i] (involve; engage attention)
    engrave: гравирова́ть [i], выгравирова́ть [p], выреза́ть [i] (carve), вы́резать [p] (carve), выцара́пывать [i] (scratch in)
    enhance: улучша́ть [i], улу́чшить [p], уси́ливать [i] (strengthen), уси́лить [p] (strengthen), повыша́ть [i] (raise)
    enjoy: наслажда́ться [i], наслади́ться [p], по́льзоваться [i] (enjoy a benefit), радова́ться [i] (take delight in)
    enlarge: увели́чивать [i], увели́чить [p], расширя́ть [i], расши́рить [p]
    enlist: вербова́ть [i] (recruit), завербова́ть [p] (recruit), набира́ть [i] (recruit), вступа́ть [i] (join the military), вступи́ть [p] (join the military)
    enrage: злить [i], разозли́ть [p], беси́ть [i], взбеси́ть [p], разъяри́ть [p] (infuriate)
    enrich: обогаща́ть [i] (enrich the mind; enrich uranium), обогати́ть [p] (enrich the mind; enrich uranium), насыща́ть [i] (saturate), насы́тить [p] (saturate)
    enroll: запи́сываться [i] (sign up), записа́ться [p] (sign up), зачисля́ть [i] (admit to a school), зачи́слить [p] (admit to a school), поступа́ть [i] (enter a school)
    ensure: обеспе́чивать [i], обеспе́чить [p], гаранти́ровать [b], убежда́ться [i] (make sure), убеди́ться [p] (make sure)
    entail: влечь [i] (carry as a consequence), повле́чь [p] (carry as a consequence), тре́бовать [i] (require), потре́бовать [p] (require), подразумева́ть [i] (involve; imply)
    entangle: запу́тывать [i] (tangle), запу́тать [p] (tangle), запу́тываться [i] (get entangled), запу́таться [p] (get entangled), впу́тывать [i] (drag into)
    enter: входи́ть [i] (go in; come in), войти́ [p] (go in; come in), вводи́ть [i] (data; type in data), ввести́ [p] (data; type in data), вноси́ть [i] (enter data)
    entertain: развлека́ть [i] (amuse), развле́чь [p] (amuse), принима́ть [i] (host guests), угоща́ть [i] (host guests; clients), угости́ть [p] (host guests; clients)
    entrust: поруча́ть [i] (with a task), поручи́ть [p] (with a task), доверя́ть [i] (confide), дове́рить [p] (confide), вверя́ть [i] (formal)
    envision: представля́ть [i] (imagine), предста́вить [p] (imagine), вообража́ть [i] (imagine), вообрази́ть [p] (imagine), предви́деть [i] (foresee)
    envy: зави́довать [i], позави́довать [p]
    equip: оснаща́ть [i], осна́стить [p], снаряжа́ть [i], снаряди́ть [p], обору́довать [b]
    erase: стира́ть [i], стере́ть [p], удаля́ть [i] (delete data), удали́ть [p] (delete data)
    err: ошиба́ться [i] (be wrong), ошиби́ться [p] (be wrong), заблужда́ться [i] (be wrong), греши́ть [i] (sin), согреши́ть [p] (sin)
    escalate: обостря́ть [i] (intensify), обостри́ть [p] (intensify), обостря́ться [i] (of a conflict), обостри́ться [p] (of a conflict), нараста́ть [i] (expand)
    escape: убега́ть [i] (get out of), убежа́ть [p] (get out of), спаса́ться [i] (take refuge), утека́ть [i] (gas, liquids), уте́чь [p] (gas, liquids)
    establish: устана́вливать [i] (determine a fact; set firmly), установи́ть [p] (determine a fact; set firmly), осно́вывать [i] (found an institution), основа́ть [p] (found an institution), учрежда́ть [i] (found an institution)
    estimate: оце́нивать [i], оцени́ть [p], прики́дывать [i] (roughly), прики́нуть [p] (roughly)
    evacuate: эвакуи́ровать [b] (move people to safety), эвакуи́роваться [b] (flee to safety), вывози́ть [i] (move people to safety), вы́везти [p] (move people to safety)
    evade: уклоня́ться [i] (dodge; taxes), уклони́ться [p] (dodge; taxes), избега́ть [i] (elude), избежа́ть [p] (elude), обходи́ть [i] (circumvent)
    evaluate: оце́нивать [i], оцени́ть [p], анализи́ровать [i] (analyze data), проанализи́ровать [p] (analyze data)
    evaporate: испаря́ться [i], испари́ться [p], испаря́ть [i] (cause to evaporate), испари́ть [p] (cause to evaporate), улету́чиваться [i]
    evoke: вызыва́ть [i], вы́звать [p], пробужда́ть [i] (draw out a feeling), пробуди́ть [p] (draw out a feeling), воскреша́ть [i] (memories)
    evolve: развива́ться [i] (develop gradually), разви́ться [p] (develop gradually), созрева́ть [i] (mature), созре́ть [p] (mature), эволюциони́ровать [i]
    exaggerate: преувели́чивать [i], преувели́чить [p], раздува́ть [i] (blow out of proportion), разду́ть [p] (blow out of proportion)
    exalt: превозноси́ть [i] (praise), превознести́ [p] (praise), восхваля́ть [i] (praise), восхвали́ть [p] (praise), возвыша́ть [i] (raise in rank)
    examine: осма́тривать [i] (a patient), осмотре́ть [p] (a patient), обсле́довать [b] (a patient), иссле́довать [b] (study), проверя́ть [i] (test)
    excavate: раска́пывать [i] (dig up), раскопа́ть [p] (dig up), выка́пывать [i] (dig out), вы́копать [p] (dig out), копа́ть [i] (dig)
    exceed: превыша́ть [i] (a limit), превы́сить [p] (a limit), превосходи́ть [i] (surpass), превзойти́ [p] (surpass)
    excel: блиста́ть [i] (be very good at), блесну́ть [p] (be very good at), преуспева́ть [i] (succeed), преуспе́ть [p] (succeed), превосходи́ть [i] (outdo others)
    exchange: обме́нивать [i] (money), обменя́ть [p] (money), обме́ниваться [i] (swap with each other), обменя́ться [p] (swap with each other), меня́ть [i] (money)
    excite: волнова́ть [i] (make excited), взволнова́ть [p] (make excited), возбужда́ть [i] (stimulate), возбуди́ть [p] (stimulate), волнова́ться [i] (become excited)
    exclude: исключа́ть [i] (rule out; socially), исключи́ть [p] (rule out; socially), отстраня́ть [i] (keep out), отстрани́ть [p] (keep out)
    excuse: извиня́ть [i], извини́ть [p], проща́ть [i] (let off), прости́ть [p] (let off), освобожда́ть [i] (release from a duty)
    execute: выполня́ть [i] (carry out), вы́полнить [p] (carry out), исполня́ть [i] (carry out), ка́знить [b] (put to death), запуска́ть [i] (run a program)
    exempt: освобожда́ть [i], освободи́ть [p], исключа́ть [i], исключи́ть [p]
    exercise: тренирова́ться [i] (train), потренирова́ться [p] (train), упражня́ться [i] (train), по́льзоваться [i] (a right), осуществля́ть [i] (use a right or power)
    exert: ока́зывать [i] (influence, pressure), оказа́ть [p] (influence, pressure), прилага́ть [i] (effort), приложи́ть [p] (effort), напряга́ть [i] (effort; ability)
    exhale: выдыха́ть [i], вы́дохнуть [p]
    exhaust: исче́рпывать [i] (use up; deplete), исче́рпать [p] (use up; deplete), истоща́ть [i] (deplete), изма́тывать [i] (wear out), измота́ть [p] (wear out)
    exhibit: проявля́ть [i] (show a trait), прояви́ть [p] (show a trait), выставля́ть [i] (put on show), вы́ставить [p] (put on show), демонстри́ровать [b] (show)
    exile: ссыла́ть [i], сосла́ть [p], изгоня́ть [i], изгна́ть [p], высыла́ть [i]
    exist: существова́ть [i] (things; people, animals), жить [i] (people, animals), име́ться [i] (things)
    expand: расширя́ть [i], расши́рить [p], расширя́ться [i] (swell), расши́риться [p] (swell), увели́чивать [i] (enlarge)
    expect: ожида́ть [i] (anticipate), ждать [i] (hope for), предполага́ть [i] (suppose), предположи́ть [p] (suppose), рассчи́тывать [i] (hope for)
    expedite: ускоря́ть [i] (hurry; bring forward), уско́рить [p] (hurry; bring forward), торопи́ть [i] (hurry), поторопи́ть [p] (hurry), форси́ровать [b] (push forward)
    expel: выгоня́ть [i] (drive out), вы́гнать [p] (drive out), исключа́ть [i] (from school), исключи́ть [p] (from school), высыла́ть [i] (from a country)
    experience: испы́тывать [i] (feel a sensation), испыта́ть [p] (feel a sensation), пережива́ть [i] (live through), пережи́ть [p] (live through), ощуща́ть [i] (feel a sensation)
    experiment: эксперименти́ровать [i], про́бовать [i] (try out), попро́бовать [p] (try out), испы́тывать [i] (try out), испыта́ть [p] (try out)
    expire: истека́ть [i] (contracts; a license), исте́чь [p] (contracts; a license), конча́ться [i] (run out), ко́нчиться [p] (run out), сконча́ться [p] (die)
    explain: объясня́ть [i], объясни́ть [p], разъясня́ть [i], разъясни́ть [p], обосно́вывать [i] (account for an action)
    explode: взрыва́ться [i] (burst; blow up), взорва́ться [p] (burst; blow up), взрыва́ть [i] (blow up), взорва́ть [p] (blow up), ло́пнуть [p] (burst)
    exploit: эксплуати́ровать [b] (exploit people, resources), использова́ть [b] (make use of), воспо́льзоваться [p] (take advantage of), злоупотребля́ть [i] (misuse), злоупотреби́ть [p] (misuse)
    explore: иссле́довать [b] (research), изуча́ть [i] (study in depth), изучи́ть [p] (study in depth), осма́тривать [i] (a place), осмотре́ть [p] (a place)
    export: экспорти́ровать [b] (goods abroad; data), вывози́ть [i] (goods abroad), вы́везти [p] (goods abroad)
    expose: подверга́ть [i] (to danger), подве́ргнуть [p] (to danger), разоблача́ть [i] (a scandal; reveal), разоблачи́ть [p] (a scandal; reveal), раскрыва́ть [i] (uncover; a secret)
    express: выража́ть [i], вы́разить [p], выска́зывать [i], вы́сказать [p]
    extend: продлева́ть [i] (in time), продли́ть [p] (in time), протя́гивать [i] (hold out), протяну́ть [p] (hold out), удлиня́ть [i] (lengthen)
    extinguish: туши́ть [i], потуши́ть [p], гаси́ть [i], погаси́ть [p], уничожа́ть [i] (wipe out)
    extol: восхваля́ть [i] (praise), восхвали́ть [p] (praise), превозноси́ть [i] (praise), превознести́ [p] (praise), сла́вить [i] (praise)
    extract: извлека́ть [i] (pull out; derive from raw material), извле́чь [p] (pull out; derive from raw material), добыва́ть [i] (derive from raw material), добы́ть [p] (derive from raw material), цити́ровать [i] (quote an excerpt)
    fabricate: изготовля́ть [i] (manufacture), изгото́вить [p] (manufacture), выду́мывать [i] (make up), вы́думать [p] (make up), фабрикова́ть [i] (invent falsely)
    face: ста́лкиваться [i] (face a problem), столкну́ться [p] (face a problem), противостоя́ть [i] (confront), выходи́ть [i] (look onto), смотре́ть [i] (face a direction)
    facilitate: облегча́ть [i], облегчи́ть [p], спосо́бствовать [i] (help along), проводи́ть [i] (lead a session), провести́ [p] (lead a session)
    fade: увяда́ть [i] (wither), увя́нуть [p] (wither), выцвета́ть [i] (lose color), затиха́ть [i] (sounds), угаса́ть [i] (dwindle; vanish)
    fail: прова́ливаться [i] (fail), провали́ться [p] (fail), прова́ливать [i] (a test; a course), провали́ть [p] (a test; a course), подводи́ть [i] (let down)
    fake: подде́лывать [i] (falsify), подде́лать [p] (falsify), фальсифици́ровать [b] (falsify), притворя́ться [i] (pretend), симули́ровать [b] (pretend)
    fall: па́дать [i], упа́сть [p], идти́ [i] (of rain or snow), выпада́ть [i] (rain, snow), вы́пасть [p] (rain, snow)
    fall down: па́дать [i] (tumble to the ground), упа́сть [p] (tumble to the ground), сва́ливаться [i] (topple over), свали́ться [p] (topple over), разва́ливаться [i] (collapse)
    fan: обма́хивать [i] (cool with a fan), обмахну́ть [p] (cool with a fan), раздува́ть [i] (flames), разду́ть [p] (flames), разжига́ть [i] (stir up)
    fascinate: очаро́вывать [i] (captivate), очарова́ть [p] (captivate), завора́живать [i], заворожи́ть [p], увлека́ть [i] (captivate)
    fasten: застёгивать [i] (button up; buttons, clips), застегну́ть [p] (button up; buttons, clips), пристёгивать [i] (a belt; buckle), прикрепля́ть [i] (attach; secure), прикрепи́ть [p] (attach; secure)
    fatigue: утомля́ть [i], утоми́ть [p], изнуря́ть [i], изнури́ть [p], изма́тывать [i]
    favor: предпочита́ть [i] (prefer), предпоче́сть [p] (prefer), благоприя́тствовать [i] (favor), подде́рживать [i] (side with), покрови́тельствовать [i] (show favoritism)
    fear: боя́ться [i], побоя́ться [p], опаса́ться [i] (be concerned), страши́ться [i]
    feed: корми́ть [i] (animals, babies), накорми́ть [p] (animals, babies), пита́ть [i] (support with food; supply), снабжа́ть [i] (supply), снабди́ть [p] (supply)
    feel: чу́вствовать [i], почу́вствовать [p], ощуща́ть [i], ощути́ть [p], ощу́пывать [i] (feel with the hands)
    fence: фехтова́ть [i] (do the sport of fencing), огора́живать [i] (enclose with a fence), огороди́ть [p] (enclose with a fence), огражда́ть [i] (enclose), огради́ть [p] (enclose)
    ferment: броди́ть [i] (ferment), ферменти́ровать [b] (cause to ferment), ква́сить [i] (cause to ferment), заква́сить [p] (cause to ferment)
    fetch: приноси́ть [i] (go and get), принести́ [p] (go and get), приводи́ть [i] (a person), привести́ [p] (a person), доставля́ть [i] (have sent over)
    fight: боро́ться [i] (struggle for a cause), дра́ться [i] (brawl), подра́ться [p] (brawl), сража́ться [i] (combat), ссо́риться [i] (quarrel)
    figure out: разбира́ться [i] (understand), разобра́ться [p] (understand), выясня́ть [i] (determine the cause), вы́яснить [p] (determine the cause), реши́ть [p] (solve a problem)
    file: подава́ть [i] (submit; a claim, a complaint), пода́ть [p] (submit; a claim, a complaint), архиви́ровать [b] (put in files), подшива́ть [i] (put into a binder), подши́ть [p] (put into a binder)
    fill: наполня́ть [i], напо́лнить [p], заполня́ть [i] (fill a gap), запо́лнить [p] (fill a gap), пополня́ть [i] (refill)
    fill in: заполня́ть [i] (a form), запо́лнить [p] (a form), впи́сывать [i] (write in), заменя́ть [i] (substitute for), замени́ть [p] (substitute for)
    film: снима́ть [i] (a movie), снять [p] (a movie), экранизи́ровать [b] (adapt for film)
    filter: фильтрова́ть [i], отфильтрова́ть [p] (filter out), проце́живать [i] (strain), процеди́ть [p] (strain)
    finance: финанси́ровать [b] (back financially), спонси́ровать [b] (back financially), ссужа́ть [i] (lend funds for), ссуди́ть [p] (lend funds for)
    find: находи́ть [i], найти́ [p], обнару́живать [i] (come upon), обнару́жить [p] (come upon)
    find out: узнава́ть [i] (learn), узна́ть [p] (learn), выясня́ть [i] (establish), вы́яснить [p] (establish), разузнава́ть [i] (look into)
    fine: штрафова́ть [i], оштрафова́ть [p], нака́зывать [i] (punish), наказа́ть [p] (punish)
    finish: зака́нчивать [i], зако́нчить [p], заверша́ть [i], заверши́ть [p], доде́лать [p] (finish a task)
    fire: увольня́ть [i] (from a job), уво́лить [p] (from a job), стреля́ть [i] (a weapon), вы́стрелить [p] (a weapon), выгоня́ть [i] (from a job; informal)
    fish: лови́ть [i] (catch fish), рыба́чить [i], у́дить [i] (catch with a rod)
    fit: подходи́ть [i] (suit; match), подойти́ [p] (suit; match), помеща́ться [i] (fit in a space), помести́ться [p] (fit in a space), сиде́ть [i] (fit snugly)
    fix: чини́ть [i] (a fault), почини́ть [p] (a fault), ремонти́ровать [i], исправля́ть [i] (a fault), закрепля́ть [i] (fasten; fix in place)
    flap: маха́ть [i] (wings), махну́ть [p] (wings), хло́пать [i] (wings; flag), развева́ться [i] (flag), трепета́ть [i] (flag)
    flare: вспы́хивать [i] (flash; blaze up), вспы́хнуть [p] (flash; blaze up), разгора́ться [i] (blaze up), разгоре́ться [p] (blaze up), пыла́ть [i] (flame)
    flash: сверка́ть [i], сверкну́ть [p], мелька́ть [i] (flash across), мелькну́ть [p] (flash across), вспы́хивать [i] (flash of an idea)
    flatter: льстить [i] (praise excessively), польсти́ть [p] (praise excessively), расхва́ливать [i] (praise excessively), расхвали́ть [p] (praise excessively), идти́ [i] (look good on)
    flavor: приправля́ть [i] (season), припра́вить [p] (season), ароматизи́ровать [b] (add flavoring)
    flee: бежа́ть [i] (run away), убега́ть [i] (run away), убежа́ть [p] (run away), скры́ться [p] (take refuge), спаса́ться [i] (take refuge)
    fling: швыря́ть [i], швырну́ть [p], броса́ть [i], бро́сить [p], кида́ть [i] (toss aside)
    flip: перевора́чивать [i] (turn over), переверну́ть [p] (turn over), листа́ть [i] (pages), переключа́ть [i] (a switch), переключи́ть [p] (a switch)
    flirt: флиртова́ть [i], пофлиртова́ть [p], коке́тничать [i] (banter playfully), заи́грывать [i] (make advances)
    float: плыть [i] (drift on water), поплы́ть [p] (drift on water), пла́вать [i] (stay on the surface), пари́ть [i] (in the air), дрейфова́ть [i] (drift)
    flood: затопля́ть [i] (inundate), затопи́ть [p] (inundate), наводня́ть [i] (pour in), наводни́ть [p] (pour in), разлива́ться [i] (a river overflows)
    flourish: процвета́ть [i] (prosper), расцвета́ть [i] (plants), расцвести́ [p] (plants), цвести́ [i] (plants), разма́хивать [i] (brandish)
    flow: течь [i] (flow along), струи́ться [i] (flow along), ли́ться [i], протека́ть [i] (flow along), циркули́ровать [i] (circulate)
    flutter: развева́ться [i] (flags in the wind), колыха́ться [i] (wave in the wind), порха́ть [i] (flutter lightly), вспорхну́ть [p] (flutter lightly), трепета́ть [i] (wings)
    fly: лете́ть [i], лета́ть [i], полете́ть [p], пилоти́ровать [i] (pilot a plane), улета́ть [i] (fly off)
    focus: фокуси́ровать [i] (a camera; adjust a lens), сфокуси́ровать [p] (a camera; adjust a lens), сосредота́чивать [i] (direct attention), сосредото́чить [p] (direct attention), концентри́ровать [i] (narrow down; direct attention)
    fold: скла́дывать [i] (clothes; paper), сложи́ть [p] (clothes; paper), сгиба́ть [i] (crease), согну́ть [p] (crease), загиба́ть [i] (crease)
    follow: сле́довать [i], после́довать [p] (come after), пресле́довать [i] (pursue), соблюда́ть [i] (rules, orders), слу́шаться [i] (obey)
    fool: обма́нывать [i] (trick), обману́ть [p] (trick), дура́чить [i] (trick), одура́чить [p] (trick), дура́читься [i] (joke around)
    forbid: запреща́ть [i], запрети́ть [p], воспреща́ть [i] (formal), воспрети́ть [p] (formal)
    force: заставля́ть [i] (compel), заста́вить [p] (compel), вынужда́ть [i] (compel), взла́мывать [i] (force open), взлома́ть [p] (force open)
    forecast: прогнози́ровать [i], спрогнози́ровать [p], предска́зывать [i], предсказа́ть [p]
    foresee: предви́деть [i], предусма́тривать [i] (look ahead), предусмотре́ть [p] (look ahead), предчу́вствовать [i], предсказа́ть [p]
    forge: кова́ть [i] (metal), скова́ть [p] (metal), подде́лывать [i] (counterfeit), подде́лать [p] (counterfeit), выко́вывать [i] (a bond; build ties)
    forget: забыва́ть [i], забы́ть [p]
    forgive: проща́ть [i], прости́ть [p], извиня́ть [i] (let off), извини́ть [p] (let off)
    form: формирова́ть [i], сформирова́ть [p], образо́вывать [i] (a group; make up), образова́ть [p] (a group; make up), составля́ть [i] (compose; make up)
    format: форма́тировать [i] (a disk), отформа́тировать [p] (a disk)
    formulate: формули́ровать [i], сформули́ровать [p], разраба́тывать [i] (work out), разрабо́тать [p] (work out), составля́ть [i] (draw up a plan)
    found: осно́вывать [i], основа́ть [p], учрежда́ть [i] (endow), учреди́ть [p] (endow), создава́ть [i] (found)
    fracture: лома́ть [i] (break; a bone), слома́ть [p] (break; a bone), лома́ться [i] (snap), слома́ться [p] (be fractured; snap), тре́скаться [i] (crack)
    frame: обрамля́ть [i] (a picture; give a border), оформля́ть [i] (mount a picture), оформи́ть [p] (mount a picture), подставля́ть [i] (set up an innocent person), подста́вить [p] (set up an innocent person)
    free: освобожда́ть [i], освободи́ть [p], выпуска́ть [i] (let go; release a prisoner), вы́пустить [p] (let go; release a prisoner), избавля́ть [i] (free from)
    freeze: замора́живать [i] (food, assets), заморо́зить [p] (food, assets), замерза́ть [i] (turn to ice), замёрзнуть [p] (turn to ice; feel very cold), мёрзнуть [i] (feel very cold)
    frighten: пуга́ть [i] (startle), испуга́ть [p] (startle), страши́ть [i] (threaten), запу́гивать [i] (threaten), запуга́ть [p] (threaten)
    frown: хму́риться [i] (one's brows), нахму́риться [p] (one's brows), мо́рщить [i] (the forehead), смо́рщить [p] (the forehead), осужда́ть [i] (disapprove)
    frustrate: расстра́ивать [i] (thwart a plan), расстро́ить [p] (thwart a plan), срыва́ть [i] (thwart), сорва́ть [p] (thwart), разочаро́вывать [i] (make disappointed)
    fry: жа́рить [i], пожа́рить [p], поджа́ривать [i] (pan-fry), поджа́рить [p] (pan-fry), обжа́ривать [i] (pan-fry)
    fuel: заправля́ть [i] (refuel), запра́вить [p] (refuel), подпи́тывать [i] (power), разжига́ть [i] (stoke a conflict), подогрева́ть [i] (stir up emotions)
    fulfill: выполня́ть [i] (a promise; a duty; a requirement), вы́полнить [p] (a promise; a duty; a requirement), исполня́ть [i] (a wish), осуществля́ть [i] (realize), удовлетворя́ть [i] (satisfy)
    function: рабо́тать [i], функциони́ровать [i], де́йствовать [i], служи́ть [i] (act as; serve a function), послужи́ть [p] (act as)
    furnish: обставля́ть [i] (a room), обста́вить [p] (a room), меблирова́ть [b] (a room), снабжа́ть [i] (supply), снабди́ть [p] (supply)
    fuse: слива́ться [i] (companies; merge), сли́ться [p] (companies; merge), объединя́ть [i] (companies), сва́ривать [i] (weld), свари́ть [p] (weld)
    gain: приобрета́ть [i] (acquire), приобрести́ [p] (acquire), получа́ть [i] (gain), набира́ть [i] (increase, gain weight), набра́ть [p] (increase, gain weight)
    gallop: скака́ть [i], поскака́ть [p], мча́ться [i] (at a gallop)
    gamble: игра́ть [i] (gamble at cards, casino), ста́вить [i] (bet; stake), поста́вить [p] (bet; stake), рискова́ть [i] (risk), рискну́ть [p] (risk)
    gather: собира́ть [i] (collect), собра́ть [p] (collect), собира́ться [i] (come together, meet), собра́ться [p] (come together, meet), подбира́ть [i] (pick up)
    generate: генери́ровать [i], сгенери́ровать [p], создава́ть [i] (a document, report), созда́ть [p] (a document, report), выраба́тывать [i] (produce)
    gesture: жестикули́ровать [i], сигнализи́ровать [b] (signal), маха́ть [i] (signal by hand), махну́ть [p] (signal by hand)
    get: получа́ть [i] (receive), получи́ть [p] (receive), достава́ть [i] (obtain; fetch), доста́ть [p] (obtain; fetch), пойма́ть [p] (catch)
    give: дава́ть [i], дать [p], дари́ть [i] (as a gift), подари́ть [p] (as a gift), предоставля́ть [i] (grant, provide)
    give up: отка́зываться [i] (renounce), отказа́ться [p] (renounce), сдава́ться [i] (surrender), сда́ться [p] (surrender), броса́ть [i] (quit a habit; quit)
    glorify: прославля́ть [i], просла́вить [p], сла́вить [i], возвели́чивать [i] (idealize), идеализи́ровать [b] (idealize)
    glow: свети́ться [i], сия́ть [i], пыла́ть [i] (glow with heat), горе́ть [i], тлеть [i] (smoulder)
    glue: клеи́ть [i], скле́ить [p], скле́ивать [i], прикле́ивать [i] (stick on), прикле́ить [p] (stick on)
    go: идти́ [i], ходи́ть [i], пойти́ [p], е́хать [i] (by vehicle), пое́хать [p] (by vehicle)
    go back: возвраща́ться [i] (come back), верну́ться [p] (come back), возврати́ться [p] (go home), поверну́ть [p] (turn back), повора́чивать [i] (turn back)
    go on: продолжа́ть [i] (continue), продо́лжить [p] (continue), продолжа́ться [i] (last), продо́лжиться [p] (last), дли́ться [i] (last)
    go out: выходи́ть [i] (go outside; leave home), вы́йти [p] (go outside; leave home), га́снуть [i] (a light, a fire), уга́снуть [p] (a light, a fire), гуля́ть [i] (socially)
    gossip: сплетнича́ть [i] (talk ill of others), посплетнича́ть [p] (talk ill of others), суда́чить [i], болта́ть [i] (chatter), поболта́ть [p] (chatter)
    govern: управля́ть [i], пра́вить [i], руководи́ть [i] (administer), регули́ровать [i] (control), возглавля́ть [i] (lead)
    grab: хвата́ть [i] (seize), схвати́ть [p] (seize), захва́тывать [i] (seize), выхва́тывать [i] (snatch), вы́хватить [p] (snatch)
    grade: оце́нивать [i] (rate), оцени́ть [p] (rate), выставля́ть [i] (assign a grade), вы́ставить [p] (assign a grade), классифици́ровать [b] (classify)
    graduate: ока́нчивать [i] (finish school, a degree), око́нчить [p] (finish school, a degree), зака́нчивать [i] (complete a course), зако́нчить [p] (complete a course), выпуска́ться [i] (finish school)
    graft: привива́ть [i] (plants), приви́ть [p] (plants), переса́живать [i] (tissue), пересади́ть [p] (tissue), соединя́ть [i] (combine)
    grant: предоставля́ть [i] (permission), предоста́вить [p] (permission), присужда́ть [i] (award), присуди́ть [p] (award), удовлетворя́ть [i] (a request)
    grasp: хвата́ть [i] (take hold of), схвати́ть [p] (take hold of), понима́ть [i] (understand), поня́ть [p] (understand), постига́ть [i] (comprehend)
    grate: тере́ть [i] (cheese; food), натере́ть [p] (cheese; food), скрипе́ть [i] (squeak), раздража́ть [i] (irritate), раздражи́ть [p] (irritate)
    graze: пасти́ [i] (put animals out to graze), задева́ть [i] (touch lightly; brush past), заде́ть [p] (touch lightly; brush past), цара́пать [i] (scrape the skin), цара́пнуть [p] (scrape the skin)
    greet: здоро́ваться [i], поздоро́ваться [p], приве́тствовать [i], поприве́тствовать [p], встреча́ть [i] (welcome)
    grieve: горева́ть [i] (mourn), скорбе́ть [i] (mourn), опла́кивать [i] (mourn a death), огорча́ть [i] (cause sorrow to), огорчи́ть [p] (cause sorrow to)
    grill: жа́рить [i] (over a flame), пожа́рить [p] (over a flame), допра́шивать [i] (interrogate), допроси́ть [p] (interrogate), расспра́шивать [i] (question hard)
    grind: моло́ть [i] (coffee, grain), смоло́ть [p] (coffee, grain), точи́ть [i] (sharpen), толо́чь [i] (pound to powder), измельча́ть [i] (crush; pulverize)
    grip: сжима́ть [i] (clutch), сжать [p] (clutch), хвата́ть [i] (grip), цепля́ться [i] (hold fast), уцепи́ться [p] (hold fast)
    groan: стона́ть [i] (in pain), простона́ть [p] (in pain), ворча́ть [i] (grumble), о́хать [i], скрипе́ть [i] (creak)
    grow: расти́ [i] (get bigger), вы́расти [p] (get bigger), выра́щивать [i] (crops; plants), вы́растить [p] (crops; plants), увели́чиваться [i] (increase)
    grow up: расти́ [i], вы́расти [p], взросле́ть [i] (become mature), повзросле́ть [p] (become mature), возмужа́ть [p] (become mature)
    growl: рыча́ть [i] (dogs), зарыча́ть [p] (dogs), ворча́ть [i] (dogs), греме́ть [i] (thunder), грохота́ть [i] (thunder)
    grunt: хрю́кать [i] (of a pig), хрю́кнуть [p] (of a pig), кряхте́ть [i] (with effort), бурча́ть [i] (grumble), ворча́ть [i] (grumble)
    guarantee: гаранти́ровать [b], руча́ться [i] (assert with confidence), поручи́ться [p] (assert with confidence), обеща́ть [i] (promise), пообеща́ть [p] (promise)
    guard: охраня́ть [i] (keep watch), охрани́ть [p] (keep watch), сторожи́ть [i] (stand guard), стере́чь [i] (stand guard), карау́лить [i] (stand guard)
    guess: уга́дывать [i] (guess right), угада́ть [p] (guess right), дога́дываться [i] (guess), догада́ться [p] (guess), предполага́ть [i] (suppose)
    guide: вести́ [i] (show the way), провести́ [p] (show the way), направля́ть [i] (direct), напра́вить [p] (direct), руководи́ть [i] (instruct; lead)
    gulp: глота́ть [i] (swallow), проглоти́ть [p] (swallow), прогла́тывать [i] (wolf down food), загла́тывать [i] (wolf down food), пить [i] (gulp down a drink)
    gush: бить [i] (spout; spurt up), хлы́нуть [p] (pour out), струи́ться [i] (flow in a stream), фонтани́ровать [i] (spurt up), излива́ться [i] (pour out)
    hack: взла́мывать [i] (break into a system), взлома́ть [p] (crack a code, password), руби́ть [i] (chop up), изруби́ть [p] (hack to pieces)
    hail: идти́ [i] (of hail), остана́вливать [i] (a taxi), останови́ть [p] (a taxi), окли́кнуть [p] (call over), приве́тствовать [i] (cheer)
    halt: остана́вливать [i], останови́ть [p], остана́вливаться [i] (come to a stop), останови́ться [p] (come to a stop), прекраща́ть [i] (cease operations)
    hammer: бить [i] (pound), забива́ть [i] (hammer in a nail), заби́ть [p] (hammer in a nail), колоти́ть [i] (pound), стуча́ть [i] (pound)
    hamper: затрудня́ть [i], затрудни́ть [p], меша́ть [i], помеша́ть [p], препя́тствовать [i] (block)
    hand over: передава́ть [i] (transfer; pass to), переда́ть [p] (transfer; pass to), вруча́ть [i] (hand over formally), вручи́ть [p] (hand over formally), сдава́ть [i] (hand over duties)
    handle: справля́ться [i] (cope with), спра́виться [p] (cope with), обраща́ться [i] (operate a machine), обраба́тывать [i] (deal with), обрабо́тать [p] (deal with)
    hang: висе́ть [i] (be hanging), ве́шать [i] (hang up), пове́сить [p] (hang up), свиса́ть [i] (dangle), подве́шивать [i] (suspend)
    hang up: ве́шать [i] (the phone; coats, pictures), пове́сить [p] (the phone; coats, pictures), разве́шивать [i] (coats, pictures), разве́сить [p] (coats, pictures), отключа́ться [i] (end a phone call)
    happen: происходи́ть [i] (occur), произойти́ [p] (occur), случа́ться [i] (happen), случи́ться [p] (happen), состоя́ться [p] (take place)
    harass: пристава́ть [i] (pester), приста́ть [p] (pester), домога́ться [i] (sexually), пресле́довать [i] (pursue), донима́ть [i] (pester)
    harden: закаля́ть [i] (toughen up), закали́ть [p] (toughen up), тверде́ть [i] (become hard), затвердева́ть [i] (become hard), затверде́ть [p] (become hard)
    harm: вреди́ть [i] (harm), навреди́ть [p] (harm), поврежда́ть [i] (damage), повреди́ть [p] (damage), ра́нить [b] (hurt)
    harmonize: гармонизи́ровать [b], гармони́ровать [i] (go well together), согласо́вывать [i] (coordinate), согласова́ть [p] (coordinate), сочета́ться [b] (go well together)
    harvest: собира́ть [i] (a crop), собра́ть [p] (a crop), убира́ть [i] (a crop), убра́ть [p] (a crop)
    hate: ненави́деть [i], возненави́деть [p], презира́ть [i] (loathe)
    haul: тащи́ть [i] (pull; drag), волочи́ть [i] (drag), везти́ [i] (carry; carry freight), перевози́ть [i] (transport), перевезти́ [p] (transport)
    have: име́ть [i] (possess; auxiliary), быть [i] (to have, there is), владе́ть [i] (own), облада́ть [i] (possess)
    heal: лечи́ть [i] (treat; cure), вы́лечить [p] (cure), зажива́ть [i] (wounds), зажи́ть [p] (wounds), выздора́вливать [i] (recover; get well)
    heap: нава́ливать [i] (heap up), навали́ть [p] (heap up), нагроможда́ть [i] (pile up), нагромозди́ть [p] (pile up), скопля́ться [i] (be piled up)
    hear: слы́шать [i], услы́шать [p], слы́шаться [i] (be audible), расслы́шать [p] (make out)
    heat: нагрева́ть [i] (apply heat), нагре́ть [p] (apply heat), греть [i] (warm up food or drink), разогрева́ть [i] (reheat food), ота́пливать [i] (a room)
    heighten: уси́ливать [i], уси́лить [p], повыша́ть [i] (raise), повы́сить [p] (raise), обостря́ть [i] (intensify)
    help: помога́ть [i], помо́чь [p], выруча́ть [i] (aid, rescue), вы́ручить [p] (aid, rescue), подде́рживать [i] (support)
    hesitate: колеба́ться [i], поколеба́ться [p], ме́длить [i], поме́длить [p], сомнева́ться [i] (waver)
    hide: пря́тать [i] (conceal), спря́тать [p] (conceal), пря́таться [i] (be out of sight; go into hiding), спря́таться [p] (be out of sight; go into hiding), скрыва́ть [i] (keep secret)
    highlight: выделя́ть [i] (with a marker; text on screen), вы́делить [p] (with a marker; text on screen), подчёркивать [i] (emphasize), подчеркну́ть [p] (emphasize), отмеча́ть [i] (with a marker)
    hijack: угоня́ть [i] (aircraft, vehicles), угна́ть [p] (aircraft, vehicles), захва́тывать [i] (seize by force; ships), захвати́ть [p] (seize by force; ships)
    hinder: меша́ть [i], помеша́ть [p], препя́тствовать [i], заде́рживать [i] (delay), предотвраща́ть [i] (prevent)
    hint: намека́ть [i], намекну́ть [p], подска́зывать [i] (tip off; suggest), подсказа́ть [p] (tip off; suggest), упомина́ть [i] (allude to)
    hire: нанима́ть [i], наня́ть [p], арендова́ть [b] (rent), приглаша́ть [i] (performers), пригласи́ть [p] (performers)
    hit: бить [i] (strike), уда́рить [p] (strike), ударя́ть [i] (strike), попада́ть [i] (a target), попа́сть [p] (a target)
    hoard: копи́ть [i], накопи́ть [p] (accumulate), запаса́ть [i], скупа́ть [i] (buy up and stockpile), скупи́ть [p] (buy up and stockpile)
    hold: держа́ть [i], удержа́ть [p] (hold tight), подде́рживать [i] (support weight), проводи́ть [i] (an event), провести́ [p] (an event)
    hold on: ждать [i] (wait), подожда́ть [p] (wait), держа́ться [i] (hold out; cling), продержа́ться [p] (hold out), цепля́ться [i] (cling)
    honor: чтить [i], почти́ть [p], награжда́ть [i] (with an award), награди́ть [p] (with an award), выполня́ть [i] (a promise or check)
    hook: зацепля́ть [i] (get caught; hang on a hook), зацепи́ть [p] (get caught; hang on a hook), цепля́ть [i] (catch with a hook), подключа́ть [i] (hook up), подключи́ть [p] (hook up)
    hop: пры́гать [i] (like a rabbit), пры́гнуть [p] (like a rabbit), скака́ть [i] (hop), подпры́гивать [i] (hop), подпры́гнуть [p] (hop)
    hope: наде́яться [i], понаде́яться [p], жела́ть [i] (wish), пожела́ть [p] (wish), рассчи́тывать [i] (hope for)
    host: принима́ть [i] (lodge guests; entertain guests), вести́ [i] (a show; a program), устра́ивать [i] (host an event), устро́ить [p] (host an event), размеща́ть [i] (lodge guests)
    hover: пари́ть [i] (in the air), вита́ть [i] (linger in the air), кружи́ть [i] (circle above), висе́ть [i] (in the air), слоня́ться [i] (loiter nearby)
    howl: выть [i] (wolves, dogs), завы́ть [p] (wolves, dogs), завыва́ть [i] (howl), вопи́ть [i] (wail), рыда́ть [i] (wail)
    hug: обнима́ть [i], обня́ть [p], обнима́ться [i] (each other), обня́ться [p] (each other), прижима́ть [i] (hold close)
    hum: напева́ть [i], напе́ть [p], мурлы́кать [i] (hum a tune), гуде́ть [i] (drone; machinery), жужжа́ть [i] (buzz)
    humiliate: унижа́ть [i], уни́зить [p], позо́рить [i] (shame in public), опозо́рить [p] (shame in public), оскорбля́ть [i] (insult)
    hunt: охо́титься [i], поохо́титься [p], иска́ть [i] (hunt for), разы́скивать [i] (hunt for), пресле́довать [i] (pursue)
    hurl: швыря́ть [i], швырну́ть [p], броса́ть [i], бро́сить [p], мета́ть [i] (hurl)
    hurt: ныть [i] (to ache), ра́нить [b] (to wound), ушиба́ться [i] (get injured), ушиби́ться [p] (get injured), вреди́ть [i] (to harm)
    hypnotize: гипнотизи́ровать [i], загипнотизи́ровать [p], завора́живать [i] (mesmerize), заворожи́ть [p] (mesmerize)
    identify: идентифици́ровать [b], опознава́ть [i] (recognize), опозна́ть [p] (recognize), определя́ть [i] (e.g. a plant), определи́ть [p] (e.g. a plant)
    idolize: боготвори́ть [i], обожа́ть [i], преклоня́ться [i] (look up to), обожествля́ть [i], обожестви́ть [p]
    ignore: игнори́ровать [i], проигнори́ровать [p], пренебрега́ть [i] (overlook; brush aside), пренебре́чь [p] (overlook; brush aside), отма́хиваться [i] (brush aside)
    illuminate: освеща́ть [i], освети́ть [p], озаря́ть [i], озари́ть [p], проясня́ть [i] (clarify)
    illustrate: иллюстри́ровать [i], проиллюстри́ровать [p], поясня́ть [i] (make clear with examples), поясни́ть [p] (make clear with examples), демонстри́ровать [b] (demonstrate)
    imagine: представля́ть [i] (picture in the mind), предста́вить [p] (picture in the mind), вообража́ть [i] (picture), предполага́ть [i] (suppose), фантази́ровать [i] (dream up)
    imitate: подража́ть [i], имити́ровать [i], копи́ровать [i] (copy a model), скопи́ровать [p] (copy a model), передра́знивать [i] (mimic)
    immerse: погружа́ть [i] (submerge; in liquid), погрузи́ть [p] (submerge; in liquid), окуна́ть [i] (dip in), окуну́ть [p] (dip in), погружа́ться [i] (be absorbed in)
    immobilize: обездви́живать [i], обездви́жить [p], парализова́ть [b] (paralyze; bring to a standstill), фикси́ровать [i] (a limb), зафикси́ровать [p] (a limb)
    impeach: обвиня́ть [i] (charge; accuse), обвини́ть [p] (charge; accuse), смеща́ть [i] (remove from office), смести́ть [p] (remove from office), отстраня́ть [i] (relieve of office)
    impede: препя́тствовать [i], меша́ть [i], помеша́ть [p], тормози́ть [i] (slow down), затормози́ть [p] (slow down)
    implement: внедря́ть [i] (introduce a system), внедри́ть [p] (introduce a system), реализова́ть [b] (realize in practice; software), осуществля́ть [i] (carry out), осуществи́ть [p] (carry out)
    implore: умоля́ть [i], умоли́ть [p], моли́ть [i], упра́шивать [i] (appeal to), взыва́ть [i] (appeal to)
    imply: подразумева́ть [i] (carry as a meaning), означа́ть [i] (mean), озна́чить [p] (mean), намека́ть [i] (suggest), намекну́ть [p] (suggest)
    import: импорти́ровать [b] (goods; data), ввози́ть [i] (goods; bring in), ввезти́ [p] (goods; bring in), загружа́ть [i] (import data), загрузи́ть [p] (import data)
    impose: накла́дывать [i] (a ban, penalty), наложи́ть [p] (a ban, penalty), навя́зывать [i] (force upon others), навяза́ть [p] (force upon others), облага́ть [i] (a tax)
    impress: впечатля́ть [i], впечатли́ть [p], поража́ть [i] (overwhelm), порази́ть [p] (overwhelm), запечатле́ть [p] (imprint on the mind)
    imprison: сажа́ть [i] (lock up), посади́ть [p] (lock up), заключа́ть [i] (confine), заключи́ть [p] (confine), запира́ть [i] (lock up)
    improve: улучша́ть [i], улу́чшить [p], улучша́ться [i] (get better), улу́чшиться [p] (get better), соверше́нствовать [i] (skills)
    incite: подстрека́ть [i], подстрекну́ть [p], провоци́ровать [i], спровоци́ровать [p], разжига́ть [i] (stir up)
    incline: наклоня́ть [i] (tilt something), наклони́ть [p] (tilt something), наклоня́ться [i] (bend forward), наклони́ться [p] (bend forward), склоня́ться [i] (be inclined; tend toward)
    include: включа́ть [i], включи́ть [p], содержа́ть [i] (contain), учи́тывать [i] (count in), уче́сть [p] (count in)
    incorporate: включа́ть [i] (work in), включи́ть [p] (work in), объединя́ть [i] (merge into), встра́ивать [i] (work in), регистри́ровать [i] (a company)
    increase: увели́чивать [i] (make larger), увели́чить [p] (make larger), увели́чиваться [i] (grow in amount), повыша́ть [i] (raise), расти́ [i] (rise; grow)
    incur: нести́ [i] (a loss; a risk, debt), понести́ [p] (suffer a loss), навлека́ть [i] (bring upon oneself), навле́чь [p] (bring upon oneself), брать [i] (take on a burden)
    indicate: ука́зывать [i] (point to; state), указа́ть [p] (point to; state), пока́зывать [i] (display), показа́ть [p] (display), обознача́ть [i] (mark)
    induce: вызыва́ть [i] (bring about; cause), вы́звать [p] (bring about; cause), побужда́ть [i] (persuade), побуди́ть [p] (persuade), склоня́ть [i] (persuade)
    infect: заража́ть [i], зарази́ть [p], заража́ться [i] (get infected), зарази́ться [p] (get infected), инфици́ровать [b]
    infer: заключа́ть [i] (deduce), заключи́ть [p] (deduce), выводи́ть [i] (derive; deduce), вы́вести [p] (derive; deduce), умозаключа́ть [i] (infer by analogy)
    inflate: надува́ть [i] (blow up a balloon), наду́ть [p] (blow up a balloon), нака́чивать [i] (pump up), раздува́ть [i] (bloat, puff up; swell), завыша́ть [i] (pad figures)
    inflict: наноси́ть [i] (damage; cause injury), нанести́ [p] (damage; cause injury), причиня́ть [i] (pain; cause harm), причини́ть [p] (pain; cause harm)
    influence: влия́ть [i], повлия́ть [p], возде́йствовать [b] (act on), склоня́ть [i] (sway), склони́ть [p] (sway)
    inform: информи́ровать [i], проинформи́ровать [p], сообща́ть [i] (notify), сообщи́ть [p] (notify), уведомля́ть [i] (notify officially)
    infringe: наруша́ть [i] (a rule; a law), нару́шить [p] (a rule; a law), ущемля́ть [i] (a right), посяга́ть [i] (encroach), посягну́ть [p] (encroach)
    ingest: принима́ть [i] (a medicine), глота́ть [i] (swallow), проглоти́ть [p] (swallow), поглоща́ть [i] (take in food or substances), потребля́ть [i] (consume food)
    inhabit: обита́ть [i] (of animals), населя́ть [i], засели́ть [p] (settle a place)
    inhale: вдыха́ть [i], вдохну́ть [p]
    inherit: насле́довать [i], унасле́довать [p]
    inhibit: подавля́ть [i], подави́ть [p], сде́рживать [i], сдержа́ть [p], тормози́ть [i] (slow down a process)
    initiate: начина́ть [i] (start a process), нача́ть [p], инициирова́ть [b], посвяща́ть [i] (admit to a group or secret), посвяти́ть [p]
    inject: вводи́ть [i], ввести́ [p], впры́скивать [i], впры́снуть [p], влива́ть [i] (put funds in)
    injure: ра́нить [b], поврежда́ть [i] (hurt a body part), повреди́ть [p]
    inquire: спра́шивать [i], спроси́ть [p], справля́ться [i] (make an inquiry), рассле́довать [b] (investigate)
    insert: вставля́ть [i] (text, data), вста́вить [p], вкла́дывать [i] (place inside), вложи́ть [p], втыка́ть [i] (stick into)
    insinuate: намека́ть [i] (hint), намекну́ть [p], припи́сывать [i] (impute), приписа́ть [p]
    insist: настаива́ть [i], настоя́ть [p], тре́бовать [i] (urge)
    inspect: осма́тривать [i], осмотре́ть [p], проверя́ть [i], прове́рить [p]
    inspire: вдохновля́ть [i], вдохнови́ть [p], воодушевля́ть [i], воодушеви́ть [p]
    install: устана́вливать [i], установи́ть [p], монти́ровать [i] (mount, assemble), смонти́ровать [p], инсталли́ровать [b] (software)
    instruct: обуча́ть [i] (teach, train), обучи́ть [p], инструкти́ровать [i] (brief), проинструкти́ровать [p], прика́зывать [i] (order)
    insult: оскорбля́ть [i], оскорби́ть [p], руга́ть [i] (swear at), обзыва́ть [i] (call names), обозва́ть [p]
    insure: страхова́ть [i] (take out an insurance policy), застрахова́ть [p], гаранти́ровать [b] (guarantee), обеспе́чивать [i] (make sure), обеспе́чить [p]
    integrate: интегри́ровать [b], встра́ивать [i] (build in), встро́ить [p], объединя́ть [i], объедини́ть [p]
    intend: собира́ться [i] (plan to do), намерева́ться [i] (be determined to), предполага́ть [i] (plan)
    intensify: уси́ливать [i], уси́лить [p], обостря́ть [i] (a conflict), обостри́ть [p], интенсифици́ровать [b]
    interact: взаимоде́йствовать [i], обща́ться [i] (mingle), сотру́дничать [i] (work together)
    interest: интересова́ть [i], заинтересова́ть [p], привлека́ть [i] (attract attention), привле́чь [p], увлека́ть [i] (hold attention)
    interfere: вме́шиваться [i] (get involved, meddle), вмеша́ться [p], меша́ть [i] (get in the way), помеша́ть [p]
    interpret: толкова́ть [i] (explain), истолкова́ть [p], интерпрети́ровать [b], переводи́ть [i] (translate orally), перевести́ [p]
    interrogate: допра́шивать [i], допроси́ть [p], опра́шивать [i], опроси́ть [p]
    interrupt: прерыва́ть [i], прерва́ть [p], перебива́ть [i] (cut in), переби́ть [p]
    intervene: вме́шиваться [i], вмеша́ться [p], вступа́ться [i] (step in), вступи́ться [p], посре́дничать [i] (mediate)
    interview: интервьюи́ровать [b], бесе́довать [i] (talk with), побесе́довать [p]
    intimidate: запу́гивать [i], запуга́ть [p], пуга́ть [i], устраша́ть [i], устраши́ть [p]
    intrigue: интригова́ть [i] (scheme; arouse curiosity), заинтригова́ть [p] (arouse curiosity), заинтересова́ть [p] (arouse interest)
    introduce: знако́мить [i] (a person to someone), познако́мить [p], вводи́ть [i] (bring in something new), ввести́ [p], предста́вить [p] (a person; unveil a product)
    invade: вторга́ться [i], вторгну́ться [p], напада́ть [i] (attack), напа́сть [p], захва́тывать [i] (a country)
    invent: изобрета́ть [i], изобрести́ [p], выду́мывать [i] (make up a story), вы́думать [p], приду́мать [p]
    invest: инвести́ровать [b], вкла́дывать [i] (money, effort), вложи́ть [p]
    invite: приглаша́ть [i], пригласи́ть [p], звать [i] (call over), позва́ть [p]
    invoice: выставля́ть [i] (an invoice, bill), вы́ставить [p], начисля́ть [i] (charge), начи́слить [p]
    invoke: призыва́ть [i] (call upon a deity), призва́ть [p], вызыва́ть [i] (call a function, conjure up), вы́звать [p], ссыла́ться [i] (cite as authority)
    involve: включа́ть [i] (include), включи́ть [p], вовлека́ть [i] (make a participant), вовле́чь [p], затра́гивать [i] (concern, affect)
    iron: гла́дить [i], вы́гладить [p], утю́жить [i], отутю́жить [p]
    irritate: раздража́ть [i], раздражи́ть [p], злить [i] (annoy), разозли́ть [p]
    isolate: изоли́ровать [b], отделя́ть [i] (set apart), отдели́ть [p]
    issue: выдава́ть [i] (documents), вы́дать [p], издава́ть [i] (a decree, a publication), изда́ть [p], выпуска́ть [i] (currency, a publication)
    itch: зуде́ть [i], чеса́ться [i]
    jam: застрева́ть [i] (get stuck), застря́ть [p], забива́ть [i] (clog), заби́ть [p], блоки́ровать [b] (block)
    jeer: осви́стывать [i] (boo), освиста́ть [p], насмеха́ться [i] (mock), издева́ться [i] (mock)
    jingle: звене́ть [i] (bells), бренча́ть [i] (coins, keys), звя́кать [i], звя́кнуть [p]
    jog: бе́гать [i] (run), труси́ть [i] (trot), бежа́ть [i]
    join: соединя́ть [i] (connect things), соедини́ть [p], присоединя́ться [i] (join a group), присоедини́ться [p], вступа́ть [i] (become a member of)
    joke: шути́ть [i], пошути́ть [p], остри́ть [i] (be witty)
    jolt: трясти́ [i] (shake roughly), встряхну́ть [p], потряса́ть [i] (shock), потрясти́ [p], дёргаться [i] (lurch)
    journey: путеше́ствовать [i], е́здить [i] (go on a trip), отправля́ться [i] (set out on a trip), отпра́виться [p]
    judge: суди́ть [i] (try a case, judge a contest), оце́нивать [i] (assess), оцени́ть [p], осужда́ть [i] (condemn; convict), осуди́ть [p] (condemn; convict)
    jump: пры́гать [i], пры́гнуть [p], перепры́гивать [i] (jump over), перепры́гнуть [p], скака́ть [i] (hop)
    justify: опра́вдывать [i], оправда́ть [p], обосно́вывать [i] (give reasons for), обоснова́ть [p]
    keep: храни́ть [i] (store), сохраня́ть [i] (maintain), сохрани́ть [p], держа́ть [i] (hold), сдержа́ть [p] (a promise)
    keep on: продолжа́ть [i], продо́лжить [p]
    kick: пина́ть [i], пнуть [p], ударя́ть [i] (football), уда́рить [p], ляга́ться [i] (horse)
    kidnap: похища́ть [i], похи́тить [p]
    kill: убива́ть [i], уби́ть [p], умерщвля́ть [i], умертви́ть [p]
    kindle: зажига́ть [i] (light a fire), заже́чь [p], разжига́ть [i] (spark, arouse), разже́чь [p], возбужда́ть [i] (rouse a feeling)
    kiss: целова́ть [i], поцелова́ть [p], чмо́кать [i] (give a peck, colloquial), чмо́кнуть [p]
    knead: меси́ть [i], замеси́ть [p], размина́ть [i] (knead thoroughly), размя́ть [p]
    knit: вяза́ть [i] (knit or tie), связа́ть [p], сраста́ться [i] (bones)
    knock: стуча́ть [i] (at a door), постуча́ть [p], сту́кнуть [p] (rap), ударя́ть [i] (bump, hit), уда́рить [p]
    knot: завя́зывать [i] (tie), завяза́ть [p], свя́зывать [i], связа́ть [p]
    know: знать [i] (facts, people, places), уме́ть [i] (how to), узнава́ть [i] (get to know, recognize), узна́ть [p], понима́ть [i] (understand)
    label: надпи́сывать [i] (write labels on), надписа́ть [p], помеча́ть [i] (mark), поме́тить [p], клейми́ть [i] (stigmatize)
    lack: недостава́ть [i] (be missing), отсу́тствовать [i] (be absent), нужда́ться [i] (be in need of), обходи́ться [i] (go without)
    lament: опла́кивать [i] (wail over), опла́кать [p], сожале́ть [i] (regret), горева́ть [i] (grieve), жа́ловаться [i] (complain)
    land: приземля́ться [i] (aircraft, after a jump), приземли́ться [p], прича́ливать [i] (ships dock), выса́живаться [i] (come ashore), вы́садиться [p]
    languish: томи́ться [i], ча́хнуть [i] (waste away), хире́ть [i] (grow weak), увяда́ть [i] (stagnate), увя́нуть [p]
    lash: хлеста́ть [i] (whip; rain, waves), хлестну́ть [p], бичева́ть [i] (flog), привя́зывать [i] (tie down), привяза́ть [p]
    last: дли́ться [i] (go on, take time), продли́ться [p], продолжа́ться [i], выде́рживать [i] (hold up, endure), вы́держать [p]
    laugh: смея́ться [i] (laugh at), засмея́ться [p] (burst out laughing), посмея́ться [p], хихи́кать [i] (giggle), хохота́ть [i] (laugh loudly)
    launch: запуска́ть [i] (rocket, program), запусти́ть [p], выпуска́ть [i] (a product), вы́пустить [p], развёртывать [i] (a campaign)
    launder: стира́ть [i] (clothes), вы́стирать [p], отмыва́ть [i] (dirty money), отмы́ть [p]
    lay: класть [i], положи́ть [p] (put down), укла́дывать [i] (carpet, cables), уложи́ть [p], снести́ [p] (an egg)
    lead: вести́ [i] (guide), повести́ [p], руководи́ть [i] (head a group), возглавля́ть [i], кома́ндовать [i] (command)
    leak: течь [i] (a container leaks), протека́ть [i], проса́чиваться [i] (seep, news leaks), просочи́ться [p], разглаша́ть [i] (divulge a secret)
    lean: опира́ться [i] (rest against, rely on), опере́ться [p], прислоня́ть [i] (prop against), прислони́ть [p], наклоня́ться [i] (tilt)
    leap: пры́гать [i], пры́гнуть [p], броса́ться [i] (leap headlong, dart), бро́ситься [p], вскочи́ть [p] (spring up)
    learn: учи́ться [i] (be taught, study), научи́ться [p] (acquire a skill), вы́учить [p] (memorize), узнава́ть [i] (find out), узна́ть [p]
    leave: уходи́ть [i] (depart), уйти́ [p], уезжа́ть [i] (depart by vehicle), оставля́ть [i] (leave behind), оста́вить [p]
    legislate: законода́тельствовать [i], принима́ть [i] (pass a law), приня́ть [p], издава́ть [i] (a law), изда́ть [p]
    lend: одолжа́ть [i], одолжи́ть [p], ссужа́ть [i] (lend out), ссуди́ть [p]
    lengthen: удлиня́ть [i], удлини́ть [p], растя́гивать [i] (stretch), продлева́ть [i] (extend in time), продли́ть [p]
    let: позволя́ть [i] (permit), позво́лить [p], разреша́ть [i], разреши́ть [p], сдава́ть [i] (rent out)
    let down: подводи́ть [i] (betray trust), подвести́ [p], разочаро́вывать [i] (disappoint), разочарова́ть [p], опуска́ть [i] (lower)
    level: выра́внивать [i] (even out), вы́ровнять [p], нивели́ровать [b], ура́внивать [i] (equalize), сровня́ть [p] (raze)
    liberate: освобожда́ть [i], освободи́ть [p], избавля́ть [i] (deliver from suffering), изба́вить [p]
    lick: лиза́ть [i], лизну́ть [p], обли́зывать [i] (lick off), облиза́ть [p]
    lie: лгать [i] (tell a lie), солга́ть [p], врать [i] (fib), лежа́ть [i] (be lying down), лечь [p] (lie down)
    lift: поднима́ть [i], подня́ть [p], снима́ть [i] (a ban), снять [p], отменя́ть [i] (a ban)
    light: зажига́ть [i] (a candle, a fire), заже́чь [p], освеща́ть [i] (illuminate), освети́ть [p], включа́ть [i] (switch on a light)
    lighten: облегча́ть [i] (reduce a burden), облегчи́ть [p], осветля́ть [i] (make lighter in color), осветли́ть [p], проясня́ться [i] (become brighter)
    like: люби́ть [i], полюби́ть [p], нра́виться [i] (be pleasing to), понра́виться [p], цени́ть [i] (appreciate)
    limit: ограни́чивать [i], ограни́чить [p], лими́тировать [b]
    linger: заде́рживаться [i] (stay on), задержа́ться [p], ме́длить [i] (dawdle), остава́ться [i] (remain, persist), оста́ться [p]
    link: свя́зывать [i] (associate, connect), связа́ть [p], соединя́ть [i] (connect), соедини́ть [p]
    liquidate: ликвиди́ровать [b] (wind up a company, eliminate), реализова́ть [b] (convert to cash), погаша́ть [i] (pay off a debt), погаси́ть [p], уничтожа́ть [i] (eliminate people)
    listen: слу́шать [i] (listen attentively), послу́шать [p], прислу́шиваться [i] (listen out for), прислу́шаться [p]
    listen to: слу́шать [i] (music, radio; a person), послу́шать [p], выслу́шивать [i] (listen carefully), вы́слушать [p]
    live: жить [i], прожива́ть [i] (reside), прожи́ть [p] (spend one's days), существова́ть [i] (be alive)
    load: грузи́ть [i] (load a vehicle, cargo), загружа́ть [i] (data), загрузи́ть [p], заряжа́ть [i] (charge a battery, load a gun), заряди́ть [p]
    loathe: ненави́деть [i], возненави́деть [p], презира́ть [i] (despise), презре́ть [p], брезгова́ть [i] (have an aversion to)
    locate: находи́ть [i] (find, track down), найти́ [p], определя́ть [i] (pinpoint), определи́ть [p], находи́ться [i] (be situated)
    lock: запира́ть [i] (lock with a key), запере́ть [p], блоки́ровать [b] (block, lock out), заблоки́ровать [b], закрыва́ть [i] (bolt)
    log: регистри́ровать [i] (record events), зарегистри́ровать [p], протоколи́ровать [b], запи́сывать [i] (enter in a record), записа́ть [p]
    long: жа́ждать [i] (crave), тоскова́ть [i] (long for something lost), мечта́ть [i] (long for), стреми́ться [i] (aspire)
    look: смотре́ть [i] (gaze), посмотре́ть [p], вы́глядеть [i] (appear, look like), каза́ться [i] (seem), гляде́ть [i] (colloquial)
    look after: уха́живать [i] (nurse, tend), присма́тривать [i] (keep an eye on), присмотре́ть [p], забо́титься [i] (take care of), позабо́титься [p]
    look at: смотре́ть [i], посмотре́ть [p], рассма́тривать [i] (examine), рассмотре́ть [p], наблюда́ть [i] (observe)
    look for: иска́ть [i], поиска́ть [p], разы́скивать [i] (hunt for a suspect or thing), разыска́ть [p]
    look up: иска́ть [i] (a word, in a dictionary; search online), найти́ [p], проверя́ть [i] (check), прове́рить [p], справля́ться [i] (consult a reference book)
    loosen: ослабля́ть [i], осла́бить [p], развя́зывать [i] (untie), развяза́ть [p], расслабля́ть [i] (loosen up)
    lose: теря́ть [i], потеря́ть [p], проигрыва́ть [i] (a game), проигра́ть [p], лиша́ться [i] (forfeit)
    love: люби́ть [i] (hold dear), полюби́ть [p], влюби́ться [p] (fall in love), обожа́ть [i], дорожи́ть [i] (cherish)
    lower: снижа́ть [i] (reduce a price), сни́зить [p], опуска́ть [i] (take down), опусти́ть [p], понижа́ть [i] (decrease)
    lull: усыпля́ть [i] (lull to sleep or into security), усыпи́ть [p], убаю́кивать [i] (soothe a baby), убаю́кать [p], успока́ивать [i] (calm)
    lurk: таи́ться [i] (lurk, as danger), затаи́ться [p], подстерега́ть [i] (lie in wait for), подстере́чь [p], высма́тривать [i] (watch stealthily)
    magnify: увели́чивать [i] (enlarge optically), увели́чить [p], уси́ливать [i] (amplify), преувели́чивать [i] (exaggerate), преувели́чить [p]
    maim: кале́чить [i], искале́чить [p], уве́чить [i] (mutilate), изуве́чить [p], обезобра́живать [i] (disfigure)
    maintain: подде́рживать [i] (keep up), поддержа́ть [p], обслу́живать [i] (service equipment), утвержда́ть [i] (assert, claim), содержа́ть [i] (look after equipment)
    make: де́лать [i], сде́лать [p], создава́ть [i] (create), изготовля́ть [i] (manufacture), заставля́ть [i] (force)
    make up: выду́мывать [i] (invent a story), вы́думать [p], кра́ситься [i] (apply makeup), помири́ться [p] (reconcile), навёрстывать [i] (make up for something missed)
    malfunction: отка́зывать [i] (fail), отказа́ть [p], лома́ться [i] (break down), слома́ться [p], барахли́ть [i] (colloquial, stop working)
    manage: управля́ть [i] (run a team or firm, administer), руководи́ть [i], справля́ться [i] (succeed in), спра́виться [p], суме́ть [p] (manage to do)
    mangle: кале́чить [i] (mutilate), искале́чить [p], изуро́довать [p] (wreck), разорва́ть [p] (tear to shreds), испо́ртить [p] (botch)
    manipulate: манипули́ровать [i], управля́ть [i] (machines, control), направля́ть [i] (steer others), напра́вить [p]
    manufacture: производи́ть [i], произвести́ [p], изготовля́ть [i], изгото́вить [p], выпуска́ть [i]
    map: картографи́ровать [b] (chart an area), отобража́ть [i] (map data), отобрази́ть [p], сопоставля́ть [i] (map one set to another), сопоста́вить [p]
    march: марширова́ть [i], промарширова́ть [p], шага́ть [i] (stride), ше́ствовать [i] (protest march), наступа́ть [i] (advance on)
    marinate: маринова́ть [i], замаринова́ть [p], выма́чивать [i] (soak in seasoning)
    mark: отмеча́ть [i] (tick off; commemorate an occasion), отме́тить [p], помеча́ть [i] (label), поме́тить [p], оце́нивать [i] (grade a test)
    market: продава́ть [i] (sell), прода́ть [p], рекла́мировать [i] (promote, advertise), продвига́ть [i] (promote), коммерциализи́ровать [b] (commercialize)
    marvel: восхища́ться [i] (admire), восхити́ться [p], удивля́ться [i] (marvel at), удиви́ться [p], любова́ться [i]
    mash: мять [i] (mash with a fork; mash potatoes), размя́ть [p], толо́чь [i] (pound), протира́ть [i] (puree), протере́ть [p]
    mask: маскирова́ть [i], замаскирова́ть [p], скрыва́ть [i] (conceal), скрыть [p], завуали́ровать [p] (veil)
    massage: массирова́ть [i], помассирова́ть [p], размина́ть [i] (knead muscles), размя́ть [p]
    master: осва́ивать [i] (command a skill), осво́ить [p], овладева́ть [i] (a skill), овладе́ть [p], справля́ться [i] (cope successfully)
    match: соотве́тствовать [i] (correspond to), подходи́ть [i] (go well with), подойти́ [p], сочета́ться [b] (go well together), подбира́ть [i] (pair up)
    materialize: осуществля́ться [i] (come about, come true), осуществи́ться [p], появля́ться [i] (appear), появи́ться [p], воплоща́ть [i] (give concrete form)
    matter: значи́ть [i] (count, be of significance), счита́ться [i] (be considered important)
    maximize: максимизи́ровать [b], увели́чивать [i] (push to the limit), увели́чить [p], оптимизи́ровать [b]
    mean: означа́ть [i] (signify), значи́ть [i], подразумева́ть [i] (imply, intend to say), намерева́ться [i] (intend), обознача́ть [i] (denote)
    measure: измеря́ть [i], изме́рить [p], ме́рить [i], замеря́ть [i] (measure the dimensions of), заме́рить [p]
    mediate: посре́дничать [i] (act as go-between), ула́живать [i] (settle a dispute), ула́дить [p], примиря́ть [i], примири́ть [p]
    meet: встреча́ть [i] (run into, welcome), встре́тить [p], встреча́ться [i] (arrange to meet), встре́титься [p], познако́миться [p] (for the first time)
    melt: та́ять [i] (snow, ice), раста́ять [p], растопля́ть [i] (melt something), растопи́ть [p], пла́вить [i] (metal)
    memorize: запомина́ть [i], запо́мнить [p], зау́чивать [i] (impress on the mind), заучи́ть [p], вы́учить [p] (learn by heart)
    mend: чини́ть [i] (repair), почини́ть [p], што́пать [i] (darn socks), зашто́пать [p], зашива́ть [i] (stitch up)
    mention: упомина́ть [i], упомяну́ть [p], называ́ть [i] (name), назва́ть [p], затра́гивать [i] (touch on)
    meow: мяу́кать [i] (of a cat), мяу́кнуть [p]
    merge: объединя́ть [i] (combine), объедини́ть [p], соединя́ть [i], соедини́ть [p], объединя́ться [i] (companies)
    merit: заслу́живать [i], заслужи́ть [p]
    migrate: мигри́ровать [i] (birds, herds; data, systems), эмигри́ровать [b] (emigrate), переселя́ться [i] (people), пересели́ться [p], переноси́ть [i] (migrate a system)
    mimic: подража́ть [i], имити́ровать [i], передра́знивать [i] (ape mockingly), передразни́ть [p], пароди́ровать [b] (parody)
    minimize: минимизи́ровать [b], уменьша́ть [i] (reduce), уме́ньшить [p], свора́чивать [i] (a window), преуменьша́ть [i] (play down)
    mislead: обма́нывать [i] (deceive), обману́ть [p], дура́чить [i] (delude), одура́чить [p], дезинформи́ровать [b]
    misplace: затеря́ть [p] (lose by carelessness), теря́ть [i], потеря́ть [p], запропасти́ть [p] (colloquial)
    miss: скуча́ть [i] (feel the absence of), пропуска́ть [i] (a bus, a train), пропусти́ть [p], промахну́ться [p] (a target), упуска́ть [i] (a chance)
    mistake: пу́тать [i] (confuse one for another), перепу́тать [p], спу́тать [p], ошиба́ться [i] (be mistaken), ошиби́ться [p]
    mix: сме́шивать [i], смеша́ть [p], переме́шивать [i] (stir together), перемеша́ть [p], сме́шиваться [i] (become mixed)
    mobilize: мобилизова́ть [b], призыва́ть [i] (call up), призва́ть [p], собира́ть [i] (muster), собра́ть [p]
    mock: высме́ивать [i] (ridicule), вы́смеять [p], насмеха́ться [i] (make fun of), издева́ться [i] (taunt sarcastically), дразни́ть [i] (tease)
    modify: изменя́ть [i], измени́ть [p], модифици́ровать [b], видоизменя́ть [i] (alter the structure), видоизмени́ть [p]
    moisten: увлажня́ть [i], увлажни́ть [p], сма́чивать [i] (wet), смочи́ть [p], сыре́ть [i] (become moist)
    mold: лепи́ть [i] (shape by hand), слепи́ть [p], отлива́ть [i] (cast metal), отли́ть [p], формирова́ть [i] (shape a character)
    monitor: контроли́ровать [i], наблюда́ть [i] (observe), следи́ть [i] (keep an eye on), отсле́живать [i] (track), отследи́ть [p]
    mortgage: закла́дывать [i] (pledge, as collateral), заложи́ть [p], обременя́ть [i] (encumber with a mortgage), обремени́ть [p]
    motivate: мотиви́ровать [b], стимули́ровать [b], побужда́ть [i], побуди́ть [p], воодушевля́ть [i] (boost morale)
    mount: поднима́ться [i] (rise), подня́ться [p], взбира́ться [i] (get on, climb up), взобра́ться [p], монти́ровать [i] (fit in place, attach)
    move: дви́гать [i] (move something), дви́нуть [p], дви́гаться [i] (change position), переезжа́ть [i] (relocate, move house), перее́хать [p]
    muffle: заглуша́ть [i] (deaden, a sound), заглуши́ть [p], приглуша́ть [i] (dampen), приглуши́ть [p], заку́тывать [i] (wrap up)
    multiply: умножа́ть [i] (in math), умно́жить [p], размножа́ться [i] (breed), размно́житься [p], увели́чиваться [i] (grow in number)
    mumble: бормота́ть [i], пробормота́ть [p], бубни́ть [i], пробубни́ть [p]
    munch: жева́ть [i] (chew), пожева́ть [p], ча́вкать [i] (munch noisily), грызть [i] (gnaw, nibble), хрумка́ть [i] (munch crunchy food)
    murder: убива́ть [i], уби́ть [p], умерщвля́ть [i], умертви́ть [p]
    murmur: шепта́ть [i] (whisper), прошепта́ть [p], бормота́ть [i], пробормота́ть [p], гуде́ть [i] (of a crowd)
    muse: размышля́ть [i] (reflect on), поразмышля́ть [p], разду́мывать [i] (brood), заду́мываться [i] (brood), заду́маться [p]
    must: приходи́ться [i] (have to, obligation), полага́ться [i] (be supposed to), обя́зывать [i] (make obligatory), обяза́ть [p], тре́бовать [i] (require)
    mutter: бормота́ть [i], пробормота́ть [p], ворча́ть [i] (grumble), проворча́ть [p], бурча́ть [i] (mutter complaints)
    nag: пили́ть [i] (carp, scold), придира́ться [i] (carp), пристава́ть [i] (pester), приста́ть [p], надоеда́ть [i] (pester endlessly)
    nail: прибива́ть [i], приби́ть [p], забива́ть [i] (hammer in), заби́ть [p], пригвожда́ть [i] (pin down)
    name: называ́ть [i] (give a name to), назва́ть [p], назнача́ть [i] (appoint to a post), назна́чить [p]
    narrow: сужа́ть [i], су́зить [p], сужа́ться [i] (become narrower), су́зиться [p], ограни́чивать [i] (narrow down)
    navigate: вести́ [i] (steer, a ship), управля́ть [i] (steer or pilot), ориенти́роваться [i] (find the way), сориенти́роваться [p], проводи́ть [i] (guide through)
    need: нужда́ться [i] (require), тре́боваться [i] (be necessary), потре́боваться [p], понадоби́ться [p], тре́бовать [i] (require)
    neglect: пренебрега́ть [i], пренебре́чь [p], забра́сывать [i], забро́сить [p], игнори́ровать [i] (disregard)
    negotiate: догова́риваться [i] (hammer out a deal), договори́ться [p], торгова́ться [i] (haggle over a price), поторгова́ться [p], согласо́вывать [i] (agree on terms)
    nest: гнезди́ться [i] (birds), гнездова́ться [i] (birds of prey), выси́живать [i] (brood)
    neutralize: нейтрализова́ть [b], обезвре́живать [i], обезвре́дить [p], уравнове́шивать [i], уравнове́сить [p]
    nibble: грызть [i], погры́зть [p], поку́сывать [i] (bite lightly), ла́комиться [i] (sweets), пола́комиться [p]
    nod: кива́ть [i] (the head; to someone), кивну́ть [p]
    nominate: выдвига́ть [i] (propose a candidate), вы́двинуть [p], номини́ровать [b], назнача́ть [i], назна́чить [p]
    notice: замеча́ть [i], заме́тить [p], примеча́ть [i] (catch sight of), приме́тить [p], уви́деть [p]
    notify: уведомля́ть [i], уве́домить [p], информи́ровать [i], проинформи́ровать [p], сообщи́ть [p] (inform)
    nourish: пита́ть [i], корми́ть [i], накорми́ть [p], выка́рмливать [i], вы́кормить [p]
    nudge: подта́лкивать [i] (push lightly), подтолкну́ть [p], толка́ть [i], толкну́ть [p], ткнуть [p] (poke gently)
    numb: онемева́ть [i] (go numb), онеме́ть [p], притупля́ть [i] (emotionally), притупи́ть [p], обезбо́ливать [i] (anaesthetize)
    obey: подчиня́ться [i] (an order), подчини́ться [p], слу́шаться [i] (someone), послу́шаться [p], соблюда́ть [i] (a rule)
    object: возража́ть [i], возрази́ть [p], протестова́ть [i], жа́ловаться [i] (complain about), оспа́ривать [i] (dispute)
    oblige: обя́зывать [i], обяза́ть [p], заставля́ть [i] (compel), заста́вить [p], вынужда́ть [i]
    obscure: заслоня́ть [i] (hide from view), заслони́ть [p], затемня́ть [i] (darken), затума́нивать [i] (make unclear), затума́нить [p]
    observe: наблюда́ть [i], соблюда́ть [i] (a rule), соблюсти́ [p], замеча́ть [i] (remark), заме́тить [p]
    obsess: му́чить [i] (torment), пресле́довать [i] (occupy the mind), зацикли́ваться [i] (fixate on), зацикли́ться [p]
    obstruct: препя́тствовать [i] (hinder), прегражда́ть [i] (a path), прегради́ть [p], загора́живать [i] (block), загороди́ть [p]
    obtain: получа́ть [i], получи́ть [p], добыва́ть [i] (procure), добы́ть [p], приобрета́ть [i]
    occupy: занима́ть [i] (space, time), заня́ть [p], занима́ться [i] (keep busy), захва́тывать [i] (take by force), оккупи́ровать [b] (military)
    occur: происходи́ть [i] (an event), произойти́ [p], случа́ться [i], случи́ться [p], встреча́ться [i] (be found)
    offend: обижа́ть [i] (hurt feelings), оби́деть [p], оскорбля́ть [i] (insult), оскорби́ть [p], задева́ть [i] (hurt feelings)
    offer: предлага́ть [i] (propose to do), предложи́ть [p], предоставля́ть [i], предоста́вить [p], вызыва́ться [i] (volunteer)
    offset: компенси́ровать [b], возмеща́ть [i], возмести́ть [p], уравнове́шивать [i], уравнове́сить [p]
    omit: пропуска́ть [i], пропусти́ть [p], опуска́ть [i], опусти́ть [p], исключа́ть [i] (leave out)
    ooze: сочи́ться [i] (leak, seep), просочи́ться [p], проса́чиваться [i] (seep), выделя́ть [i] (ooze liquid), вы́делить [p]
    open: открыва́ть [i], откры́ть [p], открыва́ться [i] (intransitive), откры́ться [p]
    operate: управля́ть [i] (a machine; run a business), опери́ровать [b] (surgery), рабо́тать [i] (function), функциони́ровать [i] (function), эксплуати́ровать [b] (a machine)
    oppose: противостоя́ть [i], проти́виться [i], воспроти́виться [p], боро́ться [i] (fight against), противоде́йствовать [i]
    oppress: угнета́ть [i], угнести́ [p], притесня́ть [i], притесни́ть [p], подавля́ть [i] (weigh down)
    optimize: оптимизи́ровать [b]
    orchestrate: оркестрова́ть [b] (music), организова́ть [b] (coordinate), согласо́вывать [i] (coordinate), ста́вить [i] (stage), поста́вить [p]
    order: зака́зывать [i] (a meal, goods), заказа́ть [p], прика́зывать [i] (command), приказа́ть [p], упоря́дочивать [i] (arrange in order)
    organize: организова́ть [b], организо́вывать [i] (an event), упоря́дочивать [i] (put in order), упоря́дочить [p], устра́ивать [i] (an event)
    orient: ориенти́ровать [b], направля́ть [i], напра́вить [p], выра́внивать [i] (align), вы́ровнять [p]
    oust: смеща́ть [i] (remove from office), смести́ть [p], вытесня́ть [i] (displace), вы́теснить [p], изгоня́ть [i] (drive out)
    outdo: превосходи́ть [i], превзойти́ [p], затмева́ть [i], затми́ть [p], опережа́ть [i]
    outline: обрисо́вывать [i] (explain in outline), обрисова́ть [p], набра́сывать [i] (sketch), набро́сить [p], излага́ть [i]
    outperform: превосходи́ть [i], превзойти́ [p], опережа́ть [i], опереди́ть [p], обгоня́ть [i]
    overcome: преодолева́ть [i], преодоле́ть [p] (a task), побежда́ть [i] (defeat), победи́ть [p], одолева́ть [i]
    overdo: преувели́чивать [i] (exaggerate), преувели́чить [p], переборщи́ть [p] (colloquial), перестара́ться [p] (overexert), переутомля́ться [i] (overexert)
    overflow: переполня́ться [i], перепо́лниться [p], перелива́ться [i] (spill over), разлива́ться [i] (a river), затопля́ть [i] (flood)
    overhear: подслу́шивать [i], подслу́шать [p], услы́шать [p] (hear by chance), улови́ть [p] (catch a remark)
    overlap: перекрыва́ться [i], перекры́ться [p], накла́дываться [i], наложи́ться [p], совпада́ть [i] (coincide)
    overpower: одолева́ть [i], одоле́ть [p], побежда́ть [i] (defeat), победи́ть [p], подавля́ть [i] (overcome)
    override: отменя́ть [i] (annul), отмени́ть [p], переопределя́ть [i] (a setting), переопредели́ть [p], игнори́ровать [i] (disregard)
    overrule: отменя́ть [i] (annul a decision), отмени́ть [p], аннули́ровать [b], отклоня́ть [i] (outvote), отклони́ть [p]
    oversee: курирова́ть [i] (manage), надзира́ть [i], наблюда́ть [i], контроли́ровать [i], руководи́ть [i]
    overtake: обгоня́ть [i], обогна́ть [p], догоня́ть [i] (catch up with), догна́ть [p], опережа́ть [i]
    overthrow: сверга́ть [i] (a ruler), све́ргнуть [p], опроки́дывать [i], опроки́нуть [p], срыва́ть [i] (a plan or decision)
    overturn: опроки́дывать [i] (knock over), опроки́нуть [p], перевора́чивать [i], переверну́ть [p], отменя́ть [i] (a verdict, a ruling)
    overwhelm: ошеломля́ть [i], ошеломи́ть [p], захлёстывать [i] (swamp with), захлестну́ть [p], подавля́ть [i] (be too much for)
    overwrite: перезапи́сывать [i], перезаписа́ть [p], затира́ть [i] (data), затере́ть [p]
    owe: задолжа́ть [p] (owe money)
    own: владе́ть [i], облада́ть [i], име́ть [i]
    pacify: успока́ивать [i], успоко́ить [p], усмиря́ть [i] (a region), усмири́ть [p], умиротворя́ть [i]
    pack: упако́вывать [i] (for shipping), упакова́ть [p], пакова́ть [i], укла́дывать [i] (luggage), уложи́ть [p]
    paddle: грести́ [i] (row, paddle), плеска́ться [i] (splash in shallow water), бара́хтаться [i] (splash about), шлёпать [i] (wade in shallow water)
    paint: рисова́ть [i] (a picture), нарисова́ть [p], кра́сить [i] (a wall, a car), покра́сить [p], писа́ть [i] (a picture)
    parade: дефили́ровать [i], ше́ствовать [i], щеголя́ть [i] (show off), красова́ться [i] (show off), демонстри́ровать [b] (show off)
    paralyze: парализова́ть [b], обездви́живать [i], обездви́жить [p], ско́вывать [i], скова́ть [p]
    paraphrase: перефрази́ровать [b], переска́зывать [i] (put in other words), пересказа́ть [p], парафрази́ровать [b]
    park: паркова́ть [i] (a car), припаркова́ть [p], ста́вить [i] (a car), поста́вить [p], паркова́ться [i] (into a space)
    parody: пароди́ровать [b], высме́ивать [i] (satirize), вы́смеять [p]
    partake: уча́ствовать [i] (join in), угоща́ться [i] (food, drink), угости́ться [p], отве́дать [p] (food, drink), разделя́ть [i] (share in)
    participate: уча́ствовать [i], поуча́ствовать [p]
    pass: проходи́ть [i] (go past), пройти́ [p], передава́ть [i] (hand over), сдава́ть [i] (an exam), принима́ть [i] (a law)
    paste: вставля́ть [i] (text, files), вста́вить [p], накле́ивать [i] (glue), накле́ить [p], нама́зывать [i] (spread on)
    pat: гла́дить [i] (stroke), погла́дить [p], похло́пывать [i] (tap lightly), похло́пать [p], потрепа́ть [p] (pat lightly)
    patch: чини́ть [i], почини́ть [p], лата́ть [i], залата́ть [p], обновля́ть [i] (software)
    patrol: патрули́ровать [i], охраня́ть [i] (guard), охрани́ть [p], обходи́ть [i] (make rounds), обойти́ [p]
    pause: остана́вливаться [i] (stop for a moment), останови́ться [p], приостана́вливать [i] (interrupt), приостанови́ть [p], замира́ть [i] (stop for a moment)
    pave: мости́ть [i], вы́мостить [p], асфальти́ровать [i], заасфальти́ровать [p], покрыва́ть [i] (cover a surface)
    pawn: закла́дывать [i] (give as security), заложи́ть [p]
    pay: плати́ть [i], заплати́ть [p], опла́чивать [i] (a bill), оплати́ть [p], распла́чиваться [i] (settle a bill)
    pay back: возвраща́ть [i] (refund; pay back a loan), верну́ть [p], возмеща́ть [i] (reimburse), отпла́чивать [i] (take revenge), отплати́ть [p]
    pedal: крути́ть [i] (the pedals), нажима́ть [i] (a pedal), нажа́ть [p], ката́ться [i] (ride a bike)
    peek: загля́дывать [i], загляну́ть [p], подгля́дывать [i] (spy), подгляде́ть [p], выгля́дывать [i] (peek out)
    peel: чи́стить [i] (fruit, potatoes, eggs), почи́стить [p], очища́ть [i], очи́стить [p], шелуши́ться [i] (peel off)
    penalize: штрафова́ть [i], оштрафова́ть [p], нака́зывать [i], наказа́ть [p], ущемля́ть [i] (disadvantage)
    perceive: воспринима́ть [i], восприня́ть [p], ощуща́ть [i] (feel), ощути́ть [p], осознава́ть [i] (recognize)
    perch: сади́ться [i] (a bird, alight), сесть [p], примости́ться [p] (sit on the edge), сиде́ть [i] (on a branch), восседа́ть [i] (sit high up)
    perfect: соверше́нствовать [i], усоверше́нствовать [p], отта́чивать [i] (polish), отточи́ть [p], шлифова́ть [i] (polish)
    perform: выполня́ть [i] (carry out), вы́полнить [p], исполня́ть [i] (a play, a piece; music), испо́лнить [p], выступа́ть [i] (on stage)
    perish: погиба́ть [i] (die), поги́бнуть [p], гнить [i] (rot), сгнить [p], умира́ть [i] (die)
    permit: разреша́ть [i] (officially), разреши́ть [p], позволя́ть [i], позво́лить [p], допуска́ть [i]
    perpetuate: увекове́чивать [i], увекове́чить [p], закрепля́ть [i] (keep going), закрепи́ть [p], подде́рживать [i] (keep going)
    persevere: продолжа́ть [i] (carry on), выде́рживать [i] (endure), вы́держать [p], держа́ться [i] (hold out), упо́рствовать [i] (persist stubbornly)
    persist: упо́рствовать [i] (insist), продолжа́ться [i] (last), сохраня́ться [i] (continue to exist), сохрани́ться [p], настаива́ть [i] (insist)
    persuade: убежда́ть [i], убеди́ть [p], угова́ривать [i], уговори́ть [p], склоня́ть [i]
    pester: надоеда́ть [i], пристава́ть [i] (with questions), приста́ть [p], донима́ть [i], доня́ть [p]
    phone: звони́ть [i], позвони́ть [p], телефони́ровать [b], созвони́ться [p] (call each other), дозвони́ться [p] (get through)
    photograph: фотографи́ровать [i], сфотографи́ровать [p], снима́ть [i], снять [p], щёлкнуть [p] (snap casually)
    pick: выбира́ть [i] (choose), вы́брать [p], собира́ть [i] (pick up; fruit, flowers), рвать [i] (flowers, fruit), сорва́ть [p]
    pick out: выбира́ть [i], вы́брать [p], отбира́ть [i], отобра́ть [p], выделя́ть [i] (single out)
    pick up: поднима́ть [i] (from the floor), подня́ть [p], забира́ть [i] (collect someone or something), забра́ть [p], подбира́ть [i] (a passenger)
    pierce: пронза́ть [i] (stab), пронзи́ть [p], прока́лывать [i], проколо́ть [p], проткну́ть [p]
    pile up: нагроможда́ть [i], нагромозди́ть [p], нака́пливать [i] (accumulate), накопи́ть [p], ска́пливаться [i] (accumulate, intransitive)
    pilot: пилоти́ровать [i], управля́ть [i], проводи́ть [i] (guide through), провести́ [p]
    pin: прика́лывать [i] (with a pin), приколо́ть [p], прикрепля́ть [i] (to a board; fasten), прикрепи́ть [p], прижима́ть [i] (hold down)
    pinch: щипа́ть [i], щипну́ть [p], прищемля́ть [i] (trap), прищеми́ть [p], стащи́ть [p] (steal, informal)
    pinpoint: определя́ть [i] (locate exactly), определи́ть [p], уточня́ть [i] (specify), уточни́ть [p], выявля́ть [i] (identify exactly)
    pitch: броса́ть [i] (throw a ball), бро́сить [p], разбива́ть [i] (a tent), разби́ть [p], предлага́ть [i] (an idea)
    pity: жале́ть [i], пожале́ть [p], сочу́вствовать [i], сострада́ть [i]
    place: класть [i] (flat), положи́ть [p], ста́вить [i] (upright), поста́вить [p], размеща́ть [i]
    plague: му́чить [i] (afflict, torment), заму́чить [p], терза́ть [i], донима́ть [i] (harass), пресле́довать [i] (afflict)
    plan: плани́ровать [i], запланирова́ть [p], спланирова́ть [p], проекти́ровать [i] (design), спроекти́ровать [p]
    plant: сажа́ть [i], посади́ть [p], се́ять [i] (sow seeds), посе́ять [p], выра́щивать [i] (grow a crop)
    plaster: штукату́рить [i] (a wall), оштукату́рить [p], гипсова́ть [i] (a broken limb), загипсова́ть [p], обкле́ивать [i] (cover with posters)
    play: игра́ть [i] (games, sports, instruments), сыгра́ть [p], поигра́ть [p] (have fun), воспроизводи́ть [i] (a recording), воспроизвести́ [p]
    plead: умоля́ть [i] (beg), умоли́ть [p], моли́ть [i] (ask earnestly), защища́ть [i] (argue a case), ходата́йствовать [i] (appeal)
    please: нра́виться [i] (be pleasing to), понра́виться [p], ра́довать [i] (delight), обра́довать [p], угожда́ть [i] (satisfy)
    pledge: обеща́ть [i], пообеща́ть [p], кля́сться [i] (swear an oath), покля́сться [p], обя́зываться [i] (pledge to do)
    plot: замышля́ть [i] (a scheme), замы́слить [p], плести́ [i] (conspire), стро́ить [i] (a graph), постро́ить [p]
    plow: паха́ть [i], вспаха́ть [p], вспа́хивать [i]
    pluck: ощи́пывать [i] (a bird), ощипа́ть [p], выщи́пывать [i] (eyebrows, feathers), вы́щипать [p], срыва́ть [i] (flowers, fruit)
    plug: подключа́ть [i] (connect, plug in), подключи́ть [p], включа́ть [i] (plug in), затыка́ть [i] (a hole), заткну́ть [p]
    plunder: гра́бить [i], огра́бить [p], разграбля́ть [i], разграби́ть [p], мародёрствовать [i]
    plunge: ныря́ть [i] (dive in), нырну́ть [p], погружа́ть [i] (immerse), погрузи́ть [p], ру́хнуть [p] (fall steeply, drop sharply)
    point: ука́зывать [i] (at something; indicate), указа́ть [p], пока́зывать [i] (at something), направля́ть [i] (aim at), напра́вить [p]
    point out: ука́зывать [i], указа́ть [p], отмеча́ть [i], отме́тить [p], подчёркивать [i] (stress)
    poison: отравля́ть [i], отрави́ть [p], трави́ть [i] (kill with poison), загрязня́ть [i] (contaminate, foul), загрязни́ть [p]
    poke: ты́кать [i] (jab, prod), ткнуть [p], толкну́ть [p] (nudge), ковыря́ть [i] (in something), копа́ться [i] (probe)
    polish: полирова́ть [i], отполирова́ть [p], начища́ть [i] (shoes), начи́стить [p], шлифова́ть [i] (refine)
    pollute: загрязня́ть [i], загрязни́ть [p], отравля́ть [i] (contaminate), отрави́ть [p], заража́ть [i] (contaminate)
    ponder: размышля́ть [i], поразмышля́ть [p], обду́мывать [i], обду́мать [p], разду́мывать [i] (brood)
    pop: ло́паться [i] (burst), ло́пнуть [p], хло́пать [i] (go bang), хло́пнуть [p], прока́лывать [i] (a bubble or blister)
    populate: населя́ть [i], засели́ть [p], заселя́ть [i], обита́ть [i] (inhabit)
    portray: изобража́ть [i] (depict), изобрази́ть [p], игра́ть [i] (a role), сыгра́ть [p], воплоща́ть [i] (a role)
    pose: пози́ровать [i] (for a photo), попози́ровать [p], задава́ть [i] (a question), зада́ть [p], создава́ть [i] (a threat, a problem)
    position: размеща́ть [i], размести́ть [p], располага́ть [i], расположи́ть [p], позициони́ровать [b]
    possess: облада́ть [i], владе́ть [i], име́ть [i], занима́ть [i] (a position or title), заня́ть [p]
    post: публикова́ть [i] (online; publish), опубликова́ть [p], размеща́ть [i] (a notice, online), выве́шивать [i] (on a board), отправля́ть [i] (mail)
    postpone: откла́дывать [i], отложи́ть [p], переноси́ть [i] (a meeting), перенести́ [p], отсро́чивать [i]
    pound: колоти́ть [i] (knock, thump), бить [i] (beat), колоти́ться [i] (throb), ба́рабанить [i] (beat), дроби́ть [i] (crush)
    pour: лить [i], налива́ть [i] (a drink), нали́ть [p], разлива́ть [i] (pour into), вылива́ть [i] (spill out)
    practice: практикова́ть [i] (a profession), упражня́ться [i], тренирова́ться [i] (sports), репети́ровать [i] (rehearse), применя́ть [i] (put into practice)
    praise: хвали́ть [i], похвали́ть [p], восхваля́ть [i], восхвали́ть [p], превозноси́ть [i]
    pray: моли́ться [i], помоли́ться [p], умоля́ть [i] (beg), умоли́ть [p]
    preach: пропове́довать [i], возвеща́ть [i] (proclaim), поуча́ть [i] (lecture on morals), морализи́ровать [i] (lecture on morals), провозглаша́ть [i] (proclaim)
    precede: предше́ствовать [i], предваря́ть [i], предвари́ть [p], опережа́ть [i], опереди́ть [p]
    predict: предска́зывать [i], предсказа́ть [p], прогнози́ровать [i], спрогнози́ровать [p], предви́деть [i] (foresee)
    prefer: предпочита́ть [i], предпоче́сть [p]
    preheat: разогрева́ть [i], разогре́ть [p], прогрева́ть [i], прогре́ть [p]
    preoccupy: занима́ть [i] (occupy the mind), заня́ть [p], беспоко́ить [i] (worry), трево́жить [i] (worry), поглоща́ть [i] (be absorbed in)
    prepare: гото́вить [i] (food, get ready), пригото́вить [p], подгото́вить [p], подгота́вливать [i], гото́виться [i] (get ready)
    prescribe: назнача́ть [i] (a treatment), назна́чить [p], выпи́сывать [i] (a drug), вы́писать [p], предпи́сывать [i] (dictate a rule)
    present: представля́ть [i] (introduce, a person), предста́вить [p], вруча́ть [i] (hand over), вручи́ть [p], дари́ть [i] (give a gift)
    preserve: сохраня́ть [i], сохрани́ть [p], консерви́ровать [b] (food), храни́ть [i], бере́чь [i] (protect)
    preside: председа́тельствовать [i] (a meeting), вести́ [i], возглавля́ть [i] (take charge), возглави́ть [p], руководи́ть [i]
    press: нажима́ть [i] (a button), нажа́ть [p], дави́ть [i] (push against), сжима́ть [i] (squeeze), гла́дить [i] (clothes)
    presume: предполага́ть [i] (suppose, assume), предположи́ть [p], полага́ть [i] (assume), допуска́ть [i] (take for granted), допусти́ть [p]
    pretend: притворя́ться [i], притвори́ться [p], симули́ровать [b] (feign), прики́дываться [i] (colloquial), прики́нуться [p]
    prevail: преоблада́ть [i] (be widespread, predominate), госпо́дствовать [i], побежда́ть [i] (win out), победи́ть [p], восторжествова́ть [p] (triumph)
    prevent: предотвраща́ть [i], предотврати́ть [p], меша́ть [i] (keep from doing), помеша́ть [p], препя́тствовать [i]
    prick: коло́ть [i], уколо́ть [p], прока́лывать [i], проколо́ть [p], пронза́ть [i]
    print: печа́тать [i], напеча́тать [p], распеча́тывать [i] (from a computer), распеча́тать [p], издава́ть [i] (publish a text)
    probe: иссле́довать [b], зонди́ровать [i], прозонди́ровать [p], рассле́довать [b] (investigate), прощу́пывать [i]
    proceed: продолжа́ть [i] (continue, go on), продо́лжить [p], приступа́ть [i] (set about it), приступи́ть [p], поступа́ть [i] (act)
    process: обраба́тывать [i], обрабо́тать [p], перераба́тывать [i] (food, materials), перерабо́тать [p], оформля́ть [i] (a transaction)
    proclaim: провозглаша́ть [i], провозгласи́ть [p], объявля́ть [i], объяви́ть [p], возвеща́ть [i]
    produce: производи́ть [i], произвести́ [p], выпуска́ть [i], продюси́ровать [b] (a film, show), выраба́тывать [i]
    profess: испове́довать [i] (a faith), заявля́ть [i] (declare openly), заяви́ть [p], призна́ть [p] (declare openly), утвержда́ть [i] (assert)
    program: программи́ровать [i], запрограмми́ровать [p]
    progress: продвига́ться [i], продви́нуться [p], прогресси́ровать [i], развива́ться [i], улучша́ться [i] (improve)
    prohibit: запреща́ть [i], запрети́ть [p], воспреща́ть [i] (formal), воспрети́ть [p]
    project: проеци́ровать [i] (an image, onto a screen), спроеци́ровать [p], выступа́ть [i] (stick out), прогнози́ровать [i] (estimate the future), спрогнози́ровать [p]
    prolong: продлева́ть [i], продли́ть [p], затя́гивать [i] (drag out), затяну́ть [p], удлиня́ть [i]
    promise: обеща́ть [i], пообеща́ть [p], сули́ть [i] (colloquial), посули́ть [p], заверя́ть [i] (assure)
    promote: повыша́ть [i] (to a higher position), повы́сить [p], продвига́ть [i] (support), рекла́мировать [i] (for a product), поощря́ть [i] (encourage)
    prompt: побужда́ть [i], побуди́ть [p], подска́зывать [i] (give a cue), подсказа́ть [p], вызыва́ть [i] (trigger)
    pronounce: произноси́ть [i] (a word), произнести́ [p], выноси́ть [i] (a verdict), вы́нести [p], объявля́ть [i] (declare)
    propagate: распространя́ть [i] (an idea), распространи́ть [p], размножа́ть [i] (plants, organisms), размно́жить [p], пропаги́ровать [i] (an idea)
    propel: дви́гать [i] (drive forward), продвига́ть [i], продви́нуть [p], толка́ть [i] (push forward), швыря́ть [i] (hurl)
    propose: предлага́ть [i], предложи́ть [p], вноси́ть [i] (formally), внести́ [p], выдвига́ть [i] (put forward a plan)
    prosecute: пресле́довать [i] (legally), обвиня́ть [i] (charge), обвини́ть [p], привлека́ть [i] (hold legally liable), привле́чь [p]
    prosper: процвета́ть [i], преуспева́ть [i], преуспе́ть [p], богате́ть [i] (get rich), разбогате́ть [p]
    protect: защища́ть [i], защити́ть [p], охраня́ть [i], охрани́ть [p], оберега́ть [i]
    protest: протестова́ть [i], запротестова́ть [p], демонстри́ровать [b] (demonstrate), возража́ть [i], возрази́ть [p]
    protrude: выступа́ть [i], вы́ступить [p], торча́ть [i], выдава́ться [i], вы́даться [p]
    prove: дока́зывать [i], доказа́ть [p], демонстри́ровать [b], подтвержда́ть [i], подтверди́ть [p]
    provide: обеспе́чивать [i] (supply with), обеспе́чить [p], предоставля́ть [i], предоста́вить [p], снабжа́ть [i] (supply with)
    provoke: провоци́ровать [i], спровоци́ровать [p], вызыва́ть [i] (cause, trigger), вы́звать [p], дразни́ть [i] (taunt)
    prune: подреза́ть [i], подре́зать [p], обреза́ть [i], обре́зать [p], подстрига́ть [i]
    pry: подсма́тривать [i] (snoop), разню́хивать [i] (snoop), вскрыва́ть [i] (prise open), вскрыть [p], взла́мывать [i] (pry open)
    publish: публикова́ть [i], опубликова́ть [p], издава́ть [i] (as publisher or editor), изда́ть [p], печа́тать [i] (carry an article)
    pull: тяну́ть [i], потяну́ть [p], тащи́ть [i] (pull roughly), дёргать [i] (pull roughly), дёрнуть [p]
    pulse: пульси́ровать [i], би́ться [i] (of the heart), стуча́ть [i] (of the heart), колоти́ться [i] (throb)
    pump: кача́ть [i] (water, a heart pumping blood), нака́чивать [i] (inflate), накача́ть [p], отка́чивать [i] (pump out), откача́ть [p]
    punch: бить [i] (hit with a fist), уда́рить [p], ударя́ть [i], пробива́ть [i] (make a hole in paper), проби́ть [p]
    punctuate: расставля́ть [i] (add punctuation marks), расста́вить [p], подчёркивать [i] (emphasize), подчеркну́ть [p], перемежа́ть [i] (interrupt at intervals)
    puncture: прока́лывать [i], проколо́ть [p], пробива́ть [i] (a tire; break through), проби́ть [p], перфори́ровать [b] (perforate)
    punish: нака́зывать [i], наказа́ть [p]
    purchase: покупа́ть [i], купи́ть [p], приобрета́ть [i] (formal; acquire an item), приобрести́ [p]
    purge: очища́ть [i] (cleanse), очи́стить [p], удаля́ть [i] (data), удали́ть [p], чи́стить [i] (remove people)
    purify: очища́ть [i] (morally; a substance), очи́стить [p], фильтрова́ть [i] (filter), отфильтрова́ть [p]
    pursue: пресле́довать [i] (chase), стреми́ться [i] (strive for a goal), добива́ться [i] (a goal), доби́ться [p]
    push: толка́ть [i] (a cart; shove), толкну́ть [p], нажима́ть [i] (a button), нажа́ть [p]
    put: класть [i] (flat), положи́ть [p], ста́вить [i] (upright), поста́вить [p], помести́ть [p] (into; place)
    put off: откла́дывать [i], отложи́ть [p], отпу́гивать [i] (deter), отпугну́ть [p]
    puzzle: озада́чивать [i], озада́чить [p], недоумева́ть [i] (be baffled), разга́дывать [i] (over a riddle), разгада́ть [p]
    quake: дрожа́ть [i], содрога́ться [i], содрогну́ться [p], сотряса́ться [i]
    qualify: подходи́ть [i] (meet the criteria; be eligible), подойти́ [p], ограни́чивать [i] (limit a statement), ограни́чить [p], уполномо́чивать [i] (entitle)
    quarrel: ссо́риться [i], поссо́риться [p], руга́ться [i], поруга́ться [p], спо́рить [i]
    quench: утоля́ть [i] (thirst), утоли́ть [p], туши́ть [i] (a fire), потуши́ть [p]
    query: запра́шивать [i] (a database), запроси́ть [p], опра́шивать [i] (question someone), опроси́ть [p], спра́шивать [i] (inquire)
    question: спра́шивать [i] (ask), спроси́ть [p], допра́шивать [i] (interrogate), оспа́ривать [i] (challenge), сомнева́ться [i] (doubt)
    quit: броса́ть [i] (stop doing; a habit), бро́сить [p], увольня́ться [i] (a job), уво́литься [p], выходи́ть [i] (a program)
    quiver: дрожа́ть [i], задрожа́ть [p], трепета́ть [i], вибри́ровать [i]
    quote: цити́ровать [i] (cite), процити́ровать [p], называ́ть [i] (a price), назва́ть [p]
    race: соревнова́ться [i] (compete), состяза́ться [i] (compete), мча́ться [i] (speed), помча́ться [p], носи́ться [i] (speed)
    radiate: излуча́ть [i] (emit), испуска́ть [i], испусти́ть [p], сия́ть [i] (shine)
    raid: напада́ть [i], напа́сть [p], штурмова́ть [i] (a building), обы́скивать [i] (police search), обыска́ть [p]
    rain: идти́ [i], пойти́ [p], лить [i] (pour down), мороси́ть [i] (drizzle)
    raise: поднима́ть [i] (lift), подня́ть [p], повыша́ть [i] (increase), воспи́тывать [i] (children), воспита́ть [p]
    rally: собира́ть [i] (gather), собра́ть [p], мобилизова́ть [b] (mobilize), спла́чивать [i] (bring together), сплоти́ть [p]
    ram: тара́нить [i], протара́нить [p], вбива́ть [i] (drive in), вбить [p]
    ramble: броди́ть [i] (walk about; hike), болта́ть [i] (talk aimlessly), отклоня́ться [i] (digress), отклони́ться [p], гуля́ть [i] (walk idly)
    rank: ранжи́ровать [b] (assign a rank), классифици́ровать [b], занима́ть [i] (hold a rank), заня́ть [p]
    rant: руга́ться [i] (rail against), бушева́ть [i] (rage), ора́ть [i] (bellow at someone), жа́ловаться [i] (complain), пожа́ловаться [p]
    rate: оце́нивать [i], оцени́ть [p], расце́нивать [i] (judge), расцени́ть [p]
    rationalize: рационализи́ровать [b], опра́вдывать [i] (justify; explain away), оправда́ть [p]
    rattle: греме́ть [i], загреме́ть [p], дребезжа́ть [i], тарахте́ть [i]
    reach: достига́ть [i], дости́чь [p], добира́ться [i] (arrive), добра́ться [p], дотя́гиваться [i] (extend to)
    react: реаги́ровать [i] (react against), отреаги́ровать [p]
    read: чита́ть [i], прочита́ть [p], истолко́вывать [i] (interpret), истолкова́ть [p]
    reap: пожина́ть [i] (a harvest), собира́ть [i], собра́ть [p]
    rear: выра́щивать [i] (animals), вы́растить [p], воспи́тывать [i] (children), воспита́ть [p], разводи́ть [i] (animals)
    reason: рассужда́ть [i], рассуди́ть [p], заключа́ть [i] (conclude), заключи́ть [p], аргументи́ровать [b] (argue)
    reassure: успока́ивать [i], успоко́ить [p], обнадёживать [i] (encourage), обнадёжить [p]
    rebuild: перестра́ивать [i] (remodel), перестро́ить [p], восстана́вливать [i] (after a disaster; restore), восстанови́ть [p], реконструи́ровать [b]
    rebuke: упрека́ть [i], упрекну́ть [p], отчи́тывать [i], отчита́ть [p], порица́ть [i]
    recall: вспомина́ть [i] (keep in memory), вспо́мнить [p], отзыва́ть [i] (a product; call back), отозва́ть [p]
    recede: отступа́ть [i], отступи́ть [p], убыва́ть [i] (the tide), спада́ть [i]
    receive: получа́ть [i], получи́ть [p], принима́ть [i] (welcome), приня́ть [p]
    recharge: заряжа́ть [i] (refill; a battery), заряди́ть [p], отдыха́ть [i] (recover energy), отдохну́ть [p]
    reciprocate: отвеча́ть [i], отве́тить [p], отпла́чивать [i] (a favor), отплати́ть [p]
    recite: чита́ть [i] (a poem; from memory), прочита́ть [p], деклами́ровать [i], продеклами́ровать [p]
    reckon: счита́ть [i] (think; consider), посчита́ть [p], полага́ть [i] (think), предполага́ть [i] (suppose), вычисля́ть [i] (calculate)
    reclaim: возвраща́ть [i] (get back), верну́ть [p], отвоёвывать [i] (land from the sea), отвоева́ть [p], осуша́ть [i] (land)
    recline: отки́дываться [i] (lean back; tilt back), отки́нуться [p], полулежа́ть [i], ложи́ться [i] (lie down), лечь [p]
    recognize: узнава́ть [i] (identify), узна́ть [p], признава́ть [i] (acknowledge), призна́ть [p]
    recoil: отпря́дывать [i], отпря́нуть [p], отша́тываться [i], отшатну́ться [p]
    recommend: рекомендова́ть [i], порекомендова́ть [p], сове́товать [i] (advise), посове́товать [p]
    reconcile: мири́ться [i] (make up with someone), помири́ться [p], примиря́ть [i] (reconcile people), согласо́вывать [i] (make compatible), сверя́ть [i] (accounts)
    reconsider: пересма́тривать [i], пересмотре́ть [p], переду́мывать [i], переду́мать [p]
    record: запи́сывать [i] (audio; video; write down), записа́ть [p], протоколи́ровать [b] (minutes), фикси́ровать [i], зафикси́ровать [p]
    recount: расска́зывать [i] (narrate), рассказа́ть [p], опи́сывать [i] (describe vividly), пересчи́тывать [i] (count again), пересчита́ть [p]
    recover: выздора́вливать [i] (get well), вы́здороветь [p], восстана́вливать [i] (regain; data; salvage), восстанови́ть [p], оправля́ться [i] (from illness)
    recreate: воссоздава́ть [i] (a scene), воссозда́ть [p], воспроизводи́ть [i], воспроизвести́ [p]
    recruit: вербова́ть [i], завербова́ть [p], набира́ть [i] (call for applicants), набра́ть [p], нанима́ть [i] (hire)
    rectify: исправля́ть [i] (a fault), испра́вить [p], устраня́ть [i], устрани́ть [p]
    recycle: перераба́тывать [i], перерабо́тать [p], утилизи́ровать [b]
    redeem: выкупа́ть [i] (a pledge), вы́купить [p], погаша́ть [i] (a debt; a bond), погаси́ть [p], спаса́ть [i] (spiritually; save)
    redirect: перенаправля́ть [i], перенапра́вить [p], пересыла́ть [i] (forward), пересла́ть [p], переадресо́вывать [i] (web)
    redo: переде́лывать [i] (rework), переде́лать [p], повторя́ть [i] (do over), повтори́ть [p]
    reduce: уменьша́ть [i], уме́ньшить [p], сокраща́ть [i], сократи́ть [p], снижа́ть [i] (lower)
    refer: ссыла́ться [i] (refer to), сосла́ться [p], направля́ть [i] (to a specialist), напра́вить [p], упомина́ть [i] (mention)
    refine: очища́ть [i] (purify), очи́стить [p], рафини́ровать [b] (oil, sugar), соверше́нствовать [i] (improve), усоверше́нствовать [p]
    reflect: отража́ть [i] (light; mirror), отрази́ть [p], отража́ться [i], размышля́ть [i] (ponder), поразмы́слить [p]
    reform: реформи́ровать [b], преобразо́вывать [i], преобразова́ть [p], исправля́ть [i] (reform a person), испра́вить [p]
    refrain: возде́рживаться [i], воздержа́ться [p], уде́рживаться [i], удержа́ться [p], избега́ть [i] (avoid)
    refresh: освежа́ть [i], освежи́ть [p], обновля́ть [i] (a page; data), обнови́ть [p]
    refrigerate: охлажда́ть [i], охлади́ть [p], замора́живать [i] (freeze), заморо́зить [p]
    refund: возвраща́ть [i] (money), верну́ть [p], возмеща́ть [i], возмести́ть [p]
    refuse: отка́зываться [i], отказа́ться [p], отклоня́ть [i] (reject), отклони́ть [p], отверга́ть [i]
    regain: возвраща́ть [i], верну́ть [p], восстана́вливать [i], восстанови́ть [p]
    regard: счита́ть [i] (consider as), посчита́ть [p], рассма́тривать [i] (consider as), рассмотре́ть [p], уважа́ть [i] (esteem)
    regenerate: регенери́ровать [b], восстана́вливаться [i] (grow back), восстанови́ться [p], отраста́ть [i] (grow back), отрасти́ [p]
    register: регистри́ровать [i], зарегистри́ровать [p], регистри́роваться [i], зарегистри́роваться [p], заявля́ть [i] (declare)
    regret: жале́ть [i] (be sorry for), пожале́ть [p], сожале́ть [i] (lament), раска́иваться [i] (be sorry for what one did), раска́яться [p]
    regulate: регули́ровать [i] (adjust), отрегули́ровать [p], урегули́ровать [p] (by rules), регламенти́ровать [b] (by rules)
    rehearse: репети́ровать [i], отрепети́ровать [p], повторя́ть [i], повтори́ть [p]
    reign: ца́рствовать [i], воцари́ться [p] (come to reign), пра́вить [i] (rule), госпо́дствовать [i] (hold sway)
    reinforce: укрепля́ть [i], укрепи́ть [p], уси́ливать [i], уси́лить [p], подкрепля́ть [i] (an argument)
    reiterate: повторя́ть [i], повтори́ть [p]
    reject: отверга́ть [i] (an idea), отве́ргнуть [p], отклоня́ть [i], отклони́ть [p], отка́зываться [i]
    rekindle: оживля́ть [i], оживи́ть [p], возрожда́ть [i], возроди́ть [p], разжига́ть [i] (kindle a feeling afresh)
    relapse: срыва́ться [i] (into a habit), сорва́ться [p], впада́ть [i] (into a habit), впасть [p], обостря́ться [i] (flare up again)
    relate: расска́зывать [i] (tell a story), рассказа́ть [p], относи́ться [i] (be related to), свя́зывать [i] (link; connect), связа́ть [p]
    relax: расслабля́ться [i] (unwind), рассла́биться [p], отдыха́ть [i] (rest), отдохну́ть [p], расслабля́ть [i] (loosen)
    relay: передава́ть [i], переда́ть [p], трансли́ровать [b] (broadcast), ретрансли́ровать [b] (broadcast)
    release: выпуска́ть [i] (a product; a film or software), вы́пустить [p], освобожда́ть [i] (set free), освободи́ть [p], отпуска́ть [i] (let go)
    relegate: понижа́ть [i] (demote), пони́зить [p], ссыла́ть [i] (banish), сосла́ть [p], переводи́ть [i] (of a sports team)
    relent: смягча́ться [i] (ease off), смягчи́ться [p], уступа́ть [i] (give in; give way), уступи́ть [p], ослабева́ть [i] (ease off)
    relieve: облегча́ть [i] (pain), облегчи́ть [p], сменя́ть [i] (take over from someone), смени́ть [p]
    relish: наслажда́ться [i] (enjoy), наслади́ться [p], смакова́ть [i] (savor), посмакова́ть [p]
    reload: перезагружа́ть [i] (a web page; load again), перезагрузи́ть [p], перезаряжа́ть [i] (a weapon), перезаряди́ть [p], обновля́ть [i] (a page)
    rely: полага́ться [i] (rely on), положи́ться [p], рассчи́тывать [i] (count on), доверя́ть [i] (trust), зави́сеть [i] (depend on)
    remain: остава́ться [i], оста́ться [p], сохраня́ться [i] (stay unchanged), сохрани́ться [p], пребыва́ть [i] (stay)
    remark: замеча́ть [i], заме́тить [p], отмеча́ть [i], отме́тить [p], комменти́ровать [i]
    remedy: исправля́ть [i] (correct), испра́вить [p], лечи́ть [i] (cure), вы́лечить [p], устраня́ть [i] (correct)
    remember: по́мнить [i] (keep in mind), вспомина́ть [i] (recall), вспо́мнить [p], запомина́ть [i], запо́мнить [p]
    remind: напомина́ть [i] (make someone remember), напо́мнить [p]
    remit: переводи́ть [i] (money), перевести́ [p], пересыла́ть [i] (send), проща́ть [i] (a debt, a penalty), прости́ть [p]
    remodel: перестра́ивать [i], перестро́ить [p], переде́лывать [i], переде́лать [p], реконструи́ровать [b]
    remove: удаля́ть [i] (delete), удали́ть [p], убира́ть [i] (clear away), убра́ть [p], снима́ть [i] (take off)
    rename: переимено́вывать [i] (a file), переименова́ть [p]
    renew: продлева́ть [i] (a contract; a library book), продли́ть [p], возобновля́ть [i] (a contract), возобнови́ть [p], обновля́ть [i]
    renounce: отрека́ться [i] (give up), отре́чься [p], отка́зываться [i], отказа́ться [p]
    renovate: ремонти́ровать [i] (a building), отремонти́ровать [p], обновля́ть [i], обнови́ть [p], реконструи́ровать [b]
    rent: снима́ть [i] (rent from; as a tenant), снять [p], сдава́ть [i] (rent out; to a tenant), сдать [p], арендова́ть [b] (formal; land)
    repair: чини́ть [i], почини́ть [p], ремонти́ровать [i] (a building), отремонти́ровать [p]
    repay: возвраща́ть [i] (give back; a loan), верну́ть [p], выпла́чивать [i] (a loan), вы́платить [p], отпла́чивать [i] (a favor; kindness)
    repeal: отменя́ть [i], отмени́ть [p], аннули́ровать [b], упраздня́ть [i], упраздни́ть [p]
    repeat: повторя́ть [i] (repeat words; say back), повтори́ть [p], повторя́ться [i] (happen again)
    repel: отража́ть [i] (an attack), отрази́ть [p], отбива́ть [i] (an attack), отби́ть [p], отта́лкивать [i] (repel water; disgust)
    replace: заменя́ть [i] (swap out; substitute), замени́ть [p], замеща́ть [i] (stand in for), замести́ть [p], меня́ть [i] (exchange)
    replenish: пополня́ть [i] (top up; restock), попо́лнить [p], восполня́ть [i], воспо́лнить [p]
    reply: отвеча́ть [i] (a question or letter), отве́тить [p], возража́ть [i] (retort), возрази́ть [p]
    report: сообща́ть [i] (news), сообщи́ть [p], докла́дывать [i], доложи́ть [p], заявля́ть [i] (to the police)
    represent: представля́ть [i] (stand for), предста́вить [p], изобража́ть [i] (depict), изобрази́ть [p], означа́ть [i] (stand for)
    repress: подавля́ть [i] (psychologically), подави́ть [p], вытесня́ть [i] (psychologically), вы́теснить [p], репресси́ровать [b] (political)
    reprimand: отчи́тывать [i] (officially), отчита́ть [p], руга́ть [i], вы́ругать [p], порица́ть [i]
    reproach: упрека́ть [i] (blame someone for), упрекну́ть [p], попрека́ть [i], укоря́ть [i], укори́ть [p]
    reproduce: воспроизводи́ть [i] (recreate), воспроизвести́ [p], копи́ровать [i] (copy), скопи́ровать [p], размножа́ться [i] (biology; breed)
    request: проси́ть [i], попроси́ть [p], запра́шивать [i] (formally; apply for), запроси́ть [p]
    require: тре́бовать [i] (demand), потре́бовать [p], тре́боваться [i] (be required; need), потре́боваться [p], нужда́ться [i] (need)
    reschedule: переноси́ть [i] (move to another date), перенести́ [p], передвига́ть [i] (move earlier or later), передви́нуть [p]
    rescind: отменя́ть [i], отмени́ть [p], аннули́ровать [b], расторга́ть [i] (a contract), расто́ргнуть [p]
    rescue: спаса́ть [i], спасти́ [p], выруча́ть [i], вы́ручить [p]
    research: иссле́довать [b], изуча́ть [i], изучи́ть [p]
    reserve: зака́зывать [i] (book), заказа́ть [p], откла́дывать [i] (set aside; hold back), отложи́ть [p], приберега́ть [i] (hold back)
    reshape: перестра́ивать [i], перестро́ить [p], преобразо́вывать [i], преобразова́ть [p], переде́лывать [i]
    reside: жить [i], прожива́ть [i] (formal), обита́ть [i]
    resign: увольня́ться [i] (leave a job), уво́литься [p], уходи́ть [i] (leave a post), уйти́ [p]
    resist: сопротивля́ться [i], воспроти́виться [p], противостоя́ть [i] (withstand), устоя́ть [p] (withstand; hold back from)
    resolve: реша́ть [i] (decide; solve a puzzle), реши́ть [p], разреша́ть [i] (a problem), разреши́ть [p]
    resort: прибега́ть [i] (resort to force), прибе́гнуть [p], обраща́ться [i] (turn to), обрати́ться [p]
    respect: уважа́ть [i], почита́ть [i] (admire), чтить [i] (honor), почти́ть [p], соблюда́ть [i] (rules)
    respond: отвеча́ть [i], отве́тить [p], реаги́ровать [i], отреаги́ровать [p], откли́каться [i]
    rest: отдыха́ть [i], отдохну́ть [p], передохну́ть [p], бере́чь [i] (spare an injured part)
    restart: перезагружа́ть [i] (a computer), перезагрузи́ть [p], перезапуска́ть [i] (a program), перезапусти́ть [p], возобновля́ть [i] (resume)
    restore: восстана́вливать [i] (a service; health), восстанови́ть [p], реставри́ровать [b] (an object), возвраща́ть [i] (give back), верну́ть [p]
    restrain: сде́рживать [i] (keep in check), сдержа́ть [p], уде́рживать [i] (hold back a person), удержа́ть [p], обу́здывать [i] (keep in check)
    restrict: ограни́чивать [i] (limit to), ограни́чить [p], регули́ровать [i] (regulate)
    result: приводи́ть [i] (result in), привести́ [p], получа́ться [i] (come about), получи́ться [p], вытека́ть [i] (result from)
    resume: возобновля́ть [i], возобнови́ть [p], продолжа́ть [i] (carry on; continue), продо́лжить [p], возобновля́ться [i] (intransitive)
    resurrect: воскреша́ть [i] (raise from the dead), воскреси́ть [p], воскреса́ть [i] (come back to life), воскре́снуть [p]
    retain: сохраня́ть [i] (keep unchanged), сохрани́ть [p], уде́рживать [i] (withhold; keep), удержа́ть [p]
    retreat: отступа́ть [i], отступи́ть [p], отходи́ть [i], отойти́ [p]
    retrieve: извлека́ть [i] (data; take out), извле́чь [p], восстана́вливать [i] (data; salvage), восстанови́ть [p], достава́ть [i] (take out; get back)
    return: возвраща́ться [i] (go back; come back), верну́ться [p], возвраща́ть [i] (give back), верну́ть [p], отдава́ть [i] (give back)
    reunite: воссоединя́ть [i], воссоедини́ть [p], воссоединя́ться [i] (get back together), воссоедини́ться [p], встреча́ться [i] (meet again)
    reveal: раскрыва́ть [i] (uncover; disclose), раскры́ть [p], выявля́ть [i] (expose), вы́явить [p], разоблача́ть [i] (expose)
    reverse: перевора́чивать [i] (flip), переверну́ть [p], отменя́ть [i] (a decision), отмени́ть [p], пя́титься [i] (a car)
    revert: возвраща́ться [i] (reset), верну́ться [p], отка́тывать [i] (undo a change), откати́ть [p], сбра́сывать [i] (reset)
    review: просма́тривать [i] (go over), просмотре́ть [p], рецензи́ровать [i] (a book or film), отрецензи́ровать [p], повторя́ть [i] (study again)
    revise: пересма́тривать [i] (a law or text), пересмотре́ть [p], редакти́ровать [i] (a text), отредакти́ровать [p], повторя́ть [i] (study again)
    revive: оживля́ть [i] (resuscitate), оживи́ть [p], ожива́ть [i] (come back to life), ожи́ть [p], возрожда́ть [i]
    revoke: отзыва́ть [i] (a licence), отозва́ть [p], аннули́ровать [b], лиша́ть [i] (strip a right), лиши́ть [p]
    revolutionize: революциони́ровать [b], преобразо́вывать [i] (radically), преобразова́ть [p]
    reward: награжда́ть [i] (honor with an award), награди́ть [p], вознагражда́ть [i], вознагради́ть [p], поощря́ть [i]
    rhyme: рифмова́ть [i], зарифмова́ть [p], рифмова́ться [i], сочиня́ть [i] (write verse), сочини́ть [p]
    ride: е́хать [i] (as a passenger; a bus), пое́хать [p], е́здить [i] (a bicycle, a bus), ката́ться [i] (for pleasure), скака́ть [i] (a horse)
    ring: звони́ть [i] (a bell), позвони́ть [p], звене́ть [i] (sound; ring out), прозвене́ть [p], звуча́ть [i] (ring out)
    rinse: полоска́ть [i], прополоска́ть [p], опола́скивать [i], ополосну́ть [p]
    rip: рвать [i], порва́ть [p], разрыва́ть [i] (tear open), разорва́ть [p], отрыва́ть [i] (tear off)
    ripple: ряби́ть [i], колыха́ться [i], колыхну́ться [p], струи́ться [i]
    rise: поднима́ться [i] (sun, dough), подня́ться [p], встава́ть [i] (get up; stand up), встать [p], восходи́ть [i] (the sun)
    risk: рискова́ть [i] (run a risk), рискну́ть [p], подверга́ть [i] (stake; to danger), подве́ргнуть [p]
    rival: сопе́рничать [i], конкури́ровать [i], сравни́ться [p] (come close to equalling), соревнова́ться [i]
    roam: броди́ть [i], блужда́ть [i], скита́ться [i], стра́нствовать [i]
    roar: реве́ть [i], зареве́ть [p], рыча́ть [i], зарыча́ть [p], грохота́ть [i]
    roast: жа́рить [i] (meat), зажа́рить [p], запека́ть [i] (in an oven), запе́чь [p], обжа́ривать [i] (coffee, nuts)
    rob: гра́бить [i], огра́бить [p], обворо́вывать [i] (a place), обворова́ть [p]
    roll: кати́ться [i] (intransitive), покати́ться [p], кати́ть [i] (roll something), свёртывать [i] (roll up), сверну́ть [p]
    rotate: враща́ть [i] (turn something), враща́ться [i], повора́чивать [i] (turn something), поверну́ть [p], чередова́ть [i] (alternate)
    rouse: буди́ть [i] (wake someone), разбуди́ть [p], возбужда́ть [i] (stir up), возбуди́ть [p], пробужда́ть [i]
    route: направля́ть [i] (direct to different places), напра́вить [p], перенаправля́ть [i] (divert), перенапра́вить [p], прокла́дывать [i] (a route)
    row: грести́ [i], ссо́риться [i] (have a row), поссо́риться [p], руга́ться [i] (have a row)
    rub: тере́ть [i], потере́ть [p], растира́ть [i] (massage), растере́ть [p], гла́дить [i] (stroke)
    ruin: по́ртить [i] (spoil), испо́ртить [p], разруша́ть [i] (bring to ruin), разру́шить [p], разоря́ть [i] (financially)
    rule: пра́вить [i] (govern), управля́ть [i] (govern), постановля́ть [i] (of a court), постанови́ть [p], вла́ствовать [i]
    rumble: греме́ть [i] (resound), загреме́ть [p], грохота́ть [i], рокота́ть [i], урча́ть [i] (stomach)
    rummage: ры́ться [i], поры́ться [p], копа́ться [i], покопа́ться [p]
    run: бежа́ть [i], бе́гать [i], побежа́ть [p], управля́ть [i] (a business), руководи́ть [i] (a business)
    run away: убега́ть [i], убежа́ть [p], сбега́ть [i] (from home), сбежа́ть [p], бежа́ть [i] (flee)
    rupture: разрыва́ть [i] (break off relations), разорва́ть [p], ло́паться [i], ло́пнуть [p]
    rush: спеши́ть [i], поспеши́ть [p], торопи́ть [i] (hurry someone), поторопи́ть [p], бро́ситься [p] (crowd in)
    rust: ржаве́ть [i], заржаве́ть [p], окисля́ться [i] (corrode), окисли́ться [p]
    rustle: шелесте́ть [i] (leaves in a breeze), зашелесте́ть [p], шурша́ть [i], зашурша́ть [p]
    sabotage: саботи́ровать [b], срыва́ть [i] (disrupt), сорва́ть [p]
    sacrifice: же́ртвовать [i], поже́ртвовать [p]
    sadden: огорча́ть [i] (make sad), огорчи́ть [p], печа́лить [i], опеча́лить [p], грусти́ть [i] (feel sad)
    safeguard: защища́ть [i], защити́ть [p], охраня́ть [i], охрани́ть [p], оберега́ть [i]
    sail: плыть [i] (by ship), поплы́ть [p], пла́вать [i] (by ship), отплыва́ть [i] (leave port), отплы́ть [p]
    salute: приве́тствовать [i] (greet), поприве́тствовать [p], салютова́ть [i] (military), отсалютова́ть [p], че́ствовать [i] (pay tribute to; honor)
    salvage: спаса́ть [i], спасти́ [p], поднима́ть [i] (raise a wreck), подня́ть [p]
    sanction: санкциони́ровать [b] (approve), одобря́ть [i], одо́брить [p], нака́зывать [i] (penalize), наказа́ть [p]
    sanitize: дезинфици́ровать [b], обеззара́живать [i], обеззара́зить [p], очища́ть [i] (clean up data), очи́стить [p]
    sap: подрыва́ть [i] (eat away; undermine), подорва́ть [p], ослабля́ть [i], осла́бить [p], истоща́ть [i] (drain)
    satisfy: удовлетворя́ть [i] (a requirement; fulfil a need), удовлетвори́ть [p], удовлетворя́ться [i] (be satisfied), удовлетвори́ться [p]
    saturate: насыща́ть [i], насы́тить [p], пропи́тывать [i] (soak), пропита́ть [p], насыща́ться [i] (reach saturation)
    save: эконо́мить [i] (money), сэконо́мить [p], спаса́ть [i] (rescue), спасти́ [p], сохраня́ть [i] (keep; data, files)
    savor: смакова́ть [i] (taste), посмакова́ть [p], наслажда́ться [i] (savor deeply), наслади́ться [p]
    saw: пили́ть [i] (saw wood), распили́ть [p], спили́ть [p] (cut down)
    say: говори́ть [i], сказа́ть [p], произноси́ть [i], произнести́ [p], заявля́ть [i] (state)
    scale: взбира́ться [i] (climb; a mountain), взобра́ться [p], масштаби́ровать [b] (resize), увели́чивать [i] (scale up), увели́чить [p]
    scan: скани́ровать [i], отскани́ровать [p], просма́тривать [i] (skim; look over quickly), просмотре́ть [p]
    scandalize: возмуща́ть [i] (outrage), возмути́ть [p], шоки́ровать [b] (shock), возмуща́ться [i] (be outraged), возмути́ться [p]
    scar: уро́довать [i] (disfigure), изуро́довать [p], рубцева́ться [i] (heal over), зарубцева́ться [p], ме́тить [i] (mark)
    scare: пуга́ть [i], напуга́ть [p], пуга́ться [i] (be scared), испуга́ться [p], отпу́гивать [i] (scare away)
    scatter: рассыпа́ть [i], рассы́пать [p], рассыпа́ться [i] (intransitive), рассы́паться [p], разбра́сывать [i] (sow; throw about)
    schedule: назнача́ть [i] (set a time), назна́чить [p], намеча́ть [i] (set a time), наме́тить [p], составля́ть [i] (a timetable)
    scheme: замышля́ть [i] (plot), замы́слить [p], интригова́ть [i], сгова́риваться [i] (conspire), сговори́ться [p]
    scold: руга́ть [i], вы́ругать [p], брани́ть [i], побрани́ть [p], отчи́тывать [i]
    scoop: зачёрпывать [i] (liquid; spoon up), зачерпну́ть [p], черпа́ть [i], выда́лбливать [i] (hollow out), вы́долбить [p]
    scorch: обжига́ть [i], обже́чь [p], опаля́ть [i], подгора́ть [i] (get scorched), подгоре́ть [p]
    score: забива́ть [i] (a goal), заби́ть [p], набира́ть [i] (points), набра́ть [p], оце́нивать [i] (grade; a test)
    scorn: презира́ть [i], презре́ть [p], пренебрега́ть [i], пренебре́чь [p]
    scour: прочёсывать [i] (search through), прочеса́ть [p], обша́ривать [i] (search everywhere), обша́рить [p], тере́ть [i] (scrub)
    scout: разве́дывать [i], разведа́ть [p], высма́тривать [i] (look around for), вы́смотреть [p], иска́ть [i] (talent)
    scrape: скрести́ [i] (scrape), соскреба́ть [i] (scrape off), соскрести́ [p], обдира́ть [i] (graze the skin), ободра́ть [p]
    scratch: цара́пать [i] (with claws), поцара́пать [p], чеса́ть [i] (an itch), почеса́ть [p], чеса́ться [i]
    scream: крича́ть [i] (cry out), кри́кнуть [p], визжа́ть [i] (in fear), взви́згнуть [p], ора́ть [i] (yell)
    screw: закру́чивать [i] (screw in), закрути́ть [p], затя́гивать [i] (tighten), затяну́ть [p], завинти́ть [p] (screw in)
    scribble: строчи́ть [i] (write hastily), настрочи́ть [p], цара́пать [i] (scrawl), нацара́пать [p], рисова́ть [i] (doodle)
    scroll: прокру́чивать [i], прокрути́ть [p], листа́ть [i], пролиста́ть [p]
    scrub: тере́ть [i] (scrub off), оттира́ть [i], оттере́ть [p], чи́стить [i], почи́стить [p]
    scrutinize: изуча́ть [i] (examine closely), изучи́ть [p], рассма́тривать [i], рассмотре́ть [p], вгля́дываться [i] (examine closely)
    sculpt: лепи́ть [i] (mold), слепи́ть [p], вая́ть [i], извая́ть [p], высека́ть [i] (carve in stone)
    seal: запеча́тывать [i] (an envelope), запеча́тать [p], закле́ивать [i], закле́ить [p], закупо́ривать [i]
    search: иска́ть [i] (online; a place), поиска́ть [p], обы́скивать [i] (police), обыска́ть [p], разы́скивать [i]
    season: приправля́ть [i], припра́вить [p], заправля́ть [i], запра́вить [p], соли́ть [i] (with salt)
    secure: обеспе́чивать [i] (obtain; guarantee), обеспе́чить [p], закрепля́ть [i] (fasten), закрепи́ть [p], запира́ть [i] (lock up)
    sedate: успока́ивать [i] (with drugs), успоко́ить [p], усыпля́ть [i] (anesthetize), усыпи́ть [p], обезбо́ливать [i] (anesthetize)
    seduce: соблазня́ть [i], соблазни́ть [p], обольща́ть [i], обольсти́ть [p], завлека́ть [i] (lure)
    see: ви́деть [i], уви́деть [p], понима́ть [i] (understand; realize), поня́ть [p], встреча́ться [i] (meet)
    seek: иска́ть [i], поиска́ть [p], стреми́ться [i] (pursue), добива́ться [i] (pursue), доби́ться [p]
    seem: каза́ться [i], показа́ться [p], вы́глядеть [i], представля́ться [i], предста́виться [p]
    segment: сегменти́ровать [b], разделя́ть [i] (into segments), раздели́ть [p], дели́ть [i] (into parts)
    segregate: отделя́ть [i], отдели́ть [p], изоли́ровать [b], разделя́ть [i], раздели́ть [p]
    select: выбира́ть [i], вы́брать [p], выделя́ть [i] (on screen), вы́делить [p], отбира́ть [i] (screen; pick out)
    sell: продава́ть [i], прода́ть [p], торгова́ть [i] (deal in), сбыва́ть [i] (distribute), сбыть [p]
    send: отправля́ть [i] (a message; goods), отпра́вить [p], посыла́ть [i], посла́ть [p], присыла́ть [i]
    send back: возвраща́ть [i] (goods), верну́ть [p], отсыла́ть [i] (by mail), отосла́ть [p]
    sentence: пригова́ривать [i], приговори́ть [p], осужда́ть [i], осуди́ть [p]
    separate: разделя́ть [i] (keep apart), раздели́ть [p], отделя́ть [i], расстава́ться [i] (part ways), расста́ться [p]
    serve: служи́ть [i] (a master; military; be of use), послужи́ть [p], обслу́живать [i] (customers), обслужи́ть [p], подава́ть [i] (food)
    set: ста́вить [i] (set a clock; upright), поста́вить [p], устана́вливать [i] (a date, a rule), установи́ть [p], класть [i] (flat)
    set off: отправля́ться [i] (set out), отпра́виться [p], вызыва́ть [i] (trigger), вы́звать [p], взрыва́ть [i] (a bomb)
    set up: настра́ивать [i] (configure), настро́ить [p], устана́вливать [i] (install), установи́ть [p], осно́вывать [i] (found; establish)
    settle: ула́живать [i] (a matter; a dispute), ула́дить [p], поселя́ться [i] (settle in a place), посели́ться [p], опла́чивать [i] (a bill)
    sever: перереза́ть [i] (cut), перере́зать [p], отсека́ть [i] (cut off), порыва́ть [i] (cut ties), порва́ть [p]
    sew: шить [i], сшить [p], пришива́ть [i] (sew on), приши́ть [p], зашива́ть [i] (sew up)
    shackle: зако́вывать [i], закова́ть [p], ско́вывать [i] (restrict freedom), скова́ть [p], ограни́чивать [i] (freedom)
    shade: затеня́ть [i] (block light), затени́ть [p], штрихова́ть [i] (in a drawing), заштрихова́ть [p]
    shake: трясти́ [i], потрясти́ [p], стря́хивать [i] (shake off), стряхну́ть [p], дрожа́ть [i] (tremble)
    shampoo: мыть [i] (hair), вы́мыть [p], чи́стить [i] (a carpet), почи́стить [p]
    shape: лепи́ть [i] (mold), слепи́ть [p], формова́ть [i] (mold), сформова́ть [p], образо́вывать [i] (form)
    share: дели́ться [i] (let someone know), подели́ться [p], дели́ть [i] (share out), подели́ть [p], разделя́ть [i] (a view)
    shatter: разбива́ть [i], разби́ть [p], разбива́ться [i] (intransitive), разби́ться [p], разруша́ть [i] (destroy)
    shave: брить [i], побри́ть [p], бри́ться [i], побри́ться [p], сбрива́ть [i] (shave off)
    shear: стричь [i], остри́чь [p], подстрига́ть [i] (trim), подстри́чь [p]
    shed: сбра́сывать [i] (leaves, skin), сбро́сить [p], пролива́ть [i] (tears, blood), проли́ть [p], линя́ть [i] (hair; skin)
    shelter: укрыва́ть [i] (hide someone), укры́ть [p], укрыва́ться [i] (take cover; from rain), укры́ться [p], приюти́ть [p] (give refuge)
    shift: перемеща́ть [i] (move), перемести́ть [p], сдвига́ть [i] (move), сдви́нуть [p], меня́ть [i] (change)
    shimmer: мерца́ть [i] (flicker), перелива́ться [i], поблёскивать [i], блесте́ть [i], сверка́ть [i]
    shine: свети́ть [i], сия́ть [i], блесте́ть [i], освеща́ть [i] (light up), освети́ть [p]
    shiver: дрожа́ть [i], задрожа́ть [p], поёживаться [i], содрога́ться [i], содрогну́ться [p]
    shock: потряса́ть [i] (shock; stun), потрясти́ [p], шоки́ровать [b], поража́ть [i] (electric shock), порази́ть [p]
    shoo: прогоня́ть [i], прогна́ть [p], отгоня́ть [i], отогна́ть [p], спугну́ть [p]
    shoot: стреля́ть [i] (fire a gun; an arrow), вы́стрелить [p], застрели́ть [p] (kill), снима́ть [i] (a film; photos), снять [p]
    shorten: укора́чивать [i], укороти́ть [p], сокраща́ть [i], сократи́ть [p]
    should: сле́довать [i] (advice, obligation; impersonal use), надлежа́ть [i] (formal; obligation), полага́ться [i] (be supposed to)
    shout: крича́ть [i], кри́кнуть [p], ора́ть [i] (yell angrily), выкри́кивать [i], вы́крикнуть [p]
    shove: толка́ть [i], толкну́ть [p], пиха́ть [i], сова́ть [i] (shove into), су́нуть [p]
    shovel: копа́ть [i] (dig), вы́копать [p], разгреба́ть [i] (shovel out; snow), разгрести́ [p]
    show: пока́зывать [i], показа́ть [p], демонстри́ровать [b] (demonstrate), проявля́ть [i] (display a feeling), прояви́ть [p]
    show off: хва́статься [i], похва́статься [p], щеголя́ть [i] (flaunt), рисова́ться [i] (pose)
    show up: появля́ться [i], появи́ться [p], приходи́ть [i] (attend), прийти́ [p], яви́ться [p] (formal; attend)
    shred: измельча́ть [i] (grind), измельчи́ть [p], шинкова́ть [i] (vegetables), рвать [i] (tear into pieces), уничтожа́ть [i] (documents)
    shrink: сади́ться [i] (of clothes), сесть [p], уменьша́ться [i], уме́ньшиться [p], сжима́ться [i]
    shudder: содрога́ться [i], содрогну́ться [p], вздра́гивать [i], вздро́гнуть [p], ужаса́ться [i] (be horrified)
    shuffle: тасова́ть [i] (cards), стасова́ть [p], переме́шивать [i], перемеша́ть [p], ша́ркать [i] (shuffle feet)
    shun: избега́ть [i], избежа́ть [p], сторони́ться [i] (keep away from), чура́ться [i], уклоня́ться [i]
    shut: закрыва́ть [i], закры́ть [p], запира́ть [i] (lock), запере́ть [p], закрыва́ться [i] (intransitive)
    sidestep: обходи́ть [i] (bypass), обойти́ [p], уклоня́ться [i] (dodge), уклони́ться [p]
    siege: осажда́ть [i], осади́ть [p], окружа́ть [i] (surround), окружи́ть [p]
    sift: просе́ивать [i], просе́ять [p], проце́живать [i] (strain), процеди́ть [p], перебира́ть [i] (sort out)
    sigh: вздыха́ть [i], вздохну́ть [p]
    sign: подпи́сывать [i], подписа́ть [p], подпи́сываться [i], подписа́ться [p], распи́сываться [i] (autograph)
    signal: сигнализи́ровать [b], ука́зывать [i] (indicate), указа́ть [p], обознача́ть [i], обозна́чить [p]
    silence: заглуша́ть [i] (mute a device; drown out), заглуши́ть [p], подавля́ть [i] (suppress), умолка́ть [i] (fall silent), умо́лкнуть [p]
    simplify: упроща́ть [i], упрости́ть [p]
    simulate: имити́ровать [i] (imitate), сымити́ровать [p], модели́ровать [i] (a process), смодели́ровать [p], симули́ровать [b] (feign)
    sing: петь [i], спеть [p], пропе́ть [p], напева́ть [i] (hum), напе́ть [p]
    singe: опаля́ть [i], опали́ть [p], подпа́ливать [i] (burn lightly), подпали́ть [p]
    sink: тону́ть [i] (ships), утону́ть [p], топи́ть [i] (make something sink), потопи́ть [p], опуска́ться [i] (go down)
    sip: потя́гивать [i], отпива́ть [i], отпи́ть [p], прихлёбывать [i], прихлебну́ть [p]
    skate: ката́ться [i] (on skates), поката́ться [p], скользи́ть [i] (glide)
    sketch: набра́сывать [i] (outline; draw), наброса́ть [p], зарисо́вывать [i], зарисова́ть [p], намеча́ть [i] (design; outline)
    skewer: наса́живать [i] (on a skewer), насади́ть [p], нани́зывать [i] (on a skewer), прока́лывать [i] (pierce), проколо́ть [p]
    ski: ката́ться [i] (on skis), поката́ться [p]
    skim: просма́тривать [i] (read quickly), просмотре́ть [p], перели́стывать [i] (a text), снима́ть [i] (skim off; cream), скользи́ть [i] (pass close over the surface)
    skip: пропуска́ть [i] (omit; a meal; a class), пропусти́ть [p], прогу́ливать [i] (skip class or work), прогуля́ть [p], пры́гать [i] (hop)
    slam: хло́пать [i] (a door), хло́пнуть [p], ударя́ть [i] (hit hard), уда́рить [p], вреза́ться [i] (crash into)
    slander: клевета́ть [i], наклевета́ть [p], оклевета́ть [p], черни́ть [i], очерни́ть [p]
    slap: шлёпать [i] (with an open hand), шлёпнуть [p], бить [i] (on the face), ударя́ть [i], уда́рить [p]
    slash: рассека́ть [i] (cut open), рассе́чь [p], уреза́ть [i] (budgets), уре́зать [p], снижа́ть [i] (prices)
    sleep: спать [i], поспа́ть [p], засыпа́ть [i] (fall asleep), засну́ть [p], ночева́ть [i] (spend the night)
    slice: нареза́ть [i] (into slices), наре́зать [p], ре́зать [i], разре́зать [p]
    slide: скользи́ть [i], скользну́ть [p], сдвига́ть [i] (push along), сдви́нуть [p], съезжа́ть [i] (slide down)
    slip: скользи́ть [i] (lose footing), поскользну́ться [p], проска́льзывать [i] (slip in or out of), проскользну́ть [p], ускольза́ть [i] (slip away)
    slither: ползти́ [i], поползти́ [p], извива́ться [i], скользи́ть [i], пресмыка́ться [i]
    slow: замедля́ть [i], замедли́ть [p], замедля́ться [i] (ease off), замедли́ться [p], тормози́ть [i] (brake)
    smash: разбива́ть [i] (shatter), разби́ть [p], разда́вливать [i] (crush), раздави́ть [p], круши́ть [i]
    smear: нама́зывать [i] (spread), нама́зать [p], разма́зывать [i] (smudge), размаза́ть [p], па́чкать [i] (stain)
    smell: па́хнуть [i] (give off a smell), благоуха́ть [i] (smell pleasant), ню́хать [i] (perceive a smell), поню́хать [p], почу́ять [p]
    smile: улыба́ться [i], улыбну́ться [p], усмеха́ться [i] (quietly), усмехну́ться [p]
    smoke: кури́ть [i] (cigarettes), покури́ть [p], вы́курить [p] (a cigarette), копти́ть [i] (food), закопти́ть [p]
    smooth: гла́дить [i] (with the hand), погла́дить [p], разгла́живать [i] (flatten out), разгла́дить [p], выра́внивать [i] (level; level out)
    smother: души́ть [i], задуши́ть [p], подавля́ть [i] (suppress), подави́ть [p], туши́ть [i] (put out a fire)
    smuggle: провози́ть [i] (contraband), провезти́ [p], проноси́ть [i] (secretly), пронести́ [p], переправля́ть [i] (across a border)
    snap: лома́ть [i] (break something), слома́ть [p], лома́ться [i] (break by itself), щёлкать [i] (fingers; a photo), щёлкнуть [p]
    snarl: рыча́ть [i] (angrily), зарыча́ть [p], огрыза́ться [i] (snap angrily), огрызну́ться [p], ворча́ть [i]
    snatch: хвата́ть [i], схвати́ть [p], выхва́тывать [i] (from someone), вы́хватить [p], вырыва́ть [i] (snatch away)
    sneeze: чиха́ть [i], чихну́ть [p]
    sniff: ню́хать [i], поню́хать [p], обню́хивать [i], обню́хать [p], приню́хиваться [i] (smell out)
    snooze: дрема́ть [i], вздремну́ть [p], задрема́ть [p], подрема́ть [p]
    snore: храпе́ть [i], захрапе́ть [p]
    snow: идти́ [i] (of snow), пойти́ [p], вали́ть [i] (of heavy snow)
    soak: зама́чивать [i] (soak in liquid), замочи́ть [p], впи́тывать [i] (soak up), впита́ть [p], промока́ть [i] (get soaked)
    sob: рыда́ть [i], зарыда́ть [p], всхли́пывать [i], всхлипну́ть [p], пла́кать [i]
    socialize: обща́ться [i] (mix with others), пообща́ться [p], подружи́ться [p] (make friends), социализи́роваться [b] (children, psychology), болта́ть [i] (chat)
    soften: смягча́ть [i] (soften a stance), смягчи́ть [p], размягча́ть [i] (make soft), размягчи́ть [p], смягча́ться [i] (become soft)
    solicit: проси́ть [i] (ask for; for support), попроси́ть [p], ходата́йствовать [i] (formally), агити́ровать [i] (canvass), домога́ться [i] (seek)
    solidify: затвердева́ть [i], затверде́ть [p], застыва́ть [i] (become solid), засты́ть [p], тверде́ть [i]
    solve: реша́ть [i], реши́ть [p], разга́дывать [i] (a puzzle; a mystery), разгада́ть [p], раскрыва́ть [i] (a crime)
    soothe: успока́ивать [i] (calm a person), успоко́ить [p], унима́ть [i] (ease pain), уня́ть [p], облегча́ть [i] (pain)
    sort: сортирова́ть [i], рассортирова́ть [p], упоря́дочивать [i] (put in order), упоря́дочить [p], классифици́ровать [b] (classify)
    sound: звуча́ть [i], прозвуча́ть [p], раздава́ться [i] (ring out), разда́ться [p], звони́ть [i] (alarm, bell)
    sow: се́ять [i], посе́ять [p], засева́ть [i] (a field), засе́ять [p], сажа́ть [i] (plant)
    sparkle: искри́ться [i], сверка́ть [i], сверкну́ть [p], блесте́ть [i], мерца́ть [i]
    spawn: нерести́ться [i] (fish, frogs), порожда́ть [i] (give rise to), породи́ть [p], откла́дывать [i] (lay eggs), отложи́ть [p]
    speak: говори́ть [i], поговори́ть [p], разгова́ривать [i], заговори́ть [p] (begin to speak), выступа́ть [i] (give a speech)
    specify: ука́зывать [i] (state explicitly), указа́ть [p], уточня́ть [i] (state exactly), уточни́ть [p], определя́ть [i] (determine)
    speculate: предполага́ть [i] (guess), предположи́ть [p], гада́ть [i] (guess), спекули́ровать [i] (in markets), размышля́ть [i]
    speed: ускоря́ть [i] (make faster), уско́рить [p], мча́ться [i] (go fast), гнать [i] (drive fast), спеши́ть [i] (hurry)
    spell: диктова́ть [i] (letter by letter), продиктова́ть [p], писа́ться [i] (be spelled), предвеща́ть [i] (spell trouble), сули́ть [i] (spell trouble)
    spend: тра́тить [i] (money; time), потра́тить [p], проводи́ть [i] (time), провести́ [p], расхо́довать [i] (money)
    spill: пролива́ть [i] (blood, tears), проли́ть [p], разлива́ть [i], разли́ть [p], разлива́ться [i] (spill by itself)
    spin: прясть [i] (thread), спрясть [p], крути́ть [i] (spin something), верте́ть [i] (spin something), кружи́ться [i] (rotate)
    spit: плева́ть [i], плю́нуть [p], сплёвывать [i] (spit out), сплю́нуть [p], выплёвывать [i] (spit out)
    splash: бры́згать [i] (splash something; spatter), бры́згнуть [p], обры́згивать [i] (splash on someone), обры́згать [p], плеска́ться [i] (play in water)
    splinter: расщепля́ть [i], расщепи́ть [p], раска́лывать [i], расколо́ть [p], расщепля́ться [i] (intransitive)
    split: дели́ть [i] (into parts), раздели́ть [p], разделя́ть [i], раска́лывать [i] (split open), расколо́ть [p]
    spoil: по́ртить [i] (ruin; food, plans), испо́ртить [p], по́ртиться [i] (of food), испо́ртиться [p], балова́ть [i] (pamper; a child)
    sponsor: спонси́ровать [b], финанси́ровать [b], профинанси́ровать [b], подде́рживать [i] (support), поддержа́ть [p]
    spot: замеча́ть [i] (catch sight of), заме́тить [p], обнару́живать [i] (detect), обнару́жить [p], разгля́дывать [i] (see at a distance)
    sprain: растя́гивать [i], растяну́ть [p], подвёртывать [i] (an ankle), подверну́ть [p], вы́вихнуть [p] (dislocate)
    spray: опры́скивать [i], опрыска́ть [p], распыля́ть [i] (spray onto), распыли́ть [p], бры́згать [i]
    spread: распространя́ть [i] (news; disease), распространи́ть [p], распространя́ться [i] (intransitive), распространи́ться [p], нама́зывать [i] (butter, paste)
    sprinkle: посыпа́ть [i] (scatter on), посы́пать [p], опры́скивать [i] (with liquid), опрыска́ть [p], присыпа́ть [i]
    spur: стимули́ровать [b] (stimulate), побужда́ть [i] (urge on), побуди́ть [p], подстёгивать [i], подстегну́ть [p]
    squander: растра́чивать [i], растра́тить [p], транжи́рить [i], растранжи́рить [p], прома́тывать [i]
    squeal: визжа́ть [i] (pig; person), завизжа́ть [p], пища́ть [i], скрипе́ть [i] (brakes), заскрипе́ть [p]
    squeeze: сжима́ть [i] (grip; press), сжать [p], выжима́ть [i] (juice; squeeze out), вы́жать [p], вти́скивать [i] (squash in)
    squint: щу́рить [i] (narrow the eyes), прищу́рить [p], щу́риться [i] (strain to see), прищу́риться [p], коси́ть [i] (have a squint)
    stab: зака́лывать [i] (kill with a blade), заколо́ть [p], пронза́ть [i] (with a blade), пронзи́ть [p], коло́ть [i] (with a knife)
    stabilize: стабилизи́ровать [b], стабилизи́роваться [b], укрепля́ть [i], укрепи́ть [p], уравнове́шивать [i]
    stagger: шата́ться [i] (drunkenly), пошатну́ться [p], ковыля́ть [i] (walk unsteadily), чередова́ть [i] (stagger schedules)
    stain: па́чкать [i] (discolor), запа́чкать [p], пятна́ть [i], окра́шивать [i] (dye; wood), окра́сить [p]
    stall: гло́хнуть [i] (an engine), загло́хнуть [p], остана́вливаться [i] (grind to a halt), останови́ться [p], оття́гивать [i] (stall for time)
    stamp: штампова́ть [i] (put a stamp on), проштампова́ть [p], топа́ть [i] (stamp one's feet), то́пнуть [p], топта́ть [i] (stamp on)
    start: начина́ть [i], нача́ть [p], начина́ться [i] (begin by itself), запуска́ть [i] (engine, program), запусти́ть [p]
    startle: пуга́ть [i], испуга́ть [p], вспу́гивать [i] (startle), вспугну́ть [p], вздра́гивать [i] (be startled)
    stash: пря́тать [i] (stow away), спря́тать [p], припаса́ть [i] (hoard), припасти́ [p], убира́ть [i] (put away)
    state: заявля́ть [i] (claim; declare), заяви́ть [p], утвержда́ть [i] (assert), объявля́ть [i] (declare), объяви́ть [p]
    stay: остава́ться [i] (remain), оста́ться [p], остана́вливаться [i] (as a guest; at a hotel), останови́ться [p], гости́ть [i] (as a guest)
    steady: успока́ивать [i] (nerves; calm), успоко́ить [p], стабилизи́ровать [b], уде́рживать [i] (hold steady), удержа́ть [p]
    steal: красть [i], укра́сть [p], ворова́ть [i] (colloquial), сворова́ть [p], похища́ть [i] (formal)
    steer: управля́ть [i] (drive; a vehicle), направля́ть [i] (guide), напра́вить [p], вести́ [i] (drive; guide), повести́ [p]
    sterilize: стерилизова́ть [b], обеззара́живать [i] (disinfect), обеззара́зить [p]
    stew: туши́ть [i] (stew food), потуши́ть [p], томи́ть [i] (simmer slowly)
    stick: прикле́ивать [i] (adhere, affix), прикле́ить [p], втыка́ть [i] (poke into), воткну́ть [p], ли́пнуть [i] (adhere)
    stifle: подавля́ть [i] (a yawn or laugh), подави́ть [p], сде́рживать [i] (hold back), сдержа́ть [p]
    stigmatize: стигматизи́ровать [b], клейми́ть [i], заклейми́ть [p]
    stimulate: стимули́ровать [b], возбужда́ть [i] (excite), возбуди́ть [p], оживля́ть [i] (revive), оживи́ть [p]
    sting: жа́лить [i] (insect, nettle), ужа́лить [p], жечь [i] (smart, burn), щипа́ть [i] (smart)
    stink: воня́ть [i], попа́хивать [i] (mildly)
    stipulate: огова́ривать [i] (specify, agree), оговори́ть [p], предусма́тривать [i] (require, provide for), предусмотре́ть [p]
    stir: меша́ть [i], помеша́ть [p], шевели́ть [i] (move slightly), разжига́ть [i] (stir up feelings), разже́чь [p]
    stitch: шить [i], сшить [p], зашива́ть [i] (suture, mend), заши́ть [p], вышива́ть [i] (embroider)
    stop: прекраща́ть [i] (cease, quit), прекрати́ть [p], остана́вливать [i] (bring to a halt), останови́ть [p], переста́ть [p] (stop doing something)
    store: храни́ть [i] (keep, save data), сохрани́ть [p], складирова́ть [b] (goods)
    storm: штурмова́ть [i] (attack), ворва́ться [p] (storm in), бушева́ть [i] (rage, of weather)
    straighten: выпрямля́ть [i], выпрями́ть [p], выра́внивать [i] (set straight), убира́ть [i] (tidy up), убра́ть [p]
    strain: проце́живать [i] (filter, pasta), процеди́ть [p], напряга́ть [i] (overexert, overwork), напря́чь [p], растя́гивать [i] (injure a muscle)
    strangle: души́ть [i], задуши́ть [p], удави́ть [p]
    strap: привя́зывать [i], привяза́ть [p], пристёгивать [i], пристегну́ть [p]
    stray: блужда́ть [i] (wander aimlessly), заблуди́ться [p] (get lost), отклоня́ться [i] (digress, deviate), отклони́ться [p], броди́ть [i] (of animals)
    strengthen: укрепля́ть [i], укрепи́ть [p], уси́ливать [i] (reinforce), уси́лить [p], кре́пнуть [i] (grow stronger)
    stress: подчёркивать [i], подчеркну́ть [p] (highlight), акценти́ровать [b] (emphasize), напряга́ть [i] (put under stress), напря́чь [p]
    stretch: растя́гивать [i], растяну́ть [p], потя́гиваться [i] (do stretches), потяну́ться [p], вытя́гивать [i] (extend a limb)
    strew: рассыпа́ть [i], рассы́пать [p], разбра́сывать [i], разбро́сать [p], усыпа́ть [i] (cover with)
    string: нани́зывать [i] (beads), наниза́ть [p], натя́гивать [i] (racket, guitar), натяну́ть [p]
    strip: раздева́ться [i] (undress), разде́ться [p], раздева́ть [i] (undress someone), лиша́ть [i] (of rights, titles), лиши́ть [p]
    stroke: гла́дить [i], погла́дить [p], ласка́ть [i], приласка́ть [p]
    stroll: гуля́ть [i], погуля́ть [p], прогу́ливаться [i], прогуля́ться [p]
    struggle: боро́ться [i] (strive, face difficulty), поборо́ться [p], би́ться [i] (thrash about, fight), корчи́ться [i] (writhe)
    strum: бренча́ть [i], побренча́ть [p], наи́грывать [i] (play a guitar)
    study: учи́ться [i] (at university), изуча́ть [i] (research), изучи́ть [p], учи́ть [i] (learn), вы́учить [p]
    stuff: набива́ть [i], наби́ть [p] (cram), фарширова́ть [i] (stuff food), нафарширова́ть [p], затыка́ть [i] (stop up)
    stumble: спотыка́ться [i], споткну́ться [p], запина́ться [i] (stumble over words), запну́ться [p]
    stun: оглуша́ть [i], оглуши́ть [p], ошеломля́ть [i] (leave speechless), ошеломи́ть [p], потряса́ть [i] (amaze)
    subdue: подавля́ть [i] (quell a revolt), подави́ть [p], покоря́ть [i] (overpower), покори́ть [p], укроти́ть [p] (bring under control)
    submit: подава́ть [i] (a form), пода́ть [p], представля́ть [i] (hand in), предста́вить [p], подчиня́ться [i] (yield)
    subscribe: подпи́сываться [i], подписа́ться [p], выпи́сывать [i] (a magazine), вы́писать [p]
    subsidize: субсиди́ровать [b], финанси́ровать [b] (fund)
    substitute: заменя́ть [i] (replace, swap), замени́ть [p], замеща́ть [i] (stand in for), замести́ть [p]
    subtract: вычита́ть [i], вы́честь [p], отнима́ть [i], отня́ть [p]
    succeed: преуспева́ть [i] (be successful), преуспе́ть [p], удава́ться [i] (an attempt works), уда́ться [p], сменя́ть [i] (follow into a role)
    succumb: поддава́ться [i] (give in), подда́ться [p], уступа́ть [i], уступи́ть [p]
    suck: соса́ть [i], пососа́ть [p], вса́сывать [i] (suck up), всоса́ть [p]
    sue: суди́ться [i] (take legal action)
    suffer: страда́ть [i], пострада́ть [p], терпе́ть [i] (suffer loss), потерпе́ть [p], боле́ть [i] (an illness)
    suffocate: задыха́ться [i] (be unable to breathe), задохну́ться [p], души́ть [i] (smother someone), задуши́ть [p]
    suggest: предлага́ть [i], предложи́ть [p], сове́товать [i] (recommend), посове́товать [p], намека́ть [i] (hint)
    suit: подходи́ть [i], подойти́ [p], идти́ [i] (of clothes, look good on), соотве́тствовать [i] (match requirements), устра́ивать [i] (be convenient for)
    sum: скла́дывать [i], сложи́ть [p], подсчи́тывать [i], подсчита́ть [p]
    summarize: резюми́ровать [b], обобща́ть [i], обобщи́ть [p]
    summon: вызыва́ть [i], вы́звать [p], созыва́ть [i] (convene), созва́ть [p], подзыва́ть [i] (call over)
    supersede: заменя́ть [i], замени́ть [p], вытесня́ть [i] (displace), вы́теснить [p]
    supervise: руководи́ть [i] (manage), контроли́ровать [i] (monitor), проконтроли́ровать [p], надзира́ть [i] (oversee), наблюда́ть [i] (monitor)
    supplement: дополня́ть [i], допо́лнить [p], пополня́ть [i] (top up), попо́лнить [p]
    supply: снабжа́ть [i] (with), снабди́ть [p], обеспе́чивать [i] (provide), обеспе́чить [p], поставля́ть [i]
    support: подде́рживать [i] (back an idea, cheer on), поддержа́ть [p], подпира́ть [i] (hold up physically), подпере́ть [p], содержа́ть [i] (provide for financially)
    suppose: предполага́ть [i] (assume), предположи́ть [p], полага́ть [i] (guess), допуска́ть [i], допусти́ть [p]
    suppress: подавля́ть [i] (a revolt, a memory), подави́ть [p], пресека́ть [i], пресе́чь [p], вытесня́ть [i] (repress a memory)
    surf: просма́тривать [i] (browse the web), просмотре́ть [p] (browse the web)
    surge: возраста́ть [i] (rise sharply, of numbers), подска́кивать [i] (numbers jump), подско́чить [p], хлы́нуть [p] (rush, of waves), вздыма́ться [i] (swell, of waves)
    surmise: предполага́ть [i], предположи́ть [p], дога́дываться [i], догада́ться [p]
    surpass: превосходи́ть [i] (exceed), превзойти́ [p], превыша́ть [i], превы́сить [p], опережа́ть [i]
    surprise: удивля́ть [i], удиви́ть [p], удивля́ться [i] (be surprised), удиви́ться [p], заста́ть [p] (catch unawares)
    surrender: сдава́ться [i], сда́ться [p], капитули́ровать [b], сдава́ть [i] (hand over), сдать [p]
    surround: окружа́ть [i], окружи́ть [p], обступа́ть [i] (crowd around), обступи́ть [p], оцепля́ть [i] (military)
    survey: опра́шивать [i] (poll people), опроси́ть [p], осма́тривать [i] (inspect, look over), осмотре́ть [p], обсле́довать [b] (inspect)
    survive: выжива́ть [i], вы́жить [p], пережива́ть [i] (get through), пережи́ть [p], уцеле́ть [p]
    suspect: подозрева́ть [i], заподо́зрить [p], предполага́ть [i] (think likely), предположи́ть [p]
    suspend: приостана́вливать [i] (put on hold, halt), приостанови́ть [p], отстраня́ть [i] (from duty), отстрани́ть [p], подве́шивать [i] (hang)
    sustain: подде́рживать [i] (keep going), поддержа́ть [p], выде́рживать [i] (bear weight), вы́держать [p], получи́ть [p] (an injury)
    swallow: глота́ть [i], проглоти́ть [p], глотну́ть [p] (gulp down), пожира́ть [i] (devour)
    swap: меня́ть [i], поменя́ть [p], меня́ться [i], поменя́ться [p], обме́ниваться [i]
    sway: кача́ться [i], качну́ться [p], влия́ть [i] (influence opinion), повлия́ть [p], колеба́ться [i]
    swear: кля́сться [i] (vow), покля́сться [p], руга́ться [i] (curse, use bad language), вы́ругаться [p], присяга́ть [i] (swear an oath)
    sweat: поте́ть [i], вспоте́ть [p]
    sweep: мести́ [i], подмета́ть [i], подмести́ [p], смета́ть [i] (clear out), смести́ [p]
    sweeten: подсла́щивать [i], подсласти́ть [p], смягча́ть [i] (make more pleasant), смягчи́ть [p]
    swell: опуха́ть [i] (body part), опу́хнуть [p], набуха́ть [i] (expand with moisture), набу́хнуть [p], увели́чиваться [i] (increase)
    swim: пла́вать [i], плыть [i], поплы́ть [p], купа́ться [i] (bathe), искупа́ться [p]
    swindle: обма́нывать [i], обману́ть [p], моше́нничать [i], надува́ть [i] (colloquial), наду́ть [p]
    swing: кача́ться [i] (swing, sway back and forth), качну́ться [p], маха́ть [i] (swing an arm), махну́ть [p], кача́ть [i] (swing something, rock)
    swipe: проводи́ть [i] (a card), провести́ [p], листа́ть [i] (a screen), стащи́ть [p] (steal), ута́скивать [i] (steal)
    switch: переключа́ть [i], переключи́ть [p], переключа́ться [i], переключи́ться [p], меня́ться [i] (swap)
    symbolize: символизи́ровать [i], олицетворя́ть [i] (embody), олицетвори́ть [p]
    sympathize: сочу́вствовать [i], посочу́вствовать [p], жале́ть [i] (pity), пожале́ть [p], симпатизи́ровать [i] (with an idea)
    sync: синхронизи́ровать [b]
    synchronize: синхронизи́ровать [b], согласо́вывать [i] (coordinate), согласова́ть [p], совпада́ть [i] (match up), совпа́сть [p]
    synthesize: синтези́ровать [b], объединя́ть [i] (merge), объедини́ть [p]
    tack: прикрепля́ть [i] (fasten with tacks, pin on), прикрепи́ть [p], прибива́ть [i] (nail on), приби́ть [p], добавля́ть [i] (tack on)
    tackle: бра́ться [i] (take on a problem), взя́ться [p], справля́ться [i] (deal with), спра́виться [p], отбира́ть [i] (in sports, win the ball)
    tag: помеча́ть [i], поме́тить [p], маркирова́ть [b], отмеча́ть [i] (tag people), отме́тить [p]
    tailor: приспоса́бливать [i] (adapt, cut to fit a need), приспосо́бить [p], адапти́ровать [b], шить [i] (make clothes), сшить [p]
    taint: загрязня́ть [i] (contaminate), загрязни́ть [p], пятна́ть [i] (sully a reputation), запятна́ть [p]
    take: брать [i], взять [p], забира́ть [i] (take along, take a person along), забра́ть [p], отвози́ть [i] (take to a place by vehicle)
    take care of: забо́титься [i] (look after, provide for), позабо́титься [p], уха́живать [i] (nurse, tend), присма́тривать [i] (look after), занима́ться [i] (handle, deal with)
    take off: снима́ть [i] (clothes, a hat, glasses), снять [p], взлета́ть [i] (a plane), взлете́ть [p]
    take part: уча́ствовать [i], поуча́ствовать [p], присоединя́ться [i] (join in), присоедини́ться [p], включи́ться [p]
    talk: говори́ть [i], поговори́ть [p], разгова́ривать [i], болта́ть [i] (chat), бесе́довать [i] (converse, formal)
    tally: подсчи́тывать [i] (count up, votes), подсчита́ть [p], совпада́ть [i] (agree, match), совпа́сть [p]
    tame: приру́чать [i], приручи́ть [p], укроща́ть [i], укроти́ть [p] (control)
    tamper: фальсифици́ровать [b] (falsify), подде́лывать [i], подде́лать [p], вме́шиваться [i] (interfere), ковыря́ться [i] (fiddle with)
    tan: загора́ть [i] (skin), загоре́ть [p], дуби́ть [i] (leather), вы́дубить [p]
    tangle: запу́тывать [i], запу́тать [p], запу́тываться [i] (get tangled), запу́таться [p], спу́тывать [i] (hair, wool)
    tap: стуча́ть [i] (knock or tap), постуча́ть [p], нажима́ть [i] (a screen), нажа́ть [p], прослу́шивать [i] (a phone)
    tape: запи́сывать [i] (record, audio, video), записа́ть [p], скле́ивать [i] (stick with tape), скле́ить [p]
    taper: сужа́ться [i] (come to a point), су́зиться [p], заостря́ть [i] (sharpen), заостри́ть [p], убыва́ть [i] (taper off)
    target: це́литься [i] (take aim at), прице́литься [p], наце́ливать [i] (aim at), наце́лить [p], ориенти́ровать [b] (be aimed at)
    tarnish: тускне́ть [i] (metal goes dull), потускне́ть [p], мара́ть [i] (sully a reputation), замара́ть [p], запятна́ть [p]
    taste: про́бовать [i] (sample), попро́бовать [p], отве́дать [p], дегусти́ровать [b] (wine, food), смакова́ть [i] (savor)
    tattoo: татуи́ровать [b]
    taunt: дразни́ть [i], подразни́ть [p], издева́ться [i] (mock), насмеха́ться [i], провоци́ровать [i] (provoke)
    tax: облага́ть [i] (impose a tax), обложи́ть [p], обременя́ть [i] (strain, burden), обремени́ть [p]
    teach: учи́ть [i], научи́ть [p] (teach a skill), преподава́ть [i] (a class, a subject), обуча́ть [i], обучи́ть [p]
    tear: рвать [i], порва́ть [p], разрыва́ть [i] (rip to pieces), разорва́ть [p], сорва́ть [p] (rip off)
    tear down: сноси́ть [i], снести́ [p], разбира́ть [i] (dismantle), разобра́ть [p], демонти́ровать [b] (dismantle)
    tease: дразни́ть [i] (tease someone), подразни́ть [p], подшу́чивать [i] (make fun of), подшути́ть [p], донима́ть [i] (pick on)
    telephone: звони́ть [i], позвони́ть [p], созва́ниваться [i], созвони́ться [p]
    tell: говори́ть [i], сказа́ть [p] (inform, convey), расска́зывать [i] (a story), рассказа́ть [p], сообща́ть [i] (inform)
    tell off: руга́ть [i], отруга́ть [p], отчи́тывать [i] (lecture), отчита́ть [p], пожури́ть [p]
    tempt: искуша́ть [i], искуси́ть [p], соблазня́ть [i], соблазни́ть [p]
    tend: склоня́ться [i] (be inclined to), склони́ться [p], тяготе́ть [i] (be inclined to), уха́живать [i] (care for), присма́тривать [i] (look after)
    tenderize: отбива́ть [i] (pound meat), отби́ть [p], размягча́ть [i] (soften), размягчи́ть [p], маринова́ть [i] (marinate to soften)
    terminate: прекраща́ть [i] (end), прекрати́ть [p], расторга́ть [i] (a contract), расто́ргнуть [p], увольня́ть [i] (an employee)
    terrify: пуга́ть [i] (frighten), напуга́ть [p], ужаса́ть [i], ужасну́ть [p], ужаса́ться [i] (be terrified)
    test: проверя́ть [i] (try out), прове́рить [p], тести́ровать [i] (medical or technical), протести́ровать [p], испы́тывать [i] (try out)
    testify: свиде́тельствовать [i] (in court, attest), засвиде́тельствовать [p], заявля́ть [i] (declare), заяви́ть [p], пока́зывать [i] (give evidence in court)
    tether: привя́зывать [i] (a dog), привяза́ть [p], пристёгивать [i], пристегну́ть [p]
    thank: благодари́ть [i], поблагодари́ть [p], отблагодари́ть [p]
    thaw: размора́живать [i] (defrost, frozen food), разморо́зить [p], та́ять [i] (ice or snow melts), раста́ять [p], растопи́ть [p] (melt something)
    thicken: сгуща́ть [i] (a sauce, liquids), сгусти́ть [p], густе́ть [i] (get thicker), погусте́ть [p], утолща́ть [i] (make thicker)
    thin: худе́ть [i] (get thin), похуде́ть [p], реде́ть [i] (hair, crowds), пореде́ть [p], разбавля́ть [i] (dilute)
    think: ду́мать [i], поду́мать [p] (ponder), счита́ть [i] (believe, regard as), размышля́ть [i] (ponder), полага́ть [i] (believe)
    think about: ду́мать [i], поду́мать [p], размышля́ть [i], обду́мывать [i] (consider), обду́мать [p]
    thread: продева́ть [i] (a needle), проде́ть [p], вдева́ть [i], вдеть [p], нани́зывать [i] (beads)
    threaten: угрожа́ть [i] (endanger), грози́ть [i], пригрози́ть [p]
    thrill: волнова́ть [i] (make excited), взволнова́ть [p], захва́тывать [i] (grip, sweep along), захвати́ть [p], восхища́ть [i]
    thrive: процвета́ть [i], процвести́ [p], преуспева́ть [i] (of a business), преуспе́ть [p], расцвета́ть [i] (bloom)
    throb: пульси́ровать [i] (pulse), би́ться [i] (of the heart), ныть [i] (ache), заны́ть [p], колоти́ться [i] (heart pounds)
    throttle: души́ть [i] (choke someone), задуши́ть [p], дроссели́ровать [b] (reduce flow), ограни́чивать [i] (restrict a flow), ограни́чить [p]
    throw: броса́ть [i], бро́сить [p] (hurl), кида́ть [i] (colloquial), ки́нуть [p], швыря́ть [i] (hurl)
    throw away: выбра́сывать [i] (dispose of), вы́бросить [p], выки́дывать [i] (colloquial), вы́кинуть [p]
    thrust: толка́ть [i] (shove), толкну́ть [p], вонза́ть [i] (stab with a blade), вонзи́ть [p], высо́вывать [i] (stick out)
    thump: колоти́ть [i] (pound, beat on), ударя́ть [i] (hit hard), уда́рить [p], стуча́ть [i], грохота́ть [i] (thud)
    thunder: греме́ть [i], прогреме́ть [p], громыха́ть [i] (rumble), рыча́ть [i] (roar at someone)
    thwart: срыва́ть [i] (plans), сорва́ть [p], расстра́ивать [i], расстро́ить [p], препя́тствовать [i] (hinder)
    tick: тика́ть [i] (clock), отмеча́ть [i] (check off, mark on a form), отме́тить [p]
    tidy: убира́ть [i] (tidy up), убра́ть [p], прибира́ть [i], прибра́ть [p], упоря́дочивать [i] (put in order)
    tie: завя́зывать [i] (shoes, bags), завяза́ть [p], привя́зывать [i] (fasten), привяза́ть [p], свя́зывать [i] (tie together)
    tighten: затя́гивать [i], затяну́ть [p], закру́чивать [i] (screws), закрути́ть [p], ужесточа́ть [i] (rules)
    tilt: наклоня́ть [i], наклони́ть [p], наклоня́ться [i], наклони́ться [p]
    time: засека́ть [i] (measure time), засе́чь [p], замеря́ть [i] (measure), назнача́ть [i] (schedule), назна́чить [p]
    tingle: пока́лывать [i], дрожа́ть [i] (with a chill or excitement), щекота́ть [i] (tickle), пощекота́ть [p], онеме́ть [p] (go numb)
    tint: окра́шивать [i] (dye), окра́сить [p], раскра́шивать [i] (colour in), раскра́сить [p], тони́ровать [b] (tint)
    tip: наклоня́ть [i] (tilt), наклони́ть [p], опроки́дывать [i] (tip over), опроки́нуть [p], вознагражда́ть [i] (give a gratuity)
    tire: устава́ть [i] (get tired), уста́ть [p], утомля́ть [i] (exhaust), утоми́ть [p], надоеда́ть [i] (bore, annoy; the reverse of grow tired of)
    title: озагла́вливать [i], озагла́вить [p], называ́ть [i] (name), назва́ть [p]
    toast: поджа́ривать [i] (bread), поджа́рить [p], чо́каться [i] (clink glasses), чо́кнуться [p], жа́рить [i] (roast)
    toggle: переключа́ть [i], переключи́ть [p], чередова́ть [i] (alternate)
    tolerate: терпе́ть [i], стерпе́ть [p], мири́ться [i] (put up with), смири́ться [p], выноси́ть [i] (endure)
    tone: тонизи́ровать [b], укрепля́ть [i] (strengthen muscles), укрепи́ть [p], подтя́гивать [i] (muscles, skin), подтяну́ть [p]
    top: превосходи́ть [i] (exceed), превзойти́ [p], возглавля́ть [i] (top a list), возглави́ть [p], увенча́ть [p] (crown)
    topple: опроки́дывать [i] (knock over, overturn), опроки́нуть [p], сверга́ть [i] (overthrow), све́ргнуть [p], ру́хнуть [p] (fall over)
    torment: му́чить [i], заму́чить [p], терза́ть [i], истерза́ть [p]
    torture: пыта́ть [i], истяза́ть [i], му́чить [i] (torment), заму́чить [p]
    toss: броса́ть [i], бро́сить [p], подбра́сывать [i] (toss up), подбро́сить [p], воро́чаться [i] (toss in bed)
    touch: тро́гать [i], тро́нуть [p], каса́ться [i], косну́ться [p], растро́гать [p] (move emotionally)
    tour: объезжа́ть [i] (a region), объе́хать [p], осма́тривать [i] (sights), осмотре́ть [p], путеше́ствовать [i]
    tow: букси́ровать [i], отбукси́ровать [p], тащи́ть [i] (haul), потащи́ть [p]
    trace: просле́живать [i] (origins, trace back), проследи́ть [p], обводи́ть [i] (trace a line), обвести́ [p], разы́скивать [i] (track down)
    track: отсле́живать [i], отследи́ть [p], следи́ть [i] (follow), пресле́довать [i] (chase), разы́скивать [i] (hunt down)
    trade: торгова́ть [i] (internationally), обме́нивать [i] (exchange for), обменя́ть [p], меня́ться [i] (swap), поменя́ться [p]
    train: тренирова́ть [i] (train someone), натренирова́ть [p], тренирова́ться [i] (do training), потренирова́ться [p], обуча́ть [i] (teach skills)
    trample: топта́ть [i], растопта́ть [p], затопта́ть [p], попира́ть [i] (figuratively), попра́ть [p]
    transcend: превосходи́ть [i] (go beyond), превзойти́ [p], преодолева́ть [i] (cross a limit), преодоле́ть [p]
    transcribe: расшифро́вывать [i] (from audio), расшифрова́ть [p], перепи́сывать [i] (copy out), переписа́ть [p], транскриби́ровать [b] (convert to another form)
    transfer: переводи́ть [i] (money, an employee), перевести́ [p], передава́ть [i] (data, rights), переда́ть [p], перечисля́ть [i] (money)
    transform: превраща́ть [i] (convert), преврати́ть [p], преобразо́вывать [i], преобразова́ть [p], трансформи́ровать [b]
    translate: переводи́ть [i], перевести́ [p]
    transmit: передава́ть [i] (signal, data, disease), переда́ть [p], пересыла́ть [i] (data), пересла́ть [p], веща́ть [i] (broadcast)
    transpire: происходи́ть [i], произойти́ [p], выясня́ться [i] (become known), вы́ясниться [p], испаря́ть [i] (of plants)
    transplant: переса́живать [i] (plants, tissue, organs), пересади́ть [p]
    transport: перевози́ть [i] (passengers, goods), перевезти́ [p], доставля́ть [i] (ship), доста́вить [p]
    trap: лови́ть [i] (catch), пойма́ть [p], запира́ть [i] (lock in, confine), запере́ть [p], зама́нивать [i] (ensnare)
    travel: путеше́ствовать [i] (go away on a trip), е́здить [i] (go by vehicle, repeatedly), е́хать [i] (go by vehicle, one way), пое́хать [p], съе́здить [p] (make a round trip)
    traverse: пересека́ть [i], пересе́чь [p], проезжа́ть [i] (by vehicle), прое́хать [p], проходи́ть [i] (on foot)
    tread: ступа́ть [i] (set foot on), ступи́ть [p], наступа́ть [i] (step on), наступи́ть [p], шага́ть [i] (stride)
    treasure: дорожи́ть [i] (hold dear), цени́ть [i] (value), бере́чь [i] (keep safe), сбере́чь [p], храни́ть [i] (guard like a treasure)
    treat: относи́ться [i] (behave toward), угоща́ть [i] (treat to a meal), угости́ть [p], лечи́ть [i] (medically), вы́лечить [p]
    tremble: дрожа́ть [i] (with cold, fear), задрожа́ть [p], трепета́ть [i], содрога́ться [i] (shudder), содрогну́ться [p]
    trick: обма́нывать [i], обману́ть [p], перехитри́ть [p] (outwit), дура́чить [i] (con), одура́чить [p]
    trickle: сочи́ться [i] (seep out), просочи́ться [p], ка́пать [i], течь [i] (leak), струи́ться [i]
    trigger: вызыва́ть [i] (bring about), вы́звать [p], запуска́ть [i] (activate), запусти́ть [p], активи́ровать [b]
    trim: подстрига́ть [i] (beard, hedge, hair), подстри́чь [p], обреза́ть [i] (prune), обре́зать [p], сокраща́ть [i] (cut costs)
    trip: спотыка́ться [i] (fall down), споткну́ться [p]
    triple: утра́ивать [i], утро́ить [p], утра́иваться [i] (grow threefold), утро́иться [p]
    trivialize: преуменьша́ть [i] (play down), преуменьши́ть [p], упроща́ть [i] (oversimplify), упрости́ть [p], принижа́ть [i] (belittle)
    trot: труси́ть [i]
    trouble: беспоко́ить [i] (bother, disturb), побеспоко́ить [p], трево́жить [i] (worry), встрево́жить [p], затрудня́ть [i] (put to trouble)
    truncate: усека́ть [i], усе́чь [p], обреза́ть [i], обре́зать [p], сокраща́ть [i] (shorten)
    trust: доверя́ть [i] (trust, entrust), дове́рить [p], ве́рить [i] (believe someone), пове́рить [p], полага́ться [i] (rely on)
    try: пыта́ться [i] (attempt), попыта́ться [p], про́бовать [i] (try out, try food), попро́бовать [p], стара́ться [i]
    try on: примеря́ть [i] (clothes, shoes), приме́рить [p]
    tuck: заправля́ть [i] (a bed, tuck in), запра́вить [p], подтыка́ть [i] (fold edges in), подоткну́ть [p], засо́вывать [i] (stuff in)
    tumble: па́дать [i] (fall, of prices), упа́сть [p], ру́хнуть [p] (collapse), обвали́ться [p] (of prices), кувырка́ться [i] (tumble over)
    tune: настра́ивать [i] (an instrument, a piano, radio), настро́ить [p], регули́ровать [i] (engine, car), отрегули́ровать [p], подстра́ивать [i] (adjust)
    tunnel: рыть [i] (tunnel under), проры́ть [p], прорыва́ть [i] (dig through), подка́пывать [i] (tunnel under), подкопа́ть [p]
    turn: повора́чивать [i] (change direction, turn something), поверну́ть [p], повора́чиваться [i] (turn oneself), поверну́ться [p], враща́ть [i] (rotate)
    turn around: развора́чиваться [i] (go back), разверну́ться [p], развора́чивать [i] (turn the other way), разверну́ть [p], обора́чиваться [i] (look back)
    turn down: отклоня́ть [i] (reject), отклони́ть [p], отка́зывать [i] (turn away), отказа́ть [p], убавля́ть [i] (volume, heat)
    turn into: превраща́ться [i] (become), преврати́ться [p], превраща́ть [i] (convert), преврати́ть [p], станови́ться [i] (become)
    turn off: выключа́ть [i], вы́ключить [p], отключа́ть [i] (disconnect, power), отключи́ть [p], гаси́ть [i] (lights)
    turn on: включа́ть [i], включи́ть [p], зажига́ть [i] (a light), заводи́ть [i] (engine), открыва́ть [i] (a tap, water)
    turn up: прибавля́ть [i] (volume, heat), приба́вить [p], появля́ться [i] (appear, show up), появи́ться [p], объявля́ться [i] (show up)
    tweet: чири́кать [i] (of birds), щебета́ть [i] (of birds), твитну́ть [p] (post a tweet)
    twinkle: мерца́ть [i], мига́ть [i], сверка́ть [i], искри́ться [i]
    twirl: кружи́ть [i], закружи́ть [p], кружи́ться [i] (circle), крути́ть [i] (turn round), верте́ть [i] (turn round)
    type: печа́тать [i] (type out a text), напеча́тать [p], набира́ть [i] (on a keyboard), набра́ть [p], вводи́ть [i] (enter text)
    umpire: суди́ть [i] (a match, as referee), рассуди́ть [p] (arbitrate a dispute), ула́живать [i] (settle a dispute), ула́дить [p]
    unbutton: расстёгивать [i], расстегну́ть [p]
    uncover: обнару́живать [i] (reveal, expose), обнару́жить [p], раскрыва́ть [i] (reveal), раскры́ть [p], раска́пывать [i] (excavate)
    underestimate: недооце́нивать [i], недооцени́ть [p], преуменьша́ть [i], преуменьши́ть [p]
    undergo: проходи́ть [i] (go through), пройти́ [p], переноси́ть [i] (suffer), перенести́ [p], испы́тывать [i] (experience)
    underline: подчёркивать [i], подчеркну́ть [p], акценти́ровать [b] (emphasize)
    undermine: подрыва́ть [i], подорва́ть [p], подта́чивать [i] (erode), подточи́ть [p], ослабля́ть [i] (weaken)
    underpin: подкрепля́ть [i] (back up), подкрепи́ть [p], подде́рживать [i] (support), поддержа́ть [p]
    understand: понима́ть [i], поня́ть [p], разбира́ться [i] (understand a subject), разобра́ться [p], осознава́ть [i] (realize)
    understate: преуменьша́ть [i] (play down), преуменьши́ть [p], умаля́ть [i], умали́ть [p], зама́лчивать [i] (underreport)
    undertake: предпринима́ть [i] (take on), предприня́ть [p], бра́ться [i] (take on), взя́ться [p], приступа́ть [i] (set about)
    underwrite: страхова́ть [i] (insure), застрахова́ть [p], гаранти́ровать [b] (guarantee), руча́ться [i] (stand surety), поручи́ться [p]
    undo: развя́зывать [i] (untie, loosen), развяза́ть [p], отменя́ть [i] (reverse, revoke, cancel), отмени́ть [p], расстёгивать [i] (unfasten)
    undress: раздева́ть [i] (take clothes off someone), разде́ть [p], раздева́ться [i], разде́ться [p]
    unearth: отка́пывать [i] (dig up), откопа́ть [p], обнару́живать [i] (find), обнару́жить [p], раскрыва́ть [i] (reveal)
    unfasten: расстёгивать [i], расстегну́ть [p], отстёгивать [i] (detach), отстегну́ть [p], развя́зывать [i] (untie)
    unfold: развора́чивать [i] (spread out), разверну́ть [p], раскрыва́ть [i] (flip open), раскры́ть [p], развора́чиваться [i] (of events)
    unfurl: развёртывать [i] (flag, scroll), разверну́ть [p], разма́тывать [i] (roll out), размота́ть [p], расправля́ть [i] (spread open)
    unhook: отцепля́ть [i] (release, detach), отцепи́ть [p], расцепля́ть [i], расцепи́ть [p], отсоединя́ть [i] (detach)
    unify: объединя́ть [i] (bring together), объедини́ть [p], унифици́ровать [b] (standardize), стандартизи́ровать [b], сплоти́ть [p]
    uninstall: удаля́ть [i] (remove), удали́ть [p], стира́ть [i] (delete), стере́ть [p]
    unite: объединя́ть [i], объедини́ть [p], объединя́ться [i] (band together, unite as a group), объедини́ться [p], соединя́ть [i] (join)
    unleash: развя́зывать [i] (let loose, a war), развяза́ть [p], спуска́ть [i] (let loose), спусти́ть [p], высвобожда́ть [i] (release)
    unload: разгружа́ть [i] (goods, cargo), разгрузи́ть [p], разряжа́ть [i] (weapon, battery), разряди́ть [p], выгружа́ть [i] (cargo)
    unmask: разоблача́ть [i] (expose, reveal a spy), разоблачи́ть [p], раскрыва́ть [i] (reveal), раскры́ть [p]
    unpack: распако́вывать [i], распакова́ть [p], разбира́ть [i] (luggage), разобра́ть [p], вынима́ть [i] (take out)
    unplug: отключа́ть [i] (disconnect), отключи́ть [p], выдёргивать [i] (a plug), вы́дернуть [p], вынима́ть [i] (a plug)
    unravel: распу́тывать [i] (untangle), распута́ть [p], разга́дывать [i] (solve a mystery), разгада́ть [p], расплета́ть [i] (unweave)
    unroll: раска́тывать [i] (a carpet), раската́ть [p], развёртывать [i] (a scroll), разверну́ть [p], разма́тывать [i] (a roll)
    unscrew: откру́чивать [i] (a lid, loosen), открути́ть [p], отви́нчивать [i] (take out screws), отвинти́ть [p]
    unsettle: смуща́ть [i] (make uncertain), смути́ть [p], трево́жить [i] (disturb), встрево́жить [p], волнова́ть [i] (disturb deeply)
    untie: развя́зывать [i] (a knot), развяза́ть [p], отвя́зывать [i] (set free), отвяза́ть [p]
    unveil: представля́ть [i] (present a product), предста́вить [p], открыва́ть [i] (a monument, a statue), откры́ть [p], объявля́ть [i] (announce)
    unwrap: развора́чивать [i] (a gift, remove wrapping), разверну́ть [p], распако́вывать [i] (a gift), распакова́ть [p]
    unzip: распако́вывать [i] (files, data), распакова́ть [p], расстёгивать [i] (a zipper), расстегну́ть [p]
    update: обновля́ть [i] (renew), обнови́ть [p], обновля́ться [i], обнови́ться [p], модернизи́ровать [b]
    upgrade: улучша́ть [i] (improve), улу́чшить [p], модернизи́ровать [b] (equipment, hardware), повыша́ть [i] (raise in rank), повы́сить [p]
    uphold: подде́рживать [i] (maintain), поддержа́ть [p], отста́ивать [i] (defend), отстоя́ть [p], соблюда́ть [i] (a law or principle)
    uplift: поднима́ть [i], подня́ть [p], воодушевля́ть [i] (lift spirits), воодушеви́ть [p], возвыша́ть [i] (elevate)
    upload: загружа́ть [i], загрузи́ть [p], выкла́дывать [i] (post online), вы́ложить [p]
    uproot: выкорчёвывать [i] (clear land), выкорчева́ть [p], искореня́ть [i] (eradicate), искорени́ть [p], вырыва́ть [i] (pull out)
    upset: расстра́ивать [i] (make upset, disrupt), расстро́ить [p], огорча́ть [i] (hurt feelings), огорчи́ть [p], расстра́иваться [i] (be upset)
    urge: призыва́ть [i] (call upon), призва́ть [p], побужда́ть [i] (drive on), побуди́ть [p], настаива́ть [i] (press for)
    use: использова́ть [b], по́льзоваться [i], воспо́льзоваться [p], применя́ть [i] (apply), примени́ть [p]
    usher: провожа́ть [i] (escort), проводи́ть [p], сопровожда́ть [i] (escort), сопроводи́ть [p], вводи́ть [i] (usher in an era)
    usurp: узурпи́ровать [b], захва́тывать [i] (wrest power from), захвати́ть [p], присва́ивать [i] (take over illegally), присво́ить [p]
    utilize: использова́ть [b] (make use of), применя́ть [i] (put to use), примени́ть [p], употребля́ть [i], употреби́ть [p]
    utter: произноси́ть [i], произнести́ [p] (say aloud), издава́ть [i] (a cry), изда́ть [p], проговори́ть [p]
    vaccinate: привива́ть [i] (give a vaccine), приви́ть [p], вакцини́ровать [b]
    vacuum: пылесо́сить [i] (with a vacuum), пропылесо́сить [p], отса́сывать [i] (suck away), отсоса́ть [p], вса́сывать [i] (suck up)
    validate: подтвержда́ть [i] (confirm, affirm), подтверди́ть [p], проверя́ть [i] (check), прове́рить [p], утверди́ть [p] (approve)
    value: цени́ть [i] (appreciate, cherish), оце́нивать [i] (put a value on, appraise), оцени́ть [p], дорожи́ть [i] (hold dear), уважа́ть [i] (hold in esteem)
    vandalize: по́ртить [i] (damage), испо́ртить [p], разруша́ть [i] (wreck), разру́шить [p], громи́ть [i] (smash up)
    vanish: исчеза́ть [i], исче́знуть [p], пропада́ть [i], пропа́сть [p], та́ять [i] (dwindle away)
    vaporize: испаря́ть [i], испари́ть [p], испаря́ться [i] (evaporate slowly), испари́ться [p], распыля́ть [i] (atomize)
    varnish: лакирова́ть [i], отлакирова́ть [p], покрыва́ть [i] (coat), покры́ть [p], глазирова́ть [b] (glaze)
    vary: меня́ться [i] (change), различа́ться [i] (differ), колеба́ться [i] (fluctuate), варьи́ровать [b], изменя́ть [i] (alter)
    veer: свора́чивать [i] (turn sharply, swerve out), сверну́ть [p], отклоня́ться [i] (deviate), отклони́ться [p], шарахну́ться [p] (swerve)
    vent: излива́ть [i] (pour out feelings), изли́ть [p], выплёскивать [i] (emotions, anger), вы́плеснуть [p], выпуска́ть [i] (let air out, steam)
    ventilate: прове́тривать [i] (air out thoroughly), прове́трить [p]
    venture: рискова́ть [i] (risk), рискну́ть [p], отва́живаться [i] (dare, venture), отва́житься [p], выска́зывать [i] (venture an opinion)
    verify: проверя́ть [i] (check), прове́рить [p], подтвержда́ть [i] (confirm), подтверди́ть [p], верифици́ровать [b]
    veto: запреща́ть [i] (forbid), запрети́ть [p], отклоня́ть [i] (reject a bill), отклони́ть [p], блоки́ровать [b] (block)
    vex: раздража́ть [i], раздражи́ть [p], досажда́ть [i] (irk), досади́ть [p], злить [i]
    vibrate: вибри́ровать [i], дрожа́ть [i] (tremble), задрожа́ть [p], колеба́ться [i] (oscillate), поколеба́ться [p]
    victimize: притесня́ть [i] (oppress), притесни́ть [p], угнета́ть [i] (oppress), трави́ть [i] (bully), затрави́ть [p]
    videotape: снима́ть [i] (record on video), снять [p], запи́сывать [i] (record), записа́ть [p]
    vie: сопе́рничать [i], соревнова́ться [i], посоревнова́ться [p], конкури́ровать [i], состяза́ться [i]
    view: смотре́ть [i], посмотре́ть [p], рассма́тривать [i] (observe, look at closely), рассмотре́ть [p], просма́тривать [i] (a document or web page)
    vilify: клевета́ть [i] (defame), оклевета́ть [p], очерня́ть [i] (disparage), очерни́ть [p], поноси́ть [i] (revile)
    vindicate: опра́вдывать [i] (justify, clear of blame), оправда́ть [p], реабилити́ровать [b] (restore reputation), подтвержда́ть [i] (prove right), подтверди́ть [p]
    violate: наруша́ть [i], нару́шить [p], преступа́ть [i] (a law, promise), преступи́ть [p], попира́ть [i] (rights)
    visit: посеща́ть [i] (a place), посети́ть [p], навеща́ть [i] (a person), навести́ть [p], заходи́ть [i] (drop by)
    visualize: представля́ть [i] (picture mentally), предста́вить [p], вообража́ть [i] (picture mentally), визуализи́ровать [b] (make visible), изобража́ть [i] (depict)
    vocalize: произноси́ть [i] (say aloud), произнести́ [p], выража́ть [i] (express in words), вы́разить [p], артикули́ровать [b] (articulate)
    void: аннули́ровать [b], отменя́ть [i] (cancel a transaction), отмени́ть [p], расторга́ть [i] (rescind), расто́ргнуть [p]
    vomit: рвать [i] (impersonal: его рвёт), вы́рвать [p] (impersonal: его вырвало), блева́ть [i] (vulgar), стошни́ть [p], изрыга́ть [i] (literary)
    vote: голосова́ть [i], проголосова́ть [p], выбира́ть [i] (elections), вы́брать [p]
    vouch: руча́ться [i] (answer for), поручи́ться [p], гаранти́ровать [b] (guarantee), заверя́ть [i] (assure), заве́рить [p]
    vow: кля́сться [i], покля́сться [p], обеща́ть [i] (promise), пообеща́ть [p]
    voyage: путеше́ствовать [i] (travel abroad), плыть [i] (travel by ship), поплы́ть [p], пла́вать [i] (sail)
    wade: брести́ [i] (wade, slosh through water), побрести́ [p], переправля́ться [i] (ford on foot), переправи́ться [p], шлёпать [i] (slosh)
    wag: виля́ть [i], повиля́ть [p], маха́ть [i] (swish gently), помаха́ть [p], верте́ть [i]
    wail: выть [i] (of a siren), завы́ть [p], стона́ть [i] (moan), причита́ть [i] (lament), опла́кивать [i] (lament, mourn)
    wait: ждать [i], подожда́ть [p], дожида́ться [i] (wait until something happens), дожда́ться [p], выжида́ть [i] (stand by)
    wait for: ждать [i], подожда́ть [p], ожида́ть [i] (expect), подстерега́ть [i] (lie in wait for), подстере́чь [p]
    wait on: обслу́живать [i] (serve customers), обслужи́ть [p], подава́ть [i] (serve food, at table), пода́ть [p], прислу́живать [i] (serve a master, attend on)
    waive: отка́зываться [i] (a right), отказа́ться [p], отменя́ть [i] (a fee), отмени́ть [p], спи́сывать [i] (a debt)
    wake: буди́ть [i] (wake someone), разбуди́ть [p], просыпа́ться [i] (become awake), просну́ться [p], пробужда́ть [i] (awaken)
    wake up: просыпа́ться [i], просну́ться [p], буди́ть [i] (wake someone), разбуди́ть [p], встава́ть [i] (get up)
    walk: ходи́ть [i] (on foot, go back and forth), идти́ [i], пойти́ [p], гуля́ть [i] (take a stroll), погуля́ть [p]
    wall: огора́живать [i] (enclose, wall in), огороди́ть [p], отгора́живать [i] (wall off), отгороди́ть [p], замуро́вывать [i] (wall up)
    waltz: вальси́ровать [i], танцева́ть [i] (dance, waltz), потанцева́ть [p]
    wander: броди́ть [i], поброди́ть [p], блужда́ть [i] (wander aimlessly), скита́ться [i] (roam), слоня́ться [i] (loiter)
    wane: убыва́ть [i] (the moon, decrease), убы́ть [p], ослабева́ть [i] (diminish), ослабе́ть [p], угаса́ть [i] (fade)
    want: хоте́ть [i], захоте́ть [p], жела́ть [i] (desire), пожела́ть [p], добива́ться [i] (seek)
    ward off: отгоня́ть [i] (drive away), отогна́ть [p], отража́ть [i] (repel), отрази́ть [p], предотвраща́ть [i] (prevent)
    warm: греть [i], согре́ть [p], нагрева́ть [i] (heat up, food), нагре́ть [p], тепле́ть [i] (get warm)
    warm up: разогрева́ть [i] (reheat food, heat up), разогре́ть [p], разогрева́ться [i] (get warm), разогре́ться [p], размина́ться [i] (before exercise)
    warn: предупрежда́ть [i], предупреди́ть [p], предостерега́ть [i] (caution, of danger), предостере́чь [p], уведомля́ть [i] (let know)
    warp: деформи́ровать [b] (distort), коро́биться [i] (of wood), покоро́биться [p], искажа́ть [i] (distort), искази́ть [p]
    warrant: опра́вдывать [i] (justify), оправда́ть [p], заслу́живать [i] (merit), тре́бовать [i] (call for), гаранти́ровать [b] (guarantee)
    wash: мыть [i], помы́ть [p], стира́ть [i] (laundry, clothes), постира́ть [p], мы́ться [i] (wash oneself)
    waste: тра́тить [i] (waste, spend needlessly), растра́чивать [i] (squander), растра́тить [p], прома́тывать [i], промота́ть [p]
    watch: смотре́ть [i] (look at, TV, movies), посмотре́ть [p], наблюда́ть [i] (observe), следи́ть [i] (keep watch over), сторожи́ть [i] (watch over)
    water: полива́ть [i] (plants), поли́ть [p], ороша́ть [i] (irrigate), пои́ть [i] (animals), увлажня́ть [i] (moisten)
    wave: маха́ть [i] (wave a hand), помаха́ть [p], развева́ться [i] (flutter in the wind), колыха́ться [i] (billow), приве́тствовать [i] (greet)
    waver: колеба́ться [i] (hesitate, be undecided), поколеба́ться [p], дро́гнуть [p] (falter), сомнева́ться [i] (be undecided)
    weaken: ослабля́ть [i], осла́бить [p], ослабева́ть [i] (decline), ослабе́ть [p], подрыва́ть [i] (undermine)
    wean: отуча́ть [i] (from a habit), отучи́ть [p], отлуча́ть [i] (a baby, wean from milk), отлучи́ть [p], отвыка́ть [i] (give up a habit)
    wear: носи́ть [i] (clothes, shoes, a hat, glasses), надева́ть [i] (put on), наде́ть [p], изна́шивать [i] (wear out), износи́ть [p]
    weave: ткать [i] (on a loom, textiles), сотка́ть [p], плести́ [i] (braid, basket), сплести́ [p], переплета́ть [i] (interlace)
    wed: жени́ться [b] (of a groom), венча́ть [i] (officiate), обвенча́ть [p], венча́ться [i] (marry in church), обвенча́ться [p]
    weep: пла́кать [i], запла́кать [p], рыда́ть [i] (sob loudly), опла́кивать [i] (weep for), опла́кать [p]
    weigh: ве́сить [i] (have a weight of, measure weight), взве́шивать [i] (weigh on scales, weigh options), взве́сить [p], обду́мывать [i] (consider), сопоставля́ть [i] (weigh one against another)
    weigh down: обременя́ть [i] (add weight to), обремени́ть [p], тяготи́ть [i] (weigh on), угнета́ть [i] (depress), удруча́ть [i] (depress)
    welcome: приве́тствовать [i], поприве́тствовать [p], встреча́ть [i] (receive guests), встре́тить [p], принима́ть [i] (take in)
    weld: сва́ривать [i] (weld together), свари́ть [p], прива́ривать [i] (join), привари́ть [p]
    whack: бить [i], ударя́ть [i], уда́рить [p], шлёпнуть [p], колоти́ть [i] (colloquial)
    whip: хлеста́ть [i] (lash, flog), поро́ть [i] (flog), вы́пороть [p], взбива́ть [i] (cream, eggs), взбить [p]
    whisper: шепта́ть [i], прошепта́ть [p], шепну́ть [p] (whisper in someone's ear), нашёптывать [i] (whisper in someone's ear), бормота́ть [i] (murmur)
    whistle: свисте́ть [i], свистну́ть [p], насви́стывать [i] (whistle a tune)
    whiten: бели́ть [i] (paint white), побели́ть [p], отбе́ливать [i] (bleach), отбели́ть [p], беле́ть [i] (turn white)
    whittle: строга́ть [i] (carve), обстрога́ть [p], выреза́ть [i] (carve), вы́резать [p], уреза́ть [i] (whittle down)
    widen: расширя́ть [i], расши́рить [p], расширя́ться [i] (become wider), расши́риться [p], раздвига́ть [i] (stretch, make wider)
    wield: владе́ть [i] (a weapon, a tool), орудова́ть [i] (handle a tool), разма́хивать [i] (brandish), обраща́ться [i] (handle), применя́ть [i] (power, influence)
    wiggle: шевели́ть [i] (fingers or toes), пошевели́ть [p], ёрзать [i] (fidget, squirm), извива́ться [i] (squirm), виля́ть [i] (wag, wiggle)
    win: выи́грывать [i], вы́играть [p], побежда́ть [i] (be victorious), победи́ть [p], завоёвывать [i] (win through effort)
    win over: убежда́ть [i] (convince), убеди́ть [p], склоня́ть [i] (talk into), склони́ть [p], расположи́ть [p] (win someone's favour)
    wind: заводи́ть [i] (a clock, a toy), завести́ [p], нама́тывать [i] (wind thread, wrap around), намота́ть [p], извива́ться [i] (meander, of a river or road)
    wink: мига́ть [i] (signal with the eyes), мигну́ть [p], морга́ть [i] (blink), моргну́ть [p], подмигну́ть [p] (wink at someone)
    wipe: вытира́ть [i] (wipe off, wipe dry), вы́тереть [p], протира́ть [i] (wipe off), протере́ть [p], стира́ть [i] (erase)
    wish: жела́ть [i] (wish for luck), пожела́ть [p], загада́ть [p] (make a wish), хоте́ть [i], мечта́ть [i]
    withdraw: снима́ть [i] (money), снять [p], выводи́ть [i] (troops), отступа́ть [i] (pull back), отка́зываться [i] (retract a statement)
    wither: вя́нуть [i], завя́нуть [p], увяда́ть [i] (plants die), засыха́ть [i] (dry out), засо́хнуть [p]
    withstand: выде́рживать [i] (endure), вы́держать [p], противостоя́ть [i] (resist), устоя́ть [p] (resist), сопротивля́ться [i] (resist)
    witness: ви́деть [i] (be there for), уви́деть [p], засвиде́тельствовать [p] (attest), прису́тствовать [i] (be present as a witness), наблюда́ть [i] (observe)
    wobble: шата́ться [i] (stagger), пошатну́ться [p], кача́ться [i], качну́ться [p], болта́ться [i] (be loose)
    word: формули́ровать [i] (phrase), сформули́ровать [p], излага́ть [i] (put into words), изложи́ть [p], составля́ть [i] (draft a text)
    work: рабо́тать [i] (people, machines), поработа́ть [p], функциони́ровать [i] (machines or systems), де́йствовать [i] (take effect), поде́йствовать [p]
    work out: реша́ть [i] (solve), реши́ть [p], тренирова́ться [i] (exercise), разраба́тывать [i] (draw up a plan), получа́ться [i] (turn out well)
    worry: беспоко́иться [i] (fear for, brood), волнова́ться [i], взволнова́ться [p], беспоко́ить [i] (make someone worry), обеспоко́ить [p]
    worsen: ухудша́ться [i] (get worse), уху́дшиться [p], ухудша́ть [i] (make worse), уху́дшить [p], обостря́ть [i] (aggravate)
    worship: поклоня́ться [i] (revere, worship), боготвори́ть [i] (idolize), обожа́ть [i] (adore), моли́ться [i] (pray before), помоли́ться [p]
    wound: ра́нить [b], пора́ниться [p] (get wounded), обижа́ть [i] (hurt feelings), оби́деть [p], задева́ть [i] (hurt feelings)
    wrap: завора́чивать [i] (a gift, package), заверну́ть [p], упако́вывать [i] (gift wrap), упакова́ть [p], обёртывать [i] (wrap around)
    wreck: разруша́ть [i], разру́шить [p], губи́ть [i] (ruin), погуби́ть [p], разбива́ть [i] (a ship)
    wrench: вырыва́ть [i] (wrest away, pull out forcefully), вы́рвать [p], выкру́чивать [i] (twist), вы́крутить [p], вы́вихнуть [p] (twist a joint)
    wrestle: боро́ться [i] (fight, grapple), поборо́ться [p], дра́ться [i] (fight), подра́ться [p], схвати́ться [p] (grapple)
    wring: выжима́ть [i] (squeeze water out), вы́жать [p], отжима́ть [i] (squeeze out), отжа́ть [p], скру́чивать [i] (twist)
    write: писа́ть [i], написа́ть [p], сочиня́ть [i] (compose a text), сочини́ть [p]
    write down: запи́сывать [i] (take down dictation), записа́ть [p], заноси́ть [i] (enter in a notebook), занести́ [p], конспекти́ровать [i] (take notes)
    write off: спи́сывать [i] (debt, loss), списа́ть [p], аннули́ровать [b] (cancel), проща́ть [i] (a debt), прости́ть [p]
    x-ray: просве́чивать [i] (take an X-ray), просвети́ть [p]
    yank: дёргать [i] (jerk), дёрнуть [p], выдёргивать [i] (pluck, pull out), вы́дернуть [p], рвану́ть [p] (jerk)
    yawn: зева́ть [i], зевну́ть [p]
    yearn: тоскова́ть [i] (long for), жа́ждать [i] (crave), томи́ться [i] (long for), мечта́ть [i], стреми́ться [i]
    yell: крича́ть [i], закрича́ть [p], кри́кнуть [p], ора́ть [i] (shout angrily), вопи́ть [i] (roar)
    yelp: визжа́ть [i] (cry out sharply), взви́згнуть [p], скули́ть [i] (of a dog), тя́вкать [i] (bark), тя́вкнуть [p]
    yield: уступа́ть [i] (give way, concede), уступи́ть [p], приноси́ть [i] (profit, produce), принести́ [p], подчиня́ться [i] (submit)
    yoke: запряга́ть [i] (hitch animals), запря́чь [p], впряга́ть [i] (harness), порабоща́ть [i] (subjugate), поработи́ть [p]
    zap: уничтожа́ть [i] (destroy, wipe out), уничто́жить [p], стира́ть [i] (delete, erase), стере́ть [p], переключа́ть [i] (change TV channels)
    zip: застёгивать [i] (a zipper), застегну́ть [p], архиви́ровать [b] (compress files), сжима́ть [i] (compress files), мча́ться [i] (zip along)
    zone: отводи́ть [i] (designate land use), отвести́ [p], выделя́ть [i] (designate an area), вы́делить [p], разграни́чивать [i] (divide into zones)
    zoom: приближа́ть [i] (zoom in on), прибли́зить [p], отдаля́ть [i] (zoom out), отдали́ть [p], проноси́ться [i] (rush past, speed past)
  `;

  // "говори́ть [i]" -> { ru: 'говори́ть', aspect: 'i' }
  function readEntry(entry, english) {
    const match = entry.match(/^([а-яё\u0301]+)\s*\[(i|p|b)\]\s*(?:\((.*)\))?$/);
    if (!match) throw new Error(`verbs.js: cannot read "${entry}" in "${english}"`);
    const [, ru, aspect, note] = match;
    return { ru, aspect, ...(note ? { note } : {}) };
  }

  const VERBS = parseTable(TABLE, readEntry);

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
