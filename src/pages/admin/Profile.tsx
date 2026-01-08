import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useProfileSettings } from '@/hooks/usePortfolioData';
import { useUpdateProfile } from '@/hooks/useAdminMutations';
import type { ProfileSettings } from '@/lib/types';

export default function AdminProfile() {
  const { data: profile, isLoading } = useProfileSettings();
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState<Partial<ProfileSettings>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
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
          <h1 className="text-3xl font-display font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tagline</label>
                <Input
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Sales Head & Python Developer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">About</label>
              <Textarea
                value={formData.about || ''}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="Tell visitors about yourself..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Delhi, India"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Social Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <Input
                  value={formData.github_url || ''}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <Input
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Twitter URL</label>
                <Input
                  value={formData.twitter_url || ''}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Instagram URL</label>
                <Input
                  value={formData.instagram_url || ''}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Photo</label>
                <ImageUpload
                  value={formData.profile_photo_url || ''}
                  onChange={(url) => setFormData({ ...formData, profile_photo_url: url })}
                  bucket="portfolio-assets"
                  folder="profile"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Resume URL</label>
                <Input
                  value={formData.resume_url || ''}
                  onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                  placeholder="https://example.com/resume.pdf"
                />
                <p className="text-xs text-muted-foreground">Link to your resume/CV PDF</p>
              </div>
            </div>
          </div>

          <Button type="submit" className="btn-primary" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
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
