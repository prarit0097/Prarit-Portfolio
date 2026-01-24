import { useState, useEffect } from 'react';

interface PerformanceInfo {
  prefersReducedMotion: boolean;
  isLowEndDevice: boolean;
  shouldReduceMotion: boolean;
}

export function useReducedMotion(): PerformanceInfo {
  const [info, setInfo] = useState<PerformanceInfo>({
    prefersReducedMotion: false,
    isLowEndDevice: false,
    shouldReduceMotion: false,
  });

  useEffect(() => {
    // Check prefers-reduced-motion media query
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = motionQuery.matches;

    // Check for low-end device indicators
    const isLowEndDevice = detectLowEndDevice();

    setInfo({
      prefersReducedMotion,
      isLowEndDevice,
      shouldReduceMotion: prefersReducedMotion || isLowEndDevice,
    });

    // Listen for changes to reduced motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      setInfo(prev => ({
        ...prev,
        prefersReducedMotion: e.matches,
        shouldReduceMotion: e.matches || prev.isLowEndDevice,
      }));
    };

    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  return info;
}

function detectLowEndDevice(): boolean {
  // Check hardware concurrency (CPU cores)
  const cpuCores = navigator.hardwareConcurrency || 4;
  const isLowCPU = cpuCores <= 2;

  // Check device memory (if available)
  const deviceMemory = (navigator as any).deviceMemory || 4;
  const isLowMemory = deviceMemory <= 2;

  // Check connection type for slow networks
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && 
    (connection.saveData || 
     connection.effectiveType === 'slow-2g' || 
     connection.effectiveType === '2g');

  // Check if mobile with older user agent patterns
  const userAgent = navigator.userAgent.toLowerCase();
  const isOlderMobile = /android\s*[1-6]\./i.test(userAgent) || 
                        /iphone\s*os\s*[1-9]_/i.test(userAgent);

  return isLowCPU || isLowMemory || isSlowConnection || isOlderMobile;
}

// Static check for SSR/initial render
export function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
