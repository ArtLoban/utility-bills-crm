const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const generateMonthOptions = (): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const value = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTH_NAMES[d.getUTCMonth()] ?? ""} ${d.getUTCFullYear()}`;
    options.push({ value, label });
  }
  return options;
};

export const MONTH_OPTIONS: { value: string; label: string }[] = generateMonthOptions();
