import { AtSign, ExternalLink } from "lucide-react";

interface Props {
  handle: string;
  onHandleChange: (v: string) => void;
  connected: boolean;
  disabled?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const SectionTikTok = ({ handle, onHandleChange, connected, disabled = false, onConnect, onDisconnect }: Props) => (
  <div className="space-y-3">
    {/* Handle input */}
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <AtSign className="w-3 h-3" /> Usuário TikTok (watermark no vídeo)
      </label>
      <div className="flex items-center gap-1.5 bg-muted/50 border border-border rounded px-2 py-1.5">
        <span className="text-xs text-muted-foreground">@</span>
        <input
          type="text"
          value={handle}
          onChange={(e) => onHandleChange(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ""))}
          placeholder="seuusuario"
          className="flex-1 bg-transparent text-xs focus:outline-none"
        />
      </div>
    </div>

    {/* Connect/disconnect */}
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">Conta TikTok</label>
      {disabled ? (
        <div className="space-y-2">
          <button
            type="button"
            disabled
            className="w-full py-2 rounded-lg border border-dashed border-border bg-muted/50 text-xs font-bold text-muted-foreground cursor-not-allowed"
          >
            Integração com TikTok temporariamente desabilitada
          </button>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Essa função ficará indisponível por enquanto.
          </p>
        </div>
      ) : connected ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded px-2 py-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
            Conta conectada
          </div>
          <button
            onClick={onDisconnect}
            className="px-2 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            Desconectar
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="w-full py-2 rounded-lg bg-[#010101] dark:bg-white text-white dark:text-black text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Conectar ao TikTok
        </button>
      )}
      {!connected && !disabled && (
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Conecte sua conta para publicar vídeos diretamente.
          Precisará de um app TikTok Developer configurado.
        </p>
      )}
    </div>
  </div>
);

export default SectionTikTok;
