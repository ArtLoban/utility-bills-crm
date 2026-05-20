/* global React */
// Bills list — Mobile card layout
// 390px viewport (iPhone 14 Pro width)

const { useState: useStM, useMemo: useMemoM } = React;
const { Z, ACCENTS, SERVICE_COLORS, SERVICE_ICONS, Icons } = window.UB;
const ACCENT_M = ACCENTS.violet;

// Reuse ALL_BILLS from bills-list.jsx (already on window via module scope — rebuild small set)
// We'll reference the global since both scripts share window scope.

const BI_M = {
  Plus:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>,
  Filter:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  ChevD:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={Z.mutedFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  ChevR:   (p) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke={p?.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  MoreH:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  ChevL:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  ChevRr:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  X:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  SortAmt: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>,
};

// Mobile topbar (simplified)
function MobileTopbar() {
  return (
    <div style={{
      height: 52, background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${Z.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 16px',
      position: 'sticky', top: 0, zIndex: 10,
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5,
          background: ACCENT_M.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
            <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}>UtilityBills</span>
      </div>
      {/* hamburger */}
      <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={Z.foreground} strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  );
}

// Filter sheet trigger (the visible "Filters" button on mobile)
function FilterTrigger({ activeCount, onOpen }) {
  return (
    <button
      onClick={onOpen}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 32, padding: '0 12px',
        fontSize: 13, fontWeight: 500,
        background: activeCount > 0 ? ACCENT_M.tintBg : Z.background,
        color: activeCount > 0 ? ACCENT_M.solid : Z.foreground,
        border: `1px solid ${activeCount > 0 ? ACCENT_M.tintBorder : Z.border}`,
        borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
      }}
    >
      <BI_M.Filter/>
      Filters
      {activeCount > 0 && (
        <span style={{
          minWidth: 16, height: 16, borderRadius: 999,
          background: ACCENT_M.solid, color: '#fff',
          fontSize: 10.5, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 4px',
        }}>{activeCount}</span>
      )}
    </button>
  );
}

// Bottom sheet for filters
function FilterSheet({ open, onClose, filters, setFilters }) {
  if (!open) return null;
  const SheetSelect = ({ label, value, onChange, options }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: Z.foreground, marginBottom: 6 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            appearance: 'none', WebkitAppearance: 'none',
            width: '100%', height: 38, padding: '0 32px 0 12px',
            fontSize: 14, fontFamily: 'inherit',
            color: Z.foreground, background: Z.background,
            border: `1px solid ${Z.border}`, borderRadius: 6,
          }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <BI_M.ChevD/>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.4)', zIndex: 20,
      }}/>
      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: Z.background,
        borderRadius: '14px 14px 0 0',
        zIndex: 21,
        padding: '0 16px 24px',
        boxShadow: '0 -8px 32px rgba(9,9,11,0.12)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: Z.border }}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 16px' }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Filters</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <BI_M.X/>
          </button>
        </div>
        <SheetSelect
          label="Property"
          value={filters.prop}
          onChange={v => setFilters(f => ({ ...f, prop: v }))}
          options={[
            { value: 'all', label: 'All properties' },
            { value: 'p1',  label: 'Apartment on Main St' },
            { value: 'p2',  label: "Mom's apartment" },
            { value: 'p3',  label: 'Summer house' },
          ]}
        />
        <SheetSelect
          label="Service"
          value={filters.svc}
          onChange={v => setFilters(f => ({ ...f, svc: v }))}
          options={[
            { value: 'all',         label: 'All services' },
            { value: 'electricity', label: 'Electricity' },
            { value: 'gas',         label: 'Gas' },
            { value: 'coldWater',   label: 'Cold water' },
            { value: 'hotWater',    label: 'Hot water' },
            { value: 'internet',    label: 'Internet' },
            { value: 'heating',     label: 'Heating' },
          ]}
        />
        <SheetSelect
          label="Period"
          value={filters.period}
          onChange={v => setFilters(f => ({ ...f, period: v }))}
          options={[
            { value: 'last12', label: 'Last 12 months' },
            { value: 'last6',  label: 'Last 6 months' },
            { value: 'last3',  label: 'Last 3 months' },
          ]}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={() => { setFilters({ prop:'all', svc:'all', period:'last12' }); onClose(); }}
            style={{
              flex: 1, height: 40, borderRadius: 8,
              background: Z.muted, color: Z.foreground,
              border: 'none', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Clear</button>
          <button
            onClick={onClose}
            style={{
              flex: 2, height: 40, borderRadius: 8,
              background: ACCENT_M.solid, color: '#fff',
              border: 'none', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Apply</button>
        </div>
      </div>
    </>
  );
}

// Bill card (the mobile row)
function BillCard({ row, isFirst }) {
  const color = SERVICE_COLORS[row.service.id] || Z.mutedFg;
  const Ic = SERVICE_ICONS[row.service.id];
  const [menuOpen, setMenuOpen] = useStM(false);
  return (
    <div style={{
      background: Z.card,
      border: `1px solid ${Z.border}`,
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(24,24,27,0.04)',
      padding: '14px 14px 14px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      position: 'relative',
    }}>
      {/* Service icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {Ic && <Ic size={18} stroke={color}/>}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', gap: 8,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
            {row.date.split(' ').slice(0,2).join(' ')} · {row.service.name}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 700, color: Z.destructive,
            fontFeatureSettings: '"tnum" 1', flexShrink: 0,
          }}>
            −{row.amount.toLocaleString()}
          </span>
        </div>
        <div style={{
          fontSize: 12, color: Z.mutedFg, marginTop: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {row.property.name} · {row.period}
          </span>
          <span style={{ color: Z.mutedFg, fontSize: 11.5, marginLeft: 4, flexShrink: 0 }}>UAH</span>
        </div>
      </div>

      {/* ⋮ menu */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
          style={{
            width: 28, height: 28, borderRadius: 5,
            border: `1px solid ${menuOpen ? Z.border : 'transparent'}`,
            background: menuOpen ? Z.muted : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <BI_M.MoreH/>
        </button>
        {menuOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 32,
            width: 120,
            background: Z.card, border: `1px solid ${Z.border}`,
            borderRadius: 6, boxShadow: '0 4px 16px rgba(9,9,11,0.10)',
            zIndex: 10, overflow: 'hidden',
          }}>
            {['Edit','Delete'].map((item, i) => (
              <button key={item} style={{
                display: 'block', width: '100%', padding: '9px 14px',
                textAlign: 'left', fontSize: 13, fontFamily: 'inherit',
                background: 'none', border: 'none',
                borderTop: i > 0 ? `1px solid ${Z.border}` : 'none',
                color: item === 'Delete' ? Z.destructive : Z.foreground,
                cursor: 'pointer',
              }}>{item}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Pagination strip (minimal — prev / page indicator / next)
function MobilePager({ page, total, perPage, onPrev, onNext }) {
  const totalPages = Math.ceil(total / perPage);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0 4px',
    }}>
      <button onClick={onPrev} disabled={page === 1} style={{
        width: 36, height: 36, borderRadius: 8,
        border: `1px solid ${Z.border}`, background: Z.background,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: page === 1 ? 'default' : 'pointer',
        opacity: page === 1 ? 0.4 : 1,
      }}><BI_M.ChevL/></button>
      <span style={{ fontSize: 13, color: Z.mutedFg }}>
        Page <strong style={{ color: Z.foreground }}>{page}</strong> of {totalPages}
      </span>
      <button onClick={onNext} disabled={page === totalPages} style={{
        width: 36, height: 36, borderRadius: 8,
        border: `1px solid ${Z.border}`, background: Z.background,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: page === totalPages ? 'default' : 'pointer',
        opacity: page === totalPages ? 0.4 : 1,
      }}><BI_M.ChevRr/></button>
    </div>
  );
}

function BillsListMobile() {
  const [filters, setFilters] = useStM({ prop:'all', svc:'all', period:'last12' });
  const [sheetOpen, setSheetOpen] = useStM(false);
  const [page, setPage] = useStM(1);
  const PER_PAGE = 10;

  const activeCount = [
    filters.prop !== 'all',
    filters.svc  !== 'all',
    filters.period !== 'last12',
  ].filter(Boolean).length;

  const filtered = useMemoM(() => {
    let rows = [...window.ALL_BILLS];
    if (filters.prop   !== 'all') rows = rows.filter(r => r.property.id === filters.prop);
    if (filters.svc    !== 'all') rows = rows.filter(r => r.service.id  === filters.svc);
    if (filters.period === 'last6') rows = rows.filter(r => r.periodSort >= 202410);
    if (filters.period === 'last3') rows = rows.filter(r => r.periodSort >= 202501);
    return rows;
  }, [filters]);

  const total = filtered.reduce((s, r) => s + r.amount, 0);
  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{
      width: 390, height: '100%',
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      background: '#f4f4f5',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scrollable inner */}
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <MobileTopbar/>

        <div style={{ padding: '20px 14px 32px' }}>
          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: 14,
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
                Bills
              </h2>
              <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 3 }}>
                <strong style={{ color: Z.foreground }}>{filtered.length}</strong> records
              </div>
            </div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 34, padding: '0 14px',
              fontSize: 13, fontWeight: 500,
              background: ACCENT_M.solid, color: '#fff',
              border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <BI_M.Plus/> Add
            </button>
          </div>

          {/* Filter trigger row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 14,
          }}>
            <FilterTrigger activeCount={activeCount} onOpen={() => setSheetOpen(true)}/>
            {/* Sort hint */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: Z.mutedFg,
            }}>
              <BI_M.SortAmt/> Date (newest)
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14,
            }}>
              {filters.prop !== 'all' && (
                <Chip label={{ p1:'Main St', p2:"Mom's", p3:'Summer house' }[filters.prop]} onRemove={() => setFilters(f=>({...f,prop:'all'}))}/>
              )}
              {filters.svc !== 'all' && (
                <Chip
                  label={{ electricity:'Electricity', gas:'Gas', coldWater:'Cold water', hotWater:'Hot water', internet:'Internet', heating:'Heating' }[filters.svc]}
                  color={SERVICE_COLORS[filters.svc]}
                  onRemove={() => setFilters(f=>({...f,svc:'all'}))}
                />
              )}
              {filters.period !== 'last12' && (
                <Chip label={{ last6:'Last 6 mo', last3:'Last 3 mo' }[filters.period]} onRemove={() => setFilters(f=>({...f,period:'last12'}))}/>
              )}
            </div>
          )}

          {/* Card list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pageRows.map(row => (
              <BillCard key={row.id} row={row}/>
            ))}
          </div>

          {/* Pagination */}
          <MobilePager
            page={page}
            total={filtered.length}
            perPage={PER_PAGE}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => Math.min(Math.ceil(filtered.length / PER_PAGE), p + 1))}
          />

          {/* Footer total */}
          <div style={{
            marginTop: 16, padding: '14px', borderRadius: 8,
            background: Z.card, border: `1px solid ${Z.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, color: Z.mutedFg }}>Total (filtered)</span>
            <span style={{
              fontSize: 15, fontWeight: 700, color: Z.destructive,
              fontFeatureSettings: '"tnum" 1',
            }}>
              −{total.toLocaleString()} UAH
            </span>
          </div>
        </div>
      </div>

      {/* Filter bottom sheet */}
      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}

function Chip({ label, color, onRemove }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 24, padding: '0 8px',
      background: color ? color + '18' : Z.muted,
      border: `1px solid ${color ? color + '30' : Z.border}`,
      borderRadius: 999, fontSize: 12, fontWeight: 500,
      color: Z.foreground,
    }}>
      {label}
      <button onClick={onRemove} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 0, display: 'flex', alignItems: 'center',
        color: Z.mutedFg, lineHeight: 1,
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

window.BillsListMobile = BillsListMobile;
