import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getSafeErrorMessage } from '@/lib/errorMessages';
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
} from '@/lib/types';

// Profile Settings
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<ProfileSettings>) => {
      const { data: existing } = await supabase
        .from('profile_settings')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      if (existing) {
        const { data: result, error } = await supabase
          .from('profile_settings')
          .update(data)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from('profile_settings')
          .insert([data as ProfileSettings])
          .select()
          .single();
        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-settings'] });
      toast.success('Profile updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

// Site Settings
export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<SiteSettings>) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      if (existing) {
        const { data: result, error } = await supabase
          .from('site_settings')
          .update(data)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from('site_settings')
          .insert([data as SiteSettings])
          .select()
          .single();
        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Site settings updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

// Experiences CRUD
export function useCreateExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('experiences')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience added');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Experience> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('experiences')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

// Projects CRUD
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('projects')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project added');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

// Skills CRUD
export function useCreateSkillCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<SkillCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('skill_categories')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-with-categories'] });
      toast.success('Category added');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useUpdateSkillCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<SkillCategory> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('skill_categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-with-categories'] });
      toast.success('Category updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useDeleteSkillCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('skill_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-with-categories'] });
      toast.success('Category deleted');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('skills')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-with-categories'] });
      toast.success('Skill added');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Skill> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('skills')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-with-categories'] });
      toast.success('Skill updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills-with-categories'] });
      toast.success('Skill deleted');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

// Services CRUD
export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('services')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service added');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Service> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('services')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

// Testimonials CRUD
export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('testimonials')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial added');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Testimonial> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('testimonials')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

// Blog Posts CRUD
export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('blog_posts')
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post added');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<BlogPost> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('blog_posts')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post deleted');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

// Enquiries
export function useUpdateEnquiry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Enquiry> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('enquiries')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry updated');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}

export function useDeleteEnquiry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry deleted');
    },
    onError: (error: Error) => {
      toast.error(getSafeErrorMessage(error));
    },
  });
}
