/*
 * Vietnamese page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Vietnamese.express)
 * and verbs.js (VERBS).
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NOT_USED = 'This pattern is not used with this kind of verb.';

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other pattern appears when the button is pressed.
    coreTenses: ['pres', 'completed', 'fut'],
    unit: 'patterns',
    lang: 'vi',
    headword: entry => entry.vi,
    chipLabel: entry => entry.vi,
    labelSeparator: ', ',
    titleClass: 'vi',
    analyse: entry => Vietnamese.express(entry),
    exampleLabel: entry => entry.vi,

    fillCell(cell, tense, patterns, person) {
      const sentence = patterns.rows[tense][person];
      cell.classList.toggle('na', !sentence);
      if (sentence) {
        cell.removeAttribute('title');
        cell.replaceChildren(el('span', 'vi', sentence.vi));
      } else {
        cell.title = NOT_USED;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
