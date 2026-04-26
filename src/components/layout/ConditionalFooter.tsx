'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer';
import type { PersonalInfo } from '@/types';

export default function ConditionalFooter({ personalInfo }: { personalInfo: PersonalInfo }) {
  const pathname = usePathname();
  // Don't render the public footer on admin routes
  if (pathname.startsWith('/admin')) return null;
  return <Footer personalInfo={personalInfo} />;
}
