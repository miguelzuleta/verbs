/*
 * Thai page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Thai.express)
 * and verbs.js (VERBS).
 *
 * The six pills are the pronouns ฉัน, คุณ, เขา, เรา, พวกคุณ, พวกเขา. analysis.rows[tense]
 * holds one cell per pronoun, either { th, rom } (the sentence in Thai script and its
 * romanization) or null where the pattern does not suit this kind of verb.
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NOT_USED = 'This pattern is not used with this kind of verb.';

  const label = entry => `${entry.th} ${entry.rom}`;

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other pattern appears when the button is pressed.
    coreTenses: ['pres', 'completed', 'fut'],
    unit: 'patterns',
    lang: 'th',
    headword: entry => entry.th,
    chipLabel: label,
    labelSeparator: ', ',
    titleClass: 'word',
    titleExtras: entry => [el('span', 'reading', entry.rom)],
    analyse: entry => Thai.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, patterns, person) {
      const sentence = patterns.rows[tense][person];
      cell.classList.toggle('na', !sentence);
      if (sentence) {
        cell.removeAttribute('title');
        cell.replaceChildren(el('span', 'word', sentence.th), el('span', 'reading', sentence.rom));
      } else {
        cell.title = NOT_USED;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
