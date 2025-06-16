
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/sections/HeroSection'));
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'));
const AboutSection = dynamic(() => import('@/components/sections/AboutSection'));
const CertificatesSection = dynamic(() => import('@/components/sections/CertificatesSection'));
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'));


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <CertificatesSection />
      <ContactSection />
    </>
  );
}
