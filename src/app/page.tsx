
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

  // Sanitize function to remove functions/circular refs before passing to Client Components
  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        // Special handling for the 'skills' object which is now dynamic
        if (key === 'skills') {
          newObj.skills = {};
          for (const category in obj.skills) {
            newObj.skills[category] = sanitize(obj.skills[category]);
          }
          continue;
        }

        if (key === 'icon' && typeof obj[key] === 'function') {
          // Store icon name if we can, but we rely on icon_name mostly
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
