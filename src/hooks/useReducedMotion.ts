import { useState, useEffect, useMemo } from 'react';

interface PerformanceInfo {
  prefersReducedMotion: boolean;
  isLowEndDevice: boolean;
  shouldReduceMotion: boolean;
}

// Helper functions moved outside component for initial calculation
function checkPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function detectLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
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

// Calculate initial values synchronously to prevent flash
function getInitialInfo(): PerformanceInfo {
  const prefersReducedMotion = checkPrefersReducedMotion();
  const isLowEndDevice = detectLowEndDevice();
  return {
    prefersReducedMotion,
    isLowEndDevice,
    shouldReduceMotion: prefersReducedMotion || isLowEndDevice,
  };
}

export function useReducedMotion(): PerformanceInfo {
  // Initialize with actual values to prevent hydration mismatch
  const [info, setInfo] = useState<PerformanceInfo>(getInitialInfo);

  useEffect(() => {
    // Listen for changes to reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
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

// Static check for SSR/initial render
export function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
