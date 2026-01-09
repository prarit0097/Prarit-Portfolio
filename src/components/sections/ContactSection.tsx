import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitEnquiry, useProfileSettings } from '@/hooks/usePortfolioData';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function ContactSection() {
  const { data: profile } = useProfileSettings();
  const submitEnquiry = useSubmitEnquiry();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitEnquiry.mutateAsync(formData);
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="section-wrapper bg-muted/30 relative overflow-hidden" aria-labelledby="contact-heading">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl"
        animate={{ scale: [1, 0.8, 1], x: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="Get in Touch" subtitle="Have a project in mind? Let's talk." />
        
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="glass-card p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <CheckCircle className="h-20 w-20 text-primary mx-auto mb-4" />
                  </motion.div>
                </motion.div>
                <motion.h3 
                  className="text-2xl font-display font-semibold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Thank You!
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Your message has been sent. I'll get back to you soon.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    onClick={() => setIsSubmitted(false)} 
                    variant="outline"
                    className="group"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    Send Another Message
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="glass-card p-8 space-y-6 relative"
              >
                {/* Form header */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-3 mb-2"
                >
                  <motion.div 
                    className="p-2 rounded-lg bg-primary/10"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-muted-foreground">Let's create something amazing</span>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium">Name *</label>
                    <motion.div
                      animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your name"
                        className="form-input transition-shadow focus:shadow-lg focus:shadow-primary/10"
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <motion.div
                      animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="your@email.com"
                        className="form-input transition-shadow focus:shadow-lg focus:shadow-primary/10"
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <motion.div
                      animate={{ scale: focusedField === 'phone' ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+91 98765 43210"
                        className="form-input transition-shadow focus:shadow-lg focus:shadow-primary/10"
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <motion.div
                      animate={{ scale: focusedField === 'company' ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        onFocus={() => setFocusedField('company')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your company"
                        className="form-input transition-shadow focus:shadow-lg focus:shadow-primary/10"
                      />
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium">Subject *</label>
                  <motion.div
                    animate={{ scale: focusedField === 'subject' ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="What's this about?"
                      className="form-input transition-shadow focus:shadow-lg focus:shadow-primary/10"
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <motion.div
                    animate={{ scale: focusedField === 'message' ? 1.01 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell me about your project..."
                      rows={5}
                      className="form-input resize-none transition-shadow focus:shadow-lg focus:shadow-primary/10"
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={submitEnquiry.isPending}
                      className="btn-primary w-full h-12 group relative overflow-hidden"
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      {submitEnquiry.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
