import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
}

export default function LucideIcon({ name, className }: LucideIconProps) {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon className={className} />;
}
