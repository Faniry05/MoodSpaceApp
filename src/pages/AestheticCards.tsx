import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageProvider";
import { 
  Download, 
  ImageIcon, 
  Type, 
  Palette, 
  Sparkles,
  Heart,
  Star,
  Circle,
  Square,
  Triangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Storage } from "@/lib/storage";

type CardData = {
  title: string;
  subtitle: string;
  message: string;
  backgroundColor: string;
  textColor: string;
  shape: string;
}

type HistoricalCardData = CardData & { id: string };

export default function AestheticCards() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [cardData, setCardData] = useState<CardData>({
    title: t('cards.mockup.title'),
    subtitle: t('cards.mockup.subtitle'),
    message: t('cards.mockup.message'),
    backgroundColor: "from-pink-200 to-purple-300",
    textColor: "text-gray-800",
    shape: "heart"
  });

  const [cardHistory, setCardHistory] = useState<HistoricalCardData[]>([]);

  useEffect(() => {
    const fetchActiveCard = async () => {
      try {
        const historyCard = await Storage.getRecentAestheticCards(2);
        setCardHistory(historyCard);
        const data = await Storage.getValue("cardAesthetic");
        if (data) {
          const typedData = data as CardData;
          setCardData(typedData);
        }
      } catch (error) {
        console.error("Failed to load active card:", error);
      }
    };
    
    fetchActiveCard();
  }, []);

  const gradients = [
    { name: "Sunset", value: "from-orange-200 via-pink-200 to-purple-300" },
    { name: "Ocean", value: "from-blue-200 via-cyan-200 to-teal-300" },
    { name: "Forest", value: "from-green-200 via-emerald-200 to-lime-300" },
    { name: "Lavender", value: "from-purple-200 via-pink-200 to-indigo-300" },
    { name: "Peach", value: "from-orange-100 via-pink-100 to-yellow-200" },
    { name: "Mint", value: "from-cyan-100 via-green-100 to-emerald-200" },
    { name: "Rose", value: "from-pink-100 via-rose-200 to-red-200" },
    { name: "Sky", value: "from-blue-100 via-sky-200 to-indigo-200" }
  ];

  const shapes = [
    { name: "Cœur", icon: Heart, value: "heart" },
    { name: "Étoile", icon: Star, value: "star" },
    { name: "Cercle", icon: Circle, value: "circle" },
    { name: "Carré", icon: Square, value: "square" },
    { name: "Triangle", icon: Triangle, value: "triangle" }
  ];

  const textColors = [
    { name: "Sombre", value: "text-gray-800" },
    { name: "Blanc", value: "text-white" },
    { name: "Rose", value: "text-pink-600" },
    { name: "Violet", value: "text-purple-600" },
    { name: "Bleu", value: "text-blue-600" }
  ];

  const exportAsPNG = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `aesthetic-card-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      if(cardData){
        await Storage.create("aesthetic_cards", cardData);
        await Storage.cleanupOldAestheticCards();
        const updatedHistory = await Storage.getRecentAestheticCards(2);
        setCardHistory(updatedHistory);
      }

      toast({
        title: t('cards.toast.success.title'),
        description: t('cards.toast.success.description1'),
      });
    } catch (error) {
      toast({
        title: t('cards.toast.error.title'),
        description: t('cards.toast.error.description'),
        variant: "destructive",
      });
    }
  };

  const exportAsPDF = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Center the image on the page
      const imgWidth = 150;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (210 - imgWidth) / 2; // A4 width is 210mm
      const y = (297 - imgHeight) / 2; // A4 height is 297mm
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`aesthetic-card-${Date.now()}.pdf`);

      if(cardData){
        await Storage.create("aesthetic_cards", cardData);
        await Storage.cleanupOldAestheticCards();
        const updatedHistory = await Storage.getRecentAestheticCards(2);
        setCardHistory(updatedHistory);
      }

      toast({
        title: t('cards.toast.success.title'),
        description: t('cards.toast.success.description2'),
      });
    } catch (error) {
      toast({
        title: t('cards.toast.error.title'),
        description: t('cards.toast.error.description'),
        variant: "destructive",
      });
    }
  };

  const handleCardChange = (key: string, value: any) => {
    if (key === "title" || key === "subtitle" || key === "message") {
      value = value.target.value;
    }
    const updatedCardData = { ...cardData, [key]: value };
    setCardData(updatedCardData);

    Storage.setValue("cardAesthetic", updatedCardData);
  };

  // Fonction pour charger une carte de l'historique
  const loadFromHistory = (card: HistoricalCardData) => {
    const { id, ...rest } = card;
    setCardData(rest);
  };

  const renderShape = () => {
    const ShapeIcon = shapes.find(s => s.value === cardData.shape)?.icon || Heart;
    return <ShapeIcon className={`w-8 h-8 opacity-20 ${cardData.textColor} absolute top-4 right-4`} />;
  };

  const renderMiniCard = (data: HistoricalCardData, index: number) => {
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.5,
          delay: index * 0.2,
        }}
        key={data.id}
        onClick={() => loadFromHistory(data)}
        className="p-1 group rounded-2xl cursor-pointer transition-all duration-200 hover:ring-2 ring-primary/50"
      >
        <div
          className={`w-40 md:w-52 p-6 h-48 md:h-60 group-active:opacity-60 bg-gradient-to-br ${data.backgroundColor} rounded-xl shadow-md relative overflow-hidden`}
        >
          <div className="flex flex-col h-full justify-center items-center text-center space-y-4">
            <div className="space-y-1">
              <h4 className={`text-[12px] md:text-[15px] font-bold ${data.textColor} break-words`}>
                {data.title || "Titre"}
              </h4>
              <p className={`text-[8px] md:text-xs opacity-70 ${data.textColor}`}>
                {data.subtitle || "Sous-titre"}
              </p>
            </div>
            <div className={`text-center ${data.textColor} opacity-90`}>
              <p className="text-[8px] md:text-xs leading-relaxed italic">
                "{data.message.substring(0, 40)}..."
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-light text-foreground mb-2 font-dm-sans flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            {t('cards.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('cards.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Éditeur */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
              <h2 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                {t('cards.content')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t('cards.content.title')}
                  </label>
                  <Input
                    value={cardData.title}
                    onChange={(e) => handleCardChange("title", e)}
                    placeholder="Mon mood du jour"
                    className="rounded-2xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t('cards.content.subtitle')}
                  </label>
                  <Input
                    value={cardData.subtitle}
                    onChange={(e) => handleCardChange("subtitle", e)}
                    placeholder="Créé avec MoodSpace"
                    className="rounded-2xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t('cards.content.message')}
                  </label>
                  <Textarea
                    value={cardData.message}
                    onChange={(e) => handleCardChange("message", e)}
                    placeholder="Votre message inspirant..."
                    className="rounded-2xl min-h-20"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
              <h2 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                {t('cards.content.style')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    {t('cards.content.background')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {gradients.map((gradient) => {
                      const isActive = cardData.backgroundColor === gradient.value;
                      return (
                      <Button
                        key={gradient.name}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => handleCardChange("backgroundColor", gradient.value)}
                        className={`h-12 bg-transparent ${isActive ? "hover:bg-transparent" : ""} rounded-2xl relative overflow-hidden`}
                      >
                        <div className={`absolute inset-0 ${isActive ? "bg-gray-700 dark:bg-transparent" : `bg-gradient-to-r ${gradient.value} opacity-50`}`} />
                        <span
                          className={`relative z-10 ${
                            isActive ? `bg-gradient-to-r ${gradient.value} bg-clip-text text-transparent text-lg font-bold` : "text-xs"
                          }`}
                        >
                          {gradient.name}
                        </span>
                      </Button>
                    )})}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    {t('cards.content.textColor')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {textColors.map((color) => (
                      <Button
                        key={color.name}
                        variant={cardData.textColor === color.value ? "default" : "outline"}
                        onClick={() => handleCardChange("textColor", color.value)}
                        className="rounded-2xl"
                      >
                        <span className="text-xs">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    {t('cards.content.shape')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {shapes.map((shape) => {
                      const Icon = shape.icon;
                      return (
                        <Button
                          key={shape.value}
                          variant={cardData.shape === shape.value ? "default" : "outline"}
                          onClick={() => handleCardChange("shape", shape.value)}
                          className="rounded-2xl flex items-center gap-2"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs">{shape.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
              <h2 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                {t('cards.export')}
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={exportAsPNG} className="rounded-2xl">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button onClick={exportAsPDF} variant="outline" className="rounded-2xl">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Aperçu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:sticky lg:top-6"
          >
            <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
              <h2 className="text-xl font-medium text-foreground mb-4">
                {t('cards.preview')}
              </h2>
              
              <div className="flex justify-center">
                <div
                  ref={cardRef}
                  className={`w-80 h-96 bg-gradient-to-br ${cardData.backgroundColor} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {renderShape()}
                  
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
                    <div className="space-y-2">
                      <h1 className={`text-2xl font-bold ${cardData.textColor}`}>
                        {cardData.title || "Mon Mood du Jour"}
                      </h1>
                      <p className={`text-sm opacity-80 ${cardData.textColor}`}>
                        {cardData.subtitle || "Créé avec MoodSpace"}
                      </p>
                    </div>
                    
                    <div className={`text-center ${cardData.textColor} opacity-90`}>
                      <p className="text-sm leading-relaxed italic">
                        "{cardData.message || "La beauté commence au moment où vous décidez d'être vous-même."}"
                      </p>
                    </div>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                      <div className={`w-16 h-1 ${cardData.textColor === 'text-white' ? 'bg-white' : 'bg-gray-800'} opacity-30 rounded-full`} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex flex-col w-full items-center mt-8 space-y-4">
              {cardHistory.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {t('cards.exported.last')}
                  </h3>
                  <div className="flex space-x-2">
                    {cardHistory.map((card, index) => renderMiniCard(card, index))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

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