/*
 * Chinese page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Chinese.express)
 * and verbs.js (VERBS).
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NOT_USED = 'This pattern is not used with this kind of verb.';

  // 睡|覺 shuì jiào -> 睡覺 shuìjiào
  const characters = entry => entry.zh.replace('|', '');
  const reading = entry => entry.py.replace(/\s+/g, '');
  const label = entry => `${characters(entry)} ${reading(entry)}`;

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other pattern appears when the button is pressed.
    coreTenses: ['pres', 'completed', 'fut'],
    unit: 'patterns',
    lang: 'zh-Hant',
    headword: characters,
    chipLabel: label,
    labelSeparator: '、',
    titleClass: 'zh',
    titleExtras: entry => [el('span', 'pinyin', reading(entry))],
    analyse: entry => Chinese.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, patterns, person) {
      const sentence = patterns.rows[tense][person];
      cell.classList.toggle('na', !sentence);
      if (sentence) {
        cell.removeAttribute('title');
        const pinyinLine = el('span', 'py', sentence.py);
        pinyinLine.lang = 'zh-Latn-pinyin';
        cell.replaceChildren(el('span', 'zh', sentence.zh), pinyinLine);
      } else {
        cell.title = NOT_USED;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
