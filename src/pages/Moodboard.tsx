import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Upload, X, Edit3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Storage } from "@/lib/storage";
import axios from "axios";
import useOnlineStatus from "@/hooks/useOnlineStatus";

interface MoodboardItem {
  id: string;
  src: string;
  caption: string;
  createdAt: string;
}

export default function Moodboard() {
  const { t } = useLanguage();
  const [items, setItems] = useState<MoodboardItem[]>([]);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [tempCaption, setTempCaption] = useState("");

  // For Unsplash access
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  const isOnline = useOnlineStatus();

  // Load items from Storage
  useEffect(() => {
    const loadItems = async () => {
      const savedItems = await Storage.getAll('moodboard_items');
      setItems(savedItems.map(item => ({
        id: item.id,
        src: item.src,
        caption: item.caption,
        createdAt: item.created_at,
      })));
    };
    
    loadItems();
  }, []);

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const reader = new FileReader();
      reader.onload = async () => {
        const newItem = await Storage.create('moodboard_items', {
          src: reader.result as string,
          caption: "",
        });
        
        setItems(prev => [...prev, {
          id: newItem.id,
          src: newItem.src,
          caption: newItem.caption,
          createdAt: newItem.created_at,
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  const addPlaceholderImage = async () => {
  try {
    const response = await axios.get("/api/unsplash");
    const photoUrl = response.data.photo;

    const newItem = await Storage.create('moodboard_items', {
      src: photoUrl,
      caption: "",
    });

    setItems(prev => [...prev, {
      id: newItem.id,
      src: newItem.src,
      caption: newItem.caption,
      createdAt: newItem.created_at,
    }]);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image Unsplash:", error);
  }
};

  const deleteItem = async (id: string) => {
    await Storage.delete('moodboard_items', id);
    setItems(items.filter(item => item.id !== id));
  };

  const updateCaption = async (id: string, caption: string) => {
    await Storage.update('moodboard_items', id, { caption });
    setItems(items.map(item => 
      item.id === id ? { ...item, caption } : item
    ));
    setEditingCaption(null);
  };

  const startEditingCaption = (id: string, currentCaption: string) => {
    setEditingCaption(id);
    setTempCaption(currentCaption);
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-light text-foreground mb-2 font-dm-sans">
            {t('moodboard.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('moodboard.subtitle')}
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 bg-card/60 backdrop-blur-sm border-border/50">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-primary/2"
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {t('moodboard.upload.title')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t('moodboard.upload.desc')}
                  </p>
                  <Button className="rounded-2xl">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {t('moodboard.upload.browse')}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Demo Button */}
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={addPlaceholderImage}
                className="rounded-2xl"
                disabled={!isOnline}
              >
                + Add Demo Image {isOnline ? "" : `(${t('moodboard.offline.warning')})`}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Moodboard Grid */}
        {items.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                  className="w-full"
                >
                  <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 group">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.src}
                        alt={item.caption || "Moodboard item"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteItem(item.id)}
                          className="w-8 h-8 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="p-4">
                      <span className="font-semibold">Inspiration:</span>
                      {editingCaption === item.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={tempCaption}
                            onChange={(e) => setTempCaption(e.target.value)}
                            placeholder={t('moodboard.caption.placeholder')}
                            className="bg-background/50 border-border/50 mt-2"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                updateCaption(item.id, tempCaption);
                              }
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateCaption(item.id, tempCaption)}
                              className="flex-1"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCaption(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="min-h-[2rem] flex items-center justify-between group cursor-pointer"
                          onClick={() => startEditingCaption(item.id, item.caption)}
                        >
                          <div className="text-sm w-full break-words text-muted-foreground flex-1 pr-2">
                            {item.caption || t('moodboard.caption.placeholder')}
                          </div>
                          <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              {t('moodboard.empty.title')}
            </h3>
            <p className="text-muted-foreground">
              {t('moodboard.empty.desc')}
            </p>
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