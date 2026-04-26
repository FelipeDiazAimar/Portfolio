'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import type { PersonalInfo } from '@/types';

export default function ConditionalHeader({ personalInfo }: { personalInfo: PersonalInfo }) {
  const pathname = usePathname();
  // Don't render the public header on admin routes
  if (pathname.startsWith('/admin')) return null;
  return <Header personalInfo={personalInfo} />;
}
