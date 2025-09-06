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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex flex-col md:flex-row w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-14 flex items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                <SidebarTrigger className="mr-4" />
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-foreground">Avicon</h1>
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/lotes" element={<LotesPage />} />
                  <Route path="/pollos" element={<PollosPage />} />
                  <Route path="/salud" element={<SaludPage />} />
                  <Route path="/alertas" element={<AlertasPage />} />
                  <Route path="/reportes" element={<ReportesPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
