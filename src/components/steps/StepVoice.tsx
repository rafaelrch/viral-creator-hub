import { motion } from "framer-motion";
import { Loader2, RefreshCw, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

interface StepVoiceProps {
  isGenerating: boolean;
  audioUrl: string | null;
  onRegenerate: () => void;
}

const StepVoice = ({ isGenerating, audioUrl, onRegenerate }: StepVoiceProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 space-y-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Gerando sua narração...</h2>
          <p className="text-muted-foreground">Isso pode levar alguns segundos</p>
        </div>
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: "50%" }}
          />
        </div>
      </motion.div>
    );
  }

  if (!audioUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 space-y-4"
      >
        <p className="text-muted-foreground">Nenhuma narração gerada ainda.</p>
        <p className="text-sm text-muted-foreground">Volte ao passo anterior e clique em "Gerar Narração".</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Narração Gerada ✅</h2>
        <p className="text-muted-foreground">Ouça e aprove a narração</p>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
        
        <div className="flex items-center gap-4">
          <motion.button
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center neon-glow"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </motion.button>
          <div className="flex-1">
            <div className="flex gap-0.5 items-end h-8">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-primary/60 rounded-full min-w-[2px]"
                  animate={isPlaying ? {
                    height: [4, Math.random() * 28 + 4, 4],
                  } : { height: 4 }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.03 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={onRegenerate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl border border-border text-muted-foreground font-medium flex items-center justify-center gap-2 hover:border-primary/50 hover:text-foreground transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Regenerar Narração
      </motion.button>
    </motion.div>
  );
};

export default StepVoice;
