import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
}

/**
 * Splits the script into individual words, each timed evenly across audio duration.
 */
function buildWordTimings(text: string, totalDuration: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0 || totalDuration <= 0) return [];

  const wordDuration = totalDuration / words.length;
  return words.map((word, i) => ({
    word,
    start: i * wordDuration,
    end: (i + 1) * wordDuration,
  }));
}

const PreviewPanel = ({ state }: PreviewPanelProps) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
    if (audio && !audio.paused) {
      setCurrentTime(audio.currentTime);
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
    if (!audio || !state.audioUrl) return;
    if (playing) {
      audio.pause();
      cancelAnimationFrame(animFrameRef.current);
      setPlaying(false);
    } else {
      audio.play().then(() => {
        setPlaying(true);
        animFrameRef.current = requestAnimationFrame(tick);
      });
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!playing) {
      audio.play().then(() => {
        setPlaying(true);
        animFrameRef.current = requestAnimationFrame(tick);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
    setCurrentTime(audio.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onEnded = () => {
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
        {/* Background */}
        {state.background ? (
          <img
            src={resolveBackground(state.background)}
            alt="Background"
            className="w-full h-full object-cover"
          />
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
