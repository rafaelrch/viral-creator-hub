import { motion } from "framer-motion";
import { Download, CheckCircle } from "lucide-react";
import { useState } from "react";

const StepDownload = () => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setDone(true);
          setExporting(false);
          return 100;
        }
        return p + 2;
      });
    }, 80);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-md mx-auto text-center"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Exportar Vídeo</h2>
        <p className="text-muted-foreground">Seu vídeo viral está pronto!</p>
      </div>

      {!exporting && !done && (
        <motion.button
          onClick={handleExport}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-5 rounded-xl bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center gap-3 neon-glow hover:brightness-110 transition-all"
        >
          <Download className="w-6 h-6" />
          Baixar Vídeo
        </motion.button>
      )}

      {exporting && (
        <div className="space-y-4">
          <p className="text-muted-foreground">Exportando vídeo... {progress}%</p>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      )}

      {done && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4"
        >
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <p className="text-lg font-bold">Vídeo exportado com sucesso!</p>
          <p className="text-sm text-muted-foreground">
            Para a exportação real com ffmpeg, conecte o backend via Lovable Cloud.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StepDownload;
