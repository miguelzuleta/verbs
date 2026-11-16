// Run with: node test.js
// Checks the pattern engine against known sentences (script AND romanization, every pattern
// for a good number of verbs), checks that unreadable entries are refused, then validates
// every verb in verbs.js: Thai script, NFC, a romanization with one word per Thai word, no
// grammar word as the verb, one romanization and one tag per spelling, and a well-formed
// sentence in every cell.
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

// fixed combinations that keep ไม่ เป็น (the same list as the engine's LEXICAL_BE)
const LEXICAL_BE_TEST = new Set('ห่วง หนี้ สนิม อัมพาต ภาระ ประโยชน์ ไข้ หวัด ลม โรค ปกติ สุข ทุกข์ ธรรม'.split(' '));
const report = createReport();
const { failures } = report;

// ---- Known sentences ---------------------------------------------------------
// A block is lines "key: thai / romanization" for the first person (ฉัน chan); "-" means the
// pattern is not used with this kind of verb; six sentences separated by " | " give all six
// persons (ฉัน, คุณ, เขา, เรา, พวกคุณ, พวกเขา). {v} stands for the verb in Thai and {r} for its
// romanization. Keys given with a single sentence are also checked for the other five
// persons: only the pronoun changes, the verb never does.
const PRONOUNS = [['ฉัน', 'chan'], ['คุณ', 'khun'], ['เขา', 'khao'], ['เรา', 'rao'],
  ['พวก คุณ', 'phuak khun'], ['พวก เขา', 'phuak khao']];

function parseBlock(text, verb) {
  const rows = {};
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const colon = line.indexOf(':');
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().split('{v}').join(verb.th).split('{r}').join(verb.rom);
    if (key in rows) throw new Error(`test.js: duplicate key ${key} in the block for ${verb.th}`);
    rows[key] = value === '-' ? null : value.includes(' | ') ? value.split(' | ') : value;
  }
  return rows;
}

// Change single lines of a template: variant(BASE, { key: 'new text' }).
function variant(base, changes) {
  const lines = base.split('\n');
  const seen = new Set();
  const out = lines.map(line => {
    const m = line.match(/^(\s*)([A-Za-z]+):/);
    if (m && Object.hasOwn(changes, m[2])) { seen.add(m[2]); return `${m[1]}${m[2]}: ${changes[m[2]]}`; }
    return line;
  });
  const missing = Object.keys(changes).filter(key => !seen.has(key));
  if (missing.length) throw new Error(`test.js: variant() has no line for ${missing}`);
  return out.join('\n');
}

const SIX_IMP_AFF = 'ให้ ฉัน {v}! / hai chan {r}! | คุณ {v} สิ! / khun {r} si! | ให้ เขา {v}! / hai khao {r}! | เรา {v} กัน เถอะ! / rao {r} kan thoe! | พวก คุณ {v} สิ! / phuak khun {r} si! | ให้ พวก เขา {v}! / hai phuak khao {r}!';
const SIX_IMP_NEG = 'อย่า ให้ ฉัน {v}! / ya hai chan {r}! | คุณ อย่า {v}! / khun ya {r}! | อย่า ให้ เขา {v}! / ya hai khao {r}! | เรา อย่า {v} กัน เลย! / rao ya {r} kan loei! | พวก คุณ อย่า {v}! / phuak khun ya {r}! | อย่า ให้ พวก เขา {v}! / ya hai phuak khao {r}!';

// Ordinary action verbs take every pattern.
const ORDINARY = `
  pres: ฉัน {v} / chan {r}
  prog: ฉัน กำลัง {v} อยู่ / chan kamlang {r} yu
  completed: ฉัน {v} แล้ว / chan {r} laeo
  exper: ฉัน เคย {v} / chan khoei {r}
  perfect: ฉัน {v} ไป แล้ว / chan {r} pai laeo
  recent: ฉัน เพิ่ง {v} / chan phoeng {r}
  pastprog: ตอน นั้น ฉัน กำลัง {v} อยู่ / ton nan chan kamlang {r} yu
  pluperf: ก่อน หน้า นั้น ฉัน {v} ไป แล้ว / kon na nan chan {r} pai laeo
  fut: ฉัน จะ {v} / chan cha {r}
  nearfut: ฉัน กำลัง จะ {v} / chan kamlang cha {r}
  futperf: ถึง ตอน นั้น ฉัน จะ {v} เสร็จ แล้ว / thueng ton nan chan cha {r} set laeo
  cond: ถ้า … ฉัน ก็ จะ {v} / tha … chan ko cha {r}
  condperf: ถ้า ตอน นั้น … ฉัน ก็ คง {v} ไป แล้ว / tha ton nan … chan ko khong {r} pai laeo
  hyp: ถ้า ฉัน {v} / tha chan {r}
  hypperf: ถ้า ตอน นั้น ฉัน ได้ {v} / tha ton nan chan dai {r}
  wish: ฉัน หวัง ว่า ฉัน จะ {v} / chan wang wa chan cha {r}
  impAff: ${SIX_IMP_AFF}
  impNeg: ${SIX_IMP_NEG}
  negPres: ฉัน ไม่ {v} / chan mai {r}
  negPast: ฉัน ไม่ ได้ {v} / chan mai dai {r}
  negExper: ฉัน ไม่ เคย {v} / chan mai khoei {r}
  negNotYet: ฉัน ยัง ไม่ ได้ {v} / chan yang mai dai {r}
  can: ฉัน สามารถ {v} ได้ / chan samat {r} dai
  should: ฉัน ควร {v} / chan khuan {r}
  want: ฉัน อยาก {v} / chan yak {r}
  qMai: ฉัน {v} ไหม? / chan {r} mai?
  qYet: ฉัน {v} แล้ว หรือ ยัง? / chan {r} laeo rue yang?
`;

// State verbs: "already so" is V อยู่ แล้ว, "by then" is plain แล้ว, and "if I had" has no ได้.
const STATE = variant(ORDINARY, {
  // "not yet" for a state or mental verb is ยัง ไม่ + verb (no ได้)
  negNotYet: 'ฉัน ยัง ไม่ {v} / chan yang mai {r}',
  perfect: 'ฉัน {v} อยู่ แล้ว / chan {r} yu laeo',
  pluperf: 'ก่อน หน้า นั้น ฉัน {v} อยู่ แล้ว / kon na nan chan {r} yu laeo',
  futperf: 'ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo',
  condperf: 'ถ้า ตอน นั้น … ฉัน ก็ คง {v} แล้ว / tha ton nan … chan ko khong {r} laeo',
  hypperf: 'ถ้า ตอน นั้น ฉัน {v} / tha ton nan chan {r}',
});
// relational states refuse "in progress", "just now", "about to" and commands
const RELATIONAL = variant(STATE, {
  prog: '-', pastprog: '-', recent: '-', nearfut: '-', impAff: '-', impNeg: '-',
});
// รู้ (know) is not "in progress", but "just found out", "about to know" and commands are fine
const STATE_NO_PROGRESSIVE = variant(STATE, { prog: '-', pastprog: '-' });
// Instant verbs: "by then" is plain แล้ว and "if I had" has no ได้; most can be "in progress"
const ACHIEVEMENT = variant(ORDINARY, {
  futperf: 'ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo',
  hypperf: 'ถ้า ตอน นั้น ฉัน {v} / tha ton nan chan {r}',
});
const ACHIEVEMENT_PUNCTUAL = variant(ACHIEVEMENT, { prog: '-', pastprog: '-' });

// Each case: { verb: { th, rom, tag }, rows: { key: expected } }; `full` cases name every key.
const CASES = [];
const addFull = (template, tag, list) => list.forEach(([th, rom]) => {
  const verb = { th, rom, tag };
  CASES.push({ verb, rows: parseBlock(template, verb), full: true });
});
const addShort = (template, tag, list) => list.forEach(([th, rom]) => {
  const verb = { th, rom, tag };
  CASES.push({ verb, rows: parseBlock(template, verb) });
});

// ---- Ordinary action verbs ---------------------------------------------------
addFull(ORDINARY, '', [['พูด', 'phut'], ['กิน ข้าว', 'kin khao'], ['อ่าน', 'an'], ['เขียน', 'khian'],
  ['ซื้อ', 'sue'], ['ขาย', 'khai'], ['ทำ งาน', 'tham ngan'], ['เรียน', 'rian'], ['ช่วย', 'chuai']]);
// states that are still "in progress" in everyday Thai (ฉัน กำลัง รัก เขา อยู่), and the rest of STATE
addFull(STATE, 's', [['รัก', 'rak'], ['ชอบ', 'chop'], ['กลัว', 'klua'], ['เกลียด', 'kliat'], ['โกรธ', 'krot'],
  ['ห่วง', 'huang'], ['จำ', 'cham'], ['เชื่อ', 'chuea']]);
addFull(STATE_NO_PROGRESSIVE, 's', [['รู้', 'ru'], ['เข้าใจ', 'khaochai'], ['รู้จัก', 'ruchak']]);
addFull(RELATIONAL, 's', [['เหมือน', 'muean'], ['คล้าย', 'khlai'], ['แตกต่าง', 'taektang']]);
addFull(ACHIEVEMENT, 'a', [['ชนะ', 'chana'], ['แพ้', 'phae'], ['ตาย', 'tai'], ['เจอ', 'choe']]);
addFull(ACHIEVEMENT_PUNCTUAL, 'a', [['ลืม', 'luem'], ['ระเบิด', 'raboet'], ['พบ', 'phop']]);

// Audit: relations and appearances are not "in progress", "just now" or commanded (no *ฉัน กำลัง ดูเหมือน อยู่)
addFull(RELATIONAL, 's', [['ดูเหมือน', 'dumuean'], ['ดูท่า', 'dutha'], ['ฟังดู', 'fangdu'], ['สังกัด', 'sangkat'], ['สอดคล้อง', 'sotkhlong'],
  ['ตรงตาม', 'trongtam'], ['เทียบเท่า', 'thiapthao'], ['หมายความ', 'maikhwam'], ['สำคัญ', 'samkhan'], ['เป็น ตัวแทน', 'pen tuathaen'],
  ['เป็น คู่แข่ง', 'pen khukhaeng'], ['เป็น ประโยชน์', 'pen prayot'], ['มี ความหมาย', 'mi khwammai'], ['มี ผล', 'mi phon'],
  ['มี สิทธิ์', 'mi sit'], ['มี คุณสมบัติ', 'mi khunnasombat'], ['รายล้อม', 'railom'], ['พอดี', 'phodi'], ['สัมพันธ์', 'samphan']]);
// เป็น + a role or identity noun is negated ไม่ ใช่ + the noun (ไม่ ใช่ ตัวแทน), not ไม่ เป็น
for (const c of CASES) {
  if (c.verb.th === 'เป็น ตัวแทน' || c.verb.th === 'เป็น คู่แข่ง') {
    c.rows.negPres = `ฉัน ไม่ ใช่ ${c.verb.th.split(' ')[1]} / chan mai chai ${c.verb.rom.split(' ')[1]}`;
  }
}
// ... but "know"-type and trait states are not "in progress" while "just now" and commands stay possible
addFull(STATE_NO_PROGRESSIVE, 's', [['เก่ง', 'keng'], ['โดดเด่น', 'dotden'], ['เป็นเลิศ', 'penloet'], ['ทราบ', 'sap'], ['แพร่หลาย', 'phraelai'],
  ['เป็น หนี้', 'pen ni'], ['อิ่มตัว', 'imtua'], ['มี อิทธิพล', 'mi itthiphon'], ['ดำรง ตำแหน่ง', 'damrong tamnaeng']]);
// มา จาก (come from) begins with มา: plain แล้ว, never *มา จาก อยู่ แล้ว or *มา จาก ไป แล้ว
addFull(variant(RELATIONAL, {
  perfect: 'ฉัน {v} แล้ว / chan {r} laeo', pluperf: 'ก่อน หน้า นั้น ฉัน {v} แล้ว / kon na nan chan {r} laeo',
  condperf: 'ถ้า ตอน นั้น … ฉัน ก็ คง {v} แล้ว / tha ton nan … chan ko khong {r} laeo',
}), 's', [['มา จาก', 'ma chak'], ['เกิดจาก', 'koetchak']]);
// a state that holds อยู่ (ตั้งอยู่, มีอยู่) reads อยู่ once and is neither "in progress" nor "just now"
for (const [th, rom] of [['ตั้งอยู่', 'tangyu'], ['มีอยู่', 'miyu'], ['ดำรงอยู่', 'damrongyu']]) {
  const verb = { th, rom, tag: 's' };
  CASES.push({ verb, rows: parseBlock(`
    prog: -
    pastprog: -
    recent: -
    nearfut: -
    perfect: ฉัน {v} แล้ว / chan {r} laeo
    futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
  `, verb) });
}
// Audit: an instant verb that is itself the result (สำเร็จ, บรรลุ, สิ้นสุด ...) is not "in progress"
addFull(ACHIEVEMENT_PUNCTUAL, 'a', [['สำเร็จ', 'samret'], ['บรรลุ', 'banlu'], ['สิ้นสุด', 'sinsut'], ['ชนะเลิศ', 'chanaloet'],
  ['เสียชีวิต', 'siachiwit'], ['ตกชั้น', 'tokchan'], ['ตกตะลึง', 'toktalueng']]);
for (const [th, rom, tag] of [['ทำ สำเร็จ', 'tham samret', ''], ['ทำสำเร็จ', 'thamsamret', 'a'], ['ได้มา', 'daima', 'a']]) {
  const verb = { th, rom, tag };
  CASES.push({ verb, rows: parseBlock(`
    prog: -
    pastprog: -
    futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
  `, verb) });
}

// ---- Special verbs: เป็น, คือ, มี, อยู่ ------------------------------------------------
// เป็น (to be) is a state verb that takes no กำลัง; its negative is ไม่ ใช่.
addFull(variant(STATE, {
  prog: '-', pastprog: '-', negPres: 'ฉัน ไม่ ใช่ / chan mai chai',
}), 's', [['เป็น', 'pen']]);

// Keep only some keys of a template; every other key is "not used".
const keep = (template, keys) => template.split('\n').map(line => {
  const m = line.match(/^(\s*)([A-Za-z]+):/);
  return m && !keys.includes(m[2]) ? `${m[1]}${m[2]}: -` : line;
}).join('\n');
// คือ (is, namely): only the statement, "if" and ไม่ ใช่
addFull(keep(variant(STATE, { negPres: 'ฉัน ไม่ ใช่ / chan mai chai' }), ['pres', 'hyp', 'negPres']), 's', [['คือ', 'khue']]);

// มี (to have): ไม่ มี; the past negative is told by ตอน นั้น; "I already have it" is มี อยู่ แล้ว.
addFull(variant(STATE, {
  negPast: 'ตอน นั้น ฉัน ไม่ {v} / ton nan chan mai {r}',
  negNotYet: 'ฉัน ยัง ไม่ {v} / chan yang mai {r}',
}), 's', [['มี', 'mi']]);

// อยู่ (to be at, to stay): กำลัง อยู่ and อยู่ แล้ว read อยู่ once; not "just now" or "about to".
addFull(variant(STATE, {
  prog: 'ฉัน กำลัง {v} / chan kamlang {r}',
  pastprog: 'ตอน นั้น ฉัน กำลัง {v} / ton nan chan kamlang {r}',
  perfect: 'ฉัน {v} แล้ว / chan {r} laeo',
  pluperf: 'ก่อน หน้า นั้น ฉัน {v} แล้ว / kon na nan chan {r} laeo',
  recent: '-', nearfut: '-',
}), 's', [['อยู่', 'yu']]);
// a verb that holds อยู่ (อาศัย อยู่, to live) does not double it either; tagged or not
for (const tag of ['s', '']) {
  const verb = { th: 'อาศัย อยู่', rom: 'asai yu', tag };
  CASES.push({
    verb, rows: parseBlock(`
      prog: ฉัน กำลัง {v} / chan kamlang {r}
      pastprog: ตอน นั้น ฉัน กำลัง {v} / ton nan chan kamlang {r}
      perfect: ฉัน {v} แล้ว / chan {r} laeo
      pluperf: ก่อน หน้า นั้น ฉัน {v} แล้ว / kon na nan chan {r} laeo
      futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
      completed: ฉัน {v} แล้ว / chan {r} laeo
      negPres: ฉัน ไม่ {v} / chan mai {r}
    `, verb),
  });
}

// ---- Modal verbs -------------------------------------------------------------
// A modal takes the present, the negation, "not yet", "if", the question and past and future;
// nothing else fits a modal standing alone. Every other pattern is "not used".
const MODAL = `
  pres: ฉัน {v} / chan {r}
  completed: ฉัน {v} แล้ว / chan {r} laeo
  fut: ฉัน จะ {v} / chan cha {r}
  cond: ถ้า … ฉัน ก็ จะ {v} / tha … chan ko cha {r}
  hyp: ถ้า ฉัน {v} / tha chan {r}
  negPres: ฉัน ไม่ {v} / chan mai {r}
  negNotYet: ฉัน ยัง ไม่ {v} / chan yang mai {r}
  qMai: ฉัน {v} ไหม? / chan {r} mai?
`;
// fill every key a modal block does not name with "not used"
const modalBlock = (text, verb) => {
  const rows = parseBlock(text, verb);
  for (const key of ROW_KEYS) if (!(key in rows)) rows[key] = null;
  return rows;
};
const addModal = (text, list) => list.forEach(([th, rom]) => {
  const verb = { th, rom, tag: 'm' };
  CASES.push({ verb, rows: modalBlock(text, verb), full: true });
});
const WISH = '\n  wish: ฉัน หวัง ว่า ฉัน จะ {v} / chan wang wa chan cha {r}';
addModal(MODAL, [['ต้อง', 'tong'], ['จำเป็น', 'champen']]);
addModal(MODAL + WISH, [['สามารถ', 'samat'], ['กล้า', 'kla'], ['ได้', 'dai']]);
// ควร (should) and อาจ (may) are not put after จะ and are not hoped for
addModal(`
  pres: ฉัน {v} / chan {r}
  completed: ฉัน {v} แล้ว / chan {r} laeo
  hyp: ถ้า ฉัน {v} / tha chan {r}
  negPres: ฉัน ไม่ {v} / chan mai {r}
  negNotYet: ฉัน ยัง ไม่ {v} / chan yang mai {r}
  qMai: ฉัน {v} ไหม? / chan {r} mai?
`, [['ควร', 'khuan'], ['ควรจะ', 'khuancha'], ['สมควร', 'somkhuan']]);
addModal(`
  pres: ฉัน {v} / chan {r}
  negPres: ฉัน ไม่ {v} / chan mai {r}
  negNotYet: ฉัน ยัง ไม่ {v} / chan yang mai {r}
`, [['อาจ', 'at']]);
// จำต้อง (have no choice but to) is formal: no "already" and no question
addModal(`
  pres: ฉัน {v} / chan {r}
  fut: ฉัน จะ {v} / chan cha {r}
  cond: ถ้า … ฉัน ก็ จะ {v} / tha … chan ko cha {r}
  hyp: ถ้า ฉัน {v} / tha chan {r}
  negPres: ฉัน ไม่ {v} / chan mai {r}
  negNotYet: ฉัน ยัง ไม่ {v} / chan yang mai {r}
`, [['จำต้อง', 'chamtong']]);
addModal(`
  pres: ฉัน {v} / chan {r}
  negPres: ฉัน ไม่ {v} / chan mai {r}
`, [['น่า จะ', 'na cha'], ['อาจ จะ', 'at cha']]);

// ---- ได้ inside a verb: no second ได้ ---------------------------------------------------
// ได้ as an ordinary verb (to get, tagged "" or "a"): ไม่ ได้ is read once
CASES.push({
  verb: { th: 'ได้', rom: 'dai', tag: '' },
  rows: parseBlock(`
    pres: ฉัน {v} / chan {r}
    completed: ฉัน {v} แล้ว / chan {r} laeo
    negPres: ฉัน ไม่ {v} / chan mai {r}
    negPast: ฉัน ไม่ {v} / chan mai {r}
    negNotYet: ฉัน ยัง ไม่ {v} / chan yang mai {r}
    hypperf: ถ้า ตอน นั้น ฉัน {v} / tha ton nan chan {r}
    can: ฉัน สามารถ {v} / chan samat {r}
    want: ฉัน อยาก {v} / chan yak {r}
  `, { th: 'ได้', rom: 'dai' }),
});
// ได้ยิน (to hear) begins with ได้: ไม่ ได้ยิน, never ไม่ ได้ ได้ยิน; hearing is not "in progress"
for (const tag of ['s', 'a']) {
  const verb = { th: 'ได้ยิน', rom: 'daiyin', tag };
  CASES.push({
    verb, rows: parseBlock(`
      pres: ฉัน {v} / chan {r}
      prog: -
      pastprog: -
      negPres: ฉัน ไม่ {v} / chan mai {r}
      negPast: ฉัน ไม่ {v} / chan mai {r}
      negNotYet: ฉัน ยัง ไม่ {v} / chan yang mai {r}
      negExper: ฉัน ไม่ เคย {v} / chan mai khoei {r}
      hypperf: ถ้า ตอน นั้น ฉัน {v} / tha ton nan chan {r}
      can: ฉัน สามารถ {v} / chan samat {r}
      should: ฉัน ควร {v} / chan khuan {r}
      want: ฉัน อยาก {v} / chan yak {r}
    `, verb),
  });
}
// ได้รับ (to receive) is an ordinary verb that begins with ได้
CASES.push({
  verb: { th: 'ได้รับ', rom: 'dairap', tag: '' },
  rows: parseBlock(`
    prog: ฉัน กำลัง {v} อยู่ / chan kamlang {r} yu
    negPast: ฉัน ไม่ {v} / chan mai {r}
    hypperf: ถ้า ตอน นั้น ฉัน {v} / tha ton nan chan {r}
    futperf: ถึง ตอน นั้น ฉัน จะ {v} เสร็จ แล้ว / thueng ton nan chan cha {r} set laeo
  `, { th: 'ได้รับ', rom: 'dairap' }),
});
// a verb that ends in ได้ (to be able to ...): the negative is ทำ ไม่ ได้
CASES.push({
  verb: { th: 'ทำ ได้', rom: 'tham dai', tag: '' },
  rows: parseBlock(`
    pres: ฉัน {v} / chan {r}
    completed: ฉัน {v} แล้ว / chan {r} laeo
    negPres: ฉัน ทำ ไม่ ได้ / chan tham mai dai
    negPast: -
    negExper: ฉัน ไม่ เคย {v} / chan mai khoei {r}
    negNotYet: ฉัน ยัง ทำ ไม่ ได้ / chan yang tham mai dai
    can: ฉัน สามารถ {v} / chan samat {r}
    hypperf: ถ้า ตอน นั้น ฉัน {v} / tha ton nan chan {r}
  `, { th: 'ทำ ได้', rom: 'tham dai' }),
});
// a verb that already holds ไม่ is not negated again; อย่า ไม่ ... is fine
CASES.push({
  verb: { th: 'ไม่ เห็น ด้วย', rom: 'mai hen duai', tag: 's' },
  rows: parseBlock(`
    pres: ฉัน {v} / chan {r}
    negPres: -
    negPast: -
    negExper: -
    negNotYet: -
    completed: ฉัน {v} แล้ว / chan {r} laeo
    fut: ฉัน จะ {v} / chan cha {r}
    impNeg: อย่า ให้ ฉัน {v}! / ya hai chan {r}! | คุณ อย่า {v}! / khun ya {r}! | อย่า ให้ เขา {v}! / ya hai khao {r}! | เรา อย่า {v} กัน เลย! / rao ya {r} kan loei! | พวก คุณ อย่า {v}! / phuak khun ya {r}! | อย่า ให้ พวก เขา {v}! / ya hai phuak khao {r}!
    qMai: ฉัน {v} ไหม? / chan {r} mai?
  `, { th: 'ไม่ เห็น ด้วย', rom: 'mai hen duai' }),
});
// a verb that holds กัน (reciprocal) does not get a second กัน in "let us ..."
CASES.push({
  verb: { th: 'ทะเลาะ กัน', rom: 'thalo kan', tag: '' },
  rows: {
    impAff: ['ให้ ฉัน ทะเลาะ กัน! / hai chan thalo kan!', 'คุณ ทะเลาะ กัน สิ! / khun thalo kan si!', 'ให้ เขา ทะเลาะ กัน! / hai khao thalo kan!',
      'เรา ทะเลาะ กัน เถอะ! / rao thalo kan thoe!', 'พวก คุณ ทะเลาะ กัน สิ! / phuak khun thalo kan si!', 'ให้ พวก เขา ทะเลาะ กัน! / hai phuak khao thalo kan!'],
    impNeg: ['อย่า ให้ ฉัน ทะเลาะ กัน! / ya hai chan thalo kan!', 'คุณ อย่า ทะเลาะ กัน! / khun ya thalo kan!', 'อย่า ให้ เขา ทะเลาะ กัน! / ya hai khao thalo kan!',
      'เรา อย่า ทะเลาะ กัน เลย! / rao ya thalo kan loei!', 'พวก คุณ อย่า ทะเลาะ กัน! / phuak khun ya thalo kan!', 'อย่า ให้ พวก เขา ทะเลาะ กัน! / ya hai phuak khao thalo kan!'],
  },
});

// ---- Verbs that already mean "want" or "hope" ---------------------------------------------
// no *ฉัน อยาก อยาก, *ฉัน อยาก ต้องการ; หวัง is not "hoped" again either
for (const [th, rom] of [['อยาก', 'yak'], ['ต้องการ', 'tongkan'], ['ปรารถนา', 'pratthana'], ['ตั้งใจ', 'tangchai']]) {
  const verb = { th, rom, tag: 's' };
  CASES.push({ verb, rows: parseBlock(`
    pres: ฉัน {v} / chan {r}
    want: -
    wish: ฉัน หวัง ว่า ฉัน จะ {v} / chan wang wa chan cha {r}
    negPres: ฉัน ไม่ {v} / chan mai {r}
    should: ฉัน ควร {v} / chan khuan {r}
  `, verb) });
}
for (const [th, rom] of [['หวัง', 'wang'], ['คาด หวัง', 'khat wang'], ['อยาก ได้', 'yak dai']]) {
  const verb = { th, rom, tag: 's' };
  CASES.push({ verb, rows: parseBlock(`
    want: -
    wish: ${th.includes('หวัง') ? '-' : 'ฉัน หวัง ว่า ฉัน จะ {v} / chan wang wa chan cha {r}'}
    pres: ฉัน {v} / chan {r}
  `, verb) });
}

// ผิดหวัง (be disappointed) holds หวัง but is not hoping: it keeps the "wish" pattern
CASES.push({
  verb: { th: 'ผิดหวัง', rom: 'phitwang', tag: 's' },
  rows: parseBlock(`
    wish: ฉัน หวัง ว่า ฉัน จะ {v} / chan wang wa chan cha {r}
    want: ฉัน อยาก {v} / chan yak {r}
  `, { th: 'ผิดหวัง', rom: 'phitwang' }),
});

// ---- "Finished": no เสร็จ แล้ว doubling, and no "in progress" -------------------------------------
CASES.push({
  verb: { th: 'เสร็จ', rom: 'set', tag: 'a' },
  rows: parseBlock(`
    pres: ฉัน {v} / chan {r}
    prog: -
    pastprog: -
    completed: ฉัน {v} แล้ว / chan {r} laeo
    perfect: ฉัน {v} แล้ว / chan {r} laeo
    pluperf: ก่อน หน้า นั้น ฉัน {v} แล้ว / kon na nan chan {r} laeo
    futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
    recent: ฉัน เพิ่ง {v} / chan phoeng {r}
    want: ฉัน อยาก {v} / chan yak {r}
  `, { th: 'เสร็จ', rom: 'set' }),
});
for (const [th, rom] of [['ทำ เสร็จ', 'tham set'], ['ใช้ หมด', 'chai mot'], ['อ่าน จบ', 'an chop']]) {
  const verb = { th, rom, tag: '' };
  CASES.push({ verb, rows: parseBlock(`
    futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
    completed: ฉัน {v} แล้ว / chan {r} laeo
    fut: ฉัน จะ {v} / chan cha {r}
    qYet: ฉัน {v} แล้ว หรือ ยัง? / chan {r} laeo rue yang?
    prog: ${th.endsWith('เสร็จ') ? '-' : 'ฉัน กำลัง {v} อยู่ / chan kamlang {r} yu'}
    perfect: ${th.endsWith('เสร็จ') ? 'ฉัน {v} แล้ว / chan {r} laeo' : 'ฉัน {v} ไป แล้ว / chan {r} pai laeo'}
  `, verb) });
}

// ---- Motion, posture and arrival verbs ---------------------------------------------------------
// ไป and มา carry their own direction (no *ไป ไป แล้ว) and are not "finished"; นอน, เดิน too
for (const [th, rom, perfectLine] of [['ไป', 'pai', 'ฉัน {v} แล้ว / chan {r} laeo'], ['มา', 'ma', 'ฉัน {v} แล้ว / chan {r} laeo'],
  ['กลับ ไป', 'klap pai', 'ฉัน {v} แล้ว / chan {r} laeo'], ['กลับ', 'klap', 'ฉัน {v} ไป แล้ว / chan {r} pai laeo'],
  ['นอน', 'non', 'ฉัน {v} ไป แล้ว / chan {r} pai laeo'], ['เดิน', 'doen', 'ฉัน {v} ไป แล้ว / chan {r} pai laeo']]) {
  const verb = { th, rom, tag: '' };
  CASES.push({ verb, rows: parseBlock(`
    perfect: ${perfectLine}
    futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
    prog: ฉัน กำลัง {v} อยู่ / chan kamlang {r} yu
    hypperf: ถ้า ตอน นั้น ฉัน ได้ {v} / tha ton nan chan dai {r}
  `, verb) });
}
// arrival: "ถึง แล้ว" (arrived), not *ถึง ไป แล้ว; not "in progress"
CASES.push({
  verb: { th: 'ถึง', rom: 'thueng', tag: 'a' },
  rows: parseBlock(`
    perfect: ฉัน {v} แล้ว / chan {r} laeo
    pluperf: ก่อน หน้า นั้น ฉัน {v} แล้ว / kon na nan chan {r} laeo
    prog: -
    pastprog: -
    recent: ฉัน เพิ่ง {v} / chan phoeng {r}
    nearfut: ฉัน กำลัง จะ {v} / chan kamlang cha {r}
    futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
  `, { th: 'ถึง', rom: 'thueng' }),
});
// ตาย and ชนะ are instant verbs that can still be "in progress" (กำลัง ตาย อยู่, กำลัง ชนะ อยู่)
for (const [th, rom] of [['ตาย', 'tai'], ['ชนะ', 'chana']]) {
  const verb = { th, rom, tag: 'a' };
  CASES.push({ verb, rows: parseBlock(`
    prog: ฉัน กำลัง {v} อยู่ / chan kamlang {r} yu
    pastprog: ตอน นั้น ฉัน กำลัง {v} อยู่ / ton nan chan kamlang {r} yu
    perfect: ฉัน {v} ไป แล้ว / chan {r} pai laeo
  `, verb) });
}

// A direction word inside one word (กลับไป, เข้ามา, หายไป, ได้มา) or at the head of the verb (ไป เที่ยว,
// มา แทน, มา จาก) already says "gone": no second ไป in "V ไป แล้ว" (found by the audit: *ฉัน กลับไป ไป แล้ว,
// *ฉัน ไป เที่ยว ไป แล้ว) and no เสร็จ in the future perfect.
for (const [th, rom, tag] of [['กลับไป', 'klappai', ''], ['เข้ามา', 'khaoma', ''], ['ดำเนินต่อไป', 'damnoentopai', ''], ['จากไป', 'chakpai', ''],
  ['ออกไป', 'okpai', ''], ['หายไป', 'haipai', 'a'], ['ได้มา', 'daima', 'a'], ['ไป เที่ยว', 'pai thiao', ''], ['ไป เอา', 'pai ao', ''],
  ['มา แทน', 'ma thaen', ''], ['มา จาก', 'ma chak', 's']]) {
  const verb = { th, rom, tag };
  CASES.push({ verb, rows: parseBlock(`
    perfect: ฉัน {v} แล้ว / chan {r} laeo
    pluperf: ก่อน หน้า นั้น ฉัน {v} แล้ว / kon na nan chan {r} laeo
    condperf: ถ้า ตอน นั้น … ฉัน ก็ คง {v} แล้ว / tha ton nan … chan ko khong {r} laeo
    futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
    completed: ฉัน {v} แล้ว / chan {r} laeo
  `, verb) });
}

// ... but a word that merely ends in มา is not a direction (รับ บัพติศมา, "be baptized"): it keeps ไป แล้ว
CASES.push({
  verb: { th: 'รับ บัพติศมา', rom: 'rap baptitsama', tag: '' },
  rows: parseBlock(`
    perfect: ฉัน {v} ไป แล้ว / chan {r} pai laeo
    futperf: ถึง ตอน นั้น ฉัน จะ {v} เสร็จ แล้ว / thueng ton nan chan cha {r} set laeo
  `, { th: 'รับ บัพติศมา', rom: 'rap baptitsama' }),
});
// A verb that ends in a preposition and waits for its object (พูด ถึง, เห็น ว่า, ตรง กับ, อ้างถึง) takes plain แล้ว: no
// *ฉัน พูด ถึง ไป แล้ว and no *จะ พูด ถึง เสร็จ แล้ว (found by the audit); arrival verbs with ถึง keep their own rule.
for (const [th, rom, tag] of [['พูด ถึง', 'phut thueng', ''], ['พูดถึง', 'phutthueng', ''], ['คำนึง ถึง', 'khamnueng thueng', ''], ['เห็น ว่า', 'hen wa', ''],
  ['ตรง กับ', 'trong kap', ''], ['อ้างถึง', 'angthueng', ''], ['ลง จาก', 'long chak', ''], ['ถือ ว่า', 'thue wa', 's'], ['หมาย ถึง', 'mai thueng', 's']]) {
  const verb = { th, rom, tag };
  CASES.push({ verb, rows: parseBlock(`
    perfect: ฉัน {v} แล้ว / chan {r} laeo
    pluperf: ก่อน หน้า นั้น ฉัน {v} แล้ว / kon na nan chan {r} laeo
    condperf: ถ้า ตอน นั้น … ฉัน ก็ คง {v} แล้ว / tha ton nan … chan ko khong {r} laeo
    futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
  `, verb) });
}

// ---- Weather verbs have their own subject: ฝน ตก, never *ฉัน ฝน ตก ------------------------------------
// (written with or without a space in the verb; the sentences always have the two words apart)
for (const [th, rom] of [['ฝน ตก', 'fon tok'], ['ฝนตก', 'fontok']]) {
  const verb = { th, rom, tag: '' };
  CASES.push({
    verb, full: true,
    rows: parseBlock(`
      pres: ฝน ตก / fon tok
      prog: ฝน กำลัง ตก อยู่ / fon kamlang tok yu
      completed: ฝน ตก แล้ว / fon tok laeo
      exper: ฝน เคย ตก / fon khoei tok
      perfect: ฝน ตก ไป แล้ว / fon tok pai laeo
      recent: ฝน เพิ่ง ตก / fon phoeng tok
      pastprog: ตอน นั้น ฝน กำลัง ตก อยู่ / ton nan fon kamlang tok yu
      pluperf: ก่อน หน้า นั้น ฝน ตก ไป แล้ว / kon na nan fon tok pai laeo
      fut: ฝน จะ ตก / fon cha tok
      nearfut: ฝน กำลัง จะ ตก / fon kamlang cha tok
      futperf: ถึง ตอน นั้น ฝน จะ ตก แล้ว / thueng ton nan fon cha tok laeo
      cond: ถ้า … ฝน ก็ จะ ตก / tha … fon ko cha tok
      condperf: ถ้า ตอน นั้น … ฝน ก็ คง ตก ไป แล้ว / tha ton nan … fon ko khong tok pai laeo
      hyp: ถ้า ฝน ตก / tha fon tok
      hypperf: ถ้า ตอน นั้น ฝน ตก / tha ton nan fon tok
      wish: ฉัน หวัง ว่า ฝน จะ ตก / chan wang wa fon cha tok
      impAff: -
      impNeg: -
      negPres: ฝน ไม่ ตก / fon mai tok
      negPast: ฝน ไม่ ได้ ตก / fon mai dai tok
      negExper: ฝน ไม่ เคย ตก / fon mai khoei tok
      negNotYet: ฝน ยัง ไม่ ได้ ตก / fon yang mai dai tok
      can: -
      should: -
      want: ฉัน อยาก ให้ ฝน ตก / chan yak hai fon tok
      qMai: ฝน ตก ไหม? / fon tok mai?
      qYet: ฝน ตก แล้ว หรือ ยัง? / fon tok laeo rue yang?
    `, verb),
  });
}
for (const [th, rom, subject, verbWord] of [['หิมะตก', 'himatok', ['หิมะ', 'hima'], ['ตก', 'tok']], ['ฟ้า ร้อง', 'fa rong', ['ฟ้า', 'fa'], ['ร้อง', 'rong']],
  ['เห็บตก', 'heptok', ['เห็บ', 'hep'], ['ตก', 'tok']], ['ฟ้าร้อง', 'farong', ['ฟ้า', 'fa'], ['ร้อง', 'rong']],
  ['แดด ออก', 'daet ok', ['แดด', 'daet'], ['ออก', 'ok']], ['ลม พัด', 'lom phat', ['ลม', 'lom'], ['พัด', 'phat']]]) {
  CASES.push({
    verb: { th, rom, tag: '' },
    rows: parseBlock(`
      pres: ${subject[0]} ${verbWord[0]} / ${subject[1]} ${verbWord[1]}
      prog: ${subject[0]} กำลัง ${verbWord[0]} อยู่ / ${subject[1]} kamlang ${verbWord[1]} yu
      fut: ${subject[0]} จะ ${verbWord[0]} / ${subject[1]} cha ${verbWord[1]}
      negPres: ${subject[0]} ไม่ ${verbWord[0]} / ${subject[1]} mai ${verbWord[1]}
      qMai: ${subject[0]} ${verbWord[0]} ไหม? / ${subject[1]} ${verbWord[1]} mai?
      impAff: -
      can: -
    `, {}),
  });
}

// ---- More verbs, a few patterns each: the pronoun changes, the verb never does ---------------------------
const SHORT_ORDINARY = `
  pres: ฉัน {v} / chan {r}
  prog: ฉัน กำลัง {v} อยู่ / chan kamlang {r} yu
  completed: ฉัน {v} แล้ว / chan {r} laeo
  recent: ฉัน เพิ่ง {v} / chan phoeng {r}
  fut: ฉัน จะ {v} / chan cha {r}
  negPres: ฉัน ไม่ {v} / chan mai {r}
  negPast: ฉัน ไม่ ได้ {v} / chan mai dai {r}
  qMai: ฉัน {v} ไหม? / chan {r} mai?
  qYet: ฉัน {v} แล้ว หรือ ยัง? / chan {r} laeo rue yang?
  impAff: ${SIX_IMP_AFF}
`;
const SHORT_STATE = `
  pres: ฉัน {v} / chan {r}
  prog: ฉัน กำลัง {v} อยู่ / chan kamlang {r} yu
  recent: ฉัน เพิ่ง {v} / chan phoeng {r}
  nearfut: ฉัน กำลัง จะ {v} / chan kamlang cha {r}
  perfect: ฉัน {v} อยู่ แล้ว / chan {r} yu laeo
  impAff: ${SIX_IMP_AFF}
  impNeg: ${SIX_IMP_NEG}
  negPast: ฉัน ไม่ ได้ {v} / chan mai dai {r}
  qMai: ฉัน {v} ไหม? / chan {r} mai?
`;
const SHORT_ACHIEVEMENT = `
  pres: ฉัน {v} / chan {r}
  recent: ฉัน เพิ่ง {v} / chan phoeng {r}
  nearfut: ฉัน กำลัง จะ {v} / chan kamlang cha {r}
  completed: ฉัน {v} แล้ว / chan {r} laeo
  futperf: ถึง ตอน นั้น ฉัน จะ {v} แล้ว / thueng ton nan chan cha {r} laeo
  negNotYet: ฉัน ยัง ไม่ ได้ {v} / chan yang mai dai {r}
  qYet: ฉัน {v} แล้ว หรือ ยัง? / chan {r} laeo rue yang?
`;
addShort(SHORT_ORDINARY, '', [['เปิด', 'poet'], ['ปิด', 'pit'], ['ถาม', 'tham'], ['ตอบ', 'top'], ['รอ', 'ro'], ['หา', 'ha'],
  ['ใช้', 'chai'], ['สอน', 'son'], ['วิ่ง', 'wing'], ['ขับ รถ', 'khap rot'], ['ดื่ม น้ำ', 'duem nam'], ['ว่าย น้ำ', 'wai nam'],
  ['เล่น', 'len'], ['ร้อง เพลง', 'rong phleng'], ['ฟัง', 'fang'], ['ดู', 'du'], ['เข้า', 'khao'], ['ออก', 'ok'], ['ให้', 'hai'],
  ['คิด', 'khit'], ['เขียน หนังสือ', 'khian nangsue']]);
addShort(SHORT_STATE, 's', [['ชอบ', 'chop'], ['กลัว', 'klua'], ['ห่วง', 'huang'], ['เกลียด', 'kliat'], ['รู้สึก', 'rusuek']]);
addShort(SHORT_ACHIEVEMENT, 'a', [['ตื่น', 'tuen'], ['แพ้', 'phae'], ['พบ', 'phop'], ['หลับ', 'lap']]);
// most state verbs take กำลัง ... อยู่, เพิ่ง and กำลัง จะ (ฉัน เพิ่ง รู้), and commands (อย่า กลัว!)
for (const [th, rom] of [['กลัว', 'klua'], ['โกรธ', 'krot'], ['ห่วง', 'huang'], ['เชื่อ', 'chuea']]) {
  const verb = { th, rom, tag: 's' };
  CASES.push({ verb, rows: parseBlock(`
    prog: ฉัน กำลัง {v} อยู่ / chan kamlang {r} yu
    recent: ฉัน เพิ่ง {v} / chan phoeng {r}
    nearfut: ฉัน กำลัง จะ {v} / chan kamlang cha {r}
    impNeg: ${SIX_IMP_NEG}
  `, verb) });
}
// relational states refuse the progressive, "just now" and commands
for (const [th, rom] of [['เท่า กับ', 'thao kap'], ['ประกอบ ด้วย', 'prakop duai'], ['ตรง กับ', 'trong kap'], ['หมายถึง', 'maithueng'],
  ['ขัดแย้ง', 'khatyaeng'], ['เหมาะ สม', 'mo som']]) {
  const verb = { th, rom, tag: 's' };
  CASES.push({ verb, rows: { prog: null, pastprog: null, recent: null, nearfut: null, impAff: null, impNeg: null } });
}
// รู้ and เข้าใจ are not "in progress", but "just found out" and "about to" are fine
for (const [th, rom] of [['รู้', 'ru'], ['เข้าใจ', 'khaochai']]) {
  const verb = { th, rom, tag: 's' };
  CASES.push({ verb, rows: parseBlock(`
    prog: -
    pastprog: -
    recent: ฉัน เพิ่ง {v} / chan phoeng {r}
    nearfut: ฉัน กำลัง จะ {v} / chan kamlang cha {r}
  `, verb) });
}
// instant verbs that are punctual cannot be "in progress"
for (const [th, rom] of [['ลืม', 'luem'], ['ระเบิด', 'raboet'], ['เห็น', 'hen'], ['พบ', 'phop'], ['ตระหนัก', 'tranak']]) {
  CASES.push({ verb: { th, rom, tag: 'a' }, rows: { prog: null, pastprog: null } });
}
// the tag is optional: no tag is an ordinary action verb
CASES.push({
  verb: { th: 'พูด', rom: 'phut' },
  rows: { prog: 'ฉัน กำลัง พูด อยู่ / chan kamlang phut yu', impAff: parseBlock(`x: ${SIX_IMP_AFF}`, { th: 'พูด', rom: 'phut' }).x },
});
CASES.push({ verb: { th: 'พูด', rom: 'phut', tag: null }, rows: { fut: 'ฉัน จะ พูด / chan cha phut' } });
CASES.push({ verb: { th: 'พูด', rom: 'phut', tag: undefined }, rows: { fut: 'ฉัน จะ พูด / chan cha phut' } });
// a romanization with a hyphen or an apostrophe keeps it (loanwords)
CASES.push({ verb: { th: 'เล่น สเก็ต', rom: 'len sa-ket', tag: '' }, rows: { pres: 'ฉัน เล่น สเก็ต / chan len sa-ket', prog: 'ฉัน กำลัง เล่น สเก็ต อยู่ / chan kamlang len sa-ket yu' } });

// @@CASES-END@@ (add new cases above this line)

// ---- Running the known sentences ----------------------------------------------

// Replace the first-person pronoun of an expected sentence "thai / rom" by each person.
function forPerson(expected, person) {
  const [th, rom] = expected.split(' / ');
  const [pTh, pRom] = PRONOUNS[person];
  return {
    th: th.split(' ').map(word => (word === 'ฉัน' ? pTh : word)).join(' '),
    rom: rom.split(' ').map(word => (word === 'chan' ? pRom : word)).join(' '),
  };
}

function checkCases() {
  for (const { verb, rows, full } of CASES) {
    const label = `${verb.th} ${verb.rom}${verb.tag ? ` [${verb.tag}]` : ''}`;
    const result = express(verb);
    report.checks += 1;
    if (result.th !== verb.th || result.rom !== verb.rom) failures.push(`${label}: express() returns th "${result.th}" rom "${result.rom}"`);
    if (full) {
      // a "full" case must name every key of the engine, and only those
      report.checks += 1;
      const missing = ROW_KEYS.filter(key => !(key in rows));
      const extra = Object.keys(rows).filter(key => !ROW_KEYS.includes(key));
      if (missing.length || extra.length) failures.push(`${label}: key mismatch, missing [${missing}] unknown [${extra}]`);
    }
    for (const [key, expected] of Object.entries(rows)) {
      const actual = result.rows[key];
      if (!actual) { failures.push(`${label}.${key}: no such row`); continue; }
      const want = expected === null ? Array(6).fill(null)
        : Array.isArray(expected) ? expected.map(item => { const [th, rom] = item.split(' / '); return { th, rom }; })
          : PRONOUNS.map((_, person) => forPerson(expected, person));
      want.forEach((sentence, person) => {
        report.checks += 1;
        const got = actual[person];
        const same = sentence === null ? got === null : got !== null && got.th === sentence.th && got.rom === sentence.rom;
        if (!same) {
          const show = cell => (cell ? `${cell.th} / ${cell.rom}` : null);
          failures.push(`${label}.${key}[${person}]\n    expected: ${show(sentence)}\n    actual:   ${show(got)}`);
        }
      });
    }
  }
}
checkCases();


// ---- The shape of the result ---------------------------------------------------

const EXPECTED_KEYS = ['pres', 'prog', 'completed', 'exper', 'perfect', 'recent', 'pastprog', 'pluperf',
  'fut', 'nearfut', 'futperf', 'cond', 'condperf', 'hyp', 'hypperf', 'wish', 'impAff', 'impNeg',
  'negPres', 'negPast', 'negExper', 'negNotYet', 'can', 'should', 'want', 'qMai', 'qYet'];
report.checks += 1;
if (JSON.stringify(ROW_KEYS) !== JSON.stringify(EXPECTED_KEYS)) failures.push(`ROW_KEYS changed: ${ROW_KEYS}`);
report.checks += 1;
if (!Array.isArray(ROW_KEYS)) failures.push('ROW_KEYS must be an array');
report.checks += 1;
if (ROW_KEYS.length < 25 || !['pres', 'completed', 'fut'].every(key => ROW_KEYS.includes(key))) {
  failures.push('ROW_KEYS needs at least 25 keys including pres, completed and fut');
}
report.checks += 1;
if (new Set(ROW_KEYS).size !== ROW_KEYS.length) failures.push('ROW_KEYS has duplicates');
{
  const result = express({ th: 'พูด', rom: 'phut', tag: '' });
  report.checks += 1;
  if (Object.keys(result).sort().join() !== 'rom,rows,th') failures.push(`express() returns { th, rom, rows }, got ${Object.keys(result)}`);
  report.checks += 1;
  if (Object.keys(result.rows).join() !== ROW_KEYS.join()) failures.push('express().rows has the keys of ROW_KEYS in order');
  for (const key of ROW_KEYS) {
    report.checks += 1;
    const row = result.rows[key];
    if (!Array.isArray(row) || row.length !== 6 || row.some(cell => !cell || Object.keys(cell).join() !== 'th,rom' || typeof cell.th !== 'string' || typeof cell.rom !== 'string')) {
      failures.push(`พูด.${key}: a row is six { th, rom } cells`);
    }
  }
}
// express() is pure: the same entry gives the same rows, and the entry is not changed
{
  const entry = { th: 'กิน ข้าว', rom: 'kin khao', tag: '' };
  const before = JSON.stringify(entry);
  const first = JSON.stringify(express(entry));
  report.checks += 2;
  if (JSON.stringify(express(entry)) !== first) failures.push('express() is not repeatable');
  if (JSON.stringify(entry) !== before) failures.push('express() changed its entry');
}

// ---- Entries that must be refused ----------------------------------------------
// An entry the engine cannot read throws a clear error instead of being guessed at.

function refuses(label, entry, pattern) {
  report.checks += 1;
  try { express(entry); } catch (error) {
    if (!(error instanceof Error) || !/^Thai express\(\): /.test(error.message) || !pattern.test(error.message)) {
      failures.push(`${label}: wrong error "${error && error.message}"`);
    }
    return;
  }
  failures.push(`${label}: did not throw`);
}
refuses('empty verb', { th: '', rom: '', tag: '' }, /verb is empty/);
refuses('blank verb', { th: '   ', rom: 'phut', tag: '' }, /verb is empty/);
refuses('missing verb', { rom: 'phut', tag: '' }, /verb is empty/);
refuses('verb that is not a string', { th: 42, rom: '42', tag: '' }, /verb is empty/);
refuses('no entry', undefined, /must be an object/);
refuses('null entry', null, /must be an object/);
refuses('entry that is a string', 'พูด', /must be an object/);
refuses('Latin letters', { th: 'speak', rom: 'speak', tag: '' }, /not Thai script \(check "speak"\)/);
refuses('Latin mixed into a Thai word', { th: 'พูดa', rom: 'phut', tag: '' }, /not Thai script/);
refuses('Latin word after a Thai word', { th: 'พูด go', rom: 'phut go', tag: '' }, /not Thai script \(check "go"\)/);
refuses('Chinese characters', { th: '說話', rom: 'shuo hua', tag: '' }, /not Thai script/);
refuses('Japanese kana', { th: 'はなす', rom: 'hanasu', tag: '' }, /not Thai script/);
refuses('Thai digits', { th: 'พูด๑', rom: 'phut', tag: '' }, /not Thai script/);
refuses('Arabic-Indic digits', { th: 'พูด1', rom: 'phut', tag: '' }, /not Thai script/);
refuses('Thai baht sign', { th: 'พูด฿', rom: 'phut', tag: '' }, /not Thai script/);
refuses('punctuation inside the verb', { th: 'พูด, กิน', rom: 'phut kin', tag: '' }, /not Thai script/);
refuses('question mark in the verb', { th: 'พูด?', rom: 'phut', tag: '' }, /not Thai script/);
refuses('ellipsis in the verb', { th: 'พูด …', rom: 'phut …', tag: '' }, /not Thai script/);
refuses('word-count mismatch (two Thai words, one romanized)', { th: 'กิน ข้าว', rom: 'kinkhao', tag: '' }, /has 2 word\(s\) but its romanization "kinkhao" has 1/);
refuses('word-count mismatch (one Thai word, two romanized)', { th: 'พูด', rom: 'phu t', tag: '' }, /has 1 word\(s\) but its romanization "phu t" has 2/);
refuses('word-count mismatch (three romanized for two)', { th: 'กิน ข้าว', rom: 'kin khao kan', tag: '' }, /romanization "kin khao kan" has 3/);
refuses('missing romanization', { th: 'พูด', tag: '' }, /romanization of "พูด" is empty/);
refuses('empty romanization', { th: 'พูด', rom: '', tag: '' }, /romanization of "พูด" is empty/);
refuses('romanization that is not a string', { th: 'พูด', rom: 7, tag: '' }, /romanization of "พูด" is empty/);
refuses('romanization in Thai script', { th: 'พูด', rom: 'พูด', tag: '' }, /must be lowercase letters a-z/);
refuses('uppercase romanization', { th: 'พูด', rom: 'Phut', tag: '' }, /must be lowercase letters a-z/);
refuses('romanization with a tone mark', { th: 'พูด', rom: 'phût', tag: '' }, /must be lowercase letters a-z/);
refuses('romanization with a digit', { th: 'พูด', rom: 'phut2', tag: '' }, /must be lowercase letters a-z/);
refuses('romanization with a stray space', { th: 'กิน ข้าว', rom: 'kin  khao', tag: '' }, /stray spaces/);
refuses('unknown tag', { th: 'พูด', rom: 'phut', tag: 'x' }, /unknown tag "x" for "พูด"/);
refuses('uppercase tag', { th: 'รู้', rom: 'ru', tag: 'S' }, /unknown tag "S"/);
refuses('tag with two letters', { th: 'รู้', rom: 'ru', tag: 'sa' }, /unknown tag "sa"/);
refuses('tag that is a number', { th: 'รู้', rom: 'ru', tag: 1 }, /unknown tag "1"/);
refuses('double space', { th: 'กิน  ข้าว', rom: 'kin khao', tag: '' }, /stray spaces/);
refuses('leading space', { th: ' พูด', rom: 'phut', tag: '' }, /stray spaces/);
refuses('trailing space', { th: 'พูด ', rom: 'phut', tag: '' }, /stray spaces/);
refuses('tab between words', { th: 'กิน\tข้าว', rom: 'kin khao', tag: '' }, /stray spaces/);
// tone mark typed before the vowel mark (U+0E1C U+0E49 U+0E39): not in canonical order
refuses('marks in the wrong order (not NFC)', { th: '\u0E1C\u0E49\u0E39', rom: 'phu', tag: '' }, /must be NFC/);
refuses('five words', { th: 'ก ข ค ง จ'.replace(/./g, ch => (ch === ' ' ? ' ' : `${ch}ก`)), rom: 'a b c d e', tag: '' }, /5 words/);
// the readable ones do not throw
for (const entry of [{ th: 'พูด', rom: 'phut', tag: '' }, { th: 'พูด', rom: 'phut', tag: undefined }, { th: 'พูด', rom: 'phut', tag: null },
  { th: 'พูด', rom: 'phut' }, { th: 'กิน ข้าว', rom: 'kin khao', tag: '' }, { th: 'ถึง', rom: 'thueng', tag: 'a' },
  { th: 'รู้', rom: 'ru', tag: 's' }, { th: 'ต้อง', rom: 'tong', tag: 'm' }, { th: 'ซ้ำๆ', rom: 'samsam', tag: '' },
  { th: 'เล่น สกี', rom: 'len ski', tag: '' }, { th: 'ร้อง ไห้', rom: 'rong hai', tag: '' }]) {
  report.checks += 1;
  try { express(entry); } catch (error) { failures.push(`${JSON.stringify(entry)} should be readable: ${error.message}`); }
}

// ---- Checking Thai spelling and romanization --------------------------------------
// The checks below find typos (a misplaced vowel or tone mark, a doubled mark, a word that
// cannot begin or end that way, a letter the Royal Thai General System never uses) without
// needing a dictionary. The GOOD and BAD word lists below keep the rules honest.

const isConsonant = ch => ch >= 'ก' && ch <= 'ฮ'; // ก ... ฮ (includes ฤ ฦ)
const LEADING_VOWELS = new Set(['เ', 'แ', 'โ', 'ใ', 'ไ']); // เ แ โ ใ ไ
const TONE_MARKS = new Set(['่', '้', '๊', '๋']); // ่ ้ ๊ ๋
const ABOVE_BELOW = new Set(['ั', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู']); // ั ิ ี ึ ื ุ ู
const NEEDS_FINAL = new Set(['ั', 'ึ', 'ื']); // ั ึ ื cannot end a word
const RARE_MARKS = new Set(['ฯ', 'ฺ', 'ๅ', 'ํ', '๎']); // ฯ ฺ ๅ ํ ๎ (not in everyday verbs)

// Returns '' for a plausible Thai word, else a description of the problem.
function checkThaiWord(word) {
  const chars = [...word];
  const first = chars[0];
  const last = chars[chars.length - 1];
  if (!isConsonant(first) && !LEADING_VOWELS.has(first)) return `begins with U+${first.codePointAt(0).toString(16)}, which cannot begin a word`;
  if (LEADING_VOWELS.has(last)) return 'ends with a leading vowel (เ แ โ ใ ไ)';
  if (NEEDS_FINAL.has(last)) return `ends with U+${last.codePointAt(0).toString(16)}, which needs a final consonant`;
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    const prev = chars[i - 1];
    const next = chars[i + 1];
    const at = `U+${ch.codePointAt(0).toString(16)} at ${i + 1}`;
    if (RARE_MARKS.has(ch)) return `rare mark ${at}`;
    if (LEADING_VOWELS.has(ch) && !(next && isConsonant(next))) return `leading vowel (${at}) is not followed by a consonant`;
    if (!isConsonant(ch) && !LEADING_VOWELS.has(ch) && ch === prev) return `doubled mark ${at}`;
    if (TONE_MARKS.has(ch) && !(prev && (isConsonant(prev) || ABOVE_BELOW.has(prev)))) return `tone mark (${at}) does not follow a consonant or vowel mark`;
    if ((ABOVE_BELOW.has(ch) || ch === '็') && !(prev && isConsonant(prev))) return `vowel mark (${at}) does not follow a consonant`;
    if (ch === '์' && !(prev && (isConsonant(prev) || ABOVE_BELOW.has(prev)))) return `thanthakhat (${at}) does not follow a letter`;
    if ((ch === 'ะ' || ch === 'า') && !(prev && (isConsonant(prev) || TONE_MARKS.has(prev) || (ch === 'ะ' && prev === 'า')))) return `vowel (${at}) in the wrong place`;
    if (ch === 'ำ' && !(prev && (isConsonant(prev) || TONE_MARKS.has(prev)))) return `sara am (${at}) does not follow a consonant`;
    if (ch === 'ๆ' && !prev) return `maiyamok (${at}) with nothing to repeat`;
  }
  return '';
}

// Returns '' for a plausible Royal Thai General System word, else the problem.
function checkRomWord(word) {
  if (!/^[a-z'-]+$/.test(word)) return 'has characters outside a-z \' -';
  if (/^['-]|['-]$/.test(word)) return 'begins or ends with a hyphen or apostrophe';
  if (!/[aeiou]/.test(word)) return 'has no vowel';
  const odd = word.match(/[jqvxz]/);
  if (odd) return `uses "${odd[0]}", which the Royal Thai General System never uses (Thai ช จ ฉ are "ch", ว is "w")`;
  if (/c(?!h)/.test(word)) return '"c" only occurs in "ch"';
  return '';
}

// ---- Romanization check: the consonants -------------------------------------------------
// Every Thai consonant letter must be found, in order, in the romanization with one of its Royal Thai
// General System values (initial or final): ข kh, ป p, พ ph, ท th, ต t, ช ch ... Vowels are skipped, so this
// finds the usual slips: aspirated for plain (hamphram for ห้ามปราม), a letter left out (khaya for
// ขยาย), a doubled letter lost (khomen for คอมเมนต์), the wrong initial (khrong for กรง). It cannot see
// vowels or tones; those are read by eye in the audit.
const CONSONANT_INITIAL = {
  ก: ['k'], ข: ['kh'], ฃ: ['kh'], ค: ['kh'], ฅ: ['kh'], ฆ: ['kh'], ง: ['ng'], จ: ['ch'], ฉ: ['ch'], ช: ['ch'], ซ: ['s'], ฌ: ['ch'], ญ: ['y', 'n'],
  ฎ: ['d'], ฏ: ['t'], ฐ: ['th'], ฑ: ['th', 'd'], ฒ: ['th'], ณ: ['n'], ด: ['d'], ต: ['t'], ถ: ['th'], ท: ['th'], ธ: ['th'], น: ['n'],
  บ: ['b'], ป: ['p'], ผ: ['ph'], ฝ: ['f'], พ: ['ph'], ฟ: ['f'], ภ: ['ph'], ม: ['m'], ย: ['y'], ร: ['r'], ฤ: ['rue', 'ri', 'roe'], ล: ['l'], ว: ['w'],
  ศ: ['s'], ษ: ['s'], ส: ['s'], ห: ['h'], ฬ: ['l'], อ: [], ฮ: ['h'],
};
const CONSONANT_FINAL = {
  ก: ['k'], ข: ['k'], ฃ: ['k'], ค: ['k'], ฅ: ['k'], ฆ: ['k'], ง: ['ng'], จ: ['t'], ฉ: ['t'], ช: ['t'], ซ: ['t'], ฌ: ['t'], ญ: ['n'],
  ฎ: ['t'], ฏ: ['t'], ฐ: ['t'], ฑ: ['t'], ฒ: ['t'], ณ: ['n'], ด: ['t'], ต: ['t'], ถ: ['t'], ท: ['t'], ธ: ['t'], น: ['n'],
  บ: ['p'], ป: ['p'], ผ: ['p'], ฝ: ['p'], พ: ['p'], ฟ: ['p'], ภ: ['p'], ม: ['m'], ย: ['i', 'y'], ร: ['n'], ล: ['n'], ว: ['o', 'w', 'u'],
  ศ: ['t'], ษ: ['t'], ส: ['t'], ห: [], ฬ: ['n'], อ: [], ฮ: [], ำ: ['m'],
};
const THAI_MARKS = 'ัิ-ฺ็-๋';
function consonantSkeleton(word) {
  let w = word.normalize('NFC');
  w = w.replace(/รร/g, 'ะ');                                            // รร is a vowel (กรรม kam)
  w = w.replace(new RegExp(`[ก-ฮ][${THAI_MARKS}]*์`, 'g'), '');        // a letter under ์ is silent (ภาพยนตร์)
  w = w.replace(/([ก-ฮ])ร$/, '$1');                                     // final -คร, -ตร: ร is silent (สมัคร)
  w = w.replace(new RegExp(`ทร(?=[${THAI_MARKS}ะาเแโใไำ]|[ก-ฮ])`, 'g'), 'ส'); // ทร is read s (ทราบ, ทรง)
  w = w.replace(new RegExp(`([สศซจ])ร(?=[${THAI_MARKS}]*[ะาเแโใไำ]?[ก-ฮ]?$)`, 'g'), '$1'); // สร้าง, ศรี: ร not read
  // ย, ว and อ are vowels as often as consonants (เรียน, ตัว, ช่วย, เรือ): they only count at the head of the word
  const letters = [];
  for (const ch of w) {
    if (/[ก-ฮ]/.test(ch)) { if (!'ยวอ'.includes(ch) || letters.length === 0) letters.push(ch); } else if (ch === 'ำ') letters.push('ำ');
  }
  return letters;
}
function consonantsMatch(word, rom) {
  const letters = consonantSkeleton(word);
  const memo = new Map();
  const isVowel = at => at >= 0 && at < rom.length && /[aeiouwy'-]/.test(rom[at]); // w and y: the glide letters left out of the skeleton
  // An initial value (kh, ph, th, ch ...) is followed by a vowel, or by r, l, w of a cluster; a final value
  // (k, p, t, n, m, ng ...) comes right after a vowel. That is what tells ph from p and kh from k.
  const startsAt = (value, at, final) => {
    if (!rom.startsWith(value, at)) return false;
    if (final) return at > 0 && isVowel(at - 1);
    if (/[aeiou]$/.test(value)) return true; // ฤ is read rue, ri or roe: the vowel is part of the value
    const next = at + value.length;
    return isVowel(next) || (next < rom.length && 'rlw'.includes(rom[next]));
  };
  function go(index, from) {
    if (index === letters.length) return true;
    const key = `${index},${from}`;
    if (memo.has(key)) return memo.get(key);
    const letter = letters[index];
    const initial = CONSONANT_INITIAL[letter] || [];
    const final = CONSONANT_FINAL[letter] || [];
    // a letter may stand for a closing and an opening sound together (พัฒนา phatthana, ปราศจาก prasatchak)
    const options = [...initial.map(v => [v, false]), ...final.map(v => [v, true])];
    const pairs = [];
    for (const a of final) for (const b of initial) pairs.push([a, b]);
    // reach the sound: skip vowels, but not consonants
    let ok = false;
    for (let at = from; at <= rom.length && !ok; at += 1) {
      if (at > from && !isVowel(at - 1)) break;
      for (const [value, isFinal] of options) {
        if (startsAt(value, at, isFinal) && go(index + 1, at + value.length)) { ok = true; break; }
      }
      if (ok) break;
      for (const [a, b] of pairs) {
        if (!startsAt(a, at, true)) continue;
        for (let next = at + a.length; next <= rom.length; next += 1) {
          if (startsAt(b, next, false) && go(index + 1, next + b.length)) { ok = true; break; }
          if (!isVowel(next)) break;
        }
        if (ok) break;
      }
    }
    if (!ok && 'หอ'.includes(letter) && go(index + 1, from)) ok = true;                // silent ห and อ
    if (!ok && letter === 'ร' && index > 0 && 'ทสศจซตคก'.includes(letters[index - 1]) && go(index + 1, from)) ok = true;
    memo.set(key, ok);
    return ok;
  }
  return go(0, 0);
}
const FINAL_VOWEL_ENDINGS = [[/ิ[่-๋]?ว$/, /io$/], [/เ[ก-ฮ]{1,3}็?ว$/, /(?<!a)eo$/], [/ื[่-๋]?อย$/, /ueai$/], [/เอย$/, /oei$/], [/าย$/, /ai$/], [/ัย$/, /ai$/], [/อย$/, /oi$/], [/ุย$/, /ui$/], [/าว$/, /ao$/]];
// Words whose consonants are read in ways the rule above does not know (silent or irregular letters).
const CONSONANT_EXCEPTIONS = new Set(['ปรารถนา', 'กรรโชก', 'โทรศัพท์', 'สามารถ', 'สรุป', 'บรรจุ', 'บรรจบ', 'ทุจริต', 'บรรเทา', 'สุนทรพจน์',
  'บรรยาย', 'เจริญ', 'สรรเสริญ', 'เกียรติ', 'ร่ายมนตร์', 'บรรทุก', 'ทรมาน', 'ซ้อมทรมาน', 'โทรหา', 'แปรรูป', 'สัญลักษณ์', 'ศีรษะ']);
for (const [word, rom, expected] of [['พูด', 'phut', true], ['ขยาย', 'khayai', true], ['พัฒนา', 'phatthana', true], ['ติดตั้ง', 'tittang', true],
  ['ห้ามปราม', 'hampram', true], ['กะพริบ', 'kaphrip', true], ['ทราบ', 'sap', true], ['สร้าง', 'sang', true], ['สมัคร', 'samak', true],
  ['เกลียด', 'kliat', true], ['เกลียด', 'kiat', false], ['ห้ามปราม', 'hamphram', false], ['กะพริบ', 'kraphrip', false], ['คอมเมนต์', 'khomen', false], ['คอมเมนต์', 'khommen', true],
  ['กรง', 'khrong', false], ['เท', 'the', true], ['เท', 'te', false], ['พูด', 'put', false], ['ปู', 'phu', false], ['ติดตั้ง', 'titang', false]]) {
  report.checks += 1;
  if (consonantsMatch(word, rom) !== expected) failures.push(`consonant checker: ${word} / ${rom} should be ${expected ? 'accepted' : 'rejected'}`);
}

const GOOD_THAI_WORDS = `พูด กิน ข้าว รู้ รัก ชอบ เป็น มี อยู่ ถึง ชนะ ตาย เจอ ต้อง ควร สามารถ อาจ ได้ ทำ งาน ซื้อ ขาย เขียน เรียน
  ช่วย น้ำ ผู้ ก่อน ถ้า ว่า ให้ ไม่ ยัง อย่า เคย เพิ่ง แล้ว เกาะ เสือ เกี่ยว เลี้ยง เรื่อง สิทธิ์ กำลัง ซ้ำๆ เพลง ร้องไห้ ถอนหายใจ
  เปลี่ยน แปลก โต้แย้ง ตื่น หลับ ยิ้ม หัวเราะ ผ่า ฝัน ใจ ไหม ไหว้ เกลียด เขียว ดื่ม หนึ่ง ปรารถนา ประสงค์ ต้องการ ใคร่ ตั้งใจ ใฝ่ฝัน
  เผชิญ สู้ ฟัง จ่าย ย้าย เห็น เป็น เล่น เร็ว สั่ง บ่น ปั่น ก้าว ข้าม ซ้ำ จำ เซ็น สเก็ต เอา เมา ฤทธิ์ ก็ ไป มา กลับ นอน เดิน วิ่ง`.split(/\s+/);
const BAD_THAI_WORDS = [
  ['ิพูด', 'a vowel mark cannot begin a word'],
  ['่พูด', 'a tone mark cannot begin a word'],
  ['พูดเ', 'a leading vowel cannot end a word'],
  ['พู่้ด', 'two tone marks'],
  ['พั', 'ั cannot end a word'],
  ['เู', 'a leading vowel needs a consonant'],
  ['พิิด', 'a doubled vowel mark'],
  ['พัิด', 'two vowel marks on one consonant'],
  ['พา่ด', 'a tone mark cannot follow า'],
  ['กํา', 'ํา should be written ำ'],
  ['ก๎', 'rare mark'],
  ['ๆก', 'maiyamok cannot begin a word'],
];
for (const word of GOOD_THAI_WORDS) {
  report.checks += 1;
  const problem = checkThaiWord(word);
  if (problem) failures.push(`Thai spelling checker rejects the good word "${word}": ${problem}`);
}
for (const [word, why] of BAD_THAI_WORDS) {
  report.checks += 1;
  if (!checkThaiWord(word)) failures.push(`Thai spelling checker accepts the bad word ${JSON.stringify(word)} (${why})`);
}
for (const word of ['phut', 'kin', 'khao', 'thueng', 'chana', 'sa-ket', "kho'ng", 'thonhaichai', 'ya', 'yu', 'ru', 'chai', 'khoei']) {
  report.checks += 1;
  const problem = checkRomWord(word);
  if (problem) failures.push(`romanization checker rejects the good word "${word}": ${problem}`);
}
for (const word of ['phût', 'Phut', 'jai', 'vai', 'kn', 'cai', 'xin', '-kin', 'kin-', 'zoo', 'ph1', '']) {
  report.checks += 1;
  if (!checkRomWord(word)) failures.push(`romanization checker accepts the bad word "${word}"`);
}

// ---- Validating the verb database -----------------------------------------------

// Grammar words are not verbs ("แล้ว" as a verb would make every sentence read doubled). ได้ and
// ควร are also the modal verbs "can / may" and "should": they are accepted only tagged "m".
const GRAMMAR_WORDS = new Set(['ได้', 'แล้ว', 'จะ', 'กำลัง', 'ไม่', 'ยัง', 'อย่า', 'เคย', 'ควร', 'เพิ่ง', 'ถูก',
  'ก็', 'ถ้า', 'ไหม', 'สิ', 'เถอะ']);
const GRAMMAR_AS_MODAL = new Set(['ได้', 'ควร']);
// A verb may not begin with one of these either ("กำลัง กิน" would double the aspect marker).
const LEADING_GRAMMAR = new Set(['กำลัง', 'จะ', 'แล้ว', 'อย่า', 'เคย', 'เพิ่ง', 'ยัง']);
// ... and แล้ว, จะ, กำลัง, อย่า, เคย, เพิ่ง may not be a word of the verb at all (กิน แล้ว would read "กิน แล้ว แล้ว")
const NO_GRAMMAR_INSIDE = new Set(['แล้ว', 'จะ', 'กำลัง', 'อย่า', 'เคย', 'เพิ่ง']);
// A verb that begins with a pronoun reads like a typo ("ฉัน กิน", "พวก เขา ไป").
const PRONOUN_FIRST = new Set(['ฉัน', 'ผม', 'ดิฉัน', 'คุณ', 'เขา', 'เรา', 'เธอ', 'พวก', 'พวกเรา', 'พวกเขา', 'ท่าน']);
// Adverbs and particles that are not verbs.
const NOT_VERBS = new Set(['และ', 'แต่', 'หรือ', 'ที่', 'ซึ่ง', 'นิดหน่อย', 'จริงๆ', 'ด้วย', 'อีก', 'ก่อน', 'หลัง']);
// The modal verbs the engine knows how to use; "m" is for these only (extend it for a real modal).
const MODAL_VERBS = new Set(['ต้อง', 'ควร', 'ควรจะ', 'สมควร', 'สามารถ', 'อาจ', 'อาจจะ', 'น่าจะ', 'ได้', 'กล้า', 'จำเป็น', 'จำเป็นต้อง', 'จำต้อง']);
// The same spelling must always carry the same tag (the tag decides which patterns a verb takes),
// and the same romanization, unless it is listed here with the reason.
// หอม is two different words: "be fragrant" (smell, a state) and "give a peck on the cheek" (kiss, an action).
const TAG_ALLOWLIST = new Set(['หอม']);
// true homographs: one Thai spelling read two ways by two different verbs (the verb is the key)
const ROM_ALLOWLIST = new Set([]);
// Spellings with a fixed role in the engine: they must carry the tag the engine expects.
const FIXED_TAGS = { 'เป็น': 's', 'คือ': 's', 'มี': 's', 'อยู่': 's', 'ต้อง': 'm', 'ควร': 'm', 'สามารถ': 'm', 'อาจ': 'm' };
// Tags that the audits settled (a spelling listed here must carry exactly this tag wherever it occurs).
const SETTLED_TAGS = {
  // modals
  'ควรจะ': 'm', 'สมควร': 'm', 'จำเป็น': 'm', 'จำต้อง': 'm', 'กล้า': 'm', 'ต้อง': 'm', 'สามารถ': 'm', 'อาจ': 'm',
  // states and feelings that the audit found tagged on one line and not on another
  'ชื่นชม': 's', 'นับถือ': 's', 'คาด': 's', 'ใฝ่ฝัน': 's', 'สงบ': 's', 'อาศัย': 's', 'พึ่งพา': 's', 'แทน': 's', 'ถือ ว่า': 's', 'ขาด': 's',
  'เปียก': 's', 'ปวด': 's', 'ชา': 's', 'พำนัก': 's', 'ดื่มด่ำ': 's', 'กลมกลืน': 's', 'ตั้งใจ': 's', 'มี ส่วน': 's', 'มี ส่วนร่วม': 's',
  'เห็น ต่าง': 's', 'เกิดจาก': 's', 'เห็นด้วย': 's', 'ตรง กัน': 's', 'เข้า กัน': 's', 'มองเห็น': 's', 'เกิน': 's', 'จำ': 's', 'โกรธ': 's', 'โมโห': 's', 'สับสน': 's', 'ดูเหมือน': 's', 'สังกัด': 's',
  // instant verbs
  'บรรลุ': 'a', 'สำเร็จ': 'a', 'โผล่': 'a', 'ปรากฏ': 'a', 'ตก': 'a', 'หล่น': 'a', 'เกิดขึ้น': 'a', 'เกิด': 'a', 'คว้า': 'a', 'เอาชนะ': 'a',
  'สิ้นสุด': 'a', 'หมด': 'a', 'ตกใจ': 'a', 'ตกตะลึง': 'a', 'ได้มา': 'a', 'ทำ สำเร็จ': 'a',
};
// Weather verbs the engine knows (their sentences have the subject ฝน, หิมะ ... instead of a pronoun).
const WEATHER = { ฝนตก: ['ฝน', 'ตก'], หิมะตก: ['หิมะ', 'ตก'], ลูกเห็บตก: ['ลูกเห็บ', 'ตก'], เห็บตก: ['เห็บ', 'ตก'], ฟ้าร้อง: ['ฟ้า', 'ร้อง'], ฟ้าแลบ: ['ฟ้า', 'แลบ'],
  ฟ้าผ่า: ['ฟ้า', 'ผ่า'], แดดออก: ['แดด', 'ออก'], ลมพัด: ['ลม', 'พัด'], ฝนปรอย: ['ฝน', 'ปรอย'] };
// เป็น and คือ are negated with ไม่ ใช่, so their negative present holds ใช่ but not the verb.
const NEGATED_WITHOUT_VERB = new Set(['เป็น', 'คือ']);

const questionKeys = ['qMai', 'qYet'];
const commandKeys = ['impAff', 'impNeg'];
const hasMark = (text, mark) => text.endsWith(mark);

// Is `needle` (a list of words) found in order inside `haystack` (a list of words)?
function inOrder(needle, haystack) {
  let at = 0;
  for (const word of haystack) if (word === needle[at]) at += 1;
  return at >= needle.length;
}

// Checks every entry of a verb table; returns the problems found and the number of translations.
function validateDatabase(verbs) {
  const failures = [];
  let translations = 0;
  const tagOf = new Map(); // spelling -> { tag, english }
  const romOf = new Map(); // spelling -> { rom, english }
  const wordRomOf = new Map(); // one Thai word -> { rom, entry }
  const bareOf = new Map(); // spelling without spaces -> { th, rom, tag, english }

  for (const [english, options] of Object.entries(verbs)) {
    if (!Array.isArray(options) || !options.length) { failures.push(`${english}: no translations`); continue; }
    const seenHere = new Set();
    options.forEach(entry => {
      translations += 1;
      const { th, rom } = entry;
      const tag = entry.tag === undefined ? '' : entry.tag;
      const label = `${english} -> ${th} ${rom}`;
      if (typeof th !== 'string' || typeof rom !== 'string') { failures.push(`${label}: th and rom must be strings`); return; }
      if ('note' in entry && typeof entry.note !== 'string') failures.push(`${label}: note is not a string`);
      if (seenHere.has(th.replace(/ /g, ''))) failures.push(`${label}: listed twice under ${english}`);
      seenHere.add(th.replace(/ /g, ''));

      // Thai script: Thai letters and single spaces only, NFC, one or two words
      if (!/^[\u0E00-\u0E7F]+(?: [\u0E00-\u0E7F]+)?$/.test(th)) failures.push(`${label}: not Thai script (U+0E00-U+0E7F, one or two words with a single space)`);
      if (th !== th.normalize('NFC')) failures.push(`${label}: not NFC`);
      if (th.includes('\uFFFD') || rom.includes('\uFFFD')) failures.push(`${label}: contains a U+FFFD replacement character`);
      const thWords = th.split(' ');
      thWords.filter(Boolean).forEach(word => {
        const problem = checkThaiWord(word);
        if (problem) failures.push(`${label}: Thai word "${word}": ${problem}`);
      });

      // romanization: [a-z' -], one romanized word for each Thai word
      if (!/^[a-z'-]+(?: [a-z'-]+)*$/.test(rom)) failures.push(`${label}: romanization must be lowercase a-z (with ' or -), single spaces, no tone marks`);
      const romWords = rom.split(' ');
      if (romWords.length !== thWords.length) failures.push(`${label}: ${thWords.length} Thai word(s) but ${romWords.length} romanized word(s)`);
      romWords.forEach(word => {
        const problem = checkRomWord(word);
        if (problem) failures.push(`${label}: romanized word "${word}": ${problem}`);
      });
      if (romWords.length === thWords.length) {
        thWords.forEach((word, i) => {
          // the letters ย and ว at the end of a word are the sounds -i and -o: ขยาย khayai, ข้าว khao
          const ending = FINAL_VOWEL_ENDINGS.find(([thai]) => thai.test(word));
          if (ending && !ending[1].test(romWords[i])) failures.push(`${label}: "${romWords[i]}" should end in ${ending[1]} for ${word}`);
          if (!CONSONANT_EXCEPTIONS.has(word) && /^[ก-๛]+$/.test(word) && !consonantsMatch(word, romWords[i])) {
            failures.push(`${label}: "${romWords[i]}" does not match the consonants of ${word}`);
          }
        });
      }

      // grammar words, particles and pronouns are not verbs
      if (GRAMMAR_WORDS.has(th) && !(GRAMMAR_AS_MODAL.has(th) && tag === 'm')) failures.push(`${label}: "${th}" is a grammar word, not a verb`);
      if (LEADING_GRAMMAR.has(thWords[0]) && thWords.length > 1) failures.push(`${label}: begins with the grammar word "${thWords[0]}"`);
      thWords.slice(1).filter(word => NO_GRAMMAR_INSIDE.has(word)).forEach(word => failures.push(`${label}: holds the grammar word "${word}"`));
      if (PRONOUN_FIRST.has(thWords[0])) failures.push(`${label}: begins with the pronoun "${thWords[0]}", so its sentences would read "${thWords[0]} ${th}"`);
      if (NOT_VERBS.has(th)) failures.push(`${label}: "${th}" is an adverb or particle, not a verb`);

      // one romanization per spelling (whole entry, and each Thai word)
      const seenRom = romOf.get(th);
      const sameEntryClash = seenRom && seenRom.rom !== rom && !ROM_ALLOWLIST.has(th);
      if (sameEntryClash) failures.push(`${label}: romanized "${rom}" but "${th}" is romanized "${seenRom.rom}" under ${seenRom.english}`);
      if (!seenRom) romOf.set(th, { rom, english });
      // each Thai word too (reported once: skipped when the whole entry was already reported)
      if (romWords.length === thWords.length) {
        thWords.forEach((word, i) => {
          const seen = wordRomOf.get(word);
          if (seen && seen.rom !== romWords[i] && !sameEntryClash && !ROM_ALLOWLIST.has(word) && !ROM_ALLOWLIST.has(th)) {
            failures.push(`${label}: the word "${word}" is romanized "${romWords[i]}" but "${seen.rom}" in ${seen.entry}`);
          }
          if (!seen) wordRomOf.set(word, { rom: romWords[i], entry: `${english} -> ${th} ${rom}` });
        });
      }

      // the same verb written with and without a space (กลับ มา, กลับมา) must read and be tagged the same
      const bare = th.replace(/ /g, '');
      const seenBare = bareOf.get(bare);
      if (seenBare && seenBare.th !== th && seenBare.tag !== tag && !TAG_ALLOWLIST.has(th)) {
        failures.push(`${label}: tagged "${tag}" but "${seenBare.th}" (the same word) is tagged "${seenBare.tag}" under ${seenBare.english}`);
      }
      if (seenBare && seenBare.th !== th && seenBare.rom.replace(/[ -]/g, '') !== rom.replace(/[ -]/g, '')) {
        failures.push(`${label}: romanized "${rom}" but "${seenBare.th}" (the same word) is romanized "${seenBare.rom}" under ${seenBare.english}`);
      }
      if (!seenBare) bareOf.set(bare, { th, rom, tag, english });

      // tags: one per spelling, and the roles the engine fixes
      if (!['', 's', 'a', 'm'].includes(tag)) failures.push(`${label}: unknown tag "${tag}"`);
      const seenTag = tagOf.get(th);
      if (seenTag && seenTag.tag !== tag && !TAG_ALLOWLIST.has(th)) {
        failures.push(`${label}: tagged "${tag}" but "${th}" is tagged "${seenTag.tag}" under ${seenTag.english}`);
      }
      if (!seenTag) tagOf.set(th, { tag, english });
      if (Object.hasOwn(FIXED_TAGS, th) && FIXED_TAGS[th] !== tag) failures.push(`${label}: "${th}" must be tagged "${FIXED_TAGS[th]}"`);
      if (Object.hasOwn(SETTLED_TAGS, th) && SETTLED_TAGS[th] !== tag) failures.push(`${label}: "${th}" must be tagged "${SETTLED_TAGS[th]}"`);
      if (tag === 'm' && !MODAL_VERBS.has(th.replace(/ /g, ''))) failures.push(`${label}: tagged "m" but "${th}" is not a known modal verb (add it to MODAL_VERBS in test.js if it is one)`);

      // every sentence
      let result;
      try { result = express({ th, rom, tag }); } catch (error) { failures.push(`${label}: express() threw: ${error.message}`); return; }
      if (result.th !== th || result.rom !== rom) failures.push(`${label}: express() returns "${result.th}" / "${result.rom}"`);
      const key = th.replace(/ /g, '');
      const weather = Object.hasOwn(WEATHER, key) ? WEATHER[key] : null;
      for (const rowKey of ROW_KEYS) {
        const row = result.rows[rowKey];
        if (!Array.isArray(row) || row.length !== 6) { failures.push(`${label}: malformed row ${rowKey}`); continue; }
        row.forEach((cell, person) => {
          if (cell === null) return;
          const where = `${label}.${rowKey}[${person}]`;
          if (typeof cell !== 'object' || typeof cell.th !== 'string' || typeof cell.rom !== 'string' || !cell.th || !cell.rom) {
            failures.push(`${where}: cell is not { th, rom } with both lines filled`); return;
          }
          const text = `${cell.th} / ${cell.rom}`;
          if (/undefined|NaN|null|\[object/.test(text)) failures.push(`${where}: broken cell "${text}"`);
          if (cell.th !== cell.th.trim() || /\s{2,}/.test(cell.th) || cell.rom !== cell.rom.trim() || /\s{2,}/.test(cell.rom)) failures.push(`${where}: stray space in "${text}"`);
          if (cell.th !== cell.th.normalize('NFC')) failures.push(`${where}: not NFC: "${cell.th}"`);
          if (/[.。]$/.test(cell.th) || /\.$/.test(cell.rom)) failures.push(`${where}: final full stop in "${text}"`);
          const mark = questionKeys.includes(rowKey) ? '?' : commandKeys.includes(rowKey) ? '!' : '';
          if (mark && !(hasMark(cell.th, mark) && hasMark(cell.rom, mark))) failures.push(`${where}: should end with "${mark}": "${text}"`);
          if (!mark && /[?!]$/.test(cell.th + cell.rom)) failures.push(`${where}: unexpected "?" or "!" at the end of "${text}"`);
          const cellTh = (mark ? cell.th.slice(0, -1) : cell.th).split(' ');
          const cellRom = (mark ? cell.rom.slice(0, -1) : cell.rom).split(' ');
          if (cellTh.length !== cellRom.length) { failures.push(`${where}: ${cellTh.length} Thai word(s) but ${cellRom.length} romanized word(s) in "${text}"`); return; }
          cellTh.forEach((word, i) => {
            if (word !== '…' && !/^[ก-ฺเ-๎]+$/.test(word)) failures.push(`${where}: "${word}" is not a Thai word in "${text}"`);
            if (cellRom[i] !== '…' && !/^[a-z'-]+$/.test(cellRom[i])) failures.push(`${where}: "${cellRom[i]}" is not a romanized word in "${text}"`);
            if ((word === '…') !== (cellRom[i] === '…')) failures.push(`${where}: "…" does not line up in "${text}"`);
          });
          // the sentence holds the verb (a weather verb holds its two parts; เป็น and คือ are negated with ใช่)
          if (weather) {
            if (!weather.every(part => cellTh.includes(part))) failures.push(`${where}: "${cell.th}" does not contain ${weather.join(' + ')}`);
          } else if (!(NEGATED_WITHOUT_VERB.has(th) && rowKey === 'negPres')) {
            // เป็น + a role noun is negated ไม่ ใช่ + the noun (เป็น ผู้นำ -> ไม่ ใช่ ผู้นำ): เป็น itself is replaced
            const be = rowKey === 'negPres' && thWords.length === 2 && thWords[0] === 'เป็น' && !LEXICAL_BE_TEST.has(thWords[1]);
            const needTh = be ? thWords.slice(1) : thWords, needRom = be ? romWords.slice(1) : romWords;
            if (!inOrder(needTh, cellTh)) failures.push(`${where}: "${cell.th}" does not contain the verb "${th}"`);
            if (!inOrder(needRom, cellRom)) failures.push(`${where}: "${cell.rom}" does not contain the romanization "${rom}"`);
          }
          // the pronoun of the column heads the sentence (a weather verb has its own subject)
          if (!weather || rowKey === 'wish' || rowKey === 'want') {
            const [pTh, pRom] = PRONOUNS[person];
            if (!inOrder(pTh.split(' '), cellTh)) failures.push(`${where}: "${cell.th}" does not contain the pronoun ${pTh}`);
            if (!inOrder(pRom.split(' '), cellRom)) failures.push(`${where}: "${cell.rom}" does not contain the pronoun ${pRom}`);
          }
        });
      }
      if (!result.rows.pres.every(Boolean)) failures.push(`${label}: no present-tense pattern`);
    });
  }
  return { failures, translations, tagOf };
}

const database = validateDatabase(VERBS);
database.failures.forEach(message => failures.push(message));
const { translations, tagOf } = database;

// Romanizations that the audits corrected: each Thai word must be written this way everywhere it occurs.
const SETTLED_WORD_ROMANIZATIONS = {
  ขยาย: 'khayai', ขยายตัว: 'khayaitua', ขยายขนาด: 'khayaikhanat', ขยายพันธุ์: 'khayaiphan', เดินเรือ: 'doenruea', กรง: 'krong',
  คอมเมนต์: 'khommen', ดาวน์โหลด: 'daolot', ศึกษา: 'sueksa', การศึกษา: 'kansueksa', ปฏิวัติ: 'patiwat', กะพริบ: 'kaphrip', เท: 'the',
  เพ่ง: 'pheng', ขับไล่: 'khaplai', ซ้อน: 'son', ทับซ้อน: 'thapson', ติดตั้ง: 'tittang', ติดตาม: 'tittam', ห้ามปราม: 'hampram',
  ตกแต่ง: 'toktaeng', ปรับแต่ง: 'praptaeng', ผ่อนคลาย: 'phonkhlai', โหยหา: 'hoiha', เปล่ง: 'pleng', ซึม: 'suem', หวงแหน: 'huanghaen',
  เกลี้ยกล่อม: 'kliaklom', ชะงัก: 'cha-ngak', ระงับ: 'ra-ngap', หยุดชะงัก: 'yutcha-ngak', นับถือ: 'napthue', โฆษณา: 'khotsana', เว็บ: 'wep',
  เลื่อย: 'lueai', แบล็กเมล์: 'blaekme', ดิสเครดิต: 'ditkhredit', ห่มผ้า: 'hompha', กราฟ: 'krap', สกี: 'sa-ki', สแกน: 'sa-kaen',
  รีสตาร์ท: 'risa-tat', ความบันเทิง: 'khwambanthoeng', กลมกลืน: 'klomkluen', ลบล้าง: 'loplang', ตั้งใจ: 'tangchai',
  นิ้ว: 'nio', นิ่วหน้า: 'niona', ล้มเหลว: 'lomleo', สงบ: 'sa-ngop', สงวน: 'sa-nguan', ผงาด: 'pha-ngat', ผงะ: 'pha-nga',
};
for (const [word, expected] of Object.entries(SETTLED_WORD_ROMANIZATIONS)) {
  report.checks += 1;
  let found = 0;
  for (const [english, options] of Object.entries(VERBS)) {
    for (const entry of options) {
      const thWords = entry.th.split(' ');
      const romWords = entry.rom.split(' ');
      thWords.forEach((thWord, i) => {
        if (thWord !== word) return;
        found += 1;
        if (romWords[i] !== expected) failures.push(`${english} -> ${entry.th} ${entry.rom}: "${word}" must be romanized "${expected}"`);
      });
    }
  }
  if (!found) failures.push(`SETTLED_WORD_ROMANIZATIONS: "${word}" is no longer in verbs.js (remove it from the list if that is intended)`);
}

// The validator itself: each of these tiny tables must be reported, and the good one must not be.
function expectProblem(label, table, pattern) {
  report.checks += 1;
  const { failures: found } = validateDatabase(table);
  if (!found.some(message => pattern.test(message))) {
    failures.push(`validator: ${label} was not reported (found: ${found.join(' | ') || 'nothing'})`);
  }
}
const one = (th, rom, tag = '') => ({ x: [{ th, rom, tag }] });
expectProblem('Latin letters', one('speak', 'speak'), /not Thai script/);
expectProblem('a digit', one('พูด1', 'phut'), /not Thai script/);
expectProblem('three words', one('กิน ข้าว ดี', 'kin khao di'), /not Thai script/);
expectProblem('marks in the wrong order', one('ผู้', 'phu'), /not NFC/);
expectProblem('a word that cannot begin so', one('ิพูด', 'phut'), /cannot begin a word/);
expectProblem('a word that cannot end so', one('พูดเ', 'phut'), /ends with a leading vowel/);
expectProblem('word-count mismatch', one('พูด', 'phut phut'), /1 Thai word\(s\) but 2 romanized/);
expectProblem('uppercase romanization', one('พูด', 'Phut'), /must be lowercase a-z/);
expectProblem('romanization with j', one('รัก', 'jak'), /uses "j"/);
expectProblem('romanization with no vowel', one('พูด', 'phth'), /has no vowel/);
expectProblem('a grammar word', one('แล้ว', 'laeo'), /grammar word/);
expectProblem('ได้ untagged', one('ได้', 'dai'), /grammar word/);
expectProblem('ควร untagged', one('ควร', 'khuan'), /grammar word/);
expectProblem('a leading grammar word', one('กำลัง กิน', 'kamlang kin'), /begins with the grammar word/);
expectProblem('a grammar word inside', one('กิน แล้ว', 'kin laeo'), /holds the grammar word/);
expectProblem('a leading pronoun', one('ฉัน กิน', 'chan kin'), /begins with the pronoun/);
expectProblem('a particle as the verb', one('และ', 'lae'), /adverb or particle/);
expectProblem('an unknown tag', one('พูด', 'phut', 'x'), /unknown tag/);
expectProblem('a verb tagged m that is no modal', one('พูด', 'phut', 'm'), /not a known modal verb/);
expectProblem('เป็น with the wrong tag', one('เป็น', 'pen', ''), /must be tagged "s"/);
expectProblem('ต้อง with the wrong tag', one('ต้อง', 'tong', ''), /must be tagged "m"/);
expectProblem('plain p for aspirated ph', one('พูด', 'put'), /does not match the consonants/);
expectProblem('a letter left out of the romanization', one('เกลียด', 'kiat'), /does not match the consonants/);
expectProblem('aspirated ph for plain p', one('ห้ามปราม', 'hamphram'), /does not match the consonants/);
expectProblem('final -ai written -a', one('ขยาย', 'khaya'), /should end in/);
expectProblem('ิว written iu', one('นิ้ว', 'niu'), /should end in/);
expectProblem('เหลว written with ae', one('เหลว', 'laeo'), /should end in/);
expectProblem('a doubled letter lost', one('คอมเมนต์', 'khomen'), /does not match the consonants/);
expectProblem('the same verb with and without a space, tagged differently', {
  x: [{ th: 'กลับ มา', rom: 'klap ma', tag: '' }], y: [{ th: 'กลับมา', rom: 'klapma', tag: 'a' }],
}, /the same word\) is tagged ""/);
expectProblem('the same verb with and without a space, romanized differently', {
  x: [{ th: 'กลับ มา', rom: 'klap ma', tag: '' }], y: [{ th: 'กลับมา', rom: 'klapmaa', tag: '' }],
}, /the same word\) is romanized/);
expectProblem('a translation listed twice, once with a space', { x: [{ th: 'เปล่ง เสียง', rom: 'pleng siang', tag: '' }, { th: 'เปล่งเสียง', rom: 'plengsiang', tag: '' }] }, /listed twice/);
expectProblem('no translations', { x: [] }, /no translations/);
expectProblem('a translation listed twice', { x: [{ th: 'พูด', rom: 'phut', tag: '' }, { th: 'พูด', rom: 'phut', tag: '' }] }, /listed twice/);
expectProblem('two romanizations of one spelling', {
  x: [{ th: 'เดิน', rom: 'doen', tag: '' }], y: [{ th: 'เดิน', rom: 'dern', tag: '' }],
}, /romanized "dern" but "เดิน" is romanized "doen"/);
expectProblem('two tags for one spelling', {
  x: [{ th: 'รัก', rom: 'rak', tag: 's' }], y: [{ th: 'รัก', rom: 'rak', tag: '' }],
}, /tagged "" but "รัก" is tagged "s"/);
expectProblem('one Thai word read two ways', {
  x: [{ th: 'ทำ งาน', rom: 'tham ngan', tag: '' }], y: [{ th: 'ทำ ดี', rom: 'tam di', tag: '' }],
}, /the word "ทำ" is romanized "tam" but "tham"/);
// a well-formed table is reported clean
{
  report.checks += 1;
  const good = validateDatabase({
    speak: [{ th: 'พูด', rom: 'phut', tag: '' }, { th: 'กิน ข้าว', rom: 'kin khao', tag: '', note: 'eat' }],
    know: [{ th: 'รู้', rom: 'ru', tag: 's' }], must: [{ th: 'ต้อง', rom: 'tong', tag: 'm' }], can: [{ th: 'ได้', rom: 'dai', tag: 'm' }],
    be: [{ th: 'เป็น', rom: 'pen', tag: 's' }], rain: [{ th: 'ฝน ตก', rom: 'fon tok', tag: '' }], win: [{ th: 'ชนะ', rom: 'chana', tag: 'a' }],
  });
  if (good.failures.length) failures.push(`validator: a good table was reported: ${good.failures.join(' | ')}`);
}

// the audit fixes are really in the table
for (const spelling of Object.keys(SETTLED_TAGS)) {
  report.checks += 1;
  if (!tagOf.has(spelling)) failures.push(`SETTLED_TAGS: "${spelling}" is no longer in verbs.js (remove it from the list if that is intended)`);
}

// ---- from the independent review: single cells ------------------------------------------------------------
{
  const cell = (th, rom, tag, key, person) => express({ th, rom, tag }).rows[key][person];
  const same = (what, got, want) => { report.checks += 1; if ((got ? got.th + ' / ' + got.rom : null) !== want) report.fail(`${what}: expected ${want}, got ${got ? got.th + ' / ' + got.rom : null}`); };
  // a one-word compound ending in "finished" is not "in progress" and takes no second เสร็จ
  same('ทำเสร็จ prog', cell('ทำเสร็จ', 'thamset', '', 'prog', 0), null);
  same('ทำเสร็จ futperf', cell('ทำเสร็จ', 'thamset', '', 'futperf', 0), 'ถึง ตอน นั้น ฉัน จะ ทำเสร็จ แล้ว / thueng ton nan chan cha thamset laeo');
  same('ทำ เสร็จ futperf', cell('ทำ เสร็จ', 'tham set', '', 'futperf', 0), 'ถึง ตอน นั้น ฉัน จะ ทำ เสร็จ แล้ว / thueng ton nan chan cha tham set laeo');
  // the reciprocal กัน inside one word is not doubled in "let us"
  same('พันกัน imp', cell('พันกัน', 'phankan', '', 'impAff', 3), 'เรา พันกัน เถอะ! / rao phankan thoe!');
  same('พันกัน impNeg', cell('พันกัน', 'phankan', '', 'impNeg', 3), 'เรา อย่า พันกัน เลย! / rao ya phankan loei!');
  // changes of state written as one word get plain แล้ว in the future perfect
  same('เพิ่มขึ้น futperf', cell('เพิ่มขึ้น', 'phoemkhun', '', 'futperf', 0), 'ถึง ตอน นั้น ฉัน จะ เพิ่มขึ้น แล้ว / thueng ton nan chan cha phoemkhun laeo');
  // more states that are neither "in progress" nor "just now"
  same('ไร้ prog', cell('ไร้', 'rai', 's', 'prog', 0), null);
  same('ไร้ recent', cell('ไร้', 'rai', 's', 'recent', 0), null);
  // "not yet" with a state verb is ยัง ไม่ + verb; perception keeps ยัง ไม่ ได้
  same('ชอบ negNotYet', cell('ชอบ', 'chop', 's', 'negNotYet', 0), 'ฉัน ยัง ไม่ ชอบ / chan yang mai chop');
  same('เห็น negNotYet', cell('เห็น', 'hen', 's', 'negNotYet', 0), 'ฉัน ยัง ไม่ ได้ เห็น / chan yang mai dai hen');
  // เป็น + a role noun is negated ไม่ ใช่; a fixed combination keeps ไม่ เป็น
  same('เป็น ผู้นำ negPres', cell('เป็น ผู้นำ', 'pen phunam', 's', 'negPres', 0), 'ฉัน ไม่ ใช่ ผู้นำ / chan mai chai phunam');
  same('เป็น ห่วง negPres', cell('เป็น ห่วง', 'pen huang', 's', 'negPres', 0), 'ฉัน ไม่ เป็น ห่วง / chan mai pen huang');
  // becoming is an event: "has become" is ไป แล้ว
  same('กลายเป็น perfect', cell('กลายเป็น', 'klaipen', 'a', 'perfect', 0), 'ฉัน กลายเป็น ไป แล้ว / chan klaipen pai laeo');
}

report.finish(
  `${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Thai translations`,
  { limit: 80 },
);
