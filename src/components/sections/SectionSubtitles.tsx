import { Type, Sun } from "lucide-react";

const captionFonts = [
  { id: "inter", label: "Inter", family: "'Inter', sans-serif" },
  { id: "arial-black", label: "Arial Black", family: "'Arial Black', sans-serif" },
  { id: "impact", label: "Impact", family: "'Impact', sans-serif" },
  { id: "georgia", label: "Georgia", family: "'Georgia', serif" },
  { id: "courier", label: "Courier", family: "'Courier New', monospace" },
  { id: "comic", label: "Comic Sans", family: "'Comic Sans MS', cursive" },
  { id: "verdana", label: "Verdana", family: "'Verdana', sans-serif" },
  { id: "trebuchet", label: "Trebuchet", family: "'Trebuchet MS', sans-serif" },
];

const fontWeights = [
  { id: "300", label: "Light" },
  { id: "400", label: "Regular" },
  { id: "500", label: "Medium" },
  { id: "600", label: "Semibold" },
  { id: "700", label: "Bold" },
  { id: "800", label: "Extra Bold" },
  { id: "900", label: "Black" },
];

interface Props {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  color: string;
  onColorChange: (c: string) => void;
  font: string;
  onFontChange: (f: string) => void;
  size: number;
  onSizeChange: (s: number) => void;
  letterSpacing: number;
  onLetterSpacingChange: (v: number) => void;
  shadow: boolean;
  onShadowToggle: (v: boolean) => void;
  weight: string;
  onWeightChange: (w: string) => void;
}

const SectionSubtitles = ({
  enabled, onToggle, color, onColorChange, font, onFontChange,
  size, onSizeChange, letterSpacing, onLetterSpacingChange,
  shadow, onShadowToggle, weight, onWeightChange
}: Props) => {
  const selectedFamily = captionFonts.find((f) => f.id === font)?.family || captionFonts[0].family;

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Ativar Legendas</span>
        <button
          onClick={() => onToggle(!enabled)}
          className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
        >
          <div
            className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
            style={{ left: enabled ? "22px" : "2px" }}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          {/* Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Cor</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onColorChange(e.target.value);
                }}
                className="flex-1 bg-muted/50 border border-border rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Font */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Type className="w-3 h-3" /> Fonte
            </label>
            <div className="grid grid-cols-2 gap-1">
              {captionFonts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onFontChange(f.id)}
                  className={`px-2 py-1.5 rounded border text-[11px] font-bold uppercase transition-all ${
                    font === f.id
                      ? "border-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                  style={{ fontFamily: f.family }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Weight */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Peso da Fonte</label>
            <div className="grid grid-cols-3 gap-1">
              {fontWeights.map((w) => (
                <button
                  key={w.id}
                  onClick={() => onWeightChange(w.id)}
                  className={`px-2 py-1.5 rounded border text-[10px] transition-all ${
                    weight === w.id
                      ? "border-primary bg-primary/10 font-semibold"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                  style={{ fontWeight: Number(w.id) }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Tamanho: {size}px
            </label>
            <input
              type="range"
              min={14}
              max={48}
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Espaçamento: {letterSpacing}px
            </label>
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={letterSpacing}
              onChange={(e) => onLetterSpacingChange(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Shadow Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Sun className="w-3 h-3" /> Sombra no Texto
            </label>
            <button
              onClick={() => onShadowToggle(!shadow)}
              className={`w-10 h-5 rounded-full relative transition-colors ${shadow ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
                style={{ left: shadow ? "22px" : "2px" }}
              />
            </button>
          </div>

          {/* Preview */}
          <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-center min-h-[50px]">
            <span
              className="uppercase tracking-wider"
              style={{
                color,
                fontFamily: selectedFamily,
                fontSize: `${Math.min(size, 28)}px`,
                fontWeight: Number(weight),
                letterSpacing: `${letterSpacing}px`,
                textShadow: shadow ? `0 2px 8px ${color}60, 0 0 20px rgba(0,0,0,0.5)` : "none",
              }}
            >
              PREVIEW
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionSubtitles;
