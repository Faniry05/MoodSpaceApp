import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '@/lib/storage';

type AnimationType = 'none' | 'bubbles' | 'snow' | 'particles' | 'fireflies';

interface AnimationContextType {
  animationType: AnimationType;
  setAnimationType: (type: AnimationType) => void;
  isAnimationEnabled: boolean;
  setIsAnimationEnabled: (enabled: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [animationType, setAnimationType] = useState<AnimationType>('bubbles');
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  // Charger les préférences depuis Storage (IndexedDB)
  useEffect(() => {
    async function loadPreferences() {
      try {
        const savedType = await Storage.getValue<AnimationType>('animationType');
        const savedEnabled = await Storage.getValue<string>('animationEnabled');

        if (savedType) setAnimationType(savedType);
        if (savedEnabled !== undefined) setIsAnimationEnabled(savedEnabled === 'true');
      } catch (error) {
        console.error('Erreur chargement animation preferences:', error);
      }
    }
    loadPreferences();
  }, []);

  // Sauvegarder les préférences dans Storage (IndexedDB)
  useEffect(() => {
    Storage.setValue('animationType', animationType).catch(console.error);
    Storage.setValue('animationEnabled', isAnimationEnabled.toString()).catch(console.error);
    
    Storage.updateUserSettings({
      animation_type: animationType,
      animation_enabled: isAnimationEnabled,
    }).catch(console.error);
  }, [animationType, isAnimationEnabled]);

  return (
    <AnimationContext.Provider value={{
      animationType,
      setAnimationType,
      isAnimationEnabled,
      setIsAnimationEnabled,
    }}>
      {children}
    </AnimationContext.Provider>
  );
}
