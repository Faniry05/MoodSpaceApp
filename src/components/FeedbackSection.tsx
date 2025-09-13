import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { MessageSquare, Star, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import { Storage } from "@/lib/storage";

interface FeedbackData {
  type: 'comment' | 'suggestion' | 'bug_report';
  content: string;
  rating?: number;
}

export default function FeedbackSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FeedbackData>({
    type: 'comment',
    content: '',
    rating: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    { value: 'comment', label: 'Commentaire général', icon: MessageSquare },
    { value: 'suggestion', label: 'Suggestion d\'amélioration', icon: Star },
    { value: 'bug_report', label: 'Signaler un problème', icon: Send },
  ];

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre commentaire",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await Storage.create('user_feedback', {
        type: formData.type,
        content: formData.content.trim(),
        rating: formData.rating,
      });

      setIsSubmitted(true);
      setFormData({ type: 'comment', content: '', rating: undefined });
      
      toast({
        title: "Merci !",
        description: "Votre commentaire a été enregistré avec succès",
      });
      
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre commentaire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MessageSquare className="h-5 w-5 text-primary" />
            Votre avis nous intéresse
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Partagez vos commentaires, suggestions ou signalez des problèmes pour nous aider à améliorer MoodSpace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Merci pour votre retour !
              </h3>
              <p className="text-muted-foreground">
                Votre commentaire nous aide à améliorer l'expérience MoodSpace
              </p>
            </motion.div>
          ) : (
            <>
              {/* Type de feedback */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Type de commentaire
                </Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  {feedbackTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.value} id={type.value} />
                      <Label
                        htmlFor={type.value}
                        className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                      >
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Rating (pour commentaires et suggestions) */}
              {(formData.type === 'comment' || formData.type === 'suggestion') && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Note globale (optionnelle)
                  </Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          rating: prev.rating === star ? undefined : star 
                        }))}
                        className="transition-colors"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            formData.rating && star <= formData.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contenu */}
              <div className="space-y-3">
                <Label htmlFor="feedback-content" className="text-sm font-medium text-foreground">
                  Votre commentaire
                </Label>
                <Textarea
                  id="feedback-content"
                  placeholder={
                    formData.type === 'comment'
                      ? "Partagez votre expérience avec MoodSpace..."
                      : formData.type === 'suggestion'
                      ? "Décrivez votre suggestion d'amélioration..."
                      : "Décrivez le problème rencontré..."
                  }
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Bouton d'envoi */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.content.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Send className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le commentaire'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}