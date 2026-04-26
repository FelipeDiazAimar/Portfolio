
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Trash, Save, Plus } from 'lucide-react';

export default function CategoryManager() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<{ old: string, new: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase.from('skills').select('category');
    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar las categorías', variant: 'destructive' });
    } else {
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      setCategories(uniqueCategories);
    }
    setLoading(false);
  }

  async function handleRename() {
    if (!editingCategory || !editingCategory.new.trim()) return;
    setSaving(true);
    
    // Actualizar todas las habilidades que tengan la categoría vieja
    const { error } = await supabase
      .from('skills')
      .update({ category: editingCategory.new })
      .eq('category', editingCategory.old);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo renombrar la categoría.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Categoría actualizada correctamente.' });
      setIsDialogOpen(false);
      fetchCategories();
    }
    setSaving(false);
  }

  async function handleDelete(category: string) {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${category}"? Esto NO eliminará las habilidades, pero las dejará sin categoría asignada.`)) return;
    
    const { error } = await supabase
      .from('skills')
      .update({ category: 'Sin Categoría' })
      .eq('category', category);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la categoría.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Categoría eliminada.' });
      fetchCategories();
    }
  }

  async function handleAdd() {
    if (!newCategoryName.trim()) return;
    // En este sistema, agregar una categoría significa simplemente tenerla disponible 
    // o crear una habilidad "placeholder" para que exista en el Set.
    // Como las categorías son dinámicas basadas en los datos, avisamos que debe asignar una habilidad.
    toast({ 
      title: 'Información', 
      description: 'Para crear una categoría, simplemente asígnala a una nueva habilidad en la sección Habilidades.' 
    });
    setIsAddDialogOpen(false);
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)} className="apple-button h-12 px-6 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-5 w-5" /> Nueva Categoría
        </Button>
      </div>

      <Card className="glass-card rounded-[2.5rem] border-none overflow-hidden">
        <Table>
          <TableHeader className="bg-black/5 dark:bg-white/5">
            <TableRow className="border-b border-black/5 dark:border-white/10 hover:bg-transparent">
              <TableHead className="h-14 px-8 text-sm font-bold uppercase tracking-wider opacity-50">Nombre de Categoría</TableHead>
              <TableHead className="text-right h-14 px-8 text-sm font-bold uppercase tracking-wider opacity-50">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <TableCell className="px-8 py-6 font-medium text-lg">
                  {cat}
                </TableCell>
                <TableCell className="px-8 py-6 text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => { setEditingCategory({ old: cat, new: cat }); setIsDialogOpen(true); }}
                    className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive rounded-xl hover:bg-destructive/10 transition-all" 
                    onClick={() => handleDelete(cat)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog para Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-panel border-none rounded-[3rem] p-0 overflow-hidden max-w-md shadow-2xl">
          <DialogHeader className="px-10 pt-10 pb-6 bg-black/5 dark:bg-white/5">
            <DialogTitle className="text-2xl font-bold">Renombrar Categoría</DialogTitle>
          </DialogHeader>
          <div className="px-10 py-8 space-y-4">
            <p className="text-sm text-muted-foreground">Esto actualizará todas las habilidades que pertenecen a esta categoría.</p>
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">Nuevo Nombre</label>
              <Input 
                className="apple-input h-12 px-4"
                value={editingCategory?.new || ''} 
                onChange={e => setEditingCategory(prev => prev ? { ...prev, new: e.target.value } : null)} 
              />
            </div>
          </div>
          <DialogFooter className="px-10 pb-10">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="apple-button">Cancelar</Button>
            <Button onClick={handleRename} disabled={saving} className="apple-button px-8">
              {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Información de Nueva Categoría */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-panel border-none rounded-[3rem] p-0 overflow-hidden max-w-md shadow-2xl text-center">
          <div className="px-10 py-12 space-y-6">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Nueva Categoría</h2>
              <p className="text-muted-foreground">
                Las categorías se crean automáticamente al asignar un nuevo nombre a una habilidad. 
                Ve a la sección <b>Habilidades</b> y escribe el nombre de la categoría que desees.
              </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(false)} className="apple-button w-full h-12">Entendido</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
