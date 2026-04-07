import { useState, useCallback, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import EditorPanel from "./panels/EditorPanel";
import PreviewPanel from "./panels/PreviewPanel";
import ActionButtons from "./panels/ActionButtons";
import {
  getCurrentUser,
  loadProject,
  onSupabaseAuthChange,
  saveProject,
  uploadVideoToStorage,
} from "@/lib/supabase";
import { postToTikTok } from "@/lib/tiktok";

export interface ProjectState {
  background: string;
  duration: number;
  aspectRatio: "9:16" | "16:9";
  language: string;
  theme: string;
  scriptMode: "manual" | "ai";
  aiPrompt: string;
  description: string;
  voiceId: string;
  audioUrl: string | null;
  captionEnabled: boolean;
  captionColor: string;
  captionFont: string;
  captionSize: number;
  captionLetterSpacing: number;
  captionShadow: boolean;
  captionWeight: string;
  tiktokHandle: string;
}

const STORAGE_KEY = "clipsy-project";
const TIKTOK_FEATURE_ENABLED = false;

const defaultState: ProjectState = {
  background: "",
  // Duração fixa: 80s (1min20)
  duration: 80,
  // Sempre vertical
  aspectRatio: "9:16",
  language: "pt",
  theme: "",
  scriptMode: "manual",
  aiPrompt: "",
  description: "",
  voiceId: "onwK4e9ZLuTAKqWW03F9",
  audioUrl: null,
  captionEnabled: true,
  captionColor: "#FFFFFF",
  captionFont: "impact",
  captionSize: 24,
  captionLetterSpacing: 2,
  captionShadow: true,
  captionWeight: "900",
  tiktokHandle: "",
};

const loadState = (): ProjectState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<ProjectState>;
      // Garante que duration e aspectRatio sigam as novas regras
      return {
        ...defaultState,
        ...parsed,
        duration: 80,
        aspectRatio: "9:16",
      };
    }
  } catch {}
  return defaultState;
};

const VideoCreator = () => {
  const [state, setState] = useState<ProjectState>(loadState);
  const [exportHandler, setExportHandler] = useState<(() => Promise<Blob>) | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tiktokToken, setTiktokToken] = useState<string | null>(() =>
    localStorage.getItem("clipsy-tiktok-token")
  );

  const registerExportHandler = useCallback((handler: () => Promise<Blob>) => {
    setExportHandler(() => handler);
  }, []);

  useEffect(() => {
    getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));

    const { data } = onSupabaseAuthChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // On mount: check for TikTok OAuth callback
  useEffect(() => {
    if (!TIKTOK_FEATURE_ENABLED) return;

    const search = window.location.search;
    if (!search.includes("code=")) return;

    const params = new URLSearchParams(search);
    const code = params.get("code");
    const stateParam = params.get("state");

    if (!code) return;

    const storedState = localStorage.getItem("clipsy-tiktok-state");
    if (stateParam !== storedState) {
      console.error("TikTok OAuth state mismatch");
      window.history.replaceState(null, "", "/");
      return;
    }

    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tiktok-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ code, redirect_uri: window.location.origin }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("clipsy-tiktok-token", data.access_token);
          setTiktokToken(data.access_token);
        }
      })
      .catch((err) => console.error("TikTok token exchange failed:", err))
      .finally(() => {
        window.history.replaceState(null, "", "/");
      });
  }, []);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !currentUser?.id) return;

    loadProject(currentUser.id)
      .then((row) => {
        if (row?.data && typeof row.data === "object") {
          setState({ ...defaultState, ...(row.data as Partial<ProjectState>) });
        }
      })
      .catch(() => {});
  }, [currentUser?.id]);

  const save = useCallback((newState: ProjectState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    if (import.meta.env.VITE_SUPABASE_URL && currentUser?.id) {
      saveProject(currentUser.id, newState).catch(() => {});
    }
  }, [currentUser?.id]);

  const update = useCallback(
    (partial: Partial<ProjectState>) => {
      save({ ...state, ...partial });
    },
    [state, save]
  );

  const onTikTokConnect = () => {
    if (!TIKTOK_FEATURE_ENABLED) return;

    const stateVal = crypto.randomUUID();
    localStorage.setItem("clipsy-tiktok-state", stateVal);
    const params = new URLSearchParams({
      client_key: import.meta.env.VITE_TIKTOK_CLIENT_KEY || "",
      scope: "video.publish,video.upload",
      response_type: "code",
      redirect_uri: window.location.origin,
      state: stateVal,
    });
    window.location.href = `https://www.tiktok.com/v2/auth/authorize/?${params}`;
  };

  const onTikTokDisconnect = () => {
    if (!TIKTOK_FEATURE_ENABLED) return;

    localStorage.removeItem("clipsy-tiktok-token");
    setTiktokToken(null);
  };

  const onPostTikTok = async () => {
    if (!TIKTOK_FEATURE_ENABLED || !exportHandler || !tiktokToken) return;
    const blob = await exportHandler();
    await postToTikTok(blob, state.description, tiktokToken);
  };

  const onUploadToSupabase = async () => {
    if (!currentUser?.id) {
      throw new Error("Faça login para salvar vídeos no Supabase.");
    }

    if (!exportHandler) {
      throw new Error("Gere a narração e selecione um background antes de salvar.");
    }

    const blob = await exportHandler();
    const uploaded = await uploadVideoToStorage(currentUser.id, blob, state.description);
    toast.success("Vídeo salvo no Supabase com sucesso.");
    return uploaded.publicUrl || uploaded.path;
  };

  return (
    <main className="h-full max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-0 lg:gap-1 overflow-hidden">
      {/* Left column - Editor (scrollable) */}
      <div className="border-r border-border overflow-y-auto h-full p-4 space-y-1">
          <EditorPanel
            state={state}
            update={update}
            tiktokHandle={state.tiktokHandle}
            onTiktokHandleChange={(v) => update({ tiktokHandle: v })}
            tiktokConnected={TIKTOK_FEATURE_ENABLED && !!tiktokToken}
            tiktokDisabled={!TIKTOK_FEATURE_ENABLED}
            onTikTokConnect={onTikTokConnect}
            onTikTokDisconnect={onTikTokDisconnect}
          />
      </div>

      {/* Right column - Preview (fixed, no scroll) */}
      <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <PreviewPanel
              state={state}
              registerExportHandler={registerExportHandler}
              tiktokHandle={state.tiktokHandle}
            />
          </div>
          <div className="border-t border-border p-4 flex-shrink-0">
            <ActionButtons
              onExport={exportHandler}
              tiktokEnabled={TIKTOK_FEATURE_ENABLED}
              tiktokConnected={TIKTOK_FEATURE_ENABLED && !!tiktokToken}
              onPostTikTok={onPostTikTok}
              supabaseAuthenticated={!!currentUser}
              onUploadToSupabase={onUploadToSupabase}
            />
          </div>
      </div>
    </main>
  );
};

export default VideoCreator;
