/*
 * Thai verb patterns (standard Thai, Central Thai).
 *
 *   express({ th: 'พูด', rom: 'phut', tag: '' }) -> { th, rom, rows }
 *
 * Thai verbs never change form. Tense, aspect and mood are carried by particles and
 * helper words around the verb (แล้ว, กำลัง ... อยู่, จะ, เคย, เพิ่ง, ไม่, ยัง, อย่า, ถ้า ...),
 * so each entry of `rows` is one way of expressing a tense, aspect or mood as a whole
 * SENTENCE. rows[key] is an array of six cells, one per pronoun (ฉัน, คุณ, เขา, เรา,
 * พวกคุณ, พวกเขา); each cell is { th, rom } or null when the pattern does not suit this
 * kind of verb.
 *
 * Both lines of a cell are written word by word: Thai has no spaces between words, but the
 * Thai line separates the words with single spaces (a learner convention) and the
 * romanization (Royal Thai General System, no tone marks) has exactly one word for each
 * Thai word, so the two lines always have the same number of words. The plural pronouns
 * are two words (พวก คุณ phuak khun, พวก เขา phuak khao). Questions end in "?" and
 * commands in "!"; there is no final full stop. "เขา" stands for "he or she".
 *
 * Verb entries:
 *   th   the verb in Thai script: one word (พูด) or several words separated by single
 *        spaces for a verb + object (กิน ข้าว); particles go before the verb, or around
 *        the whole phrase, so the object stays after the verb
 *   rom  its romanization, one romanized word for each Thai word (kin khao)
 *   tag  "s" state, mental, perception or relational verb (รู้, รัก, ชอบ, เป็น, มี, อยู่),
 *        "a" instant/achievement verb (ถึง, ชนะ, ตาย, เจอ), "m" modal verb (ต้อง, ควร,
 *        สามารถ, อาจ, ได้), or "" for an ordinary action verb
 *
 * Irregular details handled here:
 *   - เป็น (to be): negative ไม่ ใช่ (ฉัน ไม่ ใช่), never กำลัง; คือ keeps only the statement,
 *     "if" and ไม่ ใช่. มี (to have): ไม่ มี, ยัง ไม่ มี, past negative told by ตอน นั้น. อยู่ (to
 *     be at): กำลัง อยู่ and อยู่ แล้ว read อยู่ once (so does any verb that holds อยู่).
 *   - Modals (ต้อง, สามารถ, กล้า, ได้, ควร, อาจ ...): present, negation, ยัง ไม่, "if", question and
 *     past/future; ควร and อาจ even fewer; no "in progress", commands or stacked can/should/want.
 *   - ได้ already in the verb (ได้ยิน, ได้รับ, ทำ ได้): no second ได้ in ไม่ ได้, "if I had", "can".
 *   - Verbs that hold ไม่ are not negated again; verbs that hold กัน do not get a second กัน in
 *     "let us ..."; verbs of wanting (อยาก, ต้องการ, ปรารถนา) are not "wanted", หวัง is not "hoped".
 *   - States: V อยู่ แล้ว for "already"; "by then" and "if I had" without เสร็จ and ได้. Relational
 *     states (เหมือน, แตกต่าง, ประกอบ ด้วย ...) refuse "in progress", "just now" and commands;
 *     punctual events (ถึง, ลืม, เสร็จ, ระเบิด ...) refuse "in progress".
 *   - เสร็จ and verbs that end in it (ทำ เสร็จ) have no second เสร็จ in the future perfect and no
 *     "in progress"; ไป, มา and arrival verbs (ถึง, เกิด) have plain แล้ว instead of ไป แล้ว. So do verbs that
 *     begin or end with a direction word (กลับไป, เข้ามา, ไป เที่ยว, ได้มา) and verbs that end in a
 *     preposition and wait for their object (พูด ถึง, เห็น ว่า, เกิดจาก): plain แล้ว, no เสร็จ.
 *   - Instant verbs that are themselves a result (สำเร็จ, บรรลุ, สิ้นสุด) are never "in progress"; relations and
 *     appearances (ดูเหมือน, สังกัด, สอดคล้อง ...) are neither "in progress" nor "just now" nor commanded.
 *   - Weather verbs (ฝน ตก, หิมะ ตก, ฟ้า ร้อง ...) have their own subject and no commands, can or
 *     should; "want" is อยาก ให้ ฝน ตก.
 *
 * Invalid input: express() THROWS an Error whose message starts with "Thai express():"
 * (empty verb, text that is not Thai script, a romanization with a different number of
 * words, an unknown tag ...). It never guesses.
 */
(function (global) {
  'use strict';

  const { words } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  // ---- Words used by the patterns ------------------------------------------------
  // A token is one Thai word with its romanization: [th, rom].

  const w = (th, rom) => ({ th, rom });
  const W = {
    chan: w('ฉัน', 'chan'), khun: w('คุณ', 'khun'), khao: w('เขา', 'khao'), rao: w('เรา', 'rao'),
    phuak: w('พวก', 'phuak'),
    kamlang: w('กำลัง', 'kamlang'), yu: w('อยู่', 'yu'), laeo: w('แล้ว', 'laeo'),
    khoei: w('เคย', 'khoei'), pai: w('ไป', 'pai'), phoeng: w('เพิ่ง', 'phoeng'),
    ton: w('ตอน', 'ton'), nan: w('นั้น', 'nan'), kon: w('ก่อน', 'kon'), na: w('หน้า', 'na'),
    cha: w('จะ', 'cha'), thueng: w('ถึง', 'thueng'), set: w('เสร็จ', 'set'),
    tha: w('ถ้า', 'tha'), dots: w('…', '…'), ko: w('ก็', 'ko'), khong: w('คง', 'khong'),
    dai: w('ได้', 'dai'), wang: w('หวัง', 'wang'), wa: w('ว่า', 'wa'), hai: w('ให้', 'hai'),
    si: w('สิ', 'si'), kan: w('กัน', 'kan'), thoe: w('เถอะ', 'thoe'), ya: w('อย่า', 'ya'),
    loei: w('เลย', 'loei'), mai: w('ไม่', 'mai'), yang: w('ยัง', 'yang'),
    samat: w('สามารถ', 'samat'), khuan: w('ควร', 'khuan'), yak: w('อยาก', 'yak'),
    maiQ: w('ไหม', 'mai'), rue: w('หรือ', 'rue'), chai: w('ใช่', 'chai'),
  };

  // Pronouns by index: 0 ฉัน, 1 คุณ, 2 เขา, 3 เรา, 4 พวกคุณ, 5 พวกเขา. The plural pronouns
  // are two words (พวก + คุณ) so that every Thai word has its own romanized word.
  const PRONOUNS = [[W.chan], [W.khun], [W.khao], [W.rao], [W.phuak, W.khun], [W.phuak, W.khao]];
  const TAGS = ['', 's', 'a', 'm'];

  const isWe = p => p === 3;
  const isYou = p => p === 1 || p === 4;

  // ---- Reading the entry --------------------------------------------------------

  const THAI_WORD = /^[\u0E01-\u0E3A\u0E40-\u0E4E]+$/; // letters, vowels, tone marks, ๆ; no Thai digits

  function fail(message) {
    throw new Error('Thai express(): ' + message);
  }

  function checkEntry(entry) {
    if (!entry || typeof entry !== 'object') fail('the entry must be an object { th, rom, tag }');
    const { th, rom } = entry;
    if (typeof th !== 'string' || !th.trim()) fail('the verb is empty (entry.th must be a Thai verb)');
    if (words(th).join(' ') !== th) fail(`"${th}" has stray spaces; separate words with single spaces`);
    if (th !== th.normalize('NFC')) fail(`"${th}" must be NFC (marks in canonical order)`);
    const thWords = th.split(' ');
    const bad = thWords.find(word => !THAI_WORD.test(word));
    if (bad !== undefined) fail(`"${th}" is not Thai script (check "${bad}"); a verb is Thai letters only, words separated by single spaces`);
    if (thWords.length > 4) fail(`"${th}" has ${thWords.length} words (a verb is one to four words)`);
    if (typeof rom !== 'string' || !rom.trim()) fail(`the romanization of "${th}" is empty (entry.rom)`);
    if (words(rom).join(' ') !== rom) fail(`the romanization "${rom}" has stray spaces; separate words with single spaces`);
    if (!/^[a-z'-]+(?: [a-z'-]+)*$/.test(rom)) fail(`the romanization "${rom}" must be lowercase letters a-z (with ' or - inside a word), no tone marks`);
    const romWords = rom.split(' ');
    if (romWords.length !== thWords.length) {
      fail(`"${th}" has ${thWords.length} word(s) but its romanization "${rom}" has ${romWords.length}; write one romanized word for each Thai word`);
    }
    const tag = entry.tag === undefined || entry.tag === null ? '' : entry.tag;
    if (!TAGS.includes(tag)) fail(`unknown tag "${tag}" for "${th}" (use "", "s", "a" or "m")`);
    return { th, rom, tag, thWords, romWords };
  }

  // ---- Rendering ----------------------------------------------------------------

  // Parts may be tokens or arrays of tokens; `mark` ("?" or "!") closes the sentence.
  function render(parts, mark) {
    const list = parts.flat(Infinity);
    const th = list.map(t => t.th);
    const rom = list.map(t => t.rom);
    if (mark) { th[th.length - 1] += mark; rom[rom.length - 1] += mark; }
    return { th: th.join(' '), rom: rom.join(' ') };
  }
  const MARKS = { impAff: '!', impNeg: '!', qMai: '?', qYet: '?' };

  // ---- The patterns --------------------------------------------------------------
  // Each takes the subject S (the pronoun's tokens), the person index p and the context c
  // built from the verb (see context() below), and returns parts for render().
  // c.v is the verb phrase; c.tail, c.condTail, c.finish and c.hypVerb are the pieces that
  // depend on the kind of verb. Weather verbs have their own subject (c.subj: ฝน ตก).

  // For a weather verb every sentence takes c.subj as its subject, except "wish" and "want",
  // which keep the pronoun as the one who hopes or wants (see express()).
  const PATTERNS = {
    pres: (S, p, c) => [S, c.v],
    // กำลัง ... อยู่ is "in the middle of"; a verb that already holds อยู่ keeps it once
    prog: (S, p, c) => [S, W.kamlang, c.v, c.hasYu ? [] : W.yu],
    completed: (S, p, c) => [S, c.v, W.laeo],
    exper: (S, p, c) => [S, W.khoei, c.v],
    perfect: (S, p, c) => [S, c.v, c.tail],
    recent: (S, p, c) => [S, W.phoeng, c.v],
    pastprog: (S, p, c) => [W.ton, W.nan, S, W.kamlang, c.v, c.hasYu ? [] : W.yu],
    pluperf: (S, p, c) => [W.kon, W.na, W.nan, S, c.v, c.tail],
    fut: (S, p, c) => [S, W.cha, c.v],
    nearfut: (S, p, c) => [S, W.kamlang, W.cha, c.v],
    futperf: (S, p, c) => [W.thueng, W.ton, W.nan, S, W.cha, c.v, c.finish],

    cond: (S, p, c) => [W.tha, W.dots, S, W.ko, W.cha, c.v],
    condperf: (S, p, c) => [W.tha, W.ton, W.nan, W.dots, S, W.ko, W.khong, c.v, c.condTail],
    hyp: (S, p, c) => [W.tha, S, c.v],
    hypperf: (S, p, c) => [W.tha, W.ton, W.nan, S, c.hypVerb],
    // "I hope that ... will": the hoper is the pronoun; a weather verb keeps its own subject
    wish: (S, p, c) => [S, W.wang, W.wa, c.subj || S, W.cha, c.v],

    // Commands: "you" is addressed directly (with สิ); "let me / him / them" uses ให้;
    // "we" is the inclusive เรา ... กัน เถอะ (กัน is not repeated if the verb has it).
    impAff: (S, p, c) => {
      if (isWe(p)) return [S, c.v, c.hasKan ? [] : W.kan, W.thoe];
      if (isYou(p)) return [S, c.v, W.si];
      return [W.hai, S, c.v];
    },
    impNeg: (S, p, c) => {
      if (isWe(p)) return [S, W.ya, c.v, c.hasKan ? [] : W.kan, W.loei];
      if (isYou(p)) return [S, W.ya, c.v];
      return [W.ya, W.hai, S, c.v];
    },

    negPres: (S, p, c) => [S, W.mai, c.v],
    negPast: (S, p, c) => [S, W.mai, W.dai, c.v],
    negExper: (S, p, c) => [S, W.mai, W.khoei, c.v],
    negNotYet: (S, p, c) => [S, W.yang, W.mai, W.dai, c.v],

    can: (S, p, c) => [S, W.samat, c.v, W.dai],
    should: (S, p, c) => [S, W.khuan, c.v],
    want: (S, p, c) => (c.subj ? [S, W.yak, W.hai, c.subj, c.v] : [S, W.yak, c.v]),

    // ไหม at the end makes a yes/no question; "แล้ว หรือ ยัง" asks "already or not yet?"
    qMai: (S, p, c) => [S, c.v, W.maiQ],
    qYet: (S, p, c) => [S, c.v, W.laeo, W.rue, W.yang],
  };

  const ALL_KEYS = Object.keys(PATTERNS);
  const NEGATIONS = ['negPres', 'negPast', 'negExper', 'negNotYet'];

  // ---- Which patterns suit which kind of verb --------------------------------------
  // Membership is tested on the verb with its spaces removed (กินข้าว, ถึง), so a verb
  // written as one word or as two matches the same entry.
  const set = text => new Set(text.split(/\s*,\s*/).map(item => item.replace(/\s+/g, '')));

  // true statives and relations: not "in progress" (no *ฉัน กำลัง รู้ อยู่, *กำลัง เป็น)
  const NO_PROGRESSIVE = set('เป็น, คือ, ใช่, รู้, รู้จัก, เข้าใจ, เหมือน, คล้าย, ต่าง, แตกต่าง, เท่ากับ, เท่า, เหมาะ, เหมาะสม, เหมาะกับ, ประกอบ, ประกอบด้วย, เป็นของ, เป็นเจ้าของ, เกี่ยวกับ, เกี่ยวข้อง, ตรงกับ, ขัดแย้ง, หมายถึง, แปลว่า, คุ้มค่า, มีค่า, มีราคา, สมควร, คู่ควร, ขึ้นอยู่กับ, ขึ้นกับ, เห็นด้วย, ตรงกัน, เหนือกว่า, เกิน, เข้ากัน, เป็นสัญลักษณ์, แทน, ถือว่า, รู้เรื่อง, เก็ต, มีกลิ่น, มีรส, มีแนวโน้ม, ดูเหมือน, ดูท่า, ฟังดู, สังกัด, สอดคล้อง, ตรงตาม, เทียบเท่า, สำคัญ, มีความหมาย, มีผล, หมายความ, มาจาก, เกิดจาก, เป็นตัวแทน, เป็นคู่แข่ง, เป็นประโยชน์, มีสิทธิ์, มีคุณสมบัติ, ดำรงตำแหน่ง, เก่ง, โดดเด่น, เป็นเลิศ, ทราบ, แพร่หลาย, ตั้งอยู่, คงอยู่, มีอยู่, ดำรงอยู่, รายล้อม, พอดี, มีอิทธิพล, เป็นหนี้, เป็นแผลเป็น, สัมพันธ์, อิ่มตัว, เห็นว่า, นาน, รวมถึง, ไร้, ปราศจาก, คาด, ประสงค์');
  // pure relations: not "just now" or "about to"
  const NO_RECENT = set('คือ, ใช่, เหมือน, คล้าย, ต่าง, แตกต่าง, เท่ากับ, เท่า, เหมาะ, เหมาะสม, เหมาะกับ, ประกอบ, ประกอบด้วย, เป็นของ, เป็นเจ้าของ, เกี่ยวกับ, เกี่ยวข้อง, ตรงกับ, ขัดแย้ง, หมายถึง, แปลว่า, คุ้มค่า, มีค่า, มีราคา, สมควร, คู่ควร, ขึ้นอยู่กับ, ขึ้นกับ, ตรงกัน, เหนือกว่า, เกิน, เป็นสัญลักษณ์, แทน, มีกลิ่น, มีรส, มีแนวโน้ม, อยู่, ดูเหมือน, ดูท่า, ฟังดู, สังกัด, สอดคล้อง, ตรงตาม, เทียบเท่า, สำคัญ, มีความหมาย, มีผล, หมายความ, มาจาก, เกิดจาก, เป็นตัวแทน, เป็นคู่แข่ง, เป็นประโยชน์, มีสิทธิ์, มีคุณสมบัติ, ตั้งอยู่, มีอยู่, ดำรงอยู่, รายล้อม, พอดี, เป็นแผลเป็น, สัมพันธ์, นาน, รวมถึง, ไร้, ปราศจาก');
  // non-volitional states: nobody is commanded to be them
  const NO_IMPERATIVE = new Set([...NO_RECENT, ...set('คัน, ปวด, เจ็บ, หนัก, ราคา')].filter(item => item !== 'อยู่'));
  // punctual events that cannot be "in progress" (an instant verb such as ชนะ or ตาย can)
  const PUNCTUAL = set('ถึง, ลืม, พบ, ค้นพบ, พบเห็น, เห็น, ได้ยิน, ได้กลิ่น, ตระหนัก, ตระหนักได้, สังเกตเห็น, ระเบิด, แตก, หัก, เสร็จ, สะดุ้ง, ถึงที่หมาย, สำเร็จ, ทำสำเร็จ, บรรลุ, สิ้นสุด, ได้มา, ชนะเลิศ, เสียชีวิต, ตกชั้น, ตกตะลึง, หมดอายุ, สำเร็จการศึกษา');
  // a verb that already ends in "finished" is not "in progress" (no *กำลัง ทำ เสร็จ อยู่)
  const ENDS_FINISHED = set('เสร็จ, เสร็จสิ้น, เสร็จสมบูรณ์, เรียบร้อย');
  // verbs that already say "finished": no second เสร็จ in "ถึง ตอน นั้น ... เสร็จ แล้ว"
  const ENDS_COMPLETE = set('เสร็จ, เสร็จสิ้น, เสร็จสมบูรณ์, เรียบร้อย, หมด, ครบ, สำเร็จ, จบ, สิ้น, หมดอายุ, หมดแรง, สำเร็จการศึกษา');
  // one-word compounds that end in "finished" (ทำเสร็จ) are finished too
  const FINISHED_SUFFIX = /(เสร็จ|เสร็จสิ้น|เสร็จสมบูรณ์|เรียบร้อย)$/;
  // changes of state written as one word (เพิ่มขึ้น, ดีขึ้น, ลดลง, ตื่นนอน, นอนหลับ) are not tasks that get "finished"
  const CHANGE_OF_STATE = /(.ขึ้น|.ลง|ตื่น|นอนหลับ|งีบหลับ|ลุก)$|^(ตื่น|ลุก)/;
  // posture, motion and dwelling verbs are not "finished" in the same way
  const NO_FINISH = set('นอน, นั่ง, ยืน, เดิน, ไป, มา, กลับ, อยู่, พัก, หลับ, ตื่น, ลุก, เข้า, ออก, ขึ้น, ลง, อาศัย');
  // "V ไป แล้ว" does not suit these (arrivals, births, appearances, waking)
  const NO_GO = set('ถึง, มาถึง, ไปถึง, เกิด, เกิดขึ้น, ปรากฏ, ปรากฏตัว, ตื่น, เสร็จ');
  const DIRECTION = new Set(['ไป', 'มา']);
  // verbs that end in a preposition and wait for their object (พูด ถึง, เห็น ว่า, ตรง กับ): the object comes after
  // the verb, so "finished" and "gone" cannot be put straight behind it
  const PREPOSITIONS = new Set(['ถึง', 'ว่า', 'กับ', 'จาก', 'ด้วย']);
  const endsInPreposition = (thWords, key, last) => !NO_GO.has(key) &&
    (thWords.length > 1 ? PREPOSITIONS.has(last) : last.length > 3 && /(ถึง|กับ|ด้วย|จาก)$/.test(last));
  // ไป or มา alone, or a word that ends in one of them (กลับไป, เข้ามา, หายไป, ได้มา)
  const isMotion = word => DIRECTION.has(word) || (word.length > 2 && /(ไป|มา)$/.test(word) && word !== 'บัพติศมา');
  // verbs that already express wanting or hoping are not "wanted" or "hoped" again
  const DESIRE = set('หวัง, ต้องการ, ปรารถนา, ประสงค์, ใคร่, ตั้งใจ, ใฝ่ฝัน, มุ่งหวัง, คาดหวัง, ใฝ่');
  // verbs that mean "hope" (หวัง): no "I hope that I will hope"
  const HOPE = set('หวัง, มุ่งหวัง, คาดหวัง, หวังว่า, เฝ้าหวัง, หวังใจ');
  // weather verbs have their own subject: ฝน ตก, never *ฉัน ฝน ตก (written with or without a space)
  const IMPERSONAL = {
    ฝนตก: [w('ฝน', 'fon'), w('ตก', 'tok')],
    หิมะตก: [w('หิมะ', 'hima'), w('ตก', 'tok')],
    ลูกเห็บตก: [w('ลูกเห็บ', 'lukhep'), w('ตก', 'tok')],
    เห็บตก: [w('เห็บ', 'hep'), w('ตก', 'tok')],
    ฟ้าร้อง: [w('ฟ้า', 'fa'), w('ร้อง', 'rong')],
    ฟ้าแลบ: [w('ฟ้า', 'fa'), w('แลบ', 'laep')],
    ฟ้าผ่า: [w('ฟ้า', 'fa'), w('ผ่า', 'pha')],
    แดดออก: [w('แดด', 'daet'), w('ออก', 'ok')],
    ลมพัด: [w('ลม', 'lom'), w('พัด', 'phat')],
    ฝนปรอย: [w('ฝน', 'fon'), w('ปรอย', 'proi')],
  };
  const IMPERSONAL_BLOCKED = ['impAff', 'impNeg', 'can', 'should'];
  const WITH_PRONOUN = ['wish', 'want'];

  // Modal verbs (ต้อง, สามารถ, ได้, กล้า ...) take the present, the negation, "not yet", "if",
  // the question, and past and future (ฉัน ต้อง แล้ว, ฉัน จะ ต้อง). Nothing else fits a
  // modal standing alone: no "in progress", no commands, no stacked "can / should / want".
  const MODAL_KEYS = ['pres', 'completed', 'fut', 'cond', 'hyp', 'negPres', 'negNotYet', 'qMai'];
  // only some modals are hoped for (หวัง ว่า จะ สามารถ), not "hoped to have to"
  const MODAL_WISH = set('สามารถ, กล้า, ได้');
  // ควร (should) and อาจ (may) are not put after จะ (อาจ จะ, ควร จะ are the same modal with จะ added
  // after it) and are not hoped for; อาจ is also literary, so it gets the fewest patterns
  const MODAL_LIMITED = {
    ควร: ['pres', 'completed', 'hyp', 'negPres', 'negNotYet', 'qMai'],
    ควรจะ: ['pres', 'completed', 'hyp', 'negPres', 'negNotYet', 'qMai'],
    สมควร: ['pres', 'completed', 'hyp', 'negPres', 'negNotYet', 'qMai'],
    อาจ: ['pres', 'negPres', 'negNotYet'],
    อาจจะ: ['pres', 'negPres'],
    น่าจะ: ['pres', 'negPres'],
    // จำต้อง (have no choice but to) is formal: no "already" and no yes/no question
    จำต้อง: ['pres', 'fut', 'cond', 'hyp', 'negPres', 'negNotYet'],
  };
  const MODAL_OVERRIDE = {
    // "not yet able": ยัง ไม่ สามารถ (no ได้, which would be read as "got")
    negNotYet: (S, p, c) => [S, W.yang, W.mai, c.v],
  };

  // "not yet" for a state or mental verb is ยัง ไม่ + verb (ยัง ไม่ รู้, ยัง ไม่ เข้าใจ); perception and pain keep ยัง ไม่ ได้
  const NOT_YET_STATE = (S, p, c) => [S, W.yang, W.mai, c.v];
  const DAI_STATES = set('เห็น, มองเห็น, ได้ยิน, ได้กลิ่น, เจ็บ, ปวด, สังเกตเห็น');
  // เป็น + a role or identity noun (เป็น ผู้นำ, เป็น เจ้าของ) is negated ไม่ ใช่ ...; fixed combinations (เป็น ห่วง) keep ไม่ เป็น
  const LEXICAL_BE = set('ห่วง, หนี้, สนิม, อัมพาต, ภาระ, ประโยชน์, ไข้, หวัด, ลม, โรค, ปกติ, สุข, ทุกข์, ธรรม');

  // A verb that already holds ได้ is not given a second one (no *ไม่ ได้ ได้ยิน).
  const STARTS_DAI = {
    negPast: (S, p, c) => [S, W.mai, c.v],
    negNotYet: (S, p, c) => [S, W.yang, W.mai, c.v],
    can: (S, p, c) => [S, W.samat, c.v],
  };
  // ทำ ได้ (be able to do): the negation is ทำ ไม่ ได้
  const ENDS_DAI = {
    negPres: (S, p, c) => [S, c.vBase, W.mai, W.dai],
    negPast: null,
    negNotYet: (S, p, c) => [S, W.yang, c.vBase, W.mai, W.dai],
    can: (S, p, c) => [S, W.samat, c.v],
  };

  // ---- Special verbs ------------------------------------------------------------------
  // เป็น, คือ, มี and อยู่ behave differently from ordinary verbs. `tag` forces the kind of
  // verb whatever the entry says; `override` replaces single patterns; `block` removes
  // patterns; `only` keeps just the listed ones.
  const SPECIAL = {
    // to be: ไม่ ใช่ is the negative (ฉัน ไม่ ใช่ ...); ไม่ ได้ เป็น also exists for "not (really) a"
    เป็น: { tag: 's', override: { negPres: (S) => [S, W.mai, W.chai] } },
    // is / namely: only the plain statement, "if", and the negation ไม่ ใช่
    คือ: { tag: 's', only: ['pres', 'hyp', 'negPres'], override: { negPres: (S) => [S, W.mai, W.chai] } },
    // to have: ไม่ มี and ยัง ไม่ มี (not ไม่ ได้ มี, which is emphatic); the past negative is told by ตอน นั้น
    มี: {
      tag: 's',
      override: {
        negPast: (S, p, c) => [W.ton, W.nan, S, W.mai, c.v],
        negNotYet: (S, p, c) => [S, W.yang, W.mai, c.v],
      },
    },
    // to be at / live: อยู่ is not doubled in the progressive (กำลัง อยู่) or the perfect (อยู่ แล้ว)
    อยู่: { tag: 's', block: ['recent', 'nearfut'] },
  };

  // ---- Building the context ---------------------------------------------------------------

  function context(info, kind) {
    const { thWords, romWords } = info;
    const key = thWords.join('');
    let v = thWords.map((th, i) => w(th, romWords[i]));
    const last = thWords[thWords.length - 1];
    const c = {
      key, thWords, last, kind, v,
      hasYu: thWords.some(word => word.includes('อยู่')),
      hasKan: thWords.some(word => word === 'กัน' || /^(พัน|ตรง)กัน$/.test(word)),
      hasNeg: thWords.some(word => word.startsWith('ไม่')),
      hasWang: thWords.some(word => HOPE.has(word)),
      desire: thWords.some(word => DESIRE.has(word) || word.startsWith('อยาก')),
      startsDai: thWords[0].startsWith('ได้'),
      endsDai: thWords.length > 1 && last === 'ได้',
      subj: null,
    };
    if (Object.hasOwn(IMPERSONAL, key)) {
      c.subj = [IMPERSONAL[key][0]];
      c.v = [IMPERSONAL[key][1]];
      c.kind = kind = 'a';
      c.impersonal = true;
    }
    if (c.endsDai) c.vBase = v.slice(0, -1);
    // "V ไป แล้ว" (done and gone), "V อยู่ แล้ว" (already so) for states, plain แล้ว when ไป
    // or อยู่ is already in the verb or does not fit
    const motion = isMotion(last) || isMotion(thWords[0]);
    const dangling = endsInPreposition(thWords, key, last);
    const plain = c.hasYu || motion || dangling || NO_GO.has(key) || NO_GO.has(last);
    c.tail = kind === 's' ? (c.hasYu || motion || dangling ? [W.laeo] : [W.yu, W.laeo])
      : plain ? [W.laeo] : [W.pai, W.laeo];
    c.condTail = kind === 's' ? [W.laeo] : c.tail;
    // "by then I will have V-ed": เสร็จ แล้ว for actions, plain แล้ว for states and instant verbs
    const noFinish = kind === 's' || kind === 'a' || c.hasYu || ENDS_COMPLETE.has(last) || FINISHED_SUFFIX.test(last) || CHANGE_OF_STATE.test(last) ||
      NO_FINISH.has(key) || NO_FINISH.has(thWords[0]) || NO_FINISH.has(last) || motion || dangling;
    c.finish = noFinish ? [W.laeo] : [W.set, W.laeo];
    // "if I had V-ed": ได้ V for actions; states and instant verbs stand alone
    c.hypVerb = kind === '' && !c.startsDai && !c.endsDai ? [W.dai, c.v] : [c.v];
    return c;
  }

  function patternFor(key, c) {
    const special = SPECIAL[c.key] || {};
    if (special.only && !special.only.includes(key)) return null;
    if ((special.block || []).includes(key)) return null;
    if (special.override && special.override[key]) return special.override[key];
    const kind = c.kind;
    if (kind === 'm') {
      const keys = MODAL_LIMITED[c.key] || (MODAL_WISH.has(c.key) ? [...MODAL_KEYS, 'wish'] : MODAL_KEYS);
      return keys.includes(key) ? (MODAL_OVERRIDE[key] || PATTERNS[key]) : null;
    }
    if (c.impersonal && IMPERSONAL_BLOCKED.includes(key)) return null;
    // ไม่ is not doubled (no *ไม่ ไม่ เห็น ด้วย); อย่า ไม่ ... is fine
    if (c.hasNeg && NEGATIONS.includes(key)) return null;
    if (key === 'negPres' && c.thWords.length === 2 && c.thWords[0] === 'เป็น' && !LEXICAL_BE.has(c.thWords[1])) return (S, p, cc) => [S, W.mai, W.chai, ...cc.v.slice(1)];
    if (key === 'want' && c.desire && !c.impersonal) return null;
    if (key === 'wish' && c.hasWang) return null;
    const progressive = key === 'prog' || key === 'pastprog';
    if (progressive && (ENDS_FINISHED.has(c.last) || FINISHED_SUFFIX.test(c.last) || PUNCTUAL.has(c.key))) return null;
    if (kind === 's') {
      if (key === 'negNotYet' && !DAI_STATES.has(c.key) && !c.endsDai && !c.startsDai) return NOT_YET_STATE;
      if (progressive && NO_PROGRESSIVE.has(c.key)) return null;
      if ((key === 'recent' || key === 'nearfut') && NO_RECENT.has(c.key)) return null;
      if ((key === 'impAff' || key === 'impNeg') && NO_IMPERATIVE.has(c.key)) return null;
    }
    if (c.endsDai && Object.hasOwn(ENDS_DAI, key)) return ENDS_DAI[key];
    if (c.startsDai && STARTS_DAI[key]) return STARTS_DAI[key];
    return PATTERNS[key];
  }

  function express(entry) {
    const info = checkEntry(entry);
    const special = SPECIAL[info.thWords.join('')] || {};
    const c = context(info, special.tag || info.tag);
    const rows = {};
    for (const key of ALL_KEYS) {
      const build = patternFor(key, c);
      const own = c.subj && !WITH_PRONOUN.includes(key);
      rows[key] = PRONOUNS.map((S, p) => (build ? render(build(own ? c.subj : S, p, c), MARKS[key]) : null));
    }
    return { th: info.th, rom: info.rom, rows };
  }

  const api = { express, ROW_KEYS: ALL_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Thai = api;
})(typeof window !== 'undefined' ? window : globalThis);
