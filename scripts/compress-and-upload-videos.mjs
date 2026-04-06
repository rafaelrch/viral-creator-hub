/**
 * Comprime os vídeos de background para ~40MB e faz upload no Supabase Storage.
 * Requer: ffmpeg instalado no sistema.
 * Execute com: node scripts/compress-and-upload-videos.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync, spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const VIDEOS_DIR = join(ROOT, "public", "videos");
const COMPRESSED_DIR = join(ROOT, "public", "videos-compressed");

const SUPABASE_URL = "https://grjlufnikziucwqmtjye.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyamx1Zm5pa3ppdWN3cW10anllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ3MzYxMiwiZXhwIjoyMDkxMDQ5NjEyfQ.OdegZQjAaQBFQupQiR6X9CEsjyptxEDp1Otw_KvEjSA";
const BUCKET = "background-videos";

// Bitrate alvo: ~40MB para vídeo de ~80s
const VIDEO_BITRATE = "3800k";
const AUDIO_BITRATE = "128k";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function compress(inputFile, outputFile) {
  if (existsSync(outputFile)) {
    const size = readFileSync(outputFile).length;
    console.log(`  → já comprimido (${(size / 1024 / 1024).toFixed(1)}MB), pulando ffmpeg`);
    return true;
  }

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i", inputFile,
      "-c:v", "libx264",
      "-b:v", VIDEO_BITRATE,
      "-maxrate", "4500k",
      "-bufsize", "9000k",
      "-preset", "fast",
      "-c:a", "aac",
      "-b:a", AUDIO_BITRATE,
      "-movflags", "+faststart",
      outputFile,
    ],
    { stdio: "pipe" }
  );

  if (result.status !== 0) {
    console.error("  ✗ ffmpeg falhou:", result.stderr?.toString().slice(-300));
    return false;
  }
  return true;
}

async function uploadVideo(filename) {
  const inputPath = join(VIDEOS_DIR, filename);
  const outputPath = join(COMPRESSED_DIR, filename);

  console.log(`\n[${filename}]`);

  // Comprimir
  console.log(`  Comprimindo...`);
  if (!compress(inputPath, outputPath)) return false;

  const buffer = readFileSync(outputPath);
  const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
  console.log(`  Tamanho comprimido: ${sizeMB}MB`);

  // Fazer upload
  console.log(`  Enviando para Supabase...`);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: "video/mp4",
      upsert: true,
    });

  if (error) {
    console.error(`  ✗ Upload falhou: ${error.message}`);
    return false;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  console.log(`  ✓ ${data.publicUrl}`);
  return true;
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    console.log(`Criando bucket "${BUCKET}"...`);
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw new Error(`Erro ao criar bucket: ${error.message}`);
  }
}

async function main() {
  console.log("=== Comprimir + Upload de vídeos de background ===\n");

  if (!existsSync(COMPRESSED_DIR)) mkdirSync(COMPRESSED_DIR, { recursive: true });

  await ensureBucket();

  const files = readdirSync(VIDEOS_DIR).filter((f) => f.endsWith(".mp4"));
  console.log(`${files.length} vídeos encontrados.\n`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const ok = await uploadVideo(file);
    if (ok) success++;
    else failed++;
  }

  console.log(`\n=== Concluído: ${success} ok, ${failed} falhas ===`);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
