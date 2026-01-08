import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader2, Mail, Phone, Building, Calendar, Eye, X } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useEnquiries } from '@/hooks/usePortfolioData';
import { useUpdateEnquiry, useDeleteEnquiry } from '@/hooks/useAdminMutations';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Enquiry } from '@/lib/types';

export default function AdminEnquiries() {
  const { data: enquiries, isLoading } = useEnquiries();
  const updateEnquiry = useUpdateEnquiry();
  const deleteEnquiry = useDeleteEnquiry();

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const filteredEnquiries = enquiries?.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const handleView = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsViewOpen(true);
    // Mark as read if new
    if (enquiry.status === 'new') {
      updateEnquiry.mutate({ id: enquiry.id, status: 'replied' as const });
    }
  };

  const handleStatusChange = (id: string, status: 'new' | 'replied' | 'closed') => {
    updateEnquiry.mutate({ id, status });
  };

  const handleDelete = () => {
    if (selectedEnquiry) {
      deleteEnquiry.mutate(selectedEnquiry.id, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedEnquiry(null);
        },
      });
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-primary/10 text-primary',
    replied: 'bg-green-500/10 text-green-500',
    closed: 'bg-muted text-muted-foreground',
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Enquiries</h1>
            <p className="text-muted-foreground mt-1">Manage contact form submissions</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEnquiries && filteredEnquiries.length > 0 ? (
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-border">
              <AnimatePresence>
                {filteredEnquiries.map((enquiry) => (
                  <motion.div
                    key={enquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{enquiry.name}</h3>
                          <span className={cn('px-2 py-0.5 text-xs rounded-full', statusColors[enquiry.status || 'new'])}>
                            {enquiry.status || 'new'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-primary">{enquiry.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{enquiry.message}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {enquiry.email}
                          </span>
                          {enquiry.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {enquiry.phone}
                            </span>
                          )}
                          {enquiry.company && (
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {enquiry.company}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(enquiry.created_at || '').toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(enquiry)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No enquiries yet</h3>
            <p className="text-muted-foreground">
              Contact form submissions will appear here
            </p>
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Enquiry Details</DialogTitle>
            </DialogHeader>
            {selectedEnquiry && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Select
                      value={selectedEnquiry.status || 'new'}
                      onValueChange={(value: 'new' | 'replied' | 'closed') => {
                        handleStatusChange(selectedEnquiry.id, value);
                        setSelectedEnquiry({ ...selectedEnquiry, status: value });
                      }}
                    >
                      <SelectTrigger className="w-32 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-medium text-primary hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>

                {selectedEnquiry.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${selectedEnquiry.phone}`} className="font-medium">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                )}

                {selectedEnquiry.company && (
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{selectedEnquiry.company}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{selectedEnquiry.subject}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-lg mt-1">
                    {selectedEnquiry.message}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Received</p>
                  <p className="font-medium">
                    {new Date(selectedEnquiry.created_at || '').toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <a href={`mailto:${selectedEnquiry.email}?subject=Re: ${selectedEnquiry.subject}`}>
                    <Button className="btn-primary">
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Enquiry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this enquiry from {selectedEnquiry?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteEnquiry.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AdminLayout>
  );
}
