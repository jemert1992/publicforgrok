import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ModelsManagement from "./pages/ModelsManagement";
import ContentManager from "./pages/ContentManager";
import SubscriberManager from "./pages/SubscriberManager";
import AIChatSimulator from "./pages/AIChatSimulator";
import DMImporter from './components/DMImporter';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/models" element={<ModelsManagement />} />
            <Route path="/content" element={<ContentManager />} />
            <Route path="/subscribers" element={<SubscriberManager />} />
            <Route path="/chat" element={<AIChatSimulator />} />
            <Route path="/dm-importer" element={<DMImporter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
