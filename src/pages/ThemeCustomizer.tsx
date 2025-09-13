import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { 
  Palette, 
  Zap, 
  Heart, 
  Star, 
  Flower, 
  Gamepad2,
  Sparkles,
  Moon,
  Sun,
  Wand2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Storage } from "@/lib/storage"; 

interface CustomTheme {
  id: string;
  name: string;
  description: string;
  icon: any;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
  };
  darkColors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
  };
  gradients: string[];
  target: string;
}

export default function ThemeCustomizer() {
  const { effectiveTheme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCustomTheme, setSelectedCustomTheme] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomTheme = async()=>{
      const loaded = await Storage.getValue("customTheme");
      if (loaded) {
        setSelectedCustomTheme((loaded as {id: string}).id);
      }
    } 

    loadCustomTheme();
  },[])

  const customThemes: CustomTheme[] = [
    {
      id: "kawaii",
      name: "Kawaii Princess",
      description: "custom.theme1",
      icon: Heart,
      colors: {
        primary: "330 80% 70%",
        secondary: "320 60% 90%", 
        accent: "300 70% 85%",
        background: "320 30% 98%",
        card: "320 40% 96%"
      },
      darkColors: {
        primary: "330 70% 60%",
        secondary: "320 30% 15%",
        accent: "300 60% 25%",
        background: "320 20% 8%",
        card: "320 25% 12%"
      },
      gradients: ["from-pink-200 to-purple-300", "from-rose-200 to-pink-300"],
      target: "girls"
    },
    {
      id: "robot",
      name: "Cyber Robot",
      description: "custom.theme2",
      icon: Zap,
      colors: {
        primary: "200 100% 70%",
        secondary: "210 40% 85%",
        accent: "180 60% 80%",
        background: "220 15% 96%",
        card: "220 20% 92%"
      },
      darkColors: {
        primary: "200 100% 60%",
        secondary: "210 50% 15%",
        accent: "180 80% 50%",
        background: "220 20% 8%",
        card: "220 20% 12%"
      },
      gradients: ["from-cyan-400 to-blue-600", "from-blue-500 to-purple-600"],
      target: "tech"
    },
    {
      id: "gaming",
      name: "Gaming Beast",
      description: "custom.theme3",
      icon: Gamepad2,
      colors: {
        primary: "120 80% 60%",
        secondary: "240 40% 85%",
        accent: "60 70% 70%",
        background: "240 15% 96%",
        card: "240 20% 92%"
      },
      darkColors: {
        primary: "120 100% 50%",
        secondary: "240 100% 25%",
        accent: "60 100% 50%",
        background: "240 20% 5%",
        card: "240 15% 10%"
      },
      gradients: ["from-green-400 to-blue-600", "from-purple-500 to-green-500"],
      target: "gamers"
    },
    {
      id: "nature",
      name: "Nature Zen",
      description: "custom.theme4",
      icon: Flower,
      colors: {
        primary: "120 40% 50%",
        secondary: "80 30% 85%",
        accent: "100 50% 70%",
        background: "90 20% 97%",
        card: "90 30% 94%"
      },
      darkColors: {
        primary: "120 50% 60%",
        secondary: "80 30% 15%",
        accent: "100 40% 25%",
        background: "90 20% 8%",
        card: "90 25% 12%"
      },
      gradients: ["from-green-200 to-emerald-300", "from-lime-200 to-green-300"],
      target: "nature"
    },
    {
      id: "galaxy",
      name: "Galaxy Dreams",
      description: "custom.theme5",
      icon: Star,
      colors: {
        primary: "260 70% 70%",
        secondary: "280 40% 85%",
        accent: "240 60% 80%",
        background: "270 20% 96%",
        card: "270 25% 92%"
      },
      darkColors: {
        primary: "260 80% 65%",
        secondary: "280 40% 15%",
        accent: "240 100% 80%",
        background: "270 30% 8%",
        card: "270 25% 12%"
      },
      gradients: ["from-purple-500 to-indigo-600", "from-violet-500 to-purple-600"],
      target: "dreamers"
    },
    {
      id: "sunset",
      name: "Sunset Vibes",
      description: "custom.theme6",
      icon: Sun,
      colors: {
        primary: "25 95% 60%",
        secondary: "45 70% 88%",
        accent: "15 85% 75%",
        background: "35 25% 97%",
        card: "35 35% 94%"
      },
      darkColors: {
        primary: "25 85% 65%",
        secondary: "45 40% 15%",
        accent: "15 70% 25%",
        background: "35 25% 8%",
        card: "35 30% 12%"
      },
      gradients: ["from-orange-300 to-red-400", "from-yellow-300 to-orange-400"],
      target: "warm"
    },
    {
      id: "magic",
      name: "Magic Sparkle",
      description: "custom.theme7",
      icon: Wand2,
      colors: {
        primary: "290 70% 65%",
        secondary: "310 50% 88%",
        accent: "270 80% 75%",
        background: "300 25% 96%",
        card: "300 35% 93%"
      },
      darkColors: {
        primary: "290 70% 65%",
        secondary: "310 40% 15%",
        accent: "270 60% 25%",
        background: "300 25% 8%",
        card: "300 30% 12%"
      },
      gradients: ["from-purple-300 to-pink-400", "from-violet-300 to-purple-400"],
      target: "magic"
    },
    {
      id: "ocean",
      name: "Ocean Depths",
      description: "custom.theme8",
      icon: Moon,
      colors: {
        primary: "200 80% 55%",
        secondary: "220 40% 85%",
        accent: "180 70% 70%",
        background: "210 25% 96%",
        card: "210 35% 92%"
      },
      darkColors: {
        primary: "200 70% 60%",
        secondary: "220 40% 15%",
        accent: "180 60% 25%",
        background: "210 25% 8%",
        card: "210 30% 12%"
      },
      gradients: ["from-blue-300 to-cyan-400", "from-sky-300 to-blue-400"],
      target: "calm"
    }
  ];

  const applyCustomTheme = async (customTheme: CustomTheme) => {
    const root = document.documentElement;
    
    const colorsToApply =
      effectiveTheme === "dark" && customTheme.darkColors
        ? customTheme.darkColors
        : customTheme.colors;

    root.style.setProperty('--primary', colorsToApply.primary);
    root.style.setProperty('--secondary', colorsToApply.secondary);
    root.style.setProperty('--accent', colorsToApply.accent);
    root.style.setProperty('--background', colorsToApply.background);
    root.style.setProperty('--card', colorsToApply.card);

    try {
      const {icon, ...filterTheme} = customTheme;
      await Storage.setValue("customTheme", filterTheme).catch(console.error);
      await Storage.updateUserSettings({ custom_theme: filterTheme });
      setSelectedCustomTheme(customTheme.id);
      toast({
        title: `Theme ${customTheme.name} ${t('custom.toast.activated')}!`,
        description: `${customTheme.description} (Mode ${effectiveTheme === "dark" ? "sombre" : "clair"})`,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du thème personnalisé", error);
    }
  };

  const resetToDefault = async () => {
    const root = document.documentElement;
    const isLight = effectiveTheme === 'light';

    // Reset CSS variables
    if (isLight) {
      root.style.setProperty('--primary', '250 40% 60%');
      root.style.setProperty('--secondary', '30 20% 92%');
      root.style.setProperty('--accent', '150 30% 85%');
      root.style.setProperty('--background', '30 15% 98%');
      root.style.setProperty('--card', '0 0% 100%');
    } else {
      root.style.setProperty('--primary', '250 35% 65%');
      root.style.setProperty('--secondary', '240 8% 15%');
      root.style.setProperty('--accent', '150 25% 25%');
      root.style.setProperty('--background', '240 8% 8%');
      root.style.setProperty('--card', '240 8% 10%');
    }

    try {
      await Storage.setValue("customTheme", undefined).catch(console.error);
      await Storage.updateUserSettings({ custom_theme: undefined });
      setSelectedCustomTheme(null);
      toast({
        title: t('custom.toast.success.title'),
        description: t('custom.toast.success.desc'),
      });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du thème", error);
    }
  };


  return (
    <div className="min-h-screen bg-background pb-20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-light text-foreground mb-2 font-dm-sans flex items-center justify-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            {t('custom.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('custom.subtitle')}
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/50">
            <Button
              onClick={resetToDefault}
              variant="outline"
              className="rounded-2xl"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('custom.default')}
            </Button>
          </Card>
        </motion.div>

        {/* Theme Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {customThemes.map((customTheme, index) => {
            const Icon = customTheme.icon;
            const isSelected = selectedCustomTheme === customTheme.id;
            
            return (
              <motion.div
                key={customTheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border/50 bg-card/60 hover:border-primary/50'
                  } backdrop-blur-sm`}
                  onClick={() => applyCustomTheme(customTheme)}
                >
                  {/* Preview Colors */}
                  <div className="mb-4">
                    <div className="flex gap-2 mb-3">
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: `hsl(${customTheme.colors.primary})` }}
                      />
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: `hsl(${customTheme.colors.secondary})` }}
                      />
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: `hsl(${customTheme.colors.accent})` }}
                      />
                    </div>
                    
                    {/* Gradient Preview */}
                    <div className={`h-16 rounded-2xl bg-gradient-to-r ${customTheme.gradients[0]} opacity-80`} />
                  </div>

                  {/* Theme Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-foreground">{customTheme.name}</h3>
                      {isSelected && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t(customTheme.description)}
                    </p>
                  </div>

                  {/* Target Badge */}
                  <div className="mt-4">
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                      {customTheme.target}
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 bg-primary/5 border-primary/20 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('custom.footer.title')}
            </h3>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {t('custom.footer.desc')}
            </p>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-6 text-sm text-muted-foreground text-center"
        >
          {t('global.footer')}
        </motion.p>
      </motion.div>
    </div>
  );
}