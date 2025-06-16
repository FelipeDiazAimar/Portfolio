
import SectionTitle from '@/components/shared/SectionTitle';
import SkillBadge from '@/components/shared/SkillBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { personalInfo } from '@/data/personal-info';
import { Download, Briefcase, GraduationCap, BookOpenCheck, Languages } from 'lucide-react';
import Link from 'next/link';

const categoryDisplayTitles: Record<string, string> = {
  languages: 'Lenguajes de Programación',
  frameworks: 'Frameworks y Librerías',
  databases: 'Bases de Datos',
  design: 'Herramientas de Diseño',
  other: 'Otras Habilidades y Herramientas',
  idiomas: 'Idiomas',
};

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Sobre Mí"
        />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Biografía</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{personalInfo.bio}</p>
                <Button asChild className="mt-6 cv-download-button-animated">
                  <Link href={personalInfo.cvUrl} target="_blank" rel="noopener noreferrer" download="CV-FELIPE-DIAZ-AIMAR.pdf">
                    Descargar CV <Download className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <GraduationCap className="mr-3 h-6 w-6 text-primary" />
                  Educación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {personalInfo.education.map((edu) => {
                  const Icon = edu.icon || GraduationCap;
                  return (
                    <div key={edu.id} className="flex items-start space-x-4">
                      <div className="mt-1 flex-shrink-0">
                        <Icon className="h-8 w-8 text-primary/80" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{edu.institution}</h3>
                        <p className="text-primary">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.period}</p>
                        {edu.details && <p className="mt-1 text-sm text-muted-foreground">{edu.details}</p>}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Briefcase className="mr-3 h-6 w-6 text-primary" />
                  Experiencia Laboral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {personalInfo.experience.map((exp) => {
                   const Icon = exp.icon || Briefcase;
                   return (
                    <div key={exp.id} className="flex items-start space-x-4">
                       <div className="mt-1 flex-shrink-0">
                        <Icon className="h-8 w-8 text-primary/80" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{exp.company}</h3>
                        <p className="text-primary">{exp.role}</p>
                        <p className="text-sm text-muted-foreground">{exp.period}</p>
                        {exp.responsibilities && (
                          <ul className="mt-1 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                   );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Habilidades Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(Object.keys(personalInfo.skills) as Array<keyof typeof personalInfo.skills>).map((categoryKey) => (
                  personalInfo.skills[categoryKey].length > 0 && (
                    <div key={categoryKey}>
                      <h4 className="mb-3 font-semibold text-muted-foreground">
                        {categoryDisplayTitles[categoryKey] || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {personalInfo.skills[categoryKey].map((skill) => (
                          <SkillBadge key={skill.id} skill={skill} />
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <BookOpenCheck className="mr-3 h-6 w-6 text-primary" />
                  Formación Adicional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {personalInfo.additionalTraining.map((training) => {
                    const Icon = training.icon || BookOpenCheck;
                    return (
                      <li key={training.id} className="flex items-center text-muted-foreground">
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0 text-primary/80" />
                        {training.name}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
