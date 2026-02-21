import { motion } from "framer-motion";
import { Sparkles, Wand2, Globe } from "lucide-react";

const languages = [
  { id: "pt", label: "Português", flag: "🇧🇷" },
  { id: "en", label: "English", flag: "🇺🇸" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "it", label: "Italiano", flag: "🇮🇹" },
  { id: "ja", label: "日本語", flag: "🇯🇵" },
  { id: "ko", label: "한국어", flag: "🇰🇷" },
  { id: "zh", label: "中文", flag: "🇨🇳" },
  { id: "ar", label: "العربية", flag: "🇸🇦" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "ru", label: "Русский", flag: "🇷🇺" },
];

interface StepDescriptionProps {
  description: string;
  onChange: (val: string) => void;
  onGenerateScript: () => void;
  isGeneratingScript: boolean;
  language: string;
  onLanguageChange: (lang: string) => void;
  theme: string;
}

const MAX_CHARS = 500;

const StepDescription = ({
  description,
  onChange,
  onGenerateScript,
  isGeneratingScript,
  language,
  onLanguageChange,
  theme,
}: StepDescriptionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Roteiro do Vídeo</h2>
        <p className="text-muted-foreground">Gere o roteiro com IA ou escreva manualmente</p>
      </div>

      {/* Language Selector */}
      <div className="glass-panel p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Globe className="w-4 h-4 text-primary" />
          Idioma do Vídeo
        </div>
        <div className="flex gap-2 flex-wrap">
          {languages.map((lang) => (
            <motion.button
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1.5 ${
                language === lang.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              <span>{lang.flag}</span>
              {lang.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Script Button */}
      <motion.button
        onClick={onGenerateScript}
        disabled={isGeneratingScript}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl border border-primary/50 bg-primary/10 text-foreground font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/20 transition-all"
      >
        <Wand2 className="w-4 h-4 text-primary" />
        {isGeneratingScript ? "Gerando roteiro com IA..." : "✨ Gerar Roteiro com IA"}
      </motion.button>

      {/* Textarea */}
      <div className="glass-panel p-1">
        <textarea
          value={description}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Descreva o que você quer falar no vídeo ou gere com IA..."
          rows={8}
          className="w-full bg-transparent p-4 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className={`text-xs ${description.length >= MAX_CHARS ? "text-accent" : "text-muted-foreground"}`}>
            {description.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      <motion.button
        onClick={() => {}} // Will be handled by parent advancing to step 4
        disabled={!description.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed neon-glow transition-all hover:brightness-110"
      >
        <Sparkles className="w-5 h-5" />
        Gerar Narração
      </motion.button>
    </motion.div>
  );
};

export default StepDescription;
