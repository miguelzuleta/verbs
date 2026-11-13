/*
 * Japanese verb patterns.
 *
 *   express({ ja: '話す', rd: 'はなす', tag: 'g' }) -> { ja, rd, rows }
 *
 * Japanese verbs do not change for person. They change for style (polite or
 * plain), tense, mood and voice, and every change touches only the end of the
 * dictionary form. So each entry of `rows` is one verb form, and rows[key] is an
 * array of TWO cells: index 0 is the POLITE style (-ます), index 1 the PLAIN
 * style (dictionary style). A cell is { ja, rd } (the form written with kanji,
 * and its full hiragana reading) or null where that style does not use the form.
 *
 * Verb entries:
 *   ja   dictionary form with kanji and okurigana ('話す', '食べる', '勉強する',
 *        'ダウンロードする'); no spaces
 *   rd   its full reading in hiragana ('はなす', 'だうんろーど…'); the same kana
 *        change is applied to ja and to rd, so both spellings stay in step
 *   tag  'g' godan, 'i' ichidan, 's' する (also noun+する), 'k' 来る (くる, also
 *        〜て来る)
 *
 * The 16 keys, in order (examples for 話す, polite / plain):
 *   pres 話します / 話す            past 話しました / 話した
 *   neg 話しません / 話さない       pastNeg 話しませんでした / 話さなかった
 *   te 話して (both styles)         prog 話しています / 話している
 *   request 話してください / 話して want 話したいです / 話したい
 *   potential 話せます / 話せる     passive 話されます / 話される
 *   causative 話させます / 話させる volitional 話しましょう / 話そう
 *   condTara 話しましたら / 話したら condBa null / 話せば
 *   imperative 話しなさい / 話せ    prohibitive 話さないでください / 話すな
 *
 * Invalid input: express() THROWS an Error whose message starts with
 * "japanese express():" when the entry is not an object, ja or rd is missing or
 * contains spaces, the tag is not one of g i s k, the ending of ja/rd does not
 * fit the tag (a godan verb must end in う く ぐ す つ ぬ ぶ む る, an ichidan verb in
 * る after an i- or e-row kana, a する verb in する, a 来る verb in 来る/くる), or
 * the verb is one it cannot conjugate safely (see 行く and 問う below, and 為る).
 * It never returns partial or garbled rows.
 *
 * Irregular details handled here:
 *   - 行く (also 逝く 往く 征く, and the kana spelling いく): て/た = って/った.
 *     The reading ゆく is rejected (its て-form is 行って, read いって).
 *   - 問う 請う 乞う: て/た = うて/うた. The kana spellings とう / こう are rejected
 *     because several verbs share them.
 *   - ある / 有る / 在る / である: plain negative ない (ではない), polite ありません.
 *   - 下さる なさる いらっしゃる おっしゃる (仰る): the polite stem ends in い
 *     (下さいます), the plain imperative is that stem (下さい).
 *   - 来る: the reading of 来 is き / こ / く, so it has its own table.
 *   - noun+する: potential is the noun + できる; a single-kanji noun (接する)
 *     uses 接することができる, because 接できる is not Japanese. "Nをする" has the
 *     potential Nをすることができる (あくびをすることができる; あくびができる is
 *     not right for every noun), and "Nとする" (必要とする) uses とすることができる.
 *   - 愛する: 愛さない, 愛せる (the common forms of this single-kanji verb).
 *   - 罰する 発する 帰する: the passive is 罰せられる 発せられる 帰せられる (not
 *     罰される, which is not the standard form).
 *   - くれる: the plain imperative is くれ (くれろ is the rarer form).
 *   - いる (be, exist) has no progressive (いている is not Japanese).
 *   - 思える (like 見える) already means "can be thought", so it has no potential.
 *
 * Forms that do not exist (for example the passive of ある or the imperative of
 * できる) are null in both styles; see BLOCK below.
 */
(function (global) {
  'use strict';

  const { words } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const ROW_KEYS = [
    'pres', 'past', 'neg', 'pastNeg', 'te', 'prog', 'request', 'want',
    'potential', 'passive', 'causative', 'volitional', 'condTara', 'condBa',
    'imperative', 'prohibitive',
  ];

  function fail(message) {
    throw new Error('japanese express(): ' + message);
  }

  // ---- Spelling pairs ----------------------------------------------------------
  // A pair is a form written two ways: { ja, rd }. Every change is made to both.

  const pair = (ja, rd) => ({ ja, rd });
  const add = (p, suffix) => pair(p.ja + suffix, p.rd + suffix);
  const cut = (p, count) => pair(p.ja.slice(0, -count), p.rd.slice(0, -count));
  const cell = p => (p ? { ja: p.ja, rd: p.rd } : null);
  // 話せる -> 話せます (potential, passive and causative all end in る)
  const polite = p => add(cut(p, 1), 'ます');

  // ---- Godan -----------------------------------------------------------------------
  // For each final kana: the a-, i-, e- and o-row kana, then the て and た endings.

  const GODAN = {
    う: { a: 'わ', i: 'い', e: 'え', o: 'お', te: 'って', ta: 'った' },
    く: { a: 'か', i: 'き', e: 'け', o: 'こ', te: 'いて', ta: 'いた' },
    ぐ: { a: 'が', i: 'ぎ', e: 'げ', o: 'ご', te: 'いで', ta: 'いだ' },
    す: { a: 'さ', i: 'し', e: 'せ', o: 'そ', te: 'して', ta: 'した' },
    つ: { a: 'た', i: 'ち', e: 'て', o: 'と', te: 'って', ta: 'った' },
    ぬ: { a: 'な', i: 'に', e: 'ね', o: 'の', te: 'んで', ta: 'んだ' },
    ぶ: { a: 'ば', i: 'び', e: 'べ', o: 'ぼ', te: 'んで', ta: 'んだ' },
    む: { a: 'ま', i: 'み', e: 'め', o: 'も', te: 'んで', ta: 'んだ' },
    る: { a: 'ら', i: 'り', e: 'れ', o: 'ろ', te: 'って', ta: 'った' },
  };

  // 行く and its other spellings (and kana いく) take って, not いて.
  const IKU = /(?:[行逝往征]|い)く$/;
  // Read ゆく, the て-form is still written 行って but read いって, so ja and rd would
  // not change in step: not supported (use いく).
  const YUKU = /(?:[行逝往征]|ゆ)く$/;
  // 問う 請う 乞う keep the う: 問うて, 問うた.
  const TOU = /[問請乞]う$/;
  // Honorific verbs whose polite stem ends in い (下さいます), not り.
  const HONORIFIC_RD = ['くださる', 'なさる', 'いらっしゃる', 'おっしゃる'];

  // Forms a kind of verb does not use, nulled in both styles (`both`) or in the
  // polite style only (`polite`).
  const NO_BLOCK = { both: [], polite: [] };
  const BLOCK = {
    // existence and need: no "being existed", no command
    aru: { both: ['prog', 'request', 'want', 'potential', 'passive', 'causative', 'imperative', 'prohibitive'], polite: [] },
    need: { both: ['prog', 'request', 'want', 'potential', 'passive', 'causative', 'imperative', 'prohibitive'], polite: [] },
    // できる is already a potential
    dekiru: { both: ['request', 'want', 'potential', 'passive', 'causative', 'imperative', 'prohibitive'], polite: [] },
    // 分かる has no potential or passive and is not commanded
    wakaru: { both: ['potential', 'passive', 'imperative', 'prohibitive'], polite: [] },
    // 見える / 聞こえる already mean "can be seen / heard"
    mieru: { both: ['request', 'want', 'potential', 'passive', 'causative', 'imperative', 'prohibitive'], polite: [] },
    // いる (be, exist) has no progressive, like ある
    iru: { both: ['prog'], polite: [] },
    // くれる (give to me): no くれてください, くれたい, くれられる or くれなさい
    kureru: { both: ['request', 'want', 'potential', 'passive', 'causative'], polite: ['imperative'] },
    // 下さる なさる いらっしゃる おっしゃる: honorific, so no further derivations
    honorific: { both: ['request', 'want', 'potential', 'passive', 'causative', 'volitional', 'prohibitive'], polite: ['imperative'] },
  };

  function godan(dict) {
    const { ja, rd } = dict;
    const last = rd.slice(-1);
    const row = Object.hasOwn(GODAN, last) ? GODAN[last] : null;
    if (!row || ja.slice(-1) !== last) {
      fail(`godan verb "${ja}" (${rd}) must end in う く ぐ す つ ぬ ぶ む る, in the same kana in ja and rd`);
    }
    if (last === 'く' && rd.endsWith('ゆく') && YUKU.test(ja)) {
      fail(`"${ja}" (${rd}): the reading ゆく is not supported because its て-form is read いって; use the reading いく`);
    }
    if (ja === 'とう' || ja === 'こう') {
      fail(`"${ja}": write 問う / 乞う / 請う with kanji, because their て-form is とうて / こうて, not とって`);
    }
    const stem = cut(dict, 1);
    const honorific = last === 'る' && HONORIFIC_RD.some(ending => rd.endsWith(ending));

    let te = row.te;
    let ta = row.ta;
    if (last === 'く' && IKU.test(ja)) { te = 'って'; ta = 'った'; }
    if (last === 'う' && TOU.test(ja)) { te = 'うて'; ta = 'うた'; }

    const c = {
      dict,
      i: add(stem, honorific ? 'い' : row.i),
      neg: add(stem, row.a + 'ない'),
      te: add(stem, te),
      ta: add(stem, ta),
      potential: add(stem, row.e + 'る'),
      passive: add(stem, row.a + 'れる'),
      causative: add(stem, row.a + 'せる'),
      vol: add(stem, row.o + 'う'),
      ba: add(stem, row.e + 'ば'),
      imp: add(stem, honorific ? 'い' : row.e),
      proh: add(dict, 'な'),
      blocks: honorific ? BLOCK.honorific : null,
    };

    // ある / 有る / 在る / である: the plain negative is ない (ではない), not あらない.
    const aru = rd.endsWith('ある') ? /(ある|有る|在る)$/.exec(ja) : null;
    if (aru) {
      const prefix = pair(ja.slice(0, -aru[1].length), rd.slice(0, -2));
      if (prefix.ja === '' && prefix.rd === '') {
        c.neg = pair('ない', 'ない');
        c.negPolite = add(c.i, 'ません');
        c.blocks = BLOCK.aru;
      } else if (prefix.ja === 'で' && prefix.rd === 'で') {
        c.neg = pair('ではない', 'ではない');
        c.negPolite = pair('ではありません', 'ではありません');
        c.blocks = BLOCK.aru;
      }
    }
    return c;
  }

  // ---- Ichidan ----------------------------------------------------------------------

  const I_OR_E_ROW = 'いきしちにひみりぎじぢびぴえけせてねへめれげぜでべぺ';

  function ichidan(dict) {
    const { ja, rd } = dict;
    const before = rd.slice(-2, -1);
    if (!ja.endsWith('る') || !rd.endsWith('る') || !before || !I_OR_E_ROW.includes(before)) {
      fail(`ichidan verb "${ja}" (${rd}) must end in る after an i- or e-row kana`);
    }
    const stem = cut(dict, 1);
    return {
      dict,
      i: stem,
      neg: add(stem, 'ない'),
      te: add(stem, 'て'),
      ta: add(stem, 'た'),
      potential: add(stem, 'られる'),
      passive: add(stem, 'られる'),
      causative: add(stem, 'させる'),
      vol: add(stem, 'よう'),
      ba: add(stem, 'れば'),
      imp: add(stem, 'ろ'),
      proh: add(dict, 'な'),
      blocks: null,
    };
  }

  // ---- する (and noun+する) -----------------------------------------------------------

  function suru(dict) {
    const { ja, rd } = dict;
    if (ja.endsWith('為る')) fail(`"${ja}": write the する of a する verb in kana`);
    if (!ja.endsWith('する') || !rd.endsWith('する')) {
      fail(`する verb "${ja}" (${rd}) must end in する in both ja and rd`);
    }
    const prefix = cut(dict, 2);
    const s = kana => add(prefix, kana);
    // 愛する: 愛さない, 愛せる are the common forms
    const ai = ja === '愛する' && rd === 'あいする';
    // 接する: 接できる is not Japanese, so a single-kanji noun uses 接することができる
    const oneKanji = /^[一-鿿々〆]$/.test(prefix.ja);
    // 必要とする: 必要とできる is not Japanese either, use 必要とすることができる
    const quoted = prefix.ja.endsWith('と') && prefix.rd.endsWith('と');
    // あくびをする: あくびができる is natural for some (世話ができる) and wrong for others
    // (封ができる, くしゃみができる), so use the always-correct あくびをすることができる
    const object = prefix.ja.endsWith('を') && prefix.rd.endsWith('を');
    const potential = ai ? s('せる')
      : oneKanji || quoted || object ? s('することができる')
        : s('できる');
    // 罰する 発する 帰する: the standard passive is 罰せられる, not 罰される
    const serareru = ['罰する:ばっする', '発する:はっする', '帰する:きする'].includes(`${ja}:${rd}`);
    return {
      dict,
      i: s('し'),
      neg: s(ai ? 'さない' : 'しない'),
      te: s('して'),
      ta: s('した'),
      potential,
      passive: s(serareru ? 'せられる' : 'される'),
      causative: s('させる'),
      vol: s('しよう'),
      ba: s('すれば'),
      imp: s('しろ'),
      proh: s('するな'),
      blocks: null,
    };
  }

  // ---- 来る (and 〜て来る) -------------------------------------------------------------

  function kuru(dict) {
    const { ja, rd } = dict;
    const kanji = ja.endsWith('来る');
    if (!(kanji || ja.endsWith('くる')) || !rd.endsWith('くる')) {
      fail(`来る verb "${ja}" (${rd}) must end in 来る (or くる) with the reading くる`);
    }
    const prefix = cut(dict, 2);
    // 来 is written the same and read き, こ or く; written in kana it is the reading.
    const k = (reading, tail) => pair(prefix.ja + (kanji ? '来' : reading) + tail, prefix.rd + reading + tail);
    return {
      dict,
      i: k('き', ''),
      neg: k('こ', 'ない'),
      te: k('き', 'て'),
      ta: k('き', 'た'),
      potential: k('こ', 'られる'),
      passive: k('こ', 'られる'),
      causative: k('こ', 'させる'),
      vol: k('こ', 'よう'),
      ba: k('く', 'れば'),
      imp: k('こ', 'い'),
      proh: add(dict, 'な'),
      blocks: null,
    };
  }

  const CLASSES = { g: godan, i: ichidan, s: suru, k: kuru };

  // Stative verbs whose spelling alone says which derived forms do not exist.
  function blockFor(ja, rd, tag) {
    if (['できる', '出来る'].includes(ja) && rd === 'できる') return BLOCK.dekiru;
    if (['分かる', '分る', '判る', '解る', 'わかる'].includes(ja) && rd === 'わかる') return BLOCK.wakaru;
    if (['見える', 'みえる', '聞こえる', 'きこえる'].includes(ja) && ['みえる', 'きこえる'].includes(rd)) return BLOCK.mieru;
    if (['思える', 'おもえる'].includes(ja) && rd === 'おもえる') return BLOCK.mieru;
    if (['いる', '居る'].includes(ja) && rd === 'いる' && tag === 'i') return BLOCK.iru;
    if (ja === '要る' && rd === 'いる') return BLOCK.need;
    if (['くれる', '呉れる'].includes(ja) && rd === 'くれる') return BLOCK.kureru;
    return NO_BLOCK;
  }

  // ---- The rows --------------------------------------------------------------------------

  // Each key as [polite, plain] pairs, before nulls for forms the verb does not use.
  function table(c) {
    const negPolite = c.negPolite || add(c.i, 'ません');
    return {
      pres: [add(c.i, 'ます'), c.dict],
      past: [add(c.i, 'ました'), c.ta],
      neg: [negPolite, c.neg],
      pastNeg: [add(negPolite, 'でした'), add(cut(c.neg, 1), 'かった')],
      te: [c.te, c.te],
      prog: [add(c.te, 'います'), add(c.te, 'いる')],
      request: [add(c.te, 'ください'), c.te],
      want: [add(c.i, 'たいです'), add(c.i, 'たい')],
      potential: [polite(c.potential), c.potential],
      passive: [polite(c.passive), c.passive],
      causative: [polite(c.causative), c.causative],
      volitional: [add(c.i, 'ましょう'), c.vol],
      condTara: [add(c.i, 'ましたら'), add(c.ta, 'ら')],
      condBa: [null, c.ba],
      imperative: [add(c.i, 'なさい'), c.imp],
      prohibitive: [add(c.neg, 'でください'), c.proh],
    };
  }

  function express(entry) {
    if (!entry || typeof entry !== 'object') fail('the entry must be an object { ja, rd, tag }');
    const { ja, rd, tag } = entry;
    for (const [name, value] of [['ja', ja], ['rd', rd]]) {
      if (typeof value !== 'string' || !value) fail(`"${name}" must be a non-empty string`);
      const parts = words(value);
      if (parts.length !== 1 || parts[0] !== value) fail(`"${name}" must not contain spaces ("${value}")`);
    }
    if (typeof tag !== 'string' || !Object.hasOwn(CLASSES, tag)) {
      fail(`unknown tag ${JSON.stringify(tag)} for "${ja}" (expected "g", "i", "s" or "k")`);
    }

    const c = CLASSES[tag](pair(ja, rd));
    const blocks = c.blocks || blockFor(ja, rd, tag);
    // くれる: the plain imperative is くれ (くれろ is the rarer form)
    if (blocks === BLOCK.kureru && tag === 'i') c.imp = c.i;
    const rows = {};
    const forms = table(c);
    for (const key of ROW_KEYS) {
      const [politeForm, plainForm] = forms[key];
      const noPolite = blocks.both.includes(key) || blocks.polite.includes(key);
      const noPlain = blocks.both.includes(key);
      rows[key] = [noPolite ? null : cell(politeForm), noPlain ? null : cell(plainForm)];
    }
    return { ja, rd, rows };
  }

  const api = { express, ROW_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Japanese = api;
})(typeof window !== 'undefined' ? window : globalThis);
