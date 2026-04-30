import { ChevronLeft, ChevronRight } from "lucide-react";

type TProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const BORDER = "#e4e4e7";
const MUTED_FG = "#71717a";

const MobilePager = ({ page, totalPages, onPrev, onNext }: TProps) => {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    background: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0 4px",
      }}
    >
      <button onClick={onPrev} disabled={prevDisabled} style={navBtnStyle(prevDisabled)}>
        <ChevronLeft size={14} color="#09090b" />
      </button>

      <span style={{ fontSize: 13, color: MUTED_FG }}>
        Page <strong style={{ color: "#09090b" }}>{page}</strong> of {totalPages}
      </span>

      <button onClick={onNext} disabled={nextDisabled} style={navBtnStyle(nextDisabled)}>
        <ChevronRight size={14} color="#09090b" />
      </button>
    </div>
  );
};

export { MobilePager };
