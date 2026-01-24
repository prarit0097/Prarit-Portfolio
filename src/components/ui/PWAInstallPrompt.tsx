import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // Check if user dismissed recently
    const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return; // Don't show for 7 days after dismissal
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show after delay if not installed
    if (isIOSDevice && !isStandalone) {
      setTimeout(() => setShowPrompt(true), 5000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="glass-card p-4 shadow-xl border border-primary/20">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Install App</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isIOS
                  ? 'Tap Share button then "Add to Home Screen"'
                  : 'Install this app for quick access anytime'}
              </p>
            </div>
          </div>

          {!isIOS && (
            <Button
              onClick={handleInstall}
              size="sm"
              className="w-full mt-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Install Now
            </Button>
          )}

          {isIOS && (
            <div className="mt-3 p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Share2 className="h-4 w-4" />
                <span>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
