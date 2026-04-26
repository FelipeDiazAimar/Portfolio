
import { Suspense } from 'react';
import PersonalInfoManager from '@/components/admin/PersonalInfoManager';
import ProjectsManager from '@/components/admin/ProjectsManager';
import ListManager from '@/components/admin/ListManager';

export const revalidate = 0;

export default function AdminPage({
  searchParams,
}: {
  searchParams: { section?: string };
}) {
  const section = searchParams.section || 'personal';

  const sectionTitles: Record<string, string> = {
    personal: "Información Personal",
    projects: "Proyectos",
    education: "Educación",
    experience: "Experiencia",
    skills: "Habilidades",
    certificates: "Títulos y Certificados",
    training: "Entrenamiento Adicional",
    socials: "Redes Sociales"
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-white">{sectionTitles[section] || section}</h1>
      </div>
      <Suspense fallback={<div className="flex items-center justify-center p-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
        {section === 'personal' && <PersonalInfoManager />}
        {section === 'projects' && <ProjectsManager />}
        {section === 'education' && (
          <ListManager 
            table="education" 
            fields={[
              { name: 'institution', label: 'Institución', type: 'text' },
              { name: 'degree', label: 'Título/Grado', type: 'text' },
              { name: 'period', label: 'Periodo', type: 'text' },
              { name: 'details', label: 'Detalles', type: 'textarea' },
              { name: 'icon_name', label: 'Icono (Lucide)', type: 'text' },
            ]} 
          />
        )}
        {section === 'experience' && (
          <ListManager 
            table="experience" 
            fields={[
              { name: 'company', label: 'Empresa', type: 'text' },
              { name: 'role', label: 'Rol/Puesto', type: 'text' },
              { name: 'period', label: 'Periodo', type: 'text' },
              { name: 'responsibilities', label: 'Responsabilidades (separadas por coma)', type: 'text' },
              { name: 'icon_name', label: 'Icono (Lucide)', type: 'text' },
            ]} 
          />
        )}
        {section === 'skills' && (
          <ListManager 
            table="skills" 
            fields={[
              { name: 'name', label: 'Nombre', type: 'text' },
              { name: 'category', label: 'Categoría', type: 'select', options: ['language', 'framework', 'database', 'design', 'other', 'idiomas'] },
              { name: 'icon_name', label: 'Icono (Lucide)', type: 'text' },
            ]} 
          />
        )}
        {section === 'certificates' && (
          <ListManager 
            table="certificates" 
            fields={[
              { name: 'title', label: 'Título', type: 'text' },
              { name: 'issuer', label: 'Emisor', type: 'text' },
              { name: 'year', label: 'Año', type: 'text' },
              { name: 'icon_name', label: 'Icono (Lucide)', type: 'text' },
            ]} 
          />
        )}
        {section === 'training' && (
          <ListManager 
            table="additional_training" 
            fields={[
              { name: 'name', label: 'Nombre', type: 'text' },
              { name: 'icon_name', label: 'Icono (Lucide)', type: 'text' },
            ]} 
          />
        )}
        {section === 'socials' && (
          <ListManager 
            table="socials" 
            fields={[
              { name: 'name', label: 'Plataforma', type: 'text' },
              { name: 'url', label: 'URL', type: 'text' },
              { name: 'icon_name', label: 'Icono (Lucide)', type: 'text' },
            ]} 
          />
        )}
      </Suspense>
    </div>
  );
}
