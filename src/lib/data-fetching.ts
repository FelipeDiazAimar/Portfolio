import { supabase } from './supabase';
import { PersonalInfo, Project } from '@/types';

const asNonEmptyString = (value: unknown, fallback = '') => {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return fallback;
};

const normalizePersonalInfoRow = (row: any) => {
  if (!row || typeof row !== 'object') return row;

  return {
    ...row,
    shortBio: asNonEmptyString(row.shortBio, asNonEmptyString(row.shortbio)),
    cvUrl: asNonEmptyString(row.cvUrl, asNonEmptyString(row.cvurl)),
  };
};

const normalizeProjectRow = (row: any): Project => {
  return {
    ...row,
    longDescription: asNonEmptyString(row.longDescription, asNonEmptyString(row.longdescription)),
    imageUrl: asNonEmptyString(row.imageUrl, asNonEmptyString(row.imageurl)),
    liveLink: asNonEmptyString(row.liveLink, asNonEmptyString(row.livelink)),
    repoLink: asNonEmptyString(row.repoLink, asNonEmptyString(row.repolink)),
    frontendRepoLink: asNonEmptyString(row.frontendRepoLink, asNonEmptyString(row.frontendrepolink)),
    backendRepoLink: asNonEmptyString(row.backendRepoLink, asNonEmptyString(row.backendrepolink)),
    imageHint: asNonEmptyString(row.imageHint, asNonEmptyString(row.imagehint)),
    isInProduction: Boolean(row.isInProduction ?? row.isinproduction),
  };
};

export async function getPortfolioData() {
  const [
    { data: personalInfo },
    { data: education },
    { data: experience },
    { data: skills },
    { data: additionalTraining },
    { data: certificates },
    { data: socials },
    { data: projects }
  ] = await Promise.all([
    supabase.from('personal_info').select('*').single(),
    supabase.from('education').select('*'),
    supabase.from('experience').select('*'),
    supabase.from('skills').select('*'),
    supabase.from('additional_training').select('*'),
    supabase.from('certificates').select('*'),
    supabase.from('socials').select('*'),
    supabase.from('projects').select('*').order('id', { ascending: true })
  ]);

  if (!personalInfo) throw new Error('Personal info not found');

  const normalizedPersonalInfo = normalizePersonalInfoRow(personalInfo);
  const normalizedProjects = (projects || []).map(normalizeProjectRow);

  const formattedPersonalInfo: PersonalInfo = {
    ...normalizedPersonalInfo,
    education: (education || []),
    experience: (experience || []),
    skills: {
      languages: (skills || []).filter(s => s.category === 'language'),
      frameworks: (skills || []).filter(s => s.category === 'framework'),
      databases: (skills || []).filter(s => s.category === 'database'),
      design: (skills || []).filter(s => s.category === 'design'),
      other: (skills || []).filter(s => s.category === 'other'),
      idiomas: (skills || []).filter(s => s.category === 'idiomas'),
    },
    additionalTraining: (additionalTraining || []),
    certificates: (certificates || []),
    socials: (socials || []),
  };

  return {
    personalInfo: formattedPersonalInfo,
    projects: normalizedProjects
  };
}
