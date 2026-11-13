/*
 * German page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 */
(function () {
  'use strict';

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'perfekt', 'fut1'],
    ...VerbKit.inflectedLanguage({
      lang: 'de',
      conjugate,
      // Only du, wir, ihr and Sie have an imperative: ich and er / sie / es fall back to du.
      imperativeLabels: ['du', 'du', 'du', 'wir', 'ihr', 'Sie'],
      imperativeTenses: ['imp'],
    }),
    // The database marks a separable prefix with "|" (auf|stehen); the page shows "aufstehen".
    headword: entry => entry.de.replace('|', ''),
    // German infinitives are written in lower case (a capital letter would make it a noun).
    exampleLabel: (entry, conjugated) => conjugated.inf,
  });
})();
