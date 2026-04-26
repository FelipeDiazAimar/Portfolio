
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SectionTitle from '@/components/shared/SectionTitle';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import type { PersonalInfo } from '@/types';
import { Card, CardContent } from '../ui/card';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_EMAILJS_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';

type ContactMethod = 'whatsapp' | 'email';

interface ContactSectionProps {
  personalInfo: PersonalInfo;
}

export default function ContactSection({ personalInfo }: ContactSectionProps) {
  const [method, setMethod] = useState<ContactMethod>('whatsapp');
  const { toast } = useToast();

  const contactFormSchema = z.object({
    name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
    contactValue: z.string().refine((val) => {
      if (method === 'email') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      } else {
        return /^\d+$/.test(val) && val.length >= 10;
      }
    }, {
      message: method === 'email' 
        ? 'Por favor, introduce un correo electrónico válido.' 
        : 'Introduce un número válido (solo números, min. 10 dígitos).',
    }),
    message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
  });

  type ContactFormValues = z.infer<typeof contactFormSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      contactValue: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    if (method === 'whatsapp') {
      const text = `Hola Felipe! Mi nombre es ${data.name}. \n\n${data.message}\n\nMi contacto: ${data.contactValue}`;
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/5493564690844?text=${encodedText}`;
      window.open(whatsappUrl, '_blank');
      toast({
        title: 'Abriendo WhatsApp...',
        description: 'Se ha generado tu mensaje correctamente.',
      });
      form.reset();
    } else {
      if (EMAILJS_SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID' || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
        toast({
          title: 'Configuración Requerida',
          description: 'Por favor, configura tus credenciales de EmailJS en las variables de entorno.',
          variant: 'destructive',
        });
        return;
      }

      const templateParams = {
        from_name: data.name,
        from_email: data.contactValue,
        to_name: personalInfo.name, 
        message: data.message,
        reply_to: data.contactValue, 
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
          throw new Error('Error al enviar el mensaje.');
        }
      } catch (error) {
        console.error('EmailJS Error:', error);
        toast({
          title: 'Error',
          description: 'Hubo un problema al enviar tu mensaje por email.',
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <section id="contact" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Contacto"
          subtitle="¿Tienes alguna pregunta o propuesta? No dudes en contactarme."
        />

        {/* Selector Dual con Divisor Diagonal */}
        <div className="flex justify-center mb-12">
          <div className="relative w-72 h-14 flex rounded-full overflow-hidden border-2 border-primary/20 bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => {
                setMethod('whatsapp');
                form.setValue('contactValue', '');
                form.clearErrors('contactValue');
              }}
              className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-300 font-bold ${method === 'whatsapp' ? 'text-white' : 'text-muted-foreground hover:text-primary/70'}`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('email');
                form.setValue('contactValue', '');
                form.clearErrors('contactValue');
              }}
              className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-300 font-bold ${method === 'email' ? 'text-white' : 'text-muted-foreground hover:text-primary/70'}`}
              style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <Mail className="w-5 h-5 mr-2" />
              Email
            </button>
            
            {/* Background Slider Animado */}
            <div 
              className={`absolute top-1 bottom-1 transition-all duration-500 ease-in-out bg-primary shadow-lg ${method === 'whatsapp' ? 'left-1 w-[55%]' : 'left-[43%] w-[55%]'}`}
              style={{ 
                clipPath: method === 'whatsapp' 
                  ? 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' 
                  : 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
                borderRadius: method === 'whatsapp' ? '9999px 0 0 9999px' : '0 9999px 9999px 0'
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <Card className="p-6 md:p-8 shadow-lg border-primary/10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" className="apple-input h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{method === 'email' ? 'Correo Electrónico' : 'Número de Teléfono'}</FormLabel>
                      <FormControl>
                        <Input 
                          type={method === 'email' ? 'email' : 'text'} 
                          placeholder={method === 'email' ? 'tu@correo.com' : '5493564690844'} 
                          className="apple-input h-12"
                          {...field} 
                          onChange={(e) => {
                            const val = method === 'whatsapp' ? e.target.value.replace(/\D/g, '') : e.target.value;
                            field.onChange(val);
                          }}
                        />
                      </FormControl>
                      {method === 'whatsapp' && (
                        <FormDescription>
                          Solo números: código de país + región + número (Ej: 5493564690844)
                        </FormDescription>
                      )}
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
                        <Textarea placeholder="Escribe tu mensaje aquí..." rows={6} className="apple-input p-4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-12 text-lg cv-download-button-animated">
                  {form.formState.isSubmitting ? 'Enviando...' : (method === 'whatsapp' ? 'Enviar por WhatsApp' : 'Enviar Email')}
                  {method === 'whatsapp' ? <MessageCircle className="ml-2 h-5 w-5" /> : <Send className="ml-2 h-5 w-5" />}
                </Button>
              </form>
            </Form>
          </Card>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Información de Contacto</h3>
            <p className="text-muted-foreground">
              Si prefieres, también puedes contactarme a través de los siguientes medios.
            </p>
            <Card className="shadow-lg border-primary/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Correo Electrónico</p>
                    <a href={`mailto:${personalInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <a href={`tel:+5493564690844`} className="text-muted-foreground hover:text-primary transition-colors">
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
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
