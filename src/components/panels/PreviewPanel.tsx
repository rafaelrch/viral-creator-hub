import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { motion, AnimatePresence } from "framer-motion";

// ─── FFmpeg singleton (loaded once, reused across exports) ───────────────────
let _ffmpeg: FFmpeg | null = null;
async function getFFmpeg(): Promise<FFmpeg> {
  if (_ffmpeg) return _ffmpeg;
  const ff = new FFmpeg();
  const base = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm";
  await ff.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
  });
  _ffmpeg = ff;
  return _ffmpeg;
}

// ─── Font cache (DejaVu Sans Bold – supports all Latin/PT characters) ────────
let _fontCache: ArrayBuffer | null = null;
async function getCaptionFont(): Promise<ArrayBuffer | null> {
  if (_fontCache) return _fontCache;
  try {
    const r = await fetch(
      "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf"
    );
    _fontCache = await r.arrayBuffer();
    return _fontCache;
  } catch {
    return null;
  }
}

// ─── Build the FFmpeg drawtext filter chain for word-by-word captions ────────
function buildCaptionFilter(
  timings: ReturnType<typeof buildWordTimings>,
  captionColor: string,
  captionSize: number,
  captionShadow: boolean,
  videoH: number
): string {
  if (timings.length === 0) return "";
  const fontSize = Math.round(captionSize * (videoH / 600));
  const color = captionColor.replace("#", "0x");
  const shadow = captionShadow ? ":shadowcolor=0x000000@0.85:shadowx=2:shadowy=2" : "";

  return timings
    .map(({ word, start, end }) => {
      const safe = word
        .toUpperCase()
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/:/g, "\\:")
        .replace(/\[/g, "\\[")
        .replace(/]/g, "\\]");
      return (
        `drawtext=fontfile=caption.ttf:text='${safe}'` +
        `:fontcolor=${color}:fontsize=${fontSize}` +
        `:x=(w-text_w)/2:y=h*2/3` +
        `:enable='between(t,${start.toFixed(3)},${end.toFixed(3)})'` +
        shadow
      );
    })
    .join(",");
}
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import type { ProjectState } from "../VideoCreator";
import gameplayMinecraft from "@/assets/gameplay-minecraft.jpg";
import gameplayGta from "@/assets/gameplay-gta.jpg";
import gameplaySubway from "@/assets/gameplay-subway.jpg";
import gameplayTemple from "@/assets/gameplay-temple.jpg";
import gameplaySatisfying from "@/assets/gameplay-satisfying.jpg";

const bgMap: Record<string, string> = {
  minecraft: gameplayMinecraft,
  gta: gameplayGta,
  subway: gameplaySubway,
  temple: gameplayTemple,
  satisfying: gameplaySatisfying,
};

// Mapa de ID selecionado -> URL do vídeo no Supabase Storage.
const SUPABASE_VIDEOS_BASE = "https://grjlufnikziucwqmtjye.supabase.co/storage/v1/object/public/background-videos";

const videoMap: Record<string, string> = {
  "minecraft-1": `${SUPABASE_VIDEOS_BASE}/mine%201.mp4`,
  "minecraft-2": `${SUPABASE_VIDEOS_BASE}/mine%202.mp4`,
  "minecraft-3": `${SUPABASE_VIDEOS_BASE}/mine%203.mp4`,
  "minecraft-4": `${SUPABASE_VIDEOS_BASE}/mine%204.mp4`,
  "minecraft-5": `${SUPABASE_VIDEOS_BASE}/mine%205.mp4`,
  "minecraft-6": `${SUPABASE_VIDEOS_BASE}/mine%206.mp4`,
  "minecraft-7": `${SUPABASE_VIDEOS_BASE}/mine%207.mp4`,
  "minecraft-8": `${SUPABASE_VIDEOS_BASE}/mine%208.mp4`,
  "minecraft-9": `${SUPABASE_VIDEOS_BASE}/mine%209.mp4`,
  "minecraft-10": `${SUPABASE_VIDEOS_BASE}/mine%2010.mp4`,
  "minecraft-11": `${SUPABASE_VIDEOS_BASE}/mine%2011.mp4`,
  "minecraft-12": `${SUPABASE_VIDEOS_BASE}/mine%2012.mp4`,
  "minecraft-13": `${SUPABASE_VIDEOS_BASE}/mine%2013.mp4`,
  "gta-1": `${SUPABASE_VIDEOS_BASE}/1.mp4`,
  "gta-2": `${SUPABASE_VIDEOS_BASE}/2.mp4`,
  "gta-3": `${SUPABASE_VIDEOS_BASE}/3.mp4`,
  "gta-4": `${SUPABASE_VIDEOS_BASE}/4.mp4`,
  "gta-5": `${SUPABASE_VIDEOS_BASE}/5.mp4`,
  "gta-6": `${SUPABASE_VIDEOS_BASE}/6.mp4`,
  "gta-7": `${SUPABASE_VIDEOS_BASE}/7.mp4`,
  "gta-8": `${SUPABASE_VIDEOS_BASE}/8.mp4`,
  "gta-9": `${SUPABASE_VIDEOS_BASE}/9.mp4`,
  "subway-1": `${SUPABASE_VIDEOS_BASE}/subway%20surf%201.mp4`,
  "subway-2": `${SUPABASE_VIDEOS_BASE}/subway%20surf%202.mp4`,
  "subway-3": `${SUPABASE_VIDEOS_BASE}/subway%20surf%203.mp4`,
  "temple-1": `${SUPABASE_VIDEOS_BASE}/Temple%20Run.mp4`,
};

const fontMap: Record<string, string> = {
  inter: "'Inter', sans-serif",
  "arial-black": "'Arial Black', sans-serif",
  impact: "'Impact', sans-serif",
  georgia: "'Georgia', serif",
  courier: "'Courier New', monospace",
  comic: "'Comic Sans MS', cursive",
  verdana: "'Verdana', sans-serif",
  trebuchet: "'Trebuchet MS', sans-serif",
};

const resolveBackground = (bg: string): string => {
  const prefix = bg.split("-")[0];
  return bgMap[prefix] || bgMap.minecraft;
};

interface PreviewPanelProps {
  state: ProjectState;
  registerExportHandler?: (handler: () => Promise<Blob>) => void;
  tiktokHandle?: string;
}

/**
 * Splits the script into chunks of 3–4 words, each timed evenly across audio duration.
 */
function buildWordTimings(text: string, totalDuration: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0 || totalDuration <= 0) return [];

  const CHUNK_SIZE = 3;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunks.push(words.slice(i, i + CHUNK_SIZE).join(' '));
  }

  const chunkDuration = totalDuration / chunks.length;
  // Trim 80 ms from each chunk so the subtitle flips slightly before
  // the audio finishes saying the words — keeps it snappy on fast voices.
  const LEAD = 0.08;
  return chunks.map((word, i) => ({
    word,
    start: i * chunkDuration,
    end: (i + 1) * chunkDuration - LEAD,
  }));
}

const PreviewPanel = ({ state, registerExportHandler, tiktokHandle }: PreviewPanelProps) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Build per-word timings
  const wordTimings = useMemo(
    () => buildWordTimings(state.description, duration),
    [state.description, duration]
  );

  // Find current word based on playback time
  const currentWord = useMemo(
    () => wordTimings.find((w) => currentTime >= w.start && currentTime < w.end),
    [wordTimings, currentTime]
  );

  const tick = useCallback(() => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (audio && !audio.paused) {
      setCurrentTime(audio.currentTime);
      animFrameRef.current = requestAnimationFrame(tick);
      return;
    }

    // Quando ainda não existe narração, usamos o tempo do vídeo
    if (!audio && video && !video.paused) {
      setCurrentTime(video.currentTime);
      animFrameRef.current = requestAnimationFrame(tick);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [state.audioUrl]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio || !video || !state.audioUrl) return;
    if (playing) {
      audio.pause();
      video.pause();
      cancelAnimationFrame(animFrameRef.current);
      setPlaying(false);
    } else {
      Promise.allSettled([audio.play(), video.play()]).then(() => {
        setPlaying(true);
        animFrameRef.current = requestAnimationFrame(tick);
      });
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio || !video) return;
    audio.currentTime = 0;
    video.currentTime = 0;
    setCurrentTime(0);
    if (!playing) {
      Promise.allSettled([audio.play(), video.play()]).then(() => {
        setPlaying(true);
        animFrameRef.current = requestAnimationFrame(tick);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (duration <= 0 || (!audio && !video)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pct * duration;

    if (audio) {
      audio.currentTime = Math.min(newTime, isNaN(audio.duration) ? newTime : audio.duration);
    }
    if (video) {
      video.currentTime = Math.min(newTime, isNaN(video.duration) ? newTime : video.duration);
    }

    setCurrentTime(newTime);
  };

  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (audio && !isNaN(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    } else if (video && !isNaN(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }
  };

  const onEnded = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isVertical = state.aspectRatio === "9:16";

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const backgroundImage = state.background ? resolveBackground(state.background) : null;
  const videoSrc = state.background ? videoMap[state.background] ?? null : null;

  const captionStyle = {
    color: state.captionColor,
    fontFamily: fontMap[state.captionFont] || fontMap.impact,
    fontSize: `${state.captionSize}px`,
    fontWeight: Number(state.captionWeight),
    letterSpacing: `${state.captionLetterSpacing}px`,
    textShadow: state.captionShadow
      ? `0 2px 10px rgba(0,0,0,0.8), 0 0 20px ${state.captionColor}30`
      : "none",
  };

  // ─── Export: FFmpeg offline pipeline (não é real-time — muito mais rápido) ──
  useEffect(() => {
    if (!registerExportHandler) return;

    registerExportHandler(async (): Promise<Blob> => {
      const audio = audioRef.current;
      const video = videoRef.current;

      if (!state.audioUrl || !videoSrc) {
        throw new Error("Selecione um background e gere uma narração antes de exportar.");
      }

      // Garante que o áudio está carregado para obter a duração
      if (audio) {
        await new Promise<void>((resolve) => {
          if (audio.readyState >= 2) { resolve(); return; }
          audio.addEventListener("canplay", () => resolve(), { once: true });
          audio.load();
        });
      }

      const audioDuration = audio?.duration && !isNaN(audio.duration) ? audio.duration : 60;
      const exportTimings = buildWordTimings(state.description, audioDuration);

      const needsFont = (state.captionEnabled && exportTimings.length > 0) || !!tiktokHandle;

      // Baixa vídeo, áudio e fonte em paralelo
      const [videoRes, audioRes, fontData] = await Promise.all([
        fetch(videoSrc),
        fetch(state.audioUrl),
        needsFont ? getCaptionFont() : Promise.resolve(null),
      ]);

      const [videoData, audioData] = await Promise.all([
        videoRes.arrayBuffer(),
        audioRes.arrayBuffer(),
      ]);

      const ffmpeg = await getFFmpeg();

      // Escreve arquivos no FS virtual do FFmpeg
      await ffmpeg.writeFile("bg.mp4", new Uint8Array(videoData));
      await ffmpeg.writeFile("narration.bin", new Uint8Array(audioData));
      if (fontData) {
        await ffmpeg.writeFile("caption.ttf", new Uint8Array(fontData));
      }

      // Monta a cadeia de filtros de vídeo
      const filters: string[] = [];

      // Normaliza para 720×1280 (9:16) usando scale+crop (equivalente ao CSS object-cover)
      filters.push("scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280");

      // Legendas palavra por palavra
      if (state.captionEnabled && exportTimings.length > 0 && fontData) {
        const H = video?.videoHeight || 1280;
        const captionVf = buildCaptionFilter(
          exportTimings,
          state.captionColor,
          state.captionSize,
          state.captionShadow,
          H
        );
        if (captionVf) filters.push(captionVf);
      }

      // Watermark
      if (tiktokHandle && fontData) {
        const H = video?.videoHeight || 1280;
        const wSize = Math.round((state.captionSize || 18) * (H / 600) * 1.1);
        const wText = `@${tiktokHandle}`.toUpperCase().replace(/'/g, "\\'").replace(/:/g, "\\:");
        filters.push(
          `drawtext=fontfile=caption.ttf:text='${wText}'` +
          `:fontcolor=0xffffff@0.18:fontsize=${wSize}:x=(w-text_w)/2:y=(h-text_h)/2`
        );
      }

      const args = [
        "-stream_loop", "-1",      // loop o vídeo se for mais curto que o áudio
        "-i", "bg.mp4",
        "-i", "narration.bin",
        "-vf", filters.join(","),
        "-map", "0:v",
        "-map", "1:a",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-t", audioDuration.toFixed(3),
        "-movflags", "+faststart",
        "result.mp4",
      ];

      await ffmpeg.exec(args);

      const mp4Data = await ffmpeg.readFile("result.mp4");
      const mp4Buffer = mp4Data instanceof Uint8Array
        ? (mp4Data.buffer as ArrayBuffer)
        : new TextEncoder().encode(mp4Data as string).buffer as ArrayBuffer;

      // Limpa o FS virtual para a próxima exportação
      await Promise.allSettled([
        ffmpeg.deleteFile("bg.mp4"),
        ffmpeg.deleteFile("narration.bin"),
        ffmpeg.deleteFile("result.mp4"),
        fontData ? ffmpeg.deleteFile("caption.ttf") : Promise.resolve(),
      ]);

      return new Blob([mp4Buffer], { type: "video/mp4" });
    });
  }, [registerExportHandler, state.audioUrl, videoSrc, state.captionEnabled,
      state.description, state.captionColor, state.captionSize,
      state.captionShadow, tiktokHandle]);

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full justify-center">
      <div className="text-center">
        <h2 className="text-lg font-bold">Preview</h2>
        <p className="text-xs text-muted-foreground">
          {state.duration}s • {state.aspectRatio}
        </p>
      </div>

      <div
        className={`relative rounded-2xl overflow-hidden border-2 border-border bg-card ${
          isVertical
            ? "h-[min(65vh,600px)] aspect-[9/16]"
            : "w-[min(90%,700px)] aspect-video"
        }`}
      >
        {/* Background / Vídeo de gameplay */}
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={backgroundImage || undefined}
            className="w-full h-full object-cover"
            onLoadedMetadata={onLoadedMetadata}
            crossOrigin="anonymous"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : backgroundImage ? (
          <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-xs text-muted-foreground">Selecione um background</p>
          </div>
        )}

        {/* Hidden audio element */}
        {state.audioUrl && (
          <audio
            ref={audioRef}
            src={state.audioUrl}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={onEnded}
            preload="metadata"
          />
        )}

        {/* TikTok watermark overlay */}
        {tiktokHandle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-white font-bold uppercase tracking-widest select-none"
              style={{ fontSize: "22px", opacity: 0.18, letterSpacing: "4px" }}
            >
              @{tiktokHandle}
            </span>
          </div>
        )}

        {/* Synced subtitles — one word at a time */}
        {state.captionEnabled && state.description && (
          <div className="absolute inset-x-0 bottom-1/3 flex justify-center px-3">
            <AnimatePresence mode="wait">
              {playing && currentWord ? (
                <motion.span
                  key={currentWord.start}
                  initial={{ opacity: 0, y: 12, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  transition={{ duration: 0.12 }}
                  className="uppercase text-center leading-tight"
                  style={captionStyle}
                >
                  {currentWord.word.toUpperCase()}
                </motion.span>
              ) : !playing ? (
                <motion.span
                  key="static"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="uppercase text-center leading-tight"
                  style={captionStyle}
                >
                  {state.description.split(" ")[0]?.toUpperCase() || "LEGENDA"}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              disabled={!state.audioUrl}
              className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground disabled:opacity-40 shrink-0"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            <div className="flex-1 flex flex-col gap-0.5">
              <div
                className="h-1.5 bg-white/30 rounded-full cursor-pointer relative group"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-primary rounded-full transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-white/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              disabled={!state.audioUrl}
              className="text-white/70 hover:text-white disabled:opacity-40"
              title="Reiniciar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMuted(!muted)}
              className="text-white/70 hover:text-white"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!state.audioUrl && (
          <div className="absolute top-3 inset-x-3">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center">
              <p className="text-[10px] text-white/80">
                Gere uma narração para ativar o player
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
