/*
 * English -> French verb database (standard French, France).
 *
 * One line per English verb: `english: french, french (usage note)`.
 * The first French verb is the default translation. To add a verb, add a
 * line here; conjugate.js works out the conjugation from the infinitive.
 * Pronominal verbs (se lever) are not supported, so those are left out.
 */
(function (global) {
  'use strict';

  const { parseTable, plainEntry } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: abandonner
    abort: avorter, interrompre (a process)
    absorb: absorber
    abuse: abuser
    accelerate: accélérer
    accept: accepter
    accompany: accompagner
    accomplish: accomplir, réaliser
    accumulate: accumuler
    accuse: accuser
    achieve: réaliser, atteindre
    acknowledge: reconnaître
    acquire: acquérir
    acquit: acquitter
    act: agir, jouer (in a play)
    adapt: adapter
    add: ajouter, additionner (in math)
    adhere: adhérer
    adjust: ajuster, régler
    administer: administrer
    admire: admirer
    admit: admettre, avouer (confess)
    adopt: adopter
    adore: adorer
    advance: avancer
    advertise: annoncer, promouvoir
    advise: conseiller
    advocate: défendre, préconiser
    affect: affecter, toucher
    age: vieillir
    agitate: agiter
    agree: convenir (agree on), consentir
    aim: viser
    alert: alerter
    align: aligner
    allocate: attribuer, répartir (distribute)
    allow: permettre, autoriser
    alter: modifier, altérer
    amaze: étonner, émerveiller
    amend: modifier, amender
    amuse: amuser, divertir
    analyze: analyser
    anger: fâcher, irriter
    announce: annoncer
    annoy: agacer, ennuyer
    answer: répondre
    anticipate: anticiper
    appeal: plaire (be attractive), solliciter (make an appeal)
    appear: apparaître, paraître
    applaud: applaudir
    apply: appliquer, postuler (apply for a job)
    appoint: nommer
    appreciate: apprécier, remercier (be grateful for)
    approach: aborder, approcher
    approve: approuver
    argue: argumenter, soutenir (maintain a position)
    arise: surgir, survenir (occur)
    arrange: arranger, organiser
    arrest: arrêter
    arrive: arriver
    articulate: articuler
    ascend: monter, gravir (climb)
    ask: demander, interroger (question someone)
    ask for: demander, réclamer
    aspire: aspirer
    assemble: assembler, rassembler (gather)
    assert: affirmer, prétendre
    assess: évaluer
    assign: attribuer, assigner
    assimilate: assimiler
    assist: aider, assister
    associate: associer
    assume: supposer, assumer
    assure: assurer
    astonish: étonner
    attach: attacher, joindre
    attack: attaquer
    attain: atteindre
    attempt: tenter, essayer
    attend: assister (an event), soigner (take care of)
    attract: attirer
    attribute: attribuer
    audit: auditer, vérifier
    authorize: autoriser
    avoid: éviter
    award: décerner, accorder
    back up: sauvegarder, soutenir (support)
    bake: cuire, enfourner (put in the oven)
    balance: équilibrer
    ban: interdire, bannir
    bandage: bander, panser
    bang: cogner, claquer
    baptize: baptiser
    bargain: marchander
    bark: aboyer
    base: baser, fonder
    bathe: baigner
    battle: combattre, lutter
    be: être
    bear: supporter, endurer, porter (carry)
    beat: battre, vaincre, frapper
    beautify: embellir
    beg: supplier, mendier (beg for money)
    begin: commencer, débuter, entamer
    belch: roter
    believe: croire
    belong: appartenir
    bend: plier, courber
    bet: parier
    bid: enchérir, offrir (make an offer)
    bill: facturer
    bind: lier, attacher
    bite: mordre
    blackmail: chantager
    blame: blâmer, reprocher
    bleach: décolorer, blanchir
    bleed: saigner
    blend: mélanger
    bless: bénir
    blink: cligner, clignoter
    block: bloquer
    bloom: fleurir
    blossom: fleurir
    blow: souffler
    blur: brouiller, estomper
    board: embarquer
    boast: fanfaronner, bluffer
    boil: bouillir, bouillonner
    bond: lier, unir
    book: réserver
    boost: stimuler, renforcer
    bore: ennuyer, percer (drill)
    bother: déranger, gêner
    bounce: rebondir
    bow: incliner, saluer
    boycott: boycotter
    brag: crâner, fanfaronner
    brake: freiner
    break: casser, briser, rompre
    breathe: respirer
    brew: brasser, infuser
    bribe: soudoyer, corrompre
    bring: apporter (bring something), amener (bring someone)
    bring up: élever (children), évoquer (a topic)
    broadcast: diffuser, émettre
    broaden: élargir
    browse: parcourir, feuilleter (flip through), naviguer (the web)
    bruise: meurtrir, contusionner
    brush: brosser
    bubble: bouillonner, pétiller
    buckle: boucler
    build: construire, bâtir
    bully: intimider, brutaliser
    burden: charger, accabler
    burn: brûler
    burst: éclater, crever
    bury: enterrer
    buy: acheter
    buzz: bourdonner
    cage: enfermer
    calculate: calculer
    call: appeler
    calm: calmer, apaiser
    camp: camper
    can: pouvoir (be able to)
    cancel: annuler
    capture: capturer
    care: soigner (look after)
    caress: caresser
    carry: porter, transporter
    carry out: exécuter, effectuer
    carve: sculpter, tailler
    cash: encaisser
    cast: lancer, jeter
    catch: attraper, saisir, prendre
    categorize: classer, catégoriser
    cause: causer, provoquer
    cease: cesser
    celebrate: célébrer, fêter
    chain: enchaîner
    challenge: défier, contester
    change: changer, modifier
    chant: scander, chanter
    charge: facturer, charger, accuser
    charm: charmer, séduire
    chase: poursuivre, chasser
    chat: bavarder, discuter
    chatter: bavarder, papoter
    cheat: tricher, tromper
    check: vérifier, contrôler
    cheer: acclamer, encourager
    cherish: chérir
    chew: mâcher
    chill: refroidir, rafraîchir
    choke: étouffer, étrangler
    choose: choisir
    chop: hacher, couper
    circle: encercler, entourer
    circulate: circuler
    cite: citer
    claim: revendiquer, prétendre, réclamer
    clap: applaudir
    clarify: clarifier, préciser
    clash: heurter, affronter
    clasp: serrer, agripper
    classify: classer, classifier
    clean: nettoyer
    clean up: nettoyer, ranger
    cleanse: purifier, nettoyer
    clear: dégager, éclaircir
    clench: serrer, crisper
    click: cliquer
    climb: grimper, escalader, gravir
    clip: couper, tailler
    clog: boucher, obstruer
    clone: cloner
    close: fermer
    clutch: agripper, serrer
    coach: entraîner
    coax: persuader, cajoler
    code: coder, programmer
    coincide: coïncider
    collaborate: collaborer
    collapse: céder (give way), crouler
    collect: collectionner, ramasser, rassembler
    collide: heurter, percuter
    color: colorer, colorier
    comb: peigner
    combat: combattre, lutter
    combine: combiner, associer
    come: venir
    come back: revenir, retourner
    come in: entrer
    comfort: réconforter, consoler
    command: ordonner, commander
    commemorate: commémorer
    comment: commenter
    commit: commettre, engager
    communicate: communiquer
    compare: comparer
    compensate: compenser, dédommager
    compete: concourir, rivaliser
    compile: compiler
    complete: compléter, achever, terminer
    complicate: compliquer
    compliment: complimenter, féliciter
    comply: obéir, respecter
    compose: composer
    comprise: comprendre, englober
    compute: calculer
    conceal: cacher, dissimuler
    concede: concéder
    conceive: concevoir
    conclude: conclure
    condemn: condamner
    conduct: conduire, diriger, mener
    confess: avouer, confesser
    configure: configurer
    confirm: confirmer
    confront: affronter, confronter
    confuse: confondre, embrouiller
    congratulate: féliciter
    connect: connecter, relier
    conquer: conquérir
    consent: consentir
    conserve: conserver
    consider: considérer
    consist: consister
    console: consoler
    consolidate: consolider
    conspire: conspirer, comploter
    constitute: constituer
    construct: construire
    consult: consulter
    consume: consommer
    contact: contacter
    contain: contenir
    contemplate: contempler
    contend: soutenir (maintain), rivaliser (compete)
    continue: continuer, poursuivre
    contradict: contredire
    contrast: contraster, opposer
    contribute: contribuer
    control: contrôler, maîtriser
    converge: converger
    convert: convertir, transformer
    convey: transmettre, exprimer
    convince: convaincre
    cook: cuisiner, cuire
    cool: refroidir, rafraîchir
    cooperate: coopérer
    coordinate: coordonner
    cope: gérer, surmonter
    copy: copier
    correct: corriger
    correspond: correspondre
    corrupt: corrompre
    cost: coûter
    cough: tousser
    counsel: conseiller
    count: compter
    counterfeit: contrefaire, falsifier
    court: courtiser
    cover: couvrir
    crack: fissurer, craquer
    crash: percuter, planter (a computer)
    crave: désirer, convoiter
    crawl: ramper
    create: créer
    credit: créditer, attribuer
    criticize: critiquer
    cross: traverser, croiser
    crush: écraser, broyer
    cry: pleurer (weep), crier (shout)
    cultivate: cultiver
    cure: guérir, soigner
    curl: boucler, friser
    curse: maudire, jurer
    cushion: amortir
    customize: personnaliser
    cut: couper
    cut off: couper, trancher
    damage: abîmer, endommager
    dance: danser
    dare: oser
    darken: assombrir, obscurcir
    darn: repriser
    dash: foncer, filer
    dazzle: éblouir
    deal: traiter (deal with), distribuer (cards)
    debate: débattre
    debug: déboguer
    decay: pourrir, décomposer
    deceive: tromper, duper
    decide: décider
    decipher: déchiffrer
    declare: déclarer
    decline: décliner, refuser
    decorate: décorer
    decrease: diminuer, baisser
    decrypt: décrypter, déchiffrer
    dedicate: dédier, consacrer
    deduct: déduire
    deem: juger, estimer
    defeat: vaincre, battre
    defend: défendre
    defer: reporter, différer
    define: définir
    deflect: dévier, détourner
    degrade: dégrader
    delay: retarder, repousser
    delegate: déléguer
    delete: supprimer, effacer
    deliberate: délibérer
    delight: ravir, enchanter
    deliver: livrer, distribuer
    demand: exiger, réclamer
    demolish: démolir
    demonstrate: démontrer, manifester
    denote: dénoter, désigner
    denounce: dénoncer
    deny: nier, démentir
    depend: dépendre
    deploy: déployer
    deport: expulser, déporter
    deposit: déposer
    deprive: priver
    derive: dériver, découler
    descend: descendre
    describe: décrire
    deserve: mériter
    design: concevoir, dessiner
    designate: désigner
    desire: désirer
    despise: mépriser
    destroy: détruire
    detect: détecter
    deteriorate: détériorer, aggraver
    determine: déterminer
    detest: détester
    devastate: dévaster
    develop: développer
    deviate: dévier, diverger
    devour: dévorer
    diagnose: diagnostiquer
    dial: composer
    dictate: dicter
    die: mourir
    differ: différer
    dig: creuser, bêcher
    digest: digérer
    dilute: diluer
    dim: atténuer, baisser
    diminish: diminuer, réduire
    dine: dîner
    direct: diriger
    disable: désactiver, invalider
    disagree: désapprouver, contester
    disappear: disparaître
    disappoint: décevoir
    disarm: désarmer
    discard: jeter, écarter
    discharge: décharger, libérer
    disclose: révéler, divulguer
    disconnect: déconnecter, débrancher
    discourage: décourager
    discover: découvrir
    discredit: discréditer
    discuss: discuter, débattre
    disguise: déguiser
    disgust: dégoûter, répugner
    disinfect: désinfecter
    dismantle: démonter, démanteler
    dismiss: renvoyer, congédier, écarter
    dispatch: expédier, envoyer
    dispense: distribuer, dispenser
    disperse: disperser
    displace: déplacer
    display: afficher, exposer
    disprove: réfuter
    dispute: contester, disputer
    distinguish: distinguer
    distort: déformer, fausser
    distract: distraire
    distribute: distribuer
    disturb: déranger, perturber
    dive: plonger
    diversify: diversifier
    divide: diviser
    divorce: divorcer
    do: faire
    document: documenter
    dodge: esquiver
    dominate: dominer
    donate: donner
    double: doubler
    doubt: douter
    download: télécharger
    draft: rédiger, ébaucher
    drag: traîner, tirer
    drain: drainer, vider
    draw: dessiner, tirer
    dread: redouter, craindre
    dream: rêver
    dress: habiller, vêtir
    dribble: dribbler
    drift: dériver, flotter
    drill: forer, percer
    drink: boire
    drip: goutter, dégoutter
    drive: conduire
    drizzle: bruiner
    drop: lâcher, déposer
    drown: noyer
    dry: sécher
    dump: jeter, déverser
    duplicate: dupliquer
    dwell: habiter, résider
    dye: teindre
    earn: gagner
    ease: soulager, faciliter
    eat: manger
    echo: résonner, retentir
    edit: éditer, modifier
    educate: éduquer, instruire
    elaborate: élaborer
    elapse: passer
    elect: élire
    elevate: élever
    eliminate: éliminer
    elude: éluder
    email: envoyer (an email)
    embark: embarquer
    embed: incruster, intégrer
    embrace: embrasser, étreindre, adopter
    embroider: broder
    emerge: émerger, surgir
    emit: émettre
    emphasize: souligner, insister
    employ: employer, embaucher (hire)
    empower: habiliter
    empty: vider
    enable: permettre, activer
    enact: promulguer, décréter
    enchant: enchanter
    encircle: encercler, entourer
    encounter: rencontrer
    encourage: encourager
    encrypt: chiffrer, crypter
    end: terminer, finir
    endorse: approuver, soutenir
    endure: endurer, supporter
    energize: dynamiser, stimuler
    enforce: appliquer, imposer
    engage: engager, embaucher
    engrave: graver
    enhance: améliorer, renforcer
    enjoy: apprécier, profiter, jouir
    enlarge: agrandir
    enlist: enrôler, engager
    enrage: exaspérer
    enrich: enrichir
    enroll: inscrire
    ensure: assurer, garantir
    entail: impliquer, entraîner
    entangle: emmêler, enchevêtrer
    enter: entrer
    entertain: divertir, amuser
    entrust: confier
    envision: envisager, imaginer
    envy: envier
    equip: équiper
    erase: effacer, gommer
    err: errer, pécher (sin)
    escalate: aggraver, intensifier
    escape: échapper, fuir
    establish: établir
    estimate: estimer
    evacuate: évacuer
    evade: esquiver, contourner
    evaluate: évaluer
    evaporate: évaporer
    evoke: évoquer
    evolve: évoluer
    exaggerate: exagérer
    exalt: exalter
    examine: examiner
    excavate: excaver, fouiller
    exceed: dépasser, excéder
    excel: exceller
    exchange: échanger
    excite: exciter, enthousiasmer
    exclude: exclure
    excuse: excuser, pardonner
    execute: exécuter
    exempt: exempter, dispenser
    exercise: exercer, entraîner
    exert: exercer
    exhale: exhaler, expirer
    exhaust: épuiser
    exhibit: exposer, exhiber
    exile: exiler
    exist: exister
    expand: étendre, agrandir, développer
    expect: attendre, prévoir
    expedite: accélérer, hâter
    expel: expulser
    experience: éprouver, vivre (live through)
    experiment: expérimenter
    expire: expirer
    explain: expliquer
    explode: exploser
    exploit: exploiter
    explore: explorer
    export: exporter
    expose: exposer, dévoiler
    express: exprimer
    extend: étendre, prolonger
    extinguish: éteindre
    extol: vanter, louer (praise)
    extract: extraire
    fabricate: fabriquer, inventer
    face: affronter
    facilitate: faciliter
    fade: pâlir, faner (wither), ternir
    fail: échouer, rater (a test)
    fake: falsifier, simuler, feindre
    fall: tomber
    fall down: tomber
    fan: éventer
    fascinate: fasciner
    fasten: attacher, fixer
    fatigue: fatiguer
    favor: favoriser
    fear: craindre, redouter
    feed: nourrir, alimenter
    feel: sentir, ressentir, éprouver
    fence: clôturer (enclose)
    ferment: fermenter
    fetch: chercher, apporter
    fight: lutter, combattre
    figure out: comprendre, déchiffrer, résoudre (solve)
    file: classer, archiver
    fill: remplir, combler
    fill in: remplir
    film: filmer, tourner
    filter: filtrer
    finance: financer
    find: trouver
    find out: découvrir, apprendre
    fine: verbaliser, sanctionner
    finish: finir, terminer, achever
    fire: licencier (from a job), tirer (a weapon)
    fish: pêcher
    fit: convenir (suit), tenir (fit in a space)
    fix: réparer, fixer, arranger
    flap: claquer, battre (wings)
    flare: flamboyer
    flash: scintiller, clignoter
    flatter: flatter
    flavor: assaisonner, aromatiser
    flee: fuir
    fling: lancer, balancer
    flip: retourner, basculer
    flirt: flirter
    float: flotter
    flood: inonder
    flourish: prospérer, fleurir
    flow: couler, circuler
    flutter: voleter, flotter
    fly: voler
    focus: concentrer, focaliser
    fold: plier
    follow: suivre
    fool: duper, tromper
    forbid: interdire
    force: forcer, contraindre
    forecast: prévoir, pronostiquer
    foresee: prévoir, pressentir
    forge: forger, falsifier
    forget: oublier
    forgive: pardonner
    form: former
    format: formater
    formulate: formuler
    found: fonder
    fracture: fracturer
    frame: encadrer
    free: libérer
    freeze: geler, congeler
    frighten: effrayer, apeurer
    frown: froncer
    frustrate: frustrer
    fry: poêler (pan-fry), griller
    fuel: alimenter, ravitailler
    fulfill: accomplir, remplir, réaliser
    function: fonctionner
    furnish: meubler, équiper
    fuse: fusionner, fondre
    gain: gagner, acquérir
    gallop: galoper
    gamble: parier, jouer
    gather: rassembler, recueillir, cueillir
    generate: générer, produire
    gesture: gesticuler
    get: obtenir, recevoir (receive), attraper (catch)
    give: donner
    give up: abandonner, renoncer
    glorify: glorifier
    glow: briller, rayonner
    glue: coller
    go: aller
    go back: retourner, revenir
    go on: continuer, poursuivre
    go out: sortir
    gossip: bavarder, cancaner
    govern: gouverner
    grab: saisir, attraper, empoigner
    grade: noter, classer
    graduate: diplômer
    graft: greffer
    grant: accorder, octroyer
    grasp: saisir, comprendre
    grate: râper
    graze: brouter, effleurer (touch lightly)
    greet: saluer, accueillir
    grieve: affliger, déplorer
    grill: griller
    grind: moudre, broyer
    grip: saisir, serrer
    groan: gémir, grogner
    grow: grandir, pousser (plants), cultiver (crops)
    grow up: grandir
    growl: grogner, gronder
    grunt: grogner
    guarantee: garantir
    guard: garder, surveiller
    guess: deviner, supposer
    guide: guider
    gulp: avaler, engloutir
    gush: jaillir
    hack: pirater
    hail: grêler
    halt: arrêter, stopper
    hammer: marteler
    hamper: gêner, entraver
    hand over: remettre, livrer
    handle: manier, gérer, manipuler
    hang: pendre, suspendre, accrocher
    hang up: raccrocher, accrocher
    happen: arriver, survenir
    harass: harceler
    harden: durcir
    harm: nuire, blesser
    harmonize: harmoniser
    harvest: récolter, moissonner
    hate: détester, haïr
    haul: traîner, remorquer
    have: avoir
    heal: guérir, cicatriser
    heap: entasser, amonceler
    hear: entendre
    heat: chauffer
    heighten: intensifier, accentuer
    help: aider
    hesitate: hésiter
    hide: cacher, dissimuler
    highlight: souligner, surligner
    hijack: détourner
    hinder: entraver, empêcher
    hint: suggérer, insinuer
    hire: embaucher, engager, louer (rent)
    hit: frapper, taper, heurter
    hoard: amasser, thésauriser
    hold: tenir, soutenir
    hold on: patienter, tenir
    honor: honorer
    hook: accrocher, crocher
    hop: sautiller
    hope: espérer
    host: héberger, accueillir, animer (a show)
    hover: planer, flotter
    howl: hurler
    hug: étreindre, embrasser
    hum: fredonner, bourdonner
    humiliate: humilier
    hunt: chasser
    hurl: lancer, jeter
    hurt: blesser, souffrir (to ache)
    hypnotize: hypnotiser
    identify: identifier
    idolize: idolâtrer
    ignore: ignorer
    illuminate: éclairer, illuminer
    illustrate: illustrer
    imagine: imaginer
    imitate: imiter
    immerse: plonger, immerger
    immobilize: immobiliser
    impeach: destituer, accuser
    impede: entraver, empêcher
    implement: implémenter, appliquer
    implore: implorer, supplier
    imply: impliquer, sous-entendre (suggest)
    import: importer
    impose: imposer
    impress: impressionner
    imprison: emprisonner
    improve: améliorer
    incite: inciter
    incline: incliner
    include: inclure
    incorporate: incorporer
    increase: augmenter
    incur: encourir
    indicate: indiquer
    induce: induire, provoquer
    infect: infecter
    infer: déduire, inférer
    inflate: gonfler
    inflict: infliger
    influence: influencer
    inform: informer
    infringe: enfreindre
    ingest: ingérer
    inhabit: habiter
    inhale: inhaler, aspirer
    inherit: hériter
    inhibit: inhiber
    initiate: initier, amorcer
    inject: injecter
    injure: blesser, léser
    inquire: demander, enquêter
    insert: insérer, introduire
    insinuate: insinuer
    insist: insister
    inspect: inspecter
    inspire: inspirer
    install: installer
    instruct: instruire, enseigner
    insult: insulter
    insure: assurer
    integrate: intégrer
    intend: compter, projeter
    intensify: intensifier
    interact: interagir
    interest: intéresser
    interfere: interférer, intervenir (get involved)
    interpret: interpréter
    interrogate: interroger
    interrupt: interrompre
    intervene: intervenir
    interview: interviewer
    intimidate: intimider
    intrigue: intriguer
    introduce: présenter (a person), introduire
    invade: envahir
    invent: inventer
    invest: investir
    invite: inviter
    invoice: facturer
    invoke: invoquer
    involve: impliquer
    iron: repasser
    irritate: irriter, agacer
    isolate: isoler
    issue: émettre, délivrer
    itch: démanger
    jam: coincer, bloquer
    jeer: huer
    jingle: tinter
    jog: trotter, courir (run)
    join: joindre, rejoindre, unir (unite)
    joke: plaisanter
    jolt: secouer, cahoter
    journey: voyager
    judge: juger
    jump: sauter
    justify: justifier
    keep: garder, conserver, maintenir
    keep on: continuer, poursuivre
    kick: botter
    kidnap: enlever, kidnapper
    kill: tuer
    kindle: allumer, attiser
    kiss: embrasser
    knead: pétrir
    knit: tricoter
    knock: frapper (at a door), cogner
    knot: nouer
    know: savoir (facts, how to), connaître (people, places)
    label: étiqueter
    lack: manquer
    lament: déplorer, regretter
    land: atterrir
    languish: languir
    lash: fouetter
    last: durer
    laugh: rire
    launch: lancer
    launder: laver, blanchir
    lay: poser, déposer
    lead: mener, diriger, guider
    leak: fuir, couler
    lean: pencher, appuyer
    leap: bondir, sauter
    learn: apprendre
    leave: partir (depart), quitter, laisser (leave behind)
    legislate: légiférer
    lend: prêter
    lengthen: allonger, rallonger
    let: laisser, permettre
    let down: décevoir
    level: niveler, aplanir
    liberate: libérer
    lick: lécher
    lie: mentir
    lift: lever, soulever
    light: allumer, éclairer
    lighten: alléger, éclaircir
    like: aimer
    limit: limiter
    linger: traîner, persister
    link: lier, relier
    liquidate: liquider
    listen: écouter
    listen to: écouter
    live: vivre, habiter (reside)
    load: charger
    loathe: détester, exécrer
    locate: localiser, situer
    lock: verrouiller, bloquer
    log: enregistrer, consigner
    long: aspirer, désirer
    look: regarder
    look after: soigner, garder
    look at: regarder
    look for: chercher
    look up: chercher, consulter
    loosen: desserrer, relâcher
    lose: perdre
    love: aimer, adorer
    lower: baisser, abaisser
    lull: bercer, apaiser
    lurk: guetter, rôder
    magnify: agrandir, grossir
    maim: mutiler
    maintain: maintenir, entretenir
    make: faire, fabriquer
    make up: inventer, maquiller (cosmetics)
    malfunction: flancher, dysfonctionner
    manage: gérer, diriger, réussir (succeed in)
    mangle: déchiqueter, mutiler
    manipulate: manipuler
    manufacture: fabriquer, produire
    map: cartographier
    march: marcher, défiler
    marinate: mariner
    mark: marquer
    market: commercialiser
    marvel: admirer, émerveiller
    mash: écraser, piler
    mask: masquer
    massage: masser
    master: maîtriser
    match: assortir, apparier, égaler
    materialize: matérialiser
    matter: importer, compter
    maximize: maximiser
    mean: signifier
    measure: mesurer
    mediate: arbitrer, intercéder
    meet: rencontrer, retrouver (arrange to meet)
    melt: fondre, dissoudre
    memorize: mémoriser, apprendre
    mend: réparer, raccommoder
    mention: mentionner, évoquer
    meow: miauler
    merge: fusionner, fondre
    merit: mériter
    migrate: migrer
    mimic: imiter, mimer
    minimize: minimiser, réduire
    mislead: tromper, induire
    misplace: égarer
    miss: rater (a bus, a chance), regretter (feel the absence of)
    mistake: confondre
    mix: mélanger
    mobilize: mobiliser
    mock: railler, ridiculiser
    modify: modifier
    moisten: humidifier, humecter
    mold: mouler, modeler
    monitor: surveiller, contrôler
    mortgage: hypothéquer
    motivate: motiver
    mount: grimper, enfourcher (a horse or bike)
    move: bouger, déplacer, déménager (relocate)
    muffle: étouffer, assourdir
    multiply: multiplier
    mumble: marmonner, bredouiller
    munch: mâcher, croquer
    murder: assassiner
    murmur: murmurer
    muse: méditer, songer
    must: devoir (obligation)
    mutter: marmonner, grommeler
    nag: harceler, asticoter
    nail: clouer
    name: nommer
    narrow: rétrécir, resserrer
    navigate: naviguer
    need: falloir (to be necessary), nécessiter (to require)
    neglect: négliger
    negotiate: négocier
    nest: nicher
    neutralize: neutraliser
    nibble: grignoter
    nod: acquiescer, hocher (the head)
    nominate: nommer, désigner
    notice: remarquer, apercevoir, constater
    notify: notifier, informer
    nourish: nourrir
    nudge: pousser, bousculer
    numb: engourdir, anesthésier
    obey: obéir
    object: objecter, protester
    oblige: obliger, contraindre
    obscure: obscurcir, masquer
    observe: observer
    obsess: obséder
    obstruct: obstruer, entraver
    obtain: obtenir
    occupy: occuper
    occur: survenir, arriver
    offend: offenser, froisser
    offer: offrir, proposer
    offset: compenser, contrebalancer
    omit: omettre
    ooze: suinter, dégouliner
    open: ouvrir
    operate: opérer, fonctionner
    oppose: opposer
    oppress: opprimer
    optimize: optimiser
    orchestrate: orchestrer
    order: ordonner (command), commander (a meal), ranger (arrange)
    organize: organiser
    orient: orienter
    oust: évincer, expulser
    outdo: surpasser
    outline: esquisser, tracer
    outperform: surpasser, dépasser
    overcome: surmonter, vaincre
    overdo: exagérer
    overflow: déborder
    overhear: entendre
    overlap: chevaucher
    overpower: dominer, terrasser
    override: annuler, outrepasser
    overrule: annuler, infirmer
    oversee: superviser
    overtake: dépasser, doubler
    overthrow: renverser
    overturn: renverser, retourner
    overwhelm: accabler, submerger
    overwrite: écraser, remplacer
    owe: devoir
    own: posséder
    pacify: pacifier, apaiser
    pack: emballer, empaqueter
    paddle: pagayer, ramer
    paint: peindre
    parade: défiler
    paralyze: paralyser
    paraphrase: paraphraser, reformuler
    park: garer, stationner
    parody: parodier
    partake: participer
    participate: participer
    pass: passer, dépasser
    paste: coller
    pat: tapoter, caresser
    patch: rapiécer, réparer
    patrol: patrouiller
    pause: suspendre, interrompre
    pave: paver
    pawn: nantir (give as security), gager
    pay: payer
    pay back: rembourser, rendre
    pedal: pédaler
    peek: épier, lorgner
    peel: éplucher, peler
    penalize: pénaliser
    perceive: percevoir
    perch: percher, jucher
    perfect: perfectionner
    perform: exécuter, accomplir, jouer
    perish: périr
    permit: permettre
    perpetuate: perpétuer
    persevere: persévérer
    persist: persister
    persuade: persuader, convaincre
    pester: importuner, harceler
    phone: téléphoner, appeler
    photograph: photographier
    pick: choisir, cueillir (flowers, fruit)
    pick out: choisir, repérer
    pick up: ramasser, récupérer
    pierce: percer, transpercer
    pile up: empiler, entasser
    pilot: piloter
    pin: épingler, fixer
    pinch: pincer
    pinpoint: repérer, localiser
    pitch: lancer, planter (a tent)
    pity: plaindre
    place: placer, mettre, poser
    plague: tourmenter, harceler
    plan: planifier, projeter, prévoir
    plant: planter
    plaster: plâtrer, enduire
    play: jouer
    plead: plaider, implorer
    please: plaire, contenter
    pledge: promettre, jurer
    plot: comploter, tramer
    plow: labourer
    pluck: arracher, plumer (a bird)
    plug: brancher, boucher
    plunder: piller
    plunge: plonger
    point: pointer, indiquer, montrer
    point out: signaler, indiquer
    poison: empoisonner
    poke: piquer, fourrer
    polish: polir, astiquer
    pollute: polluer
    ponder: réfléchir, méditer
    pop: éclater, crever
    populate: peupler
    portray: dépeindre, représenter
    pose: poser
    position: placer, positionner
    possess: posséder
    post: publier, poster, afficher
    postpone: reporter, repousser
    pound: marteler, pilonner
    pour: verser, servir
    practice: pratiquer, répéter (rehearse)
    praise: louer (praise), féliciter
    pray: prier
    preach: prêcher
    precede: précéder
    predict: prédire
    prefer: préférer
    preheat: préchauffer
    preoccupy: préoccuper
    prepare: préparer
    prescribe: prescrire
    present: présenter
    preserve: préserver, conserver
    preside: présider
    press: presser, appuyer
    presume: présumer, supposer
    pretend: feindre, simuler
    prevail: prévaloir, prédominer
    prevent: empêcher, prévenir
    prick: piquer
    print: imprimer
    probe: sonder, enquêter
    proceed: procéder, continuer
    process: traiter
    proclaim: proclamer
    produce: produire
    profess: professer, déclarer
    program: programmer
    progress: progresser
    prohibit: interdire, prohiber
    project: projeter
    prolong: prolonger
    promise: promettre
    promote: promouvoir, encourager
    prompt: inciter, pousser
    pronounce: prononcer
    propagate: propager
    propel: propulser
    propose: proposer
    prosecute: poursuivre, inculper
    prosper: prospérer
    protect: protéger
    protest: protester
    protrude: dépasser
    prove: prouver, démontrer
    provide: fournir, procurer
    provoke: provoquer
    prune: tailler, élaguer
    pry: fouiner, fureter
    publish: publier
    pull: tirer
    pulse: palpiter, pulser
    pump: pomper
    punch: frapper, poinçonner
    punctuate: ponctuer
    puncture: crever, perforer
    punish: punir
    purchase: acheter, acquérir
    purge: purger
    purify: purifier
    pursue: poursuivre
    push: pousser
    put: mettre, poser, placer
    put off: reporter, repousser
    puzzle: déconcerter, intriguer
    quake: trembler
    qualify: qualifier
    quarrel: disputer, quereller
    quench: étancher, éteindre
    query: interroger, questionner
    question: questionner, contester
    quit: quitter, arrêter, abandonner
    quiver: frémir, trembler
    quote: citer
    race: courir, concourir (compete)
    radiate: irradier, rayonner
    raid: attaquer, perquisitionner
    rain: pleuvoir
    raise: lever, élever (children), augmenter (increase)
    rally: rallier, rassembler
    ram: percuter, emboutir
    ramble: divaguer, flâner
    rank: classer
    rant: fulminer, vociférer
    rate: évaluer, noter
    rationalize: rationaliser
    rattle: cliqueter, secouer
    reach: atteindre, parvenir
    react: réagir
    read: lire
    reap: moissonner, récolter
    rear: élever
    reason: raisonner
    reassure: rassurer
    rebuild: reconstruire
    rebuke: réprimander
    recall: rappeler, évoquer
    recede: reculer, refluer
    receive: recevoir
    recharge: recharger
    reciprocate: rendre (a favor)
    recite: réciter
    reckon: calculer, estimer
    reclaim: récupérer, réclamer
    recline: incliner, allonger
    recognize: reconnaître
    recoil: reculer, sursauter
    recommend: recommander
    reconcile: réconcilier, concilier
    reconsider: reconsidérer
    record: enregistrer
    recount: raconter, relater
    recover: récupérer, guérir (heal), retrouver
    recreate: recréer, reproduire
    recruit: recruter
    rectify: rectifier
    recycle: recycler
    redeem: racheter
    redirect: rediriger, réorienter
    redo: refaire
    reduce: réduire, diminuer
    refer: renvoyer, référer
    refine: raffiner, affiner
    reflect: refléter, réfléchir
    reform: réformer
    refrain: retenir, éviter
    refresh: rafraîchir, actualiser (a page)
    refrigerate: réfrigérer
    refund: rembourser
    refuse: refuser
    regain: retrouver, regagner
    regard: considérer, regarder
    regenerate: régénérer
    register: enregistrer, inscrire
    regret: regretter
    regulate: réguler, réglementer
    rehearse: répéter
    reign: régner
    reinforce: renforcer
    reiterate: réitérer
    reject: rejeter, refuser
    rekindle: raviver, rallumer
    relapse: rechuter
    relate: relier, raconter (tell)
    relax: détendre, relaxer
    relay: relayer, retransmettre
    release: libérer, relâcher, publier (a product)
    relegate: reléguer
    relent: céder, fléchir
    relieve: soulager
    relish: savourer, apprécier
    reload: recharger
    rely: compter, dépendre
    remain: rester
    remark: remarquer, observer, noter
    remedy: remédier, guérir
    remember: retenir (keep in mind), commémorer (honor the memory of)
    remind: rappeler
    remit: remettre, envoyer (money)
    remodel: remodeler, transformer
    remove: enlever, retirer, supprimer
    rename: renommer
    renew: renouveler
    renounce: renoncer
    renovate: rénover, restaurer
    rent: louer
    repair: réparer
    repay: rembourser, rendre
    repeal: abroger
    repeat: répéter
    repel: repousser, rebuter
    replace: remplacer
    replenish: réapprovisionner, remplir
    reply: répondre
    report: signaler, rapporter
    represent: représenter
    repress: réprimer
    reprimand: réprimander
    reproach: reprocher
    reproduce: reproduire
    request: demander, solliciter
    require: exiger, nécessiter
    reschedule: reprogrammer, reporter
    rescind: rescinder, annuler
    rescue: sauver, secourir
    research: rechercher, étudier
    reserve: réserver
    reshape: remodeler, refaçonner
    reside: résider, habiter
    resign: démissionner
    resist: résister
    resolve: résoudre
    resort: recourir
    respect: respecter
    respond: répondre, réagir
    rest: reposer
    restart: redémarrer, recommencer
    restore: restaurer, rétablir
    restrain: retenir, contenir
    restrict: restreindre, limiter
    result: résulter, aboutir
    resume: reprendre, recommencer
    resurrect: ressusciter
    retain: retenir, conserver
    retreat: reculer
    retrieve: récupérer, retrouver
    return: retourner, revenir, rendre (give back)
    reunite: réunir, réconcilier
    reveal: révéler
    reverse: inverser, renverser
    revert: revenir, retourner
    review: réviser, examiner
    revise: réviser, modifier
    revive: ranimer, ressusciter
    revoke: révoquer, abroger
    revolutionize: révolutionner
    reward: récompenser
    rhyme: rimer
    ride: chevaucher, rouler
    ring: sonner, retentir
    rinse: rincer
    rip: déchirer
    ripple: onduler, friser
    rise: monter, augmenter
    risk: risquer, hasarder
    rival: rivaliser
    roam: errer, vagabonder
    roar: rugir
    roast: rôtir
    rob: voler, cambrioler
    roll: rouler
    rotate: tourner, pivoter
    rouse: réveiller, éveiller
    route: acheminer, diriger
    row: ramer
    rub: frotter
    ruin: ruiner, ravager
    rule: gouverner, régner
    rumble: gronder, retentir
    rummage: fouiller
    run: courir
    run away: fuir, déguerpir
    rupture: rompre, éclater
    rush: presser, foncer
    rust: rouiller
    rustle: chuchoter, murmurer
    sabotage: saboter
    sacrifice: sacrifier
    sadden: attrister
    safeguard: sauvegarder, protéger
    sail: naviguer, voguer
    salute: saluer
    salvage: sauver, récupérer
    sanction: sanctionner
    sanitize: désinfecter, assainir
    sap: affaiblir, épuiser
    satisfy: satisfaire
    saturate: saturer
    save: économiser (money), sauver (rescue), conserver (keep)
    savor: savourer
    saw: scier
    say: dire
    scale: escalader, gravir
    scan: scanner, numériser
    scandalize: scandaliser
    scar: cicatriser, marquer
    scare: effrayer, terrifier
    scatter: éparpiller, disperser
    schedule: programmer, planifier
    scheme: comploter, intriguer
    scold: gronder, réprimander
    scoop: puiser, ramasser
    scorch: roussir, brûler
    score: marquer, noter
    scorn: dédaigner, mépriser
    scour: récurer, fouiller
    scout: explorer, repérer
    scrape: gratter, racler
    scratch: gratter, rayer
    scream: crier, hurler
    screw: visser
    scribble: griffonner, gribouiller
    scroll: défiler
    scrub: frotter, récurer
    scrutinize: scruter, examiner
    sculpt: sculpter
    seal: sceller, cacheter
    search: chercher, fouiller
    season: assaisonner
    secure: sécuriser, fixer
    sedate: sédater, calmer
    seduce: séduire
    see: voir
    seek: chercher, rechercher
    seem: sembler, paraître
    segment: segmenter
    segregate: séparer, isoler
    select: sélectionner, choisir
    sell: vendre
    send: envoyer, expédier
    send back: renvoyer, retourner
    sentence: condamner
    separate: séparer
    serve: servir
    set: poser, placer, régler (set a clock)
    set off: partir, déclencher
    set up: installer, configurer, établir
    settle: régler, résoudre
    sever: trancher, couper
    sew: coudre
    shackle: enchaîner, entraver
    shade: ombrager, nuancer
    shake: secouer, trembler
    shampoo: shampouiner, laver
    shape: façonner, former
    share: partager
    shatter: briser, fracasser
    shave: raser
    shear: tondre
    shed: verser, perdre (hair, leaves)
    shelter: abriter, protéger
    shift: déplacer, changer
    shimmer: miroiter, chatoyer
    shine: briller, luire
    shiver: frissonner, trembler
    shock: choquer, scandaliser
    shoo: chasser, éloigner
    shoot: tirer, fusiller
    shorten: raccourcir
    should: devoir (advice, obligation)
    shout: crier
    shove: bousculer, pousser
    shovel: déblayer, creuser (dig)
    show: montrer, présenter
    show off: parader, frimer
    show up: apparaître, arriver
    shred: déchiqueter, râper
    shrink: rétrécir, diminuer
    shudder: frémir, frissonner
    shuffle: battre, mélanger (cards)
    shun: éviter, fuir
    shut: fermer
    sidestep: esquiver, contourner
    siege: assiéger
    sift: tamiser, passer
    sigh: soupirer
    sign: signer
    signal: signaler
    silence: museler, étouffer
    simplify: simplifier
    simulate: simuler
    sing: chanter
    singe: roussir, flamber
    sink: couler, enfoncer
    sip: siroter, déguster
    skate: patiner
    sketch: esquisser, croquer
    skewer: embrocher, enfiler
    ski: skier
    skim: écrémer (milk), survoler (a text)
    skip: sauter, omettre
    slam: claquer, cogner
    slander: calomnier
    slap: gifler
    slash: taillader, trancher
    sleep: dormir
    slice: trancher, couper, émincer
    slide: glisser
    slip: glisser, déraper
    slither: ramper, serpenter
    slow: ralentir
    smash: fracasser, briser
    smear: étaler, barbouiller
    smell: sentir, flairer
    smile: sourire
    smoke: fumer
    smooth: lisser, aplanir
    smother: étouffer
    smuggle: trafiquer
    snap: casser, claquer
    snarl: gronder, grogner
    snatch: arracher, saisir
    sneeze: éternuer
    sniff: renifler, flairer
    snooze: sommeiller
    snore: ronfler
    snow: neiger
    soak: tremper, imbiber
    sob: sangloter
    socialize: socialiser, fréquenter
    soften: adoucir, ramollir
    solicit: solliciter
    solidify: solidifier
    solve: résoudre
    soothe: apaiser, calmer
    sort: trier, classer
    sound: sonner, résonner
    sow: semer
    sparkle: scintiller, étinceler
    spawn: engendrer, frayer
    speak: parler
    specify: spécifier, préciser
    speculate: spéculer
    speed: accélérer, filer
    spell: épeler
    spend: dépenser (money), passer (time)
    spill: renverser, verser
    spin: tourner, filer
    spit: cracher
    splash: éclabousser
    splinter: éclater, fendre
    split: diviser, fendre, partager
    spoil: gâter, abîmer
    sponsor: parrainer, sponsoriser
    spot: repérer, apercevoir
    sprain: fouler, tordre
    spray: vaporiser, arroser
    spread: étendre, répandre, propager
    sprinkle: saupoudrer, asperger
    spur: éperonner, stimuler
    squander: gaspiller, dilapider
    squeal: couiner, crier
    squeeze: presser, serrer
    squint: plisser, loucher
    stab: poignarder
    stabilize: stabiliser
    stagger: chanceler, tituber, échelonner
    stain: tacher, souiller
    stall: caler
    stamp: tamponner, estampiller
    start: commencer, démarrer, débuter
    startle: surprendre, effaroucher
    stash: cacher, planquer
    state: déclarer, affirmer
    stay: rester
    steady: stabiliser, affermir
    steal: voler, dérober
    steer: diriger, piloter
    sterilize: stériliser
    stew: mijoter, braiser
    stick: coller, planter
    stifle: étouffer, réprimer
    stigmatize: stigmatiser
    stimulate: stimuler
    sting: piquer
    stink: puer, empester
    stipulate: stipuler
    stir: remuer, agiter
    stitch: coudre, suturer
    stop: arrêter, cesser
    store: stocker, ranger
    storm: assaillir, envahir
    straighten: redresser, ranger
    strain: filtrer, tendre, forcer
    strangle: étrangler
    strap: sangler, attacher
    stray: errer, vagabonder
    strengthen: renforcer, fortifier
    stress: souligner, stresser
    stretch: étirer, tendre
    strew: joncher, parsemer
    string: enfiler
    strip: dénuder, dépouiller
    stroke: caresser
    stroll: flâner, promener
    struggle: lutter, batailler
    strum: gratter, pincer
    study: étudier
    stuff: bourrer, farcir
    stumble: trébucher
    stun: assommer, abasourdir
    subdue: soumettre, maîtriser
    submit: soumettre, présenter
    subscribe: souscrire, abonner
    subsidize: subventionner
    substitute: substituer, remplacer
    subtract: soustraire
    succeed: réussir
    succumb: succomber
    suck: sucer, aspirer
    sue: poursuivre, assigner
    suffer: souffrir
    suffocate: suffoquer, étouffer
    suggest: suggérer, proposer
    suit: convenir
    sum: additionner, totaliser
    summarize: résumer
    summon: convoquer, appeler
    supersede: remplacer, supplanter
    supervise: superviser, surveiller
    supplement: compléter, augmenter
    supply: fournir, approvisionner
    support: soutenir, appuyer
    suppose: supposer
    suppress: supprimer, réprimer
    surf: surfer
    surge: déferler, affluer
    surmise: conjecturer, supposer
    surpass: surpasser, dépasser
    surprise: surprendre, étonner
    surrender: rendre, capituler
    surround: entourer, encercler
    survey: sonder, inspecter
    survive: survivre
    suspect: soupçonner
    suspend: suspendre
    sustain: soutenir, maintenir
    swallow: avaler
    swap: échanger
    sway: balancer, osciller
    swear: jurer
    sweat: transpirer, suer
    sweep: balayer
    sweeten: sucrer, adoucir
    swell: gonfler, enfler
    swim: nager
    swindle: escroquer, arnaquer
    swing: balancer, osciller
    swipe: glisser, voler (steal)
    switch: changer, basculer
    symbolize: symboliser
    sympathize: compatir
    sync: synchroniser
    synchronize: synchroniser
    synthesize: synthétiser
    tack: clouer, punaiser
    tackle: aborder, affronter
    tag: étiqueter, marquer
    tailor: adapter, ajuster
    taint: souiller, contaminer
    take: prendre, emporter (take along), amener
    take care of: soigner, veiller
    take off: décoller (a plane), enlever (clothes)
    take part: participer
    talk: parler, discuter, causer
    tally: compter, totaliser
    tame: apprivoiser, dompter
    tamper: falsifier, manipuler
    tan: bronzer, tanner
    tangle: emmêler, enchevêtrer
    tap: taper, tapoter
    tape: enregistrer, scotcher
    taper: effiler, affiner
    target: viser, cibler
    tarnish: ternir, souiller
    taste: goûter, déguster
    tattoo: tatouer
    taunt: provoquer, narguer
    tax: imposer, taxer
    teach: enseigner
    tear: déchirer
    tear down: démolir, abattre
    tease: taquiner
    telephone: téléphoner
    tell: dire, raconter (a story)
    tell off: gronder, réprimander
    tempt: tenter
    tend: tendre, soigner (care for)
    tenderize: attendrir
    terminate: terminer, résilier
    terrify: terrifier, épouvanter
    test: tester, examiner
    testify: témoigner, attester
    tether: attacher, entraver
    thank: remercier
    thaw: dégeler, décongeler
    thicken: épaissir
    thin: amincir, diluer
    think: penser (ponder), croire (believe)
    think about: penser, réfléchir
    thread: enfiler
    threaten: menacer
    thrill: électriser, passionner
    thrive: prospérer, fleurir
    throb: palpiter, battre
    throttle: étrangler, étouffer
    throw: lancer, jeter
    throw away: jeter
    thrust: enfoncer, pousser
    thump: cogner, frapper
    thunder: tonner
    thwart: contrecarrer, déjouer
    tick: cocher, marquer
    tidy: ranger
    tie: attacher, nouer
    tighten: serrer, resserrer
    tilt: incliner, basculer
    time: chronométrer
    tingle: picoter, fourmiller
    tint: teinter, colorer
    tip: incliner, renverser
    tire: fatiguer, lasser
    title: intituler, titrer
    toast: griller, toaster
    toggle: basculer, alterner
    tolerate: tolérer, supporter
    tone: tonifier
    top: dépasser, couronner
    topple: renverser, abattre
    torment: tourmenter
    torture: torturer
    toss: lancer, jeter
    touch: toucher
    tour: parcourir, visiter
    tow: remorquer
    trace: tracer, retracer
    track: suivre, pister
    trade: commercer, échanger
    train: entraîner, former
    trample: piétiner
    transcend: transcender, dépasser
    transcribe: transcrire
    transfer: transférer, virer
    transform: transformer
    translate: traduire
    transmit: transmettre
    transpire: transpirer
    transplant: transplanter, greffer
    transport: transporter
    trap: piéger, attraper
    travel: voyager
    traverse: traverser, parcourir
    tread: fouler, marcher
    treasure: chérir, apprécier
    treat: traiter, soigner
    tremble: trembler
    trick: tromper, berner
    trickle: goutter, suinter
    trigger: déclencher, activer
    trim: tailler, rogner
    trip: trébucher
    triple: tripler
    trivialize: banaliser, minimiser
    trot: trotter
    trouble: déranger, troubler
    truncate: tronquer
    trust: croire, confier (entrust)
    try: essayer, tenter, goûter (try food)
    try on: essayer
    tuck: glisser, border (a bed)
    tumble: tomber, dégringoler
    tune: accorder, régler
    tunnel: creuser
    turn: tourner
    turn around: retourner, tourner
    turn down: refuser, baisser (volume)
    turn into: transformer, devenir (become)
    turn off: éteindre
    turn on: allumer
    turn up: augmenter (volume), arriver (appear)
    tweet: tweeter
    twinkle: scintiller, pétiller
    twirl: tournoyer, pirouetter
    type: taper, saisir
    umpire: arbitrer
    unbutton: déboutonner
    uncover: découvrir, dévoiler
    underestimate: sous-estimer
    undergo: subir, éprouver
    underline: souligner
    undermine: saper, miner
    underpin: étayer, soutenir
    understand: comprendre
    understate: minimiser, atténuer
    undertake: entreprendre
    underwrite: souscrire, garantir
    undo: défaire, annuler
    undress: déshabiller, dévêtir
    unearth: déterrer, exhumer
    unfasten: détacher, défaire
    unfold: déplier, déployer
    unfurl: déployer, dérouler
    unhook: décrocher
    unify: unifier
    uninstall: désinstaller
    unite: unir, réunir
    unleash: déchaîner, libérer
    unload: décharger
    unmask: démasquer
    unpack: déballer, défaire
    unplug: débrancher
    unravel: démêler, élucider
    unroll: dérouler
    unscrew: dévisser
    unsettle: troubler, perturber
    untie: dénouer, détacher
    unveil: dévoiler, inaugurer
    unwrap: déballer, développer
    unzip: décompresser
    update: actualiser, moderniser
    upgrade: améliorer, perfectionner
    uphold: maintenir, soutenir
    uplift: élever, réconforter
    upload: téléverser, charger
    uproot: déraciner, arracher
    upset: contrarier, bouleverser
    urge: exhorter, presser
    use: utiliser, employer
    usher: accompagner, guider
    usurp: usurper
    utilize: utiliser, exploiter
    utter: prononcer, proférer
    vaccinate: vacciner
    vacuum: aspirer
    validate: valider
    value: valoriser, évaluer
    vandalize: vandaliser, dégrader
    vanish: disparaître
    vaporize: vaporiser, évaporer
    varnish: vernir
    vary: varier
    veer: virer, dévier
    vent: extérioriser, épancher
    ventilate: ventiler, aérer
    venture: oser, risquer
    verify: vérifier
    veto: opposer (a veto), bloquer
    vex: contrarier, irriter
    vibrate: vibrer
    victimize: persécuter, harceler
    videotape: filmer, enregistrer
    vie: rivaliser, concourir
    view: observer, considérer
    vilify: diffamer, dénigrer
    vindicate: justifier, innocenter
    violate: violer, enfreindre
    visit: visiter
    visualize: visualiser, imaginer
    vocalize: vocaliser
    void: annuler, invalider
    vomit: vomir
    vote: voter
    vouch: garantir, attester
    vow: jurer, promettre
    voyage: voyager
    wade: patauger
    wag: remuer, agiter
    wail: gémir, geindre
    wait: attendre
    wait for: attendre
    wait on: servir
    waive: renoncer, abandonner
    wake: réveiller, éveiller
    wake up: réveiller, éveiller
    walk: marcher, promener
    wall: murer, emmurer
    waltz: valser
    wander: errer, flâner
    wane: diminuer, décliner
    want: vouloir, désirer
    ward off: écarter, repousser
    warm: chauffer, réchauffer
    warm up: réchauffer, échauffer
    warn: avertir, prévenir
    warp: déformer, gauchir
    warrant: justifier, mériter
    wash: laver
    waste: gaspiller
    watch: regarder (look at), surveiller (keep watch)
    water: arroser
    wave: saluer, agiter
    waver: hésiter, vaciller
    weaken: affaiblir
    wean: sevrer
    wear: porter, mettre
    weave: tisser
    wed: marier, épouser
    weep: pleurer
    weigh: peser
    weigh down: alourdir, accabler
    welcome: accueillir
    weld: souder
    whack: cogner, frapper
    whip: fouetter
    whisper: chuchoter, murmurer
    whistle: siffler
    whiten: blanchir
    whittle: tailler, dégrossir
    widen: élargir
    wield: manier, brandir
    wiggle: remuer, tortiller
    win: gagner
    win over: convaincre, séduire
    wind: enrouler, serpenter
    wink: cligner
    wipe: essuyer
    wish: souhaiter, désirer
    withdraw: retirer
    wither: faner, flétrir
    withstand: résister, supporter
    witness: témoigner, constater
    wobble: vaciller, chanceler
    word: formuler, rédiger
    work: travailler, fonctionner (machines)
    work out: résoudre, élaborer
    worry: inquiéter, préoccuper
    worsen: empirer, aggraver
    worship: adorer, vénérer
    wound: blesser
    wrap: envelopper, emballer
    wreck: détruire, saccager
    wrench: arracher, tordre
    wrestle: lutter
    wring: tordre, essorer
    write: écrire
    write down: noter, inscrire
    write off: annuler, amortir
    x-ray: radiographier
    yank: tirer, arracher
    yawn: bâiller
    yearn: aspirer, languir
    yell: crier, hurler
    yelp: glapir, japper
    yield: céder, produire
    yoke: atteler
    zap: supprimer, éliminer
    zip: compresser, zipper
    zone: zoner, délimiter
    zoom: zoomer, agrandir
  `;

  // "know: savoir (facts), connaître (people)" -> { know: [{ fr, note }, ...] }
  const VERBS = parseTable(TABLE, plainEntry('fr'));

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
