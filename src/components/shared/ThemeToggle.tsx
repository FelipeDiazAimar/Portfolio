'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid hydration mismatch and layout shift
    return (
      <div className="flex h-[40px] w-[88px] items-center justify-center space-x-2">
        <Sun className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
        <div className="h-6 w-11 rounded-full bg-input" /> {/* Placeholder for Switch */}
        <Moon className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      </div>
    );
  }

  const isDarkMode = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-colors ${isDarkMode ? 'text-muted-foreground' : 'text-primary'}`} />
      <Switch
        id="theme-toggle"
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme between light and dark mode"
      />
      <Moon className={`h-[1.2rem] w-[1.2rem] transition-colors ${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  );
}
