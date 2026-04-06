import { Monitor, Smartphone } from "lucide-react";

// Durações máximas: até 80s (1min20)
const durations = [15, 30, 60, 80];

interface Props {
  duration: number;
  onDurationChange: (d: number) => void;
  aspectRatio: "9:16" | "16:9";
  onAspectRatioChange: (ar: "9:16" | "16:9") => void;
}

const SectionVideoConfig = ({ duration, onDurationChange, aspectRatio, onAspectRatioChange }: Props) => {
  return (
    <div className="space-y-4">
      {/* Duration */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Duração</label>
        <div className="flex gap-2">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => onDurationChange(d)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                duration === d
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          O trecho será cortado aleatoriamente do vídeo
        </p>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Proporção</label>
        <div className="flex gap-2">
          <button
            onClick={() => onAspectRatioChange("9:16")}
            className={`flex-1 py-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              aspectRatio === "9:16"
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            9:16 Vertical
          </button>
          <button
            onClick={() => onAspectRatioChange("16:9")}
            className={`flex-1 py-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              aspectRatio === "16:9"
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            16:9 Horizontal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionVideoConfig;
