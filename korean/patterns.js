/*
 * Korean verb patterns and Revised Romanization.
 *
 *   express({ ko: '말하다', tag: '' }) -> { ko, rom, rows }
 *
 * Korean verbs change their stem and ending for politeness, not for person, so
 * the table follows the Chinese site: each entry of `rows` is one way of saying a
 * tense, aspect or mood. rows[key] is an array of THREE cells, one per speech
 * level:
 *
 *   index 0  해요체  polite, everyday          (말해요)
 *   index 1  합쇼체  formal                     (말합니다)
 *   index 2  해체    casual / intimate          (말해)
 *
 * Each cell is { ko, rom } (the form in Hangul and its romanization) or null
 * where a level does not use the form. The last six keys (and, because, if, but,
 * modPres, modPast) do not depend on the level: the same cell is repeated.
 *
 * The forms are composed by code from the dictionary form. Hangul syllables are
 * taken apart and put together with the Unicode formula
 *   syllable = 0xAC00 + (initial * 21 + medial) * 28 + final
 *
 * Verb entries:
 *   ko   dictionary form ('말하다', '먹다', '돕다')
 *   tag  '' for a regular verb or one whose rule shows in the spelling, or
 *        'b' ㅂ-irregular (돕다 -> 도와요), 'd' ㄷ-irregular (듣다 -> 들어요),
 *        's' ㅅ-irregular (짓다 -> 지어요), 'reu' 르-irregular (모르다 -> 몰라요)
 *
 * Detected from the spelling, without a tag: 하다 verbs (해), ㄹ-stems (살다 ->
 * 삽니다, 사세요), ㅡ-stems (쓰다 -> 써; 받아쓰다 -> 받아써 and 본뜨다 -> 본떠,
 * because 쓰 and 뜨 always take 어), vowel contraction (오다 -> 와요, 주다 ->
 * 줘요, 마시다 -> 마셔요, 되다 -> 돼요), vowel harmony (아 after ㅏ/ㅗ, else 어)
 * and the 으 inserted after a final consonant (먹으면, 먹을 거예요). A
 * one-syllable ㅣ-stem contracts only after ㅈ ㅉ ㅊ (지다 -> 져요, but 비다 ->
 * 비어요), and ㅚ contracts only in 되 뵈 쇠 쐬 (꾀다 -> 꾀어요). A few
 * closed groups are known by name: 푸다 (퍼요), 이르다 reaching (이르러요), the
 * honorific verbs (계세요), 있다/없다 and the copulas 이다/아니다.
 */
(function (global) {
  'use strict';

  // ---- Hangul arithmetic -------------------------------------------------------

  const BASE = 0xAC00;
  const isSyllable = ch => ch >= '가' && ch <= '힣';

  // initial 0-18, medial 0-20, final 0-27 (0 = none)
  function decompose(ch) {
    const n = ch.charCodeAt(0) - BASE;
    return { l: Math.floor(n / 588), v: Math.floor((n % 588) / 28), t: n % 28 };
  }
  const compose = (l, v, t) => String.fromCharCode(BASE + (l * 21 + v) * 28 + t);

  // medial vowel indexes used below
  const V = {
    A: 0, AE: 1, YA: 2, EO: 4, E: 5, YEO: 6, YE: 7, O: 8, WA: 9, WAE: 10, OE: 11,
    U: 13, WO: 14, WE: 15, EU: 18, I: 20,
  };
  // final consonant indexes used below
  const T = { NONE: 0, N: 4, D: 7, L: 8, B: 17, S: 19, SS: 20 };
  const L_RIEUL = 5;
  // initial consonant indexes used below
  const L_DIGEUT = 3, L_BIEUP = 7, L_SIOS = 9, L_SSANGSIOS = 10, L_JIEUT = 12, L_SSANGJIEUT = 13, L_CHIEUCH = 14;

  const head = s => s.slice(0, -1);
  const tail = s => decompose(s[s.length - 1]);
  // the last syllable with a different final consonant: withFinal('가', 17) -> '갑'
  const withFinal = (s, t) => { const x = tail(s); return head(s) + compose(x.l, x.v, t); };
  const dropFinal = s => withFinal(s, T.NONE);
  // vowel harmony: the bright vowels take 아, everything else 어
  const isBright = v => v === V.A || v === V.YA || v === V.O || v === V.WA;
  const harmony = s => (isBright(tail(s).v) ? '아' : '어');

  // 'v' ends in a vowel, 'l' ends in ㄹ, 'c' ends in another consonant
  function kindOf(s) {
    const t = tail(s).t;
    return t === T.NONE ? 'v' : t === T.L ? 'l' : 'c';
  }

  // ---- Stems -------------------------------------------------------------------
  //
  // Every verb is reduced to four pieces:
  //   cons  the stem before consonant endings (고, 지, 자, 지만, 는, 습니다)
  //   eu    the stem before the "(으)" endings (면, ㄴ, ㄹ, 세요, 십시오, ㅂ시다):
  //         { s: stem, kind } where kind says whether the ending needs 으
  //   ae    the stem joined to 아/어 (the 해요체 without 요): 해, 먹어, 도와, 몰라
  // The ㄷ- and ㅅ-irregulars change only before vowels; the ㄹ-stems drop ㄹ
  // before ㄴ, ㅂ and ㅅ.

  const stemInfo = (cons, eu, ae) => ({ cons, consKind: kindOf(cons), eu: { s: eu, kind: kindOf(eu) }, ae });

  // vowel stem + 아/어 with the usual contractions
  function joinAO(stem) {
    const x = tail(stem);
    switch (x.v) {
      case V.A: case V.EO: case V.AE: case V.E: case V.YEO: case V.YE: case V.YA:
      case V.WA: case V.WO: case V.WAE: case V.WE:
        return stem; // 가+아 -> 가, 서+어 -> 서, 내+어 -> 내, 켜+어 -> 켜
      case V.O: return head(stem) + compose(x.l, V.WA, T.NONE); // 보+아 -> 봐
      case V.U: return head(stem) + compose(x.l, V.WO, T.NONE); // 주+어 -> 줘
      case V.I: // 마시+어 -> 마셔, 가지+어 -> 가져
        // A one-syllable stem contracts only after ㅈ ㅉ ㅊ (지다 -> 져요, 치다 -> 쳐요); the others
        // keep 어 so that they do not turn into other words (비다 -> 비어요, not 벼요; 피다 -> 피어요)
        if (stem.length === 1 && ![L_JIEUT, L_SSANGJIEUT, L_CHIEUCH].includes(x.l)) return stem + '어';
        return head(stem) + compose(x.l, V.YEO, T.NONE);
      case V.OE: // 되+어 -> 돼, 뵈+어 -> 봬; the others keep 어 (꾀다 -> 꾀어요)
        if (![L_DIGEUT, L_BIEUP, L_SIOS, L_SSANGSIOS].includes(x.l)) return stem + '어';
        return head(stem) + compose(x.l, V.WAE, T.NONE);
      default: return stem + harmony(stem); // 쉬어, 뛰어, 사귀어: no contraction
    }
  }

  // ㅡ-stems drop the ㅡ: 쓰+어 -> 써, 아프+아 -> 아파, 모으+아 -> 모아
  // The vowel before the ㅡ decides between 아 and 어, except when the stem ends in one of the
  // one-syllable verbs 쓰다 끄다 뜨다 크다 트다: they always take 어, also inside a compound
  // (받아쓰다 -> 받아써요, 본뜨다 -> 본떠요, 싹트다 -> 싹터요).
  const ONE_SYLLABLE_EU_VERBS = ['쓰', '끄', '뜨', '크', '트'];
  function dropEu(stem) {
    const x = tail(stem);
    const before = head(stem);
    const bright = before !== '' && !ONE_SYLLABLE_EU_VERBS.includes(stem[stem.length - 1]) && isBright(tail(before).v);
    return before + compose(x.l, bright ? V.A : V.EO, T.NONE);
  }

  // 러-irregular: the 어 after 르 is 러 (이르다 reach -> 이르러요)
  const REO_IRREGULAR = ['이르', '푸르', '노르'];

  function analyse(ko, tag) {
    const stem = ko.slice(0, -1);
    const x = tail(stem);

    if (stem === '푸') return stemInfo(stem, stem, '퍼'); // 푸다 -> 퍼요, 펐어요
    if (!tag && REO_IRREGULAR.includes(stem)) return stemInfo(stem, stem, stem + '러');

    if (tag === 'reu' && stem.length >= 2 && x.l === L_RIEUL && x.v === V.EU && x.t === T.NONE
        && tail(head(stem)).t === T.NONE) {
      // 모르+아 -> 몰라: the ㄹ is doubled, 라 after ㅏ/ㅗ and 러 otherwise
      const before = head(stem);
      const bright = isBright(tail(before).v);
      return stemInfo(stem, stem, withFinal(before, T.L) + (bright ? '라' : '러'));
    }
    if (tag === 'b' && x.t === T.B) {
      // ㅂ drops before a vowel and 우 appears: 돕다 -> 도와요, 도우면; 춥다 -> 추워요
      const base = dropFinal(stem);
      const bright = stem.endsWith('돕') || stem.endsWith('곱'); // the only two that take 와
      return { cons: stem, consKind: 'c', eu: { s: base + '우', kind: 'v' }, ae: base + (bright ? '와' : '워') };
    }
    if (tag === 'd' && x.t === T.D) {
      // ㄷ becomes ㄹ before a vowel: 듣다 -> 들어요, 들으면
      const soft = withFinal(stem, T.L);
      return { cons: stem, consKind: 'c', eu: { s: soft, kind: 'c' }, ae: soft + harmony(soft) };
    }
    if (tag === 's' && x.t === T.S) {
      // ㅅ drops before a vowel and the vowels do not merge: 짓다 -> 지어요, 지으면
      const base = dropFinal(stem);
      return { cons: stem, consKind: 'c', eu: { s: base, kind: 'c' }, ae: base + harmony(base) };
    }

    if (stem.endsWith('하')) return stemInfo(stem, stem, head(stem) + '해'); // 말하+여 -> 말해
    if (x.t === T.NONE && x.v === V.EU) return stemInfo(stem, stem, dropEu(stem));
    if (x.t === T.NONE) return stemInfo(stem, stem, joinAO(stem));
    return stemInfo(stem, stem, stem + harmony(stem)); // 먹어, 앉아, 살아, 만들어
  }

  // ---- Endings -----------------------------------------------------------------
  // `k` is { s, kind } as above.

  const eulModifier = ({ s, kind }) => (kind === 'v' ? withFinal(s, T.L) : kind === 'l' ? s : s + '을'); // -(으)ㄹ
  const eunModifier = ({ s, kind }) => (kind === 'c' ? s + '은' : withFinal(s, T.N)); // -(으)ㄴ (살 -> 산: ㄴ replaces ㄹ)
  const neunModifier = ({ s, kind }) => (kind === 'l' ? dropFinal(s) : s) + '는'; // -는
  const formalPresent = ({ s, kind }) => // -ㅂ니다 / -습니다
    (kind === 'c' ? s + '습니다' : withFinal(kind === 'l' ? dropFinal(s) : s, T.B) + '니다');
  const honorific = ({ s, kind }, ending) => // -(으)세요 / -(으)십시오
    (kind === 'v' ? s : kind === 'l' ? dropFinal(s) : s + '으') + ending;
  const conditional = ({ s, kind }) => s + (kind === 'c' ? '으면' : '면'); // -(으)면
  const lets = ({ s, kind }) => // -(으)ㅂ시다
    (kind === 'c' ? s + '읍시다' : withFinal(kind === 'l' ? dropFinal(s) : s, T.B) + '시다');

  // ---- Special groups ------------------------------------------------------------

  // honorific verbs: the 해요체 is -세요 (계세요, 드세요), not -셔요
  const HONORIFIC_STEMS = ['계시', '주무시', '잡수시', '드시'];

  // 있다/없다 and their compounds (맛있다, 재미없다): -는 in the present modifier,
  // -었던 in the past modifier, and no "in progress"
  const isExistence = ko => /[있없]다$/.test(ko);

  // Forms that make no sense for the verb are left out of the table.
  const SILENT_KEYS = {
    existence: ['prog'],
    // 없다 and the compounds of 있다/없다 describe a state: no wish, request, suggestion or command
    state: ['prog', 'want', 'request', 'suggest', 'imperative'],
  };

  // 이다 (to be) and 아니다 (not to be) attach to a noun and have their own forms.
  const COPULA = {
    이다: {
      pres: ['이에요', '입니다', '이야'],
      past: ['이었어요', '이었습니다', '이었어'],
      fut: ['일 거예요', '일 겁니다', '일 거야'],
      neg: ['아니에요', '아닙니다', '아니야'],
      pastNeg: ['아니었어요', '아니었습니다', '아니었어'],
      and: '이고', because: '이어서', if: '이면', but: '이지만', modPres: '인', modPast: '이었던',
    },
    아니다: {
      pres: ['아니에요', '아닙니다', '아니야'],
      past: ['아니었어요', '아니었습니다', '아니었어'],
      fut: ['아닐 거예요', '아닐 겁니다', '아닐 거야'],
      and: '아니고', because: '아니어서', if: '아니면', but: '아니지만', modPres: '아닌', modPast: '아니었던',
    },
  };

  // ---- The rows ------------------------------------------------------------------

  const ROW_KEYS = [
    'pres', 'past', 'fut', 'neg', 'pastNeg', 'prog', 'want', 'can', 'request', 'suggest', 'imperative',
    'and', 'because', 'if', 'but', 'modPres', 'modPast',
  ];

  const cell = text => ({ ko: text, rom: romanize(text) });
  const three = (a, b, c) => [cell(a), cell(b), cell(c)];
  const same = text => three(text, text, text);
  // a row the verb does not use: three empty cells, so every row has the same shape
  const NO_CELLS = () => [null, null, null];

  function conjugate(ko, tag) {
    const { cons, consKind, eu, ae } = analyse(ko, tag);
    const c = { s: cons, kind: consKind };
    const past = withFinal(ae, T.SS); // 했, 먹었, 갔, 몰랐
    const fut = eulModifier(eu);
    const honorificVerb = HONORIFIC_STEMS.includes(cons);

    const rows = {
      pres: three(honorificVerb ? head(cons) + '세요' : ae + '요', formalPresent(c), ae),
      past: three(past + '어요', past + '습니다', past + '어'),
      fut: three(fut + ' 거예요', fut + ' 겁니다', fut + ' 거야'),
      neg: three(cons + '지 않아요', cons + '지 않습니다', cons + '지 않아'),
      pastNeg: three(cons + '지 않았어요', cons + '지 않았습니다', cons + '지 않았어'),
      prog: three(cons + '고 있어요', cons + '고 있습니다', cons + '고 있어'),
      want: three(cons + '고 싶어요', cons + '고 싶습니다', cons + '고 싶어'),
      can: three(fut + ' 수 있어요', fut + ' 수 있습니다', fut + ' 수 있어'),
      request: three(ae + ' 주세요', ae + ' 주십시오', ae + ' 줘'),
      suggest: three(ae + '요', lets(eu), cons + '자'),
      imperative: honorificVerb
        ? three(head(cons) + '세요', head(cons) + '십시오', ae)
        : three(honorific(eu, '세요'), honorific(eu, '십시오'), ae),
      and: same(cons + '고'),
      because: same(ae + '서'),
      if: same(conditional(eu)),
      but: same(cons + '지만'),
      modPres: same(neunModifier(c)),
      modPast: same(isExistence(ko) ? cons + '었던' : eunModifier(eu)),
    };

    if (isExistence(ko)) {
      const silent = ko === '있다' ? SILENT_KEYS.existence : SILENT_KEYS.state;
      for (const key of silent) rows[key] = NO_CELLS();
    }
    return rows;
  }

  function copulaRows(ko) {
    const forms = COPULA[ko];
    const rows = {};
    for (const key of ROW_KEYS) {
      const form = forms[key];
      rows[key] = form === undefined ? NO_CELLS() : Array.isArray(form) ? three(...form) : same(form);
    }
    return rows;
  }

  function express(entry) {
    const ko = entry && entry.ko;
    if (typeof ko !== 'string' || !/^[가-힣]+다$/.test(ko) || ko.length < 2) {
      throw new Error(`Korean.express: "${ko}" is not a Hangul dictionary form ending in 다`);
    }
    const rows = Object.hasOwn(COPULA, ko) ? copulaRows(ko) : conjugate(ko, entry.tag || '');
    return { ko, rom: romanize(ko), rows };
  }

  // ---- Revised Romanization (Republic of Korea) --------------------------------------
  //
  // RR writes the PRONUNCIATION of standard Korean, so the sound changes are
  // applied first and the result is then spelled in Latin letters:
  //   - final consonants are neutralised (ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ -> t, ㅋ ㄲ -> k, ㅍ -> p ...)
  //     and a double final keeps one consonant (읽다 -> ikda, 앉다 -> anda)
  //   - a final consonant before a vowel moves onto it (먹어요 -> meogeoyo); ㅎ is silent
  //   - ㄱ ㄷ ㅂ before ㄴ ㅁ become nasals (합니다 -> hamnida), ㄹ after ㅁ ㅇ ㄱ ㅂ
  //     becomes ㄴ (종로 -> jongno), ㄴ+ㄹ and ㄹ+ㄴ become ㄹㄹ (신라 -> silla)
  //   - ㅎ merges with a neighbouring ㄱ ㄷ ㅂ ㅈ into ㅋ ㅌ ㅍ ㅊ (좋다 -> jota)
  //   - ㄷ ㅌ before the suffix 이/히 become ㅈ ㅊ (같이 -> gachi)
  //   - two compounds say an extra ㄴ (짓이기다 -> jinnigida), listed in NIEUN_AT_JOIN
  // Tensing (먹다 is said "meokta" with a hard d) is NOT written, as in RR.
  // The rules are applied inside each word; sound changes across a space are not.

  const INITIAL_JAMO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  const FINAL_JAMO = ['', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ',
    'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const VOWEL_RR = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we',
    'wi', 'yu', 'eu', 'ui', 'i'];
  const INITIAL_RR = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
  const FINAL_RR = { 'ㄱ': 'k', 'ㄴ': 'n', 'ㄷ': 't', 'ㄹ': 'l', 'ㅁ': 'm', 'ㅂ': 'p', 'ㅇ': 'ng' };

  // a single final consonant -> the sound it has at the end of a syllable
  const SINGLE_FINAL = {
    'ㄱ': 'ㄱ', 'ㄲ': 'ㄱ', 'ㅋ': 'ㄱ', 'ㄴ': 'ㄴ', 'ㅁ': 'ㅁ', 'ㅇ': 'ㅇ', 'ㄹ': 'ㄹ',
    'ㄷ': 'ㄷ', 'ㅅ': 'ㄷ', 'ㅆ': 'ㄷ', 'ㅈ': 'ㄷ', 'ㅊ': 'ㄷ', 'ㅌ': 'ㄷ', 'ㅎ': 'ㄷ',
    'ㅂ': 'ㅂ', 'ㅍ': 'ㅂ',
  };
  // consonant + ㅎ merge into one aspirated consonant
  const ASPIRATE = {
    'ㄱ': 'ㅋ', 'ㄲ': 'ㅋ', 'ㅋ': 'ㅋ', 'ㄷ': 'ㅌ', 'ㅅ': 'ㅌ', 'ㅆ': 'ㅌ', 'ㅌ': 'ㅌ', 'ㅊ': 'ㅌ',
    'ㅂ': 'ㅍ', 'ㅍ': 'ㅍ', 'ㅈ': 'ㅊ',
  };
  const NASALISED = { 'ㄱ': 'ㅇ', 'ㄷ': 'ㄴ', 'ㅂ': 'ㅁ' };

  // the sound of a final (one or two consonants) before a consonant or at the end
  function finalSound(fin, nextInitial, syllable) {
    if (fin.length === 1) return SINGLE_FINAL[fin[0]];
    switch (fin.join('')) {
      case 'ㄱㅅ': return 'ㄱ'; // 넋
      case 'ㄴㅈ': case 'ㄴㅎ': return 'ㄴ'; // 앉, 많
      case 'ㄹㄱ': return nextInitial === 'ㄱ' ? 'ㄹ' : 'ㄱ'; // 읽다 -> ikda, 읽고 -> ilgo
      case 'ㄹㅁ': return 'ㅁ'; // 젊
      case 'ㄹㅂ': return syllable === '밟' ? 'ㅂ' : 'ㄹ'; // 넓다 -> neolda, 밟다 -> bapda
      case 'ㄹㅅ': case 'ㄹㅌ': case 'ㄹㅎ': return 'ㄹ'; // 곬, 핥, 앓
      case 'ㄹㅍ': case 'ㅂㅅ': return 'ㅂ'; // 읊, 없
      default: return SINGLE_FINAL[fin[fin.length - 1]];
    }
  }

  // Applies the sound changes between two neighbouring syllables of one word.
  function meet(cur, next) {
    let fin = cur.fin;
    if (!fin.length) return;

    if (next.initial === 'ㅇ') { // the next syllable starts with a vowel
      if (fin.length === 1 && fin[0] === 'ㅇ') return; // ng stays: 강아지
      if (fin[fin.length - 1] === 'ㅎ') fin = fin.slice(0, -1); // ㅎ is silent: 좋아요, 싫어요
      if (!fin.length) { cur.fin = []; return; }
      const moved = fin[fin.length - 1];
      cur.fin = fin.slice(0, -1);
      next.initial = moved;
      // 같이 -> gachi, 굳이 -> guji; also the contracted 이어 -> 여 (붙여 -> buchyeo)
      if ((moved === 'ㄷ' || moved === 'ㅌ') && (next.vowel === V.I || next.vowel === V.YEO)) {
        next.initial = moved === 'ㄷ' ? 'ㅈ' : 'ㅊ';
      }
      return;
    }

    if (fin[fin.length - 1] === 'ㅎ') { // ㅎ before a consonant
      const rest = fin.slice(0, -1);
      const merged = { 'ㄱ': 'ㅋ', 'ㄷ': 'ㅌ', 'ㅈ': 'ㅊ' }[next.initial];
      if (merged) { next.initial = merged; fin = rest; } // 좋고 -> joko, 많지 -> manchi
      else if (next.initial === 'ㅅ') fin = rest; // 좋습니다: the ㅎ disappears
      else fin = rest.length ? rest : ['ㄷ']; // 놓네 -> nonne
    } else if (next.initial === 'ㅎ') { // ㅎ after a consonant
      // of ㄳ and ㅄ only the first consonant is said (값하다 -> gapada)
      if (fin.length === 2 && fin[1] === 'ㅅ' && (fin[0] === 'ㄱ' || fin[0] === 'ㅂ')) fin = [fin[0]];
      const last = fin[fin.length - 1];
      const aspirated = ASPIRATE[last];
      if (aspirated && (fin.length === 1 || 'ㄱㅂㅈㅌㅍ'.includes(last))) {
        next.initial = aspirated; // 입학 -> ipak, 못해요 -> motaeyo, 읽히다 -> ilkida
        fin = fin.slice(0, -1);
        // 닫히다 -> dachida, 묻혀 -> muchyeo
        if (aspirated === 'ㅌ' && (last === 'ㄷ' || last === 'ㅌ') && (next.vowel === V.I || next.vowel === V.YEO)) {
          next.initial = 'ㅊ';
        }
      }
    }
    if (!fin.length) { cur.fin = []; return; }

    let sound = finalSound(fin, next.initial, cur.char);
    if (next.initial === 'ㄹ' && 'ㅁㅇㄱㅂㄷ'.includes(sound)) next.initial = 'ㄴ'; // 종로 -> jongno
    if ((next.initial === 'ㄴ' || next.initial === 'ㅁ') && NASALISED[sound]) sound = NASALISED[sound];
    if (sound === 'ㄴ' && next.initial === 'ㄹ') sound = 'ㄹ'; // 신라 -> silla
    else if (sound === 'ㄹ' && next.initial === 'ㄴ') next.initial = 'ㄹ'; // 설날 -> seollal
    cur.fin = [sound];
  }

  // A few compounds say an extra ㄴ at the join, which the spelling does not show:
  // 짓이기다 [진니기다], 업신여기다 [업씬녀기다]. Written form -> spelling of the sound.
  const NIEUN_AT_JOIN = [['짓이', '짓니'], ['업신여', '업신녀']];
  function spoken(chars) {
    const text = chars.join('');
    for (const [written, said] of NIEUN_AT_JOIN) {
      if (text.startsWith(written)) return [...(said + text.slice(written.length))];
    }
    return chars;
  }

  function romanWord(written) {
    const chars = spoken(written);
    const syllables = chars.map(char => {
      const x = decompose(char);
      return { char, initial: INITIAL_JAMO[x.l], vowel: x.v, fin: FINAL_JAMO[x.t].split('').filter(Boolean) };
    });
    syllables.forEach((s, i) => {
      if (i + 1 < syllables.length) meet(s, syllables[i + 1]);
      else if (s.fin.length) s.fin = [finalSound(s.fin, null, s.char)];
    });
    return syllables.map((s, i) => {
      let initial = INITIAL_RR[INITIAL_JAMO.indexOf(s.initial)];
      if (s.initial === 'ㄹ' && i > 0 && syllables[i - 1].fin[0] === 'ㄹ') initial = 'l'; // ㄹㄹ is ll
      return initial + VOWEL_RR[s.vowel] + (s.fin.length ? FINAL_RR[s.fin[0]] : '');
    }).join('');
  }

  // Hangul syllables are romanized word by word; any other character (space,
  // punctuation, Latin letters) is kept as it is.
  function romanize(text) {
    let out = '';
    let word = [];
    const flush = () => { if (word.length) { out += romanWord(word); word = []; } };
    for (const ch of String(text)) {
      if (isSyllable(ch)) word.push(ch);
      else { flush(); out += ch; }
    }
    flush();
    return out;
  }

  const api = { express, ROW_KEYS, romanize };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Korean = api;
})(typeof window !== 'undefined' ? window : globalThis);
