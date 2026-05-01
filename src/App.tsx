import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EnhancedIndex from "./pages/EnhancedIndex";
import Dashboard from "./pages/Dashboard";
import CropHealth from "./pages/CropHealth";
import WeatherAdvisory from "./pages/WeatherAdvisory";
import MandiPrices from "./pages/MandiPrices";
import VoiceAssistant from "./pages/VoiceAssistant";
import AgriGame from "./pages/AgriGame";
import EPass from "./pages/EPass";
import BlockchainTracking from "./pages/BlockchainTracking";
import CropCalendar from "./pages/CropCalendar";
import SubsidyFinder from "./pages/SubsidyFinder";
import NotFound from "./pages/NotFound";
import MobileNav from "./components/MobileNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<EnhancedIndex />} />
            <Route path="/old" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crop-health" element={<CropHealth />} />
            <Route path="/weather" element={<WeatherAdvisory />} />
            <Route path="/prices" element={<MandiPrices />} />
            <Route path="/voice" element={<VoiceAssistant />} />
            <Route path="/agri-game" element={<AgriGame />} />
            <Route path="/e-pass" element={<EPass />} />
            <Route path="/blockchain-tracking" element={<BlockchainTracking />} />
            <Route path="/crop-calendar" element={<CropCalendar />} />
            <Route path="/subsidy-finder" element={<SubsidyFinder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;