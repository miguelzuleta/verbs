/*
 * English -> German verb database (Standard German).
 *
 * One line per English verb: `english: german, german (usage note)`.
 * The first German verb is the default translation. A separable prefix is marked
 * with "|" (auf|stehen); the engine works out the conjugation from that.
 * Reflexive verbs (sich) are not supported, so those are left out.
 */
(function (global) {
  'use strict';

  const { parseTable, plainEntry } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: verlassen, auf|geben (a plan or idea)
    abort: ab|brechen
    absorb: auf|saugen, absorbieren
    abuse: missbrauchen, misshandeln (mistreat)
    accelerate: beschleunigen
    accept: akzeptieren, an|nehmen
    accompany: begleiten
    accomplish: erreichen, schaffen, vollbringen (a feat)
    accumulate: an|häufen, akkumulieren
    accuse: beschuldigen, an|klagen (in court)
    achieve: erreichen, erzielen (a result)
    acknowledge: an|erkennen, zu|geben (admit), bestätigen (confirm receipt)
    acquire: erwerben, an|schaffen (purchase)
    acquit: frei|sprechen
    act: handeln, spielen (perform a role)
    adapt: an|passen, bearbeiten (a text for another medium)
    add: hinzu|fügen, addieren (in math)
    adhere: haften, kleben (stick to), ein|halten (a rule)
    adjust: an|passen, ein|stellen (a setting)
    administer: verwalten, verabreichen (medicine)
    admire: bewundern
    admit: zu|geben (confess), gestehen, auf|nehmen (let in, to a hospital or school)
    adopt: adoptieren (a child), übernehmen (a method or idea)
    adore: verehren, an|beten (worship), lieben (love dearly)
    advance: vor|rücken (move forward), voran|kommen (make progress)
    advertise: werben, bewerben (promote a product), inserieren (place an ad)
    advise: raten, beraten (as an expert)
    advocate: befürworten, plädieren (for)
    affect: beeinflussen, betreffen (concern)
    age: altern, reifen (mature, as wine)
    agitate: auf|regen (upset), schütteln (shake)
    agree: zu|stimmen, vereinbaren (agree on), überein|stimmen
    aim: zielen, richten (point at something)
    alert: alarmieren, warnen
    align: aus|richten, an|gleichen (bring into line)
    allocate: zu|weisen (assign), zu|teilen, verteilen (share out)
    allow: erlauben, lassen, zu|lassen
    alter: ändern, verändern, ab|ändern (modify slightly)
    amaze: erstaunen, verblüffen
    amend: ab|ändern, berichtigen (correct), ergänzen (supplement)
    amuse: unterhalten (entertain), amüsieren, belustigen
    analyze: analysieren, untersuchen
    anger: ärgern, erzürnen
    announce: an|kündigen, bekannt|geben, verkünden
    annoy: ärgern, nerven, belästigen
    answer: antworten, beantworten (a question), erwidern
    anticipate: erwarten, vorher|sehen (foresee), vorweg|nehmen (act in advance)
    appeal: appellieren (to someone), an|sprechen (be attractive), an|fechten (a ruling)
    appear: erscheinen, auf|tauchen (turn up), scheinen (seem)
    applaud: applaudieren, klatschen
    apply: an|wenden, beantragen (apply for), auf|tragen (spread on a surface)
    appoint: ernennen, berufen (to a post)
    appreciate: schätzen, würdigen, danken (be grateful for)
    approach: heran|kommen (come near), an|sprechen (a person), an|gehen (a problem)
    approve: genehmigen, billigen
    argue: streiten (quarrel), argumentieren (reason), diskutieren (debate)
    arise: entstehen, auf|treten (occur)
    arrange: ordnen (put in order), organisieren (plan an event), vereinbaren (a meeting)
    arrest: verhaften, fest|nehmen
    arrive: an|kommen, ein|treffen
    articulate: artikulieren, formulieren, aus|sprechen (pronounce)
    ascend: auf|steigen, besteigen (a mountain), empor|steigen
    ask: fragen (a question), bitten (request something)
    ask for: bitten, verlangen (demand), an|fordern (request formally)
    aspire: streben, an|streben
    assemble: montieren, zusammen|bauen, versammeln (gather people)
    assert: behaupten, beteuern (insist)
    assess: bewerten, beurteilen, ein|schätzen
    assign: zu|weisen, zu|ordnen (to a category), übertragen (a task)
    assimilate: assimilieren, integrieren, auf|nehmen (take in)
    assist: helfen, unterstützen, assistieren
    associate: assoziieren, verbinden (link in the mind)
    assume: an|nehmen, voraus|setzen (presuppose), übernehmen (take on a responsibility)
    assure: versichern, zu|sichern (promise)
    astonish: erstaunen, verblüffen
    attach: befestigen (fasten), bei|fügen (enclose with a document), an|hängen (a file)
    attack: an|greifen, überfallen (assault someone), attackieren
    attain: erreichen, erlangen
    attempt: versuchen, probieren
    attend: teil|nehmen (an event), besuchen (a class), betreuen (take care of)
    attract: an|ziehen, an|locken
    attribute: zu|schreiben, zurück|führen (trace back to)
    audit: prüfen, überprüfen
    authorize: autorisieren, genehmigen, berechtigen
    avoid: vermeiden, meiden, aus|weichen (sidestep)
    award: verleihen, vergeben (a prize), zu|sprechen (a claim)
    back up: sichern (data), unterstützen (support)
    bake: backen
    balance: balancieren, aus|gleichen (even out)
    ban: verbieten, untersagen
    bandage: verbinden (a wound), bandagieren
    bang: knallen, hämmern (on a door), schlagen (hit hard)
    baptize: taufen
    bargain: feilschen, handeln (haggle)
    bark: bellen
    base: basieren (be based on), beruhen (rest on), gründen (found on)
    bathe: baden
    battle: kämpfen, ringen (struggle)
    be: sein
    bear: ertragen (endure), aus|halten (put up with), tragen (carry)
    beat: schlagen, besiegen (defeat), verprügeln (thrash)
    beautify: verschönern
    beg: betteln (for money), an|flehen (implore), bitten (plead)
    begin: beginnen, an|fangen, starten
    belch: rülpsen
    believe: glauben, vertrauen (trust)
    belong: gehören, an|gehören (a group)
    bend: biegen, beugen (a limb), krümmen (curve)
    bet: wetten, setzen (stake money)
    bid: bieten (offer a price)
    bill: berechnen, ab|rechnen (invoice for a service)
    bind: binden, fesseln, verpflichten (oblige by contract)
    bite: beißen
    blackmail: erpressen
    blame: beschuldigen, vor|werfen (reproach), an|lasten
    bleach: bleichen
    bleed: bluten
    blend: mischen, vermischen, mixen
    bless: segnen
    blink: blinzeln, blinken (flash, as a light)
    block: blockieren, sperren (a road), verstopfen (a pipe)
    bloom: blühen, auf|blühen, erblühen
    blossom: blühen, auf|blühen (flourish), gedeihen (thrive)
    blow: blasen, wehen (of wind), pusten
    blur: verwischen, verschwimmen (become indistinct)
    board: ein|steigen, besteigen (a ship or plane)
    boast: prahlen, an|geben, protzen
    boil: kochen, auf|kochen (bring to the boil)
    bond: verbinden, binden (emotionally), verkleben (glue together)
    book: buchen, reservieren
    boost: steigern, fördern, an|kurbeln (an economy)
    bore: langweilen, bohren (drill a hole)
    bother: stören, belästigen
    bounce: hüpfen, ab|prallen (rebound), springen (as a ball)
    bow: neigen (the head), beugen
    boycott: boykottieren
    brag: prahlen, an|geben, auf|schneiden (boast, informal)
    brake: bremsen
    break: brechen, zerbrechen (into pieces), kaputt|machen (damage)
    breathe: atmen
    brew: brauen, auf|brühen (tea or coffee)
    bribe: bestechen
    bring: bringen, mit|bringen (bring along)
    bring up: groß|ziehen (children), erziehen (children), erwähnen (a topic)
    broadcast: senden, aus|strahlen, übertragen (live)
    broaden: erweitern, aus|weiten, verbreitern (a road)
    browse: surfen (the web), stöbern (through goods), durch|blättern (a book)
    bruise: quetschen, prellen (a body part)
    brush: bürsten, putzen (teeth), streifen (touch lightly)
    bubble: sprudeln, brodeln, blubbern
    buckle: schnallen, an|schnallen (a seat belt), ein|knicken (give way)
    build: bauen, errichten, auf|bauen (develop gradually)
    bully: schikanieren, mobben, ein|schüchtern (intimidate)
    burden: belasten, auf|bürden (impose on)
    burn: verbrennen (destroy by fire), brennen (be on fire)
    burst: platzen, zerplatzen, auf|platzen (burst open)
    bury: begraben, vergraben (hide in the ground), beerdigen (at a funeral)
    buy: kaufen, ein|kaufen (go shopping), erwerben (formal)
    buzz: summen, brummen, surren
    cage: ein|sperren (lock in), ein|pferchen (pen in)
    calculate: berechnen, aus|rechnen, kalkulieren (estimate costs)
    call: rufen, an|rufen (phone), nennen (name)
    calm: beruhigen, besänftigen
    camp: zelten, campen
    can: können (be able to), dürfen (be allowed to)
    cancel: ab|sagen (an event), stornieren (an order), kündigen (a contract)
    capture: fangen, erobern (a place), fest|halten (record, as in a photo)
    care: sorgen (look after), pflegen (nurse)
    caress: streicheln, liebkosen
    carry: tragen, schleppen (a heavy load), transportieren
    carry out: durch|führen, aus|führen, erledigen (a task)
    carve: schnitzen (wood), meißeln (stone), tranchieren (meat)
    cash: ein|lösen (a cheque), kassieren
    cast: werfen, besetzen (actors in a play), gießen (metal)
    catch: fangen, erwischen, auf|fangen (a falling object)
    categorize: kategorisieren, klassifizieren, ein|ordnen (sort)
    cause: verursachen, aus|lösen (trigger), hervor|rufen (bring about)
    cease: auf|hören, ein|stellen (stop an activity), enden (come to an end)
    celebrate: feiern, zelebrieren (a ritual)
    chain: an|ketten, fesseln
    challenge: heraus|fordern, an|fechten (dispute), an|zweifeln (doubt)
    change: ändern, wechseln (swap one thing for another), verwandeln (transform)
    chant: skandieren, singen
    charge: berechnen (a fee), auf|laden (a battery), an|klagen (in law)
    charm: bezaubern, verzaubern (cast a spell), entzücken (delight)
    chase: verfolgen, jagen, hinterher|laufen (run after)
    chat: plaudern, quatschen (informal), chatten (online)
    chatter: plappern, schnattern, quasseln
    cheat: betrügen, mogeln (at games), schummeln (in exams)
    check: prüfen, kontrollieren, nach|sehen (look and see)
    cheer: jubeln, an|feuern (encourage), auf|muntern (comfort)
    cherish: schätzen, hegen (a hope or feeling), hüten (guard as precious)
    chew: kauen
    chill: kühlen, ab|kühlen, chillen (relax, informal)
    choke: ersticken, würgen, erdrosseln (strangle)
    choose: wählen, aus|wählen, aus|suchen
    chop: hacken, klein|schneiden (food), spalten (wood)
    circle: umkreisen, kreisen, ein|kreisen (mark with a circle)
    circulate: zirkulieren, kreisen (flow round), verbreiten (spread around)
    cite: zitieren, an|führen (give as evidence)
    claim: behaupten, beanspruchen (a right), fordern (demand)
    clap: klatschen, applaudieren
    clarify: klären, klar|stellen, erläutern
    clash: aufeinander|prallen, zusammen|stoßen, kollidieren (conflict)
    clasp: fest|halten (hold tightly), umfassen (close the hand around), falten (hands)
    classify: klassifizieren, ein|teilen (into groups), ein|stufen (rate)
    clean: putzen, reinigen, säubern
    clean up: auf|räumen (tidy), sauber|machen (make clean), bereinigen (clear up)
    cleanse: reinigen, läutern (purify)
    clear: räumen (a room or space), frei|machen (free up), klären (make clear)
    clench: ballen (a fist), zusammen|beißen (teeth), zusammen|pressen (lips or teeth)
    click: klicken, an|klicken (click on something)
    climb: klettern, steigen, besteigen (a mountain)
    clip: stutzen (trim), beschneiden (cut back), klammern (fasten with a clip)
    clog: verstopfen, versperren (obstruct a passage)
    clone: klonen
    close: schließen, zu|machen, verschließen
    clutch: packen (grab), fest|halten (hold on to), ergreifen (seize)
    coach: trainieren, coachen, an|leiten
    coax: überreden, locken, zu|reden
    code: programmieren, kodieren
    coincide: zusammen|fallen (at the same time), überein|stimmen (match)
    collaborate: zusammen|arbeiten, kooperieren, mit|arbeiten
    collapse: zusammen|brechen, ein|stürzen (a structure), kollabieren (medical)
    collect: sammeln, ab|holen (pick up), ein|sammeln (gather in)
    collide: kollidieren, zusammen|stoßen, zusammen|prallen
    color: färben (dye or tint), aus|malen (colour in a picture), kolorieren
    comb: kämmen
    combat: bekämpfen, an|kämpfen (against)
    combine: kombinieren, verbinden, verknüpfen (link)
    come: kommen
    come back: zurück|kommen, zurück|kehren, wieder|kommen (come again)
    come in: herein|kommen, ein|treten (step in), hinein|gehen
    comfort: trösten, beruhigen
    command: befehlen, an|ordnen (order), kommandieren (lead)
    commemorate: gedenken, begehen (an anniversary), ehren
    comment: kommentieren, bemerken (remark)
    commit: begehen (a crime or mistake), verüben (a crime), verpflichten (oblige)
    communicate: kommunizieren, mit|teilen (convey), verständigen (inform)
    compare: vergleichen
    compensate: aus|gleichen, kompensieren, entschädigen (pay for a loss)
    compete: konkurrieren, wetteifern, an|treten (enter a contest)
    compile: zusammen|stellen, kompilieren (source code), erstellen (a list)
    complete: vervollständigen, ab|schließen (finish), aus|füllen (a form)
    complicate: erschweren, verkomplizieren
    compliment: loben, schmeicheln (flatter)
    comply: befolgen, ein|halten, nach|kommen (a request)
    compose: komponieren (music), verfassen (a text), zusammen|setzen (make up)
    comprise: umfassen, enthalten, beinhalten
    compute: berechnen, errechnen, rechnen
    conceal: verbergen, verstecken, verheimlichen (a fact)
    concede: zu|gestehen (grant), ein|räumen (admit), zu|geben (admit a point)
    conceive: empfangen (a child), ersinnen (devise an idea), entwerfen (design a plan)
    conclude: beenden, ab|schließen (a deal), folgern (infer)
    condemn: verurteilen, verdammen
    conduct: leiten, durch|führen (a study), dirigieren (an orchestra)
    confess: gestehen, beichten (to a priest), bekennen
    configure: konfigurieren, ein|richten, ein|stellen
    confirm: bestätigen, bekräftigen (reaffirm)
    confront: konfrontieren, entgegen|treten (stand up to)
    confuse: verwirren, verwechseln (mistake one for another), durcheinander|bringen
    congratulate: gratulieren, beglückwünschen
    connect: verbinden, an|schließen (to a device), vernetzen
    conquer: erobern, bezwingen (overcome)
    consent: ein|willigen, zu|stimmen
    conserve: bewahren, erhalten, konservieren (food)
    consider: überlegen (think over), berücksichtigen (take into account), betrachten (regard)
    consist: bestehen (consist of)
    console: trösten, auf|richten (lift the spirits)
    consolidate: festigen, konsolidieren, zusammen|legen (merge)
    conspire: konspirieren, intrigieren (plot against)
    constitute: bilden, aus|machen (make up), dar|stellen (amount to)
    construct: errichten, konstruieren, bauen
    consult: konsultieren, befragen, nach|schlagen (look up)
    consume: verbrauchen, konsumieren, verzehren (food, formal)
    contact: kontaktieren, an|schreiben (write to someone), erreichen (get hold of)
    contain: enthalten, beinhalten, ein|dämmen (keep in check)
    contemplate: betrachten, erwägen, nach|denken (reflect on)
    contend: kämpfen, ringen (struggle), behaupten (assert)
    continue: fort|setzen (carry on with), weiter|machen (keep going), fort|fahren (go on)
    contradict: widersprechen, bestreiten (deny)
    contrast: gegenüber|stellen (set side by side), kontrastieren
    contribute: bei|tragen, spenden (donate), bei|steuern
    control: kontrollieren, steuern (a machine), beherrschen (dominate)
    converge: zusammen|laufen, konvergieren (math), zusammen|treffen (meet at one point)
    convert: um|wandeln, um|rechnen (units), konvertieren (files, faith)
    convey: übermitteln (pass on a message), vermitteln (get an idea across), aus|drücken (express)
    convince: überzeugen
    cook: kochen, zu|bereiten (prepare food)
    cool: ab|kühlen, kühlen, erkalten (become cold)
    cooperate: kooperieren, zusammen|arbeiten, mit|wirken
    coordinate: koordinieren, ab|stimmen (align with others)
    cope: bewältigen, meistern, zurecht|kommen (manage)
    copy: kopieren, ab|schreiben (by hand), nach|ahmen (imitate)
    correct: korrigieren, berichtigen, verbessern
    correspond: entsprechen, überein|stimmen, korrespondieren (exchange letters)
    corrupt: korrumpieren, verderben (morally), bestechen (bribe)
    cost: kosten
    cough: husten
    counsel: beraten, raten
    count: zählen, zusammen|zählen (add up), rechnen (count on)
    counterfeit: fälschen, nach|machen (imitate illegally)
    court: umwerben, hofieren (flatter)
    cover: bedecken, zu|decken (with a blanket), decken (costs)
    crack: knacken (a nut or code), springen (of glass), reißen (of skin or walls)
    crash: zusammen|stoßen (collide), ab|stürzen (a plane or computer), krachen (smash into)
    crave: ersehnen (long for), verlangen (nach), lechzen (nach)
    crawl: kriechen, krabbeln (like a baby), robben (move on the belly)
    create: erschaffen, kreieren, erstellen (a file or document)
    credit: gut|schreiben (an amount), zu|schreiben (give credit for), an|rechnen (count towards)
    criticize: kritisieren, bemängeln, tadeln
    cross: überqueren (a street), durchqueren (a region), kreuzen
    crush: zerquetschen, zermalmen (grind to pieces), zerdrücken
    cry: weinen (weep), schreien (shout), heulen (informal)
    cultivate: an|bauen (crops), kultivieren, pflegen (a friendship or skill)
    cure: heilen, kurieren, pökeln (preserve meat)
    curl: kräuseln, locken (hair)
    curse: fluchen, verfluchen (put a curse on)
    cushion: dämpfen, ab|federn (absorb a shock), polstern (pad)
    customize: personalisieren, an|passen
    cut: schneiden, durch|schneiden (cut in two), kürzen (reduce)
    cut off: ab|schneiden, ab|trennen (detach), ab|sperren (a supply or road)
    damage: beschädigen, schädigen (harm), schaden (be harmful)
    dance: tanzen
    dare: wagen, heraus|fordern (to do something)
    darken: verdunkeln, ab|dunkeln
    darn: stopfen (mend socks), flicken (patch)
    dash: rennen, flitzen (informal), eilen (hurry)
    dazzle: blenden, faszinieren
    deal: behandeln (deal with a matter), um|gehen (cope with), handeln (trade in goods)
    debate: debattieren, diskutieren, erörtern (discuss in detail)
    debug: debuggen
    decay: verfallen (deteriorate), verfaulen (rot), zerfallen (break down)
    deceive: täuschen, betrügen, hintergehen
    decide: entscheiden, beschließen (resolve to do)
    decipher: entziffern, entschlüsseln
    declare: erklären, aus|rufen (proclaim), deklarieren (goods, formal)
    decline: ab|lehnen (refuse), ab|sagen (an invitation), zurück|gehen (decrease)
    decorate: dekorieren, schmücken, verzieren
    decrease: ab|nehmen (get less), verringern (make less), sinken (fall)
    decrypt: entschlüsseln, dechiffrieren
    dedicate: widmen, weihen (consecrate)
    deduct: ab|ziehen (subtract), ab|setzen (for tax), ab|rechnen
    deem: erachten (formal), halten (as in halten für), an|sehen (as in ansehen als)
    defeat: besiegen, schlagen, bezwingen
    defend: verteidigen, schützen (protect)
    defer: auf|schieben (postpone), verschieben, vertagen (a meeting)
    define: definieren, fest|legen (set), bestimmen
    deflect: ab|lenken, ab|wehren (ward off)
    degrade: erniedrigen (humiliate), degradieren (demote), verschlechtern (make worse)
    delay: verzögern, verschieben (postpone), auf|halten (hold up)
    delegate: delegieren, übertragen, ab|ordnen (send as a representative)
    delete: löschen, streichen (cross out), entfernen
    deliberate: überlegen, beratschlagen (confer), erwägen
    delight: erfreuen, entzücken, begeistern
    deliver: liefern (goods), zu|stellen (post, parcels), überbringen (a message)
    demand: fordern, verlangen
    demolish: ab|reißen, nieder|reißen, zerstören
    demonstrate: zeigen, beweisen (prove), demonstrieren (in protest)
    denote: bezeichnen, kennzeichnen, bedeuten
    denounce: an|zeigen (report to the police), an|prangern (condemn publicly), denunzieren (inform against)
    deny: leugnen, bestreiten (dispute), verweigern (refuse to give)
    depend: ab|hängen (on something), an|kommen (as in it depends on), vertrauen (rely on)
    deploy: ein|setzen (use, troops), bereit|stellen (make available, e.g., software), stationieren (position)
    deport: ab|schieben, aus|weisen (expel from a country), deportieren (to a camp)
    deposit: ein|zahlen (money), hinterlegen (leave for safekeeping), ab|lagern (sediment)
    deprive: berauben (of a thing), entziehen (take away)
    derive: ab|leiten, her|leiten, gewinnen (obtain from)
    descend: ab|steigen (climb down), hinunter|gehen (go down), sinken (drop)
    describe: beschreiben, schildern
    deserve: verdienen
    design: entwerfen, gestalten, konstruieren (engineer)
    designate: bestimmen, ernennen (appoint), benennen (name)
    desire: wünschen, begehren, ersehnen
    despise: verachten, gering|schätzen
    destroy: zerstören, vernichten (annihilate), ruinieren
    detect: entdecken, fest|stellen (ascertain), nach|weisen (prove presence)
    deteriorate: verfallen, verkommen, nach|lassen (decline)
    determine: bestimmen, ermitteln (find out), fest|legen (decide)
    detest: verabscheuen, hassen
    devastate: verwüsten, verheeren, nieder|schmettern (emotionally)
    develop: entwickeln, aus|bauen (expand), erschließen (open up land)
    deviate: ab|weichen, ab|kommen (stray), ab|schweifen (digress)
    devour: verschlingen, auf|fressen (of animals), vertilgen (eat up, informal)
    diagnose: diagnostizieren, fest|stellen (a condition)
    dial: wählen (a phone number)
    dictate: diktieren, vor|schreiben (prescribe), bestimmen
    die: sterben, um|kommen (perish), verenden (of animals)
    differ: ab|weichen, differieren, auseinander|gehen (of opinions)
    dig: graben, buddeln (informal), aus|graben (unearth)
    digest: verdauen, verarbeiten (information)
    dilute: verdünnen, verwässern
    dim: dimmen, dämpfen, ab|blenden (headlights)
    diminish: verringern, vermindern, schwinden (dwindle)
    dine: speisen, dinieren (formal)
    direct: leiten, lenken (steer), richten (aim)
    disable: deaktivieren, aus|schalten, lahm|legen (cripple a system)
    disagree: widersprechen (contradict someone), auseinander|gehen (of opinions)
    disappear: verschwinden, entschwinden (literary), verloren|gehen (be lost)
    disappoint: enttäuschen
    disarm: entwaffnen, ab|rüsten (reduce weapons), entschärfen (a bomb)
    discard: weg|werfen, aus|sortieren, verwerfen (reject an idea)
    discharge: entlassen, entladen (a battery or cargo), ab|feuern (a weapon)
    disclose: offen|legen (make public), enthüllen (reveal), preis|geben (give away a secret)
    disconnect: trennen, ab|klemmen (a wire), ab|schalten (cut off power)
    discourage: entmutigen, ab|raten (advise against), demotivieren
    discover: entdecken, heraus|finden (find out), erfahren (learn)
    discredit: diskreditieren, schlecht|machen (run down), verunglimpfen (slander)
    discuss: besprechen, diskutieren, erörtern
    disguise: verkleiden, tarnen, verschleiern (hide the truth)
    disgust: an|widern, an|ekeln, ab|stoßen (repel)
    disinfect: desinfizieren
    dismantle: demontieren, zerlegen (take apart), ab|bauen (take down)
    dismiss: entlassen (fire an employee), ab|tun (brush aside), ab|weisen (reject a claim)
    dispatch: versenden, ab|fertigen (process for shipping), erledigen (finish off quickly)
    dispense: aus|geben (hand out), dosieren (measure out), verzichten (dispense with)
    disperse: zerstreuen, auf|lösen (a crowd), verstreuen (scatter)
    displace: verdrängen, vertreiben (from home), verschieben (shift)
    display: zeigen, aus|stellen (exhibit), an|zeigen (on a screen)
    disprove: widerlegen, entkräften
    dispute: streiten (quarrel), bestreiten (deny), an|fechten (contest)
    distinguish: unterscheiden, auseinander|halten (tell apart), erkennen (make out)
    distort: verzerren, verdrehen, verfälschen
    distract: ab|lenken, zerstreuen (divert the mind)
    distribute: verteilen, aus|teilen (hand out), vertreiben (sell goods)
    disturb: stören, beunruhigen (worry), verstören (upset deeply)
    dive: tauchen, hechten (dive headfirst)
    diversify: diversifizieren, streuen (risk, investments)
    divide: teilen, dividieren (in math), auf|teilen
    divorce: scheiden (dissolve a marriage), trennen (separate)
    do: machen, tun
    document: dokumentieren, protokollieren (minutes), belegen (support with evidence)
    dodge: aus|weichen, entgehen (escape)
    dominate: beherrschen, dominieren, überragen (tower over)
    donate: spenden, stiften (endow), schenken
    double: verdoppeln
    doubt: bezweifeln, zweifeln, an|zweifeln
    download: herunter|laden
    draft: entwerfen, verfassen, auf|setzen (a document)
    drag: schleppen, ziehen, zerren (pull roughly)
    drain: entwässern, ab|lassen (let liquid out), leeren (empty)
    draw: zeichnen, ziehen (pull; a card or weapon), skizzieren (sketch)
    dread: fürchten, scheuen (shrink from)
    dream: träumen
    dress: an|ziehen (put clothes on), kleiden (clothe someone), verbinden (a wound)
    dribble: dribbeln (a ball), sabbern (drool), tröpfeln (trickle)
    drift: treiben (float along), ab|driften (off course)
    drill: bohren, drillen (train hard), ein|üben (practice)
    drink: trinken, saufen (of animals, or heavily)
    drip: tropfen, tröpfeln
    drive: fahren, steuern (steer or pilot), an|treiben (propel)
    drizzle: nieseln, beträufeln (food with a liquid)
    drop: fallen, los|lassen (let go of), ab|setzen (drop off a passenger)
    drown: ertrinken (die in water), ertränken (kill by drowning), übertönen (drown out a sound)
    dry: trocknen, ab|trocknen (wipe dry), aus|trocknen (dry out)
    dump: weg|werfen (throw away), kippen (tip out), entsorgen (dispose of waste)
    duplicate: duplizieren, kopieren, vervielfältigen
    dwell: wohnen, bewohnen (inhabit), verweilen (linger)
    dye: färben, ein|färben, tönen (tint)
    earn: verdienen, erwerben (respect or a right)
    ease: lindern, erleichtern, mildern
    eat: essen, fressen (of animals), verzehren (formal)
    echo: hallen, nach|hallen (linger as an echo), nach|sprechen (repeat someone's words)
    edit: bearbeiten, redigieren, schneiden (a film or video)
    educate: erziehen, bilden, unterrichten (teach)
    elaborate: aus|arbeiten, aus|führen (expand on), erläutern
    elapse: vergehen, verstreichen, ab|laufen (run out)
    elect: wählen, küren (formal)
    elevate: heben, erhöhen, erheben (to a higher status)
    eliminate: beseitigen, eliminieren, aus|schließen (rule out)
    elude: entgehen (escape notice), entkommen (get away), aus|weichen (evade)
    email: mailen, schicken (send by email)
    embark: ein|steigen (board), ein|schiffen (load or go on board), unternehmen (embark on an endeavour)
    embed: ein|betten, ein|bauen, verankern
    embrace: umarmen, an|nehmen (adopt an idea), begrüßen (welcome)
    embroider: sticken, besticken, aus|schmücken (embellish)
    emerge: auf|tauchen, entstehen, hervor|kommen
    emit: aus|stoßen (gases), aus|senden (a signal), aus|strahlen (light or heat)
    emphasize: betonen, hervor|heben
    employ: beschäftigen (give work to), verwenden (use)
    empower: befähigen, ermächtigen (authorize)
    empty: leeren, entleeren
    enable: ermöglichen, aktivieren (turn on a feature)
    enact: erlassen, verabschieden
    enchant: verzaubern, bezaubern
    encircle: umringen, umgeben
    encounter: begegnen, treffen
    encourage: ermutigen, ermuntern, fördern (promote)
    encrypt: verschlüsseln, chiffrieren
    end: enden (come to an end), beenden (bring to an end)
    endorse: befürworten, unterstützen
    endure: ertragen, aus|halten, erdulden
    energize: beleben, stärken
    enforce: durch|setzen, vollstrecken
    engage: ein|beziehen (involve), engagieren (hire)
    engrave: gravieren, ein|ritzen
    enhance: verbessern, steigern
    enjoy: genießen
    enlarge: vergrößern, erweitern
    enlist: rekrutieren, an|werben
    enrage: erzürnen, empören
    enrich: bereichern, an|reichern
    enroll: ein|schreiben, an|melden
    ensure: sicher|stellen, gewährleisten
    entail: erfordern, bedingen, beinhalten
    entangle: verstricken, verwickeln
    enter: betreten (a place), ein|treten (go in), ein|geben (data)
    entertain: unterhalten, amüsieren, bewirten (host guests)
    entrust: an|vertrauen, betrauen (with a task)
    envision: visualisieren, voraus|sehen
    envy: beneiden, missgönnen
    equip: aus|rüsten, aus|statten
    erase: löschen, radieren
    err: irren
    escalate: eskalieren, verschärfen
    escape: entkommen, fliehen, entweichen (gas, liquids)
    establish: gründen, etablieren, fest|stellen (determine a fact)
    estimate: schätzen, ab|schätzen
    evacuate: evakuieren, räumen
    evade: aus|weichen (dodge), entgehen (elude), hinterziehen (taxes)
    evaluate: bewerten, beurteilen, aus|werten (analyze data)
    evaporate: verdampfen, verdunsten
    evoke: hervor|rufen, wach|rufen (memories)
    evolve: entwickeln (develop), reifen (mature)
    exaggerate: übertreiben, auf|bauschen
    exalt: preisen, verherrlichen
    examine: untersuchen, prüfen
    excavate: aus|graben, aus|heben
    exceed: überschreiten (a limit), übertreffen (surpass), übersteigen
    excel: hervor|ragen, glänzen, brillieren
    exchange: aus|tauschen, tauschen, wechseln (money)
    excite: begeistern, auf|regen
    exclude: aus|schließen, aus|grenzen (socially)
    excuse: entschuldigen, verzeihen
    execute: aus|führen (carry out, run a program), hin|richten (put to death)
    exempt: befreien, aus|nehmen
    exercise: trainieren, üben, aus|üben (use a right or power)
    exert: aus|üben (influence, pressure), auf|wenden (effort)
    exhale: aus|atmen
    exhaust: erschöpfen, auf|brauchen (use up)
    exhibit: aus|stellen, zeigen
    exile: verbannen, vertreiben
    exist: existieren, bestehen
    expand: erweitern, expandieren, aus|dehnen
    expect: erwarten, vermuten (suppose)
    expedite: beschleunigen, voran|treiben
    expel: aus|weisen (from a country), vertreiben (drive out), verweisen (from school)
    experience: erleben, erfahren, empfinden (feel a sensation)
    experiment: experimentieren, aus|probieren (try out)
    expire: ab|laufen, verfallen, aus|laufen (contracts)
    explain: erklären, erläutern
    explode: explodieren, platzen (burst), sprengen (blow up)
    exploit: aus|nutzen (take advantage of), aus|beuten (exploit people, resources)
    explore: erkunden (a place), erforschen (research)
    export: exportieren, aus|führen (goods abroad)
    expose: aus|setzen (to danger), enthüllen (reveal), auf|decken (uncover)
    express: aus|drücken, äußern
    extend: verlängern, aus|dehnen, aus|strecken (hold out)
    extinguish: löschen, aus|löschen
    extol: preisen, rühmen
    extract: extrahieren, heraus|ziehen, gewinnen (derive from raw material)
    fabricate: her|stellen (manufacture), erfinden (make up)
    face: konfrontieren, gegenüber|stehen
    facilitate: erleichtern, ermöglichen, moderieren (a meeting)
    fade: verblassen, verklingen (sounds), schwinden (dwindle)
    fail: scheitern, versagen, durch|fallen (a test)
    fake: fälschen, vor|täuschen
    fall: fallen, stürzen
    fall down: hin|fallen (tumble to the ground), um|fallen (topple over), herunter|fallen (drop down from)
    fan: fächeln, an|fachen (flames)
    fascinate: faszinieren, fesseln (captivate)
    fasten: befestigen (attach), zu|knöpfen (button up), an|schnallen (buckle)
    fatigue: ermüden, erschöpfen
    favor: begünstigen, bevorzugen, favorisieren
    fear: fürchten, befürchten
    feed: füttern (animals, babies), ernähren (support with food)
    feel: fühlen, spüren, empfinden
    fence: fechten, umzäunen
    ferment: fermentieren, vergären
    fetch: holen, ab|holen
    fight: kämpfen, streiten (quarrel), bekämpfen (combat)
    figure out: heraus|finden, begreifen, lösen (solve)
    file: ab|legen (put in a file), archivieren, ein|reichen (submit)
    fill: füllen, auf|füllen (refill)
    fill in: aus|füllen (a form), ein|tragen (write in), vertreten (substitute)
    film: filmen, drehen (a movie), verfilmen (adapt for film)
    filter: filtern, heraus|filtern
    finance: finanzieren
    find: finden, entdecken, an|treffen (come upon)
    find out: heraus|finden, erfahren, ermitteln
    fine: bestrafen (punish with a fine), ahnden (penalize an offense)
    finish: beenden, ab|schließen (complete), fertig|stellen
    fire: entlassen (from a job), schießen (a weapon), feuern
    fish: fischen, angeln
    fit: passen, hinein|passen (fit inside), an|passen (adjust)
    fix: reparieren, beheben (a fault)
    flap: flattern, schlagen (wings)
    flare: auf|flammen, auf|lodern
    flash: auf|blitzen, auf|leuchten
    flatter: schmeicheln, umschmeicheln
    flavor: würzen, aromatisieren
    flee: fliehen, flüchten
    fling: schleudern, schmeißen
    flip: wenden (turn over), um|drehen (turn around), um|legen (a switch)
    flirt: flirten, kokettieren
    float: treiben (drift on water), schweben (in the air), schwimmen (stay on the surface)
    flood: überschwemmen, überfluten
    flourish: blühen, gedeihen, florieren
    flow: fließen, strömen
    flutter: flattern, wehen (flags in the wind)
    fly: fliegen
    focus: fokussieren, scharf|stellen (a camera), konzentrieren
    fold: falten, zusammen|legen (clothes), knicken (crease)
    follow: folgen, verfolgen (pursue), befolgen (obey)
    fool: täuschen, an|führen (trick), foppen
    forbid: verbieten, untersagen
    force: zwingen (compel), erzwingen (obtain by force), auf|stemmen (force open)
    forecast: vorher|sagen, prognostizieren
    foresee: voraus|sehen, vorher|sehen
    forge: schmieden, fälschen (counterfeit)
    forget: vergessen
    forgive: vergeben, verzeihen
    form: bilden, formen
    format: formatieren
    formulate: formulieren, aus|arbeiten (work out)
    found: gründen, stiften (endow)
    fracture: brechen, zerbrechen
    frame: ein|rahmen, umrahmen
    free: befreien, frei|lassen
    freeze: gefrieren (turn to ice), ein|frieren (food, assets), frieren (feel very cold)
    frighten: ängstigen, erschrecken (startle), verängstigen
    frown: runzeln (the forehead), missbilligen (disapprove)
    frustrate: frustrieren, vereiteln (thwart a plan)
    fry: braten, frittieren (deep-fry)
    fuel: betanken, an|treiben (power), an|heizen (stoke a conflict)
    fulfill: erfüllen, ein|halten (a promise), verwirklichen (realize)
    function: funktionieren, fungieren (act as)
    furnish: möblieren, ein|richten, bereit|stellen (provide)
    fuse: verschmelzen, fusionieren (companies), verschweißen (weld)
    gain: gewinnen, erlangen, zu|nehmen (increase, gain weight)
    gallop: galoppieren
    gamble: wetten (bet), zocken (gamble at cards, casino), riskieren (risk)
    gather: sammeln (collect), versammeln (bring together), zusammen|kommen (come together, meet)
    generate: erzeugen, generieren, erstellen (a document, report)
    gesture: gestikulieren, winken (signal by hand)
    get: bekommen, besorgen (obtain, fetch), erhalten (receive)
    give: geben, schenken (as a gift)
    give up: auf|geben, verzichten (renounce), kapitulieren (surrender)
    glorify: verherrlichen, glorifizieren
    glow: glühen, leuchten, strahlen
    glue: kleben, leimen
    go: gehen, fahren (by vehicle)
    go back: zurück|gehen, zurück|kehren, zurück|fahren (by vehicle)
    go on: weiter|machen, fort|fahren, weiter|gehen
    go out: aus|gehen (socially; a light goes out), hinaus|gehen (go outside)
    gossip: tratschen, klatschen, lästern (talk ill of others)
    govern: regieren, verwalten (administer)
    grab: greifen, packen, ergreifen (seize)
    grade: benoten, bewerten, ein|stufen (classify)
    graduate: ab|schließen (finish school, a degree), absolvieren (complete a course)
    graft: pfropfen (plants), transplantieren (tissue)
    grant: gewähren, bewilligen, verleihen (award)
    grasp: ergreifen (take hold of), begreifen (understand), erfassen (comprehend)
    grate: reiben (cheese), raspeln
    graze: weiden, grasen, streifen (touch lightly)
    greet: grüßen, begrüßen (welcome)
    grieve: trauern, betrauern, betrüben (cause sorrow to)
    grill: grillen, braten
    grind: mahlen, schleifen (sharpen)
    grip: fest|halten, umklammern, packen
    groan: stöhnen, ächzen
    grow: wachsen, an|bauen (crops), züchten (breed, raise plants)
    grow up: auf|wachsen, heran|wachsen, reifen
    growl: knurren (dogs), grollen (thunder)
    grunt: grunzen, brummen
    guarantee: garantieren, gewährleisten, zu|sichern (promise)
    guard: bewachen, beschützen, hüten
    guess: raten, erraten (guess right), vermuten (suppose)
    guide: führen (show the way), leiten (direct), an|leiten (instruct)
    gulp: hinunter|schlucken, schlucken, schlingen (wolf down food)
    gush: sprudeln (bubble up, spout), strömen (flow in a stream), quellen (well up)
    hack: hacken, knacken (crack a code, password)
    hail: hageln, herbei|rufen (call over, hail a taxi)
    halt: an|halten, stoppen, ein|stellen (cease operations)
    hammer: hämmern, klopfen (pound)
    hamper: behindern, erschweren, beeinträchtigen
    hand over: übergeben, aus|händigen, überreichen
    handle: handhaben, bedienen (operate a machine), bewältigen (cope with)
    hang: hängen, auf|hängen, baumeln (dangle)
    hang up: auf|legen (the phone), auf|hängen (coats, pictures)
    happen: passieren, geschehen, statt|finden (take place)
    harass: belästigen, schikanieren, bedrängen
    harden: härten, verhärten, ab|härten (toughen up)
    harm: schaden, schädigen, verletzen (hurt)
    harmonize: harmonisieren, harmonieren (go well together), ab|stimmen (coordinate)
    harvest: ernten, ein|bringen (a crop)
    hate: hassen, verabscheuen
    haul: schleppen, ziehen (pull), transportieren (carry freight)
    have: haben (possess, auxiliary), besitzen (own)
    heal: heilen, verheilen (wounds), kurieren (cure)
    heap: häufen, stapeln, auf|türmen
    hear: hören, vernehmen
    heat: erhitzen, heizen (a room), auf|wärmen (reheat food)
    heighten: erhöhen, steigern, verstärken
    help: helfen, unterstützen, aus|helfen (help out)
    hesitate: zögern, zaudern
    hide: verstecken, verbergen (conceal), verheimlichen (keep secret)
    highlight: hervor|heben, markieren (with a marker), unterstreichen
    hijack: entführen (aircraft, vehicles), kapern (ships)
    hinder: behindern, hindern, verhindern
    hint: an|deuten, an|spielen (allude to)
    hire: ein|stellen, an|stellen, engagieren (performers)
    hit: schlagen, treffen (a target), hauen
    hoard: horten, hamstern, an|häufen
    hold: halten, fest|halten (hold tight), tragen (support weight)
    hold on: warten (wait), fest|halten (grip), durch|halten (hold out)
    honor: ehren, würdigen, ein|lösen (a promise or check)
    hook: ein|haken, ein|hängen, an|schließen (hook up)
    hop: hüpfen, hoppeln (like a rabbit), hopsen
    hope: hoffen, wünschen (wish)
    host: beherbergen (lodge guests), bewirten (entertain guests), aus|richten (host an event)
    hover: schweben, kreisen (circle above)
    howl: heulen, jaulen
    hug: umarmen, drücken, knuddeln
    hum: summen, brummen (drone), trällern
    humiliate: demütigen, erniedrigen, bloß|stellen
    hunt: jagen, suchen (hunt for)
    hurl: schleudern, werfen, schmettern
    hurt: weh|tun (ache), schmerzen (ache), verletzen (wound)
    hypnotize: hypnotisieren
    identify: identifizieren, erkennen (recognize), bestimmen (e.g. a plant)
    idolize: vergöttern, verehren, an|himmeln (worship from afar)
    ignore: ignorieren, missachten, übersehen
    illuminate: beleuchten, erhellen, erleuchten
    illustrate: illustrieren, veranschaulichen (make clear with examples), bebildern (add pictures)
    imagine: fantasieren (dream up), an|nehmen (suppose), träumen (dream)
    imitate: nach|ahmen, imitieren, nach|machen
    immerse: ein|tauchen (dip in), versenken (sink)
    immobilize: immobilisieren, ruhig|stellen (a limb), lahm|legen (bring to a standstill)
    impeach: an|klagen (charge), ab|setzen (remove from office), entheben (relieve of office)
    impede: behindern, hemmen, erschweren
    implement: um|setzen, implementieren, ein|führen (introduce a system)
    implore: an|flehen, beschwören, flehen
    imply: implizieren, an|deuten (suggest), bedeuten
    import: importieren, ein|führen (goods)
    impose: auf|erlegen, verhängen (a ban, penalty), auf|zwingen (force upon)
    impress: beeindrucken, imponieren
    imprison: ein|sperren, inhaftieren, gefangen|halten (hold captive)
    improve: verbessern, optimieren, auf|bessern
    incite: an|stiften, auf|hetzen, an|stacheln
    incline: neigen, beugen (bend forward), tendieren (be inclined)
    include: ein|schließen, umfassen, enthalten
    incorporate: ein|bauen, ein|gliedern, ein|arbeiten (work in)
    increase: erhöhen (make larger), steigen (rise), zu|nehmen (grow)
    incur: erleiden (a loss), ein|gehen (a risk, debt)
    indicate: an|zeigen (display), hin|weisen (point to), an|geben (state)
    induce: veranlassen, herbei|führen (bring about), induzieren (physics, logic)
    infect: infizieren, an|stecken
    infer: folgern, ab|leiten (derive), erschließen (deduce)
    inflate: auf|pumpen, auf|blasen, auf|blähen (bloat, puff up)
    inflict: zu|fügen, bei|bringen
    influence: beeinflussen, prägen, ein|wirken (act on)
    inform: informieren, benachrichtigen, unterrichten
    infringe: verstoßen (against a rule), verletzen (a right), übertreten (a law)
    ingest: ein|nehmen (a medicine), auf|nehmen (take in food or substances), verzehren (consume food)
    inhabit: bewohnen, besiedeln
    inhale: ein|atmen, inhalieren
    inherit: erben, beerben
    inhibit: hemmen, hindern, unterdrücken
    initiate: initiieren, ein|leiten (start a process), ein|weihen (admit to a group or secret)
    inject: injizieren, ein|spritzen
    injure: verletzen, verwunden
    inquire: fragen, nach|fragen (ask about), nach|forschen (investigate)
    insert: ein|fügen (text, data), ein|stecken (plug in), ein|legen (place inside)
    insinuate: insinuieren, an|deuten (hint), unterstellen (impute)
    insist: bestehen (on), beharren (on), drängen (urge)
    inspect: inspizieren, kontrollieren, prüfen
    inspire: inspirieren, beflügeln, an|regen
    install: installieren, ein|bauen (fit in place), montieren (mount, assemble)
    instruct: unterrichten (teach), an|weisen (order), instruieren (brief)
    insult: beleidigen, beschimpfen, kränken
    insure: versichern, ab|sichern
    integrate: integrieren, ein|gliedern, ein|binden
    intend: beabsichtigen, vor|haben (plan to do), bezwecken (aim at)
    intensify: intensivieren, verstärken, steigern
    interact: interagieren, zusammen|wirken (work together)
    interest: interessieren, reizen (appeal to), fesseln (hold attention)
    interfere: stören, beeinträchtigen, hinein|reden (meddle)
    interpret: interpretieren, deuten, dolmetschen (translate orally)
    interrogate: verhören, befragen, vernehmen
    interrupt: unterbrechen, stören (disturb)
    intervene: ein|greifen, ein|schreiten (take action against), intervenieren
    interview: interviewen, befragen
    intimidate: ein|schüchtern, bedrohen (threaten)
    intrigue: faszinieren, fesseln, intrigieren (scheme)
    introduce: vor|stellen (a person), bekannt|machen (a person to someone), ein|führen (bring in something new)
    invade: ein|marschieren (march into a country), ein|dringen (intrude), überfallen (attack)
    invent: erfinden
    invest: investieren, an|legen (money in an investment)
    invite: ein|laden, auf|fordern (request)
    invoice: fakturieren, ab|rechnen (bill), berechnen (charge)
    invoke: an|rufen (call upon), auf|rufen (call a function), beschwören (conjure up)
    involve: ein|beziehen (include), beteiligen (make a participant), betreffen (concern, affect)
    iron: bügeln, plätten
    irritate: ärgern (annoy), reizen (inflame the skin), irritieren
    isolate: isolieren, ab|sondern (set apart), ab|schirmen (shield)
    issue: aus|stellen (a document), heraus|geben (publish), erlassen (a decree)
    itch: jucken, kribbeln (tingle)
    jam: klemmen (get stuck), verstopfen (clog), blockieren (block)
    jeer: aus|buhen (boo), verhöhnen, verspotten (mock)
    jingle: klimpern (coins, keys), klingeln (bells), bimmeln
    jog: joggen, traben (trot)
    join: verbinden (connect), bei|treten (become a member of), vereinigen (unite)
    joke: scherzen, witzeln
    jolt: rütteln (shake roughly), erschüttern (shock), ruckeln (lurch)
    journey: reisen, verreisen (go on a trip)
    judge: urteilen, beurteilen, richten (pass sentence on)
    jump: springen, hüpfen
    justify: rechtfertigen, begründen, legitimieren
    keep: behalten, auf|bewahren (store), halten (maintain)
    keep on: weiter|machen, fort|setzen (continue something), fort|fahren
    kick: treten, kicken (football, informal), aus|schlagen (horse)
    kidnap: entführen, kidnappen, verschleppen (abduct)
    kill: töten, um|bringen
    kindle: an|zünden (light a fire), entfachen (spark), wecken (arouse)
    kiss: küssen, knutschen (colloquial)
    knead: kneten, durch|kneten (knead thoroughly)
    knit: stricken, zusammen|wachsen (bones)
    knock: klopfen (at a door), stoßen (bump, hit), pochen (rap)
    knot: knoten, verknoten, knüpfen (tie)
    know: wissen (facts, how to), kennen (people, places)
    label: beschriften (write labels on), etikettieren, kennzeichnen (mark)
    lack: fehlen (be missing), mangeln (be wanting), entbehren (go without)
    lament: beklagen, betrauern, klagen (wail, complain)
    land: landen, an|legen (ships dock), ergattern (win a job or prize)
    languish: schmachten, verkümmern (waste away), dahin|siechen (waste away)
    lash: peitschen (whip), aus|peitschen (flog), zurren (tie down)
    last: dauern, an|dauern (go on), halten (hold up, endure)
    laugh: lachen, kichern (giggle), auf|lachen (burst out laughing)
    launch: starten (rocket, program), lancieren (a product), ab|schießen (a missile)
    launder: waschen (clothes, dirty money), reinigen (clean)
    lay: legen, hin|legen (put down), verlegen (carpet, cables)
    lead: führen, leiten, an|führen (head a group)
    leak: lecken (a container leaks), aus|laufen (run out), durch|sickern (seep, news leaks)
    lean: lehnen, an|lehnen (prop against), neigen (tilt)
    leap: springen, hechten (leap headlong), schnellen (spring up, dart)
    learn: lernen, erlernen (acquire a skill), erfahren (find out)
    leave: verlassen (depart from, abandon), weg|gehen (go away), zurück|lassen (leave behind)
    legislate: legiferieren, verabschieden (pass a law), erlassen (a law)
    lend: leihen (lend), verleihen (lend out), borgen (lend, colloquial)
    lengthen: verlängern, strecken (stretch), aus|dehnen (extend)
    let: lassen, erlauben, zu|lassen
    let down: enttäuschen (disappoint), herunter|lassen (lower)
    level: ebnen, planieren (grade ground), nivellieren (even out)
    liberate: befreien, erlösen (deliver from suffering)
    lick: lecken, ab|lecken (lick off), schlecken (lick sweets, colloquial)
    lie: lügen, schwindeln (fib), an|lügen (lie to someone)
    lift: heben, hoch|heben, an|heben
    light: an|zünden (set alight), beleuchten (illuminate), entzünden (ignite)
    lighten: erleichtern (reduce a burden), entlasten (relieve), auf|hellen (make lighter in color)
    like: mögen, gefallen (be pleasing to), schätzen (appreciate)
    limit: begrenzen, beschränken, ein|schränken
    linger: verweilen (stay on), an|dauern (persist), nach|wirken (have lingering effects)
    link: verknüpfen, verbinden, verlinken (hyperlink)
    liquidate: liquidieren (wind up a company; eliminate), ab|wickeln (wind up), tilgen (pay off a debt)
    listen: zu|hören, lauschen (listen attentively), horchen (listen out for)
    listen to: hören (music, radio), zu|hören (listen to someone), lauschen (listen attentively)
    live: leben, wohnen (reside)
    load: laden, beladen (load a vehicle), auf|laden (charge a battery)
    loathe: verabscheuen, verachten (despise)
    locate: lokalisieren, orten (pinpoint with a device), auf|spüren (track down)
    lock: ab|schließen (lock with a key), verriegeln (bolt), sperren (block, lock out)
    log: protokollieren (record events), auf|zeichnen (record), erfassen (capture data)
    long: verlangen (long for, with nach), ersehnen, lechzen (crave, with nach)
    look: schauen, gucken (colloquial), blicken
    look after: betreuen, pflegen (nurse, tend), auf|passen (keep an eye on)
    look at: an|sehen, an|schauen, betrachten (observe)
    look for: suchen, fahnden (hunt for a suspect or thing)
    look up: nach|schlagen (in a reference book), nach|sehen (check), recherchieren (research)
    loosen: lockern, lösen (untie), auf|lockern (loosen up)
    lose: verlieren, ein|büßen (forfeit)
    love: lieben, lieb|haben (hold dear)
    lower: senken, verringern (decrease), herab|setzen (reduce a price)
    lull: ein|lullen (lull to sleep or into security), ein|schläfern (make sleepy), besänftigen (soothe)
    lurk: lauern, auf|lauern (lie in wait for), belauern (watch stealthily)
    magnify: vergrößern (enlarge optically), verstärken (amplify), übertreiben (exaggerate)
    maim: verstümmeln, verkrüppeln, entstellen (disfigure)
    maintain: aufrecht|erhalten (keep up), warten (service equipment), behaupten (assert)
    make: machen, her|stellen (manufacture), an|fertigen (produce to order)
    make up: erfinden (invent a story), schminken (apply makeup), nach|holen (make up for something missed)
    malfunction: aus|fallen (break down), versagen (fail), streiken (colloquial, stop working)
    manage: leiten (run a team or firm), verwalten (administer), schaffen (succeed in doing)
    mangle: zerfetzen (tear to shreds), verstümmeln (mutilate), verhunzen (botch)
    manipulate: manipulieren, lenken (steer others)
    manufacture: her|stellen, fertigen, produzieren
    map: kartieren (chart an area), ab|bilden (map data), zu|ordnen (assign)
    march: marschieren, schreiten (stride), demonstrieren (protest march)
    marinate: marinieren, ein|legen (soak in marinade)
    mark: markieren, kennzeichnen (label), an|kreuzen (tick off)
    market: vermarkten, vertreiben (distribute), bewerben (promote)
    marvel: staunen, bestaunen (marvel at), bewundern (admire)
    mash: zerdrücken (mash with a fork), stampfen (mash potatoes), pürieren (puree)
    mask: maskieren, kaschieren (cover up flaws), verschleiern (veil)
    massage: massieren, durch|kneten (knead muscles)
    master: beherrschen (command a skill, control), meistern (cope successfully), bezwingen (overcome)
    match: entsprechen (correspond to), zusammen|passen (go well together), zu|ordnen (pair up)
    materialize: erscheinen (appear), ein|treten (come about), verwirklichen (realize)
    matter: zählen (count, be of significance), bedeuten (mean something), aus|machen (make a difference)
    maximize: maximieren, optimieren, aus|reizen (push to the limit)
    mean: bedeuten (signify), meinen (intend to say), besagen (state, imply)
    measure: messen, aus|messen (measure the dimensions of), vermessen (survey land)
    mediate: vermitteln, schlichten (settle a dispute)
    meet: kennen|lernen (meet for the first time), treffen (meet), begegnen (run into)
    melt: schmelzen, tauen (snow, ice), zergehen (melt away)
    memorize: memorieren, behalten (retain in memory), ein|prägen (impress on the mind)
    mend: flicken (patch), aus|bessern (repair), stopfen (darn socks)
    mention: erwähnen, nennen (name), an|führen (cite)
    meow: miauen
    merge: zusammen|führen (combine), fusionieren (companies), ein|fädeln (into traffic)
    merit: verdienen
    migrate: aus|wandern (emigrate), ziehen (birds, herds), migrieren (data, systems)
    mimic: nach|ahmen, nach|äffen (ape mockingly), parodieren (parody)
    minimize: minimieren, verringern, herunter|spielen (play down)
    mislead: irre|führen, täuschen (deceive), verleiten (lure into)
    misplace: verlegen, verbummeln (lose by carelessness)
    miss: vermissen (feel the absence of), verpassen (a bus, a chance), verfehlen (a target)
    mistake: verwechseln (confuse one for another), missverstehen (misunderstand), verkennen (misjudge)
    mix: mischen, vermischen, verrühren (stir together)
    mobilize: mobilisieren, auf|bieten (muster), ein|berufen (call up)
    mock: verspotten, hänseln (tease), veralbern (make fun of)
    modify: ändern, ab|ändern, modifizieren
    moisten: befeuchten, an|feuchten (dampen), benetzen (wet)
    mold: formen, gießen (cast in a mold), prägen (shape a character)
    monitor: überwachen, beobachten, kontrollieren
    mortgage: verpfänden (pledge), beleihen (borrow against), belasten (encumber with a mortgage)
    motivate: motivieren, an|spornen, an|treiben
    mount: montieren (fit in place), besteigen (get on, climb up), an|steigen (rise)
    move: bewegen (set in motion), rücken (shift slightly), um|ziehen (move house)
    muffle: dämpfen, ab|dämpfen (deaden), ersticken (stifle)
    multiply: multiplizieren, vervielfachen, vermehren
    mumble: murmeln, nuscheln, brabbeln
    munch: kauen (chew), mampfen (munch noisily), knabbern (nibble)
    murder: ermorden, morden, um|bringen
    murmur: murmeln, flüstern (whisper), raunen (whisper mysteriously)
    muse: sinnieren, nach|denken (reflect on), grübeln (brood)
    must: müssen (obligation), sollen (be supposed to)
    mutter: murmeln, murren (grumble), brummeln (mumble in one's beard)
    nag: nörgeln (carp), keifen (scold shrilly), plagen (pester)
    nail: nageln, an|nageln, fest|nageln (pin down)
    name: nennen, benennen (give a name to), ernennen (appoint)
    narrow: verengen, verschmälern, ein|grenzen (narrow down)
    navigate: navigieren, steuern (steer), lotsen (guide through)
    need: brauchen, benötigen, bedürfen (formal)
    neglect: vernachlässigen, versäumen (fail to do), unterlassen (omit)
    negotiate: verhandeln, aus|handeln (hammer out a deal)
    nest: nisten, horsten (birds of prey), brüten (brood)
    neutralize: neutralisieren, aus|gleichen
    nibble: knabbern, naschen (sweets)
    nod: nicken, zu|nicken (to someone)
    nominate: nominieren, vor|schlagen
    notice: bemerken, merken
    notify: benachrichtigen, informieren
    nourish: ernähren, nähren
    nudge: stupsen, an|stoßen (push lightly)
    numb: betäuben, ab|stumpfen (emotionally)
    obey: gehorchen, befolgen (a rule, an order)
    object: widersprechen, ein|wenden, beanstanden (complain about)
    oblige: verpflichten, zwingen
    obscure: verdunkeln, verdecken (hide from view), verschleiern (make unclear)
    observe: beobachten, ein|halten (a rule), bemerken (remark)
    obsess: beschäftigen (occupy the mind), quälen (torment)
    obstruct: blockieren, behindern, versperren (a path)
    obtain: erhalten, erlangen, beschaffen (procure)
    occupy: besetzen, ein|nehmen (space, time), beschäftigen (keep busy)
    occur: passieren, statt|finden (an event), vor|kommen (be found)
    offend: beleidigen, kränken
    offer: an|bieten, bieten
    offset: aus|gleichen, kompensieren, auf|wiegen
    omit: aus|lassen, weg|lassen
    ooze: sickern, quellen, triefen
    open: öffnen, auf|machen
    operate: bedienen (a machine), operieren (surgery), betreiben (a business)
    oppose: ab|lehnen (be against), bekämpfen (fight against), entgegen|treten
    oppress: unterdrücken, bedrücken (weigh down)
    optimize: optimieren
    orchestrate: orchestrieren, koordinieren, inszenieren (stage)
    order: bestellen (a meal, goods), befehlen (command), ordnen (arrange)
    organize: organisieren, ordnen (tidy), veranstalten (an event)
    orient: orientieren, aus|richten (align)
    oust: ab|setzen (remove from office), verdrängen (displace), vertreiben (drive out)
    outdo: übertreffen, übertrumpfen
    outline: skizzieren, dar|legen (explain in outline)
    outperform: übertreffen, überflügeln
    overcome: überwinden, bewältigen (a task), besiegen (defeat)
    overdo: übertreiben
    overflow: über|laufen, über|quellen, überfluten (flood)
    overhear: mit|hören (hear by chance), auf|schnappen (catch a remark)
    overlap: überlappen, überlagern
    overpower: überwältigen, bezwingen (defeat), übermannen (overcome)
    override: überschreiben (data, a setting), auf|heben (annul), übergehen (disregard)
    overrule: auf|heben (annul a decision), überstimmen (outvote), kippen (reverse a ruling)
    oversee: beaufsichtigen, überwachen, leiten (manage)
    overtake: überholen, ein|holen (catch up with)
    overthrow: entmachten, entthronen (a ruler), um|stoßen (a plan or decision)
    overturn: um|kippen, um|stoßen (knock over), auf|heben (a verdict)
    overwhelm: überwältigen, überfordern (be too much for), überhäufen (swamp with)
    overwrite: überschreiben
    owe: schulden (money), verdanken (be indebted for)
    own: besitzen
    pacify: beruhigen, besänftigen, befrieden (a region)
    pack: packen, ein|packen, verpacken
    paddle: paddeln, planschen (splash in shallow water)
    paint: malen (a picture), streichen (a wall), lackieren (a car)
    parade: marschieren, defilieren, vor|führen (show off)
    paralyze: lähmen, lahm|legen (bring to a standstill)
    paraphrase: paraphrasieren, umschreiben (put in other words)
    park: parken, ab|stellen (a car), ein|parken (into a space)
    parody: parodieren, persiflieren
    partake: teil|nehmen, mit|machen (join in), genießen (food, drink)
    participate: teil|nehmen, mit|machen, mit|wirken
    pass: vorbei|gehen (go past), reichen (hand over), bestehen (an exam)
    paste: ein|fügen (text, files), kleben (glue)
    pat: tätscheln, klopfen (lightly)
    patch: flicken, aus|bessern, patchen (software)
    patrol: patrouillieren, bewachen (guard)
    pause: pausieren, unterbrechen (interrupt), an|halten (stop for a moment)
    pave: pflastern, asphaltieren
    pawn: verpfänden
    pay: bezahlen, zahlen, begleichen (settle a bill)
    pay back: zurück|zahlen, zurück|erstatten (reimburse), heim|zahlen (take revenge)
    pedal: radeln, strampeln
    peek: gucken, lugen, spähen
    peel: schälen, ab|ziehen (peel off), pellen (eggs, potatoes)
    penalize: bestrafen, sanktionieren, benachteiligen
    perceive: wahr|nehmen, erkennen, empfinden (feel)
    perch: sitzen (on a branch), hocken, thronen (sit high up)
    perfect: perfektionieren, vervollkommnen
    perform: aus|führen (carry out), auf|führen (a play, a piece), auf|treten (on stage)
    perish: um|kommen (die), unter|gehen, verfaulen (rot)
    permit: erlauben, gestatten, genehmigen (officially)
    perpetuate: aufrecht|erhalten (keep going), verewigen
    persevere: durch|halten, aus|harren, weiter|machen (carry on)
    persist: an|dauern, beharren (insist), fort|bestehen (continue to exist)
    persuade: überzeugen, überreden
    pester: belästigen, nerven, löchern (with questions)
    phone: an|rufen, telefonieren
    photograph: fotografieren, knipsen (snap casually)
    pick: aus|wählen (choose), pflücken (fruit, flowers)
    pick out: aus|suchen, aus|wählen, heraus|greifen (single out)
    pick up: auf|heben (from the floor), ab|holen (collect someone or something)
    pierce: durchbohren, durchlöchern
    pile up: stapeln, auf|stapeln, an|häufen (accumulate)
    pilot: steuern, lotsen (guide through)
    pin: an|heften (to a board), fest|stecken (with a pin), fest|halten (hold down)
    pinch: kneifen, zwicken, klauen (steal, informal)
    pinpoint: lokalisieren (locate exactly), identifizieren, präzisieren (specify)
    pitch: werfen (a ball), auf|schlagen (a tent), präsentieren (an idea)
    pity: bemitleiden, bedauern
    place: stellen (upright), legen (flat), platzieren
    plague: plagen, quälen, heim|suchen (afflict)
    plan: planen, vor|haben (intend), entwerfen (design)
    plant: pflanzen, säen (sow seeds), an|pflanzen (grow a crop)
    plaster: verputzen (a wall), ein|gipsen (a broken limb), bekleben (cover with posters)
    play: spielen (games, sports, instruments), musizieren (make music), ab|spielen (a recording)
    plead: flehen (beg), plädieren (argue a case), bitten (ask earnestly)
    please: gefallen, erfreuen (delight), zufrieden|stellen (satisfy)
    pledge: versprechen, geloben, schwören (swear an oath)
    plot: aus|hecken (a scheme), intrigieren (conspire), plotten (a graph)
    plow: pflügen, um|pflügen
    pluck: zupfen (strings, eyebrows), rupfen (a bird), pflücken (flowers)
    plug: ein|stecken (plug in), an|schließen (connect), zu|stopfen (a hole)
    plunder: plündern, aus|plündern
    plunge: tauchen (dive in), stürzen (fall steeply), ein|tauchen (immerse)
    point: zeigen (at something), deuten (indicate), richten (aim at)
    point out: hin|weisen, auf|zeigen
    poison: vergiften, verseuchen (contaminate), verpesten (foul)
    poke: stoßen (jab), stochern (in something), stupsen (nudge)
    polish: polieren, putzen (shoes), auf|polieren (improve)
    pollute: verschmutzen, verunreinigen, verseuchen (contaminate)
    ponder: nach|denken, überlegen, grübeln (brood)
    pop: platzen (burst), knallen (go bang), auf|stechen (a bubble or blister)
    populate: bevölkern, besiedeln, bewohnen (inhabit)
    portray: dar|stellen, porträtieren, verkörpern (a role)
    pose: posieren (for a photo), stellen (a question), dar|stellen (a threat)
    position: positionieren, platzieren, auf|stellen
    possess: besitzen, inne|haben (a position or title)
    post: posten (online), veröffentlichen (publish), aus|hängen (a notice)
    postpone: verschieben, auf|schieben, vertagen (a meeting)
    pound: hämmern, pochen (knock, throb), trommeln (beat)
    pour: gießen, schütten, ein|schenken (a drink)
    practice: üben, trainieren (sports), aus|üben (a profession)
    praise: loben, preisen, rühmen
    pray: beten, flehen (beg)
    preach: predigen, verkünden (proclaim), moralisieren (lecture on morals)
    precede: voraus|gehen, voran|gehen, vorher|gehen
    predict: voraus|sagen, vorher|sagen, prognostizieren
    prefer: bevorzugen, vor|ziehen
    preheat: vor|heizen, vor|wärmen
    preoccupy: beschäftigen (occupy the mind), beunruhigen (worry), um|treiben (nag at the mind)
    prepare: vor|bereiten, zu|bereiten (food), her|richten (get ready)
    prescribe: verschreiben (a drug), verordnen (a treatment), vor|schreiben (dictate a rule)
    present: präsentieren, vor|stellen (introduce), überreichen (hand over)
    preserve: erhalten, bewahren, konservieren (food)
    preside: vor|sitzen, präsidieren, leiten (a meeting)
    press: drücken (a button), pressen (squeeze), bügeln (clothes)
    presume: vermuten, an|nehmen, voraus|setzen (take for granted)
    pretend: vor|täuschen, vor|spielen, heucheln (feign a feeling)
    prevail: siegen (triumph), vor|herrschen (be widespread), überwiegen (predominate)
    prevent: verhindern, vor|beugen, verhüten
    prick: stechen, an|stechen
    print: drucken, aus|drucken (a document), ab|drucken (publish a text)
    probe: untersuchen, sondieren, erforschen
    proceed: fort|fahren (continue), weiter|gehen (go on), vor|gehen (act, set about it)
    process: verarbeiten, bearbeiten (a case), ab|wickeln (a transaction)
    proclaim: verkünden, aus|rufen, proklamieren
    produce: produzieren, her|stellen, erzeugen
    profess: bekennen (a faith), beteuern (assert), bekunden (declare openly)
    program: programmieren
    progress: voran|kommen, fort|schreiten, weiter|kommen
    prohibit: verbieten, untersagen
    project: projizieren (an image), hervor|ragen (stick out), hoch|rechnen (estimate the future)
    prolong: verlängern, hinaus|ziehen (drag out)
    promise: versprechen, zu|sagen, geloben
    promote: befördern (to a higher position), fördern (support), werben (for a product)
    prompt: veranlassen, an|regen, auf|fordern
    pronounce: aus|sprechen (a word), verkünden (a verdict), erklären (declare)
    propagate: verbreiten, vermehren (plants, organisms), propagieren (an idea)
    propel: an|treiben, voran|treiben, schleudern (hurl)
    propose: vor|schlagen, unterbreiten (put forward a plan), beantragen (formally)
    prosecute: an|klagen (charge), verfolgen (legally), belangen (hold legally liable)
    prosper: gedeihen, florieren, blühen
    protect: schützen, beschützen, behüten
    protest: protestieren, demonstrieren, auf|begehren
    protrude: hervor|ragen, heraus|ragen, vor|springen
    prove: beweisen, nach|weisen, belegen
    provide: bereit|stellen, liefern, versorgen (supply with)
    provoke: provozieren, reizen (annoy), aus|lösen (trigger)
    prune: beschneiden, zurück|schneiden, stutzen
    pry: schnüffeln, spionieren, auf|stemmen (prise open)
    publish: veröffentlichen, publizieren, heraus|geben (as publisher or editor)
    pull: ziehen, zerren (pull roughly)
    pulse: pulsieren, pochen
    pump: pumpen, auf|pumpen (inflate), ab|pumpen (pump out)
    punch: schlagen (hit with a fist), boxen, lochen (make a hole in paper)
    punctuate: interpunktieren (add punctuation marks), betonen (emphasize), unterbrechen (interrupt at intervals)
    puncture: durchbohren, punktieren (medical), auf|stechen (prick open)
    punish: bestrafen, strafen, ahnden (an offense)
    purchase: kaufen, erwerben (formal), an|schaffen (acquire an item)
    purge: säubern, bereinigen, löschen (data)
    purify: reinigen, läutern (morally), filtern
    pursue: verfolgen, jagen (chase), an|streben (strive for a goal)
    push: schieben (a cart), drücken (a button), stoßen (shove)
    put: legen (flat), stellen (upright), stecken (into)
    put off: verschieben, auf|schieben, ab|schrecken (deter)
    puzzle: verwirren, verblüffen, rätseln (over a riddle)
    quake: beben, zittern, erbeben
    qualify: qualifizieren, berechtigen (entitle), ein|schränken (limit a statement)
    quarrel: streiten, zanken
    quench: löschen (thirst, fire), stillen (thirst)
    query: ab|fragen (a database), an|fragen (inquire), befragen (question someone)
    question: befragen (ask), hinterfragen (challenge), bezweifeln (doubt)
    quit: auf|hören (stop), kündigen (a job), beenden (a program)
    quiver: zittern, erzittern, vibrieren
    quote: zitieren, an|führen (cite), nennen (a price)
    race: rennen, rasen (speed), konkurrieren (compete)
    radiate: strahlen, aus|strahlen (emit), ab|strahlen (emit radiation)
    raid: überfallen, stürmen (a building), durchsuchen (police search)
    rain: regnen
    raise: heben (lift), erhöhen (increase), groß|ziehen (children)
    rally: versammeln (gather), mobilisieren, zusammen|rufen (call together)
    ram: rammen, ein|rammen (drive in)
    ramble: ab|schweifen (digress), schwafeln (talk aimlessly), wandern (hike)
    rank: ein|stufen, rangieren (hold a rank), ein|ordnen
    rant: schimpfen, wettern (rail against), toben (rage)
    rate: bewerten, ein|schätzen (estimate), beurteilen (judge)
    rationalize: rationalisieren, rechtfertigen (justify), schön|reden (explain away)
    rattle: klappern, rasseln, scheppern
    reach: erreichen, gelangen, reichen (extend to)
    react: reagieren
    read: lesen, vor|lesen (aloud), ab|lesen (a meter)
    reap: ernten, mähen (cut crops), ein|bringen (a harvest)
    rear: groß|ziehen, auf|ziehen, züchten (animals)
    reason: argumentieren, folgern (conclude), schließen (infer)
    reassure: beruhigen, versichern (assure), bestärken (encourage)
    rebuild: auf|bauen (build up again), rekonstruieren, um|bauen (remodel)
    rebuke: tadeln, zurecht|weisen, schelten
    recall: zurück|rufen (call back), behalten (keep in memory)
    recede: zurück|gehen, zurück|weichen, schwinden
    receive: bekommen, erhalten, empfangen
    recharge: auf|laden, auf|tanken (recover energy), regenerieren
    reciprocate: erwidern, vergelten
    recite: rezitieren, vor|tragen (a poem), auf|sagen (from memory)
    reckon: rechnen, schätzen, meinen (think)
    reclaim: zurück|fordern, zurück|holen, zurück|gewinnen
    recline: liegen, zurück|lehnen, ruhen (rest)
    recognize: erkennen, wieder|erkennen, an|erkennen (acknowledge officially)
    recoil: zurück|schrecken, zurück|weichen, zurück|zucken (flinch)
    recommend: empfehlen, raten (advise)
    reconcile: versöhnen, vereinbaren (make compatible), ab|gleichen (accounts)
    reconsider: überdenken, überprüfen (re-examine), um|denken
    record: auf|nehmen, auf|zeichnen, protokollieren (minutes)
    recount: erzählen (narrate), schildern (describe vividly), nach|zählen (count again)
    recover: zurück|bekommen (get back), genesen (from illness), bergen (salvage)
    recreate: nach|bilden, nach|stellen (a scene), rekonstruieren
    recruit: rekrutieren, an|werben, ein|stellen (hire)
    rectify: berichtigen, korrigieren, beheben (a fault)
    recycle: recyceln, wieder|verwerten, wieder|verwenden
    redeem: ein|lösen (a voucher, a pledge), erlösen (spiritually), tilgen (a debt)
    redirect: um|leiten, weiter|leiten (forward), um|lenken
    redo: wiederholen, überarbeiten (rework), erneuern
    reduce: reduzieren, verringern, senken (lower)
    refer: verweisen, überweisen (to a specialist), erwähnen (mention)
    refine: verfeinern, raffinieren (oil, sugar), aus|feilen
    reflect: spiegeln, wider|spiegeln, nach|denken (ponder)
    reform: reformieren, um|gestalten, erneuern
    refrain: unterlassen, verzichten, ab|sehen (von)
    refresh: erfrischen, auf|frischen, aktualisieren (data, a page)
    refrigerate: kühlen
    refund: erstatten, zurück|zahlen, zurück|überweisen (send the money back)
    refuse: ab|lehnen, verweigern, zurück|weisen (reject)
    regain: zurück|gewinnen, zurück|erobern, zurück|bekommen
    regard: betrachten, an|sehen (consider as), schätzen (esteem)
    regenerate: regenerieren, erneuern, nach|wachsen (grow back)
    register: registrieren, an|melden, ein|tragen
    regret: bedauern, bereuen (be sorry for what one did)
    regulate: regeln, regulieren, reglementieren
    rehearse: proben, ein|studieren
    reign: herrschen, regieren, walten (hold sway)
    reinforce: verstärken, festigen, untermauern (an argument)
    reiterate: wiederholen, bekräftigen, betonen
    reject: ab|lehnen, zurück|weisen, verwerfen (an idea)
    rekindle: wieder|beleben, entfachen (kindle a feeling afresh)
    relapse: zurück|fallen, verfallen (into a habit)
    relate: verknüpfen (link), zusammen|hängen (be connected), erzählen (tell)
    relax: entspannen, lockern (loosen), ab|schalten (unwind)
    relay: weiter|leiten, weiter|geben, übertragen (broadcast)
    release: frei|lassen, los|lassen, veröffentlichen (publish)
    relegate: degradieren (demote), verbannen (banish), ab|steigen (of a sports team)
    relent: nach|geben, ein|lenken, nach|lassen (ease off)
    relieve: lindern (pain), erleichtern, ab|lösen (take over from someone)
    relish: genießen, aus|kosten, schwelgen
    reload: nach|laden (ammunition), laden (load again), aktualisieren (a web page)
    rely: vertrauen, zählen (count on), bauen (rely on)
    remain: bleiben, übrig|bleiben (be left), verharren (stay unchanged)
    remark: bemerken, an|merken, kommentieren
    remedy: beheben, ab|helfen, heilen
    remember: behalten (keep in mind), gedenken (honor the memory of)
    remind: erinnern, mahnen (remind of a debt)
    remit: überweisen (money), erlassen (a debt, a penalty), übersenden (send)
    remodel: um|bauen, renovieren, um|gestalten
    remove: entfernen, beseitigen, weg|nehmen
    rename: um|benennen, um|taufen
    renew: erneuern, verlängern (a contract, a library book)
    renounce: verzichten, entsagen, ab|schwören
    renovate: renovieren, sanieren (a building), modernisieren
    rent: mieten (as a tenant), vermieten (to a tenant), pachten (land)
    repair: reparieren, aus|bessern, flicken
    repay: zurück|zahlen, erstatten (reimburse), vergelten (a favor)
    repeal: auf|heben, ab|schaffen, widerrufen
    repeat: wiederholen, nach|sprechen (repeat words)
    repel: ab|stoßen, ab|wehren (an attack), vertreiben
    replace: ersetzen, aus|tauschen (swap out), vertreten (stand in for)
    replenish: auf|füllen, nach|füllen (top up), auf|stocken (restock)
    reply: antworten, beantworten (a question or letter), entgegnen (retort)
    report: berichten, melden, an|zeigen (to the police)
    represent: vertreten, dar|stellen (depict), repräsentieren
    repress: unterdrücken, verdrängen (psychologically), zügeln
    reprimand: rügen, verwarnen, maßregeln
    reproach: vor|werfen (blame someone for), beschuldigen
    reproduce: reproduzieren, vervielfältigen (copy), vermehren (breed)
    request: bitten (um), an|fordern, beantragen (apply for)
    require: benötigen, erfordern, verlangen
    reschedule: verschieben, verlegen (move to another date), um|planen
    rescind: auf|heben, widerrufen, zurück|nehmen
    rescue: retten, bergen, befreien
    research: erforschen, forschen, recherchieren
    reserve: reservieren, buchen, zurück|legen
    reshape: um|formen, um|gestalten
    reside: wohnen, leben, bewohnen
    resign: kündigen, zurück|treten, ab|danken
    resist: widerstehen, trotzen, stand|halten (withstand)
    resolve: lösen, beschließen, bei|legen
    resort: zurück|greifen (auf), greifen (zu)
    respect: respektieren, achten, ehren
    respond: antworten, reagieren, erwidern
    rest: ruhen, rasten, schonen (spare an injured part)
    restart: neu|starten, rebooten (a computer)
    restore: restaurieren, zurück|geben, zurück|setzen
    restrain: zurück|halten, zügeln, bändigen
    restrict: beschränken, ein|schränken, begrenzen
    result: resultieren, führen (result in), entstehen (come about)
    resume: fort|setzen, weiter|machen, weiter|führen
    resurrect: wieder|beleben, erwecken (raise from the dead)
    retain: behalten, bei|behalten (keep unchanged), ein|behalten (withhold)
    retreat: zurück|weichen, weichen, flüchten
    retrieve: ab|rufen (data), zurück|holen (fetch back), bergen (salvage)
    return: zurück|kehren, zurück|kommen, zurück|geben (give back)
    reunite: wieder|vereinigen, zusammen|führen
    reveal: enthüllen, offenbaren, auf|decken (uncover)
    reverse: um|kehren, um|drehen (flip), revidieren (change a decision)
    revert: zurück|kehren, zurück|fallen, zurück|setzen (reset)
    review: überprüfen, durch|gehen (go over), rezensieren (a book, a film)
    revise: überarbeiten, revidieren, wiederholen (study again)
    revive: wieder|beleben, beleben, auf|leben (come back to life)
    revoke: widerrufen, entziehen (a licence), zurück|nehmen
    revolutionize: revolutionieren, um|krempeln
    reward: belohnen, honorieren, prämieren
    rhyme: reimen, dichten (write verse)
    ride: reiten (a horse), fahren (a bicycle, a bus), mit|fahren (as a passenger)
    ring: klingeln, läuten (bells), klingen (sound)
    rinse: spülen, aus|spülen, ab|spülen
    rip: reißen, zerreißen, auf|reißen (tear open)
    ripple: kräuseln, plätschern, wogen
    rise: steigen, auf|gehen (sun, dough), auf|stehen (get up)
    risk: riskieren, wagen, gefährden
    rival: rivalisieren, konkurrieren, heran|reichen (come close to equalling)
    roam: umher|streifen, umher|wandern, streunen
    roar: brüllen, tosen, dröhnen
    roast: braten (meat), rösten (coffee, nuts)
    rob: berauben, aus|rauben, bestehlen
    roll: rollen, kullern, wälzen
    rotate: drehen, rotieren, kreisen
    rouse: wecken, auf|rütteln, an|stacheln
    route: leiten, lenken, um|leiten
    row: rudern, streiten (have a row)
    rub: reiben, ein|reiben, ab|reiben
    ruin: ruinieren, zerstören, verderben
    rule: regieren, herrschen, entscheiden (of a court)
    rumble: grollen, rumpeln, donnern
    rummage: wühlen, kramen, stöbern
    run: laufen, rennen, leiten (a business)
    run away: weg|laufen, davon|laufen, fliehen
    rupture: platzen, reißen
    rush: eilen, rasen, sausen
    rust: rosten, verrosten, oxidieren
    rustle: rascheln, rauschen, säuseln
    sabotage: sabotieren, vereiteln, untergraben
    sacrifice: opfern, verzichten
    sadden: betrüben, bekümmern, deprimieren
    safeguard: schützen, sichern, wahren
    sail: segeln, fahren (by ship), aus|laufen (leave port)
    salute: grüßen, salutieren, würdigen (pay tribute to)
    salvage: bergen, retten
    sanction: sanktionieren, genehmigen, billigen
    sanitize: desinfizieren, entkeimen, bereinigen (clean up data)
    sap: schwächen, entkräften, aus|laugen
    satisfy: befriedigen, zufrieden|stellen, erfüllen (a requirement)
    saturate: sättigen, durchtränken, durchnässen
    save: sparen (money), retten (rescue), speichern (data, files)
    savor: genießen, aus|kosten, kosten (taste)
    saw: sägen, ab|sägen, zersägen
    say: sagen, äußern, meinen
    scale: erklimmen, besteigen, skalieren (resize)
    scan: scannen, überfliegen (skim), ab|tasten
    scandalize: empören, schockieren, entrüsten
    scar: vernarben, zeichnen (mark), entstellen (disfigure)
    scare: erschrecken, ängstigen, verschrecken (scare away)
    scatter: verstreuen, streuen, zerstreuen
    schedule: planen, an|setzen, terminieren
    scheme: intrigieren, aus|hecken, konspirieren
    scold: schimpfen, schelten, aus|schimpfen
    scoop: schöpfen (liquid), schaufeln, löffeln
    scorch: versengen, an|sengen, verbrennen
    score: erzielen, schießen (a goal), punkten
    scorn: verachten, verschmähen, verhöhnen
    scour: scheuern, schrubben, durchkämmen (search thoroughly)
    scout: erkunden, aus|kundschaften, spähen
    scrape: kratzen, schaben, ab|kratzen (scrape off)
    scratch: kratzen, zerkratzen, ritzen
    scream: schreien, kreischen, auf|schreien (cry out)
    screw: schrauben, an|schrauben, ein|schrauben
    scribble: kritzeln, hin|kritzeln, krakeln
    scroll: scrollen, blättern
    scrub: schrubben, scheuern, ab|schrubben (scrub off)
    scrutinize: prüfen, mustern, durchleuchten
    sculpt: meißeln, modellieren, schnitzen
    seal: versiegeln, ab|dichten, besiegeln
    search: suchen, durchsuchen, ab|suchen
    season: würzen, salzen, ab|schmecken
    secure: sichern, befestigen (fasten), ab|sichern
    sedate: sedieren, ruhig|stellen, beruhigen
    seduce: verführen, betören, verleiten
    see: sehen, treffen (meet), ein|sehen (realize)
    seek: suchen, an|streben, auf|suchen
    seem: scheinen, wirken, vor|kommen
    segment: segmentieren, unterteilen, gliedern
    segregate: trennen, ab|sondern, aus|grenzen
    select: aus|wählen, wählen, markieren (on screen)
    sell: verkaufen, veräußern, vertreiben (distribute)
    send: schicken, senden, versenden
    send back: zurück|schicken, zurück|senden, retournieren
    sentence: verurteilen, ab|urteilen, verdonnern (informal)
    separate: trennen, scheiden, ab|trennen
    serve: dienen, servieren (food), bedienen (customers)
    set: stellen (upright), legen (flat), fest|legen (a date, a rule)
    set off: auf|brechen, los|fahren, aus|lösen (trigger)
    set up: ein|richten, gründen (found), auf|bauen (put up)
    settle: regeln (a matter), bei|legen (a dispute), begleichen (a bill)
    sever: durchtrennen, ab|trennen, kappen (cut ties)
    sew: nähen, an|nähen, zu|nähen
    shackle: fesseln, an|ketten, hemmen
    shade: schattieren, beschatten, ab|schirmen
    shake: schütteln, rütteln, zittern
    shampoo: waschen (hair), reinigen (a carpet)
    shape: formen, gestalten, prägen
    share: teilen, auf|teilen, mit|teilen (let someone know)
    shatter: zersplittern, zerbrechen, zerschmettern
    shave: rasieren, ab|rasieren
    shear: scheren, ab|scheren
    shed: vergießen (tears, blood), ab|werfen (leaves, skin), verlieren
    shelter: schützen, beherbergen, unter|bringen
    shift: verschieben, verlagern, wechseln
    shimmer: schimmern, glitzern, schillern
    shine: scheinen, leuchten, glänzen
    shiver: zittern, frösteln, schlottern
    shock: schockieren, erschüttern, entsetzen
    shoo: scheuchen, verscheuchen, verjagen
    shoot: schießen, erschießen (kill), drehen (a film)
    shorten: kürzen, verkürzen, ab|kürzen
    should: sollen (advice, obligation)
    shout: rufen, schreien, brüllen
    shove: schubsen, stoßen, stopfen (shove into)
    shovel: schaufeln, schippen
    show: zeigen, aus|stellen (exhibit), vor|führen (demonstrate)
    show off: an|geben, prahlen, protzen
    show up: erscheinen, auf|tauchen, auf|kreuzen (informal)
    shred: schreddern, zerfetzen, raspeln
    shrink: schrumpfen, ein|laufen (of clothes), verkleinern
    shudder: schaudern, erschauern, zusammen|zucken
    shuffle: mischen (cards), schlurfen (walk dragging the feet), um|ordnen
    shun: meiden, scheuen, ächten
    shut: schließen, zu|machen, ab|schließen (lock)
    sidestep: aus|weichen, umgehen (bypass), vermeiden
    siege: belagern, umzingeln
    sift: sieben, durchforsten (sift through)
    sigh: seufzen
    sign: unterschreiben, unterzeichnen (formal), signieren (autograph)
    signal: signalisieren, an|zeigen (indicate)
    silence: unterdrücken (suppress), stumm|schalten (mute a device), verstummen (fall silent)
    simplify: vereinfachen
    simulate: simulieren, nach|ahmen (imitate)
    sing: singen
    singe: versengen, sengen
    sink: sinken, unter|gehen (ships, sun), versenken (cause to sink)
    sip: nippen
    skate: skaten
    sketch: skizzieren, entwerfen (design)
    skewer: auf|spießen
    ski: ski|fahren, ski|laufen
    skim: überfliegen (text), ab|schöpfen (liquids)
    skip: überspringen (omit), aus|lassen (a meal), hüpfen (hop)
    slam: zu|knallen (a door), schmettern (hurl down), schlagen (hit hard)
    slander: verleumden, diffamieren
    slap: ohrfeigen (on the face), schlagen (with an open hand)
    slash: auf|schlitzen (cut open), kürzen (prices, budgets)
    sleep: schlafen
    slice: schneiden, auf|schneiden (into slices)
    slide: gleiten, rutschen, schieben (push along)
    slip: aus|rutschen (lose footing), rutschen, schlüpfen (slip into or out of)
    slither: kriechen, gleiten
    slow: verlangsamen, verzögern (delay), bremsen (brake)
    smash: zerschlagen, zertrümmern (shatter)
    smear: schmieren (spread), verschmieren (smudge), beschmieren (cover with)
    smell: riechen, duften (smell pleasant)
    smile: lächeln, schmunzeln (quietly)
    smoke: rauchen, räuchern (food)
    smooth: glätten, glatt|streichen (with the hand), ebnen (level)
    smother: ersticken, unterdrücken (suppress)
    smuggle: schmuggeln
    snap: brechen (break sharply), schnippen (fingers), knipsen (a photo)
    snarl: knurren, fauchen (angrily)
    snatch: schnappen, entreißen (from someone), weg|schnappen (snatch away)
    sneeze: niesen
    sniff: schnuppern, schnüffeln
    snooze: dösen, schlummern
    snore: schnarchen
    snow: schneien
    soak: ein|weichen, durchnässen (drench), auf|saugen (soak up)
    sob: schluchzen
    socialize: verkehren (mix with others), plaudern (chat), sozialisieren (children, psychology)
    soften: erweichen, mildern (lessen)
    solicit: erbitten, ersuchen (formally), werben (for support)
    solidify: verfestigen, festigen, erstarren (become solid)
    solve: lösen, auf|klären (a crime, mystery)
    soothe: beruhigen, besänftigen, lindern (pain)
    sort: sortieren, ordnen
    sound: klingen, ertönen (alarm, bell)
    sow: säen, aus|säen
    sparkle: funkeln, glitzern
    spawn: laichen (fish, frogs), hervor|bringen (give rise to), erzeugen (generate)
    speak: sprechen, reden
    specify: spezifizieren, an|geben (state exactly), fest|legen (determine)
    speculate: spekulieren, mutmaßen, vermuten
    speed: rasen (go fast), beschleunigen (make faster)
    spell: buchstabieren, bedeuten (spell trouble)
    spend: aus|geben (money), verbringen (time)
    spill: verschütten, vergießen (blood, tears)
    spin: drehen, spinnen (thread), wirbeln
    spit: spucken, speien
    splash: spritzen, planschen (play in water), bespritzen (splash onto)
    splinter: zersplittern, splittern
    split: teilen, spalten, auf|teilen (into parts)
    spoil: verderben (food, plans), verwöhnen (pamper), ruinieren
    sponsor: sponsern, fördern (support)
    spot: entdecken, erblicken, sichten (see at a distance)
    sprain: verstauchen
    spray: sprühen, spritzen, besprühen
    spread: verbreiten (news, disease), aus|breiten (lay out), streichen (butter, paste)
    sprinkle: streuen, bestreuen, besprenkeln
    spur: an|spornen, an|treiben, an|regen (stimulate)
    squander: verschwenden, vergeuden, verprassen (money)
    squeal: quieken (pig), kreischen (person), quietschen (brakes)
    squeeze: drücken, aus|pressen (juice), quetschen (squash in)
    squint: blinzeln (narrow the eyes), schielen (have a squint)
    stab: erstechen (kill), stechen (with a blade)
    stabilize: stabilisieren, festigen
    stagger: taumeln, torkeln (drunkenly), staffeln (schedules)
    stain: beflecken, verfärben (discolor), beizen (wood)
    stall: ab|würgen (an engine), stocken (grind to a halt), verzögern (delay)
    stamp: stempeln, prägen, stampfen (feet)
    start: beginnen, an|fangen, starten (engine, program)
    startle: erschrecken, überraschen (surprise)
    stash: verstecken, verstauen (stow away), horten (hoard)
    state: erklären, behaupten (claim), an|geben (specify)
    stay: bleiben, übernachten (overnight), verweilen (linger)
    steady: stabilisieren, beruhigen (nerves)
    steal: stehlen, klauen (colloquial), entwenden (formal)
    steer: lenken, steuern
    sterilize: sterilisieren, entkeimen
    stew: schmoren, köcheln (simmer), dünsten (steam gently)
    stick: kleben, stecken (put into), haften (adhere)
    stifle: unterdrücken, ersticken
    stigmatize: stigmatisieren, brandmarken
    stimulate: stimulieren, an|regen, beleben (revive)
    sting: stechen (insect, nettle), brennen (smart)
    stink: stinken, müffeln (mildly)
    stipulate: fest|legen, vor|schreiben (require), vereinbaren (agree)
    stir: rühren, um|rühren, schüren (stir up feelings)
    stitch: nähen, zusammen|nähen, sticken (embroider)
    stop: auf|hören (cease), an|halten (come to a halt), stoppen (bring to a halt)
    store: lagern (goods), speichern (data), auf|bewahren (keep)
    storm: stürmen (attack), toben (rage)
    straighten: begradigen, gerade|biegen
    strain: filtern, ab|gießen (pasta), überanstrengen (overexert)
    strangle: erwürgen, erdrosseln
    strap: fest|schnallen, fest|binden
    stray: streunen (animals), ab|schweifen (digress), umher|irren (wander aimlessly)
    strengthen: stärken, verstärken (reinforce), kräftigen
    stress: betonen, hervor|heben (highlight), stressen (cause stress)
    stretch: dehnen, strecken (limbs), spannen
    strew: verstreuen, streuen
    string: auf|fädeln (beads), auf|reihen, bespannen (racket, guitar)
    strip: aus|ziehen (clothes), entkleiden, berauben (of rights, titles)
    stroke: streicheln, liebkosen
    stroll: schlendern, spazieren, bummeln
    struggle: kämpfen, ringen, zappeln (thrash about)
    strum: klimpern, zupfen (pluck)
    study: lernen, studieren (at university), untersuchen
    stuff: füllen, stopfen (cram), voll|stopfen
    stumble: stolpern, straucheln
    stun: betäuben, verblüffen (amaze)
    subdue: unterwerfen, überwältigen, bändigen
    submit: ein|reichen, vor|legen, ab|schicken (a form)
    subscribe: abonnieren, zeichnen (shares)
    subsidize: subventionieren, bezuschussen
    substitute: ersetzen, vertreten (stand in for), aus|tauschen (swap)
    subtract: subtrahieren, ab|ziehen
    succeed: gelingen (an attempt works), nach|folgen (follow into a role), klappen (colloquial)
    succumb: erliegen, unterliegen, nach|geben (give in)
    suck: saugen, lutschen (candy)
    sue: verklagen, klagen (take legal action)
    suffer: leiden, erleiden (injury, loss)
    suffocate: ersticken
    suggest: vor|schlagen (propose), empfehlen (recommend), an|deuten (hint)
    suit: passen, stehen (of clothes), entsprechen (match requirements)
    sum: addieren, summieren, zusammen|zählen
    summarize: zusammen|fassen, resümieren
    summon: herbei|rufen (call over), vor|laden (to court), ein|berufen (convene)
    supersede: ersetzen, ab|lösen (take over from), verdrängen (displace)
    supervise: beaufsichtigen, überwachen (monitor), leiten (manage)
    supplement: ergänzen, auf|stocken (top up)
    supply: liefern, versorgen (with), bereit|stellen (provide)
    support: unterstützen, stützen (physically), befürworten (back an idea)
    suppose: an|nehmen (assume), vermuten (guess), voraus|setzen (presuppose)
    suppress: unterdrücken, nieder|schlagen (a revolt), verdrängen (a memory)
    surf: surfen
    surge: an|steigen (rise sharply), an|schwellen (swell), strömen (rush)
    surmise: vermuten, mutmaßen
    surpass: übertreffen, übersteigen (exceed)
    surprise: überraschen, verblüffen (amaze)
    surrender: kapitulieren, aus|liefern (hand over), übergeben (hand over)
    surround: umgeben, umringen (crowd), umzingeln (military)
    survey: befragen (poll people), vermessen (land), begutachten (inspect)
    survive: überleben, überstehen (get through)
    suspect: verdächtigen (a person), vermuten (think likely), ahnen (have a hunch)
    suspend: suspendieren (from duty), aus|setzen (put on hold), auf|hängen (hang)
    sustain: aufrecht|erhalten (keep going), tragen (bear weight), erleiden (an injury)
    swallow: schlucken, hinunter|schlucken, verschlingen (devour)
    swap: tauschen, aus|tauschen
    sway: schwanken, schaukeln, beeinflussen (sway opinion)
    swear: schwören (vow), fluchen (curse)
    sweat: schwitzen, transpirieren (formal)
    sweep: fegen, kehren
    sweeten: süßen, versüßen (make more pleasant)
    swell: an|schwellen (swell up), auf|quellen (expand with moisture), an|wachsen (increase)
    swim: schwimmen
    swindle: betrügen, prellen (out of money), beschwindeln
    swing: schaukeln, schwingen, baumeln (dangle)
    swipe: wischen (across a screen), klauen (steal), durch|ziehen (a card)
    switch: wechseln, um|schalten (switch over), tauschen (swap)
    symbolize: symbolisieren, verkörpern (embody)
    sympathize: mit|fühlen, sympathisieren (with an idea), bemitleiden (pity)
    sync: synchronisieren, ab|gleichen
    synchronize: synchronisieren, ab|stimmen (coordinate)
    synthesize: synthetisieren, zusammen|führen (merge)
    tack: an|heften (pin on), an|nageln (nail on), kreuzen (sail zigzag)
    tackle: an|gehen (a problem), an|packen (take on), bewältigen (deal with)
    tag: etikettieren, kennzeichnen, markieren
    tailor: an|passen, zu|schneiden (cut to fit a need), schneidern (make clothes)
    taint: verunreinigen, verseuchen, beflecken (sully a reputation)
    take: nehmen, mit|nehmen (take along), bringen (take to a place)
    take care of: betreuen (look after), pflegen (nurse, tend), versorgen (provide for)
    take off: aus|ziehen (clothes), ab|nehmen (a hat, glasses), ab|fliegen (a plane)
    take part: teil|nehmen, mit|machen (join in), mit|wirken (contribute)
    talk: reden, sprechen, plaudern (chat)
    tally: zusammen|zählen (add up), aus|zählen (votes), überein|stimmen (agree, match)
    tame: zähmen, bändigen (control)
    tamper: manipulieren, verfälschen (falsify)
    tan: bräunen (skin), gerben (leather)
    tangle: verwickeln, verknoten, verfilzen (hair, wool)
    tap: klopfen, an|tippen (touch lightly), an|zapfen (draw from)
    tape: auf|nehmen (record), mit|schneiden (record a broadcast), kleben (with tape)
    taper: zu|spitzen, verjüngen, aus|laufen (taper off)
    target: zielen, an|visieren (take aim at), ab|zielen (be aimed at)
    tarnish: an|laufen (metal goes dull), beflecken (sully a reputation), trüben (dim)
    taste: schmecken, probieren (sample), verkosten (wine, food)
    tattoo: tätowieren
    taunt: verspotten, verhöhnen, provozieren
    tax: besteuern, versteuern (declare for tax), belasten (strain)
    teach: unterrichten (a class), lehren (a subject), bei|bringen (teach a skill)
    tear: reißen, zerreißen (rip to pieces), auf|reißen (tear open)
    tear down: ab|reißen, nieder|reißen, ab|brechen (dismantle)
    tease: necken, hänseln, auf|ziehen (tease someone)
    telephone: telefonieren, an|rufen
    tell: sagen, erzählen (a story), mit|teilen (inform)
    tell off: aus|schimpfen, zurecht|weisen, tadeln
    tempt: verlocken, locken, verführen
    tend: neigen (be inclined), tendieren (zu), pflegen (look after)
    tenderize: klopfen (pound meat), marinieren (marinate to soften)
    terminate: beenden, kündigen (contract), entlassen (employee)
    terrify: ängstigen, entsetzen
    test: testen, prüfen, erproben (try out)
    testify: aus|sagen (in court), bezeugen (attest)
    tether: an|binden, an|leinen (dog), fest|binden
    thank: danken
    thaw: auf|tauen, ab|tauen (defrost)
    thicken: verdicken, ein|dicken (liquids), binden (a sauce)
    thin: verdünnen (liquid), aus|dünnen (hair, crowds), ab|magern (become thin)
    think: denken, nach|denken (ponder), glauben (believe)
    think about: denken (an), nach|denken (über), überlegen (consider)
    thread: ein|fädeln (a needle), auf|fädeln (beads)
    threaten: drohen, bedrohen, gefährden (endanger)
    thrill: begeistern, mit|reißen (sweep along), packen (grip)
    thrive: gedeihen (grow well), florieren (business), blühen (bloom)
    throb: pochen, pulsieren, klopfen
    throttle: drosseln (reduce flow), würgen (choke someone), erdrosseln (strangle)
    throw: werfen, schleudern (hurl), schmeißen (colloquial)
    throw away: weg|werfen, entsorgen (dispose of), weg|schmeißen (colloquial)
    thrust: stoßen, rammen (drive in), stechen (stab with a blade)
    thump: hämmern (with fists), schlagen (hit hard), pochen (thud)
    thunder: donnern, grollen (rumble)
    thwart: vereiteln, durchkreuzen (plans), hintertreiben (undermine)
    tick: ticken (clock), ab|haken (check off), an|kreuzen (mark on a form)
    tidy: auf|räumen, ordnen
    tie: binden, zu|binden (shoes, bags), fest|binden (fasten)
    tighten: fest|ziehen (screws), straffen (pull taut), verschärfen (rules)
    tilt: kippen, neigen
    time: stoppen (measure time), ab|stimmen (coordinate timing), terminieren (schedule)
    tingle: kribbeln, prickeln
    tint: tönen, färben (dye), kolorieren (colour in)
    tip: kippen, neigen, aus|kippen (tip out)
    tire: ermüden, erschöpfen (exhaust)
    title: betiteln, benennen (name)
    toast: toasten, rösten, an|stoßen (clink glasses)
    toggle: um|schalten, wechseln
    tolerate: tolerieren, dulden, ertragen (endure)
    tone: straffen (muscles, skin), kräftigen
    top: übertreffen, überbieten, krönen (crown)
    topple: stürzen (fall over), um|stoßen (knock over), um|kippen (tip over)
    torment: quälen, plagen (afflict), peinigen
    torture: foltern, quälen (torment)
    toss: werfen, schmeißen (colloquial), hoch|werfen (toss up)
    touch: berühren, an|fassen, rühren (move emotionally)
    tour: besichtigen (sights), bereisen (a region), herum|führen (show someone around)
    tow: ab|schleppen (a car), schleppen (haul), bugsieren (a ship)
    trace: nach|zeichnen (outline), zurück|verfolgen (origins), auf|spüren (track down)
    track: verfolgen, orten (locate by signal), auf|spüren (hunt down)
    trade: handeln, tauschen (swap), ein|tauschen (exchange for)
    train: trainieren, aus|bilden (teach skills), schulen (instruct)
    trample: zertrampeln, nieder|trampeln, trampeln (stamp heavily)
    transcend: übersteigen (go beyond), überschreiten (cross a limit), transzendieren (philosophy)
    transcribe: transkribieren, ab|schreiben (copy out), übertragen (convert to another form)
    transfer: übertragen (data, rights), überweisen (money), versetzen (an employee)
    transform: verwandeln, um|wandeln, transformieren
    translate: übersetzen, dolmetschen (interpret orally)
    transmit: übertragen (signal, data, disease), übermitteln (convey), aus|strahlen (broadcast)
    transpire: passieren (happen), heraus|kommen (become known), transpirieren (perspire)
    transplant: transplantieren (organs), verpflanzen (plants, tissue), um|pflanzen (replant)
    transport: transportieren, befördern (passengers, goods), verfrachten (ship)
    trap: fangen, ein|klemmen (jam), ein|schließen (lock in)
    travel: reisen, verreisen (go away on a trip), fahren (go by vehicle)
    traverse: durchqueren, überqueren
    tread: treten (step on), betreten (set foot on), schreiten (stride)
    treasure: schätzen (value), hoch|schätzen (hold dear), hüten (guard like a treasure)
    treat: behandeln, spendieren (pay as a treat), bewirten (entertain with food)
    tremble: zittern, beben, schlottern (with cold, fear)
    trick: täuschen, überlisten (outwit), herein|legen (con)
    trickle: sickern, tröpfeln, rieseln
    trigger: aus|lösen, hervor|rufen (bring about), aktivieren (activate)
    trim: stutzen (beard, hedge), beschneiden (prune), kürzen (cut down)
    trip: stolpern, straucheln
    triple: verdreifachen
    trivialize: bagatellisieren, verharmlosen, herunter|spielen (play down)
    trot: traben
    trouble: stören (disturb), beunruhigen (worry), belästigen (bother)
    truncate: ab|schneiden, kürzen, kappen
    trust: vertrauen, trauen, glauben (believe someone)
    try: versuchen, probieren (try out), aus|probieren (test out)
    try on: an|probieren
    tuck: stecken, ein|schlagen (fold edges in), zu|decken (tuck in bed)
    tumble: stürzen, purzeln (tumble over), ein|stürzen (collapse)
    tune: stimmen (an instrument), ein|stellen (radio), tunen (engine, car)
    tunnel: graben, untertunneln (tunnel under)
    turn: drehen, ab|biegen (change direction), um|drehen (turn over)
    turn around: um|drehen, um|kehren (go back), herum|drehen (turn the other way)
    turn down: ab|lehnen (reject), herunter|drehen (volume, heat), ab|weisen (turn away)
    turn into: verwandeln, um|wandeln (convert), werden (become)
    turn off: aus|schalten (device), aus|machen (colloquial), ab|stellen (engine, water)
    turn on: ein|schalten (device), an|machen (colloquial), an|stellen (engine, water)
    turn up: auf|drehen (volume, heat), hoch|drehen, auf|tauchen (show up)
    tweet: twittern, zwitschern (birds chirp)
    twinkle: funkeln, glitzern
    twirl: wirbeln, drehen (turn round), kreisen (circle)
    type: tippen, ein|tippen, ab|tippen (type out a text)
    umpire: leiten (a match), pfeifen (as referee), schlichten (arbitrate a dispute)
    unbutton: auf|knöpfen
    uncover: auf|decken, entdecken, frei|legen (excavate)
    underestimate: unterschätzen
    undergo: durch|machen (go through), erleiden (suffer), erfahren (experience)
    underline: unterstreichen, betonen (emphasize)
    undermine: untergraben, aus|höhlen (erode), schwächen (weaken)
    underpin: untermauern, stützen (support)
    understand: verstehen, begreifen (grasp), kapieren (colloquial)
    understate: untertreiben, herunter|spielen (play down), verharmlosen (make seem harmless)
    undertake: unternehmen, übernehmen (take on)
    underwrite: garantieren, bürgen (stand surety), versichern (insure)
    undo: lösen (untie, loosen), auf|heben (reverse), widerrufen (revoke)
    undress: aus|ziehen (take clothes off someone), entkleiden
    unearth: aus|graben (dig up), auf|spüren (find), auf|decken (reveal)
    unfasten: öffnen, lösen, auf|machen
    unfold: entfalten, auf|klappen (flip open), aus|breiten (spread out)
    unfurl: entrollen (flag, scroll), entfalten (spread open), aus|rollen (roll out)
    unhook: aus|haken, aus|klinken (release), los|machen (detach)
    unify: vereinigen, vereinheitlichen (standardize), zusammen|führen (bring together)
    uninstall: deinstallieren, entfernen (remove)
    unite: vereinigen, verbinden, zusammen|schließen
    unleash: entfesseln, los|lassen (let loose), frei|setzen (release)
    unload: aus|laden, ab|laden, entladen (weapon, battery)
    unmask: entlarven (expose), enttarnen (reveal a spy), demaskieren (take a mask off)
    unpack: aus|packen
    unplug: heraus|ziehen (a plug), trennen (disconnect), aus|stöpseln (colloquial)
    unravel: entwirren, enträtseln, auf|trennen
    unroll: aus|rollen (a carpet), ab|rollen (a roll), entrollen (a scroll)
    unscrew: ab|schrauben, los|schrauben, auf|schrauben (a lid)
    unsettle: beunruhigen, verunsichern (make uncertain), verstören (disturb deeply)
    untie: lösen (a knot), auf|binden, los|binden (set free)
    unveil: enthüllen, vor|stellen (present a product), präsentieren (present publicly)
    unwrap: aus|packen (a gift), aus|wickeln (remove wrapping)
    unzip: entpacken (files), dekomprimieren (data), auf|ziehen (a zipper)
    update: aktualisieren, erneuern (renew)
    upgrade: auf|rüsten (equipment, hardware), auf|werten (raise value, grade), verbessern (improve)
    uphold: aufrecht|erhalten (maintain), bestätigen (confirm a ruling), wahren (preserve)
    uplift: auf|richten, auf|heitern, erheben
    upload: hoch|laden, übertragen (transfer data)
    uproot: entwurzeln, aus|reißen (pull out), roden (clear land)
    upset: auf|regen, verärgern, kränken (hurt feelings)
    urge: drängen (press for), an|treiben (drive on), auf|fordern (call upon)
    use: benutzen, verwenden, nutzen
    usher: führen, geleiten (escort), ein|leiten (usher in an era)
    usurp: usurpieren, entreißen (wrest power from), verdrängen (supplant)
    utilize: nutzen, verwerten (make use of), ein|setzen (put to use)
    utter: äußern, aus|sprechen (pronounce), aus|stoßen (a cry)
    vaccinate: impfen
    vacuum: saugen, ab|saugen (suck away)
    validate: validieren, bestätigen (confirm), prüfen (check)
    value: schätzen (appreciate), bewerten (put a value on), taxieren (appraise)
    vandalize: demolieren, beschädigen (damage), verwüsten (wreck)
    vanish: verschwinden, entschwinden (literary), schwinden (dwindle away)
    vaporize: verdampfen, verdunsten (evaporate slowly), zerstäuben (atomize)
    varnish: lackieren, firnissen (art, wood), lasieren (glaze)
    vary: variieren, ab|weichen (differ), schwanken (fluctuate)
    veer: ab|weichen (deviate), aus|scheren (swerve out), ab|drehen (ship, plane)
    vent: entlüften (let air out), aus|lassen (anger), ab|lassen (steam, pressure)
    ventilate: lüften, belüften (equip with ventilation), durch|lüften (air out thoroughly)
    venture: wagen, riskieren
    verify: überprüfen, verifizieren, bestätigen (confirm)
    veto: blockieren, untersagen (forbid), ab|lehnen (reject)
    vex: ärgern, verärgern, irritieren
    vibrate: vibrieren, zittern (tremble), schwingen (oscillate)
    victimize: schikanieren (harass), benachteiligen (treat unfairly), diskriminieren (discriminate against)
    videotape: filmen, auf|nehmen (record), auf|zeichnen (record)
    vie: wetteifern, konkurrieren, rivalisieren
    view: betrachten, an|sehen, besichtigen (a property)
    vilify: verunglimpfen, diffamieren, verteufeln (demonize)
    vindicate: rechtfertigen (justify), rehabilitieren (restore reputation), entlasten (exonerate)
    violate: verletzen (rights), verstoßen (against a rule), brechen (law, promise)
    visit: besuchen, auf|suchen (formal), besichtigen (sights)
    visualize: visualisieren, veranschaulichen (illustrate), dar|stellen (depict)
    vocalize: artikulieren (express in words), äußern (utter), vokalisieren (linguistics, singing)
    void: annullieren, stornieren (cancel a transaction), auf|heben (rescind)
    vomit: erbrechen, kotzen (vulgar), speien (literary)
    vote: wählen (elections), ab|stimmen (put to a vote), stimmen (cast a vote)
    vouch: bürgen, ein|stehen (answer for), garantieren (guarantee)
    vow: schwören, geloben, versprechen
    voyage: reisen, fahren (travel by ship), segeln (sail)
    wade: waten
    wag: wedeln, wackeln
    wail: heulen, jammern (moan), klagen (lament)
    wait: warten, harren (literary)
    wait for: warten, ab|warten (wait and see), harren (literary)
    wait on: bedienen, servieren (food)
    waive: verzichten (auf), erlassen (a fee, debt), ab|sehen (von)
    wake: wecken (rouse someone), auf|wachen (become awake), erwachen (awaken)
    wake up: auf|wachen, auf|wecken (rouse someone)
    walk: gehen, laufen (on foot), spazieren (take a stroll)
    wall: ummauern, ein|mauern (wall in), zu|mauern (wall up)
    waltz: tanzen (dance), walzen (waltz, dated)
    wander: wandern, umher|streifen (roam), umher|irren (wander aimlessly)
    wane: schwinden, ab|nehmen (decrease), nach|lassen (diminish)
    want: wollen, wünschen, begehren (desire)
    ward off: ab|wehren, fern|halten, vertreiben (drive away)
    warm: wärmen, erwärmen (heat gently), erhitzen (heat strongly)
    warm up: auf|wärmen (reheat food), erwärmen (heat up)
    warn: warnen, vor|warnen (give advance notice), verwarnen (give an official warning)
    warp: verformen, verbiegen, verzerren (distort)
    warrant: rechtfertigen, erfordern (call for), garantieren (guarantee)
    wash: waschen, spülen (rinse, dishes), ab|waschen (wash off)
    waste: verschwenden, vergeuden
    watch: an|sehen (look at; TV, movies), beobachten (observe), bewachen (keep watch over)
    water: gießen (plants), bewässern (irrigate), tränken (animals)
    wave: winken, zu|winken (wave at someone), schwenken (wave something)
    waver: schwanken, zögern (hesitate), zaudern (dither)
    weaken: schwächen, ab|schwächen (lessen), nach|lassen (decline)
    wean: ab|stillen (a baby), entwöhnen (from a habit), ab|gewöhnen (break a habit)
    wear: tragen, an|haben (colloquial), ab|nutzen (wear out)
    weave: weben, flechten (braid, basket)
    wed: heiraten, ehelichen (formal), trauen (officiate)
    weep: weinen, heulen (colloquial), beweinen (weep for)
    weigh: wiegen, ab|wägen (options, pros and cons), erwägen (consider)
    weigh down: belasten, bedrücken (depress), beschweren (add weight to)
    welcome: begrüßen, empfangen (receive guests), auf|nehmen (take in)
    weld: schweißen, verschweißen (weld together)
    whack: schlagen, hauen (colloquial)
    whip: aus|peitschen (flog), peitschen (lash), schlagen (cream, eggs)
    whisper: flüstern, wispern, raunen (murmur)
    whistle: pfeifen
    whiten: bleichen, weißen (paint white), auf|hellen (lighten)
    whittle: schnitzen, verringern (whittle down)
    widen: verbreitern (a road), erweitern (scope, horizons), weiten (stretch)
    wield: schwingen (a weapon), handhaben (handle a tool), aus|üben (power, influence)
    wiggle: wackeln, zappeln (squirm), wippen (bob up and down)
    win: gewinnen, siegen (be victorious), erringen (achieve by effort)
    win over: überzeugen, gewinnen (win someone's favour), überreden (talk into)
    wind: wickeln, auf|ziehen (a clock, toy), mäandern (river, road)
    wink: zwinkern, zu|zwinkern (wink at someone), blinzeln (blink)
    wipe: wischen, ab|wischen (wipe off), ab|trocknen (wipe dry)
    wish: wünschen, ersehnen
    withdraw: zurück|ziehen (pull back, retract), ab|heben (money), zurück|nehmen (take back a statement)
    wither: verwelken, verdorren (dry up and die), vertrocknen (dry out)
    withstand: stand|halten (resist), widerstehen (resist), aus|halten (endure)
    witness: mit|erleben (be there for), bezeugen (attest), beobachten (observe)
    wobble: wackeln, schwanken, taumeln (stagger)
    word: formulieren, ab|fassen (draft a text), verfassen (compose)
    work: arbeiten (people), funktionieren (machines), wirken (take effect)
    work out: lösen (solve), trainieren (exercise), aus|arbeiten (draw up a plan)
    worry: beunruhigen, bangen (fear for, with um), grübeln (brood)
    worsen: verschlechtern, verschlimmern, verschärfen (aggravate)
    worship: verehren, an|beten, vergöttern (idolize)
    wound: verletzen, verwunden (in battle), kränken (hurt feelings)
    wrap: ein|wickeln, ein|packen (gift), verpacken (package)
    wreck: zerstören, ruinieren, demolieren (damage badly)
    wrench: reißen, verrenken (twist a joint), entreißen (wrest away)
    wrestle: ringen, kämpfen (fight)
    wring: aus|drücken (squeeze water out), aus|pressen (squeeze out), verdrehen (twist)
    write: schreiben, verfassen (compose a text)
    write down: auf|schreiben, notieren, nieder|schreiben
    write off: ab|schreiben (debt, loss), ab|haken (give up on), streichen (cancel)
    x-ray: röntgen
    yank: reißen (jerk), zerren (drag), rupfen (pluck)
    yawn: gähnen
    yearn: ersehnen (long for), verlangen (crave, with nach), lechzen (long for, with nach)
    yell: schreien, brüllen (roar), an|schreien (yell at someone)
    yelp: jaulen, auf|schreien (cry out sharply), kläffen
    yield: nach|geben, ab|werfen (profit), erbringen (produce)
    yoke: an|spannen (hitch animals), ein|spannen (put in harness), unterjochen (subjugate)
    zap: löschen (delete), vernichten (destroy), zappen (change TV channels)
    zip: komprimieren (files), zu|ziehen (a zipper), flitzen (zip along)
    zone: aus|weisen (designate land use), ein|teilen (divide into zones)
    zoom: zoomen, heran|zoomen (zoom in on), sausen (rush past)
  `;

  // "know: wissen (facts), kennen (people)" -> { know: [{ de, note }, ...] }
  const VERBS = parseTable(TABLE, plainEntry('de'));

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
