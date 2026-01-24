import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Share2, 
  Plus, 
  MoreVertical, 
  Download, 
  CheckCircle2,
  ArrowRight,
  Monitor,
  Apple,
  Chrome
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type DeviceType = 'android' | 'ios' | 'desktop' | 'unknown';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const InstallPage = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('unknown');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    setIsInstalled(isStandalone);

    if (isIOS) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const androidSteps = [
    {
      icon: Chrome,
      title: 'Open in Chrome',
      description: 'Make sure you\'re viewing this website in Google Chrome browser',
    },
    {
      icon: MoreVertical,
      title: 'Tap Menu (⋮)',
      description: 'Tap the three dots menu icon in the top-right corner of Chrome',
    },
    {
      icon: Download,
      title: 'Select "Install App" or "Add to Home Screen"',
      description: 'Scroll down and tap on the install option',
    },
    {
      icon: CheckCircle2,
      title: 'Confirm Installation',
      description: 'Tap "Install" in the popup dialog to add the app to your home screen',
    },
  ];

  const iosSteps = [
    {
      icon: Apple,
      title: 'Open in Safari',
      description: 'This only works in Safari browser (not Chrome or other browsers)',
    },
    {
      icon: Share2,
      title: 'Tap Share Button',
      description: 'Tap the share icon (box with arrow) at the bottom of the screen',
    },
    {
      icon: Plus,
      title: 'Select "Add to Home Screen"',
      description: 'Scroll down in the share sheet and tap "Add to Home Screen"',
    },
    {
      icon: CheckCircle2,
      title: 'Tap "Add"',
      description: 'Confirm by tapping "Add" in the top-right corner',
    },
  ];

  const desktopSteps = [
    {
      icon: Chrome,
      title: 'Open in Chrome or Edge',
      description: 'Use Google Chrome or Microsoft Edge for the best experience',
    },
    {
      icon: Download,
      title: 'Click Install Icon',
      description: 'Look for the install icon (⊕) in the address bar on the right side',
    },
    {
      icon: CheckCircle2,
      title: 'Confirm Installation',
      description: 'Click "Install" in the popup to add the app to your computer',
    },
  ];

  const getSteps = () => {
    switch (deviceType) {
      case 'android':
        return androidSteps;
      case 'ios':
        return iosSteps;
      default:
        return desktopSteps;
    }
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'ios':
        return Apple;
      case 'android':
        return Smartphone;
      default:
        return Monitor;
    }
  };

  const DeviceIcon = getDeviceIcon();
  const steps = getSteps();

  return (
    <>
      <SEO 
        title="Install App | Prarit Sidana"
        description="Install Prarit Sidana's portfolio as an app on your device for quick access and offline viewing."
      />
      <Layout>
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-4">
                  <Download className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  Install the App
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Get quick access to my portfolio anytime, even offline! Install it as an app on your device.
                </p>
              </motion.div>

              {/* Already Installed Message */}
              {isInstalled && (
                <motion.div 
                  variants={itemVariants}
                  className="glass-card p-6 text-center border-green-500/30 bg-green-500/5"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-green-500">App Already Installed!</h2>
                  <p className="text-muted-foreground mt-2">
                    You're viewing this in the installed app. Enjoy the experience!
                  </p>
                </motion.div>
              )}

              {/* Quick Install Button (Android/Desktop with prompt) */}
              {deferredPrompt && !isInstalled && (
                <motion.div variants={itemVariants} className="glass-card p-6 text-center">
                  <h2 className="text-xl font-semibold mb-3">Quick Install</h2>
                  <p className="text-muted-foreground mb-4">
                    Click the button below to install the app instantly!
                  </p>
                  <Button onClick={handleInstallClick} size="lg" className="gap-2">
                    <Download className="w-5 h-5" />
                    Install Now
                  </Button>
                </motion.div>
              )}

              {/* Device Detection */}
              {!isInstalled && (
                <motion.div variants={itemVariants} className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <DeviceIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Detected Device</p>
                      <p className="font-medium capitalize">
                        {deviceType === 'ios' ? 'iPhone / iPad' : 
                         deviceType === 'android' ? 'Android Device' : 
                         'Desktop / Laptop'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Installation Steps */}
              {!isInstalled && (
                <motion.div variants={itemVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {deviceType === 'ios' ? 'How to Install on iPhone/iPad' :
                     deviceType === 'android' ? 'How to Install on Android' :
                     'How to Install on Desktop'}
                  </h2>
                  
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="glass-card p-4 flex items-start gap-4"
                      >
                        <div className="flex-shrink-0">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
                          )}>
                            <span className="text-primary font-bold">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <step.icon className="w-4 h-4 text-primary flex-shrink-0" />
                            <h3 className="font-semibold">{step.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Benefits */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-xl font-semibold">Why Install?</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { title: 'Quick Access', desc: 'Launch directly from home screen' },
                    { title: 'Works Offline', desc: 'View content without internet' },
                    { title: 'Faster Loading', desc: 'App loads instantly' },
                    { title: 'Full Screen', desc: 'No browser UI, pure experience' },
                  ].map((benefit, i) => (
                    <div key={i} className="glass-card p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Other Device Instructions */}
              {!isInstalled && (
                <motion.div variants={itemVariants} className="space-y-4">
                  <h2 className="text-xl font-semibold">Other Devices</h2>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button
                      onClick={() => setDeviceType('android')}
                      className={cn(
                        "glass-card p-4 text-center transition-all hover:border-primary/30",
                        deviceType === 'android' && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <Smartphone className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <span className="text-sm font-medium">Android</span>
                    </button>
                    <button
                      onClick={() => setDeviceType('ios')}
                      className={cn(
                        "glass-card p-4 text-center transition-all hover:border-primary/30",
                        deviceType === 'ios' && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <Apple className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <span className="text-sm font-medium">iPhone/iPad</span>
                    </button>
                    <button
                      onClick={() => setDeviceType('desktop')}
                      className={cn(
                        "glass-card p-4 text-center transition-all hover:border-primary/30",
                        deviceType === 'desktop' && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <Monitor className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <span className="text-sm font-medium">Desktop</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Back to Home */}
              <motion.div variants={itemVariants} className="text-center pt-4">
                <Button variant="ghost" asChild>
                  <a href="/" className="gap-2">
                    Back to Portfolio
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default InstallPage;
