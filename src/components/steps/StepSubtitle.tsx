import { motion } from "framer-motion";
import { useState } from "react";
import { Type } from "lucide-react";

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

interface StepSubtitleProps {
  enabled: boolean;
  onToggle: (val: boolean) => void;
  captionColor: string;
  onColorChange: (color: string) => void;
  captionFont: string;
  onFontChange: (font: string) => void;
}

const StepSubtitle = ({ enabled, onToggle, captionColor, onColorChange, captionFont, onFontChange }: StepSubtitleProps) => {
  const selectedFontFamily = captionFonts.find((f) => f.id === captionFont)?.family || captionFonts[0].family;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-lg mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Personalizar Legendas</h2>
        <p className="text-muted-foreground">Defina o estilo das legendas do vídeo</p>
      </div>

      {/* Toggle */}
      <div className="glass-panel p-5 flex items-center justify-between">
        <span className="font-medium">Ativar Legendas</span>
        <button
          onClick={() => onToggle(!enabled)}
          className={`w-14 h-7 rounded-full relative transition-colors ${
            enabled ? "bg-primary" : "bg-muted"
          }`}
        >
          <motion.div
            className="w-5 h-5 bg-foreground rounded-full absolute top-1"
            animate={{ left: enabled ? 32 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {enabled && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Color Picker - Full RGB */}
          <div className="glass-panel p-5 space-y-4">
            <span className="font-medium text-sm">Cor da Legenda</span>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={captionColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-14 h-14 rounded-xl border-2 border-border cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={captionColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) onColorChange(val);
                  }}
                  className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-mono w-full focus:outline-none focus:border-primary"
                  placeholder="#FFFFFF"
                />
                <p className="text-xs text-muted-foreground">Escolha qualquer cor do espectro RGB</p>
              </div>
            </div>
          </div>

          {/* Font Selector */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Type className="w-4 h-4 text-primary" />
              Fonte da Legenda
            </div>
            <div className="grid grid-cols-2 gap-2">
              {captionFonts.map((font) => (
                <motion.button
                  key={font.id}
                  onClick={() => onFontChange(font.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    captionFont === font.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span
                    className="text-sm font-bold uppercase"
                    style={{ fontFamily: font.family }}
                  >
                    {font.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="glass-panel p-6 flex items-center justify-center min-h-[120px]">
            <motion.span
              key={captionColor + captionFont}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-black uppercase tracking-wider"
              style={{
                color: captionColor,
                fontFamily: selectedFontFamily,
                textShadow: `0 2px 8px ${captionColor}40, 0 0 20px ${captionColor}20`,
              }}
            >
              TEXTO DE EXEMPLO
            </motion.span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StepSubtitle;
