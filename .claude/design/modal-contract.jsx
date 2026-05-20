/* global React */
// Update contract modal + Contract history drawer — Iteration 3

const { useState: useStCM } = React;
const { Z, ACCENTS, SERVICE_COLORS } = window.UB;
const { SDI, SCard, OutlineBtn, PrimaryBtn, GhostBtn, KVGrid } = window;
const AV2 = ACCENTS.violet;

// ── Icons local to this file ──────────────────────────────────
const CMI = {
  X:    (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Info: (p) => <svg width={p.s||15} height={p.s||15} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  Cal:  (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>,
};

// ── Shared modal shell ────────────────────────────────────────
function ModalShell2({ title, width = 520, children, footer, onClose }) {
  return (
    <div style={{
      width, background: Z.background,
      border: `1px solid ${Z.border}`, borderRadius: 10,
      boxShadow: '0 20px 60px rgba(9,9,11,0.18), 0 4px 16px rgba(9,9,11,0.10)',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: `1px solid ${Z.border}`,
      }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: Z.foreground }}>
          {title}
        </h2>
        <button onClick={onClose} style={{
          width: 28, height: 28, borderRadius: 6,
          border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <CMI.X s={15} c={Z.mutedFg}/>
        </button>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
      {footer && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px', borderTop: `1px solid ${Z.border}`,
          background: Z.subtle,
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ── Stage backdrop ────────────────────────────────────────────
function Stage({ children, label }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#f4f4f5',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', position: 'relative',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* faint page suggestion */}
      <div style={{
        position: 'absolute', inset: 0, background: '#fff', opacity: 0.5,
        overflow: 'hidden',
      }}>
        <div style={{
          height: 64, borderBottom: `1px solid ${Z.border}`,
          display: 'flex', alignItems: 'center', padding: '0 32px', gap: 32,
        }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: AV2.solid + '60' }}/>
          <div style={{ width: 180, height: 10, borderRadius: 5, background: Z.border }}/>
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.4)', backdropFilter: 'blur(2px)' }}/>
      {label && (
        <div style={{
          position: 'absolute', top: 16,
          fontSize: 11, fontWeight: 500, letterSpacing: 0.6,
          color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase',
          zIndex: 2,
        }}>{label}</div>
      )}
      <div style={{ position: 'relative', zIndex: 3, marginTop: 72 }}>{children}</div>
    </div>
  );
}

// ── Radio option ──────────────────────────────────────────────
function RadioOption({ value, selected, onSelect, label, helper, children }) {
  const active = selected === value;
  return (
    <div
      onClick={() => onSelect(value)}
      style={{
        padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
        border: `1.5px solid ${active ? AV2.solid : Z.border}`,
        background: active ? AV2.tintBg : Z.background,
        transition: 'border-color 120ms, background 120ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
          border: `2px solid ${active ? AV2.solid : Z.border}`,
          background: active ? AV2.solid : Z.background,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 120ms, background 120ms',
        }}>
          {active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }}/>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>{label}</div>
          <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 2 }}>{helper}</div>
        </div>
      </div>
      {active && children && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${AV2.tintBorder}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Tariff form (revealed when "Tariff changed" is selected) ──
function TariffForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Effective date */}
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: Z.foreground, marginBottom: 5 }}>
          Effective date
        </label>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%' }}>
          <input
            type="text" defaultValue="Nov 1, 2025"
            style={{
              width: '100%', height: 34,
              padding: '0 34px 0 10px', fontSize: 13.5,
              border: `1px solid ${Z.border}`, borderRadius: 6,
              background: Z.background, color: Z.foreground,
              fontFamily: 'inherit', outline: 'none',
            }}
          />
          <div style={{ position: 'absolute', right: 10, pointerEvents: 'none' }}>
            <CMI.Cal c={Z.mutedFg}/>
          </div>
        </div>
      </div>

      {/* New rates */}
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: Z.foreground, marginBottom: 8 }}>
          New rates
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Day (T1)', value: '4.80', color: SERVICE_COLORS.electricity },
            { label: 'Night (T2)', value: '2.40', color: '#6366f1' },
          ].map(r => (
            <div key={r.label}>
              <div style={{ fontSize: 12, color: Z.mutedFg, marginBottom: 4 }}>{r.label}</div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text" defaultValue={r.value}
                  style={{
                    width: '100%', height: 34,
                    padding: '0 40px 0 10px', fontSize: 14, fontWeight: 600,
                    border: `1.5px solid ${r.color}50`,
                    background: r.color + '0C',
                    color: Z.foreground,
                    borderRadius: 6, fontFamily: 'inherit', outline: 'none',
                    fontFeatureSettings: '"tnum" 1',
                  }}
                />
                <span style={{
                  position: 'absolute', right: 10,
                  fontSize: 12, color: Z.mutedFg, pointerEvents: 'none',
                }}>₴/kWh</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info callout */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-start',
        padding: '12px 14px', borderRadius: 8,
        background: '#eff6ff', border: '1px solid #bfdbfe',
      }}>
        <CMI.Info s={15} c="#3b82f6" w={2}/>
        <p style={{
          margin: 0, fontSize: 12.5, color: '#1e40af', lineHeight: 1.5,
        }}>
          The current tariff will be closed on <strong>Oct 31, 2025</strong>. New tariff will apply from <strong>Nov 1, 2025</strong> onwards. All existing readings and bills remain unchanged.
        </p>
      </div>
    </div>
  );
}

// ── Update contract modal ─────────────────────────────────────
function UpdateContractModal() {
  const [selected, setSelected] = useStCM('tariff');
  return (
    <ModalShell2
      title="Update contract"
      footer={
        <>
          <OutlineBtn>Cancel</OutlineBtn>
          <PrimaryBtn>Apply change</PrimaryBtn>
        </>
      }
    >
      <p style={{ margin: '0 0 16px', fontSize: 13.5, color: Z.mutedFg }}>
        What's changing?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <RadioOption
          value="tariff" selected={selected} onSelect={setSelected}
          label="Tariff changed"
          helper="New rates starting on a specific date"
        >
          <TariffForm/>
        </RadioOption>
        <RadioOption
          value="account" selected={selected} onSelect={setSelected}
          label="Account number changed"
          helper="Provider issued a new account number"
        />
        <RadioOption
          value="payment" selected={selected} onSelect={setSelected}
          label="Payment details changed"
          helper="New IBAN, bank, or recipient"
        />
        <RadioOption
          value="provider" selected={selected} onSelect={setSelected}
          label="Provider changed"
          helper="Switching to a different provider entirely"
        />
      </div>
    </ModalShell2>
  );
}

// ══════════════════════════════════════════════════════════════
// Contract history drawer
// ══════════════════════════════════════════════════════════════

const HISTORY = [
  {
    id: 3,
    range: 'Mar 1, 2024 — present',
    current: true,
    provider: 'ДТЭК Київські електромережі',
    account: '123456789',
    tariffZones: 2,
    tariffs: [
      { range: 'Mar 1, 2024 — present', t1: '4.32', t2: '2.16' },
    ],
    payment: 'IBAN UA20 3052 9900…4567 8 · EDRPOU 12345678',
  },
  {
    id: 2,
    range: 'Jun 15, 2023 — Feb 29, 2024',
    current: false,
    provider: 'ДТЭК Київські електромережі',
    account: '987654321',
    tariffZones: 2,
    tariffs: [
      { range: 'Jun 15, 2023 — Feb 29, 2024', t1: '3.60', t2: '1.80' },
    ],
    payment: 'IBAN UA20 3052 9900…4567 8 · EDRPOU 12345678',
  },
  {
    id: 1,
    range: 'Jan 1, 2023 — Jun 14, 2023',
    current: false,
    provider: 'Київенерго',
    account: '555444333',
    tariffZones: 1,
    tariffs: [
      { range: 'Jan 1, 2023 — Jun 14, 2023', t1: '1.68' },
    ],
    payment: 'IBAN UA20 3226 6900…1234 0 · EDRPOU 05517676',
  },
];

function TimelineEntry({ entry, isLast }) {
  const dotColor = entry.current ? AV2.solid : Z.border;
  return (
    <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
      {/* Left timeline column */}
      <div style={{ width: 28, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
          background: dotColor,
          border: `2px solid ${entry.current ? AV2.solid : Z.border}`,
          marginTop: 4,
          boxShadow: entry.current ? `0 0 0 3px ${AV2.tintBg}` : 'none',
          zIndex: 1,
        }}/>
        {!isLast && (
          <div style={{
            flex: 1, width: 2, background: Z.border, marginTop: 4, marginBottom: 0,
          }}/>
        )}
      </div>

      {/* Entry card */}
      <div style={{
        flex: 1, marginLeft: 12, marginBottom: isLast ? 0 : 20,
        border: `1px solid ${entry.current ? AV2.tintBorder : Z.border}`,
        borderRadius: 8,
        background: entry.current ? AV2.tintBg + '80' : Z.background,
        overflow: 'hidden',
      }}>
        {/* Entry header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px',
          borderBottom: `1px solid ${entry.current ? AV2.tintBorder : Z.border}`,
          background: entry.current ? AV2.tintBg : Z.subtle,
        }}>
          <span style={{
            fontSize: 13, fontWeight: 600, color: Z.foreground, flex: 1,
          }}>{entry.range}</span>
          {entry.current && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px',
              background: AV2.solid, color: '#fff', borderRadius: 999,
              letterSpacing: 0.2,
            }}>Current</span>
          )}
        </div>

        {/* KV rows */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Row k="Provider" v={entry.provider}/>
          <Row k="Account" v={entry.account}/>

          {/* Tariff — nested */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: Z.mutedFg, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6 }}>
              Tariff ({entry.tariffZones === 2 ? 'two-zone' : 'single-zone'})
            </div>
            {entry.tariffs.map((t, i) => (
              <div key={i} style={{
                marginLeft: 12, paddingLeft: 12,
                borderLeft: `2px solid ${Z.border}`,
                marginBottom: i < entry.tariffs.length - 1 ? 8 : 0,
              }}>
                <div style={{ fontSize: 12, color: Z.mutedFg, marginBottom: 3 }}>{t.range}</div>
                <div style={{ fontSize: 13, color: Z.foreground, fontFeatureSettings: '"tnum" 1', fontWeight: 500 }}>
                  {entry.tariffZones === 2
                    ? <>{t.t1} <span style={{ color: Z.mutedFg, fontWeight: 400 }}>(T1 day)</span> / {t.t2} <span style={{ color: Z.mutedFg, fontWeight: 400 }}>(T2 night)</span> ₴/kWh</>
                    : <>{t.t1} ₴/kWh</>
                  }
                </div>
              </div>
            ))}
          </div>

          <Row k="Payment details" v={entry.payment}/>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: Z.mutedFg, minWidth: 120, flexShrink: 0 }}>{k}</span>
      <span style={{ fontSize: 13, color: Z.foreground, lineHeight: 1.4 }}>{v}</span>
    </div>
  );
}

// Drawer shell (side panel, open state)
function DrawerShell({ title, width = 520, children, footer }) {
  return (
    <div style={{
      width, height: '100%',
      background: Z.background,
      borderLeft: `1px solid ${Z.border}`,
      boxShadow: '-8px 0 32px rgba(9,9,11,0.08)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: `1px solid ${Z.border}`,
        flexShrink: 0,
      }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: Z.foreground }}>
          {title}
        </h2>
        <button style={{
          width: 28, height: 28, borderRadius: 6, border: 'none',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CMI.X s={15} c={Z.mutedFg}/>
        </button>
      </div>
      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        {children}
      </div>
      {/* Footer */}
      {footer && (
        <div style={{
          padding: '14px 20px', borderTop: `1px solid ${Z.border}`,
          flexShrink: 0, background: Z.subtle,
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// Full artboard: page + drawer open side by side
function ContractHistoryArtboard() {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', position: 'relative',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: Z.background,
    }}>
      {/* Dimmed page bg */}
      <div style={{ flex: 1, opacity: 0.45, overflow: 'hidden', pointerEvents: 'none' }}>
        <ServiceDetail/>
      </div>
      {/* Overlay on page */}
      <div style={{
        position: 'absolute', inset: 0, right: 520,
        background: 'rgba(9,9,11,0.35)',
      }}/>
      {/* Drawer */}
      <div style={{ width: 520, flexShrink: 0, height: '100%', overflow: 'hidden' }}>
        <DrawerShell
          title="Contract history"
          footer={<OutlineBtn>Close</OutlineBtn>}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {HISTORY.map((entry, i) => (
              <TimelineEntry key={entry.id} entry={entry} isLast={i === HISTORY.length - 1}/>
            ))}
          </div>
        </DrawerShell>
      </div>
    </div>
  );
}

window.UpdateContractModal = UpdateContractModal;
window.ContractHistoryArtboard = ContractHistoryArtboard;
window.Stage2 = Stage;
