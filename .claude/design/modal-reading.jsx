/* global React */
// Iteration 2 — Submit Reading modal
// Reuses primitives from dashboard.jsx via window.UB

const { useState: useState3, useEffect: useEffect3, useRef: useRef3 } = React;
const { Z, ACCENTS, SERVICE_COLORS, SERVICE_ICONS, Icons, Icon } = window.UB;
const ACCENT = ACCENTS.violet;

// ---- Extra icons ----
const Ic2 = {
  X: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <path d="M18 6 6 18M6 6l12 12"/>
    </Icon>
  ),
  Calendar: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
    </Icon>
  ),
  AlertTriangle: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4M12 17h.01"/>
    </Icon>
  ),
  FileText: (p) => (
    <Icon size={p.size || 16} stroke={p.stroke || 'currentColor'}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>
    </Icon>
  ),
};

// ---- Form primitives ----
function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: 'block', fontSize: 13.5, fontWeight: 500,
      color: Z.foreground, marginBottom: 6,
    }}>{children}</label>
  );
}

function Input({ id, value, onChange, placeholder, type = 'text', suffix, autoFocus, hasError, style }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          height: 36,
          padding: suffix ? '0 36px 0 12px' : '0 12px',
          fontSize: 14,
          color: Z.foreground,
          background: Z.background,
          border: `1px solid ${hasError ? Z.destructive : Z.border}`,
          borderRadius: 6,
          outline: 'none',
          fontFamily: 'inherit',
          ...style,
        }}
      />
      {suffix && (
        <div style={{
          position: 'absolute', right: 10,
          pointerEvents: 'none',
        }}>{suffix}</div>
      )}
    </div>
  );
}

function Textarea({ id, value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '8px 12px',
        fontSize: 14,
        color: Z.foreground,
        background: Z.background,
        border: `1px solid ${Z.border}`,
        borderRadius: 6,
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'vertical',
        lineHeight: 1.5,
      }}
    />
  );
}

function HintText({ children, warning }) {
  return (
    <div style={{
      marginTop: 6,
      fontSize: 12.5,
      color: warning ? '#d97706' : Z.mutedFg,
      display: 'flex', alignItems: 'flex-start', gap: 6,
      lineHeight: 1.4,
    }}>
      {warning && <Ic2.AlertTriangle size={13} stroke="#d97706" style={{ flexShrink: 0, marginTop: 1 }}/>}
      <span>{children}</span>
    </div>
  );
}

function FieldGroup({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: Z.border, margin: '4px 0' }}/>;
}

// ---- The modal shell ----
function ModalShell({ title, children, onClose, footer }) {
  return (
    <div style={{
      width: 480,
      background: Z.background,
      border: `1px solid ${Z.border}`,
      borderRadius: 10,
      boxShadow: '0 20px 60px rgba(9,9,11,0.18), 0 4px 16px rgba(9,9,11,0.10)',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: `1px solid ${Z.border}`,
      }}>
        <h2 style={{
          margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2,
          color: Z.foreground,
        }}>{title}</h2>
        <button onClick={onClose} style={{
          width: 28, height: 28, borderRadius: 6,
          border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: Z.mutedFg,
        }}>
          <Ic2.X size={16} stroke={Z.mutedFg}/>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px' }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        borderTop: `1px solid ${Z.border}`,
        background: Z.subtle,
      }}>
        {footer}
      </div>
    </div>
  );
}

// ---- Context block ----
function MeterContext({ twoZone }) {
  const color = SERVICE_COLORS.electricity;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      background: Z.muted,
      borderRadius: 8,
      marginBottom: 20,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: color + '1A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icons.Zap size={18} stroke={color}/>
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
          Electricity meter · SN 012345{twoZone && <span style={{ fontWeight: 400, color: Z.mutedFg }}> · 2 zones</span>}
        </div>
        <div style={{ fontSize: 12, color: Z.mutedFg, marginTop: 2 }}>
          Apartment on Main St
        </div>
      </div>
    </div>
  );
}

// ---- Footer buttons ----
function ModalFooter({ submitLabel = 'Submit', onCancel }) {
  return (
    <>
      <button onClick={onCancel} style={{
        height: 34, padding: '0 16px', fontSize: 13.5, fontWeight: 500,
        border: `1px solid ${Z.border}`, borderRadius: 6,
        background: Z.background, color: Z.foreground,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>Cancel</button>
      <button style={{
        height: 34, padding: '0 18px', fontSize: 13.5, fontWeight: 500,
        border: 'none', borderRadius: 6,
        background: ACCENT.solid, color: '#fff',
        cursor: 'pointer', fontFamily: 'inherit',
      }}>{submitLabel}</button>
    </>
  );
}

// ============================================================
// State 1 — Default (empty form)
// ============================================================
function ReadingModalDefault() {
  return (
    <ModalShell
      title="Submit reading"
      footer={<ModalFooter submitLabel="Submit" />}
    >
      <MeterContext/>
      <FieldGroup>
        <div>
          <Label htmlFor="date-d">Reading date</Label>
          <Input
            id="date-d"
            value="Oct 15, 2024"
            readOnly
            suffix={<Ic2.Calendar size={15} stroke={Z.mutedFg}/>}
          />
        </div>
        <div>
          <Label htmlFor="val-d">Value (kWh)</Label>
          <Input id="val-d" value="" placeholder="e.g. 12,650" autoFocus/>
          <HintText>Last reading was 12,512 on Sep 14</HintText>
        </div>
        <div>
          <Label htmlFor="notes-d">Notes <span style={{ fontWeight: 400, color: Z.mutedFg }}>(optional)</span></Label>
          <Textarea id="notes-d" value="" placeholder="Any remarks about this reading…"/>
        </div>
      </FieldGroup>
    </ModalShell>
  );
}

// ============================================================
// State 2 — Filled (valid value entered)
// ============================================================
function ReadingModalFilled() {
  return (
    <ModalShell
      title="Submit reading"
      footer={<ModalFooter submitLabel="Submit"/>}
    >
      <MeterContext/>
      <FieldGroup>
        <div>
          <Label htmlFor="date-f">Reading date</Label>
          <Input
            id="date-f"
            value="Oct 15, 2024"
            suffix={<Ic2.Calendar size={15} stroke={Z.mutedFg}/>}
            style={{ background: Z.subtle }}
          />
        </div>
        <div>
          <Label htmlFor="val-f">Value (kWh)</Label>
          <Input
            id="val-f"
            value="13,240"
            style={{
              fontWeight: 500,
              border: `1px solid ${ACCENT.tintBorder}`,
              background: ACCENT.tintBg,
              color: Z.foreground,
            }}
          />
          <HintText>
            Last reading was 12,512 on Sep 14
            <span style={{ color: Z.success, fontWeight: 500 }}> · Δ +728 kWh</span>
          </HintText>
        </div>
        <div>
          <Label htmlFor="notes-f">Notes <span style={{ fontWeight: 400, color: Z.mutedFg }}>(optional)</span></Label>
          <Textarea id="notes-f" value="" placeholder="Any remarks about this reading…"/>
        </div>
      </FieldGroup>
    </ModalShell>
  );
}

// ============================================================
// State 3 — Warning (value lower than last reading)
// ============================================================
function ReadingModalWarning() {
  return (
    <ModalShell
      title="Submit reading"
      footer={<ModalFooter submitLabel="Submit anyway"/>}
    >
      <MeterContext/>
      <FieldGroup>
        <div>
          <Label htmlFor="date-w">Reading date</Label>
          <Input
            id="date-w"
            value="Oct 15, 2024"
            suffix={<Ic2.Calendar size={15} stroke={Z.mutedFg}/>}
            style={{ background: Z.subtle }}
          />
        </div>
        <div>
          <Label htmlFor="val-w">Value (kWh)</Label>
          <Input
            id="val-w"
            value="12,000"
            style={{
              fontWeight: 500,
              border: '1px solid #d97706',
              background: '#fffbeb',
            }}
          />
          <HintText warning>
            This value is lower than the last reading (12,512).
            Is this correct? (replacement, input error, or rollover)
          </HintText>
        </div>
        <div>
          <Label htmlFor="notes-w">Notes <span style={{ fontWeight: 400, color: Z.mutedFg }}>(optional)</span></Label>
          <Textarea id="notes-w" value="" placeholder="Any remarks about this reading…"/>
        </div>
      </FieldGroup>
    </ModalShell>
  );
}

// ---- Overlay wrapper — shows modal on a dimmed page bg ----
function ModalStage({ children, label }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#f4f4f5',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Fake page bg — top strip of the app */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#fff',
        overflow: 'hidden',
        opacity: 0.6,
      }}>
        {/* simplified topbar stripe */}
        <div style={{
          height: 64, borderBottom: `1px solid ${Z.border}`,
          display: 'flex', alignItems: 'center', padding: '0 32px', gap: 32,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: ACCENT.solid, opacity: 0.4,
          }}/>
          <div style={{ width: 180, height: 10, borderRadius: 5, background: Z.border }}/>
          <div style={{ flex: 1, display: 'flex', gap: 12 }}>
            {[90, 70, 60, 80, 70].map((w, i) => (
              <div key={i} style={{ width: w, height: 8, borderRadius: 4, background: Z.border }}/>
            ))}
          </div>
        </div>
        {/* fake page content rows */}
        <div style={{ padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 160, height: 18, borderRadius: 5, background: Z.border }}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            {[1,2].map(i => (
              <div key={i} style={{ height: 80, borderRadius: 8, background: Z.muted, border: `1px solid ${Z.border}` }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(9,9,11,0.45)',
        backdropFilter: 'blur(2px)',
      }}/>

      {/* State label */}
      <div style={{
        position: 'absolute', top: 16,
        fontSize: 11, fontWeight: 500,
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase', letterSpacing: 0.6,
        zIndex: 2,
      }}>{label}</div>

      {/* Modal */}
      <div style={{
        position: 'relative', zIndex: 3,
        marginTop: 80,
      }}>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// TWO-ZONE VARIANTS
// ============================================================

function TwoZoneRow({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {children}
    </div>
  );
}

// State 1 — Default empty
function ReadingModal2ZoneDefault() {
  return (
    <ModalShell
      title="Submit reading"
      footer={<ModalFooter submitLabel="Submit"/>}
    >
      <MeterContext twoZone/>
      <FieldGroup>
        <div>
          <Label htmlFor="date-2d">Reading date</Label>
          <Input
            id="date-2d"
            value="Oct 15, 2024"
            suffix={<Ic2.Calendar size={15} stroke={Z.mutedFg}/>}
          />
        </div>
        <TwoZoneRow>
          <div>
            <Label htmlFor="t1-d">Value T1 — day (kWh)</Label>
            <Input id="t1-d" value="" placeholder="e.g. 8,210" autoFocus/>
            <HintText>Last: 8,010 kWh · Sep 14</HintText>
          </div>
          <div>
            <Label htmlFor="t2-d">Value T2 — night (kWh)</Label>
            <Input id="t2-d" value="" placeholder="e.g. 4,620"/>
            <HintText>Last: 4,502 kWh · Sep 14</HintText>
          </div>
        </TwoZoneRow>
        <div>
          <Label htmlFor="notes-2d">Notes <span style={{ fontWeight: 400, color: Z.mutedFg }}>(optional)</span></Label>
          <Textarea id="notes-2d" value="" placeholder="Any remarks about this reading…"/>
        </div>
      </FieldGroup>
    </ModalShell>
  );
}

// State 2 — Filled (both zones valid)
function ReadingModal2ZoneFilled() {
  const inputFilled = {
    fontWeight: 500,
    border: `1px solid ${ACCENT.tintBorder}`,
    background: ACCENT.tintBg,
    color: Z.foreground,
  };
  return (
    <ModalShell
      title="Submit reading"
      footer={<ModalFooter submitLabel="Submit"/>}
    >
      <MeterContext twoZone/>
      <FieldGroup>
        <div>
          <Label htmlFor="date-2f">Reading date</Label>
          <Input
            id="date-2f"
            value="Oct 15, 2024"
            suffix={<Ic2.Calendar size={15} stroke={Z.mutedFg}/>}
            style={{ background: Z.subtle }}
          />
        </div>
        <TwoZoneRow>
          <div>
            <Label htmlFor="t1-f">Value T1 — day (kWh)</Label>
            <Input id="t1-f" value="8,340" style={inputFilled}/>
            <HintText>
              Last: 8,010 · Sep 14
              <span style={{ color: Z.success, fontWeight: 500 }}> · Δ +330</span>
            </HintText>
          </div>
          <div>
            <Label htmlFor="t2-f">Value T2 — night (kWh)</Label>
            <Input id="t2-f" value="4,680" style={inputFilled}/>
            <HintText>
              Last: 4,502 · Sep 14
              <span style={{ color: Z.success, fontWeight: 500 }}> · Δ +178</span>
            </HintText>
          </div>
        </TwoZoneRow>
        <div>
          <Label htmlFor="notes-2f">Notes <span style={{ fontWeight: 400, color: Z.mutedFg }}>(optional)</span></Label>
          <Textarea id="notes-2f" value="" placeholder="Any remarks about this reading…"/>
        </div>
      </FieldGroup>
    </ModalShell>
  );
}

// State 3 — Warning (T2 night is lower than last)
function ReadingModal2ZoneWarning() {
  const inputFilled = {
    fontWeight: 500,
    border: `1px solid ${ACCENT.tintBorder}`,
    background: ACCENT.tintBg,
    color: Z.foreground,
  };
  return (
    <ModalShell
      title="Submit reading"
      footer={<ModalFooter submitLabel="Submit anyway"/>}
    >
      <MeterContext twoZone/>
      <FieldGroup>
        <div>
          <Label htmlFor="date-2w">Reading date</Label>
          <Input
            id="date-2w"
            value="Oct 15, 2024"
            suffix={<Ic2.Calendar size={15} stroke={Z.mutedFg}/>}
            style={{ background: Z.subtle }}
          />
        </div>
        <TwoZoneRow>
          <div>
            <Label htmlFor="t1-w">Value T1 — day (kWh)</Label>
            <Input id="t1-w" value="8,340" style={inputFilled}/>
            <HintText>
              Last: 8,010 · Sep 14
              <span style={{ color: Z.success, fontWeight: 500 }}> · Δ +330</span>
            </HintText>
          </div>
          <div>
            <Label htmlFor="t2-w">Value T2 — night (kWh)</Label>
            <Input id="t2-w" value="4,100" style={{
              fontWeight: 500,
              border: '1px solid #d97706',
              background: '#fffbeb',
            }}/>
            <HintText warning>
              Lower than last reading (4,502). Correct?
            </HintText>
          </div>
        </TwoZoneRow>
        <div>
          <Label htmlFor="notes-2w">Notes <span style={{ fontWeight: 400, color: Z.mutedFg }}>(optional)</span></Label>
          <Textarea id="notes-2w" value="" placeholder="Any remarks about this reading…"/>
        </div>
      </FieldGroup>
    </ModalShell>
  );
}

window.ReadingModal2ZoneDefault = ReadingModal2ZoneDefault;
window.ReadingModal2ZoneFilled = ReadingModal2ZoneFilled;
window.ReadingModal2ZoneWarning = ReadingModal2ZoneWarning;
window.ReadingModalDefault = ReadingModalDefault;
window.ReadingModalFilled = ReadingModalFilled;
window.ReadingModalWarning = ReadingModalWarning;
window.ModalStage = ModalStage;
window.ModalShell = ModalShell;
window.MeterContext = MeterContext;
window.ModalFooter = ModalFooter;
window.FieldGroup = FieldGroup;
window.Label = Label;
window.Input = Input;
window.Textarea = Textarea;
window.HintText = HintText;
window.Ic2 = Ic2;
