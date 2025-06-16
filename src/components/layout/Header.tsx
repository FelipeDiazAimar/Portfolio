
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, CodeXml } from 'lucide-react';
import type { NavItem } from '@/types';
import { personalInfo } from '@/data/personal-info';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

const navItems: NavItem[] = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Sobre Mí', href: '#about' },
  { label: 'Títulos', href: '#certificates' },
  { label: 'Contacto', href: '#contact' },
];

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = '';
      navItems.forEach(item => {
        const section = document.querySelector(item.href);
        if (section && section.getBoundingClientRect().top <= 100 && section.getBoundingClientRect().bottom >= 100) {
          currentSection = item.href;
        }
      });
      // If no section is strictly "active" (e.g., at the very top or bottom of the page),
      // try to find the one closest to the top of the viewport.
      if (!currentSection) {
        let minDistance = Infinity;
        navItems.forEach(item => {
            const section = document.querySelector(item.href);
            if (section) {
                const distance = Math.abs(section.getBoundingClientRect().top);
                if (distance < minDistance) {
                    minDistance = distance;
                    currentSection = item.href;
                }
            }
        });
      }
      setActiveLink(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    
    // Fallback for initial load if scroll event doesn't fire immediately or sections are not yet rendered
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    }
  }, []);

  const handleLinkClick = (href: string) => {
    setIsSheetOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Manually set active link on click for immediate feedback,
      // scroll listener will then confirm or update.
      setActiveLink(href);
    }
  };
  
  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    navItems.map((item) => (
      <Button
        key={item.label}
        variant="link"
        asChild
        className={`text-foreground hover:text-primary transition-colors ${mobile ? 'text-lg w-full justify-start py-4' : 'text-sm'} ${activeLink === item.href ? 'text-primary font-semibold underline' : ''}`}
      >
        <a onClick={(e) => { e.preventDefault(); handleLinkClick(item.href); }} href={item.href}>
          {item.label}
        </a>
      </Button>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2" aria-label="Volver al inicio" onClick={() => handleLinkClick('#hero')}>
          <CodeXml className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">{personalInfo.name.split(' ')[0]}</span>
        </Link>
        <div className="flex items-center space-x-2">
          <nav className="hidden items-center space-x-1 md:flex">
            <NavLinks />
          </nav>
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú de navegación">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-6">
                <div className="flex flex-col space-y-4">
                  <Link href="/" className="mb-4 flex items-center space-x-2" onClick={() => handleLinkClick('#hero')} aria-label="Volver al inicio">
                     <CodeXml className="h-7 w-7 text-primary" />
                     <span className="font-headline text-xl font-bold text-foreground">{personalInfo.name.split(' ')[0]}</span>
                  </Link>
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
