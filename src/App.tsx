import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { AnimationProvider } from "@/contexts/AnimationProvider";
import BackgroundAnimations from "@/components/BackgroundAnimations";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSmartNotifications } from "@/hooks/useSmartNotifications";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Moodboard from "./pages/Moodboard";
import Settings from "./pages/Settings";
import PomodoroTimer from "./pages/PomodoroTimer";
import AestheticCards from "./pages/AestheticCards";
import ThemeCustomizer from "./pages/ThemeCustomizer";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

function AppWithHooks() {
  useKeyboardShortcuts();
  useSmartNotifications();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<><Dashboard /><Navigation /></>} />
      <Route path="/tasks" element={<><Tasks /><Navigation /></>} />
      <Route path="/moodboard" element={<><Moodboard /><Navigation /></>} />
      <Route path="/pomodoro" element={<><PomodoroTimer /><Navigation /></>} />
      <Route path="/cards" element={<><AestheticCards /><Navigation /></>} />
      <Route path="/themes" element={<><ThemeCustomizer /><Navigation /></>} />
      <Route path="/settings" element={<><Settings /><Navigation /></>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <AppWithHooks />
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <LanguageProvider>
        <AnimationProvider>
          <TooltipProvider>
            <BackgroundAnimations />
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </AnimationProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
