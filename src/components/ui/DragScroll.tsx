"use client";

import { useRef, useCallback, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function DragScroll({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const targetScroll = useRef(0);
  const samples = useRef<{ x: number; t: number }[]>([]);
  const rafId = useRef<number>(0);

  const cancelMomentum = useCallback(() => {
    cancelAnimationFrame(rafId.current);
  }, []);

  const getMaxScroll = useCallback(() => {
    if (!ref.current) return 0;
    return ref.current.scrollWidth - ref.current.clientWidth;
  }, []);

  const startMomentum = useCallback(
    (initialVelocity: number) => {
      cancelMomentum();
      let v = initialVelocity;
      let lastTimestamp = performance.now();
      let current = ref.current?.scrollLeft ?? 0;
      const max = getMaxScroll();

      function step(timestamp: number) {
        if (!ref.current) return;
        const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
        lastTimestamp = timestamp;
        v *= Math.pow(0.95, dt * 60);
        current += v * dt * 60;
        current = Math.max(0, Math.min(current, max));
        ref.current.scrollLeft = current;
        if (Math.abs(v) > 0.05) {
          rafId.current = requestAnimationFrame(step);
        }
      }

      rafId.current = requestAnimationFrame(step);
    },
    [cancelMomentum, getMaxScroll],
  );

  function onPointerDown(e: React.PointerEvent) {
    if (!ref.current) return;
    e.preventDefault();
    cancelMomentum();
    isDragging.current = true;
    didDrag.current = false;
    targetScroll.current = ref.current.scrollLeft;
    samples.current = [{ x: e.pageX, t: Date.now() }];
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    ref.current.style.scrollSnapType = "none";
    ref.current.style.cursor = "grabbing";
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !ref.current) return;
    const x = e.pageX;
    const now = Date.now();
    if (Math.abs(x - samples.current[0].x) > 3) didDrag.current = true;
    samples.current.push({ x, t: now });
    if (samples.current.length > 10) samples.current.shift();
    const max = getMaxScroll();
    let newScroll = targetScroll.current - (x - samples.current[0].x);
    if (newScroll < 0) newScroll = newScroll * 0.3;
    else if (newScroll > max) newScroll = max + (newScroll - max) * 0.3;
    ref.current.scrollLeft = newScroll;
  }

  function onPointerUp() {
    if (!ref.current) return;
    isDragging.current = false;
    ref.current.style.cursor = "grab";
    ref.current.style.scrollSnapType = "";

    const s = samples.current;
    if (s.length >= 2) {
      const recent = s.slice(-5);
      const dx = recent[0].x - recent[recent.length - 1].x;
      const dt = (recent[recent.length - 1].t - recent[0].t) / 1000;
      if (dt > 0) {
        startMomentum((dx / dt) * 0.4);
      }
    }
  }

  function onClickCapture(e: React.MouseEvent) {
    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
      didDrag.current = false;
    }
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      className={`${className} drag-scroll`}
      style={{ cursor: "grab", touchAction: "pan-y", willChange: "scroll-position" }}
    >
      {children}
    </div>
  );
}
