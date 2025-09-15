import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useAnimation } from "@/contexts/AnimationProvider";
import { 
  Monitor, 
  Moon, 
  Sun,  
  Trash2, 
  Globe,
  Palette,
  Sparkles,
  Snowflake,
  Circle,
  Bug,
  Linkedin,
  Mail,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Storage } from "@/lib/storage";

export default function Settings() {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { animationType, setAnimationType, isAnimationEnabled, setIsAnimationEnabled } = useAnimation();
  const { toast } = useToast();

  const clearAllData = async () => {
    if (window.confirm(t('settings.clear.confirm'))) {
      await Storage.clearAll();

      toast({
        title: t('settings.toast.cleared'),
        description: t('settings.toast.desc'),
        variant: "destructive",
      });

      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-light text-foreground mb-2 font-dm-sans">
            {t('settings.title')}
          </h1>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">
                {t('settings.theme.title')}
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
                className="flex items-center gap-2 h-auto py-4 rounded-2xl"
              >
                <Sun className="w-5 h-5" />
                {t('settings.theme.light')}
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
                className="flex items-center gap-2 h-auto py-4 rounded-2xl"
              >
                <Moon className="w-5 h-5" />
                {t('settings.theme.dark')}
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
                className="flex items-center gap-2 h-auto py-4 rounded-2xl"
              >
                <Monitor className="w-5 h-5" />
                {t('settings.theme.system')}
              </Button>
            </div>
            {theme === "system" && (
              <div className="mt-3 text-sm text-muted-foreground text-center">
                {t('settings.mode')} : {effectiveTheme === "dark" ? t('settings.theme.dark') : t('settings.theme.light')}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">
                {t('settings.language.title')}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={language === "fr" ? "default" : "outline"}
                onClick={() => setLanguage("fr")}
                className="flex items-center gap-2 h-auto py-4 rounded-2xl"
              >
                🇫🇷 {t('settings.language.french')}
              </Button>
              <Button
                variant={language === "en" ? "default" : "outline"}
                onClick={() => setLanguage("en")}
                className="flex items-center gap-2 h-auto py-4 rounded-2xl"
              >
                🇺🇸 {t('settings.language.english')}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Animation Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">
                {t('settings.animation.title')}
              </h2>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">{t('settings.animation.enable')}</span>
              <Switch
                checked={isAnimationEnabled}
                onCheckedChange={setIsAnimationEnabled}
              />
            </div>

            {isAnimationEnabled && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  {t('settings.animation.choose')}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={animationType === "bubbles" ? "default" : "outline"}
                    onClick={() => setAnimationType("bubbles")}
                    className="flex items-center gap-2 h-auto py-3 rounded-2xl"
                  >
                    <Circle className="w-4 h-4" />
                    {t('settings.animation.bubble')}
                  </Button>
                  <Button
                    variant={animationType === "snow" ? "default" : "outline"}
                    onClick={() => setAnimationType("snow")}
                    className="flex items-center gap-2 h-auto py-3 rounded-2xl"
                  >
                    <Snowflake className="w-4 h-4" />
                    {t('settings.animation.snow')}
                  </Button>
                  <Button
                    variant={animationType === "particles" ? "default" : "outline"}
                    onClick={() => setAnimationType("particles")}
                    className="flex items-center gap-2 h-auto py-3 rounded-2xl"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t('settings.animation.particle')}
                  </Button>
                  <Button
                    variant={animationType === "fireflies" ? "default" : "outline"}
                    onClick={() => setAnimationType("fireflies")}
                    className="flex items-center gap-2 h-auto py-3 rounded-2xl"
                  >
                    <Bug className="w-4 h-4" />
                    {t('settings.animation.firefly')}
                  </Button>
                </div>
                <Button
                  variant={animationType === "none" ? "default" : "outline"}
                  onClick={() => setAnimationType("none")}
                  className="w-full h-auto py-3 rounded-2xl"
                >
                  {t('settings.animation.none')}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Clear Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <h2 className="text-lg font-medium text-foreground">
                {t('settings.clear.title')}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {t('settings.clear.desc')}
            </p>
            <Button
              variant="destructive"
              onClick={clearAllData}
              className="w-full rounded-2xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('settings.clear.button')}
            </Button>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-primary/5 border-primary/20 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              MoodSpace v1.0
            </h3>
            <p className="text-muted-foreground text-sm">
              {language === 'fr' 
                ? 'Votre espace zen pour créer, ressentir et s\'organiser'
                : 'Your zen space to create, feel and organize'
              }
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>✅ {t('settings.offline')}</span>
              <span>🔒 {t('settings.private')}</span>
              <span>🎨 Open Source</span>
            </div>
            <div className="text-foreground mt-8 text-sm">
              <p>{t('setting.personal.message')}</p>
              <div className="mt-6 flex items-center justify-between px-0 md:px-6">
                <ul className="flex flex-col gap-4 font-semibold text-muted-foreground">
                  <li>
                    <a href="www.linkedin.com/in/elvis-sylvano" className="flex text-xs md:text-sm w-fit items-center gap-2">
                      <Linkedin size={20}/> Faniry
                    </a>
                  </li>
                  <li>
                    <a href="mailto:elvissy04@gmail.com" className="flex text-xs md:text-sm w-fit items-center gap-2">
                      <Mail size={20}/> randriamanantenaranja@gmail.com
                    </a>
                  </li>
                  <li className="flex text-xs md:text-sm w-fit items-center gap-2">
                      <Phone size={20}/> +261 34 19 482 17
                  </li>
                </ul>
                <img src="/logo.png" alt="logo" width="40%"/>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}