
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import { personalInfo } from '@/data/personal-info';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section id="hero" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {personalInfo.name}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              {personalInfo.title}. {personalInfo.shortBio}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="#projects">
                  Ver Proyectos <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto cv-download-button-animated">
                <Link href={personalInfo.cvUrl} download="CV-FELIPE-DIAZ-AIMAR.pdf">
                  Descargar CV <FileText className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto h-80 w-80 overflow-hidden rounded-full shadow-xl lg:h-96 lg:w-96">
             <Image
              src="/felipe_profile.jpg"
              alt={personalInfo.name}
              fill
              className="object-cover"
              priority
              data-ai-hint="professional portrait"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
