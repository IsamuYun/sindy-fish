import { useCallback, useEffect, useRef, useState } from 'react';

const MAGNITUDE = {
  world: 8,
};

// 背景层的“行走”景深：base 是常态过扫描（保持最小，静止时才能看到完整人物），
// PAST 是走过去时的推进，AHEAD 是尚未走到时的退后（乘完 base 后不能小于 1，否则露边）。
const LAYER_BASE_SCALE = 1.04;
const LAYER_DEPTH_PAST = 0.3;
const LAYER_DEPTH_AHEAD = 0.02;
const LAYER_DRIFT = 3;

const WHEEL_THRESHOLD = 8;
const WHEEL_LOCK_MS = 720;
const SWIPE_THRESHOLD = 56;

const lerp = (from, to, amount) => from + (to - from) * amount;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const smoothstep = (value) => value * value * (3 - 2 * value);

// 内部可滚动的内容（如咨询页的说明卡）优先消费滚轮，滚到头之后才翻页。
const canScrollWithin = (node, delta) => {
  let current = node;

  while (current && current !== document.body && current.nodeType === 1) {
    const { overflowY } = window.getComputedStyle(current);
    const scrollable = overflowY === 'auto' || overflowY === 'scroll';

    if (scrollable && current.scrollHeight > current.clientHeight + 1) {
      const atTop = current.scrollTop <= 0;
      const atBottom = current.scrollTop + current.clientHeight >= current.scrollHeight - 1;
      if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) return true;
    }

    current = current.parentElement;
  }

  return false;
};

export function useParallaxScene(pageCount = 2) {
  const scrollRootRef = useRef(null);
  const layerNodesRef = useRef([]);
  const sceneNodesRef = useRef([]);
  const layerSettersRef = useRef(new Map());
  const sceneSettersRef = useRef(new Map());
  const sceneActiveRef = useRef([]);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const activePageRef = useRef(0);
  const pageProgressRef = useRef(0);
  const pageCountRef = useRef(pageCount);
  const reduceMotionRef = useRef(false);
  const frameRef = useRef(0);
  const wheelLockRef = useRef(0);
  const touchStartRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [uiEntered, setUiEntered] = useState(false);
  const [activePage, setActivePage] = useState(0);

  pageCountRef.current = pageCount;

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncReducedMotion = () => {
      reduceMotionRef.current = motionQuery.matches;
      setReducedMotion(motionQuery.matches);
      if (motionQuery.matches) {
        targetRef.current = { x: 0, y: 0 };
      }
    };

    syncReducedMotion();
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', syncReducedMotion);
    } else {
      motionQuery.addListener(syncReducedMotion);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', syncReducedMotion);
      } else {
        motionQuery.removeListener(syncReducedMotion);
      }
    };
  }, []);

  useEffect(() => {
    const goToPage = (page) => {
      const nextPage = clamp(Math.round(page), 0, pageCountRef.current - 1);
      if (activePageRef.current === nextPage) return;
      activePageRef.current = nextPage;
      setActivePage(nextPage);
    };

    const stepPage = (direction) => goToPage(activePageRef.current + direction);

    const updatePointer = (event) => {
      if (reduceMotionRef.current) {
        targetRef.current = { x: 0, y: 0 };
        return;
      }

      targetRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const handleWheel = (event) => {
      if (document.body.classList.contains('modal-open')) return;

      // 翻页动画进行中：吞掉整段手势的余波，别让惯性滚动连翻两页，
      // 也别让它落进下一页的内部滚动区。
      const now = performance.now();
      if (now - wheelLockRef.current < WHEEL_LOCK_MS) {
        event.preventDefault();
        return;
      }

      if (canScrollWithin(event.target, event.deltaY)) return;

      event.preventDefault();
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      wheelLockRef.current = now;
      stepPage(event.deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (event) => {
      if (document.body.classList.contains('modal-open')) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
        return;
      }

      const forward = event.key === 'ArrowDown' || event.key === 'PageDown';
      const backward = event.key === 'ArrowUp' || event.key === 'PageUp';

      if ((forward || backward) && canScrollWithin(target, forward ? 1 : -1)) return;

      if (forward) {
        event.preventDefault();
        stepPage(1);
      } else if (backward) {
        event.preventDefault();
        stepPage(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goToPage(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goToPage(pageCountRef.current - 1);
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) {
        touchStartRef.current = null;
        return;
      }
      touchStartRef.current = { y: event.touches[0].clientY, target: event.target };
    };

    const handleTouchEnd = (event) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || document.body.classList.contains('modal-open')) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaY = start.y - touch.clientY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
      if (canScrollWithin(start.target, deltaY)) return;

      stepPage(deltaY > 0 ? 1 : -1);
    };

    const tick = () => {
      const layers = layerNodesRef.current;
      const scenes = sceneNodesRef.current;

      currentRef.current = {
        x: lerp(currentRef.current.x, targetRef.current.x, 0.07),
        y: lerp(currentRef.current.y, targetRef.current.y, 0.07),
      };

      const targetProgress = activePageRef.current;
      if (reduceMotionRef.current) {
        pageProgressRef.current = targetProgress;
      } else {
        pageProgressRef.current = lerp(pageProgressRef.current, targetProgress, 0.12);
        if (Math.abs(pageProgressRef.current - targetProgress) < 0.001) {
          pageProgressRef.current = targetProgress;
        }
      }

      const pageProgress = clamp(pageProgressRef.current, 0, pageCountRef.current - 1);
      const rx = reduceMotionRef.current ? 0 : currentRef.current.x;
      const ry = reduceMotionRef.current ? 0 : currentRef.current.y;

      for (let index = 0; index < layers.length; index += 1) {
        const layer = layers[index];
        if (!layer) continue;

        // distance < 0：这一层还在前方（远）；> 0：已经从身边走过（近）。
        const distance = pageProgress - index;
        const nearness = clamp(1 - Math.abs(distance), 0, 1);

        if (nearness <= 0) {
          layer.style.opacity = '0';
          layer.style.visibility = 'hidden';
          continue;
        }

        const depth = distance >= 0 ? distance * LAYER_DEPTH_PAST : distance * LAYER_DEPTH_AHEAD;
        const scale = LAYER_BASE_SCALE * (1 + depth);
        const drift = -distance * LAYER_DRIFT;

        layer.style.visibility = 'visible';
        layer.style.opacity = String(smoothstep(nearness));
        layer.style.transform = `translate3d(${rx * MAGNITUDE.world}px, calc(${drift}% + ${
          ry * MAGNITUDE.world
        }px), 0) scale(${scale})`;
      }

      for (let index = 0; index < scenes.length; index += 1) {
        const scene = scenes[index];
        if (!scene) continue;

        const distance = pageProgress - index;
        // 文字比背景更早退场，避免两页文案叠在一起。
        const presence = clamp(1 - Math.abs(distance) * 1.6, 0, 1);
        const isActive = Math.abs(distance) < 0.5;

        scene.style.opacity = String(smoothstep(presence));
        scene.style.transform = `translate3d(0, ${-distance * 26}px, 0)`;
        scene.style.pointerEvents = isActive ? 'auto' : 'none';
        scene.style.visibility = presence <= 0 ? 'hidden' : 'visible';

        if (sceneActiveRef.current[index] !== isActive) {
          sceneActiveRef.current[index] = isActive;
          scene.inert = !isActive;
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', updatePointer);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', updatePointer);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // 每次翻页都从内容顶部开始，避免上一段手势把新页面的内部滚动区带下去。
  useEffect(() => {
    sceneNodesRef.current.forEach((scene) => {
      if (!scene) return;
      scene.querySelectorAll('*').forEach((node) => {
        if (node.scrollTop > 0) node.scrollTop = 0;
      });
    });
  }, [activePage]);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setUiEntered(true), reducedMotion ? 0 : 600);

    return () => {
      window.clearTimeout(enterTimer);
    };
  }, [reducedMotion]);

  const registerLayer = useCallback((index) => {
    const setters = layerSettersRef.current;
    if (!setters.has(index)) {
      setters.set(index, (node) => {
        layerNodesRef.current[index] = node;
      });
    }
    return setters.get(index);
  }, []);

  const registerScene = useCallback((index) => {
    const setters = sceneSettersRef.current;
    if (!setters.has(index)) {
      setters.set(index, (node) => {
        sceneNodesRef.current[index] = node;
      });
    }
    return setters.get(index);
  }, []);

  const jumpToPage = useCallback((page) => {
    const nextPage = clamp(Math.round(page), 0, pageCountRef.current - 1);
    if (activePageRef.current === nextPage) return;
    activePageRef.current = nextPage;
    setActivePage(nextPage);
  }, []);

  return {
    scrollRootRef,
    registerLayer,
    registerScene,
    activePage,
    pageCount,
    uiEntered,
    jumpToPage,
  };
}
