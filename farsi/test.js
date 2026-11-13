// Run with: node test.js
// Checks the Persian pattern engine against known paradigms (script and transliteration),
// then validates every verb in verbs.js: script and transliteration agree, the engine can
// conjugate it, and nothing comes out empty or broken.
const { express, ROW_KEYS } = require('./patterns.js');
const { VERBS } = require('./verbs.js');
const { createReport } = require('../shared/test-kit.js');

const report = createReport();
const { failures } = report;

// '_' stands for the zero-width non-joiner in the expected strings (می_روم = می‌روم).
const z = s => s.replace(/_/g, '‌');
// Six forms separated by ';', in the order man, to, u, mâ, shomâ, ânhâ ('-' = the form does not exist).
const six = s => s.split(';').map(f => f.trim());

// Each entry: the verb as [script, transliteration], the expected script forms, and (optionally)
// the expected transliteration for some rows.
const EXPECTED = [
  {
    verb: ['رفتن', 'raftan'],
    fa: {
      pres: 'می_روم ; می_روی ; می_رود ; می_رویم ; می_روید ; می_روند',
      presProg: 'دارم می_روم ; داری می_روی ; دارد می_رود ; داریم می_رویم ; دارید می_روید ; دارند می_روند',
      past: 'رفتم ; رفتی ; رفت ; رفتیم ; رفتید ; رفتند',
      pastCont: 'می_رفتم ; می_رفتی ; می_رفت ; می_رفتیم ; می_رفتید ; می_رفتند',
      pastProg: 'داشتم می_رفتم ; داشتی می_رفتی ; داشت می_رفت ; داشتیم می_رفتیم ; داشتید می_رفتید ; داشتند می_رفتند',
      presPerf: 'رفته_ام ; رفته_ای ; رفته است ; رفته_ایم ; رفته_اید ; رفته_اند',
      pastPerf: 'رفته بودم ; رفته بودی ; رفته بود ; رفته بودیم ; رفته بودید ; رفته بودند',
      fut: 'خواهم رفت ; خواهی رفت ; خواهد رفت ; خواهیم رفت ; خواهید رفت ; خواهند رفت',
      negPres: 'نمی_روم ; نمی_روی ; نمی_رود ; نمی_رویم ; نمی_روید ; نمی_روند',
      negPast: 'نرفتم ; نرفتی ; نرفت ; نرفتیم ; نرفتید ; نرفتند',
      subj: 'بروم ; بروی ; برود ; برویم ; بروید ; بروند',
      subjPerf: 'رفته باشم ; رفته باشی ; رفته باشد ; رفته باشیم ; رفته باشید ; رفته باشند',
      impAff: 'برو ; برو ; برو ; برویم ; بروید ; بروید',
      impNeg: 'نرو ; نرو ; نرو ; نرویم ; نروید ; نروید',
    },
    tr: {
      pres: 'miravam ; miravi ; miravad ; miravim ; miravid ; miravand',
      past: 'raftam ; rafti ; raft ; raftim ; raftid ; raftand',
      presPerf: 'rafteam ; raftei ; rafte ast ; rafteim ; rafteid ; rafteand',
      pastPerf: 'rafte budam ; rafte budi ; rafte bud ; rafte budim ; rafte budid ; rafte budand',
      fut: 'khâham raft ; khâhi raft ; khâhad raft ; khâhim raft ; khâhid raft ; khâhand raft',
      negPast: 'naraftam ; narafti ; naraft ; naraftim ; naraftid ; naraftand',
      subj: 'beravam ; beravi ; beravad ; beravim ; beravid ; beravand',
      subjPerf: 'rafte bâsham ; rafte bâshi ; rafte bâshad ; rafte bâshim ; rafte bâshid ; rafte bâshand',
      impAff: 'berav ; berav ; berav ; beravim ; beravid ; beravid',
      impNeg: 'narav ; narav ; narav ; naravim ; naravid ; naravid',
    },
  },
  {
    // a stem ending in a vowel takes a ی; آ becomes یا after be- and na-
    verb: ['آمدن', 'âmadan'],
    fa: {
      pres: 'می_آیم ; می_آیی ; می_آید ; می_آییم ; می_آیید ; می_آیند',
      past: 'آمدم ; آمدی ; آمد ; آمدیم ; آمدید ; آمدند',
      fut: 'خواهم آمد ; خواهی آمد ; خواهد آمد ; خواهیم آمد ; خواهید آمد ; خواهند آمد',
      negPres: 'نمی_آیم ; نمی_آیی ; نمی_آید ; نمی_آییم ; نمی_آیید ; نمی_آیند',
      negPast: 'نیامدم ; نیامدی ; نیامد ; نیامدیم ; نیامدید ; نیامدند',
      subj: 'بیایم ; بیایی ; بیاید ; بیاییم ; بیایید ; بیایند',
      impAff: 'بیا ; بیا ; بیا ; بیاییم ; بیایید ; بیایید',
      impNeg: 'نیا ; نیا ; نیا ; نیاییم ; نیایید ; نیایید',
    },
    tr: {
      pres: 'miâyam ; miâyi ; miâyad ; miâyim ; miâyid ; miâyand',
      negPast: 'niyâmadam ; niyâmadi ; niyâmad ; niyâmadim ; niyâmadid ; niyâmadand',
      subj: 'biyâyam ; biyâyi ; biyâyad ; biyâyim ; biyâyid ; biyâyand',
      impAff: 'biyâ ; biyâ ; biyâ ; biyâyim ; biyâyid ; biyâyid',
    },
  },
  {
    verb: ['کردن', 'kardan'],
    fa: {
      pres: 'می_کنم ; می_کنی ; می_کند ; می_کنیم ; می_کنید ; می_کنند',
      past: 'کردم ; کردی ; کرد ; کردیم ; کردید ; کردند',
      subj: 'بکنم ; بکنی ; بکند ; بکنیم ; بکنید ; بکنند',
      impAff: 'بکن ; بکن ; بکن ; بکنیم ; بکنید ; بکنید',
      negPast: 'نکردم ; نکردی ; نکرد ; نکردیم ; نکردید ; نکردند',
    },
  },
  {
    // a compound conjugates its last word only; be- is dropped after کردن and شدن
    verb: ['قبول کردن', 'qabul kardan'],
    fa: {
      pres: 'قبول می_کنم ; قبول می_کنی ; قبول می_کند ; قبول می_کنیم ; قبول می_کنید ; قبول می_کنند',
      presProg: 'دارم قبول می_کنم ; داری قبول می_کنی ; دارد قبول می_کند ; داریم قبول می_کنیم ; دارید قبول می_کنید ; دارند قبول می_کنند',
      past: 'قبول کردم ; قبول کردی ; قبول کرد ; قبول کردیم ; قبول کردید ; قبول کردند',
      presPerf: 'قبول کرده_ام ; قبول کرده_ای ; قبول کرده است ; قبول کرده_ایم ; قبول کرده_اید ; قبول کرده_اند',
      pastPerf: 'قبول کرده بودم ; قبول کرده بودی ; قبول کرده بود ; قبول کرده بودیم ; قبول کرده بودید ; قبول کرده بودند',
      fut: 'قبول خواهم کرد ; قبول خواهی کرد ; قبول خواهد کرد ; قبول خواهیم کرد ; قبول خواهید کرد ; قبول خواهند کرد',
      negPast: 'قبول نکردم ; قبول نکردی ; قبول نکرد ; قبول نکردیم ; قبول نکردید ; قبول نکردند',
      subj: 'قبول کنم ; قبول کنی ; قبول کند ; قبول کنیم ; قبول کنید ; قبول کنند',
      impAff: 'قبول کن ; قبول کن ; قبول کن ; قبول کنیم ; قبول کنید ; قبول کنید',
      impNeg: 'قبول نکن ; قبول نکن ; قبول نکن ; قبول نکنیم ; قبول نکنید ; قبول نکنید',
    },
    tr: {
      pres: 'qabul mikonam ; qabul mikoni ; qabul mikonad ; qabul mikonim ; qabul mikonid ; qabul mikonand',
      subj: 'qabul konam ; qabul koni ; qabul konad ; qabul konim ; qabul konid ; qabul konand',
      negPast: 'qabul nakardam ; qabul nakardi ; qabul nakard ; qabul nakardim ; qabul nakardid ; qabul nakardand',
      fut: 'qabul khâham kard ; qabul khâhi kard ; qabul khâhad kard ; qabul khâhim kard ; qabul khâhid kard ; qabul khâhand kard',
    },
  },
  {
    verb: ['شدن', 'shodan'],
    fa: {
      pres: 'می_شوم ; می_شوی ; می_شود ; می_شویم ; می_شوید ; می_شوند',
      past: 'شدم ; شدی ; شد ; شدیم ; شدید ; شدند',
      subj: 'بشوم ; بشوی ; بشود ; بشویم ; بشوید ; بشوند',
    },
  },
  {
    verb: ['خوشحال شدن', 'khoshhâl shodan'],
    fa: { pres: 'خوشحال می_شوم ; خوشحال می_شوی ; خوشحال می_شود ; خوشحال می_شویم ; خوشحال می_شوید ; خوشحال می_شوند', subj: 'خوشحال شوم ; خوشحال شوی ; خوشحال شود ; خوشحال شویم ; خوشحال شوید ; خوشحال شوند' },
  },
  {
    verb: ['دادن', 'dâdan'],
    fa: {
      pres: 'می_دهم ; می_دهی ; می_دهد ; می_دهیم ; می_دهید ; می_دهند',
      past: 'دادم ; دادی ; داد ; دادیم ; دادید ; دادند',
      subj: 'بدهم ; بدهی ; بدهد ; بدهیم ; بدهید ; بدهند',
      impAff: 'بده ; بده ; بده ; بدهیم ; بدهید ; بدهید',
    },
  },
  { verb: ['انجام دادن', 'anjâm dâdan'], fa: { subj: 'انجام بدهم ; انجام بدهی ; انجام بدهد ; انجام بدهیم ; انجام بدهید ; انجام بدهند', pres: 'انجام می_دهم ; انجام می_دهی ; انجام می_دهد ; انجام می_دهیم ; انجام می_دهید ; انجام می_دهند' } },
  {
    // to have: no mi-, no progressive, subjunctive داشته باشم
    verb: ['داشتن', 'dâshtan'],
    fa: {
      pres: 'دارم ; داری ; دارد ; داریم ; دارید ; دارند',
      presProg: '- ; - ; - ; - ; - ; -',
      pastProg: '- ; - ; - ; - ; - ; -',
      past: 'داشتم ; داشتی ; داشت ; داشتیم ; داشتید ; داشتند',
      fut: 'خواهم داشت ; خواهی داشت ; خواهد داشت ; خواهیم داشت ; خواهید داشت ; خواهند داشت',
      negPres: 'ندارم ; نداری ; ندارد ; نداریم ; ندارید ; ندارند',
      subj: 'داشته باشم ; داشته باشی ; داشته باشد ; داشته باشیم ; داشته باشید ; داشته باشند',
      impAff: 'داشته باش ; داشته باش ; داشته باش ; داشته باشیم ; داشته باشید ; داشته باشید',
    },
    tr: { pres: 'dâram ; dâri ; dârad ; dârim ; dârid ; dârand', negPres: 'nadâram ; nadâri ; nadârad ; nadârim ; nadârid ; nadârand' },
  },
  { verb: ['دوست داشتن', 'dust dâshtan'], fa: { pres: 'دوست دارم ; دوست داری ; دوست دارد ; دوست داریم ; دوست دارید ; دوست دارند', negPres: 'دوست ندارم ; دوست نداری ; دوست ندارد ; دوست نداریم ; دوست ندارید ; دوست ندارند', past: 'دوست داشتم ; دوست داشتی ; دوست داشت ; دوست داشتیم ; دوست داشتید ; دوست داشتند', subj: 'دوست داشته باشم ; دوست داشته باشی ; دوست داشته باشد ; دوست داشته باشیم ; دوست داشته باشید ; دوست داشته باشند' } },
  {
    // to be: هستم, no mi-, no progressive
    verb: ['بودن', 'budan'],
    fa: {
      pres: 'هستم ; هستی ; است ; هستیم ; هستید ; هستند',
      presProg: '- ; - ; - ; - ; - ; -',
      past: 'بودم ; بودی ; بود ; بودیم ; بودید ; بودند',
      pastCont: '- ; - ; - ; - ; - ; -',
      presPerf: 'بوده_ام ; بوده_ای ; بوده است ; بوده_ایم ; بوده_اید ; بوده_اند',
      fut: 'خواهم بود ; خواهی بود ; خواهد بود ; خواهیم بود ; خواهید بود ; خواهند بود',
      negPres: 'نیستم ; نیستی ; نیست ; نیستیم ; نیستید ; نیستند',
      negPast: 'نبودم ; نبودی ; نبود ; نبودیم ; نبودید ; نبودند',
      subj: 'باشم ; باشی ; باشد ; باشیم ; باشید ; باشند',
      impAff: 'باش ; باش ; باش ; باشیم ; باشید ; باشید',
      impNeg: 'نباش ; نباش ; نباش ; نباشیم ; نباشید ; نباشید',
    },
    tr: { pres: 'hastam ; hasti ; ast ; hastim ; hastid ; hastand', negPres: 'nistam ; nisti ; nist ; nistim ; nistid ; nistand', subj: 'bâsham ; bâshi ; bâshad ; bâshim ; bâshid ; bâshand' },
  },
  { verb: ['حاضر بودن', 'hâzer budan'], fa: { pres: 'حاضر هستم ; حاضر هستی ; حاضر است ; حاضر هستیم ; حاضر هستید ; حاضر هستند', subj: 'حاضر باشم ; حاضر باشی ; حاضر باشد ; حاضر باشیم ; حاضر باشید ; حاضر باشند' } },
  {
    verb: ['گفتن', 'goftan'],
    fa: {
      pres: 'می_گویم ; می_گویی ; می_گوید ; می_گوییم ; می_گویید ; می_گویند',
      past: 'گفتم ; گفتی ; گفت ; گفتیم ; گفتید ; گفتند',
      subj: 'بگویم ; بگویی ; بگوید ; بگوییم ; بگویید ; بگویند',
      impAff: 'بگو ; بگو ; بگو ; بگوییم ; بگویید ; بگویید',
    },
    tr: { pres: 'miguyam ; miguyi ; miguyad ; miguyim ; miguyid ; miguyand' },
  },
  { verb: ['دیدن', 'didan'], fa: { pres: 'می_بینم ; می_بینی ; می_بیند ; می_بینیم ; می_بینید ; می_بینند', subj: 'ببینم ; ببینی ; ببیند ; ببینیم ; ببینید ; ببینند', impAff: 'ببین ; ببین ; ببین ; ببینیم ; ببینید ; ببینید', past: 'دیدم ; دیدی ; دید ; دیدیم ; دیدید ; دیدند' } },
  { verb: ['زدن', 'zadan'], fa: { pres: 'می_زنم ; می_زنی ; می_زند ; می_زنیم ; می_زنید ; می_زنند', subj: 'بزنم ; بزنی ; بزند ; بزنیم ; بزنید ; بزنند' } },
  { verb: ['حرف زدن', 'harf zadan'], fa: { subj: 'حرف بزنم ; حرف بزنی ; حرف بزند ; حرف بزنیم ; حرف بزنید ; حرف بزنند', impAff: 'حرف بزن ; حرف بزن ; حرف بزن ; حرف بزنیم ; حرف بزنید ; حرف بزنید' } },
  { verb: ['گرفتن', 'gereftan'], fa: { pres: 'می_گیرم ; می_گیری ; می_گیرد ; می_گیریم ; می_گیرید ; می_گیرند', subj: 'بگیرم ; بگیری ; بگیرد ; بگیریم ; بگیرید ; بگیرند' } },
  { verb: ['تصمیم گرفتن', 'tasmim gereftan'], fa: { subj: 'تصمیم بگیرم ; تصمیم بگیری ; تصمیم بگیرد ; تصمیم بگیریم ; تصمیم بگیرید ; تصمیم بگیرند', past: 'تصمیم گرفتم ; تصمیم گرفتی ; تصمیم گرفت ; تصمیم گرفتیم ; تصمیم گرفتید ; تصمیم گرفتند' } },
  { verb: ['خوردن', 'khordan'], fa: { pres: 'می_خورم ; می_خوری ; می_خورد ; می_خوریم ; می_خورید ; می_خورند', subj: 'بخورم ; بخوری ; بخورد ; بخوریم ; بخورید ; بخورند', impAff: 'بخور ; بخور ; بخور ; بخوریم ; بخورید ; بخورید' } },
  { verb: ['بردن', 'bordan'], fa: { pres: 'می_برم ; می_بری ; می_برد ; می_بریم ; می_برید ; می_برند', subj: 'ببرم ; ببری ; ببرد ; ببریم ; ببرید ; ببرند' } },
  {
    verb: ['آوردن', 'âvardan'],
    fa: {
      pres: 'می_آورم ; می_آوری ; می_آورد ; می_آوریم ; می_آورید ; می_آورند',
      negPast: 'نیاوردم ; نیاوردی ; نیاورد ; نیاوردیم ; نیاوردید ; نیاوردند',
      subj: 'بیاورم ; بیاوری ; بیاورد ; بیاوریم ; بیاورید ; بیاورند',
      impAff: 'بیاور ; بیاور ; بیاور ; بیاوریم ; بیاورید ; بیاورید',
    },
    tr: { subj: 'biyâvaram ; biyâvari ; biyâvarad ; biyâvarim ; biyâvarid ; biyâvarand' },
  },
  {
    // مضارع of the modal-like verbs; no progressive
    verb: ['خواستن', 'khâstan'],
    fa: {
      pres: 'می_خواهم ; می_خواهی ; می_خواهد ; می_خواهیم ; می_خواهید ; می_خواهند',
      presProg: '- ; - ; - ; - ; - ; -',
      fut: 'خواهم خواست ; خواهی خواست ; خواهد خواست ; خواهیم خواست ; خواهید خواست ; خواهند خواست',
      subj: 'بخواهم ; بخواهی ; بخواهد ; بخواهیم ; بخواهید ; بخواهند',
    },
  },
  { verb: ['دانستن', 'dânestan'], fa: { pres: 'می_دانم ; می_دانی ; می_داند ; می_دانیم ; می_دانید ; می_دانند', subj: 'بدانم ; بدانی ; بداند ; بدانیم ; بدانید ; بدانند', impAff: 'بدان ; بدان ; بدان ; بدانیم ; بدانید ; بدانید', pastProg: '- ; - ; - ; - ; - ; -' } },
  { verb: ['توانستن', 'tavânestan'], fa: { pres: 'می_توانم ; می_توانی ; می_تواند ; می_توانیم ; می_توانید ; می_توانند', subj: 'بتوانم ; بتوانی ; بتواند ; بتوانیم ; بتوانید ; بتوانند', presProg: '- ; - ; - ; - ; - ; -' } },
  { verb: ['نشستن', 'neshastan'], fa: { pres: 'می_نشینم ; می_نشینی ; می_نشیند ; می_نشینیم ; می_نشینید ; می_نشینند', subj: 'بنشینم ; بنشینی ; بنشیند ; بنشینیم ; بنشینید ; بنشینند', impAff: 'بنشین ; بنشین ; بنشین ; بنشینیم ; بنشینید ; بنشینید' } },
  {
    // ایست- keeps its alef: بایست, نایست
    verb: ['ایستادن', 'istâdan'],
    fa: {
      pres: 'می_ایستم ; می_ایستی ; می_ایستد ; می_ایستیم ; می_ایستید ; می_ایستند',
      subj: 'بایستم ; بایستی ; بایستد ; بایستیم ; بایستید ; بایستند',
      impAff: 'بایست ; بایست ; بایست ; بایستیم ; بایستید ; بایستید',
      negPast: 'نایستادم ; نایستادی ; نایستاد ; نایستادیم ; نایستادید ; نایستادند',
    },
  },
  {
    // a stem that starts with ا takes ی: بیفتم, نیفتادم
    verb: ['افتادن', 'oftâdan'],
    fa: {
      pres: 'می_افتم ; می_افتی ; می_افتد ; می_افتیم ; می_افتید ; می_افتند',
      subj: 'بیفتم ; بیفتی ; بیفتد ; بیفتیم ; بیفتید ; بیفتند',
      impAff: 'بیفت ; بیفت ; بیفت ; بیفتیم ; بیفتید ; بیفتید',
      negPast: 'نیفتادم ; نیفتادی ; نیفتاد ; نیفتادیم ; نیفتادید ; نیفتادند',
    },
    tr: { subj: 'biyoftam ; biyofti ; biyoftad ; biyoftim ; biyoftid ; biyoftand' },
  },
  { verb: ['انداختن', 'andâkhtan'], fa: { pres: 'می_اندازم ; می_اندازی ; می_اندازد ; می_اندازیم ; می_اندازید ; می_اندازند', subj: 'بیندازم ; بیندازی ; بیندازد ; بیندازیم ; بیندازید ; بیندازند', impAff: 'بینداز ; بینداز ; بینداز ; بیندازیم ; بیندازید ; بیندازید', negPast: 'نینداختم ; نینداختی ; نینداخت ; نینداختیم ; نینداختید ; نینداختند' } },
  { verb: ['نوشتن', 'neveshtan'], fa: { pres: 'می_نویسم ; می_نویسی ; می_نویسد ; می_نویسیم ; می_نویسید ; می_نویسند', subj: 'بنویسم ; بنویسی ; بنویسد ; بنویسیم ; بنویسید ; بنویسند' } },
  { verb: ['ساختن', 'sâkhtan'], fa: { pres: 'می_سازم ; می_سازی ; می_سازد ; می_سازیم ; می_سازید ; می_سازند' } },
  { verb: ['ریختن', 'rikhtan'], fa: { pres: 'می_ریزم ; می_ریزی ; می_ریزد ; می_ریزیم ; می_ریزید ; می_ریزند' } },
  { verb: ['کشتن', 'koshtan'], fa: { pres: 'می_کشم ; می_کشی ; می_کشد ; می_کشیم ; می_کشید ; می_کشند' } },
  { verb: ['بستن', 'bastan'], fa: { pres: 'می_بندم ; می_بندی ; می_بندد ; می_بندیم ; می_بندید ; می_بندند' } },
  { verb: ['شکستن', 'shekastan'], fa: { pres: 'می_شکنم ; می_شکنی ; می_شکند ; می_شکنیم ; می_شکنید ; می_شکنند' } },
  { verb: ['پذیرفتن', 'paziroftan'], fa: { pres: 'می_پذیرم ; می_پذیری ; می_پذیرد ; می_پذیریم ; می_پذیرید ; می_پذیرند' } },
  { verb: ['یافتن', 'yâftan'], fa: { pres: 'می_یابم ; می_یابی ; می_یابد ; می_یابیم ; می_یابید ; می_یابند' } },
  { verb: ['شنیدن', 'shenidan'], fa: { pres: 'می_شنوم ; می_شنوی ; می_شنود ; می_شنویم ; می_شنوید ; می_شنوند', past: 'شنیدم ; شنیدی ; شنید ; شنیدیم ; شنیدید ; شنیدند' } },
  { verb: ['دویدن', 'davidan'], fa: { pres: 'می_دوم ; می_دوی ; می_دود ; می_دویم ; می_دوید ; می_دوند' } },
  { verb: ['مردن', 'mordan'], fa: { pres: 'می_میرم ; می_میری ; می_میرد ; می_میریم ; می_میرید ; می_میرند' } },
  { verb: ['فروختن', 'forukhtan'], fa: { pres: 'می_فروشم ; می_فروشی ; می_فروشد ; می_فروشیم ; می_فروشید ; می_فروشند' } },
  { verb: ['خواندن', 'khândan'], fa: { pres: 'می_خوانم ; می_خوانی ; می_خواند ; می_خوانیم ; می_خوانید ; می_خوانند', subj: 'بخوانم ; بخوانی ; بخواند ; بخوانیم ; بخوانید ; بخوانند' } },
  { verb: ['ماندن', 'mândan'], fa: { pres: 'می_مانم ; می_مانی ; می_ماند ; می_مانیم ; می_مانید ; می_مانند' } },
  { verb: ['رساندن', 'resândan'], fa: { pres: 'می_رسانم ; می_رسانی ; می_رساند ; می_رسانیم ; می_رسانید ; می_رسانند', past: 'رساندم ; رساندی ; رساند ; رساندیم ; رساندید ; رساندند' } },
  { verb: ['گذاشتن', 'gozâshtan'], fa: { pres: 'می_گذارم ; می_گذاری ; می_گذارد ; می_گذاریم ; می_گذارید ; می_گذارند', subj: 'بگذارم ; بگذاری ; بگذارد ; بگذاریم ; بگذارید ; بگذارند' } },
  { verb: ['گذشتن', 'gozashtan'], fa: { pres: 'می_گذرم ; می_گذری ; می_گذرد ; می_گذریم ; می_گذرید ; می_گذرند' } },
  { verb: ['شستن', 'shostan'], fa: { pres: 'می_شویم ; می_شویی ; می_شوید ; می_شوییم ; می_شویید ; می_شویند' } },
  { verb: ['پوشیدن', 'pushidan'], fa: { pres: 'می_پوشم ; می_پوشی ; می_پوشد ; می_پوشیم ; می_پوشید ; می_پوشند', past: 'پوشیدم ; پوشیدی ; پوشید ; پوشیدیم ; پوشیدید ; پوشیدند' } },
  {
    // regular verbs in -idan: the stem is the infinitive without -idan
    verb: ['خندیدن', 'khandidan'],
    fa: {
      pres: 'می_خندم ; می_خندی ; می_خندد ; می_خندیم ; می_خندید ; می_خندند',
      past: 'خندیدم ; خندیدی ; خندید ; خندیدیم ; خندیدید ; خندیدند',
      presPerf: 'خندیده_ام ; خندیده_ای ; خندیده است ; خندیده_ایم ; خندیده_اید ; خندیده_اند',
      subj: 'بخندم ; بخندی ; بخندد ; بخندیم ; بخندید ; بخندند',
    },
    tr: { pres: 'mikhandam ; mikhandi ; mikhandad ; mikhandim ; mikhandid ; mikhandand', past: 'khandidam ; khandidi ; khandid ; khandidim ; khandidid ; khandidand' },
  },
  { verb: ['فهمیدن', 'fahmidan'], fa: { pres: 'می_فهمم ; می_فهمی ; می_فهمد ; می_فهمیم ; می_فهمید ; می_فهمند' } },
  { verb: ['خریدن', 'kharidan'], fa: { pres: 'می_خرم ; می_خری ; می_خرد ; می_خریم ; می_خرید ; می_خرند', subj: 'بخرم ; بخری ; بخرد ; بخریم ; بخرید ; بخرند' } },
  { verb: ['رسیدن', 'residan'], fa: { pres: 'می_رسم ; می_رسی ; می_رسد ; می_رسیم ; می_رسید ; می_رسند' } },
  { verb: ['گرداندن', 'gardândan'], fa: { pres: 'می_گردانم ; می_گردانی ; می_گرداند ; می_گردانیم ; می_گردانید ; می_گردانند' } },
  { verb: ['کمک کردن', 'komak kardan'], fa: { pres: 'کمک می_کنم ; کمک می_کنی ; کمک می_کند ; کمک می_کنیم ; کمک می_کنید ; کمک می_کنند', subj: 'کمک کنم ; کمک کنی ; کمک کند ; کمک کنیم ; کمک کنید ; کمک کنند', impAff: 'کمک کن ; کمک کن ; کمک کن ; کمک کنیم ; کمک کنید ; کمک کنید' } },
  {
    // a prefix verb: the prefix stays in front of mi-, na- and the stem, and replaces be-
    verb: ['بر|داشتن', 'bar|dâshtan'],
    fa: {
      pres: 'برمی_دارم ; برمی_داری ; برمی_دارد ; برمی_داریم ; برمی_دارید ; برمی_دارند',
      past: 'برداشتم ; برداشتی ; برداشت ; برداشتیم ; برداشتید ; برداشتند',
      presPerf: 'برداشته_ام ; برداشته_ای ; برداشته است ; برداشته_ایم ; برداشته_اید ; برداشته_اند',
      fut: 'برخواهم داشت ; برخواهی داشت ; برخواهد داشت ; برخواهیم داشت ; برخواهید داشت ; برخواهند داشت',
      negPres: 'برنمی_دارم ; برنمی_داری ; برنمی_دارد ; برنمی_داریم ; برنمی_دارید ; برنمی_دارند',
      negPast: 'برنداشتم ; برنداشتی ; برنداشت ; برنداشتیم ; برنداشتید ; برنداشتند',
      subj: 'بردارم ; برداری ; بردارد ; برداریم ; بردارید ; بردارند',
      presProg: 'دارم برمی_دارم ; داری برمی_داری ; دارد برمی_دارد ; داریم برمی_داریم ; دارید برمی_دارید ; دارند برمی_دارند',
      impAff: 'بردار ; بردار ; بردار ; برداریم ; بردارید ; بردارید',
      impNeg: 'برندار ; برندار ; برندار ; برنداریم ; برندارید ; برندارید',
    },
    tr: { pres: 'barmidâram ; barmidâri ; barmidârad ; barmidârim ; barmidârid ; barmidârand', subj: 'bardâram ; bardâri ; bardârad ; bardârim ; bardârid ; bardârand', negPast: 'barnadâshtam ; barnadâshti ; barnadâsht ; barnadâshtim ; barnadâshtid ; barnadâshtand' },
  },
  {
    verb: ['در|آمدن', 'dar|âmadan'],
    fa: {
      pres: 'درمی_آیم ; درمی_آیی ; درمی_آید ; درمی_آییم ; درمی_آیید ; درمی_آیند',
      past: 'درآمدم ; درآمدی ; درآمد ; درآمدیم ; درآمدید ; درآمدند',
      negPast: 'درنیامدم ; درنیامدی ; درنیامد ; درنیامدیم ; درنیامدید ; درنیامدند',
      subj: 'درآیم ; درآیی ; درآید ; درآییم ; درآیید ; درآیند',
      impAff: 'درآ ; درآ ; درآ ; درآییم ; درآیید ; درآیید',
    },
  },
  { verb: ['بر|گشتن', 'bar|gashtan'], fa: { pres: 'برمی_گردم ; برمی_گردی ; برمی_گردد ; برمی_گردیم ; برمی_گردید ; برمی_گردند', past: 'برگشتم ; برگشتی ; برگشت ; برگشتیم ; برگشتید ; برگشتند', subj: 'برگردم ; برگردی ; برگردد ; برگردیم ; برگردید ; برگردند', impAff: 'برگرد ; برگرد ; برگرد ; برگردیم ; برگردید ; برگردید' } },
  { verb: ['فرو|رفتن', 'foru|raftan'], fa: { pres: 'فرومی_روم ; فرومی_روی ; فرومی_رود ; فرومی_رویم ; فرومی_روید ; فرومی_روند' } },
];

let checks = 0;
const same = (label, got, want) => { checks += 1; if (got !== want) failures.push(`${label}\n    expected: ${want}\n    actual:   ${got}`); };

for (const { verb: [fa, tr], fa: faRows, tr: trRows = {} } of EXPECTED) {
  let result;
  try { result = express({ fa, tr }); } catch (error) { failures.push(`${fa} ${tr}: express() threw "${error.message}"`); continue; }
  const forms = (row, field) => result.rows[row] ? result.rows[row].map(cell => (cell ? cell[field] : '-')).join(' ; ') : null;
  for (const [row, want] of Object.entries(faRows)) same(`${fa} ${row} (script)`, forms(row, 'fa'), six(z(want)).join(' ; '));
  for (const [row, want] of Object.entries(trRows)) same(`${fa} ${row} (transliteration)`, forms(row, 'tr'), six(want).join(' ; '));
}

// The display forms drop the "|"; the row keys are the same for every verb.
{ const shown = express({ fa: 'بر|داشتن', tr: 'bar|dâshtan' }); same('display of a prefix verb', `${shown.fa} ${shown.tr}`, 'برداشتن bardâshtan'); }
same('every row key is present', ROW_KEYS.every(k => k in express({ fa: 'رفتن', tr: 'raftan' }).rows), true);
same('six cells per row', ROW_KEYS.every(k => express({ fa: 'رفتن', tr: 'raftan' }).rows[k].length === 6), true);

// Bad input must be refused, not guessed at.
const throwsWith = (label, entry, pattern) => {
  checks += 1;
  try { express(entry); } catch (error) { if (!pattern.test(error.message)) failures.push(`${label}: wrong error "${error.message}"`); return; }
  failures.push(`${label}: did not throw`);
};
throwsWith('an infinitive must end in -an', { fa: 'تراشیدنی', tr: 'tarâshidani' }, /not an infinitive/);
throwsWith('a verb with no known stem', { fa: 'گسیختن', tr: 'gosikhtan' }, /no present stem/);
throwsWith('word counts differ', { fa: 'قبول کردن', tr: 'kardan' }, /different numbers of words/);
throwsWith('| in only one', { fa: 'بر|داشتن', tr: 'bardâshtan' }, /"\|"/);
throwsWith('not an infinitive', { fa: 'رفت', tr: 'raft' }, /not an infinitive/);

// ---- Validating the verb database ---------------------------------------------

// consonant skeleton: ambiguous letters (the vowels, و ی ه ع ء) are ignored on both sides
const SCRIPT = { 'ب': 'b', 'پ': 'p', 'ت': 't', 'ط': 't', 'ث': 's', 'س': 's', 'ص': 's', 'ج': 'j', 'چ': 'C', 'خ': 'K', 'د': 'd', 'ذ': 'z', 'ز': 'z', 'ض': 'z', 'ظ': 'z', 'ر': 'r', 'ژ': 'Z', 'ش': 'S', 'غ': 'G', 'ق': 'G', 'ف': 'f', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n' };
const collapse = s => s.replace(/(.)\1+/g, '$1');   // a doubled letter (tashdid) is written once in script
const skeletonFa = w => collapse([...w].map(c => SCRIPT[c] || '').join(''));
function skeletonTr(w) {
  let s = '';
  for (let i = 0; i < w.length; i++) {
    const two = w.slice(i, i + 2);
    if (two === 'kh') { s += 'K'; i++; } else if (two === 'sh') { s += 'S'; i++; } else if (two === 'zh') { s += 'Z'; i++; }
    else if (two === 'ch') { s += 'C'; i++; } else if (two === 'gh') { s += 'G'; i++; }
    else if (w[i] === 'q') s += 'G';
    else if ('bpdfgjklmnrstz'.includes(w[i])) s += w[i];
  }
  return collapse(s);
}

// Spellings that are two different words, each read its own way (read one by one):
//   ترک tark (leave) / tarak (a crack)      فوت fowt (death) / fut (a puff of breath)
//   بر bar (on, a prefix) / bor (shuffle)    سر sar (head, a prefix) / sor (to slide)
const TWO_READINGS = new Set(['ترک', 'فوت', 'بر', 'سر']);
let translations = 0;
const readingOf = {};
for (const [english, options] of Object.entries(VERBS)) {
  for (const { fa, tr } of options) {
    translations += 1;
    const label = `${english} -> ${fa} ${tr}`;
    if (!/^[؀-ۿ‌|\s]+$/.test(fa)) failures.push(`${label}: script has characters outside the Arabic block`);
    if (/[يكةى]/.test(fa)) failures.push(`${label}: Arabic letter in a Persian word (use ی ک ه)`);
    if (!/^[a-zâ'|\s-]+$/.test(tr)) failures.push(`${label}: transliteration has unexpected characters`);
    const fw = fa.split(/\s+/), tw = tr.split(/\s+/);
    if (fw.length !== tw.length) { failures.push(`${label}: ${fw.length} word(s) in script but ${tw.length} in transliteration`); continue; }
    fw.forEach((w, i) => {
      const a = skeletonFa(w.replace('|', '')), b = skeletonTr(tw[i].replace('|', ''));
      if (a !== b) failures.push(`${label}: consonants of ${w} (${a}) and ${tw[i]} (${b}) differ`);
      // one transliteration per spelling across the database
      if (readingOf[w] && readingOf[w] !== tw[i] && !TWO_READINGS.has(w)) failures.push(`${label}: ${w} is also written "${readingOf[w]}" elsewhere`);
      readingOf[w] = tw[i];
    });
    let result;
    try { result = express({ fa, tr }); } catch (error) { failures.push(`${label}: ${error.message}`); continue; }
    for (const key of ROW_KEYS) {
      const row = result.rows[key];
      if (!Array.isArray(row) || row.length !== 6) failures.push(`${label}: malformed row ${key}`);
      else if (row.some(cell => cell && (!cell.fa || !cell.tr || /undefined|NaN/.test(cell.fa + cell.tr)))) failures.push(`${label}: broken cell in ${key}`);
    }
    if (!result.rows.pres.every(Boolean)) failures.push(`${label}: no present-tense form`);
  }
}
report.checks += checks;
report.finish(`${report.checks} sentence checks, ${Object.keys(VERBS).length} English verbs, ${translations} Persian translations`, { limit: 80 });
