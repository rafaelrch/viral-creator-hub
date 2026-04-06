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
  theme: string;
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
          `Escreva um roteiro curto, impactante e no idioma solicitado.`,
          `Tema do canal: ${params.theme}.`,
          `Use aproximadamente ${targetWords} palavras para caber em no máximo ${safeDuration} segundos de narração (~2,5 palavras/segundo).`,
          `Nunca use siglas ou abreviações: em vez de "EUA" escreva sempre "Estados Unidos da América"; não use "ONU", "UE" etc, escreva sempre o nome completo.`,
          `Para nomes de pessoas, nunca use apenas iniciais ou abreviações (como "Sr. J. Silva"); escreva sempre o nome completo da pessoa.`,
          `Não use markdown nem títulos, apenas o texto contínuo do roteiro.`,
        ].join(" "),
      },
      {
        role: "user",
        content: params.prompt.trim() || `Gere um roteiro envolvente sobre o tema ${params.theme} em ${lang}.`,
      },
    ],
    max_tokens: 500,
  });

  const text = choices[0]?.message?.content?.trim();
  if (!text) throw new Error("Resposta vazia da OpenAI.");
  return text;
}
