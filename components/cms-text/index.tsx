import { Fragment } from "react";
import { parse } from "./parser";

type TProps = { value: string };

export const CmsText = ({ value }: TProps) => {
  const segments = parse(value);

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "bold" ? (
          <strong key={i}>{seg.value}</strong>
        ) : seg.type === "code" ? (
          <code key={i} className="bg-muted rounded px-1 py-0.5 font-mono text-[12.5px]">
            {seg.value}
          </code>
        ) : (
          <Fragment key={i}>{seg.value}</Fragment>
        ),
      )}
    </>
  );
};
