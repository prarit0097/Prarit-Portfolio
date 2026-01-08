import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminForgotPassword from "./pages/admin/ForgotPassword";
import AdminResetPassword from "./pages/admin/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfile from "./pages/admin/Profile";
import AdminSections from "./pages/admin/Sections";
import AdminProjects from "./pages/admin/Projects";
import AdminExperience from "./pages/admin/Experience";
import AdminSkills from "./pages/admin/Skills";
import AdminServices from "./pages/admin/Services";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminBlog from "./pages/admin/Blog";
import AdminEnquiries from "./pages/admin/Enquiries";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
