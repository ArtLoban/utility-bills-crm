/* global React */
// Add Service wizard — MOBILE (390px width, iPhone 14 Pro)
// Mirrors the desktop wizard structure (4 sections, 4 states) but reflows for
// narrow screens: stacked rows, denser padding, larger touch targets, 16px
// input text to avoid iOS zoom. Reuses AS_STATES / AS_SERVICES / AS_ICONS /
// tokens from add-service.jsx (exposed on window).

const ASMZ   = window.ASZ;
const ASMA   = window.ASA;
const ASMIc  = window.ASIc;
const ASMSvg = window.ASvg;
const ASM_SERVICES = window.AS_SERVICES;
const ASM_BY_ID    = window.AS_BY_ID;
const ASM_ICONS    = window.AS_ICONS;
const ASM_STATES   = window.AS_STATES;

const ASM_WIDTH = 390;

// ── Mobile topbar ───────────────────────────────────────────────────────────
function ASMTopBar() {
  return (
    <div style={{
      height: 52, background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${ASMZ.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 16px',
      position: 'sticky', top: 0, zIndex: 10,
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5,
          background: ASMA.solid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ASMIc.Logo size={13} stroke="#fff"/>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}>UtilityBills</span>
      </div>
      <button aria-label="Open menu" style={{
        background: 'none', border: 'none', padding: 4, cursor: 'pointer',
      }}>
        <ASMSvg size={18} stroke={ASMZ.foreground}>
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </ASMSvg>
      </button>
    </div>
  );
}

// ── Compact breadcrumb (back arrow + last-two) ──────────────────────────────
function ASMBreadcrumb() {
  return (
    <a href="#" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 13, color: ASMZ.mutedFg, textDecoration: 'none',
      marginBottom: 10,
    }}>
      <ASMIc.ChevL size={13} stroke={ASMZ.mutedFg}/>
      <span>Apartment on Main St</span>
    </a>
  );
}

// ── Form primitives (mobile sizes) ─────────────────────────────────────────
function ASMLabel({ children, optional }) {
  return (
    <label style={{
      display: 'block', fontSize: 13.5, fontWeight: 500,
      color: ASMZ.foreground, marginBottom: 6,
    }}>
      {children}
      {optional && <span style={{ fontWeight: 400, color: ASMZ.mutedFg, marginLeft: 4 }}>(optional)</span>}
    </label>
  );
}

function ASMInput({ value, placeholder, filled, suffix, mono }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        readOnly
        value={value || ''}
        placeholder={placeholder}
        style={{
          width: '100%', height: 40,
          padding: suffix ? '0 56px 0 12px' : '0 12px',
          fontSize: 16, color: ASMZ.foreground,
          background: filled ? ASMA.tintBg : ASMZ.background,
          border: `1px solid ${filled ? ASMA.tintBorder : ASMZ.border}`,
          borderRadius: 6,
          fontWeight: filled ? 500 : 400,
          fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
          fontFeatureSettings: '"tnum" 1',
          outline: 'none',
        }}
      />
      {suffix && (
        <div style={{
          position: 'absolute', right: 12, pointerEvents: 'none',
          color: ASMZ.mutedFg, fontSize: 12.5,
        }}>{suffix}</div>
      )}
    </div>
  );
}

function ASMTextarea({ value, placeholder, filled, rows = 3 }) {
  return (
    <textarea
      readOnly
      value={value || ''}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '10px 12px',
        fontSize: 16, color: ASMZ.foreground,
        background: filled ? ASMA.tintBg : ASMZ.background,
        border: `1px solid ${filled ? ASMA.tintBorder : ASMZ.border}`,
        borderRadius: 6, resize: 'vertical', lineHeight: 1.45,
        fontWeight: filled ? 500 : 400, outline: 'none',
        fontFamily: 'inherit',
      }}
    />
  );
}

function ASMSelect({ value, filled, options = [], placeholder, disabled }) {
  const valLabel = options.find(o => o.value === value)?.label;
  const display = valLabel || placeholder || 'Select…';
  const isPlaceholder = !valLabel;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', height: 40, padding: '0 12px',
      fontSize: 16,
      color: isPlaceholder || disabled ? ASMZ.mutedFg : ASMZ.foreground,
      background: filled ? ASMA.tintBg : (disabled ? ASMZ.subtle : ASMZ.background),
      border: `1px solid ${filled ? ASMA.tintBorder : ASMZ.border}`,
      borderRadius: 6,
      fontWeight: filled ? 500 : 400,
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{display}</span>
      <ASMIc.ChevD size={13} stroke={ASMZ.mutedFg}/>
    </div>
  );
}

function ASMDate({ value, filled, placeholder }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      width: '100%', height: 40, padding: '0 12px',
      fontSize: 16,
      color: value ? ASMZ.foreground : ASMZ.mutedFg,
      background: filled ? ASMA.tintBg : ASMZ.background,
      border: `1px solid ${filled ? ASMA.tintBorder : ASMZ.border}`,
      borderRadius: 6,
      fontWeight: filled ? 500 : 400,
    }}>
      <ASMIc.Cal size={15} stroke={ASMZ.mutedFg}/>
      <span>{value || placeholder || 'Pick a date'}</span>
    </div>
  );
}

function ASMHint({ children, tone = 'muted' }) {
  const color = tone === 'warning' ? ASMZ.warning : ASMZ.mutedFg;
  return (
    <div style={{
      marginTop: 6, fontSize: 12.5, color, lineHeight: 1.45,
      display: 'flex', alignItems: 'flex-start', gap: 6,
    }}>
      {tone === 'warning' && <ASMIc.Warn size={13} stroke={ASMZ.warning} style={{ flexShrink: 0, marginTop: 1 }}/>}
      <span>{children}</span>
    </div>
  );
}

// ── Service catalog grid (mobile · 2 cols) ─────────────────────────────────
function ASMServiceCard({ svc, selected, added }) {
  const path = ASM_ICONS[svc.id];
  const c    = svc.color;

  let cardBorder, cardBg, iconBoxBg, iconBoxBorder, iconStroke, nameColor;
  if (added) {
    cardBorder    = ASMZ.border;
    cardBg        = ASMZ.subtle;
    iconBoxBg     = ASMZ.muted;
    iconBoxBorder = ASMZ.border;
    iconStroke    = '#d4d4d8';
    nameColor     = '#a1a1aa';
  } else if (selected) {
    cardBorder    = c;
    cardBg        = c + '0E';
    iconBoxBg     = c + '20';
    iconBoxBorder = c + '38';
    iconStroke    = c;
    nameColor     = ASMZ.foreground;
  } else {
    cardBorder    = ASMZ.border;
    cardBg        = ASMZ.background;
    iconBoxBg     = ASMZ.muted;
    iconBoxBorder = ASMZ.border;
    iconStroke    = '#52525b';
    nameColor     = ASMZ.foreground;
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 11px',
      borderRadius: 8, cursor: added ? 'not-allowed' : 'pointer',
      border: `1.5px solid ${cardBorder}`,
      background: cardBg,
      minWidth: 0,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 7, flexShrink: 0,
        background: iconBoxBg,
        border: `1px solid ${iconBoxBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ASMSvg size={16} stroke={iconStroke}>{path}</ASMSvg>
      </div>
      <div style={{
        fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
        color: nameColor, lineHeight: 1.2,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        flex: 1, minWidth: 0,
      }}>{svc.name}</div>
      {added && (
        <span style={{
          position: 'absolute', top: -5, right: -4,
          padding: '2px 7px',
          fontSize: 10, fontWeight: 600,
          color: '#52525b',
          background: '#e4e4e7',
          borderRadius: 999,
          letterSpacing: 0.2,
          boxShadow: `0 0 0 2px ${ASMZ.background}`,
        }}>Added</span>
      )}
      {selected && !added && (
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          background: c, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ASMIc.Check size={10} stroke="#fff" strokeWidth={3}/>
        </div>
      )}
    </div>
  );
}

function ASMServiceGrid({ selectedId, addedIds = [] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
    }}>
      {ASM_SERVICES.map(s => (
        <ASMServiceCard
          key={s.id} svc={s}
          selected={selectedId === s.id}
          added={addedIds.includes(s.id)}
        />
      ))}
    </div>
  );
}

// ── Section wrapper (mobile) ───────────────────────────────────────────────
function ASMSection({ n, title, desc, inactive, children, accent }) {
  return (
    <section style={{
      background: ASMZ.card,
      border: `1px solid ${ASMZ.border}`,
      borderRadius: 10,
      boxShadow: inactive ? 'none' : '0 1px 2px rgba(24,24,27,0.04)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '16px 16px 14px',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: inactive ? ASMZ.muted : (accent ? accent + '18' : ASMA.tintBg),
          border: `1px solid ${inactive ? ASMZ.border : (accent ? accent + '30' : ASMA.tintBorder)}`,
          color: inactive ? ASMZ.mutedFg : (accent || ASMA.solid),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600,
          fontFeatureSettings: '"tnum" 1',
        }}>
          {String(n).padStart(2, '0')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2,
            color: ASMZ.foreground,
          }}>{title}</h2>
          <p style={{
            margin: '3px 0 0', fontSize: 12.5, color: ASMZ.mutedFg, lineHeight: 1.4,
          }}>{desc}</p>
        </div>
      </div>

      <div style={{ height: 1, background: ASMZ.border, margin: '0 16px' }}/>

      <div style={{
        padding: '16px 16px 18px',
        opacity: inactive ? 0.45 : 1,
        pointerEvents: inactive ? 'none' : 'auto',
      }}>
        {children}
      </div>
    </section>
  );
}

// ── Form error banner ──────────────────────────────────────────────────────
function ASMFormError({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 14px',
      background: ASMZ.destructiveBg,
      border: `1px solid ${ASMZ.destructiveBd}`,
      borderRadius: 8,
      marginBottom: 12,
    }}>
      <ASMIc.Warn size={16} stroke={ASMZ.destructive} style={{ flexShrink: 0, marginTop: 1 }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#7f1d1d', marginBottom: 2,
        }}>Couldn't create service</div>
        <div style={{ fontSize: 12.5, color: '#991b1b', lineHeight: 1.45 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Section bodies ─────────────────────────────────────────────────────────
const ASM_PROVIDERS = [
  { value: '', label: 'Select a provider…' },
  { value: 'p1', label: 'ДТЕК Київські електромережі' },
  { value: 'p2', label: 'Нафтогаз України' },
  { value: 'p3', label: 'Київводоканал' },
  { value: 'p4', label: 'Київтеплоенерго' },
  { value: 'p5', label: 'Київстар Home Internet' },
];

function ASMContractBody({ values = {}, filled }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <ASMLabel>Provider</ASMLabel>
        <ASMSelect value={values.provider} filled={filled} options={ASM_PROVIDERS}/>
      </div>
      <div>
        <ASMLabel>Contract start date</ASMLabel>
        <ASMDate value={values.startDate} filled={filled}/>
      </div>
      <div>
        <ASMLabel optional>Contract notes</ASMLabel>
        <ASMTextarea value={values.notes} placeholder="Anything worth remembering…" filled={filled}/>
      </div>
    </div>
  );
}

function ASMTariffBody({ svc, values = {}, filled }) {
  if (!svc) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><ASMLabel>Rate</ASMLabel><ASMInput placeholder="0.00"/></div>
        <div><ASMLabel>Tariff start date</ASMLabel><ASMDate/></div>
        <div><ASMLabel optional>Tariff notes</ASMLabel><ASMInput placeholder="Optional"/></div>
      </div>
    );
  }
  if (svc.measurement === 'fixed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <ASMLabel>Monthly amount</ASMLabel>
          <ASMInput value={values.fixedAmount} placeholder="e.g. 480" filled={filled} suffix="UAH"/>
          <ASMHint>A flat amount billed each month regardless of usage.</ASMHint>
        </div>
        <div><ASMLabel>Tariff start date</ASMLabel><ASMDate value={values.startDate} filled={filled}/></div>
        <div>
          <ASMLabel optional>Tariff notes</ASMLabel>
          <ASMInput value={values.notes} placeholder="e.g. promo period" filled={filled}/>
        </div>
      </div>
    );
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <ASMLabel>{zones === 1 ? 'Rate' : 'Rates per zone'}</ASMLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: zones }).map((_, i) => (
            <div key={i}>
              <div style={{
                fontSize: 11, color: ASMZ.mutedFg, marginBottom: 4,
                fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.3,
              }}>{zoneLabels(zones)[i]}</div>
              <ASMInput
                value={rates[i]}
                placeholder="0.00"
                filled={filled}
                suffix={svc.rateUnit}
              />
            </div>
          ))}
        </div>
        {svc.supportsZones && (
          <ASMHint>
            {zones === 1
              ? 'Billed at a single rate. Add a meter below to bill by day/night or three zones.'
              : 'Zone count comes from the meter section below.'}
          </ASMHint>
        )}
      </div>
      <div><ASMLabel>Tariff start date</ASMLabel><ASMDate value={values.startDate} filled={filled}/></div>
      <div>
        <ASMLabel optional>Tariff notes</ASMLabel>
        <ASMInput value={values.notes} placeholder="e.g. new rates" filled={filled}/>
      </div>
    </div>
  );
}

function ASMMeterRow({ engaged }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, padding: '12px 14px',
      background: engaged ? ASMA.tintBg : ASMZ.subtle,
      border: `1px solid ${engaged ? ASMA.tintBorder : ASMZ.border}`,
      borderRadius: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7, flexShrink: 0,
          background: engaged ? ASMA.solid + '14' : ASMZ.muted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ASMIc.Gauge size={15} stroke={engaged ? ASMA.solid : ASMZ.mutedFg}/>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: ASMZ.foreground, lineHeight: 1.2 }}>
            Track readings with a meter
          </div>
          <div style={{ fontSize: 11.5, color: ASMZ.mutedFg, marginTop: 2, lineHeight: 1.35 }}>
            Recommended when bills depend on usage.
          </div>
        </div>
      </div>
      <div style={{
        width: 36, height: 22, borderRadius: 11, flexShrink: 0,
        background: engaged ? ASMA.solid : ASMZ.border,
        position: 'relative', transition: 'background 120ms',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: engaged ? 16 : 2,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 2px rgba(24,24,27,0.18)',
        }}/>
      </div>
    </div>
  );
}

function ASMZoneSelector({ value, supportsZones, filled }) {
  if (!supportsZones) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px',
        background: ASMZ.subtle, border: `1px solid ${ASMZ.border}`,
        borderRadius: 6,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: ASMA.solid }}/>
        <span style={{ fontSize: 13, color: ASMZ.foreground }}>Single zone</span>
        <span style={{ fontSize: 11.5, color: ASMZ.mutedFg }}>· billed at one rate</span>
      </div>
    );
  }
  const opts = [
    { v: 1, label: '1 zone', sub: 'Flat' },
    { v: 2, label: '2 zones', sub: 'Day / Night' },
    { v: 3, label: '3 zones', sub: 'Peak / Off' },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
      padding: 3, background: ASMZ.subtle,
      border: `1px solid ${ASMZ.border}`, borderRadius: 8,
    }}>
      {opts.map(o => {
        const active = o.v === value;
        return (
          <div key={o.v} style={{
            padding: '8px 6px', borderRadius: 6,
            background: active ? (filled ? ASMA.solid : ASMZ.background) : 'transparent',
            border: active && !filled ? `1px solid ${ASMZ.border}` : '1px solid transparent',
            boxShadow: active && !filled ? '0 1px 2px rgba(24,24,27,0.04)' : 'none',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 12.5, fontWeight: 600,
              color: active && filled ? '#fff' : ASMZ.foreground,
              letterSpacing: -0.1,
            }}>{o.label}</div>
            <div style={{
              fontSize: 10.5, marginTop: 1,
              color: active && filled ? 'rgba(255,255,255,0.85)' : ASMZ.mutedFg,
            }}>{o.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

function ASMMeterBody({ svc, values = {}, filled, engaged }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <ASMMeterRow engaged={engaged}/>
      {engaged && (
        <>
          <div>
            <ASMLabel>Number of zones</ASMLabel>
            <ASMZoneSelector value={values.zones || 1} supportsZones={!!svc?.supportsZones} filled={filled}/>
            {svc?.supportsZones && (
              <ASMHint>Changes here update the rate inputs above.</ASMHint>
            )}
          </div>
          <div>
            <ASMLabel optional>Serial number</ASMLabel>
            <ASMInput value={values.serial} placeholder="e.g. NIK-12345" filled={filled} mono/>
            <ASMHint>Printed on the meter face. Skip if unknown.</ASMHint>
          </div>
          <div>
            <ASMLabel optional>Installation date</ASMLabel>
            <ASMDate value={values.installedAt} filled={filled} placeholder="When it was installed"/>
          </div>
          <div>
            <ASMLabel>Meter active since</ASMLabel>
            <ASMDate value={values.activeFrom} filled={filled}/>
            <ASMHint>Readings before this date are not tracked.</ASMHint>
          </div>
          <div>
            <ASMLabel optional>Meter notes</ASMLabel>
            <ASMInput value={values.notes} placeholder="e.g. located on landing" filled={filled}/>
          </div>
        </>
      )}
    </div>
  );
}

// ── Wizard root (mobile) ───────────────────────────────────────────────────
function AddServiceWizardMobile({ stateKey = 'empty' }) {
  const s = ASM_STATES[stateKey] || ASM_STATES.empty;
  const svc = s.selected ? ASM_BY_ID[s.selected] : null;
  const sectionInactive = !svc;
  const showMeter = !svc || svc.measurement === 'metered';

  return (
    <div data-screen-label={`Add Service · Mobile · ${s.label}`} style={{
      width: ASM_WIDTH, minHeight: '100%',
      background: ASMZ.page, color: ASMZ.foreground,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
    }}>
      <ASMTopBar/>

      <div style={{ padding: '14px 16px 24px' }}>
        <ASMBreadcrumb/>

        <div style={{ marginBottom: 14 }}>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            letterSpacing: -0.5, lineHeight: 1.15,
          }}>Add service</h1>
          <p style={{
            margin: '4px 0 0', fontSize: 13, color: ASMZ.mutedFg, lineHeight: 1.4,
          }}>Set up a service with its contract, tariff, and (optionally) a meter.</p>
        </div>

        {s.showError && (
          <ASMFormError>
            An <strong>active electricity service</strong> already exists. Update its tariff or close it first.
          </ASMFormError>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ASMSection
            n={1}
            title="Service type"
            desc="Pick what kind of utility this is."
          >
            <ASMServiceGrid selectedId={s.selected} addedIds={s.addedIds || []}/>
            {svc && (
              <div style={{
                marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 6,
                fontSize: 12, color: ASMZ.mutedFg, lineHeight: 1.45,
              }}>
                <ASMIc.Info size={12} stroke={ASMZ.mutedFg} style={{ flexShrink: 0, marginTop: 2 }}/>
                <span>
                  <strong style={{ color: ASMZ.foreground, fontWeight: 500 }}>{svc.name}</strong>
                  {' is '}
                  {svc.measurement === 'fixed'
                    ? <>billed at a <strong style={{ color: ASMZ.foreground, fontWeight: 500 }}>flat amount</strong> each month.</>
                    : svc.supportsZones
                      ? <>billed by usage in <strong style={{ color: ASMZ.foreground, fontWeight: 500 }}>{svc.unit}</strong>. Supports zones.</>
                      : <>billed by usage in <strong style={{ color: ASMZ.foreground, fontWeight: 500 }}>{svc.unit}</strong>.</>
                  }
                </span>
              </div>
            )}
          </ASMSection>

          <ASMSection
            n={2}
            title="Initial contract"
            desc="Your agreement with the provider."
            inactive={sectionInactive}
          >
            <ASMContractBody values={s.contract} filled={!sectionInactive}/>
          </ASMSection>

          <ASMSection
            n={3}
            title="Initial tariff"
            desc={
              !svc
                ? 'Pricing for this service.'
                : svc.measurement === 'fixed'
                  ? 'A single flat monthly amount.'
                  : 'Rates that bills will be calculated from.'
            }
            inactive={sectionInactive}
            accent={svc ? svc.color : null}
          >
            <ASMTariffBody svc={svc} values={s.tariff} filled={!sectionInactive}/>
          </ASMSection>

          {showMeter && (
            <ASMSection
              n={4}
              title="Meter"
              desc={
                !svc
                  ? 'Track usage with a physical meter.'
                  : 'Optional — you can add one later.'
              }
              inactive={sectionInactive}
            >
              <ASMMeterBody
                svc={svc}
                values={s.meter || {}}
                filled={!sectionInactive && s.meter?.engaged}
                engaged={!!s.meter?.engaged}
              />
            </ASMSection>
          )}

          {/* Footer actions — stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
            <button
              disabled={sectionInactive}
              style={{
                width: '100%', height: 44, padding: '0 18px',
                fontSize: 14.5, fontWeight: 600,
                color: '#fff',
                background: sectionInactive ? ASMZ.border : ASMA.solid,
                border: `1px solid ${sectionInactive ? ASMZ.border : ASMA.solid}`,
                borderRadius: 8,
                cursor: sectionInactive ? 'not-allowed' : 'pointer',
                boxShadow: sectionInactive ? 'none' : '0 1px 3px rgba(124,58,237,0.18)',
              }}>
              Create service
            </button>
            <a href="#" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: 44, padding: '0 14px',
              fontSize: 14.5, fontWeight: 500,
              color: ASMZ.foreground, textDecoration: 'none',
              background: ASMZ.background, border: `1px solid ${ASMZ.border}`,
              borderRadius: 8,
            }}>
              Cancel
            </a>
          </div>

          {sectionInactive && (
            <div style={{
              fontSize: 12, color: ASMZ.mutedFg, textAlign: 'center',
              marginTop: 2, lineHeight: 1.4,
            }}>
              Pick a service type above to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.AddServiceWizardMobile = AddServiceWizardMobile;
