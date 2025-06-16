
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SectionTitle from '@/components/shared/SectionTitle';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { personalInfo } from '@/data/personal-info';
import { Card, CardContent } from '../ui/card';

// Estas variables deben estar en tu archivo .env (o .env.local)
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_EMAILJS_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';


const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    if (EMAILJS_SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID' || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
      toast({
        title: 'Configuración Requerida',
        description: 'Por favor, configura tus credenciales de EmailJS en las variables de entorno o directamente en el código.',
        variant: 'destructive',
      });
      return;
    }

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      to_name: personalInfo.name, 
      message: data.message,
      reply_to: data.email, 
    };
    
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: templateParams,
        }),
      });

      if (response.ok) {
        toast({
          title: '¡Mensaje Enviado!',
          description: 'Gracias por contactarme. Te responderé lo antes posible.',
        });
        form.reset();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al enviar el mensaje.');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.',
        variant: 'destructive',
      });
    }
  }

  return (
    <section id="contact" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Contacto"
          subtitle="¿Tienes alguna pregunta o propuesta? No dudes en contactarme."
        />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <Card className="p-6 md:p-8 shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="tu@correo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Escribe tu mensaje aquí..." rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto cv-download-button-animated">
                  {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </Card>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Información de Contacto</h3>
            <p className="text-muted-foreground">
              Si prefieres, también puedes contactarme a través de los siguientes medios.
            </p>
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Correo Electrónico</p>
                    <a href={`mailto:${personalInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <a href={`tel:${personalInfo.phone.replace(/\s|-/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Ubicación</p>
                    <p className="text-muted-foreground">{personalInfo.city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
