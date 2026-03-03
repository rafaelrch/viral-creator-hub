import { useState, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import EditorPanel from "./panels/EditorPanel";
import PreviewPanel from "./panels/PreviewPanel";
import ActionButtons from "./panels/ActionButtons";

export interface ProjectState {
  background: string;
  duration: number;
  aspectRatio: "9:16" | "16:9";
  language: string;
  theme: string;
  scriptMode: "manual" | "ai";
  aiPrompt: string;
  description: string;
  voiceId: string;
  audioUrl: string | null;
  captionEnabled: boolean;
  captionColor: string;
  captionFont: string;
  captionSize: number;
  captionLetterSpacing: number;
  captionShadow: boolean;
  captionWeight: string;
}

const STORAGE_KEY = "viralclip-project";

const defaultState: ProjectState = {
  background: "",
  duration: 30,
  aspectRatio: "9:16",
  language: "pt",
  theme: "",
  scriptMode: "manual",
  aiPrompt: "",
  description: "",
  voiceId: "onwK4e9ZLuTAKqWW03F9",
  audioUrl: null,
  captionEnabled: true,
  captionColor: "#FFFFFF",
  captionFont: "impact",
  captionSize: 24,
  captionLetterSpacing: 2,
  captionShadow: true,
  captionWeight: "900",
};

const loadState = (): ProjectState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
  } catch {}
  return defaultState;
};

const VideoCreator = () => {
  const [state, setState] = useState<ProjectState>(loadState);

  const save = useCallback((newState: ProjectState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const update = useCallback(
    (partial: Partial<ProjectState>) => {
      save({ ...state, ...partial });
    },
    [state, save]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-primary">VIRAL</span>
            <span className="text-foreground">CLIP</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Criador de Vídeos Virais
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main 2-column layout */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-0 lg:gap-1">
        {/* Left column - Editor */}
        <div className="border-r border-border overflow-y-auto h-[calc(100vh-57px)] p-4 space-y-1">
          <EditorPanel state={state} update={update} />
        </div>

        {/* Right column - Preview */}
        <div className="flex flex-col h-[calc(100vh-57px)] overflow-y-auto">
          <div className="flex-1 flex items-center justify-center p-4">
            <PreviewPanel state={state} />
          </div>
          <div className="border-t border-border p-4">
            <ActionButtons />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoCreator;
