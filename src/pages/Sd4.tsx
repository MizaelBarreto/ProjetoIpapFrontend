// Sd4.tsx
import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
const logoUrl = new URL("../assets/logo.png", import.meta.url).href;

type TipoPergunta = "radio" | "escala1a5" | "escala1a7" | "escala0a4" | "texto" | "big5" | "intro" | "numero";
type Pergunta = {
  key: string;
  texto: string;
  tipo: TipoPergunta;
  opcoes?: string[];
  instrucoes?: string;
  escalaOpcoes?: { valor: number; label: string }[];
};

const CHUNK_SIZE = 2; // duas perguntas por pop-up

const Sd4: React.FC = () => {
  const [resultado, setResultado] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState(0); // 0: termo, 1: dados pessoais, 2+: chunks
  const [mostrarTermoCompleto, setMostrarTermoCompleto] = useState(false);
  const [formData, setFormData] = useState({
    consent: false,
    nome: "",
    email: "",
    respostas: {} as Record<string, string | number>
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const menorIdadeMensagem = "Agradecemos sua participação! Esta pesquisa é destinada apenas a pessoas maiores de 18 anos.";

  // ---------------------------
  // Flat questions + intros (completo)
  // ---------------------------
  const flatQuestions: Pergunta[] = useMemo(() => {
    // Bloco de perguntas de substâncias (ASSIST)
    const substGroups: { key: string; name: string; codes: string[] }[] = [
      { key: "alcool", name: "Álcool", codes: ["Q1", "AA1", "AK1", "AU1", "BE1", "BO1"] },
      { key: "tabaco", name: "Tabaco", codes: ["P1", "Z1", "AJ1", "AT1", "BD1", "BN1"] },
      { key: "maconha", name: "Maconha", codes: ["R1", "AB1", "AL1", "AV1", "BF1", "BP1"] },
      { key: "cocaina", name: "Cocaína", codes: ["S1", "AC1", "AM1", "AW1", "BG1", "BQ1"] },
      { key: "anfetaminas", name: "Anfetaminas/êxtase", codes: ["T1", "AD1", "AN1", "AX1", "BH1", "BR1"] },
      { key: "inalantes", name: "Inalantes", codes: ["U1", "AE1", "AO1", "AY1", "BI1", "BS1"] },
      { key: "hipnoticos", name: "Hipnóticos/sedativos", codes: ["V1", "AF1", "AP1", "AZ1", "BJ1", "BT1"] },
      { key: "alucinogenos", name: "Alucinógenos", codes: ["W1", "AG1", "AQ1", "BA1", "BL1", "BU1"] },
      { key: "opioides", name: "Opioides", codes: ["X1", "AH1", "AR1", "BB1", "BM1", "BV1"] },
      { key: "injetavel", name: "Uso injetável", codes: ["BX1"] }
    ];
    const assistFrequenciaOpcoes: { valor: number; label: string }[] = [
      { valor: 0, label: "0 - Nunca" },
      { valor: 1, label: "1 - 1 ou 2 vezes" },
      { valor: 2, label: "2 - Mensalmente" },
      { valor: 3, label: "3 - Semanalmente" },
      { valor: 4, label: "4 - Diariamente ou quase todos os dias" }
    ];
    const assistPreocupacaoOpcoes: { valor: number; label: string }[] = [
      { valor: 0, label: "0 - Não, nunca" },
      { valor: 1, label: "1 - Sim, nos últimos 3 meses" },
      { valor: 2, label: "2 - Sim, mas não nos últimos 3 meses" }
    ];
    const freqLegenda = "Escala: 0 - Nunca; 1 - 1 ou 2 vezes; 2 - Mensalmente; 3 - Semanalmente; 4 - Diariamente ou quase todos os dias.";
    const preocupacaoLegenda = "Opções: 0 - Não, nunca; 1 - Sim, nos últimos 3 meses; 2 - Sim, mas não nos últimos 3 meses.";
    const substPerguntas: Pergunta[] = [];
    substGroups.forEach((g) => {
      g.codes.forEach((code, idx) => {
        if (g.key === "injetavel") {
          substPerguntas.push({
            key: code,
            texto: "Alguma vez você já usou drogas por injeção? (somente uso não prescrito pelo médico). " + preocupacaoLegenda,
            tipo: "escala0a4",
            escalaOpcoes: assistPreocupacaoOpcoes
          });
          return;
        }
        const textos = [
          `${g.name}: durante os três últimos meses, com que frequência você utilizou? ${freqLegenda}`,
          `Durante os três últimos meses, com que frequência você teve um forte desejo ou urgência em consumir ${g.name}? ${freqLegenda}`,
          `Durante os três últimos meses, com que frequência o seu consumo de ${g.name} resultou em problemas de saúde, sociais, legais ou financeiros? ${freqLegenda}`,
          `Durante os três últimos meses, com que frequência, por causa do uso de ${g.name}, você deixou de fazer coisas que eram normalmente esperadas de você? ${freqLegenda}`,
          `Há amigo, parente ou outra pessoa que tenha demonstrado preocupação com seu uso de ${g.name}? ${preocupacaoLegenda}`,
          `Alguma vez você já tentou controlar, diminuir ou parar o uso de ${g.name} e não conseguiu? ${preocupacaoLegenda}`
        ];
        const escalaOpcoes = idx <= 3 ? assistFrequenciaOpcoes : assistPreocupacaoOpcoes;
        substPerguntas.push({
          key: code,
          texto: textos[idx] || `${g.name} - questão ${idx + 1}`,
          tipo: "escala0a4",
          escalaOpcoes
        });
      });
    });

    const arr: Pergunta[] = [
      {
        key: "intro_linguagem",
        texto: "As palavras estão no gênero masculino apenas por convenção da língua. Responda considerando o gênero que se aplica a você.",
        tipo: "intro"
      },
      // Demografia
      {
        key: "idade",
        texto: "Idade (em anos completos)",
        tipo: "numero",
        instrucoes: "Digite apenas números. Caso informe ter menos de 18 anos, o questionário será encerrado automaticamente."
      },
      { key: "genero", texto: "Gênero com que se identifica", tipo: "radio", opcoes: ["Mulher", "Homem", "Não binário", "Prefiro não dizer", "Outro"] },

      { key: "cor", texto: "Cor", tipo: "radio", opcoes: ["Amarelo", "Branco", "Indígena", "Pardo", "Preto", "Outro"] },
      { key: "escolaridade", texto: "Nível educacional", tipo: "radio", opcoes: ["Ensino Médio cursando", "Ensino Médio completo", "Ensino Superior cursando", "Ensino Superior completo", "Outro"] },
      { key: "area", texto: "Se selecionado Ensino Superior, indique a área:", tipo: "texto" },
      { key: "estadoCivil", texto: "Estado civil", tipo: "radio", opcoes: ["Solteiro", "Casado", "Viúvo", "Outro"] },

      { key: "renda", texto: "Renda familiar mensal", tipo: "radio", opcoes: ["Até 1 salário mínimo (Até R$ 1412,00)", "De 1 a 3 salários mínimos (Até R$ 4236,00)", "De 3 a 5 salários mínimos (Até R$ 7.060,00)", "De 7 a 10 salários (Até R$ 14.120,00)", "Acima de 10 salários mínimos"] },
      { key: "diagnostico", texto: "Você já recebeu algum diagnóstico clínico psicológico, psiquiátrico ou neurológico?", tipo: "radio", opcoes: ["Sim", "Não"] },
      { key: "diagnosticoDetalhe", texto: "Se sim, qual?", tipo: "texto" },
      { key: "crime", texto: "Você já foi acusado de algum crime?", tipo: "radio", opcoes: ["Sim", "Não"] },
      { key: "crimeDetalhe", texto: "Se sim, qual?", tipo: "texto" },

      { key: "substancias", texto: "Você já usou alguma substância sem prescrição médica?", tipo: "radio", opcoes: ["Sim", "Não"], instrucoes: `Considere: derivados do tabaco; bebidas alcoólicas; maconha; cocaína; crack; anfetaminas/êxtase; inalantes; hipnóticos/sedativos; alucinógenos; opioides; uso injetável.` },
      { key: "substanciasSelecionadas", texto: "Se sim, selecione as substâncias usadas (marque todas)", tipo: "radio" },
      // Bloco condicional de substâncias (ASSIST)
      ...substPerguntas,
      // Campo de outras substâncias (após seleção e blocos ASSIST)
      { key: "outrasSubstanciasDetalhe", texto: "Outras (especificar)", tipo: "texto" },

      // Intro: escala 1-5
      {
        key: "intro_1_5",
        texto:
          "Agora, responda o quanto você concorda ou não com o que está escrito nas próximas frases, considerando o que você pensa ou como age. Use a escala: 1 - Discordo totalmente; 2 - Discordo; 3 - Não concordo nem discordo; 4 - Concordo; 5 - Concordo totalmente.",
        tipo: "intro"
      },

      // Escala 1-5 (q1 - q28)
      { key: "q1", texto: "1. Não acho inteligente deixar as pessoas conhecerem os meus segredos.", tipo: "escala1a5" },
      { key: "q2", texto: "2. Acredito que as pessoas devem fazer o que for preciso para ganhar o apoio de pessoas importantes.", tipo: "escala1a5" },
      { key: "q3", texto: "3. Evito conflito direto com as pessoas porque elas podem me ser úteis no futuro.", tipo: "escala1a5" },
      { key: "q4", texto: "4. Acho que as pessoas devem se manter reservadas se quiserem alcançar seus objetivos.", tipo: "escala1a5" },

      { key: "q5", texto: "5. Acredito que para manipular uma situação é necessário planejamento.", tipo: "escala1a5" },
      { key: "q6", texto: "6. Bajulação é uma boa maneira de conquistar as pessoas para o seu lado.", tipo: "escala1a5" },
      { key: "q7", texto: "7. Adoro quando um plano feito com 'jeitinho' tem sucesso.", tipo: "escala1a5" },
      { key: "q8", texto: "8. As pessoas me veem como uma pessoa que lidera com facilidade.", tipo: "escala1a5" },

      { key: "q9", texto: "9. Eu tenho um talento para convencer as pessoas.", tipo: "escala1a5" },
      { key: "q10", texto: "10. Atividades em grupo geralmente são chatas se eu não estiver presente.", tipo: "escala1a5" },
      { key: "q11", texto: "11. Sei que sou especial porque as pessoas sempre me dizem isso.", tipo: "escala1a5" },
      { key: "q12", texto: "12. Tenho algumas qualidades extraordinárias.", tipo: "escala1a5" },

      { key: "q13", texto: "13. É provável que no futuro eu seja famoso em alguma área.", tipo: "escala1a5" },
      { key: "q14", texto: "14. Gosto de me exibir de vez em quando.", tipo: "escala1a5" },
      { key: "q15", texto: "15. As pessoas frequentemente dizem que eu estou descontrolado.", tipo: "escala1a5" },
      { key: "q16", texto: "16. Tenho a tendência de bater de frente com as autoridades, desrespeitando suas regras.", tipo: "escala1a5" },

      { key: "q17", texto: "17. Já me envolvi em mais conflitos do que a maioria das pessoas da minha idade e gênero.", tipo: "escala1a5" },
      { key: "q18", texto: "18. Eu tenho a tendência de fazer primeiro e pensar depois.", tipo: "escala1a5" },
      { key: "q19", texto: "19. Já tive problemas com a justiça.", tipo: "escala1a5" },
      { key: "q20", texto: "20. Às vezes, me envolvo em situações perigosas.", tipo: "escala1a5" },

      { key: "q21", texto: "21. As pessoas que me causam problemas sempre se arrependem.", tipo: "escala1a5" },
      { key: "q22", texto: "22. Gosto de assistir uma briga de rua.", tipo: "escala1a5" },
      { key: "q23", texto: "23. Gosto muito de assistir filmes e esportes violentos.", tipo: "escala1a5" },
      { key: "q24", texto: "24. Acho engraçado quando pessoas babacas se dão mal.", tipo: "escala1a5" },

      { key: "q25", texto: "25. Gosto de jogar videogames/jogos violentos.", tipo: "escala1a5" },
      { key: "q26", texto: "26. Acho que algumas pessoas merecem sofrer.", tipo: "escala1a5" },
      { key: "q27", texto: "27. Já disse coisas maldosas na internet só por diversão.", tipo: "escala1a5" },
      { key: "q28", texto: "28. Sei como machucar as pessoas somente com palavras.", tipo: "escala1a5" },

      // Intro: escala 1-7
      {
        key: "intro_1_7",
        texto: "Por favor, avalie sua concordância usando a escala: 1 - Discordo totalmente; 7 - Concordo totalmente.",
        tipo: "intro",
      },

      // Escala 1-7 (q7_1..q7_18)
      { key: "q7_1", texto: "1. Fui propositalmente maldoso(a) com outras pessoas no Ensino Médio.", tipo: "escala1a7" },
      { key: "q7_2", texto: "2. Gosto de machucar fisicamente as pessoas", tipo: "escala1a7" },
      { key: "q7_3", texto: "3. Já dominei outras pessoas usando medo.", tipo: "escala1a7" },
      { key: "q7_4", texto: "4. Às vezes dou replay (repito) em minhas cenas favoritas de filmes sangrentos de terror.", tipo: "escala1a7" },

      { key: "q7_5", texto: "5. Gosto de fazer piadas às custas dos outros.", tipo: "escala1a7" },
      { key: "q7_6", texto: "6. Em jogos de videogame, gosto do realismo dos jorros de sangue.", tipo: "escala1a7" },
      { key: "q7_7", texto: "7. Já enganei alguém e ri quando pareceram tolos.", tipo: "escala1a7" },
      { key: "q7_8", texto: "8. Gosto de atormentar pessoas.", tipo: "escala1a7" },

      { key: "q7_9", texto: "9. Gosto de assistir lutas de ringue (e.g. MMA, UFC), nas quais os lutadores não têm por onde escapar.", tipo: "escala1a7" },
      { key: "q7_10", texto: "10. Eu gosto de machucar (ou fingir que vou machucar) meu parceiro(a) durante o sexo.", tipo: "escala1a7" },
      { key: "q7_11", texto: "11. Eu gosto de ter o papel de vilão em jogos e torturar os outros personagens.", tipo: "escala1a7" },
      { key: "q7_12", texto: "12. Quando tiro sarro de alguém, acho especialmente divertido se eles percebem o que estou fazendo.", tipo: "escala1a7" },

      { key: "q7_13", texto: "13. Em corridas profissionais de carros, os acidentes são as partes que eu mais gosto.", tipo: "escala1a7" },
      { key: "q7_14", texto: "14. Talvez eu não deveria, mas nunca me canso de zombar de alguns colegas.", tipo: "escala1a7" },
      { key: "q7_15", texto: "15. Eu jamais humilharia alguém de propósito.", tipo: "escala1a7" },
      { key: "q7_16", texto: "16. Eu tenho o direito de empurrar as pessoas.", tipo: "escala1a7" },

      { key: "q7_17", texto: "17. Adoro assistir vídeos na internet (por exemplo, Youtube, facebook) de pessoas brigando.", tipo: "escala1a7" },
      { key: "q7_18", texto: "18. Esportes são violentos demais.", tipo: "escala1a7" },

      // Intro: escala 0-4
      {
        key: "intro_0_4",
        texto:
          "Abaixo há uma lista de afirmações. Por favor, leia cada uma e decida o quanto cada item se assemelha a você e assinale um dos valores, de zero a quatro. Seja sincero(a) e responda como “você é” e não como “gostaria de ser” ou como “as pessoas acham que você é”. Não há respostas certas ou erradas. Escala: 0 - Nada a ver comigo; 1 - Um pouco a ver comigo; 2 - Mais ou menos a ver comigo; 3 - Muito a ver comigo; 4 - Tudo a ver comigo.",
        tipo: "intro"
      },

      // Escala 0-4 (q0_1..q0_18)
      { key: "q0_1", texto: "1. Sei o que fazer para que as pessoas se sintam bem.", tipo: "escala0a4" },
      { key: "q0_2", texto: "2. Sou competente para analisar problemas por diferentes ângulos.", tipo: "escala0a4" },
      { key: "q0_3", texto: "3. Coisas boas me aguardam no futuro.", tipo: "escala0a4" },
      { key: "q0_4", texto: "4. Consigo encontrar em minha vida motivos para ser grato(a).", tipo: "escala0a4" },

      { key: "q0_5", texto: "5. Acredito em uma força sagrada que nos liga um ao outro.", tipo: "escala0a4" },
      { key: "q0_6", texto: "6. Crio coisas úteis.", tipo: "escala0a4" },
      { key: "q0_7", texto: "7. Sou uma pessoa verdadeira.", tipo: "escala0a4" },
      { key: "q0_8", texto: "8. Consigo criar um bom ambiente nos grupos em que trabalho.", tipo: "escala0a4" },

      { key: "q0_9", texto: "9. Enfrento perigos para fazer o bem.", tipo: "escala0a4" },
      { key: "q0_10", texto: "10. Sei admirar a beleza que existe no mundo.", tipo: "escala0a4" },
      { key: "q0_11", texto: "11. Não perco as oportunidades que tenho para aprender coisas novas.", tipo: "escala0a4" },
      { key: "q0_12", texto: "12. Sou uma pessoa que tem humildade.", tipo: "escala0a4" },

      { key: "q0_13", texto: "13. Eu me sinto cheio(a) de vida.", tipo: "escala0a4" },
      { key: "q0_14", texto: "14. Tenho facilidade para organizar trabalhos em grupos.", tipo: "escala0a4" },
      { key: "q0_15", texto: "15. Consigo ajudar pessoas a se entenderem quando há uma discussão.", tipo: "escala0a4" },
      { key: "q0_16", texto: "16. Tenho facilidade para fazer uma situação chata se tornar divertida.", tipo: "escala0a4" },

      { key: "q0_17", texto: "17. Costumo tomar decisões quando estou ciente das consequências dos meus atos.", tipo: "escala0a4" },
      { key: "q0_18", texto: "18. Sou uma pessoa justa.", tipo: "escala0a4" },

      // Intro: Big Five short (legend shown in each option)
      {
        key: "intro_big5",
        texto:
          "Leia as novas instruções e responda às questões abaixo: a seguir encontram-se algumas características que podem ou não lhe dizer respeito. Por favor, escolha um dos números na escala abaixo que melhor expresse sua opinião em relação a você mesmo. Vale ressaltar que não existem respostas certas ou erradas. Utilize a seguinte escala de resposta: 1 - Discordo totalmente; 2 - Discordo em parte; 3 - Nem concordo nem discordo; 4 - Concordo em parte; 5 - Concordo totalmente.",
        tipo: "intro"
      },

      // Big5 short (big1..big10)
      {
        key: "big1",
        texto: "1. É conversador, comunicativo.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big2",
        texto: "2. Gosta de cooperar com os outros.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big3",
        texto: "3. É original, tem sempre novas ideias.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big4",
        texto: "4. É inventivo, criativo.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big5",
        texto: "5. É prestativo e ajuda os outros.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big6",
        texto: "6. Faço as coisas com eficiência.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big7",
        texto: "7. É sociável, extrovertido.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big8",
        texto: "8. É um trabalhador de confiança.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big9",
        texto: "9. Fica tenso com frequência.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big10",
        texto: "10. Fica nervoso facilmente.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },

      // Final placeholder text
      { key: "final_text", texto: "Pop up final: explicação e resultados (seria calculado no backend). Obrigado por participar!", tipo: "texto" }
    ];
    return arr;
  }, []);

  // ---------------------------
  // chunking helper
  // ---------------------------
  const chunkArray = (arr: Pergunta[], size: number) => {
    const out: Pergunta[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      out.push(arr.slice(i, i + size));
    }
    return out;
  };

  const questionChunks = useMemo(() => {
  const chunks: Pergunta[][] = [];
  let buffer: Pergunta[] = [];

  flatQuestions.forEach((q) => {
    if (q.tipo === "intro") {
      // flush buffer se tiver algo acumulado
      if (buffer.length > 0) {
        chunks.push(buffer);
        buffer = [];
      }
      // intro sempre sozinho
      chunks.push([q]);
    } else {
      buffer.push(q);
      if (buffer.length >= CHUNK_SIZE) {
        chunks.push(buffer);
        buffer = [];
      }
    }
  });

  if (buffer.length > 0) chunks.push(buffer);

  return chunks;
}, [flatQuestions]);

  // etapas: [[], []] reserved for termo (0) e dados pessoais (1)
  const etapas = useMemo(() => {
    const base: Pergunta[][] = [[], []];
    return base.concat(questionChunks).concat([[]]); // passo extra reservado para a tela final de envio
  }, [questionChunks]);

  // ---------------------------
  // utility: visibility conditions
  // ---------------------------
  const SUBST_CODES_SET = useMemo(() => new Set<string>([
    "Q1","AA1","AK1","AU1","BE1","BO1",
    "P1","Z1","AJ1","AT1","BD1","BN1",
    "R1","AB1","AL1","AV1","BF1","BP1",
    "S1","AC1","AM1","AW1","BG1","BQ1",
    "T1","AD1","AN1","AX1","BH1","BR1",
    "U1","AE1","AO1","AY1","BI1","BS1",
    "V1","AF1","AP1","AZ1","BJ1","BT1",
    "W1","AG1","AQ1","BA1","BL1","BU1",
    "X1","AH1","AR1","BB1","BM1","BV1",
    "BX1"
  ]), []);

  const isQuestionVisible = (q: Pergunta): boolean => {
    const r = formData.respostas;
    switch (q.key) {
      case "area":
        return (r["escolaridade"] || "").toString().includes("Ensino Superior");
      case "diagnosticoDetalhe":
        return r["diagnostico"] === "Sim";
      case "crimeDetalhe":
        return r["crime"] === "Sim";
      case "substanciasSelecionadas":
        return r["substancias"] === "Sim";
      case "outrasSubstanciasDetalhe": {
        if (r["substancias"] !== "Sim") return false;
        const sel = r["substanciasSelecionadas"] as any;
        const arr: string[] = Array.isArray(sel) ? sel : [];
        return arr.includes("outras");
      }
      default:
        // Quest├Áes de substâncias vis├¡veis apenas se marcado "Sim"
        if (SUBST_CODES_SET.has(q.key)) {
          if (r["substancias"] !== "Sim") return false;
          const selRaw = r["substanciasSelecionadas"] as any;
          const selected: string[] = Array.isArray(selRaw) ? selRaw : [];
          const codeGroupMap: Record<string, string> = {
            Q1: "alcool", AA1: "alcool", AK1: "alcool", AU1: "alcool", BE1: "alcool", BO1: "alcool",
            P1: "tabaco", Z1: "tabaco", AJ1: "tabaco", AT1: "tabaco", BD1: "tabaco", BN1: "tabaco",
            R1: "maconha", AB1: "maconha", AL1: "maconha", AV1: "maconha", BF1: "maconha", BP1: "maconha",
            S1: "cocaina", AC1: "cocaina", AM1: "cocaina", AW1: "cocaina", BG1: "cocaina", BQ1: "cocaina",
            T1: "anfetaminas", AD1: "anfetaminas", AN1: "anfetaminas", AX1: "anfetaminas", BH1: "anfetaminas", BR1: "anfetaminas",
            U1: "inalantes", AE1: "inalantes", AO1: "inalantes", AY1: "inalantes", BI1: "inalantes", BS1: "inalantes",
            V1: "hipnoticos", AF1: "hipnoticos", AP1: "hipnoticos", AZ1: "hipnoticos", BJ1: "hipnoticos", BT1: "hipnoticos",
            W1: "alucinogenos", AG1: "alucinogenos", AQ1: "alucinogenos", BA1: "alucinogenos", BL1: "alucinogenos", BU1: "alucinogenos",
            X1: "opioides", AH1: "opioides", AR1: "opioides", BB1: "opioides", BM1: "opioides", BV1: "opioides",
            BX1: "injetavel",
          } as any;
          const grp = (codeGroupMap as any)[q.key] || "";
          if (!grp) return false;
          if (selected.length === 0) return false;
          return selected.includes(grp);
        }
        return true;
    }
  };

  // ---------------------------
  // skip empty step (caused by conditionals) automatically
  // ---------------------------
  useEffect(() => {
    if (!showPopup) return;
    // when step changes, if it's a question step (>=2) but all questions are invisible, advance
    let s = step;
    const max = etapas.length - 1;
    let safety = 0;
    while (s >= 2 && s <= max) {
      const visible = (etapas[s] || []).some((q) => isQuestionVisible(q));
      if (!visible && s < max) {
        s++;
      } else break;
      safety++;
      if (safety > etapas.length) break;
    }
    if (s !== step) setStep(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, formData, showPopup]);

  // ---------------------------
  // validation per step
  // ---------------------------
  const validarEtapaAtual = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0 && !formData.consent) {
      newErrors.consent = "Você precisa aceitar o termo para continuar.";
    }
    // validate visible questions in this step
    const perguntas = etapas[step] || [];
    for (const q of perguntas) {
      if (!isQuestionVisible(q)) continue;
      if (q.tipo === "intro") continue;
      const resp = formData.respostas[q.key];
      if (q.key === "substanciasSelecionadas" && formData.respostas["substancias"] === "Sim") {
        const arr = resp as any;
        if (!Array.isArray(arr) || arr.length === 0) newErrors[q.key] = "Selecione pelo menos uma substância.";
        continue;
      }
      if (q.tipo === "numero") {
        if (resp === undefined || resp === "") {
          newErrors[q.key] = "Informe um número.";
        }
        continue;
      }
      if (q.tipo === "texto") {
        // only certain text fields are required when visible
        if (q.key === "area" && (formData.respostas["escolaridade"] || "").toString().includes("Ensino Superior")) {
          if (!resp || (resp as string).trim() === "") newErrors[q.key] = "Informe a área de formação.";
        }
        if (q.key === "diagnosticoDetalhe" && formData.respostas["diagnostico"] === "Sim") {
          if (!resp || (resp as string).trim() === "") newErrors[q.key] = "Informe o diagnóstico.";
        }
        if (q.key === "crimeDetalhe" && formData.respostas["crime"] === "Sim") {
          if (!resp || (resp as string).trim() === "") newErrors[q.key] = "Informe o tipo de acusação.";
        }
        if (q.key === "outrasSubstanciasDetalhe" && formData.respostas["substancias"] === "Sim") {
          const sel = formData.respostas["substanciasSelecionadas"] as any;
          const arr: string[] = Array.isArray(sel) ? sel : [];
          if (arr.includes("outras")) {
            if (!resp || (resp as string).trim() === "") newErrors[q.key] = "Especifique a(s) substância(s).";
          }
        }
      } else {
        // radio / escala: required
        if (resp === undefined || resp === "") {
          newErrors[q.key] = "Selecione uma opção.";
        }
      }
      // caso "Outro:" sem texto (Não usado generically here, but safe)
      if (typeof resp === "string" && resp.startsWith("Outro:") && resp === "Outro:") {
        newErrors[q.key] = "Preencha o campo 'Outro'.";
      }
    }

    // Checagem específica: idade menor que 18 encerra o questionário com mensagem
    const idadeResp = formData.respostas["idade"];
    const idadeNum = typeof idadeResp === "number" ? idadeResp : Number(idadeResp);
    if (idadeResp !== undefined && Number.isFinite(idadeNum) && idadeNum < 18) {
      setResultado({ summaryText: menorIdadeMensagem });
      handleClosePopup();
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // handlers
  // ---------------------------
  const handleOpenPopup = () => {
    setResultado(null);
    setShowPopup(true);
    setStep(0);
    setErrors({});
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setStep(0);
    setFormData({ consent: false, nome: "", email: "", respostas: {} });
    setErrors({});
    setMostrarTermoCompleto(false);
  };

  const handleNext = () => {
    if (!validarEtapaAtual()) return;
    setStep((s) => Math.min(s + 1, etapas.length - 1));
    setErrors({});
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  };

  const handleResposta = (key: string, value: string | number) => {
    if (key === "idade") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, respostas: { ...prev.respostas, [key]: "" } }));
      } else {
        const numeric = typeof value === "number" ? value : Number(value);
        if (Number.isFinite(numeric)) {
          setFormData((prev) => ({ ...prev, respostas: { ...prev.respostas, [key]: numeric } }));
        }
      }
      setErrors((e) => {
        const copy = { ...e };
        delete copy[key];
        return copy;
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      respostas: { ...prev.respostas, [key]: value }
    }));
    setErrors((e) => {
      const copy = { ...e };
      delete copy[key];
      return copy;
    });
  };

  const escala1a5Default: { valor: number; label: string }[] = [
    { valor: 1, label: "1 - Discordo totalmente" },
    { valor: 2, label: "2 - Discordo" },
    { valor: 3, label: "3 - Não concordo nem discordo" },
    { valor: 4, label: "4 - Concordo" },
    { valor: 5, label: "5 - Concordo totalmente" }
  ];
  const escala1a7Default: { valor: number; label: string }[] = [
    { valor: 1, label: "1 - Discordo totalmente" },
    { valor: 2, label: "2 - Discordo" },
    { valor: 3, label: "3 - Discordo em parte" },
    { valor: 4, label: "4 - Nem concordo nem discordo" },
    { valor: 5, label: "5 - Concordo em parte" },
    { valor: 6, label: "6 - Concordo" },
    { valor: 7, label: "7 - Concordo totalmente" }
  ];
  const escala0a4Default: { valor: number; label: string }[] = [
    { valor: 0, label: "0 - Nada a ver comigo" },
    { valor: 1, label: "1 - Um pouco a ver comigo" },
    { valor: 2, label: "2 - Mais ou menos a ver comigo" },
    { valor: 3, label: "3 - Muito a ver comigo" },
    { valor: 4, label: "4 - Tudo a ver comigo" }
  ];

  // ---------------------------
  // render individual pergunta
  // ---------------------------
  const renderPergunta = (q: Pergunta) => {
    if (!isQuestionVisible(q)) return null;
    const resp = formData.respostas[q.key];
    const escala1a5Opcoes = q.escalaOpcoes || escala1a5Default;
    const escala1a7Opcoes = q.escalaOpcoes || escala1a7Default;
    const escala0a4Opcoes = q.escalaOpcoes || escala0a4Default;

    // Filtro adicional: itens de substâncias só aparecem se grupo correspondente estiver selecionado
    if (SUBST_CODES_SET.has(q.key)) {
      const used = formData.respostas["substancias"] === "Sim";
      if (!used) return null;
      const selRaw = formData.respostas["substanciasSelecionadas"] as any;
      const selected: string[] = Array.isArray(selRaw) ? selRaw : [];
      if (selected.length > 0) {
        const codeGroupMap: Record<string, string> = {
          Q1: "alcool", AA1: "alcool", AK1: "alcool", AU1: "alcool", BE1: "alcool", BO1: "alcool",
          P1: "tabaco", Z1: "tabaco", AJ1: "tabaco", AT1: "tabaco", BD1: "tabaco", BN1: "tabaco",
          R1: "maconha", AB1: "maconha", AL1: "maconha", AV1: "maconha", BF1: "maconha", BP1: "maconha",
          S1: "cocaina", AC1: "cocaina", AM1: "cocaina", AW1: "cocaina", BG1: "cocaina", BQ1: "cocaina",
          T1: "anfetaminas", AD1: "anfetaminas", AN1: "anfetaminas", AX1: "anfetaminas", BH1: "anfetaminas", BR1: "anfetaminas",
          U1: "inalantes", AE1: "inalantes", AO1: "inalantes", AY1: "inalantes", BI1: "inalantes", BS1: "inalantes",
          V1: "hipnoticos", AF1: "hipnoticos", AP1: "hipnoticos", AZ1: "hipnoticos", BJ1: "hipnoticos", BT1: "hipnoticos",
          W1: "alucinogenos", AG1: "alucinogenos", AQ1: "alucinogenos", BA1: "alucinogenos", BL1: "alucinogenos", BU1: "alucinogenos",
          X1: "opioides", AH1: "opioides", AR1: "opioides", BB1: "opioides", BM1: "opioides", BV1: "opioides",
          BX1: "injetavel",
        } as any;
        const grp = (codeGroupMap as any)[q.key] || "";
        if (grp && !selected.includes(grp)) return null;
      }
    }

    // intro screen
    if (q.tipo === "intro") {
      return (
        <div key={q.key} style={{ padding: 8 }}>
          <h3>Instruções</h3>
          <p style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>{q.texto}</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>Começar seção</button>
          </div>
        </div>
      );
    }

    // visual for question
    return (
      <div key={q.key} style={{ marginBottom: 12, padding: 6 }}>
        {q.instrucoes && <p style={{ fontSize: 13, color: "#444" }}>{q.instrucoes}</p>}
        <div style={{ marginBottom: 6 }}><strong>{q.texto}</strong></div>

        {/* multiseleção de substâncias (checkboxes) */}
        {q.key === "substanciasSelecionadas" && formData.respostas["substancias"] === "Sim" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { key: "alcool", label: "Álcool" },
              { key: "tabaco", label: "Tabaco" },
              { key: "maconha", label: "Maconha" },
              { key: "cocaina", label: "Cocaína" },
              { key: "anfetaminas", label: "Anfetaminas/êxtase" },
              { key: "inalantes", label: "Inalantes" },
              { key: "hipnoticos", label: "Hipnóticos/sedativos" },
              { key: "alucinogenos", label: "Alucinógenos" },
              { key: "opioides", label: "Opioides" },
              { key: "injetavel", label: "Uso injetável" },
              { key: "outras", label: "Outras" },
            ].map((g) => {
              const selRaw = formData.respostas["substanciasSelecionadas"] as any;
              const selected: string[] = Array.isArray(selRaw) ? selRaw : [];
              const checked = selected.includes(g.key);
              return (
                <label key={g.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "4px 0" }}>
                  <span>{g.label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = new Set<string>(selected);
                      if (e.target.checked) next.add(g.key); else next.delete(g.key);
                      setFormData((prev) => ({ ...prev, respostas: { ...prev.respostas, substanciasSelecionadas: Array.from(next) } }));
                    }}
                  />
                </label>
              );
            })}
            {errors["substanciasSelecionadas"] && <div style={{ color: "crimson", marginTop: 6 }}>{errors["substanciasSelecionadas"]}</div>}
          </div>
        )}
        
        {/* radio padrão */}
        {q.tipo === "radio" && q.opcoes && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.opcoes.map((op) => (
              <label
                key={op}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "2px 0",
                  textAlign: "left"
                }}
              >
                <input
                  type="radio"
                  name={q.key}
                  value={op}
                  checked={resp === op}
                  onChange={() => handleResposta(q.key, op)}
                />
                <span>{op}</span>
              </label>
            ))}
          </div>
        )}

        {/* campo numérico */}
        {q.tipo === "numero" && (
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            placeholder="Digite sua idade"
            value={(formData.respostas[q.key] as number | string | undefined) ?? ""}
            onChange={(e) => handleResposta(q.key, e.target.value === "" ? "" : Number(e.target.value))}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", ".", ","].includes(e.key)) e.preventDefault();
            }}
            style={{ width: "100%", padding: 6, marginTop: 6 }}
          />
        )}

        {/* escala 1-5 */}
        {q.tipo === "escala1a5" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 8,
              marginTop: 6,
              alignItems: "center",
              justifyItems: "start"
            }}
          >
            {escala1a5Opcoes.map(({ valor, label }) => (
              <label key={valor} style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
                <input
                  type="radio"
                  name={q.key}
                  value={valor}
                  checked={resp === valor}
                  onChange={() => handleResposta(q.key, valor)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}

        {/* escala 1-7 */}
        {q.tipo === "escala1a7" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 8,
              marginTop: 6,
              alignItems: "center",
              justifyItems: "start"
            }}
          >
            {escala1a7Opcoes.map(({ valor, label }) => (
              <label key={valor} style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
                <input
                  type="radio"
                  name={q.key}
                  value={valor}
                  checked={resp === valor}
                  onChange={() => handleResposta(q.key, valor)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}

        {/* escala 0-4 */}
        {q.tipo === "escala0a4" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 8,
              marginTop: 6,
              alignItems: "center",
              justifyItems: "start"
            }}
          >
            {escala0a4Opcoes.map(({ valor, label }) => (
              <label key={valor} style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
                <input
                  type="radio"
                  name={q.key}
                  value={valor}
                  checked={resp === valor}
                  onChange={() => handleResposta(q.key, valor)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Big Five horizontal */}
        {q.tipo === "big5" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 8,
              marginTop: 6,
              alignItems: "center",
              justifyItems: "start"
            }}
          >
            {(q.escalaOpcoes || escala1a5Default).map(({ valor, label }) => (
              <label key={valor} style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
                <input
                  type="radio"
                  name={q.key}
                  value={valor}
                  checked={resp === valor}
                  onChange={() => handleResposta(q.key, valor)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}


        {/* texto */}
        {q.tipo === "texto" && (
          <input
            type="text"
            placeholder="Digite aqui"
            value={(formData.respostas[q.key] as string) || ""}
            onChange={(e) => handleResposta(q.key, e.target.value)}
            style={{ width: "100%", padding: 6, marginTop: 6 }}
          />
        )}

        {errors[q.key] && <div style={{ color: "crimson", marginTop: 6 }}>{errors[q.key]}</div>}
      </div>
    );
  };

  // ---------------------------
  // handle submit (final)
  // ---------------------------
  const handleSubmit = async () => {
    // validate last step too
    if (!validarEtapaAtual()) return;

    const payload = {
      consent: formData.consent,
      nome: formData.nome,
      email: formData.email,
      respostas: formData.respostas
    };

    try {
      const res = await fetch("https://projeto-ipap-backend.vercel.app/api/sd4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const txt = await res.text();
        alert("Erro no servidor: " + txt);
        return;
      }
      const data = await res.json();
      setResultado(data);
      handleClosePopup();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar respostas. Verifique a conexão com o backend.");
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="sd4-wrapper">
      <img src={logoUrl} alt="Logo" className="logo-centered" />
      <h1 className="sd4-title">Quais fatores influenciam o seu jeito de ser e viver?</h1>
      <p className="sd4-text" style={{ textAlign: "justify" }}>
        Este conjunto de questionários utiliza métricas científicas para compreender diferentes aspectos da sua personalidade, hábitos e estilo de vida — incluindo
        tanto seus recursos pessoais quanto possíveis vulnerabilidades. Suas respostas são totalmente anônimas e serão usadas apenas para fins de pesquisa. O tempo
        médio de resposta é de 25 minutos.
      </p>
      <button className="sd4-button" onClick={handleOpenPopup}>Quero descobrir o que há por trás de meu jeito de viver</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box" style={{ maxWidth: 520, width: "95%" }}>
            {/* Step 0: Termo */}
            {step === 0 && (
              <>
                <h2>Termo de Consentimento</h2>
                <div style={{ maxHeight: "40vh", overflowY: "auto", paddingRight: 8, textAlign: "justify", lineHeight: 1.5 }}>
                  {!mostrarTermoCompleto ? (
                    <>
                      <p>
                      Você está sendo convidado(a) a participar, como voluntário(a), de uma pesquisa sobre diferentes formas de pensar, sentir e agir no dia a dia e uso de álcool e outras substâncias, sob a responsabilidade da Psicóloga Profa. Dra. Ana Cristina Resende (CRP 09/2113), vinculada à PUC Goiás. Após receber os esclarecimentos e as informações a seguir, no caso de aceitar fazer parte do estudo, favor escolher a opção CONCORDO. Caso os resultados desta pesquisa sejam divulgados, a sua identidade não será revelada.
                    </p>

                    <p>
                      O objetivo do nosso estudo é a adaptação de uma medida com propriedades científicas adequadas para avaliar características da personalidade no contexto brasileiro para pessoas adultas. Este estudo é realizado online através de um formulário com uma série de perguntas objetivas, que deve durar aproximadamente 25 minutos para concluí-lo, sendo garantidas a segurança e a privacidade das suas informações. Sua participação é anônima, ou seja, não pediremos seu nome nem dados como CPF ou identidade.
                    </p>

                    <p>
                      Nossa equipe de pesquisadores é composta pelo doutorando Tharmes Chiodarelli C. dos Santos, pela mestranda Cristina Damasceno e pelas graduandas Thais Rodrigues do Nascimento Soares, Emanuelle Lima Ramos, Jaciara Chaves dos Reis, Luísa Libaroni Artiaga, Marcella Martins Dell Isola e Beatriz Mendes de Souza.
                    </p>

                    <p>
                      Em caso de qualquer dúvida sobre a pesquisa, você poderá entrar em contato com os pesquisadores ou com o Comitê de Ética em Pesquisa com Seres Humanos da Pontifícia Universidade Católica de Goiás (CEP - PUC Goiás): Doutorando Tharmes Chiodarelli Cambuava dos Santos, (61) 98231-6827, e-mail tharmes24dp@gmail.com; Mestranda Cristina Damasceno, (62) 98589-0186, e-mail cristinadge@gmail.com; Pesquisadora responsável Profa. Dra. Ana Cristina Resende, (62) 99137-0535, e-mail cristina.psi@pucgoias.edu.br.
                    </p>

                    <p>
                      Pontifícia Universidade Católica de Goiás — Av. Universitária, 1.440, Setor Universitário, CEP: 74605-010 - Goiânia, Goiás. Comitê de Ética em Pesquisa (CEP): (62) 3946-1512, e-mail cep@pucgoias.edu.br, Av. Universitária, 1069, Setor Universitário, Goiânia/GO. Funcionamento: das 08h às 17h, de segunda-feira a sexta-feira.
                    </p>

                    <p>
                      Riscos e benefícios: Este estudo possui riscos mínimos para os participantes, pois é possível que algumas perguntas do questionário possam causar algum desconforto ou constrangimento, ou que você se canse. Caso você se sinta desconfortável, poderá desistir de participar da pesquisa a qualquer momento, sem nenhum prejuízo ou penalidade. Se preciso for, os pesquisadores estão prontos para dar mais informações e apoio psicológico. Sua participação é voluntária e não há pagamento nem custo para você. Se houver algum dano decorrente de sua participação no estudo, você terá direito a uma indenização.
                    </p>

                    <p>
                      Sua ajuda é muito importante para entendermos mais sobre como as pessoas tendem a pensar, sentir e agir. As informações que você fornecer serão usadas somente para esta pesquisa e para estudos futuros relacionados. Os resultados ajudarão em relatórios científicos e outras publicações.
                    </p>

                    <p>
                      Como parte do processo científico, este estudo também avaliará a estabilidade das respostas ao longo do tempo. Por esse motivo, você poderá ser contatado(a) novamente dentro de um prazo de 30 dias para responder a um dos questionários já aplicados. Essa segunda participação também é totalmente voluntária, anônima e com duração de 5 minutos.
                    </p>

                    <p>
                      O aceite do presente Termo de Consentimento Livre e Esclarecido significa que você concorda com a participação voluntária na pesquisa e autoriza a coleta dos dados para fins científicos. Você também declara que foi informado(a) sobre os objetivos e os procedimentos desta pesquisa de forma clara e detalhada.
                    </p>

                    <div style={{ marginTop: 8 }}>
                      <button className="btn-link" onClick={() => setMostrarTermoCompleto(true)}>Ler mais</button>
                    </div>

                    </>
                    ) : (
                    <div>
                      <p>
                        Desde já agradecemos sua participação e contribuição. Você teria um resultado já neste formulário, porém a avaliação é feita em duas etapas, onde o formulário é respondido 30 dias após este.
                      </p>
                    </div>

                  )}
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <input type="checkbox" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                  <span>Li e concordo com o Termo de Consentimento</span>
                </label>
                {errors.consent && <div style={{ color: "crimson", marginTop: 6 }}>{errors.consent}</div>}

                <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button className="btn-primary" onClick={() => { if (validarEtapaAtual()) setStep(1); }}>Avançar</button>
                </div>
              </>
            )}

            {/* Step 1: dados pessoais */}
            {step === 1 && (
              <>
                <h2>Antes de começar</h2>
                <p style={{ textAlign: "justify" }}>
                  O tempo médio de resposta é de 25 minutos. Suas respostas são anônimas e usadas apenas para fins de pesquisa. Ao final, haverá um campo
                  opcional para deixar apenas o seu primeiro nome e uma forma de contato (e-mail ou WhatsApp) caso concorde em responder um breve questionário
                  em aproximadamente 1 mês.
                </p>
                <p style={{ marginTop: 8, textAlign: "justify" }}>
                  Clique em Avançar para iniciar a parte sociodemográfica.
                </p>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <button className="btn-secondary" onClick={() => setStep(0)}>Voltar</button>
                  <button className="btn-primary" onClick={() => { if (validarEtapaAtual()) setStep(2); }}>Avançar</button>
                </div>
              </>
            )}

            {/* Steps >= 2: question chunks */}
            {step >= 2 && step < etapas.length - 1 && (
              <>
                <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 8 }}>
                  {/* render visible questions in this chunk */}
                  {(etapas[step] || []).filter((q) => isQuestionVisible(q)).length === 0 ? (
                    <div style={{ padding: 8, fontStyle: "italic" }}>Nenhuma pergunta nesta tela — avance para continuar.</div>
                  ) : (
                    (etapas[step] || []).map((q) => renderPergunta(q))
                  )}
                </div>

                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: "#666" }}>{`Tela ${step} de ${etapas.length - 1}`}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-secondary" onClick={handleBack}>Voltar</button>
                    <button className="btn-primary" onClick={handleNext}>Avançar</button>
                  </div>
                </div>
              </>
            )}

            {/* Final step: enviar */}
            {step === etapas.length - 1 && (
              <>
                <h2>Finalizar</h2>
                <p style={{ textAlign: "justify" }}>
                  Obrigado! Ao enviar, suas respostas anônimas serão encaminhadas para processamento. Caso concorde em responder um novo questionário daqui
                  aproximadamente 1 mês (duração estimada: 5 minutos), por favor deixe apenas o seu primeiro nome e uma forma de contato (e-mail ou WhatsApp).
                  Este preenchimento é opcional.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <input
                    type="text"
                    placeholder="Primeiro nome (opcional)"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Forma de contato: e-mail ou WhatsApp (opcional)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <button className="btn-secondary" onClick={handleBack}>Voltar</button>
                  <button className="btn-primary" onClick={handleSubmit}>Enviar</button>
                </div>
              </>
            )}
            
          </div>
        </div>
      )}
      {resultado && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Resultado da sua Avaliação</h2>

            <div className="resultado-section">
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {resultado.summaryText}
              </p>
            </div>

            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button className="btn-primary" onClick={() => setResultado(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};  

export default Sd4;
