import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "./pages/Dashboard";
import LotesPage from "./pages/LotesPage";
import PollosPage from "./pages/PollosPage";
import SaludPage from "./pages/SaludPage";
import AlertasPage from "./pages/AlertasPage";
import ReportesPage from "./pages/ReportesPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { PolloProvider } from "./contexts/ChickenContext";
import { LoteProvider } from "./contexts/LoteContext";
import { HealthProvider } from "./contexts/HealthContext";
import { AlertProvider } from "./contexts/AlertContext";
import LoteDetail from "./pages/LoteDetail";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex flex-col md:flex-row w-full">
            <div className="sticky top-0 self-start z-50">
              <AppSidebar />
            </div>
            <div className="flex md:hidden h-[3.5rem]" />
            <div className="flex-1 flex flex-col">
              <header className="h-14 hidden md:flex items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                <SidebarTrigger className="mr-4" />
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-foreground">Avicon</h1>
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <AlertProvider>
                  <HealthProvider>
                    <LoteProvider>
                      <PolloProvider>
                        <AuthProvider>
                          <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected routes */}
                            <Route
                              path="/"
                              element={
                                <RequireAuth>
                                  <Dashboard />
                                </RequireAuth>
                              }
                            />
                            <Route path="/lotes" element={<RequireAuth><LotesPage /></RequireAuth>} />
                            <Route path="/lotesDetail" element={<RequireAuth><LoteDetail /></RequireAuth>} />
                            <Route path="/lotes/:id" element={<RequireAuth><LoteDetail /></RequireAuth>} />
                            <Route path="/pollos" element={<RequireAuth><PollosPage /></RequireAuth>} />
                            <Route path="/salud" element={<RequireAuth><SaludPage /></RequireAuth>} />
                            <Route path="/alertas" element={<RequireAuth><AlertasPage /></RequireAuth>} />
                            <Route path="/reportes" element={<RequireAuth><ReportesPage /></RequireAuth>} />
                            <Route path="*" element={<RequireAuth><NotFound /></RequireAuth>} />
                          </Routes>
                        </AuthProvider>
                      </PolloProvider>
                    </LoteProvider>
                  </HealthProvider>
                </AlertProvider>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
