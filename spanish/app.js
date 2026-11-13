/*
 * Spanish page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 */
(function () {
  'use strict';

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'pret', 'fut'],
    ...VerbKit.inflectedLanguage({
      lang: 'es',
      conjugate,
      // The imperative has no "yo" form, so that choice falls back to tú.
      imperativeLabels: ['tú', 'tú', 'usted', 'nosotros', 'vosotros', 'ustedes'],
    }),
  });
})();
