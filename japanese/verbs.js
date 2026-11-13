/*
 * English -> Japanese verb database.
 *
 * One line per English verb:
 *   english: 話す はなす [g], 食べる たべる [i] (usage note)
 *
 * Each translation is the dictionary form (kanji with okurigana), a space, its
 * reading in hiragana, then a tag in brackets: [g] godan, [i] ichidan, [s] する
 * (including noun+する such as 勉強する), [k] 来る. The first translation of each
 * line is the default.
 */
(function (global) {
  'use strict';

  const { parseTable } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: 捨てる すてる [i] (throw away), 放棄する ほうきする [s] (give up a claim)
    abort: 中止する ちゅうしする [s], 中断する ちゅうだんする [s] (break off)
    absorb: 吸収する きゅうしゅうする [s], 吸い込む すいこむ [g] (soak up)
    abuse: 虐待する ぎゃくたいする [s] (mistreat), 乱用する らんようする [s] (misuse)
    accelerate: 加速する かそくする [s], 速める はやめる [i]
    accept: 受け入れる うけいれる [i], 受け取る うけとる [g] (a gift), 承諾する しょうだくする [s] (an offer)
    accompany: 同行する どうこうする [s], 付き添う つきそう [g]
    accomplish: 成し遂げる なしとげる [i], 達成する たっせいする [s]
    accumulate: 溜める ためる [i], 蓄積する ちくせきする [s]
    accuse: 非難する ひなんする [s] (blame), 告発する こくはつする [s] (formally)
    achieve: 達成する たっせいする [s], 成し遂げる なしとげる [i]
    acknowledge: 認める みとめる [i], 承認する しょうにんする [s]
    acquire: 獲得する かくとくする [s], 取得する しゅとくする [s], 得る える [i]
    acquit: 放免する ほうめんする [s], 釈放する しゃくほうする [s] (release)
    act: 行動する こうどうする [s], 演じる えんじる [i] (perform), 振る舞う ふるまう [g] (behave)
    adapt: 適応する てきおうする [s], 脚色する きゃくしょくする [s] (a story for film or stage)
    add: 加える くわえる [i], 足す たす [g] (in math), 追加する ついかする [s]
    adhere: くっつく くっつく [g] (stick), 付着する ふちゃくする [s], 固執する こしつする [s] (adhere to an idea)
    adjust: 調整する ちょうせいする [s], 調節する ちょうせつする [s], 合わせる あわせる [i]
    administer: 管理する かんりする [s], 運営する うんえいする [s], 投与する とうよする [s] (a drug)
    admire: 尊敬する そんけいする [s], 感心する かんしんする [s]
    admit: 認める みとめる [i], 白状する はくじょうする [s] (confess)
    adopt: 採用する さいようする [s] (a method), 取り入れる とりいれる [i] (a method), 養子縁組する ようしえんぐみする [s] (a child)
    adore: 慕う したう [g], 崇拝する すうはいする [s] (worship)
    advance: 進む すすむ [g], 前進する ぜんしんする [s], 進める すすめる [i] (move something forward)
    advertise: 宣伝する せんでんする [s], 広告する こうこくする [s]
    advise: 助言する じょげんする [s], 忠告する ちゅうこくする [s], 勧める すすめる [i] (recommend)
    advocate: 提唱する ていしょうする [s], 擁護する ようごする [s] (defend a cause)
    affect: 影響する えいきょうする [s], 左右する さゆうする [s] (influence strongly)
    age: 老ける ふける [i], 老いる おいる [i]
    agitate: 揺さぶる ゆさぶる [g], 扇動する せんどうする [s] (stir up people), かき混ぜる かきまぜる [i] (stir)
    agree: 同意する どういする [s], 賛成する さんせいする [s], 合意する ごういする [s] (agree on)
    aim: 狙う ねらう [g], 目指す めざす [g]
    alert: 警告する けいこくする [s], 知らせる しらせる [i]
    align: 揃える そろえる [i], 並べる ならべる [i]
    allocate: 割り当てる わりあてる [i], 配分する はいぶんする [s]
    allow: 許可する きょかする [s], 許す ゆるす [g]
    alter: 変える かえる [i], 変更する へんこうする [s], 改める あらためる [i]
    amaze: 驚かす おどろかす [g], 驚く おどろく [g] (be amazed)
    amend: 修正する しゅうせいする [s], 改正する かいせいする [s] (a law), 訂正する ていせいする [s] (correct)
    amuse: 楽しませる たのしませる [i] (entertain), 面白がる おもしろがる [g] (find funny)
    analyze: 分析する ぶんせきする [s], 解析する かいせきする [s] (data or signals)
    anger: 怒らせる おこらせる [i] (make angry), 怒る おこる [g] (get angry), 激怒する げきどする [s] (become furious)
    announce: 発表する はっぴょうする [s], 告げる つげる [i] (tell or declare), 知らせる しらせる [i] (let know)
    annoy: 悩ます なやます [g] (trouble), 苛立つ いらだつ [g] (be annoyed), 邪魔する じゃまする [s] (bother)
    answer: 答える こたえる [i], 返事する へんじする [s], 応答する おうとうする [s]
    anticipate: 予想する よそうする [s], 予期する よきする [s], 見越す みこす [g] (foresee)
    appeal: 訴える うったえる [i], アピールする あぴーるする [s], 控訴する こうそする [s] (to a higher court)
    appear: 現れる あらわれる [i], 登場する とうじょうする [s] (on stage or in a story), 見える みえる [i] (seem)
    applaud: 拍手する はくしゅする [s], 称賛する しょうさんする [s] (praise)
    apply: 適用する てきようする [s] (a rule or method), 申し込む もうしこむ [g] (apply for), 塗る ぬる [g] (put on a cream)
    appoint: 任命する にんめいする [s], 指名する しめいする [s]
    appreciate: 感謝する かんしゃする [s] (be grateful for), 評価する ひょうかする [s] (value)
    approach: 近づく ちかづく [g], 接近する せっきんする [s], 取り組む とりくむ [g] (tackle a problem)
    approve: 承認する しょうにんする [s], 賛成する さんせいする [s] (agree with), 認可する にんかする [s] (officially)
    argue: 議論する ぎろんする [s], 言い争う いいあらそう [g] (quarrel), 主張する しゅちょうする [s] (claim)
    arise: 起こる おこる [g], 生じる しょうじる [i]
    arrange: 整える ととのえる [i], 手配する てはいする [s] (make plans), 並べる ならべる [i] (put in order)
    arrest: 逮捕する たいほする [s], 捕まえる つかまえる [i]
    arrive: 着く つく [g], 到着する とうちゃくする [s]
    articulate: 言い表す いいあらわす [g], 表現する ひょうげんする [s], 発音する はつおんする [s] (utter clearly)
    ascend: 昇る のぼる [g], 登る のぼる [g] (climb), 上昇する じょうしょうする [s]
    ask: 聞く きく [g] (a question), 尋ねる たずねる [i] (a question), 頼む たのむ [g] (for something)
    ask for: 頼む たのむ [g], 求める もとめる [i], 要求する ようきゅうする [s] (demand)
    aspire: 志す こころざす [g], 憧れる あこがれる [i]
    assemble: 組み立てる くみたてる [i], 集める あつめる [i] (gather people), 集まる あつまる [g] (come together)
    assert: 主張する しゅちょうする [s], 断言する だんげんする [s]
    assess: 評価する ひょうかする [s], 査定する さていする [s], 見積もる みつもる [g] (estimate)
    assign: 割り当てる わりあてる [i], 任せる まかせる [i] (entrust a task), 指定する していする [s]
    assimilate: 同化する どうかする [s], 吸収する きゅうしゅうする [s]
    assist: 手伝う てつだう [g], 助ける たすける [i], 援助する えんじょする [s]
    associate: 結びつける むすびつける [i], 連想する れんそうする [s] (in the mind), 付き合う つきあう [g] (spend time with)
    assume: 仮定する かていする [s] (suppose), 想定する そうていする [s], 引き受ける ひきうける [i] (take on a duty)
    assure: 保証する ほしょうする [s], 請け合う うけあう [g]
    astonish: 驚かす おどろかす [g], 仰天する ぎょうてんする [s] (be astonished)
    attach: 付ける つける [i], 添付する てんぷする [s] (a file to an email), 貼る はる [g] (stick on)
    attack: 攻撃する こうげきする [s], 襲う おそう [g]
    attain: 到達する とうたつする [s], 達成する たっせいする [s], 得る える [i]
    attempt: 試みる こころみる [i], 試す ためす [g]
    attend: 出席する しゅっせきする [s] (an event), 通う かよう [g] (school regularly), 世話する せわする [s] (take care of)
    attract: 引きつける ひきつける [i], 魅了する みりょうする [s] (charm)
    attribute: 帰する きする [s] (put down to a cause), なすりつける なすりつける [i] (pin blame on)
    audit: 監査する かんさする [s], 聴講する ちょうこうする [s] (a class)
    authorize: 許可する きょかする [s], 認可する にんかする [s] (officially), 承認する しょうにんする [s]
    avoid: 避ける さける [i], 回避する かいひする [s], 控える ひかえる [i] (refrain from)
    award: 授与する じゅよする [s], 授ける さずける [i], 与える あたえる [i]
    back up: バックアップする ばっくあっぷする [s], 支持する しじする [s] (support), 裏付ける うらづける [i] (support with proof)
    bake: 焼く やく [g]
    balance: 釣り合う つりあう [g] (be in balance), 均衡する きんこうする [s] (be in equilibrium)
    ban: 禁止する きんしする [s], 禁じる きんじる [i]
    bandage: 手当てする てあてする [s] (treat a wound), 巻く まく [g] (wrap with a bandage)
    bang: 叩く たたく [g] (hit with a bang), ぶつける ぶつける [i] (knock against something)
    baptize: 授洗する じゅせんする [s]
    bargain: 値切る ねぎる [g], 交渉する こうしょうする [s]
    bark: 吠える ほえる [i], 鳴く なく [g]
    base: 基づく もとづく [g] (be based on), 立脚する りっきゃくする [s]
    bathe: 入浴する にゅうよくする [s], 浴びる あびる [i] (shower or sun), 洗う あらう [g] (wash a child)
    battle: 戦う たたかう [g], 争う あらそう [g]
    be: ある ある [g] (exist, for things), いる いる [i] (exist, for people and animals)
    bear: 耐える たえる [i], 我慢する がまんする [s], 産む うむ [g] (a child)
    beat: 打ち負かす うちまかす [g] (defeat), 叩く たたく [g] (hit), 泡立てる あわだてる [i] (whisk eggs)
    beautify: 美化する びかする [s], 飾る かざる [g] (decorate)
    beg: 懇願する こんがんする [s], 物乞いする ものごいする [s] (beg for money)
    begin: 始める はじめる [i] (start something), 始まる はじまる [g] (it starts), 開始する かいしする [s]
    belch: げっぷする げっぷする [s]
    believe: 信じる しんじる [i], 思う おもう [g] (think), 信用する しんようする [s] (trust)
    belong: 所属する しょぞくする [s], 属する ぞくする [s]
    bend: 曲げる まげる [i], 曲がる まがる [g] (it bends), かがむ かがむ [g] (bend down)
    bet: 賭ける かける [i]
    bid: 入札する にゅうさつする [s], 申し出る もうしでる [i] (offer a price)
    bill: 請求する せいきゅうする [s], 課金する かきんする [s]
    bind: 縛る しばる [g], 束ねる たばねる [i], 拘束する こうそくする [s] (legally)
    bite: 噛む かむ [g], 噛みつく かみつく [g] (snap at)
    blackmail: 脅迫する きょうはくする [s], 恐喝する きょうかつする [s] (extort money), 脅す おどす [g]
    blame: 責める せめる [i], 非難する ひなんする [s], 咎める とがめる [i]
    bleach: 漂白する ひょうはくする [s], 脱色する だっしょくする [s] (hair)
    bleed: 出血する しゅっけつする [s]
    blend: 混ぜる まぜる [i], 混合する こんごうする [s], 溶け込む とけこむ [g] (blend in)
    bless: 祝福する しゅくふくする [s]
    blink: 瞬きする まばたきする [s], 瞬く またたく [g]
    block: ブロックする ぶろっくする [s], 塞ぐ ふさぐ [g], 遮る さえぎる [g]
    bloom: 咲く さく [g], 開花する かいかする [s]
    blossom: 咲く さく [g], 花開く はなひらく [g], 開花する かいかする [s]
    blow: 吹く ふく [g], 吹き飛ばす ふきとばす [g] (blow away)
    blur: ぼかす ぼかす [g] (make blurry), ぼやける ぼやける [i] (become blurry), 霞む かすむ [g] (go hazy)
    board: 乗る のる [g], 搭乗する とうじょうする [s], 乗り込む のりこむ [g]
    boast: 自慢する じまんする [s], 誇る ほこる [g], 威張る いばる [g] (swagger)
    boil: 沸く わく [g] (water boils), 沸かす わかす [g] (heat water), 茹でる ゆでる [i] (cook in water)
    bond: 結びつく むすびつく [g] (form a bond), 結合する けつごうする [s], 接着する せっちゃくする [s] (glue)
    book: 予約する よやくする [s]
    boost: 高める たかめる [i], 促進する そくしんする [s], 後押しする あとおしする [s]
    bore: 退屈させる たいくつさせる [i] (make bored), 退屈する たいくつする [s] (be bored), 飽きる あきる [i] (grow tired of), 穿つ うがつ [g] (bore a hole)
    bother: 邪魔する じゃまする [s] (disturb), 悩ます なやます [g] (trouble), 煩わす わずらわす [g] (trouble someone)
    bounce: 弾む はずむ [g], 跳ね返る はねかえる [g] (bounce back), 跳ねる はねる [i] (jump)
    bow: お辞儀する おじぎする [s], 会釈する えしゃくする [s] (nod slightly), 屈する くっする [s] (yield)
    boycott: ボイコットする ぼいこっとする [s]
    brag: 自慢する じまんする [s], 吹聴する ふいちょうする [s] (spread boastfully)
    brake: 減速する げんそくする [s] (slow down), 制動する せいどうする [s] (apply the brakes)
    break: 壊す こわす [g], 割る わる [g] (glass or plates), 折る おる [g] (bones or sticks)
    breathe: 呼吸する こきゅうする [s], 吸う すう [g] (breathe in), 吐く はく [g] (breathe out)
    brew: 醸造する じょうぞうする [s] (beer), 淹れる いれる [i] (tea or coffee)
    bribe: 買収する ばいしゅうする [s], 贈賄する ぞうわいする [s]
    bring: 持ってくる もってくる [k] (bring here), 連れてくる つれてくる [k] (bring a person), 持っていく もっていく [g] (take there)
    bring up: 育てる そだてる [i] (children), 持ち出す もちだす [g] (a topic), 言及する げんきゅうする [s] (mention)
    broadcast: 放送する ほうそうする [s], 放映する ほうえいする [s] (on TV), 配信する はいしんする [s] (online)
    broaden: 広げる ひろげる [i], 拡大する かくだいする [s], 広める ひろめる [i]
    browse: 閲覧する えつらんする [s] (web pages), 拾い読みする ひろいよみする [s] (skim), 見て回る みてまわる [g] (look around a shop)
    bruise: 打撲する だぼくする [s], 傷つける きずつける [i] (hurt)
    brush: 磨く みがく [g] (teeth or shoes), 払う はらう [g] (brush off), 梳かす とかす [g] (hair)
    bubble: 泡立つ あわだつ [g], 沸き立つ わきたつ [g]
    buckle: 留める とめる [i] (fasten), 締める しめる [i] (a belt), 歪む ゆがむ [g] (warp)
    build: 建てる たてる [i] (a house), 作る つくる [g] (make), 築く きずく [g] (a relationship)
    bully: いじめる いじめる [i], 脅す おどす [g] (threaten)
    burden: 負担する ふたんする [s] (bear a cost), 背負う せおう [g] (carry as a burden)
    burn: 燃やす もやす [g] (set fire to), 燃える もえる [i] (be on fire), 焦がす こがす [g] (scorch)
    burst: 破裂する はれつする [s], 爆発する ばくはつする [s] (explode), 弾ける はじける [i] (pop open)
    bury: 埋める うめる [i], 埋葬する まいそうする [s] (a body), 葬る ほうむる [g]
    buy: 買う かう [g], 購入する こうにゅうする [s]
    buzz: 唸る うなる [g] (hum or drone), ざわめく ざわめく [g] (buzz with voices)
    cage: 閉じ込める とじこめる [i] (shut in), 監禁する かんきんする [s] (confine)
    calculate: 計算する けいさんする [s], 算出する さんしゅつする [s] (work out a figure)
    call: 呼ぶ よぶ [g] (summon or name), 電話する でんわする [s] (phone)
    calm: なだめる なだめる [i] (soothe someone), 静める しずめる [i], 落ち着く おちつく [g] (become calm)
    camp: キャンプする きゃんぷする [s], 野営する やえいする [s]
    can: できる できる [i] (be able to)
    cancel: 取り消す とりけす [g], キャンセルする きゃんせるする [s], 中止する ちゅうしする [s] (call off)
    capture: 捕らえる とらえる [i], 捕まえる つかまえる [i], 占領する せんりょうする [s] (a place)
    care: 世話する せわする [s] (take care of), 気遣う きづかう [g] (care about), 心配する しんぱいする [s] (worry)
    caress: 撫でる なでる [i], 愛撫する あいぶする [s]
    carry: 運ぶ はこぶ [g], 持つ もつ [g] (hold or have with you), 担ぐ かつぐ [g] (on the shoulder)
    carry out: 実行する じっこうする [s], 行う おこなう [g], 実施する じっしする [s]
    carve: 彫る ほる [g], 刻む きざむ [g], 切り分ける きりわける [i] (meat)
    cash: 換金する かんきんする [s], 現金化する げんきんかする [s]
    cast: 投げる なげる [i], 配役する はいやくする [s] (actors), 鋳造する ちゅうぞうする [s] (metal)
    catch: 捕まえる つかまえる [i], 受け止める うけとめる [i] (a ball), 引く ひく [g] (a cold)
    categorize: 分類する ぶんるいする [s], 区分する くぶんする [s]
    cause: 引き起こす ひきおこす [g], もたらす もたらす [g]
    cease: 止む やむ [g], 停止する ていしする [s]
    celebrate: 祝う いわう [g], 記念する きねんする [s] (commemorate)
    chain: 繋ぐ つなぐ [g] (with a chain), 縛りつける しばりつける [i]
    challenge: 挑戦する ちょうせんする [s], 挑む いどむ [g]
    change: 変える かえる [i] (make different), 変わる かわる [g] (become different), 替える かえる [i] (replace)
    chant: 唱える となえる [i], 詠唱する えいしょうする [s], 連呼する れんこする [s] (repeat slogans)
    charge: 請求する せいきゅうする [s] (a price), 充電する じゅうでんする [s] (a battery), 起訴する きそする [s] (accuse formally)
    charm: 魅了する みりょうする [s], 魅惑する みわくする [s]
    chase: 追う おう [g], 追いかける おいかける [i], 追跡する ついせきする [s]
    chat: おしゃべりする おしゃべりする [s], 雑談する ざつだんする [s], チャットする ちゃっとする [s] (online)
    chatter: 喋る しゃべる [g] (talk a lot), おしゃべりする おしゃべりする [s], さえずる さえずる [g] (birds)
    cheat: 騙す だます [g], カンニングする かんにんぐする [s] (on a test), 浮気する うわきする [s] (cheat on a partner)
    check: 確認する かくにんする [s], チェックする ちぇっくする [s], 調べる しらべる [i]
    cheer: 応援する おうえんする [s], 励ます はげます [g], 元気づける げんきづける [i] (cheer up)
    cherish: 慈しむ いつくしむ [g] (love dearly), 愛する あいする [s], 重んじる おもんじる [i] (value highly)
    chew: 噛む かむ [g], 咀嚼する そしゃくする [s]
    chill: 冷やす ひやす [g], 冷える ひえる [i] (get cold), くつろぐ くつろぐ [g] (relax)
    choke: 窒息する ちっそくする [s] (suffocate), むせる むせる [i] (choke on food or smoke), 絞める しめる [i] (strangle)
    choose: 選ぶ えらぶ [g], 選択する せんたくする [s]
    chop: 刻む きざむ [g] (mince), 切る きる [g], 割る わる [g] (wood)
    circle: 囲む かこむ [g] (encircle), 回る まわる [g] (move in a circle), 旋回する せんかいする [s] (fly in circles)
    circulate: 循環する じゅんかんする [s], 流通する りゅうつうする [s] (goods), 出回る でまわる [g] (be in circulation)
    cite: 引用する いんようする [s], 挙げる あげる [i] (name as an example)
    claim: 主張する しゅちょうする [s], 請求する せいきゅうする [s] (demand what is owed)
    clap: 拍手する はくしゅする [s], 叩く たたく [g] (clap hands)
    clarify: 明確化する めいかくかする [s], 解明する かいめいする [s] (by investigation), 説明する せつめいする [s] (explain)
    clash: 衝突する しょうとつする [s], ぶつかる ぶつかる [g], 対立する たいりつする [s]
    clasp: 握りしめる にぎりしめる [i], 握る にぎる [g]
    classify: 分類する ぶんるいする [s], 区分する くぶんする [s]
    clean: 掃除する そうじする [s], 洗う あらう [g] (wash), 拭く ふく [g] (wipe)
    clean up: 片付ける かたづける [i], 掃除する そうじする [s], 整理する せいりする [s]
    cleanse: 洗浄する せんじょうする [s], 浄化する じょうかする [s] (purify), 清める きよめる [i] (purify ritually)
    clear: 片付ける かたづける [i] (clear a table), 晴れる はれる [i] (the sky), 取り除く とりのぞく [g] (remove)
    clench: 握りしめる にぎりしめる [i] (a fist), 食いしばる くいしばる [g] (teeth)
    click: クリックする くりっくする [s], 鳴らす ならす [g] (tongue or fingers)
    climb: 登る のぼる [g], よじ登る よじのぼる [g] (scramble up), 上がる あがる [g] (go up)
    clip: 切り抜く きりぬく [g] (cut out), 刈り込む かりこむ [g] (trim), 留める とめる [i] (fasten)
    clog: 詰まる つまる [g] (become clogged), 塞ぐ ふさぐ [g] (block)
    clone: 複製する ふくせいする [s], クローン化する くろーんかする [s]
    close: 閉める しめる [i] (a door or window), 閉じる とじる [i] (eyes or a book), 閉まる しまる [g] (it closes)
    clutch: 掴む つかむ [g], 握りしめる にぎりしめる [i]
    coach: 指導する しどうする [s], 鍛える きたえる [i] (train), コーチする こーちする [s]
    coax: 説得する せっとくする [s], なだめすかす なだめすかす [g]
    code: プログラミングする ぷろぐらみんぐする [s] (write programs), コーディングする こーでぃんぐする [s], 符号化する ふごうかする [s] (encode)
    coincide: 一致する いっちする [s], 重なる かさなる [g] (overlap in time)
    collaborate: 協力する きょうりょくする [s], 協働する きょうどうする [s]
    collapse: 崩れる くずれる [i] (crumble), 倒れる たおれる [i] (fall down), 崩壊する ほうかいする [s] (disintegrate)
    collect: 集める あつめる [i], 収集する しゅうしゅうする [s] (as a hobby), 拾う ひろう [g] (pick up)
    collide: 衝突する しょうとつする [s], ぶつかる ぶつかる [g]
    color: 塗る ぬる [g] (paint or colour in), 着色する ちゃくしょくする [s], 染める そめる [i] (dye)
    comb: 梳かす とかす [g], 探し回る さがしまわる [g] (comb through a place)
    combat: 戦う たたかう [g], 撲滅する ぼくめつする [s] (stamp out a problem), 対抗する たいこうする [s] (counter)
    combine: 組み合わせる くみあわせる [i], 合わせる あわせる [i], 結合する けつごうする [s]
    come: 来る くる [k]
    come back: 戻る もどる [g], 帰る かえる [g] (return home), 帰ってくる かえってくる [k]
    come in: 入る はいる [g], 入ってくる はいってくる [k]
    comfort: 慰める なぐさめる [i], 癒す いやす [g]
    command: 命令する めいれいする [s], 命じる めいじる [i], 指揮する しきする [s] (lead troops)
    commemorate: 記念する きねんする [s], 追悼する ついとうする [s] (a death), 偲ぶ しのぶ [g] (remember fondly)
    comment: コメントする こめんとする [s], 論評する ろんぴょうする [s] (review), 述べる のべる [i] (state)
    commit: 犯す おかす [g] (a crime), 誓う ちかう [g] (commit to a promise), 委ねる ゆだねる [i] (entrust)
    communicate: 伝える つたえる [i], 連絡する れんらくする [s] (get in touch), 通じ合う つうじあう [g] (understand each other)
    compare: 比べる くらべる [i], 比較する ひかくする [s], 見比べる みくらべる [i]
    compensate: 補償する ほしょうする [s], 償う つぐなう [g], 埋め合わせる うめあわせる [i] (make up for)
    compete: 競争する きょうそうする [s], 競う きそう [g], 争う あらそう [g]
    compile: まとめる まとめる [i] (put together), 編纂する へんさんする [s] (a reference book), コンパイルする こんぱいるする [s] (code)
    complete: 完成する かんせいする [s], 完了する かんりょうする [s], 終える おえる [i]
    complicate: 複雑化する ふくざつかする [s], こじれる こじれる [i] (get complicated)
    compliment: 褒める ほめる [i], 称賛する しょうさんする [s]
    comply: 従う したがう [g], 守る まもる [g] (rules), 遵守する じゅんしゅする [s] (formal)
    compose: 作曲する さっきょくする [s] (music), 構成する こうせいする [s], 詠む よむ [g] (a poem)
    comprise: 含む ふくむ [g], 構成する こうせいする [s], 占める しめる [i] (make up a share)
    compute: 計算する けいさんする [s], 演算する えんざんする [s], 算出する さんしゅつする [s]
    conceal: 隠す かくす [g], 隠蔽する いんぺいする [s] (a fact)
    concede: 認める みとめる [i], 譲歩する じょうほする [s] (give ground), 譲る ゆずる [g]
    conceive: 思いつく おもいつく [g] (an idea), 妊娠する にんしんする [s] (a child), 構想する こうそうする [s] (plan)
    conclude: 結論づける けつろんづける [i] (draw a conclusion), 締めくくる しめくくる [g] (finish off), 終わる おわる [g] (end)
    condemn: 非難する ひなんする [s], 糾弾する きゅうだんする [s], 断罪する だんざいする [s]
    conduct: 行う おこなう [g] (carry out), 指揮する しきする [s] (an orchestra), 導く みちびく [g] (lead)
    confess: 告白する こくはくする [s], 白状する はくじょうする [s] (admit), 自白する じはくする [s] (to police)
    configure: 設定する せっていする [s], 構成する こうせいする [s]
    confirm: 確認する かくにんする [s], 確かめる たしかめる [i], 裏付ける うらづける [i] (back up with evidence)
    confront: 立ち向かう たちむかう [g], 直面する ちょくめんする [s] (face a problem), 対決する たいけつする [s] (face an opponent)
    confuse: 混同する こんどうする [s] (mix up two things), 惑わす まどわす [g] (bewilder)
    congratulate: 祝う いわう [g], 祝福する しゅくふくする [s]
    connect: 繋ぐ つなぐ [g], 繋がる つながる [g] (be connected), 接続する せつぞくする [s]
    conquer: 征服する せいふくする [s], 制覇する せいはする [s] (win supremacy), 打ち勝つ うちかつ [g] (overcome)
    consent: 同意する どういする [s], 承諾する しょうだくする [s], 承知する しょうちする [s]
    conserve: 保存する ほぞんする [s] (preserve), 節約する せつやくする [s] (save resources), 保護する ほごする [s] (protect nature)
    consider: 考える かんがえる [i], 検討する けんとうする [s] (examine closely), 考慮する こうりょする [s] (take into account)
    consist: 成り立つ なりたつ [g] (be made up of), 成る なる [g] (consist of)
    console: 慰める なぐさめる [i] (comfort), 励ます はげます [g] (encourage)
    consolidate: 統合する とうごうする [s] (merge), 固める かためる [i] (strengthen), 強化する きょうかする [s]
    conspire: 共謀する きょうぼうする [s] (plot with others), 企む たくらむ [g] (plot)
    constitute: 構成する こうせいする [s] (make up), 当たる あたる [g] (amount to), 設立する せつりつする [s] (establish)
    construct: 建設する けんせつする [s], 組み立てる くみたてる [i] (assemble), 構築する こうちくする [s] (build up a system)
    consult: 相談する そうだんする [s] (ask for advice), 調べる しらべる [i] (look up in a book), 参照する さんしょうする [s] (refer to)
    consume: 消費する しょうひする [s], 消耗する しょうもうする [s] (use up), 食べる たべる [i] (eat)
    contact: 連絡する れんらくする [s], 接触する せっしょくする [s]
    contain: 含む ふくむ [g], 収容する しゅうようする [s] (hold people), 抑える おさえる [i] (hold back)
    contemplate: 熟考する じゅっこうする [s] (think deeply), 眺める ながめる [i] (gaze at), 瞑想する めいそうする [s] (meditate)
    contend: 争う あらそう [g], 競う きそう [g], 主張する しゅちょうする [s] (assert)
    continue: 続ける つづける [i] (go on with), 続く つづく [g] (go on), 継続する けいぞくする [s] (formal)
    contradict: 矛盾する むじゅんする [s] (be inconsistent with), 反論する はんろんする [s] (argue against), 否定する ひていする [s] (deny)
    contrast: 対比する たいひする [s], 対照する たいしょうする [s]
    contribute: 貢献する こうけんする [s], 寄付する きふする [s] (money), 寄稿する きこうする [s] (writing)
    control: コントロールする こんとろーるする [s], 制御する せいぎょする [s] (a machine), 管理する かんりする [s] (manage)
    converge: 収束する しゅうそくする [s], 合流する ごうりゅうする [s] (roads or rivers join), 集結する しゅうけつする [s] (gather at one point)
    convert: 変換する へんかんする [s], 換算する かんざんする [s] (units or currency), 改宗する かいしゅうする [s] (religion)
    convey: 伝える つたえる [i], 表す あらわす [g] (express), 運ぶ はこぶ [g] (carry)
    convince: 説得する せっとくする [s], 納得する なっとくする [s] (be convinced)
    cook: 料理する りょうりする [s], 調理する ちょうりする [s], 炊く たく [g] (rice)
    cool: 冷やす ひやす [g] (make cold), 冷める さめる [i] (get cool), 冷ます さます [g] (let cool down)
    cooperate: 協力する きょうりょくする [s], 協調する きょうちょうする [s]
    coordinate: 調整する ちょうせいする [s], 取りまとめる とりまとめる [i] (organize a group), コーディネートする こーでぃねーとする [s]
    cope: 対処する たいしょする [s] (deal with), 乗り切る のりきる [g] (get through), 切り抜ける きりぬける [i]
    copy: コピーする こぴーする [s], 写す うつす [g] (copy by hand), 真似する まねする [s] (imitate)
    correct: 訂正する ていせいする [s] (fix an error), 直す なおす [g], 修正する しゅうせいする [s] (revise)
    correspond: 対応する たいおうする [s] (match), 一致する いっちする [s] (agree), 文通する ぶんつうする [s] (write letters)
    corrupt: 腐敗する ふはいする [s], 堕落する だらくする [s], 破損する はそんする [s] (data)
    cost: かかる かかる [g] (money or time), 要する ようする [s] (require)
    cough: 咳をする せきをする [s], 咳き込む せきこむ [g] (have a coughing fit), 咳払いする せきばらいする [s] (clear the throat)
    counsel: 助言する じょげんする [s], 忠告する ちゅうこくする [s], 勧める すすめる [i]
    count: 数える かぞえる [i], カウントする かうんとする [s], 頼る たよる [g] (count on)
    counterfeit: 偽造する ぎぞうする [s], 模造する もぞうする [s] (imitate), 偽る いつわる [g] (fake or lie)
    court: 求愛する きゅうあいする [s], 口説く くどく [g], 言い寄る いいよる [g]
    cover: 覆う おおう [g], 被せる かぶせる [i], カバーする かばーする [s]
    crack: ひび割れる ひびわれる [i] (develop cracks), 割る わる [g] (an egg or nut), 割れる われる [i] (split)
    crash: 衝突する しょうとつする [s], 墜落する ついらくする [s] (aircraft), 激突する げきとつする [s]
    crave: 切望する せつぼうする [s], 渇望する かつぼうする [s], 欲しがる ほしがる [g]
    crawl: 這う はう [g], ハイハイする はいはいする [s] (baby)
    create: 作る つくる [g], 創造する そうぞうする [s], 作成する さくせいする [s] (a document or file)
    credit: 入金する にゅうきんする [s] (to an account), 信用する しんようする [s] (believe), 称える たたえる [i] (give credit)
    criticize: 批判する ひはんする [s], 非難する ひなんする [s], 批評する ひひょうする [s] (review)
    cross: 渡る わたる [g], 横切る よこぎる [g], 越える こえる [i]
    crush: 潰す つぶす [g], 砕く くだく [g], 圧倒する あっとうする [s] (overwhelm)
    cry: 泣く なく [g] (weep), 叫ぶ さけぶ [g] (shout)
    cultivate: 耕す たがやす [g] (till soil), 栽培する さいばいする [s] (grow crops), 培う つちかう [g] (develop a quality)
    cure: 治す なおす [g], 治る なおる [g] (get well), 治療する ちりょうする [s] (treat)
    curl: カールする かーるする [s] (hair), 巻く まく [g] (roll), 丸まる まるまる [g] (curl up)
    curse: 呪う のろう [g], 罵る ののしる [g] (swear at)
    cushion: 和らげる やわらげる [i] (soften a blow), 緩和する かんわする [s] (ease)
    customize: カスタマイズする かすたまいずする [s], 特注する とくちゅうする [s] (order to specification)
    cut: 切る きる [g] (with a knife), 刈る かる [g] (grass or hair), 削る けずる [g] (cut down costs)
    cut off: 切り落とす きりおとす [g] (chop off), 切り離す きりはなす [g] (separate), 遮断する しゃだんする [s] (a supply)
    damage: 傷つける きずつける [i], 損なう そこなう [g], 損傷する そんしょうする [s]
    dance: 踊る おどる [g], ダンスする だんすする [s], 舞う まう [g] (dance gracefully)
    dare: 思い切る おもいきる [g] (dare to do), 敢行する かんこうする [s] (do boldly), 挑発する ちょうはつする [s] (provoke or dare someone)
    darken: 曇る くもる [g] (cloud over), 陰る かげる [g] (grow dim), 暗転する あんてんする [s] (stage lights)
    darn: 繕う つくろう [g], 縫う ぬう [g]
    dash: 駆ける かける [i], 突進する とっしんする [s], 急ぐ いそぐ [g]
    dazzle: 眩惑する げんわくする [s], 魅了する みりょうする [s], 眩む くらむ [g] (be dazzled)
    deal: 扱う あつかう [g], 対処する たいしょする [s] (deal with), 配る くばる [g] (cards)
    debate: 討論する とうろんする [s], 議論する ぎろんする [s]
    debug: デバッグする でばっぐする [s]
    decay: 腐る くさる [g] (rot), 朽ちる くちる [i] (rot away), 衰える おとろえる [i] (decline)
    deceive: 騙す だます [g], 欺く あざむく [g]
    decide: 決める きめる [i], 決定する けっていする [s], 決心する けっしんする [s] (make up one's mind)
    decipher: 解読する かいどくする [s], 読み解く よみとく [g]
    declare: 宣言する せんげんする [s], 申告する しんこくする [s] (to customs or tax), 表明する ひょうめいする [s] (state)
    decline: 断る ことわる [g] (refuse), 辞退する じたいする [s] (turn down formally), 低下する ていかする [s] (go down)
    decorate: 飾る かざる [g], 装飾する そうしょくする [s], 飾り付ける かざりつける [i]
    decrease: 減る へる [g] (get less), 減らす へらす [g] (reduce), 減少する げんしょうする [s]
    decrypt: 復号する ふくごうする [s], 解読する かいどくする [s]
    dedicate: 捧げる ささげる [i], 献呈する けんていする [s] (a book), 費やす ついやす [g] (devote time)
    deduct: 差し引く さしひく [g], 控除する こうじょする [s], 引く ひく [g] (subtract)
    deem: 見なす みなす [g], 判断する はんだんする [s]
    defeat: 破る やぶる [g], 倒す たおす [g], 負かす まかす [g]
    defend: 守る まもる [g], 防衛する ぼうえいする [s], 弁護する べんごする [s] (in court)
    defer: 延期する えんきする [s] (postpone), 先送りする さきおくりする [s] (put off), 従う したがう [g] (defer to someone)
    define: 定義する ていぎする [s], 定める さだめる [i] (set)
    deflect: 逸らす そらす [g] (turn aside), 受け流す うけながす [g] (parry), 跳ね返す はねかえす [g] (bounce back)
    degrade: 劣化する れっかする [s] (deteriorate), 貶める おとしめる [i] (humiliate), 格下げする かくさげする [s] (demote)
    delay: 延期する えんきする [s] (postpone), 遅れる おくれる [i] (be late), 遅延する ちえんする [s]
    delegate: 委任する いにんする [s], 任せる まかせる [i]
    delete: 削除する さくじょする [s], 消す けす [g], 消去する しょうきょする [s]
    deliberate: 熟慮する じゅくりょする [s] (think carefully), 審議する しんぎする [s] (discuss officially), 協議する きょうぎする [s] (confer)
    delight: 喜ばせる よろこばせる [i] (make happy), 喜ぶ よろこぶ [g] (be delighted), 魅了する みりょうする [s]
    deliver: 届ける とどける [i], 配達する はいたつする [s] (goods), 出産する しゅっさんする [s] (a baby)
    demand: 要求する ようきゅうする [s], 求める もとめる [i]
    demolish: 取り壊す とりこわす [g], 解体する かいたいする [s], 破壊する はかいする [s]
    demonstrate: 示す しめす [g] (show), 証明する しょうめいする [s] (prove), 実演する じつえんする [s] (show how something works)
    denote: 意味する いみする [s], 示す しめす [g], 表す あらわす [g]
    denounce: 非難する ひなんする [s] (condemn), 告発する こくはつする [s] (report to authorities), 糾弾する きゅうだんする [s] (censure)
    deny: 否定する ひていする [s] (say it is not true), 否認する ひにんする [s] (deny a charge), 拒む こばむ [g] (refuse)
    depend: 頼る たよる [g] (rely on), 依存する いぞんする [s] (be dependent on)
    deploy: 展開する てんかいする [s], 配備する はいびする [s] (troops), デプロイする でぷろいする [s] (software)
    deport: 強制送還する きょうせいそうかんする [s], 追放する ついほうする [s] (expel)
    deposit: 預ける あずける [i] (leave in someone's keeping), 預金する よきんする [s] (in a bank), 入金する にゅうきんする [s] (pay money in)
    deprive: 奪う うばう [g] (take away), 剥奪する はくだつする [s] (strip of rights)
    derive: 由来する ゆらいする [s] (come from), 派生する はせいする [s] (branch off), 導き出す みちびきだす [g] (work out a result)
    descend: 降りる おりる [i] (go down or get off), 下る くだる [g] (go down a slope), 降下する こうかする [s] (descend from the air)
    describe: 描写する びょうしゃする [s] (depict), 説明する せつめいする [s] (explain), 述べる のべる [i] (state)
    deserve: 値する あたいする [s]
    design: デザインする でざいんする [s], 設計する せっけいする [s], 考案する こうあんする [s] (devise)
    designate: 指定する していする [s], 指名する しめいする [s] (a person)
    desire: 望む のぞむ [g] (wish for), 願う ねがう [g] (hope for), 欲する ほっする [s] (want)
    despise: 軽蔑する けいべつする [s], 見下す みくだす [g], 蔑む さげすむ [g]
    destroy: 破壊する はかいする [s], 壊す こわす [g], 滅ぼす ほろぼす [g] (wipe out)
    detect: 検出する けんしゅつする [s] (find by testing), 検知する けんちする [s], 察知する さっちする [s] (notice)
    deteriorate: 悪化する あっかする [s] (get worse), 劣化する れっかする [s] (quality), 衰える おとろえる [i] (decline)
    determine: 決定する けっていする [s] (decide), 突き止める つきとめる [i] (find out), 判定する はんていする [s] (judge)
    detest: 嫌う きらう [g] (dislike strongly), 憎む にくむ [g] (hate), 嫌悪する けんおする [s] (loathe)
    devastate: 荒らす あらす [g] (ravage), 荒廃する こうはいする [s] (fall to ruin), 打ちのめす うちのめす [g] (crush emotionally)
    develop: 開発する かいはつする [s] (a product), 発展する はってんする [s] (grow), 現像する げんぞうする [s] (photos)
    deviate: 逸れる それる [i] (veer off), 逸脱する いつだつする [s] (depart from a norm), 外れる はずれる [i] (come off course)
    devour: 貪る むさぼる [g], 平らげる たいらげる [i] (eat up), 食い尽くす くいつくす [g]
    diagnose: 診断する しんだんする [s]
    dial: ダイヤルする だいやるする [s], 電話する でんわする [s] (a phone number)
    dictate: 口述する こうじゅつする [s] (say aloud for writing down), 命令する めいれいする [s] (order), 左右する さゆうする [s] (determine)
    die: 死ぬ しぬ [g], 亡くなる なくなる [g] (pass away), 枯れる かれる [i] (plants)
    differ: 違う ちがう [g], 異なる ことなる [g]
    dig: 掘る ほる [g] (dig a hole), 掘り起こす ほりおこす [g] (dig up), 採掘する さいくつする [s] (mine)
    digest: 消化する しょうかする [s] (food or information), 要約する ようやくする [s] (summarize)
    dilute: 薄める うすめる [i], 希釈する きしゃくする [s], 割る わる [g] (dilute a drink)
    dim: 薄れる うすれる [i] (fade), 弱める よわめる [i] (lower), 絞る しぼる [g] (dim lights)
    diminish: 減少する げんしょうする [s], 弱まる よわまる [g] (get weaker), 縮小する しゅくしょうする [s] (shrink)
    dine: 食事する しょくじする [s] (have a meal), 会食する かいしょくする [s] (dine with others)
    direct: 向ける むける [i] (point or aim), 監督する かんとくする [s] (a film or play), 指揮する しきする [s] (lead)
    disable: 無効化する むこうかする [s] (turn off a function), 無力化する むりょくかする [s] (make unable to act), 停止する ていしする [s]
    disagree: 反対する はんたいする [s], 食い違う くいちがう [g] (not match)
    disappear: 消える きえる [i] (vanish), 消失する しょうしつする [s] (formal), 失踪する しっそうする [s] (go missing)
    disappoint: 裏切る うらぎる [g] (let down), 失望する しつぼうする [s] (be disappointed), がっかりする がっかりする [s] (be disappointed)
    disarm: 武装解除する ぶそうかいじょする [s], 軍縮する ぐんしゅくする [s] (reduce a country's arms), 解除する かいじょする [s] (deactivate)
    discard: 捨てる すてる [i], 廃棄する はいきする [s] (get rid of), 破棄する はきする [s] (cancel and discard)
    discharge: 放出する ほうしゅつする [s] (release), 排出する はいしゅつする [s] (waste or fluid), 解雇する かいこする [s] (dismiss from a job)
    disclose: 明かす あかす [g] (reveal a secret), 開示する かいじする [s] (formally), 暴露する ばくろする [s] (expose)
    disconnect: 切断する せつだんする [s], 外す はずす [g] (unplug), 切り離す きりはなす [g]
    discourage: 挫く くじく [g] (dampen spirit), 阻む はばむ [g] (hinder), 落胆する らくたんする [s] (be discouraged)
    discover: 発見する はっけんする [s], 見つける みつける [i], 見いだす みいだす [g]
    discredit: 貶める おとしめる [i] (damage a reputation), 中傷する ちゅうしょうする [s] (slander)
    discuss: 話し合う はなしあう [g] (talk over), 議論する ぎろんする [s] (debate), 論じる ろんじる [i] (treat a subject)
    disguise: 変装する へんそうする [s] (change one's appearance), 偽装する ぎそうする [s] (camouflage or fake), 装う よそおう [g] (pretend)
    disgust: うんざりさせる うんざりさせる [i] (make fed up), 嫌悪する けんおする [s] (feel revulsion at), うんざりする うんざりする [s] (be fed up with)
    disinfect: 消毒する しょうどくする [s], 殺菌する さっきんする [s]
    dismantle: 解体する かいたいする [s] (take apart a structure), 分解する ぶんかいする [s] (take apart a device), 撤去する てっきょする [s] (remove)
    dismiss: 解雇する かいこする [s] (fire), 退ける しりぞける [i] (reject an idea), 却下する きゃっかする [s] (a claim or appeal)
    dispatch: 発送する はっそうする [s] (send goods), 派遣する はけんする [s] (send a person), 送る おくる [g] (send)
    dispense: 調剤する ちょうざいする [s] (medicine), 配る くばる [g] (hand out), 分配する ぶんぱいする [s]
    disperse: 散らす ちらす [g] (scatter), 散らばる ちらばる [g] (be scattered), 分散する ぶんさんする [s] (spread out)
    displace: 押しのける おしのける [i] (push aside), 置き換える おきかえる [i] (replace), 追い出す おいだす [g] (drive out)
    display: 展示する てんじする [s] (exhibit), 表示する ひょうじする [s] (on a screen), 見せる みせる [i] (show)
    disprove: 反証する はんしょうする [s] (prove false), 論破する ろんぱする [s] (refute in argument), 覆す くつがえす [g] (overturn)
    dispute: 論争する ろんそうする [s], 争う あらそう [g]
    distinguish: 区別する くべつする [s] (tell apart), 見分ける みわける [i] (recognize by sight), 識別する しきべつする [s] (identify)
    distort: 歪める ゆがめる [i] (twist out of shape), 歪曲する わいきょくする [s] (misrepresent), 歪む ゆがむ [g] (become warped)
    distract: 逸らす そらす [g] (turn attention away), 紛らわす まぎらわす [g] (divert from worry), 邪魔する じゃまする [s] (disturb)
    distribute: 配る くばる [g] (hand out), 配布する はいふする [s] (hand out leaflets), 分配する ぶんぱいする [s] (divide up)
    disturb: 邪魔する じゃまする [s] (interrupt), 妨げる さまたげる [i] (hinder), 乱す みだす [g] (upset order or calm)
    dive: 潜る もぐる [g] (go underwater), 潜水する せんすいする [s] (formal), 飛び込む とびこむ [g] (jump in head first)
    diversify: 多様化する たようかする [s] (become varied), 多角化する たかくかする [s] (a business), 分散する ぶんさんする [s] (spread risk)
    divide: 分ける わける [i] (separate), 割る わる [g] (in math), 分割する ぶんかつする [s] (split into parts)
    divorce: 離婚する りこんする [s]
    do: する する [s], やる やる [g] (casual), 行う おこなう [g] (carry out)
    document: 記録する きろくする [s], 文書化する ぶんしょかする [s] (put in writing)
    dodge: 避ける さける [i], かわす かわす [g] (evade), 逃れる のがれる [i] (escape)
    dominate: 支配する しはいする [s] (rule over), 圧倒する あっとうする [s] (overwhelm), 牛耳る ぎゅうじる [g] (control)
    donate: 寄付する きふする [s] (money), 寄贈する きぞうする [s] (goods or books), 献血する けんけつする [s] (blood)
    double: 倍増する ばいぞうする [s], 倍加する ばいかする [s]
    doubt: 疑う うたがう [g], 怪しむ あやしむ [g]
    download: ダウンロードする だうんろーどする [s]
    draft: 起草する きそうする [s] (a law or document), 下書きする したがきする [s] (make a rough copy), 作成する さくせいする [s]
    drag: 引きずる ひきずる [g] (along the ground), 引っ張る ひっぱる [g] (pull), ドラッグする どらっぐする [s] (with a mouse)
    drain: 排水する はいすいする [s] (drain water), 抜く ぬく [g] (pull out water), 飲み干す のみほす [g] (drink up a glass)
    draw: 描く えがく [g] (a picture), 引く ひく [g] (a line or a curtain)
    dread: 恐れる おそれる [i] (fear), 怖がる こわがる [g] (be afraid of), 危惧する きぐする [s] (fear a bad outcome)
    dream: 夢見る ゆめみる [i] (dream or hope), 夢想する むそうする [s] (daydream), 憧れる あこがれる [i] (long for)
    dress: 着る きる [i] (put on clothes), 着替える きがえる [i] (change clothes), 装う よそおう [g] (dress up)
    dribble: ドリブルする どりぶるする [s], 垂れる たれる [i] (drip), 垂らす たらす [g] (let drip)
    drift: 漂う ただよう [g] (float around), 漂流する ひょうりゅうする [s] (be adrift at sea), 流れる ながれる [i] (flow)
    drill: 掘削する くっさくする [s] (drill into the earth), 穿つ うがつ [g] (bore a hole), 訓練する くんれんする [s] (practise drills)
    drink: 飲む のむ [g], 飲み干す のみほす [g] (drink up)
    drip: 滴る したたる [g] (fall in drops), 垂れる たれる [i] (hang or drip), 垂らす たらす [g] (let drip)
    drive: 運転する うんてんする [s] (a vehicle), 動かす うごかす [g] (power a machine), 追い立てる おいたてる [i] (drive animals)
    drizzle: ぱらつく ぱらつく [g] (rain lightly), 降る ふる [g] (rain)
    drop: 落とす おとす [g] (let fall), 落ちる おちる [i] (fall down), 放す はなす [g] (let go of)
    drown: 溺れる おぼれる [i], 溺死する できしする [s] (die by drowning)
    dry: 乾かす かわかす [g] (make dry), 乾く かわく [g] (become dry), 干す ほす [g] (hang out to dry)
    dump: 捨てる すてる [i], 投棄する とうきする [s] (waste), ぶちまける ぶちまける [i] (tip out)
    duplicate: 複製する ふくせいする [s], コピーする こぴーする [s], 重複する ちょうふくする [s] (overlap or repeat)
    dwell: 住む すむ [g] (live in a place), 居住する きょじゅうする [s] (formal), 暮らす くらす [g] (live a life)
    dye: 染める そめる [i], 染色する せんしょくする [s] (formal)
    earn: 稼ぐ かせぐ [g] (earn money), 儲ける もうける [i] (make a profit), 得る える [i] (gain)
    ease: 和らげる やわらげる [i] (soften pain), 緩和する かんわする [s] (relieve), 緩める ゆるめる [i] (loosen)
    eat: 食べる たべる [i], 食う くう [g] (rough speech)
    echo: 響く ひびく [g] (resound), 反響する はんきょうする [s] (reverberate), こだまする こだまする [s] (echo back)
    edit: 編集する へんしゅうする [s] (video or text), 校正する こうせいする [s] (proofread), 修正する しゅうせいする [s] (revise)
    educate: 教育する きょういくする [s] (provide schooling), 教える おしえる [i] (teach), 育てる そだてる [i] (bring up)
    elaborate: 詳述する しょうじゅつする [s] (explain in detail), 練る ねる [g] (work out a plan), 作り上げる つくりあげる [i] (produce carefully)
    elapse: 経つ たつ [g] (time passes), 過ぎる すぎる [i] (go by), 経過する けいかする [s] (formal)
    elect: 選出する せんしゅつする [s] (choose by vote), 選ぶ えらぶ [g] (choose)
    elevate: 持ち上げる もちあげる [i] (lift up), 高める たかめる [i] (raise a level), 引き上げる ひきあげる [i] (raise)
    eliminate: 排除する はいじょする [s] (get rid of), 取り除く とりのぞく [g] (remove), 除去する じょきょする [s] (remove formally)
    elude: 逃れる のがれる [i] (escape), すり抜ける すりぬける [i] (slip through), 避ける さける [i] (avoid)
    email: メールする めーるする [s], 送信する そうしんする [s] (send a message)
    embark: 乗船する じょうせんする [s] (board a ship), 乗り込む のりこむ [g] (board), 着手する ちゃくしゅする [s] (begin a project)
    embed: 埋め込む うめこむ [g] (set into a surface), 組み込む くみこむ [g] (build into a system), 埋める うめる [i] (bury)
    embrace: 抱きしめる だきしめる [i] (hug tight), 抱き合う だきあう [g] (hug each other), 受け入れる うけいれる [i] (embrace an idea)
    embroider: 刺繍する ししゅうする [s]
    emerge: 現れる あらわれる [i] (appear), 浮かび上がる うかびあがる [g] (come up into view), 判明する はんめいする [s] (come to light)
    emit: 放つ はなつ [g] (give off), 発する はっする [s] (emit), 放出する ほうしゅつする [s] (release)
    emphasize: 強調する きょうちょうする [s], 力説する りきせつする [s]
    employ: 雇う やとう [g] (hire), 使う つかう [g] (use)
    empower: 権限を与える けんげんをあたえる [i], エンパワーする えんぱわーする [s], 力づける ちからづける [i] (encourage)
    empty: 空ける あける [i] (empty a container), 空く あく [g] (become vacant)
    enable: 有効化する ゆうこうかする [s], 許可する きょかする [s] (allow)
    enact: 制定する せいていする [s], 施行する しこうする [s]
    enchant: 魅了する みりょうする [s]
    encircle: 取り囲む とりかこむ [g], 囲む かこむ [g]
    encounter: 出会う であう [g], 遭遇する そうぐうする [s]
    encourage: 励ます はげます [g], 勇気づける ゆうきづける [i]
    encrypt: 暗号化する あんごうかする [s]
    end: 終わる おわる [g] (come to an end), 終える おえる [i] (bring to an end)
    endorse: 支持する しじする [s], 推薦する すいせんする [s]
    endure: 耐える たえる [i], 我慢する がまんする [s]
    energize: 活性化する かっせいかする [s], 元気づける げんきづける [i]
    enforce: 施行する しこうする [s] (a law), 強制する きょうせいする [s] (compel)
    engage: 引き込む ひきこむ [g] (involve), 雇う やとう [g] (hire)
    engrave: 彫る ほる [g], 刻む きざむ [g]
    enhance: 高める たかめる [i], 強化する きょうかする [s]
    enjoy: 楽しむ たのしむ [g], 満喫する まんきつする [s]
    enlarge: 拡大する かくだいする [s], 広げる ひろげる [i]
    enlist: 入隊する にゅうたいする [s], 志願する しがんする [s]
    enrage: 怒らせる おこらせる [i]
    enrich: 潤す うるおす [g]
    enroll: 登録する とうろくする [s], 入学する にゅうがくする [s]
    ensure: 確保する かくほする [s], 保証する ほしょうする [s]
    entail: 伴う ともなう [g], 要する ようする [s]
    entangle: 絡める からめる [i], 絡まる からまる [g] (become entangled), 巻き込む まきこむ [g] (drag into)
    enter: 入る はいる [g], 入力する にゅうりょくする [s] (type in data)
    entertain: もてなす もてなす [g] (guests), 接待する せったいする [s] (clients), 楽しませる たのしませる [i] (amuse)
    entrust: 任せる まかせる [i], 託す たくす [g], 委ねる ゆだねる [i]
    envision: 思い描く おもいえがく [g], 想像する そうぞうする [s]
    envy: 羨む うらやむ [g], 妬む ねたむ [g]
    equip: 装備する そうびする [s], 備える そなえる [i]
    erase: 消す けす [g], 削除する さくじょする [s]
    err: 間違える まちがえる [i], 誤る あやまる [g]
    escalate: エスカレートする えすかれーとする [s], 悪化する あっかする [s]
    escape: 逃げる にげる [i], 逃れる のがれる [i], 脱出する だっしゅつする [s]
    establish: 設立する せつりつする [s], 確立する かくりつする [s], 築く きずく [g]
    estimate: 見積もる みつもる [g], 推定する すいていする [s]
    evacuate: 避難する ひなんする [s], 退去する たいきょする [s]
    evade: 避ける さける [i], 回避する かいひする [s], かわす かわす [g]
    evaluate: 評価する ひょうかする [s], 査定する さていする [s]
    evaporate: 蒸発する じょうはつする [s]
    evoke: 呼び起こす よびおこす [g], 喚起する かんきする [s]
    evolve: 進化する しんかする [s], 発展する はってんする [s]
    exaggerate: 誇張する こちょうする [s]
    exalt: 称える たたえる [i], 賛美する さんびする [s]
    examine: 調べる しらべる [i], 検査する けんさする [s], 診察する しんさつする [s] (a patient)
    excavate: 掘る ほる [g], 発掘する はっくつする [s]
    exceed: 超える こえる [i], 上回る うわまわる [g]
    excel: 優れる すぐれる [i], 秀でる ひいでる [i]
    exchange: 交換する こうかんする [s], 取り替える とりかえる [i], 両替する りょうがえする [s] (money)
    excite: 興奮させる こうふんさせる [i] (make excited), 興奮する こうふんする [s] (become excited), 盛り上げる もりあげる [i] (liven up)
    exclude: 除外する じょがいする [s], 除く のぞく [g]
    excuse: 許す ゆるす [g], 免除する めんじょする [s] (release from a duty)
    execute: 実行する じっこうする [s], 処刑する しょけいする [s] (put to death)
    exempt: 免除する めんじょする [s]
    exercise: 運動する うんどうする [s], 鍛える きたえる [i] (train), 行使する こうしする [s] (a right)
    exert: 発揮する はっきする [s] (ability), 行使する こうしする [s] (power), 及ぼす およぼす [g] (influence)
    exhale: 吐く はく [g] (breathe out), 吐き出す はきだす [g]
    exhaust: 使い果たす つかいはたす [g] (use up), 消耗する しょうもうする [s] (wear out), 疲れ果てる つかれはてる [i] (become exhausted)
    exhibit: 展示する てんじする [s], 示す しめす [g]
    exile: 追放する ついほうする [s], 国外追放する こくがいついほうする [s]
    exist: 存在する そんざいする [s], ある ある [g] (things), いる いる [i] (people, animals)
    expand: 拡大する かくだいする [s], 広げる ひろげる [i], 拡張する かくちょうする [s]
    expect: 期待する きたいする [s] (hope for), 予想する よそうする [s] (anticipate)
    expedite: 促進する そくしんする [s], 早める はやめる [i]
    expel: 追い出す おいだす [g], 追放する ついほうする [s]
    experience: 経験する けいけんする [s], 体験する たいけんする [s]
    experiment: 実験する じっけんする [s], 試す ためす [g]
    expire: 切れる きれる [i] (run out), 失効する しっこうする [s] (a license)
    explain: 説明する せつめいする [s], 解説する かいせつする [s]
    explode: 爆発する ばくはつする [s], 破裂する はれつする [s]
    exploit: 利用する りようする [s], 搾取する さくしゅする [s] (people), 活用する かつようする [s]
    explore: 探検する たんけんする [s], 探索する たんさくする [s], 探る さぐる [g]
    export: 輸出する ゆしゅつする [s], エクスポートする えくすぽーとする [s] (data)
    expose: さらす さらす [g], 暴く あばく [g] (a secret), 暴露する ばくろする [s]
    express: 表す あらわす [g], 表現する ひょうげんする [s], 述べる のべる [i]
    extend: 延長する えんちょうする [s], 伸ばす のばす [g] (stretch out), 広げる ひろげる [i]
    extinguish: 消す けす [g], 消火する しょうかする [s]
    extol: 称賛する しょうさんする [s], 褒め称える ほめたたえる [i]
    extract: 抽出する ちゅうしゅつする [s], 取り出す とりだす [g], 抜き取る ぬきとる [g]
    fabricate: 捏造する ねつぞうする [s], でっち上げる でっちあげる [i], 製造する せいぞうする [s] (manufacture)
    face: 向き合う むきあう [g], 直面する ちょくめんする [s], 面する めんする [s] (look onto)
    facilitate: 促進する そくしんする [s], 円滑化する えんかつかする [s]
    fade: 薄れる うすれる [i], 色あせる いろあせる [i], 消える きえる [i]
    fail: 失敗する しっぱいする [s], 落ちる おちる [i] (a test), 落第する らくだいする [s] (a course)
    fake: 偽造する ぎぞうする [s], 装う よそおう [g] (pretend)
    fall: 落ちる おちる [i], 倒れる たおれる [i] (topple), 降る ふる [g] (rain, snow)
    fall down: 倒れる たおれる [i], 転ぶ ころぶ [g]
    fan: 扇ぐ あおぐ [g], 煽る あおる [g] (flames)
    fascinate: 魅了する みりょうする [s], 引きつける ひきつける [i]
    fasten: 留める とめる [i] (buttons, clips), 締める しめる [i] (a belt), 固定する こていする [s]
    fatigue: 疲れる つかれる [i], 疲労する ひろうする [s]
    favor: 好む このむ [g] (prefer), ひいきする ひいきする [s], 優遇する ゆうぐうする [s]
    fear: 恐れる おそれる [i], 怖がる こわがる [g]
    feed: 養う やしなう [g] (provide for), 授乳する じゅにゅうする [s] (nurse a baby), 供給する きょうきゅうする [s] (supply)
    feel: 感じる かんじる [i], 思う おもう [g]
    fence: フェンシングする ふぇんしんぐする [s], 囲う かこう [g] (enclose)
    ferment: 発酵する はっこうする [s], 醸す かもす [g]
    fetch: 取ってくる とってくる [k] (go and get), 取り寄せる とりよせる [i] (have sent over), フェッチする ふぇっちする [s] (data)
    fight: 戦う たたかう [g], 喧嘩する けんかする [s] (quarrel), 争う あらそう [g]
    figure out: 分かる わかる [g] (understand), 解決する かいけつする [s] (solve a problem), 突き止める つきとめる [i] (determine the cause)
    file: 整理する せいりする [s] (organize papers), 綴じる とじる [i] (put into a binder), 提出する ていしゅつする [s] (a claim, a complaint)
    fill: 満たす みたす [g], 詰める つめる [i], 埋める うめる [i]
    fill in: 記入する きにゅうする [s], 書き込む かきこむ [g], 埋める うめる [i] (a gap)
    film: 撮影する さつえいする [s], 撮る とる [g]
    filter: 濾過する ろかする [s], 絞り込む しぼりこむ [g] (narrow down data)
    finance: 融資する ゆうしする [s], 出資する しゅっしする [s]
    find: 見つける みつける [i], 発見する はっけんする [s]
    find out: 調べる しらべる [i] (look into), 知る しる [g] (learn), 突き止める つきとめる [i] (establish)
    fine: 罰する ばっする [s], 科す かす [g] (impose a penalty)
    finish: 終える おえる [i], 終わる おわる [g], 完了する かんりょうする [s]
    fire: 解雇する かいこする [s] (from a job), 撃つ うつ [g] (a weapon)
    fish: 釣る つる [g]
    fit: 合う あう [g] (suit, match), 収まる おさまる [g] (fit inside), はまる はまる [g] (fit snugly)
    fix: 直す なおす [g], 修理する しゅうりする [s], 固定する こていする [s] (fasten)
    flap: 羽ばたく はばたく [g] (wings), はためく はためく [g] (flag)
    flare: 燃え上がる もえあがる [g], 閃く ひらめく [g]
    flash: 光る ひかる [g], 点滅する てんめつする [s], 閃く ひらめく [g] (flash of an idea)
    flatter: おだてる おだてる [i], 媚びる こびる [i], 似合う にあう [g] (look good on)
    flavor: 味付けする あじつけする [s], 調味する ちょうみする [s]
    flee: 逃げる にげる [i], 逃亡する とうぼうする [s]
    fling: 投げつける なげつける [i], 放る ほうる [g]
    flip: ひっくり返す ひっくりかえす [g] (turn over), 裏返す うらがえす [g], めくる めくる [g] (pages)
    flirt: 口説く くどく [g], いちゃつく いちゃつく [g]
    float: 浮かぶ うかぶ [g], 浮く うく [g], 漂う ただよう [g] (drift)
    flood: 氾濫する はんらんする [s] (a river), 冠水する かんすいする [s] (be inundated), 殺到する さっとうする [s] (pour in)
    flourish: 栄える さかえる [i], 繁栄する はんえいする [s], 茂る しげる [g] (plants)
    flow: 流れる ながれる [i]
    flutter: 羽ばたく はばたく [g] (wings), はためく はためく [g] (flag), 舞う まう [g] (drift down)
    fly: 飛ぶ とぶ [g], 飛行する ひこうする [s], 操縦する そうじゅうする [s] (pilot a plane)
    focus: 集中する しゅうちゅうする [s], 注力する ちゅうりょくする [s], 絞る しぼる [g] (narrow down)
    fold: 折る おる [g] (paper), 畳む たたむ [g] (laundry), 折りたたむ おりたたむ [g]
    follow: 従う したがう [g] (rules, orders), 追う おう [g] (a person), 続く つづく [g] (come after)
    fool: 騙す だます [g], からかう からかう [g] (tease), ふざける ふざける [i] (joke around)
    forbid: 禁じる きんじる [i], 禁止する きんしする [s]
    force: 強制する きょうせいする [s], 強いる しいる [i], こじ開ける こじあける [i] (force open)
    forecast: 予測する よそくする [s], 予報する よほうする [s] (weather)
    foresee: 予想する よそうする [s], 予見する よけんする [s]
    forge: 偽造する ぎぞうする [s] (counterfeit), 鍛える きたえる [i] (metal), 築く きずく [g] (a bond)
    forget: 忘れる わすれる [i]
    forgive: 許す ゆるす [g], 勘弁する かんべんする [s]
    form: 形成する けいせいする [s], 作る つくる [g], 結成する けっせいする [s] (a group)
    format: フォーマットする ふぉーまっとする [s], 初期化する しょきかする [s] (a disk)
    formulate: 策定する さくていする [s] (a plan), 練る ねる [g] (work out), 定式化する ていしきかする [s]
    found: 設立する せつりつする [s], 創設する そうせつする [s]
    fracture: 骨折する こっせつする [s] (a bone), 折る おる [g]
    frame: 額装する がくそうする [s] (a picture), 縁取る ふちどる [g] (give a border), 陥れる おとしいれる [i] (set up an innocent person)
    free: 解放する かいほうする [s], 釈放する しゃくほうする [s] (a prisoner), 逃がす にがす [g] (let go)
    freeze: 凍る こおる [g], 冷凍する れいとうする [s] (food), 凍結する とうけつする [s] (assets)
    frighten: おどかす おどかす [g], 驚かす おどろかす [g]
    frown: しかめる しかめる [i] (one's face), ひそめる ひそめる [i] (one's brows)
    frustrate: 阻む はばむ [g] (thwart), 妨げる さまたげる [i] (hinder), 苛立つ いらだつ [g] (become frustrated)
    fry: 揚げる あげる [i] (deep-fry), 炒める いためる [i] (stir-fry), 焼く やく [g] (pan-fry)
    fuel: 給油する きゅうゆする [s] (refuel), 助長する じょちょうする [s] (a problem), 煽る あおる [g] (stir up emotions)
    fulfill: 果たす はたす [g] (a duty), 叶える かなえる [i] (a wish), 満たす みたす [g] (a requirement)
    function: 機能する きのうする [s], 働く はたらく [g]
    furnish: 備え付ける そなえつける [i] (a room), 提供する ていきょうする [s] (provide)
    fuse: 融合する ゆうごうする [s], 溶接する ようせつする [s] (weld)
    gain: 得る える [i], 獲得する かくとくする [s], 増す ます [g]
    gallop: 駆ける かける [i], 疾走する しっそうする [s]
    gamble: 賭ける かける [i], 賭博する とばくする [s], ギャンブルする ぎゃんぶるする [s]
    gather: 集める あつめる [i] (collect), 集まる あつまる [g] (come together), 拾う ひろう [g] (pick up)
    generate: 生成する せいせいする [s], 生み出す うみだす [g]
    gesture: ジェスチャーする じぇすちゃーする [s], 合図する あいずする [s] (signal)
    get: 得る える [i] (obtain), 入手する にゅうしゅする [s] (obtain), もらう もらう [g] (receive)
    give: あげる あげる [i] (to others), くれる くれる [i] (to me), 与える あたえる [i] (grant, provide)
    give up: 諦める あきらめる [i], やめる やめる [i] (quit a habit), 降参する こうさんする [s] (surrender)
    glorify: 称える たたえる [i], 美化する びかする [s] (idealize)
    glow: 輝く かがやく [g], 光る ひかる [g]
    glue: 接着する せっちゃくする [s], 貼る はる [g] (stick on), くっつける くっつける [i]
    go: 行く いく [g], 向かう むかう [g] (head toward), 通う かよう [g] (go regularly)
    go back: 戻る もどる [g], 帰る かえる [g] (go home), 引き返す ひきかえす [g] (turn back)
    go on: 続く つづく [g] (continue, last), 続ける つづける [i] (carry on)
    go out: 出かける でかける [i], 外出する がいしゅつする [s], 消える きえる [i] (a light, a fire)
    gossip: 噂する うわさする [s], 喋る しゃべる [g] (chatter)
    govern: 統治する とうちする [s], 治める おさめる [i], 支配する しはいする [s] (control)
    grab: 掴む つかむ [g], ひったくる ひったくる [g] (snatch)
    grade: 採点する さいてんする [s] (papers), 格付けする かくづけする [s] (rank by quality)
    graduate: 卒業する そつぎょうする [s], 修了する しゅうりょうする [s] (complete a course)
    graft: 接ぎ木する つぎきする [s] (plants), 移植する いしょくする [s] (skin, tissue)
    grant: 与える あたえる [i] (bestow), 許可する きょかする [s] (permission), 認める みとめる [i] (a request)
    grasp: 掴む つかむ [g], 把握する はあくする [s] (comprehend), 理解する りかいする [s]
    grate: すりおろす すりおろす [g] (food), きしむ きしむ [g] (grate, squeak)
    graze: 放牧する ほうぼくする [s] (put animals out to graze), かすめる かすめる [i] (brush past), 擦りむく すりむく [g] (scrape the skin)
    greet: 挨拶する あいさつする [s], 迎える むかえる [i] (welcome)
    grieve: 悲しむ かなしむ [g], 嘆く なげく [g], 悼む いたむ [g] (mourn)
    grill: 焼く やく [g], 炙る あぶる [g] (over a flame), 問い詰める といつめる [i] (interrogate)
    grind: 挽く ひく [g] (coffee, grain), すりつぶす すりつぶす [g] (crush), 研ぐ とぐ [g] (sharpen)
    grip: 握る にぎる [g], 握り締める にぎりしめる [i]
    groan: 呻く うめく [g] (in pain), ぼやく ぼやく [g] (grumble)
    grow: 成長する せいちょうする [s], 育てる そだてる [i] (crops), 増える ふえる [i] (increase)
    grow up: 育つ そだつ [g], 成長する せいちょうする [s]
    growl: 唸る うなる [g]
    grunt: 唸る うなる [g], 呻く うめく [g]
    guarantee: 保証する ほしょうする [s], 請け合う うけあう [g]
    guard: 守る まもる [g], 警備する けいびする [s], 見張る みはる [g] (keep watch)
    guess: 当てる あてる [i] (guess right), 推測する すいそくする [s] (suppose)
    guide: 案内する あんないする [s], 導く みちびく [g]
    gulp: 飲み込む のみこむ [g], がぶ飲みする がぶのみする [s]
    gush: 噴き出す ふきだす [g], 湧き出る わきでる [i]
    hack: ハッキングする はっきんぐする [s], 切り刻む きりきざむ [g] (chop up)
    hail: 降る ふる [g] (hail or rain falls), 呼び止める よびとめる [i] (a taxi)
    halt: 止まる とまる [g], 止める とめる [i], 停止する ていしする [s]
    hammer: 叩く たたく [g], 打ち込む うちこむ [g] (drive in)
    hamper: 妨げる さまたげる [i], 阻害する そがいする [s]
    hand over: 渡す わたす [g], 引き渡す ひきわたす [g] (transfer)
    handle: 扱う あつかう [g], 処理する しょりする [s], 対処する たいしょする [s] (deal with)
    hang: 掛ける かける [i], 吊るす つるす [g], ぶら下がる ぶらさがる [g] (dangle)
    hang up: 切る きる [g] (end a phone call), 掛ける かける [i] (a coat on a hook)
    happen: 起こる おこる [g], 起きる おきる [i], 生じる しょうじる [i]
    harass: 嫌がらせする いやがらせする [s], 付きまとう つきまとう [g] (pester)
    harden: 固まる かたまる [g] (become hard), 固める かためる [i] (make firm), 硬化する こうかする [s]
    harm: 傷つける きずつける [i], 害する がいする [s], 損なう そこなう [g]
    harmonize: 調和する ちょうわする [s], 協調する きょうちょうする [s]
    harvest: 収穫する しゅうかくする [s], 刈り取る かりとる [g] (reap)
    hate: 嫌う きらう [g], 憎む にくむ [g]
    haul: 運ぶ はこぶ [g], 引きずる ひきずる [g] (drag), 引っ張る ひっぱる [g] (pull)
    have: 持つ もつ [g] (possess), 所有する しょゆうする [s] (own), ある ある [g] (be had, there is)
    heal: 治す なおす [g] (cure), 治る なおる [g] (recover), 癒す いやす [g] (soothe)
    heap: 積み上げる つみあげる [i], 積む つむ [g]
    hear: 聞く きく [g], 聞こえる きこえる [i] (be audible)
    heat: 温める あたためる [i] (food), 暖める あたためる [i] (a room), 加熱する かねつする [s]
    heighten: 高める たかめる [i], 強める つよめる [i]
    help: 手伝う てつだう [g] (assist with a task), 助ける たすける [i] (aid, rescue), 援助する えんじょする [s] (support)
    hesitate: ためらう ためらう [g], 躊躇する ちゅうちょする [s]
    hide: 隠す かくす [g] (conceal), 隠れる かくれる [i] (be out of sight)
    highlight: 強調する きょうちょうする [s], ハイライトする はいらいとする [s] (text on screen)
    hijack: ハイジャックする はいじゃっくする [s], 乗っ取る のっとる [g]
    hinder: 妨げる さまたげる [i], 妨害する ぼうがいする [s]
    hint: ほのめかす ほのめかす [g], 示唆する しさする [s]
    hire: 雇う やとう [g], 採用する さいようする [s], 借りる かりる [i] (rent)
    hit: 打つ うつ [g] (strike), 叩く たたく [g] (slap), 殴る なぐる [g] (punch)
    hoard: 溜め込む ためこむ [g], 蓄える たくわえる [i]
    hold: 持つ もつ [g], 握る にぎる [g] (grip), 開催する かいさいする [s] (an event)
    hold on: 待つ まつ [g] (wait), 持ちこたえる もちこたえる [i] (hold out), しがみつく しがみつく [g] (cling)
    honor: 敬う うやまう [g], 表彰する ひょうしょうする [s] (with an award), 守る まもる [g] (a promise)
    hook: 引っ掛ける ひっかける [i], 引っ掛かる ひっかかる [g] (get caught)
    hop: 跳ねる はねる [i], 跳ぶ とぶ [g]
    hope: 願う ねがう [g], 望む のぞむ [g], 期待する きたいする [s]
    host: 主催する しゅさいする [s] (an event), 泊める とめる [i] (lodge a guest), もてなす もてなす [g] (guests)
    hover: ホバリングする ほばりんぐする [s], 漂う ただよう [g] (linger in the air), うろつく うろつく [g] (loiter nearby)
    howl: 遠吠えする とおぼえする [s] (wolves, dogs), 吠える ほえる [i], 泣き叫ぶ なきさけぶ [g] (wail)
    hug: 抱きしめる だきしめる [i], 抱擁する ほうようする [s]
    hum: 口ずさむ くちずさむ [g], ハミングする はみんぐする [s], 唸る うなる [g] (machinery)
    humiliate: 辱める はずかしめる [i], 侮辱する ぶじょくする [s]
    hunt: 狩る かる [g], 狩猟する しゅりょうする [s], 探し回る さがしまわる [g] (hunt for)
    hurl: 投げる なげる [i], 放り投げる ほうりなげる [i], 叩きつける たたきつける [i] (slam)
    hurt: 痛む いたむ [g] (to ache), 傷つける きずつける [i] (to wound), 怪我する けがする [s] (get injured)
    hypnotize: 魅了する みりょうする [s] (mesmerize)
    identify: 特定する とくていする [s], 見分ける みわける [i], 識別する しきべつする [s]
    idolize: 崇拝する すうはいする [s], 崇める あがめる [i]
    ignore: 無視する むしする [s], 見逃す みのがす [g] (overlook)
    illuminate: 照らす てらす [g], 解明する かいめいする [s] (clarify)
    illustrate: 図解する ずかいする [s] (with diagrams), 例示する れいじする [s] (with examples), 示す しめす [g]
    imagine: 想像する そうぞうする [s], 思い浮かべる おもいうかべる [i] (picture)
    imitate: 真似る まねる [i], 真似する まねする [s], 模倣する もほうする [s]
    immerse: 浸す ひたす [g] (in liquid), 沈める しずめる [i] (submerge), 没頭する ぼっとうする [s] (be absorbed in)
    immobilize: 固定する こていする [s], 拘束する こうそくする [s] (restrain)
    impeach: 弾劾する だんがいする [s]
    impede: 妨げる さまたげる [i], 阻む はばむ [g]
    implement: 実施する じっしする [s], 実装する じっそうする [s] (software)
    implore: 懇願する こんがんする [s], 嘆願する たんがんする [s]
    imply: 意味する いみする [s] (mean), 示唆する しさする [s] (suggest), 暗示する あんじする [s]
    import: 輸入する ゆにゅうする [s], インポートする いんぽーとする [s] (data)
    impose: 課す かす [g] (a tax, a rule), 押し付ける おしつける [i] (force on others), 強いる しいる [i]
    impress: 印象づける いんしょうづける [i], 感心する かんしんする [s] (be impressed), 圧倒する あっとうする [s] (overwhelm)
    imprison: 投獄する とうごくする [s], 収監する しゅうかんする [s], 監禁する かんきんする [s] (confine)
    improve: 改善する かいぜんする [s], 向上する こうじょうする [s], 上達する じょうたつする [s] (skills)
    incite: 扇動する せんどうする [s], そそのかす そそのかす [g], 煽る あおる [g]
    incline: 傾ける かたむける [i], 傾く かたむく [g]
    include: 含む ふくむ [g] (contain), 含める ふくめる [i] (count in)
    incorporate: 組み込む くみこむ [g], 取り入れる とりいれる [i], 法人化する ほうじんかする [s] (a company)
    increase: 増える ふえる [i] (rise), 増やす ふやす [g] (raise), 増加する ぞうかする [s]
    incur: 負う おう [g] (a debt), 招く まねく [g] (bring upon oneself)
    indicate: 示す しめす [g], 指し示す さししめす [g]
    induce: 引き起こす ひきおこす [g] (cause), 促す うながす [g] (persuade), 誘発する ゆうはつする [s]
    infect: 感染する かんせんする [s] (get infected), 移す うつす [g] (pass on a disease)
    infer: 推論する すいろんする [s], 推察する すいさつする [s]
    inflate: 膨らます ふくらます [g] (blow up), 膨らむ ふくらむ [g] (swell), 水増しする みずましする [s] (pad figures)
    inflict: 加える くわえる [i] (damage), 与える あたえる [i] (pain)
    influence: 影響する えいきょうする [s], 左右する さゆうする [s] (sway)
    inform: 知らせる しらせる [i], 通知する つうちする [s]
    infringe: 侵害する しんがいする [s] (a right), 違反する いはんする [s] (a rule)
    ingest: 摂取する せっしゅする [s], 飲み込む のみこむ [g]
    inhabit: 住む すむ [g], 生息する せいそくする [s] (animals), 居住する きょじゅうする [s]
    inhale: 吸い込む すいこむ [g], 吸う すう [g]
    inherit: 相続する そうぞくする [s] (property), 受け継ぐ うけつぐ [g] (traits, traditions)
    inhibit: 抑制する よくせいする [s], 妨げる さまたげる [i]
    initiate: 始める はじめる [i], 開始する かいしする [s], 着手する ちゃくしゅする [s] (set about)
    inject: 注射する ちゅうしゃする [s], 注入する ちゅうにゅうする [s]
    injure: 傷つける きずつける [i], 負傷する ふしょうする [s] (be injured), 怪我する けがする [s]
    inquire: 尋ねる たずねる [i] (ask), 問い合わせる といあわせる [i] (make an inquiry)
    insert: 挿入する そうにゅうする [s], 差し込む さしこむ [g], 入れる いれる [i]
    insinuate: ほのめかす ほのめかす [g], 暗示する あんじする [s]
    insist: 主張する しゅちょうする [s], 言い張る いいはる [g] (stubbornly)
    inspect: 検査する けんさする [s], 点検する てんけんする [s], 視察する しさつする [s] (a site)
    inspire: 鼓舞する こぶする [s], 触発する しょくはつする [s], 励ます はげます [g]
    install: インストールする いんすとーるする [s] (software), 設置する せっちする [s] (equipment), 取り付ける とりつける [i]
    instruct: 教える おしえる [i] (teach), 指示する しじする [s] (direct), 指導する しどうする [s]
    insult: 侮辱する ぶじょくする [s], 罵る ののしる [g]
    insure: 保険をかける ほけんをかける [i], 保証する ほしょうする [s], 確保する かくほする [s] (make sure)
    integrate: 統合する とうごうする [s], 組み込む くみこむ [g] (build in), 溶け込む とけこむ [g] (blend in)
    intend: 意図する いとする [s], 目指す めざす [g] (aim at), 予定する よていする [s] (plan)
    intensify: 強める つよめる [i], 強まる つよまる [g], 激化する げきかする [s] (a conflict)
    interact: 交流する こうりゅうする [s], 触れ合う ふれあう [g], 相互作用する そうごさようする [s] (things)
    interest: 引きつける ひきつける [i], 魅了する みりょうする [s]
    interfere: 干渉する かんしょうする [s] (meddle), 邪魔する じゃまする [s] (get in the way), 口出しする くちだしする [s] (butt in)
    interpret: 解釈する かいしゃくする [s] (meaning), 通訳する つうやくする [s] (spoken language)
    interrogate: 尋問する じんもんする [s], 取り調べる とりしらべる [i]
    interrupt: 遮る さえぎる [g], 中断する ちゅうだんする [s], 割り込む わりこむ [g] (cut in)
    intervene: 介入する かいにゅうする [s], 仲裁する ちゅうさいする [s] (mediate)
    interview: インタビューする いんたびゅーする [s], 面接する めんせつする [s] (a job candidate), 取材する しゅざいする [s] (as a reporter)
    intimidate: 脅す おどす [g], 威圧する いあつする [s]
    intrigue: そそる そそる [g] (arouse curiosity), 企む たくらむ [g] (plot)
    introduce: 紹介する しょうかいする [s] (a person), 導入する どうにゅうする [s] (a system)
    invade: 侵略する しんりゃくする [s] (a country), 侵入する しんにゅうする [s] (enter illegally), 侵害する しんがいする [s] (privacy)
    invent: 発明する はつめいする [s], 考案する こうあんする [s], でっち上げる でっちあげる [i] (make up)
    invest: 投資する とうしする [s], つぎ込む つぎこむ [g] (pour money or effort into)
    invite: 招待する しょうたいする [s], 招く まねく [g], 誘う さそう [g] (ask to join)
    invoice: 請求する せいきゅうする [s], 課金する かきんする [s]
    invoke: 呼び出す よびだす [g] (call up), 発動する はつどうする [s] (put into effect), 召喚する しょうかんする [s] (summon)
    involve: 巻き込む まきこむ [g], 伴う ともなう [g], 関わる かかわる [g] (be connected with)
    iron: アイロンがけする あいろんがけする [s], プレスする ぷれすする [s]
    irritate: 刺激する しげきする [s] (skin, eyes), 苛立つ いらだつ [g] (become irritated), 悩ます なやます [g] (annoy)
    isolate: 隔離する かくりする [s] (quarantine), 分離する ぶんりする [s], 切り離す きりはなす [g]
    issue: 発行する はっこうする [s], 交付する こうふする [s] (official documents), 出す だす [g]
    itch: 痒がる かゆがる [g] (feel itchy), むずむずする むずむずする [s]
    jam: 詰まる つまる [g] (get blocked), 詰め込む つめこむ [g] (cram), 渋滞する じゅうたいする [s] (traffic)
    jeer: 野次る やじる [g], 嘲る あざける [g], ブーイングする ぶーいんぐする [s]
    jingle: 鳴る なる [g], 鳴らす ならす [g]
    jog: ジョギングする じょぎんぐする [s], 走る はしる [g]
    join: 参加する さんかする [s] (take part in), 加わる くわわる [g] (a group), つなぐ つなぐ [g] (connect things)
    joke: ふざける ふざける [i], 茶化す ちゃかす [g]
    jolt: 揺さぶる ゆさぶる [g], 揺れる ゆれる [i]
    journey: 旅する たびする [s], 旅行する りょこうする [s]
    judge: 判断する はんだんする [s], 裁く さばく [g] (in court), 審査する しんさする [s] (a contest)
    jump: 跳ぶ とぶ [g], ジャンプする じゃんぷする [s], 飛び越える とびこえる [i] (jump over)
    justify: 正当化する せいとうかする [s], 弁明する べんめいする [s]
    keep: 保つ たもつ [g] (maintain), 保管する ほかんする [s] (store), 守る まもる [g] (a promise)
    keep on: 続ける つづける [i], 続く つづく [g]
    kick: 蹴る ける [g], 蹴飛ばす けとばす [g]
    kidnap: 誘拐する ゆうかいする [s], 拉致する らちする [s]
    kill: 殺す ころす [g], 殺害する さつがいする [s]
    kindle: 点火する てんかする [s], 燃やす もやす [g], 掻き立てる かきたてる [i] (arouse)
    kiss: キスする きすする [s], 口づけする くちづけする [s]
    knead: 捏ねる こねる [i], 揉む もむ [g]
    knit: 編む あむ [g]
    knock: 叩く たたく [g], ノックする のっくする [s] (at a door)
    knot: 結ぶ むすぶ [g], 結わえる ゆわえる [i]
    know: 知る しる [g] (facts, people, places), 分かる わかる [g] (understand)
    label: ラベル付けする らべるづけする [s], 名付ける なづける [i] (name), 分類する ぶんるいする [s]
    lack: 欠く かく [g] (be without), 欠ける かける [i] (be missing), 不足する ふそくする [s]
    lament: 嘆く なげく [g], 悔やむ くやむ [g] (regret)
    land: 着陸する ちゃくりくする [s] (aircraft), 着地する ちゃくちする [s] (after a jump), 上陸する じょうりくする [s] (come ashore)
    languish: 衰える おとろえる [i], 弱る よわる [g], 低迷する ていめいする [s] (stagnate)
    lash: 鞭打つ むちうつ [g] (whip), 打ちつける うちつける [i] (rain, waves), 縛る しばる [g] (tie down)
    last: 続く つづく [g], 長持ちする ながもちする [s] (stay in good condition)
    laugh: 笑う わらう [g], 大笑いする おおわらいする [s]
    launch: 発売する はつばいする [s] (a product), 打ち上げる うちあげる [i] (a rocket), 立ち上げる たちあげる [i] (a project, a business)
    launder: 洗濯する せんたくする [s], 資金洗浄する しきんせんじょうする [s] (money)
    lay: 置く おく [g] (put down), 敷く しく [g] (spread, lay a floor), 産む うむ [g] (an egg)
    lead: 率いる ひきいる [i] (a group), 導く みちびく [g] (guide), 先導する せんどうする [s]
    leak: 漏れる もれる [i], 漏らす もらす [g] (let out), 漏洩する ろうえいする [s] (information)
    lean: 寄りかかる よりかかる [g] (rest against), 傾く かたむく [g] (tilt), 立てかける たてかける [i] (prop against)
    leap: 跳ぶ とぶ [g], 跳躍する ちょうやくする [s]
    learn: 学ぶ まなぶ [g], 習う ならう [g] (be taught), 覚える おぼえる [i] (memorize, pick up)
    leave: 出発する しゅっぱつする [s] (depart), 去る さる [g] (go away from), 残す のこす [g] (leave behind)
    legislate: 立法する りっぽうする [s], 法制化する ほうせいかする [s]
    lend: 貸す かす [g], 貸し出す かしだす [g]
    lengthen: 延ばす のばす [g], 伸ばす のばす [g] (stretch), 延長する えんちょうする [s]
    let: 許す ゆるす [g] (permit), 許可する きょかする [s], 貸す かす [g] (rent out)
    let down: 裏切る うらぎる [g] (betray trust), 失望する しつぼうする [s] (be disappointed)
    level: 均す ならす [g] (flatten), 整地する せいちする [s] (ground)
    liberate: 解放する かいほうする [s], 解き放つ ときはなつ [g]
    lick: 舐める なめる [i], 舐め取る なめとる [g]
    lie: 偽る いつわる [g] (tell a lie), 横たわる よこたわる [g] (be lying down), 寝転ぶ ねころぶ [g] (lie down)
    lift: 持ち上げる もちあげる [i] (pick up), 上げる あげる [i] (raise), 解除する かいじょする [s] (a ban)
    light: 点ける つける [i] (switch on), 灯す ともす [g] (a candle), 照らす てらす [g] (illuminate)
    lighten: 軽減する けいげんする [s] (a burden), 和らげる やわらげる [i]
    like: 好む このむ [g], 気に入る きにいる [g]
    limit: 制限する せいげんする [s], 限る かぎる [g], 限定する げんていする [s]
    linger: 長引く ながびく [g] (persist), ぐずぐずする ぐずぐずする [s] (dawdle), 居残る いのこる [g] (stay behind)
    link: 結びつける むすびつける [i] (associate), つなぐ つなぐ [g] (connect), リンクする りんくする [s] (web, data)
    liquidate: 清算する せいさんする [s] (a business), 換金する かんきんする [s] (assets), 粛清する しゅくせいする [s] (eliminate people)
    listen: 聴く きく [g] (attentively), 聞く きく [g], 傾聴する けいちょうする [s]
    listen to: 聴く きく [g] (music, radio), 聞く きく [g] (a person), 傾聴する けいちょうする [s]
    live: 住む すむ [g] (reside), 生きる いきる [i] (be alive), 暮らす くらす [g] (make a living)
    load: 積み込む つみこむ [g] (cargo), 読み込む よみこむ [g] (data), 装填する そうてんする [s] (a gun)
    loathe: 嫌悪する けんおする [s], 忌み嫌う いみきらう [g]
    locate: 見つけ出す みつけだす [g] (find), 位置する いちする [s] (be situated)
    lock: 施錠する せじょうする [s], ロックする ろっくする [s]
    log: 記録する きろくする [s], 伐採する ばっさいする [s] (trees)
    long: 切望する せつぼうする [s], 憧れる あこがれる [i]
    look: 見る みる [i], 眺める ながめる [i], 見える みえる [i] (appear)
    look after: 世話する せわする [s], 預かる あずかる [g] (take charge of), 見守る みまもる [g] (watch over)
    look at: 見る みる [i], 眺める ながめる [i], 見つめる みつめる [i] (stare at)
    look for: 探す さがす [g], 捜す さがす [g] (a missing person), 探し求める さがしもとめる [i]
    look up: 調べる しらべる [i] (a word), 見上げる みあげる [i] (raise one's eyes), 引く ひく [g] (in a dictionary)
    loosen: 緩める ゆるめる [i], 緩む ゆるむ [g] (become loose), ほどく ほどく [g] (untie)
    lose: なくす なくす [g] (misplace), 負ける まける [i] (a game), 失う うしなう [g]
    love: 愛する あいする [s], 恋する こいする [s] (be in love)
    lower: 下げる さげる [i], 下ろす おろす [g] (take down), 下がる さがる [g] (go down)
    lull: あやす あやす [g] (soothe a baby), 寝かしつける ねかしつける [i], 静める しずめる [i] (calm)
    lurk: 潜む ひそむ [g], 待ち伏せする まちぶせする [s]
    magnify: 拡大する かくだいする [s], 増幅する ぞうふくする [s] (amplify)
    maim: 傷つける きずつける [i] (injure seriously), 殺傷する さっしょうする [s] (kill or injure)
    maintain: 維持する いじする [s], 保つ たもつ [g], 整備する せいびする [s] (equipment)
    make: 作る つくる [g], 製造する せいぞうする [s] (manufacture), 作成する さくせいする [s] (create a document)
    make up: でっち上げる でっちあげる [i] (invent), 化粧する けしょうする [s] (cosmetics), 仲直りする なかなおりする [s] (reconcile)
    malfunction: 故障する こしょうする [s], 誤作動する ごさどうする [s]
    manage: 管理する かんりする [s], 経営する けいえいする [s] (a business), 運営する うんえいする [s] (an organization)
    mangle: 潰す つぶす [g] (crush), 切り裂く きりさく [g] (tear up), 壊す こわす [g] (wreck)
    manipulate: 操作する そうさする [s] (machines, data), 操る あやつる [g] (people)
    manufacture: 製造する せいぞうする [s], 生産する せいさんする [s]
    map: マッピングする まっぴんぐする [s] (data), 地図化する ちずかする [s] (make a map)
    march: 行進する こうしんする [s], 進軍する しんぐんする [s] (soldiers)
    marinate: 漬け込む つけこむ [g], マリネする まりねする [s]
    mark: マークする まーくする [s], 記す しるす [g] (write down), 採点する さいてんする [s] (homework)
    market: 販売する はんばいする [s], 売り込む うりこむ [g] (promote)
    marvel: 感嘆する かんたんする [s], 驚嘆する きょうたんする [s]
    mash: 潰す つぶす [g], すりつぶす すりつぶす [g]
    mask: 覆い隠す おおいかくす [g] (conceal), マスクする ますくする [s] (cover with a mask, hide data)
    massage: マッサージする まっさーじする [s], 揉む もむ [g]
    master: 習得する しゅうとくする [s], マスターする ますたーする [s], 使いこなす つかいこなす [g] (a tool)
    match: 合う あう [g] (go with), 合わせる あわせる [i] (pair up), 匹敵する ひってきする [s] (equal)
    materialize: 実現する じつげんする [s] (come true), 具体化する ぐたいかする [s] (take shape), 現れる あらわれる [i] (appear)
    matter: 関わる かかわる [g] (be of consequence), 響く ひびく [g] (have an effect)
    maximize: 最大化する さいだいかする [s]
    mean: 意味する いみする [s] (signify), 意図する いとする [s] (intend), 指す さす [g] (refer to)
    measure: 測る はかる [g] (length, size), 量る はかる [g] (weight), 測定する そくていする [s]
    mediate: 仲裁する ちゅうさいする [s], 調停する ちょうていする [s], 仲介する ちゅうかいする [s]
    meet: 会う あう [g], 出会う であう [g] (run into, meet for the first time), 知り合う しりあう [g] (get to know)
    melt: 溶ける とける [i], 溶かす とかす [g]
    memorize: 暗記する あんきする [s], 覚える おぼえる [i]
    mend: 繕う つくろう [g] (clothes), 直す なおす [g], 修繕する しゅうぜんする [s]
    mention: 言及する げんきゅうする [s], 触れる ふれる [i] (touch on)
    meow: 鳴く なく [g]
    merge: 合併する がっぺいする [s] (companies), 統合する とうごうする [s], マージする まーじする [s] (data, code)
    merit: 値する あたいする [s]
    migrate: 移住する いじゅうする [s] (people), 移行する いこうする [s] (systems, data), 渡る わたる [g] (birds)
    mimic: 真似る まねる [i], 物真似する ものまねする [s], 模倣する もほうする [s]
    minimize: 最小化する さいしょうかする [s], 縮小する しゅくしょうする [s] (a window), 軽視する けいしする [s] (downplay)
    mislead: 惑わす まどわす [g], 欺く あざむく [g]
    misplace: 置き忘れる おきわすれる [i], 紛失する ふんしつする [s]
    miss: 恋しがる こいしがる [g] (feel the absence of), 乗り遅れる のりおくれる [i] (a bus, a train), 逃す のがす [g] (a chance)
    mistake: 間違える まちがえる [i], 勘違いする かんちがいする [s] (misunderstand), 取り違える とりちがえる [i] (confuse)
    mix: 混ぜる まぜる [i], 混ざる まざる [g] (get mixed), 混合する こんごうする [s]
    mobilize: 動員する どういんする [s], 結集する けっしゅうする [s]
    mock: 嘲る あざける [g], 嘲笑う あざわらう [g]
    modify: 変更する へんこうする [s], 修正する しゅうせいする [s], 改造する かいぞうする [s] (alter the structure)
    moisten: 湿らす しめらす [g], 潤す うるおす [g], 濡らす ぬらす [g]
    mold: 成形する せいけいする [s] (shape in a mold), 形作る かたちづくる [g], 鋳造する ちゅうぞうする [s] (cast metal)
    monitor: 監視する かんしする [s], モニタリングする もにたりんぐする [s], 観察する かんさつする [s]
    mortgage: 抵当に入れる ていとうにいれる [i], 担保に入れる たんぽにいれる [i] (as collateral)
    motivate: 動機づける どうきづける [i], 励ます はげます [g], 鼓舞する こぶする [s]
    mount: 登る のぼる [g] (climb), 取り付ける とりつける [i] (attach), またがる またがる [g] (a horse)
    move: 動く うごく [g] (change position), 動かす うごかす [g] (set in motion), 引っ越す ひっこす [g] (change residence)
    muffle: 和らげる やわらげる [i] (a sound), 抑える おさえる [i], 覆う おおう [g]
    multiply: 掛ける かける [i] (numbers), 増殖する ぞうしょくする [s] (grow in number), 繁殖する はんしょくする [s] (breed)
    mumble: 呟く つぶやく [g], 口ごもる くちごもる [g]
    munch: 噛む かむ [g], かじる かじる [g] (gnaw)
    murder: 殺害する さつがいする [s], 殺す ころす [g], 暗殺する あんさつする [s] (assassinate)
    murmur: 呟く つぶやく [g], 囁く ささやく [g]
    muse: 思索する しさくする [s], 考え込む かんがえこむ [g]
    must: 義務づける ぎむづける [i] (make obligatory), 要する ようする [s] (require)
    mutter: 呟く つぶやく [g], ぼやく ぼやく [g] (grumble)
    nag: せがむ せがむ [g] (pester for something), 責め立てる せめたてる [i] (badger)
    nail: 打ちつける うちつける [i] (hammer in), 留める とめる [i] (fasten)
    name: 名付ける なづける [i], 命名する めいめいする [s], 任命する にんめいする [s] (appoint)
    narrow: 狭める せばめる [i], 狭まる せばまる [g], 絞り込む しぼりこむ [g] (narrow down)
    navigate: 航行する こうこうする [s] (ships), ナビゲートする なびげーとする [s] (find the way)
    need: 必要とする ひつようとする [s], 要る いる [g]
    neglect: 怠る おこたる [g], 放置する ほうちする [s]
    negotiate: 交渉する こうしょうする [s], 掛け合う かけあう [g]
    nest: 巣作りする すづくりする [s], 営巣する えいそうする [s]
    neutralize: 中和する ちゅうわする [s], 無力化する むりょくかする [s]
    nibble: かじる かじる [g], つまむ つまむ [g]
    nod: うなずく うなずく [g]
    nominate: 指名する しめいする [s], 推薦する すいせんする [s]
    notice: 気づく きづく [g], 見かける みかける [i] (catch sight of)
    notify: 知らせる しらせる [i], 通知する つうちする [s]
    nourish: 養う やしなう [g], 育む はぐくむ [g]
    nudge: 小突く こづく [g], 促す うながす [g] (urge gently)
    numb: 麻痺する まひする [s], しびれる しびれる [i] (go numb)
    obey: 従う したがう [g], 服従する ふくじゅうする [s]
    object: 反対する はんたいする [s], 抗議する こうぎする [s]
    oblige: 強いる しいる [i], 義務づける ぎむづける [i]
    obscure: 隠す かくす [g], ぼかす ぼかす [g] (make vague)
    observe: 観察する かんさつする [s], 守る まもる [g] (follow a rule), 述べる のべる [i] (remark)
    obsess: 執着する しゅうちゃくする [s], こだわる こだわる [g] (fixate on)
    obstruct: 妨げる さまたげる [i], 妨害する ぼうがいする [s], 塞ぐ ふさぐ [g] (block)
    obtain: 得る える [i], 入手する にゅうしゅする [s], 獲得する かくとくする [s]
    occupy: 占める しめる [i] (take up space), 占領する せんりょうする [s] (take by force)
    occur: 起こる おこる [g], 生じる しょうじる [i]
    offend: 傷つける きずつける [i] (hurt feelings), 侮辱する ぶじょくする [s] (insult)
    offer: 提供する ていきょうする [s], 申し出る もうしでる [i] (propose to do), 差し出す さしだす [g] (hold out)
    offset: 相殺する そうさいする [s], 埋め合わせる うめあわせる [i], 補う おぎなう [g]
    omit: 省く はぶく [g], 省略する しょうりゃくする [s]
    ooze: にじむ にじむ [g], 染み出る しみでる [i]
    open: 開ける あける [i], 開く ひらく [g]
    operate: 操作する そうさする [s] (a machine), 手術する しゅじゅつする [s] (surgery), 運営する うんえいする [s] (run a business)
    oppose: 反対する はんたいする [s], 逆らう さからう [g]
    oppress: 抑圧する よくあつする [s], 虐げる しいたげる [i]
    optimize: 最適化する さいてきかする [s]
    orchestrate: 編曲する へんきょくする [s] (music), 取りまとめる とりまとめる [i] (coordinate)
    order: 注文する ちゅうもんする [s] (a meal), 命じる めいじる [i] (command), 並べる ならべる [i] (arrange in order)
    organize: 整理する せいりする [s] (put in order), 企画する きかくする [s] (an event), 組織する そしきする [s] (a group)
    orient: 向ける むける [i], 方向づける ほうこうづける [i]
    oust: 追い出す おいだす [g], 追放する ついほうする [s], 解任する かいにんする [s] (remove from a post)
    outdo: 上回る うわまわる [g], 勝る まさる [g], しのぐ しのぐ [g]
    outline: 概説する がいせつする [s], 要約する ようやくする [s]
    outperform: 上回る うわまわる [g], 凌駕する りょうがする [s]
    overcome: 克服する こくふくする [s], 乗り越える のりこえる [i], 打ち勝つ うちかつ [g]
    overdo: やり過ぎる やりすぎる [i], 誇張する こちょうする [s] (exaggerate)
    overflow: あふれる あふれる [i], こぼれる こぼれる [i] (spill over), 氾濫する はんらんする [s] (a river)
    overhear: 立ち聞きする たちぎきする [s], 漏れ聞く もれきく [g]
    overlap: 重なる かさなる [g], 重複する ちょうふくする [s], 重ねる かさねる [i]
    overpower: 圧倒する あっとうする [s], 打ち負かす うちまかす [g]
    override: 覆す くつがえす [g] (a decision), 優先する ゆうせんする [s] (take priority over)
    overrule: 却下する きゃっかする [s], 覆す くつがえす [g]
    oversee: 監督する かんとくする [s], 管理する かんりする [s]
    overtake: 追い越す おいこす [g], 追い抜く おいぬく [g]
    overthrow: 倒す たおす [g], 打倒する だとうする [s]
    overturn: ひっくり返す ひっくりかえす [g], 覆す くつがえす [g] (a ruling)
    overwhelm: 圧倒する あっとうする [s], 打ちのめす うちのめす [g]
    overwrite: 上書きする うわがきする [s]
    owe: 借りる かりる [i] (owe money), 負う おう [g] (owe a debt of gratitude)
    own: 所有する しょゆうする [s], 持つ もつ [g]
    pacify: なだめる なだめる [i], 鎮める しずめる [i]
    pack: 荷造りする にづくりする [s], 詰める つめる [i], 梱包する こんぽうする [s] (for shipping)
    paddle: 漕ぐ こぐ [g]
    paint: 塗る ぬる [g] (a wall), 描く えがく [g] (a picture)
    parade: 行進する こうしんする [s], パレードする ぱれーどする [s]
    paralyze: 麻痺する まひする [s]
    paraphrase: 言い換える いいかえる [i], 書き換える かきかえる [i]
    park: 駐車する ちゅうしゃする [s], 停める とめる [i]
    parody: もじる もじる [g], 風刺する ふうしする [s]
    partake: 参加する さんかする [s], 加わる くわわる [g]
    participate: 参加する さんかする [s], 加わる くわわる [g]
    pass: 通る とおる [g] (go past), 渡す わたす [g] (hand over), 合格する ごうかくする [s] (an exam)
    paste: 貼り付ける はりつける [i], 貼る はる [g]
    pat: 撫でる なでる [i] (stroke), 叩く たたく [g] (tap lightly)
    patch: 繕う つくろう [g], 修繕する しゅうぜんする [s]
    patrol: 巡回する じゅんかいする [s], パトロールする ぱとろーるする [s]
    pause: 一時停止する いちじていしする [s], 中断する ちゅうだんする [s]
    pave: 舗装する ほそうする [s], 敷き詰める しきつめる [i] (cover a surface)
    pawn: 質入れする しちいれする [s]
    pay: 払う はらう [g], 支払う しはらう [g]
    pay back: 返す かえす [g], 返済する へんさいする [s], 払い戻す はらいもどす [g] (refund)
    pedal: 漕ぐ こぐ [g] (a bicycle), 踏む ふむ [g] (a pedal)
    peek: 覗く のぞく [g], 盗み見る ぬすみみる [i]
    peel: 剥く むく [g], 剥がす はがす [g] (peel off)
    penalize: 罰する ばっする [s], 処罰する しょばつする [s]
    perceive: 感じ取る かんじとる [g], 認識する にんしきする [s], 知覚する ちかくする [s]
    perch: 止まる とまる [g] (a bird), 腰掛ける こしかける [i] (sit on the edge)
    perfect: 磨き上げる みがきあげる [i], 完成する かんせいする [s]
    perform: 行う おこなう [g] (carry out), 演じる えんじる [i] (act on stage), 演奏する えんそうする [s] (music)
    perish: 滅びる ほろびる [i], 死ぬ しぬ [g]
    permit: 許す ゆるす [g], 許可する きょかする [s], 認める みとめる [i]
    perpetuate: 永続化する えいぞくかする [s], 固定化する こていかする [s]
    persevere: やり抜く やりぬく [g], 粘る ねばる [g], 頑張る がんばる [g]
    persist: 続く つづく [g], 粘る ねばる [g], 固執する こしつする [s]
    persuade: 説得する せっとくする [s], 説き伏せる ときふせる [i]
    pester: 悩ます なやます [g], 付きまとう つきまとう [g], せがむ せがむ [g] (pester for something)
    phone: 電話する でんわする [s]
    photograph: 撮影する さつえいする [s], 撮る とる [g]
    pick: 選ぶ えらぶ [g] (choose), 摘む つむ [g] (flowers, fruit), 拾う ひろう [g] (pick up)
    pick out: 選び出す えらびだす [g], 選ぶ えらぶ [g]
    pick up: 拾う ひろう [g], 持ち上げる もちあげる [i] (lift), 受け取る うけとる [g] (collect)
    pierce: 突き刺す つきさす [g], 貫く つらぬく [g]
    pile up: 積み上げる つみあげる [i], 積む つむ [g], 積もる つもる [g] (accumulate)
    pilot: 操縦する そうじゅうする [s]
    pin: 留める とめる [i] (fasten with a pin), 固定する こていする [s] (fix in place)
    pinch: つねる つねる [g], つまむ つまむ [g]
    pinpoint: 特定する とくていする [s], 突き止める つきとめる [i]
    pitch: 投げる なげる [i] (throw), 張る はる [g] (a tent), 売り込む うりこむ [g] (promote)
    pity: 哀れむ あわれむ [g], 同情する どうじょうする [s]
    place: 置く おく [g], 配置する はいちする [s]
    plague: 苦しめる くるしめる [i], 悩ます なやます [g]
    plan: 計画する けいかくする [s], 予定する よていする [s], 企てる くわだてる [i]
    plant: 植える うえる [i], 蒔く まく [g] (sow seeds)
    plaster: 塗る ぬる [g] (cover with plaster), 貼り付ける はりつける [i] (stick up)
    play: 遊ぶ あそぶ [g] (have fun, play games), やる やる [g] (sports, games), 弾く ひく [g] (an instrument)
    plead: 懇願する こんがんする [s] (beg), 訴える うったえる [i] (appeal)
    please: 喜ばす よろこばす [g], 気に入る きにいる [g] (be pleased with)
    pledge: 誓う ちかう [g], 約束する やくそくする [s]
    plot: 企む たくらむ [g] (scheme), 画策する かくさくする [s], プロットする ぷろっとする [s] (on a graph)
    plow: 耕す たがやす [g]
    pluck: むしる むしる [g] (feathers, weeds), 摘む つむ [g] (flowers), 引き抜く ひきぬく [g] (pull out)
    plug: 差し込む さしこむ [g] (plug in), 塞ぐ ふさぐ [g] (a hole)
    plunder: 略奪する りゃくだつする [s], 奪う うばう [g]
    plunge: 飛び込む とびこむ [g] (dive in), 沈める しずめる [i] (immerse), 急落する きゅうらくする [s] (drop sharply)
    point: 指さす ゆびさす [g], 向ける むける [i] (aim)
    point out: 指摘する してきする [s], 示す しめす [g]
    poison: 毒殺する どくさつする [s] (kill with poison), 汚染する おせんする [s] (contaminate)
    poke: 突く つく [g] (jab), つつく つつく [g] (prod)
    polish: 磨く みがく [g], 洗練する せんれんする [s] (refine)
    pollute: 汚染する おせんする [s], 汚す よごす [g]
    ponder: 考え込む かんがえこむ [g], 熟考する じゅっこうする [s]
    pop: 破裂する はれつする [s] (burst), はじける はじける [i] (pop open), 割る わる [g] (burst a balloon)
    populate: 入植する にゅうしょくする [s], 住み着く すみつく [g]
    portray: 描く えがく [g], 描写する びょうしゃする [s], 演じる えんじる [i] (a role)
    pose: ポーズを取る ぽーずをとる [g] (strike a pose), 投げかける なげかける [i] (a question)
    position: 配置する はいちする [s], 位置づける いちづける [i]
    possess: 所有する しょゆうする [s], 持つ もつ [g]
    post: 投稿する とうこうする [s] (online), 掲示する けいじする [s] (on a board), 郵送する ゆうそうする [s] (mail)
    postpone: 延期する えんきする [s], 延ばす のばす [g]
    pound: 叩く たたく [g], 打つ うつ [g] (thump), 砕く くだく [g] (crush)
    pour: 注ぐ そそぐ [g], 流し込む ながしこむ [g] (pour into)
    practice: 練習する れんしゅうする [s], 実践する じっせんする [s] (put into practice)
    praise: 褒める ほめる [i], 称える たたえる [i], 称賛する しょうさんする [s]
    pray: 祈る いのる [g], 拝む おがむ [g] (at a shrine or temple)
    preach: 説教する せっきょうする [s], 説く とく [g]
    precede: 先立つ さきだつ [g], 先行する せんこうする [s]
    predict: 予測する よそくする [s], 予想する よそうする [s], 予言する よげんする [s] (foretell)
    prefer: 好む このむ [g], 選ぶ えらぶ [g] (choose rather than)
    preheat: 予熱する よねつする [s]
    preoccupy: 没頭する ぼっとうする [s] (be absorbed in), 気に病む きにやむ [g] (worry over)
    prepare: 準備する じゅんびする [s], 用意する よういする [s], 支度する したくする [s] (get ready)
    prescribe: 処方する しょほうする [s] (medicine), 規定する きていする [s] (lay down rules)
    present: 発表する はっぴょうする [s] (a talk), 紹介する しょうかいする [s] (introduce), 贈る おくる [g] (give a gift)
    preserve: 保存する ほぞんする [s], 保つ たもつ [g]
    preside: 司会する しかいする [s] (a meeting), 取り仕切る とりしきる [g] (take charge)
    press: 押す おす [g], 押しつける おしつける [i] (push against)
    presume: 推定する すいていする [s], 推測する すいそくする [s], 思い込む おもいこむ [g] (assume)
    pretend: ふりをする ふりをする [s], 装う よそおう [g]
    prevail: 勝つ かつ [g] (win out), 普及する ふきゅうする [s] (be widespread)
    prevent: 防ぐ ふせぐ [g], 阻止する そしする [s], 予防する よぼうする [s]
    prick: 刺す さす [g], 突く つく [g]
    print: 印刷する いんさつする [s], プリントする ぷりんとする [s], 刷る する [g]
    probe: 探る さぐる [g], 調査する ちょうさする [s]
    proceed: 進む すすむ [g], 進行する しんこうする [s]
    process: 処理する しょりする [s], 加工する かこうする [s] (food, materials)
    proclaim: 宣言する せんげんする [s], 公表する こうひょうする [s]
    produce: 生産する せいさんする [s], 生み出す うみだす [g], 制作する せいさくする [s] (a film, show)
    profess: 公言する こうげんする [s], 主張する しゅちょうする [s]
    program: プログラムする ぷろぐらむする [s], プログラミングする ぷろぐらみんぐする [s]
    progress: 進歩する しんぽする [s], 進展する しんてんする [s], 進む すすむ [g]
    prohibit: 禁止する きんしする [s], 禁じる きんじる [i]
    project: 映す うつす [g] (onto a screen), 見積もる みつもる [g] (estimate), 突き出る つきでる [i] (stick out)
    prolong: 延長する えんちょうする [s], 延ばす のばす [g]
    promise: 約束する やくそくする [s], 誓う ちかう [g]
    promote: 促進する そくしんする [s], 宣伝する せんでんする [s] (advertise), 抜擢する ばってきする [s] (promote to a post)
    prompt: 促す うながす [g], 駆り立てる かりたてる [i]
    pronounce: 発音する はつおんする [s], 宣告する せんこくする [s] (declare)
    propagate: 広める ひろめる [i], 繁殖する はんしょくする [s] (biology)
    propel: 推進する すいしんする [s], 押し進める おしすすめる [i]
    propose: 提案する ていあんする [s], プロポーズする ぷろぽーずする [s] (marriage), 提唱する ていしょうする [s]
    prosecute: 起訴する きそする [s], 告訴する こくそする [s]
    prosper: 栄える さかえる [i], 繁栄する はんえいする [s]
    protect: 守る まもる [g], 保護する ほごする [s]
    protest: 抗議する こうぎする [s], 反対する はんたいする [s]
    protrude: 突き出る つきでる [i], 出っ張る でっぱる [g], はみ出る はみでる [i]
    prove: 証明する しょうめいする [s], 立証する りっしょうする [s], 実証する じっしょうする [s]
    provide: 提供する ていきょうする [s], 供給する きょうきゅうする [s], 与える あたえる [i]
    provoke: 挑発する ちょうはつする [s] (taunt), 引き起こす ひきおこす [g] (cause)
    prune: 剪定する せんていする [s], 刈り込む かりこむ [g]
    pry: 詮索する せんさくする [s], 嗅ぎ回る かぎまわる [g] (snoop), こじ開ける こじあける [i] (pry open)
    publish: 出版する しゅっぱんする [s], 発行する はっこうする [s], 掲載する けいさいする [s] (carry an article)
    pull: 引く ひく [g], 引っ張る ひっぱる [g]
    pulse: 脈打つ みゃくうつ [g], 鼓動する こどうする [s]
    pump: 汲み上げる くみあげる [i] (water), 送り出す おくりだす [g] (a heart pumping blood), 注入する ちゅうにゅうする [s]
    punch: 殴る なぐる [g], パンチする ぱんちする [s]
    punctuate: 句読点を打つ くとうてんをうつ [g], 区切る くぎる [g]
    puncture: パンクする ぱんくする [s] (a tire), 突き破る つきやぶる [g] (break through), 穴を開ける あなをあける [i]
    punish: 罰する ばっする [s], 懲らしめる こらしめる [i], 処罰する しょばつする [s]
    purchase: 購入する こうにゅうする [s], 買う かう [g]
    purge: 粛清する しゅくせいする [s], 一掃する いっそうする [s], 浄化する じょうかする [s] (cleanse)
    purify: 浄化する じょうかする [s], 清める きよめる [i], 精製する せいせいする [s] (refine a substance)
    pursue: 追う おう [g], 追いかける おいかける [i], 追求する ついきゅうする [s] (a goal)
    push: 押す おす [g], 押し込む おしこむ [g]
    put: 置く おく [g], 入れる いれる [i] (put in), 載せる のせる [i] (put on top)
    put off: 延期する えんきする [s], 先送りする さきおくりする [s], 延ばす のばす [g]
    puzzle: 戸惑わせる とまどわせる [i] (make baffled), 戸惑う とまどう [g] (be baffled), 当惑する とうわくする [s]
    quake: 揺れる ゆれる [i] (shake), 震える ふるえる [i] (tremble)
    qualify: 資格を得る しかくをえる [i] (become qualified), 該当する がいとうする [s] (meet the criteria)
    quarrel: 喧嘩する けんかする [s], 言い争う いいあらそう [g], 口論する こうろんする [s]
    quench: 癒す いやす [g] (thirst), 消す けす [g] (a fire), 潤す うるおす [g] (moisten)
    query: 問い合わせる といあわせる [i], 照会する しょうかいする [s]
    question: 質問する しつもんする [s], 疑う うたがう [g] (doubt), 尋問する じんもんする [s] (interrogate)
    quit: 辞める やめる [i] (a job), やめる やめる [i] (stop doing), 退職する たいしょくする [s]
    quiver: 震える ふるえる [i], わななく わななく [g]
    quote: 引用する いんようする [s], 見積もる みつもる [g] (give a price)
    race: 競走する きょうそうする [s], 競う きそう [g], 駆ける かける [i]
    radiate: 放射する ほうしゃする [s], 放つ はなつ [g]
    raid: 襲撃する しゅうげきする [s], 急襲する きゅうしゅうする [s]
    rain: 降る ふる [g]
    raise: 上げる あげる [i] (lift, increase), 育てる そだてる [i] (children), 飼う かう [g] (animals)
    rally: 結集する けっしゅうする [s] (bring together), 動員する どういんする [s] (mobilize), 盛り返す もりかえす [g] (recover)
    ram: ぶつける ぶつける [i], 突っ込む つっこむ [g], 激突する げきとつする [s]
    ramble: 脱線する だっせんする [s] (digress), 散策する さんさくする [s] (walk about)
    rank: ランク付けする らんくづけする [s], 格付けする かくづけする [s], 順位づける じゅんいづける [i]
    rant: まくし立てる まくしたてる [i], わめく わめく [g]
    rate: 評価する ひょうかする [s], 採点する さいてんする [s], 格付けする かくづけする [s]
    rationalize: 合理化する ごうりかする [s], 正当化する せいとうかする [s] (justify)
    rattle: がたつく がたつく [g], 鳴らす ならす [g]
    reach: 届く とどく [g], 到達する とうたつする [s], 着く つく [g] (arrive)
    react: 反応する はんのうする [s], 反発する はんぱつする [s] (react against)
    read: 読む よむ [g], 読み取る よみとる [g] (interpret)
    reap: 収穫する しゅうかくする [s], 刈り取る かりとる [g]
    rear: 育てる そだてる [i], 飼う かう [g] (animals), 養育する よういくする [s]
    reason: 推論する すいろんする [s], 論じる ろんじる [i] (argue)
    reassure: 励ます はげます [g], なだめる なだめる [i]
    rebuild: 再建する さいけんする [s], 建て直す たてなおす [g], 復興する ふっこうする [s] (after a disaster)
    rebuke: 叱る しかる [g], たしなめる たしなめる [i], とがめる とがめる [i]
    recall: 思い出す おもいだす [g], 回収する かいしゅうする [s] (a product), 呼び戻す よびもどす [g] (call back)
    recede: 引く ひく [g] (the tide), 後退する こうたいする [s], 遠ざかる とおざかる [g]
    receive: 受け取る うけとる [g], もらう もらう [g], 受ける うける [i]
    recharge: 充電する じゅうでんする [s], 補充する ほじゅうする [s] (refill)
    reciprocate: お返しする おかえしする [s], 報いる むくいる [i]
    recite: 暗唱する あんしょうする [s], 朗読する ろうどくする [s]
    reckon: 計算する けいさんする [s], 見積もる みつもる [g], 数える かぞえる [i]
    reclaim: 取り戻す とりもどす [g], 回収する かいしゅうする [s], 埋め立てる うめたてる [i] (land from the sea)
    recline: 寄りかかる よりかかる [g], もたれる もたれる [i], 横たわる よこたわる [g]
    recognize: 認識する にんしきする [s], 見分ける みわける [i] (identify), 認める みとめる [i] (acknowledge)
    recoil: 後ずさりする あとずさりする [s], たじろぐ たじろぐ [g], ひるむ ひるむ [g]
    recommend: 勧める すすめる [i], 推薦する すいせんする [s]
    reconcile: 和解する わかいする [s], 仲直りする なかなおりする [s] (make up)
    reconsider: 考え直す かんがえなおす [g], 再考する さいこうする [s]
    record: 録音する ろくおんする [s] (audio), 録画する ろくがする [s] (video), 記録する きろくする [s] (write down)
    recount: 語る かたる [g], 述べる のべる [i], 数え直す かぞえなおす [g] (count again)
    recover: 回復する かいふくする [s], 治る なおる [g] (from illness), 取り戻す とりもどす [g] (get back)
    recreate: 再現する さいげんする [s], 作り直す つくりなおす [g]
    recruit: 採用する さいようする [s] (hire), 募集する ぼしゅうする [s] (call for applicants), 勧誘する かんゆうする [s] (solicit)
    rectify: 正す ただす [g], 是正する ぜせいする [s]
    recycle: リサイクルする りさいくるする [s], 再利用する さいりようする [s]
    redeem: 償う つぐなう [g] (make amends), 救う すくう [g] (save), 償還する しょうかんする [s] (a bond)
    redirect: 転送する てんそうする [s], 向け直す むけなおす [g], リダイレクトする りだいれくとする [s] (web)
    redo: やり直す やりなおす [g], 作り直す つくりなおす [g]
    reduce: 減らす へらす [g], 削減する さくげんする [s], 縮小する しゅくしょうする [s]
    refer: 参照する さんしょうする [s] (look up), 言及する げんきゅうする [s] (mention), 紹介する しょうかいする [s] (refer a person)
    refine: 精製する せいせいする [s] (a substance), 洗練する せんれんする [s] (improve), 改良する かいりょうする [s]
    reflect: 反射する はんしゃする [s] (light), 映す うつす [g], 反映する はんえいする [s]
    reform: 改革する かいかくする [s], 改める あらためる [i]
    refrain: 控える ひかえる [i], 差し控える さしひかえる [i], 慎む つつしむ [g]
    refresh: リフレッシュする りふれっしゅする [s], 更新する こうしんする [s] (a page)
    refrigerate: 冷蔵する れいぞうする [s], 冷やす ひやす [g]
    refund: 返金する へんきんする [s], 払い戻す はらいもどす [g]
    refuse: 断る ことわる [g], 拒否する きょひする [s], 拒む こばむ [g]
    regain: 取り戻す とりもどす [g], 回復する かいふくする [s]
    regard: 見なす みなす [g] (consider as), 考える かんがえる [i]
    regenerate: 再生する さいせいする [s], よみがえる よみがえる [g]
    register: 登録する とうろくする [s], 記録する きろくする [s], 届け出る とどけでる [i] (report officially)
    regret: 後悔する こうかいする [s], 悔やむ くやむ [g], 嘆く なげく [g] (lament)
    regulate: 規制する きせいする [s], 調整する ちょうせいする [s] (adjust)
    rehearse: リハーサルする りはーさるする [s], 稽古する けいこする [s]
    reign: 君臨する くんりんする [s], 統治する とうちする [s]
    reinforce: 強化する きょうかする [s], 補強する ほきょうする [s]
    reiterate: 繰り返す くりかえす [g], 反復する はんぷくする [s]
    reject: 拒否する きょひする [s], 断る ことわる [g], 却下する きゃっかする [s]
    rekindle: 呼び覚ます よびさます [g], 再燃する さいねんする [s] (flare up again)
    relapse: 再発する さいはつする [s], ぶり返す ぶりかえす [g], 逆戻りする ぎゃくもどりする [s]
    relate: 関連づける かんれんづける [i] (connect), 関係する かんけいする [s] (be related to), 結びつける むすびつける [i]
    relax: くつろぐ くつろぐ [g], リラックスする りらっくすする [s], 緩める ゆるめる [i] (loosen)
    relay: 中継する ちゅうけいする [s], 伝える つたえる [i]
    release: 解放する かいほうする [s] (set free), 放す はなす [g] (let go), 公開する こうかいする [s] (a film or software)
    relegate: 格下げする かくさげする [s], 追いやる おいやる [g]
    relent: 折れる おれる [i] (give in), 譲る ゆずる [g], 軟化する なんかする [s]
    relieve: 和らげる やわらげる [i], 緩和する かんわする [s], 解消する かいしょうする [s]
    relish: 味わう あじわう [g], 楽しむ たのしむ [g]
    reload: リロードする りろーどする [s], 再読み込みする さいよみこみする [s] (a page), 再装填する さいそうてんする [s] (a weapon)
    rely: 頼る たよる [g], 信頼する しんらいする [s] (trust), 依存する いぞんする [s] (depend on)
    remain: 残る のこる [g], 留まる とどまる [g] (stay)
    remark: 述べる のべる [i], コメントする こめんとする [s], 指摘する してきする [s]
    remedy: 改善する かいぜんする [s], 是正する ぜせいする [s], 治す なおす [g] (cure)
    remember: 覚える おぼえる [i], 思い出す おもいだす [g] (recall)
    remind: 思い出させる おもいださせる [i] (make someone remember), リマインドする りまいんどする [s], 念押しする ねんおしする [s] (remind firmly)
    remit: 送金する そうきんする [s] (money), 免除する めんじょする [s] (cancel a debt)
    remodel: 改装する かいそうする [s], 改築する かいちくする [s], リフォームする りふぉーむする [s]
    remove: 取り除く とりのぞく [g], 外す はずす [g], 削除する さくじょする [s] (delete)
    rename: 改名する かいめいする [s], リネームする りねーむする [s] (a file)
    renew: 更新する こうしんする [s], 刷新する さっしんする [s]
    renounce: 放棄する ほうきする [s], 捨てる すてる [i], 断念する だんねんする [s] (give up)
    renovate: 改修する かいしゅうする [s], リノベーションする りのべーしょんする [s], 改装する かいそうする [s]
    rent: 借りる かりる [i] (rent from), 貸す かす [g] (rent out)
    repair: 直す なおす [g], 修理する しゅうりする [s], 修繕する しゅうぜんする [s] (a building)
    repay: 返済する へんさいする [s] (a loan), 返す かえす [g] (give back), 報いる むくいる [i] (repay kindness)
    repeal: 廃止する はいしする [s], 撤廃する てっぱいする [s]
    repeat: 繰り返す くりかえす [g], 復唱する ふくしょうする [s] (say back), 反復する はんぷくする [s]
    repel: 追い払う おいはらう [g], 撃退する げきたいする [s], はじく はじく [g] (repel water)
    replace: 取り替える とりかえる [i] (swap), 置き換える おきかえる [i] (substitute), 交換する こうかんする [s] (exchange)
    replenish: 補充する ほじゅうする [s], 補給する ほきゅうする [s]
    reply: 返事する へんじする [s], 返信する へんしんする [s] (a message), 答える こたえる [i]
    report: 報告する ほうこくする [s], 報じる ほうじる [i] (news), 通報する つうほうする [s] (to the police)
    represent: 代表する だいひょうする [s], 表す あらわす [g], 象徴する しょうちょうする [s]
    repress: 抑圧する よくあつする [s], 抑える おさえる [i]
    reprimand: 叱責する しっせきする [s], 叱る しかる [g]
    reproach: 責める せめる [i], なじる なじる [g], 非難する ひなんする [s]
    reproduce: 複製する ふくせいする [s] (copy), 再現する さいげんする [s], 繁殖する はんしょくする [s] (biology)
    request: 依頼する いらいする [s], 要請する ようせいする [s], 頼む たのむ [g]
    require: 必要とする ひつようとする [s], 要求する ようきゅうする [s] (demand), 求める もとめる [i]
    reschedule: 日程変更する にっていへんこうする [s], 振り替える ふりかえる [i]
    rescind: 撤回する てっかいする [s], 取り消す とりけす [g]
    rescue: 救助する きゅうじょする [s], 救出する きゅうしゅつする [s], 助ける たすける [i]
    research: 研究する けんきゅうする [s], 調べる しらべる [i], 調査する ちょうさする [s]
    reserve: 予約する よやくする [s], 確保する かくほする [s] (set aside)
    reshape: 作り変える つくりかえる [i], 作り直す つくりなおす [g], 再編する さいへんする [s]
    reside: 住む すむ [g], 居住する きょじゅうする [s]
    resign: 辞職する じしょくする [s], 辞める やめる [i], 辞任する じにんする [s] (leave a post)
    resist: 抵抗する ていこうする [s], 耐える たえる [i] (withstand), 逆らう さからう [g]
    resolve: 解決する かいけつする [s], 解く とく [g] (solve a puzzle), 決意する けついする [s] (decide firmly)
    resort: 頼る たよる [g], 訴える うったえる [i] (resort to force)
    respect: 尊敬する そんけいする [s] (admire), 尊重する そんちょうする [s] (honor), 敬う うやまう [g]
    respond: 答える こたえる [i], 応じる おうじる [i], 反応する はんのうする [s]
    rest: 休む やすむ [g], 休憩する きゅうけいする [s], 休息する きゅうそくする [s]
    restart: 再起動する さいきどうする [s] (a computer), 再開する さいかいする [s] (resume), やり直す やりなおす [g] (start over)
    restore: 修復する しゅうふくする [s], 復元する ふくげんする [s], 復旧する ふっきゅうする [s] (a service)
    restrain: 抑える おさえる [i], 制止する せいしする [s] (hold back a person), 抑制する よくせいする [s] (keep in check)
    restrict: 制限する せいげんする [s], 限る かぎる [g] (limit to), 規制する きせいする [s] (regulate)
    result: 至る いたる [g] (result in), 起因する きいんする [s] (result from), 生じる しょうじる [i] (arise)
    resume: 再開する さいかいする [s], 続ける つづける [i] (carry on)
    resurrect: 復活する ふっかつする [s], 蘇生する そせいする [s]
    retain: 保持する ほじする [s], 保つ たもつ [g]
    retreat: 撤退する てったいする [s], 退く しりぞく [g], 後退する こうたいする [s]
    retrieve: 取り戻す とりもどす [g] (get back), 取り出す とりだす [g] (take out), 取得する しゅとくする [s] (data)
    return: 戻る もどる [g], 帰る かえる [g], 返す かえす [g] (give back)
    reunite: 再会する さいかいする [s] (meet again), 再統一する さいとういつする [s]
    reveal: 明らかにする あきらかにする [s], 明かす あかす [g] (disclose), 暴く あばく [g] (expose)
    reverse: 逆転する ぎゃくてんする [s], 反転する はんてんする [s] (flip), バックする ばっくする [s] (a car)
    revert: 戻る もどる [g], 逆戻りする ぎゃくもどりする [s], 戻す もどす [g] (undo a change)
    review: 見直す みなおす [g], 復習する ふくしゅうする [s] (study again), 批評する ひひょうする [s] (a book or film)
    revise: 修正する しゅうせいする [s], 改訂する かいていする [s] (a text), 見直す みなおす [g]
    revive: 復活する ふっかつする [s], 生き返る いきかえる [g], 蘇生する そせいする [s] (resuscitate)
    revoke: 取り消す とりけす [g], 撤回する てっかいする [s], 剥奪する はくだつする [s] (strip a right)
    revolutionize: 革新する かくしんする [s], 革命を起こす かくめいをおこす [g]
    reward: 報いる むくいる [i], 表彰する ひょうしょうする [s] (honor with an award)
    rhyme: 韻を踏む いんをふむ [g], 押韻する おういんする [s]
    ride: 乗る のる [g], 乗り回す のりまわす [g]
    ring: 鳴る なる [g], 鳴らす ならす [g], 鳴り響く なりひびく [g] (ring out)
    rinse: すすぐ すすぐ [g], ゆすぐ ゆすぐ [g], 洗い流す あらいながす [g]
    rip: 破る やぶる [g], 引き裂く ひきさく [g], 裂く さく [g]
    ripple: 波打つ なみうつ [g], 波立つ なみだつ [g]
    rise: 上がる あがる [g], 昇る のぼる [g] (the sun), 立ち上がる たちあがる [g] (stand up)
    risk: 賭ける かける [i] (stake), 冒す おかす [g] (run a risk)
    rival: 匹敵する ひってきする [s], 張り合う はりあう [g]
    roam: さまよう さまよう [g], 歩き回る あるきまわる [g], うろつく うろつく [g]
    roar: 吠える ほえる [i], 轟く とどろく [g], うなる うなる [g]
    roast: 焼く やく [g], ローストする ろーすとする [s], あぶる あぶる [g]
    rob: 盗む ぬすむ [g] (steal), 強盗する ごうとうする [s] (hold up), 奪う うばう [g] (take by force)
    roll: 転がる ころがる [g], 転がす ころがす [g], 巻く まく [g] (roll up)
    rotate: 回転する かいてんする [s], 回す まわす [g], 回る まわる [g]
    rouse: 起こす おこす [g] (wake someone), かき立てる かきたてる [i] (stir up)
    route: 振り分ける ふりわける [i] (direct to different places), 経由する けいゆする [s] (go via)
    row: 漕ぐ こぐ [g]
    rub: 擦る こする [g], 揉む もむ [g] (massage), 撫でる なでる [i] (stroke)
    ruin: 台無しにする だいなしにする [s], 損なう そこなう [g] (spoil), 滅ぼす ほろぼす [g] (bring to ruin)
    rule: 統治する とうちする [s], 支配する しはいする [s], 治める おさめる [i]
    rumble: 轟く とどろく [g], 鳴り響く なりひびく [g]
    rummage: あさる あさる [g], かき回す かきまわす [g], 探し回る さがしまわる [g]
    run: 走る はしる [g], 駆ける かける [i], 経営する けいえいする [s] (run a business)
    run away: 逃げる にげる [i], 逃げ出す にげだす [g], 家出する いえでする [s] (from home)
    rupture: 破裂する はれつする [s], 裂ける さける [i], 断絶する だんぜつする [s] (break off relations)
    rush: 急ぐ いそぐ [g], 急かす せかす [g] (hurry someone), 殺到する さっとうする [s] (crowd in)
    rust: 錆びる さびる [i], 腐食する ふしょくする [s] (corrode)
    rustle: そよぐ そよぐ [g] (leaves in a breeze), ざわめく ざわめく [g]
    sabotage: 妨害する ぼうがいする [s], 破壊工作する はかいこうさくする [s]
    sacrifice: 犠牲にする ぎせいにする [s], 捧げる ささげる [i] (offer up)
    sadden: 悲しませる かなしませる [i] (make sad), 悲しむ かなしむ [g] (feel sad), 気落ちする きおちする [s] (be disheartened)
    safeguard: 守る まもる [g], 保護する ほごする [s]
    sail: 航海する こうかいする [s], 出航する しゅっこうする [s] (set sail), 帆走する はんそうする [s]
    salute: 敬礼する けいれいする [s] (military), 挨拶する あいさつする [s] (greet), 称える たたえる [i] (honor)
    salvage: 救い出す すくいだす [g], 引き揚げる ひきあげる [i] (raise a wreck), 回収する かいしゅうする [s]
    sanction: 認可する にんかする [s] (approve), 制裁する せいさいする [s] (penalize)
    sanitize: 消毒する しょうどくする [s], 除菌する じょきんする [s]
    sap: 弱める よわめる [i], すり減らす すりへらす [g], 蝕む むしばむ [g] (eat away)
    satisfy: 満たす みたす [g] (fulfil a need), 満足する まんぞくする [s] (be satisfied)
    saturate: 浸す ひたす [g] (soak), 飽和する ほうわする [s] (reach saturation), 染み込む しみこむ [g] (soak into)
    save: 貯める ためる [i] (money), 救う すくう [g] (rescue), 保存する ほぞんする [s] (keep)
    savor: 味わう あじわう [g], 噛みしめる かみしめる [i] (savor deeply)
    saw: 鋸で切る のこぎりできる [g], 挽く ひく [g] (saw wood)
    say: 言う いう [g], 述べる のべる [i] (state)
    scale: 登る のぼる [g] (climb), よじ登る よじのぼる [g] (climb), 拡大する かくだいする [s] (scale up)
    scan: スキャンする すきゃんする [s], 見渡す みわたす [g] (glance over), 走査する そうさする [s]
    scandalize: 憤慨する ふんがいする [s] (be outraged), 衝撃を与える しょうげきをあたえる [i] (shock)
    scar: 傷つける きずつける [i] (wound, mark), 跡を残す あとをのこす [g] (leave a scar)
    scare: おどかす おどかす [g], 驚かす おどろかす [g] (startle), 怖がる こわがる [g] (be scared)
    scatter: まき散らす まきちらす [g], 散らす ちらす [g], 散らばる ちらばる [g] (be scattered)
    schedule: 予定する よていする [s], 設定する せっていする [s] (set a time)
    scheme: 画策する かくさくする [s], 企む たくらむ [g], 謀る はかる [g] (plot)
    scold: 叱る しかる [g], 叱りつける しかりつける [i], 怒る おこる [g] (get angry at)
    scoop: すくい上げる すくいあげる [i], くり抜く くりぬく [g] (hollow out), スクープする すくーぷする [s] (news)
    scorch: 焦がす こがす [g], 焦げる こげる [i] (get scorched), 焼く やく [g] (burn)
    score: 得点する とくてんする [s], 採点する さいてんする [s] (grade), 点を取る てんをとる [g]
    scorn: 軽蔑する けいべつする [s], 蔑む さげすむ [g], 見下す みくだす [g]
    scour: 磨く みがく [g], 探し回る さがしまわる [g] (search everywhere)
    scout: 偵察する ていさつする [s], スカウトする すかうとする [s] (talent), 探索する たんさくする [s]
    scrape: 削る けずる [g], 擦る こする [g], 擦りむく すりむく [g] (graze the skin)
    scratch: 引っかく ひっかく [g], 掻く かく [g] (an itch)
    scream: 叫ぶ さけぶ [g], 悲鳴を上げる ひめいをあげる [i] (in fear), わめく わめく [g] (yell)
    screw: ねじ止めする ねじどめする [s], ねじ込む ねじこむ [g] (screw in), 締める しめる [i] (tighten)
    scribble: 殴り書きする なぐりがきする [s], 走り書きする はしりがきする [s], 落書きする らくがきする [s] (doodle)
    scroll: スクロールする すくろーるする [s]
    scrub: 擦る こする [g], こすり洗いする こすりあらいする [s], 磨く みがく [g]
    scrutinize: 精査する せいさする [s], 吟味する ぎんみする [s]
    sculpt: 彫刻する ちょうこくする [s], 彫る ほる [g]
    seal: 封をする ふうをする [s] (an envelope), 密封する みっぷうする [s], 封印する ふういんする [s]
    search: 探す さがす [g], 検索する けんさくする [s] (online), 捜索する そうさくする [s] (a place, by police)
    season: 味付けする あじつけする [s], 調味する ちょうみする [s]
    secure: 確保する かくほする [s], 固定する こていする [s] (fasten), 戸締まりする とじまりする [s] (lock up)
    sedate: 鎮静する ちんせいする [s], 麻酔する ますいする [s] (anesthetize)
    seduce: 誘惑する ゆうわくする [s], 口説く くどく [g] (woo), たぶらかす たぶらかす [g]
    see: 見る みる [i], 見える みえる [i] (be visible), 会う あう [g] (meet)
    seek: 求める もとめる [i], 探し求める さがしもとめる [i]
    seem: 見える みえる [i], 思える おもえる [i]
    segment: 分割する ぶんかつする [s], 区分する くぶんする [s], 区切る くぎる [g]
    segregate: 隔離する かくりする [s], 分離する ぶんりする [s]
    select: 選択する せんたくする [s], 選ぶ えらぶ [g], 選定する せんていする [s]
    sell: 売る うる [g], 販売する はんばいする [s]
    send: 送る おくる [g], 送信する そうしんする [s] (a message), 発送する はっそうする [s] (goods)
    send back: 送り返す おくりかえす [g], 返送する へんそうする [s], 返品する へんぴんする [s] (goods)
    sentence: 言い渡す いいわたす [g], 宣告する せんこくする [s], 判決を下す はんけつをくだす [g]
    separate: 分ける わける [i], 離す はなす [g] (keep apart), 別れる わかれる [i] (part ways)
    serve: 給仕する きゅうじする [s] (food), 仕える つかえる [i] (a master), 役立つ やくだつ [g] (be of use)
    set: 置く おく [g], 設定する せっていする [s], 据える すえる [i] (mount in place)
    set off: 出発する しゅっぱつする [s], 出かける でかける [i], 引き起こす ひきおこす [g] (trigger)
    set up: 設定する せっていする [s] (configure), 設立する せつりつする [s] (found), 設置する せっちする [s] (install)
    settle: 解決する かいけつする [s] (resolve), 定住する ていじゅうする [s] (settle in a place), 落ち着く おちつく [g] (calm down)
    sever: 断ち切る たちきる [g], 切断する せつだんする [s], 切り離す きりはなす [g]
    sew: 縫う ぬう [g], 縫い付ける ぬいつける [i] (sew on)
    shackle: 鎖でつなぐ くさりでつなぐ [g], 拘束する こうそくする [s], 束縛する そくばくする [s] (restrict freedom)
    shade: 陰影をつける いんえいをつける [i] (in a drawing), 遮る さえぎる [g] (block light)
    shake: 振る ふる [g], 揺さぶる ゆさぶる [g], 揺らす ゆらす [g]
    shampoo: シャンプーする しゃんぷーする [s], 洗髪する せんぱつする [s]
    shape: 形作る かたちづくる [g], 成形する せいけいする [s] (mold), 形成する けいせいする [s] (form)
    share: 共有する きょうゆうする [s], 分かち合う わかちあう [g], シェアする しぇあする [s]
    shatter: 砕く くだく [g], 砕ける くだける [i], 粉砕する ふんさいする [s]
    shave: 剃る そる [g], 削る けずる [g] (shave off)
    shear: 刈る かる [g], 刈り込む かりこむ [g] (trim)
    shed: 流す ながす [g] (tears, blood), 脱皮する だっぴする [s] (skin), 落とす おとす [g] (leaves)
    shelter: 避難する ひなんする [s], 雨宿りする あめやどりする [s] (from rain), かくまう かくまう [g] (hide someone)
    shift: 移動する いどうする [s], ずらす ずらす [g], 変わる かわる [g] (change)
    shimmer: きらめく きらめく [g], 揺らめく ゆらめく [g] (flicker)
    shine: 光る ひかる [g], 輝く かがやく [g], 照る てる [g] (the sun)
    shiver: 震える ふるえる [i], 身震いする みぶるいする [s]
    shock: 驚かす おどろかす [g], 衝撃を与える しょうげきをあたえる [i], 感電する かんでんする [s] (electric shock)
    shoo: 追い払う おいはらう [g], 追い立てる おいたてる [i]
    shoot: 撃つ うつ [g] (fire a gun), 射る いる [i] (an arrow), 撮影する さつえいする [s] (film)
    shorten: 短縮する たんしゅくする [s], 縮める ちぢめる [i]
    should: 勧める すすめる [i] (advice), 義務を負う ぎむをおう [g] (obligation)
    shout: 叫ぶ さけぶ [g], 怒鳴る どなる [g] (yell angrily)
    shove: 突き飛ばす つきとばす [g], 押しのける おしのける [i]
    shovel: 掘る ほる [g] (dig), かき出す かきだす [g] (shovel out), 雪かきする ゆきかきする [s] (snow)
    show: 見せる みせる [i], 示す しめす [g] (indicate), 教える おしえる [i] (show the way)
    show off: 自慢する じまんする [s], 見せびらかす みせびらかす [g]
    show up: 現れる あらわれる [i], 顔を出す かおをだす [g] (turn up), 出席する しゅっせきする [s]
    shred: 切り刻む きりきざむ [g], 細断する さいだんする [s] (paper), ちぎる ちぎる [g] (tear into pieces)
    shrink: 縮む ちぢむ [g], 縮める ちぢめる [i], 縮小する しゅくしょうする [s]
    shudder: 身震いする みぶるいする [s], ぞっとする ぞっとする [s] (be horrified)
    shuffle: シャッフルする しゃっふるする [s], 切る きる [g] (cards), 引きずる ひきずる [g] (shuffle feet)
    shun: 避ける さける [i], 敬遠する けいえんする [s] (keep away from)
    shut: 閉める しめる [i] (a door), 閉じる とじる [i] (eyes, a book), 閉鎖する へいさする [s] (close down)
    sidestep: 回避する かいひする [s], かわす かわす [g]
    siege: 包囲する ほういする [s], 取り囲む とりかこむ [g] (surround)
    sift: 濾す こす [g] (strain or sift), 選別する せんべつする [s] (sort out)
    sigh: ため息をつく ためいきをつく [g], 嘆息する たんそくする [s]
    sign: 署名する しょめいする [s], サインする さいんする [s]
    signal: 合図する あいずする [s], 知らせる しらせる [i]
    silence: 静める しずめる [i], 封じる ふうじる [i] (suppress)
    simplify: 単純化する たんじゅんかする [s], 簡略化する かんりゃくかする [s]
    simulate: シミュレートする しみゅれーとする [s], 模擬する もぎする [s]
    sing: 歌う うたう [g]
    singe: 焦がす こがす [g], 焼く やく [g]
    sink: 沈む しずむ [g] (go down), 沈める しずめる [i] (make something sink)
    sip: 啜る すする [g]
    skate: スケートする すけーとする [s]
    sketch: スケッチする すけっちする [s], 描く えがく [g]
    skewer: 刺す さす [g], 貫く つらぬく [g]
    ski: スキーする すきーする [s]
    skim: 流し読みする ながしよみする [s] (read quickly), 掠める かすめる [i] (pass close over the surface), 掬う すくう [g] (skim off)
    skip: 飛ばす とばす [g] (skip over), 省く はぶく [g] (omit), サボる さぼる [g] (skip class or work)
    slam: 叩きつける たたきつける [i], 叩く たたく [g]
    slander: 中傷する ちゅうしょうする [s], 誹謗する ひぼうする [s]
    slap: 平手打ちする ひらてうちする [s], 引っぱたく ひっぱたく [g]
    slash: 切りつける きりつける [i], 削減する さくげんする [s] (cut costs)
    sleep: 寝る ねる [i], 眠る ねむる [g]
    slice: スライスする すらいすする [s], 切る きる [g]
    slide: 滑る すべる [g], スライドする すらいどする [s]
    slip: 滑る すべる [g], 滑り込む すべりこむ [g] (slip in), 抜け出す ぬけだす [g] (slip away)
    slither: 這う はう [g], 這い進む はいすすむ [g]
    slow: 減速する げんそくする [s], 緩める ゆるめる [i] (ease off)
    smash: 砕く くだく [g], 壊す こわす [g]
    smear: 塗る ぬる [g], 汚す よごす [g]
    smell: 匂う におう [g] (give off a smell), 嗅ぐ かぐ [g] (perceive a smell)
    smile: 微笑む ほほえむ [g], 笑う わらう [g]
    smoke: 吸う すう [g] (cigarettes), 喫煙する きつえんする [s], 燻す いぶす [g] (cure food with smoke)
    smooth: 均す ならす [g] (level out), 磨く みがく [g] (polish)
    smother: 窒息する ちっそくする [s], 覆う おおう [g] (cover over), 抑え込む おさえこむ [g] (suppress)
    smuggle: 密輸する みつゆする [s]
    snap: 折る おる [g] (break in two), 鳴らす ならす [g] (snap fingers)
    snarl: 唸る うなる [g], 怒鳴る どなる [g] (snap angrily)
    snatch: 奪う うばう [g], ひったくる ひったくる [g] (grab a bag)
    sneeze: くしゃみをする くしゃみをする [s], くしゃみする くしゃみする [s]
    sniff: 嗅ぐ かぐ [g], 嗅ぎつける かぎつける [i] (smell out)
    snooze: 居眠りする いねむりする [s], うたた寝する うたたねする [s]
    snore: いびきをかく いびきをかく [g]
    snow: 雪が降る ゆきがふる [g]
    soak: 浸す ひたす [g] (soak in liquid), 濡らす ぬらす [g] (drench)
    sob: すすり泣く すすりなく [g], 泣きじゃくる なきじゃくる [g]
    socialize: 交流する こうりゅうする [s], 付き合う つきあう [g]
    soften: 和らげる やわらげる [i], 軟化する なんかする [s]
    solicit: 求める もとめる [i] (ask for), 募る つのる [g] (recruit), 勧誘する かんゆうする [s] (canvass)
    solidify: 固める かためる [i], 固まる かたまる [g], 凝固する ぎょうこする [s]
    solve: 解決する かいけつする [s] (a problem), 解く とく [g] (a puzzle or equation)
    soothe: なだめる なだめる [i] (calm a person), 和らげる やわらげる [i] (ease pain), 癒す いやす [g]
    sort: 並べ替える ならべかえる [i] (put in order), 分類する ぶんるいする [s] (classify)
    sound: 鳴る なる [g] (make a noise), 響く ひびく [g] (resound), 聞こえる きこえる [i] (seem when heard)
    sow: 蒔く まく [g], 植える うえる [i] (plant)
    sparkle: 輝く かがやく [g], きらめく きらめく [g]
    spawn: 産卵する さんらんする [s] (lay eggs), 生み出す うみだす [g] (give rise to)
    speak: 話す はなす [g], 喋る しゃべる [g]
    specify: 指定する していする [s], 明記する めいきする [s] (state explicitly)
    speculate: 推測する すいそくする [s] (guess), 投機する とうきする [s] (in markets)
    speed: 急ぐ いそぐ [g] (hurry), 飛ばす とばす [g] (drive fast), 加速する かそくする [s]
    spell: 綴る つづる [g]
    spend: 使う つかう [g] (money), 過ごす すごす [g] (time), 費やす ついやす [g]
    spill: こぼす こぼす [g], こぼれる こぼれる [i] (spill by itself)
    spin: 回る まわる [g] (rotate), 回す まわす [g] (spin something), 紡ぐ つむぐ [g] (spin thread)
    spit: 吐く はく [g], 吐き出す はきだす [g] (spit out)
    splash: 跳ねる はねる [i] (water splashes up), 浴びせる あびせる [i] (splash on someone), 飛び散る とびちる [g] (spatter)
    splinter: 砕ける くだける [i], 裂ける さける [i]
    split: 分ける わける [i], 割る わる [g], 分割する ぶんかつする [s]
    spoil: 台無しにする だいなしにする [s] (ruin), 甘やかす あまやかす [g] (a child), 腐る くさる [g] (food)
    sponsor: 後援する こうえんする [s], 支援する しえんする [s]
    spot: 見つける みつける [i], 見かける みかける [i] (catch sight of)
    sprain: 捻挫する ねんざする [s], 挫く くじく [g]
    spray: スプレーする すぷれーする [s], 吹きかける ふきかける [i] (spray onto)
    spread: 広げる ひろげる [i], 広がる ひろがる [g], 広める ひろめる [i] (news or ideas)
    sprinkle: 振りかける ふりかける [i], 撒く まく [g] (scatter)
    spur: 促す うながす [g] (encourage), 駆り立てる かりたてる [i] (urge on), 促進する そくしんする [s]
    squander: 浪費する ろうひする [s], 無駄遣いする むだづかいする [s]
    squeal: 悲鳴を上げる ひめいをあげる [i], 金切り声を上げる かなきりごえをあげる [i]
    squeeze: 絞る しぼる [g] (juice or cloth), 握り締める にぎりしめる [i] (grip tightly)
    squint: 目を細める めをほそめる [i], 目を凝らす めをこらす [g] (strain to see)
    stab: 刺す さす [g], 突き刺す つきさす [g]
    stabilize: 安定する あんていする [s], 安定化する あんていかする [s]
    stagger: よろめく よろめく [g], ふらつく ふらつく [g], ずらす ずらす [g] (stagger schedules)
    stain: 汚す よごす [g], 染める そめる [i]
    stall: エンストする えんすとする [s] (engine), 失速する しっそくする [s] (plane or momentum), 引き延ばす ひきのばす [g] (stall for time)
    stamp: 押す おす [g] (put a stamp on), 刻印する こくいんする [s] (imprint), 踏み鳴らす ふみならす [g] (stamp one's feet)
    start: 始める はじめる [i] (begin something), 始まる はじまる [g] (begin by itself), 開始する かいしする [s]
    startle: 驚かす おどろかす [g], ぎょっとする ぎょっとする [s] (be startled)
    stash: 隠す かくす [g], しまう しまう [g] (put away)
    state: 述べる のべる [i], 明言する めいげんする [s]
    stay: 泊まる とまる [g] (overnight), 残る のこる [g] (remain), 滞在する たいざいする [s]
    steady: 支える ささえる [i], 落ち着ける おちつける [i] (calm)
    steal: 盗む ぬすむ [g]
    steer: 操縦する そうじゅうする [s], 舵を取る かじをとる [g], 導く みちびく [g] (guide)
    sterilize: 殺菌する さっきんする [s], 滅菌する めっきんする [s]
    stew: 煮込む にこむ [g], 煮る にる [i]
    stick: 貼る はる [g] (affix), くっつく くっつく [g] (adhere), 刺す さす [g] (poke into)
    stifle: 押し殺す おしころす [g] (a yawn or laugh), 抑える おさえる [i]
    stigmatize: 烙印を押す らくいんをおす [g], 差別する さべつする [s] (discriminate against)
    stimulate: 刺激する しげきする [s], 活性化する かっせいかする [s]
    sting: 刺す さす [g], 染みる しみる [i] (smart or burn)
    stink: 臭う におう [g], 悪臭を放つ あくしゅうをはなつ [g]
    stipulate: 規定する きていする [s], 定める さだめる [i]
    stir: かき混ぜる かきまぜる [i], かき回す かきまわす [g]
    stitch: 縫う ぬう [g], 縫い合わせる ぬいあわせる [i]
    stop: 止まる とまる [g] (come to a halt), 止める とめる [i] (halt something), やめる やめる [i] (stop doing something)
    store: 保管する ほかんする [s], 保存する ほぞんする [s] (save data), 蓄える たくわえる [i]
    storm: 襲撃する しゅうげきする [s], 攻め込む せめこむ [g]
    straighten: 真っ直ぐにする まっすぐにする [s], 伸ばす のばす [g], 整える ととのえる [i] (tidy up)
    strain: 濾す こす [g] (filter), 痛める いためる [i] (injure a muscle), 酷使する こくしする [s] (overwork)
    strangle: 絞め殺す しめころす [g], 首を絞める くびをしめる [i]
    strap: 縛り付ける しばりつける [i], 固定する こていする [s]
    stray: 迷う まよう [g] (get lost), 逸れる それる [i] (deviate), はぐれる はぐれる [i] (lose the group)
    strengthen: 強化する きょうかする [s], 強める つよめる [i], 鍛える きたえる [i] (train)
    stress: 強調する きょうちょうする [s], 重視する じゅうしする [s]
    stretch: 伸ばす のばす [g], 伸びる のびる [i] (become longer), ストレッチする すとれっちする [s] (do stretches)
    strew: 撒き散らす まきちらす [g], 散らす ちらす [g]
    string: 通す とおす [g] (thread beads), 連ねる つらねる [i] (string together)
    strip: 剥がす はがす [g] (peel off), 脱ぐ ぬぐ [g] (undress), 剥奪する はくだつする [s] (strip of rights)
    stroke: 撫でる なでる [i], 撫で回す なでまわす [g]
    stroll: 散歩する さんぽする [s], ぶらつく ぶらつく [g]
    struggle: 苦労する くろうする [s] (face difficulty), もがく もがく [g] (writhe), 奮闘する ふんとうする [s] (strive)
    strum: かき鳴らす かきならす [g], 弾く ひく [g]
    study: 勉強する べんきょうする [s], 学ぶ まなぶ [g], 研究する けんきゅうする [s] (research)
    stuff: 詰める つめる [i], 詰め込む つめこむ [g]
    stumble: つまずく つまずく [g], よろける よろける [i]
    stun: 唖然とさせる あぜんとさせる [i] (leave speechless), 呆然とする ぼうぜんとする [s] (be stunned), 圧倒する あっとうする [s] (overwhelm)
    subdue: 制圧する せいあつする [s] (overpower), 鎮圧する ちんあつする [s] (quell a revolt), 抑える おさえる [i] (hold down)
    submit: 提出する ていしゅつする [s] (hand in), 屈服する くっぷくする [s] (yield)
    subscribe: 購読する こうどくする [s] (a magazine), 登録する とうろくする [s] (a service or channel)
    subsidize: 補助する ほじょする [s], 助成する じょせいする [s]
    substitute: 置き換える おきかえる [i] (replace), 代用する だいようする [s] (use instead), 代わる かわる [g] (take the place of)
    subtract: 引く ひく [g], 差し引く さしひく [g]
    succeed: 成功する せいこうする [s], 継ぐ つぐ [g] (take over from)
    succumb: 屈する くっする [s], 負ける まける [i]
    suck: 吸う すう [g], しゃぶる しゃぶる [g] (suck on)
    sue: 訴える うったえる [i], 提訴する ていそする [s]
    suffer: 苦しむ くるしむ [g], 患う わずらう [g] (illness)
    suffocate: 窒息する ちっそくする [s], 息が詰まる いきがつまる [g]
    suggest: 提案する ていあんする [s], 勧める すすめる [i] (recommend), 示唆する しさする [s] (imply)
    suit: 似合う にあう [g] (look good on), 合う あう [g] (fit)
    sum: 合計する ごうけいする [s], 足す たす [g]
    summarize: 要約する ようやくする [s], まとめる まとめる [i]
    summon: 呼び出す よびだす [g], 召喚する しょうかんする [s], 召集する しょうしゅうする [s] (convene)
    supersede: 取って代わる とってかわる [g], 置き換える おきかえる [i]
    supervise: 監督する かんとくする [s], 管理する かんりする [s]
    supplement: 補う おぎなう [g], 補足する ほそくする [s]
    supply: 供給する きょうきゅうする [s], 提供する ていきょうする [s], 与える あたえる [i]
    support: 支える ささえる [i] (hold up), 支持する しじする [s] (back a view), 応援する おうえんする [s] (cheer on)
    suppose: 思う おもう [g], 仮定する かていする [s] (assume), 想定する そうていする [s]
    suppress: 抑える おさえる [i], 抑制する よくせいする [s], 抑圧する よくあつする [s] (repress)
    surf: サーフィンする さーふぃんする [s], 波乗りする なみのりする [s]
    surge: 押し寄せる おしよせる [i] (waves), 急増する きゅうぞうする [s] (numbers)
    surmise: 推測する すいそくする [s], 推察する すいさつする [s]
    surpass: 上回る うわまわる [g], 超える こえる [i], 凌ぐ しのぐ [g]
    surprise: 驚かす おどろかす [g], 驚く おどろく [g] (be surprised)
    surrender: 降伏する こうふくする [s], 降参する こうさんする [s], 引き渡す ひきわたす [g] (hand over)
    surround: 囲む かこむ [g], 取り囲む とりかこむ [g]
    survey: 調査する ちょうさする [s], 測量する そくりょうする [s] (land), 見渡す みわたす [g] (look over)
    survive: 生き残る いきのこる [g], 生き延びる いきのびる [i]
    suspect: 疑う うたがう [g], 怪しむ あやしむ [g]
    suspend: 中断する ちゅうだんする [s] (interrupt), 停止する ていしする [s] (halt), 吊るす つるす [g] (hang)
    sustain: 維持する いじする [s], 保つ たもつ [g], 負う おう [g] (an injury)
    swallow: 飲み込む のみこむ [g], 飲む のむ [g]
    swap: 交換する こうかんする [s], 取り替える とりかえる [i]
    sway: 揺れる ゆれる [i], 揺らす ゆらす [g], 左右する さゆうする [s] (influence)
    swear: 誓う ちかう [g], 罵る ののしる [g] (use bad language)
    sweat: 汗をかく あせをかく [g], 汗ばむ あせばむ [g] (get sweaty)
    sweep: 掃く はく [g], 一掃する いっそうする [s] (clear out)
    sweeten: 甘くする あまくする [s], 甘味を加える あまみをくわえる [i]
    swell: 膨らむ ふくらむ [g], 腫れる はれる [i] (injury or body part)
    swim: 泳ぐ およぐ [g]
    swindle: 騙し取る だましとる [g], 騙す だます [g]
    swing: 揺れる ゆれる [i] (sway back and forth), 振る ふる [g] (swing a bat or arm), 振り回す ふりまわす [g]
    swipe: スワイプする すわいぷする [s] (a screen), 盗む ぬすむ [g] (steal)
    switch: 切り替える きりかえる [i], 入れ替える いれかえる [i]
    symbolize: 象徴する しょうちょうする [s], 表す あらわす [g]
    sympathize: 同情する どうじょうする [s], 共感する きょうかんする [s]
    sync: 同期する どうきする [s], シンクロする しんくろする [s]
    synchronize: 同期する どうきする [s], 合わせる あわせる [i] (match up), シンクロする しんくろする [s]
    synthesize: 合成する ごうせいする [s], 総合する そうごうする [s]
    tack: 留める とめる [i] (fasten with tacks), 付け足す つけたす [g] (tack on)
    tackle: 取り組む とりくむ [g], 対処する たいしょする [s], タックルする たっくるする [s] (in sports)
    tag: タグ付けする たぐづけする [s], 印を付ける しるしをつける [i]
    tailor: 仕立てる したてる [i] (make clothes), 合わせる あわせる [i] (adapt)
    taint: 汚染する おせんする [s], 汚す よごす [g]
    take: 取る とる [g], 運ぶ はこぶ [g] (take something along), 連れる つれる [i] (take a person along)
    take care of: 世話をする せわをする [s], 面倒を見る めんどうをみる [i], 処理する しょりする [s] (handle)
    take off: 離陸する りりくする [s] (a plane), 脱ぐ ぬぐ [g] (clothes)
    take part: 参加する さんかする [s], 加わる くわわる [g]
    talk: 話す はなす [g], 喋る しゃべる [g] (chat)
    tally: 集計する しゅうけいする [s], 数える かぞえる [i]
    tame: 飼い慣らす かいならす [g], 手なずける てなずける [i]
    tamper: いじる いじる [g] (fiddle with), 改ざんする かいざんする [s] (falsify)
    tan: 日焼けする ひやけする [s], なめす なめす [g] (leather)
    tangle: 絡まる からまる [g], 絡める からめる [i], もつれる もつれる [i]
    tap: 叩く たたく [g] (knock or tap), タップする たっぷする [s] (a screen), 盗聴する とうちょうする [s] (a phone)
    tape: 録音する ろくおんする [s], 録画する ろくがする [s], テープで留める てーぷでとめる [i]
    taper: 細る ほそる [g], 尖る とがる [g] (come to a point)
    target: 狙う ねらう [g], 標的にする ひょうてきにする [s]
    tarnish: くすむ くすむ [g] (go dull), 変色する へんしょくする [s] (discolor), 傷つける きずつける [i] (a reputation)
    taste: 味わう あじわう [g], 味見する あじみする [s] (sample food)
    tattoo: 入れ墨を入れる いれずみをいれる [i], タトゥーを入れる たとぅーをいれる [i]
    taunt: 挑発する ちょうはつする [s], 嘲る あざける [g] (mock)
    tax: 課税する かぜいする [s], 課す かす [g] (impose a tax)
    teach: 教える おしえる [i], 教育する きょういくする [s]
    tear: 破る やぶる [g], 引き裂く ひきさく [g]
    tear down: 取り壊す とりこわす [g], 解体する かいたいする [s]
    tease: からかう からかう [g] (make fun of), いじめる いじめる [i] (pick on)
    telephone: 電話する でんわする [s], 電話をかける でんわをかける [i]
    tell: 言う いう [g], 伝える つたえる [i] (convey), 話す はなす [g] (a story)
    tell off: 叱る しかる [g], 説教する せっきょうする [s] (lecture)
    tempt: 誘惑する ゆうわくする [s], 誘う さそう [g]
    tend: 傾く かたむく [g] (tend to), 世話をする せわをする [s] (look after)
    tenderize: 柔らかくする やわらかくする [s]
    terminate: 終了する しゅうりょうする [s] (end), 打ち切る うちきる [g] (cut short), 解雇する かいこする [s] (dismiss)
    terrify: おどかす おどかす [g] (frighten), 怯える おびえる [i] (be terrified)
    test: テストする てすとする [s], 試す ためす [g] (try out), 検査する けんさする [s] (medical or technical)
    testify: 証言する しょうげんする [s], 供述する きょうじゅつする [s]
    tether: 繋ぐ つなぐ [g], 繋ぎ止める つなぎとめる [i]
    thank: 感謝する かんしゃする [s], 礼を言う れいをいう [g]
    thaw: 解凍する かいとうする [s] (frozen food), 溶ける とける [i] (ice or snow melts), 溶かす とかす [g] (melt something)
    thicken: とろみをつける とろみをつける [i] (a sauce), 濃くする こくする [s], 厚くする あつくする [s] (make thicker)
    thin: 痩せる やせる [i] (get thin), 薄める うすめる [i] (dilute), 間引く まびく [g] (thin out plants)
    think: 考える かんがえる [i] (ponder), 思う おもう [g] (believe)
    think about: 考える かんがえる [i], 検討する けんとうする [s] (consider)
    thread: 糸を通す いとをとおす [g], 通す とおす [g]
    threaten: 脅す おどす [g], 脅迫する きょうはくする [s]
    thrill: わくわくさせる わくわくさせる [i] (make excited), 興奮する こうふんする [s], わくわくする わくわくする [s], 感動する かんどうする [s] (be moved)
    thrive: 栄える さかえる [i], 繁盛する はんじょうする [s] (of a business), 育つ そだつ [g] (grow well)
    throb: 脈打つ みゃくうつ [g], ズキズキする ずきずきする [s] (pain), 疼く うずく [g]
    throttle: 絞め殺す しめころす [g], 絞る しぼる [g] (restrict a flow)
    throw: 投げる なげる [i], 放る ほうる [g]
    throw away: 捨てる すてる [i], 廃棄する はいきする [s]
    thrust: 突く つく [g], 突き刺す つきさす [g]
    thump: 殴る なぐる [g], 叩く たたく [g]
    thunder: 雷が鳴る かみなりがなる [g], 轟く とどろく [g]
    thwart: 阻止する そしする [s], 阻む はばむ [g]
    tick: チェックする ちぇっくする [s] (tick off), 時を刻む ときをきざむ [g] (a clock)
    tidy: 片付ける かたづける [i], 整理する せいりする [s]
    tie: 結ぶ むすぶ [g], 縛る しばる [g], 引き分ける ひきわける [i] (draw a game)
    tighten: 締める しめる [i], 引き締める ひきしめる [i]
    tilt: 傾ける かたむける [i], 傾く かたむく [g]
    time: 時間を計る じかんをはかる [g], タイミングを合わせる たいみんぐをあわせる [i]
    tingle: ピリピリする ぴりぴりする [s], ぞくぞくする ぞくぞくする [s] (with a chill or excitement), しびれる しびれる [i] (go numb)
    tint: 染める そめる [i], 着色する ちゃくしょくする [s]
    tip: 傾ける かたむける [i] (tilt), チップを渡す ちっぷをわたす [g] (give a gratuity), ひっくり返す ひっくりかえす [g] (tip over)
    tire: 疲れる つかれる [i], 飽きる あきる [i] (grow tired of)
    title: タイトルを付ける たいとるをつける [i], 題する だいする [s]
    toast: トーストする とーすとする [s] (bread), 焼く やく [g] (roast), 乾杯する かんぱいする [s] (drink a toast)
    toggle: 切り替える きりかえる [i], トグルする とぐるする [s]
    tolerate: 我慢する がまんする [s] (put up with), 許容する きょようする [s], 耐える たえる [i] (endure)
    tone: 引き締める ひきしめる [i], 鍛える きたえる [i]
    top: 上回る うわまわる [g], 勝る まさる [g]
    topple: 倒す たおす [g], 倒れる たおれる [i], 覆す くつがえす [g] (overturn)
    torment: 苦しめる くるしめる [i], 悩ます なやます [g]
    torture: 拷問する ごうもんする [s], 苦しめる くるしめる [i]
    toss: 放る ほうる [g], 放り投げる ほうりなげる [i]
    touch: 触る さわる [g], 触れる ふれる [i]
    tour: 巡る めぐる [g], 見て回る みてまわる [g], 周遊する しゅうゆうする [s]
    tow: 牽引する けんいんする [s], 引っ張る ひっぱる [g]
    trace: なぞる なぞる [g] (trace a line), 辿る たどる [g] (trace back), 突き止める つきとめる [i] (trace a source)
    track: 追跡する ついせきする [s], 追う おう [g]
    trade: 取引する とりひきする [s], 売買する ばいばいする [s], 貿易する ぼうえきする [s] (internationally)
    train: 訓練する くんれんする [s], トレーニングする とれーにんぐする [s], 鍛える きたえる [i]
    trample: 踏みつける ふみつける [i], 踏みにじる ふみにじる [g]
    transcend: 超越する ちょうえつする [s], 超える こえる [i]
    transcribe: 書き起こす かきおこす [g] (from audio), 書き写す かきうつす [g] (copy out)
    transfer: 移す うつす [g], 振り込む ふりこむ [g] (money), 転送する てんそうする [s] (data or mail)
    transform: 変える かえる [i], 変換する へんかんする [s] (convert), 変身する へんしんする [s]
    translate: 翻訳する ほんやくする [s], 訳す やくす [g], 通訳する つうやくする [s] (interpret orally)
    transmit: 送信する そうしんする [s], 伝える つたえる [i]
    transpire: 起こる おこる [g] (happen), 判明する はんめいする [s] (become known), 蒸散する じょうさんする [s] (plants)
    transplant: 移植する いしょくする [s], 植え替える うえかえる [i] (repot)
    transport: 運ぶ はこぶ [g], 輸送する ゆそうする [s]
    trap: 捕まえる つかまえる [i] (catch), 閉じ込める とじこめる [i] (confine), 罠にかける わなにかける [i] (ensnare)
    travel: 旅行する りょこうする [s], 旅をする たびをする [s]
    traverse: 横断する おうだんする [s], 横切る よこぎる [g], 渡る わたる [g]
    tread: 踏む ふむ [g], 踏みしめる ふみしめる [i] (tread firmly)
    treasure: 大切にする たいせつにする [s], 大事にする だいじにする [s]
    treat: 扱う あつかう [g] (handle), 治療する ちりょうする [s] (medically), おごる おごる [g] (treat to a meal)
    tremble: 震える ふるえる [i], 身震いする みぶるいする [s] (shudder)
    trick: 騙す だます [g], 欺く あざむく [g], 引っかける ひっかける [i] (catch with a trick)
    trickle: 滴る したたる [g], 染み出す しみだす [g] (seep out)
    trigger: 引き起こす ひきおこす [g], 誘発する ゆうはつする [s]
    trim: 刈る かる [g] (hedge or hair), 切り揃える きりそろえる [i], 削減する さくげんする [s] (cut costs)
    trip: つまずく つまずく [g], 転ぶ ころぶ [g] (fall down)
    triple: 三倍にする さんばいにする [s], 三倍に増える さんばいにふえる [i]
    trivialize: 軽視する けいしする [s], 矮小化する わいしょうかする [s]
    trot: 小走りする こばしりする [s], 駆ける かける [i]
    trouble: 迷惑をかける めいわくをかける [i], 悩ます なやます [g]
    truncate: 切り捨てる きりすてる [i], 切り詰める きりつめる [i]
    trust: 信頼する しんらいする [s], 信用する しんようする [s], 信じる しんじる [i]
    try: 試みる こころみる [i] (attempt), 試す ためす [g] (try out), やってみる やってみる [i] (give it a try)
    try on: 試着する しちゃくする [s], 着てみる きてみる [i]
    tuck: 押し込む おしこむ [g], 挟み込む はさみこむ [g]
    tumble: 転ぶ ころぶ [g], 転げ落ちる ころげおちる [i], 急落する きゅうらくする [s] (prices)
    tune: チューニングする ちゅーにんぐする [s], 調律する ちょうりつする [s] (a piano), 調整する ちょうせいする [s] (adjust)
    tunnel: トンネルを掘る とんねるをほる [g], 掘り進む ほりすすむ [g]
    turn: 回す まわす [g] (turn something), 曲がる まがる [g] (turn a corner), 回る まわる [g] (rotate)
    turn around: 振り向く ふりむく [g], 向きを変える むきをかえる [i], 引き返す ひきかえす [g] (go back)
    turn down: 断る ことわる [g] (reject), 下げる さげる [i] (volume)
    turn into: 変わる かわる [g], 変える かえる [i]
    turn off: 消す けす [g] (lights or TV), 切る きる [g] (power)
    turn on: 点ける つける [i] (a light or TV), 入れる いれる [i] (a switch or power)
    turn up: 上げる あげる [i] (volume), 現れる あらわれる [i] (show up)
    tweet: ツイートする ついーとする [s], つぶやく つぶやく [g], さえずる さえずる [g] (of birds)
    twinkle: 瞬く またたく [g], きらめく きらめく [g]
    twirl: くるくる回す くるくるまわす [g], くるくる回る くるくるまわる [g]
    type: 入力する にゅうりょくする [s], タイプする たいぷする [s], 打ち込む うちこむ [g]
    umpire: 審判をする しんぱんをする [s], 判定する はんていする [s]
    unbutton: ボタンを外す ぼたんをはずす [g], 外す はずす [g]
    uncover: 明らかにする あきらかにする [s] (reveal), 暴く あばく [g] (expose), 発見する はっけんする [s]
    underestimate: 過小評価する かしょうひょうかする [s], 甘く見る あまくみる [i], 見くびる みくびる [g]
    undergo: 受ける うける [i], 経験する けいけんする [s]
    underline: 下線を引く かせんをひく [g], 強調する きょうちょうする [s] (emphasize)
    undermine: 損なう そこなう [g] (damage), 蝕む むしばむ [g] (erode), 弱体化する じゃくたいかする [s] (weaken)
    underpin: 支える ささえる [i], 裏付ける うらづける [i] (back up)
    understand: 分かる わかる [g], 理解する りかいする [s]
    understate: 控えめに言う ひかえめにいう [g], 過小申告する かしょうしんこくする [s] (underreport)
    undertake: 引き受ける ひきうける [i] (take on), 着手する ちゃくしゅする [s] (set about), 乗り出す のりだす [g] (embark on)
    underwrite: 引き受ける ひきうける [i] (insurance or securities), 保証する ほしょうする [s] (guarantee), 出資する しゅっしする [s] (fund)
    undo: 元に戻す もとにもどす [g] (revert), 取り消す とりけす [g] (cancel), 解く とく [g] (untie)
    undress: 服を脱ぐ ふくをぬぐ [g], 脱がす ぬがす [g] (undress someone)
    unearth: 掘り出す ほりだす [g], 発掘する はっくつする [s]
    unfasten: 外す はずす [g], 解く とく [g] (untie)
    unfold: 広げる ひろげる [i], 展開する てんかいする [s] (develop)
    unfurl: 広げる ひろげる [i], 開く ひらく [g]
    unhook: 外す はずす [g], 取り外す とりはずす [g]
    unify: 統一する とういつする [s], 統合する とうごうする [s]
    uninstall: アンインストールする あんいんすとーるする [s], 削除する さくじょする [s] (delete)
    unite: 団結する だんけつする [s] (band together), 結びつける むすびつける [i] (join), 結合する けつごうする [s]
    unleash: 解き放つ ときはなつ [g], 引き起こす ひきおこす [g] (provoke)
    unload: 降ろす おろす [g], 荷下ろしする におろしする [s]
    unmask: 正体を暴く しょうたいをあばく [g], 見破る みやぶる [g] (see through)
    unpack: 荷ほどきする にほどきする [s], 荷物を解く にもつをとく [g]
    unplug: コンセントを抜く こんせんとをぬく [g], プラグを抜く ぷらぐをぬく [g]
    unravel: ほどく ほどく [g], 解き明かす ときあかす [g] (solve a mystery), ほつれる ほつれる [i] (fray)
    unroll: 広げる ひろげる [i], 伸ばす のばす [g]
    unscrew: ねじを外す ねじをはずす [g], ねじを緩める ねじをゆるめる [i] (loosen)
    unsettle: 不安にする ふあんにする [s], 乱す みだす [g] (disturb)
    untie: 解く とく [g], ほどく ほどく [g]
    unveil: 発表する はっぴょうする [s] (announce), 公開する こうかいする [s], 除幕する じょまくする [s] (a monument)
    unwrap: 包みを開ける つつみをあける [i], 開封する かいふうする [s]
    unzip: 解凍する かいとうする [s] (files), ファスナーを開ける ふぁすなーをあける [i] (a zipper)
    update: 更新する こうしんする [s], アップデートする あっぷでーとする [s]
    upgrade: アップグレードする あっぷぐれーどする [s], 改良する かいりょうする [s] (improve a product), 格上げする かくあげする [s] (raise in rank)
    uphold: 守る まもる [g] (a law or value), 支持する しじする [s] (a decision), 擁護する ようごする [s] (defend)
    uplift: 持ち上げる もちあげる [i] (lift up), 元気づける げんきづける [i] (lift spirits), 引き上げる ひきあげる [i] (raise standards)
    upload: アップロードする あっぷろーどする [s], 送信する そうしんする [s]
    uproot: 引き抜く ひきぬく [g], 根絶する こんぜつする [s] (eradicate)
    upset: 動揺させる どうようさせる [i] (make upset), 動揺する どうようする [s] (be upset), 乱す みだす [g] (disrupt), ひっくり返す ひっくりかえす [g] (overturn)
    urge: 促す うながす [g], 急かす せかす [g] (hurry along)
    use: 使う つかう [g], 利用する りようする [s], 用いる もちいる [i]
    usher: 案内する あんないする [s], 導く みちびく [g]
    usurp: 奪う うばう [g], 乗っ取る のっとる [g], 横取りする よこどりする [s]
    utilize: 利用する りようする [s], 活用する かつようする [s]
    utter: 発する はっする [s], 口に出す くちにだす [g] (say aloud)
    vaccinate: 予防接種する よぼうせっしゅする [s], 接種する せっしゅする [s], ワクチンを打つ わくちんをうつ [g]
    vacuum: 掃除機をかける そうじきをかける [i], 吸い取る すいとる [g]
    validate: 検証する けんしょうする [s], 承認する しょうにんする [s] (approve), 認める みとめる [i] (acknowledge as valid)
    value: 大切にする たいせつにする [s] (cherish), 評価する ひょうかする [s] (appraise), 尊重する そんちょうする [s] (hold in esteem)
    vandalize: 破壊する はかいする [s], 荒らす あらす [g]
    vanish: 消える きえる [i], 消え去る きえさる [g], 姿を消す すがたをけす [g]
    vaporize: 蒸発する じょうはつする [s], 気化する きかする [s]
    varnish: ニスを塗る にすをぬる [g], 塗る ぬる [g]
    vary: 異なる ことなる [g] (differ), 変わる かわる [g] (change), 変動する へんどうする [s] (fluctuate)
    veer: 逸れる それる [i], 進路を変える しんろをかえる [i]
    vent: 発散する はっさんする [s] (emotions), ぶちまける ぶちまける [i] (pour out feelings), 排出する はいしゅつする [s] (gas)
    ventilate: 換気する かんきする [s], 空気を入れ替える くうきをいれかえる [i]
    venture: 冒険する ぼうけんする [s], 賭ける かける [i] (risk), 思い切って言う おもいきっていう [g] (venture an opinion)
    verify: 確認する かくにんする [s], 確かめる たしかめる [i], 検証する けんしょうする [s]
    veto: 拒否権を行使する きょひけんをこうしする [s], 拒否する きょひする [s], 却下する きゃっかする [s]
    vex: 悩ます なやます [g], 苛立つ いらだつ [g] (get irritated)
    vibrate: 振動する しんどうする [s], 震える ふるえる [i]
    victimize: 食い物にする くいものにする [s] (prey on), 虐げる しいたげる [i] (oppress), いじめる いじめる [i] (bully)
    videotape: 録画する ろくがする [s], ビデオに撮る びでおにとる [g], 撮影する さつえいする [s]
    vie: 競う きそう [g], 争う あらそう [g]
    view: 見る みる [i], 眺める ながめる [i] (a scene), 閲覧する えつらんする [s] (a document or web page)
    vilify: 罵る ののしる [g] (revile), けなす けなす [g] (disparage), 貶める おとしめる [i] (defame)
    vindicate: 潔白を証明する けっぱくをしょうめいする [s] (clear of blame), 正当化する せいとうかする [s] (prove right)
    violate: 違反する いはんする [s] (a rule), 侵害する しんがいする [s] (rights), 破る やぶる [g] (a promise)
    visit: 訪ねる たずねる [i] (a person), 訪れる おとずれる [i] (a place), 訪問する ほうもんする [s]
    visualize: 思い描く おもいえがく [g] (picture mentally), 可視化する かしかする [s] (make visible), イメージする いめーじする [s]
    vocalize: 発声する はっせいする [s], 声に出す こえにだす [g] (say aloud)
    void: 無効にする むこうにする [s], 取り消す とりけす [g]
    vomit: 吐く はく [g], 嘔吐する おうとする [s]
    vote: 投票する とうひょうする [s], 票を入れる ひょうをいれる [i]
    vouch: 保証する ほしょうする [s], 請け合う うけあう [g] (assure)
    vow: 誓う ちかう [g], 約束する やくそくする [s]
    voyage: 航海する こうかいする [s], 渡航する とこうする [s] (travel abroad)
    wade: 歩いて渡る あるいてわたる [g], 水の中を歩く みずのなかをあるく [g]
    wag: 振る ふる [g], 揺らす ゆらす [g]
    wail: 泣き叫ぶ なきさけぶ [g], 嘆く なげく [g] (lament), 鳴り響く なりひびく [g] (of a siren)
    wait: 待つ まつ [g], 待機する たいきする [s] (stand by)
    wait for: 待つ まつ [g], 待ち受ける まちうける [i] (lie in wait for)
    wait on: 給仕する きゅうじする [s] (serve at table), 接客する せっきゃくする [s] (serve customers), 仕える つかえる [i] (serve a master)
    waive: 放棄する ほうきする [s] (a right), 免除する めんじょする [s] (a fee)
    wake: 目覚める めざめる [i], 起こす おこす [g] (wake someone), 起きる おきる [i]
    wake up: 起きる おきる [i], 目が覚める めがさめる [i], 起こす おこす [g] (wake someone)
    walk: 歩く あるく [g], 散歩する さんぽする [s] (go for a walk)
    wall: 壁で囲む かべでかこむ [g], 囲う かこう [g]
    waltz: ワルツを踊る わるつをおどる [g], 踊る おどる [g]
    wander: さまよう さまよう [g], うろつく うろつく [g] (loiter), 歩き回る あるきまわる [g]
    wane: 衰える おとろえる [i] (decline), 薄れる うすれる [i] (fade), 欠ける かける [i] (the moon)
    want: 欲しがる ほしがる [g], 望む のぞむ [g], 求める もとめる [i] (seek)
    ward off: 追い払う おいはらう [g] (drive away), 防ぐ ふせぐ [g] (prevent), 避ける さける [i] (avoid)
    warm: 温める あたためる [i] (food or the body), 暖める あたためる [i] (a room), 温まる あたたまる [g] (get warm)
    warm up: 温め直す あたためなおす [g] (reheat food), ウォーミングアップする うぉーみんぐあっぷする [s] (before exercise), 温まる あたたまる [g] (get warm)
    warn: 警告する けいこくする [s] (of danger), 注意する ちゅういする [s] (caution), 忠告する ちゅうこくする [s] (advise against)
    warp: 反る そる [g] (wood), 歪む ゆがむ [g], 歪める ゆがめる [i]
    warrant: 正当化する せいとうかする [s] (justify), 値する あたいする [s] (merit), 保証する ほしょうする [s] (guarantee)
    wash: 洗う あらう [g], 洗濯する せんたくする [s] (laundry)
    waste: 無駄にする むだにする [s], 浪費する ろうひする [s]
    watch: 見る みる [i] (look at; also TV or movies), 見張る みはる [g] (keep watch), 見守る みまもる [g] (watch over)
    water: 水をやる みずをやる [g] (plants), 水を撒く みずをまく [g] (sprinkle water)
    wave: 手を振る てをふる [g] (wave a hand), 波打つ なみうつ [g] (billow), なびく なびく [g] (flutter in the wind)
    waver: ためらう ためらう [g] (hesitate), 迷う まよう [g] (be undecided), 揺らぐ ゆらぐ [g] (falter)
    weaken: 弱める よわめる [i], 弱まる よわまる [g]
    wean: 離乳する りにゅうする [s], 乳離れする ちちばなれする [s], 断つ たつ [g] (give up a habit)
    wear: 着る きる [i] (clothes), 履く はく [g] (shoes), 被る かぶる [g] (a hat)
    weave: 織る おる [g], 編む あむ [g]
    wed: 結婚する けっこんする [s], 嫁ぐ とつぐ [g] (of a bride), 娶る めとる [g] (of a groom)
    weep: 泣く なく [g], 涙を流す なみだをながす [g], 号泣する ごうきゅうする [s] (sob loudly)
    weigh: 量る はかる [g] (measure weight), 検討する けんとうする [s] (weigh options), 天秤にかける てんびんにかける [i] (weigh one against another)
    weigh down: のしかかる のしかかる [g], 負担をかける ふたんをかける [i]
    welcome: 歓迎する かんげいする [s], 迎える むかえる [i], 迎え入れる むかえいれる [i]
    weld: 溶接する ようせつする [s], 接合する せつごうする [s] (join)
    whack: 殴る なぐる [g], ぶっ叩く ぶったたく [g]
    whip: 鞭打つ むちうつ [g] (lash), 泡立てる あわだてる [i] (cream or eggs)
    whisper: ささやく ささやく [g], 耳打ちする みみうちする [s] (whisper in someone's ear)
    whistle: 口笛を吹く くちぶえをふく [g], 笛を吹く ふえをふく [g]
    whiten: 白くする しろくする [s], 漂白する ひょうはくする [s] (bleach)
    whittle: 削る けずる [g], 彫る ほる [g]
    widen: 広げる ひろげる [i] (make wider), 広がる ひろがる [g] (become wider), 拡張する かくちょうする [s] (expand)
    wield: 振るう ふるう [g], 操る あやつる [g]
    wiggle: 動かす うごかす [g], 揺らす ゆらす [g], もぞもぞする もぞもぞする [s] (fidget)
    win: 勝つ かつ [g], 勝ち取る かちとる [g] (win through effort), 優勝する ゆうしょうする [s] (win a championship)
    win over: 説得する せっとくする [s], 味方につける みかたにつける [i]
    wind: 巻く まく [g] (wind thread), 曲がりくねる まがりくねる [g] (meander), 蛇行する だこうする [s] (of a river)
    wink: ウインクする ういんくする [s], 目配せする めくばせする [s] (signal with the eyes)
    wipe: 拭く ふく [g], 拭き取る ふきとる [g] (wipe off), 拭う ぬぐう [g] (wipe away tears)
    wish: 願う ねがう [g], 望む のぞむ [g], 祈る いのる [g] (wish for luck)
    withdraw: 引き出す ひきだす [g] (money), 撤退する てったいする [s] (troops), 撤回する てっかいする [s] (a statement)
    wither: 枯れる かれる [i] (plants die), しおれる しおれる [i] (droop), しぼむ しぼむ [g] (shrivel)
    withstand: 耐える たえる [i], 持ちこたえる もちこたえる [i]
    witness: 目撃する もくげきする [s], 立ち会う たちあう [g] (be present as a witness)
    wobble: ぐらつく ぐらつく [g], ふらつく ふらつく [g]
    word: 表現する ひょうげんする [s], 言い表す いいあらわす [g] (put into words), 言葉を選ぶ ことばをえらぶ [g] (choose one's wording)
    work: 働く はたらく [g], 動く うごく [g] (machines), 機能する きのうする [s] (machines or systems)
    work out: 運動する うんどうする [s] (exercise), 解決する かいけつする [s] (sort out), 割り出す わりだす [g] (calculate)
    worry: 心配する しんぱいする [s], 悩む なやむ [g], 気にする きにする [s]
    worsen: 悪化する あっかする [s], 悪くなる わるくなる [g]
    worship: 崇拝する すうはいする [s], 崇める あがめる [i] (revere), 拝む おがむ [g] (pray before)
    wound: 傷つける きずつける [i], 負傷する ふしょうする [s] (be wounded)
    wrap: 包む つつむ [g], 包装する ほうそうする [s] (gift wrap), 巻きつける まきつける [i] (wrap around)
    wreck: 壊す こわす [g], 台無しにする だいなしにする [s] (ruin), 難破する なんぱする [s] (a ship)
    wrench: 捻る ひねる [g] (twist), もぎ取る もぎとる [g] (wrest away), 引き抜く ひきぬく [g] (pull out)
    wrestle: レスリングをする れすりんぐをする [s], 取っ組み合う とっくみあう [g] (grapple), 格闘する かくとうする [s]
    wring: 絞る しぼる [g], ねじる ねじる [g]
    write: 書く かく [g], 執筆する しっぴつする [s] (write professionally)
    write down: 書き留める かきとめる [i], メモする めもする [s], 書き取る かきとる [g] (take down dictation)
    write off: 帳消しにする ちょうけしにする [s] (cancel a debt), 償却する しょうきゃくする [s] (amortize), 見切りをつける みきりをつける [i] (give up on)
    x-ray: レントゲンを撮る れんとげんをとる [g], レントゲン撮影する れんとげんさつえいする [s]
    yank: 引っ張る ひっぱる [g], 引っこ抜く ひっこぬく [g] (pull out)
    yawn: あくびをする あくびをする [s], あくびする あくびする [s]
    yearn: 憧れる あこがれる [i], 切望する せつぼうする [s], 慕う したう [g]
    yell: 叫ぶ さけぶ [g], 怒鳴る どなる [g] (shout angrily), 大声を出す おおごえをだす [g]
    yelp: キャンと鳴く きゃんとなく [g] (of a dog), 悲鳴を上げる ひめいをあげる [i]
    yield: 譲る ゆずる [g] (give way), 譲歩する じょうほする [s] (concede), 生み出す うみだす [g] (produce)
    yoke: くびきでつなぐ くびきでつなぐ [g], 結びつける むすびつける [i]
    zap: 消す けす [g] (wipe out), 撃つ うつ [g] (blast)
    zip: 圧縮する あっしゅくする [s] (files), ファスナーを閉める ふぁすなーをしめる [i] (a zipper)
    zone: ゾーニングする ぞーにんぐする [s], 区域に分ける くいきにわける [i], 区画する くかくする [s]
    zoom: ズームする ずーむする [s], 拡大する かくだいする [s] (zoom in), 疾走する しっそうする [s] (speed along)
  `;

  // "know: 知る しる [g] (facts)" -> { know: [{ ja, rd, tag, note }, ...] }
  function readEntry(entry, english) {
    const match = entry.match(/^([぀-ヿ一-鿿々〆ヶー]+)\s+([ぁ-ゖー]+)\s*\[([gisk])\]\s*(?:\((.*)\))?$/);
    if (!match) throw new Error(`verbs.js: cannot read "${entry}" in "${english}"`);
    const [, ja, rd, tag, note] = match;
    return { ja, rd, tag, ...(note ? { note } : {}) };
  }

  const VERBS = parseTable(TABLE, readEntry);

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
