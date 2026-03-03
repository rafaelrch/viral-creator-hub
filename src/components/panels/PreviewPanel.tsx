import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import type { ProjectState } from "../VideoCreator";
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

const resolveBackground = (bg: string): string => {
  const prefix = bg.split("-")[0];
  return bgMap[prefix] || bgMap.minecraft;
};

interface PreviewPanelProps {
  state: ProjectState;
}

const PreviewPanel = ({ state }: PreviewPanelProps) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const words = state.description.split(" ").filter(Boolean);
  const displayWords = words.length > 0 ? words.slice(0, 4).join(" ") : "SUA LEGENDA AQUI";

  const isVertical = state.aspectRatio === "9:16";

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full justify-center">
      <div className="text-center">
        <h2 className="text-lg font-bold">Preview</h2>
        <p className="text-xs text-muted-foreground">
          {state.duration}s • {state.aspectRatio}
        </p>
      </div>

      {/* Container that fills available space while maintaining aspect ratio */}
      <div
        className={`relative rounded-2xl overflow-hidden border-2 border-border bg-card ${
          isVertical
            ? "h-[min(65vh,600px)] aspect-[9/16]"
            : "w-[min(90%,700px)] aspect-video"
        }`}
      >
        {state.background ? (
          <img
            src={resolveBackground(state.background)}
            alt="Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-xs text-muted-foreground">Selecione um background</p>
          </div>
        )}

        {state.captionEnabled && state.description && (
          <div className="absolute inset-x-0 bottom-1/3 flex justify-center px-3">
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-black uppercase text-center leading-tight tracking-wide"
              style={{
                color: state.captionColor,
                fontFamily: fontMap[state.captionFont] || fontMap.impact,
                fontSize: `${state.captionSize}px`,
                textShadow: `0 2px 10px rgba(0,0,0,0.8), 0 0 20px ${state.captionColor}30`,
              }}
            >
              {displayWords}
            </motion.span>
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div className="flex-1 h-1 bg-white/30 rounded-full">
              <div className="w-1/3 h-full bg-primary rounded-full" />
            </div>
            <button onClick={() => setMuted(!muted)} className="text-white/70 hover:text-white">
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
