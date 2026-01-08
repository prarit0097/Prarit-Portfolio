import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Eye, EyeOff, GripVertical, Save } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSectionSettings, useUpdateSectionVisibility } from '@/hooks/usePortfolioData';
import { toast } from 'sonner';
import type { SectionSetting } from '@/lib/types';

export default function AdminSections() {
  const { data: sections, isLoading } = useSectionSettings();
  const updateVisibility = useUpdateSectionVisibility();
  const [localSections, setLocalSections] = useState<SectionSetting[]>([]);

  useEffect(() => {
    if (sections) {
      setLocalSections(sections);
    }
  }, [sections]);

  const handleToggle = async (sectionKey: string, isVisible: boolean) => {
    // Update local state immediately for better UX
    setLocalSections(prev => 
      prev.map(s => s.section_key === sectionKey ? { ...s, is_visible: isVisible } : s)
    );

    try {
      await updateVisibility.mutateAsync({ sectionKey, isVisible });
      toast.success('Section visibility updated');
    } catch (error) {
      // Revert on error
      setLocalSections(prev => 
        prev.map(s => s.section_key === sectionKey ? { ...s, is_visible: !isVisible } : s)
      );
      toast.error('Failed to update visibility');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
              <LayoutGrid className="h-7 w-7 text-primary" />
              Section Visibility
            </h1>
            <p className="text-muted-foreground mt-1">
              Control which sections are visible on your homepage
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Homepage Sections</CardTitle>
            <CardDescription>
              Toggle sections on/off to control what visitors see on your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-muted-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{section.section_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {section.is_visible ? 'Visible to visitors' : 'Hidden from visitors'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {section.is_visible ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={section.is_visible}
                      onCheckedChange={(checked) => handleToggle(section.section_key, checked)}
                      disabled={updateVisibility.isPending}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}