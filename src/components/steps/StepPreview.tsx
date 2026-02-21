import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import { useState } from "react";
import gameplayMinecraft from "@/assets/gameplay-minecraft.jpg";
import gameplayGta from "@/assets/gameplay-gta.jpg";
import gameplaySubway from "@/assets/gameplay-subway.jpg";
import gameplayTemple from "@/assets/gameplay-temple.jpg";
import gameplaySatisfying from "@/assets/gameplay-satisfying.jpg";

const bgMap: Record<string, string> = {
  minecraft: gameplayMinecraft,
  gta: gameplayGta,
  subway: gameplaySubway,
  temple: gameplayTemple,
  satisfying: gameplaySatisfying,
};

const fontMap: Record<string, string> = {
  inter: "'Inter', sans-serif",
  "arial-black": "'Arial Black', sans-serif",
  impact: "'Impact', sans-serif",
  georgia: "'Georgia', serif",
  courier: "'Courier New', monospace",
  comic: "'Comic Sans MS', cursive",
  verdana: "'Verdana', sans-serif",
  trebuchet: "'Trebuchet MS', sans-serif",
};

// Resolve sub-video IDs to their category for image lookup
const resolveBackground = (bg: string): string => {
  const prefix = bg.split("-")[0];
  return bgMap[prefix] || bgMap.minecraft;
};

interface StepPreviewProps {
  background: string;
  captionColor: string;
  captionEnabled: boolean;
  description: string;
  captionFont: string;
}

const StepPreview = ({ background, captionColor, captionEnabled, description, captionFont }: StepPreviewProps) => {
  const [playing, setPlaying] = useState(false);
  const words = description.split(" ").filter(Boolean);
  const displayWords = words.length > 0 ? words.slice(0, 4).join(" ") : "SUA LEGENDA AQUI";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Preview do Vídeo</h2>
        <p className="text-muted-foreground">Veja como seu vídeo vai ficar</p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-[280px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-border bg-card">
          <img
            src={resolveBackground(background)}
            alt="Background"
            className="w-full h-full object-cover"
          />

          {captionEnabled && (
            <div className="absolute inset-x-0 bottom-1/3 flex justify-center px-4">
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xl font-black uppercase text-center leading-tight tracking-wide"
                style={{
                  color: captionColor,
                  fontFamily: fontMap[captionFont] || fontMap.inter,
                  textShadow: `0 2px 10px rgba(0,0,0,0.8), 0 0 20px ${captionColor}30`,
                }}
              >
                {displayWords}
              </motion.span>
            </div>
          )}

          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlaying(!playing)}
                className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1 h-1 bg-muted rounded-full">
                <div className="w-1/3 h-full bg-primary rounded-full" />
              </div>
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StepPreview;
