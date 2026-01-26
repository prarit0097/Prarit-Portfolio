import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitEnquiry } from '@/hooks/usePortfolioData';
import { toast } from 'sonner';
import { checkRateLimit, recordAttempt, formatResetTime } from '@/lib/rateLimit';
import { getSafeErrorMessage } from '@/lib/errorMessages';
import { getAnimationVariants, viewportConfig } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CONTACT_FORM_KEY = 'contact_form_submit';
const MAX_SUBMISSIONS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

export function ContactSection() {
  const submitEnquiry = useSubmitEnquiry();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const { shouldReduceMotion } = useReducedMotion();
  const variants = getAnimationVariants(shouldReduceMotion);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isLimited, resetTime } = checkRateLimit(
      CONTACT_FORM_KEY,
      MAX_SUBMISSIONS,
      RATE_LIMIT_WINDOW
    );
    
    if (isLimited) {
      toast.error(`Too many submissions. Please try again in ${formatResetTime(resetTime)}.`);
      return;
    }
    
    try {
      await submitEnquiry.mutateAsync(formData);
      recordAttempt(CONTACT_FORM_KEY);
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (error) {
      toast.error(getSafeErrorMessage(error));
    }
  };

  return (
    <section id="contact" className="section-wrapper bg-muted/30 relative overflow-hidden" aria-labelledby="contact-heading">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="Get in Touch" subtitle="Have a project in mind? Let's talk." />
        
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
                className="glass-card p-12 text-center"
              >
                <CheckCircle className="h-20 w-20 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-6">
                  Your message has been sent. I'll get back to you soon.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                variants={variants.container}
                initial="hidden"
                {...(shouldReduceMotion 
                  ? { animate: "visible" } 
                  : { whileInView: "visible", viewport: viewportConfig }
                )}
                onSubmit={handleSubmit}
                className="glass-card p-5 md:p-8 space-y-4 md:space-y-6 relative"
              >
                <motion.div 
                  variants={variants.item}
                  className="flex items-center gap-3 mb-2"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Let's create something amazing</span>
                </motion.div>

                <motion.div variants={variants.item} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your company"
                      className="form-input"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={variants.item} className="space-y-1.5 md:space-y-2">
                  <label className="text-sm font-medium">Subject *</label>
                  <Input
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="What's this about?"
                    className="form-input"
                  />
                </motion.div>
                
                <motion.div variants={variants.item} className="space-y-1.5 md:space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="form-input resize-none"
                  />
                </motion.div>
                
                <motion.div variants={variants.item}>
                  <Button
                    type="submit"
                    disabled={submitEnquiry.isPending}
                    className="btn-primary w-full h-12"
                  >
                    {submitEnquiry.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
