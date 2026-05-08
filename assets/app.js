const STORAGE_KEY = "ApoioBusinessCentral.kb.v2";
const ROLE_KEY = "ApoioBusinessCentral.role.v2";
const ADMIN_UNLOCK_KEY = "ApoioBusinessCentral.kbAdminUnlocked.v2";
const CONFIG_PASSWORD = "ApoioBC2026";
const SUPPORT_EMAIL = "suporteit@quilaban.pt";

function getKb() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.articles)) return parsed.articles;
    } catch (error) {
      console.warn("Erro a ler KB local:", error);
    }
  }
  return Array.isArray(window.ABC_KB) ? window.ABC_KB : [];
}

function saveKb(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles, null, 2));
}

function resetKb() {
  localStorage.removeItem(STORAGE_KEY);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenize(text) {
  const stop = new Set([
    "para","com","sem","uma","uns","das","dos","que","por","como","sobre",
    "este","esta","isto","mais","menos","não","nao","tenho","preciso",
    "conseguir","consigo","erro","problema","questao","questão","no","na",
    "nos","nas","de","da","do","e","o","a","os","as","ao","em","um"
  ]);

  return normalize(text)
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 2 && !stop.has(t));
}

function articleText(article) {
  return [
    article.id,
    article.title,
    article.category,
    article.problem,
    article.diagnosis,
    article.cause,
    article.solution,
    article.steps,
    article.validation,
    article.notes
  ].join(" ");
}

function searchArticles(query, role) {
  const tokens = tokenize(query);
  if (!tokens.length) return [];

  const visibleArticles = getKb().filter(article => role === "agent" ? article.agent : article.user);

  return visibleArticles
    .map(article => {
      const title = normalize(article.title);
      const category = normalize(article.category);
      const problem = normalize(article.problem);
      const diagnosis = normalize(article.diagnosis);
      const solution = normalize(article.solution);
      const steps = normalize(article.steps);
      const body = normalize(articleText(article));
      let score = 0;

      for (const token of tokens) {
        if (title.includes(token)) score += 9;
        if (category.includes(token)) score += 5;
        if (problem.includes(token)) score += 7;
        if (diagnosis.includes(token)) score += 4;
        if (solution.includes(token)) score += 7;
        if (steps.includes(token)) score += 4;
        if (body.includes(token)) score += 1;
      }

      const confidence = Math.min(100, Math.round((score / Math.max(8, tokens.length * 8)) * 100));
      return { article, score, confidence };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || b.confidence - a.confidence)
    .slice(0, 8);
}

function markdownToHtml(md) {
  if (!md) return "";
  const lines = String(md).split("\n");
  let output = "";
  let listType = "";

  function closeList() {
    if (listType) {
      output += `</${listType}>`;
      listType = "";
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    const numbered = line.match(/^\d+\.\s+(.+)/);
    const bullet = line.match(/^[-•]\s+(.+)/);

    if (numbered) {
      if (listType !== "ol") {
        closeList();
        output += "<ol>";
        listType = "ol";
      }
      output += `<li>${escapeHtml(numbered[1])}</li>`;
      continue;
    }

    if (bullet) {
      if (listType !== "ul") {
        closeList();
        output += "<ul>";
        listType = "ul";
      }
      output += `<li>${escapeHtml(bullet[1])}</li>`;
      continue;
    }

    closeList();

    if (line.startsWith("### ")) {
      output += `<h4>${escapeHtml(line.replace("### ", ""))}</h4>`;
    } else {
      output += `<p>${escapeHtml(line)}</p>`;
    }
  }

  closeList();
  return output;
}

function roleFromStorage() {
  return localStorage.getItem(ROLE_KEY) || "user";
}

function roleLabel(role) {
  return role === "agent" ? "Agente" : "Utilizador";
}

function setRole(role) {
  localStorage.setItem(ROLE_KEY, role);
  renderMain();
}

function currentQuery() {
  const input = document.getElementById("searchInput");
  return input ? input.value.trim() : "";
}

function currentSupportDetail() {
  const input = document.getElementById("supportDetail");
  return input ? input.value.trim() : "";
}

function buildMailto() {
  const query = currentQuery();
  const detail = currentSupportDetail();
  const subject = encodeURIComponent(`Pedido de apoio Business Central${query ? " - " + query.slice(0, 70) : ""}`);
  const body = encodeURIComponent(
`Olá,

Preciso de apoio com o seguinte tema no Business Central:

Questão / problema:
${query || "[descrever problema]"}

Detalhe adicional:
${detail || "[adicionar contexto, passos, documento BC, mensagem de erro ou impacto operacional]"}

Tentei pesquisar na ApoioBusinessCentral mas não consegui resolver.

Nota: se existir imagem/print do erro, segue em anexo neste email.

Obrigado.`
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

function refreshSupportMailLink() {
  const mail = document.getElementById("supportMail");
  if (mail) mail.href = buildMailto();
}

function renderMain() {
  const root = document.getElementById("app");
  if (!root) return;

  const role = roleFromStorage();
  const kb = getKb();
  const visibleCount = kb.filter(article => role === "agent" ? article.agent : article.user).length;

  root.innerHTML = `
    <section class="hero-card">
      <div class="hero-top">
        <div class="hero-title">
          <h2>Como podemos ajudar?</h2>
          <p>Encontra respostas na base de conhecimento ou entra em contacto com o suporte.</p>
        </div>

        <div>
          <div class="role-selector">
            <button class="${role === "user" ? "active" : ""}" onclick="setRole('user')">Sou utilizador</button>
            <button class="${role === "agent" ? "active" : ""}" onclick="setRole('agent')">Sou agente</button>
          </div>
          <div class="meta-row">
            <span class="pill ${role === "agent" ? "agent" : "user"}">Perfil: ${roleLabel(role)}</span>
            <span class="pill gray">${visibleCount} artigos disponíveis</span>
          </div>
        </div>
      </div>

      <div class="search-row">
        <div class="search-box">
          <span class="search-symbol">⌕</span>
          <input id="searchInput" class="search-input" autocomplete="off" placeholder="Que problema queres resolver?" oninput="handleSearch()">
        </div>
        <button type="button" onclick="handleSearch()">Pesquisar</button>
      </div>

      <div class="support-card">
        <div class="support-copy">
          <h3>Não encontraste solução?</h3>
          <p>Comunica o problema ao suporte. Podes detalhar melhor a questão e adicionar uma imagem para anexar manualmente ao email.</p>
        </div>

        <div class="support-form">
          <h3>Detalhe adicional</h3>
          <textarea id="supportDetail" class="support-detail" placeholder="Opcional: descreve melhor o problema, passos feitos, documento BC, mensagem de erro ou impacto operacional..." oninput="refreshSupportMailLink()"></textarea>

          <div class="attachment-row">
            <div>
              <input type="file" id="errorImage" accept="image/*" onchange="previewImage(event)">
              <p class="small-note">A imagem deve ser anexada manualmente no email aberto.</p>
            </div>
            <a id="supportMail" class="btn warn" href="${buildMailto()}">Enviar email para suporte</a>
          </div>
          <img id="imagePreview" class="image-preview" alt="Pré-visualização da imagem">
        </div>
      </div>
    </section>

    <section class="content-grid">
      <div class="panel">
        <div class="panel-head">
          <h2>Sugestões para ti</h2>
        </div>
        <div id="results" class="results">
          <div class="empty">Começa a escrever para ver sugestões da base de conhecimento.</div>
        </div>
      </div>

      <div class="panel article-view">
        <div class="panel-head">
          <h2>Artigo selecionado</h2>
          <span class="pill">Base de conhecimento</span>
        </div>
        <div id="articlePanel">
          <div class="empty">Seleciona uma sugestão para ler a solução.</div>
        </div>
      </div>
    </section>
  `;
}

function handleSearch() {
  refreshSupportMailLink();

  const role = roleFromStorage();
  const query = currentQuery();
  const resultsEl = document.getElementById("results");
  const articlePanel = document.getElementById("articlePanel");

  if (!resultsEl || !articlePanel) return;

  if (!query || query.length < 2) {
    resultsEl.innerHTML = `<div class="empty">Começa a escrever para ver sugestões da base de conhecimento.</div>`;
    articlePanel.innerHTML = `<div class="empty">Seleciona uma sugestão para ler a solução.</div>`;
    return;
  }

  const results = searchArticles(query, role);

  if (!results.length) {
    resultsEl.innerHTML = `
      <div class="notice warn">
        Não encontrei uma solução próxima na base de conhecimento para o perfil <strong>${roleLabel(role)}</strong>.
        Revê o detalhe adicional acima e usa o botão de email para encaminhar o tema para o suporte.
      </div>
    `;
    articlePanel.innerHTML = `<div class="empty">Sem artigo selecionado.</div>`;
    return;
  }

  resultsEl.innerHTML = results.map(result => `
    <button type="button" class="result-card" onclick="showArticle('${escapeHtml(result.article.id)}')">
      <div class="result-icon">▤</div>
      <div>
        <h3>${escapeHtml(result.article.title)}</h3>
        <p>${escapeHtml(result.article.category || "Sem categoria")} · ${escapeHtml(result.article.id)}</p>
        <div class="confidence"><div style="width:${result.confidence}%"></div></div>
      </div>
      <div class="chevron">›</div>
    </button>
  `).join("");

  showArticle(results[0].article.id, false);
}

function showArticle(id, scroll = true) {
  const role = roleFromStorage();
  const article = getKb().find(item => item.id === id);
  const panel = document.getElementById("articlePanel");
  if (!article || !panel) return;

  panel.innerHTML = `
    <div class="article-body">
      <h2>${escapeHtml(article.title)}</h2>
      <div class="meta-row">
        <span class="pill gray">${escapeHtml(article.id)}</span>
        <span class="pill">${escapeHtml(article.category || "Sem categoria")}</span>
        ${article.user ? `<span class="pill user">Utilizador</span>` : ""}
        ${article.agent ? `<span class="pill agent">Agente</span>` : ""}
      </div>

      ${sectionHtml("Problema", article.problem)}
      ${sectionHtml("Diagnóstico", article.diagnosis)}
      ${role === "agent" ? sectionHtml("Causa provável", article.cause) : ""}
      ${sectionHtml("Solução", article.solution)}
      ${sectionHtml("Como proceder", article.steps)}
      ${sectionHtml("Validação final", article.validation)}
      ${role === "agent" ? sectionHtml("Notas", article.notes) : ""}

      <div class="actions">
        <a class="btn secondary" href="${buildMailto()}">Ainda preciso de apoio</a>
      </div>
    </div>
  `;

  if (scroll) panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function sectionHtml(title, content) {
  if (!content) return "";
  return `
    <div class="article-section">
      <h3>${escapeHtml(title)}</h3>
      <div>${markdownToHtml(content)}</div>
    </div>
  `;
}

function previewImage(event) {
  const file = event.target.files && event.target.files[0];
  const img = document.getElementById("imagePreview");
  if (!file || !img) return;

  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
    img.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function renderKbAdmin() {
  const root = document.getElementById("kbAdminApp");
  if (!root) return;

  const unlocked = sessionStorage.getItem(ADMIN_UNLOCK_KEY) === "true";

  if (!unlocked) {
    root.innerHTML = `
      <div class="config-layout">
        <div class="config-card">
          <h2>Base de conhecimento</h2>
          <p>Importação e exportação da base de conhecimento ApoioBusinessCentral.</p>

          <label>Password</label>
          <input type="password" id="kbPassword" placeholder="Introduz a password" onkeydown="if(event.key === 'Enter') unlockKbAdmin()">

          <div class="actions">
            <button type="button" onclick="unlockKbAdmin()">Entrar</button>
            <a class="btn secondary" href="index.html">Voltar à pesquisa</a>
          </div>

          <div class="notice warn">
            Em GitHub Pages, esta password é apenas uma proteção simples de interface.
          </div>
        </div>
      </div>
    `;
    return;
  }

  const kb = getKb();
  const userCount = kb.filter(article => article.user).length;
  const agentCount = kb.filter(article => article.agent).length;

  root.innerHTML = `
    <div class="config-layout">
      <div class="config-card">
        <h2>Base de conhecimento</h2>
        <p>Faz download ou upload da base de conhecimento usada na pesquisa.</p>

        <div class="stats">
          <div class="stat"><strong>${kb.length}</strong><span>Artigos totais</span></div>
          <div class="stat"><strong>${userCount}</strong><span>Visíveis a utilizador</span></div>
          <div class="stat"><strong>${agentCount}</strong><span>Visíveis a agente</span></div>
        </div>

        <div class="actions">
          <button type="button" onclick="exportKbJson()">Download JSON</button>
          <button type="button" class="secondary" onclick="exportKbMarkdown()">Download Markdown</button>
          <button type="button" class="danger" onclick="resetKbConfirm()">Repor base original</button>
          <a class="btn secondary" href="index.html">Voltar à pesquisa</a>
        </div>
      </div>

      <div class="config-card">
        <h3>Upload da base de conhecimento</h3>
        <p>Importa um ficheiro JSON exportado anteriormente. A importação substitui a base local deste browser.</p>
        <input type="file" accept="application/json,.json" onchange="importKbFile(this.files[0])">
      </div>

      <div class="config-card">
        <h3>Editor JSON</h3>
        <p>Uso avançado: permite ajustar a base diretamente em JSON.</p>
        <textarea id="kbJson">${escapeHtml(JSON.stringify(kb, null, 2))}</textarea>
        <div class="actions">
          <button type="button" class="ok" onclick="saveManualJson()">Guardar JSON</button>
        </div>
      </div>
    </div>
  `;
}

function unlockKbAdmin() {
  const password = document.getElementById("kbPassword")?.value || "";
  if (password !== CONFIG_PASSWORD) {
    alert("Password incorreta.");
    return;
  }
  sessionStorage.setItem(ADMIN_UNLOCK_KEY, "true");
  renderKbAdmin();
}

function exportKbJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    articles: getKb()
  };
  downloadFile("apoio-business-central-kb.json", JSON.stringify(payload, null, 2), "application/json");
}

function exportKbMarkdown() {
  const markdown = getKb().map(articleToMarkdown).join("\n\n---\n\n");
  downloadFile("apoio-business-central-kb.md", markdown, "text/markdown");
}

function importKbFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const articles = Array.isArray(parsed) ? parsed : parsed.articles;
      if (!Array.isArray(articles)) throw new Error("O ficheiro não contém uma lista de artigos.");
      if (!confirm("Importar esta base vai substituir a base local deste browser. Continuar?")) return;

      saveKb(articles);
      alert("Base importada com sucesso.");
      renderKbAdmin();
    } catch (error) {
      alert("Erro ao importar: " + error.message);
    }
  };
  reader.readAsText(file);
}

function saveManualJson() {
  try {
    const articles = JSON.parse(document.getElementById("kbJson").value);
    if (!Array.isArray(articles)) throw new Error("O JSON tem de ser uma lista de artigos.");
    saveKb(articles);
    alert("Base guardada.");
    renderKbAdmin();
  } catch (error) {
    alert("Erro no JSON: " + error.message);
  }
}

function resetKbConfirm() {
  if (!confirm("Repor a base original incorporada na aplicação?")) return;
  resetKb();
  alert("Base original reposta.");
  renderKbAdmin();
}

function articleToMarkdown(article) {
  return `## ${article.id} — ${article.title}
**Categoria:** ${article.category}
**Disponível para Utilizador:** ${article.user ? "Sim" : "Não"}
**Disponível para Agente:** ${article.agent ? "Sim" : "Não"}

**Problema**
${article.problem || ""}

**Diagnóstico**
${article.diagnosis || ""}

**Causa provável**
${article.cause || ""}

**Solução**
${article.solution || ""}

**Como proceder**
${article.steps || ""}

**Validação final**
${article.validation || ""}

**Notas**
${article.notes || ""}
`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  renderMain();
  renderKbAdmin();
});
