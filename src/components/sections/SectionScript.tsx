import { useState } from "react";
import { Globe, Wand2, Loader2, Clock } from "lucide-react";
import { generateScript } from "@/lib/openai";

const languages = [
  { id: "pt", label: "PT", flag: "🇧🇷" },
  { id: "en", label: "EN", flag: "🇺🇸" },
  { id: "es", label: "ES", flag: "🇪🇸" },
  { id: "fr", label: "FR", flag: "🇫🇷" },
  { id: "de", label: "DE", flag: "🇩🇪" },
  { id: "it", label: "IT", flag: "🇮🇹" },
  { id: "ja", label: "JA", flag: "🇯🇵" },
  { id: "ko", label: "KO", flag: "🇰🇷" },
  { id: "zh", label: "ZH", flag: "🇨🇳" },
  { id: "ar", label: "AR", flag: "🇸🇦" },
  { id: "hi", label: "HI", flag: "🇮🇳" },
  { id: "ru", label: "RU", flag: "🇷🇺" },
];

// Word count targets per duration (approx 2.5 words/sec for narration)
const wordsPerDuration: Record<number, number> = {
  15: 35,
  30: 70,
  60: 140,
  80: 200,
};

const MAX_CHARS = 1000;

interface Props {
  language: string;
  onLanguageChange: (l: string) => void;
  scriptMode: "manual" | "ai";
  onScriptModeChange: (m: "manual" | "ai") => void;
  aiPrompt: string;
  onAiPromptChange: (p: string) => void;
  description: string;
  onDescriptionChange: (d: string) => void;
  duration: number;
}

const SectionScript = ({
  language, onLanguageChange,
  scriptMode, onScriptModeChange,
  aiPrompt, onAiPromptChange,
  description, onDescriptionChange,
  duration,
}: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const targetWords = wordsPerDuration[duration] || 70;

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const script = await generateScript({
        prompt: aiPrompt,
        language,
        durationSeconds: duration,
      });
      onDescriptionChange(script.slice(0, MAX_CHARS));
    } catch {
      onDescriptionChange("Erro ao gerar roteiro. Verifique sua chave de API e tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = description.split(" ").filter(Boolean).length;
  const estimatedReadTime = Math.round(wordCount / 2.5);

  return (
    <div className="space-y-3">
      {/* Duration info badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium">
          Duração do vídeo: <strong>{duration}s</strong>
        </span>
        <span className="text-[10px] text-muted-foreground">
          (~{targetWords} palavras recomendadas)
        </span>
      </div>

      {/* Language */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Globe className="w-3 h-3" /> Idioma
        </label>
        <div className="flex gap-1 flex-wrap">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => onLanguageChange(l.id)}
              className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                language === l.id
                  ? "border-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => onScriptModeChange("manual")}
          className={`flex-1 py-1.5 text-xs font-bold transition-all ${
            scriptMode === "manual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          ✍️ Escrever
        </button>
        <button
          onClick={() => onScriptModeChange("ai")}
          className={`flex-1 py-1.5 text-xs font-bold transition-all ${
            scriptMode === "ai" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          🤖 Gerar com IA
        </button>
      </div>

      {scriptMode === "ai" && (
        <div className="space-y-2">
          <textarea
            value={aiPrompt}
            onChange={(e) => onAiPromptChange(e.target.value)}
            placeholder="Descreva o vídeo que você quer gerar... Ex: curiosidades sobre a missão Artemis 2, fatos perturbadores sobre o oceano profundo, segredos da vida de Michael Jackson..."
            rows={3}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !aiPrompt.trim()}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 hover:bg-primary/90 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Gerando roteiro...
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3" /> Gerar Roteiro ({duration}s)
              </>
            )}
          </button>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value.slice(0, MAX_CHARS))}
        placeholder="Cole ou escreva seu roteiro aqui..."
        rows={6}
        className="w-full bg-muted/50 border border-border rounded-lg p-3 text-xs focus:outline-none focus:border-primary resize-none"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          {wordCount} palavras • ~{estimatedReadTime}s de leitura
          {estimatedReadTime > duration && (
            <span className="text-destructive ml-1">(excede {duration}s)</span>
          )}
          {estimatedReadTime < duration * 0.7 && wordCount > 0 && (
            <span className="text-amber-500 ml-1">(roteiro curto para {duration}s)</span>
          )}
        </span>
        <span className={description.length >= MAX_CHARS ? "text-destructive font-semibold" : ""}>
          {description.length}/{MAX_CHARS}
        </span>
      </div>
    </div>
  );
};

export default SectionScript;
