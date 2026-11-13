/*
 * Test helpers shared by every site's test.js (Node only).
 *
 *   const report = createReport();      // collects failures and counts checks
 *   checkParadigms(report, EXPECTED, conjugate);
 *   checkInflectedDatabase(report, { ... });
 *   report.finish('summary line');      // prints, and exits 1 if anything failed
 */

function createReport() {
  const failures = [];
  return {
    checks: 0,
    failures,
    fail: message => { failures.push(message); },
    // `limit` caps how many failures are printed (the rest are counted).
    finish(summary, { limit = Infinity } = {}) {
      console.log(summary);
      if (failures.length) {
        console.log(`\n${failures.length} FAILURE(S):\n`);
        failures.slice(0, limit).forEach(f => console.log('  ' + f));
        if (failures.length > limit) console.log(`  ... and ${failures.length - limit} more`);
        process.exit(1);
      }
      console.log('All checks passed.');
    },
  };
}

/*
 * Known paradigms: { infinitive: { tense: 'six forms joined by ", "' } }, where
 * `gerund` and `participle` are plain strings.
 */
function checkParadigms(report, expected, conjugate) {
  for (const [verb, tenses] of Object.entries(expected)) {
    const result = conjugate(verb);
    if (!result) { report.fail(`${verb}: conjugate() returned null`); continue; }
    for (const [tense, want] of Object.entries(tenses)) {
      report.checks += 1;
      const actual = tense === 'gerund' || tense === 'participle'
        ? result[tense]
        : result.forms[tense].join(', ');
      if (actual !== want) report.fail(`${verb}.${tense}\n    expected: ${want}\n    actual:   ${actual}`);
    }
  }
}

/*
 * Every verb in the database must conjugate into well-formed output: six forms
 * per tense, no `undefined`, and a plausible gerund and participle ending.
 * Returns the number of translations checked.
 */
function checkInflectedDatabase(report, { verbs, conjugate, lang, formKeys, gerund, participle }) {
  let count = 0;
  for (const [english, options] of Object.entries(verbs)) {
    for (const entry of options) {
      const word = entry[lang];
      count += 1;
      const result = conjugate(word);
      if (!result) { report.fail(`${english} -> ${word}: not an infinitive`); continue; }
      for (const key of formKeys) {
        const forms = result.forms[key];
        if (!Array.isArray(forms) || forms.length !== 6 || forms.some(f => !f || /undefined|NaN/.test(f))) {
          report.fail(`${english} -> ${word}: malformed ${key}: ${JSON.stringify(forms)}`);
        }
      }
      if (!gerund.test(result.gerund)) report.fail(`${word}: odd gerund ${result.gerund}`);
      if (!participle.test(result.participle)) report.fail(`${word}: odd participle ${result.participle}`);
    }
  }
  return count;
}

module.exports = { createReport, checkParadigms, checkInflectedDatabase };
