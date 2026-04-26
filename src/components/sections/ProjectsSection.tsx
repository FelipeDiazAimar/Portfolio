import SectionTitle from '@/components/shared/SectionTitle';
import ProjectCard from '@/components/cards/ProjectCard';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Mis Proyectos"
          subtitle="Una selección de algunos de mis trabajos y proyectos personales."
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
