import { useState, useEffect } from 'react';

/**
 * Un hook personnalisé pour déterminer l'état de la connexion Internet.
 * @returns {boolean} L'état de la connexion (true si en ligne, false sinon).
 */
const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fonction de nettoyage pour retirer les écouteurs d'événements
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Le tableau de dépendances vide garantit que le hook s'exécute une seule fois

  return isOnline;
};

export default useOnlineStatus;