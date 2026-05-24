import type { TLocale } from "@/lib/locale/constants";

type TProps = { locale: TLocale };

const flagStyle = {
  borderRadius: 3,
  flexShrink: 0,
  display: "block",
  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
} as const;

const EnFlag = () => (
  <svg width={28} height={20} viewBox="0 0 20 14" style={flagStyle}>
    <rect width="20" height="14" fill="#012169" />
    <path d="M0,0 L20,14 M20,0 L0,14" stroke="#fff" strokeWidth="2.4" />
    <path d="M0,0 L20,14 M20,0 L0,14" stroke="#C8102E" strokeWidth="1.2" />
    <rect x="8.5" width="3" height="14" fill="#fff" />
    <rect y="5.5" width="20" height="3" fill="#fff" />
    <rect x="9" width="2" height="14" fill="#C8102E" />
    <rect y="6" width="20" height="2" fill="#C8102E" />
  </svg>
);

const UkFlag = () => (
  <svg width={28} height={20} viewBox="0 0 20 14" style={flagStyle}>
    <rect width="20" height="7" fill="#0057B7" />
    <rect y="7" width="20" height="7" fill="#FFD700" />
  </svg>
);

const RuFlag = () => (
  <svg width={28} height={20} viewBox="0 0 20 14" style={flagStyle}>
    <rect width="20" height="4.67" fill="#fff" />
    <rect y="4.67" width="20" height="4.67" fill="#0039A6" />
    <rect y="9.33" width="20" height="4.67" fill="#D52B1E" />
  </svg>
);

export const LocaleFlag = ({ locale }: TProps) => {
  if (locale === "en") return <EnFlag />;
  if (locale === "uk") return <UkFlag />;
  if (locale === "ru") return <RuFlag />;
};
