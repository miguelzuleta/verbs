/*
 * Bengali page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Bengali.express)
 * and verbs.js (VERBS).
 *
 * The six pills are the person / honorific levels (আমি, তুই, তুমি, আপনি, সে, তিনি; each
 * also covers its plural), so the pill index 0-5 selects analysis.rows[tense][person].
 * A cell is { bn, rom }, or null where that person has no such form (the imperative has
 * no আমি form). Bengali verbs do not change for gender, so a cell holds one form.
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NO_FORM = 'This verb has no such form for this person.';

  // কাজ করা -> "কাজ করা kaj kora"
  const label = entry => `${entry.bn} ${entry.rom}`;

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other tense appears when the button is pressed.
    coreTenses: ['pres', 'past', 'fut'],
    unit: 'tenses',
    lang: 'bn',
    headword: entry => entry.bn,
    chipLabel: label,
    labelSeparator: ', ',
    titleClass: 'word',
    titleExtras: entry => [el('span', 'reading', entry.rom)],
    analyse: entry => Bengali.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, analysis, person) {
      const form = analysis.rows[tense][person];
      cell.classList.toggle('na', !form);
      if (form) {
        cell.removeAttribute('title');
        cell.replaceChildren(el('span', 'word', form.bn), el('span', 'reading', form.rom));
      } else {
        cell.title = NO_FORM;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
