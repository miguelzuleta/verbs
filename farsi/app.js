/*
 * Persian (Farsi) page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Farsi.express) and
 * verbs.js (VERBS).
 *
 * The six pills are the persons (man, to, u, mâ, shomâ, ânhâ). Persian is written
 * right to left, so every run of Persian script sits in its own right-to-left
 * isolate and the transliteration goes on a second line.
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NOT_USED = 'This verb has no such form.';
  // U+2067 / U+2069 isolate a right-to-left run inside left-to-right text
  const rtl = text => `⁧${text}⁩`;
  // The imperative has no man, u or ânhâ form, so those buttons show the nearest one.
  const IMPERATIVE = new Set(['impAff', 'impNeg']);
  const IMPERATIVE_LABELS = ['you', 'you', 'you', "let's", 'you (pl.)', 'you (pl.)'];

  const script = entry => entry.fa.replace('|', '');
  const reading = entry => entry.tr.replace('|', '');
  const label = entry => `${rtl(script(entry))} ${reading(entry)}`;

  function persian(text) {
    const run = el('bdi', '', text);
    run.lang = 'fa';
    run.dir = 'rtl';
    return run;
  }

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'past', 'fut'],
    unit: 'tenses',
    lang: 'fa',
    headword: entry => rtl(script(entry)),
    chipLabel: label,
    labelSeparator: '، ',
    titleClass: 'word-title',
    titleExtras: entry => [el('span', 'reading', reading(entry))],
    analyse: entry => Farsi.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, analysis, person) {
      const form = analysis.rows[tense][person];
      cell.classList.toggle('na', !form);
      if (form) {
        cell.removeAttribute('title');
        const word = el('span', 'word');
        word.append(persian(form.fa));
        const who = IMPERATIVE.has(tense) ? ` (${IMPERATIVE_LABELS[person]})` : '';
        cell.replaceChildren(word, el('span', 'reading', form.tr + who));
      } else {
        cell.title = NOT_USED;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
