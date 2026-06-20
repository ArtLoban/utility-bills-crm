/* global React */
// Reminders section (service-detail card) + Add/Edit reminder modal — Iteration 3
// Focus: the Day-of-month picker (replaces the 1–31 native <select>).
// Reuses window.UB tokens + window.SCard/OutlineBtn/PrimaryBtn/GhostBtn/IconBtn/SDI.

const { useState: useStRM } = React;
const { Z, ACCENTS, SERVICE_COLORS, Icons } = window.UB;
const { SCard, OutlineBtn, PrimaryBtn, GhostBtn, SDI } = window;
const AVR = ACCENTS.violet;

// ── Local icons ───────────────────────────────────────────────
const RMI = {
  Bell: (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>,
  Telegram: (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill={p.c||'currentColor'}><path d="M21.94 4.6 18.9 19.04c-.23 1.01-.83 1.26-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.93.46l.33-4.72L18.6 6.2c.37-.33-.08-.51-.58-.18L6.4 13.28l-4.6-1.44c-1-.31-1.02-1 .21-1.48L20.65 3.2c.83-.31 1.56.2 1.29 1.4Z"/></svg>,
  Trash: (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>,
  Grid: (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  ChevDown: (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  X: (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Ext: (p) => <svg width={p.s||13} height={p.s||13} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>,
};

// ── Ordinal helper ────────────────────────────────────────────
function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ── Icon button (delete-aware) ────────────────────────────────
function RowIconBtn({ children, danger }) {
  const [h, setH] = useStRM(false);
  return (
    <button
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 30, height: 30, borderRadius: 6,
        border: `1px solid ${h && danger ? '#fecaca' : Z.border}`,
        background: h ? (danger ? Z.destructiveSoft : Z.muted) : Z.background,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background 120ms, border-color 120ms',
      }}
    >{children}</button>
  );
}

// ══════════════════════════════════════════════════════════════
// DAY-OF-MONTH PICKER — the redesigned control
// 7-column grid of 1–31, all visible at once, one click to select.
// No weekday headers (a monthly recurrence isn't tied to a weekday).
// 29/30/31 carry a clamp marker + reveal the "fires on last day" hint.
// ══════════════════════════════════════════════════════════════
function DayGrid({ value, onSelect, cell = 36 }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4,
    }}>
      {days.map((d) => {
        const active = d === value;
        const clamps = d >= 29;
        return <DayCell key={d} d={d} active={active} clamps={clamps} cell={cell} onSelect={onSelect}/>;
      })}
    </div>
  );
}

function DayCell({ d, active, clamps, cell, onSelect }) {
  const [h, setH] = useStRM(false);
  return (
    <button
      onClick={() => onSelect(d)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: 'relative', height: cell, minWidth: 0,
        borderRadius: 7, border: `1px solid ${active ? AVR.solid : 'transparent'}`,
        background: active ? AVR.solid : (h ? Z.muted : 'transparent'),
        color: active ? '#fff' : Z.foreground,
        fontSize: 13.5, fontWeight: active ? 600 : 500,
        fontFamily: 'inherit', cursor: 'pointer',
        fontFeatureSettings: '"tnum" 1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 100ms, color 100ms',
      }}
    >
      {d}
      {clamps && (
        <span style={{
          position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)',
          width: 3, height: 3, borderRadius: '50%',
          background: active ? 'rgba(255,255,255,0.8)' : AVR.solid,
        }}/>
      )}
    </button>
  );
}

// Field trigger styled like an input; opens the popover.
function DayTrigger({ value, open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '100%', height: 36, padding: '0 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: `1px solid ${open ? AVR.solid : Z.border}`,
        boxShadow: open ? `0 0 0 3px ${AVR.ring}` : 'none',
        borderRadius: 7, background: Z.background, color: Z.foreground,
        fontSize: 13.5, fontFamily: 'inherit', cursor: 'pointer',
        transition: 'border-color 120ms, box-shadow 120ms',
      }}
    >
      <span style={{ fontWeight: 500, fontFeatureSettings: '"tnum" 1' }}>
        Day {value} <span style={{ color: Z.mutedFg, fontWeight: 400 }}>· the {ordinal(value)}</span>
      </span>
      <RMI.Grid s={15} c={open ? AVR.solid : Z.mutedFg}/>
    </button>
  );
}

// Popover containing the grid.
function DayPopover({ value, onSelect }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20,
      width: 278, padding: 12,
      background: Z.background, border: `1px solid ${Z.border}`,
      borderRadius: 10, boxShadow: '0 8px 24px rgba(9,9,11,0.12)',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: Z.mutedFg,
        textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8, paddingLeft: 2,
      }}>Pick a day</div>
      <DayGrid value={value} onSelect={onSelect}/>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginTop: 10,
        paddingTop: 10, borderTop: `1px solid ${Z.border}`,
        fontSize: 11.5, color: Z.mutedFg,
      }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: AVR.solid, flexShrink: 0 }}/>
        29–31 clamp to the last day in shorter months
      </div>
    </div>
  );
}

// Hint shown under the field for 29/30/31.
function ClampHint() {
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 8,
      padding: '8px 10px', borderRadius: 7,
      background: AVR.tintBg, border: `1px solid ${AVR.tintBorder}`,
    }}>
      <Icons.AlertTriangle size={14} stroke={AVR.solid}/>
      <span style={{ fontSize: 12, color: Z.foreground, lineHeight: 1.45 }}>
        Months without this day will fire on the <strong>last day</strong> instead.
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SURFACE A — Reminders section card
// variant: 'list' | 'empty-linked' | 'empty-unlinked' | 'disconnected' | 'add-disabled'
// ══════════════════════════════════════════════════════════════
const REMINDERS = [
  { anchor: 'On the 5th',              text: 'Submit the meter reading and pay the bill.' },
  { anchor: 'On the 20th',             text: 'Pay the electricity bill before the late fee kicks in.' },
  { anchor: 'On the last day',         text: 'Take an end-of-month photo of the meter.' },
  { anchor: '3 days before month end', text: 'Top up the balance if it’s running low.' },
];

function SectionHeader({ action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '15px 20px', borderBottom: `1px solid ${Z.border}`, gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
          Reminders
        </div>
        <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 2 }}>
          Reminders repeat every month.
        </div>
      </div>
      {action}
    </div>
  );
}

function AddReminderBtn({ onClick }) {
  return (
    <PrimaryBtn onClick={onClick} style={{ flexShrink: 0 }}>
      <SDI.Plus s={13} c="#fff"/> Add reminder
    </PrimaryBtn>
  );
}

// Disabled add button + tooltip ("Connect Telegram first")
function AddDisabled() {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        disabled
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          height: 32, padding: '0 14px', fontSize: 13, fontWeight: 500,
          background: AVR.solid, color: '#fff', border: 'none', borderRadius: 6,
          opacity: 0.45, cursor: 'not-allowed', fontFamily: 'inherit',
        }}
      >
        <SDI.Plus s={13} c="#fff"/> Add reminder
      </button>
      {/* tooltip (dark surface — DS convention for floating elements) */}
      <div style={{
        position: 'absolute', top: 'calc(100% + 9px)', right: 0, zIndex: 5,
        background: '#18181b', color: '#fafafa',
        fontSize: 12, fontWeight: 500, padding: '6px 9px', borderRadius: 6,
        whiteSpace: 'nowrap', boxShadow: '0 6px 18px rgba(9,9,11,0.25)',
      }}>
        Connect Telegram first
        <span style={{
          position: 'absolute', bottom: '100%', right: 18,
          borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
          borderBottom: '5px solid #18181b',
        }}/>
      </div>
    </div>
  );
}

function ReminderRow({ r, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px',
      borderBottom: isLast ? 'none' : `1px solid ${Z.border}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: AVR.tintBg, border: `1px solid ${AVR.tintBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <RMI.Bell s={15} c={AVR.solid}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
          {r.anchor}
        </div>
        <div style={{ fontSize: 12.5, color: Z.mutedFg, marginTop: 2, lineHeight: 1.45 }}>
          {r.text}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <RowIconBtn><SDI.Pencil s={13} c={Z.mutedFg}/></RowIconBtn>
        <RowIconBtn danger><RMI.Trash s={13} c={Z.mutedFg}/></RowIconBtn>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{
      padding: '40px 24px 44px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, marginBottom: 14,
        background: Z.muted, border: `1px solid ${Z.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: Z.mutedFg, marginTop: 5, maxWidth: 320, lineHeight: 1.5 }}>
        {body}
      </div>
      <div style={{ marginTop: 18 }}>{action}</div>
    </div>
  );
}

function DisconnectedBanner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 20px', background: Z.warningSoft,
      borderBottom: `1px solid ${Z.warningBorder}`,
    }}>
      <Icons.AlertTriangle size={15} stroke={Z.warning}/>
      <span style={{ fontSize: 12.5, color: Z.foreground, flex: 1, lineHeight: 1.4 }}>
        Telegram is disconnected — reminders won’t be delivered until you reconnect.
      </span>
      <a href="#" style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
        fontSize: 12.5, fontWeight: 600, color: '#b45309', textDecoration: 'none',
      }}>
        Open settings <RMI.Ext s={12} c="#b45309"/>
      </a>
    </div>
  );
}

function RemindersCard({ variant = 'list' }) {
  let header, body;

  if (variant === 'add-disabled') {
    header = <SectionHeader action={<AddDisabled/>}/>;
    body = (
      <div>
        {REMINDERS.map((r, i) => <ReminderRow key={i} r={r} isLast={i === REMINDERS.length - 1}/>)}
      </div>
    );
  } else if (variant === 'empty-linked') {
    header = <SectionHeader action={<AddReminderBtn/>}/>;
    body = (
      <EmptyState
        icon={<RMI.Bell s={20} c={Z.mutedFg}/>}
        title="No reminders yet"
        body="Add a reminder to get a monthly Telegram nudge for this service."
        action={<PrimaryBtn><SDI.Plus s={13} c="#fff"/> Add reminder</PrimaryBtn>}
      />
    );
  } else if (variant === 'empty-unlinked') {
    header = <SectionHeader action={<AddDisabled/>}/>;
    body = (
      <EmptyState
        icon={<RMI.Telegram s={20} c={Z.mutedFg}/>}
        title="No reminders yet"
        body="Connect Telegram to start getting monthly reminders for this service."
        action={
          <PrimaryBtn>
            <RMI.Telegram s={14} c="#fff"/> Connect Telegram
          </PrimaryBtn>
        }
      />
    );
  } else if (variant === 'disconnected') {
    header = <SectionHeader action={<AddReminderBtn/>}/>;
    body = (
      <div>
        <DisconnectedBanner/>
        {REMINDERS.map((r, i) => <ReminderRow key={i} r={r} isLast={i === REMINDERS.length - 1}/>)}
      </div>
    );
  } else {
    header = <SectionHeader action={<AddReminderBtn/>}/>;
    body = (
      <div>
        {REMINDERS.map((r, i) => <ReminderRow key={i} r={r} isLast={i === REMINDERS.length - 1}/>)}
      </div>
    );
  }

  return <SCard>{header}{body}</SCard>;
}

// ══════════════════════════════════════════════════════════════
// SURFACE B — Add / Edit reminder modal (≤480px)
// ══════════════════════════════════════════════════════════════
function FieldLabel({ children }) {
  return (
    <label style={{
      display: 'block', fontSize: 13, fontWeight: 500,
      color: Z.foreground, marginBottom: 6,
    }}>{children}</label>
  );
}

function ModeRadio({ value, selected, onSelect, label, children }) {
  const active = selected === value;
  return (
    <div
      onClick={() => onSelect(value)}
      style={{
        padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
        border: `1.5px solid ${active ? AVR.solid : Z.border}`,
        background: active ? AVR.tintBg : Z.background,
        transition: 'border-color 120ms, background 120ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${active ? AVR.solid : Z.border}`,
          background: active ? AVR.solid : Z.background,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }}/>}
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: Z.foreground, letterSpacing: -0.1 }}>
          {label}
        </span>
      </div>
      {active && children && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${AVR.tintBorder}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Out-of-scope "before end of month" preset — kept as a plain styled <select>.
function BeforeEndSelect() {
  const opts = [
    'Last day of month', '1 day before end', '2 days before end', '3 days before end',
    '4 days before end', '5 days before end', '6 days before end', '7 days before end',
  ];
  return (
    <div>
      <FieldLabel>When to remind</FieldLabel>
      <div style={{ position: 'relative' }}>
        <select
          defaultValue="3 days before end"
          style={{
            width: '100%', height: 36, padding: '0 34px 0 12px',
            border: `1px solid ${Z.border}`, borderRadius: 7,
            background: Z.background, color: Z.foreground,
            fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
            appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
          }}
        >
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 11, top: 11, pointerEvents: 'none' }}>
          <RMI.ChevDown s={14} c={Z.mutedFg}/>
        </div>
      </div>
    </div>
  );
}

function CharCounter({ count }) {
  const over = count > 280;
  return (
    <span style={{
      fontSize: 11.5, color: over ? Z.destructive : Z.mutedFg,
      fontFeatureSettings: '"tnum" 1',
    }}>{count}/280</span>
  );
}

// The modal. `pickerOpen` forces the day popover open (the key shot).
// `day` sets the selected day; `inline` swaps the popover trigger for the
// always-visible inline grid variant.
function ReminderModal({ title = 'Add reminder', cta = 'Add reminder', mode = 'day', day = 5, pickerOpen = false, inline = false }) {
  const [selMode, setSelMode] = useStRM(mode);
  const [d, setD] = useStRM(day);
  const [open, setOpen] = useStRM(pickerOpen);
  const [text, setText] = useStRM('Submit the meter reading and pay the bill');

  return (
    <div style={{
      width: 480, background: Z.background,
      border: `1px solid ${Z.border}`, borderRadius: 12,
      boxShadow: '0 20px 60px rgba(9,9,11,0.18), 0 4px 16px rgba(9,9,11,0.10)',
      fontFamily: "'Inter', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px', borderBottom: `1px solid ${Z.border}`,
      }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: Z.foreground }}>
          {title}
        </h2>
        <button style={{
          width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}><RMI.X s={15} c={Z.mutedFg}/></button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Field 1 — when to remind */}
        <div>
          <FieldLabel>When to remind</FieldLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ModeRadio value="day" selected={selMode} onSelect={setSelMode} label="Specific day of month">
              {/* Field 2a — the new day picker */}
              <div style={{ fontSize: 12, fontWeight: 500, color: Z.mutedFg, marginBottom: 6 }}>
                Day of month
              </div>
              {inline ? (
                <div style={{
                  padding: 10, border: `1px solid ${Z.border}`, borderRadius: 8, background: Z.background,
                }}>
                  <DayGrid value={d} onSelect={setD} cell={34}/>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <DayTrigger value={d} open={open} onToggle={() => setOpen(o => !o)}/>
                  {open && <DayPopover value={d} onSelect={(n) => setD(n)}/>}
                </div>
              )}
              {d >= 29 && <ClampHint/>}
            </ModeRadio>

            <ModeRadio value="before" selected={selMode} onSelect={setSelMode} label="Before end of month">
              {/* Field 2b — out-of-scope select, kept as-is */}
              <BeforeEndSelect/>
            </ModeRadio>
          </div>
        </div>

        {/* Field 3 — reminder text */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <FieldLabel>Reminder text</FieldLabel>
            <CharCounter count={text.length}/>
          </div>
          <textarea
            value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={280}
            placeholder="e.g. Submit the meter reading and pay the bill"
            style={{
              width: '100%', resize: 'none', padding: '10px 12px',
              border: `1px solid ${Z.border}`, borderRadius: 7,
              background: Z.background, color: Z.foreground,
              fontSize: 13.5, lineHeight: 1.5, fontFamily: 'inherit', outline: 'none',
            }}
          />
          <div style={{ fontSize: 11.5, color: Z.mutedFg, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RMI.Telegram s={12} c={Z.mutedFg}/>
            Delivered to Telegram around 07:00 each matching day.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
        padding: '14px 22px', borderTop: `1px solid ${Z.border}`, background: Z.subtle,
        borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
      }}>
        <OutlineBtn>Cancel</OutlineBtn>
        <PrimaryBtn>{cta}</PrimaryBtn>
      </div>
    </div>
  );
}

// ── Stages / wrappers for the canvas ──────────────────────────
// Light surface behind a standalone state card.
function StateStage({ children, label, maxWidth = 720 }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#f4f4f5',
      padding: '28px 32px', overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased',
    }}>
      {label && (
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: Z.mutedFg,
          textTransform: 'uppercase', marginBottom: 14,
        }}>{label}</div>
      )}
      <div style={{ maxWidth, width: '100%' }}>{children}</div>
    </div>
  );
}

// Modal stage — dimmed page backdrop, modal centered near top.
function ModalStage({ children, label }) {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: '#f4f4f5', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,11,0.42)', backdropFilter: 'blur(2px)' }}/>
      {label && (
        <div style={{
          position: 'absolute', top: 16, fontSize: 11, fontWeight: 500, letterSpacing: 0.6,
          color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', zIndex: 2,
        }}>{label}</div>
      )}
      <div style={{ position: 'relative', zIndex: 3, marginTop: 56 }}>{children}</div>
    </div>
  );
}

// Day-picker variants comparison (popover vs. always-visible inline grid).
function DayPickerVariants() {
  const [a, setA] = useStRM(14);
  const [b, setB] = useStRM(31);
  return (
    <div style={{
      width: '100%', height: '100%', background: '#f4f4f5', padding: '32px',
      display: 'flex', gap: 28, alignItems: 'flex-start',
      fontFamily: "'Inter', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Variant A — popover */}
      <div style={{ flex: 1 }}>
        <VariantHead n="A" title="Popover grid" note="Field trigger opens a 7-column grid — compact, one click reveals all 31 days. (Recommended.)"/>
        <div style={{
          background: Z.card, border: `1px solid ${Z.border}`, borderRadius: 10,
          padding: 18, boxShadow: '0 1px 2px rgba(24,24,27,0.05)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: Z.mutedFg, marginBottom: 6 }}>Day of month</div>
          <div style={{ position: 'relative' }}>
            <DayTrigger value={a} open onToggle={() => {}}/>
            <DayPopover value={a} onSelect={setA}/>
          </div>
          <div style={{ height: 150 }}/>
        </div>
      </div>

      {/* Variant B — inline grid */}
      <div style={{ flex: 1 }}>
        <VariantHead n="B" title="Always-visible inline grid" note="Grid sits directly in the form — zero clicks to reveal, the day is always in view. Costs more vertical space."/>
        <div style={{
          background: Z.card, border: `1px solid ${Z.border}`, borderRadius: 10,
          padding: 18, boxShadow: '0 1px 2px rgba(24,24,27,0.05)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: Z.mutedFg, marginBottom: 8 }}>Day of month</div>
          <div style={{ padding: 10, border: `1px solid ${Z.border}`, borderRadius: 8 }}>
            <DayGrid value={b} onSelect={setB} cell={34}/>
          </div>
          {b >= 29 && <ClampHint/>}
        </div>
      </div>
    </div>
  );
}

function VariantHead({ n, title, note }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
        <span style={{
          width: 22, height: 22, borderRadius: 6, background: AVR.solid, color: '#fff',
          fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{n}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: Z.foreground, letterSpacing: -0.2 }}>{title}</span>
      </div>
      <p style={{ margin: 0, fontSize: 12.5, color: Z.mutedFg, lineHeight: 1.5, maxWidth: 360 }}>{note}</p>
    </div>
  );
}

// ── Exports ───────────────────────────────────────────────────
window.RemindersCard = RemindersCard;
window.ReminderModal = ReminderModal;
window.RemindersStateStage = StateStage;
window.ReminderModalStage = ModalStage;
window.DayPickerVariants = DayPickerVariants;
