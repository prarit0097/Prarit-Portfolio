import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllStats } from '@/hooks/usePortfolioData';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, Save, GripVertical, Briefcase, Code, Users, Award, Trophy, Star, Target, Zap } from 'lucide-react';
import type { Stat } from '@/lib/types';

const iconOptions = [
  { value: 'Briefcase', label: 'Briefcase', icon: Briefcase },
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Trophy', label: 'Trophy', icon: Trophy },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Target', label: 'Target', icon: Target },
  { value: 'Zap', label: 'Zap', icon: Zap },
];

export default function Stats() {
  const { data: stats, isLoading } = useAllStats();
  const queryClient = useQueryClient();
  const [editingStats, setEditingStats] = useState<Stat[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    if (stats) {
      setEditingStats([...stats]);
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setEditingStats([]);
    setIsEditing(false);
  };

  const updateStat = (id: string, field: keyof Stat, value: any) => {
    setEditingStats(prev => 
      prev.map(stat => 
        stat.id === id ? { ...stat, [field]: value } : stat
      )
    );
  };

  const addNewStat = () => {
    const newStat: Stat = {
      id: `new-${Date.now()}`,
      icon: 'Star',
      value: 0,
      suffix: '+',
      label: 'New Stat',
      ordering: editingStats.length,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingStats(prev => [...prev, newStat]);
  };

  const deleteStat = (id: string) => {
    setEditingStats(prev => prev.filter(stat => stat.id !== id));
  };

  const saveChanges = async () => {
    try {
      // Delete removed stats
      const originalIds = stats?.map(s => s.id) || [];
      const currentIds = editingStats.map(s => s.id).filter(id => !id.startsWith('new-'));
      const deletedIds = originalIds.filter(id => !currentIds.includes(id));

      for (const id of deletedIds) {
        await supabase.from('stats').delete().eq('id', id);
      }

      // Upsert stats
      for (const stat of editingStats) {
        if (stat.id.startsWith('new-')) {
          // Insert new stat
          const { id, created_at, updated_at, ...insertData } = stat;
          await supabase.from('stats').insert([insertData]);
        } else {
          // Update existing stat
          const { id, created_at, updated_at, ...updateData } = stat;
          await supabase.from('stats').update(updateData).eq('id', id);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['all-stats'] });
      toast.success('Stats saved successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving stats:', error);
      toast.error('Failed to save stats');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stats Counter</h1>
            <p className="text-muted-foreground">Manage the stats counter section on your homepage</p>
          </div>
          {!isEditing ? (
            <Button onClick={startEditing}>Edit Stats</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
              <Button onClick={saveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-lg" />
            ))}
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            {editingStats.map((stat, index) => {
              const IconComponent = iconOptions.find(i => i.value === stat.icon)?.icon || Briefcase;
              return (
                <Card key={stat.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                          <Label>Icon</Label>
                          <Select 
                            value={stat.icon} 
                            onValueChange={(value) => updateStat(stat.id, 'icon', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <option.icon className="h-4 w-4" />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Value</Label>
                          <Input
                            type="number"
                            value={stat.value}
                            onChange={(e) => updateStat(stat.id, 'value', parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label>Suffix</Label>
                          <Input
                            value={stat.suffix}
                            onChange={(e) => updateStat(stat.id, 'suffix', e.target.value)}
                            placeholder="+"
                          />
                        </div>

                        <div>
                          <Label>Label</Label>
                          <Input
                            value={stat.label}
                            onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                            placeholder="Years Experience"
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={stat.is_active}
                              onCheckedChange={(checked) => updateStat(stat.id, 'is_active', checked)}
                            />
                            <Label>Active</Label>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteStat(stat.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Button variant="outline" onClick={addNewStat} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Stat
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats?.map((stat) => {
              const IconComponent = iconOptions.find(i => i.value === stat.icon)?.icon || Briefcase;
              return (
                <Card key={stat.id} className={!stat.is_active ? 'opacity-50' : ''}>
                  <CardContent className="p-6 text-center">
                    <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    {!stat.is_active && (
                      <span className="text-xs text-muted-foreground">(Hidden)</span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
