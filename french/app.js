/*
 * French page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 */
(function () {
  'use strict';

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'passeComp', 'fut'],
    ...VerbKit.inflectedLanguage({
      lang: 'fr',
      conjugate,
      // Only tu, nous and vous have an imperative: je and il fall back to tu, ils to vous.
      imperativeLabels: ['tu', 'tu', 'tu', 'nous', 'vous', 'vous'],
      imperativeTenses: ['impPres', 'impPast'],
    }),
  });
})();
