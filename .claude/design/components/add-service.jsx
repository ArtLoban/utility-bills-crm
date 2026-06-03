/* global React */
// Add Service wizard — full-page form at /properties/[id]/services/new
// Light theme · desktop only.
//
// Renders one of four snapshot states via the `state` prop:
//   'empty'       — page just opened, no service type selected, sections 2–4 dimmed
//   'metered'     — Electricity picked, contract+tariff partially filled, Meter offered but off,
//                   form-level error after submit shown above sections
//   'fixed'       — Internet picked, contract+fixed-amount filled, Meter section absent
//   'meterFilled' — Electricity picked + Meter engaged (2 zones), tariff per zone, fully filled

// ── Tokens (Zinc + Violet, light only) ──────────────────────────────────────
const ASZ = {
  background: '#ffffff',
  page: '#fafafa',
  foreground: '#09090b',
  card: '#ffffff',
  muted: '#f4f4f5',
  mutedFg: '#71717a',
  mutedFg2: '#52525b',
  border: '#e4e4e7',
  subtle: '#fafafa',
  destructive: '#dc2626',
  destructiveBg: '#fef2f2',
  destructiveBd: '#fecaca',
  warning: '#d97706',
  warningBg: '#fffbeb',
  warningBd: '#fde68a'
};
const ASA = {
  solid: '#7c3aed',
  solidHover: '#6d28d9',
  tintBg: '#f5f3ff',
  tintBorder: '#ede9fe'
};

// ── Service catalog (11 types) ──────────────────────────────────────────────
const AS_SERVICES = [
{ id: 'electricity', name: 'Electricity', color: '#f59e0b', measurement: 'metered', supportsZones: true, unit: 'kWh', rateUnit: '₴/kWh' },
{ id: 'gas', name: 'Gas', color: '#ef4444', measurement: 'metered', supportsZones: false, unit: 'm³', rateUnit: '₴/m³' },
{ id: 'coldWater', name: 'Cold water', color: '#3b82f6', measurement: 'metered', supportsZones: false, unit: 'm³', rateUnit: '₴/m³' },
{ id: 'hotWater', name: 'Hot water', color: '#ec4899', measurement: 'metered', supportsZones: false, unit: 'm³', rateUnit: '₴/m³' },
{ id: 'heating', name: 'Heating', color: '#8b5cf6', measurement: 'metered', supportsZones: false, unit: 'Gcal', rateUnit: '₴/Gcal' },
{ id: 'maintenance', name: 'Maintenance', color: '#64748b', measurement: 'fixed' },
{ id: 'garbage', name: 'Garbage', color: '#65a30d', measurement: 'fixed' },
{ id: 'internet', name: 'Internet', color: '#14b8a6', measurement: 'fixed' },
{ id: 'intercom', name: 'Intercom', color: '#6366f1', measurement: 'fixed' },
{ id: 'hoa', name: 'HOA fees', color: '#a855f7', measurement: 'fixed' },
{ id: 'gasDelivery', name: 'Gas delivery', color: '#f97316', measurement: 'fixed' }];

const AS_BY_ID = Object.fromEntries(AS_SERVICES.map((s) => [s.id, s]));

// ── Service icons (paths only) ──────────────────────────────────────────────
const AS_ICONS = {
  electricity: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  gas: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  coldWater: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />,
  hotWater: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />,
  heating: <React.Fragment><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></React.Fragment>,
  maintenance: <React.Fragment><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4M10 10h4M10 14h4M10 18h4" /></React.Fragment>,
  garbage: <React.Fragment><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M10 11v6M14 11v6" /></React.Fragment>,
  internet: <React.Fragment><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /></React.Fragment>,
  intercom: <React.Fragment><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /><path d="M4 2C2.8 3.7 2 5.7 2 8" /><path d="M22 8c0-2.3-.8-4.3-2-6" /></React.Fragment>,
  hoa: <React.Fragment><line x1="3" x2="21" y1="22" y2="22" /><line x1="6" x2="6" y1="18" y2="11" /><line x1="10" x2="10" y1="18" y2="11" /><line x1="14" x2="14" y1="18" y2="11" /><line x1="18" x2="18" y1="18" y2="11" /><polygon points="12 2 20 7 4 7" /></React.Fragment>,
  gasDelivery: <React.Fragment><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" /><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></React.Fragment>
};

// ── Lucide-style svg helper ─────────────────────────────────────────────────
const ASvg = ({ size = 16, stroke = 'currentColor', strokeWidth = 1.75, children, style }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>;


// ── UI icons used in chrome (not the service catalog) ──────────────────────
const ASIc = {
  Logo: (p) => <ASvg {...p}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></ASvg>,
  Globe: (p) => <ASvg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></ASvg>,
  Moon: (p) => <ASvg {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></ASvg>,
  ChevR: (p) => <ASvg {...p}><path d="m9 18 6-6-6-6" /></ASvg>,
  ChevD: (p) => <ASvg {...p}><path d="m6 9 6 6 6-6" /></ASvg>,
  ChevL: (p) => <ASvg {...p}><path d="m15 18-6-6 6-6" /></ASvg>,
  Cal: (p) => <ASvg {...p}><path d="M8 2v4M16 2v4M3 10h18" /><rect width="18" height="18" x="3" y="4" rx="2" /></ASvg>,
  Plus: (p) => <ASvg {...p}><path d="M5 12h14M12 5v14" /></ASvg>,
  Check: (p) => <ASvg {...p}><path d="M20 6 9 17l-5-5" /></ASvg>,
  Warn: (p) => <ASvg {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" /></ASvg>,
  Info: (p) => <ASvg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></ASvg>,
  Gauge: (p) => <ASvg {...p}><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></ASvg>,
  Trash: (p) => <ASvg {...p}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></ASvg>
};

// ──────────────────────────────────────────────────────────────────────────────
// Chrome
// ──────────────────────────────────────────────────────────────────────────────

function ASTopBar() {
  const nav = ['Dashboard', 'Properties', 'Bills', 'Payments', 'Settings'];
  const active = 'Properties';
  const iconBtn = {
    width: 32, height: 32, borderRadius: 6, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 'none', cursor: 'pointer'
  };
  return (
    <div style={{
      height: 64, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${ASZ.border}`,
      display: 'flex', alignItems: 'center', padding: '0 32px',
      position: 'sticky', top: 0, zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 40 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6, background: ASA.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ASIc.Logo size={15} stroke="#fff" />
        </div>
        <span style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1 }}>UtilityBills</span>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
        {nav.map((item) => {
          const isActive = item === active;
          return (
            <a key={item} href="#" style={{
              position: 'relative', padding: '8px 12px',
              fontSize: 13.5, fontWeight: isActive ? 500 : 400,
              color: isActive ? ASZ.foreground : ASZ.mutedFg,
              textDecoration: 'none', borderRadius: 6
            }}>
              {item}
              {isActive &&
              <span style={{
                position: 'absolute', left: 12, right: 12, bottom: -1,
                height: 2, background: ASA.solid, borderRadius: 2
              }} />
              }
            </a>);

        })}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button style={iconBtn}><ASIc.Globe size={16} stroke={ASZ.mutedFg} /></button>
        <button style={iconBtn}><ASIc.Moon size={16} stroke={ASZ.mutedFg} /></button>
        <div style={{ width: 1, height: 20, background: ASZ.border, margin: '0 8px' }} />
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, height: 36,
          padding: '0 4px 0 8px', background: 'transparent',
          border: 'none', borderRadius: 18, cursor: 'pointer'
        }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Anna</span>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: ASA.tintBg, color: ASA.solid,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600,
            border: `1px solid ${ASA.tintBorder}`
          }}>AL</div>
        </button>
      </div>
    </div>);

}

function ASBreadcrumb() {
  const items = [
  { label: 'Properties', href: '#' },
  { label: 'Apartment on Main St', href: '#' },
  { label: 'Add service' }];

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 13, color: ASZ.mutedFg, marginBottom: 12, flexWrap: 'wrap'
    }}>
      {items.map((it, i) =>
      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <ASIc.ChevR size={12} stroke={ASZ.border} />}
          {it.href ?
        <a href={it.href} style={{ color: ASZ.mutedFg, textDecoration: 'none' }}>{it.label}</a> :
        <span style={{ color: ASZ.foreground, fontWeight: 500 }}>{it.label}</span>}
        </span>
      )}
    </nav>);

}

// ──────────────────────────────────────────────────────────────────────────────
// Form primitives
// ──────────────────────────────────────────────────────────────────────────────

function ASLabel({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: 'block', fontSize: 13, fontWeight: 500,
      color: ASZ.foreground, marginBottom: 6
    }}>
      {children}
      {optional && <span style={{ fontWeight: 400, color: ASZ.mutedFg, marginLeft: 4 }}>(optional)</span>}
    </label>);

}

function ASInput({ value, placeholder, filled, disabled, suffix, mono, style }) {
  const border = filled ? ASA.tintBorder : ASZ.border;
  const bg = filled ? ASA.tintBg : disabled ? ASZ.subtle : ASZ.background;
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        readOnly
        value={value || ''}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%', height: 36,
          padding: suffix ? '0 44px 0 12px' : '0 12px',
          fontSize: 14, color: disabled ? ASZ.mutedFg : ASZ.foreground,
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 6,
          fontWeight: filled ? 500 : 400,
          fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
          fontFeatureSettings: '"tnum" 1',
          outline: 'none',
          ...style
        }} />
      
      {suffix &&
      <div style={{ position: 'absolute', right: 12, pointerEvents: 'none', color: ASZ.mutedFg, fontSize: 12 }}>
          {suffix}
        </div>
      }
    </div>);

}

function ASTextarea({ value, placeholder, filled, disabled, rows = 3 }) {
  return (
    <textarea
      readOnly
      value={value || ''}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      style={{
        width: '100%', padding: '9px 12px',
        fontSize: 14, color: disabled ? ASZ.mutedFg : ASZ.foreground,
        background: filled ? ASA.tintBg : disabled ? ASZ.subtle : ASZ.background,
        border: `1px solid ${filled ? ASA.tintBorder : ASZ.border}`,
        borderRadius: 6, resize: 'vertical', lineHeight: 1.5,
        fontWeight: filled ? 500 : 400, outline: 'none',
        fontFamily: 'inherit'
      }} />);


}

function ASSelect({ value, filled, disabled, options, placeholder }) {
  const valLabel = options.find((o) => o.value === value)?.label;
  const display = valLabel || placeholder || 'Select…';
  const isPlaceholder = !valLabel;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', height: 36, padding: '0 12px',
      fontSize: 14,
      color: isPlaceholder ? ASZ.mutedFg : disabled ? ASZ.mutedFg : ASZ.foreground,
      background: filled ? ASA.tintBg : disabled ? ASZ.subtle : ASZ.background,
      border: `1px solid ${filled ? ASA.tintBorder : ASZ.border}`,
      borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: filled ? 500 : 400
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{display}</span>
      <ASIc.ChevD size={12} stroke={ASZ.mutedFg} />
    </div>);

}

function ASDate({ value, filled, disabled, placeholder }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      width: '100%', height: 36, padding: '0 12px',
      fontSize: 14,
      color: value ? disabled ? ASZ.mutedFg : ASZ.foreground : ASZ.mutedFg,
      background: filled ? ASA.tintBg : disabled ? ASZ.subtle : ASZ.background,
      border: `1px solid ${filled ? ASA.tintBorder : ASZ.border}`,
      borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: filled ? 500 : 400
    }}>
      <ASIc.Cal size={14} stroke={ASZ.mutedFg} />
      <span>{value || placeholder || 'Pick a date'}</span>
    </div>);

}

function ASHint({ children, tone = 'muted' }) {
  const color = tone === 'warning' ? ASZ.warning : tone === 'success' ? '#16a34a' : ASZ.mutedFg;
  return (
    <div style={{
      marginTop: 6, fontSize: 12.5, color, lineHeight: 1.45,
      display: 'flex', alignItems: 'flex-start', gap: 6
    }}>
      {tone === 'warning' && <ASIc.Warn size={13} stroke={ASZ.warning} style={{ flexShrink: 0, marginTop: 1 }} />}
      <span>{children}</span>
    </div>);

}

// ──────────────────────────────────────────────────────────────────────────────
// Service catalog grid (Section 1)
// ──────────────────────────────────────────────────────────────────────────────

// Color rules:
//   default  → no service color, all neutral zinc
//   selected → service's own brand color (border, tint, icon, check accent)
//   added    → disabled, neutral, with a small "Added" pill (the service
//              already exists on this property and can't be added again)
function ASServiceCard({ svc, selected, added }) {
  const path = AS_ICONS[svc.id];
  const c = svc.color;

  let cardBorder, cardBg, iconBoxBg, iconBoxBorder, iconStroke, nameColor, subColor;
  if (added) {
    cardBorder = ASZ.border;
    cardBg = ASZ.subtle;
    iconBoxBg = ASZ.muted;
    iconBoxBorder = ASZ.border;
    iconStroke = '#d4d4d8'; // zinc-300
    nameColor = '#a1a1aa'; // zinc-400
    subColor = '#d4d4d8';
  } else if (selected) {
    cardBorder = c;
    cardBg = c + '0E';
    iconBoxBg = c + '20';
    iconBoxBorder = c + '38';
    iconStroke = c;
    nameColor = ASZ.foreground;
    subColor = ASZ.mutedFg;
  } else {
    cardBorder = ASZ.border;
    cardBg = ASZ.background;
    iconBoxBg = ASZ.muted;
    iconBoxBorder = ASZ.border;
    iconStroke = '#52525b'; // zinc-600
    nameColor = ASZ.foreground;
    subColor = ASZ.mutedFg;
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 14px',
      borderRadius: 8, cursor: added ? 'not-allowed' : 'pointer',
      border: `1.5px solid ${cardBorder}`,
      background: cardBg,
      transition: 'border-color 120ms, background 120ms'
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: iconBoxBg,
        border: `1px solid ${iconBoxBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <ASvg size={18} stroke={iconStroke}>{path}</ASvg>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1,
          color: nameColor, marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>{svc.name}</div>
        <div style={{
          fontSize: 11.5, color: subColor,
          textTransform: 'uppercase', letterSpacing: 0.3, fontWeight: 500
        }}>
          {svc.measurement === 'metered' ?
          svc.supportsZones ? 'Metered · zones' : `Metered · ${svc.unit}` :
          'Fixed amount'}
        </div>
      </div>
      {added &&
      <span style={{
        position: 'absolute',
        top: -9, right: 12,
        padding: '2px 8px',
        fontSize: 10.5, fontWeight: 600,
        color: '#52525b', // zinc-600 — darker than the disabled card
        background: '#e4e4e7', // zinc-200
        borderRadius: 999,
        letterSpacing: 0.2,
        // White outline ring so the pill reads cleanly while overlapping
        // the card border.
        boxShadow: `0 0 0 2px ${ASZ.background}`, margin: "4px -16px 0px 0px"
      }}>Added</span>
      }
      {selected && !added &&
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: c,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
          <ASIc.Check size={11} stroke="#fff" strokeWidth={3} />
        </div>
      }
    </div>);

}

function ASServiceGrid({ selectedId, addedIds = [] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10
    }}>
      {AS_SERVICES.map((s) =>
      <ASServiceCard
        key={s.id} svc={s}
        selected={selectedId === s.id}
        added={addedIds.includes(s.id)} />

      )}
    </div>);

}

// (legacy tile experiment removed)

// ──────────────────────────────────────────────────────────────────────────────
// Section wrapper
// ──────────────────────────────────────────────────────────────────────────────

function ASSection({ n, title, desc, inactive, children, accent }) {
  return (
    <section style={{
      background: ASZ.card,
      border: `1px solid ${inactive ? ASZ.border : ASZ.border}`,
      borderRadius: 8,
      boxShadow: inactive ? 'none' : '0 1px 2px rgba(24,24,27,0.04)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '20px 28px 16px'
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: inactive ? ASZ.muted : accent ? accent + '18' : ASA.tintBg,
          border: `1px solid ${inactive ? ASZ.border : accent ? accent + '30' : ASA.tintBorder}`,
          color: inactive ? ASZ.mutedFg : accent || ASA.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
          fontFeatureSettings: '"tnum" 1'
        }}>
          {String(n).padStart(2, '0')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: -0.2,
            color: ASZ.foreground
          }}>{title}</h2>
          <p style={{
            margin: '3px 0 0', fontSize: 13, color: ASZ.mutedFg, lineHeight: 1.45
          }}>{desc}</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: ASZ.border, margin: '0 28px' }} />

      {/* Body */}
      <div style={{
        padding: '20px 28px 24px',
        opacity: inactive ? 0.45 : 1,
        pointerEvents: inactive ? 'none' : 'auto'
      }}>
        {children}
      </div>
    </section>);

}

// ──────────────────────────────────────────────────────────────────────────────
// Form-level error banner (post-submit)
// ──────────────────────────────────────────────────────────────────────────────

function ASFormError({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 18px',
      background: ASZ.destructiveBg,
      border: `1px solid ${ASZ.destructiveBd}`,
      borderRadius: 8,
      marginBottom: 16
    }}>
      <ASIc.Warn size={18} stroke={ASZ.destructive} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 600, color: '#7f1d1d', marginBottom: 2
        }}>Couldn't create service</div>
        <div style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>);

}

// ──────────────────────────────────────────────────────────────────────────────
// Per-section bodies
// ──────────────────────────────────────────────────────────────────────────────

// — Section 2: Initial contract —
function ASContractBody({ values = {}, filled, providerEmpty }) {
  const PROVIDERS = [
  { value: '', label: 'Select a provider…' },
  { value: 'p1', label: 'ДТЕК Київські електромережі' },
  { value: 'p2', label: 'Нафтогаз України' },
  { value: 'p3', label: 'Київводоканал' },
  { value: 'p4', label: 'Київтеплоенерго' },
  { value: 'p5', label: 'Київстар Home Internet' }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <ASLabel>Provider</ASLabel>
        {providerEmpty ?

        <>
              <ASSelect placeholder="No providers yet" options={[]} disabled />
              <div style={{
            marginTop: 8,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 12px',
            background: ASA.tintBg, border: `1px solid ${ASA.tintBorder}`,
            borderRadius: 6
          }}>
                <ASIc.Info size={15} stroke={ASA.solid} style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: ASZ.foreground, lineHeight: 1.5 }}>
                    You don't have any providers yet. Add one on the{' '}
                    <a href="#" style={{ color: ASA.solid, fontWeight: 500, textDecoration: 'underline' }}>Providers page</a>
                    {' '}first, then return here.
                  </div>
                </div>
              </div>
            </> :

        <ASSelect value={values.provider} filled={filled} options={PROVIDERS} />
        }
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <ASLabel>Contract start date</ASLabel>
          <ASDate value={values.startDate} filled={filled} />
        </div>
        <div>
          <ASLabel optional>Account number</ASLabel>
          <ASInput value={values.account} placeholder="e.g. 123456789" filled={filled} mono />
        </div>
      </div>

      <div>
        <ASLabel optional>Contract notes</ASLabel>
        <ASTextarea value={values.notes} placeholder="Anything worth remembering about this agreement…" filled={filled} />
      </div>
    </div>);

}

// — Section 3: Initial tariff — adaptive —
function ASTariffBody({ svc, values = {}, filled }) {
  if (!svc) {
    // Inactive — show fields in their default shape (a single rate slot).
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <ASLabel>Rate</ASLabel>
          <ASInput placeholder="0.00" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><ASLabel>Tariff start date</ASLabel><ASDate placeholder="Pick a date" /></div>
          <div><ASLabel optional>Tariff notes</ASLabel><ASInput placeholder="Optional" /></div>
        </div>
      </div>);

  }
  if (svc.measurement === 'fixed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <ASLabel>Monthly amount</ASLabel>
          <ASInput value={values.fixedAmount} placeholder="e.g. 480" filled={filled} suffix="UAH" />
          <ASHint>A flat amount billed each month regardless of usage.</ASHint>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <ASLabel>Tariff start date</ASLabel>
            <ASDate value={values.startDate} filled={filled} />
          </div>
          <div>
            <ASLabel optional>Tariff notes</ASLabel>
            <ASInput value={values.notes} placeholder="e.g. promo period" filled={filled} />
          </div>
        </div>
      </div>);

  }

  // metered
  const zones = values.zones || 1;
  const rates = values.rates || [];
  const zoneLabels = (z) => {
    if (z === 1) return ['Single rate'];
    if (z === 2) return ['T1 — Day', 'T2 — Night'];
    return ['T1 — Peak', 'T2 — Shoulder', 'T3 — Off-peak'];
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <ASLabel>
          {zones === 1 ? 'Rate' : 'Rates per zone'}
        </ASLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(zones, 1)}, 1fr)`,
          gap: 10
        }}>
          {Array.from({ length: zones }).map((_, i) => {
            const label = zoneLabels(zones)[i];
            return (
              <div key={i}>
                <div style={{
                  fontSize: 11.5, color: ASZ.mutedFg, marginBottom: 4,
                  fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.3
                }}>{label}</div>
                <ASInput
                  value={rates[i]}
                  placeholder="0.00"
                  filled={filled}
                  suffix={svc.rateUnit} />
                
              </div>);

          })}
        </div>
        {svc.supportsZones &&
        <ASHint>
            {zones === 1 ?
          'Add a meter below if you bill by day/night or three-zone tariff.' :
          `Rates apply per zone. Zone count comes from the meter section below.`}
          </ASHint>
        }
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <ASLabel>Tariff start date</ASLabel>
          <ASDate value={values.startDate} filled={filled} />
        </div>
        <div>
          <ASLabel optional>Tariff notes</ASLabel>
          <ASInput value={values.notes} placeholder="e.g. new rates from Apr 1" filled={filled} />
        </div>
      </div>
    </div>);

}

// — Section 4: Meter (optional) —
function ASMeterEngagementRow({ engaged }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px',
      background: engaged ? ASA.tintBg : ASZ.subtle,
      border: `1px solid ${engaged ? ASA.tintBorder : ASZ.border}`,
      borderRadius: 8
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: engaged ? ASA.solid + '14' : ASZ.muted,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ASIc.Gauge size={16} stroke={engaged ? ASA.solid : ASZ.mutedFg} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: ASZ.foreground }}>
            Track readings with a meter
          </div>
          <div style={{ fontSize: 12.5, color: ASZ.mutedFg, marginTop: 1 }}>
            Recommended when bills depend on usage. You can add a meter later.
          </div>
        </div>
      </div>
      {/* Switch */}
      <div style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: engaged ? ASA.solid : ASZ.border,
        position: 'relative', transition: 'background 120ms'
      }}>
        <div style={{
          position: 'absolute', top: 2, left: engaged ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 2px rgba(24,24,27,0.18)',
          transition: 'left 120ms'
        }} />
      </div>
    </div>);

}

function ASZoneSelector({ value, supportsZones, filled }) {
  if (!supportsZones) {
    // Lock to 1 zone — show a read-only summary row.
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: ASZ.subtle, border: `1px solid ${ASZ.border}`,
        borderRadius: 6
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: ASA.solid
        }} />
        <span style={{ fontSize: 13, color: ASZ.foreground }}>Single zone</span>
        <span style={{ fontSize: 12, color: ASZ.mutedFg }}>· this service is billed at one rate</span>
      </div>);

  }
  const opts = [
  { v: 1, label: '1 zone', sub: 'Flat rate' },
  { v: 2, label: '2 zones', sub: 'Day / Night' },
  { v: 3, label: '3 zones', sub: 'Peak / Shoulder / Off-peak' }];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      padding: 4, background: ASZ.subtle,
      border: `1px solid ${ASZ.border}`, borderRadius: 8
    }}>
      {opts.map((o) => {
        const active = o.v === value;
        return (
          <div key={o.v} style={{
            padding: '10px 12px', borderRadius: 6, cursor: 'pointer',
            background: active ? filled ? ASA.solid : ASZ.background : 'transparent',
            border: active && !filled ? `1px solid ${ASZ.border}` : '1px solid transparent',
            boxShadow: active && !filled ? '0 1px 2px rgba(24,24,27,0.04)' : 'none',
            textAlign: 'center',
            transition: 'background 120ms'
          }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: active && filled ? '#fff' : ASZ.foreground,
              letterSpacing: -0.1
            }}>{o.label}</div>
            <div style={{
              fontSize: 11, marginTop: 2,
              color: active && filled ? 'rgba(255,255,255,0.85)' : ASZ.mutedFg
            }}>{o.sub}</div>
          </div>);

      })}
    </div>);

}

function ASMeterBody({ svc, values = {}, filled, engaged }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ASMeterEngagementRow engaged={engaged} />

      {engaged &&
      <>
          <div>
            <ASLabel>Number of zones</ASLabel>
            <ASZoneSelector value={values.zones || 1} supportsZones={!!svc?.supportsZones} filled={filled} />
            {svc?.supportsZones &&
          <ASHint>Changes here update the rate inputs in the tariff section above.</ASHint>
          }
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <ASLabel optional>Serial number</ASLabel>
              <ASInput value={values.serial} placeholder="e.g. NIK-12345" filled={filled} mono />
              <ASHint>Often printed on the meter face. Skip if unknown.</ASHint>
            </div>
            <div>
              <ASLabel optional>Installation date</ASLabel>
              <ASDate value={values.installedAt} filled={filled} placeholder="When it was installed" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <ASLabel>Meter active since</ASLabel>
              <ASDate value={values.activeFrom} filled={filled} />
              <ASHint>Readings before this date are not tracked.</ASHint>
            </div>
            <div>
              <ASLabel optional>Meter notes</ASLabel>
              <ASInput value={values.notes} placeholder="e.g. located on landing" filled={filled} />
            </div>
          </div>
        </>
      }
    </div>);

}

// ──────────────────────────────────────────────────────────────────────────────
// State configs — one per snapshot
// ──────────────────────────────────────────────────────────────────────────────

const AS_STATES = {
  empty: {
    label: 'Empty start',
    selected: null,
    addedIds: ['gas', 'coldWater'],
    showError: false,
    contract: {},
    tariff: {},
    meter: { engaged: false }
  },
  metered: {
    label: 'Metered service · partially filled',
    selected: 'electricity',
    addedIds: ['gas', 'coldWater'],
    showError: true,
    contract: {
      provider: 'p1',
      startDate: 'Apr 1, 2026',
      account: '123456789',
      notes: ''
    },
    tariff: {
      zones: 1,
      rates: ['4.32'],
      startDate: 'Apr 1, 2026',
      notes: ''
    },
    meter: { engaged: false }
  },
  fixed: {
    label: 'Fixed service · expanded',
    selected: 'internet',
    addedIds: ['electricity', 'maintenance'],
    showError: false,
    contract: {
      provider: 'p5',
      startDate: 'Mar 15, 2026',
      account: 'KS-44128-A',
      notes: 'Promo rate · expires Sep 15'
    },
    tariff: {
      fixedAmount: '480',
      startDate: 'Mar 15, 2026',
      notes: ''
    },
    meter: null // not offered for fixed types
  },
  meterFilled: {
    label: 'Meter section engaged',
    selected: 'electricity',
    addedIds: ['gas', 'internet'],
    showError: false,
    contract: {
      provider: 'p1',
      startDate: 'Mar 1, 2026',
      account: '123456789',
      notes: ''
    },
    tariff: {
      zones: 2,
      rates: ['4.32', '2.16'],
      startDate: 'Mar 1, 2026',
      notes: ''
    },
    meter: {
      engaged: true,
      zones: 2,
      serial: 'NIK-12345',
      installedAt: 'Mar 15, 2024',
      activeFrom: 'Mar 1, 2026',
      notes: ''
    }
  }
  // (legacy altGrid demo removed — the new color logic is now the canonical one)
};

// ──────────────────────────────────────────────────────────────────────────────
// Main wizard component
// ──────────────────────────────────────────────────────────────────────────────

function AddServiceWizard({ stateKey = 'empty' }) {
  const s = AS_STATES[stateKey] || AS_STATES.empty;
  const svc = s.selected ? AS_BY_ID[s.selected] : null;
  const sectionInactive = !svc;
  const showMeter = !svc || svc.measurement === 'metered';

  return (
    <div data-screen-label={`Add Service · ${s.label}`} style={{
      minHeight: '100%', background: ASZ.page, color: ASZ.foreground,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      fontFeatureSettings: '"cv11" 1, "ss01" 1'
    }}>
      <ASTopBar />

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '28px 32px 80px' }}>
        <ASBreadcrumb />

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 600,
            letterSpacing: -0.6, lineHeight: 1.15
          }}>Add service</h1>
          <p style={{
            margin: '7px 0 0', fontSize: 14, color: ASZ.mutedFg, maxWidth: 580
          }}>
            Set up a new utility service for{' '}
            <span style={{ color: ASZ.foreground, fontWeight: 500 }}>Apartment on Main St</span>
            {' '}— along with its initial contract, tariff, and (optionally) meter.
          </p>
        </div>

        {/* Centered form column */}
        <div style={{
          maxWidth: 760, margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 16
        }}>
          {/* Form-level error (after submit) */}
          {s.showError &&
          <ASFormError>
              An <strong>active electricity service</strong> already exists on this property.
              Update its tariff or close it first before adding a new one.
            </ASFormError>
          }

          {/* Section 1 — Service type */}
          <ASSection
            n={1}
            title="Service type"
            desc="Pick what kind of utility this is. The rest of the form adapts to your choice.">
            
            <ASServiceGrid selectedId={s.selected} addedIds={s.addedIds || []} />
            {svc &&
            <div style={{
              marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12.5, color: ASZ.mutedFg
            }}>
                <ASIc.Info size={13} stroke={ASZ.mutedFg} />
                <span>
                  <strong style={{ color: ASZ.foreground, fontWeight: 500 }}>{svc.name}</strong>
                  {' is '}
                  {svc.measurement === 'fixed' ?
                <>billed at a <strong style={{ color: ASZ.foreground, fontWeight: 500 }}>flat monthly amount</strong>. No meter required.</> :
                svc.supportsZones ?
                <>billed by usage in <strong style={{ color: ASZ.foreground, fontWeight: 500 }}>{svc.unit}</strong>. Supports day / night / off-peak zones.</> :
                <>billed by usage in <strong style={{ color: ASZ.foreground, fontWeight: 500 }}>{svc.unit}</strong>. Single zone only.</>
                }
                </span>
              </div>
            }
          </ASSection>

          {/* Section 2 — Initial contract */}
          <ASSection
            n={2}
            title="Initial contract"
            desc="Your agreement with the provider. You can update it any time from the service detail page."
            inactive={sectionInactive}>
            
            <ASContractBody
              values={s.contract}
              filled={!sectionInactive} />
            
          </ASSection>

          {/* Section 3 — Initial tariff */}
          <ASSection
            n={3}
            title="Initial tariff"
            desc={
            !svc ?
            'The pricing for this service. Shape depends on the type you choose above.' :
            svc.measurement === 'fixed' ?
            'A single flat monthly amount.' :
            'Rates that bills will be calculated from. New tariffs can be added later as prices change.'
            }
            inactive={sectionInactive}
            accent={svc ? svc.color : null}>
            
            <ASTariffBody
              svc={svc}
              values={s.tariff}
              filled={!sectionInactive} />
            
          </ASSection>

          {/* Section 4 — Meter (only for metered services) */}
          {showMeter &&
          <ASSection
            n={4}
            title="Meter"
            desc={
            !svc ?
            'Track usage with a physical meter. Optional — only shown for metered services.' :
            'Optional. Skip this if you don\'t track readings yet — you can add a meter from the service page later.'
            }
            inactive={sectionInactive}>
            
              <ASMeterBody
              svc={svc}
              values={s.meter || {}}
              filled={!sectionInactive && s.meter?.engaged}
              engaged={!!s.meter?.engaged} />
            
            </ASSection>
          }

          {/* Footer actions */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginTop: 8, padding: '4px 4px 0'
          }}>
            <a href="#" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px 0 10px',
              fontSize: 13.5, fontWeight: 500,
              color: ASZ.foreground, textDecoration: 'none',
              background: ASZ.background, border: `1px solid ${ASZ.border}`,
              borderRadius: 6
            }}>
              <ASIc.ChevL size={14} stroke={ASZ.mutedFg2} />
              Cancel
            </a>
            <button
              disabled={sectionInactive}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                height: 36, padding: '0 20px',
                fontSize: 13.5, fontWeight: 500,
                color: '#fff',
                background: sectionInactive ? ASZ.border : ASA.solid,
                border: `1px solid ${sectionInactive ? ASZ.border : ASA.solid}`,
                borderRadius: 6, cursor: sectionInactive ? 'not-allowed' : 'pointer',
                boxShadow: sectionInactive ? 'none' : '0 1px 3px rgba(124,58,237,0.18)'
              }}>
              Create service
            </button>
          </div>

          {sectionInactive &&
          <div style={{
            fontSize: 12, color: ASZ.mutedFg, textAlign: 'center',
            marginTop: 4
          }}>
              Pick a service type above to continue.
            </div>
          }
        </div>
      </div>
    </div>);

}

window.AddServiceWizard = AddServiceWizard;
window.AS_STATES = AS_STATES;