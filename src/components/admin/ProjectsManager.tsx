
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash, Save, LayoutGrid } from 'lucide-react';

export default function ProjectsManager() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar los proyectos.', variant: 'destructive' });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const itemToSave = { ...editingItem };
    if (!itemToSave.id) {
      itemToSave.id = `proj${Date.now()}`;
    }

    if (itemToSave.technologies && typeof itemToSave.technologies === 'string') {
        itemToSave.technologies = itemToSave.technologies.split(',').map((t: string) => t.trim());
    }

    const { error } = await supabase.from('projects').upsert(itemToSave);
    
    if (error) {
      toast({ title: 'Error', description: 'No se pudo guardar el proyecto.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Proyecto guardado correctamente.' });
      setIsDialogOpen(false);
      fetchItems();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
    
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el proyecto.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Proyecto eliminado.' });
      fetchItems();
    }
  }

  const openAddDialog = () => {
    setEditingItem({
      title: '',
      slug: '',
      description: '',
      longDescription: '',
      imageUrl: '',
      technologies: '',
      liveLink: '',
      repoLink: '',
      frontendRepoLink: '',
      backendRepoLink: '',
      imageHint: '',
      isInProduction: false
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    const itemCopy = { ...item };
    if (Array.isArray(itemCopy.technologies)) {
        itemCopy.technologies = itemCopy.technologies.join(', ');
    }
    setEditingItem(itemCopy);
    setIsDialogOpen(true);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openAddDialog} className="apple-button h-12 px-6 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-5 w-5" /> Nuevo Proyecto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="glass-card rounded-[2.5rem] border-none overflow-hidden group">
            <div className="relative h-48 w-full bg-black/10 dark:bg-white/5">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="flex items-center justify-center h-full opacity-20"><LayoutGrid className="h-12 w-12" /></div>
              )}
              {item.isInProduction && (
                <div className="absolute top-4 right-4 bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">Producción</div>
              )}
            </div>
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-bold truncate">{item.title}</CardTitle>
              <div className="text-xs font-medium opacity-40 uppercase tracking-widest">/{item.slug}</div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <p className="text-sm opacity-60 line-clamp-2 h-10">{item.description}</p>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                  <Edit className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive rounded-xl hover:bg-destructive/10 transition-all" onClick={() => handleDelete(item.id)}>
                  <Trash className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card rounded-[2.5rem]">
            <p className="text-lg opacity-40">No hay proyectos. ¡Empieza creando uno!</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-panel border-none rounded-[3rem] p-0 overflow-hidden max-w-4xl max-h-[90vh] shadow-2xl">
          <DialogHeader className="px-10 pt-10 pb-6 bg-black/5 dark:bg-white/5">
            <DialogTitle className="text-3xl font-bold">{editingItem?.id ? 'Editar' : 'Nuevo'} Proyecto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="px-10 py-8 space-y-8 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold opacity-60 ml-1">Título del Proyecto</label>
                  <Input className="apple-input h-12 px-4" value={editingItem?.title || ''} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold opacity-60 ml-1">Slug (URL friendly)</label>
                  <Input className="apple-input h-12 px-4" value={editingItem?.slug || ''} onChange={e => setEditingItem({ ...editingItem, slug: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold opacity-60 ml-1">Image URL</label>
                  <Input className="apple-input h-12 px-4" value={editingItem?.imageUrl || ''} onChange={e => setEditingItem({ ...editingItem, imageUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold opacity-60 ml-1">Image AI Hint</label>
                  <Input className="apple-input h-12 px-4" value={editingItem?.imageHint || ''} onChange={e => setEditingItem({ ...editingItem, imageHint: e.target.value })} />
                </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                  <label className="text-sm font-semibold opacity-60 ml-1">Tecnologías (comas)</label>
                  <Input className="apple-input h-12 px-4" placeholder="React, Next.js, Supabase..." value={editingItem?.technologies || ''} onChange={e => setEditingItem({ ...editingItem, technologies: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold opacity-60 ml-1">Live Demo Link</label>
                  <Input className="apple-input h-12 px-4" value={editingItem?.liveLink || ''} onChange={e => setEditingItem({ ...editingItem, liveLink: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold opacity-60 ml-1">Repo URL</label>
                  <Input className="apple-input h-12 px-4" value={editingItem?.repoLink || ''} onChange={e => setEditingItem({ ...editingItem, repoLink: e.target.value })} />
                </div>
                <div className="flex items-center space-x-3 pt-4">
                  <Checkbox 
                    id="isInProduction" 
                    className="h-6 w-6 rounded-lg border-2"
                    checked={editingItem?.isInProduction || false} 
                    onCheckedChange={checked => setEditingItem({ ...editingItem, isInProduction: !!checked })} 
                  />
                  <label htmlFor="isInProduction" className="text-base font-semibold opacity-80">¿Está en producción?</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-60 ml-1">Descripción Corta</label>
                <Textarea className="apple-input p-4" rows={2} value={editingItem?.description || ''} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-60 ml-1">Descripción Detallada</label>
                <Textarea className="apple-input p-4" rows={5} value={editingItem?.longDescription || ''} onChange={e => setEditingItem({ ...editingItem, longDescription: e.target.value })} />
              </div>
            </div>

            <DialogFooter className="pt-4 pb-8">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="apple-button h-12 px-6">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="apple-button h-12 px-10 shadow-xl shadow-primary/20">
                {saving ? <Loader2 className="animate-spin mr-3 h-5 w-5" /> : <Save className="mr-3 h-5 w-5" />}
                Guardar Proyecto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
