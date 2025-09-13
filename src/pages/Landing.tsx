import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageProvider";

const features = [
  {
    icon: Heart,
    titleKey: "landing.features.mood.title",
    descKey: "landing.features.mood.desc"
  },
  {
    icon: Palette,
    titleKey: "landing.features.moodboard.title", 
    descKey: "landing.features.moodboard.desc"
  },
  {
    icon: Sparkles,
    titleKey: "landing.features.zen.title",
    descKey: "landing.features.zen.desc"
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        {/* Logo/Title */}
        <motion.div
          className="mb-8"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center animate-float">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-foreground mb-4 font-dm-sans">
            Mood<span className="text-primary font-medium">Space</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            {t('landing.subtitle')}
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
              className="text-center p-6 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="px-8 py-4 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t('landing.cta')}
          </Button>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          {t('landing.footer')}
        </motion.p>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-3 h-3 bg-primary/30 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-2 h-2 bg-accent/40 rounded-full"
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-4 h-4 bg-primary/20 rounded-full"
        animate={{
          y: [0, -25, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}