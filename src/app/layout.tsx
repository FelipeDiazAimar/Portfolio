
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { PT_Sans, Playfair_Display } from 'next/font/google';
import { getPortfolioData } from '@/lib/data-fetching';
import { personalInfo as staticPersonalInfo } from '@/data/personal-info';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Portfolio - Felipe Díaz Aimar',
  description: 'Personal portfolio of Felipe Díaz Aimar, showcasing projects and skills.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let personalInfo = staticPersonalInfo;
  try {
    const data = await getPortfolioData();
    if (data.personalInfo && data.personalInfo.name) {
      personalInfo = data.personalInfo;
    }
  } catch (error) {
    console.error('Failed to fetch from Supabase, using static data:', error);
  }

  // Sanitize for Client Components (remove functions, keep names)
  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj !== null && typeof obj === 'object') {
      if (obj.$$typeof) return undefined; // Skip React elements
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
    <html lang="es" suppressHydrationWarning className={`${ptSans.variable} ${playfairDisplay.variable}`}>
      <head />
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalHeader personalInfo={safePersonalInfo} />
          <main className="flex-grow">
            {children}
          </main>
          <ConditionalFooter personalInfo={safePersonalInfo} />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
