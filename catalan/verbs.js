/*
 * English -> Catalan verb database.
 *
 * One line per English verb: `english: catalan, catalan (usage note)`.
 * The first Catalan verb is the default translation. To add a verb, add a
 * line here; conjugate.js works out the conjugation from the infinitive.
 * Pronominal verbs (-se) are not supported, so those are left out.
 */
(function (global) {
  'use strict';

  const { parseTable, plainEntry } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: abandonar
    abort: avortar, interrompre
    absorb: absorbir
    abuse: abusar
    accelerate: accelerar
    accept: acceptar
    accompany: acompanyar
    accomplish: realitzar, aconseguir
    accumulate: acumular
    accuse: acusar
    achieve: aconseguir, assolir
    acknowledge: reconèixer, admetre
    acquire: adquirir
    acquit: exculpar
    act: actuar
    adapt: adaptar
    add: afegir, sumar (in math)
    adhere: adherir
    adjust: ajustar
    administer: administrar
    admire: admirar
    admit: admetre
    adopt: adoptar
    adore: adorar
    advance: avançar
    advertise: anunciar
    advise: aconsellar
    advocate: defensar, advocar
    affect: afectar
    age: envellir
    agitate: agitar
    agree: acordar (agree on), convenir
    aim: apuntar
    alert: alertar
    align: alinear
    allocate: assignar, repartir
    allow: permetre, deixar
    alter: alterar
    amaze: meravellar, sorprendre
    amend: esmenar, modificar
    amuse: divertir, entretenir
    analyze: analitzar
    anger: enutjar, enfurismar
    announce: anunciar
    annoy: molestar, empipar
    answer: respondre, contestar
    anticipate: anticipar
    appeal: apel·lar
    appear: aparèixer
    applaud: aplaudir
    apply: aplicar, sol·licitar (apply for)
    appoint: nomenar
    appreciate: apreciar, agrair (be grateful for)
    approach: abordar, apropar
    approve: aprovar
    argue: discutir, argumentar
    arise: sorgir
    arrange: arreglar, organitzar
    arrest: arrestar, detenir
    arrive: arribar
    articulate: articular
    ascend: ascendir
    ask: preguntar (a question), demanar (for something)
    ask for: demanar
    aspire: aspirar
    assemble: muntar, ensamblar
    assert: afirmar
    assess: avaluar
    assign: assignar
    assimilate: assimilar
    assist: ajudar, assistir
    associate: associar
    assume: suposar, assumir
    assure: assegurar
    astonish: sorprendre, meravellar
    attach: adjuntar
    attack: atacar
    attain: assolir, aconseguir
    attempt: intentar
    attend: assistir (an event), atendre (take care of)
    attract: atreure
    attribute: atribuir
    audit: auditar
    authorize: autoritzar
    avoid: evitar
    award: atorgar
    back up: avalar, respatllar
    bake: enfornar
    balance: equilibrar
    ban: prohibir
    bandage: embenar
    bang: colpejar
    baptize: batejar
    bargain: regatejar
    bark: lladrar
    base: basar
    bathe: banyar
    battle: lluitar
    be: ser (identity, traits), estar (state, location)
    bear: suportar, aguantar
    beat: vèncer, colpejar, batre
    beautify: embellir
    beg: pregar, suplicar
    begin: començar, iniciar
    belch: eructar
    believe: creure
    belong: pertànyer
    bend: doblegar, corbar
    bet: apostar
    bid: licitar
    bill: facturar
    bind: lligar
    bite: mossegar
    blackmail: xantatjar
    blame: culpar
    bleach: blanquejar
    bleed: sagnar
    blend: barrejar
    bless: beneir
    blink: parpellejar
    block: bloquejar
    bloom: florir
    blossom: florir
    blow: bufar
    blur: difuminar
    board: embarcar
    boast: presumir
    boil: bullir
    bond: unir, vincular
    book: reservar
    boost: impulsar
    bore: avorrir
    bother: molestar
    bounce: rebotar
    bow: inclinar
    boycott: boicotejar
    brag: fanfarronejar
    brake: frenar
    break: trencar, rompre
    breathe: respirar
    brew: elaborar
    bribe: subornar
    bring: portar (bring), emportar (take away)
    bring up: criar (children), mencionar (a topic)
    broadcast: emetre, transmetre
    broaden: ampliar, eixamplar
    browse: navegar, fullejar
    bruise: macar
    brush: raspallar
    bubble: bombollejar, bullir
    buckle: cordar
    build: construir
    bully: intimidar
    burden: carregar
    burn: cremar
    burst: rebentar
    bury: enterrar
    buy: comprar
    buzz: brunzir
    cage: engabiar
    calculate: calcular
    call: cridar, trucar (by phone)
    calm: calmar, tranquil·litzar
    camp: acampar
    can: poder (be able to)
    cancel: cancel·lar
    capture: capturar
    care: cuidar
    caress: acariciar
    carry: portar, carregar
    carry out: realitzar
    carve: tallar
    cash: cobrar
    cast: llançar
    catch: atrapar, agafar
    categorize: classificar
    cause: causar
    cease: cessar
    celebrate: celebrar
    chain: encadenar
    challenge: desafiar
    change: canviar
    chant: cantar, corejar
    charge: cobrar
    charm: encantar, encisar
    chase: perseguir
    chat: xerrar, conversar
    chatter: xerrar
    cheat: enganyar
    check: revisar, comprovar
    cheer: animar
    cherish: apreciar, estimar
    chew: mastegar
    chill: refredar
    choke: ofegar, asfixiar
    choose: triar, escollir
    chop: picar, tallar
    circle: envoltar, rodejar
    circulate: circular
    cite: citar
    claim: reclamar, afirmar
    clap: aplaudir
    clarify: aclarir
    clash: xocar
    clasp: agafar
    classify: classificar
    clean: netejar
    clean up: netejar, endreçar
    cleanse: netejar, purificar
    clear: despejar, aclarir
    clench: apretar
    click: clicar
    climb: pujar, escalar
    clip: retallar
    clog: embussar, obstruir
    clone: clonar
    close: tancar
    clutch: agafar
    coach: entrenar
    coax: persuadir
    code: programar, codificar
    coincide: coincidir
    collaborate: col·laborar
    collapse: col·lapsar, ensorrar
    collect: col·leccionar, recollir
    collide: col·lidir, xocar
    color: acolorir
    comb: pentinar
    combat: combatre
    combine: combinar
    come: venir
    come back: tornar
    come in: entrar
    comfort: consolar
    command: ordenar, manar
    commemorate: commemorar
    comment: comentar
    commit: cometre
    communicate: comunicar
    compare: comparar
    compensate: compensar
    compete: competir
    compile: compilar
    complete: completar
    complicate: complicar
    compliment: afalagar, felicitar
    comply: complir
    compose: compondre, redactar
    comprise: comprendre
    compute: calcular, computar
    conceal: ocultar, amagar
    concede: concedir
    conceive: concebre
    conclude: concloure, deduir
    condemn: condemnar
    conduct: conduir, dirigir
    confess: confessar
    configure: configurar
    confirm: confirmar
    confront: afrontar, enfrontar
    confuse: embolicar, desconcertar
    congratulate: felicitar
    connect: connectar
    conquer: conquistar, conquerir
    consent: consentir
    conserve: conservar
    consider: considerar
    consist: consistir
    console: consolar
    consolidate: consolidar
    conspire: conspirar
    constitute: constituir
    construct: construir
    consult: consultar
    consume: consumir
    contact: contactar
    contain: contenir
    contemplate: contemplar
    contend: competir, disputar
    continue: continuar, seguir
    contradict: contradir
    contrast: contrastar
    contribute: contribuir
    control: controlar
    converge: convergir
    convert: convertir
    convey: transmetre, expressar
    convince: convèncer
    cook: cuinar
    cool: refredar, refrescar
    cooperate: cooperar
    coordinate: coordinar
    cope: afrontar
    copy: copiar
    correct: corregir
    correspond: correspondre
    corrupt: corrompre
    cost: costar
    cough: tossir
    counsel: aconsellar
    count: comptar
    counterfeit: falsificar
    court: festejar
    cover: cobrir
    crack: esquerdar
    crash: estavellar, xocar
    crave: anhelar
    crawl: gatejar, arrossegar
    create: crear
    credit: acreditar
    criticize: criticar
    cross: creuar, travessar
    crush: aixafar
    cry: plorar (weep), cridar (shout)
    cultivate: cultivar
    cure: curar
    curl: arrissar
    curse: maleir
    cushion: amortir
    customize: personalitzar
    cut: tallar
    cut off: tallar
    damage: danyar
    dance: ballar
    dare: gosar
    darken: enfosquir
    darn: sargir
    dash: córrer, precipitar
    dazzle: enlluernar
    deal: tractar (deal with)
    debate: debatre
    debug: depurar
    decay: deteriorar, descompondre
    deceive: enganyar
    decide: decidir
    decipher: desxifrar
    declare: declarar
    decline: declinar, rebutjar
    decorate: decorar
    decrease: disminuir
    decrypt: desxifrar
    dedicate: dedicar
    deduct: deduir
    deem: considerar
    defeat: derrotar
    defend: defensar, defendre
    defer: ajornar, diferir
    define: definir
    deflect: desviar
    degrade: degradar
    delay: retardar, endarrerir
    delegate: delegar
    delete: esborrar, eliminar
    deliberate: deliberar
    delight: encantar
    deliver: lliurar, repartir
    demand: exigir
    demolish: enderrocar
    demonstrate: demostrar
    denote: denotar
    denounce: denunciar
    deny: negar
    depend: dependre
    deploy: desplegar
    deport: deportar
    deposit: dipositar
    deprive: privar
    derive: derivar
    descend: descendir
    describe: descriure
    deserve: merèixer
    design: dissenyar
    designate: designar
    desire: desitjar
    despise: menysprear
    destroy: destruir
    detect: detectar
    deteriorate: deteriorar
    determine: determinar
    detest: detestar
    devastate: devastar
    develop: desenvolupar
    deviate: desviar
    devour: devorar
    diagnose: diagnosticar
    dial: marcar
    dictate: dictar
    die: morir
    differ: diferir
    dig: cavar
    digest: digerir
    dilute: diluir
    dim: atenuar
    diminish: disminuir
    dine: sopar
    direct: dirigir
    disable: inhabilitar, inutilitzar
    disagree: discrepar
    disappear: desaparèixer
    disappoint: decepcionar, decebre
    disarm: desarmar
    discard: descartar
    discharge: descarregar
    disclose: revelar, divulgar
    disconnect: desconnectar
    discourage: desanimar
    discover: descobrir
    discredit: desacreditar
    discuss: discutir
    disguise: disfressar
    disgust: repugnar
    disinfect: desinfectar
    dismantle: desmuntar
    dismiss: acomiadar, descartar
    dispatch: despatxar
    dispense: dispensar
    disperse: dispersar
    displace: desplaçar
    display: exhibir, mostrar
    disprove: refutar
    dispute: disputar
    distinguish: distingir
    distort: distorsionar
    distract: distreure
    distribute: distribuir
    disturb: molestar, pertorbar
    dive: bussejar
    diversify: diversificar
    divide: dividir
    divorce: divorciar
    do: fer
    document: documentar
    dodge: esquivar
    dominate: dominar
    donate: donar
    double: duplicar
    doubt: dubtar
    download: descarregar
    draft: redactar
    drag: arrossegar
    drain: drenar
    draw: dibuixar
    dread: témer
    dream: somiar
    dress: vestir
    dribble: driblar
    drift: derivar
    drill: perforar
    drink: beure
    drip: gotejar
    drive: conduir
    drizzle: plovisquejar
    drop: soltar
    drown: ofegar
    dry: assecar
    dump: abocar, llençar
    duplicate: duplicar
    dwell: habitar
    dye: tenyir
    earn: guanyar
    ease: alleujar, facilitar
    eat: menjar
    echo: ressonar
    edit: editar
    educate: educar
    elaborate: elaborar
    elapse: transcórrer
    elect: elegir
    elevate: elevar
    eliminate: eliminar
    elude: eludir
    email: enviar
    embark: embarcar
    embed: incrustar
    embrace: abraçar
    embroider: brodar
    emerge: sorgir
    emit: emetre
    emphasize: emfatitzar, destacar
    employ: emprar
    empower: apoderar
    empty: buidar
    enable: permetre, habilitar
    enact: promulgar
    enchant: encantar
    encircle: rodejar, envoltar
    encounter: trobar
    encourage: animar, encoratjar
    encrypt: xifrar
    end: acabar, finalitzar
    endorse: avalar, respatllar
    endure: suportar, aguantar
    energize: energitzar
    enforce: aplicar
    engage: involucrar, contractar (hire)
    engrave: gravar
    enhance: millorar
    enjoy: gaudir
    enlarge: engrandir, ampliar
    enlist: allistar
    enrage: enfurir
    enrich: enriquir
    enroll: matricular, inscriure
    ensure: assegurar
    entail: implicar
    entangle: enredar
    enter: entrar
    entertain: entretenir, divertir
    entrust: confiar, encarregar
    envision: imaginar, visualitzar
    envy: envejar
    equip: equipar
    erase: esborrar
    err: errar
    escalate: intensificar
    escape: escapar, fugir
    establish: establir
    estimate: estimar
    evacuate: evacuar
    evade: evadir
    evaluate: avaluar
    evaporate: evaporar
    evoke: evocar
    evolve: evolucionar
    exaggerate: exagerar
    exalt: exaltar
    examine: examinar
    excavate: excavar
    exceed: excedir
    excel: excel·lir
    exchange: intercanviar, canviar
    excite: emocionar, entusiasmar
    exclude: excloure, descartar
    excuse: excusar, disculpar
    execute: executar
    exempt: eximir
    exercise: exercitar
    exert: exercir
    exhale: exhalar
    exhaust: esgotar
    exhibit: exhibir
    exile: exiliar
    exist: existir
    expand: expandir, ampliar
    expect: esperar
    expedite: agilitzar, accelerar
    expel: expulsar
    experience: experimentar
    experiment: experimentar
    expire: caducar, vèncer
    explain: explicar
    explode: explotar
    exploit: explotar
    explore: explorar
    export: exportar
    expose: exposar
    express: expressar
    extend: estendre
    extinguish: extingir, apagar
    extol: enaltir, lloar
    extract: extreure
    fabricate: fabricar, inventar
    face: enfrontar
    facilitate: facilitar
    fade: marcir, descolorir
    fail: fallar, fracassar, suspendre (a test)
    fake: falsificar, fingir
    fall: caure
    fall down: caure
    fan: ventar, airejar
    fascinate: fascinar
    fasten: subjectar, cordar
    fatigue: fatigar
    favor: afavorir
    fear: témer
    feed: alimentar
    feel: sentir
    fence: esgrimir
    ferment: fermentar
    fetch: portar
    fight: lluitar, barallar
    figure out: descobrir, entendre
    file: arxivar
    fill: omplir
    fill in: omplir
    film: filmar
    filter: filtrar
    finance: finançar
    find: trobar
    find out: esbrinar, descobrir
    fine: multar
    finish: acabar, finalitzar
    fire: acomiadar (from a job), disparar (a weapon)
    fish: pescar
    fit: encaixar
    fix: arreglar, reparar
    flap: aletejar
    flare: flamejar
    flash: espurnejar, brillar
    flatter: afalagar
    flavor: condimentar, aromatitzar
    flee: fugir
    fling: llançar
    flip: girar, voltar
    flirt: flirtejar
    float: flotar
    flood: inundar
    flourish: florir, prosperar
    flow: fluir, córrer
    flutter: revolotejar
    fly: volar
    focus: enfocar
    fold: plegar
    follow: seguir
    fool: enganyar
    forbid: prohibir
    force: forçar
    forecast: pronosticar
    foresee: preveure
    forge: forjar, falsificar
    forget: oblidar
    forgive: perdonar
    form: formar
    format: formatar
    formulate: formular
    found: fundar
    fracture: fracturar
    frame: emmarcar
    free: alliberar
    freeze: congelar, gelar
    frighten: espantar, atemorir
    frown: arrufar
    frustrate: frustrar
    fry: fregir
    fuel: alimentar
    fulfill: complir
    function: funcionar
    furnish: moblar
    fuse: fusionar
    gain: guanyar
    gallop: galopar
    gamble: apostar
    gather: reunir, recollir
    generate: generar
    gesture: gesticular
    get: aconseguir (obtain), obtenir, rebre (receive)
    give: donar
    give up: abandonar, renunciar
    glorify: glorificar
    glow: resplendir
    glue: enganxar
    go: anar
    go back: tornar, retornar
    go on: continuar, seguir
    go out: sortir
    gossip: xafardejar
    govern: governar
    grab: agafar
    grade: qualificar
    graduate: graduar
    graft: empeltar
    grant: concedir
    grasp: agafar, comprendre
    grate: ratllar
    graze: pasturar
    greet: saludar
    grieve: lamentar, afligir
    grill: rostir
    grind: triturar
    grip: agafar, subjectar
    groan: gemegar
    grow: créixer, cultivar (crops)
    grow up: créixer
    growl: grunyir
    grunt: grunyir
    guarantee: garantir
    guard: guardar, vigilar
    guess: endevinar, suposar
    guide: guiar
    gulp: empassar
    gush: brollar
    hack: piratejar
    hail: calamarsejar
    halt: aturar
    hammer: martellar
    hamper: obstaculitzar
    hand over: lliurar
    handle: manejar
    hang: penjar
    hang up: penjar
    happen: passar, succeir, ocórrer
    harass: assetjar
    harden: endurir
    harm: danyar
    harmonize: harmonitzar
    harvest: collir
    hate: odiar
    haul: arrossegar, transportar
    have: tenir, haver (auxiliary)
    heal: guarir, sanar
    heap: amuntegar
    hear: sentir
    heat: escalfar
    heighten: intensificar
    help: ajudar
    hesitate: dubtar, vacil·lar
    hide: amagar, ocultar
    highlight: ressaltar, destacar
    hijack: segrestar
    hinder: obstaculitzar, impedir
    hint: insinuar
    hire: contractar
    hit: colpejar, pegar
    hoard: acumular, atresorar
    hold: sostenir, agafar
    hold on: aguantar, esperar
    honor: honrar
    hook: enganxar, penjar
    hop: saltironar
    hope: esperar
    host: allotjar
    hover: planar, flotar
    howl: udolar
    hug: abraçar
    hum: taral·lejar
    humiliate: humiliar
    hunt: caçar
    hurl: llançar
    hurt: ferir (to wound), danyar (to harm)
    hypnotize: hipnotitzar
    identify: identificar
    idolize: idolatrar
    ignore: ignorar
    illuminate: il·luminar
    illustrate: il·lustrar
    imagine: imaginar
    imitate: imitar
    immerse: submergir
    immobilize: immobilitzar
    impeach: acusar
    impede: impedir, obstaculitzar
    implement: implementar
    implore: implorar
    imply: implicar
    import: importar
    impose: imposar
    impress: impressionar
    imprison: empresonar
    improve: millorar
    incite: incitar
    incline: inclinar
    include: incloure, comprendre
    incorporate: incorporar
    increase: augmentar
    incur: incórrer
    indicate: indicar
    induce: induir
    infect: infectar
    infer: inferir
    inflate: inflar
    inflict: infligir
    influence: influir
    inform: informar
    infringe: infringir
    ingest: ingerir
    inhabit: habitar
    inhale: inhalar
    inherit: heretar
    inhibit: inhibir
    initiate: iniciar
    inject: injectar
    injure: ferir, lesionar
    inquire: preguntar, indagar
    insert: inserir, introduir
    insinuate: insinuar
    insist: insistir
    inspect: inspeccionar
    inspire: inspirar
    install: instal·lar
    instruct: instruir
    insult: insultar
    insure: assegurar
    integrate: integrar
    intend: pretendre
    intensify: intensificar
    interact: interactuar
    interest: interessar
    interfere: interferir
    interpret: interpretar
    interrogate: interrogar
    interrupt: interrompre
    intervene: intervenir
    interview: entrevistar
    intimidate: intimidar
    intrigue: intrigar
    introduce: presentar (a person), introduir
    invade: envair
    invent: inventar
    invest: invertir
    invite: convidar
    invoice: facturar
    invoke: invocar
    involve: implicar, involucrar
    iron: planxar
    irritate: irritar
    isolate: aïllar
    issue: emetre
    itch: picar
    jam: encallar, embussar
    jeer: esbroncar
    jingle: dringar
    jog: trotar
    join: unir, ajuntar
    joke: bromejar
    jolt: sacsejar
    journey: viatjar
    judge: jutjar
    jump: saltar
    justify: justificar
    keep: guardar, mantenir
    keep on: seguir, continuar
    kick: xutar
    kidnap: segrestar
    kill: matar
    kindle: encendre, atiar
    kiss: besar
    knead: pastar
    knit: teixir
    knock: colpejar, trucar (at a door)
    knot: nuar
    know: saber (facts, how to), conèixer (people, places)
    label: etiquetar
    lack: faltar, mancar
    lament: lamentar
    land: aterrar
    languish: llanguir
    lash: assotar
    last: durar
    laugh: riure
    launch: llançar, iniciar
    launder: rentar, blanquejar
    lay: posar, col·locar
    lead: dirigir, guiar, liderar
    leak: filtrar, vessar
    lean: inclinar, recolzar
    leap: saltar
    learn: aprendre
    leave: sortir (depart), deixar (leave behind), abandonar
    legislate: legislar
    lend: prestar
    lengthen: allargar
    let: deixar, permetre
    let down: decebre, decepcionar
    level: anivellar
    liberate: alliberar
    lick: llepar
    lie: mentir
    lift: aixecar, elevar
    light: encendre, il·luminar
    lighten: alleugerir
    like: agradar
    limit: limitar
    linger: demorar, persistir
    link: vincular, enllaçar
    liquidate: liquidar
    listen: escoltar
    listen to: escoltar
    live: viure
    load: carregar
    loathe: aborrir
    locate: ubicar, localitzar
    lock: bloquejar
    log: registrar
    long: anhelar
    look: mirar
    look after: cuidar
    look at: mirar
    look for: buscar
    look up: buscar, consultar
    loosen: afluixar
    lose: perdre
    love: estimar, amar
    lower: baixar
    lull: bressolar
    lurk: aguaitar
    magnify: ampliar, magnificar
    maim: mutilar
    maintain: mantenir
    make: fer, fabricar
    make up: inventar
    malfunction: fallar
    manage: gestionar, administrar, manejar
    mangle: destrossar
    manipulate: manipular
    manufacture: fabricar
    map: cartografiar
    march: marxar
    marinate: marinar
    mark: marcar
    market: comercialitzar
    marvel: meravellar
    mash: aixafar
    mask: emmascarar
    massage: massatjar
    master: dominar
    match: igualar, aparellar
    materialize: materialitzar
    matter: importar
    maximize: maximitzar
    mean: significar
    measure: mesurar
    mediate: mediar
    meet: conèixer (for the first time), trobar (run into)
    melt: fondre, desfer
    memorize: memoritzar
    mend: remendar, reparar
    mention: mencionar
    meow: miolar
    merge: fusionar
    merit: merèixer
    migrate: migrar
    mimic: imitar
    minimize: minimitzar
    mislead: enganyar
    misplace: extraviar
    miss: enyorar (feel the absence of), perdre (a bus, a chance)
    mistake: confondre, equivocar
    mix: barrejar
    mobilize: mobilitzar
    mock: ridiculitzar
    modify: modificar
    moisten: humitejar
    mold: modelar
    monitor: monitoritzar
    mortgage: hipotecar
    motivate: motivar
    mount: muntar
    move: moure, traslladar
    muffle: apagar, amortir
    multiply: multiplicar
    mumble: murmurar, remugar
    munch: mastegar
    murder: assassinar
    murmur: murmurar
    muse: reflexionar
    must: deure (obligation)
    mutter: murmurar, mussitar
    nag: molestar, renyar
    nail: clavar
    name: nomenar
    narrow: reduir, limitar
    navigate: navegar
    need: necessitar
    neglect: descuidar
    negotiate: negociar
    nest: niar
    neutralize: neutralitzar
    nibble: rosegar
    nod: assentir
    nominate: nominar
    notice: notar, advertir
    notify: notificar
    nourish: nodrir
    nudge: empentar
    numb: adormir
    obey: obeir
    object: objectar
    oblige: obligar
    obscure: enfosquir, ocultar
    observe: observar
    obsess: obsessionar
    obstruct: obstruir
    obtain: obtenir
    occupy: ocupar
    occur: ocórrer
    offend: agreujar, molestar
    offer: oferir
    offset: compensar
    omit: ometre
    ooze: rajar
    open: obrir
    operate: operar
    oppose: oposar
    oppress: oprimir
    optimize: optimitzar
    orchestrate: orquestrar
    order: ordenar (arrange, command), demanar (a meal)
    organize: organitzar
    orient: orientar
    oust: destituir, expulsar
    outdo: superar
    outline: esbossar
    outperform: superar
    overcome: superar
    overdo: exagerar
    overflow: desbordar
    overhear: sentir
    overlap: superposar, solapar
    overpower: dominar
    override: anul·lar
    overrule: anul·lar
    oversee: supervisar
    overtake: avançar
    overthrow: enderrocar
    overturn: bolcar
    overwhelm: aclaparar
    overwrite: sobreescriure
    owe: deure
    own: posseir
    pacify: pacificar
    pack: empaquetar
    paddle: remar
    paint: pintar
    parade: desfilar
    paralyze: paralitzar
    paraphrase: parafrasejar
    park: estacionar, aparcar
    parody: parodiar
    partake: participar
    participate: participar
    pass: passar
    paste: enganxar
    pat: acariciar
    patch: apedaçar, remendar
    patrol: patrullar
    pause: pausar
    pave: pavimentar
    pawn: empenyorar
    pay: pagar
    pay back: tornar, reemborsar
    pedal: pedalar
    peek: espiar
    peel: pelar
    penalize: penalitzar
    perceive: percebre
    perch: posar
    perfect: perfeccionar
    perform: realitzar, actuar
    perish: perir
    permit: permetre
    perpetuate: perpetuar
    persevere: perseverar
    persist: persistir
    persuade: persuadir
    pester: molestar, importunar
    phone: trucar
    photograph: fotografiar
    pick: escollir, recollir (pick up)
    pick out: escollir, triar
    pick up: recollir
    pierce: perforar, travessar
    pile up: amuntegar
    pilot: pilotar
    pin: subjectar, clavar
    pinch: pessigar
    pinpoint: precisar
    pitch: llançar
    pity: compadir
    place: col·locar
    plague: plagar, turmentar
    plan: planejar, planificar
    plant: plantar
    plaster: arrebossar
    play: jugar (games, sports), tocar (an instrument)
    plead: suplicar, al·legar
    please: agradar, satisfer
    pledge: prometre, jurar
    plot: tramar
    plow: arar
    pluck: arrencar
    plug: endollar
    plunder: saquejar
    plunge: submergir, capbussar
    point: assenyalar, apuntar
    point out: assenyalar
    poison: enverinar
    poke: punxar
    polish: polir
    pollute: contaminar
    ponder: reflexionar
    pop: rebentar
    populate: poblar
    portray: retratar, representar
    pose: posar
    position: col·locar, posicionar
    possess: posseir
    post: publicar
    postpone: ajornar, posposar
    pound: colpejar
    pour: abocar, servir
    practice: practicar
    praise: lloar, elogiar
    pray: pregar, resar
    preach: predicar
    precede: precedir
    predict: predir
    prefer: preferir
    preheat: preescalfar
    preoccupy: preocupar
    prepare: preparar
    prescribe: prescriure
    present: presentar
    preserve: conservar, preservar
    preside: presidir
    press: pressionar, apretar
    presume: presumir, suposar
    pretend: fingir
    prevail: predominar
    prevent: prevenir, impedir
    prick: punxar
    print: imprimir
    probe: sondejar, investigar
    proceed: procedir
    process: processar
    proclaim: proclamar
    produce: produir
    profess: professar
    program: programar
    progress: progressar
    prohibit: prohibir
    project: projectar
    prolong: prolongar
    promise: prometre
    promote: promoure
    prompt: incitar
    pronounce: pronunciar
    propagate: propagar
    propel: impulsar
    propose: proposar
    prosecute: processar, enjudiciar
    prosper: prosperar
    protect: protegir
    protest: protestar
    protrude: sobresortir
    prove: provar, demostrar
    provide: proporcionar, proveir
    provoke: provocar
    prune: podar
    pry: xafardejar
    publish: publicar
    pull: estirar, tibar
    pulse: bategar
    pump: bombar
    punch: colpejar
    punctuate: puntuar
    puncture: punxar, perforar
    punish: castigar
    purchase: adquirir, comprar
    purge: purgar
    purify: purificar
    pursue: perseguir
    push: empentar
    put: posar
    put off: ajornar, posposar
    puzzle: desconcertar
    quake: tremolar
    qualify: qualificar
    quarrel: barallar, discutir
    quench: apagar, assadollar
    query: consultar
    question: qüestionar
    quit: deixar, renunciar
    quiver: tremolar
    quote: citar
    race: córrer, competir
    radiate: irradiar
    raid: assaltar
    rain: ploure
    raise: aixecar, criar (children)
    rally: reunir, mobilitzar
    ram: xocar
    ramble: divagar
    rank: classificar
    rant: rondinar, vociferar
    rate: qualificar
    rationalize: racionalitzar
    rattle: trontollar
    reach: assolir, arribar
    react: reaccionar
    read: llegir
    reap: collir, segar
    rear: criar
    reason: raonar
    reassure: tranquil·litzar
    rebuild: reconstruir
    rebuke: renyar, reprendre
    recall: recordar
    recede: retrocedir, retirar
    receive: rebre
    recharge: recarregar
    reciprocate: correspondre
    recite: recitar
    reckon: calcular
    reclaim: reclamar, recuperar
    recline: reclinar
    recognize: reconèixer
    recoil: retrocedir
    recommend: recomanar
    reconcile: reconciliar
    reconsider: reconsiderar
    record: gravar
    recount: relatar, explicar
    recover: recuperar
    recreate: recrear
    recruit: reclutar
    rectify: rectificar
    recycle: reciclar
    redeem: redimir
    redirect: redirigir
    redo: refer
    reduce: reduir
    refer: referir
    refine: refinar
    reflect: reflectir
    reform: reformar
    refrain: evitar
    refresh: refrescar
    refrigerate: refrigerar
    refund: reemborsar
    refuse: rebutjar, negar
    regain: recobrar
    regard: considerar
    regenerate: regenerar
    register: registrar
    regret: lamentar
    regulate: regular
    rehearse: assajar
    reign: regnar
    reinforce: reforçar
    reiterate: reiterar
    reject: rebutjar
    rekindle: reavivar
    relapse: reincidir
    relate: relacionar
    relax: relaxar
    relay: retransmetre, transmetre
    release: alliberar, soltar
    relegate: relegar
    relent: cedir
    relieve: alleugerir, alleujar
    relish: assaborir, gaudir
    reload: recarregar
    rely: confiar
    remain: quedar
    remark: comentar, observar
    remedy: remeiar
    remember: recordar
    remind: recordar
    remit: remetre
    remodel: remodelar
    remove: treure, eliminar
    rename: reanomenar
    renew: renovar
    renounce: renunciar
    renovate: renovar, reformar
    rent: llogar
    repair: reparar
    repay: reemborsar, tornar
    repeal: derogar
    repeat: repetir
    repel: repel·lir
    replace: reemplaçar, substituir
    replenish: reabastir
    reply: respondre, contestar
    report: informar
    represent: representar
    repress: reprimir
    reprimand: renyar, reprendre
    reproach: retreure
    reproduce: reproduir
    request: sol·licitar, demanar
    require: requerir, exigir
    reschedule: reprogramar
    rescind: rescindir
    rescue: rescatar
    research: investigar
    reserve: reservar
    reshape: remodelar
    reside: residir
    resign: renunciar, dimitir
    resist: resistir
    resolve: solucionar
    resort: recórrer
    respect: respectar
    respond: respondre
    rest: descansar
    restart: reiniciar
    restore: restaurar
    restrain: contenir
    restrict: restringir
    result: resultar
    resume: reprendre, reiniciar
    resurrect: ressuscitar
    retain: retenir
    retreat: retrocedir
    retrieve: recuperar
    return: tornar, retornar (give back)
    reunite: reunir
    reveal: revelar
    reverse: invertir
    revert: revertir
    review: repassar, revisar
    revise: revisar
    revive: reviure
    revoke: revocar
    revolutionize: revolucionar
    reward: recompensar
    rhyme: rimar
    ride: muntar, cavalcar
    ring: sonar
    rinse: esbandir
    rip: esquinçar
    ripple: ondular
    rise: pujar, aixecar
    risk: arriscar
    rival: rivalitzar
    roam: vagar, deambular
    roar: rugir
    roast: rostir
    rob: robar
    roll: rodolar
    rotate: rotar
    rouse: despertar
    route: encaminar
    row: remar
    rub: fregar
    ruin: arruïnar
    rule: governar, regnar
    rumble: ressonar
    rummage: furgar
    run: córrer
    run away: fugir, escapar
    rupture: trencar, rompre
    rush: apressar
    rust: oxidar
    rustle: murmurar
    sabotage: sabotejar
    sacrifice: sacrificar
    sadden: entristir
    safeguard: salvaguardar
    sail: navegar
    salute: saludar
    salvage: rescatar
    sanction: sancionar
    sanitize: desinfectar
    sap: afeblir, debilitar
    satisfy: satisfer
    saturate: saturar
    save: estalviar (money), salvar (rescue), guardar (keep)
    savor: assaborir
    saw: serrar
    say: dir
    scale: escalar
    scan: escanejar
    scandalize: escandalitzar
    scar: cicatritzar
    scare: espantar, esglaiar
    scatter: escampar
    schedule: programar
    scheme: maquinar
    scold: renyar, reprendre
    scoop: collir, treure
    scorch: socarrimar
    score: marcar
    scorn: menysprear
    scour: fregar
    scout: explorar
    scrape: rascar
    scratch: gratar, esgarrapar
    scream: cridar, xisclar
    screw: cargolar
    scribble: gargotejar
    scroll: desplaçar
    scrub: fregar, gratar
    scrutinize: escrutar
    sculpt: esculpir
    seal: segellar
    search: buscar
    season: condimentar
    secure: assegurar
    sedate: sedar
    seduce: seduir
    see: veure
    seek: buscar
    seem: semblar
    segment: segmentar
    segregate: segregar
    select: seleccionar
    sell: vendre
    send: enviar, trametre
    send back: tornar, retornar
    sentence: sentenciar
    separate: separar
    serve: servir
    set: posar, col·locar
    set off: partir, sortir
    set up: configurar, establir
    settle: solucionar, establir
    sever: tallar, separar
    sew: cosir
    shackle: encadenar
    shade: ombrejar
    shake: sacsejar, agitar
    shampoo: rentar
    shape: modelar
    share: compartir
    shatter: destrossar, trencar
    shave: afaitar
    shear: esquilar
    shed: vessar, perdre
    shelter: refugiar
    shift: canviar, moure
    shimmer: relluir, brillar
    shine: brillar
    shiver: tremolar, esgarrifar
    shock: impactar, commocionar
    shoo: espantar
    shoot: disparar
    shorten: escurçar
    should: deure (advice, obligation)
    shout: cridar
    shove: empentar
    shovel: espalar
    show: mostrar, ensenyar
    show off: presumir
    show up: aparèixer
    shred: triturar, esmicolar
    shrink: encongir
    shudder: esgarrifar, estremir
    shuffle: barrejar
    shun: evitar
    shut: tancar
    sidestep: esquivar
    siege: assetjar
    sift: garbellar, tamisar
    sigh: sospirar
    sign: signar, firmar
    signal: assenyalar, senyalar
    silence: silenciar
    simplify: simplificar
    simulate: simular
    sing: cantar
    singe: socarrimar
    sink: enfonsar
    sip: xarrupar
    skate: patinar
    sketch: esbossar
    skewer: enfilar
    ski: esquiar
    skim: fullejar, desnatar
    skip: saltar
    slam: colpejar
    slander: calumniar
    slap: bufetejar
    slash: tallar, esquinçar
    sleep: dormir
    slice: llescar
    slide: lliscar
    slip: relliscar
    slither: reptar
    slow: alentir, retardar
    smash: aixafar
    smear: untar, tacar
    smell: olorar, flairar
    smile: somriure
    smoke: fumar
    smooth: allisar
    smother: sufocar
    smuggle: contrabandejar
    snap: trencar, petar
    snarl: grunyir
    snatch: arrabassar
    sneeze: esternudar
    sniff: ensumar, olorar
    snooze: dormisquejar
    snore: roncar
    snow: nevar
    soak: amarar, remullar
    sob: sanglotar
    socialize: socialitzar
    soften: suavitzar
    solicit: sol·licitar
    solidify: solidificar
    solve: solucionar
    soothe: calmar
    sort: ordenar, classificar
    sound: sonar
    sow: sembrar
    sparkle: espurnejar, centellejar
    spawn: engendrar
    speak: parlar
    specify: especificar
    speculate: especular
    speed: accelerar
    spell: lletrejar
    spend: gastar (money), passar (time)
    spill: vessar
    spin: girar
    spit: escopir
    splash: esquitxar
    splinter: estellar
    split: dividir, partir
    spoil: espatllar
    sponsor: patrocinar
    spot: albirar, detectar
    sprain: luxar
    spray: ruixar
    spread: estendre, difondre
    sprinkle: ruixar, empolvorar
    spur: esperonar, incentivar
    squander: malgastar, balafiar
    squeal: xisclar
    squeeze: premsar, apretar
    squint: entornar
    stab: apunyalar
    stabilize: estabilitzar
    stagger: trontollar, escalonar
    stain: tacar, embrutar
    stall: calar
    stamp: segellar, estampar
    start: començar, iniciar
    startle: sobresaltar
    stash: amagar, guardar
    state: afirmar, declarar
    stay: quedar
    steady: estabilitzar
    steal: robar
    steer: dirigir, guiar
    sterilize: esterilitzar
    stew: estofar
    stick: enganxar, pegar
    stifle: sufocar, reprimir
    stigmatize: estigmatitzar
    stimulate: estimular
    sting: picar
    stink: empudegar
    stipulate: estipular
    stir: remenar
    stitch: cosir
    stop: parar, aturar
    store: emmagatzemar
    storm: assaltar
    straighten: redreçar
    strain: colar, forçar
    strangle: estrangular
    strap: lligar
    stray: desviar, extraviar
    strengthen: enfortir, reforçar
    stress: emfatitzar, estressar
    stretch: estirar
    strew: escampar, esparpallar
    string: enfilar
    strip: despullar
    stroke: acariciar
    stroll: passejar
    struggle: lluitar
    strum: rasguejar
    study: estudiar
    stuff: farcir, omplir
    stumble: ensopegar
    stun: atordir
    subdue: sotmetre
    submit: presentar, sotmetre
    subscribe: subscriure
    subsidize: subvencionar
    substitute: substituir
    subtract: restar
    succeed: triomfar
    succumb: sucumbir
    suck: xuclar
    sue: demandar
    suffer: patir, sofrir
    suffocate: asfixiar, sufocar
    suggest: suggerir
    suit: convenir
    sum: sumar
    summarize: resumir
    summon: convocar
    supersede: reemplaçar
    supervise: supervisar
    supplement: complementar
    supply: subministrar, proveir
    support: secundar, recolzar
    suppose: suposar
    suppress: suprimir, reprimir
    surf: surfejar
    surge: sorgir
    surmise: conjecturar
    surpass: superar
    surprise: sorprendre
    surrender: lliurar, capitular
    surround: envoltar, rodejar
    survey: enquestar, inspeccionar
    survive: sobreviure
    suspect: sospitar
    suspend: suspendre
    sustain: sostenir, mantenir
    swallow: empassar
    swap: intercanviar
    sway: balancejar
    swear: jurar
    sweat: suar
    sweep: escombrar
    sweeten: endolcir
    swell: inflar, inflamar
    swim: nedar
    swindle: estafar
    swing: gronxar
    swipe: lliscar
    switch: canviar
    symbolize: simbolitzar
    sympathize: compadir
    sync: sincronitzar
    synchronize: sincronitzar
    synthesize: sintetitzar
    tack: clavar
    tackle: abordar
    tag: etiquetar
    tailor: adaptar, confeccionar
    taint: contaminar, tacar
    take: agafar, portar (take along)
    take care of: cuidar
    take off: treure (clothes), enlairar (a plane)
    take part: participar
    talk: parlar, xerrar
    tally: comptabilitzar
    tame: domar
    tamper: manipular
    tan: bronzejar
    tangle: embolicar, enredar
    tap: tocar
    tape: gravar
    taper: afilar
    target: apuntar
    tarnish: entelar
    taste: tastar, provar
    tattoo: tatuar
    taunt: provocar, mofar
    tax: gravar
    teach: ensenyar
    tear: estripar, esquinçar
    tear down: enderrocar, derrocar
    tease: molestar, bromejar
    telephone: telefonar
    tell: dir, explicar (a story)
    tell off: renyar, reprendre
    tempt: temptar
    tend: tendir
    tenderize: estovar
    terminate: acabar, cessar
    terrify: aterrir
    test: provar, examinar
    testify: testificar, declarar
    tether: lligar
    thank: agrair
    thaw: descongelar
    thicken: espessir
    thin: aprimar
    think: pensar (ponder), creure (believe)
    think about: pensar
    thread: enfilar
    threaten: amenaçar
    thrill: emocionar
    thrive: prosperar
    throb: bategar
    throttle: estrangular
    throw: llançar, tirar
    throw away: llençar, tirar
    thrust: empentar, clavar
    thump: colpejar
    thunder: tronar
    thwart: frustrar
    tick: marcar
    tidy: endreçar, ordenar
    tie: lligar
    tighten: apretar
    tilt: inclinar
    time: cronometrar
    tingle: formiguejar
    tint: tenyir, acolorir
    tip: inclinar
    tire: cansar
    title: titular
    toast: torrar
    toggle: alternar
    tolerate: tolerar
    tone: tonificar
    top: superar, coronar
    topple: enderrocar
    torment: turmentar
    torture: torturar
    toss: llançar
    touch: tocar
    tour: recórrer
    tow: remolcar
    trace: traçar
    track: rastrejar
    trade: comerciar
    train: entrenar
    trample: trepitjar
    transcend: transcendir
    transcribe: transcriure
    transfer: transferir
    transform: transformar
    translate: traduir
    transmit: transmetre
    transpire: transpirar
    transplant: trasplantar
    transport: transportar
    trap: atrapar
    travel: viatjar
    traverse: travessar, recórrer
    tread: trepitjar
    treasure: atresorar
    treat: tractar
    tremble: tremolar
    trick: enganyar
    trickle: degotar
    trigger: desencadenar, activar
    trim: retallar
    trip: ensopegar
    triple: triplicar
    trivialize: trivialitzar
    trot: trotar
    trouble: molestar, pertorbar
    truncate: truncar
    trust: confiar
    try: intentar, provar (try out)
    try on: provar
    tuck: ficar
    tumble: caure, desplomar
    tune: afinar
    tunnel: excavar
    turn: girar, tombar
    turn around: girar
    turn down: rebutjar, abaixar (volume)
    turn into: convertir
    turn off: apagar
    turn on: encendre
    turn up: pujar
    tweet: tuitejar
    twinkle: titil·lar, centellejar
    twirl: giravoltar
    type: teclejar
    umpire: arbitrar
    unbutton: desbotonar
    uncover: descobrir
    underestimate: subestimar
    undergo: experimentar, sofrir
    underline: subratllar
    undermine: minar, socavar
    underpin: sustentar
    understand: entendre, comprendre
    understate: minimitzar
    undertake: emprendre
    underwrite: subscriure
    undo: desfer
    undress: despullar
    unearth: desenterrar
    unfasten: deslligar, descordar
    unfold: desplegar
    unfurl: desplegar, desenrotllar
    unhook: desenganxar
    unify: unificar
    uninstall: desinstal·lar
    unite: unir
    unleash: deslligar, desencadenar
    unload: descarregar
    unmask: desemmascarar
    unpack: desempaquetar
    unplug: desendollar
    unravel: desembullar, desentranyar
    unroll: desenrotllar
    unscrew: descargolar
    unsettle: pertorbar, inquietar
    untie: deslligar
    unveil: desvelar, inaugurar
    unwrap: desembolicar
    unzip: descomprimir
    update: actualitzar
    upgrade: millorar, actualitzar
    uphold: sostenir
    uplift: elevar
    upload: pujar
    uproot: desarrelar
    upset: molestar, trasbalsar
    urge: instar
    use: usar, utilitzar
    usher: acompanyar, guiar
    usurp: usurpar
    utilize: utilitzar
    utter: pronunciar, emetre
    vaccinate: vacunar
    vacuum: aspirar
    validate: validar
    value: valorar
    vandalize: vandalitzar
    vanish: desaparèixer
    vaporize: vaporitzar
    varnish: envernissar
    vary: variar
    veer: desviar
    vent: desfogar
    ventilate: ventilar
    venture: aventurar, arriscar
    verify: verificar
    veto: vetar
    vex: molestar
    vibrate: vibrar
    victimize: victimitzar
    videotape: gravar
    vie: competir
    view: veure, observar
    vilify: difamar
    vindicate: vindicar
    violate: violar
    visit: visitar
    visualize: visualitzar
    vocalize: vocalitzar
    void: anul·lar
    vomit: vomitar
    vote: votar
    vouch: avalar
    vow: jurar, prometre
    voyage: viatjar
    wade: vadejar
    wag: bellugar, moure
    wail: gemegar, lamentar
    wait: esperar
    wait for: esperar
    wait on: atendre, servir
    waive: renunciar
    wake: despertar
    wake up: despertar
    walk: caminar, passejar
    wall: emmurallar
    waltz: valsar
    wander: vagar
    wane: minvar
    want: voler, desitjar
    ward off: evitar, repel·lir
    warm: escalfar
    warm up: escalfar
    warn: advertir, avisar
    warp: deformar
    warrant: justificar
    wash: rentar
    waste: malgastar, desaprofitar
    watch: mirar (look at), vigilar (keep watch), veure (TV, movies)
    water: regar
    wave: saludar
    waver: vacil·lar
    weaken: debilitar
    wean: deslletar
    wear: portar, vestir
    weave: teixir
    wed: casar
    weep: plorar
    weigh: pesar
    weigh down: afeixugar
    welcome: acollir
    weld: soldar
    whack: colpejar
    whip: fuetejar
    whisper: xiuxiuejar
    whistle: xiular
    whiten: blanquejar
    whittle: tallar
    widen: eixamplar
    wield: manejar, esgrimir
    wiggle: bellugar, moure
    win: guanyar
    win over: convèncer
    wind: enrotllar, serpentejar
    wink: parpellejar
    wipe: netejar, eixugar
    wish: desitjar
    withdraw: retirar
    wither: marcir
    withstand: resistir
    witness: presenciar
    wobble: trontollar
    word: redactar, formular
    work: treballar, funcionar (machines)
    work out: solucionar, entrenar
    worry: preocupar
    worsen: empitjorar
    worship: adorar
    wound: ferir
    wrap: embolicar, envoltar
    wreck: destruir
    wrench: arrencar
    wrestle: lluitar
    wring: escórrer
    write: escriure
    write down: anotar, apuntar
    write off: cancel·lar
    x-ray: radiografiar
    yank: estirar, tibar
    yawn: badallar
    yearn: anhelar
    yell: cridar
    yelp: xisclar
    yield: cedir, produir
    yoke: enjovar
    zap: eliminar
    zip: comprimir
    zone: zonificar
    zoom: apropar, ampliar
  `;

  // "know: saber (facts), conèixer (people)" -> { know: [{ ca, note }, ...] }
  const VERBS = parseTable(TABLE, plainEntry('ca'));

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
