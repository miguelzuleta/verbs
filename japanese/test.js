// Run with: node test.js
// Checks the pattern engine against known forms, then validates every verb in
// verbs.js: spelling, reading, okurigana, tag against ending, one reading per
// spelling, and that every row the engine builds is well formed.
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const report = createReport();
const { failures } = report;

// ---- Expected forms ----------------------------------------------------------------
// A form is written with its reading in brackets after each run of kanji or
// katakana: 話[はな]す is ja 話す, rd はなす. A row is 'polite / plain';
// '-' means the style does not use the form, '*' means "not checked here", and a
// single form with no ' / ' means both styles are the same (て-form).

const KEY_ORDER = 'pres past neg pastNeg te prog request want potential passive causative volitional condTara condBa imperative prohibitive'.split(' ');

function parseForm(text) {
  return {
    ja: text.replace(/\[[ぁ-ゖー]+\]/g, ''),
    rd: text.replace(/[一-鿿々〆ァ-ヺー]+\[([ぁ-ゖー]+)\]/g, '$1'),
  };
}
const show = cell => (cell ? `${cell.ja} (${cell.rd})` : null);

function expectedCells(spec) {
  const parts = spec.includes(' / ') ? spec.split(' / ') : [spec, spec];
  return parts.map(part => (part === '-' ? null : part === '*' ? undefined : parseForm(part)));
}

// Every row of a full paradigm is listed (all 16 keys, both styles).
const FULL = [
  {
    verb: { ja: '話す', rd: 'はなす', tag: 'g' },
    rows: {
      pres: '話[はな]します / 話[はな]す',
      past: '話[はな]しました / 話[はな]した',
      neg: '話[はな]しません / 話[はな]さない',
      pastNeg: '話[はな]しませんでした / 話[はな]さなかった',
      te: '話[はな]して',
      prog: '話[はな]しています / 話[はな]している',
      request: '話[はな]してください / 話[はな]して',
      want: '話[はな]したいです / 話[はな]したい',
      potential: '話[はな]せます / 話[はな]せる',
      passive: '話[はな]されます / 話[はな]される',
      causative: '話[はな]させます / 話[はな]させる',
      volitional: '話[はな]しましょう / 話[はな]そう',
      condTara: '話[はな]しましたら / 話[はな]したら',
      condBa: '- / 話[はな]せば',
      imperative: '話[はな]しなさい / 話[はな]せ',
      prohibitive: '話[はな]さないでください / 話[はな]すな',
    },
  },
  {
    verb: { ja: '買う', rd: 'かう', tag: 'g' },
    rows: {
      pres: '買[か]います / 買[か]う',
      past: '買[か]いました / 買[か]った',
      neg: '買[か]いません / 買[か]わない',
      pastNeg: '買[か]いませんでした / 買[か]わなかった',
      te: '買[か]って',
      prog: '買[か]っています / 買[か]っている',
      request: '買[か]ってください / 買[か]って',
      want: '買[か]いたいです / 買[か]いたい',
      potential: '買[か]えます / 買[か]える',
      passive: '買[か]われます / 買[か]われる',
      causative: '買[か]わせます / 買[か]わせる',
      volitional: '買[か]いましょう / 買[か]おう',
      condTara: '買[か]いましたら / 買[か]ったら',
      condBa: '- / 買[か]えば',
      imperative: '買[か]いなさい / 買[か]え',
      prohibitive: '買[か]わないでください / 買[か]うな',
    },
  },
  {
    verb: { ja: '読む', rd: 'よむ', tag: 'g' },
    rows: {
      pres: '読[よ]みます / 読[よ]む',
      past: '読[よ]みました / 読[よ]んだ',
      neg: '読[よ]みません / 読[よ]まない',
      pastNeg: '読[よ]みませんでした / 読[よ]まなかった',
      te: '読[よ]んで',
      prog: '読[よ]んでいます / 読[よ]んでいる',
      request: '読[よ]んでください / 読[よ]んで',
      want: '読[よ]みたいです / 読[よ]みたい',
      potential: '読[よ]めます / 読[よ]める',
      passive: '読[よ]まれます / 読[よ]まれる',
      causative: '読[よ]ませます / 読[よ]ませる',
      volitional: '読[よ]みましょう / 読[よ]もう',
      condTara: '読[よ]みましたら / 読[よ]んだら',
      condBa: '- / 読[よ]めば',
      imperative: '読[よ]みなさい / 読[よ]め',
      prohibitive: '読[よ]まないでください / 読[よ]むな',
    },
  },
  {
    // a godan verb that ends in え + る: only the tag says it is godan
    verb: { ja: '帰る', rd: 'かえる', tag: 'g' },
    rows: {
      pres: '帰[かえ]ります / 帰[かえ]る',
      past: '帰[かえ]りました / 帰[かえ]った',
      neg: '帰[かえ]りません / 帰[かえ]らない',
      pastNeg: '帰[かえ]りませんでした / 帰[かえ]らなかった',
      te: '帰[かえ]って',
      prog: '帰[かえ]っています / 帰[かえ]っている',
      request: '帰[かえ]ってください / 帰[かえ]って',
      want: '帰[かえ]りたいです / 帰[かえ]りたい',
      potential: '帰[かえ]れます / 帰[かえ]れる',
      passive: '帰[かえ]られます / 帰[かえ]られる',
      causative: '帰[かえ]らせます / 帰[かえ]らせる',
      volitional: '帰[かえ]りましょう / 帰[かえ]ろう',
      condTara: '帰[かえ]りましたら / 帰[かえ]ったら',
      condBa: '- / 帰[かえ]れば',
      imperative: '帰[かえ]りなさい / 帰[かえ]れ',
      prohibitive: '帰[かえ]らないでください / 帰[かえ]るな',
    },
  },
  {
    // 行く: the one く verb whose て/た is って/った
    verb: { ja: '行く', rd: 'いく', tag: 'g' },
    rows: {
      pres: '行[い]きます / 行[い]く',
      past: '行[い]きました / 行[い]った',
      neg: '行[い]きません / 行[い]かない',
      pastNeg: '行[い]きませんでした / 行[い]かなかった',
      te: '行[い]って',
      prog: '行[い]っています / 行[い]っている',
      request: '行[い]ってください / 行[い]って',
      want: '行[い]きたいです / 行[い]きたい',
      potential: '行[い]けます / 行[い]ける',
      passive: '行[い]かれます / 行[い]かれる',
      causative: '行[い]かせます / 行[い]かせる',
      volitional: '行[い]きましょう / 行[い]こう',
      condTara: '行[い]きましたら / 行[い]ったら',
      condBa: '- / 行[い]けば',
      imperative: '行[い]きなさい / 行[い]け',
      prohibitive: '行[い]かないでください / 行[い]くな',
    },
  },
  {
    // ある: plain negative ない, polite ありません, and no passive/potential/command
    verb: { ja: 'ある', rd: 'ある', tag: 'g' },
    rows: {
      pres: 'あります / ある',
      past: 'ありました / あった',
      neg: 'ありません / ない',
      pastNeg: 'ありませんでした / なかった',
      te: 'あって',
      prog: '- / -',
      request: '- / -',
      want: '- / -',
      potential: '- / -',
      passive: '- / -',
      causative: '- / -',
      volitional: 'ありましょう / あろう',
      condTara: 'ありましたら / あったら',
      condBa: '- / あれば',
      imperative: '- / -',
      prohibitive: '- / -',
    },
  },
  {
    verb: { ja: '食べる', rd: 'たべる', tag: 'i' },
    rows: {
      pres: '食[た]べます / 食[た]べる',
      past: '食[た]べました / 食[た]べた',
      neg: '食[た]べません / 食[た]べない',
      pastNeg: '食[た]べませんでした / 食[た]べなかった',
      te: '食[た]べて',
      prog: '食[た]べています / 食[た]べている',
      request: '食[た]べてください / 食[た]べて',
      want: '食[た]べたいです / 食[た]べたい',
      potential: '食[た]べられます / 食[た]べられる',
      passive: '食[た]べられます / 食[た]べられる',
      causative: '食[た]べさせます / 食[た]べさせる',
      volitional: '食[た]べましょう / 食[た]べよう',
      condTara: '食[た]べましたら / 食[た]べたら',
      condBa: '- / 食[た]べれば',
      imperative: '食[た]べなさい / 食[た]べろ',
      prohibitive: '食[た]べないでください / 食[た]べるな',
    },
  },
  {
    verb: { ja: 'する', rd: 'する', tag: 's' },
    rows: {
      pres: 'します / する',
      past: 'しました / した',
      neg: 'しません / しない',
      pastNeg: 'しませんでした / しなかった',
      te: 'して',
      prog: 'しています / している',
      request: 'してください / して',
      want: 'したいです / したい',
      potential: 'できます / できる',
      passive: 'されます / される',
      causative: 'させます / させる',
      volitional: 'しましょう / しよう',
      condTara: 'しましたら / したら',
      condBa: '- / すれば',
      imperative: 'しなさい / しろ',
      prohibitive: 'しないでください / するな',
    },
  },
  {
    verb: { ja: '勉強する', rd: 'べんきょうする', tag: 's' },
    rows: {
      pres: '勉強[べんきょう]します / 勉強[べんきょう]する',
      past: '勉強[べんきょう]しました / 勉強[べんきょう]した',
      neg: '勉強[べんきょう]しません / 勉強[べんきょう]しない',
      pastNeg: '勉強[べんきょう]しませんでした / 勉強[べんきょう]しなかった',
      te: '勉強[べんきょう]して',
      prog: '勉強[べんきょう]しています / 勉強[べんきょう]している',
      request: '勉強[べんきょう]してください / 勉強[べんきょう]して',
      want: '勉強[べんきょう]したいです / 勉強[べんきょう]したい',
      potential: '勉強[べんきょう]できます / 勉強[べんきょう]できる',
      passive: '勉強[べんきょう]されます / 勉強[べんきょう]される',
      causative: '勉強[べんきょう]させます / 勉強[べんきょう]させる',
      volitional: '勉強[べんきょう]しましょう / 勉強[べんきょう]しよう',
      condTara: '勉強[べんきょう]しましたら / 勉強[べんきょう]したら',
      condBa: '- / 勉強[べんきょう]すれば',
      imperative: '勉強[べんきょう]しなさい / 勉強[べんきょう]しろ',
      prohibitive: '勉強[べんきょう]しないでください / 勉強[べんきょう]するな',
    },
  },
  {
    // 来る: the reading of 来 changes (き, こ, く)
    verb: { ja: '来る', rd: 'くる', tag: 'k' },
    rows: {
      pres: '来[き]ます / 来[く]る',
      past: '来[き]ました / 来[き]た',
      neg: '来[き]ません / 来[こ]ない',
      pastNeg: '来[き]ませんでした / 来[こ]なかった',
      te: '来[き]て',
      prog: '来[き]ています / 来[き]ている',
      request: '来[き]てください / 来[き]て',
      want: '来[き]たいです / 来[き]たい',
      potential: '来[こ]られます / 来[こ]られる',
      passive: '来[こ]られます / 来[こ]られる',
      causative: '来[こ]させます / 来[こ]させる',
      volitional: '来[き]ましょう / 来[こ]よう',
      condTara: '来[き]ましたら / 来[き]たら',
      condBa: '- / 来[く]れば',
      imperative: '来[き]なさい / 来[こ]い',
      prohibitive: '来[こ]ないでください / 来[く]るな',
    },
  },
];

// Selected forms of many more verbs, including every godan ending.
const PARTIAL = [
  // godan う
  { verb: { ja: '言う', rd: 'いう', tag: 'g' }, rows: {
    pres: '言[い]います / 言[い]う', past: '言[い]いました / 言[い]った', neg: '言[い]いません / 言[い]わない',
    te: '言[い]って', potential: '* / 言[い]える', volitional: '言[い]いましょう / 言[い]おう', prohibitive: '* / 言[い]うな' } },
  { verb: { ja: '会う', rd: 'あう', tag: 'g' }, rows: {
    pres: '会[あ]います / 会[あ]う', past: '* / 会[あ]った', neg: '* / 会[あ]わない', te: '会[あ]って', condBa: '- / 会[あ]えば' } },
  { verb: { ja: '洗う', rd: 'あらう', tag: 'g' }, rows: {
    te: '洗[あら]って', passive: '* / 洗[あら]われる', causative: '* / 洗[あら]わせる', imperative: '洗[あら]いなさい / 洗[あら]え' } },
  // 問う keeps the う
  { verb: { ja: '問う', rd: 'とう', tag: 'g' }, rows: {
    pres: '問[と]います / 問[と]う', past: '* / 問[と]うた', te: '問[と]うて', neg: '* / 問[と]わない', volitional: '* / 問[と]おう' } },
  { verb: { ja: '乞う', rd: 'こう', tag: 'g' }, rows: { te: '乞[こ]うて', past: '* / 乞[こ]うた', pres: '乞[こ]います / 乞[こ]う' } },
  // godan く
  { verb: { ja: '書く', rd: 'かく', tag: 'g' }, rows: {
    pres: '書[か]きます / 書[か]く', past: '書[か]きました / 書[か]いた', neg: '書[か]きません / 書[か]かない',
    te: '書[か]いて', want: '書[か]きたいです / 書[か]きたい', potential: '書[か]けます / 書[か]ける',
    passive: '* / 書[か]かれる', causative: '* / 書[か]かせる', volitional: '書[か]きましょう / 書[か]こう',
    condBa: '- / 書[か]けば', imperative: '書[か]きなさい / 書[か]け', prohibitive: '* / 書[か]くな' } },
  { verb: { ja: '聞く', rd: 'きく', tag: 'g' }, rows: { te: '聞[き]いて', past: '* / 聞[き]いた', neg: '* / 聞[き]かない', pres: '聞[き]きます / 聞[き]く' } },
  { verb: { ja: '歩く', rd: 'あるく', tag: 'g' }, rows: { te: '歩[ある]いて', past: '* / 歩[ある]いた', potential: '* / 歩[ある]ける' } },
  // 行く and its spellings
  { verb: { ja: 'いく', rd: 'いく', tag: 'g' }, rows: { te: 'いって', past: '* / いった', neg: '* / いかない', pres: 'いきます / いく' } },
  { verb: { ja: '持って行く', rd: 'もっていく', tag: 'g' }, rows: {
    te: '持[も]って行[い]って', past: '* / 持[も]って行[い]った', neg: '* / 持[も]って行[い]かない', pres: '持[も]って行[い]きます / 持[も]って行[い]く' } },
  { verb: { ja: '逝く', rd: 'いく', tag: 'g' }, rows: { te: '逝[い]って', past: '* / 逝[い]った' } },
  // godan ぐ
  { verb: { ja: '泳ぐ', rd: 'およぐ', tag: 'g' }, rows: {
    pres: '泳[およ]ぎます / 泳[およ]ぐ', past: '泳[およ]ぎました / 泳[およ]いだ', neg: '* / 泳[およ]がない',
    te: '泳[およ]いで', potential: '泳[およ]げます / 泳[およ]げる', passive: '* / 泳[およ]がれる', causative: '* / 泳[およ]がせる',
    volitional: '泳[およ]ぎましょう / 泳[およ]ごう', condBa: '- / 泳[およ]げば', imperative: '* / 泳[およ]げ' } },
  { verb: { ja: '急ぐ', rd: 'いそぐ', tag: 'g' }, rows: { te: '急[いそ]いで', past: '* / 急[いそ]いだ', pres: '急[いそ]ぎます / 急[いそ]ぐ' } },
  // godan す
  { verb: { ja: '貸す', rd: 'かす', tag: 'g' }, rows: {
    te: '貸[か]して', past: '* / 貸[か]した', neg: '* / 貸[か]さない', potential: '* / 貸[か]せる', volitional: '* / 貸[か]そう' } },
  { verb: { ja: '探す', rd: 'さがす', tag: 'g' }, rows: { pres: '探[さが]します / 探[さが]す', te: '探[さが]して', imperative: '探[さが]しなさい / 探[さが]せ' } },
  // godan つ
  { verb: { ja: '待つ', rd: 'まつ', tag: 'g' }, rows: {
    pres: '待[ま]ちます / 待[ま]つ', past: '待[ま]ちました / 待[ま]った', neg: '待[ま]ちません / 待[ま]たない',
    te: '待[ま]って', potential: '待[ま]てます / 待[ま]てる', passive: '* / 待[ま]たれる', causative: '* / 待[ま]たせる',
    volitional: '待[ま]ちましょう / 待[ま]とう', condBa: '- / 待[ま]てば', imperative: '待[ま]ちなさい / 待[ま]て', prohibitive: '* / 待[ま]つな' } },
  { verb: { ja: '持つ', rd: 'もつ', tag: 'g' }, rows: { te: '持[も]って', past: '* / 持[も]った', pres: '持[も]ちます / 持[も]つ' } },
  { verb: { ja: '勝つ', rd: 'かつ', tag: 'g' }, rows: { te: '勝[か]って', neg: '* / 勝[か]たない', volitional: '* / 勝[か]とう' } },
  // godan ぬ (死ぬ is the only common one)
  { verb: { ja: '死ぬ', rd: 'しぬ', tag: 'g' }, rows: {
    pres: '死[し]にます / 死[し]ぬ', past: '死[し]にました / 死[し]んだ', neg: '死[し]にません / 死[し]なない',
    te: '死[し]んで', potential: '* / 死[し]ねる', passive: '* / 死[し]なれる', causative: '* / 死[し]なせる',
    volitional: '死[し]にましょう / 死[し]のう', condBa: '- / 死[し]ねば', imperative: '* / 死[し]ね' } },
  // godan verbs that end in じる / ずる (they conjugate with ら/り/っ, like 切る)
  { verb: { ja: 'かじる', rd: 'かじる', tag: 'g' }, rows: {
    pres: 'かじります / かじる', past: '* / かじった', neg: 'かじりません / かじらない', te: 'かじって', potential: '* / かじれる', condBa: '- / かじれば' } },
  { verb: { ja: '踏みにじる', rd: 'ふみにじる', tag: 'g' }, rows: {
    pres: '踏[ふ]みにじります / 踏[ふ]みにじる', neg: '* / 踏[ふ]みにじらない', te: '踏[ふ]みにじって', volitional: '* / 踏[ふ]みにじろう' } },
  { verb: { ja: '引きずる', rd: 'ひきずる', tag: 'g' }, rows: {
    pres: '引[ひ]きずります / 引[ひ]きずる', past: '引[ひ]きずりました / 引[ひ]きずった', neg: '引[ひ]きずりません / 引[ひ]きずらない',
    te: '引[ひ]きずって', potential: '* / 引[ひ]きずれる', passive: '* / 引[ひ]きずられる', imperative: '* / 引[ひ]きずれ' } },
  { verb: { ja: 'さえずる', rd: 'さえずる', tag: 'g' }, rows: {
    pres: 'さえずります / さえずる', neg: '* / さえずらない', te: 'さえずって', past: '* / さえずった' } },
  // "Nをする" has the potential Nをすることができる; "Nとする" uses とすることができる
  { verb: { ja: 'あくびをする', rd: 'あくびをする', tag: 's' }, rows: {
    pres: 'あくびをします / あくびをする', neg: '* / あくびをしない', te: 'あくびをして',
    potential: 'あくびをすることができます / あくびをすることができる', passive: '* / あくびをされる', condBa: '- / あくびをすれば' } },
  { verb: { ja: '世話をする', rd: 'せわをする', tag: 's' }, rows: {
    pres: '世話[せわ]をします / 世話[せわ]をする', potential: '世話[せわ]をすることができます / 世話[せわ]をすることができる' } },
  { verb: { ja: 'レスリングをする', rd: 'れすりんぐをする', tag: 's' }, rows: {
    potential: 'レスリング[れすりんぐ]をすることができます / レスリング[れすりんぐ]をすることができる' } },
  { verb: { ja: '咳をする', rd: 'せきをする', tag: 's' }, rows: { potential: '咳[せき]をすることができます / 咳[せき]をすることができる' } },
  { verb: { ja: '封をする', rd: 'ふうをする', tag: 's' }, rows: { potential: '封[ふう]をすることができます / 封[ふう]をすることができる' } },
  { verb: { ja: 'ふりをする', rd: 'ふりをする', tag: 's' }, rows: { potential: '* / ふりをすることができる', past: '* / ふりをした' } },
  { verb: { ja: '拒否権を行使する', rd: 'きょひけんをこうしする', tag: 's' }, rows: {
    potential: '拒否権[きょひけん]を行使[こうし]できます / 拒否権[きょひけん]を行使[こうし]できる' } },
  { verb: { ja: '必要とする', rd: 'ひつようとする', tag: 's' }, rows: {
    pres: '必要[ひつよう]とします / 必要[ひつよう]とする',
    potential: '必要[ひつよう]とすることができます / 必要[ひつよう]とすることができる', passive: '* / 必要[ひつよう]とされる' } },
  { verb: { ja: '犠牲にする', rd: 'ぎせいにする', tag: 's' }, rows: { potential: '* / 犠牲[ぎせい]にできる' } },
  { verb: { ja: '厚くする', rd: 'あつくする', tag: 's' }, rows: { potential: '* / 厚[あつ]くできる' } },
  // 罰する 発する 帰する: the standard passive is …せられる; other verbs ending in …罰する, …発する keep される
  { verb: { ja: '罰する', rd: 'ばっする', tag: 's' }, rows: {
    pres: '罰[ばっ]します / 罰[ばっ]する', neg: '罰[ばっ]しません / 罰[ばっ]しない', te: '罰[ばっ]して',
    passive: '罰[ばっ]せられます / 罰[ばっ]せられる', causative: '* / 罰[ばっ]させる', potential: '罰[ばっ]することができます / 罰[ばっ]することができる' } },
  { verb: { ja: '発する', rd: 'はっする', tag: 's' }, rows: {
    pres: '発[はっ]します / 発[はっ]する', passive: '発[はっ]せられます / 発[はっ]せられる' } },
  { verb: { ja: '帰する', rd: 'きする', tag: 's' }, rows: { passive: '帰[き]せられます / 帰[き]せられる', pres: '帰[き]します / 帰[き]する' } },
  { verb: { ja: '処罰する', rd: 'しょばつする', tag: 's' }, rows: { passive: '処罰[しょばつ]されます / 処罰[しょばつ]される', potential: '* / 処罰[しょばつ]できる' } },
  { verb: { ja: '出発する', rd: 'しゅっぱつする', tag: 's' }, rows: { passive: '* / 出発[しゅっぱつ]される' } },
  { verb: { ja: '属する', rd: 'ぞくする', tag: 's' }, rows: { passive: '属[ぞく]されます / 属[ぞく]される', potential: '* / 属[ぞく]することができる' } },
  // いる (be, exist) has no progressive (いている); the other forms exist
  { verb: { ja: 'いる', rd: 'いる', tag: 'i' }, rows: {
    pres: 'います / いる', past: 'いました / いた', neg: 'いません / いない', te: 'いて', prog: '- / -',
    request: 'いてください / いて', want: 'いたいです / いたい', potential: 'いられます / いられる', causative: '* / いさせる',
    volitional: 'いましょう / いよう', condBa: '- / いれば', imperative: 'いなさい / いろ', prohibitive: 'いないでください / いるな' } },
  { verb: { ja: '居る', rd: 'いる', tag: 'i' }, rows: { prog: '- / -', te: '居[い]て', potential: '* / 居[い]られる' } },
  // 射る (いる) is a different verb: it keeps its progressive
  { verb: { ja: '射る', rd: 'いる', tag: 'i' }, rows: { prog: '射[い]ています / 射[い]ている', te: '射[い]て' } },
  // 思える already means "can be thought, seems": no potential, like 見える
  { verb: { ja: '思える', rd: 'おもえる', tag: 'i' }, rows: {
    pres: '思[おも]えます / 思[おも]える', past: '思[おも]えました / 思[おも]えた', neg: '思[おも]えません / 思[おも]えない',
    te: '思[おも]えて', prog: '思[おも]えています / 思[おも]えている', potential: '- / -', passive: '- / -', imperative: '- / -', condBa: '- / 思[おも]えれば' } },
  // godan ぶ
  { verb: { ja: '遊ぶ', rd: 'あそぶ', tag: 'g' }, rows: {
    pres: '遊[あそ]びます / 遊[あそ]ぶ', past: '遊[あそ]びました / 遊[あそ]んだ', neg: '* / 遊[あそ]ばない',
    te: '遊[あそ]んで', potential: '遊[あそ]べます / 遊[あそ]べる', volitional: '遊[あそ]びましょう / 遊[あそ]ぼう',
    condBa: '- / 遊[あそ]べば', imperative: '* / 遊[あそ]べ' } },
  { verb: { ja: '呼ぶ', rd: 'よぶ', tag: 'g' }, rows: { te: '呼[よ]んで', past: '* / 呼[よ]んだ', passive: '* / 呼[よ]ばれる' } },
  // godan む
  { verb: { ja: '飲む', rd: 'のむ', tag: 'g' }, rows: {
    te: '飲[の]んで', past: '* / 飲[の]んだ', pres: '飲[の]みます / 飲[の]む', potential: '* / 飲[の]める', volitional: '* / 飲[の]もう' } },
  { verb: { ja: '住む', rd: 'すむ', tag: 'g' }, rows: { te: '住[す]んで', condTara: '住[す]みましたら / 住[す]んだら' } },
  // godan る
  { verb: { ja: '走る', rd: 'はしる', tag: 'g' }, rows: {
    pres: '走[はし]ります / 走[はし]る', te: '走[はし]って', past: '* / 走[はし]った', neg: '* / 走[はし]らない',
    potential: '* / 走[はし]れる', volitional: '* / 走[はし]ろう' } },
  { verb: { ja: '作る', rd: 'つくる', tag: 'g' }, rows: { te: '作[つく]って', neg: '* / 作[つく]らない', imperative: '作[つく]りなさい / 作[つく]れ' } },
  { verb: { ja: '切る', rd: 'きる', tag: 'g' }, rows: {
    pres: '切[き]ります / 切[き]る', te: '切[き]って', neg: '* / 切[き]らない', potential: '* / 切[き]れる', volitional: '* / 切[き]ろう' } },
  { verb: { ja: '知る', rd: 'しる', tag: 'g' }, rows: {
    pres: '知[し]ります / 知[し]る', neg: '知[し]りません / 知[し]らない', te: '知[し]って', prog: '知[し]っています / 知[し]っている' } },
  { verb: { ja: 'なる', rd: 'なる', tag: 'g' }, rows: { pres: 'なります / なる', neg: 'なりません / ならない', te: 'なって', potential: 'なれます / なれる' } },
  // ある written with kanji
  { verb: { ja: '有る', rd: 'ある', tag: 'g' }, rows: {
    pres: '有[あ]ります / 有[あ]る', neg: '有[あ]りません / ない', pastNeg: '有[あ]りませんでした / なかった', past: '有[あ]りました / 有[あ]った',
    te: '有[あ]って', condBa: '- / 有[あ]れば', passive: '- / -', imperative: '- / -' } },
  { verb: { ja: 'である', rd: 'である', tag: 'g' }, rows: {
    pres: 'であります / である', neg: 'ではありません / ではない', pastNeg: 'ではありませんでした / ではなかった', te: 'であって', potential: '- / -' } },
  // ichidan
  { verb: { ja: '見る', rd: 'みる', tag: 'i' }, rows: {
    pres: '見[み]ます / 見[み]る', past: '見[み]ました / 見[み]た', neg: '見[み]ません / 見[み]ない', te: '見[み]て',
    potential: '見[み]られます / 見[み]られる', passive: '見[み]られます / 見[み]られる', causative: '見[み]させます / 見[み]させる',
    volitional: '見[み]ましょう / 見[み]よう', condBa: '- / 見[み]れば', imperative: '見[み]なさい / 見[み]ろ', prohibitive: '* / 見[み]るな' } },
  { verb: { ja: '起きる', rd: 'おきる', tag: 'i' }, rows: {
    pres: '起[お]きます / 起[お]きる', neg: '* / 起[お]きない', te: '起[お]きて', potential: '* / 起[お]きられる',
    volitional: '* / 起[お]きよう', condBa: '- / 起[お]きれば', imperative: '起[お]きなさい / 起[お]きろ' } },
  { verb: { ja: '寝る', rd: 'ねる', tag: 'i' }, rows: {
    pres: '寝[ね]ます / 寝[ね]る', neg: '* / 寝[ね]ない', te: '寝[ね]て', past: '* / 寝[ね]た', potential: '* / 寝[ね]られる', volitional: '* / 寝[ね]よう', imperative: '* / 寝[ね]ろ' } },
  // 着る is ichidan although 切る (same reading) is godan
  { verb: { ja: '着る', rd: 'きる', tag: 'i' }, rows: {
    pres: '着[き]ます / 着[き]る', neg: '* / 着[き]ない', te: '着[き]て', potential: '* / 着[き]られる', imperative: '* / 着[き]ろ' } },
  { verb: { ja: '借りる', rd: 'かりる', tag: 'i' }, rows: {
    pres: '借[か]ります / 借[か]りる', neg: '* / 借[か]りない', te: '借[か]りて', potential: '* / 借[か]りられる', condBa: '- / 借[か]りれば' } },
  { verb: { ja: '出る', rd: 'でる', tag: 'i' }, rows: {
    pres: '出[で]ます / 出[で]る', neg: '* / 出[で]ない', te: '出[で]て', potential: '* / 出[で]られる', volitional: '* / 出[で]よう', imperative: '* / 出[で]ろ' } },
  { verb: { ja: '開ける', rd: 'あける', tag: 'i' }, rows: {
    pres: '開[あ]けます / 開[あ]ける', neg: '* / 開[あ]けない', te: '開[あ]けて', past: '* / 開[あ]けた', condBa: '- / 開[あ]ければ' } },
  { verb: { ja: '教える', rd: 'おしえる', tag: 'i' }, rows: {
    pres: '教[おし]えます / 教[おし]える', neg: '* / 教[おし]えない', te: '教[おし]えて', potential: '* / 教[おし]えられる', causative: '* / 教[おし]えさせる' } },
  { verb: { ja: '信じる', rd: 'しんじる', tag: 'i' }, rows: {
    pres: '信[しん]じます / 信[しん]じる', neg: '* / 信[しん]じない', te: '信[しん]じて', volitional: '* / 信[しん]じよう', imperative: '* / 信[しん]じろ' } },
  { verb: { ja: '居る', rd: 'いる', tag: 'i' }, rows: {
    pres: '居[い]ます / 居[い]る', neg: '居[い]ません / 居[い]ない', te: '居[い]て', potential: '* / 居[い]られる', imperative: '* / 居[い]ろ' } },
  // する compounds
  { verb: { ja: '運動する', rd: 'うんどうする', tag: 's' }, rows: {
    pres: '運動[うんどう]します / 運動[うんどう]する', past: '* / 運動[うんどう]した', neg: '* / 運動[うんどう]しない',
    te: '運動[うんどう]して', potential: '運動[うんどう]できます / 運動[うんどう]できる', passive: '* / 運動[うんどう]される',
    causative: '* / 運動[うんどう]させる', volitional: '* / 運動[うんどう]しよう', condBa: '- / 運動[うんどう]すれば',
    imperative: '* / 運動[うんどう]しろ', prohibitive: '* / 運動[うんどう]するな' } },
  { verb: { ja: 'コピーする', rd: 'こぴーする', tag: 's' }, rows: {
    pres: 'コピー[こぴー]します / コピー[こぴー]する', past: '* / コピー[こぴー]した', neg: '* / コピー[こぴー]しない',
    te: 'コピー[こぴー]して', potential: '* / コピー[こぴー]できる', condBa: '- / コピー[こぴー]すれば', prohibitive: '* / コピー[こぴー]するな' } },
  { verb: { ja: 'ダウンロードする', rd: 'だうんろーどする', tag: 's' }, rows: {
    pres: 'ダウンロード[だうんろーど]します / ダウンロード[だうんろーど]する', te: 'ダウンロード[だうんろーど]して',
    potential: '* / ダウンロード[だうんろーど]できる', passive: '* / ダウンロード[だうんろーど]される' } },
  { verb: { ja: 'お願いする', rd: 'おねがいする', tag: 's' }, rows: {
    pres: 'お願[ねが]いします / お願[ねが]いする', te: 'お願[ねが]いして', potential: '* / お願[ねが]いできる' } },
  // single-kanji する verbs
  { verb: { ja: '愛する', rd: 'あいする', tag: 's' }, rows: {
    pres: '愛[あい]します / 愛[あい]する', past: '* / 愛[あい]した', neg: '愛[あい]しません / 愛[あい]さない',
    pastNeg: '* / 愛[あい]さなかった', te: '愛[あい]して', potential: '* / 愛[あい]せる', passive: '* / 愛[あい]される',
    causative: '* / 愛[あい]させる', condBa: '- / 愛[あい]すれば' } },
  { verb: { ja: '接する', rd: 'せっする', tag: 's' }, rows: {
    pres: '接[せっ]します / 接[せっ]する', neg: '* / 接[せっ]しない', te: '接[せっ]して',
    potential: '接[せっ]することができます / 接[せっ]することができる', passive: '* / 接[せっ]される' } },
  // 来る compounds and kana
  { verb: { ja: '持って来る', rd: 'もってくる', tag: 'k' }, rows: {
    pres: '持[も]って来[き]ます / 持[も]って来[く]る', neg: '持[も]って来[き]ません / 持[も]って来[こ]ない', te: '持[も]って来[き]て',
    past: '* / 持[も]って来[き]た', potential: '* / 持[も]って来[こ]られる', volitional: '* / 持[も]って来[こ]よう',
    condBa: '- / 持[も]って来[く]れば', imperative: '持[も]って来[き]なさい / 持[も]って来[こ]い', prohibitive: '* / 持[も]って来[く]るな' } },
  { verb: { ja: 'くる', rd: 'くる', tag: 'k' }, rows: {
    pres: 'きます / くる', neg: 'きません / こない', te: 'きて', past: '* / きた', potential: '* / こられる', volitional: '* / こよう',
    condBa: '- / くれば', imperative: 'きなさい / こい', prohibitive: 'こないでください / くるな' } },
  // honorific verbs: polite stem in い, plain imperative is that stem
  { verb: { ja: '下さる', rd: 'くださる', tag: 'g' }, rows: {
    pres: '下[くだ]さいます / 下[くだ]さる', past: '下[くだ]さいました / 下[くだ]さった', neg: '下[くだ]さいません / 下[くだ]さらない',
    te: '下[くだ]さって', imperative: '- / 下[くだ]さい', request: '- / -', potential: '- / -', condBa: '- / 下[くだ]されば' } },
  { verb: { ja: 'いらっしゃる', rd: 'いらっしゃる', tag: 'g' }, rows: {
    pres: 'いらっしゃいます / いらっしゃる', neg: 'いらっしゃいません / いらっしゃらない', te: 'いらっしゃって',
    imperative: '- / いらっしゃい', passive: '- / -' } },
  { verb: { ja: 'なさる', rd: 'なさる', tag: 'g' }, rows: {
    pres: 'なさいます / なさる', past: 'なさいました / なさった', te: 'なさって', imperative: '- / なさい' } },
  { verb: { ja: '仰る', rd: 'おっしゃる', tag: 'g' }, rows: {
    pres: '仰[おっしゃ]います / 仰[おっしゃ]る', neg: '* / 仰[おっしゃ]らない', te: '仰[おっしゃ]って', imperative: '- / 仰[おっしゃ]い' } },
  // stative verbs
  { verb: { ja: 'できる', rd: 'できる', tag: 'i' }, rows: {
    pres: 'できます / できる', neg: 'できません / できない', te: 'できて', past: 'できました / できた', condTara: 'できましたら / できたら',
    volitional: 'できましょう / できよう', condBa: '- / できれば', potential: '- / -', passive: '- / -', imperative: '- / -', prog: 'できています / できている' } },
  { verb: { ja: '出来る', rd: 'できる', tag: 'i' }, rows: { pres: '出来[でき]ます / 出来[でき]る', neg: '* / 出来[でき]ない', potential: '- / -' } },
  { verb: { ja: '分かる', rd: 'わかる', tag: 'g' }, rows: {
    pres: '分[わ]かります / 分[わ]かる', neg: '分[わ]かりません / 分[わ]からない', te: '分[わ]かって', want: '分[わ]かりたいです / 分[わ]かりたい',
    request: '分[わ]かってください / 分[わ]かって', potential: '- / -', passive: '- / -', imperative: '- / -' } },
  { verb: { ja: '見える', rd: 'みえる', tag: 'i' }, rows: {
    pres: '見[み]えます / 見[み]える', neg: '見[み]えません / 見[み]えない', te: '見[み]えて', prog: '見[み]えています / 見[み]えている', potential: '- / -' } },
  { verb: { ja: 'くれる', rd: 'くれる', tag: 'i' }, rows: {
    pres: 'くれます / くれる', past: 'くれました / くれた', neg: 'くれません / くれない', te: 'くれて',
    request: '- / -', want: '- / -', potential: '- / -', passive: '- / -', causative: '- / -', imperative: '- / くれ',
    prohibitive: 'くれないでください / くれるな', volitional: 'くれましょう / くれよう', condBa: '- / くれれば' } },
  { verb: { ja: '呉れる', rd: 'くれる', tag: 'i' }, rows: { imperative: '- / 呉[く]れ', pres: '呉[く]れます / 呉[く]れる', request: '- / -' } },
  // an ichidan verb that is not くれる keeps the …ろ imperative
  { verb: { ja: '暮れる', rd: 'くれる', tag: 'i' }, rows: { imperative: '暮[く]れなさい / 暮[く]れろ', request: '暮[く]れてください / 暮[く]れて' } },
  { verb: { ja: '要る', rd: 'いる', tag: 'g' }, rows: {
    pres: '要[い]ります / 要[い]る', neg: '要[い]りません / 要[い]らない', te: '要[い]って', passive: '- / -' } },
];

let paradigmChecks = 0;
for (const { verb, rows } of [...FULL, ...PARTIAL]) {
  const label = `${verb.ja} (${verb.rd})`;
  const result = express(verb);
  if (result.ja !== verb.ja || result.rd !== verb.rd) failures.push(`${label}: express() returned ja/rd "${result.ja}" / "${result.rd}"`);
  for (const [key, spec] of Object.entries(rows)) {
    const wants = expectedCells(spec);
    wants.forEach((want, style) => {
      if (want === undefined) return;
      report.checks += 1;
      paradigmChecks += 1;
      const actual = result.rows[key][style];
      const got = show(actual);
      const expected = want && show(want);
      if (want && /\[|\]/.test(want.ja + want.rd)) failures.push(`${label}.${key}: test expectation "${spec}" has unbalanced brackets`);
      if (got !== expected) {
        failures.push(`${label}.${key}[${style === 0 ? 'polite' : 'plain'}]\n    expected: ${expected}\n    actual:   ${got}`);
      }
    });
  }
}

// every FULL verb lists all 16 keys, so a missing expectation is caught here
for (const { verb, rows } of FULL) {
  const missing = KEY_ORDER.filter(key => !(key in rows));
  if (missing.length) failures.push(`${verb.ja}: full paradigm is missing keys ${missing.join(', ')}`);
}

// the keys, in order
report.checks += 1;
if (ROW_KEYS.join(' ') !== KEY_ORDER.join(' ')) failures.push(`ROW_KEYS are [${ROW_KEYS.join(' ')}]`);
for (const { verb } of [...FULL, ...PARTIAL]) {
  report.checks += 1;
  const keys = Object.keys(express(verb).rows).join(' ');
  if (keys !== KEY_ORDER.join(' ')) failures.push(`${verb.ja}: rows are [${keys}], not the 16 keys in order`);
}

// ---- Shapes that must hold for every verb ----------------------------------------------

// What the reading of each form must end in: [polite, plain] (null: no form).
const SHAPE = {
  past: [/ました$/, /[ただ]$/],
  neg: [/ません$/, /ない$/],
  pastNeg: [/ませんでした$/, /なかった$/],
  te: [/[てで]$/, /[てで]$/],
  prog: [/[てで]います$/, /[てで]いる$/],
  request: [/[てで]ください$/, /[てで]$/],
  want: [/たいです$/, /たい$/],
  potential: [/ます$/, /る$/],
  passive: [/れます$/, /れる$/],
  causative: [/せます$/, /せる$/],
  volitional: [/ましょう$/, /う$/],
  condTara: [/ましたら$/, /[ただ]ら$/],
  condBa: [null, /ば$/],
  imperative: [/なさい$/, /[えけげせぜてでねへべぺめれろい]$/],
  prohibitive: [/ないでください$/, /な$/],
};

// Forms that are null on purpose, for verbs whose meaning rules them out.
const NEVER = {
  aru: ['prog', 'request', 'want', 'potential', 'passive', 'causative', 'imperative', 'prohibitive'],
  dekiru: ['request', 'want', 'potential', 'passive', 'causative', 'imperative', 'prohibitive'],
  wakaru: ['potential', 'passive', 'imperative', 'prohibitive'],
  mieru: ['request', 'want', 'potential', 'passive', 'causative', 'imperative', 'prohibitive'],
  need: ['prog', 'request', 'want', 'potential', 'passive', 'causative', 'imperative', 'prohibitive'],
  iru: ['prog'],
  kureru: ['request', 'want', 'potential', 'passive', 'causative'],
  honorific: ['request', 'want', 'potential', 'passive', 'causative', 'volitional', 'prohibitive'],
};
function expectedNulls({ ja, rd, tag }) {
  const nulls = new Set(['condBa:0']);
  const add = (keys, styles = [0, 1]) => keys.forEach(key => styles.forEach(style => nulls.add(`${key}:${style}`)));
  if (tag === 'g' && (ja === 'ある' || ja === '有る' || ja === '在る' || ja === 'である') && rd.endsWith('ある')) add(NEVER.aru);
  if (['できる', '出来る'].includes(ja) && rd === 'できる') add(NEVER.dekiru);
  if (['分かる', '分る', '判る', '解る', 'わかる'].includes(ja) && rd === 'わかる') add(NEVER.wakaru);
  if (['見える', 'みえる', '聞こえる', 'きこえる'].includes(ja) && ['みえる', 'きこえる'].includes(rd)) add(NEVER.mieru);
  if (['思える', 'おもえる'].includes(ja) && rd === 'おもえる') add(NEVER.mieru);
  if (tag === 'i' && ['いる', '居る'].includes(ja) && rd === 'いる') add(NEVER.iru);
  if (ja === '要る' && rd === 'いる') add(NEVER.need);
  if (['くれる', '呉れる'].includes(ja) && rd === 'くれる') { add(NEVER.kureru); add(['imperative'], [0]); }
  if (tag === 'g' && ['くださる', 'なさる', 'いらっしゃる', 'おっしゃる'].some(ending => rd.endsWith(ending))) {
    add(NEVER.honorific);
    add(['imperative'], [0]);
  }
  return nulls;
}

// ---- Text checks ----------------------------------------------------------------------------

const KANJI = '一-鿿々〆ヶ';
const JA_ONLY = /^[ぁ-ゖァ-ヺー一-鿿々〆]+$/;
const RD_ONLY = /^[ぁ-ゖー]+$/;
const toHiragana = text => text.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));

// Does reading `rd` fit spelling `ja`? Every kana of ja appears in rd in order
// (katakana as hiragana), and each run of kanji stands for at least as many kana
// as it has kanji.
function aligned(ja, rd) {
  const pieces = ja.match(new RegExp(`[${KANJI}]+|[^${KANJI}]`, 'g')) || [];
  const pattern = pieces
    .map(piece => (new RegExp(`^[${KANJI}]+$`).test(piece) ? `.{${[...piece].length},}?` : toHiragana(piece)))
    .join('');
  return new RegExp(`^${pattern}$`).test(rd);
}

const GODAN_ENDINGS = 'うくぐすつぬぶむる';
const I_OR_E_ROW = 'いきしちにひみりぎじぢびぴえけせてねへめれげぜでべぺ';

// Verbs that look ichidan (…いる/…える) but are godan, and the other way round. Only
// spellings that name one verb are listed (かえる alone is ambiguous).
const GODAN_LOOKING_ICHIDAN = new Set(`帰る 入る 走る 切る 知る 要る 限る 散る 減る 滑る 握る 蹴る 参る 焦る 茂る 練る 照る 湿る
  遮る 返る 翻る 覆る 喋る 混じる 交じる 雑じる 捻る 弄る 齧る 罵る 千切る 陥る 嘲る 遡る 阿る 漲る`.split(/\s+/));
const ICHIDAN = new Set(`食べる 見る 着る 寝る 起きる 出る 借りる 降りる 下りる 浴びる 過ぎる 閉じる 信じる 感じる 生きる 落ちる 負ける
  開ける 始める 教える 考える 答える 覚える 忘れる 続ける 見せる 見える 聞こえる 変える 替える 換える 代える 越える 超える 数える
  与える 伝える 加える 迎える 増える 燃える 消える 冷える 生える 出来る 足りる 居る 得る 似る 煮る 射る 干る 試みる 省みる 恥じる
  禁じる 命じる 応じる 混ぜる 捨てる 建てる 育てる 立てる 調べる 比べる 並べる 述べる 遅れる 別れる 壊れる 汚れる 疲れる 生まれる
  慣れる 触れる 訪れる 現れる 倒れる 流れる 離れる 外れる 連れる 入れる 晴れる 折れる 割れる 売れる 焼ける 助ける 受ける 掛ける
  欠ける 避ける 儲ける 分ける 預ける 向ける 付ける 着ける 届ける 見つける`.split(/\s+/));
// Endings that only godan verbs have, so any verb ENDING in them (a compound such as 気に入る or
// 打ち切る) is godan. かえる, きる, いる, ける, ねる, てる are left out: they end ichidan verbs too.
const GODAN_ONLY_SPELLINGS = ['入る', '切る', '知る', '走る', '蹴る', '減る', '帰る', '返る', '限る', '散る', '滑る', '握る', '照る',
  '練る', '捻る', '罵る', '喋る', '遮る', '茂る'];
const GODAN_ONLY_READINGS = ['ちぎる', 'むしる', 'つねる', 'しゃべる', 'さえぎる', 'よみがえる', 'ひるがえる', 'あざける', 'ののしる',
  'にぎる', 'ひねる'];
// Short readings are listed whole: 命じる (めいじる) is ichidan although it ends in いじる.
const GODAN_ONLY_WHOLE_READINGS = new Set(['いじる', 'なじる', 'もじる', 'ねじる', 'かじる', 'はいる', 'はしる', 'しげる', 'すべる']);
// godan verbs spelled in kana that end in じる (everything else ending in じる is ichidan)
const GODAN_JIRU_READINGS = new Set(['まじる', 'ねじる', 'もじる', 'なじる', 'いじる', 'かじる', 'ふみにじる']);
// godan verbs that end in ずる (引きずる, 這いずる, さえずる); every other …ずる verb is サ変 (論ずる)
const GODAN_ZURU_READINGS = new Set(['ひきずる', 'はいずる', 'さえずる']);
// godan verbs that end in する when written in kana
const GODAN_SURU_SPELLINGS = new Set(['すする', 'こする']);

// Returns a description of what is wrong, or '' when the tag fits the ending.
function tagProblem({ ja, rd, tag }) {
  if (!['g', 'i', 's', 'k'].includes(tag)) return `unknown tag "${tag}"`;
  if (tag === 'g') {
    if (!GODAN_ENDINGS.includes(ja.slice(-1))) return 'godan verb must end in う く ぐ す つ ぬ ぶ む る';
    if (ja.slice(-1) !== rd.slice(-1)) return `ja ends in "${ja.slice(-1)}" but the reading ends in "${rd.slice(-1)}"`;
    if (ja.endsWith('ずる') && !GODAN_ZURU_READINGS.has(rd)) return 'ずる verbs are サ変; spell it じる (ichidan)';
    if (ja.endsWith('じる') && !GODAN_JIRU_READINGS.has(rd)) return 'a verb ending in じる is ichidan, not godan';
    if (ja.endsWith('する') && !GODAN_SURU_SPELLINGS.has(ja)) return 'ja ends in する, so the tag must be s';
    if (/来る$/.test(ja) && rd.endsWith('くる')) return 'a verb ending in 来る (くる) must be tagged k';
    if (ICHIDAN.has(ja)) return `${ja} is ichidan`;
  }
  if (tag === 'i') {
    if (!ja.endsWith('る') || !rd.endsWith('る')) return 'ichidan verb must end in る';
    const before = rd.slice(-2, -1);
    if (!before || !I_OR_E_ROW.includes(before)) return 'ichidan: the kana before る must be an i- or e-row sound';
    if (GODAN_LOOKING_ICHIDAN.has(ja)) return `${ja} is godan`;
    if (GODAN_ONLY_SPELLINGS.some(ending => ja.endsWith(ending))) return `${ja} ends like a godan verb`;
    if (GODAN_ONLY_READINGS.some(ending => rd.endsWith(ending)) || GODAN_ONLY_WHOLE_READINGS.has(rd)) {
      return `${ja} (${rd}) is a godan verb`;
    }
    if (ja.endsWith('する')) return 'ja ends in する, so the tag must be s';
  }
  if (tag === 's') {
    if (!ja.endsWith('する') || !rd.endsWith('する')) return 's verb must end in する in ja and rd';
  }
  if (tag === 'k') {
    if (!/(来る|くる)$/.test(ja) || !rd.endsWith('くる')) return 'k verb must end in 来る/くる with the reading くる';
    const prefix = ja.replace(/(来る|くる)$/, '');
    if (prefix && !/[てでに]$/.test(prefix)) return 'k verbs are 来る itself or a …て来る compound';
  }
  return '';
}

// ---- Validating the verb database -------------------------------------------------------

// Spellings that legitimately carry two readings (different words).
const TWO_READINGS = new Map([
  ['開く', ['あく', 'ひらく']],
  ['空く', ['あく', 'すく']],
  ['止める', ['とめる', 'やめる']],
  ['解く', ['とく', 'ほどく']],
]);

let translations = 0;
const seen = new Map();
for (const [english, options] of Object.entries(VERBS)) {
  const inThisLine = new Set();
  options.forEach(entry => {
    translations += 1;
    const { ja, rd, tag } = entry;
    const label = `${english} -> ${ja} ${rd} [${tag}]`;
    const failuresBefore = failures.length;
    if (typeof ja !== 'string' || typeof rd !== 'string') { failures.push(`${label}: ja and rd must be strings`); return; }

    if (!JA_ONLY.test(ja)) failures.push(`${label}: ja may contain only kanji, kana and ー`);
    if (!RD_ONLY.test(rd)) failures.push(`${label}: rd may contain only hiragana and ー`);
    if (JA_ONLY.test(ja) && RD_ONLY.test(rd)) {
      if (!new RegExp(`[${KANJI}]`).test(ja)) {
        if (toHiragana(ja) !== rd) failures.push(`${label}: ja is all kana, so rd must be "${toHiragana(ja)}"`);
      } else if (!aligned(ja, rd)) {
        failures.push(`${label}: the kana of ja do not match the reading (okurigana)`);
      }
    }

    const problem = tagProblem(entry);
    if (problem) failures.push(`${label}: ${problem}`);

    // one reading per spelling across the whole database
    const known = seen.get(ja);
    if (known !== undefined && known !== rd && !(TWO_READINGS.get(ja) || []).includes(rd)) {
      failures.push(`${label}: ${ja} is also read "${known}" elsewhere`);
    }
    if (known === undefined) seen.set(ja, rd);
    const twin = `${ja} ${rd}`;
    if (inThisLine.has(twin)) failures.push(`${label}: listed twice for the same English verb`);
    inThisLine.add(twin);

    // an entry that is already wrong would only repeat its fault in every row
    if (failures.length > failuresBefore) return;

    // every row exists and is well formed
    let result;
    try {
      result = express({ ja, rd, tag });
    } catch (error) {
      failures.push(`${label}: express() threw: ${error.message}`);
      return;
    }
    const nulls = expectedNulls({ ja, rd, tag });
    for (const key of ROW_KEYS) {
      const row = result.rows[key];
      if (!Array.isArray(row) || row.length !== 2) { failures.push(`${label}: malformed row ${key}`); continue; }
      row.forEach((formCell, style) => {
        const where = `${label}: ${key}[${style === 0 ? 'polite' : 'plain'}]`;
        if (formCell === null) {
          if (!nulls.has(`${key}:${style}`)) failures.push(`${where} is null but the verb uses this form`);
          return;
        }
        if (nulls.has(`${key}:${style}`)) failures.push(`${where} should be null`);
        if (!formCell || typeof formCell.ja !== 'string' || typeof formCell.rd !== 'string' || !formCell.ja || !formCell.rd) {
          failures.push(`${where} is not a { ja, rd } cell`);
          return;
        }
        if (/undefined|NaN|null|\[object/.test(formCell.ja + formCell.rd)) failures.push(`${where}: broken cell ${show(formCell)}`);
        else if (!JA_ONLY.test(formCell.ja) || !RD_ONLY.test(formCell.rd)) failures.push(`${where}: bad characters in ${show(formCell)}`);
        else if (!aligned(formCell.ja, formCell.rd)) failures.push(`${where}: spelling and reading disagree in ${show(formCell)}`);
        const shape = SHAPE[key];
        if (shape && shape[style] && !shape[style].test(formCell.rd)) failures.push(`${where}: odd ending in ${show(formCell)}`);
        if (shape && shape[style] === null) failures.push(`${where} should be null`);
      });
    }
    const { pres, te } = result.rows;
    if (!pres[0] || !/ます$/.test(pres[0].rd)) failures.push(`${label}: polite present should end in ます`);
    if (!pres[1] || pres[1].ja !== ja || pres[1].rd !== rd) failures.push(`${label}: plain present should be the dictionary form`);
    if (!te[0] || !te[1] || te[0].ja !== te[1].ja || te[0].rd !== te[1].rd) failures.push(`${label}: the て-form should be the same in both styles`);
  });
}

// ---- The tag rules themselves -----------------------------------------------------------------
// Each entry is [verb, whether tagProblem() must complain].
const TAG_RULES = [
  [{ ja: 'かじる', rd: 'かじる', tag: 'g' }, false],           // godan: かじった
  [{ ja: '踏みにじる', rd: 'ふみにじる', tag: 'g' }, false],   // godan: 踏みにじった
  [{ ja: '引きずる', rd: 'ひきずる', tag: 'g' }, false],       // godan: 引きずった
  [{ ja: 'さえずる', rd: 'さえずる', tag: 'g' }, false],       // godan: さえずった
  [{ ja: '混じる', rd: 'まじる', tag: 'g' }, false],           // godan: 混じった
  [{ ja: '論ずる', rd: 'ろんずる', tag: 'g' }, true],          // サ変: 論じる is ichidan
  [{ ja: '信じる', rd: 'しんじる', tag: 'g' }, true],          // ichidan: 信じない
  [{ ja: '閉じる', rd: 'とじる', tag: 'g' }, true],            // ichidan: 閉じない
  [{ ja: '感じる', rd: 'かんじる', tag: 'g' }, true],          // ichidan
  [{ ja: '食べる', rd: 'たべる', tag: 'g' }, true],            // ichidan
  [{ ja: '帰る', rd: 'かえる', tag: 'i' }, true],              // godan: 帰らない
  [{ ja: '知る', rd: 'しる', tag: 'i' }, true],                // godan: 知らない
  [{ ja: '切る', rd: 'きる', tag: 'i' }, true],                // godan: 切らない
  [{ ja: '勉強する', rd: 'べんきょうする', tag: 'g' }, true], // する verb
  [{ ja: '作る', rd: 'つくる', tag: 'i' }, true],              // u-row before る
  [{ ja: '気に入る', rd: 'きにいる', tag: 'i' }, true],        // godan compound: 気に入らない
  [{ ja: '打ち切る', rd: 'うちきる', tag: 'i' }, true],        // godan compound: 打ち切らない
  [{ ja: 'しゃべる', rd: 'しゃべる', tag: 'i' }, true],        // godan: しゃべらない
  [{ ja: 'ちぎる', rd: 'ちぎる', tag: 'i' }, true],            // godan: ちぎらない
  [{ ja: 'いじる', rd: 'いじる', tag: 'i' }, true],            // godan: いじらない
  [{ ja: '命じる', rd: 'めいじる', tag: 'i' }, false],         // ichidan: 命じない (ends in いじる, like godan いじる)
  [{ ja: '演じる', rd: 'えんじる', tag: 'i' }, false],
  [{ ja: '気に入る', rd: 'きにいる', tag: 'g' }, false],
  [{ ja: '打ち切る', rd: 'うちきる', tag: 'g' }, false],
  [{ ja: '見切りをつける', rd: 'みきりをつける', tag: 'i' }, false],   // ichidan phrase ending in …つける
  [{ ja: '着る', rd: 'きる', tag: 'i' }, false],               // 着る is ichidan (切る is godan)
  [{ ja: '切る', rd: 'きる', tag: 'g' }, false],
  [{ ja: '変える', rd: 'かえる', tag: 'i' }, false],           // 変える is ichidan (帰る is godan)
  [{ ja: '帰る', rd: 'かえる', tag: 'g' }, false],
];
for (const [entry, wrong] of TAG_RULES) {
  report.checks += 1;
  const problem = tagProblem(entry);
  if (wrong && !problem) failures.push(`tag rule: ${entry.ja} [${entry.tag}] should be reported as wrong`);
  if (!wrong && problem) failures.push(`tag rule: ${entry.ja} [${entry.tag}] is right but reported: ${problem}`);
}

// ---- Invalid input ------------------------------------------------------------------------------
// express() throws an Error whose message starts with "japanese express():".

const INVALID = [
  ['no argument', undefined, /japanese express\(\)/],
  ['null', null, /japanese express\(\)/],
  ['a string instead of an entry', '話す', /must be an object/],
  ['no ja', { rd: 'はなす', tag: 'g' }, /"ja"/],
  ['no rd', { ja: '話す', tag: 'g' }, /"rd"/],
  ['empty ja', { ja: '', rd: 'はなす', tag: 'g' }, /"ja"/],
  ['a space in ja', { ja: '話 す', rd: 'はなす', tag: 'g' }, /spaces/],
  ['a space in rd', { ja: '話す', rd: 'はな す', tag: 'g' }, /spaces/],
  ['no tag', { ja: '話す', rd: 'はなす' }, /unknown tag/],
  ['an unknown tag', { ja: '話す', rd: 'はなす', tag: 'x' }, /unknown tag "x"/],
  ['a tag that is an Object property', { ja: '話す', rd: 'はなす', tag: 'constructor' }, /unknown tag/],
  ['a godan verb ending in ず', { ja: '話ず', rd: 'はなず', tag: 'g' }, /godan/],
  ['godan ja and rd ending differently', { ja: '話す', rd: 'はなく', tag: 'g' }, /godan/],
  ['an ichidan verb not ending in る', { ja: '食べ', rd: 'たべ', tag: 'i' }, /ichidan/],
  ['an ichidan verb with a u-row kana before る', { ja: '作る', rd: 'つくる', tag: 'i' }, /ichidan/],
  ['a する verb that does not end in する', { ja: '話す', rd: 'はなす', tag: 's' }, /する/],
  ['する written 為る', { ja: '勉強為る', rd: 'べんきょうする', tag: 's' }, /為る/],
  ['行く read ゆく (its て-form is read いって)', { ja: '行く', rd: 'ゆく', tag: 'g' }, /ゆく/],
  ['逝く read ゆく', { ja: '逝く', rd: 'ゆく', tag: 'g' }, /ゆく/],
  ['kana とう (問う or 訪う)', { ja: 'とう', rd: 'とう', tag: 'g' }, /問う/],
  ['kana こう (乞う or 恋う)', { ja: 'こう', rd: 'こう', tag: 'g' }, /乞う/],
  ['a 来る verb that is not 来る', { ja: '話す', rd: 'はなす', tag: 'k' }, /来る/],
  ['出来る tagged k', { ja: '出来る', rd: 'できる', tag: 'k' }, /来る/],
];
for (const [what, input, message] of INVALID) {
  report.checks += 1;
  let error = null;
  try { express(input); } catch (caught) { error = caught; }
  if (!(error instanceof Error)) failures.push(`invalid input (${what}): express() did not throw`);
  else if (!error.message.startsWith('japanese express():') || !message.test(error.message)) {
    failures.push(`invalid input (${what}): unexpected error "${error.message}"`);
  }
}

// express() must not change its input
{
  report.checks += 1;
  const entry = Object.freeze({ ja: '話す', rd: 'はなす', tag: 'g', note: 'x' });
  try { express(entry); } catch (error) { failures.push(`a frozen entry made express() throw: ${error.message}`); }
}

// Translations fixed after the audits: amuse is transitive (楽しませる), not 楽しむ (enjoy)
{
  report.checks += 1;
  const amuse = VERBS.amuse && VERBS.amuse[0];
  if (!amuse || amuse.ja !== '楽しませる' || amuse.rd !== 'たのしませる' || amuse.tag !== 'i') {
    failures.push(`amuse should start with 楽しませる たのしませる [i], not ${amuse && amuse.ja}`);
  }
}

// Every English verb has at least one translation
for (const [english, options] of Object.entries(VERBS)) {
  if (!Array.isArray(options) || !options.length) failures.push(`${english}: no translations`);
}

report.finish(
  `${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Japanese translations`,
  { limit: 80 },
);
