export type TSegment = { type: "text" | "bold" | "code"; value: string };

const CODE_RE = /`([^`]*)`/g;
const BOLD_RE = /\*\*([^*]+)\*\*/g;

const parseBold = (input: string): TSegment[] => {
  const out: TSegment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  BOLD_RE.lastIndex = 0;
  while ((m = BOLD_RE.exec(input)) !== null) {
    if (m.index > last) out.push({ type: "text", value: input.slice(last, m.index) });
    out.push({ type: "bold", value: m[1] ?? "" });
    last = m.index + m[0].length;
  }
  if (last < input.length) out.push({ type: "text", value: input.slice(last) });

  return out;
};

export const parse = (input: string): TSegment[] => {
  const out: TSegment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  CODE_RE.lastIndex = 0;
  while ((m = CODE_RE.exec(input)) !== null) {
    if (m.index > last) out.push(...parseBold(input.slice(last, m.index)));
    out.push({ type: "code", value: m[1] ?? "" });
    last = m.index + m[0].length;
  }
  if (last < input.length) out.push(...parseBold(input.slice(last)));

  return out;
};
