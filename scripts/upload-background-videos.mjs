/**
 * Script para fazer upload dos vídeos de background para o Supabase Storage.
 * Execute com: node scripts/upload-background-videos.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const VIDEOS_DIR = join(ROOT, "public", "videos");

const SUPABASE_URL = "https://grjlufnikziucwqmtjye.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyamx1Zm5pa3ppdWN3cW10anllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ3MzYxMiwiZXhwIjoyMDkxMDQ5NjEyfQ.OdegZQjAaQBFQupQiR6X9CEsjyptxEDp1Otw_KvEjSA";

const BUCKET = "background-videos";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);

  if (!exists) {
    console.log(`Criando bucket "${BUCKET}"...`);
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
    });
    if (error) throw new Error(`Erro ao criar bucket: ${error.message}`);
    console.log(`Bucket "${BUCKET}" criado com sucesso.`);
  } else {
    console.log(`Bucket "${BUCKET}" já existe.`);
  }
}

async function uploadVideo(filename) {
  const filePath = join(VIDEOS_DIR, filename);
  const buffer = readFileSync(filePath);
  const storagePath = filename; // mantém o nome original

  console.log(`Enviando: ${filename} (${(buffer.length / 1024 / 1024).toFixed(1)}MB)...`);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: "video/mp4",
      upsert: true,
    });

  if (error) {
    console.error(`  ✗ Falhou: ${error.message}`);
    return false;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  console.log(`  ✓ URL: ${data.publicUrl}`);
  return true;
}

async function main() {
  console.log("=== Upload de vídeos de background para Supabase ===\n");

  await ensureBucket();

  const files = readdirSync(VIDEOS_DIR).filter((f) => f.endsWith(".mp4"));
  console.log(`\nEncontramos ${files.length} vídeos para enviar.\n`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const ok = await uploadVideo(file);
    if (ok) success++;
    else failed++;
  }

  console.log(`\n=== Concluído: ${success} enviados, ${failed} falhas ===`);
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
