import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none select-none"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background track (almost invisible dark green) */}
      <div className="absolute inset-0 bg-emerald-950/20" />

      {/* Progress fill using GPU-accelerated scaleX */}
      <div
        className="h-full w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 origin-left transition-transform duration-75 ease-out shadow-[0_0_12px_rgba(52,211,153,0.7)]"
        style={{
          transform: `scaleX(${scrollProgress})`,
        }}
      />

      {/* Leading subtle glow indicator at the head of the progress bar */}
      {scrollProgress > 0.01 && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-300 pointer-events-none filter blur-[3px] opacity-75 transition-all duration-75 ease-out"
          style={{
            left: `calc(${scrollProgress * 100}% - 8px)`,
          }}
        />
      )}
    </div>
  );
};
