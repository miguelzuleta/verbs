/*
 * Portuguese page: describes the language to the shared page controller.
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
      lang: 'pt',
      conjugate,
      // The imperative has no 1st-person form: eu repeats tu. Everyday Brazilian
      // Portuguese uses você for the 2nd person, but the tu and vós slots stay.
      imperativeLabels: ['tu', 'tu', 'você', 'nós', 'vós', 'vocês'],
      imperativeTenses: ['impAff', 'impNeg'],
    }),
  });
})();
