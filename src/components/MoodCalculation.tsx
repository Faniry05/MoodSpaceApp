import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Calculator, TrendingUp, Clock, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

export default function MoodCalculation() {
  const { t } = useLanguage();

  const calculationFactors = [
    {
      icon: Star,
      title: "calculation.factors.title1",
      description: "calculation.factors.description1",
      weight: "40%",
      color: "text-yellow-500"
    },
    {
      icon: Clock,
      title: "calculation.factors.title2",
      description: "calculation.factors.description2",
      weight: "25%",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      title: "calculation.factors.title3",
      description: "calculation.factors.description3",
      weight: "35%",
      color: "text-green-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            {t("calculation.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("calculation.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {calculationFactors.map((factor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/30"
            >
              <factor.icon className={`h-5 w-5 mt-0.5 ${factor.color}`} />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{t(factor.title)}</h4>
                <p className="text-sm text-muted-foreground">{t(factor.description)}</p>
                <span className="text-xs font-medium text-primary">{t('calculation.weight')}: {factor.weight}</span>
              </div>
            </motion.div>
          ))}
          
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-medium text-foreground mb-2">{t('calculation.formula')} :</h4>
            <p className="text-sm text-muted-foreground">
              <code className="bg-muted/50 px-2 py-1 rounded text-xs text-foreground/90">
                {t("calculation.score")}
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}