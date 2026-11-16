/*
 * Icelandic page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 *
 * Each entry is { is: 'taka', parts: ['tek', 'tekur', 'tók', 'tókum', 'tekið'] }: the
 * infinitive and, for every verb except a regular weak verb in -aði, its five principal
 * parts. The engine builds every form from them.
 */
(function () {
  'use strict';

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'past', 'perf'],
    ...VerbKit.inflectedLanguage({
      lang: 'is',
      conjugate,
      // Only þú, við and þið have an imperative: ég and hann / hún / það have none
      // (the engine writes "—", which is shown without a label), and þeir / þær / þau neither.
      imperativeLabels: ['þú', 'þú', 'þú', 'við', 'þið', 'þið'],
      imperativeTenses: ['impAff'],
    }),
    // The database stores the infinitive in entry.is and the principal parts in entry.parts.
    analyse: entry => conjugate(entry.is, entry.parts),
    headword: entry => entry.is,
    chipLabel: entry => entry.is,
    // Icelandic infinitives are written in lower case.
    exampleLabel: (entry, conjugated) => conjugated.inf,
  });
})();
