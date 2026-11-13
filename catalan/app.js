/*
 * Catalan page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 */
(function () {
  'use strict';

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'periphPast', 'fut'],
    ...VerbKit.inflectedLanguage({
      lang: 'ca',
      conjugate,
      // The imperative has no "jo" form, so that choice falls back to tu.
      imperativeLabels: ['tu', 'tu', 'vostè', 'nosaltres', 'vosaltres', 'vostès'],
    }),
  });
})();
