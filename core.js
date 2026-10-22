/* ===== GRC Lab core: shared by the student lab and the teacher panel ===== */
const LAB = { id: 'GRC-L1', v: 1, salt: 'grc-lab-l1-7f3a' };

function dayNum(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 86400000); }
const AUDIT_DAY = dayNum(2026, 10, 16);
function pad2(x) { return String(x).padStart(2, '0'); }
function fmtDay(n) { const d = new Date(n * 86400000); return pad2(d.getUTCDate()) + '.' + pad2(d.getUTCMonth() + 1) + '.' + d.getUTCFullYear(); }

function hash32(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}
function rngFrom(seedHex) {
  let a = parseInt(seedHex.slice(0, 8), 16) >>> 0;
  return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/* Data is shared by everyone in the same group; the student code identifies the person. */
function dataKey(student) { return normCode((student && (student.group || student.code)) || ''); }
function normCode(c) { return String(c || '').normalize('NFC').trim().toUpperCase().replace(/\s+/g, ''); }

const AZ_TR = { 'ə': 'a', 'ı': 'i', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ö': 'o', 'ü': 'u', 'i̇': 'i' };
function translit(s) { return s.toLocaleLowerCase('az').split('').map(ch => AZ_TR[ch] ?? ch).join('').replace(/[^a-z]/g, ''); }

const NAMES_M = ['Tural', 'Orxan', 'Elnur', 'Fərid', 'Rəşad', 'Vüsal', 'Səbuhi', 'Ceyhun', 'Anar', 'Murad', 'Emin', 'Toğrul', 'Nihad', 'Ramil', 'Kənan', 'Samir', 'Zaur', 'Elçin'];
const NAMES_F = ['Aynur', 'Günay', 'Səbinə', 'Aysel', 'Lalə', 'Nərmin', 'Fidan', 'Ülviyyə', 'Könül', 'Şəbnəm', 'Röya', 'Aytən', 'Nuray', 'Səidə', 'Gülnar', 'Arzu', 'Türkan', 'Xədicə'];
const SURNAMES = ['Rzayev', 'Hüseynov', 'Kərimov', 'Abbasov', 'Cəfərov', 'Sadıqov', 'Əhmədov', 'Rəhimov', 'Zeynalov', 'Bağırov', 'Nəbiyev', 'Orucov', 'Səfərov', 'Mustafayev', 'Novruzov', 'Hacıyev', 'Vəliyev', 'Paşayev', 'Qasımov', 'Şükürov', 'Tağıyev', 'Musayev', 'Salmanov', 'Yusifov'];
const COMPANIES = [
  ['XəzərMarket MMC', 'onlayn ərzaq mağazası'], ['Gəncə Tekstil MMC', 'parça və geyim satışı'], ['Şəki İpək MMC', 'ipək məmulatı mağazası'],
  ['Lənkəran Aqro MMC', 'kənd təsərrüfatı məhsulları satışı'], ['Sumqayıt Logistika MMC', 'kiçik çatdırılma xidməti'], ['Qəbələ Tur MMC', 'turizm agentliyi'],
  ['Abşeron Optika MMC', 'optika salonu'], ['Nizami Kitab MMC', 'kitab mağazası'], ['Quba Meyvə MMC', 'meyvə-tərəvəz topdan satışı'], ['Mingəçevir Elektrik MMC', 'məişət texnikası mağazası']
];
const NONIT_POS = [['Satış', 'Satış meneceri'], ['Mühasibat', 'Mühasib'], ['Marketinq', 'Marketinq mütəxəssisi'], ['Kassa', 'Kassir'], ['Anbar', 'Anbar müdiri'], ['Müştəri xidməti', 'Operator'], ['Kadrlar', 'HR mütəxəssisi']];
const SHARED_USERS = ['kassa_ortaq', 'satis_ortaq', 'depo_ortaq', 'ofis_ortaq'];
const TEST_USERS = ['demo_admin', 'temp_admin', 'qa_test', 'test_admin'];

const TOKENS = ['OK', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'EV'];
const TOKEN_LABEL = { OK: 'Pozuntu yoxdur', Q1: 'Q1', Q2: 'Q2', Q3: 'Q3', Q4: 'Q4', Q5: 'Q5', EV: 'Sübut tələb olunur' };
const RULES = {
  Q1: 'İşdən çıxan işçinin hesabı son iş günü bağlanmalıdır.',
  Q2: 'Admin rolu yalnız IT istiqamətli işçilərə verilir.',
  Q3: 'Hər hesab konkret şəxsə aid olmalıdır; ortaq hesab qadağandır.',
  Q4: 'Admin hesablarında MFA məcburidir.',
  Q5: '90 gündən çox istifadə olunmayan hesab yoxlanmalı, lazım deyilsə bağlanmalıdır; uzunmüddətli məzuniyyətdə hesab dondurulur.'
};
const RISKS = ['Yüksək', 'Orta', 'Aşağı', '—'];

/* Build one student's unique dataset + answer key from their code. */
function generate(code) {
  const nc = normCode(code);
  const seed = hash32(LAB.id + '|' + nc);
  const r = rngFrom(seed);
  const ri = (a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const usedFull = new Set(), usedUser = new Set();
  function person() {
    for (let tries = 0; tries < 50; tries++) {
      const female = r() < 0.5;
      const first = pick(female ? NAMES_F : NAMES_M);
      const base = pick(SURNAMES);
      if (usedFull.has('s:' + base)) continue;
      const sur = base + (female ? 'a' : '');
      const full = first + ' ' + sur;
      if (usedFull.has(full)) continue;
      usedFull.add('s:' + base);
      let user = translit(first)[0] + '.' + translit(sur);
      if (usedUser.has(user)) user = translit(first).slice(0, 2) + '.' + translit(sur);
      if (usedUser.has(user)) continue;
      usedFull.add(full); usedUser.add(user);
      return { full, user };
    }
    throw new Error('name pool');
  }
  const [company, desc] = pick(COMPANIES);
  const D = AUDIT_DAY;
  const templates = ['OK_ADMIN', 'LEAVER', 'IT_NOMFA', pick(['NONIT_ADMIN_NOMFA', 'NONIT_ADMIN_MFA']), 'LEAVE', 'SHARED', 'TEST', 'OK_USER', 'OK_USER_NOMFA'];
  if (r() < 0.6) templates.push('INACTIVE');
  const hr = [], accounts = [], key = {}, calc = [];
  let n = 0;
  for (const t of shuffle(templates)) {
    const id = 'a' + (++n);
    let acc, hrRow = null, k;
    if (t === 'SHARED' || t === 'TEST') {
      const user = t === 'SHARED' ? pick(SHARED_USERS) : pick(TEST_USERS);
      const last = t === 'SHARED' ? D - ri(0, 6) : D - ri(200, 700);
      acc = { id, user, owner: '—', role: t === 'TEST' ? 'Admin' : 'İstifadəçi', mfa: 'Yox', last };
      if (t === 'SHARED') k = { tokens: ['Q3'], risk: ['Yüksək', 'Orta'], ev: ['sahib', 'ortaq', user], why: 'Sahibi göstərilmir və ad hesabın ortaq olduğunu göstərir (Q3). Hesab Admin olmadığı üçün MFA-nın olmaması Q4 deyil.' };
      else {
        k = { tokens: ['Q3', 'Q4', 'Q5'], risk: ['Yüksək'], ev: [fmtDay(last), 'sahib', String(D - last)], why: 'Sahibsiz (Q3) Admin hesabıdır, MFA yoxdur (Q4), son girişdən ' + (D - last) + ' gün keçib (Q5 üzrə nəzərdən keçirmə).' };
        calc.push({ id: 'c2', acc: id, q: user + ' hesabının son girişindən audit tarixinə (16.10.2026) neçə gün keçib?', answer: D - last });
      }
    } else {
      const p = person();
      let dept, pos, status = 'Aktiv', role = 'İstifadəçi', mfa = 'Var', last = D - ri(0, 12);
      if (t === 'OK_ADMIN' || t === 'IT_NOMFA') { dept = 'IT'; pos = t === 'OK_ADMIN' ? 'Sistem administratoru' : 'IT mütəxəssisi'; role = 'Admin'; mfa = t === 'OK_ADMIN' ? 'Var' : 'Yox'; }
      else { [dept, pos] = pick(NONIT_POS); }
      if (t === 'OK_ADMIN') k = { tokens: ['OK'], risk: ['—', 'Aşağı'], ev: [], why: 'IT işçisidir, Admin, MFA var, son giriş yaxındır: verilən sübutda pozuntu görünmür.' };
      if (t === 'IT_NOMFA') k = { tokens: ['Q4'], risk: ['Yüksək'], ev: ['MFA'], why: 'IT işçisi olduğu üçün Admin rolu Q2-yə uyğundur, amma Admin hesabında MFA yoxdur (Q4).' };
      if (t === 'LEAVER') {
        const L = D - ri(40, 90); last = L + ri(6, 35); status = 'İşdən çıxıb · son iş günü ' + fmtDay(L); mfa = r() < 0.5 ? 'Var' : 'Yox';
        k = { tokens: ['Q1'], risk: ['Yüksək'], ev: [fmtDay(L), fmtDay(last), String(last - L)], why: 'Son iş günü ' + fmtDay(L) + ', son giriş ' + fmtDay(last) + ': ' + (last - L) + ' gün sonra (Q1).' };
        calc.push({ id: 'c1', acc: id, q: p.user + ' hesabında son giriş son iş günündən neçə gün sonradır?', answer: last - L });
      }
      if (t === 'NONIT_ADMIN_NOMFA') { role = 'Admin'; mfa = 'Yox'; k = { tokens: ['Q2', 'Q4'], risk: ['Yüksək'], ev: ['Admin', dept, pos], why: dept + ' şöbəsinin işçisi Admin rolundadır (Q2) və MFA yoxdur (Q4).' }; }
      if (t === 'NONIT_ADMIN_MFA') { role = 'Admin'; mfa = 'Var'; k = { tokens: ['Q2'], risk: ['Yüksək', 'Orta'], ev: ['Admin', dept, pos], why: dept + ' şöbəsinin işçisi Admin rolundadır (Q2). MFA var, ona görə Q4 pozulmur.' }; }
      if (t === 'LEAVE') {
        const S = D - ri(100, 150); last = S - ri(1, 6); status = 'Uzunmüddətli məzuniyyət · ' + fmtDay(S) + '-dan';
        k = { tokens: ['Q5', 'EV'], risk: ['Orta'], ev: [fmtDay(S), fmtDay(last), 'status'], why: fmtDay(S) + '-dan məzuniyyətdədir, son giriş ' + fmtDay(last) + '. Cədvəldə hesab statusu yoxdur: dondurulma sübutu tələb olunur (Q5).' };
      }
      if (t === 'INACTIVE') { last = D - ri(95, 240); k = { tokens: ['Q5'], risk: ['Orta', 'Aşağı'], ev: [fmtDay(last), String(D - last)], why: 'Aktiv işçidir, amma son girişdən ' + (D - last) + ' gün keçib (Q5: nəzərdən keçirmə, lazım deyilsə bağlama).' }; }
      if (t === 'OK_USER') k = { tokens: ['OK'], risk: ['—', 'Aşağı'], ev: [], why: 'Aktiv işçi, adi istifadəçi, MFA var: pozuntu görünmür.' };
      if (t === 'OK_USER_NOMFA') { mfa = 'Yox'; k = { tokens: ['OK'], risk: ['—', 'Aşağı'], ev: [], why: 'Adi istifadəçidir: Q4 yalnız Admin hesablarına aiddir, ona görə MFA-nın olmaması pozuntu deyil.' }; }
      hrRow = { name: p.full, dept, pos, status };
      acc = { id, user: p.user, owner: p.full, role, mfa, last };
    }
    k.type = t; key[id] = k;
    accounts.push(acc); if (hrRow) hr.push(hrRow);
  }
  // Two extra HR-only people (no system account) make the matching less mechanical.
  for (let i = 0; i < 2; i++) { const p = person(); const [dept, pos] = pick(NONIT_POS); hr.push({ name: p.full, dept, pos, status: 'Aktiv' }); }
  const hrSorted = hr.slice().sort((a, b) => a.name.localeCompare(b.name, 'az'));
  calc.sort((a, b) => a.id.localeCompare(b.id));
  const datasetText = [company, ...hr.map(h => [h.name, h.dept, h.pos, h.status].join(' ')), ...accounts.map(a => [a.user, a.owner, a.role, a.mfa, fmtDay(a.last)].join(' '))].join(' ').toLocaleLowerCase('az');
  return { code: nc, seed, company, desc, staff: hr.length, auditDay: D, hr: hrSorted, accounts, key, calc, datasetText };
}

/* ---------- Policy section definitions ---------- */
const POLICY = [
  { t: 'Məqsəd', h: 'Siyasət nəyi, nədən qoruyur?', kw: ['qoru', 'məlumat', 'icazəsiz'] },
  { t: 'Kimlərə aiddir', h: 'Hansı şəxslər bu qaydalara əməl etməlidir?', kw: ['işçi', 'üçüncü', 'podrat', 'müvəqqəti', 'bütün', 'hamı'] },
  { t: 'Şifrələr və sistemə giriş', h: 'Hesablar, şifrələr və admin girişi üçün qaydalar.', kw: ['mfa', 'fərdi', 'paylaş', 'çoxfaktor', 'ortaq'] },
  { t: 'Müştəri məlumatı', h: 'Kim baxa bilər, hara göndərmək olmaz?', kw: ['şəxsi', 'whatsapp', 'e-poçt', 'telefon', 'qadağan', 'təsdiqlənmiş'] },
  { t: 'Cihazlar', h: 'Noutbuk, telefon və yaddaş daşıyıcıları.', kw: ['kilid', 'itki', 'itər', 'itmə', 'oğurl'] },
  { t: 'Təhlükəsizlik hadisələrinin bildirilməsi', h: 'Nə, kimə və nə qədər vaxtda bildirilir?', kw: ['bildir', 'saat', 'dərhal'] },
  { t: 'İşə qəbul, vəzifə dəyişikliyi və işdən ayrılma', h: 'HR və IT arasında hesab prosesi.', kw: ['son iş gün', 'bağlan', 'hr', 'dondur'] },
  { t: 'Məsuliyyətlər', h: 'Direktor, IT, HR və işçilərin rolu.', kw: ['direktor', 'it', 'hr', 'işçi'] },
  { t: 'Qayda pozuntuları', h: 'Pozuntu olduqda nə baş verir?', kw: ['araşdır', 'tədbir', 'məhdud'] },
  { t: 'Təsdiq və yenilənmə', h: 'Kim təsdiqləyir, nə vaxt yenilənir?', kw: ['təsdiq', 'ild', 'yenilə'] }
];
/* The lesson's model policy text: used only to detect copying from the lesson. */
const MODEL_POLICY = [
  'Bu siyasətin məqsədi BakuShop MMC-nin müştəri məlumatlarını (ad, telefon, ünvan), şirkət məlumatlarını və informasiya sistemlərini icazəsiz girişdən, açıqlanmadan, dəyişdirilmədən, itirilmədən və istifadənin pozulmasından qorumaqdır.',
  'Siyasət direktor da daxil olmaqla bütün daimi və müvəqqəti işçilərə, həmçinin BakuShop-un məlumatlarına və ya sistemlərinə giriş verilmiş podratçılara, xidmət təminatçılarına və digər üçüncü tərəflərə aiddir. Hər kəs bu tələblərə əməl etməlidir.',
  'Hər istifadəçi yalnız özünə aid fərdi hesabdan istifadə etməlidir. Şifrəni və giriş məlumatlarını başqa şəxsə vermək, başqasının hesabından istifadə etmək və ortaq hesab yaratmaq qadağandır. Giriş hüquqları yalnız iş üçün lazım olan həddə verilməlidir. Administrator hesablarında çoxfaktorlu autentifikasiya (MFA) məcburidir.',
  'Müştəri məlumatlarına yalnız iş vəzifəsi üçün ehtiyacı olan şəxslər baxa bilər. Müştəri siyahısını şəxsi telefona, şəxsi e-poçta, şəxsi bulud yaddaşına və ya təsdiqlənməmiş WhatsApp və digər mesajlaşma hesablarına göndərmək qadağandır. Məlumat yalnız şirkətin təsdiqlənmiş sistemləri və kanalları vasitəsilə paylaşılmalıdır.',
  'İşçi noutbuk, telefon və digər cihazı nəzarətsiz qoyduqda ekranı kilidləməlidir. Cihazın itməsi, oğurlanması və ya başqa şəxsin istifadəsinə keçməsi barədə IT-yə dərhal məlumat verilməlidir. Şirkət məlumatları təsdiqlənməmiş cihazlarda və yaddaş daşıyıcılarında saxlanmamalıdır.',
  'Şübhəli e-poçt, itirilmiş cihaz, səhvən göndərilmiş fayl, icazəsiz giriş və ya məlumat sızması şübhəsi aşkar edən hər bir işçi hadisəni dərhal, ən gec 1 saat ərzində IT-yə və ya təyin edilmiş məsul şəxsə bildirməlidir. İşçi hadisəni gizlətməməli, sübutları özbaşına silməməli və araşdırmaya mane olmamalıdır.',
  'HR yeni işçi, vəzifə dəyişikliyi, uzunmüddətli məzuniyyət və işdən ayrılma barədə IT-yə vaxtında, yazılı məlumat verməlidir. IT giriş hüquqlarını vəzifəyə uyğunlaşdırmalıdır. İşdən ayrılan şəxsin hesabı son iş günü bağlanmalıdır. Uzunmüddətli məzuniyyətdə olan şəxsin hesabı məzuniyyət dövründə dondurulmalıdır.',
  'Direktor siyasəti təsdiqləyir və onun icrası üçün lazımi resursları təmin edir. IT istifadəçi hesablarını yaradır, dəyişir və bağlayır, administrator girişlərinə MFA tətbiq edir və giriş hüquqlarını nəzərdən keçirir. HR işçilərin statusundakı dəyişiklikləri IT-yə bildirir. Hər bir işçi siyasətə əməl edir, giriş məlumatlarını qoruyur və şübhəli hadisələri vaxtında bildirir.',
  'Siyasət pozuntuları araşdırılmalıdır. Risk olduqda müvafiq giriş müvəqqəti məhdudlaşdırıla bilər. Pozuntuya uyğun tədbirlər şirkətin daxili qaydalarına, əmək münasibətlərinə və tətbiq olunan qanunvericiliyə uyğun görülməlidir.',
  'Siyasət direktor tərəfindən təsdiq edilir. Siyasət ən azı ildə bir dəfə, həmçinin ciddi təhlükəsizlik hadisəsi, sistem dəyişikliyi və ya iş prosesində əhəmiyyətli dəyişiklik baş verdikdə nəzərdən keçirilməlidir. Yenilənmiş versiya işçilərə çatdırılmalı və onların tanış olması qeydə alınmalıdır.'
];
const WORST_PARTS = [['Qayda', 'Hansı qayda pozulub? Kodunu yazın.'], ['Fakt', 'Öz cədvəlinizdən tarix, hesab və rol.'], ['Səbəb', 'Ehtimal olunan səbəb; sübut yoxdursa bunu qeyd edin.'], ['Nəticə', 'Şirkət və məlumat üçün risk.'], ['Tövsiyə', 'Konkret tədbir və məsul tərəf.']];
const LESSON_TOKENS = ['bakushop', 'leyla', 'həsənova', 'l.hasanova', 'kamran', 'k.guliyev', 'rauf', 'r.aliyev', 'nigar', 'babayeva', 'n.babayeva', 'anbar_ortaq', 'test_user', 'e.mammadov', 'o.nasirov', 't.ismayilov', '20.09.2026', '12.08.2026', '03.02.2025', '30.05.2026', '01.06.2026', '620 gün', '39 gün'];

/* ---------- Text helpers ---------- */
function lc(s) { return String(s || '').toLocaleLowerCase('az'); }
function words(s) { return lc(s).replace(/[^\p{L}\p{N}.]+/gu, ' ').trim().split(/\s+/).filter(Boolean); }
function shingles(s, k = 3) { const w = words(s); const out = new Set(); for (let i = 0; i + k <= w.length; i++) out.add(w.slice(i, i + k).join(' ')); return out; }
function jaccard(a, b) { if (!a.size || !b.size) return 0; let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i); }
function containment(a, ref) { if (!a.size) return 0; let i = 0; for (const x of a) if (ref.has(x)) i++; return i / a.size; }

/* ---------- Grading ---------- */
function gradeAuto(pkg, gen) {
  const A = pkg.answers || {};
  const out = { accounts: {}, parts: {} };
  let codeSum = 0, riskSum = 0, riskN = 0, factSum = 0, factN = 0;
  for (const acc of gen.accounts) {
    const k = gen.key[acc.id]; const a = (A.audit || {})[acc.id] || {};
    const S = new Set(a.tokens || []), E = new Set(k.tokens);
    let inter = 0; for (const x of S) if (E.has(x)) inter++;
    const uni = new Set([...S, ...E]).size;
    let sc = uni ? inter / uni : 0;
    if (E.has('OK')) sc = (S.size === 1 && S.has('OK')) ? 1 : 0;
    codeSum += sc;
    const riskOk = !!a.risk && k.risk.includes(a.risk); riskSum += riskOk ? 1 : 0; riskN++;
    let factOk = null;
    if (!E.has('OK')) { const f = lc(a.fact); factOk = f.length >= 15 && k.ev.some(e => f.includes(lc(e))); factSum += factOk ? 1 : 0; factN++; }
    out.accounts[acc.id] = { score: sc, riskOk, factOk, given: [...S], risk: a.risk || 'seçilməyib', fact: a.fact || '' };
  }
  const nAcc = gen.accounts.length;
  out.parts.codes = Math.round(codeSum / nAcc * 30 * 10) / 10;
  out.parts.risk = Math.round(riskSum / riskN * 5 * 10) / 10;
  out.parts.facts = factN ? Math.round(factSum / factN * 5 * 10) / 10 : 5;
  let calc = 0; out.calc = {};
  for (const c of gen.calc) { const v = parseInt(String((A.calc || {})[c.id] ?? '').replace(/[^\d-]/g, ''), 10); const ok = v === c.answer; out.calc[c.id] = { given: Number.isFinite(v) ? v : null, ok }; if (ok) calc += 5 / gen.calc.length; }
  out.parts.calc = Math.round(calc * 10) / 10;
  out.auto = Math.round((out.parts.codes + out.parts.risk + out.parts.facts + out.parts.calc) * 10) / 10; // of 45
  // Suggestions for the teacher-graded parts
  let pol = 0; out.policy = [];
  POLICY.forEach((p, i) => { const t = lc((A.policy || [])[i]); const len = t.length >= 60 ? 2 : (t.length >= 25 ? 1 : 0); const hits = p.kw.filter(k => t.includes(k)).length; const kw = hits >= 2 ? 2 : hits; out.policy.push({ len, kw, pts: len + kw }); pol += len + kw; });
  out.suggestPolicy = pol; // of 40
  const W = A.worst || {}; let w = 0; const wk = gen.key[W.acc];
  if (wk && wk.risk.includes('Yüksək')) w += 3;
  (W.parts || []).forEach(t => { if (lc(t).length >= 40) w += 1; });
  const parts = W.parts || [];
  if (wk && wk.tokens.some(t => t !== 'EV' && t !== 'OK' && lc(parts[0]).includes(lc(t)))) w += 2;
  if (wk && wk.ev.some(e => lc(parts[1]).includes(lc(e)))) w += 3;
  if (/ehtimal|araşdır|sübut/.test(lc(parts[2]))) w += 1;
  if (/\bit\b|it-|hr|direktor/.test(lc(parts[4]))) w += 1;
  out.suggestWorst = Math.min(15, w); // of 15
  return out;
}

/* ---------- Process (integrity) signals ---------- */
function textFields(pkg, gen) {
  const A = pkg.answers || {}; const f = [];
  POLICY.forEach((p, i) => f.push({ id: 'p' + i, label: 'Siyasət · ' + p.t, text: (A.policy || [])[i] || '' }));
  gen.accounts.forEach(acc => f.push({ id: 'f_' + acc.id, label: 'Fakt · ' + acc.user, text: ((A.audit || {})[acc.id] || {}).fact || '' }));
  WORST_PARTS.forEach((w, i) => f.push({ id: 'w' + i, label: 'Ən ciddi tapıntı · ' + w[0], text: ((A.worst || {}).parts || [])[i] || '' }));
  f.push({ id: 'refl', label: 'Əks etdirmə', text: A.reflection || '' });
  return f;
}
function computeSignals(pkg, gen, others) {
  const T = pkg.tel || { f: {} }; const S = [];
  const fields = textFields(pkg, gen);
  let total = 0, pasted = 0; const bigPaste = [], fastFields = [];
  for (const fd of fields) {
    const t = T.f[fd.id] || {}; const len = fd.text.length; total += len;
    const pc = Math.min(t.pc || 0, len); pasted += pc;
    if ((t.pc || 0) >= 120) bigPaste.push(fd.label + ' (' + t.pc + ' simvol)');
    const mins = (t.ms || 0) / 60000;
    if (len >= 150 && !(t.pc) && mins > 0 && len / mins > 450) fastFields.push(fd.label);
    if (len >= 150 && !(t.pc) && (t.k || 0) < len * 0.25) fastFields.push(fd.label + ' (az klaviatura hərəkəti)');
    if ((t.bulk || 0) >= 80) bigPaste.push(fd.label + ' (birdən ' + t.bulk + ' simvol daxil olub)');
  }
  const ratio = total ? pasted / total : 0;
  if (ratio >= 0.3) S.push({ lv: 'high', t: 'Mətnin ' + Math.round(ratio * 100) + '%-i yapışdırılıb', d: 'Cavab mətnlərinin böyük hissəsi klaviatura ilə yazılmayıb, başqa yerdən köçürülüb.' });
  else if (ratio >= 0.1) S.push({ lv: 'med', t: 'Mətnin ' + Math.round(ratio * 100) + '%-i yapışdırılıb', d: 'Bəzi hissələr başqa yerdən köçürülüb.' });
  if (bigPaste.length) S.push({ lv: bigPaste.length >= 3 ? 'high' : 'med', t: 'Böyük yapışdırmalar: ' + bigPaste.length, d: bigPaste.slice(0, 6).join('; ') });
  const fastU = [...new Set(fastFields)];
  if (fastU.length) S.push({ lv: 'med', t: 'Qeyri-adi sürətlə daxil edilmiş mətn', d: fastU.slice(0, 5).join('; ') + '. Avtomatik doldurma və ya brauzer əlavəsi ola bilər.' });
  const dur = (pkg.submitted || 0) - (pkg.started || 0);
  const awayMs = Math.max(T.hiddenMs || 0, T.blurMs || 0);
  if (dur > 0 && awayMs / dur >= 0.25) S.push({ lv: 'med', t: 'Vaxtın ' + Math.round(awayMs / dur * 100) + '%-i səhifədən kənarda', d: 'Səhifədən ' + Math.max(T.hidden || 0, T.blur || 0) + ' dəfə çıxılıb. Dərs materialına baxmaq da ola bilər, müsahibədə soruşun.' });
  else if (Math.max(T.hidden || 0, T.blur || 0) >= 15) S.push({ lv: 'low', t: 'Səhifədən tez-tez çıxma: ' + Math.max(T.hidden || 0, T.blur || 0) + ' dəfə', d: 'Başqa pəncərəyə keçidlər qeydə alınıb.' });
  if (dur > 0 && dur < 15 * 60000) S.push({ lv: 'med', t: 'Çox qısa iş müddəti: ' + Math.round(dur / 60000) + ' dəq.', d: 'Bütün laboratoriya adətən 45–70 dəqiqə çəkir.' });
  // Lesson leakage: names/dates from the classroom example that are not in this student's own data
  const allText = lc(fields.map(f => f.text).join(' \n '));
  const leak = LESSON_TOKENS.filter(tk => allText.includes(tk) && !gen.datasetText.includes(tk));
  if (leak.length) S.push({ lv: 'high', t: 'Dərs nümunəsinin datası işlədilib', d: 'Tələbənin öz cədvəlində olmayan ad/tarixlər: ' + leak.join(', ') + '. Cavab dərsdəki BakuShop nümunəsindən və ya başqasından köçürülmüş ola bilər.' });
  // Copying the lesson's model policy
  const copied = [];
  POLICY.forEach((p, i) => { const s = shingles((pkg.answers.policy || [])[i] || ''); if (s.size >= 6 && containment(s, shingles(MODEL_POLICY[i])) >= 0.5) copied.push(p.t); });
  if (copied.length >= 3) S.push({ lv: 'high', t: 'Siyasət dərs nümunəsindən köçürülüb: ' + copied.length + ' bölmə', d: copied.join(', ') });
  else if (copied.length) S.push({ lv: 'low', t: 'Dərs nümunəsinə çox yaxın bölmə: ' + copied.length, d: copied.join(', ') });
  // Formatting traces typical of text copied from a chat assistant
  const fmt = fields.filter(f => /\*\*|^#{1,4}\s|^\s*[-•]\s|—/m.test(f.text)).map(f => f.label);
  if (fmt.length >= 2) S.push({ lv: 'low', t: 'Söhbət botu formatına bənzər izlər', d: 'Ulduz işarəli qalın mətn, başlıq və ya siyahı işarələri: ' + fmt.slice(0, 4).join('; ') });
  // Similarity with other students
  if (others && others.length) {
    const mine = shingles(fields.filter(f => !f.id.startsWith('f_')).map(f => f.text).join(' '));
    const sims = [];
    for (const o of others) { if (o.id === pkg._id) continue; const sim = jaccard(mine, o.sh); if (sim >= 0.25 && mine.size > 40) sims.push([o.name, sim]); }
    sims.sort((a, b) => b[1] - a[1]);
    if (sims.length) S.push({ lv: sims[0][1] >= 0.4 ? 'high' : 'med', t: 'Digər tələbə ilə oxşar mətn', d: sims.slice(0, 3).map(s => s[0] + ' (' + Math.round(s[1] * 100) + '%)').join(', ') });
  }
  if (pkg.sigOk === false) S.push({ lv: 'high', t: 'Təhvil kodu dəyişdirilib', d: 'Kodun yoxlama imzası uyğun gəlmir: təhvildən sonra əl ilə dəyişdirilmiş ola bilər.' });
  if (pkg.seedOk === false) S.push({ lv: 'high', t: 'Data qrupa uyğun deyil', d: 'Təhvildəki data tələbənin qrupuna uyğun gəlmir: qrup adı dəyişdirilmiş ola bilər.' });
  const hi = S.filter(s => s.lv === 'high').length, md = S.filter(s => s.lv === 'med').length, lo = S.filter(s => s.lv === 'low').length;
  const level = hi || md >= 3 ? 'high' : (md || lo >= 2 ? 'med' : 'low');
  return { list: S, level, pasteRatio: ratio, duration: dur, away: awayMs };
}

/* Oral-defence questions built from the student's own data and answers. */
function oralQuestions(pkg, gen, grade) {
  const Q = [];
  const byType = t => gen.accounts.find(a => gen.key[a.id].type === t);
  const lv = byType('LEAVER'); if (lv) Q.push(lv.user + ' hesabında Q1 pozuntusunu hansı iki tarixə baxaraq müəyyən etdin? Fərq neçə gündür?');
  const nm = byType('OK_USER_NOMFA'); if (nm) Q.push(nm.user + ' hesabında MFA yoxdur. Bu niyə Q4 pozuntusu sayılır və ya sayılmır?');
  const lvv = byType('LEAVE'); if (lvv) Q.push(lvv.owner + ' məzuniyyətdədir. Onun hesabının dondurulmadığını qəti yaza bilərikmi? Niyə?');
  const wrong = gen.accounts.filter(a => grade.accounts[a.id].score < 1).slice(0, 2);
  wrong.forEach(a => Q.push(a.user + ' üçün “' + (grade.accounts[a.id].given.map(t => TOKEN_LABEL[t]).join(', ') || 'heç nə') + '” seçmisən. Qərarını hansı sütuna əsaslandırdın?'));
  Q.push('Siyasətinin “Şifrələr və sistemə giriş” bölməsində nəyi tələb etdin? Şifrə uzunluğunu niyə siyasətə yazmırıq?');
  return Q.slice(0, 6);
}

/* ---------- Submission code (deterrent, not cryptography) ---------- */
function signPkg(p) { const c = Object.assign({}, p); delete c.sig; return hash32(LAB.salt + JSON.stringify(c)); }
function b64url(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64url(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const bin = atob(s); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
async function encodePkg(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  if (typeof CompressionStream !== 'undefined') {
    try { const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer(); return 'GRC1.' + b64url(new Uint8Array(buf)); } catch (e) { }
  }
  return 'GRC0.' + b64url(bytes);
}
async function decodePkg(code) {
  const m = /^GRC([01])\.([A-Za-z0-9_-]+)$/.exec(String(code).replace(/\s+/g, ''));
  if (!m) throw new Error('Kod “GRC1.” və ya “GRC0.” ilə başlamalıdır.');
  let bytes = unb64url(m[2]);
  if (m[1] === '1') bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
  const pkg = JSON.parse(new TextDecoder().decode(bytes));
  if (!pkg || pkg.lab !== LAB.id) throw new Error('Bu kod GRC laboratoriyasına aid deyil.');
  pkg.sigOk = pkg.sig === signPkg(Object.assign({}, pkg, { sigOk: undefined }));
  return pkg;
}
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
