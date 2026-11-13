/*
 * Hindi page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Hindi.express)
 * and verbs.js (VERBS).
 *
 * The seven pills are the persons (मैं, तू, वह, हम, तुम, आप, वे), so the pill index
 * 0-6 selects analysis.rows[tense][person]. A cell is { hi, rom }, or null where that
 * person has no such form (the imperative has no मैं, वह or वे form). Forms that
 * depend on the subject's gender already hold the masculine and the feminine form
 * joined by " / ", in script and in romanization alike.
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NO_FORM = 'This verb has no such form for this person.';

  // बोलना -> "बोलना bolnā"
  const label = entry => `${entry.hi} ${entry.rom}`;

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other tense appears when the button is pressed.
    coreTenses: ['pres', 'past', 'fut'],
    unit: 'tenses',
    lang: 'hi',
    headword: entry => entry.hi,
    chipLabel: label,
    labelSeparator: ', ',
    titleClass: 'word',
    titleExtras: entry => [el('span', 'reading', entry.rom)],
    analyse: entry => Hindi.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, analysis, person) {
      const form = analysis.rows[tense][person];
      cell.classList.toggle('na', !form);
      if (form) {
        cell.removeAttribute('title');
        cell.replaceChildren(el('span', 'word', form.hi), el('span', 'reading', form.rom));
      } else {
        cell.title = NO_FORM;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
