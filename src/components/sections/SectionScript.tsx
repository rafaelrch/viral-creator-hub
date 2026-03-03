import { useState } from "react";
import { Globe, Wand2, Loader2 } from "lucide-react";

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

const themes = [
  { id: "curiosidades", icon: "🌍", label: "Curiosidades do Mundo" },
  { id: "psicologia", icon: "🧠", label: "Psicologia Sombria" },
  { id: "perturbadores", icon: "💀", label: "Fatos Perturbadores" },
  { id: "conspiracoes", icon: "👁️", label: "Conspirações" },
  { id: "ricos", icon: "💰", label: "Segredos dos Ricos" },
  { id: "crimes", icon: "🔪", label: "Crimes Famosos" },
];

const sampleScripts: Record<string, string> = {
  curiosidades: "Você sabia que o cérebro humano gera eletricidade suficiente para acender uma lâmpada? Isso mesmo! Nosso cérebro produz entre 10 e 23 watts de energia.",
  psicologia: "Existe um fenômeno chamado Efeito Dunning-Kruger onde pessoas com pouco conhecimento se acham experts. Quanto menos sabemos, mais confiantes ficamos.",
  perturbadores: "Existem mais de 40 serial killers ativos nos EUA neste exato momento. A maioria nunca será pega. Eles vivem entre nós.",
  conspiracoes: "A Área 51 só foi oficialmente reconhecida pelo governo americano em 2013. Antes disso, negar sua existência era protocolo.",
  ricos: "Os 10 mais ricos do mundo possuem mais riqueza que os 3.5 bilhões mais pobres combinados.",
  crimes: "Em 1971, D.B. Cooper sequestrou um avião, recebeu 200 mil dólares de resgate, e pulou de paraquedas. Nunca foi encontrado.",
};

interface Props {
  language: string;
  onLanguageChange: (l: string) => void;
  theme: string;
  onThemeChange: (t: string) => void;
  scriptMode: "manual" | "ai";
  onScriptModeChange: (m: "manual" | "ai") => void;
  aiPrompt: string;
  onAiPromptChange: (p: string) => void;
  description: string;
  onDescriptionChange: (d: string) => void;
}

const SectionScript = ({
  language, onLanguageChange,
  theme, onThemeChange,
  scriptMode, onScriptModeChange,
  aiPrompt, onAiPromptChange,
  description, onDescriptionChange,
}: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation (real = Lovable Cloud + AI)
    await new Promise((r) => setTimeout(r, 2000));
    const script = sampleScripts[theme] || "Seu roteiro gerado por IA aparecerá aqui.";
    onDescriptionChange(script);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-3">
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

      {/* Theme */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Tema</label>
        <div className="grid grid-cols-2 gap-1.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium text-left transition-all ${
                theme === t.id
                  ? "border-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {t.icon} {t.label}
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
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => onAiPromptChange(e.target.value)}
            placeholder="Descreva o vídeo em poucas palavras..."
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !theme}
            className="w-full py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 hover:bg-primary/20 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Gerando...
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3" /> Gerar Roteiro
              </>
            )}
          </button>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value.slice(0, 500))}
        placeholder="Cole ou escreva seu roteiro aqui..."
        rows={5}
        className="w-full bg-muted/50 border border-border rounded-lg p-3 text-xs focus:outline-none focus:border-primary resize-none"
      />
      <p className="text-[10px] text-muted-foreground text-right">{description.length}/500</p>
    </div>
  );
};

export default SectionScript;
