/*
 * Swahili page: describes the language to the shared page controller.
 * Depends on shared/verb-kit.js, shared/page.js, conjugate.js (conjugate) and
 * verbs.js (VERBS).
 */
(function () {
  'use strict';

  VerbKit.startPage({
    verbs: VERBS,
    initialVerb: 'speak',
    coreTenses: ['pres', 'past', 'fut'],
    ...VerbKit.inflectedLanguage({
      lang: 'sw',
      conjugate,
      // The imperative has only wewe and ninyi, so mimi, yeye and wao show "—";
      // sisi has no form either and shows "—" as well.
      imperativeLabels: ['wewe', 'wewe', 'wewe', 'sisi', 'ninyi', 'ninyi'],
      imperativeTenses: ['imp'],
    }),
  });
})();
