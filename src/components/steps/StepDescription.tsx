import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface StepDescriptionProps {
  description: string;
  onChange: (val: string) => void;
  onGenerateVoice: () => void;
}

const MAX_CHARS = 500;

const StepDescription = ({ description, onChange, onGenerateVoice }: StepDescriptionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Descrição do Conteúdo</h2>
        <p className="text-muted-foreground">Escreva o roteiro ou descrição do seu vídeo</p>
      </div>

      <div className="glass-panel p-1">
        <textarea
          value={description}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Descreva o que você quer falar no vídeo..."
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
        onClick={onGenerateVoice}
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
