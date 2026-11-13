/*
 * Russian page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 *
 * Each entry is { ru: 'говори́ть', aspect: 'i' | 'p' | 'b' }. The headword keeps
 * its stress mark; the engine's forms have none. The aspect is shown on the
 * translation buttons and in the example column header.
 */
(function () {
  'use strict';

  const ASPECT = { i: 'impf.', p: 'pf.', b: 'impf./pf.' };
  const NO_PRESENT = 'Perfective verbs have no present tense.';

  const russian = VerbKit.inflectedLanguage({
    lang: 'ru',
    conjugate,
    // Only ты, мы and вы have an imperative: я and он fall back to ты, они to вы.
    imperativeLabels: ['ты', 'ты', 'ты', 'мы', 'вы', 'вы'],
    imperativeTenses: ['imp', 'impNeg'],
  });

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'past', 'fut'],
    ...russian,
    analyse: entry => conjugate(entry.ru, entry.aspect),
    headword: entry => entry.ru,
    chipLabel: entry => `${entry.ru} (${ASPECT[entry.aspect]})`,
    exampleLabel: entry => `${entry.ru}, ${ASPECT[entry.aspect]}`,

    // A perfective verb has no present tense: say why its cells show "—".
    fillCell(cell, tense, conjugated, person) {
      russian.fillCell(cell, tense, conjugated, person);
      if (tense === 'pres' && conjugated.aspect === 'p') cell.title = NO_PRESENT;
      else cell.removeAttribute('title');
    },
  });
})();
