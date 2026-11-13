/*
 * English -> Spanish verb database.
 *
 * One line per English verb: `english: spanish, spanish (usage note)`.
 * The first Spanish verb is the default translation. To add a verb, add a
 * line here; conjugate.js works out the conjugation from the infinitive.
 * Reflexive verbs (-se) are not supported, so those are left out.
 */
(function (global) {
  'use strict';

  const { parseTable, plainEntry } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: abandonar
    abort: abortar
    absorb: absorber
    abuse: abusar
    accelerate: acelerar
    accept: aceptar
    accompany: acompañar
    accomplish: realizar, lograr
    accumulate: acumular
    accuse: acusar
    achieve: lograr, alcanzar
    acknowledge: reconocer
    acquire: adquirir
    acquit: absolver
    act: actuar
    adapt: adaptar
    add: añadir, agregar, sumar (in math)
    adhere: adherir
    adjust: ajustar
    administer: administrar
    admire: admirar
    admit: admitir
    adopt: adoptar
    adore: adorar
    advance: avanzar
    advertise: anunciar
    advise: aconsejar
    advocate: abogar
    affect: afectar
    age: envejecer
    agitate: agitar
    agree: acordar (agree on), convenir
    aim: apuntar
    alert: alertar
    align: alinear
    allocate: asignar, repartir
    allow: permitir, dejar
    alter: alterar
    amaze: asombrar
    amend: enmendar, modificar
    amuse: divertir, entretener
    analyze: analizar
    anger: enojar, enfurecer
    announce: anunciar
    annoy: molestar, fastidiar
    answer: responder, contestar
    anticipate: anticipar
    appeal: apelar
    appear: aparecer
    applaud: aplaudir
    apply: aplicar, solicitar (apply for)
    appoint: nombrar
    appreciate: apreciar, agradecer (be grateful for)
    approach: abordar
    approve: aprobar
    argue: discutir, argumentar
    arise: surgir
    arrange: arreglar, organizar
    arrest: arrestar, detener
    arrive: llegar
    articulate: articular
    ascend: ascender
    ask: preguntar (a question), pedir (for something)
    ask for: pedir
    aspire: aspirar
    assemble: ensamblar, montar
    assert: afirmar
    assess: evaluar
    assign: asignar
    assimilate: asimilar
    assist: ayudar
    associate: asociar
    assume: suponer, asumir
    assure: asegurar
    astonish: asombrar
    attach: adjuntar
    attack: atacar
    attain: alcanzar, lograr
    attempt: intentar
    attend: asistir (an event), atender (take care of)
    attract: atraer
    attribute: atribuir
    audit: auditar
    authorize: autorizar
    avoid: evitar
    award: otorgar
    back up: respaldar
    bake: hornear
    balance: equilibrar
    ban: prohibir
    bandage: vendar
    bang: golpear
    baptize: bautizar
    bargain: regatear
    bark: ladrar
    base: basar
    bathe: bañar
    battle: luchar
    be: ser (identity, traits), estar (state, location)
    bear: soportar, aguantar
    beat: vencer, golpear, batir
    beautify: embellecer
    beg: rogar, suplicar
    begin: empezar, comenzar, iniciar
    belch: eructar
    believe: creer
    belong: pertenecer
    bend: doblar
    bet: apostar
    bid: pujar
    bill: facturar
    bind: atar
    bite: morder
    blackmail: chantajear
    blame: culpar
    bleach: blanquear
    bleed: sangrar
    blend: mezclar
    bless: bendecir
    blink: parpadear
    block: bloquear
    bloom: florecer
    blossom: florecer
    blow: soplar
    blur: difuminar
    board: abordar
    boast: presumir
    boil: hervir
    bond: unir, vincular
    book: reservar
    boost: impulsar
    bore: aburrir
    bother: molestar
    bounce: rebotar
    bow: inclinar
    boycott: boicotear
    brag: alardear
    brake: frenar
    break: romper, quebrar
    breathe: respirar
    brew: elaborar
    bribe: sobornar
    bring: traer (bring here), llevar (take there)
    bring up: criar (children), mencionar (a topic)
    broadcast: transmitir
    broaden: ampliar
    browse: navegar
    bruise: magullar
    brush: cepillar
    bubble: burbujear, bullir
    buckle: abrochar
    build: construir
    bully: intimidar
    burden: cargar
    burn: quemar, arder
    burst: reventar
    bury: enterrar
    buy: comprar
    buzz: zumbar
    cage: enjaular
    calculate: calcular
    call: llamar
    calm: calmar, tranquilizar
    camp: acampar
    can: poder (be able to)
    cancel: cancelar
    capture: capturar
    care: cuidar
    caress: acariciar
    carry: llevar, cargar
    carry out: realizar
    carve: tallar
    cash: cobrar
    cast: lanzar
    catch: atrapar, coger
    categorize: clasificar
    cause: causar
    cease: cesar
    celebrate: celebrar
    chain: encadenar
    challenge: desafiar
    change: cambiar
    chant: cantar, corear
    charge: cobrar
    charm: encantar
    chase: perseguir
    chat: charlar, conversar
    chatter: parlotear
    cheat: engañar
    check: revisar, comprobar
    cheer: animar
    cherish: apreciar, atesorar
    chew: masticar
    chill: enfriar
    choke: ahogar, asfixiar
    choose: elegir, escoger
    chop: picar, cortar
    circle: rodear
    circulate: circular
    cite: citar
    claim: reclamar, afirmar
    clap: aplaudir
    clarify: aclarar
    clash: chocar
    clasp: agarrar
    classify: clasificar
    clean: limpiar
    clean up: limpiar, ordenar
    cleanse: limpiar, purificar
    clear: despejar, aclarar
    clench: apretar
    click: clicar
    climb: subir, escalar, trepar
    clip: recortar
    clog: atascar, obstruir
    clone: clonar
    close: cerrar
    clutch: agarrar
    coach: entrenar
    coax: persuadir
    code: programar, codificar
    coincide: coincidir
    collaborate: colaborar
    collapse: colapsar, derrumbar
    collect: coleccionar, recoger
    collide: colisionar, chocar
    color: colorear
    comb: peinar
    combat: combatir
    combine: combinar
    come: venir
    come back: volver, regresar
    come in: entrar
    comfort: consolar
    command: ordenar, mandar
    commemorate: conmemorar
    comment: comentar
    commit: cometer
    communicate: comunicar
    compare: comparar
    compensate: compensar
    compete: competir
    compile: compilar
    complete: completar
    complicate: complicar
    compliment: elogiar, halagar
    comply: cumplir
    compose: componer
    comprise: comprender
    compute: calcular, computar
    conceal: ocultar
    concede: conceder
    conceive: concebir
    conclude: concluir
    condemn: condenar
    conduct: conducir
    confess: confesar
    configure: configurar
    confirm: confirmar
    confront: enfrentar
    confuse: confundir
    congratulate: felicitar
    connect: conectar
    conquer: conquistar
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
    contain: contener
    contemplate: contemplar
    contend: contender
    continue: continuar, seguir
    contradict: contradecir
    contrast: contrastar
    contribute: contribuir
    control: controlar
    converge: converger
    convert: convertir
    convey: transmitir, expresar
    convince: convencer
    cook: cocinar
    cool: enfriar
    cooperate: cooperar
    coordinate: coordinar
    cope: afrontar
    copy: copiar
    correct: corregir
    correspond: corresponder
    corrupt: corromper
    cost: costar
    cough: toser
    counsel: aconsejar
    count: contar
    counterfeit: falsificar
    court: cortejar
    cover: cubrir
    crack: agrietar
    crash: chocar
    crave: anhelar
    crawl: gatear, arrastrar
    create: crear
    credit: acreditar
    criticize: criticar
    cross: cruzar, atravesar
    crush: aplastar
    cry: llorar (weep), gritar (shout)
    cultivate: cultivar
    cure: curar
    curl: rizar
    curse: maldecir
    cushion: amortiguar
    customize: personalizar
    cut: cortar
    cut off: cortar
    damage: dañar
    dance: bailar
    dare: osar
    darken: oscurecer
    darn: zurcir
    dash: correr, precipitar
    dazzle: deslumbrar
    deal: tratar (deal with)
    debate: debatir
    debug: depurar
    decay: descomponer, deteriorar
    deceive: engañar
    decide: decidir
    decipher: descifrar
    declare: declarar
    decline: declinar, rechazar
    decorate: decorar
    decrease: disminuir
    decrypt: descifrar
    dedicate: dedicar
    deduct: deducir
    deem: considerar
    defeat: derrotar
    defend: defender
    defer: aplazar, diferir
    define: definir
    deflect: desviar
    degrade: degradar
    delay: retrasar, demorar
    delegate: delegar
    delete: borrar, eliminar
    deliberate: deliberar
    delight: encantar
    deliver: entregar, repartir
    demand: exigir
    demolish: demoler
    demonstrate: demostrar
    denote: denotar
    denounce: denunciar
    deny: negar
    depend: depender
    deploy: desplegar
    deport: deportar
    deposit: depositar
    deprive: privar
    derive: derivar
    descend: descender
    describe: describir
    deserve: merecer
    design: diseñar
    designate: designar
    desire: desear
    despise: despreciar
    destroy: destruir
    detect: detectar
    deteriorate: deteriorar
    determine: determinar
    detest: detestar
    devastate: devastar
    develop: desarrollar
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
    dine: cenar
    direct: dirigir
    disable: deshabilitar, inutilizar
    disagree: discrepar
    disappear: desaparecer
    disappoint: decepcionar
    disarm: desarmar
    discard: descartar
    discharge: descargar
    disclose: revelar, divulgar
    disconnect: desconectar
    discourage: desanimar
    discover: descubrir
    discredit: desacreditar
    discuss: discutir
    disguise: disfrazar
    disgust: asquear, repugnar
    disinfect: desinfectar
    dismantle: desmontar
    dismiss: despedir, descartar
    dispatch: despachar
    dispense: dispensar
    disperse: dispersar
    displace: desplazar
    display: exhibir, mostrar
    disprove: refutar
    dispute: disputar
    distinguish: distinguir
    distort: distorsionar
    distract: distraer
    distribute: distribuir
    disturb: molestar, perturbar
    dive: bucear
    diversify: diversificar
    divide: dividir
    divorce: divorciar
    do: hacer
    document: documentar
    dodge: esquivar
    dominate: dominar
    donate: donar
    double: duplicar
    doubt: dudar
    download: descargar
    draft: redactar
    drag: arrastrar
    drain: drenar
    draw: dibujar
    dread: temer
    dream: soñar
    dress: vestir
    dribble: driblar
    drift: derivar
    drill: perforar
    drink: beber, tomar
    drip: gotear
    drive: conducir, manejar
    drizzle: lloviznar
    drop: soltar
    drown: ahogar
    dry: secar
    dump: tirar, verter
    duplicate: duplicar
    dwell: habitar
    dye: teñir
    earn: ganar
    ease: aliviar, facilitar
    eat: comer
    echo: resonar
    edit: editar
    educate: educar
    elaborate: elaborar
    elapse: transcurrir
    elect: elegir
    elevate: elevar
    eliminate: eliminar
    elude: eludir
    email: enviar
    embark: embarcar
    embed: incrustar
    embrace: abrazar
    embroider: bordar
    emerge: surgir
    emit: emitir
    emphasize: enfatizar, destacar
    employ: emplear
    empower: empoderar
    empty: vaciar
    enable: permitir, habilitar
    enact: promulgar
    enchant: encantar
    encircle: rodear, ceñir
    encounter: encontrar
    encourage: animar, alentar
    encrypt: cifrar
    end: terminar, acabar
    endorse: respaldar, avalar
    endure: soportar, aguantar
    energize: energizar
    enforce: aplicar
    engage: involucrar, contratar (hire)
    engrave: grabar
    enhance: mejorar
    enjoy: disfrutar
    enlarge: agrandar
    enlist: alistar
    enrage: enfurecer
    enrich: enriquecer
    enroll: matricular, inscribir
    ensure: asegurar
    entail: implicar
    entangle: enredar
    enter: entrar
    entertain: entretener, divertir
    entrust: confiar, encargar
    envision: imaginar, visualizar
    envy: envidiar
    equip: equipar
    erase: borrar
    err: errar
    escalate: intensificar
    escape: escapar, huir
    establish: establecer
    estimate: estimar
    evacuate: evacuar
    evade: evadir
    evaluate: evaluar
    evaporate: evaporar
    evoke: evocar
    evolve: evolucionar
    exaggerate: exagerar
    exalt: exaltar
    examine: examinar
    excavate: excavar
    exceed: exceder
    excel: sobresalir
    exchange: intercambiar, cambiar
    excite: emocionar, entusiasmar
    exclude: excluir
    excuse: disculpar
    execute: ejecutar
    exempt: eximir
    exercise: ejercitar
    exert: ejercer
    exhale: exhalar
    exhaust: agotar
    exhibit: exhibir
    exile: exiliar
    exist: existir
    expand: expandir, ampliar
    expect: esperar
    expedite: agilizar, acelerar
    expel: expulsar
    experience: experimentar
    experiment: experimentar
    expire: caducar, vencer
    explain: explicar
    explode: explotar
    exploit: explotar
    explore: explorar
    export: exportar
    expose: exponer
    express: expresar
    extend: extender
    extinguish: extinguir, apagar
    extol: ensalzar
    extract: extraer
    fabricate: fabricar, inventar
    face: enfrentar
    facilitate: facilitar
    fade: desvanecer
    fail: fallar, fracasar, suspender (a test)
    fake: falsificar, fingir
    fall: caer
    fall down: caer
    fan: abanicar
    fascinate: fascinar
    fasten: sujetar, abrochar
    fatigue: fatigar
    favor: favorecer
    fear: temer
    feed: alimentar
    feel: sentir
    fence: esgrimir
    ferment: fermentar
    fetch: traer, buscar
    fight: luchar, pelear
    figure out: descubrir, entender
    file: archivar
    fill: llenar, rellenar
    fill in: rellenar
    film: filmar
    filter: filtrar
    finance: financiar
    find: encontrar, hallar
    find out: averiguar, descubrir
    fine: multar
    finish: terminar, acabar
    fire: despedir (from a job), disparar (a weapon)
    fish: pescar
    fit: caber, encajar
    fix: arreglar, reparar
    flap: aletear
    flare: destellar
    flash: destellar
    flatter: halagar
    flavor: sazonar, aromatizar
    flee: huir
    fling: arrojar
    flip: voltear
    flirt: coquetear
    float: flotar
    flood: inundar
    flourish: florecer
    flow: fluir, correr
    flutter: revolotear
    fly: volar
    focus: enfocar
    fold: doblar, plegar
    follow: seguir
    fool: engañar
    forbid: prohibir
    force: forzar
    forecast: pronosticar
    foresee: prever
    forge: forjar, falsificar
    forget: olvidar
    forgive: perdonar
    form: formar
    format: formatear
    formulate: formular
    found: fundar
    fracture: fracturar
    frame: enmarcar
    free: liberar
    freeze: congelar, helar
    frighten: asustar
    frown: fruncir
    frustrate: frustrar
    fry: freír
    fuel: abastecer, alimentar
    fulfill: cumplir
    function: funcionar
    furnish: amueblar
    fuse: fusionar
    gain: ganar
    gallop: galopar
    gamble: apostar
    gather: reunir, recoger
    generate: generar
    gesture: gesticular
    get: conseguir (obtain), obtener, recibir (receive)
    give: dar
    give up: abandonar, renunciar
    glorify: glorificar
    glow: brillar
    glue: pegar
    go: ir
    go back: volver, regresar
    go on: continuar, seguir
    go out: salir
    gossip: chismear
    govern: gobernar
    grab: agarrar
    grade: calificar
    graduate: graduar
    graft: injertar
    grant: conceder
    grasp: agarrar, comprender
    grate: rallar
    graze: pastar
    greet: saludar
    grieve: lamentar, afligir
    grill: asar
    grind: moler
    grip: agarrar, sujetar
    groan: gemir
    grow: crecer, cultivar (crops)
    grow up: crecer
    growl: gruñir
    grunt: gruñir
    guarantee: garantizar
    guard: guardar, vigilar
    guess: adivinar, suponer
    guide: guiar
    gulp: tragar
    gush: brotar
    hack: piratear
    hail: granizar
    halt: detener, parar
    hammer: martillar
    hamper: obstaculizar
    hand over: entregar
    handle: manejar
    hang: colgar
    hang up: colgar
    happen: ocurrir, suceder, pasar
    harass: acosar
    harden: endurecer
    harm: dañar
    harmonize: armonizar
    harvest: cosechar
    hate: odiar
    haul: arrastrar, acarrear
    have: tener, haber (auxiliary)
    heal: curar, sanar
    heap: amontonar
    hear: oír
    heat: calentar
    heighten: intensificar
    help: ayudar
    hesitate: dudar, vacilar
    hide: esconder, ocultar
    highlight: resaltar, destacar
    hijack: secuestrar
    hinder: obstaculizar, impedir
    hint: insinuar
    hire: contratar
    hit: golpear, pegar
    hoard: acumular, atesorar
    hold: sostener, agarrar
    hold on: aguantar, esperar
    honor: honrar
    hook: enganchar
    hop: brincar
    hope: esperar
    host: alojar
    hover: flotar
    howl: aullar
    hug: abrazar
    hum: tararear
    humiliate: humillar
    hunt: cazar
    hurl: lanzar, arrojar
    hurt: doler (to ache), herir (to wound), lastimar
    hypnotize: hipnotizar
    identify: identificar
    idolize: idolatrar
    ignore: ignorar
    illuminate: iluminar
    illustrate: ilustrar
    imagine: imaginar
    imitate: imitar
    immerse: sumergir
    immobilize: inmovilizar
    impeach: acusar
    impede: impedir, obstaculizar
    implement: implementar
    implore: implorar
    imply: implicar
    import: importar
    impose: imponer
    impress: impresionar
    imprison: encarcelar
    improve: mejorar
    incite: incitar
    incline: inclinar
    include: incluir
    incorporate: incorporar
    increase: aumentar
    incur: incurrir
    indicate: indicar
    induce: inducir
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
    inherit: heredar
    inhibit: inhibir
    initiate: iniciar
    inject: inyectar
    injure: herir, lesionar
    inquire: preguntar, indagar
    insert: insertar, introducir
    insinuate: insinuar
    insist: insistir
    inspect: inspeccionar
    inspire: inspirar
    install: instalar
    instruct: instruir
    insult: insultar
    insure: asegurar
    integrate: integrar
    intend: pretender
    intensify: intensificar
    interact: interactuar
    interest: interesar
    interfere: interferir
    interpret: interpretar
    interrogate: interrogar
    interrupt: interrumpir
    intervene: intervenir
    interview: entrevistar
    intimidate: intimidar
    intrigue: intrigar
    introduce: presentar (a person), introducir
    invade: invadir
    invent: inventar
    invest: invertir
    invite: invitar
    invoice: facturar
    invoke: invocar
    involve: involucrar
    iron: planchar
    irritate: irritar
    isolate: aislar
    issue: emitir
    itch: picar
    jam: atascar
    jeer: abuchear
    jingle: tintinear
    jog: trotar
    join: unir, juntar
    joke: bromear
    jolt: sacudir
    journey: viajar
    judge: juzgar
    jump: saltar
    justify: justificar
    keep: guardar, mantener
    keep on: seguir, continuar
    kick: patear
    kidnap: secuestrar
    kill: matar
    kindle: encender, avivar
    kiss: besar
    knead: amasar
    knit: tejer
    knock: golpear, llamar (at a door)
    knot: anudar
    know: saber (facts, how to), conocer (people, places)
    label: etiquetar
    lack: carecer
    lament: lamentar
    land: aterrizar
    languish: languidecer
    lash: azotar
    last: durar
    laugh: reír
    launch: lanzar
    launder: lavar, blanquear
    lay: poner, colocar
    lead: dirigir, guiar, liderar
    leak: filtrar
    lean: inclinar, apoyar
    leap: saltar
    learn: aprender
    leave: salir (depart), dejar (leave behind), abandonar
    legislate: legislar
    lend: prestar
    lengthen: alargar
    let: dejar, permitir
    let down: decepcionar
    level: nivelar
    liberate: liberar
    lick: lamer
    lie: mentir
    lift: levantar, elevar
    light: encender, iluminar
    lighten: aligerar
    like: gustar
    limit: limitar
    linger: demorar, persistir
    link: vincular, enlazar
    liquidate: liquidar
    listen: escuchar
    listen to: escuchar
    live: vivir
    load: cargar
    loathe: aborrecer
    locate: ubicar, localizar
    lock: bloquear
    log: registrar
    long: anhelar
    look: mirar
    look after: cuidar
    look at: mirar
    look for: buscar
    look up: buscar
    loosen: aflojar
    lose: perder
    love: amar, querer
    lower: bajar
    lull: arrullar
    lurk: acechar
    magnify: ampliar
    maim: mutilar
    maintain: mantener
    make: hacer, fabricar
    make up: inventar
    malfunction: fallar
    manage: gestionar, administrar, manejar
    mangle: destrozar
    manipulate: manipular
    manufacture: fabricar
    map: mapear
    march: marchar
    marinate: marinar
    mark: marcar
    market: comercializar
    marvel: maravillar
    mash: machacar
    mask: enmascarar
    massage: masajear
    master: dominar
    match: igualar, emparejar
    materialize: materializar
    matter: importar
    maximize: maximizar
    mean: significar
    measure: medir
    mediate: mediar
    meet: conocer (for the first time), encontrar (run into)
    melt: derretir, fundir
    memorize: memorizar
    mend: remendar, reparar
    mention: mencionar
    meow: maullar
    merge: fusionar
    merit: merecer
    migrate: migrar
    mimic: imitar
    minimize: minimizar
    mislead: engañar
    misplace: extraviar
    miss: extrañar (feel the absence of), perder (a bus, a chance)
    mistake: confundir, equivocar
    mix: mezclar
    mobilize: movilizar
    mock: ridiculizar
    modify: modificar
    moisten: humedecer
    mold: moldear
    monitor: monitorear
    mortgage: hipotecar
    motivate: motivar
    mount: montar
    move: mover, mudar
    muffle: amortiguar
    multiply: multiplicar
    mumble: murmurar, farfullar
    munch: masticar
    murder: asesinar
    murmur: murmurar
    muse: reflexionar
    must: deber (obligation)
    mutter: murmurar, mascullar
    nag: fastidiar, regañar
    nail: clavar
    name: nombrar
    narrow: estrechar, reducir
    navigate: navegar
    need: necesitar
    neglect: descuidar
    negotiate: negociar
    nest: anidar
    neutralize: neutralizar
    nibble: mordisquear
    nod: asentir
    nominate: nominar
    notice: notar
    notify: notificar
    nourish: nutrir
    nudge: empujar
    numb: adormecer
    obey: obedecer
    object: objetar
    oblige: obligar
    obscure: oscurecer
    observe: observar
    obsess: obsesionar
    obstruct: obstruir
    obtain: obtener
    occupy: ocupar
    occur: ocurrir
    offend: ofender
    offer: ofrecer
    offset: compensar
    omit: omitir
    ooze: rezumar
    open: abrir
    operate: operar
    oppose: oponer
    oppress: oprimir
    optimize: optimizar
    orchestrate: orquestar
    order: ordenar (arrange, command), pedir (a meal)
    organize: organizar
    orient: orientar
    oust: destituir, expulsar
    outdo: superar
    outline: esbozar
    outperform: superar
    overcome: superar
    overdo: exagerar
    overflow: desbordar
    overhear: oír
    overlap: superponer
    overpower: dominar
    override: anular
    overrule: anular
    oversee: supervisar
    overtake: adelantar
    overthrow: derrocar
    overturn: volcar
    overwhelm: abrumar
    overwrite: sobrescribir
    owe: deber
    own: poseer
    pacify: pacificar
    pack: empacar
    paddle: remar
    paint: pintar
    parade: desfilar
    paralyze: paralizar
    paraphrase: parafrasear
    park: estacionar, aparcar
    parody: parodiar
    partake: participar
    participate: participar
    pass: pasar
    paste: pegar
    pat: acariciar, palmear
    patch: remendar
    patrol: patrullar
    pause: pausar
    pave: pavimentar
    pawn: empeñar
    pay: pagar
    pay back: devolver, reembolsar
    pedal: pedalear
    peek: espiar
    peel: pelar
    penalize: penalizar
    perceive: percibir
    perch: posar
    perfect: perfeccionar
    perform: realizar, actuar
    perish: perecer
    permit: permitir
    perpetuate: perpetuar
    persevere: perseverar
    persist: persistir
    persuade: persuadir
    pester: molestar, importunar
    phone: llamar
    photograph: fotografiar
    pick: escoger, recoger (pick up)
    pick out: escoger, elegir
    pick up: recoger
    pierce: perforar, atravesar
    pile up: amontonar
    pilot: pilotar
    pin: sujetar, clavar
    pinch: pellizcar
    pinpoint: precisar
    pitch: lanzar
    pity: compadecer
    place: colocar
    plague: plagar, atormentar
    plan: planear, planificar
    plant: plantar
    plaster: enyesar
    play: jugar (games, sports), tocar (an instrument)
    plead: suplicar, alegar
    please: complacer, agradar
    pledge: prometer, jurar
    plot: tramar
    plow: arar
    pluck: arrancar
    plug: enchufar
    plunder: saquear
    plunge: sumergir
    point: señalar, apuntar
    point out: señalar
    poison: envenenar
    poke: pinchar, hurgar
    polish: pulir
    pollute: contaminar
    ponder: reflexionar
    pop: reventar
    populate: poblar
    portray: retratar, representar
    pose: posar
    position: colocar, posicionar
    possess: poseer
    post: publicar
    postpone: posponer, aplazar
    pound: golpear
    pour: verter, servir
    practice: practicar
    praise: elogiar, alabar
    pray: rezar, orar
    preach: predicar
    precede: preceder
    predict: predecir
    prefer: preferir
    preheat: precalentar
    preoccupy: preocupar
    prepare: preparar
    prescribe: prescribir
    present: presentar
    preserve: conservar
    preside: presidir
    press: presionar, apretar
    presume: presumir, suponer
    pretend: fingir
    prevail: prevalecer
    prevent: prevenir, impedir
    prick: pinchar
    print: imprimir
    probe: sondear, investigar
    proceed: proceder
    process: procesar
    proclaim: proclamar
    produce: producir
    profess: profesar
    program: programar
    progress: progresar
    prohibit: prohibir
    project: proyectar
    prolong: prolongar
    promise: prometer
    promote: promover
    prompt: incitar
    pronounce: pronunciar
    propagate: propagar
    propel: impulsar
    propose: proponer
    prosecute: procesar, enjuiciar
    prosper: prosperar
    protect: proteger
    protest: protestar
    protrude: sobresalir
    prove: probar, demostrar
    provide: proveer, proporcionar
    provoke: provocar
    prune: podar
    pry: husmear
    publish: publicar
    pull: tirar, jalar
    pulse: pulsar
    pump: bombear
    punch: golpear
    punctuate: puntuar
    puncture: pinchar, perforar
    punish: castigar
    purchase: adquirir, comprar
    purge: purgar
    purify: purificar
    pursue: perseguir
    push: empujar
    put: poner
    put off: aplazar, posponer
    puzzle: desconcertar
    quake: temblar
    qualify: calificar
    quarrel: pelear, discutir
    quench: saciar, apagar
    query: consultar
    question: cuestionar
    quit: dejar, renunciar
    quiver: temblar
    quote: citar
    race: correr, competir
    radiate: irradiar
    raid: asaltar
    rain: llover
    raise: levantar, criar (children)
    rally: reunir, movilizar
    ram: embestir
    ramble: divagar
    rank: clasificar
    rant: despotricar
    rate: calificar
    rationalize: racionalizar
    rattle: traquetear
    reach: alcanzar, llegar
    react: reaccionar
    read: leer
    reap: cosechar
    rear: criar
    reason: razonar
    reassure: tranquilizar
    rebuild: reconstruir
    rebuke: reprender
    recall: recordar
    recede: retroceder, retirar
    receive: recibir
    recharge: recargar
    reciprocate: corresponder
    recite: recitar
    reckon: calcular
    reclaim: reclamar, recuperar
    recline: reclinar
    recognize: reconocer
    recoil: retroceder
    recommend: recomendar
    reconcile: reconciliar
    reconsider: reconsiderar
    record: grabar
    recount: relatar, contar
    recover: recuperar
    recreate: recrear
    recruit: reclutar
    rectify: rectificar
    recycle: reciclar
    redeem: redimir
    redirect: redirigir
    redo: rehacer
    reduce: reducir
    refer: referir
    refine: refinar
    reflect: reflejar
    reform: reformar
    refrain: evitar
    refresh: refrescar
    refrigerate: refrigerar
    refund: reembolsar
    refuse: rechazar, negar
    regain: recobrar
    regard: considerar
    regenerate: regenerar
    register: registrar
    regret: lamentar
    regulate: regular
    rehearse: ensayar
    reign: reinar
    reinforce: reforzar
    reiterate: reiterar
    reject: rechazar
    rekindle: reavivar
    relapse: recaer
    relate: relacionar
    relax: relajar
    relay: transmitir, retransmitir
    release: liberar, soltar
    relegate: relegar
    relent: ceder
    relieve: aliviar
    relish: saborear, disfrutar
    reload: recargar
    rely: confiar
    remain: permanecer
    remark: comentar, observar
    remedy: remediar
    remember: recordar
    remind: recordar
    remit: remitir
    remodel: remodelar
    remove: quitar, eliminar
    rename: renombrar
    renew: renovar
    renounce: renunciar
    renovate: renovar, reformar
    rent: alquilar
    repair: reparar
    repay: reembolsar, devolver
    repeal: derogar
    repeat: repetir
    repel: repeler
    replace: reemplazar, sustituir
    replenish: reponer
    reply: responder, contestar
    report: informar
    represent: representar
    repress: reprimir
    reprimand: reprender
    reproach: reprochar
    reproduce: reproducir
    request: solicitar, pedir
    require: requerir, exigir
    reschedule: reprogramar
    rescind: rescindir
    rescue: rescatar
    research: investigar
    reserve: reservar
    reshape: remodelar
    reside: residir
    resign: renunciar
    resist: resistir
    resolve: resolver
    resort: recurrir
    respect: respetar
    respond: responder
    rest: descansar
    restart: reiniciar
    restore: restaurar
    restrain: contener
    restrict: restringir
    result: resultar
    resume: reanudar
    resurrect: resucitar
    retain: retener
    retreat: retroceder
    retrieve: recuperar
    return: regresar, volver, devolver (give back)
    reunite: reunir
    reveal: revelar
    reverse: invertir
    revert: revertir
    review: repasar, revisar
    revise: revisar
    revive: revivir
    revoke: revocar
    revolutionize: revolucionar
    reward: recompensar
    rhyme: rimar
    ride: montar
    ring: sonar
    rinse: enjuagar
    rip: rasgar
    ripple: ondular
    rise: subir, levantar
    risk: arriesgar
    rival: rivalizar
    roam: vagar, deambular
    roar: rugir
    roast: asar
    rob: robar
    roll: rodar
    rotate: rotar
    rouse: despertar
    route: encaminar
    row: remar
    rub: frotar
    ruin: arruinar
    rule: gobernar, regir
    rumble: retumbar
    rummage: hurgar
    run: correr
    run away: huir, escapar
    rupture: romper
    rush: apresurar
    rust: oxidar
    rustle: susurrar
    sabotage: sabotear
    sacrifice: sacrificar
    sadden: entristecer
    safeguard: salvaguardar
    sail: navegar
    salute: saludar
    salvage: rescatar
    sanction: sancionar
    sanitize: desinfectar
    sap: debilitar
    satisfy: satisfacer
    saturate: saturar
    save: ahorrar (money), salvar (rescue), guardar (keep)
    savor: saborear
    saw: serrar
    say: decir
    scale: escalar
    scan: escanear
    scandalize: escandalizar
    scar: cicatrizar, marcar
    scare: asustar
    scatter: esparcir
    schedule: programar, agendar
    scheme: tramar, conspirar
    scold: regañar, reñir
    scoop: sacar
    scorch: chamuscar, quemar
    score: anotar
    scorn: despreciar
    scour: fregar
    scout: explorar
    scrape: raspar
    scratch: rascar
    scream: gritar, chillar
    screw: atornillar
    scribble: garabatear
    scroll: desplazar
    scrub: fregar, restregar
    scrutinize: escudriñar
    sculpt: esculpir
    seal: sellar
    search: buscar
    season: sazonar
    secure: asegurar
    sedate: sedar
    seduce: seducir
    see: ver
    seek: buscar
    seem: parecer
    segment: segmentar
    segregate: segregar
    select: seleccionar
    sell: vender
    send: enviar, mandar
    send back: devolver
    sentence: sentenciar
    separate: separar
    serve: servir
    set: poner, colocar
    set off: partir
    set up: configurar, establecer
    settle: resolver, establecer
    sever: cortar, separar
    sew: coser
    shackle: encadenar
    shade: sombrear
    shake: sacudir
    shampoo: lavar
    shape: moldear
    share: compartir
    shatter: destrozar, romper
    shave: afeitar
    shear: esquilar
    shed: derramar
    shelter: refugiar
    shift: cambiar, mover
    shimmer: relucir, brillar
    shine: brillar
    shiver: temblar
    shock: impactar
    shoo: ahuyentar
    shoot: disparar
    shorten: acortar
    should: deber (advice, obligation)
    shout: gritar
    shove: empujar
    shovel: palear
    show: mostrar, enseñar
    show off: presumir
    show up: aparecer
    shred: triturar, desmenuzar
    shrink: encoger
    shudder: estremecer
    shuffle: barajar
    shun: evitar
    shut: cerrar
    sidestep: esquivar
    siege: asediar
    sift: tamizar
    sigh: suspirar
    sign: firmar
    signal: señalar
    silence: silenciar
    simplify: simplificar
    simulate: simular
    sing: cantar
    singe: chamuscar
    sink: hundir
    sip: sorber
    skate: patinar
    sketch: bosquejar
    skewer: ensartar
    ski: esquiar
    skim: hojear, desnatar
    skip: saltar
    slam: golpear, azotar
    slander: calumniar
    slap: abofetear
    slash: cortar, rajar
    sleep: dormir
    slice: rebanar
    slide: deslizar
    slip: resbalar
    slither: reptar
    slow: ralentizar, retardar
    smash: aplastar
    smear: untar, manchar
    smell: oler
    smile: sonreír
    smoke: fumar
    smooth: alisar
    smother: sofocar
    smuggle: contrabandear
    snap: romper, chasquear
    snarl: gruñir
    snatch: arrebatar
    sneeze: estornudar
    sniff: oler, olfatear
    snooze: dormitar
    snore: roncar
    snow: nevar
    soak: empapar
    sob: sollozar
    socialize: socializar
    soften: suavizar
    solicit: solicitar
    solidify: solidificar
    solve: resolver
    soothe: calmar
    sort: ordenar, clasificar
    sound: sonar
    sow: sembrar
    sparkle: centellear
    spawn: engendrar
    speak: hablar
    specify: especificar
    speculate: especular
    speed: acelerar
    spell: deletrear
    spend: gastar (money), pasar (time)
    spill: derramar
    spin: girar
    spit: escupir
    splash: salpicar
    splinter: astillar
    split: dividir, partir
    spoil: estropear
    sponsor: patrocinar
    spot: avistar, detectar
    sprain: torcer
    spray: rociar
    spread: extender, difundir
    sprinkle: espolvorear
    spur: espolear, incentivar
    squander: derrochar, malgastar
    squeal: chillar
    squeeze: exprimir, apretar
    squint: entornar
    stab: apuñalar
    stabilize: estabilizar
    stagger: tambalear, escalonar
    stain: manchar
    stall: calar
    stamp: sellar
    start: empezar, comenzar, iniciar
    startle: sobresaltar
    stash: esconder, guardar
    state: afirmar, declarar
    stay: permanecer
    steady: estabilizar
    steal: robar
    steer: dirigir
    sterilize: esterilizar
    stew: guisar
    stick: pegar
    stifle: sofocar, reprimir
    stigmatize: estigmatizar
    stimulate: estimular
    sting: picar
    stink: apestar
    stipulate: estipular
    stir: remover
    stitch: coser
    stop: parar, detener
    store: almacenar
    storm: asaltar
    straighten: enderezar
    strain: colar, forzar
    strangle: estrangular
    strap: atar
    stray: desviar, extraviar
    strengthen: fortalecer
    stress: enfatizar, estresar
    stretch: estirar
    strew: esparcir
    string: ensartar
    strip: desnudar, despojar
    stroke: acariciar
    stroll: pasear
    struggle: luchar
    strum: rasguear
    study: estudiar
    stuff: rellenar
    stumble: tropezar
    stun: aturdir
    subdue: someter
    submit: presentar, someter
    subscribe: suscribir
    subsidize: subvencionar
    substitute: sustituir
    subtract: restar
    succeed: triunfar
    succumb: sucumbir
    suck: chupar
    sue: demandar
    suffer: sufrir
    suffocate: asfixiar, sofocar
    suggest: sugerir
    suit: convenir
    sum: sumar
    summarize: resumir
    summon: convocar
    supersede: reemplazar
    supervise: supervisar
    supplement: complementar
    supply: suministrar, proveer
    support: apoyar
    suppose: suponer
    suppress: suprimir, reprimir
    surf: surfear
    surge: surgir
    surmise: conjeturar
    surpass: superar
    surprise: sorprender
    surrender: entregar, rendir
    surround: rodear
    survey: encuestar, inspeccionar
    survive: sobrevivir
    suspect: sospechar
    suspend: suspender
    sustain: sostener, mantener
    swallow: tragar
    swap: intercambiar
    sway: balancear
    swear: jurar
    sweat: sudar
    sweep: barrer
    sweeten: endulzar
    swell: hinchar
    swim: nadar
    swindle: estafar
    swing: columpiar
    swipe: deslizar
    switch: cambiar
    symbolize: simbolizar
    sympathize: compadecer
    sync: sincronizar
    synchronize: sincronizar
    synthesize: sintetizar
    tack: clavar
    tackle: abordar
    tag: etiquetar
    tailor: adaptar, confeccionar
    taint: contaminar, manchar
    take: tomar, llevar (take along)
    take care of: cuidar
    take off: despegar (a plane), quitar (clothes)
    take part: participar
    talk: hablar, charlar
    tally: contabilizar
    tame: domar
    tamper: manipular
    tan: broncear
    tangle: enredar
    tap: tocar
    tape: grabar
    taper: afilar
    target: apuntar
    tarnish: empañar
    taste: probar, saborear
    tattoo: tatuar
    taunt: provocar, mofar
    tax: gravar
    teach: enseñar
    tear: rasgar, romper
    tear down: demoler, derribar
    tease: molestar, bromear
    telephone: telefonear
    tell: decir, contar (a story)
    tell off: regañar, reñir
    tempt: tentar
    tend: tender
    tenderize: ablandar
    terminate: terminar, cesar
    terrify: aterrorizar
    test: probar, examinar
    testify: testificar, declarar
    tether: atar
    thank: agradecer
    thaw: descongelar
    thicken: espesar
    thin: adelgazar
    think: pensar (ponder), creer (believe)
    think about: pensar
    thread: enhebrar
    threaten: amenazar
    thrill: emocionar
    thrive: prosperar
    throb: palpitar
    throttle: estrangular
    throw: lanzar, tirar
    throw away: tirar
    thrust: empujar, clavar
    thump: golpear
    thunder: tronar
    thwart: frustrar
    tick: marcar
    tidy: ordenar
    tie: atar
    tighten: apretar
    tilt: inclinar
    time: cronometrar
    tingle: hormiguear
    tint: teñir, colorear
    tip: inclinar
    tire: cansar
    title: titular
    toast: tostar
    toggle: alternar
    tolerate: tolerar
    tone: tonificar
    top: superar, coronar
    topple: derribar
    torment: atormentar
    torture: torturar
    toss: lanzar
    touch: tocar
    tour: recorrer
    tow: remolcar
    trace: trazar
    track: rastrear
    trade: comerciar
    train: entrenar
    trample: pisotear
    transcend: trascender
    transcribe: transcribir
    transfer: transferir
    transform: transformar
    translate: traducir
    transmit: transmitir
    transpire: transpirar
    transplant: trasplantar
    transport: transportar
    trap: atrapar
    travel: viajar
    traverse: atravesar, recorrer
    tread: pisar
    treasure: atesorar
    treat: tratar
    tremble: temblar
    trick: engañar
    trickle: gotear
    trigger: desencadenar, activar
    trim: recortar
    trip: tropezar
    triple: triplicar
    trivialize: trivializar
    trot: trotar
    trouble: molestar, perturbar
    truncate: truncar
    trust: confiar
    try: intentar, probar (try out)
    try on: probar
    tuck: meter
    tumble: caer, desplomar
    tune: afinar
    tunnel: excavar
    turn: girar, doblar
    turn around: girar
    turn down: rechazar, bajar (volume)
    turn into: convertir
    turn off: apagar
    turn on: encender
    turn up: subir
    tweet: tuitear
    twinkle: titilar, centellear
    twirl: girar
    type: teclear
    umpire: arbitrar
    unbutton: desabotonar
    uncover: descubrir
    underestimate: subestimar
    undergo: experimentar, sufrir
    underline: subrayar
    undermine: socavar
    underpin: sustentar
    understand: entender, comprender
    understate: minimizar
    undertake: emprender
    underwrite: suscribir
    undo: deshacer
    undress: desvestir
    unearth: desenterrar
    unfasten: desabrochar
    unfold: desplegar
    unfurl: desplegar, desenrollar
    unhook: desenganchar
    unify: unificar
    uninstall: desinstalar
    unite: unir
    unleash: desatar, desencadenar
    unload: descargar
    unmask: desenmascarar
    unpack: desempacar
    unplug: desenchufar
    unravel: desenredar, desentrañar
    unroll: desenrollar
    unscrew: destornillar
    unsettle: perturbar, inquietar
    untie: desatar
    unveil: desvelar, inaugurar
    unwrap: desenvolver
    unzip: descomprimir
    update: actualizar
    upgrade: mejorar, actualizar
    uphold: sostener
    uplift: elevar
    upload: subir
    uproot: desarraigar
    upset: molestar, trastornar
    urge: instar
    use: usar, utilizar
    usher: acompañar, guiar
    usurp: usurpar
    utilize: utilizar
    utter: pronunciar, emitir
    vaccinate: vacunar
    vacuum: aspirar
    validate: validar
    value: valorar
    vandalize: vandalizar
    vanish: desaparecer
    vaporize: vaporizar
    varnish: barnizar
    vary: variar
    veer: desviar
    vent: desahogar
    ventilate: ventilar
    venture: aventurar, arriesgar
    verify: verificar
    veto: vetar
    vex: molestar
    vibrate: vibrar
    victimize: victimizar
    videotape: grabar
    vie: competir
    view: ver, observar
    vilify: difamar
    vindicate: vindicar
    violate: violar
    visit: visitar
    visualize: visualizar
    vocalize: vocalizar
    void: anular
    vomit: vomitar
    vote: votar
    vouch: avalar
    vow: jurar, prometer
    voyage: viajar
    wade: vadear
    wag: menear
    wail: gemir, lamentar
    wait: esperar
    wait for: esperar
    wait on: atender, servir
    waive: renunciar
    wake: despertar
    wake up: despertar
    walk: caminar, andar
    wall: amurallar
    waltz: valsar
    wander: vagar
    wane: menguar
    want: querer, desear
    ward off: evitar, repeler
    warm: calentar
    warm up: calentar
    warn: advertir, avisar
    warp: deformar, alabear
    warrant: justificar
    wash: lavar
    waste: desperdiciar
    watch: mirar (look at), vigilar (keep watch), ver (TV, movies)
    water: regar
    wave: saludar
    waver: vacilar
    weaken: debilitar
    wean: destetar
    wear: llevar, vestir
    weave: tejer
    wed: casar
    weep: llorar
    weigh: pesar
    weigh down: agobiar
    welcome: acoger
    weld: soldar
    whack: golpear
    whip: azotar
    whisper: susurrar
    whistle: silbar
    whiten: blanquear
    whittle: tallar
    widen: ensanchar
    wield: manejar, esgrimir
    wiggle: menear, contonear
    win: ganar
    win over: convencer
    wind: enrollar, serpentear
    wink: guiñar
    wipe: limpiar
    wish: desear
    withdraw: retirar
    wither: marchitar
    withstand: resistir
    witness: presenciar
    wobble: tambalear
    word: redactar, formular
    work: trabajar, funcionar (machines)
    work out: resolver, entrenar
    worry: preocupar
    worsen: empeorar
    worship: adorar
    wound: herir
    wrap: envolver
    wreck: destruir
    wrench: torcer, arrancar
    wrestle: luchar
    wring: retorcer
    write: escribir
    write down: anotar, apuntar
    write off: cancelar
    x-ray: radiografiar
    yank: tirar
    yawn: bostezar
    yearn: anhelar
    yell: gritar
    yelp: chillar
    yield: ceder
    yoke: uncir
    zap: eliminar
    zip: comprimir
    zone: zonificar
    zoom: acercar
  `;

  // "know: saber (facts), conocer (people)" -> { know: [{ es, note }, ...] }
  const VERBS = parseTable(TABLE, plainEntry('es'));

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
