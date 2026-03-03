import { Download, Send, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const ActionButtons = () => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    setExporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setExporting(false);
          return 0;
        }
        return p + 2;
      });
    }, 80);
  };

  return (
    <div className="space-y-3">
      {exporting && (
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? `Exportando ${progress}%` : "Download MP4"}
        </button>
        <button className="py-2.5 px-4 rounded-lg border border-border text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors">
          <Send className="w-4 h-4" />
          TikTok
        </button>
        <button className="py-2.5 px-4 rounded-lg border border-border text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors">
          <Clock className="w-4 h-4" />
          Agendar
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
