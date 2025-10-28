// Mapa de rótulos (frontend) com escapes Unicode para evitar problemas de acentuação em build/deploy
export const perguntasMap: Record<string, string> = {
  // Demográficas
  idade: "Idade",
  genero: "G\u00EAnero que se identifica",
  cor: "Cor",
  escolaridade: "N\u00EDvel Educacional",
  area: "\u00C1rea de forma\u00E7\u00E3o (se Ensino Superior)",
  estadoCivil: "Estado Civil",
  renda: "Renda Familiar Mensal",
  diagnostico: "Voc\u00EA j\u00E1 recebeu algum diagn\u00F3stico cl\u00EDnico psicol\u00F3gico, psiqui\u00E1trico ou neurol\u00F3gico?",
  diagnosticoDetalhe: "Se sim, qual diagn\u00F3stico?",
  crime: "J\u00E1 foi acusado de algum crime?",
  crimeDetalhe: "Qual crime?",
  substancias: "Voc\u00EA j\u00E1 usou alguma subst\u00E2ncia sem prescri\u00E7\u00E3o m\u00E9dica?",
  substanciasSelecionadas: "Subst\u00E2ncias selecionadas",
  outrasSubstanciasDetalhe: "Outras subst\u00E2ncias (especificar)",

  // SD4 q1..q28 (rótulos resumidos e legíveis)
  q1: "N\u00E3o acho inteligente revelar meus segredos.",
  q2: "Fa\u00E7o o necess\u00E1rio para apoio de pessoas importantes.",
  q3: "Evito conflito direto pensando no futuro.",
  q4: "Manter-se reservado ajuda a atingir objetivos.",
  q5: "Manipular exige planejamento.",
  q6: "Bajula\u00E7\u00E3o conquista pessoas.",
  q7: "Gosto quando um plano com jeitinho d\u00E1 certo.",
  q8: "Tendo a liderar com facilidade.",
  q9: "Tenho talento para convencer pessoas.",
  q10: "Grupo \u00E9 chato se eu n\u00E3o estiver.",
  q11: "Dizem que sou especial.",
  q12: "Tenho qualidades extraordin\u00E1rias.",
  q13: "Prov\u00E1vel que eu seja famoso no futuro.",
  q14: "Gosto de me exibir \u00E0s vezes.",
  q15: "Dizem que fico descontrolado.",
  q16: "Bato de frente com autoridades.",
  q17: "Tenho mais conflitos que a maioria.",
  q18: "Fa\u00E7o primeiro, penso depois.",
  q19: "J\u00E1 tive problemas com a justi\u00E7a.",
  q20: "\u00C0s vezes me envolvo em situa\u00E7\u00F5es perigosas.",
  q21: "Quem me causa problema se arrepende.",
  q22: "Gosto de assistir briga de rua.",
  q23: "Gosto de filmes e esportes violentos.",
  q24: "Acho engra\u00E7ado quando 'babacas' se d\u00E3o mal.",
  q25: "Gosto de jogos violentos.",
  q26: "Algumas pessoas merecem sofrer.",
  q27: "J\u00E1 disse coisas maldosas na internet.",
  q28: "Sei como machucar com palavras.",

  // Forças (q7_1..q7_18) - resumidos
  q7_1: "Fui propositalmente maldoso(a) no ensino m\u00E9dio.",
  q7_2: "Gosto de machucar fisicamente.",
  q7_3: "Dominei outros usando medo.",
  q7_4: "Revejo cenas sangrentas de terror.",
  q7_5: "Fa\u00E7o piadas \u00E0s custas de outros.",
  q7_6: "Gosto do realismo do sangue em jogos.",
  q7_7: "Enganei algu\u00E9m e ri disso.",
  q7_8: "Gosto de atormentar pessoas.",
  q7_9: "Gosto de assistir lutas (MMA, UFC).",
  q7_10: "Machucar (ou fingir) parceiro(a) no sexo.",
  q7_11: "Gosto de ser vil\u00E3o e torturar em jogos.",
  q7_12: "Tirar sarro \u00E9 divertido quando percebem.",
  q7_13: "Acidentes s\u00E3o a parte que mais gosto.",
  q7_14: "Nunca me canso de zombar.",
  q7_15: "Jamais humilharia algu\u00E9m (invertido).",
  q7_16: "Acho que tenho direito de empurrar pessoas.",
  q7_17: "Gosto de v\u00EDdeos de briga.",
  q7_18: "Esportes s\u00E3o violentos demais.",

  // Big5 (curto)
  big1: "\u00C9 conversador, comunicativo.",
  big2: "Gosta de cooperar.",
  big3: "\u00C9 original, tem novas ideias.",
  big4: "\u00C9 inventivo, criativo.",
  big5: "\u00C9 prestativo e ajuda.",
  big6: "Faz as coisas com efici\u00EAncia.",
  big7: "\u00C9 soci\u00E1vel, extrovertido.",
  big8: "Trabalhador de confian\u00E7a.",
  big9: "Fica tenso com frequ\u00EAncia.",
  big10: "Fica nervoso facilmente.",

  // Substâncias (ASSIST)
  Q1: "\u00C1lcool - Frequ\u00EAncia (3m)", AA1: "\u00C1lcool - Desejo", AK1: "\u00C1lcool - Problemas",
  AU1: "\u00C1lcool - Preocupa\u00E7\u00E3o", BE1: "\u00C1lcool - Falhas", BO1: "\u00C1lcool - Reduzir",
  P1: "Tabaco - Frequ\u00EAncia (3m)", Z1: "Tabaco - Desejo", AJ1: "Tabaco - Problemas",
  AT1: "Tabaco - Preocupa\u00E7\u00E3o", BD1: "Tabaco - Falhas", BN1: "Tabaco - Reduzir",
  R1: "Maconha - Frequ\u00EAncia (3m)", AB1: "Maconha - Desejo", AL1: "Maconha - Problemas",
  AV1: "Maconha - Preocupa\u00E7\u00E3o", BF1: "Maconha - Falhas", BP1: "Maconha - Reduzir",
  S1: "Coca\u00EDna - Frequ\u00EAncia (3m)", AC1: "Coca\u00EDna - Desejo", AM1: "Coca\u00EDna - Problemas",
  AW1: "Coca\u00EDna - Preocupa\u00E7\u00E3o", BG1: "Coca\u00EDna - Falhas", BQ1: "Coca\u00EDna - Reduzir",
  T1: "Anfetaminas/\u00EAxtase - Frequ\u00EAncia (3m)", AD1: "Anfetaminas/\u00EAxtase - Desejo", AN1: "Anfetaminas/\u00EAxtase - Problemas",
  AX1: "Anfetaminas/\u00EAxtase - Preocupa\u00E7\u00E3o", BH1: "Anfetaminas/\u00EAxtase - Falhas", BR1: "Anfetaminas/\u00EAxtase - Reduzir",
  U1: "Inalantes - Frequ\u00EAncia (3m)", AE1: "Inalantes - Desejo", AO1: "Inalantes - Problemas",
  AY1: "Inalantes - Preocupa\u00E7\u00E3o", BI1: "Inalantes - Falhas", BS1: "Inalantes - Reduzir",
  V1: "Hipn\u00F3ticos/sedativos - Frequ\u00EAncia (3m)", AF1: "Hipn\u00F3ticos/sedativos - Desejo", AP1: "Hipn\u00F3ticos/sedativos - Problemas",
  AZ1: "Hipn\u00F3ticos/sedativos - Preocupa\u00E7\u00E3o", BJ1: "Hipn\u00F3ticos/sedativos - Falhas", BT1: "Hipn\u00F3ticos/sedativos - Reduzir",
  W1: "Alucin\u00F3genos - Frequ\u00EAncia (3m)", AG1: "Alucin\u00F3genos - Desejo", AQ1: "Alucin\u00F3genos - Problemas",
  BA1: "Alucin\u00F3genos - Preocupa\u00E7\u00E3o", BL1: "Alucin\u00F3genos - Falhas", BU1: "Alucin\u00F3genos - Reduzir",
  X1: "Opioides - Frequ\u00EAncia (3m)", AH1: "Opioides - Desejo", AR1: "Opioides - Problemas",
  BB1: "Opioides - Preocupa\u00E7\u00E3o", BM1: "Opioides - Falhas", BV1: "Opioides - Reduzir",
  BX1: "Uso injet\u00E1vel - Alguma vez na vida",
};

// Complementa rótulos para códigos da planilha (BY..CZ, DU..EK) a partir dos rótulos base (q1.., q7_..)
(() => {
  const SD4_CODES = [
    "BY","BZ","CA","CB","CC","CD","CE","CF","CG","CH","CI","CJ","CK","CL","CM","CN","CO","CP","CQ","CR","CS","CT","CU","CV","CW","CX","CY","CZ"
  ];
  const FORCAS_CODES = [
    "DU","DV","DW","EB","EC","EE","DS","DT","DX","DY","DZ","ED","EF","EG","EH","EI","EJ","EK"
  ];

  SD4_CODES.forEach((code, idx) => {
    const qKey = `q${idx + 1}`;
    if (!(code in perguntasMap) && perguntasMap[qKey]) perguntasMap[code] = perguntasMap[qKey];
  });
  FORCAS_CODES.forEach((code, idx) => {
    const qKey = `q7_${idx + 1}`;
    if (!(code in perguntasMap) && perguntasMap[qKey]) perguntasMap[code] = perguntasMap[qKey];
  });
})();

export default perguntasMap;

