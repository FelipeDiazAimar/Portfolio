
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersonalInfo } from '@/types';
import { Award as DefaultIcon } from 'lucide-react'; 
import LucideIcon from '../shared/LucideIcon';

interface CertificatesSectionProps {
  personalInfo: PersonalInfo;
}

export default function CertificatesSection({ personalInfo }: CertificatesSectionProps) {
  if (!personalInfo.certificates || personalInfo.certificates.length === 0) {
    return null;
  }

  return (
    <section id="certificates" className="py-16 lg:py-24 bg-background"> {/* Changed background to match ProjectsSection */}
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Títulos y Certificaciones"
          subtitle="Algunos de mis reconocimientos y certificaciones."
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {personalInfo.certificates.map((cert) => {
            return (
              <Card key={cert.id} className="shadow-lg flex flex-col h-full overflow-hidden project-card-glowing-border">
                <CardHeader className="flex flex-row items-start space-x-4 pb-2 pt-4"> {/* Adjusted padding */}
                  <div className="flex-shrink-0 pt-1">
                    {cert.icon ? (
                      <cert.icon className="h-8 w-8 text-primary" />
                    ) : (
                      cert.icon_name ? <LucideIcon name={cert.icon_name} className="h-8 w-8 text-primary" /> : <DefaultIcon className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold leading-tight">{cert.title}</CardTitle> {/* Adjusted font size */}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-0 pb-4 pl-16 pr-5"> {/* Adjusted padding to align with title */}
                  <p className="text-sm text-primary">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cert.year}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
