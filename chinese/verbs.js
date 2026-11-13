/*
 * English -> Traditional Chinese (Mandarin, Taiwan) verb database.
 *
 * One line per English verb:
 *   english: 說 shuō, 睡|覺 shuì jiào, 喜歡 xǐ huān [s] (usage note)
 *
 * Each translation is the characters, then one pinyin syllable per character.
 * "|" marks where a verb-object compound splits (睡|覺), because particles go
 * inside it (睡過覺). A tag in brackets after the pinyin sets how the verb takes
 * the patterns: [s] state verb, [a] instant verb, [m] modal verb; no tag means an
 * ordinary action verb. The first translation of each line is the default.
 */
(function (global) {
  'use strict';

  const { parseTable, plainEntry } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: 放棄 fàng qì, 拋棄 pāo qì
    abort: 中止 zhōng zhǐ, 終止 zhōng zhǐ
    absorb: 吸收 xī shōu
    abuse: 虐待 nüè dài, 濫用 làn yòng
    accelerate: 加速 jiā sù
    accept: 接受 jiē shòu
    accompany: 陪伴 péi bàn, 陪 péi
    accomplish: 完成 wán chéng, 達成 dá chéng
    accumulate: 累積 lěi jī, 積累 jī lěi
    accuse: 指控 zhǐ kòng, 控告 kòng gào
    achieve: 實現 shí xiàn, 達到 dá dào, 取得 qǔ dé
    acknowledge: 承認 chéng rèn
    acquire: 獲得 huò dé, 取得 qǔ dé
    acquit: 開釋 kāi shì
    act: 表演 biǎo yǎn, 行動 xíng dòng, 演 yǎn
    adapt: 適應 shì yìng, 改編 gǎi biān
    add: 增加 zēng jiā, 添加 tiān jiā, 加 jiā
    adhere: 黏附 nián fù, 遵守 zūn shǒu (adhere to rules)
    adjust: 調整 tiáo zhěng
    administer: 管理 guǎn lǐ, 施行 shī xíng
    admire: 欣賞 xīn shǎng, 佩服 pèi fú
    admit: 承認 chéng rèn, 接納 jiē nà
    adopt: 採用 cǎi yòng, 收養 shōu yǎng (a child)
    adore: 崇拜 chóng bài, 熱愛 rè ài [s]
    advance: 前進 qián jìn, 推進 tuī jìn
    advertise: 宣傳 xuān chuán, 打|廣告 dǎ guǎng gào
    advise: 建議 jiàn yì, 勸告 quàn gào
    advocate: 提倡 tí chàng, 主張 zhǔ zhāng
    affect: 影響 yǐng xiǎng
    age: 變老 biàn lǎo, 老化 lǎo huà
    agitate: 攪動 jiǎo dòng, 煽動 shān dòng
    agree: 同意 tóng yì, 贊成 zàn chéng
    aim: 瞄準 miáo zhǔn, 針對 zhēn duì
    alert: 警告 jǐng gào, 提醒 tí xǐng
    align: 對齊 duì qí, 校準 jiào zhǔn
    allocate: 分配 fēn pèi, 撥 bō
    allow: 允許 yǔn xǔ, 讓 ràng, 准許 zhǔn xǔ
    alter: 改變 gǎi biàn, 更改 gēng gǎi
    amaze: 震驚 zhèn jīng, 驚嘆 jīng tàn
    amend: 修改 xiū gǎi, 修正 xiū zhèng
    amuse: 逗樂 dòu lè, 娛樂 yú lè
    analyze: 分析 fēn xī
    anger: 激怒 jī nù, 惹怒 rě nù
    announce: 宣布 xuān bù, 公布 gōng bù
    annoy: 打擾 dǎ rǎo, 惹惱 rě nǎo
    answer: 回答 huí dá, 回覆 huí fù
    anticipate: 預期 yù qí, 預料 yù liào
    appeal: 上訴 shàng sù, 呼籲 hū yù
    appear: 出現 chū xiàn [a]
    applaud: 鼓|掌 gǔ zhǎng, 讚賞 zàn shǎng
    apply: 申請 shēn qǐng (apply for), 應用 yìng yòng (use), 套用 tào yòng
    appoint: 任命 rèn mìng, 指派 zhǐ pài
    appreciate: 感激 gǎn jī, 欣賞 xīn shǎng
    approach: 接近 jiē jìn, 靠近 kào jìn
    approve: 批准 pī zhǔn, 贊成 zàn chéng
    argue: 爭論 zhēng lùn, 吵|架 chǎo jià
    arise: 出現 chū xiàn [a], 產生 chǎn shēng
    arrange: 安排 ān pái, 整理 zhěng lǐ
    arrest: 逮捕 dài bǔ, 拘留 jū liú
    arrive: 到達 dào dá [a], 抵達 dǐ dá [a], 到 dào [a]
    articulate: 表達 biǎo dá, 發|音 fā yīn
    ascend: 上升 shàng shēng, 攀登 pān dēng
    ask: 問 wèn (a question), 要求 yāo qiú (for something)
    ask for: 要求 yāo qiú, 請求 qǐng qiú
    aspire: 渴望 kě wàng [s], 立志 lì zhì
    assemble: 組裝 zǔ zhuāng, 集合 jí hé
    assert: 主張 zhǔ zhāng, 斷言 duàn yán
    assess: 評估 píng gū
    assign: 指派 zhǐ pài, 分派 fēn pài
    assimilate: 同化 tóng huà, 吸收 xī shōu
    assist: 協助 xié zhù, 幫助 bāng zhù
    associate: 聯想 lián xiǎng, 交往 jiāo wǎng
    assume: 假設 jiǎ shè, 假定 jiǎ dìng
    assure: 保證 bǎo zhèng, 確保 què bǎo
    astonish: 震驚 zhèn jīng
    attach: 附上 fù shàng, 附加 fù jiā
    attack: 攻擊 gōng jī, 襲擊 xí jī
    attain: 達到 dá dào, 獲得 huò dé
    attempt: 嘗試 cháng shì, 企圖 qǐ tú
    attend: 出席 chū xí (an event), 參加 cān jiā, 照顧 zhào gù (take care of)
    attract: 吸引 xī yǐn
    attribute: 歸因 guī yīn
    audit: 審計 shěn jì, 稽核 jī hé
    authorize: 授權 shòu quán
    avoid: 避免 bì miǎn, 躲避 duǒ bì
    award: 頒發 bān fā, 授予 shòu yǔ
    back up: 備份 bèi fèn, 支持 zhī chí
    bake: 烤 kǎo, 烘焙 hōng bèi
    balance: 平衡 píng héng
    ban: 禁止 jìn zhǐ
    bandage: 包紮 bāo zā
    bang: 敲 qiāo, 敲打 qiāo dǎ, 撞擊 zhuàng jī
    baptize: 施洗 shī xǐ
    bargain: 殺|價 shā jià
    bark: 吠 fèi, 吠叫 fèi jiào
    base: 基於 jī yú [s], 依據 yī jù
    bathe: 洗|澡 xǐ zǎo, 沐浴 mù yù
    battle: 戰鬥 zhàn dòu, 搏鬥 bó dòu
    be: 是 shì (identity, traits), 在 zài (location)
    bear: 忍受 rěn shòu, 承受 chéng shòu, 承擔 chéng dān
    beat: 打敗 dǎ bài, 打 dǎ (hit), 攪拌 jiǎo bàn (eggs)
    beautify: 美化 měi huà
    beg: 乞討 qǐ tǎo, 懇求 kěn qiú
    begin: 開始 kāi shǐ
    belch: 打|嗝 dǎ gé
    believe: 相信 xiāng xìn [s], 認為 rèn wéi [s]
    belong: 屬於 shǔ yú [s]
    bend: 彎 wān, 彎曲 wān qū
    bet: 打|賭 dǎ dǔ, 下|注 xià zhù
    bid: 出|價 chū jià, 投|標 tóu biāo
    bill: 收|費 shōu fèi
    bind: 綁 bǎng, 捆綁 kǔn bǎng
    bite: 咬 yǎo
    blackmail: 勒索 lè suǒ, 敲詐 qiāo zhà
    blame: 責怪 zé guài, 怪 guài
    bleach: 漂白 piǎo bái
    bleed: 流|血 liú xiě
    blend: 混合 hùn hé, 攪拌 jiǎo bàn
    bless: 祝福 zhù fú
    blink: 眨|眼 zhǎ yǎn, 眨 zhǎ
    block: 阻擋 zǔ dǎng, 封鎖 fēng suǒ
    bloom: 開|花 kāi huā
    blossom: 開|花 kāi huā, 繁榮 fán róng
    blow: 吹 chuī
    blur: 模糊 mó hú
    board: 登機 dēng jī, 上|車 shàng chē
    boast: 吹|牛 chuī niú, 誇耀 kuā yào
    boil: 煮沸 zhǔ fèi, 煮 zhǔ, 沸騰 fèi téng
    bond: 結合 jié hé, 黏合 nián hé
    book: 預訂 yù dìng, 訂 dìng
    boost: 提升 tí shēng, 促進 cù jìn
    bore: 煩 fán, 鑽|孔 zuān kǒng (to drill)
    bother: 打擾 dǎ rǎo, 麻煩 má fán
    bounce: 彈跳 tán tiào, 反彈 fǎn tán
    bow: 鞠|躬 jū gōng
    boycott: 抵制 dǐ zhì
    brag: 吹噓 chuī xū, 炫耀 xuàn yào
    brake: 煞|車 shā chē, 剎|車 shā chē
    break: 打破 dǎ pò, 弄壞 nòng huài, 折斷 zhé duàn
    breathe: 呼吸 hū xī
    brew: 釀 niàng, 沖泡 chōng pào
    bribe: 賄賂 huì lù
    bring: 帶來 dài lái (bring here), 帶去 dài qù (take there)
    bring up: 養育 yǎng yù (children), 提起 tí qǐ (a topic)
    broadcast: 廣播 guǎng bō, 播放 bō fàng
    broaden: 拓寬 tuò kuān, 擴大 kuò dà
    browse: 瀏覽 liú lǎn
    bruise: 撞傷 zhuàng shāng, 挫傷 cuò shāng
    brush: 刷 shuā, 梳 shū
    bubble: 冒|泡 mào pào, 起|泡 qǐ pào
    buckle: 扣 kòu, 繫緊 jì jǐn
    build: 建造 jiàn zào, 蓋 gài, 建 jiàn
    bully: 欺負 qī fù, 霸凌 bà líng
    burden: 拖累 tuō lěi
    burn: 燒 shāo, 燃燒 rán shāo, 燒傷 shāo shāng
    burst: 爆裂 bào liè, 破裂 pò liè, 爆炸 bào zhà
    bury: 埋 mái, 埋葬 mái zàng
    buy: 買 mǎi
    buzz: 嗡嗡叫 wēng wēng jiào
    cage: 囚禁 qiú jìn
    calculate: 計算 jì suàn
    call: 打|電話 dǎ diàn huà (phone), 叫 jiào (summon, shout), 稱呼 chēng hū
    calm: 安撫 ān fǔ, 鎮定 zhèn dìng
    camp: 露|營 lù yíng
    can: 能 néng [m], 會 huì [m], 可以 kě yǐ [m]
    cancel: 取消 qǔ xiāo
    capture: 捕獲 bǔ huò, 俘虜 fú lǔ, 捕捉 bǔ zhuō
    care: 關心 guān xīn, 在乎 zài hū [s], 照顧 zhào gù
    caress: 撫摸 fǔ mō, 愛撫 ài fǔ
    carry: 攜帶 xié dài, 搬 bān, 扛 káng
    carry out: 執行 zhí xíng, 實施 shí shī
    carve: 雕刻 diāo kè, 切 qiē
    cash: 兌現 duì xiàn
    cast: 投擲 tóu zhì, 拋 pāo, 鑄造 zhù zào
    catch: 抓 zhuā, 接住 jiē zhù, 趕上 gǎn shàng (a bus)
    categorize: 分|類 fēn lèi
    cause: 引起 yǐn qǐ, 導致 dǎo zhì
    cease: 停止 tíng zhǐ
    celebrate: 慶祝 qìng zhù
    chain: 拴 shuān, 鎖住 suǒ zhù
    challenge: 挑戰 tiǎo zhàn
    change: 改變 gǎi biàn, 換 huàn
    chant: 唱誦 chàng sòng, 吟誦 yín sòng
    charge: 收|費 shōu fèi, 充|電 chōng diàn (a battery), 指控 zhǐ kòng
    charm: 迷住 mí zhù, 吸引 xī yǐn
    chase: 追 zhuī, 追趕 zhuī gǎn
    chat: 聊|天 liáo tiān, 閒聊 xián liáo
    chatter: 嘮叨 láo dāo, 閒聊 xián liáo
    cheat: 欺騙 qī piàn, 作|弊 zuò bì
    check: 檢查 jiǎn chá, 核對 hé duì
    cheer: 歡呼 huān hū, 加|油 jiā yóu
    cherish: 珍惜 zhēn xī, 珍愛 zhēn ài
    chew: 咀嚼 jǔ jué, 嚼 jiáo
    chill: 冷卻 lěng què, 冰鎮 bīng zhèn
    choke: 噎住 yē zhù, 窒息 zhì xí
    choose: 選擇 xuǎn zé, 挑選 tiāo xuǎn
    chop: 砍 kǎn, 剁 duò, 切碎 qiē suì
    circle: 圈 quān, 環繞 huán rào, 繞 rào
    circulate: 循環 xún huán, 流通 liú tōng
    cite: 引用 yǐn yòng
    claim: 聲稱 shēng chēng, 索賠 suǒ péi, 主張 zhǔ zhāng
    clap: 拍|手 pāi shǒu, 鼓|掌 gǔ zhǎng
    clarify: 澄清 chéng qīng, 闡明 chǎn míng
    clash: 衝突 chōng tū, 碰撞 pèng zhuàng
    clasp: 抓緊 zhuā jǐn, 握緊 wò jǐn
    classify: 分|類 fēn lèi, 歸|類 guī lèi
    clean: 打掃 dǎ sǎo, 清潔 qīng jié, 擦 cā
    clean up: 整理 zhěng lǐ, 清理 qīng lǐ
    cleanse: 清潔 qīng jié, 淨化 jìng huà
    clear: 清除 qīng chú, 清理 qīng lǐ
    clench: 握緊 wò jǐn, 咬緊 yǎo jǐn
    click: 點擊 diǎn jī, 按 àn
    climb: 爬 pá, 攀登 pān dēng, 登 dēng
    clip: 剪 jiǎn, 夾住 jiā zhù
    clog: 堵塞 dǔ sè, 阻塞 zǔ sè
    clone: 複製 fù zhì, 克隆 kè lóng
    close: 關 guān, 關閉 guān bì
    clutch: 緊抓 jǐn zhuā, 握住 wò zhù
    coach: 指導 zhǐ dǎo, 訓練 xùn liàn
    coax: 哄 hǒng, 勸誘 quàn yòu
    code: 編碼 biān mǎ, 寫|程式 xiě chéng shì
    coincide: 巧合 qiǎo hé, 重合 chóng hé
    collaborate: 合作 hé zuò
    collapse: 倒塌 dǎo tā, 崩潰 bēng kuì
    collect: 收集 shōu jí, 蒐集 sōu jí, 收藏 shōu cáng
    collide: 碰撞 pèng zhuàng, 相撞 xiāng zhuàng
    color: 上|色 shàng sè, 著|色 zhuó sè
    comb: 梳 shū, 梳|頭 shū tóu
    combat: 對抗 duì kàng, 打擊 dǎ jī
    combine: 結合 jié hé, 合併 hé bìng
    come: 來 lái
    come back: 回來 huí lái
    come in: 進來 jìn lái
    comfort: 安慰 ān wèi
    command: 命令 mìng lìng, 指揮 zhǐ huī
    commemorate: 紀念 jì niàn
    comment: 評論 píng lùn
    commit: 犯 fàn (a crime), 承諾 chéng nuò (a promise)
    communicate: 溝通 gōu tōng
    compare: 比較 bǐ jiào, 比 bǐ
    compensate: 補償 bǔ cháng, 賠償 péi cháng
    compete: 競爭 jìng zhēng, 比賽 bǐ sài
    compile: 編譯 biān yì, 彙編 huì biān
    complete: 完成 wán chéng
    complicate: 複雜化 fù zá huà
    compliment: 讚美 zàn měi, 稱讚 chēng zàn
    comply: 遵守 zūn shǒu, 遵從 zūn cóng
    compose: 作|曲 zuò qǔ, 組成 zǔ chéng, 撰寫 zhuàn xiě
    comprise: 包含 bāo hán [s], 組成 zǔ chéng
    compute: 計算 jì suàn, 運算 yùn suàn
    conceal: 隱藏 yǐn cáng, 隱瞞 yǐn mán
    concede: 承認 chéng rèn, 讓|步 ràng bù
    conceive: 構思 gòu sī, 懷|孕 huái yùn (a child)
    conclude: 結束 jié shù, 推斷 tuī duàn, 下|結論 xià jié lùn
    condemn: 譴責 qiǎn zé, 判|刑 pàn xíng
    conduct: 進行 jìn xíng, 指揮 zhǐ huī (an orchestra), 傳導 chuán dǎo (electricity)
    confess: 坦白 tǎn bái, 招認 zhāo rèn, 懺悔 chàn huǐ
    configure: 設定 shè dìng, 配置 pèi zhì
    confirm: 確認 què rèn, 證實 zhèng shí
    confront: 面對 miàn duì, 對抗 duì kàng
    confuse: 混淆 hùn xiáo, 搞混 gǎo hùn
    congratulate: 恭喜 gōng xǐ, 祝賀 zhù hè
    connect: 連接 lián jiē, 連結 lián jié
    conquer: 征服 zhēng fú, 攻佔 gōng zhàn
    consent: 同意 tóng yì, 答應 dā yìng
    conserve: 保存 bǎo cún, 節約 jié yuē
    consider: 考慮 kǎo lǜ, 認為 rèn wéi [s]
    consist: 在於 zài yú [s], 構成 gòu chéng [s]
    console: 安慰 ān wèi
    consolidate: 鞏固 gǒng gù, 整合 zhěng hé
    conspire: 密謀 mì móu, 串通 chuàn tōng
    constitute: 構成 gòu chéng [s], 組成 zǔ chéng
    construct: 建造 jiàn zào, 建構 jiàn gòu
    consult: 諮詢 zī xún, 請教 qǐng jiào
    consume: 消耗 xiāo hào, 消費 xiāo fèi
    contact: 聯絡 lián luò, 聯繫 lián xì
    contain: 包含 bāo hán [s], 容納 róng nà, 含有 hán yǒu [s]
    contemplate: 思考 sī kǎo, 凝視 níng shì
    contend: 競爭 jìng zhēng, 主張 zhǔ zhāng
    continue: 繼續 jì xù, 持續 chí xù
    contradict: 反駁 fǎn bó, 矛盾 máo dùn [s]
    contrast: 對比 duì bǐ
    contribute: 貢獻 gòng xiàn, 捐助 juān zhù
    control: 控制 kòng zhì, 管制 guǎn zhì
    converge: 匯合 huì hé, 集中 jí zhōng
    convert: 轉換 zhuǎn huàn, 改信 gǎi xìn
    convey: 傳達 chuán dá, 表達 biǎo dá
    convince: 說服 shuō fú
    cook: 煮 zhǔ, 烹飪 pēng rèn, 做|菜 zuò cài
    cool: 冷卻 lěng què, 變涼 biàn liáng
    cooperate: 合作 hé zuò
    coordinate: 協調 xié tiáo
    cope: 應付 yìng fù, 處理 chǔ lǐ
    copy: 複製 fù zhì, 抄 chāo, 影印 yǐng yìn
    correct: 糾正 jiū zhèng, 改正 gǎi zhèng
    correspond: 對應 duì yìng [s], 通|信 tōng xìn
    corrupt: 腐蝕 fǔ shí, 腐化 fǔ huà
    cost: 花費 huā fèi [s]
    cough: 咳嗽 ké sòu
    counsel: 輔導 fǔ dǎo, 勸告 quàn gào
    count: 數 shǔ, 計數 jì shù, 算 suàn
    counterfeit: 偽造 wěi zào, 仿冒 fǎng mào
    court: 追求 zhuī qiú, 求|愛 qiú ài
    cover: 覆蓋 fù gài, 蓋 gài, 遮 zhē
    crack: 裂開 liè kāi, 破解 pò jiě (a code)
    crash: 撞毀 zhuàng huǐ, 當|機 dāng jī (a computer), 碰撞 pèng zhuàng
    crave: 渴望 kě wàng [s]
    crawl: 爬 pá, 爬行 pá xíng
    create: 創造 chuàng zào, 創建 chuàng jiàn
    credit: 記入 jì rù
    criticize: 批評 pī píng, 批判 pī pàn
    cross: 穿越 chuān yuè, 越過 yuè guò, 渡 dù
    crush: 壓碎 yā suì, 壓扁 yā biǎn
    cry: 哭 kū (weep), 喊 hǎn (shout)
    cultivate: 栽培 zāi péi, 培養 péi yǎng, 耕種 gēng zhòng
    cure: 治癒 zhì yù, 治療 zhì liáo
    curl: 捲 juǎn, 捲曲 juǎn qū
    curse: 詛咒 zǔ zhòu, 咒罵 zhòu mà
    cushion: 緩衝 huǎn chōng, 減震 jiǎn zhèn
    customize: 客製化 kè zhì huà, 自訂 zì dìng
    cut: 切 qiē, 剪 jiǎn, 割 gē, 砍 kǎn
    cut off: 切斷 qiē duàn, 剪斷 jiǎn duàn
    damage: 損壞 sǔn huài, 破壞 pò huài
    dance: 跳|舞 tiào wǔ
    dare: 敢 gǎn [m]
    darken: 變暗 biàn àn
    darn: 縫補 féng bǔ, 補 bǔ
    dash: 衝 chōng, 飛奔 fēi bēn
    dazzle: 驚豔 jīng yàn, 迷惑 mí huò
    deal: 處理 chǔ lǐ (deal with), 交易 jiāo yì
    debate: 辯論 biàn lùn
    debug: 除錯 chú cuò, 偵錯 zhēn cuò
    decay: 腐爛 fǔ làn, 衰退 shuāi tuì
    deceive: 欺騙 qī piàn, 蒙騙 mēng piàn
    decide: 決定 jué dìng
    decipher: 破譯 pò yì, 解讀 jiě dú
    declare: 宣布 xuān bù, 宣告 xuān gào, 申報 shēn bào
    decline: 下降 xià jiàng, 拒絕 jù jué
    decorate: 裝飾 zhuāng shì, 佈置 bù zhì
    decrease: 減少 jiǎn shǎo, 降低 jiàng dī
    decrypt: 解密 jiě mì
    dedicate: 奉獻 fèng xiàn, 獻給 xiàn gěi
    deduct: 扣除 kòu chú, 推斷 tuī duàn
    deem: 認為 rèn wéi [s]
    defeat: 打敗 dǎ bài, 擊敗 jī bài
    defend: 保衛 bǎo wèi, 防守 fáng shǒu, 辯護 biàn hù
    defer: 推遲 tuī chí, 延|期 yán qí
    define: 定義 dìng yì
    deflect: 偏轉 piān zhuǎn, 轉移 zhuǎn yí
    degrade: 降|級 jiàng jí, 貶低 biǎn dī
    delay: 延遲 yán chí, 耽擱 dān gē
    delegate: 委派 wěi pài, 授權 shòu quán
    delete: 刪除 shān chú
    deliberate: 審議 shěn yì, 斟酌 zhēn zhuó
    delight: 愉悅 yú yuè, 取悅 qǔ yuè
    deliver: 運送 yùn sòng, 遞送 dì sòng, 發表 fā biǎo (a speech)
    demand: 要求 yāo qiú, 需求 xū qiú
    demolish: 拆除 chāi chú, 摧毀 cuī huǐ
    demonstrate: 示範 shì fàn, 證明 zhèng míng, 示威 shì wēi
    denote: 表示 biǎo shì, 指 zhǐ
    denounce: 譴責 qiǎn zé, 檢舉 jiǎn jǔ
    deny: 否認 fǒu rèn, 拒絕 jù jué
    depend: 依賴 yī lài [s], 取決於 qǔ jué yú [s]
    deploy: 部署 bù shǔ, 配置 pèi zhì
    deport: 驅逐 qū zhú
    deposit: 存 cún, 存|款 cún kuǎn
    deprive: 剝奪 bō duó
    derive: 源自 yuán zì [s], 得到 dé dào
    descend: 下降 xià jiàng, 下來 xià lái
    describe: 描述 miáo shù, 形容 xíng róng
    deserve: 值得 zhí dé [s], 應得 yīng dé
    design: 設計 shè jì
    designate: 指定 zhǐ dìng, 指派 zhǐ pài
    desire: 渴望 kě wàng [s], 想要 xiǎng yào [s]
    despise: 輕視 qīng shì, 鄙視 bǐ shì
    destroy: 毀壞 huǐ huài, 摧毀 cuī huǐ, 破壞 pò huài
    detect: 偵測 zhēn cè, 發現 fā xiàn [a]
    deteriorate: 惡化 è huà, 變壞 biàn huài
    determine: 決定 jué dìng, 確定 què dìng
    detest: 厭惡 yàn wù [s], 憎恨 zēng hèn [s]
    devastate: 摧毀 cuī huǐ, 蹂躪 róu lìn
    develop: 發展 fā zhǎn, 開發 kāi fā, 發育 fā yù
    deviate: 偏離 piān lí, 背離 bèi lí
    devour: 吞食 tūn shí, 大吃 dà chī
    diagnose: 診斷 zhěn duàn
    dial: 撥|號 bō hào, 撥 bō
    dictate: 口述 kǒu shù, 命令 mìng lìng
    die: 死 sǐ [a], 去世 qù shì [a]
    differ: 不同 bù tóng [s], 相異 xiāng yì [s]
    dig: 挖 wā, 掘 jué
    digest: 消化 xiāo huà
    dilute: 稀釋 xī shì
    dim: 調暗 tiáo àn, 變暗 biàn àn
    diminish: 減少 jiǎn shǎo, 縮小 suō xiǎo
    dine: 用|餐 yòng cān, 吃|晚飯 chī wǎn fàn
    direct: 指揮 zhǐ huī, 導演 dǎo yǎn, 指引 zhǐ yǐn
    disable: 停用 tíng yòng, 禁用 jìn yòng
    disagree: 反對 fǎn duì
    disappear: 消失 xiāo shī [a]
    disappoint: 辜負 gū fù
    disarm: 繳|械 jiǎo xiè
    discard: 丟棄 diū qì, 扔掉 rēng diào
    discharge: 排放 pái fàng, 釋放 shì fàng, 出|院 chū yuàn
    disclose: 揭露 jiē lù, 透露 tòu lù
    disconnect: 斷開 duàn kāi, 切斷 qiē duàn
    discourage: 勸阻 quàn zǔ
    discover: 發現 fā xiàn [a], 找出 zhǎo chū
    discredit: 玷汙 diàn wū, 抹|黑 mǒ hēi
    discuss: 討論 tǎo lùn, 商量 shāng liáng
    disguise: 偽裝 wěi zhuāng, 喬裝 qiáo zhuāng
    disgust: 噁心 ě xīn, 厭惡 yàn wù
    disinfect: 消|毒 xiāo dú
    dismantle: 拆卸 chāi xiè, 拆除 chāi chú
    dismiss: 解雇 jiě gù, 開除 kāi chú, 駁回 bó huí
    dispatch: 派遣 pài qiǎn, 發送 fā sòng
    dispense: 分發 fēn fā, 配發 pèi fā
    disperse: 驅散 qū sàn, 分散 fēn sàn
    displace: 取代 qǔ dài, 移位 yí wèi
    display: 展示 zhǎn shì, 顯示 xiǎn shì
    disprove: 反駁 fǎn bó, 駁倒 bó dǎo
    dispute: 爭論 zhēng lùn, 爭執 zhēng zhí
    distinguish: 區分 qū fēn, 分辨 fēn biàn
    distort: 扭曲 niǔ qū, 歪曲 wāi qū
    distract: 干擾 gān rǎo, 分|心 fēn xīn
    distribute: 分發 fēn fā, 分配 fēn pèi, 散布 sàn bù
    disturb: 打擾 dǎ rǎo, 干擾 gān rǎo
    dive: 潛|水 qián shuǐ, 跳|水 tiào shuǐ
    diversify: 多元化 duō yuán huà
    divide: 分 fēn, 劃分 huà fēn, 除 chú
    divorce: 離|婚 lí hūn
    do: 做 zuò, 辦 bàn
    document: 記錄 jì lù, 記載 jì zǎi
    dodge: 躲 duǒ, 閃避 shǎn bì
    dominate: 支配 zhī pèi, 主宰 zhǔ zǎi
    donate: 捐 juān, 捐贈 juān zèng
    double: 加倍 jiā bèi, 翻倍 fān bèi
    doubt: 懷疑 huái yí
    download: 下載 xià zǎi
    draft: 起草 qǐ cǎo, 草擬 cǎo nǐ
    drag: 拖 tuō, 拖曳 tuō yè
    drain: 排|水 pái shuǐ, 排出 pái chū
    draw: 畫 huà, 繪製 huì zhì, 抽 chōu
    dread: 害怕 hài pà [s], 懼怕 jù pà [s]
    dream: 做|夢 zuò mèng, 夢見 mèng jiàn
    dress: 穿|衣服 chuān yī fú
    dribble: 運|球 yùn qiú, 滴 dī
    drift: 漂流 piāo liú, 漂 piāo
    drill: 鑽 zuān, 打|洞 dǎ dòng, 操練 cāo liàn
    drink: 喝 hē
    drip: 滴 dī, 滴落 dī luò
    drive: 開|車 kāi chē, 駕駛 jià shǐ, 驅動 qū dòng
    drizzle: 下|毛毛雨 xià máo máo yǔ
    drop: 掉 diào, 落 luò, 丟 diū, 放下 fàng xià
    drown: 淹死 yān sǐ, 溺|水 nì shuǐ
    dry: 乾 gān, 弄乾 nòng gān, 晾乾 liàng gān
    dump: 倒 dào, 傾倒 qīng dǎo
    duplicate: 複製 fù zhì
    dwell: 居住 jū zhù, 住 zhù
    dye: 染 rǎn
    earn: 賺 zhuàn, 賺|錢 zhuàn qián, 獲得 huò dé
    ease: 減輕 jiǎn qīng, 緩解 huǎn jiě
    eat: 吃 chī
    echo: 迴響 huí xiǎng, 迴盪 huí dàng
    edit: 編輯 biān jí
    educate: 教育 jiào yù
    elaborate: 詳述 xiáng shù, 闡述 chǎn shù
    elapse: 流逝 liú shì, 過去 guò qù
    elect: 選舉 xuǎn jǔ, 選出 xuǎn chū
    elevate: 提升 tí shēng, 抬高 tái gāo
    eliminate: 消除 xiāo chú, 淘汰 táo tài
    elude: 躲避 duǒ bì, 逃避 táo bì
    email: 寄|電子郵件 jì diàn zǐ yóu jiàn, 發|電郵 fā diàn yóu
    embark: 出發 chū fā, 登|船 dēng chuán
    embed: 嵌入 qiàn rù, 植入 zhí rù
    embrace: 擁抱 yōng bào
    embroider: 刺繡 cì xiù
    emerge: 出現 chū xiàn [a], 浮現 fú xiàn
    emit: 發出 fā chū, 排放 pái fàng
    emphasize: 強調 qiáng diào
    employ: 僱用 gù yòng, 使用 shǐ yòng
    empower: 賦權 fù quán, 授權 shòu quán
    empty: 倒空 dào kōng, 清空 qīng kōng
    enable: 啟用 qǐ yòng, 讓 ràng
    enact: 制定 zhì dìng, 頒布 bān bù
    enchant: 迷住 mí zhù
    encircle: 包圍 bāo wéi, 環繞 huán rào
    encounter: 遇到 yù dào, 碰到 pèng dào
    encourage: 鼓勵 gǔ lì
    encrypt: 加|密 jiā mì
    end: 結束 jié shù, 終止 zhōng zhǐ
    endorse: 背|書 bèi shū, 支持 zhī chí, 代|言 dài yán
    endure: 忍耐 rěn nài, 忍受 rěn shòu
    energize: 激勵 jī lì
    enforce: 執行 zhí xíng, 強制執行 qiáng zhì zhí xíng
    engage: 參與 cān yù (involve), 僱用 gù yòng (hire)
    engrave: 雕刻 diāo kè, 刻 kè
    enhance: 增強 zēng qiáng, 提高 tí gāo
    enjoy: 享受 xiǎng shòu, 喜歡 xǐ huān [s]
    enlarge: 放大 fàng dà, 擴大 kuò dà
    enlist: 入|伍 rù wǔ, 徵募 zhēng mù
    enrage: 激怒 jī nù, 惹火 rě huǒ
    enrich: 豐富 fēng fù, 充實 chōng shí
    enroll: 註冊 zhù cè, 報|名 bào míng
    ensure: 確保 què bǎo, 保證 bǎo zhèng
    entail: 需要 xū yào [s], 牽涉 qiān shè [s]
    entangle: 纏繞 chán rào, 糾纏 jiū chán
    enter: 進入 jìn rù, 進 jìn
    entertain: 招待 zhāo dài, 娛樂 yú lè
    entrust: 委託 wěi tuō, 託付 tuō fù
    envision: 設想 shè xiǎng, 想像 xiǎng xiàng
    envy: 羨慕 xiàn mù [s], 嫉妒 jí dù [s]
    equip: 裝備 zhuāng bèi, 配備 pèi bèi
    erase: 擦掉 cā diào, 抹去 mǒ qù
    err: 犯|錯 fàn cuò, 出|錯 chū cuò
    escalate: 升級 shēng jí, 惡化 è huà
    escape: 逃跑 táo pǎo, 逃脫 táo tuō, 逃走 táo zǒu
    establish: 建立 jiàn lì, 成立 chéng lì
    estimate: 估計 gū jì, 估算 gū suàn
    evacuate: 撤離 chè lí, 疏散 shū sàn
    evade: 躲避 duǒ bì, 逃避 táo bì
    evaluate: 評估 píng gū, 評價 píng jià
    evaporate: 蒸發 zhēng fā
    evoke: 喚起 huàn qǐ, 引起 yǐn qǐ
    evolve: 演變 yǎn biàn, 進化 jìn huà
    exaggerate: 誇大 kuā dà, 誇張 kuā zhāng
    exalt: 讚揚 zàn yáng, 頌揚 sòng yáng
    examine: 檢查 jiǎn chá, 審查 shěn chá, 檢驗 jiǎn yàn
    excavate: 挖掘 wā jué
    exceed: 超過 chāo guò, 超出 chāo chū
    excel: 擅長 shàn cháng [s], 勝過 shèng guò
    exchange: 交換 jiāo huàn, 兌換 duì huàn
    excite: 激動 jī dòng, 興奮 xīng fèn
    exclude: 排除 pái chú, 排斥 pái chì
    excuse: 原諒 yuán liàng, 免除 miǎn chú
    execute: 執行 zhí xíng, 處決 chǔ jué
    exempt: 豁免 huò miǎn, 免除 miǎn chú
    exercise: 運動 yùn dòng, 鍛鍊 duàn liàn
    exert: 發揮 fā huī, 施加 shī jiā
    exhale: 呼|氣 hū qì, 吐|氣 tǔ qì
    exhaust: 用盡 yòng jìn, 耗盡 hào jìn
    exhibit: 展覽 zhǎn lǎn, 展示 zhǎn shì
    exile: 流放 liú fàng, 放逐 fàng zhú
    exist: 存在 cún zài [s]
    expand: 擴張 kuò zhāng, 擴大 kuò dà
    expect: 期待 qí dài, 預期 yù qí, 預料 yù liào
    expedite: 加快 jiā kuài, 加速 jiā sù
    expel: 驅逐 qū zhú, 開除 kāi chú
    experience: 經歷 jīng lì, 體驗 tǐ yàn
    experiment: 實驗 shí yàn, 做|實驗 zuò shí yàn
    expire: 到|期 dào qí, 過|期 guò qí
    explain: 解釋 jiě shì, 說明 shuō míng
    explode: 爆炸 bào zhà
    exploit: 利用 lì yòng, 剝削 bō xuē
    explore: 探索 tàn suǒ, 探|險 tàn xiǎn
    export: 出口 chū kǒu, 輸出 shū chū
    expose: 暴露 bào lù, 揭露 jiē lù
    express: 表達 biǎo dá, 表示 biǎo shì
    extend: 延長 yán cháng, 延伸 yán shēn, 伸 shēn
    extinguish: 撲滅 pū miè, 熄滅 xí miè
    extol: 讚頌 zàn sòng, 頌揚 sòng yáng
    extract: 提取 tí qǔ, 萃取 cuì qǔ, 拔 bá
    fabricate: 捏造 niē zào, 製造 zhì zào
    face: 面對 miàn duì, 面向 miàn xiàng
    facilitate: 促進 cù jìn, 便利 biàn lì
    fade: 褪|色 tuì sè, 消退 xiāo tuì
    fail: 失敗 shī bài, 失靈 shī líng (stop working), 考砸 kǎo zá (a test)
    fake: 偽造 wěi zào, 假裝 jiǎ zhuāng
    fall: 掉 diào, 落下 luò xià, 跌倒 diē dǎo
    fall down: 跌倒 diē dǎo, 摔倒 shuāi dǎo
    fan: 搧 shān, 搧|風 shān fēng
    fascinate: 迷住 mí zhù, 吸引 xī yǐn
    fasten: 繫 jì, 扣緊 kòu jǐn, 固定 gù dìng
    fatigue: 疲倦 pí juàn, 累 lèi
    favor: 偏愛 piān ài, 贊同 zàn tóng
    fear: 害怕 hài pà [s], 恐懼 kǒng jù [s]
    feed: 餵 wèi, 餵養 wèi yǎng, 供給 gōng jǐ
    feel: 感覺 gǎn jué, 覺得 jué dé [s], 摸 mō
    fence: 擊|劍 jī jiàn
    ferment: 發酵 fā jiào
    fetch: 拿來 ná lái, 取來 qǔ lái
    fight: 打|架 dǎ jià, 戰鬥 zhàn dòu, 搏鬥 bó dòu
    figure out: 弄懂 nòng dǒng, 想出 xiǎng chū
    file: 歸|檔 guī dàng, 提出 tí chū
    fill: 填 tián, 裝滿 zhuāng mǎn, 充滿 chōng mǎn
    fill in: 填寫 tián xiě
    film: 拍攝 pāi shè, 拍|電影 pāi diàn yǐng
    filter: 過濾 guò lǜ, 篩選 shāi xuǎn
    finance: 資助 zī zhù, 融資 róng zī
    find: 找到 zhǎo dào [a], 發現 fā xiàn [a]
    find out: 查出 chá chū, 弄清楚 nòng qīng chǔ
    fine: 罰|款 fá kuǎn, 處罰 chǔ fá
    finish: 完成 wán chéng, 結束 jié shù, 做完 zuò wán
    fire: 解雇 jiě gù (from a job), 開|槍 kāi qiāng (a weapon), 開|火 kāi huǒ
    fish: 釣|魚 diào yú, 捕|魚 bǔ yú
    fit: 適合 shì hé [s], 合|身 hé shēn
    fix: 修理 xiū lǐ, 修 xiū, 固定 gù dìng
    flap: 拍動 pāi dòng, 拍打 pāi dǎ
    flare: 閃耀 shǎn yào, 爆發 bào fā
    flash: 閃 shǎn, 閃爍 shǎn shuò
    flatter: 奉承 fèng chéng, 恭維 gōng wéi
    flavor: 調|味 tiáo wèi
    flee: 逃 táo, 逃跑 táo pǎo
    fling: 扔 rēng, 拋 pāo
    flip: 翻 fān, 翻轉 fān zhuǎn
    flirt: 調|情 tiáo qíng
    float: 漂浮 piāo fú, 浮 fú
    flood: 淹沒 yān mò, 氾濫 fàn làn, 淹|水 yān shuǐ
    flourish: 繁榮 fán róng, 興旺 xīng wàng
    flow: 流 liú, 流動 liú dòng
    flutter: 拍動 pāi dòng, 飄動 piāo dòng
    fly: 飛 fēi, 飛行 fēi xíng, 搭|飛機 dā fēi jī
    focus: 集中 jí zhōng, 專注 zhuān zhù, 聚焦 jù jiāo
    fold: 折 zhé, 摺 zhé, 折疊 zhé dié
    follow: 跟 gēn, 跟隨 gēn suí, 遵循 zūn xún
    fool: 愚弄 yú nòng, 騙 piàn
    forbid: 禁止 jìn zhǐ, 阻止 zǔ zhǐ
    force: 強迫 qiǎng pò, 迫使 pò shǐ
    forecast: 預測 yù cè, 預報 yù bào
    foresee: 預見 yù jiàn, 預料 yù liào
    forge: 偽造 wěi zào, 鍛造 duàn zào
    forget: 忘記 wàng jì [a], 忘 wàng [a]
    forgive: 原諒 yuán liàng, 寬恕 kuān shù
    form: 形成 xíng chéng, 組成 zǔ chéng
    format: 格式化 gé shì huà
    formulate: 制定 zhì dìng, 擬定 nǐ dìng
    found: 創立 chuàng lì, 創辦 chuàng bàn
    fracture: 骨|折 gǔ zhé, 斷裂 duàn liè
    frame: 裝|框 zhuāng kuàng (a picture), 栽|贓 zāi zāng (someone)
    free: 釋放 shì fàng, 解放 jiě fàng, 放 fàng
    freeze: 凍結 dòng jié, 結|冰 jié bīng, 冷凍 lěng dòng
    frighten: 嚇 xià, 驚嚇 jīng xià
    frown: 皺|眉 zhòu méi
    frustrate: 挫敗 cuò bài
    fry: 炸 zhá, 煎 jiān, 炒 chǎo
    fuel: 加|油 jiā yóu
    fulfill: 實現 shí xiàn, 履行 lǚ xíng, 滿足 mǎn zú
    function: 運作 yùn zuò
    furnish: 布置 bù zhì, 提供 tí gōng
    fuse: 熔合 róng hé, 融合 róng hé
    gain: 獲得 huò dé, 增加 zēng jiā
    gallop: 奔馳 bēn chí
    gamble: 賭博 dǔ bó, 賭 dǔ
    gather: 聚集 jù jí, 收集 shōu jí, 採 cǎi
    generate: 產生 chǎn shēng, 生成 shēng chéng
    gesture: 比|手勢 bǐ shǒu shì
    get: 得到 dé dào, 取得 qǔ dé, 收到 shōu dào (receive)
    give: 給 gěi, 送 sòng
    give up: 放棄 fàng qì, 認|輸 rèn shū
    glorify: 美化 měi huà, 頌揚 sòng yáng
    glow: 發|光 fā guāng, 發亮 fā liàng
    glue: 黏 nián, 黏貼 nián tiē
    go: 去 qù, 走 zǒu
    go back: 回去 huí qù
    go on: 繼續 jì xù, 持續 chí xù
    go out: 出去 chū qù, 出|門 chū mén
    gossip: 八卦 bā guà, 說|閒話 shuō xián huà
    govern: 統治 tǒng zhì, 治理 zhì lǐ
    grab: 抓 zhuā, 抓住 zhuā zhù
    grade: 評|分 píng fēn, 打|分數 dǎ fēn shù
    graduate: 畢|業 bì yè
    graft: 嫁接 jià jiē, 移植 yí zhí
    grant: 授予 shòu yǔ, 批准 pī zhǔn
    grasp: 抓住 zhuā zhù, 理解 lǐ jiě
    grate: 磨碎 mó suì, 刨 bào
    graze: 吃|草 chī cǎo, 放牧 fàng mù
    greet: 問候 wèn hòu, 打|招呼 dǎ zhāo hū
    grieve: 悲傷 bēi shāng, 哀悼 āi dào
    grill: 烤 kǎo, 燒烤 shāo kǎo
    grind: 磨 mó, 研磨 yán mó
    grip: 握 wò, 抓緊 zhuā jǐn
    groan: 呻吟 shēn yín
    grow: 成長 chéng zhǎng, 生長 shēng zhǎng, 種植 zhòng zhí (crops)
    grow up: 長大 zhǎng dà
    growl: 低吼 dī hǒu, 咆哮 páo xiào
    grunt: 咕噥 gū nóng, 哼 hēng
    guarantee: 保證 bǎo zhèng, 擔保 dān bǎo
    guard: 守衛 shǒu wèi, 看守 kān shǒu, 保護 bǎo hù
    guess: 猜 cāi, 猜測 cāi cè
    guide: 引導 yǐn dǎo, 帶領 dài lǐng
    gulp: 吞 tūn, 吞嚥 tūn yàn
    gush: 湧出 yǒng chū, 噴出 pēn chū
    hack: 駭入 hài rù, 砍 kǎn
    hail: 下|冰雹 xià bīng báo
    halt: 停止 tíng zhǐ, 停下 tíng xià
    hammer: 錘 chuí, 敲打 qiāo dǎ
    hamper: 妨礙 fáng ài, 阻礙 zǔ ài
    hand over: 交出 jiāo chū, 移交 yí jiāo
    handle: 處理 chǔ lǐ, 操作 cāo zuò
    hang: 掛 guà, 吊 diào, 懸掛 xuán guà
    hang up: 掛斷 guà duàn
    happen: 發生 fā shēng
    harass: 騷擾 sāo rǎo
    harden: 變硬 biàn yìng, 硬化 yìng huà
    harm: 傷害 shāng hài, 損害 sǔn hài
    harmonize: 協調 xié tiáo
    harvest: 收割 shōu gē, 收穫 shōu huò
    hate: 恨 hèn [s], 討厭 tǎo yàn [s]
    haul: 拖 tuō, 運 yùn
    have: 有 yǒu, 擁有 yōng yǒu [s]
    heal: 治癒 zhì yù, 痊癒 quán yù
    heap: 堆 duī, 堆積 duī jī
    hear: 聽 tīng, 聽見 tīng jiàn [a]
    heat: 加熱 jiā rè, 加溫 jiā wēn
    heighten: 提高 tí gāo, 加強 jiā qiáng
    help: 幫助 bāng zhù, 幫 bāng, 協助 xié zhù
    hesitate: 猶豫 yóu yù
    hide: 藏 cáng, 躲 duǒ, 隱藏 yǐn cáng
    highlight: 強調 qiáng diào, 標示 biāo shì
    hijack: 劫持 jié chí
    hinder: 阻礙 zǔ ài, 妨礙 fáng ài
    hint: 暗示 àn shì
    hire: 僱用 gù yòng, 聘請 pìn qǐng
    hit: 打 dǎ, 撞 zhuàng, 擊中 jī zhòng
    hoard: 囤積 tún jī
    hold: 拿 ná, 握 wò, 抱 bào
    hold on: 抓緊 zhuā jǐn, 等待 děng dài
    honor: 尊敬 zūn jìng, 表揚 biǎo yáng
    hook: 鉤住 gōu zhù
    hop: 跳 tiào, 蹦 bèng
    hope: 希望 xī wàng [s], 盼望 pàn wàng [s]
    host: 主持 zhǔ chí, 招待 zhāo dài
    hover: 盤旋 pán xuán, 懸浮 xuán fú
    howl: 嚎叫 háo jiào, 嚎 háo
    hug: 擁抱 yōng bào, 抱 bào
    hum: 哼 hēng, 哼唱 hēng chàng
    humiliate: 羞辱 xiū rǔ
    hunt: 打|獵 dǎ liè, 狩獵 shòu liè
    hurl: 擲 zhì, 猛扔 měng rēng
    hurt: 痛 tòng (to ache), 傷害 shāng hài (to wound), 弄痛 nòng tòng
    hypnotize: 催眠 cuī mián
    identify: 辨認 biàn rèn, 識別 shì bié
    idolize: 崇拜 chóng bài
    ignore: 忽視 hū shì, 忽略 hū lüè
    illuminate: 照亮 zhào liàng, 照明 zhào míng
    illustrate: 說明 shuō míng, 舉|例 jǔ lì
    imagine: 想像 xiǎng xiàng
    imitate: 模仿 mó fǎng, 仿效 fǎng xiào
    immerse: 浸 jìn, 沉浸 chén jìn
    immobilize: 固定 gù dìng
    impeach: 彈劾 tán hé
    impede: 阻礙 zǔ ài, 妨礙 fáng ài
    implement: 實施 shí shī, 執行 zhí xíng
    implore: 懇求 kěn qiú, 哀求 āi qiú
    imply: 暗示 àn shì, 意味 yì wèi [s]
    import: 進口 jìn kǒu, 匯入 huì rù
    impose: 強加 qiáng jiā, 徵收 zhēng shōu
    impress: 打動 dǎ dòng
    imprison: 監禁 jiān jìn, 關押 guān yā
    improve: 改善 gǎi shàn, 改進 gǎi jìn, 提高 tí gāo
    incite: 煽動 shān dòng, 慫恿 sǒng yǒng
    incline: 傾斜 qīng xié, 傾向 qīng xiàng
    include: 包括 bāo kuò [s], 包含 bāo hán [s]
    incorporate: 納入 nà rù, 合併 hé bìng
    increase: 增加 zēng jiā, 增長 zēng zhǎng, 提高 tí gāo
    incur: 招致 zhāo zhì, 蒙受 méng shòu
    indicate: 表明 biǎo míng, 指出 zhǐ chū, 顯示 xiǎn shì
    induce: 誘導 yòu dǎo, 引起 yǐn qǐ
    infect: 感染 gǎn rǎn, 傳染 chuán rǎn
    infer: 推斷 tuī duàn, 推論 tuī lùn
    inflate: 充|氣 chōng qì, 膨脹 péng zhàng
    inflict: 施加 shī jiā, 造成 zào chéng
    influence: 影響 yǐng xiǎng
    inform: 通知 tōng zhī, 告知 gào zhī
    infringe: 侵犯 qīn fàn, 侵害 qīn hài
    ingest: 攝取 shè qǔ, 吞食 tūn shí
    inhabit: 居住 jū zhù, 棲息 qī xí
    inhale: 吸入 xī rù, 吸|氣 xī qì
    inherit: 繼承 jì chéng
    inhibit: 抑制 yì zhì, 阻止 zǔ zhǐ
    initiate: 發起 fā qǐ, 開創 kāi chuàng
    inject: 注射 zhù shè, 注入 zhù rù
    injure: 傷害 shāng hài, 受|傷 shòu shāng
    inquire: 詢問 xún wèn, 打聽 dǎ tīng
    insert: 插入 chā rù, 放入 fàng rù
    insinuate: 暗示 àn shì, 影射 yǐng shè
    insist: 堅持 jiān chí
    inspect: 檢查 jiǎn chá, 視察 shì chá
    inspire: 激勵 jī lì, 啟發 qǐ fā
    install: 安裝 ān zhuāng
    instruct: 指示 zhǐ shì, 教導 jiào dǎo
    insult: 侮辱 wǔ rǔ, 羞辱 xiū rǔ
    insure: 投|保 tóu bǎo
    integrate: 整合 zhěng hé, 融入 róng rù
    intend: 打算 dǎ suàn, 想要 xiǎng yào [s]
    intensify: 加強 jiā qiáng, 加劇 jiā jù
    interact: 互動 hù dòng
    interest: 吸引 xī yǐn
    interfere: 干預 gān yù, 干涉 gān shè
    interpret: 解釋 jiě shì, 口譯 kǒu yì
    interrogate: 審問 shěn wèn, 盤問 pán wèn
    interrupt: 打斷 dǎ duàn, 打|岔 dǎ chà
    intervene: 介入 jiè rù, 干預 gān yù
    interview: 採訪 cǎi fǎng, 面試 miàn shì
    intimidate: 恐嚇 kǒng hè, 威嚇 wēi hè
    intrigue: 勾起 gōu qǐ, 吸引 xī yǐn
    introduce: 介紹 jiè shào, 引進 yǐn jìn
    invade: 入侵 rù qīn, 侵略 qīn lüè
    invent: 發明 fā míng
    invest: 投資 tóu zī
    invite: 邀請 yāo qǐng, 請 qǐng
    invoice: 開|發票 kāi fā piào
    invoke: 援引 yuán yǐn, 召喚 zhào huàn
    involve: 涉及 shè jí [s], 牽涉 qiān shè [s]
    iron: 燙 tàng, 熨燙 yùn tàng
    irritate: 激怒 jī nù, 刺激 cì jī
    isolate: 隔離 gé lí, 孤立 gū lì
    issue: 發出 fā chū, 發行 fā xíng
    itch: 癢 yǎng [s]
    jam: 堵塞 dǔ sè, 卡住 qiǎ zhù
    jeer: 嘲笑 cháo xiào, 嘲弄 cháo nòng
    jingle: 叮噹 dīng dāng
    jog: 慢跑 màn pǎo
    join: 加入 jiā rù, 參加 cān jiā, 連接 lián jiē
    joke: 開|玩笑 kāi wán xiào
    jolt: 震動 zhèn dòng, 顛簸 diān bǒ
    journey: 旅行 lǚ xíng
    judge: 評判 píng pàn, 判斷 pàn duàn, 審判 shěn pàn
    jump: 跳 tiào, 跳躍 tiào yuè
    justify: 辯解 biàn jiě, 證明 zhèng míng
    keep: 保持 bǎo chí, 保留 bǎo liú, 保存 bǎo cún
    keep on: 繼續 jì xù, 持續 chí xù
    kick: 踢 tī
    kidnap: 綁架 bǎng jià, 擄 lǔ
    kill: 殺 shā, 殺死 shā sǐ
    kindle: 點燃 diǎn rán, 激發 jī fā
    kiss: 吻 wěn, 親 qīn, 親吻 qīn wěn
    knead: 揉 róu, 揉捏 róu niē
    knit: 編織 biān zhī
    knock: 敲 qiāo, 敲|門 qiāo mén
    knot: 打|結 dǎ jié, 綁 bǎng
    know: 知道 zhī dào [s] (facts, how to), 認識 rèn shì [s] (people, places), 懂 dǒng [s]
    label: 標示 biāo shì, 貼|標籤 tiē biāo qiān
    lack: 缺乏 quē fá [s], 缺少 quē shǎo [s]
    lament: 哀嘆 āi tàn, 悲嘆 bēi tàn
    land: 降落 jiàng luò, 著陸 zhuó lù
    languish: 衰弱 shuāi ruò, 憔悴 qiáo cuì
    lash: 鞭打 biān dǎ, 抽打 chōu dǎ
    last: 持續 chí xù, 延續 yán xù
    laugh: 笑 xiào, 大笑 dà xiào
    launch: 發射 fā shè, 推出 tuī chū, 發布 fā bù
    launder: 洗 xǐ, 洗|錢 xǐ qián
    lay: 放 fàng, 擺 bǎi, 鋪 pū
    lead: 領導 lǐng dǎo, 帶領 dài lǐng, 引導 yǐn dǎo
    leak: 漏 lòu, 洩漏 xiè lòu, 滲漏 shèn lòu
    lean: 傾斜 qīng xié, 靠 kào
    leap: 跳躍 tiào yuè, 跳 tiào
    learn: 學 xué, 學習 xué xí, 學會 xué huì [a]
    leave: 離開 lí kāi, 留下 liú xià (leave behind), 拋棄 pāo qì (abandon)
    legislate: 立|法 lì fǎ
    lend: 借給 jiè gěi, 出借 chū jiè
    lengthen: 加長 jiā cháng, 延長 yán cháng
    let: 讓 ràng, 允許 yǔn xǔ
    let down: 辜負 gū fù
    level: 整平 zhěng píng, 夷平 yí píng
    liberate: 解放 jiě fàng, 釋放 shì fàng
    lick: 舔 tiǎn
    lie: 說|謊 shuō huǎng, 撒|謊 sā huǎng
    lift: 舉 jǔ, 抬 tái, 提起 tí qǐ
    light: 點燃 diǎn rán, 照亮 zhào liàng, 點 diǎn
    lighten: 減輕 jiǎn qīng, 照亮 zhào liàng
    like: 喜歡 xǐ huān [s]
    limit: 限制 xiàn zhì
    linger: 逗留 dòu liú, 徘徊 pái huái
    link: 連結 lián jié, 連接 lián jiē
    liquidate: 清算 qīng suàn, 變賣 biàn mài
    listen: 聽 tīng, 傾聽 qīng tīng
    listen to: 聽 tīng
    live: 住 zhù, 生活 shēng huó, 活 huó
    load: 裝載 zhuāng zài, 載入 zài rù, 裝 zhuāng
    loathe: 厭惡 yàn wù [s], 憎惡 zēng wù [s]
    locate: 定位 dìng wèi, 找到 zhǎo dào [a]
    lock: 鎖 suǒ, 上|鎖 shàng suǒ
    log: 記錄 jì lù, 登錄 dēng lù
    long: 渴望 kě wàng [s], 思念 sī niàn [s]
    look: 看 kàn
    look after: 照顧 zhào gù, 看顧 kān gù
    look at: 看 kàn
    look for: 找 zhǎo, 尋找 xún zhǎo
    look up: 查 chá, 查詢 chá xún
    loosen: 放鬆 fàng sōng, 鬆開 sōng kāi
    lose: 輸 shū [a], 丟 diū, 失去 shī qù [a]
    love: 愛 ài [s], 熱愛 rè ài [s]
    lower: 降低 jiàng dī, 放低 fàng dī
    lull: 哄睡 hǒng shuì, 安撫 ān fǔ
    lurk: 潛伏 qián fú
    magnify: 放大 fàng dà
    maim: 殘害 cán hài
    maintain: 維持 wéi chí, 維護 wéi hù, 保養 bǎo yǎng
    make: 做 zuò, 製造 zhì zào
    make up: 編造 biān zào, 化|妝 huà zhuāng, 彌補 mí bǔ
    malfunction: 故|障 gù zhàng, 失靈 shī líng
    manage: 管理 guǎn lǐ, 經營 jīng yíng, 設法 shè fǎ
    mangle: 弄爛 nòng làn, 損毀 sǔn huǐ
    manipulate: 操縱 cāo zòng, 操弄 cāo nòng
    manufacture: 製造 zhì zào, 生產 shēng chǎn
    map: 繪製 huì zhì, 測繪 cè huì
    march: 行軍 xíng jūn, 遊行 yóu xíng
    marinate: 醃 yān
    mark: 標記 biāo jì
    market: 行銷 xíng xiāo, 推銷 tuī xiāo
    marvel: 驚嘆 jīng tàn
    mash: 搗碎 dǎo suì, 壓碎 yā suì
    mask: 戴|面具 dài miàn jù, 掩蓋 yǎn gài
    massage: 按摩 àn mó
    master: 精通 jīng tōng, 掌握 zhǎng wò
    match: 匹配 pǐ pèi, 配對 pèi duì, 相配 xiāng pèi [s]
    materialize: 實現 shí xiàn, 具體化 jù tǐ huà
    matter: 重要 zhòng yào [s], 要緊 yào jǐn [s]
    maximize: 最大化 zuì dà huà
    mean: 意味 yì wèi [s], 表示 biǎo shì
    measure: 測量 cè liáng, 量 liáng
    mediate: 調解 tiáo jiě, 斡旋 wò xuán
    meet: 認識 rèn shì (get to know), 遇見 yù jiàn (run into), 見|面 jiàn miàn
    melt: 融化 róng huà, 熔化 róng huà
    memorize: 背 bèi, 記住 jì zhù, 背誦 bèi sòng
    mend: 修補 xiū bǔ, 縫補 féng bǔ
    mention: 提到 tí dào, 提及 tí jí
    meow: 喵喵叫 miāo miāo jiào
    merge: 合併 hé bìng, 融合 róng hé
    merit: 值得 zhí dé [s], 應得 yīng dé
    migrate: 遷移 qiān yí, 移居 yí jū
    mimic: 模仿 mó fǎng
    minimize: 最小化 zuì xiǎo huà
    mislead: 誤導 wù dǎo
    misplace: 放錯 fàng cuò, 遺失 yí shī
    miss: 想念 xiǎng niàn [s] (feel the absence of), 錯過 cuò guò (a bus, a chance)
    mistake: 誤認 wù rèn, 搞錯 gǎo cuò
    mix: 混合 hùn hé, 攪拌 jiǎo bàn
    mobilize: 動員 dòng yuán
    mock: 嘲笑 cháo xiào, 嘲弄 cháo nòng
    modify: 修改 xiū gǎi, 更改 gēng gǎi
    moisten: 弄濕 nòng shī, 濕潤 shī rùn
    mold: 塑造 sù zào, 鑄造 zhù zào
    monitor: 監控 jiān kòng, 監督 jiān dū
    mortgage: 抵押 dǐ yā
    motivate: 激勵 jī lì, 激發 jī fā
    mount: 登上 dēng shàng, 安裝 ān zhuāng, 騎上 qí shàng
    move: 移動 yí dòng, 搬|家 bān jiā, 搬 bān
    muffle: 減弱 jiǎn ruò, 悶住 mēn zhù
    multiply: 乘 chéng, 增加 zēng jiā, 繁殖 fán zhí
    mumble: 嘀咕 dí gū, 咕噥 gū nóng
    munch: 咀嚼 jǔ jué, 嚼 jiáo
    murder: 謀殺 móu shā
    murmur: 低語 dī yǔ, 喃喃 nán nán
    muse: 沉思 chén sī
    must: 必須 bì xū [m], 得 děi [m]
    mutter: 嘀咕 dí gū, 喃喃自語 nán nán zì yǔ
    nag: 嘮叨 láo dāo, 煩 fán
    nail: 釘 dìng, 釘住 dìng zhù
    name: 命名 mìng míng, 取|名 qǔ míng, 稱 chēng
    narrow: 縮小 suō xiǎo, 變窄 biàn zhǎi
    navigate: 導航 dǎo háng, 航行 háng xíng
    need: 需要 xū yào [s]
    neglect: 忽視 hū shì, 疏忽 shū hū
    negotiate: 談判 tán pàn, 協商 xié shāng
    nest: 築|巢 zhù cháo
    neutralize: 中和 zhōng hé, 抵消 dǐ xiāo
    nibble: 啃 kěn
    nod: 點|頭 diǎn tóu
    nominate: 提|名 tí míng
    notice: 注意到 zhù yì dào [a], 發現 fā xiàn [a]
    notify: 通知 tōng zhī
    nourish: 滋養 zī yǎng, 養育 yǎng yù
    nudge: 輕推 qīng tuī, 推 tuī
    numb: 麻痺 má bì, 麻木 má mù
    obey: 服從 fú cóng, 遵守 zūn shǒu
    object: 反對 fǎn duì
    oblige: 迫使 pò shǐ, 強制 qiáng zhì
    obscure: 遮蔽 zhē bì, 模糊 mó hú
    observe: 觀察 guān chá, 遵守 zūn shǒu
    obsess: 迷戀 mí liàn
    obstruct: 阻礙 zǔ ài, 阻擋 zǔ dǎng
    obtain: 獲得 huò dé, 取得 qǔ dé
    occupy: 佔 zhàn, 佔領 zhàn lǐng, 佔用 zhàn yòng
    occur: 發生 fā shēng
    offend: 冒犯 mào fàn, 得罪 dé zuì
    offer: 提供 tí gōng, 提議 tí yì
    offset: 抵消 dǐ xiāo, 彌補 mí bǔ
    omit: 省略 shěng lüè, 遺漏 yí lòu
    ooze: 滲出 shèn chū, 流出 liú chū
    open: 打開 dǎ kāi, 開 kāi
    operate: 操作 cāo zuò, 開|刀 kāi dāo (surgery)
    oppose: 反對 fǎn duì, 抵制 dǐ zhì
    oppress: 壓迫 yā pò
    optimize: 優化 yōu huà
    orchestrate: 編排 biān pái, 策劃 cè huà
    order: 整理 zhěng lǐ (arrange), 命令 mìng lìng (command), 點 diǎn (a meal)
    organize: 組織 zǔ zhī, 整理 zhěng lǐ, 籌辦 chóu bàn
    orient: 定位 dìng wèi
    oust: 趕走 gǎn zǒu, 罷免 bà miǎn
    outdo: 勝過 shèng guò, 超越 chāo yuè
    outline: 概述 gài shù, 勾勒 gōu lè
    outperform: 勝過 shèng guò, 超越 chāo yuè
    overcome: 克服 kè fú, 戰勝 zhàn shèng
    overdo: 過火 guò huǒ, 做過頭 zuò guò tóu
    overflow: 溢出 yì chū, 氾濫 fàn làn
    overhear: 偷聽 tōu tīng, 聽到 tīng dào
    overlap: 重疊 chóng dié
    overpower: 壓倒 yā dǎo, 制服 zhì fú
    override: 覆蓋 fù gài, 推翻 tuī fān
    overrule: 駁回 bó huí, 推翻 tuī fān
    oversee: 監督 jiān dū, 監管 jiān guǎn
    overtake: 超|車 chāo chē, 超越 chāo yuè, 趕上 gǎn shàng
    overthrow: 推翻 tuī fān, 顛覆 diān fù
    overturn: 翻覆 fān fù, 推翻 tuī fān, 翻倒 fān dǎo
    overwhelm: 壓倒 yā dǎo, 淹沒 yān mò
    overwrite: 覆寫 fù xiě, 覆蓋 fù gài
    owe: 欠 qiàn, 虧欠 kuī qiàn
    own: 擁有 yōng yǒu [s], 持有 chí yǒu [s]
    pacify: 平息 píng xí, 安撫 ān fǔ
    pack: 打包 dǎ bāo, 收拾 shōu shí, 包裝 bāo zhuāng
    paddle: 划 huá, 划|槳 huá jiǎng
    paint: 畫 huà, 油漆 yóu qī, 粉刷 fěn shuā
    parade: 遊行 yóu xíng, 列|隊 liè duì
    paralyze: 癱瘓 tān huàn, 麻痺 má bì
    paraphrase: 改寫 gǎi xiě
    park: 停|車 tíng chē, 泊|車 bó chē
    parody: 諷刺 fěng cì, 模仿 mó fǎng
    partake: 參與 cān yù, 分享 fēn xiǎng
    participate: 參加 cān jiā, 參與 cān yù
    pass: 經過 jīng guò, 通過 tōng guò, 傳 chuán
    paste: 貼上 tiē shàng, 黏貼 nián tiē
    pat: 輕拍 qīng pāi, 拍 pāi
    patch: 補 bǔ, 修補 xiū bǔ
    patrol: 巡邏 xún luó
    pause: 暫停 zàn tíng, 停頓 tíng dùn
    pave: 鋪 pū, 鋪|路 pū lù
    pawn: 典當 diǎn dàng, 抵押 dǐ yā
    pay: 付 fù, 支付 zhī fù, 付|錢 fù qián
    pay back: 還 huán, 償還 cháng huán
    pedal: 踩 cǎi, 騎|車 qí chē
    peek: 偷看 tōu kàn, 窺探 kuī tàn
    peel: 削|皮 xiāo pí, 去|皮 qù pí
    penalize: 處罰 chǔ fá, 懲罰 chéng fá
    perceive: 察覺 chá jué, 感知 gǎn zhī
    perch: 棲息 qī xí, 停歇 tíng xiē
    perfect: 完善 wán shàn, 改進 gǎi jìn
    perform: 表演 biǎo yǎn, 執行 zhí xíng, 演出 yǎn chū
    perish: 滅亡 miè wáng, 喪生 sàng shēng
    permit: 允許 yǔn xǔ, 准許 zhǔn xǔ
    perpetuate: 延續 yán xù, 維持 wéi chí
    persevere: 堅持 jiān chí
    persist: 堅持 jiān chí, 持續 chí xù
    persuade: 說服 shuō fú, 勸 quàn
    pester: 糾纏 jiū chán, 煩擾 fán rǎo
    phone: 打|電話 dǎ diàn huà
    photograph: 拍|照 pāi zhào, 攝影 shè yǐng
    pick: 挑選 tiāo xuǎn, 摘 zhāi, 採 cǎi
    pick out: 挑出 tiāo chū, 選出 xuǎn chū
    pick up: 撿 jiǎn, 接 jiē (a person), 拾起 shí qǐ
    pierce: 刺穿 cì chuān, 穿透 chuān tòu
    pile up: 堆積 duī jī, 堆起 duī qǐ
    pilot: 駕駛 jià shǐ, 試行 shì xíng
    pin: 別住 bié zhù, 釘住 dìng zhù
    pinch: 捏 niē, 掐 qiā
    pinpoint: 找出 zhǎo chū, 查明 chá míng
    pitch: 投 tóu, 投擲 tóu zhì
    pity: 同情 tóng qíng, 可憐 kě lián
    place: 放 fàng, 放置 fàng zhì, 擺放 bǎi fàng
    plague: 折磨 zhé mó, 困擾 kùn rǎo
    plan: 計劃 jì huà, 規劃 guī huà, 打算 dǎ suàn
    plant: 種 zhòng, 種植 zhòng zhí, 栽 zāi
    plaster: 抹|灰 mǒ huī, 粉刷 fěn shuā
    play: 玩 wán (games), 打 dǎ (ball sports), 彈 tán (strings, piano), 演奏 yǎn zòu (an instrument)
    plead: 懇求 kěn qiú, 辯護 biàn hù
    please: 取悅 qǔ yuè, 討好 tǎo hǎo
    pledge: 保證 bǎo zhèng, 發|誓 fā shì
    plot: 密謀 mì móu, 策劃 cè huà, 繪製 huì zhì
    plow: 犁 lí, 耕 gēng, 耕|田 gēng tián
    pluck: 拔 bá, 摘 zhāi, 彈撥 tán bō
    plug: 插 chā, 插上 chā shàng, 堵住 dǔ zhù
    plunder: 掠奪 lüè duó, 搶劫 qiǎng jié
    plunge: 跳入 tiào rù, 暴跌 bào diē, 衝入 chōng rù
    point: 指 zhǐ, 指向 zhǐ xiàng
    point out: 指出 zhǐ chū
    poison: 下|毒 xià dú, 毒害 dú hài
    poke: 戳 chuō, 捅 tǒng
    polish: 擦亮 cā liàng, 拋光 pāo guāng, 打磨 dǎ mó
    pollute: 汙染 wū rǎn
    ponder: 思考 sī kǎo, 琢磨 zuó mó
    pop: 爆開 bào kāi, 戳破 chuō pò
    populate: 居住 jū zhù
    portray: 描繪 miáo huì, 扮演 bàn yǎn
    pose: 擺|姿勢 bǎi zī shì, 提出 tí chū (a question)
    position: 放置 fàng zhì, 定位 dìng wèi
    possess: 擁有 yōng yǒu [s], 具有 jù yǒu [s]
    post: 發布 fā bù, 張貼 zhāng tiē, 發|文 fā wén
    postpone: 延後 yán hòu, 推遲 tuī chí, 延|期 yán qí
    pound: 重擊 zhòng jī, 搗 dǎo, 猛敲 měng qiāo
    pour: 倒 dào, 倒入 dào rù, 斟 zhēn
    practice: 練習 liàn xí, 實行 shí xíng
    praise: 讚美 zàn měi, 稱讚 chēng zàn
    pray: 祈禱 qí dǎo, 禱告 dǎo gào
    preach: 傳道 chuán dào, 說教 shuō jiào
    precede: 先於 xiān yú [s], 領先 lǐng xiān
    predict: 預測 yù cè, 預言 yù yán
    prefer: 偏好 piān hào [s], 寧願 nìng yuàn [s]
    preheat: 預熱 yù rè
    preoccupy: 困擾 kùn rǎo
    prepare: 準備 zhǔn bèi, 預備 yù bèi
    prescribe: 開|藥方 kāi yào fāng, 規定 guī dìng
    present: 呈現 chéng xiàn, 展示 zhǎn shì, 贈送 zèng sòng
    preserve: 保存 bǎo cún, 保護 bǎo hù
    preside: 主持 zhǔ chí
    press: 按 àn, 壓 yā, 擠壓 jǐ yā
    presume: 推測 tuī cè, 假定 jiǎ dìng
    pretend: 假裝 jiǎ zhuāng, 裝 zhuāng
    prevail: 盛行 shèng xíng, 取勝 qǔ shèng
    prevent: 阻止 zǔ zhǐ, 預防 yù fáng, 防止 fáng zhǐ
    prick: 刺 cì, 戳 chuō
    print: 列印 liè yìn, 印刷 yìn shuā
    probe: 探測 tàn cè, 調查 diào chá
    proceed: 進行 jìn xíng, 前進 qián jìn
    process: 處理 chǔ lǐ, 加工 jiā gōng
    proclaim: 宣告 xuān gào, 宣布 xuān bù
    produce: 生產 shēng chǎn, 製作 zhì zuò, 產生 chǎn shēng
    profess: 聲稱 shēng chēng, 表明 biǎo míng
    program: 編寫 biān xiě, 寫|程式 xiě chéng shì
    progress: 進步 jìn bù, 進展 jìn zhǎn
    prohibit: 禁止 jìn zhǐ
    project: 投影 tóu yǐng, 預測 yù cè, 規劃 guī huà
    prolong: 延長 yán cháng
    promise: 答應 dā yìng, 承諾 chéng nuò, 保證 bǎo zhèng
    promote: 促進 cù jìn, 晉升 jìn shēng, 推廣 tuī guǎng
    prompt: 促使 cù shǐ, 提示 tí shì
    pronounce: 發|音 fā yīn, 宣布 xuān bù
    propagate: 傳播 chuán bō, 繁殖 fán zhí
    propel: 推進 tuī jìn, 驅動 qū dòng
    propose: 提議 tí yì, 求|婚 qiú hūn, 建議 jiàn yì
    prosecute: 起訴 qǐ sù, 追訴 zhuī sù
    prosper: 繁榮 fán róng, 興旺 xīng wàng
    protect: 保護 bǎo hù, 保衛 bǎo wèi
    protest: 抗議 kàng yì, 示威 shì wēi
    protrude: 突出 tū chū, 凸出 tū chū
    prove: 證明 zhèng míng, 證實 zhèng shí
    provide: 提供 tí gōng, 供應 gōng yìng
    provoke: 挑釁 tiǎo xìn, 激怒 jī nù, 引起 yǐn qǐ
    prune: 修剪 xiū jiǎn, 剪|枝 jiǎn zhī
    pry: 窺探 kuī tàn, 撬開 qiào kāi
    publish: 出版 chū bǎn, 發表 fā biǎo, 發行 fā xíng
    pull: 拉 lā, 拖 tuō, 拔 bá
    pulse: 跳動 tiào dòng, 脈動 mài dòng
    pump: 抽 chōu, 打|氣 dǎ qì
    punch: 揍 zòu, 拳打 quán dǎ, 打|孔 dǎ kǒng
    punctuate: 加|標點 jiā biāo diǎn, 打斷 dǎ duàn
    puncture: 刺破 cì pò, 扎破 zhā pò
    punish: 懲罰 chéng fá, 處罰 chǔ fá
    purchase: 購買 gòu mǎi, 買 mǎi
    purge: 清除 qīng chú, 淨化 jìng huà
    purify: 淨化 jìng huà, 提純 tí chún
    pursue: 追求 zhuī qiú, 追趕 zhuī gǎn
    push: 推 tuī, 推動 tuī dòng
    put: 放 fàng, 擺 bǎi
    put off: 推遲 tuī chí, 延後 yán hòu
    puzzle: 困惑 kùn huò, 難住 nán zhù
    quake: 震動 zhèn dòng, 顫抖 chàn dǒu
    qualify: 合|格 hé gé, 符合 fú hé [s]
    quarrel: 爭吵 zhēng chǎo, 吵|架 chǎo jià
    quench: 解|渴 jiě kě, 熄滅 xí miè
    query: 查詢 chá xún, 詢問 xún wèn
    question: 質疑 zhì yí, 詢問 xún wèn
    quit: 辭|職 cí zhí, 退出 tuì chū, 放棄 fàng qì
    quiver: 顫抖 chàn dǒu, 發|抖 fā dǒu
    quote: 引用 yǐn yòng, 報|價 bào jià
    race: 賽|跑 sài pǎo, 競賽 jìng sài, 比賽 bǐ sài
    radiate: 輻射 fú shè, 散發 sàn fā
    raid: 突襲 tū xí, 搶劫 qiǎng jié
    rain: 下|雨 xià yǔ
    raise: 舉起 jǔ qǐ, 提高 tí gāo, 養 yǎng (children)
    rally: 集結 jí jié, 召集 zhào jí
    ram: 撞 zhuàng, 猛撞 měng zhuàng
    ramble: 漫步 màn bù, 閒逛 xián guàng
    rank: 排|名 pái míng, 排列 pái liè
    rant: 咆哮 páo xiào, 發|牢騷 fā láo sāo
    rate: 評|分 píng fēn, 評價 píng jià
    rationalize: 合理化 hé lǐ huà
    rattle: 嘎嘎響 gā gā xiǎng
    reach: 到達 dào dá [a], 達到 dá dào, 伸|手 shēn shǒu
    react: 反應 fǎn yìng, 回應 huí yìng
    read: 讀 dú, 閱讀 yuè dú, 看 kàn
    reap: 收割 shōu gē, 收穫 shōu huò
    rear: 養育 yǎng yù, 飼養 sì yǎng
    reason: 推理 tuī lǐ, 思考 sī kǎo
    reassure: 安慰 ān wèi, 安撫 ān fǔ
    rebuild: 重建 chóng jiàn
    rebuke: 斥責 chì zé, 責備 zé bèi
    recall: 回憶 huí yì, 想起 xiǎng qǐ, 召回 zhào huí
    recede: 後退 hòu tuì, 退去 tuì qù
    receive: 收到 shōu dào, 接收 jiē shōu, 接受 jiē shòu
    recharge: 充|電 chōng diàn
    reciprocate: 回報 huí bào, 回應 huí yìng
    recite: 背誦 bèi sòng, 朗誦 lǎng sòng
    reckon: 估計 gū jì, 認為 rèn wéi [s]
    reclaim: 收回 shōu huí, 開墾 kāi kěn
    recline: 斜靠 xié kào, 躺 tǎng
    recognize: 認出 rèn chū, 認識 rèn shì, 承認 chéng rèn
    recoil: 退縮 tuì suō, 後退 hòu tuì
    recommend: 推薦 tuī jiàn, 建議 jiàn yì
    reconcile: 和解 hé jiě, 調和 tiáo hé
    reconsider: 重新考慮 chóng xīn kǎo lǜ
    record: 記錄 jì lù, 錄 lù, 錄|音 lù yīn
    recount: 敘述 xù shù, 重新計算 chóng xīn jì suàn
    recover: 恢復 huī fù, 康復 kāng fù, 找回 zhǎo huí
    recreate: 重現 chóng xiàn
    recruit: 招募 zhāo mù, 徵召 zhēng zhào
    rectify: 糾正 jiū zhèng, 矯正 jiǎo zhèng
    recycle: 回收 huí shōu, 資源回收 zī yuán huí shōu
    redeem: 贖回 shú huí, 兌換 duì huàn
    redirect: 重新導向 chóng xīn dǎo xiàng, 轉向 zhuǎn xiàng
    redo: 重做 chóng zuò
    reduce: 減少 jiǎn shǎo, 降低 jiàng dī
    refer: 提及 tí jí, 參考 cān kǎo, 指 zhǐ
    refine: 精煉 jīng liàn, 改進 gǎi jìn
    reflect: 反射 fǎn shè, 反映 fǎn yìng, 反思 fǎn sī
    reform: 改革 gǎi gé, 改造 gǎi zào
    refrain: 避免 bì miǎn, 克制 kè zhì
    refresh: 重新整理 chóng xīn zhěng lǐ, 更新 gēng xīn, 提|神 tí shén
    refrigerate: 冷藏 lěng cáng
    refund: 退|款 tuì kuǎn, 退還 tuì huán
    refuse: 拒絕 jù jué
    regain: 恢復 huī fù, 重新獲得 chóng xīn huò dé
    regard: 看待 kàn dài, 認為 rèn wéi [s]
    regenerate: 再生 zài shēng, 重生 chóng shēng
    register: 註冊 zhù cè, 登記 dēng jì
    regret: 後悔 hòu huǐ, 遺憾 yí hàn [s]
    regulate: 調節 tiáo jié, 管制 guǎn zhì
    rehearse: 排練 pái liàn, 預演 yù yǎn
    reign: 統治 tǒng zhì, 在位 zài wèi [s]
    reinforce: 加強 jiā qiáng, 強化 qiáng huà
    reiterate: 重申 chóng shēn, 重複 chóng fù
    reject: 拒絕 jù jué, 駁回 bó huí
    rekindle: 重燃 chóng rán, 重新點燃 chóng xīn diǎn rán
    relapse: 復發 fù fā
    relate: 講述 jiǎng shù, 關聯 guān lián [s], 有關 yǒu guān [s]
    relax: 放鬆 fàng sōng, 休息 xiū xí
    relay: 傳遞 chuán dì, 轉播 zhuǎn bō
    release: 釋放 shì fàng, 發布 fā bù, 放開 fàng kāi
    relegate: 降|級 jiàng jí, 貶 biǎn
    relent: 讓|步 ràng bù, 心軟 xīn ruǎn
    relieve: 減輕 jiǎn qīng, 緩解 huǎn jiě, 解除 jiě chú
    relish: 享受 xiǎng shòu, 品嚐 pǐn cháng
    reload: 重新載入 chóng xīn zài rù, 重新裝填 chóng xīn zhuāng tián
    rely: 依賴 yī lài [s], 依靠 yī kào [s], 相信 xiāng xìn [s]
    remain: 留 liú, 保持 bǎo chí, 剩下 shèng xià
    remark: 說 shuō, 評論 píng lùn, 注意到 zhù yì dào [a]
    remedy: 補救 bǔ jiù, 糾正 jiū zhèng
    remember: 記得 jì dé [s], 記住 jì zhù
    remind: 提醒 tí xǐng
    remit: 匯|款 huì kuǎn, 免除 miǎn chú
    remodel: 改建 gǎi jiàn, 重新裝修 chóng xīn zhuāng xiū
    remove: 移除 yí chú, 拿掉 ná diào, 去掉 qù diào
    rename: 重新命名 chóng xīn mìng míng, 改|名 gǎi míng
    renew: 更新 gēng xīn, 續約 xù yuē
    renounce: 放棄 fàng qì, 棄絕 qì jué
    renovate: 翻新 fān xīn, 整修 zhěng xiū
    rent: 租 zū, 租用 zū yòng, 出租 chū zū
    repair: 修理 xiū lǐ, 修復 xiū fù
    repay: 償還 cháng huán, 報答 bào dá
    repeal: 廢除 fèi chú, 撤銷 chè xiāo
    repeat: 重複 chóng fù, 重說 chóng shuō
    repel: 擊退 jī tuì, 排斥 pái chì
    replace: 取代 qǔ dài, 替換 tì huàn, 更換 gēng huàn
    replenish: 補充 bǔ chōng, 補給 bǔ jǐ
    reply: 回答 huí dá, 回覆 huí fù
    report: 報告 bào gào, 報導 bào dǎo, 回報 huí bào
    represent: 代表 dài biǎo, 表示 biǎo shì
    repress: 壓抑 yā yì, 鎮壓 zhèn yā
    reprimand: 責備 zé bèi, 斥責 chì zé
    reproach: 責怪 zé guài, 指責 zhǐ zé
    reproduce: 繁殖 fán zhí, 複製 fù zhì, 再現 zài xiàn
    request: 請求 qǐng qiú, 要求 yāo qiú
    require: 需要 xū yào [s], 要求 yāo qiú
    reschedule: 重新安排 chóng xīn ān pái, 改|期 gǎi qí
    rescind: 撤銷 chè xiāo, 廢止 fèi zhǐ
    rescue: 救 jiù, 營救 yíng jiù, 拯救 zhěng jiù
    research: 研究 yán jiū, 調查 diào chá
    reserve: 預訂 yù dìng, 保留 bǎo liú
    reshape: 重塑 chóng sù, 改造 gǎi zào
    reside: 居住 jū zhù, 定居 dìng jū
    resign: 辭|職 cí zhí, 請辭 qǐng cí
    resist: 抵抗 dǐ kàng, 抗拒 kàng jù
    resolve: 解決 jiě jué, 決心 jué xīn
    resort: 訴諸 sù zhū, 依靠 yī kào [s]
    respect: 尊重 zūn zhòng, 尊敬 zūn jìng
    respond: 回應 huí yìng, 回答 huí dá
    rest: 休息 xiū xí, 歇 xiē
    restart: 重新啟動 chóng xīn qǐ dòng, 重啟 chóng qǐ
    restore: 恢復 huī fù, 修復 xiū fù, 還原 huán yuán
    restrain: 抑制 yì zhì, 克制 kè zhì
    restrict: 限制 xiàn zhì
    result: 導致 dǎo zhì, 源於 yuán yú [s]
    resume: 恢復 huī fù, 繼續 jì xù
    resurrect: 復活 fù huó
    retain: 保留 bǎo liú, 保持 bǎo chí
    retreat: 撤退 chè tuì, 後退 hòu tuì
    retrieve: 取回 qǔ huí, 檢索 jiǎn suǒ
    return: 回來 huí lái, 回去 huí qù, 歸還 guī huán (give back), 返回 fǎn huí
    reunite: 團聚 tuán jù, 重聚 chóng jù
    reveal: 揭露 jiē lù, 透露 tòu lù, 顯示 xiǎn shì
    reverse: 倒轉 dào zhuǎn, 逆轉 nì zhuǎn, 倒|車 dào chē
    revert: 恢復 huī fù, 回復 huí fù
    review: 複習 fù xí, 審查 shěn chá, 評論 píng lùn
    revise: 修改 xiū gǎi, 修訂 xiū dìng
    revive: 復活 fù huó, 復甦 fù sū
    revoke: 撤銷 chè xiāo, 吊銷 diào xiāo
    revolutionize: 革新 gé xīn, 徹底改變 chè dǐ gǎi biàn
    reward: 獎勵 jiǎng lì, 酬謝 chóu xiè
    rhyme: 押|韻 yā yùn
    ride: 騎 qí, 搭 dā, 乘坐 chéng zuò
    ring: 響 xiǎng, 鳴 míng
    rinse: 沖洗 chōng xǐ, 漱|口 shù kǒu, 沖 chōng
    rip: 撕 sī, 撕裂 sī liè
    ripple: 起|波紋 qǐ bō wén
    rise: 上升 shàng shēng, 升起 shēng qǐ, 起|床 qǐ chuáng (get up)
    risk: 冒|險 mào xiǎn
    rival: 競爭 jìng zhēng, 匹敵 pǐ dí
    roam: 漫遊 màn yóu, 徘徊 pái huái, 閒晃 xián huàng
    roar: 吼 hǒu, 咆哮 páo xiào
    roast: 烤 kǎo, 烘烤 hōng kǎo
    rob: 搶 qiǎng, 搶劫 qiǎng jié, 偷 tōu
    roll: 滾 gǔn, 滾動 gǔn dòng, 捲 juǎn
    rotate: 旋轉 xuán zhuǎn, 轉動 zhuàn dòng, 輪流 lún liú
    rouse: 喚醒 huàn xǐng, 激起 jī qǐ
    route: 規劃 guī huà, 導向 dǎo xiàng
    row: 划 huá, 划|船 huá chuán
    rub: 擦 cā, 摩擦 mó cā, 搓 cuō
    ruin: 毀掉 huǐ diào, 毀壞 huǐ huài, 搞砸 gǎo zá
    rule: 統治 tǒng zhì, 規定 guī dìng, 裁決 cái jué
    rumble: 轟隆 hōng lóng
    rummage: 翻找 fān zhǎo, 翻 fān
    run: 跑 pǎo, 奔跑 bēn pǎo, 運行 yùn xíng
    run away: 逃跑 táo pǎo, 跑掉 pǎo diào
    rupture: 破裂 pò liè, 撕裂 sī liè
    rush: 趕 gǎn, 匆忙 cōng máng, 衝 chōng
    rust: 生|鏽 shēng xiù, 氧化 yǎng huà
    rustle: 沙沙響 shā shā xiǎng
    sabotage: 破壞 pò huài, 蓄意破壞 xù yì pò huài
    sacrifice: 犧牲 xī shēng, 獻祭 xiàn jì
    sadden: 傷|心 shāng xīn, 悲傷 bēi shāng
    safeguard: 保障 bǎo zhàng, 捍衛 hàn wèi
    sail: 航行 háng xíng, 揚帆 yáng fān, 開|船 kāi chuán
    salute: 敬|禮 jìng lǐ, 致敬 zhì jìng
    salvage: 搶救 qiǎng jiù, 打撈 dǎ lāo
    sanction: 批准 pī zhǔn, 制裁 zhì cái
    sanitize: 消|毒 xiāo dú, 淨化 jìng huà
    sap: 削弱 xuē ruò, 耗盡 hào jìn
    satisfy: 滿足 mǎn zú
    saturate: 浸透 jìn tòu, 飽和 bǎo hé
    save: 存|錢 cún qián (money), 救 jiù (rescue), 儲存 chǔ cún (keep)
    savor: 品嚐 pǐn cháng, 品味 pǐn wèi
    saw: 鋸 jù, 鋸開 jù kāi
    say: 說 shuō, 講 jiǎng
    scale: 攀登 pān dēng, 縮放 suō fàng
    scan: 掃描 sǎo miáo, 瀏覽 liú lǎn
    scandalize: 震驚 zhèn jīng
    scar: 留|疤 liú bā, 結|疤 jié bā
    scare: 嚇 xià, 驚嚇 jīng xià
    scatter: 散布 sàn bù, 撒 sǎ, 分散 fēn sàn
    schedule: 安排 ān pái, 排程 pái chéng, 預定 yù dìng
    scheme: 密謀 mì móu, 策劃 cè huà
    scold: 罵 mà, 責罵 zé mà, 訓斥 xùn chì
    scoop: 舀 yǎo, 挖 wā
    scorch: 燒焦 shāo jiāo, 燙傷 tàng shāng
    score: 得|分 dé fēn, 進|球 jìn qiú
    scorn: 蔑視 miè shì
    scour: 擦洗 cā xǐ, 搜尋 sōu xún
    scout: 偵察 zhēn chá, 勘查 kān chá
    scrape: 刮 guā, 刮掉 guā diào, 擦傷 cā shāng
    scratch: 抓 zhuā, 搔 sāo, 刮傷 guā shāng
    scream: 尖叫 jiān jiào, 大叫 dà jiào, 喊叫 hǎn jiào
    screw: 擰 nǐng, 鎖|螺絲 suǒ luó sī
    scribble: 亂寫 luàn xiě, 塗鴉 tú yā
    scroll: 捲動 juǎn dòng, 滾動 gǔn dòng
    scrub: 刷洗 shuā xǐ, 擦洗 cā xǐ
    scrutinize: 審視 shěn shì, 細察 xì chá
    sculpt: 雕塑 diāo sù, 雕刻 diāo kè
    seal: 密封 mì fēng, 封 fēng, 蓋|章 gài zhāng
    search: 搜尋 sōu xún, 搜索 sōu suǒ, 尋找 xún zhǎo
    season: 調|味 tiáo wèi
    secure: 確保 què bǎo, 固定 gù dìng, 保障 bǎo zhàng
    sedate: 鎮靜 zhèn jìng
    seduce: 誘惑 yòu huò, 勾引 gōu yǐn
    see: 看 kàn, 看見 kàn jiàn [a], 見 jiàn
    seek: 尋求 xún qiú, 尋找 xún zhǎo
    seem: 似乎 sì hū [s], 看起來 kàn qǐ lái [s], 好像 hǎo xiàng [s]
    segment: 分割 fēn gē, 分段 fēn duàn
    segregate: 隔離 gé lí, 分隔 fēn gé
    select: 選擇 xuǎn zé, 選取 xuǎn qǔ
    sell: 賣 mài, 販售 fàn shòu
    send: 寄 jì, 送 sòng, 發送 fā sòng
    send back: 退回 tuì huí, 寄回 jì huí
    sentence: 判|刑 pàn xíng, 宣判 xuān pàn
    separate: 分開 fēn kāi, 分離 fēn lí, 分 fēn
    serve: 服務 fú wù, 上|菜 shàng cài, 侍奉 shì fèng
    set: 放 fàng, 設置 shè zhì, 設定 shè dìng
    set off: 出發 chū fā, 啟程 qǐ chéng
    set up: 設置 shè zhì, 建立 jiàn lì, 設定 shè dìng
    settle: 解決 jiě jué, 定居 dìng jū, 安頓 ān dùn
    sever: 切斷 qiē duàn, 割斷 gē duàn
    sew: 縫 féng, 縫紉 féng rèn
    shackle: 銬 kào, 束縛 shù fù
    shade: 遮蔽 zhē bì, 遮陰 zhē yīn
    shake: 搖 yáo, 搖晃 yáo huàng, 顫抖 chàn dǒu
    shampoo: 洗|髮 xǐ fà, 洗|頭 xǐ tóu
    shape: 塑造 sù zào, 形成 xíng chéng
    share: 分享 fēn xiǎng, 共用 gòng yòng, 分擔 fēn dān
    shatter: 粉碎 fěn suì, 打碎 dǎ suì, 破碎 pò suì
    shave: 刮|鬍子 guā hú zi, 剃 tì
    shear: 剪|毛 jiǎn máo, 剪 jiǎn
    shed: 流 liú (tears), 脫落 tuō luò, 蛻|皮 tuì pí
    shelter: 庇護 bì hù, 躲避 duǒ bì, 避|難 bì nàn
    shift: 移動 yí dòng, 轉移 zhuǎn yí, 換 huàn
    shimmer: 閃爍 shǎn shuò
    shine: 照耀 zhào yào, 發|光 fā guāng, 發亮 fā liàng
    shiver: 發|抖 fā dǒu, 顫抖 chàn dǒu
    shock: 震驚 zhèn jīng, 電擊 diàn jī
    shoo: 趕走 gǎn zǒu
    shoot: 射擊 shè jī, 開|槍 kāi qiāng, 拍攝 pāi shè
    shorten: 縮短 suō duǎn, 變短 biàn duǎn
    should: 應該 yīng gāi [m]
    shout: 喊 hǎn, 大喊 dà hǎn, 吼叫 hǒu jiào
    shove: 推擠 tuī jǐ, 猛推 měng tuī
    shovel: 鏟 chǎn, 鏟起 chǎn qǐ
    show: 展示 zhǎn shì, 顯示 xiǎn shì, 表現 biǎo xiàn
    show off: 炫耀 xuàn yào, 賣弄 mài nòng
    show up: 出現 chū xiàn, 現身 xiàn shēn, 到場 dào chǎng
    shred: 切碎 qiē suì, 撕碎 sī suì
    shrink: 縮小 suō xiǎo, 收縮 shōu suō
    shudder: 發|抖 fā dǒu, 戰慄 zhàn lì
    shuffle: 洗|牌 xǐ pái
    shun: 迴避 huí bì, 避開 bì kāi
    shut: 關 guān, 關閉 guān bì, 合上 hé shàng
    sidestep: 躲開 duǒ kāi, 迴避 huí bì
    siege: 圍攻 wéi gōng, 圍困 wéi kùn
    sift: 篩 shāi, 過篩 guò shāi
    sigh: 嘆|氣 tàn qì, 嘆息 tàn xí
    sign: 簽 qiān, 簽|名 qiān míng, 簽署 qiān shǔ
    signal: 示意 shì yì, 發|信號 fā xìn hào
    silence: 消音 xiāo yīn, 封|口 fēng kǒu
    simplify: 簡化 jiǎn huà
    simulate: 模擬 mó nǐ
    sing: 唱 chàng, 唱|歌 chàng gē
    singe: 燒焦 shāo jiāo, 燎 liáo
    sink: 沉 chén, 下沉 xià chén, 沉沒 chén mò
    sip: 啜 chuò, 啜飲 chuò yǐn
    skate: 溜|冰 liū bīng, 滑|冰 huá bīng
    sketch: 素描 sù miáo, 勾勒 gōu lè
    skewer: 串起 chuàn qǐ, 串 chuàn
    ski: 滑|雪 huá xuě
    skim: 略讀 lüè dú, 瀏覽 liú lǎn, 撇去 piē qù
    skip: 跳過 tiào guò, 略過 lüè guò, 蹦跳 bèng tiào
    slam: 摔 shuāi, 猛關 měng guān
    slander: 誹謗 fěi bàng, 中傷 zhòng shāng
    slap: 打|耳光 dǎ ěr guāng, 拍打 pāi dǎ
    slash: 砍 kǎn, 劃破 huá pò, 削減 xuē jiǎn
    sleep: 睡 shuì, 睡|覺 shuì jiào
    slice: 切|片 qiē piàn, 切 qiē
    slide: 滑 huá, 滑動 huá dòng
    slip: 滑倒 huá dǎo, 溜走 liū zǒu
    slither: 爬行 pá xíng, 蠕動 rú dòng
    slow: 減|速 jiǎn sù, 放慢 fàng màn
    smash: 砸碎 zá suì, 打碎 dǎ suì, 猛撞 měng zhuàng
    smear: 塗抹 tú mǒ, 抹 mǒ, 誹謗 fěi bàng
    smell: 聞 wén, 聞到 wén dào [a], 嗅 xiù
    smile: 微笑 wēi xiào, 笑 xiào
    smoke: 抽|菸 chōu yān, 吸|菸 xī yān, 冒|煙 mào yān
    smooth: 弄平 nòng píng, 撫平 fǔ píng
    smother: 悶死 mēn sǐ, 窒息 zhì xí
    smuggle: 走私 zǒu sī
    snap: 折斷 zhé duàn, 彈 tán (fingers)
    snarl: 咆哮 páo xiào, 低吼 dī hǒu
    snatch: 搶奪 qiǎng duó, 奪走 duó zǒu
    sneeze: 打|噴嚏 dǎ pēn tì
    sniff: 聞 wén, 嗅 xiù, 吸|鼻子 xī bí zi
    snooze: 打|盹 dǎ dǔn, 小睡 xiǎo shuì
    snore: 打|呼 dǎ hū, 打|鼾 dǎ hān
    snow: 下|雪 xià xuě
    soak: 浸泡 jìn pào, 浸 jìn, 泡 pào
    sob: 啜泣 chuò qì, 抽泣 chōu qì
    socialize: 社交 shè jiāo, 交際 jiāo jì
    soften: 軟化 ruǎn huà, 變軟 biàn ruǎn
    solicit: 懇求 kěn qiú, 徵求 zhēng qiú
    solidify: 凝固 níng gù, 鞏固 gǒng gù
    solve: 解決 jiě jué, 解開 jiě kāi, 解答 jiě dá
    soothe: 安撫 ān fǔ, 緩和 huǎn hé
    sort: 分|類 fēn lèi, 排序 pái xù, 整理 zhěng lǐ
    sound: 響 xiǎng, 聽起來 tīng qǐ lái [s]
    sow: 播|種 bō zhǒng, 播 bō
    sparkle: 閃耀 shǎn yào, 閃爍 shǎn shuò
    spawn: 產|卵 chǎn luǎn, 產生 chǎn shēng
    speak: 說 shuō, 說|話 shuō huà, 講 jiǎng
    specify: 指定 zhǐ dìng, 註明 zhù míng
    speculate: 推測 tuī cè, 投機 tóu jī
    speed: 加速 jiā sù, 飛馳 fēi chí
    spell: 拼 pīn, 拼寫 pīn xiě
    spend: 花 huā (money), 花費 huā fèi, 度過 dù guò (time)
    spill: 灑 sǎ, 潑 pō, 溢出 yì chū
    spin: 旋轉 xuán zhuǎn, 轉 zhuàn, 紡 fǎng
    spit: 吐 tǔ, 吐|口水 tǔ kǒu shuǐ
    splash: 濺 jiàn, 潑 pō, 飛濺 fēi jiàn
    splinter: 碎裂 suì liè, 劈裂 pī liè
    split: 分開 fēn kāi, 劈開 pī kāi, 分攤 fēn tān (a bill), 分裂 fēn liè
    spoil: 寵壞 chǒng huài, 毀壞 huǐ huài, 變質 biàn zhì
    sponsor: 贊助 zàn zhù, 資助 zī zhù
    spot: 發現 fā xiàn [a], 看見 kàn jiàn [a]
    sprain: 扭傷 niǔ shāng
    spray: 噴 pēn, 噴灑 pēn sǎ
    spread: 傳播 chuán bō, 散布 sàn bù, 塗抹 tú mǒ, 展開 zhǎn kāi
    sprinkle: 撒 sǎ, 灑 sǎ
    spur: 刺激 cì jī, 激勵 jī lì, 鞭策 biān cè
    squander: 揮霍 huī huò, 浪費 làng fèi
    squeal: 尖叫 jiān jiào, 吱吱叫 zhī zhī jiào
    squeeze: 擠 jǐ, 榨 zhà, 擠壓 jǐ yā
    squint: 瞇|眼 mī yǎn
    stab: 刺 cì, 捅 tǒng, 刺傷 cì shāng
    stabilize: 穩定 wěn dìng
    stagger: 蹣跚 pán shān, 搖晃 yáo huàng
    stain: 弄髒 nòng zāng, 沾汙 zhān wū, 染|色 rǎn sè
    stall: 熄|火 xí huǒ, 拖延 tuō yán
    stamp: 蓋|章 gài zhāng, 跺|腳 duò jiǎo, 貼|郵票 tiē yóu piào
    start: 開始 kāi shǐ, 啟動 qǐ dòng
    startle: 驚嚇 jīng xià, 嚇 xià
    stash: 藏 cáng, 藏匿 cáng nì
    state: 聲明 shēng míng, 陳述 chén shù, 說明 shuō míng
    stay: 待 dāi, 留 liú, 停留 tíng liú, 住 zhù
    steady: 穩住 wěn zhù, 穩定 wěn dìng
    steal: 偷 tōu, 竊取 qiè qǔ
    steer: 駕駛 jià shǐ, 掌|舵 zhǎng duò
    sterilize: 消|毒 xiāo dú, 殺|菌 shā jūn, 絕|育 jué yù
    stew: 燉 dùn, 燜 mèn
    stick: 黏 nián, 貼 tiē, 刺 cì
    stifle: 壓抑 yā yì, 悶住 mēn zhù
    stigmatize: 汙名化 wū míng huà
    stimulate: 刺激 cì jī, 激發 jī fā
    sting: 螫 shì, 刺痛 cì tòng, 叮 dīng
    stink: 發臭 fā chòu, 臭 chòu
    stipulate: 規定 guī dìng, 約定 yuē dìng
    stir: 攪拌 jiǎo bàn, 攪 jiǎo, 攪動 jiǎo dòng
    stitch: 縫 féng, 縫合 féng hé
    stop: 停 tíng, 停止 tíng zhǐ, 阻止 zǔ zhǐ
    store: 儲存 chǔ cún, 存放 cún fàng, 儲藏 chǔ cáng
    storm: 猛攻 měng gōng, 衝進 chōng jìn
    straighten: 弄直 nòng zhí, 拉直 lā zhí
    strain: 過濾 guò lǜ, 拉傷 lā shāng, 緊繃 jǐn bēng
    strangle: 勒死 lè sǐ, 掐死 qiā sǐ
    strap: 綁 bǎng, 綁住 bǎng zhù
    stray: 迷|路 mí lù, 偏離 piān lí
    strengthen: 加強 jiā qiáng, 強化 qiáng huà
    stress: 強調 qiáng diào, 重視 zhòng shì
    stretch: 伸展 shēn zhǎn, 拉伸 lā shēn, 延伸 yán shēn
    strew: 散布 sàn bù, 撒 sǎ
    string: 串 chuàn, 穿|線 chuān xiàn
    strip: 脫 tuō, 剝去 bāo qù, 剝奪 bō duó
    stroke: 撫摸 fǔ mō, 輕撫 qīng fǔ
    stroll: 散|步 sàn bù, 閒逛 xián guàng, 漫步 màn bù
    struggle: 掙扎 zhēng zhá, 奮鬥 fèn dòu, 努力 nǔ lì
    strum: 撥弦 bō xián, 彈奏 tán zòu
    study: 學習 xué xí, 研究 yán jiū, 讀|書 dú shū
    stuff: 塞 sāi, 填滿 tián mǎn
    stumble: 絆倒 bàn dǎo, 絆 bàn
    stun: 震懾 zhèn shè, 擊暈 jī yūn
    subdue: 制服 zhì fú, 征服 zhēng fú
    submit: 提交 tí jiāo, 屈服 qū fú
    subscribe: 訂閱 dìng yuè
    subsidize: 補貼 bǔ tiē, 資助 zī zhù
    substitute: 代替 dài tì, 替換 tì huàn
    subtract: 減去 jiǎn qù, 扣除 kòu chú
    succeed: 成功 chéng gōng, 接替 jiē tì
    succumb: 屈服 qū fú, 敗給 bài gěi
    suck: 吸 xī, 吮 shǔn
    sue: 起訴 qǐ sù, 控告 kòng gào
    suffer: 受|苦 shòu kǔ, 遭受 zāo shòu, 忍受 rěn shòu
    suffocate: 窒息 zhì xí, 悶死 mēn sǐ
    suggest: 建議 jiàn yì, 提議 tí yì, 暗示 àn shì
    suit: 適合 shì hé [s], 合適 hé shì [s]
    sum: 加總 jiā zǒng, 總結 zǒng jié
    summarize: 總結 zǒng jié, 概括 gài kuò
    summon: 召喚 zhào huàn, 傳喚 chuán huàn
    supersede: 取代 qǔ dài
    supervise: 監督 jiān dū, 督導 dū dǎo
    supplement: 補充 bǔ chōng, 增補 zēng bǔ
    supply: 供應 gōng yìng, 提供 tí gōng
    support: 支持 zhī chí, 支撐 zhī chēng, 扶持 fú chí
    suppose: 假設 jiǎ shè, 以為 yǐ wéi [s]
    suppress: 鎮壓 zhèn yā, 抑制 yì zhì
    surf: 衝浪 chōng làng, 上|網 shàng wǎng
    surge: 湧起 yǒng qǐ, 激增 jī zēng
    surmise: 推測 tuī cè, 猜測 cāi cè
    surpass: 超越 chāo yuè, 勝過 shèng guò
    surprise: 嚇到 xià dào, 驚訝 jīng yà [s]
    surrender: 投|降 tóu xiáng, 交出 jiāo chū
    surround: 包圍 bāo wéi, 圍繞 wéi rào
    survey: 調查 diào chá, 測量 cè liáng, 勘測 kān cè
    survive: 倖存 xìng cún, 存活 cún huó, 生還 shēng huán
    suspect: 懷疑 huái yí, 猜疑 cāi yí
    suspend: 暫停 zàn tíng, 懸掛 xuán guà, 停|職 tíng zhí
    sustain: 維持 wéi chí, 支撐 zhī chēng, 承受 chéng shòu
    swallow: 吞 tūn, 吞嚥 tūn yàn
    swap: 交換 jiāo huàn, 互換 hù huàn
    sway: 搖擺 yáo bǎi, 搖晃 yáo huàng
    swear: 發|誓 fā shì, 咒罵 zhòu mà
    sweat: 流|汗 liú hàn, 出|汗 chū hàn
    sweep: 掃 sǎo, 打掃 dǎ sǎo, 掃|地 sǎo dì
    sweeten: 加|糖 jiā táng
    swell: 腫 zhǒng, 腫脹 zhǒng zhàng, 膨脹 péng zhàng
    swim: 游|泳 yóu yǒng, 游 yóu
    swindle: 詐騙 zhà piàn, 騙 piàn
    swing: 搖擺 yáo bǎi, 盪 dàng, 盪|鞦韆 dàng qiū qiān
    swipe: 滑動 huá dòng, 刷 shuā
    switch: 切換 qiē huàn, 換 huàn, 轉換 zhuǎn huàn
    symbolize: 象徵 xiàng zhēng
    sympathize: 同情 tóng qíng, 體諒 tǐ liàng
    sync: 同步 tóng bù
    synchronize: 同步 tóng bù
    synthesize: 合成 hé chéng, 綜合 zōng hé
    tack: 釘 dìng, 釘上 dìng shàng
    tackle: 處理 chǔ lǐ, 應對 yìng duì, 擒抱 qín bào
    tag: 標記 biāo jì
    tailor: 訂製 dìng zhì, 修改 xiū gǎi
    taint: 汙染 wū rǎn, 玷汙 diàn wū
    take: 拿 ná, 取 qǔ, 帶 dài (take along), 拿走 ná zǒu
    take care of: 照顧 zhào gù
    take off: 脫 tuō (clothes), 起飛 qǐ fēi (a plane)
    take part: 參加 cān jiā, 參與 cān yù
    talk: 說|話 shuō huà, 談 tán, 聊 liáo
    tally: 統計 tǒng jì, 計算 jì suàn
    tame: 馴服 xùn fú, 馴養 xùn yǎng
    tamper: 篡改 cuàn gǎi, 亂動 luàn dòng
    tan: 曬黑 shài hēi, 曬|太陽 shài tài yáng
    tangle: 纏繞 chán rào, 打|結 dǎ jié
    tap: 輕敲 qīng qiāo, 點按 diǎn àn
    tape: 錄 lù, 貼|膠帶 tiē jiāo dài
    taper: 變細 biàn xì
    target: 瞄準 miáo zhǔn, 針對 zhēn duì
    tarnish: 玷汙 diàn wū
    taste: 嚐 cháng, 品嚐 pǐn cháng, 嚐起來 cháng qǐ lái [s]
    tattoo: 刺青 cì qīng
    taunt: 嘲弄 cháo nòng, 挑釁 tiǎo xìn
    tax: 課|稅 kè shuì, 徵|稅 zhēng shuì
    teach: 教 jiāo, 教導 jiào dǎo, 教|書 jiāo shū
    tear: 撕 sī, 撕開 sī kāi, 撕裂 sī liè
    tear down: 拆除 chāi chú, 拆毀 chāi huǐ
    tease: 戲弄 xì nòng, 逗 dòu, 取笑 qǔ xiào
    telephone: 打|電話 dǎ diàn huà
    tell: 告訴 gào sù, 說 shuō, 講 jiǎng (a story)
    tell off: 罵 mà, 訓斥 xùn chì
    tempt: 誘惑 yòu huò, 引誘 yǐn yòu
    tend: 傾向 qīng xiàng [s], 照料 zhào liào
    tenderize: 嫩化 nèn huà, 拍鬆 pāi sōng
    terminate: 終止 zhōng zhǐ, 結束 jié shù, 解除 jiě chú
    terrify: 驚嚇 jīng xià, 嚇壞 xià huài
    test: 測試 cè shì, 考 kǎo, 檢驗 jiǎn yàn
    testify: 作|證 zuò zhèng, 證明 zhèng míng
    tether: 拴住 shuān zhù, 繫 jì
    thank: 謝 xiè, 感謝 gǎn xiè
    thaw: 解凍 jiě dòng, 融化 róng huà
    thicken: 變濃 biàn nóng, 勾|芡 gōu qiàn, 變稠 biàn chóu
    thin: 變瘦 biàn shòu, 稀釋 xī shì
    think: 想 xiǎng (ponder), 認為 rèn wéi [s] (believe), 思考 sī kǎo
    think about: 想 xiǎng, 考慮 kǎo lǜ
    thread: 穿|線 chuān xiàn, 穿 chuān
    threaten: 威脅 wēi xié, 恐嚇 kǒng hè
    thrill: 興奮 xīng fèn, 激動 jī dòng
    thrive: 興盛 xīng shèng, 繁榮 fán róng
    throb: 跳動 tiào dòng, 抽痛 chōu tòng
    throttle: 勒住 lè zhù, 節流 jié liú
    throw: 丟 diū, 扔 rēng, 投 tóu, 擲 zhì
    throw away: 丟掉 diū diào, 扔掉 rēng diào
    thrust: 猛推 měng tuī, 刺 cì
    thump: 重擊 zhòng jī
    thunder: 打|雷 dǎ léi
    thwart: 阻撓 zǔ náo, 挫敗 cuò bài
    tick: 打|勾 dǎ gōu, 滴答響 dī dā xiǎng
    tidy: 整理 zhěng lǐ, 收拾 shōu shí
    tie: 綁 bǎng, 繫 jì, 打|結 dǎ jié
    tighten: 拉緊 lā jǐn, 鎖緊 suǒ jǐn
    tilt: 傾斜 qīng xié, 歪 wāi
    time: 計|時 jì shí
    tingle: 刺痛 cì tòng, 發|麻 fā má
    tint: 染|色 rǎn sè, 著|色 zhuó sè
    tip: 傾斜 qīng xié, 給|小費 gěi xiǎo fèi
    tire: 疲倦 pí juàn, 累 lèi
    title: 命名 mìng míng, 取|名 qǔ míng
    toast: 烤 kǎo, 敬|酒 jìng jiǔ
    toggle: 切換 qiē huàn
    tolerate: 容忍 róng rěn, 忍受 rěn shòu
    tone: 鍛鍊 duàn liàn (muscles), 調|色 tiáo sè
    top: 超過 chāo guò, 勝過 shèng guò
    topple: 推翻 tuī fān, 倒塌 dǎo tā
    torment: 折磨 zhé mó, 煎熬 jiān áo
    torture: 拷打 kǎo dǎ, 折磨 zhé mó
    toss: 拋 pāo, 扔 rēng, 翻動 fān dòng
    touch: 碰 pèng, 摸 mō, 觸摸 chù mō
    tour: 遊覽 yóu lǎn, 巡迴 xún huí
    tow: 拖 tuō, 拖吊 tuō diào
    trace: 追蹤 zhuī zōng, 描 miáo
    track: 追蹤 zhuī zōng, 跟蹤 gēn zōng
    trade: 交易 jiāo yì, 買賣 mǎi mài
    train: 訓練 xùn liàn, 培訓 péi xùn
    trample: 踩踏 cǎi tà, 踐踏 jiàn tà
    transcend: 超越 chāo yuè, 超出 chāo chū
    transcribe: 轉錄 zhuǎn lù, 抄寫 chāo xiě
    transfer: 轉移 zhuǎn yí, 轉|帳 zhuǎn zhàng, 傳輸 chuán shū, 轉乘 zhuǎn chéng
    transform: 轉變 zhuǎn biàn, 變換 biàn huàn, 改造 gǎi zào
    translate: 翻譯 fān yì
    transmit: 傳送 chuán sòng, 傳輸 chuán shū, 傳播 chuán bō
    transpire: 發生 fā shēng, 蒸散 zhēng sàn
    transplant: 移植 yí zhí
    transport: 運輸 yùn shū, 運送 yùn sòng
    trap: 困住 kùn zhù, 誘捕 yòu bǔ, 設|陷阱 shè xiàn jǐng
    travel: 旅行 lǚ xíng, 旅遊 lǚ yóu, 行駛 xíng shǐ
    traverse: 穿越 chuān yuè, 橫越 héng yuè
    tread: 踩 cǎi, 踏 tà
    treasure: 珍惜 zhēn xī, 珍藏 zhēn cáng
    treat: 對待 duì dài, 治療 zhì liáo, 請|客 qǐng kè
    tremble: 顫抖 chàn dǒu, 發|抖 fā dǒu, 哆嗦 duō suō
    trick: 欺騙 qī piàn, 耍 shuǎ, 騙 piàn
    trickle: 滴 dī, 滴流 dī liú
    trigger: 觸發 chù fā, 引發 yǐn fā, 啟動 qǐ dòng
    trim: 修剪 xiū jiǎn, 剪 jiǎn, 削減 xuē jiǎn
    trip: 絆倒 bàn dǎo, 絆 bàn
    triple: 變成三倍 biàn chéng sān bèi
    trivialize: 輕視 qīng shì, 淡化 dàn huà
    trot: 小跑 xiǎo pǎo, 慢跑 màn pǎo
    trouble: 麻煩 má fán, 打擾 dǎ rǎo, 困擾 kùn rǎo
    truncate: 截斷 jié duàn, 截短 jié duǎn
    trust: 信任 xìn rèn, 相信 xiāng xìn [s]
    try: 嘗試 cháng shì, 試 shì, 試用 shì yòng (try out)
    try on: 試穿 shì chuān
    tuck: 塞進 sāi jìn, 掖 yē
    tumble: 跌落 diē luò, 摔倒 shuāi dǎo, 翻滾 fān gǔn
    tune: 調|音 tiáo yīn, 調整 tiáo zhěng
    tunnel: 挖|隧道 wā suì dào
    turn: 轉 zhuǎn, 轉|彎 zhuǎn wān, 轉動 zhuàn dòng
    turn around: 轉|身 zhuǎn shēn, 掉|頭 diào tóu
    turn down: 拒絕 jù jué, 調低 tiáo dī (volume)
    turn into: 變成 biàn chéng, 轉變成 zhuǎn biàn chéng
    turn off: 關 guān, 關掉 guān diào
    turn on: 開 kāi, 打開 dǎ kāi
    turn up: 調高 tiáo gāo, 出現 chū xiàn
    tweet: 發|推文 fā tuī wén
    twinkle: 閃爍 shǎn shuò
    twirl: 旋轉 xuán zhuǎn, 轉|圈 zhuàn quān
    type: 打|字 dǎ zì, 輸入 shū rù
    umpire: 當|裁判 dāng cái pàn
    unbutton: 解|釦子 jiě kòu zi
    uncover: 揭開 jiē kāi, 發現 fā xiàn [a], 揭露 jiē lù
    underestimate: 低估 dī gū
    undergo: 經歷 jīng lì, 接受 jiē shòu, 遭受 zāo shòu
    underline: 畫|底線 huà dǐ xiàn, 強調 qiáng diào
    undermine: 破壞 pò huài, 削弱 xuē ruò
    underpin: 支撐 zhī chēng, 支持 zhī chí
    understand: 懂 dǒng [s], 了解 liǎo jiě, 明白 míng bái [s], 理解 lǐ jiě
    understate: 淡化 dàn huà, 低估 dī gū
    undertake: 承擔 chéng dān, 著手 zhuó shǒu, 從事 cóng shì
    underwrite: 承保 chéng bǎo, 簽署 qiān shǔ
    undo: 撤銷 chè xiāo, 解開 jiě kāi, 復原 fù yuán
    undress: 脫|衣服 tuō yī fú
    unearth: 挖出 wā chū, 發掘 fā jué
    unfasten: 解開 jiě kāi, 鬆開 sōng kāi
    unfold: 展開 zhǎn kāi, 攤開 tān kāi
    unfurl: 展開 zhǎn kāi, 攤開 tān kāi
    unhook: 解開 jiě kāi, 取下 qǔ xià
    unify: 統一 tǒng yī, 整合 zhěng hé
    uninstall: 解除安裝 jiě chú ān zhuāng, 移除 yí chú
    unite: 團結 tuán jié, 聯合 lián hé
    unleash: 釋放 shì fàng, 放出 fàng chū
    unload: 卸 xiè, 卸|貨 xiè huò, 卸載 xiè zài
    unmask: 揭穿 jiē chuān, 揭露 jiē lù
    unpack: 拆開 chāi kāi, 解壓縮 jiě yā suō
    unplug: 拔掉 bá diào, 拔|插頭 bá chā tóu
    unravel: 解開 jiě kāi, 拆開 chāi kāi, 理清 lǐ qīng
    unroll: 展開 zhǎn kāi, 攤開 tān kāi
    unscrew: 擰開 nǐng kāi, 旋開 xuán kāi
    unsettle: 擾亂 rǎo luàn
    untie: 解開 jiě kāi
    unveil: 揭幕 jiē mù, 揭開 jiē kāi, 公布 gōng bù
    unwrap: 拆開 chāi kāi, 打開 dǎ kāi
    unzip: 解壓縮 jiě yā suō, 拉開 lā kāi
    update: 更新 gēng xīn
    upgrade: 升級 shēng jí, 提升 tí shēng
    uphold: 維護 wéi hù, 堅持 jiān chí, 支持 zhī chí
    uplift: 提升 tí shēng, 振奮 zhèn fèn
    upload: 上傳 shàng chuán
    uproot: 拔起 bá qǐ, 根除 gēn chú
    upset: 弄翻 nòng fān, 煩擾 fán rǎo, 打翻 dǎ fān
    urge: 敦促 dūn cù, 催促 cuī cù, 力勸 lì quàn
    use: 用 yòng, 使用 shǐ yòng
    usher: 引導 yǐn dǎo, 領 lǐng
    usurp: 篡奪 cuàn duó, 霸佔 bà zhàn
    utilize: 利用 lì yòng, 運用 yùn yòng
    utter: 說出 shuō chū, 發出 fā chū
    vaccinate: 接種 jiē zhòng, 打|疫苗 dǎ yì miáo
    vacuum: 吸|塵 xī chén
    validate: 驗證 yàn zhèng, 確認 què rèn
    value: 重視 zhòng shì, 珍視 zhēn shì, 評估 píng gū
    vandalize: 破壞 pò huài, 蓄意破壞 xù yì pò huài
    vanish: 消失 xiāo shī [a], 不見 bú jiàn [a]
    vaporize: 汽化 qì huà, 蒸發 zhēng fā
    varnish: 上|漆 shàng qī
    vary: 變化 biàn huà, 不同 bù tóng [s]
    veer: 轉向 zhuǎn xiàng, 偏離 piān lí
    vent: 發洩 fā xiè, 宣洩 xuān xiè
    ventilate: 通|風 tōng fēng
    venture: 冒|險 mào xiǎn, 敢於 gǎn yú
    verify: 驗證 yàn zhèng, 核實 hé shí
    veto: 否決 fǒu jué
    vex: 惹惱 rě nǎo, 煩擾 fán rǎo
    vibrate: 振動 zhèn dòng, 震動 zhèn dòng
    victimize: 迫害 pò hài, 欺負 qī fù
    videotape: 錄|影 lù yǐng
    vie: 競爭 jìng zhēng, 角逐 jué zhú
    view: 觀看 guān kàn, 看待 kàn dài
    vilify: 誹謗 fěi bàng, 詆毀 dǐ huǐ
    vindicate: 平反 píng fǎn, 證明 zhèng míng
    violate: 違反 wéi fǎn, 侵犯 qīn fàn
    visit: 拜訪 bài fǎng, 參觀 cān guān, 探望 tàn wàng
    visualize: 想像 xiǎng xiàng, 視覺化 shì jué huà
    vocalize: 發聲 fā shēng, 唱出 chàng chū
    void: 作廢 zuò fèi
    vomit: 嘔吐 ǒu tù, 吐 tù
    vote: 投|票 tóu piào, 表決 biǎo jué
    vouch: 保證 bǎo zhèng, 擔保 dān bǎo
    vow: 發|誓 fā shì, 立|誓 lì shì
    voyage: 航行 háng xíng, 遠航 yuǎn háng
    wade: 涉|水 shè shuǐ, 蹚 tāng
    wag: 搖 yáo, 搖|尾巴 yáo wěi ba
    wail: 哀號 āi háo, 哭嚎 kū háo
    wait: 等 děng, 等待 děng dài
    wait for: 等 děng, 等候 děng hòu
    wait on: 服侍 fú shì, 招待 zhāo dài
    waive: 放棄 fàng qì, 免除 miǎn chú
    wake: 醒 xǐng [a], 叫醒 jiào xǐng
    wake up: 醒來 xǐng lái [a], 叫醒 jiào xǐng
    walk: 走 zǒu, 走|路 zǒu lù, 步行 bù xíng
    wall: 築|牆 zhù qiáng
    waltz: 跳|華爾滋 tiào huá ěr zī
    wander: 漫遊 màn yóu, 閒逛 xián guàng, 徘徊 pái huái
    wane: 衰退 shuāi tuì, 減弱 jiǎn ruò
    want: 想要 xiǎng yào [s], 要 yào [s], 希望 xī wàng [s]
    ward off: 避開 bì kāi, 擋開 dǎng kāi
    warm: 加熱 jiā rè, 暖 nuǎn
    warm up: 暖身 nuǎn shēn, 熱|身 rè shēn
    warn: 警告 jǐng gào, 提醒 tí xǐng
    warp: 變|形 biàn xíng, 扭曲 niǔ qū
    warrant: 保證 bǎo zhèng, 值得 zhí dé [s]
    wash: 洗 xǐ, 清洗 qīng xǐ
    waste: 浪費 làng fèi
    watch: 注視 zhù shì (look at), 看守 kān shǒu (keep watch), 看 kàn (TV, movies)
    water: 澆|水 jiāo shuǐ, 灌溉 guàn gài
    wave: 揮|手 huī shǒu, 揮 huī, 搖 yáo
    waver: 猶豫 yóu yù, 動搖 dòng yáo
    weaken: 削弱 xuē ruò, 減弱 jiǎn ruò
    wean: 斷|奶 duàn nǎi
    wear: 穿 chuān, 戴 dài, 穿戴 chuān dài
    weave: 編織 biān zhī, 織 zhī
    wed: 結|婚 jié hūn, 嫁 jià
    weep: 哭泣 kū qì, 流|淚 liú lèi
    weigh: 稱重 chēng zhòng, 秤 chèng, 重 zhòng [s]
    weigh down: 壓垮 yā kuǎ, 拖累 tuō lěi
    welcome: 歡迎 huān yíng, 迎接 yíng jiē
    weld: 焊接 hàn jiē
    whack: 重擊 zhòng jī, 猛打 měng dǎ
    whip: 鞭打 biān dǎ, 抽 chōu, 打發 dǎ fā
    whisper: 低語 dī yǔ, 耳語 ěr yǔ, 小聲說 xiǎo shēng shuō
    whistle: 吹|口哨 chuī kǒu shào, 鳴笛 míng dí
    whiten: 漂白 piǎo bái, 變白 biàn bái
    whittle: 削 xiāo, 削尖 xiāo jiān
    widen: 拓寬 tuò kuān, 加寬 jiā kuān
    wield: 揮舞 huī wǔ, 運用 yùn yòng
    wiggle: 扭動 niǔ dòng, 擺動 bǎi dòng
    win: 贏 yíng [a], 獲勝 huò shèng [a]
    win over: 說服 shuō fú, 爭取 zhēng qǔ
    wind: 纏繞 chán rào, 蜿蜒 wān yán, 上|發條 shàng fā tiáo
    wink: 眨|眼 zhǎ yǎn, 使|眼色 shǐ yǎn sè
    wipe: 擦 cā, 擦拭 cā shì, 抹 mǒ
    wish: 希望 xī wàng [s], 祝 zhù
    withdraw: 撤回 chè huí, 提|款 tí kuǎn, 退出 tuì chū
    wither: 枯萎 kū wěi, 凋謝 diāo xiè
    withstand: 承受 chéng shòu, 抵擋 dǐ dǎng
    witness: 目擊 mù jī, 見證 jiàn zhèng
    wobble: 搖晃 yáo huàng, 晃動 huàng dòng
    word: 措辭 cuò cí, 表達 biǎo dá
    work: 工作 gōng zuò, 做|事 zuò shì, 運作 yùn zuò (machines)
    work out: 解決 jiě jué, 健|身 jiàn shēn, 運動 yùn dòng
    worry: 擔|心 dān xīn, 憂慮 yōu lǜ
    worsen: 惡化 è huà, 變糟 biàn zāo
    worship: 崇拜 chóng bài, 敬拜 jìng bài
    wound: 傷害 shāng hài, 弄傷 nòng shāng
    wrap: 包 bāo, 包裝 bāo zhuāng, 裹 guǒ
    wreck: 毀壞 huǐ huài, 搞砸 gǎo zá
    wrench: 扭傷 niǔ shāng, 猛扭 měng niǔ
    wrestle: 摔角 shuāi jiǎo, 搏鬥 bó dòu
    wring: 擰 nǐng, 絞 jiǎo
    write: 寫 xiě, 書寫 shū xiě
    write down: 寫下 xiě xià, 記下 jì xià
    write off: 註銷 zhù xiāo, 勾銷 gōu xiāo
    x-ray: 透視 tòu shì
    yank: 猛拉 měng lā, 拔 bá
    yawn: 打|哈欠 dǎ hā qian
    yearn: 渴望 kě wàng [s], 嚮往 xiàng wǎng [s]
    yell: 喊 hǎn, 大叫 dà jiào
    yelp: 尖叫 jiān jiào, 吠叫 fèi jiào
    yield: 產出 chǎn chū, 屈服 qū fú, 讓 ràng
    yoke: 套 tào
    zap: 消滅 xiāo miè, 電擊 diàn jī
    zip: 壓縮 yā suō, 拉上 lā shàng
    zone: 劃分 huà fēn, 分|區 fēn qū
    zoom: 放大 fàng dà, 縮放 suō fàng, 疾駛 jí shǐ
  `;

  // "know: 知道 zhī dào [s] (facts), 認識 rèn shì [s]" -> { know: [{ zh, py, tag, note }, ...] }
  function readEntry(entry, english) {
    const match = entry.match(/^([一-鿿|]+)\s+([^\[(]+?)\s*(?:\[(\w)\])?\s*(?:\((.*)\))?$/);
    if (!match) throw new Error(`verbs.js: cannot read "${entry}" in "${english}"`);
    const [, zh, py, tag, note] = match;
    return { zh, py, tag: tag || '', ...(note ? { note } : {}) };
  }

  const VERBS = parseTable(TABLE, readEntry);

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
