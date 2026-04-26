
-- Create tables for Portfolio

-- 1. Personal Info
CREATE TABLE IF NOT EXISTS personal_info (
  id BIGINT PRIMARY KEY,
  name TEXT,
  title TEXT,
  dob TEXT,
  city TEXT,
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  github TEXT,
  bio TEXT,
  shortBio TEXT,
  cvUrl TEXT
);

-- 2. Education
CREATE TABLE IF NOT EXISTS education (
  id TEXT PRIMARY KEY,
  institution TEXT,
  degree TEXT,
  period TEXT,
  details TEXT,
  icon_name TEXT
);

-- 3. Experience
CREATE TABLE IF NOT EXISTS experience (
  id TEXT PRIMARY KEY,
  company TEXT,
  role TEXT,
  period TEXT,
  responsibilities TEXT[],
  icon_name TEXT
);

-- 4. Skills
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  icon_name TEXT
);

-- 5. Additional Training
CREATE TABLE IF NOT EXISTS additional_training (
  id TEXT PRIMARY KEY,
  name TEXT,
  icon_name TEXT
);

-- 6. Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  title TEXT,
  issuer TEXT,
  year TEXT,
  icon_name TEXT
);

-- 7. Socials
CREATE TABLE IF NOT EXISTS socials (
  id TEXT PRIMARY KEY,
  name TEXT,
  url TEXT,
  icon_name TEXT
);

-- 8. Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT,
  slug TEXT,
  description TEXT,
  longDescription TEXT,
  imageUrl TEXT,
  technologies TEXT[],
  liveLink TEXT,
  repoLink TEXT,
  frontendRepoLink TEXT,
  backendRepoLink TEXT,
  imageHint TEXT,
  isInProduction BOOLEAN DEFAULT FALSE
);

-- Enable RLS and create policies (Optional: for simplicity in this task, we can just disable RLS or allow all)
-- For a real app, you'd want proper policies.
-- Here we enable all for anon for now as requested (No Auth)
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon on personal_info" ON personal_info FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon on education" ON education FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon on experience" ON experience FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon on skills" ON skills FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE additional_training ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon on additional_training" ON additional_training FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon on certificates" ON certificates FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon on socials" ON socials FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
