/* global React */
// Additional screens — Violet accent locked.
// Reuses primitives from dashboard.jsx via window.UB.

const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;
const { Z, ACCENTS, SERVICE_COLORS, SERVICE_ICONS, Icons, Icon, TopBar, Card, Button, Select } = window.UB;
const ACCENT = ACCENTS.violet;

// ----- Additional icons not in Icons -----
const MoreIcon = {
  Plus: (p) => <Icon size={p.size} stroke={p.stroke}><path d="M5 12h14M12 5v14"/></Icon>,
  House: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </Icon>
  ),
  Building: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
    </Icon>
  ),
  TreePine: Icons.TreePine,
  Users: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </Icon>
  ),
  Pencil: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
      <path d="m15 5 4 4"/>
    </Icon>
  ),
  Share: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M12 2v13"/><path d="m16 6-4-4-4 4"/>
      <path d="M20 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/>
    </Icon>
  ),
  MoreHorizontal: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
    </Icon>
  ),
  Lightbulb: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/><path d="M10 22h4"/>
    </Icon>
  ),
  ChevronRightSlash: (p) => <Icon d="m9 6 6 6-6 6" size={p.size} stroke={p.stroke}/>,
  Trash: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
    </Icon>
  ),
  Archive: (p) => (
    <Icon size={p.size} stroke={p.stroke}>
      <rect width="20" height="5" x="2" y="3" rx="1"/>
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>
    </Icon>
  ),
};

// ---------- Page chrome ----------
function PageShell({ children, activeNav = 'Properties' }) {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: Z.foreground,
      background: Z.background,
      minHeight: '100%',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <TopBar accent={ACCENT} activeNav={activeNav}/>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '32px 32px 48px' }}>
        {children}
      </div>
    </div>
  );
}

// ==============================================================
// SCREEN 1: Dashboard — empty state
// ==============================================================
function EmptyDashboard() {
  return (
    <PageShell activeNav="Dashboard">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.6 }}>
          Hello!
        </h2>
      </div>
      <EmptyStateCard
        icon={<MoreIcon.House size={40} stroke={Z.mutedFg}/>}
        title="Welcome to UtilityBills!"
        body={<>Start by adding your first property<br/>to track your utility bills.</>}
        cta={<Button variant="default" size="md" accent={ACCENT}>
          <MoreIcon.Plus size={15} stroke="#fff"/> Add property
        </Button>}
      />
    </PageShell>
  );
}

// Shared empty-state card
function EmptyStateCard({ icon, title, body, cta, hint }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
      <Card style={{
        maxWidth: 440, width: '100%',
        padding: '56px 32px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', gap: 18,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 16,
          background: Z.muted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{
            margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: -0.3,
            color: Z.foreground,
          }}>{title}</h3>
          <p style={{
            margin: '8px 0 0', fontSize: 14, color: Z.mutedFg, lineHeight: 1.5,
          }}>{body}</p>
        </div>
        {cta && <div style={{ marginTop: 4 }}>{cta}</div>}
        {hint && <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 8 }}>{hint}</div>}
      </Card>
    </div>
  );
}

// ==============================================================
// SCREEN 2: Properties list — full data
// ==============================================================
const PROPERTIES = [
  {
    id: 1, type: 'apartment', name: 'Apartment on Main St',
    address: 'Main St 15',
    services: 5, balance: -890, shared: false,
  },
  {
    id: 2, type: 'apartment', name: 'Mom\u2019s apartment',
    address: 'Shevchenka 28, apt. 12',
    services: 4, balance: -350, shared: false,
  },
  {
    id: 3, type: 'house', name: 'Brother\u2019s house',
    address: 'Village Hrebeni',
    services: 3, balance: 120, shared: true, role: 'Editor',
  },
];

const TYPE_ICON = {
  apartment: MoreIcon.Building,
  house:     MoreIcon.House,
  cottage:   Icons.TreePine,
  other:     MoreIcon.Building,
};

function PropertyCard({ p }) {
  const [hover, setHover] = useState2(false);
  const TypeIc = TYPE_ICON[p.type] || MoreIcon.House;
  const balanceColor = p.balance < 0 ? Z.destructive : p.balance > 0 ? Z.success : Z.mutedFg;
  const balanceText = p.balance === 0
    ? '0 UAH'
    : `${p.balance < 0 ? '−' : '+'}${Math.abs(p.balance).toLocaleString()} UAH`;
  return (
    <a href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block',
        background: Z.card,
        border: `1px solid ${Z.border}`,
        borderRadius: 8,
        padding: 24,
        textDecoration: 'none',
        boxShadow: hover
          ? '0 4px 8px -2px rgba(24, 24, 27, 0.08), 0 2px 4px -2px rgba(24, 24, 27, 0.05)'
          : '0 1px 2px 0 rgba(24, 24, 27, 0.05)',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
      }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: ACCENT.tintBg,
          border: `1px solid ${ACCENT.tintBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TypeIc size={20} stroke={ACCENT.solid}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15, fontWeight: 600, color: Z.foreground,
            letterSpacing: -0.2, marginBottom: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {p.name}
          </div>
          <div style={{ fontSize: 12.5, color: Z.mutedFg }}>{p.address}</div>
        </div>
      </div>

      {/* Meta row */}
      <div style={{
        marginTop: 16, paddingTop: 16,
        borderTop: `1px solid ${Z.border}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 12.5, color: Z.mutedFg }}>
          {p.services} services
        </span>
        {p.shared && (
          <>
            <span style={{ color: Z.border }}>·</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 500,
              padding: '2px 8px',
              background: Z.muted, color: Z.foreground,
              borderRadius: 999,
            }}>
              <MoreIcon.Users size={11} stroke={Z.foreground}/> Shared
            </span>
            <span style={{ fontSize: 12, color: Z.mutedFg }}>
              · Role: <span style={{ color: Z.foreground, fontWeight: 500 }}>{p.role}</span>
            </span>
          </>
        )}
      </div>

      {/* Balance */}
      <div style={{
        marginTop: 16, paddingTop: 16,
        borderTop: `1px solid ${Z.border}`,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: 11, color: Z.mutedFg, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4,
          }}>Balance</div>
          <div style={{
            fontSize: 22, fontWeight: 600, color: balanceColor,
            letterSpacing: -0.4, fontFeatureSettings: '"tnum" 1',
          }}>
            {balanceText}
          </div>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 13, fontWeight: 500,
          color: hover ? ACCENT.solid : Z.mutedFg,
          transition: 'color 120ms',
        }}>
          Open <Icons.ChevronRight size={14} stroke={hover ? ACCENT.solid : Z.mutedFg}/>
        </span>
      </div>
    </a>
  );
}

function PropertiesList({ empty }) {
  return (
    <PageShell activeNav="Properties">
      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 28,
      }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.6 }}>
          My Properties
        </h2>
        {!empty && (
          <Button variant="default" accent={ACCENT}>
            <MoreIcon.Plus size={14} stroke="#fff"/> Add property
          </Button>
        )}
      </div>

      {empty ? (
        <EmptyStateCard
          icon={<MoreIcon.House size={40} stroke={Z.mutedFg}/>}
          title="No properties yet"
          body={<>Add your first property to start<br/>tracking utility bills.</>}
          cta={<Button variant="default" size="md" accent={ACCENT}>
            <MoreIcon.Plus size={15} stroke="#fff"/> Add property
          </Button>}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {PROPERTIES.map(p => <PropertyCard key={p.id} p={p}/>)}
        </div>
      )}
    </PageShell>
  );
}

// ==============================================================
// SCREEN 4/5: Property detail
// ==============================================================
const DETAIL_PROPERTY = {
  name: 'Apartment on Main St',
  address: 'Main St 15',
  services: 5,
  created: 'Jan 2024',
};

const DETAIL_SERVICES = [
  {
    id: 'e', key: 'electricity', name: 'Electricity', provider: 'DTEK Kyiv Regional Grids',
    lastReading: 'Oct 15', balance: -400, metered: true,
  },
  {
    id: 'g', key: 'gas', name: 'Gas', provider: 'Naftogaz of Ukraine',
    lastReading: 'Oct 14', balance: 50, metered: true,
  },
  {
    id: 'cw', key: 'coldWater', name: 'Cold water', provider: 'Kyivvodokanal',
    lastReading: 'Oct 15', balance: -100, metered: true,
  },
  {
    id: 'hw', key: 'hotWater', name: 'Hot water', provider: 'Kyivteploenergo',
    lastReading: 'Oct 12', balance: -240, metered: true,
  },
  {
    id: 'i', key: 'internet', name: 'Internet', provider: 'Kyivstar',
    lastReading: null, balance: 0, metered: false,
  },
];

function Breadcrumbs() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 13, color: Z.mutedFg, marginBottom: 10,
    }}>
      <a href="#" style={{ color: Z.mutedFg, textDecoration: 'none' }}>Home</a>
      <MoreIcon.ChevronRightSlash size={14} stroke={Z.border}/>
      <span style={{ color: Z.foreground }}>Apartment on Main St</span>
    </div>
  );
}

function PropertyHeader({ onDeleteClick }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Breadcrumbs/>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.6,
            color: Z.foreground,
          }}>
            {DETAIL_PROPERTY.name}
          </h1>
          <div style={{
            marginTop: 6, fontSize: 13.5, color: Z.mutedFg,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>{DETAIL_PROPERTY.address}</span>
            <span>·</span>
            <span>{DETAIL_PROPERTY.services} services</span>
            <span>·</span>
            <span>Created {DETAIL_PROPERTY.created}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Button variant="outline" accent={ACCENT}>
            <MoreIcon.Pencil size={13} stroke={Z.foreground}/> Edit
          </Button>
          <Button variant="outline" accent={ACCENT}>
            <MoreIcon.Share size={13} stroke={Z.foreground}/> Share
          </Button>
          <MoreMenuButton onDeleteClick={onDeleteClick}/>
        </div>
      </div>
    </div>
  );
}

// More menu — popover triggered by the "…" button.
// Click-outside + Escape both close the menu.
function MoreMenuButton({ onDeleteClick }) {
  const [open, setOpen] = useState2(false);
  const wrapRef = useRef2(null);

  useEffect2(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          width: 32, height: 32, borderRadius: 6,
          border: `1px solid ${open ? Z.foreground : Z.border}`,
          background: open ? Z.muted : Z.background,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 120ms, border-color 120ms',
        }}
      >
        <MoreIcon.MoreHorizontal size={15} stroke={Z.foreground}/>
      </button>
      {open && (
        <div role="menu" style={{
          position: 'absolute', top: 38, right: 0, minWidth: 200,
          background: Z.background, border: `1px solid ${Z.border}`,
          borderRadius: 8, boxShadow: '0 10px 30px rgba(9,9,11,0.12), 0 2px 8px rgba(9,9,11,0.06)',
          padding: 4, zIndex: 30,
        }}>
          <MenuItem icon={<MoreIcon.Pencil size={14} stroke={Z.foreground}/>} label="Rename" onClick={() => setOpen(false)}/>
          <MenuItem icon={<MoreIcon.Archive size={14} stroke={Z.foreground}/>} label="Archive" onClick={() => setOpen(false)}/>
          <div style={{ height: 1, background: Z.border, margin: '4px 0' }}/>
          <MenuItem
            icon={<MoreIcon.Trash size={14} stroke={Z.destructive}/>}
            label="Delete property"
            destructive
            onClick={() => { setOpen(false); onDeleteClick && onDeleteClick(); }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, destructive, onClick }) {
  const [hover, setHover] = useState2(false);
  return (
    <button
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: '8px 10px',
        border: 'none', background: hover ? Z.muted : 'transparent',
        borderRadius: 6, cursor: 'pointer', textAlign: 'left',
        fontSize: 13.5, fontWeight: 500, fontFamily: 'inherit',
        color: destructive ? Z.destructive : Z.foreground,
        transition: 'background 100ms',
      }}
    >
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Tabs({ value, onChange, items }) {
  return (
    <div style={{
      display: 'inline-flex', padding: 3,
      background: Z.muted, border: `1px solid ${Z.border}`, borderRadius: 8,
      marginBottom: 20,
    }}>
      {items.map(t => {
        const active = value === t.k;
        return (
          <button
            key={t.k}
            onClick={() => onChange(t.k)}
            style={{
              padding: '6px 14px', fontSize: 13, fontWeight: active ? 500 : 400,
              border: 'none', borderRadius: 5, cursor: 'pointer',
              background: active ? Z.background : 'transparent',
              color: active ? Z.foreground : Z.mutedFg,
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              fontFamily: 'inherit',
              transition: 'background 120ms',
            }}
          >{t.label}</button>
        );
      })}
    </div>
  );
}

function ServiceRow({ s, isLast }) {
  const [hover, setHover] = useState2(false);
  const Ic = SERVICE_ICONS[s.key] || Icons.Zap;
  const color = SERVICE_COLORS[s.key];
  const balColor = s.balance < 0 ? Z.destructive : s.balance > 0 ? Z.success : Z.mutedFg;
  const balText = s.balance === 0
    ? '0 UAH'
    : `${s.balance < 0 ? '−' : '+'}${Math.abs(s.balance).toLocaleString()} UAH`;
  return (
    <a href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '18px 24px',
        borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
        background: hover ? Z.subtle : 'transparent',
        textDecoration: 'none',
        transition: 'background 120ms',
      }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: color + '1A', // 10% opacity
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Ic size={18} stroke={color}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14.5, fontWeight: 600, color: Z.foreground,
          letterSpacing: -0.1, marginBottom: 2,
        }}>
          {s.name}
        </div>
        <div style={{ fontSize: 12.5, color: Z.mutedFg }}>
          {s.provider}
          {s.metered && s.lastReading && <> · Last reading: {s.lastReading}</>}
          {!s.metered && <> · No meter</>}
        </div>
      </div>
      <div style={{
        fontSize: 15, fontWeight: 600, color: balColor,
        fontFeatureSettings: '"tnum" 1',
      }}>
        {balText}
      </div>
      <Icons.ChevronRight size={16} stroke={hover ? ACCENT.solid : Z.mutedFg}/>
    </a>
  );
}

function PropertyDetail({ empty }) {
  const [tab, setTab] = useState2('overview');
  const [deleteOpen, setDeleteOpen] = useState2(false);

  // Close on Escape
  useEffect2(() => {
    if (!deleteOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setDeleteOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [deleteOpen]);

  return (
    <PageShell activeNav="Properties">
      <PropertyHeader onDeleteClick={() => setDeleteOpen(true)}/>
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { k: 'overview', label: 'Overview' },
          { k: 'meters',   label: 'Meters' },
          { k: 'sharing',  label: 'Sharing' },
        ]}
      />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: `1px solid ${Z.border}`,
        }}>
          <div>
            <h3 style={{
              margin: 0, fontSize: 14, fontWeight: 600, color: Z.foreground,
              letterSpacing: -0.1,
            }}>
              Services on this property
            </h3>
            {!empty && (
              <p style={{ margin: '2px 0 0', fontSize: 12, color: Z.mutedFg }}>
                {DETAIL_SERVICES.length} services · Tap a row to open
              </p>
            )}
          </div>
          {!empty && (
            <Button variant="outline" accent={ACCENT}>
              <MoreIcon.Plus size={13} stroke={Z.foreground}/> Add service
            </Button>
          )}
        </div>

        {empty ? (
          <div style={{ padding: '48px 24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              maxWidth: 380, display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center', gap: 16,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 14,
                background: Z.muted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MoreIcon.Lightbulb size={32} stroke={Z.mutedFg}/>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: -0.3 }}>
                  No services yet
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: 13.5, color: Z.mutedFg, lineHeight: 1.5 }}>
                  Add services like electricity, water, or gas<br/>to start tracking bills.
                </p>
              </div>
              <Button variant="default" size="md" accent={ACCENT}>
                <MoreIcon.Plus size={15} stroke="#fff"/> Add service
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {DETAIL_SERVICES.map((s, i) => (
              <ServiceRow key={s.id} s={s} isLast={i === DETAIL_SERVICES.length - 1}/>
            ))}
          </div>
        )}
      </Card>

      {deleteOpen && (
        <DeletePropertyOverlay
          onCancel={() => setDeleteOpen(false)}
          onConfirm={() => setDeleteOpen(false)}
        />
      )}
    </PageShell>
  );
}

// ---------- Delete property: backdrop + ConfirmDialog ----------
function DeletePropertyOverlay({ onCancel, onConfirm }) {
  const CD = window.ConfirmDialog;
  if (!CD) return null;
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        background: 'rgba(9,9,11,0.5)', backdropFilter: 'blur(2px)',
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <CD
          title="Delete property?"
          tone="destructive"
          icon={<MoreIcon.Trash size={28}/>}
          description={<>Delete <strong>{DETAIL_PROPERTY.name}</strong>?</>}
          secondaryText={
            <>You'll be able to restore it within 30 days. After that, all <strong>{DETAIL_SERVICES.length} services</strong>, readings, bills, and payments are removed permanently.</>
          }
          confirmLabel="Delete property"
          confirmIcon={<MoreIcon.Trash size={14} stroke="#fff"/>}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onClose={onCancel}
        />
      </div>
    </div>
  );
}

// ---------- Exports ----------
window.EmptyDashboard = EmptyDashboard;
window.PropertiesList = PropertiesList;
window.PropertyDetail = PropertyDetail;
