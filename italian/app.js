/*
 * Italian page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 */
(function () {
  'use strict';

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'passProx', 'futSem'],
    ...VerbKit.inflectedLanguage({
      lang: 'it',
      conjugate,
      // The imperative has no 1st-person form: io repeats tu. Lei and Loro are the
      // polite 3rd-person forms, so they stay as separate labels.
      imperativeLabels: ['tu', 'tu', 'Lei', 'noi', 'voi', 'Loro'],
      imperativeTenses: ['impAff', 'impNeg'],
    }),
  });
})();
