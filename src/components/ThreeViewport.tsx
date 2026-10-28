'use client';

import { useEffect, useRef } from 'react';
import type { GameRuntime } from '../game/GameRuntime';
import { ThreeShopView } from '../render3d/ThreeShopView';

export interface ThreeViewportProps {
  runtime: GameRuntime;
  className?: string;
  isInputBlocked?: boolean;
}

export function ThreeViewport({ runtime, className, isInputBlocked = false }: ThreeViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<ThreeShopView | null>(null);
  const isInputBlockedRef = useRef(isInputBlocked);
  const runtimeRef = useRef(runtime);

  isInputBlockedRef.current = isInputBlocked;
  runtimeRef.current = runtime;

  const syncViewState = () => {
    const view = viewRef.current;
    if (!view) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const currentRuntime = runtimeRef.current;
    view.setView(currentRuntime.activeView, reducedMotion);
    view.sync(
      currentRuntime.selectedItemId,
      currentRuntime.canCompose && !isInputBlockedRef.current,
    );
  };

  // Mount view once per runtime instance
  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    let disposed = false;
    const view = new ThreeShopView(
      parent,
      runtime.session,
      runtime.bouquet,
      (selectedId) => {
        if (!disposed) {
          runtimeRef.current.selectItem(selectedId);
        }
      },
      runtime.activeView,
    );
    viewRef.current = view;

    view
      .mount()
      .then(() => {
        if (disposed) {
          view.dispose();
        } else {
          syncViewState();
        }
      })
      .catch((err) => {
        console.error('Failed to mount ThreeShopView:', err);
      });

    const unsubscribe = runtime.subscribe(() => {
      if (!disposed && viewRef.current) {
        syncViewState();
      }
    });

    return () => {
      disposed = true;
      unsubscribe();
      viewRef.current = null;
      view.dispose();
    };
  }, [runtime]);

  // Sync input block and view state without rebuilding Three.js scene/textures
  useEffect(() => {
    syncViewState();
  }, [runtime, isInputBlocked]);

  // Handle prefers-reduced-motion OS changes dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => {
      syncViewState();
    };
    mql.addEventListener?.('change', handler);
    return () => {
      mql.removeEventListener?.('change', handler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ?? 'three-viewport'}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}
    />
  );
}
