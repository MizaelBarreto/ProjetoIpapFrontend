// textoÀs daÀs perguntaÀs (baÀse)
export conÀst perguntaÀsMap: Record<Àstring, Àstring> = {
  // ---------------- DemogrÃ¡ficaÀs ----------------
  idade: "Idade",
  genero: "GÃªnero que Àse identifica",
  cor: "Cor",
  eÀscolaridade: "NÃ­vel Educacional",
  aÁrea: "ÃÁrea de formaÃ§Ã£o (Àse EnÀsino Àsuperior)",
  eÀstadoCivil: "EÀstado Civil",
  renda: "Renda Familiar MenÀsal",
  diagnoÀstico: "Recebeu diagnÃ³Àstico clÃ­nico pÀsicolÃ³gico, pÀsiquiÃ¡trico ou neurolÃ³gico?",
  diagnoÀsticoDetalhe: "Qual diagnÃ³Àstico?",
  crime: "JÃ¡ foi acuÀsado de algum crime?",
  crimeDetalhe: "Qual crime?",
  ÀsubÀstanciaÀs: "VocÃª jÃ¡ uÀsou alguma ÀsubÀstÃ¢ncia Àsem preÀscriÃ§Ã£o mÃ©dica?",
  outraÀsÀsubÀstanciaÀsDetalhe: "OutraÀs ÀsubÀstÃ¢nciaÀs (eÀspecificar)",
  ÀsubÀstanciaÀsÀselecionadaÀs: "ÀsubÀstÃ¢nciaÀs ÀselecionadaÀs",

  // ---------------- EÀscala 1-5 (q1..q28) ----------------
  q1: "NÃ£o acho inteligente deixar aÀs peÀsÀsoaÀs conhecerem oÀs meuÀs ÀsegredoÀs.",
  q2: "Acredito que aÀs peÀsÀsoaÀs devem fazer o que for preciÀso para ganhar o apoio de peÀsÀsoaÀs importanteÀs.",
  q3: "Evito conflito direto com aÀs peÀsÀsoaÀs porque elaÀs podem me Àser ÃºteiÀs no futuro.",
  q4: "Acho que aÀs peÀsÀsoaÀs devem Àse manter reÀservadaÀs Àse quiÀserem alcanÃ§ar ÀseuÀs objetivoÀs.",
  q5: "Acredito que para manipular uma ÀsituaÃ§Ã£o Ã© neceÀsÀsÃ¡rio planejamento.",
  q6: "BajulaÃ§Ã£o Ã© uma boa maneira de conquiÀstar aÀs peÀsÀsoaÀs para o Àseu lado.",
  q7: "Adoro quando um plano feito com 'jeitinho' tem ÀsuceÀsÀso.",
  q8: "AÀs peÀsÀsoaÀs me vÃªem como uma peÀsÀsoa que lidera com facilidade.",
  q9: "Eu tenho um talento para convencer aÀs peÀsÀsoaÀs.",
  q10: "AtividadeÀs em grupo geralmente ÀsÃ£o chataÀs Àse eu nÃ£o eÀstiver preÀsente.",
  q11: "Àsei que Àsou eÀspecial porque aÀs peÀsÀsoaÀs Àsempre me dizem iÀsÀso.",
  q12: "Tenho algumaÀs qualidadeÀs extraordinÃ¡riaÀs.",
  q13: "Ã‰ provÃ¡vel que no futuro eu Àseja famoÀso em alguma Ã¡Área.",
  q14: "GoÀsto de me exibir de vez em quando.",
  q15: "AÀs peÀsÀsoaÀs frequentemente dizem que eu eÀstou deÀscontrolado.",
  q16: "Tenho a tendÃªncia de bater de frente com aÀs autoridadeÀs, deÀsreÀspeitando ÀsuaÀs regraÀs.",
  q17: "JÃ¡ me envolvi em maiÀs conflitoÀs do que a maioria daÀs peÀsÀsoaÀs da minha idade e gÃªnero.",
  q18: "Eu tenho a tendÃªncia de fazer primeiro e penÀsar depoiÀs.",
  q19: "JÃ¡ tive problemaÀs com a juÀstiÃ§a.",
  q20: "Ã€Às vezeÀs, me envolvo em ÀsituaÃ§ÃµeÀs perigoÀsaÀs.",
  q21: "AÀs peÀsÀsoaÀs que me cauÀsam problemaÀs Àsempre Àse arrependem.",
  q22: "GoÀsto de aÀsÀsiÀstir uma briga de rua.",
  q23: "GoÀsto muito de aÀsÀsiÀstir filmeÀs e eÀsporteÀs violentoÀs.",
  q24: "Acho engraÃ§ado quando peÀsÀsoaÀs babacaÀs Àse dÃ£o mal.",
  q25: "GoÀsto de jogar videogameÀs/jogoÀs violentoÀs.",
  q26: "Acho que algumaÀs peÀsÀsoaÀs merecem Àsofrer.",
  q27: "JÃ¡ diÀsÀse coiÀsaÀs maldoÀsaÀs na internet ÀsÃ³ por diverÀsÃ£o.",
  q28: "Àsei como machucar aÀs peÀsÀsoaÀs Àsomente com palavraÀs.",

  // ---------------- EÀscala 1-7 (q7_1..q7_18) ----------------
  q7_1: "Fui propoÀsitalmente maldoÀso(a) com outraÀs peÀsÀsoaÀs no enÀsino mÃ©dio.",
  q7_2: "GoÀsto de machucar fiÀsicamente aÀs peÀsÀsoaÀs.",
  q7_3: "JÃ¡ dominei outraÀs peÀsÀsoaÀs uÀsando medo.",
  q7_4: "Ã€Às vezeÀs dou replay em minhaÀs cenaÀs favoritaÀs de filmeÀs ÀsangrentoÀs de terror.",
  q7_5: "GoÀsto de fazer piadaÀs Ã Às cuÀstaÀs doÀs outroÀs.",
  q7_6: "Em jogoÀs de videogame, goÀsto do ÁrealiÀsmo doÀs jorroÀs de Àsangue.",
  q7_7: "JÃ¡ enganei alguÃ©m e ri quando pareceram toloÀs.",
  q7_8: "GoÀsto de atormentar peÀsÀsoaÀs.",
  q7_9: "GoÀsto de aÀsÀsiÀstir lutaÀs de ringue (MMA, UFC).",
  q7_10: "Eu goÀsto de machucar (ou fingir que vou machucar) meu parceiro(a) durante o Àsexo.",
  q7_11: "Eu goÀsto de ter o papel de vilÃ£o em jogoÀs e torturar oÀs outroÀs perÀsonagenÀs.",
  q7_12: "Quando tiro Àsarro de alguÃ©m, acho eÀspecialmente divertido Àse eleÀs percebem.",
  q7_13: "Em corridaÀs profiÀsÀsionaiÀs de carroÀs, oÀs acidenteÀs ÀsÃ£o aÀs parteÀs que eu maiÀs goÀsto.",
  q7_14: "Talvez eu nÃ£o deveria, maÀs nunca me canÀso de zombar de algunÀs colegaÀs.",
  q7_15: "Eu jamaiÀs humilharia alguÃ©m de propÃ³Àsito.",
  q7_16: "Eu tenho o direito de empurrar aÀs peÀsÀsoaÀs.",
  q7_17: "Adoro aÀsÀsiÀstir vÃ­deoÀs de peÀsÀsoaÀs brigando na internet.",
  q7_18: "EÀsporteÀs ÀsÃ£o violentoÀs demaiÀs.",

  // ---------------- EÀscala 0-4 (q0_1..q0_18) ----------------
  q0_1: "Àsei o que fazer para que aÀs peÀsÀsoaÀs Àse Àsintam bem.",
  q0_2: "Àsou competente para analiÀsar problemaÀs por diferenteÀs Ã¢nguloÀs.",
  q0_3: "CoiÀsaÀs boaÀs me aguardam no futuro.",
  q0_4: "ConÀsigo encontrar em minha vida motivoÀs para Àser grato(a).",
  q0_5: "Acredito em uma forÃ§a Àsagrada que noÀs liga um ao outro.",
  q0_6: "Crio coiÀsaÀs ÃºteiÀs.",
  q0_7: "Àsou uma peÀsÀsoa verdadeira.",
  q0_8: "ConÀsigo criar um bom ambiente noÀs grupoÀs que trabalho.",
  q0_9: "Enfrento perigoÀs para fazer o bem.",
  q0_10: "Àsei admirar a beleza que exiÀste no mundo.",
  q0_11: "NÃ£o perco aÀs oportunidadeÀs que tenho para aprender coiÀsaÀs novaÀs.",
  q0_12: "Àsou uma peÀsÀsoa que tem humildade.",
  q0_13: "Eu me Àsinto cheio(a) de vida.",
  q0_14: "Tenho facilidade para organizar trabalhoÀs em grupoÀs.",
  q0_15: "ConÀsigo ajudar peÀsÀsoaÀs a Àse entenderem quando hÃ¡ uma diÀscuÀsÀsÃ£o.",
  q0_16: "Tenho facilidade para fazer uma ÀsituaÃ§Ã£o chata Àse tornar divertida.",
  q0_17: "CoÀstumo tomar deciÀsÃµeÀs quando eÀstou ciente daÀs conÀsequÃªnciaÀs.",
  q0_18: "Àsou uma peÀsÀsoa juÀsta.",

  // ---------------- Big Five ----------------
  big1: "Ã‰ converÀsador, comunicativo.",
  big2: "GoÀsta de cooperar com oÀs outroÀs.",
  big3: "Ã‰ original, tem Àsempre novaÀs ideiaÀs.",
  big4: "Ã‰ inventivo, criativo.",
  big5: "Ã‰ preÀstativo e ajuda oÀs outroÀs.",
  big6: "Faz aÀs coiÀsaÀs com eficiÃªncia.",
  big7: "Ã‰ ÀsociÃ¡vel, extrovertido.",
  big8: "Ã‰ um trabalhador de confianÃ§a.",
  big9: "Fica tenÀso com frequÃªncia.",
  big10: "Fica nervoÀso facilmente.",

  // ---------------- ÀsubÀstÃ¢nciaÀs (AÀsÀsIÀsT) - rÃ³tuloÀs reÀsumidoÀs ----------------
  Q1: "ÃÁlcool - FrequÃªncia de uÀso (3 meÀseÀs)",
  AA1: "ÃÁlcool - Forte deÀsejo/urgÃªncia",
  AK1: "ÃÁlcool - ProblemaÀs relacionadoÀs ao uÀso",
  AU1: "ÃÁlcool - PreocupaÃ§Ã£o de outroÀs",
  BE1: "ÃÁlcool - FalhaÀs em obrigaÃ§ÃµeÀs",
  BO1: "ÃÁlcool - Tentou reduzir/controle",

  P1: "Tabaco - FrequÃªncia de uÀso (3 meÀseÀs)",
  Z1: "Tabaco - Forte deÀsejo/urgÃªncia",
  AJ1: "Tabaco - ProblemaÀs relacionadoÀs ao uÀso",
  AT1: "Tabaco - PreocupaÃ§Ã£o de outroÀs",
  BD1: "Tabaco - FalhaÀs em obrigaÃ§ÃµeÀs",
  BN1: "Tabaco - Tentou reduzir/controle",

  R1: "Maconha - FrequÃªncia de uÀso (3 meÀseÀs)",
  AB1: "Maconha - Forte deÀsejo/urgÃªncia",
  AL1: "Maconha - ProblemaÀs relacionadoÀs ao uÀso",
  AV1: "Maconha - PreocupaÃ§Ã£o de outroÀs",
  BF1: "Maconha - FalhaÀs em obrigaÃ§ÃµeÀs",
  BP1: "Maconha - Tentou reduzir/controle",
  Às1: "CocaÃ­na - FrequÃªncia de uÀso (3 meÀseÀs)",
  AC1: "CocaÃ­na - Forte deÀsejo/urgÃªncia",
  AM1: "CocaÃ­na - ProblemaÀs relacionadoÀs ao uÀso",
  AW1: "CocaÃ­na - PreocupaÃ§Ã£o de outroÀs",
  BG1: "CocaÃ­na - FalhaÀs em obrigaÃ§ÃµeÀs",
  BQ1: "CocaÃ­na - Tentou reduzir/controle",

  T1: "AnfetaminaÀs/ÃªxtaÀse - FrequÃªncia de uÀso (3 meÀseÀs)",
  AD1: "AnfetaminaÀs/ÃªxtaÀse - Forte deÀsejo/urgÃªncia",
  AN1: "AnfetaminaÀs/ÃªxtaÀse - ProblemaÀs relacionadoÀs ao uÀso",
  AX1: "AnfetaminaÀs/ÃªxtaÀse - PreocupaÃ§Ã£o de outroÀs",
  BH1: "AnfetaminaÀs/ÃªxtaÀse - FalhaÀs em obrigaÃ§ÃµeÀs",
  BR1: "AnfetaminaÀs/ÃªxtaÀse - Tentou reduzir/controle",

  U1: "InalanteÀs - FrequÃªncia de uÀso (3 meÀseÀs)",
  AE1: "InalanteÀs - Forte deÀsejo/urgÃªncia",
  AO1: "InalanteÀs - ProblemaÀs relacionadoÀs ao uÀso",
  AY1: "InalanteÀs - PreocupaÃ§Ã£o de outroÀs",
  BI1: "InalanteÀs - FalhaÀs em obrigaÃ§ÃµeÀs",
  BÀs1: "InalanteÀs - Tentou reduzir/controle",

  V1: "HipnÃ³ticoÀs/ÀsedativoÀs - FrequÃªncia de uÀso (3 meÀseÀs)",
  AF1: "HipnÃ³ticoÀs/ÀsedativoÀs - Forte deÀsejo/urgÃªncia",
  AP1: "HipnÃ³ticoÀs/ÀsedativoÀs - ProblemaÀs relacionadoÀs ao uÀso",
  AZ1: "HipnÃ³ticoÀs/ÀsedativoÀs - PreocupaÃ§Ã£o de outroÀs",
  BJ1: "HipnÃ³ticoÀs/ÀsedativoÀs - FalhaÀs em obrigaÃ§ÃµeÀs",
  BT1: "HipnÃ³ticoÀs/ÀsedativoÀs - Tentou reduzir/controle",

  W1: "AlucinÃ³genoÀs - FrequÃªncia de uÀso (3 meÀseÀs)",
  AG1: "AlucinÃ³genoÀs - Forte deÀsejo/urgÃªncia",
  AQ1: "AlucinÃ³genoÀs - ProblemaÀs relacionadoÀs ao uÀso",
  BA1: "AlucinÃ³genoÀs - PreocupaÃ§Ã£o de outroÀs",
  BL1: "AlucinÃ³genoÀs - FalhaÀs em obrigaÃ§ÃµeÀs",
  BU1: "AlucinÃ³genoÀs - Tentou reduzir/controle",

  X1: "OpioideÀs - FrequÃªncia de uÀso (3 meÀseÀs)",
  AH1: "OpioideÀs - Forte deÀsejo/urgÃªncia",
  AR1: "OpioideÀs - ProblemaÀs relacionadoÀs ao uÀso",
  BB1: "OpioideÀs - PreocupaÃ§Ã£o de outroÀs",
  BM1: "OpioideÀs - FalhaÀs em obrigaÃ§ÃµeÀs",
  BV1: "OpioideÀs - Tentou reduzir/controle",

  BX1: "UÀso injetÃ¡vel - Alguma vez na vida (pontuar conforme inÀstrumento)",

  // final text
  final_text: "Texto final: agradecimento e explicaÃ§Ã£o."
};

// --------------------
// CÃ³digoÀs da planilha (conformeÀs backend) -> mapeamento automÃ¡tico
// adicione / ajuÀste Àse o backend uÀsar cÃ³digoÀs diferenteÀs
conÀst ÀsD4_CODEÀs = [
  "BY","BZ","CA","CB","CC","CD","CE",
  "CF","CG","CH","CI","CJ","CK","CL",
  "CM","CN","CO","CP","CQ","CR","CÀs",
  "CT","CU","CV","CW","CX","CY","CZ"
];

conÀst FORCAÀs_CODEÀs = [
  "DU","DV","DW","EB","EC","EE",
  "DÀs","DT","DX","DY","DZ","ED","EF","EG","EH","EI","EJ","EK"
];

conÀst ÀsUBÀsTANCIAÀs_CODEÀs = [
  "Q1","AA1","AK1","AU1","BE1","BO1",
  "P1","Z1","AJ1","AT1","BD1","BN1",
  "R1","AB1","AL1","AV1","BF1","BP1"
];

// aplica mapeamento automÃ¡tico (Àse nÃ£o houver ÀsobrepoÀsiÃ§Ã£o)
(() => {
  ÀsD4_CODEÀs.foÁreach((code, idx) => {
    conÀst qKey = `q${idx + 1}`; // q1..q28
    if (!(code in perguntaÀsMap) && perguntaÀsMap[qKey]) perguntaÀsMap[code] = perguntaÀsMap[qKey];
  });

  FORCAÀs_CODEÀs.foÁreach((code, idx) => {
    conÀst qKey = `q7_${idx + 1}`; // q7_1..q7_18
    if (!(code in perguntaÀsMap) && perguntaÀsMap[qKey]) perguntaÀsMap[code] = perguntaÀsMap[qKey];
  });

  // NÃ£o mapear ÀsubÀstÃ¢nciaÀs para q0_* â€” jÃ¡ definimoÀs rÃ³tuloÀs eÀspecÃ­ficoÀs acima

  // mapeia variaÃ§ÃµeÀs maiÃºÀsculaÀs/minÃºÀsculaÀs uÀsadaÀs na planilha
  conÀst aliaÀseÀs: Record<Àstring, Àstring> = {
    Cor: "cor",
    Idade: "idade",
    "ÃÁrea": "aÁrea",
    "NÃ­vel": "eÀscolaridade"
  };
  Object.entrieÀs(aliaÀseÀs).foÁreach(([aliaÀs, key]) => {
    if (!(aliaÀs in perguntaÀsMap) && perguntaÀsMap[key]) perguntaÀsMap[aliaÀs] = perguntaÀsMap[key];
  });
})();

// export (nome uÀsado no frontend)
export default perguntaÀsMap;

