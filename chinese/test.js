// Run with: node test.js
// Checks the pattern engine against known sentences, then validates every verb in
// verbs.js: characters match pinyin syllables, tone marks are well placed, and
// nothing is written in simplified characters.
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

// Each expected value is 'characters|pinyin' for the first person (wǒ),
// or an array of six for all persons.
const EXPECTED = [
  {
    verb: { zh: '說', py: 'shuō' },
    rows: {
      pres: '我說|wǒ shuō',
      prog: '我正在說|wǒ zhèngzài shuō',
      completed: '我說了|wǒ shuōle',
      exper: '我說過|wǒ shuōguo',
      perfect: '我已經說了|wǒ yǐjīng shuōle',
      recent: '我剛才說了|wǒ gāngcái shuōle',
      pastprog: '我當時正在說|wǒ dāngshí zhèngzài shuō',
      pluperf: '我之前已經說過了|wǒ zhīqián yǐjīng shuōguo le',
      fut: '我會說|wǒ huì shuō',
      nearfut: '我快要說了|wǒ kuàiyào shuōle',
      futperf: '到時候我已經說了|dào shíhòu wǒ yǐjīng shuōle',
      cond: '如果……，我就會說|rúguǒ…, wǒ jiù huì shuō',
      condperf: '如果當時……，我就會說了|rúguǒ dāngshí…, wǒ jiù huì shuōle',
      hyp: '如果我說的話|rúguǒ wǒ shuō dehuà',
      hypperf: '要是我當時說了|yàoshi wǒ dāngshí shuōle',
      wish: '希望我說|xīwàng wǒ shuō',
      impAff: ['讓我說|ràng wǒ shuō', '你說！|nǐ shuō!', '讓他說|ràng tā shuō',
        '我們說吧|wǒmen shuō ba', '你們說！|nǐmen shuō!', '讓他們說|ràng tāmen shuō'],
      impNeg: ['別讓我說|bié ràng wǒ shuō', '你別說！|nǐ bié shuō!', '別讓他說|bié ràng tā shuō',
        '我們別說吧|wǒmen bié shuō ba', '你們別說！|nǐmen bié shuō!', '別讓他們說|bié ràng tāmen shuō'],
      negPres: '我不說|wǒ bù shuō',
      negPast: '我沒說|wǒ méi shuō',
      negExper: '我沒說過|wǒ méi shuōguo',
      can: '我能說|wǒ néng shuō',
      should: '我應該說|wǒ yīnggāi shuō',
      want: '我想說|wǒ xiǎng shuō',
      qMa: '我說嗎？|wǒ shuō ma?',
      qAnotA: '我說不說？|wǒ shuō bu shuō?',
    },
  },
  {
    // the pronoun changes, the verb never does
    verb: { zh: '說', py: 'shuō' },
    rows: {
      pres: ['我說|wǒ shuō', '你說|nǐ shuō', '他說|tā shuō', '我們說|wǒmen shuō', '你們說|nǐmen shuō', '他們說|tāmen shuō'],
      completed: ['我說了|wǒ shuōle', '你說了|nǐ shuōle', '他說了|tā shuōle', '我們說了|wǒmen shuōle', '你們說了|nǐmen shuōle', '他們說了|tāmen shuōle'],
    },
  },
  {
    // 不 is read bú before a fourth-tone syllable
    verb: { zh: '看', py: 'kàn' },
    rows: { negPres: '我不看|wǒ bú kàn', qAnotA: '我看不看？|wǒ kàn bu kàn?', completed: '我看了|wǒ kànle' },
  },
  {
    // verb-object compounds take particles inside: 睡過覺, 睡不睡覺
    verb: { zh: '睡|覺', py: 'shuì jiào' },
    rows: {
      pres: '我睡覺|wǒ shuìjiào',
      completed: '我睡覺了|wǒ shuìjiào le',
      exper: '我睡過覺|wǒ shuìguo jiào',
      pluperf: '我之前已經睡過覺了|wǒ zhīqián yǐjīng shuìguo jiào le',
      nearfut: '我快要睡覺了|wǒ kuàiyào shuìjiào le',
      negPres: '我不睡覺|wǒ bú shuìjiào',
      negExper: '我沒睡過覺|wǒ méi shuìguo jiào',
      qAnotA: '我睡不睡覺？|wǒ shuì bu shuì jiào?',
    },
  },
  {
    // state verbs are not progressive, "just now", "about to" or commanded
    verb: { zh: '喜歡', py: 'xǐ huān', tag: 's' },
    rows: {
      pres: '我喜歡|wǒ xǐhuān',
      prog: null, recent: null, pastprog: null, nearfut: null, negPast: null, impAff: null, impNeg: null,
      completed: '我喜歡了|wǒ xǐhuānle',
      exper: '我喜歡過|wǒ xǐhuānguo',
      hypperf: '要是我當時喜歡|yàoshi wǒ dāngshí xǐhuān',
      negPres: '我不喜歡|wǒ bù xǐhuān',
      qAnotA: '我喜歡不喜歡？|wǒ xǐhuān bu xǐhuān?',
    },
  },
  {
    // instant verbs cannot be "in progress"
    verb: { zh: '到達', py: 'dào dá', tag: 'a' },
    rows: {
      prog: null, pastprog: null,
      completed: '我到達了|wǒ dàodále',
      negPres: '我不到達|wǒ bú dàodá',
      hypperf: '要是我當時到達了|yàoshi wǒ dāngshí dàodále',
    },
  },
  {
    verb: { zh: '能', py: 'néng', tag: 'm' },
    rows: {
      pres: '我能|wǒ néng',
      negPres: '我不能|wǒ bù néng',
      negPast: '我沒能|wǒ méi néng',
      hyp: '如果我能的話|rúguǒ wǒ néng dehuà',
      qAnotA: '我能不能？|wǒ néng bu néng?',
      completed: null, fut: null, can: null, impAff: null,
    },
  },
  {
    verb: { zh: '是', py: 'shì' },
    rows: {
      pres: '我是|wǒ shì',
      exper: '我曾經是|wǒ céngjīng shì',
      negPres: '我不是|wǒ bú shì',
      qAnotA: '我是不是？|wǒ shì bu shì?',
      hypperf: '要是我當時是|yàoshi wǒ dāngshí shì',
      completed: null, prog: null, negPast: null,
    },
  },
  {
    verb: { zh: '有', py: 'yǒu' },
    rows: {
      pres: '我有|wǒ yǒu',
      completed: '我有了|wǒ yǒule',
      exper: '我有過|wǒ yǒuguo',
      negPres: '我沒有|wǒ méiyǒu',
      negPast: '我沒有|wǒ méiyǒu',
      negExper: '我沒有過|wǒ méiyǒuguo',
      qAnotA: '我有沒有？|wǒ yǒu méiyǒu?',
      condperf: '如果當時……，我就會有|rúguǒ dāngshí…, wǒ jiù huì yǒu',
      prog: null,
    },
  },
  {
    verb: { zh: '在', py: 'zài' },
    rows: {
      pres: '我在|wǒ zài',
      negPres: '我不在|wǒ bú zài',
      negPast: '我沒在|wǒ méi zài',
      qAnotA: '我在不在？|wǒ zài bu zài?',
      completed: null, exper: null,
    },
  },
];

const report = createReport();
const { failures } = report;

for (const { verb, rows } of EXPECTED) {
  const result = express(verb);
  for (const [key, expected] of Object.entries(rows)) {
    const actual = result.rows[key];
    const want = expected === null ? Array(6).fill(null)
      : Array.isArray(expected) ? expected : [expected];
    want.forEach((text, person) => {
      report.checks += 1;
      const got = actual[person] ? `${actual[person].zh}|${actual[person].py}` : null;
      if (got !== text) failures.push(`${verb.zh}.${key}[${person}]\n    expected: ${text}\n    actual:   ${got}`);
    });
  }
}

// ---- Validating the verb database -------------------------------------------

const FINALS = new Set(`a o e ai ei ao ou an en ang eng ong i ia ie iao iu ian in iang ing iong
  u ua uo uai ui uan un uang ü üe üan ün er`.split(/\s+/));
const AFTER_JQX = new Set('i ia ian iang iao ie in ing iong iu u ue uan un'.split(' '));
const AFTER_Y = new Set('a ao e i in ing o ong ou u uan ue un an ang'.split(' '));
const AFTER_W = new Set('a ai an ang ei en eng o u'.split(' '));
const TONED = { ā: 'a', á: 'a', ǎ: 'a', à: 'a', ē: 'e', é: 'e', ě: 'e', è: 'e', ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
  ō: 'o', ó: 'o', ǒ: 'o', ò: 'o', ū: 'u', ú: 'u', ǔ: 'u', ù: 'u', ǖ: 'ü', ǘ: 'ü', ǚ: 'ü', ǜ: 'ü' };

// Returns a problem description, or '' when the syllable is a well-formed pinyin syllable.
function checkSyllable(syllable) {
  const marked = [...syllable].filter(ch => TONED[ch]);
  if (marked.length > 1) return 'more than one tone mark';
  const base = [...syllable].map(ch => TONED[ch] || ch).join('');
  if (!/^[a-zü]+$/.test(base)) return 'unexpected characters';

  const initial = /^(zh|ch|sh|[bpmfdtnlgkhjqxzcsrwy])/.exec(base);
  const rest = initial ? base.slice(initial[0].length) : base;
  const lead = initial ? initial[0] : '';
  let valid;
  if (lead === 'y') valid = AFTER_Y.has(rest);
  else if (lead === 'w') valid = AFTER_W.has(rest);
  else if ('jqx'.includes(lead) && lead) valid = AFTER_JQX.has(rest);
  else if (lead === '') valid = FINALS.has(rest) && rest !== 'ü';
  else valid = FINALS.has(rest) || (['zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(lead) && rest === 'i');
  if (!valid) return `"${base}" is not a pinyin syllable`;

  if (marked.length === 1) {
    // the mark goes on a, else e, else the o of ou, else the last vowel
    const vowels = [...rest].map((ch, i) => [ch, i]).filter(([ch]) => 'aeiouü'.includes(ch));
    let expected = vowels.find(([ch]) => ch === 'a') || vowels.find(([ch]) => ch === 'e');
    if (!expected && rest.includes('ou')) expected = vowels.find(([ch]) => ch === 'o');
    if (!expected) expected = vowels[vowels.length - 1];
    const markedAt = [...syllable].findIndex(ch => TONED[ch]) - lead.length;
    if (markedAt !== expected[1]) return 'tone mark on the wrong vowel';
  }
  return '';
}

// Characters that only exist in simplified Chinese; traditional text must not contain them.
const SIMPLIFIED = new Set([...(
  '说买开关吗们这见过还进运动时书问读写听让对与边应该务员总里会来电车马鸟鱼门间没话请谢认识记议讨论设计许误证评试调谈谁课变号叹吓响药乐习卖长张饭饮馆饿饱驱驶驾验骗难双观欢览觉规视亲贝财败贪贯贴贵费贸贺资赏赚赞赠赢转轻载较辅输辞迟达迁迈连迹选递邮钓钟钱钻银锁错锻镇闹闻闭阅阻队阳际陈陆险随隐页顶项须顾顿预领题颜风飞饰骑骂鲜鸭麦黄齐齿龙龟'
  + '执扩扫扬扰报担拣拥拦择挂挡挥据损换摄摆摇摊撑数断无旧显晒晓暂术杀杂权条构标树样档桥检楼欧殴毁气汇汉污没沟洁济浅测浓涌涨润渐温湾滚满滤灭灯灵炉点烂烦烧热爱爷犹狭独狱猎获环现'
  + '画疗疯痒盖监盘睁矫码础确离种积称穷窃笔笼签简类粮紧纠红约级纪纯纱纲纳纵纷纸纹线练组细织终绍经结绕绘给络绝统继续维综绳维绿缓编缘缩网罗罚职联聪肃脑脏脚脱腾舰艰艺节芦苏药获营萧蓝蔑虑虽蚀补装裤规视览诉诊证词译试诗诚话该详语误说请诸诺读课谁调谅谈谊谋谎谐谓谜谢谨豪贡败账货质贩购贯贴贵贷贸费贺资赁赋赌赏赔赖赚赛赞赠赶趋跃跳践踪车轨轮软轰轻载轿较辆辈辉输辑辩边达迁过运还这进远违连迟适选递逻遗邓邻郑酱释针钉钢钥钦铁铃铅铜银铺链销锅锋锐错键锻镜长门闪闭问闯闲间闷闹闻阀队阳阴阵阶际陆陈险随隐隶难雾静面韩页顶项顺须预领频颗题额颜风飘饭饮饰饱饲馈首马驱驳驶驻驾骂骄验骑骗鱼鲜鸟鸡鸣鸭鸿麦黄'
)]);
// Characters also used in traditional text (e.g. 干, 面) are left out of the check; these are the clear giveaways.
for (const ok of '面干发后里台只面向系阻跳蔑') SIMPLIFIED.delete(ok);

// Characters used on purpose with two readings (轉 zhuǎn turn / zhuàn spin, 吐 tǔ spit / tù vomit).
const TWO_READINGS = new Set(['轉', '吐']);
let translations = 0;
const seenZh = {};
for (const [english, options] of Object.entries(VERBS)) {
  options.forEach(({ zh, py, tag }) => {
    translations += 1;
    const label = `${english} -> ${zh} ${py}`;
    const chars = [...zh.replace('|', '')];
    const syllables = py.trim().split(/\s+/);
    if (zh.split('|').length > 2) failures.push(`${label}: more than one "|"`);
    if (!/^[一-鿿|]+$/.test(zh)) failures.push(`${label}: characters outside the CJK range`);
    if (chars.length !== syllables.length) failures.push(`${label}: ${chars.length} characters but ${syllables.length} syllables`);
    syllables.forEach(s => { const problem = checkSyllable(s); if (problem) failures.push(`${label}: syllable "${s}" ${problem}`); });
    chars.filter(ch => SIMPLIFIED.has(ch)).forEach(ch => failures.push(`${label}: "${ch}" is a simplified character`));
    if (!['', 's', 'a', 'm'].includes(tag || '')) failures.push(`${label}: unknown tag "${tag}"`);

    // one reading per spelling, so a character string can't carry two pronunciations
    const key = zh.replace('|', '');
    if (seenZh[key] && seenZh[key] !== py && !TWO_READINGS.has(key)) failures.push(`${label}: also read "${seenZh[key]}" elsewhere`);
    seenZh[key] = py;

    const result = express({ zh, py, tag });
    for (const rowKey of ROW_KEYS) {
      const row = result.rows[rowKey];
      if (!Array.isArray(row) || row.length !== 6) failures.push(`${label}: malformed row ${rowKey}`);
      else if (row.some(cell => cell && (!cell.zh || !cell.py || /undefined|NaN/.test(cell.zh + cell.py)))) {
        failures.push(`${label}: broken cell in ${rowKey}`);
      }
    }
    if (!result.rows.pres.every(Boolean)) failures.push(`${label}: no present-tense pattern`);
  });
}

report.finish(
  `${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Chinese translations`,
  { limit: 80 },
);
