
import type { LucideIcon } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  technologies: string[];
  liveLink?: string;
  repoLink?: string;
  frontendRepoLink?: string;
  backendRepoLink?: string;
  slug: string;
  aiGeneratedDescription?: string;
  aiKeywords?: string[];
  imageHint?: string;
  isInProduction?: boolean;
}

export interface EducationEntry {
  id:string;
  institution: string;
  degree: string;
  period: string;
  details?: string;
  icon?: LucideIcon;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  responsibilities?: string[];
  icon?: LucideIcon;
}

export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'database' | 'design' | 'other' | 'idiomas';
  icon: LucideIcon;
}

export interface AdditionalTraining {
  id: string;
  name: string;
  icon?: LucideIcon;
}

export interface CertificateEntry {
  id: string;
  title: string;
  issuer: string;
  year: string;
  icon?: LucideIcon;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface PersonalInfo {
  name: string;
  title: string;
  dob: string;
  city: string;
  email: string;
  phone: string;
  linkedin: string;
  github?: string; // Optional
  bio: string;
  shortBio: string;
  cvUrl: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: {
    languages: Skill[];
    frameworks: Skill[];
    databases: Skill[];
    design: Skill[];
    other: Skill[];
    idiomas: Skill[]; // Added 'idiomas'
  };
  additionalTraining: AdditionalTraining[];
  certificates?: CertificateEntry[];
  socials: SocialLink[];
}

export interface NavItem {
  label: string;
  href: string;
}
