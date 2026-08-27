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
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const samples = useRef<{ x: number; t: number }[]>([]);
  const rafId = useRef<number>(0);

  const cancelMomentum = useCallback(() => {
    cancelAnimationFrame(rafId.current);
  }, []);

  const startMomentum = useCallback(
    (initialVelocity: number) => {
      cancelMomentum();
      let v = initialVelocity;
      let lastTimestamp = performance.now();

      function step(timestamp: number) {
        if (!ref.current) return;
        const dt = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        ref.current.scrollLeft += v * dt * 60;
        v *= 0.94;

        if (Math.abs(v) > 0.05) {
          rafId.current = requestAnimationFrame(step);
        }
      }

      rafId.current = requestAnimationFrame(step);
    },
    [cancelMomentum],
  );

  function onPointerDown(e: React.PointerEvent) {
    if (!ref.current) return;
    e.preventDefault();
    cancelMomentum();
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX;
    scrollLeftRef.current = ref.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    samples.current = [{ x: e.pageX, t: Date.now() }];
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    ref.current.style.cursor = "grabbing";
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !ref.current) return;
    const x = e.pageX;
    const now = Date.now();
    if (Math.abs(x - startX.current) > 3) didDrag.current = true;

    samples.current.push({ x, t: now });
    if (samples.current.length > 8) samples.current.shift();

    ref.current.scrollLeft = scrollLeftRef.current - (x - startX.current);
    lastX.current = x;
    lastTime.current = now;
  }

  function onPointerUp() {
    if (!ref.current) return;
    isDragging.current = false;
    ref.current.style.cursor = "grab";

    const s = samples.current;
    if (s.length >= 2) {
      const recent = s.slice(-4);
      const dx = recent[0].x - recent[recent.length - 1].x;
      const dt = (recent[recent.length - 1].t - recent[0].t) / 1000;
      if (dt > 0) {
        const velocity = (dx / dt) * 0.3;
        startMomentum(velocity);
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
      style={{ cursor: "grab", touchAction: "pan-y" }}
    >
      {children}
    </div>
  );
}
