/*
 * English -> Persian (Farsi) verb database (standard Iranian Persian, formal written style).
 *
 * One line per English verb:
 *   english: رفتن raftan, قبول کردن qabul kardan (usage note)
 *
 * Each translation is the infinitive in Persian script, a space, then its
 * transliteration (Persian leaves out the short vowels, so the reader needs it).
 * A compound verb is a word plus a light verb (قبول کردن qabul kardan): only the last
 * word is conjugated. "|" marks an inseparable prefix, written the same way in both
 * (بر|داشتن bar|dâshtan), because the prefix stays in front of the verb's own
 * prefixes (برمی‌دارم). The present stem is worked out by the engine. The first
 * translation of each line is the default.
 */
(function (global) {
  'use strict';

  const { parseTable } = typeof module !== 'undefined' && module.exports
    ? require('../shared/verb-kit.js')
    : global.VerbKit;

  const TABLE = `
    abandon: ترک کردن tark kardan, رها کردن rahâ kardan
    abort: لغو کردن laghv kardan, سقط کردن saght kardan (a pregnancy)
    absorb: جذب کردن jazb kardan
    abuse: سوءاستفاده کردن sou'estefâde kardan, بدرفتاری کردن badraftâri kardan
    accelerate: شتاب دادن shetâb dâdan, تسریع کردن tasri' kardan
    accept: پذیرفتن paziroftan, قبول کردن qabul kardan
    accompany: همراهی کردن hamrâhi kardan
    accomplish: انجام دادن anjâm dâdan, کامل کردن kâmel kardan
    accumulate: انباشتن anbâshtan, جمع کردن jam' kardan
    accuse: متهم کردن muttaham kardan
    achieve: به دست آوردن be dast âvardan, دست یافتن dast yâftan
    acknowledge: اعتراف کردن e'terâf kardan, تصدیق کردن tasdigh kardan
    acquire: به دست آوردن be dast âvardan, کسب کردن kasb kardan
    acquit: تبرئه کردن tabre'e kardan
    act: عمل کردن amal kardan, بازی کردن bâzi kardan (in a play)
    adapt: وفق دادن vafgh dâdan, تطبیق دادن tatbigh dâdan
    add: اضافه کردن ezâfe kardan, جمع زدن jam' zadan (in math)
    adhere: چسبیدن chasbidan, پایبند بودن pâyband budan
    adjust: تنظیم کردن tanzim kardan, تعدیل کردن ta'dil kardan
    administer: اداره کردن edâre kardan, مدیریت کردن modiriyat kardan
    admire: تحسین کردن tahsin kardan, ستودن sotudan
    admit: پذیرفتن paziroftan, اعتراف کردن e'terâf kardan (confess)
    adopt: اتخاذ کردن ettekhâz kardan (a policy), به فرزندی پذیرفتن be farzandi paziroftan (a child)
    adore: پرستیدن parastidan, دوست داشتن dust dâshtan
    advance: پیشروی کردن pishravi kardan, پیش رفتن pish raftan
    advertise: تبلیغ کردن tabligh kardan
    advise: توصیه کردن towsiye kardan, نصیحت کردن nasihat kardan
    advocate: حمایت کردن hemâyat kardan, طرفداری کردن tarafdâri kardan
    affect: تاثیر گذاشتن ta'sir gozâshtan
    age: پیر شدن pir shodan
    agitate: تکان دادن tekân dâdan, آشفته کردن âshofte kardan
    agree: موافقت کردن movâfeghat kardan, توافق کردن tavâfogh kardan (agree on)
    aim: هدف گرفتن hadaf gereftan, نشانه رفتن neshâne raftan
    alert: آگاه کردن âgâh kardan, هشدار دادن hoshdâr dâdan
    align: تراز کردن terâz kardan, تنظیم کردن tanzim kardan
    allocate: اختصاص دادن ekhtesâs dâdan, تقسیم کردن taghsim kardan (distribute)
    allow: اجازه دادن ejâze dâdan, مجاز کردن mojâz kardan
    alter: تغییر دادن taghyir dâdan, دگرگون کردن degargun kardan
    amaze: شگفت‌زده کردن shegeft-zade kardan
    amend: اصلاح کردن eslâh kardan, تعدیل کردن ta'dil kardan
    amuse: سرگرم کردن sargarm kardan, خنداندن khandândan
    analyze: تحلیل کردن tahlil kardan
    anger: عصبانی کردن asabâni kardan, خشمگین کردن khashmgin kardan
    announce: اعلام کردن e'lâm kardan
    annoy: اذیت کردن aziyat kardan, آزار دادن âzâr dâdan
    answer: جواب دادن javâb dâdan, پاسخ دادن pâsokh dâdan
    anticipate: پیش‌بینی کردن pish-bini kardan
    appeal: تقاضا کردن taghâzâ kardan, جذاب بودن jazzâb budan (be attractive)
    appear: ظاهر شدن zâher shodan, پدیدار شدن padidâr shodan
    applaud: تشویق کردن tashvigh kardan, کف زدن kaf zadan
    apply: اعمال کردن e'mâl kardan, درخواست دادن darkhâst dâdan (apply for)
    appoint: منصوب کردن mansub kardan, تعیین کردن ta'yin kardan
    appreciate: قدردانی کردن ghadrdâni kardan, قدر دانستن ghadr dânestan
    approach: نزدیک شدن nazdik shodan
    approve: تایید کردن tâyid kardan, تصویب کردن tasvib kardan
    argue: بحث کردن bahs kardan, استدلال کردن estedlâl kardan
    arise: پیش آمدن pish âmadan, بر|خاستن bar|khâstan
    arrange: ترتیب دادن tartib dâdan, مرتب کردن morattab kardan
    arrest: دستگیر کردن dastgir kardan, بازداشت کردن bâzdâsht kardan
    arrive: رسیدن residan, وارد شدن vâred shodan
    articulate: بیان کردن bayân kardan, تلفظ کردن talaffoz kardan
    ascend: بالا رفتن bâlâ raftan, صعود کردن so'ud kardan
    ask: پرسیدن porsidan, سوال کردن so'âl kardan
    ask for: خواستن khâstan, درخواست کردن darkhâst kardan
    aspire: آرزو داشتن ârezu dâshtan, آرزو کردن ârezu kardan
    assemble: سر هم کردن sar ham kardan, گردآوری کردن gerdâvari kardan
    assert: ادعا کردن edde'â kardan, تاکید کردن tâkid kardan
    assess: ارزیابی کردن arzyâbi kardan
    assign: تعیین کردن ta'yin kardan, واگذار کردن vagozâr kardan
    assimilate: جذب کردن jazb kardan, هضم کردن hazm kardan
    assist: کمک کردن komak kardan, یاری دادن yâri dâdan
    associate: مرتبط کردن mortabet kardan
    assume: فرض کردن farz kardan, گمان کردن gomân kardan
    assure: اطمینان دادن etminân dâdan, تضمین کردن tazmin kardan
    astonish: شگفت‌زده کردن shegeft-zade kardan, متعجب کردن mota'ajjeb kardan
    attach: وصل کردن vasl kardan, ضمیمه کردن zamime kardan
    attack: حمله کردن hamle kardan
    attain: به دست آوردن be dast âvardan, دست یافتن dast yâftan
    attempt: تلاش کردن talâsh kardan, کوشیدن kushidan
    attend: شرکت کردن sherkat kardan (an event), مراقبت کردن morâghebat kardan (take care of)
    attract: جذب کردن jazb kardan, جلب کردن jalb kardan
    attribute: نسبت دادن nesbat dâdan
    audit: حسابرسی کردن hesâbrasi kardan
    authorize: مجاز کردن mojâz kardan, اجازه دادن ejâze dâdan
    avoid: اجتناب کردن ejtenâb kardan, دوری کردن duri kardan
    award: جایزه دادن jâyeze dâdan
    back up: پشتیبانی کردن poshtibâni kardan, پشتیبان گرفتن poshtibân gereftan (a copy)
    bake: پختن pokhtan
    balance: متعادل کردن mota'âdel kardan, تعادل داشتن ta'âdol dâshtan
    ban: ممنوع کردن mamnu' kardan, منع کردن man' kardan
    bandage: پانسمان کردن pânsemân kardan, بستن bastan
    bang: کوبیدن kubidan, ضربه زدن zarbe zadan
    baptize: تعمید دادن ta'mid dâdan
    bargain: چانه زدن châne zadan, معامله کردن mo'âmele kardan
    bark: پارس کردن pârs kardan
    base: پایه‌گذاری کردن pâye-gozâri kardan, مبتنی کردن mobtani kardan
    bathe: حمام کردن hammâm kardan, شستن shostan
    battle: جنگیدن jangidan, مبارزه کردن mobâreze kardan
    be: بودن budan, وجود داشتن vojud dâshtan (exist)
    bear: تحمل کردن tahammol kardan, زاییدن zâyidan (give birth), حمل کردن haml kardan (carry)
    beat: زدن zadan, شکست دادن shekast dâdan (defeat), کوبیدن kubidan
    beautify: زیبا کردن zibâ kardan, آراستن ârâstan
    beg: التماس کردن eltemâs kardan, گدایی کردن gedâyi kardan
    begin: شروع کردن shoru' kardan, آغاز کردن âghâz kardan
    belch: آروغ زدن ârugh zadan
    believe: باور کردن bâvar kardan, اعتقاد داشتن e'teghâd dâshtan
    belong: تعلق داشتن ta'allogh dâshtan
    bend: خم کردن kham kardan, تا کردن tâ kardan
    bet: شرط بستن shart bastan
    bid: پیشنهاد دادن pishnahâd dâdan
    bill: صورتحساب دادن surathesâb dâdan
    bind: بستن bastan, پیوند دادن peyvand dâdan
    bite: گاز گرفتن gâz gereftan, گزیدن gazidan
    blackmail: باج‌گیری کردن bâj-giri kardan, اخاذی کردن akhkhâzi kardan
    blame: سرزنش کردن sarzanesh kardan, مقصر دانستن moghasser dânestan
    bleach: سفید کردن sefid kardan
    bleed: خونریزی کردن khunrizi kardan
    blend: مخلوط کردن makhlut kardan, آمیختن âmikhtan
    bless: دعا کردن do'â kardan, برکت دادن barakat dâdan
    blink: پلک زدن pelk zadan, چشمک زدن chashmak zadan
    block: مسدود کردن masdud kardan
    bloom: شکفتن shekoftan, گل دادن gol dâdan
    blossom: شکوفه دادن shokufe dâdan, شکفتن shekoftan
    blow: وزیدن vazidan, فوت کردن fut kardan
    blur: تار کردن târ kardan, محو کردن mahv kardan
    board: سوار شدن savâr shodan
    boast: لاف زدن lâf zadan, فخر فروختن fakhr forukhtan
    boil: جوشیدن jushidan, جوشاندن jushândan
    bond: پیوند دادن peyvand dâdan, چسباندن chasbândan
    book: رزرو کردن rezerv kardan
    boost: تقویت کردن taghviyat kardan, افزایش دادن afzâyesh dâdan
    bore: خسته کردن khaste kardan, سوراخ کردن surâkh kardan (drill)
    bother: مزاحم شدن mozâhem shodan, اذیت کردن aziyat kardan
    bounce: جهیدن jahidan, پریدن paridan
    bow: تعظیم کردن ta'zim kardan, خم شدن kham shodan
    boycott: تحریم کردن tahrim kardan
    brag: لاف زدن lâf zadan, خودستایی کردن khodsetâyi kardan
    brake: ترمز کردن tormoz kardan
    break: شکستن shekastan, خرد کردن khord kardan
    breathe: نفس کشیدن nafas keshidan
    brew: دم کردن dam kardan, جوشاندن jushândan
    bribe: رشوه دادن reshve dâdan
    bring: آوردن âvardan
    bring up: بزرگ کردن bozorg kardan (children), مطرح کردن matrah kardan (a topic)
    broadcast: پخش کردن pakhsh kardan
    broaden: گسترش دادن gostaresh dâdan, پهن کردن pahn kardan
    browse: مرور کردن morur kardan, گشت زدن gasht zadan
    bruise: کبود کردن kabud kardan
    brush: مسواک زدن mesvâk zadan (teeth), برس زدن bors zadan
    bubble: قل‌قل کردن ghol-ghol kardan, جوشیدن jushidan
    buckle: بستن bastan
    build: ساختن sâkhtan, بنا کردن banâ kardan
    bully: زورگویی کردن zurguyi kardan, قلدری کردن ghalderi kardan
    burden: سنگین کردن sangin kardan
    burn: سوزاندن suzândan, سوختن sukhtan
    burst: ترکیدن tarkidan, منفجر شدن monfajer shodan
    bury: دفن کردن dafn kardan
    buy: خریدن kharidan
    buzz: وزوز کردن vezvez kardan
    cage: حبس کردن habs kardan
    calculate: محاسبه کردن mohâsebe kardan, حساب کردن hesâb kardan
    call: صدا زدن sedâ zadan, زنگ زدن zang zadan (phone)
    calm: آرام کردن ârâm kardan, آرام شدن ârâm shodan
    camp: چادر زدن châdor zadan
    can: توانستن tavânestan
    cancel: لغو کردن laghv kardan
    capture: دستگیر کردن dastgir kardan, تصرف کردن tasarrof kardan
    care: اهمیت دادن ahammiyat dâdan, مراقبت کردن morâghebat kardan
    caress: نوازش کردن navâzesh kardan
    carry: حمل کردن haml kardan, بردن bordan
    carry out: انجام دادن anjâm dâdan, اجرا کردن ejrâ kardan
    carve: حکاکی کردن hakkâki kardan, تراشیدن tarâshidan
    cash: نقد کردن naghd kardan
    cast: انداختن andâkhtan, پرتاب کردن partâb kardan
    catch: گرفتن gereftan
    categorize: دسته‌بندی کردن daste-bandi kardan
    cause: باعث شدن bâ'es shodan, موجب شدن moujeb shodan
    cease: متوقف شدن motevaghef shodan, دست کشیدن dast keshidan
    celebrate: جشن گرفتن jashn gereftan
    chain: زنجیر کردن zanjir kardan
    challenge: به چالش کشیدن be châlesh keshidan
    change: تغییر دادن taghyir dâdan, عوض کردن avaz kardan
    chant: سرود خواندن sorud khândan, آواز خواندن âvâz khândan
    charge: شارژ کردن shârzh kardan, متهم کردن muttaham kardan (accuse)
    charm: مجذوب کردن majzub kardan, افسون کردن afsun kardan
    chase: تعقیب کردن ta'ghib kardan, دنبال کردن donbâl kardan
    chat: گپ زدن gap zadan, صحبت کردن sohbat kardan
    chatter: وراجی کردن vorrâji kardan
    cheat: تقلب کردن taghallob kardan, فریب دادن farib dâdan
    check: بررسی کردن barrasi kardan, چک کردن chek kardan
    cheer: تشویق کردن tashvigh kardan
    cherish: عزیز داشتن aziz dâshtan, گرامی داشتن grâmi dâshtan
    chew: جویدن javidan
    chill: خنک کردن khonak kardan
    choke: خفه کردن khafe kardan, خفه شدن khafe shodan
    choose: انتخاب کردن entekhâb kardan, گزینش کردن gozinesh kardan
    chop: خرد کردن khord kardan, قطع کردن ghat' kardan
    circle: دور زدن dur zadan
    circulate: جریان داشتن jarayân dâshtan, در گردش بودن dar gardesh budan
    cite: نقل کردن naghl kardan
    claim: ادعا کردن edde'â kardan, مطالبه کردن motâlebe kardan
    clap: دست زدن dast zadan, کف زدن kaf zadan
    clarify: روشن کردن rowshan kardan, توضیح دادن towzih dâdan
    clash: درگیر شدن dargir shodan, برخورد کردن barkhord kardan
    clasp: چنگ زدن chang zadan, محکم گرفتن mohkam gereftan
    classify: طبقه‌بندی کردن tabaghe-bandi kardan
    clean: تمیز کردن tamiz kardan, پاک کردن pâk kardan
    clean up: مرتب کردن morattab kardan, پاکسازی کردن pâksâzi kardan
    cleanse: پاک کردن pâk kardan, تطهیر کردن tathir kardan
    clear: پاک کردن pâk kardan, خالی کردن khâli kardan
    clench: مشت کردن mosht kardan, فشردن feshordan
    click: کلیک کردن kelik kardan
    climb: بالا رفتن bâlâ raftan, صعود کردن so'ud kardan
    clip: بریدن boridan
    clog: مسدود کردن masdud kardan
    clone: کلون کردن kolon kardan, شبیه‌سازی کردن shabih-sâzi kardan
    close: بستن bastan
    clutch: چنگ زدن chang zadan, محکم گرفتن mohkam gereftan
    coach: مربیگری کردن morabbigari kardan
    coax: ترغیب کردن targhib kardan
    code: کدنویسی کردن kodnevisi kardan
    coincide: مصادف شدن mosâdef shodan
    collaborate: همکاری کردن hamkâri kardan
    collapse: فرو|ریختن foru|rikhtan
    collect: جمع کردن jam' kardan, گردآوری کردن gerdâvari kardan
    collide: برخورد کردن barkhord kardan, تصادف کردن tasâdof kardan
    color: رنگ کردن rang kardan
    comb: شانه کردن shâne kardan
    combat: مبارزه کردن mobâreze kardan, جنگیدن jangidan
    combine: ترکیب کردن tarkib kardan, ادغام کردن edghâm kardan
    come: آمدن âmadan
    come back: بر|گشتن bar|gashtan
    come in: وارد شدن vâred shodan, داخل شدن dâkhel shodan
    comfort: دلداری دادن deldâri dâdan, آرامش دادن ârâmesh dâdan
    command: فرمان دادن farmân dâdan, دستور دادن dastur dâdan
    commemorate: گرامی داشتن grâmi dâshtan
    comment: نظر دادن nazar dâdan
    commit: مرتکب شدن mortakeb shodan, متعهد شدن moteahhed shodan
    communicate: ارتباط برقرار کردن ertebât bargharâr kardan
    compare: مقایسه کردن moghâyese kardan
    compensate: جبران کردن jobrân kardan
    compete: رقابت کردن reghâbat kardan
    compile: گردآوری کردن gerdâvari kardan
    complete: کامل کردن kâmel kardan, تکمیل کردن takmil kardan
    complicate: پیچیده کردن pichide kardan
    compliment: تعریف کردن ta'rif kardan
    comply: پیروی کردن peyravi kardan, رعایت کردن ri'âyat kardan
    compose: ساختن sâkhtan, تصنیف کردن tasnif kardan
    comprise: شامل شدن shâmel shodan, تشکیل دادن tashkil dâdan
    compute: محاسبه کردن mohâsebe kardan
    conceal: پنهان کردن penhân kardan
    concede: اعتراف کردن e'terâf kardan, واگذار کردن vagozâr kardan
    conceive: باردار شدن bârdâr shodan, تصور کردن tasavvor kardan
    conclude: نتیجه گرفتن natije gereftan, پایان دادن pâyân dâdan
    condemn: محکوم کردن mahkum kardan
    conduct: هدایت کردن hedâyat kardan, اجرا کردن ejrâ kardan
    confess: اعتراف کردن e'terâf kardan
    configure: پیکربندی کردن pikarbandi kardan
    confirm: تایید کردن tâyid kardan
    confront: مواجه شدن movâjeh shodan, روبرو شدن rubaru shodan
    confuse: گیج کردن gij kardan, اشتباه گرفتن eshtebâh gereftan
    congratulate: تبریک گفتن tabrik goftan
    connect: وصل کردن vasl kardan, متصل کردن mottasel kardan
    conquer: فتح کردن fath kardan, تسخیر کردن taskhir kardan
    consent: رضایت دادن rezâyat dâdan, موافقت کردن movâfeghat kardan
    conserve: حفظ کردن hefz kardan, نگه داشتن negah dâshtan
    consider: در نظر گرفتن dar nazar gereftan, فکر کردن fekr kardan
    consist: شامل بودن shâmel budan
    console: دلداری دادن deldâri dâdan
    consolidate: تحکیم کردن tahkim kardan
    conspire: توطئه کردن towte'e kardan
    constitute: تشکیل دادن tashkil dâdan
    construct: ساختن sâkhtan, بنا کردن banâ kardan
    consult: مشورت کردن mashvarat kardan, مراجعه کردن morâje'e kardan
    consume: مصرف کردن masraf kardan, خوردن khordan
    contact: تماس گرفتن tamâs gereftan
    contain: شامل بودن shâmel budan, در بر داشتن dar bar dâshtan
    contemplate: تامل کردن tâmmol kardan, اندیشیدن andishidan
    contend: رقابت کردن reghâbat kardan, ادعا کردن edde'â kardan (maintain)
    continue: ادامه دادن edâme dâdan
    contradict: تناقض داشتن tanâghoz dâshtan, تکذیب کردن takzib kardan
    contrast: مقایسه کردن moghâyese kardan, تضاد داشتن tezâd dâshtan
    contribute: مشارکت کردن moshârekat kardan, کمک کردن komak kardan
    control: کنترل کردن kontorol kardan, مهار کردن mahâr kardan
    converge: همگرا شدن hamgerâ shodan, به هم رسیدن be ham residan
    convert: تبدیل کردن tabdil kardan, تبدیل شدن tabdil shodan
    convey: منتقل کردن montaghel kardan, رساندن resândan
    convince: متقاعد کردن motaghâ'ed kardan
    cook: پختن pokhtan, آشپزی کردن âshpazi kardan
    cool: خنک کردن khonak kardan, سرد کردن sard kardan
    cooperate: همکاری کردن hamkâri kardan
    coordinate: هماهنگ کردن hamâhang kardan
    cope: کنار آمدن kenâr âmadan
    copy: کپی کردن kopi kardan, رونویسی کردن runevisi kardan
    correct: اصلاح کردن eslâh kardan, تصحیح کردن tas-hih kardan
    correspond: مطابقت داشتن motâbeghat dâshtan, مکاتبه کردن mokâtebe kardan
    corrupt: فاسد کردن fâsed kardan
    cost: هزینه داشتن hazine dâshtan, قیمت داشتن gheymat dâshtan
    cough: سرفه کردن sorfe kardan
    counsel: مشاوره دادن moshâvere dâdan, نصیحت کردن nasihat kardan
    count: شمردن shomordan, حساب کردن hesâb kardan
    counterfeit: جعل کردن ja'l kardan
    court: خواستگاری کردن khâstegâri kardan
    cover: پوشاندن pushândan, پوشش دادن pushesh dâdan
    crack: ترک خوردن tarak khordan, شکستن shekastan
    crash: تصادف کردن tasâdof kardan, خراب شدن kharâb shodan (a program)
    crave: هوس کردن havas kardan, اشتیاق داشتن eshtiyâgh dâshtan
    crawl: خزیدن khazidan, چهار دست و پا رفتن chahâr dast o pâ raftan
    create: ایجاد کردن ijâd kardan, آفریدن âfaridan
    credit: اعتبار دادن e'tebâr dâdan
    criticize: انتقاد کردن enteghâd kardan, نقد کردن naghd kardan
    cross: عبور کردن obur kardan, گذشتن gozashtan
    crush: له کردن le kardan, خرد کردن khord kardan
    cry: گریه کردن gerye kardan (weep), فریاد زدن faryâd zadan (shout)
    cultivate: کشت کردن kesht kardan, پرورش دادن parvaresh dâdan
    cure: درمان کردن darmân kardan, شفا دادن shafâ dâdan
    curl: فر کردن fer kardan, پیچاندن pichândan
    curse: نفرین کردن nefrin kardan, فحش دادن fohsh dâdan
    cushion: نرم کردن narm kardan
    customize: شخصی‌سازی کردن shakhsi-sâzi kardan
    cut: بریدن boridan, قطع کردن ghat' kardan
    cut off: قطع کردن ghat' kardan, بریدن boridan
    damage: آسیب زدن âsib zadan, خراب کردن kharâb kardan
    dance: رقصیدن raghsidan
    dare: جرات کردن jor'at kardan
    darken: تاریک کردن târik kardan
    darn: رفو کردن rafu kardan
    dash: دویدن davidan, شتافتن shetâftan
    dazzle: خیره کردن khire kardan
    deal: برخورد کردن barkhord kardan (deal with), پخش کردن pakhsh kardan (cards)
    debate: مناظره کردن monâzere kardan, بحث کردن bahs kardan
    debug: اشکال‌زدایی کردن eshkâl-zodâyi kardan
    decay: پوسیدن pusidan, فاسد شدن fâsed shodan
    deceive: فریب دادن farib dâdan, گول زدن gul zadan
    decide: تصمیم گرفتن tasmim gereftan
    decipher: رمزگشایی کردن ramz-goshâyi kardan, کشف کردن kashf kardan
    declare: اعلام کردن e'lâm kardan
    decline: رد کردن rad kardan, کاهش یافتن kâhesh yâftan
    decorate: تزیین کردن tazyin kardan
    decrease: کاهش یافتن kâhesh yâftan, کم کردن kam kardan
    decrypt: رمزگشایی کردن ramz-goshâyi kardan
    dedicate: اختصاص دادن ekhtesâs dâdan, وقف کردن vaghf kardan
    deduct: کسر کردن kasr kardan, کم کردن kam kardan
    deem: دانستن dânestan, تلقی کردن talaghghi kardan
    defeat: شکست دادن shekast dâdan
    defend: دفاع کردن defâ' kardan
    defer: به تعویق انداختن be ta'vigh andâkhtan, عقب انداختن aghab andâkhtan
    define: تعریف کردن ta'rif kardan
    deflect: منحرف کردن monharef kardan
    degrade: تنزل دادن tanazzol dâdan, تحقیر کردن tahghir kardan
    delay: عقب انداختن aghab andâkhtan, دیر کردن dir kardan
    delegate: واگذار کردن vagozâr kardan, تفویض کردن tafviz kardan
    delete: حذف کردن hazf kardan, پاک کردن pâk kardan
    deliberate: مشورت کردن mashvarat kardan, تعمق کردن ta'ammogh kardan
    delight: خوشحال کردن khoshhâl kardan, لذت بخشیدن lezzat bakhshidan
    deliver: تحویل دادن tahvil dâdan, رساندن resândan
    demand: مطالبه کردن motâlebe kardan, خواستار شدن khâstâr shodan
    demolish: خراب کردن kharâb kardan, ویران کردن virân kardan
    demonstrate: نشان دادن neshân dâdan, اثبات کردن esbât kardan
    denote: دلالت کردن delâlat kardan, نشان دادن neshân dâdan
    denounce: محکوم کردن mahkum kardan, افشا کردن afshâ kardan
    deny: انکار کردن enkâr kardan, تکذیب کردن takzib kardan
    depend: وابسته بودن vâbaste budan, بستگی داشتن bastegi dâshtan
    deploy: مستقر کردن mostaghar kardan
    deport: اخراج کردن ekhrâj kardan
    deposit: سپرده گذاشتن seporde gozâshtan, واریز کردن vâriz kardan
    deprive: محروم کردن mahrum kardan
    derive: مشتق کردن moshtagh kardan, ناشی شدن nâshi shodan
    descend: پایین آمدن pâyin âmadan, فرود آمدن forud âmadan
    describe: توصیف کردن towsif kardan, شرح دادن sharh dâdan
    deserve: سزاوار بودن sezâvâr budan, شایسته بودن shâyeste budan
    design: طراحی کردن tarrâhi kardan
    designate: تعیین کردن ta'yin kardan, مشخص کردن moshakhkhas kardan
    desire: آرزو کردن ârezu kardan, خواستن khâstan
    despise: تحقیر کردن tahghir kardan, نفرت داشتن nefrat dâshtan
    destroy: نابود کردن nâbud kardan, ویران کردن virân kardan
    detect: تشخیص دادن tashkhis dâdan, کشف کردن kashf kardan
    deteriorate: بدتر شدن badtar shodan, خراب شدن kharâb shodan
    determine: تعیین کردن ta'yin kardan, مصمم شدن mosammam shodan
    detest: متنفر بودن motenaffer budan
    devastate: ویران کردن virân kardan
    develop: توسعه دادن tose'e dâdan, رشد کردن roshd kardan
    deviate: منحرف شدن monharef shodan
    devour: بلعیدن bal'idan
    diagnose: تشخیص دادن tashkhis dâdan
    dial: شماره گرفتن shomâre gereftan
    dictate: دیکته کردن dikte kardan, دستور دادن dastur dâdan
    die: مردن mordan, فوت کردن fowt kardan
    differ: فرق داشتن fargh dâshtan, تفاوت داشتن tafâvot dâshtan
    dig: کندن kandan, حفر کردن hafr kardan
    digest: هضم کردن hazm kardan
    dilute: رقیق کردن raghigh kardan
    dim: کم‌نور کردن kam-nur kardan
    diminish: کاهش دادن kâhesh dâdan, کم کردن kam kardan
    dine: شام خوردن shâm khordan
    direct: هدایت کردن hedâyat kardan, کارگردانی کردن kârgardâni kardan
    disable: غیرفعال کردن gheyrfa'âl kardan
    disagree: مخالفت کردن mokhâlefat kardan
    disappear: ناپدید شدن nâpadid shodan, غیب شدن gheyb shodan
    disappoint: ناامید کردن nâomid kardan
    disarm: خلع سلاح کردن khal' salâh kardan
    discard: دور انداختن dur andâkhtan
    discharge: ترخیص کردن tarkhis kardan, تخلیه کردن takhliye kardan
    disclose: افشا کردن afshâ kardan
    disconnect: قطع کردن ghat' kardan
    discourage: دلسرد کردن delsard kardan
    discover: کشف کردن kashf kardan, پیدا کردن peydâ kardan
    discredit: بی‌اعتبار کردن bi-e'tebâr kardan
    discuss: بحث کردن bahs kardan, گفت‌وگو کردن goftogu kardan
    disguise: مبدل کردن mobaddal kardan
    disgust: منزجر کردن monzajer kardan
    disinfect: ضدعفونی کردن zedd-ofuni kardan
    dismantle: جدا کردن jodâ kardan
    dismiss: اخراج کردن ekhrâj kardan, رد کردن rad kardan
    dispatch: ارسال کردن ersâl kardan
    dispense: توزیع کردن touzi' kardan
    disperse: پراکنده کردن parâkande kardan
    displace: جابه‌جا کردن jâbe-jâ kardan
    display: نمایش دادن namâyesh dâdan
    disprove: رد کردن rad kardan
    dispute: مجادله کردن mojâdele kardan
    distinguish: تشخیص دادن tashkhis dâdan, متمایز کردن motamâyez kardan
    distort: تحریف کردن tahrif kardan
    distract: حواس‌پرت کردن havâs-part kardan
    distribute: توزیع کردن touzi' kardan, پخش کردن pakhsh kardan
    disturb: مزاحم شدن mozâhem shodan, مختل کردن mokhtal kardan
    dive: شیرجه رفتن shirje raftan, غواصی کردن ghavvâsi kardan
    diversify: متنوع کردن motenavve' kardan
    divide: تقسیم کردن taghsim kardan
    divorce: طلاق دادن talâgh dâdan
    do: انجام دادن anjâm dâdan, کردن kardan
    document: مستند کردن mostanad kardan
    dodge: جاخالی دادن jâ-khâli dâdan
    dominate: تسلط داشتن tasallot dâshtan
    donate: اهدا کردن ehdâ kardan, بخشیدن bakhshidan
    double: دو برابر کردن do barâbar kardan
    doubt: شک کردن shak kardan
    download: دانلود کردن dânlod kardan
    draft: پیش‌نویس کردن pish-nevis kardan
    drag: کشیدن keshidan
    drain: تخلیه کردن takhliye kardan
    draw: کشیدن keshidan, نقاشی کردن naghghâshi kardan
    dread: ترسیدن tarsidan
    dream: خواب دیدن khâb didan, رویا دیدن royâ didan
    dress: لباس پوشیدن lebâs pushidan
    dribble: دریبل کردن dribl kardan
    drift: شناور بودن shenâvar budan
    drill: سوراخ کردن surâkh kardan, مته زدن mate zadan
    drink: نوشیدن noshidan, خوردن khordan
    drip: چکیدن chekidan
    drive: رانندگی کردن rânandegi kardan, راندن rândan
    drizzle: نم‌نم باریدن nam-nam bâridan
    drop: انداختن andâkhtan, افتادن oftâdan
    drown: غرق شدن gharq shodan, غرق کردن gharq kardan
    dry: خشک کردن khoshk kardan, خشک شدن khoshk shodan
    dump: ریختن rikhtan, دور ریختن dur rikhtan
    duplicate: تکثیر کردن taksir kardan, کپی کردن kopi kardan
    dwell: سکونت داشتن sokunat dâshtan, ساکن بودن sâken budan
    dye: رنگ کردن rang kardan
    earn: به دست آوردن be dast âvardan, کسب کردن kasb kardan
    ease: تسکین دادن taskin dâdan, آسان کردن âsân kardan
    eat: خوردن khordan
    echo: طنین انداختن tanin andâkhtan, پژواک داشتن pazhvâk dâshtan
    edit: ویرایش کردن virâyesh kardan
    educate: آموزش دادن âmuzesh dâdan, تعلیم دادن ta'lim dâdan
    elaborate: شرح دادن sharh dâdan, تفصیل دادن tafsil dâdan
    elapse: سپری شدن separi shodan, گذشتن gozashtan
    elect: انتخاب کردن entekhâb kardan
    elevate: بالا بردن bâlâ bordan
    eliminate: حذف کردن hazf kardan, ریشه‌کن کردن rishe-kan kardan
    elude: طفره رفتن tafre raftan
    email: ایمیل زدن imeyl zadan, ایمیل کردن imeyl kardan
    embark: سوار شدن savâr shodan
    embed: جاسازی کردن jâsâzi kardan
    embrace: در آغوش گرفتن dar âghush gereftan
    embroider: گلدوزی کردن goldozi kardan
    emerge: پدیدار شدن padidâr shodan, ظهور کردن zohur kardan
    emit: منتشر کردن montasher kardan, ساطع کردن sâte' kardan
    emphasize: تاکید کردن tâkid kardan
    employ: استخدام کردن estekhdâm kardan, به کار بردن be kâr bordan (use)
    empower: توانمند کردن tavânmand kardan
    empty: خالی کردن khâli kardan
    enable: فعال کردن fa''âl kardan, ممکن کردن momken kardan
    enact: تصویب کردن tasvib kardan
    enchant: مجذوب کردن majzub kardan, افسون کردن afsun kardan
    encircle: محاصره کردن mohâsere kardan
    encounter: برخورد کردن barkhord kardan, روبرو شدن rubaru shodan
    encourage: تشویق کردن tashvigh kardan
    encrypt: رمزگذاری کردن ramz-gozâri kardan
    end: پایان دادن pâyân dâdan, تمام کردن tamâm kardan
    endorse: تایید کردن tâyid kardan, حمایت کردن hemâyat kardan
    endure: تحمل کردن tahammol kardan, پایداری کردن pâydâri kardan
    energize: پرانرژی کردن por-enerzhi kardan
    enforce: اجرا کردن ejrâ kardan, اعمال کردن e'mâl kardan
    engage: درگیر کردن dargir kardan, استخدام کردن estekhdâm kardan
    engrave: حکاکی کردن hakkâki kardan
    enhance: ارتقا دادن ertegha dâdan, بهبود بخشیدن behbud bakhshidan
    enjoy: لذت بردن lezzat bordan
    enlarge: بزرگ کردن bozorg kardan
    enlist: ثبت‌نام کردن sabt-nâm kardan
    enrage: خشمگین کردن khashmgin kardan
    enrich: غنی کردن ghani kardan
    enroll: ثبت‌نام کردن sabt-nâm kardan
    ensure: اطمینان حاصل کردن etminân hâsel kardan, تضمین کردن tazmin kardan
    entail: مستلزم بودن mostalzem budan
    entangle: گره زدن gereh zadan
    enter: وارد شدن vâred shodan
    entertain: سرگرم کردن sargarm kardan
    entrust: سپردن separdan
    envision: تصور کردن tasavvor kardan
    envy: حسادت کردن hasâdat kardan
    equip: مجهز کردن mojahhaz kardan
    erase: پاک کردن pâk kardan
    err: اشتباه کردن eshtebâh kardan
    escalate: تشدید کردن tashdid kardan
    escape: فرار کردن farâr kardan, گریختن gorikhtan
    establish: تاسیس کردن ta'sis kardan, برقرار کردن bargharâr kardan
    estimate: تخمین زدن takhmin zadan
    evacuate: تخلیه کردن takhliye kardan
    evade: طفره رفتن tafre raftan, فرار کردن farâr kardan
    evaluate: ارزیابی کردن arzyâbi kardan
    evaporate: تبخیر شدن tabkhir shodan
    evoke: بر|انگیختن bar|angikhtan
    evolve: تکامل یافتن takâmol yâftan
    exaggerate: اغراق کردن eghrâgh kardan
    exalt: ستودن sotudan, تجلیل کردن tajlil kardan
    examine: بررسی کردن barrasi kardan, معاینه کردن mo'âyene kardan
    excavate: کاوش کردن kâvosh kardan, حفاری کردن hafâri kardan
    exceed: فراتر رفتن farâtar raftan, پیشی گرفتن pishi gereftan
    excel: برتری داشتن bartari dâshtan
    exchange: مبادله کردن mobâdele kardan, عوض کردن avaz kardan
    excite: هیجان‌زده کردن heyjân-zade kardan
    exclude: مستثنی کردن mostasnâ kardan, حذف کردن hazf kardan
    excuse: بخشیدن bakhshidan, معذور داشتن ma'zur dâshtan
    execute: اجرا کردن ejrâ kardan, اعدام کردن e'dâm kardan
    exempt: معاف کردن mo'âf kardan
    exercise: ورزش کردن varzesh kardan, تمرین کردن tamrin kardan
    exert: به کار بردن be kâr bordan
    exhale: بازدم کردن bâzdam kardan
    exhaust: خسته کردن khaste kardan
    exhibit: به نمایش گذاشتن be namâyesh gozâshtan
    exile: تبعید کردن tab'id kardan
    exist: وجود داشتن vojud dâshtan
    expand: گسترش دادن gostaresh dâdan, توسعه دادن tose'e dâdan
    expect: انتظار داشتن entezâr dâshtan
    expedite: تسریع کردن tasri' kardan
    expel: اخراج کردن ekhrâj kardan, بیرون راندن birun rândan
    experience: تجربه کردن tajrobe kardan, تجربه داشتن tajrobe dâshtan
    experiment: آزمایش کردن âzmâyesh kardan
    expire: منقضی شدن monghazi shodan
    explain: توضیح دادن towzih dâdan, شرح دادن sharh dâdan
    explode: منفجر شدن monfajer shodan, ترکیدن tarkidan
    exploit: بهره‌برداری کردن bahre-bardâri kardan, استثمار کردن estesmâr kardan
    explore: کاوش کردن kâvosh kardan, کشف کردن kashf kardan
    export: صادر کردن sâder kardan
    expose: افشا کردن afshâ kardan, در معرض گذاشتن dar ma'raz gozâshtan
    express: بیان کردن bayân kardan
    extend: گسترش دادن gostaresh dâdan, تمدید کردن tamdid kardan
    extinguish: خاموش کردن khâmush kardan
    extol: ستودن sotudan, تمجید کردن tamjid kardan
    extract: استخراج کردن estekhrâj kardan, بیرون کشیدن birun keshidan
    fabricate: ساختن sâkhtan, جعل کردن ja'l kardan
    face: مواجه شدن movâjeh shodan, روبرو شدن rubaru shodan
    facilitate: تسهیل کردن tas-hil kardan
    fade: محو شدن mahv shodan, رنگ باختن rang bâkhtan
    fail: شکست خوردن shekast khordan, رد شدن rad shodan (a test)
    fake: جعل کردن ja'l kardan, تظاهر کردن tazâhor kardan
    fall: افتادن oftâdan, سقوط کردن soghut kardan
    fall down: زمین خوردن zamin khordan, افتادن oftâdan
    fan: باد زدن bâd zadan
    fascinate: مجذوب کردن majzub kardan
    fasten: بستن bastan, محکم کردن mohkam kardan
    fatigue: خسته کردن khaste kardan
    favor: ترجیح دادن tarjih dâdan, طرفداری کردن tarafdâri kardan
    fear: ترسیدن tarsidan
    feed: غذا دادن ghazâ dâdan, تغذیه کردن taghziye kardan
    feel: احساس کردن ehsâs kardan, حس کردن hes kardan
    fence: حصار کشیدن hesâr keshidan, شمشیربازی کردن shamshir-bâzi kardan
    ferment: تخمیر کردن takhmir kardan
    fetch: آوردن âvardan
    fight: جنگیدن jangidan, دعوا کردن da'vâ kardan, مبارزه کردن mobâreze kardan
    figure out: فهمیدن fahmidan, حل کردن hal kardan
    file: بایگانی کردن bâygâni kardan, سوهان زدن suhân zadan
    fill: پر کردن por kardan
    fill in: پر کردن por kardan, تکمیل کردن takmil kardan
    film: فیلم گرفتن film gereftan, فیلمبرداری کردن filmbardâri kardan
    filter: فیلتر کردن filter kardan, صاف کردن sâf kardan
    finance: تامین مالی کردن tâmin mâli kardan, سرمایه‌گذاری کردن sarmâye-gozâri kardan
    find: پیدا کردن peydâ kardan, یافتن yâftan
    find out: فهمیدن fahmidan, کشف کردن kashf kardan
    fine: جریمه کردن jarime kardan
    finish: تمام کردن tamâm kardan, به پایان رساندن be pâyân resândan
    fire: اخراج کردن ekhrâj kardan (from a job), شلیک کردن shellik kardan (a weapon)
    fish: ماهی گرفتن mâhi gereftan, ماهیگیری کردن mâhigiri kardan
    fit: جا شدن jâ shodan, مناسب بودن monâseb budan
    fix: تعمیر کردن ta'mir kardan, درست کردن dorost kardan
    flap: بال زدن bâl zadan, تکان خوردن tekân khordan
    flare: شعله کشیدن sho'le keshidan
    flash: برق زدن barq zadan, چشمک زدن chashmak zadan
    flatter: چاپلوسی کردن châplusi kardan, تملق گفتن tamallogh goftan
    flavor: طعم دادن ta'm dâdan, چاشنی زدن châshni zadan
    flee: فرار کردن farâr kardan, گریختن gorikhtan
    fling: پرت کردن part kardan, انداختن andâkhtan
    flip: بر|گرداندن bar|gardândan, وارونه کردن vârune kardan
    flirt: لاس زدن lâs zadan
    float: شناور بودن shenâvar budan, روی آب ماندن ruye âb mândan
    flood: سیل آمدن seyl âmadan, زیر آب بردن zir âb bordan
    flourish: شکوفا شدن shokufâ shodan, رونق گرفتن ravnagh gereftan
    flow: جاری شدن jâri shodan, روان بودن ravân budan
    flutter: بال‌بال زدن bâl-bâl zadan
    fly: پرواز کردن parvâz kardan, پریدن paridan
    focus: تمرکز کردن tamarkoz kardan, متمرکز کردن motemarkez kardan
    fold: تا کردن tâ kardan
    follow: دنبال کردن donbâl kardan, پیروی کردن peyravi kardan
    fool: گول زدن gul zadan, فریب دادن farib dâdan
    forbid: ممنوع کردن mamnu' kardan, منع کردن man' kardan
    force: مجبور کردن majbur kardan, وادار کردن vâdâr kardan
    forecast: پیش‌بینی کردن pish-bini kardan
    foresee: پیش‌بینی کردن pish-bini kardan
    forge: جعل کردن ja'l kardan, آهنگری کردن âhangari kardan
    forget: فراموش کردن farâmush kardan
    forgive: بخشیدن bakhshidan
    form: تشکیل دادن tashkil dâdan, شکل دادن shekl dâdan
    format: قالب‌بندی کردن ghâleb-bandi kardan, فرمت کردن formt kardan
    formulate: تدوین کردن tadvin kardan, فرمول‌بندی کردن formul-bandi kardan
    found: تاسیس کردن ta'sis kardan, بنیان گذاشتن bonyân gozâshtan
    fracture: شکستن shekastan
    frame: قاب کردن ghâb kardan
    free: آزاد کردن âzâd kardan, رها کردن rahâ kardan
    freeze: یخ زدن yakh zadan, منجمد کردن monjamed kardan
    frighten: ترساندن tarsândan, وحشت‌زده کردن vahshat-zade kardan
    frown: اخم کردن akhm kardan
    frustrate: ناامید کردن nâomid kardan, خنثی کردن khonsâ kardan
    fry: سرخ کردن sorkh kardan, تفت دادن taft dâdan
    fuel: سوخت‌رسانی کردن sukht-resâni kardan
    fulfill: برآورده کردن barâvarde kardan, عملی کردن amali kardan
    function: کار کردن kâr kardan, عمل کردن amal kardan
    furnish: مبله کردن mobleh kardan
    fuse: ذوب کردن zowb kardan, ادغام کردن edghâm kardan
    gain: به دست آوردن be dast âvardan, کسب کردن kasb kardan
    gallop: چهارنعل رفتن chahâr-na'l raftan
    gamble: قمار کردن ghomâr kardan, ریسک کردن risk kardan
    gather: جمع کردن jam' kardan, جمع شدن jam' shodan
    generate: تولید کردن towlid kardan, ایجاد کردن ijâd kardan
    gesture: اشاره کردن eshâre kardan
    get: گرفتن gereftan, دریافت کردن daryâft kardan (receive), به دست آوردن be dast âvardan
    give: دادن dâdan
    give up: تسلیم شدن taslim shodan, دست کشیدن dast keshidan
    glorify: تمجید کردن tamjid kardan, تجلیل کردن tajlil kardan
    glow: درخشیدن derakhshidan, تابیدن tâbidan
    glue: چسباندن chasbândan
    go: رفتن raftan
    go back: بر|گشتن bar|gashtan
    go on: ادامه دادن edâme dâdan
    go out: بیرون رفتن birun raftan
    gossip: غیبت کردن gheybat kardan
    govern: حکومت کردن hokumat kardan, اداره کردن edâre kardan
    grab: چنگ زدن chang zadan, قاپیدن ghâpidan
    grade: نمره دادن nomre dâdan
    graduate: دانش‌آموخته شدن dânesh-âmukhte shodan, مدرک گرفتن madrak gereftan
    graft: پیوند زدن peyvand zadan
    grant: اعطا کردن e'tâ kardan
    grasp: درک کردن dark kardan, چنگ زدن chang zadan
    grate: رنده کردن rande kardan
    graze: چراندن charândan, چریدن charidan
    greet: سلام کردن salâm kardan, خوشامد گفتن khoshâmad goftan
    grieve: سوگواری کردن sugvâri kardan, غصه خوردن ghosse khordan
    grill: کباب کردن kabâb kardan
    grind: آسیاب کردن âsiyâb kardan, خرد کردن khord kardan
    grip: چنگ زدن chang zadan, محکم گرفتن mohkam gereftan
    groan: ناله کردن nâle kardan
    grow: رشد کردن roshd kardan, پرورش دادن parvaresh dâdan (plants), کاشتن kâshtan (crops)
    grow up: بزرگ شدن bozorg shodan
    growl: غرغر کردن gharghar kardan, غریدن gharidan
    grunt: خرخر کردن kharkhar kardan, غرغر کردن gharghar kardan
    guarantee: تضمین کردن tazmin kardan
    guard: نگهبانی کردن negahbâni kardan, محافظت کردن mohâfezat kardan
    guess: حدس زدن hads zadan
    guide: راهنمایی کردن râhnamâyi kardan
    gulp: قورت دادن ghurt dâdan
    gush: فوران کردن fowrân kardan
    hack: هک کردن hak kardan
    hail: تگرگ باریدن tagarg bâridan
    halt: متوقف کردن motevaghef kardan, ایستادن istâdan
    hammer: چکش زدن chakosh zadan, کوبیدن kubidan
    hamper: مانع شدن mâne' shodan
    hand over: تحویل دادن tahvil dâdan
    handle: اداره کردن edâre kardan, دست زدن dast zadan
    hang: آویزان کردن âvizân kardan, آویختن âvikhtan
    hang up: قطع کردن ghat' kardan, آویزان کردن âvizân kardan
    happen: اتفاق افتادن ettefâgh oftâdan, رخ دادن rokh dâdan
    harass: آزار دادن âzâr dâdan, اذیت کردن aziyat kardan
    harden: سفت کردن seft kardan, سخت شدن sakht shodan
    harm: آسیب رساندن âsib resândan
    harmonize: هماهنگ کردن hamâhang kardan
    harvest: برداشت کردن bardâsht kardan
    hate: نفرت داشتن nefrat dâshtan, متنفر بودن motenaffer budan
    haul: کشیدن keshidan, حمل کردن haml kardan
    have: داشتن dâshtan
    heal: شفا یافتن shafâ yâftan, خوب شدن khub shodan
    heap: توده کردن tude kardan, انباشتن anbâshtan
    hear: شنیدن shenidan
    heat: گرم کردن garm kardan
    heighten: افزایش دادن afzâyesh dâdan
    help: کمک کردن komak kardan, یاری کردن yâri kardan
    hesitate: تردید کردن tardid kardan
    hide: پنهان کردن penhân kardan, مخفی کردن makhfi kardan
    highlight: برجسته کردن barjaste kardan, هایلایت کردن hâylâyt kardan
    hijack: ربودن robudan
    hinder: مانع شدن mâne' shodan, باز|داشتن bâz|dâshtan
    hint: اشاره کردن eshâre kardan, کنایه زدن kenâye zadan
    hire: استخدام کردن estekhdâm kardan, اجاره کردن ejâre kardan (rent)
    hit: زدن zadan, ضربه زدن zarbe zadan
    hoard: احتکار کردن ehtekâr kardan, ذخیره کردن zakhire kardan
    hold: نگه داشتن negah dâshtan, گرفتن gereftan
    hold on: صبر کردن sabr kardan, نگه داشتن negah dâshtan
    honor: احترام گذاشتن ehterâm gozâshtan, گرامی داشتن grâmi dâshtan
    hook: قلاب کردن ghalâb kardan
    hop: لی‌لی کردن li-li kardan, جهیدن jahidan
    hope: امیدوار بودن omidvâr budan
    host: میزبانی کردن mizbâni kardan
    hover: معلق بودن mo'allagh budan
    howl: زوزه کشیدن zuze keshidan
    hug: در آغوش گرفتن dar âghush gereftan
    hum: زمزمه کردن zemzeme kardan
    humiliate: تحقیر کردن tahghir kardan, خوار کردن khâr kardan
    hunt: شکار کردن shekâr kardan
    hurl: پرت کردن part kardan, پرتاب کردن partâb kardan
    hurt: درد کردن dard kardan, آسیب رساندن âsib resândan, زخمی کردن zakhmi kardan
    hypnotize: هیپنوتیزم کردن hipnotizm kardan
    identify: شناسایی کردن shenâsâyi kardan, تشخیص دادن tashkhis dâdan
    idolize: پرستیدن parastidan
    ignore: نادیده گرفتن nâdide gereftan
    illuminate: روشن کردن rowshan kardan, نورانی کردن nurâni kardan
    illustrate: تصویرسازی کردن tasvir-sâzi kardan, توضیح دادن towzih dâdan
    imagine: تصور کردن tasavvor kardan, خیال کردن khiyâl kardan
    imitate: تقلید کردن taghlid kardan
    immerse: غوطه‌ور کردن ghowte-var kardan
    immobilize: بی‌حرکت کردن bi-harekat kardan
    impeach: استیضاح کردن estizâh kardan
    impede: مانع شدن mâne' shodan
    implement: اجرا کردن ejrâ kardan, پیاده‌سازی کردن piyâde-sâzi kardan
    implore: التماس کردن eltemâs kardan
    imply: دلالت کردن delâlat kardan, حاکی بودن hâki budan
    import: وارد کردن vâred kardan
    impose: تحمیل کردن tahmil kardan
    impress: تحت تاثیر قرار دادن tahte ta'sir gharâr dâdan
    imprison: زندانی کردن zendâni kardan
    improve: بهبود دادن behbud dâdan, بهتر کردن behtar kardan
    incite: تحریک کردن tahrik kardan
    incline: متمایل شدن motamâyel shodan, خم کردن kham kardan
    include: شامل شدن shâmel shodan, شامل کردن shâmel kardan
    incorporate: ادغام کردن edghâm kardan, گنجاندن gonjândan
    increase: افزایش دادن afzâyesh dâdan, زیاد کردن ziyâd kardan
    incur: متحمل شدن motahammel shodan
    indicate: نشان دادن neshân dâdan, اشاره کردن eshâre kardan
    induce: القا کردن elghâ kardan, ترغیب کردن targhib kardan
    infect: آلوده کردن âlude kardan
    infer: استنباط کردن estenbât kardan, نتیجه گرفتن natije gereftan
    inflate: باد کردن bâd kardan
    inflict: وارد کردن vâred kardan, تحمیل کردن tahmil kardan
    influence: تاثیر گذاشتن ta'sir gozâshtan, نفوذ داشتن nofuz dâshtan
    inform: خبر دادن khabar dâdan, اطلاع دادن ettelâ' dâdan
    infringe: نقض کردن naghz kardan
    ingest: بلعیدن bal'idan, خوردن khordan
    inhabit: ساکن بودن sâken budan, سکونت داشتن sokunat dâshtan
    inhale: استنشاق کردن estenshâgh kardan, نفس کشیدن nafas keshidan
    inherit: ارث بردن ers bordan
    inhibit: باز|داشتن bâz|dâshtan, مهار کردن mahâr kardan
    initiate: آغاز کردن âghâz kardan, شروع کردن shoru' kardan
    inject: تزریق کردن tazrigh kardan
    injure: زخمی کردن zakhmi kardan, مجروح کردن majruh kardan
    inquire: پرس‌وجو کردن pors-o-ju kardan, تحقیق کردن tahghigh kardan
    insert: درج کردن darj kardan, وارد کردن vâred kardan
    insinuate: کنایه زدن kenâye zadan, اشاره کردن eshâre kardan
    insist: اصرار کردن esrâr kardan
    inspect: بازرسی کردن bâzresi kardan, بررسی کردن barrasi kardan
    inspire: الهام بخشیدن elhâm bakhshidan
    install: نصب کردن nasb kardan
    instruct: آموزش دادن âmuzesh dâdan, دستور دادن dastur dâdan
    insult: توهین کردن towhin kardan
    insure: بیمه کردن bime kardan
    integrate: ادغام کردن edghâm kardan, یکپارچه کردن yekpârche kardan
    intend: قصد داشتن ghasd dâshtan, خواستن khâstan
    intensify: تشدید کردن tashdid kardan, تقویت کردن taghviyat kardan
    interact: تعامل داشتن ta'âmol dâshtan
    interest: علاقه‌مند کردن alâghe-mand kardan
    interfere: دخالت کردن dekhâlat kardan
    interpret: تفسیر کردن tafsir kardan, ترجمه کردن tarjome kardan
    interrogate: بازجویی کردن bâzjuyi kardan
    interrupt: قطع کردن ghat' kardan, وقفه انداختن vaghfe andâkhtan
    intervene: مداخله کردن modâkhele kardan
    interview: مصاحبه کردن mosâhebe kardan
    intimidate: ارعاب کردن er'âb kardan, ترساندن tarsândan
    intrigue: کنجکاو کردن konjkâv kardan, توطئه چیدن towte'e chidan
    introduce: معرفی کردن mo'arrefi kardan
    invade: حمله کردن hamle kardan, تهاجم کردن tahâjom kardan
    invent: اختراع کردن ekhterâ' kardan
    invest: سرمایه‌گذاری کردن sarmâye-gozâri kardan
    invite: دعوت کردن da'vat kardan
    invoice: فاکتور صادر کردن fâktor sâder kardan
    invoke: فرا|خواندن farâ|khândan
    involve: درگیر کردن dargir kardan, شامل کردن shâmel kardan
    iron: اتو کردن otu kardan
    irritate: تحریک کردن tahrik kardan, عصبانی کردن asabâni kardan
    isolate: منزوی کردن monzavi kardan, جدا کردن jodâ kardan
    issue: صادر کردن sâder kardan, منتشر کردن montasher kardan
    itch: خارش داشتن khârash dâshtan
    jam: گیر کردن gir kardan, پر کردن por kardan
    jeer: هو کردن hu kardan, تمسخر کردن tamaskhor kardan
    jingle: جرینگ‌جرینگ کردن jering-jering kardan
    jog: دویدن davidan
    join: پیوستن peyvastan, ملحق شدن molhagh shodan
    joke: شوخی کردن shukhi kardan
    jolt: تکان دادن tekân dâdan
    journey: سفر کردن safar kardan
    judge: قضاوت کردن ghazâvat kardan, داوری کردن dâvari kardan
    jump: پریدن paridan, جهیدن jahidan
    justify: توجیه کردن towjih kardan
    keep: نگه داشتن negah dâshtan, حفظ کردن hefz kardan
    keep on: ادامه دادن edâme dâdan
    kick: لگد زدن lagad zadan, شوت کردن shut kardan
    kidnap: ربودن robudan, آدم‌ربایی کردن âdam-robâyi kardan
    kill: کشتن koshtan
    kindle: روشن کردن rowshan kardan, شعله‌ور کردن sho'le-var kardan
    kiss: بوسیدن busidan
    knead: ورز دادن varz dâdan
    knit: بافتن bâftan
    knock: در زدن dar zadan, کوبیدن kubidan
    knot: گره زدن gereh zadan
    know: دانستن dânestan (facts, how to), شناختن shenâkhtan (people, places)
    label: برچسب زدن barchasb zadan
    lack: کمبود داشتن kambud dâshtan
    lament: ناله کردن nâle kardan, افسوس خوردن afsus khordan
    land: فرود آمدن forud âmadan
    languish: پژمردن pazhmordan
    lash: شلاق زدن shallâgh zadan
    last: دوام داشتن davâm dâshtan, طول کشیدن tul keshidan
    laugh: خندیدن khandidan
    launch: راه‌اندازی کردن râh-andâzi kardan, پرتاب کردن partâb kardan
    launder: شستن shostan, پولشویی کردن pulshuyi kardan (money)
    lay: گذاشتن gozâshtan, قرار دادن gharâr dâdan
    lead: رهبری کردن rahbari kardan, هدایت کردن hedâyat kardan
    leak: چکه کردن chekke kardan, نشت کردن nasht kardan
    lean: تکیه دادن tekye dâdan, خم شدن kham shodan
    leap: پریدن paridan, جهیدن jahidan
    learn: یاد گرفتن yâd gereftan, آموختن âmukhtan
    leave: ترک کردن tark kardan, رفتن raftan, گذاشتن gozâshtan (leave behind)
    legislate: قانون‌گذاری کردن ghânun-gozâri kardan
    lend: قرض دادن gharz dâdan
    lengthen: طولانی کردن tulâni kardan, دراز کردن derâz kardan
    let: اجازه دادن ejâze dâdan, گذاشتن gozâshtan
    let down: ناامید کردن nâomid kardan
    level: تراز کردن terâz kardan, صاف کردن sâf kardan
    liberate: آزاد کردن âzâd kardan
    lick: لیسیدن lisidan
    lie: دروغ گفتن dorugh goftan
    lift: بلند کردن boland kardan, بالا بردن bâlâ bordan
    light: روشن کردن rowshan kardan
    lighten: سبک کردن sabok kardan, روشن‌تر کردن rowshan-tar kardan
    like: دوست داشتن dust dâshtan, پسندیدن pasandidan
    limit: محدود کردن mahdud kardan
    linger: درنگ کردن derang kardan, ماندن mândan
    link: پیوند دادن peyvand dâdan, مرتبط کردن mortabet kardan
    liquidate: تصفیه کردن tasfiye kardan, منحل کردن monhal kardan
    listen: گوش دادن gush dâdan
    listen to: گوش دادن gush dâdan
    live: زندگی کردن zendegi kardan, سکونت داشتن sokunat dâshtan
    load: بار کردن bâr kardan, بارگذاری کردن bârgozâri kardan
    loathe: متنفر بودن motenaffer budan
    locate: مکان‌یابی کردن makân-yâbi kardan, پیدا کردن peydâ kardan
    lock: قفل کردن ghofl kardan
    log: ثبت کردن sabt kardan
    long: آرزو داشتن ârezu dâshtan, اشتیاق داشتن eshtiyâgh dâshtan
    look: نگاه کردن negâh kardan
    look after: مراقبت کردن morâghebat kardan, نگهداری کردن negahdâri kardan
    look at: نگاه کردن negâh kardan
    look for: جستجو کردن jostoju kardan, دنبال گشتن donbâl gashtan
    look up: جستجو کردن jostoju kardan
    loosen: شل کردن shol kardan, باز کردن bâz kardan
    lose: گم کردن gom kardan, باختن bâkhtan
    love: دوست داشتن dust dâshtan, عاشق بودن âshegh budan
    lower: پایین آوردن pâyin âvardan, کاهش دادن kâhesh dâdan
    lull: خواباندن khâbândan, آرام کردن ârâm kardan
    lurk: کمین کردن kamin kardan
    magnify: بزرگ‌نمایی کردن bozorg-namâyi kardan
    maim: معلول کردن ma'lul kardan
    maintain: نگهداری کردن negahdâri kardan, حفظ کردن hefz kardan
    make: ساختن sâkhtan, درست کردن dorost kardan
    make up: ساختن sâkhtan (invent), آرایش کردن ârâyesh kardan (cosmetics)
    malfunction: خراب شدن kharâb shodan, اختلال داشتن ekhtelâl dâshtan
    manage: مدیریت کردن modiriyat kardan, موفق شدن movaffagh shodan (succeed in)
    mangle: له کردن le kardan
    manipulate: دستکاری کردن dastkâri kardan
    manufacture: تولید کردن towlid kardan, ساختن sâkhtan
    map: نقشه کشیدن naghshe keshidan
    march: رژه رفتن rezhe raftan, راهپیمایی کردن râhpeymâyi kardan
    marinate: خیساندن khisândan
    mark: علامت زدن alâmat zadan, نشان گذاشتن neshân gozâshtan
    market: بازاریابی کردن bâzâryâbi kardan
    marvel: شگفت‌زده شدن shegeft-zade shodan
    mash: له کردن le kardan, پوره کردن pure kardan
    mask: نقاب زدن naghâb zadan, پنهان کردن penhân kardan
    massage: ماساژ دادن mâsâzh dâdan
    master: تسلط یافتن tasallot yâftan
    match: مطابقت داشتن motâbeghat dâshtan, جور کردن jur kardan
    materialize: محقق شدن mohaghghagh shodan
    matter: اهمیت داشتن ahammiyat dâshtan
    maximize: حداکثر کردن haddeaksar kardan
    mean: معنی دادن ma'ni dâdan, منظور داشتن manzur dâshtan
    measure: اندازه گرفتن andâze gereftan
    mediate: میانجی‌گری کردن miyânji-gari kardan
    meet: ملاقات کردن molâghât kardan, دیدن didan (see), برخورد کردن barkhord kardan
    melt: آب شدن âb shodan, ذوب شدن zowb shodan
    memorize: حفظ کردن hefz kardan
    mend: تعمیر کردن ta'mir kardan, دوختن dukhtan
    mention: اشاره کردن eshâre kardan, ذکر کردن zekr kardan
    meow: میو میو کردن miyu miyu kardan
    merge: ادغام کردن edghâm kardan, ترکیب کردن tarkib kardan
    merit: سزاوار بودن sezâvâr budan
    migrate: مهاجرت کردن mohâjerat kardan
    mimic: تقلید کردن taghlid kardan
    minimize: به حداقل رساندن be haddeaghal resândan
    mislead: گمراه کردن gomrâh kardan
    misplace: گم کردن gom kardan
    miss: از دست دادن az dast dâdan, دلتنگ بودن deltang budan (feel the absence of)
    mistake: اشتباه گرفتن eshtebâh gereftan
    mix: مخلوط کردن makhlut kardan, قاطی کردن ghâti kardan
    mobilize: بسیج کردن basij kardan
    mock: تمسخر کردن tamaskhor kardan, مسخره کردن maskhare kardan
    modify: تغییر دادن taghyir dâdan, اصلاح کردن eslâh kardan
    moisten: مرطوب کردن martub kardan
    mold: قالب‌گیری کردن ghâleb-giri kardan, شکل دادن shekl dâdan
    monitor: نظارت کردن nezârat kardan, پایش کردن pâyesh kardan
    mortgage: رهن گذاشتن rahn gozâshtan
    motivate: انگیزه دادن angize dâdan
    mount: سوار شدن savâr shodan, نصب کردن nasb kardan
    move: حرکت کردن harekat kardan, جابه‌جا کردن jâbe-jâ kardan, نقل مکان کردن naghl makân kardan (relocate)
    muffle: خفه کردن khafe kardan
    multiply: ضرب کردن zarb kardan, تکثیر کردن taksir kardan
    mumble: زیر لب گفتن zir lab goftan
    munch: جویدن javidan
    murder: به قتل رساندن be ghatl resândan, کشتن koshtan
    murmur: زمزمه کردن zemzeme kardan
    muse: اندیشیدن andishidan, تامل کردن tâmmol kardan
    must: مجبور بودن majbur budan (obligation)
    mutter: غر زدن ghor zadan
    nag: غر زدن ghor zadan, سرزنش کردن sarzanesh kardan
    nail: میخ زدن mikh zadan
    name: نام‌گذاری کردن nâm-gozâri kardan, نامیدن nâmidan
    narrow: باریک کردن bârik kardan, محدود کردن mahdud kardan
    navigate: مسیریابی کردن masiryâbi kardan, ناوبری کردن nâvbari kardan
    need: نیاز داشتن niyâz dâshtan, احتیاج داشتن ehtiyâj dâshtan
    neglect: غفلت کردن ghaflat kardan, نادیده گرفتن nâdide gereftan
    negotiate: مذاکره کردن mozâkere kardan, چانه زدن châne zadan
    nest: لانه کردن lâne kardan
    neutralize: خنثی کردن khonsâ kardan
    nibble: نوک زدن nok zadan
    nod: سر تکان دادن sar tekân dâdan
    nominate: نامزد کردن nâmzad kardan
    notice: متوجه شدن motavajjeh shodan, توجه کردن tavajjoh kardan
    notify: اطلاع دادن ettelâ' dâdan, مطلع کردن mottale' kardan
    nourish: تغذیه کردن taghziye kardan, پروراندن parvarândan
    nudge: سقلمه زدن soghlame zadan, هل دادن hol dâdan
    numb: بی‌حس کردن bi-hes kardan
    obey: اطاعت کردن etâ'at kardan, پیروی کردن peyravi kardan
    object: اعتراض کردن e'terâz kardan
    oblige: مجبور کردن majbur kardan, ملزم کردن molzam kardan
    obscure: پنهان کردن penhân kardan, تیره کردن tire kardan
    observe: مشاهده کردن moshâhede kardan, رعایت کردن ri'âyat kardan
    obsess: وسواس داشتن vasvâs dâshtan
    obstruct: مسدود کردن masdud kardan, مانع شدن mâne' shodan
    obtain: به دست آوردن be dast âvardan
    occupy: اشغال کردن eshghâl kardan, مشغول کردن mashghul kardan
    occur: رخ دادن rokh dâdan, اتفاق افتادن ettefâgh oftâdan
    offend: رنجاندن ranjândan, توهین کردن towhin kardan
    offer: پیشنهاد دادن pishnahâd dâdan, تقدیم کردن taghdim kardan
    offset: جبران کردن jobrân kardan
    omit: حذف کردن hazf kardan, از قلم انداختن az ghalam andâkhtan
    ooze: تراوش کردن taravvosh kardan
    open: باز کردن bâz kardan, گشودن goshudan
    operate: عمل کردن amal kardan, کار کردن kâr kardan
    oppose: مخالفت کردن mokhâlefat kardan
    oppress: ستم کردن setam kardan
    optimize: بهینه کردن behine kardan
    orchestrate: سازماندهی کردن sâzmândehi kardan
    order: سفارش دادن sefâresh dâdan (a meal), دستور دادن dastur dâdan (command), مرتب کردن morattab kardan (arrange)
    organize: سازماندهی کردن sâzmândehi kardan, ترتیب دادن tartib dâdan
    orient: جهت دادن jahat dâdan
    oust: بیرون کردن birun kardan, برکنار کردن barkenâr kardan
    outdo: پیشی گرفتن pishi gereftan
    outline: طرح‌ریزی کردن tarh-rizi kardan
    outperform: پیشی گرفتن pishi gereftan, بهتر عمل کردن behtar amal kardan
    overcome: غلبه کردن gholabe kardan, چیره شدن chire shodan
    overdo: زیاده‌روی کردن ziyâde-ravi kardan
    overflow: سرریز شدن sarriz shodan
    overhear: شنیدن shenidan, ناخواسته شنیدن nâkhâste shenidan
    overlap: همپوشانی داشتن hampushâni dâshtan
    overpower: مغلوب کردن maghlub kardan
    override: لغو کردن laghv kardan, نادیده گرفتن nâdide gereftan
    overrule: نقض کردن naghz kardan, ابطال کردن ebtâl kardan
    oversee: نظارت کردن nezârat kardan
    overtake: سبقت گرفتن sabghat gereftan
    overthrow: سرنگون کردن sarnegun kardan
    overturn: واژگون کردن vâzhgun kardan
    overwhelm: مغلوب کردن maghlub kardan, غرق کردن gharq kardan
    overwrite: بازنویسی کردن bâznevisi kardan
    owe: بدهکار بودن bedehkâr budan
    own: مالک بودن mâlek budan, داشتن dâshtan
    pacify: آرام کردن ârâm kardan
    pack: بسته‌بندی کردن baste-bandi kardan, چمدان بستن chamedân bastan
    paddle: پارو زدن pâru zadan
    paint: نقاشی کردن naghghâshi kardan, رنگ زدن rang zadan
    parade: رژه رفتن rezhe raftan
    paralyze: فلج کردن falaj kardan
    paraphrase: بازگویی کردن bâzguyi kardan
    park: پارک کردن pârk kardan
    parody: تقلید کردن taghlid kardan
    partake: شرکت کردن sherkat kardan
    participate: مشارکت کردن moshârekat kardan, شرکت کردن sherkat kardan
    pass: گذشتن gozashtan, رد شدن rad shodan
    paste: چسباندن chasbândan
    pat: نوازش کردن navâzesh kardan, دست زدن dast zadan
    patch: وصله کردن vasle kardan
    patrol: گشت زدن gasht zadan
    pause: مکث کردن makas kardan, توقف کردن tavaghghof kardan
    pave: آسفالت کردن âsfalt kardan, فرش کردن farsh kardan
    pawn: گرو گذاشتن gerow gozâshtan
    pay: پرداخت کردن pardâkht kardan, پول دادن pul dâdan
    pay back: پس دادن pas dâdan, بازپرداخت کردن bâzpardâkht kardan
    pedal: رکاب زدن rekâb zadan
    peek: دزدکی نگاه کردن dozdaki negâh kardan
    peel: پوست کندن pust kandan
    penalize: جریمه کردن jarime kardan
    perceive: درک کردن dark kardan, حس کردن hes kardan
    perch: نشستن neshastan
    perfect: کامل کردن kâmel kardan
    perform: اجرا کردن ejrâ kardan, انجام دادن anjâm dâdan
    perish: هلاک شدن halâk shodan, نابود شدن nâbud shodan
    permit: اجازه دادن ejâze dâdan
    perpetuate: جاودان کردن jâvedân kardan
    persevere: پافشاری کردن pâfeshâri kardan, استقامت کردن esteghâmat kardan
    persist: پافشاری کردن pâfeshâri kardan, ادامه دادن edâme dâdan
    persuade: متقاعد کردن motaghâ'ed kardan, قانع کردن ghâne' kardan
    pester: مزاحم شدن mozâhem shodan, اذیت کردن aziyat kardan
    phone: تلفن کردن telefon kardan, زنگ زدن zang zadan
    photograph: عکس گرفتن aks gereftan
    pick: انتخاب کردن entekhâb kardan, چیدن chidan (flowers, fruit)
    pick out: انتخاب کردن entekhâb kardan, تشخیص دادن tashkhis dâdan
    pick up: بر|داشتن bar|dâshtan
    pierce: سوراخ کردن surâkh kardan
    pile up: انباشتن anbâshtan, روی هم گذاشتن ruye ham gozâshtan
    pilot: خلبانی کردن khalabâni kardan
    pin: سنجاق کردن sanjâgh kardan
    pinch: نیشگون گرفتن nishgun gereftan
    pinpoint: مشخص کردن moshakhkhas kardan
    pitch: پرتاب کردن partâb kardan, چادر زدن châdor zadan (a tent)
    pity: ترحم کردن tarahhom kardan, دل سوزاندن del suzândan
    place: قرار دادن gharâr dâdan, گذاشتن gozâshtan
    plague: آزار دادن âzâr dâdan
    plan: برنامه‌ریزی کردن barnâme-rizi kardan, طرح‌ریزی کردن tarh-rizi kardan
    plant: کاشتن kâshtan
    plaster: گچ‌کاری کردن gach-kâri kardan
    play: بازی کردن bâzi kardan, نواختن navâkhtan (an instrument)
    plead: التماس کردن eltemâs kardan, دفاع کردن defâ' kardan
    please: خشنود کردن khoshnud kardan, خوشحال کردن khoshhâl kardan
    pledge: تعهد دادن ta'ahhod dâdan, قول دادن ghowl dâdan
    plot: توطئه کردن towte'e kardan
    plow: شخم زدن shokhm zadan
    pluck: کندن kandan, چیدن chidan
    plug: وصل کردن vasl kardan, مسدود کردن masdud kardan
    plunder: غارت کردن ghârat kardan
    plunge: شیرجه زدن shirje zadan, فرو|رفتن foru|raftan
    point: اشاره کردن eshâre kardan, نشان دادن neshân dâdan
    point out: نشان دادن neshân dâdan, اشاره کردن eshâre kardan
    poison: مسموم کردن masmum kardan
    poke: سقلمه زدن soghlame zadan
    polish: صیقل دادن seyghal dâdan, واکس زدن vâks zadan
    pollute: آلوده کردن âlude kardan
    ponder: فکر کردن fekr kardan, تامل کردن tâmmol kardan
    pop: ترکیدن tarkidan
    populate: ساکن کردن sâken kardan, پر کردن por kardan
    portray: به تصویر کشیدن be tasvir keshidan
    pose: ژست گرفتن zhest gereftan
    position: قرار دادن gharâr dâdan, موقعیت دادن movaghiyyat dâdan
    possess: دارا بودن dârâ budan, مالک بودن mâlek budan
    post: منتشر کردن montasher kardan, پست کردن post kardan
    postpone: به تعویق انداختن be ta'vigh andâkhtan, عقب انداختن aghab andâkhtan
    pound: کوبیدن kubidan, ضربه زدن zarbe zadan
    pour: ریختن rikhtan
    practice: تمرین کردن tamrin kardan
    praise: ستایش کردن setâyesh kardan, تحسین کردن tahsin kardan
    pray: دعا کردن do'â kardan, نماز خواندن namâz khândan
    preach: موعظه کردن mow'eze kardan, تبلیغ کردن tabligh kardan
    precede: مقدم بودن moghaddam budan, پیشی گرفتن pishi gereftan
    predict: پیش‌بینی کردن pish-bini kardan
    prefer: ترجیح دادن tarjih dâdan
    preheat: پیش‌گرم کردن pish-garm kardan
    preoccupy: مشغول کردن mashghul kardan
    prepare: آماده کردن âmâde kardan, تهیه کردن tahiye kardan
    prescribe: تجویز کردن tajviz kardan
    present: ارائه دادن erâ'e dâdan, تقدیم کردن taghdim kardan
    preserve: حفظ کردن hefz kardan, نگه داشتن negah dâshtan
    preside: ریاست کردن riyâsat kardan
    press: فشار دادن feshâr dâdan, فشردن feshordan
    presume: فرض کردن farz kardan, گمان کردن gomân kardan
    pretend: تظاهر کردن tazâhor kardan, وانمود کردن vânamud kardan
    prevail: غالب آمدن ghâleb âmadan, چیره شدن chire shodan
    prevent: جلوگیری کردن jologiri kardan, مانع شدن mâne' shodan
    prick: سوزن زدن suzan zadan, نیش زدن nish zadan
    print: چاپ کردن châp kardan
    probe: کاوش کردن kâvosh kardan, بررسی کردن barrasi kardan
    proceed: ادامه دادن edâme dâdan, پیش رفتن pish raftan
    process: پردازش کردن pardâzesh kardan
    proclaim: اعلام کردن e'lâm kardan
    produce: تولید کردن towlid kardan
    profess: ابراز کردن ebrâz kardan, اقرار کردن eghrâr kardan
    program: برنامه‌نویسی کردن barnâme-nevisi kardan
    progress: پیشرفت کردن pishraft kardan
    prohibit: ممنوع کردن mamnu' kardan
    project: نمایش دادن namâyesh dâdan (a film), طرح‌ریزی کردن tarh-rizi kardan (plan)
    prolong: طولانی کردن tulâni kardan, تمدید کردن tamdid kardan
    promise: قول دادن ghowl dâdan, وعده دادن va'de dâdan
    promote: ترویج کردن tarvij kardan, ارتقا دادن ertegha dâdan
    prompt: ترغیب کردن targhib kardan, وادار کردن vâdâr kardan
    pronounce: تلفظ کردن talaffoz kardan
    propagate: تکثیر کردن taksir kardan, منتشر کردن montasher kardan
    propel: به جلو راندن be jolow rândan
    propose: پیشنهاد دادن pishnahâd dâdan, خواستگاری کردن khâstegâri kardan
    prosecute: تعقیب کردن ta'ghib kardan, محاکمه کردن mohâkeme kardan
    prosper: پیشرفت کردن pishraft kardan, رونق گرفتن ravnagh gereftan
    protect: محافظت کردن mohâfezat kardan, حفاظت کردن hefâzat kardan
    protest: اعتراض کردن e'terâz kardan
    protrude: بیرون زدن birun zadan
    prove: ثابت کردن sâbet kardan, اثبات کردن esbât kardan
    provide: فراهم کردن farâhem kardan, تامین کردن tâmin kardan
    provoke: تحریک کردن tahrik kardan, بر|انگیختن bar|angikhtan
    prune: هرس کردن haras kardan
    pry: فضولی کردن fozuli kardan
    publish: منتشر کردن montasher kardan, چاپ کردن châp kardan
    pull: کشیدن keshidan
    pulse: تپیدن tapidan
    pump: پمپ کردن pomp kardan
    punch: مشت زدن mosht zadan, سوراخ کردن surâkh kardan
    punctuate: نقطه‌گذاری کردن noghte-gozâri kardan
    puncture: پنچر کردن panchar kardan, سوراخ کردن surâkh kardan
    punish: مجازات کردن mojâzât kardan, تنبیه کردن tanbih kardan
    purchase: خریدن kharidan, خرید کردن kharid kardan
    purge: پاکسازی کردن pâksâzi kardan
    purify: تصفیه کردن tasfiye kardan, خالص کردن khâles kardan
    pursue: تعقیب کردن ta'ghib kardan, دنبال کردن donbâl kardan
    push: هل دادن hol dâdan
    put: گذاشتن gozâshtan, قرار دادن gharâr dâdan
    put off: به تعویق انداختن be ta'vigh andâkhtan, عقب انداختن aghab andâkhtan
    puzzle: گیج کردن gij kardan
    quake: لرزیدن larzidan
    qualify: صلاحیت یافتن salâhiyat yâftan
    quarrel: دعوا کردن da'vâ kardan, مشاجره کردن moshâjere kardan
    quench: فرو|نشاندن foru|neshândan
    query: پرسیدن porsidan, استعلام کردن este'lâm kardan
    question: سوال کردن so'âl kardan, بازجویی کردن bâzjuyi kardan
    quit: ترک کردن tark kardan, استعفا دادن este'fâ dâdan
    quiver: لرزیدن larzidan
    quote: نقل قول کردن naghl ghowl kardan
    race: مسابقه دادن mosâbeghe dâdan
    radiate: تابش کردن tâbesh kardan, ساطع کردن sâte' kardan
    raid: یورش بردن yurish bordan
    rain: باریدن bâridan
    raise: بالا بردن bâlâ bordan, بزرگ کردن bozorg kardan (children), افزایش دادن afzâyesh dâdan (increase)
    rally: گرد آوردن gerd âvardan, بسیج کردن basij kardan
    ram: کوبیدن kubidan
    ramble: پرسه زدن parse zadan
    rank: رتبه‌بندی کردن rotbe-bandi kardan
    rant: داد زدن dâd zadan
    rate: ارزیابی کردن arzyâbi kardan, امتیاز دادن emtiyâz dâdan
    rationalize: منطقی کردن manteghi kardan, توجیه کردن towjih kardan
    rattle: تق‌تق کردن tagh-tagh kardan
    reach: رسیدن residan, دست یافتن dast yâftan
    react: واکنش نشان دادن vâkonesh neshân dâdan
    read: خواندن khândan
    reap: درو کردن derow kardan
    rear: بزرگ کردن bozorg kardan, پرورش دادن parvaresh dâdan
    reason: استدلال کردن estedlâl kardan
    reassure: خاطرجمع کردن khâter-jam' kardan
    rebuild: بازسازی کردن bâzsâzi kardan
    rebuke: توبیخ کردن towbikh kardan
    recall: به یاد آوردن be yâd âvardan, فرا|خواندن farâ|khândan
    recede: عقب‌نشینی کردن aghab-neshini kardan
    receive: دریافت کردن daryâft kardan
    recharge: شارژ کردن shârzh kardan
    reciprocate: جبران کردن jobrân kardan
    recite: خواندن khândan, قرائت کردن gherâ'at kardan
    reckon: حساب کردن hesâb kardan, گمان کردن gomân kardan
    reclaim: بازپس گرفتن bâzpas gereftan
    recline: لم دادن lam dâdan
    recognize: شناختن shenâkhtan, به رسمیت شناختن be rasmiyat shenâkhtan
    recoil: عقب کشیدن aghab keshidan
    recommend: توصیه کردن towsiye kardan
    reconcile: آشتی دادن âshti dâdan
    reconsider: بازنگری کردن bâznegari kardan
    record: ضبط کردن zabt kardan, ثبت کردن sabt kardan
    recount: بازگو کردن bâzgu kardan, شمارش مجدد کردن shomâresh mojaddad kardan
    recover: بهبود یافتن behbud yâftan, بازیابی کردن bâzyâbi kardan
    recreate: بازآفرینی کردن bâzâfarini kardan
    recruit: استخدام کردن estekhdâm kardan, جذب کردن jazb kardan
    rectify: اصلاح کردن eslâh kardan
    recycle: بازیافت کردن bâzyâft kardan
    redeem: بازخرید کردن bâzkharid kardan, نجات دادن nejât dâdan
    redirect: تغییر مسیر دادن taghyir masir dâdan
    redo: دوباره انجام دادن dobâre anjâm dâdan
    reduce: کاهش دادن kâhesh dâdan, کم کردن kam kardan
    refer: ارجاع دادن erjâ' dâdan, مراجعه کردن morâje'e kardan
    refine: پالایش کردن pâlâyesh kardan
    reflect: منعکس کردن mon'akes kardan, تامل کردن tâmmol kardan
    reform: اصلاح کردن eslâh kardan
    refrain: خودداری کردن khoddâri kardan
    refresh: تازه کردن tâze kardan
    refrigerate: سرد نگه داشتن sard negah dâshtan
    refund: بازپرداخت کردن bâzpardâkht kardan, پس دادن pas dâdan
    refuse: رد کردن rad kardan, امتناع کردن emtenâ' kardan
    regain: دوباره به دست آوردن dobâre be dast âvardan
    regard: در نظر گرفتن dar nazar gereftan, نگاه کردن negâh kardan
    regenerate: بازسازی کردن bâzsâzi kardan
    register: ثبت‌نام کردن sabt-nâm kardan, ثبت کردن sabt kardan
    regret: پشیمان بودن pashimân budan, افسوس خوردن afsus khordan
    regulate: تنظیم کردن tanzim kardan
    rehearse: تمرین کردن tamrin kardan
    reign: سلطنت کردن saltanat kardan, حکومت کردن hokumat kardan
    reinforce: تقویت کردن taghviyat kardan
    reiterate: تکرار کردن tekrâr kardan
    reject: رد کردن rad kardan
    rekindle: دوباره روشن کردن dobâre rowshan kardan
    relapse: عود کردن owd kardan
    relate: مرتبط بودن mortabet budan, تعریف کردن ta'rif kardan (tell)
    relax: استراحت کردن esterâhat kardan, آرام شدن ârâm shodan
    relay: پخش کردن pakhsh kardan, منتقل کردن montaghel kardan
    release: آزاد کردن âzâd kardan, رها کردن rahâ kardan
    relegate: تنزل دادن tanazzol dâdan
    relent: نرم شدن narm shodan
    relieve: تسکین دادن taskin dâdan
    relish: لذت بردن lezzat bordan
    reload: دوباره بارگذاری کردن dobâre bârgozâri kardan
    rely: تکیه کردن tekye kardan, اعتماد کردن e'temâd kardan
    remain: ماندن mândan
    remark: اظهار کردن ez-hâr kardan, متوجه شدن motavajjeh shodan
    remedy: چاره کردن châre kardan, درمان کردن darmân kardan
    remember: به یاد داشتن be yâd dâshtan, به یاد آوردن be yâd âvardan
    remind: یادآوری کردن yâdâvari kardan
    remit: ارسال کردن ersâl kardan
    remodel: بازسازی کردن bâzsâzi kardan
    remove: بر|داشتن bar|dâshtan, حذف کردن hazf kardan
    rename: تغییر نام دادن taghyir nâm dâdan
    renew: تمدید کردن tamdid kardan, تجدید کردن tajdid kardan
    renounce: کناره‌گیری کردن kenâre-giri kardan, ترک کردن tark kardan
    renovate: بازسازی کردن bâzsâzi kardan, نوسازی کردن nosâzi kardan
    rent: اجاره کردن ejâre kardan
    repair: تعمیر کردن ta'mir kardan
    repay: بازپرداخت کردن bâzpardâkht kardan, پس دادن pas dâdan
    repeal: لغو کردن laghv kardan
    repeat: تکرار کردن tekrâr kardan
    repel: دفع کردن daf' kardan
    replace: جایگزین کردن jâygozin kardan, عوض کردن avaz kardan
    replenish: پر کردن por kardan
    reply: جواب دادن javâb dâdan
    report: گزارش دادن gozâresh dâdan
    represent: نمایندگی کردن namâyandegi kardan
    repress: سرکوب کردن sarkub kardan
    reprimand: توبیخ کردن towbikh kardan
    reproach: سرزنش کردن sarzanesh kardan
    reproduce: تکثیر کردن taksir kardan, تولیدمثل کردن towlid-mesl kardan
    request: درخواست کردن darkhâst kardan
    require: نیاز داشتن niyâz dâshtan, لازم داشتن lâzem dâshtan
    reschedule: دوباره زمان‌بندی کردن dobâre zamân-bandi kardan
    rescind: لغو کردن laghv kardan
    rescue: نجات دادن nejât dâdan
    research: تحقیق کردن tahghigh kardan, پژوهش کردن pazhuhesh kardan
    reserve: رزرو کردن rezerv kardan
    reshape: تغییر شکل دادن taghyir shekl dâdan
    reside: ساکن بودن sâken budan
    resign: استعفا دادن este'fâ dâdan
    resist: مقاومت کردن moghâvemat kardan
    resolve: حل کردن hal kardan
    resort: متوسل شدن motevassel shodan
    respect: احترام گذاشتن ehterâm gozâshtan
    respond: پاسخ دادن pâsokh dâdan, واکنش نشان دادن vâkonesh neshân dâdan
    rest: استراحت کردن esterâhat kardan
    restart: دوباره شروع کردن dobâre shoru' kardan
    restore: ترمیم کردن tarmim kardan, باز|گرداندن bâz|gardândan
    restrain: مهار کردن mahâr kardan
    restrict: محدود کردن mahdud kardan
    result: منجر شدن monjar shodan
    resume: از سر گرفتن az sar gereftan
    resurrect: زنده کردن zende kardan
    retain: حفظ کردن hefz kardan, نگه داشتن negah dâshtan
    retreat: عقب‌نشینی کردن aghab-neshini kardan
    retrieve: بازیابی کردن bâzyâbi kardan
    return: بر|گشتن bar|gashtan, پس دادن pas dâdan
    reunite: دوباره متحد کردن dobâre mottahed kardan
    reveal: آشکار کردن âshkâr kardan, فاش کردن fâsh kardan
    reverse: وارونه کردن vârune kardan
    revert: باز|گشتن bâz|gashtan
    review: مرور کردن morur kardan, بازبینی کردن bâzbini kardan
    revise: بازنگری کردن bâznegari kardan
    revive: احیا کردن ehyâ kardan, زنده کردن zende kardan
    revoke: لغو کردن laghv kardan
    revolutionize: متحول کردن motahavvel kardan
    reward: پاداش دادن pâdâsh dâdan
    rhyme: قافیه داشتن ghâfiye dâshtan
    ride: سوار شدن savâr shodan, سواری کردن savâri kardan
    ring: زنگ زدن zang zadan
    rinse: آبکشی کردن âbkeshi kardan
    rip: پاره کردن pâre kardan
    ripple: موج زدن mowj zadan
    rise: بالا رفتن bâlâ raftan, بر|خاستن bar|khâstan
    risk: ریسک کردن risk kardan, به خطر انداختن be khatar andâkhtan
    rival: رقابت کردن reghâbat kardan
    roam: پرسه زدن parse zadan, سرگردان بودن sargardân budan
    roar: غریدن gharidan
    roast: بو دادن bu dâdan, کباب کردن kabâb kardan
    rob: دزدیدن dozdidan, سرقت کردن serghat kardan
    roll: غلتیدن gheltidan, غلتاندن gheltândan
    rotate: چرخیدن charkhidan, چرخاندن charkhândan
    rouse: بیدار کردن bidâr kardan
    route: مسیریابی کردن masiryâbi kardan
    row: پارو زدن pâru zadan
    rub: مالیدن mâlidan
    ruin: خراب کردن kharâb kardan, نابود کردن nâbud kardan
    rule: حکمرانی کردن hokmrâni kardan
    rumble: غرش کردن gharesh kardan
    rummage: زیر و رو کردن zir o ru kardan
    run: دویدن davidan
    run away: فرار کردن farâr kardan
    rupture: پاره شدن pâre shodan
    rush: عجله کردن ajale kardan
    rust: زنگ زدن zang zadan
    rustle: خش‌خش کردن khash-khash kardan
    sabotage: خرابکاری کردن kharâbkâri kardan
    sacrifice: قربانی کردن ghorbâni kardan
    sadden: غمگین کردن ghamgin kardan
    safeguard: محافظت کردن mohâfezat kardan
    sail: دریانوردی کردن daryânavardi kardan
    salute: سلام نظامی دادن salâm nezâmi dâdan
    salvage: نجات دادن nejât dâdan
    sanction: تحریم کردن tahrim kardan
    sanitize: ضدعفونی کردن zedd-ofuni kardan
    sap: تضعیف کردن taz'if kardan
    satisfy: راضی کردن râzi kardan, ارضا کردن erzâ kardan
    saturate: اشباع کردن eshbâ' kardan
    save: پس‌انداز کردن pas-andâz kardan (money), نجات دادن nejât dâdan (rescue), ذخیره کردن zakhire kardan (keep)
    savor: چشیدن chashidan, مزه کردن maze kardan
    saw: اره کردن are kardan
    say: گفتن goftan
    scale: بالا رفتن bâlâ raftan
    scan: اسکن کردن eskan kardan
    scandalize: رسوا کردن rosvâ kardan
    scar: زخمدار کردن zakhmdâr kardan
    scare: ترساندن tarsândan
    scatter: پراکنده کردن parâkande kardan
    schedule: زمان‌بندی کردن zamân-bandi kardan
    scheme: توطئه چیدن towte'e chidan
    scold: سرزنش کردن sarzanesh kardan, دعوا کردن da'vâ kardan
    scoop: بر|داشتن bar|dâshtan
    scorch: سوزاندن suzândan
    score: گل زدن gol zadan, امتیاز گرفتن emtiyâz gereftan
    scorn: تحقیر کردن tahghir kardan
    scour: تمیز کردن tamiz kardan, ساییدن sâyidan
    scout: دیده‌بانی کردن dide-bâni kardan, ردیابی کردن radyâbi kardan
    scrape: تراشیدن tarâshidan, خراشیدن kharâshidan
    scratch: خراشیدن kharâshidan, خاراندن khârândan
    scream: جیغ زدن jigh zadan, فریاد زدن faryâd zadan
    screw: پیچاندن pichândan, پیچ کردن pich kardan
    scribble: خط‌خطی کردن khat-khati kardan
    scroll: اسکرول کردن eskorol kardan
    scrub: ساییدن sâyidan, شستن shostan
    scrutinize: موشکافی کردن mushkâfi kardan
    sculpt: مجسمه‌سازی کردن mojassame-sâzi kardan
    seal: مهر و موم کردن mohr o mum kardan, بستن bastan
    search: جستجو کردن jostoju kardan, گشتن gashtan
    season: ادویه زدن adviye zadan
    secure: ایمن کردن imen kardan, محکم کردن mohkam kardan
    sedate: آرام‌بخش دادن ârâm-bakhsh dâdan, آرام کردن ârâm kardan
    seduce: اغوا کردن eghvâ kardan, فریفتن fariftan
    see: دیدن didan
    seek: جستن jostan, جستجو کردن jostoju kardan
    seem: به نظر رسیدن be nazar residan
    segment: تقسیم‌بندی کردن taghsim-bandi kardan
    segregate: جدا کردن jodâ kardan, تفکیک کردن tafkik kardan
    select: انتخاب کردن entekhâb kardan
    sell: فروختن forukhtan, فروش کردن forush kardan
    send: فرستادن ferestâdan, ارسال کردن ersâl kardan
    send back: پس فرستادن pas ferestâdan
    sentence: محکوم کردن mahkum kardan
    separate: جدا کردن jodâ kardan, تفکیک کردن tafkik kardan
    serve: خدمت کردن khedmat kardan, سرو کردن serv kardan (food)
    set: گذاشتن gozâshtan, تنظیم کردن tanzim kardan (a clock)
    set off: راه افتادن râh oftâdan, به راه انداختن be râh andâkhtan
    set up: راه‌اندازی کردن râh-andâzi kardan, تاسیس کردن ta'sis kardan, نصب کردن nasb kardan
    settle: حل کردن hal kardan, ساکن شدن sâken shodan
    sever: قطع کردن ghat' kardan, بریدن boridan
    sew: دوختن dukhtan
    shackle: به زنجیر کشیدن be zanjir keshidan
    shade: سایه انداختن sâye andâkhtan
    shake: تکان دادن tekân dâdan, لرزیدن larzidan
    shampoo: شامپو زدن shâmpu zadan
    shape: شکل دادن shekl dâdan
    share: به اشتراک گذاشتن be eshterâk gozâshtan, تقسیم کردن taghsim kardan
    shatter: خرد کردن khord kardan, شکستن shekastan
    shave: تراشیدن tarâshidan, اصلاح کردن eslâh kardan
    shear: چیدن chidan, پشم زدن pashm zadan
    shed: ریختن rikhtan
    shelter: پناه دادن panâh dâdan, پناه بردن panâh bordan
    shift: جابه‌جا کردن jâbe-jâ kardan, تغییر دادن taghyir dâdan
    shimmer: درخشیدن derakhshidan
    shine: درخشیدن derakhshidan, تابیدن tâbidan
    shiver: لرزیدن larzidan
    shock: شوکه کردن shoke kardan
    shoo: دور کردن dur kardan
    shoot: تیراندازی کردن tirandâzi kardan, شلیک کردن shellik kardan
    shorten: کوتاه کردن kutâh kardan
    should: شایسته بودن shâyeste budan
    shout: فریاد زدن faryâd zadan, داد زدن dâd zadan
    shove: هل دادن hol dâdan
    shovel: بیل زدن bil zadan
    show: نشان دادن neshân dâdan, نمایش دادن namâyesh dâdan
    show off: خودنمایی کردن khodnamâyi kardan
    show up: ظاهر شدن zâher shodan, حاضر شدن hâzer shodan
    shred: خرد کردن khord kardan, رنده کردن rande kardan
    shrink: کوچک شدن kuchak shodan, آب رفتن âb raftan
    shudder: لرزیدن larzidan
    shuffle: بر زدن bor zadan
    shun: دوری کردن duri kardan, پرهیز کردن parhiz kardan
    shut: بستن bastan
    sidestep: طفره رفتن tafre raftan, دور زدن dur zadan
    siege: محاصره کردن mohâsere kardan
    sift: الک کردن alak kardan
    sigh: آه کشیدن âh keshidan
    sign: امضا کردن emzâ kardan
    signal: علامت دادن alâmat dâdan, اشاره کردن eshâre kardan
    silence: ساکت کردن sâket kardan
    simplify: ساده کردن sâde kardan
    simulate: شبیه‌سازی کردن shabih-sâzi kardan
    sing: آواز خواندن âvâz khândan
    singe: سوزاندن suzândan
    sink: غرق شدن gharq shodan, فرو|رفتن foru|raftan
    sip: جرعه نوشیدن jor'e noshidan
    skate: اسکیت کردن eskeyt kardan
    sketch: طراحی کردن tarrâhi kardan
    skewer: سیخ زدن sikh zadan
    ski: اسکی کردن eski kardan
    skim: مرور کردن morur kardan, سرسری خواندن sarsari khândan
    skip: پریدن paridan, رد کردن rad kardan
    slam: کوبیدن kubidan
    slander: تهمت زدن tohmat zadan
    slap: سیلی زدن sili zadan
    slash: بریدن boridan, شکاف دادن shekâf dâdan
    sleep: خوابیدن khâbidan
    slice: برش دادن boresh dâdan, قاچ کردن ghâch kardan
    slide: سر خوردن sor khordan
    slip: لیز خوردن liz khordan
    slither: خزیدن khazidan
    slow: کند کردن kond kardan, آهسته کردن âheste kardan
    smash: خرد کردن khord kardan
    smear: مالیدن mâlidan, لکه کردن lakke kardan
    smell: بو کردن bu kardan, بوییدن buyidan
    smile: لبخند زدن labkhand zadan
    smoke: سیگار کشیدن sigâr keshidan, دود کردن dud kardan
    smooth: صاف کردن sâf kardan, هموار کردن hamvâr kardan
    smother: خفه کردن khafe kardan
    smuggle: قاچاق کردن ghâchâgh kardan
    snap: شکستن shekastan
    snarl: غریدن gharidan
    snatch: قاپیدن ghâpidan, ربودن robudan
    sneeze: عطسه کردن atse kardan
    sniff: بو کشیدن bu keshidan
    snooze: چرت زدن chort zadan
    snore: خروپف کردن khoropf kardan
    snow: برف آمدن barf âmadan
    soak: خیساندن khisândan
    sob: هق‌هق کردن hagh-hagh kardan
    socialize: معاشرت کردن mo'âsherat kardan
    soften: نرم کردن narm kardan
    solicit: درخواست کردن darkhâst kardan, جلب کردن jalb kardan
    solidify: منجمد کردن monjamed kardan, سفت شدن seft shodan
    solve: حل کردن hal kardan
    soothe: آرام کردن ârâm kardan, تسکین دادن taskin dâdan
    sort: مرتب کردن morattab kardan, دسته‌بندی کردن daste-bandi kardan
    sound: صدا دادن sedâ dâdan, به نظر رسیدن be nazar residan
    sow: کاشتن kâshtan, بذر افشاندن bazr afshândan
    sparkle: درخشیدن derakhshidan, برق زدن barq zadan
    spawn: تخم‌ریزی کردن tokhm-rizi kardan
    speak: صحبت کردن sohbat kardan, حرف زدن harf zadan
    specify: مشخص کردن moshakhkhas kardan
    speculate: حدس زدن hads zadan, سفته‌بازی کردن softe-bâzi kardan
    speed: سرعت گرفتن sor'at gereftan
    spell: هجی کردن hejji kardan
    spend: خرج کردن kharj kardan (money), گذراندن gozarândan (time)
    spill: ریختن rikhtan
    spin: چرخیدن charkhidan, ریسیدن risidan
    spit: تف کردن tof kardan
    splash: پاشیدن pâshidan, آب پاشیدن âb pâshidan
    splinter: خرد شدن khord shodan
    split: تقسیم کردن taghsim kardan, شکافتن shekâftan
    spoil: خراب کردن kharâb kardan, لوس کردن lus kardan
    sponsor: حمایت مالی کردن hemâyat mâli kardan, اسپانسری کردن esponsori kardan
    spot: دیدن didan, پیدا کردن peydâ kardan
    sprain: پیچ خوردن pich khordan
    spray: اسپری کردن espeyr kardan
    spread: پخش کردن pakhsh kardan, گسترده کردن gostarde kardan
    sprinkle: پاشیدن pâshidan, ریختن rikhtan
    spur: تشویق کردن tashvigh kardan, مهمیز زدن mahmiz zadan
    squander: هدر دادن hadar dâdan, بر باد دادن bar bâd dâdan
    squeal: جیغ کشیدن jigh keshidan
    squeeze: فشردن feshordan, فشار دادن feshâr dâdan
    squint: چشم تنگ کردن chashm tang kardan
    stab: چاقو زدن châghu zadan
    stabilize: تثبیت کردن tasbit kardan, پایدار کردن pâydâr kardan
    stagger: تلو تلو خوردن talo talo khordan
    stain: لکه کردن lakke kardan, لک انداختن lak andâkhtan
    stall: از کار افتادن az kâr oftâdan
    stamp: مهر زدن mohr zadan, کوبیدن kubidan
    start: شروع کردن shoru' kardan, راه افتادن râh oftâdan
    startle: ترساندن tarsândan, از جا پراندن az jâ parândan
    stash: پنهان کردن penhân kardan
    state: بیان کردن bayân kardan, اظهار کردن ez-hâr kardan
    stay: ماندن mândan, اقامت کردن eghâmat kardan
    steady: ثابت کردن sâbet kardan, پایدار کردن pâydâr kardan
    steal: دزدیدن dozdidan, سرقت کردن serghat kardan
    steer: هدایت کردن hedâyat kardan, فرمان دادن farmân dâdan
    sterilize: استریل کردن esteril kardan, عقیم کردن aghim kardan
    stew: خورش پختن khoresh pokhtan, دم کردن dam kardan
    stick: چسباندن chasbândan, چسبیدن chasbidan
    stifle: خفه کردن khafe kardan, سرکوب کردن sarkub kardan
    stigmatize: انگ زدن ang zadan
    stimulate: تحریک کردن tahrik kardan
    sting: نیش زدن nish zadan
    stink: بوی بد دادن buye bad dâdan
    stipulate: شرط کردن shart kardan, مقرر کردن moghararr kardan
    stir: هم زدن ham zadan
    stitch: دوختن dukhtan, بخیه زدن bakhye zadan
    stop: ایستادن istâdan, متوقف کردن motevaghef kardan
    store: ذخیره کردن zakhire kardan, انبار کردن anbâr kardan
    storm: یورش بردن yurish bordan
    straighten: صاف کردن sâf kardan, راست کردن râst kardan
    strain: صاف کردن sâf kardan, کشیدن keshidan
    strangle: خفه کردن khafe kardan
    strap: بستن bastan
    stray: سرگردان شدن sargardân shodan, منحرف شدن monharef shodan
    strengthen: تقویت کردن taghviyat kardan
    stress: تاکید کردن tâkid kardan, استرس دادن esteres dâdan
    stretch: کشیدن keshidan, کش آمدن kesh âmadan
    strew: پاشیدن pâshidan, پراکنده کردن parâkande kardan
    string: نخ کردن nakh kardan
    strip: لخت کردن lokht kardan, برهنه کردن berahne kardan
    stroke: نوازش کردن navâzesh kardan
    stroll: قدم زدن ghadam zadan
    struggle: تقلا کردن taghallâ kardan, مبارزه کردن mobâreze kardan
    strum: زدن zadan
    study: مطالعه کردن motâle'e kardan, درس خواندن dars khândan
    stuff: پر کردن por kardan, چپاندن chapândan
    stumble: لغزیدن laghzidan
    stun: مبهوت کردن mabhut kardan
    subdue: مطیع کردن moti' kardan, رام کردن râm kardan
    submit: تسلیم کردن taslim kardan, ارائه دادن erâ'e dâdan
    subscribe: مشترک شدن moshtarak shodan, اشتراک گرفتن eshterâk gereftan
    subsidize: یارانه دادن yârâne dâdan
    substitute: جایگزین کردن jâygozin kardan
    subtract: کم کردن kam kardan, تفریق کردن tafrigh kardan
    succeed: موفق شدن movaffagh shodan
    succumb: تسلیم شدن taslim shodan, جان باختن jân bâkhtan
    suck: مکیدن makidan
    sue: شکایت کردن shekâyat kardan
    suffer: رنج بردن ranj bordan, عذاب کشیدن azâb keshidan
    suffocate: خفه شدن khafe shodan
    suggest: پیشنهاد دادن pishnahâd dâdan, پیشنهاد کردن pishnahâd kardan
    suit: مناسب بودن monâseb budan
    sum: جمع زدن jam' zadan
    summarize: خلاصه کردن kholâse kardan
    summon: احضار کردن ehzâr kardan, فرا|خواندن farâ|khândan
    supersede: جایگزین شدن jâygozin shodan
    supervise: نظارت کردن nezârat kardan
    supplement: تکمیل کردن takmil kardan
    supply: تامین کردن tâmin kardan, عرضه کردن arze kardan
    support: حمایت کردن hemâyat kardan, پشتیبانی کردن poshtibâni kardan
    suppose: فرض کردن farz kardan
    suppress: سرکوب کردن sarkub kardan
    surf: موج‌سواری کردن mowj-savâri kardan
    surge: افزایش یافتن afzâyesh yâftan, موج زدن mowj zadan
    surmise: حدس زدن hads zadan
    surpass: پیشی گرفتن pishi gereftan
    surprise: شگفت‌زده کردن shegeft-zade kardan, غافلگیر کردن ghâfelgir kardan
    surrender: تسلیم شدن taslim shodan
    surround: احاطه کردن ehâte kardan, محاصره کردن mohâsere kardan
    survey: نظرسنجی کردن nazarsanji kardan, بررسی کردن barrasi kardan
    survive: زنده ماندن zende mândan
    suspect: مشکوک بودن mashkuk budan, ظن بردن zann bordan
    suspend: معلق کردن mo'allagh kardan
    sustain: ادامه دادن edâme dâdan, حفظ کردن hefz kardan
    swallow: بلعیدن bal'idan, قورت دادن ghurt dâdan
    swap: عوض کردن avaz kardan, معاوضه کردن mo'âveze kardan
    sway: تاب خوردن tâb khordan, تاب دادن tâb dâdan
    swear: قسم خوردن ghasam khordan
    sweat: عرق کردن araq kardan
    sweep: جارو کردن jâru kardan
    sweeten: شیرین کردن shirin kardan
    swell: ورم کردن varam kardan, متورم شدن motevarrem shodan
    swim: شنا کردن shenâ kardan
    swindle: کلاهبرداری کردن kolâhbardâri kardan
    swing: تاب خوردن tâb khordan
    swipe: کشیدن keshidan, دزدیدن dozdidan
    switch: عوض کردن avaz kardan, تغییر دادن taghyir dâdan
    symbolize: نشان دادن neshân dâdan
    sympathize: همدردی کردن hamdardi kardan
    sync: همگام‌سازی کردن hamgâm-sâzi kardan
    synchronize: همزمان کردن hamzamân kardan
    synthesize: ترکیب کردن tarkib kardan
    tack: میخ زدن mikh zadan
    tackle: مقابله کردن moghâbele kardan
    tag: برچسب زدن barchasb zadan
    tailor: دوختن dukhtan, متناسب کردن motenâseb kardan
    taint: آلوده کردن âlude kardan
    take: گرفتن gereftan, بردن bordan
    take care of: مراقبت کردن morâghebat kardan
    take off: بر|خاستن bar|khâstan (a plane), در|آوردن dar|âvardan (clothes)
    take part: شرکت کردن sherkat kardan
    talk: صحبت کردن sohbat kardan, حرف زدن harf zadan
    tally: شمردن shomordan, جمع زدن jam' zadan
    tame: رام کردن râm kardan, اهلی کردن ahli kardan
    tamper: دستکاری کردن dastkâri kardan
    tan: برنزه کردن bronze kardan, دباغی کردن dabbâghi kardan
    tangle: گره خوردن gereh khordan, گره زدن gereh zadan
    tap: ضربه زدن zarbe zadan
    tape: نوار گرفتن navâr gereftan, ضبط کردن zabt kardan
    taper: باریک کردن bârik kardan
    target: هدف قرار دادن hadaf gharâr dâdan, نشانه گرفتن neshâne gereftan
    tarnish: لکه‌دار کردن lakke-dâr kardan, کدر کردن kodar kardan
    taste: چشیدن chashidan, مزه کردن maze kardan
    tattoo: تاتو کردن tâtu kardan, خالکوبی کردن khâlkubi kardan
    taunt: تحقیر کردن tahghir kardan, مسخره کردن maskhare kardan
    tax: مالیات گرفتن mâliyât gereftan
    teach: درس دادن dars dâdan, تدریس کردن tadris kardan, آموزش دادن âmuzesh dâdan
    tear: پاره کردن pâre kardan, دریدن daridan
    tear down: خراب کردن kharâb kardan, تخریب کردن takhrib kardan
    tease: اذیت کردن aziyat kardan, سر به سر گذاشتن sar be sar gozâshtan
    telephone: تلفن کردن telefon kardan, زنگ زدن zang zadan
    tell: گفتن goftan, تعریف کردن ta'rif kardan (a story)
    tell off: سرزنش کردن sarzanesh kardan, توبیخ کردن towbikh kardan
    tempt: وسوسه کردن vasvase kardan, فریفتن fariftan
    tend: گرایش داشتن gerâyesh dâshtan, مراقبت کردن morâghebat kardan (care for)
    tenderize: نرم کردن narm kardan
    terminate: خاتمه دادن khâtame dâdan, پایان دادن pâyân dâdan
    terrify: وحشت‌زده کردن vahshat-zade kardan, ترساندن tarsândan
    test: آزمایش کردن âzmâyesh kardan, امتحان کردن emtehân kardan
    testify: شهادت دادن shahâdat dâdan, گواهی دادن govâhi dâdan
    tether: بستن bastan
    thank: تشکر کردن tashakkor kardan, سپاسگزاری کردن sepâsgozâri kardan
    thaw: آب شدن âb shodan, آب کردن âb kardan
    thicken: غلیظ کردن ghaliz kardan
    thin: رقیق کردن raghigh kardan, لاغر کردن lâghar kardan
    think: فکر کردن fekr kardan (ponder), خیال کردن khiyâl kardan (believe)
    think about: فکر کردن fekr kardan, تامل کردن tâmmol kardan
    thread: نخ کردن nakh kardan
    threaten: تهدید کردن tahdid kardan
    thrill: هیجان‌زده کردن heyjân-zade kardan
    thrive: شکوفا شدن shokufâ shodan, رونق گرفتن ravnagh gereftan
    throb: تپیدن tapidan, ضربان داشتن zarabân dâshtan
    throttle: خفه کردن khafe kardan
    throw: پرتاب کردن partâb kardan, انداختن andâkhtan
    throw away: دور انداختن dur andâkhtan
    thrust: فرو کردن foru kardan, هل دادن hol dâdan
    thump: کوبیدن kubidan, مشت زدن mosht zadan
    thunder: رعد زدن ra'd zadan, غریدن gharidan
    thwart: خنثی کردن khonsâ kardan, ناکام گذاشتن nâkâm gozâshtan
    tick: تیک زدن tik zadan
    tidy: مرتب کردن morattab kardan, جمع و جور کردن jam' o jur kardan
    tie: بستن bastan, گره زدن gereh zadan
    tighten: سفت کردن seft kardan, محکم کردن mohkam kardan
    tilt: کج کردن kaj kardan, خم کردن kham kardan
    time: زمان‌سنجی کردن zamân-sanji kardan
    tingle: گزگز کردن gazgaz kardan
    tint: رنگ زدن rang zadan
    tip: کج کردن kaj kardan, انعام دادن en'âm dâdan (give a tip)
    tire: خسته کردن khaste kardan, خسته شدن khaste shodan
    title: عنوان گذاشتن onvân gozâshtan
    toast: برشته کردن barshte kardan, به سلامتی نوشیدن be salâmati noshidan (drink a toast)
    toggle: تغییر وضعیت دادن taghyir vaz'iyat dâdan, جابه‌جا کردن jâbe-jâ kardan
    tolerate: تحمل کردن tahammol kardan
    tone: تقویت کردن taghviyat kardan
    top: فراتر رفتن farâtar raftan, پیشی گرفتن pishi gereftan
    topple: سرنگون کردن sarnegun kardan, واژگون کردن vâzhgun kardan
    torment: شکنجه کردن shekanje kardan, عذاب دادن azâb dâdan
    torture: شکنجه کردن shekanje kardan
    toss: پرت کردن part kardan, انداختن andâkhtan
    touch: لمس کردن lams kardan, دست زدن dast zadan
    tour: گردش کردن gardesh kardan, بازدید کردن bâzdid kardan
    tow: یدک کشیدن yadak keshidan
    trace: ردیابی کردن radyâbi kardan, ترسیم کردن tarsim kardan
    track: ردیابی کردن radyâbi kardan, تعقیب کردن ta'ghib kardan
    trade: تجارت کردن tejârat kardan, معامله کردن mo'âmele kardan
    train: آموزش دادن âmuzesh dâdan, تمرین کردن tamrin kardan
    trample: لگدمال کردن lagadmâl kardan
    transcend: فراتر رفتن farâtar raftan
    transcribe: رونویسی کردن runevisi kardan
    transfer: انتقال دادن enteghâl dâdan, منتقل کردن montaghel kardan
    transform: تبدیل کردن tabdil kardan, دگرگون کردن degargun kardan
    translate: ترجمه کردن tarjome kardan
    transmit: ارسال کردن ersâl kardan, منتقل کردن montaghel kardan
    transpire: اتفاق افتادن ettefâgh oftâdan
    transplant: پیوند زدن peyvand zadan
    transport: حمل کردن haml kardan, جابه‌جا کردن jâbe-jâ kardan
    trap: به دام انداختن be dâm andâkhtan
    travel: سفر کردن safar kardan
    traverse: پیمودن peymudan, عبور کردن obur kardan
    tread: قدم گذاشتن ghadam gozâshtan
    treasure: گرامی داشتن grâmi dâshtan, ارزش نهادن arzesh nahâdan
    treat: رفتار کردن raftâr kardan, درمان کردن darmân kardan
    tremble: لرزیدن larzidan
    trick: فریب دادن farib dâdan, گول زدن gul zadan
    trickle: چکیدن chekidan
    trigger: فعال کردن fa''âl kardan, بر|انگیختن bar|angikhtan
    trim: کوتاه کردن kutâh kardan, هرس کردن haras kardan
    trip: لغزیدن laghzidan, زمین خوردن zamin khordan
    triple: سه برابر کردن se barâbar kardan
    trivialize: ساده‌انگاری کردن sâde-engâri kardan
    trot: یورتمه رفتن yurtme raftan
    trouble: ناراحت کردن nârâhat kardan, زحمت دادن zahmat dâdan
    truncate: کوتاه کردن kutâh kardan, قطع کردن ghat' kardan
    trust: اعتماد کردن e'temâd kardan, باور کردن bâvar kardan
    try: سعی کردن sa'y kardan, تلاش کردن talâsh kardan, امتحان کردن emtehân kardan (try out)
    try on: پرو کردن pro kardan
    tuck: تا زدن tâ zadan, جا دادن jâ dâdan
    tumble: غلتیدن gheltidan, افتادن oftâdan
    tune: کوک کردن kuk kardan, تنظیم کردن tanzim kardan
    tunnel: تونل زدن tunel zadan
    turn: چرخیدن charkhidan, چرخاندن charkhândan
    turn around: بر|گشتن bar|gashtan, دور زدن dur zadan
    turn down: رد کردن rad kardan, کم کردن kam kardan (volume)
    turn into: تبدیل شدن tabdil shodan
    turn off: خاموش کردن khâmush kardan
    turn on: روشن کردن rowshan kardan
    turn up: زیاد کردن ziyâd kardan (volume), سر رسیدن sar residan (appear)
    tweet: توییت کردن tuyit kardan
    twinkle: چشمک زدن chashmak zadan
    twirl: چرخیدن charkhidan, چرخاندن charkhândan
    type: تایپ کردن tâyp kardan
    umpire: داوری کردن dâvari kardan
    unbutton: دکمه باز کردن dokme bâz kardan
    uncover: آشکار کردن âshkâr kardan, کشف کردن kashf kardan
    underestimate: دست‌کم گرفتن dast-kam gereftan
    undergo: تحمل کردن tahammol kardan, گذراندن gozarândan
    underline: خط کشیدن khat keshidan
    undermine: تضعیف کردن taz'if kardan
    underpin: پشتیبانی کردن poshtibâni kardan
    understand: فهمیدن fahmidan, درک کردن dark kardan
    understate: کوچک شمردن kuchak shomordan
    undertake: بر عهده گرفتن bar ohde gereftan
    underwrite: تضمین کردن tazmin kardan
    undo: لغو کردن laghv kardan, باز کردن bâz kardan
    undress: لباس در|آوردن lebâs dar|âvardan
    unearth: کشف کردن kashf kardan, بیرون کشیدن birun keshidan
    unfasten: باز کردن bâz kardan
    unfold: باز کردن bâz kardan, گشودن goshudan
    unfurl: باز کردن bâz kardan, گشودن goshudan
    unhook: باز کردن bâz kardan
    unify: متحد کردن mottahed kardan, یکپارچه کردن yekpârche kardan
    uninstall: حذف کردن hazf kardan
    unite: متحد کردن mottahed kardan, متحد شدن mottahed shodan
    unleash: رها کردن rahâ kardan
    unload: خالی کردن khâli kardan, تخلیه کردن takhliye kardan
    unmask: افشا کردن afshâ kardan
    unpack: باز کردن bâz kardan
    unplug: جدا کردن jodâ kardan
    unravel: باز کردن bâz kardan, حل کردن hal kardan
    unroll: باز کردن bâz kardan
    unscrew: باز کردن bâz kardan
    unsettle: آشفته کردن âshofte kardan
    untie: باز کردن bâz kardan
    unveil: رونمایی کردن runamâyi kardan
    unwrap: باز کردن bâz kardan
    unzip: استخراج کردن estekhrâj kardan
    update: به‌روزرسانی کردن beruzresâni kardan
    upgrade: ارتقا دادن ertegha dâdan
    uphold: حفظ کردن hefz kardan, حمایت کردن hemâyat kardan
    uplift: بالا بردن bâlâ bordan
    upload: آپلود کردن âplod kardan, بارگذاری کردن bârgozâri kardan
    uproot: ریشه‌کن کردن rishe-kan kardan
    upset: ناراحت کردن nârâhat kardan, آشفته کردن âshofte kardan
    urge: ترغیب کردن targhib kardan, اصرار کردن esrâr kardan
    use: استفاده کردن estefâde kardan, به کار بردن be kâr bordan
    usher: راهنمایی کردن râhnamâyi kardan
    usurp: غصب کردن ghasb kardan
    utilize: استفاده کردن estefâde kardan, بهره بردن bahre bordan
    utter: بر زبان آوردن bar zabân âvardan
    vaccinate: واکسینه کردن vâksine kardan
    vacuum: جارو برقی کشیدن jâru barghi keshidan
    validate: اعتبارسنجی کردن e'tebâr-sanji kardan, تایید کردن tâyid kardan
    value: ارزش گذاشتن arzesh gozâshtan, ارزیابی کردن arzyâbi kardan
    vandalize: خرابکاری کردن kharâbkâri kardan
    vanish: ناپدید شدن nâpadid shodan
    vaporize: بخار کردن bokhâr kardan, تبخیر کردن tabkhir kardan
    varnish: لاک زدن lâk zadan, جلا دادن jalâ dâdan
    vary: تغییر کردن taghyir kardan, متفاوت بودن motefâvet budan
    veer: منحرف شدن monharef shodan
    vent: خالی کردن khâli kardan
    ventilate: تهویه کردن tahviye kardan
    venture: جرات کردن jor'at kardan, ریسک کردن risk kardan
    verify: تایید کردن tâyid kardan, بررسی کردن barrasi kardan
    veto: وتو کردن veto kardan
    vex: آزرده کردن âzorde kardan
    vibrate: لرزیدن larzidan
    victimize: قربانی کردن ghorbâni kardan
    videotape: فیلمبرداری کردن filmbardâri kardan
    vie: رقابت کردن reghâbat kardan
    view: مشاهده کردن moshâhede kardan, نگاه کردن negâh kardan
    vilify: بدگویی کردن badguyi kardan
    vindicate: تبرئه کردن tabre'e kardan
    violate: نقض کردن naghz kardan, تجاوز کردن tajâvoz kardan
    visit: دیدار کردن didâr kardan, بازدید کردن bâzdid kardan
    visualize: تجسم کردن tajassom kardan
    vocalize: صدا دادن sedâ dâdan
    void: باطل کردن bâtel kardan
    vomit: استفراغ کردن estefrâgh kardan
    vote: رای دادن ra'y dâdan
    vouch: تضمین کردن tazmin kardan
    vow: سوگند خوردن suggand khordan, قول دادن ghowl dâdan
    voyage: سفر کردن safar kardan
    wade: از آب گذشتن az âb gozashtan
    wag: تکان دادن tekân dâdan
    wail: زوزه کشیدن zuze keshidan, شیون کردن shivan kardan
    wait: صبر کردن sabr kardan, منتظر ماندن montazer mândan
    wait for: منتظر بودن montazer budan
    wait on: خدمت کردن khedmat kardan
    waive: صرف‌نظر کردن sarfnazar kardan
    wake: بیدار شدن bidâr shodan, بیدار کردن bidâr kardan
    wake up: بیدار شدن bidâr shodan, بیدار کردن bidâr kardan
    walk: راه رفتن râh raftan, قدم زدن ghadam zadan
    wall: دیوار کشیدن divâr keshidan
    waltz: والس رقصیدن vâls raghsidan
    wander: پرسه زدن parse zadan, سرگردان بودن sargardân budan
    wane: کاهش یافتن kâhesh yâftan
    want: خواستن khâstan, میل داشتن meyl dâshtan
    ward off: دور کردن dur kardan, دفع کردن daf' kardan
    warm: گرم کردن garm kardan
    warm up: گرم کردن garm kardan, گرم شدن garm shodan
    warn: هشدار دادن hoshdâr dâdan, اخطار دادن ekhtâr dâdan
    warp: تاب بر|داشتن tâb bar|dâshtan
    warrant: توجیه کردن towjih kardan, ایجاب کردن ijâb kardan
    wash: شستن shostan, شست‌وشو کردن shost-o-shu kardan
    waste: هدر دادن hadar dâdan
    watch: تماشا کردن tamâshâ kardan (look at), نگهبانی کردن negahbâni kardan (keep watch)
    water: آب دادن âb dâdan, آبیاری کردن âbyâri kardan
    wave: دست تکان دادن dast tekân dâdan
    waver: تردید کردن tardid kardan, دودل بودن dudel budan
    weaken: ضعیف کردن za'if kardan
    wean: از شیر گرفتن az shir gereftan
    wear: پوشیدن pushidan
    weave: بافتن bâftan
    wed: ازدواج کردن ezdevâj kardan, عروسی کردن arusi kardan
    weep: گریه کردن gerye kardan
    weigh: وزن کردن vazn kardan
    weigh down: سنگین کردن sangin kardan
    welcome: خوشامد گفتن khoshâmad goftan, استقبال کردن esteghbâl kardan
    weld: جوش دادن jush dâdan
    whack: کوبیدن kubidan
    whip: تازیانه زدن tâziyâne zadan
    whisper: پچ‌پچ کردن poch-poch kardan, زمزمه کردن zemzeme kardan
    whistle: سوت زدن sut zadan
    whiten: سفید کردن sefid kardan
    whittle: تراشیدن tarâshidan
    widen: عریض کردن ariz kardan, پهن کردن pahn kardan
    wield: به کار بردن be kâr bordan
    wiggle: تکان دادن tekân dâdan
    win: برنده شدن barande shodan, بردن bordan
    win over: جلب کردن jalb kardan
    wind: پیچاندن pichândan, پیچیدن pichidan
    wink: چشمک زدن chashmak zadan
    wipe: پاک کردن pâk kardan
    wish: آرزو کردن ârezu kardan
    withdraw: عقب کشیدن aghab keshidan, برداشت کردن bardâsht kardan (money)
    wither: پژمردن pazhmordan
    withstand: مقاومت کردن moghâvemat kardan, تاب آوردن tâb âvardan
    witness: شاهد بودن shâhed budan
    wobble: لرزیدن larzidan
    word: بیان کردن bayân kardan
    work: کار کردن kâr kardan
    work out: حل کردن hal kardan, ورزش کردن varzesh kardan (exercise)
    worry: نگران بودن negarân budan, نگران کردن negarân kardan
    worsen: بدتر شدن badtar shodan
    worship: پرستیدن parastidan, عبادت کردن ebâdat kardan
    wound: زخمی کردن zakhmi kardan
    wrap: پیچیدن pichidan, بسته‌بندی کردن baste-bandi kardan
    wreck: خراب کردن kharâb kardan, ویران کردن virân kardan
    wrench: پیچاندن pichândan
    wrestle: کشتی گرفتن koshti gereftan
    wring: چلاندن chalândan
    write: نوشتن neveshtan
    write down: یادداشت کردن yâddâsht kardan, نوشتن neveshtan
    write off: حذف کردن hazf kardan
    x-ray: رادیوگرافی کردن râdiogerâfi kardan
    yank: کشیدن keshidan
    yawn: خمیازه کشیدن khamyâze keshidan
    yearn: اشتیاق داشتن eshtiyâgh dâshtan, آرزو داشتن ârezu dâshtan
    yell: داد زدن dâd zadan, فریاد زدن faryâd zadan
    yelp: جیغ زدن jigh zadan
    yield: تسلیم شدن taslim shodan, بازده داشتن bâzdeh dâshtan
    yoke: یوغ بستن yugh bastan
    zap: نابود کردن nâbud kardan
    zip: فشرده کردن feshorde kardan, زیپ زدن zip zadan
    zone: منطقه‌بندی کردن mantaghe-bandi kardan
    zoom: زوم کردن zum kardan, بزرگ‌نمایی کردن bozorg-namâyi kardan
  `;

  // "go: رفتن raftan (move)" -> { go: [{ fa, tr, note }, ...] }
  function readEntry(entry, english) {
    const match = entry.match(/^([؀-ۿ‌|\s]+?)\s+([a-zâ'|\s-]+?)\s*(?:\((.*)\))?$/);
    if (!match) throw new Error(`verbs.js: cannot read "${entry}" in "${english}"`);
    const [, fa, tr, note] = match;
    return { fa, tr, ...(note ? { note } : {}) };
  }

  const VERBS = parseTable(TABLE, readEntry);

  if (typeof module !== 'undefined' && module.exports) module.exports = { VERBS };
  else global.VERBS = VERBS;
})(typeof window !== 'undefined' ? window : globalThis);
