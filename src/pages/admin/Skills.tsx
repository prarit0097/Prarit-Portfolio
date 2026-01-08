import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSkillsWithCategories } from '@/hooks/usePortfolioData';
import {
  useCreateSkillCategory,
  useUpdateSkillCategory,
  useDeleteSkillCategory,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} from '@/hooks/useAdminMutations';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import type { SkillCategory, Skill } from '@/lib/types';

export default function AdminSkills() {
  const { data: categories, isLoading } = useSkillsWithCategories();
  const createCategory = useCreateSkillCategory();
  const updateCategory = useUpdateSkillCategory();
  const deleteCategory = useDeleteSkillCategory();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [isDeleteSkillOpen, setIsDeleteSkillOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '', ordering: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', level: 80, ordering: 0 });

  const toggleCategory = (id: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenCategories(newOpen);
  };

  const handleOpenCategory = (category?: SkillCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        icon: category.icon || '',
        ordering: category.ordering || 0,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', icon: '', ordering: 0 });
    }
    setIsCategoryDialogOpen(true);
  };

  const handleOpenSkill = (categoryId: string, skill?: Skill) => {
    setSelectedCategoryId(categoryId);
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({
        name: skill.name,
        level: skill.level || 80,
        ordering: skill.ordering || 0,
      });
    } else {
      setEditingSkill(null);
      setSkillForm({ name: '', level: 80, ordering: 0 });
    }
    setIsSkillDialogOpen(true);
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, ...categoryForm }, {
        onSuccess: () => setIsCategoryDialogOpen(false),
      });
    } else {
      createCategory.mutate(categoryForm, {
        onSuccess: () => setIsCategoryDialogOpen(false),
      });
    }
  };

  const handleSubmitSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill) {
      updateSkill.mutate({ id: editingSkill.id, ...skillForm }, {
        onSuccess: () => setIsSkillDialogOpen(false),
      });
    } else {
      createSkill.mutate({ ...skillForm, category_id: selectedCategoryId }, {
        onSuccess: () => setIsSkillDialogOpen(false),
      });
    }
  };

  const handleDeleteCategory = () => {
    if (editingCategory) {
      deleteCategory.mutate(editingCategory.id, {
        onSuccess: () => {
          setIsDeleteCategoryOpen(false);
          setEditingCategory(null);
        },
      });
    }
  };

  const handleDeleteSkill = () => {
    if (editingSkill) {
      deleteSkill.mutate(editingSkill.id, {
        onSuccess: () => {
          setIsDeleteSkillOpen(false);
          setEditingSkill(null);
        },
      });
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Skills</h1>
            <p className="text-muted-foreground mt-1">Manage skill categories and items</p>
          </div>
          <Button onClick={() => handleOpenCategory()} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {categories?.map((category) => (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card overflow-hidden"
                >
                  <Collapsible open={openCategories.has(category.id)} onOpenChange={() => toggleCategory(category.id)}>
                    <CollapsibleTrigger asChild>
                      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({category.skills?.length || 0} skills)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCategory(category);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(category);
                              setIsDeleteCategoryOpen(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          {openCategories.has(category.id) ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3">
                        <div className="border-t border-border pt-4">
                          {category.skills && category.skills.length > 0 ? (
                            <div className="space-y-2">
                              {category.skills.map((skill) => (
                                <div
                                  key={skill.id}
                                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">{skill.name}</span>
                                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${skill.level}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOpenSkill(category.id, skill)}
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive"
                                      onClick={() => {
                                        setEditingSkill(skill);
                                        setIsDeleteSkillOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No skills in this category
                            </p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => handleOpenSkill(category.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Skill
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Category Dialog */}
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitCategory} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon (Lucide icon name)</label>
                <Input
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="e.g., Code, TrendingUp"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Order:</label>
                <Input
                  type="number"
                  value={categoryForm.ordering}
                  onChange={(e) => setCategoryForm({ ...categoryForm, ordering: parseInt(e.target.value) || 0 })}
                  className="w-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={createCategory.isPending || updateCategory.isPending}
                >
                  {(createCategory.isPending || updateCategory.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Skill Dialog */}
        <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitSkill} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Level: {skillForm.level}%</label>
                <Slider
                  value={[skillForm.level]}
                  onValueChange={(value) => setSkillForm({ ...skillForm, level: value[0] })}
                  max={100}
                  step={5}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Order:</label>
                <Input
                  type="number"
                  value={skillForm.ordering}
                  onChange={(e) => setSkillForm({ ...skillForm, ordering: parseInt(e.target.value) || 0 })}
                  className="w-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsSkillDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={createSkill.isPending || updateSkill.isPending}
                >
                  {(createSkill.isPending || updateSkill.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {editingSkill ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Category Confirmation */}
        <AlertDialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{editingCategory?.name}"? All skills in this category will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCategory}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteCategory.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Skill Confirmation */}
        <AlertDialog open={isDeleteSkillOpen} onOpenChange={setIsDeleteSkillOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Skill</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{editingSkill?.name}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSkill}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteSkill.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AdminLayout>
  );
}
