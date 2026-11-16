// Run with: node test.js .
// Checks the Arabic pattern engine against known paradigms (script AND transliteration), the refusals, and then
// validates every entry of verbs.js: the engine can build it, every cell is well formed, the citation form contains the
// root letters, one script spelling has one transliteration, and the letter count of the script agrees with the
// consonant count of the transliteration on every cell.
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const INTRANSITIVE_FORM_I = new Set('موت نوم كبر وقع ذهب خرج رجع نزل صعد سقط جلس قعد حضر سفر نجح فشل عيش حيي بقي مرض ضحك بكي هرب هبط قدم وقف'.split(' '));
const report = createReport();
const { failures } = report;
let checks = 0;
// expectations are compared in Unicode normal form, so the order in which a shadda and a vowel were typed cannot matter
const nf = x => (typeof x === 'string' ? x.normalize('NFC') : x);
const same = (label, got, want) => { checks += 1; if (nf(got) !== nf(want)) failures.push(`${label}\n    expected: ${want}\n    actual:   ${got}`); };

const SLOTS = ['أنا', 'أنتَ', 'أنتِ', 'هو', 'هي', 'نحن', 'أنتما', 'أنتم', 'أنتنّ', 'هما (m)', 'هما (f)', 'هم', 'هنّ'];
const cellText = c => (c ? `${c.ar}|${c.tr}` : '-');

// "I:كتب:au" -> { form: 'I', root: 'كتب', vowels: 'au' };  "II:درس" -> { form: 'II', root: 'درس' }
function entryOf(spec) {
  const [form, root, vowels] = spec.split(':');
  return { form, root, ...(vowels ? { vowels } : {}) };
}

// ---- Single forms ---------------------------------------------------------------------------
// F(entry, 'citation|transliteration', { 'row.slot': 'script|transliteration' })
// row is one of past pres fut subj juss imp negPast negPres negFut pastPass presPass actPart passPart;
// slot 0-12 = أنا أنتَ أنتِ هو هي نحن أنتما أنتم أنتنّ هما(m) هما(f) هم هنّ.  '-' = the form does not exist.
const FORMS = [];
const F = (entry, citation, forms) => FORMS.push({ entry, citation, forms });

// ---- Whole rows: thirteen cells separated by ' ; ' ---------------------------------------------------
const ROWS = [];
const R = (entry, row, cells) => ROWS.push({ entry, row, cells });
const DASH13 = Array(13).fill('-').join(' ; ');
const ALL13 = cell => Array(13).fill(cell).join(' ; ');

// ======== sound form I ===================================================================
F('I:كتب:au', 'كَتَبَ|kataba', {
  'past.0': 'كَتَبْتُ|katabtu', 'past.1': 'كَتَبْتَ|katabta', 'past.2': 'كَتَبْتِ|katabti', 'past.4': 'كَتَبَتْ|katabat',
  'past.5': 'كَتَبْنَا|katabnā', 'past.6': 'كَتَبْتُمَا|katabtumā', 'past.7': 'كَتَبْتُمْ|katabtum', 'past.8': 'كَتَبْتُنَّ|katabtunna',
  'past.9': 'كَتَبَا|katabā', 'past.10': 'كَتَبَتَا|katabatā', 'past.11': 'كَتَبُوا|katabū', 'past.12': 'كَتَبْنَ|katabna',
  'pres.0': 'أَكْتُبُ|aktubu', 'pres.2': 'تَكْتُبِينَ|taktubīna', 'pres.3': 'يَكْتُبُ|yaktubu', 'pres.6': 'تَكْتُبَانِ|taktubāni',
  'pres.7': 'تَكْتُبُونَ|taktubūna', 'pres.8': 'تَكْتُبْنَ|taktubna', 'pres.9': 'يَكْتُبَانِ|yaktubāni', 'pres.11': 'يَكْتُبُونَ|yaktubūna',
  'fut.0': 'سَأَكْتُبُ|sa-aktubu', 'fut.3': 'سَيَكْتُبُ|sa-yaktubu', 'fut.2': 'سَتَكْتُبِينَ|sa-taktubīna',
  'subj.0': 'أَكْتُبَ|aktuba', 'subj.2': 'تَكْتُبِي|taktubī', 'subj.7': 'تَكْتُبُوا|taktubū', 'subj.6': 'تَكْتُبَا|taktubā',
  'juss.0': 'أَكْتُبْ|aktub', 'juss.3': 'يَكْتُبْ|yaktub', 'juss.8': 'تَكْتُبْنَ|taktubna',
  'imp.0': '-', 'imp.1': 'اُكْتُبْ|uktub', 'imp.2': 'اُكْتُبِي|uktubī', 'imp.3': '-', 'imp.6': 'اُكْتُبَا|uktubā',
  'imp.7': 'اُكْتُبُوا|uktubū', 'imp.8': 'اُكْتُبْنَ|uktubna', 'imp.12': '-',
  'negPast.0': 'لَمْ أَكْتُبْ|lam aktub', 'negPres.0': 'لَا أَكْتُبُ|lā aktubu', 'negFut.0': 'لَنْ أَكْتُبَ|lan aktuba',
  'pastPass.0': 'كُتِبْتُ|kutibtu', 'pastPass.3': 'كُتِبَ|kutiba', 'pastPass.11': 'كُتِبُوا|kutibū', 'pastPass.12': 'كُتِبْنَ|kutibna',
  'presPass.0': 'أُكْتَبُ|uktabu', 'presPass.1': 'تُكْتَبُ|tuktabu', 'presPass.2': 'تُكْتَبِينَ|tuktabīna', 'presPass.3': 'يُكْتَبُ|yuktabu',
  'actPart.0': 'كَاتِبٌ|kātibun', 'actPart.12': 'كَاتِبٌ|kātibun', 'passPart.0': 'مَكْتُوبٌ|maktūbun', 'passPart.7': 'مَكْتُوبٌ|maktūbun',
});
R('I:كتب:au', 'past', 'كَتَبْتُ|katabtu ; كَتَبْتَ|katabta ; كَتَبْتِ|katabti ; كَتَبَ|kataba ; كَتَبَتْ|katabat ; كَتَبْنَا|katabnā ; كَتَبْتُمَا|katabtumā ; كَتَبْتُمْ|katabtum ; كَتَبْتُنَّ|katabtunna ; كَتَبَا|katabā ; كَتَبَتَا|katabatā ; كَتَبُوا|katabū ; كَتَبْنَ|katabna');
R('I:كتب:au', 'pres', 'أَكْتُبُ|aktubu ; تَكْتُبُ|taktubu ; تَكْتُبِينَ|taktubīna ; يَكْتُبُ|yaktubu ; تَكْتُبُ|taktubu ; نَكْتُبُ|naktubu ; تَكْتُبَانِ|taktubāni ; تَكْتُبُونَ|taktubūna ; تَكْتُبْنَ|taktubna ; يَكْتُبَانِ|yaktubāni ; تَكْتُبَانِ|taktubāni ; يَكْتُبُونَ|yaktubūna ; يَكْتُبْنَ|yaktubna');
R('I:كتب:au', 'imp', '- ; اُكْتُبْ|uktub ; اُكْتُبِي|uktubī ; - ; - ; - ; اُكْتُبَا|uktubā ; اُكْتُبُوا|uktubū ; اُكْتُبْنَ|uktubna ; - ; - ; - ; -');
R('I:كتب:au', 'actPart', ALL13('كَاتِبٌ|kātibun'));

// ======== sound form I, every vowel pair =====================================================
F('I:ضرب:ai', 'ضَرَبَ|ḍaraba', {
  'past.0': 'ضَرَبْتُ|ḍarabtu', 'past.11': 'ضَرَبُوا|ḍarabū', 'pres.0': 'أَضْرِبُ|aḍribu', 'pres.3': 'يَضْرِبُ|yaḍribu', 'pres.2': 'تَضْرِبِينَ|taḍribīna',
  'subj.3': 'يَضْرِبَ|yaḍriba', 'juss.3': 'يَضْرِبْ|yaḍrib', 'imp.1': 'اِضْرِبْ|iḍrib', 'imp.2': 'اِضْرِبِي|iḍribī', 'imp.7': 'اِضْرِبُوا|iḍribū',
  'pastPass.3': 'ضُرِبَ|ḍuriba', 'presPass.3': 'يُضْرَبُ|yuḍrabu', 'actPart.0': 'ضَارِبٌ|ḍāribun', 'passPart.0': 'مَضْرُوبٌ|maḍrūbun',
});
F('I:فتح:aa', 'فَتَحَ|fataḥa', {
  'past.0': 'فَتَحْتُ|fataḥtu', 'pres.3': 'يَفْتَحُ|yaftaḥu', 'pres.0': 'أَفْتَحُ|aftaḥu', 'juss.3': 'يَفْتَحْ|yaftaḥ', 'imp.1': 'اِفْتَحْ|iftaḥ',
  'pastPass.3': 'فُتِحَ|futiḥa', 'presPass.3': 'يُفْتَحُ|yuftaḥu', 'actPart.0': 'فَاتِحٌ|fātiḥun', 'passPart.0': 'مَفْتُوحٌ|maftūḥun',
});
F('I:علم:ia', 'عَلِمَ|ʿalima', {
  'past.0': 'عَلِمْتُ|ʿalimtu', 'past.4': 'عَلِمَتْ|ʿalimat', 'pres.3': 'يَعْلَمُ|yaʿlamu', 'pres.1': 'تَعْلَمُ|taʿlamu', 'juss.3': 'يَعْلَمْ|yaʿlam',
  'imp.1': 'اِعْلَمْ|iʿlam', 'pastPass.3': 'عُلِمَ|ʿulima', 'actPart.0': 'عَالِمٌ|ʿālimun', 'passPart.0': 'مَعْلُومٌ|maʿlūmun',
});
F('I:حسب:ii', 'حَسِبَ|ḥasiba', {
  'past.0': 'حَسِبْتُ|ḥasibtu', 'pres.3': 'يَحْسِبُ|yaḥsibu', 'imp.1': 'اِحْسِبْ|iḥsib', 'juss.3': 'يَحْسِبْ|yaḥsib',
});
F('I:حسن:uu', 'حَسُنَ|ḥasuna', {
  'past.0': 'حَسُنْتُ|ḥasuntu', 'past.12': 'حَسُنَّ|ḥasunna', 'pres.3': 'يَحْسُنُ|yaḥsunu', 'imp.1': 'اُحْسُنْ|uḥsun', 'juss.3': 'يَحْسُنْ|yaḥsun',
});
F('I:كبر:uu', 'كَبُرَ|kabura', { 'past.0': 'كَبُرْتُ|kaburtu', 'pres.3': 'يَكْبُرُ|yakburu', 'imp.1': 'اُكْبُرْ|ukbur' });
F('I:ذهب:aa', 'ذَهَبَ|dhahaba', {
  'past.0': 'ذَهَبْتُ|dhahabtu', 'pres.3': 'يَذْهَبُ|yadhhabu', 'pres.0': 'أَذْهَبُ|adhhabu', 'imp.1': 'اِذْهَبْ|idhhab', 'imp.7': 'اِذْهَبُوا|idhhabū',
  'actPart.0': 'ذَاهِبٌ|dhāhibun',
});
F('I:شرب:ia', 'شَرِبَ|shariba', { 'past.0': 'شَرِبْتُ|sharibtu', 'pres.3': 'يَشْرَبُ|yashrabu', 'imp.1': 'اِشْرَبْ|ishrab', 'actPart.0': 'شَارِبٌ|shāribun' });
F('I:جلس:ai', 'جَلَسَ|jalasa', { 'past.0': 'جَلَسْتُ|jalastu', 'pres.3': 'يَجْلِسُ|yajlisu', 'imp.1': 'اِجْلِسْ|ijlis', 'imp.2': 'اِجْلِسِي|ijlisī' });
F('I:دخل:au', 'دَخَلَ|dakhala', { 'past.0': 'دَخَلْتُ|dakhaltu', 'pres.3': 'يَدْخُلُ|yadkhulu', 'imp.1': 'اُدْخُلْ|udkhul', 'imp.7': 'اُدْخُلُوا|udkhulū', 'actPart.0': 'دَاخِلٌ|dākhilun' });
F('I:خرج:au', 'خَرَجَ|kharaja', { 'past.0': 'خَرَجْتُ|kharajtu', 'pres.3': 'يَخْرُجُ|yakhruju', 'imp.1': 'اُخْرُجْ|ukhruj', 'imp.8': 'اُخْرُجْنَ|ukhrujna', 'actPart.0': 'خَارِجٌ|khārijun' });
F('I:فهم:ia', 'فَهِمَ|fahima', { 'past.0': 'فَهِمْتُ|fahimtu', 'pres.3': 'يَفْهَمُ|yafhamu', 'imp.1': 'اِفْهَمْ|ifham', 'passPart.0': 'مَفْهُومٌ|mafhūmun' });
F('I:سمع:ia', 'سَمِعَ|samiʿa', { 'past.0': 'سَمِعْتُ|samiʿtu', 'pres.3': 'يَسْمَعُ|yasmaʿu', 'imp.1': 'اِسْمَعْ|ismaʿ', 'actPart.0': 'سَامِعٌ|sāmiʿun' });
F('I:ركب:ia', 'رَكِبَ|rakiba', { 'past.0': 'رَكِبْتُ|rakibtu', 'pres.3': 'يَرْكَبُ|yarkabu', 'imp.1': 'اِرْكَبْ|irkab' });
F('I:قرب:uu', 'قَرُبَ|qaruba', { 'past.0': 'قَرُبْتُ|qarubtu', 'pres.3': 'يَقْرُبُ|yaqrubu', 'imp.1': 'اُقْرُبْ|uqrub' });
F('I:نصر:au', 'نَصَرَ|naṣara', { 'past.0': 'نَصَرْتُ|naṣartu', 'pres.3': 'يَنْصُرُ|yanṣuru', 'imp.1': 'اُنْصُرْ|unṣur', 'actPart.0': 'نَاصِرٌ|nāṣirun', 'passPart.0': 'مَنْصُورٌ|manṣūrun' });
F('I:رسم:au', 'رَسَمَ|rasama', { 'past.5': 'رَسَمْنَا|rasamnā', 'pres.5': 'نَرْسُمُ|narsumu', 'subj.5': 'نَرْسُمَ|narsuma', 'negPast.5': 'لَمْ نَرْسُمْ|lam narsum', 'negFut.5': 'لَنْ نَرْسُمَ|lan narsuma', 'fut.5': 'سَنَرْسُمُ|sa-narsumu' });

// ======== derived forms, sound roots =======================================================
F('II:درس', 'دَرَّسَ|darrasa', {
  'past.0': 'دَرَّسْتُ|darrastu', 'past.11': 'دَرَّسُوا|darrasū', 'pres.0': 'أُدَرِّسُ|udarrisu', 'pres.3': 'يُدَرِّسُ|yudarrisu', 'pres.2': 'تُدَرِّسِينَ|tudarrisīna',
  'juss.3': 'يُدَرِّسْ|yudarris', 'imp.1': 'دَرِّسْ|darris', 'imp.7': 'دَرِّسُوا|darrisū', 'pastPass.3': 'دُرِّسَ|durrisa', 'presPass.3': 'يُدَرَّسُ|yudarrasu',
  'actPart.0': 'مُدَرِّسٌ|mudarrisun', 'passPart.0': 'مُدَرَّسٌ|mudarrasun',
});
F('II:كسر', 'كَسَّرَ|kassara', { 'past.0': 'كَسَّرْتُ|kassartu', 'pres.3': 'يُكَسِّرُ|yukassiru', 'imp.1': 'كَسِّرْ|kassir', 'actPart.0': 'مُكَسِّرٌ|mukassirun' });
F('II:علم', 'عَلَّمَ|ʿallama', { 'past.0': 'عَلَّمْتُ|ʿallamtu', 'pres.3': 'يُعَلِّمُ|yuʿallimu', 'imp.1': 'عَلِّمْ|ʿallim', 'actPart.0': 'مُعَلِّمٌ|muʿallimun', 'pastPass.3': 'عُلِّمَ|ʿullima' });
F('III:سعد', 'سَاعَدَ|sāʿada', {
  'past.0': 'سَاعَدْتُ|sāʿadtu', 'past.4': 'سَاعَدَتْ|sāʿadat', 'pres.0': 'أُسَاعِدُ|usāʿidu', 'pres.3': 'يُسَاعِدُ|yusāʿidu', 'juss.3': 'يُسَاعِدْ|yusāʿid',
  'imp.1': 'سَاعِدْ|sāʿid', 'imp.2': 'سَاعِدِي|sāʿidī', 'pastPass.3': 'سُوعِدَ|sūʿida', 'presPass.3': 'يُسَاعَدُ|yusāʿadu', 'actPart.0': 'مُسَاعِدٌ|musāʿidun', 'passPart.0': 'مُسَاعَدٌ|musāʿadun',
});
F('III:قتل', 'قَاتَلَ|qātala', { 'past.0': 'قَاتَلْتُ|qātaltu', 'pres.3': 'يُقَاتِلُ|yuqātilu', 'imp.1': 'قَاتِلْ|qātil', 'actPart.0': 'مُقَاتِلٌ|muqātilun' });
F('IV:رسل', 'أَرْسَلَ|arsala', {
  'past.0': 'أَرْسَلْتُ|arsaltu', 'pres.0': 'أُرْسِلُ|ursilu', 'pres.3': 'يُرْسِلُ|yursilu', 'juss.3': 'يُرْسِلْ|yursil', 'imp.1': 'أَرْسِلْ|arsil', 'imp.2': 'أَرْسِلِي|arsilī',
  'pastPass.3': 'أُرْسِلَ|ursila', 'presPass.3': 'يُرْسَلُ|yursalu', 'actPart.0': 'مُرْسِلٌ|mursilun', 'passPart.0': 'مُرْسَلٌ|mursalun',
});
F('IV:خرج', 'أَخْرَجَ|akhraja', { 'past.0': 'أَخْرَجْتُ|akhrajtu', 'pres.3': 'يُخْرِجُ|yukhriju', 'imp.1': 'أَخْرِجْ|akhrij', 'actPart.0': 'مُخْرِجٌ|mukhrijun' });
F('V:علم', 'تَعَلَّمَ|taʿallama', {
  'past.0': 'تَعَلَّمْتُ|taʿallamtu', 'pres.0': 'أَتَعَلَّمُ|ataʿallamu', 'pres.3': 'يَتَعَلَّمُ|yataʿallamu', 'juss.3': 'يَتَعَلَّمْ|yataʿallam', 'imp.1': 'تَعَلَّمْ|taʿallam',
  'pastPass.3': 'تُعُلِّمَ|tuʿullima', 'presPass.3': 'يُتَعَلَّمُ|yutaʿallamu', 'actPart.0': 'مُتَعَلِّمٌ|mutaʿallimun', 'passPart.0': 'مُتَعَلَّمٌ|mutaʿallamun',
});
F('V:كلم', 'تَكَلَّمَ|takallama', { 'past.0': 'تَكَلَّمْتُ|takallamtu', 'pres.3': 'يَتَكَلَّمُ|yatakallamu', 'imp.1': 'تَكَلَّمْ|takallam', 'actPart.0': 'مُتَكَلِّمٌ|mutakallimun' });
F('VI:كتب', 'تَكَاتَبَ|takātaba', {
  'past.0': 'تَكَاتَبْتُ|takātabtu', 'pres.3': 'يَتَكَاتَبُ|yatakātabu', 'imp.1': 'تَكَاتَبْ|takātab', 'pastPass.3': 'تُكُوتِبَ|tukūtiba', 'actPart.0': 'مُتَكَاتِبٌ|mutakātibun',
});
F('VI:عون', 'تَعَاوَنَ|taʿāwana', { 'past.0': 'تَعَاوَنْتُ|taʿāwantu', 'pres.3': 'يَتَعَاوَنُ|yataʿāwanu', 'imp.1': 'تَعَاوَنْ|taʿāwan', 'actPart.0': 'مُتَعَاوِنٌ|mutaʿāwinun' });
F('VII:كسر', 'اِنْكَسَرَ|inkasara', {
  'past.0': 'اِنْكَسَرْتُ|inkasartu', 'past.4': 'اِنْكَسَرَتْ|inkasarat', 'pres.0': 'أَنْكَسِرُ|ankasiru', 'pres.3': 'يَنْكَسِرُ|yankasiru', 'juss.3': 'يَنْكَسِرْ|yankasir',
  'imp.1': 'اِنْكَسِرْ|inkasir', 'pastPass.3': '-', 'presPass.3': '-', 'actPart.0': 'مُنْكَسِرٌ|munkasirun', 'passPart.0': '-',
});
F('VII:فتح', 'اِنْفَتَحَ|infataḥa', { 'past.0': 'اِنْفَتَحْتُ|infataḥtu', 'pres.3': 'يَنْفَتِحُ|yanfatiḥu', 'imp.1': 'اِنْفَتِحْ|infatiḥ', 'actPart.0': 'مُنْفَتِحٌ|munfatiḥun' });
F('VIII:جمع', 'اِجْتَمَعَ|ijtamaʿa', {
  'past.0': 'اِجْتَمَعْتُ|ijtamaʿtu', 'pres.0': 'أَجْتَمِعُ|ajtamiʿu', 'pres.3': 'يَجْتَمِعُ|yajtamiʿu', 'juss.3': 'يَجْتَمِعْ|yajtamiʿ', 'imp.1': 'اِجْتَمِعْ|ijtamiʿ',
  'pastPass.3': 'اُجْتُمِعَ|ujtumiʿa', 'presPass.3': 'يُجْتَمَعُ|yujtamaʿu', 'actPart.0': 'مُجْتَمِعٌ|mujtamiʿun', 'passPart.0': 'مُجْتَمَعٌ|mujtamaʿun',
});
F('VIII:نظر', 'اِنْتَظَرَ|intaẓara', { 'past.0': 'اِنْتَظَرْتُ|intaẓartu', 'pres.3': 'يَنْتَظِرُ|yantaẓiru', 'imp.1': 'اِنْتَظِرْ|intaẓir', 'actPart.0': 'مُنْتَظِرٌ|muntaẓirun', 'passPart.0': 'مُنْتَظَرٌ|muntaẓarun' });
F('VIII:كتب', 'اِكْتَتَبَ|iktataba', { 'past.0': 'اِكْتَتَبْتُ|iktatabtu', 'pres.3': 'يَكْتَتِبُ|yaktatibu' });
F('IX:حمر', 'اِحْمَرَّ|iḥmarra', {
  'past.0': 'اِحْمَرَرْتُ|iḥmarartu', 'past.4': 'اِحْمَرَّتْ|iḥmarrat', 'past.11': 'اِحْمَرُّوا|iḥmarrū', 'past.12': 'اِحْمَرَرْنَ|iḥmararna',
  'pres.3': 'يَحْمَرُّ|yaḥmarru', 'pres.12': 'يَحْمَرِرْنَ|yaḥmarirna', 'juss.3': 'يَحْمَرَّ|yaḥmarra', 'imp.1': 'اِحْمَرَّ|iḥmarra', 'imp.2': 'اِحْمَرِّي|iḥmarrī',
  'pastPass.3': '-', 'presPass.3': '-', 'actPart.0': 'مُحْمَرٌّ|muḥmarrun', 'passPart.0': '-',
});
F('IX:خضر', 'اِخْضَرَّ|ikhḍarra', { 'past.0': 'اِخْضَرَرْتُ|ikhḍarartu', 'pres.3': 'يَخْضَرُّ|yakhḍarru' });
F('IX:بيض', 'اِبْيَضَّ|ibyaḍḍa', { 'past.0': 'اِبْيَضَضْتُ|ibyaḍaḍtu', 'pres.3': 'يَبْيَضُّ|yabyaḍḍu', 'imp.1': 'اِبْيَضَّ|ibyaḍḍa' });
F('IX:سود', 'اِسْوَدَّ|iswadda', { 'past.0': 'اِسْوَدَدْتُ|iswadadtu', 'pres.3': 'يَسْوَدُّ|yaswaddu' });
F('X:خدم', 'اِسْتَخْدَمَ|istakhdama', {
  'past.0': 'اِسْتَخْدَمْتُ|istakhdamtu', 'pres.0': 'أَسْتَخْدِمُ|astakhdimu', 'pres.3': 'يَسْتَخْدِمُ|yastakhdimu', 'juss.3': 'يَسْتَخْدِمْ|yastakhdim', 'imp.1': 'اِسْتَخْدِمْ|istakhdim',
  'pastPass.3': 'اُسْتُخْدِمَ|ustukhdima', 'presPass.3': 'يُسْتَخْدَمُ|yustakhdamu', 'actPart.0': 'مُسْتَخْدِمٌ|mustakhdimun', 'passPart.0': 'مُسْتَخْدَمٌ|mustakhdamun',
});
F('X:عمل', 'اِسْتَعْمَلَ|istaʿmala', { 'past.0': 'اِسْتَعْمَلْتُ|istaʿmaltu', 'pres.3': 'يَسْتَعْمِلُ|yastaʿmilu', 'imp.1': 'اِسْتَعْمِلْ|istaʿmil', 'passPart.0': 'مُسْتَعْمَلٌ|mustaʿmalun' });
F('X:قبل', 'اِسْتَقْبَلَ|istaqbala', { 'past.0': 'اِسْتَقْبَلْتُ|istaqbaltu', 'pres.3': 'يَسْتَقْبِلُ|yastaqbilu', 'actPart.0': 'مُسْتَقْبِلٌ|mustaqbilun' });
F('Q1:ترجم', 'تَرْجَمَ|tarjama', {
  'past.0': 'تَرْجَمْتُ|tarjamtu', 'pres.0': 'أُتَرْجِمُ|utarjimu', 'pres.3': 'يُتَرْجِمُ|yutarjimu', 'juss.3': 'يُتَرْجِمْ|yutarjim', 'imp.1': 'تَرْجِمْ|tarjim',
  'pastPass.3': 'تُرْجِمَ|turjima', 'presPass.3': 'يُتَرْجَمُ|yutarjamu', 'actPart.0': 'مُتَرْجِمٌ|mutarjimun', 'passPart.0': 'مُتَرْجَمٌ|mutarjamun',
});
F('Q1:دحرج', 'دَحْرَجَ|daḥraja', { 'past.0': 'دَحْرَجْتُ|daḥrajtu', 'pres.3': 'يُدَحْرِجُ|yudaḥriju', 'imp.1': 'دَحْرِجْ|daḥrij' });
F('Q1:زلزل', 'زَلْزَلَ|zalzala', { 'past.0': 'زَلْزَلْتُ|zalzaltu', 'pres.3': 'يُزَلْزِلُ|yuzalzilu', 'actPart.0': 'مُزَلْزِلٌ|muzalzilun' });
F('Q2:دحرج', 'تَدَحْرَجَ|tadaḥraja', {
  'past.0': 'تَدَحْرَجْتُ|tadaḥrajtu', 'pres.3': 'يَتَدَحْرَجُ|yatadaḥraju', 'juss.3': 'يَتَدَحْرَجْ|yatadaḥraj', 'imp.1': 'تَدَحْرَجْ|tadaḥraj',
  'actPart.0': 'مُتَدَحْرِجٌ|mutadaḥrijun', 'passPart.0': 'مُتَدَحْرَجٌ|mutadaḥrajun',
});
F('Q2:ترجم', 'تَتَرْجَمَ|tatarjama', { 'past.3': 'تَتَرْجَمَ|tatarjama', 'pres.3': 'يَتَتَرْجَمُ|yatatarjamu' });

// ======== hamzated roots ====================================================================
F('I:ءكل:au', 'أَكَلَ|akala', {
  'past.0': 'أَكَلْتُ|akaltu', 'past.11': 'أَكَلُوا|akalū', 'pres.0': 'آكُلُ|ākulu', 'pres.1': 'تَأْكُلُ|taʾkulu', 'pres.3': 'يَأْكُلُ|yaʾkulu', 'pres.2': 'تَأْكُلِينَ|taʾkulīna',
  'subj.3': 'يَأْكُلَ|yaʾkula', 'juss.3': 'يَأْكُلْ|yaʾkul', 'juss.0': 'آكُلْ|ākul', 'imp.1': 'كُلْ|kul', 'imp.2': 'كُلِي|kulī', 'imp.6': 'كُلَا|kulā', 'imp.7': 'كُلُوا|kulū', 'imp.8': 'كُلْنَ|kulna',
  'pastPass.3': 'أُكِلَ|ukila', 'presPass.3': 'يُؤْكَلُ|yuʾkalu', 'presPass.0': 'أُوكَلُ|ūkalu', 'actPart.0': 'آكِلٌ|ākilun', 'passPart.0': 'مَأْكُولٌ|maʾkūlun',
  'fut.0': 'سَآكُلُ|sa-ākulu', 'negPres.0': 'لَا آكُلُ|lā ākulu',
});
F('I:ءخذ:au', 'أَخَذَ|akhadha', { 'past.0': 'أَخَذْتُ|akhadhtu', 'pres.0': 'آخُذُ|ākhudhu', 'pres.3': 'يَأْخُذُ|yaʾkhudhu', 'imp.1': 'خُذْ|khudh', 'imp.2': 'خُذِي|khudhī', 'pastPass.3': 'أُخِذَ|ukhidha', 'actPart.0': 'آخِذٌ|ākhidhun', 'passPart.0': 'مَأْخُوذٌ|maʾkhūdhun' });
F('I:ءمر:au', 'أَمَرَ|amara', { 'past.0': 'أَمَرْتُ|amartu', 'pres.0': 'آمُرُ|āmuru', 'pres.3': 'يَأْمُرُ|yaʾmuru', 'imp.1': 'مُرْ|mur', 'imp.7': 'مُرُوا|murū', 'actPart.0': 'آمِرٌ|āmirun', 'passPart.0': 'مَأْمُورٌ|maʾmūrun' });
F('I:ءذن:ia', 'أَذِنَ|adhina', { 'past.0': 'أَذِنْتُ|adhintu', 'pres.3': 'يَأْذَنُ|yaʾdhanu', 'imp.1': 'اِئْذَنْ|iʾdhan', 'imp.2': 'اِئْذَنِي|iʾdhanī' });
F('I:ءمن:ia', 'أَمِنَ|amina', { 'past.0': 'أَمِنْتُ|amintu', 'pres.3': 'يَأْمَنُ|yaʾmanu', 'imp.1': 'اِئْمَنْ|iʾman' });
F('I:سءل:aa', 'سَأَلَ|saʾala', {
  'past.0': 'سَأَلْتُ|saʾaltu', 'past.11': 'سَأَلُوا|saʾalū', 'pres.0': 'أَسْأَلُ|asʾalu', 'pres.3': 'يَسْأَلُ|yasʾalu', 'pres.2': 'تَسْأَلِينَ|tasʾalīna', 'juss.3': 'يَسْأَلْ|yasʾal',
  'imp.1': 'اِسْأَلْ|isʾal', 'pastPass.3': 'سُئِلَ|suʾila', 'pastPass.0': 'سُئِلْتُ|suʾiltu', 'presPass.3': 'يُسْأَلُ|yusʾalu', 'actPart.0': 'سَائِلٌ|sāʾilun', 'passPart.0': 'مَسْؤُولٌ|masʾūlun',
});
F('I:سءم:ia', 'سَئِمَ|saʾima', { 'past.0': 'سَئِمْتُ|saʾimtu', 'pres.3': 'يَسْأَمُ|yasʾamu' });
F('I:قرء:aa', 'قَرَأَ|qaraʾa', {
  'past.0': 'قَرَأْتُ|qaraʾtu', 'past.4': 'قَرَأَتْ|qaraʾat', 'past.9': 'قَرَآ|qaraʾā', 'past.11': 'قَرَؤُوا|qaraʾū', 'pres.0': 'أَقْرَأُ|aqraʾu', 'pres.2': 'تَقْرَئِينَ|taqraʾīna',
  'pres.6': 'تَقْرَآنِ|taqraʾāni', 'pres.7': 'تَقْرَؤُونَ|taqraʾūna', 'pres.8': 'تَقْرَأْنَ|taqraʾna', 'subj.3': 'يَقْرَأَ|yaqraʾa', 'subj.2': 'تَقْرَئِي|taqraʾī', 'juss.3': 'يَقْرَأْ|yaqraʾ',
  'imp.1': 'اِقْرَأْ|iqraʾ', 'imp.2': 'اِقْرَئِي|iqraʾī', 'imp.7': 'اِقْرَؤُوا|iqraʾū', 'pastPass.3': 'قُرِئَ|quriʾa', 'presPass.3': 'يُقْرَأُ|yuqraʾu', 'actPart.0': 'قَارِئٌ|qāriʾun', 'passPart.0': 'مَقْرُوءٌ|maqrūʾun',
});
F('I:بدء:aa', 'بَدَأَ|badaʾa', { 'past.0': 'بَدَأْتُ|badaʾtu', 'pres.3': 'يَبْدَأُ|yabdaʾu', 'imp.1': 'اِبْدَأْ|ibdaʾ', 'actPart.0': 'بَادِئٌ|bādiʾun' });
F('I:ملء:aa', 'مَلَأَ|malaʾa', { 'past.0': 'مَلَأْتُ|malaʾtu', 'pres.3': 'يَمْلَأُ|yamlaʾu', 'imp.1': 'اِمْلَأْ|imlaʾ', 'imp.2': 'اِمْلَئِي|imlaʾī' });
F('I:جرء:uu', 'جَرُؤَ|jaruʾa', { 'past.0': 'جَرُؤْتُ|jaruʾtu', 'pres.3': 'يَجْرُؤُ|yajruʾu', 'juss.3': 'يَجْرُؤْ|yajruʾ' });
F('II:ءكد', 'أَكَّدَ|akkada', { 'past.0': 'أَكَّدْتُ|akkadtu', 'pres.0': 'أُؤَكِّدُ|uʾakkidu', 'pres.3': 'يُؤَكِّدُ|yuʾakkidu', 'imp.1': 'أَكِّدْ|akkid', 'actPart.0': 'مُؤَكِّدٌ|muʾakkidun', 'passPart.0': 'مُؤَكَّدٌ|muʾakkadun' });
F('II:ءخر', 'أَخَّرَ|akhkhara', { 'past.0': 'أَخَّرْتُ|akhkhartu', 'pres.3': 'يُؤَخِّرُ|yuʾakhkhiru' });
F('III:ءمر', 'آمَرَ|āmara', { 'past.0': 'آمَرْتُ|āmartu', 'pres.0': 'أُؤَامِرُ|uʾāmiru', 'pres.3': 'يُؤَامِرُ|yuʾāmiru' });
F('IV:ءمن', 'آمَنَ|āmana', {
  'past.0': 'آمَنْتُ|āmantu', 'past.11': 'آمَنُوا|āmanū', 'pres.0': 'أُومِنُ|ūminu', 'pres.3': 'يُؤْمِنُ|yuʾminu', 'juss.3': 'يُؤْمِنْ|yuʾmin', 'imp.1': 'آمِنْ|āmin',
  'pastPass.3': 'أُومِنَ|ūmina', 'presPass.3': 'يُؤْمَنُ|yuʾmanu', 'actPart.0': 'مُؤْمِنٌ|muʾminun', 'passPart.0': 'مُؤْمَنٌ|muʾmanun',
});
F('IV:ءخر', 'آخَرَ|ākhara', { 'past.0': 'آخَرْتُ|ākhartu', 'pres.3': 'يُؤْخِرُ|yuʾkhiru' });
F('V:ءخر', 'تَأَخَّرَ|taʾakhkhara', { 'past.0': 'تَأَخَّرْتُ|taʾakhkhartu', 'pres.3': 'يَتَأَخَّرُ|yataʾakhkharu', 'imp.1': 'تَأَخَّرْ|taʾakhkhar', 'actPart.0': 'مُتَأَخِّرٌ|mutaʾakhkhirun' });
F('V:ءكد', 'تَأَكَّدَ|taʾakkada', { 'past.0': 'تَأَكَّدْتُ|taʾakkadtu', 'pres.3': 'يَتَأَكَّدُ|yataʾakkadu' });
F('VI:ءخذ', 'تَآخَذَ|taʾākhadha', { 'past.0': 'تَآخَذْتُ|taʾākhadhtu', 'pres.3': 'يَتَآخَذُ|yataʾākhadhu' });
F('VIII:ءخذ', 'اِتَّخَذَ|ittakhadha', {
  'past.0': 'اِتَّخَذْتُ|ittakhadhtu', 'pres.0': 'أَتَّخِذُ|attakhidhu', 'pres.3': 'يَتَّخِذُ|yattakhidhu', 'imp.1': 'اِتَّخِذْ|ittakhidh', 'pastPass.3': 'اُتُّخِذَ|uttukhidha',
  'actPart.0': 'مُتَّخِذٌ|muttakhidhun', 'passPart.0': 'مُتَّخَذٌ|muttakhadhun',
});
F('VIII:ءمر', 'اِئْتَمَرَ|iʾtamara', { 'past.0': 'اِئْتَمَرْتُ|iʾtamartu', 'pres.0': 'آتَمِرُ|ātamiru', 'pres.3': 'يَأْتَمِرُ|yaʾtamiru', 'imp.1': 'اِئْتَمِرْ|iʾtamir' });
F('X:ءذن', 'اِسْتَأْذَنَ|istaʾdhana', { 'past.0': 'اِسْتَأْذَنْتُ|istaʾdhantu', 'pres.3': 'يَسْتَأْذِنُ|yastaʾdhinu', 'imp.1': 'اِسْتَأْذِنْ|istaʾdhin', 'actPart.0': 'مُسْتَأْذِنٌ|mustaʾdhinun' });
F('X:ءجر', 'اِسْتَأْجَرَ|istaʾjara', { 'past.0': 'اِسْتَأْجَرْتُ|istaʾjartu', 'pres.3': 'يَسْتَأْجِرُ|yastaʾjiru', 'passPart.0': 'مُسْتَأْجَرٌ|mustaʾjarun' });

// ======== assimilated roots (first letter و) ===================================================
F('I:وصل:ai', 'وَصَلَ|waṣala', {
  'past.0': 'وَصَلْتُ|waṣaltu', 'pres.0': 'أَصِلُ|aṣilu', 'pres.3': 'يَصِلُ|yaṣilu', 'pres.2': 'تَصِلِينَ|taṣilīna', 'juss.3': 'يَصِلْ|yaṣil', 'subj.3': 'يَصِلَ|yaṣila',
  'imp.1': 'صِلْ|ṣil', 'imp.2': 'صِلِي|ṣilī', 'imp.7': 'صِلُوا|ṣilū', 'imp.8': 'صِلْنَ|ṣilna', 'pastPass.3': 'وُصِلَ|wuṣila', 'presPass.3': 'يُوصَلُ|yūṣalu', 'presPass.0': 'أُوصَلُ|ūṣalu',
  'actPart.0': 'وَاصِلٌ|wāṣilun', 'passPart.0': 'مَوْصُولٌ|mawṣūlun',
});
F('I:وجد:ai', 'وَجَدَ|wajada', { 'past.0': 'وَجَدْتُ|wajadtu', 'pres.3': 'يَجِدُ|yajidu', 'juss.3': 'يَجِدْ|yajid', 'imp.1': 'جِدْ|jid', 'passPart.0': 'مَوْجُودٌ|mawjūdun', 'actPart.0': 'وَاجِدٌ|wājidun' });
F('I:وقف:ai', 'وَقَفَ|waqafa', { 'past.0': 'وَقَفْتُ|waqaftu', 'pres.3': 'يَقِفُ|yaqifu', 'imp.1': 'قِفْ|qif', 'actPart.0': 'وَاقِفٌ|wāqifun' });
F('I:وضع:aa', 'وَضَعَ|waḍaʿa', { 'past.0': 'وَضَعْتُ|waḍaʿtu', 'pres.3': 'يَضَعُ|yaḍaʿu', 'juss.3': 'يَضَعْ|yaḍaʿ', 'imp.1': 'ضَعْ|ḍaʿ', 'imp.2': 'ضَعِي|ḍaʿī', 'passPart.0': 'مَوْضُوعٌ|mawḍūʿun' });
F('I:وعد:ai', 'وَعَدَ|waʿada', { 'past.0': 'وَعَدْتُ|waʿadtu', 'pres.3': 'يَعِدُ|yaʿidu', 'imp.1': 'عِدْ|ʿid', 'passPart.0': 'مَوْعُودٌ|mawʿūdun' });
F('I:ولد:ai', 'وَلَدَ|walada', { 'past.0': 'وَلَدْتُ|waladtu', 'pres.3': 'يَلِدُ|yalidu', 'pastPass.3': 'وُلِدَ|wulida', 'actPart.0': 'وَالِدٌ|wālidun' });
F('I:وقع:aa', 'وَقَعَ|waqaʿa', { 'past.0': 'وَقَعْتُ|waqaʿtu', 'pres.3': 'يَقَعُ|yaqaʿu', 'imp.1': 'قَعْ|qaʿ' });
F('I:وهب:aa', 'وَهَبَ|wahaba', { 'pres.3': 'يَهَبُ|yahabu', 'imp.1': 'هَبْ|hab' });
F('I:ورث:ii', 'وَرِثَ|waritha', { 'past.0': 'وَرِثْتُ|warithtu', 'pres.3': 'يَرِثُ|yarithu', 'imp.1': 'رِثْ|rith' });
F('I:وسع:ia', 'وَسِعَ|wasiʿa', { 'past.0': 'وَسِعْتُ|wasiʿtu', 'pres.3': 'يَسَعُ|yasaʿu' });
F('I:وجل:ia', 'وَجِلَ|wajila', { 'past.0': 'وَجِلْتُ|wajiltu', 'pres.3': 'يَوْجَلُ|yawjalu', 'pres.0': 'أَوْجَلُ|awjalu', 'imp.1': 'اِيجَلْ|ījal' });
F('I:وزن:ai', 'وَزَنَ|wazana', { 'past.0': 'وَزَنْتُ|wazantu', 'pres.3': 'يَزِنُ|yazinu', 'imp.1': 'زِنْ|zin' });
F('II:وصل', 'وَصَّلَ|waṣṣala', { 'past.0': 'وَصَّلْتُ|waṣṣaltu', 'pres.0': 'أُوَصِّلُ|uwaṣṣilu', 'pres.3': 'يُوَصِّلُ|yuwaṣṣilu', 'imp.1': 'وَصِّلْ|waṣṣil', 'actPart.0': 'مُوَصِّلٌ|muwaṣṣilun', 'passPart.0': 'مُوَصَّلٌ|muwaṣṣalun' });
F('III:وصل', 'وَاصَلَ|wāṣala', { 'past.0': 'وَاصَلْتُ|wāṣaltu', 'pres.3': 'يُوَاصِلُ|yuwāṣilu', 'imp.1': 'وَاصِلْ|wāṣil', 'actPart.0': 'مُوَاصِلٌ|muwāṣilun' });
F('IV:وصل', 'أَوْصَلَ|awṣala', {
  'past.0': 'أَوْصَلْتُ|awṣaltu', 'pres.0': 'أُوصِلُ|ūṣilu', 'pres.3': 'يُوصِلُ|yūṣilu', 'juss.3': 'يُوصِلْ|yūṣil', 'imp.1': 'أَوْصِلْ|awṣil',
  'pastPass.3': 'أُوصِلَ|ūṣila', 'presPass.3': 'يُوصَلُ|yūṣalu', 'actPart.0': 'مُوصِلٌ|mūṣilun', 'passPart.0': 'مُوصَلٌ|mūṣalun',
});
F('IV:يقن', 'أَيْقَنَ|ayqana', { 'past.0': 'أَيْقَنْتُ|ayqantu', 'pres.3': 'يُوقِنُ|yūqinu', 'actPart.0': 'مُوقِنٌ|mūqinun' });
F('V:وقف', 'تَوَقَّفَ|tawaqqafa', { 'past.0': 'تَوَقَّفْتُ|tawaqqaftu', 'pres.3': 'يَتَوَقَّفُ|yatawaqqafu', 'imp.1': 'تَوَقَّفْ|tawaqqaf', 'actPart.0': 'مُتَوَقِّفٌ|mutawaqqifun' });
F('VI:وصل', 'تَوَاصَلَ|tawāṣala', { 'past.0': 'تَوَاصَلْتُ|tawāṣaltu', 'pres.3': 'يَتَوَاصَلُ|yatawāṣalu', 'actPart.0': 'مُتَوَاصِلٌ|mutawāṣilun' });
F('VIII:وصل', 'اِتَّصَلَ|ittaṣala', {
  'past.0': 'اِتَّصَلْتُ|ittaṣaltu', 'pres.0': 'أَتَّصِلُ|attaṣilu', 'pres.3': 'يَتَّصِلُ|yattaṣilu', 'juss.3': 'يَتَّصِلْ|yattaṣil', 'imp.1': 'اِتَّصِلْ|ittaṣil',
  'pastPass.3': 'اُتُّصِلَ|uttuṣila', 'presPass.3': 'يُتَّصَلُ|yuttaṣalu', 'actPart.0': 'مُتَّصِلٌ|muttaṣilun', 'passPart.0': 'مُتَّصَلٌ|muttaṣalun',
});
F('VIII:وحد', 'اِتَّحَدَ|ittaḥada', { 'past.0': 'اِتَّحَدْتُ|ittaḥadtu', 'pres.3': 'يَتَّحِدُ|yattaḥidu', 'actPart.0': 'مُتَّحِدٌ|muttaḥidun' });
F('VIII:وفق', 'اِتَّفَقَ|ittafaqa', { 'past.0': 'اِتَّفَقْتُ|ittafaqtu', 'pres.3': 'يَتَّفِقُ|yattafiqu' });
F('X:وضح', 'اِسْتَوْضَحَ|istawḍaḥa', { 'past.0': 'اِسْتَوْضَحْتُ|istawḍaḥtu', 'pres.3': 'يَسْتَوْضِحُ|yastawḍiḥu', 'imp.1': 'اِسْتَوْضِحْ|istawḍiḥ' });

// ======== hollow roots (second letter و or ي) ====================================================
F('I:قول:au', 'قَالَ|qāla', {
  'past.0': 'قُلْتُ|qultu', 'past.1': 'قُلْتَ|qulta', 'past.2': 'قُلْتِ|qulti', 'past.4': 'قَالَتْ|qālat', 'past.5': 'قُلْنَا|qulnā', 'past.6': 'قُلْتُمَا|qultumā',
  'past.7': 'قُلْتُمْ|qultum', 'past.8': 'قُلْتُنَّ|qultunna', 'past.9': 'قَالَا|qālā', 'past.10': 'قَالَتَا|qālatā', 'past.11': 'قَالُوا|qālū', 'past.12': 'قُلْنَ|qulna',
  'pres.0': 'أَقُولُ|aqūlu', 'pres.2': 'تَقُولِينَ|taqūlīna', 'pres.3': 'يَقُولُ|yaqūlu', 'pres.6': 'تَقُولَانِ|taqūlāni', 'pres.7': 'تَقُولُونَ|taqūlūna',
  'pres.8': 'تَقُلْنَ|taqulna', 'pres.12': 'يَقُلْنَ|yaqulna', 'fut.3': 'سَيَقُولُ|sa-yaqūlu', 'fut.8': 'سَتَقُلْنَ|sa-taqulna',
  'subj.0': 'أَقُولَ|aqūla', 'subj.2': 'تَقُولِي|taqūlī', 'subj.7': 'تَقُولُوا|taqūlū', 'subj.8': 'تَقُلْنَ|taqulna',
  'juss.0': 'أَقُلْ|aqul', 'juss.3': 'يَقُلْ|yaqul', 'juss.2': 'تَقُولِي|taqūlī', 'juss.7': 'تَقُولُوا|taqūlū', 'juss.6': 'تَقُولَا|taqūlā', 'juss.12': 'يَقُلْنَ|yaqulna',
  'imp.1': 'قُلْ|qul', 'imp.2': 'قُولِي|qūlī', 'imp.6': 'قُولَا|qūlā', 'imp.7': 'قُولُوا|qūlū', 'imp.8': 'قُلْنَ|qulna',
  'negPast.3': 'لَمْ يَقُلْ|lam yaqul', 'negPres.0': 'لَا أَقُولُ|lā aqūlu', 'negFut.3': 'لَنْ يَقُولَ|lan yaqūla',
  'pastPass.0': 'قِلْتُ|qiltu', 'pastPass.3': 'قِيلَ|qīla', 'pastPass.4': 'قِيلَتْ|qīlat', 'pastPass.11': 'قِيلُوا|qīlū', 'pastPass.12': 'قِلْنَ|qilna',
  'presPass.0': 'أُقَالُ|uqālu', 'presPass.3': 'يُقَالُ|yuqālu', 'presPass.2': 'تُقَالِينَ|tuqālīna', 'presPass.8': 'تُقَلْنَ|tuqalna',
  'actPart.0': 'قَائِلٌ|qāʾilun', 'passPart.0': 'مَقُولٌ|maqūlun',
});
F('I:بيع:ai', 'بَاعَ|bāʿa', {
  'past.0': 'بِعْتُ|biʿtu', 'past.5': 'بِعْنَا|biʿnā', 'past.11': 'بَاعُوا|bāʿū', 'past.12': 'بِعْنَ|biʿna', 'pres.0': 'أَبِيعُ|abīʿu', 'pres.3': 'يَبِيعُ|yabīʿu',
  'pres.2': 'تَبِيعِينَ|tabīʿīna', 'pres.8': 'تَبِعْنَ|tabiʿna', 'subj.3': 'يَبِيعَ|yabīʿa', 'juss.3': 'يَبِعْ|yabiʿ', 'juss.7': 'تَبِيعُوا|tabīʿū',
  'imp.1': 'بِعْ|biʿ', 'imp.2': 'بِيعِي|bīʿī', 'imp.7': 'بِيعُوا|bīʿū', 'imp.8': 'بِعْنَ|biʿna', 'pastPass.3': 'بِيعَ|bīʿa', 'pastPass.0': 'بِعْتُ|biʿtu',
  'presPass.3': 'يُبَاعُ|yubāʿu', 'presPass.12': 'يُبَعْنَ|yubaʿna', 'actPart.0': 'بَائِعٌ|bāʾiʿun', 'passPart.0': 'مَبِيعٌ|mabīʿun',
});
F('I:نوم:aa', 'نَامَ|nāma', {
  'past.0': 'نِمْتُ|nimtu', 'past.11': 'نَامُوا|nāmū', 'pres.3': 'يَنَامُ|yanāmu', 'pres.0': 'أَنَامُ|anāmu', 'pres.8': 'تَنَمْنَ|tanamna', 'juss.3': 'يَنَمْ|yanam',
  'imp.1': 'نَمْ|nam', 'imp.2': 'نَامِي|nāmī', 'imp.7': 'نَامُوا|nāmū', 'actPart.0': 'نَائِمٌ|nāʾimun',
});
F('I:خوف:ia', 'خَافَ|khāfa', {
  'past.0': 'خِفْتُ|khiftu', 'past.4': 'خَافَتْ|khāfat', 'past.12': 'خِفْنَ|khifna', 'pres.3': 'يَخَافُ|yakhāfu', 'pres.1': 'تَخَافُ|takhāfu', 'juss.3': 'يَخَفْ|yakhaf',
  'imp.1': 'خَفْ|khaf', 'imp.2': 'خَافِي|khāfī', 'pastPass.3': 'خِيفَ|khīfa', 'actPart.0': 'خَائِفٌ|khāʾifun',
});
F('I:موت:iu', 'مَاتَ|māta', {
  'past.0': 'مِتُّ|mittu', 'past.1': 'مِتَّ|mitta', 'past.3': 'مَاتَ|māta', 'past.11': 'مَاتُوا|mātū', 'past.12': 'مِتْنَ|mitna',
  'pres.3': 'يَمُوتُ|yamūtu', 'pres.0': 'أَمُوتُ|amūtu', 'juss.3': 'يَمُتْ|yamut', 'imp.1': 'مُتْ|mut', 'imp.7': 'مُوتُوا|mūtū',
});
F('I:زور:au', 'زَارَ|zāra', {
  'past.0': 'زُرْتُ|zurtu', 'past.5': 'زُرْنَا|zurnā', 'pres.3': 'يَزُورُ|yazūru', 'pres.8': 'تَزُرْنَ|tazurna', 'juss.3': 'يَزُرْ|yazur', 'imp.1': 'زُرْ|zur', 'imp.2': 'زُورِي|zūrī',
  'pastPass.3': 'زِيرَ|zīra', 'actPart.0': 'زَائِرٌ|zāʾirun', 'passPart.0': 'مَزُورٌ|mazūrun',
});
F('I:سير:ai', 'سَارَ|sāra', { 'past.0': 'سِرْتُ|sirtu', 'pres.3': 'يَسِيرُ|yasīru', 'juss.3': 'يَسِرْ|yasir', 'imp.1': 'سِرْ|sir', 'actPart.0': 'سَائِرٌ|sāʾirun' });
F('I:عود:au', 'عَادَ|ʿāda', { 'past.0': 'عُدْتُ|ʿudtu', 'pres.3': 'يَعُودُ|yaʿūdu', 'juss.3': 'يَعُدْ|yaʿud', 'imp.1': 'عُدْ|ʿud', 'actPart.0': 'عَائِدٌ|ʿāʾidun' });
F('I:طول:au', 'طَالَ|ṭāla', { 'past.0': 'طُلْتُ|ṭultu', 'pres.3': 'يَطُولُ|yaṭūlu', 'juss.3': 'يَطُلْ|yaṭul' });
F('I:جوع:au', 'جَاعَ|jāʿa', { 'past.0': 'جُعْتُ|juʿtu', 'pres.3': 'يَجُوعُ|yajūʿu', 'imp.1': 'جُعْ|juʿ' });
F('I:شيء:ia', 'شَاءَ|shāʾa', {
  'past.0': 'شِئْتُ|shiʾtu', 'past.11': 'شَاؤُوا|shāʾū', 'past.12': 'شِئْنَ|shiʾna', 'pres.3': 'يَشَاءُ|yashāʾu', 'pres.7': 'تَشَاؤُونَ|tashāʾūna', 'pres.8': 'تَشَأْنَ|tashaʾna',
  'juss.3': 'يَشَأْ|yashaʾ', 'imp.1': 'شَأْ|shaʾ', 'pastPass.3': 'شِيءَ|shīʾa',
});
F('I:سوء:au', 'سَاءَ|sāʾa', { 'past.0': 'سُؤْتُ|suʾtu', 'pres.3': 'يَسُوءُ|yasūʾu', 'pres.7': 'تَسُوءُونَ|tasūʾūna', 'juss.3': 'يَسُؤْ|yasuʾ', 'pastPass.3': 'سِيءَ|sīʾa' });
F('I:جيء:ai', 'جَاءَ|jāʾa', {
  'past.0': 'جِئْتُ|jiʾtu', 'past.1': 'جِئْتَ|jiʾta', 'past.2': 'جِئْتِ|jiʾti', 'past.4': 'جَاءَتْ|jāʾat', 'past.5': 'جِئْنَا|jiʾnā', 'past.6': 'جِئْتُمَا|jiʾtumā',
  'past.7': 'جِئْتُمْ|jiʾtum', 'past.8': 'جِئْتُنَّ|jiʾtunna', 'past.9': 'جَاءَا|jāʾā', 'past.10': 'جَاءَتَا|jāʾatā', 'past.11': 'جَاؤُوا|jāʾū', 'past.12': 'جِئْنَ|jiʾna',
  'pres.0': 'أَجِيءُ|ajīʾu', 'pres.2': 'تَجِيئِينَ|tajīʾīna', 'pres.3': 'يَجِيءُ|yajīʾu', 'pres.6': 'تَجِيئَانِ|tajīʾāni', 'pres.7': 'تَجِيئُونَ|tajīʾūna',
  'pres.8': 'تَجِئْنَ|tajiʾna', 'subj.3': 'يَجِيءَ|yajīʾa', 'subj.2': 'تَجِيئِي|tajīʾī', 'juss.3': 'يَجِئْ|yajiʾ', 'juss.7': 'تَجِيئُوا|tajīʾū',
  'imp.1': 'جِئْ|jiʾ', 'imp.2': 'جِيئِي|jīʾī', 'imp.6': 'جِيئَا|jīʾā', 'imp.7': 'جِيئُوا|jīʾū', 'imp.8': 'جِئْنَ|jiʾna',
  'pastPass.3': 'جِيءَ|jīʾa', 'presPass.3': 'يُجَاءُ|yujāʾu', 'actPart.0': 'جَاءٍ|jāʾin',
  'fut.3': 'سَيَجِيءُ|sa-yajīʾu', 'negPast.3': 'لَمْ يَجِئْ|lam yajiʾ', 'negFut.3': 'لَنْ يَجِيءَ|lan yajīʾa',
});
F('I:كون:au', 'كَانَ|kāna', {
  'past.0': 'كُنْتُ|kuntu', 'past.1': 'كُنْتَ|kunta', 'past.2': 'كُنْتِ|kunti', 'past.4': 'كَانَتْ|kānat', 'past.5': 'كُنَّا|kunnā', 'past.6': 'كُنْتُمَا|kuntumā',
  'past.7': 'كُنْتُمْ|kuntum', 'past.8': 'كُنْتُنَّ|kuntunna', 'past.9': 'كَانَا|kānā', 'past.10': 'كَانَتَا|kānatā', 'past.11': 'كَانُوا|kānū', 'past.12': 'كُنَّ|kunna',
  'pres.0': 'أَكُونُ|akūnu', 'pres.2': 'تَكُونِينَ|takūnīna', 'pres.3': 'يَكُونُ|yakūnu', 'pres.7': 'تَكُونُونَ|takūnūna', 'pres.8': 'تَكُنَّ|takunna', 'pres.12': 'يَكُنَّ|yakunna',
  'subj.3': 'يَكُونَ|yakūna', 'subj.7': 'تَكُونُوا|takūnū', 'juss.3': 'يَكُنْ|yakun', 'juss.0': 'أَكُنْ|akun', 'juss.2': 'تَكُونِي|takūnī', 'juss.8': 'تَكُنَّ|takunna',
  'imp.1': 'كُنْ|kun', 'imp.2': 'كُونِي|kūnī', 'imp.6': 'كُونَا|kūnā', 'imp.7': 'كُونُوا|kūnū', 'imp.8': 'كُنَّ|kunna',
  'negPast.3': 'لَمْ يَكُنْ|lam yakun', 'negPres.3': 'لَا يَكُونُ|lā yakūnu', 'negFut.3': 'لَنْ يَكُونَ|lan yakūna', 'fut.3': 'سَيَكُونُ|sa-yakūnu',
  'pastPass.3': '-', 'presPass.3': '-', 'passPart.0': '-', 'actPart.0': 'كَائِنٌ|kāʾinun',
});

// ======== defective roots (last letter و or ي) ====================================================
F('I:رمي:ai', 'رَمَى|ramā', {
  'past.0': 'رَمَيْتُ|ramaytu', 'past.1': 'رَمَيْتَ|ramayta', 'past.2': 'رَمَيْتِ|ramayti', 'past.4': 'رَمَتْ|ramat', 'past.5': 'رَمَيْنَا|ramaynā', 'past.6': 'رَمَيْتُمَا|ramaytumā',
  'past.7': 'رَمَيْتُمْ|ramaytum', 'past.8': 'رَمَيْتُنَّ|ramaytunna', 'past.9': 'رَمَيَا|ramayā', 'past.10': 'رَمَتَا|ramatā', 'past.11': 'رَمَوْا|ramaw', 'past.12': 'رَمَيْنَ|ramayna',
  'pres.0': 'أَرْمِي|armī', 'pres.1': 'تَرْمِي|tarmī', 'pres.2': 'تَرْمِينَ|tarmīna', 'pres.3': 'يَرْمِي|yarmī', 'pres.6': 'تَرْمِيَانِ|tarmiyāni', 'pres.7': 'تَرْمُونَ|tarmūna',
  'pres.8': 'تَرْمِينَ|tarmīna', 'pres.9': 'يَرْمِيَانِ|yarmiyāni', 'pres.11': 'يَرْمُونَ|yarmūna', 'pres.12': 'يَرْمِينَ|yarmīna',
  'subj.0': 'أَرْمِيَ|armiya', 'subj.3': 'يَرْمِيَ|yarmiya', 'subj.2': 'تَرْمِي|tarmī', 'subj.6': 'تَرْمِيَا|tarmiyā', 'subj.7': 'تَرْمُوا|tarmū', 'subj.8': 'تَرْمِينَ|tarmīna', 'subj.11': 'يَرْمُوا|yarmū',
  'juss.0': 'أَرْمِ|armi', 'juss.3': 'يَرْمِ|yarmi', 'juss.2': 'تَرْمِي|tarmī', 'juss.6': 'تَرْمِيَا|tarmiyā', 'juss.7': 'تَرْمُوا|tarmū', 'juss.12': 'يَرْمِينَ|yarmīna',
  'imp.1': 'اِرْمِ|irmi', 'imp.2': 'اِرْمِي|irmī', 'imp.6': 'اِرْمِيَا|irmiyā', 'imp.7': 'اِرْمُوا|irmū', 'imp.8': 'اِرْمِينَ|irmīna',
  'negPast.3': 'لَمْ يَرْمِ|lam yarmi', 'negPres.3': 'لَا يَرْمِي|lā yarmī', 'negFut.3': 'لَنْ يَرْمِيَ|lan yarmiya', 'fut.7': 'سَتَرْمُونَ|sa-tarmūna',
  'pastPass.0': 'رُمِيتُ|rumītu', 'pastPass.3': 'رُمِيَ|rumiya', 'pastPass.4': 'رُمِيَتْ|rumiyat', 'pastPass.9': 'رُمِيَا|rumiyā', 'pastPass.11': 'رُمُوا|rumū', 'pastPass.12': 'رُمِينَ|rumīna',
  'presPass.0': 'أُرْمَى|urmā', 'presPass.3': 'يُرْمَى|yurmā', 'presPass.2': 'تُرْمَيْنَ|turmayna', 'presPass.6': 'تُرْمَيَانِ|turmayāni', 'presPass.7': 'تُرْمَوْنَ|turmawna',
  'actPart.0': 'رَامٍ|rāmin', 'passPart.0': 'مَرْمِيٌّ|marmiyyun',
});
F('I:دعو:au', 'دَعَا|daʿā', {
  'past.0': 'دَعَوْتُ|daʿawtu', 'past.4': 'دَعَتْ|daʿat', 'past.5': 'دَعَوْنَا|daʿawnā', 'past.9': 'دَعَوَا|daʿawā', 'past.10': 'دَعَتَا|daʿatā', 'past.11': 'دَعَوْا|daʿaw', 'past.12': 'دَعَوْنَ|daʿawna',
  'pres.0': 'أَدْعُو|adʿū', 'pres.2': 'تَدْعِينَ|tadʿīna', 'pres.3': 'يَدْعُو|yadʿū', 'pres.6': 'تَدْعُوَانِ|tadʿuwāni', 'pres.7': 'تَدْعُونَ|tadʿūna', 'pres.8': 'تَدْعُونَ|tadʿūna',
  'subj.3': 'يَدْعُوَ|yadʿuwa', 'subj.2': 'تَدْعِي|tadʿī', 'subj.7': 'تَدْعُوا|tadʿū', 'subj.6': 'تَدْعُوَا|tadʿuwā',
  'juss.3': 'يَدْعُ|yadʿu', 'juss.2': 'تَدْعِي|tadʿī', 'juss.7': 'تَدْعُوا|tadʿū', 'juss.0': 'أَدْعُ|adʿu',
  'imp.1': 'اُدْعُ|udʿu', 'imp.2': 'اُدْعِي|udʿī', 'imp.6': 'اُدْعُوَا|udʿuwā', 'imp.7': 'اُدْعُوا|udʿū', 'imp.8': 'اُدْعُونَ|udʿūna',
  'pastPass.0': 'دُعِيتُ|duʿītu', 'pastPass.3': 'دُعِيَ|duʿiya', 'pastPass.11': 'دُعُوا|duʿū', 'presPass.3': 'يُدْعَى|yudʿā', 'presPass.7': 'تُدْعَوْنَ|tudʿawna',
  'actPart.0': 'دَاعٍ|dāʿin', 'passPart.0': 'مَدْعُوٌّ|madʿuwwun',
});
F('I:نسي:ia', 'نَسِيَ|nasiya', {
  'past.0': 'نَسِيتُ|nasītu', 'past.4': 'نَسِيَتْ|nasiyat', 'past.5': 'نَسِينَا|nasīnā', 'past.9': 'نَسِيَا|nasiyā', 'past.10': 'نَسِيَتَا|nasiyatā', 'past.11': 'نَسُوا|nasū', 'past.12': 'نَسِينَ|nasīna',
  'pres.0': 'أَنْسَى|ansā', 'pres.2': 'تَنْسَيْنَ|tansayna', 'pres.3': 'يَنْسَى|yansā', 'pres.6': 'تَنْسَيَانِ|tansayāni', 'pres.7': 'تَنْسَوْنَ|tansawna', 'pres.8': 'تَنْسَيْنَ|tansayna',
  'subj.3': 'يَنْسَى|yansā', 'subj.2': 'تَنْسَيْ|tansay', 'subj.7': 'تَنْسَوْا|tansaw', 'subj.6': 'تَنْسَيَا|tansayā',
  'juss.3': 'يَنْسَ|yansa', 'juss.2': 'تَنْسَيْ|tansay', 'juss.7': 'تَنْسَوْا|tansaw', 'juss.12': 'يَنْسَيْنَ|yansayna',
  'imp.1': 'اِنْسَ|insa', 'imp.2': 'اِنْسَيْ|insay', 'imp.7': 'اِنْسَوْا|insaw', 'imp.8': 'اِنْسَيْنَ|insayna',
  'pastPass.0': 'نُسِيتُ|nusītu', 'pastPass.3': 'نُسِيَ|nusiya', 'pastPass.11': 'نُسُوا|nusū', 'presPass.3': 'يُنْسَى|yunsā', 'actPart.0': 'نَاسٍ|nāsin', 'passPart.0': 'مَنْسِيٌّ|mansiyyun',
});
F('I:بقي:ia', 'بَقِيَ|baqiya', { 'past.0': 'بَقِيتُ|baqītu', 'past.11': 'بَقُوا|baqū', 'pres.3': 'يَبْقَى|yabqā', 'juss.3': 'يَبْقَ|yabqa', 'imp.1': 'اِبْقَ|ibqa', 'actPart.0': 'بَاقٍ|bāqin' });
F('I:رضي:ia', 'رَضِيَ|raḍiya', {
  'past.0': 'رَضِيتُ|raḍītu', 'past.11': 'رَضُوا|raḍū', 'pres.3': 'يَرْضَى|yarḍā', 'juss.3': 'يَرْضَ|yarḍa', 'imp.1': 'اِرْضَ|irḍa',
  'pastPass.3': 'رُضِيَ|ruḍiya', 'presPass.3': 'يُرْضَى|yurḍā', 'actPart.0': 'رَاضٍ|rāḍin', 'passPart.0': 'مَرْضِيٌّ|marḍiyyun',
});
F('I:لقي:ia', 'لَقِيَ|laqiya', { 'past.0': 'لَقِيتُ|laqītu', 'pres.3': 'يَلْقَى|yalqā', 'imp.1': 'اِلْقَ|ilqa', 'pastPass.3': 'لُقِيَ|luqiya', 'actPart.0': 'لَاقٍ|lāqin' });
F('I:مشي:ai', 'مَشَى|mashā', { 'past.0': 'مَشَيْتُ|mashaytu', 'past.11': 'مَشَوْا|mashaw', 'pres.3': 'يَمْشِي|yamshī', 'pres.7': 'تَمْشُونَ|tamshūna', 'juss.3': 'يَمْشِ|yamshi', 'imp.1': 'اِمْشِ|imshi', 'actPart.0': 'مَاشٍ|māshin' });
F('I:سعي:aa', 'سَعَى|saʿā', { 'past.0': 'سَعَيْتُ|saʿaytu', 'past.11': 'سَعَوْا|saʿaw', 'pres.3': 'يَسْعَى|yasʿā', 'pres.7': 'تَسْعَوْنَ|tasʿawna', 'juss.3': 'يَسْعَ|yasʿa', 'imp.1': 'اِسْعَ|isʿa', 'actPart.0': 'سَاعٍ|sāʿin' });
F('I:بني:ai', 'بَنَى|banā', { 'past.0': 'بَنَيْتُ|banaytu', 'pres.3': 'يَبْنِي|yabnī', 'imp.1': 'اِبْنِ|ibni', 'pastPass.3': 'بُنِيَ|buniya', 'presPass.3': 'يُبْنَى|yubnā', 'actPart.0': 'بَانٍ|bānin', 'passPart.0': 'مَبْنِيٌّ|mabniyyun' });
F('I:غزو:au', 'غَزَا|ghazā', { 'past.0': 'غَزَوْتُ|ghazawtu', 'pres.3': 'يَغْزُو|yaghzū', 'juss.3': 'يَغْزُ|yaghzu', 'imp.1': 'اُغْزُ|ughzu', 'actPart.0': 'غَازٍ|ghāzin', 'passPart.0': 'مَغْزُوٌّ|maghzuwwun' });
F('I:نجو:au', 'نَجَا|najā', { 'past.0': 'نَجَوْتُ|najawtu', 'past.11': 'نَجَوْا|najaw', 'pres.3': 'يَنْجُو|yanjū', 'imp.1': 'اُنْجُ|unju', 'actPart.0': 'نَاجٍ|nājin' });
F('I:هدي:ai', 'هَدَى|hadā', { 'past.0': 'هَدَيْتُ|hadaytu', 'pres.3': 'يَهْدِي|yahdī', 'imp.1': 'اِهْدِ|ihdi', 'actPart.0': 'هَادٍ|hādin' });
F('I:جري:ai', 'جَرَى|jarā', { 'past.0': 'جَرَيْتُ|jaraytu', 'pres.3': 'يَجْرِي|yajrī', 'imp.1': 'اِجْرِ|ijri', 'actPart.0': 'جَارٍ|jārin' });
F('I:نوي:ai', 'نَوَى|nawā', { 'past.0': 'نَوَيْتُ|nawaytu', 'pres.3': 'يَنْوِي|yanwī', 'imp.1': 'اِنْوِ|inwi', 'pastPass.3': 'نُوِيَ|nuwiya' });
F('I:حكي:ai', 'حَكَى|ḥakā', { 'past.0': 'حَكَيْتُ|ḥakaytu', 'pres.3': 'يَحْكِي|yaḥkī', 'imp.1': 'اِحْكِ|iḥki' });
F('I:رجو:au', 'رَجَا|rajā', { 'past.0': 'رَجَوْتُ|rajawtu', 'pres.3': 'يَرْجُو|yarjū', 'imp.1': 'اُرْجُ|urju' });

// ======== doubled roots (second and third letter equal) ===============================================
F('I:مدد:au', 'مَدَّ|madda', {
  'past.0': 'مَدَدْتُ|madadtu', 'past.1': 'مَدَدْتَ|madadta', 'past.2': 'مَدَدْتِ|madadti', 'past.4': 'مَدَّتْ|maddat', 'past.5': 'مَدَدْنَا|madadnā', 'past.6': 'مَدَدْتُمَا|madadtumā',
  'past.7': 'مَدَدْتُمْ|madadtum', 'past.8': 'مَدَدْتُنَّ|madadtunna', 'past.9': 'مَدَّا|maddā', 'past.10': 'مَدَّتَا|maddatā', 'past.11': 'مَدُّوا|maddū', 'past.12': 'مَدَدْنَ|madadna',
  'pres.0': 'أَمُدُّ|amuddu', 'pres.1': 'تَمُدُّ|tamuddu', 'pres.2': 'تَمُدِّينَ|tamuddīna', 'pres.3': 'يَمُدُّ|yamuddu', 'pres.6': 'تَمُدَّانِ|tamuddāni', 'pres.7': 'تَمُدُّونَ|tamuddūna',
  'pres.8': 'تَمْدُدْنَ|tamdudna', 'pres.9': 'يَمُدَّانِ|yamuddāni', 'pres.11': 'يَمُدُّونَ|yamuddūna', 'pres.12': 'يَمْدُدْنَ|yamdudna',
  'subj.3': 'يَمُدَّ|yamudda', 'subj.2': 'تَمُدِّي|tamuddī', 'subj.6': 'تَمُدَّا|tamuddā', 'subj.7': 'تَمُدُّوا|tamuddū', 'subj.8': 'تَمْدُدْنَ|tamdudna',
  'juss.3': 'يَمُدَّ|yamudda', 'juss.2': 'تَمُدِّي|tamuddī', 'juss.7': 'تَمُدُّوا|tamuddū', 'juss.12': 'يَمْدُدْنَ|yamdudna',
  'imp.1': 'مُدَّ|mudda', 'imp.2': 'مُدِّي|muddī', 'imp.6': 'مُدَّا|muddā', 'imp.7': 'مُدُّوا|muddū', 'imp.8': 'اُمْدُدْنَ|umdudna',
  'negPast.3': 'لَمْ يَمُدَّ|lam yamudda', 'negPres.3': 'لَا يَمُدُّ|lā yamuddu', 'negFut.3': 'لَنْ يَمُدَّ|lan yamudda', 'fut.3': 'سَيَمُدُّ|sa-yamuddu',
  'pastPass.0': 'مُدِدْتُ|mudidtu', 'pastPass.3': 'مُدَّ|mudda', 'pastPass.4': 'مُدَّتْ|muddat', 'pastPass.11': 'مُدُّوا|muddū', 'pastPass.12': 'مُدِدْنَ|mudidna',
  'presPass.0': 'أُمَدُّ|umaddu', 'presPass.3': 'يُمَدُّ|yumaddu', 'presPass.6': 'تُمَدَّانِ|tumaddāni', 'presPass.12': 'يُمْدَدْنَ|yumdadna',
  'actPart.0': 'مَادٌّ|māddun', 'passPart.0': 'مَمْدُودٌ|mamdūdun',
});
F('I:ردد:au', 'رَدَّ|radda', { 'past.0': 'رَدَدْتُ|radadtu', 'past.11': 'رَدُّوا|raddū', 'pres.3': 'يَرُدُّ|yaruddu', 'imp.1': 'رُدَّ|rudda', 'actPart.0': 'رَادٌّ|rāddun', 'passPart.0': 'مَرْدُودٌ|mardūdun' });
F('I:شدد:au', 'شَدَّ|shadda', { 'past.0': 'شَدَدْتُ|shadadtu', 'pres.3': 'يَشُدُّ|yashuddu', 'imp.1': 'شُدَّ|shudda', 'pastPass.3': 'شُدَّ|shudda' });
F('I:ظنن:au', 'ظَنَّ|ẓanna', { 'past.0': 'ظَنَنْتُ|ẓanantu', 'past.5': 'ظَنَنَّا|ẓanannā', 'pres.3': 'يَظُنُّ|yaẓunnu', 'imp.1': 'ظُنَّ|ẓunna', 'actPart.0': 'ظَانٌّ|ẓānnun', 'passPart.0': 'مَظْنُونٌ|maẓnūnun' });
F('I:مرر:au', 'مَرَّ|marra', { 'past.0': 'مَرَرْتُ|marartu', 'pres.3': 'يَمُرُّ|yamurru', 'imp.1': 'مُرَّ|murra', 'actPart.0': 'مَارٌّ|mārrun' });
F('I:فرر:ai', 'فَرَّ|farra', { 'past.0': 'فَرَرْتُ|farartu', 'pres.3': 'يَفِرُّ|yafirru', 'imp.1': 'فِرَّ|firra', 'imp.8': 'اِفْرِرْنَ|ifrirna', 'actPart.0': 'فَارٌّ|fārrun' });
F('I:ظلل:ia', 'ظَلَّ|ẓalla', { 'past.0': 'ظَلِلْتُ|ẓaliltu', 'past.11': 'ظَلُّوا|ẓallū', 'pres.3': 'يَظَلُّ|yaẓallu', 'juss.3': 'يَظَلَّ|yaẓalla', 'imp.1': 'ظَلَّ|ẓalla', 'imp.2': 'ظَلِّي|ẓallī' });
F('I:حبب:ai', 'حَبَّ|ḥabba', { 'past.0': 'حَبَبْتُ|ḥababtu', 'pres.3': 'يَحِبُّ|yaḥibbu', 'imp.1': 'حِبَّ|ḥibba', 'pastPass.3': 'حُبَّ|ḥubba', 'passPart.0': 'مَحْبُوبٌ|maḥbūbun' });
F('II:حبب', 'حَبَّبَ|ḥabbaba', { 'past.0': 'حَبَّبْتُ|ḥabbabtu', 'pres.3': 'يُحَبِّبُ|yuḥabbibu', 'imp.1': 'حَبِّبْ|ḥabbib', 'actPart.0': 'مُحَبِّبٌ|muḥabbibun', 'passPart.0': 'مُحَبَّبٌ|muḥabbabun' });
F('III:حجج', 'حَاجَّ|ḥājja', {
  'past.0': 'حَاجَجْتُ|ḥājajtu', 'past.4': 'حَاجَّتْ|ḥājjat', 'past.11': 'حَاجُّوا|ḥājjū', 'pres.3': 'يُحَاجُّ|yuḥājju', 'pres.12': 'يُحَاجِجْنَ|yuḥājijna',
  'juss.3': 'يُحَاجَّ|yuḥājja', 'imp.1': 'حَاجَّ|ḥājja', 'pastPass.0': 'حُوجِجْتُ|ḥūjijtu', 'pastPass.3': 'حُوجَّ|ḥūjja', 'actPart.0': 'مُحَاجٌّ|muḥājjun',
});
F('IV:حبب', 'أَحَبَّ|aḥabba', {
  'past.0': 'أَحْبَبْتُ|aḥbabtu', 'past.4': 'أَحَبَّتْ|aḥabbat', 'past.11': 'أَحَبُّوا|aḥabbū', 'past.12': 'أَحْبَبْنَ|aḥbabna', 'pres.0': 'أُحِبُّ|uḥibbu', 'pres.3': 'يُحِبُّ|yuḥibbu',
  'pres.7': 'تُحِبُّونَ|tuḥibbūna', 'pres.12': 'يُحْبِبْنَ|yuḥbibna', 'subj.3': 'يُحِبَّ|yuḥibba', 'juss.3': 'يُحِبَّ|yuḥibba', 'imp.1': 'أَحِبَّ|aḥibba', 'imp.2': 'أَحِبِّي|aḥibbī',
  'imp.7': 'أَحِبُّوا|aḥibbū', 'imp.8': 'أَحْبِبْنَ|aḥbibna', 'pastPass.0': 'أُحْبِبْتُ|uḥbibtu', 'pastPass.3': 'أُحِبَّ|uḥibba', 'presPass.3': 'يُحَبُّ|yuḥabbu',
  'actPart.0': 'مُحِبٌّ|muḥibbun', 'passPart.0': 'مُحَبٌّ|muḥabbun',
});
F('V:حدد', 'تَحَدَّدَ|taḥaddada', { 'past.0': 'تَحَدَّدْتُ|taḥaddadtu', 'pres.3': 'يَتَحَدَّدُ|yataḥaddadu', 'actPart.0': 'مُتَحَدِّدٌ|mutaḥaddidun' });
F('VI:حبب', 'تَحَابَّ|taḥābba', { 'past.0': 'تَحَابَبْتُ|taḥābabtu', 'past.11': 'تَحَابُّوا|taḥābbū', 'pres.3': 'يَتَحَابُّ|yataḥābbu', 'pres.12': 'يَتَحَابَبْنَ|yataḥābabna', 'actPart.0': 'مُتَحَابٌّ|mutaḥābbun' });
F('VII:حلل', 'اِنْحَلَّ|inḥalla', {
  'past.0': 'اِنْحَلَلْتُ|inḥalaltu', 'past.4': 'اِنْحَلَّتْ|inḥallat', 'past.11': 'اِنْحَلُّوا|inḥallū', 'pres.3': 'يَنْحَلُّ|yanḥallu', 'pres.12': 'يَنْحَلِلْنَ|yanḥalilna',
  'juss.3': 'يَنْحَلَّ|yanḥalla', 'imp.1': 'اِنْحَلَّ|inḥalla', 'pastPass.3': '-', 'passPart.0': '-', 'actPart.0': 'مُنْحَلٌّ|munḥallun',
});
F('VIII:مدد', 'اِمْتَدَّ|imtadda', {
  'past.0': 'اِمْتَدَدْتُ|imtadadtu', 'past.4': 'اِمْتَدَّتْ|imtaddat', 'past.11': 'اِمْتَدُّوا|imtaddū', 'pres.0': 'أَمْتَدُّ|amtaddu', 'pres.3': 'يَمْتَدُّ|yamtaddu',
  'pres.12': 'يَمْتَدِدْنَ|yamtadidna', 'juss.3': 'يَمْتَدَّ|yamtadda', 'imp.1': 'اِمْتَدَّ|imtadda', 'pastPass.3': 'اُمْتُدَّ|umtudda', 'actPart.0': 'مُمْتَدٌّ|mumtaddun',
});
F('VIII:حلل', 'اِحْتَلَّ|iḥtalla', { 'past.0': 'اِحْتَلَلْتُ|iḥtalaltu', 'pres.3': 'يَحْتَلُّ|yaḥtallu', 'actPart.0': 'مُحْتَلٌّ|muḥtallun' });
F('X:مرر', 'اِسْتَمَرَّ|istamarra', {
  'past.0': 'اِسْتَمْرَرْتُ|istamrartu', 'past.4': 'اِسْتَمَرَّتْ|istamarrat', 'past.11': 'اِسْتَمَرُّوا|istamarrū', 'pres.0': 'أَسْتَمِرُّ|astamirru', 'pres.3': 'يَسْتَمِرُّ|yastamirru',
  'pres.12': 'يَسْتَمْرِرْنَ|yastamrirna', 'juss.3': 'يَسْتَمِرَّ|yastamirra', 'imp.1': 'اِسْتَمِرَّ|istamirra', 'pastPass.3': 'اُسْتُمِرَّ|ustumirra', 'actPart.0': 'مُسْتَمِرٌّ|mustamirrun', 'passPart.0': 'مُسْتَمَرٌّ|mustamarrun',
});
F('X:عدد', 'اِسْتَعَدَّ|istaʿadda', { 'past.0': 'اِسْتَعْدَدْتُ|istaʿdadtu', 'pres.3': 'يَسْتَعِدُّ|yastaʿiddu', 'actPart.0': 'مُسْتَعِدٌّ|mustaʿiddun' });
F('X:حقق', 'اِسْتَحَقَّ|istaḥaqqa', { 'past.0': 'اِسْتَحْقَقْتُ|istaḥqaqtu', 'pres.3': 'يَسْتَحِقُّ|yastaḥiqqu', 'imp.1': 'اِسْتَحِقَّ|istaḥiqqa' });

// ======== doubly weak roots and the irregular verbs رأى أتى ====================================================
F('I:وقي:ai', 'وَقَى|waqā', {
  'past.0': 'وَقَيْتُ|waqaytu', 'past.4': 'وَقَتْ|waqat', 'past.9': 'وَقَيَا|waqayā', 'past.11': 'وَقَوْا|waqaw', 'past.12': 'وَقَيْنَ|waqayna',
  'pres.0': 'أَقِي|aqī', 'pres.1': 'تَقِي|taqī', 'pres.2': 'تَقِينَ|taqīna', 'pres.3': 'يَقِي|yaqī', 'pres.6': 'تَقِيَانِ|taqiyāni', 'pres.7': 'تَقُونَ|taqūna', 'pres.12': 'يَقِينَ|yaqīna',
  'subj.0': 'أَقِيَ|aqiya', 'subj.2': 'تَقِي|taqī', 'subj.7': 'تَقُوا|taqū', 'juss.3': 'يَقِ|yaqi', 'juss.0': 'أَقِ|aqi', 'juss.7': 'تَقُوا|taqū',
  'imp.1': 'قِ|qi', 'imp.2': 'قِي|qī', 'imp.6': 'قِيَا|qiyā', 'imp.7': 'قُوا|qū', 'imp.8': 'قِينَ|qīna',
  'negPast.3': 'لَمْ يَقِ|lam yaqi', 'pastPass.0': 'وُقِيتُ|wuqītu', 'pastPass.3': 'وُقِيَ|wuqiya', 'pastPass.11': 'وُقُوا|wuqū', 'presPass.3': 'يُوقَى|yūqā', 'presPass.0': 'أُوقَى|ūqā',
  'actPart.0': 'وَاقٍ|wāqin', 'passPart.0': 'مَوْقِيٌّ|mawqiyyun',
});
F('I:وفي:ai', 'وَفَى|wafā', { 'past.0': 'وَفَيْتُ|wafaytu', 'past.11': 'وَفَوْا|wafaw', 'pres.3': 'يَفِي|yafī', 'pres.7': 'تَفُونَ|tafūna', 'juss.3': 'يَفِ|yafi', 'imp.1': 'فِ|fi', 'imp.7': 'فُوا|fū', 'actPart.0': 'وَافٍ|wāfin' });
F('I:وعي:ai', 'وَعَى|waʿā', { 'past.0': 'وَعَيْتُ|waʿaytu', 'pres.3': 'يَعِي|yaʿī', 'juss.3': 'يَعِ|yaʿi', 'imp.1': 'عِ|ʿi', 'actPart.0': 'وَاعٍ|wāʿin' });
F('I:ولي:ii', 'وَلِيَ|waliya', { 'past.0': 'وَلِيتُ|walītu', 'past.11': 'وَلُوا|walū', 'pres.3': 'يَلِي|yalī', 'pres.7': 'تَلُونَ|talūna', 'juss.3': 'يَلِ|yali', 'imp.1': 'لِ|li', 'imp.7': 'لُوا|lū', 'actPart.0': 'وَالٍ|wālin' });
F('I:روي:ai', 'رَوَى|rawā', { 'past.0': 'رَوَيْتُ|rawaytu', 'past.11': 'رَوَوْا|rawaw', 'pres.3': 'يَرْوِي|yarwī', 'pres.7': 'تَرْوُونَ|tarwūna', 'juss.3': 'يَرْوِ|yarwi', 'imp.1': 'اِرْوِ|irwi', 'pastPass.3': 'رُوِيَ|ruwiya', 'pastPass.11': 'رُوُوا|ruwū' });
F('I:طوي:ai', 'طَوَى|ṭawā', { 'past.0': 'طَوَيْتُ|ṭawaytu', 'past.11': 'طَوَوْا|ṭawaw', 'pres.3': 'يَطْوِي|yaṭwī', 'pres.7': 'تَطْوُونَ|taṭwūna', 'imp.7': 'اِطْوُوا|iṭwū' });
F('I:ءتي:ai', 'أَتَى|atā', {
  'past.0': 'أَتَيْتُ|ataytu', 'past.1': 'أَتَيْتَ|atayta', 'past.2': 'أَتَيْتِ|atayti', 'past.4': 'أَتَتْ|atat', 'past.5': 'أَتَيْنَا|ataynā', 'past.6': 'أَتَيْتُمَا|ataytumā',
  'past.7': 'أَتَيْتُمْ|ataytum', 'past.8': 'أَتَيْتُنَّ|ataytunna', 'past.9': 'أَتَيَا|atayā', 'past.10': 'أَتَتَا|atatā', 'past.11': 'أَتَوْا|ataw', 'past.12': 'أَتَيْنَ|atayna',
  'pres.0': 'آتِي|ātī', 'pres.1': 'تَأْتِي|taʾtī', 'pres.2': 'تَأْتِينَ|taʾtīna', 'pres.3': 'يَأْتِي|yaʾtī', 'pres.5': 'نَأْتِي|naʾtī', 'pres.6': 'تَأْتِيَانِ|taʾtiyāni',
  'pres.7': 'تَأْتُونَ|taʾtūna', 'pres.12': 'يَأْتِينَ|yaʾtīna', 'subj.0': 'آتِيَ|ātiya', 'subj.3': 'يَأْتِيَ|yaʾtiya', 'subj.7': 'تَأْتُوا|taʾtū',
  'juss.0': 'آتِ|āti', 'juss.3': 'يَأْتِ|yaʾti', 'juss.2': 'تَأْتِي|taʾtī', 'imp.1': 'اِئْتِ|iʾti', 'imp.2': 'اِئْتِي|iʾtī', 'imp.6': 'اِئْتِيَا|iʾtiyā', 'imp.7': 'اِئْتُوا|iʾtū', 'imp.8': 'اِئْتِينَ|iʾtīna',
  'negPast.3': 'لَمْ يَأْتِ|lam yaʾti', 'negFut.3': 'لَنْ يَأْتِيَ|lan yaʾtiya', 'fut.3': 'سَيَأْتِي|sa-yaʾtī', 'fut.0': 'سَآتِي|sa-ātī',
  'pastPass.0': 'أُتِيتُ|utītu', 'pastPass.3': 'أُتِيَ|utiya', 'pastPass.11': 'أُتُوا|utū', 'presPass.0': 'أُوتَى|ūtā', 'presPass.3': 'يُؤْتَى|yuʾtā', 'presPass.7': 'تُؤْتَوْنَ|tuʾtawna',
  'actPart.0': 'آتٍ|ātin', 'passPart.0': 'مَأْتِيٌّ|maʾtiyyun',
});
F('I:رءي:aa', 'رَأَى|raʾā', {
  'past.0': 'رَأَيْتُ|raʾaytu', 'past.1': 'رَأَيْتَ|raʾayta', 'past.2': 'رَأَيْتِ|raʾayti', 'past.4': 'رَأَتْ|raʾat', 'past.5': 'رَأَيْنَا|raʾaynā', 'past.6': 'رَأَيْتُمَا|raʾaytumā',
  'past.7': 'رَأَيْتُمْ|raʾaytum', 'past.8': 'رَأَيْتُنَّ|raʾaytunna', 'past.9': 'رَأَيَا|raʾayā', 'past.10': 'رَأَتَا|raʾatā', 'past.11': 'رَأَوْا|raʾaw', 'past.12': 'رَأَيْنَ|raʾayna',
  'pres.0': 'أَرَى|arā', 'pres.1': 'تَرَى|tarā', 'pres.2': 'تَرَيْنَ|tarayna', 'pres.3': 'يَرَى|yarā', 'pres.5': 'نَرَى|narā', 'pres.6': 'تَرَيَانِ|tarayāni', 'pres.7': 'تَرَوْنَ|tarawna',
  'pres.8': 'تَرَيْنَ|tarayna', 'pres.9': 'يَرَيَانِ|yarayāni', 'pres.11': 'يَرَوْنَ|yarawna', 'pres.12': 'يَرَيْنَ|yarayna',
  'subj.0': 'أَرَى|arā', 'subj.2': 'تَرَيْ|taray', 'subj.6': 'تَرَيَا|tarayā', 'subj.7': 'تَرَوْا|taraw', 'subj.11': 'يَرَوْا|yaraw',
  'juss.0': 'أَرَ|ara', 'juss.3': 'يَرَ|yara', 'juss.2': 'تَرَيْ|taray', 'juss.7': 'تَرَوْا|taraw', 'juss.12': 'يَرَيْنَ|yarayna',
  'imp.1': 'رَ|ra', 'imp.2': 'رَيْ|ray', 'imp.6': 'رَيَا|rayā', 'imp.7': 'رَوْا|raw', 'imp.8': 'رَيْنَ|rayna',
  'negPast.0': 'لَمْ أَرَ|lam ara', 'negPast.3': 'لَمْ يَرَ|lam yara', 'negPres.3': 'لَا يَرَى|lā yarā', 'negFut.3': 'لَنْ يَرَى|lan yarā', 'fut.0': 'سَأَرَى|sa-arā',
  'pastPass.0': 'رُئِيتُ|ruʾītu', 'pastPass.3': 'رُئِيَ|ruʾiya', 'pastPass.4': 'رُئِيَتْ|ruʾiyat', 'pastPass.11': 'رُؤُوا|ruʾū', 'pastPass.12': 'رُئِينَ|ruʾīna',
  'presPass.0': 'أُرَى|urā', 'presPass.3': 'يُرَى|yurā', 'presPass.2': 'تُرَيْنَ|turayna', 'presPass.7': 'تُرَوْنَ|turawna', 'actPart.0': 'رَاءٍ|rāʾin', 'passPart.0': 'مَرْئِيٌّ|marʾiyyun',
});
F('IV:رءي', 'أَرَى|arā', {
  'past.0': 'أَرَيْتُ|araytu', 'past.4': 'أَرَتْ|arat', 'past.11': 'أَرَوْا|araw', 'pres.0': 'أُرِي|urī', 'pres.3': 'يُرِي|yurī', 'pres.7': 'تُرُونَ|turūna', 'subj.3': 'يُرِيَ|yuriya',
  'juss.3': 'يُرِ|yuri', 'imp.1': 'أَرِ|ari', 'imp.7': 'أَرُوا|arū', 'pastPass.3': 'أُرِيَ|uriya', 'presPass.3': 'يُرَى|yurā', 'actPart.0': 'مُرٍ|murin', 'passPart.0': 'مُرًى|muran',
});
F('IV:ءتي', 'آتَى|ātā', { 'past.0': 'آتَيْتُ|ātaytu', 'past.11': 'آتَوْا|ātaw', 'pres.0': 'أُوتِي|ūtī', 'pres.3': 'يُؤْتِي|yuʾtī', 'juss.3': 'يُؤْتِ|yuʾti', 'imp.1': 'آتِ|āti', 'pastPass.3': 'أُوتِيَ|ūtiya', 'actPart.0': 'مُؤْتٍ|muʾtin' });
F('IV:حيي', 'أَحْيَا|aḥyā', { 'past.0': 'أَحْيَيْتُ|aḥyaytu', 'pres.3': 'يُحْيِي|yuḥyī', 'imp.1': 'أَحْيِ|aḥyi', 'actPart.0': 'مُحْيٍ|muḥyin' });

// ======== derived forms of hollow roots ==============================================================
F('IV:قوم', 'أَقَامَ|aqāma', {
  'past.0': 'أَقَمْتُ|aqamtu', 'past.4': 'أَقَامَتْ|aqāmat', 'past.11': 'أَقَامُوا|aqāmū', 'past.12': 'أَقَمْنَ|aqamna', 'pres.0': 'أُقِيمُ|uqīmu', 'pres.3': 'يُقِيمُ|yuqīmu',
  'pres.2': 'تُقِيمِينَ|tuqīmīna', 'pres.12': 'يُقِمْنَ|yuqimna', 'subj.3': 'يُقِيمَ|yuqīma', 'juss.3': 'يُقِمْ|yuqim', 'juss.2': 'تُقِيمِي|tuqīmī',
  'imp.1': 'أَقِمْ|aqim', 'imp.2': 'أَقِيمِي|aqīmī', 'imp.7': 'أَقِيمُوا|aqīmū', 'imp.8': 'أَقِمْنَ|aqimna',
  'pastPass.0': 'أُقِمْتُ|uqimtu', 'pastPass.3': 'أُقِيمَ|uqīma', 'presPass.3': 'يُقَامُ|yuqāmu', 'actPart.0': 'مُقِيمٌ|muqīmun', 'passPart.0': 'مُقَامٌ|muqāmun',
});
F('IV:رود', 'أَرَادَ|arāda', {
  'past.0': 'أَرَدْتُ|aradtu', 'past.5': 'أَرَدْنَا|aradnā', 'pres.0': 'أُرِيدُ|urīdu', 'pres.1': 'تُرِيدُ|turīdu', 'pres.3': 'يُرِيدُ|yurīdu', 'pres.5': 'نُرِيدُ|nurīdu', 'pres.12': 'يُرِدْنَ|yuridna',
  'juss.3': 'يُرِدْ|yurid', 'imp.1': 'أَرِدْ|arid', 'pastPass.3': 'أُرِيدَ|urīda', 'presPass.3': 'يُرَادُ|yurādu', 'actPart.0': 'مُرِيدٌ|murīdun', 'passPart.0': 'مُرَادٌ|murādun',
});
F('IV:جوب', 'أَجَابَ|ajāba', { 'past.0': 'أَجَبْتُ|ajabtu', 'pres.3': 'يُجِيبُ|yujību', 'subj.3': 'يُجِيبَ|yujība', 'juss.3': 'يُجِبْ|yujib', 'actPart.0': 'مُجِيبٌ|mujībun', 'passPart.0': 'مُجَابٌ|mujābun' });
F('IV:ضوء', 'أَضَاءَ|aḍāʾa', { 'past.0': 'أَضَأْتُ|aḍaʾtu', 'pres.3': 'يُضِيءُ|yuḍīʾu', 'juss.3': 'يُضِئْ|yuḍiʾ', 'actPart.0': 'مُضِيءٌ|muḍīʾun' });
F('II:قوم', 'قَوَّمَ|qawwama', {
  'past.0': 'قَوَّمْتُ|qawwamtu', 'past.11': 'قَوَّمُوا|qawwamū', 'pres.0': 'أُقَوِّمُ|uqawwimu', 'pres.3': 'يُقَوِّمُ|yuqawwimu', 'juss.3': 'يُقَوِّمْ|yuqawwim', 'imp.1': 'قَوِّمْ|qawwim',
  'pastPass.3': 'قُوِّمَ|quwwima', 'presPass.3': 'يُقَوَّمُ|yuqawwamu', 'actPart.0': 'مُقَوِّمٌ|muqawwimun', 'passPart.0': 'مُقَوَّمٌ|muqawwamun',
});
F('III:قوم', 'قَاوَمَ|qāwama', {
  'past.0': 'قَاوَمْتُ|qāwamtu', 'pres.0': 'أُقَاوِمُ|uqāwimu', 'pres.3': 'يُقَاوِمُ|yuqāwimu', 'imp.1': 'قَاوِمْ|qāwim', 'pastPass.3': 'قُووِمَ|qūwima', 'presPass.3': 'يُقَاوَمُ|yuqāwamu',
  'actPart.0': 'مُقَاوِمٌ|muqāwimun', 'passPart.0': 'مُقَاوَمٌ|muqāwamun',
});
F('V:قوم', 'تَقَوَّمَ|taqawwama', {
  'past.0': 'تَقَوَّمْتُ|taqawwamtu', 'pres.0': 'أَتَقَوَّمُ|ataqawwamu', 'pres.3': 'يَتَقَوَّمُ|yataqawwamu', 'imp.1': 'تَقَوَّمْ|taqawwam', 'pastPass.3': 'تُقُوِّمَ|tuquwwima', 'actPart.0': 'مُتَقَوِّمٌ|mutaqawwimun',
});
F('VI:قوم', 'تَقَاوَمَ|taqāwama', { 'past.0': 'تَقَاوَمْتُ|taqāwamtu', 'pres.3': 'يَتَقَاوَمُ|yataqāwamu', 'imp.1': 'تَقَاوَمْ|taqāwam', 'pastPass.3': 'تُقُووِمَ|tuqūwima', 'actPart.0': 'مُتَقَاوِمٌ|mutaqāwimun' });
F('VII:قود', 'اِنْقَادَ|inqāda', {
  'past.0': 'اِنْقَدْتُ|inqadtu', 'past.4': 'اِنْقَادَتْ|inqādat', 'past.11': 'اِنْقَادُوا|inqādū', 'past.12': 'اِنْقَدْنَ|inqadna', 'pres.0': 'أَنْقَادُ|anqādu', 'pres.3': 'يَنْقَادُ|yanqādu',
  'pres.12': 'يَنْقَدْنَ|yanqadna', 'juss.3': 'يَنْقَدْ|yanqad', 'imp.1': 'اِنْقَدْ|inqad', 'imp.2': 'اِنْقَادِي|inqādī', 'pastPass.3': '-', 'actPart.0': 'مُنْقَادٌ|munqādun', 'passPart.0': '-',
});
F('VIII:خير', 'اِخْتَارَ|ikhtāra', {
  'past.0': 'اِخْتَرْتُ|ikhtartu', 'past.4': 'اِخْتَارَتْ|ikhtārat', 'past.11': 'اِخْتَارُوا|ikhtārū', 'past.12': 'اِخْتَرْنَ|ikhtarna', 'pres.0': 'أَخْتَارُ|akhtāru', 'pres.3': 'يَخْتَارُ|yakhtāru',
  'pres.12': 'يَخْتَرْنَ|yakhtarna', 'juss.3': 'يَخْتَرْ|yakhtar', 'imp.1': 'اِخْتَرْ|ikhtar', 'imp.2': 'اِخْتَارِي|ikhtārī', 'pastPass.0': 'اُخْتِرْتُ|ukhtirtu', 'pastPass.3': 'اُخْتِيرَ|ukhtīra',
  'presPass.3': 'يُخْتَارُ|yukhtāru', 'actPart.0': 'مُخْتَارٌ|mukhtārun', 'passPart.0': 'مُخْتَارٌ|mukhtārun',
});
F('VIII:حوج', 'اِحْتَاجَ|iḥtāja', { 'past.0': 'اِحْتَجْتُ|iḥtajtu', 'pres.3': 'يَحْتَاجُ|yaḥtāju', 'pres.0': 'أَحْتَاجُ|aḥtāju', 'imp.1': 'اِحْتَجْ|iḥtaj', 'actPart.0': 'مُحْتَاجٌ|muḥtājun' });
F('VIII:روح', 'اِرْتَاحَ|irtāḥa', { 'past.0': 'اِرْتَحْتُ|irtaḥtu', 'pres.3': 'يَرْتَاحُ|yartāḥu', 'actPart.0': 'مُرْتَاحٌ|murtāḥun' });
F('X:قوم', 'اِسْتَقَامَ|istaqāma', {
  'past.0': 'اِسْتَقَمْتُ|istaqamtu', 'past.11': 'اِسْتَقَامُوا|istaqāmū', 'pres.0': 'أَسْتَقِيمُ|astaqīmu', 'pres.3': 'يَسْتَقِيمُ|yastaqīmu', 'pres.12': 'يَسْتَقِمْنَ|yastaqimna',
  'juss.3': 'يَسْتَقِمْ|yastaqim', 'imp.1': 'اِسْتَقِمْ|istaqim', 'imp.2': 'اِسْتَقِيمِي|istaqīmī', 'pastPass.3': 'اُسْتُقِيمَ|ustuqīma', 'presPass.3': 'يُسْتَقَامُ|yustaqāmu',
  'actPart.0': 'مُسْتَقِيمٌ|mustaqīmun', 'passPart.0': 'مُسْتَقَامٌ|mustaqāmun',
});
F('X:عون', 'اِسْتَعَانَ|istaʿāna', { 'past.0': 'اِسْتَعَنْتُ|istaʿantu', 'past.12': 'اِسْتَعَنَّ|istaʿanna', 'pres.3': 'يَسْتَعِينُ|yastaʿīnu', 'pres.12': 'يَسْتَعِنَّ|yastaʿinna', 'juss.3': 'يَسْتَعِنْ|yastaʿin', 'imp.1': 'اِسْتَعِنْ|istaʿin', 'actPart.0': 'مُسْتَعِينٌ|mustaʿīnun', 'passPart.0': 'مُسْتَعَانٌ|mustaʿānun' });
F('X:طوع', 'اِسْتَطَاعَ|istaṭāʿa', { 'past.0': 'اِسْتَطَعْتُ|istaṭaʿtu', 'pres.3': 'يَسْتَطِيعُ|yastaṭīʿu', 'pres.0': 'أَسْتَطِيعُ|astaṭīʿu', 'juss.3': 'يَسْتَطِعْ|yastaṭiʿ', 'passPart.0': 'مُسْتَطَاعٌ|mustaṭāʿun' });

// ======== derived forms of defective roots ==============================================================
F('II:ربو', 'رَبَّى|rabbā', {
  'past.0': 'رَبَّيْتُ|rabbaytu', 'past.4': 'رَبَّتْ|rabbat', 'past.11': 'رَبَّوْا|rabbaw', 'pres.0': 'أُرَبِّي|urabbī', 'pres.3': 'يُرَبِّي|yurabbī', 'pres.7': 'تُرَبُّونَ|turabbūna',
  'subj.3': 'يُرَبِّيَ|yurabbiya', 'juss.3': 'يُرَبِّ|yurabbi', 'pastPass.0': 'رُبِّيتُ|rubbītu', 'pastPass.3': 'رُبِّيَ|rubbiya', 'presPass.3': 'يُرَبَّى|yurabbā',
  'actPart.0': 'مُرَبٍّ|murabbin', 'passPart.0': 'مُرَبًّى|murabban',
});
F('III:ندي', 'نَادَى|nādā', {
  'past.0': 'نَادَيْتُ|nādaytu', 'past.11': 'نَادَوْا|nādaw', 'pres.0': 'أُنَادِي|unādī', 'pres.3': 'يُنَادِي|yunādī', 'pres.11': 'يُنَادُونَ|yunādūna', 'juss.3': 'يُنَادِ|yunādi',
  'pastPass.0': 'نُودِيتُ|nūdītu', 'pastPass.3': 'نُودِيَ|nūdiya', 'actPart.0': 'مُنَادٍ|munādin', 'passPart.0': 'مُنَادًى|munādan',
});
F('IV:عطو', 'أَعْطَى|aʿṭā', {
  'past.0': 'أَعْطَيْتُ|aʿṭaytu', 'past.4': 'أَعْطَتْ|aʿṭat', 'past.11': 'أَعْطَوْا|aʿṭaw', 'pres.0': 'أُعْطِي|uʿṭī', 'pres.3': 'يُعْطِي|yuʿṭī', 'pres.11': 'يُعْطُونَ|yuʿṭūna',
  'subj.3': 'يُعْطِيَ|yuʿṭiya', 'subj.11': 'يُعْطُوا|yuʿṭū', 'juss.3': 'يُعْطِ|yuʿṭi', 'imp.1': 'أَعْطِ|aʿṭi', 'imp.2': 'أَعْطِي|aʿṭī', 'imp.7': 'أَعْطُوا|aʿṭū',
  'pastPass.0': 'أُعْطِيتُ|uʿṭītu', 'pastPass.3': 'أُعْطِيَ|uʿṭiya', 'presPass.3': 'يُعْطَى|yuʿṭā', 'actPart.0': 'مُعْطٍ|muʿṭin', 'passPart.0': 'مُعْطًى|muʿṭan',
});
F('V:منو', 'تَمَنَّى|tamannā', {
  'past.0': 'تَمَنَّيْتُ|tamannaytu', 'past.11': 'تَمَنَّوْا|tamannaw', 'pres.0': 'أَتَمَنَّى|atamannā', 'pres.3': 'يَتَمَنَّى|yatamannā', 'pres.11': 'يَتَمَنَّوْنَ|yatamannawna',
  'juss.3': 'يَتَمَنَّ|yatamanna', 'pastPass.3': 'تُمُنِّيَ|tumunniya', 'actPart.0': 'مُتَمَنٍّ|mutamannin', 'passPart.0': 'مُتَمَنًّى|mutamannan',
});
F('VI:عطو', 'تَعَاطَى|taʿāṭā', { 'past.0': 'تَعَاطَيْتُ|taʿāṭaytu', 'pres.3': 'يَتَعَاطَى|yataʿāṭā', 'juss.3': 'يَتَعَاطَ|yataʿāṭa', 'actPart.0': 'مُتَعَاطٍ|mutaʿāṭin' });
F('VII:حني', 'اِنْحَنَى|inḥanā', { 'past.0': 'اِنْحَنَيْتُ|inḥanaytu', 'pres.3': 'يَنْحَنِي|yanḥanī', 'pres.11': 'يَنْحَنُونَ|yanḥanūna', 'juss.3': 'يَنْحَنِ|yanḥani', 'actPart.0': 'مُنْحَنٍ|munḥanin', 'pastPass.3': '-' });
F('VIII:شري', 'اِشْتَرَى|ishtarā', {
  'past.0': 'اِشْتَرَيْتُ|ishtaraytu', 'past.11': 'اِشْتَرَوْا|ishtaraw', 'pres.0': 'أَشْتَرِي|ashtarī', 'pres.3': 'يَشْتَرِي|yashtarī', 'pres.11': 'يَشْتَرُونَ|yashtarūna',
  'juss.3': 'يَشْتَرِ|yashtari', 'imp.1': 'اِشْتَرِ|ishtari', 'imp.2': 'اِشْتَرِي|ishtarī', 'pastPass.0': 'اُشْتُرِيتُ|ushturītu', 'pastPass.3': 'اُشْتُرِيَ|ushturiya', 'actPart.0': 'مُشْتَرٍ|mushtarin', 'passPart.0': 'مُشْتَرًى|mushtaran',
});
F('VIII:نهي', 'اِنْتَهَى|intahā', { 'past.0': 'اِنْتَهَيْتُ|intahaytu', 'past.11': 'اِنْتَهَوْا|intahaw', 'pres.3': 'يَنْتَهِي|yantahī', 'juss.3': 'يَنْتَهِ|yantahi', 'imp.1': 'اِنْتَهِ|intahi', 'actPart.0': 'مُنْتَهٍ|muntahin', 'passPart.0': 'مُنْتَهًى|muntahan' });
F('X:دعو', 'اِسْتَدْعَى|istadʿā', {
  'past.0': 'اِسْتَدْعَيْتُ|istadʿaytu', 'past.11': 'اِسْتَدْعَوْا|istadʿaw', 'pres.0': 'أَسْتَدْعِي|astadʿī', 'pres.3': 'يَسْتَدْعِي|yastadʿī', 'pres.11': 'يَسْتَدْعُونَ|yastadʿūna',
  'pastPass.3': 'اُسْتُدْعِيَ|ustudʿiya', 'presPass.3': 'يُسْتَدْعَى|yustadʿā', 'actPart.0': 'مُسْتَدْعٍ|mustadʿin', 'passPart.0': 'مُسْتَدْعًى|mustadʿan',
});
F('X:غني', 'اِسْتَغْنَى|istaghnā', { 'past.0': 'اِسْتَغْنَيْتُ|istaghnaytu', 'pres.3': 'يَسْتَغْنِي|yastaghnī', 'imp.1': 'اِسْتَغْنِ|istaghni', 'actPart.0': 'مُسْتَغْنٍ|mustaghnin' });
F('II:حيي', 'حَيَّا|ḥayyā', { 'past.0': 'حَيَّيْتُ|ḥayyaytu', 'pres.3': 'يُحَيِّي|yuḥayyī', 'actPart.0': 'مُحَيٍّ|muḥayyin', 'passPart.0': 'مُحَيًّا|muḥayyan' });
F('X:حيي', 'اِسْتَحْيَا|istaḥyā', { 'past.0': 'اِسْتَحْيَيْتُ|istaḥyaytu', 'pres.3': 'يَسْتَحْيِي|yastaḥyī', 'actPart.0': 'مُسْتَحْيٍ|mustaḥyin' });
// ======== four-letter roots with weak letters and hamza ===================================================
F('Q1:هرول', 'هَرْوَلَ|harwala', { 'past.0': 'هَرْوَلْتُ|harwaltu', 'pres.3': 'يُهَرْوِلُ|yuharwilu', 'imp.1': 'هَرْوِلْ|harwil', 'pastPass.3': 'هُرْوِلَ|hurwila', 'actPart.0': 'مُهَرْوِلٌ|muharwilun', 'passPart.0': 'مُهَرْوَلٌ|muharwalun' });
F('Q1:سيطر', 'سَيْطَرَ|sayṭara', { 'past.0': 'سَيْطَرْتُ|sayṭartu', 'pres.3': 'يُسَيْطِرُ|yusayṭiru', 'pastPass.3': 'سُيْطِرَ|suyṭira', 'actPart.0': 'مُسَيْطِرٌ|musayṭirun' });
F('Q1:طمءن', 'طَمْأَنَ|ṭamʾana', { 'past.0': 'طَمْأَنْتُ|ṭamʾantu', 'pres.3': 'يُطَمْئِنُ|yuṭamʾinu', 'pastPass.3': 'طُمْئِنَ|ṭumʾina', 'actPart.0': 'مُطَمْئِنٌ|muṭamʾinun', 'passPart.0': 'مُطَمْأَنٌ|muṭamʾanun' });
F('Q1:وسوس', 'وَسْوَسَ|waswasa', { 'past.0': 'وَسْوَسْتُ|waswastu', 'pres.3': 'يُوَسْوِسُ|yuwaswisu', 'pres.0': 'أُوَسْوِسُ|uwaswisu', 'imp.1': 'وَسْوِسْ|waswis', 'actPart.0': 'مُوَسْوِسٌ|muwaswisun' });
F('Q1:ثرثر', 'ثَرْثَرَ|tharthara', { 'past.0': 'ثَرْثَرْتُ|tharthartu', 'pres.3': 'يُثَرْثِرُ|yutharthiru', 'imp.1': 'ثَرْثِرْ|tharthir', 'actPart.0': 'مُثَرْثِرٌ|mutharthirun' });
F('Q1:بلور', 'بَلْوَرَ|balwara', { 'past.0': 'بَلْوَرْتُ|balwartu', 'pres.3': 'يُبَلْوِرُ|yubalwiru' });
F('Q2:سيطر', 'تَسَيْطَرَ|tasayṭara', { 'past.0': 'تَسَيْطَرْتُ|tasayṭartu', 'pres.3': 'يَتَسَيْطَرُ|yatasayṭaru', 'actPart.0': 'مُتَسَيْطِرٌ|mutasayṭirun' });
F('Q2:زلزل', 'تَزَلْزَلَ|tazalzala', { 'past.0': 'تَزَلْزَلْتُ|tazalzaltu', 'pres.3': 'يَتَزَلْزَلُ|yatazalzalu', 'juss.3': 'يَتَزَلْزَلْ|yatazalzal', 'actPart.0': 'مُتَزَلْزِلٌ|mutazalzilun' });
F('Q1:قلقي', 'قَلْقَى|qalqā', { 'past.0': 'قَلْقَيْتُ|qalqaytu', 'pres.3': 'يُقَلْقِي|yuqalqī', 'actPart.0': 'مُقَلْقٍ|muqalqin' });
// ======== hamzated derived forms (more) ================================================================
F('VIII:ملء', 'اِمْتَلَأَ|imtalaʾa', { 'past.0': 'اِمْتَلَأْتُ|imtalaʾtu', 'past.11': 'اِمْتَلَؤُوا|imtalaʾū', 'pres.3': 'يَمْتَلِئُ|yamtaliʾu', 'juss.3': 'يَمْتَلِئْ|yamtaliʾ', 'pastPass.3': 'اُمْتُلِئَ|umtuliʾa', 'actPart.0': 'مُمْتَلِئٌ|mumtaliʾun', 'passPart.0': 'مُمْتَلَأٌ|mumtalaʾun' });
F('VIII:بدء', 'اِبْتَدَأَ|ibtadaʾa', { 'past.0': 'اِبْتَدَأْتُ|ibtadaʾtu', 'pres.3': 'يَبْتَدِئُ|yabtadiʾu', 'actPart.0': 'مُبْتَدِئٌ|mubtadiʾun', 'passPart.0': 'مُبْتَدَأٌ|mubtadaʾun' });
F('II:هنء', 'هَنَّأَ|hannaʾa', { 'past.0': 'هَنَّأْتُ|hannaʾtu', 'past.11': 'هَنَّؤُوا|hannaʾū', 'pres.3': 'يُهَنِّئُ|yuhanniʾu', 'pastPass.3': 'هُنِّئَ|hunniʾa', 'actPart.0': 'مُهَنِّئٌ|muhanniʾun' });
F('III:سءل', 'سَاءَلَ|sāʾala', { 'past.0': 'سَاءَلْتُ|sāʾaltu', 'pres.3': 'يُسَائِلُ|yusāʾilu', 'pastPass.3': 'سُوئِلَ|sūʾila', 'actPart.0': 'مُسَائِلٌ|musāʾilun' });
F('IV:قرء', 'أَقْرَأَ|aqraʾa', { 'past.0': 'أَقْرَأْتُ|aqraʾtu', 'pres.3': 'يُقْرِئُ|yuqriʾu', 'actPart.0': 'مُقْرِئٌ|muqriʾun' });
F('V:هنء', 'تَهَنَّأَ|tahannaʾa', { 'past.0': 'تَهَنَّأْتُ|tahannaʾtu', 'pres.3': 'يَتَهَنَّأُ|yatahannaʾu', 'actPart.0': 'مُتَهَنِّئٌ|mutahanniʾun' });
F('X:ءمن', 'اِسْتَأْمَنَ|istaʾmana', { 'past.0': 'اِسْتَأْمَنْتُ|istaʾmantu', 'pres.3': 'يَسْتَأْمِنُ|yastaʾminu', 'pastPass.3': 'اُسْتُؤْمِنَ|ustuʾmina', 'actPart.0': 'مُسْتَأْمِنٌ|mustaʾminun' });
F('II:ءمل', 'أَمَّلَ|ammala', { 'past.0': 'أَمَّلْتُ|ammaltu', 'pres.0': 'أُؤَمِّلُ|uʾammilu', 'pres.3': 'يُؤَمِّلُ|yuʾammilu', 'pastPass.3': 'أُمِّلَ|ummila' });
F('V:ءمل', 'تَأَمَّلَ|taʾammala', { 'past.0': 'تَأَمَّلْتُ|taʾammaltu', 'pres.3': 'يَتَأَمَّلُ|yataʾammalu', 'pastPass.3': 'تُؤُمِّلَ|tuʾummila' });

R('I:كتب:au', 'fut', 'سَأَكْتُبُ|sa-aktubu ; سَتَكْتُبُ|sa-taktubu ; سَتَكْتُبِينَ|sa-taktubīna ; سَيَكْتُبُ|sa-yaktubu ; سَتَكْتُبُ|sa-taktubu ; سَنَكْتُبُ|sa-naktubu ; سَتَكْتُبَانِ|sa-taktubāni ; سَتَكْتُبُونَ|sa-taktubūna ; سَتَكْتُبْنَ|sa-taktubna ; سَيَكْتُبَانِ|sa-yaktubāni ; سَتَكْتُبَانِ|sa-taktubāni ; سَيَكْتُبُونَ|sa-yaktubūna ; سَيَكْتُبْنَ|sa-yaktubna');
R('I:كتب:au', 'subj', 'أَكْتُبَ|aktuba ; تَكْتُبَ|taktuba ; تَكْتُبِي|taktubī ; يَكْتُبَ|yaktuba ; تَكْتُبَ|taktuba ; نَكْتُبَ|naktuba ; تَكْتُبَا|taktubā ; تَكْتُبُوا|taktubū ; تَكْتُبْنَ|taktubna ; يَكْتُبَا|yaktubā ; تَكْتُبَا|taktubā ; يَكْتُبُوا|yaktubū ; يَكْتُبْنَ|yaktubna');
R('I:كتب:au', 'juss', 'أَكْتُبْ|aktub ; تَكْتُبْ|taktub ; تَكْتُبِي|taktubī ; يَكْتُبْ|yaktub ; تَكْتُبْ|taktub ; نَكْتُبْ|naktub ; تَكْتُبَا|taktubā ; تَكْتُبُوا|taktubū ; تَكْتُبْنَ|taktubna ; يَكْتُبَا|yaktubā ; تَكْتُبَا|taktubā ; يَكْتُبُوا|yaktubū ; يَكْتُبْنَ|yaktubna');
R('I:كتب:au', 'negPast', 'لَمْ أَكْتُبْ|lam aktub ; لَمْ تَكْتُبْ|lam taktub ; لَمْ تَكْتُبِي|lam taktubī ; لَمْ يَكْتُبْ|lam yaktub ; لَمْ تَكْتُبْ|lam taktub ; لَمْ نَكْتُبْ|lam naktub ; لَمْ تَكْتُبَا|lam taktubā ; لَمْ تَكْتُبُوا|lam taktubū ; لَمْ تَكْتُبْنَ|lam taktubna ; لَمْ يَكْتُبَا|lam yaktubā ; لَمْ تَكْتُبَا|lam taktubā ; لَمْ يَكْتُبُوا|lam yaktubū ; لَمْ يَكْتُبْنَ|lam yaktubna');
R('I:كتب:au', 'negPres', 'لَا أَكْتُبُ|lā aktubu ; لَا تَكْتُبُ|lā taktubu ; لَا تَكْتُبِينَ|lā taktubīna ; لَا يَكْتُبُ|lā yaktubu ; لَا تَكْتُبُ|lā taktubu ; لَا نَكْتُبُ|lā naktubu ; لَا تَكْتُبَانِ|lā taktubāni ; لَا تَكْتُبُونَ|lā taktubūna ; لَا تَكْتُبْنَ|lā taktubna ; لَا يَكْتُبَانِ|lā yaktubāni ; لَا تَكْتُبَانِ|lā taktubāni ; لَا يَكْتُبُونَ|lā yaktubūna ; لَا يَكْتُبْنَ|lā yaktubna');
R('I:كتب:au', 'negFut', 'لَنْ أَكْتُبَ|lan aktuba ; لَنْ تَكْتُبَ|lan taktuba ; لَنْ تَكْتُبِي|lan taktubī ; لَنْ يَكْتُبَ|lan yaktuba ; لَنْ تَكْتُبَ|lan taktuba ; لَنْ نَكْتُبَ|lan naktuba ; لَنْ تَكْتُبَا|lan taktubā ; لَنْ تَكْتُبُوا|lan taktubū ; لَنْ تَكْتُبْنَ|lan taktubna ; لَنْ يَكْتُبَا|lan yaktubā ; لَنْ تَكْتُبَا|lan taktubā ; لَنْ يَكْتُبُوا|lan yaktubū ; لَنْ يَكْتُبْنَ|lan yaktubna');
R('I:كتب:au', 'pastPass', 'كُتِبْتُ|kutibtu ; كُتِبْتَ|kutibta ; كُتِبْتِ|kutibti ; كُتِبَ|kutiba ; كُتِبَتْ|kutibat ; كُتِبْنَا|kutibnā ; كُتِبْتُمَا|kutibtumā ; كُتِبْتُمْ|kutibtum ; كُتِبْتُنَّ|kutibtunna ; كُتِبَا|kutibā ; كُتِبَتَا|kutibatā ; كُتِبُوا|kutibū ; كُتِبْنَ|kutibna');
R('I:كتب:au', 'presPass', 'أُكْتَبُ|uktabu ; تُكْتَبُ|tuktabu ; تُكْتَبِينَ|tuktabīna ; يُكْتَبُ|yuktabu ; تُكْتَبُ|tuktabu ; نُكْتَبُ|nuktabu ; تُكْتَبَانِ|tuktabāni ; تُكْتَبُونَ|tuktabūna ; تُكْتَبْنَ|tuktabna ; يُكْتَبَانِ|yuktabāni ; تُكْتَبَانِ|tuktabāni ; يُكْتَبُونَ|yuktabūna ; يُكْتَبْنَ|yuktabna');
R('I:كتب:au', 'passPart', 'مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun ; مَكْتُوبٌ|maktūbun');

R('I:قول:au', 'past', 'قُلْتُ|qultu ; قُلْتَ|qulta ; قُلْتِ|qulti ; قَالَ|qāla ; قَالَتْ|qālat ; قُلْنَا|qulnā ; قُلْتُمَا|qultumā ; قُلْتُمْ|qultum ; قُلْتُنَّ|qultunna ; قَالَا|qālā ; قَالَتَا|qālatā ; قَالُوا|qālū ; قُلْنَ|qulna');
R('I:قول:au', 'pres', 'أَقُولُ|aqūlu ; تَقُولُ|taqūlu ; تَقُولِينَ|taqūlīna ; يَقُولُ|yaqūlu ; تَقُولُ|taqūlu ; نَقُولُ|naqūlu ; تَقُولَانِ|taqūlāni ; تَقُولُونَ|taqūlūna ; تَقُلْنَ|taqulna ; يَقُولَانِ|yaqūlāni ; تَقُولَانِ|taqūlāni ; يَقُولُونَ|yaqūlūna ; يَقُلْنَ|yaqulna');
R('I:قول:au', 'juss', 'أَقُلْ|aqul ; تَقُلْ|taqul ; تَقُولِي|taqūlī ; يَقُلْ|yaqul ; تَقُلْ|taqul ; نَقُلْ|naqul ; تَقُولَا|taqūlā ; تَقُولُوا|taqūlū ; تَقُلْنَ|taqulna ; يَقُولَا|yaqūlā ; تَقُولَا|taqūlā ; يَقُولُوا|yaqūlū ; يَقُلْنَ|yaqulna');
R('I:قول:au', 'imp', '- ; قُلْ|qul ; قُولِي|qūlī ; - ; - ; - ; قُولَا|qūlā ; قُولُوا|qūlū ; قُلْنَ|qulna ; - ; - ; - ; -');
R('I:قول:au', 'pastPass', 'قِلْتُ|qiltu ; قِلْتَ|qilta ; قِلْتِ|qilti ; قِيلَ|qīla ; قِيلَتْ|qīlat ; قِلْنَا|qilnā ; قِلْتُمَا|qiltumā ; قِلْتُمْ|qiltum ; قِلْتُنَّ|qiltunna ; قِيلَا|qīlā ; قِيلَتَا|qīlatā ; قِيلُوا|qīlū ; قِلْنَ|qilna');
R('I:بيع:ai', 'past', 'بِعْتُ|biʿtu ; بِعْتَ|biʿta ; بِعْتِ|biʿti ; بَاعَ|bāʿa ; بَاعَتْ|bāʿat ; بِعْنَا|biʿnā ; بِعْتُمَا|biʿtumā ; بِعْتُمْ|biʿtum ; بِعْتُنَّ|biʿtunna ; بَاعَا|bāʿā ; بَاعَتَا|bāʿatā ; بَاعُوا|bāʿū ; بِعْنَ|biʿna');
R('I:بيع:ai', 'pres', 'أَبِيعُ|abīʿu ; تَبِيعُ|tabīʿu ; تَبِيعِينَ|tabīʿīna ; يَبِيعُ|yabīʿu ; تَبِيعُ|tabīʿu ; نَبِيعُ|nabīʿu ; تَبِيعَانِ|tabīʿāni ; تَبِيعُونَ|tabīʿūna ; تَبِعْنَ|tabiʿna ; يَبِيعَانِ|yabīʿāni ; تَبِيعَانِ|tabīʿāni ; يَبِيعُونَ|yabīʿūna ; يَبِعْنَ|yabiʿna');
R('I:بيع:ai', 'imp', '- ; بِعْ|biʿ ; بِيعِي|bīʿī ; - ; - ; - ; بِيعَا|bīʿā ; بِيعُوا|bīʿū ; بِعْنَ|biʿna ; - ; - ; - ; -');
R('I:رمي:ai', 'past', 'رَمَيْتُ|ramaytu ; رَمَيْتَ|ramayta ; رَمَيْتِ|ramayti ; رَمَى|ramā ; رَمَتْ|ramat ; رَمَيْنَا|ramaynā ; رَمَيْتُمَا|ramaytumā ; رَمَيْتُمْ|ramaytum ; رَمَيْتُنَّ|ramaytunna ; رَمَيَا|ramayā ; رَمَتَا|ramatā ; رَمَوْا|ramaw ; رَمَيْنَ|ramayna');
R('I:رمي:ai', 'pres', 'أَرْمِي|armī ; تَرْمِي|tarmī ; تَرْمِينَ|tarmīna ; يَرْمِي|yarmī ; تَرْمِي|tarmī ; نَرْمِي|narmī ; تَرْمِيَانِ|tarmiyāni ; تَرْمُونَ|tarmūna ; تَرْمِينَ|tarmīna ; يَرْمِيَانِ|yarmiyāni ; تَرْمِيَانِ|tarmiyāni ; يَرْمُونَ|yarmūna ; يَرْمِينَ|yarmīna');
R('I:رمي:ai', 'subj', 'أَرْمِيَ|armiya ; تَرْمِيَ|tarmiya ; تَرْمِي|tarmī ; يَرْمِيَ|yarmiya ; تَرْمِيَ|tarmiya ; نَرْمِيَ|narmiya ; تَرْمِيَا|tarmiyā ; تَرْمُوا|tarmū ; تَرْمِينَ|tarmīna ; يَرْمِيَا|yarmiyā ; تَرْمِيَا|tarmiyā ; يَرْمُوا|yarmū ; يَرْمِينَ|yarmīna');
R('I:رمي:ai', 'juss', 'أَرْمِ|armi ; تَرْمِ|tarmi ; تَرْمِي|tarmī ; يَرْمِ|yarmi ; تَرْمِ|tarmi ; نَرْمِ|narmi ; تَرْمِيَا|tarmiyā ; تَرْمُوا|tarmū ; تَرْمِينَ|tarmīna ; يَرْمِيَا|yarmiyā ; تَرْمِيَا|tarmiyā ; يَرْمُوا|yarmū ; يَرْمِينَ|yarmīna');
R('I:رمي:ai', 'imp', '- ; اِرْمِ|irmi ; اِرْمِي|irmī ; - ; - ; - ; اِرْمِيَا|irmiyā ; اِرْمُوا|irmū ; اِرْمِينَ|irmīna ; - ; - ; - ; -');
R('I:رمي:ai', 'pastPass', 'رُمِيتُ|rumītu ; رُمِيتَ|rumīta ; رُمِيتِ|rumīti ; رُمِيَ|rumiya ; رُمِيَتْ|rumiyat ; رُمِينَا|rumīnā ; رُمِيتُمَا|rumītumā ; رُمِيتُمْ|rumītum ; رُمِيتُنَّ|rumītunna ; رُمِيَا|rumiyā ; رُمِيَتَا|rumiyatā ; رُمُوا|rumū ; رُمِينَ|rumīna');

R('I:دعو:au', 'past', 'دَعَوْتُ|daʿawtu ; دَعَوْتَ|daʿawta ; دَعَوْتِ|daʿawti ; دَعَا|daʿā ; دَعَتْ|daʿat ; دَعَوْنَا|daʿawnā ; دَعَوْتُمَا|daʿawtumā ; دَعَوْتُمْ|daʿawtum ; دَعَوْتُنَّ|daʿawtunna ; دَعَوَا|daʿawā ; دَعَتَا|daʿatā ; دَعَوْا|daʿaw ; دَعَوْنَ|daʿawna');
R('I:دعو:au', 'pres', 'أَدْعُو|adʿū ; تَدْعُو|tadʿū ; تَدْعِينَ|tadʿīna ; يَدْعُو|yadʿū ; تَدْعُو|tadʿū ; نَدْعُو|nadʿū ; تَدْعُوَانِ|tadʿuwāni ; تَدْعُونَ|tadʿūna ; تَدْعُونَ|tadʿūna ; يَدْعُوَانِ|yadʿuwāni ; تَدْعُوَانِ|tadʿuwāni ; يَدْعُونَ|yadʿūna ; يَدْعُونَ|yadʿūna');
R('I:دعو:au', 'subj', 'أَدْعُوَ|adʿuwa ; تَدْعُوَ|tadʿuwa ; تَدْعِي|tadʿī ; يَدْعُوَ|yadʿuwa ; تَدْعُوَ|tadʿuwa ; نَدْعُوَ|nadʿuwa ; تَدْعُوَا|tadʿuwā ; تَدْعُوا|tadʿū ; تَدْعُونَ|tadʿūna ; يَدْعُوَا|yadʿuwā ; تَدْعُوَا|tadʿuwā ; يَدْعُوا|yadʿū ; يَدْعُونَ|yadʿūna');
R('I:دعو:au', 'juss', 'أَدْعُ|adʿu ; تَدْعُ|tadʿu ; تَدْعِي|tadʿī ; يَدْعُ|yadʿu ; تَدْعُ|tadʿu ; نَدْعُ|nadʿu ; تَدْعُوَا|tadʿuwā ; تَدْعُوا|tadʿū ; تَدْعُونَ|tadʿūna ; يَدْعُوَا|yadʿuwā ; تَدْعُوَا|tadʿuwā ; يَدْعُوا|yadʿū ; يَدْعُونَ|yadʿūna');
R('I:دعو:au', 'imp', '- ; اُدْعُ|udʿu ; اُدْعِي|udʿī ; - ; - ; - ; اُدْعُوَا|udʿuwā ; اُدْعُوا|udʿū ; اُدْعُونَ|udʿūna ; - ; - ; - ; -');
R('I:نسي:ia', 'past', 'نَسِيتُ|nasītu ; نَسِيتَ|nasīta ; نَسِيتِ|nasīti ; نَسِيَ|nasiya ; نَسِيَتْ|nasiyat ; نَسِينَا|nasīnā ; نَسِيتُمَا|nasītumā ; نَسِيتُمْ|nasītum ; نَسِيتُنَّ|nasītunna ; نَسِيَا|nasiyā ; نَسِيَتَا|nasiyatā ; نَسُوا|nasū ; نَسِينَ|nasīna');
R('I:نسي:ia', 'pres', 'أَنْسَى|ansā ; تَنْسَى|tansā ; تَنْسَيْنَ|tansayna ; يَنْسَى|yansā ; تَنْسَى|tansā ; نَنْسَى|nansā ; تَنْسَيَانِ|tansayāni ; تَنْسَوْنَ|tansawna ; تَنْسَيْنَ|tansayna ; يَنْسَيَانِ|yansayāni ; تَنْسَيَانِ|tansayāni ; يَنْسَوْنَ|yansawna ; يَنْسَيْنَ|yansayna');
R('I:نسي:ia', 'juss', 'أَنْسَ|ansa ; تَنْسَ|tansa ; تَنْسَيْ|tansay ; يَنْسَ|yansa ; تَنْسَ|tansa ; نَنْسَ|nansa ; تَنْسَيَا|tansayā ; تَنْسَوْا|tansaw ; تَنْسَيْنَ|tansayna ; يَنْسَيَا|yansayā ; تَنْسَيَا|tansayā ; يَنْسَوْا|yansaw ; يَنْسَيْنَ|yansayna');
R('I:نسي:ia', 'imp', '- ; اِنْسَ|insa ; اِنْسَيْ|insay ; - ; - ; - ; اِنْسَيَا|insayā ; اِنْسَوْا|insaw ; اِنْسَيْنَ|insayna ; - ; - ; - ; -');
R('I:مدد:au', 'past', 'مَدَدْتُ|madadtu ; مَدَدْتَ|madadta ; مَدَدْتِ|madadti ; مَدَّ|madda ; مَدَّتْ|maddat ; مَدَدْنَا|madadnā ; مَدَدْتُمَا|madadtumā ; مَدَدْتُمْ|madadtum ; مَدَدْتُنَّ|madadtunna ; مَدَّا|maddā ; مَدَّتَا|maddatā ; مَدُّوا|maddū ; مَدَدْنَ|madadna');
R('I:مدد:au', 'pres', 'أَمُدُّ|amuddu ; تَمُدُّ|tamuddu ; تَمُدِّينَ|tamuddīna ; يَمُدُّ|yamuddu ; تَمُدُّ|tamuddu ; نَمُدُّ|namuddu ; تَمُدَّانِ|tamuddāni ; تَمُدُّونَ|tamuddūna ; تَمْدُدْنَ|tamdudna ; يَمُدَّانِ|yamuddāni ; تَمُدَّانِ|tamuddāni ; يَمُدُّونَ|yamuddūna ; يَمْدُدْنَ|yamdudna');
R('I:مدد:au', 'juss', 'أَمُدَّ|amudda ; تَمُدَّ|tamudda ; تَمُدِّي|tamuddī ; يَمُدَّ|yamudda ; تَمُدَّ|tamudda ; نَمُدَّ|namudda ; تَمُدَّا|tamuddā ; تَمُدُّوا|tamuddū ; تَمْدُدْنَ|tamdudna ; يَمُدَّا|yamuddā ; تَمُدَّا|tamuddā ; يَمُدُّوا|yamuddū ; يَمْدُدْنَ|yamdudna');
R('I:مدد:au', 'imp', '- ; مُدَّ|mudda ; مُدِّي|muddī ; - ; - ; - ; مُدَّا|muddā ; مُدُّوا|muddū ; اُمْدُدْنَ|umdudna ; - ; - ; - ; -');
R('I:مدد:au', 'pastPass', 'مُدِدْتُ|mudidtu ; مُدِدْتَ|mudidta ; مُدِدْتِ|mudidti ; مُدَّ|mudda ; مُدَّتْ|muddat ; مُدِدْنَا|mudidnā ; مُدِدْتُمَا|mudidtumā ; مُدِدْتُمْ|mudidtum ; مُدِدْتُنَّ|mudidtunna ; مُدَّا|muddā ; مُدَّتَا|muddatā ; مُدُّوا|muddū ; مُدِدْنَ|mudidna');
R('I:وصل:ai', 'past', 'وَصَلْتُ|waṣaltu ; وَصَلْتَ|waṣalta ; وَصَلْتِ|waṣalti ; وَصَلَ|waṣala ; وَصَلَتْ|waṣalat ; وَصَلْنَا|waṣalnā ; وَصَلْتُمَا|waṣaltumā ; وَصَلْتُمْ|waṣaltum ; وَصَلْتُنَّ|waṣaltunna ; وَصَلَا|waṣalā ; وَصَلَتَا|waṣalatā ; وَصَلُوا|waṣalū ; وَصَلْنَ|waṣalna');
R('I:وصل:ai', 'pres', 'أَصِلُ|aṣilu ; تَصِلُ|taṣilu ; تَصِلِينَ|taṣilīna ; يَصِلُ|yaṣilu ; تَصِلُ|taṣilu ; نَصِلُ|naṣilu ; تَصِلَانِ|taṣilāni ; تَصِلُونَ|taṣilūna ; تَصِلْنَ|taṣilna ; يَصِلَانِ|yaṣilāni ; تَصِلَانِ|taṣilāni ; يَصِلُونَ|yaṣilūna ; يَصِلْنَ|yaṣilna');
R('I:وصل:ai', 'juss', 'أَصِلْ|aṣil ; تَصِلْ|taṣil ; تَصِلِي|taṣilī ; يَصِلْ|yaṣil ; تَصِلْ|taṣil ; نَصِلْ|naṣil ; تَصِلَا|taṣilā ; تَصِلُوا|taṣilū ; تَصِلْنَ|taṣilna ; يَصِلَا|yaṣilā ; تَصِلَا|taṣilā ; يَصِلُوا|yaṣilū ; يَصِلْنَ|yaṣilna');
R('I:وصل:ai', 'imp', '- ; صِلْ|ṣil ; صِلِي|ṣilī ; - ; - ; - ; صِلَا|ṣilā ; صِلُوا|ṣilū ; صِلْنَ|ṣilna ; - ; - ; - ; -');

R('I:ءكل:au', 'past', 'أَكَلْتُ|akaltu ; أَكَلْتَ|akalta ; أَكَلْتِ|akalti ; أَكَلَ|akala ; أَكَلَتْ|akalat ; أَكَلْنَا|akalnā ; أَكَلْتُمَا|akaltumā ; أَكَلْتُمْ|akaltum ; أَكَلْتُنَّ|akaltunna ; أَكَلَا|akalā ; أَكَلَتَا|akalatā ; أَكَلُوا|akalū ; أَكَلْنَ|akalna');
R('I:ءكل:au', 'pres', 'آكُلُ|ākulu ; تَأْكُلُ|taʾkulu ; تَأْكُلِينَ|taʾkulīna ; يَأْكُلُ|yaʾkulu ; تَأْكُلُ|taʾkulu ; نَأْكُلُ|naʾkulu ; تَأْكُلَانِ|taʾkulāni ; تَأْكُلُونَ|taʾkulūna ; تَأْكُلْنَ|taʾkulna ; يَأْكُلَانِ|yaʾkulāni ; تَأْكُلَانِ|taʾkulāni ; يَأْكُلُونَ|yaʾkulūna ; يَأْكُلْنَ|yaʾkulna');
R('I:ءكل:au', 'juss', 'آكُلْ|ākul ; تَأْكُلْ|taʾkul ; تَأْكُلِي|taʾkulī ; يَأْكُلْ|yaʾkul ; تَأْكُلْ|taʾkul ; نَأْكُلْ|naʾkul ; تَأْكُلَا|taʾkulā ; تَأْكُلُوا|taʾkulū ; تَأْكُلْنَ|taʾkulna ; يَأْكُلَا|yaʾkulā ; تَأْكُلَا|taʾkulā ; يَأْكُلُوا|yaʾkulū ; يَأْكُلْنَ|yaʾkulna');
R('I:ءكل:au', 'imp', '- ; كُلْ|kul ; كُلِي|kulī ; - ; - ; - ; كُلَا|kulā ; كُلُوا|kulū ; كُلْنَ|kulna ; - ; - ; - ; -');
R('I:كون:au', 'past', 'كُنْتُ|kuntu ; كُنْتَ|kunta ; كُنْتِ|kunti ; كَانَ|kāna ; كَانَتْ|kānat ; كُنَّا|kunnā ; كُنْتُمَا|kuntumā ; كُنْتُمْ|kuntum ; كُنْتُنَّ|kuntunna ; كَانَا|kānā ; كَانَتَا|kānatā ; كَانُوا|kānū ; كُنَّ|kunna');
R('I:كون:au', 'pres', 'أَكُونُ|akūnu ; تَكُونُ|takūnu ; تَكُونِينَ|takūnīna ; يَكُونُ|yakūnu ; تَكُونُ|takūnu ; نَكُونُ|nakūnu ; تَكُونَانِ|takūnāni ; تَكُونُونَ|takūnūna ; تَكُنَّ|takunna ; يَكُونَانِ|yakūnāni ; تَكُونَانِ|takūnāni ; يَكُونُونَ|yakūnūna ; يَكُنَّ|yakunna');
R('I:كون:au', 'juss', 'أَكُنْ|akun ; تَكُنْ|takun ; تَكُونِي|takūnī ; يَكُنْ|yakun ; تَكُنْ|takun ; نَكُنْ|nakun ; تَكُونَا|takūnā ; تَكُونُوا|takūnū ; تَكُنَّ|takunna ; يَكُونَا|yakūnā ; تَكُونَا|takūnā ; يَكُونُوا|yakūnū ; يَكُنَّ|yakunna');
R('I:كون:au', 'imp', '- ; كُنْ|kun ; كُونِي|kūnī ; - ; - ; - ; كُونَا|kūnā ; كُونُوا|kūnū ; كُنَّ|kunna ; - ; - ; - ; -');
R('I:رءي:aa', 'pres', 'أَرَى|arā ; تَرَى|tarā ; تَرَيْنَ|tarayna ; يَرَى|yarā ; تَرَى|tarā ; نَرَى|narā ; تَرَيَانِ|tarayāni ; تَرَوْنَ|tarawna ; تَرَيْنَ|tarayna ; يَرَيَانِ|yarayāni ; تَرَيَانِ|tarayāni ; يَرَوْنَ|yarawna ; يَرَيْنَ|yarayna');
R('I:رءي:aa', 'juss', 'أَرَ|ara ; تَرَ|tara ; تَرَيْ|taray ; يَرَ|yara ; تَرَ|tara ; نَرَ|nara ; تَرَيَا|tarayā ; تَرَوْا|taraw ; تَرَيْنَ|tarayna ; يَرَيَا|yarayā ; تَرَيَا|tarayā ; يَرَوْا|yaraw ; يَرَيْنَ|yarayna');
R('I:رءي:aa', 'imp', '- ; رَ|ra ; رَيْ|ray ; - ; - ; - ; رَيَا|rayā ; رَوْا|raw ; رَيْنَ|rayna ; - ; - ; - ; -');
R('I:ءتي:ai', 'pres', 'آتِي|ātī ; تَأْتِي|taʾtī ; تَأْتِينَ|taʾtīna ; يَأْتِي|yaʾtī ; تَأْتِي|taʾtī ; نَأْتِي|naʾtī ; تَأْتِيَانِ|taʾtiyāni ; تَأْتُونَ|taʾtūna ; تَأْتِينَ|taʾtīna ; يَأْتِيَانِ|yaʾtiyāni ; تَأْتِيَانِ|taʾtiyāni ; يَأْتُونَ|yaʾtūna ; يَأْتِينَ|yaʾtīna');
R('I:ءتي:ai', 'imp', '- ; اِئْتِ|iʾti ; اِئْتِي|iʾtī ; - ; - ; - ; اِئْتِيَا|iʾtiyā ; اِئْتُوا|iʾtū ; اِئْتِينَ|iʾtīna ; - ; - ; - ; -');
R('I:جيء:ai', 'past', 'جِئْتُ|jiʾtu ; جِئْتَ|jiʾta ; جِئْتِ|jiʾti ; جَاءَ|jāʾa ; جَاءَتْ|jāʾat ; جِئْنَا|jiʾnā ; جِئْتُمَا|jiʾtumā ; جِئْتُمْ|jiʾtum ; جِئْتُنَّ|jiʾtunna ; جَاءَا|jāʾā ; جَاءَتَا|jāʾatā ; جَاؤُوا|jāʾū ; جِئْنَ|jiʾna');
R('I:جيء:ai', 'pres', 'أَجِيءُ|ajīʾu ; تَجِيءُ|tajīʾu ; تَجِيئِينَ|tajīʾīna ; يَجِيءُ|yajīʾu ; تَجِيءُ|tajīʾu ; نَجِيءُ|najīʾu ; تَجِيئَانِ|tajīʾāni ; تَجِيئُونَ|tajīʾūna ; تَجِئْنَ|tajiʾna ; يَجِيئَانِ|yajīʾāni ; تَجِيئَانِ|tajīʾāni ; يَجِيئُونَ|yajīʾūna ; يَجِئْنَ|yajiʾna');
R('I:جيء:ai', 'imp', '- ; جِئْ|jiʾ ; جِيئِي|jīʾī ; - ; - ; - ; جِيئَا|jīʾā ; جِيئُوا|jīʾū ; جِئْنَ|jiʾna ; - ; - ; - ; -');
R('I:قرء:aa', 'past', 'قَرَأْتُ|qaraʾtu ; قَرَأْتَ|qaraʾta ; قَرَأْتِ|qaraʾti ; قَرَأَ|qaraʾa ; قَرَأَتْ|qaraʾat ; قَرَأْنَا|qaraʾnā ; قَرَأْتُمَا|qaraʾtumā ; قَرَأْتُمْ|qaraʾtum ; قَرَأْتُنَّ|qaraʾtunna ; قَرَآ|qaraʾā ; قَرَأَتَا|qaraʾatā ; قَرَؤُوا|qaraʾū ; قَرَأْنَ|qaraʾna');
R('I:قرء:aa', 'pres', 'أَقْرَأُ|aqraʾu ; تَقْرَأُ|taqraʾu ; تَقْرَئِينَ|taqraʾīna ; يَقْرَأُ|yaqraʾu ; تَقْرَأُ|taqraʾu ; نَقْرَأُ|naqraʾu ; تَقْرَآنِ|taqraʾāni ; تَقْرَؤُونَ|taqraʾūna ; تَقْرَأْنَ|taqraʾna ; يَقْرَآنِ|yaqraʾāni ; تَقْرَآنِ|taqraʾāni ; يَقْرَؤُونَ|yaqraʾūna ; يَقْرَأْنَ|yaqraʾna');
R('I:قرء:aa', 'imp', '- ; اِقْرَأْ|iqraʾ ; اِقْرَئِي|iqraʾī ; - ; - ; - ; اِقْرَآ|iqraʾā ; اِقْرَؤُوا|iqraʾū ; اِقْرَأْنَ|iqraʾna ; - ; - ; - ; -');

R('II:درس', 'past', 'دَرَّسْتُ|darrastu ; دَرَّسْتَ|darrasta ; دَرَّسْتِ|darrasti ; دَرَّسَ|darrasa ; دَرَّسَتْ|darrasat ; دَرَّسْنَا|darrasnā ; دَرَّسْتُمَا|darrastumā ; دَرَّسْتُمْ|darrastum ; دَرَّسْتُنَّ|darrastunna ; دَرَّسَا|darrasā ; دَرَّسَتَا|darrasatā ; دَرَّسُوا|darrasū ; دَرَّسْنَ|darrasna');
R('II:درس', 'pres', 'أُدَرِّسُ|udarrisu ; تُدَرِّسُ|tudarrisu ; تُدَرِّسِينَ|tudarrisīna ; يُدَرِّسُ|yudarrisu ; تُدَرِّسُ|tudarrisu ; نُدَرِّسُ|nudarrisu ; تُدَرِّسَانِ|tudarrisāni ; تُدَرِّسُونَ|tudarrisūna ; تُدَرِّسْنَ|tudarrisna ; يُدَرِّسَانِ|yudarrisāni ; تُدَرِّسَانِ|tudarrisāni ; يُدَرِّسُونَ|yudarrisūna ; يُدَرِّسْنَ|yudarrisna');
R('II:درس', 'imp', '- ; دَرِّسْ|darris ; دَرِّسِي|darrisī ; - ; - ; - ; دَرِّسَا|darrisā ; دَرِّسُوا|darrisū ; دَرِّسْنَ|darrisna ; - ; - ; - ; -');
R('II:درس', 'pastPass', 'دُرِّسْتُ|durristu ; دُرِّسْتَ|durrista ; دُرِّسْتِ|durristi ; دُرِّسَ|durrisa ; دُرِّسَتْ|durrisat ; دُرِّسْنَا|durrisnā ; دُرِّسْتُمَا|durristumā ; دُرِّسْتُمْ|durristum ; دُرِّسْتُنَّ|durristunna ; دُرِّسَا|durrisā ; دُرِّسَتَا|durrisatā ; دُرِّسُوا|durrisū ; دُرِّسْنَ|durrisna');
R('II:درس', 'presPass', 'أُدَرَّسُ|udarrasu ; تُدَرَّسُ|tudarrasu ; تُدَرَّسِينَ|tudarrasīna ; يُدَرَّسُ|yudarrasu ; تُدَرَّسُ|tudarrasu ; نُدَرَّسُ|nudarrasu ; تُدَرَّسَانِ|tudarrasāni ; تُدَرَّسُونَ|tudarrasūna ; تُدَرَّسْنَ|tudarrasna ; يُدَرَّسَانِ|yudarrasāni ; تُدَرَّسَانِ|tudarrasāni ; يُدَرَّسُونَ|yudarrasūna ; يُدَرَّسْنَ|yudarrasna');
R('II:درس', 'actPart', 'مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun ; مُدَرِّسٌ|mudarrisun');
R('III:سعد', 'past', 'سَاعَدْتُ|sāʿadtu ; سَاعَدْتَ|sāʿadta ; سَاعَدْتِ|sāʿadti ; سَاعَدَ|sāʿada ; سَاعَدَتْ|sāʿadat ; سَاعَدْنَا|sāʿadnā ; سَاعَدْتُمَا|sāʿadtumā ; سَاعَدْتُمْ|sāʿadtum ; سَاعَدْتُنَّ|sāʿadtunna ; سَاعَدَا|sāʿadā ; سَاعَدَتَا|sāʿadatā ; سَاعَدُوا|sāʿadū ; سَاعَدْنَ|sāʿadna');
R('III:سعد', 'pres', 'أُسَاعِدُ|usāʿidu ; تُسَاعِدُ|tusāʿidu ; تُسَاعِدِينَ|tusāʿidīna ; يُسَاعِدُ|yusāʿidu ; تُسَاعِدُ|tusāʿidu ; نُسَاعِدُ|nusāʿidu ; تُسَاعِدَانِ|tusāʿidāni ; تُسَاعِدُونَ|tusāʿidūna ; تُسَاعِدْنَ|tusāʿidna ; يُسَاعِدَانِ|yusāʿidāni ; تُسَاعِدَانِ|tusāʿidāni ; يُسَاعِدُونَ|yusāʿidūna ; يُسَاعِدْنَ|yusāʿidna');
R('III:سعد', 'imp', '- ; سَاعِدْ|sāʿid ; سَاعِدِي|sāʿidī ; - ; - ; - ; سَاعِدَا|sāʿidā ; سَاعِدُوا|sāʿidū ; سَاعِدْنَ|sāʿidna ; - ; - ; - ; -');
R('III:سعد', 'pastPass', 'سُوعِدْتُ|sūʿidtu ; سُوعِدْتَ|sūʿidta ; سُوعِدْتِ|sūʿidti ; سُوعِدَ|sūʿida ; سُوعِدَتْ|sūʿidat ; سُوعِدْنَا|sūʿidnā ; سُوعِدْتُمَا|sūʿidtumā ; سُوعِدْتُمْ|sūʿidtum ; سُوعِدْتُنَّ|sūʿidtunna ; سُوعِدَا|sūʿidā ; سُوعِدَتَا|sūʿidatā ; سُوعِدُوا|sūʿidū ; سُوعِدْنَ|sūʿidna');
R('IV:رسل', 'past', 'أَرْسَلْتُ|arsaltu ; أَرْسَلْتَ|arsalta ; أَرْسَلْتِ|arsalti ; أَرْسَلَ|arsala ; أَرْسَلَتْ|arsalat ; أَرْسَلْنَا|arsalnā ; أَرْسَلْتُمَا|arsaltumā ; أَرْسَلْتُمْ|arsaltum ; أَرْسَلْتُنَّ|arsaltunna ; أَرْسَلَا|arsalā ; أَرْسَلَتَا|arsalatā ; أَرْسَلُوا|arsalū ; أَرْسَلْنَ|arsalna');
R('IV:رسل', 'pres', 'أُرْسِلُ|ursilu ; تُرْسِلُ|tursilu ; تُرْسِلِينَ|tursilīna ; يُرْسِلُ|yursilu ; تُرْسِلُ|tursilu ; نُرْسِلُ|nursilu ; تُرْسِلَانِ|tursilāni ; تُرْسِلُونَ|tursilūna ; تُرْسِلْنَ|tursilna ; يُرْسِلَانِ|yursilāni ; تُرْسِلَانِ|tursilāni ; يُرْسِلُونَ|yursilūna ; يُرْسِلْنَ|yursilna');
R('IV:رسل', 'imp', '- ; أَرْسِلْ|arsil ; أَرْسِلِي|arsilī ; - ; - ; - ; أَرْسِلَا|arsilā ; أَرْسِلُوا|arsilū ; أَرْسِلْنَ|arsilna ; - ; - ; - ; -');
R('IV:رسل', 'pastPass', 'أُرْسِلْتُ|ursiltu ; أُرْسِلْتَ|ursilta ; أُرْسِلْتِ|ursilti ; أُرْسِلَ|ursila ; أُرْسِلَتْ|ursilat ; أُرْسِلْنَا|ursilnā ; أُرْسِلْتُمَا|ursiltumā ; أُرْسِلْتُمْ|ursiltum ; أُرْسِلْتُنَّ|ursiltunna ; أُرْسِلَا|ursilā ; أُرْسِلَتَا|ursilatā ; أُرْسِلُوا|ursilū ; أُرْسِلْنَ|ursilna');
R('V:علم', 'past', 'تَعَلَّمْتُ|taʿallamtu ; تَعَلَّمْتَ|taʿallamta ; تَعَلَّمْتِ|taʿallamti ; تَعَلَّمَ|taʿallama ; تَعَلَّمَتْ|taʿallamat ; تَعَلَّمْنَا|taʿallamnā ; تَعَلَّمْتُمَا|taʿallamtumā ; تَعَلَّمْتُمْ|taʿallamtum ; تَعَلَّمْتُنَّ|taʿallamtunna ; تَعَلَّمَا|taʿallamā ; تَعَلَّمَتَا|taʿallamatā ; تَعَلَّمُوا|taʿallamū ; تَعَلَّمْنَ|taʿallamna');
R('V:علم', 'pres', 'أَتَعَلَّمُ|ataʿallamu ; تَتَعَلَّمُ|tataʿallamu ; تَتَعَلَّمِينَ|tataʿallamīna ; يَتَعَلَّمُ|yataʿallamu ; تَتَعَلَّمُ|tataʿallamu ; نَتَعَلَّمُ|nataʿallamu ; تَتَعَلَّمَانِ|tataʿallamāni ; تَتَعَلَّمُونَ|tataʿallamūna ; تَتَعَلَّمْنَ|tataʿallamna ; يَتَعَلَّمَانِ|yataʿallamāni ; تَتَعَلَّمَانِ|tataʿallamāni ; يَتَعَلَّمُونَ|yataʿallamūna ; يَتَعَلَّمْنَ|yataʿallamna');
R('V:علم', 'imp', '- ; تَعَلَّمْ|taʿallam ; تَعَلَّمِي|taʿallamī ; - ; - ; - ; تَعَلَّمَا|taʿallamā ; تَعَلَّمُوا|taʿallamū ; تَعَلَّمْنَ|taʿallamna ; - ; - ; - ; -');

R('VII:كسر', 'past', 'اِنْكَسَرْتُ|inkasartu ; اِنْكَسَرْتَ|inkasarta ; اِنْكَسَرْتِ|inkasarti ; اِنْكَسَرَ|inkasara ; اِنْكَسَرَتْ|inkasarat ; اِنْكَسَرْنَا|inkasarnā ; اِنْكَسَرْتُمَا|inkasartumā ; اِنْكَسَرْتُمْ|inkasartum ; اِنْكَسَرْتُنَّ|inkasartunna ; اِنْكَسَرَا|inkasarā ; اِنْكَسَرَتَا|inkasaratā ; اِنْكَسَرُوا|inkasarū ; اِنْكَسَرْنَ|inkasarna');
R('VII:كسر', 'pres', 'أَنْكَسِرُ|ankasiru ; تَنْكَسِرُ|tankasiru ; تَنْكَسِرِينَ|tankasirīna ; يَنْكَسِرُ|yankasiru ; تَنْكَسِرُ|tankasiru ; نَنْكَسِرُ|nankasiru ; تَنْكَسِرَانِ|tankasirāni ; تَنْكَسِرُونَ|tankasirūna ; تَنْكَسِرْنَ|tankasirna ; يَنْكَسِرَانِ|yankasirāni ; تَنْكَسِرَانِ|tankasirāni ; يَنْكَسِرُونَ|yankasirūna ; يَنْكَسِرْنَ|yankasirna');
R('VII:كسر', 'imp', '- ; اِنْكَسِرْ|inkasir ; اِنْكَسِرِي|inkasirī ; - ; - ; - ; اِنْكَسِرَا|inkasirā ; اِنْكَسِرُوا|inkasirū ; اِنْكَسِرْنَ|inkasirna ; - ; - ; - ; -');
R('VIII:جمع', 'past', 'اِجْتَمَعْتُ|ijtamaʿtu ; اِجْتَمَعْتَ|ijtamaʿta ; اِجْتَمَعْتِ|ijtamaʿti ; اِجْتَمَعَ|ijtamaʿa ; اِجْتَمَعَتْ|ijtamaʿat ; اِجْتَمَعْنَا|ijtamaʿnā ; اِجْتَمَعْتُمَا|ijtamaʿtumā ; اِجْتَمَعْتُمْ|ijtamaʿtum ; اِجْتَمَعْتُنَّ|ijtamaʿtunna ; اِجْتَمَعَا|ijtamaʿā ; اِجْتَمَعَتَا|ijtamaʿatā ; اِجْتَمَعُوا|ijtamaʿū ; اِجْتَمَعْنَ|ijtamaʿna');
R('VIII:جمع', 'pres', 'أَجْتَمِعُ|ajtamiʿu ; تَجْتَمِعُ|tajtamiʿu ; تَجْتَمِعِينَ|tajtamiʿīna ; يَجْتَمِعُ|yajtamiʿu ; تَجْتَمِعُ|tajtamiʿu ; نَجْتَمِعُ|najtamiʿu ; تَجْتَمِعَانِ|tajtamiʿāni ; تَجْتَمِعُونَ|tajtamiʿūna ; تَجْتَمِعْنَ|tajtamiʿna ; يَجْتَمِعَانِ|yajtamiʿāni ; تَجْتَمِعَانِ|tajtamiʿāni ; يَجْتَمِعُونَ|yajtamiʿūna ; يَجْتَمِعْنَ|yajtamiʿna');
R('VIII:جمع', 'imp', '- ; اِجْتَمِعْ|ijtamiʿ ; اِجْتَمِعِي|ijtamiʿī ; - ; - ; - ; اِجْتَمِعَا|ijtamiʿā ; اِجْتَمِعُوا|ijtamiʿū ; اِجْتَمِعْنَ|ijtamiʿna ; - ; - ; - ; -');
R('IX:حمر', 'past', 'اِحْمَرَرْتُ|iḥmarartu ; اِحْمَرَرْتَ|iḥmararta ; اِحْمَرَرْتِ|iḥmararti ; اِحْمَرَّ|iḥmarra ; اِحْمَرَّتْ|iḥmarrat ; اِحْمَرَرْنَا|iḥmararnā ; اِحْمَرَرْتُمَا|iḥmarartumā ; اِحْمَرَرْتُمْ|iḥmarartum ; اِحْمَرَرْتُنَّ|iḥmarartunna ; اِحْمَرَّا|iḥmarrā ; اِحْمَرَّتَا|iḥmarratā ; اِحْمَرُّوا|iḥmarrū ; اِحْمَرَرْنَ|iḥmararna');
R('IX:حمر', 'pres', 'أَحْمَرُّ|aḥmarru ; تَحْمَرُّ|taḥmarru ; تَحْمَرِّينَ|taḥmarrīna ; يَحْمَرُّ|yaḥmarru ; تَحْمَرُّ|taḥmarru ; نَحْمَرُّ|naḥmarru ; تَحْمَرَّانِ|taḥmarrāni ; تَحْمَرُّونَ|taḥmarrūna ; تَحْمَرِرْنَ|taḥmarirna ; يَحْمَرَّانِ|yaḥmarrāni ; تَحْمَرَّانِ|taḥmarrāni ; يَحْمَرُّونَ|yaḥmarrūna ; يَحْمَرِرْنَ|yaḥmarirna');
R('IX:حمر', 'juss', 'أَحْمَرَّ|aḥmarra ; تَحْمَرَّ|taḥmarra ; تَحْمَرِّي|taḥmarrī ; يَحْمَرَّ|yaḥmarra ; تَحْمَرَّ|taḥmarra ; نَحْمَرَّ|naḥmarra ; تَحْمَرَّا|taḥmarrā ; تَحْمَرُّوا|taḥmarrū ; تَحْمَرِرْنَ|taḥmarirna ; يَحْمَرَّا|yaḥmarrā ; تَحْمَرَّا|taḥmarrā ; يَحْمَرُّوا|yaḥmarrū ; يَحْمَرِرْنَ|yaḥmarirna');
R('IX:حمر', 'imp', '- ; اِحْمَرَّ|iḥmarra ; اِحْمَرِّي|iḥmarrī ; - ; - ; - ; اِحْمَرَّا|iḥmarrā ; اِحْمَرُّوا|iḥmarrū ; اِحْمَرِرْنَ|iḥmarirna ; - ; - ; - ; -');
R('X:خدم', 'past', 'اِسْتَخْدَمْتُ|istakhdamtu ; اِسْتَخْدَمْتَ|istakhdamta ; اِسْتَخْدَمْتِ|istakhdamti ; اِسْتَخْدَمَ|istakhdama ; اِسْتَخْدَمَتْ|istakhdamat ; اِسْتَخْدَمْنَا|istakhdamnā ; اِسْتَخْدَمْتُمَا|istakhdamtumā ; اِسْتَخْدَمْتُمْ|istakhdamtum ; اِسْتَخْدَمْتُنَّ|istakhdamtunna ; اِسْتَخْدَمَا|istakhdamā ; اِسْتَخْدَمَتَا|istakhdamatā ; اِسْتَخْدَمُوا|istakhdamū ; اِسْتَخْدَمْنَ|istakhdamna');
R('X:خدم', 'pres', 'أَسْتَخْدِمُ|astakhdimu ; تَسْتَخْدِمُ|tastakhdimu ; تَسْتَخْدِمِينَ|tastakhdimīna ; يَسْتَخْدِمُ|yastakhdimu ; تَسْتَخْدِمُ|tastakhdimu ; نَسْتَخْدِمُ|nastakhdimu ; تَسْتَخْدِمَانِ|tastakhdimāni ; تَسْتَخْدِمُونَ|tastakhdimūna ; تَسْتَخْدِمْنَ|tastakhdimna ; يَسْتَخْدِمَانِ|yastakhdimāni ; تَسْتَخْدِمَانِ|tastakhdimāni ; يَسْتَخْدِمُونَ|yastakhdimūna ; يَسْتَخْدِمْنَ|yastakhdimna');
R('X:خدم', 'imp', '- ; اِسْتَخْدِمْ|istakhdim ; اِسْتَخْدِمِي|istakhdimī ; - ; - ; - ; اِسْتَخْدِمَا|istakhdimā ; اِسْتَخْدِمُوا|istakhdimū ; اِسْتَخْدِمْنَ|istakhdimna ; - ; - ; - ; -');
R('X:خدم', 'pastPass', 'اُسْتُخْدِمْتُ|ustukhdimtu ; اُسْتُخْدِمْتَ|ustukhdimta ; اُسْتُخْدِمْتِ|ustukhdimti ; اُسْتُخْدِمَ|ustukhdima ; اُسْتُخْدِمَتْ|ustukhdimat ; اُسْتُخْدِمْنَا|ustukhdimnā ; اُسْتُخْدِمْتُمَا|ustukhdimtumā ; اُسْتُخْدِمْتُمْ|ustukhdimtum ; اُسْتُخْدِمْتُنَّ|ustukhdimtunna ; اُسْتُخْدِمَا|ustukhdimā ; اُسْتُخْدِمَتَا|ustukhdimatā ; اُسْتُخْدِمُوا|ustukhdimū ; اُسْتُخْدِمْنَ|ustukhdimna');
R('Q1:ترجم', 'past', 'تَرْجَمْتُ|tarjamtu ; تَرْجَمْتَ|tarjamta ; تَرْجَمْتِ|tarjamti ; تَرْجَمَ|tarjama ; تَرْجَمَتْ|tarjamat ; تَرْجَمْنَا|tarjamnā ; تَرْجَمْتُمَا|tarjamtumā ; تَرْجَمْتُمْ|tarjamtum ; تَرْجَمْتُنَّ|tarjamtunna ; تَرْجَمَا|tarjamā ; تَرْجَمَتَا|tarjamatā ; تَرْجَمُوا|tarjamū ; تَرْجَمْنَ|tarjamna');
R('Q1:ترجم', 'pres', 'أُتَرْجِمُ|utarjimu ; تُتَرْجِمُ|tutarjimu ; تُتَرْجِمِينَ|tutarjimīna ; يُتَرْجِمُ|yutarjimu ; تُتَرْجِمُ|tutarjimu ; نُتَرْجِمُ|nutarjimu ; تُتَرْجِمَانِ|tutarjimāni ; تُتَرْجِمُونَ|tutarjimūna ; تُتَرْجِمْنَ|tutarjimna ; يُتَرْجِمَانِ|yutarjimāni ; تُتَرْجِمَانِ|tutarjimāni ; يُتَرْجِمُونَ|yutarjimūna ; يُتَرْجِمْنَ|yutarjimna');
R('Q1:ترجم', 'imp', '- ; تَرْجِمْ|tarjim ; تَرْجِمِي|tarjimī ; - ; - ; - ; تَرْجِمَا|tarjimā ; تَرْجِمُوا|tarjimū ; تَرْجِمْنَ|tarjimna ; - ; - ; - ; -');
R('Q1:ترجم', 'pastPass', 'تُرْجِمْتُ|turjimtu ; تُرْجِمْتَ|turjimta ; تُرْجِمْتِ|turjimti ; تُرْجِمَ|turjima ; تُرْجِمَتْ|turjimat ; تُرْجِمْنَا|turjimnā ; تُرْجِمْتُمَا|turjimtumā ; تُرْجِمْتُمْ|turjimtum ; تُرْجِمْتُنَّ|turjimtunna ; تُرْجِمَا|turjimā ; تُرْجِمَتَا|turjimatā ; تُرْجِمُوا|turjimū ; تُرْجِمْنَ|turjimna');
R('Q2:دحرج', 'past', 'تَدَحْرَجْتُ|tadaḥrajtu ; تَدَحْرَجْتَ|tadaḥrajta ; تَدَحْرَجْتِ|tadaḥrajti ; تَدَحْرَجَ|tadaḥraja ; تَدَحْرَجَتْ|tadaḥrajat ; تَدَحْرَجْنَا|tadaḥrajnā ; تَدَحْرَجْتُمَا|tadaḥrajtumā ; تَدَحْرَجْتُمْ|tadaḥrajtum ; تَدَحْرَجْتُنَّ|tadaḥrajtunna ; تَدَحْرَجَا|tadaḥrajā ; تَدَحْرَجَتَا|tadaḥrajatā ; تَدَحْرَجُوا|tadaḥrajū ; تَدَحْرَجْنَ|tadaḥrajna');
R('Q2:دحرج', 'pres', 'أَتَدَحْرَجُ|atadaḥraju ; تَتَدَحْرَجُ|tatadaḥraju ; تَتَدَحْرَجِينَ|tatadaḥrajīna ; يَتَدَحْرَجُ|yatadaḥraju ; تَتَدَحْرَجُ|tatadaḥraju ; نَتَدَحْرَجُ|natadaḥraju ; تَتَدَحْرَجَانِ|tatadaḥrajāni ; تَتَدَحْرَجُونَ|tatadaḥrajūna ; تَتَدَحْرَجْنَ|tatadaḥrajna ; يَتَدَحْرَجَانِ|yatadaḥrajāni ; تَتَدَحْرَجَانِ|tatadaḥrajāni ; يَتَدَحْرَجُونَ|yatadaḥrajūna ; يَتَدَحْرَجْنَ|yatadaḥrajna');
R('Q2:دحرج', 'imp', '- ; تَدَحْرَجْ|tadaḥraj ; تَدَحْرَجِي|tadaḥrajī ; - ; - ; - ; تَدَحْرَجَا|tadaḥrajā ; تَدَحْرَجُوا|tadaḥrajū ; تَدَحْرَجْنَ|tadaḥrajna ; - ; - ; - ; -');

R('IV:قوم', 'past', 'أَقَمْتُ|aqamtu ; أَقَمْتَ|aqamta ; أَقَمْتِ|aqamti ; أَقَامَ|aqāma ; أَقَامَتْ|aqāmat ; أَقَمْنَا|aqamnā ; أَقَمْتُمَا|aqamtumā ; أَقَمْتُمْ|aqamtum ; أَقَمْتُنَّ|aqamtunna ; أَقَامَا|aqāmā ; أَقَامَتَا|aqāmatā ; أَقَامُوا|aqāmū ; أَقَمْنَ|aqamna');
R('IV:قوم', 'pres', 'أُقِيمُ|uqīmu ; تُقِيمُ|tuqīmu ; تُقِيمِينَ|tuqīmīna ; يُقِيمُ|yuqīmu ; تُقِيمُ|tuqīmu ; نُقِيمُ|nuqīmu ; تُقِيمَانِ|tuqīmāni ; تُقِيمُونَ|tuqīmūna ; تُقِمْنَ|tuqimna ; يُقِيمَانِ|yuqīmāni ; تُقِيمَانِ|tuqīmāni ; يُقِيمُونَ|yuqīmūna ; يُقِمْنَ|yuqimna');
R('IV:قوم', 'juss', 'أُقِمْ|uqim ; تُقِمْ|tuqim ; تُقِيمِي|tuqīmī ; يُقِمْ|yuqim ; تُقِمْ|tuqim ; نُقِمْ|nuqim ; تُقِيمَا|tuqīmā ; تُقِيمُوا|tuqīmū ; تُقِمْنَ|tuqimna ; يُقِيمَا|yuqīmā ; تُقِيمَا|tuqīmā ; يُقِيمُوا|yuqīmū ; يُقِمْنَ|yuqimna');
R('IV:قوم', 'imp', '- ; أَقِمْ|aqim ; أَقِيمِي|aqīmī ; - ; - ; - ; أَقِيمَا|aqīmā ; أَقِيمُوا|aqīmū ; أَقِمْنَ|aqimna ; - ; - ; - ; -');
R('IV:قوم', 'pastPass', 'أُقِمْتُ|uqimtu ; أُقِمْتَ|uqimta ; أُقِمْتِ|uqimti ; أُقِيمَ|uqīma ; أُقِيمَتْ|uqīmat ; أُقِمْنَا|uqimnā ; أُقِمْتُمَا|uqimtumā ; أُقِمْتُمْ|uqimtum ; أُقِمْتُنَّ|uqimtunna ; أُقِيمَا|uqīmā ; أُقِيمَتَا|uqīmatā ; أُقِيمُوا|uqīmū ; أُقِمْنَ|uqimna');
R('X:قوم', 'past', 'اِسْتَقَمْتُ|istaqamtu ; اِسْتَقَمْتَ|istaqamta ; اِسْتَقَمْتِ|istaqamti ; اِسْتَقَامَ|istaqāma ; اِسْتَقَامَتْ|istaqāmat ; اِسْتَقَمْنَا|istaqamnā ; اِسْتَقَمْتُمَا|istaqamtumā ; اِسْتَقَمْتُمْ|istaqamtum ; اِسْتَقَمْتُنَّ|istaqamtunna ; اِسْتَقَامَا|istaqāmā ; اِسْتَقَامَتَا|istaqāmatā ; اِسْتَقَامُوا|istaqāmū ; اِسْتَقَمْنَ|istaqamna');
R('X:قوم', 'pres', 'أَسْتَقِيمُ|astaqīmu ; تَسْتَقِيمُ|tastaqīmu ; تَسْتَقِيمِينَ|tastaqīmīna ; يَسْتَقِيمُ|yastaqīmu ; تَسْتَقِيمُ|tastaqīmu ; نَسْتَقِيمُ|nastaqīmu ; تَسْتَقِيمَانِ|tastaqīmāni ; تَسْتَقِيمُونَ|tastaqīmūna ; تَسْتَقِمْنَ|tastaqimna ; يَسْتَقِيمَانِ|yastaqīmāni ; تَسْتَقِيمَانِ|tastaqīmāni ; يَسْتَقِيمُونَ|yastaqīmūna ; يَسْتَقِمْنَ|yastaqimna');
R('X:قوم', 'juss', 'أَسْتَقِمْ|astaqim ; تَسْتَقِمْ|tastaqim ; تَسْتَقِيمِي|tastaqīmī ; يَسْتَقِمْ|yastaqim ; تَسْتَقِمْ|tastaqim ; نَسْتَقِمْ|nastaqim ; تَسْتَقِيمَا|tastaqīmā ; تَسْتَقِيمُوا|tastaqīmū ; تَسْتَقِمْنَ|tastaqimna ; يَسْتَقِيمَا|yastaqīmā ; تَسْتَقِيمَا|tastaqīmā ; يَسْتَقِيمُوا|yastaqīmū ; يَسْتَقِمْنَ|yastaqimna');
R('X:قوم', 'imp', '- ; اِسْتَقِمْ|istaqim ; اِسْتَقِيمِي|istaqīmī ; - ; - ; - ; اِسْتَقِيمَا|istaqīmā ; اِسْتَقِيمُوا|istaqīmū ; اِسْتَقِمْنَ|istaqimna ; - ; - ; - ; -');
R('VIII:خير', 'past', 'اِخْتَرْتُ|ikhtartu ; اِخْتَرْتَ|ikhtarta ; اِخْتَرْتِ|ikhtarti ; اِخْتَارَ|ikhtāra ; اِخْتَارَتْ|ikhtārat ; اِخْتَرْنَا|ikhtarnā ; اِخْتَرْتُمَا|ikhtartumā ; اِخْتَرْتُمْ|ikhtartum ; اِخْتَرْتُنَّ|ikhtartunna ; اِخْتَارَا|ikhtārā ; اِخْتَارَتَا|ikhtāratā ; اِخْتَارُوا|ikhtārū ; اِخْتَرْنَ|ikhtarna');
R('VIII:خير', 'pres', 'أَخْتَارُ|akhtāru ; تَخْتَارُ|takhtāru ; تَخْتَارِينَ|takhtārīna ; يَخْتَارُ|yakhtāru ; تَخْتَارُ|takhtāru ; نَخْتَارُ|nakhtāru ; تَخْتَارَانِ|takhtārāni ; تَخْتَارُونَ|takhtārūna ; تَخْتَرْنَ|takhtarna ; يَخْتَارَانِ|yakhtārāni ; تَخْتَارَانِ|takhtārāni ; يَخْتَارُونَ|yakhtārūna ; يَخْتَرْنَ|yakhtarna');
R('VIII:خير', 'juss', 'أَخْتَرْ|akhtar ; تَخْتَرْ|takhtar ; تَخْتَارِي|takhtārī ; يَخْتَرْ|yakhtar ; تَخْتَرْ|takhtar ; نَخْتَرْ|nakhtar ; تَخْتَارَا|takhtārā ; تَخْتَارُوا|takhtārū ; تَخْتَرْنَ|takhtarna ; يَخْتَارَا|yakhtārā ; تَخْتَارَا|takhtārā ; يَخْتَارُوا|yakhtārū ; يَخْتَرْنَ|yakhtarna');
R('VIII:خير', 'imp', '- ; اِخْتَرْ|ikhtar ; اِخْتَارِي|ikhtārī ; - ; - ; - ; اِخْتَارَا|ikhtārā ; اِخْتَارُوا|ikhtārū ; اِخْتَرْنَ|ikhtarna ; - ; - ; - ; -');
R('VIII:وصل', 'past', 'اِتَّصَلْتُ|ittaṣaltu ; اِتَّصَلْتَ|ittaṣalta ; اِتَّصَلْتِ|ittaṣalti ; اِتَّصَلَ|ittaṣala ; اِتَّصَلَتْ|ittaṣalat ; اِتَّصَلْنَا|ittaṣalnā ; اِتَّصَلْتُمَا|ittaṣaltumā ; اِتَّصَلْتُمْ|ittaṣaltum ; اِتَّصَلْتُنَّ|ittaṣaltunna ; اِتَّصَلَا|ittaṣalā ; اِتَّصَلَتَا|ittaṣalatā ; اِتَّصَلُوا|ittaṣalū ; اِتَّصَلْنَ|ittaṣalna');
R('VIII:وصل', 'pres', 'أَتَّصِلُ|attaṣilu ; تَتَّصِلُ|tattaṣilu ; تَتَّصِلِينَ|tattaṣilīna ; يَتَّصِلُ|yattaṣilu ; تَتَّصِلُ|tattaṣilu ; نَتَّصِلُ|nattaṣilu ; تَتَّصِلَانِ|tattaṣilāni ; تَتَّصِلُونَ|tattaṣilūna ; تَتَّصِلْنَ|tattaṣilna ; يَتَّصِلَانِ|yattaṣilāni ; تَتَّصِلَانِ|tattaṣilāni ; يَتَّصِلُونَ|yattaṣilūna ; يَتَّصِلْنَ|yattaṣilna');
R('VIII:وصل', 'imp', '- ; اِتَّصِلْ|ittaṣil ; اِتَّصِلِي|ittaṣilī ; - ; - ; - ; اِتَّصِلَا|ittaṣilā ; اِتَّصِلُوا|ittaṣilū ; اِتَّصِلْنَ|ittaṣilna ; - ; - ; - ; -');
R('II:ربو', 'past', 'رَبَّيْتُ|rabbaytu ; رَبَّيْتَ|rabbayta ; رَبَّيْتِ|rabbayti ; رَبَّى|rabbā ; رَبَّتْ|rabbat ; رَبَّيْنَا|rabbaynā ; رَبَّيْتُمَا|rabbaytumā ; رَبَّيْتُمْ|rabbaytum ; رَبَّيْتُنَّ|rabbaytunna ; رَبَّيَا|rabbayā ; رَبَّتَا|rabbatā ; رَبَّوْا|rabbaw ; رَبَّيْنَ|rabbayna');
R('II:ربو', 'pres', 'أُرَبِّي|urabbī ; تُرَبِّي|turabbī ; تُرَبِّينَ|turabbīna ; يُرَبِّي|yurabbī ; تُرَبِّي|turabbī ; نُرَبِّي|nurabbī ; تُرَبِّيَانِ|turabbiyāni ; تُرَبُّونَ|turabbūna ; تُرَبِّينَ|turabbīna ; يُرَبِّيَانِ|yurabbiyāni ; تُرَبِّيَانِ|turabbiyāni ; يُرَبُّونَ|yurabbūna ; يُرَبِّينَ|yurabbīna');
R('II:ربو', 'juss', 'أُرَبِّ|urabbi ; تُرَبِّ|turabbi ; تُرَبِّي|turabbī ; يُرَبِّ|yurabbi ; تُرَبِّ|turabbi ; نُرَبِّ|nurabbi ; تُرَبِّيَا|turabbiyā ; تُرَبُّوا|turabbū ; تُرَبِّينَ|turabbīna ; يُرَبِّيَا|yurabbiyā ; تُرَبِّيَا|turabbiyā ; يُرَبُّوا|yurabbū ; يُرَبِّينَ|yurabbīna');
R('IV:عطو', 'past', 'أَعْطَيْتُ|aʿṭaytu ; أَعْطَيْتَ|aʿṭayta ; أَعْطَيْتِ|aʿṭayti ; أَعْطَى|aʿṭā ; أَعْطَتْ|aʿṭat ; أَعْطَيْنَا|aʿṭaynā ; أَعْطَيْتُمَا|aʿṭaytumā ; أَعْطَيْتُمْ|aʿṭaytum ; أَعْطَيْتُنَّ|aʿṭaytunna ; أَعْطَيَا|aʿṭayā ; أَعْطَتَا|aʿṭatā ; أَعْطَوْا|aʿṭaw ; أَعْطَيْنَ|aʿṭayna');
R('IV:عطو', 'pres', 'أُعْطِي|uʿṭī ; تُعْطِي|tuʿṭī ; تُعْطِينَ|tuʿṭīna ; يُعْطِي|yuʿṭī ; تُعْطِي|tuʿṭī ; نُعْطِي|nuʿṭī ; تُعْطِيَانِ|tuʿṭiyāni ; تُعْطُونَ|tuʿṭūna ; تُعْطِينَ|tuʿṭīna ; يُعْطِيَانِ|yuʿṭiyāni ; تُعْطِيَانِ|tuʿṭiyāni ; يُعْطُونَ|yuʿṭūna ; يُعْطِينَ|yuʿṭīna');
R('IV:عطو', 'subj', 'أُعْطِيَ|uʿṭiya ; تُعْطِيَ|tuʿṭiya ; تُعْطِي|tuʿṭī ; يُعْطِيَ|yuʿṭiya ; تُعْطِيَ|tuʿṭiya ; نُعْطِيَ|nuʿṭiya ; تُعْطِيَا|tuʿṭiyā ; تُعْطُوا|tuʿṭū ; تُعْطِينَ|tuʿṭīna ; يُعْطِيَا|yuʿṭiyā ; تُعْطِيَا|tuʿṭiyā ; يُعْطُوا|yuʿṭū ; يُعْطِينَ|yuʿṭīna');
R('IV:عطو', 'juss', 'أُعْطِ|uʿṭi ; تُعْطِ|tuʿṭi ; تُعْطِي|tuʿṭī ; يُعْطِ|yuʿṭi ; تُعْطِ|tuʿṭi ; نُعْطِ|nuʿṭi ; تُعْطِيَا|tuʿṭiyā ; تُعْطُوا|tuʿṭū ; تُعْطِينَ|tuʿṭīna ; يُعْطِيَا|yuʿṭiyā ; تُعْطِيَا|tuʿṭiyā ; يُعْطُوا|yuʿṭū ; يُعْطِينَ|yuʿṭīna');
R('IV:عطو', 'imp', '- ; أَعْطِ|aʿṭi ; أَعْطِي|aʿṭī ; - ; - ; - ; أَعْطِيَا|aʿṭiyā ; أَعْطُوا|aʿṭū ; أَعْطِينَ|aʿṭīna ; - ; - ; - ; -');
R('IV:عطو', 'pastPass', 'أُعْطِيتُ|uʿṭītu ; أُعْطِيتَ|uʿṭīta ; أُعْطِيتِ|uʿṭīti ; أُعْطِيَ|uʿṭiya ; أُعْطِيَتْ|uʿṭiyat ; أُعْطِينَا|uʿṭīnā ; أُعْطِيتُمَا|uʿṭītumā ; أُعْطِيتُمْ|uʿṭītum ; أُعْطِيتُنَّ|uʿṭītunna ; أُعْطِيَا|uʿṭiyā ; أُعْطِيَتَا|uʿṭiyatā ; أُعْطُوا|uʿṭū ; أُعْطِينَ|uʿṭīna');

// ======== assembled database: roots starting with ت or ذ, and the VIII forms of ن roots (found when verbs.js was assembled) ===========
F('II:تبل', 'تَبَّلَ|tabbala', { 'pres.3': 'يُتَبِّلُ|yutabbilu', 'pastPass.3': 'تُبِّلَ|tubbila', 'actPart.0': 'مُتَبِّلٌ|mutabbilun', 'passPart.0': 'مُتَبَّلٌ|mutabbalun' });
F('II:تمم', 'تَمَّمَ|tammama', { 'pres.3': 'يُتَمِّمُ|yutammimu', 'past.0': 'تَمَّمْتُ|tammamtu' });
F('II:توج', 'تَوَّجَ|tawwaja', { 'pres.3': 'يُتَوِّجُ|yutawwiju', 'passPart.0': 'مُتَوَّجٌ|mutawwajun' });
F('VIII:ذخر', 'اِدَّخَرَ|iddakhara', { 'pres.3': 'يَدَّخِرُ|yaddakhiru', 'imp.1': 'اِدَّخِرْ|iddakhir', 'actPart.0': 'مُدَّخِرٌ|muddakhirun', 'passPart.0': 'مُدَّخَرٌ|muddakharun' });
F('VIII:نفخ', 'اِنْتَفَخَ|intafakha', { 'pres.3': 'يَنْتَفِخُ|yantafikhu', 'past.0': 'اِنْتَفَخْتُ|intafakhtu', 'imp.1': 'اِنْتَفِخْ|intafikh' });
F('VIII:نفض', 'اِنْتَفَضَ|intafaḍa', { 'pres.3': 'يَنْتَفِضُ|yantafiḍu', 'past.11': 'اِنْتَفَضُوا|intafaḍū' });

// ======== audit of the assembled database: lexical exceptions and verbs whose regular form is not the word ===========================
// موت: the active participle is مَيِّتٌ (the regular مَائِتٌ is rare); 'iu' gives the standard مِتُّ, 'au' the variant مُتُّ
F('I:موت:iu', 'مَاتَ|māta', { 'actPart.0': 'مَيِّتٌ|mayyitun', 'actPart.12': 'مَيِّتٌ|mayyitun', 'pres.3': 'يَمُوتُ|yamūtu', 'imp.1': 'مُتْ|mut' });
F('I:موت:au', 'مَاتَ|māta', { 'past.0': 'مُتُّ|muttu', 'past.12': 'مُتْنَ|mutna', 'actPart.0': 'مَيِّتٌ|mayyitun' });
F('I:قول:au', 'قَالَ|qāla', { 'actPart.0': 'قَائِلٌ|qāʾilun' });                       // the exception is only for موت
// X of حوذ stays sound: اِسْتَحْوَذَ (the regular hollow pattern would give the non-word اِسْتَحَاذَ)
F('X:حوذ', 'اِسْتَحْوَذَ|istaḥwadha', {
  'past.0': 'اِسْتَحْوَذْتُ|istaḥwadhtu', 'past.11': 'اِسْتَحْوَذُوا|istaḥwadhū', 'pres.3': 'يَسْتَحْوِذُ|yastaḥwidhu', 'pres.8': 'تَسْتَحْوِذْنَ|tastaḥwidhna',
  'juss.3': 'يَسْتَحْوِذْ|yastaḥwidh', 'imp.1': 'اِسْتَحْوِذْ|istaḥwidh', 'pastPass.3': 'اُسْتُحْوِذَ|ustuḥwidha',
  'actPart.0': 'مُسْتَحْوِذٌ|mustaḥwidhun', 'passPart.0': 'مُسْتَحْوَذٌ|mustaḥwadhun',
});
F('X:جوب', 'اِسْتَجَابَ|istajāba', { 'pres.3': 'يَسْتَجِيبُ|yastajību' });                // the exception is only for حوذ
F('X:شور', 'اِسْتَشَارَ|istashāra', { 'pres.3': 'يَسْتَشِيرُ|yastashīru' });
// آثَرَ يُؤْثِرُ 'prefer' is form IV; form III of the same root is a different word
F('IV:ءثر', 'آثَرَ|āthara', { 'past.0': 'آثَرْتُ|āthartu', 'pres.0': 'أُوثِرُ|ūthiru', 'pres.3': 'يُؤْثِرُ|yuʾthiru', 'imp.1': 'آثِرْ|āthir', 'actPart.0': 'مُؤْثِرٌ|muʾthirun' });
F('III:ءثر', 'آثَرَ|āthara', { 'pres.3': 'يُؤَاثِرُ|yuʾāthiru' });
// form VIII (not X) of سبق سند سلم, and the real X of سلم (surrender)
F('VIII:سبق', 'اِسْتَبَقَ|istabaqa', { 'pres.3': 'يَسْتَبِقُ|yastabiqu', 'imp.1': 'اِسْتَبِقْ|istabiq' });
F('VIII:سند', 'اِسْتَنَدَ|istanada', { 'pres.3': 'يَسْتَنِدُ|yastanidu' });
F('VIII:سلم', 'اِسْتَلَمَ|istalama', { 'pres.3': 'يَسْتَلِمُ|yastalimu' });
F('X:سلم', 'اِسْتَسْلَمَ|istaslama', { 'pres.3': 'يَسْتَسْلِمُ|yastaslimu' });
F('X:وعب', 'اِسْتَوْعَبَ|istawʿaba', { 'pres.3': 'يَسْتَوْعِبُ|yastawʿibu' });
// ظَلَّ: ظَلِلْتُ with the vowel pair 'ia'
F('I:ظلل:ia', 'ظَلَّ|ẓalla', { 'past.0': 'ظَلِلْتُ|ẓaliltu', 'past.5': 'ظَلِلْنَا|ẓalilnā', 'past.11': 'ظَلُّوا|ẓallū', 'pres.3': 'يَظَلُّ|yaẓallu', 'pres.8': 'تَظْلَلْنَ|taẓlalna' });
F('IV:دور', 'أَدَارَ|adāra', { 'pres.3': 'يُدِيرُ|yudīru', 'pastPass.3': 'أُدِيرَ|udīra' });

// خَارَ يَخُورُ 'lose strength': a regular fāʿil that is the real adjective (خَائِرٌ); it replaced the stative ضَعُفَ, whose regular fāʿil ضَاعِفٌ is a different word
F('I:خور:au', 'خَارَ|khāra', { 'past.0': 'خُرْتُ|khurtu', 'pres.3': 'يَخُورُ|yakhūru', 'imp.1': 'خُرْ|khur', 'actPart.0': 'خَائِرٌ|khāʾirun' });
// ======== RUNNER (add new expectations ABOVE this line) =====================================
for (const { entry, citation, forms } of FORMS) {
  let result;
  try { result = express(entryOf(entry)); } catch (error) { failures.push(`${entry}: express() threw "${error.message}"`); continue; }
  same(`${entry} citation`, `${result.ar}|${result.tr}`, citation);
  for (const [key, want] of Object.entries(forms)) {
    const [row, slot] = key.split('.');
    same(`${entry} ${citation} ${row}.${slot} (${SLOTS[slot]})`, cellText(result.rows[row][slot]), want);
  }
}
for (const { entry, row, cells } of ROWS) {
  let result;
  try { result = express(entryOf(entry)); } catch (error) { failures.push(`${entry} ${row}: express() threw "${error.message}"`); continue; }
  same(`${entry} whole row ${row}`, result.rows[row].map(cellText).join(' ; '), cells);
}

// Shape of the result.
{
  const r = express({ form: 'I', root: 'كتب', vowels: 'au' });
  same('thirteen row keys in order', ROW_KEYS.join(' '), 'past pres fut subj juss imp negPast negPres negFut pastPass presPass actPart passPart');
  same('result keys', Object.keys(r.rows).join(' '), ROW_KEYS.join(' '));
  same('thirteen cells per row', ROW_KEYS.every(k => r.rows[k].length === 13), true);
}

// ---- Refusals: bad input must be refused with a clear message, never guessed at ------------------------------------
const throwsWith = (label, entry, pattern) => {
  checks += 1;
  try { express(entry); } catch (error) {
    if (!/^arabic express\(\): /.test(error.message) || !pattern.test(error.message)) failures.push(`${label}: wrong error "${error.message}"`);
    return;
  }
  failures.push(`${label}: did not throw`);
};
throwsWith('unknown form', { form: 'XI', root: 'كتب' }, /unknown form "XI"/);
throwsWith('missing form', { root: 'كتب', vowels: 'au' }, /unknown form "undefined"/);
throwsWith('root of two letters', { form: 'II', root: 'كت' }, /must be 3 Arabic root letters/);
throwsWith('root of four letters in a three-letter form', { form: 'II', root: 'كتبب' }, /must be 3 Arabic root letters/);
throwsWith('root of three letters in a four-letter form', { form: 'Q1', root: 'كتب' }, /must be 4 Arabic root letters/);
throwsWith('root with a Latin letter', { form: 'II', root: 'كتb' }, /must be 3 Arabic root letters/);
throwsWith('root with a diacritic', { form: 'II', root: 'كَتب' }, /must be 3 Arabic root letters/);
throwsWith('root written with an alif', { form: 'II', root: 'قال' }, /must be 3 Arabic root letters/);
throwsWith('hamza on a seat is not a root letter', { form: 'I', root: 'أكل', vowels: 'au' }, /must be 3 Arabic root letters/);
throwsWith('vowels on a derived form', { form: 'II', root: 'درس', vowels: 'au' }, /belong to form I only/);
throwsWith('vowels on a four-letter form', { form: 'Q1', root: 'ترجم', vowels: 'au' }, /belong to form I only/);
throwsWith('form I without vowels', { form: 'I', root: 'كتب' }, /needs vowels/);
throwsWith('vowels of the wrong shape', { form: 'I', root: 'كتب', vowels: 'ax' }, /two letters from a i u/);
throwsWith('three vowels', { form: 'I', root: 'كتب', vowels: 'aua' }, /two letters from a i u/);
throwsWith('not an object', 'كتب', /must be an object/);
throwsWith('null entry', null, /must be an object/);
throwsWith('form IX of a defective root', { form: 'IX', root: 'رمي' }, /unsupported class/);
throwsWith('form IX of a doubled root', { form: 'IX', root: 'مدد' }, /unsupported class/);
throwsWith('defective form I with a u past', { form: 'I', root: 'رمي', vowels: 'uu' }, /unsupported class/);
throwsWith('defective form I with a u present and a final ي', { form: 'I', root: 'رمي', vowels: 'au' }, /unsupported class/);
throwsWith('form VIII of a root starting with ي', { form: 'VIII', root: 'يسر' }, /unsupported class/);

throwsWith('undefined entry', undefined, /must be an object/);
throwsWith('form given as a number', { form: 1, root: 'كتب', vowels: 'au' }, /unknown form "1"/);
throwsWith('lower-case form name', { form: 'ii', root: 'درس' }, /unknown form "ii"/);
throwsWith('root of five letters', { form: 'Q1', root: 'ترجمم' + 'ا' }, /must be 4 Arabic root letters/);
throwsWith('root of three letters with a space', { form: 'II', root: 'ك ب' }, /must be 3 Arabic root letters/);
throwsWith('missing root', { form: 'II' }, /must be 3 Arabic root letters/);
throwsWith('vowels with a capital letter', { form: 'I', root: 'كتب', vowels: 'Au' }, /two letters from a i u/);
throwsWith('vowels of one letter', { form: 'I', root: 'كتب', vowels: 'a' }, /two letters from a i u/);
throwsWith('vowels as an array', { form: 'I', root: 'كتب', vowels: ['a', 'u'] }, /two letters from a i u/);
throwsWith('form IX of a hollow root with a hamza', { form: 'IX', root: 'ضوء' }, /unsupported class/);
throwsWith('form IX of a final-hamza root', { form: 'IX', root: 'قرء' }, /unsupported class/);
throwsWith('form IX of a doubly weak root', { form: 'IX', root: 'وقي' }, /unsupported class/);
throwsWith('defective form I with a u present and a final ي (غزي)', { form: 'I', root: 'غزي', vowels: 'au' }, /unsupported class/);
throwsWith('defective form I with a u past and a u present', { form: 'I', root: 'سرو', vowels: 'uu' }, /unsupported class/);
throwsWith('the refusal names the class', { form: 'VIII', root: 'يبس' }, /root starting with ي/);
throwsWith('form VII of a root starting with ن', { form: 'VII', root: 'نوم' }, /form VII of a root starting with ن/);
// a refusal message always starts the same way, so a page can show it
{
  let message = '';
  try { express({ form: 'XX', root: 'كتب' }); } catch (error) { message = error.message; }
  same('refusals say which function refused', message.startsWith('arabic express(): '), true);
}

// ======== DATABASE ======================================================================
// Every entry of verbs.js must be readable by the engine and give well-formed cells. All problems of one kind are
// collected into ONE failure so that they can be seen together.
const LETTER = /[ء-ي]/, DIACRITIC = /[ً-ْ]/;
const ALLOWED_AR = /^[ء-يً-ْ ]+$/;
const ALLOWED_TR = /^[abdfghijklmnqrstuwyzʾʿāīūḥṣḍṭẓ -]+$/;
const FATHA = 'َ', KASRA = 'ِ', DAMMA = 'ُ', TANWIN_FATHA = 'ً', SHADDA = 'ّ';

function badCell(cell) {
  if (!cell || typeof cell !== 'object') return 'not a cell';
  const { ar, tr } = cell;
  if (typeof ar !== 'string' || typeof tr !== 'string' || !ar || !tr) return 'empty script or transliteration';
  if (/undefined|NaN|\[object|null/.test(ar + tr)) return 'undefined in the cell';
  if (!ALLOWED_AR.test(ar)) return 'script has a character that is not an Arabic letter, diacritic or space';
  if (!ALLOWED_TR.test(tr)) return `transliteration has an undocumented character: ${[...tr].filter(ch => !ALLOWED_TR.test(ch)).join('')}`;
  if (/  |^ | $/.test(ar) || /  |^ | $|^-|-$/.test(tr)) return 'stray space or hyphen';
  if (/[ً-ْ]{3,}/.test(ar)) return 'three diacritics in a row';
  return null;
}

// Letters of the script without the diacritics, for the root check: hamza seats become ء
const skeleton = ar => {
  const chars = [...ar];
  let out = '';
  chars.forEach((ch, i) => {
    if (!LETTER.test(ch)) return;
    const letter = 'أإؤئ'.includes(ch) ? 'ء' : ch === 'آ' ? 'ءا' : ch;
    let shadda = false;
    for (let j = i + 1; j < chars.length && DIACRITIC.test(chars[j]); j++) if (chars[j] === SHADDA) shadda = true;
    out += shadda ? letter + letter : letter;                       // a shadda stands for a doubled consonant (مَدَّ = م د د)
  });
  return out;
};
// the citation (3rd person masculine singular perfect) must have the shape of its form: II has a shadda, III a long ā after the
// first letter, IV starts with أَ (or آ), V and VI with تَ, VII with اِنْ, VIII with اِ, IX with اِ and a shadda, X with اِسْتَ,
// Q2 with تَ
// A root that starts with ت gives a form II that starts with تَ as well (تَمَّمَ تَبَّلَ تَوَّجَ): only then is that accepted.
function shapeProblem(form, ar, root = '') {
  const ok = {
    I: () => !ar.startsWith('ت') || true,
    II: () => ar.includes(SHADDA) && !ar.startsWith('اِ') && (root[0] === 'ت' ? /^تَ.َّ/.test(ar) : !ar.startsWith('تَ')),
    III: () => /^(.َا|آ)/.test(ar),
    IV: () => /^(أَ|آ)/.test(ar),
    V: () => ar.startsWith('تَ') && ar.includes(SHADDA),
    VI: () => /^تَ(.َا|آ)/.test(ar),
    VII: () => ar.startsWith('اِنْ'),
    VIII: () => ar.startsWith('اِ'),
    IX: () => ar.startsWith('اِ') && ar.includes(SHADDA),
    X: () => ar.startsWith('اِسْتَ'),
    Q1: () => !/^(اِ|تَ)/.test(ar) || /^تَ.ْ/.test(ar),
    Q2: () => ar.startsWith('تَ'),
  }[form];
  return ok && ok() ? null : `the citation ${ar} does not have the shape of form ${form}`;
}

// the root letters in order; a weak letter or hamza may be written ا ى و ي ء ت (form VIII: اتصل) or be absent (a dropped letter)
// (form VIII: a first ذ assimilates to the infix and is written د: اِدَّخَرَ from ذخر)
function containsRoot(skel, root, form = '') {
  if (form === 'VIII' && root[0] === 'ذ') root = ['د', ...root.slice(1)];
  let pos = 0;
  for (const letter of root) {
    if ('وءي'.includes(letter)) {
      const found = [...skel.slice(pos)].findIndex(ch => 'واىيءت'.includes(ch));
      if (found >= 0) pos += found + 1;
      continue;
    }
    const at = skel.indexOf(letter, pos);
    if (at < 0) return false;
    pos = at + 1;
  }
  return true;
}

// Consonant and long-vowel units of the transliteration and of the script of one word
const TR_UNIT = /th|dh|kh|sh|gh|[bdfhjklmnqrstwyzʾʿḥṣḍṭẓāīū]/g;
const DIGRAPH = /th|dh|kh|sh|gh/g;
const trUnits = tr => {
  const word = tr.replace(/[ -]/g, '');
  return { greedy: (word.match(TR_UNIT) || []).length, digraphs: (word.match(DIGRAPH) || []).length };
};
function arUnits(word) {
  let n = 0;
  const chars = [...word];
  chars.forEach((ch, i) => {
    const next = chars[i + 1], prev = chars[i - 1];
    if (ch === 'ا' && i === 0 && (next === KASRA || next === DAMMA)) return;          // hamzat al-waṣl: no consonant in the transliteration
    if (i === 0 && (ch === 'أ' || ch === 'إ')) return;                                     // a hamza at the start of a word is not transliterated
    if (i === 0 && ch === 'آ') { n += 1; return; }                                         // ā
    if (ch === 'آ') { n += 2; return; }                                                    // ʾā
    if (ch === 'ا' && i === chars.length - 1 && (prev === 'و' || (prev === 'ْ' && chars[i - 2] === 'و'))) return;   // the silent alif after wāw al-jamāʿa (ُوا and the diphthong وْا)
    if ((ch === 'ى' || ch === 'ا') && i === chars.length - 1 && (prev === TANWIN_FATHA || (prev === SHADDA && chars[i - 2] === TANWIN_FATHA))) return;   // the ى (after a ي: ا) that follows a tanwīn fatḥ
    if (LETTER.test(ch)) n += 1;
    else if (ch === SHADDA || (ch >= TANWIN_FATHA && ch <= 'ٍ')) n += 1;              // a doubled consonant, the n of a tanwīn
  });
  return n;
}
// null if the letter count of the script agrees with the consonant count of the transliteration
function unitMismatch(row, cell) {
  let { ar, tr } = cell;
  if (row === 'fut') { ar = ar.slice(2); tr = tr.replace(/^sa-/, ''); }
  const arWords = ar.split(' '), trWords = tr.split(' ');
  if (arWords.length !== trWords.length) return `${arWords.length} script words but ${trWords.length} transliteration words`;
  for (let i = 0; i < arWords.length; i++) {
    const a = arUnits(arWords[i]), { greedy, digraphs } = trUnits(trWords[i]);
    if (a < greedy || a > greedy + digraphs) return `"${arWords[i]}" has ${a} letters, "${trWords[i]}" has ${greedy} consonants and long vowels`;
  }
  return null;
}

// ---- Every form of every expected verb is well formed -------------------------------------------------------
function checkWellFormed(label, result, problems) {
  for (const key of ROW_KEYS) {
    const row = result.rows[key];
    if (!Array.isArray(row) || row.length !== 13) { problems.push(`${label}: malformed row ${key}`); continue; }
    row.forEach((cell, slot) => {
      if (cell === null) return;
      const why = badCell(cell) || unitMismatch(key, cell);
      if (why) problems.push(`${label} ${key}.${slot}: ${why}: ${cell.ar} / ${cell.tr}`);
    });
  }
  const why = badCell({ ar: result.ar, tr: result.tr });
  if (why) problems.push(`${label} citation: ${why}`);
}
{
  const problems = [];
  for (const { entry } of FORMS) {
    try { checkWellFormed(entry, express(entryOf(entry)), problems); } catch (error) { /* reported above */ }
    checks += 1;
  }
  if (problems.length) failures.push(`malformed forms in the expected verbs (${problems.length}):\n    ` + problems.slice(0, 40).join('\n    '));
}

// ---- The database ---------------------------------------------------------------------------------------------
// Script spellings that are really two readings (true homographs): none so far.
const HOMOGRAPHS = new Set([]);

function checkDatabase() {
  let translations = 0;
  const unreadable = [], malformed = [], rootMissing = [], clash = [], entryForm = [];
  const readingOf = new Map();
  for (const [english, options] of Object.entries(VERBS)) {
    for (const entry of options) {
      translations += 1;
      const label = `${english} -> [${entry.form}:${entry.root}${entry.vowels ? ':' + entry.vowels : ''}]`;
      if (!entry || typeof entry !== 'object' || typeof entry.form !== 'string' || typeof entry.root !== 'string') { entryForm.push(`${label}: not { form, root }`); continue; }
      let result;
      try { result = express(entry); } catch (error) { unreadable.push(`${label}: ${error.message}`); continue; }
      checkWellFormed(label, result, malformed);
      if (!containsRoot(skeleton(result.ar), [...entry.root], entry.form)) rootMissing.push(`${label}: the citation form ${result.ar} does not contain the root letters`);
      if (!result.rows.past.some(Boolean) || !result.rows.pres.some(Boolean)) malformed.push(`${label}: no past or present`);
      const shape = shapeProblem(entry.form, result.ar, entry.root);
      if (shape) rootMissing.push(`${label}: ${shape}`);
      // one transliteration per script spelling across every cell of the database
      for (const key of ROW_KEYS) {
        for (const cell of result.rows[key]) {
          if (!cell) continue;
          const seen = readingOf.get(cell.ar);
          if (seen === undefined) readingOf.set(cell.ar, { tr: cell.tr, label });
          else if (seen.tr !== cell.tr && !HOMOGRAPHS.has(cell.ar)) clash.push(`${label}: ${cell.ar} is read ${cell.tr} here and ${seen.tr} in ${seen.label}`);
        }
      }
    }
  }
  const many = (title, list) => { if (list.length) failures.push(`${title} (${list.length}):\n    ` + list.slice(0, 60).join('\n    ')); };
  many('entries that are not { form, root }', entryForm);
  many('entries the engine cannot read', unreadable);
  many('malformed script, transliteration or cells', malformed);
  many('citation forms without the root letters in order, or without the shape of their form', rootMissing);
  many('one script spelling with two transliterations', [...new Set(clash)]);
  checks += 1;
  return translations;
}

// ---- A sample of every root class in every form: no crash, a documented refusal or well-formed cells ---------------------
// The roots cover every class; form I is tried with all nine vowel pairs, every other form once. An entry may be refused only
// with the message "unsupported class"; everything else must be built, and then every cell of every row is checked (script
// letters, transliteration characters, letter count against consonant count) and the structure of the rows is checked.
{
  const SAMPLE_ROOTS = ['كتب', 'ضرب', 'فتح', 'علم', 'ءكل', 'ءخذ', 'ءمر', 'سءل', 'قرء', 'بدء', 'ملء', 'وصل', 'وجد', 'وقف', 'يسر', 'يقن', 'ولد', 'وسع',
    'قول', 'بيع', 'نوم', 'خوف', 'موت', 'زور', 'سير', 'شيء', 'جيء', 'سوء', 'رمي', 'دعو', 'نسي', 'بقي', 'رضي', 'مشي', 'غزو', 'لقي', 'ءتي', 'رءي',
    'وقي', 'وفي', 'ولي', 'روي', 'حيي', 'كون', 'مدد', 'حبب', 'ظلل', 'ردد', 'ءمم', 'حمر', 'سود', 'بيض', 'خضر', 'ضوء', 'طيء'];
  const SAMPLE_ROOTS4 = ['ترجم', 'دحرج', 'زلزل', 'هرول', 'سيطر', 'طمءن', 'وسوس', 'بعثر', 'ءسلم', 'قلقي', 'بلور', 'كوكب'];
  const PAIRS = ['aa', 'ai', 'au', 'ia', 'ii', 'iu', 'ua', 'ui', 'uu'];
  const FORMS3 = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const PERSON_PREFIX = { fut: ['سَ', 'sa-'], negPast: ['لَمْ ', 'lam '], negPres: ['لَا ', 'lā '], negFut: ['لَنْ ', 'lan '] };
  const problems = [], odd = [];
  let built = 0, refused = 0;
  const entries = [];
  for (const form of FORMS3) for (const root of SAMPLE_ROOTS) {
    if (form === 'I') PAIRS.forEach(vowels => entries.push({ form, root, vowels })); else entries.push({ form, root });
  }
  for (const form of ['Q1', 'Q2']) for (const root of SAMPLE_ROOTS4) entries.push({ form, root });
  const reading = new Map();
  for (const entry of entries) {
    const label = `${entry.form}:${entry.root}${entry.vowels ? ':' + entry.vowels : ''}`;
    let result;
    try { result = express(entry); } catch (error) {
      if (/^arabic express\(\): unsupported class/.test(error.message)) refused += 1; else odd.push(`${label}: ${error.message}`);
      continue;
    }
    built += 1;
    checkWellFormed(label, result, problems);
    if (!containsRoot(skeleton(result.ar), [...entry.root], entry.form)) problems.push(`${label}: the citation form ${result.ar} does not contain the root letters`);
    const shape = shapeProblem(entry.form, result.ar, entry.root);
    if (shape) problems.push(`${label}: ${shape}`);
    const { rows } = result;
    // structure: the imperative exists only for the 2nd person, no passive for VII and IX and كان, prefixes of the derived rows
    rows.imp.forEach((cell, slot) => { if (!!cell !== [1, 2, 6, 7, 8].includes(slot)) problems.push(`${label} imp.${slot}: wrong presence`); });
    const noPassive = entry.form === 'VII' || entry.form === 'IX' || entry.root === 'كون' || (entry.form === 'I' && INTRANSITIVE_FORM_I.has(entry.root));
    for (const key of ['pastPass', 'presPass', 'passPart']) if (rows[key].some(Boolean) === noPassive) problems.push(`${label} ${key}: ${noPassive ? 'must be absent' : 'must exist'}`);
    for (const key of ['actPart', 'passPart']) if (new Set(rows[key].map(cellText)).size !== 1) problems.push(`${label} ${key}: the 13 cells differ`);
    for (const [key, [ar, tr]] of Object.entries(PERSON_PREFIX)) rows[key].forEach((cell, slot) => { if (!cell.ar.startsWith(ar) || !cell.tr.startsWith(tr)) problems.push(`${label} ${key}.${slot}: missing particle`); });
    rows.fut.forEach((cell, slot) => { if (cell.ar !== 'سَ' + rows.pres[slot].ar || cell.tr !== 'sa-' + rows.pres[slot].tr) problems.push(`${label} fut.${slot}: not sa- + the imperfect`); });
    rows.negPast.forEach((cell, slot) => { if (cell.ar !== 'لَمْ ' + rows.juss[slot].ar) problems.push(`${label} negPast.${slot}: not lam + the jussive`); });
    rows.negFut.forEach((cell, slot) => { if (cell.ar !== 'لَنْ ' + rows.subj[slot].ar) problems.push(`${label} negFut.${slot}: not lan + the subjunctive`); });
    // the 3rd person masculine singular of the perfect is the citation form
    if (cellText(rows.past[3]) !== `${result.ar}|${result.tr}`) problems.push(`${label}: citation differs from past.3`);
    // one transliteration per script spelling across the whole sample
    for (const key of ROW_KEYS) for (const cell of rows[key]) {
      if (!cell) continue;
      const seen = reading.get(cell.ar);
      if (seen === undefined) reading.set(cell.ar, { tr: cell.tr, label });
      else if (seen.tr !== cell.tr && !HOMOGRAPHS.has(cell.ar)) problems.push(`${label}: ${cell.ar} is read ${cell.tr} here and ${seen.tr} in ${seen.label}`);
    }
  }
  checks += entries.length;
  if (odd.length) failures.push(`entries refused with an unclear message or a crash (${odd.length}):\n    ` + odd.slice(0, 30).join('\n    '));
  if (problems.length) failures.push(`the root-class sample has problems (${problems.length}):\n    ` + problems.slice(0, 40).join('\n    '));
  same(`the sample builds most entries (built ${built}, refused ${refused})`, built > 800 && refused < built / 5, true);
}

// ---- The expected table covers enough verbs and every class and form -----------------------------------------------------
{
  const specs = new Set(FORMS.map(f => f.entry));
  same('at least 100 expected verbs', specs.size >= 100, true);
  const formsSeen = new Set([...specs].map(spec => spec.split(':')[0]));
  same('every form has expected verbs', ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'Q1', 'Q2'].every(f => formsSeen.has(f)), true);
  const pairsSeen = new Set([...specs].filter(spec => spec.startsWith('I:')).map(spec => spec.split(':')[2]));
  same('form I is expected with every vowel pair that exists', ['aa', 'ai', 'au', 'ia', 'ii', 'iu', 'uu'].every(p => pairsSeen.has(p)), true);
  const wholeRows = new Set(ROWS.map(r => r.entry));
  same('whole 13-slot rows for at least 14 verbs', wholeRows.size >= 14, true);
  same('every row key has a whole-row expectation', ROW_KEYS.every(key => ROWS.some(r => r.row === key)), true);
}

// the database checks themselves must stay strict: a form II that starts with تَ is accepted only for a root that starts with ت,
// and a first ذ is read as د only in form VIII
same('shape: II of a ت root may start with تَ', shapeProblem('II', 'تَبَّلَ', 'تبل'), null);
same('shape: II of another root must not start with تَ', shapeProblem('II', 'تَبَّلَ', 'دبل') !== null, true);
same('shape: II needs a shadda', shapeProblem('II', 'تَبَلَ', 'تبل') !== null, true);
same('shape: II must not start with اِ', shapeProblem('II', 'اِدَّخَرَ', 'ذخر') !== null, true);
same('root: VIII of ذ is written with د', containsRoot(skeleton('اِدَّخَرَ'), [...'ذخر'], 'VIII'), true);
same('root: a first ذ is not read as د in other forms', containsRoot(skeleton('أَدَّخَرَ'), [...'ذخر'], 'IV'), false);
same('root: a missing root letter is still caught', containsRoot(skeleton('اِدَّخَلَ'), [...'ذخر'], 'VIII'), false);
// form VII of a root starting with ن is refused (the verbs are form VIII: اِنْتَفَخَ اِنْتَفَضَ)
same('no database entry is form VII of a ن root', Object.entries(VERBS).filter(([, list]) => list.some(e => e.form === 'VII' && e.root[0] === 'ن')).map(([english]) => english).join(' '), '');

// ---- Data fixed while the database was audited: the wrong entries must not come back --------------------------------------------
{
  const keyOf = e => `${e.form}:${e.root}${e.vowels ? ':' + e.vowels : ''}`;
  const entriesOf = english => (VERBS[english] || []).map(keyOf);
  const has = (english, spec) => entriesOf(english).includes(spec);
  same('die: موت has the vowel pair iu (مِتُّ)', has('die', 'I:موت:iu') && !has('die', 'I:موت:au'), true);
  same('keep on, remain: ظلل has the pair ia (ظَلِلْتُ)', has('keep on', 'I:ظلل:ia') && has('remain', 'I:ظلل:ia') && !has('keep on', 'I:ظلل:aa') && !has('remain', 'I:ظلل:aa'), true);
  same('prefer is form IV آثَرَ, not III', has('prefer', 'IV:ءثر') && !has('prefer', 'III:ءثر'), true);
  same('anticipate is VIII اِسْتَبَقَ, not the non-word اِسْتَسْبَقَ', has('anticipate', 'VIII:سبق') && !has('anticipate', 'X:سبق'), true);
  same('base, lean use VIII اِسْتَنَدَ, not the non-word اِسْتَسْنَدَ', has('base', 'VIII:سند') && has('lean', 'VIII:سند') && !has('base', 'X:سند') && !has('lean', 'X:سند'), true);
  same('collect, get use VIII اِسْتَلَمَ (receive), not X اِسْتَسْلَمَ (surrender)', has('collect', 'VIII:سلم') && has('get', 'VIII:سلم') && !has('collect', 'X:سلم') && !has('get', 'X:سلم'), true);
  same('absorb, assimilate, digest use X اِسْتَوْعَبَ', ['absorb', 'assimilate', 'digest'].every(e => has(e, 'X:وعب') && !has(e, 'X:وعي')), true);
  same('interrogation verbs do not use X:جوب (اِسْتَجَابَ means respond)', ['ask', 'grill', 'interrogate', 'question'].every(e => !has(e, 'X:جوب')), true);
  same('run (a business) has the root دور, not دير', has('run', 'IV:دور') && !has('run', 'IV:دير'), true);
  same('weaken uses خَارَ (خور) and the only entry with the stative vowel pair uu is grow up كَبُرَ (a stative verb whose regular fāʿil is not the real adjective)', has('weaken', 'I:خور:au') && Object.values(VERBS).flat().filter(e => e.vowels === 'uu').every(e => e.root === 'كبر'), true);
  same('no entry uses the unsupported X:وعي, X:سبق or X:سند', Object.values(VERBS).flat().every(e => !(e.form === 'X' && ['وعي', 'سبق', 'سند'].includes(e.root))), true);
}

const translations = checkDatabase();

report.checks += checks;
// the intransitive form I verbs without a passive (the same conservative list as the engine's INTRANSITIVE_I)
// verbs that take no object have no passive (a conservative list); transitive ones keep it
for (const [root, vowels] of [['موت', 'iu'], ['نوم', 'aa'], ['ذهب', 'aa'], ['كبر', 'uu'], ['وقع', 'aa'], ['جلس', 'ai']]) {
  report.checks += 1;
  const rows = express({ form: 'I', root, vowels }).rows;
  if ([...rows.pastPass, ...rows.presPass, ...rows.passPart].some(Boolean)) report.fail(`${root}: an intransitive form I verb must have no passive cells`);
}
for (const [root, vowels] of [['كتب', 'au'], ['ضرب', 'ai'], ['فتح', 'aa']]) {
  report.checks += 1;
  const rows = express({ form: 'I', root, vowels }).rows;
  if (!rows.pastPass[3] || !rows.presPass[3] || !rows.passPart[3]) report.fail(`${root}: a transitive form I verb must keep its passive cells`);
}

report.finish(`${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Arabic translations`, { limit: 80 });
