/*
 * Persian (Farsi) verb pattern engine: standard Iranian Persian, formal written style.
 *
 *   express({ fa: 'قبول کردن', tr: 'qabul kardan' }) -> { fa, tr, rows }
 *
 * Persian verbs do not change for gender. rows[key] is an array of six cells, one per
 * pronoun (man, to, u, mâ, shomâ, ânhâ); a cell is { fa, tr } (the form in Persian
 * script and in transliteration, built from the same pieces so they stay in step) or
 * null where the verb has no such form. express() throws for a verb it cannot conjugate
 * with confidence (a present stem it does not know); it never guesses.
 *
 * Entry (see verbs.js):
 *   fa, tr   the infinitive in script and transliteration. A compound verb is a word
 *            plus a light verb (قبول کردن qabul kardan): only the last word is
 *            conjugated. "|" marks an inseparable prefix (بر|داشتن bar|dâshtan): the
 *            prefix stays in front of the verb's own mi-, na- and be- (برمی‌دارم).
 *
 * The past stem is the infinitive without its final -an. The present stem is looked
 * up in STEMS, or, for the regular -idan and -ândan verbs, taken from the infinitive.
 *
 * Imperative slots: to/u/man share the 2nd person singular, shomâ/ânhâ the plural,
 * and mâ gives the "let's" form (the subjunctive: برویم).
 */
(function (global) {
  'use strict';

  const ZWNJ = '‌';
  const P = (fa, tr) => ({ fa, tr });
  const cat = (...ps) => P(ps.map(p => p.fa).join(''), ps.map(p => p.tr).join(''));
  const sp = (...ps) => P(ps.map(p => p.fa).join(' '), ps.map(p => p.tr).join(' '));
  const NOTHING = P('', '');

  // ---- Endings and auxiliaries ----------------------------------------------

  const PRES_END = [P('م', 'am'), P('ی', 'i'), P('د', 'ad'), P('یم', 'im'), P('ید', 'id'), P('ند', 'and')];
  const PAST_END = [P('م', 'am'), P('ی', 'i'), NOTHING, P('یم', 'im'), P('ید', 'id'), P('ند', 'and')];
  const CLITIC = [P('ام', 'am'), P('ای', 'i'), null, P('ایم', 'im'), P('اید', 'id'), P('اند', 'and')];
  const WAS = [P('بودم', 'budam'), P('بودی', 'budi'), P('بود', 'bud'), P('بودیم', 'budim'), P('بودید', 'budid'), P('بودند', 'budand')];
  const WILL = [P('خواهم', 'khâham'), P('خواهی', 'khâhi'), P('خواهد', 'khâhad'), P('خواهیم', 'khâhim'), P('خواهید', 'khâhid'), P('خواهند', 'khâhand')];
  const HAVE = [P('دارم', 'dâram'), P('داری', 'dâri'), P('دارد', 'dârad'), P('داریم', 'dârim'), P('دارید', 'dârid'), P('دارند', 'dârand')];
  const HAD = [P('داشتم', 'dâshtam'), P('داشتی', 'dâshti'), P('داشت', 'dâsht'), P('داشتیم', 'dâshtim'), P('داشتید', 'dâshtid'), P('داشتند', 'dâshtand')];
  const BE_SUBJ = [P('باشم', 'bâsham'), P('باشی', 'bâshi'), P('باشد', 'bâshad'), P('باشیم', 'bâshim'), P('باشید', 'bâshid'), P('باشند', 'bâshand')];
  const IS = [P('هستم', 'hastam'), P('هستی', 'hasti'), P('است', 'ast'), P('هستیم', 'hastim'), P('هستید', 'hastid'), P('هستند', 'hastand')];
  const ISNT = [P('نیستم', 'nistam'), P('نیستی', 'nisti'), P('نیست', 'nist'), P('نیستیم', 'nistim'), P('نیستید', 'nistid'), P('نیستند', 'nistand')];

  const MI = P('می' + ZWNJ, 'mi');
  const NEMI = P('نمی' + ZWNJ, 'nemi');
  const NA = P('ن', 'na');

  // ---- Present stems ---------------------------------------------------------
  // [stem in script, stem in transliteration]. Regular -idan and -ândan verbs are not
  // listed (see presentStem); neither is the copula بودن.

  const STEMS = Object.fromEntries(`
    رفتن:رو:rav آمدن:آ:â کردن:کن:kon شدن:شو:shav دادن:ده:deh داشتن:دار:dâr گفتن:گو:gu دیدن:بین:bin
    زدن:زن:zan گرفتن:گیر:gir خوردن:خور:khor بردن:بر:bar آوردن:آور:âvar خواستن:خواه:khâh
    دانستن:دان:dân توانستن:توان:tavân نشستن:نشین:neshin ایستادن:ایست:ist افتادن:افت:oft
    انداختن:انداز:andâz ساختن:ساز:sâz شناختن:شناس:shenâs باختن:باز:bâz آموختن:آموز:âmuz
    سوختن:سوز:suz دوختن:دوز:duz فروختن:فروش:forush پختن:پز:paz ریختن:ریز:riz
    گریختن:گریز:goriz آمیختن:آمیز:âmiz آویختن:آویز:âviz انگیختن:انگیز:angiz نهادن:نه:nah
    فرستادن:فرست:ferest گذاشتن:گذار:gozâr کاشتن:کار:kâr گذشتن:گذر:gozar نوشتن:نویس:nevis
    گشتن:گرد:gard کشتن:کش:kosh کندن:کن:kan بستن:بند:band شکستن:شکن:shekan پذیرفتن:پذیر:pazir
    یافتن:یاب:yâb تافتن:تاب:tâb شتافتن:شتاب:shetâb روفتن:روب:rub چیدن:چین:chin شنیدن:شنو:shenav
    دویدن:دو:dav مردن:میر:mir پرداختن:پرداز:pardâz شمردن:شمار:shomâr سپردن:سپار:separ
    آزردن:آزار:âzâr افسردن:افسر:afsor فشردن:فشار:feshâr گماشتن:گمار:gomâr پنداشتن:پندار:pendâr
    انگاشتن:انگار:engâr ربودن:ربا:robâ فرمودن:فرما:farmâ نمودن:نما:nomâ گشودن:گشا:goshâ
    آسودن:آسا:âsâ پیمودن:پیما:peymâ ستودن:ستا:setâ سرودن:سرا:sarâ زدودن:زدا:zodâ
    افزودن:افزا:afzâ آلودن:آلا:âlâ شنودن:شنو:shenav گسستن:گسل:gosal رستن:روی:ruy
    جستن:جو:ju شستن:شوی:shuy خفتن:خواب:khâb نگریستن:نگر:negar آراستن:آرا:ârâ پیراستن:پیرا:pirâ
    کاستن:کاه:kâh آفریدن:آفرین:âfarin زاییدن:زا:zâ بوییدن:بو:bu پوییدن:پو:pu آرمیدن:آرام:ârâm
    ماندن:مان:mân خواندن:خوان:khân راندن:ران:rân افشاندن:افشان:afshân رساندن:رسان:resân
    پوشاندن:پوشان:pushân نشاندن:نشان:neshân گردانیدن:گردان:gardân
    انباشتن:انبار:anbâr خاستن:خیز:khiz شکفتن:شکف:shekof
    پیوستن:پیوند:peyvand
    بافتن:باف:bâf پژمردن:پژمر:pazhmor نواختن:نواز:navâz
    فریفتن:فریب:farib شکافتن:شکاف:shekâf
  `.trim().split(/\s+/).map(item => { const [fa, stemFa, stemTr] = item.split(':'); return [fa, P(stemFa, stemTr)]; }));

  function presentStem(core) {
    if (Object.hasOwn(STEMS, core.fa)) return STEMS[core.fa];
    // regular: -idan (خندیدن khandidan -> خند khand) and the causatives in -ândan (گرداندن)
    if (core.fa.endsWith('یدن') && core.tr.endsWith('idan')) return P(core.fa.slice(0, -3), core.tr.slice(0, -4));
    if (core.fa.endsWith('اندن') && core.tr.endsWith('ândan')) return P(core.fa.slice(0, -2), core.tr.slice(0, -3));
    throw new Error(`no present stem known for ${core.fa} ${core.tr}`);
  }

  // ---- Reading an entry --------------------------------------------------------

  function parse(entry) {
    const faWords = String(entry.fa).trim().split(/\s+/);
    const trWords = String(entry.tr).trim().split(/\s+/);
    if (faWords.length !== trWords.length) throw new Error(`"${entry.fa}" and "${entry.tr}" have different numbers of words`);
    const clean = w => w.replace('|', '');
    const lead = faWords.slice(0, -1).map((w, i) => P(clean(w), clean(trWords[i])));
    const lastFa = faWords[faWords.length - 1];
    const lastTr = trWords[trWords.length - 1];
    const barFa = lastFa.indexOf('|');
    const barTr = lastTr.indexOf('|');
    if ((barFa < 0) !== (barTr < 0)) throw new Error(`"|" in only one of "${lastFa}" and "${lastTr}"`);
    const prefix = barFa >= 0 ? P(lastFa.slice(0, barFa), lastTr.slice(0, barTr)) : null;
    const core = barFa >= 0 ? P(lastFa.slice(barFa + 1), lastTr.slice(barTr + 1)) : P(lastFa, lastTr);
    if (!core.fa.endsWith('ن') || !core.tr.endsWith('an')) throw new Error(`"${core.fa} ${core.tr}" is not an infinitive`);
    const past = P(core.fa.slice(0, -1), core.tr.slice(0, -2));
    const isBe = core.fa === 'بودن' && !prefix;
    const present = isBe ? P('باش', 'bâsh') : presentStem(core);
    return {
      lead, prefix: prefix || NOTHING, core, past, present, isBe,
      isHave: core.fa === 'داشتن' && !prefix,
      stative: !prefix && ['دانستن', 'توانستن', 'خواستن'].includes(core.fa),
      display: P(clean(faWords.join(' ')), clean(trWords.join(' '))),
    };
  }

  // ---- The prefixes be- and na- -----------------------------------------------
  // be-/na- go in front of a stem. A stem that starts with آ or ا takes ی: آ -> بیا (بیایم, نیامد),
  // ا -> بی (بیفتم, نینداخت); ایست- is the exception (بایست).

  function mark(piece, kind) {
    const be = kind === 'be';
    const c = be ? P('ب', 'be') : P('ن', 'na');
    if (piece.fa.startsWith('ایست')) return P(c.fa + piece.fa, (be ? 'bâ' : 'nâ') + piece.tr);
    if (piece.fa.startsWith('آ')) return P(c.fa + 'یا' + piece.fa.slice(1), (be ? 'bi' : 'ni') + 'y' + piece.tr);
    if (piece.fa.startsWith('ا')) return P(c.fa + 'ی' + piece.fa.slice(1), (be ? 'bi' : 'ni') + 'y' + piece.tr);
    return cat(c, piece);
  }

  // A stem that ends in a vowel (آ, گو) takes ی before the ending: می‌آیم, می‌گویم.
  const endsInVowel = stem => /[aeiouâ]$/.test(stem.tr);
  const withEnding = (piece, stem, p) =>
    endsInVowel(stem) ? cat(piece, P('ی', 'y'), PRES_END[p]) : cat(piece, PRES_END[p]);

  // ---- The rows ----------------------------------------------------------------

  const ROW_KEYS = [
    'pres', 'presProg', 'past', 'pastCont', 'pastProg', 'presPerf', 'pastPerf', 'fut',
    'negPres', 'negPast', 'subj', 'subjPerf', 'impAff', 'impNeg',
  ];

  function rowsFor(v) {
    const { lead, prefix, core, past, present, isBe, isHave } = v;
    const word = (...pieces) => sp(...lead, cat(prefix, ...pieces));
    const participle = cat(past, P('ه', 'e'));
    // be- is dropped after a prefix and in compounds with کردن or شدن (قبول کنم, خوشحال شوم)
    const dropBe = prefix.fa !== '' || isBe || (lead.length > 0 && (core.fa === 'کردن' || core.fa === 'شدن'));
    const beStem = dropBe ? present : mark(present, 'be');
    const naStem = mark(present, 'na');

    const pres = p => word(MI, withEnding(present, present, p));
    const pastCont = p => word(MI, past, PAST_END[p]);
    const subj = p => word(withEnding(beStem, present, p));
    const negSubj = p => word(withEnding(naStem, present, p));

    const rows = {
      pres,
      presProg: p => sp(HAVE[p], pres(p)),
      past: p => word(past, PAST_END[p]),
      pastCont,
      pastProg: p => sp(HAD[p], pastCont(p)),
      presPerf: p => (p === 2 ? sp(...lead, cat(prefix, participle), P('است', 'ast')) : word(participle, P(ZWNJ, ''), CLITIC[p])),
      pastPerf: p => sp(...lead, cat(prefix, participle), WAS[p]),
      fut: p => sp(...lead, cat(prefix, WILL[p]), past),
      negPres: p => word(NEMI, withEnding(present, present, p)),
      negPast: p => word(mark(past, 'na'), PAST_END[p]),
      subj,
      subjPerf: p => sp(...lead, cat(prefix, participle), BE_SUBJ[p]),
      impAff: p => (p === 3 ? subj(3) : p >= 4 ? subj(4) : word(beStem)),
      impNeg: p => (p === 3 ? negSubj(3) : p >= 4 ? negSubj(4) : word(naStem)),
    };

    if (isBe) {           // to be: هستم / نیستم, no progressive forms
      rows.pres = p => sp(...lead, IS[p]);
      rows.negPres = p => sp(...lead, ISNT[p]);
      rows.presProg = rows.pastCont = rows.pastProg = null;
    }
    if (isHave) {         // to have: دارم, no mi- and no progressive; subjunctive داشته باشم
      rows.pres = p => sp(...lead, HAVE[p]);
      rows.negPres = p => sp(...lead, cat(NA, HAVE[p]));
      rows.presProg = rows.pastCont = rows.pastProg = null;
      const had = (neg, ending) => sp(...lead, neg ? mark(participle, 'na') : participle, ending);
      rows.subj = p => had(false, BE_SUBJ[p]);
      const ending = p => (p === 3 ? BE_SUBJ[3] : p >= 4 ? BE_SUBJ[4] : P('باش', 'bâsh'));
      rows.impAff = p => had(false, ending(p));
      rows.impNeg = p => had(true, ending(p));
    }
    if (v.stative) rows.presProg = rows.pastProg = null;
    return rows;
  }

  function express(entry) {
    const v = parse(entry);
    const builders = rowsFor(v);
    const rows = {};
    for (const key of ROW_KEYS) {
      rows[key] = builders[key] ? [0, 1, 2, 3, 4, 5].map(p => builders[key](p)) : Array(6).fill(null);
    }
    return { fa: v.display.fa, tr: v.display.tr, rows };
  }

  const api = { express, ROW_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Farsi = api;
})(typeof window !== 'undefined' ? window : globalThis);
