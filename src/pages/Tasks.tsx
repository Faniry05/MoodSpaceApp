import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Storage } from "@/lib/storage";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function Tasks() {
  const { t, language } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Load tasks from Storage
  useEffect(() => {
    const loadTasks = async () => {
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = await Storage.getTasksByDate(today);
      setTasks(todayTasks.map(task => ({
        id: task.id,
        text: task.text,
        completed: task.completed,
        createdAt: task.created_at,
      })));
    };
    
    loadTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim() && tasks.length < 5) { 
      const today = new Date().toISOString().split('T')[0];
      const task: Task = {
        id: crypto.randomUUID(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      
      await Storage.create('tasks', {
        date: today,
        text: task.text,
        completed: task.completed,
        order: tasks.length,
      });
      
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (taskToUpdate) {
      await Storage.update('tasks', id, {
        completed: !taskToUpdate.completed,
      });
      
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const deleteTask = async (id: string) => {
    await Storage.delete('tasks', id);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
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
          className="text-center"
        >
          <h1 className="text-3xl font-light text-foreground mb-2 font-dm-sans">
            {t('tasks.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('tasks.subtitle')}
          </p>
        </motion.div>

        {/* Add New Task */}
        {tasks.length < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
              <div className="flex gap-3">
                <Input
                  placeholder={t('tasks.add.placeholder')}
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-background/50 border-border/50 focus:border-primary/50"
                />
                <Button
                  onClick={addTask}
                  disabled={!newTask.trim()}
                  className="px-6 rounded-2xl"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {5 - tasks.length} {t('tasks.label')}{5 - tasks.length > 1 ? 's' : ''} {t('tasks.left')}{5 - tasks.length > 1 && language == 'fr' ? 's' : ''}
              </p>
            </Card>
          </motion.div>
        )}

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    {/* Task Number */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    
                    {/* Task Content */}
                    <div className="flex-1">
                      <p className={`text-foreground transition-all duration-300 ${
                        task.completed 
                          ? "line-through text-muted-foreground" 
                          : ""
                      }`}>
                        {task.text}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTask(task.id)}
                        className={`w-8 h-8 rounded-full transition-all duration-300 ${
                          task.completed 
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                            : "hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <motion.div
                          initial={false}
                          animate={{ scale: task.completed ? 1.2 : 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('tasks.empty.title')}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t('tasks.empty.desc')}
            </p>
          </motion.div>
        )}

        {/* Completion Celebration */}
        {tasks.length > 0 && tasks.every(task => task.completed) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              {t('tasks.completed.title')}
            </h3>
            <p className="text-muted-foreground">
              {t('tasks.completed.desc')} ✨
            </p>
          </motion.div>
        )}

        {/* Progress */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {t('tasks.progress')}
                </span>
                <span className="text-primary font-medium">
                  {tasks.filter(t => t.completed).length} / {tasks.length}
                </span>
              </div>
              <div className="mt-2 w-full bg-secondary rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` 
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </Card>
          </motion.div>
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