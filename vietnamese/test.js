// Run with: node test.js
// Checks the pattern engine against known sentences (every pattern for a good number of
// verbs), checks that unreadable entries are refused, then validates every verb in
// verbs.js: lowercase NFC Vietnamese spelling, well-formed syllables, one to four of
// them, a single tag per spelling, and a well-formed sentence in every cell.
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const report = createReport();
const { failures } = report;

// ---- Known sentences ---------------------------------------------------------
// A block is lines "key: sentence" for the first person (tôi); "-" means the pattern
// is not used with this kind of verb; six sentences separated by " | " give all six
// persons (tôi, bạn, anh ấy, chúng tôi/ta, các bạn, họ). {v} stands for the verb.
// Keys given with a single sentence are also checked for the other five persons:
// only the pronoun changes, the verb never does.
const PRONOUNS = ['tôi', 'bạn', 'anh ấy', 'chúng tôi', 'các bạn', 'họ'];

function parseBlock(text, vi) {
  const rows = {};
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const colon = line.indexOf(':');
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().split('{v}').join(vi);
    if (key in rows) throw new Error(`test.js: duplicate key ${key} in the block for ${vi}`);
    rows[key] = value === '-' ? null : value.includes(' | ') ? value.split(' | ') : value;
  }
  return rows;
}

// Ordinary action verbs take every pattern.
const ORDINARY = `
  pres: tôi {v}
  prog: tôi đang {v}
  completed: tôi đã {v}
  exper: tôi đã từng {v}
  perfect: tôi đã {v} rồi
  recent: tôi vừa {v}
  pastprog: lúc đó tôi đang {v}
  pluperf: trước đó tôi đã {v} rồi
  fut: tôi sẽ {v}
  nearfut: tôi sắp {v}
  futperf: đến lúc đó tôi sẽ {v} xong
  cond: nếu …, tôi sẽ {v}
  condperf: nếu lúc đó …, tôi đã {v} rồi
  hyp: nếu tôi {v}
  hypperf: giá mà lúc đó tôi đã {v}
  wish: ước gì tôi {v}
  impAff: để tôi {v}! | bạn hãy {v}! | để anh ấy {v}! | chúng ta hãy {v}! | các bạn hãy {v}! | để họ {v}!
  impNeg: đừng để tôi {v}! | bạn đừng {v}! | đừng để anh ấy {v}! | chúng ta đừng {v}! | các bạn đừng {v}! | đừng để họ {v}!
  negPres: tôi không {v}
  negPast: tôi chưa {v}
  negExper: tôi chưa từng {v}
  negDid: tôi đã không {v}
  can: tôi có thể {v}
  should: tôi nên {v}
  want: tôi muốn {v}
  qCo: tôi có {v} không?
  qRoi: tôi đã {v} chưa?
`;

// State verbs: no "in progress", "just now", "about to" or commands; "by then" is
// "đã ... rồi" instead of "sẽ ... xong".
const STATE = `
  pres: tôi {v}
  prog: -
  completed: tôi đã {v}
  exper: tôi đã từng {v}
  perfect: tôi đã {v} rồi
  recent: -
  pastprog: -
  pluperf: trước đó tôi đã {v} rồi
  fut: tôi sẽ {v}
  nearfut: -
  futperf: đến lúc đó tôi đã {v} rồi
  cond: nếu …, tôi sẽ {v}
  condperf: nếu lúc đó …, tôi đã {v} rồi
  hyp: nếu tôi {v}
  hypperf: giá mà lúc đó tôi đã {v}
  wish: ước gì tôi {v}
  impAff: -
  impNeg: -
  negPres: tôi không {v}
  negPast: tôi chưa {v}
  negExper: tôi chưa từng {v}
  negDid: tôi đã không {v}
  can: tôi có thể {v}
  should: tôi nên {v}
  want: tôi muốn {v}
  qCo: tôi có {v} không?
  qRoi: tôi đã {v} chưa?
`;

// Instant (achievement) verbs: everything except "in progress"; "by then" is "đã ... rồi".
const ACHIEVEMENT = `
  pres: tôi {v}
  prog: -
  completed: tôi đã {v}
  exper: tôi đã từng {v}
  perfect: tôi đã {v} rồi
  recent: tôi vừa {v}
  pastprog: -
  pluperf: trước đó tôi đã {v} rồi
  fut: tôi sẽ {v}
  nearfut: tôi sắp {v}
  futperf: đến lúc đó tôi đã {v} rồi
  cond: nếu …, tôi sẽ {v}
  condperf: nếu lúc đó …, tôi đã {v} rồi
  hyp: nếu tôi {v}
  hypperf: giá mà lúc đó tôi đã {v}
  wish: ước gì tôi {v}
  impAff: để tôi {v}! | bạn hãy {v}! | để anh ấy {v}! | chúng ta hãy {v}! | các bạn hãy {v}! | để họ {v}!
  impNeg: đừng để tôi {v}! | bạn đừng {v}! | đừng để anh ấy {v}! | chúng ta đừng {v}! | các bạn đừng {v}! | đừng để họ {v}!
  negPres: tôi không {v}
  negPast: tôi chưa {v}
  negExper: tôi chưa từng {v}
  negDid: tôi đã không {v}
  can: tôi có thể {v}
  should: tôi nên {v}
  want: tôi muốn {v}
  qCo: tôi có {v} không?
  qRoi: tôi đã {v} chưa?
`;

// Each case: { verb: { vi, tag }, rows: { key: expected } }; `full` cases name every key.
const CASES = [];
const addFull = (template, tag, list) => list.forEach(vi =>
  CASES.push({ verb: { vi, tag }, rows: parseBlock(template, vi), full: true }));

addFull(ORDINARY, '', ['nói', 'đi học', 'gọi điện thoại', 'làm việc', 'ăn', 'viết', 'đọc']);
// biết and hiểu are states that are not "in progress", but "vừa biết", "sắp hiểu" and commands are fine
const STATE_KNOW = STATE
  .replace(/^  recent: -$/m, '  recent: tôi vừa {v}')
  .replace(/^  nearfut: -$/m, '  nearfut: tôi sắp {v}')
  .replace(/^  impAff: -$/m, '  impAff: để tôi {v}! | bạn hãy {v}! | để anh ấy {v}! | chúng ta hãy {v}! | các bạn hãy {v}! | để họ {v}!')
  .replace(/^  impNeg: -$/m, '  impNeg: đừng để tôi {v}! | bạn đừng {v}! | đừng để anh ấy {v}! | chúng ta đừng {v}! | các bạn đừng {v}! | đừng để họ {v}!');
addFull(STATE_KNOW, 's', ['biết', 'hiểu']);
// relational states refuse đang, vừa, sắp and commands
addFull(STATE, 's', ['thuộc về', 'khác', 'phù hợp']);
// yêu, nhớ and ở are states that still take "đang" (tôi đang yêu, tôi đang nhớ, tôi đang ở)
const STATE_IN_PROGRESS = STATE_KNOW
  .replace(/^  prog: -$/m, '  prog: tôi đang {v}')
  .replace(/^  pastprog: -$/m, '  pastprog: lúc đó tôi đang {v}');
addFull(STATE_IN_PROGRESS, 's', ['yêu', 'nhớ']);
// posture and dwelling verbs are states too, but "tôi đang sống ở Huế", "tôi đang nằm" are normal
addFull(STATE_IN_PROGRESS, 's', ['nằm', 'sống', 'cư trú', 'sinh sống', 'cư ngụ']);
// most instant verbs can be "in progress" (tôi đang đến, đội tôi đang thắng); punctual ones cannot
const ACHIEVEMENT_OPEN = ACHIEVEMENT
  .replace(/^  prog: -$/m, '  prog: tôi đang {v}')
  .replace(/^  pastprog: -$/m, '  pastprog: lúc đó tôi đang {v}');
addFull(ACHIEVEMENT_OPEN, 'a', ['đến', 'thắng', 'thua', 'chết']);
addFull(ACHIEVEMENT, 'a', ['tìm thấy', 'nhận ra', 'nổ']);

// Modal verbs only take present, negation (none is "not yet"), "if", wish and the
// yes/no question; "có thể" is negated "không thể", never "không có thể".
const MODAL_BLOCKED = `
  prog: -
  completed: -
  exper: -
  perfect: -
  recent: -
  pastprog: -
  pluperf: -
  fut: -
  nearfut: -
  futperf: -
  cond: -
  condperf: -
  hypperf: -
  impAff: -
  impNeg: -
  negExper: -
  negDid: -
  can: -
  should: -
  want: -
  qRoi: -
`;
// the other modals also take past and future (tôi đã có thể làm, tôi sẽ có thể làm, tôi đã không thể)
const MODAL_STILL_BLOCKED = `
  prog: -
  pastprog: -
  exper: -
  recent: -
  nearfut: -
  futperf: -
  condperf: -
  hypperf: -
  impAff: -
  impNeg: -
  negExper: -
  can: -
  should: -
  want: -
`;
CASES.push({
  verb: { vi: 'có thể', tag: 'm' }, full: true,
  rows: parseBlock(`
    pres: tôi có thể
    completed: tôi đã có thể
    perfect: tôi đã có thể rồi
    pluperf: trước đó tôi đã có thể rồi
    fut: tôi sẽ có thể
    cond: nếu …, tôi sẽ có thể
    hyp: nếu tôi có thể
    wish: ước gì tôi có thể
    negPres: tôi không thể
    negPast: tôi chưa thể
    negDid: tôi đã không thể
    qCo: tôi có thể không?
    qRoi: tôi đã có thể chưa?
  ${MODAL_STILL_BLOCKED}`, 'có thể'),
});
CASES.push({
  verb: { vi: 'nên', tag: 'm' }, full: true,
  rows: parseBlock(`
    pres: tôi nên
    negPres: tôi không nên
    negPast: tôi chưa nên
    hyp: nếu tôi nên
    wish: ước gì tôi nên
    qCo: tôi có nên không?
  ${MODAL_BLOCKED}`, 'nên'),
});
CASES.push({
  verb: { vi: 'phải', tag: 'm' },
  rows: parseBlock(`
    pres: tôi phải
    negPres: tôi không phải
    hyp: nếu tôi phải
    prog: tôi đang phải
    completed: tôi đã phải
    fut: tôi sẽ phải
    negDid: tôi đã không phải
    can: -
    want: -
    qRoi: tôi đã phải chưa?
  `, 'phải'),
});
CASES.push({
  verb: { vi: 'cần', tag: 'm' },
  rows: parseBlock(`
    pres: tôi cần
    negPres: tôi không cần
    negPast: tôi chưa cần
    qCo: tôi có cần không?
    completed: tôi đã cần
    fut: tôi sẽ cần
    impAff: -
  `, 'cần'),
});
CASES.push({
  verb: { vi: 'dám', tag: 'm' },
  rows: parseBlock(`
    pres: tôi dám
    negPres: tôi không dám
    negPast: tôi chưa dám
    wish: ước gì tôi dám
    qCo: tôi có dám không?
    exper: -
    futperf: -
  `, 'dám'),
});

// là (to be): negated "không phải là"; a state verb, so no progressive or commands.
CASES.push({
  verb: { vi: 'là', tag: 's' }, full: true,
  rows: parseBlock(`
    pres: tôi là
    prog: -
    completed: tôi đã là
    exper: tôi đã từng là
    perfect: tôi đã là rồi
    recent: -
    pastprog: -
    pluperf: trước đó tôi đã là rồi
    fut: tôi sẽ là
    nearfut: -
    futperf: đến lúc đó tôi đã là rồi
    cond: nếu …, tôi sẽ là
    condperf: nếu lúc đó …, tôi đã là rồi
    hyp: nếu tôi là
    hypperf: giá mà lúc đó tôi đã là
    wish: ước gì tôi là
    impAff: để tôi là! | bạn hãy là! | để anh ấy là! | chúng ta hãy là! | các bạn hãy là! | để họ là!
    impNeg: đừng để tôi là! | bạn đừng là! | đừng để anh ấy là! | chúng ta đừng là! | các bạn đừng là! | đừng để họ là!
    negPres: tôi không phải là
    negPast: tôi chưa phải là
    negExper: tôi chưa từng là
    negDid: tôi đã không phải là
    can: tôi có thể là
    should: tôi nên là
    want: tôi muốn là
    qCo: tôi có phải là không?
    qRoi: tôi đã là chưa?
  `, 'là'),
});

// có (to have, to exist): không có, chưa có; the question has a single "có".
CASES.push({
  verb: { vi: 'có', tag: 's' }, full: true,
  rows: parseBlock(`
    pres: tôi có
    prog: tôi đang có
    completed: tôi đã có
    exper: tôi đã từng có
    perfect: tôi đã có rồi
    recent: tôi vừa có
    pastprog: lúc đó tôi đang có
    pluperf: trước đó tôi đã có rồi
    fut: tôi sẽ có
    nearfut: tôi sắp có
    futperf: đến lúc đó tôi đã có rồi
    cond: nếu …, tôi sẽ có
    condperf: nếu lúc đó …, tôi đã có rồi
    hyp: nếu tôi có
    hypperf: giá mà lúc đó tôi đã có
    wish: ước gì tôi có
    impAff: để tôi có! | bạn hãy có! | để anh ấy có! | chúng ta hãy có! | các bạn hãy có! | để họ có!
    impNeg: đừng để tôi có! | bạn đừng có! | đừng để anh ấy có! | chúng ta đừng có! | các bạn đừng có! | đừng để họ có!
    negPres: tôi không có
    negPast: tôi chưa có
    negExper: tôi chưa từng có
    negDid: tôi đã không có
    can: tôi có thể có
    should: tôi nên có
    want: tôi muốn có
    qCo: tôi có không?
    qRoi: tôi đã có chưa?
  `, 'có'),
});

// ở (to be at, to live): không ở, chưa ở; tôi đang ở nhà is the normal "I am at home".
CASES.push({
  verb: { vi: 'ở', tag: 's' }, full: true,
  rows: parseBlock(`
    pres: tôi ở
    prog: tôi đang ở
    completed: tôi đã ở
    exper: tôi đã từng ở
    perfect: tôi đã ở rồi
    recent: -
    pastprog: lúc đó tôi đang ở
    pluperf: trước đó tôi đã ở rồi
    fut: tôi sẽ ở
    nearfut: -
    futperf: đến lúc đó tôi đã ở rồi
    cond: nếu …, tôi sẽ ở
    condperf: nếu lúc đó …, tôi đã ở rồi
    hyp: nếu tôi ở
    hypperf: giá mà lúc đó tôi đã ở
    wish: ước gì tôi ở
    impAff: để tôi ở! | bạn hãy ở! | để anh ấy ở! | chúng ta hãy ở! | các bạn hãy ở! | để họ ở!
    impNeg: đừng để tôi ở! | bạn đừng ở! | đừng để anh ấy ở! | chúng ta đừng ở! | các bạn đừng ở! | đừng để họ ở!
    negPres: tôi không ở
    negPast: tôi chưa ở
    negExper: tôi chưa từng ở
    negDid: tôi đã không ở
    can: tôi có thể ở
    should: tôi nên ở
    want: tôi muốn ở
    qCo: tôi có ở không?
    qRoi: tôi đã ở chưa?
  `, 'ở'),
});

// muốn (to want) is a state verb that cannot be wanted: no "tôi muốn muốn".
CASES.push({
  verb: { vi: 'muốn', tag: 's' }, full: true,
  rows: parseBlock(`
    pres: tôi muốn
    prog: tôi đang muốn
    completed: tôi đã muốn
    exper: tôi đã từng muốn
    perfect: tôi đã muốn rồi
    recent: -
    pastprog: lúc đó tôi đang muốn
    pluperf: trước đó tôi đã muốn rồi
    fut: tôi sẽ muốn
    nearfut: -
    futperf: đến lúc đó tôi đã muốn rồi
    cond: nếu …, tôi sẽ muốn
    condperf: nếu lúc đó …, tôi đã muốn rồi
    hyp: nếu tôi muốn
    hypperf: giá mà lúc đó tôi đã muốn
    wish: ước gì tôi muốn
    impAff: -
    impNeg: -
    negPres: tôi không muốn
    negPast: tôi chưa muốn
    negExper: tôi chưa từng muốn
    negDid: tôi đã không muốn
    can: tôi có thể muốn
    should: tôi nên muốn
    want: -
    qCo: tôi có muốn không?
    qRoi: tôi đã muốn chưa?
  `, 'muốn'),
});

// More verbs, a few patterns each: the pronoun changes, the verb never does.
const SHORT_ORDINARY = `
  pres: tôi {v}
  prog: tôi đang {v}
  completed: tôi đã {v}
  recent: tôi vừa {v}
  fut: tôi sẽ {v}
  negPres: tôi không {v}
  negPast: tôi chưa {v}
  qCo: tôi có {v} không?
  qRoi: tôi đã {v} chưa?
  impAff: để tôi {v}! | bạn hãy {v}! | để anh ấy {v}! | chúng ta hãy {v}! | các bạn hãy {v}! | để họ {v}!
`;
const SHORT_STATE = `
  pres: tôi {v}
  prog: tôi đang {v}
  recent: tôi vừa {v}
  nearfut: tôi sắp {v}
  impAff: để tôi {v}! | bạn hãy {v}! | để anh ấy {v}! | chúng ta hãy {v}! | các bạn hãy {v}! | để họ {v}!
  impNeg: đừng để tôi {v}! | bạn đừng {v}! | đừng để anh ấy {v}! | chúng ta đừng {v}! | các bạn đừng {v}! | đừng để họ {v}!
  completed: tôi đã {v}
  negPres: tôi không {v}
  negPast: tôi chưa {v}
  qCo: tôi có {v} không?
  qRoi: tôi đã {v} chưa?
`;
const SHORT_ACHIEVEMENT_OPEN = `
  pres: tôi {v}
  prog: tôi đang {v}
  pastprog: lúc đó tôi đang {v}
  recent: tôi vừa {v}
  nearfut: tôi sắp {v}
  completed: tôi đã {v}
  negPast: tôi chưa {v}
  qCo: tôi có {v} không?
  qRoi: tôi đã {v} chưa?
`;
const SHORT_ACHIEVEMENT = `
  pres: tôi {v}
  prog: -
  pastprog: -
  recent: tôi vừa {v}
  nearfut: tôi sắp {v}
  completed: tôi đã {v}
  negPast: tôi chưa {v}
  qCo: tôi có {v} không?
  qRoi: tôi đã {v} chưa?
`;
const addShort = (template, tag, list) => list.forEach(vi =>
  CASES.push({ verb: { vi, tag }, rows: parseBlock(template, vi) }));

addShort(SHORT_ORDINARY, '', ['đi', 'về', 'chạy', 'bay', 'mở', 'đóng', 'mua', 'bán', 'cho', 'lấy', 'ngủ',
  'uống', 'học', 'giúp', 'gặp', 'hỏi', 'trả lời', 'cười', 'khóc', 'nấu ăn', 'nói chuyện']);
addShort(SHORT_STATE, 's', ['thích', 'tin', 'sợ', 'ghét']);
addShort(SHORT_ACHIEVEMENT_OPEN, 'a', ['chết', 'mất', 'thua', 'đạt được']);
addShort(SHORT_ACHIEVEMENT, 'a', ['quên', 'tìm ra']);

// ---- from the independent review ---------------------------------------------------------------------
const SIX = text => Array(6).fill(text);
// weather verbs have the fixed subject "trời" whatever the pronoun; no commands, can, should or want
CASES.push({
  verb: { vi: 'mưa', tag: '' },
  rows: {
    pres: SIX('trời mưa'), prog: SIX('trời đang mưa'), completed: SIX('trời đã mưa'), fut: SIX('trời sẽ mưa'),
    negPres: SIX('trời không mưa'), negPast: SIX('trời chưa mưa'), qCo: SIX('trời có mưa không?'),
    impAff: null, impNeg: null, can: null, should: null, want: null,
  },
});
CASES.push({ verb: { vi: 'tuyết rơi', tag: '' }, rows: { pres: SIX('trời tuyết rơi'), fut: SIX('trời sẽ tuyết rơi'), want: null, impAff: null } });
// most state verbs take đang, vừa, sắp and commands (đừng lo lắng!, hãy tin tôi!)
for (const vi of ['lo lắng', 'sợ', 'buồn', 'cần phải']) {
  CASES.push({
    verb: { vi, tag: 's' },
    rows: {
      prog: 'tôi đang ' + vi, recent: 'tôi vừa ' + vi, nearfut: 'tôi sắp ' + vi,
      impNeg: ['đừng để tôi ' + vi + '!', 'bạn đừng ' + vi + '!', 'đừng để anh ấy ' + vi + '!', 'chúng ta đừng ' + vi + '!', 'các bạn đừng ' + vi + '!', 'đừng để họ ' + vi + '!'],
    },
  });
}
CASES.push({ verb: { vi: 'tin', tag: 's' }, rows: { impAff: ['để tôi tin!', 'bạn hãy tin!', 'để anh ấy tin!', 'chúng ta hãy tin!', 'các bạn hãy tin!', 'để họ tin!'] } });
// relational states and the verbs that already mean "want" refuse the extra patterns
for (const vi of ['bao gồm', 'trùng khớp', 'cấu thành']) {
  CASES.push({ verb: { vi, tag: 's' }, rows: { prog: null, pastprog: null, recent: null, nearfut: null, impAff: null, impNeg: null } });
}
for (const vi of ['cần', 'mong', 'ao ước', 'khao khát', 'định', 'hy vọng']) {
  CASES.push({ verb: { vi, tag: 's' }, rows: { want: null, pres: 'tôi ' + vi } });
}
// "có" inside the verb does not get a second "có" in the question
CASES.push({ verb: { vi: 'trông có vẻ', tag: 's' }, rows: { qCo: 'tôi trông có vẻ không?', prog: null } });
CASES.push({ verb: { vi: 'nghe có vẻ', tag: 's' }, rows: { qCo: 'tôi nghe có vẻ không?' } });
// "đang làm xong" is not Vietnamese
CASES.push({ verb: { vi: 'làm xong', tag: '' }, rows: { prog: null, pastprog: null, completed: 'tôi đã làm xong' } });
// instant verbs can be "in progress" (tôi đang đến, đội tôi đang thua); punctual ones cannot
CASES.push({ verb: { vi: 'đến', tag: 'a' }, rows: { prog: 'tôi đang đến', pastprog: 'lúc đó tôi đang đến' } });
CASES.push({ verb: { vi: 'nổ', tag: 'a' }, rows: { prog: null, completed: 'tôi đã nổ' } });
// modals take past and future (tôi đã phải đợi, tôi sẽ phải đi, tôi đã không thể), but nên stays limited
CASES.push({ verb: { vi: 'phải', tag: 'm' }, rows: { completed: 'tôi đã phải', fut: 'tôi sẽ phải', prog: 'tôi đang phải', cond: 'nếu …, tôi sẽ phải' } });
CASES.push({ verb: { vi: 'buộc phải', tag: 'm' }, rows: { completed: 'tôi đã buộc phải', fut: 'tôi sẽ buộc phải', negDid: 'tôi đã không buộc phải' } });
CASES.push({ verb: { vi: 'nên', tag: 'm' }, rows: { completed: null, fut: null, prog: null, negDid: null } });
CASES.push({ verb: { vi: 'có thể', tag: 'm' }, rows: { negDid: 'tôi đã không thể', fut: 'tôi sẽ có thể', prog: null } });

// the tag is optional: no tag is an ordinary action verb
CASES.push({
  verb: { vi: 'nói' },
  rows: { prog: 'tôi đang nói', impAff: parseBlock('x: để tôi nói! | bạn hãy nói! | để anh ấy nói! | chúng ta hãy nói! | các bạn hãy nói! | để họ nói!', 'nói').x },
});

// Verbs that begin with "muốn" are not "wanted" again: no "tôi muốn muốn nói".
CASES.push({
  verb: { vi: 'muốn nói', tag: 's' }, full: true,
  rows: parseBlock(`
    pres: tôi {v}
    prog: tôi đang {v}
    completed: tôi đã {v}
    exper: tôi đã từng {v}
    perfect: tôi đã {v} rồi
    recent: -
    pastprog: lúc đó tôi đang {v}
    pluperf: trước đó tôi đã {v} rồi
    fut: tôi sẽ {v}
    nearfut: -
    futperf: đến lúc đó tôi đã {v} rồi
    cond: nếu …, tôi sẽ {v}
    condperf: nếu lúc đó …, tôi đã {v} rồi
    hyp: nếu tôi {v}
    hypperf: giá mà lúc đó tôi đã {v}
    wish: ước gì tôi {v}
    impAff: -
    impNeg: -
    negPres: tôi không {v}
    negPast: tôi chưa {v}
    negExper: tôi chưa từng {v}
    negDid: tôi đã không {v}
    can: tôi có thể {v}
    should: tôi nên {v}
    want: -
    qCo: tôi có {v} không?
    qRoi: tôi đã {v} chưa?
  `, 'muốn nói'),
});
// A verb that already ends in "xong" or "hết" does not take a second "xong" in the future perfect.
for (const vi of ['làm xong', 'dùng hết']) {
  CASES.push({
    verb: { vi, tag: '' },
    rows: parseBlock(`
      futperf: đến lúc đó tôi đã {v} rồi
      perfect: tôi đã {v} rồi
      prog: ${vi.endsWith('xong') ? '-' : 'tôi đang {v}'}
      fut: tôi sẽ {v}
      want: tôi muốn {v}
      qCo: tôi có {v} không?
    `, vi),
  });
}
for (const vi of ['xong', 'hết']) {
  CASES.push({
    verb: { vi, tag: 'a' },
    rows: parseBlock(`
      futperf: đến lúc đó tôi đã {v} rồi
      prog: ${vi === 'xong' ? '-' : 'tôi đang {v}'}
      recent: tôi vừa {v}
      impNeg: đừng để tôi {v}! | bạn đừng {v}! | đừng để anh ấy {v}! | chúng ta đừng {v}! | các bạn đừng {v}! | đừng để họ {v}!
    `, vi),
  });
}
// "đừng quên!" (do not forget) is the normal way to say it: quên is an instant verb, not a state
CASES.push({
  verb: { vi: 'quên', tag: 'a' },
  rows: parseBlock(`
    impNeg: đừng để tôi {v}! | bạn đừng {v}! | đừng để anh ấy {v}! | chúng ta đừng {v}! | các bạn đừng {v}! | đừng để họ {v}!
    recent: tôi vừa {v}
    nearfut: tôi sắp {v}
    prog: -
  `, 'quên'),
});
// verbs that begin with "có" take a single "có" in the question
CASES.push({
  verb: { vi: 'có mặt', tag: 'a' },
  rows: parseBlock(`
    qCo: tôi {v} không?
    can: tôi có thể {v}
    pres: tôi {v}
    negPres: tôi không {v}
  `, 'có mặt'),
});

// @@CASES-END@@ (add new cases above this line)

// ---- Running the known sentences ----------------------------------------------

function checkCases() {
  for (const { verb, rows, full } of CASES) {
    const label = `${verb.vi}${verb.tag ? ` [${verb.tag}]` : ''}`;
    const result = express(verb);
    report.checks += 1;
    if (result.vi !== verb.vi) failures.push(`${label}: express().vi is "${result.vi}"`);
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
        : Array.isArray(expected) ? expected
          : PRONOUNS.map(pronoun => expected.split(' ').map(w => (w === 'tôi' ? pronoun : w)).join(' '));
      want.forEach((text, person) => {
        report.checks += 1;
        const got = actual[person] ? actual[person].vi : null;
        if (got !== text) failures.push(`${label}.${key}[${person}]\n    expected: ${text}\n    actual:   ${got}`);
      });
    }
  }
}
checkCases();

// ---- The shape of the result ---------------------------------------------------

const EXPECTED_KEYS = ['pres', 'prog', 'completed', 'exper', 'perfect', 'recent', 'pastprog', 'pluperf',
  'fut', 'nearfut', 'futperf', 'cond', 'condperf', 'hyp', 'hypperf', 'wish', 'impAff', 'impNeg',
  'negPres', 'negPast', 'negExper', 'negDid', 'can', 'should', 'want', 'qCo', 'qRoi'];
report.checks += 1;
if (JSON.stringify(ROW_KEYS) !== JSON.stringify(EXPECTED_KEYS)) failures.push(`ROW_KEYS changed: ${ROW_KEYS}`);
report.checks += 1;
if (!Object.isFrozen(ROW_KEYS) && !Array.isArray(ROW_KEYS)) failures.push('ROW_KEYS must be an array');
report.checks += 1;
if (ROW_KEYS.length < 24 || !['pres', 'completed', 'fut'].every(key => ROW_KEYS.includes(key))) {
  failures.push('ROW_KEYS needs at least 24 keys including pres, completed and fut');
}
{
  const result = express({ vi: 'nói', tag: '' });
  report.checks += 1;
  if (Object.keys(result).sort().join() !== 'rows,vi') failures.push(`express() returns { vi, rows }, got ${Object.keys(result)}`);
  report.checks += 1;
  if (Object.keys(result.rows).join() !== ROW_KEYS.join()) failures.push('express().rows has the keys of ROW_KEYS in order');
  for (const key of ROW_KEYS) {
    report.checks += 1;
    const row = result.rows[key];
    if (!Array.isArray(row) || row.length !== 6 || row.some(cell => !cell || Object.keys(cell).join() !== 'vi' || typeof cell.vi !== 'string')) {
      failures.push(`nói.${key}: a row is six { vi } cells`);
    }
  }
}

// ---- Entries that must be refused ----------------------------------------------
// An entry the engine cannot read throws a clear error instead of being guessed at.

function refuses(label, entry, pattern) {
  report.checks += 1;
  try { express(entry); } catch (error) {
    if (!(error instanceof Error) || !pattern.test(error.message)) failures.push(`${label}: wrong error "${error && error.message}"`);
    return;
  }
  failures.push(`${label}: did not throw`);
}
refuses('uppercase verb', { vi: 'Nói', tag: '' }, /"Nói" must be lowercase/);
refuses('all-uppercase verb', { vi: 'NÓI', tag: 's' }, /must be lowercase/);
refuses('capital Đ', { vi: 'Đi học', tag: '' }, /must be lowercase/);
refuses('empty verb', { vi: '', tag: '' }, /verb is empty/);
refuses('blank verb', { vi: '   ', tag: '' }, /verb is empty/);
refuses('missing verb', { tag: '' }, /verb is empty/);
refuses('verb that is not a string', { vi: 42, tag: '' }, /verb is empty/);
refuses('no entry', undefined, /must be an object/);
refuses('null entry', null, /must be an object/);
refuses('entry that is a string', 'nói', /must be an object/);
refuses('unknown tag', { vi: 'nói', tag: 'x' }, /unknown tag "x" for "nói"/);
refuses('uppercase tag', { vi: 'biết', tag: 'S' }, /unknown tag "S"/);
refuses('tag with two letters', { vi: 'biết', tag: 'sa' }, /unknown tag "sa"/);
refuses('double space', { vi: 'đi  học', tag: '' }, /stray spaces/);
refuses('leading space', { vi: ' nói', tag: '' }, /stray spaces/);
refuses('trailing space', { vi: 'nói ', tag: '' }, /stray spaces/);
refuses('tab between syllables', { vi: 'đi\thọc', tag: '' }, /stray spaces/);
refuses('decomposed letters', { vi: 'no\u0301i', tag: '' }, /precomposed \(NFC\)/);
refuses('decomposed horn', { vi: 'tho\u031B', tag: '' }, /precomposed \(NFC\)/);
// the readable ones do not throw
for (const entry of [{ vi: 'nói', tag: '' }, { vi: 'nói', tag: undefined }, { vi: 'nói', tag: null }, { vi: 'nói' },
  { vi: 'đi học', tag: '' }, { vi: 'đến', tag: 'a' }, { vi: 'biết', tag: 's' }, { vi: 'nên', tag: 'm' }]) {
  report.checks += 1;
  try { express(entry); } catch (error) { failures.push(`${JSON.stringify(entry)} should be readable: ${error.message}`); }
}
// ---- Checking Vietnamese spelling ------------------------------------------------
// A syllable is [onset] + nucleus + [final consonant] with one optional tone mark; the
// checks below find typos (a missing diacritic, a wrong letter, a tone mark on the
// wrong vowel) without needing a dictionary.

const TONE_MARKS = { '\u0300': 'grave', '\u0301': 'acute', '\u0309': 'hook', '\u0303': 'tilde', '\u0323': 'dot' };
const MODIFIER_MARKS = new Set(['\u0302', '\u0306', '\u031b']); // circumflex, breve, horn
const LETTERS = new Set([...'abcdđefghijklmnopqrstuvwxyzăâêôơư']);
const MODIFIED = 'ăâêôơư';
const ONSETS = ['ngh', 'ng', 'nh', 'ch', 'gh', 'gi', 'kh', 'ph', 'th', 'tr', 'qu',
  'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'r', 's', 't', 'v', 'x', ''];
const CODAS = ['ch', 'ng', 'nh', 'c', 'm', 'n', 'p', 't', ''];
const NUCLEI = new Set(`a ă â e ê i o ô ơ u ư y
  ai ao au ay âu ây eo êu ia iê iu oa oă oe oi ôi ơi ua uâ uê ui uô uy ưa ưi ưu ươ uơ yê
  iêu yêu oai oay oeo uây uôi uya uyê ươi ươu uyu`.split(/\s+/));
// nuclei that end in a vowel sound of their own and take no final consonant
const OPEN_ONLY = new Set(`ia ua ưa uya uơ ai ao au ay âu ây eo êu iu oi ôi ơi ui ưi ưu
  oai oay oeo uây uôi ươi ươu iêu yêu uyu`.split(/\s+/));
// nuclei that never end a syllable
const CODA_REQUIRED = new Set(['ă', 'â', 'iê', 'yê', 'uô', 'ươ', 'uyê', 'uâ']);
// Loanword syllables kept as in the foreign language (extend only for a real loanword).
const LOAN_SYLLABLES = new Set(['email', 'web', 'chat', 'click', 'fax', 'scan', 'test',
  'tweet', 'video', 'patin', 'valse']); // đăng tweet, quay video, trượt patin, nhảy valse

function splitSyllable(syllable) {
  const letters = [];
  let tone = '';
  let toneAt = -1;
  for (const ch of syllable.normalize('NFD')) {
    if (TONE_MARKS[ch]) {
      if (!letters.length) return { problem: 'a tone mark with no letter' };
      if (tone) return { problem: 'more than one tone mark' };
      tone = TONE_MARKS[ch];
      toneAt = letters.length - 1;
    } else if (MODIFIER_MARKS.has(ch)) {
      if (!letters.length) return { problem: 'an accent with no letter' };
      letters[letters.length - 1] += ch;
    } else if (/[\u0300-\u036f]/.test(ch)) {
      return { problem: `unexpected accent U+${ch.codePointAt(0).toString(16)}` };
    } else letters.push(ch);
  }
  const composed = letters.map(letter => letter.normalize('NFC'));
  const bad = composed.find(letter => !LETTERS.has(letter));
  if (bad !== undefined) return { problem: `"${bad}" is not a Vietnamese letter` };
  return { letters: composed, tone, toneAt };
}

// Positions inside the nucleus where the tone mark may stand.
function markPositions(nucleus, closed) {
  const n = [...nucleus];
  if (n.length === 1) return [0];
  const modified = n.map((c, i) => (MODIFIED.includes(c) ? i : -1)).filter(i => i >= 0);
  if (modified.length) return [modified[modified.length - 1]];
  if (['oa', 'oe', 'uy'].includes(nucleus)) return closed ? [1] : [0, 1]; // hòa / hoà
  if (['oai', 'oay', 'oeo', 'uyu'].includes(nucleus)) return [1];
  if (nucleus === 'uya') return [0, 1, 2];
  return [0];
}

function checkReading(onset, nucleus, coda, tone, toneAt) {
  if (!NUCLEI.has(nucleus)) return 'not a Vietnamese syllable';
  const first = nucleus[0];
  const soft = 'eêiy';
  if (onset === 'k' && !soft.includes(first)) return '"k" only stands before e, ê, i, y';
  if (onset === 'c' && soft.includes(first)) return '"c" cannot stand before e, ê, i, y (write "k")';
  if (onset === 'gh' && !'eêi'.includes(first)) return '"gh" only stands before e, ê, i';
  if (onset === 'g' && ('eê'.includes(first) || (first === 'i' && nucleus !== 'i'))) return '"g" cannot stand before e, ê (write "gh")';
  if (onset === 'ngh' && !'eêi'.includes(first)) return '"ngh" only stands before e, ê, i';
  if (onset === 'ng' && 'eêi'.includes(first)) return '"ng" cannot stand before e, ê, i (write "ngh")';
  if (onset === 'gi' && first === 'i') return 'doubled i after "gi"';
  if (onset === 'qu' && first === 'u') return 'doubled u after "qu"';
  if (!coda && CODA_REQUIRED.has(nucleus)) return `"${nucleus}" needs a final consonant`;
  if (coda && OPEN_ONLY.has(nucleus)) return `"${nucleus}" cannot take a final consonant`;
  if ((coda === 'ch' || coda === 'nh') && !'aêiy'.includes(nucleus[nucleus.length - 1])) return `"${coda}" does not follow "${nucleus}"`;
  if (['c', 'ch', 'p', 't'].includes(coda) && tone !== 'acute' && tone !== 'dot') {
    return `a syllable ending in "${coda}" takes only the acute or the dot-below tone`;
  }
  if (tone) {
    const start = [...onset].length;
    const positions = markPositions(nucleus, Boolean(coda)).map(i => i + start);
    if (!positions.includes(toneAt)) return 'tone mark on the wrong vowel';
  }
  return '';
}

// Returns '' for a well-formed syllable, else a description of the problem.
function checkSyllable(syllable) {
  if (LOAN_SYLLABLES.has(syllable)) return '';
  const parts = splitSyllable(syllable);
  if (parts.problem) return parts.problem;
  const { letters, tone, toneAt } = parts;
  const base = letters.join('');
  const problems = [];
  for (const onset of ONSETS) {
    if (!base.startsWith(onset)) continue;
    const rest = base.slice(onset.length);
    for (const coda of CODAS) {
      if (!rest.endsWith(coda)) continue;
      const nucleus = rest.slice(0, rest.length - coda.length);
      const problem = checkReading(onset, nucleus, coda, tone, toneAt);
      if (!problem) return '';
      problems.push(problem);
    }
  }
  // the most specific complaint: anything other than "not a syllable at all"
  return problems.find(p => p !== 'not a Vietnamese syllable') || 'not a Vietnamese syllable';
}

// The checker itself: known good syllables (all from real words) and known bad ones.
const GOOD_SYLLABLES = `nói đi học gọi điện thoại làm việc biết hiểu yêu thích muốn có là ở cần nhớ tin sợ đến thắng
  chết tìm thấy nhận ra ăn uống viết đọc mua bán giúp chạy mở đóng cho lấy gặp hỏi trả lời cười khóc nấu quên thua mất
  đạt được ngủ nghĩ nghe nghỉ nghề nghiêng ghi ghét gửi giữ giặt giết giải giao gì gia quay quý quyết quân quốc khuya
  khuyên chuyển chuyện thuyền thủy thuỷ hoàn hóa hoá hòa hoà hoạch hoặc khỏe khoẻ ngoài ngoái yên ý y ôm ơi ươm rượu hươu
  người tiếng tiếp kiếm kiêng kết kể kéo kính lệnh xẻng ếch ích anh sách hãy đừng chưa không sẽ đã đang rồi vừa sắp từng
  nếu thì mà tuyệt luyện xuống buộc thuộc muối đuổi tuổi cưới mừng bắt bật tắt nhặt lặp nấp hứa cứu chịu gỡ ngã ngắm ngồi
  đứng nằm thức dậy tập cắt giảm tăng mượn rút thoát khoan xoay xoáy khuấy khuân huấn truyền thuở huơ loét oán bỏ từ xin
  lỗi bảo rửa vẽ thở hát múa bơi leo nhảy đặt để mang cầm kéo đẩy ném bắn đá đánh nắm sờ ngửi nếm liếm cắn nuốt nhai thổi
  hôn ôm tặng nhận gửi chuyển vận đổi sửa chữa xây dựng trồng gieo gặt tưới hái nhổ`.split(/\s+/);
const BAD_SYLLABLES = ['tieng', 'ci', 'ge', 'ngi', 'nghan', 'tac', 'bat', 'sắch', 'bech', 'đọk', 'qu', 'qa', 'nóia',
  'tíêng', 'nghíêng', 'ba\u0309\u0301', 'Nói', 'nói1', 'giờư', 'xẻnh', 'ka', 'kh', 'đ', 'ph', 'săc'];
for (const syllable of GOOD_SYLLABLES) {
  report.checks += 1;
  const problem = checkSyllable(syllable);
  if (problem) failures.push(`spelling checker rejects the good syllable "${syllable}": ${problem}`);
}
for (const syllable of BAD_SYLLABLES) {
  report.checks += 1;
  if (!checkSyllable(syllable)) failures.push(`spelling checker accepts the bad syllable "${syllable}"`);
}
// ---- Validating the verb database -----------------------------------------------

const PARTICLES = new Set(['đã', 'đang', 'sẽ', 'không', 'chưa', 'hãy', 'đừng']);
// A verb may not begin with one of these either ("không biết" would double the negation).
const LEADING_PARTICLES = new Set(['đang', 'sẽ', 'không', 'chưa', 'hãy', 'đừng']);
const VIETNAMESE_LETTERS = /^[a-zàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]+$/;
// The same spelling must always carry the same tag (the tag decides which patterns a verb
// takes), unless it is listed here with the reason.
const TAG_ALLOWLIST = new Set([]);
// Spellings with a fixed role in the engine: they must carry the tag the engine expects.
const FIXED_TAGS = { 'là': 's', 'có': 's', 'ở': 's', 'có thể': 'm' };
// "có thể" is negated "không thể": its negative sentences hold "thể" but not "có thể".
const NEGATED_WITHOUT_CO = new Set(['negPres', 'negPast', 'negDid']);

// Things the audits found; each must stay fixed.
// Tags that the audits settled (a spelling listed here must carry exactly this tag wherever it occurs).
const SETTLED_TAGS = {
  // instant events: vỡ (it breaks), thoát (get out), xảy ra is NOT here: "đang xảy ra" is the normal way to say it
  'vỡ': 'a', 'thoát': 'a', 'đến': 'a', 'tới': 'a', 'quên': 'a', 'có mặt': 'a', 'suy ra': 'a', 'phát hiện': 'a',
  'khỏi bệnh': 'a', 'giật mình': 'a', 'thi trượt': 'a',
  // everyday actions that take "đang": nghe, nghĩ, xảy ra, tắt, trượt, nứt, hỏng, mọc, mắc, phấn khích, dự định, ước
  'nghe': '', 'nghĩ': '', 'xảy ra': '', 'tắt': '', 'trượt': '', 'nứt': '', 'hỏng': '', 'mọc': '', 'mắc': '',
  'phấn khích': '', 'dự định': '', 'ước': '', 'nổi giận': '', 'ghi nhớ': '', 'nắm giữ': '', 'chiếm': '', 'cho thấy': '',
  'vượt trội': '',
  // states: posture and dwelling verbs (they also take "đang", see PROGRESSIVE_STATES), meaning and appearance verbs
  'nằm': 's', 'sống': 's', 'cư trú': 's', 'sinh sống': 's', 'cư ngụ': 's', 'ngụ ý': 's', 'biểu thị': 's',
  'cấu thành': 's', 'tôn trọng': 's', 'hấp dẫn': 's', 'cần': 's', 'biết': 's', 'tỏ ra': 's',
};
// Adverbs and particles that are not verbs ("hình như", "dường như" cannot take "đã", "không" or "sẽ").
const NOT_VERBS = new Set(['dường như', 'hình như', 'có lẽ', 'chắc là', 'rất', 'cũng', 'vẫn', 'còn', 'mới', 'thì', 'mà']);
// A verb that begins with a pronoun reads like a typo in the table ("tôi tôi luyện").
const PRONOUN_FIRST = new Set(['tôi', 'bạn', 'họ', 'ta']);
// "là" is the verb "to be" and takes the special negation "không phải là"; "to iron" must not use it.
let laOwners = [];

let translations = 0;
const tagOf = new Map(); // spelling -> { tag, english }
const questionKeys = ['qCo', 'qRoi'];
const commandKeys = ['impAff', 'impNeg'];

for (const [english, options] of Object.entries(VERBS)) {
  if (!Array.isArray(options) || !options.length) { failures.push(`${english}: no translations`); continue; }
  options.forEach(entry => {
    translations += 1;
    const { vi, tag } = entry;
    const label = `${english} -> ${vi}`;
    if (typeof vi !== 'string') { failures.push(`${label}: vi is not a string`); return; }
    if ('note' in entry && typeof entry.note !== 'string') failures.push(`${label}: note is not a string`);

    // spelling
    if (vi !== vi.toLowerCase()) failures.push(`${label}: not lowercase`);
    if (vi !== vi.normalize('NFC')) failures.push(`${label}: not NFC (use precomposed letters)`);
    const syllables = vi.split(' ');
    if (syllables.some(syllable => !syllable)) failures.push(`${label}: stray or double spaces`);
    if (syllables.length < 1 || syllables.length > 4) failures.push(`${label}: ${syllables.length} syllables (one to four allowed)`);
    syllables.filter(Boolean).forEach(syllable => {
      if (!VIETNAMESE_LETTERS.test(syllable)) {
        failures.push(`${label}: syllable "${syllable}" has letters outside the Vietnamese alphabet`);
        return;
      }
      const problem = checkSyllable(syllable);
      if (problem) failures.push(`${label}: syllable "${syllable}": ${problem}`);
    });

    // particles are not verbs
    if (PARTICLES.has(vi)) failures.push(`${label}: "${vi}" is a particle, not a verb`);
    if (LEADING_PARTICLES.has(syllables[0]) && syllables.length > 1) failures.push(`${label}: begins with the particle "${syllables[0]}"`);

    // tags
    if (!['', 's', 'a', 'm'].includes(tag || '')) failures.push(`${label}: unknown tag "${tag}"`);
    const seen = tagOf.get(vi);
    if (seen && seen.tag !== (tag || '') && !TAG_ALLOWLIST.has(vi)) {
      failures.push(`${label}: tagged "${tag || ''}" but "${vi}" is tagged "${seen.tag}" under ${seen.english}`);
    }
    if (!seen) tagOf.set(vi, { tag: tag || '', english });
    if (FIXED_TAGS[vi] !== undefined && FIXED_TAGS[vi] !== (tag || '')) failures.push(`${label}: "${vi}" must be tagged "${FIXED_TAGS[vi]}"`);
    if (SETTLED_TAGS[vi] !== undefined && SETTLED_TAGS[vi] !== (tag || '')) failures.push(`${label}: "${vi}" must be tagged "${SETTLED_TAGS[vi]}"`);
    if (NOT_VERBS.has(vi)) failures.push(`${label}: "${vi}" is an adverb or particle, not a verb`);
    if (PRONOUN_FIRST.has(syllables[0])) failures.push(`${label}: begins with the pronoun "${syllables[0]}", so its sentences would read "${syllables[0]} ${vi}"`);
    if (vi === 'là') laOwners.push(english);

    // every sentence
    let result;
    try { result = express({ vi, tag }); } catch (error) { failures.push(`${label}: express() threw: ${error.message}`); return; }
    if (result.vi !== vi) failures.push(`${label}: express().vi is "${result.vi}"`);
    for (const key of ROW_KEYS) {
      const row = result.rows[key];
      if (!Array.isArray(row) || row.length !== 6) { failures.push(`${label}: malformed row ${key}`); continue; }
      row.forEach((cell, person) => {
        if (cell === null) return;
        const where = `${label}.${key}[${person}]`;
        const text = cell && cell.vi;
        if (typeof text !== 'string' || !text) { failures.push(`${where}: cell is not { vi: string }`); return; }
        if (/undefined|NaN|null|\[object/.test(text)) failures.push(`${where}: broken cell "${text}"`);
        if (text !== text.trim() || /\s{2,}/.test(text)) failures.push(`${where}: stray space in "${text}"`);
        if (text !== text.normalize('NFC') || text !== text.toLowerCase()) failures.push(`${where}: not lowercase NFC: "${text}"`);
        const needle = vi === 'có thể' && NEGATED_WITHOUT_CO.has(key) ? 'thể' : vi;
        if (!text.includes(needle)) failures.push(`${where}: "${text}" does not contain the verb "${vi}"`);
        if (text.endsWith('.')) failures.push(`${where}: final full stop in "${text}"`);
        const end = text[text.length - 1];
        if (questionKeys.includes(key) && end !== '?') failures.push(`${where}: question without "?": "${text}"`);
        if (commandKeys.includes(key) && end !== '!') failures.push(`${where}: command without "!": "${text}"`);
        if (!questionKeys.includes(key) && !commandKeys.includes(key) && /[?!]$/.test(text)) failures.push(`${where}: unexpected "${end}" at the end of "${text}"`);
      });
    }
    if (!result.rows.pres.every(Boolean)) failures.push(`${label}: no present-tense pattern`);
  });
}

report.checks += 1;
if (laOwners.join() !== 'be') failures.push(`"là" may only translate "be" (it is also the Northern word for to iron, but the engine treats it as the copula); found under: ${laOwners}`);
// the audit fixes are really in the table
for (const spelling of Object.keys(SETTLED_TAGS)) {
  report.checks += 1;
  if (!tagOf.has(spelling)) failures.push(`SETTLED_TAGS: "${spelling}" is no longer in verbs.js (remove it from the list if that is intended)`);
}

report.finish(
  `${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Vietnamese translations`,
  { limit: 80 },
);
