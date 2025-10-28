import React, { useEffect, useState } from "react";
import * as PM from "../perguntasMap";
import { API_URL } from "../api";
const logoUrl = new URL("../assets/logo.png", import.meta.url).href;


type Resposta = {
  id: number;
  nome: string;
  email: string;
  respostas: Record<string, string | number> | null;
  resultado?: any;
};

const perguntasMap: Record<string, string> =
  (PM as any).perguntasMap ?? (PM as any).default ?? (PM as any) ?? {};

const renderCategoryValue = (val: any) => {
  if (val == null) return "Indefinido";
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object") {
    if ("category" in val && (typeof val.category === "string" || typeof val.category === "number"))
      return String(val.category);
    if ("message" in val && (typeof val.message === "string" || typeof val.message === "number"))
      return String(val.message);
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
};

const normalizeResultado = (res: any) => {
  const scores = res?.scores ?? {};
  const rawCategories = res?.categories ?? res?.categoriesMap ?? {};
  const categories: Record<string, string> = {};
  Object.entries(rawCategories || {}).forEach(([k, v]) => {
    categories[k] = renderCategoryValue(v);
  });

  const finalCandidate =
    res?.finalCategory ??
    res?.fatorGeral?.category ??
    (rawCategories?.fatorGeral?.category ?? rawCategories?.fatorGeral) ??
    undefined;

  const finalCategory = finalCandidate != null ? String(finalCandidate) : categories?.fatorGeral ?? "Indefinido";

  return { scores, categories, finalCategory };
};

const Dashboard: React.FC = () => {
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [perguntas, setPerguntas] = useState<string[]>([]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const palette = {
    background: "#ffffff",
    surface: "#033e6f",
    primary: "#033e6f",
    primaryHover: "#0b5ed7",
    text: "#111827",
    muted: "#6b7280",
    controlBg: "#ffffff",
    controlBorder: "#e5e7eb",
    controlText: "#111827",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/respostas`);
        const data = await res.json();

        const rawItems = Array.isArray(data) ? data : data ? [data] : [];

        const normalized = rawItems.map((item: any) => {
          const resultado = normalizeResultado(item.resultado ?? item);
          return {
            id: item.id ?? Math.random(),
            nome: item.nome ?? item.name ?? "Sem nome",
            email: item.email ?? item.mail ?? "",
            respostas: item.respostas ?? item.answers ?? {},
            resultado,
          } as Resposta;
        });

        setRespostas(normalized);

        const allKeys = new Set<string>();
        normalized.forEach((r) => {
          const respObj = r.respostas ?? {};
          Object.keys(respObj).forEach((k) => allKeys.add(k));
        });
        setPerguntas(Array.from(allKeys));
      } catch (err) {
        console.error("Erro ao carregar respostas:", err);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (key: string) => {
    setSelecionadas((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

 const handleExport = async () => {
  try {
    const res = await fetch(`${API_URL}/api/export`);
    if (!res.ok) throw new Error('Falha ao exportar');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "respostas_export_wide.csv";
    a.click();
    URL.revokeObjectURL(url);
    return;
  } catch (err) {
    console.error("Erro no export do backend, aplicando fallback local:", err);
  }
  // Fallback long-format (por compatibilidade)
  const header = ["Nome", "Email", "Pergunta", "Resposta", "Resultado_Final", "Categorias"];
  let csv = header.join(",") + "\n";
  const safe = (s: any) => String(s ?? "").replace(/\"/g, '""');

  respostas.forEach((r) => {
    const respostasObj = r.respostas ?? {};
    const keys = Object.keys(respostasObj);
    const categories = (r.resultado && r.resultado.categories) ? r.resultado.categories : {};
    const detailsStr = Object.entries(categories).map(([k, v]) => `${k}: ${v}`).join(" | ");
    const finalCategory = r.resultado?.finalCategory ?? "Indefinido";
    keys.forEach((k) => {
      const label = perguntasMap[k] ?? k;
      const respVal = safe((respostasObj as any)[k]);
      csv += `"${safe(r.nome)}","${safe(r.email)}","${safe(label)}","${respVal}","${safe(finalCategory)}","${safe(detailsStr)}"\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "respostas.csv";
  a.click();
  URL.revokeObjectURL(url);
};
  return (
  <div style={{ padding: 20, background: palette.background, color: palette.text }}>
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20 }}>
  <img src={logoUrl} alt="Logo" style={{ width: 150, height: 75 }} />
  <h1 style={{ margin: 0, color: "#033e6f" }}>Relatório de Respostas SD4</h1>
  </div>


    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <button
        onClick={() => setShowFilters((s) => !s)}
        style={{
          background: palette.primary,
          border: "none",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 8,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 2px 6px rgba(13,110,253,0.12)",
        }}
        onMouseOver={(e) => ((e.currentTarget.style.background = palette.primaryHover))}
        onMouseOut={(e) => ((e.currentTarget.style.background = palette.primary))}
      >
        Visualizar Dados {showFilters ? "˄" : "˅"}
      </button>

      <button
        onClick={handleExport}
        style={{
          background: palette.primary,
          color: "#fff",
          padding: "10px 14px",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(13,110,253,0.12)",
        }}
        onMouseOver={(e) => ((e.currentTarget.style.background = palette.primaryHover))}
        onMouseOut={(e) => ((e.currentTarget.style.background = palette.primary))}
      >
        Exportar CSV
      </button>
    </div>

    {showFilters && (
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ marginRight: 12, color: palette.text }}>
            <input
              type="checkbox"
              checked={selecionadas.includes("total")}
              onChange={() => {
                if (selecionadas.includes("total")) setSelecionadas([]);
                else setSelecionadas(["total"]);
              }}
              style={{ accentColor: palette.primary }}
            />{" "}
            Visualizar Total
          </label>
        </div>

        <select
          multiple
          size={8}
          value={selecionadas.filter((s) => s !== "total")}
          onChange={(e) => {
            const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
            const keepTotal = selecionadas.includes("total") ? ["total"] : [];
            setSelecionadas([...keepTotal, ...opts]);
          }}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: `1px solid ${palette.controlBorder}`,
            background: palette.controlBg,
            color: palette.controlText,
            outline: "none",
          }}
        >
          {perguntas.map((p) => (
            <option key={p} value={p}>
              {perguntasMap[p] ?? p}
            </option>
          ))}
        </select>

        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button
            onClick={() => setSelecionadas([])}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${palette.controlBorder}`,
              background: palette.surface,
              color: palette.text,
              cursor: "pointer",
            }}
          >
            Limpar
          </button>
          <button
            onClick={() => setSelecionadas([...perguntas])}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${palette.controlBorder}`,
              background: palette.surface,
              color: palette.text,
              cursor: "pointer",
            }}
          >
            Selecionar tudo
          </button>
        </div>
      </div>
    )}

    <div>
      {respostas.map((r) => {
        const resultado = normalizeResultado(r.resultado ?? r);
        const categories = resultado.categories ?? {};
        return (
          <div key={r.id} style={{ border: "1px solid #e6edf3", borderRadius: 8, padding: 12, marginBottom: 12, background: "#fff" }}>
            <p style={{ margin: 0 }}>
              <b>{r.nome}</b> â€” {r.email}
            </p>

            {selecionadas.includes("total") ? (
              <ul>
                {Object.entries(r.respostas ?? {}).map(([k, v]) => (
                  <li key={k}>
                    <b>{perguntasMap[k] ?? k}:</b> {String(v)}
                  </li>
                ))}
              </ul>
            ) : selecionadas.length > 0 ? (
              <ul>
                {selecionadas.map((s) => (
                  <li key={s}>
                    <b>{perguntasMap[s] ?? s}:</b> {String((r.respostas ?? {})[s] ?? "")}
                  </li>
                ))}
              </ul>
            ) : null}

            <p style={{ margin: "8px 0 0 0" }}>
              <b>Resultado Final:</b> {resultado.finalCategory ?? "Indefinido"}
            </p>

            <p style={{ margin: "6px 0 0 0" }}>
              <b>Detalhes:</b>{" "}
              {Object.keys(categories).length === 0 ? (
                <span style={{ color: palette.muted }}>:</span>
              ) : (
                Object.entries(categories).map(([key, value]) => (
                  <span key={key} style={{ marginRight: 10 }}>
                    {key}: {String(value)}
                  </span>
                ))
              )}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);
};
export default Dashboard;


