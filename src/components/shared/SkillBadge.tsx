
import type { Skill } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import React from 'react';
import LucideIcon from './LucideIcon';

interface SkillBadgeProps {
  skill: Skill;
  className?: string;
}

const SkillBadge = React.memo(function SkillBadge({ skill, className }: SkillBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-2 rounded-full border-primary/50 bg-primary/5 px-4 py-2 text-sm text-primary shadow-sm transition-all hover:bg-primary/10 skill-badge-glowing", className)}
    >
      {skill.icon ? (
        <skill.icon className="h-4 w-4" />
      ) : (
        skill.icon_name && <LucideIcon name={skill.icon_name} className="h-4 w-4" />
      )}
      <span>{skill.name}</span>
    </Badge>
  );
});

export default SkillBadge;
