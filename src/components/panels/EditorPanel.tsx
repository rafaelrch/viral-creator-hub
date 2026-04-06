import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Film, FileText, Mic, Type, AtSign } from "lucide-react";
import SectionBackground from "../sections/SectionBackground";
import SectionScript from "../sections/SectionScript";
import SectionNarration from "../sections/SectionNarration";
import SectionSubtitles from "../sections/SectionSubtitles";
import SectionTikTok from "../sections/SectionTikTok";
import type { ProjectState } from "../VideoCreator";

interface EditorPanelProps {
  state: ProjectState;
  update: (partial: Partial<ProjectState>) => void;
  tiktokHandle: string;
  onTiktokHandleChange: (v: string) => void;
  tiktokConnected: boolean;
  tiktokDisabled?: boolean;
  onTikTokConnect: () => void;
  onTikTokDisconnect: () => void;
}

const EditorPanel = ({
  state,
  update,
  tiktokHandle,
  onTiktokHandleChange,
  tiktokConnected,
  tiktokDisabled,
  onTikTokConnect,
  onTikTokDisconnect,
}: EditorPanelProps) => {
  return (
    <Accordion type="multiple" defaultValue={["background"]} className="space-y-1">
      <AccordionItem value="background" className="glass-panel px-4">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Film className="w-4 h-4 text-primary" />
            Background Video
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <SectionBackground selected={state.background} onSelect={(bg) => update({ background: bg })} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="script" className="glass-panel px-4">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="w-4 h-4 text-primary" />
            Roteiro
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <SectionScript
            language={state.language}
            onLanguageChange={(l) => update({ language: l })}
            theme={state.theme}
            onThemeChange={(t) => update({ theme: t })}
            scriptMode={state.scriptMode}
            onScriptModeChange={(m) => update({ scriptMode: m })}
            aiPrompt={state.aiPrompt}
            onAiPromptChange={(p) => update({ aiPrompt: p })}
            description={state.description}
            onDescriptionChange={(d) => update({ description: d })}
            duration={state.duration}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="narration" className="glass-panel px-4">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Mic className="w-4 h-4 text-primary" />
            Narração
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <SectionNarration
            voiceId={state.voiceId}
            onVoiceChange={(v) => update({ voiceId: v })}
            description={state.description}
            audioUrl={state.audioUrl}
            onAudioGenerated={(url) => update({ audioUrl: url })}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="subtitles" className="glass-panel px-4">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Type className="w-4 h-4 text-primary" />
            Legendas
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <SectionSubtitles
            enabled={state.captionEnabled}
            onToggle={(v) => update({ captionEnabled: v })}
            color={state.captionColor}
            onColorChange={(c) => update({ captionColor: c })}
            font={state.captionFont}
            onFontChange={(f) => update({ captionFont: f })}
            size={state.captionSize}
            onSizeChange={(s) => update({ captionSize: s })}
            letterSpacing={state.captionLetterSpacing}
            onLetterSpacingChange={(v) => update({ captionLetterSpacing: v })}
            shadow={state.captionShadow}
            onShadowToggle={(v) => update({ captionShadow: v })}
            weight={state.captionWeight}
            onWeightChange={(w) => update({ captionWeight: w })}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tiktok" className="glass-panel px-4">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <AtSign className="w-4 h-4 text-primary" />
            TikTok
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <SectionTikTok
            handle={tiktokHandle}
            onHandleChange={onTiktokHandleChange}
            connected={tiktokConnected}
            disabled={tiktokDisabled}
            onConnect={onTikTokConnect}
            onDisconnect={onTikTokDisconnect}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default EditorPanel;
