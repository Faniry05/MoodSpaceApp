import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Heart, Sun, Cloud, CloudRain, Music, Smile, Meh, Frown, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import MoodHistory from "@/components/MoodHistory";
import MoodCalculation from "@/components/MoodCalculation";
import AIChatBubble from "@/components/AIChatBubble";
import { Storage } from "@/lib/storage";

const weatherMoods = [
  { icon: Sun, labelKey: "dashboard.weather.sunny", value: "sunny" },
  { icon: Cloud, labelKey: "dashboard.weather.cloudy", value: "cloudy" },
  { icon: CloudRain, labelKey: "dashboard.weather.rainy", value: "rainy" },
];

const emotionMoods = [
  { icon: Smile, labelKey: "dashboard.emotion.happy", value: "happy", color: "text-green-500" },
  { icon: Meh, labelKey: "dashboard.emotion.neutral", value: "neutral", color: "text-yellow-500" },
  { icon: Frown, labelKey: "dashboard.emotion.sad", value: "sad", color: "text-blue-500" },
];

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [dailyMessage, setDailyMessage] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [directRating, setDirectRating] = useState<number[]>([5]);
  const [currentMusic, setCurrentMusic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState([])

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {  
      // Load mood history for the last 7 days
      const historyData = await Storage.getMoodDataForLast7Days();
      setMoodHistory(historyData);   
      // Load today's mood data
      const moodData = await Storage.getMoodByDate(today);
      if (moodData) {
        setSelectedWeather(moodData.weather || "");
        setSelectedEmotion(moodData.emotion || "");
        setDirectRating([moodData.direct_rating || 5]);
        setDailyMessage(moodData.notes || "");
        setCurrentMusic(moodData.music || "");
      }
  };

  // Load saved data
  useEffect(() => {
    loadData();
  }, [today]);

  const saveMoodData = async () => {
    if (!selectedWeather || !selectedEmotion) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une météo et une émotion",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const existingMood = await Storage.getMoodByDate(today);
      
      if (existingMood) {
        await Storage.update('moods', existingMood.id, {
          weather: selectedWeather,
          emotion: selectedEmotion,
          direct_rating: directRating[0],
          notes: dailyMessage,
          music: currentMusic,
        });
      } else {
        await Storage.create('moods', {
          date: today,
          weather: selectedWeather,
          emotion: selectedEmotion,
          direct_rating: directRating[0],
          notes: dailyMessage,
          music: currentMusic,
        });
      }

      // Cleanup old mood data (keep only 7 days)
      await Storage.cleanupOldMoods();
      // Reload data after saving
      await loadData();
      toast({
        title: "Succès",
        description: "Votre humeur a été enregistrée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
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
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-light text-foreground mb-2 font-dm-sans">
            {t('dashboard.greeting')}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString(language, { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </motion.div>

        {/* Mood Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            {/* Daily Message */}
            <div className="">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium text-foreground">
                  {t('dashboard.today')}
                </h2>
              </div>
              <Textarea
                placeholder={t('dashboard.message.placeholder')}
                value={dailyMessage}
                onChange={(e) => setDailyMessage(e.target.value)}
                className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            {/* Music Mood */}
            <div className="mt-5">
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-foreground">
                  {t('dashboard.music.title')}
                </h3>
              </div>
              <Textarea
                placeholder={t('dashboard.music.placeholder')}
                value={currentMusic}
                onChange={(e) => setCurrentMusic(e.target.value)}
                className="min-h-[80px] bg-background/50 border-border/50 focus:border-primary/50 transition-colors resize-none"
              />
            </div>
            <div className="mt-10">
              <h3 className="text-lg font-medium text-foreground mb-6">
                {t('dashboard.evaluation.title')}
              </h3>
              
              {/* Direct Rating */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">
                    {t('dashboard.evaluation.subtitle')} (1-10)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-lg font-semibold text-primary">
                      {directRating[0]}/10
                    </span>
                  </div>
                </div>
                <Slider
                  value={directRating}
                  onValueChange={setDirectRating}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('dashboard.evaluation.worst')}</span>
                  <span>{t('dashboard.evaluation.best')}</span>
                </div>
              </div>

              {/* Weather Mood */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">
                  {t('dashboard.weather.title')}
                </h4>
                <div className="flex gap-3">
                  {weatherMoods.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={selectedWeather === mood.value ? "default" : "outline"}
                      onClick={() => setSelectedWeather(mood.value)}
                      className="flex-1 group flex flex-col items-center gap-2 h-auto py-4 rounded-2xl"
                    >
                      <mood.icon className="w-6 h-6" />
                      <span className="text-sm">{t(mood.labelKey)}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Emotion Mood */}
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-medium text-foreground">
                  {t('dashboard.emotion.title')}
                </h4>
                <div className="flex gap-3">
                  {emotionMoods.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={selectedEmotion === mood.value ? "default" : "outline"}
                      onClick={() => setSelectedEmotion(mood.value)}
                      className="flex-1 flex flex-col items-center gap-2 h-auto py-4 rounded-2xl"
                    >
                      <mood.icon className={`w-6 h-6 ${selectedEmotion === mood.value ? "text-white" : mood.color}`} />
                      <span className="text-sm">{t(mood.labelKey)}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {/* Save Button */}
            <Button
              onClick={saveMoodData}
              disabled={isLoading || !selectedWeather || !selectedEmotion}
              className="w-full mt-6"
            >
              {isLoading ? t('dashboard.saving') : t('dashboard.save')}
            </Button>
          </Card>

        </motion.div>

        {/* Daily Summary */}
        {(dailyMessage || selectedWeather || selectedEmotion || currentMusic) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-medium text-foreground mb-3">
                {t('dashboard.summary.title')}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {selectedWeather && (
                  <p>🌤️ {t('dashboard.weather.title')} : {t(weatherMoods.find(m => m.value === selectedWeather)?.labelKey || '')}</p>
                )}
                {selectedEmotion && (
                  <p>💭 {t('dashboard.emotion.title')} : {t(emotionMoods.find(m => m.value === selectedEmotion)?.labelKey || '')}</p>
                )}
                {currentMusic && (
                  <p>🎵 {t('dashboard.music.title')} - {t('dashboard.music.placeholder').toLowerCase()}</p>
                )}
                {dailyMessage && (
                  <p className="mt-2">💝 {t('dashboard.personalMessage')}</p>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Mood History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <MoodHistory data={moodHistory}/>
        </motion.div>

        {/* Mood Calculation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8"
        >
          <MoodCalculation />
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
      <AIChatBubble />
    </div>
  );
}