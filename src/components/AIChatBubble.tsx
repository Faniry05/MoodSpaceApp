// AIChatBubble.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Storage } from "@/lib/storage";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Charger les conversations du jour
  useEffect(() => {
    const loadTodayMessages = async () => {
      const todayConvos = await Storage.getTodayConversations();
      if (todayConvos.length > 0) {
        setMessages(
          todayConvos.map((c) => ({
            id: c.id,
            text: c.message,
            isUser: c.role === "user",
            timestamp: new Date(c.created_at),
          }))
        );
      } else {
        // Message d'accueil si aucune conversation aujourd'hui
        const welcome: Message = {
          id: crypto.randomUUID(),
          text: "Salut ! Je suis votre assistant IA pour MoodSpace. Comment puis-je vous aider aujourd'hui ? 😊",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcome]);
        await Storage.saveConversation(welcome.text, "assistant");
      }
    };

    loadTodayMessages();
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  // Récupère le mood du jour
  const getTodaysMood = async () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    return await Storage.getMoodByDate(today);
  };

  // Crée le prompt pour l'IA selon le mood et le message utilisateur
  const buildPrompt = async (userInput: string) => {
    const mood = await getTodaysMood();
    let prompt = userInput;

    if (mood) {
      prompt = `L'utilisateur se sent ${mood.emotion} avec une méteo intérieure: ${mood.weather}. Sa musique du moment: ${mood.music || "il n'en a pas"}. Répond de manière adaptée : ${userInput}`;
    }

    return prompt;
  };

  // Appel à Hugging Face Router (DeepSeek-R1:novita par ex.)
  const getAIResponse = async (prompt: string) => {
    try {
      const res = await axios.post('/api/hfchat', { prompt });
      return res.data.text ?? '⚠️ Vérifiez votre connexion internet ou réessayez plus tard.';
    } catch (err: any) {
      console.error('Erreur API client:', err?.response?.data || err.message);
      return '⚠️ Une erreur est survenue avec l’IA.';
    }
  };

  // Gestion de l'envoi du message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const now = new Date();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      isUser: true,
      timestamp: now
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    await Storage.saveConversation(userMessage.text, "user");

    try {
      const prompt = await buildPrompt(inputValue);
      const aiText = await getAIResponse(prompt);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: aiText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      await Storage.saveConversation(aiMessage.text, "assistant");
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "Désolé, je n'ai pas pu répondre 😢",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      await Storage.saveConversation(errorMessage.text, "assistant");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <motion.div
        className="fixed bottom-32 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-shadow"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-end p-4 pr-8 pb-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto"
              initial={{ scale: 0.8, opacity: 0, x: 100, y: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, x: 100, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Card className="w-80 backdrop-blur-3xl h-96 shadow-2xl flex flex-col rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Assistant IA</h3>
                      <p className="text-xs text-muted-foreground">En ligne</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            message.isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent/50 text-foreground"
                          }`}
                        >
                          {message.text}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-accent/50 p-3 rounded-lg text-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border/50 bg-card/80">
                  <div className="flex gap-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="flex-1 bg-background/70 border-border/50 rounded-md p-2 resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
