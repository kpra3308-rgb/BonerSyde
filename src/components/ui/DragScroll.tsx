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
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number>(0);

  function onMouseDown(e: React.MouseEvent) {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeft.current = ref.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    cancelAnimationFrame(rafId.current);
    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX;
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (lastX.current - x) / dt;
    }
    lastX.current = x;
    lastTime.current = now;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current);
  }

  function onMouseUp() {
    if (!ref.current) return;
    isDragging.current = false;
    ref.current.style.cursor = "grab";
    ref.current.style.userSelect = "";

    let v = velocity.current * 80;

    function step() {
      if (!ref.current || Math.abs(v) < 0.5) return;
      ref.current.scrollLeft += v;
      v *= 0.95;
      rafId.current = requestAnimationFrame(step);
    }
    step();
  }

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className={className}
      style={{ cursor: "grab" }}
    >
      {children}
    </div>
  );
}
