import { useState, useRef } from "react";
import { Play, Pause, RefreshCw, Loader2, Mic } from "lucide-react";

const defaultVoices = [
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel (Deep)" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
  { id: "iP95p4xoKVk53GoZ742B", name: "Chris" },
];

interface Props {
  voiceId: string;
  onVoiceChange: (v: string) => void;
  description: string;
  audioUrl: string | null;
  onAudioGenerated: (url: string | null) => void;
}

const SectionNarration = ({ voiceId, onVoiceChange, description, audioUrl, onAudioGenerated }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    // Simulate TTS (real = ElevenLabs via Cloud)
    await new Promise((r) => setTimeout(r, 2500));
    onAudioGenerated("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
    setIsGenerating(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-3">
      {/* Voice selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Mic className="w-3 h-3" /> Voz
        </label>
        <select
          value={voiceId}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
        >
          {defaultVoices.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !description.trim()}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 hover:brightness-110 transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" /> Gerando narração...
          </>
        ) : (
          <>
            <Mic className="w-3 h-3" /> Gerar Narração
          </>
        )}
      </button>

      {/* Mini player */}
      {audioUrl && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border">
          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <div className="flex-1 h-1 bg-border rounded-full">
            <div className="w-1/2 h-full bg-primary rounded-full" />
          </div>
          <button
            onClick={() => {
              onAudioGenerated(null);
              handleGenerate();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionNarration;
