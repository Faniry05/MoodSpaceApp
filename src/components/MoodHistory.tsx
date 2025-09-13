import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Calendar, TrendingUp } from "lucide-react";

// Données d'exemple pour la semaine
// const mockWeekData = (await Storage.getMoodDataForLast7Days());

const CustomTooltip = ({ active, payload, label }: any) => {
  const { t, language } = useLanguage();
  if (active && payload && payload.length) {
    const today = new Date();
    const dayToFormat = new Date(today.setDate(today.getDate() - (today.getDay() - label + 7) % 7));
    const formattedDay = dayToFormat.toLocaleDateString(language, { weekday: 'long' });
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-foreground font-medium">{formattedDay}</p>
        <p className="text-primary">
          {`${t('history.mood')} : ${payload[0].value}/10`}
        </p>
      </div>
    );
  }
  return null;
};

export default function MoodHistory({data}) {
  const { t, language } = useLanguage();
  const dayMap = {"dim.": 0, "lun.": 1, "mar.": 2, "mer.": 3, "jeu.": 4, "ven.": 5, "sam.": 6};

  const transformedData = data.map(d => ({
    ...d,
    day: dayMap[d.day] // Convertit le nom du jour en un index
  }));

  const formatDay = (dayIndex) => {
    const today = new Date();
    const formattedDate = new Date(today.setDate(today.getDate() - (today.getDay() - dayIndex + 7) % 7));

    return formattedDate.toLocaleDateString(language, { weekday: 'short' });
  };
  
  const calculateOverallMoodScoreFromMock = (data) => {
    if (!data || data.length === 0) {
      console.warn("Le tableau data est vide. Le score ne peut pas être calculé.");
      return 0;
    }

    const todayEntry = data[data.length - 1];
    const todayRating = todayEntry?.mood || 0;

    const directScore = todayRating * 0.40;

    const daysWithEntries = data.filter(day => day?.mood > 0).length;
    const frequencyScore = (daysWithEntries / data.length) * 10;
    const frequencyWeightedScore = frequencyScore * 0.25;

    let trendWeightedScore = 0;
    if (data.length > 1) {
      const firstMood = data[0]?.mood;
      const lastMood = data[data.length - 1].mood;
      const trendValue = lastMood - firstMood;

      const normalizedTrend = (trendValue + 9) / 1.8;
      trendWeightedScore = normalizedTrend * 0.35;
    }
    
    const finalScore = directScore + frequencyWeightedScore + trendWeightedScore;

    return Math.round(finalScore * 100) / 100;
  };

  const tendanceMood = ()=> {
    const todayIndex = 6; 
    if (todayIndex < 1) return 'unknown';

    const moodToday = transformedData[todayIndex]?.mood;
    const moodYesterday = transformedData[todayIndex - 1]?.mood;

    if (moodToday > moodYesterday) return 'Positive';
    if (moodToday < moodYesterday) return 'Negative';
    return 'Neutral';
  }

  const getBestDay = () => {

    const bestDayEntry = data.find(d => d.mood === Math.max(...data.map(d => d.mood)));

    if (bestDayEntry && dayMap.hasOwnProperty(bestDayEntry.day)) {
      const dayIndex = dayMap[bestDayEntry.day];
      
      const today = new Date();
      const bestDayDate = new Date(today.setDate(today.getDate() - (today.getDay() - dayIndex + 7) % 7));

      return bestDayDate.toLocaleDateString(language, { weekday: 'short' });
    }
    
    return "-";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-card/60 backdrop-blur-sm border border-border/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="text-2xl font-light text-foreground">
              {t('history.title')}
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            {t('history.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 rounded-2xl bg-primary/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{t('history.moyenne')}</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {calculateOverallMoodScoreFromMock(transformedData)}/10
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-accent/10">
              <span className="text-sm font-medium text-foreground block mb-2">{t('history.bestDay')}</span>
              <p className="text-2xl font-bold text-accent">
                {getBestDay()}
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-secondary/10">
              <span className="text-sm font-medium text-foreground block mb-2">{t('history.trend')}</span>
              <p className="text-2xl font-bold text-secondary-foreground">
                📈 {tendanceMood()}
              </p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transformedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  tickFormatter={formatDay}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 10]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            {t('history.footer')}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}