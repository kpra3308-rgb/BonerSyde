"use client";

import { useRef, type ReactNode } from "react";

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

  function onPointerDown(e: React.PointerEvent) {
    if (!ref.current) return;
    e.preventDefault();
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX;
    scrollLeftRef.current = ref.current.scrollLeft;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    ref.current.style.scrollSnapType = "none";
    ref.current.style.cursor = "grabbing";
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !ref.current) return;
    const x = e.pageX;
    if (Math.abs(x - startX.current) > 3) didDrag.current = true;
    ref.current.scrollLeft = scrollLeftRef.current - (x - startX.current);
  }

  function onPointerUp() {
    if (!ref.current) return;
    isDragging.current = false;
    ref.current.style.cursor = "grab";
    ref.current.style.scrollSnapType = "";
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
