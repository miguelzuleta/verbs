// Run with: node test.js
// Checks the Hindi pattern engine against forms written out by hand (script and
// romanization), then validates every verb in verbs.js: script and romanization agree
// (consonant skeletons), the engine can conjugate it, and nothing comes out broken.
const fs = require('fs');
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const report = createReport();
const { failures } = report;

// Seven forms separated by ';', in the order मैं, तू, वह, हम, तुम, आप, वे ('-' = no such form).
const seven = s => s.split(';').map(f => f.trim());
const x7 = a => Array(7).fill(a).join(' ; ');
// the same form for the three singular persons and for the four plural ones
const x34 = (a, b) => [a, a, a, b, b, b, b].join(' ; ');
// a tag [d] row: only वह and वे have a form
const third = (a, b) => ['-', '-', a, '-', '-', '-', b].join(' ; ');

let checks = 0;
const same = (label, got, want) => { checks += 1; if (got !== want) failures.push(`${label}\n    expected: ${want}\n    actual:   ${got}`); };
const throwsWith = (label, entry, pattern) => {
  checks += 1;
  try { express(entry); } catch (error) { if (!pattern.test(error.message)) failures.push(`${label}: wrong error "${error.message}"`); return; }
  failures.push(`${label}: did not throw`);
};
const formsOf = (result, row, field) => result.rows[row].map(cell => (cell ? cell[field] : '-')).join(' ; ');

// ---- 1. Whole rows (seven slots, script and romanization) -------------------------------
// verb: [infinitive, romanization, tag]. Every expected form was written out by hand.

const FULL = [
  {
    // करना: the model transitive verb; irregular past किया / की, honorific कीजिए
    verb: ['करना', 'karnā', 't'],
    hi: {
      pres: 'करता हूँ / करती हूँ ; करता है / करती है ; करता है / करती है ; करते हैं / करती हैं ; करते हो / करती हो ; करते हैं / करती हैं ; करते हैं / करती हैं',
      presCont: 'कर रहा हूँ / कर रही हूँ ; कर रहा है / कर रही है ; कर रहा है / कर रही है ; कर रहे हैं / कर रही हैं ; कर रहे हो / कर रही हो ; कर रहे हैं / कर रही हैं ; कर रहे हैं / कर रही हैं',
      past: x7('ने किया'),
      pastHab: x34('करता था / करती थी', 'करते थे / करती थीं'),
      pastCont: x34('कर रहा था / कर रही थी', 'कर रहे थे / कर रही थीं'),
      presPerf: x7('ने किया है'),
      pastPerf: x7('ने किया था'),
      fut: 'करूँगा / करूँगी ; करेगा / करेगी ; करेगा / करेगी ; करेंगे / करेंगी ; करोगे / करोगी ; करेंगे / करेंगी ; करेंगे / करेंगी',
      subj: 'करूँ ; करे ; करे ; करें ; करो ; करें ; करें',
      imp: '- ; कर ; - ; करें ; करो ; कीजिए ; -',
      impNeg: '- ; मत कर ; - ; - ; मत करो ; मत कीजिए ; -',
    },
    rom: {
      pres: 'kartā hūṁ / kartī hūṁ ; kartā hai / kartī hai ; kartā hai / kartī hai ; karte haiṁ / kartī haiṁ ; karte ho / kartī ho ; karte haiṁ / kartī haiṁ ; karte haiṁ / kartī haiṁ',
      presCont: 'kar rahā hūṁ / kar rahī hūṁ ; kar rahā hai / kar rahī hai ; kar rahā hai / kar rahī hai ; kar rahe haiṁ / kar rahī haiṁ ; kar rahe ho / kar rahī ho ; kar rahe haiṁ / kar rahī haiṁ ; kar rahe haiṁ / kar rahī haiṁ',
      past: x7('ne kiyā'),
      pastHab: x34('kartā thā / kartī thī', 'karte the / kartī thīṁ'),
      pastCont: x34('kar rahā thā / kar rahī thī', 'kar rahe the / kar rahī thīṁ'),
      presPerf: x7('ne kiyā hai'),
      pastPerf: x7('ne kiyā thā'),
      fut: 'karūṁgā / karūṁgī ; karegā / karegī ; karegā / karegī ; kareṁge / kareṁgī ; karoge / karogī ; kareṁge / kareṁgī ; kareṁge / kareṁgī',
      subj: 'karūṁ ; kare ; kare ; kareṁ ; karo ; kareṁ ; kareṁ',
      imp: '- ; kar ; - ; kareṁ ; karo ; kījiye ; -',
      impNeg: '- ; mat kar ; - ; - ; mat karo ; mat kījiye ; -',
    },
  },
  {
    // जाना: intransitive, past गया / गई, गए / गईं; before an auxiliary the feminine plural is गई
    verb: ['जाना', 'jānā', ''],
    hi: {
      pres: 'जाता हूँ / जाती हूँ ; जाता है / जाती है ; जाता है / जाती है ; जाते हैं / जाती हैं ; जाते हो / जाती हो ; जाते हैं / जाती हैं ; जाते हैं / जाती हैं',
      presCont: 'जा रहा हूँ / जा रही हूँ ; जा रहा है / जा रही है ; जा रहा है / जा रही है ; जा रहे हैं / जा रही हैं ; जा रहे हो / जा रही हो ; जा रहे हैं / जा रही हैं ; जा रहे हैं / जा रही हैं',
      past: x34('गया / गई', 'गए / गईं'),
      pastHab: x34('जाता था / जाती थी', 'जाते थे / जाती थीं'),
      pastCont: x34('जा रहा था / जा रही थी', 'जा रहे थे / जा रही थीं'),
      presPerf: 'गया हूँ / गई हूँ ; गया है / गई है ; गया है / गई है ; गए हैं / गई हैं ; गए हो / गई हो ; गए हैं / गई हैं ; गए हैं / गई हैं',
      pastPerf: x34('गया था / गई थी', 'गए थे / गई थीं'),
      fut: 'जाऊँगा / जाऊँगी ; जाएगा / जाएगी ; जाएगा / जाएगी ; जाएँगे / जाएँगी ; जाओगे / जाओगी ; जाएँगे / जाएँगी ; जाएँगे / जाएँगी',
      subj: 'जाऊँ ; जाए ; जाए ; जाएँ ; जाओ ; जाएँ ; जाएँ',
      imp: '- ; जा ; - ; जाएँ ; जाओ ; जाइए ; -',
      impNeg: '- ; मत जा ; - ; - ; मत जाओ ; मत जाइए ; -',
    },
    rom: {
      pres: 'jātā hūṁ / jātī hūṁ ; jātā hai / jātī hai ; jātā hai / jātī hai ; jāte haiṁ / jātī haiṁ ; jāte ho / jātī ho ; jāte haiṁ / jātī haiṁ ; jāte haiṁ / jātī haiṁ',
      presCont: 'jā rahā hūṁ / jā rahī hūṁ ; jā rahā hai / jā rahī hai ; jā rahā hai / jā rahī hai ; jā rahe haiṁ / jā rahī haiṁ ; jā rahe ho / jā rahī ho ; jā rahe haiṁ / jā rahī haiṁ ; jā rahe haiṁ / jā rahī haiṁ',
      past: x34('gayā / gaī', 'gae / gaīṁ'),
      pastHab: x34('jātā thā / jātī thī', 'jāte the / jātī thīṁ'),
      pastCont: x34('jā rahā thā / jā rahī thī', 'jā rahe the / jā rahī thīṁ'),
      presPerf: 'gayā hūṁ / gaī hūṁ ; gayā hai / gaī hai ; gayā hai / gaī hai ; gae haiṁ / gaī haiṁ ; gae ho / gaī ho ; gae haiṁ / gaī haiṁ ; gae haiṁ / gaī haiṁ',
      pastPerf: x34('gayā thā / gaī thī', 'gae the / gaī thīṁ'),
      fut: 'jāūṁgā / jāūṁgī ; jāegā / jāegī ; jāegā / jāegī ; jāeṁge / jāeṁgī ; jāoge / jāogī ; jāeṁge / jāeṁgī ; jāeṁge / jāeṁgī',
      subj: 'jāūṁ ; jāe ; jāe ; jāeṁ ; jāo ; jāeṁ ; jāeṁ',
      imp: '- ; jā ; - ; jāeṁ ; jāo ; jāiye ; -',
      impNeg: '- ; mat jā ; - ; - ; mat jāo ; mat jāiye ; -',
    },
  },
  {
    // होना: the copula in the present (no gender), था / थी in the past, "become" rows otherwise
    verb: ['होना', 'honā', ''],
    hi: {
      pres: 'हूँ ; है ; है ; हैं ; हो ; हैं ; हैं',
      presCont: 'हो रहा हूँ / हो रही हूँ ; हो रहा है / हो रही है ; हो रहा है / हो रही है ; हो रहे हैं / हो रही हैं ; हो रहे हो / हो रही हो ; हो रहे हैं / हो रही हैं ; हो रहे हैं / हो रही हैं',
      past: x34('था / थी', 'थे / थीं'),
      pastHab: x34('होता था / होती थी', 'होते थे / होती थीं'),
      pastCont: x34('हो रहा था / हो रही थी', 'हो रहे थे / हो रही थीं'),
      presPerf: 'हुआ हूँ / हुई हूँ ; हुआ है / हुई है ; हुआ है / हुई है ; हुए हैं / हुई हैं ; हुए हो / हुई हो ; हुए हैं / हुई हैं ; हुए हैं / हुई हैं',
      pastPerf: x34('हुआ था / हुई थी', 'हुए थे / हुई थीं'),
      fut: 'हूँगा / हूँगी ; होगा / होगी ; होगा / होगी ; होंगे / होंगी ; होगे / होगी ; होंगे / होंगी ; होंगे / होंगी',
      subj: 'हूँ ; हो ; हो ; हों ; हो ; हों ; हों',
      imp: '- ; हो ; - ; हों ; हो ; होइए ; -',
      impNeg: '- ; मत हो ; - ; - ; मत हो ; मत होइए ; -',
    },
    rom: {
      pres: 'hūṁ ; hai ; hai ; haiṁ ; ho ; haiṁ ; haiṁ',
      presCont: 'ho rahā hūṁ / ho rahī hūṁ ; ho rahā hai / ho rahī hai ; ho rahā hai / ho rahī hai ; ho rahe haiṁ / ho rahī haiṁ ; ho rahe ho / ho rahī ho ; ho rahe haiṁ / ho rahī haiṁ ; ho rahe haiṁ / ho rahī haiṁ',
      past: x34('thā / thī', 'the / thīṁ'),
      pastHab: x34('hotā thā / hotī thī', 'hote the / hotī thīṁ'),
      pastCont: x34('ho rahā thā / ho rahī thī', 'ho rahe the / ho rahī thīṁ'),
      presPerf: 'huā hūṁ / huī hūṁ ; huā hai / huī hai ; huā hai / huī hai ; hue haiṁ / huī haiṁ ; hue ho / huī ho ; hue haiṁ / huī haiṁ ; hue haiṁ / huī haiṁ',
      pastPerf: x34('huā thā / huī thī', 'hue the / huī thīṁ'),
      fut: 'hūṁgā / hūṁgī ; hogā / hogī ; hogā / hogī ; hoṁge / hoṁgī ; hoge / hogī ; hoṁge / hoṁgī ; hoṁge / hoṁgī',
      subj: 'hūṁ ; ho ; ho ; hoṁ ; ho ; hoṁ ; hoṁ',
      imp: '- ; ho ; - ; hoṁ ; ho ; hoiye ; -',
      impNeg: '- ; mat ho ; - ; - ; mat ho ; mat hoiye ; -',
    },
  },
  {
    // देना: the stem in े; दूँ दे दें दो, दिया, honorific दीजिए
    verb: ['देना', 'denā', 't'],
    hi: {
      pres: 'देता हूँ / देती हूँ ; देता है / देती है ; देता है / देती है ; देते हैं / देती हैं ; देते हो / देती हो ; देते हैं / देती हैं ; देते हैं / देती हैं',
      presCont: 'दे रहा हूँ / दे रही हूँ ; दे रहा है / दे रही है ; दे रहा है / दे रही है ; दे रहे हैं / दे रही हैं ; दे रहे हो / दे रही हो ; दे रहे हैं / दे रही हैं ; दे रहे हैं / दे रही हैं',
      past: x7('ने दिया'),
      pastHab: x34('देता था / देती थी', 'देते थे / देती थीं'),
      pastCont: x34('दे रहा था / दे रही थी', 'दे रहे थे / दे रही थीं'),
      presPerf: x7('ने दिया है'),
      pastPerf: x7('ने दिया था'),
      fut: 'दूँगा / दूँगी ; देगा / देगी ; देगा / देगी ; देंगे / देंगी ; दोगे / दोगी ; देंगे / देंगी ; देंगे / देंगी',
      subj: 'दूँ ; दे ; दे ; दें ; दो ; दें ; दें',
      imp: '- ; दे ; - ; दें ; दो ; दीजिए ; -',
      impNeg: '- ; मत दे ; - ; - ; मत दो ; मत दीजिए ; -',
    },
    rom: {
      pres: 'detā hūṁ / detī hūṁ ; detā hai / detī hai ; detā hai / detī hai ; dete haiṁ / detī haiṁ ; dete ho / detī ho ; dete haiṁ / detī haiṁ ; dete haiṁ / detī haiṁ',
      presCont: 'de rahā hūṁ / de rahī hūṁ ; de rahā hai / de rahī hai ; de rahā hai / de rahī hai ; de rahe haiṁ / de rahī haiṁ ; de rahe ho / de rahī ho ; de rahe haiṁ / de rahī haiṁ ; de rahe haiṁ / de rahī haiṁ',
      past: x7('ne diyā'),
      pastHab: x34('detā thā / detī thī', 'dete the / detī thīṁ'),
      pastCont: x34('de rahā thā / de rahī thī', 'de rahe the / de rahī thīṁ'),
      presPerf: x7('ne diyā hai'),
      pastPerf: x7('ne diyā thā'),
      fut: 'dūṁgā / dūṁgī ; degā / degī ; degā / degī ; deṁge / deṁgī ; doge / dogī ; deṁge / deṁgī ; deṁge / deṁgī',
      subj: 'dūṁ ; de ; de ; deṁ ; do ; deṁ ; deṁ',
      imp: '- ; de ; - ; deṁ ; do ; dījiye ; -',
      impNeg: '- ; mat de ; - ; - ; mat do ; mat dījiye ; -',
    },
  },
  {
    // लेना: like देना
    verb: ['लेना', 'lenā', 't'],
    hi: {
      past: x7('ने लिया'),
      presPerf: x7('ने लिया है'),
      fut: 'लूँगा / लूँगी ; लेगा / लेगी ; लेगा / लेगी ; लेंगे / लेंगी ; लोगे / लोगी ; लेंगे / लेंगी ; लेंगे / लेंगी',
      subj: 'लूँ ; ले ; ले ; लें ; लो ; लें ; लें',
      imp: '- ; ले ; - ; लें ; लो ; लीजिए ; -',
      impNeg: '- ; मत ले ; - ; - ; मत लो ; मत लीजिए ; -',
    },
    rom: {
      past: x7('ne liyā'),
      fut: 'lūṁgā / lūṁgī ; legā / legī ; legā / legī ; leṁge / leṁgī ; loge / logī ; leṁge / leṁgī ; leṁge / leṁgī',
      subj: 'lūṁ ; le ; le ; leṁ ; lo ; leṁ ; leṁ',
      imp: '- ; le ; - ; leṁ ; lo ; lījiye ; -',
      impNeg: '- ; mat le ; - ; - ; mat lo ; mat lījiye ; -',
    },
  },
  {
    // पीना: the vowel shortens (पिऊँ पिए), पियो, honorific पीजिए
    verb: ['पीना', 'pīnā', 't'],
    hi: {
      pres: 'पीता हूँ / पीती हूँ ; पीता है / पीती है ; पीता है / पीती है ; पीते हैं / पीती हैं ; पीते हो / पीती हो ; पीते हैं / पीती हैं ; पीते हैं / पीती हैं',
      presCont: 'पी रहा हूँ / पी रही हूँ ; पी रहा है / पी रही है ; पी रहा है / पी रही है ; पी रहे हैं / पी रही हैं ; पी रहे हो / पी रही हो ; पी रहे हैं / पी रही हैं ; पी रहे हैं / पी रही हैं',
      past: x7('ने पिया'),
      presPerf: x7('ने पिया है'),
      fut: 'पिऊँगा / पिऊँगी ; पिएगा / पिएगी ; पिएगा / पिएगी ; पिएँगे / पिएँगी ; पियोगे / पियोगी ; पिएँगे / पिएँगी ; पिएँगे / पिएँगी',
      subj: 'पिऊँ ; पिए ; पिए ; पिएँ ; पियो ; पिएँ ; पिएँ',
      imp: '- ; पी ; - ; पिएँ ; पियो ; पीजिए ; -',
      impNeg: '- ; मत पी ; - ; - ; मत पियो ; मत पीजिए ; -',
    },
    rom: {
      pres: 'pītā hūṁ / pītī hūṁ ; pītā hai / pītī hai ; pītā hai / pītī hai ; pīte haiṁ / pītī haiṁ ; pīte ho / pītī ho ; pīte haiṁ / pītī haiṁ ; pīte haiṁ / pītī haiṁ',
      presCont: 'pī rahā hūṁ / pī rahī hūṁ ; pī rahā hai / pī rahī hai ; pī rahā hai / pī rahī hai ; pī rahe haiṁ / pī rahī haiṁ ; pī rahe ho / pī rahī ho ; pī rahe haiṁ / pī rahī haiṁ ; pī rahe haiṁ / pī rahī haiṁ',
      past: x7('ne piyā'),
      presPerf: x7('ne piyā hai'),
      fut: 'piūṁgā / piūṁgī ; piegā / piegī ; piegā / piegī ; pieṁge / pieṁgī ; piyoge / piyogī ; pieṁge / pieṁgī ; pieṁge / pieṁgī',
      subj: 'piūṁ ; pie ; pie ; pieṁ ; piyo ; pieṁ ; pieṁ',
      imp: '- ; pī ; - ; pieṁ ; piyo ; pījiye ; -',
      impNeg: '- ; mat pī ; - ; - ; mat piyo ; mat pījiye ; -',
    },
  },
  {
    // जीना (intransitive): feminine past जी / जीं, jiyā / jie
    verb: ['जीना', 'jīnā', ''],
    hi: {
      past: x34('जिया / जी', 'जिए / जीं'),
      presPerf: 'जिया हूँ / जी हूँ ; जिया है / जी है ; जिया है / जी है ; जिए हैं / जी हैं ; जिए हो / जी हो ; जिए हैं / जी हैं ; जिए हैं / जी हैं',
      pastPerf: x34('जिया था / जी थी', 'जिए थे / जी थीं'),
      fut: 'जिऊँगा / जिऊँगी ; जिएगा / जिएगी ; जिएगा / जिएगी ; जिएँगे / जिएँगी ; जियोगे / जियोगी ; जिएँगे / जिएँगी ; जिएँगे / जिएँगी',
      subj: 'जिऊँ ; जिए ; जिए ; जिएँ ; जियो ; जिएँ ; जिएँ',
      imp: '- ; जी ; - ; जिएँ ; जियो ; जीजिए ; -',
      impNeg: '- ; मत जी ; - ; - ; मत जियो ; मत जीजिए ; -',
    },
    rom: {
      past: x34('jiyā / jī', 'jie / jīṁ'),
      presPerf: 'jiyā hūṁ / jī hūṁ ; jiyā hai / jī hai ; jiyā hai / jī hai ; jie haiṁ / jī haiṁ ; jie ho / jī ho ; jie haiṁ / jī haiṁ ; jie haiṁ / jī haiṁ',
      pastPerf: x34('jiyā thā / jī thī', 'jie the / jī thīṁ'),
      fut: 'jiūṁgā / jiūṁgī ; jiegā / jiegī ; jiegā / jiegī ; jieṁge / jieṁgī ; jiyoge / jiyogī ; jieṁge / jieṁgī ; jieṁge / jieṁgī',
      subj: 'jiūṁ ; jie ; jie ; jieṁ ; jiyo ; jieṁ ; jieṁ',
      imp: '- ; jī ; - ; jieṁ ; jiyo ; jījiye ; -',
      impNeg: '- ; mat jī ; - ; - ; mat jiyo ; mat jījiye ; -',
    },
  },
  {
    // सोना: stem in ो; independent vowels after it (सोऊँ सोए सोएँ सोओ), honorific सोइए
    verb: ['सोना', 'sonā', ''],
    hi: {
      pres: 'सोता हूँ / सोती हूँ ; सोता है / सोती है ; सोता है / सोती है ; सोते हैं / सोती हैं ; सोते हो / सोती हो ; सोते हैं / सोती हैं ; सोते हैं / सोती हैं',
      past: x34('सोया / सोई', 'सोए / सोईं'),
      presPerf: 'सोया हूँ / सोई हूँ ; सोया है / सोई है ; सोया है / सोई है ; सोए हैं / सोई हैं ; सोए हो / सोई हो ; सोए हैं / सोई हैं ; सोए हैं / सोई हैं',
      pastPerf: x34('सोया था / सोई थी', 'सोए थे / सोई थीं'),
      fut: 'सोऊँगा / सोऊँगी ; सोएगा / सोएगी ; सोएगा / सोएगी ; सोएँगे / सोएँगी ; सोओगे / सोओगी ; सोएँगे / सोएँगी ; सोएँगे / सोएँगी',
      subj: 'सोऊँ ; सोए ; सोए ; सोएँ ; सोओ ; सोएँ ; सोएँ',
      imp: '- ; सो ; - ; सोएँ ; सोओ ; सोइए ; -',
      impNeg: '- ; मत सो ; - ; - ; मत सोओ ; मत सोइए ; -',
    },
    rom: {
      pres: 'sotā hūṁ / sotī hūṁ ; sotā hai / sotī hai ; sotā hai / sotī hai ; sote haiṁ / sotī haiṁ ; sote ho / sotī ho ; sote haiṁ / sotī haiṁ ; sote haiṁ / sotī haiṁ',
      past: x34('soyā / soī', 'soe / soīṁ'),
      presPerf: 'soyā hūṁ / soī hūṁ ; soyā hai / soī hai ; soyā hai / soī hai ; soe haiṁ / soī haiṁ ; soe ho / soī ho ; soe haiṁ / soī haiṁ ; soe haiṁ / soī haiṁ',
      pastPerf: x34('soyā thā / soī thī', 'soe the / soī thīṁ'),
      fut: 'soūṁgā / soūṁgī ; soegā / soegī ; soegā / soegī ; soeṁge / soeṁgī ; sooge / soogī ; soeṁge / soeṁgī ; soeṁge / soeṁgī',
      subj: 'soūṁ ; soe ; soe ; soeṁ ; soo ; soeṁ ; soeṁ',
      imp: '- ; so ; - ; soeṁ ; soo ; soiye ; -',
      impNeg: '- ; mat so ; - ; - ; mat soo ; mat soiye ; -',
    },
  },
  {
    // खाना [t]: the stem in ा, past stem + या
    verb: ['खाना', 'khānā', 't'],
    hi: {
      pres: 'खाता हूँ / खाती हूँ ; खाता है / खाती है ; खाता है / खाती है ; खाते हैं / खाती हैं ; खाते हो / खाती हो ; खाते हैं / खाती हैं ; खाते हैं / खाती हैं',
      presCont: 'खा रहा हूँ / खा रही हूँ ; खा रहा है / खा रही है ; खा रहा है / खा रही है ; खा रहे हैं / खा रही हैं ; खा रहे हो / खा रही हो ; खा रहे हैं / खा रही हैं ; खा रहे हैं / खा रही हैं',
      past: x7('ने खाया'),
      presPerf: x7('ने खाया है'),
      pastPerf: x7('ने खाया था'),
      fut: 'खाऊँगा / खाऊँगी ; खाएगा / खाएगी ; खाएगा / खाएगी ; खाएँगे / खाएँगी ; खाओगे / खाओगी ; खाएँगे / खाएँगी ; खाएँगे / खाएँगी',
      subj: 'खाऊँ ; खाए ; खाए ; खाएँ ; खाओ ; खाएँ ; खाएँ',
      imp: '- ; खा ; - ; खाएँ ; खाओ ; खाइए ; -',
      impNeg: '- ; मत खा ; - ; - ; मत खाओ ; मत खाइए ; -',
    },
    rom: {
      pres: 'khātā hūṁ / khātī hūṁ ; khātā hai / khātī hai ; khātā hai / khātī hai ; khāte haiṁ / khātī haiṁ ; khāte ho / khātī ho ; khāte haiṁ / khātī haiṁ ; khāte haiṁ / khātī haiṁ',
      presCont: 'khā rahā hūṁ / khā rahī hūṁ ; khā rahā hai / khā rahī hai ; khā rahā hai / khā rahī hai ; khā rahe haiṁ / khā rahī haiṁ ; khā rahe ho / khā rahī ho ; khā rahe haiṁ / khā rahī haiṁ ; khā rahe haiṁ / khā rahī haiṁ',
      past: x7('ne khāyā'),
      presPerf: x7('ne khāyā hai'),
      pastPerf: x7('ne khāyā thā'),
      fut: 'khāūṁgā / khāūṁgī ; khāegā / khāegī ; khāegā / khāegī ; khāeṁge / khāeṁgī ; khāoge / khāogī ; khāeṁge / khāeṁgī ; khāeṁge / khāeṁgī',
      subj: 'khāūṁ ; khāe ; khāe ; khāeṁ ; khāo ; khāeṁ ; khāeṁ',
      imp: '- ; khā ; - ; khāeṁ ; khāo ; khāiye ; -',
      impNeg: '- ; mat khā ; - ; - ; mat khāo ; mat khāiye ; -',
    },
  },
  {
    // the same verb without the tag shows how the past participle agrees with the subject
    verb: ['खाना', 'khānā', ''],
    hi: {
      past: x34('खाया / खाई', 'खाए / खाईं'),
      presPerf: 'खाया हूँ / खाई हूँ ; खाया है / खाई है ; खाया है / खाई है ; खाए हैं / खाई हैं ; खाए हो / खाई हो ; खाए हैं / खाई हैं ; खाए हैं / खाई हैं',
      pastPerf: x34('खाया था / खाई थी', 'खाए थे / खाई थीं'),
    },
    rom: {
      past: x34('khāyā / khāī', 'khāe / khāīṁ'),
      presPerf: 'khāyā hūṁ / khāī hūṁ ; khāyā hai / khāī hai ; khāyā hai / khāī hai ; khāe haiṁ / khāī haiṁ ; khāe ho / khāī ho ; khāe haiṁ / khāī haiṁ ; khāe haiṁ / khāī haiṁ',
      pastPerf: x34('khāyā thā / khāī thī', 'khāe the / khāī thīṁ'),
    },
  },
  {
    // आना: the stem is a single independent vowel
    verb: ['आना', 'ānā', ''],
    hi: {
      pres: 'आता हूँ / आती हूँ ; आता है / आती है ; आता है / आती है ; आते हैं / आती हैं ; आते हो / आती हो ; आते हैं / आती हैं ; आते हैं / आती हैं',
      past: x34('आया / आई', 'आए / आईं'),
      presPerf: 'आया हूँ / आई हूँ ; आया है / आई है ; आया है / आई है ; आए हैं / आई हैं ; आए हो / आई हो ; आए हैं / आई हैं ; आए हैं / आई हैं',
      pastPerf: x34('आया था / आई थी', 'आए थे / आई थीं'),
      fut: 'आऊँगा / आऊँगी ; आएगा / आएगी ; आएगा / आएगी ; आएँगे / आएँगी ; आओगे / आओगी ; आएँगे / आएँगी ; आएँगे / आएँगी',
      subj: 'आऊँ ; आए ; आए ; आएँ ; आओ ; आएँ ; आएँ',
      imp: '- ; आ ; - ; आएँ ; आओ ; आइए ; -',
      impNeg: '- ; मत आ ; - ; - ; मत आओ ; मत आइए ; -',
    },
    rom: {
      pres: 'ātā hūṁ / ātī hūṁ ; ātā hai / ātī hai ; ātā hai / ātī hai ; āte haiṁ / ātī haiṁ ; āte ho / ātī ho ; āte haiṁ / ātī haiṁ ; āte haiṁ / ātī haiṁ',
      past: x34('āyā / āī', 'āe / āīṁ'),
      presPerf: 'āyā hūṁ / āī hūṁ ; āyā hai / āī hai ; āyā hai / āī hai ; āe haiṁ / āī haiṁ ; āe ho / āī ho ; āe haiṁ / āī haiṁ ; āe haiṁ / āī haiṁ',
      pastPerf: x34('āyā thā / āī thī', 'āe the / āī thīṁ'),
      fut: 'āūṁgā / āūṁgī ; āegā / āegī ; āegā / āegī ; āeṁge / āeṁgī ; āoge / āogī ; āeṁge / āeṁgī ; āeṁge / āeṁgī',
      subj: 'āūṁ ; āe ; āe ; āeṁ ; āo ; āeṁ ; āeṁ',
      imp: '- ; ā ; - ; āeṁ ; āo ; āiye ; -',
      impNeg: '- ; mat ā ; - ; - ; mat āo ; mat āiye ; -',
    },
  },
  {
    // बोलना, a consonant stem; without the tag the past participle agrees with the subject
    verb: ['बोलना', 'bolnā', ''],
    hi: {
      pres: 'बोलता हूँ / बोलती हूँ ; बोलता है / बोलती है ; बोलता है / बोलती है ; बोलते हैं / बोलती हैं ; बोलते हो / बोलती हो ; बोलते हैं / बोलती हैं ; बोलते हैं / बोलती हैं',
      past: x34('बोला / बोली', 'बोले / बोलीं'),
      presPerf: 'बोला हूँ / बोली हूँ ; बोला है / बोली है ; बोला है / बोली है ; बोले हैं / बोली हैं ; बोले हो / बोली हो ; बोले हैं / बोली हैं ; बोले हैं / बोली हैं',
      pastPerf: x34('बोला था / बोली थी', 'बोले थे / बोली थीं'),
      fut: 'बोलूँगा / बोलूँगी ; बोलेगा / बोलेगी ; बोलेगा / बोलेगी ; बोलेंगे / बोलेंगी ; बोलोगे / बोलोगी ; बोलेंगे / बोलेंगी ; बोलेंगे / बोलेंगी',
      subj: 'बोलूँ ; बोले ; बोले ; बोलें ; बोलो ; बोलें ; बोलें',
      imp: '- ; बोल ; - ; बोलें ; बोलो ; बोलिए ; -',
      impNeg: '- ; मत बोल ; - ; - ; मत बोलो ; मत बोलिए ; -',
    },
    rom: {
      pres: 'boltā hūṁ / boltī hūṁ ; boltā hai / boltī hai ; boltā hai / boltī hai ; bolte haiṁ / boltī haiṁ ; bolte ho / boltī ho ; bolte haiṁ / boltī haiṁ ; bolte haiṁ / boltī haiṁ',
      past: x34('bolā / bolī', 'bole / bolīṁ'),
      presPerf: 'bolā hūṁ / bolī hūṁ ; bolā hai / bolī hai ; bolā hai / bolī hai ; bole haiṁ / bolī haiṁ ; bole ho / bolī ho ; bole haiṁ / bolī haiṁ ; bole haiṁ / bolī haiṁ',
      pastPerf: x34('bolā thā / bolī thī', 'bole the / bolī thīṁ'),
      fut: 'bolūṁgā / bolūṁgī ; bolegā / bolegī ; bolegā / bolegī ; boleṁge / boleṁgī ; bologe / bologī ; boleṁge / boleṁgī ; boleṁge / boleṁgī',
      subj: 'bolūṁ ; bole ; bole ; boleṁ ; bolo ; boleṁ ; boleṁ',
      imp: '- ; bol ; - ; boleṁ ; bolo ; boliye ; -',
      impNeg: '- ; mat bol ; - ; - ; mat bolo ; mat boliye ; -',
    },
  },
  {
    // a compound conjugates its last word only; ने comes first, the leading word after it
    verb: ['काम करना', 'kām karnā', 't'],
    hi: {
      pres: 'काम करता हूँ / काम करती हूँ ; काम करता है / काम करती है ; काम करता है / काम करती है ; काम करते हैं / काम करती हैं ; काम करते हो / काम करती हो ; काम करते हैं / काम करती हैं ; काम करते हैं / काम करती हैं',
      presCont: 'काम कर रहा हूँ / काम कर रही हूँ ; काम कर रहा है / काम कर रही है ; काम कर रहा है / काम कर रही है ; काम कर रहे हैं / काम कर रही हैं ; काम कर रहे हो / काम कर रही हो ; काम कर रहे हैं / काम कर रही हैं ; काम कर रहे हैं / काम कर रही हैं',
      past: x7('ने काम किया'),
      pastHab: x34('काम करता था / काम करती थी', 'काम करते थे / काम करती थीं'),
      pastCont: x34('काम कर रहा था / काम कर रही थी', 'काम कर रहे थे / काम कर रही थीं'),
      presPerf: x7('ने काम किया है'),
      pastPerf: x7('ने काम किया था'),
      fut: 'काम करूँगा / काम करूँगी ; काम करेगा / काम करेगी ; काम करेगा / काम करेगी ; काम करेंगे / काम करेंगी ; काम करोगे / काम करोगी ; काम करेंगे / काम करेंगी ; काम करेंगे / काम करेंगी',
      subj: 'काम करूँ ; काम करे ; काम करे ; काम करें ; काम करो ; काम करें ; काम करें',
      imp: '- ; काम कर ; - ; काम करें ; काम करो ; काम कीजिए ; -',
      impNeg: '- ; काम मत कर ; - ; - ; काम मत करो ; काम मत कीजिए ; -',
    },
    rom: {
      pres: 'kām kartā hūṁ / kām kartī hūṁ ; kām kartā hai / kām kartī hai ; kām kartā hai / kām kartī hai ; kām karte haiṁ / kām kartī haiṁ ; kām karte ho / kām kartī ho ; kām karte haiṁ / kām kartī haiṁ ; kām karte haiṁ / kām kartī haiṁ',
      presCont: 'kām kar rahā hūṁ / kām kar rahī hūṁ ; kām kar rahā hai / kām kar rahī hai ; kām kar rahā hai / kām kar rahī hai ; kām kar rahe haiṁ / kām kar rahī haiṁ ; kām kar rahe ho / kām kar rahī ho ; kām kar rahe haiṁ / kām kar rahī haiṁ ; kām kar rahe haiṁ / kām kar rahī haiṁ',
      past: x7('ne kām kiyā'),
      pastHab: x34('kām kartā thā / kām kartī thī', 'kām karte the / kām kartī thīṁ'),
      pastCont: x34('kām kar rahā thā / kām kar rahī thī', 'kām kar rahe the / kām kar rahī thīṁ'),
      presPerf: x7('ne kām kiyā hai'),
      pastPerf: x7('ne kām kiyā thā'),
      fut: 'kām karūṁgā / kām karūṁgī ; kām karegā / kām karegī ; kām karegā / kām karegī ; kām kareṁge / kām kareṁgī ; kām karoge / kām karogī ; kām kareṁge / kām kareṁgī ; kām kareṁge / kām kareṁgī',
      subj: 'kām karūṁ ; kām kare ; kām kare ; kām kareṁ ; kām karo ; kām kareṁ ; kām kareṁ',
      imp: '- ; kām kar ; - ; kām kareṁ ; kām karo ; kām kījiye ; -',
      impNeg: '- ; kām mat kar ; - ; - ; kām mat karo ; kām mat kījiye ; -',
    },
  },
  {
    // an adjective + होना is "become" in every row (only a bare होना is the copula)
    verb: ['खुश होना', 'khuś honā', ''],
    hi: {
      pres: 'खुश होता हूँ / खुश होती हूँ ; खुश होता है / खुश होती है ; खुश होता है / खुश होती है ; खुश होते हैं / खुश होती हैं ; खुश होते हो / खुश होती हो ; खुश होते हैं / खुश होती हैं ; खुश होते हैं / खुश होती हैं',
      past: x34('खुश हुआ / खुश हुई', 'खुश हुए / खुश हुईं'),
      pastPerf: x34('खुश हुआ था / खुश हुई थी', 'खुश हुए थे / खुश हुई थीं'),
      fut: 'खुश हूँगा / खुश हूँगी ; खुश होगा / खुश होगी ; खुश होगा / खुश होगी ; खुश होंगे / खुश होंगी ; खुश होगे / खुश होगी ; खुश होंगे / खुश होंगी ; खुश होंगे / खुश होंगी',
      subj: 'खुश हूँ ; खुश हो ; खुश हो ; खुश हों ; खुश हो ; खुश हों ; खुश हों',
      imp: '- ; खुश हो ; - ; खुश हों ; खुश हो ; खुश होइए ; -',
      impNeg: '- ; खुश मत हो ; - ; - ; खुश मत हो ; खुश मत होइए ; -',
    },
    rom: {
      pres: 'khuś hotā hūṁ / khuś hotī hūṁ ; khuś hotā hai / khuś hotī hai ; khuś hotā hai / khuś hotī hai ; khuś hote haiṁ / khuś hotī haiṁ ; khuś hote ho / khuś hotī ho ; khuś hote haiṁ / khuś hotī haiṁ ; khuś hote haiṁ / khuś hotī haiṁ',
      past: x34('khuś huā / khuś huī', 'khuś hue / khuś huīṁ'),
      pastPerf: x34('khuś huā thā / khuś huī thī', 'khuś hue the / khuś huī thīṁ'),
      fut: 'khuś hūṁgā / khuś hūṁgī ; khuś hogā / khuś hogī ; khuś hogā / khuś hogī ; khuś hoṁge / khuś hoṁgī ; khuś hoge / khuś hogī ; khuś hoṁge / khuś hoṁgī ; khuś hoṁge / khuś hoṁgī',
      subj: 'khuś hūṁ ; khuś ho ; khuś ho ; khuś hoṁ ; khuś ho ; khuś hoṁ ; khuś hoṁ',
      imp: '- ; khuś ho ; - ; khuś hoṁ ; khuś ho ; khuś hoiye ; -',
      impNeg: '- ; khuś mat ho ; - ; - ; khuś mat ho ; khuś mat hoiye ; -',
    },
  },
  {
    // nasal in the middle of the first word (anusvara -> ṁ) and the nukta letter ज़
    verb: ['इंतज़ार करना', 'iṁtazār karnā', 't'],
    hi: {
      pres: 'इंतज़ार करता हूँ / इंतज़ार करती हूँ ; इंतज़ार करता है / इंतज़ार करती है ; इंतज़ार करता है / इंतज़ार करती है ; इंतज़ार करते हैं / इंतज़ार करती हैं ; इंतज़ार करते हो / इंतज़ार करती हो ; इंतज़ार करते हैं / इंतज़ार करती हैं ; इंतज़ार करते हैं / इंतज़ार करती हैं',
      past: x7('ने इंतज़ार किया'),
      subj: 'इंतज़ार करूँ ; इंतज़ार करे ; इंतज़ार करे ; इंतज़ार करें ; इंतज़ार करो ; इंतज़ार करें ; इंतज़ार करें',
      imp: '- ; इंतज़ार कर ; - ; इंतज़ार करें ; इंतज़ार करो ; इंतज़ार कीजिए ; -',
      impNeg: '- ; इंतज़ार मत कर ; - ; - ; इंतज़ार मत करो ; इंतज़ार मत कीजिए ; -',
    },
    rom: {
      pres: 'iṁtazār kartā hūṁ / iṁtazār kartī hūṁ ; iṁtazār kartā hai / iṁtazār kartī hai ; iṁtazār kartā hai / iṁtazār kartī hai ; iṁtazār karte haiṁ / iṁtazār kartī haiṁ ; iṁtazār karte ho / iṁtazār kartī ho ; iṁtazār karte haiṁ / iṁtazār kartī haiṁ ; iṁtazār karte haiṁ / iṁtazār kartī haiṁ',
      past: x7('ne iṁtazār kiyā'),
      subj: 'iṁtazār karūṁ ; iṁtazār kare ; iṁtazār kare ; iṁtazār kareṁ ; iṁtazār karo ; iṁtazār kareṁ ; iṁtazār kareṁ',
      imp: '- ; iṁtazār kar ; - ; iṁtazār kareṁ ; iṁtazār karo ; iṁtazār kījiye ; -',
      impNeg: '- ; iṁtazār mat kar ; - ; - ; iṁtazār mat karo ; iṁtazār mat kījiye ; -',
    },
  },
  {
    // the retroflex flap ṛh (ढ़)
    verb: ['पढ़ना', 'paṛhnā', 't'],
    hi: {
      pres: 'पढ़ता हूँ / पढ़ती हूँ ; पढ़ता है / पढ़ती है ; पढ़ता है / पढ़ती है ; पढ़ते हैं / पढ़ती हैं ; पढ़ते हो / पढ़ती हो ; पढ़ते हैं / पढ़ती हैं ; पढ़ते हैं / पढ़ती हैं',
      past: x7('ने पढ़ा'),
      fut: 'पढ़ूँगा / पढ़ूँगी ; पढ़ेगा / पढ़ेगी ; पढ़ेगा / पढ़ेगी ; पढ़ेंगे / पढ़ेंगी ; पढ़ोगे / पढ़ोगी ; पढ़ेंगे / पढ़ेंगी ; पढ़ेंगे / पढ़ेंगी',
      subj: 'पढ़ूँ ; पढ़े ; पढ़े ; पढ़ें ; पढ़ो ; पढ़ें ; पढ़ें',
      imp: '- ; पढ़ ; - ; पढ़ें ; पढ़ो ; पढ़िए ; -',
      impNeg: '- ; मत पढ़ ; - ; - ; मत पढ़ो ; मत पढ़िए ; -',
    },
    rom: {
      pres: 'paṛhtā hūṁ / paṛhtī hūṁ ; paṛhtā hai / paṛhtī hai ; paṛhtā hai / paṛhtī hai ; paṛhte haiṁ / paṛhtī haiṁ ; paṛhte ho / paṛhtī ho ; paṛhte haiṁ / paṛhtī haiṁ ; paṛhte haiṁ / paṛhtī haiṁ',
      past: x7('ne paṛhā'),
      fut: 'paṛhūṁgā / paṛhūṁgī ; paṛhegā / paṛhegī ; paṛhegā / paṛhegī ; paṛheṁge / paṛheṁgī ; paṛhoge / paṛhogī ; paṛheṁge / paṛheṁgī ; paṛheṁge / paṛheṁgī',
      subj: 'paṛhūṁ ; paṛhe ; paṛhe ; paṛheṁ ; paṛho ; paṛheṁ ; paṛheṁ',
      imp: '- ; paṛh ; - ; paṛheṁ ; paṛho ; paṛhiye ; -',
      impNeg: '- ; mat paṛh ; - ; - ; mat paṛho ; mat paṛhiye ; -',
    },
  },
  {
    // the same verb without the tag
    verb: ['पढ़ना', 'paṛhnā', ''],
    hi: { past: x34('पढ़ा / पढ़ी', 'पढ़े / पढ़ीं') },
    rom: { past: x34('paṛhā / paṛhī', 'paṛhe / paṛhīṁ') },
  },
  {
    // ū-stem छूना: the vowel shortens (छुआ छुए छुई छुईं; छुऊँ छुए छुओ)
    verb: ['छूना', 'chūnā', ''],
    hi: {
      pres: 'छूता हूँ / छूती हूँ ; छूता है / छूती है ; छूता है / छूती है ; छूते हैं / छूती हैं ; छूते हो / छूती हो ; छूते हैं / छूती हैं ; छूते हैं / छूती हैं',
      past: x34('छुआ / छुई', 'छुए / छुईं'),
      presPerf: 'छुआ हूँ / छुई हूँ ; छुआ है / छुई है ; छुआ है / छुई है ; छुए हैं / छुई हैं ; छुए हो / छुई हो ; छुए हैं / छुई हैं ; छुए हैं / छुई हैं',
      fut: 'छुऊँगा / छुऊँगी ; छुएगा / छुएगी ; छुएगा / छुएगी ; छुएँगे / छुएँगी ; छुओगे / छुओगी ; छुएँगे / छुएँगी ; छुएँगे / छुएँगी',
      subj: 'छुऊँ ; छुए ; छुए ; छुएँ ; छुओ ; छुएँ ; छुएँ',
    },
    rom: {
      pres: 'chūtā hūṁ / chūtī hūṁ ; chūtā hai / chūtī hai ; chūtā hai / chūtī hai ; chūte haiṁ / chūtī haiṁ ; chūte ho / chūtī ho ; chūte haiṁ / chūtī haiṁ ; chūte haiṁ / chūtī haiṁ',
      past: x34('chuā / chuī', 'chue / chuīṁ'),
      presPerf: 'chuā hūṁ / chuī hūṁ ; chuā hai / chuī hai ; chuā hai / chuī hai ; chue haiṁ / chuī haiṁ ; chue ho / chuī ho ; chue haiṁ / chuī haiṁ ; chue haiṁ / chuī haiṁ',
      fut: 'chuūṁgā / chuūṁgī ; chuegā / chuegī ; chuegā / chuegī ; chueṁge / chueṁgī ; chuoge / chuogī ; chueṁge / chueṁgī ; chueṁge / chueṁgī',
      subj: 'chuūṁ ; chue ; chue ; chueṁ ; chuo ; chueṁ ; chueṁ',
    },
  },
  {
    // a nasal vowel sign inside the stem (पहुँचना) and the plain-c / ch distinction (च = c)
    verb: ['पहुँचना', 'pahuṁcnā', ''],
    hi: {
      past: x34('पहुँचा / पहुँची', 'पहुँचे / पहुँचीं'),
      subj: 'पहुँचूँ ; पहुँचे ; पहुँचे ; पहुँचें ; पहुँचो ; पहुँचें ; पहुँचें',
      imp: '- ; पहुँच ; - ; पहुँचें ; पहुँचो ; पहुँचिए ; -',
    },
    rom: {
      past: x34('pahuṁcā / pahuṁcī', 'pahuṁce / pahuṁcīṁ'),
      subj: 'pahuṁcūṁ ; pahuṁce ; pahuṁce ; pahuṁceṁ ; pahuṁco ; pahuṁceṁ ; pahuṁceṁ',
      imp: '- ; pahuṁc ; - ; pahuṁceṁ ; pahuṁco ; pahuṁciye ; -',
    },
  },
  {
    // [a]: the leading adjective agrees with the subject like a participle (बड़ा / बड़े / बड़ी); the
    // rows without gender (subjunctive, imperatives) show the masculine form of the right number
    verb: ['बड़ा होना', 'baṛā honā', 'a'],
    hi: {
      pres: 'बड़ा होता हूँ / बड़ी होती हूँ ; बड़ा होता है / बड़ी होती है ; बड़ा होता है / बड़ी होती है ; बड़े होते हैं / बड़ी होती हैं ; बड़े होते हो / बड़ी होती हो ; बड़े होते हैं / बड़ी होती हैं ; बड़े होते हैं / बड़ी होती हैं',
      presCont: 'बड़ा हो रहा हूँ / बड़ी हो रही हूँ ; बड़ा हो रहा है / बड़ी हो रही है ; बड़ा हो रहा है / बड़ी हो रही है ; बड़े हो रहे हैं / बड़ी हो रही हैं ; बड़े हो रहे हो / बड़ी हो रही हो ; बड़े हो रहे हैं / बड़ी हो रही हैं ; बड़े हो रहे हैं / बड़ी हो रही हैं',
      past: x34('बड़ा हुआ / बड़ी हुई', 'बड़े हुए / बड़ी हुईं'),
      pastHab: x34('बड़ा होता था / बड़ी होती थी', 'बड़े होते थे / बड़ी होती थीं'),
      pastCont: x34('बड़ा हो रहा था / बड़ी हो रही थी', 'बड़े हो रहे थे / बड़ी हो रही थीं'),
      presPerf: 'बड़ा हुआ हूँ / बड़ी हुई हूँ ; बड़ा हुआ है / बड़ी हुई है ; बड़ा हुआ है / बड़ी हुई है ; बड़े हुए हैं / बड़ी हुई हैं ; बड़े हुए हो / बड़ी हुई हो ; बड़े हुए हैं / बड़ी हुई हैं ; बड़े हुए हैं / बड़ी हुई हैं',
      pastPerf: x34('बड़ा हुआ था / बड़ी हुई थी', 'बड़े हुए थे / बड़ी हुई थीं'),
      fut: 'बड़ा हूँगा / बड़ी हूँगी ; बड़ा होगा / बड़ी होगी ; बड़ा होगा / बड़ी होगी ; बड़े होंगे / बड़ी होंगी ; बड़े होगे / बड़ी होगी ; बड़े होंगे / बड़ी होंगी ; बड़े होंगे / बड़ी होंगी',
      subj: 'बड़ा हूँ ; बड़ा हो ; बड़ा हो ; बड़े हों ; बड़े हो ; बड़े हों ; बड़े हों',
      imp: '- ; बड़ा हो ; - ; बड़े हों ; बड़े हो ; बड़े होइए ; -',
      impNeg: '- ; बड़ा मत हो ; - ; - ; बड़े मत हो ; बड़े मत होइए ; -',
    },
    rom: {
      pres: 'baṛā hotā hūṁ / baṛī hotī hūṁ ; baṛā hotā hai / baṛī hotī hai ; baṛā hotā hai / baṛī hotī hai ; baṛe hote haiṁ / baṛī hotī haiṁ ; baṛe hote ho / baṛī hotī ho ; baṛe hote haiṁ / baṛī hotī haiṁ ; baṛe hote haiṁ / baṛī hotī haiṁ',
      presCont: 'baṛā ho rahā hūṁ / baṛī ho rahī hūṁ ; baṛā ho rahā hai / baṛī ho rahī hai ; baṛā ho rahā hai / baṛī ho rahī hai ; baṛe ho rahe haiṁ / baṛī ho rahī haiṁ ; baṛe ho rahe ho / baṛī ho rahī ho ; baṛe ho rahe haiṁ / baṛī ho rahī haiṁ ; baṛe ho rahe haiṁ / baṛī ho rahī haiṁ',
      past: x34('baṛā huā / baṛī huī', 'baṛe hue / baṛī huīṁ'),
      pastHab: x34('baṛā hotā thā / baṛī hotī thī', 'baṛe hote the / baṛī hotī thīṁ'),
      pastCont: x34('baṛā ho rahā thā / baṛī ho rahī thī', 'baṛe ho rahe the / baṛī ho rahī thīṁ'),
      presPerf: 'baṛā huā hūṁ / baṛī huī hūṁ ; baṛā huā hai / baṛī huī hai ; baṛā huā hai / baṛī huī hai ; baṛe hue haiṁ / baṛī huī haiṁ ; baṛe hue ho / baṛī huī ho ; baṛe hue haiṁ / baṛī huī haiṁ ; baṛe hue haiṁ / baṛī huī haiṁ',
      pastPerf: x34('baṛā huā thā / baṛī huī thī', 'baṛe hue the / baṛī huī thīṁ'),
      fut: 'baṛā hūṁgā / baṛī hūṁgī ; baṛā hogā / baṛī hogī ; baṛā hogā / baṛī hogī ; baṛe hoṁge / baṛī hoṁgī ; baṛe hoge / baṛī hogī ; baṛe hoṁge / baṛī hoṁgī ; baṛe hoṁge / baṛī hoṁgī',
      subj: 'baṛā hūṁ ; baṛā ho ; baṛā ho ; baṛe hoṁ ; baṛe ho ; baṛe hoṁ ; baṛe hoṁ',
      imp: '- ; baṛā ho ; - ; baṛe hoṁ ; baṛe ho ; baṛe hoiye ; -',
      impNeg: '- ; baṛā mat ho ; - ; - ; baṛe mat ho ; baṛe mat hoiye ; -',
    },
  },
  {
    // [tf]: a ने verb whose object noun is feminine: the participle is feminine (की, not किया) and
    // so is the auxiliary of the past perfect (थी); the other rows are those of any [t] verb
    verb: ['बात करना', 'bāt karnā', 'tf'],
    hi: {
      past: x7('ने बात की'),
      presPerf: x7('ने बात की है'),
      pastPerf: x7('ने बात की थी'),
      pres: 'बात करता हूँ / बात करती हूँ ; बात करता है / बात करती है ; बात करता है / बात करती है ; बात करते हैं / बात करती हैं ; बात करते हो / बात करती हो ; बात करते हैं / बात करती हैं ; बात करते हैं / बात करती हैं',
      fut: 'बात करूँगा / बात करूँगी ; बात करेगा / बात करेगी ; बात करेगा / बात करेगी ; बात करेंगे / बात करेंगी ; बात करोगे / बात करोगी ; बात करेंगे / बात करेंगी ; बात करेंगे / बात करेंगी',
      imp: '- ; बात कर ; - ; बात करें ; बात करो ; बात कीजिए ; -',
      impNeg: '- ; बात मत कर ; - ; - ; बात मत करो ; बात मत कीजिए ; -',
    },
    rom: {
      past: x7('ne bāt kī'),
      presPerf: x7('ne bāt kī hai'),
      pastPerf: x7('ne bāt kī thī'),
      pres: 'bāt kartā hūṁ / bāt kartī hūṁ ; bāt kartā hai / bāt kartī hai ; bāt kartā hai / bāt kartī hai ; bāt karte haiṁ / bāt kartī haiṁ ; bāt karte ho / bāt kartī ho ; bāt karte haiṁ / bāt kartī haiṁ ; bāt karte haiṁ / bāt kartī haiṁ',
      fut: 'bāt karūṁgā / bāt karūṁgī ; bāt karegā / bāt karegī ; bāt karegā / bāt karegī ; bāt kareṁge / bāt kareṁgī ; bāt karoge / bāt karogī ; bāt kareṁge / bāt kareṁgī ; bāt kareṁge / bāt kareṁgī',
      imp: '- ; bāt kar ; - ; bāt kareṁ ; bāt karo ; bāt kījiye ; -',
      impNeg: '- ; bāt mat kar ; - ; - ; bāt mat karo ; bāt mat kījiye ; -',
    },
  },
  {
    // [a] with a participle in े as the citation form (डटे रहना): ḍaṭā / ḍaṭe / ḍaṭī
    verb: ['डटे रहना', 'ḍaṭe rahnā', 'a'],
    hi: {
      pres: 'डटा रहता हूँ / डटी रहती हूँ ; डटा रहता है / डटी रहती है ; डटा रहता है / डटी रहती है ; डटे रहते हैं / डटी रहती हैं ; डटे रहते हो / डटी रहती हो ; डटे रहते हैं / डटी रहती हैं ; डटे रहते हैं / डटी रहती हैं',
      past: x34('डटा रहा / डटी रही', 'डटे रहे / डटी रहीं'),
      fut: 'डटा रहूँगा / डटी रहूँगी ; डटा रहेगा / डटी रहेगी ; डटा रहेगा / डटी रहेगी ; डटे रहेंगे / डटी रहेंगी ; डटे रहोगे / डटी रहोगी ; डटे रहेंगे / डटी रहेंगी ; डटे रहेंगे / डटी रहेंगी',
      subj: 'डटा रहूँ ; डटा रहे ; डटा रहे ; डटे रहें ; डटे रहो ; डटे रहें ; डटे रहें',
      imp: '- ; डटा रह ; - ; डटे रहें ; डटे रहो ; डटे रहिए ; -',
      impNeg: '- ; डटा मत रह ; - ; - ; डटे मत रहो ; डटे मत रहिए ; -',
    },
    rom: {
      pres: 'ḍaṭā rahtā hūṁ / ḍaṭī rahtī hūṁ ; ḍaṭā rahtā hai / ḍaṭī rahtī hai ; ḍaṭā rahtā hai / ḍaṭī rahtī hai ; ḍaṭe rahte haiṁ / ḍaṭī rahtī haiṁ ; ḍaṭe rahte ho / ḍaṭī rahtī ho ; ḍaṭe rahte haiṁ / ḍaṭī rahtī haiṁ ; ḍaṭe rahte haiṁ / ḍaṭī rahtī haiṁ',
      past: x34('ḍaṭā rahā / ḍaṭī rahī', 'ḍaṭe rahe / ḍaṭī rahīṁ'),
      fut: 'ḍaṭā rahūṁgā / ḍaṭī rahūṁgī ; ḍaṭā rahegā / ḍaṭī rahegī ; ḍaṭā rahegā / ḍaṭī rahegī ; ḍaṭe raheṁge / ḍaṭī raheṁgī ; ḍaṭe rahoge / ḍaṭī rahogī ; ḍaṭe raheṁge / ḍaṭī raheṁgī ; ḍaṭe raheṁge / ḍaṭī raheṁgī',
      subj: 'ḍaṭā rahūṁ ; ḍaṭā rahe ; ḍaṭā rahe ; ḍaṭe raheṁ ; ḍaṭe raho ; ḍaṭe raheṁ ; ḍaṭe raheṁ',
      imp: '- ; ḍaṭā rah ; - ; ḍaṭe raheṁ ; ḍaṭe raho ; ḍaṭe rahiye ; -',
      impNeg: '- ; ḍaṭā mat rah ; - ; - ; ḍaṭe mat raho ; ḍaṭe mat rahiye ; -',
    },
  },
  {
    // [tp]: a masculine plural object noun (पैसे): the participle is plural (दिए), the auxiliary too
    verb: ['पैसे देना', 'paise denā', 'tp'],
    hi: {
      pres: 'पैसे देता हूँ / पैसे देती हूँ ; पैसे देता है / पैसे देती है ; पैसे देता है / पैसे देती है ; पैसे देते हैं / पैसे देती हैं ; पैसे देते हो / पैसे देती हो ; पैसे देते हैं / पैसे देती हैं ; पैसे देते हैं / पैसे देती हैं',
      presCont: 'पैसे दे रहा हूँ / पैसे दे रही हूँ ; पैसे दे रहा है / पैसे दे रही है ; पैसे दे रहा है / पैसे दे रही है ; पैसे दे रहे हैं / पैसे दे रही हैं ; पैसे दे रहे हो / पैसे दे रही हो ; पैसे दे रहे हैं / पैसे दे रही हैं ; पैसे दे रहे हैं / पैसे दे रही हैं',
      past: x7('ने पैसे दिए'),
      pastHab: x34('पैसे देता था / पैसे देती थी', 'पैसे देते थे / पैसे देती थीं'),
      pastCont: x34('पैसे दे रहा था / पैसे दे रही थी', 'पैसे दे रहे थे / पैसे दे रही थीं'),
      presPerf: x7('ने पैसे दिए हैं'),
      pastPerf: x7('ने पैसे दिए थे'),
      fut: 'पैसे दूँगा / पैसे दूँगी ; पैसे देगा / पैसे देगी ; पैसे देगा / पैसे देगी ; पैसे देंगे / पैसे देंगी ; पैसे दोगे / पैसे दोगी ; पैसे देंगे / पैसे देंगी ; पैसे देंगे / पैसे देंगी',
      subj: 'पैसे दूँ ; पैसे दे ; पैसे दे ; पैसे दें ; पैसे दो ; पैसे दें ; पैसे दें',
      imp: '- ; पैसे दे ; - ; पैसे दें ; पैसे दो ; पैसे दीजिए ; -',
      impNeg: '- ; पैसे मत दे ; - ; - ; पैसे मत दो ; पैसे मत दीजिए ; -',
    },
    rom: {
      pres: 'paise detā hūṁ / paise detī hūṁ ; paise detā hai / paise detī hai ; paise detā hai / paise detī hai ; paise dete haiṁ / paise detī haiṁ ; paise dete ho / paise detī ho ; paise dete haiṁ / paise detī haiṁ ; paise dete haiṁ / paise detī haiṁ',
      presCont: 'paise de rahā hūṁ / paise de rahī hūṁ ; paise de rahā hai / paise de rahī hai ; paise de rahā hai / paise de rahī hai ; paise de rahe haiṁ / paise de rahī haiṁ ; paise de rahe ho / paise de rahī ho ; paise de rahe haiṁ / paise de rahī haiṁ ; paise de rahe haiṁ / paise de rahī haiṁ',
      past: x7('ne paise die'),
      pastHab: x34('paise detā thā / paise detī thī', 'paise dete the / paise detī thīṁ'),
      pastCont: x34('paise de rahā thā / paise de rahī thī', 'paise de rahe the / paise de rahī thīṁ'),
      presPerf: x7('ne paise die haiṁ'),
      pastPerf: x7('ne paise die the'),
      fut: 'paise dūṁgā / paise dūṁgī ; paise degā / paise degī ; paise degā / paise degī ; paise deṁge / paise deṁgī ; paise doge / paise dogī ; paise deṁge / paise deṁgī ; paise deṁge / paise deṁgī',
      subj: 'paise dūṁ ; paise de ; paise de ; paise deṁ ; paise do ; paise deṁ ; paise deṁ',
      imp: '- ; paise de ; - ; paise deṁ ; paise do ; paise dījiye ; -',
      impNeg: '- ; paise mat de ; - ; - ; paise mat do ; paise mat dījiye ; -',
    },
  },
  {
    // [tfp]: a feminine plural object noun (आहें): simple past भरीं; the perfects भरी हैं / भरी थीं
    verb: ['आहें भरना', 'āheṁ bharnā', 'tfp'],
    hi: {
      pres: 'आहें भरता हूँ / आहें भरती हूँ ; आहें भरता है / आहें भरती है ; आहें भरता है / आहें भरती है ; आहें भरते हैं / आहें भरती हैं ; आहें भरते हो / आहें भरती हो ; आहें भरते हैं / आहें भरती हैं ; आहें भरते हैं / आहें भरती हैं',
      presCont: 'आहें भर रहा हूँ / आहें भर रही हूँ ; आहें भर रहा है / आहें भर रही है ; आहें भर रहा है / आहें भर रही है ; आहें भर रहे हैं / आहें भर रही हैं ; आहें भर रहे हो / आहें भर रही हो ; आहें भर रहे हैं / आहें भर रही हैं ; आहें भर रहे हैं / आहें भर रही हैं',
      past: x7('ने आहें भरीं'),
      pastHab: x34('आहें भरता था / आहें भरती थी', 'आहें भरते थे / आहें भरती थीं'),
      pastCont: x34('आहें भर रहा था / आहें भर रही थी', 'आहें भर रहे थे / आहें भर रही थीं'),
      presPerf: x7('ने आहें भरी हैं'),
      pastPerf: x7('ने आहें भरी थीं'),
      fut: 'आहें भरूँगा / आहें भरूँगी ; आहें भरेगा / आहें भरेगी ; आहें भरेगा / आहें भरेगी ; आहें भरेंगे / आहें भरेंगी ; आहें भरोगे / आहें भरोगी ; आहें भरेंगे / आहें भरेंगी ; आहें भरेंगे / आहें भरेंगी',
      subj: 'आहें भरूँ ; आहें भरे ; आहें भरे ; आहें भरें ; आहें भरो ; आहें भरें ; आहें भरें',
      imp: '- ; आहें भर ; - ; आहें भरें ; आहें भरो ; आहें भरिए ; -',
      impNeg: '- ; आहें मत भर ; - ; - ; आहें मत भरो ; आहें मत भरिए ; -',
    },
    rom: {
      pres: 'āheṁ bhartā hūṁ / āheṁ bhartī hūṁ ; āheṁ bhartā hai / āheṁ bhartī hai ; āheṁ bhartā hai / āheṁ bhartī hai ; āheṁ bharte haiṁ / āheṁ bhartī haiṁ ; āheṁ bharte ho / āheṁ bhartī ho ; āheṁ bharte haiṁ / āheṁ bhartī haiṁ ; āheṁ bharte haiṁ / āheṁ bhartī haiṁ',
      presCont: 'āheṁ bhar rahā hūṁ / āheṁ bhar rahī hūṁ ; āheṁ bhar rahā hai / āheṁ bhar rahī hai ; āheṁ bhar rahā hai / āheṁ bhar rahī hai ; āheṁ bhar rahe haiṁ / āheṁ bhar rahī haiṁ ; āheṁ bhar rahe ho / āheṁ bhar rahī ho ; āheṁ bhar rahe haiṁ / āheṁ bhar rahī haiṁ ; āheṁ bhar rahe haiṁ / āheṁ bhar rahī haiṁ',
      past: x7('ne āheṁ bharīṁ'),
      pastHab: x34('āheṁ bhartā thā / āheṁ bhartī thī', 'āheṁ bharte the / āheṁ bhartī thīṁ'),
      pastCont: x34('āheṁ bhar rahā thā / āheṁ bhar rahī thī', 'āheṁ bhar rahe the / āheṁ bhar rahī thīṁ'),
      presPerf: x7('ne āheṁ bharī haiṁ'),
      pastPerf: x7('ne āheṁ bharī thīṁ'),
      fut: 'āheṁ bharūṁgā / āheṁ bharūṁgī ; āheṁ bharegā / āheṁ bharegī ; āheṁ bharegā / āheṁ bharegī ; āheṁ bhareṁge / āheṁ bhareṁgī ; āheṁ bharoge / āheṁ bharogī ; āheṁ bhareṁge / āheṁ bhareṁgī ; āheṁ bhareṁge / āheṁ bhareṁgī',
      subj: 'āheṁ bharūṁ ; āheṁ bhare ; āheṁ bhare ; āheṁ bhareṁ ; āheṁ bharo ; āheṁ bhareṁ ; āheṁ bhareṁ',
      imp: '- ; āheṁ bhar ; - ; āheṁ bhareṁ ; āheṁ bharo ; āheṁ bhariye ; -',
      impNeg: '- ; āheṁ mat bhar ; - ; - ; āheṁ mat bharo ; āheṁ mat bhariye ; -',
    },
  },
  {
    // [s]: a stative compound होना is the copula (हकदार हूँ, हकदार था); no "become" tenses
    verb: ['हकदार होना', 'hakdār honā', 's'],
    hi: {
      pres: 'हकदार हूँ ; हकदार है ; हकदार है ; हकदार हैं ; हकदार हो ; हकदार हैं ; हकदार हैं',
      presCont: x7('-'),
      past: x34('हकदार था / हकदार थी', 'हकदार थे / हकदार थीं'),
      pastHab: x34('हकदार होता था / हकदार होती थी', 'हकदार होते थे / हकदार होती थीं'),
      pastCont: x7('-'),
      presPerf: x7('-'),
      pastPerf: x7('-'),
      fut: 'हकदार हूँगा / हकदार हूँगी ; हकदार होगा / हकदार होगी ; हकदार होगा / हकदार होगी ; हकदार होंगे / हकदार होंगी ; हकदार होगे / हकदार होगी ; हकदार होंगे / हकदार होंगी ; हकदार होंगे / हकदार होंगी',
      subj: 'हकदार हूँ ; हकदार हो ; हकदार हो ; हकदार हों ; हकदार हो ; हकदार हों ; हकदार हों',
      imp: '- ; हकदार हो ; - ; हकदार हों ; हकदार हो ; हकदार होइए ; -',
      impNeg: '- ; हकदार मत हो ; - ; - ; हकदार मत हो ; हकदार मत होइए ; -',
    },
    rom: {
      pres: 'hakdār hūṁ ; hakdār hai ; hakdār hai ; hakdār haiṁ ; hakdār ho ; hakdār haiṁ ; hakdār haiṁ',
      presCont: x7('-'),
      past: x34('hakdār thā / hakdār thī', 'hakdār the / hakdār thīṁ'),
      pastHab: x34('hakdār hotā thā / hakdār hotī thī', 'hakdār hote the / hakdār hotī thīṁ'),
      pastCont: x7('-'),
      presPerf: x7('-'),
      pastPerf: x7('-'),
      fut: 'hakdār hūṁgā / hakdār hūṁgī ; hakdār hogā / hakdār hogī ; hakdār hogā / hakdār hogī ; hakdār hoṁge / hakdār hoṁgī ; hakdār hoge / hakdār hogī ; hakdār hoṁge / hakdār hoṁgī ; hakdār hoṁge / hakdār hoṁgī',
      subj: 'hakdār hūṁ ; hakdār ho ; hakdār ho ; hakdār hoṁ ; hakdār ho ; hakdār hoṁ ; hakdār hoṁ',
      imp: '- ; hakdār ho ; - ; hakdār hoṁ ; hakdār ho ; hakdār hoiye ; -',
      impNeg: '- ; hakdār mat ho ; - ; - ; hakdār mat ho ; hakdār mat hoiye ; -',
    },
  },
  {
    // [sa]: a state whose leading participle agrees with the subject: बना हूँ / बनी हूँ
    verb: ['बना होना', 'banā honā', 'sa'],
    hi: {
      pres: 'बना हूँ / बनी हूँ ; बना है / बनी है ; बना है / बनी है ; बने हैं / बनी हैं ; बने हो / बनी हो ; बने हैं / बनी हैं ; बने हैं / बनी हैं',
      presCont: x7('-'),
      past: x34('बना था / बनी थी', 'बने थे / बनी थीं'),
      pastHab: x34('बना होता था / बनी होती थी', 'बने होते थे / बनी होती थीं'),
      pastCont: x7('-'),
      presPerf: x7('-'),
      pastPerf: x7('-'),
      fut: 'बना हूँगा / बनी हूँगी ; बना होगा / बनी होगी ; बना होगा / बनी होगी ; बने होंगे / बनी होंगी ; बने होगे / बनी होगी ; बने होंगे / बनी होंगी ; बने होंगे / बनी होंगी',
      subj: 'बना हूँ ; बना हो ; बना हो ; बने हों ; बने हो ; बने हों ; बने हों',
      imp: '- ; बना हो ; - ; बने हों ; बने हो ; बने होइए ; -',
      impNeg: '- ; बना मत हो ; - ; - ; बने मत हो ; बने मत होइए ; -',
    },
    rom: {
      pres: 'banā hūṁ / banī hūṁ ; banā hai / banī hai ; banā hai / banī hai ; bane haiṁ / banī haiṁ ; bane ho / banī ho ; bane haiṁ / banī haiṁ ; bane haiṁ / banī haiṁ',
      presCont: x7('-'),
      past: x34('banā thā / banī thī', 'bane the / banī thīṁ'),
      pastHab: x34('banā hotā thā / banī hotī thī', 'bane hote the / banī hotī thīṁ'),
      pastCont: x7('-'),
      presPerf: x7('-'),
      pastPerf: x7('-'),
      fut: 'banā hūṁgā / banī hūṁgī ; banā hogā / banī hogī ; banā hogā / banī hogī ; bane hoṁge / banī hoṁgī ; bane hoge / banī hogī ; bane hoṁge / banī hoṁgī ; bane hoṁge / banī hoṁgī',
      subj: 'banā hūṁ ; banā ho ; banā ho ; bane hoṁ ; bane ho ; bane hoṁ ; bane hoṁ',
      imp: '- ; banā ho ; - ; bane hoṁ ; bane ho ; bane hoiye ; -',
      impNeg: '- ; banā mat ho ; - ; - ; bane mat ho ; bane mat hoiye ; -',
    },
  },
  {
    // [d] with होना: the noun is the subject, only वह and वे; stative (ज़रूरत है / थी), no "become" tenses
    verb: ['ज़रूरत होना', 'zarūrat honā', 'd'],
    hi: {
      pres: third('ज़रूरत है', 'ज़रूरत हैं'),
      presCont: x7('-'),
      past: third('ज़रूरत था / ज़रूरत थी', 'ज़रूरत थे / ज़रूरत थीं'),
      pastHab: third('ज़रूरत होता था / ज़रूरत होती थी', 'ज़रूरत होते थे / ज़रूरत होती थीं'),
      pastCont: x7('-'),
      presPerf: x7('-'),
      pastPerf: x7('-'),
      fut: third('ज़रूरत होगा / ज़रूरत होगी', 'ज़रूरत होंगे / ज़रूरत होंगी'),
      subj: third('ज़रूरत हो', 'ज़रूरत हों'),
      imp: x7('-'),
      impNeg: x7('-'),
    },
    rom: {
      pres: third('zarūrat hai', 'zarūrat haiṁ'),
      presCont: x7('-'),
      past: third('zarūrat thā / zarūrat thī', 'zarūrat the / zarūrat thīṁ'),
      pastHab: third('zarūrat hotā thā / zarūrat hotī thī', 'zarūrat hote the / zarūrat hotī thīṁ'),
      pastCont: x7('-'),
      presPerf: x7('-'),
      pastPerf: x7('-'),
      fut: third('zarūrat hogā / zarūrat hogī', 'zarūrat hoṁge / zarūrat hoṁgī'),
      subj: third('zarūrat ho', 'zarūrat hoṁ'),
      imp: x7('-'),
      impNeg: x7('-'),
    },
  },
  {
    // [d] with another verb: the usual forms of लगना, in the third person only (मुझे डर लगता है)
    verb: ['डर लगना', 'ḍar lagnā', 'd'],
    hi: {
      pres: third('डर लगता है / डर लगती है', 'डर लगते हैं / डर लगती हैं'),
      presCont: third('डर लग रहा है / डर लग रही है', 'डर लग रहे हैं / डर लग रही हैं'),
      past: third('डर लगा / डर लगी', 'डर लगे / डर लगीं'),
      pastHab: third('डर लगता था / डर लगती थी', 'डर लगते थे / डर लगती थीं'),
      pastCont: third('डर लग रहा था / डर लग रही थी', 'डर लग रहे थे / डर लग रही थीं'),
      presPerf: third('डर लगा है / डर लगी है', 'डर लगे हैं / डर लगी हैं'),
      pastPerf: third('डर लगा था / डर लगी थी', 'डर लगे थे / डर लगी थीं'),
      fut: third('डर लगेगा / डर लगेगी', 'डर लगेंगे / डर लगेंगी'),
      subj: third('डर लगे', 'डर लगें'),
      imp: x7('-'),
      impNeg: x7('-'),
    },
    rom: {
      pres: third('ḍar lagtā hai / ḍar lagtī hai', 'ḍar lagte haiṁ / ḍar lagtī haiṁ'),
      presCont: third('ḍar lag rahā hai / ḍar lag rahī hai', 'ḍar lag rahe haiṁ / ḍar lag rahī haiṁ'),
      past: third('ḍar lagā / ḍar lagī', 'ḍar lage / ḍar lagīṁ'),
      pastHab: third('ḍar lagtā thā / ḍar lagtī thī', 'ḍar lagte the / ḍar lagtī thīṁ'),
      pastCont: third('ḍar lag rahā thā / ḍar lag rahī thī', 'ḍar lag rahe the / ḍar lag rahī thīṁ'),
      presPerf: third('ḍar lagā hai / ḍar lagī hai', 'ḍar lage haiṁ / ḍar lagī haiṁ'),
      pastPerf: third('ḍar lagā thā / ḍar lagī thī', 'ḍar lage the / ḍar lagī thīṁ'),
      fut: third('ḍar lagegā / ḍar lagegī', 'ḍar lageṁge / ḍar lageṁgī'),
      subj: third('ḍar lage', 'ḍar lageṁ'),
      imp: x7('-'),
      impNeg: x7('-'),
    },
  },
];

for (const { verb: [hi, rom, tag], hi: hiRows, rom: romRows } of FULL) {
  let result;
  try { result = express({ hi, rom, tag }); } catch (error) { failures.push(`${hi} ${rom}: express() threw "${error.message}"`); continue; }
  for (const [row, want] of Object.entries(hiRows)) same(`${hi}${tag ? ` [${tag}]` : ''} ${row} (script)`, formsOf(result, row, 'hi'), seven(want).join(' ; '));
  for (const [row, want] of Object.entries(romRows)) same(`${hi}${tag ? ` [${tag}]` : ''} ${row} (romanization)`, formsOf(result, row, 'rom'), seven(want).join(' ; '));
}

// ---- 2. Key forms of many verbs ------------------------------------------------------------
// [infinitive|romanization, tag, then eight forms as "script|romanization":
//  मैं habitual present, मैं past, वह future, मैं subjunctive, हम subjunctive (let us),
//  तू imperative, तुम imperative, आप imperative]. An empty string skips a form.
const KEY_ROWS = [['pres', 0], ['past', 0], ['fut', 2], ['subj', 0], ['subj', 3], ['imp', 1], ['imp', 4], ['imp', 5]];
const KEY_FORMS = [
  // consonant stems
  ['चलना|calnā', '', 'चलता हूँ / चलती हूँ|caltā hūṁ / caltī hūṁ', 'चला / चली|calā / calī', 'चलेगा / चलेगी|calegā / calegī', 'चलूँ|calūṁ', 'चलें|caleṁ', 'चल|cal', 'चलो|calo', 'चलिए|caliye'],
  ['बोलना|bolnā', 't', 'बोलता हूँ / बोलती हूँ|boltā hūṁ / boltī hūṁ', 'ने बोला|ne bolā', 'बोलेगा / बोलेगी|bolegā / bolegī', 'बोलूँ|bolūṁ', 'बोलें|boleṁ', 'बोल|bol', 'बोलो|bolo', 'बोलिए|boliye'],
  ['पढ़ना|paṛhnā', 't', 'पढ़ता हूँ / पढ़ती हूँ|paṛhtā hūṁ / paṛhtī hūṁ', 'ने पढ़ा|ne paṛhā', 'पढ़ेगा / पढ़ेगी|paṛhegā / paṛhegī', 'पढ़ूँ|paṛhūṁ', 'पढ़ें|paṛheṁ', 'पढ़|paṛh', 'पढ़ो|paṛho', 'पढ़िए|paṛhiye'],
  ['लिखना|likhnā', 't', 'लिखता हूँ / लिखती हूँ|likhtā hūṁ / likhtī hūṁ', 'ने लिखा|ne likhā', 'लिखेगा / लिखेगी|likhegā / likhegī', 'लिखूँ|likhūṁ', 'लिखें|likheṁ', 'लिख|likh', 'लिखो|likho', 'लिखिए|likhiye'],
  // the schwa of the last syllable of the stem is dropped in the reading before a vowel ending
  // (samjhā, not samajhā) but kept before a consonant ending (samajhtā) and in the bare stem (samajh)
  ['समझना|samajhnā', 't', 'समझता हूँ / समझती हूँ|samajhtā hūṁ / samajhtī hūṁ', 'ने समझा|ne samjhā', 'समझेगा / समझेगी|samjhegā / samjhegī', 'समझूँ|samjhūṁ', 'समझें|samjheṁ', 'समझ|samajh', 'समझो|samjho', 'समझिए|samjhiye'],
  ['निकलना|nikalnā', '', 'निकलता हूँ / निकलती हूँ|nikaltā hūṁ / nikaltī hūṁ', 'निकला / निकली|niklā / niklī', 'निकलेगा / निकलेगी|niklegā / niklegī', 'निकलूँ|niklūṁ', 'निकलें|nikleṁ', 'निकल|nikal', 'निकलो|niklo', 'निकलिए|nikliye'],
  ['बदलना|badalnā', 't', 'बदलता हूँ / बदलती हूँ|badaltā hūṁ / badaltī hūṁ', 'ने बदला|ne badlā', 'बदलेगा / बदलेगी|badlegā / badlegī', 'बदलूँ|badlūṁ', 'बदलें|badleṁ', 'बदल|badal', 'बदलो|badlo', 'बदलिए|badliye'],
  ['पहनना|pahannā', 't', 'पहनता हूँ / पहनती हूँ|pahantā hūṁ / pahantī hūṁ', 'ने पहना|ne pahnā', 'पहनेगा / पहनेगी|pahnegā / pahnegī', 'पहनूँ|pahnūṁ', 'पहनें|pahneṁ', 'पहन|pahan', 'पहनो|pahno', 'पहनिए|pahniye'],
  ['ठहरना|ṭhaharnā', '', 'ठहरता हूँ / ठहरती हूँ|ṭhahartā hūṁ / ṭhahartī hūṁ', 'ठहरा / ठहरी|ṭhahrā / ṭhahrī', 'ठहरेगा / ठहरेगी|ṭhahregā / ṭhahregī', 'ठहरूँ|ṭhahrūṁ', 'ठहरें|ṭhahreṁ', 'ठहर|ṭhahar', 'ठहरो|ṭhahro', 'ठहरिए|ṭhahriye'],
  ['पकड़ना|pakaṛnā', 't', 'पकड़ता हूँ / पकड़ती हूँ|pakaṛtā hūṁ / pakaṛtī hūṁ', 'ने पकड़ा|ne pakṛā', 'पकड़ेगा / पकड़ेगी|pakṛegā / pakṛegī', 'पकड़ूँ|pakṛūṁ', 'पकड़ें|pakṛeṁ', 'पकड़|pakaṛ', 'पकड़ो|pakṛo', 'पकड़िए|pakṛiye'],
  ['संभलना|saṁbhalnā', '', 'संभलता हूँ / संभलती हूँ|saṁbhaltā hūṁ / saṁbhaltī hūṁ', 'संभला / संभली|saṁbhlā / saṁbhlī', 'संभलेगा / संभलेगी|saṁbhlegā / saṁbhlegī', 'संभलूँ|saṁbhlūṁ', 'संभलें|saṁbhleṁ', 'संभल|saṁbhal', 'संभलो|saṁbhlo', 'संभलिए|saṁbhliye'],
  ['उभरना|ubharnā', '', 'उभरता हूँ / उभरती हूँ|ubhartā hūṁ / ubhartī hūṁ', 'उभरा / उभरी|ubhrā / ubhrī', 'उभरेगा / उभरेगी|ubhregā / ubhregī', 'उभरूँ|ubhrūṁ', 'उभरें|ubhreṁ', 'उभर|ubhar', 'उभरो|ubhro', 'उभरिए|ubhriye'],
  // [tf]: the participle agrees with a feminine object noun (की दी ली पी खोदी बनाई पाई खाई संभाली सेंकी)
  ['सलाह देना|salāh denā', 'tf', 'सलाह देता हूँ / सलाह देती हूँ|salāh detā hūṁ / salāh detī hūṁ', 'ने सलाह दी|ne salāh dī', 'सलाह देगा / सलाह देगी|salāh degā / salāh degī', 'सलाह दूँ|salāh dūṁ', 'सलाह दें|salāh deṁ', 'सलाह दे|salāh de', 'सलाह दो|salāh do', 'सलाह दीजिए|salāh dījiye'],
  ['सलाह लेना|salāh lenā', 'tf', 'सलाह लेता हूँ / सलाह लेती हूँ|salāh letā hūṁ / salāh letī hūṁ', 'ने सलाह ली|ne salāh lī', 'सलाह लेगा / सलाह लेगी|salāh legā / salāh legī', 'सलाह लूँ|salāh lūṁ', 'सलाह लें|salāh leṁ', 'सलाह ले|salāh le', 'सलाह लो|salāh lo', 'सलाह लीजिए|salāh lījiye'],
  ['शराब पीना|śarāb pīnā', 'tf', 'शराब पीता हूँ / शराब पीती हूँ|śarāb pītā hūṁ / śarāb pītī hūṁ', 'ने शराब पी|ne śarāb pī', 'शराब पिएगा / शराब पिएगी|śarāb piegā / śarāb piegī', 'शराब पिऊँ|śarāb piūṁ', 'शराब पिएँ|śarāb pieṁ', 'शराब पी|śarāb pī', 'शराब पियो|śarāb piyo', 'शराब पीजिए|śarāb pījiye'],
  ['सुरंग खोदना|suraṁg khodnā', 'tf', 'सुरंग खोदता हूँ / सुरंग खोदती हूँ|suraṁg khodtā hūṁ / suraṁg khodtī hūṁ', 'ने सुरंग खोदी|ne suraṁg khodī', 'सुरंग खोदेगा / सुरंग खोदेगी|suraṁg khodegā / suraṁg khodegī', 'सुरंग खोदूँ|suraṁg khodūṁ', 'सुरंग खोदें|suraṁg khodeṁ', 'सुरंग खोद|suraṁg khod', 'सुरंग खोदो|suraṁg khodo', 'सुरंग खोदिए|suraṁg khodiye'],
  ['योजना बनाना|yojanā banānā', 'tf', 'योजना बनाता हूँ / योजना बनाती हूँ|yojanā banātā hūṁ / yojanā banātī hūṁ', 'ने योजना बनाई|ne yojanā banāī', 'योजना बनाएगा / योजना बनाएगी|yojanā banāegā / yojanā banāegī', 'योजना बनाऊँ|yojanā banāūṁ', 'योजना बनाएँ|yojanā banāeṁ', 'योजना बना|yojanā banā', 'योजना बनाओ|yojanā banāo', 'योजना बनाइए|yojanā banāiye'],
  ['विजय पाना|vijay pānā', 'tf', 'विजय पाता हूँ / विजय पाती हूँ|vijay pātā hūṁ / vijay pātī hūṁ', 'ने विजय पाई|ne vijay pāī', 'विजय पाएगा / विजय पाएगी|vijay pāegā / vijay pāegī', 'विजय पाऊँ|vijay pāūṁ', 'विजय पाएँ|vijay pāeṁ', 'विजय पा|vijay pā', 'विजय पाओ|vijay pāo', 'विजय पाइए|vijay pāiye'],
  ['कमान संभालना|kamān saṁbhālnā', 'tf', 'कमान संभालता हूँ / कमान संभालती हूँ|kamān saṁbhāltā hūṁ / kamān saṁbhāltī hūṁ', 'ने कमान संभाली|ne kamān saṁbhālī', 'कमान संभालेगा / कमान संभालेगी|kamān saṁbhālegā / kamān saṁbhālegī', 'कमान संभालूँ|kamān saṁbhālūṁ', 'कमान संभालें|kamān saṁbhāleṁ', 'कमान संभाल|kamān saṁbhāl', 'कमान संभालो|kamān saṁbhālo', 'कमान संभालिए|kamān saṁbhāliye'],
  ['धूप सेंकना|dhūp seṁknā', 'tf', 'धूप सेंकता हूँ / धूप सेंकती हूँ|dhūp seṁktā hūṁ / dhūp seṁktī hūṁ', 'ने धूप सेंकी|ne dhūp seṁkī', 'धूप सेंकेगा / धूप सेंकेगी|dhūp seṁkegā / dhūp seṁkegī', 'धूप सेंकूँ|dhūp seṁkūṁ', 'धूप सेंकें|dhūp seṁkeṁ', 'धूप सेंक|dhūp seṁk', 'धूप सेंको|dhūp seṁko', 'धूप सेंकिए|dhūp seṁkiye'],
  // no schwa to drop: one syllable (cakhā), or a vowel other than a before the last consonant (sikuṛā, ṭhiṭhurā)
  ['चखना|cakhnā', 't', 'चखता हूँ / चखती हूँ|cakhtā hūṁ / cakhtī hūṁ', 'ने चखा|ne cakhā', 'चखेगा / चखेगी|cakhegā / cakhegī', 'चखूँ|cakhūṁ', 'चखें|cakheṁ', 'चख|cakh', 'चखो|cakho', 'चखिए|cakhiye'],
  ['सिकुड़ना|sikuṛnā', '', 'सिकुड़ता हूँ / सिकुड़ती हूँ|sikuṛtā hūṁ / sikuṛtī hūṁ', 'सिकुड़ा / सिकुड़ी|sikuṛā / sikuṛī', 'सिकुड़ेगा / सिकुड़ेगी|sikuṛegā / sikuṛegī', 'सिकुड़ूँ|sikuṛūṁ', 'सिकुड़ें|sikuṛeṁ', 'सिकुड़|sikuṛ', 'सिकुड़ो|sikuṛo', 'सिकुड़िए|sikuṛiye'],
  ['ठिठुरना|ṭhiṭhurnā', '', 'ठिठुरता हूँ / ठिठुरती हूँ|ṭhiṭhurtā hūṁ / ṭhiṭhurtī hūṁ', 'ठिठुरा / ठिठुरी|ṭhiṭhurā / ṭhiṭhurī', 'ठिठुरेगा / ठिठुरेगी|ṭhiṭhuregā / ṭhiṭhuregī', 'ठिठुरूँ|ṭhiṭhurūṁ', 'ठिठुरें|ṭhiṭhureṁ', 'ठिठुर|ṭhiṭhur', 'ठिठुरो|ṭhiṭhuro', 'ठिठुरिए|ṭhiṭhuriye'],
  ['खेलना|khelnā', 't', 'खेलता हूँ / खेलती हूँ|kheltā hūṁ / kheltī hūṁ', 'ने खेला|ne khelā', 'खेलेगा / खेलेगी|khelegā / khelegī', 'खेलूँ|khelūṁ', 'खेलें|kheleṁ', 'खेल|khel', 'खेलो|khelo', 'खेलिए|kheliye'],
  ['दौड़ना|dauṛnā', '', 'दौड़ता हूँ / दौड़ती हूँ|dauṛtā hūṁ / dauṛtī hūṁ', 'दौड़ा / दौड़ी|dauṛā / dauṛī', 'दौड़ेगा / दौड़ेगी|dauṛegā / dauṛegī', 'दौड़ूँ|dauṛūṁ', 'दौड़ें|dauṛeṁ', 'दौड़|dauṛ', 'दौड़ो|dauṛo', 'दौड़िए|dauṛiye'],
  ['रहना|rahnā', '', 'रहता हूँ / रहती हूँ|rahtā hūṁ / rahtī hūṁ', 'रहा / रही|rahā / rahī', 'रहेगा / रहेगी|rahegā / rahegī', 'रहूँ|rahūṁ', 'रहें|raheṁ', 'रह|rah', 'रहो|raho', 'रहिए|rahiye'],
  ['मरना|marnā', '', 'मरता हूँ / मरती हूँ|martā hūṁ / martī hūṁ', 'मरा / मरी|marā / marī', 'मरेगा / मरेगी|maregā / maregī', 'मरूँ|marūṁ', 'मरें|mareṁ', 'मर|mar', 'मरो|maro', 'मरिए|mariye'],
  ['कहना|kahnā', 't', 'कहता हूँ / कहती हूँ|kahtā hūṁ / kahtī hūṁ', 'ने कहा|ne kahā', 'कहेगा / कहेगी|kahegā / kahegī', 'कहूँ|kahūṁ', 'कहें|kaheṁ', 'कह|kah', 'कहो|kaho', 'कहिए|kahiye'],
  ['सुनना|sunnā', 't', 'सुनता हूँ / सुनती हूँ|suntā hūṁ / suntī hūṁ', 'ने सुना|ne sunā', 'सुनेगा / सुनेगी|sunegā / sunegī', 'सुनूँ|sunūṁ', 'सुनें|suneṁ', 'सुन|sun', 'सुनो|suno', 'सुनिए|suniye'],
  ['देखना|dekhnā', 't', 'देखता हूँ / देखती हूँ|dekhtā hūṁ / dekhtī hūṁ', 'ने देखा|ne dekhā', 'देखेगा / देखेगी|dekhegā / dekhegī', 'देखूँ|dekhūṁ', 'देखें|dekheṁ', 'देख|dekh', 'देखो|dekho', 'देखिए|dekhiye'],
  ['उठना|uṭhnā', '', 'उठता हूँ / उठती हूँ|uṭhtā hūṁ / uṭhtī hūṁ', 'उठा / उठी|uṭhā / uṭhī', 'उठेगा / उठेगी|uṭhegā / uṭhegī', 'उठूँ|uṭhūṁ', 'उठें|uṭheṁ', 'उठ|uṭh', 'उठो|uṭho', 'उठिए|uṭhiye'],
  ['बैठना|baiṭhnā', '', 'बैठता हूँ / बैठती हूँ|baiṭhtā hūṁ / baiṭhtī hūṁ', 'बैठा / बैठी|baiṭhā / baiṭhī', 'बैठेगा / बैठेगी|baiṭhegā / baiṭhegī', 'बैठूँ|baiṭhūṁ', 'बैठें|baiṭheṁ', 'बैठ|baiṭh', 'बैठो|baiṭho', 'बैठिए|baiṭhiye'],
  ['पहुँचना|pahuṁcnā', '', 'पहुँचता हूँ / पहुँचती हूँ|pahuṁctā hūṁ / pahuṁctī hūṁ', 'पहुँचा / पहुँची|pahuṁcā / pahuṁcī', 'पहुँचेगा / पहुँचेगी|pahuṁcegā / pahuṁcegī', 'पहुँचूँ|pahuṁcūṁ', 'पहुँचें|pahuṁceṁ', 'पहुँच|pahuṁc', 'पहुँचो|pahuṁco', 'पहुँचिए|pahuṁciye'],
  ['छोड़ना|choṛnā', 't', 'छोड़ता हूँ / छोड़ती हूँ|choṛtā hūṁ / choṛtī hūṁ', 'ने छोड़ा|ne choṛā', 'छोड़ेगा / छोड़ेगी|choṛegā / choṛegī', 'छोड़ूँ|choṛūṁ', 'छोड़ें|choṛeṁ', 'छोड़|choṛ', 'छोड़ो|choṛo', 'छोड़िए|choṛiye'],
  ['सीखना|sīkhnā', 't', 'सीखता हूँ / सीखती हूँ|sīkhtā hūṁ / sīkhtī hūṁ', 'ने सीखा|ne sīkhā', 'सीखेगा / सीखेगी|sīkhegā / sīkhegī', 'सीखूँ|sīkhūṁ', 'सीखें|sīkheṁ', 'सीख|sīkh', 'सीखो|sīkho', 'सीखिए|sīkhiye'],
  ['भेजना|bhejnā', 't', 'भेजता हूँ / भेजती हूँ|bhejtā hūṁ / bhejtī hūṁ', 'ने भेजा|ne bhejā', 'भेजेगा / भेजेगी|bhejegā / bhejegī', 'भेजूँ|bhejūṁ', 'भेजें|bhejeṁ', 'भेज|bhej', 'भेजो|bhejo', 'भेजिए|bhejiye'],
  ['खोलना|kholnā', 't', 'खोलता हूँ / खोलती हूँ|kholtā hūṁ / kholtī hūṁ', 'ने खोला|ne kholā', 'खोलेगा / खोलेगी|kholegā / kholegī', 'खोलूँ|kholūṁ', 'खोलें|kholeṁ', 'खोल|khol', 'खोलो|kholo', 'खोलिए|kholiye'],
  // stems in ा
  ['खाना|khānā', 't', 'खाता हूँ / खाती हूँ|khātā hūṁ / khātī hūṁ', 'ने खाया|ne khāyā', 'खाएगा / खाएगी|khāegā / khāegī', 'खाऊँ|khāūṁ', 'खाएँ|khāeṁ', 'खा|khā', 'खाओ|khāo', 'खाइए|khāiye'],
  ['लाना|lānā', 't', 'लाता हूँ / लाती हूँ|lātā hūṁ / lātī hūṁ', 'ने लाया|ne lāyā', 'लाएगा / लाएगी|lāegā / lāegī', 'लाऊँ|lāūṁ', 'लाएँ|lāeṁ', 'ला|lā', 'लाओ|lāo', 'लाइए|lāiye'],
  ['पाना|pānā', 't', 'पाता हूँ / पाती हूँ|pātā hūṁ / pātī hūṁ', 'ने पाया|ne pāyā', 'पाएगा / पाएगी|pāegā / pāegī', 'पाऊँ|pāūṁ', 'पाएँ|pāeṁ', 'पा|pā', 'पाओ|pāo', 'पाइए|pāiye'],
  ['गाना|gānā', 't', 'गाता हूँ / गाती हूँ|gātā hūṁ / gātī hūṁ', 'ने गाया|ne gāyā', 'गाएगा / गाएगी|gāegā / gāegī', 'गाऊँ|gāūṁ', 'गाएँ|gāeṁ', 'गा|gā', 'गाओ|gāo', 'गाइए|gāiye'],
  ['सताना|satānā', 't', 'सताता हूँ / सताती हूँ|satātā hūṁ / satātī hūṁ', 'ने सताया|ne satāyā', 'सताएगा / सताएगी|satāegā / satāegī', 'सताऊँ|satāūṁ', 'सताएँ|satāeṁ', 'सता|satā', 'सताओ|satāo', 'सताइए|satāiye'],
  ['बनाना|banānā', 't', 'बनाता हूँ / बनाती हूँ|banātā hūṁ / banātī hūṁ', 'ने बनाया|ne banāyā', 'बनाएगा / बनाएगी|banāegā / banāegī', 'बनाऊँ|banāūṁ', 'बनाएँ|banāeṁ', 'बना|banā', 'बनाओ|banāo', 'बनाइए|banāiye'],
  ['बताना|batānā', 't', 'बताता हूँ / बताती हूँ|batātā hūṁ / batātī hūṁ', 'ने बताया|ne batāyā', 'बताएगा / बताएगी|batāegā / batāegī', 'बताऊँ|batāūṁ', 'बताएँ|batāeṁ', 'बता|batā', 'बताओ|batāo', 'बताइए|batāiye'],
  ['दिखाना|dikhānā', 't', 'दिखाता हूँ / दिखाती हूँ|dikhātā hūṁ / dikhātī hūṁ', 'ने दिखाया|ne dikhāyā', 'दिखाएगा / दिखाएगी|dikhāegā / dikhāegī', 'दिखाऊँ|dikhāūṁ', 'दिखाएँ|dikhāeṁ', 'दिखा|dikhā', 'दिखाओ|dikhāo', 'दिखाइए|dikhāiye'],
  ['बुलाना|bulānā', 't', 'बुलाता हूँ / बुलाती हूँ|bulātā hūṁ / bulātī hūṁ', 'ने बुलाया|ne bulāyā', 'बुलाएगा / बुलाएगी|bulāegā / bulāegī', 'बुलाऊँ|bulāūṁ', 'बुलाएँ|bulāeṁ', 'बुला|bulā', 'बुलाओ|bulāo', 'बुलाइए|bulāiye'],
  ['समझाना|samjhānā', 't', 'समझाता हूँ / समझाती हूँ|samjhātā hūṁ / samjhātī hūṁ', 'ने समझाया|ne samjhāyā', 'समझाएगा / समझाएगी|samjhāegā / samjhāegī', 'समझाऊँ|samjhāūṁ', 'समझाएँ|samjhāeṁ', 'समझा|samjhā', 'समझाओ|samjhāo', 'समझाइए|samjhāiye'],
  ['चलाना|calānā', 't', 'चलाता हूँ / चलाती हूँ|calātā hūṁ / calātī hūṁ', 'ने चलाया|ne calāyā', 'चलाएगा / चलाएगी|calāegā / calāegī', 'चलाऊँ|calāūṁ', 'चलाएँ|calāeṁ', 'चला|calā', 'चलाओ|calāo', 'चलाइए|calāiye'],
  ['आज़माना|āzmānā', 't', 'आज़माता हूँ / आज़माती हूँ|āzmātā hūṁ / āzmātī hūṁ', 'ने आज़माया|ne āzmāyā', 'आज़माएगा / आज़माएगी|āzmāegā / āzmāegī', 'आज़माऊँ|āzmāūṁ', 'आज़माएँ|āzmāeṁ', 'आज़मा|āzmā', 'आज़माओ|āzmāo', 'आज़माइए|āzmāiye'],
  ['आना|ānā', '', 'आता हूँ / आती हूँ|ātā hūṁ / ātī hūṁ', 'आया / आई|āyā / āī', 'आएगा / आएगी|āegā / āegī', 'आऊँ|āūṁ', 'आएँ|āeṁ', 'आ|ā', 'आओ|āo', 'आइए|āiye'],
  ['जाना|jānā', '', 'जाता हूँ / जाती हूँ|jātā hūṁ / jātī hūṁ', 'गया / गई|gayā / gaī', 'जाएगा / जाएगी|jāegā / jāegī', 'जाऊँ|jāūṁ', 'जाएँ|jāeṁ', 'जा|jā', 'जाओ|jāo', 'जाइए|jāiye'],
  // stems in ी, ू, ो, े and the irregular verbs
  ['पीना|pīnā', 't', 'पीता हूँ / पीती हूँ|pītā hūṁ / pītī hūṁ', 'ने पिया|ne piyā', 'पिएगा / पिएगी|piegā / piegī', 'पिऊँ|piūṁ', 'पिएँ|pieṁ', 'पी|pī', 'पियो|piyo', 'पीजिए|pījiye'],
  ['जीना|jīnā', '', 'जीता हूँ / जीती हूँ|jītā hūṁ / jītī hūṁ', 'जिया / जी|jiyā / jī', 'जिएगा / जिएगी|jiegā / jiegī', 'जिऊँ|jiūṁ', 'जिएँ|jieṁ', 'जी|jī', 'जियो|jiyo', 'जीजिए|jījiye'],
  ['सीना|sīnā', 't', 'सीता हूँ / सीती हूँ|sītā hūṁ / sītī hūṁ', 'ने सिया|ne siyā', 'सिएगा / सिएगी|siegā / siegī', 'सिऊँ|siūṁ', 'सिएँ|sieṁ', 'सी|sī', 'सियो|siyo', 'सीजिए|sījiye'],
  ['छूना|chūnā', 't', 'छूता हूँ / छूती हूँ|chūtā hūṁ / chūtī hūṁ', 'ने छुआ|ne chuā', 'छुएगा / छुएगी|chuegā / chuegī', 'छुऊँ|chuūṁ', 'छुएँ|chueṁ', 'छू|chū', 'छुओ|chuo', ''],
  ['सोना|sonā', '', 'सोता हूँ / सोती हूँ|sotā hūṁ / sotī hūṁ', 'सोया / सोई|soyā / soī', 'सोएगा / सोएगी|soegā / soegī', 'सोऊँ|soūṁ', 'सोएँ|soeṁ', 'सो|so', 'सोओ|soo', 'सोइए|soiye'],
  ['रोना|ronā', '', 'रोता हूँ / रोती हूँ|rotā hūṁ / rotī hūṁ', 'रोया / रोई|royā / roī', 'रोएगा / रोएगी|roegā / roegī', 'रोऊँ|roūṁ', 'रोएँ|roeṁ', 'रो|ro', 'रोओ|roo', 'रोइए|roiye'],
  ['धोना|dhonā', 't', 'धोता हूँ / धोती हूँ|dhotā hūṁ / dhotī hūṁ', 'ने धोया|ne dhoyā', 'धोएगा / धोएगी|dhoegā / dhoegī', 'धोऊँ|dhoūṁ', 'धोएँ|dhoeṁ', 'धो|dho', 'धोओ|dhoo', 'धोइए|dhoiye'],
  ['खोना|khonā', 't', 'खोता हूँ / खोती हूँ|khotā hūṁ / khotī hūṁ', 'ने खोया|ne khoyā', 'खोएगा / खोएगी|khoegā / khoegī', 'खोऊँ|khoūṁ', 'खोएँ|khoeṁ', 'खो|kho', 'खोओ|khoo', 'खोइए|khoiye'],
  ['बोना|bonā', 't', 'बोता हूँ / बोती हूँ|botā hūṁ / botī hūṁ', 'ने बोया|ne boyā', 'बोएगा / बोएगी|boegā / boegī', 'बोऊँ|boūṁ', 'बोएँ|boeṁ', 'बो|bo', 'बोओ|boo', 'बोइए|boiye'],
  ['देना|denā', 't', 'देता हूँ / देती हूँ|detā hūṁ / detī hūṁ', 'ने दिया|ne diyā', 'देगा / देगी|degā / degī', 'दूँ|dūṁ', 'दें|deṁ', 'दे|de', 'दो|do', 'दीजिए|dījiye'],
  ['लेना|lenā', 't', 'लेता हूँ / लेती हूँ|letā hūṁ / letī hūṁ', 'ने लिया|ne liyā', 'लेगा / लेगी|legā / legī', 'लूँ|lūṁ', 'लें|leṁ', 'ले|le', 'लो|lo', 'लीजिए|lījiye'],
  ['होना|honā', '', 'हूँ|hūṁ', 'था / थी|thā / thī', 'होगा / होगी|hogā / hogī', 'हूँ|hūṁ', 'हों|hoṁ', 'हो|ho', 'हो|ho', 'होइए|hoiye'],
  ['करना|karnā', 't', 'करता हूँ / करती हूँ|kartā hūṁ / kartī hūṁ', 'ने किया|ne kiyā', 'करेगा / करेगी|karegā / karegī', 'करूँ|karūṁ', 'करें|kareṁ', 'कर|kar', 'करो|karo', 'कीजिए|kījiye'],
  // compounds: only the last word is conjugated
  ['काम करना|kām karnā', 't', 'काम करता हूँ / काम करती हूँ|kām kartā hūṁ / kām kartī hūṁ', 'ने काम किया|ne kām kiyā', 'काम करेगा / काम करेगी|kām karegā / kām karegī', 'काम करूँ|kām karūṁ', 'काम करें|kām kareṁ', 'काम कर|kām kar', 'काम करो|kām karo', 'काम कीजिए|kām kījiye'],
  ['इंतज़ार करना|iṁtazār karnā', 't', 'इंतज़ार करता हूँ / इंतज़ार करती हूँ|iṁtazār kartā hūṁ / iṁtazār kartī hūṁ', 'ने इंतज़ार किया|ne iṁtazār kiyā', 'इंतज़ार करेगा / इंतज़ार करेगी|iṁtazār karegā / iṁtazār karegī', 'इंतज़ार करूँ|iṁtazār karūṁ', 'इंतज़ार करें|iṁtazār kareṁ', 'इंतज़ार कर|iṁtazār kar', 'इंतज़ार करो|iṁtazār karo', 'इंतज़ार कीजिए|iṁtazār kījiye'],
  ['प्रयोग करना|prayog karnā', 't', 'प्रयोग करता हूँ / प्रयोग करती हूँ|prayog kartā hūṁ / prayog kartī hūṁ', 'ने प्रयोग किया|ne prayog kiyā', 'प्रयोग करेगा / प्रयोग करेगी|prayog karegā / prayog karegī', 'प्रयोग करूँ|prayog karūṁ', 'प्रयोग करें|prayog kareṁ', 'प्रयोग कर|prayog kar', 'प्रयोग करो|prayog karo', 'प्रयोग कीजिए|prayog kījiye'],
  ['बात करना|bāt karnā', 't', 'बात करता हूँ / बात करती हूँ|bāt kartā hūṁ / bāt kartī hūṁ', '', 'बात करेगा / बात करेगी|bāt karegā / bāt karegī', 'बात करूँ|bāt karūṁ', 'बात करें|bāt kareṁ', 'बात कर|bāt kar', 'बात करो|bāt karo', 'बात कीजिए|bāt kījiye'],
  ['मदद करना|madad karnā', 't', 'मदद करता हूँ / मदद करती हूँ|madad kartā hūṁ / madad kartī hūṁ', '', 'मदद करेगा / मदद करेगी|madad karegā / madad karegī', 'मदद करूँ|madad karūṁ', 'मदद करें|madad kareṁ', 'मदद कर|madad kar', 'मदद करो|madad karo', 'मदद कीजिए|madad kījiye'],
  ['शुरू करना|śurū karnā', 't', 'शुरू करता हूँ / शुरू करती हूँ|śurū kartā hūṁ / śurū kartī hūṁ', 'ने शुरू किया|ne śurū kiyā', 'शुरू करेगा / शुरू करेगी|śurū karegā / śurū karegī', 'शुरू करूँ|śurū karūṁ', 'शुरू करें|śurū kareṁ', 'शुरू कर|śurū kar', 'शुरू करो|śurū karo', 'शुरू कीजिए|śurū kījiye'],
  ['फ़ैसला करना|faislā karnā', 't', 'फ़ैसला करता हूँ / फ़ैसला करती हूँ|faislā kartā hūṁ / faislā kartī hūṁ', 'ने फ़ैसला किया|ne faislā kiyā', 'फ़ैसला करेगा / फ़ैसला करेगी|faislā karegā / faislā karegī', 'फ़ैसला करूँ|faislā karūṁ', 'फ़ैसला करें|faislā kareṁ', 'फ़ैसला कर|faislā kar', 'फ़ैसला करो|faislā karo', 'फ़ैसला कीजिए|faislā kījiye'],
  ['क्षमा करना|kṣamā karnā', 't', 'क्षमा करता हूँ / क्षमा करती हूँ|kṣamā kartā hūṁ / kṣamā kartī hūṁ', '', 'क्षमा करेगा / क्षमा करेगी|kṣamā karegā / kṣamā karegī', 'क्षमा करूँ|kṣamā karūṁ', 'क्षमा करें|kṣamā kareṁ', 'क्षमा कर|kṣamā kar', 'क्षमा करो|kṣamā karo', 'क्षमा कीजिए|kṣamā kījiye'],
  ['खुश होना|khuś honā', '', 'खुश होता हूँ / खुश होती हूँ|khuś hotā hūṁ / khuś hotī hūṁ', 'खुश हुआ / खुश हुई|khuś huā / khuś huī', 'खुश होगा / खुश होगी|khuś hogā / khuś hogī', 'खुश हूँ|khuś hūṁ', 'खुश हों|khuś hoṁ', 'खुश हो|khuś ho', 'खुश हो|khuś ho', 'खुश होइए|khuś hoiye'],
  ['तैयार होना|taiyār honā', '', 'तैयार होता हूँ / तैयार होती हूँ|taiyār hotā hūṁ / taiyār hotī hūṁ', 'तैयार हुआ / तैयार हुई|taiyār huā / taiyār huī', 'तैयार होगा / तैयार होगी|taiyār hogā / taiyār hogī', 'तैयार हूँ|taiyār hūṁ', 'तैयार हों|taiyār hoṁ', 'तैयार हो|taiyār ho', 'तैयार हो|taiyār ho', 'तैयार होइए|taiyār hoiye'],
  ['जवाब देना|javāb denā', 't', 'जवाब देता हूँ / जवाब देती हूँ|javāb detā hūṁ / javāb detī hūṁ', 'ने जवाब दिया|ne javāb diyā', 'जवाब देगा / जवाब देगी|javāb degā / javāb degī', 'जवाब दूँ|javāb dūṁ', 'जवाब दें|javāb deṁ', 'जवाब दे|javāb de', 'जवाब दो|javāb do', 'जवाब दीजिए|javāb dījiye'],
  ['ध्यान देना|dhyān denā', 't', 'ध्यान देता हूँ / ध्यान देती हूँ|dhyān detā hūṁ / dhyān detī hūṁ', 'ने ध्यान दिया|ne dhyān diyā', 'ध्यान देगा / ध्यान देगी|dhyān degā / dhyān degī', 'ध्यान दूँ|dhyān dūṁ', 'ध्यान दें|dhyān deṁ', 'ध्यान दे|dhyān de', 'ध्यान दो|dhyān do', 'ध्यान दीजिए|dhyān dījiye'],
  ['बदला लेना|badlā lenā', 't', 'बदला लेता हूँ / बदला लेती हूँ|badlā letā hūṁ / badlā letī hūṁ', 'ने बदला लिया|ne badlā liyā', 'बदला लेगा / बदला लेगी|badlā legā / badlā legī', 'बदला लूँ|badlā lūṁ', 'बदला लें|badlā leṁ', 'बदला ले|badlā le', 'बदला लो|badlā lo', 'बदला लीजिए|badlā lījiye'],
  ['याद आना|yād ānā', '', 'याद आता हूँ / याद आती हूँ|yād ātā hūṁ / yād ātī hūṁ', 'याद आया / याद आई|yād āyā / yād āī', 'याद आएगा / याद आएगी|yād āegā / yād āegī', 'याद आऊँ|yād āūṁ', 'याद आएँ|yād āeṁ', 'याद आ|yād ā', 'याद आओ|yād āo', 'याद आइए|yād āiye'],
  ['ज़िंदा रहना|ziṁdā rahnā', '', 'ज़िंदा रहता हूँ / ज़िंदा रहती हूँ|ziṁdā rahtā hūṁ / ziṁdā rahtī hūṁ', 'ज़िंदा रहा / ज़िंदा रही|ziṁdā rahā / ziṁdā rahī', 'ज़िंदा रहेगा / ज़िंदा रहेगी|ziṁdā rahegā / ziṁdā rahegī', 'ज़िंदा रहूँ|ziṁdā rahūṁ', 'ज़िंदा रहें|ziṁdā raheṁ', 'ज़िंदा रह|ziṁdā rah', 'ज़िंदा रहो|ziṁdā raho', 'ज़िंदा रहिए|ziṁdā rahiye'],
];

const keyVerbs = new Set();
for (const [verb, tag, ...cells] of KEY_FORMS) {
  const [hi, rom] = verb.split('|');
  keyVerbs.add(hi);
  let result;
  try { result = express({ hi, rom, tag }); } catch (error) { failures.push(`${hi} ${rom}: express() threw "${error.message}"`); continue; }
  KEY_ROWS.forEach(([row, person], i) => {
    if (!cells[i]) return;
    const [wantHi, wantRom] = cells[i].split('|');
    const cell = result.rows[row][person];
    same(`${hi}${tag ? ` [${tag}]` : ''} ${row}[${person}] (script)`, cell ? cell.hi : null, wantHi);
    same(`${hi}${tag ? ` [${tag}]` : ''} ${row}[${person}] (romanization)`, cell ? cell.rom : null, wantRom);
  });
}
// ---- 2b. Plural objects: [tp] (masculine) and [tfp] (feminine) with every stem class ----------------
// [infinitive|romanization, tag, simple past, present perfect, past perfect], each as "script|romanization".
// With a plural object noun the participle is plural: ने पैसे दिए; the feminine plural is used in the
// simple past only (ने आहें भरीं): the perfects have the feminine singular participle and a plural
// auxiliary (ने आहें भरी हैं, ने आहें भरी थीं).
const PLURAL_OBJECTS = [
  ['कपड़े पहनना|kapṛe pahannā', 'tp', 'ने कपड़े पहने|ne kapṛe pahne', 'ने कपड़े पहने हैं|ne kapṛe pahne haiṁ', 'ने कपड़े पहने थे|ne kapṛe pahne the'],
  ['कपड़े उतारना|kapṛe utārnā', 'tp', 'ने कपड़े उतारे|ne kapṛe utāre', 'ने कपड़े उतारे हैं|ne kapṛe utāre haiṁ', 'ने कपड़े उतारे थे|ne kapṛe utāre the'],
  ['नारे लगाना|nāre lagānā', 'tp', 'ने नारे लगाए|ne nāre lagāe', 'ने नारे लगाए हैं|ne nāre lagāe haiṁ', 'ने नारे लगाए थे|ne nāre lagāe the'],
  ['बाल धोना|bāl dhonā', 'tp', 'ने बाल धोए|ne bāl dhoe', 'ने बाल धोए हैं|ne bāl dhoe haiṁ', 'ने बाल धोए थे|ne bāl dhoe the'],
  ['टुकड़े करना|ṭukṛe karnā', 'tp', 'ने टुकड़े किए|ne ṭukṛe kie', 'ने टुकड़े किए हैं|ne ṭukṛe kie haiṁ', 'ने टुकड़े किए थे|ne ṭukṛe kie the'],
  ['पैसे लेना|paise lenā', 'tp', 'ने पैसे लिए|ne paise lie', 'ने पैसे लिए हैं|ne paise lie haiṁ', 'ने पैसे लिए थे|ne paise lie the'],
  ['आँसू पीना|āṁsū pīnā', 'tp', 'ने आँसू पिए|ne āṁsū pie', 'ने आँसू पिए हैं|ne āṁsū pie haiṁ', 'ने आँसू पिए थे|ne āṁsū pie the'],
  ['गालियाँ देना|gāliyāṁ denā', 'tfp', 'ने गालियाँ दीं|ne gāliyāṁ dīṁ', 'ने गालियाँ दी हैं|ne gāliyāṁ dī haiṁ', 'ने गालियाँ दी थीं|ne gāliyāṁ dī thīṁ'],
  ['हिलोरें लेना|hiloreṁ lenā', 'tfp', 'ने हिलोरें लीं|ne hiloreṁ līṁ', 'ने हिलोरें ली हैं|ne hiloreṁ lī haiṁ', 'ने हिलोरें ली थीं|ne hiloreṁ lī thīṁ'],
  ['बेड़ियाँ डालना|beṛiyāṁ ḍālnā', 'tfp', 'ने बेड़ियाँ डालीं|ne beṛiyāṁ ḍālīṁ', 'ने बेड़ियाँ डाली हैं|ne beṛiyāṁ ḍālī haiṁ', 'ने बेड़ियाँ डाली थीं|ne beṛiyāṁ ḍālī thīṁ'],
  ['आँखें सिकोड़ना|āṁkheṁ sikoṛnā', 'tfp', 'ने आँखें सिकोड़ीं|ne āṁkheṁ sikoṛīṁ', 'ने आँखें सिकोड़ी हैं|ne āṁkheṁ sikoṛī haiṁ', 'ने आँखें सिकोड़ी थीं|ne āṁkheṁ sikoṛī thīṁ'],
  ['किरचें बनाना|kirceṁ banānā', 'tfp', 'ने किरचें बनाईं|ne kirceṁ banāīṁ', 'ने किरचें बनाई हैं|ne kirceṁ banāī haiṁ', 'ने किरचें बनाई थीं|ne kirceṁ banāī thīṁ'],
  ['कसमें खाना|kasmeṁ khānā', 'tfp', 'ने कसमें खाईं|ne kasmeṁ khāīṁ', 'ने कसमें खाई हैं|ne kasmeṁ khāī haiṁ', 'ने कसमें खाई थीं|ne kasmeṁ khāī thīṁ'],
];
for (const [verb, tag, ...cells] of PLURAL_OBJECTS) {
  const [hi, rom] = verb.split('|');
  keyVerbs.add(hi);
  let result;
  try { result = express({ hi, rom, tag }); } catch (error) { failures.push(`${hi} ${rom}: express() threw "${error.message}"`); continue; }
  ['past', 'presPerf', 'pastPerf'].forEach((row, i) => {
    const [wantHi, wantRom] = cells[i].split('|');
    for (let person = 0; person < 7; person++) {
      same(`${hi} [${tag}] ${row}[${person}] (script)`, result.rows[row][person].hi, wantHi);
      same(`${hi} [${tag}] ${row}[${person}] (romanization)`, result.rows[row][person].rom, wantRom);
    }
  });
}

for (const [hi] of FULL.map(f => [f.verb[0]])) keyVerbs.add(hi);
same('the tests cover at least 60 distinct verbs', keyVerbs.size >= 60, true);
same('the tests spell out whole rows for at least 12 verbs', new Set(FULL.map(f => f.verb[0])).size >= 12, true);

// ---- 3. Structure of the output ------------------------------------------------------------

same('the 11 row keys, in order', ROW_KEYS.join(' '), 'pres presCont past pastHab pastCont presPerf pastPerf fut subj imp impNeg');
{
  const shown = express({ hi: 'काम  करना', rom: 'kām karnā', tag: 't' });
  same('display of a compound (hi)', shown.hi, 'काम करना');
  same('display of a compound (rom)', shown.rom, 'kām karnā');
  same('the result has hi, rom and rows only', Object.keys(shown).join(' '), 'hi rom rows');
  same('the rows have exactly the 11 keys, in order', Object.keys(shown.rows).join(' '), ROW_KEYS.join(' '));
}
// which persons have no form: the imperative has only तू, हम, तुम, आप; मत + imperative has no हम
const NULL_PERSONS = { imp: [0, 2, 6], impNeg: [0, 2, 3, 6] };
for (const [hi, rom, tag] of [['करना', 'karnā', 't'], ['जाना', 'jānā', ''], ['होना', 'honā', ''], ['पीना', 'pīnā', 't'], ['काम करना', 'kām karnā', 't']]) {
  const result = express({ hi, rom, tag });
  for (const key of ROW_KEYS) {
    const nulls = result.rows[key].map((cell, p) => (cell === null ? p : -1)).filter(p => p >= 0);
    same(`${hi} ${key}: seven cells`, result.rows[key].length, 7);
    same(`${hi} ${key}: the persons without a form`, nulls.join(','), (NULL_PERSONS[key] || []).join(','));
  }
}
// gender: which rows join a masculine and a feminine form (exactly one " / " per cell)
const GENDERED = new Set(['pres', 'presCont', 'pastHab', 'pastCont', 'fut']);
for (const [hi, rom, tag] of [['करना', 'karnā', 't'], ['जाना', 'jānā', ''], ['खाना', 'khānā', ''], ['खुश होना', 'khuś honā', '']]) {
  const result = express({ hi, rom, tag });
  for (const key of ROW_KEYS) {
    const gendered = GENDERED.has(key) || (!tag && ['past', 'presPerf', 'pastPerf'].includes(key));
    for (const cell of result.rows[key]) {
      if (!cell) continue;
      same(`${hi} ${key}: "${cell.hi}" slashes`, cell.hi.split(' / ').length, gendered ? 2 : 1);
    }
  }
}
// a verb with [t] never shows a gendered perfect; the same verb without the tag does
same('[t] verbs show ने in the past', express({ hi: 'खाना', rom: 'khānā', tag: 't' }).rows.past[3].hi, 'ने खाया');
same('the tag is optional (missing means intransitive)', express({ hi: 'खाना', rom: 'khānā' }).rows.past[0].hi, 'खाया / खाई');

// the tags [tp] [tfp] [s] [sa] [d]: which cells exist
{
  const formsAt = (result, key) => result.rows[key].map((cell, p) => (cell ? p : -1)).filter(p => p >= 0).join(',');
  const all = '0,1,2,3,4,5,6';
  // [tp] and [tfp] have the shape of [t]: seven forms in the past and the perfects, and no gender slash there
  for (const [hi, rom, tag] of [['पैसे देना', 'paise denā', 'tp'], ['आहें भरना', 'āheṁ bharnā', 'tfp']]) {
    const result = express({ hi, rom, tag });
    for (const key of ROW_KEYS) same(`${hi} [${tag}] ${key}: the persons with a form`, formsAt(result, key), NULL_PERSONS[key] ? [0, 1, 2, 3, 4, 5, 6].filter(p => !NULL_PERSONS[key].includes(p)).join(',') : all);
    for (const key of ['past', 'presPerf', 'pastPerf']) result.rows[key].forEach((cell, p) => same(`${hi} [${tag}] ${key}[${p}]: no gender slash`, cell.hi.split(' / ').length, 1));
  }
  // [s] and [sa]: the "become" tenses have no form at all; the other rows have seven persons
  for (const [hi, rom, tag] of [['हकदार होना', 'hakdār honā', 's'], ['बना होना', 'banā honā', 'sa'], ['मौजूद होना', 'maujūd honā', 's']]) {
    const result = express({ hi, rom, tag });
    for (const key of ['presCont', 'pastCont', 'presPerf', 'pastPerf']) same(`${hi} [${tag}] ${key}: no form for any person`, formsAt(result, key), '');
    for (const key of ['pres', 'past', 'pastHab', 'fut', 'subj']) same(`${hi} [${tag}] ${key}: seven persons`, formsAt(result, key), all);
    same(`${hi} [${tag}] imp: only तू हम तुम आप`, formsAt(result, 'imp'), '1,3,4,5');
    // the copula has no gender unless the leading word agrees with the subject ([sa])
    result.rows.pres.forEach((cell, p) => same(`${hi} [${tag}] pres[${p}]: slashes`, cell.hi.split(' / ').length, tag === 'sa' ? 2 : 1));
    result.rows.past.forEach((cell, p) => same(`${hi} [${tag}] past[${p}]: slashes`, cell.hi.split(' / ').length, 2));
  }
  // the same words without the tag are still "become": खुश होता हूँ
  same('हकदार होना without [s] is "become"', express({ hi: 'हकदार होना', rom: 'hakdār honā' }).rows.pres[0].hi, 'हकदार होता हूँ / हकदार होती हूँ');
  same('हकदार होना without [s] has the become tenses', express({ hi: 'हकदार होना', rom: 'hakdār honā' }).rows.presCont[0].hi, 'हकदार हो रहा हूँ / हकदार हो रही हूँ');
  same('a bare होना keeps its become tenses', express({ hi: 'होना', rom: 'honā' }).rows.presPerf[0].hi, 'हुआ हूँ / हुई हूँ');
  // [d]: only वह and वे, in every row; imp and impNeg are empty; with होना the become tenses are empty too
  for (const [hi, rom, empty] of [['ज़रूरत होना', 'zarūrat honā', ['presCont', 'pastCont', 'presPerf', 'pastPerf', 'imp', 'impNeg']], ['डर लगना', 'ḍar lagnā', ['imp', 'impNeg']], ['बाढ़ आना', 'bāṛh ānā', ['imp', 'impNeg']], ['याद आना', 'yād ānā', ['imp', 'impNeg']]]) {
    const result = express({ hi, rom, tag: 'd' });
    for (const key of ROW_KEYS) same(`${hi} [d] ${key}: the persons with a form`, formsAt(result, key), empty.includes(key) ? '' : '2,6');
  }
  same('[d] with होना: ज़रूरत है', express({ hi: 'ज़रूरत होना', rom: 'zarūrat honā', tag: 'd' }).rows.pres[2].hi, 'ज़रूरत है');
  same('[d] with another verb: बाढ़ आई', express({ hi: 'बाढ़ आना', rom: 'bāṛh ānā', tag: 'd' }).rows.past[2].hi, 'बाढ़ आया / बाढ़ आई');
  same('[d] with another verb: याद आती है', express({ hi: 'याद आना', rom: 'yād ānā', tag: 'd' }).rows.pres[2].hi, 'याद आता है / याद आती है');
  same('[d] cells have no pronoun', express({ hi: 'डर लगना', rom: 'ḍar lagnā', tag: 'd' }).rows.pres[6].hi, 'डर लगते हैं / डर लगती हैं');
}

// ---- 4. Entries that must be refused ---------------------------------------------------------

throwsWith('an infinitive must end in ना', { hi: 'कर', rom: 'kar', tag: '' }, /not an infinitive/);
throwsWith('the last word of a compound must end in ना', { hi: 'करना काम', rom: 'karnā kām', tag: '' }, /not an infinitive/);
throwsWith('the romanization must end in nā', { hi: 'करना', rom: 'kar', tag: '' }, /not an infinitive romanization/);
throwsWith('word counts must agree', { hi: 'काम करना', rom: 'karnā', tag: 't' }, /different numbers of words/);
throwsWith('a stem in े that is not देना or लेना', { hi: 'खेना', rom: 'khenā', tag: '' }, /unsupported stem/);
throwsWith('a stem in a short vowel sign (ु)', { hi: 'कुना', rom: 'kunā', tag: '' }, /unsupported stem/);
throwsWith('a stem in ै', { hi: 'कैना', rom: 'kainā', tag: '' }, /unsupported stem/);
throwsWith('a stem in ि', { hi: 'किना', rom: 'kinā', tag: '' }, /unsupported stem/);
throwsWith('a stem ending in a nasal sign', { hi: 'कँना', rom: 'kaṁnā', tag: '' }, /unsupported stem/);
throwsWith('a stem that is not Devanagari', { hi: 'abcना', rom: 'abcnā', tag: '' }, /unsupported stem/);
throwsWith('no stem at all', { hi: 'ना', rom: 'nā', tag: '' }, /no stem/);
throwsWith('a long-vowel stem written with a short romanization', { hi: 'खाना', rom: 'khanā', tag: 't' }, /does not fit the stem/);
throwsWith('a consonant stem romanized with its schwa', { hi: 'बोलना', rom: 'bolanā', tag: 't' }, /does not fit the stem/);
throwsWith('करना with the wrong romanization', { hi: 'करना', rom: 'karanā', tag: 't' }, /does not fit the stem/);
throwsWith('unknown tag', { hi: 'करना', rom: 'karnā', tag: 'x' }, /unknown tag/);
throwsWith('the tag tf needs a leading noun', { hi: 'करना', rom: 'karnā', tag: 'tf' }, /needs a leading noun/);
throwsWith('जाना never takes ने, with tf either', { hi: 'साथ जाना', rom: 'sāth jānā', tag: 'tf' }, /never takes ने/);
throwsWith('the tag a needs a leading word', { hi: 'होना', rom: 'honā', tag: 'a' }, /needs a leading word/);
throwsWith('the tag a needs a leading word that ends in ा or े', { hi: 'खुश होना', rom: 'khuś honā', tag: 'a' }, /ends in ा or े/);
throwsWith('the tag a with a leading word that is only the vowel', { hi: 'ा होना', rom: 'ā honā', tag: 'a' }, /ends in ा or े/);
throwsWith('जाना never takes ने', { hi: 'जाना', rom: 'jānā', tag: 't' }, /never takes ने/);
throwsWith('आना never takes ने', { hi: 'आना', rom: 'ānā', tag: 't' }, /never takes ने/);
throwsWith('होना never takes ने', { hi: 'खुश होना', rom: 'khuś honā', tag: 't' }, /never takes ने/);
throwsWith('the tag tp needs a leading noun', { hi: 'देना', rom: 'denā', tag: 'tp' }, /the tag "tp" \(masculine plural object\) needs a leading noun/);
throwsWith('the tag tfp needs a leading noun', { hi: 'भरना', rom: 'bharnā', tag: 'tfp' }, /the tag "tfp" \(feminine plural object\) needs a leading noun/);
throwsWith('जाना never takes ने, with tp either', { hi: 'साथ जाना', rom: 'sāth jānā', tag: 'tp' }, /never takes ने/);
throwsWith('आना never takes ने, with tfp either', { hi: 'याद आना', rom: 'yād ānā', tag: 'tfp' }, /never takes ने/);
throwsWith('होना never takes ने, with tp either', { hi: 'खुश होना', rom: 'khuś honā', tag: 'tp' }, /never takes ने/);
throwsWith('the tag s is only for होना', { hi: 'काम करना', rom: 'kām karnā', tag: 's' }, /the tag "s" \(state\) is only for a compound whose last word is होना/);
throwsWith('the tag s on a bare होना needs a leading word', { hi: 'होना', rom: 'honā', tag: 's' }, /the tag "s" \(state\) needs a leading word before होना/);
throwsWith('the tag s on a verb that is not होना (रहना)', { hi: 'खुश रहना', rom: 'khuś rahnā', tag: 's' }, /only for a compound whose last word is होना/);
throwsWith('the tag sa is only for होना', { hi: 'बना रहना', rom: 'banā rahnā', tag: 'sa' }, /the tag "sa" \(state\) is only for a compound whose last word is होना/);
throwsWith('the tag sa needs a leading word that ends in ा or े', { hi: 'हकदार होना', rom: 'hakdār honā', tag: 'sa' }, /the tag "sa" needs a leading word that ends in ा or े/);
throwsWith('the tag d needs a leading noun', { hi: 'होना', rom: 'honā', tag: 'd' }, /the tag "d" \(the noun is the subject\) needs a leading noun/);
throwsWith('the tag d needs a leading noun (लगना)', { hi: 'लगना', rom: 'lagnā', tag: 'd' }, /the tag "d" \(the noun is the subject\) needs a leading noun/);
throwsWith('the tag d needs a leading noun (आना)', { hi: 'आना', rom: 'ānā', tag: 'd' }, /needs a leading noun/);
throwsWith('two tags in one are not a tag (tfs)', { hi: 'बात करना', rom: 'bāt karnā', tag: 'tfs' }, /unknown tag/);
throwsWith('the tag ds is not a tag', { hi: 'ज़रूरत होना', rom: 'zarūrat honā', tag: 'ds' }, /unknown tag/);
throwsWith('the tag T (capital) is not a tag', { hi: 'करना', rom: 'karnā', tag: 'T' }, /unknown tag/);
// the tags the engine accepts are exactly the tags that readEntry in verbs.js accepts: probe the engine with
// every combination of the tag letters (an "unknown tag" error means it is not a tag)
{
  const letters = ['t', 'f', 'p', 'a', 's', 'd'];
  const candidates = [''];
  for (const a of letters) { candidates.push(a); for (const b of letters) { candidates.push(a + b); for (const c of letters) candidates.push(a + b + c); } }
  const engineTags = candidates.filter(tag => {
    try { express({ hi: 'बात करना', rom: 'bāt karnā', tag }); } catch (error) { return !/unknown tag/.test(error.message); }
    return true;
  });
  const source = fs.readFileSync(`${__dirname}/verbs.js`, 'utf8');
  const readerTags = source.match(/\(\?:\\\[\(([a-z|]+)\)\\\]\)\?/)[1].split('|');
  same('the engine accepts exactly the tags t tf tp tfp a s sa d (and no tag)', engineTags.slice().sort().join(' '), ['', 'a', 'd', 's', 'sa', 't', 'tf', 'tfp', 'tp'].join(' '));
  same('readEntry in verbs.js accepts exactly the tags of the engine', readerTags.slice().sort().join(' '), engineTags.filter(Boolean).sort().join(' '));
}
throwsWith('no entry', null, /must be an object/);
throwsWith('a missing infinitive', { hi: '', rom: '', tag: '' }, /non-empty/);
throwsWith('a missing romanization', { hi: 'करना', tag: '' }, /non-empty/);

// ---- 5. Validating the verb database --------------------------------------------------------

// Consonant skeleton: each consonant letter becomes a Latin token, vowels are ignored on both
// sides. Anusvara and chandrabindu are ṁ. ऋ / ृ is ṛ, like the flap ड़.
const CONSONANTS = {
  क: 'k', ख: 'kh', ग: 'g', घ: 'gh', ङ: 'ṅ', च: 'c', छ: 'ch', ज: 'j', झ: 'jh', ञ: 'ñ',
  ट: 'ṭ', ठ: 'ṭh', ड: 'ḍ', ढ: 'ḍh', ण: 'ṇ', त: 't', थ: 'th', द: 'd', ध: 'dh', न: 'n',
  प: 'p', फ: 'ph', ब: 'b', भ: 'bh', म: 'm', य: 'y', र: 'r', ल: 'l', व: 'v', श: 'ś', ष: 'ṣ', स: 's', ह: 'h',
};
const NUKTA = '\u093C';
const WITH_NUKTA = { ज: 'z', ड: 'ṛ', ढ: 'ṛh', फ: 'f' };
const DIGRAPHS = new Set(['kh', 'gh', 'ch', 'jh', 'ṭh', 'ḍh', 'th', 'dh', 'ph', 'bh', 'ṛh']);
const LATIN_CONSONANTS = new Set([...'bcdfghjklmnprstvyz', ...'ṛṭḍṇṅñśṣ']);
const LATIN_VOWELS = new Set([...'aāiīuūeo']);

function skeleton(text) {
  const out = [];
  const chars = [...text];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (Object.hasOwn(CONSONANTS, c)) {
      if (chars[i + 1] === NUKTA) {
        out.push(Object.hasOwn(WITH_NUKTA, c) ? WITH_NUKTA[c] : '?' + c + NUKTA);
        i += 1;
      } else out.push(CONSONANTS[c]);
    } else if (c === 'ऋ' || c === 'ृ') out.push('ṛ');
    else if (c === 'ं' || c === 'ँ') out.push('ṁ');
    else if (/[\u0904-\u0914\u093E-\u094D\s/]/.test(c)) { /* a vowel, a virama, a space or the " / " of a gendered cell */ }
    else out.push('?' + c);
  }
  return out.join('.');
}

function skeletonRom(text) {
  const out = [];
  const s = text.normalize('NFC');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (DIGRAPHS.has(s.slice(i, i + 2))) { out.push(s.slice(i, i + 2)); i += 1; }
    // the honorific -iye (बोलिए) has a glide in speech but no letter for it in script
    else if (c === 'y' && (s[i - 1] === 'i' || s[i - 1] === 'ī') && s[i + 1] === 'e') { /* glide */ }
    else if (LATIN_CONSONANTS.has(c)) out.push(c);
    else if (c === 'ṁ') out.push('ṁ');
    else if (LATIN_VOWELS.has(c) || c === ' ' || c === '/') { /* a vowel, a space or the " / " of a gendered cell */ }
    else out.push('?' + c);
  }
  return out.join('.');
}

// The letters the scheme allows. Script: independent vowels, consonants, nukta, vowel signs,
// virama, chandrabindu and anusvara (no visarga, no danda, no precomposed nukta letters
// U+0958-U+095F, no ऩ ऱ ऴ ळ). Romanization: the letters of the scheme (no q w x).
const HI_WORD = /^[\u0901\u0902\u0905-\u0914\u0915-\u0928\u092A-\u0930\u0932\u0935-\u0939\u093C\u093E-\u094D]+$/;
const ROM_WORD = /^[abcdefghijklmnoprstuvyzāīūṛṭḍṇṅñśṣṁ]+$/;
const PRECOMPOSED_NUKTA = /[\u0958-\u095F]/;
// Sequences that no correctly joined Devanagari form contains: two vowel signs in a row, a vowel
// sign after an independent vowel, a nasal sign before a vowel sign or another nasal sign, a
// virama at the end of a word, a nukta in front of an independent vowel letter.
const BAD_SEQUENCE = /[\u093E-\u094C][\u093E-\u094C]|[\u0905-\u0914][\u093E-\u094C]|[\u0901\u0902][\u093E-\u094C\u0901\u0902]|\u094D(?:\s|$)|\u093C[\u0905-\u0914]/;
// The skeleton functions are part of the safety net, so they are checked first.
for (const [script, romanized, tokens] of [
  ['करूँगा', 'karūṁgā', 'k.r.ṁ.g'],
  ['पढ़ना', 'paṛhnā', 'p.ṛh.n'],
  ['छोड़ना', 'choṛnā', 'ch.ṛ.n'],
  ['चलना', 'calnā', 'c.l.n'],
  ['ज़िंदा', 'ziṁdā', 'z.ṁ.d'],
  ['फ़ैसला', 'faislā', 'f.s.l'],
  ['बोलिए', 'boliye', 'b.l'],
  ['किया', 'kiyā', 'k.y'],
  ['पियो', 'piyo', 'p.y'],
  ['क्षमा', 'kṣamā', 'k.ṣ.m'],
  ['ज्ञान', 'jñān', 'j.ñ.n'],
  ['कृपा', 'kṛpā', 'k.ṛ.p'],
  ['पहुँचना', 'pahuṁcnā', 'p.h.ṁ.c.n'],
  ['गईं', 'gaīṁ', 'g.ṁ'],
  ['खुश', 'khuś', 'kh.ś'],
  ['बैठना', 'baiṭhnā', 'b.ṭh.n'],
  ['करता हूँ / करती हूँ', 'kartā hūṁ / kartī hūṁ', 'k.r.t.h.ṁ.k.r.t.h.ṁ'],
]) {
  same(`skeleton of ${script}`, skeleton(script), tokens);
  same(`skeletonRom of ${romanized}`, skeletonRom(romanized), tokens);
}
same('the skeletons tell च (c) from छ (ch)', skeletonRom('chalnā') !== skeleton('चलना') && skeletonRom('calnā') === skeleton('चलना'), true);
same('the skeletons notice a missing nasal', skeletonRom('pahucnā') !== skeleton('पहुँचना'), true);
same('the sequence check accepts good joins (गए खाएँ पहुँचना हुआ)', ['गए', 'खाएँ', 'पहुँचना', 'हुआ'].some(w => BAD_SEQUENCE.test(w)), false);
same('the sequence check rejects bad joins', ['खाा', 'आा', 'कँा', 'कंं', 'क्', 'कअ'.replace('अ', '\u093Cअ')].every(w => BAD_SEQUENCE.test(w)), true);
same('the skeletons notice an unknown letter (ळ)', skeleton('गळना').includes('?'), true);

// Spellings that are two different words, each read its own way (read one by one):
// none so far. Add a script word here only when its two readings are really two words.
const TWO_READINGS = new Set([]);

// Leading words that are adjectives or participles in ा / े that agree with the subject (found by the
// audit of the intransitive compounds): without [a] the feminine forms would be wrong. Persian-origin
// adjectives that do not change (ज़िंदा, खाली, राज़ी, आगबबूला) are not in this list.
const AGREEING_LEADS = new Set(['बूढ़ा', 'पुराना', 'धुंधला', 'टेढ़ा', 'ठंडा', 'बना', 'फीका', 'धीमा', 'बड़ा', 'लंबा', 'पड़ा', 'हल्का', 'ढीला', 'गीला', 'संकरा', 'डूबा', 'छोटा', 'भेंगा', 'सीधा', 'पतला', 'गाढ़ा', 'चौड़ा', 'दोगुना', 'तिगुना', 'अच्छा', 'लगे', 'डटे', 'अड़े', 'टिके', 'चलते', 'इकट्ठा', 'ताज़ा']);
const hiWordsOf = hi => hi.split(' ');
let translations = 0;
const readingOf = {};

// Every cell of one verb: well formed, NFC, " / " parts in step, consonant skeletons equal.
// A verb reports its first problem and how many more there were (one bad lead word would
// otherwise print a hundred lines).
function checkCells(label, result) {
  const problems = [];
  for (const key of ROW_KEYS) {
    const row = result.rows[key];
    if (!Array.isArray(row) || row.length !== 7) { problems.push(`${label}: malformed row ${key}`); continue; }
    row.forEach((cell, p) => {
      if (cell === null) return;
      const where = `${label} ${key}[${p}]`;
      if (!cell || typeof cell.hi !== 'string' || typeof cell.rom !== 'string' || !cell.hi.trim() || !cell.rom.trim()) { problems.push(`${where}: empty cell`); return; }
      if (/undefined|NaN|null/.test(cell.hi + cell.rom)) problems.push(`${where}: broken cell ${JSON.stringify(cell)}`);
      if (cell.hi.normalize('NFC') !== cell.hi || PRECOMPOSED_NUKTA.test(cell.hi)) problems.push(`${where}: script is not NFC or uses a precomposed nukta letter: ${cell.hi}`);
      if (cell.rom.normalize('NFC') !== cell.rom) problems.push(`${where}: romanization is not NFC: ${cell.rom}`);
      if (/ {2}|^ | $/.test(cell.hi + cell.rom)) problems.push(`${where}: stray space in ${JSON.stringify(cell)}`);
      if (BAD_SEQUENCE.test(cell.hi)) problems.push(`${where}: badly joined Devanagari in ${cell.hi}`);
      const hiParts = cell.hi.split(' / ');
      const romParts = cell.rom.split(' / ');
      if (hiParts.length !== romParts.length || hiParts.length > 2) problems.push(`${where}: " / " parts differ (${hiParts.length} in script, ${romParts.length} in romanization)`);
      hiParts.forEach((part, i) => {
        if (!part.trim() || !(romParts[i] || '').trim()) problems.push(`${where}: an empty part in ${JSON.stringify(cell)}`);
        const a = skeleton(part);
        const b = skeletonRom(romParts[i] || '');
        if (a !== b) problems.push(`${where}: the consonants of ${part} (${a}) and ${romParts[i]} (${b}) differ`);
      });
    });
  }
  if (problems.length) failures.push(problems[0] + (problems.length > 1 ? `  (and ${problems.length - 1} more in the forms of this verb)` : ''));
}

// every generated form of the verbs the tests spell out
for (const [verb, tag] of [...KEY_FORMS.map(r => [r[0], r[1]]), ...PLURAL_OBJECTS.map(r => [r[0], r[1]]), ...FULL.map(f => [f.verb.slice(0, 2).join('|'), f.verb[2]])]) {
  const [hi, rom] = verb.split('|');
  let result;
  try { result = express({ hi, rom, tag }); } catch (error) { failures.push(`${hi}: ${error.message}`); continue; }
  checkCells(`${hi}${tag ? ' [t]' : ''}`, result);
}

for (const [english, options] of Object.entries(VERBS)) {
  if (!Array.isArray(options) || !options.length) failures.push(`${english}: no translation`);
  const seen = new Set();
  for (const entry of options) {
    translations += 1;
    const { hi, rom, tag } = entry;
    const label = `${english} -> ${hi} ${rom}`;
    const failuresBefore = failures.length;
    if (typeof hi !== 'string' || typeof rom !== 'string') { failures.push(`${label}: hi and rom must be strings`); continue; }
    if (!['', 't', 'tf', 'tp', 'tfp', 'a', 's', 'sa', 'd'].includes(tag)) failures.push(`${label}: tag must be "t", "tf", "tp", "tfp", "a", "s", "sa", "d" or "" (got ${JSON.stringify(tag)})`);
    if (['tf', 'tp', 'tfp', 'd'].includes(tag) && hi.split(' ').length < 2) failures.push(`${label}: the tag [${tag}] needs a leading noun`);
    if (['a', 's', 'sa'].includes(tag) && hi.split(' ').length < 2) failures.push(`${label}: the tag [${tag}] needs a leading word`);
    if ((tag === 's' || tag === 'sa') && hi.split(' ').at(-1) !== 'होना') failures.push(`${label}: the tag [${tag}] is only for a compound that ends in होना`);
    // an intransitive compound whose leading word is an adjective or participle that agrees with the
    // subject must say so, or its feminine forms are wrong (ठंडा होती है instead of ठंडी होती है)
    if ((tag === '' || tag === 's') && hiWordsOf(hi).length > 1 && AGREEING_LEADS.has(hiWordsOf(hi).at(-2))) failures.push(`${label}: the leading word ${hiWordsOf(hi).at(-2)} agrees with the subject: add the tag [${tag === 's' ? 'sa' : 'a'}]`);
    if (Object.keys(entry).some(k => !['hi', 'rom', 'tag', 'note'].includes(k))) failures.push(`${label}: unexpected fields ${Object.keys(entry).join(',')}`);
    if (seen.has(hi)) failures.push(`${label}: ${hi} listed twice for ${english}`);
    seen.add(hi);
    if (hi.normalize('NFC') !== hi) failures.push(`${label}: script is not NFC`);
    if (PRECOMPOSED_NUKTA.test(hi)) failures.push(`${label}: script uses a precomposed nukta letter (U+0958-U+095F); write base letter + U+093C`);
    if (rom.normalize('NFC') !== rom) failures.push(`${label}: romanization is not NFC`);
    if (/ {2}|^ | $/.test(hi) || / {2}|^ | $/.test(rom)) failures.push(`${label}: stray spaces`);
    const hiWords = hi.split(' ');
    const romWords = rom.split(' ');
    if (hiWords.length !== romWords.length) { failures.push(`${label}: ${hiWords.length} word(s) in script but ${romWords.length} in romanization`); continue; }
    hiWords.forEach((w, i) => {
      if (!HI_WORD.test(w)) failures.push(`${label}: ${w} has a character outside the Devanagari letters of the scheme`);
      if (!ROM_WORD.test(romWords[i])) failures.push(`${label}: ${romWords[i]} has a character outside the romanization scheme`);
      if (BAD_SEQUENCE.test(w)) failures.push(`${label}: ${w} has a badly formed letter sequence`);
      if (/[^जडढफ]\u093C/.test(w) || w.startsWith('\u093C')) failures.push(`${label}: ${w} has a nukta after a letter other than ज ड ढ फ`);
      const a = skeleton(w);
      const b = skeletonRom(romWords[i]);
      if (a !== b) failures.push(`${label}: the consonants of ${w} (${a}) and ${romWords[i]} (${b}) differ`);
      // a word-final schwa is not written (kar, mitr, mahatv), except after a conjunct that ends in य
      // (yogya, satya, rājya), where Hindi keeps it
      if (/[\u0915-\u0939]\u093C?$/.test(w)) {
        const keepsSchwa = /[\u0915-\u0939]\u094D\u092F$/.test(w);
        if (keepsSchwa !== romWords[i].endsWith('a')) failures.push(`${label}: ${romWords[i]} ${keepsSchwa ? 'must end in -ya' : 'must not end in a'} (${w} ends in ${keepsSchwa ? 'a conjunct with य' : 'a consonant letter'})`);
      }
      // one romanization per spelling across the database
      if (readingOf[w] && readingOf[w] !== romWords[i] && !TWO_READINGS.has(w)) failures.push(`${label}: ${w} is also written "${readingOf[w]}" elsewhere`);
      readingOf[w] = romWords[i];
    });
    let result;
    try { result = express({ hi, rom, tag }); } catch (error) { failures.push(`${label}: ${error.message}`); continue; }
    if (result.hi !== hi || result.rom !== rom) failures.push(`${label}: express() changed the entry to ${result.hi} ${result.rom}`);
    if (failures.length === failuresBefore) checkCells(label, result);   // a bad spelling is reported once, not in every form
    // a verb with [d] has only the third person (वह and वे); every other verb has all seven
    if (tag === 'd' ? !(result.rows.pres[2] && result.rows.pres[6]) : !result.rows.pres.every(Boolean)) failures.push(`${label}: no present-tense form`);
  }
}

// ---- 6. Ergative tags (found by the tag audit) -----------------------------------------------
// Feminine singular nouns that stand before a ने verb as its object (बात, मदद, सलाह ...). The past
// participle then agrees with them (ने बात की). Where the noun is only an adverb or a complement, the
// object is not in the entry and the participle stays masculine (listed in NOT_THE_OBJECT).
const FEMININE_OBJECTS = new Set(`
अंगड़ाई अति अतिशयोक्ति अध्यक्षता अनदेखी अनुमति अपील अपेक्षा अभिलाषा आँख आकांक्षा आदत आपत्ति आपूर्ति आराधना आरी आलोचना आवभगत आवाज़ आशा आस्था आह इच्छा
इज़्ज़त इजाज़त इश्कबाज़ी इस्त्री ईर्ष्या उड़ान उत्सुकता उपज उपेक्षा उबासी उम्मीद उल्टी ऊर्जा कंघी कटाई कटौती कढ़ाई कन्नी कमान करवट कलम कसम कसरत
कानाफूसी कामना कार्रवाई कीमत कील कुंडी कुश्ती कैद कॉपी कॉल कोशिश कोहनी क्रांति क्षति क्षतिपूर्ति क्षमा खपत खबर खरीदारी खिल्ली खुदाई खुशामद खेती खोजबीन
गंध गड़बड़ गणना गति गद्दी गपशप गलती गवाही गश्त गाँठ गाड़ी गारंटी गाली गुहार गोद गोली घात घूस घृणा घेराबंदी घोषणा चढ़ाई चर्चा चादर चापलूसी चाबी चिंता
चिकोटी चीख चीनी चुगली चुटकी चुनौती चुस्की चेतावनी चोट चोरी छलाँग छानबीन छाप छाया छुट्टी छूट छेड़छाड़ जगह जमाखोरी जम्हाई जल्दबाज़ी जल्दी ज़मानत ज़िद
ज़िम्मेदारी जाँच जानकारी जालसाज़ी जिरह झपकी झाड़ू टक्कर टिप्पणी टेक टैक्सी टोह ठिठोली ठेस ठोकर डकार डींग डुबकी तरक्की तरजीह तलवारबाज़ी तलाश तलाशी
तसल्ली तस्करी तस्वीर तह ताकझाँक ताकीद तारीख तारीफ़ ताली तुक तुकबंदी तुलना तैयारी तैराकी तोड़फोड़ त्योरी त्रुटि थपकी दया दलील दवा दस्तक दाढ़ी दावत
दिलचस्पी दिशा दीक्षा दीवार दुआ दुलत्ती देखभाल देखरेख देर दोस्ती दौड़ धमकी धार धुन धूप धौंस नकल नक्काशी नज़र नफ़रत नाव निंदा निगरानी नियुक्ति नींव
नुक्ताचीनी नौकरी पट्टी पड़ताल पप्पी परवाह परिकल्पना परिभाषा पलक पहचान पाबंदी पिन पुष्टि पूँछ पूछताछ पूजा पूरी पेशकश पैरवी पैरोडी पॉलिश पोल प्रगति
प्रतिक्रिया प्रतिज्ञा प्रतिलिपि प्रतिस्पर्धा प्रतीक्षा प्रदर्शनी प्रशंसा प्राथमिकता प्रार्थना प्रेरणा प्रैक्टिस फटकार फ़सल फ़िक्र फ़िल्म फ़ोटो
फाँसी फूँक बकबक बचत बधाई बराबरी बर्फ़ बलि बहस बाड़ बात बातचीत बाधा बिक्री बुनाई बुराई बेईमानी बोली भड़ास भरपाई भर्ती भविष्यवाणी भीख भूमिका भूल भेंट
भौं मंज़ूरी मछली मदद मध्यस्थता मरम्मत मलाई महिमा माँग मात मान्यता मालिश मिन्नत मुट्ठी मुबारकबाद मुराद मुलाकात मुहर मूर्ति मेज़बानी यातना यात्रा योजना
रक्षा रखवाली रफ़्तार राय राह राहत रिपोर्ट रिश्वत रुकावट रूपरेखा रेखा रोक रोकथाम लात लापरवाही लूटपाट वकालत वर्तनी विजय विनती विविधता वृद्धि व्याख्या
शपथ शरण शराब शर्त शादी शिकायत शिक्षा शिरकत शुभकामना शुरुआत शेखी श्रद्धांजलि सज़ा सजावट सड़क सदस्यता सफ़ाई सब्सिडी समीक्षा सरसराहट सलामी सलाह सवारी
सहमति सहानुभूति सहायता साँस सांत्वना साइकिल साख साज़िश सिफ़ारिश सिगरेट सिलाई सीटी सुरंग सुलह सूचना सेवा सैर सौदेबाज़ी स्थापना स्वीकृति हत्या हमदर्दी
हवा हानि हामी हार हिफ़ाज़त हिम्मत हेराफेरी होड़ खड़ी
कल्पना पढ़ाई घिन जलन महारत जीत शांति सीमा बौछार ऊन नाक बदली परेड ज़िप ईजाद
`.trim().split(/\s+/));
// Plural object nouns. The engine cannot see the number of a noun, the tag says it: [tp] for a masculine
// plural (ने पैसे दिए), [tfp] for a feminine plural (ने आहें भरीं). A [t] or [tf] entry with one of
// these nouns in it is a mistake; so is a plural noun that is the SUBJECT of an intransitive verb
// (बुलबुले उठना), which no tag can express (use the singular noun with [d]).
const MASCULINE_PLURAL_OBJECTS = new Set('अंडे आँसू कपड़े कोड़े खर्राटे घुटने चटखारे चीथड़े छींटे झटके टुकड़े थपेड़े नारे पन्ने पैसे बाल मायने हिज्जे'.split(' '));
// body parts that are used in the plural in these idioms (ने हाथ जोड़े, ने पैर पटके, ने पंख फड़फड़ाए): only with [tp]
const PLURAL_BODY_PARTS = new Set(['हाथ', 'पैर', 'पंख']);
const FEMININE_PLURAL_OBJECTS = new Set('आँखें आहें किरचें गालियाँ फाँकें बेड़ियाँ भौंहें लकीरें सिसकियाँ हिलोरें कसमें'.split(' '));
const PLURAL_SUBJECTS = new Set(['बुलबुले', 'ओले', 'लहरें']);
const NOT_THE_OBJECT = new Set(['जल्दी निपटाना', 'गलत जगह रखना', 'ज़िप करना']);   // ज़िप करना: a loan verb (zip a file), the object is the file
// The last word of every entry decides its tag: these verbs never take ने ...
const NEVER_ERGATIVE = new Set(['उठना', 'बैठना', 'गिरना', 'चलना', 'रहना', 'मरना', 'जागना', 'रोना', 'हँसना', 'दौड़ना', 'भागना', 'आना', 'जाना', 'होना', 'बनना', 'मिलना', 'लगना', 'पड़ना', 'उड़ना', 'तैरना', 'डूबना', 'सूखना', 'टूटना', 'खुलना', 'बहना', 'ठहरना', 'बचना', 'पहुँचना', 'निकलना', 'उतरना', 'चढ़ना', 'लौटना', 'झुकना', 'बढ़ना', 'घटना', 'सोना', 'जीना']);
// ... and these always do, although बोलना भूलना लाना समझना look intransitive or are easy to forget
const ALWAYS_ERGATIVE = new Set(['बोलना', 'भूलना', 'लाना', 'समझना', 'करना', 'देना', 'लेना', 'खाना', 'पीना', 'कहना', 'सुनना', 'देखना', 'पढ़ना', 'लिखना']);
for (const [english, options] of Object.entries(VERBS)) {
  for (const { hi, tag } of options) {
    const last = hi.split(' ').at(-1);
    checks += 1;
    const ergative = ['t', 'tf', 'tp', 'tfp'].includes(tag);
    if (NEVER_ERGATIVE.has(last) && ergative) failures.push(`${english} -> ${hi}: ${last} never takes ने, remove [${tag}]`);
    // exceptions inside the always-ergative list: मेल खाना (match) is intransitive
    if (ALWAYS_ERGATIVE.has(last) && !ergative && hi !== 'मेल खाना' && hi !== 'घाव भरना' && hi !== 'दिखाई देना' && hi !== 'सुनाई देना') failures.push(`${english} -> ${hi}: ${last} takes ने, add [t]`);
    // [tf]: the object noun is feminine (ने बात की). The list above is the nouns the audits of the ने
    // compounds found; a [t] entry with one of them among its leading words must be [tf]. (The noun is
    // not always the last leading word: जीत हासिल करना, महारत हासिल करना, घिन पैदा करना.)
    const words = hi.split(' ');
    const lead = words.slice(0, -1);
    // a noun followed by a postposition is an adverb or a complement, not the object (नौकरी से निकालना,
    // चोरी से सुनना, झटके से खींचना): the participle does not agree with it
    const isObject = (w, i) => !['से', 'में', 'पर', 'को', 'का', 'की', 'के'].includes(lead[i + 1]);
    const feminineLead = lead.find((w, i) => FEMININE_OBJECTS.has(w) && isObject(w, i));
    if (tag === 't' && feminineLead && !NOT_THE_OBJECT.has(hi)) failures.push(`${english} -> ${hi}: ${feminineLead} is a feminine noun, the past is ${feminineLead} की / दी / ली ...: use [tf]`);
    if (tag === 'tf' && !feminineLead) failures.push(`${english} -> ${hi}: [tf] needs a feminine object noun among the leading words (${lead.join(' ')})`);
    // [tp] / [tfp]: a plural object noun; [t] / [tf] must not have one
    if (tag === 'tp' && !lead.some(w => MASCULINE_PLURAL_OBJECTS.has(w) || PLURAL_BODY_PARTS.has(w))) failures.push(`${english} -> ${hi}: [tp] needs a masculine plural object noun among the leading words (${lead.join(' ')})`);
    if (tag === 'tfp' && !lead.some(w => FEMININE_PLURAL_OBJECTS.has(w))) failures.push(`${english} -> ${hi}: [tfp] needs a feminine plural object noun among the leading words (${lead.join(' ')})`);
    const pluralLead = lead.find((w, i) => (MASCULINE_PLURAL_OBJECTS.has(w) || FEMININE_PLURAL_OBJECTS.has(w)) && isObject(w, i));
    if ((tag === 't' || tag === 'tf') && pluralLead) failures.push(`${english} -> ${hi}: ${pluralLead} is a plural object noun, the past is plural (ने पैसे दिए, ने आहें भरीं): use [tp] or [tfp]`);
    if (tag === 'tp' && lead.some(w => FEMININE_PLURAL_OBJECTS.has(w))) failures.push(`${english} -> ${hi}: a feminine plural noun needs [tfp], not [tp]`);
    if (tag === 'tfp' && lead.some(w => MASCULINE_PLURAL_OBJECTS.has(w))) failures.push(`${english} -> ${hi}: a masculine plural noun needs [tp], not [tfp]`);
    const pluralSubject = lead.find(w => PLURAL_SUBJECTS.has(w));
    if (pluralSubject) failures.push(`${english} -> ${hi}: ${pluralSubject} is a plural subject, which no tag can conjugate: use the singular noun (बुलबुला उठना) with [d]`);
    if ((tag === 'a' || tag === 'sa') && !/(होना|रहना|पड़ना|लगना)$/.test(hi)) failures.push(`${english} -> ${hi}: [${tag}] is for intransitive compounds`);
  }
}
// ---- 7. States [s] [sa] and dative-subject expressions [d] (found by the audit of the compounds) ---------
// A compound with होना that names a STATE (not a change) is tagged [s]: मैं हकदार हूँ, not हकदार होता हूँ /
// हकदार हुआ. The lists below are the expressions the audit found, one entry per Hindi expression; a
// compound is tagged [s] / [sa] if and only if its expression is in the list (or in the by-key list for
// an expression that is a state under one English verb and a change under another).
const STATES = new Set(`
अध्यक्ष होना | अनुरूप होना | अस्तित्व में होना | आक्रोशित होना | आधारित होना | आभारी होना | उचित होना | उत्कृष्ट होना |
असहमत होना | उपयुक्त होना | एहसानमंद होना | कर्ज़दार होना | खिलाफ़ होना | खुश होना | घुमावदार होना | चकित होना | चलन में होना |
ज़रूरी होना | निराश होना | निर्भर होना | पड़ा होना | परेशान होना | पात्र होना | पीड़ित होना | प्रचलित होना | प्रतीक होना |
प्रभावित होना | फ़िट होना | बना होना | बराबर होना | बेहतर होना | भयभीत होना | भिन्न होना | भेंगा होना | मजबूर होना |
मालिक होना | माहिर होना | मौजूद होना | योग्य होना | रोमांचित होना | लाज़िमी होना | लायक होना | लालायित होना | लीन होना |
विपरीत होना | विरोधाभासी होना | संतुष्ट होना | संबंधित होना | सक्षम होना | सदस्य होना | स्थित होना | हकदार होना
`.trim().split(/\s*\|\s*/));
// the same Hindi expression means "become" under another English verb: सहमत होना (agree: be in agreement;
// consent: give in), हैरान होना (surprise: be surprised;
// marvel: marvel at), शामिल होना (involve: be involved; join, attend: take part), अलग होना (differ: be different;
// separate: part ways), दुखी होना (grieve: be sad; sadden: feel sad, become sad)
const STATES_BY_KEY = new Set(['agree: सहमत होना', 'amaze: हैरान होना', 'surprise: हैरान होना', 'entail: शामिल होना', 'involve: शामिल होना', 'differ: अलग होना', 'grieve: दुखी होना']);
// "become" and "happen" compounds that must stay untagged (examples; the list is not complete)
const BECOMES = new Set(['सफल होना', 'कामयाब होना', 'ठीक होना', 'तैयार होना', 'शुरू होना', 'बंद होना', 'खत्म होना', 'गायब होना', 'नाराज़ होना', 'शांत होना', 'कम होना', 'विकसित होना', 'असफल होना', 'गरम होना', 'ठंडा होना', 'बारिश होना']);
// Dative-subject expressions (मुझे ज़रूरत है, मुझे डर लगता है) and other expressions whose noun is the subject
// (बाढ़ आई, बर्फ़ गिरी): tagged [d] if and only if the expression is in this list
const DATIVES = new Set(`
अभाव होना | आवश्यकता होना | इच्छा होना | उतार चढ़ाव आना | ओला पड़ना | कमी होना | कीमत होना | खमीर उठना | खर्च आना | खाँसी आना |
खुजली होना | गंध आना | घिन आना | चोट लगना | छींक आना | ज़ंग लगना | ज़रूरत पड़ना | ज़रूरत होना | जुनून सवार होना | झपकी आना |
डर लगना | तुक मिलना | तूफ़ान आना | दर्द होना | दुर्गंध आना | नींद आना | पता होना | पसंद आना | पसीना आना | फ़र्क पड़ना |
बकाया होना | बदबू आना | बदलाव आना | बर्फ़ गिरना | बाढ़ आना | बुलबुला उठना | मतभेद होना | मतलब होना | मोच आना | मोच लगना |
याद आना | रुझान होना | लहर उठना | वज़न होना | संदेह होना | समझ में आना | समय लगना | स्वाद आना
`.trim().split(/\s*\|\s*/));
for (const [english, options] of Object.entries(VERBS)) {
  for (const { hi, tag } of options) {
    checks += 1;
    const isState = tag === 's' || tag === 'sa';
    const shouldBeState = STATES.has(hi) || STATES_BY_KEY.has(`${english}: ${hi}`);
    if (shouldBeState !== isState) failures.push(`${english} -> ${hi}: ${shouldBeState ? 'names a state: add [s] (or [sa] if the leading word agrees with the subject)' : '[s] is not in the audited list of states (STATES)'}`);
    if (BECOMES.has(hi) && (isState || tag === 'd')) failures.push(`${english} -> ${hi}: a compound that means "become" or "happen" is not a state`);
    if (DATIVES.has(hi) !== (tag === 'd')) failures.push(`${english} -> ${hi}: ${DATIVES.has(hi) ? 'the noun is the subject: add [d]' : '[d] is not in the audited list of dative-subject expressions (DATIVES)'}`);
    // [d] is for verbs that never take ने (the noun is the subject, so nothing agrees with an object)
    if (tag === 'd' && !['होना', 'आना', 'लगना', 'पड़ना', 'मिलना', 'गिरना', 'उठना'].includes(hi.split(' ').at(-1))) failures.push(`${english} -> ${hi}: [d] on a verb that may take ने`);
    // no entry may be a bare postposition phrase with no noun (से गुज़रना, से अधिक होना): every cell would be a fragment
    if (/^(से|में|पर|को|के|की|का) /.test(hi)) failures.push(`${english} -> ${hi}: begins with a postposition and has no noun`);
    // a bare लगना or होना with [d] / [s] is refused by the engine; here, [d] needs a noun in the data too
    if ((tag === 'd' || isState) && hi.split(' ').length < 2) failures.push(`${english} -> ${hi}: [${tag}] needs a leading word`);
  }
}
same('हकदार होना is a state under deserve', VERBS.deserve[0].tag, 's');
same('के पास होना is not the default of have', VERBS.have[0].hi, 'रखना');
same('रखना is the first translation of own', VERBS.own[0].hi, 'रखना');
same('झेलना is the first translation of undergo', VERBS.undergo[0].hi, 'झेलना');
same('ज़रूरत होना is [d] under need', VERBS.need[0].tag, 'd');
same('the plural subject entries were replaced by singular nouns', [VERBS.bubble[0].hi, VERBS.hail[0].hi, VERBS.ripple[1].hi].join(' | '), 'बुलबुला उठना | ओला पड़ना | लहर उठना');

// छींकना खाँसना थूकना भौंकना (sneeze, cough, spit, bark) are intransitive verbs that take ने; all four are tagged alike
for (const hi of ['छींकना', 'खाँसना', 'थूकना', 'भौंकना']) {
  const entries = Object.values(VERBS).flat().filter(e => e.hi === hi);
  same(`${hi} is in the database and always tagged [t]`, entries.length > 0 && entries.every(e => e.tag === 't'), true);
}

// None of the files may contain a replacement character or a precomposed nukta letter.
for (const file of ['patterns.js', 'test.js', 'verbs.js']) {
  const text = fs.readFileSync(`${__dirname}/${file}`, 'utf8');
  checks += 1;
  if (text.includes('\uFFFD')) failures.push(`${file}: contains U+FFFD replacement characters`);
  if (PRECOMPOSED_NUKTA.test(text)) failures.push(`${file}: contains a precomposed nukta letter (U+0958-U+095F)`);
}

report.checks += checks;
report.finish(`${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Hindi translations`, { limit: 80 });
