/*
 * Arabic page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, patterns.js (Arabic.express) and
 * verbs.js (VERBS).
 *
 * The thirteen pills are the persons the verb agrees with: ana, anta, anti, huwa, hiya,
 * naḥnu, antumā (you two), antum, antunna, humā (m.), humā (f.), hum, hunna. Arabic is
 * written right to left, so every run of Arabic script sits in its own right-to-left
 * isolate and the transliteration goes on a second line. analysis.rows[tense] holds
 * thirteen cells, each { ar, tr } or null where that person has no such form (the
 * imperative exists only for you; some verbs have no passive).
 */
(function () {
  'use strict';

  const { el } = VerbKit;
  const NOT_USED = 'This verb has no such form for this person.';
  // U+2067 / U+2069 isolate a right-to-left run inside left-to-right text
  const rtl = text => `\u2067${text}\u2069`;

  // The citation form (he, past) and its transliteration come from the engine. Only these two
  // strings are kept, because the lookup list needs one for every translation of every verb;
  // translations that share a form and root (a third of them do) are built once.
  const citations = new Map();
  function citation(entry) {
    const key = `${entry.form}:${entry.root}:${entry.vowels || ''}`;
    if (!citations.has(key)) {
      const { ar, tr } = Arabic.express(entry);
      citations.set(key, { ar, tr });
    }
    return citations.get(key);
  }

  const label = entry => `${rtl(citation(entry).ar)} ${citation(entry).tr}`;

  function arabic(text) {
    const run = el('bdi', '', text);
    run.lang = 'ar';
    run.dir = 'rtl';
    return run;
  }

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    // Rows shown by default; every other row appears when the button is pressed.
    coreTenses: ['past', 'pres', 'fut'],
    unit: 'tenses',
    lang: 'ar',
    headword: entry => rtl(citation(entry).ar),
    chipLabel: label,
    labelSeparator: '، ',
    titleClass: 'word-title',
    titleExtras: entry => [el('span', 'reading', citation(entry).tr)],
    analyse: entry => Arabic.express(entry),
    exampleLabel: label,

    fillCell(cell, tense, analysis, person) {
      const form = analysis.rows[tense][person];
      cell.classList.toggle('na', !form);
      if (form) {
        cell.removeAttribute('title');
        const word = el('span', 'word');
        word.append(arabic(form.ar));
        cell.replaceChildren(word, el('span', 'reading', form.tr));
      } else {
        cell.title = NOT_USED;
        cell.replaceChildren(el('span', '', '—'));
      }
    },
  });
})();
