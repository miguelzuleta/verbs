// Run with: node test.js
// Checks the pattern engine against paradigms written out by hand, checks the
// romanizer against known Revised Romanization, then validates every verb in
// verbs.js: the dictionary form is Hangul ending in 다, the tag matches the
// stem, and every row of the table is well formed.
//   node test.js --audit   also lists untagged verbs whose stem could hide an irregularity
const { express, ROW_KEYS, romanize } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const report = createReport();
const { failures } = report;

// ---- Helpers (independent of patterns.js) ---------------------------------------

// A spec is 'polite|formal|casual', a single string for the level-free rows
// (the same cell three times), '-' for a cell a level does not use, or null for
// a row that is left out altogether.
const expand = spec => {
  if (spec === null) return [null, null, null];
  if (!spec.includes('|')) return [spec, spec, spec];
  return spec.split('|').map(text => (text === '-' ? null : text));
};

// All 17 rows, in the order of ROW_KEYS:
// pres past fut neg pastNeg prog want can request suggest imperative and because if but modPres modPast
const FULL_KEYS = ['pres', 'past', 'fut', 'neg', 'pastNeg', 'prog', 'want', 'can', 'request', 'suggest',
  'imperative', 'and', 'because', 'if', 'but', 'modPres', 'modPast'];
const full = (...specs) => {
  if (specs.length !== FULL_KEYS.length) throw new Error(`test.js: a full paradigm needs ${FULL_KEYS.length} rows`);
  return Object.fromEntries(FULL_KEYS.map((key, i) => [key, specs[i]]));
};

let paradigmChecks = 0;
let paradigmVerbs = 0;
function checkParadigm(ko, tag, rows, field = 'ko') {
  const result = express({ ko, tag });
  const label = `${ko}${tag ? ` [${tag}]` : ''}`;
  for (const [key, spec] of Object.entries(rows)) {
    const actual = result.rows[key];
    if (!Array.isArray(actual) || actual.length !== 3) { failures.push(`${label}.${key}: not an array of three cells`); continue; }
    expand(spec).forEach((want, level) => {
      if (field === 'ko') paradigmChecks += 1;
      report.checks += 1;
      const got = actual[level] ? actual[level][field] : null;
      if (got !== want) failures.push(`${label}.${key}[${level}] (${field})\n    expected: ${want}\n    actual:   ${got}`);
    });
  }
}

// ---- Verbs whose whole table is written out (all 17 rows) ----------------------------

const COMPLETE = [
  // 하다 verb
  ['말하다', '', full(
    '말해요|말합니다|말해', '말했어요|말했습니다|말했어', '말할 거예요|말할 겁니다|말할 거야',
    '말하지 않아요|말하지 않습니다|말하지 않아', '말하지 않았어요|말하지 않았습니다|말하지 않았어',
    '말하고 있어요|말하고 있습니다|말하고 있어', '말하고 싶어요|말하고 싶습니다|말하고 싶어',
    '말할 수 있어요|말할 수 있습니다|말할 수 있어', '말해 주세요|말해 주십시오|말해 줘',
    '말해요|말합시다|말하자', '말하세요|말하십시오|말해',
    '말하고', '말해서', '말하면', '말하지만', '말하는', '말한')],
  // regular consonant stem: 으 is inserted
  ['먹다', '', full(
    '먹어요|먹습니다|먹어', '먹었어요|먹었습니다|먹었어', '먹을 거예요|먹을 겁니다|먹을 거야',
    '먹지 않아요|먹지 않습니다|먹지 않아', '먹지 않았어요|먹지 않았습니다|먹지 않았어',
    '먹고 있어요|먹고 있습니다|먹고 있어', '먹고 싶어요|먹고 싶습니다|먹고 싶어',
    '먹을 수 있어요|먹을 수 있습니다|먹을 수 있어', '먹어 주세요|먹어 주십시오|먹어 줘',
    '먹어요|먹읍시다|먹자', '먹으세요|먹으십시오|먹어',
    '먹고', '먹어서', '먹으면', '먹지만', '먹는', '먹은')],
  // vowel stem with ㅏ
  ['가다', '', full(
    '가요|갑니다|가', '갔어요|갔습니다|갔어', '갈 거예요|갈 겁니다|갈 거야',
    '가지 않아요|가지 않습니다|가지 않아', '가지 않았어요|가지 않았습니다|가지 않았어',
    '가고 있어요|가고 있습니다|가고 있어', '가고 싶어요|가고 싶습니다|가고 싶어',
    '갈 수 있어요|갈 수 있습니다|갈 수 있어', '가 주세요|가 주십시오|가 줘',
    '가요|갑시다|가자', '가세요|가십시오|가',
    '가고', '가서', '가면', '가지만', '가는', '간')],
  // vowel stem with ㅗ: 보+아 -> 봐
  ['보다', '', full(
    '봐요|봅니다|봐', '봤어요|봤습니다|봤어', '볼 거예요|볼 겁니다|볼 거야',
    '보지 않아요|보지 않습니다|보지 않아', '보지 않았어요|보지 않았습니다|보지 않았어',
    '보고 있어요|보고 있습니다|보고 있어', '보고 싶어요|보고 싶습니다|보고 싶어',
    '볼 수 있어요|볼 수 있습니다|볼 수 있어', '봐 주세요|봐 주십시오|봐 줘',
    '봐요|봅시다|보자', '보세요|보십시오|봐',
    '보고', '봐서', '보면', '보지만', '보는', '본')],
  // ㄹ-stem: ㄹ drops before ㅂ, ㅅ and ㄴ and no 으 is added
  ['살다', '', full(
    '살아요|삽니다|살아', '살았어요|살았습니다|살았어', '살 거예요|살 겁니다|살 거야',
    '살지 않아요|살지 않습니다|살지 않아', '살지 않았어요|살지 않았습니다|살지 않았어',
    '살고 있어요|살고 있습니다|살고 있어', '살고 싶어요|살고 싶습니다|살고 싶어',
    '살 수 있어요|살 수 있습니다|살 수 있어', '살아 주세요|살아 주십시오|살아 줘',
    '살아요|삽시다|살자', '사세요|사십시오|살아',
    '살고', '살아서', '살면', '살지만', '사는', '산')],
  // ㅡ-stem: 쓰+어 -> 써
  ['쓰다', '', full(
    '써요|씁니다|써', '썼어요|썼습니다|썼어', '쓸 거예요|쓸 겁니다|쓸 거야',
    '쓰지 않아요|쓰지 않습니다|쓰지 않아', '쓰지 않았어요|쓰지 않았습니다|쓰지 않았어',
    '쓰고 있어요|쓰고 있습니다|쓰고 있어', '쓰고 싶어요|쓰고 싶습니다|쓰고 싶어',
    '쓸 수 있어요|쓸 수 있습니다|쓸 수 있어', '써 주세요|써 주십시오|써 줘',
    '써요|씁시다|쓰자', '쓰세요|쓰십시오|써',
    '쓰고', '써서', '쓰면', '쓰지만', '쓰는', '쓴')],
  // ㅂ-irregular with 와
  ['돕다', 'b', full(
    '도와요|돕습니다|도와', '도왔어요|도왔습니다|도왔어', '도울 거예요|도울 겁니다|도울 거야',
    '돕지 않아요|돕지 않습니다|돕지 않아', '돕지 않았어요|돕지 않았습니다|돕지 않았어',
    '돕고 있어요|돕고 있습니다|돕고 있어', '돕고 싶어요|돕고 싶습니다|돕고 싶어',
    '도울 수 있어요|도울 수 있습니다|도울 수 있어', '도와 주세요|도와 주십시오|도와 줘',
    '도와요|도웁시다|돕자', '도우세요|도우십시오|도와',
    '돕고', '도와서', '도우면', '돕지만', '돕는', '도운')],
  // ㄷ-irregular
  ['듣다', 'd', full(
    '들어요|듣습니다|들어', '들었어요|들었습니다|들었어', '들을 거예요|들을 겁니다|들을 거야',
    '듣지 않아요|듣지 않습니다|듣지 않아', '듣지 않았어요|듣지 않았습니다|듣지 않았어',
    '듣고 있어요|듣고 있습니다|듣고 있어', '듣고 싶어요|듣고 싶습니다|듣고 싶어',
    '들을 수 있어요|들을 수 있습니다|들을 수 있어', '들어 주세요|들어 주십시오|들어 줘',
    '들어요|들읍시다|듣자', '들으세요|들으십시오|들어',
    '듣고', '들어서', '들으면', '듣지만', '듣는', '들은')],
  // ㅅ-irregular
  ['짓다', 's', full(
    '지어요|짓습니다|지어', '지었어요|지었습니다|지었어', '지을 거예요|지을 겁니다|지을 거야',
    '짓지 않아요|짓지 않습니다|짓지 않아', '짓지 않았어요|짓지 않았습니다|짓지 않았어',
    '짓고 있어요|짓고 있습니다|짓고 있어', '짓고 싶어요|짓고 싶습니다|짓고 싶어',
    '지을 수 있어요|지을 수 있습니다|지을 수 있어', '지어 주세요|지어 주십시오|지어 줘',
    '지어요|지읍시다|짓자', '지으세요|지으십시오|지어',
    '짓고', '지어서', '지으면', '짓지만', '짓는', '지은')],
  // 르-irregular
  ['모르다', 'reu', full(
    '몰라요|모릅니다|몰라', '몰랐어요|몰랐습니다|몰랐어', '모를 거예요|모를 겁니다|모를 거야',
    '모르지 않아요|모르지 않습니다|모르지 않아', '모르지 않았어요|모르지 않았습니다|모르지 않았어',
    '모르고 있어요|모르고 있습니다|모르고 있어', '모르고 싶어요|모르고 싶습니다|모르고 싶어',
    '모를 수 있어요|모를 수 있습니다|모를 수 있어', '몰라 주세요|몰라 주십시오|몰라 줘',
    '몰라요|모릅시다|모르자', '모르세요|모르십시오|몰라',
    '모르고', '몰라서', '모르면', '모르지만', '모르는', '모른')],
  // 있다: no "in progress"; the past modifier is -었던
  ['있다', '', full(
    '있어요|있습니다|있어', '있었어요|있었습니다|있었어', '있을 거예요|있을 겁니다|있을 거야',
    '있지 않아요|있지 않습니다|있지 않아', '있지 않았어요|있지 않았습니다|있지 않았어',
    null, '있고 싶어요|있고 싶습니다|있고 싶어',
    '있을 수 있어요|있을 수 있습니다|있을 수 있어', '있어 주세요|있어 주십시오|있어 줘',
    '있어요|있읍시다|있자', '있으세요|있으십시오|있어',
    '있고', '있어서', '있으면', '있지만', '있는', '있었던')],
];

// ---- Verbs checked on selected rows ---------------------------------------------------

const PARTIAL = [
  // 하다 verbs
  ['하다', '', { pres: '해요|합니다|해', past: '했어요|했습니다|했어', fut: '할 거예요|할 겁니다|할 거야',
    request: '해 주세요|해 주십시오|해 줘', suggest: '해요|합시다|하자', imperative: '하세요|하십시오|해',
    because: '해서', if: '하면', modPast: '한' }],
  ['공부하다', '', { pres: '공부해요|공부합니다|공부해', past: '공부했어요|공부했습니다|공부했어',
    fut: '공부할 거예요|공부할 겁니다|공부할 거야', because: '공부해서' }],
  ['좋아하다', '', { pres: '좋아해요|좋아합니다|좋아해', past: '좋아했어요|좋아했습니다|좋아했어',
    neg: '좋아하지 않아요|좋아하지 않습니다|좋아하지 않아', modPres: '좋아하는' }],

  // vowel stems: ㅏ
  ['사다', '', { pres: '사요|삽니다|사', past: '샀어요|샀습니다|샀어', because: '사서', modPast: '산' }],
  ['자다', '', { pres: '자요|잡니다|자', past: '잤어요|잤습니다|잤어', fut: '잘 거예요|잘 겁니다|잘 거야', because: '자서', modPast: '잔' }],
  ['만나다', '', { pres: '만나요|만납니다|만나', past: '만났어요|만났습니다|만났어', fut: '만날 거예요|만날 겁니다|만날 거야',
    request: '만나 주세요|만나 주십시오|만나 줘', because: '만나서', if: '만나면', modPast: '만난' }],
  ['타다', '', { pres: '타요|탑니다|타', past: '탔어요|탔습니다|탔어', imperative: '타세요|타십시오|타', modPast: '탄' }],
  // ㅓ
  ['서다', '', { pres: '서요|섭니다|서', past: '섰어요|섰습니다|섰어', fut: '설 거예요|설 겁니다|설 거야',
    suggest: '서요|섭시다|서자', because: '서서', modPast: '선' }],
  ['건너다', '', { pres: '건너요|건넙니다|건너', past: '건넜어요|건넜습니다|건넜어', because: '건너서', modPast: '건넌' }],
  // ㅐ, ㅔ, ㅕ
  ['보내다', '', { pres: '보내요|보냅니다|보내', past: '보냈어요|보냈습니다|보냈어', fut: '보낼 거예요|보낼 겁니다|보낼 거야',
    because: '보내서', modPast: '보낸' }],
  ['지내다', '', { pres: '지내요|지냅니다|지내', past: '지냈어요|지냈습니다|지냈어', because: '지내서' }],
  ['세다', '', { pres: '세요|셉니다|세', past: '셌어요|셌습니다|셌어', because: '세서', modPast: '센' }],
  ['켜다', '', { pres: '켜요|켭니다|켜', past: '켰어요|켰습니다|켰어', imperative: '켜세요|켜십시오|켜', because: '켜서', modPast: '켠' }],
  // ㅗ: 오다 -> 와요, 쏘다 -> 쏴요
  ['오다', '', { pres: '와요|옵니다|와', past: '왔어요|왔습니다|왔어', fut: '올 거예요|올 겁니다|올 거야',
    request: '와 주세요|와 주십시오|와 줘', suggest: '와요|옵시다|오자', imperative: '오세요|오십시오|와',
    because: '와서', modPres: '오는', modPast: '온' }],
  ['쏘다', '', { pres: '쏴요|쏩니다|쏴', past: '쐈어요|쐈습니다|쐈어', because: '쏴서', modPast: '쏜' }],
  // ㅜ: 주다 -> 줘요
  ['주다', '', { pres: '줘요|줍니다|줘', past: '줬어요|줬습니다|줬어', fut: '줄 거예요|줄 겁니다|줄 거야',
    imperative: '주세요|주십시오|줘', because: '줘서', modPast: '준' }],
  ['배우다', '', { pres: '배워요|배웁니다|배워', past: '배웠어요|배웠습니다|배웠어', fut: '배울 거예요|배울 겁니다|배울 거야',
    request: '배워 주세요|배워 주십시오|배워 줘', because: '배워서', modPast: '배운' }],
  ['바꾸다', '', { pres: '바꿔요|바꿉니다|바꿔', past: '바꿨어요|바꿨습니다|바꿨어', because: '바꿔서', modPast: '바꾼' }],
  ['두다', '', { pres: '둬요|둡니다|둬', past: '뒀어요|뒀습니다|뒀어', because: '둬서', modPast: '둔' }],
  // ㅣ: 마시+어 -> 마셔
  ['마시다', '', { pres: '마셔요|마십니다|마셔', past: '마셨어요|마셨습니다|마셨어', fut: '마실 거예요|마실 겁니다|마실 거야',
    suggest: '마셔요|마십시다|마시자', imperative: '마시세요|마시십시오|마셔', because: '마셔서', if: '마시면', modPast: '마신' }],
  ['가르치다', '', { pres: '가르쳐요|가르칩니다|가르쳐', past: '가르쳤어요|가르쳤습니다|가르쳤어',
    fut: '가르칠 거예요|가르칠 겁니다|가르칠 거야', because: '가르쳐서', modPast: '가르친' }],
  ['기다리다', '', { pres: '기다려요|기다립니다|기다려', past: '기다렸어요|기다렸습니다|기다렸어',
    fut: '기다릴 거예요|기다릴 겁니다|기다릴 거야', request: '기다려 주세요|기다려 주십시오|기다려 줘',
    because: '기다려서', modPast: '기다린' }],
  ['보이다', '', { pres: '보여요|보입니다|보여', past: '보였어요|보였습니다|보였어', because: '보여서', modPast: '보인' }],
  ['시키다', '', { pres: '시켜요|시킵니다|시켜', past: '시켰어요|시켰습니다|시켰어', because: '시켜서', modPast: '시킨' }],
  ['내리다', '', { pres: '내려요|내립니다|내려', past: '내렸어요|내렸습니다|내렸어', fut: '내릴 거예요|내릴 겁니다|내릴 거야', because: '내려서' }],
  ['먹이다', '', { pres: '먹여요|먹입니다|먹여', past: '먹였어요|먹였습니다|먹였어', because: '먹여서', modPast: '먹인' }],
  ['앉히다', '', { pres: '앉혀요|앉힙니다|앉혀', past: '앉혔어요|앉혔습니다|앉혔어', because: '앉혀서' }],
  // ㅡ-verbs of one syllable keep 어 inside a compound: 받아쓰다 -> 받아써요 (not 받아싸요), 본뜨다 -> 본떠요
  ['받아쓰다', '', { pres: '받아써요|받아씁니다|받아써', past: '받아썼어요|받아썼습니다|받아썼어', fut: '받아쓸 거예요|받아쓸 겁니다|받아쓸 거야',
    request: '받아써 주세요|받아써 주십시오|받아써 줘', imperative: '받아쓰세요|받아쓰십시오|받아써', because: '받아써서', modPast: '받아쓴' }],
  ['본뜨다', '', { pres: '본떠요|본뜹니다|본떠', past: '본떴어요|본떴습니다|본떴어', because: '본떠서', if: '본뜨면', modPast: '본뜬' }],
  ['싹트다', '', { pres: '싹터요|싹틉니다|싹터', past: '싹텄어요|싹텄습니다|싹텄어', because: '싹터서' }],
  ['덮어쓰다', '', { pres: '덮어써요|덮어씁니다|덮어써', past: '덮어썼어요|덮어썼습니다|덮어썼어' }],
  ['애쓰다', '', { pres: '애써요|애씁니다|애써', past: '애썼어요|애썼습니다|애썼어' }],
  // single words with ㅡ keep the harmony of the vowel before it
  ['아프다', '', { pres: '아파요|아픕니다|아파', past: '아팠어요|아팠습니다|아팠어' }],
  ['바쁘다', '', { pres: '바빠요|바쁩니다|바빠', past: '바빴어요|바빴습니다|바빴어' }],
  ['따르다', '', { pres: '따라요|따릅니다|따라', past: '따랐어요|따랐습니다|따랐어' }],

  // one-syllable ㅣ-stems contract only after ㅈ ㅉ ㅊ: 비다 -> 비어요 (벼요 would be another word)
  ['비다', '', { pres: '비어요|빕니다|비어', past: '비었어요|비었습니다|비었어', because: '비어서', modPast: '빈' }],
  ['삐다', '', { pres: '삐어요|삡니다|삐어', past: '삐었어요|삐었습니다|삐었어', because: '삐어서' }],
  ['피다', '', { pres: '피어요|핍니다|피어', past: '피었어요|피었습니다|피었어', because: '피어서', modPast: '핀' }],
  ['기다', '', { pres: '기어요|깁니다|기어', past: '기었어요|기었습니다|기었어', because: '기어서' }],
  ['지다', '', { pres: '져요|집니다|져', past: '졌어요|졌습니다|졌어', because: '져서', modPast: '진' }],
  ['치다', '', { pres: '쳐요|칩니다|쳐', past: '쳤어요|쳤습니다|쳤어', because: '쳐서', modPast: '친' }],
  ['찌다', '', { pres: '쪄요|찝니다|쪄', past: '쪘어요|쪘습니다|쪘어', because: '쪄서' }],
  // longer ㅣ-stems still contract
  ['살피다', '', { pres: '살펴요|살핍니다|살펴', past: '살폈어요|살폈습니다|살폈어' }],
  ['비비다', '', { pres: '비벼요|비빕니다|비벼', past: '비볐어요|비볐습니다|비볐어' }],
  ['남기다', '', { pres: '남겨요|남깁니다|남겨', past: '남겼어요|남겼습니다|남겼어' }],

  // ㅚ: 되+어 -> 돼, 뵈+어 -> 봬; 꾀다 keeps 어
  ['꾀다', '', { pres: '꾀어요|꾑니다|꾀어', past: '꾀었어요|꾀었습니다|꾀었어', because: '꾀어서', modPast: '꾄' }],
  ['뵈다', '', { pres: '봬요|뵙니다|봬', past: '뵀어요|뵀습니다|뵀어', because: '봬서' }],
  ['시작되다', '', { pres: '시작돼요|시작됩니다|시작돼', past: '시작됐어요|시작됐습니다|시작됐어', because: '시작돼서', modPast: '시작된' }],
  // ㅚ: 되+어 -> 돼
  ['되다', '', { pres: '돼요|됩니다|돼', past: '됐어요|됐습니다|됐어', fut: '될 거예요|될 겁니다|될 거야',
    request: '돼 주세요|돼 주십시오|돼 줘', imperative: '되세요|되십시오|돼', because: '돼서', if: '되면', modPast: '된' }],
  // ㅟ does not contract
  ['쉬다', '', { pres: '쉬어요|쉽니다|쉬어', past: '쉬었어요|쉬었습니다|쉬었어', fut: '쉴 거예요|쉴 겁니다|쉴 거야', because: '쉬어서', modPast: '쉰' }],
  ['뛰다', '', { pres: '뛰어요|뜁니다|뛰어', past: '뛰었어요|뛰었습니다|뛰었어', because: '뛰어서', modPast: '뛴' }],
  ['사귀다', '', { pres: '사귀어요|사귑니다|사귀어', past: '사귀었어요|사귀었습니다|사귀었어', because: '사귀어서' }],

  // ㅡ-stems
  ['끄다', '', { pres: '꺼요|끕니다|꺼', past: '껐어요|껐습니다|껐어', fut: '끌 거예요|끌 겁니다|끌 거야',
    imperative: '끄세요|끄십시오|꺼', because: '꺼서', modPast: '끈' }],
  ['뜨다', '', { pres: '떠요|뜹니다|떠', past: '떴어요|떴습니다|떴어', because: '떠서' }],
  ['담그다', '', { pres: '담가요|담급니다|담가', past: '담갔어요|담갔습니다|담갔어', fut: '담글 거예요|담글 겁니다|담글 거야',
    because: '담가서', modPast: '담근' }],
  ['잠그다', '', { pres: '잠가요|잠급니다|잠가', past: '잠갔어요|잠갔습니다|잠갔어', because: '잠가서' }],
  ['모으다', '', { pres: '모아요|모읍니다|모아', past: '모았어요|모았습니다|모았어', fut: '모을 거예요|모을 겁니다|모을 거야',
    imperative: '모으세요|모으십시오|모아', because: '모아서', modPast: '모은' }],
  // 르 that is not irregular: ㅡ drops, no doubled ㄹ
  ['따르다', '', { pres: '따라요|따릅니다|따라', past: '따랐어요|따랐습니다|따랐어', because: '따라서', modPast: '따른' }],
  ['치르다', '', { pres: '치러요|치릅니다|치러', past: '치렀어요|치렀습니다|치렀어', because: '치러서', modPast: '치른' }],
  ['들르다', '', { pres: '들러요|들릅니다|들러', past: '들렀어요|들렀습니다|들렀어', because: '들러서' }],
  // 푸다 (퍼요) and 이르다 reaching (이르러요)
  ['푸다', '', { pres: '퍼요|풉니다|퍼', past: '펐어요|펐습니다|펐어', fut: '풀 거예요|풀 겁니다|풀 거야', because: '퍼서', if: '푸면', modPast: '푼' }],
  ['이르다', '', { pres: '이르러요|이릅니다|이르러', past: '이르렀어요|이르렀습니다|이르렀어', because: '이르러서', if: '이르면', modPast: '이른' }],

  // regular consonant stems
  ['읽다', '', { pres: '읽어요|읽습니다|읽어', past: '읽었어요|읽었습니다|읽었어', fut: '읽을 거예요|읽을 겁니다|읽을 거야',
    neg: '읽지 않아요|읽지 않습니다|읽지 않아', suggest: '읽어요|읽읍시다|읽자', imperative: '읽으세요|읽으십시오|읽어',
    if: '읽으면', modPres: '읽는', modPast: '읽은' }],
  ['앉다', '', { pres: '앉아요|앉습니다|앉아', past: '앉았어요|앉았습니다|앉았어', fut: '앉을 거예요|앉을 겁니다|앉을 거야',
    suggest: '앉아요|앉읍시다|앉자', imperative: '앉으세요|앉으십시오|앉아', modPres: '앉는', modPast: '앉은' }],
  ['닫다', '', { pres: '닫아요|닫습니다|닫아', past: '닫았어요|닫았습니다|닫았어', modPres: '닫는', modPast: '닫은' }],
  ['받다', '', { pres: '받아요|받습니다|받아', past: '받았어요|받았습니다|받았어', modPast: '받은' }],
  ['찾다', '', { pres: '찾아요|찾습니다|찾아', past: '찾았어요|찾았습니다|찾았어', modPast: '찾은' }],
  ['웃다', '', { pres: '웃어요|웃습니다|웃어', past: '웃었어요|웃었습니다|웃었어', if: '웃으면', modPres: '웃는', modPast: '웃은' }],
  ['씻다', '', { pres: '씻어요|씻습니다|씻어', past: '씻었어요|씻었습니다|씻었어', because: '씻어서', if: '씻으면' }],
  ['벗다', '', { pres: '벗어요|벗습니다|벗어', past: '벗었어요|벗었습니다|벗었어', modPast: '벗은' }],
  ['입다', '', { pres: '입어요|입습니다|입어', past: '입었어요|입었습니다|입었어', suggest: '입어요|입읍시다|입자', if: '입으면', modPast: '입은' }],
  ['잡다', '', { pres: '잡아요|잡습니다|잡아', past: '잡았어요|잡았습니다|잡았어', if: '잡으면', modPast: '잡은' }],
  ['놓다', '', { pres: '놓아요|놓습니다|놓아', past: '놓았어요|놓았습니다|놓았어', if: '놓으면', but: '놓지만', modPast: '놓은' }],
  ['넣다', '', { pres: '넣어요|넣습니다|넣어', past: '넣었어요|넣었습니다|넣었어', if: '넣으면', modPast: '넣은' }],

  // ㄹ-stems
  ['만들다', '', { pres: '만들어요|만듭니다|만들어', past: '만들었어요|만들었습니다|만들었어', fut: '만들 거예요|만들 겁니다|만들 거야',
    neg: '만들지 않아요|만들지 않습니다|만들지 않아', suggest: '만들어요|만듭시다|만들자', imperative: '만드세요|만드십시오|만들어',
    because: '만들어서', if: '만들면', modPres: '만드는', modPast: '만든' }],
  ['알다', '', { pres: '알아요|압니다|알아', past: '알았어요|알았습니다|알았어', fut: '알 거예요|알 겁니다|알 거야',
    imperative: '아세요|아십시오|알아', if: '알면', modPres: '아는', modPast: '안' }],
  ['놀다', '', { pres: '놀아요|놉니다|놀아', past: '놀았어요|놀았습니다|놀았어', imperative: '노세요|노십시오|놀아', modPres: '노는', modPast: '논' }],
  ['열다', '', { pres: '열어요|엽니다|열어', past: '열었어요|열었습니다|열었어', fut: '열 거예요|열 겁니다|열 거야',
    imperative: '여세요|여십시오|열어', modPres: '여는', modPast: '연' }],
  ['울다', '', { pres: '울어요|웁니다|울어', past: '울었어요|울었습니다|울었어', modPres: '우는', modPast: '운' }],
  ['걸다', '', { pres: '걸어요|겁니다|걸어', past: '걸었어요|걸었습니다|걸었어', modPres: '거는', modPast: '건' }],
  ['팔다', '', { pres: '팔아요|팝니다|팔아', past: '팔았어요|팔았습니다|팔았어', suggest: '팔아요|팝시다|팔자', modPres: '파는', modPast: '판' }],
  ['들다', '', { pres: '들어요|듭니다|들어', past: '들었어요|들었습니다|들었어', modPres: '드는', modPast: '든' }],
  ['불다', '', { pres: '불어요|붑니다|불어', past: '불었어요|불었습니다|불었어', modPres: '부는', modPast: '분' }],
  ['풀다', '', { pres: '풀어요|풉니다|풀어', past: '풀었어요|풀었습니다|풀었어', modPres: '푸는', modPast: '푼' }],
  ['돌다', '', { pres: '돌아요|돕니다|돌아', past: '돌았어요|돌았습니다|돌았어', modPres: '도는', modPast: '돈' }],

  // ㅂ-irregular (워, and 와 only for 돕다/곱다)
  ['눕다', 'b', { pres: '누워요|눕습니다|누워', past: '누웠어요|누웠습니다|누웠어', fut: '누울 거예요|누울 겁니다|누울 거야',
    suggest: '누워요|누웁시다|눕자', imperative: '누우세요|누우십시오|누워', because: '누워서', if: '누우면',
    modPres: '눕는', modPast: '누운' }],
  ['굽다', 'b', { pres: '구워요|굽습니다|구워', past: '구웠어요|구웠습니다|구웠어', fut: '구울 거예요|구울 겁니다|구울 거야',
    because: '구워서', if: '구우면', modPast: '구운' }],
  ['줍다', 'b', { pres: '주워요|줍습니다|주워', past: '주웠어요|주웠습니다|주웠어', if: '주우면', modPast: '주운' }],
  // regular ㅂ for comparison: no tag, no change
  ['입다', '', { if: '입으면' }],

  // ㄷ-irregular
  ['걷다', 'd', { pres: '걸어요|걷습니다|걸어', past: '걸었어요|걸었습니다|걸었어', fut: '걸을 거예요|걸을 겁니다|걸을 거야',
    prog: '걷고 있어요|걷고 있습니다|걷고 있어', suggest: '걸어요|걸읍시다|걷자', imperative: '걸으세요|걸으십시오|걸어',
    because: '걸어서', if: '걸으면', modPres: '걷는', modPast: '걸은' }],
  ['묻다', 'd', { pres: '물어요|묻습니다|물어', past: '물었어요|물었습니다|물었어', because: '물어서', if: '물으면', modPast: '물은' }],
  ['묻다', '', { pres: '묻어요|묻습니다|묻어', past: '묻었어요|묻었습니다|묻었어', if: '묻으면' }],
  ['깨닫다', 'd', { pres: '깨달아요|깨닫습니다|깨달아', past: '깨달았어요|깨달았습니다|깨달았어', because: '깨달아서', if: '깨달으면', modPast: '깨달은' }],
  ['싣다', 'd', { pres: '실어요|싣습니다|실어', past: '실었어요|실었습니다|실었어', if: '실으면', modPast: '실은' }],

  // ㅅ-irregular
  ['낫다', 's', { pres: '나아요|낫습니다|나아', past: '나았어요|나았습니다|나았어', fut: '나을 거예요|나을 겁니다|나을 거야',
    imperative: '나으세요|나으십시오|나아', because: '나아서', if: '나으면', modPast: '나은' }],
  ['붓다', 's', { pres: '부어요|붓습니다|부어', past: '부었어요|부었습니다|부었어', because: '부어서', if: '부으면', modPast: '부은' }],
  ['긋다', 's', { pres: '그어요|긋습니다|그어', past: '그었어요|그었습니다|그었어', if: '그으면', modPast: '그은' }],
  ['잇다', 's', { pres: '이어요|잇습니다|이어', past: '이었어요|이었습니다|이었어', if: '이으면', modPast: '이은' }],
  ['젓다', 's', { pres: '저어요|젓습니다|저어', past: '저었어요|저었습니다|저었어', if: '저으면', modPast: '저은' }],

  // 르-irregular
  ['오르다', 'reu', { pres: '올라요|오릅니다|올라', past: '올랐어요|올랐습니다|올랐어', fut: '오를 거예요|오를 겁니다|오를 거야',
    because: '올라서', if: '오르면', modPast: '오른' }],
  ['부르다', 'reu', { pres: '불러요|부릅니다|불러', past: '불렀어요|불렀습니다|불렀어', fut: '부를 거예요|부를 겁니다|부를 거야',
    request: '불러 주세요|불러 주십시오|불러 줘', because: '불러서', modPast: '부른' }],
  ['고르다', 'reu', { pres: '골라요|고릅니다|골라', past: '골랐어요|골랐습니다|골랐어', because: '골라서', modPast: '고른' }],
  ['자르다', 'reu', { pres: '잘라요|자릅니다|잘라', past: '잘랐어요|잘랐습니다|잘랐어', because: '잘라서', modPast: '자른' }],
  ['누르다', 'reu', { pres: '눌러요|누릅니다|눌러', past: '눌렀어요|눌렀습니다|눌렀어', because: '눌러서', modPast: '누른' }],
  ['서두르다', 'reu', { pres: '서둘러요|서두릅니다|서둘러', past: '서둘렀어요|서둘렀습니다|서둘렀어', because: '서둘러서', modPast: '서두른' }],
  ['흐르다', 'reu', { pres: '흘러요|흐릅니다|흘러', past: '흘렀어요|흘렀습니다|흘렀어', because: '흘러서', modPast: '흐른' }],
  ['기르다', 'reu', { pres: '길러요|기릅니다|길러', past: '길렀어요|길렀습니다|길렀어', because: '길러서', modPast: '기른' }],
  ['나르다', 'reu', { pres: '날라요|나릅니다|날라', past: '날랐어요|날랐습니다|날랐어', because: '날라서' }],
  ['마르다', 'reu', { pres: '말라요|마릅니다|말라', past: '말랐어요|말랐습니다|말랐어', because: '말라서', modPast: '마른' }],
  ['이르다', 'reu', { pres: '일러요|이릅니다|일러', past: '일렀어요|일렀습니다|일렀어', because: '일러서', modPast: '이른' }],

  // 없다 and other 있다/없다 compounds describe a state
  ['없다', '', { pres: '없어요|없습니다|없어', past: '없었어요|없었습니다|없었어', fut: '없을 거예요|없을 겁니다|없을 거야',
    neg: '없지 않아요|없지 않습니다|없지 않아', prog: null, want: null, request: null, suggest: null, imperative: null,
    can: '없을 수 있어요|없을 수 있습니다|없을 수 있어', because: '없어서', if: '없으면', modPres: '없는', modPast: '없었던' }],
  ['재미있다', '', { pres: '재미있어요|재미있습니다|재미있어', past: '재미있었어요|재미있었습니다|재미있었어',
    prog: null, imperative: null, modPres: '재미있는', modPast: '재미있었던' }],

  // 이다 and 아니다 (copulas)
  ['이다', '', { pres: '이에요|입니다|이야', past: '이었어요|이었습니다|이었어', fut: '일 거예요|일 겁니다|일 거야',
    neg: '아니에요|아닙니다|아니야', pastNeg: '아니었어요|아니었습니다|아니었어', prog: null, want: null, can: null,
    request: null, suggest: null, imperative: null,
    and: '이고', because: '이어서', if: '이면', but: '이지만', modPres: '인', modPast: '이었던' }],
  ['아니다', '', { pres: '아니에요|아닙니다|아니야', past: '아니었어요|아니었습니다|아니었어', fut: '아닐 거예요|아닐 겁니다|아닐 거야',
    neg: null, prog: null, imperative: null,
    and: '아니고', because: '아니어서', if: '아니면', but: '아니지만', modPres: '아닌', modPast: '아니었던' }],

  // honorific verbs take -세요 in the polite style
  ['계시다', '', { pres: '계세요|계십니다|계셔', past: '계셨어요|계셨습니다|계셨어', fut: '계실 거예요|계실 겁니다|계실 거야',
    imperative: '계세요|계십시오|계셔', because: '계셔서', if: '계시면', modPres: '계시는', modPast: '계신' }],
  ['드시다', '', { pres: '드세요|드십니다|드셔', past: '드셨어요|드셨습니다|드셨어', imperative: '드세요|드십시오|드셔' }],
  ['주무시다', '', { pres: '주무세요|주무십니다|주무셔', past: '주무셨어요|주무셨습니다|주무셨어' }],
];

for (const [ko, tag, rows] of COMPLETE) { paradigmVerbs += 1; checkParadigm(ko, tag, rows); }
const completeCount = COMPLETE.length;
for (const [ko, tag, rows] of PARTIAL) { paradigmVerbs += 1; checkParadigm(ko, tag, rows); }

// ---- The table shape ----------------------------------------------------------------

const eq = (label, actual, expected) => {
  report.checks += 1;
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) failures.push(`${label}\n    expected: ${e}\n    actual:   ${a}`);
};

eq('ROW_KEYS', ROW_KEYS, FULL_KEYS);
eq('express() keys', Object.keys(express({ ko: '말하다', tag: '' })), ['ko', 'rom', 'rows']);
eq('rows keys follow ROW_KEYS', Object.keys(express({ ko: '말하다', tag: '' }).rows), FULL_KEYS);
eq('express() ko and rom', [express({ ko: '먹다' }).ko, express({ ko: '먹다' }).rom], ['먹다', 'meokda']);
eq('a missing tag means a regular verb', express({ ko: '먹다' }).rows.pres[0].ko, express({ ko: '먹다', tag: '' }).rows.pres[0].ko);
eq('a cell has ko and rom', Object.keys(express({ ko: '가다', tag: '' }).rows.pres[0]), ['ko', 'rom']);

// The last six rows do not depend on the speech level: one cell, three times.
for (const key of ['and', 'because', 'if', 'but', 'modPres', 'modPast']) {
  const row = express({ ko: '먹다', tag: '' }).rows[key];
  eq(`${key} repeats the same cell at every level`, row.map(c => c.ko).filter((k, i, all) => k === all[0]).length, 3);
}

// express refuses what is not a Hangul dictionary form
for (const bad of ['먹', 'eat', '', '먹다 ', '먹ㅓ다', undefined, 42]) {
  report.checks += 1;
  try { express({ ko: bad, tag: '' }); failures.push(`express accepted ${JSON.stringify(bad)}`); } catch (error) {
    if (!/Korean\.express/.test(error.message)) failures.push(`express threw an odd error for ${JSON.stringify(bad)}: ${error.message}`);
  }
}

// ---- Romanization of whole tables -------------------------------------------------------

// Revised Romanization of the full 말하다 and 먹다 tables, written out by hand (cells of 'a|b|c').
const ROMAN_TABLES = [
  ['말하다', '', full(
    'malhaeyo|malhamnida|malhae', 'malhaesseoyo|malhaetseumnida|malhaesseo', 'malhal geoyeyo|malhal geomnida|malhal geoya',
    'malhaji anayo|malhaji anseumnida|malhaji ana', 'malhaji anasseoyo|malhaji anatseumnida|malhaji anasseo',
    'malhago isseoyo|malhago itseumnida|malhago isseo', 'malhago sipeoyo|malhago sipseumnida|malhago sipeo',
    'malhal su isseoyo|malhal su itseumnida|malhal su isseo', 'malhae juseyo|malhae jusipsio|malhae jwo',
    'malhaeyo|malhapsida|malhaja', 'malhaseyo|malhasipsio|malhae',
    'malhago', 'malhaeseo', 'malhamyeon', 'malhajiman', 'malhaneun', 'malhan')],
  ['먹다', '', full(
    'meogeoyo|meokseumnida|meogeo', 'meogeosseoyo|meogeotseumnida|meogeosseo', 'meogeul geoyeyo|meogeul geomnida|meogeul geoya',
    'meokji anayo|meokji anseumnida|meokji ana', 'meokji anasseoyo|meokji anatseumnida|meokji anasseo',
    'meokgo isseoyo|meokgo itseumnida|meokgo isseo', 'meokgo sipeoyo|meokgo sipseumnida|meokgo sipeo',
    'meogeul su isseoyo|meogeul su itseumnida|meogeul su isseo', 'meogeo juseyo|meogeo jusipsio|meogeo jwo',
    'meogeoyo|meogeupsida|meokja', 'meogeuseyo|meogeusipsio|meogeo',
    'meokgo', 'meogeoseo', 'meogeumyeon', 'meokjiman', 'meongneun', 'meogeun')],
  ['돕다', 'b', { pres: 'dowayo|dopseumnida|dowa', fut: 'doul geoyeyo|doul geomnida|doul geoya', suggest: 'dowayo|doupsida|dopja',
    imperative: 'douseyo|dousipsio|dowa', modPres: 'domneun', modPast: 'doun' }],
  ['듣다', 'd', { pres: 'deureoyo|deutseumnida|deureo', modPres: 'deunneun', modPast: 'deureun' }],
  ['모르다', 'reu', { pres: 'mollayo|moreumnida|molla', past: 'mollasseoyo|mollatseumnida|mollasseo' }],
  ['살다', '', { pres: 'sarayo|samnida|sara', imperative: 'saseyo|sasipsio|sara', modPres: 'saneun' }],
  // "nul" + "leo" spells the letters n-u-l-l: a romanization containing "null" is correct here
  ['누르다', 'reu', { pres: 'nulleoyo|nureumnida|nulleo', past: 'nulleosseoyo|nulleotseumnida|nulleosseo', because: 'nulleoseo' }],
];
let romanTableChecks = 0;
for (const [ko, tag, rows] of ROMAN_TABLES) {
  const before = report.checks;
  checkParadigm(ko, tag, rows, 'rom');
  romanTableChecks += report.checks - before;
}

// ---- romanize() ------------------------------------------------------------------------------

// Revised Romanization (RR) of the pronunciation. Every pair is a form whose
// romanization is standard.
const ROMANIZATION = [
  // liaison: a final consonant moves onto a following vowel
  ['먹어요', 'meogeoyo'], ['읽어요', 'ilgeoyo'], ['있어요', 'isseoyo'], ['없어요', 'eopseoyo'],
  ['앉아요', 'anjayo'], ['닭이', 'dalgi'], ['값이', 'gapsi'], ['꽃이', 'kkochi'], ['밖에', 'bakke'],
  ['부엌에', 'bueoke'], ['앞에', 'ape'], ['낮에', 'naje'], ['웃어요', 'useoyo'], ['한국어', 'hangugeo'],
  ['강아지', 'gangaji'], ['사랑', 'sarang'], ['하루', 'haru'], ['삶아요', 'salmayo'], ['젊어요', 'jeolmeoyo'], ['밟아요', 'balbayo'],
  ['읊어요', 'eulpeoyo'], ['핥아요', 'haltayo'], ['끓어요', 'kkeureoyo'], ['끊어요', 'kkeuneoyo'],
  // ㅎ: silent before a vowel, aspirates a neighbour
  ['좋아요', 'joayo'], ['많아요', 'manayo'], ['괜찮아요', 'gwaenchanayo'], ['싫어요', 'sireoyo'], ['낳아요', 'naayo'],
  ['좋다', 'jota'], ['놓고', 'noko'], ['좋고', 'joko'], ['좋지', 'jochi'], ['많다', 'manta'], ['않다', 'anta'],
  ['싫다', 'silta'], ['앓다', 'alta'], ['낳지', 'nachi'], ['놓다', 'nota'], ['잡혀', 'japyeo'], ['막히다', 'makida'],
  ['끊고', 'kkeunko'], ['끓다', 'kkeulta'], ['못해요', 'motaeyo'],
  ['밝히다', 'balkida'], ['읽히다', 'ilkida'], ['좋습니다', 'joseumnida'], ['놓습니다', 'noseumnida'],
  ['괜찮습니다', 'gwaenchanseumnida'], ['많은', 'maneun'], ['좋은', 'joeun'],
  // palatalization
  ['같이', 'gachi'], ['굳이', 'guji'], ['해돋이', 'haedoji'], ['밭이', 'bachi'], ['닫히다', 'dachida'], ['묻히다', 'muchida'],
  // final consonants at the end of a word or before a consonant
  ['읽다', 'ikda'], ['맑다', 'makda'], ['넓다', 'neolda'], ['젊다', 'jeomda'], ['앉다', 'anda'], ['같다', 'gatda'],
  ['읽고', 'ilgo'], ['닭', 'dak'], ['삶', 'sam'], ['값', 'gap'], ['부엌', 'bueok'], ['옷', 'ot'], ['책', 'chaek'],
  ['집', 'jip'], ['밥', 'bap'], ['꿈', 'kkum'], ['국', 'guk'], ['학교', 'hakgyo'], ['학생', 'haksaeng'], ['서울', 'seoul'],
  // nasalisation and lateralisation
  ['합니다', 'hamnida'], ['입니다', 'imnida'], ['감사합니다', 'gamsahamnida'], ['먹는', 'meongneun'], ['읽는', 'ingneun'],
  ['앉는', 'anneun'], ['국물', 'gungmul'], ['독립', 'dongnip'], ['신라', 'silla'], ['설날', 'seollal'], ['종로', 'jongno'],
  ['몰라요', 'mollayo'], ['빨리', 'ppalli'], ['물론', 'mullon'], ['백마', 'baengma'], ['왕십리', 'wangsimni'], ['별내', 'byeollae'],
  ['앓는', 'alleun'], ['싫네', 'sille'], ['있는', 'inneun'], ['없는', 'eomneun'], ['연락', 'yeollak'],
  // examples of the official RR table
  ['벚꽃', 'beotkkot'], ['한밭', 'hanbat'], ['독도', 'dokdo'], ['없었습니다', 'eopseotseumnida'],
  // the endings used in the tables
  ['갔습니다', 'gatseumnida'], ['했어요', 'haesseoyo'], ['있습니다', 'itseumnida'], ['없습니다', 'eopseumnida'],
  ['먹습니다', 'meokseumnida'], ['읽습니다', 'ikseumnida'], ['앉습니다', 'anseumnida'], ['돕습니다', 'dopseumnida'],
  ['듣습니다', 'deutseumnida'], ['모릅니다', 'moreumnida'], ['합시다', 'hapsida'], ['십시오', 'sipsio'], ['주세요', 'juseyo'],
  ['왔어요', 'wasseoyo'], ['돼요', 'dwaeyo'], ['가요', 'gayo'], ['예요', 'yeyo'],
  // vowels and initials
  ['안녕하세요', 'annyeonghaseyo'], ['한글', 'hangeul'], ['김치', 'gimchi'], ['대한민국', 'daehanminguk'], ['의사', 'uisa'],
  ['뭐', 'mwo'], ['라면', 'ramyeon'], ['따라서', 'ttaraseo'], ['가르쳐요', 'gareuchyeoyo'], ['마셔요', 'masyeoyo'],
  // ㅎ after the double finals ㄳ and ㅄ: only the first consonant is said
  ['값하다', 'gapada'], ['값이', 'gapsi'], ['값을', 'gapseul'], ['넋하다', 'neokada'],
  // two compounds say an extra ㄴ at the join
  ['짓이기다', 'jinnigida'], ['짓이겨요', 'jinnigyeoyo'], ['업신여기다', 'eopsinnyeogida'], ['업신여겨요', 'eopsinnyeogyeoyo'],
  ['귀\ub770하다', 'gwittimhada'], ['띄우다', 'ttuiuda'], ['누르다', 'nureuda'], ['눌러요', 'nulleoyo'],
  // spaces and other characters are kept
  ['한국 사람', 'hanguk saram'], ['말해 주세요', 'malhae juseyo'], ['할 수 있어요', 'hal su isseoyo'], ['', ''],
];
for (const [hangul, expected] of ROMANIZATION) eq(`romanize(${hangul})`, romanize(hangul), expected);
eq('romanize keeps Latin letters and punctuation', romanize('a, 먹어요! (1)'), 'a, meogeoyo! (1)');

// ---- Robustness over every Hangul syllable -------------------------------------------------------

// Hangul arithmetic round trip: syllable = 0xAC00 + (initial * 21 + medial) * 28 + final
let syllableCount = 0;
for (let code = 0xAC00; code <= 0xD7A3; code += 1) {
  syllableCount += 1;
  const n = code - 0xAC00;
  const l = Math.floor(n / 588);
  const v = Math.floor((n % 588) / 28);
  const t = n % 28;
  if (0xAC00 + (l * 21 + v) * 28 + t !== code) failures.push(`Hangul arithmetic broke at U+${code.toString(16)}`);
}
eq('there are 11172 Hangul syllables', syllableCount, 11172);

// Every syllable on its own, and every syllable as the last syllable of a verb stem (with
// each tag, which an inconsistent tag must survive), must give clean output.
const cleanRom = /^[a-z]+( [a-z]+)*$/;
const jongOf = syllable => (syllable.charCodeAt(0) - 0xAC00) % 28;
let fuzzProblems = 0;
const fuzz = message => { fuzzProblems += 1; if (fuzzProblems <= 20) failures.push(`fuzz: ${message}`); };
let fuzzChecks = 0;
for (let code = 0xAC00; code <= 0xD7A3; code += 1) {
  const syllable = String.fromCharCode(code);
  fuzzChecks += 1;
  if (!/^[a-z]+$/.test(romanize(syllable))) fuzz(`romanize(${syllable}) = "${romanize(syllable)}"`);
  const kos = code % 11 === 0 ? [`${syllable}다`, `하${syllable}다`, `${syllable}르다`] : [`${syllable}다`];
  const tags = code % 5 === 0 ? ['', 'b', 'd', 's', 'reu'] : [''];
  for (const ko of kos) {
    for (const tag of tags) {
      fuzzChecks += 1;
      let result;
      try { result = express({ ko, tag }); } catch (error) { fuzz(`express(${ko}, ${tag}) threw ${error.message}`); continue; }
      for (const key of ROW_KEYS) {
        const row = result.rows[key];
        if (!Array.isArray(row) || row.length !== 3) { fuzz(`${ko} [${tag}] ${key}: bad row`); continue; }
        row.forEach(c => {
          if (c === null) return; // a level that does not use the form
          if (!c || !/^[가-힣]+( [가-힣]+)*$/.test(c.ko) || !cleanRom.test(c.rom)) fuzz(`${ko} [${tag}] ${key}: bad cell ${JSON.stringify(c)}`);
        });
      }
    }
  }
}
if (fuzzProblems > 20) failures.push(`fuzz: ... and ${fuzzProblems - 20} more`);
report.checks += fuzzChecks;

// ---- Validating the verb database ------------------------------------------------------------------

const TAGS = ['', 'b', 'd', 's', 'reu'];
// The same dictionary form is legitimately irregular in one sense and regular in another.
const TWO_TAGS = new Set(['묻다', '걷다', '이르다', '붓다', '일컫다']);

// Returns a description of what is wrong with the tag, or '' when it fits the stem.
function tagProblem(ko, tag) {
  if (!TAGS.includes(tag)) return `unknown tag "${tag}"`;
  const stem = ko.slice(0, -1);
  const last = stem[stem.length - 1];
  const jong = jongOf(last);
  if (tag && ko.endsWith('하다')) return `a 하다 verb takes no tag (found "${tag}")`;
  if (tag === 'b' && jong !== 17) return 'tag b needs a stem ending in ㅂ';
  if (tag === 'd' && jong !== 7) return 'tag d needs a stem ending in ㄷ';
  if (tag === 's' && jong !== 19) return 'tag s needs a stem ending in ㅅ';
  if (tag === 'reu') {
    if (last !== '르' || stem.length < 2) return 'tag reu needs a stem ending in 르 after another syllable';
    if (jongOf(stem[stem.length - 2]) !== 0) return 'tag reu needs an open syllable before 르';
  }
  return '';
}

// Syllables with the vowel ㅢ are rare, and swapping ㅣ and ㅢ is an easy slip. The standard spelling of
// 귀띔 (tip, hint) has ㅢ (U+B754); the ㅣ spelling 귀띰 is a common misspelling. The only ㅢ syllables in
// use are listed here, so any other one is reported.
const EUI_SYLLABLES = new Set(['\uc758', '\ud76c', '\ub744', '\ub754']); // 의 희 띄 띔
const euiProblem = ko => [...ko].filter(ch => ch >= '\uac00' && ch <= '\ud7a3' && Math.floor(((ch.charCodeAt(0) - 0xAC00) % 588) / 28) === 19
  && !EUI_SYLLABLES.has(ch)).join('');
eq('euiProblem finds an unlisted ㅢ syllable (늬)', euiProblem('\ub2ac하다'), '\ub2ac');
eq('euiProblem accepts 귀띔 (ㄸ+ㅢ+ㅁ), 의, 희, 띄', euiProblem('귀\ub754하다의희띄우다'), '');
eq('hint -> 귀띔하다 is spelled with ㅢ (U+B754)', (VERBS.hint || []).some(entry => entry.ko === '귀\ub754하다'), true);
eq('hint -> not the 귀띰 misspelling', (VERBS.hint || []).some(entry => entry.ko === '귀\ub770하다'), false);

// Audit A, frozen: every untagged verb whose stem ends in ㄷ ㅂ ㅅ or 르 was read one by one and is
// regular (받다 닫다 입다 잡다 웃다 씻다 벗다 따르다 ...). The look-alikes that ARE irregular
// (듣다 걷다 돕다 굽다 짓다 낫다 부르다 ...) carry a tag. A new untagged verb of this shape fails here
// until someone has decided which kind it is; a tag on a reviewed-regular verb fails too.
const REVIEWED_REGULAR = new Set([
  // ㄷ
  '굳다', '내려받다', '닫다', '들이받다', '뜯다', '묻다', '물려받다', '믿다', '받다', '본받다', '뻗다', '상속받다', '쏟다',
  '얻다', '이어받다', '주고받다', '헐뜯다',
  // ㅂ
  '곱씹다', '꼬집다', '뒤집다', '맞잡다', '바로잡다', '부여잡다', '붙잡다', '비집다', '뽑다', '뿌리뽑다', '사로잡다', '씹다',
  '어림잡다', '움켜잡다', '입다', '잡다', '접다', '집다', '차려입다',
  // ㅅ
  '벗다', '비웃다', '빗다', '빼앗다', '씻다', '웃다', '치솟다',
  // 르 (ㅡ drops, the ㄹ is not doubled)
  '뒤따르다', '들르다', '따르다', '치르다',
]);
// Descriptive verbs (adjectives) would get the wrong present modifier (우세하는 instead of 우세한).
const ADJECTIVES = ['우세하다', '유사하다', '동일하다', '충분하다', '필요하다', '중요하다', '풍부하다', '복잡하다', '다양하다'];

let translations = 0;
const seenTags = {};
for (const [english, options] of Object.entries(VERBS)) {
  const seenInLine = new Set();
  options.forEach(({ ko, tag }) => {
    translations += 1;
    const label = `${english} -> ${ko}${tag ? ` [${tag}]` : ''}`;
    if (typeof ko !== 'string' || !/^[가-힣]+다$/.test(ko) || ko.length < 2) { failures.push(`${label}: not Hangul ending in 다`); return; }
    const problem = tagProblem(ko, tag || '');
    if (problem) failures.push(`${label}: ${problem}`);
    if (euiProblem(ko)) failures.push(`${label}: unexpected syllable with ㅢ "${euiProblem(ko)}" (typo for ㅣ?)`);
    if (ADJECTIVES.includes(ko)) failures.push(`${label}: a descriptive verb (adjective); the table would give the wrong present modifier`);
    if (!ko.endsWith('하다')) {
      const stemEnd = ko.slice(-2, -1);
      const riskyShape = [7, 17, 19].includes(jongOf(stemEnd)) || (stemEnd === '르' && ko.length > 2);
      if (riskyShape && !tag && !REVIEWED_REGULAR.has(ko)) failures.push(`${label}: untagged stem in ㄷ/ㅂ/ㅅ/르 that nobody reviewed (regular, or does it need a tag?)`);
      if (tag && REVIEWED_REGULAR.has(ko) && !TWO_TAGS.has(ko)) failures.push(`${label}: reviewed as regular but tagged "${tag}"`);
    }
    if (seenInLine.has(ko)) failures.push(`${label}: listed twice in one line`);
    seenInLine.add(ko);
    if (Object.hasOwn(seenTags, ko) && seenTags[ko] !== (tag || '') && !TWO_TAGS.has(ko)) {
      failures.push(`${label}: also tagged "${seenTags[ko]}" elsewhere`);
    }
    seenTags[ko] = tag || '';

    let result;
    try { result = express({ ko, tag }); } catch (error) { failures.push(`${label}: express() threw ${error.message}`); return; }
    if (result.ko !== ko) failures.push(`${label}: express() returned ko "${result.ko}"`);
    if (!/^[a-z]+( [a-z]+)*$/.test(result.rom)) failures.push(`${label}: odd romanization "${result.rom}"`);
    if (result.rom !== romanize(ko)) failures.push(`${label}: rom differs from romanize(ko)`);
    for (const key of ROW_KEYS) {
      const row = result.rows[key];
      if (!Array.isArray(row) || row.length !== 3) { failures.push(`${label}: malformed row ${key}`); continue; }
      row.forEach((cell, level) => {
        if (cell === null) return;
        if (!cell || typeof cell.ko !== 'string' || typeof cell.rom !== 'string' || !cell.ko || !cell.rom
            || /\b(undefined|NaN|null)\b/.test(cell.ko + ' ' + cell.rom)) { // whole words: 눌러 is "nulleo", which is fine
          failures.push(`${label}: broken cell in ${key}[${level}]`);
        } else if (!/^[가-힣]+( [가-힣]+)*$/.test(cell.ko)) {
          failures.push(`${label}: ${key}[${level}] "${cell.ko}" is not plain Hangul`);
        } else if (!/^[a-z]+( [a-z]+)*$/.test(cell.rom)) {
          failures.push(`${label}: ${key}[${level}] romanization "${cell.rom}" has other characters`);
        }
      });
    }
    if (!result.rows.pres.every(Boolean)) failures.push(`${label}: no present-tense form`);
  });
}

// ---- Audit (node test.js --audit): untagged stems that could hide an irregularity -------------------

if (process.argv.includes('--audit')) {
  const risky = { 'ㄷ': [], 'ㅂ': [], 'ㅅ': [], '르': [] };
  for (const options of Object.values(VERBS)) {
    for (const { ko, tag } of options) {
      if (tag || ko.endsWith('하다')) continue;
      const stem = ko.slice(0, -1);
      const last = stem[stem.length - 1];
      const jong = jongOf(last);
      if (jong === 7) risky['ㄷ'].push(ko);
      else if (jong === 17) risky['ㅂ'].push(ko);
      else if (jong === 19) risky['ㅅ'].push(ko);
      else if (last === '르' && stem.length > 1) risky['르'].push(ko);
    }
  }
  for (const [name, list] of Object.entries(risky)) {
    console.log(`untagged stems ending in ${name} (${[...new Set(list)].length}): ${[...new Set(list)].join(' ')}`);
  }
}

console.log(`${paradigmChecks} paradigm cell checks over ${paradigmVerbs} verb entries (${completeCount} with all 17 rows), ${romanTableChecks} table romanization checks, ${ROMANIZATION.length} romanization tests`);
report.finish(
  `${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Korean translations`,
  { limit: process.argv.includes('--all') ? Infinity : 80 },
);
