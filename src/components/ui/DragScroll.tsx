"use client";

import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function DragScroll({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number>(0);

  function onPointerDown(e: React.PointerEvent) {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeftRef.current = ref.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    cancelAnimationFrame(rafId.current);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    ref.current.style.cursor = "grabbing";
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !ref.current) return;
    const x = e.pageX;
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (lastX.current - x) / dt;
    }
    lastX.current = x;
    lastTime.current = now;
    ref.current.scrollLeft = scrollLeftRef.current - (x - startX.current);
  }

  function onPointerUp() {
    if (!ref.current) return;
    isDragging.current = false;
    ref.current.style.cursor = "grab";

    let v = velocity.current * 100;

    function step() {
      if (!ref.current || Math.abs(v) < 0.3) return;
      ref.current.scrollLeft += v;
      v *= 0.96;
      rafId.current = requestAnimationFrame(step);
    }
    step();
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={className}
      style={{ cursor: "grab", touchAction: "pan-y" }}
    >
      {children}
    </div>
  );
}
