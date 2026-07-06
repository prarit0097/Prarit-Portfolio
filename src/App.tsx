import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Install = lazy(() => import("./pages/Install"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminForgotPassword = lazy(() => import("./pages/admin/ForgotPassword"));
const AdminResetPassword = lazy(() => import("./pages/admin/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));
const AdminSections = lazy(() => import("./pages/admin/Sections"));
const AdminProjects = lazy(() => import("./pages/admin/Projects"));
const AdminExperience = lazy(() => import("./pages/admin/Experience"));
const AdminSkills = lazy(() => import("./pages/admin/Skills"));
const AdminServices = lazy(() => import("./pages/admin/Services"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminBlog = lazy(() => import("./pages/admin/Blog"));
const AdminEnquiries = lazy(() => import("./pages/admin/Enquiries"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/install" element={<Install />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
                <Route path="/admin/sections" element={<ProtectedRoute><AdminSections /></ProtectedRoute>} />
                <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
                <Route path="/admin/experience" element={<ProtectedRoute><AdminExperience /></ProtectedRoute>} />
                <Route path="/admin/skills" element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
                <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
                <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
                <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
                <Route path="/admin/enquiries" element={<ProtectedRoute><AdminEnquiries /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
