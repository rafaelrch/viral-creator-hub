import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

// ATENÇÃO: usar OpenAI direto no browser expõe sua API key ao usuário final.
// Em produção, o ideal é chamar um backend/Edge Function.
const openai = apiKey
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

export async function generateScript(params: {
  prompt: string;
  language: string;
  durationSeconds: number;
}): Promise<string> {
  // Limita a duração máxima solicitada a 80 segundos
  const safeDuration = Math.min(params.durationSeconds, 80);

  if (!openai) {
    throw new Error(
      "Chave da OpenAI não configurada. Defina VITE_OPENAI_API_KEY no seu arquivo .env.local."
    );
  }

  const targetWords = Math.round(safeDuration * 2.5);
  const lang =
    params.language === "pt"
      ? "português brasileiro"
      : params.language === "en"
        ? "English"
        : params.language;

  const { choices } = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: [
          `Você é um roteirista de vídeos virais para redes sociais.`,
          `Escreva um roteiro curto, impactante e no idioma solicitado (${lang}).`,
          `Use aproximadamente ${targetWords} palavras — nunca menos de 100 palavras e nunca mais de 150 palavras.`,
          `O texto deve ter no máximo 1000 caracteres e caber em ${safeDuration} segundos de narração (~2,5 palavras/segundo).`,
          `Nunca use siglas ou abreviações: em vez de "EUA" escreva sempre "Estados Unidos da América"; não use "ONU", "UE" etc, escreva sempre o nome completo.`,
          `Para nomes de pessoas, nunca use apenas iniciais ou abreviações; escreva sempre o nome completo.`,
          `Não use markdown nem títulos, apenas o texto contínuo do roteiro.`,
        ].join(" "),
      },
      {
        role: "user",
        content: params.prompt.trim() || `Gere um roteiro envolvente em ${lang}.`,
      },
    ],
    max_tokens: 400,
  });

  const text = choices[0]?.message?.content?.trim();
  if (!text) throw new Error("Resposta vazia da OpenAI.");
  return text;
}
