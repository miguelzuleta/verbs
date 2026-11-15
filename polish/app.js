/*
 * Polish page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 *
 * Each entry is { pl: 'mówić', aspect: 'i' | 'p' | 'b' }. The aspect is shown on
 * the translation buttons and in the example column header. The imperative
 * forms for on / ona / ono and oni / one already begin with "niech", so they
 * get no person label; ty, my and wy do.
 */
(function () {
  'use strict';

  const ASPECT = { i: 'impf.', p: 'pf.', b: 'impf./pf.' };
  const NO_PRESENT = 'Perfective verbs have no present tense.';
  const IMPERATIVE = new Set(['imp', 'impNeg']);

  const polish = VerbKit.inflectedLanguage({
    lang: 'pl',
    conjugate,
    imperativeLabels: ['ja', 'ty', 'on / ona / ono', 'my', 'wy', 'oni / one'],
    imperativeTenses: ['imp', 'impNeg'],
  });

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'past', 'fut'],
    ...polish,
    analyse: entry => conjugate(entry.pl, entry.aspect),
    headword: entry => entry.pl,
    chipLabel: entry => `${entry.pl} (${ASPECT[entry.aspect]})`,
    exampleLabel: entry => `${entry.pl}, ${ASPECT[entry.aspect]}`,

    // "niech" forms carry their own person; a perfective verb has no present tense:
    // say why its cells show "—".
    fillCell(cell, tense, conjugated, person) {
      const form = conjugated.forms[tense][person];
      if (IMPERATIVE.has(tense) && form.startsWith('niech ')) cell.textContent = form;
      else polish.fillCell(cell, tense, conjugated, person);
      if (tense === 'pres' && conjugated.aspect === 'p') cell.title = NO_PRESENT;
      else cell.removeAttribute('title');
    },
  });
})();
