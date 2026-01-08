import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Briefcase, 
  Code, 
  Mail, 
  MessageSquare, 
  FileText,
  TrendingUp,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useProjects, useExperiences, useSkillsWithCategories, useEnquiries, useTestimonials, useBlogPosts } from '@/hooks/usePortfolioData';

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

export default function AdminDashboard() {
  const { data: projects } = useProjects();
  const { data: experiences } = useExperiences();
  const { data: skillCategories } = useSkillsWithCategories();
  const { data: enquiries } = useEnquiries();
  const { data: testimonials } = useTestimonials();
  const { data: blogPosts } = useBlogPosts();

  const newEnquiries = enquiries?.filter(e => e.status === 'new').length || 0;
  const totalSkills = skillCategories?.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0) || 0;

  const stats = [
    { label: 'Projects', value: projects?.length || 0, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-500' },
    { label: 'Experiences', value: experiences?.length || 0, icon: Briefcase, href: '/admin/experience', color: 'text-green-500' },
    { label: 'Skills', value: totalSkills, icon: Code, href: '/admin/skills', color: 'text-purple-500' },
    { label: 'Enquiries', value: enquiries?.length || 0, icon: Mail, href: '/admin/enquiries', color: 'text-orange-500', badge: newEnquiries },
    { label: 'Testimonials', value: testimonials?.length || 0, icon: MessageSquare, href: '/admin/testimonials', color: 'text-pink-500' },
    { label: 'Blog Posts', value: blogPosts?.length || 0, icon: FileText, href: '/admin/blog', color: 'text-cyan-500' },
  ];

  const quickActions = [
    { label: 'Add Project', href: '/admin/projects', icon: FolderOpen },
    { label: 'View Enquiries', href: '/admin/enquiries', icon: Mail },
    { label: 'Edit Profile', href: '/admin/profile', icon: TrendingUp },
    { label: 'View Website', href: '/', icon: Eye, external: true },
  ];

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your portfolio.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="glass-card p-4 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                {stat.badge ? (
                  <span className="px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                    {stat.badge} new
                  </span>
                ) : null}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.label}
              </p>
            </Link>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-display font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                target={action.external ? '_blank' : undefined}
                className="glass-card p-4 flex items-center gap-3 hover:bg-accent/50 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <action.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
                {action.external && (
                  <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Enquiries */}
        {enquiries && enquiries.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold">Recent Enquiries</h2>
              <Link to="/admin/enquiries" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="glass-card overflow-hidden">
              <div className="divide-y divide-border">
                {enquiries.slice(0, 5).map((enquiry) => (
                  <div key={enquiry.id} className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{enquiry.name}</p>
                      <p className="text-sm text-muted-foreground">{enquiry.subject}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          enquiry.status === 'new'
                            ? 'bg-primary/10 text-primary'
                            : enquiry.status === 'replied'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(enquiry.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
