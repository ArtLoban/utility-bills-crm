/* global React */
// Bills list screen — Iteration 2
// Full-data state: 156 records, sortable, paginated, filterable
// Reuses window.UB primitives from dashboard.jsx

const { useState: useSt, useMemo: useMemo2 } = React;
const { Z, ACCENTS, SERVICE_COLORS, SERVICE_ICONS, Icons, TopBar } = window.UB;
const ACCENT = ACCENTS.violet;

// ---- Extra icons ----
const BI = {
  ArrowUp:   (p) => <svg width={p.s||12} height={p.s||12} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>,
  ArrowDown: (p) => <svg width={p.s||12} height={p.s||12} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>,
  ArrowUpDown:(p)=> <svg width={p.s||12} height={p.s||12} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>,
  MoreH:     (p) => <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  Plus:      (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>,
  ChevL:     (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  ChevR:     (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Receipt:   (p) => <svg width={p.s||40} height={p.s||40} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8H8M16 12H8M12 16H8"/></svg>,
  FilterX:   (p) => <svg width={p.s||40} height={p.s||40} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M13.013 3H2l8 9.46V19l4 2v-8.054l.26-.31"/><path d="m22 3-5 5"/><path d="m17 3 5 5"/></svg>,
};

// ---- Seed realistic bill data ----
const PROPERTIES = [
  { id: 'p1', name: 'Apartment on Main St', short: 'Main St' },
  { id: 'p2', name: "Mom's apartment",       short: "Mom's apt" },
  { id: 'p3', name: 'Summer house',          short: 'Summer house' },
];
const SERVICES = [
  { id: 'electricity', name: 'Electricity', unit: 'kWh' },
  { id: 'gas',         name: 'Gas',         unit: 'm³' },
  { id: 'coldWater',   name: 'Cold water',  unit: 'm³' },
  { id: 'hotWater',    name: 'Hot water',   unit: 'm³' },
  { id: 'internet',    name: 'Internet',    unit: null },
  { id: 'heating',     name: 'Heating',     unit: 'm³' },
];

// Monthly base amounts per service per property (UAH)
const BASE = {
  p1: { electricity:680,  gas:300,  coldWater:150, hotWater:230, internet:250, heating:520 },
  p2: { electricity:440,  gas:220,  coldWater:110, hotWater:180, internet:250, heating:380 },
  p3: { electricity:320,  gas:180,  coldWater:0,   hotWater:0,   internet:0,   heating:0   },
};
// Services per property
const PROP_SERVICES = {
  p1: ['electricity','gas','coldWater','hotWater','internet','heating'],
  p2: ['electricity','gas','coldWater','hotWater','internet','heating'],
  p3: ['electricity','gas'],
};

const MONTHS = [
  { year:2024, month:4,  label:'Apr 2024' },
  { year:2024, month:5,  label:'May 2024' },
  { year:2024, month:6,  label:'Jun 2024' },
  { year:2024, month:7,  label:'Jul 2024' },
  { year:2024, month:8,  label:'Aug 2024' },
  { year:2024, month:9,  label:'Sep 2024' },
  { year:2024, month:10, label:'Oct 2024' },
  { year:2024, month:11, label:'Nov 2024' },
  { year:2024, month:12, label:'Dec 2024' },
  { year:2025, month:1,  label:'Jan 2025' },
  { year:2025, month:2,  label:'Feb 2025' },
  { year:2025, month:3,  label:'Mar 2025' },
];

// Seasonal multiplier
const SEASONAL = (month, svc) => {
  if (svc === 'heating') {
    const m = [0,0.15,0.10,0,0,0,0,0,0.18,0.72,1.00,1.10,1.05,1.00,0.65,0.20][month] || 0;
    return m;
  }
  if (svc === 'gas') {
    const m = [0.20,0.15,0.12,0.11,0.24,0.42,0.72,0.88,0.94,0.86,0.66,0.52][MONTHS.findIndex(mm=>mm.month===month)] || 0.3;
    return m + 0.15;
  }
  return 0.85 + Math.sin(month * 0.5) * 0.15;
};

let billId = 0;
const ALL_BILLS = [];
for (const m of MONTHS) {
  for (const p of PROPERTIES) {
    for (const svcId of PROP_SERVICES[p.id]) {
      const base = BASE[p.id][svcId];
      if (!base) continue;
      const mult = SEASONAL(m.month, svcId);
      if (mult < 0.05) continue; // skip zero-heating months
      const noise = 0.92 + Math.abs(Math.sin(billId * 1.7)) * 0.16;
      const amount = Math.round(base * mult * noise / 10) * 10;
      if (amount < 20) continue;
      // payment date: 10–18th of the following month
      const payDay = 10 + (billId % 8);
      const payMonth = m.month === 12 ? 1 : m.month + 1;
      const payYear = m.month === 12 ? m.year + 1 : m.year;
      const dateStr = `${String(payDay).padStart(2,'0')} ${['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][payMonth]} ${payYear}`;
      // sort key
      const sortTs = payYear * 10000 + payMonth * 100 + payDay;
      ALL_BILLS.push({
        id: ++billId,
        date: dateStr,
        sortTs,
        property: p,
        service: SERVICES.find(s => s.id === svcId),
        period: m.label,
        periodSort: m.year * 100 + m.month,
        amount,
      });
    }
  }
}
// Sort newest first
ALL_BILLS.sort((a,b) => b.sortTs - a.sortTs);

// ---- Helpers ----
const fmtAmt = (n) => `−${n.toLocaleString('en-US')} UAH`;

function SelectEl({ value, onChange, options, style }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none', WebkitAppearance: 'none',
          height: 32, padding: '0 28px 0 12px',
          fontSize: 13, fontFamily: 'inherit',
          color: Z.foreground, background: Z.background,
          border: `1px solid ${Z.border}`, borderRadius: 6,
          cursor: 'pointer', minWidth: 140,
          ...style,
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={Z.mutedFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 8, pointerEvents: 'none' }}>
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>
  );
}

// Service badge with icon
function ServiceBadge({ svc }) {
  const color = SERVICE_COLORS[svc.id] || Z.mutedFg;
  const Ic = SERVICE_ICONS[svc.id];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {Ic && (
        <span style={{
          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
          background: color + '1A',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Ic size={12} stroke={color}/>
        </span>
      )}
      <span style={{ fontSize: 13.5, color: Z.foreground }}>{svc.name}</span>
    </div>
  );
}

// ---- The screen ----
function BillsList() {
  const [filterProp, setFilterProp] = useSt('all');
  const [filterSvc,  setFilterSvc]  = useSt('all');
  const [filterPeriod, setFilterPeriod] = useSt('last12');
  const [sortCol, setSortCol] = useSt('date');
  const [sortDir, setSortDir] = useSt('desc');
  const [page, setPage] = useSt(1);
  const [perPage] = useSt(25);
  const [openMenu, setOpenMenu] = useSt(null);

  const anyFilter = filterProp !== 'all' || filterSvc !== 'all' || filterPeriod !== 'last12';

  const filtered = useMemo2(() => {
    let rows = [...ALL_BILLS];
    if (filterProp !== 'all') rows = rows.filter(r => r.property.id === filterProp);
    if (filterSvc  !== 'all') rows = rows.filter(r => r.service.id === filterSvc);
    // period filter: last12 = all since we only have 12m; others would trim
    if (filterPeriod === 'last6') rows = rows.filter(r => r.periodSort >= 202410);
    if (filterPeriod === 'last3') rows = rows.filter(r => r.periodSort >= 202501);
    // sort
    rows.sort((a, b) => {
      let av, bv;
      if (sortCol === 'date')     { av = a.sortTs;      bv = b.sortTs; }
      else if (sortCol === 'amount')   { av = a.amount;     bv = b.amount; }
      else if (sortCol === 'property') { av = a.property.name; bv = b.property.name; }
      else if (sortCol === 'service')  { av = a.service.name;  bv = b.service.name; }
      else if (sortCol === 'period')   { av = a.periodSort;  bv = b.periodSort; }
      else { av = a.sortTs; bv = b.sortTs; }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [filterProp, filterSvc, filterPeriod, sortCol, sortDir]);

  const total = filtered.reduce((s, r) => s + r.amount, 0);
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <BI.ArrowUpDown c={Z.border} />;
    return sortDir === 'asc' ? <BI.ArrowUp c={ACCENT.solid}/> : <BI.ArrowDown c={ACCENT.solid}/>;
  };

  const thStyle = (col, align = 'left') => ({
    padding: '10px 16px', fontSize: 12.5, fontWeight: 500,
    color: Z.mutedFg, textAlign: align,
    borderBottom: `1px solid ${Z.border}`,
    cursor: 'pointer', userSelect: 'none',
    whiteSpace: 'nowrap',
  });

  const tdStyle = (align = 'left') => ({
    padding: '13px 16px', fontSize: 13.5,
    color: Z.foreground, textAlign: align,
    borderBottom: `1px solid ${Z.border}`,
    whiteSpace: 'nowrap',
  });

  // Pagination range
  const pageRange = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('…');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('…');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      background: Z.background, minHeight: '100%',
      color: Z.foreground,
    }}
    onClick={() => openMenu && setOpenMenu(null)}
    >
      <TopBar accent={ACCENT} activeNav="Bills"/>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '32px 32px 48px' }}>

        {/* Page header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 24,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.6 }}>
              Bills
            </h2>
            <div style={{
              marginTop: 5, fontSize: 13, color: Z.mutedFg,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontWeight: 500, color: Z.foreground }}>{filtered.length}</span>
              <span>records</span>
              {anyFilter && (
                <>
                  <span style={{ color: Z.border }}>·</span>
                  <span>
                    {filterPeriod !== 'last12' ? { last6: 'Last 6 months', last3: 'Last 3 months' }[filterPeriod] : 'Last 12 months'}
                    {filterProp !== 'all' && ` · ${PROPERTIES.find(p=>p.id===filterProp)?.short}`}
                    {filterSvc  !== 'all' && ` · ${SERVICES.find(s=>s.id===filterSvc)?.name}`}
                  </span>
                </>
              )}
            </div>
          </div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 34, padding: '0 16px', fontSize: 13.5, fontWeight: 500,
            background: ACCENT.solid, color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <BI.Plus c="#fff"/> Add bill
          </button>
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          background: Z.background,
          border: `1px solid ${Z.border}`,
          borderRadius: 8,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12.5, color: Z.mutedFg, paddingLeft: 2 }}>Filter</span>
          <SelectEl
            value={filterProp}
            onChange={v => { setFilterProp(v); setPage(1); }}
            options={[
              { value: 'all', label: 'All properties' },
              ...PROPERTIES.map(p => ({ value: p.id, label: p.short })),
            ]}
          />
          <SelectEl
            value={filterSvc}
            onChange={v => { setFilterSvc(v); setPage(1); }}
            options={[
              { value: 'all', label: 'All services' },
              ...SERVICES.map(s => ({ value: s.id, label: s.name })),
            ]}
          />
          <SelectEl
            value={filterPeriod}
            onChange={v => { setFilterPeriod(v); setPage(1); }}
            options={[
              { value: 'last12', label: 'Last 12 months' },
              { value: 'last6',  label: 'Last 6 months' },
              { value: 'last3',  label: 'Last 3 months' },
            ]}
          />
          <div style={{ flex: 1 }}/>
          {anyFilter && (
            <button
              onClick={() => { setFilterProp('all'); setFilterSvc('all'); setFilterPeriod('last12'); setPage(1); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12.5, color: Z.mutedFg, textDecoration: 'underline',
                padding: '0 4px', fontFamily: 'inherit',
              }}
            >Clear filters</button>
          )}
        </div>

        {/* Table card */}
        <div style={{
          background: Z.card,
          border: `1px solid ${Z.border}`,
          borderRadius: 8,
          boxShadow: '0 1px 2px 0 rgba(24, 24, 27, 0.05)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: Z.subtle }}>
              <tr>
                {[
                  { col: 'date',     label: 'Date',     align: 'left'  },
                  { col: 'property', label: 'Property', align: 'left'  },
                  { col: 'service',  label: 'Service',  align: 'left'  },
                  { col: 'period',   label: 'Period',   align: 'left'  },
                  { col: 'amount',   label: 'Amount',   align: 'right' },
                  { col: 'actions',  label: '',         align: 'right', nosort: true },
                ].map(h => (
                  <th
                    key={h.col}
                    onClick={h.nosort ? undefined : () => handleSort(h.col)}
                    style={{
                      ...thStyle(h.col, h.align),
                      ...(h.nosort ? { cursor: 'default', width: 48 } : {}),
                    }}
                  >
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      justifyContent: h.align === 'right' ? 'flex-end' : 'flex-start',
                    }}>
                      {h.label}
                      {!h.nosort && <SortIcon col={h.col}/>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, ri) => {
                const isLast = ri === pageRows.length - 1;
                return (
                  <BillRow
                    key={row.id}
                    row={row}
                    isLast={isLast}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    tdStyle={tdStyle}
                  />
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            borderTop: `1px solid ${Z.border}`,
            background: Z.subtle,
          }}>
            <div style={{ fontSize: 13.5 }}>
              <span style={{ color: Z.mutedFg }}>Total (filtered):</span>
              {' '}
              <span style={{
                fontWeight: 700, color: Z.destructive,
                fontFeatureSettings: '"tnum" 1',
                fontSize: 14,
              }}>
                −{total.toLocaleString('en-US')} UAH
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PageBtn
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <BI.ChevL/>
                </PageBtn>
                {pageRange().map((p, i) => (
                  p === '…'
                    ? <span key={`e${i}`} style={{ padding: '0 4px', color: Z.mutedFg, fontSize: 13 }}>…</span>
                    : <PageBtn key={p} active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
                ))}
                <PageBtn
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <BI.ChevR/>
                </PageBtn>
              </div>
              {/* Per-page */}
              <SelectEl
                value={String(perPage)}
                onChange={() => {}}
                options={[
                  { value: '25', label: '25 per page' },
                  { value: '50', label: '50 per page' },
                ]}
                style={{ minWidth: 100, fontSize: 12.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillRow({ row, isLast, openMenu, setOpenMenu, tdStyle }) {
  const [hover, setHover] = useSt(false);
  const menuOpen = openMenu === row.id;

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? Z.subtle : 'transparent', cursor: 'pointer' }}
    >
      <td style={{ ...tdStyle(), borderBottom: isLast ? 'none' : `1px solid ${Z.border}` }}>
        <span style={{ fontSize: 13.5, color: Z.foreground }}>{row.date}</span>
      </td>
      <td style={{ ...tdStyle(), borderBottom: isLast ? 'none' : `1px solid ${Z.border}` }}>
        <span style={{ fontSize: 13.5, color: Z.foreground }}>{row.property.name}</span>
      </td>
      <td style={{ ...tdStyle(), borderBottom: isLast ? 'none' : `1px solid ${Z.border}` }}>
        <ServiceBadge svc={row.service}/>
      </td>
      <td style={{ ...tdStyle(), borderBottom: isLast ? 'none' : `1px solid ${Z.border}` }}>
        <span style={{ fontSize: 13, color: Z.mutedFg }}>{row.period}</span>
      </td>
      <td style={{
        ...tdStyle('right'),
        borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
        fontFeatureSettings: '"tnum" 1',
        color: Z.destructive, fontWeight: 500,
      }}>
        {fmtAmt(row.amount)}
      </td>
      <td style={{
        ...tdStyle('right'),
        borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
        position: 'relative', width: 48,
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={e => { e.stopPropagation(); setOpenMenu(menuOpen ? null : row.id); }}
            style={{
              width: 28, height: 28, borderRadius: 5,
              border: `1px solid ${menuOpen ? Z.border : 'transparent'}`,
              background: menuOpen ? Z.muted : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <BI.MoreH/>
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 34,
              width: 130,
              background: Z.card,
              border: `1px solid ${Z.border}`,
              borderRadius: 6,
              boxShadow: '0 4px 16px rgba(9,9,11,0.10)',
              zIndex: 20, overflow: 'hidden',
            }}>
              {['Edit', 'Delete'].map((item, i) => (
                <button key={item} style={{
                  display: 'block', width: '100%',
                  padding: '9px 14px', textAlign: 'left',
                  fontSize: 13, fontFamily: 'inherit',
                  background: 'none',
                  border: 'none',
                  borderTop: i > 0 ? `1px solid ${Z.border}` : 'none',
                  color: item === 'Delete' ? Z.destructive : Z.foreground,
                  cursor: 'pointer',
                }}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        minWidth: 30, height: 30, borderRadius: 5,
        border: active ? `1px solid ${ACCENT.solid}` : `1px solid transparent`,
        background: active ? ACCENT.tintBg : 'transparent',
        color: active ? ACCENT.solid : disabled ? Z.border : Z.foreground,
        fontSize: 13, fontWeight: active ? 600 : 400,
        fontFamily: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px',
      }}
    >
      {children}
    </button>
  );
}

window.BillsList = BillsList;
window.ALL_BILLS = ALL_BILLS;
