import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type {
  ProfileSettings,
  SiteSettings,
  SkillCategory,
  Skill,
  Experience,
  Project,
  Service,
  Testimonial,
  BlogPost,
  Enquiry,
  SectionSetting,
  Stat,
} from '@/lib/types';

// Profile Settings
export function useProfileSettings() {
  return useQuery({
    queryKey: ['profile-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as ProfileSettings | null;
    },
  });
}

// Site Settings
export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as SiteSettings | null;
    },
  });
}

// Skills with categories
export function useSkillsWithCategories() {
  return useQuery({
    queryKey: ['skills-with-categories'],
    queryFn: async () => {
      const { data: categories, error: catError } = await supabase
        .from('skill_categories')
        .select('*')
        .order('ordering');
      
      if (catError) throw catError;

      const { data: skills, error: skillError } = await supabase
        .from('skills')
        .select('*')
        .order('ordering');
      
      if (skillError) throw skillError;

      return (categories as SkillCategory[]).map(cat => ({
        ...cat,
        skills: (skills as Skill[]).filter(s => s.category_id === cat.id),
      }));
    },
  });
}

// Experiences
export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('ordering');
      
      if (error) throw error;
      return data as Experience[];
    },
  });
}

// Projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('ordering');
      
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('ordering')
        .limit(3);
      
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!slug,
  });
}

// Services
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('ordering');
      
      if (error) throw error;
      return data as Service[];
    },
  });
}

// Testimonials
export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('ordering');
      
      if (error) throw error;
      return data as Testimonial[];
    },
  });
}

// Blog Posts
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });
}

export function useBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!slug,
  });
}

// Enquiries (admin only)
export function useEnquiries() {
  return useQuery({
    queryKey: ['enquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Enquiry[];
    },
  });
}

// Submit enquiry
export function useSubmitEnquiry() {
  return useMutation({
    mutationFn: async (enquiry: Omit<Enquiry, 'id' | 'status' | 'ip_address' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([enquiry])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}

// Section Settings
export function useSectionSettings() {
  return useQuery({
    queryKey: ['section-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_settings')
        .select('*')
        .order('ordering');

      if (error) throw error;
      return data as SectionSetting[];
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

// Update section visibility
export function useUpdateSectionVisibility() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sectionKey, isVisible }: { sectionKey: string; isVisible: boolean }) => {
      const { data, error } = await supabase
        .from('section_settings')
        .update({ is_visible: isVisible })
        .eq('section_key', sectionKey)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-settings'] });
    },
  });
}

// Stats
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const result = await supabase
        .from('stats')
        .select('*')
        .eq('is_active', true)
        .order('ordering') as unknown as { data: Stat[] | null; error: any };
      
      if (result.error) throw result.error;
      return result.data || [];
    },
  });
}

// All Stats for Admin
export function useAllStats() {
  return useQuery({
    queryKey: ['all-stats'],
    queryFn: async () => {
      const result = await supabase
        .from('stats')
        .select('*')
        .order('ordering') as unknown as { data: Stat[] | null; error: any };
      
      if (result.error) throw result.error;
      return result.data || [];
    },
  });
}
