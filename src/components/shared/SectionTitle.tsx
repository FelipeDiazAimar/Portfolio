
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
  subtitle?: string;
}

const SectionTitle = React.memo(function SectionTitle({ title, subtitle, className, ...props }: SectionTitleProps) {
  return (
    <div className={cn("mb-12 text-center", className)} {...props}>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
});

export default SectionTitle;
