import { get, set, del, keys, clear } from 'idb-keyval';

// Database structure ready for MongoDB Atlas synchronization
export interface DatabaseTables {
  // User data
  user_settings: {
    id: string;
    theme: string;
    language: string;
    animation_type: string;
    animation_enabled: boolean;
    custom_theme?: any;
    created_at: string;
    updated_at: string;
  };

  // Mood data with direct evaluation
  moods: {
    id: string;
    date: string;
    weather: string;
    emotion: string;
    direct_rating: number;
    notes?: string;
    music?: string;
    created_at: string;
    updated_at: string;
  };

  // Tasks (daily, limit 5)
  tasks: {
    id: string;
    date: string;
    text: string;
    completed: boolean;
    order: number;
    created_at: string;
    updated_at: string;
  };

  // Moodboard items
  moodboard_items: {
    id: string;
    src: string;
    caption: string;
    created_at: string;
    updated_at: string;
  };

  // Aesthetic cards (keep only 2 most recent)
  aesthetic_cards: {
    id: string;
    title: string;
    subtitle: string;
    message: string;
    backgroundColor: string;
    textColor: string;
    shape: string;
    created_at: string;
    updated_at: string;
  };

  // Pomodoro sessions
  pomodoro_sessions: {
    id: string;
    date: string;
    completed_sessions: number;
    total_focus_time: number;
    created_at: string;
    updated_at: string;
  };

  // User comments and feedback
  user_feedback: {
    id: string;
    type: 'comment' | 'suggestion' | 'bug_report';
    content: string;
    rating?: number;
    created_at: string;
  };

  // App metadata
  app_metadata: {
    id: string;
    last_visit: string;
    visit_count: number;
    last_notification_check: string;
    productivity_reminders: any;
    created_at: string;
    updated_at: string;
  };

  // Conversations with AI assistant
  conversations: {
    id: string;
    date: string;   // format YYYY-MM-DD
    message: string;
    role: 'user' | 'assistant';
    created_at: string;
    updated_at: string;
  };
}

export type TableName = keyof DatabaseTables;
export type TableData<T extends TableName> = DatabaseTables[T];

// Storage utilities
export class Storage {
  static async getValue<T>(key: string): Promise<T | null> {
    try {
      const value = await get<T>(key);
      return value ?? null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de "${key}":`, error);
      return null;
    }
  }

  static async setValue<T>(key: string, value: T): Promise<void> {
    try {
      await set(key, value);
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de "${key}":`, error);
    }
  }

  // Generic CRUD operations
  static async create<T extends TableName>(
    table: T, 
    data: Omit<TableData<T>, 'id' | 'created_at' | 'updated_at'> & { id?: string }
  ): Promise<TableData<T>> {
    const now = new Date().toISOString();
    const record = {
      id: data.id || crypto.randomUUID(),
      ...data,
      created_at: now,
      updated_at: now,
    } as TableData<T>;

    const existingData = await this.getAll(table) || [];
    existingData.push(record);

    if (existingData.length > 7) {
      existingData.shift();
    }

    await set(table, existingData);
    return record;
  }

  static async getAll<T extends TableName>(table: T): Promise<TableData<T>[]> {
    try {
      return (await get(table)) || [];
    } catch {
      return [];
    }
  }

  static async getById<T extends TableName>(table: T, id: string): Promise<TableData<T> | null> {
    const data = await this.getAll(table);
    return data.find((item: any) => item.id === id) || null;
  }

  static async update<T extends TableName>(
    table: T, 
    id: string, 
    updates: Partial<Omit<TableData<T>, 'id' | 'created_at'>>
  ): Promise<TableData<T> | null> {
    const data = await this.getAll(table);
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index === -1) return null;

    const updated = {
      ...data[index],
      ...updates,
      updated_at: new Date().toISOString(),
    } as TableData<T>;

    data[index] = updated;
    await set(table, data);
    return updated;
  }

  static async delete<T extends TableName>(table: T, id: string): Promise<boolean> {
    const data = await this.getAll(table);
    const filtered = data.filter((item: any) => item.id !== id);
    
    if (filtered.length === data.length) return false;
    
    await set(table, filtered);
    return true;
  }

  // Specialized methods for specific use cases
  static async getMoodByDate(date: string): Promise<TableData<'moods'> | null> {
    const moods = await this.getAll('moods');
    return moods.find(mood => mood.date === date) || null;
  }

  static async getTasksByDate(date: string): Promise<TableData<'tasks'>[]> {
    const tasks = await this.getAll('tasks');
    return tasks.filter(task => task.date === date).sort((a, b) => a.order - b.order);
  }

  static async getRecentMoodHistory(days: number = 7): Promise<TableData<'moods'>[]> {
    const moods = await this.getAll('moods');
    const now = new Date();
    const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return moods
      .filter(mood => new Date(mood.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getRecentAestheticCards(limit: number = 2): Promise<TableData<'aesthetic_cards'>[]> {
    const cards = await this.getAll('aesthetic_cards');
    return cards
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  static async getPomodoroSessionForToday(): Promise<TableData<'pomodoro_sessions'> | null> {
    const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD
    const sessions = await this.getAll('pomodoro_sessions');
    return sessions.find(session => session.date === today) || null;
  }

  static async savePomodoroSessionForToday(
    completedSessions: number, 
    totalFocusTime: number = 0
  ) {
    const today = new Date().toISOString().split('T')[0];
    const existingSession = await this.getPomodoroSessionForToday();

    if (existingSession) {
      return await this.update('pomodoro_sessions', existingSession.id, {
        completed_sessions: completedSessions,
        total_focus_time: totalFocusTime,
      });
    } else {
      return await this.create('pomodoro_sessions', {
        id: today,
        date: today,
        completed_sessions: completedSessions,
        total_focus_time: totalFocusTime,
      });
    }
  }

  static getMoodDataForLast7Days = async (): Promise<any> => {
    // 1. Récupérer toutes les humeurs depuis le stockage
    const allMoods = await Storage.getAll('moods');

    // 2. Créer une Map pour un accès rapide aux notes par date
    const moodsByDate = new Map<string, number>();
    allMoods.forEach(mood => {
      moodsByDate.set(mood.date, mood.direct_rating || 0);
    });

    // 3. Générer les dates et noms de jours pour la semaine écoulée
    const moodData: any[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const formattedDate = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      
      const moodNote = moodsByDate.get(formattedDate);

      moodData.push({
        day: dayName,
        mood: moodNote !== undefined ? moodNote : 0,
      });
    }
    
    return moodData;
  };

  // Cleanup methods to maintain data limits
  static async cleanupOldMoods(): Promise<void> {
    const moods = await this.getAll('moods');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentMoods = moods.filter(mood => new Date(mood.date) >= sevenDaysAgo);
    await set('moods', recentMoods);
  }

  static async cleanupOldAestheticCards(): Promise<void> {
    const cards = await this.getAll('aesthetic_cards');
    const recentCards = cards
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);
    await set('aesthetic_cards', recentCards);
  }

  // User settings helpers
  static async getUserSettings(): Promise<TableData<'user_settings'> | null> {
    const settings = await this.getAll('user_settings');
    return settings[0] || null;
  }

  static async updateUserSettings(updates: Partial<Omit<TableData<'user_settings'>, 'id' | 'created_at'>>): Promise<TableData<'user_settings'>> {
    const existing = await this.getUserSettings();
    
    if (existing) {
      return await this.update('user_settings', existing.id, updates) as TableData<'user_settings'>;
    } else {
      return await this.create('user_settings', {
        theme: 'system',
        language: 'fr',
        animation_type: 'bubbles',
        animation_enabled: true,
        ...updates,
      });
    }
  }

  // Sauvegarde une conversation et supprime celles des jours précédents
  static async saveConversation(message: string, role: 'user' | 'assistant') {
    const today = new Date().toISOString().split("T")[0];
    const conversations = await this.getAll("conversations");

    // Supprimer les anciennes (≠ aujourd'hui)
    const filtered = conversations.filter(c => c.date === today);

    const now = new Date().toISOString();
    const record = {
      id: crypto.randomUUID(),
      date: today,
      message,
      role,
      created_at: now,
      updated_at: now,
    };

    filtered.push(record);
    await set("conversations", filtered);
    return record;
  }

  // Récupérer seulement les conversations du jour
  static async getTodayConversations() {
    const today = new Date().toISOString().split("T")[0];
    const conversations = await this.getAll("conversations");
    return conversations.filter(c => c.date === today);
  }

  // Nettoyage manuel (au cas où)
  static async cleanupOldConversations() {
    const today = new Date().toISOString().split("T")[0];
    const conversations = await this.getAll("conversations");
    const filtered = conversations.filter(c => c.date === today);
    await set("conversations", filtered);
  }


  // Clear all data
  static async clearAll(): Promise<void> {
    await clear();
  }

  // Clear specific table
  static async clear<T extends TableName>(table: T): Promise<void> {
  await set(table, []); // Écrase tout avec un tableau vide
}
}
