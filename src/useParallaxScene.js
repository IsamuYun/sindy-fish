import { useEffect, useRef, useState } from 'react';

const MAGNITUDE = {
  world: 6,
};

const lerp = (from, to, amount) => from + (to - from) * amount;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function useParallaxScene() {
  const scrollRootRef = useRef(null);
  const worldRef = useRef(null);
  const worldEndRef = useRef(null);
  const sceneOneRef = useRef(null);
  const sceneTwoRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const activePageRef = useRef(0);
  const pageProgressRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const frameRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [uiEntered, setUiEntered] = useState(false);
  const [activePage, setActivePage] = useState(0);

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
    const setPage = (page) => {
      const nextPage = page ? 1 : 0;
      if (activePageRef.current === nextPage) return;
      activePageRef.current = nextPage;
      setActivePage(nextPage);
    };

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

      event.preventDefault();
      if (Math.abs(event.deltaY) < 8) return;
      setPage(event.deltaY > 0 ? 1 : 0);
    };

    const tick = () => {
      const world = worldRef.current;
      const worldEnd = worldEndRef.current;
      const sceneOne = sceneOneRef.current;
      const sceneTwo = sceneTwoRef.current;

      if (world && worldEnd && sceneOne && sceneTwo) {
        currentRef.current = {
          x: lerp(currentRef.current.x, targetRef.current.x, 0.07),
          y: lerp(currentRef.current.y, targetRef.current.y, 0.07),
        };

        const targetProgress = activePageRef.current;
        if (reduceMotionRef.current) {
          pageProgressRef.current = targetProgress;
        } else {
          pageProgressRef.current = lerp(pageProgressRef.current, targetProgress, 0.14);
          if (Math.abs(pageProgressRef.current - targetProgress) < 0.001) {
            pageProgressRef.current = targetProgress;
          }
        }

        const pageProgress = clamp(pageProgressRef.current, 0, 1);
        const rx = reduceMotionRef.current ? 0 : currentRef.current.x;
        const ry = reduceMotionRef.current ? 0 : currentRef.current.y;

        const worldScale = lerp(1.04, 1.08, pageProgress);
        const worldOffset = -10 * pageProgress;
        world.style.opacity = String(lerp(1, 0.88, pageProgress));
        world.style.transform = `translate3d(${rx * MAGNITUDE.world}px, calc(${worldOffset}% + ${ry * MAGNITUDE.world}px), 0) scale(${worldScale})`;

        const endScale = lerp(1.02, 1, pageProgress);
        const endOffset = 100 * (1 - pageProgress);
        worldEnd.style.opacity = String(pageProgress);
        worldEnd.style.transform = `translate3d(${rx * MAGNITUDE.world}px, calc(${endOffset}% + ${ry * MAGNITUDE.world}px), 0) scale(${endScale})`;

        sceneOne.style.opacity = String(1 - pageProgress);
        sceneOne.style.pointerEvents = pageProgress < 0.5 ? 'auto' : 'none';

        sceneTwo.style.opacity = String(pageProgress);
        sceneTwo.style.pointerEvents = pageProgress >= 0.5 ? 'auto' : 'none';
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', updatePointer);
    window.addEventListener('wheel', handleWheel, { passive: false });
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', updatePointer);
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setUiEntered(true), reducedMotion ? 0 : 600);

    return () => {
      window.clearTimeout(enterTimer);
    };
  }, [reducedMotion]);

  const jumpToProgress = (progress) => {
    const nextPage = progress >= 0.5 ? 1 : 0;
    if (activePageRef.current === nextPage) return;
    activePageRef.current = nextPage;
    setActivePage(nextPage);
  };

  return {
    refs: {
      scrollRootRef,
      worldRef,
      worldEndRef,
      sceneOneRef,
      sceneTwoRef,
    },
    activePage,
    uiEntered,
    jumpToProgress,
  };
}
