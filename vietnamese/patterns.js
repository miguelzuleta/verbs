/*
 * Vietnamese verb patterns (standard Vietnamese, Hanoi norm).
 *
 *   express({ vi: 'nói', tag: '' }) -> { vi, rows }
 *
 * Vietnamese verbs never change form. Tense, aspect and mood are carried by
 * particles and helper words around the verb (đã, đang, sẽ, vừa, sắp, từng, rồi, chưa,
 * không, hãy, đừng, có thể, nên, muốn, nếu ...), so each entry of `rows` is one way of
 * expressing a tense, aspect or mood as a whole SENTENCE. rows[key] is an array of
 * six cells, one per pronoun (tôi, bạn, anh ấy, chúng tôi, các bạn, họ); each cell
 * is { vi: 'tôi đã nói' }, or null when the pattern does not suit this kind of verb.
 * Sentences are lowercase with no final full stop; questions end in "?" and commands
 * in "!". "anh ấy" stands for "he or she".
 *
 * Verb entries:
 *   vi   the verb in lowercase Vietnamese, one to four syllables separated by single
 *        spaces (nói, đi học, gọi điện thoại). Particles go BEFORE the verb: there is
 *        no verb-object splitting as in Chinese.
 *   tag  "s" state verb (biết, yêu, muốn, có, là, ở), "a" instant/achievement verb
 *        (đến, thắng, chết), "m" modal verb (có thể, nên, phải), or "" for an
 *        ordinary action verb
 */
(function (global) {
  'use strict';

  const { words } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const PRONOUNS = ['tôi', 'bạn', 'anh ấy', 'chúng tôi', 'các bạn', 'họ'];
  const TAGS = ['', 's', 'a', 'm'];

  // Persons by index: 0 tôi, 1 bạn, 2 anh ấy, 3 chúng tôi, 4 các bạn, 5 họ.
  const isYou = p => p === 1 || p === 4;
  const isWe = p => p === 3;

  // ---- The patterns --------------------------------------------------------
  // Each takes the subject S (a pronoun), the person index p and the verb v, and
  // returns the sentence.

  // "có" before the verb makes a yes/no question; verbs that already begin with
  // "có" (có, có thể, có mặt) do not take a second one.
  const hasCo = v => v.split(' ').includes('có') && v !== 'ghi có';

  const PATTERNS = {
    pres: (S, p, v) => `${S} ${v}`,
    prog: (S, p, v) => `${S} đang ${v}`,
    completed: (S, p, v) => `${S} đã ${v}`,
    exper: (S, p, v) => `${S} đã từng ${v}`,
    perfect: (S, p, v) => `${S} đã ${v} rồi`,
    recent: (S, p, v) => `${S} vừa ${v}`,
    pastprog: (S, p, v) => `lúc đó ${S} đang ${v}`,
    pluperf: (S, p, v) => `trước đó ${S} đã ${v} rồi`,
    fut: (S, p, v) => `${S} sẽ ${v}`,
    nearfut: (S, p, v) => `${S} sắp ${v}`,
    futperf: (S, p, v) => `đến lúc đó ${S} sẽ ${v} xong`,

    cond: (S, p, v) => `nếu …, ${S} sẽ ${v}`,
    condperf: (S, p, v) => `nếu lúc đó …, ${S} đã ${v} rồi`,
    hyp: (S, p, v) => `nếu ${S} ${v}`,
    hypperf: (S, p, v) => `giá mà lúc đó ${S} đã ${v}`,
    // "ước gì ..." is "I wish ..." / "if only ..."
    wish: (S, p, v) => `ước gì ${S} ${v}`,

    // Commands name the person: "you" is addressed directly with hãy / đừng;
    // everyone else is "để ... " (let ...) and "we" is the inclusive "chúng ta".
    impAff: (S, p, v) => {
      if (isWe(p)) return `chúng ta hãy ${v}!`;
      if (isYou(p)) return `${S} hãy ${v}!`;
      return `để ${S} ${v}!`;
    },
    impNeg: (S, p, v) => {
      if (isWe(p)) return `chúng ta đừng ${v}!`;
      if (isYou(p)) return `${S} đừng ${v}!`;
      return `đừng để ${S} ${v}!`;
    },

    negPres: (S, p, v) => `${S} không ${v}`,
    negPast: (S, p, v) => `${S} chưa ${v}`,
    negExper: (S, p, v) => `${S} chưa từng ${v}`,
    negDid: (S, p, v) => `${S} đã không ${v}`,

    can: (S, p, v) => `${S} có thể ${v}`,
    should: (S, p, v) => `${S} nên ${v}`,
    want: (S, p, v) => `${S} muốn ${v}`,

    qCo: (S, p, v) => (hasCo(v) ? `${S} ${v} không?` : `${S} có ${v} không?`),
    // "đã ... chưa?" asks whether it has happened yet; the answers are "rồi" (already) and "chưa" (not yet)
    qRoi: (S, p, v) => `${S} đã ${v} chưa?`,
  };

  const ALL_KEYS = Object.keys(PATTERNS);

  // ---- Reading the entry --------------------------------------------------

  function checkEntry(entry) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('Vietnamese express(): the entry must be an object { vi, tag }');
    }
    const { vi } = entry;
    if (typeof vi !== 'string' || !vi.trim()) {
      throw new Error('Vietnamese express(): the verb is empty (entry.vi must be a Vietnamese verb)');
    }
    if (words(vi).join(' ') !== vi) {
      throw new Error(`Vietnamese express(): "${vi}" has stray spaces; separate syllables with single spaces`);
    }
    if (vi !== vi.toLowerCase()) {
      throw new Error(`Vietnamese express(): "${vi}" must be lowercase`);
    }
    if (vi !== vi.normalize('NFC')) {
      throw new Error(`Vietnamese express(): "${vi}" must use precomposed (NFC) letters`);
    }
    const tag = entry.tag === undefined || entry.tag === null ? '' : entry.tag;
    if (!TAGS.includes(tag)) {
      throw new Error(`Vietnamese express(): unknown tag "${tag}" for "${vi}" (use "", "s", "a" or "m")`);
    }
    return { vi, tag };
  }

  // ---- Which patterns suit which kind of verb --------------------------------

  // Which patterns each kind of verb refuses. The rules are deliberately narrow: most state verbs
  // take đang (tôi đang lo lắng, tôi đang buồn, tôi đang cần tiền), vừa and sắp (tôi vừa biết tin,
  // tôi sắp có em bé) and commands (đừng lo lắng!, hãy tin tôi!). Only the relational and
  // non-volitional states below refuse them.
  const words2 = text => new Set(text.split(/\s*,\s*/));
  // true statives and relations: not "in progress" (no *tôi đang biết, *đang thuộc về)
  const NO_PROGRESSIVE = words2('là, biết, hiểu, quen biết, thuộc, thuộc về, khác, khác biệt, trùng, trùng khớp, khớp, hợp, phù hợp, vừa, đáng, xứng đáng, đáng giá, bao gồm, gồm, gồm có, cấu thành, tương ứng, mâu thuẫn, có vẻ, nghe có vẻ, trông, trông có vẻ, tỏ ra, coi là, xem là, cho là, cho rằng, bắt nguồn, có giá, trị giá');
  // pure relations and locations: not "just now" or "about to"
  const NO_RECENT = words2('là, ở, muốn, muốn nói, thuộc, thuộc về, khác, khác biệt, trùng, trùng khớp, khớp, hợp, phù hợp, vừa, đáng, xứng đáng, bao gồm, gồm, gồm có, cấu thành, tương ứng, mâu thuẫn, có vẻ, nghe có vẻ, trông, trông có vẻ, tỏ ra');
  // non-volitional states: nobody is commanded to be them
  const NO_IMPERATIVE = words2('muốn, muốn nói, thuộc, thuộc về, khác, khác biệt, trùng, trùng khớp, khớp, hợp, phù hợp, vừa, đáng, xứng đáng, đáng giá, bao gồm, gồm, gồm có, chứa, chứa đựng, cấu thành, tương ứng, mâu thuẫn, có vẻ, nghe có vẻ, trông, trông có vẻ, tỏ ra, tốn, có giá, trị giá, nặng, ngứa, ngứa ngáy, đau');
  // punctual events that cannot be "in progress" (an instant verb such as đến or thua can)
  const PUNCTUAL = words2('nổ, nổ tung, phát nổ, bật ra, gãy, vỡ, quên, quên mất, tìm ra, tìm thấy, phát hiện, nhận ra, hiểu ra, suy ra, lộ ra, nghe thấy, ngửi thấy, trúng, lỡ, bỏ lỡ, giật mình, thức dậy');
  // Modal verbs (có thể, phải, dám ...) take past and future too (tôi đã phải đợi, tôi sẽ có thể làm);
  // only "nên" (should) is limited.
  const MODAL_ALLOWED = ['pres', 'negPres', 'negPast', 'hyp', 'wish', 'qCo', 'completed', 'fut', 'prog', 'pastprog',
    'perfect', 'pluperf', 'cond', 'negDid', 'qRoi'];
  // only the obligation modals are "in progress" (tôi đang phải làm việc); *tôi đang có thể is not used
  const PROGRESSIVE_MODALS = words2('phải, cần phải, buộc phải, cần');
  const SHOULD_ALLOWED = ['pres', 'negPres', 'negPast', 'hyp', 'wish', 'qCo'];

  // Weather verbs have no personal subject: "trời mưa", never "tôi mưa".
  const IMPERSONAL = words2('mưa, mưa như trút, mưa phùn, mưa đá, tuyết rơi, rền vang');
  const IMPERSONAL_BLOCKED = ['impAff', 'impNeg', 'can', 'should', 'want'];

  // Verbs that already express wanting are not "wanted" again (no *tôi muốn mong muốn)
  const DESIRE = words2('muốn, mong muốn, mong, mong ước, mong mỏi, ao ước, khao khát, ước, thèm, thèm muốn, cần, cần đến, định, dự định, có ý định, hy vọng');

  // After a state or an instant verb "sẽ ... xong" (finish doing) does not fit;
  // by that time the thing has simply "already" happened.
  const BY_THEN = (S, p, v) => `đến lúc đó ${S} đã ${v} rồi`;
  const OVERRIDE_BY_TAG = { s: { futperf: BY_THEN }, a: { futperf: BY_THEN } };

  // A verb that already ends in "xong" or "hết" (làm xong, dùng hết) says that the thing is
  // finished, so a second "xong" would be doubled ("sẽ làm xong xong"): same "đã ... rồi".
  const endsComplete = v => ['xong', 'hết'].includes(v.split(' ').pop());
  // "đang làm xong" is not Vietnamese (xong marks completion); dùng hết is fine
  const endsXong = v => v.split(' ').pop() === 'xong';
  // Verbs that begin with "muốn" (muốn, muốn nói) are not wanted again: no "tôi muốn muốn nói".
  const beginsWithMuon = v => v === 'muốn' || v.startsWith('muốn ');

  // ---- Special verbs ----------------------------------------------------------
  // là, có, ở, có thể and muốn behave differently from ordinary verbs. `tag` forces the
  // kind of verb whatever the entry says; `override` replaces single patterns;
  // `block` removes patterns.
  const SPECIAL = {
    // to be: "không phải là" negates it, and a question asks "có phải là ... không?"
    'là': {
      tag: 's',
      override: {
        negPres: (S, p, v) => `${S} không phải là`,
        negPast: (S, p, v) => `${S} chưa phải là`,
        negDid: (S, p, v) => `${S} đã không phải là`,
        qCo: (S, p, v) => `${S} có phải là không?`,
      },
    },
    // to have / exist: không có, chưa có; the question is "có ... không?" without a second có
    'có': { tag: 's' },
    // to be at / live: không ở, chưa ở
    'ở': { tag: 's' },
    // can: negated as "không thể", "chưa thể" (never "không có thể")
    'có thể': {
      tag: 'm',
      override: {
        negPres: (S, p, v) => `${S} không thể`,
        negPast: (S, p, v) => `${S} chưa thể`,
        negDid: (S, p, v) => `${S} đã không thể`,
      },
    },
    // "tôi muốn muốn" is not a sentence
    'muốn': { block: ['want'] },
  };

  function patternFor(key, vi, tag) {
    const special = SPECIAL[vi] || {};
    if ((special.block || []).includes(key)) return null;
    if (key === 'want' && (beginsWithMuon(vi) || DESIRE.has(vi))) return null;
    if (special.override && special.override[key]) return special.override[key];
    if (IMPERSONAL.has(vi)) return IMPERSONAL_BLOCKED.includes(key) ? null : PATTERNS[key];
    const kind = special.tag || tag;
    if (kind === 'm') {
      if ((key === 'prog' || key === 'pastprog') && !PROGRESSIVE_MODALS.has(vi)) return null;
      return (vi === 'nên' ? SHOULD_ALLOWED : MODAL_ALLOWED).includes(key) ? PATTERNS[key] : null;
    }
    if (key === 'futperf' && endsComplete(vi)) return BY_THEN;
    const progressive = key === 'prog' || key === 'pastprog';
    if (progressive && endsXong(vi)) return null;
    if (kind === 's') {
      if (progressive && NO_PROGRESSIVE.has(vi)) return null;
      if ((key === 'recent' || key === 'nearfut') && NO_RECENT.has(vi)) return null;
      if ((key === 'impAff' || key === 'impNeg') && NO_IMPERATIVE.has(vi)) return null;
    }
    if (kind === 'a' && progressive && PUNCTUAL.has(vi)) return null;
    const byTag = OVERRIDE_BY_TAG[kind];
    return (byTag && byTag[key]) || PATTERNS[key];
  }

  function express(entry) {
    const { vi, tag } = checkEntry(entry);
    const rows = {};
    for (const key of ALL_KEYS) {
      const build = patternFor(key, vi, tag);
      // a weather verb has the fixed subject "trời" whatever pronoun is chosen
      rows[key] = PRONOUNS.map((S, p) => (build ? { vi: build(IMPERSONAL.has(vi) ? 'trời' : S, p, vi) } : null));
    }
    return { vi, rows };
  }

  const api = { express, ROW_KEYS: ALL_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Vietnamese = api;
})(typeof window !== 'undefined' ? window : globalThis);
