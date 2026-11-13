/*
 * Korean page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Korean.express,
 * Korean.romanize) and verbs.js (VERBS).
 *
 * The three buttons (pills) pick the speech level, so the pill index 0, 1, 2
 * selects the 해요체, 합쇼체 or 해체 cell of each row.
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NOT_USED = 'This form is not used at this level.';

  // 말하다 -> "말하다 malhada"
  const label = entry => `${entry.ko} ${Korean.romanize(entry.ko)}`;

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other form appears when the button is pressed.
    coreTenses: ['pres', 'past', 'fut'],
    unit: 'forms',
    lang: 'ko',
    headword: entry => entry.ko,
    chipLabel: label,
    labelSeparator: ', ',
    titleClass: 'word',
    titleExtras: entry => [el('span', 'reading', Korean.romanize(entry.ko))],
    analyse: entry => Korean.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, analysis, pill) {
      const form = analysis.rows[tense][pill];
      cell.classList.toggle('na', !form);
      if (form) {
        cell.removeAttribute('title');
        cell.replaceChildren(el('span', 'word', form.ko), el('span', 'reading', form.rom));
      } else {
        cell.title = NOT_USED;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
