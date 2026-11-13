/*
 * English -> Korean verb database.
 *
 * One line per English verb:
 *   english: 말하다, 돕다 [b] (usage note)
 *
 * Each translation is the dictionary form in Hangul. A tag in brackets marks an
 * irregular stem that the spelling alone does not reveal: [b] ㅂ-irregular (돕다),
 * [d] ㄷ-irregular (듣다), [s] ㅅ-irregular (짓다), [reu] 르-irregular (모르다).
 * Regular verbs, and the stems that follow a rule from their spelling (하다,
 * ㄹ-stems, ㅡ-stems), need no tag. The first translation of each line is the
 * default; the romanization is worked out by the engine.
 */
(function (global) {
  'use strict';

  const { parseTable } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: 버리다, 포기하다
    abort: 중단하다, 중지하다
    absorb: 흡수하다
    abuse: 학대하다 (mistreat), 남용하다 (misuse)
    accelerate: 가속하다, 촉진하다
    accept: 받아들이다, 수락하다
    accompany: 동행하다, 동반하다
    accomplish: 이루다, 달성하다, 해내다
    accumulate: 축적하다, 쌓다
    accuse: 고발하다, 비난하다
    achieve: 달성하다, 이루다, 성취하다
    acknowledge: 인정하다, 시인하다
    acquire: 얻다, 획득하다, 습득하다 (a skill)
    acquit: 석방하다 (release after a not-guilty verdict), 방면하다
    act: 행동하다, 연기하다 (perform)
    adapt: 적응하다, 각색하다 (a story or play)
    add: 추가하다, 더하다 (in math), 덧붙이다 (add words)
    adhere: 붙다, 고수하다 (adhere to a rule)
    adjust: 조정하다, 조절하다, 맞추다
    administer: 관리하다, 투여하다 (medicine)
    admire: 존경하다, 감탄하다
    admit: 인정하다, 시인하다
    adopt: 채택하다 (a plan), 입양하다 (a child)
    adore: 사랑하다, 숭배하다 (worship)
    advance: 나아가다, 전진하다, 진보하다 (progress)
    advertise: 광고하다
    advise: 조언하다, 충고하다
    advocate: 옹호하다, 지지하다
    affect: 좌우하다 (influence the outcome), 감동시키다 (move emotionally)
    age: 늙다, 노화하다
    agitate: 흔들다, 선동하다 (stir up people)
    agree: 동의하다, 합의하다 (agree on)
    aim: 겨누다, 노리다
    alert: 경고하다, 알리다
    align: 정렬하다, 맞추다
    allocate: 할당하다, 배정하다
    allow: 허락하다, 허용하다
    alter: 바꾸다, 변경하다
    amaze: 놀래다
    amend: 수정하다, 개정하다 (a law)
    amuse: 웃기다 (make laugh), 놀아주다 (entertain a child)
    analyze: 분석하다
    anger: 격분시키다 (make furious), 분노하다 (become angry)
    announce: 발표하다, 알리다
    annoy: 괴롭히다, 거슬리다
    answer: 대답하다, 답하다
    anticipate: 예상하다, 기대하다 (look forward to)
    appeal: 호소하다, 항소하다 (in court)
    appear: 나타나다, 보이다 (seem)
    applaud: 박수치다, 칭찬하다 (praise)
    apply: 적용하다, 신청하다 (apply for), 바르다 [reu] (spread on)
    appoint: 임명하다, 지명하다
    appreciate: 감사하다 (be grateful for), 감상하다 (enjoy art)
    approach: 접근하다, 다가가다, 다가오다
    approve: 승인하다, 찬성하다
    argue: 다투다, 논쟁하다, 주장하다 (claim)
    arise: 생기다, 발생하다, 일어나다
    arrange: 정리하다 (put in order), 마련하다 (organize), 배열하다
    arrest: 체포하다, 검거하다
    arrive: 도착하다, 도달하다 (reach)
    articulate: 표현하다 (express clearly), 발음하다 (pronounce)
    ascend: 오르다 [reu], 올라가다, 상승하다
    ask: 묻다 [d] (a question), 질문하다 (a question), 부탁하다 (for something)
    ask for: 요청하다, 부탁하다
    aspire: 열망하다, 꿈꾸다
    assemble: 조립하다 (parts), 모으다 (gather things), 모이다 (come together)
    assert: 주장하다, 단언하다
    assess: 평가하다, 판단하다
    assign: 배정하다, 맡기다 (a task)
    assimilate: 동화하다, 흡수하다
    assist: 돕다 [b], 도와주다
    associate: 연관시키다, 연상하다, 어울리다 (keep company)
    assume: 가정하다, 추정하다, 맡다 (take on a role)
    assure: 보장하다, 안심시키다
    astonish: 놀래다
    attach: 첨부하다, 붙이다
    attack: 공격하다, 습격하다
    attain: 달성하다, 이루다, 도달하다
    attempt: 시도하다, 꾀하다
    attend: 참석하다 (an event), 돌보다 (take care of), 다니다 (a school or workplace)
    attract: 끌어당기다, 끌다 (attention), 매혹하다 (charm)
    attribute: 돌리다 (attribute to), 부여하다 (ascribe a quality)
    audit: 감사하다 (examine accounts), 청강하다 (a class)
    authorize: 허가하다, 승인하다
    avoid: 피하다, 회피하다
    award: 수여하다, 시상하다
    back up: 백업하다 (data), 지지하다 (support someone), 뒷받침하다 (a claim)
    bake: 굽다 [b]
    balance: 조화시키다, 상쇄하다 (offset), 맞추다 (bring into line)
    ban: 금지하다, 금하다
    bandage: 싸매다, 동여매다
    bang: 두드리다, 부딪치다 (bump)
    baptize: 세례하다
    bargain: 흥정하다, 협상하다 (negotiate)
    bark: 짖다
    base: 근거하다, 기초하다
    bathe: 목욕하다, 목욕시키다 (bathe someone)
    battle: 싸우다, 투쟁하다
    be: 있다 (location, existence), 되다 (become)
    bear: 견디다, 참다, 낳다 (give birth)
    beat: 이기다 (defeat), 때리다 (hit), 휘젓다 [s] (whisk)
    beautify: 꾸미다, 미화하다
    beg: 간청하다, 애원하다, 구걸하다 (for money)
    begin: 시작하다, 개시하다
    belch: 트림하다
    believe: 믿다, 생각하다 (hold the opinion)
    belong: 속하다, 소속되다
    bend: 구부리다, 굽히다, 휘다
    bet: 내기하다, 걸다 (stake)
    bid: 입찰하다, 응찰하다
    bill: 청구하다, 부과하다 (charge a fee)
    bind: 묶다, 매다
    bite: 물다, 깨물다 (bite hard)
    blackmail: 협박하다, 갈취하다 (extort)
    blame: 탓하다, 비난하다, 나무라다 (scold)
    bleach: 표백하다, 탈색하다 (hair)
    bleed: 출혈하다
    blend: 섞다, 혼합하다, 어우러지다 (blend in)
    bless: 축복하다
    blink: 깜빡이다, 깜박거리다
    block: 막다, 차단하다
    bloom: 피다, 꽃피다
    blossom: 꽃피다, 피어나다
    blow: 불다, 날리다 (blow away)
    blur: 흐려지다, 번지다 (smudge), 흐리다 (make unclear)
    board: 탑승하다, 타다
    boast: 자랑하다, 뽐내다
    boil: 끓다, 끓이다 (boil something), 삶다 (boil food)
    bond: 결합하다, 접착하다 (glue together), 친해지다 (form a close relationship)
    book: 예약하다
    boost: 북돋우다, 높이다, 증진하다
    bore: 지루해하다 (feel bored), 뚫다 (drill a hole)
    bother: 괴롭히다, 방해하다 (disturb)
    bounce: 튀다, 튕기다 (make bounce)
    bow: 절하다, 숙이다 (lower the head), 굽히다 (bend)
    boycott: 보이콧하다
    brag: 자랑하다, 떠벌리다
    brake: 감속하다, 멈추다 (bring to a stop)
    break: 깨뜨리다, 부수다, 부러뜨리다 (snap)
    breathe: 호흡하다, 숨쉬다
    brew: 양조하다 (beer), 우리다 (tea)
    bribe: 매수하다
    bring: 가져오다 (bring here), 가져가다 (take there), 데려오다 (bring a person)
    bring up: 키우다 (children), 기르다 [reu] (children), 언급하다 (a topic)
    broadcast: 방송하다, 방영하다 (a TV program)
    broaden: 넓히다, 확대하다
    browse: 둘러보다, 훑어보다 (skim), 검색하다 (search online)
    bruise: 멍들다, 상하다 (of fruit)
    brush: 솔질하다, 양치하다 (teeth), 털다 (brush off dust)
    bubble: 부글거리다, 끓어오르다 [reu]
    buckle: 매다 (fasten a belt), 잠그다 (fasten), 휘다 (warp under pressure)
    build: 짓다 [s], 건설하다, 세우다 (erect)
    bully: 괴롭히다, 따돌리다 (exclude)
    burden: 부담시키다, 짓누르다 [reu] (weigh down)
    burn: 태우다 (burn something), 타다 (be on fire)
    burst: 터지다, 터뜨리다 (make burst)
    bury: 묻다 (bury), 매장하다
    buy: 사다, 구입하다
    buzz: 윙윙거리다, 울리다 (a buzzer)
    cage: 가두다
    calculate: 계산하다, 산출하다
    call: 부르다 [reu] (summon, name), 전화하다 (phone)
    calm: 진정시키다, 가라앉히다, 진정하다 (calm down)
    camp: 야영하다, 캠핑하다
    can: 해내다 (be able to manage)
    cancel: 취소하다, 해지하다 (a subscription)
    capture: 붙잡다, 포착하다 (an image or moment), 점령하다 (a place)
    care: 돌보다, 보살피다, 아끼다 (care about)
    caress: 쓰다듬다, 어루만지다
    carry: 들다 (in the hands), 나르다 [reu] (transport), 지니다 (on one's person)
    carry out: 수행하다, 실행하다
    carve: 새기다 (engrave), 조각하다 (sculpt), 썰다 (carve meat)
    cash: 현금화하다, 환전하다 (exchange money)
    cast: 던지다, 주조하다 (metal), 캐스팅하다 (an actor)
    catch: 잡다, 받다 (a ball), 걸리다 (an illness)
    categorize: 분류하다, 나누다 (divide)
    cause: 일으키다, 초래하다, 야기하다
    cease: 그치다, 멈추다, 중단하다
    celebrate: 축하하다, 기념하다
    chain: 묶다 (with a chain), 속박하다 (bind in chains)
    challenge: 도전하다, 반박하다 (dispute a claim)
    change: 바꾸다, 변하다
    chant: 외치다 (slogans), 읊조리다 (recite in a murmur)
    charge: 청구하다 (a fee), 충전하다 (a battery), 기소하다 (a crime)
    charm: 매혹하다, 홀리다 (bewitch)
    chase: 쫓다, 뒤쫓다, 추격하다
    chat: 이야기하다, 대화하다, 잡담하다
    chatter: 재잘거리다, 지껄이다
    cheat: 속이다, 커닝하다 (on a test)
    check: 확인하다, 점검하다
    cheer: 응원하다, 환호하다 (shout with joy), 격려하다 (encourage)
    cherish: 아끼다, 간직하다 (keep dear)
    chew: 씹다
    chill: 냉각하다, 식히다 (cool down), 식다 (get cold)
    choke: 질식하다, 질식시키다, 목메다 (choke up with emotion)
    choose: 선택하다, 고르다 [reu]
    chop: 썰다, 다지다 (mince), 패다 (chop firewood)
    circle: 둘러싸다 (surround), 맴돌다 (go around), 선회하다 (circle in the air)
    circulate: 순환하다, 돌다 (go around), 유통되다 (money, goods)
    cite: 인용하다, 언급하다
    claim: 주장하다 (assert), 요구하다 (demand rights), 청구하다 (claim money)
    clap: 박수치다, 두드리다 (pat)
    clarify: 밝히다, 해명하다
    clash: 충돌하다, 대립하다 (be at odds)
    clasp: 움켜쥐다, 맞잡다 (clasp hands), 껴안다 (in an embrace)
    classify: 분류하다, 구분하다
    clean: 청소하다, 닦다 (wipe), 씻다 (wash)
    clean up: 치우다, 정리하다 (tidy), 청소하다
    cleanse: 정화하다 (purify), 세척하다 (wash)
    clear: 치우다 (clear away), 비우다 (empty), 개다 (the weather clears)
    clench: 쥐다 (a fist), 악물다 (teeth)
    click: 클릭하다, 딸깍거리다 (make a click)
    climb: 오르다 [reu], 등반하다 (a mountain), 기어오르다 [reu] (clamber up)
    clip: 깎다 (trim), 잘라내다 (cut out), 끼우다 (fasten with a clip)
    clog: 막히다, 막다
    clone: 복제하다
    close: 닫다, 감다 (eyes), 닫히다 (shut)
    clutch: 움켜쥐다, 부여잡다
    coach: 지도하다, 코치하다, 훈련시키다
    coax: 달래다, 구슬리다, 꾀다 (lure)
    code: 코딩하다, 프로그래밍하다, 부호화하다 (encode)
    coincide: 일치하다, 겹치다 (overlap in time)
    collaborate: 협력하다, 합작하다 (produce jointly)
    collapse: 무너지다, 붕괴하다, 쓰러지다 (a person)
    collect: 수집하다 (as a hobby), 모으다 (gather), 줍다 [b] (pick up)
    collide: 충돌하다, 부딪치다
    color: 색칠하다, 물들이다 (tint)
    comb: 빗다, 빗질하다
    combat: 싸우다, 맞서다 (confront), 퇴치하다 (stamp out)
    combine: 합치다, 결합하다, 조합하다
    come: 오다
    come back: 돌아오다, 되돌아오다
    come in: 들어오다, 들어서다 (step in)
    comfort: 위로하다, 안심시키다
    command: 명령하다, 지시하다, 지휘하다 (an army)
    commemorate: 기념하다, 추모하다 (the dead), 기리다 (honor)
    comment: 논평하다, 언급하다
    commit: 저지르다 [reu] (a crime), 범하다 (an offense), 전념하다 (commit to a task)
    communicate: 의사소통하다, 소통하다, 전달하다 (convey)
    compare: 비교하다, 견주다
    compensate: 보상하다, 보충하다 (make up for), 배상하다 (pay damages)
    compete: 경쟁하다, 겨루다
    compile: 컴파일하다 (code), 편찬하다 (a book), 엮다 (assemble)
    complete: 완성하다, 끝내다, 작성하다 (fill in a form)
    complicate: 복잡화하다, 복잡해지다, 꼬이다 (get tangled up)
    compliment: 칭찬하다, 치켜세우다 (flatter)
    comply: 따르다, 준수하다, 응하다 (a request)
    compose: 작곡하다 (music), 짓다 [s] (a poem), 구성하다 (make up)
    comprise: 포함하다, 구성하다
    compute: 계산하다, 연산하다 (in computing)
    conceal: 숨기다, 감추다, 은폐하다
    concede: 인정하다 (admit defeat), 양보하다 (yield), 허용하다 (grant)
    conceive: 구상하다 (an idea), 임신하다 (a child), 상상하다 (imagine)
    conclude: 결론짓다 [s], 끝내다, 마무리하다 (wrap up)
    condemn: 비난하다, 규탄하다, 선고하다 (sentence)
    conduct: 실시하다 (a survey), 지휘하다 (an orchestra), 안내하다 (guide)
    confess: 고백하다, 자백하다 (a crime)
    configure: 설정하다, 구성하다
    confirm: 확인하다, 확정하다 (fix a booking)
    confront: 맞서다, 직면하다
    confuse: 혼동하다 (mix up), 혼란시키다 (bewilder), 헷갈리다 (be confused)
    congratulate: 축하하다
    connect: 연결하다, 잇다 [s], 접속하다 (online)
    conquer: 정복하다, 점령하다, 극복하다 (overcome)
    consent: 동의하다, 승낙하다
    conserve: 보존하다, 보호하다 (protect), 아끼다 (save)
    consider: 고려하다, 생각하다, 여기다 (regard as)
    consist: 이루어지다 (consist of), 구성되다
    console: 위로하다, 달래다
    consolidate: 통합하다 (merge), 굳히다 (strengthen), 다지다 (firm up)
    conspire: 공모하다, 모의하다 (plot)
    constitute: 구성하다, 이루다 (make up)
    construct: 건설하다, 짓다 [s], 구축하다 (a system)
    consult: 상의하다, 상담하다 (an expert), 참고하다 (a book)
    consume: 소비하다, 소모하다 (use up), 섭취하다 (eat or drink)
    contact: 연락하다, 접촉하다
    contain: 포함하다, 담다 (hold), 함유하다 (hold as an ingredient)
    contemplate: 숙고하다, 응시하다 (gaze at)
    contend: 겨루다 (compete), 다투다, 주장하다 (assert)
    continue: 계속하다, 지속하다, 이어가다
    contradict: 반박하다, 모순되다 (be inconsistent with), 어긋나다
    contrast: 대조하다, 대비하다, 대비되다 (stand in contrast)
    contribute: 기여하다, 공헌하다, 기부하다 (donate)
    control: 통제하다, 조절하다 (regulate), 제어하다 (a device)
    converge: 모이다, 수렴하다, 합류하다 (roads, rivers)
    convert: 변환하다, 환산하다 (units, money), 개종하다 (religion)
    convey: 전달하다, 전하다, 표현하다 (express)
    convince: 설득하다, 납득시키다, 확신시키다
    cook: 요리하다, 조리하다, 익히다 (cook through)
    cool: 식히다, 식다, 시원해지다
    cooperate: 협력하다, 협조하다
    coordinate: 조율하다, 조정하다, 조화시키다 (match)
    cope: 대처하다, 감당하다 (handle)
    copy: 복사하다, 베끼다, 모방하다 (imitate)
    correct: 고치다, 바로잡다, 정정하다 (a statement)
    correspond: 일치하다, 해당하다, 대응하다
    corrupt: 부패시키다, 타락시키다 (morally), 손상시키다 (data)
    cost: 들다 (take money or time), 소요되다
    cough: 기침하다
    counsel: 조언하다, 상담하다, 권고하다
    count: 세다, 헤아리다
    counterfeit: 위조하다, 변조하다 (alter)
    court: 구애하다, 쫓아다니다 (chase after)
    cover: 덮다, 가리다 (hide), 다루다 (a topic)
    crack: 갈라지다, 깨뜨리다 (break open), 풀다 (crack a code)
    crash: 충돌하다, 추락하다 (aircraft), 폭락하다 (markets)
    crave: 갈망하다, 바라다 (long for)
    crawl: 기다, 기어가다 (move on hands and knees)
    create: 만들다, 창조하다, 생성하다 (in software)
    credit: 입금하다 (to an account), 인정하다 (give credit)
    criticize: 비판하다, 비난하다, 흉보다 (speak ill of)
    cross: 건너다, 가로지르다 [reu], 넘다 (cross over)
    crush: 부수다 (smash), 으깨다 (mash), 짓누르다 [reu] (squash)
    cry: 울다 (weep), 외치다 (shout)
    cultivate: 재배하다 (crops), 경작하다 (land), 가꾸다 (nurture)
    cure: 치료하다, 치유하다, 낫다 [s] (recover)
    curl: 말다 (roll up), 파마하다 (perm hair), 웅크리다 (curl up)
    curse: 저주하다, 욕하다 (swear)
    cushion: 완화하다 (ease an impact), 흡수하다 (absorb a shock)
    customize: 맞추다 (tailor to needs), 커스터마이징하다
    cut: 자르다 [reu], 베다 (cut skin or grass), 썰다 (slice food)
    cut off: 잘라내다, 끊다 (cut the supply), 차단하다
    damage: 손상시키다, 해치다, 망가뜨리다
    dance: 춤추다
    dare: 감행하다 (dare to do), 무릅쓰다 (brave a risk)
    darken: 어두워지다, 짙어지다
    darn: 깁다 [b], 꿰매다 (stitch)
    dash: 내달리다, 돌진하다, 서두르다 [reu] (hurry)
    dazzle: 압도하다 (overwhelm), 현혹하다 (bewilder)
    deal: 다루다 (deal with), 처리하다 (handle), 거래하다 (do business)
    debate: 토론하다, 논쟁하다
    debug: 디버깅하다
    decay: 썩다, 부패하다, 쇠퇴하다 (decline)
    deceive: 속이다, 기만하다
    decide: 결정하다, 결심하다, 정하다
    decipher: 해독하다, 판독하다
    declare: 선언하다, 신고하다 (customs, taxes), 선포하다 (proclaim)
    decline: 거절하다, 사양하다 (turn down politely), 쇠퇴하다 (go downhill)
    decorate: 장식하다, 꾸미다
    decrease: 줄다 (become less), 줄이다 (make less), 감소하다
    decrypt: 복호화하다, 해독하다 (decode)
    dedicate: 바치다, 헌정하다 (a work), 전념하다
    deduct: 빼다, 공제하다, 차감하다
    deem: 간주하다, 여기다
    defeat: 물리치다, 이기다, 격파하다
    defend: 방어하다, 지키다, 변호하다 (in court)
    defer: 미루다 (postpone), 연기하다, 따르다 (defer to)
    define: 정의하다, 규정하다
    deflect: 막아내다, 돌리다 (turn aside), 피하다
    degrade: 저하시키다, 비하하다 (demean), 분해하다 (break down)
    delay: 늦추다, 미루다, 지연시키다
    delegate: 위임하다, 맡기다
    delete: 삭제하다, 지우다
    deliberate: 숙고하다, 심의하다 (in a committee), 협의하다 (confer)
    delight: 매료시키다, 기뻐하다 (be delighted)
    deliver: 배달하다 (goods), 전달하다 (a message), 연설하다 (a speech)
    demand: 요구하다, 요청하다
    demolish: 철거하다, 허물다, 부수다
    demonstrate: 증명하다, 보여주다, 시위하다 (protest)
    denote: 나타내다, 의미하다
    denounce: 규탄하다, 고발하다 (report to the authorities), 폭로하다 (expose)
    deny: 부인하다, 부정하다, 거부하다 (refuse to give)
    depend: 의존하다, 좌우되다, 의지하다
    deploy: 배치하다, 배포하다 (software), 전개하다
    deport: 추방하다, 송환하다 (send back)
    deposit: 예금하다, 입금하다, 맡기다 (leave for safekeeping)
    deprive: 빼앗다, 박탈하다 (rights)
    derive: 유래하다, 파생하다, 끌어내다 (obtain from a source)
    descend: 내려가다, 내려오다, 하강하다
    describe: 묘사하다, 설명하다, 서술하다
    deserve: 값하다 (be worthy of)
    design: 디자인하다, 설계하다, 고안하다 (devise)
    designate: 지정하다, 지명하다
    desire: 원하다, 바라다
    despise: 경멸하다, 멸시하다, 업신여기다
    destroy: 파괴하다, 부수다, 파멸시키다 (ruin)
    detect: 감지하다, 탐지하다, 알아채다 (notice)
    deteriorate: 악화되다, 나빠지다
    determine: 결정하다, 알아내다 (find out)
    detest: 혐오하다, 증오하다, 질색하다
    devastate: 황폐화시키다, 초토화하다, 파괴하다
    develop: 개발하다, 발전시키다, 발전하다 (progress)
    deviate: 벗어나다, 이탈하다
    devour: 먹어치우다, 집어삼키다, 탐독하다 (books)
    diagnose: 진단하다
    dial: 걸다 (a phone call), 누르다 [reu] (press the buttons)
    dictate: 구술하다, 지시하다, 좌우하다 (determine)
    die: 죽다, 사망하다
    differ: 달라지다 (become different), 엇갈리다 (of opinions)
    dig: 파다, 파내다, 캐다 (dig up roots)
    digest: 소화하다, 소화시키다
    dilute: 희석하다, 타다 (mix into liquid)
    dim: 낮추다 (turn down a light), 희미해지다 (grow dim)
    diminish: 줄어들다, 감소하다, 약해지다 (weaken)
    dine: 식사하다
    direct: 이끌다, 감독하다 (a film), 안내하다 (give directions)
    disable: 비활성화하다, 무력화하다
    disagree: 반대하다, 엇갈리다 (opinions differ)
    disappear: 사라지다, 없어지다, 실종되다 (go missing)
    disappoint: 실망시키다, 실망하다 (be disappointed)
    disarm: 무장해제하다 (a person), 해체하다 (a bomb)
    discard: 버리다, 폐기하다
    discharge: 방출하다, 방전하다 (a battery), 퇴원시키다 (a patient)
    disclose: 공개하다, 밝히다, 누설하다 (leak)
    disconnect: 끊다, 분리하다, 뽑다 (unplug)
    discourage: 낙담시키다, 단념시키다 (talk out of), 말리다 (dissuade)
    discover: 발견하다, 알아내다, 찾아내다
    discredit: 깎아내리다, 폄하하다
    discuss: 논의하다, 의논하다, 이야기하다 (talk about)
    disguise: 변장하다, 위장하다, 가장하다
    disgust: 역겨워하다 (feel disgusted), 질리다 (get sick of)
    disinfect: 소독하다, 살균하다 (sterilize)
    dismantle: 분해하다, 해체하다
    dismiss: 해고하다 (an employee), 일축하다 (an idea), 기각하다 (a case)
    dispatch: 발송하다, 파견하다 (send people), 처리하다 (finish off quickly)
    dispense: 나눠주다, 조제하다 (medicine), 면제하다 (exempt)
    disperse: 흩어지다, 흩뜨리다, 해산하다 (a crowd)
    displace: 밀어내다, 대체하다 (replace), 이주시키다 (uproot people)
    display: 전시하다, 보여주다, 표시하다 (on a screen)
    disprove: 반증하다, 논박하다 (rebut)
    dispute: 다투다, 논쟁하다, 반박하다 (contest a claim)
    distinguish: 구별하다, 구분하다, 식별하다 (identify)
    distort: 왜곡하다, 일그러뜨리다, 비틀다 (twist)
    distract: 방해하다, 분산시키다 (attention), 흩뜨리다
    distribute: 분배하다, 배포하다 (hand out copies), 유통하다 (goods)
    disturb: 방해하다, 어지럽히다, 동요시키다 (upset)
    dive: 잠수하다, 다이빙하다, 뛰어들다 (jump in)
    diversify: 다양화하다, 다각화하다 (a business)
    divide: 나누다, 가르다 [reu] (split in two), 분할하다
    divorce: 이혼하다, 갈라서다
    do: 하다, 행하다 (perform)
    document: 기록하다, 문서화하다
    dodge: 피하다, 회피하다, 모면하다 (get out of)
    dominate: 지배하다, 압도하다, 군림하다 (rule over)
    donate: 기부하다, 기증하다, 헌혈하다 (blood)
    double: 배가하다, 배가되다 (become doubled)
    doubt: 의심하다, 의문시하다
    download: 다운로드하다, 내려받다
    draft: 작성하다, 기초하다 (a bill), 징집하다 (military)
    drag: 끌다, 끌어당기다, 드래그하다 (on a screen)
    drain: 배수하다, 빼내다, 고갈시키다 (deplete)
    draw: 그리다, 당기다 (pull), 뽑다 (a card or lot)
    dread: 두려워하다, 무서워하다
    dream: 꿈꾸다, 몽상하다 (daydream)
    dress: 입다 (wear), 입히다 (dress someone), 차려입다 (dress up)
    dribble: 드리블하다 (a ball), 흘리다 (let liquid drip)
    drift: 표류하다, 떠내려가다, 떠돌다 (wander)
    drill: 뚫다 (a hole), 시추하다 (oil), 훈련시키다 (train)
    drink: 마시다, 들이켜다 (gulp)
    drip: 떨어지다 (fall in drops), 흐르다 [reu] (trickle), 새다 (leak)
    drive: 운전하다, 몰다, 추진하다 (a project)
    drizzle: 흩뿌리다 (rain lightly), 뿌리다 (sprinkle liquid)
    drop: 떨어뜨리다 (let fall), 떨어지다 (fall), 놓다 (let go of)
    drown: 익사하다, 익사시키다 (drown someone)
    dry: 말리다, 마르다 [reu] (become dry), 닦다 (wipe dry)
    dump: 버리다, 쏟아붓다 [s] (pour out)
    duplicate: 복제하다, 복사하다
    dwell: 살다, 거주하다, 곱씹다 (dwell on a thought)
    dye: 염색하다, 물들이다 (tint)
    earn: 벌다 (money), 얻다 (respect or a reputation)
    ease: 덜다 (relieve), 완화하다 (alleviate), 누그러뜨리다 (soften)
    eat: 먹다, 식사하다 (have a meal)
    echo: 메아리치다, 울리다 (resound), 되풀이하다 (repeat someone's words)
    edit: 편집하다, 수정하다, 교정하다 (proofread)
    educate: 교육하다, 가르치다
    elaborate: 구체화하다 (work out in detail), 부연하다 (expand on a point)
    elapse: 지나다, 흐르다 [reu], 경과하다
    elect: 선출하다, 뽑다 (by vote)
    elevate: 높이다, 올리다, 승격시키다 (promote)
    eliminate: 제거하다, 없애다, 탈락시키다 (knock out of a contest)
    elude: 피하다, 따돌리다 (shake off a pursuer), 빠져나가다 (slip away)
    email: 보내다 (send an email)
    embark: 승선하다 (board a ship), 착수하다 (start on a venture), 나서다 (set out)
    embed: 삽입하다, 박다 (drive in), 내장하다 (build in)
    embrace: 껴안다, 포옹하다, 받아들이다 (embrace an idea)
    embroider: 수놓다
    emerge: 나타나다, 드러나다 (come to light), 부상하다 (rise to prominence)
    emit: 내뿜다 (smoke or gas), 방출하다 (energy), 발산하다 (give off)
    emphasize: 강조하다, 역설하다 (stress an argument)
    employ: 고용하다 (hire), 사용하다 (use)
    empower: 위임하다 (give authority to), 강화하다 (strengthen)
    empty: 비우다, 비다 (become empty)
    enable: 허용하다, 활성화하다 (switch on a feature)
    enact: 제정하다, 공포하다 (proclaim a law)
    enchant: 매혹하다, 홀리다
    encircle: 둘러싸다, 에워싸다
    encounter: 마주치다, 직면하다 (a problem)
    encourage: 격려하다, 권장하다 (a practice)
    encrypt: 암호화하다
    end: 끝나다 (come to an end), 끝내다 (bring to an end)
    endorse: 지지하다, 보증하다 (a product)
    endure: 견디다, 참다
    energize: 활성화하다, 북돋우다
    enforce: 시행하다, 집행하다 (a law)
    engage: 끌어들이다 (involve), 고용하다 (hire)
    engrave: 새기다, 조각하다
    enhance: 향상시키다, 강화하다
    enjoy: 즐기다, 누리다 (enjoy a benefit)
    enlarge: 확대하다, 넓히다
    enlist: 입대하다 (join the military), 모집하다 (recruit)
    enrage: 격분시키다
    enrich: 살찌우다 (enrich the mind), 농축하다 (enrich uranium)
    enroll: 등록하다, 입학하다 (in a school)
    ensure: 보장하다, 확인하다 (make sure)
    entail: 수반하다, 요구하다 (require)
    entangle: 얽히다 (get entangled), 엉키다 (get tangled)
    enter: 들어가다, 들어오다 (come in), 입력하다 (enter data)
    entertain: 접대하다 (host guests), 품다 (an idea), 놀아주다 (amuse a child)
    entrust: 맡기다, 위임하다
    envision: 상상하다, 구상하다
    envy: 부러워하다, 시기하다
    equip: 갖추다, 구비하다
    erase: 지우다, 삭제하다 (delete data)
    err: 실수하다, 잘못하다, 틀리다 (be wrong)
    escalate: 격화되다 (of a conflict), 확대하다 (expand)
    escape: 탈출하다, 도망치다, 벗어나다 (get out of)
    establish: 설립하다 (found an institution), 확립하다 (set firmly)
    estimate: 추정하다, 어림잡다
    evacuate: 대피시키다 (move people to safety), 대피하다 (flee to safety)
    evade: 피하다, 회피하다, 따돌리다 (shake off a pursuer)
    evaluate: 평가하다
    evaporate: 증발하다, 증발시키다 (cause to evaporate)
    evoke: 불러일으키다, 자아내다 (draw out a feeling)
    evolve: 진화하다, 발전하다 (develop gradually)
    exaggerate: 과장하다, 부풀리다
    exalt: 찬양하다, 높이다 (raise in rank)
    examine: 검사하다, 살펴보다, 진찰하다 (a patient)
    excavate: 발굴하다, 파다 (dig)
    exceed: 초과하다, 넘다, 능가하다 (surpass)
    excel: 잘하다 (be very good at), 앞서다 (outdo others)
    exchange: 교환하다, 바꾸다, 주고받다
    excite: 흥분시키다, 자극하다 (stimulate)
    exclude: 제외하다, 배제하다 (rule out), 빼다
    excuse: 용서하다, 봐주다 (let off), 면제하다 (exempt)
    execute: 실행하다 (carry out), 처형하다 (put to death)
    exempt: 면제하다
    exercise: 운동하다, 행사하다 (a right), 훈련하다 (train)
    exert: 발휘하다, 행사하다 (influence)
    exhale: 내쉬다, 내뿜다 (blow out)
    exhaust: 소진하다 (use up), 고갈시키다 (deplete), 지치다 (become worn out)
    exhibit: 전시하다, 드러내다 (show a trait)
    exile: 추방하다, 유배하다
    exist: 존재하다, 있다
    expand: 확장하다, 확대하다, 팽창하다 (swell)
    expect: 기대하다, 예상하다 (anticipate), 바라다 (hope for)
    expedite: 촉진하다, 서두르다 [reu] (hurry), 앞당기다 (bring forward)
    expel: 쫓아내다, 추방하다, 퇴학시키다 (from a school)
    experience: 경험하다, 겪다
    experiment: 실험하다
    expire: 만료되다, 숨지다 (die)
    explain: 설명하다, 해명하다 (account for an action)
    explode: 폭발하다, 터지다
    exploit: 이용하다 (make use of), 착취하다 (exploit workers), 악용하다 (misuse)
    explore: 탐험하다, 탐색하다 (search through), 탐구하다 (study in depth)
    export: 수출하다, 내보내다 (data)
    expose: 노출하다, 드러내다 (reveal), 폭로하다 (a scandal)
    express: 표현하다, 나타내다
    extend: 연장하다 (in time), 늘리다 (lengthen), 뻗다 (stretch out)
    extinguish: 끄다, 소멸시키다 (wipe out)
    extol: 칭송하다, 극찬하다
    extract: 추출하다, 뽑다 (pull out), 발췌하다 (quote an excerpt)
    fabricate: 제작하다 (manufacture), 날조하다 (invent falsely)
    face: 직면하다, 맞서다, 향하다 (face a direction)
    facilitate: 촉진하다, 돕다 [b], 진행하다 (lead a session)
    fade: 희미해지다, 바래다 (lose color), 사라지다 (vanish)
    fail: 실패하다, 떨어지다 (fail a test), 낙제하다 (fail a course)
    fake: 위조하다, 가장하다 (pretend)
    fall: 떨어지다, 내리다 (of rain or snow)
    fall down: 넘어지다, 쓰러지다 (collapse)
    fan: 부채질하다, 부추기다 (stir up)
    fascinate: 매료시키다, 사로잡다
    fasten: 고정하다 (secure), 매다 (tie a belt or knot), 묶다 (tie up)
    fatigue: 지치다, 피곤해지다
    favor: 선호하다, 편들다 (side with), 편애하다 (show favoritism)
    fear: 두려워하다, 무서워하다, 우려하다 (be concerned)
    feed: 먹이다, 공급하다 (supply)
    feel: 느끼다
    fence: 둘러막다 (enclose with a fence), 펜싱하다 (do the sport of fencing)
    ferment: 발효하다, 발효시키다 (cause to ferment)
    fetch: 가져오다, 데려오다 (a person)
    fight: 싸우다, 다투다 (quarrel), 투쟁하다 (struggle for a cause)
    figure out: 알아내다, 파악하다 (grasp), 이해하다 (understand)
    file: 보관하다 (put in files), 제출하다 (submit a claim), 갈다 (file down)
    fill: 채우다, 메우다 (fill a gap)
    fill in: 기입하다 (write in a form), 작성하다 (complete a form), 대신하다 (substitute for)
    film: 촬영하다, 찍다
    filter: 여과하다, 거르다 [reu] (strain), 걸러내다 (filter out)
    finance: 후원하다 (back financially), 융자하다 (lend funds for)
    find: 찾다, 발견하다, 찾아내다
    find out: 알아내다, 알아보다 (look into)
    fine: 부과하다 (impose a fine), 처벌하다 (punish)
    finish: 끝내다, 마치다, 완료하다 (complete)
    fire: 해고하다 (from a job), 쏘다 (a weapon)
    fish: 낚시하다, 낚다 (catch with a rod)
    fit: 맞다 (be the right size), 들어가다 (fit inside), 어울리다 (suit)
    fix: 고치다, 수리하다, 고정하다 (fix in place)
    flap: 퍼덕이다 (wings), 펄럭이다 (a flag)
    flare: 번쩍이다 (flash), 타오르다 [reu] (blaze up)
    flash: 번쩍이다, 번뜩이다 (flash across)
    flatter: 아첨하다, 치켜세우다 (praise excessively)
    flavor: 양념하다 (season), 가미하다 (add flavoring)
    flee: 도망치다, 달아나다, 피신하다 (take refuge)
    fling: 내던지다, 팽개치다 (toss aside)
    flip: 뒤집다, 넘기다 (flip pages), 튕기다 (flick)
    flirt: 시시덕거리다 (banter playfully), 집적거리다 (make advances)
    float: 뜨다, 떠다니다 (drift about), 띄우다 (make float)
    flood: 범람하다 (overflow), 침수시키다 (inundate), 쇄도하다 (pour in)
    flourish: 번창하다, 번성하다, 휘두르다 [reu] (brandish)
    flow: 흐르다 [reu], 흘러가다 (flow along)
    flutter: 팔랑거리다 (flutter lightly), 펄럭이다 (wave in the wind)
    fly: 날다, 비행하다 (travel by air), 날아가다 (fly off)
    focus: 집중하다, 집중시키다 (direct attention), 맞추다 (adjust a lens)
    fold: 접다, 개다 (fold clothes)
    follow: 따라가다, 따르다 (obey), 뒤따르다 (come after)
    fool: 속이다, 놀리다 (tease)
    forbid: 금지하다, 금하다
    force: 강요하다, 강제하다 (compel)
    forecast: 예측하다, 예보하다 (weather), 전망하다 (project)
    foresee: 예견하다, 예상하다, 내다보다 (look ahead)
    forge: 위조하다 (counterfeit), 구축하다 (build ties), 단조하다 (shape metal by hammering)
    forget: 잊다, 잊어버리다, 까먹다 (informal)
    forgive: 용서하다, 봐주다 (let off)
    form: 형성하다, 이루다 (make up), 구성하다 (compose)
    format: 포맷하다
    formulate: 수립하다 (draw up a plan), 정립하다 (establish a theory), 공식화하다 (state formally)
    found: 설립하다, 창립하다, 세우다
    fracture: 부러뜨리다 (snap), 부러지다 (break), 골절되다 (be fractured)
    frame: 표구하다 (mount a picture), 모함하다 (frame someone)
    free: 풀어주다 (let go), 해방하다 (liberate), 석방하다 (release a prisoner)
    freeze: 얼다 (turn to ice), 얼리다 (make freeze), 동결하다 (freeze assets)
    frighten: 겁주다, 놀래다 (startle), 위협하다 (threaten)
    frown: 찡그리다, 찌푸리다
    frustrate: 좌절시키다, 방해하다 (thwart)
    fry: 튀기다 (deep-fry), 볶다 (stir-fry), 부치다 (pan-fry flat food)
    fuel: 주유하다 (fill with fuel), 급유하다 (refuel), 부추기다 (stoke)
    fulfill: 이루다 (achieve a dream), 이행하다 (carry out a duty), 충족시키다 (satisfy)
    function: 작동하다, 기능하다 (serve a function)
    furnish: 갖추다 (fit out a room), 제공하다 (supply)
    fuse: 융합하다, 합치다
    gain: 얻다, 획득하다, 늘다 (increase)
    gallop: 질주하다, 내달리다
    gamble: 도박하다, 내기하다 (bet), 걸다 (stake)
    gather: 모으다, 모이다 (come together), 줍다 [b] (pick up)
    generate: 생성하다, 발생시키다, 창출하다 (create value)
    gesture: 손짓하다
    get: 얻다 (obtain), 받다 (receive), 구하다 (procure)
    give: 주다, 드리다 (to a superior)
    give up: 포기하다, 그만두다 (quit), 단념하다 (abandon hope)
    glorify: 찬미하다, 미화하다 (idealize)
    glow: 빛나다, 달아오르다 [reu] (glow with heat)
    glue: 붙이다, 접착하다
    go: 가다, 다니다 (go regularly)
    go back: 돌아가다, 돌아오다 (come back), 되돌아가다 (turn back)
    go on: 계속하다, 계속되다, 이어지다
    go out: 나가다, 외출하다 (leave home), 꺼지다 (of a light)
    gossip: 험담하다, 수군거리다
    govern: 통치하다, 다스리다, 지배하다
    grab: 잡다, 움켜쥐다 (clutch), 낚아채다 (snatch)
    grade: 채점하다 (mark a test), 평가하다 (rate), 매기다 (assign a grade)
    graduate: 졸업하다
    graft: 접붙이다 (a plant), 이식하다 (transplant tissue), 접목하다 (combine)
    grant: 허락하다, 들어주다 (a request), 부여하다 (confer)
    grasp: 움켜쥐다 (grip), 파악하다 (comprehend), 이해하다
    grate: 갈다 (grate food), 거슬리다 (irritate)
    graze: 뜯어먹다 (graze on grass), 방목하다 (put to pasture), 스치다 (brush lightly)
    greet: 인사하다, 맞이하다 (welcome)
    grieve: 슬퍼하다, 애도하다 (mourn a death)
    grill: 굽다 [b], 추궁하다 (question hard)
    grind: 갈다, 빻다 (pound to powder), 분쇄하다 (pulverize)
    grip: 쥐다, 움켜잡다 (clutch), 붙들다 (hold fast)
    groan: 신음하다, 끙끙거리다
    grow: 자라다, 커지다 (get bigger), 재배하다 (crops)
    grow up: 자라다, 성장하다, 철들다 (become mature)
    growl: 으르렁거리다, 으르렁대다
    grunt: 끙끙거리다 (with effort), 꿀꿀거리다 (of a pig), 투덜거리다 (grumble)
    guarantee: 보증하다, 보장하다, 장담하다 (assert with confidence)
    guard: 지키다, 경비하다 (stand guard), 감시하다 (keep watch)
    guess: 추측하다, 짐작하다, 알아맞히다 (guess correctly)
    guide: 안내하다, 이끌다, 인도하다
    gulp: 들이켜다 (gulp down a drink), 삼키다 (swallow)
    gush: 솟구치다 (spurt up), 쏟아지다 (pour out), 분출하다 (spout or erupt)
    hack: 해킹하다 (break into a system), 난도질하다 (hack to pieces)
    hail: 쏟아지다 (of hail, pour down), 부르다 [reu] (hail a taxi), 환호하다 (cheer)
    halt: 멈추다, 중단하다, 정지하다 (come to a stop)
    hammer: 망치질하다, 못질하다 (hammer in a nail), 두드리다 (pound)
    hamper: 방해하다, 저해하다, 가로막다 (block)
    hand over: 넘겨주다, 건네주다 (pass to), 인계하다 (hand over duties)
    handle: 다루다, 처리하다 (deal with), 감당하다 (cope with)
    hang: 걸다 (hang up), 걸리다 (be hanging), 매달다 (suspend)
    hang up: 끊다 (hang up the phone), 걸다 (hang up a coat)
    happen: 일어나다, 생기다, 발생하다 (occur, formal)
    harass: 괴롭히다, 성희롱하다 (sexually)
    harden: 굳다 (become hard), 굳히다 (make hard), 단련하다 (toughen)
    harm: 해치다, 손상시키다 (damage)
    harmonize: 조화시키다, 어울리다 (go well together), 화합하다 (live in harmony)
    harvest: 수확하다, 거두다, 추수하다
    hate: 싫어하다, 미워하다 (hate a person), 증오하다 (loathe)
    haul: 끌다 (drag), 나르다 [reu] (carry), 운반하다 (transport)
    have: 가지다, 있다 (to have, there is), 소유하다 (own)
    heal: 낫다 [s] (get well), 치유하다 (cure or heal), 치료하다 (treat)
    heap: 쌓다, 쌓이다 (be piled up)
    hear: 듣다 [d], 들리다 (be audible)
    heat: 데우다 (warm up food or drink), 가열하다 (apply heat), 덥히다 (warm a room)
    heighten: 높이다, 고조시키다
    help: 돕다 [b], 도와주다
    hesitate: 망설이다, 주저하다, 머뭇거리다
    hide: 숨기다, 숨다 (go into hiding), 감추다
    highlight: 강조하다, 부각시키다
    hijack: 납치하다, 탈취하다 (seize by force)
    hinder: 방해하다, 막다 (prevent), 지연시키다 (delay)
    hint: 암시하다, 귀띔하다 (tip off), 시사하다 (suggest)
    hire: 고용하다, 채용하다 (recruit)
    hit: 때리다, 치다, 맞히다 (hit a target)
    hoard: 비축하다, 축적하다, 사재기하다 (buy up and stockpile)
    hold: 잡다, 들다 (hold up or carry), 안다 (hold in one's arms)
    hold on: 버티다 (hold out), 기다리다 (wait), 매달리다 (cling)
    honor: 존경하다, 기리다, 지키다 (honor a promise)
    hook: 걸다 (hang on a hook), 낚다 (catch with a hook), 연결하다 (connect)
    hop: 깡충거리다, 뛰다
    hope: 바라다, 희망하다, 소망하다 (wish for)
    host: 주최하다, 숙박시키다 (lodge a guest), 진행하다 (host a program)
    hover: 맴돌다, 떠돌다
    howl: 울부짖다, 울다 (of wolves)
    hug: 껴안다, 안다, 포옹하다
    hum: 흥얼거리다, 윙윙거리다 (buzz)
    humiliate: 모욕하다, 망신시키다 (shame in public)
    hunt: 사냥하다, 찾아다니다 (hunt for)
    hurl: 던지다, 집어던지다 (fling), 퍼붓다 [s] (hurl abuse)
    hurt: 다치다 (get injured), 쑤시다 (ache), 해치다 (harm)
    hypnotize: 최면시키다
    identify: 식별하다, 확인하다 (confirm), 알아보다 (recognize)
    idolize: 우상화하다, 숭배하다, 우러러보다 (look up to)
    ignore: 무시하다, 외면하다, 묵살하다 (brush aside)
    illuminate: 비추다, 밝히다, 조명하다
    illustrate: 예시하다 (show by example), 보여주다 (demonstrate)
    imagine: 상상하다, 떠올리다 (picture in the mind)
    imitate: 모방하다, 본받다 (follow the example of), 본뜨다 (copy a model)
    immerse: 담그다, 몰입하다 (become absorbed in), 몰두하다 (be engrossed)
    immobilize: 고정시키다, 마비시키다 (paralyze), 제압하다 (subdue)
    impeach: 탄핵하다, 고발하다 (accuse)
    impede: 가로막다, 방해하다, 지체시키다 (slow down)
    implement: 시행하다, 구현하다 (realize in practice), 실행하다 (carry out)
    implore: 애원하다, 간청하다, 호소하다 (appeal to)
    imply: 암시하다, 의미하다 (mean), 내포하다 (carry as a meaning)
    import: 수입하다, 들여오다 (bring in), 불러오다 (import data)
    impose: 부과하다, 강요하다 (force upon someone)
    impress: 감동시키다, 각인시키다 (imprint on the mind)
    imprison: 투옥하다, 수감하다, 가두다 (lock up)
    improve: 개선하다, 나아지다 (get better), 향상시키다 (raise the level)
    incite: 선동하다, 사주하다 (instigate)
    incline: 기울이다 (tilt something), 기울다 (lean or slope), 쏠리다 (tend toward)
    include: 포함하다, 포함시키다, 넣다
    incorporate: 포함시키다, 통합하다 (merge into), 법인화하다 (form a corporation)
    increase: 증가하다, 늘리다 (make more), 늘다 (grow in amount)
    incur: 초래하다, 입다 (suffer a loss), 떠안다 (take on a burden)
    indicate: 나타내다, 가리키다 (point to), 표시하다 (mark)
    induce: 유도하다, 유발하다 (bring on), 일으키다 (cause)
    infect: 감염시키다, 전염시키다 (spread to others)
    infer: 추론하다, 유추하다 (infer by analogy)
    inflate: 부풀리다, 부풀다 (swell up), 불다 (blow up a balloon)
    inflict: 가하다, 입히다 (cause injury), 끼치다 (cause harm)
    influence: 좌우하다 (sway), 감화시키다 (influence morally)
    inform: 알리다, 알려주다, 통보하다 (notify officially)
    infringe: 침해하다 (violate a right), 위반하다 (break a rule), 침범하다 (encroach)
    ingest: 섭취하다, 삼키다 (swallow), 복용하다 (take a medicine)
    inhabit: 거주하다, 살다, 서식하다 (of animals)
    inhale: 들이마시다, 들이쉬다, 흡입하다 (inhale a substance)
    inherit: 물려받다, 상속받다 (inherit property), 이어받다 (take over)
    inhibit: 억제하다, 저해하다, 억누르다 [reu] (hold down)
    initiate: 시작하다, 개시하다, 착수하다 (undertake)
    inject: 주사하다, 주입하다 (pour or pump in), 투입하다 (put funds in)
    injure: 부상시키다, 다치다 (get hurt), 해치다 (harm)
    inquire: 문의하다, 묻다 [d] (ask), 알아보다 (look into)
    insert: 삽입하다, 끼우다 (fit between), 꽂다 (stick into)
    insinuate: 암시하다, 내비치다 (hint slyly), 빗대다 (allude indirectly)
    insist: 주장하다, 고집하다, 우기다 (insist stubbornly)
    inspect: 점검하다, 검사하다, 시찰하다 (make an inspection tour)
    inspire: 고취하다, 고무하다, 불러일으키다 (stir up a feeling)
    install: 설치하다, 깔다 (install software), 장착하다 (fit in place)
    instruct: 가르치다, 지시하다 (give orders), 교육하다 (train)
    insult: 모욕하다, 욕하다 (swear at), 모독하다
    insure: 보장하다 (guarantee), 가입하다 (take out an insurance policy)
    integrate: 통합하다, 합치다, 어우러지다 (blend in)
    intend: 의도하다, 작정하다 (be determined to), 계획하다 (plan)
    intensify: 강화하다, 심해지다 (grow more severe), 격화되다 (heat up)
    interact: 상호작용하다, 교류하다, 어울리다 (mingle)
    interest: 끌다 (attract attention), 자극하다 (pique curiosity)
    interfere: 간섭하다, 참견하다 (butt in), 방해하다 (get in the way of)
    interpret: 해석하다, 통역하다 (interpret speech), 풀이하다 (explain)
    interrogate: 심문하다, 취조하다, 캐묻다 [d] (probe)
    interrupt: 끼어들다 (cut in), 중단시키다 (halt), 가로막다 (cut off)
    intervene: 개입하다, 나서다 (step in), 중재하다 (mediate)
    interview: 인터뷰하다, 면접하다 (job interview), 면담하다 (talk with)
    intimidate: 위협하다, 겁주다, 위축시키다 (cow)
    intrigue: 끌다 (arouse interest), 꾀하다 (scheme)
    introduce: 소개하다 (a person), 도입하다 (a system), 선보이다 (unveil a product)
    invade: 침략하다, 침공하다, 침입하다 (intrude)
    invent: 발명하다, 고안하다 (devise), 지어내다 (make up a story)
    invest: 투자하다, 쏟다 (pour in time or effort)
    invite: 초대하다, 초청하다 (invite formally), 부르다 [reu] (call over)
    invoice: 청구하다
    invoke: 호출하다 (call a function or spirit), 인용하다 (cite as authority), 기원하다 (call upon a deity)
    involve: 포함하다, 연루시키다 (implicate in), 참여시키다 (get to take part)
    iron: 다림질하다, 다리다
    irritate: 괴롭히다 (annoy), 자극하다 (inflame skin), 거슬리다 (get on one's nerves)
    isolate: 고립시키다, 격리하다 (quarantine), 분리하다 (separate)
    issue: 발행하다 (a publication or currency), 발급하다 (a document), 발표하다 (a statement)
    itch: 근질거리다, 간질거리다
    jam: 막히다, 끼이다 (get stuck), 막다 (block)
    jeer: 야유하다, 조롱하다, 비웃다
    jingle: 짤랑거리다, 딸랑거리다
    jog: 조깅하다, 달리다
    join: 합치다 (put together), 가입하다 (become a member), 합류하다 (join up with)
    joke: 농담하다, 장난치다 (kid around)
    jolt: 덜컹거리다, 뒤흔들다 (shake hard)
    journey: 여행하다, 이동하다
    judge: 판단하다, 재판하다 (try a case), 심사하다 (judge a competition)
    jump: 뛰다, 점프하다, 뛰어넘다 (jump over)
    justify: 정당화하다, 합리화하다 (rationalize)
    keep: 보관하다, 유지하다, 지키다 (keep a promise)
    keep on: 계속하다, 지속하다, 이어가다 (carry on)
    kick: 차다, 걷어차다, 발길질하다
    kidnap: 납치하다, 유괴하다 (abduct a child)
    kill: 죽이다, 살해하다
    kindle: 지피다, 점화하다, 불러일으키다 (rouse a feeling)
    kiss: 키스하다, 뽀뽀하다 (give a peck)
    knead: 반죽하다, 주무르다 [reu]
    knit: 뜨개질하다, 뜨다 (knit), 짜다 (knit or weave)
    knock: 두드리다, 노크하다 (at a door), 치다 (strike)
    knot: 매듭짓다 [s], 묶다, 매다
    know: 알다 (facts, how to, people, places)
    label: 표시하다, 분류하다, 낙인찍다 (stigmatize)
    lack: 결여하다, 모자라다 (be short of)
    lament: 한탄하다, 개탄하다, 슬퍼하다
    land: 착륙하다, 착지하다 (land after a jump), 상륙하다 (come ashore)
    languish: 시들다, 쇠약해지다 (grow weak), 침체되다 (stagnate)
    lash: 채찍질하다, 몰아치다 (of wind or rain), 묶다 (lash down)
    last: 지속되다, 오래가다 (last long), 걸리다 (take time)
    laugh: 웃다, 비웃다 (laugh at)
    launch: 출시하다 (a product), 발사하다 (a rocket), 시작하다 (a campaign)
    launder: 세탁하다 (clothes or money), 빨래하다
    lay: 놓다, 깔다 (spread out), 낳다 (lay an egg)
    lead: 이끌다, 인도하다 (guide), 지휘하다 (command)
    leak: 새다, 유출하다 (leak information), 누설하다 (divulge a secret)
    lean: 기대다, 기울다 (tilt), 의지하다 (rely on)
    leap: 뛰어오르다 [reu], 도약하다, 뛰어넘다
    learn: 배우다, 익히다 (master a skill), 깨닫다 [d] (come to realize)
    leave: 떠나다, 남기다 (leave behind), 버리다 (abandon)
    legislate: 입법하다, 법제화하다 (turn into law)
    lend: 빌려주다, 대여하다 (rent or loan out)
    lengthen: 늘이다, 연장하다 (extend in time), 길어지다 (become longer)
    let: 허락하다, 허용하다, 내버려두다 (leave alone)
    let down: 실망시키다, 저버리다 (betray someone's trust)
    level: 고르다 [reu] (even out the ground), 평준화하다 (equalize), 무너뜨리다 (raze)
    liberate: 해방하다, 구출하다 (rescue)
    lick: 핥다
    lie: 거짓말하다, 눕다 [b] (lie down)
    lift: 들어올리다, 올리다, 해제하다 (lift a ban)
    light: 켜다 (switch on a light), 밝히다 (light up), 점화하다 (ignite)
    lighten: 덜다 (reduce a burden), 가벼워지다 (become lighter), 밝아지다 (become brighter)
    like: 좋아하다
    limit: 제한하다, 한정하다, 제약하다
    linger: 머물다, 꾸물거리다 (dawdle), 남다 (remain)
    link: 연결하다, 잇다 [s], 연계하다 (tie in with)
    liquidate: 청산하다, 현금화하다 (convert to cash), 숙청하다 (purge)
    listen: 듣다 [d], 경청하다 (listen attentively)
    listen to: 듣다 [d], 경청하다, 귀담아듣다 [d] (listen carefully)
    live: 살다, 거주하다 (reside), 지내다 (spend one's days)
    load: 싣다 [d], 장전하다 (load a gun), 불러오다 (load data)
    loathe: 혐오하다, 증오하다, 질색하다 (have an aversion to)
    locate: 찾아내다, 위치하다 (be situated), 배치하다 (place)
    lock: 잠그다, 잠기다 (get locked)
    log: 기록하다, 기재하다 (enter in a record), 벌목하다 (fell trees)
    long: 갈망하다, 열망하다, 그리워하다 (long for something lost)
    look: 보다, 바라보다 (gaze at), 보이다 (appear, look like)
    look after: 돌보다, 보살피다
    look at: 보다, 쳐다보다, 살펴보다 (examine)
    look for: 찾다, 찾아보다 (try to find), 구하다 (seek)
    look up: 찾아보다 (look up a word), 검색하다 (search online), 올려다보다 (look upward)
    loosen: 풀다, 늦추다 (slacken), 느슨해지다 (become loose)
    lose: 잃다, 잃어버리다 (misplace), 지다 (lose a game)
    love: 사랑하다, 아끼다 (cherish), 좋아하다
    lower: 낮추다, 내리다 (bring down), 줄이다 (reduce)
    lull: 달래다 (soothe), 재우다 (put to sleep), 잠재우다 (quiet down)
    lurk: 잠복하다, 도사리다 (lurk, as danger), 매복하다 (lie in ambush)
    magnify: 확대하다, 증폭시키다 (amplify), 과장하다 (exaggerate)
    maim: 훼손하다 (mutilate), 절단하다 (cut off a limb)
    maintain: 유지하다, 관리하다 (look after equipment), 주장하다 (claim)
    make: 만들다, 제작하다 (manufacture), 짓다 [s] (build or cook rice)
    make up: 지어내다 (invent a story), 화해하다 (reconcile), 화장하다 (put on cosmetics)
    malfunction: 오작동하다, 망가지다 (break down)
    manage: 관리하다, 운영하다 (run), 해내다 (manage to do)
    mangle: 망가뜨리다, 짓이기다
    manipulate: 조작하다, 조종하다 (control)
    manufacture: 제조하다, 생산하다
    map: 도식화하다 (chart out), 대응시키다 (map one set to another)
    march: 행진하다, 행군하다 (march long distances), 진군하다 (advance on)
    marinate: 재우다 (soak in seasoning), 절이다 (pickle or brine)
    mark: 표시하다, 채점하다 (grade a test), 기념하다 (commemorate an occasion)
    market: 판매하다 (sell), 홍보하다 (promote), 상품화하다 (commercialize)
    marvel: 감탄하다, 경탄하다
    mash: 으깨다, 찧다 (pound)
    mask: 가리다, 위장하다 (disguise), 감추다 (conceal)
    massage: 마사지하다, 안마하다, 주무르다 [reu] (knead muscles)
    master: 터득하다, 통달하다
    match: 어울리다 (go well with), 일치하다 (correspond), 맞추다 (match up)
    materialize: 구체화하다 (give concrete form), 실현되다 (come true), 나타나다 (appear)
    matter: 문제되다, 중요시되다 (be considered important)
    maximize: 극대화하다, 최대화하다
    mean: 의미하다, 뜻하다 (denote), 의도하다 (intend)
    measure: 재다, 측정하다, 가늠하다 (gauge)
    mediate: 중재하다, 조정하다 (settle or adjust), 중개하다 (act as go-between)
    meet: 만나다, 마주치다 (run into by chance), 충족하다 (satisfy a requirement)
    melt: 녹다, 녹이다 (melt something), 녹아내리다 (melt away)
    memorize: 외우다, 암기하다
    mend: 고치다, 꿰매다 (stitch up), 깁다 [b] (darn or patch)
    mention: 언급하다, 거론하다 (bring up)
    meow: 야옹거리다, 울다 (of a cat)
    merge: 합병하다 (merge companies), 합치다 (combine), 병합하다 (merge data)
    merit: 값하다 (be worth, deserve)
    migrate: 이주하다, 이동하다 (move), 이전하다 (migrate a system)
    mimic: 모방하다, 모사하다 (reproduce closely), 본뜨다 (model on)
    minimize: 최소화하다, 줄이다 (reduce), 축소하다 (shrink)
    mislead: 오도하다, 속이다, 현혹하다 (delude)
    misplace: 잃어버리다, 분실하다
    miss: 그리워하다, 놓치다 (miss a bus or chance), 빗나가다 (miss a target)
    mistake: 착각하다, 혼동하다 (confuse), 오해하다 (misunderstand)
    mix: 섞다, 섞이다 (become mixed), 혼합하다 (blend)
    mobilize: 동원하다, 소집하다 (call up)
    mock: 조롱하다, 놀리다 (make fun of), 비꼬다 (taunt sarcastically)
    modify: 수정하다, 변경하다 (change), 개조하다 (alter structurally)
    moisten: 적시다, 축이다, 촉촉해지다 (become moist)
    mold: 빚다 (shape by hand), 주조하다 (cast in a mold), 형성하다 (shape, e.g. character)
    monitor: 감시하다, 관찰하다 (observe), 지켜보다 (keep an eye on)
    mortgage: 담보하다 (pledge as security), 잡히다 (put up as collateral)
    motivate: 자극하다, 북돋우다 (boost morale)
    mount: 오르다 [reu] (climb), 올라타다 (get on a horse), 장착하다 (fit onto a mount)
    move: 움직이다, 옮기다 (move something), 이사하다 (move house)
    muffle: 약화시키다 (dampen), 억누르다 [reu] (stifle), 감싸다 (wrap up)
    multiply: 곱하다 (in math), 불어나다 (increase greatly), 번식하다 (breed)
    mumble: 웅얼거리다, 중얼거리다
    munch: 씹다, 우물거리다 (chew steadily)
    murder: 살해하다, 살인하다 (commit murder), 암살하다 (assassinate)
    murmur: 중얼거리다, 속삭이다 (whisper), 웅성거리다 (of a crowd)
    muse: 사색하다, 숙고하다
    must: 요구되다 (be required)
    mutter: 중얼거리다, 투덜거리다 (grumble), 구시렁거리다 (mutter complaints)
    nag: 잔소리하다, 들볶다 (pester endlessly), 조르다 [reu] (pester with requests)
    nail: 못질하다, 박다 (drive in)
    name: 명명하다, 짓다 [s] (give a name), 임명하다 (appoint to a post)
    narrow: 좁히다, 좁아지다 (become narrower), 줄이다 (reduce)
    navigate: 항해하다, 찾아가다 (find one's way to), 조종하다 (steer or pilot)
    need: 요하다 (require)
    neglect: 방치하다, 게을리하다 (be lax about), 등한시하다 (disregard)
    negotiate: 협상하다, 교섭하다, 흥정하다 (haggle over a price)
    nest: 깃들다 (roost), 서식하다 (inhabit)
    neutralize: 무력화하다, 중화하다 (chemistry)
    nibble: 갉아먹다, 깨물다 (bite lightly)
    nod: 끄덕이다
    nominate: 지명하다, 추천하다 (propose)
    notice: 알아차리다, 눈치채다
    notify: 알리다, 통지하다, 통보하다
    nourish: 먹이다, 기르다 [reu]
    nudge: 찌르다 [reu] (poke gently), 밀다
    numb: 마비시키다
    obey: 따르다, 복종하다, 순종하다
    object: 반대하다, 항의하다
    oblige: 강요하다 (compel), 강제하다
    obscure: 가리다, 숨기다
    observe: 관찰하다, 지키다 (a rule)
    obsess: 집착하다, 사로잡다
    obstruct: 막다, 방해하다
    obtain: 얻다, 구하다, 획득하다
    occupy: 차지하다, 점령하다 (military)
    occur: 일어나다, 발생하다, 생기다
    offend: 모욕하다, 거슬리다 (be irritating)
    offer: 제공하다, 제안하다
    offset: 상쇄하다, 만회하다
    omit: 생략하다, 빠뜨리다
    ooze: 새다 (leak), 스미다 (seep)
    open: 열다, 열리다 (intransitive)
    operate: 작동하다, 운영하다 (a business), 수술하다 (surgery)
    oppose: 반대하다, 맞서다, 대항하다
    oppress: 억압하다, 탄압하다, 압박하다
    optimize: 최적화하다
    orchestrate: 조율하다, 편곡하다 (music)
    order: 명령하다 (command), 주문하다 (a meal), 정돈하다 (arrange)
    organize: 정리하다, 조직하다 (a group, an event)
    orient: 향하다, 맞추다 (align)
    oust: 쫓아내다, 몰아내다, 축출하다
    outdo: 능가하다, 앞지르다 [reu]
    outline: 개괄하다, 요약하다
    outperform: 앞서다, 능가하다
    overcome: 극복하다, 이기다, 이겨내다
    overdo: 지나치다, 무리하다 (overexert), 과장하다 (exaggerate)
    overflow: 넘치다, 범람하다
    overhear: 엿듣다 [d]
    overlap: 겹치다, 중복되다
    overpower: 압도하다, 제압하다
    override: 무효화하다, 뒤엎다
    overrule: 기각하다, 뒤엎다
    oversee: 감독하다, 관리하다
    overtake: 추월하다, 앞지르다 [reu]
    overthrow: 전복하다, 무너뜨리다, 타도하다
    overturn: 뒤집다, 뒤집히다 (intransitive)
    overwhelm: 압도하다, 짓누르다 [reu]
    overwrite: 덮어쓰다
    owe: 빚지다
    own: 소유하다, 가지다
    pacify: 진정시키다, 달래다
    pack: 싸다, 챙기다, 포장하다
    paddle: 젓다 [s]
    paint: 칠하다, 그리다 (a picture)
    parade: 행진하다, 과시하다 (show off)
    paralyze: 마비시키다
    paraphrase: 의역하다
    park: 주차하다
    parody: 패러디하다, 풍자하다 (satirize)
    partake: 참여하다, 나누다 (share in)
    participate: 참여하다, 참가하다
    pass: 지나가다, 건네주다 (hand over), 통과하다 (an exam, a law)
    paste: 붙이다, 바르다 [reu] (spread on)
    pat: 쓰다듬다 (stroke), 토닥이다 (tap lightly)
    patch: 기우다, 때우다
    patrol: 순찰하다
    pause: 멈추다, 중단하다
    pave: 포장하다 (a road), 깔다
    pawn: 맡기다
    pay: 내다, 지불하다, 치르다
    pay back: 갚다, 상환하다, 돌려주다
    pedal: 밟다, 타다 (ride a bike)
    peek: 엿보다, 훔쳐보다
    peel: 벗기다, 까다 (eggs, nuts), 깎다 (fruit with a knife)
    penalize: 처벌하다, 벌하다
    perceive: 인식하다, 감지하다
    perch: 내려앉다 (alight), 걸터앉다 (sit on an edge)
    perfect: 완성하다, 다듬다 (polish)
    perform: 수행하다, 공연하다 (on stage), 연기하다 (act)
    perish: 죽다, 멸망하다
    permit: 허락하다, 허용하다, 허가하다
    perpetuate: 영속시키다, 지속시키다
    persevere: 인내하다, 견디다 (endure)
    persist: 계속하다, 고집하다 (insist), 지속되다 (last)
    persuade: 설득하다
    pester: 괴롭히다, 조르다 [reu] (nag for something)
    phone: 전화하다, 통화하다
    photograph: 찍다, 촬영하다
    pick: 고르다 [reu], 줍다 [b] (pick up), 따다 (pluck fruit, flowers)
    pick out: 골라내다, 고르다 [reu]
    pick up: 줍다 [b], 집다, 태우다 (a passenger)
    pierce: 뚫다, 꿰뚫다, 찌르다 [reu] (stab)
    pile up: 쌓다, 쌓이다 (intransitive)
    pilot: 조종하다
    pin: 꽂다, 고정하다
    pinch: 꼬집다
    pinpoint: 찾아내다, 특정하다 (identify exactly)
    pitch: 던지다, 치다 (a tent)
    pity: 동정하다, 불쌍해하다
    place: 놓다, 두다, 배치하다
    plague: 괴롭히다
    plan: 계획하다, 기획하다
    plant: 심다
    plaster: 회칠하다, 바르다 [reu]
    play: 놀다 (have fun), 하다 (games, sports), 연주하다 (an instrument)
    plead: 애원하다, 간청하다
    please: 만족시키다, 기뻐하다 (be pleased)
    pledge: 맹세하다, 서약하다, 약속하다
    plot: 꾸미다 (scheme), 모의하다 (conspire), 그리다 (a graph)
    plow: 갈다 (a field), 쟁기질하다
    pluck: 뽑다 (feathers, hair), 따다 (flowers, fruit)
    plug: 꽂다 (plug in), 막다 (block a hole)
    plunder: 약탈하다, 노략질하다
    plunge: 담그다 (immerse), 뛰어들다 (dive in)
    point: 가리키다, 겨누다 (aim at)
    point out: 지적하다, 가리키다
    poison: 독살하다 (kill with poison), 중독시키다
    poke: 찌르다 [reu], 쑤시다 (probe)
    polish: 닦다, 다듬다 (refine)
    pollute: 오염시키다, 더럽히다
    ponder: 숙고하다, 고민하다
    pop: 터뜨리다, 터지다 (intransitive)
    populate: 거주하다 (inhabit), 채우다 (fill with people)
    portray: 묘사하다, 그리다 (depict), 연기하다 (an actor)
    pose: 제기하다 (a question or problem), 취하다 (a pose or position)
    position: 배치하다, 놓다
    possess: 소유하다, 지니다
    post: 게시하다, 올리다 (online), 부치다 (mail)
    postpone: 연기하다, 미루다
    pound: 두드리다, 때리다
    pour: 붓다 [s], 따르다 (a drink), 쏟다 (spill out)
    practice: 연습하다, 실천하다 (put into practice)
    praise: 칭찬하다, 찬양하다
    pray: 기도하다, 빌다
    preach: 설교하다, 전도하다
    precede: 앞서다, 선행하다
    predict: 예측하다, 예상하다, 예언하다 (prophesy)
    prefer: 선호하다
    preheat: 예열하다
    preoccupy: 사로잡다, 몰두하다 (be absorbed)
    prepare: 준비하다, 마련하다
    prescribe: 처방하다 (medicine), 규정하다 (a rule)
    present: 제시하다, 소개하다 (a person), 발표하다 (a talk)
    preserve: 보존하다, 유지하다
    preside: 주재하다, 이끌다
    press: 누르다 [reu], 압박하다
    presume: 추정하다, 가정하다 (suppose)
    pretend: 가장하다, 시늉하다
    prevail: 이기다 (win out), 만연하다 (be widespread)
    prevent: 막다, 예방하다, 방지하다
    prick: 찌르다 [reu]
    print: 인쇄하다, 출력하다 (from a computer)
    probe: 조사하다, 탐사하다, 캐다
    proceed: 나아가다, 진행하다
    process: 처리하다, 가공하다
    proclaim: 선언하다, 선포하다
    produce: 생산하다, 만들다, 제작하다 (a film)
    profess: 공언하다, 고백하다 (a faith)
    program: 프로그래밍하다, 코딩하다
    progress: 발전하다, 나아지다 (improve)
    prohibit: 금지하다
    project: 투영하다 (an image), 예상하다 (estimate)
    prolong: 연장하다, 늘리다
    promise: 약속하다
    promote: 승진시키다 (at work), 촉진하다 (encourage), 홍보하다 (advertise)
    prompt: 촉구하다, 유발하다
    pronounce: 발음하다
    propagate: 퍼뜨리다, 번식하다, 전파하다
    propel: 추진하다, 밀다
    propose: 제안하다, 청혼하다 (marriage)
    prosecute: 기소하다, 고발하다
    prosper: 번영하다, 번창하다
    protect: 보호하다, 지키다
    protest: 항의하다, 시위하다 (demonstrate)
    protrude: 튀어나오다, 돌출하다
    prove: 증명하다, 입증하다
    provide: 제공하다, 공급하다
    provoke: 도발하다, 자극하다, 유발하다 (cause)
    prune: 가지치기하다, 쳐내다 (cut off)
    pry: 캐묻다 [d] (snoop), 비집다 (pry open)
    publish: 출판하다, 발행하다
    pull: 당기다, 끌다
    pulse: 고동치다, 뛰다 (of the heart)
    pump: 펌프질하다, 퍼내다 (draw out)
    punch: 때리다, 뚫다 (a hole)
    punctuate: 강조하다 (emphasize), 찍다 (mark with punctuation)
    puncture: 뚫다, 찌르다 [reu]
    punish: 처벌하다, 벌하다
    purchase: 구입하다, 구매하다
    purge: 숙청하다 (remove people), 정화하다 (cleanse)
    purify: 정화하다, 정제하다 (refine)
    pursue: 쫓다, 추구하다, 추적하다
    push: 밀다, 누르다 [reu] (a button)
    put: 놓다, 두다, 넣다 (inside)
    put off: 미루다, 연기하다
    puzzle: 당황시키다, 혼란시키다
    quake: 떨다, 흔들리다
    qualify: 해당하다 (be eligible), 한정하다 (limit a statement)
    quarrel: 싸우다, 다투다
    quench: 끄다 (a fire), 해소하다 (thirst)
    query: 문의하다, 질문하다, 조회하다 (a database)
    question: 질문하다, 심문하다 (interrogate), 의심하다 (doubt)
    quit: 그만두다, 포기하다, 끊다 (a habit)
    quiver: 떨리다, 떨다
    quote: 인용하다
    race: 달리다, 경주하다, 경쟁하다
    radiate: 방사하다, 발산하다
    raid: 습격하다, 급습하다
    rain: 내리다, 쏟아지다 (pour down)
    raise: 올리다, 키우다 (children)
    rally: 결집하다, 모으다
    ram: 들이받다, 충돌하다
    ramble: 횡설수설하다 (talk aimlessly), 거닐다 (walk idly)
    rank: 매기다 (assign a rank), 분류하다
    rant: 푸념하다 (complain), 호통치다 (bellow at someone)
    rate: 평가하다, 매기다
    rationalize: 합리화하다
    rattle: 덜컹거리다, 달그락거리다
    reach: 도달하다, 닿다, 도착하다
    react: 반응하다
    read: 읽다
    reap: 수확하다, 거두다
    rear: 기르다 [reu], 키우다
    reason: 추론하다, 따지다
    reassure: 안심시키다
    rebuild: 재건하다, 복구하다 (restore)
    rebuke: 꾸짖다, 질책하다, 나무라다
    recall: 기억하다, 떠올리다, 회상하다
    recede: 물러나다, 멀어지다
    receive: 받다, 수령하다, 맞이하다 (welcome)
    recharge: 충전하다, 재충전하다
    reciprocate: 보답하다, 답례하다
    recite: 암송하다, 낭송하다
    reckon: 계산하다, 셈하다, 여기다 (consider)
    reclaim: 되찾다, 회수하다, 개간하다 (land)
    recline: 기대다 (lean), 눕다 [b] (lie down), 젖히다 (tilt back)
    recognize: 알아보다, 인정하다 (acknowledge)
    recoil: 움찔하다 (flinch), 물러서다 (draw back)
    recommend: 추천하다, 권하다
    reconcile: 화해하다 (with someone), 조화시키다 (make compatible)
    reconsider: 재고하다, 재검토하다
    record: 녹음하다 (audio), 기록하다 (write down), 녹화하다 (video)
    recount: 이야기하다, 서술하다
    recover: 회복하다, 되찾다 (regain), 낫다 [s] (get well)
    recreate: 재현하다, 재창조하다
    recruit: 모집하다, 채용하다 (hire)
    rectify: 바로잡다, 시정하다
    recycle: 재활용하다
    redeem: 구원하다, 되찾다, 만회하다 (make up for)
    redirect: 돌리다, 전환하다
    redo: 고치다, 재작업하다 (do over)
    reduce: 줄이다, 낮추다, 감소시키다
    refer: 참조하다, 언급하다 (mention)
    refine: 정제하다 (purify), 다듬다 (polish)
    reflect: 반영하다, 반사하다 (light), 비추다 (mirror)
    reform: 개혁하다, 개선하다
    refrain: 삼가다, 자제하다
    refresh: 갱신하다, 리프레시하다
    refrigerate: 냉장하다
    refund: 환불하다, 환급하다
    refuse: 거절하다, 거부하다
    regain: 되찾다, 회복하다
    regard: 여기다, 간주하다
    regenerate: 재생하다, 되살리다
    register: 등록하다, 신고하다 (declare)
    regret: 후회하다, 안타까워하다
    regulate: 규제하다 (by rules), 조절하다 (adjust)
    rehearse: 리허설하다, 연습하다
    reign: 통치하다, 군림하다
    reinforce: 강화하다, 보강하다
    reiterate: 되풀이하다, 반복하다
    reject: 거부하다, 거절하다
    rekindle: 되살리다, 재점화하다
    relapse: 재발하다, 도지다 (flare up again)
    relate: 관련시키다, 관련되다, 이야기하다 (tell a story)
    relax: 풀다 (loosen), 쉬다 (rest)
    relay: 전달하다, 중계하다 (broadcast)
    release: 풀어주다, 놓다 (let go), 출시하다 (a product)
    relegate: 강등시키다, 좌천시키다
    relent: 누그러지다, 양보하다 (give way)
    relieve: 덜다, 완화하다, 해소하다
    relish: 즐기다, 음미하다
    reload: 재장전하다 (a weapon), 불러오다 (load again)
    rely: 의지하다, 의존하다, 믿다
    remain: 남다, 머물다
    remark: 언급하다, 논평하다, 말하다
    remedy: 해결하다, 치료하다 (cure), 바로잡다 (correct)
    remember: 기억하다, 떠올리다
    remind: 상기시키다, 일깨우다
    remit: 송금하다 (money), 면제하다 (a debt)
    remodel: 개조하다, 리모델링하다
    remove: 제거하다, 없애다, 치우다 (clear away)
    rename: 개명하다
    renew: 갱신하다, 연장하다 (a contract)
    renounce: 포기하다, 단념하다
    renovate: 보수하다, 개조하다
    rent: 빌리다, 임대하다 (let out)
    repair: 수리하다, 고치다
    repay: 갚다, 상환하다
    repeal: 폐지하다, 철폐하다
    repeat: 반복하다, 되풀이하다
    repel: 물리치다, 격퇴하다
    replace: 교체하다, 대체하다, 대신하다
    replenish: 보충하다, 채우다 (fill up)
    reply: 대답하다, 답하다, 답장하다 (a letter or message)
    report: 보고하다, 보도하다 (news), 신고하다 (to the police)
    represent: 대표하다, 나타내다 (stand for)
    repress: 억압하다, 억누르다 [reu]
    reprimand: 꾸짖다, 징계하다 (officially)
    reproach: 나무라다, 책망하다, 비난하다
    reproduce: 복제하다 (copy), 번식하다 (breed), 재현하다 (recreate)
    request: 요청하다, 신청하다 (formally apply)
    require: 요구하다, 요하다 (need)
    reschedule: 조정하다, 미루다, 앞당기다 (move earlier)
    rescind: 철회하다, 취소하다
    rescue: 구조하다, 구하다, 구출하다
    research: 연구하다, 조사하다
    reserve: 예약하다, 보류하다 (hold back)
    reshape: 재구성하다, 재편하다
    reside: 거주하다, 살다
    resign: 사임하다, 사직하다 (leave a job), 그만두다
    resist: 저항하다, 견디다 (withstand), 참다 (hold back from)
    resolve: 해결하다 (a problem), 결심하다 (decide)
    resort: 호소하다, 의지하다
    respect: 존중하다, 존경하다 (admire)
    respond: 대답하다, 반응하다, 응답하다
    rest: 쉬다, 휴식하다
    restart: 재시작하다, 재부팅하다 (a computer)
    restore: 복원하다 (an object), 복구하다 (a service), 회복시키다 (health)
    restrain: 억제하다, 제지하다 (hold back)
    restrict: 제한하다, 한정하다
    result: 비롯되다 (result from), 초래하다 (result in)
    resume: 재개하다, 이어가다 (continue)
    resurrect: 부활시키다, 되살리다
    retain: 유지하다, 보유하다, 간직하다 (keep)
    retreat: 후퇴하다, 물러나다, 퇴각하다
    retrieve: 되찾다, 회수하다, 가져오다 (fetch)
    return: 돌아가다 (go back), 돌아오다 (come back), 돌려주다 (give back)
    reunite: 재회하다 (meet again), 재결합하다 (get back together)
    reveal: 드러내다, 밝히다 (disclose), 폭로하다 (expose)
    reverse: 뒤집다, 후진하다 (a car), 번복하다 (a decision)
    revert: 되돌아가다, 되돌리다 (undo), 복귀하다
    review: 검토하다, 복습하다 (study again)
    revise: 수정하다, 개정하다 (a law or text)
    revive: 되살리다, 되살아나다 (intransitive), 소생하다
    revoke: 취소하다, 철회하다
    revolutionize: 혁신하다
    reward: 보상하다, 포상하다
    rhyme: 압운하다
    ride: 타다
    ring: 울리다, 치다 (a bell)
    rinse: 헹구다, 씻어내다
    rip: 찢다, 뜯다 (tear off)
    ripple: 물결치다, 일렁이다
    rise: 오르다 [reu], 올라가다, 일어나다 (get up)
    risk: 무릅쓰다, 걸다 (stake), 모험하다
    rival: 필적하다, 겨루다
    roam: 돌아다니다, 떠돌다 (wander), 배회하다
    roar: 포효하다, 으르렁거리다
    roast: 굽다 [b], 볶다 (beans, nuts)
    rob: 강탈하다, 훔치다, 털다 (a place)
    roll: 구르다 [reu], 굴리다 (roll something), 말다 (roll up)
    rotate: 회전하다, 돌다, 돌리다 (turn something)
    rouse: 깨우다, 불러일으키다
    route: 보내다, 우회시키다 (divert)
    row: 젓다 [s]
    rub: 문지르다 [reu], 비비다
    ruin: 망치다, 파멸시키다
    rule: 다스리다, 통치하다, 판결하다 (court)
    rumble: 울리다 (resound), 우르릉거리다
    rummage: 뒤지다, 뒤적이다
    run: 달리다, 뛰다
    run away: 도망치다, 달아나다
    rupture: 터지다, 파열하다
    rush: 서두르다 [reu], 재촉하다 (hurry someone)
    rust: 녹슬다
    rustle: 바스락거리다, 부스럭거리다
    sabotage: 방해하다, 파괴하다
    sacrifice: 희생하다, 희생시키다, 바치다 (offer up)
    sadden: 슬퍼하다 (grieve), 낙담시키다 (dishearten)
    safeguard: 지키다, 보호하다
    sail: 항해하다, 출항하다 (set sail)
    salute: 경례하다, 인사하다 (greet)
    salvage: 건지다, 구조하다
    sanction: 승인하다 (approve), 제재하다 (penalize)
    sanitize: 소독하다, 살균하다
    sap: 약화시키다, 고갈시키다
    satisfy: 만족시키다, 충족시키다 (a need)
    saturate: 적시다 (soak), 포화시키다
    save: 저축하다 (money), 구하다 (rescue), 저장하다 (keep, store data)
    savor: 음미하다, 맛보다
    saw: 톱질하다
    say: 말하다
    scale: 오르다 [reu] (climb), 등반하다 (a mountain)
    scan: 스캔하다, 훑어보다 (look over quickly)
    scandalize: 경악시키다, 격분시키다
    scar: 아물다 (heal over), 새기다 (mark)
    scare: 겁주다, 놀래다, 위협하다
    scatter: 흩뿌리다, 흩어지다 (intransitive), 뿌리다 (sow)
    schedule: 예정하다, 잡다 (set a time), 편성하다 (a timetable)
    scheme: 획책하다, 꾀하다
    scold: 야단치다, 혼내다, 꾸짖다
    scoop: 퍼내다, 뜨다 (spoon up)
    scorch: 그을리다, 태우다 (burn)
    score: 득점하다, 채점하다 (a test)
    scorn: 경멸하다, 멸시하다
    scour: 문지르다 [reu], 뒤지다 (search through)
    scout: 정찰하다, 물색하다 (look around for)
    scrape: 긁다, 긁어내다 (scrape off)
    scratch: 긁다, 할퀴다 (with claws)
    scream: 소리치다, 울부짖다
    screw: 조이다 (tighten), 박다 (drive in)
    scribble: 갈겨쓰다, 낙서하다
    scroll: 스크롤하다, 넘기다
    scrub: 닦다, 문지르다 [reu]
    scrutinize: 살피다, 검토하다 (examine closely)
    sculpt: 조각하다, 빚다 (mold)
    seal: 밀봉하다, 봉하다
    search: 찾다, 검색하다 (online), 수색하다 (police)
    season: 양념하다, 조미하다
    secure: 확보하다 (obtain), 고정하다 (fasten), 잠그다 (lock)
    sedate: 진정시키다
    seduce: 유혹하다, 꾀다 (lure)
    see: 보다, 만나다 (meet), 이해하다 (understand)
    seek: 찾다, 구하다, 추구하다 (pursue)
    seem: 보이다, 여겨지다
    segment: 분할하다, 나누다
    segregate: 분리하다, 격리하다
    select: 선택하다, 선별하다 (screen), 선정하다 (appoint)
    sell: 팔다, 판매하다
    send: 보내다, 발송하다
    send back: 돌려보내다, 반송하다 (by mail)
    sentence: 선고하다, 판결하다
    separate: 분리하다, 나누다, 헤어지다 (part ways)
    serve: 섬기다 (a master), 대접하다 (food), 복무하다 (military)
    set: 놓다, 두다, 맞추다 (a clock or alarm)
    set off: 출발하다, 떠나다, 터뜨리다 (a bomb)
    set up: 설정하다 (configure), 설치하다 (install), 세우다 (establish)
    settle: 해결하다 (a dispute), 정착하다 (put down roots), 가라앉다 (sink down)
    sever: 끊다, 자르다 [reu], 절단하다
    sew: 꿰매다, 바느질하다
    shackle: 속박하다, 묶다
    shade: 가리다 (block light), 칠하다 (shade in a drawing)
    shake: 흔들다, 털다 (shake off), 떨다 (tremble)
    shampoo: 샴푸하다, 감다 (wash hair)
    shape: 빚다, 형성하다
    share: 나누다, 공유하다
    shatter: 깨뜨리다, 부수다, 깨지다 (intransitive)
    shave: 면도하다, 깎다
    shear: 깎다 (fleece), 자르다 [reu]
    shed: 흘리다 (tears, blood), 벗다 (skin)
    shelter: 보호하다, 대피하다 (take cover)
    shift: 바꾸다, 옮기다, 이동하다
    shimmer: 반짝이다, 아른거리다
    shine: 빛나다, 비추다 (light up)
    shiver: 떨다, 떨리다
    shock: 경악시키다, 놀래다, 감전시키다 (electric)
    shoo: 쫓아내다, 쫓다
    shoot: 쏘다, 발사하다, 촬영하다 (film or photos)
    shorten: 줄이다, 단축하다
    should: 권장되다 (be recommended; the usual 'should' is -아/어야 하다)
    shout: 외치다, 소리치다, 고함치다
    shove: 밀치다, 떠밀다
    shovel: 삽질하다, 파다 (dig)
    show: 보여주다, 가르치다 (teach), 나타내다 (display a feeling)
    show off: 자랑하다, 과시하다, 뽐내다
    show up: 나타나다, 출석하다 (attend)
    shred: 찢다, 파쇄하다 (documents), 분쇄하다 (grind)
    shrink: 줄어들다, 오그라들다
    shudder: 몸서리치다, 전율하다
    shuffle: 섞다, 뒤섞다
    shun: 피하다, 기피하다, 멀리하다
    shut: 닫다, 잠그다 (lock), 닫히다 (intransitive)
    sidestep: 피하다, 회피하다
    siege: 포위하다, 에워싸다
    sift: 체질하다, 가려내다 (sort out), 거르다 [reu]
    sigh: 한숨짓다 [s], 탄식하다
    sign: 서명하다, 사인하다
    signal: 알리다, 가리키다 (indicate)
    silence: 침묵시키다, 잠재우다 (hush)
    simplify: 단순화하다, 간소화하다
    simulate: 시뮬레이션하다, 모방하다 (imitate)
    sing: 노래하다, 부르다 [reu]
    singe: 그슬리다, 태우다 (burn lightly)
    sink: 가라앉다, 침몰하다, 가라앉히다 (make sink)
    sip: 홀짝거리다, 마시다
    skate: 타다 (on skates), 스케이팅하다
    sketch: 스케치하다, 그리다 (draw)
    skewer: 꿰다, 꿰뚫다 (pierce)
    ski: 타다 (on skis)
    skim: 훑어보다 (a text), 걷어내다 (skim off), 스치다 (graze)
    skip: 건너뛰다, 빼먹다 (a class), 거르다 [reu] (a meal)
    slam: 내리치다, 들이받다 (crash into)
    slander: 비방하다, 중상하다, 모함하다
    slap: 때리다, 치다
    slash: 베다, 삭감하다 (cut prices), 긋다 [s] (draw a cut)
    sleep: 자다, 잠자다
    slice: 썰다, 자르다 [reu]
    slide: 미끄러지다, 밀다 (push along)
    slip: 미끄러지다, 빠져나가다 (slip away)
    slither: 기다, 기어가다
    slow: 늦추다, 느려지다, 감속하다
    smash: 부수다, 깨뜨리다, 뭉개다 (crush)
    smear: 바르다 [reu], 더럽히다 (stain)
    smell: 맡다 (perceive a smell), 풍기다 (give off a smell)
    smile: 웃다
    smoke: 피우다 (a cigarette), 흡연하다, 훈제하다 (cure food)
    smooth: 펴다 (flatten out), 다듬다 (even out), 고르다 [reu] (level)
    smother: 질식시키다, 끄다 (put out a fire), 억압하다 (suppress)
    smuggle: 밀수하다, 밀반입하다
    snap: 부러지다 (break by itself), 부러뜨리다 (break something), 튕기다 (snap fingers)
    snarl: 으르렁거리다, 으르렁대다
    snatch: 낚아채다, 빼앗다, 가로채다
    sneeze: 재채기하다
    sniff: 킁킁거리다, 맡다
    snooze: 졸다, 꾸벅거리다 (nod off)
    snore: 골다
    snow: 내리다 (of snow), 오다 (of snow)
    soak: 적시다, 담그다, 젖다 (get soaked)
    sob: 흐느끼다, 울먹이다
    socialize: 어울리다 (mingle), 사귀다 (make friends), 교제하다
    soften: 부드러워지다 (become soft), 누그러뜨리다 (soften a stance), 완화하다 (ease)
    solicit: 요청하다, 간청하다, 구하다 (seek)
    solidify: 굳히다, 굳어지다, 응고하다
    solve: 해결하다, 풀다
    soothe: 달래다, 진정시키다, 완화하다 (ease pain)
    sort: 분류하다, 정렬하다, 가려내다 (sort out)
    sound: 울리다 (ring out), 들리다 (seem)
    sow: 뿌리다, 파종하다
    sparkle: 반짝이다, 빛나다
    spawn: 낳다, 산란하다 (lay eggs), 일으키다 (give rise to)
    speak: 말하다, 이야기하다
    specify: 명시하다, 지정하다
    speculate: 추측하다, 투기하다 (in markets)
    speed: 가속하다, 질주하다 (go fast), 서두르다 [reu] (hurry)
    spell: 쓰다 (write the letters), 표기하다
    spend: 쓰다 (money), 보내다 (time)
    spill: 쏟다, 엎지르다 [reu], 흘리다
    spin: 돌다, 돌리다, 잣다 [s] (spin thread)
    spit: 뱉다, 내뱉다
    splash: 튀기다 (splash something), 튀다 (spatter), 첨벙거리다 (splash about)
    splinter: 쪼개지다, 조각나다, 쪼개다 (transitive)
    split: 나누다, 쪼개다, 갈라지다
    spoil: 망치다, 상하다 (of food), 망가뜨리다
    sponsor: 후원하다, 협찬하다
    spot: 발견하다, 알아채다, 포착하다
    sprain: 삐다, 접질리다
    spray: 뿌리다, 분사하다
    spread: 퍼지다 (intransitive), 퍼뜨리다 (spread something), 펴다 (unfold)
    sprinkle: 뿌리다, 흩뿌리다
    spur: 부추기다, 북돋우다, 자극하다
    squander: 낭비하다, 탕진하다
    squeal: 꽥꽥거리다, 소리치다
    squeeze: 짜다 (squeeze out), 쥐다 (grip), 누르다 [reu] (press)
    squint: 찡그리다, 찌푸리다
    stab: 찌르다 [reu]
    stabilize: 안정시키다, 안정되다, 안정화하다
    stagger: 비틀거리다, 휘청거리다
    stain: 더럽히다, 얼룩지다, 물들이다 (dye)
    stall: 멈추다, 꺼지다 (engine dies), 지연시키다 (stall for time)
    stamp: 찍다, 날인하다, 밟다 (stamp on)
    start: 시작하다, 시작되다 (begin by itself), 출발하다 (set out)
    startle: 놀래다, 놀라다 (be startled)
    stash: 숨기다, 보관하다
    state: 밝히다, 진술하다, 단언하다 (assert)
    stay: 머물다, 남다 (remain), 묵다 (as a guest)
    steady: 안정시키다, 진정시키다, 붙잡다 (hold steady)
    steal: 훔치다, 도둑질하다
    steer: 조종하다, 이끌다 (guide), 몰다 (drive)
    sterilize: 살균하다, 소독하다, 멸균하다
    stew: 끓이다, 조리다
    stick: 붙이다 (attach), 붙다 (adhere), 꽂다 (insert)
    stifle: 억누르다 [reu], 참다 (hold back)
    stigmatize: 낙인찍다, 비난하다
    stimulate: 자극하다, 촉진하다, 활성화하다
    sting: 쏘다, 따끔거리다 (smart)
    stink: 냄새나다, 풍기다 (give off a bad smell)
    stipulate: 규정하다, 약정하다
    stir: 젓다 [s], 휘젓다 [s], 움직이다 (move slightly)
    stitch: 꿰매다, 바느질하다, 봉합하다 (suture)
    stop: 멈추다, 서다 (come to a halt), 그만두다 (quit)
    store: 저장하다, 보관하다
    storm: 급습하다, 습격하다, 몰아치다 (of weather)
    straighten: 펴다, 바로잡다 (set straight), 정돈하다 (tidy up)
    strain: 거르다 [reu] (filter), 무리하다 (overexert), 혹사하다 (overwork)
    strangle: 교살하다, 조르다 [reu] (squeeze the neck)
    strap: 묶다, 동여매다, 고정하다
    stray: 헤매다, 벗어나다, 빗나가다
    strengthen: 강화하다, 보강하다, 강해지다 (grow stronger)
    stress: 강조하다, 역설하다, 긴장시키다 (put under stress)
    stretch: 늘이다 (make longer), 늘어나다 (become longer), 뻗다 (extend a limb)
    strew: 흩뜨리다, 어지르다 [reu]
    string: 엮다, 꿰다
    strip: 벗기다, 박탈하다 (deprive of), 빼앗다
    stroke: 쓰다듬다, 어루만지다
    stroll: 산책하다, 거닐다
    struggle: 애쓰다, 싸우다, 몸부림치다
    strum: 튕기다, 치다 (play a guitar)
    study: 공부하다, 연구하다
    stuff: 채우다, 메우다 (stop up)
    stumble: 헛디디다, 비틀거리다
    stun: 기절시키다, 경악시키다 (astound)
    subdue: 제압하다, 굴복시키다, 진압하다
    submit: 제출하다, 내다 (hand in), 굴복하다 (yield)
    subscribe: 구독하다, 가입하다
    subsidize: 보조하다, 지원하다
    substitute: 대체하다, 대신하다, 교체하다
    subtract: 빼다, 공제하다
    succeed: 성공하다, 계승하다 (succeed to a position)
    succumb: 굴복하다, 쓰러지다 (collapse)
    suck: 빨다, 빨아들이다
    sue: 고소하다, 제소하다
    suffer: 시달리다, 앓다 (an illness), 겪다
    suffocate: 질식하다, 질식시키다
    suggest: 제안하다, 권하다, 암시하다 (imply)
    suit: 어울리다 (look good on), 맞다 (be right for)
    sum: 합산하다, 더하다
    summarize: 요약하다, 간추리다
    summon: 소환하다, 소집하다, 불러내다
    supersede: 대체하다, 갈음하다
    supervise: 감독하다, 관리하다 (manage)
    supplement: 보충하다, 보완하다
    supply: 공급하다, 제공하다
    support: 지지하다, 지원하다, 떠받치다 (hold up)
    suppose: 가정하다, 추정하다, 생각하다
    suppress: 억제하다, 억압하다, 진압하다
    surf: 서핑하다, 검색하다 (browse the web)
    surge: 급증하다, 치솟다, 밀려들다
    surmise: 짐작하다, 추측하다
    surpass: 능가하다, 앞지르다 [reu], 넘어서다
    surprise: 놀래다, 놀라다 (be surprised), 기습하다
    surrender: 항복하다, 내주다 (hand over), 포기하다
    surround: 둘러싸다, 에워싸다, 포위하다
    survey: 조사하다, 측량하다 (land), 둘러보다
    survive: 살아남다, 생존하다
    suspect: 의심하다, 짐작하다
    suspend: 중단하다, 매달다, 보류하다
    sustain: 유지하다, 지탱하다, 지속하다
    swallow: 삼키다, 들이켜다 (gulp down)
    swap: 교환하다, 바꾸다, 맞바꾸다
    sway: 흔들리다, 흔들다
    swear: 맹세하다, 욕하다 (curse), 선서하다
    sweat: 흘리다 (shed sweat)
    sweep: 쓸다, 휩쓸다
    sweeten: 달콤해지다, 달래다
    swell: 붓다 [s] (swell up), 부풀다 (puff up), 불어나다 (grow bigger)
    swim: 수영하다, 헤엄치다
    swindle: 속이다, 사취하다
    swing: 흔들다, 휘두르다 [reu]
    swipe: 스와이프하다, 긁다 (a card), 훔치다 (steal)
    switch: 바꾸다, 전환하다, 바뀌다
    symbolize: 상징하다, 나타내다
    sympathize: 동정하다, 공감하다
    sync: 동기화하다, 맞추다
    synchronize: 동기화하다, 일치시키다
    synthesize: 합성하다, 종합하다
    tack: 박다 (nail in), 고정하다, 붙이다
    tackle: 다루다, 맞서다, 태클하다 (in sports)
    tag: 태그하다, 표시하다
    tailor: 맞추다, 재단하다, 조정하다
    taint: 오염시키다, 더럽히다
    take: 가져가다, 데려가다 (a person), 잡다 (grab)
    take care of: 돌보다, 보살피다, 처리하다 (deal with)
    take off: 이륙하다 (a plane), 벗다 (clothes)
    take part: 참가하다, 참여하다
    talk: 이야기하다, 대화하다, 말하다
    tally: 집계하다, 세다 (count up), 들어맞다 (agree)
    tame: 길들이다, 조련하다
    tamper: 조작하다, 손대다, 변조하다 (falsify)
    tan: 그을리다, 선탠하다, 무두질하다 (tan leather)
    tangle: 엉키다, 얽히다, 꼬이다
    tap: 두드리다, 도청하다 (a phone)
    tape: 녹음하다 (audio), 녹화하다 (video), 붙이다 (stick with tape)
    taper: 가늘어지다, 뾰족해지다, 줄어들다 (taper off)
    target: 겨냥하다, 노리다
    tarnish: 변색되다, 더럽히다 (sully), 훼손하다 (damage a reputation)
    taste: 맛보다, 음미하다 (savor)
    tattoo: 문신하다, 새기다 (engrave)
    taunt: 조롱하다, 도발하다, 비웃다
    tax: 과세하다, 부과하다 (impose a tax)
    teach: 가르치다, 교육하다, 지도하다
    tear: 찢다, 찢어지다, 뜯다 (rip off)
    tear down: 허물다, 철거하다
    tease: 놀리다, 장난치다, 괴롭히다
    telephone: 전화하다, 통화하다 (talk on the phone)
    tell: 말하다, 이야기하다 (a story), 알리다
    tell off: 야단치다, 꾸짖다, 혼내다
    tempt: 유혹하다, 꾀다
    tend: 돌보다 (look after), 기울다 (be inclined to)
    tenderize: 재우다 (marinate meat), 연화하다 (soften)
    terminate: 종료하다, 해지하다 (a contract), 해고하다 (an employee)
    terrify: 겁주다, 겁먹다 (be terrified)
    test: 시험하다, 테스트하다, 검사하다 (examine)
    testify: 증언하다, 진술하다
    tether: 매다, 묶다
    thank: 감사하다, 고마워하다
    thaw: 해동하다 (defrost), 녹이다 (melt something), 녹다 (melt)
    thicken: 걸쭉해지다, 졸이다 (reduce a sauce), 두꺼워지다 (get thicker)
    thin: 마르다 [reu] (get skinny), 야위다, 희석하다 (dilute)
    think: 생각하다, 여기다 (regard as), 믿다 (believe)
    think about: 생각하다, 고려하다
    thread: 꿰다, 끼우다 (pass through)
    threaten: 위협하다, 협박하다
    thrill: 흥분시키다, 설레다 (be thrilled), 감동시키다
    thrive: 번창하다, 번성하다
    throb: 두근거리다 (of the heart), 욱신거리다 (ache), 고동치다 (pulse)
    throttle: 조르다 [reu] (choke), 조절하다 (regulate flow), 억제하다 (restrain)
    throw: 던지다, 내던지다 (hurl)
    throw away: 버리다, 내버리다
    thrust: 밀치다 (shove), 찌르다 [reu] (stab), 내밀다 (stick out)
    thump: 때리다, 쿵쾅거리다 (pound), 두드리다 (beat on)
    thunder: 우르릉거리다, 호통치다 (roar at someone)
    thwart: 좌절시키다, 저지하다, 방해하다
    tick: 체크하다, 표시하다, 째깍거리다 (a clock)
    tidy: 정리하다, 치우다, 정돈하다
    tie: 묶다, 매다, 비기다 (draw in a game)
    tighten: 조이다, 강화하다 (make rules stricter), 팽팽해지다 (get taut)
    tilt: 기울이다, 기울다
    time: 재다, 측정하다
    tingle: 따끔거리다, 간질거리다 (tickle)
    tint: 물들이다, 염색하다, 착색하다
    tip: 기울이다, 뒤집다 (tip over), 쏟다 (tip out)
    tire: 지치다 (get tired), 질리다 (get fed up)
    title: 명명하다, 칭하다
    toast: 굽다 [b], 건배하다 (drink a toast)
    toggle: 전환하다, 토글하다 (computing)
    tolerate: 참다, 용인하다, 견디다
    tone: 단련하다 (strengthen muscles), 탄탄해지다 (get firm)
    top: 뛰어넘다, 앞서다, 얹다 (put on top)
    topple: 쓰러뜨리다, 쓰러지다 (fall over), 무너뜨리다 (overthrow)
    torment: 괴롭히다, 학대하다
    torture: 고문하다
    toss: 던지다, 버무리다 (toss a salad), 뒤척이다 (toss in bed)
    touch: 만지다, 닿다, 감동시키다 (move emotionally)
    tour: 관광하다, 둘러보다, 순회하다 (go on a circuit)
    tow: 견인하다, 끌다, 예인하다 (a ship)
    trace: 추적하다, 그리다, 베끼다
    track: 추적하다, 쫓다 (chase), 따라가다 (follow)
    trade: 거래하다, 무역하다, 장사하다
    train: 훈련하다 (do training), 훈련시키다 (train someone), 단련하다
    trample: 짓밟다, 밟다
    transcend: 초월하다, 넘어서다
    transcribe: 필사하다, 받아쓰다, 기록하다
    transfer: 옮기다, 이체하다 (money), 전송하다 (data)
    transform: 변형하다, 변화시키다, 탈바꿈하다
    translate: 번역하다, 통역하다 (interpret orally)
    transmit: 전송하다, 전달하다, 송신하다
    transpire: 일어나다 (happen), 밝혀지다 (come to light)
    transplant: 이식하다, 옮기다
    transport: 운반하다, 수송하다, 나르다 [reu]
    trap: 가두다, 잡다 (catch), 옭아매다
    travel: 여행하다, 이동하다
    traverse: 가로지르다 [reu], 횡단하다, 건너다
    tread: 밟다, 디디다 (step on)
    treasure: 아끼다 (hold dear), 간직하다 (keep safe)
    treat: 대하다 (behave toward), 다루다 (handle), 치료하다 (medically)
    tremble: 떨다, 떨리다, 전율하다
    trick: 속이다, 기만하다
    trickle: 흘러내리다, 흐르다 [reu], 새다 (leak)
    trigger: 유발하다, 촉발하다, 작동시키다 (activate)
    trim: 다듬다, 깎다, 줄이다
    trip: 넘어지다, 넘어뜨리다 (make fall)
    triple: 늘리다 (increase threefold), 늘다 (grow threefold)
    trivialize: 경시하다, 평가절하하다
    trot: 뛰어가다, 달리다
    trouble: 괴롭히다, 걱정시키다
    truncate: 잘라내다, 단축하다, 절단하다
    trust: 믿다, 신뢰하다, 맡기다 (entrust)
    try: 시도하다, 애쓰다, 해보다 (try out)
    try on: 입어보다 (clothes), 신어보다 (shoes)
    tuck: 집어넣다 (stuff in), 끼우다 (tuck in)
    tumble: 굴러떨어지다, 구르다 [reu], 폭락하다 (of prices)
    tune: 조율하다, 튜닝하다, 맞추다 (tune in)
    tunnel: 뚫다, 파다
    turn: 돌다, 돌리다, 꺾다 (turn a corner)
    turn around: 돌아서다, 돌아보다 (look back), 돌리다
    turn down: 거절하다, 거부하다, 줄이다 (volume)
    turn into: 변하다, 바뀌다, 변환하다
    turn off: 끄다, 잠그다 (a tap)
    turn on: 켜다, 틀다 (a machine or music)
    turn up: 높이다 (volume), 올리다, 나타나다 (show up)
    tweet: 트윗하다, 지저귀다 (birds)
    twinkle: 반짝거리다, 깜박이다
    twirl: 돌리다, 맴돌다
    type: 타이핑하다, 입력하다, 치다 (on a keyboard)
    umpire: 심판하다, 중재하다
    unbutton: 풀다, 끄르다 [reu]
    uncover: 밝혀내다, 드러내다, 발견하다
    underestimate: 과소평가하다, 얕보다
    undergo: 겪다, 거치다, 경험하다
    underline: 긋다 [s] (draw a line under), 강조하다 (emphasize)
    undermine: 약화시키다, 훼손하다, 갉아먹다
    underpin: 뒷받침하다, 받치다
    understand: 이해하다, 알아듣다 [d] (follow what is said), 깨닫다 [d] (realize)
    understate: 축소하다, 낮추다
    undertake: 떠맡다, 착수하다, 수행하다
    underwrite: 보증하다, 인수하다 (an insurance risk)
    undo: 되돌리다 (reverse), 풀다 (untie), 취소하다 (cancel)
    undress: 벗다, 벗기다 (undress someone), 탈의하다
    unearth: 파내다, 발굴하다, 캐내다
    unfasten: 풀다, 떼다 (detach)
    unfold: 펼치다, 펼쳐지다, 전개되다 (of events)
    unfurl: 펼치다, 펴다
    unhook: 떼어내다, 풀다
    unify: 통일하다, 통합하다
    uninstall: 삭제하다, 제거하다
    unite: 합치다 (join together), 단결하다 (unite as a group), 결합하다 (combine)
    unleash: 풀어주다, 터뜨리다, 불러일으키다 (provoke)
    unload: 내리다 (goods), 하역하다 (cargo)
    unmask: 폭로하다 (expose), 벗기다 (take off the mask)
    unpack: 풀다 (luggage), 꺼내다 (take out)
    unplug: 뽑다, 빼다
    unravel: 풀리다 (come undone), 풀다 (untangle), 밝혀내다 (solve)
    unroll: 펴다, 풀다
    unscrew: 풀다 (loosen), 빼다 (take out)
    unsettle: 동요시키다, 뒤흔들다, 어지럽히다
    untie: 풀다, 끄르다 [reu]
    unveil: 공개하다, 제막하다 (a statue), 발표하다
    unwrap: 풀다, 뜯다 (tear open)
    unzip: 풀다 (decompress), 압축해제하다
    update: 업데이트하다, 갱신하다
    upgrade: 업그레이드하다, 개선하다
    uphold: 지키다 (a law or principle), 옹호하다 (defend), 유지하다 (maintain)
    uplift: 끌어올리다, 고양시키다, 향상시키다
    upload: 업로드하다, 올리다
    uproot: 뽑아내다, 뿌리뽑다
    upset: 뒤엎다 (overturn), 어지럽히다 (disrupt), 괴롭히다 (distress)
    urge: 촉구하다, 재촉하다, 다그치다
    use: 쓰다, 사용하다, 이용하다
    usher: 안내하다, 인도하다, 이끌다
    usurp: 찬탈하다, 강탈하다, 가로채다
    utilize: 활용하다, 이용하다
    utter: 말하다, 발언하다
    vaccinate: 접종하다, 예방접종하다
    vacuum: 청소하다 (with a vacuum), 빨아들이다 (suck up)
    validate: 검증하다, 입증하다, 인정하다 (affirm)
    value: 중시하다, 평가하다, 존중하다
    vandalize: 파손하다, 훼손하다
    vanish: 사라지다, 없어지다
    vaporize: 기화시키다, 증발하다 (evaporate)
    varnish: 칠하다 (with varnish), 바르다 [reu] (coat)
    vary: 달라지다, 변하다, 변화시키다 (alter)
    veer: 틀다 (turn the wheel), 꺾이다 (turn sharply), 벗어나다 (deviate)
    vent: 분출하다 (let out), 쏟아내다 (pour out feelings), 화풀이하다 (vent anger)
    ventilate: 환기하다, 통풍시키다
    venture: 모험하다, 감행하다, 무릅쓰다 (brave a risk)
    verify: 확인하다, 검증하다
    veto: 거부하다, 부결시키다 (reject a bill)
    vex: 거슬리다 (irk), 괴롭히다, 애먹이다
    vibrate: 진동하다, 떨리다
    victimize: 희생시키다, 괴롭히다
    videotape: 녹화하다, 촬영하다
    vie: 경쟁하다, 겨루다, 다투다
    view: 보다, 관찰하다 (observe), 바라보다
    vilify: 헐뜯다, 매도하다, 깎아내리다
    vindicate: 입증하다, 옹호하다
    violate: 위반하다, 어기다, 침해하다
    visit: 방문하다, 찾아가다, 들르다 (drop by)
    visualize: 시각화하다, 상상하다, 떠올리다
    vocalize: 발성하다, 발음하다 (articulate)
    void: 무효화하다, 취소하다
    vomit: 토하다, 구토하다, 게우다
    vote: 투표하다, 표결하다 (vote on a motion)
    vouch: 보증하다, 장담하다
    vow: 맹세하다, 다짐하다, 약속하다
    voyage: 항해하다 (sail), 여행하다
    wade: 건너다 (ford on foot), 철벅거리다 (slosh through water)
    wag: 흔들다, 살랑거리다 (swish gently)
    wail: 울부짖다, 통곡하다, 한탄하다 (lament)
    wait: 기다리다, 대기하다
    wait for: 기다리다
    wait on: 시중들다 (attend on), 응대하다 (serve a customer), 서빙하다 (serve food)
    waive: 포기하다, 면제하다
    wake: 깨우다 (wake someone), 깨다 (wake up)
    wake up: 깨다, 일어나다 (get up), 깨우다 (wake someone)
    walk: 걷다 [d], 걸어가다, 다니다 (go back and forth)
    wall: 둘러싸다 (enclose with a wall), 가로막다 (wall off)
    waltz: 춤추다 (dance a waltz)
    wander: 돌아다니다, 떠돌다, 방황하다
    wane: 줄어들다, 약해지다, 쇠퇴하다
    want: 원하다, 바라다
    ward off: 막다 (prevent), 물리치다 (repel), 피하다 (avoid)
    warm: 데우다, 덥히다, 따뜻해지다 (get warm)
    warm up: 데우다, 데워지다, 준비운동하다 (athletes)
    warn: 경고하다, 주의시키다 (caution), 알리다 (let know)
    warp: 뒤틀리다, 휘어지다, 왜곡하다 (distort)
    warrant: 정당화하다 (justify), 보증하다 (guarantee), 요구하다 (call for)
    wash: 씻다, 빨다 (clothes), 감다 (hair)
    waste: 낭비하다, 허비하다
    watch: 보다 (TV, movies), 지켜보다 (look at closely), 감시하다 (keep watch)
    water: 적시다 (moisten), 관개하다 (irrigate)
    wave: 흔들다 (wave a hand), 인사하다 (greet), 펄럭이다 (of a flag)
    waver: 망설이다, 주저하다, 머뭇거리다
    weaken: 약화시키다, 약해지다, 쇠약해지다
    wean: 떼다 (wean from milk), 끊다 (wean off a habit)
    wear: 입다 (clothes), 쓰다 (hat, glasses), 신다 (shoes)
    weave: 짜다 (on a loom), 엮다 (interlace), 직조하다 (textiles)
    wed: 결혼하다, 혼인하다
    weep: 울다, 흐느끼다
    weigh: 달다 (on scales), 저울질하다 (weigh options), 나가다 (have a weight of)
    weigh down: 짓누르다 [reu], 짓눌리다 (be weighed down)
    welcome: 환영하다, 맞이하다, 반기다
    weld: 용접하다, 접합하다 (join)
    whack: 후려치다, 때리다, 갈기다
    whip: 채찍질하다, 휘젓다 [s] (whisk cream)
    whisper: 속삭이다, 소곤거리다
    whistle: 불다 (blow a whistle)
    whiten: 표백하다 (bleach), 하얘지다 (turn white), 희어지다
    whittle: 깎다, 조각하다 (carve), 줄이다 (whittle down)
    widen: 넓히다, 넓어지다, 확대하다
    wield: 휘두르다 [reu], 행사하다 (power), 다루다 (handle)
    wiggle: 꼼지락거리다 (fingers or toes), 꿈틀거리다 (squirm)
    win: 이기다, 승리하다, 따다 (a medal or prize)
    win over: 설득하다, 사로잡다, 끌어들이다
    wind: 감다 (wrap around), 굽이치다 (meander), 말다 (roll up)
    wink: 윙크하다, 눈짓하다
    wipe: 닦다, 훔치다 (wipe away), 지우다 (erase)
    wish: 바라다, 소망하다, 빌다 (make a wish)
    withdraw: 철회하다 (retract), 인출하다 (money), 철수하다 (troops)
    wither: 시들다, 말라죽다, 쇠퇴하다
    withstand: 견디다, 버티다, 이겨내다
    witness: 목격하다, 지켜보다, 증언하다
    wobble: 흔들거리다, 뒤뚱거리다, 기우뚱거리다
    word: 표현하다 (phrase), 작성하다 (draft)
    work: 일하다, 작동하다 (machines), 근무하다 (be employed)
    work out: 해결하다 (solve), 운동하다 (exercise), 잘되다 (turn out well)
    worry: 걱정하다, 염려하다, 걱정시키다 (make someone worry)
    worsen: 나빠지다 (get worse), 악화되다, 악화시키다 (make worse)
    worship: 숭배하다, 경배하다, 예배하다
    wound: 부상시키다, 해치다, 다치다 (get wounded)
    wrap: 싸다 (wrap up), 포장하다 (gift-wrap), 감싸다 (wrap around)
    wreck: 파괴하다, 망가뜨리다, 난파시키다 (a ship)
    wrench: 비틀다, 뽑다 (pull out forcefully)
    wrestle: 레슬링하다, 씨름하다, 맞붙다 (grapple)
    wring: 쥐어짜다, 비틀다, 짜다
    write: 쓰다, 적다, 집필하다 (a book)
    write down: 적다, 기록하다, 메모하다
    write off: 탕감하다 (a debt), 상각하다 (accounting), 포기하다 (give up on)
    x-ray: 촬영하다 (take an X-ray), 찍다 (take an X-ray picture)
    yank: 잡아당기다, 잡아채다
    yawn: 하품하다
    yearn: 갈망하다, 열망하다, 그리워하다 (long for)
    yell: 소리치다, 외치다, 고함치다
    yelp: 깽깽거리다, 짖다 (bark)
    yield: 양보하다 (give way), 굴복하다 (submit), 산출하다 (produce)
    yoke: 묶다 (harness animals together), 결합하다 (link)
    zap: 없애다, 지우다 (erase), 감전시키다 (shock)
    zip: 압축하다 (compress files), 잠그다 (zip up)
    zone: 구획하다 (divide into zones), 지정하다 (designate an area)
    zoom: 확대하다 (zoom in), 축소하다 (zoom out), 질주하다 (speed past)
  `;

  // "listen: 듣다 [d]" -> { listen: [{ ko, tag, note }, ...] }
  function readEntry(entry, english) {
    const match = entry.match(/^([가-힣]+다)\s*(?:\[(b|d|s|reu)\])?\s*(?:\((.*)\))?$/);
    if (!match) throw new Error(`verbs.js: cannot read "${entry}" in "${english}"`);
    const [, ko, tag, note] = match;
    return { ko, tag: tag || '', ...(note ? { note } : {}) };
  }

  const VERBS = parseTable(TABLE, readEntry);

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
