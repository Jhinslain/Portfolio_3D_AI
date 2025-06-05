import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import UnityGame from "./pages/UnityGame";
import AIDemo from "./pages/AIDemo";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import MindMap3D from "./pages/MindMap3D";
import MouseHalo from "./components/MouseHalo";

// Scroll to hash component
const ScrollToHash = () => {
  const location = useLocation();
  
  useEffect(() => {
    // If we have a hash in the URL
    if (location.hash) {
      // Get the element by id (without the #)
      const element = document.getElementById(location.hash.slice(1));
      
      if (element) {
        // Scroll to that element
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // No hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MouseHalo />
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/unity-game" element={<UnityGame />} />
          <Route path="/ai-demo" element={<AIDemo />} />
          <Route path="/mind-map" element={<MindMap3D />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
