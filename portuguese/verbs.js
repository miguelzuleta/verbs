/*
 * English -> Portuguese verb database (Brazilian Portuguese, 1990 spelling agreement).
 *
 * One line per English verb: `english: portuguese, portuguese (usage note)`.
 * The first Portuguese verb is the default translation. Each translation is an
 * infinitive; the engine works out the conjugation from it. Reflexive verbs
 * (-se) are not supported, so those are left out.
 */
(function (global) {
  'use strict';

  const { parseTable, plainEntry } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: abandonar, desistir (a plan or idea; give up a claim)
    abort: abortar, interromper (a process; break off)
    absorb: absorver (soak up)
    abuse: abusar (misuse), maltratar (mistreat)
    accelerate: acelerar
    accept: aceitar (a gift; an offer), acatar
    accompany: acompanhar
    accomplish: realizar, conseguir, cumprir (a feat)
    accumulate: acumular, juntar
    accuse: acusar (in court; formally), culpar (blame)
    achieve: conseguir, alcançar, atingir (a result)
    acknowledge: reconhecer (admit; confirm receipt)
    acquire: adquirir (purchase; a skill), obter
    acquit: absolver (release after a not-guilty verdict)
    act: atuar (in a play; perform a role), agir (behave; take action), representar (perform a role)
    adapt: adaptar (a text for another medium; a story for film or stage), ajustar (adjust to new conditions)
    add: adicionar, somar (in math), acrescentar (add words)
    adhere: aderir (stick; adhere to an idea), grudar (stick to), cumprir (a rule)
    adjust: ajustar, regular (a setting)
    administer: administrar (medicine; a drug; manage), gerir (manage)
    admire: admirar
    admit: admitir (let in), confessar (confess), internar (to a hospital)
    adopt: adotar (a child; a method or idea; a plan)
    adore: adorar (love dearly), venerar (worship)
    advance: avançar (move forward), progredir (make progress), adiantar (move something forward)
    advertise: anunciar (place an ad), divulgar (promote a product)
    advise: aconselhar (as an expert), recomendar (recommend)
    advocate: defender (a cause), advogar (for a cause)
    affect: afetar (concern; influence the outcome), influenciar (influence strongly), comover (move emotionally)
    age: envelhecer, amadurecer (mature, as wine)
    agitate: agitar (shake; stir up people), perturbar (upset)
    agree: concordar, combinar (agree on)
    aim: apontar (point at something), mirar, visar
    alert: alertar, avisar
    align: alinhar (bring into line)
    allocate: alocar (assign), distribuir (distribute; share out), atribuir (assign)
    allow: permitir, deixar, autorizar
    alter: alterar, modificar (modify slightly), mudar
    amaze: espantar, surpreender (be amazed)
    amend: emendar (a law), corrigir (correct), modificar
    amuse: divertir (find funny; make laugh), entreter (entertain a child)
    analyze: analisar (data or signals)
    anger: irritar, enfurecer (make angry; make furious)
    announce: anunciar (tell or declare), comunicar (let know), divulgar
    annoy: incomodar (bother), aborrecer, irritar
    answer: responder (a question), atender (a phone or door)
    anticipate: antecipar (act in advance), prever (foresee), esperar (look forward to)
    appeal: apelar (make an appeal; to someone), recorrer (a ruling; to a higher court), agradar (be attractive)
    appear: aparecer (turn up; on stage or in a story), parecer (seem), surgir
    applaud: aplaudir, elogiar (praise)
    apply: aplicar (a rule or method; put on a cream), solicitar (apply for; apply for a job), passar (spread on a surface)
    appoint: nomear (to a post), designar
    appreciate: apreciar (enjoy art), agradecer (be grateful for), valorizar (value)
    approach: abordar (a person; a problem), chegar (come near), enfrentar (tackle a problem)
    approve: aprovar (officially), autorizar
    argue: discutir (quarrel; debate), argumentar (reason; claim), brigar (quarrel)
    arise: surgir (occur), ocorrer
    arrange: organizar (plan an event), arrumar (put in order), combinar (a meeting; make plans)
    arrest: prender, deter
    arrive: chegar
    articulate: articular (utter clearly), pronunciar (pronounce), expressar (express clearly)
    ascend: subir (climb; go up), ascender (rise), escalar (a mountain)
    ask: perguntar (a question), pedir (for something; request something), interrogar (question someone)
    ask for: pedir (request), solicitar (request formally), exigir (demand)
    aspire: aspirar, almejar
    assemble: montar (parts), reunir (gather people), juntar (gather things)
    assert: afirmar, declarar, alegar (insist)
    assess: avaliar (estimate), estimar
    assign: atribuir (to a category; a task), designar (entrust a task)
    assimilate: assimilar (take in), absorver
    assist: ajudar, auxiliar
    associate: associar (link in the mind), relacionar (link), conviver (spend time with; keep company)
    assume: supor (suppose; presuppose), assumir (take on a responsibility; a duty; a role)
    assure: assegurar, garantir (promise)
    astonish: assombrar, espantar (be astonished)
    attach: anexar (a file to an email; enclose with a document), prender (fasten), colar (stick on)
    attack: atacar (assault someone), agredir (assault someone)
    attain: alcançar, atingir, obter
    attempt: tentar
    attend: assistir (an event; a class), frequentar (school regularly; a school or workplace), atender (take care of)
    attract: atrair (charm; attention), cativar (charm)
    attribute: atribuir (put down to a cause; ascribe a quality), imputar (pin blame on)
    audit: auditar (examine accounts)
    authorize: autorizar (officially)
    avoid: evitar (refrain from), esquivar (sidestep)
    award: conceder (a claim; grant), premiar (a prize), outorgar (a prize)
    back up: apoiar (support someone), respaldar (support with proof; a claim), copiar (data)
    bake: assar (put in the oven)
    balance: equilibrar (even out; bring into line), balancear, compensar (offset)
    ban: proibir, banir, vetar
    bandage: enfaixar (wrap with a bandage), curar (treat a wound)
    bang: bater (on a door; hit hard), golpear (hit hard), esbarrar (knock against something; bump)
    baptize: batizar
    bargain: pechinchar (haggle), negociar (negotiate), barganhar (haggle)
    bark: ladrar, latir
    base: basear (be based on; found on), fundamentar (found on), apoiar (rest on)
    bathe: banhar (wash a child; bathe someone), lavar
    battle: lutar (struggle), combater, batalhar
    be: ser (identity, traits), estar (state, location), ficar (location; become)
    bear: suportar, aguentar (endure; put up with), carregar (carry)
    beat: vencer (defeat), bater (hit; whisk eggs), espancar (thrash)
    beautify: embelezar, enfeitar (decorate)
    beg: implorar (implore), suplicar (plead), mendigar (beg for money)
    begin: começar, iniciar (start something; it starts)
    belch: arrotar
    believe: acreditar (trust; hold the opinion), crer, achar (think)
    belong: pertencer (a group)
    bend: dobrar (a limb), curvar (curve), inclinar (bend down)
    bet: apostar (stake money)
    bid: oferecer (make an offer; offer a price), licitar (at auction or tender)
    bill: faturar (invoice for a service), cobrar (charge a fee)
    bind: atar, obrigar (oblige by contract; legally), vincular
    bite: morder (snap at; bite hard), picar (of insects)
    blackmail: chantagear, coagir (force by threat)
    blame: culpar, responsabilizar, repreender (scold)
    bleach: descolorir (hair), alvejar (clothes), clarear (hair)
    bleed: sangrar
    blend: misturar (blend in), mesclar, combinar
    bless: abençoar
    blink: piscar (flash, as a light), pestanejar (blink the eyes)
    block: bloquear (a road), obstruir, entupir (a pipe)
    bloom: florescer, florir
    blossom: florescer (flourish), florir, prosperar (thrive)
    blow: soprar (of wind; blow away), assoprar (blow on something), ventar (of wind)
    blur: desfocar (make blurry), embaçar (become blurry; go hazy), manchar (smudge)
    board: embarcar (a ship or plane)
    boast: alardear, ostentar (swagger; show off)
    boil: ferver (water boils; bring to the boil), cozinhar (cook in water)
    bond: unir (form a bond), vincular (emotionally), colar (glue together)
    book: reservar, agendar (an appointment)
    boost: impulsionar (an economy), aumentar, reforçar
    bore: entediar (make bored), perfurar (drill a hole), furar (drill)
    bother: incomodar (disturb; trouble), importunar (trouble someone), perturbar
    bounce: quicar (as a ball; rebound), saltar (jump), rebater (rebound)
    bow: curvar (the head; bend), inclinar (lower the head), ceder (yield)
    boycott: boicotar
    brag: alardear, ostentar (boast, informal)
    brake: frear (slow down; apply the brakes), travar (bring to a stop)
    break: quebrar (into pieces; glass or plates; bones or sticks), romper (snap; break a promise), estragar (damage)
    breathe: respirar, inspirar (breathe in), expirar (breathe out)
    brew: preparar (tea or coffee), produzir (beer), infundir (tea)
    bribe: subornar, corromper
    bring: trazer (bring here), levar (take there; take away)
    bring up: criar (children), mencionar (a topic), educar (children)
    broadcast: transmitir (live; on TV; online), emitir (a TV program), difundir
    broaden: ampliar, alargar (a road), expandir
    browse: navegar (the web; web pages), folhear (flip through; a book), percorrer (look around a shop; skim)
    bruise: machucar (a body part; hurt), contundir (a body part)
    brush: escovar (teeth; hair; shoes), roçar (touch lightly), limpar (brush off dust)
    bubble: borbulhar, espumar
    buckle: afivelar (a belt; a seat belt), ceder (give way; warp under pressure), empenar (warp)
    build: construir (a house; a relationship; develop gradually), edificar, erguer (erect)
    bully: intimidar (intimidate), ameaçar (threaten), humilhar
    burden: sobrecarregar (weigh down; impose on), onerar (bear a cost), carregar (carry as a burden)
    burn: queimar (destroy by fire; scorch), arder (be on fire), incendiar (set fire to)
    burst: estourar (burst open; pop), explodir (explode), rebentar (burst open)
    bury: enterrar (a body; at a funeral; hide in the ground), sepultar
    buy: comprar, adquirir (formal)
    buzz: zumbir (hum or drone), murmurar (buzz with voices), vibrar (a buzzer)
    cage: enjaular, confinar (shut in; confine), prender (lock in)
    calculate: calcular (work out a figure), orçar (estimate costs)
    call: chamar (name; summon), ligar (phone), telefonar (by phone)
    calm: acalmar (soothe someone), tranquilizar (soothe someone), serenar
    camp: acampar
    can: poder (be able to; be allowed to), conseguir (be able to manage), saber (know how to)
    cancel: cancelar (an event; an order; a subscription), anular (a contract), desmarcar (call off an event)
    capture: capturar, conquistar (a place), registrar (record, as in a photo; an image or moment)
    care: cuidar (look after; take care of), zelar (care about), tratar (nurse)
    caress: acariciar, afagar
    carry: carregar (a heavy load), levar (on one's person; hold or have with you), transportar (transport)
    carry out: realizar (a task), executar, efetuar
    carve: esculpir (sculpt; stone), entalhar (wood), trinchar (carve meat)
    cash: descontar (a cheque), cobrar (a cheque), trocar (exchange money)
    cast: lançar (throw), escalar (actors in a play), fundir (metal)
    catch: pegar (a ball; a cold; an illness), apanhar, agarrar (grab; a falling object)
    categorize: classificar (sort; divide), categorizar
    cause: causar (bring about), provocar (trigger), ocasionar
    cease: cessar (come to an end), parar (stop an activity), acabar (come to an end)
    celebrate: comemorar (commemorate), festejar, celebrar (a ritual)
    chain: acorrentar (bind in chains), prender (with a chain)
    challenge: desafiar, contestar (dispute a claim), questionar (doubt)
    change: mudar (make different; become different), trocar (swap one thing for another; replace), transformar (transform)
    chant: cantar, entoar, recitar (recite in a murmur)
    charge: cobrar (a fee; a price), carregar (a battery), acusar (accuse formally; a crime)
    charm: encantar (delight), enfeitiçar (cast a spell; bewitch), seduzir
    chase: perseguir (run after), caçar
    chat: conversar (informal; online), prosear (informal)
    chatter: tagarelar (talk a lot), palrar (talk a lot), chilrear (birds)
    cheat: enganar (deceive), trair (cheat on a partner), colar (in exams; on a test)
    check: verificar (look and see), conferir, checar
    cheer: animar (encourage; cheer up), aclamar (shout with joy), torcer (cheer for a team)
    cherish: prezar (value highly), estimar (love dearly), acalentar (a hope or feeling)
    chew: mastigar, mascar
    chill: esfriar (get cold; cool down), gelar (chill a drink), relaxar (relax, informal)
    choke: engasgar (choke on food or smoke), sufocar (suffocate), estrangular (strangle)
    choose: escolher, eleger, optar
    chop: picar (food; mince), cortar (wood), rachar (chop firewood)
    circle: rodear (surround; go around; encircle), girar (move in a circle; fly in circles), circular (mark with a circle)
    circulate: circular (flow round; be in circulation; money, goods), espalhar (spread around), difundir (spread around)
    cite: citar (give as evidence), mencionar (name as an example)
    claim: reclamar (demand what is owed; claim money), reivindicar (a right; demand rights), afirmar (assert)
    clap: aplaudir (clap hands), bater (pat; clap hands)
    clarify: esclarecer (by investigation; explain), clarificar, explicar
    clash: chocar (conflict), colidir, divergir (be at odds)
    clasp: agarrar (hold tightly; close the hand around), segurar (hold tightly), apertar (clasp hands; in an embrace)
    classify: classificar (into groups; rate), categorizar
    clean: limpar (wash; wipe), lavar (wash), higienizar
    clean up: arrumar (tidy), limpar (make clean)
    cleanse: purificar (purify; purify ritually), limpar (wash), depurar
    clear: limpar (a table; remove; clear away), liberar (free up; a room or space), clarear (the sky; the weather clears)
    clench: apertar (a fist; lips or teeth), cerrar (a fist; teeth)
    click: clicar (click on something), estalar (tongue or fingers; make a click)
    climb: subir (go up), escalar (a mountain; scramble up)
    clip: aparar (trim; cut back), prender (fasten with a clip), recortar (cut out)
    clog: entupir (obstruct a passage; become clogged), obstruir (block)
    clone: clonar
    close: fechar (a door or window; eyes or a book; shut), encerrar (end), trancar (lock)
    clutch: agarrar (grab; seize), segurar (hold on to), apertar (clutch tightly)
    coach: treinar (train), orientar, instruir
    coax: persuadir, convencer, atrair (lure)
    code: programar (write programs), codificar (encode)
    coincide: coincidir (at the same time; match; overlap in time)
    collaborate: colaborar (produce jointly), cooperar
    collapse: desabar (a structure; fall down), desmoronar (crumble; disintegrate), colapsar (medical; a person)
    collect: colecionar (as a hobby), coletar (gather), recolher (pick up; gather in)
    collide: colidir, chocar
    color: colorir (colour in a picture; paint or colour in), tingir (dye or tint), pintar (paint)
    comb: pentear (hair), vasculhar (comb through a place)
    combat: combater (against; stamp out a problem; counter), enfrentar (confront), lutar
    combine: combinar (link), unir (link), juntar
    come: vir
    come back: voltar (return home), retornar (come again), regressar (return home)
    come in: entrar (step in)
    comfort: consolar, confortar, tranquilizar
    command: ordenar (order), comandar (lead troops; an army), mandar (order)
    commemorate: comemorar (an anniversary), homenagear (honor; the dead), lembrar (remember fondly)
    comment: comentar (remark; review), opinar (state), observar (remark)
    commit: cometer (a crime or mistake; an offense), comprometer (oblige; commit to a promise), dedicar (commit to a task)
    communicate: comunicar (convey; inform), transmitir (convey), informar (inform)
    compare: comparar
    compensate: compensar (make up for), indenizar (pay damages), ressarcir (pay for a loss)
    compete: competir (enter a contest), concorrer, disputar
    compile: compilar (source code; a list), reunir (put together; assemble), elaborar (a reference book)
    complete: completar (finish), concluir (finish), preencher (a form; fill in a form)
    complicate: complicar (get complicated), dificultar (make harder)
    compliment: elogiar, lisonjear (flatter), adular (flatter)
    comply: cumprir (a request; rules), obedecer (rules), atender (a request)
    compose: compor (music; a poem; make up), redigir (a text), formar (make up)
    comprise: abranger, incluir, compreender (consist of)
    compute: calcular, computar (in computing)
    conceal: ocultar (a fact), esconder, encobrir
    concede: conceder (grant; admit a point), admitir (admit), ceder (give ground; yield)
    conceive: conceber (a child; an idea), imaginar (imagine), idealizar (devise an idea; plan)
    conclude: concluir (infer; draw a conclusion; finish off), encerrar (end; wrap up), fechar (a deal)
    condemn: condenar (sentence), censurar
    conduct: realizar (a study; a survey; carry out), conduzir (lead; guide), reger (an orchestra)
    confess: confessar (to a priest; to police; a crime), admitir (admit)
    configure: configurar, ajustar
    confirm: confirmar (fix a booking), ratificar (reaffirm), comprovar (back up with evidence)
    confront: enfrentar (stand up to; face an opponent), confrontar, encarar (face a problem)
    confuse: confundir (mistake one for another; mix up two things), desorientar (bewilder), embaralhar (mix up)
    congratulate: parabenizar, felicitar
    connect: conectar (to a device; online), ligar (to a device)
    conquer: conquistar, vencer (overcome), subjugar (win supremacy)
    consent: consentir, concordar
    conserve: conservar (food; preserve), preservar (protect nature), economizar (save resources)
    consider: considerar (take into account; regard as), ponderar (think over), examinar (examine closely)
    consist: consistir (consist of), constar (be made up of)
    console: consolar (lift the spirits; comfort), confortar, animar (encourage)
    consolidate: consolidar (strengthen; firm up), unificar (merge), fundir (merge)
    conspire: conspirar (plot against; plot with others), tramar (plot), maquinar (plot)
    constitute: constituir (make up; establish), formar (make up), representar (amount to)
    construct: construir (build up a system), montar (assemble), edificar
    consult: consultar (ask for advice; an expert; a book), pesquisar (look up)
    consume: consumir (use up; eat or drink), gastar (use up), ingerir (eat or drink, formal)
    contact: contatar (write to someone; get hold of), procurar (get hold of)
    contain: conter (hold; hold as an ingredient; keep in check), incluir, reprimir (hold back)
    contemplate: contemplar (gaze at), refletir (reflect on; think deeply), meditar (meditate)
    contend: afirmar (maintain; assert), disputar (compete), lutar (struggle)
    continue: continuar (go on; keep going), prosseguir (formal; carry on with), seguir (go on)
    contradict: contradizer (be inconsistent with; argue against), desmentir (deny), refutar (argue against)
    contrast: contrastar (stand in contrast), comparar (set side by side)
    contribute: contribuir (money; writing), doar (donate), colaborar (writing)
    control: controlar (a machine; a device; manage), dominar (dominate), regular (regulate)
    converge: convergir (math; meet at one point; gather at one point), confluir (roads or rivers join)
    convert: converter (units; files; faith; currency; religion), transformar
    convey: transmitir (pass on a message), expressar (express; get an idea across), transportar (carry)
    convince: convencer (be convinced)
    cook: cozinhar (prepare food; rice; cook through), preparar (prepare food)
    cool: esfriar (become cold; get cool), resfriar (make cold; let cool down), refrescar (make cool)
    cooperate: cooperar, colaborar
    coordinate: coordenar (organize a group; align with others), combinar (match), alinhar (align with others)
    cope: lidar (deal with; handle), enfrentar (get through), aguentar (manage)
    copy: copiar (by hand), imitar (imitate), reproduzir
    correct: corrigir (fix an error; revise), retificar (a statement), revisar (revise)
    correspond: corresponder (match; agree), coincidir (match), escrever (write letters; exchange letters)
    corrupt: corromper (morally; data), subornar (bribe), danificar (data)
    cost: custar (money or time; take money or time)
    cough: tossir (have a coughing fit), pigarrear (clear the throat)
    counsel: aconselhar, orientar
    count: contar (add up; count on), somar (add up), confiar (count on)
    counterfeit: falsificar (imitate illegally; fake or lie), forjar (fake), adulterar (alter)
    court: cortejar (chase after), galantear, bajular (flatter)
    cover: cobrir (with a blanket; costs), tampar (put a lid on; hide), abordar (a topic)
    crack: rachar (develop cracks; of glass; of skin or walls; split), quebrar (an egg or nut; break open), decifrar (crack a code)
    crash: bater (collide; smash into; a plane), travar (a computer), despencar (markets)
    crave: ansiar (long for), desejar, cobiçar
    crawl: engatinhar (like a baby; on hands and knees), rastejar (move on the belly)
    create: criar (a file or document; in software), gerar, produzir
    credit: creditar (an amount; to an account), atribuir (give credit for), computar (count towards)
    criticize: criticar (review; speak ill of), censurar
    cross: cruzar, atravessar (a street; a region)
    crush: esmagar (smash; squash; overwhelm), triturar (grind to pieces), amassar (mash)
    cry: chorar (weep), gritar (shout), berrar (shout; informal)
    cultivate: cultivar (crops; land; a friendship or skill), plantar (grow crops), lavrar (till soil)
    cure: curar (treat; preserve meat), sarar (get well; recover), salgar (preserve meat)
    curl: encaracolar (hair; perm hair), enrolar (roll; roll up), ondular
    curse: amaldiçoar (put a curse on), praguejar (swear), xingar (swear at someone)
    cushion: amortecer (absorb a shock; soften a blow; ease an impact), acolchoar (pad), aliviar (ease)
    customize: personalizar (tailor to needs), customizar, adaptar
    cut: cortar (cut in two; with a knife; grass or hair), reduzir (reduce; cut down costs), fatiar (slice food)
    cut off: cortar (a supply or road; chop off), separar (detach), isolar (separate)
    damage: danificar (harm), prejudicar (be harmful), estragar
    dance: dançar
    dare: ousar (to do something; do boldly), desafiar (provoke or dare someone), enfrentar (brave a risk)
    darken: escurecer (cloud over; grow dim; stage lights), obscurecer
    darn: remendar (patch; mend socks), costurar (stitch)
    dash: correr (informal; hurry), disparar
    dazzle: deslumbrar (overwhelm; bewilder), ofuscar (dazzle with brightness), fascinar
    deal: lidar (deal with; cope with; handle), distribuir (cards), negociar (trade in goods; do business)
    debate: debater (discuss in detail), discutir
    debug: depurar, debugar
    decay: apodrecer (rot; rot away), deteriorar (deteriorate), decompor (break down)
    deceive: enganar, iludir
    decide: decidir (make up one's mind), resolver (resolve to do)
    decipher: decifrar
    declare: declarar (state; to customs or tax; goods, formal), proclamar (proclaim)
    decline: recusar (refuse; turn down formally; an invitation), declinar (turn down politely), diminuir (decrease; go down)
    decorate: decorar (make beautiful), enfeitar, ornamentar
    decrease: diminuir (get less; become less), reduzir (make less; reduce), baixar (fall)
    decrypt: descriptografar, decifrar (decode), decodificar
    dedicate: dedicar (a book; devote time; a work), consagrar (consecrate)
    deduct: deduzir (subtract; for tax), descontar (subtract), abater (for tax)
    deem: considerar, julgar (formal)
    defeat: derrotar, vencer
    defend: defender (protect; in court), proteger (protect)
    defer: adiar (postpone; put off; a meeting), postergar (put off), ceder (defer to someone)
    define: definir (set), estabelecer (set), determinar
    deflect: desviar (turn aside; ward off), rebater (parry; bounce back), repelir (ward off)
    degrade: degradar (make worse; deteriorate; break down), humilhar (humiliate; demean), rebaixar (demote)
    delay: atrasar (hold up; be late), adiar (postpone), demorar (be late)
    delegate: delegar, designar (send as a representative)
    delete: apagar, deletar, excluir
    deliberate: deliberar (confer; discuss officially; in a committee), refletir (think carefully), ponderar (think carefully)
    delight: encantar (make happy), alegrar (make happy), deliciar
    deliver: entregar (goods; a message), distribuir (post, parcels), proferir (a speech)
    demand: exigir, requerer
    demolish: demolir, derrubar, destruir
    demonstrate: demonstrar (prove; show), mostrar (show how something works), protestar (in protest)
    denote: denotar, indicar, significar
    denounce: denunciar (report to the police; expose), condenar (condemn publicly), delatar (inform against)
    deny: negar (say it is not true; deny a charge; refuse to give), desmentir (deny a charge), contestar (dispute)
    depend: depender (on something; it depends on), contar (rely on), confiar (rely on)
    deploy: implantar (make available, e.g., software), mobilizar (use, troops), posicionar (position)
    deport: deportar (to a camp; expel), expulsar (expel from a country), repatriar (send back)
    deposit: depositar (money; in a bank; leave for safekeeping), guardar (leave in someone's keeping), sedimentar (sediment)
    deprive: privar (of a thing; strip of rights), despojar (strip of rights), tirar (take away)
    derive: derivar (come from; branch off), obter (obtain from a source), deduzir (work out a result)
    descend: descer (climb down; go down; get off), baixar (drop), descender (be a descendant)
    describe: descrever (depict; explain), relatar (state), retratar (depict)
    deserve: merecer (be worthy of)
    design: projetar (engineer; devise), desenhar, conceber
    designate: designar (appoint; name; a person), nomear (appoint), indicar (name)
    desire: desejar (wish for; want), querer (want), almejar (hope for)
    despise: desprezar, menosprezar
    destroy: destruir (wipe out; ruin), aniquilar (annihilate), arruinar (ruin)
    detect: detectar (find by testing; prove presence), perceber (notice), constatar (ascertain)
    deteriorate: deteriorar (decline; quality), piorar (get worse), decair (decline)
    determine: determinar (decide; judge), apurar (find out), definir (decide)
    detest: detestar (dislike strongly), odiar (hate), abominar (loathe)
    devastate: devastar (ravage), arrasar (ravage; fall to ruin), abalar (crush emotionally)
    develop: desenvolver (expand; a product; grow; progress), revelar (photos), urbanizar (open up land)
    deviate: desviar (stray; veer off; come off course), divergir (depart from a norm), divagar (digress)
    devour: devorar (of animals; eat up; books), engolir (eat up)
    diagnose: diagnosticar (a condition)
    dial: discar (a phone number; press the buttons), ligar (a phone call), marcar (a phone number)
    dictate: ditar (say aloud for writing down; order), determinar (determine), impor (prescribe; order)
    die: morrer (perish; of animals; plants), falecer (pass away), perecer (perish)
    differ: diferir (become different), divergir (of opinions), discordar (of opinions)
    dig: cavar (dig a hole; dig up), escavar (mine), desenterrar (unearth; dig up roots)
    digest: digerir (food or information), assimilar (information), resumir (summarize)
    dilute: diluir (dilute a drink; mix into liquid), aguar (water down)
    dim: atenuar (fade; dim lights), escurecer (grow dim), baixar (turn down a light; headlights)
    diminish: diminuir (get weaker; shrink; weaken), reduzir, minguar (dwindle)
    dine: jantar (have a meal; dine with others), comer (have a meal)
    direct: dirigir (steer; lead; a film or play), direcionar (point or aim), orientar (give directions)
    disable: desativar (turn off a function), desabilitar (turn off a function), inutilizar (cripple a system; make unable to act)
    disagree: discordar (of opinions), divergir (opinions differ), discrepar (not match)
    disappear: desaparecer (go missing), sumir (vanish), desvanecer (vanish; literary)
    disappoint: decepcionar (let down), desapontar, frustrar
    disarm: desarmar (a person; a bomb; reduce weapons), desativar (a bomb; deactivate)
    discard: descartar (get rid of), rejeitar (reject an idea), eliminar (get rid of)
    discharge: descarregar (a battery or cargo; waste or fluid), disparar (a weapon), demitir (dismiss from a job)
    disclose: revelar (reveal; give away a secret), divulgar (make public), expor (expose)
    disconnect: desconectar (a wire; unplug), desligar (cut off power)
    discourage: desanimar (dampen spirit; be discouraged), desencorajar, dissuadir (talk out of; advise against)
    discover: descobrir (find out; learn), encontrar (come across)
    discredit: desacreditar (damage a reputation; run down), difamar (slander), caluniar (slander)
    discuss: discutir (talk over; debate), debater, conversar (talk about)
    disguise: disfarçar (hide the truth; change one's appearance), camuflar (camouflage), mascarar (hide the truth)
    disgust: repugnar (repel; feel revulsion at), revoltar (make fed up), enojar
    disinfect: desinfetar (sterilize), esterilizar (sterilize)
    dismantle: desmontar (take apart a device), desmantelar (take down; remove), desarmar (take apart)
    dismiss: demitir, despedir (fire an employee), descartar (reject an idea)
    dispatch: despachar (process for shipping; send goods), enviar (send; send people), expedir (send goods)
    dispense: distribuir (hand out), dosar (measure out), dispensar (exempt; dispense with)
    disperse: dispersar (a crowd; scatter; spread out), espalhar (scatter), dissipar
    displace: deslocar (shift; uproot people), substituir (replace), desalojar (drive out; from home)
    display: exibir (exhibit; on a screen; show), mostrar (show), expor (exhibit)
    disprove: refutar (refute in argument; overturn), desmentir (prove false), rebater (rebut)
    dispute: contestar (contest a claim; deny), discutir (quarrel), disputar (contest)
    distinguish: distinguir (tell apart; make out; identify), diferenciar (tell apart), reconhecer (recognize by sight)
    distort: distorcer (twist out of shape; misrepresent), deformar (become warped), falsear (misrepresent)
    distract: distrair (divert the mind; turn attention away), desviar (turn attention away)
    distribute: distribuir (hand out; sell goods; divide up), repartir (divide up), entregar (hand out copies)
    disturb: perturbar (upset order or calm; interrupt), incomodar (worry), atrapalhar (hinder; interrupt)
    dive: mergulhar (go underwater; dive headfirst), saltar (jump in head first)
    diversify: diversificar (risk, investments; a business), variar (become varied)
    divide: dividir (in math; split into parts), separar (separate), repartir (split into parts)
    divorce: separar (separate legally), divorciar (dissolve a couple's marriage)
    do: fazer (casual), realizar (carry out; perform)
    document: documentar (put in writing), registrar (minutes), comprovar (support with evidence)
    dodge: esquivar (escape; evade), driblar (evade), evitar (get out of)
    dominate: dominar (rule over; overwhelm; tower over), controlar (control), predominar
    donate: doar (money; goods or books; blood), contribuir (endow)
    double: duplicar (become doubled), dobrar
    doubt: duvidar, desconfiar (suspect), questionar
    download: baixar (a file)
    draft: redigir (a document; a law or document), esboçar (make a rough copy), recrutar (military)
    drag: arrastar (pull roughly; along the ground; with a mouse; on a screen), puxar (pull)
    drain: drenar (let liquid out; drain water), esvaziar (empty), esgotar (deplete)
    draw: desenhar (sketch; a picture), tirar (pull; a card or weapon; a card or lot), traçar (a line)
    dread: temer (fear; fear a bad outcome), recear (shrink from)
    dream: sonhar (dream or hope), devanear (daydream)
    dress: vestir (put clothes on; change clothes; dress someone), curar (a wound), temperar (a salad)
    dribble: driblar (a ball), babar (drool), gotejar (trickle; drip)
    drift: flutuar (float along; float around), derivar (off course; be adrift at sea), vagar (wander)
    drill: perfurar (drill into the earth; oil; bore a hole), furar (a hole), treinar (train hard; practise drills)
    drink: beber (of animals, or heavily; gulp), tomar (drink up)
    drip: pingar (fall in drops; let drip), gotejar (trickle; leak), escorrer (trickle)
    drive: dirigir (a vehicle; steer or pilot), conduzir (a vehicle; a project), impulsionar (propel; power a machine)
    drizzle: chuviscar (rain lightly), garoar (rain lightly), regar (food with a liquid)
    drop: soltar (let go of; let fall), deixar (drop off a passenger), cair (fall down; fall)
    drown: afogar (die in water; kill by drowning), abafar (drown out a sound)
    dry: secar (dry out; make dry; become dry), enxugar (wipe dry), ressecar (dry out)
    dump: descartar (throw away; dispose of waste), despejar (tip out; pour out), jogar (throw away)
    duplicate: duplicar (overlap or repeat), copiar, repetir (overlap or repeat)
    dwell: morar (live in a place), habitar (inhabit), residir (formal)
    dye: tingir (tint), pintar (hair)
    earn: ganhar (earn money; make a profit), conquistar (respect or a reputation), merecer (a right)
    ease: aliviar (soften pain; relieve; alleviate), facilitar (make easier), suavizar (soften)
    eat: comer (have a meal; of animals), ingerir (formal)
    echo: ecoar (linger as an echo; resound; echo back), repetir (repeat someone's words), ressoar (resound; reverberate)
    edit: editar (a film or video; text), revisar (proofread; revise), corrigir (proofread)
    educate: educar (teach; bring up), ensinar (teach), instruir (provide schooling)
    elaborate: elaborar (work out a plan; produce carefully), detalhar (explain in detail), desenvolver (expand on a point)
    elapse: transcorrer (time passes; go by), decorrer (go by), passar (time passes)
    elect: eleger (choose by vote; formal), escolher (choose)
    elevate: elevar (raise a level; to a higher status), levantar (lift up), promover (promote)
    eliminate: eliminar (get rid of; knock out of a contest), excluir (rule out), remover (remove)
    elude: escapar (escape notice; slip away), esquivar (evade; shake off a pursuer), evitar (avoid)
    email: enviar (send an email; send by email), mandar (send a message)
    embark: embarcar (board a ship), empreender (embark on an endeavour; start on a venture), iniciar (begin a project)
    embed: incorporar (build into a system; build in), embutir (set into a surface), incrustar (set into a surface)
    embrace: abraçar (hug tight; hug each other), adotar (adopt an idea), acolher (welcome)
    embroider: bordar, enfeitar (embellish)
    emerge: surgir (appear; come to light; rise to prominence), emergir (come up into view), aparecer (appear)
    emit: emitir (a signal; give off; release), liberar (release; smoke or gas), irradiar (light or heat)
    emphasize: enfatizar, destacar, ressaltar
    employ: empregar (use; give work to), contratar (hire)
    empower: empoderar, capacitar, autorizar (authorize)
    empty: esvaziar (empty a container), desocupar (become vacant)
    enable: permitir (allow), habilitar, ativar (turn on a feature)
    enact: promulgar (proclaim a law), decretar
    enchant: encantar, enfeitiçar (cast a spell)
    encircle: rodear, cercar, circundar
    encounter: encontrar, enfrentar (a problem)
    encourage: encorajar, incentivar (promote; a practice), animar
    encrypt: criptografar, cifrar
    end: terminar (come to an end), acabar, encerrar (bring to an end)
    endorse: apoiar, endossar (a product), aprovar
    endure: suportar, aguentar, tolerar
    energize: energizar, revigorar, estimular
    enforce: aplicar (a law), impor (compel)
    engage: envolver (involve), contratar (hire), engajar
    engrave: gravar, entalhar
    enhance: melhorar, aprimorar, realçar
    enjoy: aproveitar, desfrutar (enjoy a benefit), curtir (informal)
    enlarge: ampliar, aumentar
    enlist: recrutar (recruit), alistar (join the military)
    enrage: enfurecer, irritar, exasperar
    enrich: enriquecer (enrich the mind; enrich uranium)
    enroll: matricular (in a school), inscrever, registrar
    ensure: garantir, assegurar (make sure)
    entail: implicar, acarretar, exigir (require)
    entangle: emaranhar (get tangled), enredar (drag into), embaraçar
    enter: entrar (a place; go in; come in), digitar (type in data), inserir (enter data)
    entertain: entreter, divertir (amuse), receber (host guests)
    entrust: confiar, encarregar (with a task)
    envision: imaginar, visualizar, vislumbrar
    envy: invejar
    equip: equipar
    erase: apagar (delete data), deletar
    err: errar (be wrong), pecar (sin)
    escalate: intensificar, agravar (of a conflict), acirrar
    escape: escapar, fugir (get out of), vazar (gas, liquids)
    establish: estabelecer (set firmly), fundar (found an institution), comprovar (determine a fact)
    estimate: estimar, calcular
    evacuate: evacuar (move people to safety), desocupar
    evade: esquivar (dodge), evadir (taxes; elude)
    evaluate: avaliar, analisar (analyze data)
    evaporate: evaporar, vaporizar (cause to evaporate)
    evoke: evocar (memories), despertar (draw out a feeling), suscitar
    evolve: evoluir (develop; mature), desenvolver (develop gradually), amadurecer
    exaggerate: exagerar
    exalt: exaltar (raise in rank), enaltecer (praise)
    examine: examinar (a patient), analisar, inspecionar
    excavate: escavar, cavar
    exceed: exceder (a limit), superar (surpass), ultrapassar
    excel: sobressair (stand out), brilhar (be very good at), superar (outdo others)
    exchange: trocar, intercambiar, converter (money)
    excite: empolgar, emocionar, entusiasmar
    exclude: excluir (socially), descartar (rule out)
    excuse: desculpar, dispensar (release from a duty), isentar (exempt)
    execute: executar (carry out; put to death), realizar (carry out), rodar (run a program)
    exempt: isentar, eximir, dispensar
    exercise: exercitar (train), exercer (use a right or power), treinar
    exert: exercer (influence, pressure; power), empregar (effort; ability), aplicar
    exhale: exalar, expirar (breathe out), soprar (blow out)
    exhaust: esgotar (use up; deplete), exaurir, cansar (wear out)
    exhibit: exibir, expor, mostrar (show a trait)
    exile: exilar, banir (banish)
    exist: existir
    expand: expandir, ampliar, dilatar (swell)
    expect: esperar (hope for; anticipate), supor (suppose), prever
    expedite: agilizar, acelerar, adiantar (bring forward)
    expel: expulsar (from a country; from school), expelir (drive out), deportar (from a country)
    experience: experimentar (feel a sensation), vivenciar (live through), sentir
    experiment: experimentar (try out), testar
    expire: expirar (run out), vencer (contracts; a license), caducar
    explain: explicar, esclarecer, justificar (account for an action)
    explode: explodir, estourar (burst), detonar (blow up)
    exploit: explorar (exploit people, resources), aproveitar (make use of)
    explore: explorar (a place), pesquisar (research), investigar (study in depth)
    export: exportar
    expose: expor (to danger), revelar (a secret; a scandal), descobrir (uncover)
    express: expressar, manifestar
    extend: estender (hold out; stretch out), prolongar (lengthen), prorrogar (in time)
    extinguish: apagar (a fire), extinguir (wipe out)
    extol: elogiar (praise), exaltar, enaltecer
    extract: extrair (derive from raw material), retirar (pull out), citar (quote an excerpt)
    fabricate: fabricar (manufacture), inventar (make up), forjar (invent falsely)
    face: enfrentar, encarar, confrontar
    facilitate: facilitar, viabilizar, mediar (lead a session)
    fade: desvanecer (vanish; dwindle; sounds), desbotar (lose color), murchar (wither)
    fail: falhar, fracassar, reprovar (a test; a course)
    fake: falsificar, fingir (pretend), simular
    fall: cair (rain, snow; topple), tombar, despencar (drop sharply)
    fall down: cair (tumble to the ground), tombar (topple over), desabar (collapse)
    fan: abanar, atiçar (flames; stir up)
    fascinate: fascinar, cativar (captivate), encantar
    fasten: prender (attach; secure), amarrar (tie up), abotoar (button up)
    fatigue: cansar, fatigar
    favor: favorecer, preferir (prefer), apoiar (side with)
    fear: temer, recear (be concerned)
    feed: alimentar, nutrir, amamentar (nurse a baby)
    feel: sentir, perceber (sense)
    fence: cercar (enclose with a fence), esgrimir (do the sport of fencing)
    ferment: fermentar
    fetch: buscar (go and get; data), trazer (bring), pegar
    fight: lutar (struggle for a cause), brigar (quarrel), combater (combat)
    figure out: descobrir (determine the cause), entender (grasp), resolver (solve)
    file: arquivar (put in a file), protocolar (submit a claim, a complaint), limar (file down)
    fill: encher, preencher (fill a gap), completar (refill)
    fill in: preencher (a form), completar, substituir (substitute for)
    film: filmar, rodar (a movie)
    filter: filtrar (narrow down data; filter out), coar (strain)
    finance: financiar, custear (back financially)
    find: encontrar, achar (come upon), descobrir (discover)
    find out: descobrir, investigar (look into), apurar (establish)
    fine: multar (impose a fine), penalizar (penalize an offense), punir (punish)
    finish: terminar, acabar, concluir (complete)
    fire: demitir (from a job), disparar (a weapon), atirar (shoot)
    fish: pescar
    fit: caber (fit in a space), servir (be the right size), ajustar (adjust)
    fix: consertar (a fault), reparar, fixar (fix in place)
    flap: bater (wings), tremular (a flag), agitar
    flare: flamejar (blaze up), lampejar (flash)
    flash: lampejar (flash of an idea), piscar, faiscar
    flatter: adular, lisonjear, favorecer (look good on)
    flavor: temperar (season), aromatizar (add flavoring), condimentar
    flee: fugir, escapar
    fling: arremessar (toss aside), atirar, lançar
    flip: virar (turn over; turn around), folhear (flip pages), acionar (a switch)
    flirt: flertar, paquerar
    float: flutuar, boiar (stay on the surface), pairar (hover in the air)
    flood: inundar, alagar, transbordar (overflow)
    flourish: florescer (plants), prosperar
    flow: fluir, correr (flow along), escorrer
    flutter: esvoaçar (flutter lightly; drift down), tremular (flags in the wind), bater (wings)
    fly: voar, pilotar (pilot a plane)
    focus: focar (direct attention), focalizar (a camera), concentrar (narrow down)
    fold: dobrar (clothes; paper), vincar (crease)
    follow: seguir (a person; come after), perseguir (pursue), obedecer (obey; rules, orders)
    fool: enganar (trick), iludir, brincar (joke around)
    forbid: proibir, vedar
    force: forçar (obtain by force), obrigar (compel), arrombar (force open)
    forecast: prever (weather), prognosticar, projetar (project)
    foresee: prever (look ahead), antever, pressentir (sense in advance)
    forge: forjar (metal; build ties), falsificar (counterfeit)
    forget: esquecer
    forgive: perdoar, desculpar
    form: formar (a group), constituir (make up), compor (compose)
    format: formatar
    formulate: formular (state formally), elaborar (work out; a plan)
    found: fundar, instituir (establish), doar (endow)
    fracture: fraturar (a bone), quebrar (break), romper (snap)
    frame: emoldurar (a picture), enquadrar (mount a picture)
    free: libertar (a prisoner), liberar (release), soltar (let go)
    freeze: congelar (food, assets), gelar (turn to ice; feel very cold)
    frighten: assustar (startle), amedrontar, apavorar
    frown: franzir (the forehead; one's brows), desaprovar (disapprove)
    frustrate: frustrar, impedir (hinder), contrariar (thwart)
    fry: fritar (pan-fry; deep-fry), refogar (stir-fry)
    fuel: abastecer (refuel; fill with fuel), alimentar (power; supply), atiçar (stoke a conflict; stir up emotions)
    fulfill: cumprir (a promise; a duty), realizar (achieve a dream), satisfazer (satisfy; a requirement)
    function: funcionar, atuar (act as), servir (serve a function)
    furnish: equipar (fit out a room), fornecer (provide; supply), guarnecer (fit out)
    fuse: fundir (melt; companies), soldar (weld), unir
    gain: ganhar (gain weight), obter (obtain), aumentar (increase)
    gallop: galopar
    gamble: apostar (bet), jogar (gamble at cards, casino), arriscar (risk)
    gather: reunir (bring together), juntar (collect), colher (pick up)
    generate: gerar (create value), produzir, criar (a document, report)
    gesture: gesticular, acenar (signal by hand)
    get: conseguir (obtain), receber (receive), pegar (catch; fetch)
    give: dar, entregar (hand over), oferecer (provide)
    give up: desistir, abandonar, renunciar (renounce)
    glorify: glorificar, exaltar, idealizar (idealize)
    glow: brilhar (glow with heat), resplandecer, reluzir
    glue: colar (stick on), grudar
    go: ir (head toward; by vehicle), frequentar (go regularly)
    go back: voltar, retornar, regressar (go home)
    go on: continuar, prosseguir (carry on), seguir
    go out: sair (socially; go outside; leave home), apagar (a light, a fire goes out)
    gossip: fofocar, mexericar, tagarelar (chatter)
    govern: governar, administrar (administer), controlar (control)
    grab: agarrar (seize; clutch), pegar (snatch), arrebatar
    grade: avaliar (rate; assign a grade), corrigir (mark a test), classificar (classify)
    graduate: concluir (finish school, a degree; complete a course), formar (colloquial: graduate)
    graft: enxertar (plants; tissue; skin), transplantar (transplant tissue)
    grant: conceder (permission; a request), outorgar (confer), atribuir (award)
    grasp: agarrar (take hold of; grip), compreender (understand), entender (comprehend)
    grate: ralar (cheese; grate food), ranger (squeak), irritar (irritate)
    graze: pastar (graze on grass), roçar (brush past; touch lightly), raspar (scrape the skin)
    greet: cumprimentar, saudar, receber (welcome)
    grieve: lamentar (mourn a death), afligir (cause sorrow to), chorar (mourn)
    grill: grelhar, assar (over a flame), interrogar (question hard)
    grind: moer (coffee, grain; crush), triturar (pound to powder), afiar (sharpen)
    grip: agarrar (clutch), segurar (hold fast)
    groan: gemer (in pain), resmungar (grumble)
    grow: crescer (increase; get bigger), cultivar (crops; plants), plantar (crops)
    grow up: crescer (get older), amadurecer (become mature)
    growl: rosnar (dogs), rugir (thunder)
    grunt: grunhir (with effort; of a pig), resmungar (grumble)
    guarantee: garantir, assegurar (assert with confidence), prometer (promise)
    guard: vigiar (keep watch), proteger, guardar (stand guard)
    guess: adivinhar (guess right), supor (suppose), chutar (informal)
    guide: guiar (show the way), orientar (direct; instruct), conduzir
    gulp: engolir (swallow; gulp down a drink), devorar (wolf down food), tragar
    gush: jorrar (flow in a stream; spurt up), brotar (well up), esguichar (spout or erupt)
    hack: hackear (break into a system), decifrar (crack a code, password), picar (chop up)
    hail: chamar (call over; hail a taxi), saudar (cheer), granizar (hail falls)
    halt: parar (come to a stop), interromper (cease operations), paralisar
    hammer: martelar (hammer in a nail), bater (pound)
    hamper: atrapalhar, dificultar, obstruir (block)
    hand over: entregar (pass to), repassar (hand over duties), transferir (transfer)
    handle: manejar (operate a machine; a tool), lidar (cope with; deal with), manusear (handle by hand)
    hang: pendurar (hang up; suspend), pender (dangle; be hanging), enforcar (by the neck)
    hang up: desligar (the phone; end a phone call), pendurar (coats, pictures)
    happen: acontecer, ocorrer (occur, formal), suceder (take place)
    harass: assediar (sexually), importunar (pester), incomodar
    harden: endurecer (make hard; become hard), enrijecer (make firm), fortalecer (toughen up)
    harm: prejudicar (damage), machucar (hurt), danificar
    harmonize: harmonizar, combinar (go well together), coordenar (coordinate)
    harvest: colher (a crop), ceifar (reap)
    hate: odiar, detestar (loathe)
    haul: arrastar (pull; drag), transportar (carry freight), carregar (carry)
    have: ter (auxiliary; possess), possuir (own), haver (there is; formal)
    heal: curar, sarar (get well), cicatrizar (wounds)
    heap: amontoar (be piled up), empilhar, acumular
    hear: ouvir, escutar
    heat: aquecer (a room; apply heat), esquentar (warm up food or drink), requentar (reheat food)
    heighten: intensificar, aumentar, elevar
    help: ajudar, auxiliar (assist with a task), socorrer (aid, rescue)
    hesitate: hesitar, vacilar, titubear
    hide: esconder (go into hiding), ocultar (conceal), encobrir (keep secret)
    highlight: destacar, realçar, grifar (with a marker)
    hijack: sequestrar (aircraft, vehicles; ships)
    hinder: atrapalhar, dificultar (delay), impedir (prevent)
    hint: insinuar, sugerir (suggest), aludir (allude to)
    hire: contratar (recruit; performers), alugar (rent)
    hit: bater (strike; slap), golpear (punch), acertar (hit a target)
    hoard: acumular, estocar (buy up and stockpile), entesourar
    hold: segurar (hold tight; hold in one's arms), sustentar (support weight), realizar (hold an event)
    hold on: esperar (wait), aguentar (hold out), segurar (grip; cling)
    honor: honrar (a promise or check), homenagear (with an award), cumprir (a promise)
    hook: enganchar (get caught; catch with a hook), pendurar (hang on a hook), conectar (hook up)
    hop: saltitar, pular (like a rabbit)
    hope: esperar (wish for), desejar (wish)
    host: receber (entertain guests; host an event), hospedar (lodge guests; host a website), apresentar (a show; host a program)
    hover: pairar (linger in the air), planar (circle above), rondar (loiter nearby)
    howl: uivar (wolves, dogs; wail), ulular
    hug: abraçar
    hum: cantarolar, zumbir (drone; machinery; buzz)
    humiliate: humilhar (shame in public), envergonhar (embarrass)
    hunt: caçar, procurar (hunt for)
    hurl: arremessar (fling; slam), lançar (hurl abuse), atirar
    hurt: machucar (wound; harm), doer (ache), magoar (hurt someone's feelings)
    hypnotize: hipnotizar, fascinar (mesmerize)
    identify: identificar (confirm), reconhecer (recognize)
    idolize: idolatrar, venerar (look up to), adorar
    ignore: ignorar (brush aside), desconsiderar, negligenciar (overlook)
    illuminate: iluminar, esclarecer (clarify)
    illustrate: ilustrar (add pictures), exemplificar (make clear with examples), demonstrar (demonstrate)
    imagine: imaginar (picture in the mind), supor (suppose), fantasiar (dream up)
    imitate: imitar, copiar (copy a model)
    immerse: mergulhar (dip in; be absorbed in), afundar (sink)
    immobilize: imobilizar (a limb; restrain), paralisar (paralyze; bring to a standstill), dominar (subdue)
    impeach: acusar (charge), destituir (remove from office), afastar (relieve of office)
    impede: impedir, obstruir, dificultar (slow down)
    implement: implementar (software; realize in practice), implantar (introduce a system), executar (carry out)
    implore: implorar, suplicar (appeal to)
    imply: implicar (carry as a meaning), insinuar (suggest), significar (mean)
    import: importar
    impose: impor (force upon; a tax, a rule), aplicar (a penalty), decretar (a ban)
    impress: impressionar, deslumbrar (overwhelm), marcar (imprint on the mind)
    imprison: encarcerar (lock up), aprisionar (hold captive), prender (confine)
    improve: melhorar (get better), aprimorar (skills), aperfeiçoar (raise the level)
    incite: incitar, instigar, provocar
    incline: inclinar (tilt something; lean or slope), curvar (bend forward), tender (be inclined)
    include: incluir (count in), abranger (contain), englobar
    incorporate: incorporar (work in; merge into), integrar, constituir (form a corporation)
    increase: aumentar (make larger; rise), crescer (grow in amount), elevar (raise)
    incur: incorrer (a risk; bring upon oneself), contrair (a debt), sofrer (a loss)
    indicate: indicar (state; point to), mostrar (display), assinalar (mark)
    induce: induzir (physics, logic; persuade), provocar (bring about), causar (cause)
    infect: infectar (get infected), contagiar (pass on a disease), contaminar (spread to others)
    infer: inferir (derive; deduce), deduzir (deduce), concluir
    inflate: inflar (blow up a balloon; pad figures), inchar (swell up), encher (fill with air)
    inflict: infligir (pain), causar (cause harm)
    influence: influenciar (sway), influir (act on)
    inform: informar, avisar, notificar (notify officially)
    infringe: infringir (a rule; a law), violar (a right), transgredir (break a rule)
    ingest: ingerir (a medicine; consume food), engolir (swallow), tomar (take a medicine)
    inhabit: habitar, povoar (settle)
    inhale: inalar (inhale a substance), inspirar (breathe in)
    inherit: herdar (property; traits, traditions)
    inhibit: inibir (hold down), reprimir, impedir
    initiate: iniciar (start a process; admit to a group or secret), instaurar (set about), empreender (undertake)
    inject: injetar (put funds in), aplicar (give a shot)
    injure: ferir (be injured), machucar (get hurt), lesionar (harm)
    inquire: perguntar (ask), indagar (ask about; make an inquiry), investigar (look into)
    insert: inserir (text, data), introduzir (stick into), colocar (place inside)
    insinuate: insinuar (hint slyly; allude indirectly), imputar (impute)
    insist: insistir (on; urge), teimar (insist stubbornly)
    inspect: inspecionar (make an inspection tour), vistoriar (a site), examinar
    inspire: inspirar (stir up a feeling), motivar, estimular
    install: instalar (software; equipment; fit in place), montar (mount, assemble)
    instruct: instruir (brief; train), ensinar (teach), mandar (order)
    insult: insultar (swear at), ofender, xingar (informal)
    insure: segurar (take out an insurance policy), assegurar (guarantee), garantir (make sure)
    integrate: integrar (blend in), incorporar (build in)
    intend: pretender (plan to do), planejar (plan), tencionar (aim at)
    intensify: intensificar (heat up), agravar (grow more severe), acirrar (a conflict)
    interact: interagir (things; mingle), cooperar (work together)
    interest: interessar (appeal to), atrair (attract attention), cativar (hold attention)
    interfere: interferir (meddle), atrapalhar (get in the way), intervir (get involved)
    interpret: interpretar (meaning; explain), traduzir (translate orally)
    interrogate: interrogar, questionar (probe)
    interrupt: interromper (cut in; halt), perturbar (disturb), cortar (cut off)
    intervene: intervir (step in; take action against), interceder (mediate)
    interview: entrevistar (a job candidate; as a reporter)
    intimidate: intimidar, ameaçar (threaten)
    intrigue: intrigar (arouse curiosity), fascinar (arouse interest), tramar (scheme; plot)
    introduce: apresentar (a person to someone), introduzir (bring in something new; a system), lançar (unveil a product)
    invade: invadir (a country; privacy), atacar (attack)
    invent: inventar (make up a story), criar (devise)
    invest: investir (money in an investment), aplicar (money in an investment)
    invite: convidar (invite formally; ask to join), chamar (call over), solicitar (request)
    invoice: faturar (bill), cobrar (charge)
    invoke: invocar (call upon a deity; cite as authority), chamar (call a function), acionar (put into effect)
    involve: envolver (include; be connected with), implicar (implicate in), abranger (include)
    iron: passar (clothes), engomar (starch; iron)
    irritate: irritar (annoy; inflame the skin), incomodar (get on one's nerves), aborrecer (annoy)
    isolate: isolar (quarantine; shield), separar (set apart)
    issue: emitir (a document; a statement), publicar (publish), expedir (official documents)
    itch: coçar (feel itchy), formigar (tingle)
    jam: emperrar (get stuck), travar (block), entupir (clog)
    jeer: vaiar (boo), zombar (mock), escarnecer
    jingle: tilintar (coins, keys; bells), chocalhar (shake and rattle)
    jog: correr (run), trotar (trot)
    join: unir (unite; connect), juntar (put together; join up with), aderir (become a member of; take part in)
    joke: brincar (kid around), gracejar (jest)
    jolt: sacudir (shake roughly), sacolejar (lurch), abalar (shock)
    journey: viajar (go on a trip), percorrer (travel through)
    judge: julgar (pass sentence on; try a case), avaliar (judge a contest), sentenciar (pass sentence on)
    jump: pular, saltar (jump over)
    justify: justificar (rationalize), legitimar, fundamentar (give grounds)
    keep: guardar (store), manter (maintain), cumprir (keep a promise)
    keep on: continuar (continue something), seguir (carry on), persistir
    kick: chutar (football; informal), pontapear
    kidnap: sequestrar (abduct), raptar (abduct a child)
    kill: matar, assassinar
    kindle: acender (light a fire), atiçar (rouse a feeling), despertar (arouse)
    kiss: beijar
    knead: amassar (knead dough), sovar (knead thoroughly)
    knit: tricotar, soldar (bones heal together)
    knock: bater (at a door; rap), esbarrar (bump, hit), golpear (strike)
    knot: atar (tie), amarrar
    know: saber (facts, how to), conhecer (people, places)
    label: rotular (name; stigmatize), etiquetar (write labels on), marcar (mark)
    lack: faltar (be missing), carecer (be without)
    lament: lamentar (regret), deplorar, chorar (wail, complain)
    land: aterrissar, pousar (aircraft; after a jump), atracar (ships dock)
    languish: definhar (waste away), enfraquecer (grow weak), estagnar (stagnate)
    lash: açoitar (whip; flog; rain, waves), amarrar (tie down), chicotear (whip)
    last: durar (last long), perdurar (go on), aguentar (hold up, endure)
    laugh: rir, gargalhar (burst out laughing)
    launch: lançar (a product; a rocket), disparar (a missile), iniciar (a project, a campaign)
    launder: lavar (clothes; dirty money), limpar (clean)
    lay: colocar (put down), pôr (an egg), assentar (a floor; cables)
    lead: liderar (head a group), conduzir (guide), comandar (command)
    leak: vazar (a container leaks; leak information), divulgar (divulge a secret), pingar (drip)
    lean: inclinar (tilt; lean or slope), apoiar (prop against; rely on), encostar (rest against)
    leap: saltar (leap headlong; spring up), pular
    learn: aprender (acquire a skill; master a skill), descobrir (find out), memorizar (memorize)
    leave: sair (depart; go away from), deixar (leave behind), partir (depart)
    legislate: legislar (pass a law), decretar (turn into law)
    lend: emprestar, alugar (rent or loan out)
    lengthen: encompridar (make longer), prolongar (extend in time), esticar (stretch)
    let: deixar (leave alone), permitir (permit), alugar (rent out)
    let down: decepcionar (disappoint), trair (betray someone's trust), baixar (lower)
    level: nivelar (grade ground; even out), aplanar (flatten), arrasar (raze)
    liberate: libertar (deliver from suffering), liberar, resgatar (rescue)
    lick: lamber
    lie: mentir (tell a lie; fib), deitar (lie down; be lying down)
    lift: levantar (pick up; raise), erguer (raise), suspender (lift a ban)
    light: acender (set alight; switch on a light; a candle), iluminar (illuminate; light up)
    lighten: aliviar (reduce a burden; relieve), clarear (make lighter in color; become brighter)
    like: gostar, curtir (informal; like a post), apreciar (appreciate)
    limit: limitar, restringir, delimitar
    linger: demorar (stay on; dawdle), persistir (persist), permanecer (remain; stay behind)
    link: vincular (associate; tie in with), ligar (connect), conectar (web, data)
    liquidate: liquidar (wind up a business; assets), quitar (pay off a debt), eliminar (eliminate people)
    listen: escutar (listen attentively), ouvir
    listen to: escutar (listen attentively), ouvir (music, radio)
    live: viver (be alive; make a living), morar (reside), residir (reside)
    load: carregar (load a vehicle; data; a gun), recarregar (charge a battery)
    loathe: detestar, aborrecer (have an aversion to), abominar (despise)
    locate: localizar (pinpoint with a device; find), rastrear (track down), situar (place)
    lock: trancar (lock with a key; bolt), bloquear (block, lock out), travar (get locked)
    log: registrar (record events; capture data), anotar (enter in a record), derrubar (fell trees)
    long: ansiar (long for), almejar (crave), suspirar (long for something lost)
    look: olhar (gaze at), parecer (appear; look like)
    look after: cuidar (nurse, tend), vigiar (keep an eye on), zelar (watch over)
    look at: olhar (stare at), observar (observe), examinar (examine)
    look for: procurar (try to find), buscar (seek; hunt for a suspect or thing)
    look up: consultar (in a reference book; check), pesquisar (research; search online), procurar (look up a word)
    loosen: afrouxar (slacken; loosen up), soltar (untie), desapertar
    lose: perder (forfeit; a game), extraviar (misplace)
    love: amar, adorar (cherish), querer (hold dear)
    lower: baixar (reduce a price; go down), abaixar (take down; bring down), reduzir (decrease)
    lull: embalar (lull to sleep; soothe a baby), acalmar (soothe; calm), adormecer (put to sleep)
    lurk: espreitar (watch stealthily), rondar (lurk, as danger), tocaiar (lie in ambush)
    magnify: ampliar (enlarge optically; amplify), aumentar (enlarge optically), exagerar (exaggerate)
    maim: mutilar (cut off a limb), aleijar (injure seriously), desfigurar (disfigure)
    maintain: manter (keep up; look after equipment), afirmar (assert; claim), conservar (service equipment)
    make: fazer, fabricar (manufacture), produzir (produce to order)
    make up: inventar (invent a story), maquiar (apply makeup), compensar (make up for something missed)
    malfunction: falhar (fail), quebrar (break down), pifar (colloquial, stop working)
    manage: gerenciar (run a business), administrar (administer), conseguir (succeed in doing; manage to do)
    mangle: destroçar (tear to shreds; wreck), mutilar (mutilate), estropiar (botch)
    manipulate: manipular (machines, data; people), manobrar (steer others), controlar (control)
    manufacture: fabricar, produzir
    map: mapear (chart an area; map data), associar (map one set to another), atribuir (assign)
    march: marchar (soldiers; protest march), desfilar (parade), avançar (advance on)
    marinate: marinar (soak in marinade), macerar (soak in liquid)
    mark: marcar (label; commemorate an occasion), assinalar (tick off), corrigir (grade a test; homework)
    market: comercializar (distribute; sell), vender (sell), divulgar (promote)
    marvel: admirar (be amazed at; admire), maravilhar (amaze, fill with wonder)
    mash: amassar (mash with a fork; mash potatoes), esmagar (pound), triturar (puree)
    mask: mascarar (cover up flaws; disguise), disfarçar (disguise; conceal), ocultar (conceal; hide data)
    massage: massagear (knead muscles)
    master: dominar (command a skill; a tool), superar (overcome), vencer (cope successfully)
    match: combinar (go well together; go with), corresponder (correspond to), emparelhar (pair up; match up)
    materialize: materializar (give concrete form), concretizar (come true; take shape), surgir (appear)
    matter: importar (be of consequence; make a difference), contar (count, be of significance), significar (mean something)
    maximize: maximizar (push to the limit), otimizar (optimize)
    mean: significar (signify; denote), pretender (intend), querer (intend to say)
    measure: medir (measure the dimensions of; length, size; weight), aferir (gauge)
    mediate: mediar (settle a dispute; act as go-between), intermediar (act as go-between), arbitrar (settle a dispute)
    meet: conhecer (for the first time), encontrar (run into; arrange to meet), atender (satisfy a requirement)
    melt: derreter (snow, ice), fundir (metal), dissolver (melt away)
    memorize: memorizar (retain in memory), decorar (learn by heart), gravar (impress on the mind)
    mend: remendar (patch; darn socks), consertar (repair), costurar (stitch up)
    mention: mencionar (name; bring up), citar (cite), aludir (touch on)
    meow: miar (of a cat)
    merge: fundir (combine; companies), mesclar (data, code), unificar (combine)
    merit: merecer (deserve)
    migrate: migrar (birds, herds; data, systems), emigrar (emigrate), transferir (move; migrate a system)
    mimic: imitar (reproduce closely; model on), arremedar (ape mockingly), parodiar (parody)
    minimize: minimizar (play down; a window), reduzir (reduce; shrink), diminuir
    mislead: enganar (deceive; delude), iludir (delude), induzir (lure into)
    misplace: extraviar (lose by carelessness), perder
    miss: perder (a bus, a chance), errar (a target), sentir (feel the absence of)
    mistake: confundir (confuse one for another; misunderstand)
    mix: misturar (blend; get mixed), mexer (stir together), combinar
    mobilize: mobilizar (muster), convocar (call up)
    mock: zombar (taunt sarcastically), ridicularizar, caçoar (tease)
    modify: modificar (alter the structure), alterar (change)
    moisten: umedecer (dampen; become moist), molhar (wet)
    mold: moldar (shape a character; shape in a mold), modelar (shape by hand), fundir (cast metal)
    monitor: monitorar, acompanhar (observe), vigiar (keep an eye on)
    mortgage: hipotecar (put up as collateral), penhorar (pledge as security)
    motivate: motivar (boost morale), estimular, incentivar
    mount: montar (a horse or bike; fit in place), subir (climb up; rise), escalar (climb)
    move: mover (set in motion; shift slightly), mudar (relocate; move house), deslocar (change position; move something)
    muffle: abafar (stifle; a sound), amortecer (deaden; dampen)
    multiply: multiplicar (numbers; in math; increase greatly), proliferar (grow in number), reproduzir (breed)
    mumble: murmurar, resmungar, balbuciar
    munch: mastigar (chew; munch noisily), beliscar (nibble), roer (gnaw)
    murder: assassinar (assassinate), matar (commit murder)
    murmur: murmurar (of a crowd), sussurrar (whisper), cochichar (whisper mysteriously)
    muse: refletir (reflect on), meditar, matutar (brood)
    must: dever (obligation; be supposed to), precisar (be required)
    mutter: resmungar (grumble; mutter complaints), murmurar (mumble in one's beard)
    nag: importunar (pester for something), azucrinar (pester endlessly), repreender (scold shrilly)
    nail: pregar (hammer in; fasten), cravar (drive in; pin down)
    name: denominar (give a name to), nomear (appoint to a post), batizar (give a name)
    narrow: estreitar (become narrower), reduzir (narrow down), restringir (limit)
    navigate: navegar (ships; find the way), pilotar (steer or pilot), guiar (guide through)
    need: precisar (to be necessary), necessitar (formal), requerer (require)
    neglect: negligenciar (disregard), descuidar (be lax about), omitir (omit)
    negotiate: negociar (hammer out a deal), pechinchar (haggle over a price)
    nest: aninhar (roost), nidificar (build a nest), chocar (brood)
    neutralize: neutralizar
    nibble: beliscar (sweets; eat small bites), mordiscar (bite lightly)
    nod: acenar (the head; to someone), assentir (agree)
    nominate: nomear (appoint), indicar (propose)
    notice: notar, perceber, reparar (catch sight of)
    notify: notificar, avisar, informar
    nourish: nutrir, alimentar
    nudge: cutucar (poke gently), empurrar (push lightly)
    numb: anestesiar, entorpecer (emotionally), adormecer (go numb)
    obey: obedecer, cumprir (a rule, an order)
    object: objetar, protestar (complain about)
    oblige: obrigar (compel), forçar
    obscure: obscurecer (make unclear; make vague), ocultar (hide from view), encobrir
    observe: observar, respeitar (follow a rule), comentar (remark)
    obsess: atormentar (torment), preocupar (occupy the mind), obcecar (fixate on)
    obstruct: obstruir, bloquear, impedir (a path; block)
    obtain: obter, conseguir (procure), adquirir
    occupy: ocupar (space, time; keep busy), tomar (take by force; military)
    occur: ocorrer, acontecer (an event)
    offend: ofender, insultar, magoar (hurt feelings)
    offer: oferecer, propor (propose to do)
    offset: compensar, contrabalançar
    omit: omitir, suprimir
    ooze: escorrer, vazar (leak; seep)
    open: abrir (also intransitive)
    operate: operar (a machine; surgery), funcionar (run; work), gerenciar (a business)
    oppose: combater (fight against), contestar, contrariar (be against)
    oppress: oprimir, reprimir
    optimize: otimizar
    orchestrate: orquestrar (music), coordenar (coordinate), encenar (stage)
    order: ordenar (command; arrange in order), pedir (a meal), encomendar (goods)
    organize: organizar, arrumar (tidy), ordenar (put in order)
    orient: orientar, alinhar (align), direcionar
    oust: destituir (remove from office), expulsar (drive out), afastar (displace)
    outdo: superar, ultrapassar
    outline: esboçar, delinear, resumir (explain in outline)
    outperform: superar, ultrapassar
    overcome: superar (a task), vencer (defeat), dominar
    overdo: exagerar, abusar (overexert)
    overflow: transbordar, extravasar, inundar (flood)
    overhear: entreouvir (hear by chance), ouvir (catch a remark)
    overlap: sobrepor, coincidir (in time)
    overpower: dominar (overcome), subjugar, derrotar (defeat)
    override: sobrescrever (data, a setting), anular (a decision), ignorar (disregard)
    overrule: anular (annul a decision), revogar (reverse a ruling)
    oversee: supervisionar, fiscalizar, gerenciar (manage)
    overtake: ultrapassar, alcançar (catch up with)
    overthrow: derrubar (a ruler; a plan or decision), destronar (a ruler), depor
    overturn: virar (intransitive), derrubar (knock over), anular (a verdict; a ruling)
    overwhelm: sobrecarregar (be too much for), avassalar, inundar (swamp with)
    overwrite: sobrescrever, substituir
    owe: dever (money; be indebted for)
    own: possuir, ter
    pacify: pacificar (a region), acalmar, tranquilizar (soothe)
    pack: empacotar, embalar (for shipping), arrumar (a suitcase)
    paddle: remar, chapinhar (splash in shallow water)
    paint: pintar (a picture; a wall; a car)
    parade: desfilar, exibir (show off), marchar
    paralyze: paralisar, imobilizar (bring to a standstill)
    paraphrase: parafrasear, reformular (put in other words)
    park: estacionar (a car)
    parody: parodiar, satirizar
    partake: participar (join in), compartilhar (share in), provar (food, drink)
    participate: participar, colaborar
    pass: passar (go past; an exam), entregar (hand over), aprovar (a law)
    paste: colar (text, files; glue), grudar
    pat: afagar (lightly), acariciar (stroke)
    patch: remendar, corrigir (software), consertar
    patrol: patrulhar, vigiar (guard)
    pause: pausar, interromper, parar (stop for a moment)
    pave: pavimentar, asfaltar
    pawn: penhorar, empenhar (give as security)
    pay: pagar, quitar (settle a bill)
    pay back: reembolsar (reimburse), devolver (refund), retribuir (take revenge; return a favor)
    pedal: pedalar (a bicycle; ride a bike)
    peek: espiar, espreitar
    peel: descascar (fruit, eggs, potatoes), pelar (peel off)
    penalize: penalizar, punir, sancionar
    perceive: perceber, notar, sentir (feel)
    perch: pousar (a bird on a branch), sentar (sit on the edge)
    perfect: aperfeiçoar, aprimorar (polish)
    perform: realizar (carry out), atuar (on stage), apresentar (a play, a piece; music)
    perish: perecer, morrer (die), apodrecer (rot)
    permit: permitir, autorizar (officially)
    perpetuate: perpetuar, eternizar (keep going)
    persevere: perseverar, persistir (carry on; endure)
    persist: persistir, insistir (insist), perdurar (continue to exist; last)
    persuade: persuadir, convencer
    pester: importunar, atazanar, incomodar (with questions; nag for something)
    phone: telefonar, ligar
    photograph: fotografar
    pick: escolher (choose), colher (flowers, fruit), pegar (pick up)
    pick out: escolher, selecionar (single out), identificar
    pick up: pegar (from the floor; lift), buscar (collect someone or something; a passenger), recolher (collect)
    pierce: perfurar, furar, atravessar (stab)
    pile up: empilhar, acumular (accumulate; intransitive), amontoar
    pilot: pilotar, guiar (guide through)
    pin: prender (fasten with a pin), fixar (to a board; fix in place), imobilizar (hold down)
    pinch: beliscar, apertar, surrupiar (steal, informal)
    pinpoint: localizar (locate exactly), identificar, especificar (specify)
    pitch: lançar (a ball; throw), armar (a tent), apresentar (an idea; promote)
    pity: lastimar, lamentar
    place: colocar, pôr (upright; flat), posicionar
    plague: atormentar (afflict), assolar, infestar
    plan: planejar, pretender (intend), projetar (design)
    plant: plantar, semear (sow seeds), cultivar (grow a crop)
    plaster: rebocar (a wall), engessar (a broken limb), colar (stick up; cover with posters)
    play: jogar (games, sports), tocar (an instrument; a recording), brincar (have fun)
    plead: implorar (beg), alegar (argue a case), suplicar (ask earnestly)
    please: agradar, satisfazer (satisfy), alegrar (delight)
    pledge: prometer, jurar (swear an oath)
    plot: tramar (a scheme), conspirar, traçar (a graph)
    plow: arar, lavrar (a field)
    pluck: arrancar (pull out; feathers, hair, weeds, eyebrows), colher (flowers, fruit), depenar (a bird)
    plug: conectar (plug in; connect), tampar (a hole), vedar (block a hole)
    plunder: saquear, pilhar
    plunge: mergulhar (dive in; immerse), despencar (fall steeply; drop sharply), afundar
    point: apontar (at something; aim), indicar (indicate)
    point out: apontar, assinalar, ressaltar
    poison: envenenar (kill with poison), contaminar, intoxicar
    poke: cutucar (jab; nudge), espetar (prod), fuçar (in something; probe)
    polish: polir, engraxar (shoes), aprimorar (improve; refine)
    pollute: poluir, contaminar
    ponder: ponderar, refletir, meditar (brood)
    pop: estourar (burst; go bang), furar (a bubble or blister), pipocar (go bang)
    populate: povoar, habitar (inhabit)
    portray: retratar (depict), interpretar (a role; an actor), representar
    pose: posar (for a photo; strike a pose), colocar (a question or problem), representar (a threat)
    position: posicionar, colocar
    possess: possuir, deter (a position or title)
    post: postar (online; publish), afixar (a notice on a board), enviar (mail)
    postpone: adiar, postergar (a meeting)
    pound: bater (knock; throb; beat), martelar (thump), socar (crush)
    pour: despejar (pour into), servir (a drink), derramar (spill out)
    practice: praticar, treinar (rehearse; sports), exercer (a profession)
    praise: elogiar, louvar
    pray: rezar, orar, suplicar (beg)
    preach: pregar, proclamar (proclaim), moralizar (lecture on morals)
    precede: preceder, anteceder
    predict: prever, predizer (foretell; prophesy), prognosticar
    prefer: preferir (choose rather than)
    preheat: preaquecer
    preoccupy: preocupar (worry), inquietar, ocupar (occupy the mind)
    prepare: preparar (food; get ready), aprontar
    prescribe: prescrever, receitar (a drug; medicine), determinar (dictate a rule)
    present: apresentar (introduce; a talk), entregar (hand over), presentear (give a gift)
    preserve: conservar (food), preservar
    preside: presidir, dirigir (a meeting)
    press: apertar (a button; squeeze), pressionar (push against), passar (iron clothes)
    presume: presumir, supor (assume), pressupor (take for granted)
    pretend: fingir (feign a feeling), simular
    prevail: prevalecer, triunfar (triumph), predominar (be widespread)
    prevent: impedir, evitar, prevenir
    prick: picar, espetar
    print: imprimir (a document; from a computer), publicar (publish a text)
    probe: sondar, investigar
    proceed: prosseguir (continue; go on), continuar, proceder (act, set about it)
    process: processar (a transaction; food, materials), tratar
    proclaim: proclamar, anunciar
    produce: produzir (a film, show), fabricar, gerar
    profess: professar (a faith), declarar (declare openly), afirmar (assert)
    program: programar
    progress: progredir, avançar, evoluir (improve)
    prohibit: proibir, vetar
    project: projetar (an image; onto a screen; estimate the future), sobressair (stick out), estimar (estimate)
    prolong: prolongar, estender, alongar (drag out)
    promise: prometer
    promote: promover (to a higher position; a product), divulgar (advertise), incentivar (support; encourage)
    prompt: incitar, instigar, motivar
    pronounce: pronunciar (a word), declarar (declare), proferir (a verdict)
    propagate: propagar (plants, organisms; an idea), disseminar, difundir (an idea)
    propel: impulsionar, arremessar (hurl), lançar
    propose: propor (put forward a plan; marriage), sugerir
    prosecute: processar (legally), acusar (charge)
    prosper: prosperar, florescer
    protect: proteger, defender, resguardar
    protest: protestar, reclamar
    protrude: sobressair, despontar
    prove: provar, demonstrar, comprovar
    provide: fornecer, prover (supply with), proporcionar
    provoke: provocar (cause; taunt), irritar (annoy), desencadear (trigger)
    prune: podar, aparar (cut off)
    pry: bisbilhotar (snoop), xeretar, forçar (prise open)
    publish: publicar, editar (as publisher or editor)
    pull: puxar, arrastar (pull roughly), tirar (pull out)
    pulse: pulsar, palpitar (of the heart), latejar
    pump: bombear (water; pump out; draw out), encher (inflate)
    punch: socar, esmurrar (hit with a fist), furar (make a hole in paper)
    punctuate: pontuar (add punctuation marks), enfatizar (emphasize), interromper (interrupt at intervals)
    puncture: furar (a tire), perfurar (break through), puncionar (medical)
    punish: punir, castigar (an offense)
    purchase: comprar, adquirir (formal)
    purge: purgar (data; cleanse), limpar, expurgar (remove people)
    purify: purificar, depurar (refine a substance), filtrar
    pursue: perseguir (chase), buscar (a goal), almejar (strive for a goal)
    push: empurrar (a cart; shove), apertar (a button), pressionar
    put: colocar, pôr, meter (into; inside)
    put off: adiar, postergar, desencorajar (deter)
    puzzle: intrigar, desconcertar (make baffled), confundir
    quake: tremer, estremecer (shake; tremble)
    qualify: qualificar (become qualified), habilitar (entitle), classificar (meet the criteria; qualify for a competition)
    quarrel: brigar, discutir
    quench: saciar (thirst), apagar (a fire), extinguir
    query: consultar (a database), questionar (question someone), perguntar (inquire)
    question: questionar (challenge), duvidar (doubt), interrogar (interrogate)
    quit: desistir (give up), parar (stop doing; a habit), sair (a job; a program)
    quiver: tremer, estremecer, vibrar
    quote: citar (cite), cotar (a price), orçar (give a price)
    race: correr, competir (compete), disparar (speed)
    radiate: irradiar, emanar (emit), emitir (emit radiation)
    raid: invadir, assaltar (a building), revistar (police search)
    rain: chover
    raise: levantar (lift), aumentar (increase), criar (children; animals)
    rally: reunir (gather; bring together), mobilizar, recuperar (recover)
    ram: abalroar, cravar (drive in)
    ramble: divagar (digress; talk aimlessly), caminhar (hike; walk about), vagar (walk idly)
    rank: classificar (assign a rank), ordenar, figurar (hold a rank)
    rant: esbravejar (rage; rail against), vociferar, reclamar (complain)
    rate: avaliar (judge), classificar, estimar (estimate)
    rationalize: racionalizar, justificar (justify; explain away)
    rattle: chacoalhar (shake with a rattling sound), chocalhar, sacudir
    reach: alcançar, atingir, chegar (arrive; extend to)
    react: reagir
    read: ler (aloud; a meter), interpretar (interpret)
    reap: colher (a harvest), ceifar (cut crops)
    rear: criar (animals; children), educar
    reason: raciocinar, argumentar (argue), deduzir (conclude; infer)
    reassure: tranquilizar, assegurar (assure), animar (encourage)
    rebuild: reconstruir, reformar (remodel), restaurar
    rebuke: repreender, censurar
    recall: lembrar, recordar (keep in memory), recolher (a product; call back)
    recede: recuar, retroceder, diminuir (fade; the tide)
    receive: receber, acolher (welcome)
    recharge: recarregar, recuperar (recover energy), reabastecer (refill)
    reciprocate: retribuir, corresponder (a favor)
    recite: recitar, declamar (a poem; from memory)
    reckon: calcular, achar (think), considerar
    reclaim: recuperar (land from the sea), reivindicar, resgatar
    recline: reclinar, inclinar (tilt back), deitar (lie down)
    recognize: reconhecer (acknowledge officially; identify), identificar
    recoil: recuar, estremecer (flinch), retroceder (draw back)
    recommend: recomendar, aconselhar (advise), indicar
    reconcile: reconciliar (make up; with someone), conciliar (make compatible; accounts), harmonizar
    reconsider: reconsiderar, repensar, reavaliar (re-examine)
    record: gravar (audio; video), registrar (write down; minutes), anotar
    recount: relatar, narrar (narrate), recontar (count again)
    recover: recuperar (get back; regain), melhorar (get well; from illness), resgatar (salvage)
    recreate: recriar, reproduzir, reconstituir (a scene)
    recruit: recrutar, contratar (hire), alistar
    rectify: retificar, corrigir (a fault)
    recycle: reciclar, reaproveitar
    redeem: resgatar (a voucher, a pledge; a bond), redimir (spiritually; make up for), quitar (a debt)
    redirect: redirecionar, encaminhar (forward), desviar
    redo: refazer, repetir (do over)
    reduce: reduzir, diminuir, baixar (lower)
    refer: encaminhar (to a specialist; refer a person), mencionar (mention), consultar (look up)
    refine: refinar (oil, sugar; a substance), aprimorar (improve; polish), depurar (purify)
    reflect: refletir (light; ponder), espelhar (mirror)
    reform: reformar, reformular
    refrain: evitar, conter (hold back)
    refresh: atualizar (a page; data), refrescar, revigorar
    refrigerate: refrigerar, resfriar, gelar
    refund: reembolsar, devolver (send the money back), ressarcir
    refuse: recusar, negar, rejeitar (reject)
    regain: recuperar, reconquistar, retomar
    regard: considerar, ver (consider as), estimar (esteem)
    regenerate: regenerar (grow back), renovar
    register: registrar, cadastrar, inscrever (enroll)
    regret: lamentar (be sorry for what one did), deplorar
    regulate: regular, regulamentar (by rules), ajustar (adjust)
    rehearse: ensaiar
    reign: reinar, governar, imperar (hold sway)
    reinforce: reforçar, fortalecer, fundamentar (an argument)
    reiterate: reiterar, reafirmar, repetir
    reject: rejeitar, recusar, descartar (an idea)
    rekindle: reacender, reavivar (kindle a feeling afresh)
    relapse: recair, reincidir (into a habit; flare up again)
    relate: relacionar (link; connect), contar (tell a story), associar
    relax: relaxar, afrouxar (loosen), descansar (unwind; rest)
    relay: retransmitir (broadcast), transmitir, repassar (pass on)
    release: liberar (set free), soltar (let go), lançar (a product; a film or software)
    relegate: relegar, rebaixar (demote; of a sports team), banir (banish)
    relent: ceder (give in; give way), abrandar (ease off), recuar
    relieve: aliviar (pain), substituir (take over from someone)
    relish: saborear, desfrutar, apreciar
    reload: recarregar (ammunition; a weapon), atualizar (a web page)
    rely: confiar (trust), depender, contar (count on)
    remain: permanecer, ficar (stay), restar (be left)
    remark: comentar, observar
    remedy: remediar (cure; correct), curar, corrigir
    remember: lembrar, recordar (keep in mind; recall), homenagear (honor the memory of)
    remind: lembrar (make someone remember), recordar, cobrar (remind of a debt)
    remit: remeter (send), transferir (money), perdoar (a debt, a penalty)
    remodel: reformar, remodelar
    remove: remover, retirar, eliminar (delete; clear away)
    rename: renomear (a file)
    renew: renovar, prorrogar (a contract, a library book)
    renounce: renunciar, abdicar (give up)
    renovate: renovar, reformar, restaurar (a building)
    rent: alugar (as a tenant; to a tenant; rent out), arrendar (land; rent from)
    repair: consertar, reparar, arrumar
    repay: reembolsar (reimburse), devolver (give back), retribuir (a favor; kindness)
    repeal: revogar, abolir
    repeat: repetir (repeat words; say back)
    repel: repelir, rechaçar (an attack), afastar (repel water)
    replace: substituir, trocar (swap out; exchange), repor (put back)
    replenish: reabastecer, repor (restock; top up), completar
    reply: responder, retrucar (retort), replicar
    report: relatar, informar (news), denunciar (to the police)
    represent: representar, simbolizar (stand for), retratar (depict)
    repress: reprimir, recalcar (psychologically), conter
    reprimand: repreender, advertir (officially)
    reproach: recriminar (blame someone for), censurar, culpar
    reproduce: reproduzir (recreate), copiar (copy), procriar (breed; biology)
    request: solicitar, pedir (ask for), requerer (formally apply)
    require: exigir (demand), requerer, necessitar (need)
    reschedule: reagendar, remarcar (move to another date), antecipar (move earlier)
    rescind: rescindir, revogar, anular
    rescue: resgatar, salvar, socorrer
    research: pesquisar, investigar
    reserve: reservar, guardar (set aside; hold back)
    reshape: remodelar, reformular
    reside: residir, morar, habitar
    resign: renunciar (leave a post), largar (leave a job), abdicar
    resist: resistir (hold back from), suportar (withstand), aguentar
    resolve: resolver (a problem; a puzzle), solucionar, decidir (decide firmly)
    resort: recorrer (resort to), apelar (resort to force)
    respect: respeitar, admirar (admire), honrar (honor)
    respond: responder, reagir (react)
    rest: descansar, repousar, poupar (spare an injured part)
    restart: reiniciar (a computer), recomeçar (start over), retomar (resume)
    restore: restaurar (an object), restabelecer (a service), recuperar (health)
    restrain: conter, refrear, segurar (hold back a person)
    restrict: restringir, limitar
    result: resultar (result in; result from), decorrer, surgir (come about; arise)
    resume: retomar, continuar (carry on), prosseguir
    resurrect: ressuscitar (raise from the dead), reviver
    retain: reter (withhold), manter (keep unchanged), conservar (keep)
    retreat: recuar, retroceder
    retrieve: recuperar (data; get back), buscar (fetch), resgatar (salvage)
    return: voltar (go back; come back), retornar, devolver (give back)
    reunite: reunir, reencontrar (meet again), reconciliar (get back together)
    reveal: revelar, divulgar (disclose), expor (expose)
    reverse: inverter (flip), reverter (change a decision), recuar (a car)
    revert: reverter, voltar, desfazer (undo a change)
    review: revisar (go over), rever (study again), resenhar (a book, a film)
    revise: revisar, rever (study again), reformular (a text; a law)
    revive: reviver (come back to life), reanimar (resuscitate), revitalizar
    revoke: revogar, cassar (a licence), retirar (strip a right)
    revolutionize: revolucionar
    reward: recompensar, premiar (honor with an award), gratificar
    rhyme: rimar, versejar (write verse)
    ride: andar (a bicycle, a bus), montar (a horse), cavalgar (a horse)
    ring: tocar (a bell), soar (sound), ressoar (ring out)
    rinse: enxaguar, lavar
    rip: rasgar (tear open), arrancar (tear off)
    ripple: ondular, ondear
    rise: subir, levantar (get up; stand up), nascer (the sun)
    risk: arriscar (run a risk), apostar (stake)
    rival: rivalizar, competir, igualar (come close to equalling)
    roam: vagar, perambular, vagabundear
    roar: rugir, urrar, bramir
    roast: assar (meat), torrar (coffee, nuts), tostar
    rob: roubar, assaltar (a place; hold up)
    roll: rolar (roll something), rodar, enrolar (roll up)
    rotate: girar, rotacionar (turn something), revezar
    rouse: acordar (wake someone), despertar, instigar (stir up)
    route: encaminhar (direct to different places), direcionar, desviar (divert)
    row: remar, brigar (have a row)
    rub: esfregar, massagear (massage), roçar (stroke)
    ruin: arruinar, estragar (spoil), destruir
    rule: governar, reger, decidir (of a court)
    rumble: retumbar (resound), ribombar
    rummage: revirar, vasculhar
    run: correr, administrar (a business), funcionar (operate; work)
    run away: fugir, escapar (from home)
    rupture: romper (break off relations), estourar
    rush: apressar (hurry someone), correr (hurry), irromper (crowd in)
    rust: enferrujar, oxidar (corrode)
    rustle: farfalhar (leaves in a breeze), sussurrar
    sabotage: sabotar
    sacrifice: sacrificar (offer up), renunciar (give up)
    sadden: entristecer, afligir, desanimar (dishearten)
    safeguard: salvaguardar, proteger, resguardar
    sail: navegar, velejar, zarpar (leave port)
    salute: saudar (greet), homenagear (pay tribute to; honor), cumprimentar
    salvage: resgatar (raise a wreck), salvar, recuperar
    sanction: sancionar (approve), aprovar, penalizar (penalize)
    sanitize: higienizar, desinfetar, limpar (clean up data)
    sap: debilitar, minar (eat away), enfraquecer
    satisfy: satisfazer (a need), cumprir (a requirement), contentar
    saturate: saturar, encharcar (soak), impregnar
    save: salvar (rescue; data, files), economizar (money), guardar (keep)
    savor: saborear, degustar (taste), apreciar (savor deeply)
    saw: serrar (saw wood)
    say: dizer, falar (state)
    scale: escalar (a mountain; climb), redimensionar (resize), ampliar (scale up)
    scan: escanear, digitalizar, percorrer (skim; glance over)
    scandalize: escandalizar, chocar, indignar
    scar: cicatrizar (heal over; leave a scar), marcar (mark; wound), desfigurar (disfigure)
    scare: assustar, amedrontar, espantar (scare away)
    scatter: espalhar, dispersar (be scattered; intransitive), esparramar
    schedule: agendar (set a time), programar, marcar (a date)
    scheme: tramar, conspirar (plot), maquinar
    scold: repreender, ralhar (get angry at)
    scoop: tirar (liquid; spoon up), escavar (hollow out), furar (news)
    scorch: chamuscar, queimar
    score: marcar (a goal), pontuar (grade; a test), anotar (a goal)
    scorn: desprezar, desdenhar, menosprezar
    scour: esfregar, vasculhar (search thoroughly), percorrer (search everywhere)
    scout: explorar (look around for), sondar, recrutar (talent)
    scrape: raspar (scrape off), arranhar (graze the skin), ralar
    scratch: arranhar (with claws), coçar (an itch), riscar
    scream: gritar, berrar
    screw: parafusar (screw in; drive in), apertar (tighten)
    scribble: rabiscar, garatujar (doodle), escrevinhar
    scroll: rolar (a page), deslizar
    scrub: esfregar (scrub off), escovar
    scrutinize: examinar (examine closely), esquadrinhar, analisar
    sculpt: esculpir, entalhar (carve), modelar (mold)
    seal: selar, vedar, lacrar (an envelope)
    search: procurar, pesquisar (online), revistar (a place, by police)
    season: temperar, condimentar, salgar
    secure: garantir (obtain), fixar (fasten), trancar (lock up)
    sedate: sedar (anesthetize), tranquilizar, acalmar
    seduce: seduzir, conquistar (woo), atrair (lure)
    see: ver, encontrar (meet), perceber (realize; understand)
    seek: buscar (pursue), procurar
    seem: parecer
    segment: segmentar, dividir, fragmentar
    segregate: segregar, separar, isolar
    select: selecionar (on screen), escolher, designar (appoint)
    sell: vender, comercializar (distribute)
    send: enviar, mandar (a message), despachar (goods)
    send back: devolver (goods; by mail), reenviar
    sentence: condenar, sentenciar
    separate: separar (keep apart; part ways), apartar, dividir
    serve: servir (food; a master; be of use), atender (customers), cumprir (a term; military service)
    set: colocar (upright; flat; mount in place), ajustar (a clock or alarm), definir (a date, a rule)
    set off: partir (start a trip), disparar (trigger), detonar (a bomb)
    set up: configurar (configure; install), montar (put up), fundar (found; establish)
    settle: resolver (a matter; a dispute), quitar (a bill), assentar (sink down; calm down)
    sever: cortar, romper (cut ties), decepar
    sew: costurar, coser (sew on)
    shackle: algemar, acorrentar (restrict freedom), prender
    shade: sombrear (in a drawing), escurecer (block light)
    shake: sacudir, chacoalhar, tremer (tremble)
    shampoo: lavar (hair; a carpet), ensaboar
    shape: moldar, formar, modelar
    share: compartilhar (let someone know), dividir, partilhar
    shatter: estilhaçar, despedaçar, quebrar (intransitive)
    shave: barbear, raspar (shave off)
    shear: tosquiar, tosar, cortar (trim; fleece)
    shed: derramar (tears, blood), perder (hair, leaves), soltar (skin; leaves)
    shelter: abrigar (from rain; take cover), proteger, esconder (hide someone)
    shift: mudar (change), mover, deslocar
    shimmer: reluzir, cintilar, tremeluzir (flicker)
    shine: brilhar (the sun), iluminar (light up), lustrar (polish)
    shiver: tremer, tiritar (from cold), estremecer
    shock: chocar, abalar, eletrocutar (electric shock)
    shoo: espantar, enxotar, afugentar
    shoot: atirar (fire a gun; an arrow), balear (kill; wound), filmar (a film)
    shorten: encurtar, abreviar, reduzir
    should: dever (advice, obligation)
    shout: gritar (yell angrily), berrar, bradar
    shove: empurrar, enfiar (shove into)
    shovel: cavar (dig), escavar, remover (shovel out; snow)
    show: mostrar (demonstrate; indicate; display a feeling), exibir (exhibit), ensinar (show the way; teach)
    show off: fanfarronar (boast), ostentar (flaunt), exibir
    show up: aparecer, comparecer (attend), chegar (turn up)
    shred: triturar (grind; documents), picotar (paper), desfiar (meat)
    shrink: encolher (of clothes), diminuir, reduzir
    shudder: estremecer (be horrified), tremer
    shuffle: embaralhar (cards), arrastar (walk dragging the feet; shuffle feet), misturar
    shun: evitar (keep away from), rejeitar, ostracizar
    shut: fechar (a door; eyes, a book; intransitive), trancar (lock), encerrar (close down)
    sidestep: desviar, contornar (bypass), evitar
    siege: sitiar, cercar (surround)
    sift: peneirar (flour; strain or sift), vasculhar (sift through; sort out)
    sigh: suspirar
    sign: assinar, autografar (autograph)
    signal: sinalizar, indicar (indicate)
    silence: silenciar (suppress; mute a device), calar (hush; fall silent)
    simplify: simplificar
    simulate: simular, imitar (imitate)
    sing: cantar
    singe: chamuscar, queimar (burn lightly)
    sink: afundar (go down; make something sink), submergir (go under), naufragar (ships)
    sip: sorver, bebericar (sip a drink)
    skate: patinar
    sketch: esboçar (draw; design), desenhar (draw), projetar (design)
    skewer: espetar (pierce), transpassar (pierce through)
    ski: esquiar
    skim: folhear (a text), desnatar (milk), escumar (skim off liquids)
    skip: pular (hop; skip over), omitir (omit), faltar (skip class or work)
    slam: bater (a door; hit hard), arremessar (hurl down), colidir (crash into)
    slander: caluniar, difamar
    slap: esbofetear (on the face), bater (with an open hand)
    slash: cortar (cut open; draw a cut), rasgar (cut open), reduzir (prices, budgets; cut costs)
    sleep: dormir
    slice: fatiar, cortar (into slices)
    slide: deslizar (push along), escorregar
    slip: escorregar (lose footing), deslizar (slip into or out of; slip in), escapar (slip away)
    slither: rastejar, serpentear
    slow: desacelerar (ease off), retardar (delay), frear (brake)
    smash: quebrar (shatter), esmagar (crush), estilhaçar (shatter)
    smear: untar (spread), manchar (smudge; stain), lambuzar (cover with)
    smell: cheirar (smell pleasant; give off a smell; perceive a smell), farejar (detect by smell)
    smile: sorrir
    smoke: fumar (cigarettes), defumar (cure food with smoke)
    smooth: alisar (with the hand; flatten out), nivelar (level out; even out), polir (polish)
    smother: sufocar (cover over; suppress), abafar (put out a fire; suppress)
    smuggle: contrabandear
    snap: quebrar (break sharply; break in two), estalar (fingers), fotografar (a photo)
    snarl: rosnar (angrily), resmungar (snap angrily)
    snatch: arrebatar (from someone), agarrar (grab a bag), arrancar (snatch away)
    sneeze: espirrar
    sniff: cheirar, farejar (smell out)
    snooze: cochilar, dormitar (nod off)
    snore: roncar
    snow: nevar
    soak: ensopar (drench; get soaked), embeber (soak in liquid), absorver (soak up)
    sob: soluçar
    socialize: socializar (children, psychology; make friends), conviver (mix with others; mingle), conversar (chat)
    soften: amolecer (become soft), suavizar (lessen; ease), abrandar (soften a stance)
    solicit: solicitar (formally; ask for), pedir (ask for), angariar (for support; canvass; recruit)
    solidify: solidificar, endurecer (become solid)
    solve: resolver (a problem; a puzzle or equation), solucionar, desvendar (a crime, mystery)
    soothe: acalmar (calm a person), aliviar (pain; ease pain), tranquilizar
    sort: ordenar (put in order), classificar (classify), separar (sort out)
    sound: soar (alarm, bell; resound; ring out), parecer (seem), ressoar (resound)
    sow: semear, plantar (plant)
    sparkle: brilhar, cintilar
    spawn: gerar (generate; give rise to), desovar (fish, frogs; lay eggs), originar (give rise to)
    speak: falar, conversar
    specify: especificar (state exactly), determinar (determine), indicar (state explicitly)
    speculate: especular (in markets), supor (guess)
    speed: acelerar (make faster), correr (go fast; drive fast), apressar (hurry)
    spell: soletrar (write the letters), significar (spell trouble)
    spend: gastar (money), passar (time)
    spill: derramar (blood, tears; spill by itself), verter (blood, tears)
    spin: girar (rotate; spin something), rodar, fiar (thread; spin thread)
    spit: cuspir (spit out)
    splash: respingar (splash onto; spatter), salpicar (splash on someone), chapinhar (play in water)
    splinter: estilhaçar (transitive), lascar
    split: dividir (into parts), partir, rachar (split open)
    spoil: estragar (food, plans; ruin), mimar (pamper; a child), arruinar (ruin)
    sponsor: patrocinar, apoiar (support)
    spot: avistar (see at a distance), detectar, notar (catch sight of)
    sprain: torcer
    spray: pulverizar, borrifar (spray onto)
    spread: espalhar (news, disease; intransitive), estender (lay out; unfold), untar (butter, paste)
    sprinkle: polvilhar (powder, sugar), borrifar (liquid), salpicar (scatter)
    spur: incentivar (encourage), estimular (stimulate), impulsionar (urge on)
    squander: esbanjar (money), desperdiçar, dilapidar (money)
    squeal: guinchar (pig), gritar (person), chiar (brakes)
    squeeze: espremer (juice; squash in), apertar (grip tightly; press)
    squint: semicerrar (narrow the eyes), apertar (narrow the eyes; strain to see)
    stab: apunhalar, esfaquear (with a blade)
    stabilize: estabilizar
    stagger: cambalear (drunkenly), escalonar (schedules)
    stain: manchar (discolor), tingir (wood; dye)
    stall: calar (an engine; engine dies), protelar (delay; stall for time), travar (grind to a halt)
    stamp: carimbar (put a stamp on), estampar (imprint), pisar (stamp on; stamp one's feet)
    start: começar (begin something; begin by itself), iniciar (program), ligar (engine)
    startle: assustar, sobressaltar (be startled), surpreender (surprise)
    stash: esconder, guardar (stow away; put away), acumular (hoard)
    state: declarar, afirmar (claim; assert), especificar (specify)
    stay: ficar, permanecer (remain), pernoitar (overnight)
    steady: estabilizar (hold steady), firmar (hold steady), acalmar (nerves; calm)
    steal: roubar, furtar (formal), afanar (colloquial)
    steer: guiar (guide), dirigir (drive)
    sterilize: esterilizar
    stew: cozinhar (simmer), guisar (simmer), estufar (steam gently)
    stick: colar (adhere; affix; attach), grudar (adhere), enfiar (put into; insert; poke into)
    stifle: reprimir (hold back), abafar (a yawn or laugh), sufocar
    stigmatize: estigmatizar, discriminar (discriminate against)
    stimulate: estimular, incentivar, reavivar (revive)
    sting: picar (insect, nettle), arder (smart; burn)
    stink: feder (give off a bad smell), empestar
    stipulate: estipular, exigir (require), combinar (agree)
    stir: mexer (stir a liquid; move slightly), agitar, atiçar (stir up feelings)
    stitch: costurar, suturar (suture), bordar (embroider)
    stop: parar (come to a halt; stop doing something), interromper (halt something), cessar (cease)
    store: armazenar (goods; data), guardar (keep; save data), estocar (goods)
    storm: invadir (attack), assaltar (attack), esbravejar (rage)
    straighten: endireitar (set straight), arrumar (tidy up)
    strain: coar (pasta; filter), forçar (overexert; overwork), distender (injure a muscle)
    strangle: estrangular, esganar (squeeze the neck)
    strap: amarrar, prender, afivelar
    stray: vagar (animals; wander aimlessly), divagar (digress), desviar (deviate)
    strengthen: fortalecer, reforçar (reinforce), fortificar
    stress: enfatizar (highlight), destacar (highlight), estressar (cause stress)
    stretch: esticar (limbs; make longer), alongar (do stretches), estender (extend a limb)
    strew: espalhar, esparramar
    string: enfiar (beads; thread beads), encordoar (racket, guitar), encadear (string together)
    strip: despir (clothes; undress), despojar (of rights, titles; deprive of), descascar (peel off)
    stroke: acariciar, afagar
    stroll: passear, flanar
    struggle: lutar, batalhar (strive), penar (face difficulty)
    strum: dedilhar (pluck; play a guitar), tocar (play a guitar)
    study: estudar, cursar (at university), pesquisar (research)
    stuff: rechear, encher (cram), entupir (stop up)
    stumble: tropeçar
    stun: atordoar (be stunned; overwhelm), pasmar (amaze; leave speechless), estarrecer (astound)
    subdue: subjugar (overpower), dominar (hold down), reprimir (quell a revolt)
    submit: enviar (a form), apresentar (hand in), submeter (yield)
    subscribe: assinar (a magazine; a service or channel), subscrever (shares)
    subsidize: subsidiar, subvencionar
    substitute: substituir (replace; stand in for), trocar (swap; use instead)
    subtract: subtrair, descontar (deduct)
    succeed: conseguir (an attempt works), triunfar, suceder (follow into a role; take over from)
    succumb: sucumbir, ceder (give in)
    suck: chupar (candy; suck on), sugar
    sue: processar, demandar (take legal action)
    suffer: sofrer (injury, loss), padecer (illness)
    suffocate: sufocar, asfixiar
    suggest: sugerir (hint; imply), propor (propose), recomendar (recommend)
    suit: convir (match requirements; be right for), combinar (look good on), servir (fit)
    sum: somar, totalizar
    summarize: resumir, sintetizar
    summon: convocar (convene), chamar (call over), intimar (to court)
    supersede: substituir, suplantar (displace)
    supervise: supervisionar, fiscalizar (monitor), gerenciar (manage)
    supplement: complementar, suplementar
    supply: fornecer (provide), abastecer (with), suprir
    support: apoiar, sustentar (physically; hold up), defender (back an idea)
    suppose: supor (assume; guess), presumir (presuppose), imaginar (guess)
    suppress: suprimir, reprimir (repress), abafar (a revolt)
    surf: surfar, navegar (browse the web)
    surge: disparar (rise sharply; numbers), crescer (swell), irromper (rush)
    surmise: conjeturar, supor
    surpass: superar, ultrapassar (exceed), exceder
    surprise: surpreender, espantar (amaze)
    surrender: capitular, entregar (hand over), ceder
    surround: cercar (military), rodear (crowd)
    survey: pesquisar (poll people), inspecionar (inspect; look over), medir (land)
    survive: sobreviver, resistir (get through)
    suspect: suspeitar (a person; think likely), desconfiar (have a hunch)
    suspend: suspender (from duty; put on hold), pendurar (hang), interromper (interrupt; halt)
    sustain: sustentar (bear weight), manter (keep going), sofrer (an injury)
    swallow: engolir, tragar (gulp down), devorar (devour)
    swap: trocar, permutar
    sway: balançar, oscilar, influenciar (sway opinion)
    swear: jurar (vow), praguejar (curse; use bad language)
    sweat: suar, transpirar (formal)
    sweep: varrer (clear out)
    sweeten: adoçar, suavizar (make more pleasant)
    swell: inchar (swell up; injury or body part), crescer (grow bigger), aumentar (increase)
    swim: nadar
    swindle: trapacear, fraudar, lesar (out of money)
    swing: balançar (swing a bat or arm), oscilar (sway back and forth), pender (dangle)
    swipe: deslizar (across a screen), passar (a card), surrupiar (steal)
    switch: trocar (swap), mudar (switch over), alternar
    symbolize: simbolizar, representar (embody)
    sympathize: simpatizar (with an idea), entender (understand someone's feelings)
    sync: sincronizar
    synchronize: sincronizar, coordenar (coordinate), alinhar (match up)
    synthesize: sintetizar, fundir (merge)
    tack: pregar (nail on; fasten with tacks), fixar (pin on), acrescentar (tack on)
    tackle: enfrentar (take on; deal with), abordar (a problem), derrubar (in sports)
    tag: etiquetar, marcar, rotular
    tailor: adaptar (cut to fit a need), ajustar, confeccionar (make clothes)
    taint: contaminar, manchar (sully a reputation), macular (sully a reputation)
    take: pegar (grab), levar (take along; take to a place), tomar
    take care of: cuidar (look after; nurse, tend), resolver (handle; deal with), providenciar (provide for)
    take off: decolar (a plane), tirar (clothes; a hat, glasses), despir (clothes)
    take part: participar, colaborar (contribute), contribuir
    talk: falar, conversar (chat), dialogar
    tally: contabilizar (add up; count up), apurar (votes), coincidir (agree, match)
    tame: domar (control), domesticar, amansar
    tamper: adulterar (falsify), manipular, mexer (fiddle with)
    tan: bronzear (skin), curtir (leather)
    tangle: emaranhar, embaraçar (hair, wool), enredar
    tap: bater (knock or tap), tocar (touch lightly; a screen), grampear (a phone)
    tape: gravar (record; audio; video), colar (stick with tape)
    taper: afunilar (come to a point), estreitar (narrow gradually), diminuir (taper off)
    target: visar (take aim at), mirar, direcionar (be aimed at)
    tarnish: manchar (sully a reputation), oxidar (metal goes dull), escurecer (discolor)
    taste: provar (sample), degustar (wine, food), saborear (savor)
    tattoo: tatuar
    taunt: provocar, zombar (mock), ridicularizar
    tax: tributar, taxar (impose a tax), sobrecarregar (strain)
    teach: ensinar, lecionar (a class; a subject), instruir
    tear: rasgar (tear open), romper (rip to pieces), arrancar (rip off)
    tear down: demolir, derrubar, desmontar (dismantle)
    tease: provocar (tease someone), caçoar (make fun of), implicar (pick on)
    telephone: telefonar, ligar (talk on the phone)
    tell: dizer, contar (a story), informar (inform; convey)
    tell off: repreender (lecture), ralhar
    tempt: tentar, seduzir, atrair
    tend: tender (be inclined), costumar (be inclined to), cuidar (care for; look after)
    tenderize: amaciar (pound meat; soften), marinar (marinate to soften)
    terminate: encerrar (end), rescindir (a contract), demitir (an employee)
    terrify: aterrorizar, apavorar, horrorizar
    test: testar (try out; medical or technical), examinar (examine), experimentar (try out)
    testify: testemunhar (in court), atestar (attest)
    tether: amarrar (dog), prender
    thank: agradecer
    thaw: descongelar (defrost; frozen food), derreter (ice or snow melts; melt something), degelar (ice or snow melts)
    thicken: espessar (liquids; a sauce), engrossar (make thicker), adensar (get thicker)
    thin: diluir (liquid; dilute), emagrecer (become thin; get skinny), rarear (hair, crowds)
    think: pensar (ponder), achar (believe), acreditar (believe)
    think about: pensar, refletir, considerar
    thread: enfiar (a needle; beads), passar (pass through)
    threaten: ameaçar (endanger), intimidar
    thrill: emocionar (make excited; be moved), empolgar (sweep along; grip), entusiasmar
    thrive: prosperar (business), florescer (bloom; grow well)
    throb: latejar (pain; ache), pulsar (pulse), palpitar (of the heart)
    throttle: estrangular (restrict a flow; strangle), esganar (choke someone), regular (regulate flow)
    throw: jogar, lançar (hurl), arremessar (hurl)
    throw away: descartar (dispose of), eliminar
    thrust: empurrar (shove), cravar (drive in; stab with a blade), projetar (stick out)
    thump: bater (hit hard; thud), socar (with fists), martelar (pound)
    thunder: trovejar, retumbar (rumble), bramar (roar at someone)
    thwart: frustrar (plans), impedir, sabotar (undermine)
    tick: marcar (check off; mark on a form), assinalar (mark on a form), tiquetaquear (clock)
    tidy: arrumar, organizar, ordenar
    tie: amarrar (fasten; shoes, bags), atar (shoes, bags), empatar (draw in a game)
    tighten: apertar (screws), esticar (pull taut), endurecer (make rules stricter)
    tilt: inclinar, pender (lean)
    time: cronometrar (measure time), sincronizar (coordinate timing), agendar (schedule)
    tingle: formigar (go numb), arrepiar (with a chill or excitement), coçar (itch)
    tint: tingir (dye), colorir (colour in)
    tip: inclinar (tilt), virar (tip over; tip out), gratificar (give a gratuity)
    tire: cansar (get tired), fatigar (exhaust), esgotar (exhaust)
    title: intitular, titular (name)
    toast: torrar (bread), brindar (drink a toast; clink glasses), tostar (roast)
    toggle: alternar (computing), comutar
    tolerate: tolerar, suportar (endure), aguentar (put up with)
    tone: tonificar (muscles, skin), fortalecer (strengthen muscles)
    top: superar, ultrapassar, coroar (crown)
    topple: derrubar (knock over; overthrow), tombar (fall over; tip over), destronar (overthrow)
    torment: atormentar, afligir (afflict)
    torture: torturar, atormentar (torment)
    toss: jogar (colloquial), lançar (toss up), misturar (toss a salad)
    touch: tocar, encostar (touch lightly), comover (move emotionally)
    tour: visitar (sights), percorrer (a region), guiar (show someone around)
    tow: rebocar, arrastar (haul)
    trace: traçar (outline; trace a line), rastrear (track down; trace a source), localizar (track down)
    track: rastrear (locate by signal), seguir (follow), perseguir (chase; hunt down)
    trade: comerciar (internationally), trocar (swap; exchange for), negociar (in markets)
    train: treinar (do training; train someone), capacitar (teach skills), adestrar (animals)
    trample: pisotear, esmagar
    transcend: transcender, superar (go beyond), ultrapassar (cross a limit)
    transcribe: transcrever (from audio), copiar (copy out), converter (convert to another form)
    transfer: transferir (data, rights; money; an employee), ceder (rights), remanejar (an employee)
    transform: transformar, converter (convert)
    translate: traduzir, interpretar (interpret orally)
    transmit: transmitir (signal, data, disease), emitir (broadcast), comunicar (convey)
    transpire: acontecer (happen), transpirar (perspire; become known), ocorrer (happen)
    transplant: transplantar (organs; plants, tissue), replantar (replant), enxertar (plants, tissue)
    transport: transportar (passengers, goods), conduzir, despachar (ship goods)
    trap: prender (jam; confine), capturar (catch), encurralar (ensnare)
    travel: viajar (go away on a trip), circular (go by vehicle)
    traverse: atravessar, percorrer, cruzar
    tread: pisar (step on; tread firmly), trilhar (set foot on; stride)
    treasure: prezar (hold dear), valorizar (value), guardar (keep safe)
    treat: tratar (medically; handle; behave toward), convidar (treat to a meal), oferecer (pay as a treat; entertain with food)
    tremble: tremer (with cold, fear), estremecer (shudder), tiritar (with cold)
    trick: enganar (outwit; con), ludibriar
    trickle: escorrer, gotejar, vazar (seep out; leak)
    trigger: desencadear (bring about), acionar (activate), disparar
    trim: aparar (beard, hedge; hair), podar (prune), reduzir (cut costs)
    trip: tropeçar (fall down), derrubar (make fall)
    triple: triplicar (increase threefold; grow threefold)
    trivialize: trivializar, banalizar, minimizar (play down)
    trot: trotar
    trouble: incomodar (bother), perturbar (disturb), preocupar (worry)
    truncate: truncar, cortar
    trust: confiar (entrust; believe someone), acreditar (believe someone)
    try: tentar (attempt), experimentar (try out; give it a try), provar (try food)
    try on: provar (clothes; shoes), experimentar
    tuck: enfiar (stuff in), dobrar (fold edges in), aconchegar (tuck in bed)
    tumble: cair (tumble over), despencar (prices), desabar (collapse)
    tune: afinar (an instrument; a piano), sintonizar (radio; tune in), ajustar (adjust; engine, car)
    tunnel: escavar (tunnel under), perfurar
    turn: virar (change direction; turn over), girar (rotate; turn something), dobrar (turn a corner)
    turn around: virar (turn the other way; look back), voltar (go back), girar
    turn down: recusar (reject; turn away), abaixar (volume, heat), rejeitar (reject)
    turn into: virar (become), transformar (convert), converter (convert)
    turn off: desligar (device; engine; power), apagar (lights or TV), fechar (a tap; water)
    turn on: ligar (device; a machine or music), acender (a light), abrir (a tap; water)
    turn up: aumentar (volume, heat), aparecer (appear; show up), subir (volume)
    tweet: tuitar, piar (birds chirp), gorjear (birds)
    twinkle: cintilar, brilhar
    twirl: rodopiar, girar (turn round; circle), rodar
    type: digitar (on a keyboard), teclar, datilografar (on a typewriter)
    umpire: arbitrar (a match), apitar (as referee), mediar (arbitrate a dispute)
    unbutton: desabotoar
    uncover: descobrir (reveal; expose), revelar, desvendar
    underestimate: subestimar
    undergo: sofrer (suffer), experimentar (experience), atravessar (go through)
    underline: sublinhar, ressaltar (emphasize), enfatizar (emphasize)
    undermine: minar (erode), solapar, enfraquecer (weaken)
    underpin: sustentar (support), fundamentar (back up), escorar (shore up)
    understand: entender, compreender (grasp), perceber (realize)
    understate: minimizar (play down), atenuar (make seem harmless), subestimar (underreport)
    undertake: empreender (embark on), assumir (take on), realizar (set about)
    underwrite: subscrever (insurance or securities), garantir (guarantee; stand surety), financiar (fund)
    undo: desfazer (reverse; revert), desatar (untie, loosen), anular (cancel; revoke)
    undress: despir (take clothes off someone; undress someone), desvestir
    unearth: desenterrar (dig up), descobrir (find; reveal)
    unfasten: soltar (loosen), desatar (untie), desprender (detach)
    unfold: desdobrar (flip open), desenrolar (develop; of events), estender (spread out)
    unfurl: desfraldar (flag; spread open), desenrolar (scroll; roll out)
    unhook: desenganchar (detach), soltar (release), desprender (detach)
    unify: unificar, uniformizar (standardize), unir (bring together)
    uninstall: desinstalar, remover (remove; delete)
    unite: unir, juntar, reunir (join together)
    unleash: desencadear (provoke), soltar (let loose), liberar (release)
    unload: descarregar (weapon, battery; goods; cargo), esvaziar
    unmask: desmascarar (expose; take a mask off), revelar (reveal a spy), desvendar (see through)
    unpack: desempacotar (take out), desembalar, desfazer (luggage)
    unplug: desligar (a plug), desconectar (disconnect)
    unravel: desvendar (solve a mystery), desembaraçar (untangle), desfiar (fray)
    unroll: desenrolar (a roll; a scroll), estender (a carpet)
    unscrew: desparafusar (loosen; take out), desenroscar (a lid)
    unsettle: perturbar (disturb deeply), inquietar (make uncertain), abalar (disturb)
    untie: desamarrar (a knot), desatar (a knot), soltar (set free)
    unveil: apresentar (present a product; present publicly), revelar (announce), inaugurar (a monument; a statue)
    unwrap: desembrulhar (a gift; remove wrapping), desempacotar
    unzip: descompactar (files), descomprimir (data; decompress), abrir (a zipper)
    update: atualizar, renovar (renew)
    upgrade: atualizar (equipment, hardware), melhorar (improve a product), promover (raise in rank)
    uphold: manter (maintain; preserve), confirmar (confirm a ruling), defender (a law or principle)
    uplift: elevar (lift up; raise standards), animar (lift spirits), erguer (lift up)
    upload: enviar (transfer data), subir (colloquial; transfer data)
    uproot: arrancar (pull out; clear land), erradicar (eradicate), desterrar (people from home)
    upset: aborrecer (make upset), magoar (hurt feelings), transtornar (disrupt; distress)
    urge: instar (press for), exortar (call upon), impelir (drive on)
    use: usar, utilizar, empregar
    usher: conduzir (escort), acompanhar (escort), inaugurar (usher in an era)
    usurp: usurpar, suplantar (supplant)
    utilize: utilizar, aproveitar (make use of), empregar (put to use)
    utter: proferir (say aloud), pronunciar (pronounce), emitir (a cry)
    vaccinate: vacinar
    vacuum: aspirar (with a vacuum), sugar (suck up)
    validate: validar (acknowledge as valid), confirmar (confirm), verificar (check)
    value: valorizar (appreciate; hold in esteem), avaliar (put a value on; appraise), prezar (cherish)
    vandalize: vandalizar, danificar (damage), depredar (wreck)
    vanish: desaparecer, sumir, esvanecer (dwindle away)
    vaporize: vaporizar, evaporar (evaporate), pulverizar (atomize)
    varnish: envernizar, revestir (coat)
    vary: variar (differ; change), alterar (alter; change), oscilar (fluctuate)
    veer: desviar (deviate; swerve out), virar (turn sharply)
    vent: desabafar (pour out feelings; emotions), descarregar (anger), liberar (gas; steam, pressure; let out)
    ventilate: ventilar, arejar (air out thoroughly)
    venture: arriscar (risk; venture an opinion), ousar (brave a risk), aventurar (venture an opinion)
    verify: verificar, conferir (check), confirmar (confirm)
    veto: vetar, proibir (forbid), rejeitar (reject a bill)
    vex: irritar (irk), aborrecer, contrariar
    vibrate: vibrar, tremer (tremble), oscilar (oscillate)
    victimize: perseguir (harass; bully), discriminar (discriminate against), oprimir (oppress)
    videotape: gravar (record), filmar
    vie: competir, concorrer, rivalizar
    view: ver (a scene), observar (observe), visualizar (a document or web page)
    vilify: difamar, vilipendiar, demonizar (demonize)
    vindicate: inocentar (exonerate; clear of blame), justificar (justify; prove right), reabilitar (restore reputation)
    violate: violar (rights; law, promise), infringir (a rule), descumprir (a promise)
    visit: visitar (a person; a place), conhecer (sights)
    visualize: visualizar, imaginar (picture mentally), ilustrar (illustrate; depict)
    vocalize: vocalizar (linguistics, singing), verbalizar (express in words), articular (say aloud; articulate)
    void: anular (cancel a transaction), invalidar, revogar (rescind)
    vomit: vomitar, regurgitar
    vote: votar
    vouch: garantir (guarantee; assure), avalizar (answer for), afiançar (guarantee)
    vow: jurar, prometer
    voyage: viajar, navegar (travel by ship), velejar (sail)
    wade: vadear (ford on foot), chapinhar (slosh through water)
    wag: abanar (swish gently), balançar
    wail: gemer (moan; of a siren), lamentar (lament), uivar (of a siren)
    wait: esperar, aguardar (literary; stand by)
    wait for: esperar, aguardar (wait and see; literary), espreitar (lie in wait for)
    wait on: servir (food; serve at table; serve customers), atender (serve a customer)
    waive: renunciar (a right), dispensar (a fee, debt), abdicar (a right)
    wake: acordar (wake someone; become awake), despertar (rouse someone; awaken)
    wake up: acordar, despertar (rouse someone)
    walk: caminhar (go for a walk), andar (on foot), passear (take a stroll)
    wall: murar (enclose with a wall), emparedar (wall in; wall up), cercar (wall off)
    waltz: valsar (dance a waltz), dançar (dance)
    wander: vagar (roam; wander aimlessly), perambular (loiter), vaguear
    wane: minguar (the moon; decrease), declinar (decline), esmaecer (fade)
    want: querer, desejar (desire)
    ward off: afastar (drive away; repel), evitar (prevent; avoid), repelir (repel)
    warm: aquecer (food or the body; a room), esquentar (heat gently)
    warm up: aquecer (before exercise; athletes), esquentar (heat up), requentar (reheat food)
    warn: avisar (give advance notice; let know), advertir (give an official warning; caution), alertar (of danger)
    warp: deformar (distort), empenar (wood), distorcer (distort)
    warrant: justificar (justify), merecer (merit), garantir (guarantee)
    wash: lavar (laundry; clothes; hair; dishes), enxaguar (rinse)
    waste: desperdiçar, esbanjar
    watch: assistir (TV, movies), olhar (look at), vigiar (keep watch)
    water: regar (plants; sprinkle water), irrigar (irrigate), molhar (moisten)
    wave: acenar (wave at someone; wave a hand), agitar (wave something), ondular (billow; of a flag)
    waver: vacilar (hesitate; falter), hesitar, titubear (dither; be undecided)
    weaken: enfraquecer, debilitar (decline), atenuar (lessen)
    wean: desmamar (a baby), desacostumar (from a habit), desabituar (break a habit)
    wear: usar (clothes; shoes; a hat), vestir (clothes), desgastar (wear out)
    weave: tecer (on a loom; textiles), trançar (braid, basket), entrelaçar (interlace)
    wed: casar (officiate; of a bride; of a groom), desposar (formal)
    weep: chorar, lacrimejar (shed tears), lamentar (weep for)
    weigh: pesar (measure weight; on scales; have a weight of), ponderar (options, pros and cons; consider), sopesar (weigh options)
    weigh down: sobrecarregar (add weight to), oprimir (depress), abater (be weighed down)
    welcome: acolher (take in), receber (receive guests), saudar
    weld: soldar
    whack: bater, golpear (colloquial), socar
    whip: açoitar (flog; lash), chicotear, bater (cream, eggs)
    whisper: sussurrar, cochichar (whisper in someone's ear), murmurar
    whistle: assobiar, apitar (blow a whistle)
    whiten: branquear (bleach), embranquecer (turn white), clarear (lighten)
    whittle: entalhar (carve), desbastar (whittle down), reduzir (whittle down)
    widen: alargar (a road), ampliar (scope, horizons), expandir (expand)
    wield: empunhar (a weapon), manejar (handle a tool), exercer (power, influence)
    wiggle: mexer (fingers or toes), remexer, rebolar (hips)
    win: ganhar (a championship; a medal or prize), vencer (be victorious), conquistar (achieve by effort)
    win over: conquistar (win someone's favour), convencer (talk into), cativar
    wind: enrolar (wrap around; roll up; wind thread), serpentear (river, road; meander), bobinar (wind thread)
    wink: piscar (wink at someone; blink), pestanejar (blink)
    wipe: limpar (wipe off; wipe away), enxugar (wipe dry; wipe away tears), apagar (erase)
    wish: desejar (wish for luck; make a wish), almejar
    withdraw: retirar (pull back, retract; troops; a statement), sacar (money), recuar (pull back)
    wither: murchar (plants die; droop; shrivel), secar (dry out), definhar (dry up and die)
    withstand: resistir (resist), aguentar (endure), suportar (endure)
    witness: presenciar (be there for), testemunhar (be present as a witness)
    wobble: balançar, oscilar, cambalear (stagger)
    word: redigir (draft a text; compose), formular (put into words; phrase), expressar (put into words)
    work: trabalhar (people; be employed), funcionar (machines or systems), agir (take effect)
    work out: resolver (solve; sort out), treinar (exercise), elaborar (draw up a plan)
    worry: preocupar (make someone worry), inquietar, temer (fear for)
    worsen: piorar, agravar (aggravate; make worse), deteriorar
    worship: adorar (idolize), venerar (revere), idolatrar (idolize)
    wound: ferir (in battle; be wounded), magoar (hurt feelings), machucar
    wrap: embrulhar (gift; gift wrap; package), envolver (wrap around; wrap up), empacotar (package)
    wreck: destruir (damage badly; ruin), arruinar (ruin), destroçar (damage badly)
    wrench: torcer (twist; twist a joint), arrancar (wrest away; pull out forcefully), arrebatar (wrest away)
    wrestle: lutar (fight; grapple), brigar (fight)
    wring: torcer (twist), retorcer (squeeze water out), espremer (squeeze out)
    write: escrever (a book), redigir (compose a text)
    write down: anotar (take down dictation), registrar
    write off: cancelar (cancel a debt), descartar (give up on), amortizar (amortize; accounting)
    x-ray: radiografar
    yank: puxar (jerk; drag), arrancar (pluck; pull out)
    yawn: bocejar
    yearn: ansiar (long for), anelar (long for), almejar
    yell: gritar (yell at someone), berrar (roar; shout angrily), esbravejar (shout angrily)
    yelp: ganir (of a dog; cry out sharply), latir (bark), gritar (cry out sharply)
    yield: ceder (give way; concede; submit), produzir (produce), render (profit; produce)
    yoke: jungir (hitch animals; put in harness), atrelar (hitch animals), subjugar (subjugate)
    zap: eliminar (destroy; wipe out), apagar (delete; erase), deletar (delete)
    zip: compactar (files; compress files), comprimir (files), fechar (a zipper; zip up)
    zone: demarcar (designate an area), dividir (divide into zones), delimitar (designate land use)
    zoom: ampliar (zoom in), aproximar (zoom in on), disparar (rush past; speed along)
  `;

  // "saber (facts)" -> { pt: 'saber', note: 'facts' }
  const VERBS = parseTable(TABLE, plainEntry('pt'));

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
