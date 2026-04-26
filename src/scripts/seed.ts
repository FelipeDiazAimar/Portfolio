
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { personalInfo } from '../data/personal-info';
import { projectsData } from '../data/projects';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function seed() {
  console.log('Seeding Supabase...');

  // 1. Personal Info
  const { education, experience, skills, additionalTraining, certificates, socials, ...baseInfo } = personalInfo;
  
  const { error: piError } = await supabase
    .from('personal_info')
    .upsert({ id: 1, ...baseInfo });
  if (piError) console.error('Error seeding personal_info:', piError);

  // 2. Education
  const eduData = education.map(e => ({
    id: e.id,
    institution: e.institution,
    degree: e.degree,
    period: e.period,
    details: e.details,
    icon_name: e.icon?.displayName || (e.icon as any)?.name || 'GraduationCap'
  }));
  const { error: eduError } = await supabase.from('education').upsert(eduData);
  if (eduError) console.error('Error seeding education:', eduError);

  // 3. Experience
  const expData = experience.map(e => ({
    id: e.id,
    company: e.company,
    role: e.role,
    period: e.period,
    responsibilities: e.responsibilities,
    icon_name: e.icon?.displayName || (e.icon as any)?.name || 'Briefcase'
  }));
  const { error: expError } = await supabase.from('experience').upsert(expData);
  if (expError) console.error('Error seeding experience:', expError);

  // 4. Skills
  const allSkills = [
    ...skills.languages,
    ...skills.frameworks,
    ...skills.databases,
    ...skills.design,
    ...skills.other,
    ...skills.idiomas
  ].map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    icon_name: s.icon?.displayName || (s.icon as any)?.name || 'Code2'
  }));
  const { error: skillsError } = await supabase.from('skills').upsert(allSkills);
  if (skillsError) console.error('Error seeding skills:', skillsError);

  // 5. Additional Training
  const atData = additionalTraining.map(at => ({
    id: at.id,
    name: at.name,
    icon_name: at.icon?.displayName || (at.icon as any)?.name || 'BookOpenCheck'
  }));
  const { error: atError } = await supabase.from('additional_training').upsert(atData);
  if (atError) console.error('Error seeding additional_training:', atError);

  // 6. Certificates
  const certData = (certificates || []).map(c => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    year: c.year,
    icon_name: c.icon?.displayName || (c.icon as any)?.name || 'Award'
  }));
  const { error: certError } = await supabase.from('certificates').upsert(certData);
  if (certError) console.error('Error seeding certificates:', certError);

  // 7. Socials
  const socData = socials.map(s => ({
    id: s.id,
    name: s.name,
    url: s.url,
    icon_name: s.icon?.displayName || (s.icon as any)?.name || 'Link'
  }));
  const { error: socError } = await supabase.from('socials').upsert(socData);
  if (socError) console.error('Error seeding socials:', socError);

  // 8. Projects
  const { error: projError } = await supabase.from('projects').upsert(projectsData);
  if (projError) console.error('Error seeding projects:', projError);

  console.log('Seeding completed.');
}

seed();
