import React, { createContext, useContext, useState, useEffect } from 'react';

import { Storage } from '@/lib/storage';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  fr: {
    // Landing
    'landing.title': 'MoodSpace',
    'landing.subtitle': 'Votre espace zen pour créer, ressentir et s\'organiser',
    'landing.cta': 'Accéder à MoodSpace',
    'landing.features.mood.title': 'Mood Tracking',
    'landing.features.mood.desc': 'Suivez vos émotions avec douceur et bienveillance',
    'landing.features.moodboard.title': 'Moodboard Créatif',
    'landing.features.moodboard.desc': 'Organisez vos inspirations visuelles en toute simplicité',
    'landing.features.zen.title': 'Zen & Minimal',
    'landing.features.zen.desc': 'Une interface apaisante pour stimuler votre créativité',
    'landing.footer': 'Aucune inscription requise • Fonctionne hors ligne • 100% privé',

    // Navigation
    'nav.home': 'Accueil',
    'nav.moodboard': 'Moodboard',
    'nav.cards': 'Cartes',
    'nav.themes': 'Thèmes',
    'nav.tasks': 'Tâches',
    'nav.settings': 'Paramètres',

    // Dashboard
    'dashboard.greeting': 'Bonjour ! ✨',
    'dashboard.today': 'Comment tu te sens aujourd\'hui ?',
    'dashboard.message.placeholder': 'Décris ton état d\'esprit, tes pensées du moment...',
    'dashboard.weather.title': 'Météo intérieure',
    'dashboard.weather.sunny': 'Ensoleillé',
    'dashboard.weather.cloudy': 'Nuageux',
    'dashboard.weather.rainy': 'Pluvieux',
    'dashboard.emotion.title': 'État émotionnel',
    'dashboard.emotion.happy': 'Joyeux',
    'dashboard.emotion.neutral': 'Neutre',
    'dashboard.emotion.sad': 'Triste',
    'dashboard.music.title': 'Musique du moment',
    'dashboard.music.placeholder': 'Que écoutes-tu ? Quelle ambiance musicale te correspond...',
    'dashboard.summary.title': 'Ton mood d\'aujourd\'hui ✨',
    'dashboard.evaluation.title': 'Évaluation de votre humeur',
    'dashboard.evaluation.subtitle': 'Évaluation directe',
    'dashboard.evaluation.worst': 'Très mauvais',
    'dashboard.evaluation.best': 'Excellent',
    'dashboard.saving': 'Enregistrement...',
    'dashboard.save': 'Enregistrer mon humeur',
    'dashboard.personalMessage': 'Message personnel enregistré',

    //Weekly history
    'history.title': 'Historique de la semaine',
    'history.subtitle': 'Votre évolution émotionnelle sur les 7 derniers jours',
    'history.moyenne': 'Moyenne',
    'history.bestDay': 'Meilleur jour',
    'history.trend': 'Tendance',
    'history.mood': 'Humeur',
    'history.footer': 'Cliquez sur un jour pour voir les détails',

    //Mood calculation
    'calculation.title': 'Comment calculons-nous votre note d\'humeur ?',
    'calculation.description': 'Votre note d\'humeur est calculée selon une formule intelligente qui prend en compte plusieurs facteurs',
    'calculation.score': 'Score = (Note × 0.4) + (Fréquence × 0.25) + (Tendance × 0.35)',
    'calculation.factors.title1': 'Évaluation directe',
    'calculation.factors.title2': 'Fréquence d\'utilisation',
    'calculation.factors.title3': 'Tendance récente',
    'calculation.factors.description1': 'Note donnée par l\'utilisateur (1-10)',
    'calculation.factors.description2': 'Régularité des entrées d\'humeur',
    'calculation.factors.description3': 'Évolution sur les 7 derniers jours',
    'calculation.weight': 'Poids',
    'calculation.formula': 'Formule de calcul',

    // Tasks
    'tasks.title': 'Mes 5 tâches du jour',
    'tasks.subtitle': 'Concentrez-vous sur l\'essentiel, une tâche à la fois',
    'tasks.add.placeholder': 'Ajouter une nouvelle tâche...',
    'tasks.remaining': 'tâche restante | tâches restantes',
    'tasks.empty.title': 'Aucune tâche pour aujourd\'hui',
    'tasks.empty.desc': 'Commencez par ajouter votre première tâche de la journée',
    'tasks.completed.title': 'Bravo ! Toutes vos tâches sont terminées !',
    'tasks.completed.desc': 'Prenez un moment pour célébrer cette réussite',
    'tasks.progress': 'Progression du jour',
    'tasks.label': 'tâche',
    'tasks.left': 'restante',

    // Moodboard
    'moodboard.title': 'Mon Moodboard',
    'moodboard.subtitle': 'Collectionnez vos inspirations visuelles',
    'moodboard.upload.title': 'Ajouter des images',
    'moodboard.upload.desc': 'Glissez-déposez vos images ou cliquez pour parcourir',
    'moodboard.upload.browse': 'Parcourir les fichiers',
    'moodboard.caption.placeholder': 'Ajouter une légende...',
    'moodboard.empty.title': 'Votre moodboard est vide',
    'moodboard.empty.desc': 'Commencez par ajouter vos premières inspirations',
    'moodboard.offline.warning': 'Hors ligne.',

    //Card Aesthetic
    'cards.exported.last': 'Dernières cartes exportées',
    'cards.title': 'Cartes esthétiques',
    'cards.subtitle': 'Créez de magnifiques cartes personnalisées à partager ou imprimer',
    'cards.content': 'Contenu de la carte',
    'cards.content.title': 'Titre principal',
    'cards.content.subtitle': 'Sous-titre',
    'cards.content.message': 'Citation ou message',
    'cards.content.style': 'Style de la carte',
    'cards.content.background': 'Arrière-plan',
    'cards.content.textColor': 'Couleur du texte',
    'cards.content.shape': 'Forme décorative',
    'cards.export': 'Exporter',
    'cards.preview': 'Aperçu de la carte',
    'cards.mockup.title': 'Mon mood du jour',
    'cards.mockup.subtitle': 'Créé avec MoodSpace',
    'cards.mockup.message': 'La beauté commence au moment où vous décidez d\'être vous-même.',
    'cards.toast.success.title': 'Carte exportée !',
    'cards.toast.success.description1': 'Votre carte a été exportée en PNG.',
    'cards.toast.success.description2': 'Votre carte a été exportée en PDF.',
    'cards.toast.error.title': 'Erreur',
    'cards.toast.error.description': 'Impossible d\'exporter la carte',

    //Custom theme
    'custom.toast.activated': 'activé',
    'custom.toast.success.title': 'Thème par défaut restauré',
    'custom.toast.success.desc': 'Retour aux couleurs originales de MoodSpace',
    'custom.title': 'Personnalisation des Thèmes',
    'custom.subtitle': 'Choisis le thème qui te correspond le mieux !',
    'custom.default': 'Thème par défaut',
    'custom.footer.title': 'Ton thème, ton style !',
    'custom.footer.desc': 'Chaque thème est conçu pour refléter ta personnalité unique. Change quand tu veux pour que MoodSpace soit vraiment à ton image !',
    'custom.theme1': 'Doux et mignon pour les amoureux du rose',
    'custom.theme2': 'Futuriste et technologique',
    'custom.theme3': 'Pour les vrais gamers',
    'custom.theme4': 'Inspiré par la nature',
    'custom.theme5': 'Mystique et cosmique',
    'custom.theme6': 'Chaleureux comme un coucher de soleil',
    'custom.theme7': 'Magique et étincelant',
    'custom.theme8': 'Profond et apaisant comme l\'océan',

    // Settings
    'settings.title': 'Paramètres',
    'settings.theme.title': 'Apparence',
    'settings.theme.light': 'Clair',
    'settings.theme.system': 'Système',
    'settings.theme.dark': 'Sombre',
    'settings.language.title': 'Langue',
    'settings.language.french': 'Français',
    'settings.language.english': 'English',
    'settings.export.title': 'Exporter mes données',
    'settings.export.desc': 'Télécharger toutes vos données en format JSON',
    'settings.export.button': 'Exporter en JSON',
    'settings.clear.title': 'Effacer les données',
    'settings.clear.desc': 'Supprimer toutes les données stockées localement',
    'settings.clear.button': 'Tout effacer',
    'settings.clear.confirm': 'Êtes-vous sûr de vouloir effacer toutes vos données ?',
    'settings.toast.cleared': 'Données effacées',
    'settings.toast.desc': 'Toutes vos données ont été supprimées',
    'settings.mode': 'Mode actuel',
    'settings.animation.title': 'Animations d\'arrière-plan',
    'settings.animation.enable': 'Activer les animations',
    'settings.animation.choose': 'Choisissez le type d\'animation d\'arrière-plan',
    'settings.animation.bubble': 'Bulles',
    'settings.animation.snow': 'Neige',
    'settings.animation.particle': 'Particules',
    'settings.animation.firefly': 'Lucioles',
    'settings.animation.none': 'Aucune animation',
    'settings.offline': 'Hors-ligne',
    'settings.private': 'Privé',
    'setting.personal.message': 'Pour concrétiser le projet ou si vous avez des suggestions, n\'hésitez pas à me contacter.',

    // Pomodoro
    'pomodoro.title': 'Pomodoro Zen',
    'pomodoro.subtitle': 'Travaillez par cycles de 25 minutes',
    'pomodoro.start': 'Commencer',
    'pomodoro.pause': 'Pause',
    'pomodoro.reset': 'Reset',
    'pomodoro.work': 'Travail',
    'pomodoro.break': 'Pause',
    'pomodoro.completed': 'Session terminée !',
    'pomodoro.music.title': 'Musique d\'ambiance',
    'pomodoro.music.track': 'Piste',
    'pomodoro.music.next': 'Piste suivante',
    'pomodoro.today': 'Pomodoros du jour',
    'pomodoro.completedNumber': 'terminé aujourd\'hui',

    //Global Footer
    'global.footer': 'Beta version • Copyright © 2025 MoodSpace • Créé avec ❤️ par Elvis Sylvano',
  },
  en: {
    // Landing
    'landing.title': 'MoodSpace',
    'landing.subtitle': 'Your zen space to create, feel and organize',
    'landing.cta': 'Enter MoodSpace',
    'landing.features.mood.title': 'Mood Tracking',
    'landing.features.mood.desc': 'Track your emotions with gentleness and mindfulness',
    'landing.features.moodboard.title': 'Creative Moodboard',
    'landing.features.moodboard.desc': 'Organize your visual inspirations with simplicity',
    'landing.features.zen.title': 'Zen & Minimal',
    'landing.features.zen.desc': 'A soothing interface to boost your creativity',
    'landing.footer': 'No registration required • Works offline • 100% private',

    // Navigation
    'nav.home': 'Home',
    'nav.moodboard': 'Moodboard',
    'nav.cards': 'Cards',
    'nav.themes': 'Themes',
    'nav.tasks': 'Tasks',
    'nav.settings': 'Settings',

    // Dashboard
    'dashboard.greeting': 'Hello! ✨',
    'dashboard.today': 'How are you feeling today?',
    'dashboard.message.placeholder': 'Describe your mindset, your current thoughts...',
    'dashboard.weather.title': 'Inner Weather',
    'dashboard.weather.sunny': 'Sunny',
    'dashboard.weather.cloudy': 'Cloudy',
    'dashboard.weather.rainy': 'Rainy',
    'dashboard.emotion.title': 'Emotional State',
    'dashboard.emotion.happy': 'Happy',
    'dashboard.emotion.neutral': 'Neutral',
    'dashboard.emotion.sad': 'Sad',
    'dashboard.music.title': 'Current Music',
    'dashboard.music.placeholder': 'What are you listening to? What musical vibe fits you...',
    'dashboard.summary.title': 'Your mood today ✨',
    'dashboard.evaluation.title': 'Mood Evaluation',
    'dashboard.evaluation.subtitle': 'Direct Rating',
    'dashboard.evaluation.worst': 'Very Bad',
    'dashboard.evaluation.best': 'Excellent',
    'dashboard.saving': 'Saving...',
    'dashboard.save': 'Save my mood',
    'dashboard.personalMessage': 'Personal message saved',

    //Weekly history
    'history.title': 'Weekly History',
    'history.subtitle': 'Your emotional evolution over the last 7 days',
    'history.moyenne': 'Average',
    'history.bestDay': 'Best Day',
    'history.trend': 'Trend',
    'history.mood': 'Mood',
    'history.footer': 'Click on a day to see details',

    //Mood calculation
    'calculation.title': 'How do we calculate your mood score?',
    'calculation.description': 'Your mood score is calculated using an intelligent formula that takes into account several factors',
    'calculation.score': 'Score = (Rating × 0.4) + (Frequency × 0.25) + (Trend × 0.35)',
    'calculation.factors.title1': 'Direct Rating',
    'calculation.factors.title2': 'Usage Frequency',
    'calculation.factors.title3': 'Recent Trend',
    'calculation.factors.description1': 'Rating given by the user (1-10)',
    'calculation.factors.description2': 'Regularity of mood entries',
    'calculation.factors.description3': 'Evolution over the last 7 days',
    'calculation.weight': 'Weight',
    'calculation.formula': 'Calculation Formula',

    // Tasks
    'tasks.title': 'My 5 Tasks Today',
    'tasks.subtitle': 'Focus on the essentials, one task at a time',
    'tasks.add.placeholder': 'Add a new task...',
    'tasks.remaining': 'task remaining | tasks remaining',
    'tasks.empty.title': 'No tasks for today',
    'tasks.empty.desc': 'Start by adding your first task of the day',
    'tasks.completed.title': 'Congrats! All your tasks are completed!',
    'tasks.completed.desc': 'Take a moment to celebrate this achievement',
    'tasks.progress': 'Daily Progress',
    'tasks.label': 'task',
    'tasks.left': 'remaining',

    // Moodboard
    'moodboard.title': 'My Moodboard',
    'moodboard.subtitle': 'Collect your visual inspirations',
    'moodboard.upload.title': 'Add Images',
    'moodboard.upload.desc': 'Drag and drop your images or click to browse',
    'moodboard.upload.browse': 'Browse Files',
    'moodboard.caption.placeholder': 'Add a caption...',
    'moodboard.empty.title': 'Your moodboard is empty',
    'moodboard.empty.desc': 'Start by adding your first inspirations',
    'moodboard.offline.warning': 'Offline.',

    //Card Aesthetic
    'cards.exported.last': 'Last exported cards',
    'cards.title': 'Aesthetic Cards',
    'cards.subtitle': 'Create beautiful custom cards to share or print',
    'cards.content': 'Card content',
    'cards.content.title': 'Main title',
    'cards.content.subtitle': 'Subtitle',
    'cards.content.message': 'Quote or message',
    'cards.content.style': 'Card style',
    'cards.content.background': 'Background',
    'cards.content.textColor': 'Text color',
    'cards.content.shape': 'Decorative shape',
    'cards.export': 'Export',
    'cards.preview': 'Card preview',
    'cards.mockup.title': 'My mood today',
    'cards.mockup.subtitle': 'Created with MoodSpace',
    'cards.mockup.message': 'Beauty begins the moment you decide to be yourself.',
    'cards.toast.success.title': 'Card exported !',
    'cards.toast.success.description1': 'Your card has been exported as PNG.',
    'cards.toast.success.description2': 'You card has been exported as PDF.',
    'cards.toast.error.title': 'Error',
    'cards.toast.error.description': 'Impossible to export the card',

    //Custom theme
    'custom.toast.activated': 'activated',
    'custom.toast.success.title': 'Default theme restored',
    'custom.toast.success.desc': 'Return to the original MoodSpace colors',
    'custom.title': 'Customizing Themes',
    'custom.subtitle': 'Choose the theme that suits you best!',
    'custom.default': 'Default theme',
    'custom.footer.title': 'Your theme, your style!',
    'custom.footer.desc': 'Each theme is designed to reflect your unique personality. Change whenever you want to make MoodSpace truly yours!',
    'custom.theme1': 'Sweet and cute for pink lovers',
    'custom.theme2': 'Futuristic and technological',
    'custom.theme3': 'For real gamers',
    'custom.theme4': 'Inspired by nature',
    'custom.theme5': 'Mystical and cosmic',
    'custom.theme6': 'Warm as a sunset',
    'custom.theme7': 'Magical and sparkling',
    'custom.theme8': 'Deep and soothing like the ocean',

    // Settings
    'settings.title': 'Settings',
    'settings.theme.title': 'Appearance',
    'settings.theme.light': 'Light',
    'settings.theme.system': 'System',
    'settings.theme.dark': 'Dark',
    'settings.language.title': 'Language',
    'settings.language.french': 'Français',
    'settings.language.english': 'English',
    'settings.export.title': 'Export my data',
    'settings.export.desc': 'Download all your data in JSON format',
    'settings.export.button': 'Export as JSON',
    'settings.clear.title': 'Clear data',
    'settings.clear.desc': 'Delete all locally stored data',
    'settings.clear.button': 'Clear all',
    'settings.clear.confirm': 'Are you sure you want to clear all your data?',
    'settings.toast.cleared': 'Data cleared',
    'settings.toast.desc': 'All your data has been deleted',
    'settings.mode': 'Current mode',
    'settings.animation.title': 'Background animations',
    'settings.animation.enable': 'Enable animations',
    'settings.animation.choose': 'Choose the type of background animation',
    'settings.animation.bubble': 'Bubbles',
    'settings.animation.snow': 'Snow',
    'settings.animation.particle': 'Particles',
    'settings.animation.firefly': 'Fireflies',
    'settings.animation.none': 'No animation',
    'settings.offline': 'Offline',
    'settings.private': 'Private',
    'setting.personal.message': 'To concretise the project or if you have suggestions, feel free to contact me.',

    // Pomodoro
    'pomodoro.title': 'Zen Pomodoro',
    'pomodoro.subtitle': 'Work in 25-minute cycles',
    'pomodoro.start': 'Start',
    'pomodoro.pause': 'Pause',
    'pomodoro.reset': 'Reset',
    'pomodoro.work': 'Work',
    'pomodoro.break': 'Break',
    'pomodoro.completed': 'Session completed!',
    'pomodoro.music.title': 'Ambient Music',
    'pomodoro.music.track': 'Track',
    'pomodoro.music.next': 'Next Track',
    'pomodoro.today': 'Pomodoros Today',
    'pomodoro.completedNumber': 'completed today',

    //Global Footer
    'global.footer': 'Beta version • Copyright © 2025 MoodSpace • Made with ❤️ by Elvis Sylvano',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger la langue depuis Storage au démarrage
  useEffect(() => {
    async function loadLanguage() {
      try {
        const savedLang = await Storage.getValue<Language>('language');
        if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
          setLanguage(savedLang);
        }
      } catch (error) {
        console.error('Erreur chargement langue:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadLanguage();
  }, []);

  // Sauvegarder la langue dans Storage quand elle change
  useEffect(() => {
    if (isLoaded) {
      Storage.setValue('language', language).catch(console.error);
      Storage.updateUserSettings({ language }).catch(console.error);
    }
  }, [language, isLoaded]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Ne pas rendre les enfants tant que la langue est en cours de chargement
  if (!isLoaded) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};



// export const translations = {
//   fr: {
//     // Landing
//     'landing.title': 'MoodSpace',
//     'landing.subtitle': 'Votre espace zen pour créer, ressentir et s\'organiser',
//     'landing.cta': 'Accéder à MoodSpace',
//     'landing.features.mood.title': 'Mood Tracking',
//     'landing.features.mood.desc': 'Suivez vos émotions avec douceur et bienveillance',
//     'landing.features.moodboard.title': 'Moodboard Créatif',
//     'landing.features.moodboard.desc': 'Organisez vos inspirations visuelles en toute simplicité',
//     'landing.features.zen.title': 'Zen & Minimal',
//     'landing.features.zen.desc': 'Une interface apaisante pour stimuler votre créativité',
//     'landing.footer': 'Aucune inscription requise • Fonctionne hors ligne • 100% privé',

//     // Navigation
//     'nav.home': 'Accueil',
//     'nav.moodboard': 'Moodboard',
//     'nav.cards': 'Cartes',
//     'nav.themes': 'Thèmes',
//     'nav.tasks': 'Tâches',
//     'nav.settings': 'Paramètres',

//     // Dashboard
//     'dashboard.greeting': 'Bonjour ! ✨',
//     'dashboard.today': 'Comment tu te sens aujourd\'hui ?',
//     'dashboard.message.placeholder': 'Décris ton état d\'esprit, tes pensées du moment...',
//     'dashboard.weather.title': 'Météo intérieure',
//     'dashboard.weather.sunny': 'Ensoleillé',
//     'dashboard.weather.cloudy': 'Nuageux',
//     'dashboard.weather.rainy': 'Pluvieux',
//     'dashboard.emotion.title': 'État émotionnel',
//     'dashboard.emotion.happy': 'Joyeux',
//     'dashboard.emotion.neutral': 'Neutre',
//     'dashboard.emotion.sad': 'Triste',
//     'dashboard.music.title': 'Musique du moment',
//     'dashboard.music.placeholder': 'Que écoutes-tu ? Quelle ambiance musicale te correspond...',
//     'dashboard.summary.title': 'Ton mood d\'aujourd\'hui ✨',

//     // Tasks
//     'tasks.title': 'Mes 3 tâches du jour',
//     'tasks.subtitle': 'Concentrez-vous sur l\'essentiel, une tâche à la fois',
//     'tasks.add.placeholder': 'Ajouter une nouvelle tâche...',
//     'tasks.remaining': 'tâche restante | tâches restantes',
//     'tasks.empty.title': 'Aucune tâche pour aujourd\'hui',
//     'tasks.empty.desc': 'Commencez par ajouter votre première tâche de la journée',
//     'tasks.completed.title': 'Bravo ! Toutes vos tâches sont terminées !',
//     'tasks.completed.desc': 'Prenez un moment pour célébrer cette réussite ✨',
//     'tasks.progress': 'Progression du jour',

//     // Moodboard
//     'moodboard.title': 'Mon Moodboard',
//     'moodboard.subtitle': 'Collectionnez vos inspirations visuelles',
//     'moodboard.upload.title': 'Ajouter des images',
//     'moodboard.upload.desc': 'Glissez-déposez vos images ou cliquez pour parcourir',
//     'moodboard.upload.browse': 'Parcourir les fichiers',
//     'moodboard.caption.placeholder': 'Ajouter une légende...',
//     'moodboard.empty.title': 'Votre moodboard est vide',
//     'moodboard.empty.desc': 'Commencez par ajouter vos premières inspirations',

//     // Settings
//     'settings.title': 'Paramètres',
//     'settings.theme.title': 'Apparence',
//     'settings.theme.light': 'Clair',
//     'settings.theme.dark': 'Sombre',
//     'settings.language.title': 'Langue',
//     'settings.language.french': 'Français',
//     'settings.language.english': 'English',
//     'settings.export.title': 'Exporter mes données',
//     'settings.export.desc': 'Télécharger toutes vos données en format JSON',
//     'settings.export.button': 'Exporter en JSON',
//     'settings.clear.title': 'Effacer les données',
//     'settings.clear.desc': 'Supprimer toutes les données stockées localement',
//     'settings.clear.button': 'Tout effacer',
//     'settings.clear.confirm': 'Êtes-vous sûr de vouloir effacer toutes vos données ?',

//     // Pomodoro
//     'pomodoro.title': 'Pomodoro Zen',
//     'pomodoro.subtitle': 'Travaillez par cycles de 25 minutes',
//     'pomodoro.start': 'Commencer',
//     'pomodoro.pause': 'Pause',
//     'pomodoro.reset': 'Reset',
//     'pomodoro.work': 'Travail',
//     'pomodoro.break': 'Pause',
//     'pomodoro.completed': 'Session terminée !',
//   },
//   en: {
//     // Landing
//     'landing.title': 'MoodSpace',
//     'landing.subtitle': 'Your zen space to create, feel and organize',
//     'landing.cta': 'Enter MoodSpace',
//     'landing.features.mood.title': 'Mood Tracking',
//     'landing.features.mood.desc': 'Track your emotions with gentleness and mindfulness',
//     'landing.features.moodboard.title': 'Creative Moodboard',
//     'landing.features.moodboard.desc': 'Organize your visual inspirations with simplicity',
//     'landing.features.zen.title': 'Zen & Minimal',
//     'landing.features.zen.desc': 'A soothing interface to boost your creativity',
//     'landing.footer': 'No registration required • Works offline • 100% private',

//     // Navigation
//     'nav.home': 'Home',
//     'nav.moodboard': 'Moodboard',
//     'nav.cards': 'Cards',
//     'nav.themes': 'Themes',
//     'nav.tasks': 'Tasks',
//     'nav.settings': 'Settings',

//     // Dashboard
//     'dashboard.greeting': 'Hello! ✨',
//     'dashboard.today': 'How are you feeling today?',
//     'dashboard.message.placeholder': 'Describe your mindset, your current thoughts...',
//     'dashboard.weather.title': 'Inner Weather',
//     'dashboard.weather.sunny': 'Sunny',
//     'dashboard.weather.cloudy': 'Cloudy',
//     'dashboard.weather.rainy': 'Rainy',
//     'dashboard.emotion.title': 'Emotional State',
//     'dashboard.emotion.happy': 'Happy',
//     'dashboard.emotion.neutral': 'Neutral',
//     'dashboard.emotion.sad': 'Sad',
//     'dashboard.music.title': 'Current Music',
//     'dashboard.music.placeholder': 'What are you listening to? What musical vibe fits you...',
//     'dashboard.summary.title': 'Your mood today ✨',

//     // Tasks
//     'tasks.title': 'My 3 Tasks Today',
//     'tasks.subtitle': 'Focus on the essentials, one task at a time',
//     'tasks.add.placeholder': 'Add a new task...',
//     'tasks.remaining': 'task remaining | tasks remaining',
//     'tasks.empty.title': 'No tasks for today',
//     'tasks.empty.desc': 'Start by adding your first task of the day',
//     'tasks.completed.title': 'Congrats! All your tasks are completed!',
//     'tasks.completed.desc': 'Take a moment to celebrate this achievement ✨',
//     'tasks.progress': 'Daily Progress',

//     // Moodboard
//     'moodboard.title': 'My Moodboard',
//     'moodboard.subtitle': 'Collect your visual inspirations',
//     'moodboard.upload.title': 'Add Images',
//     'moodboard.upload.desc': 'Drag and drop your images or click to browse',
//     'moodboard.upload.browse': 'Browse Files',
//     'moodboard.caption.placeholder': 'Add a caption...',
//     'moodboard.empty.title': 'Your moodboard is empty',
//     'moodboard.empty.desc': 'Start by adding your first inspirations',

//     // Settings
//     'settings.title': 'Settings',
//     'settings.theme.title': 'Appearance',
//     'settings.theme.light': 'Light',
//     'settings.theme.dark': 'Dark',
//     'settings.language.title': 'Language',
//     'settings.language.french': 'Français',
//     'settings.language.english': 'English',
//     'settings.export.title': 'Export my data',
//     'settings.export.desc': 'Download all your data in JSON format',
//     'settings.export.button': 'Export as JSON',
//     'settings.clear.title': 'Clear data',
//     'settings.clear.desc': 'Delete all locally stored data',
//     'settings.clear.button': 'Clear all',
//     'settings.clear.confirm': 'Are you sure you want to clear all your data?',

//     // Pomodoro
//     'pomodoro.title': 'Zen Pomodoro',
//     'pomodoro.subtitle': 'Work in 25-minute cycles',
//     'pomodoro.start': 'Start',
//     'pomodoro.pause': 'Pause',
//     'pomodoro.reset': 'Reset',
//     'pomodoro.work': 'Work',
//     'pomodoro.break': 'Break',
//     'pomodoro.completed': 'Session completed!',
//   },
// };