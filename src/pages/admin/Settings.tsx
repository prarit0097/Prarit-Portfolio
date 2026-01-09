import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Minimize2, Maximize2, AlignVerticalSpaceAround } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSiteSettings } from '@/hooks/usePortfolioData';
import { useUpdateSiteSettings } from '@/hooks/useAdminMutations';
import type { SiteSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

const spacingOptions = [
  { value: 'compact', label: 'Compact', icon: Minimize2, description: 'Tighter spacing between sections' },
  { value: 'normal', label: 'Normal', icon: AlignVerticalSpaceAround, description: 'Balanced, default spacing' },
  { value: 'spacious', label: 'Spacious', icon: Maximize2, description: 'More breathing room between sections' },
] as const;

export default function AdminSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl space-y-6"
      >
        <div>
          <h1 className="text-3xl font-display font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your website settings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">SEO Settings</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Site Title</label>
              <Input
                value={formData.site_title || ''}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                placeholder="Prarit Sidana - Portfolio"
              />
              <p className="text-xs text-muted-foreground">Appears in browser tab and search results</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Site Description</label>
              <Textarea
                value={formData.site_description || ''}
                onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                placeholder="Personal portfolio of Prarit Sidana..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Meta description for search engines (max 160 characters)</p>
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Branding</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo URL</label>
                <Input
                  value={formData.logo_url || ''}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Favicon URL</label>
                <Input
                  value={formData.favicon_url || ''}
                  onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={formData.primary_color || '#10b981'}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.primary_color || '#10b981'}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  placeholder="#10b981"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Section Spacing</h2>
            <p className="text-sm text-muted-foreground -mt-4">Control the vertical rhythm between sections on your website</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spacingOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = (formData.section_spacing || 'normal') === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, section_spacing: option.value })}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      isSelected 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={cn(
                        "font-semibold",
                        isSelected && "text-primary"
                      )}>
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Analytics</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Analytics ID</label>
              <Input
                value={formData.analytics_id || ''}
                onChange={(e) => setFormData({ ...formData, analytics_id: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-muted-foreground">Google Analytics measurement ID</p>
            </div>
          </div>

          <Button type="submit" className="btn-primary" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </form>
      </motion.div>
    </AdminLayout>
  );
}
