import { motion } from "framer-motion";

const captionColors = [
  { id: "white", label: "Branco", color: "#FFFFFF" },
  { id: "yellow", label: "Amarelo", color: "#FACC15" },
  { id: "red", label: "Vermelho", color: "#EF4444" },
  { id: "cyan", label: "Ciano", color: "#06B6D4" },
  { id: "green", label: "Verde Neon", color: "#22C55E" },
  { id: "pink", label: "Rosa", color: "#EC4899" },
];

interface StepSubtitleProps {
  enabled: boolean;
  onToggle: (val: boolean) => void;
  captionColor: string;
  onColorChange: (color: string) => void;
}

const StepSubtitle = ({ enabled, onToggle, captionColor, onColorChange }: StepSubtitleProps) => {
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
          {/* Color Picker */}
          <div className="glass-panel p-5 space-y-4">
            <span className="font-medium text-sm">Cor da Legenda</span>
            <div className="flex gap-3 flex-wrap">
              {captionColors.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => onColorChange(c.color)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    captionColor === c.color ? "border-foreground scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="glass-panel p-6 flex items-center justify-center min-h-[120px]">
            <motion.span
              key={captionColor}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-black uppercase tracking-wider"
              style={{
                color: captionColor,
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
