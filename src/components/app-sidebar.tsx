import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Bird,
  Activity,
  AlertTriangle,
  FileText,
  Menu,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Lotes", url: "/lotes", icon: Users },
  { title: "Pollos", url: "/pollos", icon: Bird },
  { title: "Salud", url: "/salud", icon: Activity },
  { title: "Alertas", url: "/alertas", icon: AlertTriangle },
  { title: "Reportes", url: "/reportes", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground font-medium shadow-sm"
      : "hover:bg-muted/80 transition-colors";

  const SidebarContentItems = () => (
    <SidebarContent>
      <SidebarGroup>
        {state === "expanded" && <SidebarGroupLabel>Gestión</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    className={getNavClassName(isActive(item.url))}
                    end={item.url === "/"}
                    onClick={() => setOpen(false)} // cerrar menú al dar clic
                  >
                    <item.icon className="h-4 w-4" />
                    {state === "expanded" && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen">
        <Sidebar className="border-r border-border bg-card">
          <SidebarHeader className="p-2 border-b border-border">
            <div className="flex items-center gap-3">
              <NavLink to="/" className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Bird className="h-5 w-5 text-white" />
              </NavLink>
              {state === "expanded" && (
                <div>
                  <h2 className="text-lg font-bold text-foreground">Avicon</h2>
                  <p className="text-sm text-muted-foreground">
                    Sistema de Control
                  </p>
                </div>
              )}
            </div>
          </SidebarHeader>
          <SidebarContentItems />
        </Sidebar>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden flex flex-row justify-between bg-success fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-3 px-2">
          <NavLink to='/' className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Bird className="h-5 w-5 text-white" />
          </NavLink>
          <div>
            <h2 className="text-lg font-bold text-foreground text-white">
              Avicon
            </h2>
            <p className="text-sm text-muted-foreground text-white">
              Sistema de Control
            </p>
          </div>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="m-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar className="border-r border-border bg-card w-full">
              <SidebarHeader className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                    <Bird className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Avicon
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Sistema de Control
                    </p>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContentItems />
            </Sidebar>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
