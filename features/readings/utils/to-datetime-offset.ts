export const toDatetimeOffset = (dateStr: string): string => {
  const date = new Date(`${dateStr}T00:00:00`);
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";

  const hh = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const mm = String(Math.abs(offset) % 60).padStart(2, "0");

  return `${dateStr}T00:00:00${sign}${hh}:${mm}`;
};
