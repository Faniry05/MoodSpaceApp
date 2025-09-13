import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Music, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Storage } from "@/lib/storage"; 

const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

type TimerMode = 'work' | 'break';
type TimerState = 'idle' | 'running' | 'paused';

export default function PomodoroTimer() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [mode, setMode] = useState<TimerMode>('work');
  const [state, setState] = useState<TimerState>('idle');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

  const musicTracks = [
    { name: "Beauty", url: "/musics/Beauty(chosic.com).mp3" },
    { name: "Narrow Skies", url: "/musics/Aestia-ft.-Narrow-Skies(chosic.com).mp3" },
    { name: "Graveyard", url: "/musics/Asian-Graveyard-Remastered(chosic.com).mp3" },
    { name: "Eyes in the void", url: "/musics/EyesInTheVoid-chosic.com_.mp3" },
    { name: "Golden hour", url: "/musics/Golden-Hour-chosic.com_.mp3" },
    { name: "Precious memories", url: "/musics/precious-memories(chosic.com).mp3" },
    { name: "The lengend", url: "/musics/wombat-noises-audio-the-legend-of-narmer(chosic.com).mp3" },
    
  ];

  useEffect(() => {
    async function load() {
      try {
        const session = await Storage.getPomodoroSessionForToday();
        setCompletedPomodoros(session?.completed_sessions || 0);
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  useEffect(() => {
    Storage.savePomodoroSessionForToday(completedPomodoros)
      .catch(console.error);
  }, [completedPomodoros]);

  // Précharge tous les fichiers audio au montage du composant
  useEffect(() => {
    musicTracks.forEach((track, index) => {
      const audio = new Audio(track.url);
      audio.preload = 'auto';
      audio.loop = true;
      audioRefs.current.set(index, audio);
    });

    return () => {
      // Nettoyage lors du démontage du composant
      audioRefs.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      });
    };
  }, []);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state]);

  // Gère la lecture/pause de la musique en fonction de l'état du timer et de l'activation
  useEffect(() => {
    const audio = audioRefs.current.get(currentTrack);
    if (audio) {
      if (musicEnabled && state === 'running') {
        audio.play().catch(console.error);
      } else {
        audio.pause();
      }
    }
  }, [currentTrack, musicEnabled, state]);

  const handleTimerComplete = () => {
    setState('idle');
    
    if (mode === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      setMode('break');
      setTimeLeft(BREAK_TIME);
    } else {
      setMode('work');
      setTimeLeft(WORK_TIME);
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' 
          ? t('pomodoro.completed') + ' ' + t('pomodoro.break')
          : t('pomodoro.work'),
        icon: '/favicon.ico',
      });
    }
  };

  const startTimer = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setState('running');
  };

  const pauseTimer = () => {
    setState('paused');
  };

  const resetTimer = () => {
    setState('idle');
    setMode('work');
    setTimeLeft(WORK_TIME);
    const currentAudio = audioRefs.current.get(currentTrack);
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };

  const nextTrack = () => {
    // Pause la piste actuelle avant de changer
    const currentAudio = audioRefs.current.get(currentTrack);
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const newTrack = (currentTrack + 1) % musicTracks.length;
    setCurrentTrack(newTrack);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

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
            {t('pomodoro.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('pomodoro.subtitle')}
          </p>
        </motion.div>

        {/* Timer Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 bg-card/60 backdrop-blur-sm border-border/50 text-center relative overflow-hidden">
            {/* Animated background */}
            <motion.div
              className={`absolute inset-0 ${
                mode === 'work' 
                  ? 'bg-gradient-to-br from-primary/5 to-primary/10' 
                  : 'bg-gradient-to-br from-green-500/5 to-green-500/10'
              }`}
              animate={{
                scale: state === 'running' ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 4,
                repeat: state === 'running' ? Infinity : 0,
                ease: "easeInOut",
              }}
            />

            {/* Progress Circle */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-border"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={mode === 'work' ? 'text-primary' : 'text-green-500'}
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              
              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={timeLeft}
                  initial={{ scale: 1.1, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl md:text-6xl font-light text-foreground font-mono"
                >
                  {formatTime(timeLeft)}
                </motion.div>
                <div className="flex items-center gap-2 mt-2">
                  {mode === 'work' ? (
                    <Play className="w-4 h-4 text-primary" />
                  ) : (
                    <Coffee className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-muted-foreground text-sm font-medium">
                    {mode === 'work' ? t('pomodoro.work') : t('pomodoro.break')}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 relative z-10">
              <AnimatePresence mode="wait">
                {state === 'idle' || state === 'paused' ? (
                  <motion.div
                    key="start"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    <Button
                      size="lg"
                      onClick={startTimer}
                      className="px-8 py-4 rounded-2xl text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {t('pomodoro.start')}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={pauseTimer}
                      className="px-8 py-4 rounded-2xl text-lg"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      {t('pomodoro.pause')}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Button
                size="lg"
                variant="ghost"
                onClick={resetTimer}
                className="px-6 py-4 rounded-2xl"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Music Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                {t('pomodoro.music.title')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMusic}
                className="rounded-full"
              >
                {musicEnabled ? (
                  <Volume2 className="w-4 h-4 text-primary" />
                ) : (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {t('pomodoro.music.track')}: {musicTracks[currentTrack].name}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTrack}
                  className="rounded-2xl flex-1"
                  disabled={!musicEnabled}
                >
                  {t('pomodoro.music.next')}
                </Button>
                <Button
                  variant={musicEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleMusic}
                  className="rounded-2xl px-6"
                >
                  {musicEnabled ? "Arrêter" : "Jouer"}
                </Button>
              </div>
            </div>
            
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-primary/5 border-primary/20 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('pomodoro.today')}
            </h3>
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: Math.max(completedPomodoros, 1) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: i < completedPomodoros ? 1 : 0.3 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-4 h-4 rounded-full ${
                    i < completedPomodoros ? 'bg-primary' : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {completedPomodoros} {t('pomodoro.completedNumber')}
            </p>
          </Card>
        </motion.div>

        {/* Floating Particles */}
        {state === 'running' && (
          <div className="fixed inset-0 pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/30 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  opacity: 0,
                }}
                animate={{
                  y: -50,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        )}

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