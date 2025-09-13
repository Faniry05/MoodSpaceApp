import { motion } from "framer-motion";
import { Home, ImageIcon, CheckSquare, Settings, Moon, Sun, Timer, Sparkles, Palette, Monitor } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Button } from "./ui/button";

const navItems = [
  { path: "/dashboard", icon: Home, labelKey: "nav.home" },
  { path: "/moodboard", icon: ImageIcon, labelKey: "nav.moodboard" },
  { path: "/cards", icon: Sparkles, labelKey: "nav.cards" },
  { path: "/tasks", icon: CheckSquare, labelKey: "nav.tasks" },
  { path: "/pomodoro", icon: Timer, labelKey: "pomodoro.title" },
  { path: "/themes", icon: Palette, labelKey: "nav.themes" },
  { path: "/settings", icon: Settings, labelKey: "nav.settings" },
];

export default function Navigation() {
  const location = useLocation();
  const { theme, effectiveTheme, setTheme } = useTheme();
  const { t } = useLanguage();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-5 w-5" />;
    } else if (effectiveTheme === "light") {
      return <Moon className="h-5 w-5" />;
    } else {
      return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <>
      {/* Theme Toggle Button - Separated */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="fixed top-6 right-6 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={cycleTheme}
          className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300"
          title={`Mode: ${theme}`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {getThemeIcon()}
          </motion.div>
        </Button>
      </motion.div>

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t"
      >
        <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
          {navItems.map(({ path, icon: Icon, labelKey }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path} className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-2xl transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground/70 bg-background/50 hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-2xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}