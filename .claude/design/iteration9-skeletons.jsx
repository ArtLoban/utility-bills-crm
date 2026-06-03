/* global React */
// Iteration 9 — Loading skeletons. Depends on iteration9.jsx (window.I9, I9Shell,
// I9MobileTopBar). shadcn Skeleton: muted rounded blocks with a subtle pulse.

// ─── Skeleton primitives ────────────────────────────────────────────────────
function Skel({ w = '100%', h = 14, r = 6, theme = 'light', style }) {
  const z = window.I9[theme];
  return (
    <div style={{
      width: w, height: h, borderRadius: r, background: z.muted,
      animation: 'i9pulse 1.6s ease-in-out infinite', flexShrink: 0, ...style,
    }} />
  );
}

function SkelCard({ theme = 'light', children, style }) {
  const z = window.I9[theme];
  return (
    <div style={{
      background: z.card, border: `1px solid ${z.border}`, borderRadius: 8,
      boxShadow: theme === 'light' ? '0 1px 2px rgba(24,24,27,0.05)' : 'none',
      ...style,
    }}>{children}</div>
  );
}

// ─── Sub-blocks ─────────────────────────────────────────────────────────────
function BalanceSkel({ theme }) {
  const z = window.I9[theme];
  return (
    <SkelCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 18px', borderBottom: `1px solid ${z.border}` }}>
        <Skel theme={theme} w={120} h={11} r={4} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 16 }}>
          {[0, 1].map(i => (
            <div key={i}>
              <Skel theme={theme} w={80} h={11} r={4} style={{ marginBottom: 12 }} />
              <Skel theme={theme} w={150} h={28} r={8} />
              <Skel theme={theme} w={100} h={11} r={4} style={{ marginTop: 12 }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '14px 24px 16px' }}>
        <Skel theme={theme} w={70} h={10} r={4} style={{ marginBottom: 14 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Skel theme={theme} w={30} h={30} r={6} />
              <Skel theme={theme} w={i === 0 ? 200 : i === 1 ? 150 : 130} h={13} r={5} />
              <div style={{ flex: 1 }} />
              <Skel theme={theme} w={80} h={14} r={5} />
            </div>
          ))}
        </div>
      </div>
    </SkelCard>
  );
}

function FiltersSkel({ theme }) {
  const z = window.I9[theme];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '12px 14px', background: z.background,
      border: `1px solid ${z.border}`, borderRadius: 8,
    }}>
      <Skel theme={theme} w={44} h={12} r={4} style={{ marginRight: 4 }} />
      <Skel theme={theme} w={180} h={32} r={6} />
      <Skel theme={theme} w={160} h={32} r={6} />
      <Skel theme={theme} w={150} h={32} r={6} />
      <div style={{ flex: 1 }} />
      <Skel theme={theme} w={120} h={12} r={4} />
    </div>
  );
}

function PieSkel({ theme }) {
  return (
    <SkelCard theme={theme} style={{ padding: 24 }}>
      <Skel theme={theme} w={150} h={14} r={5} />
      <Skel theme={theme} w={90} h={11} r={4} style={{ marginTop: 8 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'center', marginTop: 20 }}>
        <Skel theme={theme} w={200} h={200} r={9999} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Skel theme={theme} w={9} h={9} r={2} />
              <Skel theme={theme} w={[80, 64, 90, 72, 58, 84][i]} h={11} r={4} />
              <div style={{ flex: 1 }} />
              <Skel theme={theme} w={30} h={11} r={4} />
            </div>
          ))}
        </div>
      </div>
    </SkelCard>
  );
}

function ChartSkel({ theme, title = 150, sub = 120, chartH = 200 }) {
  return (
    <SkelCard theme={theme} style={{ padding: 20 }}>
      <Skel theme={theme} w={title} h={14} r={5} />
      <Skel theme={theme} w={sub} h={11} r={4} style={{ marginTop: 8 }} />
      <Skel theme={theme} w="100%" h={chartH} r={8} style={{ marginTop: 16 }} />
    </SkelCard>
  );
}

// ─── Dashboard skeleton (desktop) ───────────────────────────────────────────
function I9SkeletonDashboard({ theme = 'light', height = 1140 }) {
  return (
    <window.I9Shell theme={theme} height={height}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '32px 32px 48px' }}>
        <Skel theme={theme} w={160} h={30} r={8} style={{ marginBottom: 28 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <BalanceSkel theme={theme} />
          <FiltersSkel theme={theme} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
            <PieSkel theme={theme} />
            <ChartSkel theme={theme} title={150} sub={120} chartH={208} />
          </div>
          <ChartSkel theme={theme} title={170} sub={130} chartH={224} />
        </div>
      </div>
    </window.I9Shell>
  );
}

// ─── Dashboard skeleton (mobile, 390px) ─────────────────────────────────────
function I9SkeletonDashboardMobile({ theme = 'light', height = 1320 }) {
  const z = window.I9[theme];
  return (
    <div style={{
      width: 390, height,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: z.foreground, background: z.background,
      display: 'flex', flexDirection: 'column',
      WebkitFontSmoothing: 'antialiased', overflow: 'hidden',
    }}>
      <window.I9MobileTopBar theme={theme} />
      <div style={{ padding: '20px 14px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Skel theme={theme} w={130} h={26} r={8} />
        <BalanceSkel theme={theme} />
        <ChartSkel theme={theme} title={130} sub={90} chartH={220} />
        <ChartSkel theme={theme} title={140} sub={100} chartH={200} />
        <ChartSkel theme={theme} title={150} sub={110} chartH={200} />
      </div>
    </div>
  );
}

// ─── Bills list skeleton (desktop table) ────────────────────────────────────
const BILLS_COLS = '110px 1.5fr 1.1fr 1fr 110px 40px';

function BillsRowSkel({ theme, last }) {
  const z = window.I9[theme];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: BILLS_COLS, alignItems: 'center',
      gap: 16, padding: '0 20px', height: 52,
      borderBottom: last ? 'none' : `1px solid ${z.border}`,
    }}>
      <Skel theme={theme} w={78} h={13} r={5} />
      <Skel theme={theme} w={150} h={13} r={5} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Skel theme={theme} w={8} h={8} r={2} />
        <Skel theme={theme} w={88} h={13} r={5} />
      </div>
      <Skel theme={theme} w={80} h={13} r={5} />
      <Skel theme={theme} w={64} h={13} r={5} style={{ justifySelf: 'end' }} />
      <Skel theme={theme} w={22} h={22} r={5} style={{ justifySelf: 'end' }} />
    </div>
  );
}

function I9SkeletonBills({ theme = 'light', height = 900 }) {
  const z = window.I9[theme];
  return (
    <window.I9Shell theme={theme} height={height}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '32px 32px 48px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <Skel theme={theme} w={90} h={28} r={8} />
            <Skel theme={theme} w={84} h={13} r={5} style={{ marginTop: 10 }} />
          </div>
          <Skel theme={theme} w={96} h={32} r={6} />
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
          padding: '12px 14px', background: z.background,
          border: `1px solid ${z.border}`, borderRadius: 8,
        }}>
          <Skel theme={theme} w={160} h={32} r={6} />
          <Skel theme={theme} w={150} h={32} r={6} />
          <Skel theme={theme} w={150} h={32} r={6} />
          <Skel theme={theme} w={60} h={32} r={6} />
        </div>

        {/* Table */}
        <SkelCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
          {/* header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: BILLS_COLS, alignItems: 'center',
            gap: 16, padding: '0 20px', height: 44,
            borderBottom: `1px solid ${z.border}`, background: z.subtle,
          }}>
            {[44, 64, 56, 50, 56, 0].map((w, i) => (
              w ? <Skel key={i} theme={theme} w={w} h={10} r={4} style={i === 4 ? { justifySelf: 'end' } : null} /> : <div key={i} />
            ))}
          </div>
          {/* body rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <BillsRowSkel key={i} theme={theme} last={i === 7} />
          ))}
        </SkelCard>

        {/* Footer: total + pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <Skel theme={theme} w={170} h={14} r={5} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Skel theme={theme} w={32} h={32} r={6} />
            <Skel theme={theme} w={110} h={13} r={5} style={{ margin: '0 4px' }} />
            <Skel theme={theme} w={32} h={32} r={6} />
          </div>
        </div>
      </div>
    </window.I9Shell>
  );
}

// ─── Bills list skeleton (mobile cards, 390px) ──────────────────────────────
function BillsCardSkel({ theme }) {
  const z = window.I9[theme];
  return (
    <SkelCard theme={theme} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skel theme={theme} w={36} h={36} r={8} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Skel theme={theme} w={150} h={14} r={5} />
          <Skel theme={theme} w={56} h={14} r={5} />
        </div>
        <Skel theme={theme} w={170} h={11} r={4} style={{ marginTop: 9 }} />
      </div>
      <Skel theme={theme} w={24} h={24} r={5} />
    </SkelCard>
  );
}

function I9SkeletonBillsMobile({ theme = 'light', height = 980 }) {
  const z = window.I9[theme];
  return (
    <div style={{
      width: 390, height,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"cv11" 1, "ss01" 1',
      color: z.foreground, background: theme === 'light' ? '#f4f4f5' : z.background,
      display: 'flex', flexDirection: 'column',
      WebkitFontSmoothing: 'antialiased', overflow: 'hidden',
    }}>
      <window.I9MobileTopBar theme={theme} />
      <div style={{ padding: '20px 14px 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <Skel theme={theme} w={70} h={24} r={7} />
            <Skel theme={theme} w={72} h={12} r={4} style={{ marginTop: 9 }} />
          </div>
          <Skel theme={theme} w={74} h={34} r={6} />
        </div>
        {/* Filter trigger */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Skel theme={theme} w={92} h={32} r={6} />
          <Skel theme={theme} w={110} h={12} r={4} />
        </div>
        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => <BillsCardSkel key={i} theme={theme} />)}
        </div>
        {/* Footer total */}
        <SkelCard theme={theme} style={{ marginTop: 16, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Skel theme={theme} w={100} h={13} r={5} />
          <Skel theme={theme} w={90} h={15} r={5} />
        </SkelCard>
      </div>
    </div>
  );
}

Object.assign(window, {
  I9Skel: Skel, I9SkelCard: SkelCard,
  I9SkeletonDashboard, I9SkeletonDashboardMobile,
  I9SkeletonBills, I9SkeletonBillsMobile,
});
