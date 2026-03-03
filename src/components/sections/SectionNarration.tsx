import { useState, useRef, useEffect } from "react";
import { Play, Pause, RefreshCw, Loader2, Mic, AlertCircle } from "lucide-react";
import { generateSpeech } from "@/lib/elevenlabs";
import { Progress } from "@/components/ui/progress";

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
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setAudioDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setError(null);
    setProgress(10);

    try {
      // Simulate progress while waiting
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90));
      }, 500);

      const url = await generateSpeech(description, voiceId);

      clearInterval(progressInterval);
      setProgress(100);

      // Clean up previous audio URL
      if (audioUrl && audioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl);
      }

      onAudioGenerated(url);
    } catch (err: any) {
      console.error("TTS Error:", err);
      setError(err.message || "Erro ao gerar áudio. Verifique sua conexão e tente novamente.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const playbackPercent = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

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

      {/* Progress bar during generation */}
      {isGenerating && (
        <Progress value={progress} className="h-1.5" />
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mini player */}
      {audioUrl && !isGenerating && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border">
          <audio ref={audioRef} src={audioUrl} />
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${playbackPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(audioDuration)}</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (audioUrl.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
              onAudioGenerated(null);
              handleGenerate();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Regenerar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionNarration;
