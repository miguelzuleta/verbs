/*
 * Helpers shared by the engines and verb tables of every language site.
 *
 * Loaded as a plain script in the browser (everything lands on `VerbKit`) and
 * with require() under Node.
 *
 *   words(text)                       'a b  c' -> ['a', 'b', 'c']
 *   parseTable(table, readEntry)      verb table text -> { english: [entry, ...] }
 *   plainEntry(lang)                  entry reader for `word (note)` entries
 *
 * For languages whose verbs inflect for person (Spanish, Catalan, ...):
 *
 *   findFamily(inf, families)         irregular family a prefixed verb belongs to
 *   compound(auxiliaryForms, rest)    auxiliary + participle/infinitive, per person
 *   affirmativeImperative(parts)      the six-slot affirmative imperative
 *   negativeImperative(subjPres)      the six-slot negative imperative
 */
(function (global) {
  'use strict';

  // ---- Text ----------------------------------------------------------------

  const words = text => text.trim().split(/\s+/);

  // ---- Verb tables -----------------------------------------------------------

  /*
   * Each line of a verb table reads `english: translation, translation (note)`.
   * Commas inside parentheses belong to the note, not to the list. `readEntry`
   * turns one translation (already trimmed) into the language's entry object;
   * it also receives the English verb, for error messages. A duplicate English
   * verb is an error.
   */
  function parseTable(table, readEntry) {
    const verbs = {};
    for (const line of table.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const colon = trimmed.indexOf(':');
      const english = trimmed.slice(0, colon).trim();
      if (Object.hasOwn(verbs, english)) throw new Error(`verbs.js: duplicate English verb "${english}"`);
      verbs[english] = trimmed
        .slice(colon + 1)
        .split(/,\s*(?![^()]*\))/)
        .map(entry => readEntry(entry.trim(), english));
    }
    return verbs;
  }

  // "saber (facts)" -> { [lang]: 'saber', note: 'facts' }; "hablar" -> { [lang]: 'hablar' }
  const plainEntry = lang => (entry, english) => {
    const match = entry.match(/^([^(]+?)\s*(?:\((.*)\))?$/);
    if (!match) throw new Error(`verbs.js: cannot read "${entry}" in "${english}"`);
    const [, word, note] = match;
    return note ? { [lang]: word, note } : { [lang]: word };
  };

  // ---- Inflecting languages ---------------------------------------------------

  /*
   * Irregular verbs pass their pattern on to prefixed relatives (tener ->
   * mantener, tenir -> mantenir). `families` is an ordered list of
   * `{ base, prefixes? }`; the first family whose base ends the verb wins, so
   * list a longer base before a shorter one it contains. Any prefix is accepted
   * unless the family lists the `prefixes` it allows (for bases like Spanish
   * `ver`, which also ends `volver`). Returns { family, prefix } or null.
   */
  function findFamily(inf, families) {
    for (const family of families) {
      if (!inf.endsWith(family.base)) continue;
      const prefix = inf.slice(0, inf.length - family.base.length);
      if (!family.prefixes || family.prefixes.includes(prefix)) return { family, prefix };
    }
    return null;
  }

  // Each auxiliary form followed by the rest of the verb phrase:
  // compound(['he', 'has'], 'hablado') -> ['he hablado', 'has hablado'].
  const compound = (auxiliaryForms, rest) => auxiliaryForms.map(form => `${form} ${rest}`);

  /*
   * Imperatives are indexed by person like every other tense. The imperative has
   * no 1st-person-singular form, so slot 0 repeats the 2nd person.
   */
  const affirmativeImperative = ({ tu, subjPres, nosotros = subjPres[3], vosotros }) =>
    [tu, tu, subjPres[2], nosotros, vosotros, subjPres[5]];

  // Negative commands borrow the present subjunctive.
  const negativeImperative = subjPres => [1, 1, 2, 3, 4, 5].map(i => 'no ' + subjPres[i]);

  const api = {
    words, parseTable, plainEntry,
    findFamily, compound, affirmativeImperative, negativeImperative,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.assign(global.VerbKit = global.VerbKit || {}, api);
})(typeof window !== 'undefined' ? window : globalThis);
