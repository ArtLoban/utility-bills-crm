"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { TOverflowNavItem } from "../types";

type TMeasurements = {
  cumWidths: number[];
  gap: number;
  moreWidth: number;
};

type TUseOverflowNav = {
  containerRef: RefObject<HTMLDivElement | null>;
  measureRef: RefObject<HTMLDivElement | null>;
  visibleCount: number;
};

export const useOverflowNav = (items: TOverflowNavItem[]): TUseOverflowNav => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const measurements = useRef<TMeasurements | null>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    const m = measurements.current;
    if (!container || !m) return;

    const available = container.clientWidth;
    const n = m.cumWidths.length;

    if (n === 0) {
      setVisibleCount(0);
      return;
    }

    if ((m.cumWidths[n - 1] ?? 0) <= available) {
      setVisibleCount(n);
      return;
    }

    let count = 0;
    for (let k = 1; k <= n; k++) {
      const edge = m.cumWidths[k - 1];
      if (edge !== undefined && edge + m.gap + m.moreWidth <= available) count = k;
      else break;
    }
    setVisibleCount(count);
  }, []);

  useLayoutEffect(() => {
    const layer = measureRef.current;
    if (!layer) return;

    const itemEls = Array.from(layer.querySelectorAll<HTMLElement>("[data-overflow-item]"));
    const moreEl = layer.querySelector<HTMLElement>("[data-overflow-more]");

    const cumWidths = itemEls.map((el) => el.offsetLeft + el.offsetWidth);
    const [first, second] = itemEls;
    const gap = first && second ? second.offsetLeft - (first.offsetLeft + first.offsetWidth) : 0;
    const moreWidth = moreEl?.offsetWidth ?? 0;

    measurements.current = { cumWidths, gap, moreWidth };
    recompute();
  }, [items, recompute]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(recompute);
    observer.observe(container);

    return () => observer.disconnect();
  }, [recompute]);

  return {
    containerRef,
    measureRef,
    visibleCount,
  };
};
