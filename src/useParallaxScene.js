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
  const scrollProgressRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const frameRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [uiEntered, setUiEntered] = useState(false);

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
    const readScroll = () => {
      const root = scrollRootRef.current;
      if (!root) return;

      const scrollable = root.offsetHeight - window.innerHeight;
      scrollProgressRef.current =
        scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
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

        const rx = reduceMotionRef.current ? 0 : currentRef.current.x;
        const ry = reduceMotionRef.current ? 0 : currentRef.current.y;
        const progress = scrollProgressRef.current;
        const worldScale = lerp(1.1, 1.24, progress);
        world.style.opacity = '1';
        world.style.transform = `scale(${worldScale}) translate3d(${rx * MAGNITUDE.world}px, ${ry * MAGNITUDE.world}px, 0)`;

        const endOpacity = clamp((progress - 0.58) / 0.12, 0, 1);
        const endScale = lerp(1.02, 1.12, progress);
        worldEnd.style.opacity = String(endOpacity);
        worldEnd.style.transform = `scale(${endScale}) translate3d(${rx * MAGNITUDE.world}px, ${ry * MAGNITUDE.world}px, 0)`;

        const sceneOneOpacity = clamp(1 - progress / 0.22, 0, 1);
        sceneOne.style.opacity = String(sceneOneOpacity);
        sceneOne.style.pointerEvents = sceneOneOpacity > 0.05 ? 'auto' : 'none';

        const sceneTwoOpacity = clamp((progress - 0.68) / 0.16, 0, 1);
        sceneTwo.style.opacity = String(sceneTwoOpacity);
        sceneTwo.style.pointerEvents = sceneTwoOpacity > 0.05 ? 'auto' : 'none';
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll);
    window.addEventListener('mousemove', updatePointer);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
      window.removeEventListener('mousemove', updatePointer);
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
    const root = scrollRootRef.current;
    if (!root) return;

    const scrollable = root.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: scrollable * clamp(progress, 0, 1),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return {
    refs: {
      scrollRootRef,
      worldRef,
      worldEndRef,
      sceneOneRef,
      sceneTwoRef,
    },
    uiEntered,
    jumpToProgress,
  };
}
