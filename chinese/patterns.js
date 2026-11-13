/*
 * Traditional Chinese (Mandarin, Taiwan) verb patterns.
 *
 *   express({ zh: '睡|覺', py: 'shuì jiào', tag: '' }) -> { zh, py, rows }
 *
 * Chinese verbs never change form. Tense, aspect and mood are carried by
 * particles and helper words around the verb (了, 過, 正在, 會, 如果…), so each
 * entry of `rows` is one way of expressing a tense, aspect or mood. rows[key] is
 * an array of six entries, one per pronoun (wǒ, nǐ, tā, wǒmen, nǐmen, tāmen);
 * each is { zh, py }, or null when the pattern does not suit this kind of verb.
 *
 * Verb entries:
 *   zh   characters; "|" marks where a verb-object compound splits (睡|覺),
 *        because particles go inside it (睡過覺, not 睡覺過)
 *   py   pinyin syllables separated by spaces, one per character
 *   tag  "s" state verb (喜歡, 知道), "a" instant/achievement verb (到達, 贏),
 *        "m" modal verb (能, 應該), or "" for an ordinary action verb
 */
(function (global) {
  'use strict';

  const { words } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const PRONOUNS = [
    ['我', 'wǒ'], ['你', 'nǐ'], ['他', 'tā'],
    ['我們', 'wǒmen'], ['你們', 'nǐmen'], ['他們', 'tāmen'],
  ];

  // A token is a word with its pinyin. `attach` glues it to the previous word
  // in the pinyin (aspect particles and punctuation).
  const tok = (zh, py, attach = false) => ({ zh, py, attach });
  const LE = tok('了', 'le');
  const LE_ATTACHED = tok('了', 'le', true);
  const GUO = tok('過', 'guo', true);
  const BU_NEUTRAL = tok('不', 'bu');
  const QUESTION = tok('？', '?', true);
  const BANG = tok('！', '!', true);
  const COMMA = tok('，', ',', true);
  const DOTS = tok('……', '…', true);
  const ALREADY = tok('已經', 'yǐjīng');
  const WHEN = tok('當時', 'dāngshí');
  const LET = tok('讓', 'ràng');
  const DONT = tok('別', 'bié');
  const BA = tok('吧', 'ba');

  // 不 is read bú before a fourth-tone syllable.
  const bu = firstSyllable => tok('不', /[àèìòùǜ]/.test(firstSyllable) ? 'bú' : 'bù');

  function render(tokens) {
    const zh = tokens.map(t => t.zh).join('');
    const py = tokens.reduce((out, t) => out + (out && !t.attach ? ' ' : '') + t.py, '');
    return { zh, py };
  }

  function parseVerb(entry) {
    const parts = entry.zh.split('|');
    const syllables = words(entry.py);
    const split = [...parts[0]].length;
    const whole = tok(parts.join(''), syllables.join(''));
    const verb = parts.length > 1 ? tok(parts[0], syllables.slice(0, split).join('')) : whole;
    const object = parts.length > 1 ? tok(parts.slice(1).join(''), syllables.slice(split).join('')) : null;
    return { whole, verb, object, first: syllables[0], vo: parts.length > 1, zh: whole.zh };
  }

  // ---- The patterns --------------------------------------------------------
  // Each takes the subject token S, the person index p and the parsed verb c.

  // "V了": the particle follows the verb, or ends the sentence after a split compound.
  const done = c => (c.vo ? [c.whole, LE] : [c.verb, LE_ATTACHED]);
  // "V過": the particle goes inside a split compound (睡過覺).
  const tried = c => (c.vo ? [c.verb, GUO, c.object] : [c.verb, GUO]);

  const PATTERNS = {
    pres: (S, p, c) => [S, c.whole],
    prog: (S, p, c) => [S, tok('正在', 'zhèngzài'), c.whole],
    completed: (S, p, c) => [S, ...done(c)],
    exper: (S, p, c) => [S, ...tried(c)],
    perfect: (S, p, c) => [S, ALREADY, ...done(c)],
    recent: (S, p, c) => [S, tok('剛才', 'gāngcái'), ...done(c)],
    pastprog: (S, p, c) => [S, WHEN, tok('正在', 'zhèngzài'), c.whole],
    pluperf: (S, p, c) => [S, tok('之前', 'zhīqián'), ALREADY, ...tried(c), LE],
    fut: (S, p, c) => [S, tok('會', 'huì'), c.whole],
    nearfut: (S, p, c) => [S, tok('快要', 'kuàiyào'), ...done(c)],
    futperf: (S, p, c) => [tok('到時候', 'dào shíhòu'), S, ALREADY, ...done(c)],

    cond: (S, p, c) => [tok('如果', 'rúguǒ'), DOTS, COMMA, S, tok('就會', 'jiù huì'), c.whole],
    condperf: (S, p, c) => [tok('如果', 'rúguǒ'), WHEN, DOTS, COMMA, S, tok('就會', 'jiù huì'), ...done(c)],
    hyp: (S, p, c) => [tok('如果', 'rúguǒ'), S, c.whole, tok('的話', 'dehuà')],
    hypperf: (S, p, c) => [tok('要是', 'yàoshi'), S, WHEN, ...done(c)],
    wish: (S, p, c) => [tok('希望', 'xīwàng'), S, c.whole],

    // Commands name the person: "you" is addressed directly; everyone else is
    // "let ..." and "we" take 吧.
    impAff: (S, p, c) => [
      [LET, S, c.whole], [S, c.whole, BANG], [LET, S, c.whole],
      [S, c.whole, BA], [S, c.whole, BANG], [LET, S, c.whole],
    ][p],
    impNeg: (S, p, c) => [
      [DONT, LET, S, c.whole], [S, DONT, c.whole, BANG], [DONT, LET, S, c.whole],
      [S, DONT, c.whole, BA], [S, DONT, c.whole, BANG], [DONT, LET, S, c.whole],
    ][p],

    negPres: (S, p, c) => [S, bu(c.first), c.whole],
    negPast: (S, p, c) => [S, tok('沒', 'méi'), c.whole],
    negExper: (S, p, c) => [S, tok('沒', 'méi'), ...tried(c)],

    can: (S, p, c) => [S, tok('能', 'néng'), c.whole],
    should: (S, p, c) => [S, tok('應該', 'yīnggāi'), c.whole],
    want: (S, p, c) => [S, tok('想', 'xiǎng'), c.whole],

    qMa: (S, p, c) => [S, c.whole, tok('嗎', 'ma'), QUESTION],
    qAnotA: (S, p, c) => (c.vo
      ? [S, c.verb, BU_NEUTRAL, c.verb, c.object, QUESTION]
      : [S, c.verb, BU_NEUTRAL, c.verb, QUESTION]),
  };

  const ALL_KEYS = Object.keys(PATTERNS);

  // ---- Which patterns suit which kind of verb --------------------------------

  const BLOCKED_BY_TAG = {
    // states are not "in progress", "just now" or "about to" and are not commanded
    s: ['prog', 'pastprog', 'recent', 'nearfut', 'negPast', 'impAff', 'impNeg'],
    // instant events cannot be "in progress"
    a: ['prog', 'pastprog'],
  };
  const MODAL_ALLOWED = ['pres', 'negPres', 'negPast', 'hyp', 'wish', 'qMa', 'qAnotA'];

  // After a state verb a completed "了" is not used for the counterfactual tenses.
  const NO_LE_AFTER_STATE = {
    condperf: (S, p, c) => [tok('如果', 'rúguǒ'), WHEN, DOTS, COMMA, S, tok('就會', 'jiù huì'), c.whole],
    hypperf: (S, p, c) => [tok('要是', 'yàoshi'), S, WHEN, c.whole],
  };

  // 是, 有 and 在 behave differently from ordinary verbs.
  const SPECIAL = {
    '是': {
      allowed: ['pres', 'exper', 'fut', 'cond', 'hyp', 'hypperf', 'wish', 'negPres', 'qMa', 'qAnotA'],
      override: {
        exper: (S, p, c) => [S, tok('曾經', 'céngjīng'), c.whole],
        hypperf: NO_LE_AFTER_STATE.hypperf,
      },
    },
    '有': {
      allowed: ['pres', 'completed', 'exper', 'perfect', 'nearfut', 'fut', 'cond', 'condperf', 'hyp', 'hypperf',
        'wish', 'negPres', 'negPast', 'negExper', 'can', 'should', 'want', 'qMa', 'qAnotA'],
      override: {
        negPres: (S, p, c) => [S, tok('沒有', 'méiyǒu')],
        negPast: (S, p, c) => [S, tok('沒有', 'méiyǒu')],
        negExper: (S, p, c) => [S, tok('沒有過', 'méiyǒuguo')],
        qAnotA: (S, p, c) => [S, c.whole, tok('沒有', 'méiyǒu'), QUESTION],
        condperf: NO_LE_AFTER_STATE.condperf,
        hypperf: NO_LE_AFTER_STATE.hypperf,
      },
    },
    '在': {
      allowed: ['pres', 'fut', 'cond', 'hyp', 'hypperf', 'wish', 'negPres', 'negPast', 'qMa', 'qAnotA'],
      override: { hypperf: NO_LE_AFTER_STATE.hypperf },
    },
  };

  function patternFor(key, c, tag) {
    const special = SPECIAL[c.zh];
    if (special) {
      if (!special.allowed.includes(key)) return null;
      return special.override[key] || PATTERNS[key];
    }
    if (tag === 'm') return MODAL_ALLOWED.includes(key) ? PATTERNS[key] : null;
    if ((BLOCKED_BY_TAG[tag] || []).includes(key)) return null;
    if (tag === 's' && NO_LE_AFTER_STATE[key]) return NO_LE_AFTER_STATE[key];
    return PATTERNS[key];
  }

  function express(entry) {
    const c = parseVerb(entry);
    const tag = entry.tag || '';
    const rows = {};
    for (const key of ALL_KEYS) {
      const build = patternFor(key, c, tag);
      rows[key] = PRONOUNS.map(([zh, py], p) =>
        build ? render(build(tok(zh, py), p, c)) : null);
    }
    return { zh: c.whole.zh, py: c.whole.py, rows };
  }

  const api = { express, ROW_KEYS: ALL_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Chinese = api;
})(typeof window !== 'undefined' ? window : globalThis);
