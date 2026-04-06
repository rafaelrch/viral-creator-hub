import { Download, Send, Upload } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Props {
  onExport?: (() => Promise<Blob>) | null;
  tiktokEnabled?: boolean;
  tiktokConnected?: boolean;
  supabaseAuthenticated?: boolean;
  onPostTikTok?: () => Promise<void>;
  onUploadToSupabase?: () => Promise<string | null>;
}

const ActionButtons = ({
  onExport,
  tiktokEnabled = true,
  tiktokConnected,
  supabaseAuthenticated,
  onPostTikTok,
  onUploadToSupabase,
}: Props) => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [posting, setPosting] = useState(false);
  const [savingToSupabase, setSavingToSupabase] = useState(false);

  const handleExport = async () => {
    if (!onExport || exporting) return;
    setExporting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => (p >= 95 ? 95 : p + 2));
    }, 80);

    try {
      const blob = await onExport();
      setProgress(100);
      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clipzy.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erro ao exportar vídeo:", e);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setExporting(false);
        setProgress(0);
      }, 400);
    }
  };

  const handlePostTikTok = async () => {
    if (!onPostTikTok || posting) return;
    setPosting(true);
    try {
      await onPostTikTok();
    } catch (e) {
      console.error("Erro ao postar no TikTok:", e);
      toast.error("Não foi possível postar no TikTok.");
    } finally {
      setPosting(false);
    }
  };

  const handleSaveToSupabase = async () => {
    if (!onUploadToSupabase || savingToSupabase) return;
    setSavingToSupabase(true);
    try {
      await onUploadToSupabase();
    } catch (e) {
      console.error("Erro ao salvar no Supabase:", e);
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar no Supabase.");
    } finally {
      setSavingToSupabase(false);
    }
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
          disabled={exporting || !onExport}
          className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? `Exportando ${progress}%` : "Download MP4"}
        </button>
        <button
          onClick={handlePostTikTok}
          disabled={!tiktokEnabled || !tiktokConnected || posting}
          title={!tiktokEnabled ? "Função temporariamente desabilitada" : !tiktokConnected ? "Conecte sua conta TikTok" : undefined}
          className="py-2.5 px-4 rounded-lg border border-border text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {posting ? "Publicando..." : !tiktokEnabled ? "TikTok em breve" : "Postar no TikTok"}
        </button>
        <button
          onClick={handleSaveToSupabase}
          disabled={!supabaseAuthenticated || savingToSupabase || !onUploadToSupabase}
          title={!supabaseAuthenticated ? "Entre para salvar seus vídeos no Supabase" : undefined}
          className="py-2.5 px-4 rounded-lg border border-border text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {savingToSupabase ? "Salvando..." : "Salvar no Supabase"}
        </button>
      </div>

      {!supabaseAuthenticated && (
        <p className="text-xs text-muted-foreground">
          Faça login para sincronizar o projeto e armazenar os vídeos na sua conta.
        </p>
      )}
    </div>
  );
};

export default ActionButtons;
