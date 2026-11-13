// Run with: node test.js
// Checks the Hebrew pattern engine against known paradigms (script and transliteration),
// the refusals, and then validates every entry of verbs.js: the engine's infinitive equals
// entry.he, script and transliteration are well formed, nothing is empty or broken.
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const report = createReport();
const { failures } = report;
let checks = 0;
const same = (label, got, want) => { checks += 1; if (got !== want) failures.push(`${label}\n    expected: ${want}\n    actual:   ${got}`); };

const SLOTS = ['אני', 'אתה', 'את', 'הוא', 'היא', 'אנחנו', 'אתם', 'אתן', 'הם', 'הן'];
const cellText = c => (c ? `${c.he}|${c.tr}` : '-');

// "pa:כתב:o" -> { binyan: 'pa', root: 'כתב', fv: 'o' }
function entryOf(spec) {
  const [binyan, root, fv] = spec.split(':');
  return { binyan, root, ...(fv ? { fv } : {}) };
}

// ---- Single forms --------------------------------------------------------------------
// FORMS: [entry, 'infinitive|transliteration', { 'row.slot': 'script|transliteration' }]
// row is one of pres past fut pastCont imp impNeg inf; slot 0-9 = אני אתה את הוא היא אנחנו אתם אתן הם הן.
// '-' = the form does not exist.
const FORMS = [];
const F = (entry, inf, forms) => FORMS.push({ entry, inf, forms });

// ---- Whole rows ----------------------------------------------------------------------
// ROWS: [entry, row, ten cells separated by ' ; ']
const ROWS = [];
const R = (entry, row, cells) => ROWS.push({ entry, row, cells });

// ---- fixes from the independent review ----------------------------------------------
// o-future verbs with a guttural middle letter keep the vav of their future in the imperative (דחוף, the door sign)
F('pa:דחף:o', 'לדחוף|lidkhof', { 'fut.3': 'ידחוף|yidkhof', 'imp.1': 'דחוף|dkhof', 'imp.2': 'דחפי|dikhafi', 'imp.6': 'דחפו|dikhafu' });
F('pa:סעד:o', 'לסעוד|lis\'od', { 'fut.3': 'יסעוד|yis\'od', 'imp.1': 'סעוד|s\'od' });
// pi'el roots that start with י: the prefix י and the root י are two yods, not three
F('pi:יעץ', 'לייעץ|leya\'ets', { 'fut.3': 'ייעץ|yeya\'ets', 'fut.0': 'אייעץ|aya\'ets', 'fut.1': 'תייעץ|teya\'ets', 'fut.8': 'ייעצו|yeya\'atsu', 'past.3': 'ייעץ|yi\'ets' });
F('pi:יצר', 'לייצר|leyatser', { 'fut.3': 'ייצר|yeyatser' });
// shin, not sin: שיער (to estimate, suppose)
F('pi:שער', 'לשער|lesha\'er', { 'past.3': 'שיער|shi\'er', 'pres.0': 'משער|mesha\'er' });
// appoint is pi'el, to experience is pa'al, to look forward to is pi'el
F('pi:מנה', 'למנות|lemanot', { 'past.0': 'מיניתי|miniti', 'past.3': 'מינה|mina', 'pres.0': 'ממנה|memane' });
F('pa:חוה', 'לחוות|lakhavot', { 'past.0': 'חוויתי|khaviti', 'past.3': 'חווה|khava', 'pres.0': 'חווה|khove' });
F('pi:צפה', 'לצפות|letsapot', { 'past.0': 'ציפיתי|tsipiti' });
// a-future without a vav in the singular (stative verbs): יארך, יאזל
F('pa:ארך:a', 'לארוך|le\'erokh', { 'fut.3': 'יארך|ye\'erakh' });
// ליהנות (nif'al of הנה): infinitive without the second ה, future without i after the prefix
F('ni:הנה', 'ליהנות|lehanot', {
  'pres.0': 'נהנה|nehene', 'pres.2': 'נהנית|nehenet', 'pres.5': 'נהנים|nehenim',
  'past.0': 'נהניתי|neheneti', 'past.3': 'נהנה|nehena', 'past.4': 'נהנתה|nehenta', 'past.8': 'נהנו|nehenu',
  'fut.0': 'אהנה|ehane', 'fut.1': 'תהנה|tehane', 'fut.2': 'תהני|tehani', 'fut.3': 'יהנה|yehane', 'fut.8': 'יהנו|yehanu',
  'imp.1': 'היהנה|hehane', 'imp.6': 'היהנו|hehanu',
});

// ======== strong pa'al ===================================================================
F('pa:כתב:o', 'לכתוב|likhtov', {
  'pres.0': 'כותב|kotev', 'pres.2': 'כותבת|kotevet', 'pres.5': 'כותבים|kotvim', 'pres.7': 'כותבות|kotvot',
  'past.0': 'כתבתי|katavti', 'past.3': 'כתב|katav', 'past.4': 'כתבה|katva', 'past.6': 'כתבתם|ktavtem',
  'fut.0': 'אכתוב|ekhtov', 'fut.2': 'תכתבי|tikhtevi', 'fut.8': 'יכתבו|yikhtevu',
  'imp.1': 'כתוב|ktov', 'imp.2': 'כתבי|kitvi', 'imp.6': 'כתבו|kitvu', 'imp.0': '-',
  'impNeg.1': 'אל תכתוב|al tikhtov', 'pastCont.4': 'הייתה כותבת|hayta kotevet',
});
R('pa:כתב:o', 'pres', 'כותב|kotev ; כותב|kotev ; כותבת|kotevet ; כותב|kotev ; כותבת|kotevet ; כותבים|kotvim ; כותבים|kotvim ; כותבות|kotvot ; כותבים|kotvim ; כותבות|kotvot');
R('pa:כתב:o', 'past', 'כתבתי|katavti ; כתבת|katavta ; כתבת|katavt ; כתב|katav ; כתבה|katva ; כתבנו|katavnu ; כתבתם|ktavtem ; כתבתן|ktavten ; כתבו|katvu ; כתבו|katvu');
R('pa:כתב:o', 'fut', 'אכתוב|ekhtov ; תכתוב|tikhtov ; תכתבי|tikhtevi ; יכתוב|yikhtov ; תכתוב|tikhtov ; נכתוב|nikhtov ; תכתבו|tikhtevu ; תכתבו|tikhtevu ; יכתבו|yikhtevu ; יכתבו|yikhtevu');
R('pa:כתב:o', 'pastCont', 'הייתי כותב|hayiti kotev ; היית כותב|hayita kotev ; היית כותבת|hayit kotevet ; היה כותב|haya kotev ; הייתה כותבת|hayta kotevet ; היינו כותבים|hayinu kotvim ; הייתם כותבים|hayitem kotvim ; הייתן כותבות|hayiten kotvot ; היו כותבים|hayu kotvim ; היו כותבות|hayu kotvot');
R('pa:כתב:o', 'imp', '- ; כתוב|ktov ; כתבי|kitvi ; - ; - ; - ; כתבו|kitvu ; כתבו|kitvu ; - ; -');
R('pa:כתב:o', 'impNeg', '- ; אל תכתוב|al tikhtov ; אל תכתבי|al tikhtevi ; - ; - ; - ; אל תכתבו|al tikhtevu ; אל תכתבו|al tikhtevu ; - ; -');
R('pa:כתב:o', 'inf', Array(10).fill('לכתוב|likhtov').join(' ; '));

F('pa:שמר:o', 'לשמור|lishmor', {
  'pres.0': 'שומר|shomer', 'past.3': 'שמר|shamar', 'past.4': 'שמרה|shamra', 'fut.3': 'ישמור|yishmor', 'fut.2': 'תשמרי|tishmeri',
  'imp.1': 'שמור|shmor', 'imp.2': 'שמרי|shimri',
});
F('pa:למד:a', 'ללמוד|lilmod', {
  'pres.0': 'לומד|lomed', 'pres.5': 'לומדים|lomdim', 'past.0': 'למדתי|lamadti', 'past.4': 'למדה|lamda',
  'fut.3': 'ילמד|yilmad', 'fut.0': 'אלמד|elmad', 'fut.2': 'תלמדי|tilmedi', 'imp.2': 'למדי|limdi',
});
F('pa:פתח:a', 'לפתוח|liftoakh', {
  'pres.0': 'פותח|poteakh', 'pres.2': 'פותחת|potakhat', 'pres.5': 'פותחים|potkhim', 'past.0': 'פתחתי|patakhti', 'past.4': 'פתחה|patkha',
  'fut.3': 'יפתח|yiftakh', 'fut.2': 'תפתחי|tiftekhi', 'imp.1': 'פתח|ptakh', 'imp.2': 'פתחי|pitkhi',
});
F('pa:שמע:a', 'לשמוע|lishmo\'a', {
  'pres.0': 'שומע|shome\'a', 'pres.2': 'שומעת|shoma\'at', 'pres.5': 'שומעים|shom\'im', 'past.0': 'שמעתי|shamati', 'past.3': 'שמע|shama',
  'fut.3': 'ישמע|yishma', 'fut.2': 'תשמעי|tishme\'i', 'imp.1': 'שמע|shma', 'imp.2': 'שמעי|shim\'i',
});
F('pa:שלח:a', 'לשלוח|lishloakh', {
  'pres.0': 'שולח|sholeakh', 'past.3': 'שלח|shalakh', 'fut.3': 'ישלח|yishlakh', 'imp.1': 'שלח|shlakh',
});

// ======== pa'al, more strong verbs and the guttural variants ===============================
F('pa:שבר:o', 'לשבור|lishbor', { 'pres.0': 'שובר|shover', 'past.0': 'שברתי|shavarti', 'past.3': 'שבר|shavar', 'fut.3': 'ישבור|yishbor', 'imp.1': 'שבור|shvor' });
F('pa:זכר:o', 'לזכור|lizkor', { 'pres.0': 'זוכר|zokher', 'past.3': 'זכר|zakhar', 'fut.3': 'יזכור|yizkor', 'fut.2': 'תזכרי|tizkeri', 'imp.1': 'זכור|zkhor' });
F('pa:גנב:o', 'לגנוב|lignov', { 'pres.0': 'גונב|gonev', 'past.0': 'גנבתי|ganavti', 'fut.3': 'יגנוב|yignov' });
F('pa:רקד:o', 'לרקוד|lirkod', { 'pres.0': 'רוקד|roked', 'past.3': 'רקד|rakad', 'fut.3': 'ירקוד|yirkod', 'imp.1': 'רקוד|rkod' });
F('pa:צחק:a', 'לצחוק|litskhok', { 'pres.0': 'צוחק|tsokhek', 'past.3': 'צחק|tsakhak', 'fut.3': 'יצחק|yitskhak', 'fut.0': 'אצחק|etskhak' });
F('pa:לבש:a', 'ללבוש|lilbosh', { 'pres.0': 'לובש|lovesh', 'past.3': 'לבש|lavash', 'fut.3': 'ילבש|yilbash' });
F('pa:ברח:a', 'לברוח|livroakh', { 'past.3': 'ברח|barakh', 'past.0': 'ברחתי|barakhti', 'fut.3': 'יברח|yivrakh', 'imp.1': 'ברח|brakh' });
F('pa:עבד:o', 'לעבוד|la\'avod', {
  'pres.0': 'עובד|oved', 'pres.5': 'עובדים|ovdim', 'past.0': 'עבדתי|avadti', 'past.3': 'עבד|avad', 'past.4': 'עבדה|avda',
  'fut.0': 'אעבוד|e\'evod', 'fut.1': 'תעבוד|ta\'avod', 'fut.3': 'יעבוד|ya\'avod', 'fut.2': 'תעבדי|ta\'avdi', 'fut.8': 'יעבדו|ya\'avdu',
  'imp.1': 'עבוד|avod', 'imp.2': 'עבדי|ivdi',
});
F('pa:עמד:o', 'לעמוד|la\'amod', { 'pres.0': 'עומד|omed', 'past.3': 'עמד|amad', 'fut.3': 'יעמוד|ya\'amod', 'fut.0': 'אעמוד|e\'emod' });
F('pa:חזר:o', 'לחזור|lakhazor', { 'pres.0': 'חוזר|khozer', 'past.3': 'חזר|khazar', 'past.0': 'חזרתי|khazarti' });
F('pa:הרג:o', 'להרוג|laharog', { 'pres.0': 'הורג|horeg', 'past.3': 'הרג|harag', 'past.0': 'הרגתי|haragti' });
F('pa:שאל:a', 'לשאול|lish\'ol', {
  'pres.0': 'שואל|sho\'el', 'pres.2': 'שואלת|sho\'elet', 'pres.5': 'שואלים|sho\'alim', 'past.0': 'שאלתי|sha\'alti', 'past.3': 'שאל|sha\'al',
  'past.4': 'שאלה|sha\'ala', 'fut.0': 'אשאל|esh\'al', 'fut.3': 'ישאל|yish\'al', 'fut.2': 'תשאלי|tish\'ali', 'imp.1': 'שאל|she\'al',
});
F('pa:בחר:a', 'לבחור|livkhor', {
  'pres.0': 'בוחר|bokher', 'pres.5': 'בוחרים|bokharim', 'past.0': 'בחרתי|bakharti', 'past.3': 'בחר|bakhar', 'past.6': 'בחרתם|bekhartem',
  'fut.0': 'אבחר|evkhar', 'fut.8': 'יבחרו|yivkharu', 'imp.1': 'בחר|bekhar',
});
F('pa:נהג:a', 'לנהוג|linhog', {});
F('pa:אסף', 'לאסוף|le\'esof', {
  'pres.0': 'אוסף|osef', 'past.0': 'אספתי|asafti', 'past.3': 'אסף|asaf', 'past.4': 'אספה|asfa',
  'fut.0': 'אאסוף|e\'esof', 'fut.3': 'יאסוף|ye\'esof', 'fut.2': 'תאספי|te\'esfi', 'imp.1': 'אסוף|esof', 'imp.2': 'אספי|isfi',
});
F('pa:אמר', 'לומר|lomar', {
  'pres.0': 'אומר|omer', 'pres.5': 'אומרים|omrim', 'past.0': 'אמרתי|amarti', 'past.3': 'אמר|amar', 'past.4': 'אמרה|amra',
  'fut.0': 'אומר|omar', 'fut.1': 'תאמר|tomar', 'fut.3': 'יאמר|yomar', 'fut.2': 'תאמרי|tomri', 'fut.8': 'יאמרו|yomru',
  'imp.1': 'אמור|emor', 'imp.2': 'אמרי|imri',
});
F('pa:אכל', 'לאכול|le\'ekhol', {
  'pres.0': 'אוכל|okhel', 'pres.5': 'אוכלים|okhlim', 'past.0': 'אכלתי|akhalti', 'past.3': 'אכל|akhal', 'past.4': 'אכלה|akhla',
  'fut.0': 'אוכל|okhal', 'fut.1': 'תאכל|tokhal', 'fut.2': 'תאכלי|tokhli', 'imp.1': 'אכול|ekhol', 'imp.2': 'אכלי|ikhli',
});
F('pa:אהב:a', 'לאהוב|le\'ehov', { 'pres.0': 'אוהב|ohev', 'pres.5': 'אוהבים|ohavim', 'past.0': 'אהבתי|ahavti', 'past.3': 'אהב|ahav', 'past.4': 'אהבה|ahava' });

// ======== pa'al, weak roots ================================================================
F('pa:בנה', 'לבנות|livnot', {
  'pres.0': 'בונה|bone', 'pres.2': 'בונה|bona', 'pres.5': 'בונים|bonim', 'pres.7': 'בונות|bonot',
  'past.0': 'בניתי|baniti', 'past.1': 'בנית|banita', 'past.3': 'בנה|bana', 'past.4': 'בנתה|banta', 'past.5': 'בנינו|baninu', 'past.6': 'בניתם|banitem', 'past.8': 'בנו|banu',
  'fut.0': 'אבנה|evne', 'fut.1': 'תבנה|tivne', 'fut.2': 'תבני|tivni', 'fut.8': 'יבנו|yivnu',
  'imp.1': 'בנה|bne', 'imp.2': 'בני|bni', 'imp.6': 'בנו|bnu',
  'impNeg.1': 'אל תבנה|al tivne', 'pastCont.0': 'הייתי בונה|hayiti bone',
});
F('pa:קנה', 'לקנות|liknot', { 'pres.0': 'קונה|kone', 'past.0': 'קניתי|kaniti', 'past.4': 'קנתה|kanta', 'fut.0': 'אקנה|ekne', 'fut.2': 'תקני|tikni', 'imp.1': 'קנה|kne' });
F('pa:ראה', 'לראות|lir\'ot', {
  'pres.0': 'רואה|ro\'e', 'pres.2': 'רואה|ro\'a', 'pres.5': 'רואים|ro\'im', 'past.0': 'ראיתי|ra\'iti', 'past.3': 'ראה|ra\'a', 'past.8': 'ראו|ra\'u',
  'fut.0': 'אראה|er\'e', 'fut.2': 'תראי|tir\'i', 'fut.8': 'יראו|yir\'u', 'imp.1': 'ראה|re\'e', 'imp.2': 'ראי|re\'i',
});
F('pa:עשה', 'לעשות|la\'asot', {
  'pres.0': 'עושה|ose', 'past.0': 'עשיתי|asiti', 'past.3': 'עשה|asa', 'past.4': 'עשתה|asta', 'fut.0': 'אעשה|e\'ese', 'fut.3': 'יעשה|ya\'ase',
  'fut.2': 'תעשי|ta\'asi', 'imp.1': 'עשה|ase', 'imp.2': 'עשי|asi',
});
F('pa:שתה', 'לשתות|lishtot', { 'pres.0': 'שותה|shote', 'past.0': 'שתיתי|shatiti', 'past.3': 'שתה|shata', 'fut.0': 'אשתה|eshte', 'fut.8': 'ישתו|yishtu', 'imp.1': 'שתה|shte', 'imp.2': 'שתי|shti' });
F('pa:קרא', 'לקרוא|likro', {
  'pres.0': 'קורא|kore', 'pres.5': 'קוראים|kor\'im', 'past.0': 'קראתי|karati', 'past.3': 'קרא|kara', 'fut.0': 'אקרא|ekra', 'fut.2': 'תקראי|tikre\'i', 'imp.1': 'קרא|kra',
});
F('pa:מצא', 'למצוא|limtso', { 'pres.0': 'מוצא|motse', 'past.0': 'מצאתי|matsati', 'past.3': 'מצא|matsa', 'fut.0': 'אמצא|emtsa', 'fut.3': 'ימצא|yimtsa', 'imp.1': 'מצא|mtsa' });
F('pa:קום', 'לקום|lakum', {
  'pres.0': 'קם|kam', 'pres.2': 'קמה|kama', 'pres.5': 'קמים|kamim', 'pres.7': 'קמות|kamot',
  'past.0': 'קמתי|kamti', 'past.3': 'קם|kam', 'past.4': 'קמה|kama', 'past.8': 'קמו|kamu',
  'fut.0': 'אקום|akum', 'fut.2': 'תקומי|takumi', 'fut.8': 'יקומו|yakumu', 'imp.1': 'קום|kum', 'imp.2': 'קומי|kumi', 'imp.6': 'קומו|kumu',
});
F('pa:שים', 'לשים|lasim', { 'pres.0': 'שם|sam', 'pres.2': 'שמה|sama', 'pres.5': 'שמים|samim', 'past.0': 'שמתי|samti', 'fut.0': 'אשים|asim', 'fut.2': 'תשימי|tasimi', 'imp.1': 'שים|sim' });
F('pa:גור', 'לגור|lagur', { 'pres.0': 'גר|gar', 'past.0': 'גרתי|garti', 'fut.0': 'אגור|agur', 'imp.1': 'גור|gur' });
F('pa:רוץ', 'לרוץ|laruts', { 'pres.0': 'רץ|rats', 'pres.2': 'רצה|ratsa', 'past.0': 'רצתי|ratsti', 'fut.0': 'ארוץ|aruts', 'imp.1': 'רוץ|ruts' });
F('pa:שיר', 'לשיר|lashir', { 'pres.0': 'שר|shar', 'past.0': 'שרתי|sharti', 'fut.0': 'אשיר|ashir', 'imp.1': 'שיר|shir' });
F('pa:נוח', 'לנוח|lanuakh', { 'pres.0': 'נח|nakh', 'past.0': 'נחתי|nakhti', 'fut.0': 'אנוח|anuakh', 'fut.2': 'תנוחי|tanukhi' });
F('pa:נפל', 'ליפול|lipol', {
  'pres.0': 'נופל|nofel', 'past.0': 'נפלתי|nafalti', 'past.3': 'נפל|nafal', 'past.4': 'נפלה|nafla',
  'fut.0': 'אפול|epol', 'fut.1': 'תיפול|tipol', 'fut.3': 'ייפול|yipol', 'fut.2': 'תיפלי|tipli', 'fut.8': 'ייפלו|yiplu',
});
F('pa:נסע', 'לנסוע|linso\'a', { 'pres.0': 'נוסע|nose\'a', 'past.0': 'נסעתי|nasati', 'past.3': 'נסע|nasa', 'fut.0': 'אסע|esa', 'fut.3': 'ייסע|yisa', 'imp.1': 'סע|sa' });
F('pa:נגע', 'לגעת|laga\'at', { 'pres.0': 'נוגע|noge\'a', 'past.0': 'נגעתי|nagati', 'fut.3': 'ייגע|yiga', 'imp.1': 'גע|ga' });
F('pa:נשם', 'לנשום|linshom', { 'pres.0': 'נושם|noshem', 'past.3': 'נשם|nasham', 'fut.3': 'ינשום|yinshom' });
F('pa:ישב', 'לשבת|lashevet', {
  'pres.0': 'יושב|yoshev', 'pres.5': 'יושבים|yoshvim', 'past.0': 'ישבתי|yashavti', 'past.3': 'ישב|yashav', 'past.4': 'ישבה|yashva', 'past.6': 'ישבתם|yeshavtem',
  'fut.0': 'אשב|eshev', 'fut.2': 'תשבי|teshvi', 'imp.1': 'שב|shev', 'imp.2': 'שבי|shvi',
});
F('pa:ידע', 'לדעת|lada\'at', { 'pres.0': 'יודע|yode\'a', 'past.0': 'ידעתי|yadati', 'past.3': 'ידע|yada', 'fut.0': 'אדע|eda', 'imp.1': 'דע|da' });
F('pa:ילד', 'ללדת|laledet', { 'pres.0': 'יולד|yoled', 'past.0': 'ילדתי|yaladti', 'fut.0': 'אלד|eled', 'imp.1': 'לד|led' });
F('pa:ירד', 'לרדת|laredet', { 'pres.0': 'יורד|yored', 'past.0': 'ירדתי|yaradti', 'past.3': 'ירד|yarad', 'fut.0': 'ארד|ered', 'fut.3': 'ירד|yered', 'imp.1': 'רד|red' });
F('pa:סבב', 'לסוב|lasov', { 'pres.0': 'סב|sav', 'past.3': 'סב|sav', 'past.0': 'סבותי|savoti', 'fut.3': 'יסוב|yasov' });
F('pa:סבב:o', 'לסבוב|lisbov', { 'pres.0': 'סובב|sovev', 'past.3': 'סבב|savav', 'past.0': 'סבבתי|savavti', 'fut.3': 'יסבוב|yisbov' });

// ======== pa'al, irregular verbs ===========================================================
F('pa:לקח', 'לקחת|lakakhat', {
  'pres.0': 'לוקח|lokeakh', 'pres.2': 'לוקחת|lokakhat', 'past.0': 'לקחתי|lakakhti', 'past.3': 'לקח|lakakh', 'past.6': 'לקחתם|lekakhtem',
  'fut.0': 'אקח|ekakh', 'fut.1': 'תיקח|tikakh', 'fut.3': 'ייקח|yikakh', 'imp.1': 'קח|kakh',
});
F('pa:נתן', 'לתת|latet', {
  'pres.0': 'נותן|noten', 'pres.2': 'נותנת|notenet', 'pres.5': 'נותנים|notnim', 'past.0': 'נתתי|natati', 'past.1': 'נתת|natata', 'past.3': 'נתן|natan',
  'past.4': 'נתנה|natna', 'past.5': 'נתנו|natanu', 'past.6': 'נתתם|netatem', 'past.8': 'נתנו|natnu',
  'fut.0': 'אתן|eten', 'fut.1': 'תיתן|titen', 'fut.2': 'תיתני|titni', 'fut.3': 'ייתן|yiten', 'imp.1': 'תן|ten', 'imp.2': 'תני|tni',
});
F('pa:הלך', 'ללכת|lalekhet', {
  'pres.0': 'הולך|holekh', 'pres.2': 'הולכת|holekhet', 'pres.5': 'הולכים|holkhim', 'past.0': 'הלכתי|halakhti', 'past.3': 'הלך|halakh', 'past.4': 'הלכה|halkha',
  'fut.0': 'אלך|elekh', 'fut.2': 'תלכי|telkhi', 'fut.3': 'ילך|yelekh', 'imp.1': 'לך|lekh', 'imp.2': 'לכי|lekhi',
});
F('pa:בוא', 'לבוא|lavo', {
  'pres.0': 'בא|ba', 'pres.2': 'באה|ba\'a', 'pres.5': 'באים|ba\'im', 'past.0': 'באתי|bati', 'past.3': 'בא|ba', 'past.4': 'באה|ba\'a', 'past.8': 'באו|ba\'u',
  'fut.0': 'אבוא|avo', 'fut.2': 'תבואי|tavo\'i', 'fut.8': 'יבואו|yavo\'u', 'imp.1': 'בוא|bo', 'imp.2': 'בואי|bo\'i',
});
F('pa:היה', 'להיות|lihyot', {
  'pres.0': '-', 'pres.5': '-', 'pastCont.0': '-', 'past.0': 'הייתי|hayiti', 'past.3': 'היה|haya', 'past.4': 'הייתה|hayta', 'past.5': 'היינו|hayinu', 'past.8': 'היו|hayu',
  'fut.0': 'אהיה|ehye', 'fut.2': 'תהיי|tihyi', 'fut.3': 'יהיה|yihye', 'fut.8': 'יהיו|yihyu', 'imp.1': 'היה|heye', 'imp.2': 'היי|heyi',
});
F('pa:חיה', 'לחיות|likhyot', {
  'pres.0': 'חי|khay', 'pres.2': 'חיה|khaya', 'pres.5': 'חיים|khayim', 'past.0': 'חייתי|khayiti', 'past.3': 'חיה|khaya', 'past.4': 'חייתה|khayta',
  'fut.0': 'אחיה|ekhye', 'fut.3': 'יחיה|yikhye', 'fut.8': 'יחיו|yikhyu',
});
F('pa:מות', 'למות|lamut', {
  'pres.0': 'מת|met', 'pres.2': 'מתה|meta', 'pres.5': 'מתים|metim', 'past.3': 'מת|met', 'past.4': 'מתה|meta', 'past.8': 'מתו|metu',
  'fut.0': 'אמות|amut', 'fut.2': 'תמותי|tamuti', 'fut.3': 'ימות|yamut', 'imp.1': 'מות|mut',
});
F('pa:יצא', 'לצאת|latset', {
  'pres.0': 'יוצא|yotse', 'pres.2': 'יוצאת|yotset', 'pres.5': 'יוצאים|yotsim', 'past.0': 'יצאתי|yatsati', 'past.3': 'יצא|yatsa', 'past.6': 'יצאתם|yetsatem',
  'fut.0': 'אצא|etse', 'fut.3': 'יצא|yetse', 'imp.1': 'צא|tse',
});
F('pa:שכב', 'לשכב|lishkav', { 'pres.0': 'שוכב|shokhev', 'past.0': 'שכבתי|shakhavti', 'past.3': 'שכב|shakhav', 'fut.3': 'ישכב|yishkav', 'fut.0': 'אשכב|eshkav' });
F('pa:נגש', 'לגשת|lagashet', {
  'pres.0': 'ניגש|nigash', 'pres.2': 'ניגשת|nigeshet', 'past.0': 'ניגשתי|nigashti', 'past.3': 'ניגש|nigash', 'past.4': 'ניגשה|nigsha',
  'fut.0': 'אגש|egash', 'fut.3': 'ייגש|yigash', 'imp.1': 'גש|gash',
});
F('pa:נשא', 'לשאת|laset', {
  'pres.0': 'נושא|nose', 'pres.2': 'נושאת|noset', 'past.0': 'נשאתי|nasati', 'past.3': 'נשא|nasa', 'fut.0': 'אשא|esa', 'fut.3': 'יישא|yisa', 'imp.1': 'שא|se',
});
F('pa:אפה', 'לאפות|le\'efot', { 'pres.0': 'אופה|ofe', 'past.0': 'אפיתי|afiti', 'past.3': 'אפה|afa', 'fut.0': 'אופה|ofe', 'fut.3': 'יאפה|yofe' });
F('pa:ישן', 'לישון|lishon', { 'past.0': 'ישנתי|yashanti', 'past.3': 'ישן|yashan', 'fut.0': 'אישן|ishan', 'fut.3': 'יישן|yishan' });
F('pa:יצר', 'ליצור|litsor', { 'pres.0': 'יוצר|yotser', 'past.3': 'יצר|yatsar', 'fut.0': 'אצור|etsor' });

// ======== pi'el ============================================================================
F('pi:דבר', 'לדבר|ledaber', {
  'pres.0': 'מדבר|medaber', 'pres.2': 'מדברת|medaberet', 'pres.5': 'מדברים|medabrim', 'pres.7': 'מדברות|medabrot',
  'past.0': 'דיברתי|dibarti', 'past.3': 'דיבר|diber', 'past.4': 'דיברה|dibra', 'past.6': 'דיברתם|dibartem', 'past.8': 'דיברו|dibru',
  'fut.0': 'אדבר|adaber', 'fut.1': 'תדבר|tedaber', 'fut.2': 'תדברי|tedabri', 'fut.8': 'ידברו|yedabru', 'imp.1': 'דבר|daber', 'imp.2': 'דברי|dabri', 'imp.6': 'דברו|dabru',
  'impNeg.2': 'אל תדברי|al tedabri',
});
F('pi:בשל', 'לבשל|levashel', { 'pres.0': 'מבשל|mevashel', 'past.0': 'בישלתי|bishalti', 'past.3': 'בישל|bishel', 'fut.3': 'יבשל|yevashel', 'imp.1': 'בשל|bashel' });
F('pi:ספר', 'לספר|lesaper', { 'pres.0': 'מספר|mesaper', 'past.0': 'סיפרתי|siparti', 'past.3': 'סיפר|siper', 'past.4': 'סיפרה|sipra', 'fut.3': 'יספר|yesaper', 'imp.1': 'ספר|saper' });
F('pi:חפש', 'לחפש|lekhapes', { 'pres.0': 'מחפש|mekhapes', 'past.0': 'חיפשתי|khipasti', 'past.3': 'חיפש|khipes', 'fut.0': 'אחפש|akhapes', 'imp.1': 'חפש|khapes' });
F('pi:פתח', 'לפתח|lefateakh', {
  'pres.0': 'מפתח|mefateakh', 'pres.2': 'מפתחת|mefatakhat', 'past.0': 'פיתחתי|pitakhti', 'past.3': 'פיתח|piteakh', 'past.4': 'פיתחה|pitkha', 'fut.0': 'אפתח|afateakh',
});
F('pi:תרגם', 'לתרגם|letargem', {
  'pres.0': 'מתרגם|metargem', 'pres.2': 'מתרגמת|metargemet', 'pres.5': 'מתרגמים|metargemim', 'past.0': 'תרגמתי|tirgamti', 'past.3': 'תרגם|tirgem',
  'past.4': 'תרגמה|tirgema', 'past.8': 'תרגמו|tirgemu', 'fut.0': 'אתרגם|atargem', 'fut.2': 'תתרגמי|tetargemi', 'imp.1': 'תרגם|targem', 'imp.2': 'תרגמי|targemi',
});
F('pi:טלפן', 'לטלפן|letalfen', { 'pres.0': 'מטלפן|metalfen', 'past.3': 'טלפן|tilfen', 'past.0': 'טלפנתי|tilfanti', 'fut.0': 'אטלפן|atalfen', 'imp.1': 'טלפן|talfen' });
F('pi:פרסם', 'לפרסם|lefarsem', { 'pres.0': 'מפרסם|mefarsem', 'past.3': 'פרסם|pirsem', 'past.0': 'פרסמתי|pirsamti', 'fut.3': 'יפרסם|yefarsem' });
F('pi:שכנע', 'לשכנע|leshakhne\'a', { 'pres.0': 'משכנע|meshakhne\'a', 'pres.2': 'משכנעת|meshakhna\'at', 'past.3': 'שכנע|shikhne\'a', 'past.0': 'שכנעתי|shikhnati', 'fut.0': 'אשכנע|ashakhne\'a' });
F('pi:נסה', 'לנסות|lenasot', {
  'pres.0': 'מנסה|menase', 'pres.2': 'מנסה|menasa', 'pres.5': 'מנסים|menasim', 'past.0': 'ניסיתי|nisiti', 'past.3': 'ניסה|nisa', 'past.4': 'ניסתה|nista', 'past.8': 'ניסו|nisu',
  'fut.0': 'אנסה|anase', 'fut.2': 'תנסי|tenasi', 'imp.1': 'נסה|nase', 'imp.2': 'נסי|nasi',
});
F('pi:חכה', 'לחכות|lekhakot', { 'pres.0': 'מחכה|mekhake', 'past.0': 'חיכיתי|khikiti', 'past.3': 'חיכה|khika', 'fut.0': 'אחכה|akhake' });
F('pi:גלה', 'לגלות|legalot', { 'pres.0': 'מגלה|megale', 'past.0': 'גיליתי|giliti', 'past.3': 'גילה|gila', 'fut.3': 'יגלה|yegale' });
F('pi:מלא', 'למלא|lemale', { 'pres.0': 'ממלא|memale', 'past.3': 'מילא|mile', 'fut.0': 'אמלא|amale', 'imp.1': 'מלא|male' });
F('pi:רפא', 'לרפא|lerape', { 'pres.0': 'מרפא|merape', 'past.3': 'ריפא|ripe' });
F('pi:קום', 'לקיים|lekayem', { 'pres.0': 'מקיים|mekayem', 'past.0': 'קיימתי|kiyamti', 'past.3': 'קיים|kiyem', 'past.4': 'קיימה|kiyma', 'fut.3': 'יקיים|yekayem' });
F('pi:סים', 'לסיים|lesayem', { 'pres.0': 'מסיים|mesayem', 'past.0': 'סיימתי|siyamti', 'past.3': 'סיים|siyem' });
F('pi:יסד', 'לייסד|leyased', { 'pres.0': 'מייסד|meyased', 'past.0': 'ייסדתי|yisadti', 'past.3': 'ייסד|yised' });
F('pi:קוה', 'לקוות|lekavot', {
  'pres.0': 'מקווה|mekave', 'pres.5': 'מקווים|mekavim', 'pres.7': 'מקוות|mekavot', 'past.0': 'קיוויתי|kiviti', 'past.3': 'קיווה|kiva', 'past.8': 'קיוו|kivu', 'fut.6': 'תקוו|tekavu',
});
F('pi:אשר', 'לאשר|le\'asher', { 'pres.0': 'מאשר|me\'asher', 'past.3': 'אישר|isher', 'past.0': 'אישרתי|isharti', 'fut.3': 'יאשר|ye\'asher', 'imp.1': 'אשר|asher' });
F('pi:קלל', 'לקלל|lekalel', { 'pres.0': 'מקלל|mekalel', 'past.3': 'קילל|kilel' });
F('pi:ברך', 'לברך|levarekh', { 'pres.0': 'מברך|mevarekh', 'past.3': 'בירך|birekh', 'past.0': 'בירכתי|birakhti' });
F('pi:נשק', 'לנשק|lenashek', { 'pres.0': 'מנשק|menashek', 'past.3': 'נישק|nishek' });
F('pi:עכב', 'לעכב|le\'akev', { 'pres.0': 'מעכב|me\'akev', 'past.3': 'עיכב|ikev', 'past.0': 'עיכבתי|ikavti' });
F('pi:מהר', 'למהר|lemaher', { 'pres.0': 'ממהר|memaher', 'past.3': 'מיהר|miher', 'imp.1': 'מהר|maher' });
F('pi:ותר', 'לוותר|levater', { 'pres.0': 'מוותר|mevater', 'past.3': 'ויתר|viter', 'past.0': 'ויתרתי|vitarti' });
F('pi:שחק', 'לשחק|lesakhek', { 'pres.0': 'משחק|mesakhek', 'past.3': 'שיחק|sikhek', 'past.0': 'שיחקתי|sikhakti' });

// ======== hif'il ===========================================================================
F('hi:סבר', 'להסביר|lehasbir', {
  'pres.0': 'מסביר|masbir', 'pres.2': 'מסבירה|masbira', 'pres.5': 'מסבירים|masbirim', 'pres.7': 'מסבירות|masbirot',
  'past.0': 'הסברתי|hisbarti', 'past.3': 'הסביר|hisbir', 'past.4': 'הסבירה|hisbira', 'past.8': 'הסבירו|hisbiru', 'past.6': 'הסברתם|hisbartem',
  'fut.0': 'אסביר|asbir', 'fut.2': 'תסבירי|tasbiri', 'fut.8': 'יסבירו|yasbiru', 'imp.1': 'הסבר|hasber', 'imp.2': 'הסבירי|hasbiri',
});
F('hi:צלח', 'להצליח|lehatsliakh', {
  'pres.0': 'מצליח|matsliakh', 'pres.2': 'מצליחה|matslikha', 'past.0': 'הצלחתי|hitslakhti', 'past.3': 'הצליח|hitsliakh', 'past.4': 'הצליחה|hitslikha',
  'fut.0': 'אצליח|atsliakh', 'imp.1': 'הצלח|hatslakh',
});
F('hi:זמן', 'להזמין|lehazmin', { 'pres.0': 'מזמין|mazmin', 'past.0': 'הזמנתי|hizmanti', 'past.3': 'הזמין|hizmin', 'past.8': 'הזמינו|hizminu', 'fut.0': 'אזמין|azmin', 'imp.1': 'הזמן|hazmen' });
F('hi:כתב', 'להכתיב|lehakhtiv', { 'pres.0': 'מכתיב|makhtiv', 'past.3': 'הכתיב|hikhtiv', 'past.0': 'הכתבתי|hikhtavti' });
F('hi:פסק', 'להפסיק|lehafsik', { 'pres.0': 'מפסיק|mafsik', 'past.3': 'הפסיק|hifsik', 'past.0': 'הפסקתי|hifsakti', 'fut.0': 'אפסיק|afsik', 'imp.1': 'הפסק|hafsek' });
F('hi:שמע', 'להשמיע|lehashmi\'a', { 'pres.0': 'משמיע|mashmi\'a', 'past.3': 'השמיע|hishmi\'a', 'past.0': 'השמעתי|hishmati' });
F('hi:אמן', 'להאמין|leha\'amin', {
  'pres.0': 'מאמין|ma\'amin', 'past.3': 'האמין|he\'emin', 'past.0': 'האמנתי|he\'emanti', 'past.5': 'האמנו|he\'emanu', 'fut.0': 'אאמין|a\'amin', 'fut.3': 'יאמין|ya\'amin', 'imp.1': 'האמן|ha\'amen',
});
F('hi:אכל', 'להאכיל|leha\'akhil', { 'pres.0': 'מאכיל|ma\'akhil', 'past.3': 'האכיל|he\'ekhil', 'past.0': 'האכלתי|he\'ekhalti' });
F('hi:עבר', 'להעביר|leha\'avir', { 'pres.0': 'מעביר|ma\'avir', 'past.3': 'העביר|he\'evir', 'past.0': 'העברתי|he\'evarti', 'fut.3': 'יעביר|ya\'avir', 'imp.1': 'העבר|ha\'aver' });
F('hi:חלט', 'להחליט|lehakhlit', { 'pres.0': 'מחליט|makhlit', 'past.3': 'החליט|hekhlit', 'past.0': 'החלטתי|hekhlati', 'fut.0': 'אחליט|akhlit', 'fut.8': 'יחליטו|yakhlitu', 'imp.1': 'החלט|hakhlet' });
F('hi:חזר', 'להחזיר|lehakhzir', { 'pres.0': 'מחזיר|makhzir', 'past.3': 'החזיר|hekhzir', 'past.0': 'החזרתי|hekhzarti' });
F('hi:פעל', 'להפעיל|lehaf\'il', { 'pres.0': 'מפעיל|maf\'il', 'past.3': 'הפעיל|hif\'il', 'past.0': 'הפעלתי|hif\'alti' });
F('hi:נפל', 'להפיל|lehapil', { 'pres.0': 'מפיל|mapil', 'past.3': 'הפיל|hipil', 'past.0': 'הפלתי|hipalti', 'fut.0': 'אפיל|apil', 'imp.1': 'הפל|hapel' });
F('hi:נגע', 'להגיע|lehagi\'a', { 'pres.0': 'מגיע|magi\'a', 'past.3': 'הגיע|higi\'a', 'past.0': 'הגעתי|higati', 'fut.0': 'אגיע|agi\'a', 'imp.1': 'הגע|haga' });
F('hi:נצל', 'להציל|lehatsil', { 'pres.0': 'מציל|matsil', 'past.3': 'הציל|hitsil', 'past.0': 'הצלתי|hitsalti' });
F('hi:נגש', 'להגיש|lehagish', { 'pres.0': 'מגיש|magish', 'past.3': 'הגיש|higish' });
F('hi:קום', 'להקים|lehakim', {
  'pres.0': 'מקים|mekim', 'pres.2': 'מקימה|mekima', 'past.0': 'הקמתי|hekamti', 'past.3': 'הקים|hekim', 'past.4': 'הקימה|hekima',
  'fut.0': 'אקים|akim', 'fut.8': 'יקימו|yakimu', 'imp.1': 'הקם|hakem', 'imp.2': 'הקימי|hakimi',
});
F('hi:בין', 'להבין|lehavin', { 'pres.0': 'מבין|mevin', 'past.0': 'הבנתי|hevanti', 'past.3': 'הבין|hevin', 'past.5': 'הבנו|hevanu', 'fut.0': 'אבין|avin', 'imp.1': 'הבן|haven' });
F('hi:סור', 'להסיר|lehasir', { 'pres.0': 'מסיר|mesir', 'past.3': 'הסיר|hesir', 'past.0': 'הסרתי|hesarti' });
F('hi:שוב', 'להשיב|lehashiv', { 'past.3': 'השיב|heshiv' });
F('hi:נוח', 'להניח|lehaniakh', { 'past.3': 'הניח|heniakh', 'past.0': 'הנחתי|hinakhti' });
F('hi:כון', 'להכין|lehakhin', { 'pres.0': 'מכין|mekhin', 'past.3': 'הכין|hekhin', 'past.0': 'הכנתי|hekhanti' });
F('hi:בוא', 'להביא|lehavi', {
  'pres.0': 'מביא|mevi', 'pres.2': 'מביאה|mevi\'a', 'past.0': 'הבאתי|hevati', 'past.3': 'הביא|hevi', 'past.4': 'הביאה|hevi\'a',
  'fut.0': 'אביא|avi', 'fut.2': 'תביאי|tavi\'i', 'imp.1': 'הבא|have', 'imp.2': 'הביאי|havi\'i',
});
F('hi:ירד', 'להוריד|lehorid', {
  'pres.0': 'מוריד|morid', 'past.0': 'הורדתי|horadti', 'past.3': 'הוריד|horid', 'fut.0': 'אוריד|orid', 'fut.3': 'יוריד|yorid', 'fut.2': 'תורידי|toridi', 'imp.1': 'הורד|hored', 'imp.2': 'הורידי|horidi',
});
F('hi:ידע', 'להודיע|lehodi\'a', { 'pres.0': 'מודיע|modi\'a', 'past.3': 'הודיע|hodi\'a', 'fut.0': 'אודיע|odi\'a' });
F('hi:יסף', 'להוסיף|lehosif', { 'pres.0': 'מוסיף|mosif', 'past.3': 'הוסיף|hosif', 'past.0': 'הוספתי|hosafti', 'fut.0': 'אוסיף|osif', 'imp.1': 'הוסף|hosef' });
F('hi:יצא', 'להוציא|lehotsi', {
  'pres.0': 'מוציא|motsi', 'pres.2': 'מוציאה|motsi\'a', 'past.3': 'הוציא|hotsi', 'past.4': 'הוציאה|hotsi\'a', 'fut.3': 'יוציא|yotsi', 'imp.1': 'הוצא|hotse',
});
F('hi:ידה', 'להודות|lehodot', { 'pres.0': 'מודה|mode', 'past.3': 'הודה|hoda', 'past.0': 'הודיתי|hoditi', 'fut.0': 'אודה|ode' });
F('hi:מצא', 'להמציא|lehamtsi', { 'pres.0': 'ממציא|mamtsi', 'past.3': 'המציא|himtsi', 'fut.0': 'אמציא|amtsi', 'imp.1': 'המצא|hamtse' });
F('hi:פנה', 'להפנות|lehafnot', {
  'pres.0': 'מפנה|mafne', 'past.3': 'הפנה|hifna', 'past.4': 'הפנתה|hifnta', 'past.0': 'הפניתי|hifniti', 'fut.0': 'אפנה|afne', 'imp.1': 'הפנה|hafne',
});
F('hi:עלה', 'להעלות|leha\'alot', { 'pres.0': 'מעלה|ma\'ale', 'past.3': 'העלה|he\'ela', 'past.0': 'העליתי|he\'eliti', 'fut.0': 'אעלה|a\'ale', 'imp.1': 'העלה|ha\'ale' });
F('hi:נכה', 'להכות|lehakot', { 'pres.0': 'מכה|make', 'past.3': 'הכה|hika', 'past.0': 'הכיתי|hikiti', 'fut.0': 'אכה|ake' });
F('hi:נהג', 'להנהיג|lehanhig', { 'pres.0': 'מנהיג|manhig', 'past.3': 'הנהיג|hinhig', 'past.0': 'הנהגתי|hinhagti' });
F('hi:בטח', 'להבטיח|lehavtiakh', { 'pres.0': 'מבטיח|mavtiakh', 'past.3': 'הבטיח|hivtiakh', 'past.0': 'הבטחתי|hivtakhti', 'imp.1': 'הבטח|havtakh' });
F('hi:רגש', 'להרגיש|lehargish', { 'pres.0': 'מרגיש|margish', 'past.3': 'הרגיש|hirgish', 'past.0': 'הרגשתי|hirgashti' });
F('hi:גדל', 'להגדיל|lehagdil', { 'pres.0': 'מגדיל|magdil', 'past.3': 'הגדיל|higdil' });

// ======== nif'al ===========================================================================
F('ni:כנס', 'להיכנס|lehikanes', {
  'pres.0': 'נכנס|nikhnas', 'pres.2': 'נכנסת|nikhneset', 'pres.5': 'נכנסים|nikhnasim', 'pres.7': 'נכנסות|nikhnasot',
  'past.0': 'נכנסתי|nikhnasti', 'past.3': 'נכנס|nikhnas', 'past.4': 'נכנסה|nikhnesa', 'past.8': 'נכנסו|nikhnesu', 'past.6': 'נכנסתם|nikhnastem',
  'fut.0': 'אכנס|ekanes', 'fut.1': 'תיכנס|tikanes', 'fut.3': 'ייכנס|yikanes', 'fut.2': 'תיכנסי|tikansi', 'fut.8': 'ייכנסו|yikansu',
  'imp.1': 'היכנס|hikanes', 'imp.2': 'היכנסי|hikansi', 'impNeg.1': 'אל תיכנס|al tikanes',
});
F('ni:פגש', 'להיפגש|lehipagesh', { 'pres.0': 'נפגש|nifgash', 'past.0': 'נפגשתי|nifgashti', 'past.4': 'נפגשה|nifgesha', 'fut.3': 'ייפגש|yipagesh', 'fut.0': 'אפגש|epagesh', 'imp.1': 'היפגש|hipagesh' });
F('ni:שאר', 'להישאר|lehisha\'er', {
  'pres.0': 'נשאר|nish\'ar', 'pres.5': 'נשארים|nish\'arim', 'past.0': 'נשארתי|nish\'arti', 'past.4': 'נשארה|nish\'ara',
  'fut.3': 'יישאר|yisha\'er', 'fut.2': 'תישארי|tisha\'ari', 'imp.1': 'הישאר|hisha\'er',
});
F('ni:ילד', 'להיוולד|lehivaled', { 'pres.0': 'נולד|nolad', 'pres.5': 'נולדים|noladim', 'past.0': 'נולדתי|noladti', 'past.3': 'נולד|nolad', 'past.4': 'נולדה|nolda', 'fut.3': 'ייוולד|yivaled' });
F('ni:בחר', 'להיבחר|lehibakher', { 'pres.0': 'נבחר|nivkhar', 'past.0': 'נבחרתי|nivkharti', 'fut.3': 'ייבחר|yibakher' });
F('ni:שבר', 'להישבר|lehishaver', { 'pres.0': 'נשבר|nishbar', 'past.4': 'נשברה|nishbera', 'fut.3': 'יישבר|yishaver' });
F('ni:שלח', 'להישלח|lehishalakh', { 'pres.0': 'נשלח|nishlakh', 'pres.2': 'נשלחת|nishlakhat', 'past.4': 'נשלחה|nishlekha', 'fut.3': 'יישלח|yishalakh' });
F('ni:פתח', 'להיפתח|lehipatakh', { 'pres.0': 'נפתח|niftakh', 'past.4': 'נפתחה|niftekha', 'fut.3': 'ייפתח|yipatakh', 'pres.2': 'נפתחת|niftakhat' });
F('ni:מצא', 'להימצא|lehimatse', {
  'pres.0': 'נמצא|nimtsa', 'pres.2': 'נמצאת|nimtset', 'pres.5': 'נמצאים|nimtsa\'im', 'past.0': 'נמצאתי|nimtseti', 'past.4': 'נמצאה|nimtse\'a', 'fut.3': 'יימצא|yimatse',
});
F('ni:קרא', 'להיקרא|lehikare', { 'pres.0': 'נקרא|nikra', 'fut.3': 'ייקרא|yikare' });
F('ni:בנה', 'להיבנות|lehibanot', {
  'pres.0': 'נבנה|nivne', 'pres.2': 'נבנית|nivnet', 'pres.5': 'נבנים|nivnim', 'pres.7': 'נבנות|nivnot', 'past.3': 'נבנה|nivna', 'past.4': 'נבנתה|nivnta',
  'past.0': 'נבניתי|nivneti', 'past.8': 'נבנו|nivnu', 'fut.3': 'ייבנה|yibane',
});
F('ni:ראה', 'להיראות|lehira\'ot', { 'pres.0': 'נראה|nir\'e', 'pres.2': 'נראית|nir\'et', 'past.3': 'נראה|nir\'a', 'past.0': 'נראיתי|nir\'eti', 'fut.3': 'ייראה|yira\'e' });
F('ni:עשה', 'להיעשות|lehe\'asot', { 'past.3': 'נעשה|ne\'esa', 'past.0': 'נעשיתי|ne\'eseti', 'fut.3': 'ייעשה|ye\'ase' });
F('ni:עלם', 'להיעלם|lehe\'alem', { 'pres.0': 'נעלם|ne\'elam', 'past.0': 'נעלמתי|ne\'elamti', 'fut.3': 'ייעלם|ye\'alem' });
F('ni:חשב', 'להיחשב|lehekhashev', { 'pres.0': 'נחשב|nekhshav', 'fut.3': 'ייחשב|yekhashev' });
F('ni:רדם', 'להירדם|lehiradem', { 'pres.0': 'נרדם|nirdam', 'past.4': 'נרדמה|nirdema', 'fut.3': 'יירדם|yiradem', 'fut.1': 'תירדם|tiradem' });
F('ni:אסף', 'להיאסף|lehe\'asef', { 'pres.0': 'נאסף|ne\'esaf', 'fut.3': 'ייאסף|ye\'asef' });
F('ni:נעל', 'להינעל|lehina\'el', { 'pres.0': 'ננעל|nin\'al', 'fut.3': 'יינעל|yina\'el' });
F('ni:סוג', 'להיסוג|lehisog', { 'pres.0': 'נסוג|nasog', 'past.3': 'נסוג|nasog', 'past.4': 'נסוגה|nasoga', 'fut.3': 'ייסוג|yisog' });
F('hu:רכב', 'להורכב|lehorkav', { 'pres.0': 'מורכב|murkav', 'past.3': 'הורכב|horkav', 'past.0': 'הורכבתי|horkavti', 'fut.3': 'יורכב|yorkav', 'imp.1': '-' });
F('ni:ידע', 'להיוודע|lehivada', { 'pres.0': 'נודע|noda', 'fut.3': 'ייוודע|yivada' });
F('ni:יתר', 'להיוותר|lehivater', { 'pres.0': 'נותר|notar' });
F('ni:יצר', 'להיווצר|lehivatser', { 'pres.0': 'נוצר|notsar', 'fut.3': 'ייווצר|yivatser' });

// ======== hitpa'el =========================================================================
F('hit:פלל', 'להתפלל|lehitpalel', {
  'pres.0': 'מתפלל|mitpalel', 'pres.2': 'מתפללת|mitpalelet', 'pres.5': 'מתפללים|mitpalelim', 'past.0': 'התפללתי|hitpalalti', 'past.3': 'התפלל|hitpalel',
  'past.4': 'התפללה|hitpalela', 'past.8': 'התפללו|hitpalelu', 'fut.0': 'אתפלל|etpalel', 'fut.3': 'יתפלל|yitpalel', 'fut.2': 'תתפללי|titpaleli', 'imp.1': 'התפלל|hitpalel',
});
F('hit:לבש', 'להתלבש|lehitlabesh', {
  'pres.0': 'מתלבש|mitlabesh', 'pres.5': 'מתלבשים|mitlabshim', 'past.0': 'התלבשתי|hitlabashti', 'past.3': 'התלבש|hitlabesh', 'past.4': 'התלבשה|hitlabsha',
  'fut.0': 'אתלבש|etlabesh', 'fut.2': 'תתלבשי|titlabshi', 'imp.1': 'התלבש|hitlabesh',
});
F('hit:סכל', 'להסתכל|lehistakel', {
  'pres.0': 'מסתכל|mistakel', 'past.0': 'הסתכלתי|histakalti', 'past.3': 'הסתכל|histakel', 'past.4': 'הסתכלה|histakla', 'fut.0': 'אסתכל|estakel', 'fut.6': 'תסתכלו|tistaklu', 'imp.1': 'הסתכל|histakel',
});
F('hit:נצל', 'להתנצל|lehitnatsel', { 'pres.0': 'מתנצל|mitnatsel', 'past.3': 'התנצל|hitnatsel', 'past.0': 'התנצלתי|hitnatsalti' });
F('hit:זקן', 'להזדקן|lehizdaken', { 'pres.0': 'מזדקן|mizdaken', 'past.3': 'הזדקן|hizdaken', 'past.0': 'הזדקנתי|hizdakanti' });
F('hit:רחץ', 'להתרחץ|lehitrakhets', { 'pres.0': 'מתרחץ|mitrakhets', 'past.3': 'התרחץ|hitrakhets', 'past.0': 'התרחצתי|hitrakhatsti' });
F('hit:שמש', 'להשתמש|lehishtamesh', { 'pres.0': 'משתמש|mishtamesh', 'pres.5': 'משתמשים|mishtamshim', 'past.3': 'השתמש|hishtamesh', 'past.0': 'השתמשתי|hishtamashti' });
F('hit:שנה', 'להשתנות|lehishtanot', { 'pres.0': 'משתנה|mishtane', 'past.3': 'השתנה|hishtana', 'past.0': 'השתניתי|hishtaniti' });
F('hit:צרף', 'להצטרף|lehitstaref', { 'pres.0': 'מצטרף|mitstaref', 'past.3': 'הצטרף|hitstaref' });
F('hit:סדר', 'להסתדר|lehistader', { 'pres.0': 'מסתדר|mistader', 'past.3': 'הסתדר|histader' });
F('hit:חבר', 'להתחבר|lehitkhaber', { 'pres.0': 'מתחבר|mitkhaber', 'past.3': 'התחבר|hitkhaber', 'past.0': 'התחברתי|hitkhabarti', 'past.4': 'התחברה|hitkhabra' });
F('hit:כתב', 'להתכתב|lehitkatev', { 'pres.0': 'מתכתב|mitkatev', 'pres.5': 'מתכתבים|mitkatvim', 'past.3': 'התכתב|hitkatev' });
F('hit:פתח', 'להתפתח|lehitpateakh', { 'pres.0': 'מתפתח|mitpateakh', 'pres.2': 'מתפתחת|mitpatakhat', 'past.3': 'התפתח|hitpateakh', 'past.0': 'התפתחתי|hitpatakhti' });
F('hit:נהג', 'להתנהג|lehitnaheg', { 'pres.0': 'מתנהג|mitnaheg', 'pres.5': 'מתנהגים|mitnahagim', 'past.3': 'התנהג|hitnaheg', 'past.4': 'התנהגה|hitnahaga' });
F('hit:אהב', 'להתאהב|lehit\'ahev', { 'pres.0': 'מתאהב|mit\'ahev', 'past.3': 'התאהב|hit\'ahev', 'past.0': 'התאהבתי|hit\'ahavti' });
F('hit:קשר', 'להתקשר|lehitkasher', { 'pres.0': 'מתקשר|mitkasher', 'past.3': 'התקשר|hitkasher' });
F('hit:עלם', 'להתעלם|lehit\'alem', { 'pres.0': 'מתעלם|mit\'alem', 'past.3': 'התעלם|hit\'alem' });
F('hit:ישב', 'להתיישב|lehityashev', { 'pres.0': 'מתיישב|mityashev', 'past.3': 'התיישב|hityashev', 'past.0': 'התיישבתי|hityashavti' });
F('hit:גור', 'להתגורר|lehitgorer', { 'pres.0': 'מתגורר|mitgorer', 'past.3': 'התגורר|hitgorer', 'past.0': 'התגוררתי|hitgorarti' });
F('hit:עור', 'להתעורר|lehit\'orer', { 'pres.0': 'מתעורר|mit\'orer', 'past.3': 'התעורר|hit\'orer' });
F('hit:בין', 'להתבונן|lehitbonen', { 'pres.0': 'מתבונן|mitbonen', 'past.3': 'התבונן|hitbonen' });
F('hit:סבב', 'להסתובב|lehistovev', { 'pres.0': 'מסתובב|mistovev', 'past.3': 'הסתובב|histovev', 'past.0': 'הסתובבתי|histovavti' });
F('hit:מוט', 'להתמוטט|lehitmotet', { 'past.3': 'התמוטט|hitmotet' });
F('hit:קום', 'להתקיים|lehitkayem', { 'pres.0': 'מתקיים|mitkayem', 'past.3': 'התקיים|hitkayem', 'past.4': 'התקיימה|hitkayma' });
F('hit:גיס', 'להתגייס|lehitgayes', { 'pres.0': 'מתגייס|mitgayes', 'past.3': 'התגייס|hitgayes' });
F('hit:בוש', 'להתבייש|lehitbayesh', { 'pres.0': 'מתבייש|mitbayesh', 'past.3': 'התבייש|hitbayesh' });
F('hit:גלה', 'להתגלות|lehitgalot', { 'pres.0': 'מתגלה|mitgale', 'past.3': 'התגלה|hitgala', 'past.4': 'התגלתה|hitgalta', 'past.0': 'התגליתי|hitgaliti' });
F('hit:פלא', 'להתפלא|lehitpale', { 'pres.0': 'מתפלא|mitpale', 'past.3': 'התפלא|hitpale', 'past.0': 'התפלאתי|hitpaleti', 'past.4': 'התפלאה|hitpal\'a' });
F('hit:חבא', 'להתחבא|lehitkhabe', { 'pres.0': 'מתחבא|mitkhabe', 'past.3': 'התחבא|hitkhabe' });
F('hit:ארגן', 'להתארגן|lehit\'argen', { 'pres.0': 'מתארגן|mit\'argen', 'past.3': 'התארגן|hit\'argen' });
F('hit:שכנע', 'להשתכנע|lehishtakhne\'a', { 'past.3': 'השתכנע|hishtakhne\'a' });
F('hit:פרסם', 'להתפרסם|lehitparsem', { 'past.3': 'התפרסם|hitparsem' });
F('hit:זהה', 'להזדהות|lehizdahot', { 'pres.0': 'מזדהה|mizdahe', 'past.3': 'הזדהה|hizdaha' });

// ======== whole rows of more verbs (ten slots each) ===============================================
const DASH10 = Array(10).fill('-').join(' ; ');
R('pa:בנה', 'pres', 'בונה|bone ; בונה|bone ; בונה|bona ; בונה|bone ; בונה|bona ; בונים|bonim ; בונים|bonim ; בונות|bonot ; בונים|bonim ; בונות|bonot');
R('pa:בנה', 'past', 'בניתי|baniti ; בנית|banita ; בנית|banit ; בנה|bana ; בנתה|banta ; בנינו|baninu ; בניתם|banitem ; בניתן|baniten ; בנו|banu ; בנו|banu');
R('pa:בנה', 'fut', 'אבנה|evne ; תבנה|tivne ; תבני|tivni ; יבנה|yivne ; תבנה|tivne ; נבנה|nivne ; תבנו|tivnu ; תבנו|tivnu ; יבנו|yivnu ; יבנו|yivnu');
R('pa:בנה', 'imp', '- ; בנה|bne ; בני|bni ; - ; - ; - ; בנו|bnu ; בנו|bnu ; - ; -');
R('pa:בנה', 'impNeg', '- ; אל תבנה|al tivne ; אל תבני|al tivni ; - ; - ; - ; אל תבנו|al tivnu ; אל תבנו|al tivnu ; - ; -');
R('pa:קום', 'pres', 'קם|kam ; קם|kam ; קמה|kama ; קם|kam ; קמה|kama ; קמים|kamim ; קמים|kamim ; קמות|kamot ; קמים|kamim ; קמות|kamot');
R('pa:קום', 'past', 'קמתי|kamti ; קמת|kamta ; קמת|kamt ; קם|kam ; קמה|kama ; קמנו|kamnu ; קמתם|kamtem ; קמתן|kamten ; קמו|kamu ; קמו|kamu');
R('pa:קום', 'fut', 'אקום|akum ; תקום|takum ; תקומי|takumi ; יקום|yakum ; תקום|takum ; נקום|nakum ; תקומו|takumu ; תקומו|takumu ; יקומו|yakumu ; יקומו|yakumu');
R('pi:דבר', 'pres', 'מדבר|medaber ; מדבר|medaber ; מדברת|medaberet ; מדבר|medaber ; מדברת|medaberet ; מדברים|medabrim ; מדברים|medabrim ; מדברות|medabrot ; מדברים|medabrim ; מדברות|medabrot');
R('pi:דבר', 'past', 'דיברתי|dibarti ; דיברת|dibarta ; דיברת|dibart ; דיבר|diber ; דיברה|dibra ; דיברנו|dibarnu ; דיברתם|dibartem ; דיברתן|dibarten ; דיברו|dibru ; דיברו|dibru');
R('pi:דבר', 'fut', 'אדבר|adaber ; תדבר|tedaber ; תדברי|tedabri ; ידבר|yedaber ; תדבר|tedaber ; נדבר|nedaber ; תדברו|tedabru ; תדברו|tedabru ; ידברו|yedabru ; ידברו|yedabru');
R('hi:סבר', 'pres', 'מסביר|masbir ; מסביר|masbir ; מסבירה|masbira ; מסביר|masbir ; מסבירה|masbira ; מסבירים|masbirim ; מסבירים|masbirim ; מסבירות|masbirot ; מסבירים|masbirim ; מסבירות|masbirot');
R('hi:סבר', 'past', 'הסברתי|hisbarti ; הסברת|hisbarta ; הסברת|hisbart ; הסביר|hisbir ; הסבירה|hisbira ; הסברנו|hisbarnu ; הסברתם|hisbartem ; הסברתן|hisbarten ; הסבירו|hisbiru ; הסבירו|hisbiru');
R('hi:סבר', 'fut', 'אסביר|asbir ; תסביר|tasbir ; תסבירי|tasbiri ; יסביר|yasbir ; תסביר|tasbir ; נסביר|nasbir ; תסבירו|tasbiru ; תסבירו|tasbiru ; יסבירו|yasbiru ; יסבירו|yasbiru');
R('hi:סבר', 'imp', '- ; הסבר|hasber ; הסבירי|hasbiri ; - ; - ; - ; הסבירו|hasbiru ; הסבירו|hasbiru ; - ; -');
R('ni:כנס', 'past', 'נכנסתי|nikhnasti ; נכנסת|nikhnasta ; נכנסת|nikhnast ; נכנס|nikhnas ; נכנסה|nikhnesa ; נכנסנו|nikhnasnu ; נכנסתם|nikhnastem ; נכנסתן|nikhnasten ; נכנסו|nikhnesu ; נכנסו|nikhnesu');
R('ni:כנס', 'fut', 'אכנס|ekanes ; תיכנס|tikanes ; תיכנסי|tikansi ; ייכנס|yikanes ; תיכנס|tikanes ; ניכנס|nikanes ; תיכנסו|tikansu ; תיכנסו|tikansu ; ייכנסו|yikansu ; ייכנסו|yikansu');
R('hit:פלל', 'past', 'התפללתי|hitpalalti ; התפללת|hitpalalta ; התפללת|hitpalalt ; התפלל|hitpalel ; התפללה|hitpalela ; התפללנו|hitpalalnu ; התפללתם|hitpalaltem ; התפללתן|hitpalalten ; התפללו|hitpalelu ; התפללו|hitpalelu');
R('hit:פלל', 'fut', 'אתפלל|etpalel ; תתפלל|titpalel ; תתפללי|titpaleli ; יתפלל|yitpalel ; תתפלל|titpalel ; נתפלל|nitpalel ; תתפללו|titpalelu ; תתפללו|titpalelu ; יתפללו|yitpalelu ; יתפללו|yitpalelu');
R('pa:נתן', 'past', 'נתתי|natati ; נתת|natata ; נתת|natat ; נתן|natan ; נתנה|natna ; נתנו|natanu ; נתתם|netatem ; נתתן|netaten ; נתנו|natnu ; נתנו|natnu');
R('pa:נתן', 'fut', 'אתן|eten ; תיתן|titen ; תיתני|titni ; ייתן|yiten ; תיתן|titen ; ניתן|niten ; תיתנו|titnu ; תיתנו|titnu ; ייתנו|yitnu ; ייתנו|yitnu');
R('pa:נתן', 'imp', '- ; תן|ten ; תני|tni ; - ; - ; - ; תנו|tnu ; תנו|tnu ; - ; -');
R('pa:הלך', 'past', 'הלכתי|halakhti ; הלכת|halakhta ; הלכת|halakht ; הלך|halakh ; הלכה|halkha ; הלכנו|halakhnu ; הלכתם|halakhtem ; הלכתן|halakhten ; הלכו|halkhu ; הלכו|halkhu');
R('pa:הלך', 'fut', 'אלך|elekh ; תלך|telekh ; תלכי|telkhi ; ילך|yelekh ; תלך|telekh ; נלך|nelekh ; תלכו|telkhu ; תלכו|telkhu ; ילכו|yelkhu ; ילכו|yelkhu');
R('pa:הלך', 'pres', 'הולך|holekh ; הולך|holekh ; הולכת|holekhet ; הולך|holekh ; הולכת|holekhet ; הולכים|holkhim ; הולכים|holkhim ; הולכות|holkhot ; הולכים|holkhim ; הולכות|holkhot');
R('pa:בוא', 'past', 'באתי|bati ; באת|bata ; באת|bat ; בא|ba ; באה|ba\'a ; באנו|banu ; באתם|batem ; באתן|baten ; באו|ba\'u ; באו|ba\'u');
R('pa:בוא', 'fut', 'אבוא|avo ; תבוא|tavo ; תבואי|tavo\'i ; יבוא|yavo ; תבוא|tavo ; נבוא|navo ; תבואו|tavo\'u ; תבואו|tavo\'u ; יבואו|yavo\'u ; יבואו|yavo\'u');
R('pa:היה', 'past', 'הייתי|hayiti ; היית|hayita ; היית|hayit ; היה|haya ; הייתה|hayta ; היינו|hayinu ; הייתם|hayitem ; הייתן|hayiten ; היו|hayu ; היו|hayu');
R('pa:היה', 'pres', DASH10);
R('pa:היה', 'pastCont', DASH10);
R('pa:היה', 'fut', 'אהיה|ehye ; תהיה|tihye ; תהיי|tihyi ; יהיה|yihye ; תהיה|tihye ; נהיה|nihye ; תהיו|tihyu ; תהיו|tihyu ; יהיו|yihyu ; יהיו|yihyu');
R('pa:ראה', 'pres', 'רואה|ro\'e ; רואה|ro\'e ; רואה|ro\'a ; רואה|ro\'e ; רואה|ro\'a ; רואים|ro\'im ; רואים|ro\'im ; רואות|ro\'ot ; רואים|ro\'im ; רואות|ro\'ot');
R('pa:ראה', 'fut', 'אראה|er\'e ; תראה|tir\'e ; תראי|tir\'i ; יראה|yir\'e ; תראה|tir\'e ; נראה|nir\'e ; תראו|tir\'u ; תראו|tir\'u ; יראו|yir\'u ; יראו|yir\'u');
R('pa:ישב', 'past', 'ישבתי|yashavti ; ישבת|yashavta ; ישבת|yashavt ; ישב|yashav ; ישבה|yashva ; ישבנו|yashavnu ; ישבתם|yeshavtem ; ישבתן|yeshavten ; ישבו|yashvu ; ישבו|yashvu');
R('pa:ישב', 'fut', 'אשב|eshev ; תשב|teshev ; תשבי|teshvi ; ישב|yeshev ; תשב|teshev ; נשב|neshev ; תשבו|teshvu ; תשבו|teshvu ; ישבו|yeshvu ; ישבו|yeshvu');
R('pi:תרגם', 'past', 'תרגמתי|tirgamti ; תרגמת|tirgamta ; תרגמת|tirgamt ; תרגם|tirgem ; תרגמה|tirgema ; תרגמנו|tirgamnu ; תרגמתם|tirgamtem ; תרגמתן|tirgamten ; תרגמו|tirgemu ; תרגמו|tirgemu');
R('pi:תרגם', 'pres', 'מתרגם|metargem ; מתרגם|metargem ; מתרגמת|metargemet ; מתרגם|metargem ; מתרגמת|metargemet ; מתרגמים|metargemim ; מתרגמים|metargemim ; מתרגמות|metargemot ; מתרגמים|metargemim ; מתרגמות|metargemot');
R('hit:סכל', 'past', 'הסתכלתי|histakalti ; הסתכלת|histakalta ; הסתכלת|histakalt ; הסתכל|histakel ; הסתכלה|histakla ; הסתכלנו|histakalnu ; הסתכלתם|histakaltem ; הסתכלתן|histakalten ; הסתכלו|histaklu ; הסתכלו|histaklu');
R('pa:שאל:a', 'fut', 'אשאל|esh\'al ; תשאל|tish\'al ; תשאלי|tish\'ali ; ישאל|yish\'al ; תשאל|tish\'al ; נשאל|nish\'al ; תשאלו|tish\'alu ; תשאלו|tish\'alu ; ישאלו|yish\'alu ; ישאלו|yish\'alu');
R('pa:אמר', 'fut', 'אומר|omar ; תאמר|tomar ; תאמרי|tomri ; יאמר|yomar ; תאמר|tomar ; נאמר|nomar ; תאמרו|tomru ; תאמרו|tomru ; יאמרו|yomru ; יאמרו|yomru');
R('pa:אכל', 'past', 'אכלתי|akhalti ; אכלת|akhalta ; אכלת|akhalt ; אכל|akhal ; אכלה|akhla ; אכלנו|akhalnu ; אכלתם|akhaltem ; אכלתן|akhalten ; אכלו|akhlu ; אכלו|akhlu');

// ---- Refusals for unsupported classes ----------------------------------------------------------
F('pa:ירה', 'לירות|lirot', { 'pres.0': 'יורה|yore', 'pres.2': 'יורה|yora', 'pres.5': 'יורים|yorim', 'past.3': 'ירה|yara', 'past.0': 'יריתי|yariti', 'fut.0': 'אירה|ire', 'fut.3': 'יירה|yire', 'fut.2': 'תירי|tiri', 'imp.1': 'ירה|yere' });
F('pa:שלח', 'לשלוח|lishloakh', { 'fut.3': 'ישלח|yishlakh', 'fut.2': 'תשלחי|tishlekhi' });
F('pa:שלח:o', 'לשלוח|lishloakh', { 'fut.3': 'ישלח|yishlakh' });
F('hi:עשר', 'להעשיר|leha\'asir', { 'past.3': 'העשיר|he\'esir', 'pres.0': 'מעשיר|ma\'asir' });

F('hi:יצג', 'להציג|lehatsig', { 'pres.0': 'מציג|matsig', 'past.3': 'הציג|hitsig', 'past.0': 'הצגתי|hitsagti', 'fut.3': 'יציג|yatsig', 'imp.1': 'הצג|hatseg' });
F('hi:יצע', 'להציע|lehatsi\'a', { 'pres.0': 'מציע|matsi\'a', 'past.3': 'הציע|hitsi\'a', 'past.0': 'הצעתי|hitsati', 'imp.1': 'הצע|hatsa' });
F('hi:יבל', 'להוביל|lehovil', { 'pres.0': 'מוביל|movil', 'past.3': 'הוביל|hovil', 'past.0': 'הובלתי|hovalti' });
F('hi:יכח', 'להוכיח|lehokhiakh', { 'pres.0': 'מוכיח|mokhiakh', 'past.3': 'הוכיח|hokhiakh', 'past.0': 'הוכחתי|hokhakhti' });
F('hi:נמך', 'להנמיך|lehanmikh', { 'pres.0': 'מנמיך|manmikh', 'past.3': 'הנמיך|hinmikh' });
F('hi:נצח', 'להנציח|lehantsiakh', { 'past.3': 'הנציח|hintsiakh' });
F('hi:גנן', 'להגן|lehagen', { 'pres.0': 'מגן|megen', 'past.3': 'הגן|hegen', 'past.0': 'הגנתי|heganti', 'fut.0': 'אגן|agen', 'imp.1': 'הגן|hagen' });
F('hi:קלל', 'להקל|lehakel', { 'pres.0': 'מקל|mekel', 'past.3': 'הקל|hekel', 'past.0': 'הקלתי|hekalti' });
F('hi:אטט', 'להאט|leha\'et', { 'pres.0': 'מאט|me\'et', 'past.3': 'האט|he\'et' });
F('hi:קיא', 'להקיא|lehaki', { 'pres.0': 'מקיא|meki', 'past.3': 'הקיא|heki', 'past.0': 'הקאתי|hekati' });
F('hi:רווח', 'להרוויח|leharviakh', { 'pres.0': 'מרוויח|marviakh', 'past.3': 'הרוויח|hirviakh', 'past.0': 'הרווחתי|hirvakhti' });
F('hi:ריח', 'להריח|lehariakh', { 'pres.0': 'מריח|meriakh', 'past.3': 'הריח|heriakh', 'past.0': 'הרחתי|herakhti' });
F('hi:רוח', 'להרוויח|leharviakh', { 'pres.0': 'מרוויח|marviakh', 'past.3': 'הרוויח|hirviakh', 'past.0': 'הרווחתי|hirvakhti', 'fut.3': 'ירוויח|yarviakh', 'imp.1': 'הרווח|harvakh' });
F('hi:זול', 'להוזיל|lehozil', { 'pres.0': 'מוזיל|mozil', 'past.3': 'הוזיל|hozil' });
F('hi:תחל', 'להתחיל|lehatkhil', { 'pres.0': 'מתחיל|matkhil', 'past.3': 'התחיל|hitkhil', 'past.0': 'התחלתי|hitkhalti', 'fut.0': 'אתחיל|atkhil', 'imp.1': 'התחל|hatkhel' });
F('hi:סכם', 'להסכים|lehaskim', { 'pres.0': 'מסכים|maskim', 'past.3': 'הסכים|hiskim', 'past.0': 'הסכמתי|hiskamti' });


// ======== Found by the database audit (each of these was wrong or missing when the 1,909 verbs were first run) =========
// pa'al, strong roots whose middle ו is a consonant (גווע, צווח), not the vowel u of an ayin-vav verb (לגוע would be wrong)
F('pa:גוע', "לגווע|ligvo'a", { 'pres.0': "גווע|gove'a", 'pres.2': "גוועת|gova'at", 'past.3': 'גווע|gava', 'past.4': "גוועה|gav'a", 'past.0': 'גוועתי|gavati', 'fut.3': 'יגווע|yigva', 'fut.2': "תגוועי|tigve'i", 'imp.1': 'גווע|gva' });
F('pa:צוח', 'לצווח|litsvoakh', { 'pres.0': 'צווח|tsoveakh', 'past.3': 'צווח|tsavakh', 'past.4': 'צווחה|tsavkha', 'fut.3': 'יצווח|yitsvakh', 'imp.1': 'צווח|tsvakh' });
// pi'el of a root that starts with ה (four letters: הנהן, הבהב, הפנט) is the quadriliteral pattern, not a hif'il
F('pi:הנהן', 'להנהן|lehanhen', { 'pres.0': 'מהנהן|mehanhen', 'pres.2': 'מהנהנת|mehanhenet', 'past.3': 'הנהן|hinhen', 'past.0': 'הנהנתי|hinhanti', 'fut.3': 'יהנהן|yehanhen', 'imp.1': 'הנהן|hanhen' });
F('pi:הבהב', 'להבהב|lehavhev', { 'pres.0': 'מהבהב|mehavhev', 'past.3': 'הבהב|hivhev', 'past.0': 'הבהבתי|hivhavti' });
F('pi:הפנט', 'להפנט|lehafnet', { 'pres.0': 'מהפנט|mehafnet', 'past.3': 'הפנט|hifnet', 'past.0': 'הפנטתי|hifnati' });
F('pi:עייף', "לעייף|le'ayef", { 'pres.0': "מעייף|me'ayef", 'past.3': 'עייף|iyef', 'past.0': 'עייפתי|iyafti', 'imp.1': 'עייף|ayef' });
F('pi:מלא', 'למלא|lemale', { 'pres.0': 'ממלא|memale', 'past.3': 'מילא|mile', 'past.4': "מילאה|mil'a", 'fut.0': 'אמלא|amale' });
// hif'il whose last ה is a consonant: the ה is silent at the end of a word (furtive a) and pronounced before an ending
F('hi:גבה', "להגביה|lehagbi'a", { 'pres.0': "מגביה|magbi'a", 'pres.2': 'מגביהה|magbiha', 'pres.5': 'מגביהים|magbihim', 'past.3': "הגביה|higbi'a", 'past.4': 'הגביהה|higbiha', 'past.0': 'הגבהתי|higbahti', 'past.8': 'הגביהו|higbihu', 'fut.0': "אגביה|agbi'a", 'fut.2': 'תגביהי|tagbihi', 'imp.1': "הגבה|hagbe'a", 'imp.2': 'הגביהי|hagbihi' });
F('hi:גיה', "להגיה|lehagi'a", { 'pres.0': "מגיה|megi'a", 'pres.2': 'מגיהה|megiha', 'past.3': "הגיה|hegi'a", 'past.0': 'הגהתי|hegahti', 'fut.0': "אגיה|agi'a" });
// the נ kept in הנפיק (root נפק) against להפיק (written with the root פוק)
F('hi:נפק', 'להנפיק|lehanpik', { 'pres.0': 'מנפיק|manpik', 'past.3': 'הנפיק|hinpik', 'past.0': 'הנפקתי|hinpakti', 'fut.3': 'ינפיק|yanpik', 'imp.1': 'הנפק|hanpek' });
F('hi:פוק', 'להפיק|lehafik', { 'pres.0': 'מפיק|mafik', 'past.3': 'הפיק|hefik', 'past.0': 'הפקתי|hefakti', 'fut.3': 'יפיק|yafik', 'imp.1': 'הפק|hafek' });
// one verb, one paradigm: these were written twice, once as a hollow root, once as pe-nun, with different forms
F('hi:נסק', 'להסיק|lehasik', { 'pres.0': 'מסיק|masik', 'past.3': 'הסיק|hisik', 'past.0': 'הסקתי|hisakti' });
F('hi:נתך', 'להתיך|lehatikh', { 'pres.0': 'מתיך|matikh', 'past.3': 'התיך|hitikh', 'past.0': 'התכתי|hitakhti' });
// nif'al geminate (the infinitive is certain; the other forms follow the strong nif'al)
F('ni:מסס', 'להימס|lehimas', { 'pres.0': 'נמס|nimas', 'pres.5': 'נמסים|nimasim', 'past.3': 'נמס|nimas', 'past.0': 'נמסתי|nimasti', 'fut.3': 'יימס|yimas', 'fut.2': 'תימסי|timasi', 'imp.1': 'הימס|himas' });
// השתחווה: a lamed-he root with a consonantal ו (four letters in all)
F('hit:שחה', 'להשתחוות|lehishtakhavot', { 'pres.0': 'משתחווה|mishtakhave', 'pres.2': 'משתחווה|mishtakhava', 'pres.5': 'משתחווים|mishtakhavim', 'pres.7': 'משתחוות|mishtakhavot', 'past.3': 'השתחווה|hishtakhava', 'past.4': 'השתחוותה|hishtakhavta', 'past.0': 'השתחוויתי|hishtakhaviti', 'past.8': 'השתחוו|hishtakhavu', 'fut.0': 'אשתחווה|eshtakhave', 'fut.2': 'תשתחווי|tishtakhavi', 'fut.8': 'ישתחוו|yishtakhavu', 'imp.1': 'השתחווה|hishtakhave' });
// sin (s), not shin (sh): שׂגשׂג, שׂרר, נשׂרף, השׂביע, שׂוחח; shin stays shin in the other verbs of the same spelling (שבע to swear, שבר)
F('pi:שגשג', 'לשגשג|lesagseg', { 'pres.0': 'משגשג|mesagseg', 'past.3': 'שגשג|sigseg', 'past.0': 'שגשגתי|sigsagti', 'fut.3': 'ישגשג|yesagseg' });
F('hi:שבע', "להשביע|lehasbi'a", { 'pres.0': "משביע|masbi'a", 'past.3': "השביע|hisbi'a", 'fut.3': "ישביע|yasbi'a" });
F('ni:שבע', 'להישבע|lehishava', { 'pres.0': 'נשבע|nishba', 'past.3': 'נשבע|nishba' });
F('ni:שרף', 'להישרף|lehisaref', { 'pres.0': 'נשרף|nisraf', 'past.3': 'נשרף|nisraf', 'fut.3': 'יישרף|yisaref' });
F('pa:שרף:o', 'לשרוף|lisrof', { 'pres.0': 'שורף|soref', 'past.3': 'שרף|saraf' });
F('pa:שרר:o', 'לשרור|lisror', { 'pres.0': 'שורר|sorer', 'fut.3': 'ישרור|yisror' });
F('pi:שוחח', 'לשוחח|lesokheakh', { 'pres.0': 'משוחח|mesokheakh', 'past.3': 'שוחח|sokheakh' });

// a ת/ט right before צ is not written twice in the transliteration (ts already begins with t)
F('pi:נתץ', 'לנתץ|lenatets', { 'pres.0': 'מנתץ|menatets', 'pres.5': 'מנתצים|menatsim', 'past.3': 'ניתץ|nitets', 'past.4': 'ניתצה|nitsa', 'fut.2': 'תנתצי|tenatsi' });
// geminate pa'al present plural: a full e between the two identical letters (שודדים shodedim, not shodim)
F('pa:שדד:o', 'לשדוד|lishdod', { 'pres.0': 'שודד|shoded', 'pres.2': 'שודדת|shodedet', 'pres.5': 'שודדים|shodedim', 'pres.7': 'שודדות|shodedot', 'past.0': 'שדדתי|shadadti', 'fut.2': 'תשדדי|tishdedi' });
F('pa:גלל:o', 'לגלול|liglol', { 'pres.5': 'גוללים|golelim', 'pres.7': 'גוללות|golelot' });
F('pa:מדד:o', 'למדוד|limdod', { 'pres.0': 'מודד|moded', 'pres.5': 'מודדים|modedim' });

// pe-yod verbs with an o future: the sheva of the 2nd person plural past is an e (yetsartem), like ילד yeladtem
F('pa:יצר', 'ליצור|litsor', { 'past.6': 'יצרתם|yetsartem', 'past.7': 'יצרתן|yetsarten' });
F('pa:ינק', 'לינוק|linok', { 'past.6': 'ינקתם|yenaktem' });
F('pa:ירק', 'לירוק|lirok', { 'past.6': 'ירקתם|yeraktem', 'past.0': 'ירקתי|yarakti' });

// ======== RUNNER (add new expectations ABOVE this line) =================================
for (const { entry, inf, forms } of FORMS) {
  const e = entryOf(entry);
  let result;
  try { result = express(e); } catch (error) { failures.push(`${entry}: express() threw "${error.message}"`); continue; }
  same(`${entry} infinitive`, `${result.he}|${result.tr}`, inf);
  for (const [key, want] of Object.entries(forms)) {
    const [row, slot] = key.split('.');
    same(`${entry} ${inf} ${row}.${slot} (${SLOTS[slot]})`, cellText(result.rows[row][slot]), want);
  }
}
for (const { entry, row, cells } of ROWS) {
  let result;
  try { result = express(entryOf(entry)); } catch (error) { failures.push(`${entry} ${row}: express() threw "${error.message}"`); continue; }
  same(`${entry} whole row ${row}`, result.rows[row].map(cellText).join(' ; '), cells);
}

// Shape of the result.
{
  const r = express({ binyan: 'pa', root: 'כתב', fv: 'o' });
  same('seven row keys in order', ROW_KEYS.join(' '), 'pres past fut pastCont imp impNeg inf');
  same('result keys', Object.keys(r.rows).join(' '), ROW_KEYS.join(' '));
  same('ten cells per row', ROW_KEYS.every(k => r.rows[k].length === 10), true);
}

// ---- Refusals: bad input must be refused, not guessed at ------------------------------------
const throwsWith = (label, entry, pattern) => {
  checks += 1;
  try { express(entry); } catch (error) { if (!pattern.test(error.message)) failures.push(`${label}: wrong error "${error.message}"`); return; }
  failures.push(`${label}: did not throw`);
};
throwsWith('unknown binyan', { binyan: 'xx', root: 'כתב', fv: 'o' }, /unknown binyan "xx"/);
throwsWith('missing binyan', { root: 'כתב' }, /unknown binyan/);
throwsWith('root of two letters', { binyan: 'pi', root: 'דב' }, /3 or 4 Hebrew letters/);
throwsWith('root of five letters', { binyan: 'pi', root: 'תרגמנו' }, /3 or 4 Hebrew letters/);
throwsWith('root with a Latin letter', { binyan: 'pi', root: 'דבר1' }, /3 or 4 Hebrew letters/);
throwsWith('pa\'al strong root without fv', { binyan: 'pa', root: 'כתב' }, /needs fv/);
throwsWith('bad fv', { binyan: 'pa', root: 'כתב', fv: 'u' }, /fv "u"/);
throwsWith('pu\'al is refused', { binyan: 'pu', root: 'דבר' }, /not supported/);
throwsWith('huf\'al with a weak root is refused', { binyan: 'hu', root: 'בנה' }, /only strong/);
throwsWith('not an object', 'לכתוב', /must be an object/);

throwsWith('nif\'al ayin-vav with a weak last letter', { binyan: 'ni', root: 'בוא' }, /ayin-vav\/yod with a weak last letter/);
throwsWith('nif\'al with four letters', { binyan: 'ni', root: 'תרגם' }, /four letters/);
throwsWith('pa\'al with four letters', { binyan: 'pa', root: 'תרגם' }, /four letters/);
throwsWith('pe-yod root not in the list', { binyan: 'pa', root: 'יכל' }, /pe-yod root/);
throwsWith('pa\'al root starting with vav', { binyan: 'pa', root: 'ותר', fv: 'o' }, /starts with ו/);
throwsWith('hitpa\'el four letters ending in he', { binyan: 'hit', root: 'התרה' }, /weak letter/);
throwsWith('nif\'al geminate with a guttural first letter is refused', { binyan: 'ni', root: 'עלל' }, /geminate with a guttural/);
throwsWith('unknown binyan name in full', { binyan: 'piel', root: 'דבר' }, /unknown binyan "piel"/);
throwsWith('null entry', null, /must be an object/);
throwsWith('hif\'il pa\'al-only fv is fine but fv x is not', { binyan: 'hi', root: 'סבר', fv: 'x' }, /fv "x"/);

// ======== DATABASE ======================================================================
// Every entry of verbs.js must be readable by the engine, and the engine's infinitive must equal entry.he:
// this is the consistency check between the data's root/binyan/fv and its spelling. All problems of one
// kind are collected into ONE failure so that they can be seen together.
const HEB = /^[א-ת]+$/;
const FINALS = 'ךםןףץ', NON_FINAL = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
// a script word: Hebrew letters, a final-form letter only at the end and always there when the letter has one
function badScriptWord(word) {
  if (!HEB.test(word)) return 'not only Hebrew letters';
  for (let i = 0; i < word.length; i++) {
    const last = i === word.length - 1;
    if (FINALS.includes(word[i]) && !last) return `final-form letter ${word[i]} inside the word`;
    if (last && Object.values(NON_FINAL).includes(word[i])) return `${word[i]} at the end of the word should be ${Object.keys(NON_FINAL).find(k => NON_FINAL[k] === word[i])}`;
  }
  return null;
}
const badScript = text => {
  if (typeof text !== 'string' || !text) return 'empty or not a string';
  for (const word of text.split(' ')) { const bad = badScriptWord(word); if (bad) return `${bad} in "${word}"`; }
  return null;
};
const badLatin = text => (typeof text === 'string' && text && /^[a-z'-]+( [a-z'-]+)*$/.test(text) ? null : 'transliteration must be [a-z\'-] and spaces');

// ---- Every form of every expected verb is well formed; a sweep of generated roots never crashes ---------------
// (the helpers badScript/badLatin are defined just below, in the database section)
function checkWellFormedEverywhere() {
  const problems = [];
  const check = (label, result) => {
    for (const key of ROW_KEYS) {
      const row = result.rows[key];
      if (!Array.isArray(row) || row.length !== 10) { problems.push(`${label}: malformed row ${key}`); continue; }
      row.forEach((cell, slot) => {
        if (!cell) return;
        const why = badScript(cell.he) || badLatin(cell.tr);
        if (why) problems.push(`${label} ${key}.${slot}: ${why}: ${cell.he} / ${cell.tr}`);
      });
    }
    const why = badScript(result.he) || badLatin(result.tr);
    if (why) problems.push(`${label} infinitive: ${why}`);
  };
  for (const { entry } of FORMS) { try { check(entry, express(entryOf(entry))); } catch (error) { /* reported above */ } checks += 1; }
  // a deterministic sweep over generated roots: either a well-formed result or the documented Error
  const letters = [...'אבגדהוזחטיכלמנסעפצקרשת'], toFinal = { 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' };
  let seed = 4242;
  const next = n => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
  for (let i = 0; i < 3000; i++) {
    let root = ''; const length = next(5) === 0 ? 4 : 3;
    for (let j = 0; j < length; j++) root += letters[next(letters.length)];
    root = root.slice(0, -1) + (toFinal[root.slice(-1)] || root.slice(-1));
    const entry = { binyan: ['pa', 'ni', 'pi', 'hi', 'hit', 'hu'][next(6)], root, fv: next(2) ? 'o' : 'a' };
    try { check(`sweep ${entry.binyan}:${root}`, express(entry)); }
    catch (error) { if (!/^hebrew express\(\): /.test(error.message)) problems.push(`sweep ${entry.binyan}:${root}: unexpected error ${error.message}`); }
    checks += 1;
  }
  if (problems.length) failures.push(`malformed forms in the expected verbs or the sweep (${problems.length}):\n    ` + problems.slice(0, 40).join('\n    '));
}

// Spellings that are really two different verbs (kept apart by their vowels), read one by one:
//   לפנות lifnot (turn to) / lefanot (clear)       לבנות livnot (build) / levanot (whiten)
//   לכנות likhnot (nickname) / lekhanot             לגלות ligalot (go into exile) / legalot (discover)
//   לרצות lirtsot (want) / leratsot (please)         לחנות likhnot (park) / lekhanot
//   לגבות ligbot / legabot   לזכות lizkot / lezakot   למנות limnot (count) / lemanot (appoint)
//   לצפות litspot (watch) / letsapot (coat)   לענות la'anot (answer) / le'anot (torment)   לחוות lakhavot / lekhavot
const TWO_READINGS = new Set(['לפנות', 'לבנות', 'לכנות', 'לגלות', 'לרצות', 'לחנות', 'לגבות', 'לזכות', 'למנות', 'לצפות', 'לענות', 'לחוות']);

function checkDatabase() {
  let translations = 0;
  const unreadable = [], mismatches = [], malformed = [], rootForm = [], readingOf = {}, readingClash = [];
  const rowsOf = {}, paradigmClash = [], fvOf = {}, fvClash = [];
  for (const [english, options] of Object.entries(VERBS)) {
    for (const entry of options) {
      translations += 1;
      const label = `${english} -> ${entry.he} [${entry.binyan}:${entry.root}${entry.fv ? ':' + entry.fv : ''}]`;
      const bad = badScript(entry.he);
      if (bad) malformed.push(`${label}: infinitive ${bad}`);
      const rb = badScriptWord(String(entry.root));
      if (rb) rootForm.push(`${label}: root ${rb}`);
      let result;
      try { result = express(entry); } catch (error) { unreadable.push(`${label}: ${error.message}`); continue; }
      if (result.he !== entry.he) mismatches.push(`${label}: the engine builds ${result.he} (${result.tr})`);
      const lat = badLatin(result.tr);
      if (lat) malformed.push(`${label}: infinitive ${lat}: ${result.tr}`);
      for (const key of ROW_KEYS) {
        const row = result.rows[key];
        if (!Array.isArray(row) || row.length !== 10) { malformed.push(`${label}: malformed row ${key}`); continue; }
        row.forEach((cell, slot) => {
          if (cell === null) return;
          const why = !cell || typeof cell !== 'object' ? 'not a cell' : /undefined|NaN|\[object/.test(cell.he + cell.tr) ? 'undefined in the cell'
            : badScript(cell.he) || badLatin(cell.tr);
          if (why) malformed.push(`${label}: ${key}.${slot}: ${why}: ${cell && cell.he} / ${cell && cell.tr}`);
        });
      }
      if (!result.rows.past.some(Boolean) || !result.rows.fut.some(Boolean)) malformed.push(`${label}: no past or future form`);
      // one transliteration per infinitive spelling across the database
      if (readingOf[entry.he] && readingOf[entry.he] !== result.tr && !TWO_READINGS.has(entry.he)) {
        readingClash.push(`${label}: ${entry.he} is read ${result.tr} here and ${readingOf[entry.he]} elsewhere`);
      }
      readingOf[entry.he] = result.tr;
      // one infinitive spelling, one paradigm: the same verb written with two different roots (a hollow root and a pe-nun
      // root, say) must come out with identical forms (this found להסיק, להפיק, להתיך conjugated two ways)
      const json = JSON.stringify(result.rows);
      if (!rowsOf[entry.he]) rowsOf[entry.he] = { label, json };
      else if (rowsOf[entry.he].json !== json && !TWO_READINGS.has(entry.he)) paradigmClash.push(`${label}: conjugated differently from ${rowsOf[entry.he].label}`);
      // one root, one future vowel: two explicit fv for the same pa'al root cannot both be right
      if (entry.fv) {
        const rootKey = `${entry.binyan}:${entry.root}`;
        if (fvOf[rootKey] && fvOf[rootKey] !== entry.fv) fvClash.push(`${label}: another entry gives fv ${fvOf[rootKey]} for ${rootKey}`);
        fvOf[rootKey] = entry.fv;
      }
    }
  }
  // entries the audit corrected: english, spelling, binyan, root (and fv); they must stay as they are
  const FIXED = [
    ['blink', 'להבהב', 'pi', 'הבהב'], ['flare', 'להבהב', 'pi', 'הבהב'], ['nod', 'להנהן', 'pi', 'הנהן'], ['hypnotize', 'להפנט', 'pi', 'הפנט'],
    ['complete', 'למלא', 'pi', 'מלא'], ['fill', 'למלא', 'pi', 'מלא'], ['fill in', 'למלא', 'pi', 'מלא'], ['fulfill', 'למלא', 'pi', 'מלא'],
    ['die', 'לגווע', 'pa', 'גוע'], ['expire', 'לגווע', 'pa', 'גוע'], ['yelp', 'לצווח', 'pa', 'צוח'],
    ['earn', 'להרוויח', 'hi', 'רוח'], ['gain', 'להרוויח', 'hi', 'רוח'], ['issue', 'להנפיק', 'hi', 'נפק'], ['produce', 'להפיק', 'hi', 'פוק'],
    ['smell', 'להריח', 'hi', 'ריח'], ['sniff', 'להריח', 'hi', 'ריח'],
    ['infer', 'להסיק', 'hi', 'נסק'], ['thaw', 'להתיך', 'hi', 'נתך'], ['derive', 'להפיק', 'hi', 'פוק'],
    ['edit', 'להגיה', 'hi', 'גיה'], ['lift', 'להגביה', 'hi', 'גבה'], ['heighten', 'להגביה', 'hi', 'גבה'], ['bow', 'להשתחוות', 'hit', 'שחה'],
    ['plug', 'לתקוע', 'pa', 'תקע'], ['tear down', 'לפרק', 'pi', 'פרק'], ['unscrew', 'לפרק', 'pi', 'פרק'], ['topple', 'ליפול', 'pa', 'נפל'],
    ['involve', 'לגעת', 'pa', 'נגע'], ['exhaust', 'לעייף', 'pi', 'עייף'], ['melt', 'להימס', 'ni', 'מסס'],
    ['satisfy', 'להשביע', 'hi', 'שבע'], ['flourish', 'לשגשג', 'pi', 'שגשג'], ['chat', 'לשוחח', 'pi', 'שוחח'],
  ];
  const fixedMissing = FIXED.filter(([english, he, binyan, root]) => !(VERBS[english] || []).some(o => o.he === he && o.binyan === binyan && o.root === root))
    .map(([english, he, binyan, root]) => `${english}: expected ${he} [${binyan}:${root}] among its translations`);
  const many = (title, list) => { if (list.length) failures.push(`${title} (${list.length}):\n    ` + list.join('\n    ')); };
  many('entries the engine cannot read', unreadable);
  many('entries whose infinitive differs from the engine\'s (check binyan, root and fv against the spelling)', mismatches);
  many('malformed script, transliteration or cells', malformed);
  many('roots not written with the last letter in final form and no final form inside', rootForm);
  many('one infinitive spelling with two transliterations', readingClash);
  many('one infinitive spelling conjugated in two different ways', paradigmClash);
  many('one root with two different future vowels (fv)', fvClash);
  many('corrected entries that changed back', fixedMissing);
  checks += 1;
  return translations;
}
checkWellFormedEverywhere();
const translations = checkDatabase();

report.checks += checks;
report.finish(`${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Hebrew translations`, { limit: 80 });
