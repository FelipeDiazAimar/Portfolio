
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash, Save } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

interface ListManagerProps {
  table: string;
  fields: Field[];
}

export default function ListManager({ table, fields }: ListManagerProps) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, [table]);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      toast({ title: 'Error', description: `No se pudieron cargar los datos de ${table}`, variant: 'destructive' });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    // Simple ID generation for new items if not present
    const itemToSave = { ...editingItem };
    if (!itemToSave.id) {
      itemToSave.id = Math.random().toString(36).substr(2, 9);
    }

    // Special handling for responsibilities (array)
    if (itemToSave.responsibilities && typeof itemToSave.responsibilities === 'string') {
        itemToSave.responsibilities = itemToSave.responsibilities.split(',').map((r: string) => r.trim());
    }

    const { error } = await supabase.from(table).upsert(itemToSave);
    
    if (error) {
      toast({ title: 'Error', description: 'No se pudo guardar el registro.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Registro guardado correctamente.' });
      setIsDialogOpen(false);
      fetchItems();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el registro.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Registro eliminado.' });
      fetchItems();
    }
  }

  const openAddDialog = () => {
    const newItem: any = {};
    fields.forEach(f => newItem[f.name] = f.type === 'select' ? f.options?.[0] : '');
    setEditingItem(newItem);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    const itemCopy = { ...item };
    if (Array.isArray(itemCopy.responsibilities)) {
        itemCopy.responsibilities = itemCopy.responsibilities.join(', ');
    }
    setEditingItem(itemCopy);
    setIsDialogOpen(true);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openAddDialog} className="apple-button h-12 px-6 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-5 w-5" /> Agregar Nuevo
        </Button>
      </div>

      <Card className="glass-card rounded-[2.5rem] border-none overflow-hidden">
        <Table>
          <TableHeader className="bg-black/5 dark:bg-white/5">
            <TableRow className="border-b border-black/5 dark:border-white/10 hover:bg-transparent">
              {fields.slice(0, 3).map(f => (
                <TableHead key={f.name} className="h-14 px-8 text-sm font-bold uppercase tracking-wider opacity-50">{f.label}</TableHead>
              ))}
              <TableHead className="text-right h-14 px-8 text-sm font-bold uppercase tracking-wider opacity-50">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                {fields.slice(0, 3).map(f => (
                  <TableCell key={f.name} className="px-8 py-6 max-w-[300px] truncate font-medium">
                    {item[f.name]}
                  </TableCell>
                ))}
                <TableCell className="px-8 py-6 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive rounded-xl hover:bg-destructive/10 transition-all" onClick={() => handleDelete(item.id)}>
                    <Trash className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
                <TableRow>
                    <TableCell colSpan={fields.length + 1} className="text-center py-20 text-muted-foreground">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-full">
                            <Plus className="h-8 w-8 opacity-20" />
                          </div>
                          <p className="text-lg font-medium opacity-40">No hay registros encontrados</p>
                        </div>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-panel border-none rounded-[3rem] p-0 overflow-hidden max-w-2xl shadow-2xl">
          <DialogHeader className="px-10 pt-10 pb-6 bg-black/5 dark:bg-white/5">
            <DialogTitle className="text-3xl font-bold">{editingItem?.id ? 'Editar' : 'Nuevo'} Registro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="px-10 py-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {fields.map(f => (
                <div key={f.name} className="space-y-2">
                  <label className="text-sm font-semibold opacity-60 ml-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <Textarea 
                      className="apple-input p-4 min-h-[120px]"
                      value={editingItem?.[f.name] || ''} 
                      onChange={e => setEditingItem({ ...editingItem, [f.name]: e.target.value })} 
                    />
                  ) : f.type === 'select' ? (
                    <Select 
                      value={editingItem?.[f.name]} 
                      onValueChange={val => setEditingItem({ ...editingItem, [f.name]: val })}
                    >
                      <SelectTrigger className="apple-input h-12 px-4">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent className="glass-panel border-none rounded-2xl">
                        {f.options?.map(opt => (
                          <SelectItem key={opt} value={opt} className="rounded-xl focus:bg-primary focus:text-white">{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      className="apple-input h-12 px-4"
                      value={editingItem?.[f.name] || ''} 
                      onChange={e => setEditingItem({ ...editingItem, [f.name]: e.target.value })} 
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="apple-button h-12 px-6">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="apple-button h-12 px-8 shadow-lg shadow-primary/20">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
