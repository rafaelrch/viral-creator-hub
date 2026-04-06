import { createClient, type AuthChangeEvent, type Session, type User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configurados. " +
      "Crie um arquivo .env.local com essas variáveis."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
export const VIDEO_BUCKET = "videos";

export interface StoredProject {
  id: string;
  created_at: string;
  updated_at: string;
  data: unknown;
}

export interface UploadedVideo {
  path: string;
  publicUrl: string | null;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("[Supabase] Erro ao obter usuário atual:", error);
    return null;
  }

  return data.user;
}

export function onSupabaseAuthChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("[Supabase] Erro ao criar conta:", error);
    throw error;
  }

  return data.user;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[Supabase] Erro ao autenticar usuário:", error);
    throw error;
  }

  return data.user;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[Supabase] Erro ao encerrar sessão:", error);
    throw error;
  }
}

export async function saveProject(userId: string, data: unknown) {
  const { error } = await supabase
    .from("projects")
    .upsert(
      {
        user_id: userId,
        data,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) {
    console.error("[Supabase] Erro ao salvar projeto:", error);
    throw error;
  }
}

export async function loadProject(userId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("[Supabase] Erro ao carregar projeto:", error);
    throw error;
  }

  return data as StoredProject;
}

export async function uploadVideoToStorage(userId: string, videoBlob: Blob, title?: string): Promise<UploadedVideo> {
  const safeTitle = (title || "clipzy-video")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "clipzy-video";

  const filePath = `${userId}/${new Date().toISOString().replace(/[:.]/g, "-")}-${safeTitle}.mp4`;

  const { data, error } = await supabase.storage.from(VIDEO_BUCKET).upload(filePath, videoBlob, {
    contentType: "video/mp4",
    upsert: false,
  });

  if (error) {
    console.error("[Supabase] Erro ao enviar vídeo para o Storage:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(data.path);
  const publicUrl = publicUrlData?.publicUrl || null;

  const { error: insertError } = await supabase.from("user_videos").insert({
    user_id: userId,
    title: title || "Clipzy export",
    storage_path: data.path,
    public_url: publicUrl,
  });

  if (insertError) {
    console.warn("[Supabase] O vídeo foi salvo no bucket, mas a metadata não foi registrada:", insertError);
  }

  return {
    path: data.path,
    publicUrl,
  };
}

