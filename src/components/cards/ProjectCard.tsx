
'use client';

import type { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import React from 'react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = React.memo(function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="project-card-glowing-border flex h-full flex-col overflow-hidden shadow-lg transition-shadow">
      <div className="relative h-48 w-full sm:h-56">
        <Image
          src={project.imageUrl}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={project.imageHint || "tech project"}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
        <CardDescription className="h-16 overflow-hidden text-ellipsis">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="font-normal">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex justify-end space-x-2 border-t pt-4">
        {project.liveLink && (
          <Button variant="outline" size="sm" asChild>
            <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Demo
            </Link>
          </Button>
        )}
        {project.frontendRepoLink && project.backendRepoLink ? (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={project.frontendRepoLink} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Frontend
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={project.backendRepoLink} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Backend
              </Link>
            </Button>
          </>
        ) : (
          project.repoLink && (
            <Button variant="outline" size="sm" asChild>
              <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Código
              </Link>
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
});

export default ProjectCard;
