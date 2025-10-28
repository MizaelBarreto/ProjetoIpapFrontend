// Sd4.tsx
import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import { API_URL } from "../api";
const logoUrl = new URL("../assets/logo.png", import.meta.url).href;

type TipoPergunta = "radio" | "escala1a5" | "escala1a7" | "escala0a4" | "texto" | "big5" | "intro" | "checkboxes";
type Pergunta = {
  key: string;
  texto: string;
  tipo: TipoPergunta;
  opcoes?: string[];
  instrucoes?: string;
};

const CHUNK_SIZE = 2; // duas perguntas por pop-up


const encouragingMessages = [
  "Quase lÃ¡ â€” curioso para o resultado?",
  "Cada vez mais curioso com as perguntas, nÃ©? TÃ¡ quase!",
  "Cada passo conta â€” vocÃª estÃ¡ indo muito bem!",
  "Quase lÃ¡! Continua assim que jÃ¡ jÃ¡ temos o resultado."
];

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

  // ---------------------------
  // Flat questions + intros (completo)
  // ---------------------------
  const flatQuestions: Pergunta[] = useMemo(() => {
    // Bloco de perguntas de substÃ¢ncias (ASSIST) â€” mostrado apenas se "substancias" === "Sim"
    const substGroups: { name: string; codes: string[] }[] = [
      { name: "Ãlcool", codes: ["Q1","AA1","AK1","AU1","BE1","BO1"] },
      { name: "Tabaco", codes: ["P1","Z1","AJ1","AT1","BD1","BN1"] },
      { name: "Maconha", codes: ["R1","AB1","AL1","AV1","BF1","BP1"] },
      { name: "CocaÃ­na", codes: ["S1","AC1","AM1","AW1","BG1","BQ1"] },
      { name: "Anfetaminas/Ãªxtase", codes: ["T1","AD1","AN1","AX1","BH1","BR1"] },
      { name: "Inalantes", codes: ["U1","AE1","AO1","AY1","BI1","BS1"] },
      { name: "HipnÃ³ticos/sedativos", codes: ["V1","AF1","AP1","AZ1","BJ1","BT1"] },
      { name: "AlucinÃ³genos", codes: ["W1","AG1","AQ1","BA1","BL1","BU1"] },
      { name: "Opioides", codes: ["X1","AH1","AR1","BB1","BM1","BV1"] },
      { name: "Uso injetÃ¡vel", codes: ["BX1"] }
    ];
    const substPerguntas: Pergunta[] = [];
    substGroups.forEach((g) => {
      g.codes.forEach((code, idx) => {
        // rÃ³tulos temporÃ¡rios: substituir pelos enunciados exatos do PDF/Excel
        const labels = [
          `${g.name} - FrequÃªncia de uso (3 meses)`,
          `${g.name} - Forte desejo/urgÃªncia`,
          `${g.name} - Problemas relacionados ao uso`,
          `${g.name} - PreocupaÃ§Ã£o de outros`,
          `${g.name} - Falhas em obrigaÃ§Ãµes`,
          `${g.name} - Tentou reduzir/controle`
        ];
        const texto = g.name === "Uso injetÃ¡vel"
          ? `${g.name} - Alguma vez na vida (pontuar conforme instrumento)`
          : (labels[idx] || `${g.name} - Item ${idx + 1}`);
        substPerguntas.push({ key: code, texto, tipo: "escala0a4" });
      });
    });

    const arr: Pergunta[] = [
      // Demografia
      { key: "idade", texto: "Idade", tipo: "radio", opcoes: ["18-   -25", "26â€“ -35", "36â€“ -45", "46+"] },
      { key: "genero", texto: "GÃªnero que se identifica", tipo: "radio", opcoes: ["Mulher", "Homem", "NÃ£o Binarie", "Prefiro nÃ£o dizer", "Outro"] },

      { key: "cor", texto: "Cor", tipo: "radio", opcoes: ["Amarelo", "Branco", "IndÃ­gena", "Pardo", "Preto", "Outro"] },
      { key: "escolaridade", texto: "NÃ­vel Educacional", tipo: "radio", opcoes: ["Ensino MÃ©dio Cursando", "Ensino MÃ©dio Completo", "Ensino Superior Cursando", "Ensino Superior Completo", "Outro"] },
      { key: "area", texto: "Se selecionado Ensino Superior, indique a Ã¡rea:", tipo: "texto" },
      { key: "estadoCivil", texto: "Estado Civil", tipo: "radio", opcoes: ["Solteiro", "Casado", "ViÃºvo", "Outro"] },

      { key: "renda", texto: "Renda Familiar Mensal", tipo: "radio", opcoes: ["AtÃ© 1 salÃ¡rio mÃ­nimo (AtÃ© R$ 1412,00)", "De 1 a 3 salÃ¡rios mÃ­nimos (AtÃ© R$ 4236,00)", "De 3 a 5 salÃ¡rios mÃ­nimos (AtÃ© R$ 7.060,00)", "De 7 a 10 salÃ¡rios (AtÃ© R$ 14.120,00)", "Acima de 10 salÃ¡rios mÃ­nimos"] },
      { key: "diagnostico", texto: "VocÃª jÃ¡ recebeu algum diagnÃ³stico clÃ­nico psicolÃ³gico, psiquiÃ¡trico ou neurolÃ³gico?", tipo: "radio", opcoes: ["Sim", "NÃ£o"] },
      { key: "diagnosticoDetalhe", texto: "Se sim, qual?", tipo: "texto" },
      { key: "crime", texto: "JÃ¡ foi acusado de algum crime?", tipo: "radio", opcoes: ["Sim", "NÃ£o"] },
      { key: "crimeDetalhe", texto: "Se sim, qual?", tipo: "texto" },

      { key: "substancias", texto: "Você já usou alguma substância sem prescrição médica?", tipo: "radio", opcoes: ["Sim", "Não"], instrucoes: `Considere: derivados do tabaco; bebidas alcoólicas; maconha; cocaína; crack; anfetaminas/êxtase; inalantes; hipnóticos/sedativos; alucinógenos; opiáceos/opioides; outras.` },
      { key: "substanciasSelecionadas", texto: "Selecione as substâncias para perguntar detalhes", tipo: "checkboxes", opcoes: ["Álcool","Tabaco","Maconha","Cocaína","Anfetaminas/êxtase","Inalantes","Hipnóticos/sedativos","Alucinógenos","Opioides","Uso injetável","Outras"] },
      { key: "outrasSubstanciasDetalhe", texto: "Outras (especificar)", tipo: "texto" },
      // Bloco condicional de substÃ¢ncias (ASSIST)
      ...substPerguntas,

      // Intro: escala 1-5
      {
        key: "intro_1_5",
        texto:
          "Agora, responda o quanto vocÃª concorda ou nÃ£o com o que estÃ¡ escrito nas prÃ³ximas frases, considerando o que vocÃª pensa ou como age. Use a escala: 1 - Discordo totalmente; 2 - Discordo; 3 - NÃ£o concordo nem discordo; 4 - Concordo; 5 - Concordo totalmente.",
        tipo: "intro"
      },

      // Escala 1-5 (q1 - q28)
      { key: "q1", texto: "1. NÃ£o acho inteligente deixar as pessoas conhecerem os meus segredos.", tipo: "escala1a5" },
      { key: "q2", texto: "2. Acredito que as pessoas devem fazer o que for preciso para ganhar o apoio de pessoas importantes.", tipo: "escala1a5" },
      { key: "q3", texto: "3. Evito conflito direto com as pessoas porque elas podem me ser Ãºteis no futuro.", tipo: "escala1a5" },
      { key: "q4", texto: "4. Acho que as pessoas devem se manter reservadas se quiserem alcanÃ§ar seus objetivos.", tipo: "escala1a5" },

      { key: "q5", texto: "5. Acredito que para manipular uma situaÃ§Ã£o Ã© necessÃ¡rio planejamento.", tipo: "escala1a5" },
      { key: "q6", texto: "6. BajulaÃ§Ã£o Ã© uma boa maneira de conquistar as pessoas para o seu lado.", tipo: "escala1a5" },
      { key: "q7", texto: "7. Adoro quando um plano feito com 'jeitinho' tem sucesso.", tipo: "escala1a5" },
      { key: "q8", texto: "8. As pessoas me vÃªem como uma pessoa que lidera com facilidade.", tipo: "escala1a5" },

      { key: "q9", texto: "9. Eu tenho um talento para convencer as pessoas.", tipo: "escala1a5" },
      { key: "q10", texto: "10. Atividades em grupo geralmente sÃ£o chatas se eu nÃ£o estiver presente.", tipo: "escala1a5" },
      { key: "q11", texto: "11. Sei que sou especial porque as pessoas sempre me dizem isso.", tipo: "escala1a5" },
      { key: "q12", texto: "12. Tenho algumas qualidades extraordinÃ¡rias.", tipo: "escala1a5" },

      { key: "q13", texto: "13. Ã‰ provÃ¡vel que no futuro eu seja famoso em alguma Ã¡rea.", tipo: "escala1a5" },
      { key: "q14", texto: "14. Gosto de me exibir de vez em quando.", tipo: "escala1a5" },
      { key: "q15", texto: "15. As pessoas frequentemente dizem que eu estou descontrolado.", tipo: "escala1a5" },
      { key: "q16", texto: "16. Tenho a tendÃªncia de bater de frente com as autoridades, desrespeitando suas regras.", tipo: "escala1a5" },

      { key: "q17", texto: "17. JÃ¡ me envolvi em mais conflitos do que a maioria das pessoas da minha idade e gÃªnero.", tipo: "escala1a5" },
      { key: "q18", texto: "18. Eu tenho a tendÃªncia de fazer primeiro e pensar depois.", tipo: "escala1a5" },
      { key: "q19", texto: "19. JÃ¡ tive problemas com a justiÃ§a.", tipo: "escala1a5" },
      { key: "q20", texto: "20. Ã€s vezes, me envolvo em situaÃ§Ãµes perigosas.", tipo: "escala1a5" },

      { key: "q21", texto: "21. As pessoas que me causam problemas sempre se arrependem.", tipo: "escala1a5" },
      { key: "q22", texto: "22. Gosto de assistir uma briga de rua.", tipo: "escala1a5" },
      { key: "q23", texto: "23. Gosto muito de assistir filmes e esportes violentos.", tipo: "escala1a5" },
      { key: "q24", texto: "24. Acho engraÃ§ado quando pessoas babacas se dÃ£o mal.", tipo: "escala1a5" },

      { key: "q25", texto: "25. Gosto de jogar videogames/jogos violentos.", tipo: "escala1a5" },
      { key: "q26", texto: "26. Acho que algumas pessoas merecem sofrer.", tipo: "escala1a5" },
      { key: "q27", texto: "27. JÃ¡ disse coisas maldosas na internet sÃ³ por diversÃ£o.", tipo: "escala1a5" },
      { key: "q28", texto: "28. Sei como machucar as pessoas somente com palavras.", tipo: "escala1a5" },

      // Intro: escala 1-7
      {
        key: "intro_1_7",
        texto: "Por favor, avalie sua concordÃ¢ncia usando a escala: 1 - Discordo totalmente; 7 - Concordo totalmente." ,          

        tipo: "intro",
       
      },

      // Escala 1-7 (q7_1..q7_18)
      { key: "q7_1", texto: "1. Fui propositalmente maldoso(a) com outras pessoas no ensino mÃ©dio.", tipo: "escala1a7" },
      { key: "q7_2", texto: "2. Gosto de machucar fisicamente as pessoas", tipo: "escala1a7" },
      { key: "q7_3", texto: "3. JÃ¡ dominei outras pessoas usando medo.", tipo: "escala1a7" },
      { key: "q7_4", texto: "4. Ã€s vezes dou replay (repito) em minhas cenas favoritas de filmes sangrentos de terror.", tipo: "escala1a7" },

      { key: "q7_5", texto: "5. Gosto de fazer piadas Ã s custas dos outros.", tipo: "escala1a7" },
      { key: "q7_6", texto: "6. Em jogos de videogame, gosto do realismo dos jorros de sangue.", tipo: "escala1a7" },
      { key: "q7_7", texto: "7. JÃ¡ enganei alguÃ©m e ri quando pareceram tolos.", tipo: "escala1a7" },
      { key: "q7_8", texto: "8. Gosto de atormentar pessoas.", tipo: "escala1a7" },

      { key: "q7_9", texto: "9. Gosto de assistir lutas de ringue (e.g. MMA, UFC), nas quais os lutadores nÃ£o tÃªm por onde escapar.", tipo: "escala1a7" },
      { key: "q7_10", texto: "10. Eu gosto de machucar (ou fingir que vou machucar) meu parceiro(a) durante o sexo.", tipo: "escala1a7" },
      { key: "q7_11", texto: "11. Eu gosto de ter o papel de vilÃ£o em jogos e torturar os outros personagens.", tipo: "escala1a7" },
      { key: "q7_12", texto: "12. Quando tiro sarro de alguÃ©m, acho especialmente divertido se eles percebem o que estou fazendo.", tipo: "escala1a7" },

      { key: "q7_13", texto: "13. Em corridas profissionais de carros, os acidentes sÃ£o as partes que eu mais gosto.", tipo: "escala1a7" },
      { key: "q7_14", texto: "14. Talvez eu nÃ£o deveria, mas nunca me canso de zombar de alguns colegas.", tipo: "escala1a7" },
      { key: "q7_15", texto: "15. Eu jamais humilharia alguÃ©m de propÃ³sito.", tipo: "escala1a7" },
      { key: "q7_16", texto: "16. Eu tenho o direito de empurrar as pessoas.", tipo: "escala1a7" },

      { key: "q7_17", texto: "17. Adoro assistir vÃ­deos na internet (por exemplo, Youtube, facebook) de pessoas brigando.", tipo: "escala1a7" },
      { key: "q7_18", texto: "18. Esportes sÃ£o violentos demais.", tipo: "escala1a7" },

      // Intro: escala 0-4
      {
        key: "intro_0_4",
        texto:
          "A seguir leia cada uma e decida o quanto cada item se assemelha a vocÃª: 0 - Nada a ver comigo; 1 - Um pouco a ver comigo; 2 - Mais ou menos; 3 - Muito a ver comigo; 4 - Tudo a ver comigo.",
        tipo: "intro"
      },

      // Escala 0-4 (q0_1..q0_18)
      { key: "q0_1", texto: "1. Sei o que fazer para que as pessoas se sintam bem.", tipo: "escala0a4" },
      { key: "q0_2", texto: "2. Sou competente para analisar problemas por diferentes â€œÃ¢ngulosâ€.", tipo: "escala0a4" },
      { key: "q0_3", texto: "3. Coisas boas me aguardam no futuro.", tipo: "escala0a4" },
      { key: "q0_4", texto: "4. Consigo encontrar em minha vida motivos para ser grato(a).", tipo: "escala0a4" },

      { key: "q0_5", texto: "5. Acredito em uma forÃ§a sagrada que nos liga um ao outro.", tipo: "escala0a4" },
      { key: "q0_6", texto: "6. Crio coisas Ãºteis.", tipo: "escala0a4" },
      { key: "q0_7", texto: "7. Sou uma pessoa verdadeira.", tipo: "escala0a4" },
      { key: "q0_8", texto: "8. Consigo criar um bom ambiente nos grupos que trabalho.", tipo: "escala0a4" },

      { key: "q0_9", texto: "9. Enfrento perigos para fazer o bem.", tipo: "escala0a4" },
      { key: "q0_10", texto: "10. Sei admirar a beleza que existe no mundo.", tipo: "escala0a4" },
      { key: "q0_11", texto: "11. NÃ£o perco as oportunidades que tenho para aprender coisas novas.", tipo: "escala0a4" },
      { key: "q0_12", texto: "12. Sou uma pessoa que tem humildade.", tipo: "escala0a4" },

      { key: "q0_13", texto: "13. Eu me sinto cheio(a) de vida.", tipo: "escala0a4" },
      { key: "q0_14", texto: "14. Tenho facilidade para organizar trabalhos em grupos.", tipo: "escala0a4" },
      { key: "q0_15", texto: "15. Consigo ajudar pessoas a se entenderem quando hÃ¡ uma discussÃ£o.", tipo: "escala0a4" },
      { key: "q0_16", texto: "16. Tenho facilidade para fazer uma situaÃ§Ã£o chata se tornar divertida.", tipo: "escala0a4" },

      { key: "q0_17", texto: "17. Costumo tomar decisÃµes quando estou ciente das consequÃªncias dos meus atos.", tipo: "escala0a4" },
      { key: "q0_18", texto: "18. Sou uma pessoa justa.", tipo: "escala0a4" },

      // Intro: Big Five short (legend shown in each option)
      {
        key: "intro_big5",
        texto:
          "A seguir encontram-se algumas caracterÃ­sticas. Para cada item escolha: 1 - Discordo totalmente; 2 - Discordo em parte; 3 - Nem concordo nem discordo; 4 - Concordo em parte; 5 - Concordo totalmente. (As legendas aparecem junto Ã s opÃ§Ãµes.)",
        tipo: "intro"
      },

      // Big5 short (big1..big10)
      {
        key: "big1",
        texto: "1. Ã‰ conversador, comunicativo.",
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
        texto: "3. Ã‰ original, tem sempre novas ideias.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big4",
        texto: "4. Ã‰ inventivo, criativo.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big5",
        texto: "5. Ã‰ prestativo e ajuda os outros.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big6",
        texto: "6. Faz as coisas com eficiÃªncia.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big7",
        texto: "7. Ã‰ sociÃ¡vel, extrovertido.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big8",
        texto: "8. Ã‰ um trabalhador de confianÃ§a.",
        tipo: "big5",
        opcoes: ["1", "2", "3", "4", "5"]
      },
      {
        key: "big9",
        texto: "9. Fica tenso com frequÃªncia.",
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
      { key: "final_text", texto: "Pop up final: explicaÃ§Ã£o e resultados (serÃ¡ calculado no backend). Obrigado por participar!", tipo: "texto" }
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
    return base.concat(questionChunks);
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


  // mapa código -> grupo (para filtrar por seleção do usuário)
  const SUBST_CODE_TO_GROUP: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    const groups = [
      { name: "Álcool", codes: ["Q1","AA1","AK1","AU1","BE1","BO1"] },
      { name: "Tabaco", codes: ["P1","Z1","AJ1","AT1","BD1","BN1"] },
      { name: "Maconha", codes: ["R1","AB1","AL1","AV1","BF1","BP1"] },
      { name: "Cocaína", codes: ["S1","AC1","AM1","AW1","BG1","BQ1"] },
      { name: "Anfetaminas/êxtase", codes: ["T1","AD1","AN1","AX1","BH1","BR1"] },
      { name: "Inalantes", codes: ["U1","AE1","AO1","AY1","BI1","BS1"] },
      { name: "Hipnóticos/sedativos", codes: ["V1","AF1","AP1","AZ1","BJ1","BT1"] },
      { name: "Alucinógenos", codes: ["W1","AG1","AQ1","BA1","BL1","BU1"] },
      { name: "Opioides", codes: ["X1","AH1","AR1","BB1","BM1","BV1"] },
      { name: "Uso injetável", codes: ["BX1"] }
    ];
    groups.forEach((g) => g.codes.forEach((c) => (map[c] = g.name)));
    return map;
  }, []);

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
        const sel = (r["substanciasSelecionadas"] as any) || [];
        return Array.isArray(sel) && sel.includes("Outras");
      }
      default:
        if (SUBST_CODES_SET.has(q.key)) {
          if (r["substancias"] !== "Sim") return false;
          const group = SUBST_CODE_TO_GROUP[q.key];
          const sel = (r["substanciasSelecionadas"] as any) || [];
          if (Array.isArray(sel) && group) return sel.includes(group);
          return true;
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


  // mapa código -> grupo (para filtrar por seleção do usuário)
  const SUBST_CODE_TO_GROUP: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    const groups = [
      { name: "Álcool", codes: ["Q1","AA1","AK1","AU1","BE1","BO1"] },
      { name: "Tabaco", codes: ["P1","Z1","AJ1","AT1","BD1","BN1"] },
      { name: "Maconha", codes: ["R1","AB1","AL1","AV1","BF1","BP1"] },
      { name: "Cocaína", codes: ["S1","AC1","AM1","AW1","BG1","BQ1"] },
      { name: "Anfetaminas/êxtase", codes: ["T1","AD1","AN1","AX1","BH1","BR1"] },
      { name: "Inalantes", codes: ["U1","AE1","AO1","AY1","BI1","BS1"] },
      { name: "Hipnóticos/sedativos", codes: ["V1","AF1","AP1","AZ1","BJ1","BT1"] },
      { name: "Alucinógenos", codes: ["W1","AG1","AQ1","BA1","BL1","BU1"] },
      { name: "Opioides", codes: ["X1","AH1","AR1","BB1","BM1","BV1"] },
      { name: "Uso injetável", codes: ["BX1"] }
    ];
    groups.forEach((g) => g.codes.forEach((c) => (map[c] = g.name)));
    return map;
  }, []);

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
        const sel = (r["substanciasSelecionadas"] as any) || [];
        return Array.isArray(sel) && sel.includes("Outras");
      }
      default:
        if (SUBST_CODES_SET.has(q.key)) {
          if (r["substancias"] !== "Sim") return false;
          const group = SUBST_CODE_TO_GROUP[q.key];
          const sel = (r["substanciasSelecionadas"] as any) || [];
          if (Array.isArray(sel) && group) return sel.includes(group);
          return true;
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
      newErrors.consent = "VocÃª precisa aceitar o termo para continuar.";
    }
    if (step === 1) {
      if (!formData.nome || (formData.nome as string).trim() === "") newErrors.nome = "Nome Ã© obrigatÃ³rio.";
      if (!formData.email || (formData.email as string).trim() === "") newErrors.email = "E-mail Ã© obrigatÃ³rio.";
    }
    // validate visible questions in this step
    const perguntas = etapas[step] || [];
    perguntas.forEach((q) => {
      if (!isQuestionVisible(q)) return;
      const resp = formData.respostas[q.key];
      if (q.tipo === "texto") {
        // only certain text fields are required when visible
        if (q.key === "area" && (formData.respostas["escolaridade"] || "").toString().includes("Ensino Superior")) {
          if (!resp || (resp as string).trim() === "") newErrors[q.key] = "Informe a Ã¡rea de formaÃ§Ã£o.";
        }
        if (q.key === "diagnosticoDetalhe" && formData.respostas["diagnostico"] === "Sim") {
          if (!resp || (resp as string).trim() === "") newErrors[q.key] = "Informe o diagnÃ³stico.";
        }
        if (q.key === "crimeDetalhe" && formData.respostas["crime"] === "Sim") {
          if (!resp || (resp as string).trim() === "") newErrors[q.key] = "Informe o tipo de acusaÃ§Ã£o.";
        }
        if (q.key === "outrasSubstanciasDetalhe") {
          const sel = (formData.respostas["substanciasSelecionadas"] as any) || [];
          if (Array.isArray(sel) && sel.includes("Outras")) {
            if (!resp || (resp as string).trim() === "") newErrors[q.key] = "Especifique as substâncias em Outras.";
          }
        }
      } else {
        if (q.tipo === "checkboxes") {
          if ((formData.respostas["substancias"] === "Sim") && (!Array.isArray(resp) || (resp as any[]).length === 0)) {
            newErrors[q.key] = "Selecione pelo menos uma substância.";
          }
        } else {
          // radio / escalas: required
          if (resp === undefined || resp === "") {
            newErrors[q.key] = "Selecione uma opção.";
          }
        }
      }
      if (typeof resp === "string" && resp.startsWith("Outro:") && resp === "Outro:") {
        newErrors[q.key] = "Preencha o campo 'Outro'.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // handlers
  // ---------------------------
  const handleOpenPopup = () => {
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

  // ---------------------------
  // render individual pergunta
  // ---------------------------
  const renderPergunta = (q: Pergunta) => {
    if (!isQuestionVisible(q)) return null;
    const resp = formData.respostas[q.key];

    // intro screen
    if (q.tipo === "intro") {
      return (
        <div key={q.key} style={{ padding: 8 }}>
          <h3>InstruÃ§Ãµes</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{q.texto}</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>ComeÃ§ar seÃ§Ã£o</button>
          </div>
        </div>
      );
    }

    // visual for question
    return (
      <div key={q.key} style={{ marginBottom: 12, padding: 6 }}>
        {q.instrucoes && <p style={{ fontSize: 13, color: "#444" }}>{q.instrucoes}</p>}
        <div style={{ marginBottom: 6 }}><strong>{q.texto}</strong></div>

        {/* seleção múltipla por checkboxes */}
        {q.tipo === "checkboxes" && q.opcoes && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {q.opcoes.map((op) => {
              const list = (resp as string[]) || [];
              const checked = Array.isArray(list) && list.includes(op);
              return (
                <label key={op} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "4px 0" }}>
                  <span>{op}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const prev = ((formData.respostas[q.key] as string[]) || []).slice();
                      let next: string[];
                      if (e.target.checked) next = Array.from(new Set([...prev, op]));
                      else next = prev.filter((x) => x !== op);
                      handleResposta(q.key, next as any);
                    }}
                  />
                </label>
              );
            })}
          </div>
        )}

        {/* radio / big5 */}

        {/* radio padrÃ£o */}
        {q.tipo === "radio" && q.opcoes && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {q.opcoes.map((op) => (
              <label
                key={op}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 0"
                }}
              >
                <span>{op}</span>
                <input
                  type="radio"
                  name={q.key}
                  value={op}
                  checked={resp === op}
                  onChange={() => handleResposta(q.key, op)}
                />
              </label>
            ))}
          </div>
        )}

        {/* escala 1-5 */}
          {q.tipo === "escala1a5" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span>{n}</span>
                  <input
                    type="radio"
                    name={q.key}
                    value={n}
                    checked={resp === n}
                    onChange={() => handleResposta(q.key, n)}
                  />
                </label>
              ))}
            </div>
          )}

          {/* escala 1-7 */}
          {q.tipo === "escala1a7" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <label key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span>{n}</span>
                  <input
                    type="radio"
                    name={q.key}
                    value={n}
                    checked={resp === n}
                    onChange={() => handleResposta(q.key, n)}
                  />
                </label>
              ))}
            </div>
          )}

          {/* escala 0-4 */}
          {q.tipo === "escala0a4" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6 }}>
              {[0, 1, 2, 3, 4].map((n) => (
                <label key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span>{n}</span>
                  <input
                    type="radio"
                    name={q.key}
                    value={n}
                    checked={resp === n}
                    onChange={() => handleResposta(q.key, n)}
                  />
                </label>
              ))}
            </div>
          )}

          {/* Big Five horizontal */}
          {q.tipo === "big5" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span>{n}</span>
                  <input
                    type="radio"
                    name={q.key}
                    value={n}
                    checked={resp === n}
                    onChange={() => handleResposta(q.key, n)}
                  />
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
  // encouragement logic: show a message at top every 5 popups (question chunks)
  // ---------------------------
  const questionChunkIndex = Math.max(0, step - 2); // index among questionChunks; step 2 => chunk 0
  const shouldShowEncouragement =
    showPopup && step >= 2 && questionChunkIndex > 0 && questionChunkIndex % 5 === 0 && step < etapas.length - 1;
  const encouragementMessage = encouragingMessages[Math.floor(questionChunkIndex / 5) % encouragingMessages.length];

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
      alert("Erro ao enviar respostas. Verifique a conexÃ£o com o backend.");
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="sd4-wrapper">
      <img src={logoUrl} alt="Logo" className="logo-centered" />
      <h1 className="sd4-title">Quais traÃ§os ocultos moldam sua personalidade?</h1>
      <p className="sd4-text">
        O Short Dark Tetrad (SD4) e instrumentos relacionados visam avaliar traÃ§os de personalidade, atravÃ©s de mÃ©tricas cientÃ­ficas que calculam traÃ§os de sadismo, psicopatia, maquiavelismo e narcisismo. Suas respostas sÃ£o anÃ´nimas e serÃ£o usadas para pesquisa.
      </p>
      <button className="sd4-button" onClick={handleOpenPopup}>Quero descobrir o que hÃ¡ por trÃ¡s da minha personalidade</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box" style={{ maxWidth: 520, width: "95%" }}>
            {/* Encouragement */}
            {shouldShowEncouragement && (
              <div style={{ background: "#eef6ff", padding: 10, borderRadius: 8, marginBottom: 10, textAlign: "center" }}>
                <strong>{encouragementMessage}</strong>
              </div>
            )}

            {/* Step 0: Termo */}
            {step === 0 && (
              <>
                <h2>Termo de Consentimento</h2>
                <div style={{ maxHeight: "40vh", overflowY: "auto", paddingRight: 8 }}>
                  {!mostrarTermoCompleto ? (
                    <>
                      <p>
                        VocÃª estÃ¡ sendo convidado a participar, como voluntÃ¡rio/a, de uma pesquisa sobre diferentes formas de pensar, sentir e agir no dia-a-dia e uso de Ã¡lcool e outras substÃ¢ncias, sob a responsabilidade da PsicÃ³loga Profa. Dra. Ana
                        Cristina Resende (CRP 09/2113), vinculada Ã  PUC GoiÃ¡s. ApÃ³s receber os esclarecimentos e as informaÃ§Ãµes a seguir, no caso de aceitar fazer parte do estudo, favor escolher a opÃ§Ã£o CONCORDO. Caso os resultados desta pesquisa sejam divulgados,
                        a sua identidade NÃƒO serÃ¡ revelada.
                      </p>
                      <p>
                        O objetivo do nosso estudo Ã© a adaptaÃ§Ã£o de uma medida com propriedades cientÃ­ficas adequadas para avaliar caracterÃ­sticas da personalidade no contexto brasileiro para pessoas adultas. Este estudo Ã© realizado online atravÃ©s de um formulÃ¡rio
                        com uma sÃ©rie de perguntas objetivas, que deve durar aproximadamente 20 minutos para concluÃ­-lo, sendo garantidas a seguranÃ§a e a privacidade das suas informaÃ§Ãµes. Sua participaÃ§Ã£o Ã© anÃ´nima, ou seja, nÃ£o pediremos seu nome e nem dados como CPF
                        ou identidade.
                      </p>
                      <p>
                        Nossa equipe de Pesquisadores Ã© composta pelo doutorando Tharmes Chiodarelli C. dos Santos, pela Mestranda Cristina Damasceno, e pelas graduandas Thais Rodrigues do Nascimento Soares, Emanuelle Lima Ramos, Jaciara Chaves dos Reis, LuÃ­sa Libaroni
                        Artiaga e Marcella Martins Dell Isola.
                      </p>
                      <p>
                        Em caso de qualquer dÃºvida sobre a pesquisa, vocÃª poderÃ¡ entrar em contato com os pesquisadores ou o ComitÃª de Ã‰tica em Pesquisa com Seres Humanos da PontifÃ­cia Universidade CatÃ³lica de GoiÃ¡s (CEP - PUC GoiÃ¡s): Doutorando Tharmes Chiodarelli
                        Cambuava dos Santos, (61) 98231-6827, e-mail tharmes24dp@gmail.com, Mestranda Cristina Damasceno (62) 98589-0186, e-mail cristinadge@gmail.com. Pesquisadora responsÃ¡vel Profa. Dra. Ana Cristina Resende (62) 99137-0535, e-mail cristina.psi@pucgoias.edu.br.
                      </p>
                      <p>
                        PontifÃ­cia Universidade CatÃ³lica de GoiÃ¡s Av. UniversitÃ¡ria 1.440, Setor UniversitÃ¡rio CEP: 74605-010 - GoiÃ¢nia, GoiÃ¡s ComitÃª de Ã‰tica de Pesquisa (CEP) (62) 3946-1512, e-mail cep@pucgoias.edu.br, Av. UniversitÃ¡ria, 1069, St. UniversitÃ¡rio,
                        GoiÃ¢nia/GO. Funcionamento: das 08h Ã s 17h, de segunda-feira a sexta-feira.
                      </p>
                      <p>
                        Riscos e benefÃ­cios: Este estudo possui riscos mÃ­nimos para os participantes, pois Ã© possÃ­vel que algumas perguntas do questionÃ¡rio possam causar algum desconforto ou constrangimento, ou que vocÃª se canse. Caso vocÃª se sinta desconfortÃ¡vel, poderÃ¡
                        desistir de participar da pesquisa a qualquer momento, sem nenhum prejuÃ­zo ou penalidade. Se preciso for, os pesquisadores estÃ£o prontos para dar mais informaÃ§Ãµes e apoio psicolÃ³gico. Sua participaÃ§Ã£o Ã© voluntÃ¡ria e nÃ£o hÃ¡ pagamento nem custo
                        para vocÃª. Se houver algum dano decorrente de sua participaÃ§Ã£o no estudo, vocÃª terÃ¡ direito a uma indenizaÃ§Ã£o.
                      </p>
                      <p>
                        Sua ajuda Ã© muito importante para entendermos mais sobre como as pessoas tendem a pensar, sentir e agir. As informaÃ§Ãµes que vocÃª fornecer serÃ£o usadas somente para esta pesquisa e para estudos futuros relacionados. Os resultados ajudarÃ£o em relatÃ³rios
                        cientÃ­ficos e outras publicaÃ§Ãµes.
                      </p>
                      <p>
                        Como parte do processo cientÃ­fico, este estudo tambÃ©m avaliarÃ¡ a estabilidade das respostas ao longo do tempo. Por esse motivo, vocÃª poderÃ¡ ser contatada (o) novamente dentro de um prazo de 30 dias para responder a um dos questionÃ¡rios jÃ¡
                        aplicados. Essa segunda participaÃ§Ã£o tambÃ©m Ã© totalmente voluntÃ¡ria, anÃ´nima e com duraÃ§Ã£o de 5 minutos.
                      </p>
                      <p>
                        O aceite do presente Termo de Consentimento Livre e Esclarecido significa que vocÃª concorda com a participaÃ§Ã£o voluntÃ¡ria na pesquisa e autoriza a coleta dos dados para fins cientÃ­ficos. VocÃª tambÃ©m declara que foi informado sobre os objetivos
                        e os procedimentos desta pesquisa de forma clara e detalhada.
                      </p>
                      <div style={{ marginTop: 8 }}>
                        <button className="btn-link" onClick={() => setMostrarTermoCompleto(true)}>Ler mais</button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p>Desde jÃ¡ agradecemos sua participaÃ§Ã£o e contribuiÃ§Ã£o, voce terÃ¡ um resultado jÃ¡ nesse formulÃ¡rio, porÃ©m a avaliaÃ§Ã£o Ã© feita em duas etapas, onde o formulÃ¡rio Ã© respondido 30 dias apÃ³s esse.</p>
                    </div>
                  )}
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <input type="checkbox" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                  <span>Li e concordo com o Termo de Consentimento</span>
                </label>
                {errors.consent && <div style={{ color: "crimson", marginTop: 6 }}>{errors.consent}</div>}

                <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button className="btn-primary" onClick={() => { if (validarEtapaAtual()) setStep(1); }}>AvanÃ§ar</button>
                </div>
              </>
            )}

            {/* Step 1: dados pessoais */}
            {step === 1 && (
              <>
                <h2>Dados Pessoais</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input type="text" placeholder="Seu nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                  {errors.nome && <div style={{ color: "crimson" }}>{errors.nome}</div>}
                  <input type="email" placeholder="Seu e-mail" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  {errors.email && <div style={{ color: "crimson" }}>{errors.email}</div>}
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <button className="btn-secondary" onClick={() => setStep(0)}>Voltar</button>
                  <button className="btn-primary" onClick={() => { if (validarEtapaAtual()) setStep(2); }}>AvanÃ§ar</button>
                </div>
              </>
            )}

            {/* Steps >= 2: question chunks */}
            {step >= 2 && step < etapas.length - 1 && (
              <>
                <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 8 }}>
                  {/* render visible questions in this chunk */}
                  {(etapas[step] || []).filter((q) => isQuestionVisible(q)).length === 0 ? (
                    <div style={{ padding: 8, fontStyle: "italic" }}>Nenhuma pergunta nesta tela â€” avance para continuar.</div>
                  ) : (
                    (etapas[step] || []).map((q) => renderPergunta(q))
                  )}
                </div>

                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: "#666" }}>{`Tela ${step} de ${etapas.length - 1}`}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-secondary" onClick={handleBack}>Voltar</button>
                    <button className="btn-primary" onClick={handleNext}>AvanÃ§ar</button>
                  </div>
                </div>
              </>
            )}

            {/* Final step: enviar */}
            {step === etapas.length - 1 && (
              <>
                <h2>Finalizar</h2>
                <p>Obrigado! Ao enviar, seus dados serÃ£o encaminhados ao servidor para processamento e cÃ¡lculo das pontuaÃ§Ãµes. As respostas sÃ£o anÃ´nimas.</p>
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
            <h2>Resultado da sua AvaliaÃ§Ã£o</h2>

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

