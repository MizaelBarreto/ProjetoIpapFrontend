// textos das perguntas (base)
export const perguntasMap: Record<string, string> = {
  // ---------------- Demográficas ----------------
  idade: "Idade",
  genero: "Gênero que se identifica",
  cor: "Cor",
  escolaridade: "Nível Educacional",
  area: "Área de formação (se Ensino Superior)",
  estadoCivil: "Estado Civil",
  renda: "Renda Familiar Mensal",
  diagnostico: "Recebeu diagnóstico clínico psicológico, psiquiátrico ou neurológico?",
  diagnosticoDetalhe: "Qual diagnóstico?",
  crime: "Já foi acusado de algum crime?",
  crimeDetalhe: "Qual crime?",
  substancias: "Você já usou alguma substância sem prescrição médica?",
  outrasSubstanciasDetalhe: "Outras substâncias (especificar)",
  substanciasSelecionadas: "Substâncias selecionadas",

  // ---------------- Escala 1-5 (q1..q28) ----------------
  q1: "Não acho inteligente deixar as pessoas conhecerem os meus segredos.",
  q2: "Acredito que as pessoas devem fazer o que for preciso para ganhar o apoio de pessoas importantes.",
  q3: "Evito conflito direto com as pessoas porque elas podem me ser úteis no futuro.",
  q4: "Acho que as pessoas devem se manter reservadas se quiserem alcançar seus objetivos.",
  q5: "Acredito que para manipular uma situação é necessário planejamento.",
  q6: "Bajulação é uma boa maneira de conquistar as pessoas para o seu lado.",
  q7: "Adoro quando um plano feito com 'jeitinho' tem sucesso.",
  q8: "As pessoas me vêem como uma pessoa que lidera com facilidade.",
  q9: "Eu tenho um talento para convencer as pessoas.",
  q10: "Atividades em grupo geralmente são chatas se eu não estiver presente.",
  q11: "Sei que sou especial porque as pessoas sempre me dizem isso.",
  q12: "Tenho algumas qualidades extraordinárias.",
  q13: "É provável que no futuro eu seja famoso em alguma área.",
  q14: "Gosto de me exibir de vez em quando.",
  q15: "As pessoas frequentemente dizem que eu estou descontrolado.",
  q16: "Tenho a tendência de bater de frente com as autoridades, desrespeitando suas regras.",
  q17: "Já me envolvi em mais conflitos do que a maioria das pessoas da minha idade e gênero.",
  q18: "Eu tenho a tendência de fazer primeiro e pensar depois.",
  q19: "Já tive problemas com a justiça.",
  q20: "Às vezes, me envolvo em situações perigosas.",
  q21: "As pessoas que me causam problemas sempre se arrependem.",
  q22: "Gosto de assistir uma briga de rua.",
  q23: "Gosto muito de assistir filmes e esportes violentos.",
  q24: "Acho engraçado quando pessoas babacas se dão mal.",
  q25: "Gosto de jogar videogames/jogos violentos.",
  q26: "Acho que algumas pessoas merecem sofrer.",
  q27: "Já disse coisas maldosas na internet só por diversão.",
  q28: "Sei como machucar as pessoas somente com palavras.",

  // ---------------- Escala 1-7 (q7_1..q7_18) ----------------
  q7_1: "Fui propositalmente maldoso(a) com outras pessoas no ensino médio.",
  q7_2: "Gosto de machucar fisicamente as pessoas.",
  q7_3: "Já dominei outras pessoas usando medo.",
  q7_4: "Às vezes dou replay em minhas cenas favoritas de filmes sangrentos de terror.",
  q7_5: "Gosto de fazer piadas às custas dos outros.",
  q7_6: "Em jogos de videogame, gosto do realismo dos jorros de sangue.",
  q7_7: "Já enganei alguém e ri quando pareceram tolos.",
  q7_8: "Gosto de atormentar pessoas.",
  q7_9: "Gosto de assistir lutas de ringue (MMA, UFC).",
  q7_10: "Eu gosto de machucar (ou fingir que vou machucar) meu parceiro(a) durante o sexo.",
  q7_11: "Eu gosto de ter o papel de vilão em jogos e torturar os outros personagens.",
  q7_12: "Quando tiro sarro de alguém, acho especialmente divertido se eles percebem.",
  q7_13: "Em corridas profissionais de carros, os acidentes são as partes que eu mais gosto.",
  q7_14: "Talvez eu não deveria, mas nunca me canso de zombar de alguns colegas.",
  q7_15: "Eu jamais humilharia alguém de propósito.",
  q7_16: "Eu tenho o direito de empurrar as pessoas.",
  q7_17: "Adoro assistir vídeos de pessoas brigando na internet.",
  q7_18: "Esportes são violentos demais.",

  // ---------------- Escala 0-4 (q0_1..q0_18) ----------------
  q0_1: "Sei o que fazer para que as pessoas se sintam bem.",
  q0_2: "Sou competente para analisar problemas por diferentes ângulos.",
  q0_3: "Coisas boas me aguardam no futuro.",
  q0_4: "Consigo encontrar em minha vida motivos para ser grato(a).",
  q0_5: "Acredito em uma força sagrada que nos liga um ao outro.",
  q0_6: "Crio coisas úteis.",
  q0_7: "Sou uma pessoa verdadeira.",
  q0_8: "Consigo criar um bom ambiente nos grupos que trabalho.",
  q0_9: "Enfrento perigos para fazer o bem.",
  q0_10: "Sei admirar a beleza que existe no mundo.",
  q0_11: "Não perco as oportunidades que tenho para aprender coisas novas.",
  q0_12: "Sou uma pessoa que tem humildade.",
  q0_13: "Eu me sinto cheio(a) de vida.",
  q0_14: "Tenho facilidade para organizar trabalhos em grupos.",
  q0_15: "Consigo ajudar pessoas a se entenderem quando há uma discussão.",
  q0_16: "Tenho facilidade para fazer uma situação chata se tornar divertida.",
  q0_17: "Costumo tomar decisões quando estou ciente das consequências.",
  q0_18: "Sou uma pessoa justa.",

  // ---------------- Big Five ----------------
  big1: "É conversador, comunicativo.",
  big2: "Gosta de cooperar com os outros.",
  big3: "É original, tem sempre novas ideias.",
  big4: "É inventivo, criativo.",
  big5: "É prestativo e ajuda os outros.",
  big6: "Faz as coisas com eficiência.",
  big7: "É sociável, extrovertido.",
  big8: "É um trabalhador de confiança.",
  big9: "Fica tenso com frequência.",
  big10: "Fica nervoso facilmente.",

  // ---------------- Substâncias (ASSIST) - rótulos resumidos ----------------
  Q1: "Álcool - Frequência de uso (3 meses)",
  AA1: "Álcool - Forte desejo/urgência",
  AK1: "Álcool - Problemas relacionados ao uso",
  AU1: "Álcool - Preocupação de outros",
  BE1: "Álcool - Falhas em obrigações",
  BO1: "Álcool - Tentou reduzir/controle",

  P1: "Tabaco - Frequência de uso (3 meses)",
  Z1: "Tabaco - Forte desejo/urgência",
  AJ1: "Tabaco - Problemas relacionados ao uso",
  AT1: "Tabaco - Preocupação de outros",
  BD1: "Tabaco - Falhas em obrigações",
  BN1: "Tabaco - Tentou reduzir/controle",

  R1: "Maconha - Frequência de uso (3 meses)",
  AB1: "Maconha - Forte desejo/urgência",
  AL1: "Maconha - Problemas relacionados ao uso",
  AV1: "Maconha - Preocupação de outros",
  BF1: "Maconha - Falhas em obrigações",
  BP1: "Maconha - Tentou reduzir/controle",
  S1: "Cocaína - Frequência de uso (3 meses)",
  AC1: "Cocaína - Forte desejo/urgência",
  AM1: "Cocaína - Problemas relacionados ao uso",
  AW1: "Cocaína - Preocupação de outros",
  BG1: "Cocaína - Falhas em obrigações",
  BQ1: "Cocaína - Tentou reduzir/controle",

  T1: "Anfetaminas/êxtase - Frequência de uso (3 meses)",
  AD1: "Anfetaminas/êxtase - Forte desejo/urgência",
  AN1: "Anfetaminas/êxtase - Problemas relacionados ao uso",
  AX1: "Anfetaminas/êxtase - Preocupação de outros",
  BH1: "Anfetaminas/êxtase - Falhas em obrigações",
  BR1: "Anfetaminas/êxtase - Tentou reduzir/controle",

  U1: "Inalantes - Frequência de uso (3 meses)",
  AE1: "Inalantes - Forte desejo/urgência",
  AO1: "Inalantes - Problemas relacionados ao uso",
  AY1: "Inalantes - Preocupação de outros",
  BI1: "Inalantes - Falhas em obrigações",
  BS1: "Inalantes - Tentou reduzir/controle",

  V1: "Hipnóticos/sedativos - Frequência de uso (3 meses)",
  AF1: "Hipnóticos/sedativos - Forte desejo/urgência",
  AP1: "Hipnóticos/sedativos - Problemas relacionados ao uso",
  AZ1: "Hipnóticos/sedativos - Preocupação de outros",
  BJ1: "Hipnóticos/sedativos - Falhas em obrigações",
  BT1: "Hipnóticos/sedativos - Tentou reduzir/controle",

  W1: "Alucinógenos - Frequência de uso (3 meses)",
  AG1: "Alucinógenos - Forte desejo/urgência",
  AQ1: "Alucinógenos - Problemas relacionados ao uso",
  BA1: "Alucinógenos - Preocupação de outros",
  BL1: "Alucinógenos - Falhas em obrigações",
  BU1: "Alucinógenos - Tentou reduzir/controle",

  X1: "Opioides - Frequência de uso (3 meses)",
  AH1: "Opioides - Forte desejo/urgência",
  AR1: "Opioides - Problemas relacionados ao uso",
  BB1: "Opioides - Preocupação de outros",
  BM1: "Opioides - Falhas em obrigações",
  BV1: "Opioides - Tentou reduzir/controle",

  BX1: "Uso injetável - Alguma vez na vida (pontuar conforme instrumento)",

  // final text
  final_text: "Texto final: agradecimento e explicação."
};

// --------------------
// Códigos da planilha (conformes backend) -> mapeamento automático
// adicione / ajuste se o backend usar códigos diferentes
const SD4_CODES = [
  "BY","BZ","CA","CB","CC","CD","CE",
  "CF","CG","CH","CI","CJ","CK","CL",
  "CM","CN","CO","CP","CQ","CR","CS",
  "CT","CU","CV","CW","CX","CY","CZ"
];

const FORCAS_CODES = [
  "DU","DV","DW","EB","EC","EE",
  "DS","DT","DX","DY","DZ","ED","EF","EG","EH","EI","EJ","EK"
];

const SUBSTANCIAS_CODES = [
  "Q1","AA1","AK1","AU1","BE1","BO1",
  "P1","Z1","AJ1","AT1","BD1","BN1",
  "R1","AB1","AL1","AV1","BF1","BP1"
];

// aplica mapeamento automático (se não houver sobreposição)
(() => {
  SD4_CODES.forEach((code, idx) => {
    const qKey = `q${idx + 1}`; // q1..q28
    if (!(code in perguntasMap) && perguntasMap[qKey]) perguntasMap[code] = perguntasMap[qKey];
  });

  FORCAS_CODES.forEach((code, idx) => {
    const qKey = `q7_${idx + 1}`; // q7_1..q7_18
    if (!(code in perguntasMap) && perguntasMap[qKey]) perguntasMap[code] = perguntasMap[qKey];
  });

  // Não mapear substâncias para q0_* — já definimos rótulos específicos acima

  // mapeia variações maiúsculas/minúsculas usadas na planilha
  const aliases: Record<string, string> = {
    Cor: "cor",
    Idade: "idade",
    "Área": "area",
    "Nível": "escolaridade"
  };
  Object.entries(aliases).forEach(([alias, key]) => {
    if (!(alias in perguntasMap) && perguntasMap[key]) perguntasMap[alias] = perguntasMap[key];
  });
})();

// export (nome usado no frontend)
export default perguntasMap;
