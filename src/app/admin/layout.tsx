
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { User, Briefcase, GraduationCap, Code2, Award, Link2, LayoutGrid, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { label: "Información Personal", icon: User, href: "/admin?section=personal" },
    { label: "Proyectos", icon: LayoutGrid, href: "/admin?section=projects" },
    { label: "Educación", icon: GraduationCap, href: "/admin?section=education" },
    { label: "Experiencia", icon: Briefcase, href: "/admin?section=experience" },
    { label: "Habilidades", icon: Code2, href: "/admin?section=skills" },
    { label: "Títulos y Certificados", icon: Award, href: "/admin?section=certificates" },
    { label: "Entrenamiento Adicional", icon: Settings, href: "/admin?section=training" },
    { label: "Redes Sociales", icon: Link2, href: "/admin?section=socials" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full admin-bg font-sans selection:bg-primary/20">
        <Sidebar className="glass-panel border-r-0 m-4 rounded-3xl h-[calc(100vh-2rem)] overflow-hidden shadow-2xl">
          <SidebarHeader className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary p-2 rounded-2xl shadow-lg shadow-primary/30">
                <LayoutDashboard className="text-white h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild className="rounded-2xl h-12 transition-all hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 px-4">
                    <Link href={item.href}>
                      <item.icon className="mr-3 h-5 w-5 opacity-70" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/10">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="rounded-2xl h-12 transition-all hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 px-4">
                    <Link href="/">
                      <Link2 className="mr-3 h-5 w-5 opacity-70" />
                      <span className="font-medium">Volver al Sitio</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 md:p-12 overflow-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
