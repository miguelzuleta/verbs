// Run with: node test.js
// Checks the Bengali pattern engine against known paradigms (script and romanization), checks that it
// refuses entries it cannot read, then runs every verb in verbs.js through it: every form must be well
// formed, and the consonants of the script must match the consonants of its romanization.
// Expected forms are written by hand from standard colloquial Bengali, not taken from the engine.
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');
const fs = require('fs');

const report = createReport();
const SLOTS = ['আমি', 'তুই', 'তুমি', 'আপনি', 'সে', 'তিনি'];

const entryOf = (bn, rom, tag) => ({ bn, rom, tag: tag || '' });

// ---- Whole rows: R(bn, rom, tag, key, six script cells, six romanized cells) -----------------------------------
// cells are separated by ' ; ' and '-' stands for "no form"
const ROWS = [];
const R = (bn, rom, tag, key, scriptCells, romCells) => ROWS.push({ bn, rom, tag, key, scriptCells, romCells });

// ---- Single forms: F(bn, rom, tag, { 'key.slot': 'script|romanization' }) ---------------------------------------
const FORMS = [];
const F = (bn, rom, tag, forms) => FORMS.push({ bn, rom, tag, forms });

// ======== করা: the regular consonant verb, every row ===========================================================
const K = (key, a, b) => R('করা', 'kora', '', key, a, b);
K('pres', 'করি ; করিস ; করো ; করেন ; করে ; করেন', 'kori ; koris ; koro ; koren ; kore ; koren');
K('presCont', 'করছি ; করছিস ; করছ ; করছেন ; করছে ; করছেন', 'korchhi ; korchhis ; korchho ; korchhen ; korchhe ; korchhen');
K('past', 'করলাম ; করলি ; করলে ; করলেন ; করল ; করলেন', 'korlam ; korli ; korle ; korlen ; korlo ; korlen');
K('pastCont', 'করছিলাম ; করছিলি ; করছিলে ; করছিলেন ; করছিল ; করছিলেন', 'korchhilam ; korchhili ; korchhile ; korchhilen ; korchhilo ; korchhilen');
K('pastHab', 'করতাম ; করতিস ; করতে ; করতেন ; করত ; করতেন', 'kortam ; kortis ; korte ; korten ; korto ; korten');
K('presPerf', 'করেছি ; করেছিস ; করেছ ; করেছেন ; করেছে ; করেছেন', 'korechhi ; korechhis ; korechho ; korechhen ; korechhe ; korechhen');
K('pastPerf', 'করেছিলাম ; করেছিলি ; করেছিলে ; করেছিলেন ; করেছিল ; করেছিলেন', 'korechhilam ; korechhili ; korechhile ; korechhilen ; korechhilo ; korechhilen');
K('fut', 'করব ; করবি ; করবে ; করবেন ; করবে ; করবেন', 'korbo ; korbi ; korbe ; korben ; korbe ; korben');
K('negPres', 'করি না ; করিস না ; করো না ; করেন না ; করে না ; করেন না', 'kori na ; koris na ; koro na ; koren na ; kore na ; koren na');
K('negPast', 'করিনি ; করিসনি ; করোনি ; করেননি ; করেনি ; করেননি', 'korini ; korisni ; koroni ; korenni ; koreni ; korenni');
K('negFut', 'করব না ; করবি না ; করবে না ; করবেন না ; করবে না ; করবেন না', 'korbo na ; korbi na ; korbe na ; korben na ; korbe na ; korben na');
K('imp', '- ; কর ; করো ; করুন ; করুক ; করুন', '- ; kor ; koro ; korun ; koruk ; korun');
K('impNeg', '- ; করিস না ; করো না ; করবেন না ; - ; করবেন না', '- ; koris na ; koro na ; korben na ; - ; korben na');
K('cond', ...Array(2).fill(0).map((_, i) => Array(6).fill(i ? 'korle' : 'করলে').join(' ; ')));
K('noun', ...Array(2).fill(0).map((_, i) => Array(6).fill(i ? 'kora' : 'করা').join(' ; ')));
K('inf', ...Array(2).fill(0).map((_, i) => Array(6).fill(i ? 'korte' : 'করতে').join(' ; ')));
K('conj', ...Array(2).fill(0).map((_, i) => Array(6).fill(i ? 'kore' : 'করে').join(' ; ')));

// ======== other regular consonant verbs ==========================================================================
R('দেখা', 'dekha', '', 'pres', 'দেখি ; দেখিস ; দেখো ; দেখেন ; দেখে ; দেখেন', 'dekhi ; dekhis ; dekho ; dekhen ; dekhe ; dekhen');
R('দেখা', 'dekha', '', 'past', 'দেখলাম ; দেখলি ; দেখলে ; দেখলেন ; দেখল ; দেখলেন', 'dekhlam ; dekhli ; dekhle ; dekhlen ; dekhlo ; dekhlen');
R('দেখা', 'dekha', '', 'presPerf', 'দেখেছি ; দেখেছিস ; দেখেছ ; দেখেছেন ; দেখেছে ; দেখেছেন', 'dekhechhi ; dekhechhis ; dekhechho ; dekhechhen ; dekhechhe ; dekhechhen');
R('দেখা', 'dekha', '', 'imp', '- ; দেখ ; দেখো ; দেখুন ; দেখুক ; দেখুন', '- ; dekh ; dekho ; dekhun ; dekhuk ; dekhun');
R('বলা', 'bola', '', 'fut', 'বলব ; বলবি ; বলবে ; বলবেন ; বলবে ; বলবেন', 'bolbo ; bolbi ; bolbe ; bolben ; bolbe ; bolben');
R('বসা', 'bosha', '', 'pres', 'বসি ; বসিস ; বসো ; বসেন ; বসে ; বসেন', 'boshi ; boshis ; bosho ; boshen ; boshe ; boshen');
R('পড়া', 'pora', '', 'presCont', 'পড়ছি ; পড়ছিস ; পড়ছ ; পড়ছেন ; পড়ছে ; পড়ছেন', 'porchhi ; porchhis ; porchho ; porchhen ; porchhe ; porchhen');
R('থাকা', 'thaka', '', 'pastHab', 'থাকতাম ; থাকতিস ; থাকতে ; থাকতেন ; থাকত ; থাকতেন', 'thaktam ; thaktis ; thakte ; thakten ; thakto ; thakten');
F('ফেলা', 'phela', '', { 'past.0': 'ফেললাম|phellam', 'pres.0': 'ফেলি|pheli', 'pres.2': 'ফেলো|phelo', 'conj.0': 'ফেলে|phele' });
F('জানা', 'jana', '', { 'pres.0': 'জানি|jani', 'pres.2': 'জানো|jano', 'past.0': 'জানলাম|janlam', 'presPerf.0': 'জেনেছি|jenechhi', 'conj.0': 'জেনে|jene', 'negPast.0': 'জানিনি|janini' });
F('ডাকা', 'daka', '', { 'pres.0': 'ডাকি|daki', 'negPast.0': 'ডাকিনি|dakini', 'fut.3': 'ডাকবেন|dakben' });
// one-syllable roots with আ: এ in the perfect and the conjunctive
F('ডাকা', 'daka', '', { 'presPerf.0': 'ডেকেছি|dekechhi', 'conj.0': 'ডেকে|deke', 'past.0': 'ডাকলাম|daklam', 'pastHab.0': 'ডাকতাম|daktam', 'inf.0': 'ডাকতে|dakte' });
F('রাখা', 'rakha', '', { 'presPerf.0': 'রেখেছি|rekhechhi', 'conj.0': 'রেখে|rekhe', 'pres.0': 'রাখি|rakhi', 'imp.1': 'রাখ|rakh' });
F('কাটা', 'kata', '', { 'presPerf.0': 'কেটেছি|ketechhi', 'conj.0': 'কেটে|kete', 'fut.0': 'কাটব|katbo' });
F('বাঁধা', 'bandha', '', { 'presPerf.0': 'বেঁধেছি|bendhechhi', 'conj.0': 'বেঁধে|bendhe' });
F('ভাবা', 'bhaba', '', { 'presPerf.0': 'ভেবেছি|bhebechhi', 'conj.0': 'ভেবে|bhebe', 'presCont.0': 'ভাবছি|bhabchhi' });
F('মারা', 'mara', '', { 'presPerf.0': 'মেরেছি|merechhi', 'conj.0': 'মেরে|mere' });
F('ছাড়া', 'chhara', '', { 'presPerf.0': 'ছেড়েছি|chherechhi', 'conj.0': 'ছেড়ে|chhere', 'pres.0': 'ছাড়ি|chhari' });
F('নামা', 'nama', '', { 'presPerf.0': 'নেমেছি|nemechhi', 'conj.0': 'নেমে|neme' });
F('থাকা', 'thaka', '', { 'presPerf.0': 'থেকেছি|thekechhi', 'conj.0': 'থেকে|theke' });
F('হাসা', 'hasha', '', { 'presPerf.0': 'হেসেছি|heshechhi', 'conj.0': 'হেসে|heshe', 'pres.0': 'হাসি|hashi' });
F('ভালোবাসা', 'bhalobasha', '', { 'pres.0': 'ভালোবাসি|bhalobashi', 'presPerf.0': 'ভালোবেসেছি|bhalobeshechhi', 'conj.0': 'ভালোবেসে|bhalobeshe' });
// roots with other vowels keep their vowel
F('পড়া', 'pora', '', { 'presPerf.0': 'পড়েছি|porechhi', 'conj.0': 'পড়ে|pore' });
F('বলা', 'bola', '', { 'presPerf.0': 'বলেছি|bolechhi', 'conj.0': 'বলে|bole' });
F('ধরা', 'dhora', '', { 'pres.0': 'ধরি|dhori', 'pastHab.4': 'ধরত|dhorto' });

// ======== [v]: the root vowel ে/ো is raised ================================================================
const V = (bn, rom, key, a, b) => R(bn, rom, 'v', key, a, b);
V('কেনা', 'kena', 'pres', 'কিনি ; কিনিস ; কেনো ; কেনেন ; কেনে ; কেনেন', 'kini ; kinis ; keno ; kenen ; kene ; kenen');
V('কেনা', 'kena', 'past', 'কিনলাম ; কিনলি ; কিনলে ; কিনলেন ; কিনল ; কিনলেন', 'kinlam ; kinli ; kinle ; kinlen ; kinlo ; kinlen');
V('কেনা', 'kena', 'presPerf', 'কিনেছি ; কিনেছিস ; কিনেছ ; কিনেছেন ; কিনেছে ; কিনেছেন', 'kinechhi ; kinechhis ; kinechho ; kinechhen ; kinechhe ; kinechhen');
V('কেনা', 'kena', 'fut', 'কিনব ; কিনবি ; কিনবে ; কিনবেন ; কিনবে ; কিনবেন', 'kinbo ; kinbi ; kinbe ; kinben ; kinbe ; kinben');
V('কেনা', 'kena', 'imp', '- ; কেন ; কেনো ; কিনুন ; কিনুক ; কিনুন', '- ; ken ; keno ; kinun ; kinuk ; kinun');
V('কেনা', 'kena', 'negPast', 'কিনিনি ; কিনিসনি ; কেনোনি ; কেনেননি ; কেনেনি ; কেনেননি', 'kinini ; kinisni ; kenoni ; kenenni ; keneni ; kenenni');
V('শেখা', 'shekha', 'pres', 'শিখি ; শিখিস ; শেখো ; শেখেন ; শেখে ; শেখেন', 'shikhi ; shikhis ; shekho ; shekhen ; shekhe ; shekhen');
V('শেখা', 'shekha', 'presPerf', 'শিখেছি ; শিখেছিস ; শিখেছ ; শিখেছেন ; শিখেছে ; শিখেছেন', 'shikhechhi ; shikhechhis ; shikhechho ; shikhechhen ; shikhechhe ; shikhechhen');
V('শোনা', 'shona', 'pres', 'শুনি ; শুনিস ; শোনো ; শোনেন ; শোনে ; শোনেন', 'shuni ; shunis ; shono ; shonen ; shone ; shonen');
V('শোনা', 'shona', 'imp', '- ; শোন ; শোনো ; শুনুন ; শুনুক ; শুনুন', '- ; shon ; shono ; shunun ; shunuk ; shunun');
V('শোনা', 'shona', 'past', 'শুনলাম ; শুনলি ; শুনলে ; শুনলেন ; শুনল ; শুনলেন', 'shunlam ; shunli ; shunle ; shunlen ; shunlo ; shunlen');
V('ওঠা', 'otha', 'pres', 'উঠি ; উঠিস ; ওঠো ; ওঠেন ; ওঠে ; ওঠেন', 'uthi ; uthis ; otho ; othen ; othe ; othen');
V('ওঠা', 'otha', 'imp', '- ; ওঠ ; ওঠো ; উঠুন ; উঠুক ; উঠুন', '- ; oth ; otho ; uthun ; uthuk ; uthun');
F('লেখা', 'lekha', 'v', { 'pres.0': 'লিখি|likhi', 'pres.2': 'লেখো|lekho', 'past.0': 'লিখলাম|likhlam', 'conj.0': 'লিখে|likhe', 'imp.1': 'লেখ|lekh' });
F('চেনা', 'chena', 'v', { 'pres.0': 'চিনি|chini', 'pres.4': 'চেনে|chene', 'fut.0': 'চিনব|chinbo' });
F('তোলা', 'tola', 'v', { 'pres.0': 'তুলি|tuli', 'pres.2': 'তোলো|tolo', 'past.4': 'তুলল|tullo' });
F('ভোলা', 'bhola', 'v', { 'pres.0': 'ভুলি|bhuli', 'past.0': 'ভুললাম|bhullam' });
F('খোলা', 'khola', 'v', { 'pres.0': 'খুলি|khuli', 'pres.4': 'খোলে|khole', 'inf.0': 'খুলতে|khulte' });
F('ঘোরা', 'ghora', 'v', { 'pres.0': 'ঘুরি|ghuri', 'pres.2': 'ঘোরো|ghoro' });
F('বোঝা', 'bojha', 'v', { 'pres.0': 'বুঝি|bujhi', 'pres.2': 'বোঝো|bojho', 'past.0': 'বুঝলাম|bujhlam' });
F('খোঁজা', 'khonja', 'v', { 'pres.0': 'খুঁজি|khunji', 'pres.2': 'খোঁজো|khonjo' });

// ======== আ-initial roots: the perfect and conjunctive stem starts with এ ==========================================
R('আসা', 'asha', '', 'pres', 'আসি ; আসিস ; আসো ; আসেন ; আসে ; আসেন', 'ashi ; ashis ; asho ; ashen ; ashe ; ashen');
R('আসা', 'asha', '', 'past', 'এলাম ; এলি ; এলে ; এলেন ; এল ; এলেন', 'elam ; eli ; ele ; elen ; elo ; elen');
R('আসা', 'asha', '', 'presPerf', 'এসেছি ; এসেছিস ; এসেছ ; এসেছেন ; এসেছে ; এসেছেন', 'eshechhi ; eshechhis ; eshechho ; eshechhen ; eshechhe ; eshechhen');
R('আসা', 'asha', '', 'fut', 'আসব ; আসবি ; আসবে ; আসবেন ; আসবে ; আসবেন', 'ashbo ; ashbi ; ashbe ; ashben ; ashbe ; ashben');
R('আসা', 'asha', '', 'imp', '- ; আয় ; এসো ; আসুন ; আসুক ; আসুন', '- ; ay ; esho ; ashun ; ashuk ; ashun');
F('আসা', 'asha', '', { 'conj.0': 'এসে|eshe', 'cond.0': 'এলে|ele', 'inf.0': 'আসতে|ashte', 'pastHab.0': 'আসতাম|ashtam', 'impNeg.2': 'আসো না|asho na' });
F('আনা', 'ana', '', { 'pres.0': 'আনি|ani', 'past.0': 'আনলাম|anlam', 'presPerf.0': 'এনেছি|enechhi', 'conj.0': 'এনে|ene', 'imp.1': 'আন|an' });
F('আঁকা', 'anka', '', { 'pres.0': 'আঁকি|anki', 'presPerf.0': 'এঁকেছি|enkechhi', 'conj.0': 'এঁকে|enke' });

// ======== the irregular vowel verbs ===========================================================================
R('যাওয়া', 'jaoa', '', 'pres', 'যাই ; যাস ; যাও ; যান ; যায় ; যান', 'jai ; jas ; jao ; jan ; jay ; jan');
R('যাওয়া', 'jaoa', '', 'presCont', 'যাচ্ছি ; যাচ্ছিস ; যাচ্ছ ; যাচ্ছেন ; যাচ্ছে ; যাচ্ছেন', 'jachchhi ; jachchhis ; jachchho ; jachchhen ; jachchhe ; jachchhen');
R('যাওয়া', 'jaoa', '', 'past', 'গেলাম ; গেলি ; গেলে ; গেলেন ; গেল ; গেলেন', 'gelam ; geli ; gele ; gelen ; gelo ; gelen');
R('যাওয়া', 'jaoa', '', 'pastHab', 'যেতাম ; যেতিস ; যেতে ; যেতেন ; যেত ; যেতেন', 'jetam ; jetis ; jete ; jeten ; jeto ; jeten');
R('যাওয়া', 'jaoa', '', 'presPerf', 'গিয়েছি ; গিয়েছিস ; গিয়েছ ; গিয়েছেন ; গিয়েছে ; গিয়েছেন', 'giyechhi ; giyechhis ; giyechho ; giyechhen ; giyechhe ; giyechhen');
R('যাওয়া', 'jaoa', '', 'fut', 'যাব ; যাবি ; যাবে ; যাবেন ; যাবে ; যাবেন', 'jabo ; jabi ; jabe ; jaben ; jabe ; jaben');
R('যাওয়া', 'jaoa', '', 'imp', '- ; যা ; যাও ; যান ; যাক ; যান', '- ; ja ; jao ; jan ; jak ; jan');
R('যাওয়া', 'jaoa', '', 'negPast', 'যাইনি ; যাসনি ; যাওনি ; যাননি ; যায়নি ; যাননি', 'jaini ; jasni ; jaoni ; janni ; jayni ; janni');
F('যাওয়া', 'jaoa', '', { 'conj.0': 'গিয়ে|giye', 'cond.0': 'গেলে|gele', 'inf.0': 'যেতে|jete', 'noun.0': 'যাওয়া|jaoa' });
R('খাওয়া', 'khaoa', '', 'pres', 'খাই ; খাস ; খাও ; খান ; খায় ; খান', 'khai ; khas ; khao ; khan ; khay ; khan');
R('খাওয়া', 'khaoa', '', 'past', 'খেলাম ; খেলি ; খেলে ; খেলেন ; খেল ; খেলেন', 'khelam ; kheli ; khele ; khelen ; khelo ; khelen');
R('খাওয়া', 'khaoa', '', 'presPerf', 'খেয়েছি ; খেয়েছিস ; খেয়েছ ; খেয়েছেন ; খেয়েছে ; খেয়েছেন', 'kheyechhi ; kheyechhis ; kheyechho ; kheyechhen ; kheyechhe ; kheyechhen');
R('খাওয়া', 'khaoa', '', 'fut', 'খাব ; খাবি ; খাবে ; খাবেন ; খাবে ; খাবেন', 'khabo ; khabi ; khabe ; khaben ; khabe ; khaben');
F('খাওয়া', 'khaoa', '', { 'conj.0': 'খেয়ে|kheye', 'inf.0': 'খেতে|khete', 'pastHab.0': 'খেতাম|khetam', 'imp.1': 'খা|kha', 'imp.3': 'খান|khan', 'presCont.0': 'খাচ্ছি|khachchhi' });
R('পাওয়া', 'paoa', '', 'past', 'পেলাম ; পেলি ; পেলে ; পেলেন ; পেল ; পেলেন', 'pelam ; peli ; pele ; pelen ; pelo ; pelen');
F('পাওয়া', 'paoa', '', { 'pres.0': 'পাই|pai', 'presPerf.0': 'পেয়েছি|peyechhi', 'fut.0': 'পাব|pabo', 'conj.0': 'পেয়ে|peye' });
R('দেওয়া', 'deoa', '', 'pres', 'দিই ; দিস ; দাও ; দেন ; দেয় ; দেন', 'dii ; dis ; dao ; den ; dey ; den');
R('দেওয়া', 'deoa', '', 'past', 'দিলাম ; দিলি ; দিলে ; দিলেন ; দিল ; দিলেন', 'dilam ; dili ; dile ; dilen ; dilo ; dilen');
R('দেওয়া', 'deoa', '', 'fut', 'দেব ; দিবি ; দেবে ; দেবেন ; দেবে ; দেবেন', 'debo ; dibi ; debe ; deben ; debe ; deben');
R('দেওয়া', 'deoa', '', 'imp', '- ; দে ; দাও ; দিন ; দিক ; দিন', '- ; de ; dao ; din ; dik ; din');
F('দেওয়া', 'deoa', '', { 'presPerf.0': 'দিয়েছি|diyechhi', 'presCont.0': 'দিচ্ছি|dichchhi', 'conj.0': 'দিয়ে|diye', 'inf.0': 'দিতে|dite', 'pastHab.0': 'দিতাম|ditam' });
R('নেওয়া', 'neoa', '', 'pres', 'নিই ; নিস ; নাও ; নেন ; নেয় ; নেন', 'nii ; nis ; nao ; nen ; ney ; nen');
R('নেওয়া', 'neoa', '', 'fut', 'নেব ; নিবি ; নেবে ; নেবেন ; নেবে ; নেবেন', 'nebo ; nibi ; nebe ; neben ; nebe ; neben');
F('নেওয়া', 'neoa', '', { 'past.0': 'নিলাম|nilam', 'presPerf.0': 'নিয়েছি|niyechhi', 'imp.1': 'নে|ne', 'imp.3': 'নিন|nin', 'conj.0': 'নিয়ে|niye' });
R('হওয়া', 'hoa', '', 'pres', 'হই ; হস ; হও ; হন ; হয় ; হন', 'hoi ; hos ; hoo ; hon ; hoy ; hon');
R('হওয়া', 'hoa', '', 'past', 'হলাম ; হলি ; হলে ; হলেন ; হল ; হলেন', 'holam ; holi ; hole ; holen ; holo ; holen');
R('হওয়া', 'hoa', '', 'fut', 'হব ; হবি ; হবে ; হবেন ; হবে ; হবেন', 'hobo ; hobi ; hobe ; hoben ; hobe ; hoben');
F('হওয়া', 'hoa', '', { 'presCont.0': 'হচ্ছি|hochchhi', 'presPerf.0': 'হয়েছি|hoyechhi', 'pastHab.0': 'হতাম|hotam', 'imp.1': 'হ|ho', 'imp.2': 'হও|hoo', 'imp.3': 'হোন|hon', 'imp.4': 'হোক|hok', 'conj.0': 'হয়ে|hoye', 'inf.0': 'হতে|hote', 'cond.0': 'হলে|hole' });
R('শোয়া', 'shoya', '', 'pres', 'শুই ; শুস ; শোও ; শোন ; শোয় ; শোন', 'shui ; shus ; shoo ; shon ; shoy ; shon');
F('শোয়া', 'shoya', '', { 'past.0': 'শুলাম|shulam', 'presPerf.0': 'শুয়েছি|shuyechhi', 'fut.0': 'শোব|shobo', 'conj.0': 'শুয়ে|shuye', 'imp.1': 'শো|sho' });
F('ধোয়া', 'dhoya', '', { 'pres.0': 'ধুই|dhui', 'past.0': 'ধুলাম|dhulam', 'conj.0': 'ধুয়ে|dhuye' });
R('চাওয়া', 'chaoa', '', 'pres', 'চাই ; চাস ; চাও ; চান ; চায় ; চান', 'chai ; chas ; chao ; chan ; chay ; chan');
R('চাওয়া', 'chaoa', '', 'past', 'চাইলাম ; চাইলি ; চাইলে ; চাইলেন ; চাইল ; চাইলেন', 'chailam ; chaili ; chaile ; chailen ; chailo ; chailen');
F('চাওয়া', 'chaoa', '', { 'presPerf.0': 'চেয়েছি|cheyechhi', 'fut.0': 'চাইব|chaibo', 'conj.0': 'চেয়ে|cheye', 'inf.0': 'চাইতে|chaite' });

// ======== ঘুমানো: derived verbs ================================================================================
R('ঘুমানো', 'ghumano', '', 'pres', 'ঘুমাই ; ঘুমাস ; ঘুমাও ; ঘুমান ; ঘুমায় ; ঘুমান', 'ghumai ; ghumas ; ghumao ; ghuman ; ghumay ; ghuman');
R('ঘুমানো', 'ghumano', '', 'past', 'ঘুমালাম ; ঘুমালি ; ঘুমালে ; ঘুমালেন ; ঘুমাল ; ঘুমালেন', 'ghumalam ; ghumali ; ghumale ; ghumalen ; ghumalo ; ghumalen');
R('ঘুমানো', 'ghumano', '', 'presPerf', 'ঘুমিয়েছি ; ঘুমিয়েছিস ; ঘুমিয়েছ ; ঘুমিয়েছেন ; ঘুমিয়েছে ; ঘুমিয়েছেন', 'ghumiyechhi ; ghumiyechhis ; ghumiyechho ; ghumiyechhen ; ghumiyechhe ; ghumiyechhen');
R('ঘুমানো', 'ghumano', '', 'imp', '- ; ঘুমা ; ঘুমাও ; ঘুমান ; ঘুমাক ; ঘুমান', '- ; ghuma ; ghumao ; ghuman ; ghumak ; ghuman');
F('ঘুমানো', 'ghumano', '', { 'presCont.0': 'ঘুমাচ্ছি|ghumachchhi', 'fut.0': 'ঘুমাব|ghumabo', 'conj.0': 'ঘুমিয়ে|ghumiye', 'inf.0': 'ঘুমাতে|ghumate', 'pastHab.0': 'ঘুমাতাম|ghumatam' });
F('দেখানো', 'dekhano', '', { 'pres.0': 'দেখাই|dekhai', 'presPerf.0': 'দেখিয়েছি|dekhiyechhi', 'conj.0': 'দেখিয়ে|dekhiye' });
F('শেখানো', 'shekhano', 'v', { 'pres.0': 'শেখাই|shekhai', 'past.0': 'শেখালাম|shekhalam', 'presPerf.0': 'শিখিয়েছি|shikhiyechhi', 'conj.0': 'শিখিয়ে|shikhiye' });
F('কামড়ানো', 'kamrano', '', { 'pres.0': 'কামড়াই|kamrai', 'presPerf.0': 'কামড়েছি|kamrechhi', 'conj.0': 'কামড়ে|kamre', 'past.0': 'কামড়ালাম|kamralam' });
F('বদলানো', 'bodlano', '', { 'presPerf.0': 'বদলেছি|bodlechhi', 'conj.0': 'বদলে|bodle', 'fut.0': 'বদলাব|bodlabo' });
F('সামলানো', 'shamlano', '', { 'presPerf.3': 'সামলেছেন|shamlechhen', 'conj.0': 'সামলে|shamle' });
F('পেটানো', 'petano', 'v', { 'pres.0': 'পেটাই|petai', 'presPerf.0': 'পিটিয়েছি|pitiyechhi', 'conj.0': 'পিটিয়ে|pitiye' });
F('গোছানো', 'gochhano', 'v', { 'conj.0': 'গুছিয়ে|guchhiye', 'presPerf.0': 'গুছিয়েছি|guchhiyechhi' });
F('খাওয়ানো', 'khaoano', '', { 'pres.0': 'খাওয়াই|khaoai', 'past.0': 'খাওয়ালাম|khaoalam', 'presPerf.0': 'খাইয়েছি|khaiyechhi', 'pastPerf.0': 'খাইয়েছিলাম|khaiyechhilam', 'conj.0': 'খাইয়ে|khaiye', 'fut.0': 'খাওয়াব|khaoabo' });
F('পৌঁছানো', 'pounchhano', '', { 'pres.0': 'পৌঁছাই|pounchhai', 'presPerf.0': 'পৌঁছেছি|pounchhechhi', 'conj.0': 'পৌঁছে|pounchhe' });
F('দৌড়ানো', 'dourano', '', { 'presPerf.0': 'দৌড়েছি|dourechhi', 'conj.0': 'দৌড়ে|doure' });
F('পারা', 'para', '', { 'pres.0': 'পারি|pari', 'pres.2': 'পারো|paro', 'past.0': 'পারলাম|parlam', 'presPerf.0': 'পেরেছি|perechhi', 'conj.0': 'পেরে|pere' });
F('ধোয়া', 'dhoya', '', { 'imp.3': 'ধুন|dhun', 'imp.4': 'ধুক|dhuk' });
F('পাঠানো', 'pathano', '', { 'pres.0': 'পাঠাই|pathai', 'presPerf.0': 'পাঠিয়েছি|pathiyechhi' });

// ======== compounds: only the last word is conjugated ==========================================================
F('কাজ করা', 'kaj kora', '', { 'pres.0': 'কাজ করি|kaj kori', 'negPast.3': 'কাজ করেননি|kaj korenni', 'imp.2': 'কাজ করো|kaj koro', 'noun.0': 'কাজ করা|kaj kora', 'conj.0': 'কাজ করে|kaj kore' });
F('ভয় পাওয়া', 'bhoy paoa', '', { 'pres.0': 'ভয় পাই|bhoy pai', 'presPerf.0': 'ভয় পেয়েছি|bhoy peyechhi', 'past.4': 'ভয় পেল|bhoy pelo' });
F('খুশি হওয়া', 'khushi hoa', '', { 'pres.0': 'খুশি হই|khushi hoi', 'fut.0': 'খুশি হব|khushi hobo' });
F('সাহায্য করা', 'sahajjo kora', '', { 'impNeg.2': 'সাহায্য করো না|sahajjo koro na' });

// ---- run the expectations ----------------------------------------------------------------------------------
const cellText = (cell, what) => (cell ? cell[what] : '-');
for (const { bn, rom, tag, key, scriptCells, romCells } of ROWS) {
  const row = express(entryOf(bn, rom, tag)).rows[key];
  const wantBn = scriptCells.split(' ; '), wantRom = romCells.split(' ; ');
  if (wantBn.length !== 6 || wantRom.length !== 6) { report.fail(`test table: ${bn} ${key} must list six cells`); continue; }
  for (let i = 0; i < 6; i++) {
    report.checks += 2;
    if (cellText(row[i], 'bn') !== wantBn[i]) report.fail(`${bn}.${key}[${SLOTS[i]}] script: expected "${wantBn[i]}", got "${cellText(row[i], 'bn')}"`);
    if (cellText(row[i], 'rom') !== wantRom[i]) report.fail(`${bn}.${key}[${SLOTS[i]}] romanization: expected "${wantRom[i]}", got "${cellText(row[i], 'rom')}"`);
  }
}
for (const { bn, rom, tag, forms } of FORMS) {
  const result = express(entryOf(bn, rom, tag));
  for (const [where, want] of Object.entries(forms)) {
    const [key, slot] = where.split('.');
    const cell = result.rows[key][Number(slot)];
    const [wantBn, wantRom] = want.split('|');
    report.checks += 2;
    if (cellText(cell, 'bn') !== wantBn) report.fail(`${bn}.${where} script: expected "${wantBn}", got "${cellText(cell, 'bn')}"`);
    if (cellText(cell, 'rom') !== wantRom) report.fail(`${bn}.${where} romanization: expected "${wantRom}", got "${cellText(cell, 'rom')}"`);
  }
}

// ---- the engine's own shape --------------------------------------------------------------------------------
{
  report.checks += 1;
  const expectedKeys = ['pres', 'presCont', 'past', 'pastCont', 'pastHab', 'presPerf', 'pastPerf', 'fut', 'negPres', 'negPast', 'negFut', 'imp', 'impNeg', 'cond', 'noun', 'inf', 'conj'];
  if (JSON.stringify(ROW_KEYS) !== JSON.stringify(expectedKeys)) report.fail(`ROW_KEYS: ${ROW_KEYS}`);
  const r = express(entryOf('করা', 'kora', ''));
  report.checks += 1;
  if (r.bn !== 'করা' || r.rom !== 'kora') report.fail(`express().bn/rom: ${r.bn} ${r.rom}`);
  for (const key of ROW_KEYS) {
    report.checks += 1;
    if (r.rows[key].length !== 6) report.fail(`${key}: ${r.rows[key].length} cells`);
  }
  // the imperative has no 1st person and no ordinary 3rd person in the negative
  report.checks += 4;
  if (r.rows.imp[0] !== null || r.rows.impNeg[0] !== null || r.rows.impNeg[4] !== null) report.fail('imp[0], impNeg[0] and impNeg[4] must be null');
  if (r.rows.imp[4] === null) report.fail('imp[4] (সে করুক) must exist');
}

// ---- refusals: the engine must throw a clear error instead of guessing -------------------------------------
function throwsWith(entry, fragment) {
  report.checks += 1;
  try { express(entry); } catch (e) {
    if (!String(e.message).includes(fragment)) report.fail(`refusal: expected the message to contain "${fragment}", got "${e.message}"`);
    return;
  }
  report.fail(`refusal: express(${JSON.stringify(entry)}) should have thrown (${fragment})`);
}
throwsWith(entryOf('করা', 'kora', 'x'), 'unknown tag');
throwsWith(entryOf('করি', 'kori', ''), 'not a verbal noun');
throwsWith(entryOf('এগোনো', 'egono', ''), 'not a verbal noun');
throwsWith(entryOf('করা', 'kori', ''), 'must end in a');
throwsWith(entryOf('করা', 'kora', 'v'), 'tag v needs a root vowel');
throwsWith(entryOf('খাওয়া', 'khaoa', 'v'), 'tag v only applies');
throwsWith(entryOf('কাজ করা', 'kora', ''), 'different numbers of words');
throwsWith(entryOf('kora', 'kora', ''), 'not written in Bengali script');
throwsWith(entryOf('ছোঁয়া', 'chhonya', ''), 'not supported');
throwsWith(entryOf('বাওয়া', 'baoa', 'v'), 'tag v only applies');
throwsWith({ bn: '', rom: 'x' }, 'non-empty');
throwsWith(null, 'must be an object');

// ---- audit sets: tags the database must carry ----------------------------------------------------------------
const MUST_BE_V = ['পেটানো', 'গোছানো', 'লেখা', 'শেখা', 'শোনা', 'কেনা', 'চেনা', 'তোলা', 'ভোলা', 'খোলা', 'ঘোরা', 'বোঝা', 'ওঠা', 'খোঁজা', 'ঢোকা', 'ছেঁড়া', 'শেখানো', 'জোটা', 'ফোটা'];
const MUST_NOT_BE_V = ['করা', 'দেখা', 'ফেলা', 'বলা', 'পড়া', 'ডাকা', 'ধরা', 'থাকা', 'বসা', 'চলা', 'রাখা', 'মারা', 'জানা', 'আনা', 'ঠেলা', 'দেখানো', 'ঘুমানো', 'পাঠানো', 'আসা'];
const tagOf = new Map();
for (const options of Object.values(VERBS)) for (const e of options) tagOf.set(e.bn.normalize('NFC'), e.tag);
for (const w of MUST_BE_V) {
  report.checks += 1;
  if (tagOf.has(w.normalize('NFC')) && tagOf.get(w.normalize('NFC')) !== 'v') report.fail(`${w} must be tagged [v]`);
}
for (const w of MUST_NOT_BE_V) {
  report.checks += 1;
  if (tagOf.has(w.normalize('NFC')) && tagOf.get(w.normalize('NFC')) === 'v') report.fail(`${w} must not be tagged [v]`);
}

// ---- consonant skeletons: the script and its romanization must agree ------------------------------------------
const CONS = {
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng', 'চ': 'ch', 'ছ': 'ch', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n', 'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm', 'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'S', 'ষ': 'S', 'স': 'S',
  'হ': 'h', 'ৎ': 't', 'ং': 'ng', 'ঁ': 'n',
};
// Letters that a conjunct may or may not pronounce: য-ফলা (by in ব্যবহার, but shohho for সহ্য), ম-ফলা (jonmo, but
// pronounced as doubling in some words) and ব-ফলা. When the script has such a conjunct, that letter is ignored on both sides.
const optionalLetters = bn => (/[^র]্য|ওয়|োয়া/.test(bn) ? 'y' : '') + (bn.includes('্ম') ? 'm' : '') + (bn.includes('্ব') ? 'b' : '');
function scriptSkeleton(bn) {
  // conjuncts with a special reading become one token: জ্ঞ (gg / gy / jn) -> G, ক্ষ (kkh / ksh) -> X
  const chars = [...bn.normalize('NFC').replace(/ওয়/g, 'ও').replace(/জ্ঞ/g, 'G').replace(/ক্ষ/g, 'X')];   // the oa of খাওয়া has no y
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i], next = chars[i + 1];
    if (c === 'G' || c === 'X') { out += c; continue; }
    if (c === 'ড' && next === '়') { out += 'r'; i++; continue; }
    if (c === 'ঢ' && next === '়') { out += 'rh'; i++; continue; }
    if (c === 'য' && next === '়') { out += 'y'; i++; continue; }
    if (c === 'ৃ' || c === 'ঋ') { out += 'r'; continue; }                    // ঋ and the ৃ sign are read ri
    if (c === 'ফ') { out += 'P'; continue; }                                 // ph, or f in loanwords
    if (c === 'য' && chars[i - 1] === '্') { out += chars[i - 2] === 'র' ? 'j' : 'y'; continue; }   // র্য is rjo (কার্য), য-ফলা elsewhere is y
    if (Object.hasOwn(CONS, c)) out += CONS[c];
  }
  return out;
}
const collapse = s => s.replace(/(.)\1+/g, '$1');
function skeleton(text, isRom, bn) {
  let s = isRom ? text : scriptSkeleton(text);
  if (isRom) {
    if (bn.includes('র্য')) s = s.replace(/ry/g, 'rj');            // র্য is rjo (কার্য), often written ryo
    if (bn.includes('জ্ঞ')) s = s.replace(/gg|gy|jn/g, 'G');
    if (bn.includes('ক্ষ')) s = s.replace(/kkh|ksh/g, 'X');
    s = s.replace(/chh/g, 'ch').replace(/ph|f/g, 'P').replace(/sh/g, 'S').replace(/s/g, 'S').replace(/[aeiou' -]/g, '');
  } else {
    s = s.replace(/[ ]/g, '');
  }
  for (const letter of optionalLetters(bn)) s = s.split(letter).join('');
  return collapse(s);
}
const skeletonProblem = (bn, rom) => {
  const a = skeleton(bn, false, bn), b = skeleton(rom, true, bn);
  return a === b ? '' : `consonants differ: script ${a} / romanization ${b}`;
};
// a few words of the engine itself
for (const [bn, rom] of [['খাওয়া', 'khaoa'], ['দাঁড়ানো', 'danrano'], ['ব্যবহার করা', 'byabohar kora'], ['ভালোবাসা', 'bhalobasha'], ['ঢোকা', 'dhoka'], ['পড়া', 'pora'], ['হওয়া', 'hoa'], ['ছাড়া', 'chhara']]) {
  report.checks += 1;
  const p = skeletonProblem(bn, rom);
  if (p) report.fail(`skeleton self-test ${bn}: ${p}`);
}

// ---- the database ---------------------------------------------------------------------------------------------
const NFC = s => s.normalize('NFC') === s;
const ALLOWED_TWO_ROMS = new Set([]);          // spellings that legitimately have two romanizations
const romOf = new Map();
const checkedPairs = new Set();
const problems = { entry: [], script: [], rom: [], skeleton: [], cell: [], twoRoms: [], dup: [] };
let translations = 0;
for (const [english, options] of Object.entries(VERBS)) {
  const seen = new Set();
  for (const entry of options) {
    translations += 1;
    const where = `${english} -> ${entry.bn} ${entry.rom}`;
    if (seen.has(entry.bn)) problems.dup.push(`${english}: "${entry.bn}" is listed twice`);
    seen.add(entry.bn);
    if (!NFC(entry.bn)) problems.script.push(`${where}: not NFC`);
    if (!/^[ঀ-৿ ]+$/.test(entry.bn)) problems.script.push(`${where}: characters outside Bengali script`);
    if (!/^[a-z' -]+$/.test(entry.rom)) problems.rom.push(`${where}: romanization characters`);
    if (romOf.has(entry.bn) && romOf.get(entry.bn) !== entry.rom && !ALLOWED_TWO_ROMS.has(entry.bn)) problems.twoRoms.push(`${entry.bn}: "${romOf.get(entry.bn)}" and "${entry.rom}"`);
    romOf.set(entry.bn, entry.rom);
    let result;
    try { result = express(entry); } catch (e) { problems.entry.push(`${where}: ${e.message}`); continue; }
    const sk = skeletonProblem(result.bn, result.rom);
    if (sk) { problems.skeleton.push(`${where}: ${sk}`); continue; }
    for (const key of ROW_KEYS) {
      const cells = result.rows[key];
      if (!Array.isArray(cells) || cells.length !== 6) { problems.cell.push(`${where}.${key}: not six cells`); continue; }
      cells.forEach((cell, i) => {
        if (cell === null) return;
        if (!cell.bn || !cell.rom || /undefined|NaN|null/.test(cell.bn + cell.rom)) problems.cell.push(`${where}.${key}[${i}]: "${cell.bn}" / "${cell.rom}"`);
        else if (!NFC(cell.bn)) problems.cell.push(`${where}.${key}[${i}]: not NFC`);
        else {
          const pair = cell.bn + '|' + cell.rom;
          if (!checkedPairs.has(pair)) {
            checkedPairs.add(pair);
            const p = skeletonProblem(cell.bn, cell.rom);
            if (p) problems.skeleton.push(`${where}.${key}[${i}] "${cell.bn}" / "${cell.rom}": ${p}`);
          }
        }
      });
    }
  }
}
for (const [kind, list] of Object.entries(problems)) {
  report.checks += 1;
  if (list.length) report.fail(`${kind}: ${list.length} problem(s), e.g.\n      ${list.slice(0, 12).join('\n      ')}`);
}

report.finish(`${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Bengali translations`, { limit: 40 });
