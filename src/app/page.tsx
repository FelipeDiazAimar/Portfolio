
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

  const data = await getPortfolioData();
  if (data.personalInfo) {
    personalInfo = data.personalInfo;
    // Si la BD no tiene skills, usar las estáticas como fallback
    if (Object.keys(personalInfo.skills).length === 0) {
      personalInfo = { ...personalInfo, skills: staticPersonalInfo.skills };
    }
  }
  if (data.projects) projects = data.projects;

  const getIconName = (icon: any): string | null => {
    if (!icon) return null;
    if (typeof icon === 'function') return icon.displayName || icon.name || 'HelpCircle';
    // forwardRef components: { $$typeof, render }
    if (icon.$$typeof && icon.render) return icon.render.displayName || icon.render.name || 'HelpCircle';
    return null;
  };

  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj !== null && typeof obj === 'object') {
      if (obj.$$typeof) return undefined;
      const newObj: any = {};
      for (const key in obj) {
        if (key === 'icon') {
          const name = getIconName(obj[key]);
          if (name) newObj.icon_name = name;
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
