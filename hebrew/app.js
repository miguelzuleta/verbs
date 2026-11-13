/*
 * Hebrew page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Hebrew.express) and
 * verbs.js (VERBS).
 *
 * The ten pills are the persons (ani, ata, at, hu, hi, anakhnu, atem, aten, hem,
 * hen): Hebrew verbs agree with the subject in gender as well as person. Hebrew is
 * written right to left, so every run of Hebrew script sits in its own right-to-left
 * isolate and the transliteration goes on a second line. analysis.rows[tense] holds
 * ten cells, each { he, tr } or null where that person has no such form (the
 * imperative exists only for you; the verb "to be" has no present tense).
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NOT_USED = 'This verb has no such form for this person.';
  // U+2067 / U+2069 isolate a right-to-left run inside left-to-right text
  const rtl = text => `\u2067${text}\u2069`;

  // Entries carry the infinitive in script; its transliteration is built by the engine.
  const readings = new Map();
  function reading(entry) {
    if (!readings.has(entry)) readings.set(entry, Hebrew.express(entry).tr);
    return readings.get(entry);
  }

  const label = entry => `${rtl(entry.he)} ${reading(entry)}`;

  function hebrew(text) {
    const run = el('bdi', '', text);
    run.lang = 'he';
    run.dir = 'rtl';
    return run;
  }

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other row appears when the button is pressed.
    coreTenses: ['pres', 'past', 'fut'],
    unit: 'tenses',
    lang: 'he',
    headword: entry => rtl(entry.he),
    chipLabel: label,
    labelSeparator: ', ',
    titleClass: 'word-title',
    titleExtras: entry => [el('span', 'reading', reading(entry))],
    analyse: entry => Hebrew.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, analysis, person) {
      const form = analysis.rows[tense][person];
      cell.classList.toggle('na', !form);
      if (form) {
        cell.removeAttribute('title');
        const word = el('span', 'word');
        word.append(hebrew(form.he));
        cell.replaceChildren(word, el('span', 'reading', form.tr));
      } else {
        cell.title = NOT_USED;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
