import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepProgress from "./StepProgress";
import StepBackground from "./steps/StepBackground";
import StepTheme from "./steps/StepTheme";
import StepDescription from "./steps/StepDescription";
import StepVoice from "./steps/StepVoice";
import StepSubtitle from "./steps/StepSubtitle";
import StepPreview from "./steps/StepPreview";
import StepDownload from "./steps/StepDownload";

interface ProjectState {
  background: string;
  theme: string;
  description: string;
  audioUrl: string | null;
  captionEnabled: boolean;
  captionColor: string;
  captionFont: string;
  language: string;
}

const STORAGE_KEY = "viralvideo-project";

const loadState = (): ProjectState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
  } catch {}
  return defaultState;
};

const defaultState: ProjectState = {
  background: "",
  theme: "",
  description: "",
  audioUrl: null,
  captionEnabled: true,
  captionColor: "#FFFFFF",
  captionFont: "inter",
  language: "pt",
};

const VideoCreator = () => {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<ProjectState>(loadState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const save = useCallback((newState: ProjectState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const update = (partial: Partial<ProjectState>) => {
    save({ ...state, ...partial });
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return !!state.background;
      case 2: return !!state.theme;
      case 3: return !!state.description.trim();
      case 4: return !!state.audioUrl;
      default: return true;
    }
  };

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    // Simulate AI script generation (real implementation requires Lovable Cloud + AI)
    await new Promise((r) => setTimeout(r, 2500));
    const sampleScripts: Record<string, string> = {
      curiosidades: "Você sabia que o cérebro humano gera eletricidade suficiente para acender uma lâmpada? Isso mesmo! Nosso cérebro produz entre 10 e 23 watts de energia. E mais: ele usa 20% de todo o oxigênio que respiramos.",
      psicologia: "Existe um fenômeno chamado Efeito Dunning-Kruger onde pessoas com pouco conhecimento se acham experts. Quanto menos sabemos, mais confiantes ficamos. É a ilusão da incompetência.",
      perturbadores: "Existem mais de 40 serial killers ativos nos EUA neste exato momento. A maioria nunca será pega. Eles vivem entre nós, em casas normais, com vidas aparentemente comuns.",
      conspiracoes: "A Área 51 só foi oficialmente reconhecida pelo governo americano em 2013. Antes disso, negar sua existência era protocolo. O que mais estão escondendo?",
      ricos: "Os 10 mais ricos do mundo possuem mais riqueza que os 3.5 bilhões mais pobres combinados. Eles acordam às 4 da manhã e leem 50 livros por ano em média.",
      crimes: "Em 1971, D.B. Cooper sequestrou um avião, recebeu 200 mil dólares de resgate, e pulou de paraquedas. Nunca foi encontrado. É o único caso de sequestro aéreo não resolvido nos EUA.",
    };
    const script = sampleScripts[state.theme] || "Seu roteiro gerado por IA aparecerá aqui com base no tema selecionado.";
    update({ description: script });
    setIsGeneratingScript(false);
  };

  const handleGenerateVoice = async () => {
    setStep(4);
    setIsGenerating(true);
    // Simulate TTS generation (real implementation requires ElevenLabs + Cloud)
    await new Promise((r) => setTimeout(r, 3000));
    update({ audioUrl: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=" });
    setIsGenerating(false);
  };

  const handleRegenerate = () => {
    update({ audioUrl: null });
    handleGenerateVoice();
  };

  const next = () => {
    if (step === 3 && canAdvance()) {
      handleGenerateVoice();
      return;
    }
    step < 7 && canAdvance() && setStep(step + 1);
  };
  const prev = () => step > 1 && setStep(step - 1);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-primary neon-text">VIRAL</span>
            <span className="text-foreground">CLIP</span>
          </h1>
          <span className="text-xs text-muted-foreground">Criador de Vídeos Virais</span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-4xl mx-auto w-full px-4">
        <StepProgress currentStep={step} />
      </div>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <StepBackground selected={state.background} onSelect={(bg) => update({ background: bg })} />
            )}
            {step === 2 && (
              <StepTheme selected={state.theme} onSelect={(t) => update({ theme: t })} />
            )}
            {step === 3 && (
              <StepDescription
                description={state.description}
                onChange={(d) => update({ description: d })}
                onGenerateScript={handleGenerateScript}
                isGeneratingScript={isGeneratingScript}
                language={state.language}
                onLanguageChange={(lang) => update({ language: lang })}
                theme={state.theme}
              />
            )}
            {step === 4 && (
              <StepVoice
                isGenerating={isGenerating}
                audioUrl={state.audioUrl}
                onRegenerate={handleRegenerate}
              />
            )}
            {step === 5 && (
              <StepSubtitle
                enabled={state.captionEnabled}
                onToggle={(v) => update({ captionEnabled: v })}
                captionColor={state.captionColor}
                onColorChange={(c) => update({ captionColor: c })}
                captionFont={state.captionFont}
                onFontChange={(f) => update({ captionFont: f })}
              />
            )}
            {step === 6 && (
              <StepPreview
                background={state.background}
                captionColor={state.captionColor}
                captionEnabled={state.captionEnabled}
                description={state.description}
                captionFont={state.captionFont}
              />
            )}
            {step === 7 && <StepDownload />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 inset-x-0 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium disabled:opacity-30 hover:border-primary/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          {step < 7 && (
            <button
              onClick={next}
              disabled={!canAdvance()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold disabled:opacity-30 neon-glow hover:brightness-110 transition-all"
            >
              {step === 3 ? "Gerar Narração" : "Próximo"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCreator;
