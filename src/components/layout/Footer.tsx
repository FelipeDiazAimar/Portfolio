import Link from 'next/link';
import { personalInfo } from '@/data/personal-info';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex space-x-4">
            {personalInfo.socials.map((social) => (
              <Button key={social.id} variant="ghost" size="icon" asChild className="social-icon-button-glowing-round">
                <Link href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                  <social.icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {personalInfo.name}. Todos los derechos reservados.
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Diseñado y desarrollado por Felipe Díaz Aimar.
        </p>
      </div>
    </footer>
  );
}
