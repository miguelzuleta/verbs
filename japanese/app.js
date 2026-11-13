/*
 * Japanese page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Japanese.express)
 * and verbs.js (VERBS).
 *
 * The two pills are not persons but politeness styles: pill 0 is polite (ます
 * style), pill 1 is plain (dictionary style). analysis.rows[tense] holds one
 * cell per style, either { ja, rd } or null where the style does not use the form.
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NOT_USED = 'This form is not used in this style.';
  const NO_FORM = 'This verb has no such form.';

  const label = entry => `${entry.ja} ${entry.rd}`;

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other form appears when the button is pressed.
    coreTenses: ['pres', 'past', 'neg'],
    unit: 'forms',
    lang: 'ja',
    headword: entry => entry.ja,
    chipLabel: label,
    labelSeparator: '、',
    titleClass: 'word',
    titleExtras: entry => {
      const reading = el('span', 'reading', entry.rd);
      reading.lang = 'ja';
      return [reading];
    },
    analyse: entry => Japanese.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, analysis, pill) {
      const form = analysis.rows[tense][pill];
      cell.classList.toggle('na', !form);
      if (form) {
        cell.removeAttribute('title');
        cell.replaceChildren(el('span', 'word', form.ja), el('span', 'reading', form.rd));
      } else {
        // empty in both styles: the verb has no such form; empty in one: this style does not use it
        cell.title = analysis.rows[tense].some(Boolean) ? NOT_USED : NO_FORM;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
