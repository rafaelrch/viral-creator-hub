import { useState } from "react";
import { Globe, Wand2, Loader2, Clock } from "lucide-react";
import { generateScript } from "@/lib/openai";

const languages = [
  { id: "pt", label: "PT", flag: "🇧🇷" },
  { id: "en", label: "EN", flag: "🇺🇸" },
  { id: "es", label: "ES", flag: "🇪🇸" },
  { id: "fr", label: "FR", flag: "🇫🇷" },
  { id: "de", label: "DE", flag: "🇩🇪" },
  { id: "it", label: "IT", flag: "🇮🇹" },
  { id: "ja", label: "JA", flag: "🇯🇵" },
  { id: "ko", label: "KO", flag: "🇰🇷" },
  { id: "zh", label: "ZH", flag: "🇨🇳" },
  { id: "ar", label: "AR", flag: "🇸🇦" },
  { id: "hi", label: "HI", flag: "🇮🇳" },
  { id: "ru", label: "RU", flag: "🇷🇺" },
];

const themes = [
  { id: "curiosidades", icon: "🌍", label: "Curiosidades do Mundo" },
  { id: "psicologia", icon: "🧠", label: "Psicologia Sombria" },
  { id: "perturbadores", icon: "💀", label: "Fatos Perturbadores" },
  { id: "conspiracoes", icon: "👁️", label: "Conspirações" },
  { id: "ricos", icon: "💰", label: "Segredos dos Ricos" },
  { id: "crimes", icon: "🔪", label: "Crimes Famosos" },
];

const languageNames: Record<string, string> = {
  pt: "português brasileiro",
  en: "English",
  es: "español",
  fr: "français",
  de: "Deutsch",
  it: "italiano",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
  ar: "العربية",
  hi: "हिन्दी",
  ru: "русский",
};

const themeLabels: Record<string, string> = {
  curiosidades: "Curiosidades do Mundo",
  psicologia: "Psicologia Sombria",
  perturbadores: "Fatos Perturbadores",
  conspiracoes: "Conspirações",
  ricos: "Segredos dos Ricos",
  crimes: "Crimes Famosos",
};

// Word count targets per duration (approx 2.5 words/sec for narration)
const wordsPerDuration: Record<number, number> = {
  15: 35,
  30: 70,
  60: 140,
  80: 200,
};

// Longer sample scripts per theme per duration tier
const sampleScripts: Record<string, Record<number, string>> = {
  curiosidades: {
    15: "Você sabia que o mel nunca estraga? Arqueólogos encontraram potes de mel com mais de 3 mil anos no Egito ainda perfeitamente comestíveis.",
    30: "Você sabia que o mel nunca estraga? Arqueólogos encontraram potes de mel com mais de 3 mil anos no Egito ainda perfeitamente comestíveis. Isso acontece porque o mel tem um pH muito baixo e quase nenhuma umidade, criando um ambiente onde bactérias simplesmente não sobrevivem. Além disso, as abelhas adicionam uma enzima que produz peróxido de hidrogênio, um antibacteriano natural.",
    60: "Você sabia que o mel nunca estraga? Arqueólogos encontraram potes de mel com mais de 3 mil anos no Egito ainda perfeitamente comestíveis. Isso acontece porque o mel tem um pH muito baixo e quase nenhuma umidade, criando um ambiente onde bactérias simplesmente não sobrevivem. Além disso, as abelhas adicionam uma enzima que produz peróxido de hidrogênio, um antibacteriano natural. Mas não para por aí. Sabia que uma única abelha produz apenas um doze avos de uma colher de chá de mel durante toda sua vida? Para fazer um quilo de mel, as abelhas precisam visitar cerca de 2 milhões de flores. E tem mais: as abelhas se comunicam dançando. Elas fazem uma dança em formato de oito para indicar às companheiras a direção e a distância exata de fontes de néctar. É um sistema de GPS biológico que existe há milhões de anos.",
    90: "Você sabia que o mel nunca estraga? Arqueólogos encontraram potes de mel com mais de 3 mil anos no Egito ainda perfeitamente comestíveis. Isso acontece porque o mel tem um pH muito baixo e quase nenhuma umidade, criando um ambiente onde bactérias simplesmente não sobrevivem. Além disso, as abelhas adicionam uma enzima que produz peróxido de hidrogênio, um antibacteriano natural. Mas não para por aí. Sabia que uma única abelha produz apenas um doze avos de uma colher de chá de mel durante toda sua vida? Para fazer um quilo de mel, as abelhas precisam visitar cerca de 2 milhões de flores. E tem mais: as abelhas se comunicam dançando. Elas fazem uma dança em formato de oito para indicar às companheiras a direção e a distância exata de fontes de néctar. É um sistema de GPS biológico que existe há milhões de anos. Agora pensa nisso: sem as abelhas, 75% das plantações do mundo desapareceriam. Maçãs, amêndoas, abacates, todos dependem da polinização. Einstein supostamente disse que se as abelhas desaparecessem, a humanidade teria apenas 4 anos de vida. Mesmo que essa citação seja debatida, a ciência confirma: as abelhas são essenciais para a sobrevivência da nossa espécie. Cada colher de mel carrega milhões de anos de evolução. Da próxima vez que você provar mel, lembre-se: é o único alimento feito por insetos que nós consumimos.",
  },
  psicologia: {
    15: "Existe um fenômeno chamado Efeito Dunning-Kruger: quanto menos você sabe sobre algo, mais confiante você se sente. É por isso que ignorantes parecem tão seguros de si.",
    30: "Existe um fenômeno chamado Efeito Dunning-Kruger: quanto menos você sabe sobre algo, mais confiante você se sente. É por isso que ignorantes parecem tão seguros de si. Já os verdadeiros especialistas duvidam constantemente de si mesmos. Isso cria uma ironia perturbadora: as pessoas menos qualificadas são as que mais acreditam estar certas, enquanto os mais competentes vivem com a síndrome do impostor.",
    60: "Existe um fenômeno chamado Efeito Dunning-Kruger: quanto menos você sabe sobre algo, mais confiante você se sente. É por isso que ignorantes parecem tão seguros de si. Já os verdadeiros especialistas duvidam constantemente de si mesmos. Isso cria uma ironia perturbadora: as pessoas menos qualificadas são as que mais acreditam estar certas, enquanto os mais competentes vivem com a síndrome do impostor. Mas vai além. Seu cérebro mente para você todos os dias. Viés de confirmação faz você buscar apenas informações que confirmam suas crenças. O efeito halo faz você achar que pessoas bonitas são mais inteligentes e confiáveis. E o viés de ancoragem faz com que o primeiro número que você vê influencie todas as suas decisões seguintes. Você acha que suas decisões são racionais, mas 95% delas são tomadas pelo subconsciente.",
    90: "Existe um fenômeno chamado Efeito Dunning-Kruger: quanto menos você sabe sobre algo, mais confiante você se sente. É por isso que ignorantes parecem tão seguros de si. Já os verdadeiros especialistas duvidam constantemente de si mesmos. Isso cria uma ironia perturbadora: as pessoas menos qualificadas são as que mais acreditam estar certas, enquanto os mais competentes vivem com a síndrome do impostor. Mas vai além. Seu cérebro mente para você todos os dias. Viés de confirmação faz você buscar apenas informações que confirmam suas crenças. O efeito halo faz você achar que pessoas bonitas são mais inteligentes e confiáveis. E o viés de ancoragem faz com que o primeiro número que você vê influencie todas as suas decisões seguintes. Você acha que suas decisões são racionais, mas 95% delas são tomadas pelo subconsciente. O mais assustador é o fenômeno da dissonância cognitiva. Quando suas ações contradizem suas crenças, seu cérebro não muda o comportamento — ele muda a crença para justificar o que você já fez. Fumantes que sabem dos riscos convencem a si mesmos de que 'todo mundo morre de algo'. Pessoas em relacionamentos tóxicos acreditam que 'amor é assim mesmo'. Seu cérebro prefere se enganar do que admitir que está errado. Agora a pergunta que não quer calar: quantas das suas certezas são realmente suas? Ou são apenas truques da sua mente para manter a ilusão de controle?",
  },
  perturbadores: {
    15: "Existem mais de 40 serial killers ativos nos EUA neste exato momento. A maioria nunca será pega. Eles vivem entre nós, parecem normais, e continuam matando.",
    30: "Existem mais de 40 serial killers ativos nos EUA neste exato momento. A maioria nunca será pega. Eles vivem entre nós, parecem normais, e continuam matando. O FBI estima que para cada serial killer identificado, existem pelo menos 3 que nunca são descobertos. Eles trabalham, pagam impostos, cumprimentam vizinhos. A pessoa mais normal que você conhece pode ter um segredo inimaginável.",
    60: "Existem mais de 40 serial killers ativos nos EUA neste exato momento. A maioria nunca será pega. Eles vivem entre nós, parecem normais, e continuam matando. O FBI estima que para cada serial killer identificado, existem pelo menos 3 que nunca são descobertos. Eles trabalham, pagam impostos, cumprimentam vizinhos. A pessoa mais normal que você conhece pode ter um segredo inimaginável. Mas fica pior. Existem mais de 250 mil casos de pessoas desaparecidas nos EUA por ano. Muitos nunca são resolvidos. Em florestas nacionais americanas, existem áreas chamadas de 'Missing 411' onde pessoas simplesmente desaparecem sem deixar rastros. Sem roupas, sem pegadas, sem lógica. E o mais perturbador: o governo não mantém um banco de dados centralizado de pessoas desaparecidas em terras federais.",
    90: "Existem mais de 40 serial killers ativos nos EUA neste exato momento. A maioria nunca será pega. Eles vivem entre nós, parecem normais, e continuam matando. O FBI estima que para cada serial killer identificado, existem pelo menos 3 que nunca são descobertos. Eles trabalham, pagam impostos, cumprimentam vizinhos. A pessoa mais normal que você conhece pode ter um segredo inimaginável. Mas fica pior. Existem mais de 250 mil casos de pessoas desaparecidas nos EUA por ano. Muitos nunca são resolvidos. Em florestas nacionais americanas, existem áreas chamadas de 'Missing 411' onde pessoas simplesmente desaparecem sem deixar rastros. Sem roupas, sem pegadas, sem lógica. E o mais perturbador: o governo não mantém um banco de dados centralizado de pessoas desaparecidas em terras federais. Agora pense no oceano. Conhecemos apenas 5% do fundo do mar. Nos outros 95%, existem criaturas que desafiam a imaginação. Em 2023, um submarino encontrou formas de vida a 11 quilômetros de profundidade que não deveriam existir pela nossa compreensão de biologia. Elas vivem sem luz solar, sob pressão que esmagaria um tanque de guerra, e se alimentam de compostos químicos que seriam letais para qualquer outro ser vivo. E a pergunta que ninguém quer fazer: se existem coisas assim aqui na Terra, o que existe nos oceanos de Europa, a lua de Júpiter, que tem o dobro da água do nosso planeta? A verdade é que vivemos cercados de mistérios, e a maioria das pessoas prefere não pensar nisso.",
  },
  conspiracoes: {
    15: "A Área 51 só foi oficialmente reconhecida pelo governo americano em 2013. Antes disso, negar sua existência era protocolo oficial. O que mais eles escondem?",
    30: "A Área 51 só foi oficialmente reconhecida pelo governo americano em 2013. Antes disso, negar sua existência era protocolo oficial. O que mais eles escondem? Em 2017, o Pentágono admitiu ter gasto 22 milhões de dólares investigando OVNIs em um programa secreto chamado AATIP. Pilotos militares filmaram objetos que desafiavam as leis da física. O governo confirmou que os vídeos são reais.",
    60: "A Área 51 só foi oficialmente reconhecida pelo governo americano em 2013. Antes disso, negar sua existência era protocolo oficial. O que mais eles escondem? Em 2017, o Pentágono admitiu ter gasto 22 milhões de dólares investigando OVNIs em um programa secreto chamado AATIP. Pilotos militares filmaram objetos que desafiavam as leis da física. O governo confirmou que os vídeos são reais. Mas a coisa vai mais fundo. O Projeto MKUltra da CIA, revelado em 1975, usou LSD e tortura psicológica em cidadãos americanos sem consentimento. O objetivo: controle mental. Milhares de documentos foram destruídos, e só sabemos uma fração do que realmente aconteceu. Se isso é o que foi revelado, imagine o que ainda está escondido. E não é teoria da conspiração — são fatos desclassificados pelo próprio governo.",
    90: "A Área 51 só foi oficialmente reconhecida pelo governo americano em 2013. Antes disso, negar sua existência era protocolo oficial. O que mais eles escondem? Em 2017, o Pentágono admitiu ter gasto 22 milhões de dólares investigando OVNIs em um programa secreto chamado AATIP. Pilotos militares filmaram objetos que desafiavam as leis da física. O governo confirmou que os vídeos são reais. Mas a coisa vai mais fundo. O Projeto MKUltra da CIA, revelado em 1975, usou LSD e tortura psicológica em cidadãos americanos sem consentimento. O objetivo: controle mental. Milhares de documentos foram destruídos, e só sabemos uma fração do que realmente aconteceu. Se isso é o que foi revelado, imagine o que ainda está escondido. E não é teoria da conspiração — são fatos desclassificados pelo próprio governo. A Operação Northwoods é outro exemplo aterrador. Em 1962, o Departamento de Defesa dos EUA propôs ao presidente Kennedy um plano para cometer ataques terroristas contra cidadãos americanos e culpar Cuba, criando um pretexto para invasão. Kennedy rejeitou o plano. Sete meses depois, foi assassinado. Coincidência? O documento foi desclassificado em 1997 e está disponível nos Arquivos Nacionais dos EUA. Agora pense: se governos fizeram isso no passado e admitiram, o que estão fazendo agora que saberemos apenas daqui a 50 anos? A linha entre conspiração e realidade é mais fina do que você imagina.",
  },
  ricos: {
    15: "Os 10 mais ricos do mundo possuem mais riqueza que os 3.5 bilhões mais pobres combinados. Eles não ficaram ricos trabalhando — ficaram ricos fazendo o dinheiro trabalhar.",
    30: "Os 10 mais ricos do mundo possuem mais riqueza que os 3.5 bilhões mais pobres combinados. Eles não ficaram ricos trabalhando — ficaram ricos fazendo o dinheiro trabalhar. A regra número um dos ultra-ricos: nunca venda seus ativos. Eles pegam empréstimos usando suas ações como garantia. Assim, nunca pagam imposto sobre ganho de capital. É legal, é imoral, e é exatamente o que todos eles fazem.",
    60: "Os 10 mais ricos do mundo possuem mais riqueza que os 3.5 bilhões mais pobres combinados. Eles não ficaram ricos trabalhando — ficaram ricos fazendo o dinheiro trabalhar. A regra número um dos ultra-ricos: nunca venda seus ativos. Eles pegam empréstimos usando suas ações como garantia. Assim, nunca pagam imposto sobre ganho de capital. É legal, é imoral, e é exatamente o que todos eles fazem. Elon Musk pagou zero dólares em imposto de renda federal em 2018. Jeff Bezos pagou zero em 2007 e 2011. Enquanto isso, a taxa efetiva de impostos dos bilionários americanos é de apenas 8%, menos que a de um professor ou enfermeiro. Eles usam fundações filantrópicas para deduzir impostos, offshores para esconder patrimônio, e lobistas para escrever as leis que os beneficiam. O sistema não está quebrado — ele foi projetado assim.",
    90: "Os 10 mais ricos do mundo possuem mais riqueza que os 3.5 bilhões mais pobres combinados. Eles não ficaram ricos trabalhando — ficaram ricos fazendo o dinheiro trabalhar. A regra número um dos ultra-ricos: nunca venda seus ativos. Eles pegam empréstimos usando suas ações como garantia. Assim, nunca pagam imposto sobre ganho de capital. É legal, é imoral, e é exatamente o que todos eles fazem. Elon Musk pagou zero dólares em imposto de renda federal em 2018. Jeff Bezos pagou zero em 2007 e 2011. Enquanto isso, a taxa efetiva de impostos dos bilionários americanos é de apenas 8%, menos que a de um professor ou enfermeiro. Eles usam fundações filantrópicas para deduzir impostos, offshores para esconder patrimônio, e lobistas para escrever as leis que os beneficiam. O sistema não está quebrado — ele foi projetado assim. Mas o segredo mais sombrio é como eles controlam a narrativa. Cada bilionário tem uma mídia. Bezos comprou o Washington Post. Musk comprou o Twitter. Zuckerberg controla o que 3 bilhões de pessoas veem no Facebook e Instagram. Eles não apenas acumulam riqueza — eles controlam a informação. E quando você controla o que as pessoas sabem, você controla o que elas pensam. O mais assustador? A maioria das pessoas defende os bilionários achando que um dia serão como eles. É a maior ilusão já criada: fazer os pobres protegerem os interesses dos ricos. Enquanto você debate política nas redes sociais deles, eles multiplicam suas fortunas. Esse é o verdadeiro jogo.",
  },
  crimes: {
    15: "Em 1971, D.B. Cooper sequestrou um avião, recebeu 200 mil dólares de resgate, e pulou de paraquedas. Nunca foi encontrado. Até hoje, ninguém sabe quem ele era.",
    30: "Em 1971, D.B. Cooper sequestrou um avião, recebeu 200 mil dólares de resgate, e pulou de paraquedas numa noite tempestuosa. Nunca foi encontrado. O FBI investigou por 45 anos e encerrou o caso sem solução em 2016. É o único sequestro aéreo não resolvido na história dos EUA. Algumas notas do resgate apareceram num rio em 1980, mas Cooper desapareceu como um fantasma.",
    60: "Em 1971, D.B. Cooper sequestrou um avião, recebeu 200 mil dólares de resgate, e pulou de paraquedas numa noite tempestuosa. Nunca foi encontrado. O FBI investigou por 45 anos e encerrou o caso sem solução em 2016. É o único sequestro aéreo não resolvido na história dos EUA. Algumas notas do resgate apareceram num rio em 1980, mas Cooper desapareceu como um fantasma. Mas não é o único caso impossível. Jack, o Estripador, matou pelo menos 5 mulheres em Londres em 1888 e nunca foi identificado. Mais de 100 suspeitos foram investigados ao longo de 136 anos. Em 2019, um teste de DNA apontou um barbeiro polonês chamado Aaron Kosminski, mas a evidência é contestada. A verdade é que provavelmente nunca saberemos. O Zodíaco matou pelo menos 5 pessoas na Califórnia nos anos 60 e 70, enviava cartas codificadas à polícia, e zombava das autoridades. Um de seus códigos só foi decifrado em 2020, 51 anos depois.",
    90: "Em 1971, D.B. Cooper sequestrou um avião, recebeu 200 mil dólares de resgate, e pulou de paraquedas numa noite tempestuosa. Nunca foi encontrado. O FBI investigou por 45 anos e encerrou o caso sem solução em 2016. É o único sequestro aéreo não resolvido na história dos EUA. Algumas notas do resgate apareceram num rio em 1980, mas Cooper desapareceu como um fantasma. Mas não é o único caso impossível. Jack, o Estripador, matou pelo menos 5 mulheres em Londres em 1888 e nunca foi identificado. Mais de 100 suspeitos foram investigados ao longo de 136 anos. Em 2019, um teste de DNA apontou um barbeiro polonês chamado Aaron Kosminski, mas a evidência é contestada. A verdade é que provavelmente nunca saberemos. O Zodíaco matou pelo menos 5 pessoas na Califórnia nos anos 60 e 70, enviava cartas codificadas à polícia, e zombava das autoridades. Um de seus códigos só foi decifrado em 2020, 51 anos depois. E há o caso da família Sodder. Na noite de Natal de 1945, a casa da família pegou fogo na Virgínia Ocidental. Cinco das dez crianças desapareceram. Mas nunca encontraram restos mortais. A escada da família foi movida, a linha telefônica cortada, e o caminhão de bombeiros demorou 7 horas para chegar a um local a 3 quilômetros. Vinte anos depois, a família recebeu uma foto de um jovem com uma mensagem anônima. Até hoje, ninguém sabe o que aconteceu às crianças Sodder. Alguns crimes simplesmente não têm resposta, e talvez esse seja o fato mais perturbador de todos.",
  },
};

interface Props {
  language: string;
  onLanguageChange: (l: string) => void;
  theme: string;
  onThemeChange: (t: string) => void;
  scriptMode: "manual" | "ai";
  onScriptModeChange: (m: "manual" | "ai") => void;
  aiPrompt: string;
  onAiPromptChange: (p: string) => void;
  description: string;
  onDescriptionChange: (d: string) => void;
  duration: number;
}

const SectionScript = ({
  language, onLanguageChange,
  theme, onThemeChange,
  scriptMode, onScriptModeChange,
  aiPrompt, onAiPromptChange,
  description, onDescriptionChange,
  duration,
}: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const targetWords = wordsPerDuration[duration] || 70;

  const getDurationTier = (dur: number): number => {
    if (dur <= 15) return 15;
    if (dur <= 30) return 30;
    if (dur <= 60) return 60;
    return 80;
  };

  const handleGenerate = async () => {
    if (!theme) return;
    setIsGenerating(true);
    try {
      const script = await generateScript({
        prompt: aiPrompt,
        theme: themeLabels[theme] || theme,
        language,
        durationSeconds: duration,
      });
      onDescriptionChange(script);
    } catch {
      const tier = getDurationTier(duration);
      const themeScripts = sampleScripts[theme];
      const script = themeScripts?.[tier] || "Seu roteiro gerado por IA aparecerá aqui.";
      onDescriptionChange(script);
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = description.split(" ").filter(Boolean).length;
  const estimatedReadTime = Math.round(wordCount / 2.5);

  return (
    <div className="space-y-3">
      {/* Duration info badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium">
          Duração do vídeo: <strong>{duration}s</strong>
        </span>
        <span className="text-[10px] text-muted-foreground">
          (~{targetWords} palavras recomendadas)
        </span>
      </div>

      {/* Language */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Globe className="w-3 h-3" /> Idioma
        </label>
        <div className="flex gap-1 flex-wrap">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => onLanguageChange(l.id)}
              className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                language === l.id
                  ? "border-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Tema</label>
        <div className="grid grid-cols-2 gap-1.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium text-left transition-all ${
                theme === t.id
                  ? "border-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => onScriptModeChange("manual")}
          className={`flex-1 py-1.5 text-xs font-bold transition-all ${
            scriptMode === "manual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          ✍️ Escrever
        </button>
        <button
          onClick={() => onScriptModeChange("ai")}
          className={`flex-1 py-1.5 text-xs font-bold transition-all ${
            scriptMode === "ai" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          🤖 Gerar com IA
        </button>
      </div>

      {scriptMode === "ai" && (
        <div className="space-y-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => onAiPromptChange(e.target.value)}
            placeholder="Descreva o vídeo em poucas palavras..."
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !theme}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 hover:bg-primary/90 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Gerando roteiro para {duration}s...
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3" /> Gerar Roteiro ({duration}s)
              </>
            )}
          </button>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value.slice(0, 2000))}
        placeholder="Cole ou escreva seu roteiro aqui..."
        rows={6}
        className="w-full bg-muted/50 border border-border rounded-lg p-3 text-xs focus:outline-none focus:border-primary resize-none"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          {wordCount} palavras • ~{estimatedReadTime}s de leitura
          {estimatedReadTime > duration && (
            <span className="text-destructive ml-1">(excede {duration}s)</span>
          )}
          {estimatedReadTime < duration * 0.7 && wordCount > 0 && (
            <span className="text-amber-500 ml-1">(roteiro curto para {duration}s)</span>
          )}
        </span>
        <span>{description.length}/2000</span>
      </div>
    </div>
  );
};

export default SectionScript;
