"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DRAG_THRESHOLD_PX = 6;

/**
 * 목록 재정렬을 위한 포인터 기반 드래그 훅.
 * 네이티브 HTML5 드래그앤드롭(draggable/onDragStart 등)은 터치 환경에서
 * 동작하지 않으므로, 마우스/터치 모두를 지원하는 Pointer Events로 구현한다.
 * 반환된 onHandlePointerDown을 각 아이템의 "드래그 핸들" 엘리먼트에 연결해야 한다.
 */
export function useDragReorder(
  onReorder: (fromIndex: number, toIndex: number) => void,
) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const itemRefs = useRef(new Map<number, HTMLElement>());
  const onReorderRef = useRef(onReorder);
  const pointerState = useRef<{
    pointerId: number;
    index: number;
    startX: number;
    startY: number;
    active: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    onReorderRef.current = onReorder;
  }, [onReorder]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      if (el) itemRefs.current.set(index, el);
      else itemRefs.current.delete(index);
    },
    [],
  );

  const findIndexAtPoint = useCallback((x: number, y: number) => {
    for (const [index, el] of itemRefs.current) {
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return index;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      const state = pointerState.current;
      if (!state || e.pointerId !== state.pointerId) return;

      if (!state.active) {
        const dx = e.clientX - state.startX;
        const dy = e.clientY - state.startY;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
        state.active = true;
        setDraggingIndex(state.index);
      }

      e.preventDefault();
      const target = findIndexAtPoint(e.clientX, e.clientY);
      setOverIndex((prev) => (prev === target ? prev : target));
    }

    function handleUp(e: PointerEvent) {
      const state = pointerState.current;
      if (!state || e.pointerId !== state.pointerId) return;

      if (state.active) {
        suppressClickRef.current = true;
        const target = findIndexAtPoint(e.clientX, e.clientY);
        if (target !== null && target !== state.index) {
          onReorderRef.current(state.index, target);
        }
      }

      pointerState.current = null;
      setDraggingIndex(null);
      setOverIndex(null);
    }

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [findIndexAtPoint]);

  const onHandlePointerDown = useCallback(
    (index: number) => (e: ReactPointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointerState.current = {
        pointerId: e.pointerId,
        index,
        startX: e.clientX,
        startY: e.clientY,
        active: false,
      };
    },
    [],
  );

  const consumeSuppressedClick = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return true;
    }
    return false;
  }, []);

  return {
    draggingIndex,
    overIndex,
    setItemRef,
    onHandlePointerDown,
    consumeSuppressedClick,
  };
}
