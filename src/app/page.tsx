
import { getPortfolioData } from '@/lib/data-fetching';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import AboutSection from '@/components/sections/AboutSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import ContactSection from '@/components/sections/ContactSection';
import { personalInfo as staticPersonalInfo } from '@/data/personal-info';
import { projectsData as staticProjects } from '@/data/projects';

export const revalidate = 0; // Ensure fresh data

export default async function HomePage() {
  let personalInfo = staticPersonalInfo;
  let projects = staticProjects;

  try {
    const data = await getPortfolioData();
    if (data.personalInfo) personalInfo = data.personalInfo;
    if (data.projects) projects = data.projects;
  } catch (error) {
    console.error('Failed to fetch from Supabase, using static data:', error);
  }

  // Sanitize for nested Client Components
  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj !== null && typeof obj === 'object') {
      if (obj.$$typeof) return undefined;
      const newObj: any = {};
      for (const key in obj) {
        if (key === 'icon' && typeof obj[key] === 'function') {
          newObj.icon_name = obj[key].name || obj[key].displayName || 'HelpCircle';
          continue;
        }
        newObj[key] = sanitize(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  const safePersonalInfo = sanitize(personalInfo);

  return (
    <>
      <HeroSection personalInfo={safePersonalInfo} />
      <ProjectsSection projects={projects} />
      <AboutSection personalInfo={safePersonalInfo} />
      <CertificatesSection personalInfo={safePersonalInfo} />
      <ContactSection personalInfo={safePersonalInfo} />
    </>
  );
}
