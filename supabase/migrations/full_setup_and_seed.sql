
-- ==========================================
-- 1. CREACIÓN DE TABLAS (Por si no las creaste)
-- ==========================================

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

CREATE TABLE IF NOT EXISTS education (
  id TEXT PRIMARY KEY,
  institution TEXT,
  degree TEXT,
  period TEXT,
  details TEXT,
  icon_name TEXT
);

CREATE TABLE IF NOT EXISTS experience (
  id TEXT PRIMARY KEY,
  company TEXT,
  role TEXT,
  period TEXT,
  responsibilities TEXT[],
  icon_name TEXT
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  icon_name TEXT
);

CREATE TABLE IF NOT EXISTS additional_training (
  id TEXT PRIMARY KEY,
  name TEXT,
  icon_name TEXT
);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  title TEXT,
  issuer TEXT,
  year TEXT,
  icon_name TEXT
);

CREATE TABLE IF NOT EXISTS socials (
  id TEXT PRIMARY KEY,
  name TEXT,
  url TEXT,
  icon_name TEXT
);

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

-- Habilitar RLS y Políticas (Acceso total para anon por ahora)
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON personal_info;
CREATE POLICY "Allow all" ON personal_info FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON education;
CREATE POLICY "Allow all" ON education FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON experience;
CREATE POLICY "Allow all" ON experience FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON skills;
CREATE POLICY "Allow all" ON skills FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE additional_training ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON additional_training;
CREATE POLICY "Allow all" ON additional_training FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON certificates;
CREATE POLICY "Allow all" ON certificates FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON socials;
CREATE POLICY "Allow all" ON socials FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON projects;
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);


-- ==========================================
-- 2. INSERCIÓN DE DATOS (SEEDING)
-- ==========================================

-- Personal Info
INSERT INTO personal_info (id, name, title, dob, city, email, phone, linkedin, github, bio, shortBio, cvUrl)
VALUES (1, 'Felipe Díaz Aimar', 'Estudiante avanzado de Ingeniería en Sistemas', '10/09/2004', 'San Francisco, Córdoba', 'felipediazaimar@gmail.com', '+54 9 3564 690844', 'https://linkedin.com/in/felipe-aimar', 'https://github.com/felipediazaimar', 'Estudiante avanzado de Ingeniería en Sistemas en la UTN, apasionado por el avance tecnológico. Soy una persona proactiva que se adecua a los cambios y disfruta de trabajar en equipo. Comprometido con la exploración de las últimas tendencias en el campo de la tecnología y determinado a contribuir con soluciones innovadoras para el progreso.', 'Apasionado por la tecnología, la innovación y el desarrollo de soluciones creativas.', '/CV-FELIPE-DIAZ-AIMAR.pdf')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, title = EXCLUDED.title, bio = EXCLUDED.bio, shortBio = EXCLUDED.shortBio;

-- Education
INSERT INTO education (id, institution, degree, period, details, icon_name) VALUES
('edu1', 'UTN San Francisco', 'Ingeniería en Sistemas de Información', '2022 - Actualidad', NULL, 'GraduationCap'),
('edu2', 'Instituto San Francisco de Asís', 'Secundario completo con diploma de abanderado', '2016 - 2022', NULL, 'Award'),
('edu3', 'EPI English Private Institute', 'Formación en Idioma Inglés', '2017 - 2023', NULL, 'Languages'),
('edu4', 'Universidad de Cambridge', 'First Certificate in English (FCE) B2', '2022 - 2023', NULL, 'Languages')
ON CONFLICT (id) DO NOTHING;

-- Experience
INSERT INTO experience (id, company, role, period, responsibilities, icon_name) VALUES
('exp1', 'UTN San Francisco', 'Encargado de laboratorio', '2024', NULL, 'Briefcase'),
('exp2', 'UTN San Francisco', 'Profesor de laboratorio de Ingeniería en Sistemas', '2025', NULL, 'Briefcase'),
('exp3', 'Freestyle', 'Promotor de viajes', '2023 - 2024', NULL, 'Briefcase'),
('exp4', 'Particular', 'Tutor de Álgebra', '2025 - Actualidad', NULL, 'Briefcase'),
('exp5', 'Gigante de Bomberos', 'Bartender', '2024 - Actualidad', NULL, 'Briefcase'),
('exp6', 'Dario Martinez Computacion', 'SERVICIO TECNICO (Computadoras, Impresoras, Cámaras y Notebooks)', 'A la actualidad', NULL, 'Briefcase')
ON CONFLICT (id) DO NOTHING;

-- Skills
INSERT INTO skills (id, name, category, icon_name) VALUES
('skL1', 'C#', 'language', 'Code2'),
('skL2', 'JavaScript', 'language', 'Code2'),
('skL3', 'Java', 'language', 'Code2'),
('skL4', 'SQL', 'language', 'Database'),
('skL5', 'Python', 'language', 'Code2'),
('skL6', 'C++', 'language', 'Code2'),
('skL7', 'Kotlin', 'language', 'Code2'),
('skL8', 'HTML', 'language', 'Code2'),
('skL9', 'TypeScript', 'language', 'Code2'),
('skF1', '.NET Core', 'framework', 'Server'),
('skF2', 'Node.js', 'framework', 'Server'),
('skF3', 'React.js', 'framework', 'Rocket'),
('skF4', 'Vite', 'framework', 'Rocket'),
('skF5', 'Firebase', 'framework', 'Database'),
('skF6', 'Next.js', 'framework', 'Rocket'),
('skDB1', 'MySQL', 'database', 'Database'),
('skDB2', 'PostgreSQL', 'database', 'Database'),
('skDB3', 'MongoDB', 'database', 'Database'),
('skDB4', 'MariaDB', 'database', 'Database'),
('skD1', 'Figma', 'design', 'PenTool'),
('skD2', 'Photoshop', 'design', 'Palette'),
('skD3', 'Canva', 'design', 'Palette'),
('skO2', 'GitHub', 'other', 'Github'),
('skO3', 'VS Code', 'other', 'MonitorPlay'),
('skO4', 'Scrum', 'other', 'Users'),
('skO5', 'Microsoft Office', 'other', 'FileText'),
('skO6', 'Access', 'other', 'Database'),
('skO7', 'SQL Server', 'other', 'Database'),
('skO8', 'Visily', 'other', 'MonitorPlay'),
('skO9', 'Excel', 'other', 'FileText'),
('skO10', 'Word', 'other', 'FileText'),
('skO11', 'PowerPoint', 'other', 'FileText'),
('skI1', 'Inglés Avanzado (B2)', 'idiomas', 'Languages')
ON CONFLICT (id) DO NOTHING;

-- Additional Training
INSERT INTO additional_training (id, name, icon_name) VALUES
('at1', 'Curso de Desarrollo Web', 'BookOpenCheck'),
('at2', 'Curso de Programación con Arduino', 'Cpu'),
('at3', 'Curso de Informática', 'MonitorPlay'),
('at4', 'Aprende Programando (Python)', 'Code2')
ON CONFLICT (id) DO NOTHING;

-- Certificates
INSERT INTO certificates (id, title, issuer, year, icon_name) VALUES
('cert1', 'First Certificate in English (FCE) B2', 'Universidad de Cambridge', '2023', 'Languages'),
('cert2', 'Distinción Manuel Belgrano', 'Reconocimiento (Abanderados y Escoltas)', '2022', 'Award'),
('cert3', 'Título Secundario', 'Instituto San Francisco de Asís', '2022', 'GraduationCap'),
('cert4', 'Título de Desarrollo con Python', 'Aprende Programando', '2023', 'Code2'),
('cert5', 'Certificación de Inglés (Upper Intermediate)', 'English Private Institute (EPI)', '2022', 'Languages')
ON CONFLICT (id) DO NOTHING;

-- Socials
INSERT INTO socials (id, name, url, icon_name) VALUES
('soc1', 'LinkedIn', 'https://linkedin.com/in/felipe-aimar', 'Linkedin'),
('soc2', 'Email', 'mailto:felipediazaimar@gmail.com', 'Mail'),
('soc3', 'Phone', 'tel:+5493564690844', 'Phone'),
('soc4', 'GitHub', 'https://github.com/felipediazaimar', 'Github')
ON CONFLICT (id) DO NOTHING;

-- Projects
INSERT INTO projects (id, title, slug, description, longDescription, imageUrl, technologies, liveLink, repoLink, frontendRepoLink, backendRepoLink, imageHint, isInProduction) VALUES
('proj8', 'AlgoBonitoSV - E-commerce de Joyas y Accesorios', 'algobonitosv-ecommerce', 'Plataforma de E-commerce para la venta de joyas y accesorios, con catálogo dinámico, carrito de compras y diseño moderno.', 'AlgoBonitoSV es una tienda online especializada en joyas y accesorios, desarrollada para ofrecer una experiencia de compra intuitiva y segura. El sistema incluye un catálogo dinámico, filtros avanzados, carrito de compras, integración con métodos de pago y panel de administración para la gestión de productos. El diseño es moderno, responsivo y optimizado para dispositivos móviles. Tecnologías utilizadas: Node.js, TypeScript, VS Code, Vercel, Firebase, Supabase, React, Visily.', '/P5.jpg', ARRAY['Node.js', 'TypeScript', 'VS Code', 'Vercel', 'Firebase', 'Supabase', 'React', 'Visily'], 'https://algobonito-sv.vercel.app/', 'https://github.com/FelipeDiazAimar/AlgoBonitoSV', NULL, NULL, 'ecommerce jewelry accessories', TRUE),
('proj9', 'CalidaEscencia - E-commerce de Aromas y Deco', 'calidaescencia-ecommerce', 'Tienda online de aromas y decoración, con catálogo interactivo, carrito y gestión de productos.', 'CalidaEscencia es una plataforma de E-commerce dedicada a la venta de productos de aromaterapia y decoración. Ofrece un catálogo interactivo, filtros por categoría, carrito de compras, integración con pagos y panel de administración para la gestión de inventario. El diseño es atractivo y responsivo, pensado para brindar una experiencia de usuario agradable. Tecnologías utilizadas: Node.js, TypeScript, VS Code, Vercel, Firebase, Supabase, React, Visily.', '/P6.jpg', ARRAY['Node.js', 'TypeScript', 'VS Code', 'Vercel', 'Firebase', 'Supabase', 'React', 'Visily'], 'https://calida-escencia.vercel.app/', 'https://github.com/FelipeDiazAimar/CalidaEscencia', NULL, NULL, 'ecommerce aromas decoracion', TRUE),
('proj1', 'JustPhones Showcase - E-commerce de Fundas, Auriculares y Accesorios', 'justphones-showcase', 'Plataforma de E-commerce completa para la venta de fundas de celular, auriculares y accesorios. Incluye panel de administración avanzado, análisis financiero de ventas, catálogo dinámico con filtros, carrito integrado con WhatsApp y diseño responsive con temas claro y oscuro.', 'Plataforma de E-commerce completa y funcional desarrollada para la venta de fundas de celular y accesorios. El proyecto incluye un panel de administración avanzado para gestionar productos, stock, imágenes, modelos y FAQs, junto con un análisis financiero detallado de ventas y rentabilidad. La tienda cuenta con un catálogo dinámico con filtros avanzados, un carrito de compras funcional que se integra con WhatsApp para finalizar pedidos, y un diseño moderno y adaptable (responsive) con temas claro y oscuro. Tecnologías próximas a implementar: WordPress y Tiendanube.', '/P0.png', ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'ShadCN UI', 'Supabase', 'Vercel', 'HTML', 'CSS', 'VS Code', 'Firebase'], 'https://justphones-fv.vercel.app/', 'https://github.com/FelipeDiazAimar/justphones', NULL, NULL, 'ecommerce phones accessories', FALSE),
('proj2', 'Asistente Virtual Médico - Web App Educativa', 'asistente-virtual-medico', 'Aplicación web interactiva para asistir a estudiantes de medicina, permitiendo consultar apuntes médicos mediante IA conversacional.', 'Este proyecto es una aplicación web interactiva diseñada para asistir a estudiantes de medicina en su proceso de aprendizaje. El asistente permite consultar un apunte médico precargado a través de una interfaz conversacional basada en inteligencia artificial. Características principales: Visualización de apuntes médicos de forma clara y organizada. Asistente virtual integrado con tecnología de lenguaje natural (ChatGPT). Capacidad para responder preguntas del estudiante en base al contenido cargado. Interfaz web simple e intuitiva. Ideal para entornos educativos o como base para asistentes especializados en salud.', '/P3.jpg', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'VS Code', 'OpenRouter API','TypeScript','Firebase'], 'https://asistenteinteligente.onrender.com/', 'https://github.com/FelipeDiazAimar/AsistenteInteligente', NULL, NULL, 'medical assistant', FALSE),
('proj3', 'BibliotecaInteligente', 'biblioteca-inteligente', 'Página web para estudiantes con biblioteca virtual interactiva, catálogo de libros, buscador inteligente, turnero y asistente virtual con IA.', 'La aplicación consiste en una página web destinada a estudiantes de una institución educativa, donde podrán acceder a una biblioteca virtual interactiva. El ingreso se realiza mediante un usuario previamente registrado en la base de datos, garantizando así el acceso exclusivo a miembros autorizados. Una vez dentro, el usuario podrá consultar el catálogo completo de libros disponibles, junto con sus datos descriptivos, como autor, año de publicación, materia relacionada, entre otros.\nLa plataforma incluye un buscador inteligente que utiliza una API pública para mejorar la experiencia de búsqueda, y cuenta además con un asistente virtual potenciado por IA (utilizando una API gratuita como OpenRouter con acceso a internet), que puede ayudar al usuario a encontrar libros, realizar recomendaciones personalizadas, o responder preguntas relacionadas con el contenido disponible. La aplicación no permite editar ni subir nuevos libros por parte del usuario, ya que su objetivo principal es brindar acceso y asistencia en la exploración del material existente de forma práctica, ordenada e intuitiva.', '/P4.jpg', ARRAY['VS Code', 'JavaScript', 'HTML', 'CSS', 'JSX', 'OpenRouter API', 'SQL', 'PostgreSQL', 'Supabase'], 'https://bibliotechjf.vercel.app/', NULL, 'https://github.com/JereMicheloud/Repositorio-Frontend-BibliotecaInteligente', 'https://github.com/FelipeDiazAimar/Repositorio-Backend-BibliotecaInteligente', 'smart library', FALSE),
('proj4', 'E-commerce Platform', 'ecommerce-platform', 'Aplicación web de E-commerce con funcionalidades de navegación, detalle de producto y carrito de compras.', 'Este proyecto es una aplicación web de eCommerce inspirada en plataformas como MercadoLibre. Permite a los usuarios navegar productos, ver detalles, agregarlos al carrito y simular una compra. El enfoque está en replicar las funcionalidades esenciales de un marketplace moderno con una interfaz clara y responsiva. Características principales: Listado de productos con imagen, precio y descripción. Página individual para cada producto con información detallada. Carrito de compras con suma total automática. Simulación de flujo de compra. Diseño responsive compatible con dispositivos móviles.', '/P2.jpg', ARRAY['HTML', 'CSS', 'JavaScript', 'React.js', 'VS Code', 'Vite', 'JSX', 'DummyJSON API'], 'https://mercado-libre-app-rust.vercel.app/', 'https://github.com/FelipeDiazAimar/mercado-libre-app', NULL, NULL, 'ecommerce concept', FALSE),
('proj5', 'Lista de Compras - App Web', 'lista-de-compras-app-web', 'Este proyecto consiste en una aplicación web sencilla y funcional para gestionar listas de compras. Permite al usuario agregar productos, editarlos, marcarlos como comprados y eliminarlos de la lista. Ideal como herramienta personal o como base para un proyecto más grande.', 'Este proyecto consiste en una aplicación web sencilla y funcional para gestionar listas de compras. Permite al usuario agregar productos, editarlos, marcarlos como comprados y eliminarlos de la lista. Características principales: Agregar productos a la lista. Editar los nombres de productos existentes. Marcar productos como comprados. Eliminar productos de la lista. Interfaz intuitiva y responsiva.', '/P1.jpg', ARRAY['HTML', 'CSS', 'React', 'Vite', 'Vercel', 'GitHub', 'VS Code'], 'https://listadecomprasfda.vercel.app/', 'https://github.com/FelipeDiazAimar/ListadeCompras', NULL, NULL, 'shopping list concept', FALSE)
ON CONFLICT (id) DO NOTHING;
