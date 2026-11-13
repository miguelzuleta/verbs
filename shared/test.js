// Run with: node shared/test.js
// Checks the helpers in verb-kit.js that every site's engine and verb table relies on.
const { createReport } = require('./test-kit.js');
const {
  words, parseTable, plainEntry, findFamily, compound, affirmativeImperative, negativeImperative,
} = require('./verb-kit.js');

const report = createReport();
const same = (label, actual, expected) => {
  report.checks += 1;
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) report.fail(`${label}\n    expected: ${e}\n    actual:   ${a}`);
};
const throwsWith = (label, fn, pattern) => {
  report.checks += 1;
  try { fn(); } catch (error) {
    if (!pattern.test(error.message)) report.fail(`${label}: wrong error "${error.message}"`);
    return;
  }
  report.fail(`${label}: did not throw`);
};

// ---- words ----
same('words splits on any whitespace', words('  a b\n c\t d '), ['a', 'b', 'c', 'd']);

// ---- plainEntry ----
same('plainEntry without a note', plainEntry('es')('hablar'), { es: 'hablar' });
same('plainEntry with a note', plainEntry('ca')('saber (facts)'), { ca: 'saber', note: 'facts' });
same('plainEntry keeps commas inside the note', plainEntry('es')('saber (facts, how to)'), { es: 'saber', note: 'facts, how to' });
same('plainEntry puts the translation first', Object.keys(plainEntry('es')('saber (x)')), ['es', 'note']);
throwsWith('plainEntry rejects an unreadable entry', () => plainEntry('es')('(oops)', 'know'), /cannot read "\(oops\)" in "know"/);

// ---- parseTable ----
const table = `
    know: saber (facts, how to), conocer (people)

    speak: hablar
`;
same('parseTable reads lines, notes and lists', parseTable(table, plainEntry('es')), {
  know: [{ es: 'saber', note: 'facts, how to' }, { es: 'conocer', note: 'people' }],
  speak: [{ es: 'hablar' }],
});
same('parseTable keeps line order', Object.keys(parseTable(table, plainEntry('es'))), ['know', 'speak']);
same('parseTable keeps a phrasal verb key', Object.keys(parseTable('give up: rendirse', plainEntry('es'))), ['give up']);
throwsWith('parseTable rejects a duplicate English verb', () => parseTable('a: x\nb: y\na: z', plainEntry('es')), /duplicate English verb "a"/);
throwsWith('parseTable treats prototype names as ordinary keys', () => parseTable('constructor: x\nconstructor: y', plainEntry('es')), /duplicate English verb "constructor"/);
same('parseTable allows a first "constructor"', Object.keys(parseTable('constructor: x', plainEntry('es'))), ['constructor']);
let seen;
parseTable('speak: hablar', (entry, english) => { seen = [entry, english]; return {}; });
same('parseTable hands the reader the trimmed entry and the English verb', seen, ['hablar', 'speak']);

// ---- findFamily ----
const families = [
  { base: 'cobrir' },                                   // before obrir: descobrir ends in both
  { base: 'obrir', prefixes: ['', 're', 'entre'] },
  { base: 'tenir' },
];
same('findFamily: a bare verb has an empty prefix', findFamily('tenir', families).prefix, '');
same('findFamily: any prefix is accepted without a whitelist', findFamily('mantenir', families).prefix, 'man');
same('findFamily: a listed prefix is accepted', findFamily('reobrir', families).prefix, 're');
same('findFamily: an unlisted prefix is rejected', findFamily('xobrir', families), null);
same('findFamily: the first matching base wins', findFamily('descobrir', families).family.base, 'cobrir');
same('findFamily: no match', findFamily('parlar', families), null);
same('findFamily: a rejected whitelist falls through to later families',
  findFamily('xobrir', [{ base: 'obrir', prefixes: [''] }, { base: 'brir' }]).family.base, 'brir');

// ---- compound ----
same('compound', compound(['he', 'has'], 'hablado'), ['he hablado', 'has hablado']);

// ---- imperatives ----
const subjPres = ['s0', 's1', 's2', 's3', 's4', 's5'];
same('affirmativeImperative repeats tu in slot 0', affirmativeImperative({ tu: 'habla', subjPres, vosotros: 'hablad' }),
  ['habla', 'habla', 's2', 's3', 'hablad', 's5']);
same('affirmativeImperative accepts a nosotros override', affirmativeImperative({ tu: 've', subjPres, nosotros: 'vamos', vosotros: 'id' }),
  ['ve', 've', 's2', 'vamos', 'id', 's5']);
same('negativeImperative', negativeImperative(subjPres), ['no s1', 'no s1', 'no s2', 'no s3', 'no s4', 'no s5']);

report.finish(`${report.checks} shared-helper checks`);
