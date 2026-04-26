
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

export default function PersonalInfoManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInfo();
  }, []);

  async function fetchInfo() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('personal_info').select('*').limit(1);
      if (error) {
        console.error(error);
        toast({ title: 'Error', description: 'No se pudo cargar la información personal.', variant: 'destructive' });
      } else if (!data || data.length === 0) {
        // No row found, initialize with defaults
        setInfo({
          name: '',
          title: '',
          city: '',
          email: '',
          phone: '',
          linkedin: '',
          github: '',
          cvUrl: '',
          shortBio: '',
          bio: ''
        });
      } else {
        setInfo(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('personal_info').upsert({ id: 1, ...info });
    if (error) {
      toast({ title: 'Error', description: 'No se pudo guardar los cambios.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Información actualizada correctamente.' });
    }
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="space-y-8">
        <Card className="glass-card rounded-[2.5rem] border-none overflow-hidden">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-2xl font-bold">Datos de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">Nombre Completo</label>
              <Input className="apple-input h-12 px-4" value={info?.name || ''} onChange={e => setInfo({ ...info, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">Título Profesional</label>
              <Input className="apple-input h-12 px-4" value={info?.title || ''} onChange={e => setInfo({ ...info, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">Email</label>
              <Input className="apple-input h-12 px-4" type="email" value={info?.email || ''} onChange={e => setInfo({ ...info, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">Teléfono</label>
              <Input className="apple-input h-12 px-4" value={info?.phone || ''} onChange={e => setInfo({ ...info, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">Ciudad</label>
              <Input className="apple-input h-12 px-4" value={info?.city || ''} onChange={e => setInfo({ ...info, city: e.target.value })} />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">CV URL (o ruta pública)</label>
              <Input className="apple-input h-12 px-4" value={info?.cvUrl || ''} onChange={e => setInfo({ ...info, cvUrl: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-[2.5rem] border-none overflow-hidden">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-2xl font-bold">Redes Sociales</CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">LinkedIn URL</label>
              <Input className="apple-input h-12 px-4" value={info?.linkedin || ''} onChange={e => setInfo({ ...info, linkedin: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">GitHub URL</label>
              <Input className="apple-input h-12 px-4" value={info?.github || ''} onChange={e => setInfo({ ...info, github: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-[2.5rem] border-none overflow-hidden">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-2xl font-bold">Sobre Mí</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">Resumen Corto (Short Bio)</label>
              <Input className="apple-input h-12 px-4" value={info?.shortBio || ''} onChange={e => setInfo({ ...info, shortBio: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-60 ml-1">Biografía Completa</label>
              <Textarea className="apple-input p-4" rows={6} value={info?.bio || ''} onChange={e => setInfo({ ...info, bio: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving} className="apple-button h-14 px-10 text-lg shadow-xl shadow-primary/20">
            {saving ? <Loader2 className="animate-spin mr-3 h-5 w-5" /> : <Save className="mr-3 h-5 w-5" />}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
