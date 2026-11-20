import React, { useState, useEffect } from 'react';

// ============================================================================
// SPESIALDESIGNET APP-IKON (INLINE SVG)
// ============================================================================
function ThailandAppIcon({ size = 48, id = 'th-visum-icon' }) {
  return (
    <svg
      id={id}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Thailand-hjelperen: Visum & Reiser ikon"
    >
      <defs>
        <linearGradient id="thBg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B2545" />
          <stop offset="60%" stopColor="#133C68" />
          <stop offset="100%" stopColor="#0F5257" />
        </linearGradient>
        <linearGradient id="thGold" x1="25" y1="15" x2="95" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#F4B942" />
          <stop offset="100%" stopColor="#D48C1C" />
        </linearGradient>
      </defs>

      {/* Avrundet bakgrunn */}
      <rect x="2" y="2" width="116" height="116" rx="28" fill="url(#thBg)" />
      <rect x="4" y="4" width="112" height="112" rx="26" stroke="url(#thGold)" strokeWidth="2.5" strokeOpacity="0.7" />

      {/* Stjernelys */}
      <circle cx="92" cy="28" r="16" fill="#F4B942" fillOpacity="0.14" />
      <circle cx="28" cy="32" r="2" fill="#FFE082" fillOpacity="0.8" />

      {/* Gyllent thailandsk Chedi / Tempeltak */}
      <path d="M60 14L62.5 29H57.5L60 14Z" fill="url(#thGold)" />
      <circle cx="60" cy="13" r="2.2" fill="#FFE082" />
      <path d="M52 38C52 32 56 29 60 29C64 29 68 32 68 38L73 48H47L52 38Z" fill="url(#thGold)" />
      <path d="M27 64C34 61 42 54 47 48H73C78 54 86 61 93 64C88 66 82 65 78 63H42C38 65 32 66 27 64Z" fill="url(#thGold)" />
      <path d="M21 75C31 71 39 66 43 62H77C81 66 89 71 99 75C93 77 86 76 81 74H39C34 76 27 77 21 75Z" fill="url(#thGold)" />
      <rect x="37" y="74" width="46" height="11" rx="2" fill="#163F66" stroke="url(#thGold)" strokeWidth="1.5" />
      <path d="M55 85V77C55 75.5 57 74.5 60 74.5C63 74.5 65 75.5 65 77V85H55Z" fill="url(#thGold)" />

      {/* Norsk/Thailandsk fargebånd */}
      <rect x="18" y="89" width="84" height="4" rx="2" fill="#E05A47" />
      <rect x="24" y="94.5" width="72" height="2.5" rx="1.25" fill="#FFFFFF" fillOpacity="0.95" />
      <rect x="30" y="98.5" width="60" height="3.5" rx="1.75" fill="#1D4E89" />

      {/* Visumstempel merke */}
      <g transform="translate(73, 69) rotate(-10)">
        <rect x="0" y="0" width="34" height="24" rx="5" fill="#0B2545" stroke="#F4B942" strokeWidth="2" />
        <rect x="3" y="3" width="28" height="18" rx="3" stroke="#E05A47" strokeWidth="1.2" strokeDasharray="2 1.5" />
        <text
          x="17"
          y="14.5"
          textAnchor="middle"
          fill="#FFE082"
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="sans-serif"
          letterSpacing="0.5"
        >
          TH•NO
        </text>
      </g>
    </svg>
  );
}

// ============================================================================
// HJELPEFUNKSJONER FOR DATOER
// ============================================================================
const addDays = (dateStr, days) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return '';
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateNO = (dateStr) => {
  if (!dateStr) return 'Ikke valgt';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getDaysDiffFromToday = (targetStr) => {
  if (!targetStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = targetStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// ============================================================================
// STANDARDDATA
// ============================================================================
const VISA_OPTIONS = [
  {
    id: 'exempt_30',
    label: 'Visumfritt opphold (30 dager)',
    days: 30,
    canExtend: true,
    extDays: 30,
    note: 'Oppdatert etter regelendringen i september 2026 (ned fra 60 til 30 dager). Kan forlenges én gang med +30 dager på Immigration Office (1 900 THB).'
  },
  {
    id: 'non_o_90',
    label: 'Non-Immigrant O – Pensjonist 50+ (90 dager → 1 år)',
    days: 90,
    canExtend: true,
    extDays: 365,
    note: 'Gir 90 dagers opphold ved innreise, som deretter forlenges med 1 år (365 dager) på lokalt Immigration Office i Thailand.'
  },
  {
    id: 'non_oa_365',
    label: 'Non-Immigrant O-A – Pensjonist 50+ (365 dager)',
    days: 365,
    canExtend: false,
    extDays: 0,
    note: 'Gir 365 dagers opphold direkte ved innreise. Krever godkjent helseforsikring på 3 000 000 THB og politiattest ved søknad.'
  }
];

const INITIAL_REMINDERS = [
  {
    id: 'rem-1',
    title: 'Søk Non-Immigrant O (e-Visa) 6–8 uker før avreise',
    date: '2026-12-01',
    category: 'Visum',
    done: false
  },
  {
    id: 'rem-2',
    title: 'Sett inn 800 000 THB i thailandsk bank (2 mnd før forlengelse)',
    date: '2027-01-25',
    category: 'Bank & Økonomi',
    done: false
  },
  {
    id: 'rem-3',
    title: 'Første 90-dagersrapportering (TM.47) & 1-års forlengelse',
    date: '2027-04-05',
    category: '90-dager (TM.47)',
    done: false
  },
  {
    id: 'rem-4',
    title: 'Kjøp Re-entry Permit før sommerreise til Norge',
    date: '2027-05-10',
    category: 'Re-entry Permit',
    done: false
  }
];

const INITIAL_CHECKLIST = [
  { id: 'chk-1', text: 'Pass gyldig i over 6 mnd (anbefalt >18 mnd ved Non-O pensjonistvisum)', done: true },
  { id: 'chk-2', text: 'TDAC (Thailand Digital Arrival Card) utfylt på nett innen 3 dager før ankomst', done: false },
  { id: 'chk-3', text: 'Utreisebillett innen 30 dager (ved visumfri innreise) eller godkjent e-Visa', done: false },
  { id: 'chk-4', text: 'Kontantbevis tilgjengelig ved forespørsel (10 000 THB enkeltperson / 20 000 THB familie)', done: false },
  { id: 'chk-5', text: 'Ingen e-sigaretter eller vape i bagasjen (strengt totalforbud i Thailand)', done: true },
  { id: 'chk-6', text: 'Tollkvote overholdt: Maks 200 sigaretter (1 kartong) og maks 1 liter alkohol per person', done: false },
  { id: 'chk-7', text: 'Be utleier/hotell om TM.30-kvittering innen 24 timer etter ankomst', done: false }
];

const EMERGENCY_LIST = [
  { name: 'Turistpolitiet (Engelsktalende 24/7)', phone: '1155', tag: 'Nød / Bistand' },
  { name: 'Politi (Royal Thai Police)', phone: '191', tag: 'Akutt' },
  { name: 'Ambulanse / Medisinsk nødhjelp', phone: '1669', tag: 'Medisinsk' },
  { name: 'Immigration Bureau Hotline', phone: '1178', tag: 'Visum & TM.47' },
  { name: 'Norges ambassade i Bangkok', phone: '+66 2 204 6500', tag: 'Konsulært' }
];

// ============================================================================
// HOVEDKOMPONENT
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('visa');
  const [notice, setNotice] = useState('');

  // Fane 1: Visum & 90-dager
  const [arrivalDate, setArrivalDate] = useState('2027-01-15');
  const [visaId, setVisaId] = useState('non_o_90');
  const [tm47BaseDate, setTm47BaseDate] = useState('2027-01-15');

  // Fane 2: Pensjonistvisum (50+) sjekker
  const [finMode, setFinMode] = useState('bank'); // 'bank' | 'pension' | 'combo'
  const [bankThb, setBankThb] = useState(800000);
  const [pensionNokNet, setPensionNokNet] = useState(22000);

  // Fane 3: Påminnelser & Valuta (med localStorage)
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem('th_visum_app_reminders_v1');
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState('');
  const [remCat, setRemCat] = useState('Visum');

  // Valutakurs: standard 0.31 NOK = 1 THB
  const [nokPerThb, setNokPerThb] = useState(() => {
    try {
      const saved = localStorage.getItem('th_visum_app_rate_v1');
      return saved ? parseFloat(saved) : 0.31;
    } catch {
      return 0.31;
    }
  });
  const [thbVal, setThbVal] = useState('1000');
  const [nokVal, setNokVal] = useState('310.00');

  // Fane 4: Innreise & Nødnumre (sjekkliste i localStorage)
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('th_visum_app_checklist_v1');
      return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
    } catch {
      return INITIAL_CHECKLIST;
    }
  });
  const [newCheckText, setNewCheckText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('th_visum_app_reminders_v1', JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem('th_visum_app_rate_v1', String(nokPerThb));
    } catch {}
  }, [nokPerThb]);

  useEffect(() => {
    try {
      localStorage.setItem('th_visum_app_checklist_v1', JSON.stringify(checklist));
    } catch {}
  }, [checklist]);

  const showBanner = (msg) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice((prev) => (prev === msg ? '' : prev));
    }, 3600);
  };

  // Last ned app-ikon som SVG-fil
  const handleDownloadSvgIcon = () => {
    const svgEl = document.getElementById('th-visum-header-icon');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thailand-hjelperen-ikon.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showBanner('App-ikonet ble lastet ned som SVG-fil!');
  };

  // Beregninger for Fane 1: Visum & 90-dager
  const selectedVisa = VISA_OPTIONS.find((v) => v.id === visaId) || VISA_OPTIONS[1];
  // Innreisedag = Dag 1 => siste utreisedag = innreise + (dager - 1)
  const lastExitDate = arrivalDate ? addDays(arrivalDate, selectedVisa.days - 1) : '';
  const extendedExitDate =
    arrivalDate && selectedVisa.canExtend
      ? addDays(lastExitDate, selectedVisa.extDays)
      : '';
  const daysLeftVisa = getDaysDiffFromToday(lastExitDate);

  // TM.47 (90-dagersrapportering: innreise/siste rapport = Dag 1 => forfall Dag 90 = +89 dager)
  const tm47DueDate = tm47BaseDate ? addDays(tm47BaseDate, 89) : '';
  const tm47OnlineStart = tm47DueDate ? addDays(tm47DueDate, -15) : '';
  const tm47OnlineEnd = tm47DueDate ? addDays(tm47DueDate, -7) : '';
  const tm47OfficeStart = tm47DueDate ? addDays(tm47DueDate, -15) : '';
  const tm47OfficeEnd = tm47DueDate ? addDays(tm47DueDate, 7) : '';

  // Beregninger for Fane 2: Pensjonistvisum (50+)
  const safeRate = nokPerThb > 0 ? nokPerThb : 0.31;
  const monthlyPensionThb = Math.round(Number(pensionNokNet || 0) / safeRate);
  const annualPensionThb = monthlyPensionThb * 12;
  const comboSumThb = Number(bankThb || 0) + annualPensionThb;

  const isFinQualified =
    finMode === 'bank'
      ? Number(bankThb) >= 800000
      : finMode === 'pension'
      ? monthlyPensionThb >= 65000
      : comboSumThb >= 800000;

  // Legg inn ferdige 2027-påminnelser
  const add2027PensionReminders = () => {
    const base = arrivalDate || '2027-01-15';
    const preset = [
      {
        id: `rem-2027-${Date.now()}-1`,
        title: 'Søk Non-O pensjonistvisum (e-Visa) 6–8 uker før avreise',
        date: addDays(base, -45),
        category: 'Visum',
        done: false
      },
      {
        id: `rem-2027-${Date.now()}-2`,
        title: 'Be utleier om TM.30-kvittering innen 24 timer etter ankomst',
        date: addDays(base, 1),
        category: 'TM.30',
        done: false
      },
      {
        id: `rem-2027-${Date.now()}-3`,
        title: 'Åpne thailandsk bankkonto & sett inn 800 000 THB (2 mnd før forlengelse)',
        date: addDays(base, 14),
        category: 'Bank & Økonomi',
        done: false
      },
      {
        id: `rem-2027-${Date.now()}-4`,
        title: 'Søk 1-års forlengelse (Non-O) & lever første TM.47 (90-dager)',
        date: addDays(base, 75),
        category: '90-dager (TM.47)',
        done: false
      },
      {
        id: `rem-2027-${Date.now()}-5`,
        title: 'Kjøp Re-entry Permit (1 000 / 3 800 THB) før hjemreise til Norge',
        date: addDays(base, 115),
        category: 'Re-entry Permit',
        done: false
      }
    ];
    setReminders((prev) => [...preset, ...prev]);
    setActiveTab('reminders');
    showBanner('5 viktige påminnelser for 2027-flyttingen er lagt til!');
  };

  // Fane 3: Påminnelser & Valuta funksjoner
  const addReminder = (e) => {
    e.preventDefault();
    if (!remTitle.trim() || !remDate) {
      showBanner('Fyll inn både tittel og dato for påminnelsen.');
      return;
    }
    setReminders((prev) => [
      {
        id: `rem-${Date.now()}`,
        title: remTitle.trim(),
        date: remDate,
        category: remCat,
        done: false
      },
      ...prev
    ]);
    setRemTitle('');
    setRemDate('');
    showBanner('Påminnelse lagret!');
  };

  const exportICS = () => {
    const active = reminders.filter((r) => !r.done && r.date);
    if (active.length === 0) {
      showBanner('Ingen aktive påminnelser med dato å eksportere.');
      return;
    }
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Thailand-hjelperen Visum//NO'
    ];
    active.forEach((item) => {
      const start = item.date.replace(/-/g, '');
      const end = addDays(item.date, 1).replace(/-/g, '');
      lines.push(
        'BEGIN:VEVENT',
        `UID:${item.id}@thailand-hjelperen.no`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:[TH] ${item.category}: ${item.title}`,
        'END:VEVENT'
      );
    });
    lines.push('END:VCALENDAR');

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thailand-visum-paminnelser.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showBanner(`Eksporterte ${active.length} påminnelser til kalender (.ics).`);
  };

  const handleThbInput = (val) => {
    setThbVal(val);
    const num = parseFloat(val);
    setNokVal(!isNaN(num) ? (num * safeRate).toFixed(2) : '');
  };

  const handleNokInput = (val) => {
    setNokVal(val);
    const num = parseFloat(val);
    setThbVal(!isNaN(num) ? Math.round(num / safeRate).toString() : '');
  };

  const handleRateChange = (val) => {
    const parsed = parseFloat(val.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      setNokPerThb(parsed);
      const t = parseFloat(thbVal);
      if (!isNaN(t)) setNokVal((t * parsed).toFixed(2));
    }
  };

  const tabs = [
    { id: 'visa', label: '1. Visum & 90-dager', icon: '🛂' },
    { id: 'pension', label: '2. Pensjonistvisum (50+)', icon: '🌴' },
    { id: 'reminders', label: '3. Påminnelser & Valuta', icon: '⏰' },
    { id: 'entry', label: '4. Innreise & Nødnumre', icon: '🆘' }
  ];

  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.date.localeCompare(b.date);
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans pb-12">
      {/* MELDINGSBANNER */}
      {notice && (
        <div className="fixed top-4 right-4 z-50 bg-[#0B2545] text-white border border-amber-400 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          <span>✨</span>
          <span>{notice}</span>
        </div>
      )}

      {/* TOPPHEADER MED SPESIALDESIGNET SVG-IKON */}
      <header className="bg-gradient-to-r from-[#0B2545] via-[#133C68] to-[#0F5257] text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="shrink-0 shadow-lg rounded-[26px]">
                <ThailandAppIcon size={54} id="th-visum-header-icon" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <span>🇹🇭 Norge ⇄ Thailand</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  Thailand-hjelperen: Visum & Reiser
                </h1>
                <p className="text-xs text-slate-200 mt-0.5">
                  Visumfrister, 90-dagersrapportering (TM.47), pensjonistvisum 50+ og valutakalkulator
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadSvgIcon}
              className="self-start sm:self-center px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              title="Last ned app-ikonet som vektorfil (SVG)"
            >
              <span>⬇️</span>
              <span>Last ned app-ikon (SVG)</span>
            </button>
          </div>

          {/* 4 FANER I TOPPMENYEN */}
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/15">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#F4B942] text-[#0B2545] shadow-md'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* HOVEDINNHOLD */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ===================================================================
            FANE 1: VISUM & 90-DAGER
           =================================================================== */}
        {activeTab === 'visa' && (
          <div className="space-y-6">
            {/* Oppholdskalkulator */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2545] flex items-center gap-2">
                <span>🛂</span> Kalkulator for siste utreisedato
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Thailandske immigrasjonsmyndigheter teller alltid <strong>innreisedagen som Dag 1</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Innreisedato til Thailand
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => {
                      setArrivalDate(e.target.value);
                      setTm47BaseDate(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base font-bold text-[#0B2545]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Visumtype / Innreisegrunnlag
                  </label>
                  <select
                    value={visaId}
                    onChange={(e) => setVisaId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm sm:text-base font-bold text-[#0B2545] bg-white"
                  >
                    {VISA_OPTIONS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-800 leading-relaxed">
                <strong>Regelinfo:</strong> {selectedVisa.note}
              </div>

              {lastExitDate && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  <div className="rounded-2xl bg-[#0B2545] text-white p-5">
                    <span className="text-xs font-bold uppercase text-amber-300">
                      Siste utreisedato (Dag {selectedVisa.days})
                    </span>
                    <p className="text-2xl font-extrabold mt-1">{formatDateNO(lastExitDate)}</p>
                    <p className="text-xs text-slate-300 mt-1.5">
                      {daysLeftVisa !== null &&
                        (daysLeftVisa >= 0
                          ? `Om ${daysLeftVisa} dager`
                          : `Passert for ${Math.abs(daysLeftVisa)} dager siden`)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                    <span className="text-xs font-bold uppercase text-emerald-800">
                      Med forlengelse (+{selectedVisa.extDays} dager)
                    </span>
                    {selectedVisa.canExtend ? (
                      <>
                        <p className="text-2xl font-extrabold text-emerald-950 mt-1">
                          {formatDateNO(extendedExitDate)}
                        </p>
                        <p className="text-xs text-emerald-800 mt-1.5">
                          Søk på Immigration 2–3 uker før {formatDateNO(lastExitDate)}.
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-slate-600 mt-2">
                        Fornyes årlig før {formatDateNO(lastExitDate)}.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-sky-50 border border-sky-200 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-sky-900">
                        Lagre i påminnelser
                      </span>
                      <p className="text-xs text-sky-800 mt-1">
                        Legg utløpsdatoen direkte inn i påminnelseslisten.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setReminders((prev) => [
                          {
                            id: `rem-v-${Date.now()}`,
                            title: `Visumfrist utløper (${selectedVisa.label})`,
                            date: lastExitDate,
                            category: 'Visum',
                            done: false
                          },
                          ...prev
                        ]);
                        showBanner('Siste utreisedato er lagt til i påminnelser!');
                      }}
                      className="mt-3 w-full py-2.5 px-3 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-[#133C68] cursor-pointer"
                    >
                      + Legg til i påminnelser
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* 90-dagersrapportering (TM.47) & TM.30 */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2545] flex items-center gap-2">
                <span>📅</span> 90-dagersrapportering (TM.47) & TM.30
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Oppholder du deg i Thailand i over 90 sammenhengende dager, må du melde adresse hver 90. dag (gratis). Telleren nullstilles hver gang du reiser ut av Thailand.
              </p>

              <div className="mt-4 max-w-md">
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Innreisedato eller dato for siste godkjente TM.47
                </label>
                <input
                  type="date"
                  value={tm47BaseDate}
                  onChange={(e) => setTm47BaseDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base font-bold text-[#0B2545]"
                />
              </div>

              {tm47DueDate && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  <div className="rounded-2xl bg-[#0B2545] text-white p-5">
                    <span className="text-xs font-bold uppercase text-amber-300">
                      Forfallsdato TM.47 (Dag 90)
                    </span>
                    <p className="text-2xl font-extrabold mt-1">{formatDateNO(tm47DueDate)}</p>
                    <p className="text-xs text-slate-300 mt-1.5">
                      For sent oppmøte gir bot på 2 000 THB.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                    <span className="text-xs font-bold uppercase text-amber-900">
                      Nettvindu (15–7 dager før)
                    </span>
                    <p className="text-base font-extrabold text-[#0B2545] mt-1.5">
                      {formatDateNO(tm47OnlineStart)} – {formatDateNO(tm47OnlineEnd)}
                    </p>
                    <p className="text-xs text-amber-900 mt-1.5">
                      Leveres på <em>tm47.immigration.go.th</em> (etter første godkjente rapport).
                    </p>
                  </div>

                  <div className="rounded-2xl bg-sky-50 border border-sky-200 p-5">
                    <span className="text-xs font-bold uppercase text-sky-900">
                      Oppmøte Immigration (-15 / +7 dager)
                    </span>
                    <p className="text-base font-extrabold text-[#0B2545] mt-1.5">
                      {formatDateNO(tm47OfficeStart)} – {formatDateNO(tm47OfficeEnd)}
                    </p>
                    <p className="text-xs text-sky-800 mt-1.5">
                      Ta med pass, TM.30-kvittering og forrige TM.47-lapp.
                    </p>
                  </div>
                </div>
              )}

              {/* TM.30-påminnelse */}
              <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <span className="text-xl">🏠</span>
                <div className="text-xs text-rose-950 leading-relaxed">
                  <strong>Viktig om TM.30 (Bostedsregistrering innen 24 timer):</strong> Husvert eller hotell er lovpålagt å registrere deg hos Immigration innen 24 timer etter ankomst. Be alltid om utskrift eller bilde av TM.30-kvitteringen – uten denne får du verken 1-års forlengelse eller godkjent TM.47.
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            FANE 2: PENSJONISTVISUM (50+)
           =================================================================== */}
        {activeTab === 'pension' && (
          <div className="space-y-6">
            {/* Sammenligning Non-O vs Non-O-A */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2545]">
                    🌴 Pensjonistvisum til Thailand (50 år og eldre)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Sammenligning mellom de to vanligste visumtypene for norske pensjonister:
                  </p>
                </div>
                <button
                  onClick={add2027PensionReminders}
                  className="px-4 py-3 rounded-2xl bg-[#0B2545] hover:bg-[#133C68] text-white text-xs font-extrabold shadow-sm cursor-pointer shrink-0"
                >
                  ⏰ Legg inn 2027-påminnelser
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold mb-2">
                    Anbefalt valg (Enklest)
                  </span>
                  <h3 className="text-base font-extrabold text-[#0B2545]">
                    Non-Immigrant O (90 dager → 1 år)
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                    <li>✅ Søkes via Thailands e-Visa i Norge før avreise (gir 90 dager).</li>
                    <li>✅ Forlenges med <strong>1 år (365 dager)</strong> hos Immigration i Thailand (1 900 THB).</li>
                    <li>✅ <strong>Ingen krav</strong> om politiattest eller thailandsk helseforsikring.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-600 text-white text-[11px] font-bold mb-2">
                    Alternativ (1 år fra dag 1)
                  </span>
                  <h3 className="text-base font-extrabold text-[#0B2545]">
                    Non-Immigrant O-A (365 dager)
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                    <li>ℹ️ Gir 1 års opphold direkte ved innreise (flerinnreise første år).</li>
                    <li>⚠️ Krever godkjent helseforsikring på minst <strong>3 000 000 THB</strong> også ved senere årlige fornyelser.</li>
                    <li>⚠️ Krever politiattest og legeattest ved søknad i Norge.</li>
                  </ul>
                </div>
              </div>

              {/* Kritisk advarsel om Re-entry Permit */}
              <div className="mt-5 p-4 rounded-2xl bg-rose-50 border-2 border-[#E05A47] flex items-start gap-3">
                <span className="text-2xl">✈️</span>
                <div className="text-xs text-rose-950 leading-relaxed">
                  <strong className="text-sm text-[#B83A28] block mb-0.5">
                    KRITISK ADVARSEL: Husk Re-entry Permit før du reiser hjem til Norge!
                  </strong>
                  Når du har fått 1-års forlengelse i Thailand, <strong>MÅ</strong> du kjøpe <strong>Re-entry Permit</strong> (Single: <strong>1 000 THB</strong> / Multiple: <strong>3 800 THB</strong>) på Immigration Office eller på flyplassen før passkontrollen. Uten Re-entry Permit kanselleres hele årsvisumet ditt automatisk i det øyeblikket du forlater Thailand!
                </div>
              </div>
            </section>

            {/* Interaktiv finansiell sjekker */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-lg font-extrabold text-[#0B2545]">
                💰 Interaktiv finansiell sjekker for 1-års forlengelse
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Velg metode og sjekk om du oppfyller kapital- eller pensjonskravet:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
                <button
                  onClick={() => setFinMode('bank')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    finMode === 'bank'
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-extrabold">1. Bankinnskudd</p>
                  <p className={`text-[11px] ${finMode === 'bank' ? 'text-amber-300' : 'text-slate-500'}`}>
                    Minst 800 000 THB i thailandsk bank
                  </p>
                </button>

                <button
                  onClick={() => setFinMode('pension')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    finMode === 'pension'
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-extrabold">2. Månedlig pensjon</p>
                  <p className={`text-[11px] ${finMode === 'pension' ? 'text-amber-300' : 'text-slate-500'}`}>
                    Minst 65 000 THB/mnd netto
                  </p>
                </button>

                <button
                  onClick={() => setFinMode('combo')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    finMode === 'combo'
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-extrabold">3. Kombinasjon</p>
                  <p className={`text-[11px] ${finMode === 'combo' ? 'text-amber-300' : 'text-slate-500'}`}>
                    Bank + årlig pensjon ≥ 800 000 THB
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 items-center">
                <div className="space-y-4">
                  {(finMode === 'bank' || finMode === 'combo') && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Innskudd på thailandsk bankkonto (THB)
                      </label>
                      <input
                        type="number"
                        step="10000"
                        value={bankThb}
                        onChange={(e) => setBankThb(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base font-extrabold text-[#0B2545]"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Tilsvarer ca. <strong>{Math.round(Number(bankThb || 0) * safeRate).toLocaleString('nb-NO')} NOK</strong> (kurs {safeRate.toFixed(2)}).
                      </p>
                    </div>
                  )}

                  {(finMode === 'pension' || finMode === 'combo') && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Netto månedlig pensjon fra Norge (NOK/mnd etter skatt)
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={pensionNokNet}
                        onChange={(e) => setPensionNokNet(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base font-extrabold text-[#0B2545]"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Tilsvarer ca. <strong>{monthlyPensionThb.toLocaleString('nb-NO')} THB/mnd</strong> ({annualPensionThb.toLocaleString('nb-NO')} THB/år).
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className={`rounded-2xl p-5 border-2 ${
                    isFinQualified
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <p className="text-base font-extrabold">
                    {isFinQualified ? '✅ Kravet er oppfylt!' : '⚠️ Under minstekravet'}
                  </p>

                  {finMode === 'bank' && (
                    <p className="text-xs mt-2 leading-relaxed">
                      <strong>Regler for 800 000 THB på konto:</strong> Beløpet må stå urørt i minst <strong>2 måneder før første søknad</strong> (3 måneder før årlig fornyelse), og <strong>3 måneder etter godkjenning</strong>. Resten av året kan saldoen aldri falle under <strong>400 000 THB</strong>.
                    </p>
                  )}

                  {finMode === 'pension' && (
                    <p className="text-xs mt-2 leading-relaxed">
                      <strong>Krav: Minst 65 000 THB/mnd</strong> (ca. 20 000–22 000 NOK netto). Må dokumenteres med offisiell pensjonsbekreftelse fra NAV legalisert hos UD og Thailands ambassade i Oslo.
                    </p>
                  )}

                  {finMode === 'combo' && (
                    <p className="text-xs mt-2 leading-relaxed">
                      Din samlede sum er <strong>{comboSumThb.toLocaleString('nb-NO')} THB</strong> (krav: minst 800 000 THB). Merk at ren bankmetode (800 000 THB) ofte er enklest hos lokale Immigration-kontorer.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            FANE 3: PÅMINNELSER & VALUTA
           =================================================================== */}
        {activeTab === 'reminders' && (
          <div className="space-y-6">
            {/* Toveis valutakalkulator */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2545]">
                    💱 Toveis valutakalkulator (THB ⇄ NOK)
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Justerbar valutakurs og hurtigbeløp for hverdag og pensjonistvisum.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl">
                  <span className="text-xs font-bold text-[#0B2545]">1 THB =</span>
                  <input
                    type="number"
                    step="0.01"
                    value={nokPerThb}
                    onChange={(e) => handleRateChange(e.target.value)}
                    className="w-20 rounded-lg border border-amber-300 bg-white px-2 py-1 text-sm font-extrabold text-[#0B2545] text-right"
                  />
                  <span className="text-xs font-bold text-[#0B2545]">NOK</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    🇹🇭 Thailandske Baht (THB)
                  </label>
                  <input
                    type="number"
                    value={thbVal}
                    onChange={(e) => handleThbInput(e.target.value)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-[#0B2545] focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    🇳🇴 Norske Kroner (NOK)
                  </label>
                  <input
                    type="number"
                    value={nokVal}
                    onChange={(e) => handleNokInput(e.target.value)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-[#0B2545] focus:outline-none"
                  />
                </div>
              </div>

              {/* Hurtigbeløp */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[500, 1000, 10000, 65000, 800000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleThbInput(String(amt))}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-extrabold text-[#0B2545] cursor-pointer"
                  >
                    {amt.toLocaleString('nb-NO')} THB
                  </button>
                ))}
              </div>

              {/* Tips om minibankgebyr og lokal valuta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                  <strong>🏧 Minibankgebyr (220 THB):</strong> Alle thailandske minibanker tar 220 THB (ca. {Math.round(220 * safeRate)} kr) i fast gebyr per uttak med utenlandsk kort. Ta ut større beløp sjeldnere, eller bruk thailandsk bankkonto.
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <strong>💳 Velg alltid THB i kortterminal:</strong> Når terminalen eller minibanken spør om du vil belastes i NOK eller THB, velg alltid <strong>THB</strong> («Without Conversion») for å unngå 4–6 % dårligere vekslingskurs.
                </div>
              </div>
            </section>

            {/* Påminnelsesliste */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2545]">
                    ⏰ Dine påminnelser & visumfrister
                  </h2>
                  <p className="text-xs text-slate-600">
                    Lagres automatisk i nettleseren og kan eksporteres til kalenderen din.
                  </p>
                </div>
                <button
                  onClick={exportICS}
                  className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#0B2545] text-xs font-extrabold cursor-pointer shrink-0"
                >
                  📅 Eksporter til kalender (.ics)
                </button>
              </div>

              {/* Skjema ny påminnelse */}
              <form onSubmit={addReminder} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <input
                  type="text"
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="Ny påminnelse (f.eks. Forny 1-års Non-O visum)..."
                  className="sm:col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={remDate}
                  onChange={(e) => setRemDate(e.target.value)}
                  className="sm:col-span-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                <select
                  value={remCat}
                  onChange={(e) => setRemCat(e.target.value)}
                  className="sm:col-span-2 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-bold"
                >
                  <option value="Visum">Visum</option>
                  <option value="90-dager (TM.47)">90-dager (TM.47)</option>
                  <option value="TM.30">TM.30</option>
                  <option value="Re-entry Permit">Re-entry Permit</option>
                  <option value="Bank & Økonomi">Bank & Økonomi</option>
                </select>
                <button
                  type="submit"
                  className="sm:col-span-2 py-2 px-3 rounded-xl bg-[#0B2545] text-white text-xs font-extrabold hover:bg-[#133C68] cursor-pointer"
                >
                  + Legg til
                </button>
              </form>

              {/* Liste */}
              <div className="space-y-2.5">
                {sortedReminders.map((item) => {
                  const daysLeft = getDaysDiffFromToday(item.date);
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        item.done
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() =>
                            setReminders((prev) =>
                              prev.map((r) => (r.id === item.id ? { ...r, done: !r.done } : r))
                            )
                          }
                          className="mt-1 w-5 h-5 accent-[#0B2545] cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              {item.category}
                            </span>
                            <span className="text-xs font-semibold text-slate-600">
                              {formatDateNO(item.date)}
                            </span>
                            {!item.done && daysLeft !== null && (
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                  daysLeft <= 14
                                    ? 'bg-[#E05A47] text-white'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {daysLeft < 0
                                  ? `Forfalt (${Math.abs(daysLeft)}d)`
                                  : daysLeft === 0
                                  ? 'I dag'
                                  : `Om ${daysLeft} dager`}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm font-bold mt-1 ${
                              item.done ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {item.title}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setReminders((prev) => prev.filter((r) => r.id !== item.id))
                        }
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                        title="Slett"
                      >
                        Slett
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            FANE 4: INNREISE & NØDNUMRE
           =================================================================== */}
        {activeTab === 'entry' && (
          <div className="space-y-6">
            {/* Interaktiv sjekkliste */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2545]">
                    ✅ Sjekkliste for innreise til Thailand
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Kryss av punktene før avreise (lagres lokalt i nettleseren).
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                  {checklist.filter((c) => c.done).length} / {checklist.length} utført
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCheckText.trim()) return;
                  setChecklist((prev) => [
                    ...prev,
                    { id: `chk-${Date.now()}`, text: newCheckText.trim(), done: false }
                  ]);
                  setNewCheckText('');
                }}
                className="flex gap-2 mb-4"
              >
                <input
                  type="text"
                  value={newCheckText}
                  onChange={(e) => setNewCheckText(e.target.value)}
                  placeholder="Legg til eget sjekklistepunkt..."
                  className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0B2545] text-white text-xs font-extrabold cursor-pointer"
                >
                  + Legg til
                </button>
              </form>

              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer ${
                      item.done
                        ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        : 'bg-white border-slate-200 text-slate-800 font-medium'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() =>
                        setChecklist((prev) =>
                          prev.map((c) => (c.id === item.id ? { ...c, done: !c.done } : c))
                        )
                      }
                      className="w-5 h-5 accent-emerald-600"
                    />
                    <span className="text-xs sm:text-sm flex-1">{item.text}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Nødnumre i Thailand */}
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2545] mb-1">
                🆘 Viktige nødnumre i Thailand
              </h2>
              <p className="text-xs text-slate-600 mb-4">
                Trykk på nummeret for å ringe direkte fra mobilen.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {EMERGENCY_LIST.map((em) => (
                  <div
                    key={em.name}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#0B2545] text-amber-300">
                        {em.tag}
                      </span>
                      <h3 className="text-sm font-bold text-[#0B2545] mt-2">{em.name}</h3>
                    </div>
                    <a
                      href={`tel:${em.phone.replace(/\s+/g, '')}`}
                      className="mt-3 py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 border border-slate-300 text-center font-extrabold text-base text-[#E05A47]"
                    >
                      📞 {em.phone}
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}