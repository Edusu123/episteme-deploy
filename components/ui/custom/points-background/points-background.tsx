'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

// Depth (px of max travel) for each blob, so they drift at different rates
const BLOB_DEPTHS = [60, -90, 120];

const ParticleRing = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reduced motion disables cursor-following entirely, not just the transition
    if (reducedMotion) {
      blobRefs.current.forEach((blob) => {
        if (blob) blob.style.transform = 'translate3d(0, 0, 0)';
      });
      return;
    }

    const handlePointerMove = (event: MouseEvent) => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        blobRefs.current.forEach((blob, index) => {
          if (!blob) return;
          const depth = BLOB_DEPTHS[index];
          blob.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
        });
      });
    };

    window.addEventListener('mousemove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [reducedMotion]);

  const isDark = resolvedTheme === 'dark';
  const backgroundClass = isDark
    ? 'from-slate-950 via-slate-900 to-indigo-950'
    : 'from-slate-100 via-white to-indigo-100';

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${backgroundClass}`}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.55) 0, transparent 35%), radial-gradient(circle at 80% 10%, rgba(34, 211, 238, 0.45) 0, transparent 32%), radial-gradient(circle at 50% 100%, rgba(167, 139, 250, 0.45) 0, transparent 38%)'
            : 'radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.38) 0, transparent 38%), radial-gradient(circle at 80% 10%, rgba(6, 182, 212, 0.32) 0, transparent 32%), radial-gradient(circle at 50% 100%, rgba(124, 58, 237, 0.32) 0, transparent 38%)'
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          ref={(el) => {
            blobRefs.current[0] = el;
          }}
          className={`absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/60' : 'bg-indigo-500/50'}`}
          style={{
            transition: reducedMotion ? 'none' : 'transform 200ms ease-out',
            willChange: 'transform'
          }}
        />
        <div
          ref={(el) => {
            blobRefs.current[1] = el;
          }}
          className={`absolute bottom-[-8%] right-[-6%] h-80 w-80 rounded-full blur-3xl ${isDark ? 'bg-cyan-400/50' : 'bg-cyan-500/45'}`}
          style={{
            transition: reducedMotion ? 'none' : 'transform 320ms ease-out',
            willChange: 'transform'
          }}
        />
        <div
          ref={(el) => {
            blobRefs.current[2] = el;
          }}
          className={`absolute left-[15%] top-[45%] h-56 w-56 rounded-full blur-3xl ${isDark ? 'bg-violet-400/50' : 'bg-violet-500/45'}`}
          style={{
            transition: reducedMotion ? 'none' : 'transform 260ms ease-out',
            willChange: 'transform'
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};

export default ParticleRing;
