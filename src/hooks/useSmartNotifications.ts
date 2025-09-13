import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Storage } from '@/lib/storage'; // ta classe Storage avec getValue/setValue

export function useSmartNotifications() {
  const { toast } = useToast();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    async function showWelcomeIfNeeded() {
      try {
        const hasVisited = await Storage.getValue<string>('moodspace-visited');
        if (!hasVisited && !hasShownWelcome) {
          setTimeout(() => {
            toast({
              title: "Bienvenue dans MoodSpace ! 🌟",
              description: "Appuyez sur Shift+? pour voir les raccourcis clavier",
              duration: 5000,
            });
            setHasShownWelcome(true);
            Storage.setValue('moodspace-visited', 'true').catch(console.error);
          }, 2000);
        }
      } catch (error) {
        console.error('Erreur vérification visite:', error);
      }
    }

    async function checkTimeAndNotify() {
      try {
        const hour = new Date().getHours();
        const lastReminder = await Storage.getValue<string>('last-productivity-reminder');
        const today = new Date().toDateString();

        if (lastReminder !== today) {
          if (hour >= 9 && hour <= 11) {
            setTimeout(() => {
              toast({
                title: "Moment productif ! 🚀",
                description: "C'est le moment idéal pour organiser tes tâches",
                duration: 4000,
              });
              Storage.setValue('last-productivity-reminder', today).catch(console.error);
            }, 10000);
          } else if (hour >= 14 && hour <= 16) {
            setTimeout(() => {
              toast({
                title: "Pause créative ? 🎨",
                description: "Pourquoi ne pas créer quelque chose dans ton moodboard ?",
                duration: 4000,
              });
              Storage.setValue('last-productivity-reminder', today).catch(console.error);
            }, 10000);
          }
        }
      } catch (error) {
        console.error('Erreur notification productivité:', error);
      }
    }

    async function checkTaskCompletion() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const tasksJSON = await Storage.getValue<string>(`tasks-${today}`);
        const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
        const completedTasks = tasks.filter((task: any) => task.completed);

        const lastEncouragement = await Storage.getValue<string>('last-encouragement');
        const lastCountStr = await Storage.getValue<string>('last-completed-count');
        const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;

        if (
          completedTasks.length > lastCount &&
          completedTasks.length > 0 &&
          lastEncouragement !== today
        ) {
          const messages = [
            "Excellent travail ! 🎉",
            "Tu es en feu ! 🔥",
            "Continue comme ça ! ⭐",
            "Impressionnant ! 💪",
            "Tu déchires ! 🌟"
          ];

          toast({
            title: messages[Math.floor(Math.random() * messages.length)],
            description: `${completedTasks.length} tâche${completedTasks.length > 1 ? 's' : ''} terminée${completedTasks.length > 1 ? 's' : ''} aujourd'hui !`,
            duration: 3000,
          });

          await Storage.setValue('last-encouragement', today);
          await Storage.setValue('last-completed-count', completedTasks.length.toString());
        }
      } catch (error) {
        console.error('Erreur encouragement tâches:', error);
      }
    }

    // Démarrage des notifications
    showWelcomeIfNeeded();
    checkTimeAndNotify();
    const productivityInterval = setInterval(checkTimeAndNotify, 60 * 60 * 1000);
    const taskInterval = setInterval(checkTaskCompletion, 30000);

    return () => {
      clearInterval(productivityInterval);
      clearInterval(taskInterval);
    };
  }, [toast, hasShownWelcome]);

  const notifyThemeChange = (themeName: string) => {
    toast({
      title: "Nouveau style appliqué ! ✨",
      description: `Thème "${themeName}" activé avec succès`,
      duration: 2000,
    });
  };

  const notifySuccess = (action: string, details?: string) => {
    const successMessages = {
      export: "Données exportées ! 📦",
      save: "Sauvegardé ! 💾",
      create: "Créé avec succès ! ✨",
      complete: "Terminé ! ✅",
      delete: "Supprimé ! 🗑️"
    };

    toast({
      title: successMessages[action as keyof typeof successMessages] || "Action réussie !",
      description: details || "L'action a été effectuée avec succès",
      duration: 2500,
    });
  };

  return {
    notifyThemeChange,
    notifySuccess,
  };
}
