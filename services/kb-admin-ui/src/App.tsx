import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type Visibility = "Utilizador" | "Agente" | "Interno";

function App() {
  const [title, setTitle] = useState("Novo artigo ApoioBusinessCentral");
  const [category, setCategory] = useState("Integrações");
  const [visibility, setVisibility] = useState<Visibility>("Agente");
  const [problem, setProblem] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [solution, setSolution] = useState("");

  const validations = useMemo(() => {
    return {
      title: title.trim().length >= 8,
      problem: problem.trim().length >= 20,
      diagnosis: diagnosis.trim().length >= 20,
      solution: solution.trim().length >= 20,
    };
  }, [title, problem, diagnosis, solution]);

  const canSubmit = Object.values(validations).every(Boolean);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", maxWidth: 1100, margin: "32px auto", padding: 24 }}>
      <h1>ApoioBusinessCentral — Gestão KB</h1>
      <p>Interface mínima para criar drafts de artigos da KB ApoioBusinessCentral.</p>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <label>Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: 8 }} />

          <label>Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: 8 }}>
            <option>Integrações</option>
            <option>Financeiro e faturação</option>
            <option>Compras</option>
            <option>Vendas</option>
            <option>Logística e armazém</option>
            <option>Dados mestres</option>
            <option>Acesso e permissões</option>
          </select>

          <label>Visibilidade</label>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)} style={{ width: "100%", padding: 8 }}>
            <option>Utilizador</option>
            <option>Agente</option>
            <option>Interno</option>
          </select>

          <label>Problema</label>
          <textarea value={problem} onChange={(e) => setProblem(e.target.value)} style={{ width: "100%", minHeight: 90 }} />

          <label>Diagnóstico</label>
          <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} style={{ width: "100%", minHeight: 90 }} />

          <label>Solução</label>
          <textarea value={solution} onChange={(e) => setSolution(e.target.value)} style={{ width: "100%", minHeight: 90 }} />

          <button disabled={!canSubmit} style={{ marginTop: 16, padding: "10px 16px" }}>
            Guardar draft
          </button>
        </div>

        <div>
          <h2>Validações</h2>
          <ul>
            <li>{validations.title ? "✓" : "!"} Título com tamanho mínimo</li>
            <li>{validations.problem ? "✓" : "!"} Problema preenchido</li>
            <li>{validations.diagnosis ? "✓" : "!"} Diagnóstico preenchido</li>
            <li>{validations.solution ? "✓" : "!"} Solução preenchida</li>
          </ul>

          <h2>Pré-visualização</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 16 }}>
{`# ${title}

## Metadados
- Categoria: ${category}
- Visibilidade: ${visibility}
- Estado: Rascunho

## Problema
${problem}

## Diagnóstico
${diagnosis}

## Solução
${solution}

## Procedimento
1. Validar contexto.
2. Aplicar procedimento.
3. Confirmar resultado.

## Validação final
- Confirmar com utilizador.
- Associar artigo ao ticket, se aplicável.`}
          </pre>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
