import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeProvider';
import { useToast } from '@/hooks/use-toast';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if Ctrl/Cmd + key combination
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'h': // Home/Dashboard
            event.preventDefault();
            navigate('/dashboard');
            showShortcutToast('Dashboard');
            break;
          case 'm': // Moodboard
            event.preventDefault();
            navigate('/moodboard');
            showShortcutToast('Moodboard');
            break;
          case 't': // Tasks
            event.preventDefault();
            navigate('/tasks');
            showShortcutToast('Tâches');
            break;
          case 'p': // Pomodoro
            event.preventDefault();
            navigate('/pomodoro');
            showShortcutToast('Pomodoro');
            break;
          case 'c': // Cards
            event.preventDefault();
            navigate('/cards');
            showShortcutToast('Cartes esthétiques');
            break;
          case 'k': // Theme customizer
            event.preventDefault();
            navigate('/themes');
            showShortcutToast('Personnalisation thèmes');
            break;
          case 's': // Settings
            event.preventDefault();
            navigate('/settings');
            showShortcutToast('Paramètres');
            break;
          case 'd': // Toggle dark mode
            event.preventDefault();
            const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
            setTheme(newTheme);
            toast({
              title: "Mode changé",
              description: `Basculé vers le mode ${newTheme === 'system' ? 'système' : newTheme === 'dark' ? 'sombre' : 'clair'}`,
              duration: 2000,
            });
            break;
        }
      }

      // Help shortcut
      if (event.key === '?' && event.shiftKey) {
        event.preventDefault();
        showHelpToast();
      }
    };

    const showShortcutToast = (page: string) => {
      toast({
        title: `Navigation : ${page}`,
        description: "Raccourci clavier utilisé",
        duration: 1500,
      });
    };

    const showHelpToast = () => {
      toast({
        title: "Raccourcis clavier",
        description: "Ctrl+H: Dashboard • Ctrl+M: Moodboard • Ctrl+T: Tâches • Ctrl+P: Pomodoro • Ctrl+C: Cartes • Ctrl+K: Thèmes • Ctrl+S: Paramètres • Ctrl+D: Basculer thème • Shift+?: Aide",
        duration: 8000,
      });
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate, setTheme, theme, toast]);
}